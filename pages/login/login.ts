Page({
    data: {
      // 可以添加一些动画状态
    },
  
    onLoad() {
      console.log('登录页面加载')
      this.checkLoginStatus()
    },
  
    checkLoginStatus() {
      const isLoggedIn = wx.getStorageSync('isLoggedIn')
      const userRole = wx.getStorageSync('userRole')
      
      if (isLoggedIn && userRole) {
        console.log('检测到已登录，角色:', userRole)
        // 已经登录，直接跳转到首页
        wx.switchTab({
          url: '/pages/index/index',
          success: () => {
            console.log('跳转到首页成功')
          },
          fail: (err) => {
            console.error('跳转到首页失败:', err)
          }
        })
      } else {
        console.log('未检测到登录状态')
      }
    },
  
    selectRole(e: any) {
      const role = e.currentTarget.dataset.role
      console.log('选择的角色:', role)
  
      // 🔴如果是家属，先进行患者绑定模拟
      if (role === 'family') {
        this.handleFamilyBinding();
      } else {
        // 医生或患者直接登录（后续也可加各自的逻辑）
        this.performLoginAnimation(role);
      }
    },

    handleFamilyBinding() {
      wx.showModal({
        title: '绑定患者',
        content: '请输入患者的关联码（测试请输入 123456）',
        editable: true,
        placeholderText: '患者关联码',
        success: (res) => {
          if (res.confirm) {
            if (res.content === '123456') { // 模拟验证成功
              wx.showToast({ title: '绑定成功', icon: 'success' });
              // 绑定成功后，执行登录动画和跳转
              this.performLoginAnimation('family'); 
            } else {
              wx.showToast({ title: '关联码错误', icon: 'error' });
            }
          }
        }
      })
    },

    performLoginAnimation(role: string) {
      // 显示加载动画
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      
      // 模拟网络请求延迟
      setTimeout(() => {
        this.handleLogin(role)
      }, 1000)
    },
  
    handleLogin(role: string) {
      console.log('开始处理登录，角色:', role)
      
      // 保存登录状态
      wx.setStorageSync('isLoggedIn', true)
      wx.setStorageSync('userRole', role)
      wx.setStorageSync('loginTime', new Date().getTime())
  
      // 如果是家属，可能还需要存一个绑定的患者ID
      if (role === 'family') {
          wx.setStorageSync('boundPatientId', 'patient_001') // 模拟存入被绑定的患者ID
      }
      
      // 更新全局数据
      const app = getApp()
      app.globalData.isLoggedIn = true
      app.globalData.userRole = role
      
      console.log('登录状态保存完成')
      wx.hideLoading()
      
      // 显示登录成功提示
      wx.showToast({
        title: `${this.getRoleName(role)}登录成功`,
        icon: 'success',
        duration: 1500
      })
      
      // 跳转到首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index',
          fail: (err) => {
               console.error('switchTab 失败，尝试 navigateTo', err);
               // 如果首页不是 tabbar 页面，改用 navigateTo
               wx.navigateTo({ url: '/pages/index/index' });
          }
        })
      }, 1500)
    },
  
    getRoleName(role: string): string {
      const roleNames: { [key: string]: string } = {
        patient: '患者',
        doctor: '医生',
        family: '家属'
      }
      return roleNames[role] || '用户'
    }
  })