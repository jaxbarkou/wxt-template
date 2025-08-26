import React, { useState } from 'react';

interface FloatingButtonProps {
  text: string;
  position: { x: number; y: number };
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ text, position }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleAnalyze = () => {
    // 发送消息给background script，打开侧边栏并传递选中的文本
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        type: "ANALYZE_SELECTED_TEXT",
        text: text
      }, (response) => {
        if (response?.success) {
          console.log("分析请求已发送");
        } else {
          console.error("发送分析请求失败:", response?.message);
        }
      });
    } else {
      console.error("Chrome runtime API 不可用");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("文本已复制到剪贴板");
    }).catch((err) => {
      console.error("复制失败:", err);
    });
  };

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 999999,
    display: 'flex',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontSize: '14px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'all 0.2s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const buttonBaseStyle: React.CSSProperties = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const analyzeButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: '#3b82f6',
    color: 'white',
  };

  const copyButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
  };

  return (
    <div 
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        style={analyzeButtonStyle}
        onClick={handleAnalyze}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3b82f6';
        }}
        title="分析选中的文本"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
        </svg>
        分析
      </button>
      
      <button
        style={copyButtonStyle}
        onClick={handleCopy}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e5e7eb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        title="复制选中的文本"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        复制
      </button>
    </div>
  );
};

export default FloatingButton; 