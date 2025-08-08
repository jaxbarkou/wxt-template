import React from 'react';
import FloatingLogo from './FloatingLogo';

const FloatingContainer: React.FC = () => {
  // 打开侧边栏
  const handleOpenSidePanel = () => {
    chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" }, (response) => {
      if (response?.success) {
        console.log("侧边栏已打开");
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
      onOpenSidePanel={handleOpenSidePanel}
      onOpenUser={handleOpenUser}
      onOpenAbout={handleOpenAbout}
      onOpenOptions={handleOpenOptions}
    />
  );
};

export default FloatingContainer;