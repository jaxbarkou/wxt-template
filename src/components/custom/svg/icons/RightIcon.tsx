import SvgWrapper from '../SvgWrapper';

const ExpandIcon = ({
    size = 20,
    color = '#6c757d',
    hoverColor,
    ...props
}: {
    size?: number;
    color?: string;
    hoverColor?: string;
    [key: string]: any;
}) => {
    return (
        <SvgWrapper
            size={size}
            color={color}
            hoverColor={hoverColor}
            {...props}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4.6665 2.33325L9.33317 6.99992L4.6665 11.6666" stroke="#2C2C2C" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </SvgWrapper>
    );
};

export default ExpandIcon; 