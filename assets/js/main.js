/**
 * Hermes Official Site - Main Interaction & Modal Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbarScroll();
  initMobileMenu();
  initFaqAccordion();
  initInquiryModal();
  initCodeCopyButtons();
  initRadarProbeMatrix();
});

/* ================= THEME (SYSTEM AUTO-ADAPTIVE + MANUAL OVERRIDE) ================= */
function detectSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function initTheme() {
  const savedTheme = localStorage.getItem('hermes_theme');
  const initialTheme = savedTheme || detectSystemTheme();
  setTheme(initialTheme, false);

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next, true); // Mark as manual user override
    });
  }

  // System OS / browser color scheme listener for live adaptation
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', (e) => {
        const hasManualOverride = localStorage.getItem('hermes_theme_manual') === 'true';
        if (!hasManualOverride) {
          setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  }
}

function setTheme(theme, isManual = false) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('hermes_theme', theme);
  if (isManual) {
    localStorage.setItem('hermes_theme_manual', 'true');
  }
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.textContent = theme === 'light' ? '☀️' : '🌙';
    themeBtn.setAttribute('title', theme === 'light' ? 'Dark Mode / 深色模式' : 'Light Mode / 浅色模式');
  }
}

/* ================= NAVBAR SCROLL ================= */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ================= MOBILE MENU ================= */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    if (navLinks.classList.contains('mobile-open')) {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '76px';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = '#0a0d14';
      navLinks.style.padding = '24px';
      navLinks.style.borderBottom = '1px solid var(--border-subtle)';
    } else {
      navLinks.style.display = '';
    }
  });

  // Close on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        navLinks.style.display = '';
      }
    });
  });
}

/* ================= FAQ ACCORDION ================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(el => el.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ================= INQUIRY DIRECT ROUTING (TELEGRAM) ================= */
function initInquiryModal() {
  const triggerBtns = document.querySelectorAll('.btn-trigger-inquiry');

  window.openInquiryModal = function() {
    window.open('https://t.me/hermes_dns_official', '_blank');
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openInquiryModal();
    });
  });
}

/* ================= CODE COPY BUTTONS ================= */
function initCodeCopyButtons() {
  window.copyTextToClipboard = function(text, feedbackBtn) {
    navigator.clipboard.writeText(text).then(() => {
      if (feedbackBtn) {
        const old = feedbackBtn.textContent;
        feedbackBtn.textContent = '✓ Copied / 已复制';
        setTimeout(() => {
          feedbackBtn.textContent = old;
        }, 2000);
      }
    }).catch(() => {
      alert('Copy: ' + text);
    });
  };
}

/* ================= RUST SDK RADAR TELEMETRY MATRIX (100% i18n) ================= */
function initRadarProbeMatrix() {
  const radarContainer = document.getElementById('radar-container');
  if (!radarContainer) return;

  function renderProbes() {
    // Clear existing probes
    radarContainer.querySelectorAll('.probe-node').forEach(el => el.remove());

    const lang = (typeof currentLang !== 'undefined' && currentLang) || localStorage.getItem('hermes_lang') || 'zh';
    const dict = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};

    // Coordinates carefully tuned with safe borders and directional inwards alignment
    const probeNodes = [
      { id: 'node-bj', name: dict.probe_bj || 'CN-华北 (北京)', top: '24%', left: '72%', latency: '4.2ms', align: 'right' },
      { id: 'node-sh', name: dict.probe_sh || 'CN-华东 (上海)', top: '48%', left: '68%', latency: '6.8ms', align: 'right' },
      { id: 'node-gz', name: dict.probe_gz || 'CN-华南 (广州)', top: '72%', left: '68%', latency: '7.5ms', align: 'right' },
      { id: 'node-hk', name: dict.probe_hk || 'CN-香港 (终端)', top: '82%', left: '50%', latency: '12.4ms', align: 'center' },
      { id: 'node-us', name: dict.probe_us || 'US-美西 (硅谷)', top: '46%', left: '26%', latency: '118ms', align: 'left' },
      { id: 'node-eu', name: dict.probe_eu || 'EU-欧洲 (法兰克福)', top: '22%', left: '38%', latency: '136ms', align: 'center' }
    ];

    probeNodes.forEach(node => {
      const el = document.createElement('div');
      el.className = 'probe-node' + (node.align ? ' align-' + node.align : '');
      el.id = node.id;
      el.style.top = node.top;
      el.style.left = node.left;

      el.innerHTML = `
        <div class="probe-dot"></div>
        <div class="probe-label">${node.name} <span class="latency" style="color:#06b6d4; margin-left:4px;">${node.latency}</span></div>
      `;

      el.addEventListener('click', () => {
        const infoCard = document.getElementById('probe-quick-info');
        if (infoCard) {
          const prefix = dict.rust_probe_info_prefix || '实时众包终端节点：';
          const latPrefix = dict.rust_probe_info_latency || '探测延迟:';
          const statusTxt = dict.rust_probe_info_status || '状态: ✓ 真实客户端探测正常 (无红框/无阻断)';
          infoCard.innerHTML = `<strong>${prefix}</strong> ${node.name} | ${latPrefix} <span style="color:#06b6d4">${node.latency}</span> | <span style="color:#10b981">${statusTxt}</span>`;
        }
      });

      radarContainer.appendChild(el);
    });
  }

  renderProbes();

  // Listen to language switch event
  window.addEventListener('hermesLanguageChanged', () => {
    renderProbes();
  });
}