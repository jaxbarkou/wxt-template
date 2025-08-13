import React from 'react';

interface SvgWrapperProps {
  children: React.ReactElement;
  size?: number;
  color?: string;
  hoverColor?: string;
  className?: string;
  onClick?: () => void;
}

const SvgWrapper: React.FC<SvgWrapperProps> = ({
  children,
  size = 24,
  color = 'currentColor',
  hoverColor,
  className = '',
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const currentColor = isHovered && hoverColor ? hoverColor : color;

 
  const processSvgElement = (element: React.ReactElement): React.ReactElement => {
    const elementProps = element.props as any;
    
    if (typeof element.type === 'string' && element.type === 'svg') {
      return React.cloneElement(element, {
        ...elementProps,
        width: size,
        height: size,
        style: {
          color: currentColor,
          transition: 'color 0.2s ease',
          cursor: onClick ? 'pointer' : 'default',
          ...elementProps.style,
          ...(props as any).style
        },
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        onClick,
        className: `svg-icon ${className}`,
        children: React.Children.map(elementProps.children, (child: any) => {
          if (React.isValidElement(child) && typeof child.type === 'string') {
            // 只处理直接子元素，将fill转换为currentColor
            const childProps = child.props as any;
            if (childProps.fill && childProps.fill !== 'none') {
              return React.cloneElement(child, {
                ...childProps,
                fill: 'currentColor'
              });
            }
          }
          return child;
        })
      });
    }
    
    return element;
  };

  return processSvgElement(children);
};

export default SvgWrapper; 