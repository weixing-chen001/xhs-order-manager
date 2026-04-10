// pages/brands/detail/index.js
const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: {
    isEdit: false,
    brandId: null,
    form: {
      name: '',
      industry: '',
      website: '',
      notes: '',
      contactName: '',
      contactTitle: '',
      contactWx: '',
      contactPhone: '',
      contactEmail: '',
      rebatePolicy: '',
      defaultRebateRate: '',
      cooperationHistory: ''
    },
    industries: ['美妆护肤', '食品饮料', '服装配饰', '母婴用品', '电子数码', '家居家装', '运动健康', '宠物用品', '出行旅游', '教育培训', '其他'],
    industryIdx: 0,
    relatedOrders: []
  },

  onLoad(options) {
    if (options.id) {
      const brand = storage.getBrandById(options.id)
      if (brand) {
        const industryIdx = this.data.industries.indexOf(brand.industry)
        this.setData({
          isEdit: true,
          brandId: options.id,
          form: { ...this.data.form, ...brand },
          industryIdx: industryIdx >= 0 ? industryIdx : 0
        })
        wx.setNavigationBarTitle({ title: brand.name })
        this.loadRelatedOrders(brand.name, options.id)
      }
    }
  },

  loadRelatedOrders(brandName, brandId) {
    const orders = storage.getOrders()
      .filter(o => o.brandId === brandId || o.brandName === brandName)
      .map(o => ({
        ...o,
        statusInfo: util.getStatusInfo(o.status),
        priceText: util.formatMoney(o.price)
      }))
    this.setData({ relatedOrders: orders })
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  onIndustryChange(e) {
    const idx = e.detail.value
    this.setData({ industryIdx: idx, 'form.industry': this.data.industries[idx] })
  },

  validate() {
    if (!this.data.form.name.trim()) {
      wx.showToast({ title: '请填写品牌名称', icon: 'none' })
      return false
    }
    return true
  },

  save() {
    if (!this.validate()) return
    const { form, isEdit, brandId } = this.data
    const brand = {
      ...form,
      id: isEdit ? brandId : storage.genId(),
      updateTime: util.today()
    }
    storage.saveBrand(brand)
    wx.showToast({ title: isEdit ? '已更新' : '品牌已保存', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
  },

  copyText(e) {
    const { text } = e.currentTarget.dataset
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: '已复制', icon: 'success' })
    })
  },

  callPhone() {
    if (this.data.form.contactPhone) {
      wx.makePhoneCall({ phoneNumber: this.data.form.contactPhone })
    }
  },

  goToOrder(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/orders/detail/index?id=${id}` })
  },

  deleteBrand() {
    wx.showModal({
      title: '确认删除',
      content: '确定删除该品牌吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteBrand(this.data.brandId)
          wx.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 800)
        }
      }
    })
  }
})
