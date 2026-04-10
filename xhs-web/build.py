#!/usr/bin/env python3
"""Build complete xhs-web/index.html - desktop version"""
import os

out = '/Users/chenhuixin/WorkBuddy/20260407012833/xhs-web/index.html'

# Read existing CSS + HTML body (which is good)
with open(out, 'r') as f:
    existing = f.read()

# Find where JS starts and what's missing
# The existing file has: HTML+CSS (complete) + partial JS (missing many functions)
# Strategy: extract everything up to <script>, then write complete JS

# Check what we have
script_start = existing.find('<script>')
if script_start > 0:
    html_part = existing[:script_start]
else:
    html_part = existing

print(f"HTML+CSS part: {len(html_part)} chars")

# Complete JavaScript
js = r"""
const DB={get(k,d){try{return JSON.parse(localStorage.getItem(k))}catch(e){return d||null}},set(k,v){localStorage.setItem(k,JSON.stringify(v))},getOrders(){return this.get('xhs_orders',[])},saveOrders(o){this.set('xhs_orders',o)},getBrands(){return this.get('xhs_brands',[])},saveBrands(b){this.set('xhs_brands',b)}};
const SM={'-1':{n:'\u5df2\u53d6\u6d88',c:'td'},'0':{n:'\u5f85\u63a5\u5355',c:'tp'},'1':{n:'\u5df2\u63a5\u5355',c:'tr'},'2':{n:'\u5236\u4f5c\u4e2d',c:'tv'},'3':{n:'\u5f85\u5ba1\u6838',c:'tm'},'4':{n:'\u5df2\u901a\u8fc7',c:'td'},'5':{n:'\u4fee\u6539\u4e2d',c:'tm'},'6':{n:'\u5df2\u53d1\u5e03',c:'td'},'7':{n:'\u5df2\u5b8c\u6210',c:'tpd'}};
const SO=['-1','0','1','2','3','4','5','6','7'];
const MON=['\u4e00\u6708','\u4e8c\u6708','\u4e09\u6708','\u56db\u6708','\u4e94\u6708','\u516d\u6708','\u4e03\u6708','\u516b\u6708','\u4e5d\u6708','\u5341\u6708','\u5341\u4e00\u6708','\u5341\u4e8c\u6708'];

function fm(n){if(!n&&n!==0)return'0';return Number(n).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function fY(v){return'\u00A5'+fm(v)}
function rStr(p,c){if(!c)return'-';var r=Number(p)/Number(c)*100;return(isNaN(r)||!isFinite(r))?'-':r.toFixed(1)+'%'}
function ds(d){if(!d)return'';if(typeof d==='string')return d.length>=10?d:d.slice(0,10);return d.toISOString().slice(0,10)}
function today(){return new Date().toISOString().slice(0,10)}
function cP(o){var p=Number(o.price||0),pc=Number(o.promoteCost||0),lc=Number(o.laborCost||0),oc=Number(o.otherCost||0),tc=pc+lc+oc,pf=p-tc,r=tc>0?pf/p*100:100;return{price,promoteCost:pc,laborCost:lc,otherCost:oc,totalCost:tc,profit:pf,rate:isNaN(r)?0:r}}
function gid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,6)}
function esc(s){var e=document.createElement('div');e.textContent=s||'';return e.innerHTML}

function toast(m,t){var c=document.getElementById('tc'),el=document.createElement('div');el.className='to2 '+(t||'');el.innerHTML=(t==='er'?'\u274C':t==='ok'?'\u2705':'\u2139\uFE0F ')+' '+m;c.appendChild(el);setTimeout(function(){el.style.opacity='0';el.style.transform='translateX(36px)';setTimeout(function(){el.remove()},260)},2400)}

var cp='home';
function sw(p,nR){
document.querySelectorAll('.pg').forEach(function(x){x.classList.remove('on')});
document.querySelectorAll('.ni').forEach(function(x){x.classList.remove('on')});
var t=document.getElementById('p'+p[0].toUpperCase()+p.slice(1));if(t)t.classList.add('on');
var n=document.querySelector('.ni[data-page="'+p+'"]');if(n)n.classList.add('on');
var info={home:{title:'\u9996\u9875\u603B\u89c8',desc:'\u5feb\u901f\u5f55\u5165 \u00b7 \u672c\u6708\u6982\u89c8 \u00b7 \u8fd1\u671f\u6392\u671f'},calendar:{title:'\u65e5\u5386\u89c6\u56fe',desc:'\u6309\u65e5\u671f\u67e5\u770b\u5546\u5355\u6392\u671f'},orders:{title:'\u5546\u5355\u5217\u8868',desc:'\u7ba1\u7406\u6240\u6709\u5546\u5355\u8bb0\u5f55'},add:{title:'\u65b0\u5efa\u5546\u5355',desc:'\u586b\u5199\u4fe1\u606f\u5e76\u4fdd\u5b58'},stats:{title:'\u6570\u636e\u7edf\u8ba1',desc:'\u5229\u6da6\u5206\u6790 \u00b7 \u6210\u672c\u6c47\u603b \u00b7 \u8d8b\u52bf\u56fe\u8868'},detail:{title:'\u5546\u5355\u8be6\u60c5'}}[p]||{};
document.getElementById('pgT').textContent=info.title;document.getElementById('pgD').textContent=info.desc;cp=p;
if(p==='home')renderHome();else if(p==='calendar')rendCal();else if(p==='orders')rendOL();else if(p==='stats')rendStats();else if(p==='add'&&!nR)resetF();
document.getElementById('sb').classList.remove('on');window.scrollTo(0,0);
}
function tog(){document.getElementById('sb').classList.toggle('on')}

function renderHome(){
var os=DB.getOrders(),now=new Date(),y=now.getFullYear(),m=now.getMonth();
var mOs=os.filter(function(o){var sd=o.scheduleDate;if(!sd)return false;var d=new Date(sd);return d.getFullYear()===y&&d.getMonth()===m});
var tp=0,tc=0,cnt=mOs.length;
mOs.forEach(function(o){var r=cP(o);tp+=r.profit;tc+=r.totalCost});
var ar=cnt?tp/mOs.reduce(function(s,o){return s+Number(o.price||0)},0)*100:0;
document.getElementById('hs').innerHTML='<div class="sc"><div class="si r">\uD83D\uDCB0</div><div class="sii"><div class="sil">'+MON[m]+'\u51c0\u5229\u6da6</div><div class="siv" style="'+(tp>=0?'':'color:#E74C3C')+'">'+fY(tp)+'</div></div></div><div class="sc"><div class="si b">\uD83D\uDCCA</div><div class="sii"><div class="sil">'+MON[m]+'\u5546\u5355\u6570</div><div class="siv">'+cnt+'<span class="u">\u5355</span></div></div></div><div class="sc"><div class="si g">\uD83D\uDCC8</div><div class="sii"><div class="sil">\u5e73\u5747\u5229\u6da6\u7387</div><div class="siv">'+(cnt?ar.toFixed(1):'-')+'<span class="u">%</span></div></div></div><div class="sc"><div class="si o">\uD83D\uDCB8</div><div class="sii"><div class="sil">\u603B\u6210\u672c\u652f\u51fa</div><div class="siv">'+fY(tc)+'</div></div></div>';
// upcoming
var up=os.filter(function(o){if(!o.scheduleDate||o.status==='-1'||o.status==='7')return false;var diff=(new Date(o.scheduleDate)-now)/86400000;return diff>=-1&&diff<=30}).sort(function(a,b){return new Date(a.scheduleDate)-new Date(b.scheduleDate)}).slice(0,6);
var sl=document.getElementById('schL');
if(!up.length)sl.innerHTML='<li class="emp"><div class="ei">\uD83D\uDCC5</div><p>\u6682\u65e0\u8fd1\u671f\u6392\u671f</p></li>';
else{sl.innerHTML='';up.forEach(function(o){var d=new Date(o.scheduleDate),st=SM[o.status]||SM['0'];var li=document.createElement('li');li.className='si2';li.onclick=function(){viewO(o.id)};li.innerHTML='<div class="sdt"><div class="sdd">'+d.getDate()+'</div><div class="sdm">'+(d.getMonth()+1)+'\u6708</div></div><div class="si2i"><div class="si2b">'+esc(o.brand)+'</div><div class="si2p">'+esc(o.product)+' \u00b7 '+st.n+'</div></div><div><span class="tg '+st.c+'">'+st.n+'</span></div>';sl.appendChild(li)})};
// recent
var rc=[].concat(os).sort(function(a,b){return new Date(b.createdAt||b.id)-new Date(a.createdAt||a.id)}).slice(0,5);
var rl=document.getElementById('rcL');
if(!rc.length)rl.innerHTML='<li class="emp"><div class="ei">\uD83D\uDCCB</div><p>\u8fd8\u6ca1\u6709\u5546\u5355\uff0c\u5feb\u53bb\u521b\u5efa\u7b2c\u4e00\u4e2a\uff01</p></li>';
else{rl.innerHTML='';rc.forEach(function(o,i){var rp=cP(o),rk=i<3?'rk'+(i+1):'rkn';var li2=document.createElement('li');li2.className='ri2';li2.onclick=function(){viewO(o.id)};li2.innerHTML='<div class="rr2 '+rk+'">'+(i+1)+'</div><div class="ri2i"><div class="ri2b">'+esc(o.brand)+'</div><div class="ri2m"><span>'+esc(o.product)+'</span><span>'+(o.scheduleDate||'\u672a\u6392\u671f')+'</span></div></div><div class="rip2"><div class="amt '+(rp.profit>=0?'pp':'pn')+'">'+fY(rp.profit)+'</div><div class="rt2">'+rStr(rp.profit,rp.price)+'</div></div>';rl.appendChild(li2)})};
updBDL();
}

function subQ(){
var b=document.getElementById('qb').value.trim(),p=document.getElementById('qp').value.trim(),pr=parseFloat(document.getElementById('qpr').value)||0,sd=document.getElementById('qd').value;
if(!b){toast('\u8bf7\u586b\u5199\u54c1\u724c','er');return}if(!p){toast('\u8bf7\u586b\u5199\u4ea7\u54c1\u540d\u79f0','er');return}if(!pr||pr<=0){toast('\u8bf7\u586b\u5199\u6709\u6548\u91d1\u989d','er');return}
var o={id:gid(),brand:b,product:p,price:pr,scheduleDate:sd,promoteCost:0,laborCost:0,otherCost:0,status:'0',paid:'0',note:'',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
DB.getOrders().push(o);DB.saveOrders(DB.getOrders());toast('\u5546\u5355\u5df2\u4fdd\u5b58 \u2705','ok');
document.getElementById('qb').value='';document.getElementById('qp').value='';document.getElementById('qpr').value='';document.getElementById('qd').value='';
renderHome();
}

function rendOL(){
var os=DB.getOrders(),kw=(document.getElementById('oSrch').value||'').toLowerCase(),fs=document.getElementById('ofS').value,fpd=document.getElementById('opS').value;
var f=os.filter(function(o){
if(fs&&o.status!==fs)return false;if(fpd&&o.paid!==fpd)return false;
if(kw){var s=(o.brand+' '+(o.product||'')+' '+(o.note||'')).toLowerCase();if(s.indexOf(kw)<0)return false}return true;
}).sort(function(a,b){return new Date(b.createdAt||b.id)-new Date(a.createdAt||a.id)});
var tb=document.getElementById('oTB');
if(!f.length){tb.innerHTML='<tr><td colspan="10"><div class="emp" style="padding:36px"><div class="ei">\uD83D\uDCE7</div><p>\u6ca1\u6709\u627e\u5230\u5339\u914d\u7684\u5546\u5355</p></div></td></tr>';popFl();return}
var h='';f.forEach(function(o){
var rp=cP(o),st=SM[o.status]||SM['0'],paid=o.paid==='1';
h+='<tr><td><strong>'+esc(o.brand)+'</strong></td><td>'+esc(o.product)+'</td><td>'+fY(o.price)+'</td><td>'+fY(rp.totalCost)+'</td><td class="'+(rp.profit>=0?'pp':'pn')+'">'+fY(rp.profit)+'</td><td><span class="pr">'+rStr(rp.profit,rp.price)+'</span></td><td>'+(o.scheduleDate||'-')+'</td><td><span class="tg '+st.c+'">'+st.n+'</span></td><td><span class="tg '+(paid?'tpd':'tu')+'">'+(paid?'\u5df2\u7ed3\u7b97':'\u672a\u7ed3\u7b97')+'</span></td><td class="ct"><button class="bg btn bs" onclick="viewO(\''+o.id+'\')">\u8be6\u60c5</button><button class="bg btn bs" style="margin-left:3px" onclick="editO(\''+o.id+'\')">\u7f16\u8f91</button></td></tr>'
});tb.innerHTML=h;popFl();
}

function popFl(){
var os=DB.getOrders(),us=new Set();os.forEach(function(o){if(o.status)us.add(o.status)});
var of=document.getElementById('ofS'),cs=document.getElementById('cfS'),cv=of.value,cv2=cs.value;
of.innerHTML='<option value="">\u5168\u90e8\u72b6\u6001</option>';cs.innerHTML='<option value="">\u5168\u90e8\u72b6\u6001</option>';
SO.forEach(function(k){if(us.has(k)){of.innerHTML+='<option value="'+k+'">'+SM[k].n+'</option>';cs.innerHTML+='<option value="'+k+'">'+SM[k].n+'</option>'}});
of.value=cv;cs.value=cv2;
}

function viewO(id){rendDetail(id);sw('detail')}
function editO(id){loadFE(id);sw('add',true)}
function deleteO(id){showCO('\u786e\u5b9a\u8981\u5220\u9664\u8be5\u5546\u5355\u5417\uff1f\u6b64\u64cd\u4f5c\u65e0\u6cd5\u64a4\u9500\uff01',function(){var os=DB.getOrders();os=os.filter(function(x){return x.id!==id});DB.saveOrders(os);toast('\u5df2\u5220\u9664','ok');rendOL();renderHome()})}

function resetF(){
['eoid','fb','fp','fpr'].forEach(function(id){document.getElementById(id).value=''});
document.getElementById('fd').value=today();document.getElementById('fst').value='0';document.getElementById('fpd').value='0';
['fpc','flc','foc'].forEach(function(id){document.getElementById(id).value='0'});
document.getElementById('fn').value='';document.getElementById('ppCd').style.display='none';
document.getElementById('savBtn').textContent='\u2705 \u4fdd\u5b58\u5546\u5355';updBTgs();
}

function loadFE(id){
var os=DB.getOrders(),o=os.find(function(x){return x.id===id});if(!o){toast('\u627e\u4e0d\u5230\u8be5\u5546\u5355','er');return}
resetF();
document.getElementById('eoid').value=id;document.getElementById('fb').value=o.brand||'';
document.getElementById('fp').value=o.product||'';document.getElementById('fpr').value=o.price||'';
document.getElementById('fd').value=o.scheduleDate||today();document.getElementById('fst').value=o.status||'0';
document.getElementById('fpd').value=o.paid||'0';document.getElementById('fpc').value=o.promoteCost||'0';
document.getElementById('flc').value=o.laborCost||'0';document.getElementById('foc').value=o.otherCost||'0';
document.getElementById('fn').value=o.note||'';document.getElementById('savBtn').textContent='\uD83D\uDCBE \u66f4\u65b0\u5546\u5355';updPP();
}

function saveO(){
var b=document.getElementById('fb').value.trim(),p=document.getElementById('fp').value.trim(),pr=parseFloat(document.getElementById('fpr').value);
if(!b){toast('\u8bf7\u586b\u5199\u54c1\u724c','er');return}if(!p){toast('\u8bf7\u586b\u5199\u4ea7\u54c1\u540d\u79f0','er');return}if(!pr||pr<=0){toast('\u8bf7\u586b\u5199\u6709\u6548\u91d1\u989d','er');return}
var eid=document.getElementById('eoid').value,od={brand:b,product:p,price:pr,scheduleDate:ds(document.getElementById('fd').value),
status:document.getElementById('fst').value,paid:document.getElementById('fpd').value,
promoteCost:parseFloat(document.getElementById('fpc').value)||0,laborCost:parseFloat(document.getElementById('flc').value)||0,
otherCost:parseFloat(document.getElementById('foc').value)||0,note:document.getElementById('fn').value.trim(),updatedAt:new Date().toISOString()};
var os=DB.getOrders();
if(eid){var idx=os.findIndex(function(x){return x.id===eid});if(idx>=0){os[idx]=Object.assign(os[idx],od);DB.saveOrders(os);toast('\u66f4\u65b0\u6210功 \u2705','ok')}}
else{od.id=gid();od.createdAt=new Date().toISOString();os.push(od);DB.saveOrders(os);toast('\u5546\u5355\u5df2\u4fdd\u5b58 \u2705','ok')}
sw('home');
}

function updPP(){
var pr=parseFloat(document.getElementById('fpr').value)||0,pc=parseFloat(document.getElementById('fpc').value)||0,
lc=parseFloat(document.getElementById('flc').value)||0,oc=parseFloat(document.getElementById('foc').value)||0,cost=pc+lc+oc,pf=pr-cost,rte=pr>0?(pf/pr*100):100;
document.getElementById('ppPrc').textContent=fY(pr);document.getElementById('ppPmt').textContent='- '+fY(pc);
document.getElementById('ppLbr').textContent='- '+fY(lc);document.getElementById('ppOth').textContent='- '+fY(oc);
document.getElementById('ppPft').innerHTML=fY(pf)+(pr>0?'<span class="pprate3">('+rte.toFixed(1)+'%)</span>':'');
document.getElementById('ppCd').style.display=pr>0?'block':'none';
}

function svBr(){var v=document.getElementById('fb').value.trim();if(!v)return;var bs=DB.getBrands();if(bs.indexOf(v)<0){bs.push(v);DB.saveBrands(bs);toast('\u300C'+v+'\u300D \u5df2\u5b58\u5165\u54c1\u724c\u5e93','ok')}updBTgs()}
function updBTgs(){var bs=DB.getBrands();document.getElementById('bTags').innerHTML=bs.slice(0,12).map(function(b){return '<span class="bt2">'+b+' <span class="rm" onclick="rmBr(\''+b.replace(/'/g,"\\'")+'\')">\u00D7</span></span>'}).join('')}
function rmBr(b){var bs=DB.getBrands();bs=bs.filter(function(x){return x!==b});DB.saveBrands(bs);updBTgs()}
function updBDL(){var bs=DB.getBrands();document.getElementById('bdl').innerHTML=bs.map(function(b){return '<option value="'+esc(b)+'">'}).join('')}
"""

# CALENDAR JS
js_cal = """
var cY,cM;
function initCal(){var n=new Date();cY=n.getFullYear();cM=n.getMonth()}
function cM(d){cM+=d;if(cM>11){cM=0;cY++}if(cM<0){cM=11;cY--}rendCal()}
function goT(){var n=new Date();cY=n.getFullYear();cM=n.getMonth();rendCal()}

function rendCal(){
initCal();
var fd=new Date(cY,cM,1),ld=new Date(cY,cM+1,0),sdow=(fd.getDay()+6)%7,dim=ld.getDate(),pml=new Date(cY,cM,0).getDate();
document.getElementById('cMTx').textContent=cY+'\u5e4d '+(cM+1)+'\u6708';
var os=DB.getOrders(),fS=document.getElementById('cfS').value,flt=fS?os.filter(function(x){return x.status===fS}):os;
var dMap={};flt.forEach(function(o){if(!o.scheduleDate)return;var s=ds(o.scheduleDate);if(!dMap[s])dMap[s]=[];dMap[s].push(o)});
var tod=today(),h='<div class="chd">\u4e00</div><div class="chd">\u4e8c</div><div class="chd">\u4e09</div><div class="chd">\u56db</div><div class="chd">\u4e94</div><div class="chd">\u516d</div><div class="chd">\u65e5</div>';
for(var i=sdow-1;i>=0;i--)h+='<div class="cd2 om"><div class="cdn">'+pml-i+'</div></div>';
for(var d=1;d<=dim;d++){
var s=cY+'-'+String(cM+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'),isT=s===tod,evs=dMap[s]||[],dot=evs.length?'<span class="cdot"></span>':'',eh='';
for(var ei=0,len=Math.min(evs.length,4);ei<len;ei++)eh+='<div class="ce c'+evs[ei].status+'" onclick="event.stopPropagation();showCM(\\''+evs[ei].id+'\\')">'+esc(evs[ei].brand)+'</div>';
if(evs.length>4)eh+='<div class="cm" onclick="event.stopPropagation();showDay(\\''+s+'\\')">+'+(evs.length-4)+' \u66f4\u591a</div>';
h+='<div class="cd2'+(isT?' today':'')+'" onclick="dayClick(\\''+s+'\\')"><div class="cdn">'+d+dot+'</div>'+eh+'</div>';
}
var tc2=sdow+dim,rm=(42-tc2)%7;for(var ri=0;ri<rm;ri++)h+='<div class="cd2 om"><div class="cdn">'+(ri+1)+'</div></div>';
document.getElementById('cGr').innerHTML=h;

var mOs2=os.filter(function(o){if(!o.scheduleDate)return false;var dd=new Date(o.scheduleDate);return dd.getFullYear()===cY&&dd.getMonth()===cM});
var mTP=0,mTC=0,mCnt=mOs2.length;mOs2.forEach(function(o2){var r=cP(o2);mTP+=r.profit;mTC+=r.totalCost});
var tRev=mOs2.reduce(function(s,x){return s+Number(x.price||0)},0);
document.getElementById('cMSum').innerHTML='<div class="ppr3"><span class="ppl3">\u5546\u5355\u603B\u6570</span><span class="ppv3">'+mCnt+' \u5355</span></div>'
+'<div class="ppr3"><span class="ppl3">\u603B\u5408\u4f5c\u91d1\u989d</span><span class="ppv3">\u00A5'+fm(tRev)+'</span></div>'
+'<div class="ppr3 ppt3"><span class="ppl3>\u51c0\u5229\u6da6</span><span class="ppv3" style="'+(mTP>=0?'':'color:#E74C3C')+'">'+fY(mTP)+'<span class="pprate3">('+(mCnt?((mTP/tRev*100)||0).toFixed(1):0)+')</span></span></span></div>'
+'<div class="ppr3"><span class="ppl3">\u603B\u6210\u672c</span><span class="ppv3">'+fY(mTC)+'</span></div>';

var pd2={};mOs2.forEach(function(o){pd2[o.status]=(pd2[o.status]||0)+1});
var phtm='<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">';
SO.forEach(function(k){if(pd2[k]){var s=SM[k];phtm+='<div style="text-align:center;padding:8px 16px;background:var(--bg);border-radius:8px;min-width:80px"><div style="font-size:20px;font-weight:800;color:var(--p)">'+pd2[k]+'</div><div style="font-size:12px;color:var(--ts)">'+s.n+'</div></div>'}});
phtm+='</div>';document.getElementById('cPD').innerHTML=phtm;popFl();
}

function dayClick(ds){showDay(ds)}
function showDay(ds){var os=DB.getOrders().filter(function(o){return ds(o.scheduleDate)===ds});if(os.length===1){showCM(os[0].id)}else if(os.length>1){showCM(null,os,ds)}}

var curCalID=null;
function showCM(id,olist,dt){
curCalID=id;var mo=document.getElementById('calMO'),mb=document.getElementById('calMB');
if(id){var o=DB.getOrders().find(function(x){return x.id===id});if(!o)return;
document.getElementById('calMT').textContent=o.brand;var rp=cP(o),st=SM[o.status]||SM['0'];
mb.innerHTML='<div style="font-size:16px;font-weight:700;margin-bottom:4px">'+esc(o.brand)+'</div><div style="font-size:13px;color:var(--ts);margin-bottom:12px">'+esc(o.product)+'</div>'
+'<div style="display:flex;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><span style="color:var(--tl);min-width:70px">\u6392\u671f</span><span>'+(o.scheduleDate||'\u672a\u8bbe\u7f6e')+'</span></div>'
+'<div style="display:flex;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><span style="color:var(--tl);min-width:70px">\u72b6\u6001</span><span><span class="tg '+st.c+'">'+st.n+'</span></span></div>'
+'<div style="display:flex;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><span style="color:var(--tl);min-width:70px">\u91d1\u989d</span><span>'+fY(o.price)+'</span></div>'
+'<div style="display:flex;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><span style="color:var(--tl);min-width:70px">\u5229\u6da6</span><span style="'+(rp.profit>=0?'color:#27AE60':'color:#E74C3C')+';font-weight:600">'+fY(rp.profit)+' '+rStr(rp.profit,rp.price)+'</span></div>'
+'<div style="display:flex;padding:6px 0;font-size:13px"><span style="color:var(--tl);min-width:70px">\u6210\u672c</span><span>\u85af\u6761'+fY(rp.promoteCost)+' \u5973\u5de5'+fY(rp.laborCost)+' \u5176\u4ed6'+fY(rp.otherCost)+'</span></div>'
+(o.note?'<div style="display:flex;padding:6px 0;border-top:1px dashed var(--bd);margin-top:6px;font-size:13px"><span style="color:var(--tl);min-width:70px">\u5907\u6ce8</span><span>'+esc(o.note)+'</span></div>':'');
}else if(olist){
document.getElementById('calMT').textContent=dt+' \u7684\u5546\u5355';
var li='';olist.forEach(function(o2){li+='<div style="padding:10px 0;border-bottom:1px dashed var(--bd);cursor:pointer" onclick="showCM(\\''+o2.id+'\\')"><strong>'+esc(o2.brand)+'</strong> - '+esc(o2.product)+' <span class="tg '+(SM[o2.status]||SM['0']).c+'">'+(SM[o2.status]||SM['0']).n+'</span></div>'});
mb.innerHTML='<p style="margin-bottom:12px;color:var(--ts)">\u5171 '+olist.length+' \u6761\u5546\u5355</p>'+li;
}
mo.classList.add('sh');
}
function clsCM(){document.getElementById('calMO').classList.remove('sh')}
function goDFromCal(){clsCM();if(curCalID)viewO(curCalID)}
"""

# DETAIL + STATS JS
js_ds = """
var curDID=null;
function rendDetail(id){
curDID=id;var os=DB.getOrders(),o=os.find(function(x){return x.id===id});if(!o)return;
var rp=cP(o),st=SM[o.status]||SM['0'],paid=o.paid==='1';
document.getElementById('dBdg').innerHTML='<span class="tg '+st.c+'" style="font-size:14px;padding:6px 18px">'+st.n+'</span> <span class="tg '+(paid?'tpd':'tu')+'" style="font-size:14px;padding:6px 18px;margin-left:6px">'+(paid?'\u5df2\u7ed3\u7b97':'\u672a\u7ed3\u7b97')+'</span>';
document.getElementById('dBrnd').textContent=o.brand;document.getElementById('dProd').textContent=o.product||'';
document.getElementById('dPCd').innerHTML='<div style="font-size:14px;font-weight:700;margin-bottom:10px">\uD83D\uDCB0 \u5229\u6da6\u5206\u6790</div>'
+'<div class="ppr3"><span class="ppl3">\u5408\u4f5c\u91d1\u989d</span><span class="ppv3">'+fY(o.price)+'</span></div>'
+'<div class="ppr3"><span class="ppl3">\u85af\u6761\u8d39\u7528</span><span class="ppv3">- '+fY(rp.promoteCost)+'</span></div>'
+'<div class="ppr3"><span class="ppl3">\u5973\u5de5\u8d39\u7528</span><span class="ppv3">- '+fY(rp.laborCost)+'</span></div>'
+'<div class="ppr3"><span class="ppl3">\u5176\u4ed6\u8d39\u7528</span><span class="ppv3">- '+fY(rp.otherCost)+'</span></div>'
+'<div class="ppr3 ppt3"><span class="ppl3">\u51c0\u5229\u6da6</span><span class="ppv3" style="'+(rp.profit>=0?'':'color:#E74C3C')+'">'+fY(rp.profit)+'<span class="pprate3">'+rStr(rp.profit,rp.price)+'</span></span></div>';
document.getElementById('dMg').innerHTML=
'<div class="mi"><div class="mil">\u521b\u5efa\u65f6\u95f4</div><div class="miv">'+(o.createdAt?new Date(o.createdAt).toLocaleString():'-')+'</div></div>'
+'<div class="mi"><div class="mil">\u66f4\u65b0\u65f6\u95f4</div><div class="miv">'+(o.updatedAt?new Date(o.updatedAt).toLocaleString():'-')+'</div></div>'
+'<div class="mi"><div class="mil">\u6392\u671f\u65e5\u671f</div><div class="miv">'+(o.scheduleDate||'\u672a\u8bbe\u7f6e')+'</div></div>'
+'<div class="mi"><div class="mil">\u7ed3\u7b97\u72b6\u6001</div><div class="miv"><span class="tg '+(paid?'tpd':'tu')+'">'+(paid?'\u5df2\u7ed3\u7b97':'\u672a\u7ed3\u7b97')+'</span></div></div>';
var sn=['','\u5f85\u63a5\u5355','\u5df2\u63a5\u5355'\