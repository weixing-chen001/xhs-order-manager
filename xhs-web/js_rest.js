// js_rest.js - 日历+详情+统计+导出（v2.1 对齐小程序）
var cY,cM;function initCal(){var n=new Date();cY=n.getFullYear();cM=n.getMonth()}
function cM(d){cM+=d;if(cM>11){cM=0;cY++}if(cM<0){cM=11;cY--}rendCal()}
function goT(){var n=new Date();cY=n.getFullYear();cM=n.getMonth();rendCal()}

function rendCal(){
initCal();
var fd=new Date(cY,cM,1),ld=new Date(cY,cM+1,0),sdow=(fd.getDay()+6)%7,dim=ld.getDate(),pml=new Date(cY,cM,0).getDate();
document.getElementById('cMTx').textContent=cY+'年 '+(cM+1)+'月';
var os=DB.getOrders(),fS=document.getElementById('cfS').value;
// 状态筛选兼容新旧
function matchFS(o){
  if(!fS)return true;
  if(o.progress===fS) return true;
  // 尝试旧值映射
  var legacyVal = Object.keys(SM_LEGACY).find(function(k){return SM_LEGACY[k]===fS});
  return o.progress === fS || o.progress === legacyVal;
}
var flt=os.filter(matchFS);
var dMap={};flt.forEach(function(o){if(!o.scheduleDate)return;var s=ds(o.scheduleDate);if(!dMap[s])dMap[s]=[];dMap[s].push(o)});
var tod=today(),h='<div class="chd">一</div><div class="chd">二</div><div class="chd">三</div><div class="chd">四</div><div class="chd">五</div><div class="chd">六</div><div class="chd">日</div>';
for(var i=sdow-1;i>=0;i--)h+='<div class="cd2 om"><div class="cdn">'+pml-i+'</div></div>';
for(var d=1;d<=dim;d++){
  var s=cY+'-'+String(cM+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'),isT=s===tod,evs=dMap[s]||[],dot=evs.length?'<span class="cdot"></span>':'',eh='';
  // 日历格子：品牌·产品 + 状态标签 + 内容形式 + 排竞 + 备注（最多4条）
  for(var ei=0,len=Math.min(evs.length,4);ei<len;ei++){
    var eo=evs[ei],est=getSt(eo.progress),ctTxt=CT[eo.contentType]?'<span class="cal-line cal-ct">\uD83D\uDCDD '+CT[eo.contentType]+'</span>':'',crTxt=CR[eo.competitionRange]?'<span class="cal-line cal-cmp">\uD83C\uDFAF '+CR[eo.competitionRange]+'</span>':'';
    eh+='<div class="ce c'+(SM[eo.progress]?eo.progress:'scheduled').charAt(0)+'" onclick="event.stopPropagation();showCM(\''+eo.id+'\')">📌'+esc(eo.brandName||eo.brand)+'</div>';
    if(ei===0) eh+=ctTxt; if(ei===1) eh+=crTxt;
  }
  if(evs.length>4)eh+='<div class="cm" onclick="event.stopPropagation();showDay(\''+s+'\')">+'+(evs.length-4)+' 更多</div>';
  h+='<div class="cd2'+(isT?' today':'')+'" onclick="dayClick(\''+s+'\')"><div class="cdn">'+d+dot+'</div>'+eh+'</div>';
}
var tc2=sdow+dim,rm=(42-tc2)%7;for(var ri=0;ri<rm;ri++)h+='<div class="cd2 om"><div class="cdn">'+(ri+1)+'</div></div>';
document.getElementById('cGr').innerHTML=h;

// 月度概览
var mOs2=flt.filter(function(o){if(!o.scheduleDate)return false;var dd=new Date(o.scheduleDate);return dd.getFullYear()===cY&&dd.getMonth()===cM});
var mTP=0,mTC=0,mCnt=mOs2.length,mRev=0;mOs2.forEach(function(o2){var r=cP(o2);mTP+=r.netProfit;mTC+=r.totalCost;mRev+=Number(o2.price||0)});
document.getElementById('cMSum').innerHTML='<div class="ppr3"><span class="ppl3">商单总数</span><span class="ppv3">'+mCnt+' 单</span></div>'
+'<div class="ppr3"><span class="ppl3">总报价</span><span class="ppv3">\u00A5'+fm(mRev)+'</span></div>'
+'<div class="ppr3 ppt3"><span class="ppl3">净利润</span><span class="ppv3" style="'+(mTP>=0?'':'color:#E74C3C')+'">'+fY(mTP)+'<span class="pprate3">('+(mCnt?((mTP/mRev*100)||0).toFixed(1):0)+')</span></span></div>'
+'<div class="ppr3"><span class="ppl3">总成本</span><span class="ppv3">'+fY(mTC)+'</span></div>';

// 进度分布
var pd2={};mOs2.forEach(function(o){pd2[o.progress]=(pd2[o.progress]||0)+1});
var phtm='<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">';
SO.forEach(function(k){
  if(pd2[k]){var st=getSt(k);
    phtm+='<div style="text-align:center;padding:8px 16px;background:var(--bg);border-radius:8px;min-width:80px"><div style="font-size:20px;font-weight:800;color:var(--p)">'+pd2[k]+'</div><div style="font-size:12px;color:var(--ts)">'+st.n+'</div></div>'}
});phtm+='</div>';document.getElementById('cPD').innerHTML=phtm;popFl();
}

function dayClick(ds){showDay(ds)}
function showDay(ds){var os=DB.getOrders().filter(function(o){return ds(o.scheduleDate)===ds});if(os.length===1){showCM(os[0].id)}else if(os.length>1){showCM(null,os,ds)}}

var curCalID=null;
function showCM(id,olist,dt){
curCalID=id;var mo=document.getElementById('calMO'),mb=document.getElementById('calMB');
if(id){
  var o=DB.getOrders().find(function(x){return x.id===id});if(!o)return;
  var rp=cP(o),st=getSt(o.progress);
  document.getElementById('calMT').textContent=o.brandName||o.brand;
  mb.innerHTML='<div style="font-size:16px;font-weight:700;margin-bottom:4px">'+esc(o.brandName||o.brand)+'</div>'
  +'<div style="font-size:13px;color:var(--ts);margin-bottom:12px">'+esc(o.productName||o.product||'')+'</div>'
  +'<div style="display:flex;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><span style="color:var(--tl);min-width:70px">档期</span><span>'+(o.scheduleDate||'未设置')+'</span></div>'
  +'<div style="display:flex;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><span style="color:var(--tl);min-width:70px">状态</span><span><span class="tg '+st.c+'">'+st.n+'</span></span></div>'
  +'<div style="display:flex;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><span style="color:var(--tl);min-width:70px">报价</span><span>'+fY(o.price)+'</span></div>'
  +'<div style="display:flex;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><span style="color:var(--tl);min-width:70px">净利润</span><span style="'+(rp.netProfit>=0?'color:#27AE60':'color:#E74C3C')+';font-weight:600">'+fY(rp.netProfit)+' '+rStr(rp.netProfit,rp.price)+'</span></div>'
  +'<div style="display:flex;padding:6px 0;font-size:13px"><span style="color:var(--tl);min-width:70px">成本</span><span>\uD83C\uDF53'+fY(rp.potatoCost)+' \uD83D\uDDC9'+fY(rp.laborCost)+'</span></div>'
  +(o.notes?'<div style="display:flex;padding:6px 0;border-top:1px dashed var(--bd);margin-top:6px;font-size:13px"><span style="color:var(--tl);min-width:70px">备注</span><span>'+esc(o.notes)+'</span></div>':'')
  +(CT[o.contentType]?'<div style="display:flex;padding:6px 0;font-size:12px;color:var(--ts)"><span style="color:var(--tl);min-width:70px">内容</span><span>'+CT[o.contentType]+'</span></div>':'')
  +(CR[o.competitionRange]?'<div style="display:flex;padding:6px 0;font-size:12px;color:var(--ts)"><span style="color:var(--tl);min-width:70px">排竞</span><span>'+CR[o.competitionRange]+'</span></div>':'');
}else if(olist){
  document.getElementById('calMT').textContent=dt+' 的商单';var li='';olist.forEach(function(o2){li+='<div style="padding:10px 0;border-bottom:1px dashed var(--bd);cursor:pointer" onclick="showCM(\''+o2.id+'\')"><strong>'+esc(o2.brandName||o2.brand)+'</strong> - '+esc(o2.productName||o2.product||'')+' <span class="tg '+(getSt(o2.progress)||SM['scheduled']).c+'">'+(getSt(o2.progress)||SM['scheduled']).n+'</span></div>'});mb.innerHTML='<p style="margin-bottom:12px;color:var(--ts)">共 '+olist.length+' 条商单</p>'+li;
}mo.classList.add('sh');
}
function clsCM(){document.getElementById('calMO').classList.remove('sh')}
function goDFromCal(){clsCM();if(curCalID)viewO(curCalID)}

// ========== 详情页 ==========
var curDID=null;
function rendDetail(id){
curDID=id;var os=DB.getOrders(),o=os.find(function(x){return x.id===id});if(!o)return;
var rp=cP(o),st=getSt(o.progress);
// 标签
document.getElementById('dBdg').innerHTML='<span class="tg '+st.c+'" style="font-size:14px;padding:6px 18px">'+st.n+'</span>';
document.getElementById('dBrnd').textContent=o.brandName||o.brand;
document.getElementById('dProd').textContent=o.productName||o.product||'';

// 利润分析（返点模型）
document.getElementById('dPCd').innerHTML='<div style="font-size:14px;font-weight:700;margin-bottom:10px">\uD83D\uDCB0 利润分析</div>'
+'<div class="ppr3"><span class="ppl3">当月报价</span><span class="ppv3">'+fY(o.price)+'</span></div>'
+'<div class="ppr3"><span class="ppl3">线上返点 '+rp.onlineRebateRate+'%</span><span class="ppv3" style="color:#E74C3C">- '+fY(rp.onlineRebateAmount)+'</span></div>'
+'<div class="ppr3"><span class="ppl3">线下返点 '+rp.offlineRebateRate+'%</span><span class="ppv3" style="color:#E74C3C">- '+fY(rp.offlineRebateAmount)+'</span></div>'
+'<div class="ppt3 pprr3"><span class="ppl3">\uD83D\uDCB8 去返点利润</span><span class="ppv3">'+fY(rp.afterRebateProfit)+'</span></div>'
+'<div class="ppr3"><span class="ppl3">\uD83C\uDF53薯条成本</span><span class="ppv3">- '+fY(rp.potatoCost)+'</span></div>'
+'<div class="ppr3"><span class="ppl3">\uD83D\uDDC9女工成本</span><span class="ppv3">- '+fY(rp.laborCost)+'</span></div>'
+'<div class="ppr3 ppt3"><span class="ppl3">\uD83E\uDD1A 净利润（扣成本后）</span><span class="ppv3" style="'+(rp.netProfit>=0?'':'color:#E74C3C')+'">'+fY(rp.netProfit)+'<span class="pprate3">('+rStr(rp.netProfit,rp.price)+')</span></span></div>'
+'<div style="border-top:1px solid var(--bd);padding-top:8px;margin-top:8px;font-size:12px;color:var(--ts)">税点预估 ≈ ¥'+fY(rp.taxEstimate);

// 时间线（多日期）
var timeHTML='<div class="mi"><div class="mil">预定档期</div><div class="miv">'+(o.scheduleDate||'未设置')+'</div></div>';
if(o.outlineDate) timeHTML+='<div class="mi"><div class="mil">大纲时间</div><div class="miv">'+o.outlineDate+'</div></div>';
if(o.draftDate) timeHTML+='<div class="mi"><div class="mil">初稿时间</div><div class="miv">'+o.draftDate+'</div></div>';
timeHTML+='<div class="mi"><div class="mil">创建时间</div><div class="miv">'+(o.createdAt?new Date(o.createdAt).toLocaleString():'-')+'</div></div>'
+'<div class="mi"><div class="mil">更新时间</div><div class="miv">'+(o.updatedAt?new Date(o.updatedAt).toLocaleString():'-')+'</div></div>';
document.getElementById('dMg').innerHTML=timeHTML;

// 商单信息（内容形式、排竞）
var extraInfo='';
if(CT[o.contentType]||CR[o.competitionRange]){
  extraInfo='<h3 style="font-size:14px;font-weight:700;margin-bottom:10px">\uD83D\uDCCB 商单信息</h3>';
  if(CT[o.contentType]) extraInfo+='<div style="display:flex;padding:6px 0;font-size:13px"><span style="color:var(--tl);min-width:80px">内容形式</span><span>'+CT[o.contentType]+'</span></div>';
  if(CR[o.competitionRange]) extraInfo+='<div style="display:flex;padding:6px 0;font-size:13px"><span style="color:var(--tl);min-width:80px">排竞管理</span><span style="color:#1B4F72;font-weight:600">'+CR[o.competitionRange]+'</span></div>';
}
document.getElementById('dExtraInfo').innerHTML=extraInfo;

// 进度步骤（9态）
var PS=['scheduled','sent','content_confirmed','product_arrived','shot','draft','finalized','published'],sh='',curIdx=-1;
PS.forEach(function(si,i){if(si===(o.progress||''))curIdx=i});
PS.forEach(function(si,i){
  var sinfo=getSt(si),cls=si==(o.progress||'')?'a':((curIdx>=0&&i<curIdx)?'d':'');
  sh+='<div class="step '+cls+'"><div class="scir">'+sinfo.n.charAt(0)+'</div><div class="stl">'+sinfo.n+'</div></div>';
});
// 异常状态单独显示
if(o.progress==='abnormal'){
  sh+='<div class="step a"><div class="scir">⚠</div><div class="stl">异常</div></div>';
}
document.getElementById('dStps').innerHTML=sh;

// 备注
document.getElementById('dTl').innerHTML=(o.notes?'<div class="tli2"><div class="tld2 d"></div><div><div class="tlt2">备注信息</div><div class="tlda">'+esc(o.notes)+'</div></div></div>':'')
+'<div class="tli2"><div class="tld2 a"></div><div><div class="tlt2">创建商单</div><div class="tlda">'+(o.createdAt?new Date(o.createdAt).toLocaleString():'-')+'</div></div></div>';
}
function editCD(){if(curDID){loadFE(curDID);sw('add',true)}}
function delCD(){if(curDID)deleteO(curDID)}

// ========== 统计页 ==========
function rendStats(){
var rng=document.getElementById('srRng').value,os=DB.getOrders(),now=new Date(),y=now.getFullYear(),m=now.getMonth();
function dateFilter(o){
  if(!o.scheduleDate&&rng!=='all')return false;var d=new Date(o.scheduleDate);
  if(rng==='month')return d.getFullYear()===y&&d.getMonth()===m;
  if(rng==='quarter'){var q=Math.floor(m/3);return d.getFullYear()===y&&Math.floor(d.getMonth()/3)===q}
  if(rng==='year')return d.getFullYear()===y;return true;
}
// 有效商单（排除异常）
var f=os.filter(dateFilter).filter(function(o){return o.progress!=='abnormal'});
var abnormalAll=os.filter(dateFilter).filter(function(o){return o.progress==='abnormal'});
var tp=0,tc=0,cnt=f.length,tRev=0,tTax=0;
f.forEach(function(o){var r=cP(o);tp+=r.netProfit;tc+=r.totalCost;tRev+=Number(o.price||0);tTax+=r.taxEstimate});
var ar=cnt?(tp/tRev*100):0;

// 指标卡（加异常数和税点）
document.getElementById('sCards').innerHTML='<div class="sc"><div class="si r">\uD83D\uDCB0</div><div class="sii"><div class="sil">\u2728 预期净利润</div><div class="siv" style="'+(tp>=0?'':'color:#E74C3C')+'">'+fY(tp)+'</div><div class="sil">'+cnt+' 单有效'+(abnormalAll.length?' · 异常 '+abnormalAll.length+' 单':'')+'</div></div></div>'
+'<div class="sc"><div class="si b">\uD83D\uDCCA</div><div class="sii"><div class="sil">平均利润率</div><div class="siv">'+(cnt?ar.toFixed(1):'-')+'%</div></div></div>'
+'<div class="sc"><div class="si g">\uD83C\uDF53</div><div class="sii"><div class="sil">薯条成本</div><div class="siv" style="color:#F39C12">'+fY(f.reduce(function(s,o){return s+cP(o).potatoCost},0))+'</div></div></div>'
+'<div class="sc"><div class="si o">\uD83D\uDCC9</div><div class="sii"><div class="sil">女工成本</div><div class="siv" style="color:#F39C12">'+fY(f.reduce(function(s,o){return s+cP(o).laborCost},0))+'</div></div></div>'
+'<div class="sc"><div class="si" style="background:#F0F0F0;color:#666">📋</div><div class="sii"><div class="sil">税点预估</div><div class="siv">≈ ¥'+fY(tTax)+'</div></div></div>'
+(abnormalAll.length>0?'<div class="sc"><div class="si" style="background:#FEF5E7;color:#E67E22">⚠️</div><div class="sii"><div class="sil">异常商单</div><div class="siv" style="color:#E67E22">'+abnormalAll.length+' 单</div></div></div>':'');

// 公式说明卡片始终显示
// Monthly chart
var md=[];for(var i=11;i>=0;i--){var dd=new Date(y,m,1);dd.setMonth(dd.getMonth()-i);var my=dd.getFullYear(),mm=dd.getMonth();
var mos2=os.filter(function(o3){if(!o3.scheduleDate)return false;var od=new Date(o3.scheduleDate);return od.getFullYear()===my&&od.getMonth()===mm});var mp=0;mos2.forEach(function(o4){mp+=cP(o4).netProfit});md.push({label:(mm+1)+'月',val:mp})}
var mV=Math.max.apply(null,md.map(function(dx){return Math.abs(dx.val)})||[100]);
document.getElementById('pcBs').innerHTML=md.map(function(dx){var h=dx.val>=0?Math.max(Math.abs(dx.val)/mV*160,3):Math.max(Math.abs(dx.val)/mV*160,3),cls=dx.val>=0?'barp':'barn';return'<div class="cbw"><div class="cbar '+cls+'" style="height:'+h+'px"></div><div class="cbv">'+(dx.val>=0?'':'')+fY(dx.val)+'</div><div class="cbl">'+dx.label+'</div></div>'}).join('');

// Progress bar (enhanced)
var pd3={};f.forEach(function(o){pd3[o.progress]=(pd3[o.progress]||0)+1});
var lg='',total=f.length||1;Object.keys(pd3).forEach(function(k){
  var st=getSt(k),pct=Math.round(pd3[k]/total*100);
  lg+='<div class="prog-bar-wrap"><div class="prog-bar-row"><span class="prog-icon">'+(st.n.charAt(0))+'</span><span class="prog-name">'+st.n+'</span><span class="prog-count">'+pd3[k]+'单</span></div><div class="prog-fill-bg"><div class="prog-fill" style="width:'+pct+'%"></div></div></div>';
});
document.getElementById('pcArea').innerHTML='<div style="min-width:200px"><div class="dnut"><div class="dpct">'+cnt+'</div><div class="dlbl">单</div></div></div><div style="min-width:280px;flex:1">'+(lg||'<p style="color:var(--ts)">暂无数据</p>')+'</div>';

// Cost table (薯条/女工)
var pt=0,lt=0;f.forEach(function(o){pt+=Number(o.potatoCost||0);lt+=Number(o.laborCost||0)});
document.getElementById('cBody').innerHTML='<tr><td>薯条推广费</td><td>'+fY(pt)+'</td><td>用于内容加热/流量投放</td></tr>'
+'<tr><td>女工/外包费</td><td>'+fY(lt)+'</td><td>拍摄、剪辑、代运营等</td></tr>'
+'<tr><td><b>成本总计</b></td><td><b>'+fY(pt+lt)+'</b></td><td></td></tr>';

// Top5
var t5=[].concat(f).sort(function(a,b){return cP(b).netProfit-cP(a).netProfit}).slice(0,5);
document.getElementById('topL').innerHTML=t5.length?t5.map(function(o,i){
  var rp=cP(o);
  return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--bd)"><div class="rr2 '+(i<3?'rk'+(i+1):'rhn')+'">'+(i+1)+'</div><div style="flex:1"><div style="font-weight:600;font-size:14px">'+esc(o.brandName||o.brand)+'</div><div style="font-size:12px;color:var(--ts)">'+esc(o.productName||o.product||'')+' · '+rStr(rp.netProfit,rp.price)+'</div></div><div style="text-align:right;font-weight:700;color:'+(rp.netProfit>=0?'#27AE60':'#E74C3C')+'">'+fY(rp.netProfit)+'</div></div>'
}):'<div class="emp" style="padding:30px"><p>暂无数据</p></div>';

// 商单明细列表
var olContainer=document.getElementById('statsOrderList');
if(f.length>0){
  olContainer.style.display='block';
  olContainer.querySelector('#statsOrders').innerHTML=f.slice(0,20).map(function(o){
    var rp=cP(o),st=getSt(o.progress);
    return '<div style="padding:10px 0;border-bottom:1px solid var(--bd);cursor:pointer" onclick="viewO(\''+o.id+'\')"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><strong>'+esc(o.brandName||o.brand)+(o.productName||o.product?' · '+esc(o.productName||o.product):'')+'</strong><span class="tg '+st.c+'">'+st.n+'</span></div><div style="font-size:12px;color:var(--ts)">报价 '+fY(o.price)+' · 净利 <span style="color:'+(rp.netProfit>=0?'#27AE60':'#E74C3C')+';font-weight:600">'+fY(rp.netProfit)+'</span> ('+rStr(rp.netProfit,rp.price)+')</div></div>';
  }).join('');
}

// Confirm & Export
var cCB=null;
function showCO(msg,cb){document.getElementById('coTx').textContent=msg;cCB=cb;document.getElementById('coO').classList.add('sh');document.getElementById('coOK').onclick=function(){clsCO();if(cCB)cCB()}}
function clsCO(){document.getElementById('coO').classList.remove('sh');cCB=null}

// 导出CSV（新字段）
function expO(){
var os2=DB.getOrders();if(!os2.length){toast('没有数据可导出','er');return}
var csv='\uFEFF品牌,产品名,内容形式,排竞管理,当月报价,线上返点%,线下返点%,薯条费用,女工费用,去返点利润,净利润,利润率%,预定档期,大纲时间,初稿时间,进度状态,备注\n';
os2.forEach(function(o){
  var rp=cP(o);
  csv+=o.brandName+','+o.productName+','+(CT[o.contentType]||'')+','+(CR[o.competitionRange]||'')
    +','+o.price+','+rp.onlineRebateRate+','+rp.offlineRebateRate
    +','+rp.potatoCost+','+rp.laborCost+','+fY(rp.afterRebateProfit)
    +','+fY(rp.netProfit)+','+rp.profitRate
    +','+(o.scheduleDate||'')+','+(o.outlineDate||'')+','+(o.draftDate||'')
    +','+(getSt(o.progress)).n+','+(o.notes||'').replace(/,/g,'；')+'\n';
});
var blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');
a.href=URL.createObjectURL(blob);a.download='小红猪商单_'+today()+'.csv';a.click();URL.revokeObjectURL(a.href);toast('导出成功 ✅','ok');
}

// Init
renderHome();initCal();
