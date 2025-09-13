"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReportActionAvatar_1 = require("./ReportActionAvatar");
const useReportActionAvatars_1 = require("./useReportActionAvatars");
/**
 * The component that renders proper user avatars based on either:
 *
 * - policyID - this can be passed if we have no other option, and we want to display workspace avatar, it makes component ignore the props below
 * - accountIDs - if this is passed, it is prioritized and render even if report or action has different avatars attached, useful for option items, menu items etc.
 * - action - this is useful when we want to display avatars of chat threads, messages, report/trip previews etc.
 * - reportID - this can be passed without above props, when we want to display chat report avatars, DM chat avatars etc.
 *
 */
function ReportActionAvatars({ reportID: potentialReportID, action, accountIDs: passedAccountIDs = [], policyID, size = CONST_1.default.AVATAR_SIZE.DEFAULT, shouldShowTooltip = true, horizontalStacking, singleAvatarContainerStyle, subscriptAvatarBorderColor, noRightMarginOnSubscriptContainer = false, subscriptCardFeed, secondaryAvatarContainerStyle, useMidSubscriptSizeForMultipleAvatars = false, isInReportAction = false, useProfileNavigationWrapper, fallbackDisplayName, invitedEmailsToAccountIDs, shouldUseCustomFallbackAvatar = false, }) {
    const accountIDs = passedAccountIDs.filter((accountID) => accountID !== CONST_1.default.DEFAULT_NUMBER_ID);
    const reportID = potentialReportID ??
        ([CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW, CONST_1.default.REPORT.ACTIONS.TYPE.TRIP_PREVIEW].find((act) => act === action?.actionName) ? action?.childReportID : undefined);
    // reportID can be an empty string causing Onyx to fetch the whole collection
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID || undefined}`, { canBeMissing: true });
    const shouldStackHorizontally = !!horizontalStacking;
    const isHorizontalStackingAnObject = shouldStackHorizontally && typeof horizontalStacking !== 'boolean';
    const { isHovered = false } = isHorizontalStackingAnObject ? horizontalStacking : {};
    const { avatarType: notPreciseAvatarType, avatars: icons, details: { delegateAccountID }, source, } = (0, useReportActionAvatars_1.default)({
        report,
        action,
        shouldStackHorizontally,
        shouldUseCardFeed: !!subscriptCardFeed,
        accountIDs,
        policyID,
        fallbackDisplayName,
        invitedEmailsToAccountIDs,
        shouldUseCustomFallbackAvatar,
    });
    let avatarType = notPreciseAvatarType;
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE && !icons.length) {
        return null;
    }
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE) {
        avatarType = shouldStackHorizontally ? CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE_HORIZONTAL : CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE_DIAGONAL;
    }
    const [primaryAvatar, secondaryAvatar] = icons;
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT && (!!secondaryAvatar?.name || !!subscriptCardFeed)) {
        return (<ReportActionAvatar_1.default.Subscript primaryAvatar={primaryAvatar} secondaryAvatar={secondaryAvatar} size={size} shouldShowTooltip={shouldShowTooltip} noRightMarginOnContainer={noRightMarginOnSubscriptContainer} subscriptAvatarBorderColor={subscriptAvatarBorderColor} subscriptCardFeed={subscriptCardFeed} useProfileNavigationWrapper={useProfileNavigationWrapper} fallbackDisplayName={fallbackDisplayName} reportID={reportID}/>);
    }
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE_HORIZONTAL) {
        return (<ReportActionAvatar_1.default.Multiple.Horizontal 
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...(isHorizontalStackingAnObject ? horizontalStacking : {})} size={size} icons={icons} isInReportAction={isInReportAction} shouldShowTooltip={shouldShowTooltip} useProfileNavigationWrapper={useProfileNavigationWrapper} fallbackDisplayName={fallbackDisplayName} reportID={reportID}/>);
    }
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE_DIAGONAL && !!secondaryAvatar?.name) {
        return (<ReportActionAvatar_1.default.Multiple.Diagonal shouldShowTooltip={shouldShowTooltip} size={size} icons={icons} isInReportAction={isInReportAction} useMidSubscriptSize={useMidSubscriptSizeForMultipleAvatars} secondaryAvatarContainerStyle={secondaryAvatarContainerStyle} isHovered={isHovered} fallbackDisplayName={fallbackDisplayName} useProfileNavigationWrapper={useProfileNavigationWrapper} reportID={reportID}/>);
    }
    return (<ReportActionAvatar_1.default.Single avatar={primaryAvatar} size={size} containerStyles={shouldStackHorizontally ? [] : singleAvatarContainerStyle} shouldShowTooltip={shouldShowTooltip} accountID={Number(delegateAccountID ?? primaryAvatar.id ?? CONST_1.default.DEFAULT_NUMBER_ID)} delegateAccountID={source.action?.delegateAccountID} fallbackIcon={primaryAvatar.fallbackIcon} fallbackDisplayName={fallbackDisplayName} useProfileNavigationWrapper={useProfileNavigationWrapper} reportID={reportID}/>);
}
exports.default = ReportActionAvatars;
