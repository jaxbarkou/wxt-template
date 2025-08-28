import React, { useState } from 'react';
import logo from '@/assets/images/logo.png'
import search from '@/assets/images/search.png'
import close from '@/assets/images/close.png'
import { Input } from '@/components/base/input';
import { Send } from '@/components/alia/icons/send';

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
              <div style={tooltipStyle}>分析选中文本</div>
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
              <div style={tooltipStyle}>搜索选中文本</div>
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
              <div style={tooltipStyle}>关闭面板</div>
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
              <Send />
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default FloatingButton; 