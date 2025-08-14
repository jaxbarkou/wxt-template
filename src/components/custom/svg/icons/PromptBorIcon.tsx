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
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5.33545 5.29294C5.43508 4.98594 5.61759 4.71273 5.86296 4.50303C6.10832 4.29334 6.40721 4.15554 6.72599 4.10496C7.04477 4.05439 7.37113 4.0929 7.66935 4.21635C7.96758 4.3398 8.22585 4.54344 8.41561 4.80452C8.60537 5.06561 8.71901 5.37399 8.74438 5.69576C8.76975 6.01753 8.70558 6.34013 8.55907 6.62773C8.41256 6.91532 8.18963 7.15662 7.91444 7.32528C7.63924 7.49393 7.32277 7.5832 7 7.5832V8.1668M7 12.25C4.1005 12.25 1.75 9.89949 1.75 7C1.75 4.1005 4.1005 1.75 7 1.75C9.89949 1.75 12.25 4.1005 12.25 7C12.25 9.89949 9.89949 12.25 7 12.25ZM7.02905 9.91667V9.975L6.97095 9.97511V9.91667H7.02905Z" stroke="#979797" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </SvgWrapper>
    );
};

export default PromptBorIcon; 