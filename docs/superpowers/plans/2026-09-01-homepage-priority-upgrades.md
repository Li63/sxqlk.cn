# Homepage Priority Upgrades Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair all verified priority-one homepage defects, integrate the selected A city-network motion into the hero, establish a 2+3 service hierarchy, and shorten the visible footer without removing crawlable city links.

**Architecture:** Keep the native HTML/CSS/ES5 JavaScript stack. Implement the hero motion as a five-second CSS animation over the existing `hero-bg-cbd.jpeg`, so no large video blocks first paint. Keep every city URL in semantic HTML inside a collapsed disclosure, and replace the unstable embedded map with a stable branded location card that links to Amap.

**Tech Stack:** HTML5, CSS3, ES5-compatible JavaScript, PHP 7+, Node.js built-in test runner.

## Global Constraints

- Preserve the existing company name, telephone, address, registration data, canonical URLs, schemas, and core terminology.
- Do not burn homepage copy into the hero image; text and controls remain HTML.
- The motion loop is exactly five seconds and respects `prefers-reduced-motion`.
- The form sends personal data only by POST and requires explicit consultation-use consent.
- The WeCom webhook URL is loaded from `QLK_WECHAT_WEBHOOK_URL`; no credential remains in source.
- All 81 city links remain present in the footer DOM for internal linking.
- The directory is not a Git repository, so commit steps are intentionally omitted.

---

### Task 1: Static regression harness and priority-one failures

**Files:**
- Create: `tests/homepage-regression.test.cjs`
- Test: `tests/homepage-regression.test.cjs`

**Interfaces:**
- Consumes: `index.html`, `styles/main.css`, `js/main.js`, `webhook-proxy.php`
- Produces: executable static regression checks via `node --test tests/homepage-regression.test.cjs`

- [ ] **Step 1: Write failing tests**

Create tests that assert: mobile `.two-col` becomes one column; the menu synchronizes `aria-expanded` and `aria-label`; the old Amap iframe is absent; the form is POST-only and contains required consent; the webhook is environment-configured; hero motion markup and five-second keyframes exist; two primary and three supporting service cards exist; the footer has a disclosure and a visible white brand heading.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/homepage-regression.test.cjs`

Expected: failures for every new requirement because the current page lacks each behavior.

### Task 2: Priority-one responsive, menu, map, form, and secret fixes

**Files:**
- Modify: `index.html:162,199-232,551-554`
- Modify: `styles/main.css:3895-3940`
- Modify: `js/main.js:22-37,525-626`
- Modify: `webhook-proxy.php:39-50`

**Interfaces:**
- Consumes: existing `.menu-toggle`, `.two-col`, `.lead-form`, and `.map-verify-grid`
- Produces: `syncMenuState(isOpen)`, POST-only lead form, `.location-card`, and environment-backed webhook forwarding

- [ ] **Step 1: Implement minimal fixes**

Add the mobile one-column override, synchronize menu state and labels, replace the iframe with a local location card plus an external Amap link, add POST action and a required consent checkbox, validate consent in JavaScript, and read the webhook URL from `getenv('QLK_WECHAT_WEBHOOK_URL')` with a 503 response when missing.

- [ ] **Step 2: Run focused tests and verify GREEN**

Run: `node --test tests/homepage-regression.test.cjs --test-name-pattern="mobile|menu|map|form|webhook"`

Expected: all matched tests pass.

### Task 3: Five-second A city-network hero motion

**Files:**
- Modify: `index.html:168-171`
- Modify: `styles/main.css:3573-3621,3942-3945`

**Interfaces:**
- Consumes: `images/hero-bg-cbd.jpeg`
- Produces: `.hero-v2__media`, `.hero-route`, `.hero-node`, and five-second `heroScene*` keyframes

- [ ] **Step 1: Add semantic decorative markup**

Insert one high-priority hero image, a flare, two data routes, and three nodes before `.hero-v2 .container`; mark decorative layers `aria-hidden="true"`.

- [ ] **Step 2: Add the five-second seamless animation**

Keep start/end frames identical, use a white readability veil over the image, and disable movement under `prefers-reduced-motion`.

- [ ] **Step 3: Run the hero test**

Run: `node --test tests/homepage-regression.test.cjs --test-name-pattern="hero"`

Expected: the hero test passes.

### Task 4: Recompose five services as 2+3

**Files:**
- Modify: `index.html:255-335`
- Modify: `styles/main.css:3516-3529,3888-3940`

**Interfaces:**
- Consumes: existing `.services-grid` and `.service-card`
- Produces: `.service-card--primary` and `.service-card--supporting`

- [ ] **Step 1: Mark the two core services and three supporting services**

GEO information optimization and AI brand information assets receive the primary modifier; website, short-video operations, and qualifications receive the supporting modifier.

- [ ] **Step 2: Implement a six-column desktop grid**

Primary cards span three columns each; supporting cards span two columns each. Collapse to two columns at 1024px and one column at 768px.

- [ ] **Step 3: Run the service hierarchy test**

Run: `node --test tests/homepage-regression.test.cjs --test-name-pattern="service"`

Expected: the service test passes.

### Task 5: Shorten the visible footer while preserving internal links

**Files:**
- Modify: `index.html:669-699`
- Modify: `styles/main.css:887-915,2966-2994`

**Interfaces:**
- Consumes: current `.footer-service-regions` markup containing every city link
- Produces: `.footer-core-cities` and `.footer-regions-disclosure`

- [ ] **Step 1: Add a compact visible core-city row**

Show Xi'an, Xianyang, Baoji, Lanzhou, Chengdu, Chongqing, Beijing, Shanghai, Guangzhou, and Shenzhen plus the all-cities page.

- [ ] **Step 2: Move the complete city network into a semantic disclosure**

Keep the original link network under `<details>` without `open`, add a concise summary, and retain every existing URL.

- [ ] **Step 3: Fix footer contrast and disclosure styles**

Set `.footer-brand h3` to white, use a visible focus style on the summary, and keep small-city links readable.

- [ ] **Step 4: Run footer tests**

Run: `node --test tests/homepage-regression.test.cjs --test-name-pattern="footer"`

Expected: all footer tests pass.

### Task 6: Documentation and end-to-end verification

**Files:**
- Modify: `DESIGN.md`
- Modify: `PROJECT.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: final homepage behavior
- Produces: accurate project, design, interaction, and webhook environment documentation

- [ ] **Step 1: Update documentation**

Document the city-network hero, 2+3 service grid, compact footer disclosure, stable map card, form consent, and `QLK_WECHAT_WEBHOOK_URL` deployment requirement.

- [ ] **Step 2: Run the complete static suite**

Run: `node --test tests/homepage-regression.test.cjs`

Expected: all tests pass with zero failures.

- [ ] **Step 3: Run syntax checks**

Run: `node --check js/main.js`

Expected: exit code 0 with no output.

Run: `php -l webhook-proxy.php`

Expected: `No syntax errors detected in webhook-proxy.php` when PHP is installed; otherwise record PHP runtime absence and inspect with the static regression suite.

- [ ] **Step 4: Verify in the running browser**

At 1440×900 verify the 2+3 service hierarchy and shortened footer. At 390×844 verify no horizontal overflow, the menu label and expanded state, the form consent, and the bottom CTA. Confirm the map card never embeds a login page and the hero motion stops under reduced-motion CSS.
