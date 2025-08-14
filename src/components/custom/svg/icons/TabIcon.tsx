import SvgWrapper from '../SvgWrapper';

const TabIcon = ({
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 9L15 12M15 12L12 15M15 12H1M4 7L1 4M1 4L4 1M1 4H15" stroke="#2C2C2C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </SvgWrapper>
    );
};

export default TabIcon; 