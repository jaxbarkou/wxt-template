import React from 'react';
import ReactECharts from 'echarts-for-react';
import { usePriceData, PriceDataPoint } from '@/hooks/usePriceData';
import ChartContainer from './ChartContainer';

interface PriceChartProps {
  data?: PriceDataPoint[];
  loading?: boolean;
  height?: string | number;
  symbol?: string;
  days?: number;
  useApi?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data = [], 
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
  const chartData = useApi ? apiData : (data.length > 0 ? data : generateMockData());

  const option = {
    grid: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => item.date),
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        data: chartData.map(item => item.price),
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#3B82F6',
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.2)'
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.02)'
              }
            ]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: '#3B82F6'
          }
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      borderRadius: 8,
      textStyle: {
        color: '#374151',
        fontSize: 12
      },
      formatter: (params: any) => {
        const data = params[0];
        const date = new Date(data.axisValue).toLocaleDateString();
        const price = data.value.toFixed(2);
        return `
          <div style="padding: 10px;">
            <div style="font-weight: 600; margin-bottom: 6px; color: #374151;">${date}</div>
            <div style="color: #3B82F6; font-size: 14px; font-weight: 600;">$${price}</div>
          </div>
        `;
      }
    }
  };

  return (
    <ChartContainer 
      title="30 days price trend"
      loading={isLoading}
      error={error}
      className="mb-2"
    >
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </ChartContainer>
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
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100
    });
  }
  
  return data;
}

export default PriceChart; 