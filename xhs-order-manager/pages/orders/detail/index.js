// pages/orders/detail/index.js
const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: { order: null, profit: null, progressInfo: null, progressList: [], progressIdx: 0 },

  onLoad(options) {
    this.orderId = options.id
    this.progressList = util.PROGRESS_STATUS
  },

  onShow() { this.loadOrder() },

  loadOrder() {
    const order = storage.getOrderById(this.orderId)
    if (!order) {
      wx.showToast({ title: '商单不存在', icon:'none' })
      setTimeout(() => wx.navigateBack(), 1000); return
    }
    
    const profit = util.calcProfit(order)
    const progressInfo = util.getProgressInfo(order.progress)
    const pIdx = this.progressList.findIndex(s => s.value === (order.progress || 'scheduled'))
    
    // 计算线下返点金额 = 报价 * 线下返点%
    const offlineRebateDeduction = (parseFloat(order.price) || 0) * (parseFloat(order.offlineRebateRate) || 0) / 100
    // 新字段文本
    const contentTypeInfo = util.getContentTypeInfo(order.contentType)
    const competitionInfo = util.getCompetitionRangeInfo(order.competitionRange)

    this.setData({
      order: {
        ...order,
        brandInitial: (order.brandName||'').charAt(0),
        offlineRebateDeduction: Math.round(offlineRebateDeduction * 10) / 10,
        contentTypeText: contentTypeInfo ? contentTypeInfo.label : '',
        competitionText: competitionInfo ? competitionInfo.label : ''
      },
      profit,
      progressInfo,
      progressIdx: pIdx >= 0 ? pIdx : 0,
      progressList: this.progressList
    })
  },

  onProgressChange(e) {
    const idx = e.detail.value
    const newStatus = this.progressList[idx].value
    const updated = { ...this.data.order, progress: newStatus, updateTime: util.today() }
    storage.saveOrder(updated)
    this.setData({
      progressIdx: idx,
      order: updated,
      progressInfo: this.progressList[idx],
      profit: util.calcProfit(updated)
    })
    wx.showToast({ title: '状态已更新', icon: 'success' })
  },

  editOrder() {
    wx.navigateTo({ url: `/pages/orders/add/index?id=${this.orderId}` })
  },

  deleteOrder() {
    wx.showModal({
      title: '确认删除', content: '确定删除该商单吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteOrder(this.orderId)
          wx.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 800)
        }
      }
    })
  },

  copyText(e) {
    const { text } = e.currentTarget.dataset
    wx.setClipboardData({ data: text, success: () => wx.showToast({ title:'已复制', icon:'success' }) })
  },
  callPhone(e) {
    wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone })
  }
})
