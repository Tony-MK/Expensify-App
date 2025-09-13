"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils_1 = require("@libs/EmojiUtils");
function EmojiWithTooltip({ emojiCode, style = {} }) {
    const isCustomEmoji = (0, react_1.useMemo)(() => (0, EmojiUtils_1.containsCustomEmoji)(emojiCode), [emojiCode]);
    const styles = (0, useThemeStyles_1.default)();
    return <Text_1.default style={[style, isCustomEmoji && styles.customEmojiFont]}>{emojiCode}</Text_1.default>;
}
EmojiWithTooltip.displayName = 'EmojiWithTooltip';
exports.default = EmojiWithTooltip;
