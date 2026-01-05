Page({
    data: {
      streakDays: 7,
      totalPoints: 150,
      adherenceRate: 92,
      badges: [
        {
          id: 1,
          name: '初露锋芒',
          description: '连续服药3天',
          icon: '⭐',
          earned: true
        },
        {
          id: 2,
          name: '持之以恒',
          description: '连续服药7天', 
          icon: '🏆',
          earned: true
        },
        {
          id: 3,
          name: '月度之星',
          description: '连续服药30天',
          icon: '🌟',
          earned: false
        }
      ],
      pointsHistory: [
        { action: '每日服药', date: '2025-10-27', change: 10 },
        { action: '知识测验', date: '2025-10-26', change: 5 },
        { action: '连续打卡', date: '2025-10-25', change: 15 }
      ],
      dailyMotivation: '每一次按时服药都是对自己健康的负责，您做得很好！',
      growthChartData: {
        labels: ['第1周', '第2周', '第3周', '第4周'],
        datasets: [{
          values: [65, 78, 85, 92]
        }]
      },
      availableRewards: [
        {
          id: 1,
          name: '健康咨询券',
          description: '15分钟专业健康咨询',
          points: 100
        },
        {
          id: 2,
          name: '定制提醒',
          description: '个性化服药提醒语音',
          points: 50
        }
      ]
    },
  
    onLoad() {
      this.loadMotivationData()
    },
  
    onShow() {
      this.loadMotivationData()
    },
  
    loadMotivationData() {
      // 从服务器加载激励数据
      // 这里使用模拟数据
      console.log('加载激励数据')
      
      // 模拟从缓存加载数据
      const savedPoints = wx.getStorageSync('userPoints')
      const savedStreak = wx.getStorageSync('streakDays')
      
      if (savedPoints) {
        this.setData({ totalPoints: savedPoints })
      }
      if (savedStreak) {
        this.setData({ streakDays: savedStreak })
      }
      
      // 更新每日激励语
      this.setData({
        dailyMotivation: this.getDailyMotivation()
      })
    },
  
    getDailyMotivation(): string {
      const motivations = [
        '每一次按时服药都是对自己健康的负责，您做得很好！',
        '康复之路虽长，但您走的每一步都算数，继续坚持！',
        '您的坚持是康复的最大动力，今天也要为自己骄傲！',
        '风雨过后总见彩虹，您的努力终将换来更好的自己！',
        '每一天的坚持都在让您变得更强大，继续加油！',
        '小小的药片承载着大大的希望，坚持就是胜利！',
        '您正在创造属于自己的康复奇迹，继续保持！'
      ]
      return motivations[Math.floor(Math.random() * motivations.length)]
    },
  
    shareAchievement() {
      // 启用分享功能
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
      
      // 提示用户如何分享
      wx.showModal({
        title: '分享成就',
        content: `我已经连续服药${this.data.streakDays}天，获得了${this.data.totalPoints}积分！\n\n请点击右上角"..."分享给朋友`,
        showCancel: false,
        confirmText: '知道了'
      })
    },
  
    // 处理用户点击右上角分享
    onShareAppMessage() {
      return {
        title: '我的健康成就',
        desc: `坚持服药${this.data.streakDays}天，累计${this.data.totalPoints}积分`,
        path: '/pages/index/index',
        imageUrl: '/images/share-achievement.png' // 可以准备一张分享图片
      }
    },
  
    // 分享到朋友圈
    onShareTimeline() {
      return {
        title: `我在精神健康用药助手的成就：连续${this.data.streakDays}天服药，${this.data.totalPoints}积分`,
        query: `streak=${this.data.streakDays}&points=${this.data.totalPoints}`
      }
    },
  
    exchangeReward(e: any) {
      const rewardId = e.currentTarget.dataset.id
      const reward = this.data.availableRewards.find((r: any) => r.id === rewardId)
      
      if (!reward) {
        wx.showToast({
          title: '奖励不存在',
          icon: 'none'
        })
        return
      }
      
      if (this.data.totalPoints >= reward.points) {
        wx.showModal({
          title: '确认兑换',
          content: `确定要兑换【${reward.name}】吗？\n需要消耗${reward.points}积分`,
          success: (res) => {
            if (res.confirm) {
              // 扣除积分
              const newPoints = this.data.totalPoints - reward.points
              this.setData({ 
                totalPoints: newPoints 
              })
              
              // 保存到缓存
              wx.setStorageSync('userPoints', newPoints)
              
              // 显示兑换成功
              wx.showToast({
                title: '兑换成功',
                icon: 'success',
                duration: 2000
              })
              
              // 记录兑换历史
              this.recordRewardHistory(reward)
            }
          }
        })
      } else {
        wx.showToast({
          title: `积分不足，还需要${reward.points - this.data.totalPoints}积分`,
          icon: 'none',
          duration: 3000
        })
      }
    },
  
    recordRewardHistory(reward: any) {
      const history = wx.getStorageSync('rewardHistory') || []
      history.unshift({
        reward: reward.name,
        points: reward.points,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      })
      
      // 只保留最近10条记录
      if (history.length > 10) {
        history.pop()
      }
      
      wx.setStorageSync('rewardHistory', history)
    },
  
    // 查看积分详情
    viewPointsDetail() {
      wx.navigateTo({
        url: '/pages/motivation/points-detail/points-detail'
      })
    },
  
    // 查看成就详情
    viewAchievementDetail() {
      wx.navigateTo({
        url: '/pages/motivation/achievement-detail/achievement-detail'
      })
    },
  
    // 领取每日奖励
    claimDailyReward() {
      const today = new Date().toISOString().split('T')[0]
      const lastClaim = wx.getStorageSync('lastDailyClaim')
      
      if (lastClaim === today) {
        wx.showToast({
          title: '今日已领取',
          icon: 'none'
        })
        return
      }
      
      // 发放奖励
      const newPoints = this.data.totalPoints + 5
      this.setData({ 
        totalPoints: newPoints 
      })
      
      // 更新连续打卡天数
      const newStreak = this.calculateNewStreak()
      this.setData({
        streakDays: newStreak
      })
      
      // 保存数据
      wx.setStorageSync('userPoints', newPoints)
      wx.setStorageSync('streakDays', newStreak)
      wx.setStorageSync('lastDailyClaim', today)
      
      wx.showToast({
        title: '奖励领取成功！+5积分',
        icon: 'success'
      })
      
      // 检查是否解锁新成就
      this.checkNewAchievements(newStreak)
    },
  
    calculateNewStreak(): number {
      const lastClaim = wx.getStorageSync('lastDailyClaim')
      const today = new Date().toISOString().split('T')[0]
      
      if (!lastClaim) {
        return 1
      }
      
      const lastDate = new Date(lastClaim)
      const currentDate = new Date(today)
      const diffTime = currentDate.getTime() - lastDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // 连续打卡
        return this.data.streakDays + 1
      } else if (diffDays > 1) {
        // 中断后重新开始
        return 1
      } else {
        // 同一天
        return this.data.streakDays
      }
    },
  
    checkNewAchievements(currentStreak: number) {
      const achievements = [
        { days: 3, badgeId: 1 },
        { days: 7, badgeId: 2 },
        { days: 30, badgeId: 3 }
      ]
      
      achievements.forEach(achievement => {
        if (currentStreak === achievement.days) {
          this.unlockBadge(achievement.badgeId)
        }
      })
    },
  
    unlockBadge(badgeId: number) {
      const badges = this.data.badges.map(badge => {
        if (badge.id === badgeId && !badge.earned) {
          wx.showModal({
            title: '🎉 成就解锁！',
            content: `恭喜您获得了【${badge.name}】成就！`,
            showCancel: false
          })
          return { ...badge, earned: true }
        }
        return badge
      })
      
      this.setData({ badges })
    },
  
    // 页面卸载时保存数据
    onUnload() {
      this.saveMotivationData()
    },
  
    saveMotivationData() {
      wx.setStorageSync('userPoints', this.data.totalPoints)
      wx.setStorageSync('streakDays', this.data.streakDays)
    }
  })