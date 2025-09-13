"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const TextWithEllipsis_1 = require("@components/TextWithEllipsis");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportUtils = require("@libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ReportTypingIndicator({ reportID }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [userTypingStatuses] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_TYPING}${reportID}`);
    const styles = (0, useThemeStyles_1.default)();
    const usersTyping = (0, react_1.useMemo)(() => Object.keys(userTypingStatuses ?? {}).filter((loginOrAccountID) => userTypingStatuses?.[loginOrAccountID]), [userTypingStatuses]);
    const firstUserTyping = usersTyping.at(0);
    const isUserTypingADisplayName = Number.isNaN(Number(firstUserTyping));
    // If we are offline, the user typing statuses are not up-to-date so do not show them
    if (!!isOffline || !firstUserTyping) {
        return null;
    }
    // If the user is typing on OldDot, firstUserTyping will be a string (the user's displayName)
    const firstUserTypingDisplayName = isUserTypingADisplayName
        ? firstUserTyping
        : ReportUtils.getDisplayNameForParticipant({ accountID: Number(firstUserTyping), shouldFallbackToHidden: false });
    if (usersTyping.length === 1) {
        return (<TextWithEllipsis_1.default 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing doesn't achieve the same result in this case
        leadingText={firstUserTypingDisplayName || translate('common.someone')} trailingText={` ${translate('reportTypingIndicator.isTyping')}`} textStyle={[styles.chatItemComposeSecondaryRowSubText]} wrapperStyle={[styles.chatItemComposeSecondaryRow, styles.flex1]} leadingTextParentStyle={styles.chatItemComposeSecondaryRowOffset}/>);
    }
    return (<Text_1.default style={[styles.chatItemComposeSecondaryRowSubText, styles.chatItemComposeSecondaryRowOffset]} numberOfLines={1}>
            {translate('reportTypingIndicator.multipleMembers')}
            {` ${translate('reportTypingIndicator.areTyping')}`}
        </Text_1.default>);
}
ReportTypingIndicator.displayName = 'ReportTypingIndicator';
exports.default = (0, react_1.memo)(ReportTypingIndicator);
