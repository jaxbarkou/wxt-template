import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface TvlTrendDataPoint {
  timestamp: number;
  value: number;
}

interface TvlTrendChartProps {
  data: TvlTrendDataPoint[];
  height?: string | number;
}

const TvlTrendChart: React.FC<TvlTrendChartProps> = ({ 
  data = [], 
  height = 144 
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  // 按时间戳排序并格式化数据
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
  
  const chartData = sortedData.map(item => ({
    date: new Date(item.timestamp * 1000).toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit' 
    }).replace('/', '.'),
    value: item.value
  }));

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
      borderWidth: 0,
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>TVL: $${(data.value / 1000000).toFixed(2)}M`;
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.map(item => item.date),
      show: false
    },
    yAxis: {
      type: 'value',
      min: Math.min(...chartData.map(item => item.value)) * 0.95,
      max: Math.max(...chartData.map(item => item.value)) * 1.05,
      show: false
    },
    series: [
      {
        data: chartData.map(item => item.value),
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#10B981',
          width: 1
        },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(16,185,129,0.25)" },
            { offset: 1, color: "rgba(16,185,129,0.00)" },
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

export default TvlTrendChart; 