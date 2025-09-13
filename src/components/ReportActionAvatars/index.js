"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useOnyx_1 = require("@hooks/useOnyx");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ReportActionAvatar_1 = require("./ReportActionAvatar");
var useReportActionAvatars_1 = require("./useReportActionAvatars");
/**
 * The component that renders proper user avatars based on either:
 *
 * - policyID - this can be passed if we have no other option, and we want to display workspace avatar, it makes component ignore the props below
 * - accountIDs - if this is passed, it is prioritized and render even if report or action has different avatars attached, useful for option items, menu items etc.
 * - action - this is useful when we want to display avatars of chat threads, messages, report/trip previews etc.
 * - reportID - this can be passed without above props, when we want to display chat report avatars, DM chat avatars etc.
 *
 */
function ReportActionAvatars(_a) {
    var _b, _c;
    var potentialReportID = _a.reportID, action = _a.action, _d = _a.accountIDs, passedAccountIDs = _d === void 0 ? [] : _d, policyID = _a.policyID, _e = _a.size, size = _e === void 0 ? CONST_1.default.AVATAR_SIZE.DEFAULT : _e, _f = _a.shouldShowTooltip, shouldShowTooltip = _f === void 0 ? true : _f, horizontalStacking = _a.horizontalStacking, singleAvatarContainerStyle = _a.singleAvatarContainerStyle, subscriptAvatarBorderColor = _a.subscriptAvatarBorderColor, _g = _a.noRightMarginOnSubscriptContainer, noRightMarginOnSubscriptContainer = _g === void 0 ? false : _g, subscriptCardFeed = _a.subscriptCardFeed, secondaryAvatarContainerStyle = _a.secondaryAvatarContainerStyle, _h = _a.useMidSubscriptSizeForMultipleAvatars, useMidSubscriptSizeForMultipleAvatars = _h === void 0 ? false : _h, _j = _a.isInReportAction, isInReportAction = _j === void 0 ? false : _j, useProfileNavigationWrapper = _a.useProfileNavigationWrapper, fallbackDisplayName = _a.fallbackDisplayName, invitedEmailsToAccountIDs = _a.invitedEmailsToAccountIDs, _k = _a.shouldUseCustomFallbackAvatar, shouldUseCustomFallbackAvatar = _k === void 0 ? false : _k;
    var accountIDs = passedAccountIDs.filter(function (accountID) { return accountID !== CONST_1.default.DEFAULT_NUMBER_ID; });
    var reportID = potentialReportID !== null && potentialReportID !== void 0 ? potentialReportID : ([CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW, CONST_1.default.REPORT.ACTIONS.TYPE.TRIP_PREVIEW].find(function (act) { return act === (action === null || action === void 0 ? void 0 : action.actionName); }) ? action === null || action === void 0 ? void 0 : action.childReportID : undefined);
    // reportID can be an empty string causing Onyx to fetch the whole collection
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var report = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID || undefined), { canBeMissing: true })[0];
    var shouldStackHorizontally = !!horizontalStacking;
    var isHorizontalStackingAnObject = shouldStackHorizontally && typeof horizontalStacking !== 'boolean';
    var _l = (isHorizontalStackingAnObject ? horizontalStacking : {}).isHovered, isHovered = _l === void 0 ? false : _l;
    var _m = (0, useReportActionAvatars_1.default)({
        report: report,
        action: action,
        shouldStackHorizontally: shouldStackHorizontally,
        shouldUseCardFeed: !!subscriptCardFeed,
        accountIDs: accountIDs,
        policyID: policyID,
        fallbackDisplayName: fallbackDisplayName,
        invitedEmailsToAccountIDs: invitedEmailsToAccountIDs,
        shouldUseCustomFallbackAvatar: shouldUseCustomFallbackAvatar,
    }), notPreciseAvatarType = _m.avatarType, icons = _m.avatars, delegateAccountID = _m.details.delegateAccountID, source = _m.source;
    var avatarType = notPreciseAvatarType;
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE && !icons.length) {
        return null;
    }
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE) {
        avatarType = shouldStackHorizontally ? CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE_HORIZONTAL : CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE_DIAGONAL;
    }
    var primaryAvatar = icons[0], secondaryAvatar = icons[1];
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT && (!!(secondaryAvatar === null || secondaryAvatar === void 0 ? void 0 : secondaryAvatar.name) || !!subscriptCardFeed)) {
        return (<ReportActionAvatar_1.default.Subscript primaryAvatar={primaryAvatar} secondaryAvatar={secondaryAvatar} size={size} shouldShowTooltip={shouldShowTooltip} noRightMarginOnContainer={noRightMarginOnSubscriptContainer} subscriptAvatarBorderColor={subscriptAvatarBorderColor} subscriptCardFeed={subscriptCardFeed} useProfileNavigationWrapper={useProfileNavigationWrapper} fallbackDisplayName={fallbackDisplayName} reportID={reportID}/>);
    }
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE_HORIZONTAL) {
        return (<ReportActionAvatar_1.default.Multiple.Horizontal 
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...(isHorizontalStackingAnObject ? horizontalStacking : {})} size={size} icons={icons} isInReportAction={isInReportAction} shouldShowTooltip={shouldShowTooltip} useProfileNavigationWrapper={useProfileNavigationWrapper} fallbackDisplayName={fallbackDisplayName} reportID={reportID}/>);
    }
    if (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE_DIAGONAL && !!(secondaryAvatar === null || secondaryAvatar === void 0 ? void 0 : secondaryAvatar.name)) {
        return (<ReportActionAvatar_1.default.Multiple.Diagonal shouldShowTooltip={shouldShowTooltip} size={size} icons={icons} isInReportAction={isInReportAction} useMidSubscriptSize={useMidSubscriptSizeForMultipleAvatars} secondaryAvatarContainerStyle={secondaryAvatarContainerStyle} isHovered={isHovered} fallbackDisplayName={fallbackDisplayName} useProfileNavigationWrapper={useProfileNavigationWrapper} reportID={reportID}/>);
    }
    return (<ReportActionAvatar_1.default.Single avatar={primaryAvatar} size={size} containerStyles={shouldStackHorizontally ? [] : singleAvatarContainerStyle} shouldShowTooltip={shouldShowTooltip} accountID={Number((_b = delegateAccountID !== null && delegateAccountID !== void 0 ? delegateAccountID : primaryAvatar.id) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID)} delegateAccountID={(_c = source.action) === null || _c === void 0 ? void 0 : _c.delegateAccountID} fallbackIcon={primaryAvatar.fallbackIcon} fallbackDisplayName={fallbackDisplayName} useProfileNavigationWrapper={useProfileNavigationWrapper} reportID={reportID}/>);
}
exports.default = ReportActionAvatars;
