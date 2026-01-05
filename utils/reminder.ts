export class ReminderManager {
    static async requestNotificationPermission() {
      return new Promise((resolve) => {
        wx.requestSubscribeMessage({
          tmplIds: ['TEMPLATE_ID_HERE'],
          success: (res) => {
            console.log('通知权限请求成功', res)
            resolve(true)
          },
          fail: (err) => {
            console.log('通知权限请求失败', err)
            resolve(false)
          }
        })
      })
    }
  
    static setLocalReminder(time: string, medication: any) {
      // 设置本地提醒
      const reminder = {
        id: Date.now(),
        time,
        medication,
        enabled: true
      }
  
      const reminders = this.getReminders()
      reminders.push(reminder)
      wx.setStorageSync('medicationReminders', reminders)
  
      this.scheduleNextReminder(reminder)
    }
  
    static getReminders() {
      return wx.getStorageSync('medicationReminders') || []
    }
  
    static scheduleNextReminder(reminder: any) {
      // 计算下一次提醒时间
      const now = new Date()
      const [hours, minutes] = reminder.time.split(':').map(Number)
      const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
      
      if (reminderTime < now) {
        reminderTime.setDate(reminderTime.getDate() + 1)
      }
  
      const delay = reminderTime.getTime() - now.getTime()
  
      setTimeout(() => {
        this.showReminderNotification(reminder)
        // 设置下一次提醒（每天）
        this.scheduleNextReminder(reminder)
      }, delay)
    }
  
    static showReminderNotification(reminder: any) {
      wx.showModal({
        title: '💊 服药提醒',
        content: `该服用 ${reminder.medication.name} ${reminder.medication.dose} 了`,
        confirmText: '已服用',
        cancelText: '稍后提醒',
        success: (res) => {
          if (res.confirm) {
            this.recordMedicationTaken(reminder.medication)
          } else {
            // 10分钟后再次提醒
            setTimeout(() => {
              this.showReminderNotification(reminder)
            }, 10 * 60 * 1000)
          }
        }
      })
    }
  
    static recordMedicationTaken(medication: any) {
      const today = new Date().toISOString().split('T')[0]
      const records = wx.getStorageSync('medicationRecords') || {}
      
      if (!records[today]) {
        records[today] = []
      }
      
      records[today].push({
        medication,
        time: new Date().toISOString()
      })
      
      wx.setStorageSync('medicationRecords', records)
    }
  
    static checkStock(medications: any[]) {
      return medications.filter(med => med.stock < 7) // 少于7天用量预警
    }
  }