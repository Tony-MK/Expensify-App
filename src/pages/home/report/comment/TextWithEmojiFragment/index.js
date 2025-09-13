"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Text_1 = require("@components/Text");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var convertToLTR_1 = require("@libs/convertToLTR");
var EmojiUtils_1 = require("@libs/EmojiUtils");
function TextWithEmojiFragment(_a) {
    var _b = _a.message, message = _b === void 0 ? '' : _b, style = _a.style, _c = _a.alignCustomEmoji, alignCustomEmoji = _c === void 0 ? false : _c;
    var styles = (0, useThemeStyles_1.default)();
    var processedTextArray = (0, react_1.useMemo)(function () { return (0, EmojiUtils_1.splitTextWithEmojis)(message); }, [message]);
    return (<Text_1.default style={style}>
            {processedTextArray.map(function (_a, index) {
            var text = _a.text, isEmoji = _a.isEmoji;
            return isEmoji ? (<Text_1.default 
            // eslint-disable-next-line react/no-array-index-key
            key={index} style={alignCustomEmoji ? style : styles.emojisWithTextFontSize}>
                        {text}
                    </Text_1.default>) : ((0, convertToLTR_1.default)(text));
        })}
        </Text_1.default>);
}
TextWithEmojiFragment.displayName = 'TextWithEmojiFragment';
exports.default = TextWithEmojiFragment;
