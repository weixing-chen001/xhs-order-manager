// utils/util.js - 通用工具函数

// ===== 格式化 =====
function formatMoney(num) {
  if (!num && num !== 0) return '-'
  const n = parseFloat(num)
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return n.toLocaleString('zh-CN')
}

function formatDate(dateStr, fmt = 'MM-DD') {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const map = {
    'YYYY': d.getFullYear(),
    'MM': String(d.getMonth() + 1).padStart(2, '0'),
    'DD': String(d.getDate()).padStart(2, '0'),
    'HH': String(d.getHours()).padStart(2, '0'),
    'mm': String(d.getMinutes()).padStart(2, '0')
  }
  return fmt.replace(/YYYY|MM|DD|HH|mm/g, k => map[k])
}

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}

// ===== 商单进度状态配置（9种）=====
const PROGRESS_STATUS = [
  { value: 'scheduled',        label: '已定档',   shortLabel: '定档',   cls: 'prog-scheduled',   icon: '📅', step: 0 },
  { value: 'sent',             label: '已寄品',   shortLabel: '寄品',   cls: 'prog-sent',       icon: '📦', step: 1 },
  { value: 'content_confirmed', label: '已确定内容形式', shortLabel: '内容',   cls: 'prog-content', icon: '📝', step: 2 },
  { value: 'product_arrived',  label: '产品已到', shortLabel: '到货',   cls: 'prog-product',    icon: '📥', step: 3 },
  { value: 'shot',             label: '产品已拍摄',shortLabel: '拍摄',   cls: 'prog-shot',       icon: '🎬', step: 4 },
  { value: 'draft',            label: '已出初稿',  shortLabel: '初稿',   cls: 'prog-draft',      icon: '📄', step: 5 },
  { value: 'finalized',        label: '已定稿',    shortLabel: '定稿',   cls: 'prog-finalized',   icon: '✅', step: 6 },
  { value: 'published',        label: '已发布',    shortLabel: '发布',   cls: 'prog-published',   icon: '🚀', step: 7 },
  { value: 'abnormal',         label: '异常',      shortLabel: '异常',   cls: 'prog-abnormal',    icon: '⚠️', step: -1 }
]

// ===== 内容形式配置 =====
const CONTENT_TYPES = [
  { value: 'single',     label: '单品单推' },
  { value: 'comparison', label: '横测' }
]

// ===== 排竞管理配置 =====
const COMPETITION_RANGES = [
  { value: '7d',  label: '前后 7 天' },
  { value: '15d', label: '前后 15 天' }
]

function getProgressInfo(status) {
  return PROGRESS_STATUS.find(s => s.value === status) || PROGRESS_STATUS[0]
}

function getContentTypeInfo(value) {
  return CONTENT_TYPES.find(c => c.value === value) || CONTENT_TYPES[0]
}

function getCompetitionRangeInfo(value) {
  return COMPETITION_RANGES.find(r => r.value === value) || null
}

// 判断是否为有效商单（可计入利润）
function isValidForProfit(order) {
  // 除异常外，所有状态都计入利润
  return order.progress !== 'abnormal'
}

// ===== 利润计算 =====
function calcProfit(order) {
  const price = parseFloat(order.price) || 0          // 当月报价
  const onlineRate = parseFloat(order.onlineRebateRate) || 0  // 线上返点%
  const offlineRate = parseFloat(order.offlineRebateRate) || 0 // 线下返点%
  const potatoCost = parseFloat(order.potatoCost) || 0  // 薯条成本
  const laborCost = parseFloat(order.laborCost) || 0     // 女工成本

  // 线上返点金额
  const onlineRebateAmount = price * (onlineRate / 100)
  // 去返点利润 = 当月报价 - (当月报价 * 线上返点%) - (当月报价 * 线下返点%)
  const offlineRebateAmount = price * (offlineRate / 100)  // 线下返点金额
  const afterRebateProfit = price - onlineRebateAmount - offlineRebateAmount
  // 净利润（去返点 & 扣运营成本）
  const netProfit = afterRebateProfit - potatoCost - laborCost
  // 税点预估 = (去返点利润 - 薯条成本) * 1%
  const taxEstimate = Math.max(0, (afterRebateProfit - potatoCost)) * 0.01

  return {
    onlineRebateAmount: Math.round(onlineRebateAmount * 100) / 100,
    afterRebateProfit: Math.round(afterRebateProfit * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    taxEstimate: Math.round(taxEstimate * 100) / 100,
    profitRate: price > 0 ? Math.round((netProfit / price) * 10000) / 100 : 0
  }
}

module.exports = {
  formatMoney,
  formatDate,
  today,
  currentMonth,
  PROGRESS_STATUS,
  CONTENT_TYPES,
  COMPETITION_RANGES,
  getProgressInfo,
  getContentTypeInfo,
  getCompetitionRangeInfo,
  isValidForProfit,
  calcProfit
}
