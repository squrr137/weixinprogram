Page({
  data: {
    contacts: [
      { id: 1, name: '李华', role: '儿子', phone: '13800138000' },
      { id: 2, name: '张医生', role: '主治医师', phone: '13900000000' },
      { id: 3, name: '社区服务中心', role: '24小时', phone: '021-12345678' }
    ]
  },

  // 1. 呼叫 120
  callEmergency() {
    wx.showModal({
      title: '紧急确认',
      content: '确定要拨打 120 急救电话吗？',
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '120' // 模拟器上可能无法拨打，真机有效
          });
        }
      }
    });
  },

  // 2. 拨打普通联系人
  callContact(e: any) {
    const { phone, name } = e.currentTarget.dataset;
    wx.showModal({
      title: '拨号确认',
      content: `确定拨打给 ${name} ?`,
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone
          });
        }
      }
    });
  },

  // 3. 发送位置 (需要权限配置，这里做简化模拟)
  sendCurrentLocation() {
    // 实际开发需要先在 app.json 声明 permission
    wx.showLoading({ title: '定位中...' });

    // 模拟定位过程
    setTimeout(() => {
      wx.hideLoading();
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          console.log('当前坐标', res.latitude, res.longitude);
          // 这里通常调用云函数发送短信或推送
          wx.showToast({
            title: '位置已发送给家属',
            icon: 'success',
            duration: 2000
          });
        },
        fail: () => {
          wx.showToast({
            title: '定位失败，请检查权限',
            icon: 'none'
          });
        }
      });
    }, 1000);
  }
})