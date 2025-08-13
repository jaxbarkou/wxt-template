import { cn } from "@/lib/utils";
import * as React from "react";

export interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  hoverColor?: string;
  className?: string;
  children: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

export type IconProps = Omit<React.ComponentProps<typeof SvgIcon>, "children">;

export function SvgIcon({
  size = 24,
  color = "currentColor",
  hoverColor,
  className,
  children,
  ...props
}: SvgIconProps) {
  const [isHover, setIsHover] = React.useState(false);
  const appliedColor = isHover && hoverColor ? hoverColor : color;

  return React.cloneElement(children, {
    width: size,
    height: size,
    fill: appliedColor,
    stroke: appliedColor,
    className: cn(
      "inline-block transition-colors",
      children.props.className,
      className
    ),
    onMouseEnter: (e: React.MouseEvent<SVGSVGElement>) => {
      setIsHover(true);
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<SVGSVGElement>) => {
      setIsHover(false);
      children.props.onMouseLeave?.(e);
    },
    ...props,
  });
}
