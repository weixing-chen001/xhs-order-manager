// pages/calendar/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    year: 0, month: 0,
    days: [],
    ordersMap: {},
    selectedDate: '',
    dayOrders: []
  },

  onShow() {
    const now = new Date()
    this.setData({ year: now.getFullYear(), month: now.getMonth() + 1 })
    this.buildCalendar()
  },

  // 构建月历
  buildCalendar() {
    const { year, month } = this.data
    const firstDay = new Date(year, month - 1, 1).getDay() // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate()

    // 获取当月商单，按日期分组
    const orders = storage.getOrders()
    const ordersMap = {}
    orders.forEach(o => {
      if (!o.scheduleDate) return
      const d = o.scheduleDate.slice(0, 10)
      if (!ordersMap[d]) ordersMap[d] = []
      ordersMap[d].push({
        ...o,
        progressInfo: util.getProgressInfo(o.progress),
        profit: util.calcProfit(o),
        contentTypeText: (util.getContentTypeInfo(o.contentType) || {}).label || '',
        competitionText: (util.getCompetitionRangeInfo(o.competitionRange) || {}).label || ''
      })
    })

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push({ empty: true })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      const dayOrdersList = ordersMap[dateStr] || []
      days.push({
        day: d,
        dateStr,
        hasOrder: dayOrdersList.length > 0,
        orderCount: dayOrdersList.length,
        isToday: dateStr === util.today(),
        isSelected: dateStr === this.data.selectedDate,
        // 日历格子内直接显示的商单信息
        orders: dayOrdersList.length > 0 ? dayOrdersList : null
      })
    }

    this.setData({ days, ordersMap })
    if (this.data.selectedDate) {
      this.showDayDetail(this.data.selectedDate)
    }
  },

  prevMonth() {
    let { year, month } = this.data
    month--
    if (month <= 0) { month = 12; year-- }
    this.setData({ year, month }, () => { this.buildCalendar() })
  },

  nextMonth() {
    let { year, month } = this.data
    month++
    if (month > 12) { month = 1; year++ }
    this.setData({ year, month }, () => { this.buildCalendar() })
  },

  tapDay(e) {
    const { date } = e.currentTarget.dataset
    this.setData({ selectedDate: date })
    // 更新选中状态
    const days = this.data.days.map(d => ({ ...d, isSelected: d.dateStr === date }))
    this.setData({ days })
    this.showDayDetail(date)
  },

  showDayDetail(dateStr) {
    const orders = this.data.ordersMap[dateStr] || []
    this.setData({ dayOrders: orders })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/orders/detail/index?id=${id}` })
  },

  goToAddForDate(e) {
    const { date } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/orders/add/index?date=${date}` })
  },

  // 调整档期（长按或点击按钮）
  changeSchedule(e) {
    const { id } = e.currentTarget.dataset
    wx.showActionSheet({
      itemList: ['调整档期日期', '修改商单', '查看详情'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 选择新日期
          wx.showModal({
            title: '调整档期',
            content: '请在商单详情中修改预定档期日期',
            showCancel: false
          })
          wx.navigateTo({ url: `/pages/orders/detail/index?id=${id}` })
        } else if (res.tapIndex === 1) {
          wx.navigateTo({ url: `/pages/orders/add/index?id=${id}` })
        } else {
          wx.navigateTo({ url: `/pages/orders/detail/index?id=${id}` })
        }
      }
    })
  }
})
