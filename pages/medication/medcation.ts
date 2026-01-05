interface Medication {
    id: number
    name: string
    dose: string
    time: string
    taken: boolean
    stock: number
    // 移除 enabled 属性，因为它在 reminder 组件中有不同的定义
  }
  
  Page({
    data: {
      todayMedications: [] as Medication[],
      medications: [] as Medication[],
      adherenceRate: 0,
      streakDays: 0,
      totalDoses: 0,
      lowStockMeds: [] as Medication[],
      nextAppointment: null as any,
      chartData: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [{
          values: [100, 85, 90, 95, 100, 80, 95]
        }]
      }
    },
  
    onLoad() {
      this.loadMedicationData()
      this.loadStatistics()
      this.checkStock()
      this.loadAppointment()
    },
  
    onShow() {
      this.loadTodayMedications()
    },
  
    loadMedicationData() {
      // 模拟药物数据
      const medications: Medication[] = [
        {
          id: 1,
          name: '舍曲林',
          dose: '50mg',
          time: '08:00',
          taken: false,
          stock: 14
        },
        {
          id: 2,
          name: '奥氮平',
          dose: '5mg', 
          time: '20:00',
          taken: false,
          stock: 7
        }
      ]
      this.setData({ medications })
      this.loadTodayMedications()
    },
  
    loadTodayMedications() {
      const medications = this.data.medications
      this.setData({ todayMedications: medications })
    },
  
    loadStatistics() {
      // 模拟统计数据
      this.setData({
        adherenceRate: 92,
        streakDays: 7,
        totalDoses: 42
      })
    },
  
    checkStock() {
      const lowStockMeds = this.data.medications.filter((med: Medication) => med.stock < 10)
      this.setData({ lowStockMeds })
    },
  
    loadAppointment() {
      // 模拟复诊数据
      this.setData({
        nextAppointment: {
          date: '2025-11-15',
          doctor: '张医生'
        }
      })
    },
  
    takeMedication(e: any) {
      const id = e.currentTarget.dataset.id
      const medications = this.data.todayMedications.map((med: Medication) => {
        if (med.id === id) {
          return { ...med, taken: true }
        }
        return med
      })
      
      this.setData({ todayMedications: medications })
      
      // 更新积分和连续天数
      this.updateMotivationData()
      
      wx.showToast({
        title: '服药记录已更新',
        icon: 'success'
      })
    },
  
    updateMotivationData() {
      // 更新激励数据
      const app = getApp()
      if (app.globalData.userInfo) {
        // 这里可以调用API更新服务器数据
      }
    },
  
    onReminderUpdate(e: any) {
      console.log('提醒设置更新', e.detail)
    }
  })