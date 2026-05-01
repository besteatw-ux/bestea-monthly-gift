import { useState, useEffect, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// ── Firebase ──────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCn21w7x65kTN3rmzTsTkZAPQ_vFE9-ELg",
  authDomain: "shopping-cart-d232f.firebaseapp.com",
  projectId: "shopping-cart-d232f",
  storageBucket: "shopping-cart-d232f.firebasestorage.app",
  messagingSenderId: "924200426574",
  appId: "1:924200426574:web:461aa160017c96609cf71f",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveToFirestore(key, data) {
  await setDoc(doc(db, "bestea", key), { data: JSON.stringify(data) });
  localStorage.setItem(key, JSON.stringify(data));
}

// ── 公式 ──────────────────────────────────────────────────────────────────────
const calcT1 = (avg) => (avg ? Math.round(avg * 1.5 + 500) : null);
const calcT2 = (avg) => {
  const t1 = calcT1(avg);
  return t1 ? t1 * 2 : null;
};

// ── 資料 ──────────────────────────────────────────────────────────────────────
const INIT_PRODUCTS = [
  {
    id: "p1",
    name: "木柵鐵觀音",
    spec: "50G",
    cost: 100,
    price: 680,
    series: "濃郁",
  },
  {
    id: "p2",
    name: "鹿野紅烏龍",
    spec: "75G",
    cost: 118.75,
    price: 750,
    series: "紅茶",
  },
  {
    id: "p3",
    name: "梨山白茶",
    spec: "30G",
    cost: 100,
    price: 780,
    series: "清香",
  },
  {
    id: "p4",
    name: "福壽山義莊",
    spec: "50G",
    cost: 158,
    price: 1200,
    series: "巔峰",
  },
  {
    id: "p5",
    name: "福壽山茶王",
    spec: "30G",
    cost: 120,
    price: 980,
    series: "巔峰",
  },
  {
    id: "p6",
    name: "梨山紅茶",
    spec: "75G",
    cost: 125,
    price: 850,
    series: "紅茶",
  },
  {
    id: "p7",
    name: "華崗紅茶",
    spec: "75G",
    cost: 250,
    price: 1500,
    series: "紅茶",
  },
  {
    id: "p8",
    name: "梨山吊橋頭",
    spec: "75G",
    cost: 137.5,
    price: 1200,
    series: "巔峰",
  },
  {
    id: "p9",
    name: "茶王",
    spec: "75G",
    cost: 300,
    price: 2200,
    series: "巔峰",
  },
  {
    id: "p10",
    name: "華崗",
    spec: "75G",
    cost: 156.25,
    price: 1380,
    series: "巔峰",
  },
  {
    id: "p11",
    name: "大禹嶺 90K",
    spec: "30G",
    cost: 200,
    price: 1800,
    series: "巔峰",
  },
];

const INIT_PLANS = {
  2025: {
    七月: {
      avgOrderValue: 3533,
      t1ProductId: "p1",
      t2ProductId: null,
      enableT2: false,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
    八月: {
      avgOrderValue: 3533,
      t1ProductId: "p2",
      t2ProductId: null,
      enableT2: false,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
    九月: {
      avgOrderValue: 3533,
      t1ProductId: "p3",
      t2ProductId: null,
      enableT2: false,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
    十月: {
      avgOrderValue: 4067,
      t1ProductId: "p4",
      t2ProductId: null,
      enableT2: false,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
    十一月: {
      avgOrderValue: 3867,
      t1ProductId: "p5",
      t2ProductId: null,
      enableT2: false,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
    十二月: {
      avgOrderValue: 4067,
      t1ProductId: "p1",
      t2ProductId: null,
      enableT2: false,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
  },
  2026: {
    一月: {
      avgOrderValue: 4000,
      t1ProductId: "p6",
      t2ProductId: "p7",
      enableT2: true,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
    二月: {
      avgOrderValue: 4267,
      t1ProductId: "p8",
      t2ProductId: "p9",
      enableT2: true,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
    三月: {
      avgOrderValue: 4000,
      t1ProductId: "p6",
      t2ProductId: "p10",
      enableT2: true,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
    四月: {
      avgOrderValue: 4000,
      t1ProductId: "p1",
      t2ProductId: "p10",
      enableT2: true,
      t1Note: "",
      t2Note: "",
      executed: false,
    },
  },
};

const MONTHS = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];
const SERIES_LIST = ["巔峰", "清香", "濃郁", "熟香", "紅茶", "奶香", "果香"];
const SERIES_STYLES = {
  巔峰: { bg: "#FFF8E1", color: "#5D4037" },
  清香: { bg: "#E0F7FA", color: "#00695C" },
  濃郁: { bg: "#E8F5E9", color: "#2E7D32" },
  熟香: { bg: "#FFF3E0", color: "#E65100" },
  紅茶: { bg: "#FCE4EC", color: "#880E4F" },
  奶香: { bg: "#F3E5F5", color: "#4A148C" },
  果香: { bg: "#EDE7F6", color: "#311B92" },
};

// ── 規則 ──────────────────────────────────────────────────────────────────────
const RULES = {
  repeatGap: 3,
  T1: {
    valueMin: 5.0,
    valueMax: 7.0,
    valueTarget: 6.0,
    costMax: 2.4,
    costTarget: 1.8,
  },
  T2: {
    valueMin: 4.3,
    valueMax: 5.8,
    valueTarget: 5.0,
    costMax: 2.1,
    costTarget: 1.6,
  },
};

// ── helpers ───────────────────────────────────────────────────────────────────
const getRatio = (cost, amt) => (!cost || !amt ? null : (cost / amt) * 100);
const ratioBarColor = (r) =>
  !r ? "#ccc" : r >= 60 ? "#E53935" : r >= 48 ? "#FB8C00" : "#43A047";
const uid = () => "p" + Math.random().toString(36).slice(2, 8);
const loadLS = (k, fb) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fb;
  } catch {
    return fb;
  }
};

function valueStatus(v, tier) {
  if (!v) return "none";
  const r = RULES[tier];
  if (v < r.valueMin || v > r.valueMax) return "out";
  if (Math.abs(v - r.valueTarget) <= 0.5) return "good";
  return "ok";
}
function costStatus(c, tier) {
  if (!c) return "none";
  const r = RULES[tier];
  if (c > r.costMax) return "out";
  if (c <= r.costTarget) return "good";
  return "ok";
}

function checkRepeat(plans, year, month, productId) {
  if (!productId) return null;
  const monthIdx = MONTHS.indexOf(month);
  const warnings = [];
  for (let d = 1; d <= RULES.repeatGap; d++) {
    for (const delta of [-d, d]) {
      let idx = monthIdx + delta,
        y = year;
      if (idx < 0) {
        idx += 12;
        y -= 1;
      }
      if (idx > 11) {
        idx -= 12;
        y += 1;
      }
      const p = plans[y]?.[MONTHS[idx]];
      if (!p) continue;
      const ids = [p.t1ProductId, ...(p.enableT2 ? [p.t2ProductId] : [])];
      if (ids.includes(productId)) warnings.push(`${y}年${MONTHS[idx]}`);
    }
  }
  return warnings.length ? warnings : null;
}

// 建議贈品：符合規則、不重複、按價值感排序
function getSuggestions(products, plans, year, month, threshold, tier) {
  if (!threshold) return [];
  return products
    .map((p) => {
      const v = p.price ? (p.price / threshold) * 100 : null;
      const c = p.cost ? (p.cost / threshold) * 100 : null;
      const r = RULES[tier];
      if (!v || !c) return null;
      if (v < r.valueMin || v > r.valueMax) return null;
      if (c > r.costMax) return null;
      const repeat = checkRepeat(plans, year, month, p.id);
      return { ...p, v, c, repeat };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.repeat && !b.repeat) return 1;
      if (!a.repeat && b.repeat) return -1;
      return (
        Math.abs(a.v - RULES[tier].valueTarget) -
        Math.abs(b.v - RULES[tier].valueTarget)
      );
    });
}

// 商品使用統計
function getProductUsage(products, plans) {
  const usage = {};
  products.forEach((p) => {
    usage[p.id] = { count: 0, lastMonth: null, lastYear: null };
  });
  Object.entries(plans).forEach(([y, yp]) => {
    MONTHS.forEach((m) => {
      const plan = yp[m];
      if (!plan) return;
      [plan.t1ProductId, ...(plan.enableT2 ? [plan.t2ProductId] : [])].forEach(
        (id) => {
          if (!id || !usage[id]) return;
          usage[id].count++;
          const mIdx = MONTHS.indexOf(m);
          const lastIdx = usage[id].lastMonth
            ? MONTHS.indexOf(usage[id].lastMonth)
            : -1;
          if (
            parseInt(y) > (usage[id].lastYear || 0) ||
            (parseInt(y) === usage[id].lastYear && mIdx > lastIdx)
          ) {
            usage[id].lastMonth = m;
            usage[id].lastYear = parseInt(y);
          }
        }
      );
    });
  });
  return usage;
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500&family=Noto+Sans+TC:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans TC',sans-serif;background:#FAF8F4;color:#1E1C18;-webkit-font-smoothing:antialiased}

/* topbar */
.topbar{background:#1E1C18;padding:0 2.5rem;display:flex;align-items:center;justify-content:space-between;height:54px;position:sticky;top:0;z-index:300}
.topbar-brand{font-family:'Noto Serif TC',serif;font-size:15px;font-weight:500;color:#F0E8D8;letter-spacing:.1em}
.topbar-brand span{color:rgba(240,232,216,.35);font-size:11px;margin-left:14px;font-family:'DM Mono',monospace;font-weight:400;letter-spacing:.06em}
.nav-tabs{display:flex;gap:1px}
.nav-tab{padding:7px 22px;font-size:12px;font-weight:500;border:none;background:transparent;color:rgba(240,232,216,.4);cursor:pointer;transition:all .2s;letter-spacing:.06em}
.nav-tab:hover{color:rgba(240,232,216,.8)}
.nav-tab.active{color:#F0E8D8;border-bottom:1.5px solid rgba(240,232,216,.55)}

.layout{display:flex;min-height:calc(100vh - 54px)}
.main{flex:1;padding:2rem 2.5rem;max-width:100%;transition:margin-right .3s ease;min-width:0}
.main.panel-open{margin-right:440px}

/* stats */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-bottom:0;border:1px solid #D8D4CC;background:#D8D4CC}
.stat-card{background:#FAF8F4;padding:20px 22px}
.stat-card.positive{} .stat-card.negative{} .stat-card.neutral{}
.stat-label{font-size:10px;font-weight:500;color:#9C9890;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;font-family:'DM Mono',monospace}
.stat-value{font-size:30px;font-weight:500;color:#1E1C18;font-family:'DM Mono',monospace;line-height:1;letter-spacing:-.02em}
.stat-sub{font-size:11px;color:#A8A49C;margin-top:7px;font-weight:400;letter-spacing:.04em}

/* progress bar */
.progress-bar-wrap{background:#F2EFE8;border-top:1px solid #D8D4CC;border-bottom:1px solid #D8D4CC;padding:12px 22px;margin-bottom:1.75rem;display:flex;align-items:center;gap:16px}
.progress-bar-bg{flex:1;height:2px;background:#C8C4BA;position:relative}
.progress-bar-fill{position:absolute;top:0;left:0;height:2px;background:#5A5650;transition:width .6s ease}
.progress-label{font-size:11px;color:#9C9890;white-space:nowrap;font-family:'DM Mono',monospace;font-weight:400;letter-spacing:.06em}
.progress-pending{font-size:11px;color:#8A4A3A;background:transparent;border:1px solid #C09080;padding:3px 10px;white-space:nowrap;letter-spacing:.06em;font-family:'DM Mono',monospace}

/* year row */
.year-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem}
.year-row h2{font-family:'Noto Serif TC',serif;font-size:18px;font-weight:400;color:#1E1C18;letter-spacing:.16em}
.year-pills{display:flex;gap:0;border:1px solid #D8D4CC}
.year-pill{padding:6px 18px;font-size:11px;font-family:'DM Mono',monospace;border:none;border-right:1px solid #D8D4CC;background:transparent;cursor:pointer;color:#9C9890;transition:all .2s;font-weight:400;letter-spacing:.06em}
.year-pill:last-child{border-right:none}
.year-pill.active{background:#1E1C18;color:#F0E8D8}

/* month grid */
.month-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-bottom:2rem;border:1px solid #D8D4CC;background:#D8D4CC}
.month-card{background:#FAF8F4;padding:18px 20px;cursor:pointer;transition:background .2s;min-height:150px;position:relative}
.month-card:hover{background:#F0ECE4}
.month-card.active{background:#1E1C18}
.month-card.active .month-name{color:#F0E8D8}
.month-card.active .month-avg{color:rgba(240,232,216,.4)}
.month-card.active .tier-gift{color:rgba(240,232,216,.85)}
.month-card.active .meta-threshold{color:rgba(240,232,216,.3)}
.month-card.active .month-head{border-bottom-color:rgba(255,255,255,.08)}
.month-card.active .t1{color:#90C4A0;border-color:rgba(144,196,160,.35)}
.month-card.active .t2{color:#9090C4;border-color:rgba(144,144,196,.35)}
.month-card.empty-card{background:#F5F2EB;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:150px}
.month-card.empty-card:hover{background:#EDE8DF}
.empty-plus{width:32px;height:32px;border:1px solid #C0BCB4;display:flex;align-items:center;justify-content:center;font-size:18px;color:#B0ACA4;transition:all .25s}
.month-card.empty-card:hover .empty-plus{border-color:#6C6860;color:#4C4840}
.empty-month-name{font-family:'Noto Serif TC',serif;font-size:13px;color:#B8B4AC;font-weight:400;letter-spacing:.14em}
.month-card.empty-card:hover .empty-month-name{color:#6C6860}
.month-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #E4E0D8}
.month-name{font-family:'Noto Serif TC',serif;font-size:14px;font-weight:500;color:#1E1C18;letter-spacing:.12em}
.month-avg{font-size:10px;color:#A8A49C;font-family:'DM Mono',monospace;font-weight:400;letter-spacing:.04em}
.tier-row{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px}
.tier-badge{font-size:10px;padding:2px 8px;border-radius:0;flex-shrink:0;font-family:'DM Mono',monospace;font-weight:500;letter-spacing:.06em;border:1px solid}
.t1{color:#3A6A4A;border-color:#8AB49A;background:transparent}
.t2{color:#3A3A7A;border-color:#8A8AB4;background:transparent}
.tier-gift{font-size:12px;color:#2E2C28;line-height:1.5;font-weight:400;letter-spacing:.04em}
.tier-meta{font-size:11px;color:#A8A49C;margin-top:5px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-family:'DM Mono',monospace;font-weight:400}
.meta-threshold{font-size:11px;color:#B8B4AC;font-family:'DM Mono',monospace;margin-right:2px;font-weight:400}
.meta-badge{font-size:10px;padding:2px 7px;border-radius:0;font-weight:500;font-family:'DM Mono',monospace;white-space:nowrap;letter-spacing:.04em;border:1px solid}
.badge-good{color:#3A6A4A;border-color:#8AB49A;background:transparent}
.badge-ok{color:#7A5A3A;border-color:#B49A6A;background:transparent}
.badge-out{color:#7A3A3A;border-color:#B47A7A;background:transparent}
.badge-none{color:#B8B4AC;border-color:#D8D4CC;background:transparent}
.repeat-warn{font-size:10px;color:#7A3A3A;border:1px solid #B47A7A;padding:1px 7px;margin-top:3px;display:inline-block;font-family:'DM Mono',monospace;letter-spacing:.04em}
.card-status{position:absolute;top:14px;right:14px;width:6px;height:6px;border-radius:50%}
.month-card.executed{background:#F2EFE8}
.month-card.executed .month-name{color:#A8A49C}
.month-card.executed .tier-gift{color:#B8B4AC}
.month-card.executed .meta-threshold{color:#CCC8C0}
.executed-stamp{position:absolute;bottom:12px;right:14px;font-size:9px;color:#B8B4AC;font-family:'DM Mono',monospace;letter-spacing:.12em;text-transform:uppercase}
.exec-banner{background:#1E1C18;padding:12px 16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}
.exec-banner-text{font-size:11px;color:#9C9890;display:flex;align-items:center;gap:6px;letter-spacing:.08em;font-family:'DM Mono',monospace}

/* slide panel */
.slide-panel{position:fixed;top:54px;right:0;width:440px;height:calc(100vh - 54px);background:#FAF8F4;border-left:1px solid #D8D4CC;z-index:200;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);overflow-y:auto;display:flex;flex-direction:column}
.slide-panel.open{transform:translateX(0)}
.panel-header{padding:1.5rem 1.75rem;border-bottom:1px solid #E4E0D8;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#FAF8F4;z-index:1}
.panel-title{font-family:'Noto Serif TC',serif;font-size:16px;font-weight:400;color:#1E1C18;letter-spacing:.14em}
.panel-actions{display:flex;gap:8px}
.panel-body{padding:1.5rem 1.75rem;flex:1}
.panel-footer{padding:1rem 1.75rem;border-top:1px solid #E4E0D8;display:flex;gap:8px;justify-content:flex-end;position:sticky;bottom:0;background:#FAF8F4}

/* avg input */
.avg-input-box{background:#EDE9E0;border:none;border-left:3px solid #8C8880;padding:14px 18px;margin-bottom:1.25rem}
.avg-input-title{font-size:10px;color:#6C6860;margin-bottom:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;font-family:'DM Mono',monospace}
.avg-input-row{display:flex;align-items:center;gap:10px}
.avg-result-row{display:flex;gap:24px;margin-top:12px;flex-wrap:wrap}
.avg-result-item{font-size:11px;color:#6C6860;letter-spacing:.04em}
.avg-result-item strong{font-family:'DM Mono',monospace;font-size:18px;color:#1E1C18;margin-left:6px;font-weight:500}
.avg-result-formula{font-size:9px;color:#A8A49C;margin-left:3px}

.avg-banner{background:#EDE9E0;padding:14px 16px;margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;border-left:3px solid #A8A49C}
.avg-banner-label{font-size:10px;color:#8C8880;margin-bottom:4px;text-transform:uppercase;letter-spacing:.14em;font-family:'DM Mono',monospace}
.avg-banner-value{font-size:18px;font-weight:500;color:#1E1C18;font-family:'DM Mono',monospace}
.avg-formula{font-size:9px;color:#B8B4AC;margin-left:4px}
.banner-divider{width:1px;height:30px;background:#D8D4CC;flex-shrink:0}

.tier-detail{border:none;border-left:3px solid #E4E0D8;padding:.875rem 1.25rem;margin-bottom:14px}
.tier-detail-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.tier-detail-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.dg-label{font-size:10px;color:#9C9890;text-transform:uppercase;letter-spacing:.14em;margin-bottom:5px;font-family:'DM Mono',monospace}
.dg-value{font-size:18px;font-weight:500;color:#1E1C18;font-family:'DM Mono',monospace}
.dg-sub{font-size:11px;color:#A8A49C;margin-top:3px}
.ratio-bar{height:2px;background:#E4E0D8;margin-top:8px}
.ratio-fill{height:100%;transition:width .5s ease}

.last-year-box{background:#EDE9E0;border:none;border-left:3px solid #B8A882;padding:12px 14px;margin-bottom:14px}
.last-year-title{font-size:10px;color:#9C9890;text-transform:uppercase;letter-spacing:.14em;margin-bottom:8px;font-family:'DM Mono',monospace}
.last-year-row{display:flex;gap:8px;align-items:center;margin-bottom:4px}

.suggest-section{margin-bottom:1rem}
.suggest-title{font-size:10px;color:#9C9890;text-transform:uppercase;letter-spacing:.14em;margin-bottom:10px;display:flex;align-items:center;gap:6px;font-family:'DM Mono',monospace}
.suggest-card{border:none;border-bottom:1px solid #E4E0D8;padding:11px 4px;cursor:pointer;transition:all .2s;background:transparent;display:flex;justify-content:space-between;align-items:center}
.suggest-card:last-of-type{border-bottom:none}
.suggest-card:hover{background:#EDE9E0;padding-left:10px}
.suggest-card.selected{background:#EDE9E0;padding-left:10px;border-left:3px solid #3A6A4A}
.suggest-card.has-repeat{opacity:.55}
.suggest-left{display:flex;flex-direction:column;gap:3px}
.suggest-name{font-size:13px;color:#1E1C18;font-weight:400;letter-spacing:.04em}
.suggest-meta{display:flex;gap:5px;align-items:center;flex-wrap:wrap}
.suggest-right{display:flex;align-items:center;gap:6px}

.tier-section-head{font-size:10px;font-weight:500;margin-bottom:10px;display:flex;align-items:center;gap:7px;text-transform:uppercase;letter-spacing:.14em;color:#6C6860;font-family:'DM Mono',monospace}
.picker-toggle{font-size:10px;color:#9C9890;cursor:pointer;margin-left:auto;padding:3px 10px;border:1px solid #D8D4CC;background:transparent;transition:all .2s;letter-spacing:.08em;font-family:'DM Mono',monospace}
.picker-toggle:hover{color:#1E1C18;border-color:#6C6860}
.form-group{margin-bottom:1rem}
.form-label{font-size:10px;color:#9C9890;margin-bottom:6px;display:block;font-weight:400;text-transform:uppercase;letter-spacing:.14em;font-family:'DM Mono',monospace}
.form-input,.form-select{width:100%;padding:9px 12px;font-size:13px;font-family:'Noto Sans TC',sans-serif;border:none;border-bottom:1px solid #C8C4BA;border-radius:0;background:transparent;color:#1E1C18;outline:none;transition:border-color .2s;font-weight:400}
.form-input:focus,.form-select:focus{border-bottom-color:#1E1C18}
.form-section{margin:1.25rem 0 .75rem;padding-top:1.25rem;border-top:1px solid #E4E0D8;display:flex;justify-content:space-between;align-items:center}
.product-picker{border:1px solid #D8D4CC;overflow:hidden;max-height:200px;overflow-y:auto}
.product-option{padding:10px 14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #EDE9E0;transition:background .15s}
.product-option:last-child{border-bottom:none}
.product-option:hover{background:#EDE9E0}
.product-option.selected{background:#EDE9E0;border-left:3px solid #3A6A4A}
.product-opt-left{display:flex;flex-direction:column}
.product-opt-name{font-size:13px;color:#1E1C18;font-weight:400;letter-spacing:.04em}
.product-opt-spec{font-size:11px;color:#A8A49C;margin-top:2px;font-family:'DM Mono',monospace}
.product-opt-right{display:flex;gap:8px;align-items:center}
.series-tag{font-size:10px;padding:2px 7px;border:1px solid;letter-spacing:.06em;font-family:'DM Mono',monospace}
.product-opt-cost{font-size:11px;color:#6C6860;font-family:'DM Mono',monospace;font-weight:400}
.ratio-preview{font-size:11px;padding:8px 12px;background:#EDE9E0;margin-top:6px;color:#6C6860;border-left:3px solid #A8A49C;line-height:1.6;letter-spacing:.04em;font-family:'DM Mono',monospace}
.repeat-inline{font-size:11px;color:#7A3A3A;border:1px solid #B47A7A;padding:5px 10px;margin-top:6px;letter-spacing:.06em;font-family:'DM Mono',monospace}

.lib-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
.lib-table{width:100%;border-collapse:collapse;background:transparent}
.lib-table th{font-size:10px;color:#9C9890;text-transform:uppercase;letter-spacing:.14em;padding:10px 16px;border-bottom:2px solid #C8C4BA;text-align:left;font-weight:500;font-family:'DM Mono',monospace}
.lib-table td{padding:13px 16px;font-size:13px;color:#2E2C28;border-bottom:1px solid #EDE9E0;font-weight:400}
.lib-table tr:last-child td{border-bottom:none}
.lib-table tr:hover td{background:#EDE9E0}
.product-name-cell{font-weight:500;color:#1E1C18;letter-spacing:.04em}
.usage-badge{font-size:10px;padding:2px 8px;border:1px solid #D8D4CC;color:#6C6860;font-family:'DM Mono',monospace;background:transparent;letter-spacing:.06em}

.btn{padding:9px 20px;font-size:12px;font-weight:500;font-family:'Noto Sans TC',sans-serif;border:1px solid #C8C4BA;cursor:pointer;background:transparent;color:#1E1C18;transition:all .2s;display:inline-flex;align-items:center;gap:6px;letter-spacing:.06em}
.btn:hover{background:#EDE9E0}
.btn-primary{background:#1E1C18;color:#F0E8D8;border-color:#1E1C18}
.btn-primary:hover{background:#2E2C28}
.btn-ghost{border-color:transparent}
.btn-ghost:hover{background:#EDE9E0;border-color:#D8D4CC}
.btn-sm{padding:5px 14px;font-size:11px}
.icon-btn{width:32px;height:32px;border:1px solid #D8D4CC;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#9C9890;transition:all .2s;font-size:13px;flex-shrink:0}
.icon-btn:hover{background:#EDE9E0;color:#1E1C18;border-color:#8C8880}
.icon-btn.danger:hover{color:#7A3A3A;border-color:#B47A7A;background:transparent}

.modal-overlay{position:fixed;inset:0;background:rgba(30,28,24,.5);display:flex;align-items:center;justify-content:center;z-index:400;padding:1rem}
.modal{background:#FAF8F4;width:100%;max-width:500px;border:1px solid #C8C4BA}
.modal-header{padding:1.5rem 1.75rem;border-bottom:1px solid #E4E0D8;display:flex;justify-content:space-between;align-items:center}
.modal-title{font-family:'Noto Serif TC',serif;font-size:16px;font-weight:400;color:#1E1C18;letter-spacing:.14em}
.modal-body{padding:1.5rem 1.75rem}
.modal-footer{padding:1rem 1.75rem;border-top:1px solid #E4E0D8;display:flex;justify-content:flex-end;gap:8px}

.ratio-good{color:#3A6A4A}
.ratio-ok{color:#7A5A3A}
.ratio-high{color:#7A3A3A}
.no-select{color:#B8B4AC;font-size:12px;padding:2rem;text-align:center;letter-spacing:.08em}

@media(max-width:900px){.main.panel-open{margin-right:0}}
@media(max-width:700px){.stats-grid{grid-template-columns:repeat(2,1fr)}.month-grid{grid-template-columns:repeat(3,1fr)}.tier-detail-grid{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.month-grid{grid-template-columns:repeat(2,1fr)}.main{padding:1.25rem}}
`;

// ── ProductPicker (全庫搜尋模式) ─────────────────────────────────────────────
function ProductPicker({ products, value, onChange, threshold, tier }) {
  const [search, setSearch] = useState("");
  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.includes(search) ||
      p.series.includes(search) ||
      p.spec.includes(search)
  );
  const selected = products.find((p) => p.id === value);
  const v =
    selected?.price && threshold ? (selected.price / threshold) * 100 : null;
  const c =
    selected?.cost && threshold ? (selected.cost / threshold) * 100 : null;
  return (
    <div>
      <input
        className="form-input"
        style={{ marginBottom: 6 }}
        placeholder="搜尋商品名稱或系列…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="product-picker">
        {filtered.length === 0 ? (
          <div style={{ padding: "10px 12px", fontSize: 12, color: "#aaa" }}>
            無符合商品
          </div>
        ) : (
          filtered.map((p) => {
            const s = SERIES_STYLES[p.series] || {
              bg: "#f0f0f0",
              color: "#666",
            };
            const sel = p.id === value;
            return (
              <div
                key={p.id}
                className={`product-option${sel ? " selected" : ""}`}
                onClick={() => onChange(p.id)}
              >
                <div className="product-opt-left">
                  <span className="product-opt-name">{p.name}</span>
                  <span className="product-opt-spec">{p.spec}</span>
                </div>
                <div className="product-opt-right">
                  <span
                    className="series-tag"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {p.series}
                  </span>
                  <span className="product-opt-cost">${p.cost}</span>
                  {sel && <span style={{ color: "#D4B483" }}>✓</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
      {selected && v != null && (
        <div className="ratio-preview">
          {selected.name} {selected.spec}　
          <span className={`meta-badge badge-${valueStatus(v, tier || "T1")}`}>
            價值感 {v.toFixed(1)}%
          </span>{" "}
          <span className={`meta-badge badge-${costStatus(c, tier || "T1")}`}>
            成本 {c?.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}

// ── SuggestionPicker ──────────────────────────────────────────────────────────
function SuggestionPicker({
  products,
  plans,
  year,
  month,
  value,
  onChange,
  threshold,
  tier,
  onQuickAdd,
}) {
  const [showAll, setShowAll] = useState(false);
  const suggestions = getSuggestions(
    products,
    plans,
    year,
    month,
    threshold,
    tier
  );

  if (!threshold)
    return (
      <div style={{ fontSize: 12, color: "#bbb", padding: "8px 0" }}>
        請先輸入客單價
      </div>
    );

  return (
    <div>
      <div className="suggest-section">
        <div className="suggest-title">
          ✦ 系統推薦
          <span style={{ color: "#bbb", fontWeight: 400, fontSize: 10 }}>
            （符合規則、間隔達標）
          </span>
          <button
            className="picker-toggle"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "收起全庫" : "顯示全庫"}
          </button>
        </div>
        {suggestions.length === 0 && (
          <div style={{ fontSize: 11, color: "#aaa", padding: "6px 0" }}>
            目前無完全符合規則的商品，請從全庫選擇
          </div>
        )}
        {suggestions.map((p) => {
          const s = SERIES_STYLES[p.series] || { bg: "#f0f0f0", color: "#666" };
          const sel = p.id === value;
          return (
            <div
              key={p.id}
              className={`suggest-card${sel ? " selected" : ""}${
                p.repeat ? " has-repeat" : ""
              }`}
              onClick={() => onChange(p.id)}
            >
              <div className="suggest-left">
                <div className="suggest-name">
                  {p.name}{" "}
                  <span style={{ fontSize: 11, color: "#888" }}>{p.spec}</span>
                </div>
                <div className="suggest-meta">
                  <span
                    className="series-tag"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {p.series}
                  </span>
                  <span
                    className={`meta-badge badge-${valueStatus(p.v, tier)}`}
                  >
                    價值感 {p.v.toFixed(1)}%
                  </span>
                  <span className={`meta-badge badge-${costStatus(p.c, tier)}`}>
                    成本 {p.c.toFixed(1)}%
                  </span>
                  {p.repeat && (
                    <span className="meta-badge badge-out">⚠ 近期重複</span>
                  )}
                </div>
              </div>
              <div className="suggest-right">
                <span
                  style={{
                    fontSize: 12,
                    color: "#888",
                    fontFamily: "'DM Mono',monospace",
                  }}
                >
                  ${p.cost}
                </span>
                {sel && (
                  <span style={{ color: "#D4B483", marginLeft: 4 }}>✓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showAll && (
        <div className="suggest-section">
          <div className="suggest-title">全部商品庫</div>
          <ProductPicker
            products={products}
            value={value}
            onChange={onChange}
            threshold={threshold}
            tier={tier}
          />
        </div>
      )}

      <button
        className="btn btn-ghost btn-sm"
        style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}
        onClick={onQuickAdd}
      >
        ＋ 新增商品到庫存
      </button>
    </div>
  );
}

// ── PlanPanel ─────────────────────────────────────────────────────────────────
function PlanPanel({
  month,
  year,
  plan,
  plans,
  products,
  onSave,
  onDelete,
  onToggleExecuted,
  onClose,
  onQuickAddProduct,
}) {
  const [mode, setMode] = useState(plan ? "view" : "edit");
  const [avg, setAvg] = useState(plan?.avgOrderValue || "");
  const [t1Override, setT1Override] = useState(plan?.t1Override || "");
  const [t2Override, setT2Override] = useState(plan?.t2Override || "");
  const [t1Id, setT1Id] = useState(plan?.t1ProductId || "");
  const [t2Id, setT2Id] = useState(plan?.t2ProductId || "");
  const [enableT2, setEnableT2] = useState(plan?.enableT2 || false);
  const [t1Note, setT1Note] = useState(plan?.t1Note || "");
  const [t2Note, setT2Note] = useState(plan?.t2Note || "");

  useEffect(() => {
    if (plan) {
      setAvg(plan.avgOrderValue || "");
      setT1Id(plan.t1ProductId || "");
      setT2Id(plan.t2ProductId || "");
      setEnableT2(plan.enableT2 || false);
      setT1Note(plan.t1Note || "");
      setT2Note(plan.t2Note || "");
      setT1Override(plan.t1Override || "");
      setT2Override(plan.t2Override || "");
      setMode("view");
    } else {
      setMode("edit");
      setAvg("");
      setT1Id("");
      setT2Id("");
      setEnableT2(false);
      setT1Note("");
      setT2Note("");
      setT1Override("");
      setT2Override("");
    }
  }, [month, plan]);

  const avgNum = parseFloat(avg);
  const t1 = t1Override ? parseFloat(t1Override) : calcT1(avgNum);
  const t2 = t2Override ? parseFloat(t2Override) : calcT2(avgNum);
  const t1p = products.find((p) => p.id === t1Id);
  const t2p = products.find((p) => p.id === t2Id);

  // 跨年對比：上一年同月
  const prevYearPlan = plans[year - 1]?.[month];
  const prevT1p = prevYearPlan
    ? products.find((p) => p.id === prevYearPlan.t1ProductId)
    : null;
  const prevT2p = prevYearPlan?.enableT2
    ? products.find((p) => p.id === prevYearPlan.t2ProductId)
    : null;

  const handleSave = () => {
    if (!avg || !t1Id) return alert("請輸入客單價並選擇 T1 贈品");
    if (enableT2 && !t2Id) return alert("請選擇 T2 贈品，或取消 T2 方案");
    onSave({
      avgOrderValue: avgNum,
      t1Override: t1Override ? parseFloat(t1Override) : null,
      t2Override: t2Override ? parseFloat(t2Override) : null,
      t1ProductId: t1Id,
      t2ProductId: enableT2 ? t2Id : null,
      enableT2,
      t1Note,
      t2Note,
    });
    setMode("view");
  };

  const renderView = () => {
    if (!plan) return null;
    const tv1 = plan.t1Override || calcT1(plan.avgOrderValue),
      tv2 = plan.t2Override || calcT2(plan.avgOrderValue);
    const rows = [
      {
        label: "一",
        badge: "t1",
        threshold: tv1,
        product: t1p,
        ratio: getRatio(t1p?.cost, tv1),
        note: plan.t1Note,
        tier: "T1",
      },
      ...(plan.enableT2
        ? [
            {
              label: "二",
              badge: "t2",
              threshold: tv2,
              product: t2p,
              ratio: getRatio(t2p?.cost, tv2),
              note: plan.t2Note,
              tier: "T2",
            },
          ]
        : []),
    ];
    return (
      <>
        {/* 跨年對比 */}
        {prevYearPlan && (
          <div className="last-year-box">
            <div className="last-year-title">{year - 1}年同月參考</div>
            {prevT1p && (
              <div className="last-year-row">
                <span className="tier-badge t1" style={{ fontSize: 10 }}>
                  T1
                </span>
                <span style={{ fontSize: 12, color: "#666" }}>
                  {prevT1p.name} {prevT1p.spec}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#aaa",
                    fontFamily: "'DM Mono',monospace",
                  }}
                >
                  客單 ${prevYearPlan.avgOrderValue?.toLocaleString()}
                </span>
              </div>
            )}
            {prevT2p && (
              <div className="last-year-row">
                <span className="tier-badge t2" style={{ fontSize: 10 }}>
                  T2
                </span>
                <span style={{ fontSize: 12, color: "#666" }}>
                  {prevT2p.name} {prevT2p.spec}
                </span>
              </div>
            )}
          </div>
        )}

        {plan.executed ? (
          <div className="exec-banner">
            <div className="exec-banner-text">✓ 已執行 — 此方案已鎖定</div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: "#888", fontSize: 11, borderColor: "#444" }}
              onClick={() => onToggleExecuted(month)}
            >
              取消執行
            </button>
          </div>
        ) : null}
        <div className="avg-banner">
          <div>
            <div className="avg-banner-label">客單價</div>
            <div className="avg-banner-value">
              ${plan.avgOrderValue?.toLocaleString()}
            </div>
          </div>
          <div className="banner-divider" />
          <div>
            <div className="avg-banner-label">T1 門檻</div>
            <div className="avg-banner-value">
              ${tv1?.toLocaleString()}
              <span className="avg-formula">×1.5+500</span>
            </div>
          </div>
          {plan.enableT2 && (
            <>
              <div className="banner-divider" />
              <div>
                <div className="avg-banner-label">T2 門檻</div>
                <div className="avg-banner-value">
                  ${tv2?.toLocaleString()}
                  <span className="avg-formula">T1×2</span>
                </div>
              </div>
            </>
          )}
        </div>
        {rows.map((row) => {
          const s = row.product
            ? SERIES_STYLES[row.product.series] || {
                bg: "#f0f0f0",
                color: "#666",
              }
            : {};
          const v =
            row.product?.price && row.threshold
              ? (row.product.price / row.threshold) * 100
              : null;
          return (
            <div key={row.label} className="tier-detail">
              <div className="tier-detail-head">
                <span
                  className={`tier-badge ${row.badge}`}
                  style={{ fontSize: 11, padding: "2px 9px" }}
                >
                  門檻{row.label}
                </span>
                {row.product && (
                  <span
                    className="series-tag"
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      background: s.bg,
                      color: s.color,
                    }}
                  >
                    {row.product.series}
                  </span>
                )}
                {row.note && (
                  <span style={{ fontSize: 11, color: "#aaa" }}>
                    {row.note}
                  </span>
                )}
              </div>
              <div className="tier-detail-grid">
                <div>
                  <div className="dg-label">門檻</div>
                  <div className="dg-value">
                    ${row.threshold?.toLocaleString() || "─"}
                  </div>
                </div>
                <div>
                  <div className="dg-label">原價 / 價值感</div>
                  <div className="dg-value" style={{ color: "#2E7D32" }}>
                    {row.product?.price ? `$${row.product.price}` : "─"}
                  </div>
                  {v && (
                    <div className="dg-sub">
                      <span
                        className={`meta-badge badge-${valueStatus(
                          v,
                          row.tier
                        )}`}
                      >
                        ↑{v.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="dg-label">成本佔比</div>
                  <div className="dg-value">
                    {row.product?.cost ? `$${row.product.cost}` : "─"}
                  </div>
                  {row.ratio && (
                    <>
                      <div className="ratio-bar">
                        <div
                          className="ratio-fill"
                          style={{
                            width: `${Math.min(row.ratio, 100)}%`,
                            background: ratioBarColor(row.ratio),
                          }}
                        />
                      </div>
                      <div className="dg-sub">
                        <span
                          className={`meta-badge badge-${costStatus(
                            row.ratio,
                            row.tier
                          )}`}
                        >
                          ↓{row.ratio.toFixed(1)}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const renderEdit = () => (
    <>
      {/* 跨年對比 */}
      {prevYearPlan && (
        <div className="last-year-box">
          <div className="last-year-title">{year - 1}年同月 — 避免重複</div>
          {prevT1p && (
            <div className="last-year-row">
              <span className="tier-badge t1" style={{ fontSize: 10 }}>
                T1
              </span>
              <span style={{ fontSize: 12, color: "#666" }}>
                {prevT1p.name} {prevT1p.spec}
              </span>
            </div>
          )}
          {prevT2p && (
            <div className="last-year-row">
              <span className="tier-badge t2" style={{ fontSize: 10 }}>
                T2
              </span>
              <span style={{ fontSize: 12, color: "#666" }}>
                {prevT2p.name} {prevT2p.spec}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="avg-input-box">
        <div className="avg-input-title">
          ⚙ 輸入客單價，自動計算 T1 / T2 門檻
        </div>
        <div className="avg-input-row">
          <span style={{ fontSize: 13, color: "#888", whiteSpace: "nowrap" }}>
            本月客單價
          </span>
          <input
            className="form-input"
            type="number"
            placeholder="例如 4000"
            value={avg}
            onChange={(e) => setAvg(e.target.value)}
            style={{ maxWidth: 130 }}
          />
          <span style={{ fontSize: 12, color: "#aaa" }}>元</span>
        </div>
        {t1 && (
          <div className="avg-result-row">
            <div className="avg-result-item">
              T1<strong>${t1.toLocaleString()}</strong>
              <span className="avg-result-formula">×1.5+500</span>
            </div>
            <div className="avg-result-item">
              T2<strong>{t2 ? `$${t2.toLocaleString()}` : ""}</strong>
              <span className="avg-result-formula">T1×2</span>
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid rgba(0,0,0,.08)",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 9,
                color: "#9C9890",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                fontFamily: "'DM Mono',monospace",
                marginBottom: 4,
              }}
            >
              T1 自訂門檻（留空則自動）
            </div>
            <input
              className="form-input"
              type="number"
              placeholder={t1 ? `${t1}` : ""}
              value={t1Override}
              onChange={(e) => setT1Override(e.target.value)}
              style={{ fontSize: 12, padding: "5px 8px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 9,
                color: "#9C9890",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                fontFamily: "'DM Mono',monospace",
                marginBottom: 4,
              }}
            >
              T2 自訂門檻（留空則自動）
            </div>
            <input
              className="form-input"
              type="number"
              placeholder={t2 ? `${t2}` : ""}
              value={t2Override}
              onChange={(e) => setT2Override(e.target.value)}
              style={{ fontSize: 12, padding: "5px 8px" }}
            />
          </div>
        </div>
      </div>

      <div className="tier-section-head">
        <span className="tier-badge t1" style={{ fontSize: 11 }}>
          T1
        </span>
        <span style={{ color: "#2E7D32", fontSize: 13 }}>
          {t1 ? `滿 $${t1.toLocaleString()} 贈` : "滿額贈"}
        </span>
      </div>
      <div className="form-group">
        <SuggestionPicker
          products={products}
          plans={plans}
          year={year}
          month={month}
          value={t1Id}
          onChange={(id) => {
            setT1Id(id);
          }}
          threshold={t1}
          tier="T1"
          onQuickAdd={onQuickAddProduct}
        />
      </div>
      <div className="form-group">
        <label className="form-label">備註（選填）</label>
        <input
          className="form-input"
          value={t1Note}
          onChange={(e) => setT1Note(e.target.value)}
        />
      </div>

      {!enableT2 ? (
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setEnableT2(true)}
        >
          ＋ 加入 T2 高消費加碼
        </button>
      ) : (
        <>
          <div className="form-section">
            <div className="tier-section-head" style={{ margin: 0 }}>
              <span className="tier-badge t2" style={{ fontSize: 11 }}>
                T2
              </span>
              <span style={{ color: "#4527A0", fontSize: 13 }}>
                {t2 ? `滿 $${t2.toLocaleString()} 贈` : "高消費加碼"}
              </span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: "#C62828" }}
              onClick={() => {
                setEnableT2(false);
                setT2Id("");
              }}
            >
              ✕
            </button>
          </div>
          <div className="form-group" style={{ marginTop: 8 }}>
            <SuggestionPicker
              products={products}
              plans={plans}
              year={year}
              month={month}
              value={t2Id}
              onChange={(id) => {
                setT2Id(id);
              }}
              threshold={t2}
              tier="T2"
              onQuickAdd={onQuickAddProduct}
            />
          </div>
          <div className="form-group">
            <label className="form-label">備註（選填）</label>
            <input
              className="form-input"
              value={t2Note}
              onChange={(e) => setT2Note(e.target.value)}
            />
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="slide-panel open">
      <div className="panel-header">
        <span className="panel-title">
          {year}年 {month}
        </span>
        <div className="panel-actions">
          {plan && mode === "view" && (
            <>
              {!plan.executed && (
                <button
                  className="icon-btn"
                  onClick={() => setMode("edit")}
                  title="編輯"
                >
                  ✎
                </button>
              )}
              {!plan.executed && (
                <button
                  className="icon-btn danger"
                  onClick={() => onDelete(month)}
                  title="刪除"
                >
                  🗑
                </button>
              )}
              <button
                className="btn btn-sm"
                style={
                  plan.executed
                    ? {
                        fontSize: 11,
                        color: "#888",
                        borderColor: "#ddd",
                        padding: "4px 10px",
                      }
                    : {
                        fontSize: 11,
                        color: "#D4B483",
                        background: "#1a1a18",
                        borderColor: "#1a1a18",
                        padding: "4px 10px",
                      }
                }
                onClick={() => onToggleExecuted(month)}
                title={plan.executed ? "取消執行" : "標記已執行"}
              >
                {plan.executed ? "已執行" : "✓ 執行"}
              </button>
            </>
          )}
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
      <div className="panel-body">
        {mode === "view" ? renderView() : renderEdit()}
      </div>
      {mode === "edit" && (
        <div className="panel-footer">
          {plan && (
            <button className="btn btn-ghost" onClick={() => setMode("view")}>
              取消
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSave}>
            ✓ 儲存方案
          </button>
        </div>
      )}
    </div>
  );
}

// ── ProductModal ──────────────────────────────────────────────────────────────
function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(
    product || { name: "", spec: "", cost: "", price: "", series: "巔峰" }
  );
  const handleSave = () => {
    if (!form.name || !form.spec || !form.cost)
      return alert("請填寫名稱、規格與成本");
    onSave(form);
  };
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">
            {product?.id ? "編輯商品" : "新增商品"}
          </span>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div className="form-group">
              <label className="form-label">商品名稱</label>
              <input
                className="form-input"
                placeholder="例如 梨山紅茶"
                value={form.name}
                onChange={(e) =>
                  setForm((v) => ({ ...v, name: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">規格 / 重量</label>
              <input
                className="form-input"
                placeholder="例如 75G"
                value={form.spec}
                onChange={(e) =>
                  setForm((v) => ({ ...v, spec: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">原價（售價）</label>
              <input
                className="form-input"
                type="number"
                placeholder="例如 850"
                value={form.price || ""}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    price: parseFloat(e.target.value) || "",
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">成本（元）</label>
              <input
                className="form-input"
                type="number"
                placeholder="例如 125"
                value={form.cost}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    cost: parseFloat(e.target.value) || "",
                  }))
                }
              />
            </div>
            <div className="form-group" style={{ gridColumn: "1/-1" }}>
              <label className="form-label">茶品系列</label>
              <select
                className="form-select"
                value={form.series}
                onChange={(e) =>
                  setForm((v) => ({ ...v, series: e.target.value }))
                }
              >
                {SERIES_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}系列
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>
            取消
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            ✓ 儲存商品
          </button>
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("calendar");
  const [year, setYear] = useState(new Date().getFullYear());
  const [plans, setPlans] = useState(() => loadLS("bestea_plans", INIT_PLANS));
  const [synced, setSynced] = useState(false);
  const [syncStatus, setSyncStatus] = useState("connecting"); // connecting | ok | error
  const [products, setProducts] = useState(() =>
    loadLS("bestea_products", INIT_PRODUCTS)
  );
  const [activeMonth, setActiveMonth] = useState(null);
  const [productModal, setProductModal] = useState(null);

  // Firestore realtime listeners
  useEffect(() => {
    const unsubPlans = onSnapshot(
      doc(db, "bestea", "bestea_plans"),
      (snap) => {
        if (snap.exists()) {
          try {
            const data = JSON.parse(snap.data().data);
            setPlans(data);
            localStorage.setItem("bestea_plans", JSON.stringify(data));
          } catch (e) {}
        }
        setSyncStatus("ok");
      },
      () => {
        setSyncStatus("error");
      }
    );
    const unsubProducts = onSnapshot(
      doc(db, "bestea", "bestea_products"),
      (snap) => {
        if (snap.exists()) {
          try {
            const data = JSON.parse(snap.data().data);
            setProducts(data);
            localStorage.setItem("bestea_products", JSON.stringify(data));
          } catch (e) {}
        }
        setSynced(true);
        setSyncStatus("ok");
      },
      () => {
        setSynced(true);
        setSyncStatus("error");
      }
    );
    return () => {
      unsubPlans();
      unsubProducts();
    };
  }, []);

  // Save to Firestore on change (after initial sync)
  useEffect(() => {
    if (!synced) return;
    setSyncStatus("saving");
    saveToFirestore("bestea_plans", plans)
      .then(() => setSyncStatus("ok"))
      .catch(() => setSyncStatus("error"));
  }, [plans, synced]);
  useEffect(() => {
    if (!synced) return;
    setSyncStatus("saving");
    saveToFirestore("bestea_products", products)
      .then(() => setSyncStatus("ok"))
      .catch(() => setSyncStatus("error"));
  }, [products, synced]);

  const yearPlans = plans[year] || {};
  const filledMonths = Object.keys(yearPlans);
  const filledCount = filledMonths.length;
  const t2Count = filledMonths.filter((m) => yearPlans[m].enableT2).length;
  const avgAvg = filledCount
    ? Math.round(
        filledMonths.reduce(
          (s, m) => s + (yearPlans[m].avgOrderValue || 0),
          0
        ) / filledCount
      )
    : 0;
  const avgT1 = filledCount
    ? Math.round(
        filledMonths.reduce(
          (s, m) => s + (calcT1(yearPlans[m].avgOrderValue) || 0),
          0
        ) / filledCount
      )
    : 0;

  // yearly avg stats
  const t1E = filledMonths
    .map((m) => {
      const pl = yearPlans[m],
        tv1 = pl.t1Override || calcT1(pl.avgOrderValue),
        p = products.find((x) => x.id === pl.t1ProductId);
      return {
        v: p?.price && tv1 ? (p.price / tv1) * 100 : null,
        c: p?.cost && tv1 ? (p.cost / tv1) * 100 : null,
      };
    })
    .filter((x) => x.v);
  const t2E = filledMonths
    .filter((m) => yearPlans[m].enableT2)
    .map((m) => {
      const pl = yearPlans[m],
        tv2 = pl.t2Override || calcT2(pl.avgOrderValue),
        p = products.find((x) => x.id === pl.t2ProductId);
      return {
        v: p?.price && tv2 ? (p.price / tv2) * 100 : null,
        c: p?.cost && tv2 ? (p.cost / tv2) * 100 : null,
      };
    })
    .filter((x) => x.v);
  const avgV1 = t1E.length
    ? (t1E.reduce((s, x) => s + x.v, 0) / t1E.length).toFixed(1)
    : null;
  const avgC1 = t1E.length
    ? (t1E.reduce((s, x) => s + x.c, 0) / t1E.length).toFixed(1)
    : null;
  const avgV2 = t2E.length
    ? (t2E.reduce((s, x) => s + x.v, 0) / t2E.length).toFixed(1)
    : null;
  const avgC2 = t2E.length
    ? (t2E.reduce((s, x) => s + x.c, 0) / t2E.length).toFixed(1)
    : null;
  const vOk1 = avgV1 && parseFloat(avgV1) >= RULES.T1.valueTarget,
    cOk1 = avgC1 && parseFloat(avgC1) <= RULES.T1.costTarget;
  const vOk2 = avgV2 && parseFloat(avgV2) >= RULES.T2.valueTarget,
    cOk2 = avgC2 && parseFloat(avgC2) <= RULES.T2.costTarget;

  const usage = getProductUsage(products, plans);

  const savePlan = useCallback(
    (month, data) => {
      setPlans((prev) => ({
        ...prev,
        [year]: { ...prev[year], [month]: data },
      }));
    },
    [year]
  );

  const deletePlan = useCallback(
    (month) => {
      if (!window.confirm(`確認刪除 ${year}年 ${month} 的方案？`)) return;
      setPlans((prev) => {
        const ny = { ...prev[year] };
        delete ny[month];
        return { ...prev, [year]: ny };
      });
      setActiveMonth(null);
    },
    [year]
  );

  const toggleExecuted = useCallback(
    (month) => {
      setPlans((prev) => {
        const plan = prev[year]?.[month];
        if (!plan) return prev;
        return {
          ...prev,
          [year]: {
            ...prev[year],
            [month]: { ...plan, executed: !plan.executed },
          },
        };
      });
    },
    [year]
  );

  const saveProduct = useCallback((form) => {
    if (form.id)
      setProducts((prev) => prev.map((p) => (p.id === form.id ? form : p)));
    else setProducts((prev) => [...prev, { ...form, id: uid() }]);
    setProductModal(null);
  }, []);

  const deleteProduct = useCallback((id) => {
    if (!window.confirm("確認刪除此商品？")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const panelOpen = activeMonth !== null;
  const pending = 12 - filledCount;

  return (
    <>
      <style>{css}</style>
      <div>
        <div className="topbar">
          <div className="topbar-brand">
            BESTEA 天下第一好茶<span>每月滿額贈系統</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                display: "inline-block",
                background:
                  syncStatus === "ok"
                    ? "#4CAF50"
                    : syncStatus === "error"
                    ? "#E53935"
                    : "#FB8C00",
                boxShadow:
                  syncStatus === "ok"
                    ? "0 0 0 2px rgba(76,175,80,.25)"
                    : syncStatus === "error"
                    ? "0 0 0 2px rgba(229,57,53,.25)"
                    : "0 0 0 2px rgba(251,140,0,.25)",
                transition: "all .3s",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color:
                  syncStatus === "ok"
                    ? "#4CAF50"
                    : syncStatus === "error"
                    ? "#E53935"
                    : "#FB8C00",
                fontFamily: "'DM Mono',monospace",
              }}
            >
              {syncStatus === "ok"
                ? "已同步"
                : syncStatus === "error"
                ? "連線失敗"
                : "同步中"}
            </span>
          </div>
          <div className="nav-tabs">
            <button
              className={`nav-tab${tab === "calendar" ? " active" : ""}`}
              onClick={() => {
                setTab("calendar");
              }}
            >
              月曆規劃
            </button>
            <button
              className={`nav-tab${tab === "products" ? " active" : ""}`}
              onClick={() => {
                setTab("products");
                setActiveMonth(null);
              }}
            >
              商品庫
            </button>
          </div>
        </div>

        <div className="layout">
          <div className={`main${panelOpen ? " panel-open" : ""}`}>
            {tab === "calendar" && (
              <>
                {/* Stats */}
                <div className="stats-grid">
                  <div className="stat-card neutral">
                    <div className="stat-label">已規劃月份</div>
                    <div className="stat-value">{filledCount}/12</div>
                    <div className="stat-sub">
                      平均客單 ${avgAvg.toLocaleString()} ／ T1 $
                      {avgT1.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat-card neutral">
                    <div className="stat-label">T2 方案月份</div>
                    <div className="stat-value">{t2Count}</div>
                    <div className="stat-sub">含雙層加碼</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">
                      T1 年均{" "}
                      <span style={{ fontSize: 10, color: "#bbb" }}>
                        目標 ↑{RULES.T1.valueTarget}% ↓{RULES.T1.costTarget}%
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "baseline",
                        marginTop: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 500,
                          fontFamily: "'DM Mono',monospace",
                          color: avgV1
                            ? vOk1
                              ? "#2E7D32"
                              : "#C62828"
                            : "#ccc",
                        }}
                      >
                        {avgV1 ? `↑${avgV1}%` : "─"}
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          fontFamily: "'DM Mono',monospace",
                          color: avgC1
                            ? cOk1
                              ? "#2E7D32"
                              : "#C62828"
                            : "#ccc",
                        }}
                      >
                        {avgC1 ? `↓${avgC1}%` : "─"}
                      </span>
                    </div>
                    <div className="stat-sub">價值感 / 成本佔比</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">
                      T2 年均{" "}
                      <span style={{ fontSize: 10, color: "#bbb" }}>
                        目標 ↑{RULES.T2.valueTarget}% ↓{RULES.T2.costTarget}%
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "baseline",
                        marginTop: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 500,
                          fontFamily: "'DM Mono',monospace",
                          color: avgV2
                            ? vOk2
                              ? "#2E7D32"
                              : "#C62828"
                            : "#ccc",
                        }}
                      >
                        {avgV2 ? `↑${avgV2}%` : "─"}
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          fontFamily: "'DM Mono',monospace",
                          color: avgC2
                            ? cOk2
                              ? "#2E7D32"
                              : "#C62828"
                            : "#ccc",
                        }}
                      >
                        {avgC2 ? `↓${avgC2}%` : "─"}
                      </span>
                    </div>
                    <div className="stat-sub">價值感 / 成本佔比</div>
                  </div>
                </div>

                {/* Progress bar */}
                {(() => {
                  const execCount = filledMonths.filter(
                    (m) => yearPlans[m].executed
                  ).length;
                  return (
                    <div className="progress-bar-wrap">
                      <span className="progress-label">{year} 規劃進度</span>
                      <div
                        className="progress-bar-bg"
                        style={{ position: "relative" }}
                      >
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${(filledCount / 12) * 100}%`,
                            background: "#e0ddd6",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: `${(execCount / 12) * 100}%`,
                            background: "#D4B483",
                            borderRadius: 3,
                            transition: "width .4s",
                          }}
                        />
                      </div>
                      <span className="progress-label">{filledCount} / 12</span>
                      {execCount > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#D4B483",
                            fontFamily: "'DM Mono',monospace",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ✓ {execCount} 已執行
                        </span>
                      )}
                      {pending > 0 && (
                        <span className="progress-pending">
                          還差 {pending} 個月
                        </span>
                      )}
                    </div>
                  );
                })()}

                {/* Year switch */}
                <div className="year-row">
                  <h2>贈品月曆</h2>
                  <div className="year-pills">
                    {Array.from(
                      { length: 3 },
                      (_, i) => new Date().getFullYear() - 1 + i
                    ).map((y) => (
                      <button
                        key={y}
                        className={`year-pill${y === year ? " active" : ""}`}
                        onClick={() => {
                          setYear(y);
                          setActiveMonth(null);
                        }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Month grid */}
                <div className="month-grid">
                  {MONTHS.map((m) => {
                    const plan = yearPlans[m];
                    const isSel = activeMonth === m;
                    if (!plan)
                      return (
                        <div
                          key={m}
                          className={`month-card empty-card${
                            isSel ? " active" : ""
                          }`}
                          onClick={() => setActiveMonth(isSel ? null : m)}
                        >
                          <div className="empty-plus">＋</div>
                          <div className="empty-month-name">{m}</div>
                        </div>
                      );
                    const t1 = plan.t1Override || calcT1(plan.avgOrderValue),
                      t2 = plan.t2Override || calcT2(plan.avgOrderValue);
                    const t1p = products.find((p) => p.id === plan.t1ProductId);
                    const t2p = plan.enableT2
                      ? products.find((p) => p.id === plan.t2ProductId)
                      : null;
                    const r1 = getRatio(t1p?.cost, t1),
                      r2 = getRatio(t2p?.cost, t2);
                    const v1 =
                      t1p?.price && t1
                        ? ((t1p.price / t1) * 100).toFixed(1)
                        : null;
                    const v2 =
                      t2p?.price && t2
                        ? ((t2p.price / t2) * 100).toFixed(1)
                        : null;
                    const isExec = !!plan.executed;
                    return (
                      <div
                        key={m}
                        className={`month-card${isSel ? " active" : ""}${
                          isExec ? " executed" : ""
                        }`}
                        onClick={() => setActiveMonth(isSel ? null : m)}
                      >
                        <div
                          className="card-status"
                          style={{ background: isExec ? "#bbb" : "#D4B483" }}
                        />
                        {isExec && (
                          <div className="executed-stamp">✓ 已執行</div>
                        )}
                        <div className="month-head">
                          <span className="month-name">{m}</span>
                          <span className="month-avg">
                            客單 ${plan.avgOrderValue?.toLocaleString()}
                          </span>
                        </div>
                        <div className="tier-row">
                          <span className="tier-badge t1">T1</span>
                          <div>
                            <div className="tier-gift">
                              {t1p ? `${t1p.name} ${t1p.spec}` : "─"}
                            </div>
                            <div className="tier-meta">
                              <span className="meta-threshold">
                                ${t1?.toLocaleString()}
                              </span>
                              {v1 && (
                                <span
                                  className={`meta-badge badge-${valueStatus(
                                    parseFloat(v1),
                                    "T1"
                                  )}`}
                                >
                                  ↑{v1}%
                                </span>
                              )}
                              {r1 && (
                                <span
                                  className={`meta-badge badge-${costStatus(
                                    r1,
                                    "T1"
                                  )}`}
                                >
                                  ↓{r1.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {plan.enableT2 && (
                          <div className="tier-row">
                            <span className="tier-badge t2">T2</span>
                            <div>
                              <div className="tier-gift">
                                {t2p ? `${t2p.name} ${t2p.spec}` : "─"}
                              </div>
                              <div className="tier-meta">
                                <span className="meta-threshold">
                                  ${t2?.toLocaleString()}
                                </span>
                                {v2 && (
                                  <span
                                    className={`meta-badge badge-${valueStatus(
                                      parseFloat(v2),
                                      "T2"
                                    )}`}
                                  >
                                    ↑{v2}%
                                  </span>
                                )}
                                {r2 && (
                                  <span
                                    className={`meta-badge badge-${costStatus(
                                      r2,
                                      "T2"
                                    )}`}
                                  >
                                    ↓{r2.toFixed(1)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {tab === "products" && (
              <>
                <div className="lib-header">
                  <h2
                    style={{
                      fontFamily: "'Noto Serif TC',serif",
                      fontSize: 17,
                      fontWeight: 400,
                    }}
                  >
                    贈品商品庫
                  </h2>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setProductModal({})}
                  >
                    ＋ 新增商品
                  </button>
                </div>
                <table className="lib-table">
                  <thead>
                    <tr>
                      <th>商品名稱</th>
                      <th>規格</th>
                      <th>系列</th>
                      <th>原價</th>
                      <th>成本</th>
                      <th>使用次數</th>
                      <th>最近使用</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const s = SERIES_STYLES[p.series] || {
                        bg: "#f0f0f0",
                        color: "#666",
                      };
                      const u = usage[p.id] || {
                        count: 0,
                        lastMonth: null,
                        lastYear: null,
                      };
                      return (
                        <tr key={p.id}>
                          <td className="product-name-cell">{p.name}</td>
                          <td
                            style={{
                              color: "#888",
                              fontFamily: "'DM Mono',monospace",
                              fontSize: 12,
                            }}
                          >
                            {p.spec}
                          </td>
                          <td>
                            <span
                              className="series-tag"
                              style={{
                                fontSize: 11,
                                padding: "2px 8px",
                                background: s.bg,
                                color: s.color,
                              }}
                            >
                              {p.series}
                            </span>
                          </td>
                          <td
                            style={{
                              fontFamily: "'DM Mono',monospace",
                              color: "#2E7D32",
                            }}
                          >
                            {p.price ? `$${p.price}` : "─"}
                          </td>
                          <td style={{ fontFamily: "'DM Mono',monospace" }}>
                            ${p.cost}
                          </td>
                          <td>
                            <span className="usage-badge">{u.count} 次</span>
                          </td>
                          <td style={{ fontSize: 12, color: "#888" }}>
                            {u.lastMonth
                              ? `${u.lastYear}年${u.lastMonth}`
                              : "─"}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                gap: 6,
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                className="icon-btn"
                                onClick={() => setProductModal(p)}
                              >
                                ✎
                              </button>
                              <button
                                className="icon-btn danger"
                                onClick={() => deleteProduct(p.id)}
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {panelOpen && (
            <PlanPanel
              month={activeMonth}
              year={year}
              plan={yearPlans[activeMonth]}
              plans={plans}
              products={products}
              onSave={(data) => savePlan(activeMonth, data)}
              onDelete={deletePlan}
              onToggleExecuted={toggleExecuted}
              onClose={() => setActiveMonth(null)}
              onQuickAddProduct={() => setProductModal({})}
            />
          )}
        </div>
      </div>

      {productModal !== null && (
        <ProductModal
          product={productModal?.id ? productModal : null}
          onSave={saveProduct}
          onClose={() => setProductModal(null)}
        />
      )}
    </>
  );
}
