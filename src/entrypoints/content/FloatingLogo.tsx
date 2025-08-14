import React, { useState } from 'react';

interface FloatingLogoProps {
  onOpenSidePanel: () => void;
  onOpenUser: () => void;
  onOpenAbout: () => void;
  onOpenOptions: () => void;
}

const FloatingLogo: React.FC<FloatingLogoProps> = ({
  onOpenSidePanel,
  onOpenUser,
  onOpenAbout,
  onOpenOptions,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 内联样式
  const parentContainerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: '0px',
    zIndex: 999999,
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    right: '0',
    marginBottom: '0',
    paddingBottom: '20px',
  };
  const lineStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '8px',
    background: '#fff',
    borderRadius: '40px',
    padding: '8px 4px',
    boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.25)',
  }

  const buttonStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
    fontSize: '0',
  };

  const mainButtonStyle: React.CSSProperties = {
    width: '40px',
    height: '36px',
    background: '#FFF',
    borderRadius: '40px 0 0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    fontSize: '0',
  };

  const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    fill: 'currentColor',
  };

  const mainIconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#F67C00'
  };

  return (
    <div 
      style={parentContainerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 悬停菜单 */}
      {isHovered && (
        <div style={menuStyle}>
          <div style={lineStyle}>
          {/* 侧边栏按钮 */}
          <button
            onClick={onOpenSidePanel}
            style={{
              ...buttonStyle,
              backgroundColor: '#3b82f6',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="打开侧边栏"
          >
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* 用户页面按钮 */}
          <button
            onClick={onOpenUser}
            style={{
              ...buttonStyle,
              backgroundColor: '#10b981',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="用户页面"
          >
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* 设置页面按钮 */}
          <button
            onClick={onOpenOptions}
            style={{
              ...buttonStyle,
              backgroundColor: '#8b5cf6',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7c3aed';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8b5cf6';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="设置页面"
          >
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* 关于页面按钮 */}
          <button
            onClick={onOpenAbout}
            style={{
              ...buttonStyle,
              backgroundColor: '#f59e0b',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d97706';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="关于页面"
          >
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          </div>
        </div>
      )}

      {/* 主Logo按钮 */}
      <button
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.background = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = '#fff';
        }}
        style={mainButtonStyle}
        title="WXT Extension"
      >
        <p style={mainIconStyle} className='text-[12px] text-[#2C2C2C]'>WXT</p>
      </button>
    </div>
  );
};

export default FloatingLogo; 