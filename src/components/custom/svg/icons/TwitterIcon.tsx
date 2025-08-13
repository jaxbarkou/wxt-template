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
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M16.7533 0H19.8409L13.1372 7.6246L21.0185 18H14.834L9.99394 11.7046L4.43066 18H1.36159L8.52893 9.84921L0.962891 0H7.29575L11.6629 5.75075L16.7533 0ZM15.6778 16.1723H17.3746L6.40563 1.73536H4.5512L15.6778 16.1723Z" fill="#979797" />
            </svg>
        </SvgWrapper>
    );
};

export default StarIcon; 