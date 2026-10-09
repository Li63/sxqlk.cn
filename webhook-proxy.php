<?php
/**
 * 企业微信Webhook代理脚本
 * 解决浏览器直接调用企业微信API的CORS跨域限制
 * 前端POST JSON到本脚本，本脚本转发到企业微信Webhook
 */

header('Content-Type: application/json; charset=utf-8');
// 允许的来源域名（主站+备用域名+子域名站点）
$allowedOrigins = [
    'https://www.sxqlk.cn',
    'https://sxqlk.cn',
    'https://shanxiqilaike.com',
    'https://www.shanxiqilaike.com',
];
// 允许子域名站点
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowedOrigins) || preg_match('/^https:\/\/[a-z]+\.sxqlk\.cn$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://www.sxqlk.cn');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 仅允许POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['errcode' => -1, 'errmsg' => 'Method not allowed']);
    exit;
}

// 企业微信Webhook地址优先从环境变量读取；未配置时使用默认企业微信群机器人地址。
// 安全提示：生产环境建议通过服务器环境变量 QLK_WECHAT_WEBHOOK_URL 配置，避免密钥入仓。
$webhookUrl = getenv('QLK_WECHAT_WEBHOOK_URL');
if (!$webhookUrl) {
    $webhookUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c78a6ddd-e3b0-4aff-8583-b5787041277a';
}
$webhookParts = parse_url($webhookUrl);
if (!$webhookParts || !isset($webhookParts['scheme'], $webhookParts['host'], $webhookParts['path']) ||
    $webhookParts['scheme'] !== 'https' || $webhookParts['host'] !== 'qyapi.weixin.qq.com' ||
    $webhookParts['path'] !== '/cgi-bin/webhook/send') {
    http_response_code(503);
    echo json_encode(['errcode' => -1, 'errmsg' => 'Webhook configuration is invalid']);
    exit;
}

// 读取请求体
$rawInput = file_get_contents('php://input');
$contentType = isset($_SERVER['CONTENT_TYPE']) ? strtolower($_SERVER['CONTENT_TYPE']) : '';
$data = null;

// JavaScript提交JSON；无脚本环境下允许标准POST表单安全回退。
if (strpos($contentType, 'application/json') !== false) {
    $data = json_decode($rawInput, true);
} else {
    function clean_form_field($value) {
        $value = is_string($value) ? trim(strip_tags($value)) : '';
        return preg_replace('/[\r\n]+/u', ' ', $value);
    }

    $name = clean_form_field(isset($_POST['name']) ? $_POST['name'] : '');
    $phone = clean_form_field(isset($_POST['phone']) ? $_POST['phone'] : '');
    $industry = clean_form_field(isset($_POST['industry']) ? $_POST['industry'] : '未选择');
    $consent = isset($_POST['consent']) ? $_POST['consent'] : '';

    if ($name === '' || $phone === '' || $consent !== 'yes') {
        http_response_code(400);
        echo json_encode(['errcode' => -1, 'errmsg' => 'Required form data is missing']);
        exit;
    }

    $data = [
        'msgtype' => 'text',
        'text' => [
            'content' => "【企来客官网 - 新客户咨询】\n客户姓名：{$name}\n联系电话：{$phone}\n所属行业：{$industry}\n提交方式：标准POST表单"
        ]
    ];
    $rawInput = json_encode($data, JSON_UNESCAPED_UNICODE);
}

// 验证消息格式
if (!$data) {
    http_response_code(400);
    echo json_encode(['errcode' => -1, 'errmsg' => 'Invalid request payload']);
    exit;
}

// 安全检查：只允许markdown和text消息类型，防止滥用
if (!isset($data['msgtype']) || !in_array($data['msgtype'], ['markdown', 'text'])) {
    http_response_code(400);
    echo json_encode(['errcode' => -1, 'errmsg' => 'Unsupported message type']);
    exit;
}

// 频率限制：基于IP+文件，每分钟最多5条
$rateLimitDir = __DIR__ . '/.webhook_cache';
if (!is_dir($rateLimitDir)) {
    @mkdir($rateLimitDir, 0755, true);
}
$clientIp = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown');
$clientIp = preg_replace('/[^a-zA-Z0-9\.\-]/', '', $clientIp);
$rateFile = $rateLimitDir . '/' . $clientIp . '.json';
$rateData = ['count' => 0, 'time' => time()];
if (file_exists($rateFile)) {
    $saved = @json_decode(file_get_contents($rateFile), true);
    if ($saved && isset($saved['count']) && isset($saved['time'])) {
        $rateData = $saved;
    }
}
if (time() - $rateData['time'] > 60) {
    $rateData = ['count' => 0, 'time' => time()];
}
$rateData['count']++;
@file_put_contents($rateFile, json_encode($rateData));
if ($rateData['count'] > 5) {
    http_response_code(429);
    echo json_encode(['errcode' => -1, 'errmsg' => 'Too many requests']);
    exit;
}

// 转发请求到企业微信
// 留资通知：自动 @ 指定成员
// - text 类型：使用 mentioned_list 字段（用户指定的写法）
// - markdown 类型：使用 <@userid> 语法追加到正文（防止重复追加）
$payload = $rawInput;
if (isset($data['msgtype'])) {
    if ($data['msgtype'] === 'text') {
        if (!isset($data['text']) || !is_array($data['text'])) {
            $data['text'] = ['content' => ''];
        }
        if (!isset($data['text']['mentioned_list']) || !is_array($data['text']['mentioned_list'])) {
            $data['text']['mentioned_list'] = ['LiHongYang','me.z','@all'];
        }
        $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
    } elseif ($data['msgtype'] === 'markdown') {
        if (!isset($data['markdown']) || !is_array($data['markdown'])) {
            $data['markdown'] = ['content' => ''];
        }
        $content = isset($data['markdown']['content']) ? $data['markdown']['content'] : '';
        if (strpos($content, '<@LiHongYang>') === false) {
            $data['markdown']['content'] = $content . "\n<@LiHongYang>";
        }
        $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
    }
}

$ch = curl_init($webhookUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(502);
    echo json_encode(['errcode' => -1, 'errmsg' => 'Upstream error: ' . $error]);
    exit;
}

http_response_code($httpCode);
echo $response;
