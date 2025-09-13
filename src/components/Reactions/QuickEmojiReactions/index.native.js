"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseQuickEmojiReactions_1 = require("./BaseQuickEmojiReactions");
function QuickEmojiReactions({ closeContextMenu, ...rest }) {
    const onPressOpenPicker = (openPicker) => {
        openPicker?.();
    };
    return (<BaseQuickEmojiReactions_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} onPressOpenPicker={onPressOpenPicker}/>);
}
QuickEmojiReactions.displayName = 'QuickEmojiReactions';
exports.default = QuickEmojiReactions;
