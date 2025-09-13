"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils_1 = require("@libs/EmojiUtils");
function TextWithTooltip({ text, style, numberOfLines = 1, forwardedFSClass }) {
    const styles = (0, useThemeStyles_1.default)();
    const processedTextArray = (0, EmojiUtils_1.splitTextWithEmojis)(text);
    return (<Text_1.default style={style} numberOfLines={numberOfLines} fsClass={forwardedFSClass}>
            {processedTextArray.length !== 0 ? (0, EmojiUtils_1.getProcessedText)(processedTextArray, [style, styles.emojisFontFamily]) : text}
        </Text_1.default>);
}
TextWithTooltip.displayName = 'TextWithTooltip';
exports.default = TextWithTooltip;
