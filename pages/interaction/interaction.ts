interface Doctor {
    id: number;
    name: string;
    department: string;
    hospital: string;
    avatar: string;
  }
  
  interface Patient {
    id: number;
    name: string;
    adherenceRate: number;
    lastVisit: string;
    avatar: string;
    needAttention: boolean;
  }
  
  interface FamilyMember {
    id: number;
    name: string;
    relation: string;
    todayMedication: string;
    avatar: string;
  }
  
  interface ChatMessage {
    id: number;
    sender: string;
    content: string;
    time: string;
  }
  
  interface SystemMessage {
    id: number;
    sender: string;
    preview: string;
    time: string;
    unread: boolean;
  }
  
  interface Expert {
    id: number;
    name: string;
    department: string;
    avatar: string;
    online: boolean;
  }
  
  Page({
    data: {
      currentRole: '', // 直接从登录状态获取
      roleNames: {
        patient: '患者',
        doctor: '医生', 
        family: '家属'
      },
      shareWithDoctors: true,
      shareWithFamily: false,
      myDoctors: [] as any[],
      myPatients: [] as any[],
      patientAlerts: [] as any[],
      familyMembers: [] as any[],
      familyChat: [] as any[],
      chatMessage: '',
      messages: [] as any[],
      onlineExperts: [] as any[]
    },
  
    onLoad() {
      this.loadInteractionData();
    },
  
    onShow() {
      this.checkNewMessages();
    },
  
    loadInteractionData() {
      // 从全局数据获取当前角色
      const app = getApp();
      const userRole = app.globalData.userRole;
      
      console.log('当前用户角色:', userRole);
      
      this.setData({ 
        currentRole: userRole 
      });
  
      // 根据角色加载不同的数据
      this.loadRoleSpecificData(userRole);
      
      // 加载消息
      this.loadMessages();
    },
  
    loadRoleSpecificData(userRole: string) {
      switch (userRole) {
        case 'patient':
          this.loadPatientData();
          break;
        case 'doctor':
          this.loadDoctorData();
          break;
        case 'family':
          this.loadFamilyData();
          break;
        default:
          this.loadPatientData();
      }
    },
  
    loadPatientData() {
      // 患者数据 - 我的医生
      const doctors: any[] = [
        {
          id: 1,
          name: '张医生',
          department: '精神科',
          hospital: '市人民医院',
          avatar: '/images/doctor_avatar.png'
        },
        {
          id: 2,
          name: '王医生',
          department: '心理科',
          hospital: '市中心医院',
          avatar: '/images/doctor_avatar2.png'
        }
      ];
  
      this.setData({ 
        myDoctors: doctors,
        onlineExperts: [
          {
            id: 1,
            name: '张医生',
            department: '精神科',
            avatar: '/images/doctor_avatar.png',
            online: true
          },
          {
            id: 2,
            name: '李心理师',
            department: '心理咨询',
            avatar: '/images/psychologist_avatar.png', 
            online: false
          }
        ]
      });
    },
  
    loadDoctorData() {
      // 医生数据 - 我的患者
      const patients: any[] = [
        {
          id: 1,
          name: '李**',
          adherenceRate: 85,
          lastVisit: '2025-10-20',
          avatar: '/images/patient_avatar.png',
          needAttention: true
        },
        {
          id: 2,
          name: '王**',
          adherenceRate: 95,
          lastVisit: '2025-10-25',
          avatar: '/images/patient_avatar2.png',
          needAttention: false
        }
      ];
  
      const patientAlerts = [
        {
          patientId: 1,
          patientName: '李**',
          alertType: '连续2天未服药',
          time: '今天 09:30'
        }
      ];
  
      this.setData({ 
        myPatients: patients,
        patientAlerts: patientAlerts
      });
    },
  
    loadFamilyData() {
      // 家属数据
      const familyMembers: any[] = [
        {
          id: 1,
          name: '父亲',
          relation: '患者',
          todayMedication: '2/3',
          avatar: '/images/family_avatar.png'
        }
      ];
  
      const familyChat: any[] = [
        {
          id: 1,
          sender: 'me',
          content: '记得提醒按时服药',
          time: '10:30'
        },
        {
          id: 2,
          sender: '父亲',
          content: '好的，今天已经吃过药了',
          time: '10:32'
        }
      ];
  
      this.setData({ 
        familyMembers: familyMembers,
        familyChat: familyChat
      });
    },
  
    loadMessages() {
      const messages: any[] = [
        {
          id: 1,
          sender: '张医生',
          preview: '最近服药情况如何？有什么不适吗？',
          time: '昨天 14:30',
          unread: true
        },
        {
          id: 2,
          sender: '系统通知',
          preview: '您的服药依从性报告已生成',
          time: '今天 09:15',
          unread: false
        }
      ];
  
      this.setData({ messages });
    },
  
    contactDoctor(e: any) {
      const doctorId = e.currentTarget.dataset.id;
      const doctor = this.data.myDoctors.find(d => d.id === doctorId);
      
      if (doctor) {
        wx.navigateTo({
          url: `/pages/interaction/chat/chat?type=doctor&id=${doctorId}&name=${doctor.name}`
        });
      }
    },
  
    toggleShareWithDoctors(e: any) {
      const enabled = e.detail.value;
      this.setData({ shareWithDoctors: enabled });
      
      wx.showToast({
        title: enabled ? '已开启医生共享' : '已关闭医生共享',
        icon: 'success'
      });
    },
  
    toggleShareWithFamily(e: any) {
      const enabled = e.detail.value;
      this.setData({ shareWithFamily: enabled });
      
      wx.showToast({
        title: enabled ? '已开启家属共享' : '已关闭家属共享',
        icon: 'success'
      });
    },
  
    viewPatientDetail(e: any) {
      const patientId = e.currentTarget.dataset.id;
      const patient = this.data.myPatients.find(p => p.id === patientId);
      
      if (patient) {
        wx.navigateTo({
          url: `/pages/interaction/patient-detail/patient-detail?id=${patientId}&name=${patient.name}`
        });
      }
    },
  
    sendReminder() {
      wx.showToast({
        title: '提醒已发送',
        icon: 'success'
      });
    },
  
    onChatInput(e: any) {
      this.setData({ chatMessage: e.detail.value });
    },
  
    sendMessage() {
      const message = this.data.chatMessage.trim();
      if (!message) {
        wx.showToast({
          title: '请输入消息内容',
          icon: 'none'
        });
        return;
      }
  
      const newMessage: any = {
        id: Date.now(),
        sender: 'me',
        content: message,
        time: new Date().toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      };
  
      this.setData({
        familyChat: [...this.data.familyChat, newMessage],
        chatMessage: ''
      });
  
      // 模拟自动回复
      this.simulateAutoReply();
    },
  
    simulateAutoReply() {
      setTimeout(() => {
        const replies = [
          '收到，会注意提醒的',
          '好的，谢谢关心',
          '今天状态不错，按时服药了',
          '会继续坚持的'
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const autoReply: any = {
          id: Date.now() + 1,
          sender: '家人',
          content: randomReply,
          time: new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })
        };
  
        this.setData({
          familyChat: [...this.data.familyChat, autoReply]
        });
      }, 2000);
    },
  
    viewMessage(e: any) {
      const messageId = e.currentTarget.dataset.id;
      
      // 标记为已读
      const messages = this.data.messages.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, unread: false };
        }
        return msg;
      });
      this.setData({ messages });
      
      // 跳转到消息详情
      const message = this.data.messages.find(m => m.id === messageId);
      if (message) {
        wx.navigateTo({
          url: `/pages/interaction/message-detail/message-detail?id=${messageId}&sender=${message.sender}&content=${message.preview}`
        });
      }
    },
  
    checkNewMessages() {
      const unreadCount = this.data.messages.filter(msg => msg.unread).length;
      
      if (unreadCount > 0) {
        // 可以设置tabbar角标
        console.log('有未读消息:', unreadCount);
      }
    },
  
    // 联系在线专家
    contactExpert(e: any) {
      const expertId = e.currentTarget.dataset.id;
      const expert = this.data.onlineExperts.find(e => e.id === expertId);
      
      if (expert) {
        if (expert.online) {
          wx.navigateTo({
            url: `/pages/interaction/chat/chat?type=expert&id=${expertId}&name=${expert.name}`
          });
        } else {
          wx.showToast({
            title: '专家当前不在线',
            icon: 'none'
          });
        }
      }
    },
  
    // 刷新数据
    refreshData() {
      wx.showLoading({ title: '刷新中...' });
      
      // 模拟网络请求
      setTimeout(() => {
        this.loadInteractionData();
        wx.hideLoading();
        wx.showToast({
          title: '刷新成功',
          icon: 'success'
        });
      }, 1000);
    }
  });