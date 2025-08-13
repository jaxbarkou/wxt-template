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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17" fill="none">
                <path d="M18.6538 0.111715L0.93274 7.03561C-0.276797 7.52982 -0.266008 8.21529 0.710971 8.49701L5.26022 9.9578L15.7798 3.22455C16.2791 2.92159 16.7334 3.09037 16.3564 3.43827L7.83453 11.217L7.52405 15.9716C7.97898 15.9716 8.18936 15.7585 8.44469 15.4992L10.6534 13.3299L15.247 16.7694C16.0903 17.2417 16.7011 16.9946 16.9114 15.9716L19.9299 1.57251C20.178 0.568289 19.7333 0 19.1327 0C18.9799 0 18.8181 0.0364288 18.6538 0.111715Z" fill="#979797" />
            </svg>
        </SvgWrapper>
    );
};

export default StarIcon; 