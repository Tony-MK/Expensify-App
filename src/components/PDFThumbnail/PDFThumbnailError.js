"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
function PDFThumbnailError() {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    return (<react_native_1.View style={[styles.justifyContentCenter, styles.pdfErrorPlaceholder, styles.alignItemsCenter]}>
            <Icon_1.default src={Expensicons.ReceiptSlash} width={variables_1.default.receiptPlaceholderIconWidth} height={variables_1.default.receiptPlaceholderIconHeight} fill={theme.icon}/>
        </react_native_1.View>);
}
exports.default = PDFThumbnailError;
