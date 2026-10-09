const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const contactHtml = fs.readFileSync(path.join(root, 'contact.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles', 'main.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8');
const proxy = fs.readFileSync(path.join(root, 'webhook-proxy.php'), 'utf8');

test('mobile whitepaper layout collapses to one column', () => {
  assert.match(css, /@media\(max-width:768px\)\{[\s\S]*?\.two-col\s*\{\s*grid-template-columns:1fr;/);
});

test('mobile menu synchronizes expanded state and accessible label', () => {
  assert.match(js, /function\s+syncMenuState\s*\(isOpen\)/);
  assert.match(js, /setAttribute\(['"]aria-expanded['"],\s*String\(isOpen\)\)/);
  assert.match(js, /setAttribute\(['"]aria-label['"],\s*isOpen\s*\?\s*['"]关闭菜单['"]\s*:\s*['"]打开菜单['"]\)/);
});

test('location section uses a stable local card instead of embedding the Amap website', () => {
  assert.doesNotMatch(html, /<iframe[^>]+uri\.amap\.com/i);
  assert.match(html, /class="location-card"/);
  assert.match(html, /href="https:\/\/uri\.amap\.com\/marker\?/);
});

test('lead form posts safely and requires consultation-use consent', () => {
  assert.match(html, /<form[^>]+id="heroLeadForm"[^>]+method="post"[^>]+action="\/webhook-proxy\.php"/);
  assert.match(html, /type="checkbox"[^>]+name="consent"[^>]+required/);
  assert.match(html, /class="lead-form__privacy"/);
  assert.match(contactHtml, /<form[^>]+id="contactForm"[^>]+method="post"[^>]+action="\/webhook-proxy\.php"/);
  assert.match(contactHtml, /type="checkbox"[^>]+name="consent"[^>]+required/);
  assert.match(contactHtml, /class="lead-form__privacy"/);
  assert.match(js, /field\(form,\s*['"]consent['"]\)/);
});

test('WeCom webhook credential comes only from the server environment', () => {
  assert.doesNotMatch(proxy, /qyapi\.weixin\.qq\.com\/cgi-bin\/webhook\/send\?key=/);
  assert.match(proxy, /getenv\(['"]QLK_WECHAT_WEBHOOK_URL['"]\)/);
  assert.match(proxy, /http_response_code\(503\)/);
});

test('hero uses the selected CBD image and a five-second reduced-motion-safe loop', () => {
  assert.match(html, /class="hero-v2__media"/);
  assert.match(html, /src="images\/hero-bg-cbd\.jpeg"/);
  assert.match(css, /\.hero-v2__media img[\s\S]*animation:[^;]*5s[^;]*infinite/);
  assert.match(css, /@keyframes\s+heroSceneDrift/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)[\s\S]*\.hero-v2__media/);
});

test('service cards use a two-primary plus three-supporting hierarchy', () => {
  assert.equal((html.match(/service-card--primary/g) || []).length, 2);
  assert.equal((html.match(/service-card--supporting/g) || []).length, 3);
  assert.match(css, /\.service-card--primary\s*\{\s*grid-column:span 3;/);
  assert.match(css, /\.service-card--supporting\s*\{\s*grid-column:span 2;/);
});

test('footer is compact by default while retaining the complete city link network', () => {
  assert.match(html, /<details class="footer-regions-disclosure">/);
  assert.match(html, /<summary>查看全国服务城市<\/summary>/);
  assert.ok((html.match(/cities-tag-local/g) || []).length >= 80, 'all city links must remain in the DOM');
  assert.match(css, /\.footer-brand h3\s*\{\s*color:#fff;/);
});
