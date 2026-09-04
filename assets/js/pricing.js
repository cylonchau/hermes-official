/**
 * Hermes Official Site - Commercial Pricing & ROI Calculator
 * Currency: USDT / USDC (Crypto Native)
 * - Source License: 10,000 U (Perpetual, Full Source Code)
 * - Turnkey Binary Suite: Software 699 U + Deploy 99/150 U + Maintenance 150 U/yr
 * - Enterprise SLA Support: Promo 1,199 U/yr (7x12 Expert, UTC+2 Timezone)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPricingCalculator();
});

const pricingTiers = {
  source: {
    basePrice: 10000,
    name: 'Full Source Code Buyout',
    desc: 'Includes full Go backend, Vue3 console, TMA & Rust SDK source code'
  },
  deploy: {
    softwareCurrent: 699,     // 699 USDT current version standalone (no maint/updates)
    softwareSuite: 1999,      // 1,999 USDT promo suite (includes 1-yr maintenance fee & updates)
    deployBasic: 99,          // 99 USDT basic deploy
    deployCluster: 150,       // 150 USDT HA cluster deploy
    monthlySupport: 150,      // 150 USDT / mo expert support
    name: 'Private Turnkey Binary Suite',
    desc: 'Binary license 699 U/yr + deploy 99/150 U + maintenance 150 U/mo'
  },
  support: {
    monthlyPrice: 150,
    annualSLA: 1199,
    name: 'Enterprise 7x12 Support',
    desc: 'Expert online support in UTC+2 timezone with continuous LTS updates'
  }
};

function initPricingCalculator() {
  const domainSlider = document.getElementById('calc-domain-slider');
  const domainValueLabel = document.getElementById('calc-domain-value');

  const edgeSlider = document.getElementById('calc-edge-slider');
  const edgeValueLabel = document.getElementById('calc-edge-value');

  const checkSource = document.getElementById('calc-include-source');
  const checkDeploy = document.getElementById('calc-include-deploy');
  const checkSupport = document.getElementById('calc-include-support');

  const totalPriceEl = document.getElementById('calc-total-price');
  const planSummaryEl = document.getElementById('calc-plan-summary');
  const applyInquiryBtn = document.getElementById('btn-apply-calculator');

  if (!domainSlider || !edgeSlider || !totalPriceEl) return;

  function recalculate() {
    const domainCount = parseInt(domainSlider.value, 10);
    const edgeCount = parseInt(edgeSlider.value, 10);

    const lang = (typeof currentLang !== 'undefined' && currentLang) || localStorage.getItem('hermes_lang') || 'zh';
    const dict = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};

    const unitDomains = dict.calc_domains_unit || '个';
    const unitUnlimited = dict.calc_domains_unlimited || '个 (无限制)';
    const edgeNodesText = dict.calc_edge_nodes_included || '个边缘反代/权威节点 (无限节点支持，无需额外节点费)';

    domainValueLabel.textContent = domainCount >= 5000 ? `${domainCount}+ ${unitUnlimited}` : `${domainCount} ${unitDomains}`;
    edgeValueLabel.textContent = `${edgeCount} ${edgeNodesText}`;

    let total = 0;
    let selectedModules = [];

    // 1. Source License Buyout (10,000 USDT)
    const modSourceTxt = dict.calc_mod_source || '全套源码买断 (10,000 U)';
    const modClusterTxt = dict.calc_mod_deploy_cluster || '商业程序授权 (当前版本 699 U) + 集群部署 (150 U)';
    const modBasicTxt = dict.calc_mod_deploy_basic || '商业程序授权 (当前版本 699 U) + 基础部署 (99 U)';
    const modSupportTxt = dict.calc_mod_support || '企业专家维保 (150 U/月，故障排查与平滑更新)';

    if (checkSource && checkSource.checked) {
      total += pricingTiers.source.basePrice;
      selectedModules.push(modSourceTxt);
    }

    // 2. Binary Program License (699 USDT / yr) + Deploy (99 or 150 USDT)
    // Edge nodes are fully included in 699/yr
    if (checkDeploy && checkDeploy.checked) {
      const softwareFee = pricingTiers.deploy.softwareCurrent || 699; // 699 / year
      const deployFee = edgeCount > 4 ? pricingTiers.deploy.deployCluster : pricingTiers.deploy.deployBasic;
      total += (softwareFee + deployFee);
      if (edgeCount > 4) {
        selectedModules.push(modClusterTxt);
      } else {
        selectedModules.push(modBasicTxt);
      }
    }

    // 3. Maintenance Support: 150 USDT / month (特惠 150 U/月)
    if (checkSupport && checkSupport.checked) {
      const maintFee = pricingTiers.deploy.monthlySupport;
      total += maintFee;
      selectedModules.push(modSupportTxt);
    }

    if (total === 0) {
      total = 699 + 99;
      selectedModules.push(modBasicTxt);
    }

    totalPriceEl.textContent = total.toLocaleString();

    if (planSummaryEl) {
      const summaryTpl = dict.calc_summary_tpl || '已选方案：{modules}，支持 {domains} 域名治理与 {edges} 节点拓扑。支持 USDT/USDC，由技术专家全程在线交付。';
      planSummaryEl.textContent = summaryTpl
        .replace('{modules}', selectedModules.join(' + '))
        .replace('{domains}', domainCount >= 5000 ? `${domainCount}+` : domainCount)
        .replace('{edges}', edgeCount);
    }
  }

  domainSlider.addEventListener('input', recalculate);
  edgeSlider.addEventListener('input', recalculate);

  [checkSource, checkDeploy, checkSupport].forEach(chk => {
    if (chk) chk.addEventListener('change', recalculate);
  });

  // Listen to language change to dynamically refresh calculator labels & summary
  window.addEventListener('hermesLanguageChanged', recalculate);

  if (applyInquiryBtn) {
    applyInquiryBtn.addEventListener('click', () => {
      window.open('https://t.me/hermes_dns_official', '_blank');
    });
  }

  recalculate();
}
