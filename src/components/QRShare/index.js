"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_wordmark_svg_1 = require("@assets/images/expensify-wordmark.svg");
const ImageSVG_1 = require("@components/ImageSVG");
const QRCode_1 = require("@components/QRCode");
const Text_1 = require("@components/Text");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const variables_1 = require("@styles/variables");
function QRShare({ url, title, subtitle, logo, svgLogo, svgLogoFillColor, logoBackgroundColor, logoRatio, logoMarginRatio, shouldShowExpensifyLogo = true, additionalStyles, size }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const qrCodeContainerWidth = shouldUseNarrowLayout ? windowWidth : variables_1.default.sideBarWidth;
    const [qrCodeSize, setQrCodeSize] = (0, react_1.useState)(qrCodeContainerWidth - styles.ph5.paddingHorizontal * 2 - variables_1.default.qrShareHorizontalPadding * 2);
    const svgRef = (0, react_1.useRef)(undefined);
    (0, react_1.useImperativeHandle)(ref, () => ({
        getSvg: () => svgRef.current,
    }), []);
    const onLayout = (event) => {
        const containerWidth = event.nativeEvent.layout.width - variables_1.default.qrShareHorizontalPadding * 2 || 0;
        setQrCodeSize(Math.max(1, containerWidth));
    };
    return (<react_native_1.View style={[styles.shareCodeContainer, additionalStyles]} onLayout={onLayout}>
            {shouldShowExpensifyLogo && (<react_native_1.View style={styles.expensifyQrLogo}>
                    <ImageSVG_1.default contentFit="contain" src={expensify_wordmark_svg_1.default} fill={theme.QRLogo}/>
                </react_native_1.View>)}

            <QRCode_1.default getRef={(svg) => (svgRef.current = svg)} url={url} svgLogo={svgLogo} svgLogoFillColor={svgLogoFillColor} logoBackgroundColor={logoBackgroundColor} logo={logo} size={size ?? qrCodeSize} logoRatio={logoRatio} logoMarginRatio={logoMarginRatio}/>

            {!!title && (<Text_1.default family="EXP_NEW_KANSAS_MEDIUM" fontSize={variables_1.default.fontSizeXLarge} numberOfLines={2} style={styles.qrShareTitle}>
                    {title}
                </Text_1.default>)}

            {!!subtitle && (<Text_1.default fontSize={variables_1.default.fontSizeLabel} numberOfLines={2} style={[styles.mt1, styles.textAlignCenter]} color={theme.textSupporting}>
                    {subtitle}
                </Text_1.default>)}
        </react_native_1.View>);
}
QRShare.displayName = 'QRShare';
exports.default = (0, react_1.forwardRef)(QRShare);
