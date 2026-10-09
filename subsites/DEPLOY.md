# 站点系统部署说明

## 1. DNS配置

在域名DNS管理后台添加以下记录：

### 主域名（已有）
- `sxqlk.cn` → A → 服务器IP
- `www.sxqlk.cn` → A → 服务器IP

### 泛域名（核心！一次配置覆盖所有站点）
- `*.sxqlk.cn` → A → 服务器IP

### 备用域名301重定向
- `shanxiqilaike.com` → 在Nginx中配置301重定向到 www.sxqlk.cn

## 2. SSL证书

需要两张证书：
1. **主域名证书**：`sxqlk.cn` + `www.sxqlk.cn`（已有）
2. **泛域名证书**：`*.sxqlk.cn`（需新申请）
   - 推荐使用 Let's Encrypt + DNS验证申请通配符证书
   - 或购买商业泛域名证书（约200-500元/年）

## 3. ICP备案

- 主域名已备案：陕ICP备2026005808号
- 泛域名`*.sxqlk.cn`的二级域名自动纳入主备案范围
- 需在备案系统新增"网站"记录，域名填写 `*.sxqlk.cn`
- 同一主体、同一接入商，无需每个二级域名单独备案

## 4. 服务器部署

### 目录结构
```
/srv/sxqlk/
├── main/              # 主站文件（当前项目的HTML/CSS/JS/图片）
├── subsites/          # 站点文件（已由generate-subsites.js生成）
│   ├── xian/
│   ├── yanta/
│   ├── lanzhou/
│   └── ...（共36个站点）
└── nginx-subsites.conf  # Nginx配置
```

### 部署步骤
```bash
# 1. 将主站文件上传到 /srv/sxqlk/main/
# 2. 将 subsites/ 目录上传到 /srv/sxqlk/subsites/
# 3. 复制Nginx配置
sudo cp nginx-subsites.conf /etc/nginx/sites-available/sxqlk.conf
sudo ln -s /etc/nginx/sites-available/sxqlk.conf /etc/nginx/sites-enabled/

# 4. 测试Nginx配置
sudo nginx -t

# 5. 重载Nginx
sudo nginx -s reload
```

## 5. 静态资源说明

站点HTML中的CSS/JS/图片资源引用主站域名：
- CSS: https://www.sxqlk.cn/styles/main.css
- JS: https://www.sxqlk.cn/js/main.js
- 图片: https://www.sxqlk.cn/images/...

这样所有站点共用一套静态资源，无需重复部署。

## 6. 收录推送

### 百度API主动推送
将所有站点URL提交到百度搜索：
```bash
# 采集所有站点URL
urls=""
urls="$urls\nhttps://xian.sxqlk.cn/"
urls="$urls\nhttps://yanta.sxqlk.cn/"
urls="$urls\nhttps://weiyang.sxqlk.cn/"
urls="$urls\nhttps://gaoxin.sxqlk.cn/"
urls="$urls\nhttps://qujiang.sxqlk.cn/"
urls="$urls\nhttps://beilin.sxqlk.cn/"
urls="$urls\nhttps://lianhu.sxqlk.cn/"
urls="$urls\nhttps://changan.sxqlk.cn/"
urls="$urls\nhttps://chanba.sxqlk.cn/"
urls="$urls\nhttps://xianyang.sxqlk.cn/"
urls="$urls\nhttps://baoji.sxqlk.cn/"
urls="$urls\nhttps://weinan.sxqlk.cn/"
urls="$urls\nhttps://tongchuan.sxqlk.cn/"
urls="$urls\nhttps://yanan.sxqlk.cn/"
urls="$urls\nhttps://yulin.sxqlk.cn/"
urls="$urls\nhttps://hanzhong.sxqlk.cn/"
urls="$urls\nhttps://ankang.sxqlk.cn/"
urls="$urls\nhttps://shangluo.sxqlk.cn/"
urls="$urls\nhttps://lantian.sxqlk.cn/"
urls="$urls\nhttps://huyi.sxqlk.cn/"
urls="$urls\nhttps://lintong.sxqlk.cn/"
urls="$urls\nhttps://zhouzhi.sxqlk.cn/"
urls="$urls\nhttps://fengdong.sxqlk.cn/"
urls="$urls\nhttps://xincheng.sxqlk.cn/"
urls="$urls\nhttps://baqiao.sxqlk.cn/"
urls="$urls\nhttps://lanzhou.sxqlk.cn/"
urls="$urls\nhttps://tianshui.sxqlk.cn/"
urls="$urls\nhttps://wuwei.sxqlk.cn/"
urls="$urls\nhttps://jiuquan.sxqlk.cn/"
urls="$urls\nhttps://xining.sxqlk.cn/"
urls="$urls\nhttps://yinchuan.sxqlk.cn/"
urls="$urls\nhttps://wulumuqi.sxqlk.cn/"
urls="$urls\nhttps://wuzhong.sxqlk.cn/"
urls="$urls\nhttps://dingxi.sxqlk.cn/"
urls="$urls\nhttps://qingyang.sxqlk.cn/"
urls="$urls\nhttps://baiyin.sxqlk.cn/"

# 提交到百度（替换token为实际值）
curl -H 'Content-Type:text/plain' --data-urlencode "$urls" \
  "http://data.zz.baidu.com/urls?site=www.sxqlk.cn&token=YOUR_TOKEN"
```

### sitemap提交
- 主站sitemap.xml中添加站点sitemap引用
- 或使用 subsites/sitemap-index.xml 作为总索引
- 在百度站长、Google Search Console、Bing Webmaster 中提交

## 7. 站点清单（36个）

1. `xian.sxqlk.cn` - 西安市
2. `yanta.sxqlk.cn` - 西安市雁塔区
3. `weiyang.sxqlk.cn` - 西安市未央区
4. `gaoxin.sxqlk.cn` - 西安高新区
5. `qujiang.sxqlk.cn` - 西安曲江新区
6. `beilin.sxqlk.cn` - 西安市碑林区
7. `lianhu.sxqlk.cn` - 西安市莲湖区
8. `changan.sxqlk.cn` - 西安市长安区
9. `chanba.sxqlk.cn` - 西安浐灞生态区
10. `xianyang.sxqlk.cn` - 咸阳市
11. `baoji.sxqlk.cn` - 宝鸡市
12. `weinan.sxqlk.cn` - 渭南市
13. `tongchuan.sxqlk.cn` - 铜川市
14. `yanan.sxqlk.cn` - 延安市
15. `yulin.sxqlk.cn` - 榆林市
16. `hanzhong.sxqlk.cn` - 汉中市
17. `ankang.sxqlk.cn` - 安康市
18. `shangluo.sxqlk.cn` - 商洛市
19. `lantian.sxqlk.cn` - 西安市蓝田县
20. `huyi.sxqlk.cn` - 西安市鄠邑区
21. `lintong.sxqlk.cn` - 西安市临潼区
22. `zhouzhi.sxqlk.cn` - 西安市周至县
23. `fengdong.sxqlk.cn` - 西安沣东新城
24. `xincheng.sxqlk.cn` - 西安市新城区
25. `baqiao.sxqlk.cn` - 西安市灞桥区
26. `lanzhou.sxqlk.cn` - 兰州市
27. `tianshui.sxqlk.cn` - 天水市
28. `wuwei.sxqlk.cn` - 武威市
29. `jiuquan.sxqlk.cn` - 酒泉市
30. `xining.sxqlk.cn` - 西宁市
31. `yinchuan.sxqlk.cn` - 银川市
32. `wulumuqi.sxqlk.cn` - 乌鲁木齐市
33. `wuzhong.sxqlk.cn` - 吴忠市
34. `dingxi.sxqlk.cn` - 定西市
35. `qingyang.sxqlk.cn` - 庆阳市
36. `baiyin.sxqlk.cn` - 白银市
