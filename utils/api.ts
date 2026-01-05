const BASE_URL = 'https://your-api-domain.com/api'

class ApiClient {
  private token: string = ''

  setToken(token: string) {
    this.token = token
  }

  async request(endpoint: string, options: any = {}) {
    const url = `${BASE_URL}${endpoint}`
    const config = {
      url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': this.token ? `Bearer ${this.token}` : '',
        ...options.header
      }
    }

    try {
      const response = await new Promise<any>((resolve, reject) => {
        wx.request({
          ...config,
          success: (res: any) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(res.data)
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${res.data?.message || '请求失败'}`))
            }
          },
          fail: reject
        })
      })
      return response
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // 用户相关
  async login(credentials: any) {
    return this.request('/auth/login', { method: 'POST', data: credentials })
  }

  async getUserInfo() {
    return this.request('/user/info')
  }

  // 药物相关
  async getMedications() {
    return this.request('/medications')
  }

  async updateMedication(id: string, data: any) {
    return this.request(`/medications/${id}`, { method: 'PUT', data })
  }

  // 提醒相关
  async setReminder(reminder: any) {
    return this.request('/reminders', { method: 'POST', data: reminder })
  }

  // 社区相关
  async getPosts() {
    return this.request('/community/posts')
  }

  async createPost(post: any) {
    return this.request('/community/posts', { method: 'POST', data: post })
  }

  // 评估相关
  async submitAssessment(assessment: any) {
    return this.request('/assessments', { method: 'POST', data: assessment })
  }

  async getAssessmentHistory() {
    return this.request('/assessments/history')
  }
}

export const apiClient = new ApiClient()

// mp_02/miniprogram/utils/api.ts

// 1. 定义模拟的患者数据库
export const MOCK_PATIENTS = [
  { 
    id: 'patient_001', 
    name: '张三', 
    age: 45, 
    gender: '男', 
    diagnosis: '精神分裂症', 
    status: '稳定' 
  },
  { 
    id: 'patient_002', 
    name: '李四', 
    age: 32, 
    gender: '女', 
    diagnosis: '双相情感障碍', 
    status: '需关注' 
  },
  { 
    id: 'patient_003', 
    name: '王五', 
    age: 28, 
    gender: '男', 
    diagnosis: '重度抑郁', 
    status: '康复期' 
  }
]

// 2. 模拟根据 ID 获取患者详细信息的接口
export const getPatientById = (id: string) => {
  // 在数组里查找 id 匹配的那一项
  const patient = MOCK_PATIENTS.find(p => p.id === id)
  return patient || null
}

// 3. 模拟获取医生名下所有患者的接口
export const getDoctorPatients = () => {
  return MOCK_PATIENTS
}

// 👇 新增：模拟的药物数据 (关联到 patientId)
// ==========================================
const MOCK_MEDICATIONS: Record<string, any[]> = {
  'patient_001': [ // 张三的药
    { id: 'm1', name: '阿立哌唑 (Aripiprazole)', dose: '10mg', time: '08:00', status: 'taken', instructions: '餐后服用' },
    { id: 'm2', name: '帕罗西汀 (Paroxetine)', dose: '20mg', time: '08:00', status: 'taken', instructions: '餐后服用' },
    { id: 'm3', name: '奥氮平 (Olanzapine)', dose: '5mg', time: '20:00', status: 'pending', instructions: '睡前服用' }
  ],
  'patient_002': [ // 李四的药
    { id: 'm4', name: '碳酸锂 (Lithium Carbonate)', dose: '250mg', time: '09:00', status: 'missed', instructions: '餐中服用' },
    { id: 'm5', name: '奎硫平 (Quetiapine)', dose: '100mg', time: '21:00', status: 'pending', instructions: '睡前服用' }
  ]
}

// 获取某位患者今日的用药清单
export const getPatientMedications = (patientId: string) => {
  return MOCK_MEDICATIONS[patientId] || []
}

//👇 新增：模拟的健康历史记录 (用于家属查看)
// ==========================================
const MOCK_HISTORY: Record<string, any[]> = {
  'patient_001': [
    { id: 101, date: '10月24日', status: 'perfect', mood: '😊 开心', adherence: 100, note: '全天按时服药，表现很棒' },
    { id: 102, date: '10月23日', status: 'good', mood: '😐 平静', adherence: 80, note: '晚上的药晚吃了一小时' },
    { id: 103, date: '10月22日', status: 'warning', mood: '😔 低落', adherence: 50, note: '漏服了一次，情绪不太好' },
    { id: 104, date: '10月21日', status: 'perfect', mood: '😊 开心', adherence: 100, note: '状态稳定' },
  ],
  'patient_002': [
    { id: 201, date: '10月24日', status: 'warning', mood: '😠 烦躁', adherence: 60, note: '拒绝服药，需要劝导' }
  ]
}

// 获取患者的历史健康记录
export const getPatientHistory = (patientId: string) => {
  return MOCK_HISTORY[patientId] || []
}