import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  mode: 'popup' | 'sidepanel' | 'options';
}

// 导航项配置
const navigationItems = [
  { id: 'expand', icon: '⤢', label: '展开', path: null },
  { id: 'search', icon: '🔍', label: '搜索', path: '/search' },
  { id: 'star', icon: '⭐', label: '收藏', path: '/favorites' },
  { id: 'globe', icon: '🌐', label: '全球', path: '/global' },
  { id: 'lightbulb', icon: '💡', label: '发现', path: '/discover' },
  { id: 'plus', icon: '➕', label: '添加', path: '/add' },
  { id: 'more', icon: '⋯', label: '更多', path: '/more' },
  { id: 'close', icon: '✕', label: '关闭', path: '/close' },
  { id: 'send', icon: '📤', label: '发送', path: '/send' },
  { id: 'home', icon: '🏠', label: '首页', path: '/' },
  { id: 'mobile', icon: '📱', label: '移动', path: '/mobile' },
  { id: 'settings', icon: '⚙️', label: '设置', path: '/settings' },
  { id: 'user', icon: '👤', label: '用户', path: '/user' },
];

// 底部积分栏配置
const bottomItems = [
  { id: 'points', icon: '🔴', label: '1,500', path: null },
  { id: 'gift', icon: '🎁', label: '礼物', path: '/gift' },
  { id: 'heart', icon: '❤️', label: '喜欢', path: '/heart' },
  { id: 'help', icon: '❓', label: '帮助', path: '/help' },
  { id: 'mail', icon: '✉️', label: '邮件', path: '/mail' },
  { id: 'user-bottom', icon: '👤', label: '用户', path: '/user' },
];

const Layout: React.FC<LayoutProps> = ({ children, mode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const handleNavItemClick = (item: any) => {
    if (item.id === 'expand') {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className={`layout-container ${mode}-mode`}>
      {/* 左侧主内容区域 */}
      <div className="left-content">
        {/* 页面内容 */}
        <div className="page-content">
          {children}
        </div>

        {/* 底部积分栏 */}
        <div className="bottom-bar">
          <div className="bottom-left">
            <div className="points-display">
              <div className="points-icon">🔴</div>
              <span className="points-text">1,500</span>
            </div>
          </div>
          <div className="bottom-center">
            {bottomItems.slice(1, 5).map((item) => (
              <div key={item.id} className="bottom-item" title={item.label}>
                <span className="bottom-icon">{item.icon}</span>
              </div>
            ))}
          </div>
          <div className="bottom-right">
            <div className="bottom-user">
              <span className="bottom-user-icon">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧导航栏 */}
      <div className={`right-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="nav-items">
          {navigationItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavItemClick(item)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isSidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout; 