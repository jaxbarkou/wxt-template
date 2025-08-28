import SvgWrapper from "../SvgWrapper";

const HelpIcon = ({
  size = 20,
  color = "#979797",
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
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M4.33545 4.29294C4.43508 3.98594 4.61759 3.71273 4.86296 3.50303C5.10832 3.29334 5.40721 3.15554 5.72599 3.10496C6.04477 3.05439 6.37113 3.0929 6.66935 3.21635C6.96758 3.3398 7.22585 3.54344 7.41561 3.80452C7.60537 4.06561 7.71901 4.37399 7.74438 4.69576C7.76975 5.01753 7.70558 5.34013 7.55907 5.62773C7.41256 5.91532 7.18963 6.15662 6.91444 6.32528C6.63924 6.49393 6.32277 6.5832 6 6.5832V7.1668M6 11.25C3.1005 11.25 0.75 8.89949 0.75 6C0.75 3.1005 3.1005 0.75 6 0.75C8.89949 0.75 11.25 3.1005 11.25 6C11.25 8.89949 8.89949 11.25 6 11.25ZM6.02905 8.91667V8.975L5.97095 8.97511V8.91667H6.02905Z"
          stroke="#979797"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </SvgWrapper>
  );
};

export default HelpIcon;
