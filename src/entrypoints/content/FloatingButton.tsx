import React, { useState } from 'react';
import logo from '@/assets/images/logo.png'
import search from '@/assets/images/search.png'
import close from '@/assets/images/close.png'
import { Input } from '@/components/ui/input';
import { useWxtStorage } from '@/hooks/useWxtStorage';

interface FloatingButtonProps {
  text: string;
  position: { x: number; y: number };
  onClose?: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ text, position, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [askAi, setAskAi] = useState(false);
  const [question, setQuestion] = useState("");

  // 使用存储hook
  const { pageDisabled, globalDisabled } = useWxtStorage();

  const handleAnalyze = () => {
    // 发送消息给background script，打开侧边栏并传递选中的文本
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        type: "ANALYZE_SELECTED_TEXT",
        text:  `${text}|${question.trim()}`
      }, (response) => {
        if (response?.success) {
          handleClose();
          console.log("分析请求已发送");
        } else {
          console.error("发送分析请求失败:", response?.message);
        }
      });
    } else {
      console.error("Chrome runtime API 不可用");
    }
  };

  const handleSearch = () => {
    // 发送消息给background script，打开搜索页面并传递选中的文本
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        type: "SEARCH_SELECTED_TEXT",
        text: text.trim()
      }, (response) => {
        if (response?.success) {
          handleClose();
          console.log("搜索请求已发送");
        } else {
          console.error("发送搜索请求失败:", response?.message);
        }
      });
    } else {
      console.error("Chrome runtime API 不可用");
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 999999,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontSize: '14px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'all 0.2s ease',
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
  };
  const logoStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    opacity: 0.8,
  };

  const iconStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  };

  const separatorStyle: React.CSSProperties = {
    width: '1px',
    height: '20px',
    backgroundColor: '#e5e7eb',
  };

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#374151',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    zIndex: 1000000,
    marginBottom: '4px',
  };

  // 如果全局禁用或页面禁用，显示提示信息
  if (globalDisabled || pageDisabled) {
    return (
      <div
        style={{
          ...containerStyle,
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ fontSize: '12px', fontWeight: '500' }}>
            {pageDisabled ? '此页面禁用' : '所有页面禁用'}
          </div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            {pageDisabled ? '此页面禁用' : '所有页面禁用'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!askAi ?
        <>
          {/* 应用图标 */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={(e) => {
              setShowTooltip('应用');
              e.currentTarget.querySelector('img')!.style.opacity = '1';
              e.currentTarget.querySelector('img')!.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              setShowTooltip(null);
              e.currentTarget.querySelector('img')!.style.opacity = '0.8';
              e.currentTarget.querySelector('img')!.style.transform = 'scale(1)';
            }}
          >
            <img
              src={logo}
              alt="应用"
              style={logoStyle}
              // onClick={handleAnalyze}
              onClick={() => setAskAi(true)}
            />
            {showTooltip === '应用' && (
              <div style={tooltipStyle}>Ask Ai</div>
            )}
          </div>

          {/* 搜索图标 */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={(e) => {
              setShowTooltip('搜索');
              e.currentTarget.querySelector('img')!.style.opacity = '1';
              e.currentTarget.querySelector('img')!.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              setShowTooltip(null);
              e.currentTarget.querySelector('img')!.style.opacity = '0.8';
              e.currentTarget.querySelector('img')!.style.transform = 'scale(1)';
            }}
          >
            <img
              src={search}
              alt="搜索"
              style={iconStyle}
              onClick={handleSearch}
            />
            {showTooltip === '搜索' && (
              <div style={tooltipStyle}>Research selected text</div>
            )}
          </div>

          {/* 分隔线 */}
          <div style={separatorStyle}></div>

          {/* 关闭按钮 */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={(e) => {
              setShowTooltip('关闭');
              e.currentTarget.querySelector('img')!.style.opacity = '1';
              e.currentTarget.querySelector('img')!.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              setShowTooltip(null);
              e.currentTarget.querySelector('img')!.style.opacity = '0.8';
              e.currentTarget.querySelector('img')!.style.transform = 'scale(1)';
            }}
          >
            <img
              src={close}
              alt="关闭"
              style={iconStyle}
              onClick={handleClose}
            />
            {showTooltip === '关闭' && (
              <div style={tooltipStyle}>Close</div>
            )}
          </div>
        </> :
        <div className=''>
          <p className='max-w-sm break-all mb-1'>{text}</p>
          <div className="relative">
            <Input
              className="h-8 pl-2 pr-20 mb-0 rounded-2"
              placeholder="Ask the AI ​​your questions"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div
              onClick={handleAnalyze}
              className='absolute py-1 text-sm font-medium text-orange-500 -translate-y-1/2 right-2 top-1/2 hover:underline cursor-pointer'
            >
              <svg
                className="transform transition-transform duration-200 group-hover:scale-110"
                width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.2118 0.0668041L0.604624 5.56249C-0.218554 5.87219 -0.197933 6.32228 0.646597 6.56661L4.176 7.58766L5.61102 11.7508C5.79889 12.2959 6.28968 12.4108 6.7095 12.0053L8.56081 10.2172L12.2153 12.8283C12.6901 13.1675 13.1782 12.989 13.3064 12.4259L15.9731 0.709912C16.1009 0.148455 15.7605 -0.139647 15.2118 0.0668041ZM12.9889 2.71576L6.75825 8.12833C6.64621 8.22566 6.54483 8.41852 6.52926 8.56131L6.25419 11.0828C6.22331 11.3659 6.12318 11.3776 6.03083 11.1062L4.82521 7.56289C4.77805 7.42427 4.84265 7.25436 4.96859 7.18072L12.8702 2.55978C13.3738 2.26532 13.4274 2.33486 12.9889 2.71576Z" fill="#F67C00"/>
              </svg>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default FloatingButton; 