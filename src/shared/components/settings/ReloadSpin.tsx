import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { RotateCw } from "lucide-react";

/**
 * 轻量可复用的“Reload 图标转圈”组件（lucide-react）
 * - 默认使用 <RotateCw />
 * - 使用 Tailwind 内置的 `animate-spin`，可通过 `duration` 自定义转速
 * - 可暂停、可自定义尺寸与描边粗细
 *
 * 用法：
 *   <ReloadSpin />
 *   <ReloadSpin duration={800} size={20} />
 *   <ReloadSpin paused />
 *   <ReloadSpin icon={Loader2} /> // 任意 lucide 图标都能转
 */
export type ReloadSpinProps = React.ComponentProps<"span"> & {
  /** 要旋转的 lucide 图标组件，默认 RotateCw */
  icon?: LucideIcon;
  /** 图标大小（px / 任意 CSS 尺寸），默认 18 */
  size?: number | string;
  /** 图标描边宽度，默认 2 */
  strokeWidth?: number;
  /** 一圈所需时长（毫秒），默认 1000ms */
  duration?: number;
  /** 暂停旋转 */
  paused?: boolean;
  /** 额外 className */
  className?: string;
  /** 可读性标签（无则 aria-hidden） */
  ariaLabel?: string;
};

export default function ReloadSpin({
  icon: Icon = RotateCw,
  size = 18,
  strokeWidth = 2,
  duration = 1000,
  paused = false,
  className,
  ariaLabel,
  style,
  ...rest
}: ReloadSpinProps) {
  // 允许通过 style 覆盖，但默认用 duration 控制动画速度
  const mergedStyle = React.useMemo<React.CSSProperties>(
    () => ({
      animationDuration: `${duration}ms`,
      ...style,
    }),
    [duration, style]
  );

  const mergedClass = [
    "inline-block align-middle",
    paused ? "" : "animate-spin",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  // 注意：lucide 图标本身是 SVG，可以直接传尺寸和 strokeWidth
  return (
    <Icon
      width={size as any}
      height={size as any}
      strokeWidth={strokeWidth}
      className={mergedClass}
      style={mergedStyle}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      {...rest}
    />
  );
}
