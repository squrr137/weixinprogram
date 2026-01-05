Component({
    properties: {
      content: {
        type: String,
        value: '',
        observer: function(newVal: string) {
          this.checkContentSecurity(newVal)
        }
      }
    },
  
    data: {
      showAlert: false
    },
  
    methods: {
      checkContentSecurity(content: string) {
        const sensitiveWords = ['自杀', '自残', '暴力', '毒品'] // 示例敏感词
        const hasSensitiveContent = sensitiveWords.some(word => content.includes(word))
        
        this.setData({ showAlert: hasSensitiveContent })
        
        if (hasSensitiveContent) {
          this.triggerEvent('securityAlert', { 
            content: content,
            hasSensitiveContent: true
          })
        }
      }
    }
  })