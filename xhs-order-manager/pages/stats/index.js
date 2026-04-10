// pages/stats/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    period: 'month',
    stats: {},
    orderList: [],
    monthlyData: [],
    topBrands: [],
    progressDist: []
  },

  onShow() { this.loadStats() },

  onPeriodChange(e) {
    this.setData({ period: e.currentTarget.dataset.value })
    this.loadStats()
  },

  loadStats() {
    const orders = storage.getOrders()
    const { period } = this.data
    const now = new Date()

    // 时间过滤
    const filtered = orders.filter(o => {
      if (!o.createTime) return false
      const d = new Date(o.createTime)
      if (period === 'month') return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth()
      if (period === 'quarter') { const q=Math.floor(now.getMonth()/3); return d.getFullYear()===now.getFullYear() && Math.floor(d.getMonth()/3)===q }
      if (period === 'year') return d.getFullYear()===now.getFullYear()
      return true
    })

    // 有效商单（非异常状态均计入）
    const validOrders = filtered.filter(o => o.progress !== 'abnormal')
    // 异常商单
    const abnormalOrders = filtered.filter(o => o.progress === 'abnormal')

    // 利润汇总
    let totalAfterRebate = 0, totalNet = 0, totalTax = 0, totalRevenue = 0
    let totalPotatoCost = 0, totalLaborCost = 0
    let profitRateSum = 0, priceForRateCount = 0
    validOrders.forEach(o => {
      const p = util.calcProfit(o)
      const priceVal = parseFloat(o.price) || 0
      totalAfterRebate += p.afterRebateProfit
      totalNet += p.netProfit
      totalTax += p.taxEstimate
      totalRevenue += priceVal
      // 成本汇总
      totalPotatoCost += parseFloat(o.potatoCost) || 0
      totalLaborCost += parseFloat(o.laborCost) || 0
      // 利润率汇总（只统计报价>0的）
      if (priceVal > 0 && p.profitRate !== undefined) {
        profitRateSum += p.profitRate
        priceForRateCount++
      }
    })

    // 商单列表（含利润明细）
    const orderList = filtered.map(o => ({
      ...o,
      profit: util.calcProfit(o),
      progressInfo: util.getProgressInfo(o.progress),
      isValidForProfit: util.isValidForProfit(o),
      contentTypeText: (util.getContentTypeInfo(o.contentType) || {}).label || '',
      competitionText: (util.getCompetitionRangeInfo(o.competitionRange) || {}).label || ''
    })).sort((a,b) => new Date(b.scheduleDate||b.createTime) - new Date(a.scheduleDate||a.createTime))

    // 进度状态分布
    const progCount = {}
    filtered.forEach(o => { progCount[o.progress] = (progCount[o.progress] || 0) + 1 })
    const progressDist = Object.entries(progCount).map(([k,v]) => ({ ...util.getProgressInfo(k), count: v }))

    // 品牌排行（按净利润）
    const brandMap = {}
    validOrders.forEach(o => {
      const n = o.brandName || '未知'
      if (!brandMap[n]) brandMap[n] = { name:n, netProfit:0, count:0 }
      brandMap[n].netProfit += util.calcProfit(o).netProfit
      brandMap[n].count++
    })
    const topBrands = Object.values(brandMap).sort((a,b)=>b.netProfit-a.netProfit).slice(0,5)

    // 近6个月趋势
    const monthlyData = []
    for(let i=5;i>=0;i--){
      const d=new Date(now.getFullYear(), now.getMonth()-i, 1)
      const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
      const mo=orders.filter(o=>(o.createTime||'').startsWith(key)&&o.progress!=='abnormal')
      let moNet=0; mo.forEach(o=>{moNet+=util.calcProfit(o).netProfit})
      monthlyData.push({ month:`${d.getMonth()+1}月`, count:mo.length, revenueText:util.formatMoney(mo.reduce((s,o)=>s+(parseFloat(o.price)||0),0)), netProfit:Math.round(moNet), netProfitText:util.formatMoney(moNet) })
    }

    this.setData({
      stats: {
        totalCount: validOrders.length,
        abnormalCount: abnormalOrders.length,
        totalNet: Math.round(totalNet),
        totalTax: Math.round(totalTax * 100) / 100,
        totalPotatoCost: Math.round(totalPotatoCost * 100) / 100,
        totalLaborCost: Math.round(totalLaborCost * 100) / 100,
        avgProfitRate: priceForRateCount > 0 ? Math.round(profitRateSum / priceForRateCount * 100) / 100 : 0
      },
      orderList,
      monthlyData,
      topBrands,
      progressDist
    })
  },

  goToDetail(e) {
    wx.navigateTo({ url:`/pages/orders/detail/index?id=${e.currentTarget.dataset.id}`})
  }
})
