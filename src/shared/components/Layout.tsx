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
    FullPageIcon,
    ExpandIcon,
    RightIcon,
    LoveIcon,
    PromptBorIcon,
    EmaiIcon,
    TabIcon,
} from '@/components/custom/svg';
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import '@/shared/styles/Layout.css';
import LoginStatus from './LoginStatus';

interface LayoutProps {
  children: React.ReactNode;
  mode: "popup" | "sidepanel" | "options";
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
  { id: "home", icon: "home", label: "首页", path: "/" },
  { id: "mobile", icon: "mobile", label: "移动", path: "/mobile" },
  { id: "settings", icon: "settings", label: "设置", path: "/settings" },
  { id: "user", icon: "user", label: "用户", path: "/user" },
];

// 底部积分栏配置
const bottomItems = [
  { id: "points", icon: "🔴", label: "1,500", path: null },
  { id: "gift", icon: "🎁", label: "礼物", path: "/gift" },
  { id: "heart", icon: "❤️", label: "喜欢", path: "/heart" },
  { id: "help", icon: "❓", label: "帮助", path: "/help" },
  { id: "mail", icon: "✉️", label: "邮件", path: "/mail" },
  { id: "user-bottom", icon: "👤", label: "用户", path: "/user" },
];

const Layout: React.FC<LayoutProps> = ({ children, mode }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isHoveringExpand, setIsHoveringExpand] = useState(false);
    // 添加登录状态状态
    const [isUserHovered, setIsUserHovered] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavItemClick = (item: any) => {
        if (item.path) {
            navigate(item.path);
        }
        if (item.id === 'fold') {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
        if (item.id === 'fullpage') {
            setIsFullscreen(!isFullscreen);
        }
    };

    // 渲染图标的辅助函数
    const renderIcon = (iconType: string) => {
        const iconProps = {
            size: 20,
            color: "#6c757d",
            hoverColor: "#495057"
        };

        // 为顶部操作栏的图标设置更小的尺寸
        const smallIconProps = {
            size: 16,
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
            case 'fold': return <FoldIcon {...smallIconProps} />;
            case 'fullpage': return <FullPageIcon {...smallIconProps} />;
            case 'expand': return <ExpandIcon {...smallIconProps} />;
            default: return null;
        }
    };

    // 渲染带Tooltip的导航项
    const renderNavItem = (item: any) => (
        <Tooltip key={item.id}>
            <TooltipTrigger asChild>
                <div
                    className={`nav-item ${location.pathname === item.path ? 'active' : ''} flex items-center justify-center`}
                    onClick={() => handleNavItemClick(item)}
                >
                    <span className="nav-icon">
                        {renderIcon(item.icon)}
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="left">
                <p>{item.label}</p>
            </TooltipContent>
        </Tooltip>
    );

    // 为顶部操作栏创建专门的渲染函数
    const renderTopActionItem = (item: any) => (
        <Tooltip key={item.id}>
            <TooltipTrigger asChild>
                <div
                    className={`nav-item nav-top-action ${location.pathname === item.path ? 'active' : ''} flex items-center justify-center ${item.id === 'fold' ? 'fold-flipped' : ''}`}
                    onClick={() => handleNavItemClick(item)}
                >
                    <span className="nav-icon">
                        {renderIcon(item.icon)}
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="left">
                <p>{item.label}</p>
            </TooltipContent>
        </Tooltip>
    );

    // 为面板中的顶部操作栏创建专门的渲染函数
    const renderPanelTopActionItem = (item: any) => (
        <Tooltip key={item.id}>
            <TooltipTrigger asChild>
                <div
                    className={`nav-item nav-top-action ${location.pathname === item.path ? 'active' : ''} flex items-center justify-center ${item.id === 'fold' ? 'fold-flipped' : ''}`}
                    onClick={() => handleNavItemClick(item)}
                >
                    <span className="nav-icon">
                        {renderIcon(item.icon)}
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="left">
                <p>{item.label}</p>
            </TooltipContent>
        </Tooltip>
    );

    // 为下半部分导航项创建专门的渲染函数
    const renderBottomNavItem = (item: any) => {
        if (item.icon === 'user') {
            return (
                <div key={item.id} className="nav-item-container">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''} flex items-center justify-center`}
                                onClick={() => handleNavItemClick(item)}
                                onMouseEnter={() => setIsUserHovered(true)}
                                onMouseLeave={() => setIsUserHovered(false)}
                            >
                                <span className="nav-icon">
                                    {renderIcon(item.icon)}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>{item.label}</p>
                        </TooltipContent>
                    </Tooltip>
                    
                    {/* User悬停弹窗 */}
                    {isUserHovered && (
                        <div 
                            className="user-popup"
                            onMouseEnter={() => setIsUserHovered(true)}
                            onMouseLeave={() => setIsUserHovered(false)}
                        >
                            <LoginStatus 
                                isLoggedIn={true}
                                userInfo={{
                                    username: 'Kai',
                                    email: 'useremail@gmail.com'
                                }}
                                credits={{
                                    balance: '1,500',
                                    dailyEarn: '+150',
                                    totalStaked: '0',
                                    totalEarned: '0'
                                }}
                            />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                    <div
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''} flex items-center justify-center`}
                        onClick={() => handleNavItemClick(item)}
                    >
                        <span className="nav-icon">
                            {renderIcon(item.icon)}
                        </span>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>{item.label}</p>
                </TooltipContent>
            </Tooltip>
        );
    };

    // 如果全屏模式，只显示主内容
    if (isFullscreen) {
        return (
            <div className="layout-container fullscreen-mode">
                <div className="left-content fullscreen">
                    <div className="page-content">
                        {children}
                    </div>
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
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className={`layout-container ${mode}-mode ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {/* 左侧主内容区域 */}
                <div className="left-content">
                    {/* 页面内容 */}
                    <div className="page-content">
                        {children}
                    </div>



                    {/* 底部积分栏 */}
                    <div className="bottom-bar">
                        {/* 左侧积分显示 */}
                        <div className="bottom-left">
                            <div className="points-display">
                                <div className="points-icon">🔴</div>
                                <span className="points-text">1,500</span>
                            </div>
                        </div>

                        {/* 右侧图标 */}
                        <div className="bottom-right-icons">
                            <div className="bottom-item">
                                <GiftIcon size={18} color="#F67C00" />
                            </div>
                            <div className="bottom-item">
                                <LoveIcon size={18} color="#6c757d" />
                            </div>
                            <div className="bottom-item">
                                <PromptBorIcon size={18} color="#6c757d" />
                            </div>
                            <div className="bottom-item">
                                <EmaiIcon size={18} color="#6c757d" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧导航栏 */}
                <div className={`right-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="nav-items">
                        {/* 顶部操作栏 - 2个icon一行展示 */}
                        <div className="nav-top-actions">
                            {topActions.map(renderTopActionItem)}
                        </div>

                        {/* 上半部分导航项 */}
                        <div className="nav-top-section">
                            {topNavigationItems.map(renderNavItem)}
                        </div>

                        {/* 下半部分导航项 */}
                        <div className="nav-bottom-section">
                            {bottomNavigationItems.map(renderBottomNavItem)}
                        </div>
                    </div>
                </div>

                {/* 折叠时显示的ExpandIcon */}
                {isSidebarCollapsed && (
                    <div className="expand-wrapper">
                        <div
                            className="expand-trigger"
                            onMouseEnter={() => setIsHoveringExpand(true)}
                        >
                            <ExpandIcon
                                size={16}
                                color="#6c757d"
                                hoverColor="#495057"
                            />
                        </div>

                        {/* 悬停时显示的导航面板 */}
                        {isHoveringExpand && (
                            <div
                                className="expand-panel"
                                onMouseLeave={() => setIsHoveringExpand(false)}
                            >
                                <div className="expand-panel-content">
                                    {/* 面板顶部操作栏 */}
                                    <div className="expand-panel-header">
                                        <div className="nav-top-actions">
                                            {topActions.map(renderPanelTopActionItem)}
                                        </div>
                                    </div>

                                    {/* 水平导航栏 */}
                                    <div className="horizontal-nav">
                                        <div className="nav-item-horizontal">
                                            <SearchIcon size={16} color="#6c757d" />
                                            <span>Research</span>
                                        </div>
                                        <div className="nav-item-horizontal">
                                            <PentagramIcon size={16} color="#6c757d" />
                                            <span>Campaigns</span>
                                        </div>
                                        <div className="nav-item-horizontal">
                                            <EarthIcon size={16} color="#6c757d" />
                                            <span>News</span>
                                        </div>
                                        <div className="nav-item-horizontal">
                                            <SearchIcon size={16} color="#6c757d" />
                                            <span>Chat</span>
                                        </div>
                                    </div>
                                    <div className="expand-panel-bottom">


                                        {/* 使用封装的登录状态组件 */}
                                        <LoginStatus
                                            isLoggedIn={isLoggedIn}
                                            userInfo={{
                                                username: 'Kai',
                                                email: 'useremail@gmail.com'
                                            }}
                                            credits={{
                                                balance: '1,500',
                                                dailyEarn: '+150',
                                                totalStaked: '0',
                                                totalEarned: '0'
                                            }}
                                        />

                                        {/* 底部导航栏 */}
                                        <div className="bottom-nav-panel">
                                            <div className="bottom-nav-left">
                                                <div className="bottom-nav-item">
                                                    <TwitterIcon size={16} color="#6c757d" />
                                                </div>
                                                <div className="bottom-nav-item">
                                                    <TelegramIcon size={16} color="#6c757d" />
                                                </div>
                                            </div>

                                            <div className="bottom-nav-right">
                                                <div className="bottom-nav-item">
                                                    <HomeIcon size={16} color="#6c757d" />
                                                </div>
                                                <div className="bottom-nav-item">
                                                    <MobileIcon size={16} color="#6c757d" />
                                                </div>
                                                <div className="bottom-nav-item">
                                                    <SettingIcon size={16} color="#6c757d" />
                                                </div>
                                                <div className="bottom-nav-item active">
                                                    <UserIcon size={16} color="white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
};

export default Layout; 