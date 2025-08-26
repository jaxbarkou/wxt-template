import React, { useState } from 'react';
import FloatingLogo from './FloatingLogo';

const FloatingContainer: React.FC = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // 监听来自background的消息
  chrome.runtime.onMessage.addListener((message: any) => {
    if (message.type === "SIDEPANEL_OPENED") {
      setIsSidePanelOpen(true);
    } else if (message.type === "SIDEPANEL_CLOSED") {
      setIsSidePanelOpen(false);
    }
  });

  // 切换侧边栏状态 - 只处理侧边栏，不打开popup
  const handleToggleSidePanel = () => {
    if (isSidePanelOpen) {
      // 关闭侧边栏
      chrome.runtime.sendMessage({ type: "CLOSE_SIDEPANEL" }, (response) => {
        if (response?.success) {
          console.log("侧边栏已关闭");
          setIsSidePanelOpen(false);
        } else {
          console.log("关闭侧边栏失败:", response?.message);
        }
      });
    } else {
      // 打开侧边栏
      chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" }, (response) => {
        if (response?.success) {
          console.log("侧边栏已打开");
          setIsSidePanelOpen(true);
        } else {
          console.log("打开侧边栏失败:", response?.message);
        }
      });
    }
  };

  // 打开侧边栏（用于菜单按钮）
  const handleOpenSidePanel = () => {
    chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" }, (response) => {
      if (response?.success) {
        console.log("侧边栏已打开");
        setIsSidePanelOpen(true);
      } else {
        console.log("打开侧边栏失败:", response?.message);
      }
    });
  };

  // 打开用户页面
  const handleOpenUser = () => {
    chrome.runtime.sendMessage({ 
      type: "OPEN_PAGE", 
      page: "user" 
    }, (response) => {
      if (response?.success) {
        console.log("用户页面已打开");
      } else {
        console.log("打开用户页面失败:", response?.message);
      }
    });
  };

  // 打开关于页面
  const handleOpenAbout = () => {
    chrome.runtime.sendMessage({ 
      type: "OPEN_PAGE", 
      page: "about" 
    }, (response) => {
      if (response?.success) {
        console.log("关于页面已打开");
      } else {
        console.log("打开关于页面失败:", response?.message);
      }
    });
  };

  // 打开设置页面
  const handleOpenOptions = () => {
    chrome.runtime.sendMessage({ 
      type: "OPEN_PAGE", 
      page: "options" 
    }, (response) => {
      if (response?.success) {
        console.log("设置页面已打开");
      } else {
        console.log("打开设置页面失败:", response?.message);
      }
    });
  };

  return (
    <FloatingLogo
      onToggleSidePanel={handleToggleSidePanel}
      onOpenSidePanel={handleOpenSidePanel}
      onOpenUser={handleOpenUser}
      onOpenAbout={handleOpenAbout}
      onOpenOptions={handleOpenOptions}
      isSidePanelOpen={isSidePanelOpen}
    />
  );
};

export default FloatingContainer;