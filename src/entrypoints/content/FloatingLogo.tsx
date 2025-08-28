import React, { useState, useRef, useEffect } from "react";
import logo from "@/assets/images/slide-logo.png";
import { useWxtStorage } from "@/hooks/useWxtStorage";
import { XIcon } from "lucide-react";

interface FloatingLogoProps {
  onToggleSidePanel: () => void;
  onOpenSidePanel: () => void;
  onOpenUser: () => void;
  onOpenAbout: () => void;
  onOpenOptions: () => void;
  isSidePanelOpen: boolean;
}

const FloatingLogo: React.FC<FloatingLogoProps> = ({
  onToggleSidePanel,
  onOpenSidePanel,
  onOpenUser,
  onOpenAbout,
  onOpenOptions,
  isSidePanelOpen,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoverMenu, setIsHoverMenu] = useState(false);
  const [isHoverDisable, setIsHoverDisable] = useState(false);
  const [bottom, setBottom] = useState(24);
  const [right, setRight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const initialBottom = useRef<number>(24);
  const dragThreshold = 5; // 拖拽阈值，避免轻微移动就触发拖拽
  const hasDragged = useRef<boolean>(false); // 标记是否已经拖拽过

  // 使用存储hook
  const {
    pageDisabled,
    setPageDisabledValue,
    globalDisabled,
    setGlobalDisabledValue,
    disabledDomains,
    addDisabledDomain,
    refreshValues,
  } = useWxtStorage();

  console.log("FloatingLogo useWxtStorage values:", {
    globalDisabled,
    disabledDomains,
    currentDomain: window.location.hostname,
  });

  // 获取当前域名
  const getCurrentDomain = () => {
    return window.location.hostname;
  };

  // 检查当前页面是否被禁用
  const isCurrentPageDisabled = () => {
    const currentDomain = getCurrentDomain();
    return disabledDomains.includes(currentDomain);
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsHovered(false);
        setIsHoverMenu(false);
        setIsHoverDisable(false);
      }
    };

    if (isHovered || isHoverMenu || isHoverDisable) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHovered, isHoverMenu, isHoverDisable]);

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  // 如果全局禁用或当前页面被禁用，不显示组件
  console.log("FloatingLogo render check:", {
    globalDisabled,
    currentDomain: getCurrentDomain(),
    isCurrentPageDisabled: isCurrentPageDisabled(),
    disabledDomains,
  });

  if (globalDisabled || isCurrentPageDisabled()) {
    console.log("FloatingLogo hidden due to:", {
      globalDisabled,
      isCurrentPageDisabled: isCurrentPageDisabled(),
    });
    return null;
  }

  // 内联样式
  const parentContainerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: `${bottom}px`,
    right: `${right}px`,
    zIndex: 999999,
    userSelect: "none",
    transition: isDragging ? "none" : "right 0.2s ease",
  };

  const menuStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "100%",
    right: "0",
    marginBottom: "0",
    paddingBottom: "20px",
  };
  const lineStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    paddingBottom: "8px",
    background: "#fff",
    borderRadius: "40px",
    padding: "8px 4px",
    boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.25)",
  };

  const buttonStyle: React.CSSProperties = {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: "all 0.2s ease",
    fontSize: "0",
  };

  const mainButtonStyle: React.CSSProperties = {
    width: isDragging ? "40px" : "40px",
    height: isDragging ? "40px" : "36px",
    background: "#FFF",
    borderRadius: isDragging ? "50%" : "40px 0 0 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    cursor: isDragging ? "grabbing" : "pointer",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    transition: isDragging ? "none" : "all 0.3s ease",
    fontSize: "0",
  };

  const iconStyle: React.CSSProperties = {
    width: "24px",
    height: "24px",
    fill: "currentColor",
  };

  const mainIconStyle: React.CSSProperties = {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: isSidePanelOpen ? "#10b981" : "#F67C00", // 侧边栏打开时显示绿色
    transition: "background-color 0.3s ease",
  };

  // 拖拽事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    hasDragged.current = false; // 重置拖拽标记
    setRight(10); // 拖拽开始时距离右边10px
    dragStartY.current = e.clientY;
    initialBottom.current = bottom;
  };

  const handleClick = (e: React.MouseEvent) => {
    // 只有在没有拖拽的情况下才触发点击事件
    if (!isDragging && !hasDragged.current) {
      onToggleSidePanel();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaY = dragStartY.current - e.clientY;
    const absDeltaY = Math.abs(deltaY);

    // 只有当移动距离超过阈值时才更新位置
    if (absDeltaY > dragThreshold) {
      hasDragged.current = true; // 标记已经拖拽过
      const newBottom = Math.max(
        24,
        Math.min(window.innerHeight - 100, initialBottom.current + deltaY)
      );
      setBottom(newBottom);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setRight(0); // 拖拽结束时恢复为0

    // 延迟重置拖拽标记，避免拖拽结束后立即触发点击
    setTimeout(() => {
      hasDragged.current = false;
    }, 100);
  };

  return (
    <div
      ref={containerRef}
      style={parentContainerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 悬停菜单 */}
      {isHoverMenu && (
        <div style={menuStyle}>
          <div style={lineStyle}>
            {/* 侧边栏按钮 */}
            <button
              onClick={onOpenSidePanel}
              style={{
                ...buttonStyle,
                backgroundColor: "#3b82f6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
                e.currentTarget.style.transform = "scale(1)";
              }}
              title={isSidePanelOpen ? "侧边栏已打开" : "打开侧边栏"}
            >
              <svg
                style={iconStyle}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* 用户页面按钮 */}
            <button
              onClick={onOpenUser}
              style={{
                ...buttonStyle,
                backgroundColor: "#10b981",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#059669";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#10b981";
                e.currentTarget.style.transform = "scale(1)";
              }}
              title="用户页面"
            >
              <svg
                style={iconStyle}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* 设置页面按钮 */}
            <button
              onClick={onOpenOptions}
              style={{
                ...buttonStyle,
                backgroundColor: "#8b5cf6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#7c3aed";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#8b5cf6";
                e.currentTarget.style.transform = "scale(1)";
              }}
              title="设置页面"
            >
              <svg
                style={iconStyle}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* 关于页面按钮 */}
            <button
              onClick={onOpenAbout}
              style={{
                ...buttonStyle,
                backgroundColor: "#f59e0b",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#d97706";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f59e0b";
                e.currentTarget.style.transform = "scale(1)";
              }}
              title="关于页面"
            >
              <svg
                style={iconStyle}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 主Logo按钮 */}
      <button
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.background = "#fff";
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#fff";
          }
        }}
        style={mainButtonStyle}
        title={isSidePanelOpen ? "关闭侧边栏" : "打开侧边栏"}
      >
        <p
          style={{
            ...mainIconStyle,
            fontSize: "12px",
            color: "white",
            fontWeight: "500",
            margin: "0",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </p>
      </button>

      {/* 禁用功能图标 - 位于主logo按钮左下角 */}
      {(isHovered || isHoverDisable) && (
        <button
          onClick={() => setIsHoverDisable(!isHoverDisable)}
          style={{
            position: "absolute",
            bottom: "-4px",
            left: "-4px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            transition: "all 0.2s ease",
            color: "white",
            fontSize: "16px",
            zIndex: 1000,
            padding: "0",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
          }}
          title="禁用设置"
        >
          <XIcon size={12} />
        </button>
      )}

      {/* 禁用选项菜单 */}
      {isHoverDisable && (
        <div
          style={{
            position: "absolute",
            bottom: "5px",
            right: "41px",
            marginBottom: "8px",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            border: "1px solid #e5e7eb",
            padding: "4px",
            zIndex: 1001,
            minWidth: "120px",
          }}
        >
          {/* 此页面禁用选项 */}
          <button
            onClick={() => {
              const currentDomain = getCurrentDomain();
              addDisabledDomain(currentDomain);
              setIsHoverDisable(false);
              setIsHovered(false);
            }}
            style={{
              width: "100%",
              padding: "6px 8px",
              border: "none",
              background: "transparent",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              textAlign: "left",
              color: isCurrentPageDisabled() ? "#ef4444" : "#374151",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {isCurrentPageDisabled() ? "✓ " : ""}禁用此页面
          </button>

          {/* 所有页面禁用选项 */}
          <button
            onClick={() => {
              setGlobalDisabledValue(!globalDisabled);
              setIsHoverDisable(false);
              setIsHovered(false);
            }}
            style={{
              width: "100%",
              padding: "6px 8px",
              border: "none",
              background: "transparent",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              textAlign: "left",
              color: globalDisabled ? "#ef4444" : "#374151",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            禁用所有页面
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingLogo;
