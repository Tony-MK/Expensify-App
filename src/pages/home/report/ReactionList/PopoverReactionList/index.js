"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BasePopoverReactionList_1 = require("./BasePopoverReactionList");
function PopoverReactionList(props, ref) {
    const innerReactionListRef = (0, react_1.useRef)(null);
    const [reactionListReportActionID, setReactionListReportActionID] = (0, react_1.useState)('');
    const [reactionListEmojiName, setReactionListEmojiName] = (0, react_1.useState)('');
    const showReactionList = (event, reactionListAnchor, emojiName, reportActionID) => {
        setReactionListReportActionID(reportActionID);
        setReactionListEmojiName(emojiName);
        innerReactionListRef.current?.showReactionList(event, reactionListAnchor);
    };
    const hideReactionList = () => {
        innerReactionListRef.current?.hideReactionList();
    };
    const isActiveReportAction = (actionID) => !!actionID && reactionListReportActionID === actionID;
    (0, react_1.useImperativeHandle)(ref, () => ({ showReactionList, hideReactionList, isActiveReportAction }));
    return (<BasePopoverReactionList_1.default ref={innerReactionListRef} reportActionID={reactionListReportActionID} emojiName={reactionListEmojiName}/>);
}
PopoverReactionList.displayName = 'PopoverReactionList';
exports.default = react_1.default.memo((0, react_1.forwardRef)(PopoverReactionList));
