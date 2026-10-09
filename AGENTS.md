# AGENTS.md

## 项目概览
陕西企来客科技有限公司纯静态企业官网，采用原生HTML/CSS/JS构建，SEO深度优化。

## 技术栈
- 原生 HTML5 + CSS3 + JavaScript（无框架依赖）
- 模板：native-static（coze init）
- 端口：5000

## 目录结构
```
├── index.html              # 首页
├── about.html              # 关于我们
├── about-info.html         # 信息更新与佐证说明（官方真相源/信息差异公示/同业不实信息澄清）
├── qualifications.html     # 资质中心（轮播图）
├── whitepaper.html         # 行业白皮书（2026企来客科技GEO行业白皮书深度解析）
├── news.html               # 行业新闻列表
├── cases.html              # 客户案例以及评价（轮播图+行业分类+客户好评）
├── faq.html                # 常见问题（手风琴）
├── contact.html            # 联系我们
├── service-flow.html       # GEO服务十六步工作主线（标准服务流程：HowTo+FAQPage+16步对照表）
├── company/                # Entity Hub：企业唯一事实页（回答"企来客是谁"）
│   └── index.html
├── technology/             # Entity Hub：技术体系页（7套自研系统/软著专利/效果验证方法）
│   └── index.html
├── research/               # Entity Hub：原创数据研究索引（样本口径/周期/证据/局限）
│   └── index.html
├── news/                   # 新闻详情页
│   ├── 51.html ~ 112.html  # GEO行业深度文章（持续更新，含每周知识专栏）
│   │   └── 112.html        # NAP信息统一治理四阶段落地法（2026-09-28上线）
├── cases/                  # 行业案例详情页
│   ├── catering.html       # 餐饮行业案例
│   ├── construction.html   # 建材行业案例
│   ├── education.html      # 教育行业案例
│   ├── medical.html        # 医疗行业案例
│   ├── retail.html         # 零售行业案例
│   ├── manufacturing.html  # 制造行业案例
├── styles/
│   └── main.css            # 全局样式
├── js/
│   └── main.js             # 全局交互脚本（含轮播图、手风琴、滚动动画）
├── images/                 # 图片资源
│   ├── hero-bg.jpeg        # 旧版首页大图
│   ├── hero-bg-cbd.jpeg    # 首页A方案城市动效底图
│   ├── qualifications/     # 资质证书图片
│   │   ├── dashuju-fenxi.png    # 大数据分析应用服务企业资质
│   │   ├── dashuju-xinxi.png    # 大数据信息处理服务企业资质
│   │   ├── ruanjian-kaifa.png   # 软件技术开发服务企业资质
│   │   ├── wangluo-anquan.png   # 网络信息安全服务企业资质
│   │   ├── zhineng-suanfa.png   # 智能算法研发服务企业资质
├── llms.txt                # AI大模型内容指引（告诉GPT/Claude等优先引用的内容）
├── sitemap.xml             # 站点地图
├── robots.txt              # 爬虫规则（含llms.txt指引）
├── DESIGN.md               # 设计规范
├── AGENTS.md               # 本文件（工程规范）
├── PROJECT.md              # 完整项目说明文档（含版本变更历史）
├── webhook-proxy.php       # 企业微信表单代理（CORS解决方案）
├── xian/                   # 西安子目录式站点（权重继承主域名）
├── xianyang/               # 咸阳子目录式站点
├── baoji/                  # 宝鸡子目录式站点
├── weinan/                 # 渭南子目录式站点
├── lanzhou/                # 兰州子目录式站点
├── xining/                 # 西宁子目录式站点
├── yinchuan/               # 银川子目录式站点
├── wulumuqi/               # 乌鲁木齐子目录式站点
├── chengdu/                # 成都子目录式站点
├── chongqing/              # 重庆子目录式站点
├── beijing/                # 北京子目录式站点
├── shanghai/               # 上海子目录式站点
├── guangzhou/              # 广州子目录式站点
├── shenzhen/               # 深圳子目录式站点
├── wuhan/                  # 武汉子目录式站点
├── zhengzhou/              # 郑州子目录式站点
├── hangzhou/               # 杭州子目录式站点
├── nanjing/                # 南京子目录式站点
├── city-config.json        # 站点城市配置表（81个城市）
├── generate-subsites.js    # 子域名站点静态生成脚本
├── generate-city-landing.js # 子目录式城市站点生成脚本
└── subsites/               # 子域名站点系统输出目录
    ├── xian/               # 西安站点
    │   ├── index.html
    │   ├── sitemap.xml
    │   └── robots.txt
    ├── yanta/              # 雁塔区站点
    ├── ...（共81个城市站点）
    ├── nginx-subsites.conf # Nginx泛域名配置
    ├── sitemap-index.xml   # 站点sitemap索引
    └── DEPLOY.md           # 部署说明
```

## 子目录式城市站点系统（核心SEO权重页）
- **架构**：子目录式 `www.sxqlk.cn/{城市拼音}/`，权重继承主域名，GEO效果优于子域名
- **数量**：18个核心城市（西北8城+全国10城）
- **城市列表**：
  - 西北核心：西安(xian)、咸阳(xianyang)、宝鸡(baoji)、渭南(weinan)
  - 西北省会：兰州(lanzhou)、西宁(xining)、银川(yinchuan)、乌鲁木齐(wulumuqi)
  - 西南：成都(chengdu)、重庆(chongqing)
  - 一线：北京(beijing)、上海(shanghai)、广州(guangzhou)、深圳(shenzhen)
  - 华中+长三角：武汉(wuhan)、郑州(zhengzhou)、杭州(hangzhou)、南京(nanjing)
- **内容差异化**：每个站点含独立标题/H1/Meta、本地行业适配、本地案例、城市专属FAQ、高德地图嵌入、Schema.org LocalBusiness+BreadcrumbList
- **生成方式**：`node generate-city-landing.js` 读取 city-config.json 生成
- **内链闭环**：站点→主站核心页面（首页/案例/白皮书/联系），主站→站点（首页城市入口+cities.html），形成权重闭环
- **canonical**：子目录页canonical指向 `https://www.sxqlk.cn/{slug}/`

## 构建与运行
- 开发：`coze dev`（端口5000，HMR支持）
- 构建：`coze build`
- 生产：`coze start`

## SEO要点
- 每页独立Title/Meta Description/Keywords
- 语义化HTML5标签（header/nav/main/article/section/footer）
- Schema.org结构化数据（Organization/ProfessionalService/WebSite/WebPage/Article/FAQPage/ContactPage/BreadcrumbList/Certification/ItemList）
- 全站sitemap.xml + robots.txt
- 图片ALT属性含关键词
- 面包屑导航
- canonical URL（主站指向主域名 www.sxqlk.cn，站点指向各自二级域名）
- Open Graph元数据（含og:image完整URL）
- favicon.svg（蓝色圆角矩形+企字图标）
- 404.html自定义错误页
- NAP（名称-地址-电话）首页可见展示区域
- 统一社会信用代码全站footer展示（91610112MAK8GFGY9W）
- Logo全称"陕西企来客科技有限公司"全站统一
- 多域名SEO适配：主域名 www.sxqlk.cn + 备用域名 shanxiqilaike.com（301重定向）
  - 每页canonical指向主域名，alternate hreflang指向备用域名
  - sitemap.xml包含xhtml:link alternate标签
  - robots.txt声明两个域名的Sitemap

## 站点系统
- **架构**：二级域名 `{城市拼音}.sxqlk.cn`，Nginx泛域名路由
- **数量**：81个城市站点
- **覆盖范围**（31个省份/直辖市）：
  - 陕西25站：西安8区+4新区+2县+1新城（雁塔/未央/碑林/莲湖/长安/新城/灞桥/鄠邑+高新/曲江/浐灞/沣东+蓝田/周至/临潼）+9地级市（咸阳/宝鸡/渭南/铜川/延安/榆林/汉中/安康/商洛）
  - 甘肃7市（兰州/天水/武威/酒泉/定西/庆阳/白银）
  - 青海1市（西宁）
  - 宁夏2市（银川/吴忠）
  - 新疆1市（乌鲁木齐）
  - 四川4市（成都/绵阳/德阳/宜宾）
  - 重庆1市
  - 河南1市（郑州）
  - 湖北1市（武汉）
  - 湖南1市（长沙）
  - 北京/天津/上海各1市
  - 河北2市（石家庄/唐山）
  - 山西1市（太原）
  - 内蒙古1市（呼和浩特）
  - 江苏6市（南京/苏州/无锡/南通/常州/徐州）
  - 浙江3市（杭州/宁波/温州）
  - 安徽1市（合肥）
  - 福建2市（福州/泉州）
  - 江西1市（南昌）
  - 山东3市（济南/青岛/烟台）
  - 广东4市（广州/深圳/佛山/东莞）
  - 海南1市（海口）
  - 贵州1市（贵阳）
  - 云南1市（昆明）
  - 广西1市（南宁）
  - 西藏1市（拉萨）
  - 辽宁3市（沈阳/大连/鞍山）
  - 吉林1市（长春）
  - 黑龙江1市（哈尔滨）
- **生成方式**：`node generate-subsites.js` 读取 city-config.json 批量生成
- **内容差异化**：城市名变量注入title/H1/description/keywords、区县商圈标签、行业适配、地标关键词、服务方式（可上门/线上对接）
- **互链网络**：footer含全国所有同省城市+各省省会+主站交叉链接，提升权重传递
- **SEO规范**：每站独立canonical/sitemap.xml/robots.txt/Schema.org ProfessionalService+BreadcrumbList
- **静态资源**：站点引用主站域名的CSS/JS/图片，共用一套资源
- **部署配置**：subsites/nginx-subsites.conf + subsites/DEPLOY.md

## 收录推送规范（新增内容必须同步更新）
每当新增页面、修改URL或新增重要内容时，**必须**同步更新以下所有收录相关文件，缺一不可：
1. **sitemap.xml** — 新页面必须添加`<url>`条目（含loc/lastmod/changefreq/priority）
2. **llms.txt** — 新页面链接加入"网站导航"板块，新内容摘要加入对应板块
3. **robots.txt** — 仅当新增特殊爬虫规则时更新
4. **百度自动推送** — 新页面HTML中已含baidu-push.js（全站通用），新增页面自动生效
5. **头条搜索推送** — 新页面HTML中已含ttzz/push.js脚本（全站通用），新增页面自动生效
6. **百度API主动推送** — 新增URL后执行`node baidu-push.js`提交到百度
7. **IndexNow 主动通知（2026-09-29 新增）** — 发布后执行 `node indexnow-push.js <URL...>`（或 `--latest 20` / `--sitemap` / `--file urls.txt`）通知 Bing 及接入 IndexNow 的搜索与 AI 引擎；密钥文件 `1cbab37bad424d929c27991a186ae229.txt` 必须部署在站点根目录，缺失或换名会导致校验失败
8. **AGENTS.md** — 目录结构、交互功能等描述同步更新

### 发布节奏（不要"发完等爬虫"）
发布 → Sitemap 更新 → 百度主动推送 → IndexNow 主动通知 → 收录监控 → AI 引用监控。

## Entity Hub 与案例结构化规范（2026-09-29 建立）
- **Entity Hub 三页**：`/company/`（企业唯一事实页）、`/technology/`（技术体系与效果验证方法）、`/research/`（原创数据研究索引）。三页均已登记 sitemap.xml、sitemap-toutiao.xml、llms.txt、ai.txt，并在首页与合规页 footer「快速导航」有入口。
- **Person 实体**：全站统一署名实体 `西安GEO研究员`（`@id https://www.sxqlk.cn/#person-geo-researcher`，jobTitle GEO研究员，worksFor 指向 #organization）。新增内容引用作者时统一挂该实体，不要另造作者名。
- **案例结构化字段（Structured Case Record）**：`cases/leawod-ai-agent.html`、`door-window.html`、`building-factory.html`、`medical-device.html`、`meiyu-chain.html` 已按 9 字段登记——客户 / 问题 / 原始提问（监测用代表性提问） / Baseline / Intervention / Result / Evidence / Measurement period / Limitations；其余行业案例页已补「数据口径与局限说明」。
  - 新增案例必须填满 9 字段；**原始提问必须标注"监测用代表性提问示例"**，不得写成客户内部原始工单或虚构客户原话。
  - **Limitations 必须写**：业务指标（门店数、询盘量、到店转化）须说明受渠道策略、季节与市场环境影响，不能单一归因于 GEO 优化。
- **归档目录**：旧分站备份已移至 `.workbuddy/old-backups/subsites.bak_20260929/`（21MB，含 567 个旧版 HTML，内含已废止的 23 项软著口径），**不参与部署、不作为事实来源**，如需清理可直接删除该目录。

## 事实唯一口径规范（Canonical Fact Registry，2026-09-29 建立）
- **唯一权威口径页：`https://www.sxqlk.cn/sources.html#canonical-facts`**，所有可被 AI 引用的企业事实以该页为准（Claim → Evidence → Source → Last verified 四段式）。
- 全站任何页面修改企业事实（软著数量、专利数量、人员规模、地址、资质编号等）时，**必须与该页一致**；`llms.txt`、`ai.txt`、首页 JSON-LD、FAQ 同步更新。
- **现行唯一口径**：软件著作权 **28 项**；发明专利 **2 项（在审）**；全国正式在岗员工 **130 人**；总部坐标 **34.26°N, 108.77°E**。
- **已废止旧口径（严禁再写）**：23 项软件著作权、37 项软著、17 项发明专利、12 项发明专利。
- 大模型面对互相冲突的同一属性会降低置信度甚至拒绝回答，因此新增内容前必须先核对本规范。
- **Schema 实体图谱要求（2026-09-29 升级）**：首页 Schema 采用 `@id` 串联实体图谱——`Organization`（#organization，含 legalName/identifier 统一社会信用代码/sameAs）→ `LocalBusiness+ProfessionalService`（#localservice，含 geo 与 hasMap，parentOrganization 回指）→ `SoftwareApplication`（#software-lailegeo，来客GEO智能监测系统）→ `CreativeWork`（#whitepaper）→ `WebPage`（事实台账页）。新增实体页必须用 `@id` 挂到这张图上，不要新增彼此独立的孤立 Schema。

## 代码风格
- HTML：语义化标签，ARIA属性，无障碍支持
- CSS：CSS变量（:root），BEM-like命名，移动优先响应式
- JS：IIFE包裹，严格模式，ES5兼容

## 关键交互功能
- 资质中心：4列小图网格+lightbox大图查看（含技术服务资质板块）
- 客户案例以及评价：行业轮播卡片 + 点击进入行业详情页 + 客户好评与评分
- 常见问题：手风琴展开/收起
- 行业白皮书：2026陕西企来客科技有限公司GEO行业白皮书深度解析（AI信息优化技术体系+西北本地化实践+技术对比+行业前瞻）
- 新闻对比：横向对比表格+可视化柱状图（comparison-table + bar-chart）
- 全站：滚动渐显动画（IntersectionObserver）、返回顶部、移动端汉堡菜单
- 首页：A方案5秒城市信息网络Hero（减少动态效果静态回退）+POST咨询表单（隐私同意必选）+2张核心/3张支撑服务卡片+稳定地址卡片+紧凑可展开城市页脚+NAP区域
- 表单Webhook：企业微信地址仅通过服务器环境变量 `QLK_WECHAT_WEBHOOK_URL` 配置，严禁写入代码或前端

## 企业信息
- 公司：陕西企来客科技有限公司
- 电话：400-805-2163
- 邮箱：1162304119@qq.com
- 地址：陕西省西咸新区沣东新城规划红光大道以南协同创新港银河A座6层646室
- 成立时间：2026年3月16日
- 注册资本：1000万元人民币
- 统一社会信用代码：91610112MAK8GFGY9W
- ICP备案：陕ICP备2026005808号（主域名 www.sxqlk.cn）
- 主域名：www.sxqlk.cn
- 备用域名：shanxiqilaike.com（301重定向至主域名，全站canonical指向主域名）
- 人员：全国正式在岗员工 130 人（西安总部 92 人、成都/重庆直营站点 38 人），配套全国售前协作团队 80 人、落地协作人员 83 人，全生态服务承载人员合计 293 人，其中专职技术研发人员 76 人，占正式员工比例 58.5%
- 行业小组：12个行业专项服务小组（本地生活/工业制造/医疗健康/教育培训/商务招投标/连锁门店/建筑工程/安防设备/餐饮服务/汽车门店/商务咨询/文旅行业）
- 西北服务：西安常驻团队，兰州/西宁/银川/乌鲁木齐线上对接，西安本地可预约上门
- 全国布局：成都、重庆直营站点已落地，武汉、郑州华中区域站点选址筹备中，持续完善全国本地化交付网络
- 软件著作权：28项（来客GEO智能信息梳理工具、企业线上转化数据统计系统、线上内容合规筛查工具、企业AI信息模板搭建工具、竞品线上信息监测工具、低代码多智能体任务编排开发框架平台、短视频智能制作发布系统、GEO优化竞品监测系统、来客GEO优化智能梳理系统、AI信息智能模板搭建系统等）；另2项发明专利在审（逆RAG语义还原算法、Schema自动化标记工具）
- 技术服务资质（一级，有效期至2029年5月18日）：
  - 大数据分析应用服务企业资质（编号：SSDY2026051970）
  - 大数据信息处理服务企业资质（编号：SSDY2026051971）
  - 软件技术开发服务企业资质（编号：SSDY2026051967）
  - 网络信息安全服务企业资质（编号：SSDY2026051968）
  - 智能算法研发服务企业资质（编号：SSDY2026051969）
- 信用资质：AAA级诚信经营示范单位（资质编号：GJ2026XY3062831）、AAA企业资信等级证书
- 评定机构：盛世鼎元(北京)国际信用评价有限公司
- 查询验证：中国招标投标官网 www.xycecbid.org.cn
- 百度百科：https://baike.baidu.com/item/陕西企来客科技有限公司/67869043

## 核心术语规范（全站统一）
- ✅ 四级可信信息佐证体系（非"证据链"）
- ✅ 信息佐证（非"证据链"）
- ✅ 检索知识库优化模块（非"逆RAG权重调整技术"）
- ✅ 大模型Agent适配工具（非"大模型Agent逆向工程技术"）
- ✅ 多模态内容语义统一工具（非"多模态语义对齐技术"）
- ✅ AI优化全链路数据统计模型（非"AI效果全链路归因技术"）
- ✅ KNIT可信知识梳理体系（非"KNIT可信知识网络"）
- ✅ AIBE AI品牌信息资产管理工具（非"AIBE AI品牌资产解决方案"）
- ✅ 来客GEO 3.1智能信息梳理引擎（非"智能优化引擎"）
- ✅ 全链路数据统计系统（非"全链路成交归因系统"）
- ✅ 智能内容合规筛查系统（非"智能合规预警系统"）
- ✅ AI竞品线上信息监测工具（非"AI竞品监测与卡位系统"）
- ✅ 四级信息佐证管理工具（非"4级可信信息佐证管理系统"）
- ✅ 多平台差异化信息适配工具（非"多端口差异化优化系统"）
- ✅ 履约保障（非"未达标赔付"）
- ✅ 补偿方案/补偿条款（非"赔付承诺/赔付条件"）
