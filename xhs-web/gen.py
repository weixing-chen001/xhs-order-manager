#!/usr/bin/env python3
"""Generate the complete xhs-web/index.html file"""
import os

output = '/Users/chenhuixin/WorkBuddy/20260407012833/xhs-web/index.html'

# CSS - desktop-first layout
CSS = r"""
:root{--p:#E74C3C;--pl:#FDECEC;--pd:#C0392B;--ac:#FF6B6B;--bg:#F7F8FA;--w:#FFF;--t:#2C2C2C;--ts:#666;--tl:#999;--bd:#EEE;--bdk:#DDD;--sh:0 1px 4px rgba(0,0,0,.06);--shm:0 2px 12px rgba(0,0,0,.08);--r:10px;--rs:6px;--sw:220px}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;background:var(--bg);color:var(--t);line-height:1.6;min-height:100vh}
.al{display:flex;min-height:100vh}
.sb{width:var(--sw);background:var(--w);border-right:1px solid var(--bd);position:fixed;top:0;left:0;bottom:0;z-index:100;display:flex;flex-direction:column;box-shadow:var(--sh)}
.sbb{padding:18px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--bd)}
.sbl{width:34px;height:34px;background:linear-gradient(135deg,var(--p),var(--ac));border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:17px;font-weight:bold;flex-shrink:0}
.sbt{font-size:14px;font-weight:700;color:var(--t)}.sbs{font-size:11px;color:var(--tl)}
.sn{flex:1;padding:12px 8px;overflow-y:auto}
.ni{display:flex;align-items:center;gap:9px;padding:10px 13px;border-radius:var(--rs);cursor:pointer;font-size:14px;color:var(--ts);text-decoration:none;margin-bottom:2px;transition:background .12s}
.ni:hover{background:var(--pl);color:var(--p)}.ni.on{background:var(--pl);color:var(--p);font-weight:600}
.nic{width:19px;font-size:16px;text-align:center;flex-shrink:0}
.sbf{padding:14px;border-top:1px solid var(--bd);font-size:11px;color:var(--tl);text-align:center;line-height:1.5}
.mc{margin-left:var(--sw);flex:1;min-height:100vh;display:flex;flex-direction:column}
.tb{height:58px;background:var(--w);border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;padding:0 30px;position:sticky;top:0;z-index:50;box-shadow:var(--sh)}
.tbl{display:flex;align-items:center;gap:16px}.ptitle{font-size:17px;font-weight:700}.pdesc{font-size:13px;color:var(--tl)}.tbr{display:flex;align-items:center;gap:10px}
.ca{padding:26px 30px;flex:1;max-width:1380px;width:100%}
.pg{display:none}.pg.on{display:block;animation:fi .2s ease}@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1}}
.cd{background:var(--w);border-radius:var(--r);box-shadow:var(--sh);padding:20px;margin-bottom:16px}
.cdh{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.cdt{font-size:15px;font-weight:700}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
.sc{background:var(--w);border-radius:var(--r);padding:18px;box-shadow:var(--sh);display:flex;align-items:flex-start;gap:12px;transition:transform .12s,box-shadow .12s;cursor:default}
.sc:hover{transform:translateY(-2px);box-shadow:var(--shm)}
.si{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.si.r{background:var(--pl);color:var(--p)}.si.g{background:#E8F8F0;color:#27AE60}.si.b{background:#EBF5FB;color:#3498DB}.si.o{background:#FEF5E7;color:#F39C12}
.sii{flex:1}.sil{font-size:12px;color:var(--ts);margin-bottom:3px}.siv{font-size:23px;font-weight:800}.siv .u{font-size:13px;font-weight:500;color:var(--ts)}
.qe{background:linear-gradient(135deg,var(--p),var(--ac));border-radius:var(--r);padding:20px 24px;color:#fff;margin-bottom:20px}
.qe h3{font-size:15px;margin-bottom:12px;font-weight:600}
.qf{display:flex;gap:10px;align-items:end;flex-wrap:wrap}
.qg{display:flex;flex-direction:column;gap:4px;flex:1;min-width:120px}.qg label{font-size:12px;opacity:.85;font-weight:500}
.qi{padding:8px 11px;border-radius:var(--rs);border:none;font-size:14px;background:rgba(255,255,255,.95);color:var(--t)}.qi:focus{box-shadow:0 0 0 3px rgba(255,255,255,.4)}
.btn{padding:9px 20px;border-radius:var(--rs);font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .12s;display:inline-flex;align-items:center;gap:5px}
.bp{background:var(--t);color:#fff;border:none}.bp:hover{background:#444}
.ba{background:var(--p);color:#fff;border:none}.ba:hover{background:var(--pd)}
.bo{background:transparent;color:var(--p);border:1.5px solid var(--p)}.bo:hover{background:var(--pl)}.bs{padding:5px 12px;font-size:13px;border-radius:5px}
.bd{background:#E74C3C;color:#fff;border:none}.bd:hover{background:#c0392b}
.bg{background:transparent;color:var(--ts);border:1px solid var(--bd)}.bg:hover{background:var(--bg)}
.r2{display:grid;grid-template-columns:1fr 1fr;gap:16px}.tw{overflow-x:auto;border-radius:var(--r);border:1px solid var(--bd)}
.dt{width:100%;border-collapse:collapse;font-size:13px;background:var(--w)}
.dt th{background:#F8F9FB;padding:10px 12px;text-align:left;font-weight:600;color:var(--ts);font-size:12px;border-bottom:2px solid var(--bd)}
.dt tr{border-bottom:1px solid var(--bd)}.dt tr:hover{background:#FAFBFC}.dt td{padding:10px 12px;vertical-align:middle}.dt td.ct{text-align:center}
.tg{display:inline-block;padding:3px 9px;border-radius:20px;font-size:12px;font-weight:500;white-space:nowrap}
.tp{background:#FFF3CD;color:#856404}.tr{background:#CCE5FF;color:#004085}.tv{background:#D4EDDA;color:#155724}
.tm{background:#F8D7DA;color:#721C24}.td{background:#D1ECF1;color:#0C5460}.tpd{background:#E8F8F0;color:#27AE60}.tu{background:#FDEDEC;color:#E74C3C}
.pp{color:#27AE60;font-weight:700}.pn{color:#E74C3C;font-weight:700}
.tbz{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.sbx{display:flex;align-items:center;background:var(--w);border:1px solid var(--bdk);border-radius:var(--rs);padding:0 10px;min-width:200px}
.sbx:focus-within{border-color:var(--p);box-shadow:0 0 0 3px var(--pl)}
.sbx input{border:none;outline:none;padding:8px 6px;font-size:13px;background:transparent;flex:1}
.fg2{display:flex;align-items:center;gap:7px}.fg2 label{font-size:12px;color:var(--ts)}
.fs{padding:7px 26px 7px 9px;border:1px solid var(--bdk);border-radius:var(--rs);font-size:13px;color:var(--t);background:var(--w);cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 9px center}
.tsp{flex:1}
.ch{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}
.chd{text-align:center;font-size:12px;font-weight:700;color:var(--tl);padding:7px 0;text-transform:uppercase}
.cd2{background:var(--w);border-radius:var(--rs);min-height:100px;padding:5px 7px;border:1px solid transparent;cursor:pointer;transition:all .12s}
.cd2:hover{border-color:var(--p);box-shadow:var(--sh);z-index:2}
.cd2.om{opacity:.35;background:#FAFAFA}.cd2.today{border-color:var(--p);background:var(--pl)}
.cdn{font-size:13px;font-weight:700;color:var(--t);margin-bottom:3px;display:flex;justify-content:space-between}
.cd2.today .cdn{color:var(--p)}.cdot{width:5px;height:5px;border-radius:50%;background:var(--p);display:inline-block}
.ce{font-size:11px;padding:2px 4px;border-radius:3px;margin-bottom:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;line-height:1.4}
.c0{background:#FEF9E7;color:#9A7D0A;border-left:3px solid #F1C40F}.c1{background:#EBF5FB;color:#1A5276;border-left:3px solid #3498DB}
.c2{background:#E8DAEF;color:#6C3483;border-left:3px solid #9B59B6}.c3{background:#FCF3CF;color:#7D6608;border-left:3px solid #F4D03F}
.c4{background:#D5F5E3;color:#196F3D;border-left:3px solid #2ECC71}.c5{background:#D6EAF8;color:#1B4F72;border-left:3px solid #5DADE2}
.c6{background:#FADBD8;color:#943126;border-left:3px solid #EC7063}.c7{background:#EAEDED;color:#1D8348;border-left:3px solid #58D68D}
.cm{font-size:11px;color:var(--p);font-weight:600;cursor:pointer}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.cba{width:100%;height:190px}.cbs{display:flex;align-items:flex-end;height:150px;gap:7px;padding:0 8px}
.cbw{flex:1;display:flex;flex-direction:column;align-items:center;height:100%}
.cbar{width:100%;border-radius:4px 4px 0 0;min-height:3px;transition:height .4s ease}
.barp{background:linear-gradient(to top,var(--p),var(--ac))}.barn{background:linear-gradient(to top,#BDC3C7,#95A5A6)}
.cbv{font-size:10px;color:var(--ts);margin-top:3px;font-weight:600}.cbl{font-size:11px;color:var(--tl);margin-top:5px;text-align:center}
.dnut{width:130px;height:130px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto;background:#EEE}.dpct{font-size:25px;font-weight:800;text-align:center}.dlbl{font-size:12px;color:var(--tl);text-align:center}
.lgd2{margin-top:14px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.lgi2{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--ts)}.lgd3{width:9px;height:9px;border-radius:3px}
.cst{width:100%;font-size:13px}.cst th{background:#F8F9FB;padding:9px 12px;text-align:left;font-size:12px;font-weight:600;color:var(--ts);border-bottom:2px solid var(--bd)}
.cst td{padding:9px 12px;border-bottom:1px solid var(--bd)}.cst tr:last-child td{border-bottom:none;font-weight:700;background:#FDFAF8}
.dhf{display:flex;align-items:start;gap:18px;margin-bottom:18px}
.dsb{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:20px;font-size:13px;font-weight:600;margin-bottom:10px}
.dmg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.mil{font-size:12px;color:var(--tl)}.miv{font-size:13px;font-weight:600}
.tl2{position:relative;padding-left:26px;margin:16px 0}.tl2::before{content:'';position:absolute;left:10px;top:0;bottom:0;width:2px;background:var(--bd)}
.tli2{position:relative;margin-bottom:14px}.tld2{position:absolute;left:-21px;top:3px;width:10px;height:10px;border-radius:50%;border:2px solid var(--bd);background:var(--w)}
.tld2.a{background:var(--p)}.tld2.d{background:#27AE60}.tlt2{font-size:13px;font-weight:600}.tlda{font-size:12px;color:var(--tl)}
.stps{display:flex;align-items:center;gap:3px;margin:16px 0;padding:12px;background:#FAFAFA;border-radius:var(--r)}
.step{flex:1;text-align:center;position:relative}.step::after{content:'';position:absolute;top:10px;right:-50%;width:100%;height:2px;background:var(--bd)}.step:last-child::after{display:none}
.scir{width:20px;height:20px;border-radius:50%;background:var(--bd);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin:0 auto 5px}
.step.a .scir{background:var(--p)}.step.d .scir{background:#27AE60}.stl{font-size:11px;color:var(--tl)}
.fpg{max-width:880px}.fsec{margin-bottom:22px}.fst{font-size:14px;font-weight:700;color:var(--t);margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid var(--p);display:inline-block}
.fg2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.fg3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.fgi{display:flex;flex-direction:column;gap:5px}.fgiw{grid-column:1/-1}
.fl2{font-size:13px;font-weight:600;color:var(--ts)}.rq{color:#E74C3C;margin-left:2px}
.fi2{padding:9px 12px;border:1.5px solid var(--bdk);border-radius:var(--rs);font-size:14px;color:var(--t);background:var(--w);font-family:inherit}
.fi2:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--pl)}
.fta{resize:vertical;min-height:68px}
.btags{display:flex;flex-wrap:wrap;gap:5px;margin-top:3px}
.bt2{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;background:var(--pl);color:var(--p);border-radius:20px;font-size:12px;font-weight:500}
.ppc{background:linear-gradient(135deg,#F8F9FB,#EDF2F7);border-radius:var(--r);padding:16px 20px;margin-top:12px;border-left:4px solid var(--p)}
.ppr3{display:flex;justify-content:space-between;align-items:baseline;padding:5px 0}
.ppl3{font-size:13px;color:var(--ts)}.ppv3{font-size:14px;font-weight:700}
.ppt3{border-top:2px dashed var(--bd);margin-top:6px!important;padding-top:10px!important}
.ppt3 .ppv3{font-size:19px;color:var(--p)}.pprate3{font-size:12px;color:var(--ts);margin-left:6px}
.fact{display:flex;justify-content:flex-end;gap:10px;margin-bottom:22px;padding-top:16px;border-top:1px solid var(--bd)}
.sl2,.rl2{list-style:none}
.si2{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--bd);cursor:pointer}.si2:last-child{border-bottom:none}.si2:hover{background:#FAFAFA;margin:0-10px;padding:11px;border-radius:var(--rs)}
.sdt{min-width:44px;text-align:center;flex-shrink:0}.sdd{font-size:19px;font-weight:800;color:var(--p)}.sdm{font-size:11px;color:var(--tl)}
.si2i{flex:1;min-width:0}.si2b{font-size:14px;font-weight:600}.si2p{font-size:12px;color:var(--ts)}
.rr2{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.rk1{background:#FFEAA7;color:#B7791F}.rk2{background:#DFE6E9;color:#636E72}.rk3{background:#FAB1A0;color:#D35400}.rkn{background:var(--bg);color:var(--tl)}
.ri2i{flex:1;min-width:0}.ri2b{font-size:14px;font-weight:600}.ri2m{font-size:12px;color:var(--ts);display:flex;gap:10px}
.rip2{text-align:right;flex-shrink:0}.rip2 .amt{font-size:14px;font-weight:700}.rip2 .rt2{font-size:11px;color:var(--tl)}
.emp{text-align:center;padding:45px 20px;color:var(--tl)}.emp .ei{font-size:48px;margin-bottom:12px;opacity:.4}.emp h3{font-size:15px;color:var(--ts)}.emp p{font-size:13px;max-width:330px;margin:0 auto}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999;display:none;align-items:center;justify-content:center;animation:fo .2s ease}.mo.sh{display:flex}
.mbx{background:var(--w);border-radius:12px;width:450px;max-width:90vw;max-height:80vh;overflow-y:auto;box-shadow:0 4px 24px rgba(0,0,0,.12)}
.mhd{display:flex;justify-content:space-between;align-items:center;padding:15px 20px;border-bottom:1px solid var(--bd)}.mhd h3{font-size:15px;font-weight:700}
.mcl{background:none;border:none;font-size:20px;cursor:pointer;color:var(--tl);padding:3px 7px;border-radius:5px}.mbd{padding:20px}.mft{display:flex;justify-content:flex-end;gap:8px;padding:13px 20px;border-top:1px solid var(--bd)}
.co2{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1099;display:none;align-items:center;justify-content:center}
.cbx{background:var(--w);border-radius:10px;width:350px;max-width:90vw;padding:22px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.12)}
.cbx h3{font-size:15px;margin-bottom:8px}.cbx p{font-size:13px;color:var(--ts);margin-bottom:18px}.cbtns{display:flex;gap:10px;justify-content:center}
.tc3{position:fixed;top:16px;right:16px;z-index:2000;display:flex;flex-direction:column;gap:7px}
.to2{background:var(--w);border-radius:var(--rs);padding:11px 17px;box-shadow:0 4px 24px rgba(0,0,0,.12);font-size:13px;display:flex;align-items:center;gap:7px;animation:tIn .25s ease;min-width:210px;border-left:4px solid var(--p)}
.to2.ok{border-left-color:#27AE60}.to2.er{border-left-color:#E74C3C}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:#CCC;border-radius:3px}
.mbtn{display:none;align-items:center;justify-content:center;width:32px;height:32px;border-radius:var(--rs);background:none;border:1px solid var(--bd);cursor:pointer;font-size:18px;color:var(--ts)}
@media(max-width:1024px){.sg{grid-template-columns:repeat(2,1fr)}.cg{grid-template-columns:1fr}.r2{grid-template-columns:1fr}.dmg{grid-template-columns:repeat(2,1fr)}.fg2{grid-template-columns:1fr}.ca{padding:18px}}
@media(max-width:768px){.sb{transform:translateX(-100%);transition:transform .25s ease}.sb.on{transform:translateX(0)}.mc{margin-left:0}.tb{padding:0 14px}.ca{padding:14px}.sg{grid-template-columns:1fr}.qf{flex-direction:column}.qg{min-width:100%}.tbz{flex-direction:column;align-items:stretch}.sbx{min-width:100%}.cd2{min-height:62px;padding:4px}.ce{font-size:10px}.dhf{flex-direction:column}.dmg{grid-template-columns:1fr}.stps{flex-wrap:wrap}.mbtn{display:flex!important}}"""

HTML_BODY = r"""
<div class="al">
<nav class="sb" id="sb">
<div class="sbb"><div class="sbl">🐷</div><div><div class="sbt">小红猪商单来喽</div><div class="sbs">XHS Order Manager</div></div></div>
<div class="sn">
<a class="ni on" data-page="home" onclick="sw('home')"><span class="nic">🏠</span> 首页总览</a>
<a class="ni" data-page="calendar" onclick="sw('calendar')"><span class="nic">📅</span> 日历视图</a>
<a class="ni" data-page="orders" onclick="sw('orders')"><span class="nic">📋</span> 商单列表</a>
<a class="ni" data-page="add" onclick="sw('add')"><span class="nic">➕</span> 新建商单</a>
<a class="ni" data-page="stats" onclick="sw('stats')"><span class="nic">📊</span> 数据统计</a>
</div>
<div class="sbf">🐷 v2.0 Web · 本地运行 · 数据安全</div>
</nav>
<main class="mc">
<header class="tb">
<div class="tbl"><button class="mbtn" onclick="tog()">☰</button><h1 class="ptitle" id="pgT">首页总览</h1><span class="pdesc" id="pgD">快速录入 · 本月概览 · 近期排期</span></div>
<div class="tbr"><button class="ba btn bs" onclick="sw('add')">➕ 新建商单</button></div>
</header>
<div class="ca">
<!-- HOME -->
<div class="pg on" id="ph">
<div class="qe"><h3>⚡ 快速录入商单</h3><div class="qf" id="qf">
<div class="qg"><label>品牌</label><input class="qi" id="qb" placeholder="输入或选择品牌" list="bdl"></div>
<div class="qg"><label>产品名称</label><input class="qi" id="qp" placeholder="产品/内容主题"></div>
<div class="qg"><label>合作金额</label><input class="qi" id="qpr" type="number" placeholder="¥0.00" step="0.01"></div>
<div class="qg"><label>排期日期</label><input class="qi" id="qd" type="date"></div>
<button class="bp btn" onclick="subQ()">保存</button>
</div></div>
<div class="sg" id="hs"></div>
<div class="r2">
<div class="cd"><div class="cdh"><h3 class="cdt">📅 近期排期</h3><button class="bg bs" onclick="sw('calendar')">查看日历 →</button></div><ul class="sl2" id="schL"><li class="emp"><div class="ei">📅</div><p>暂无近期排期</p></li></ul></div>
<div class="cd"><div class="cdh"><h3 class="cdt">📋 最近商单</h3><button class="bg bs" onclick="sw('orders')">全部 →</button></div><ul class="rl2" id="rcL"><li class="emp"><div class="ei">📋</div><p>还没有商单，快去创建第一个吧！</p></li></ul></div>
</div></div>

<!-- CALENDAR -->
<div class="pg" id="pc">
<div class="cd">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
<div style="display:flex;gap:8px"><button class="bg btn bs" onclick="cM(-1)">◀ 上月</button><button class="bg btn bs" onclick="goT()">今天</button><button class="bg btn bs" onclick="cM(1)">下月 ▶</button></div>
<div id="cMTx" style="font-size:18px;font-weight:800"></div>
<select class="fs" id="cfS" onchange="rendCal()"><option value="">全部状态</option></select>
</div>
<div class="ch" id="cGr"></div>
</div>
<div class="r2" style="margin-top:14px">
<div class="cd"><h3 class="cdt" style="margin-bottom:10px">📈 当月概览</h3><div id="cMSum"></div></div>
<div class="cd"><h3 class="cdt" style="margin-bottom:10px">📊 进度分布</h3><div id="cPD"></div></div>
</div></div>

<!-- ORDERS -->
<div class="pg" id="po">
<div class="tbz">
<div class="sbx">🔍<input type="text" id="oSrch" placeholder="搜索..." oninput="rendOL()"></div>
<select class="fs" id="ofS" onchange="rendOL()"><option value="">全部状态</option></select>
<select class="fs" id="opS" onchange="rendOL()"><option value="">全部结算</option><option value="1">已结算</option><option value="0">未结算</option></select>
<div class="tsp"></div>
<button class="bo btn bs" onclick="expO()">📥 导出</button><button class="ba btn bs" onclick="sw('add')">➕ 新建</button>
</div>
<div class="tw"><table class="dt"><thead><tr><th>品牌</th><th>产品/内容</th><th>合作金额</th><th>成本合计</th><th>净利润</th><th>利润率</th><th>排期</th><th>进度</th><th>结算</th><th>操作</th></tr></thead><tbody id="oTB"></tbody></table></div>
</div>

<!-- ADD -->
<div class="pg" id="pa">
<div class="cd fpg"><input type="hidden" id="eoid">
<div class="fsec"><h2 class="fst">📝 基本信息</h2><div class="fg2">
<div class="fgi fgiw"><label class="fl2">品牌 <span class="rq">*</span></label>
<div style="display:flex;gap:7px"><input class="fi2" id="fb" placeholder="品牌名称" style="flex:1" list="bdl"><button class="bo btn bs" onclick="svBr()" style="white-space:nowrap">💾 存品牌库</button></div>
<div class="btags" id="bTags"></div></div>
<div class="fgi"><label class="fl2">产品/内容 <span class="rq">*</span></label><input class="fi2" id="fp" placeholder="推广的产品或内容主题"></div>
<div class="fgi"><label class="fl2">合作金额 <span class="rq">*</span></label><input class="fi2" id="fpr" type="number" placeholder="0.00" step="0.01" oninput="updPP()"></div>
<div class="fgi"><label class="fl2">排期日期</label><input class="fi2" id="fd" type="date"></div>
<div class="fgi"><label class="fl2">进度状态</label><select class="fs fi2" id="fst"><option value="0">待接单</option><option value="1">已接单</option><option value="2">制作中</option><option value="3">待审核</option><option value="4">已通过</option><option value="5">修改中</option><option value="6">已发布</option><option value="7">已完成</option><option value="-1">已取消</option></select></div>
<div class="fgi"><label class="fl2">结算状态</label><select class="fs fi2" id="fpd"><option value="0">未结算</option><option value="1">已结算</option></select></div>
</div></div>
<div class="fsec"><h2 class="fst">💰 费用明细</h2><div class="fg3">
<div class="fgi"><label class="fl2">薯条费用（元）</label><input class="fi2" id="fpc" type="number" step="0.01" value="0" oninput="updPP()"></div>
<div class="fgi"><label class="fl2">女工费用（元）</label><input class="fi2" id="flc" type="number" step="0.01" value="0" oninput="updPP()"></div>
<div class="fgi"><label class="fl2">其他费用（元）</label><input class="fi2" id="foc" type="number" step="0.01" value="0" oninput="updPP()"></div>
</div>
<div class="ppc" id="ppCd" style="display:none"><div style="font-size:13px;font-weight:700;margin-bottom:8px">💎 利润预览</div>
<div class="ppr3"><span class="ppl3">合作金额</span><span class="ppv3" id="ppPrc">¥0.00</span></div>
<div class="ppr3"><span class="ppl3">— 薯条费用</span><span class="ppv3" id="ppPmt">- ¥0.00</span></div>
<div class="ppr3"><span class="ppl3">— 女工费用</span><span class="ppv3" id="ppLbr">- ¥0.00</span></div>
<div class="ppr3"><span class="ppl3">— 其他费用</span><span class="ppv3" id="ppOth">- ¥0.00</span></div>
<div class="ppr3 ppt3"><span class="ppl3">净利润</span><span class="ppv3" id="ppPft">¥0.00<span class="pprate3" id="ppRte"></span></span></div>
</div></div>
<div class="fsec"><h2 class="fst">📄 备注</h2><div class="fg2"><div class="fgi fgiw"><label class="fl2">备注内容</label><textarea class="fta fi2" id="fn" rows="3" placeholder="特殊要求、对接人信息..."></textarea></div></div></div>
<div class="fact"><button class="bg btn" onclick="resetF()">重置</button><button class="ba btn" onclick="saveO()" id="savBtn">✅ 保存商单</button></div>
</div></div>

<!-- STATS -->
<div class="pg" id="ps">
<div class="tbz"><select class="fs" id="srRng" onchange="rendStats()"><option value="month">本月</option><option value="quarter">本季度</option><option value="year">本年</option><option value="all">全部</option></select></div>
<div class="sg" id="sCards"></div>
<div class="cg">
<div class="cd"><h3 class="cdt" style="margin-bottom:12px">📈 月度利润趋势</h3><div class="cba"><div class="cbs" id="pcBs"></div></div></div>
<div class="cd"><h3 class="cdt" style="margin-bottom:12px">🎯 进度分布</h3><div id="pcArea" style="display:flex;align-items:center;gap:28px;padding:8px 0"></div></div>
</div>
<div class="r2">
<div class="cd"><h3 class="cdt" style="margin-bottom:10px">💰 成本汇总</h3><table class="cst"><thead><tr><th>项目</th><th>金额</th><th>说明</th></tr></thead><tbody id="cBody"></tbody></table></div>
<div class="cd"><h3 class="cdt" style="margin-bottom:10px">📋 Top 5 商单</h3><div id="topL"></div></div>
</div></div>

<!-- DETAIL -->
<div class="pg" id="pd">
<div class="cd">
<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:16px">
<div><div class="dsb" id="dBdg"></div><h2 style="font-size:20px;font-weight:800;margin-top:8px" id="dBrnd"></h2><p style="font-size:13px;color:var(--ts)" id="dProd"></p></div>
<div style="display:flex;gap:8px"><button class="bo btn" onclick="editCD()">✏️ 编辑</button><button class="bd btn" onclick="delCD()">🗑️ 删除</button></div>
</div>
<div class="ppc" style="margin-bottom:18px" id="dPCd"></div>
<div class="dmg" id="dMg"></div>
<div style="margin-top:18px"><h3 style="font-size:14px;font-weight:700;margin-bottom:10px">📍 当前进度</h3><div class="stps" id="dStps"></div></div>
<div style="margin-top:18px"><h3 style="font-size:14px;font-weight:700;margin-bottom:10px">📝 备注</h3><div class="tl2" id="dTl"><div class="tli2"><div class="tld2 d"></div><div><div class="tlt2">暂无更多记录</div><div class="tlda">—</div></div></div></div>
</div>
</div>
<div style="margin-top:12px;text-align:center"><button class="bg btn" onclick="sw('orders')">← 返回列表</button></div>
</div>
</div></main></div>
<datalist id="bdl"></datalist>
<div class="mo" id="calMO"><div class="mbx"><div class="mhd"><h3 id="calMT">商单详情</h3><button class="mcl" onclick="clsCM()">×</button></div><div class="mbd" id="calMB"></div><div class="mft"><button class="bg btn" onclick="clsCM()">关闭</button><button class="ba btn" onclick="goDFromCal()">完整详情 →</button></div></div></div>
<div class="co2" id="coO"><div class="cbx"><h3>⚠️ 确认删除</h3><p id="coTx">确定要删除该商单吗？此操作不可恢复。</p><div class="cbtns"><button class="bg btn" onclick="clsCO()">取消</button><button class="bd btn" id="coOK">确认删除</button></div></div></div>
<div class="tc3" id="tc"></div>"""

JS = r"""
<script>
// DATA
const DB={get(k,d){try{return JSON.parse(localStorage.getItem(k))}catch(e){return d||null}},set(k,v){localStorage.setItem(k,JSON.stringify(v))},getOrders(){return this.get('xhs_orders',[])},saveOrders(o){this.set('xhs_orders',o)},getBrands(){return this.get('xhs_brands',[])},saveBrands(b){this.set('xhs_brands',b)}};
const SM={'-1':{n:'已取消',c:'td'},'0':{n:'待接单',c:'tp'},'1':{n:'已接单',c:'tr'},'2':{n:'制作中',c:'tv'},'3':{n:'待审核',c:'tm'},'4':{n:'已通过',c:'td'},'5':{n:'修改中',c:'tm'},'6':{n:'已发布',c:'td'},'7':{n:'已完成',c:'tpd'}};
const SO=['-1','0','1','2','3','4','5','6','7'];
const MON=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
function fm(n){if(!n&&n!==0)return'0';return Number(n).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function fY(v){return'\u00A5'+fm(v)}function rStr(p,c){if(!c)return'-';var r=Number(p)/Number(c)*100;return(isNaN(r)||!isFinite(r))?'-':r.toFixed(1)+'%'}
function ds(d){if(!d)return'';if(typeof d==='string')return d.length>=10?d:d.slice(0,10);return d.toISOString().slice(0,10)}
function today(){return new Date().toISOString().slice(0,10)}
function cP(o){var p=Number(o.price||0),pc=Number(o.promoteCost||0),lc=Number(o.laborCost||0),oc=Number(o.otherCost||0),tc=pc+lc+oc,pf=p-tc,r=tc>0?pf/p*100:100;return{price,promoteCost:pc,laborCost:lc,otherCost:oc,totalCost:tc,profit:pf,rate:isNaN(r)?0:r}}
function gid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,6)}
function esc(s){var e=document.createElement('div');e.textContent=s||'';return e.innerHTML}

var cci=null;
function toast(m,t){var c=document.getElementById('tc'),el=document.createElement('div');el.className='to2 '+(t||'');el.innerHTML=(t==='er'?'❌':t==='ok'?'✅':'ℹ ')+' '+m;c.appendChild(el);setTimeout(function(){el.style.opacity='0';el.style.transform='translateX(36px)';setTimeout(function(){el.remove()},260)},2400)}

// ROUTER
var cp='home';
function sw(p,nR){
document.querySelectorAll('.pg').forEach(function(x){x.classList.remove('on')});
document.querySelectorAll('.ni').forEach(function(x){x.classList.remove('on')});
var t=document.getElementById('p'+p[0].toUpperCase()+p.slice(1));if(t)t.classList.add('on');
var n=document.querySelector('.ni[data-page="'+p+'"]');if(n)n.classList.add('on');
var info=p==='home'?{title:'首页总览',desc:'快速录入·本月概览·近期排期'}:p==='calendar'?{title:'日历视图',desc:'按日期查看所有商单排期'}:p==='orders'?{title:'商单列表',desc:'管理所有商单记录'}:p==='add'?{title:'新建商单',desc:'填写商单信息并保存'}:p==='stats'?{title:'数据统计',desc:'利润分析·成本汇总·趋势图表'}:{title:'商单详情'};
document.getElementById('pgT').textContent=info.title;document.getElementById('pgD').textContent=info.desc;cp=p;
if(p==='home')renderHome();else if(p==='calendar')rendCal();else if(p==='orders')rendOL();else if(p==='stats')rendStats();else if(p==='add'&&!nR)resetF();
document.getElementById('sb').classList.remove('on');window.scrollTo(0,0);
}
function tog(){document.getElementById('sb').classList.toggle('on')}
// HOME
function renderHome(){
var os=DB.getOrders(),now=new Date(),y=now.getFullYear(),m=now.getMonth();
var mOs=os.filter(function(o){var sd=o.scheduleDate;if(!sd)return false;var d=new Date(sd);return d.getFullYear()===y&&d.getMonth()===m});
var tp=0,tc=0,cnt=mOs.length;
mOs.forEach(function(o){var r=cP(o);tp+=r.profit;tc+=r.totalCost});
var ar=cnt?tp/mOs.reduce(function(s,o){return s+Number(o.price||0)},0)*100:0;
document.getElementById('hs').innerHTML='<div class="sc"><div class="si r">💰</div><div class="sii"><div class="sil">'+MON[m]+'净利润</div><div class="siv" style="'+(tp>=0?'':'color:#E74C3C')+'">'+fY(tp)+'</div></div></div>'
+'<div class="sc"><div class="si b">📊</div><div class="sii"><div class="sil">'+MON[m]+'商单数</div><div class="siv">'+cnt+'<span class="u">单</span></div></div></div>'
+'<div class="sc"><div class="si g">📈</div><div class="sii"><div class="sil">平均利润率</div><div class="siv">'+(cnt?ar.toFixed(1):'-')+'<span class="u">%</span></div></div></div>'
+'<div class="sc"><div class="si o">💸</div><div class="sii"><div class="sil">总成本支出</div><div class="siv">'+fY(tc)+'</div></div></div>';
// upcoming
var up=os.filter(function(o){if(!o.scheduleDate||o.status==='-1'||o.status==='7')return false;var diff=(new Date(o.scheduleDate)-now)/86400000;return diff>=-1&&diff<=30}).sort(function(a,b){return new Date(a.scheduleDate)-new Date(b.scheduleDate)}).slice(0,6);
var sl=document.getElementById('schL');
if(!up.length)sl.innerHTML='<li class="emp"><div class="ei">📅</div><p>暂无近期排期</p></li>';else{sl.innerHTML='';up.forEach(function(o){var d=new Date(o.scheduleDate),st=SM[o.status]||SM['0'];var li=document.createElement('li');li.className='si2';li.onclick=function(){viewO(o.id)};li.innerHTML='<div class="sdt"><div class="sdd">'+d.getDate()+'</div><div class="sdm">'+(d.getMonth()+1)+'月</div></div><div class="si2i"><div class="si2b">'+esc(o.brand)+'</div><div class="si2p">'+esc(o.product)+' · '+st.n+'</div></div><div><span class="tg '+st.c+'">'+st.n+'</span></div>';sl.appendChild(li)})};
// recent
var rc=[].concat(os).sort(function(a,b){return new Date(b.createdAt||b.id)-new Date(a.createdAt||a.id)}).slice(0,5);
var rl=document.getElementById('rcL');
if(!rc.length)rl.innerHTML='<li class="emp"><div class="ei">📋</div><p>还没有商单，快去创建第一个吧！</p></li>';else{rl.html