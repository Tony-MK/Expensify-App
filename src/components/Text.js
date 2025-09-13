"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const FontUtils_1 = require("@styles/utils/FontUtils");
const variables_1 = require("@styles/variables");
const CustomStylesForChildrenProvider_1 = require("./CustomStylesForChildrenProvider");
function Text({ color, fontSize = variables_1.default.fontSizeNormal, textAlign = 'left', children, family = 'EXP_NEUE', style = {}, shouldUseDefaultLineHeight = true, ref, ...props }) {
    const theme = (0, useTheme_1.default)();
    const customStyle = (0, react_1.useContext)(CustomStylesForChildrenProvider_1.CustomStylesForChildrenContext);
    const componentStyle = {
        color: color ?? theme.text,
        fontSize,
        textAlign,
        ...FontUtils_1.default.fontFamily.platform[family],
        ...react_native_1.StyleSheet.flatten(style),
        ...react_native_1.StyleSheet.flatten(customStyle),
    };
    if (!componentStyle.lineHeight && componentStyle.fontSize === variables_1.default.fontSizeNormal && shouldUseDefaultLineHeight) {
        componentStyle.lineHeight = variables_1.default.fontSizeNormalHeight;
    }
    const isOnlyCustomEmoji = (0, react_1.useMemo)(() => {
        if (typeof children === 'string') {
            return (0, EmojiUtils_1.containsOnlyCustomEmoji)(children);
        }
        if (Array.isArray(children)) {
            return children.every((child) => {
                return child === null || child === undefined || (typeof child === 'string' && (0, EmojiUtils_1.containsOnlyCustomEmoji)(child));
            });
        }
        return false;
    }, [children]);
    if (isOnlyCustomEmoji) {
        componentStyle.fontFamily = FontUtils_1.default.fontFamily.single.CUSTOM_EMOJI_FONT?.fontFamily;
    }
    return (<react_native_1.Text allowFontScaling={false} ref={ref} style={componentStyle} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            {children}
        </react_native_1.Text>);
}
Text.displayName = 'Text';
exports.default = Text;
