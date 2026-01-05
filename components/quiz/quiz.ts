interface QuizQuestion {
    id: number
    question: string
    options: string[]
    correct: number
  }
  
  Component({
    properties: {
      questions: {
        type: Array,
        value: [] as QuizQuestion[]
      },
      moduleId: {
        type: String,
        value: ''
      }
    },
  
    data: {
      current: 0,
      selectedOption: null as number | null,
      completed: false,
      score: 0,
      optionLabels: ['A', 'B', 'C', 'D']
    },
  
    observers: {
      'questions': function(questions: QuizQuestion[]) {
        if (questions && questions.length > 0) {
          this.setData({
            current: 0,
            selectedOption: null,
            completed: false,
            score: 0
          })
        }
      }
    },
  
    methods: {
      selectOption(e: any) {
        const index = e.currentTarget.dataset.index
        this.setData({ selectedOption: index })
      },
  
      nextQuestion() {
        if (this.data.selectedOption === null) return
  
        // 检查答案
        const currentQuestion = this.data.questions[this.data.current]
        if (this.data.selectedOption === currentQuestion.correct) {
          this.setData({ score: this.data.score + 1 })
        }
  
        if (this.data.current < this.data.questions.length - 1) {
          this.setData({
            current: this.data.current + 1,
            selectedOption: null
          })
        } else {
          this.setData({ completed: true })
          this.triggerEvent('completed', { 
            score: this.data.score,
            total: this.data.questions.length,
            moduleId: this.properties.moduleId
          })
        }
      },
  
      // 添加获取当前问题的方法 - 修复语法
      getCurrentQuestion(): QuizQuestion {
        return this.data.questions[this.data.current] || { 
          id: 0, 
          question: '', 
          options: [], 
          correct: 0 
        }
      }
    }
  })