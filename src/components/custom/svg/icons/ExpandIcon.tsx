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
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
                <path d="M10.56 0.685713C10.56 0.307004 10.8824 -4.75683e-07 11.28 -4.93064e-07C11.6776 -5.10446e-07 12 0.307004 12 0.685713L12 15.3143C12 15.693 11.6776 16 11.28 16C10.8824 16 10.56 15.693 10.56 15.3143L10.56 0.685713ZM5.28 0.685714C5.28 0.307005 5.60235 -2.44887e-07 6 -2.62268e-07C6.39764 -2.7965e-07 6.72 0.307005 6.72 0.685713L6.72 15.3143C6.72 15.693 6.39764 16 6 16C5.60236 16 5.28 15.693 5.28 15.3143L5.28 0.685714ZM-6.69409e-07 0.685714C-6.85963e-07 0.307005 0.322354 -1.40906e-08 0.719999 -3.14722e-08C1.11764 -4.88538e-08 1.44 0.307005 1.44 0.685714L1.44 15.3143C1.44 15.693 1.11765 16 0.72 16C0.322355 16 -1.34196e-08 15.693 -2.99735e-08 15.3143L-6.69409e-07 0.685714Z" fill="#F67C00" />
            </svg>
        </SvgWrapper>
    );
};

export default ExpandIcon; 