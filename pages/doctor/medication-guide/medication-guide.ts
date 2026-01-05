Page({
    data: {
      commonMeds: [
        { id: 1, name: '舍曲林', type: 'SSRI' },
        { id: 2, name: '氟西汀', type: 'SSRI' },
        { id: 3, name: '文拉法辛', type: 'SNRI' },
        { id: 4, name: '奥氮平', type: '抗精神病药' },
        { id: 5, name: '利培酮', type: '抗精神病药' },
        { id: 6, name: '劳拉西泮', type: '苯二氮䓬类' }
      ],
      guides: [
        {
          id: 1,
          title: '抑郁症初始治疗方案',
          description: '适用于中度抑郁症患者的初始药物治疗方案',
          createTime: '2025-10-20',
          medications: [
            { name: '舍曲林', dose: '50mg/日' },
            { name: '劳拉西泮', dose: '0.5mg prn' }
          ]
        },
        {
          id: 2,
          title: '焦虑症维持治疗',
          description: '焦虑症患者的长期维持治疗方案',
          createTime: '2025-10-15',
          medications: [
            { name: '文拉法辛', dose: '75mg/日' }
          ]
        }
      ]
    },
  
    onLoad() {
      // 数据已经在 data 中定义
    },
  
    createGuide() {
      wx.navigateTo({
        url: '/pages/doctor/create-guide/create-guide'
      });
    },
  
    viewTemplates() {
      wx.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
  
    selectMedication(e: any) {
      const med = e.currentTarget.dataset.med;
      wx.showModal({
        title: med.name,
        content: `类型：${med.type}\n\n是否查看详细用药指南？`,
        success: (res) => {
          if (res.confirm) {
            this.viewMedicationDetail(med);
          }
        }
      });
    },
  
    viewMedicationDetail(med: any) {
      wx.navigateTo({
        url: `/pages/doctor/med-detail/med-detail?id=${med.id}&name=${med.name}`
      });
    },
  
    editGuide(e: any) {
      const guideId = parseInt(e.currentTarget.dataset.id);
      wx.navigateTo({
        url: `/pages/doctor/edit-guide/edit-guide?id=${guideId}`
      });
    },
  
    assignGuide(e: any) {
      const guideId = parseInt(e.currentTarget.dataset.id);
      wx.navigateTo({
        url: `/pages/doctor/assign-guide/assign-guide?id=${guideId}`
      });
    }
  });