
Page({


  data: {
    doctor: {
      name: '张医生',
      title: '副主任医师',
      department: '康复医学科',
      hospital: '市第一人民医院',
      avatar: 'https://api.iconify.design/noto:man-health-worker-light-skin-tone.svg', // 模拟头像
      tags: ['脑卒中康复', '神经内科', '耐心细致'],
      responseRate: 98,
      consultCount: 1205,
      satisfaction: 4.9
    },
    historyList: [
      {
        id: 1,
        date: '2025-12-01 14:30',
        status: 'replied',
        question: '医生您好，病人最近服药后有些嗜睡，这正常吗？需要调整剂量吗？',
        reply: '嗜睡是该药物常见的轻微副作用，通常一周内会缓解。如果嗜睡严重影响进食，建议复诊。目前暂时维持原剂量观察。'
      },
      {
        id: 2,
        date: '2025-12-03 09:15',
        status: 'pending', // 待回复
        question: '昨晚病人血压有点高（150/95），今天还需要继续进行康复训练吗？',
        reply: null
      }
    ]
  },

  onLoad() {
    console.log('医生咨询页加载了');
  },

  // 发起图文咨询
  startTextConsult() {
    wx.showModal({
      title: '发起咨询',
      editable: true, // 允许输入
      placeholderText: '请详细描述您的问题...',
      confirmText: '提交',
      confirmColor: '#007AFF',
      success: (res) => {
        if (res.confirm && res.content) {
          this.submitQuestion(res.content);
        }
      }
    });
  },

  // 提交问题逻辑
  submitQuestion(content: string) {
    wx.showLoading({ title: '提交中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟插入一条新数据
      const newRecord = {
        id: Date.now(),
        date: '刚刚',
        status: 'pending',
        question: content,
        reply: null
      };

      this.setData({
        historyList: [newRecord, ...this.data.historyList]
      });

      wx.showToast({ title: '提交成功', icon: 'success' });
    }, 1000);
  },

  // 电话咨询
  startPhoneConsult() {
    wx.showModal({
      title: '拨打工作电话',
      content: '工作时间：周一至周五 08:30-17:00\n非工作时间请留言。',
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: '021-12345678' });
        }
      }
    });
  }
})