"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expensicons_1 = require("@components/Icon/Expensicons");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const RandomAvatarUtils_1 = require("@libs/RandomAvatarUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useReportPreviewSenderID_1 = require("./useReportPreviewSenderID");
function useReportActionAvatars({ report, action: passedAction, shouldStackHorizontally = false, shouldUseCardFeed = false, accountIDs = [], policyID: passedPolicyID, fallbackDisplayName = '', invitedEmailsToAccountIDs, shouldUseCustomFallbackAvatar = false, }) {
    /* Get avatar type */
    const allPersonalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [personalDetailsFromSnapshot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        canBeMissing: true,
    });
    // When the search hash changes, personalDetails from the snapshot will be undefined if it hasn't been fetched yet.
    // Therefore, we will fall back to allPersonalDetails while the data is being fetched.
    const personalDetails = personalDetailsFromSnapshot ?? allPersonalDetails;
    const isReportAChatReport = report?.type === CONST_1.default.REPORT.TYPE.CHAT && report?.chatType !== CONST_1.default.REPORT.CHAT_TYPE.TRIP_ROOM;
    const [reportChatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`, { canBeMissing: true });
    const chatReport = isReportAChatReport ? report : reportChatReport;
    const iouReport = isReportAChatReport ? undefined : report;
    let action;
    if (passedAction) {
        action = passedAction;
    }
    else if (iouReport?.parentReportActionID) {
        action = (0, ReportActionsUtils_1.getReportAction)(chatReport?.reportID ?? iouReport?.chatReportID, iouReport?.parentReportActionID);
    }
    else if (!!reportChatReport && !!chatReport?.parentReportActionID && !iouReport) {
        action = (0, ReportActionsUtils_1.getReportAction)(reportChatReport?.reportID, chatReport.parentReportActionID);
    }
    const [actionChildReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${action?.childReportID}`, { canBeMissing: true });
    const isAReportPreviewAction = action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW;
    const isReportArchived = (0, useReportIsArchived_1.default)(iouReport?.reportID);
    const reportPreviewSenderID = (0, useReportPreviewSenderID_1.default)({
        iouReport,
        action,
        chatReport,
    });
    const reportPolicyID = iouReport?.policyID ?? chatReport?.policyID;
    const chatReportPolicyIDExists = chatReport?.policyID === CONST_1.default.POLICY.ID_FAKE || !chatReport?.policyID;
    const changedPolicyID = actionChildReport?.policyID ?? iouReport?.policyID;
    const shouldUseChangedPolicyID = !!changedPolicyID && changedPolicyID !== (chatReport?.policyID ?? iouReport?.policyID);
    const retrievedPolicyID = chatReportPolicyIDExists ? reportPolicyID : chatReport?.policyID;
    const policyID = shouldUseChangedPolicyID ? changedPolicyID : (passedPolicyID ?? retrievedPolicyID);
    const policy = (0, usePolicy_1.default)(policyID);
    const invoiceReceiverPolicyID = chatReport?.invoiceReceiver && 'policyID' in chatReport.invoiceReceiver ? chatReport.invoiceReceiver.policyID : undefined;
    const invoiceReceiverPolicy = (0, usePolicy_1.default)(invoiceReceiverPolicyID);
    const { chatReportIDAdmins, chatReportIDAnnounce, workspaceAccountID } = policy ?? {};
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const [policyChatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportIDAnnounce || chatReportIDAdmins}`, { canBeMissing: true });
    const delegateAccountID = (0, ReportActionsUtils_1.getDelegateAccountIDFromReportAction)(action);
    const delegatePersonalDetails = delegateAccountID ? personalDetails?.[delegateAccountID] : undefined;
    const actorAccountID = (0, ReportUtils_1.getReportActionActorAccountID)(action, iouReport, chatReport, delegatePersonalDetails);
    const isAInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(iouReport ?? null);
    const shouldUseActorAccountID = isAInvoiceReport && !isAReportPreviewAction;
    const accountIDsToMap = shouldUseActorAccountID && actorAccountID ? [actorAccountID] : accountIDs;
    const avatarsForAccountIDs = accountIDsToMap.map((id) => {
        const invitedEmail = invitedEmailsToAccountIDs ? Object.keys(invitedEmailsToAccountIDs).find((email) => invitedEmailsToAccountIDs[email] === id) : undefined;
        return {
            id,
            type: CONST_1.default.ICON_TYPE_AVATAR,
            source: personalDetails?.[id]?.avatar ?? Expensicons_1.FallbackAvatar,
            name: personalDetails?.[id]?.[shouldUseActorAccountID ? 'displayName' : 'login'] ?? invitedEmail ?? '',
            fallbackIcon: shouldUseCustomFallbackAvatar ? RandomAvatarUtils_1.default.getAvatarForContact(String(id)) : undefined,
        };
    });
    const fallbackWorkspaceAvatar = {
        id: policyID,
        type: CONST_1.default.ICON_TYPE_WORKSPACE,
        name: fallbackDisplayName,
        source: (0, ReportUtils_1.getDefaultWorkspaceAvatar)(fallbackDisplayName),
    };
    if (passedPolicyID) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const workspaceAvatar = policyChatReport ? (0, ReportUtils_1.getWorkspaceIcon)(policyChatReport, policy) : { source: policy?.avatarURL || (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy?.name) };
        const policyChatReportAvatar = policy ? { ...workspaceAvatar, id: policyID, name: policy.name, type: CONST_1.default.ICON_TYPE_WORKSPACE } : fallbackWorkspaceAvatar;
        const firstAccountAvatar = avatarsForAccountIDs.at(0);
        return {
            avatars: firstAccountAvatar ? [policyChatReportAvatar, firstAccountAvatar] : [policyChatReportAvatar],
            avatarType: firstAccountAvatar ? CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT : CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SINGLE,
            details: {
                ...(personalDetails?.[workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID] ?? {}),
                shouldDisplayAllActors: false,
                isWorkspaceActor: false,
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                actorHint: String(policyID).replace(CONST_1.default.REGEX.MERGED_ACCOUNT_PREFIX, ''),
                accountID: workspaceAccountID,
                delegateAccountID: undefined,
            },
            source: {
                policyChatReport,
            },
        };
    }
    const isWorkspacePolicy = !!policy && policy.type !== CONST_1.default.POLICY.TYPE.PERSONAL;
    const isATripRoom = (0, ReportUtils_1.isTripRoom)(chatReport);
    const isWorkspaceWithoutChatReportProp = !chatReport && isWorkspacePolicy;
    const isAWorkspaceChat = (0, ReportUtils_1.isPolicyExpenseChat)(chatReport) || isWorkspaceWithoutChatReportProp;
    const isATripPreview = action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.TRIP_PREVIEW;
    const isReportPreviewOrNoAction = !action || isAReportPreviewAction;
    const isReportPreviewInTripRoom = isAReportPreviewAction && isATripRoom;
    // We want to display only the sender's avatar next to the report preview if it only contains one person's expenses.
    const displayAllActors = isAReportPreviewAction && !isATripRoom && !isAWorkspaceChat && !reportPreviewSenderID;
    const shouldUseAccountIDs = accountIDs.length > 0;
    const shouldShowAllActors = displayAllActors && !reportPreviewSenderID;
    const isChatThreadOutsideTripRoom = (0, ReportUtils_1.isChatThread)(chatReport) && !isATripRoom;
    const shouldShowSubscriptAvatar = (0, ReportUtils_1.shouldReportShowSubscript)(iouReport ?? chatReport, isReportArchived) && isWorkspacePolicy;
    const shouldShowConvertedSubscriptAvatar = (shouldStackHorizontally || shouldUseAccountIDs) && shouldShowSubscriptAvatar && !reportPreviewSenderID;
    const isExpense = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) && (0, ReportActionsUtils_1.getOriginalMessage)(action)?.type === CONST_1.default.IOU.ACTION.CREATE;
    const isWorkspaceExpense = isWorkspacePolicy && isExpense;
    const shouldUseSubscriptAvatar = (((shouldShowSubscriptAvatar && isReportPreviewOrNoAction) || isReportPreviewInTripRoom || isATripPreview || isWorkspaceExpense) &&
        !shouldStackHorizontally &&
        !(isChatThreadOutsideTripRoom && !isWorkspaceExpense) &&
        !shouldShowConvertedSubscriptAvatar) ||
        shouldUseCardFeed;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const shouldUseMultipleAvatars = shouldUseAccountIDs || shouldShowAllActors || shouldShowConvertedSubscriptAvatar;
    let avatarType = CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SINGLE;
    if (shouldUseSubscriptAvatar) {
        avatarType = CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT;
    }
    else if (shouldUseMultipleAvatars) {
        avatarType = CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE;
    }
    /* Get correct primary & secondary icon */
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const accountID = reportPreviewSenderID || (actorAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
    const { avatar, fallbackIcon, login } = personalDetails?.[delegatePersonalDetails ? delegatePersonalDetails.accountID : accountID] ?? {};
    const defaultDisplayName = (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID, personalDetailsData: personalDetails }) ?? '';
    const invoiceReport = [iouReport, chatReport, reportChatReport].find((susReport) => (0, ReportUtils_1.isInvoiceReport)(susReport) || susReport?.chatType === CONST_1.default.REPORT.TYPE.INVOICE);
    const isNestedInInvoiceReport = !!invoiceReport;
    const isWorkspaceActor = isAInvoiceReport || (isAWorkspaceChat && (!actorAccountID || displayAllActors));
    const isChatReportOnlyProp = !iouReport && chatReport;
    const isWorkspaceChatWithoutChatReport = !chatReport && isAWorkspaceChat;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const usePersonalDetailsAvatars = (isChatReportOnlyProp || isWorkspaceChatWithoutChatReport) && isReportPreviewOrNoAction && !isATripPreview;
    const useNearestReportAvatars = (!accountID || !action) && accountIDs.length === 0;
    const getIconsWithDefaults = (onyxReport) => (0, ReportUtils_1.getIcons)(onyxReport, personalDetails, avatar ?? fallbackIcon ?? Expensicons_1.FallbackAvatar, defaultDisplayName, accountID, policy, invoiceReceiverPolicy);
    const reportIcons = getIconsWithDefaults(chatReport ?? iouReport);
    const delegateAvatar = delegatePersonalDetails
        ? {
            source: delegatePersonalDetails.avatar ?? '',
            name: delegatePersonalDetails.displayName,
            id: delegatePersonalDetails.accountID,
            type: CONST_1.default.ICON_TYPE_AVATAR,
            fill: undefined,
            fallbackIcon,
        }
        : undefined;
    const invoiceFallbackAvatar = {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        source: policy?.avatarURL || (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy?.name),
        id: policy?.id,
        name: policy?.name,
        type: CONST_1.default.ICON_TYPE_WORKSPACE,
        fill: undefined,
        fallbackIcon,
    };
    const userFallbackAvatar = {
        source: avatar ?? Expensicons_1.FallbackAvatar,
        id: accountID,
        name: defaultDisplayName ?? fallbackDisplayName,
        type: CONST_1.default.ICON_TYPE_AVATAR,
        fill: undefined,
        fallbackIcon,
    };
    const secondUserFallbackAvatar = {
        name: '',
        source: '',
        type: CONST_1.default.ICON_TYPE_AVATAR,
        id: 0,
        fill: undefined,
        fallbackIcon,
    };
    let primaryAvatar;
    if (useNearestReportAvatars) {
        primaryAvatar = getIconsWithDefaults(iouReport ?? chatReport).at(0);
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
    if (!primaryAvatar?.id) {
        primaryAvatar = isNestedInInvoiceReport ? invoiceFallbackAvatar : userFallbackAvatar;
    }
    let secondaryAvatar;
    if (useNearestReportAvatars) {
        secondaryAvatar = getIconsWithDefaults(iouReport ?? chatReport).at(1);
    }
    else if (usePersonalDetailsAvatars) {
        secondaryAvatar = reportIcons.at(1);
    }
    else if (isATripPreview) {
        secondaryAvatar = reportIcons.at(0);
    }
    else if (isReportPreviewInTripRoom || displayAllActors) {
        const iouReportIcons = getIconsWithDefaults(iouReport);
        secondaryAvatar = iouReportIcons.at(iouReportIcons.at(1)?.id === primaryAvatar.id ? 0 : 1);
    }
    else if (!isWorkspaceActor) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        secondaryAvatar = reportIcons.at(chatReport?.isOwnPolicyExpenseChat || isAWorkspaceChat ? 0 : 1);
    }
    else if (isAInvoiceReport) {
        secondaryAvatar = reportIcons.at(1);
    }
    if (!secondaryAvatar?.id) {
        secondaryAvatar = secondUserFallbackAvatar;
    }
    const shouldUseMappedAccountIDs = avatarsForAccountIDs.length > 0 && (avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE || shouldUseActorAccountID || shouldUseCardFeed);
    const shouldUsePrimaryAvatarID = isWorkspaceActor && !!primaryAvatar.id;
    const shouldUseInvoiceExpenseIcons = isWorkspaceExpense && isNestedInInvoiceReport && !!accountID;
    let avatars = [primaryAvatar, secondaryAvatar];
    const isUserWithWorkspaceAvatar = avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT && avatars.at(0)?.type === CONST_1.default.ICON_TYPE_AVATAR && avatars.at(1)?.type === CONST_1.default.ICON_TYPE_WORKSPACE;
    const isWorkspaceWithUserAvatar = avatars.at(0)?.type === CONST_1.default.ICON_TYPE_WORKSPACE && avatars.at(1)?.type === CONST_1.default.ICON_TYPE_AVATAR && avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE;
    // eslint-disable-next-line rulesdir/no-negated-variables
    const wasReportPreviewMovedToDifferentPolicy = shouldUseChangedPolicyID && isAReportPreviewAction;
    if (shouldUseInvoiceExpenseIcons) {
        avatars = getIconsWithDefaults(invoiceReport);
    }
    else if (shouldUseMappedAccountIDs) {
        avatars = avatarsForAccountIDs;
    }
    if (isNestedInInvoiceReport && !!avatars.at(1)?.id) {
        // If we have B2B Invoice between two workspaces we only should show subscript if it is not a report preview
        if (avatars.every(({ type }) => type === CONST_1.default.ICON_TYPE_WORKSPACE)) {
            avatarType = isAReportPreviewAction ? CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE : CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT;
            // But if it is a report preview between workspace and another user it should never be displayed as a multiple avatar
        }
        else if (isWorkspaceWithUserAvatar && isAReportPreviewAction) {
            avatarType = CONST_1.default.REPORT_ACTION_AVATARS.TYPE.SUBSCRIPT;
        }
    }
    else if (isUserWithWorkspaceAvatar && wasReportPreviewMovedToDifferentPolicy) {
        const policyChatReportIcon = { ...(0, ReportUtils_1.getWorkspaceIcon)(policyChatReport, policy), id: policyID, name: policy?.name };
        const [firstAvatar] = avatars;
        avatars = [firstAvatar, policyChatReportIcon];
    }
    return {
        avatars,
        avatarType,
        details: {
            ...(personalDetails?.[accountID] ?? {}),
            shouldDisplayAllActors: displayAllActors,
            isWorkspaceActor,
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            actorHint: String(shouldUsePrimaryAvatarID ? primaryAvatar.id : login || defaultDisplayName || fallbackDisplayName).replace(CONST_1.default.REGEX.MERGED_ACCOUNT_PREFIX, ''),
            accountID,
            delegateAccountID: !isWorkspaceActor && !!delegateAccountID ? actorAccountID : undefined,
        },
        source: {
            iouReport,
            chatReport,
            action,
        },
    };
}
exports.default = useReportActionAvatars;
