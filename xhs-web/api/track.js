/**
 * /api/track — 数据采集接收端点 (Vercel Serverless Function)
 * 
 * 接收客户端 Tracker 模块上报的匿名行为数据
 * 存入 Vercel KV 或返回成功（纯日志模式）
 * 
 * 前期模式：仅记录到 Vercel 日志（免费、无需数据库）
 * 后期可切换：接入 Supabase/云开发 做持久存储
 */

export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const events = body && body.events;

    // 校验基本格式
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Invalid payload: events array required' });
    }

    // 过滤和清洗事件数据
    const cleaned = events.map(e => ({
      e: (e.e || 'unknown').substring(0, 50),    // 事件名（截断防注入）
      t: typeof e.t === 'number' ? e.t : Date.now(), // 时间戳
      p: typeof e.p === 'string' ? e.p.substring(0, 200) : '/', // 页面路径
      d: sanitizeData(e.d)                       // 附加数据
    }));

    // ===== 当前阶段：写入 Vercel 实时日志 =====
    // 在 Vercel Dashboard → Deployments → Functions → /api/track 可查看
    // 免费保留 24 小时，足够调试和初期使用
    console.log(`[TRACK] 📊 Received ${cleaned.length} events:`);
    
    // 统计摘要
    const summary = {};
    cleaned.forEach(ev => {
      summary[ev.e] = (summary[ev.e] || 0) + 1;
    });
    console.log('[TRACK] Event breakdown:', JSON.stringify(summary));
    
    // 打印前3条详情（不全量打印避免日志爆炸）
    cleaned.slice(0, 3).forEach((ev, i) => {
      console.log(`[TRACK]   [${i}] ${ev.e} | page=${ev.p} | data=${JSON.stringify(ev.d).substring(0,150)}`);
    });

    // ===== 后期升级：取消注释以下代码接入数据库 =====
    /*
    // 方案1：Vercel Postgres (KV)
    // const { createClient } = require('@vercel/postgres');
    // const sql = createClient(process.env.POSTGRES_URL);
    // await sql`INSERT INTO track_events (event_type, event_time, page_path, event_data) 
    //          VALUES ${cleaned.map(e => [e.e, new Date(e.t), e.p, JSON.stringify(e.d)])}`;
    
    // 方案2：Supabase
    // const { createClient } = require('@supabase/supabase-js');
    // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    // await supabase.from('track_events').insert(cleaned.map(e => ({
    //   event_type: e.event,
    //   event_time: new Date(e.timestamp),
    //   page_path: e.page,
    //   event_data: e.data,
    //   created_at: new Date().toISOString()
    // })));
    */

    // 返回成功响应
    return res.status(200).json({
      ok: true,
      received: cleaned.length,
      ts: Date.now()
    });

  } catch (err) {
    // 静默失败——不因为数据采集问题影响用户体验
    console.error('[TRACK] Error:', err.message);
    return res.status(200).json({
      ok: true,
      received: 0,
      note: 'logged with error'
    });
  }
}

/**
 * 数据清洗：移除可能的敏感字段，限制字段长度
 */
function sanitizeData(d) {
  if (!d || typeof d !== 'object') return {};
  
  const safe = {};
  const MAX_LEN = 100;
  
  for (const [k, v] of Object.entries(d)) {
    const key = String(k).substring(0, 30);
    if (typeof v === 'string') {
      safe[key] = v.substring(0, MAX_LEN);
    } else if (typeof v === 'number') {
      safe[key] = v;
    } else if (typeof v === 'boolean') {
      safe[key] = v;
    } else if (Array.isArray(v)) {
      safe[key] = v.slice(0, 10); // 数组最多10个元素
    } else {
      safe[key] = String(v).substring(0, MAX_LEN);
    }
  }
  
  return safe;
}
