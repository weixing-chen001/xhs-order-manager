// js_core.js - 数据/路由/工具（对齐小程序模型 v2.1）
const DB={get(k,d){try{return JSON.parse(localStorage.getItem(k))}catch(e){return d||null}},set(k,v){localStorage.setItem(k,JSON.stringify(v))},getOrders(){return this.get('xhs_orders',[])},saveOrders(o){this.set('xhs_orders',o)},getBrands(){return this.get('xhs_brands',[])},saveBrands(b){this.set('xhs_brands',b)}};

// 状态映射：对齐小程序9态（内容生产流）
const SM={'scheduled':{n:'已定档',c:'tr'},'sent':{n:'已寄品',c:'td'},'content_confirmed':{n:'已确定内容形式',c:'tv'},'product_arrived':{n:'产品已到',c:'tm'},'shot':{n:'产品已拍摄',c:'tp'},'draft':{n:'已出初稿',c:'pd'},'finalized':{n:'已定稿',c:'td'},'published':{n:'已发布',c:'tpd'},'abnormal':{n:'异常',c:'tu'}};
// 兼容旧数据的状态名
const SM_LEGACY={'0':'scheduled','1':'content_confirmed','2':'shot','3':'draft','4':'finalized','5':'shot','6':'published','7':'published','-1':'abnormal'};

const SO=['scheduled','sent','content_confirmed','product_arrived','shot','draft','finalized','published','abnormal'];

// 内容形式
const CT={'single':'单品单推','comparison':'横测'};
// 排竞管理
const CR={'7d':'前后 7 天','15d':'前后 15 天'};

const MON=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];

function fm(n){if(!n&&n!==0)return'0';return Number(n).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function fY(v){return'\u00A5'+fm(v)}
function rStr(p,c){if(!c)return'-';var r=Number(p)/Number(c)*100;return(isNaN(r)||!isFinite(r))?'-':r.toFixed(1)+'%'}
function ds(d){if(!d)return'';if(typeof d==='string')return d.length>=10?d:d.slice(0,10);return d.toISOString().slice(0,10)}
function today(){return new Date().toISOString().slice(0,10)}

// 利润计算：对齐小程序 = 报价 - 线上返点 - 线下返点 - 薯条成本 - 女工成本
function cP(o){
  var p=Number(o.price||0);
  var onlineRate=Number(o.onlineRebateRate||0), offlineRate=Number(o.offlineRebateRate||0);
  var onlineAmt=p*(onlineRate/100), offlineAmt=p*(offlineRate/100);
  var afterRebate=p-onlineAmt-offlineAmt;
  var pc=Number(o.potatoCost||0), lc=Number(o.laborCost||0);
  var netProfit=afterRebate-pc-lc;
  var tax=Math.max(0,(afterRebate-pc))*0.01;
  return{
    price:p,
    onlineRebateRate:onlineRate,onlineRebateAmount:Math.round(onlineAmt*100)/100,
    offlineRebateRate:offlineRate,offlineRebateAmount:Math.round(offlineAmt*100)/100,
    afterRebateProfit:Math.round(afterRebate*100)/100,
    potatoCost:pc,laborCost:lc,
    totalCost:pc+lc,
    netProfit:Math.round(netProfit*100)/100,
    taxEstimate:Math.round(tax*100)/100,
    profitRate: p>0 ? Math.round((netProfit/p)*10000)/100 : 0
  };
}

function gid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,6)}
function esc(s){var e=document.createElement('div');e.textContent=s||'';return e.innerHTML}

// 获取状态显示（兼容新旧数据）
function getSt(status){
  if(SM[status]) return SM[status];
  if(SM_LEGACY[status]) return SM[SM_LEGACY[status]];
  return SM['scheduled'];
}

function toast(m,t){var c=document.getElementById('tc'),el=document.createElement('div');el.className='to2 '+(t||'');el.innerHTML=(t==='er'?'\u274C':t==='ok'?'\u2705':'\u2139\uFE0F ')+' '+m;c.appendChild(el);setTimeout(function(){el.style.opacity='0';el.style.transform='translateX(36px)';setTimeout(function(){el.remove()},260)},2400)}

var cp='home';
function sw(p,nR){
document.querySelectorAll('.pg').forEach(function(x){x.classList.remove('on')});
document.querySelectorAll('.ni').forEach(function(x){x.classList.remove('on')});
var t=document.getElementById('p'+p[0].toUpperCase()+p.slice(1));if(t)t.classList.add('on');
var n=document.querySelector('.ni[data-page="'+p+'"]');if(n)n.classList.add('on');
var info={home:{title:'首页总览',desc:'快速录入 · 本月概览 · 近期排期'},calendar:{title:'日历视图',desc:'按日期查看商单排期'},orders:{title:'商单列表',desc:'管理所有商单记录'},add:{title:'新建商单',desc:'填写信息并保存'},stats:{title:'数据统计',desc:'利润分析 · 成本汇总 · 趋势图表'},detail:{title:'商单详情'}}[p]||{};
document.getElementById('pgT').textContent=info.title;document.getElementById('pgD').textContent=info.desc;cp=p;
if(p==='home')renderHome();else if(p==='calendar')rendCal();else if(p==='orders')rendOL();else if(p==='stats')rendStats();else if(p==='add'&&!nR)resetF();
document.getElementById('sb').classList.remove('on');window.scrollTo(0,0);
}
function tog(){document.getElementById('sb').classList.toggle('on')}
