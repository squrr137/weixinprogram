interface KnowledgeItem {
    id: number
    title: string
    description: string
    type: 'video' | 'article'
    duration?: string
    readCount: number
    category: string
  }
  
  interface QuizQuestion {
    id: number
    question: string
    options: string[]
    correct: number
  }
  
  interface CommonMyth {
    id: number
    myth: string
    truth: string
  }
  
  Page({
    data: {
      searchKeyword: '',
      currentCategory: 'basic',
      categories: [
        { id: 'basic', name: '基础知识' },
        { id: 'safety', name: '用药安全' },
        { id: 'sideEffects', name: '副作用管理' },
        { id: 'interaction', name: '药物相互作用' }
      ],
      knowledgeBase: [] as KnowledgeItem[],
      filteredKnowledge: [] as KnowledgeItem[],
      quizQuestions: [] as QuizQuestion[],
      commonMyths: [] as CommonMyth[]
    },
  
    onLoad() {
      this.loadKnowledgeData()
      this.loadQuizQuestions()
      this.loadCommonMyths()
    },
  
    loadKnowledgeData() {
      // 模拟知识库数据
      const knowledgeBase: KnowledgeItem[] = [
        {
          id: 1,
          title: '正确服药方法',
          description: '学习如何正确服用各种剂型的药物',
          type: 'video',
          duration: '5分钟',
          readCount: 156,
          category: 'basic'
        },
        {
          id: 2,
          title: '药物副作用识别',
          description: '了解常见副作用及应对方法',
          type: 'article', 
          readCount: 89,
          category: 'sideEffects'
        },
        {
          id: 3,
          title: '药物相互作用指南',
          description: '了解不同药物之间的相互作用',
          type: 'article',
          readCount: 67,
          category: 'interaction'
        }
      ]
      this.setData({ 
        knowledgeBase,
        filteredKnowledge: knowledgeBase 
      })
    },
  
    loadQuizQuestions() {
      const questions: QuizQuestion[] = [
        {
          id: 1,
          question: '忘记服药时应该怎么办？',
          options: ['立即补服', '下次加倍服用', '跳过这次', '咨询医生'],
          correct: 3
        },
        {
          id: 2,
          question: '哪种服药方式是正确的？',
          options: ['用茶水送服', '空腹服用', '与酒精同服', '按医嘱服用'],
          correct: 3
        },
        {
          id: 3,
          question: '药物副作用出现时应该？',
          options: ['立即停药', '忍耐不适', '咨询医生', '自行减量'],
          correct: 2
        }
      ]
      this.setData({ quizQuestions: questions })
    },
  
    loadCommonMyths() {
      const myths: CommonMyth[] = [
        {
          id: 1,
          myth: '感觉好了就可以停药',
          truth: '精神类药物需要按医嘱持续服用，擅自停药可能导致症状复发'
        },
        {
          id: 2, 
          myth: '药物会让人上瘾',
          truth: '在医生指导下规范使用精神类药物，成瘾风险很低'
        },
        {
          id: 3,
          myth: '副作用说明药物不适合自己',
          truth: '很多副作用是暂时的，身体适应后会减轻或消失'
        }
      ]
      this.setData({ commonMyths: myths })
    },
  
    onSearchInput(e: any) {
      const keyword = e.detail.value
      this.setData({ searchKeyword: keyword })
      this.filterKnowledge()
    },
  
    switchCategory(e: any) {
      const category = e.currentTarget.dataset.category
      this.setData({ currentCategory: category })
      this.filterKnowledge()
    },
  
    filterKnowledge() {
      const { knowledgeBase, searchKeyword, currentCategory } = this.data
      let filtered = knowledgeBase
  
      if (searchKeyword) {
        filtered = filtered.filter((item: KnowledgeItem) => 
          item.title.includes(searchKeyword) || 
          item.description.includes(searchKeyword)
        )
      }
  
      if (currentCategory) {
        filtered = filtered.filter((item: KnowledgeItem) => item.category === currentCategory)
      }
  
      this.setData({ filteredKnowledge: filtered })
    },
  
    viewDetail(e: any) {
      const item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/education/detail/detail?id=${item.id}`
      })
    },
  
    onQuizCompleted(e: any) {
      const score = e.detail.score
      const total = e.detail.total
      wx.showModal({
        title: '测验完成',
        content: `您的得分：${score}/${total}`,
        showCancel: false
      })
    }
  })