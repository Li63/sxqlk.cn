/**
 * 陕西企来客科技 - 官网交互脚本
 */
(function() {
  'use strict';

  // Header scroll effect
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('scrolled');
        header.classList.remove('header--scrolled');
      }
    });
  }

  // Mobile menu toggle
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    function syncMenuState(isOpen) {
      menuToggle.classList[isOpen ? 'add' : 'remove']('active');
      nav.classList[isOpen ? 'add' : 'remove']('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
    }

    menuToggle.addEventListener('click', function() {
      syncMenuState(!nav.classList.contains('open'));
    });
    // Close menu on link click
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        syncMenuState(false);
      });
    });
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        syncMenuState(false);
        menuToggle.focus();
      }
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.parentElement;
      var answer = item.querySelector('.faq-answer');
      var isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item.active').forEach(function(activeItem) {
        activeItem.classList.remove('active');
        activeItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked (if wasn't active)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Lazy load images
  if ('IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imgObserver.observe(img);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Counter animation for stats
  function animateCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(function(el) {
      counterObserver.observe(el);
    });
  }

  // Contact form handling
  // ========================================
  // Carousel Component
  // ========================================
  function initCarousel(carouselEl) {
    if (!carouselEl) return;
    
    var track = carouselEl.querySelector('.carousel-track');
    var slides = carouselEl.querySelectorAll('.carousel-slide');
    var prevBtn = carouselEl.querySelector('.carousel-btn-prev, .carousel-prev');
    var nextBtn = carouselEl.querySelector('.carousel-btn-next, .carousel-next');
    var dotsContainer = carouselEl.querySelector('.carousel-dots');
    var currentIndex = 0;
    var totalSlides = slides.length;
    var autoPlayTimer = null;

    if (totalSlides <= 1) return;

    // Create dots
    if (dotsContainer) {
      for (var i = 0; i < totalSlides; i++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', '第' + (i + 1) + '页');
        dot.dataset.index = i;
        dot.addEventListener('click', function() {
          goToSlide(parseInt(this.dataset.index, 10));
        });
        dotsContainer.appendChild(dot);
      }
    }

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      var dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
      });
    }

    // Auto play
    function startAutoPlay() {
      autoPlayTimer = setInterval(function() {
        goToSlide(currentIndex + 1);
      }, 4000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    startAutoPlay();

    // Pause on hover
    carouselEl.addEventListener('mouseenter', function() {
      clearInterval(autoPlayTimer);
    });
    carouselEl.addEventListener('mouseleave', function() {
      startAutoPlay();
    });

    // Touch/swipe support
    var startX = 0;
    var isDragging = false;

    track.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoPlayTimer);
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      var endX = e.changedTouches[0].clientX;
      var diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
      startAutoPlay();
    }, { passive: true });
  }

  // Initialize all carousels
  document.querySelectorAll('.carousel').forEach(initCarousel);

  // ========================================
  // Qualification Category Tabs
  // ========================================
  var qualTabs = document.querySelectorAll('.qual-tab');
  if (qualTabs.length > 0) {
    qualTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var category = this.dataset.category;
        // Update tab active state
        qualTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        // Show/hide carousels
        document.querySelectorAll('.qual-carousel-group').forEach(function(group) {
          if (group.dataset.category === category || category === 'all') {
            group.style.display = '';
          } else {
            group.style.display = 'none';
          }
        });
        // Re-init visible carousels
        document.querySelectorAll('.qual-carousel-group[style=""] .carousel, .qual-carousel-group:not([style]) .carousel').forEach(initCarousel);
      });
    });
  }

  // ========================================
  // Scroll Reveal Animation
  // ========================================
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  // ===== Whitepaper Page Animations =====
  var statBars = document.querySelectorAll('.wp-stat-bar-fill');
  if (statBars.length) {
    var barObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var width = target.getAttribute('data-width');
          if (width) {
            setTimeout(function() { target.style.width = width; }, 200);
          }
          barObserver.unobserve(target);
        }
      });
    }, { threshold: 0.3 });
    statBars.forEach(function(bar) { barObserver.observe(bar); });
  }

  var statNumbers = document.querySelectorAll('[data-count]');
  if (statNumbers.length) {
    var countObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statNumbers.forEach(function(el) { countObserver.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 1500;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  var tocLinks = document.querySelectorAll('.toc-link');
  var wpSections = document.querySelectorAll('.wp-section[id]');
  if (tocLinks.length && wpSections.length) {
    window.addEventListener('scroll', function() {
      var scrollPos = window.scrollY + 150;
      wpSections.forEach(function(section) {
        if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
          tocLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + section.id) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  /* ===== Bar Chart Rendering ===== */
  function renderBarCharts() {
    var charts = document.querySelectorAll('.bar-chart:not(.bar-chart--rendered)');
    charts.forEach(function(chart) {
      chart.classList.add('bar-chart--rendered');
      var labels = (chart.getAttribute('data-labels') || '').split(',');
      var values1 = (chart.getAttribute('data-values') || '').split(',').map(Number);
      var values2 = (chart.getAttribute('data-values2') || '').split(',').map(Number);
      var label1 = chart.getAttribute('data-label1') || '行业平均';
      var label2 = chart.getAttribute('data-label2') || '企来客科技';

      if (!labels.length || !values2.length) return;

      var maxVal = Math.max.apply(null, values2.concat(values1));
      if (maxVal === 0) maxVal = 100;
      var html = '';

      for (var i = 0; i < labels.length; i++) {
        var pct1 = values1[i] ? Math.round((values1[i] / maxVal) * 100) : 0;
        var pct2 = values2[i] ? Math.round((values2[i] / maxVal) * 100) : 0;
        html += '<div class="bar-chart__group">';
        html += '<span class="bar-chart__label" title="' + labels[i] + '">' + labels[i] + '</span>';
        html += '<div class="bar-chart__bars">';
        if (values1[i] !== undefined) {
          html += '<div class="bar-chart__bar-wrap">';
          html += '<div class="bar-chart__bar bar-chart__bar--baseline" style="width:0%" data-width="' + pct1 + '%"></div>';
          html += '<span class="bar-chart__val">' + values1[i] + (values1[i] <= 100 && values2[i] <= 100 ? '%' : '') + '</span>';
          html += '</div>';
        }
        html += '<div class="bar-chart__bar-wrap">';
        html += '<div class="bar-chart__bar bar-chart__bar--value" style="width:0%" data-width="' + pct2 + '%"></div>';
        html += '<span class="bar-chart__val">' + values2[i] + (values2[i] <= 100 && values1[i] <= 100 ? '%' : '') + '</span>';
        html += '</div>';
        html += '</div></div>';
      }

      html += '<div class="bar-chart__legend">';
      html += '<span class="bar-chart__legend-item"><span class="bar-chart__legend-dot bar-chart__legend-dot--baseline"></span>' + label1 + '</span>';
      html += '<span class="bar-chart__legend-item"><span class="bar-chart__legend-dot bar-chart__legend-dot--value"></span>' + label2 + '</span>';
      html += '</div>';

      chart.innerHTML = html;
    });

    /* Animate bars with IntersectionObserver */
    var barEls = document.querySelectorAll('.bar-chart__bar[data-width]');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function() {
              el.style.width = el.getAttribute('data-width');
            }, 100);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.2 });
      barEls.forEach(function(el) { observer.observe(el); });
    } else {
      barEls.forEach(function(el) { el.style.width = el.getAttribute('data-width'); });
    }
  }

  renderBarCharts();

  // ===== Hero animation: entrance + number counter =====
  var heroEl = document.querySelector('.hero');
  if (heroEl) {
    // Trigger entrance animation
    setTimeout(function() {
      heroEl.classList.add('hero--loaded');
    }, 100);

    // Number counter animation
    var statNums = heroEl.querySelectorAll('.hero__stat-num[data-count]');
    statNums.forEach(function(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = target;
        }
      }

      // Delay start to sync with entrance animation
      setTimeout(function() {
        requestAnimationFrame(animate);
      }, 1200);
    });
  }

})();

// 新闻分类过滤
(function(){
  var btns = document.querySelectorAll('.news-cat-btn');
  var cards = document.querySelectorAll('.news-card');
  if(!btns.length || !cards.length) return;
  for(var i=0;i<btns.length;i++){
    btns[i].addEventListener('click', function(){
      for(var j=0;j<btns.length;j++) btns[j].classList.remove('active');
      this.classList.add('active');
      var cat = this.getAttribute('data-cat');
      for(var k=0;k<cards.length;k++){
        var cardCat = cards[k].getAttribute('data-cat')||'';
        if(cat==='all' || cardCat.indexOf(cat)>-1){
          cards[k].style.display='';
          cards[k].style.animation='fadeInUp 0.4s ease';
        }else{
          cards[k].style.display='none';
        }
      }
    });
  }
})();

// 首页FAQ手风琴交互（summary +/- 切换）
(function(){
  var dts = document.querySelectorAll('details');
  if(!dts.length) return;
  for(var i=0;i<dts.length;i++){
    dts[i].addEventListener('toggle', function(){
      var icon = this.querySelector('summary span');
      if(!icon) return;
      icon.textContent = this.open ? '−' : '+';
    });
  }
})();

// 留资表单统一提交：企业微信 text 消息（text 类型支持 mentioned_list @成员，由代理脚本注入）
(function(){
  'use strict';
  var forms = document.querySelectorAll('form.lead-form');
  if(!forms.length) return;

  var PHONE_RE = /^(1[3-9]\d{9}|0\d{2,3}-?\d{7,8}|400-?\d{3}-?\d{4})$/;

  function field(form, name){
    var el = form.querySelector('[name="' + name + '"]');
    if(el && el.type === 'checkbox'){
      return el.checked ? el.value : '';
    }
    return el && el.value ? String(el.value).trim() : '';
  }

  function toast(msg, ok){
    var el = document.getElementById('qlkToast');
    if(!el){
      el = document.createElement('div');
      el.id = 'qlkToast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.style.cssText = 'position:fixed;top:84px;left:50%;transform:translateX(-50%) translateY(-10px);' +
        'z-index:9999;max-width:88vw;padding:.7rem 1.15rem;border-radius:8px;color:#fff;' +
        'font-size:.9375rem;opacity:0;pointer-events:none;' +
        'transition:opacity .28s ease,transform .28s ease;';
      document.body.appendChild(el);
    }
    el.style.background = ok ? '#1d4ed8' : '#dc2626';
    el.textContent = msg;
    requestAnimationFrame(function(){
      el.style.opacity = '1';
      el.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(el._timer);
    el._timer = setTimeout(function(){
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 3200);
  }

  function stamp(){
    var d = new Date();
    function p(n){ return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
      ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }

  for(var i = 0; i < forms.length; i++){
    (function(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();

        var name = field(form, 'name');
        var phone = field(form, 'phone');
        var company = field(form, 'company') || '未填写';
        var industry = field(form, 'industry') || '未选择';
        var service = field(form, 'service') || industry;
        var message = field(form, 'message') || '未填写';
        var consent = field(form, 'consent');

        if(!name){ toast('请填写您的称呼', false); return; }
        if(!phone){ toast('请填写联系电话', false); return; }
        if(!PHONE_RE.test(phone)){ toast('请输入有效的联系电话', false); return; }
        if(!consent){ toast('请先同意隐私说明', false); return; }

        var btn = form.querySelector('[type="submit"]');
        var btnText = btn ? btn.textContent : '';
        if(btn){ btn.disabled = true; btn.textContent = '提交中...'; }

        var content = '【企来客官网 - 新客户咨询】\n' +
          '客户姓名：' + name + '\n' +
          '联系电话：' + phone + '\n' +
          '公司名称：' + company + '\n' +
          '所属行业：' + industry + '\n' +
          '咨询服务：' + service + '\n' +
          '详细需求：' + message + '\n' +
          '提交时间：' + stamp() + '\n' +
          '来源页面：' + document.title;

        fetch('https://www.sxqlk.cn/webhook-proxy.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ msgtype: 'text', text: { content: content } })
        }).then(function(res){
          if(res.status === 404){ throw {type:'PROXY_NOT_FOUND'}; }
          if(res.status === 503){ throw {type:'WEBHOOK_NOT_CONFIGURED'}; }
          if(res.status === 429){ throw {type:'RATE_LIMIT'}; }
          if(!res.ok){ throw {type:'HTTP', status:res.status}; }
          return res.json().then(function(data){ return {ok:true, data:data}; }, function(){ return {ok:false, parseError:true}; });
        }).then(function(result){
          if(result.ok && result.data && result.data.errcode === 0){
            toast('提交成功，我们将尽快与您联系', true);
            form.reset();
          }else if(result.ok && result.data && result.data.errmsg){
            toast('提交失败：' + result.data.errmsg + '，请直接拨打 400-805-2163', false);
            console.warn('[QLK LeadForm] webhook error:', result.data);
          }else if(result.ok){
            toast('提交失败，请直接拨打 400-805-2163', false);
          }else{
            toast('响应解析异常，请直接拨打 400-805-2163', false);
          }
        }).catch(function(err){
          var msg = '网络异常，请直接拨打 400-805-2163';
          if(err && err.type === 'PROXY_NOT_FOUND') msg = '通知接口未找到，请联系管理员配置 webhook-proxy.php';
          if(err && err.type === 'WEBHOOK_NOT_CONFIGURED') msg = '企业微信通知未配置，请联系管理员设置 QLK_WECHAT_WEBHOOK_URL';
          if(err && err.type === 'RATE_LIMIT') msg = '提交过于频繁，请稍后再试';
          if(err && err.type === 'HTTP') msg = '服务器响应异常(' + err.status + ')，请直接拨打 400-805-2163';
          toast(msg, false);
          console.error('[QLK LeadForm] submit error:', err);
        }).then(function(){
          if(btn){ btn.disabled = false; btn.textContent = btnText || '提交'; }
        });
      });
    })(forms[i]);
  }
})();
