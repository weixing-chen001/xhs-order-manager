// js_app.js - 首页+列表+表单（对齐小程序 v2.1）
function renderHome(){
var os=DB.getOrders(),now=new Date(),y=now.getFullYear(),m=now.getMonth();
// 本月有效商单（非异常）
var mOs=os.filter(function(o){var sd=o.scheduleDate;if(!sd)return false;var d=new Date(sd);return d.getFullYear()===y&&d.getMonth()===m && o.progress!=='abnormal'});
var tp=0,tc=0,cnt=mOs.length;
mOs.forEach(function(o){var r=cP(o);tp+=r.netProfit;tc+=r.totalCost});
var ar=cnt?tp/mOs.reduce(function(s,o){return s+Number(o.price||0)},0)*100:0;

// 本月利润概览卡片
var profitCard='';
if(cnt>0){
  var abnormal=os.filter(function(o){var sd=o.scheduleDate;if(!sd)return false;var d=new Date(sd);return d.getFullYear()===y&&d.getMonth()===m && o.progress==='abnormal'}).length;
  document.getElementById('homeProfit').style.display='block';
  document.getElementById('homeProfitAmt').textContent=fY(tp);
  document.getElementById('homeProfitMeta').textContent='有效 '+cnt+' 单' + (abnormal>0 ? ' · 异常 '+abnormal+' 单' : '');
}else{
  document.getElementById('homeProfit').style.display='none';
}

document.getElementById('hs').innerHTML='<div class="sc"><div class="si r">\uD83D\uDCB0</div><div class="sii"><div class="sil">'+MON[m]+'净利润</div><div class="siv" style="'+(tp>=0?'':'color:#E74C3C')+'">'+fY(tp)+'</div></div></div>'
+'<div class="sc"><div class="si b">\uD83D\uDCCA</div><div class="sii"><div class="sil">'+MON[m]+'商单数</div><div class="siv">'+cnt+'<span class="u">单</span></div></div></div>'
+'<div class="sc"><div class="si g">\uD83D\uDCC8</div><div class="sii"><div class="sil">平均利润率</div><div class="siv">'+(cnt?ar.toFixed(1):'-')+'<span class="u">%</span></div></div></div>'
+'<div class="sc"><div class="si o">\uD83D\uDCB8</div><div class="sii"><div class="sil">总成本支出</div><div class="siv">'+fY(tc)+'</div></div></div>';
// upcoming（7天内，排除已发布和异常）
var up=os.filter(function(o){if(!o.scheduleDate||o.progress==='published'||o.progress==='abnormal')return false;var diff=(new Date(o.scheduleDate)-now)/86400000;return diff>=-1&&diff<=30}).sort(function(a,b){return new Date(a.scheduleDate)-new Date(b.scheduleDate)}).slice(0,6);
var sl=document.getElementById('schL');
if(!up.length)sl.innerHTML='<li class="emp"><div class="ei">\uD83D\uDCC5</div><p>暂无近期排期</p></li>';else{sl.innerHTML='';up.forEach(function(o){var d=new Date(o.scheduleDate),st=getSt(o.progress),days=Math.ceil((new Date(o.scheduleDate)-now)/86400000);var rp=cP(o);var li=document.createElement('li');li.className='si2';li.onclick=function(){viewO(o.id)};li.innerHTML='<div class="sdt"><div class="sdd">'+d.getDate()+'</div><div class="sdm">'+(d.getMonth()+1)+'月</div></div><div class="si2i"><div class="si2b">'+esc(o.brandName||o.brand)+'</div><div class="si2p">'+esc(o.productName||o.product||'')+' · '+st.n+'</div></div><div style="text-align:right"><span class="tg '+st.c+'">'+st.n+'</span><span style="font-size:11px;color:var(--ts);margin-left:4px">'+days+'天后</span></div>';sl.appendChild(li)})};
// recent
var rc=[].concat(os).sort(function(a,b){return new Date(b.createdAt||b.id)-new Date(a.createdAt||a.id)}).slice(0,5);
var rl=document.getElementById('rcL');
if(!rc.length)rl.innerHTML='<li class="emp"><div class="ei">\uD83D\uDCCB</div><p>还没有商单，快去创建第一个吧！</p></li>';else{rl.innerHTML='';rc.forEach(function(o,i){var rp=cP(o),rk=i<3?'rk'+(i+1):'rkn';var st=getSt(o.progress);var li2=document.createElement('li');li2.className='ri2';li2.onclick=function(){viewO(o.id)};li2.innerHTML='<div class="rr2 '+rk+'">'+(i+1)+'</div><div class="ri2i"><div class="ri2b">'+esc(o.brandName||o.brand)+'</div><div class="ri2m"><span>'+esc(o.productName||o.product||'')+'</span><span>'+(o.scheduleDate||'未排期')+'</span><span class="tg '+st.c+'" style="margin-left:6px">'+st.n+'</span></span></div></div><div class="rip2"><div class="amt '+(rp.netProfit>=0?'pp':'pn')+'">'+fY(rp.netProfit)+'</div><div class="rt2">'+rStr(rp.netProfit,rp.price)+'</div></div>';rl.appendChild(li2)})};
updBDL();
}

// 首页快速录入：10字段完整版
function subQ(){
var b=document.getElementById('qb').value.trim(),p=document.getElementById('qp').value.trim(),pr=parseFloat(document.getElementById('qpr').value)||0;
if(!b){toast('请填写品牌名','er');return}if(!pr||pr<=0){toast('请填写当月报价','er');return}
var order={
  id:gid(),
  brandName:b,
  productName:p,
  contentType:document.getElementById('qct').value,
  competitionRange:document.getElementById('qcr').value,
  scheduleDate:document.getElementById('qd').value,
  outlineDate:document.getElementById('qod').value,
  draftDate:document.getElementById('qdd').value,
  price:pr,
  onlineRebateRate:parseFloat(document.getElementById('qor').value)||0,
  offlineRebateRate:parseFloat(document.getElementById('qofr').value)||0,
  potatoCost:0,laborCost:0,
  progress:'scheduled',
  notes:'',
  createdAt:new Date().toISOString(),
  updatedAt:new Date().toISOString()
};
DB.getOrders().push(order);DB.saveOrders(DB.getOrders());toast('商单已保存 ✅','ok');
// 重置首页表单
document.getElementById('qb').value='';document.getElementById('qp').value='';
document.getElementById('qct').value='single';document.getElementById('qcr').value='';
document.getElementById('qd').value='';document.getElementById('qod').value='';document.getElementById('qdd').value='';
document.getElementById('qpr').value='';document.getElementById('qor').value='';document.getElementById('qofr').value='';
renderHome();
}

function rendOL(){
var os=DB.getOrders(),kw=(document.getElementById('oSrch').value||'').toLowerCase(),fs=document.getElementById('ofS').value;
// 兼容新旧状态值映射
function matchStatus(o){
  if(!fs)return true;
  if(fs===(o.progress||'')) return true;
  // 尝试旧数据兼容
  var legacyVal = Object.keys(SM_LEGACY).find(function(k){return SM_LEGACY[k]===fs});
  return o.progress === fs || o.progress === legacyVal;
}
var f=os.filter(function(o){
if(!matchStatus(o))return false;
if(kw){var s=((o.brandName||o.brand||'')+' '+(o.productName||o.product||'')+' '+(o.notes||'')).toLowerCase();if(s.indexOf(kw)<0)return false}return true;
}).sort(function(a,b){return new Date(b.createdAt||b.id)-new Date(a.createdAt||a.id)});
var tb=document.getElementById('oTB');if(!f.length){tb.innerHTML='<tr><td colspan="13"><div class="emp" style="padding:36px"><div class="ei">\uD83D\uDCE7</div><p>没有匹配的商单</p></div></td></tr>';popFl();return}
tb.innerHTML=f.map(function(o){
  var rp=cP(o),st=getSt(o.progress);
  return '<tr>'
    +'<td><strong>'+esc(o.brandName||o.brand)+'</strong></td>'
    +'<td>'+esc(o.productName||o.product||'')+'</td>'
    +'<td><span style="font-size:11px;color:var(--ts)">'+CT[o.contentType]||''+'</span></td>'
    +'<td><span style="font-size:11px;color:#1B4F72">'+(CR[o.competitionRange]||'')+'</span></td>'
    +'<td>'+fY(o.price)+'</td>'
    +'<td style="color:#E74C3C;font-size:12px">-'+fY(rp.onlineRebateAmount+rp.offlineRebateAmount)+'</td>'
    +'<td>'+fY(rp.totalCost)+'</td>'
    +'<td class="'+(rp.netProfit>=0?'pp':'pn')+'"><strong>'+fY(rp.netProfit)+'</strong></td>'
    +'<td><span class="pr">'+rStr(rp.netProfit,rp.price)+'</span></td>'
    +'<td>'+(o.scheduleDate||'-')+'</td>'
    +'<td><span class="tg '+st.c+'">'+st.n+'</span></td>'
    +'<td class="ct"><button class="bg btn bs" onclick="viewO(\''+o.id+'\')">详情</button><button class="bg btn bs" style="margin-left:3px" onclick="editO(\''+o.id+'\')">编辑</button></td>'
    +'</tr>';
}).join('');popFl();
}

function popFl(){
var os=DB.getOrders(),us=new Set();os.forEach(function(o){var p=o.progress||SM_LEGACY[o.status]||'scheduled';us.add(p)});
var of=document.getElementById('ofS'),cs=document.getElementById('cfS'),cv=of.value,cv2=cs.value;
of.innerHTML='<option value="">全部状态</option>';cs.innerHTML='<option value="">全部状态</option>';
SO.forEach(function(k){
  var st=getSt(k);
  of.innerHTML+='<option value="'+k+'">'+st.n+'</option>';
  cs.innerHTML+='<option value="'+k+'">'+st.n+'</option>';
});of.value=cv;cs.value=cv2;
}

function viewO(id){rendDetail(id);sw('detail')}
function editO(id){loadFE(id);sw('add',true)}
function deleteO(id){showCO('确定要删除该商单吗？此操作无法撤销！',function(){var os=DB.getOrders();os=os.filter(function(x){return x.id!==id});DB.saveOrders(os);toast('已删除','ok');rendOL();renderHome()})}

// 表单重置（新10字段）
function resetF(){
['eoid','fb','fp','fpr'].forEach(function(id){document.getElementById(id).value=''});
['fd','fod','fdd'].forEach(function(id){document.getElementById(id).value=''});
document.getElementById('fst').value='scheduled';
document.getElementById('for').value='';document.getElementById('ffr').value='';
document.getElementById('fpc').value='0';document.getElementById('flc').value='0';
document.getElementById('fct').value='single';document.getElementById('fcr').value='';
document.getElementById('fn').value='';document.getElementById('ppCd').style.display='none';
document.getElementById('savBtn').textContent='\u2705 保存商单';updBTgs();
}

// 加载编辑数据
function loadFE(id){
var os=DB.getOrders(),o=os.find(function(x){return x.id===id});if(!o){toast('找不到该商单','er');return}
resetF();
document.getElementById('eoid').value=id;
document.getElementById('fb').value=o.brandName||o.brand||'';
document.getElementById('fp').value=o.productName||o.product||'';
document.getElementById('fpr').value=o.price||'';
document.getElementById('fd').value=o.scheduleDate||today();
document.getElementById('fod').value=o.outlineDate||'';
document.getElementById('fdd').value=o.draftDate||'';
document.getElementById('fst').value=o.progress||'scheduled';
document.getElementById('for').value=o.onlineRebateRate||'';
document.getElementById('ffr').value=o.offlineRebateRate||'';
document.getElementById('fpc').value=o.potatoCost||'0';
document.getElementById('flc').value=o.laborCost||'0';
document.getElementById('fct').value=o.contentType||'single';
document.getElementById('fcr').value=o.competitionRange||'';
document.getElementById('fn').value=o.notes||o.note||'';
document.getElementById('savBtn').textContent='\uD83D\uDCBE 更新商单';updPP();
}

// 保存商单
function saveO(){
var b=document.getElementById('fb').value.trim(),p=document.getElementById('fp').value.trim(),pr=parseFloat(document.getElementById('fpr').value);
if(!b){toast('请填写品牌名','er');return}if(!p){toast('请填写产品名称','er');return}if(!pr||pr<=0){toast('请填写报价','er');return}
var eid=document.getElementById('eoid').value,od={
  brandName:b,productName:p,price:pr,
  scheduleDate:ds(document.getElementById('fd').value),
  outlineDate:ds(document.getElementById('fod').value),
  draftDate:ds(document.getElementById('fdd').value),
  progress:document.getElementById('fst').value,
  onlineRebateRate:parseFloat(document.getElementById('for').value)||0,
  offlineRebateRate:parseFloat(document.getElementById('ffr').value)||0,
  potatoCost:parseFloat(document.getElementById('fpc').value)||0,
  laborCost:parseFloat(document.getElementById('flc').value)||0,
  contentType:document.getElementById('fct').value,
  competitionRange:document.getElementById('fcr').value,
  notes:document.getElementById('fn').value.trim(),
  updatedAt:new Date().toISOString()
};
var os=DB.getOrders();
if(eid){
  // 编辑模式：合并更新，保留旧字段（品牌/产品名兼容）
  var idx=os.findIndex(function(x){return x.id===eid});
  if(idx>=0){
    os[idx]=Object.assign(os[idx],od,{brandName:b,productName:p});
    DB.saveOrders(os);toast('更新成功 ✅','ok')
  }
}else{
  od.id=gid();od.createdAt=new Date().toISOString();
  os.push(od);DB.saveOrders(os);toast('商单已保存 ✅','ok')
}
sw('home');
}

// 利润预览（返点模型）
function updPP(){
var pr=parseFloat(document.getElementById('fpr').value)||0;
var onlineRate=parseFloat(document.getElementById('for').value)||0;
var offlineRate=parseFloat(document.getElementById('ffr').value)||0;
var pc=parseFloat(document.getElementById('fpc').value)||0;
var lc=parseFloat(document.getElementById('flc').value)||0;
var onlineAmt=pr*(onlineRate/100);
var offlineAmt=pr*(offlineRate/100);
var afterRebate=pr-onlineAmt-offlineAmt;
var netProfit=afterRebate-pc-lc;
var tax=Math.max(0,(afterRebate-pc))*0.01;
document.getElementById('ppPrc').textContent=fY(pr);
document.getElementById('ppOr').textContent='- ¥'+fm(onlineAmt);
document.getElementById('ppOfr').textContent='- ¥'+fm(offlineAmt);
document.getElementById('ppArp').innerHTML=fY(afterRebate)+(pr>0?'<span class="pprate3">('+rStr(netProfit,pr)+')</span>':'');
document.getElementById('ppTax').textContent='≈ ¥'+fm(tax);
document.getElementById('ppCd').style.display=pr>0?'block':'none';
}

function svBr(){var v=document.getElementById('fb').value.trim();if(!v)return;var bs=DB.getBrands();if(bs.indexOf(v)<0){bs.push(v);DB.saveBrands(bs);toast('「'+v+'」已存入品牌库','ok')}updBTgs()}
function updBTgs(){var bs=DB.getBrands();document.getElementById('bTags').innerHTML=bs.slice(0,12).map(function(b){return '<span class="bt2">'+b+' <span class="rm" onclick="rmBr(\''+b.replace(/'/g,"\\\'')+'\')">×</span></span>'}).join('')}
function rmBr(b){var bs=DB.getBrands();bs=bs.filter(function(x){return x!==b});DB.saveBrands(bs);updBTgs()}
function updBDL(){var bs=DB.getBrands();document.getElementById('bdl').innerHTML=bs.map(function(b){return '<option value="'+esc(b)+'">'}).join('')}
