import SvgWrapper from '../SvgWrapper';

const PromptBorIcon = ({
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
                <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM8.5 11.5H7.5V10.5H8.5V11.5ZM8.5 9.5H7.5V4.5H8.5V9.5Z" fill="currentColor"/>
            </svg>
        </SvgWrapper>
    );
};

export default PromptBorIcon; 