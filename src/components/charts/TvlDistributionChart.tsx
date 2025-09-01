import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

interface TvlDistributionDataPoint {
  category: string;
  value: number;
}

interface TvlDistributionChartProps {
  data: TvlDistributionDataPoint[];
  height?: string | number;
}

const TvlDistributionChart: React.FC<TvlDistributionChartProps> = ({ 
  data = [], 
  height = 200 
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  // 计算总值用于百分比计算
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  // 按值排序并取前10个最大的类别
  const sortedData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // 为其他类别合并剩余数据
  const otherData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(10);
  const otherValue = otherData.reduce((sum, item) => sum + item.value, 0);
  const otherCategories = otherData.map(item => item.category).join(', ');

  const chartData = sortedData.map(item => ({
    name: item.category,
    value: item.value,
    percentage: ((item.value / totalValue) * 100).toFixed(1)
  }));

  // 如果有其他类别，添加到图表中
  if (otherValue > 0) {
    chartData.push({
      name: 'Others',
      value: otherValue,
      percentage: ((otherValue / totalValue) * 100).toFixed(1)
    });
  }

  // 不设置默认选中，需要用户点击才显示信息

  // 生成颜色数组
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
    '#64748B'
  ];

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: function(params: any) {
        if (params.name === 'Others') {
          const totalCount = otherData.length;
          return `${params.name}<br/>TVL: $${(params.value / 1000000).toFixed(2)}M<br/>占比: ${params.percent}%<br/>包含 ${totalCount} 个类别`;
        }
        return `${params.name}<br/>TVL: $${(params.value / 1000000).toFixed(2)}M<br/>占比: ${params.percent}%`;
      }
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        center: ['50%', '50%'],
        data: chartData,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        color: colors
      }
    ],
    animation: true
  }), [chartData, colors]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default TvlDistributionChart; 