"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_qrcode_svg_1 = require("react-native-qrcode-svg");
const useTheme_1 = require("@hooks/useTheme");
const CONST_1 = require("@src/CONST");
function QRCode({ url, logo, svgLogo, svgLogoFillColor, logoBackgroundColor, getRef, size = 120, color, backgroundColor, logoRatio = CONST_1.default.QR.DEFAULT_LOGO_SIZE_RATIO, logoMarginRatio = CONST_1.default.QR.DEFAULT_LOGO_MARGIN_RATIO, }) {
    const theme = (0, useTheme_1.default)();
    return (<react_native_qrcode_svg_1.default getRef={getRef} value={url} size={size} logo={logo} logoSVG={svgLogo} logoColor={svgLogoFillColor} logoBackgroundColor={logoBackgroundColor ?? theme.appBG} logoSize={size * logoRatio} logoMargin={size * logoMarginRatio} logoBorderRadius={size} backgroundColor={backgroundColor ?? theme.appBG} color={color ?? theme.text}/>);
}
QRCode.displayName = 'QRCode';
exports.default = QRCode;
