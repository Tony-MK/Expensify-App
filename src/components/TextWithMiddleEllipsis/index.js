"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useTextWithMiddleEllipsis_1 = require("@hooks/useTextWithMiddleEllipsis");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function TextWithMiddleEllipsis({ text, style, textStyle }) {
    const styles = (0, useThemeStyles_1.default)();
    const ref = (0, react_1.useRef)(null);
    const displayText = (0, useTextWithMiddleEllipsis_1.default)({
        text,
        ref,
    });
    return (<react_native_1.View style={[style, styles.flexShrink1, styles.textWithMiddleEllipsisContainer]}>
            <Text_1.default style={[textStyle, styles.textWithMiddleEllipsisText]} numberOfLines={1} ref={ref}>
                {displayText}
            </Text_1.default>
        </react_native_1.View>);
}
exports.default = TextWithMiddleEllipsis;
