import SvgWrapper from "../SvgWrapper";

const HistoryIcon = ({
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
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.7692 8C14.7692 4.26146 11.7385 1.23077 8 1.23077C4.26146 1.23077 1.23077 4.26146 1.23077 8C1.23077 11.7385 4.26146 14.7692 8 14.7692C11.7385 14.7692 14.7692 11.7385 14.7692 8ZM7.38462 3.89744C7.38462 3.55757 7.66013 3.28205 8 3.28205C8.33987 3.28205 8.61539 3.55757 8.61539 3.89744V7.38462H12.1026C12.4424 7.38462 12.7179 7.66013 12.7179 8C12.7179 8.33987 12.4424 8.61539 12.1026 8.61539H8C7.66013 8.61539 7.38462 8.33987 7.38462 8V3.89744ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
          fill="currentColor"
        />
      </svg>
    </SvgWrapper>
  );
};

export default HistoryIcon;
