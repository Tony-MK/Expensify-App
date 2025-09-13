"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function TextWithEllipsis({ leadingText, trailingText, textStyle, leadingTextParentStyle, wrapperStyle }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.flexRow, wrapperStyle]}>
            <react_native_1.View style={[styles.flexShrink1, leadingTextParentStyle]}>
                <Text_1.default style={textStyle} numberOfLines={1}>
                    {leadingText}
                </Text_1.default>
            </react_native_1.View>
            <react_native_1.View style={styles.flexShrink0}>
                <Text_1.default style={textStyle}>{trailingText}</Text_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
TextWithEllipsis.displayName = 'TextWithEllipsis';
exports.default = TextWithEllipsis;
