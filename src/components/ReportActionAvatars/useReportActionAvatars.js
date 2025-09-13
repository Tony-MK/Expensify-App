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
var Expensicons_1 = require("@components/Icon/Expensicons");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var useReportIsArchived_1 = require("@hooks/useReportIsArchived");
var RandomAvatarUtils_1 = require("@libs/RandomAvatarUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useReportPreviewSenderID_1 = require("./useReportPreviewSenderID");
function useReportActionAvatars(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var report = _a.report, passedAction = _a.action, _t = _a.shouldStackHorizontally, shouldStackHorizontally = _t === void 0 ? false : _t, _u = _a.shouldUseCardFeed, shouldUseCardFeed = _u === void 0 ? false : _u, _v = _a.accountIDs, accountIDs = _v === void 0 ? [] : _v, passedPolicyID = _a.policyID, _w = _a.fallbackDisplayName, fallbackDisplayName = _w === void 0 ? '' : _w, invitedEmailsToAccountIDs = _a.invitedEmailsToAccountIDs, _x = _a.shouldUseCustomFallbackAvatar, shouldUseCustomFallbackAvatar = _x === void 0 ? false : _x;
    /* Get avatar type */
    var allPersonalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var personalDetailsFromSnapshot = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        canBeMissing: true,
    })[0];
    // When the search hash changes, personalDetails from the snapshot will be undefined if it hasn't been fetched yet.
    // Therefore, we will fall back to allPersonalDetails while the data is being fetched.
    var personalDetails = personalDetailsFromSnapshot !== null && personalDetailsFromSnapshot !== void 0 ? personalDetailsFromSnapshot : allPersonalDetails;
    var isReportAChatReport = (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT && (report === null || report === void 0 ? void 0 : report.chatType) !== CONST_1.default.REPORT.CHAT_TYPE.TRIP_ROOM;
    var reportChatReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report === null || report === void 0 ? void 0 : report.chatReportID), { canBeMissing: true })[0];
    var chatReport = isReportAChatReport ? report : reportChatReport;
    var iouReport = isReportAChatReport ? undefined : report;
    var action;
    if (passedAction) {
        action = passedAction;
    }
    else if (iouReport === null || iouReport === void 0 ? void 0 : iouReport.parentReportActionID) {
        action = (0, ReportActionsUtils_1.getReportAction)((_b = chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID) !== null && _b !== void 0 ? _b : iouReport === null || iouReport === void 0 ? void 0 : iouReport.chatReportID, iouReport === null || iouReport === void 0 ? void 0 : iouReport.parentReportActionID);
    }
    else if (!!reportChatReport && !!(chatReport === null || chatReport === void 0 ? void 0 : chatReport.parentReportActionID) && !iouReport) {
        action = (0, ReportActionsUtils_1.getReportAction)(reportChatReport === null || reportChatReport === void 0 ? void 0 : reportChatReport.reportID, chatReport.parentReportActionID);
    }
    var actionChildReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(action === null || action === void 0 ? void 0 : action.childReportID), { canBeMissing: true })[0];
    var isAReportPreviewAction = (action === null || action === void 0 ? void 0 : action.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW;
    var isReportArchived = (0, useReportIsArchived_1.default)(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID);
    var reportPreviewSenderID = (0, useReportPreviewSenderID_1.default)({
        iouReport: iouReport,
        action: action,
        chatReport: chatReport,
    });
    var reportPolicyID = (_c = iouReport === null || iouReport === void 0 ? void 0 : iouReport.policyID) !== null && _c !== void 0 ? _c : chatReport === null || chatReport === void 0 ? void 0 : chatReport.policyID;
    var chatReportPolicyIDExists = (chatReport === null || chatReport === void 0 ? void 0 : chatReport.policyID) === CONST_1.default.POLICY.ID_FAKE || !(chatReport === null || chatReport === void 0 ? void 0 : chatReport.policyID);
    var changedPolicyID = (_d = actionChildReport === null || actionChildReport === void 0 ? void 0 : actionChildReport.policyID) !== null && _d !== void 0 ? _d : iouReport === null || iouReport === void 0 ? void 0 : iouReport.policyID;
    var shouldUseChangedPolicyID = !!changedPolicyID && changedPolicyID !== ((_e = chatReport === null || chatReport === void 0 ? void 0 : chatReport.policyID) !== null && _e !== void 0 ? _e : iouReport === null || iouReport === void 0 ? void 0 : iouReport.policyID);
    var retrievedPolicyID = chatReportPolicyIDExists ? reportPolicyID : chatReport === null || chatReport === void 0 ? void 0 : chatReport.policyID;
    var policyID = shouldUseChangedPolicyID ? changedPolicyID : (passedPolicyID !== null && passedPolicyID !== void 0 ? passedPolicyID : retrievedPolicyID);
    var policy = (0, usePolicy_1.default)(policyID);
    var invoiceReceiverPolicyID = (chatReport === null || chatReport === void 0 ? void 0 : chatReport.invoiceReceiver) && 'policyID' in chatReport.invoiceReceiver ? chatReport.invoiceReceiver.policyID : undefined;
    var invoiceReceiverPolicy = (0, usePolicy_1.default)(invoiceReceiverPolicyID);
    var _y = policy !== null && policy !== void 0 ? policy : {}, chatReportIDAdmins = _y.chatReportIDAdmins, chatReportIDAnnounce = _y.chatReportIDAnnounce, workspaceAccountID = _y.workspaceAccountID;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var policyChatReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReportIDAnnounce || chatReportIDAdmins), { canBeMissing: true })[0];
    var delegateAccountID = (0, ReportActionsUtils_1.getDelegateAccountIDFromReportAction)(action);
    var delegatePersonalDetails = delegateAccountID ? personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[delegateAccountID] : undefined;
    var actorAccountID = (0, ReportUtils_1.getReportActionActorAccountID)(action, iouReport, chatReport, delegatePersonalDetails);
    var isAInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(iouReport !== null && iouReport !== void 0 ? iouReport : null);
    var shouldUseActorAccountID = isAInvoiceReport && !isAReportPreviewAction;
    var accountIDsToMap = shouldUseActorAccountID && actorAccountID ? [actorAccountID] : accountIDs;
    var avatarsForAccountIDs = accountIDsToMap.map(function (id) {
        var _a, _b, _c, _d, _e;
        var invitedEmail = invitedEmailsToAccountIDs ? Object.keys(invitedEmailsToAccountIDs).find(function (email) { return invitedEmailsToAccountIDs[email] === id; }) : undefined;
        return {
            id: id,
            type: CONST_1.default.ICON_TYPE_AVATAR,
            source: (_b = (_a = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[id]) === null || _a === void 0 ? void 0 : _a.avatar) !== null && _b !== void 0 ? _b : Expensicons_1.FallbackAvatar,
            name: (_e = (_d = (_c = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[id]) === null || _c === void 0 ? void 0 : _c[shouldUseActorAccountID ? 'displayName' : 'login']) !== null && _d !== void 0 ? _d : invitedEmail) !== null && _e !== void 0 ? _e : '',
            fallbackIcon: shouldUseCustomFallbackAvatar ? RandomAvatarUtils_1.default.getAvatarForContact(String(id)) : undefined,
        };
    });
    var fallbackWorkspaceAvatar = {
        id: policyID,
        type: CONST_1.default.ICON_TYPE_WORKSPACE,
        name: fallbackDisplayName,
        source: (0, ReportUtils_1.getDefaultWorkspaceAvatar)(fallbackDisplayName),
    };
    if (passedPolicyID) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        var workspaceAvatar = policyChatReport ? (0, ReportUtils_1.getWorkspaceIcon)(policyChatReport, policy) : { source: (policy === null || policy === void 0 ? void 0 : policy.avatarURL) || (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy === null || policy === void 0 ? void 0 : policy.name) };
        var policyChatReportAvatar = policy ? __assign(__assign({}, workspaceAvatar), { id: policyID, name: policy.name, type: CONST_1.default.ICON_TYPE_WORKSPACE }) : fallbackWorkspaceAvatar;
        var firstAccountAvatar = avatarsForAccountIDs.at(0);
        return {
            avatars: firstAccountAvatar ? [policyChatReportAvatar, firstAccountAvatar] : [policyChatReportAvatar],
            avatarType: firstAccountAvatar ? CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT : CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SINGLE,
            details: __assign(__assign({}, ((_f = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[workspaceAccountID !== null && workspaceAccountID !== void 0 ? workspaceAccountID : CONST_1.default.DEFAULT_NUMBER_ID]) !== null && _f !== void 0 ? _f : {})), { shouldDisplayAllActors: false, isWorkspaceActor: false, 
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                actorHint: String(policyID).replace(CONST_1.default.REGEX.MERGED_ACCOUNT_PREFIX, ''), accountID: workspaceAccountID, delegateAccountID: undefined }),
            source: {
                policyChatReport: policyChatReport,
            },
        };
    }
    var isWorkspacePolicy = !!policy && policy.type !== CONST_1.default.POLICY.TYPE.PERSONAL;
    var isATripRoom = (0, ReportUtils_1.isTripRoom)(chatReport);
    var isWorkspaceWithoutChatReportProp = !chatReport && isWorkspacePolicy;
    var isAWorkspaceChat = (0, ReportUtils_1.isPolicyExpenseChat)(chatReport) || isWorkspaceWithoutChatReportProp;
    var isATripPreview = (action === null || action === void 0 ? void 0 : action.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.TRIP_PREVIEW;
    var isReportPreviewOrNoAction = !action || isAReportPreviewAction;
    var isReportPreviewInTripRoom = isAReportPreviewAction && isATripRoom;
    // We want to display only the sender's avatar next to the report preview if it only contains one person's expenses.
    var displayAllActors = isAReportPreviewAction && !isATripRoom && !isAWorkspaceChat && !reportPreviewSenderID;
    var shouldUseAccountIDs = accountIDs.length > 0;
    var shouldShowAllActors = displayAllActors && !reportPreviewSenderID;
    var isChatThreadOutsideTripRoom = (0, ReportUtils_1.isChatThread)(chatReport) && !isATripRoom;
    var shouldShowSubscriptAvatar = (0, ReportUtils_1.shouldReportShowSubscript)(iouReport !== null && iouReport !== void 0 ? iouReport : chatReport, isReportArchived) && isWorkspacePolicy;
    var shouldShowConvertedSubscriptAvatar = (shouldStackHorizontally || shouldUseAccountIDs) && shouldShowSubscriptAvatar && !reportPreviewSenderID;
    var isExpense = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) && ((_g = (0, ReportActionsUtils_1.getOriginalMessage)(action)) === null || _g === void 0 ? void 0 : _g.type) === CONST_1.default.IOU.ACTION.CREATE;
    var isWorkspaceExpense = isWorkspacePolicy && isExpense;
    var shouldUseSubscriptAvatar = (((shouldShowSubscriptAvatar && isReportPreviewOrNoAction) || isReportPreviewInTripRoom || isATripPreview || isWorkspaceExpense) &&
        !shouldStackHorizontally &&
        !(isChatThreadOutsideTripRoom && !isWorkspaceExpense) &&
        !shouldShowConvertedSubscriptAvatar) ||
        shouldUseCardFeed;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var shouldUseMultipleAvatars = shouldUseAccountIDs || shouldShowAllActors || shouldShowConvertedSubscriptAvatar;
    var avatarType = CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SINGLE;
    if (shouldUseSubscriptAvatar) {
        avatarType = CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT;
    }
    else if (shouldUseMultipleAvatars) {
        avatarType = CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE;
    }
    /* Get correct primary & secondary icon */
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var accountID = reportPreviewSenderID || (actorAccountID !== null && actorAccountID !== void 0 ? actorAccountID : CONST_1.default.DEFAULT_NUMBER_ID);
    var _z = (_h = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[delegatePersonalDetails ? delegatePersonalDetails.accountID : accountID]) !== null && _h !== void 0 ? _h : {}, avatar = _z.avatar, fallbackIcon = _z.fallbackIcon, login = _z.login;
    var defaultDisplayName = (_j = (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: accountID, personalDetailsData: personalDetails })) !== null && _j !== void 0 ? _j : '';
    var invoiceReport = [iouReport, chatReport, reportChatReport].find(function (susReport) { return (0, ReportUtils_1.isInvoiceReport)(susReport) || (susReport === null || susReport === void 0 ? void 0 : susReport.chatType) === CONST_1.default.REPORT.TYPE.INVOICE; });
    var isNestedInInvoiceReport = !!invoiceReport;
    var isWorkspaceActor = isAInvoiceReport || (isAWorkspaceChat && (!actorAccountID || displayAllActors));
    var isChatReportOnlyProp = !iouReport && chatReport;
    var isWorkspaceChatWithoutChatReport = !chatReport && isAWorkspaceChat;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var usePersonalDetailsAvatars = (isChatReportOnlyProp || isWorkspaceChatWithoutChatReport) && isReportPreviewOrNoAction && !isATripPreview;
    var useNearestReportAvatars = (!accountID || !action) && accountIDs.length === 0;
    var getIconsWithDefaults = function (onyxReport) { var _a; return (0, ReportUtils_1.getIcons)(onyxReport, personalDetails, (_a = avatar !== null && avatar !== void 0 ? avatar : fallbackIcon) !== null && _a !== void 0 ? _a : Expensicons_1.FallbackAvatar, defaultDisplayName, accountID, policy, invoiceReceiverPolicy); };
    var reportIcons = getIconsWithDefaults(chatReport !== null && chatReport !== void 0 ? chatReport : iouReport);
    var delegateAvatar = delegatePersonalDetails
        ? {
            source: (_k = delegatePersonalDetails.avatar) !== null && _k !== void 0 ? _k : '',
            name: delegatePersonalDetails.displayName,
            id: delegatePersonalDetails.accountID,
            type: CONST_1.default.ICON_TYPE_AVATAR,
            fill: undefined,
            fallbackIcon: fallbackIcon,
        }
        : undefined;
    var invoiceFallbackAvatar = {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        source: (policy === null || policy === void 0 ? void 0 : policy.avatarURL) || (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy === null || policy === void 0 ? void 0 : policy.name),
        id: policy === null || policy === void 0 ? void 0 : policy.id,
        name: policy === null || policy === void 0 ? void 0 : policy.name,
        type: CONST_1.default.ICON_TYPE_WORKSPACE,
        fill: undefined,
        fallbackIcon: fallbackIcon,
    };
    var userFallbackAvatar = {
        source: avatar !== null && avatar !== void 0 ? avatar : Expensicons_1.FallbackAvatar,
        id: accountID,
        name: defaultDisplayName !== null && defaultDisplayName !== void 0 ? defaultDisplayName : fallbackDisplayName,
        type: CONST_1.default.ICON_TYPE_AVATAR,
        fill: undefined,
        fallbackIcon: fallbackIcon,
    };
    var secondUserFallbackAvatar = {
        name: '',
        source: '',
        type: CONST_1.default.ICON_TYPE_AVATAR,
        id: 0,
        fill: undefined,
        fallbackIcon: fallbackIcon,
    };
    var primaryAvatar;
    if (useNearestReportAvatars) {
        primaryAvatar = getIconsWithDefaults(iouReport !== null && iouReport !== void 0 ? iouReport : chatReport).at(0);
    }
    else if (isWorkspaceActor || usePersonalDetailsAvatars) {
        primaryAvatar = reportIcons.at(0);
    }
    else if (delegateAvatar) {
        primaryAvatar = delegateAvatar;
    }
    else if (isAReportPreviewAction && isATripRoom) {
        primaryAvatar = reportIcons.at(0);
    }
    if (!(primaryAvatar === null || primaryAvatar === void 0 ? void 0 : primaryAvatar.id)) {
        primaryAvatar = isNestedInInvoiceReport ? invoiceFallbackAvatar : userFallbackAvatar;
    }
    var secondaryAvatar;
    if (useNearestReportAvatars) {
        secondaryAvatar = getIconsWithDefaults(iouReport !== null && iouReport !== void 0 ? iouReport : chatReport).at(1);
    }
    else if (usePersonalDetailsAvatars) {
        secondaryAvatar = reportIcons.at(1);
    }
    else if (isATripPreview) {
        secondaryAvatar = reportIcons.at(0);
    }
    else if (isReportPreviewInTripRoom || displayAllActors) {
        var iouReportIcons = getIconsWithDefaults(iouReport);
        secondaryAvatar = iouReportIcons.at(((_l = iouReportIcons.at(1)) === null || _l === void 0 ? void 0 : _l.id) === primaryAvatar.id ? 0 : 1);
    }
    else if (!isWorkspaceActor) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        secondaryAvatar = reportIcons.at((chatReport === null || chatReport === void 0 ? void 0 : chatReport.isOwnPolicyExpenseChat) || isAWorkspaceChat ? 0 : 1);
    }
    else if (isAInvoiceReport) {
        secondaryAvatar = reportIcons.at(1);
    }
    if (!(secondaryAvatar === null || secondaryAvatar === void 0 ? void 0 : secondaryAvatar.id)) {
        secondaryAvatar = secondUserFallbackAvatar;
    }
    var shouldUseMappedAccountIDs = avatarsForAccountIDs.length > 0 && (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE || shouldUseActorAccountID || shouldUseCardFeed);
    var shouldUsePrimaryAvatarID = isWorkspaceActor && !!primaryAvatar.id;
    var shouldUseInvoiceExpenseIcons = isWorkspaceExpense && isNestedInInvoiceReport && !!accountID;
    var avatars = [primaryAvatar, secondaryAvatar];
    var isUserWithWorkspaceAvatar = avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT && ((_m = avatars.at(0)) === null || _m === void 0 ? void 0 : _m.type) === CONST_1.default.ICON_TYPE_AVATAR && ((_o = avatars.at(1)) === null || _o === void 0 ? void 0 : _o.type) === CONST_1.default.ICON_TYPE_WORKSPACE;
    var isWorkspaceWithUserAvatar = ((_p = avatars.at(0)) === null || _p === void 0 ? void 0 : _p.type) === CONST_1.default.ICON_TYPE_WORKSPACE && ((_q = avatars.at(1)) === null || _q === void 0 ? void 0 : _q.type) === CONST_1.default.ICON_TYPE_AVATAR && avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE;
    // eslint-disable-next-line rulesdir/no-negated-variables
    var wasReportPreviewMovedToDifferentPolicy = shouldUseChangedPolicyID && isAReportPreviewAction;
    if (shouldUseInvoiceExpenseIcons) {
        avatars = getIconsWithDefaults(invoiceReport);
    }
    else if (shouldUseMappedAccountIDs) {
        avatars = avatarsForAccountIDs;
    }
    if (isNestedInInvoiceReport && !!((_r = avatars.at(1)) === null || _r === void 0 ? void 0 : _r.id)) {
        // If we have B2B Invoice between two workspaces we only should show subscript if it is not a report preview
        if (avatars.every(function (_a) {
            var type = _a.type;
            return type === CONST_1.default.ICON_TYPE_WORKSPACE;
        })) {
            avatarType = isAReportPreviewAction ? CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE : CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT;
            // But if it is a report preview between workspace and another user it should never be displayed as a multiple avatar
        }
        else if (isWorkspaceWithUserAvatar && isAReportPreviewAction) {
            avatarType = CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT;
        }
    }
    else if (isUserWithWorkspaceAvatar && wasReportPreviewMovedToDifferentPolicy) {
        var policyChatReportIcon = __assign(__assign({}, (0, ReportUtils_1.getWorkspaceIcon)(policyChatReport, policy)), { id: policyID, name: policy === null || policy === void 0 ? void 0 : policy.name });
        var firstAvatar = avatars[0];
        avatars = [firstAvatar, policyChatReportIcon];
    }
    return {
        avatars: avatars,
        avatarType: avatarType,
        details: __assign(__assign({}, ((_s = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[accountID]) !== null && _s !== void 0 ? _s : {})), { shouldDisplayAllActors: displayAllActors, isWorkspaceActor: isWorkspaceActor, 
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            actorHint: String(shouldUsePrimaryAvatarID ? primaryAvatar.id : login || defaultDisplayName || fallbackDisplayName).replace(CONST_1.default.REGEX.MERGED_ACCOUNT_PREFIX, ''), accountID: accountID, delegateAccountID: !isWorkspaceActor && !!delegateAccountID ? actorAccountID : undefined }),
        source: {
            iouReport: iouReport,
            chatReport: chatReport,
            action: action,
        },
    };
}
exports.default = useReportActionAvatars;
