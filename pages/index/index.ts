import { getPatientById } from '../../utils/api'

Page({

    data: {
      userRole: '',
      userInfo: null,
      // 患者端模块 - 移除首页概览
      patientModules: [
        { name: '用药知识', icon: '📚', path: '/pages/education/education' },
        { name: '服药管理', icon: '💊', path: '/pages/medication/medication' },
        { name: '健康社区', icon: '👥', path: '/pages/community/community' },
        { name: '激励反馈', icon: '🏆', path: '/pages/motivation/motivation' },
        { name: '医患互动', icon: '👨‍⚕️', path: '/pages/interaction/interaction' },
        { name: '健康测评', icon: '📊', path: '/pages/assessment/assessment' }
      ],
      // 医生端模块 - 移除首页概览
      doctorModules: [
        { name: '患者管理', icon: '👥', path: '/pages/doctor/patients/patients' },
        { name: '用药指导', icon: '💊', path: '/pages/doctor/medication-guide/medication-guide' },
        { name: '健康监测', icon: '📈', path: '/pages/doctor/monitoring/monitoring' },
        { name: '在线咨询', icon: '💬', path: '/pages/doctor/consultation/consultation' },
        { name: '病历查看', icon: '📋', path: '/pages/doctor/records/records' },
        { name: '数据统计', icon: '📊', path: '/pages/doctor/statistics/statistics' }
      ],
      // 家属端模块 - 移除首页概览
      familyModules: [
        // 🔴 修正：路径从 reminders 改为 reminder (单数)
        { name: '服药提醒', icon: '⏰', path: '/pages/family/reminder/reminder' },
        // 🔴 修正：路径从 records 改为 record (单数)
        { name: '健康记录', icon: '📝', path: '/pages/family/record/record' },
        // 下面这些页面如果还没创建，可以先留着或者暂时注释掉
        { name: '进度查看', icon: '📊', path: '/pages/family/progress/progress' },
        { name: '家庭聊天', icon: '💬', path: '/pages/family/chat/chat' },
        { name: '紧急联系', icon: '🚨', path: '/pages/family/emergency/emergency' },
        { name: '医生沟通', icon: '👨‍⚕️', path: '/pages/family/consultation/consultation' }
      ],
      modules: [] as any[],
      todayMedicationCount: 0,
      totalMedicationCount: 3,
      dailyMotivation: '坚持服药是康复的重要一步，您做得很好！',
      streakDays: 7,
      points: 150,
      adherenceRate: 92,
      totalDoses: 42
    },
  
    onLoad() {
      const app = getApp()
      this.setData({
        userRole: app.globalData.userRole
      })
      this.loadRoleSpecificData()
      this.loadUserInfo()
      this.loadTodayMedication()
    },
  
    onShow() {
      this.loadTodayMedication()
    },
  
    loadRoleSpecificData() {
      const { userRole } = this.data
      let modules: any[] = []
      let welcomeText = ''
      
      switch (userRole) {
        case 'patient':
          modules = this.data.patientModules
          welcomeText = '患者'
          break
        case 'doctor':
          modules = this.data.doctorModules
          welcomeText = '医生'
          break
        case 'family':
          modules = this.data.familyModules
          
          // 🔵 新增逻辑：获取绑定的患者ID，模拟显示患者名字
          const patientId = wx.getStorageSync('boundPatientId')
          if (patientId) {
            // ✅ 核心修改：调用 API 获取真实信息
            const patientInfo = getPatientById(patientId)
            
            if (patientInfo) {
              welcomeText = `家属 (正在照护: ${patientInfo.name})`
            } else {
              // 如果 ID 存在但在数据库找不到（比如输入了错误的 ID）
              welcomeText = `家属 (未知患者 ID: ${patientId})`
            }
        } else {
            welcomeText = '家属 (未绑定)'
        }
          
          // 🔵 顺便更新一下家属看板的数据（模拟）
          this.setData({
              todayMedicationCount: 1, // 假设患者今天吃了1次
              totalMedicationCount: 3  // 总共要吃3次
          })
          break
        default:
          modules = this.data.patientModules
          welcomeText = '用户'
      }
      
      this.setData({ 
        modules,
        welcomeText 
      })
    },
  
    loadUserInfo() {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({ userInfo })
      }
    },
  
    loadTodayMedication() {
      const medications = wx.getStorageSync('todayMedications') || []
      this.setData({
        todayMedicationCount: medications.filter((m: any) => m.taken).length,
        totalMedicationCount: medications.length
      })
    },
  
    navigateTo(e: any) {
      const url = e.currentTarget.dataset.url
      console.log('尝试跳转到:', url)
      
      if (url) {
        wx.navigateTo({
          url: url,
          fail: (err) => {
            console.error('跳转失败:', err)
            wx.showToast({
              title: '功能开发中',
              icon: 'none'
            })
          }
        })
      }
    },
  
    // 退出登录
    logout() {
      wx.showModal({
        title: '确认退出',
        content: '您确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            wx.removeStorageSync('isLoggedIn')
            wx.removeStorageSync('userRole')
            wx.removeStorageSync('loginTime')
            
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }
        }
      })
    },
  
    // 切换角色
    switchRole() {
      wx.showActionSheet({
        itemList: ['切换为患者', '切换为医生', '切换为家属'],
        success: (res) => {
          const roles = ['patient', 'doctor', 'family']
          const newRole = roles[res.tapIndex]
          
          wx.setStorageSync('userRole', newRole)
          getApp().globalData.userRole = newRole
          
          this.setData({ userRole: newRole })
          this.loadRoleSpecificData()
          
          wx.showToast({
            title: `已切换为${['患者','医生','家属'][res.tapIndex]}模式`,
            icon: 'success'
          })
        }
      })
    },

    goToChat() {
      wx.navigateTo({
        url: '/pages/family/chat/chat', // 注意：路径前面要加斜杠 /
        fail: (err) => {
          console.error('跳转失败', err); // 如果还不行，控制台会显示具体原因
        }
      });
    },

    goToEmergency() {
      wx.navigateTo({ url: '/pages/family/emergency/emergency' })
    },

    goToConsultation() {
      console.log('>>> 按钮被点击了！'); 
      wx.navigateTo({
        url: '/pages/family/consultation/consultation',
        fail: (err) => {
          console.error('>>> 跳转失败详情:', err); 
        }
      });
    }
  })