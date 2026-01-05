Page({
    data: {
      currentTab: 'posts',
      posts: [
        {
          id: 1,
          username: '匿名用户',
          avatar: '/images/avatar_anonymous.png',
          time: '2小时前',
          content: '今天按时服药了，感觉状态不错，继续坚持！',
          likes: 5,
          comments: 2
        },
        {
          id: 2,
          username: '阳光心态',
          avatar: '/images/avatar_anonymous.png', 
          time: '5小时前',
          content: '分享一个放松心情的小技巧：深呼吸+冥想，真的很有效！',
          likes: 12,
          comments: 3
        }
      ],
      recoveryStories: [
        {
          id: 1,
          title: '我的康复之路：从低谷到阳光',
          author: '勇敢的心',
          excerpt: '经过一年的规范治疗和坚持服药，我终于找回了生活的色彩...',
          readCount: 156,
          likeCount: 34
        }
      ],
      expertQA: [
        {
          id: 1,
          question: '服药后感觉困倦怎么办？',
          answer: '这是常见的副作用，通常会在2-3周后减轻。建议在睡前服药，避免影响白天活动。',
          expert: '张医生',
          department: '精神科'
        }
      ],
      onlineExperts: [
        {
          id: 1,
          name: '张医生',
          department: '精神科',
          avatar: '/images/doctor_avatar.png',
          online: true
        },
        {
          id: 2,
          name: '李心理师',
          department: '心理咨询',
          avatar: '/images/psychologist_avatar.png', 
          online: false
        }
      ]
    },
  
    onLoad() {
      this.loadCommunityData()
    },
  
    loadCommunityData() {
      // 加载社区数据
    },
  
    switchTab(e: any) {
      const tab = e.currentTarget.dataset.tab
      this.setData({ currentTab: tab })
    },
  
    createPost() {
      wx.navigateTo({
        url: '/pages/community/create/create'
      })
    },
  
    likePost(e: any) {
      const postId = e.currentTarget.dataset.id
      const posts = this.data.posts.map(post => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 }
        }
        return post
      })
      this.setData({ posts })
      
      wx.showToast({
        title: '点赞成功',
        icon: 'success'
      })
    },
  
    commentPost(e: any) {
      const postId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/community/comments/comments?postId=${postId}`
      })
    },
  
    sharePost(e: any) {
      const postId = e.currentTarget.dataset.id
      const post = this.data.posts.find(p => p.id === postId)
      
      if (post) {
        // 启用分享功能
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        })
        
        // 提示用户如何分享
        wx.showModal({
          title: '分享',
          content: '请点击右上角"..."按钮分享此内容',
          showCancel: false,
          confirmText: '知道了'
        })
      }
    },
  
    // 处理页面分享
    onShareAppMessage() {
      return {
        title: '精神健康社区分享',
        path: '/pages/community/community',
        imageUrl: '/images/share-community.png'
      }
    },
  
    // 分享到朋友圈
    onShareTimeline() {
      return {
        title: '精神健康支持社区 - 互相鼓励，共同成长',
        query: '',
        imageUrl: '/images/share-community.png'
      }
    },
  
    viewStory(e: any) {
      const storyId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/community/story/story?id=${storyId}`
      })
    },
  
    // 复制内容到剪贴板
    copyContent(e: any) {
      const content = e.currentTarget.dataset.content
      wx.setClipboardData({
        data: content,
        success: () => {
          wx.showToast({
            title: '内容已复制',
            icon: 'success'
          })
        }
      })
    },
  
    // 举报内容
    reportContent(e: any) {
      const postId = e.currentTarget.dataset.id
      wx.showModal({
        title: '举报内容',
        content: '请选择举报原因',
        editable: true,
        placeholderText: '请输入举报原因...',
        success: (res) => {
          if (res.confirm && res.content) {
            wx.showToast({
              title: '举报已提交',
              icon: 'success'
            })
            console.log('举报内容:', postId, res.content)
          }
        }
      })
    }
  })