import SvgWrapper from "../SvgWrapper";

const EditIcon = ({
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
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
      >
        <path
          d="M1 10.0919H10.3333M1 10.0919V7.75853L5.66667 3.09186M1 10.0919L3.33333 10.0919L7.99999 5.42519M5.66667 3.09186L7.34003 1.41848L7.34104 1.41749C7.57139 1.18714 7.68677 1.07176 7.81977 1.02855C7.93693 0.990483 8.06314 0.990483 8.1803 1.02855C8.3132 1.07173 8.42845 1.18698 8.65847 1.417L9.67335 2.43188C9.90436 2.66289 10.0199 2.77845 10.0632 2.91164C10.1013 3.0288 10.1013 3.155 10.0632 3.27216C10.0199 3.40526 9.90456 3.52064 9.67388 3.75132L9.67337 3.75182L7.99999 5.42519M5.66667 3.09186L7.99999 5.42519"
          stroke="#979797"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </SvgWrapper>
  );
};

export default EditIcon;
