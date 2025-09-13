"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const Browser = require("@libs/Browser");
const EmojiUtils = require("@libs/EmojiUtils");
function ZeroWidthView({ text = '', displayAsGroup = false }) {
    const firstLetterIsEmoji = EmojiUtils.isFirstLetterEmoji(text);
    if (firstLetterIsEmoji && !displayAsGroup && !Browser.isMobile()) {
        return <Text_1.default>&#x200b;</Text_1.default>;
    }
    return null;
}
ZeroWidthView.displayName = 'ZeroWidthView';
exports.default = ZeroWidthView;
