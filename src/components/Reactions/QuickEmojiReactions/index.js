"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
const BaseQuickEmojiReactions_1 = require("./BaseQuickEmojiReactions");
function QuickEmojiReactions({ closeContextMenu, ...rest }) {
    const onPressOpenPicker = (openPicker) => {
        openPicker?.(ReportActionContextMenu_1.contextMenuRef.current?.contentRef, {
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
        });
    };
    return (<BaseQuickEmojiReactions_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} onPressOpenPicker={onPressOpenPicker} onWillShowPicker={closeContextMenu}/>);
}
QuickEmojiReactions.displayName = 'QuickEmojiReactions';
exports.default = QuickEmojiReactions;
