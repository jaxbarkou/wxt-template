import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  ChatIcon,
} from "@/components/custom/svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "@/shared/styles/Layout.css";
import LoginStatus from "./LoginStatus";
import LoginBase from "@/components/custom/Login/LoginBase";
import { useMode } from "../context/ModeProvider";
import { useRootStore } from "@/store";
import { useUserDetail } from "@/hooks/useUserDetail";
import { useCreditsInfo } from "@/hooks/useCreditsInfo";
import { useYomoInitToken } from "@/hooks/useYomoInitToken";
import { useLogout } from "@/hooks/useLogout";
import { Toaster } from "@/components/ui/sonner";

// 顶部操作栏配置
const topActions = [
  { id: "fold", icon: "fold", label: "Fold", path: null },
  //   {
  //     id: "fullpage",
  //     icon: "fullpage",
  //     label: "打开options页面",
  //     path: "/options",
  //   },
];

// 上半部分导航项配置
const topNavigationItems = [
  { id: "search", icon: "search", label: "Research", path: "/search" },
  { id: "chat", icon: "chat", label: "Chat", path: "/" },
  //   { id: "pentagram", icon: "pentagram", label: "收藏", path: "" },
  { id: "earth", icon: "earth", label: "Community", path: "" },
  { id: "lamp", icon: "lamp", label: "News", path: "" },
  { id: "gift", icon: "gift", label: "Campaigns", path: "" },
  { id: "more", icon: "more", label: "More", path: "" },
  { id: "twitter", icon: "twitter", label: "Twitter", path: "" },
  { id: "telegram", icon: "telegram", label: "Telegram", path: "" },
];

// 下半部分导航项配置
const bottomNavigationItems = [
  { id: "home", icon: "home", label: "Home", path: "/" },
  { id: "mobile", icon: "mobile", label: "Mobile", path: "" },
  { id: "settings", icon: "settings", label: "Settings", path: "/settings" },
  { id: "user", icon: "user", label: "User", path: "/settings" },
];

// 底部积分栏配置
const bottomItems = [
  { id: "points", icon: "🔴", label: "1,500", path: null },
  { id: "gift", icon: "🎁", label: "Campaigns", path: "/gift" },
  { id: "heart", icon: "❤️", label: "Likes", path: "/heart" },
  { id: "help", icon: "❓", label: "Help", path: "/help" },
  { id: "mail", icon: "✉️", label: "Mail", path: "/mail" },
  { id: "user-bottom", icon: "👤", label: "User", path: "/user" },
];

// 移除mode参数
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loginModalOpen, setLoginModalOpen, token } = useRootStore();
  const { fetchUserDetail } = useUserDetail();
  const { fetchCreditsInfo, creditsInfo } = useCreditsInfo();
  const { mode } = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHoveringExpand, setIsHoveringExpand] = useState(false);
  // 添加登录状态状态
  const [isUserHovered, setIsUserHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const yomoInitToken = useYomoInitToken();
  const { logout } = useLogout();
  useEffect(() => {
    if (yomoInitToken) {
      logout();
      navigate("/");
    }
  }, [yomoInitToken]);

  const shouldFetchUserDetail = useMemo(() => {
    return !!token;
  }, [token]);

  useEffect(() => {
    if (shouldFetchUserDetail) {
      fetchUserDetail();
      fetchCreditsInfo();
    }
  }, [shouldFetchUserDetail, fetchUserDetail, fetchCreditsInfo]);

  const handleNavItemClick = (item: any) => {
    // 检查settings页面是否需要登录
    if (item.path === "/settings" && !token) {
      setLoginModalOpen(true);
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
    if (item.id === "fold") {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
    if (item.id === "fullpage") {
      setIsFullscreen(!isFullscreen);
    }
  };

  // 渲染图标的辅助函数
  const renderIcon = (iconType: string, isDisabled: boolean = false) => {
    const iconProps = {
      size: 20,
      color: isDisabled ? "#adb5bd" : "#6c757d",
      hoverColor: isDisabled ? "#adb5bd" : "#495057",
    };

    // 为顶部操作栏的图标设置更小的尺寸
    const smallIconProps = {
      size: 16,
      color: isDisabled ? "#adb5bd" : "#6c757d",
      hoverColor: isDisabled ? "#adb5bd" : "#495057",
    };

    switch (iconType) {
      case "search":
        return <SearchIcon {...iconProps} />;
      case "pentagram":
        return <PentagramIcon {...iconProps} />;
      case "earth":
        return <EarthIcon {...iconProps} />;
      case "lamp":
        return <LampIcon {...iconProps} />;
      case "gift":
        return <GiftIcon {...iconProps} />;
      case "more":
        return <MoreIcon {...iconProps} />;
      case "twitter":
        return <TwitterIcon {...iconProps} />;
      case "telegram":
        return <TelegramIcon {...iconProps} />;
      case "home":
        return <HomeIcon {...iconProps} />;
      case "mobile":
        return <MobileIcon {...iconProps} />;
      case "settings":
        return <SettingIcon {...iconProps} />;
      case "user":
        return <UserIcon {...iconProps} />;
      case "chat":
        return <ChatIcon {...iconProps} />;
      case "fold":
        return <FoldIcon {...smallIconProps} />;
      case "fullpage":
        return <FullPageIcon {...smallIconProps} />;
      case "expand":
        return <ExpandIcon {...smallIconProps} />;

      default:
        return null;
    }
  };

  // 渲染带Tooltip的导航项
  const renderNavItem = (item: any) => {
    const isDisabled = !item.path;

    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <div
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            } ${isDisabled ? "disabled" : ""} flex items-center justify-center`}
            onClick={() => !isDisabled && handleNavItemClick(item)}
          >
            <span className="nav-icon">
              {renderIcon(item.icon, isDisabled)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  // 为顶部操作栏创建专门的渲染函数
  const renderTopActionItem = (item: any) => (
    <Tooltip key={item.id}>
      <TooltipTrigger asChild>
        <div
          className={`nav-item nav-top-action ${
            location.pathname === item.path ? "active" : ""
          } flex items-center justify-center ${
            item.id === "fold" ? "fold-flipped" : ""
          }`}
          onClick={() => handleNavItemClick(item)}
        >
          <span className="nav-icon">{renderIcon(item.icon)}</span>
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
          className={`nav-item nav-top-action ${
            location.pathname === item.path ? "active" : ""
          } flex items-center justify-center ${
            item.id === "fold" ? "fold-flipped" : ""
          }`}
          onClick={() => handleNavItemClick(item)}
        >
          <span className="nav-icon">{renderIcon(item.icon)}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{item.label}</p>
      </TooltipContent>
    </Tooltip>
  );

  // 为下半部分导航项创建专门的渲染函数
  const renderBottomNavItem = (item: any) => {
    const isDisabled = !item.path;

    if (item.icon === "user") {
      return (
        <div key={item.id} className="nav-item-container">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`nav-item ${
                  location.pathname === item.path ? "active" : ""
                } ${
                  isDisabled ? "disabled" : ""
                } flex items-center justify-center`}
                onMouseEnter={() => !isDisabled && setIsUserHovered(true)}
                onMouseLeave={() => !isDisabled && setIsUserHovered(false)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://c.animaapp.com/tsXhjynw/img/image-9@2x.png" />
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>

          {/* User悬停弹窗 */}
          {isUserHovered && !isDisabled && (
            <div
              className="user-popup"
              onMouseEnter={() => setIsUserHovered(true)}
              onMouseLeave={() => setIsUserHovered(false)}
            >
              <LoginStatus />
            </div>
          )}
        </div>
      );
    }

    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <div
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            } ${isDisabled ? "disabled" : ""} flex items-center justify-center`}
            onClick={() => !isDisabled && handleNavItemClick(item)}
          >
            <span className="nav-icon">
              {renderIcon(item.icon, isDisabled)}
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
          <div className="page-content">{children}</div>
          <div className="bottom-bar">
            <div className="bottom-left">
              <div className="points-display">
                <div className="points-icon"></div>
                <span className="points-text">
                  {creditsInfo?.balance
                    ? Number(creditsInfo.balance).toLocaleString()
                    : "0"}
                </span>
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
                <UserIcon size={18} color="#6c757d" hoverColor="#495057" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div
        className={`layout-container ${mode}-mode ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        {/* 左侧主内容区域 */}
        <div className="left-content">
          {/* 页面内容 */}
          <div className="page-content">{children}</div>

          {/* 底部积分栏 */}
          <div className="bottom-bar">
            {/* 左侧积分显示 */}
            <div className="bottom-left">
              <div className="points-display">
                <div className="points-icon"></div>
                <span className="points-text">
                  {creditsInfo?.balance
                    ? Number(creditsInfo.balance).toLocaleString()
                    : "0"}
                </span>
              </div>
            </div>

            {/* 右侧图标 */}
            <div className="bottom-right-icons">
              <div
                className="bottom-item disabled"
                style={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                <GiftIcon size={18} color="#F67C00" />
              </div>
              <div
                className="bottom-item disabled"
                style={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                <LoveIcon size={18} color="#6c757d" />
              </div>
              <div
                className="bottom-item disabled"
                style={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                <PromptBorIcon size={22} color="#6c757d" />
              </div>
              <div
                className="bottom-item disabled"
                style={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                <EmaiIcon size={18} color="#6c757d" />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧导航栏 */}
        <div
          className={`right-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
        >
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
              <ExpandIcon size={16} color="#6c757d" hoverColor="#495057" />
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
                    <div
                      className="nav-item-horizontal clickable"
                      onClick={() => navigate("/search")}
                      style={{ cursor: "pointer" }}
                    >
                      <SearchIcon size={16} color="#6c757d" />
                      <span>Research</span>
                    </div>
                    <div
                      className="nav-item-horizontal clickable"
                      onClick={() => navigate("/")}
                      style={{ cursor: "pointer" }}
                    >
                      <ChatIcon size={16} color="#6c757d" />
                      <span>Chat</span>
                    </div>
                    <div
                      className="nav-item-horizontal disabled"
                      style={{ cursor: "not-allowed", opacity: 0.5 }}
                    >
                      <GiftIcon size={16} color="#6c757d" />
                      <span>Campaigns</span>
                    </div>
                    <div
                      className="nav-item-horizontal disabled"
                      style={{ cursor: "not-allowed", opacity: 0.5 }}
                    >
                      <LampIcon size={16} color="#6c757d" />
                      <span>News</span>
                    </div>
                  </div>
                  <div className="expand-panel-bottom">
                    {/* 使用封装的登录状态组件 */}
                    <LoginStatus />

                    {/* 底部导航栏 */}
                    <div className="bottom-nav-panel">
                      <div className="bottom-nav-left">
                        <div
                          className="bottom-nav-item disabled"
                          style={{ cursor: "not-allowed", opacity: 0.5 }}
                        >
                          <TwitterIcon size={16} color="#6c757d" />
                        </div>
                        <div
                          className="bottom-nav-item disabled"
                          style={{ cursor: "not-allowed", opacity: 0.5 }}
                        >
                          <TelegramIcon size={16} color="#6c757d" />
                        </div>
                      </div>

                      <div className="bottom-nav-right">
                        <div
                          className="bottom-nav-item clickable"
                          onClick={() => navigate("/")}
                          style={{ cursor: "pointer" }}
                        >
                          <HomeIcon size={16} color="#6c757d" />
                        </div>
                        <div
                          className="bottom-nav-item disabled"
                          style={{ cursor: "not-allowed", opacity: 0.5 }}
                        >
                          <MobileIcon size={16} color="#6c757d" />
                        </div>
                        <div
                          className="bottom-nav-item clickable"
                          onClick={() => {
                            if (!token) {
                              setLoginModalOpen(true);
                            } else {
                              navigate("/settings");
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <SettingIcon size={16} color="#6c757d" />
                        </div>
                        <div
                          className="bottom-nav-item active clickable"
                          onClick={() => {
                            if (!token) {
                              setLoginModalOpen(true);
                            } else {
                              navigate("/settings");
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
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
      {/* 登录组件 */}
      <LoginBase />
      <Toaster />
    </TooltipProvider>
  );
};

export default Layout;
