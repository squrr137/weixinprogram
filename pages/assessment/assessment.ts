interface Assessment {
    type: string
    questions?: any[]
  }
  
  interface AssessmentResult {
    type: string
    date: string
    score: number
  }
  
  interface LastScores {
    medicationKnowledge?: number
    adherence?: number
    symptom?: string
  }
  
  interface AssessmentTitles {
    [key: string]: string
  }
  
  Page({
    data: {
      lastScores: {
        medicationKnowledge: 85,
        adherence: 78,
        symptom: '良好'
      } as LastScores,
      currentAssessment: null as Assessment | null,
      currentQuestions: [] as any[],
      assessmentCompleted: false,
      currentScore: 0,
      totalQuestions: 0,
      resultAnalysis: '',
      recommendations: [] as string[],
      assessmentHistory: [] as AssessmentResult[],
      assessmentTitles: {
        medicationKnowledge: '药物素养测评',
        adherence: '服药依从性测评',
        symptom: '症状自评'
      } as AssessmentTitles
    },
  
    onLoad() {
      this.loadAssessmentHistory()
    },
  
    loadAssessmentHistory() {
      // 加载历史评估记录
      const history = wx.getStorageSync('assessmentHistory') || []
      this.setData({ assessmentHistory: history })
    },
  
    startAssessment(e: any) {
      const type = e.currentTarget.dataset.type
      const questions = this.getQuestionsByType(type)
      
      this.setData({
        currentAssessment: { type, questions },
        currentQuestions: questions,
        assessmentCompleted: false,
        currentScore: 0,
        totalQuestions: questions.length
      })
    },
  
    getQuestionsByType(type: string) {
      const questionSets: { [key: string]: any[] } = {
        medicationKnowledge: [
          {
            id: 1,
            question: '忘记服药时应该怎么办？',
            options: ['立即补服', '下次加倍服用', '跳过这次', '咨询医生或药师'],
            correct: 3
          },
          {
            id: 2,
            question: '哪种服药方式是正确的？',
            options: ['用茶水送服', '空腹服用所有药物', '与酒精同服', '按医嘱规定服用'],
            correct: 3
          },
          {
            id: 3,
            question: '药物副作用出现时应该？',
            options: ['立即停药', '忍耐不适', '咨询医生', '自行减量'],
            correct: 2
          }
        ],
        adherence: [
          {
            id: 1,
            question: '过去一周内，您是否有忘记服药的经历？',
            options: ['从未忘记', '偶尔忘记(1-2次)', '有时忘记(3-4次)', '经常忘记(5次以上)'],
            correct: 0
          },
          {
            id: 2,
            question: '过去一周内，您是否因为感觉好转而自行减量或停药？',
            options: ['从未', '偶尔', '有时', '经常'],
            correct: 0
          },
          {
            id: 3,
            question: '您觉得按时服药有困难吗？',
            options: ['完全没有困难', '有点困难', '比较困难', '非常困难'],
            correct: 0
          }
        ],
        symptom: [
          {
            id: 1,
            question: '最近一周，您的情绪状态如何？',
            options: ['很好', '较好', '一般', '较差', '很差'],
            correct: 0
          },
          {
            id: 2,
            question: '最近一周，您的睡眠质量如何？',
            options: ['很好', '较好', '一般', '较差', '很差'],
            correct: 0
          }
        ]
      }
  
      return questionSets[type] || []
    },
  
    onAssessmentCompleted(e: any) {
      const score = e.detail.score
      const total = this.data.currentQuestions.length
      const percentage = Math.round((score / total) * 100)
      
      const { analysis, recommendations } = this.generateRecommendations(
        this.data.currentAssessment?.type || '', 
        percentage
      )
  
      // 保存评估记录
      this.saveAssessmentResult(percentage)
  
      this.setData({
        assessmentCompleted: true,
        currentScore: score,
        resultAnalysis: analysis,
        recommendations: recommendations
      })
    },
  
    generateRecommendations(type: string, score: number) {
      let analysis = ''
      let recommendations: string[] = []
  
      if (type === 'medicationKnowledge') {
        if (score >= 80) {
          analysis = '您的药物知识掌握得很好，继续保持！'
          recommendations = [
            '定期复习药物知识',
            '关注药物更新信息',
            '与医生保持沟通'
          ]
        } else if (score >= 60) {
          analysis = '您的药物知识掌握得不错，但还有提升空间'
          recommendations = [
            '重点学习药物副作用管理',
            '了解药物相互作用',
            '参加药物知识培训'
          ]
        } else {
          analysis = '建议加强药物知识学习，提高用药安全性'
          recommendations = [
            '系统学习用药基础知识',
            '观看正确服药方法视频',
            '咨询医生或药师'
          ]
        }
      } else if (type === 'adherence') {
        if (score >= 80) {
          analysis = '您的服药依从性很好，请继续保持！'
          recommendations = [
            '维持良好的服药习惯',
            '继续使用提醒功能',
            '定期进行自我评估'
          ]
        } else if (score >= 60) {
          analysis = '您的服药依从性尚可，但需要改进'
          recommendations = [
            '设置更多服药提醒',
            '建立服药打卡习惯',
            '寻求家属监督支持'
          ]
        } else {
          analysis = '您的服药依从性需要重点关注和改进'
          recommendations = [
            '启用智能提醒功能',
            '设置家属监督',
            '咨询医生调整治疗方案'
          ]
        }
      }
  
      return { analysis, recommendations }
    },
  
    saveAssessmentResult(score: number) {
      if (!this.data.currentAssessment) return
  
      const historyItem: AssessmentResult = {
        type: this.data.assessmentTitles[this.data.currentAssessment.type] || this.data.currentAssessment.type,
        date: new Date().toISOString().split('T')[0],
        score: score
      }
  
      const history = [historyItem, ...this.data.assessmentHistory]
      this.setData({ assessmentHistory: history })
      wx.setStorageSync('assessmentHistory', history)
    },
  
    viewDetailedReport() {
      wx.navigateTo({
        url: '/pages/assessment/report/report'
      })
    },
  
    retakeAssessment() {
      this.setData({
        assessmentCompleted: false,
        currentScore: 0
      })
    },
  
    goToEducationCenter() {
      wx.switchTab({
        url: '/pages/education/education'
      })
    },
  
    getScoreClass(score: number) {
      if (score >= 80) return 'excellent'
      if (score >= 60) return 'good'
      if (score >= 40) return 'fair'
      return 'poor'
    }
  })