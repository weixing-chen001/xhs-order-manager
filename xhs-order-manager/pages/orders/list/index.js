// pages/orders/list/index.js
const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: {
    orders: [], filteredOrders: [],
    keyword: '', progressFilter: '',
    progressOptions: [{value:'', label:'全部'}, ...util.PROGRESS_STATUS.map(s=>({value:s.value,label:s.label}))]
  },

  onShow() { this.loadOrders() },

  loadOrders() {
    const orders = storage.getOrders().map(o => ({
      ...o,
      profit: util.calcProfit(o),
      progressInfo: util.getProgressInfo(o.progress),
      contentTypeText: (util.getContentTypeInfo(o.contentType) || {}).label || '',
      competitionText: (util.getCompetitionRangeInfo(o.competitionRange) || {}).label || ''
    })).sort((a,b) => new Date(b.createTime||0) - new Date(a.createTime||0))
    this.setData({ orders }); this.applyFilter()
  },

  onSearchInput(e) { this.setData({keyword:e.detail.value}); this.applyFilter() },
  onProgressFilter(e) { this.setData({progressFilter:e.currentTarget.dataset.value}); this.applyFilter() },

  applyFilter() {
    let list = [...this.data.orders]
    const kw = (this.data.keyword||'').trim().toLowerCase()
    if (kw) list = list.filter(o =>
      (o.brandName||'').toLowerCase().includes(kw) ||
      (o.productName||'').toLowerCase().includes(kw) ||
      (o.progressInfo.label||'').includes(this.data.keyword)
    )
    if (this.data.progressFilter) list = list.filter(o => o.progress === this.data.progressFilter)
    this.setData({ filteredOrders: list })
  },

  goToAdd() { wx.navigateTo({ url:'/pages/orders/add/index' }) },
  goToDetail(e) { wx.navigateTo({ url:`/pages/orders/detail/index?id=${e.currentTarget.dataset.id}`}) }
})
