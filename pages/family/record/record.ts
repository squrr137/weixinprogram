import { getPatientById, getPatientHistory } from '../../../utils/api'

Page({
  data: {
    patient: null as any,
    historyList: [] as any[],
    stats: {
      averageAdherence: 0,
      safeDays: 0
    },
    loading: true
  },

  onShow() {
    this.initData()
  },

  initData() {
    // 1. 获取绑定的患者 ID
    const patientId = wx.getStorageSync('boundPatientId')

    if (!patientId) {
      wx.showToast({ title: '未绑定患者', icon: 'none' })
      return
    }

    // 2. 获取数据
    const patientInfo = getPatientById(patientId)
    const history = getPatientHistory(patientId)

    // 3. 简单计算一下统计数据 (模拟)
    const totalAdherence = history.reduce((sum, item) => sum + item.adherence, 0)
    const avg = history.length > 0 ? Math.round(totalAdherence / history.length) : 0
    
    // 模拟计算“连续安全天数”
    const safeDays = history.filter(h => h.status === 'perfect' || h.status === 'good').length

    this.setData({
      patient: patientInfo,
      historyList: history,
      stats: {
        averageAdherence: avg,
        safeDays: safeDays
      },
      loading: false
    })
  }
})