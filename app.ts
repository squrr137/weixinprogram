import { CommonUtils } from './utils/common';

App({
    onLaunch() {
      console.log('App Launch')
      this.checkLoginStatus()
      // 用于初始化测试数据
      this.initDebugData();
    },
  
    initDebugData() {
      // 1. 模拟【健康指标】数据 (最近7天)
      const healthRecords = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        healthRecords.push({
          date: CommonUtils.formatDate(d, 'MM-DD'),
          value: 110 + Math.floor(Math.random() * 20) // 随机生成 110-130 之间的数值
        });
      }
      wx.setStorageSync('health_records', healthRecords);
  
      // 2. 模拟【评估问卷】历史数据
      const assessmentHistory = [
        { date: '第一周', score: 12 },
        { date: '第二周', score: 15 },
        { date: '第三周', score: 18 },
        { date: '第四周', score: 20 }
      ];
      wx.setStorageSync('assessment_history', assessmentHistory);
  
      // 3. 模拟【服药依从性】数据 (最近7天的完成率 0.0 - 1.0)
      // 假设：1.0 是全勤，0.5 是漏了一半
      const adherenceStats = [1.0, 0.8, 1.0, 1.0, 0.5, 1.0, 0.9];
      wx.setStorageSync('weekly_adherence_stats', adherenceStats);
      
      console.log('✅ 模拟数据已写入 Storage');
    },

    onShow() {
      console.log('App Show')
    },
  
    onHide() {
      console.log('App Hide')
    },
  
    checkLoginStatus() {
      const isLoggedIn = wx.getStorageSync('isLoggedIn')
      const userRole = wx.getStorageSync('userRole')
      
      if (isLoggedIn && userRole) {
        this.globalData.isLoggedIn = true
        this.globalData.userRole = userRole
        console.log('用户已登录，角色:', userRole)
        
        // 设置首页为启动页
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else {
        console.log('用户未登录，跳转到登录页')
        wx.reLaunch({
          url: '/pages/login/login'
        })
      }
    },
  
    globalData: {
      userInfo: null,
      userRole: '', // patient, doctor, family
      isLoggedIn: false,
      token: null
    }
  })