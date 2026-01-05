

interface Message {
  id: string;
  type: 'text' | 'system';
  content: string;
  isSelf?: boolean;
  senderName?: string;
  avatar?: string;
  timestamp: number;
}

Page({
  data: {
    inputValue: '',
    toView: '', // 用于控制滚动到哪条消息
    messages: [] as Message[],
    // 模拟当前用户信息
    currentUser: {
      id: 'me',
      avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0' // 微信默认灰色头像
    }
  },

  onLoad() {
    this.initMockData();
  },

  // 初始化一些模拟聊天记录
  initMockData() {
    const mockMessages: Message[] = [
      {
        id: 'msg_0',
        type: 'system',
        content: '10:30 病人完成了今日服药',
        timestamp: Date.now() - 3600000
      },
      {
        id: 'msg_1',
        type: 'text',
        content: '爸今天感觉怎么样？',
        isSelf: true,
        avatar: this.data.currentUser.avatar,
        timestamp: Date.now() - 3500000
      },
      {
        id: 'msg_2',
        type: 'text',
        content: '挺好的，刚才护工带我去楼下转了一圈。',
        isSelf: false,
        senderName: '老爸',
        avatar: 'https://api.iconify.design/noto:man-health-worker-light-skin-tone.svg', // 模拟头像
        timestamp: Date.now() - 3400000
      }
    ];

    this.setData({ messages: mockMessages });
    this.scrollToBottom();
  },

  // 监听输入
  onInput(e: any) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息
  sendMessage() {
    const content = this.data.inputValue.trim();
    if (!content) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'text',
      content: content,
      isSelf: true,
      avatar: this.data.currentUser.avatar,
      timestamp: Date.now()
    };

    const updatedMessages = [...this.data.messages, newMessage];

    this.setData({
      messages: updatedMessages,
      inputValue: ''
    });

    this.scrollToBottom();

    // 模拟自动回复 (仅为了演示效果)
    setTimeout(() => {
      this.simulateReply();
    }, 1500);
  },

  // 模拟他人回复
  simulateReply() {
    const replyMsg: Message = {
      id: `msg_${Date.now()}_r`,
      type: 'text',
      content: '收到，我们会注意观察的。',
      isSelf: false,
      senderName: '护工小李',
      avatar: 'https://api.iconify.design/noto:woman-health-worker-light-skin-tone.svg',
      timestamp: Date.now()
    };

    this.setData({
      messages: [...this.data.messages, replyMsg]
    });
    this.scrollToBottom();
  },

  // 滚动到底部
  scrollToBottom() {
    // 稍微延迟以确保视图渲染完成
    setTimeout(() => {
      const lastMsg = this.data.messages[this.data.messages.length - 1];
      if (lastMsg) {
        this.setData({
          toView: `msg-${lastMsg.id}`
        });
      }
    }, 100);
  }
})