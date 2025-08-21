import SvgWrapper from "../SvgWrapper";

const StarIcon = ({
  size = 20,
  color = "#6c757d",
  hoverColor,
  ...props
}: {
  size?: number;
  color?: string;
  hoverColor?: string;
  [key: string]: any;
}) => {
  return (
    <SvgWrapper size={size} color={color} hoverColor={hoverColor} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M9.88907 11.6667L12.5557 9M12.5557 9L9.88907 6.33333M12.5557 9L5.44463 9M9.00018 17C13.4185 17 17.0002 13.4183 17.0002 9C17.0002 4.58172 13.4185 1 9.00018 1C4.5819 1 1.00018 4.58172 1.00018 9C1.00018 13.4183 4.5819 17 9.00018 17Z"
          stroke="#2C2C2C"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </SvgWrapper>
  );
};

export default StarIcon;
