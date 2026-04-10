// pages/brands/list/index.js
const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: { brands: [], filtered: [], keyword: '' },

  onShow() { this.loadBrands() },

  loadBrands() {
    const orders = storage.getOrders()
    const brands = storage.getBrands().map(b => {
      const brandOrders = orders.filter(o => o.brandId === b.id || o.brandName === b.name)
      const totalRevenue = brandOrders.filter(o=>o.progress!=='abnormal').reduce((s,o)=>s+(parseFloat(o.price)||0),0)
      return { ...b, orderCount:brandOrders.length, totalRevenueText:util.formatMoney(totalRevenue), initial:(b.name||'').charAt(0) }
    })
    this.setData({ brands }); this.applyFilter()
  },

  onSearchInput(e) { this.setData({keyword:e.detail.value}); this.applyFilter() },

  applyFilter() {
    const { brands, keyword } = this.data
    if (!keyword.trim()) { this.setData({filtered:brands}); return }
    const kw=keyword.toLowerCase()
    this.setData({
      filtered: brands.filter(b =>
        b.name.toLowerCase().includes(kw) || (b.industry||'').toLowerCase().includes(kw) ||
        (b.contactName||'').toLowerCase().includes(kw)
      )
    })
  },

  goToDetail(e) { wx.navigateTo({ url:`/pages/brands/detail/index?id=${e.currentTarget.dataset.id}`}) },
  goToAdd()   { wx.navigateTo({ url:'/pages/brands/detail/index'}) },

  // 导出为CSV（可Excel打开）
  exportToExcel() {
    wx.showLoading({ title:'导出中...' })
    
    const brands = storage.getBrands()
    let csv = '\uFEFF'
    // 表头
    csv += '品牌名称,所属行业,联系人,职位,微信号,手机号,邮箱,返点政策,合作备注\n'
    
    brands.forEach(b => {
      const esc = s => `"${(s||'-').toString().replace(/"/g,'""')}"` 
      csv += [
        esc(b.name), esc(b.industry), esc(b.contactName), esc(b.contactTitle),
        esc(b.contactWx), esc(b.contactPhone), esc(b.contactEmail),
        esc(b.rebatePolicy), esc(b.notes)
      ].join(',') + '\n'
    })

    const filePath = `${wx.env.USER_DATA_PATH}/brand_contacts.csv`
    const fs = wx.getFileSystemManager()
    
    try {
      fs.writeFileSync(filePath, csv, 'utf8')
      wx.hideLoading()
      
      wx.showModal({
        title: '导出成功',
        content: `已导出 ${brands.length} 条品牌联系人数据`,
        confirmText: '分享文件',
        success: (res) => {
          if (res.confirm) {
            wx.shareFileMessage({
              filePath,
              fileName: '商单品牌联系方式.csv',
              fail: () => {
                // 如果不支持shareFileMessage，用setClipboardData
                wx.setClipboardData({ data: filePath })
              }
            })
          }
        }
      })
    } catch (e) {
      wx.hideLoading()
      wx.showToast({ title: '导出失败：'+e.message, icon:'none', duration:3000 })
    }
  }
})
