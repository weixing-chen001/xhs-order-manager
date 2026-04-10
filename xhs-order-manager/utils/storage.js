// utils/storage.js - 数据存储工具

const KEYS = {
  ORDERS: 'orders',
  BRANDS: 'brands',
  REBATES: 'rebates',
  QUOTE_TEMPLATES: 'quoteTemplates'
}

// ===== 商单操作 =====
function getOrders() {
  return wx.getStorageSync(KEYS.ORDERS) || []
}

function saveOrder(order) {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === order.id)
  if (idx >= 0) {
    orders[idx] = order
  } else {
    orders.unshift(order)
  }
  wx.setStorageSync(KEYS.ORDERS, orders)
  return order
}

function deleteOrder(id) {
  const orders = getOrders().filter(o => o.id !== id)
  wx.setStorageSync(KEYS.ORDERS, orders)
}

function getOrderById(id) {
  return getOrders().find(o => o.id === id)
}

// ===== 品牌操作 =====
function getBrands() {
  return wx.getStorageSync(KEYS.BRANDS) || []
}

function saveBrand(brand) {
  const brands = getBrands()
  const idx = brands.findIndex(b => b.id === brand.id)
  if (idx >= 0) {
    brands[idx] = brand
  } else {
    brands.unshift(brand)
  }
  wx.setStorageSync(KEYS.BRANDS, brands)
  return brand
}

function deleteBrand(id) {
  const brands = getBrands().filter(b => b.id !== id)
  wx.setStorageSync(KEYS.BRANDS, brands)
}

function getBrandById(id) {
  return getBrands().find(b => b.id === id)
}

// ===== 返点操作 =====
function getRebates() {
  return wx.getStorageSync(KEYS.REBATES) || []
}

function saveRebate(rebate) {
  const rebates = getRebates()
  const idx = rebates.findIndex(r => r.id === rebate.id)
  if (idx >= 0) {
    rebates[idx] = rebate
  } else {
    rebates.unshift(rebate)
  }
  wx.setStorageSync(KEYS.REBATES, rebates)
  return rebate
}

function deleteRebate(id) {
  const rebates = getRebates().filter(r => r.id !== id)
  wx.setStorageSync(KEYS.REBATES, rebates)
}

// ===== 报价模板操作 =====
function getQuoteTemplates() {
  return wx.getStorageSync(KEYS.QUOTE_TEMPLATES) || []
}

function saveQuoteTemplate(tpl) {
  const templates = getQuoteTemplates()
  const idx = templates.findIndex(t => t.id === tpl.id)
  if (idx >= 0) {
    templates[idx] = tpl
  } else {
    templates.unshift(tpl)
  }
  wx.setStorageSync(KEYS.QUOTE_TEMPLATES, templates)
  return tpl
}

function deleteQuoteTemplate(id) {
  const templates = getQuoteTemplates().filter(t => t.id !== id)
  wx.setStorageSync(KEYS.QUOTE_TEMPLATES, templates)
}

// ===== 生成唯一ID =====
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

module.exports = {
  getOrders, saveOrder, deleteOrder, getOrderById,
  getBrands, saveBrand, deleteBrand, getBrandById,
  getRebates, saveRebate, deleteRebate,
  getQuoteTemplates, saveQuoteTemplate, deleteQuoteTemplate,
  genId
}
