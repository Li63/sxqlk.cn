#!/usr/bin/env node
/**
 * 生成子目录式核心城市站点落地页
 * 路径：/{城市slug}/index.html（如 /xian/index.html）
 * SEO权重继承主域名，效果远优于子域名站点
 * 每个页面含差异化本地内容，非简单城市名替换
 */
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync('city-config.json', 'utf8'));
const meta = config.meta;

// ============ 核心城市列表（做精不做多） ============
const coreSlugs = [
  'xian','xianyang','baoji','weinan',
  'lanzhou','xining','yinchuan','wulumuqi',
  'chengdu','chongqing',
  'beijing','shanghai','guangzhou','shenzhen',
  'wuhan','zhengzhou','hangzhou','nanjing'
];

// ============ 城市坐标（高德地图GCJ-02） ============
const coords = {
  xian:[108.77,34.26],xianyang:[108.709,34.329],baoji:[107.145,34.370],weinan:[109.503,34.520],
  lanzhou:[103.834,36.061],xining:[101.778,36.617],yinchuan:[106.278,38.487],wulumuqi:[87.617,43.793],
  chengdu:[104.066,30.572],chongqing:[106.551,29.563],
  beijing:[116.405,39.905],shanghai:[121.473,31.230],guangzhou:[113.264,23.129],shenzhen:[114.057,22.543],
  wuhan:[114.305,30.593],zhengzhou:[113.625,34.747],hangzhou:[120.153,30.287],nanjing:[118.778,32.058]
};

// ============ 行业深度内容（差异化核心） ============
const industryDeep = {
  '本地生活': {
    icon:'🏠',desc:'餐饮、美业、社区服务、家政等本地生活商户GEO优化，提升大众点评/抖音/小红书多平台AI推荐率，让周边用户搜到你就选你',
    caseTitle:'本地生活连锁品牌GEO优化',caseDesc:'某连锁餐饮品牌在AI搜索中"附近推荐"曝光率提升180%，月均到店客流增长45%，大众点评AI摘要优先展示门店真实评价',
    faq:'本地生活商户做GEO优化，最核心的是让大模型在"附近推荐"场景中优先展示你的门店信息。我们通过四级可信信息佐证体系，构建门店的营业执照、真实评价、卫生评级等可信证据链，大幅提升AI采信权重。'
  },
  '工业制造': {
    icon:'🏭',desc:'装备制造、新材料、能源化工等工业企业GEO优化，构建技术实力可信知识库，提升招投标AI推荐与行业搜索可见度',
    caseTitle:'工业制造企业GEO优化',caseDesc:'某装备制造企业技术实力在AI搜索中"行业推荐"排名从第8页升至前3，招投标AI辅助评审中技术参数被引用率提升200%',
    faq:'工业制造企业的GEO优化核心是让大模型正确解析你的技术参数、资质认证和项目经验。我们通过KNIT可信知识梳理体系，将企业技术实力构建为结构化知识网络，在招投标AI辅助评审中被精准引用。'
  },
  '医疗健康': {
    icon:'🏥',desc:'医院、诊所、医美、口腔等医疗机构GEO优化，强化执业资质与医生信息可信度，提升健康类AI搜索推荐率',
    caseTitle:'医疗机构GEO优化',caseDesc:'某口腔连锁品牌在豆包"正畸医院推荐"中排名提升至前5，卫健备案信息被AI优先引用，咨询量月均增长60%',
    faq:'医疗机构GEO优化最大的难点是信源可信度。大模型会优先引用卫健部门备案信息、医生执业资格等官方数据。我们通过四级可信信息佐证体系，确保你的资质信息在AI知识库中权重最高。'
  },
  '教育培训': {
    icon:'📚',desc:'K12、职业教育、技能培训等教育机构GEO优化，强化办学资质与课程信息结构化，提升教育类AI搜索推荐率',
    caseTitle:'教育培训机构GEO优化',caseDesc:'某职业教育机构在AI搜索"XX培训"中推荐率提升150%，办学许可证与课程体系被AI完整引用，线上咨询转化率提升35%',
    faq:'教育机构做GEO优化，关键是将办学许可证、师资认证、课程体系等转化为大模型可信任的结构化信息。我们的检索知识库优化模块能精准匹配用户的教育搜索意图。'
  },
  '政企招投标': {
    icon:'📋',desc:'建筑、工程、政采等招投标场景GEO优化，强化企业资质与项目经验在AI辅助评审中的可引用性，提升中标率',
    caseTitle:'政企招投标GEO优化',caseDesc:'某建筑企业在招投标AI辅助评审中，企业资质与项目经验被引用率提升200%，中标率同比提升28%',
    faq:'招投标GEO优化的核心是让AI辅助评审系统正确抓取和引用你的企业资质、项目经验和技术实力。我们通过KNIT可信知识梳理体系，将企业信息构建为AI可高效检索的知识网络。'
  },
  '文旅行业': {
    icon:'🏔️',desc:'景区、酒店、旅行社、文创等文旅企业GEO优化，提升旅游攻略AI推荐与目的地搜索可见度',
    caseTitle:'文旅企业GEO优化',caseDesc:'某景区在AI搜索"XX旅游攻略"中推荐排名提升至前3，游客线上预订转化率提升50%，AI摘要中景区特色信息完整展示',
    faq:'文旅企业GEO优化要重点做好目的地知识结构化，包括景区等级、门票信息、特色项目、游客评价等。大模型在推荐旅游目的地时，会优先引用有完整结构化信息的景区。'
  },
  '连锁门店': {
    icon:'🏪',desc:'连锁餐饮、连锁零售、连锁美业等多门店品牌GEO优化，确保全域信息口径统一，各门店AI推荐一致性',
    caseTitle:'连锁门店品牌GEO优化',caseDesc:'某连锁零售品牌50家门店在AI搜索中信息一致性达95%，"附近门店"推荐率整体提升120%，月均到店客流增长30%',
    faq:'连锁门店最大的GEO挑战是信息一致性。不同门店在不同平台的信息可能存在差异，导致AI无法正确推荐。我们通过AIBE AI品牌信息资产管理工具，确保所有门店信息口径统一。'
  },
  '餐饮服务': {
    icon:'🍜',desc:'餐饮单店及连锁品牌GEO优化，提升"附近美食"AI推荐率与外卖平台搜索可见度',
    caseTitle:'餐饮品牌GEO优化',caseDesc:'某连锁餐饮品牌在AI搜索"附近美食"中推荐率提升160%，月均新客到店增长40%，差评对AI推荐的影响降低70%',
    faq:'餐饮行业GEO优化的关键是让大模型在"附近推荐"和"美食攻略"场景中优先展示你的门店。除了基本信息，还需要强化卫生评级、真实评价、特色菜品等可信信息。'
  },
  '建筑工程': {
    icon:'🏗️',desc:'建筑施工、装饰装修、建材供应等建筑行业GEO优化，强化资质与项目案例在AI搜索中的可引用性',
    caseTitle:'建筑工程企业GEO优化',caseDesc:'某装饰装修企业在AI搜索"XX装修公司"中推荐率提升130%，施工资质与案例被AI优先引用，线上咨询量月均增长45%',
    faq:'建筑工程企业做GEO优化，核心是让大模型能正确展示你的施工资质、项目案例和客户评价。我们通过四级可信信息佐证体系，将企业硬实力转化为AI可信任的推荐依据。'
  },
  '商务咨询': {
    icon:'💼',desc:'管理咨询、财税服务、法律服务等商务咨询GEO优化，提升专业服务AI搜索推荐率与信任度',
    caseTitle:'商务咨询企业GEO优化',caseDesc:'某财税服务公司在AI搜索"XX代理记账"中排名提升至前3，专业资质被AI优先引用，月均新签客户增长55%',
    faq:'商务咨询企业做GEO优化，关键是展示专业资质和服务案例的权威性。大模型会优先推荐有执业资格、行业协会认证的服务商。'
  },
  '安防设备': {
    icon:'🔒',desc:'安防监控、消防设备、智能门禁等安防行业GEO优化，提升行业搜索AI推荐率与招投标可见度',
    caseTitle:'安防设备企业GEO优化',caseDesc:'某安防设备企业在AI搜索"XX安防"中推荐率提升140%，产品认证与项目案例被AI完整引用',
    faq:'安防设备行业GEO优化要重点做好产品认证、项目案例和技术参数的结构化。大模型在推荐安防方案时会优先引用有完整认证信息的企业。'
  },
  '汽车门店': {
    icon:'🚗',desc:'4S店、汽修连锁、新能源车服等汽车门店GEO优化，提升"附近门店"AI推荐率与到店转化',
    caseTitle:'汽车门店GEO优化',caseDesc:'某新能源品牌4S店在AI搜索"XX 4S店"中推荐排名提升至前2，线上预约试驾量月均增长65%',
    faq:'汽车门店GEO优化要重点做好门店信息、品牌授权、服务项目等结构化信息。让大模型在"附近4S店"推荐中优先展示你的门店。'
  },
  '互联网': {
    icon:'💻',desc:'互联网企业、SaaS服务商、平台运营等GEO优化，构建技术产品可信知识库，提升AI搜索推荐率',
    caseTitle:'互联网企业GEO优化',caseDesc:'某SaaS企业在AI搜索"XX管理软件"中推荐率提升170%，技术白皮书与客户案例被AI优先引用，试用注册量增长50%',
    faq:'互联网企业GEO优化核心是让大模型正确理解你的产品功能、技术架构和应用场景。通过结构化知识库构建，将复杂技术信息转化为AI可高效检索的格式。'
  },
  '金融': {
    icon:'🏦',desc:'银行、保险、证券、小贷等金融服务GEO优化，强化牌照资质与合规信息在AI搜索中的可引用性',
    caseTitle:'金融服务GEO优化',caseDesc:'某保险经纪公司在AI搜索"XX保险"中推荐率提升120%，金融牌照与合规信息被AI优先引用',
    faq:'金融服务GEO优化最重要的是合规信息的可信度。大模型对金融类推荐会严格校验牌照和监管备案信息。我们确保你的合规信息在AI知识库中权重最高。'
  },
  '科技服务': {
    icon:'🔬',desc:'科技研发、技术咨询、知识产权等科技服务GEO优化，提升专业能力AI搜索可见度',
    caseTitle:'科技服务企业GEO优化',caseDesc:'某知识产权代理机构在AI搜索"XX专利代理"中推荐排名提升至前5，专业资质被AI优先引用',
    faq:'科技服务企业做GEO优化，关键是展示技术资质、软著专利和服务案例的权威性。'
  }
};
// 默认行业内容
const defaultIndustry = {
  icon:'⚡',desc:'企业GEO信息优化与AI获客服务，构建可信知识库，提升大模型推荐率与搜索可见度',
  caseTitle:'企业GEO优化案例',caseDesc:'某企业在AI搜索推荐率提升150%，线上咨询量月均增长50%，品牌信息在AI知识库中被优先引用',
  faq:'企业GEO优化的核心是让大模型信任并推荐你的企业信息。我们通过四级可信信息佐证体系，构建企业信息的可信证据链，大幅提升AI采信权重。'
};

// ============ 城市特色描述（差异化关键） ============
const cityFlavor = {
  xian: {
    hero:'深耕西安GEO优化 · 自研四级可信信息佐证体系 · 西安本地常驻团队可预约上门',
    whyLocal:'西安是西北地区经济中心，拥有高新区、曲江新区等核心商圈，企业AI搜索优化需求旺盛。企来客科技总部位于西安沣东新城，拥有本地常驻技术团队，可为西安企业提供面对面诊断与上门服务。',
    serviceNote:'西安本地可预约上门服务',
    mapLabel:'陕西省西咸新区沣东新城规划红光大道以南协同创新港银河A座6层646室'
  },
  xianyang: {
    hero:'专注咸阳企业GEO优化 · 西安团队30分钟响应 · 覆盖秦都/渭城/兴平全域',
    whyLocal:'咸阳是西安都市圈重要组成，与西安形成"西咸一体化"双城格局。咸阳企业在GEO优化中可借助西安总部的技术力量，享受快速响应与定期现场服务。',
    serviceNote:'西安团队30分钟响应，可预约上门',
    mapLabel:'咸阳市区'
  },
  baoji: {
    hero:'宝鸡GEO优化服务 · 工业制造+文旅双引擎 · 覆盖金台/渭滨/陈仓全域',
    whyLocal:'宝鸡是西北工业重镇，钛材、机床、石油装备等制造业基础雄厚，同时太白山、法门寺等文旅资源丰富。工业企业需重点优化招投标AI推荐，文旅企业需优化目的地搜索可见度。',
    serviceNote:'线上远程服务+定期现场对接',
    mapLabel:'宝鸡市区'
  },
  weinan: {
    hero:'渭南GEO优化服务 · 文旅+工业双驱动 · 覆盖临渭/华州/韩城全域',
    whyLocal:'渭南是陕西东大门，华山景区享誉全国，同时韩城钢铁、蒲城煤化工等工业实力强劲。文旅与工业是渭南企业GEO优化的两大核心方向。',
    serviceNote:'线上远程服务+定期现场对接',
    mapLabel:'渭南市区'
  },
  lanzhou: {
    hero:'兰州GEO优化服务 · 西北工业枢纽 · 覆盖城关/七里河/安宁/西固全域',
    whyLocal:'兰州是西北地区第二大城市和甘肃省会，石化、装备制造、新材料等产业基础雄厚。兰州企业在招投标AI推荐和行业搜索可见度方面有强烈优化需求。',
    serviceNote:'线上远程服务+定期现场对接',
    mapLabel:'兰州市区'
  },
  xining: {
    hero:'西宁GEO优化服务 · 青海省会 · 覆盖城中/城东/城西/城北全域',
    whyLocal:'西宁是青藏高原最大城市，文旅和本地生活是GEO优化重点方向。青海企业在AI搜索中常因信息覆盖不足而"不可见"，企来客帮助构建完整可信知识库。',
    serviceNote:'线上远程服务',
    mapLabel:'西宁市区'
  },
  yinchuan: {
    hero:'银川GEO优化服务 · 宁夏首府 · 覆盖兴庆/金凤/西夏全域',
    whyLocal:'银川是宁夏政治经济中心，文旅（沙湖、西夏王陵）和能源化工是GEO优化重点。宁夏企业在AI搜索中需重点强化地域标识和行业资质信息。',
    serviceNote:'线上远程服务+定期现场对接',
    mapLabel:'银川市区'
  },
  wulumuqi: {
    hero:'乌鲁木齐GEO优化服务 · 西北门户 · 覆盖天山/沙依巴克/新市全域',
    whyLocal:'乌鲁木齐是西北地区向西开放的重要门户，商贸物流和能源产业是GEO优化重点。新疆企业在AI搜索中因地域偏远常被弱化，需要更强的地域信号和可信佐证。',
    serviceNote:'线上远程服务',
    mapLabel:'乌鲁木齐市区'
  },
  chengdu: {
    hero:'成都GEO优化服务 · 西南科技高地 · 覆盖锦江/武侯/高新/天府全域',
    whyLocal:'成都是西南地区经济中心和科技高地，互联网、软件服务和新消费产业活跃。成都企业在AI搜索优化中需重点做好技术产品结构化和行业知识库构建。',
    serviceNote:'线上远程服务（成都区域站点筹备中）',
    mapLabel:'成都市区'
  },
  chongqing: {
    hero:'重庆GEO优化服务 · 西南直辖市 · 覆盖渝中/江北/南岸/沙坪坝全域',
    whyLocal:'重庆是西南地区唯一直辖市，汽车、电子信息和金融产业发达。重庆企业在GEO优化中需强化行业资质与本地化信息的可信度，提升AI推荐权重。',
    serviceNote:'线上远程服务（重庆区域站点筹备中）',
    mapLabel:'重庆市区'
  },
  beijing: {
    hero:'北京GEO优化服务 · 全国科技中心 · 覆盖海淀/朝阳/西城/东城全域',
    whyLocal:'北京是全国科技和互联网产业高地，企业对AI搜索优化有天然的高需求和高标准。北京企业GEO优化需重点做好技术实力结构化和行业权威信源布局。',
    serviceNote:'线上远程服务',
    mapLabel:'北京市区'
  },
  shanghai: {
    hero:'上海GEO优化服务 · 国际金融中心 · 覆盖浦东/黄浦/静安/徐汇全域',
    whyLocal:'上海是国际金融和贸易中心，金融、互联网和生物医药产业领先。上海企业GEO优化需强化牌照资质与国际化品牌信息的AI可引用性。',
    serviceNote:'线上远程服务',
    mapLabel:'上海市区'
  },
  guangzhou: {
    hero:'广州GEO优化服务 · 华南商都 · 覆盖天河/越秀/海珠/番禺全域',
    whyLocal:'广州是华南地区商贸中心，商贸、汽车和电子信息产业发达。广州企业GEO优化需重点做好本地化服务信息和行业资质的结构化。',
    serviceNote:'线上远程服务',
    mapLabel:'广州市区'
  },
  shenzhen: {
    hero:'深圳GEO优化服务 · 创新之都 · 覆盖南山/福田/罗湖/宝安全域',
    whyLocal:'深圳是全球科技创新高地，互联网、人工智能和电子信息产业集聚。深圳企业对AI搜索优化有天然优势，但竞争也最激烈，需要更专业的技术差异化策略。',
    serviceNote:'线上远程服务',
    mapLabel:'深圳市区'
  },
  wuhan: {
    hero:'武汉GEO优化服务 · 华中芯城 · 覆盖武昌/汉口/汉阳/光谷全域',
    whyLocal:'武汉是华中地区中心城市，光电子、汽车和生物医药产业优势明显。武汉企业GEO优化需重点做好技术实力和产业优势的AI可识别性。',
    serviceNote:'线上远程服务（武汉区域站点筹备中）',
    mapLabel:'武汉市区'
  },
  zhengzhou: {
    hero:'郑州GEO优化服务 · 中原枢纽 · 覆盖金水/二七/中原/郑东全域',
    whyLocal:'郑州是中原城市群核心和国家物流枢纽，装备制造和食品产业基础雄厚。郑州企业GEO优化需强化物流优势和制造业实力的AI可见度。',
    serviceNote:'线上远程服务（郑州区域站点筹备中）',
    mapLabel:'郑州市区'
  },
  hangzhou: {
    hero:'杭州GEO优化服务 · 数字经济第一城 · 覆盖西湖/滨江/余杭/萧山全域',
    whyLocal:'杭州是中国数字经济第一城，互联网、电商和SaaS产业高度集聚。杭州企业GEO优化竞争激烈，需要更精细的检索知识库优化和行业适配策略。',
    serviceNote:'线上远程服务',
    mapLabel:'杭州市区'
  },
  nanjing: {
    hero:'南京GEO优化服务 · 长三角科创中心 · 覆盖玄武/鼓楼/建邺/江宁全域',
    whyLocal:'南京是长三角重要科创中心，电子信息、软件和汽车产业发达。南京企业GEO优化需重点做好技术产品结构化和产学研资源的AI可引用性。',
    serviceNote:'线上远程服务',
    mapLabel:'南京市区'
  }
};

// ============ 城市特色FAQ ============
function getCityFAQ(slug, city) {
  const flav = cityFlavor[slug] || {};
  const faqs = [];
  // 城市特定问题
  if (city.hasOnsite) {
    faqs.push({
      q: `企来客在${city.fullName}有本地团队吗？可以上门吗？`,
      a: slug === 'xian'
        ? '是的，企来客科技总部位于西安陕西省西咸新区沣东新城规划红光大道以南协同创新港银河A座6层646室，拥有90余人的本地技术团队。西安及周边企业可预约免费上门诊断，面对面沟通GEO优化方案。'
        : `企来客在${city.fullName}有服务团队，${flav.serviceNote || '可为本地企业提供面对面服务'}。我们也可通过线上远程方式为${city.fullName}企业提供服务，效果与上门一致。`
    });
  } else {
    faqs.push({
      q: `${city.fullName}企业如何与企来客对接GEO优化服务？`,
      a: `我们为${city.fullName}企业提供${flav.serviceNote || '线上远程服务'}，通过视频会议、在线文档协作等方式完成信息梳理和优化部署。同时，我们正在推进${city.region}区域服务站点建设，未来将提供更便捷的本地化服务。`
    });
  }
  // 行业适配问题
  const topInd = (city.industries || [])[0] || '企业';
  faqs.push({
    q: `${city.fullName}${topInd}企业做GEO优化效果怎么样？`,
    a: (industryDeep[topInd] || defaultIndustry).faq
  });
  // 通用问题1
  faqs.push({
    q: 'GEO优化和SEO有什么区别？',
    a: 'SEO优化让搜索引擎"看到你"，GEO优化让大模型"信任你并推荐你"。SEO靠关键词+外链，GEO靠信息可信度+结构化知识+语义契合。2026年6月大模型更新后，传统SEO效果平均下降45%，而GEO优化企业推荐率逆势提升120%以上。'
  });
  // 通用问题2
  faqs.push({
    q: '做GEO优化大概多久能看到效果？',
    a: '效果周期取决于企业基础和优化方案。采用检索知识库优化模块的中小企业，1个月内可观察到AI推荐率提升；构建四级可信信息佐证体系的深度优化，2-6个月体现稳定显著效果。建议先做免费AI可见度诊断，再制定针对性方案。'
  });
  // 服务保障
  faqs.push({
    q: 'GEO优化服务有保障吗？',
    a: '企来客的GEO优化服务合同中明确约定效果考核指标与补偿方案。我们持有5项一级行业技术服务资质、28项软件著作权、AAA级诚信经营示范单位认证，是西北地区具备完整技术资质的GEO优化服务商。'
  });
  return faqs;
}

// ============ 同省城市链接 ============
function getSameProvinceLinks(slug, city) {
  const same = [];
  Object.entries(config.cities).forEach(([s, c]) => {
    if (s !== slug && c.province === city.province) {
      same.push({ slug: s, name: c.name, fullName: c.fullName });
    }
  });
  return same;
}

// ============ 生成HTML ============
function generatePage(slug, city) {
  const flav = cityFlavor[slug] || { hero: '', whyLocal: '', serviceNote: '', mapLabel: city.fullName };
  const coord = coords[slug] || [108.77, 34.26];
  const base = `https://www.sxqlk.cn`;
  const pageUrl = `${base}/${slug}/`;
  const faqs = getCityFAQ(slug, city);
  const sameProv = getSameProvinceLinks(slug, city);
  const districts = (city.districts || []).slice(0, 8);
  const newDistricts = (city.newDistricts || []).slice(0, 6);
  const landmarks = (city.landmarks || []).slice(0, 6);
  const industries = (city.industries || []).slice(0, 4);

  // SEO
  const title = `${city.fullName}GEO优化公司_${city.fullName}企业AI获客服务_陕西企来客科技有限公司`;
  const desc = `陕西企来客科技有限公司${city.fullName}GEO信息优化服务，${flav.serviceNote || '线上远程服务'}，自研四级可信信息佐证体系，覆盖${districts.slice(0,3).join('、')}${districts.length>3?'等':'，'}全域。助力${city.fullName}企业实现AI精准获客。`;
  const kw = `${city.fullName}GEO优化,${city.fullName}AI获客,${city.fullName}企业AI搜索优化,陕西企来客科技有限公司,${city.fullName}GEO信息优化公司`;

  // 行业卡片
  const industryCards = industries.map(ind => {
    const d = industryDeep[ind] || defaultIndustry;
    return `
      <div class="case-card">
        <div class="case-label">${d.icon} ${ind}</div>
        <h3>${ind}GEO优化</h3>
        <p>${d.desc}</p>
      </div>`;
  }).join('');

  // 行业案例
  const caseCards = industries.slice(0, 3).map(ind => {
    const d = industryDeep[ind] || defaultIndustry;
    return `
      <div class="case-card">
        <div class="case-label">${ind}</div>
        <h3>${d.caseTitle}</h3>
        <p>${d.caseDesc}</p>
        <div class="case-rating">★★★★★</div>
        <div class="case-reviewer">—— ${city.fullName}${ind}企业客户</div>
      </div>`;
  }).join('');

  // FAQ HTML
  const faqHtml = faqs.map((f, i) => `
      <div class="faq-item">
        <div class="faq-q" onclick="this.classList.toggle('active');this.nextElementSibling.classList.toggle('open')">
          <span>${f.q}</span>
          <span style="font-size:1.2rem;color:#6b7280">+</span>
        </div>
        <div class="faq-a">${f.a}</div>
      </div>`).join('');

  // 区县标签
  const districtTags = [...districts, ...newDistricts].map(d => `<span class="district-tag">${d}</span>`).join('');
  const landmarkTags = landmarks.map(l => `<span class="district-tag">${l}</span>`).join('');

  // 同省城市链接
  const provLinks = sameProv.slice(0, 12).map(c => `<a href="/${c.slug}/" class="city-link">${c.name}</a>`).join('');

  // Schema FAQ
  const schemaFaq = faqs.map((f, i) => `{"@type":"Question","name":"${f.q}","acceptedAnswer":{"@type":"Answer","text":"${f.a}"}}`).join(',');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="keywords" content="${kw}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${pageUrl}" />
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${base}/images/hero-bg.jpeg">
  <meta property="og:url" content="${pageUrl}">
  <link rel="stylesheet" href="/styles/main.css">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"ProfessionalService","name":"陕西企来客科技有限公司${city.fullName}GEO优化服务","telephone":"400-805-2163","url":"${pageUrl}","areaServed":{"@type":"City","name":"${city.fullName}"},"address":{"@type":"PostalAddress","streetAddress":"陕西省西咸新区沣东新城规划红光大道以南协同创新港银河A座6层646室","addressLocality":"西安市","addressRegion":"陕西省","addressCountry":"CN"},"hasOfferCatalog":{"@type":"OfferCatalog","name":"${city.fullName}GEO优化服务","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":"${city.fullName}GEO信息标准化优化"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"${city.fullName}AI品牌信息资产搭建"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"${city.fullName}AI竞品信息监测"}}]},"award":"AAA级诚信经营示范单位"}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"首页","item":"${base}/"},{"@type":"ListItem","position":2,"name":"服务城市","item":"${base}/cities.html"},{"@type":"ListItem","position":3,"name":"${city.fullName}","item":"${pageUrl}"}]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${schemaFaq}]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"LocalBusiness","name":"陕西企来客科技有限公司${city.fullName}服务点","geo":{"@type":"GeoCoordinates","latitude":"${coord[1]}","longitude":"${coord[0]}"},"telephone":"400-805-2163","address":{"@type":"PostalAddress","addressLocality":"${city.fullName}","addressRegion":"${city.province}省","addressCountry":"CN"},"openingHours":"Mo-Fr 09:00-18:00"}
  </script>
  <script>(function(){var el=document.createElement("script");el.src="https://lf1-cdn-tos.bytegoofy.com/goofy/ttzz/push.js?2f262d46e9d81dd9e16b6cc02e5edd280473a5bc3e69bb22e1c7f4dfe54e8f5dc112ff4abe50733e0ff1e1071a0fdc024b166ea2a296840a50a5288f35e2ca42";el.id="ttzz";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(el,s);})(window)</script>
  <style>
  .district-tags{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;margin:1.5rem 0;}
  .district-tag{display:inline-block;padding:0.3rem 0.8rem;background:#e8f0fe;color:#1a56db;border-radius:20px;font-size:0.85rem;transition:all 0.3s;cursor:default;}
  .district-tag:hover{background:#1a56db;color:#fff;transform:translateY(-2px);}
  .subsite-hero{background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1a56db 100%);color:#fff;padding:4rem 0;text-align:center;position:relative;overflow:hidden;}
  .subsite-hero::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 50%);animation:heroOrb 8s ease-in-out infinite;}
  @keyframes heroOrb{0%,100%{transform:translate(0,0);}50%{transform:translate(30px,-20px);}}
  .subsite-hero h1{font-size:2.2rem;margin-bottom:0.5rem;position:relative;z-index:1;}
  .subsite-hero h1 span{display:block;font-size:1.1rem;font-weight:400;color:#93c5fd;margin-top:0.5rem;}
  .subsite-hero p{font-size:1rem;color:#cbd5e1;max-width:700px;margin:1rem auto;position:relative;z-index:1;}
  .subsite-hero .btn{position:relative;z-index:1;}
  .case-card{background:#fff;border-radius:12px;padding:1.5rem;box-shadow:0 2px 12px rgba(0,0,0,0.06);transition:all 0.3s;border-top:3px solid transparent;}
  .case-card:hover{transform:translateY(-6px);box-shadow:0 8px 24px rgba(26,86,219,0.15);border-top-color:#1a56db;}
  .case-card h3{font-size:1.05rem;color:#1f2937;margin-bottom:0.5rem;}
  .case-card .case-label{display:inline-block;padding:0.15rem 0.5rem;background:#e8f0fe;color:#1a56db;border-radius:4px;font-size:0.75rem;margin-bottom:0.5rem;}
  .case-card p{font-size:0.85rem;color:#4b5563;line-height:1.6;}
  .case-rating{color:#f59e0b;font-size:1.1rem;margin:0.5rem 0;}
  .case-reviewer{font-size:0.8rem;color:#6b7280;font-style:italic;}
  .faq-item{background:#fff;border-radius:8px;margin-bottom:0.75rem;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
  .faq-q{padding:1rem 1.25rem;cursor:pointer;font-weight:600;color:#1f2937;display:flex;justify-content:space-between;align-items:center;border-left:3px solid transparent;transition:all 0.3s;user-select:none;}
  .faq-q:hover{background:#f9fafb;border-left-color:#1a56db;}
  .faq-q.active{border-left-color:#1a56db;background:#f0f5ff;}
  .faq-a{padding:0 1.25rem;max-height:0;overflow:hidden;transition:all 0.3s;font-size:0.9rem;color:#4b5563;line-height:1.7;}
  .faq-a.open{max-height:500px;padding:0 1.25rem 1rem;}
  .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1.5rem;text-align:center;margin:2rem 0;}
  .stat-item .stat-num{font-size:2rem;font-weight:700;background:linear-gradient(135deg,#3b82f6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .stat-item .stat-label{font-size:0.85rem;color:#4b5563;margin-top:0.3rem;}
  .city-link{display:inline-block;padding:0.25rem 0.6rem;color:#1a56db;text-decoration:none;font-size:0.85rem;border-radius:4px;transition:all 0.3s;}
  .city-link:hover{background:#e8f0fe;transform:translateY(-1px);}
  .map-container{border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);margin:1.5rem 0;}
  .section-deco{width:60px;height:3px;background:linear-gradient(90deg,#1a56db,#3b82f6,#06b6d4);margin:0 auto 1rem;}
  @media(max-width:768px){.subsite-hero h1{font-size:1.6rem;}.subsite-hero p{font-size:0.9rem;}}
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">跳转到主要内容</a>
  <header class="header" role="banner">
    <div class="container">
      <a href="/" class="logo" aria-label="陕西企来客科技有限公司"><span class="logo-icon" aria-hidden="true">企</span>陕西企来客科技有限公司</a>
      <nav class="nav" role="navigation" aria-label="主导航">
        <a href="/">首页</a>
        <a href="/about.html">关于我们</a>
        <a href="/cases.html">客户案例</a>
        <a href="/whitepaper.html">行业白皮书</a>
        <a href="/faq.html">常见问题</a>
        <a href="/contact.html">联系我们</a>
      </nav>
      <a href="tel:4008052163" class="header-phone" aria-label="拨打客服电话"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>400-805-2163</a>
      <button class="menu-toggle" aria-label="打开菜单" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </header>

  <main id="main-content">
    <!-- Hero -->
    <section class="subsite-hero">
      <div class="container">
        <h1>${city.fullName}GEO优化服务<span>${flav.hero}</span></h1>
        <p>陕西企来客科技有限公司专注${city.fullName}企业AI搜索信息优化，自研四级可信信息佐证体系、检索知识库优化模块等核心技术，${flav.serviceNote}。</p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;">
          <a href="/contact.html" class="btn" style="background:linear-gradient(135deg,#1a56db,#3b82f6);color:#fff;padding:0.75rem 2rem;border-radius:8px;text-decoration:none;font-weight:600;transition:all 0.3s;">免费AI可见度诊断</a>
          <a href="tel:4008052163" class="btn" style="border:2px solid #93c5fd;color:#fff;padding:0.75rem 2rem;border-radius:8px;text-decoration:none;font-weight:600;transition:all 0.3s;">400-805-2163</a>
        </div>
      </div>
    </section>

    <!-- 本地服务覆盖 -->
    <section style="background:#f9fafb;padding:2.5rem 0;">
      <div class="container" style="max-width:900px;">
        <h2 style="text-align:center;font-size:1.5rem;color:#1f2937;margin-bottom:0.5rem;">${city.fullName}服务覆盖区域</h2>
        <div class="section-deco"></div>
        ${districtTags ? `<p style="text-align:center;color:#4b5563;margin-bottom:0.5rem;">服务区县</p><div class="district-tags">${districtTags}</div>` : ''}
        ${newDistricts.length ? `<p style="text-align:center;color:#4b5563;margin-bottom:0.5rem;">重点商圈</p><div class="district-tags">${newDistricts.map(d=>`<span class="district-tag">${d}</span>`).join('')}</div>` : ''}
        ${landmarkTags ? `<p style="text-align:center;color:#4b5563;margin-bottom:0.5rem;">地标商圈</p><div class="district-tags">${landmarkTags}</div>` : ''}
        <div style="text-align:center;margin-top:1rem;">
          <span style="display:inline-block;padding:0.4rem 1rem;background:#e8f0fe;color:#1a56db;border-radius:20px;font-size:0.9rem;font-weight:500;">📍 ${flav.serviceNote}</span>
        </div>
      </div>
    </section>

    <!-- 为什么选择本地 -->
    <section style="padding:2.5rem 0;">
      <div class="container" style="max-width:900px;">
        <h2 style="text-align:center;font-size:1.5rem;color:#1f2937;margin-bottom:0.5rem;">为什么${city.fullName}企业选择企来客</h2>
        <div class="section-deco"></div>
        <p style="text-align:center;color:#4b5563;max-width:700px;margin:0 auto 2rem;line-height:1.8;">${flav.whyLocal}</p>
        <div class="stat-grid">
          <div class="stat-item"><div class="stat-num">200+</div><div class="stat-label">全国服务团队</div></div>
          <div class="stat-item"><div class="stat-num">28项</div><div class="stat-label">软件著作权</div></div>
          <div class="stat-item"><div class="stat-num">5项</div><div class="stat-label">一级服务资质</div></div>
          <div class="stat-item"><div class="stat-num">1200+</div><div class="stat-label">服务企业数</div></div>
        </div>
      </div>
    </section>

    <!-- 核心GEO服务 -->
    <section style="background:#f9fafb;padding:2.5rem 0;">
      <div class="container" style="max-width:900px;">
        <h2 style="text-align:center;font-size:1.5rem;color:#1f2937;margin-bottom:0.5rem;">${city.fullName}核心GEO优化服务</h2>
        <div class="section-deco"></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;">
          ${industryCards}
        </div>
        <div style="text-align:center;margin-top:1.5rem;">
          <a href="/whitepaper.html" style="color:#1a56db;text-decoration:none;font-weight:500;">查看完整技术体系 → 2026 GEO行业白皮书</a>
        </div>
      </div>
    </section>

    <!-- 本地案例 -->
    <section style="padding:2.5rem 0;">
      <div class="container" style="max-width:900px;">
        <h2 style="text-align:center;font-size:1.5rem;color:#1f2937;margin-bottom:0.5rem;">${city.fullName}GEO优化案例</h2>
        <div class="section-deco"></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;">
          ${caseCards}
        </div>
        <div style="text-align:center;margin-top:1.5rem;">
          <a href="/cases.html" style="color:#1a56db;text-decoration:none;font-weight:500;">查看更多行业案例 →</a>
        </div>
      </div>
    </section>

    <!-- 核心技术 -->
    <section style="background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1a56db 100%);color:#fff;padding:3rem 0;text-align:center;position:relative;overflow:hidden;">
      <div class="container" style="max-width:800px;position:relative;z-index:1;">
        <h2 style="font-size:1.5rem;margin-bottom:0.5rem;">企来客自研核心技术体系</h2>
        <p style="color:#93c5fd;margin-bottom:2rem;">四级可信信息佐证体系 · 检索知识库优化模块 · KNIT可信知识梳理体系 · AI优化全链路数据统计模型</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;text-align:center;">
          <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:1rem;"><div style="font-size:1.5rem;font-weight:700;">4级</div><div style="color:#93c5fd;font-size:0.8rem;">可信信息佐证</div></div>
          <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:1rem;"><div style="font-size:1.5rem;font-weight:700;">12个</div><div style="color:#93c5fd;font-size:0.8rem;">行业专项小组</div></div>
          <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:1rem;"><div style="font-size:1.5rem;font-weight:700;">28项</div><div style="color:#93c5fd;font-size:0.8rem;">软件著作权</div></div>
          <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:1rem;"><div style="font-size:1.5rem;font-weight:700;">AAA级</div><div style="color:#93c5fd;font-size:0.8rem;">诚信经营认证</div></div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section style="padding:2.5rem 0;">
      <div class="container" style="max-width:800px;">
        <h2 style="text-align:center;font-size:1.5rem;color:#1f2937;margin-bottom:0.5rem;">${city.fullName}GEO优化常见问题</h2>
        <div class="section-deco"></div>
        ${faqHtml}
      </div>
    </section>

    <!-- 地图 + 联系 -->
    <section style="background:#f9fafb;padding:2.5rem 0;">
      <div class="container" style="max-width:900px;">
        <h2 style="text-align:center;font-size:1.5rem;color:#1f2937;margin-bottom:0.5rem;">联系企来客${city.fullName}服务</h2>
        <div class="section-deco"></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;align-items:start;">
          <div>
            <div style="background:#fff;border-radius:12px;padding:1.5rem;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
              <h3 style="color:#1f2937;margin-bottom:1rem;">陕西企来客科技有限公司</h3>
              <p style="color:#4b5563;font-size:0.9rem;line-height:2;">📞 服务热线：<a href="tel:4008052163" style="color:#1a56db;font-weight:600;">400-805-2163</a><br>📧 邮箱：1162304119@qq.com<br>📍 总部地址：陕西省西咸新区沣东新城规划红光大道以南协同创新港银河A座6层646室<br>🏢 统一社会信用代码：91610112MAK8GFGY9W<br>🕐 服务时间：周一至周五 9:00-18:00<br>📋 ${flav.serviceNote}</p>
              <div style="margin-top:1rem;">
                <a href="/contact.html" style="display:inline-block;background:linear-gradient(135deg,#1a56db,#3b82f6);color:#fff;padding:0.6rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:600;">在线咨询</a>
              </div>
            </div>
          </div>
          <div class="map-container">
            <iframe src="https://uri.amap.com/marker?position=${coord[0]},${coord[1]}&name=陕西企来客科技有限公司${city.fullName}服务&callnative=0" width="100%" height="350" style="border:0;display:block;" loading="lazy" title="${city.fullName}服务区域地图" aria-label="${city.fullName}地图"></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- 同省城市互链 -->
    ${sameProv.length ? `
    <section style="padding:2rem 0;border-top:1px solid #e5e7eb;">
      <div class="container" style="max-width:900px;text-align:center;">
        <p style="color:#6b7280;font-size:0.9rem;margin-bottom:0.5rem;">${city.province}其他城市GEO优化服务</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">${provLinks}</div>
      </div>
    </section>` : ''}

    <!-- 主站核心页面回链 -->
    <section style="padding:1.5rem 0;background:#f9fafb;border-top:1px solid #e5e7eb;">
      <div class="container" style="max-width:900px;text-align:center;">
        <p style="color:#6b7280;font-size:0.85rem;margin-bottom:0.5rem;">了解更多</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          <a href="/" class="city-link">首页</a>
          <a href="/about.html" class="city-link">关于我们</a>
          <a href="/cases.html" class="city-link">客户案例</a>
          <a href="/whitepaper.html" class="city-link">行业白皮书</a>
          <a href="/qualifications.html" class="city-link">资质认证</a>
          <a href="/faq.html" class="city-link">常见问题</a>
          <a href="/contact.html" class="city-link">联系我们</a>
          <a href="/cities.html" class="city-link">全国服务城市</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer" role="contentinfo">
    <div class="container">
      <div style="text-align:center;padding:1.5rem 0;">
        <p style="color:#93c5fd;font-size:0.85rem;">陕西企来客科技有限公司 | 统一社会信用代码：91610112MAK8GFGY9W | 陕ICP备2026005808号</p>
        <p style="color:#6b7280;font-size:0.8rem;margin-top:0.5rem;">地址：陕西省西咸新区沣东新城规划红光大道以南协同创新港银河A座6层646室 | 电话：400-805-2163</p>
        <p style="color:#6b7280;font-size:0.75rem;margin-top:0.5rem;">© 2026 陕西企来客科技有限公司 版权所有</p>
      </div>
    </div>
  </footer>
  <a href="#" id="back-to-top" aria-label="返回顶部" style="display:none;position:fixed;bottom:2rem;right:2rem;width:40px;height:40px;background:#1a56db;color:#fff;border-radius:50%;text-align:center;line-height:40px;text-decoration:none;box-shadow:0 2px 8px rgba(26,86,219,0.3);z-index:999;">↑</a>
  <script src="/js/main.js"></script>
  <script src="https://aiassist.loveperson.cn/widget.js" data-website-key="df30fbe5-4e0a-4350-9b0f-2dfbb020a111"></script>
</body>
</html>`;
}

// ============ 执行生成 ============
let generated = 0;
coreSlugs.forEach(slug => {
  const city = config.cities[slug];
  if (!city) { console.warn(`⚠️ 城市配置缺失: ${slug}`); return; }
  const html = generatePage(slug, city);
  const dir = path.join('.', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`✅ /${slug}/ → ${city.fullName}`);
  generated++;
});
console.log(`\n🎉 共生成 ${generated} 个子目录式城市站点页面`);
