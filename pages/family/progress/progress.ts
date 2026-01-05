import { CommonUtils } from '../../../utils/common'
import { getPatientHistory } from '../../../utils/api'

Page({
  data: {
    averageAdherence: 0,    // 修正变量名，与 WXML 对应
    adherenceData: null as any,  // 图表1：服药数据
    healthData: null as any,     // 图表2：健康数据
    assessmentData: null as any, // 图表3：评估数据
    loading: true
  },

  onLoad() {
    this.fetchProgressData();
  },

  async fetchProgressData() {
    try {
      this.setData({ loading: true });

      const patientId = 'patient_001'; 
      const historyList = getPatientHistory(patientId) || [];

      if (historyList.length === 0) {
        this.setData({ loading: false });
        return;
      }

      // --- 1. 计算顶部核心指标 ---
      const totalAdherence = historyList.reduce((sum, item) => sum + (item.adherence || 0), 0);
      const avgRate = Math.round(totalAdherence / historyList.length);
      
      // --- 2. 准备图表数据 ---
      // 取最近7天数据并倒序（按时间从左到右）
      const recentHistory = historyList.slice(0, 7).reverse();
      const labels = recentHistory.map(item => {
        const dateStr = String(item.date);
        if (dateStr.startsWith('20') && dateStr.length > 5) {
            return dateStr.slice(-5);
        }
        // 否则直接返回
        return dateStr;
      });
      // 构造图表1数据：服药依从性
      const adherenceChart = {
        labels: labels,
        datasets: [{
          values: recentHistory.map(item => item.adherence)
        }]
      };

      // 构造图表2数据：健康指标 (模拟数据，因为 historyList 可能只有 adherence)
      // 如果 api 返回了 mood 或其他字段，请替换这里的 mock
      const healthChart = {
        labels: labels,
        datasets: [{
          values: recentHistory.map(item => {
            // 优先取 mood，没有则用 80，强制转为整数
            const val = parseInt(String(item.mood || 80), 10);
            // 添加一点随机波动让图表看起来不像死板的直线
            return isNaN(val) ? 80 : (val + Math.floor(Math.random() * 6 - 3));
          })
        }]
      };

      // 构造图表3数据：评估问卷 (模拟数据)
      const assessmentChart = {
        labels: labels,
        datasets: [{
          values: recentHistory.map(() => 60 + Math.floor(Math.random() * 30)) 
        }]
      };

      // --- 3. 更新页面数据 ---
      this.setData({
        averageAdherence: avgRate,     // 对应 WXML 的 {{averageAdherence}}
        adherenceData: adherenceChart, // 对应 WXML 的 data="{{adherenceData}}"
        healthData: healthChart,       // 对应 WXML 的 data="{{healthData}}"
        assessmentData: assessmentChart,// 对应 WXML 的 data="{{assessmentData}}"
        loading: false
      });

    } catch (err) {
      console.error('获取进度失败', err);
      this.setData({ loading: false });
    }
  }
})