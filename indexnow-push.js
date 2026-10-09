#!/usr/bin/env node
/**
 * IndexNow 主动推送脚本（Bing / Yandex / Seznam / Naver 及接入 IndexNow 的 AI 搜索）
 *
 * 用法：
 *   node indexnow-push.js https://www.sxqlk.cn/news/113.html        # 推送指定 URL（可多条）
 *   node indexnow-push.js --file urls.txt                            # 从文件读取（一行一条）
 *   node indexnow-push.js --sitemap                                  # 推送 sitemap.xml 全部 URL（分批）
 *   node indexnow-push.js --latest 20                                # 推送 sitemap.xml 最后 N 条（新增内容常用）
 *
 * 说明：
 *   - 单次请求最多 10000 条 URL，脚本自动分批；
 *   - 密钥文件必须部署在站点根目录：https://www.sxqlk.cn/{key}.txt ；
 *   - 官方接口：https://api.indexnow.org/IndexNow
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const HOST = 'www.sxqlk.cn';
const SITE_BASE = 'https://www.sxqlk.cn';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const BATCH_SIZE = 10000;

// 读取站点根目录的 IndexNow 密钥文件（文件名即密钥）
function readKey() {
  const files = fs.readdirSync(__dirname).filter((f) => /^[0-9a-f]{8,128}\.txt$/i.test(f));
  if (files.length === 0) {
    console.error('未找到 IndexNow 密钥文件（站点根目录下 <key>.txt），请先创建');
    process.exit(1);
  }
  const file = files[0];
  const key = fs.readFileSync(path.join(__dirname, file), 'utf-8').trim();
  console.log(`使用密钥文件: ${file}`);
  return { key, file };
}

function parseSitemap() {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('sitemap.xml 不存在！');
    process.exit(1);
  }
  const content = fs.readFileSync(sitemapPath, 'utf-8');
  const urls = [];
  const re = /<loc>(.*?)<\/loc>/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    if (m[1].startsWith(SITE_BASE)) urls.push(m[1]);
  }
  return urls;
}

function pushBatch(urlList, key) {
  const body = JSON.stringify({ host: HOST, key, urlList });
  const parsed = new URL(INDEXNOW_ENDPOINT);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body, 'utf-8')
        }
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const { key } = readKey();

  let urls = [];
  if (args.includes('--sitemap')) {
    urls = parseSitemap();
  } else if (args.includes('--latest')) {
    const n = parseInt(args[args.indexOf('--latest') + 1], 10) || 20;
    urls = parseSitemap().slice(-n);
  } else if (args.includes('--file')) {
    const file = args[args.indexOf('--file') + 1];
    urls = fs
      .readFileSync(path.join(__dirname, file), 'utf-8')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    urls = args.filter((a) => a.startsWith('http'));
  }

  if (urls.length === 0) {
    console.log('没有可推送的 URL。示例：node indexnow-push.js https://www.sxqlk.cn/news/113.html');
    return;
  }

  console.log(`\n共 ${urls.length} 条 URL 待推送到 IndexNow\n`);
  let ok = 0;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    try {
      const res = await pushBatch(batch, key);
      const success = res.statusCode === 200 || res.statusCode === 202;
      console.log(`批次 ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} 条 -> HTTP ${res.statusCode} ${success ? '成功' : '失败'} ${res.body || ''}`);
      if (success) ok += batch.length;
    } catch (e) {
      console.error(`批次推送异常: ${e.message}`);
    }
  }
  console.log(`\n完成：成功提交 ${ok} / ${urls.length} 条`);
  console.log('提示：IndexNow 属于主动通知，收录仍以各搜索引擎实际抓取为准。');
}

main();
