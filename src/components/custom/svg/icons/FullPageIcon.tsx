import SvgWrapper from '../SvgWrapper';

const StarIcon = ({
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
                <path d="M5.57143 12H2V8.42857M8.42857 2H12V5.57143" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </SvgWrapper>
    );
};

export default StarIcon; 