import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { usePriceData, PriceDataPoint } from '@/hooks/usePriceData';
import ChartContainer from './ChartContainer';

interface KlineDataPoint {
  openTime: number;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  closePrice: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  takerBuyVolume: string;
  takerBuyQuoteVolume: string;
}

interface PriceChartProps {
  data?: PriceDataPoint[];
  klineData?: KlineDataPoint[];
  loading?: boolean;
  height?: string | number;
  symbol?: string;
  days?: number;
  useApi?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data = [], 
  klineData = [],
  loading: externalLoading = false, 
  height = 144,
  symbol = 'BTC',
  days = 30,
  useApi = false
}) => {
  // 使用API数据或传入的数据
  const { data: apiData, loading: apiLoading, error } = usePriceData({
    symbol,
    days,
    enabled: useApi
  });

  const isLoading = externalLoading || apiLoading;
  
  // 优先使用K线数据，然后是API数据，最后是传入的数据或模拟数据
  let chartData: PriceDataPoint[] = [];
  
  if (klineData.length > 0) {
    chartData = klineData.map(item => ({
      date: new Date(item.openTime).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).replace('/', '.'),
      price: parseFloat(item.closePrice)
    }));
  } else if (useApi && apiData) {
    chartData = apiData;
  } else if (data.length > 0) {
    chartData = data;
  } else {
    chartData = generateMockData();
  }

  const option = {
    grid: { 
      left: 0, 
      right: 0, 
      top: 0, 
      bottom: 0, 
      containLabel: false 
    },
    tooltip: { 
      trigger: "axis", 
      axisPointer: { type: "line" }, 
      borderWidth: 0 
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.map(item => item.date),
      show: false
    },
    yAxis: {
      type: 'value',
      min: Math.min(...chartData.map(item => item.price)) * 0.95,
      max: Math.max(...chartData.map(item => item.price)) * 1.05,
      show: false
    },
    series: [
      {
        data: chartData.map(item => item.price),
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#F67C00',
          width: 1
        },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(246,124,0,0.25)" },
            { offset: 1, color: "rgba(246,124,0,0.00)" },
          ])
        },
        emphasis: { disabled: true }
      }
    ],
    animation: true
  };

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

// 生成30天的模拟数据
function generateMockData(): PriceDataPoint[] {
  const data: PriceDataPoint[] = [];
  const basePrice = 35000;
  const volatility = 0.1;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // 生成随机价格波动
    const change = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + change);
    
    // 使用更简洁的日期格式，类似PanelTvlChat
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    data.push({
      date: `${month}.${day}`,
      price: Math.round(price * 100) / 100
    });
  }
  
  return data;
}

export default PriceChart; 