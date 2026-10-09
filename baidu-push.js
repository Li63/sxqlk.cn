#!/usr/bin/env node
/**
 * 百度搜索引擎 URL 主动推送脚本
 * 使用方式：node baidu-push.js
 * 
 * 接口文档：http://data.zz.baidu.com/urls?site=www.sxqlk.cn&token=O94R1MOvAsAhx3GW
 * 每次最多推送 2000 条 URL
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// 百度推送配置
const BAIDU_API = 'http://data.zz.baidu.com/urls?site=www.sxqlk.cn&token=O94R1MOvAsAhx3GW';
const SITE_BASE = 'https://www.sxqlk.cn';

// 从 sitemap.xml 解析所有 URL
function parseSitemap() {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('sitemap.xml 不存在！');
    process.exit(1);
  }
  
  const content = fs.readFileSync(sitemapPath, 'utf-8');
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

// 推送 URL 到百度
function pushToBaidu(urls) {
  return new Promise((resolve, reject) => {
    const urlData = urls.join('\n');
    const parsedUrl = new URL(BAIDU_API);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(urlData, 'utf-8')
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          resolve({ raw: data });
        }
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.write(urlData);
    req.end();
  });
}

// 主函数
async function main() {
  console.log('=== 百度搜索引擎 URL 主动推送 ===\n');
  
  // 解析 sitemap
  const urls = parseSitemap();
  console.log(`从 sitemap.xml 解析到 ${urls.length} 个 URL\n`);
  
  if (urls.length === 0) {
    console.log('没有可推送的 URL');
    return;
  }
  
  // 显示所有 URL
  urls.forEach((url, i) => {
    console.log(`  ${i + 1}. ${url}`);
  });
  console.log('');
  
  // 推送到百度
  console.log('正在推送到百度...');
  try {
    const result = await pushToBaidu(urls);
    console.log('\n推送结果：');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success !== undefined) {
      console.log(`\n成功推送: ${result.success} 条`);
      if (result.remain !== undefined) {
        console.log(`今日剩余可推送: ${result.remain} 条`);
      }
    }
    if (result.not_valid && result.not_valid.length > 0) {
      console.log(`\n无效 URL (${result.not_valid.length} 条):`);
      result.not_valid.forEach(url => console.log(`  - ${url}`));
    }
  } catch (e) {
    console.error('推送失败:', e.message);
    console.log('\n提示：请确保网络可访问百度推送接口');
    console.log('手动推送方式：');
    console.log(`curl -H 'Content-Type:text/plain' --data-urlencode 'list=${urls.join('\\n')}' "${BAIDU_API}"`);
  }
}

main();
