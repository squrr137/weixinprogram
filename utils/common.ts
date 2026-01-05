// 通用工具函数
export class CommonUtils {
    static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      
      return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
    }
  
    static debounce(func: Function, wait: number) {
      let timeout: number | null = null
      return function executedFunction(...args: any[]) {
        const later = () => {
          timeout = null
          func(...args)
        }
        if (timeout !== null) {
          clearTimeout(timeout)
        }
        timeout = setTimeout(later, wait) as unknown as number
      }
    }
  
    static validateEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
  
    static validatePhone(phone: string): boolean {
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(phone)
    }
  
    static deepClone(obj: any): any {
      return JSON.parse(JSON.stringify(obj))
    }
  
    static getRandomMotivation(): string {
      const motivations = [
        '每一次按时服药都是对自己健康的负责，您做得很好！',
        '康复之路虽长，但您走的每一步都算数，继续坚持！',
        '您的坚持是康复的最大动力，今天也要为自己骄傲！',
        '风雨过后总见彩虹，您的努力终将换来更好的自己！',
        '每一天的坚持都在让您变得更强大，继续加油！'
      ]
      return motivations[Math.floor(Math.random() * motivations.length)]
    }
  }
  
  // 微信API封装
  export class WxUtils {
    static showLoading(title: string = '加载中...') {
      wx.showLoading({ title, mask: true })
    }
  
    static hideLoading() {
      wx.hideLoading()
    }
  
    static showToast(title: string, icon: 'success' | 'error' | 'loading' | 'none' = 'none') {
      wx.showToast({ title, icon, duration: 2000 })
    }
  
    static showModal(title: string, content: string, showCancel: boolean = true) {
      return new Promise((resolve) => {
        wx.showModal({
          title,
          content,
          showCancel,
          success: (res) => {
            resolve(res.confirm)
          }
        })
      })
    }
  }