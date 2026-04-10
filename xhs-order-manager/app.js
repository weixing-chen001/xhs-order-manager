// app.js
App({
  onLaunch() {
    // 初始化数据
    this.initData()
  },

  initData() {
    // 初始化商单数据
    if (!wx.getStorageSync('orders')) {
      wx.setStorageSync('orders', [])
    }
    // 初始化品牌数据
    if (!wx.getStorageSync('brands')) {
      wx.setStorageSync('brands', [])
    }
    // 初始化返点数据
    if (!wx.getStorageSync('rebates')) {
      wx.setStorageSync('rebates', [])
    }
    // 初始化报价模板
    if (!wx.getStorageSync('quoteTemplates')) {
      wx.setStorageSync('quoteTemplates', [
        { id: 1, name: '图文笔记', basePrice: 3000, desc: '图文种草笔记' },
        { id: 2, name: '视频笔记', basePrice: 8000, desc: '短视频种草' },
        { id: 3, name: '直播带货', basePrice: 15000, desc: '直播间推广' }
      ])
    }
  },

  globalData: {
    userInfo: null
  }
})
