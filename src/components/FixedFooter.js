"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function FixedFooter({ style, children, addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding, shouldStickToBottom = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const bottomSafeAreaPaddingStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({
        addBottomSafeAreaPadding,
        addOfflineIndicatorBottomSafeAreaPadding,
        additionalPaddingBottom: styles.pb5.paddingBottom,
        styleProperty: shouldStickToBottom ? 'bottom' : 'paddingBottom',
    });
    const footerStyle = (0, react_1.useMemo)(() => [shouldStickToBottom && styles.stickToBottom, bottomSafeAreaPaddingStyle], [bottomSafeAreaPaddingStyle, shouldStickToBottom, styles.stickToBottom]);
    if (!children) {
        return null;
    }
    return <react_native_1.View style={[styles.ph5, styles.flexShrink0, footerStyle, style]}>{children}</react_native_1.View>;
}
FixedFooter.displayName = 'FixedFooter';
exports.default = FixedFooter;
