"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Text_1 = require("@components/Text");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var EmojiUtils_1 = require("@libs/EmojiUtils");
function EmojiWithTooltip(_a) {
    var emojiCode = _a.emojiCode, _b = _a.style, style = _b === void 0 ? {} : _b;
    var isCustomEmoji = (0, react_1.useMemo)(function () { return (0, EmojiUtils_1.containsCustomEmoji)(emojiCode); }, [emojiCode]);
    var styles = (0, useThemeStyles_1.default)();
    return <Text_1.default style={[style, isCustomEmoji && styles.customEmojiFont]}>{emojiCode}</Text_1.default>;
}
EmojiWithTooltip.displayName = 'EmojiWithTooltip';
exports.default = EmojiWithTooltip;
