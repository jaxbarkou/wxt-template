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
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M1 13H13M1 13V9.92032L7 3.76097M1 13L4 13L9.99999 6.84064M7 3.76097L9.15147 1.55234L9.15277 1.55103C9.44893 1.247 9.59727 1.09472 9.76827 1.03768C9.91891 0.987439 10.0812 0.987439 10.2318 1.03768C10.4027 1.09468 10.5509 1.24679 10.8466 1.55039L12.1515 2.88989C12.4485 3.19479 12.597 3.34731 12.6527 3.5231C12.7016 3.67774 12.7016 3.84431 12.6527 3.99894C12.5971 4.17461 12.4487 4.3269 12.1521 4.63136L12.1515 4.63202L9.99999 6.84064M7 3.76097L9.99999 6.84064"
          stroke="#2C2C2C"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </SvgWrapper>
  );
};

export default StarIcon;
