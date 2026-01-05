import { getPatientById, getPatientMedications } from '../../../utils/api'

Page({
  data: {
    patientName: '',
    date: '',
    reminders: [] as any[],
    loading: true,
    hasBoundPatient: false
  },

  onShow() {
    // 每次显示页面时刷新数据 (保证状态最新)
    this.initData()
  },

  initData() {
    // 1. 获取当前日期
    const now = new Date()
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`

    // 2. 获取绑定的患者 ID
    const patientId = wx.getStorageSync('boundPatientId')

    if (!patientId) {
      this.setData({ 
        hasBoundPatient: false,
        loading: false 
      })
      
      // 如果没绑定，提示并返回
      wx.showModal({
        title: '提示',
        content: '您尚未绑定患者，请重新登录绑定',
        showCancel: false,
        success: () => {
          wx.reLaunch({ url: '/pages/login/login' })
        }
      })
      return
    }

    // 3. 获取患者信息和药物列表
    const patientInfo = getPatientById(patientId)
    const medications = getPatientMedications(patientId)

    this.setData({
      hasBoundPatient: true,
      patientName: patientInfo ? patientInfo.name : '未知患者',
      date: dateStr,
      reminders: medications,
      loading: false
    })
  },

  // 模拟家属“提醒”患者的功能
  sendReminder(e: any) {
    const medName = e.currentTarget.dataset.name
    
    wx.showLoading({ title: '发送提醒中...' })
    
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: `已提醒服药`,
        icon: 'success'
      })
      console.log(`家属给患者发送了关于 ${medName} 的提醒`)
    }, 800)
  }
})