// pages/quote/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    // 报价计算器
    basePrice: '',
    followers: '',
    engagementRate: '',
    contentType: '图文笔记',
    contentTypes: ['图文笔记', '视频笔记', '直播带货', '测评种草'],
    contentTypeIdx: 0,
    contentMultiplier: { '图文笔记': 1, '视频笔记': 2.5, '直播带货': 5, '测评种草': 1.5 },
    calcResult: null,

    // 报价模板
    templates: [],
    showAddTemplate: false,
    newTemplate: { name: '', basePrice: '', desc: '' }
  },

  onLoad() {
    this.loadTemplates()
  },

  onShow() {
    this.loadTemplates()
  },

  loadTemplates() {
    const templates = storage.getQuoteTemplates()
    this.setData({ templates })
  },

  onBasePriceInput(e) {
    this.setData({ basePrice: e.detail.value })
    this.calculate()
  },

  onFollowersInput(e) {
    this.setData({ followers: e.detail.value })
    this.calculate()
  },

  onEngagementInput(e) {
    this.setData({ engagementRate: e.detail.value })
    this.calculate()
  },

  onContentTypeChange(e) {
    const idx = e.detail.value
    this.setData({
      contentTypeIdx: idx,
      contentType: this.data.contentTypes[idx]
    })
    this.calculate()
  },

  calculate() {
    const { basePrice, followers, engagementRate, contentType, contentMultiplier } = this.data
    const base = parseFloat(basePrice)
    if (!base) {
      this.setData({ calcResult: null })
      return
    }

    const mult = contentMultiplier[contentType] || 1
    const follow = parseFloat(followers) || 0
    const eng = parseFloat(engagementRate) || 0

    // 计算逻辑：基础报价 × 内容类型系数 × 粉丝加成 × 互动率加成
    let price = base * mult
    // 粉丝数加成（每10万粉丝增加5%）
    const followerBonus = follow > 0 ? Math.max(1, 1 + (follow / 100000) * 0.05) : 1
    // 互动率加成（互动率>5%加20%，>3%加10%）
    const engBonus = eng >= 5 ? 1.2 : eng >= 3 ? 1.1 : 1

    price = price * followerBonus * engBonus

    const lowPrice = Math.round(price * 0.8)
    const highPrice = Math.round(price * 1.2)
    const suggestPrice = Math.round(price)

    this.setData({
      calcResult: {
        suggest: util.formatMoney(suggestPrice),
        low: util.formatMoney(lowPrice),
        high: util.formatMoney(highPrice),
        suggestRaw: suggestPrice,
        multiplierText: `${mult}x（${contentType}）`,
        followerBonusText: follow > 0 ? `+${((followerBonus - 1) * 100).toFixed(1)}%（${(follow/10000).toFixed(0)}万粉）` : '未填写',
        engBonusText: eng > 0 ? `${engBonus === 1.2 ? '+20%' : engBonus === 1.1 ? '+10%' : '标准'}（互动率${eng}%）` : '未填写'
      }
    })
  },

  applyTemplate(e) {
    const { id } = e.currentTarget.dataset
    const tpl = this.data.templates.find(t => t.id === id || t.id === parseInt(id))
    if (tpl) {
      this.setData({ basePrice: String(tpl.basePrice) })
      this.calculate()
    }
  },

  copyQuote() {
    const { calcResult, contentType, followers, engagementRate } = this.data
    if (!calcResult) return
    const text = `【报价参考】\n内容类型：${contentType}\n粉丝数：${followers ? followers + '人' : '未填'}\n互动率：${engagementRate ? engagementRate + '%' : '未填'}\n\n建议报价：¥${calcResult.suggest}\n报价区间：¥${calcResult.low} ~ ¥${calcResult.high}`
    wx.setClipboardData({ data: text })
  },

  // 模板管理
  showAddTemplateModal() {
    this.setData({ showAddTemplate: true, newTemplate: { name: '', basePrice: '', desc: '' } })
  },

  hideAddTemplate() {
    this.setData({ showAddTemplate: false })
  },

  onTemplateInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`newTemplate.${field}`]: e.detail.value })
  },

  saveTemplate() {
    const { newTemplate } = this.data
    if (!newTemplate.name.trim() || !newTemplate.basePrice) {
      wx.showToast({ title: '请填写模板名称和基础报价', icon: 'none' })
      return
    }
    const tpl = {
      id: storage.genId(),
      name: newTemplate.name,
      basePrice: parseFloat(newTemplate.basePrice),
      desc: newTemplate.desc
    }
    storage.saveQuoteTemplate(tpl)
    this.setData({ showAddTemplate: false })
    this.loadTemplates()
    wx.showToast({ title: '模板已保存', icon: 'success' })
  },

  deleteTemplate(e) {
    const { id } = e.currentTarget.dataset
    storage.deleteQuoteTemplate(id)
    this.loadTemplates()
    wx.showToast({ title: '已删除', icon: 'success' })
  }
})
