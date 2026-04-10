// pages/rebate/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    rebates: [],
    orders: [],
    totalExpected: 0,
    totalReceived: 0,
    totalPending: 0,
    showAddForm: false,
    form: {
      orderId: '',
      brandName: '',
      amount: '',
      type: 'percent',
      rate: '',
      dueDate: '',
      receivedDate: '',
      status: 'pending',
      notes: ''
    },
    typeOptions: ['百分比返点', '固定金额', '产品置换'],
    typeValues: ['percent', 'fixed', 'product'],
    typeIdx: 0,
    statusOptions: ['待收取', '已收取', '逾期未收'],
    statusValues: ['pending', 'received', 'overdue'],
    statusIdx: 0,
    orderNames: [],
    editId: null,
    filterStatus: 'all'
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const rebates = storage.getRebates()
    const orders = storage.getOrders()
    const orderNames = orders.map(o => `${o.brandName}（¥${o.price}）`)

    let totalExpected = 0, totalReceived = 0, totalPending = 0
    rebates.forEach(r => {
      const amt = parseFloat(r.amount) || 0
      if (r.status === 'received') {
        totalReceived += amt
      } else if (r.status === 'pending') {
        totalPending += amt
        totalExpected += amt
      } else {
        totalExpected += amt
      }
    })
    totalExpected += totalReceived

    this.setData({
      rebates: rebates.map(r => ({
        ...r,
        statusLabel: r.status === 'received' ? '已收取' : r.status === 'overdue' ? '逾期' : '待收取',
        statusCls: r.status === 'received' ? 'tag-settled' : r.status === 'overdue' ? 'tag-cancelled' : 'tag-pending',
        amountText: util.formatMoney(r.amount)
      })),
      orders,
      orderNames,
      totalExpected: util.formatMoney(totalExpected),
      totalReceived: util.formatMoney(totalReceived),
      totalPending: util.formatMoney(totalPending)
    })
  },

  showAdd() {
    this.setData({
      showAddForm: true,
      editId: null,
      form: { orderId: '', brandName: '', amount: '', type: 'percent', rate: '', dueDate: '', receivedDate: '', status: 'pending', notes: '' },
      typeIdx: 0,
      statusIdx: 0
    })
  },

  hideAdd() {
    this.setData({ showAddForm: false })
  },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
    // 自动计算金额
    if (field === 'rate' || field === 'basePrice') {
      this.calcAmount()
    }
  },

  onOrderChange(e) {
    const idx = e.detail.value
    const order = this.data.orders[idx]
    if (order) {
      this.setData({
        'form.orderId': order.id,
        'form.brandName': order.brandName,
        'form.basePrice': order.price
      })
      this.calcAmount()
    }
  },

  onTypeChange(e) {
    const idx = e.detail.value
    this.setData({ typeIdx: idx, 'form.type': this.data.typeValues[idx] })
  },

  onStatusChange(e) {
    const idx = e.detail.value
    this.setData({ statusIdx: idx, 'form.status': this.data.statusValues[idx] })
  },

  onDueDateChange(e) {
    this.setData({ 'form.dueDate': e.detail.value })
  },

  onReceivedDateChange(e) {
    this.setData({ 'form.receivedDate': e.detail.value })
  },

  calcAmount() {
    const { form } = this.data
    if (form.type === 'percent' && form.rate && form.basePrice) {
      const amt = parseFloat(form.basePrice) * parseFloat(form.rate) / 100
      this.setData({ 'form.amount': String(Math.round(amt)) })
    }
  },

  saveRebate() {
    const { form, editId } = this.data
    if (!form.brandName.trim()) {
      wx.showToast({ title: '请填写品牌名称', icon: 'none' })
      return
    }
    if (!form.amount) {
      wx.showToast({ title: '请填写返点金额', icon: 'none' })
      return
    }
    const rebate = {
      ...form,
      id: editId || storage.genId(),
      amount: parseFloat(form.amount),
      createTime: util.today()
    }
    storage.saveRebate(rebate)
    this.setData({ showAddForm: false })
    this.loadData()
    wx.showToast({ title: editId ? '已更新' : '已记录', icon: 'success' })
  },

  editRebate(e) {
    const { id } = e.currentTarget.dataset
    const rebates = storage.getRebates()
    const rebate = rebates.find(r => r.id === id)
    if (!rebate) return
    const typeIdx = this.data.typeValues.indexOf(rebate.type)
    const statusIdx = this.data.statusValues.indexOf(rebate.status)
    this.setData({
      showAddForm: true,
      editId: id,
      form: { ...rebate },
      typeIdx: typeIdx >= 0 ? typeIdx : 0,
      statusIdx: statusIdx >= 0 ? statusIdx : 0
    })
  },

  markReceived(e) {
    const { id } = e.currentTarget.dataset
    const rebates = storage.getRebates()
    const rebate = rebates.find(r => r.id === id)
    if (rebate) {
      rebate.status = 'received'
      rebate.receivedDate = util.today()
      storage.saveRebate(rebate)
      this.loadData()
      wx.showToast({ title: '已标记收取', icon: 'success' })
    }
  },

  deleteRebate(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定删除此返点记录吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteRebate(id)
          this.loadData()
        }
      }
    })
  }
})
