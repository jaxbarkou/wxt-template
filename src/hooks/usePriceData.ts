import { useState, useEffect, useCallback } from 'react';

export interface PriceDataPoint {
  date: string;
  price: number;
  volume?: number;
}

interface UsePriceDataProps {
  symbol?: string;
  days?: number;
  enabled?: boolean;
}

export const usePriceData = ({ 
  symbol = 'BTC', 
  days = 30, 
  enabled = true 
}: UsePriceDataProps = {}) => {
  const [data, setData] = useState<PriceDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 模拟API调用获取价格数据
  const fetchPriceData = useCallback(async () => {
    if (!enabled || !symbol) return;

    setLoading(true);
    setError(null);

    try {
      // 这里可以替换为真实的API调用
      // const response = await fetch(`/api/price/${symbol}?days=${days}`);
      // const result = await response.json();
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成模拟数据
      const mockData = generatePriceData(symbol, days);
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取价格数据失败');
    } finally {
      setLoading(false);
    }
  }, [symbol, days, enabled]);

  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  return {
    data,
    loading,
    error,
    refetch: fetchPriceData
  };
};

// 生成更真实的模拟价格数据
function generatePriceData(symbol: string, days: number): PriceDataPoint[] {
  const data: PriceDataPoint[] = [];
  const basePrice = symbol === 'BTC' ? 35000 : 2000;
  const volatility = 0.08;
  let currentPrice = basePrice;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // 生成更真实的价格波动（有趋势性）
    const trend = Math.sin(i / 10) * 0.02; // 添加周期性趋势
    const random = (Math.random() - 0.5) * volatility;
    const change = trend + random;
    
    currentPrice = currentPrice * (1 + change);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.round(Math.random() * 1000000 + 500000)
    });
  }
  
  return data;
} 