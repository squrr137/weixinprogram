// 定义组件实例的接口，告诉 TS 我们有哪些自定义属性
interface ChartInstance {
  properties: {
    data: any;
    type: string;
  };
  data: any;
  // 自定义私有属性
  _canvas: any;
  _ctx: any;
  _dpr: number;
  _width: number;
  _height: number;
  // 方法定义
  initChart: () => void;
  draw: () => void;
  drawLine: (ctx: any, dataset: any, padding: number, w: number, h: number) => void;
  // 原生方法类型补充
  createSelectorQuery: () => WechatMiniprogram.SelectorQuery;
  setData: (data: any) => void;
}

Component({
  properties: {
    data: {
      // ✅ 修复：添加 'as any' 绕过严格类型检查
      type: Object as any, 
      // 或者使用 value: {} 避免 null 类型冲突，但 as any 最直接
      value: null, 
      observer: function () {
        (this as unknown as ChartInstance).initChart();
      }
    },

    color: {
      type: String,
      value: '#007AFF' 
    },

    type: {
      type: String,
      value: 'line'
    }
  },

  lifetimes: {
    created() {
      // 初始化私有变量
      const self = this as unknown as ChartInstance;
      self._canvas = null;
      self._ctx = null;
      self._dpr = 1;
      self._width = 0;
      self._height = 0;
    },
    ready() {
      (this as unknown as ChartInstance).initChart();
    }
  },

  methods: {
    initChart() {
      const self = this as unknown as ChartInstance;
      const { data } = self.properties;
      
      // 安全检查
      if (!data || !data.labels || data.labels.length === 0) return;

      // 如果已经获取过 canvas，直接重绘
      if (self._canvas && self._ctx) {
        self.draw();
        return;
      }

      // 获取 Canvas 2D 节点
      const query = self.createSelectorQuery();
      query.select('#myCanvas')
        .fields({ node: true, size: true })
        .exec((res: any) => { // 显式给 res 加 any 类型，解决报错
          if (!res[0] || !res[0].node) return;

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getSystemInfoSync().pixelRatio;

          // 处理高清屏模糊问题
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);

          // 保存到实例上
          self._canvas = canvas;
          self._ctx = ctx;
          self._dpr = dpr;
          self._width = res[0].width;  // 记录逻辑宽度
          self._height = res[0].height; // 记录逻辑高度

          self.draw();
        });
    },

    draw() {
      const self = this as unknown as ChartInstance;
      if (!self._ctx) return;
      
      const ctx = self._ctx;
      const { data, type } = self.properties;
      
      const width = self._width; 
      const height = self._height;
      const padding = 30;
      
      const chartWidth = width - 2 * padding;
      const chartHeight = height - 2 * padding;

      // 清空画布
      ctx.clearRect(0, 0, width, height);

      // --- 1. 绘制坐标轴 ---
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();

      // --- 2. 绘制 X 轴文字 ---
      ctx.fillStyle = '#999999';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const xDivisor = data.labels.length > 1 ? data.labels.length - 1 : 1;
      data.labels.forEach((label: string, index: number) => {
        const x = padding + (index * chartWidth) / xDivisor;
        ctx.fillText(label, x, height - padding + 8);
      });

      // --- 3. 绘制数据 ---
      if (type === 'line') {
        self.drawLine(ctx, data.datasets[0], padding, chartWidth, chartHeight);
      }
    },

    drawLine(ctx: any, dataset: any, padding: number, w: number, h: number) {
      if (!dataset || !dataset.values) return;
      
      let max = Math.max(...dataset.values);
      if (max <= 0) max = 100;
      max = max * 1.2; 

      // 获取当前组件设定的颜色
      const color:any = (this as unknown as ChartInstance).properties;

      const count = dataset.values.length;
      const step = count > 1 ? w / (count - 1) : 0;

      // 画折线
      ctx.beginPath();
      ctx.strokeStyle = color; // ✅ 使用传入的颜色
      ctx.lineWidth = 2;

      dataset.values.forEach((val: number, i: number) => {
        const x = padding + i * step;
        const y = padding + h - (val / max) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // 画数据点
      dataset.values.forEach((val: number, i: number) => {
        const x = padding + i * step;
        const y = padding + h - (val / max) * h;
        
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });
    }
  }
});