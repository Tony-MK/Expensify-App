"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PopoverWithMeasuredContent_1 = require("@components/PopoverWithMeasuredContent");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useBasePopoverReactionList_1 = require("@hooks/useBasePopoverReactionList");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const BaseReactionList_1 = require("@pages/home/report/ReactionList/BaseReactionList");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function BasePopoverReactionList({ emojiName, reportActionID, currentUserPersonalDetails }, ref) {
    const { preferredLocale } = (0, useLocalize_1.default)();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const reactionReportActionID = reportActionID || CONST_1.default.DEFAULT_NUMBER_ID;
    const [emojiReactions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reactionReportActionID}`, { canBeMissing: true });
    const { isPopoverVisible, hideReactionList, showReactionList, popoverAnchorPosition, reactionListRef, getReactionInformation } = (0, useBasePopoverReactionList_1.default)({
        emojiName,
        emojiReactions,
        accountID: currentUserPersonalDetails.accountID,
        reportActionID,
        preferredLocale,
    });
    // Get the reaction information
    const { emojiCodes, reactionCount, hasUserReacted, users, isReady } = getReactionInformation();
    (0, react_1.useImperativeHandle)(ref, () => ({ hideReactionList, showReactionList }));
    return (<PopoverWithMeasuredContent_1.default isVisible={isPopoverVisible && isReady} onClose={hideReactionList} anchorPosition={popoverAnchorPosition} animationIn="fadeIn" disableAnimation={false} shouldSetModalVisibility={false} fullscreen anchorRef={reactionListRef}>
            <BaseReactionList_1.default isVisible users={users} emojiName={emojiName} emojiCodes={emojiCodes} emojiCount={reactionCount} onClose={hideReactionList} hasUserReacted={hasUserReacted}/>
        </PopoverWithMeasuredContent_1.default>);
}
exports.default = (0, withCurrentUserPersonalDetails_1.default)((0, react_1.forwardRef)(BasePopoverReactionList));
