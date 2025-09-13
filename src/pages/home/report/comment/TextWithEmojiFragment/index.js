"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const convertToLTR_1 = require("@libs/convertToLTR");
const EmojiUtils_1 = require("@libs/EmojiUtils");
function TextWithEmojiFragment({ message = '', style, alignCustomEmoji = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const processedTextArray = (0, react_1.useMemo)(() => (0, EmojiUtils_1.splitTextWithEmojis)(message), [message]);
    return (<Text_1.default style={style}>
            {processedTextArray.map(({ text, isEmoji }, index) => isEmoji ? (<Text_1.default 
        // eslint-disable-next-line react/no-array-index-key
        key={index} style={alignCustomEmoji ? style : styles.emojisWithTextFontSize}>
                        {text}
                    </Text_1.default>) : ((0, convertToLTR_1.default)(text)))}
        </Text_1.default>);
}
TextWithEmojiFragment.displayName = 'TextWithEmojiFragment';
exports.default = TextWithEmojiFragment;
