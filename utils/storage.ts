class StorageManager {
    set(key: string, data: any) {
      try {
        wx.setStorageSync(key, data)
        return true
      } catch (error) {
        console.error('Storage set failed:', error)
        return false
      }
    }
  
    get(key: string) {
      try {
        return wx.getStorageSync(key)
      } catch (error) {
        console.error('Storage get failed:', error)
        return null
      }
    }
  
    remove(key: string) {
      try {
        wx.removeStorageSync(key)
        return true
      } catch (error) {
        console.error('Storage remove failed:', error)
        return false
      }
    }
  
    clear() {
      try {
        wx.clearStorageSync()
        return true
      } catch (error) {
        console.error('Storage clear failed:', error)
        return false
      }
    }
  
    // 特定数据存储方法
    setUserInfo(userInfo: any) {
      return this.set('userInfo', userInfo)
    }
  
    getUserInfo() {
      return this.get('userInfo')
    }
  
    setMedications(medications: any[]) {
      return this.set('medications', medications)
    }
  
    getMedications() {
      return this.get('medications') || []
    }
  
    setAssessmentHistory(history: any[]) {
      return this.set('assessmentHistory', history)
    }
  
    getAssessmentHistory() {
      return this.get('assessmentHistory') || []
    }
  }
  
  export const storageManager = new StorageManager()