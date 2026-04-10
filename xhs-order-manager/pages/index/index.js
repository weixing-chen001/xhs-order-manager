// pages/index/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    // 快速录入表单
    form: {
      brandName: '',
      productName: '',
      scheduleDate: '',
      outlineDate: '',
      draftDate: '',
      price: '',
      onlineRebateRate: '',
      offlineRebateRate: '',
      contentType: 'single',
      competitionRange: ''
    },
    // 选项列表
    contentTypes: util.CONTENT_TYPES,
    competitionRanges: util.COMPETITION_RANGES,
    contentTypeIdx: 0,
    competitionIdx: -1,
    // 本月概览
    monthProfit: 0,
    monthOrderCount: 0,
    abnormalCount: 0,
    // 最近商单
    recentOrders: [],
    // 近期截稿
    upcomingOrders: []
  },

  onShow() {
    this.loadData()
    this.resetForm()
  },

  loadData() {
    const orders = storage.getOrders()
    const curMonth = util.currentMonth()
    
    // 本月有效商单（非异常状态均计入）
    const validOrders = orders.filter(o => 
      (o.createTime || '').startsWith(curMonth) && 
      o.progress !== 'abnormal'
    )
    // 异常商单
    const abnormalOrders = orders.filter(o =>
      (o.createTime || '').startsWith(curMonth) &&
      o.progress === 'abnormal'
    )
    
    // 计算本月预期利润
    let totalNet = 0
    validOrders.forEach(o => {
      totalNet += util.calcProfit(o).netProfit
    })

    // 最近商单
    const recentOrders = orders.slice(0, 5).map(o => ({
      ...o,
      profit: util.calcProfit(o),
      progressInfo: util.getProgressInfo(o.progress)
    }))

    // 即将到期（7天内）
    const nowTs = Date.now()
    const upcoming = orders
      .filter(o => {
        if (!o.scheduleDate) return false
        if (o.progress === 'published' || o.progress === 'abnormal') return false
        const ts = new Date(o.scheduleDate).getTime()
        return ts > nowTs && ts - nowTs < 7 * 24 * 3600 * 1000
      })
      .sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate))
      .slice(0, 3)
      .map(o => ({ ...o, daysLeft: Math.ceil((new Date(o.scheduleDate) - nowTs) / (24*3600*1000)) }))

    this.setData({
      monthProfit: Math.round(totalNet),
      monthOrderCount: validOrders.length,
      abnormalCount: abnormalOrders.length,
      recentOrders,
      upcomingOrders: upcoming
    })
  },

  resetForm() {
    this.setData({
      form: {
        brandName: '', productName: '', scheduleDate: '',
        outlineDate: '', draftDate: '', price: '',
        onlineRebateRate: '', offlineRebateRate: '',
        contentType: 'single', competitionRange: ''
      },
      contentTypeIdx: 0,
      competitionIdx: -1
    })
  },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  onScheduleDateChange(e) { this.setData({ 'form.scheduleDate': e.detail.value }) },
  onOutlineDateChange(e) { this.setData({ 'form.outlineDate': e.detail.value }) },
  onDraftDateChange(e)   { this.setData({ 'form.draftDate': e.detail.value }) },

  onContentTypeChange(e) {
    const idx = e.detail.value
    this.setData({
      contentTypeIdx: idx,
      'form.contentType': this.data.contentTypes[idx].value
    })
  },

  onCompetitionChange(e) {
    const idx = e.detail.value
    if (this.data.competitionRanges[idx]) {
      this.setData({
        competitionIdx: idx,
        'form.competitionRange': this.data.competitionRanges[idx].value
      })
    }
  },

  submitQuick() {
    const f = this.data.form
    if (!f.brandName.trim()) {
      wx.showToast({ title: '请填写品牌名', icon: 'none' }); return
    }
    if (!f.price || isNaN(parseFloat(f.price))) {
      wx.showToast({ title: '请填写当月报价', icon: 'none' }); return
    }

    const order = {
      id: storage.genId(),
      brandName: f.brandName.trim(),
      productName: f.productName.trim(),
      scheduleDate: f.scheduleDate,
      outlineDate: f.outlineDate,
      draftDate: f.draftDate,
      price: parseFloat(f.price) || 0,
      onlineRebateRate: parseFloat(f.onlineRebateRate) || 0,
      offlineRebateRate: parseFloat(f.offlineRebateRate) || 0,
      potatoCost: 0,
      laborCost: 0,
      progress: 'scheduled',
      contentType: f.contentType,
      competitionRange: f.competitionRange,
      notes: '',
      createTime: util.today(),
      updateTime: util.today()
    }
    storage.saveOrder(order)
    wx.showToast({ title: '已创建', icon: 'success' })
    this.resetForm()
    this.loadData()
  },

  goToCalendar() { wx.switchTab({ url: '/pages/calendar/index' }) },
  goToStats()    { wx.switchTab({ url: '/pages/stats/index' }) },
  goToAddFull()  { wx.navigateTo({ url: '/pages/orders/add/index' }) },
  goToDetail(e)  {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/orders/detail/index?id=${id}` })
  }
})
