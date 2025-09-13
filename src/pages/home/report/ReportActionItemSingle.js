"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
var ReportActionAvatars_1 = require("@components/ReportActionAvatars");
var useReportActionAvatars_1 = require("@components/ReportActionAvatars/useReportActionAvatars");
var useReportPreviewSenderID_1 = require("@components/ReportActionAvatars/useReportPreviewSenderID");
var Text_1 = require("@components/Text");
var Tooltip_1 = require("@components/Tooltip");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ControlSelection_1 = require("@libs/ControlSelection");
var DateUtils_1 = require("@libs/DateUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var ReportActionItemDate_1 = require("./ReportActionItemDate");
var ReportActionItemFragment_1 = require("./ReportActionItemFragment");
var showUserDetails = function (accountID) {
    Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(accountID, Navigation_1.default.getActiveRoute()));
};
var showWorkspaceDetails = function (reportID) {
    if (!reportID) {
        return;
    }
    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(reportID, Navigation_1.default.getReportRHPActiveRoute()));
};
function ReportActionItemSingle(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    var action = _a.action, children = _a.children, wrapperStyle = _a.wrapperStyle, _z = _a.showHeader, showHeader = _z === void 0 ? true : _z, _0 = _a.hasBeenFlagged, hasBeenFlagged = _0 === void 0 ? false : _0, report = _a.report, potentialIOUReport = _a.iouReport, _1 = _a.isHovered, isHovered = _1 === void 0 ? false : _1, _2 = _a.isActive, isActive = _2 === void 0 ? false : _2;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var personalDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        canBeMissing: true,
    })[0];
    var _3 = (0, useReportActionAvatars_1.default)({ report: potentialIOUReport !== null && potentialIOUReport !== void 0 ? potentialIOUReport : report, action: action }), avatarType = _3.avatarType, avatars = _3.avatars, details = _3.details, source = _3.source;
    var reportID = (_b = source.chatReport) === null || _b === void 0 ? void 0 : _b.reportID;
    var iouReportID = (_c = source.iouReport) === null || _c === void 0 ? void 0 : _c.reportID;
    var primaryAvatar = avatars[0], secondaryAvatar = avatars[1];
    var reportPreviewSenderID = (0, useReportPreviewSenderID_1.default)({
        iouReport: potentialIOUReport,
        action: action,
        chatReport: source.chatReport,
    });
    var delegateAccountID = (0, ReportActionsUtils_1.getDelegateAccountIDFromReportAction)(action);
    var mainAccountID = delegateAccountID ? ((_d = reportPreviewSenderID !== null && reportPreviewSenderID !== void 0 ? reportPreviewSenderID : potentialIOUReport === null || potentialIOUReport === void 0 ? void 0 : potentialIOUReport.ownerAccountID) !== null && _d !== void 0 ? _d : action === null || action === void 0 ? void 0 : action.childOwnerAccountID) : ((_e = details.accountID) !== null && _e !== void 0 ? _e : CONST_1.default.DEFAULT_NUMBER_ID);
    var mainAccountLogin = mainAccountID ? ((_g = (_f = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[mainAccountID]) === null || _f === void 0 ? void 0 : _f.login) !== null && _g !== void 0 ? _g : details.login) : details.login;
    var accountOwnerDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(String(mainAccountLogin !== null && mainAccountLogin !== void 0 ? mainAccountLogin : ''));
    // Vacation delegate details for submitted action
    var vacationer = (0, ReportActionsUtils_1.getVacationer)(action);
    var submittedTo = (0, ReportActionsUtils_1.getSubmittedTo)(action);
    var vacationDelegateDetailsForSubmit = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(vacationer !== null && vacationer !== void 0 ? vacationer : '');
    var submittedToDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(submittedTo !== null && submittedTo !== void 0 ? submittedTo : '');
    // Vacation delegate details for approved action
    var managerOnVacation = (0, ReportActionsUtils_1.getManagerOnVacation)(action);
    var vacationDelegateDetailsForApprove = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(managerOnVacation !== null && managerOnVacation !== void 0 ? managerOnVacation : '');
    var headingText = avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE ? "".concat(primaryAvatar.name, " & ").concat(secondaryAvatar.name) : primaryAvatar.name;
    // Since the display name for a report action message is delivered with the report history as an array of fragments
    // we'll need to take the displayName from personal details and have it be in the same format for now. Eventually,
    // we should stop referring to the report history items entirely for this information.
    var personArray = headingText
        ? [
            {
                type: 'TEXT',
                text: headingText,
            },
        ]
        : action === null || action === void 0 ? void 0 : action.person;
    var showActorDetails = (0, react_1.useCallback)(function () {
        if (details.isWorkspaceActor) {
            showWorkspaceDetails(reportID);
        }
        else {
            // Show participants page IOU report preview
            if (iouReportID && details.shouldDisplayAllActors) {
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_PARTICIPANTS.getRoute(iouReportID, Navigation_1.default.getReportRHPActiveRoute()));
                return;
            }
            showUserDetails(Number(primaryAvatar.id));
        }
    }, [details.isWorkspaceActor, reportID, iouReportID, details.shouldDisplayAllActors, primaryAvatar.id]);
    var shouldDisableDetailPage = (0, react_1.useMemo)(function () {
        var _a, _b;
        return CONST_1.default.RESTRICTED_ACCOUNT_IDS.includes((_a = details.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID) ||
            (!details.isWorkspaceActor && (0, ReportUtils_1.isOptimisticPersonalDetail)((action === null || action === void 0 ? void 0 : action.delegateAccountID) ? Number(action.delegateAccountID) : ((_b = details.accountID) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID)));
    }, [action, details.isWorkspaceActor, details.accountID]);
    var getBackgroundColor = function () {
        if (isActive) {
            return theme.messageHighlightBG;
        }
        if (isHovered) {
            return theme.hoverComponentBG;
        }
        return theme.sidebar;
    };
    var hasEmojiStatus = !details.shouldDisplayAllActors && ((_h = details.status) === null || _h === void 0 ? void 0 : _h.emojiCode);
    var formattedDate = DateUtils_1.default.getStatusUntilDate((_k = (_j = details.status) === null || _j === void 0 ? void 0 : _j.clearAfter) !== null && _k !== void 0 ? _k : '');
    var statusText = (_m = (_l = details.status) === null || _l === void 0 ? void 0 : _l.text) !== null && _m !== void 0 ? _m : '';
    var statusTooltipText = formattedDate ? "".concat(statusText ? "".concat(statusText, " ") : '', "(").concat(formattedDate, ")") : statusText;
    return (<react_native_1.View style={[styles.chatItem, wrapperStyle]}>
            <PressableWithoutFeedback_1.default style={[styles.alignSelfStart, styles.mr3]} onPressIn={ControlSelection_1.default.block} onPressOut={ControlSelection_1.default.unblock} onPress={showActorDetails} disabled={shouldDisableDetailPage} accessibilityLabel={details.actorHint} role={CONST_1.default.ROLE.BUTTON}>
                <OfflineWithFeedback_1.default pendingAction={(_p = (_o = details.pendingFields) === null || _o === void 0 ? void 0 : _o.avatar) !== null && _p !== void 0 ? _p : undefined}>
                    <ReportActionAvatars_1.default singleAvatarContainerStyle={[styles.actionAvatar]} subscriptAvatarBorderColor={getBackgroundColor()} noRightMarginOnSubscriptContainer isInReportAction shouldShowTooltip secondaryAvatarContainerStyle={[
            StyleUtils.getBackgroundAndBorderStyle(theme.appBG),
            isHovered ? StyleUtils.getBackgroundAndBorderStyle(theme.hoverComponentBG) : undefined,
        ]} reportID={iouReportID} action={action}/>
                </OfflineWithFeedback_1.default>
            </PressableWithoutFeedback_1.default>
            <react_native_1.View style={[styles.chatItemRight]}>
                {showHeader ? (<react_native_1.View style={[styles.chatItemMessageHeader]}>
                        <PressableWithoutFeedback_1.default style={[styles.flexShrink1, styles.mr1]} onPressIn={ControlSelection_1.default.block} onPressOut={ControlSelection_1.default.unblock} onPress={showActorDetails} disabled={shouldDisableDetailPage} accessibilityLabel={details.actorHint} role={CONST_1.default.ROLE.BUTTON}>
                            {personArray === null || personArray === void 0 ? void 0 : personArray.map(function (fragment, index) {
                var _a, _b, _c, _d, _e, _f;
                return (<ReportActionItemFragment_1.default 
                // eslint-disable-next-line react/no-array-index-key
                key={"person-".concat(action === null || action === void 0 ? void 0 : action.reportActionID, "-").concat(index)} accountID={Number((_b = (_a = details.delegateAccountID) !== null && _a !== void 0 ? _a : primaryAvatar.id) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID)} fragment={__assign(__assign({}, fragment), { type: (_c = fragment.type) !== null && _c !== void 0 ? _c : '', text: (_d = fragment.text) !== null && _d !== void 0 ? _d : '' })} delegateAccountID={action === null || action === void 0 ? void 0 : action.delegateAccountID} isSingleLine actorIcon={primaryAvatar} moderationDecision={(_f = (_e = (0, ReportActionsUtils_1.getReportActionMessage)(action)) === null || _e === void 0 ? void 0 : _e.moderationDecision) === null || _f === void 0 ? void 0 : _f.decision} shouldShowTooltip={avatarType !== CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE}/>);
            })}
                        </PressableWithoutFeedback_1.default>
                        {!!hasEmojiStatus && (<Tooltip_1.default text={statusTooltipText}>
                                <Text_1.default style={styles.userReportStatusEmoji} numberOfLines={1}>{"".concat((_q = details.status) === null || _q === void 0 ? void 0 : _q.emojiCode)}</Text_1.default>
                            </Tooltip_1.default>)}
                        <ReportActionItemDate_1.default created={(_r = action === null || action === void 0 ? void 0 : action.created) !== null && _r !== void 0 ? _r : ''}/>
                    </react_native_1.View>) : null}
                {!!delegateAccountID && <Text_1.default style={[styles.chatDelegateMessage]}>{translate('delegate.onBehalfOfMessage', { delegator: (_s = accountOwnerDetails === null || accountOwnerDetails === void 0 ? void 0 : accountOwnerDetails.displayName) !== null && _s !== void 0 ? _s : '' })}</Text_1.default>}
                {!!vacationer && !!submittedTo && (<Text_1.default style={[styles.chatDelegateMessage]}>
                        {translate('statusPage.toAsVacationDelegate', {
                submittedToName: (_u = (_t = submittedToDetails === null || submittedToDetails === void 0 ? void 0 : submittedToDetails.displayName) !== null && _t !== void 0 ? _t : submittedTo) !== null && _u !== void 0 ? _u : '',
                vacationDelegateName: (_w = (_v = vacationDelegateDetailsForSubmit === null || vacationDelegateDetailsForSubmit === void 0 ? void 0 : vacationDelegateDetailsForSubmit.displayName) !== null && _v !== void 0 ? _v : vacationer) !== null && _w !== void 0 ? _w : '',
            })}
                    </Text_1.default>)}
                {!!managerOnVacation && (<Text_1.default style={[styles.chatDelegateMessage]}>
                        {translate('statusPage.asVacationDelegate', { nameOrEmail: (_y = (_x = vacationDelegateDetailsForApprove === null || vacationDelegateDetailsForApprove === void 0 ? void 0 : vacationDelegateDetailsForApprove.displayName) !== null && _x !== void 0 ? _x : managerOnVacation) !== null && _y !== void 0 ? _y : '' })}
                    </Text_1.default>)}
                <react_native_1.View style={hasBeenFlagged ? styles.blockquote : {}}>{children}</react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
ReportActionItemSingle.displayName = 'ReportActionItemSingle';
exports.default = ReportActionItemSingle;
