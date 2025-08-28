import { useState, useEffect } from 'react';
import { storage } from 'wxt/utils/storage'; 

// 定义设置项
export const displayHoverCardItem = storage.defineItem('local:displayHoverCard', {
  fallback: false,
});

// 定义页面禁用状态
export const pageDisabledItem = storage.defineItem('local:pageDisabled', {
  fallback: false,
});

// 定义全局禁用状态
export const globalDisabledItem = storage.defineItem('local:globalDisabled', {
  fallback: false,
});

export const useWxtStorage = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [pageDisabled, setPageDisabled] = useState(false);
  const [globalDisabled, setGlobalDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 获取设置值
  const getValue = async () => {
    try {
      const [hoverValue, pageValue, globalValue] = await Promise.all([
        displayHoverCardItem.getValue(),
        pageDisabledItem.getValue(),
        globalDisabledItem.getValue(),
      ]);
      setIsEnabled(hoverValue);
      setPageDisabled(pageValue);
      setGlobalDisabled(globalValue);
    } catch (error) {
      console.error('Failed to get settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // 设置hover card值
  const setValue = async (value: boolean) => {
    try {
      await displayHoverCardItem.setValue(value);
      setIsEnabled(value);
    } catch (error) {
      console.error('Failed to set setting:', error);
    }
  };

  // 设置页面禁用状态
  const setPageDisabledValue = async (value: boolean) => {
    try {
      await pageDisabledItem.setValue(value);
      setPageDisabled(value);
    } catch (error) {
      console.error('Failed to set page disabled setting:', error);
    }
  };

  // 设置全局禁用状态
  const setGlobalDisabledValue = async (value: boolean) => {
    try {
      await globalDisabledItem.setValue(value);
      setGlobalDisabled(value);
    } catch (error) {
      console.error('Failed to set global disabled setting:', error);
    }
  };

  // 监听变化
  useEffect(() => {
    getValue();

    // 监听存储变化
    const unwatchHover = displayHoverCardItem.watch((newValue) => {
      setIsEnabled(newValue);
    });

    const unwatchPage = pageDisabledItem.watch((newValue) => {
      setPageDisabled(newValue);
    });

    const unwatchGlobal = globalDisabledItem.watch((newValue) => {
      setGlobalDisabled(newValue);
    });

    return () => {
      unwatchHover();
      unwatchPage();
      unwatchGlobal();
    };
  }, []);

  return {
    isEnabled,
    setValue,
    pageDisabled,
    setPageDisabledValue,
    globalDisabled,
    setGlobalDisabledValue,
    loading,
  };
}; 