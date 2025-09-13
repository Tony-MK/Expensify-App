"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function EmojiWithTooltip({ emojiCode, style = {}, isMedium = false }) {
    const styles = (0, useThemeStyles_1.default)();
    return isMedium ? (<Text_1.default style={style}>
            <react_native_1.View>
                <Text_1.default style={styles.emojisWithTextFontSizeAligned}>{emojiCode}</Text_1.default>
            </react_native_1.View>
        </Text_1.default>) : (<Text_1.default style={style}>{emojiCode}</Text_1.default>);
}
EmojiWithTooltip.displayName = 'EmojiWithTooltip';
exports.default = EmojiWithTooltip;
