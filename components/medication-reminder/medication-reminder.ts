// 直接在组件中定义接口，避免导入问题
interface ReminderMedication {
    id: number
    name: string
    dose: string
    time: string
    enabled: boolean
  }
  
  Component({
    properties: {
      medications: {
        type: Array,
        value: [] as ReminderMedication[]
      }
    },
  
    data: {
      voiceReminder: true,
      vibrationReminder: true
    },
  
    methods: {
      onTimeChange(e: any) {
        const time = e.detail.value
        const id = e.currentTarget.dataset.id
        
        const medications = this.data.medications.map((med: ReminderMedication) => {
          if (med.id === id) {
            return { ...med, time }
          }
          return med
        })
        
        this.setData({ medications })
        this.triggerEvent('reminderUpdate', { medications })
      },
  
      onReminderToggle(e: any) {
        const enabled = e.detail.value
        const id = e.currentTarget.dataset.id
        
        const medications = this.data.medications.map((med: ReminderMedication) => {
          if (med.id === id) {
            return { ...med, enabled }
          }
          return med
        })
        
        this.setData({ medications })
        this.triggerEvent('reminderUpdate', { medications })
      },
  
      addReminder() {
        const newMed: ReminderMedication = {
          id: Date.now(),
          name: '新药物',
          dose: '1片',
          time: '08:00',
          enabled: true
        }
        
        const medications = [...this.data.medications, newMed]
        this.setData({ medications })
        this.triggerEvent('reminderUpdate', { medications })
      },
  
      onVoiceToggle(e: any) {
        this.setData({ voiceReminder: e.detail.value })
      },
  
      onVibrationToggle(e: any) {
        this.setData({ vibrationReminder: e.detail.value })
      }
    }
  })