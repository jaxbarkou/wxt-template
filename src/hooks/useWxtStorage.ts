import { useState, useEffect } from 'react';
import { storage } from 'wxt/utils/storage';

// 定义设置项
export const displayHoverCardItem = storage.defineItem('local:displayHoverCard', {
  fallback: false,
});

export const useWxtStorage = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 获取设置值
  const getValue = async () => {
    try {
      const value = await displayHoverCardItem.getValue();
      setIsEnabled(value);
    } catch (error) {
      console.error('Failed to get setting:', error);
    } finally {
      setLoading(false);
    }
  };

  // 设置值
  const setValue = async (value: boolean) => {
    try {
      await displayHoverCardItem.setValue(value);
      setIsEnabled(value);
    } catch (error) {
      console.error('Failed to set setting:', error);
    }
  };

  // 监听变化
  useEffect(() => {
    getValue();

    // 监听存储变化
    const unwatch = displayHoverCardItem.watch((newValue) => {
      setIsEnabled(newValue);
    });

    return () => unwatch();
  }, []);

  return {
    isEnabled,
    setValue,
    loading,
  };
}; 