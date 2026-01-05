export class AssessmentManager {
    static calculateMMAS8Score(answers: number[]) {
      // MMAS-8量表计分逻辑
      let score = 0
      
      // 问题1-4：是=0分，否=1分
      for (let i = 0; i < 4; i++) {
        score += answers[i] === 0 ? 1 : 0
      }
      
      // 问题5-7：从不/很少=1分，偶尔=0.75分，有时=0.5分，经常=0.25分，总是=0分
      const weights = [1, 0.75, 0.5, 0.25, 0]
      for (let i = 4; i < 7; i++) {
        score += weights[answers[i]] || 0
      }
      
      // 问题8：从不/很少=0分，偶尔=0.25分，有时=0.5分，经常=0.75分，总是=1分
      const weight8 = [0, 0.25, 0.5, 0.75, 1]
      score += weight8[answers[7]] || 0
      
      return Math.min(8, score)
    }
  
    static interpretMMAS8Score(score: number) {
      if (score === 8) {
        return { level: '高', description: '完全依从' }
      } else if (score >= 6 && score < 8) {
        return { level: '中', description: '部分依从' }
      } else if (score < 6) {
        return { level: '低', description: '不依从' }
      }
      return { level: '未知', description: '评分异常' } // 添加默认返回值
    }
  
    static generateRecommendations(score: number, type: string) {
      const recommendations = []
      
      if (type === 'adherence') {
        if (score < 6) {
          recommendations.push(
            '启用智能服药提醒功能',
            '设置家属监督提醒',
            '咨询医生调整用药方案',
            '参加用药依从性培训'
          )
        } else if (score < 8) {
          recommendations.push(
            '继续使用服药提醒',
            '建立服药打卡习惯', 
            '定期进行自我评估',
            '与医生保持沟通'
          )
        } else {
          recommendations.push(
            '继续保持良好习惯',
            '帮助其他病友',
            '定期复查评估'
          )
        }
      } else if (type === 'medicationKnowledge') {
        if (score < 60) {
          recommendations.push(
            '系统学习用药基础知识',
            '观看正确服药方法视频',
            '参加药物知识小测验',
            '咨询医生或药师'
          )
        } else if (score < 80) {
          recommendations.push(
            '重点学习药物副作用管理',
            '了解药物相互作用知识',
            '定期复习药物信息'
          )
        } else {
          recommendations.push(
            '关注药物更新信息',
            '分享用药经验',
            '继续学习进阶知识'
          )
        }
      }
      
      return recommendations
    }
  
    static shouldAlertDoctor(score: number, type: string) {
      if (type === 'adherence' && score < 4) {
        return true
      }
      if (type === 'symptom' && score < 40) {
        return true
      }
      return false
    }
  }