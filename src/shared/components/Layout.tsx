import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    SearchIcon, 
    PentagramIcon, 
    GiftIcon, 
    EarthIcon, 
    TelegramIcon, 
    TwitterIcon, 
    MoreIcon, 
    LampIcon, 
    HomeIcon, 
    MobileIcon, 
    SettingIcon, 
    UserIcon,
    FoldIcon,
    FullPageIcon 
} from '@/components/custom/svg';
import '@/shared/styles/Layout.css';

interface LayoutProps {
    children: React.ReactNode;
    mode: 'popup' | 'sidepanel' | 'options';
}

// 顶部操作栏配置
const topActions = [
    { id: 'fold', icon: 'fold', label: '折叠', path: null },
    { id: 'fullpage', icon: 'fullpage', label: '打开options页面', path: '/options' },
];

// 上半部分导航项配置
const topNavigationItems = [
    { id: 'search', icon: 'search', label: '搜索', path: '/search' },
    { id: 'pentagram', icon: 'pentagram', label: '收藏', path: '/favorites' },
    { id: 'earth', icon: 'earth', label: '全球', path: '/global' },
    { id: 'lamp', icon: 'lamp', label: '发现', path: '/discover' },
    { id: 'gift', icon: 'gift', label: '礼物', path: '/gift' },
    { id: 'more', icon: 'more', label: '更多', path: '/more' },
    { id: 'twitter', icon: 'twitter', label: 'Twitter', path: '/twitter' },
    { id: 'telegram', icon: 'telegram', label: 'Telegram', path: '/telegram' },
];

// 下半部分导航项配置
const bottomNavigationItems = [
    { id: 'home', icon: 'home', label: '首页', path: '/' },
    { id: 'mobile', icon: 'mobile', label: '移动', path: '/mobile' },
    { id: 'settings', icon: 'settings', label: '设置', path: '/settings' },
    { id: 'user', icon: 'user', label: '用户', path: '/user' },
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
    const navigate = useNavigate();
    
    const handleNavItemClick = (item: any) => {
        if (item.path) {
            navigate(item.path);
        }
        if (item.id === 'fold') {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    // 渲染图标的辅助函数
    const renderIcon = (iconType: string) => {
        const iconProps = {
            size: 20,
            color: "#6c757d",
            hoverColor: "#495057"
        };

        switch (iconType) {
            case 'search': return <SearchIcon {...iconProps} />;
            case 'pentagram': return <PentagramIcon {...iconProps} />;
            case 'earth': return <EarthIcon {...iconProps} />;
            case 'lamp': return <LampIcon {...iconProps} />;
            case 'gift': return <GiftIcon {...iconProps} />;
            case 'more': return <MoreIcon {...iconProps} />;
            case 'twitter': return <TwitterIcon {...iconProps} />;
            case 'telegram': return <TelegramIcon {...iconProps} />;
            case 'home': return <HomeIcon {...iconProps} />;
            case 'mobile': return <MobileIcon {...iconProps} />;
            case 'settings': return <SettingIcon {...iconProps} />;
            case 'user': return <UserIcon {...iconProps} />;
            case 'fold': return <FoldIcon {...iconProps} />;
            case 'fullpage': return <FullPageIcon {...iconProps} />;
            default: return null;
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
                            <UserIcon
                                size={18}
                                color="#6c757d"
                                hoverColor="#495057"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 右侧导航栏 */}
            <div className={`right-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="nav-items">
                    {/* 顶部操作栏 - 2个icon一行展示 */}
                    <div className="nav-top-actions">
                        {topActions.map((item) => (
                            <div
                                key={item.id}
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''} flex items-center justify-center`}
                                onClick={() => handleNavItemClick(item)}
                                title={item.label}
                            >
                                <span className="nav-icon">
                                    {renderIcon(item.icon)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* 上半部分导航项 */}
                    <div className="nav-top-section">
                        {topNavigationItems.map((item) => (
                            <div
                                key={item.id}
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''} flex items-center justify-center`}
                                onClick={() => handleNavItemClick(item)}
                                title={item.label}
                            >
                                <span className="nav-icon">
                                    {renderIcon(item.icon)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* 下半部分导航项 */}
                    <div className="nav-bottom-section">
                        {bottomNavigationItems.map((item) => (
                            <div
                                key={item.id}
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''} flex items-center justify-center`}
                                onClick={() => handleNavItemClick(item)}
                                title={item.label}
                            >
                                <span className="nav-icon">
                                    {renderIcon(item.icon)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout; 