// pages/orders/add/index.js
const storage = require('../../../utils/storage')
const util = require('../../../utils/util')

Page({
  data: {
    isEdit: false, orderId: null,
    form: {
      brandName: '', productName: '',
      scheduleDate: '', outlineDate: '', draftDate: '',
      price: '', onlineRebateRate: '', offlineRebateRate: '',
      potatoCost: '', laborCost: '',
      progress: 'scheduled', notes: ''
    },
    profitPreview: null,
    progressList: util.PROGRESS_STATUS,
    contentTypes: util.CONTENT_TYPES,
    competitionRanges: util.COMPETITION_RANGES,
    progressIdx: 0,
    contentTypeIdx: 0,
    competitionIdx: -1,
    brands: [], brandNames: [],
    _originalOrder: null  // 保留原始订单完整数据
  },

  onLoad(options) {
    const brands = storage.getBrands()
    this.setData({ brands, brandNames: brands.map(b => b.name) })
    
    if (options.id) {
      // ===== 编辑模式 =====
      const order = storage.getOrderById(options.id)
      if (order) {
        // 保存原始订单完整数据，用于合并更新
        this._originalOrder = { ...order }
        const pIdx = this.data.progressList.findIndex(s => s.value === (order.progress || 'scheduled'))
        this.setData({
          isEdit: true,
          orderId: options.id,  // 明确记录原始ID
          form: {
            brandName: order.brandName || '',
            productName: order.productName || '',
            scheduleDate: order.scheduleDate || '',
            outlineDate: order.outlineDate || '',
            draftDate: order.draftDate || '',
            price: String(order.price || ''),
            onlineRebateRate: String(order.onlineRebateRate || ''),
            offlineRebateRate: String(order.offlineRebateRate || ''),
            potatoCost: String(order.potatoCost || ''),
            laborCost: String(order.laborCost || ''),
            progress: order.progress || 'scheduled',
            contentType: order.contentType || 'single',
            competitionRange: order.competitionRange || '',
            notes: order.notes || ''
          },
          progressIdx: pIdx >= 0 ? pIdx : 0,
          contentTypeIdx: this.data.contentTypes.findIndex(c => c.value === (order.contentType || 'single')),
          competitionIdx: this.data.competitionRanges.findIndex(r => r.value === (order.competitionRange || ''))
        })
        console.log('[EDIT MODE] orderId:', options.id, 'original order loaded')
      } else {
        console.warn('[EDIT WARN] order not found for id:', options.id)
      }
    } else if (options.date) {
      // 从日历带过来的日期（新建模式）
      this.setData({ 'form.scheduleDate': options.date })
    }
  },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value }, () => { this.calcPreview() })
  },

  calcPreview() {
    const f = this.data.form
    const price = parseFloat(f.price) || 0
    if (price <= 0) {
      this.setData({ profitPreview: null }); return
    }
    const onlineRate = parseFloat(f.onlineRebateRate) || 0
    const offlineRate = parseFloat(f.offlineRebateRate) || 0
    const potatoCost = parseFloat(f.potatoCost) || 0

    // 去返点利润 = price - (price * onlineRate%) - (price * offlineRate%)
    const onlineRebateAmt = price * (onlineRate / 100)
    const offlineRebateAmt = price * (offlineRate / 100)
    const afterRebate = Math.round((price - onlineRebateAmt - offlineRebateAmt))
    const tax = ((afterRebate - potatoCost) * 0.01).toFixed(1)

    this.setData({
      profitPreview: {
        afterRebate,
        tax: tax >= 0 ? tax : '0.0'
      }
    })
  },

  onScheduleDateChange(e) { this.setData({ 'form.scheduleDate': e.detail.value }) },
  onOutlineDateChange(e) { this.setData({ 'form.outlineDate': e.detail.value }) },
  onDraftDateChange(e)   { this.setData({ 'form.draftDate': e.detail.value }) },
  
  onProgressChange(e) {
    const idx = e.detail.value
    this.setData({
      progressIdx: idx,
      'form.progress': this.data.progressList[idx].value
    })
  },

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

  onBrandChange(e) {
    const idx = e.detail.value
    if (this.data.brands[idx]) {
      this.setData({ 'form.brandName': this.data.brands[idx].name })
    }
  },

  validate() {
    const f = this.data.form
    if (!f.brandName.trim()) { wx.showToast({ title: '请填写品牌名', icon: 'none' }); return false; }
    if (!f.price || isNaN(parseFloat(f.price))) { wx.showToast({ title: '请填写报价', icon: 'none' }); return false; }
    return true
  },

  submit() {
    if (!this.validate()) return
    const f = this.data.form

    if (this.data.isEdit) {
      // ===== 编辑模式：在原始订单上合并更新，确保ID不变 =====
      if (!this._originalOrder || !this.data.orderId) {
        wx.showToast({ title: '编辑异常，请重试', icon: 'none' })
        console.error('[EDIT ERROR] missing originalOrder or orderId')
        return
      }

      const updated = {
        ...this._originalOrder,  // 保留所有原始字段（id/createTime/brandId等）
        brandName: f.brandName.trim(),
        productName: f.productName.trim(),
        scheduleDate: f.scheduleDate,
        outlineDate: f.outlineDate,
        draftDate: f.draftDate,
        price: parseFloat(f.price) || 0,
        onlineRebateRate: parseFloat(f.onlineRebateRate) || 0,
        offlineRebateRate: parseFloat(f.offlineRebateRate) || 0,
        potatoCost: parseFloat(f.potatoCost) || 0,
        laborCost: parseFloat(f.laborCost) || 0,
        progress: f.progress,
        contentType: f.contentType,
        competitionRange: f.competitionRange,
        notes: f.notes.trim(),
        updateTime: util.today()
        // id / createTime / brandId 从 _originalOrder 继承
      }

      console.log('[UPDATE] saving order with id:', updated.id)
      storage.saveOrder(updated)
      wx.showToast({ title: '已更新', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 800)

    } else {
      // ===== 新建模式 =====
      const order = {
        ...f,
        id: storage.genId(),
        price: parseFloat(f.price) || 0,
        onlineRebateRate: parseFloat(f.onlineRebateRate) || 0,
        offlineRebateRate: parseFloat(f.offlineRebateRate) || 0,
        potatoCost: parseFloat(f.potatoCost) || 0,
        laborCost: parseFloat(f.laborCost) || 0,
        contentType: f.contentType,
        competitionRange: f.competitionRange,
        createTime: util.today(),
        updateTime: util.today()
      }

      console.log('[CREATE] new order with id:', order.id)
      storage.saveOrder(order)
      wx.showToast({ title: '已保存', icon: 'success' })
      setTimeout(() => { wx.navigateBack({ delta: this.data.isFromHome ? 2 : 1 }) }, 800)
    }
  }
})
