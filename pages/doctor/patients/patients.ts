
import { getDoctorPatients } from '../../../utils/api'

// 定义接口，方便 TS 推断
interface Patient {
  id: string  // 注意：之前是 number，为了统一建议改为 string
  name: string
  avatar: string
  diagnosis: string
  lastVisit: string
  needAttention: boolean
  adherenceRate: number
  lastAssessment: string
  unreadMessages: number
}

Page({
  data: {
    patients: [] as Patient[],
    filteredPatients: [] as Patient[],
    searchKeyword: '',
    currentFilter: 'all'
  },

  onLoad() {
    this.loadPatientsData()
  },

  onPullDownRefresh() {
    this.loadPatientsData()
    wx.stopPullDownRefresh()
  },

  // 加载数据的方法
  loadPatientsData() {
    
    const rawPatients = getDoctorPatients()
    
    // 将 API 数据转换为页面需要的格式 (适配器模式)
    const patients: Patient[] = rawPatients.map((p: any) => ({
      id: p.id,
      name: p.name,
      avatar: '👤', // API 里没有头像，给个默认的
      diagnosis: p.diagnosis,
      lastVisit: '2025-10-20', // 模拟数据
      needAttention: p.status === '需关注',
      adherenceRate: 85, // 模拟数据
      lastAssessment: p.status,
      unreadMessages: 0 // 模拟数据
    }))

    this.setData({
      patients,
      filteredPatients: patients
    })
  },

  onSearchInput(e: any) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    this.filterPatients()
  },

  setFilter(e: any) {
    const filter = e.currentTarget.dataset.filter
    this.setData({ currentFilter: filter })
    this.filterPatients()
  },

  filterPatients() {
    const { patients, searchKeyword, currentFilter } = this.data
    let filtered = patients

    // 搜索过滤
    if (searchKeyword) {
      filtered = filtered.filter(patient => 
        patient.name.includes(searchKeyword) ||
        patient.diagnosis.includes(searchKeyword)
      )
    }

    // 筛选过滤
    if (currentFilter === 'attention') {
      filtered = filtered.filter(patient => patient.needAttention)
    } else if (currentFilter === 'recent') {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      filtered = filtered.filter(patient => {
        const lastVisit = new Date(patient.lastVisit)
        return lastVisit > oneWeekAgo
      })
    }

    this.setData({ filteredPatients: filtered })
  },

  viewPatientDetail(e: any) {
    const patientId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/doctor/patient-detail/patient-detail?id=${patientId}`
    })
  },

  sendMessage(e: any) {
    const patientId = e.currentTarget.dataset.id
    const patient = this.data.patients.find(p => p.id === patientId)
    
    if (patient) {
      wx.navigateTo({
        url: `/pages/doctor/chat/chat?patientId=${patientId}&patientName=${patient.name}`
      })
    }
  },

  viewRecords(e: any) {
    const patientId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/doctor/patient-records/patient-records?id=${patientId}`
    })
  }
})