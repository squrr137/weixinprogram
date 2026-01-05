// 通用类型定义
export interface Medication {
    id: number
    name: string
    dose: string
    time: string
    taken: boolean
    stock: number
    enabled?: boolean
  }
  
  export interface UserInfo {
    nickName: string
    avatarUrl: string
  }
  
  export interface AssessmentResult {
    type: string
    date: string
    score: number
  }
  
  // 微信小程序扩展类型
  declare global {
    namespace NodeJS {
      interface Timeout {}
    }
  }