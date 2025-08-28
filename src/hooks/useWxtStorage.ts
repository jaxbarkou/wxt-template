import { useState, useEffect } from "react";
import { storage } from "wxt/utils/storage";

// 定义设置项
export const displayHoverCardItem = storage.defineItem(
  "local:displayHoverCard",
  {
    fallback: false,
  }
);

// 定义页面禁用状态
export const pageDisabledItem = storage.defineItem("local:pageDisabled", {
  fallback: false,
});

// 定义全局禁用状态
export const globalDisabledItem = storage.defineItem("local:globalDisabled", {
  fallback: false,
});

// 定义禁用域名列表
export const disabledDomainsItem = storage.defineItem("local:disabledDomains", {
  fallback: [] as string[],
});

export const useWxtStorage = () => {
  const [hoverModelDisabled, setHoverModelDisabled] = useState(true);
  const [pageDisabled, setPageDisabled] = useState(false);
  const [globalDisabled, setGlobalDisabled] = useState(false);
  const [disabledDomains, setDisabledDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取设置值
  const getValue = async () => {
    try {
      const [hoverValue, pageValue, globalValue, domainsValue] =
        await Promise.all([
          displayHoverCardItem.getValue(),
          pageDisabledItem.getValue(),
          globalDisabledItem.getValue(),
          disabledDomainsItem.getValue(),
        ]);
      console.log("Initial values loaded:", {
        hoverValue,
        pageValue,
        globalValue,
        domainsValue,
      });
      setHoverModelDisabled(hoverValue);
      setPageDisabled(pageValue);
      setGlobalDisabled(globalValue);
      setDisabledDomains(domainsValue);
    } catch (error) {
      console.error("Failed to get settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // 设置hover card值
  const setValue = async (value: boolean) => {
    try {
      await displayHoverCardItem.setValue(value);
      setHoverModelDisabled(value);
    } catch (error) {
      console.error("Failed to set setting:", error);
    }
  };

  // 设置页面禁用状态
  const setPageDisabledValue = async (value: boolean) => {
    try {
      await pageDisabledItem.setValue(value);
      setPageDisabled(value);
    } catch (error) {
      console.error("Failed to set page disabled setting:", error);
    }
  };

  // 设置全局禁用状态
  const setGlobalDisabledValue = async (value: boolean) => {
    try {
      console.log("Setting global disabled to:", value);
      await globalDisabledItem.setValue(value);
      setGlobalDisabled(value);
      console.log("Global disabled set successfully to:", value);
    } catch (error) {
      console.error("Failed to set global disabled setting:", error);
    }
  };

  // 设置禁用域名列表
  const setDisabledDomainsValue = async (domains: string[]) => {
    try {
      await disabledDomainsItem.setValue(domains);
      setDisabledDomains(domains);
    } catch (error) {
      console.error("Failed to set disabled domains setting:", error);
    }
  };

  // 添加禁用域名
  const addDisabledDomain = async (domain: string) => {
    try {
      const newDomains = [...disabledDomains, domain];
      await disabledDomainsItem.setValue(newDomains);
      setDisabledDomains(newDomains);
    } catch (error) {
      console.error("Failed to add disabled domain:", error);
    }
  };

  // 移除禁用域名
  const removeDisabledDomain = async (domain: string) => {
    try {
      const newDomains = disabledDomains.filter((d) => d !== domain);
      await disabledDomainsItem.setValue(newDomains);
      setDisabledDomains(newDomains);
    } catch (error) {
      console.error("Failed to remove disabled domain:", error);
    }
  };

  // 监听变化
  useEffect(() => {
    getValue();

    // 监听存储变化
    const unwatchHover = displayHoverCardItem.watch((newValue) => {
      setHoverModelDisabled(newValue);
    });

    const unwatchPage = pageDisabledItem.watch((newValue) => {
      setPageDisabled(newValue);
    });

    const unwatchGlobal = globalDisabledItem.watch((newValue) => {
      console.log("Global disabled watch triggered, new value:", newValue);
      setGlobalDisabled(newValue);
    });

    const unwatchDomains = disabledDomainsItem.watch((newValue) => {
      setDisabledDomains(newValue);
    });

    return () => {
      unwatchHover();
      unwatchPage();
      unwatchGlobal();
      unwatchDomains();
    };
  }, []);

  const refreshValues = async () => {
    await getValue();
  };

  return {
    hoverModelDisabled,
    setValue,
    pageDisabled,
    setPageDisabledValue,
    globalDisabled,
    setGlobalDisabledValue,
    disabledDomains,
    setDisabledDomainsValue,
    addDisabledDomain,
    removeDisabledDomain,
    refreshValues,
    loading,
  };
};
