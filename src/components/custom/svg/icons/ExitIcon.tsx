import SvgWrapper from "../SvgWrapper";

const ExitIcon = ({
  size = 20,
  color = "currentColor",
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
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M10 13V11.5M11.5 10H13M3.28747 6.46973L2.22681 7.53039C1.05523 8.70196 1.05599 10.6012 2.22757 11.7728C3.39914 12.9444 5.2981 12.9447 6.46967 11.7731L7.53067 10.7123M2.5 4H1M4 1V2.5M6.46973 3.28783L7.53039 2.22717C8.70196 1.0556 10.6012 1.05526 11.7728 2.22683C12.9444 3.39841 12.944 5.2981 11.7725 6.46967L10.7119 7.5303"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </SvgWrapper>
  );
};

export default ExitIcon;
