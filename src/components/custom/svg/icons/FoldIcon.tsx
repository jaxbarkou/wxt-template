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
                <path d="M8.1665 2.33337L12.8332 7.00004L8.1665 11.6667M1.1665 2.33337L5.83317 7.00004L1.1665 11.6667" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </SvgWrapper>
    );
};

export default StarIcon; 