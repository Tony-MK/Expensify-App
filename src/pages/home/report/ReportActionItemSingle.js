"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const useReportActionAvatars_1 = require("@components/ReportActionAvatars/useReportActionAvatars");
const useReportPreviewSenderID_1 = require("@components/ReportActionAvatars/useReportPreviewSenderID");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ControlSelection_1 = require("@libs/ControlSelection");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ReportActionItemDate_1 = require("./ReportActionItemDate");
const ReportActionItemFragment_1 = require("./ReportActionItemFragment");
const showUserDetails = (accountID) => {
    Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(accountID, Navigation_1.default.getActiveRoute()));
};
const showWorkspaceDetails = (reportID) => {
    if (!reportID) {
        return;
    }
    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(reportID, Navigation_1.default.getReportRHPActiveRoute()));
};
function ReportActionItemSingle({ action, children, wrapperStyle, showHeader = true, hasBeenFlagged = false, report, iouReport: potentialIOUReport, isHovered = false, isActive = false, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        canBeMissing: true,
    });
    const { avatarType, avatars, details, source } = (0, useReportActionAvatars_1.default)({ report: potentialIOUReport ?? report, action });
    const reportID = source.chatReport?.reportID;
    const iouReportID = source.iouReport?.reportID;
    const [primaryAvatar, secondaryAvatar] = avatars;
    const reportPreviewSenderID = (0, useReportPreviewSenderID_1.default)({
        iouReport: potentialIOUReport,
        action,
        chatReport: source.chatReport,
    });
    const delegateAccountID = (0, ReportActionsUtils_1.getDelegateAccountIDFromReportAction)(action);
    const mainAccountID = delegateAccountID ? (reportPreviewSenderID ?? potentialIOUReport?.ownerAccountID ?? action?.childOwnerAccountID) : (details.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
    const mainAccountLogin = mainAccountID ? (personalDetails?.[mainAccountID]?.login ?? details.login) : details.login;
    const accountOwnerDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(String(mainAccountLogin ?? ''));
    // Vacation delegate details for submitted action
    const vacationer = (0, ReportActionsUtils_1.getVacationer)(action);
    const submittedTo = (0, ReportActionsUtils_1.getSubmittedTo)(action);
    const vacationDelegateDetailsForSubmit = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(vacationer ?? '');
    const submittedToDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(submittedTo ?? '');
    // Vacation delegate details for approved action
    const managerOnVacation = (0, ReportActionsUtils_1.getManagerOnVacation)(action);
    const vacationDelegateDetailsForApprove = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(managerOnVacation ?? '');
    const headingText = avatarType === CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE ? `${primaryAvatar.name} & ${secondaryAvatar.name}` : primaryAvatar.name;
    // Since the display name for a report action message is delivered with the report history as an array of fragments
    // we'll need to take the displayName from personal details and have it be in the same format for now. Eventually,
    // we should stop referring to the report history items entirely for this information.
    const personArray = headingText
        ? [
            {
                type: 'TEXT',
                text: headingText,
            },
        ]
        : action?.person;
    const showActorDetails = (0, react_1.useCallback)(() => {
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
    const shouldDisableDetailPage = (0, react_1.useMemo)(() => CONST_1.default.RESTRICTED_ACCOUNT_IDS.includes(details.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID) ||
        (!details.isWorkspaceActor && (0, ReportUtils_1.isOptimisticPersonalDetail)(action?.delegateAccountID ? Number(action.delegateAccountID) : (details.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID))), [action, details.isWorkspaceActor, details.accountID]);
    const getBackgroundColor = () => {
        if (isActive) {
            return theme.messageHighlightBG;
        }
        if (isHovered) {
            return theme.hoverComponentBG;
        }
        return theme.sidebar;
    };
    const hasEmojiStatus = !details.shouldDisplayAllActors && details.status?.emojiCode;
    const formattedDate = DateUtils_1.default.getStatusUntilDate(details.status?.clearAfter ?? '');
    const statusText = details.status?.text ?? '';
    const statusTooltipText = formattedDate ? `${statusText ? `${statusText} ` : ''}(${formattedDate})` : statusText;
    return (<react_native_1.View style={[styles.chatItem, wrapperStyle]}>
            <PressableWithoutFeedback_1.default style={[styles.alignSelfStart, styles.mr3]} onPressIn={ControlSelection_1.default.block} onPressOut={ControlSelection_1.default.unblock} onPress={showActorDetails} disabled={shouldDisableDetailPage} accessibilityLabel={details.actorHint} role={CONST_1.default.ROLE.BUTTON}>
                <OfflineWithFeedback_1.default pendingAction={details.pendingFields?.avatar ?? undefined}>
                    <ReportActionAvatars_1.default singleAvatarContainerStyle={[styles.actionAvatar]} subscriptAvatarBorderColor={getBackgroundColor()} noRightMarginOnSubscriptContainer isInReportAction shouldShowTooltip secondaryAvatarContainerStyle={[
            StyleUtils.getBackgroundAndBorderStyle(theme.appBG),
            isHovered ? StyleUtils.getBackgroundAndBorderStyle(theme.hoverComponentBG) : undefined,
        ]} reportID={iouReportID} action={action}/>
                </OfflineWithFeedback_1.default>
            </PressableWithoutFeedback_1.default>
            <react_native_1.View style={[styles.chatItemRight]}>
                {showHeader ? (<react_native_1.View style={[styles.chatItemMessageHeader]}>
                        <PressableWithoutFeedback_1.default style={[styles.flexShrink1, styles.mr1]} onPressIn={ControlSelection_1.default.block} onPressOut={ControlSelection_1.default.unblock} onPress={showActorDetails} disabled={shouldDisableDetailPage} accessibilityLabel={details.actorHint} role={CONST_1.default.ROLE.BUTTON}>
                            {personArray?.map((fragment, index) => (<ReportActionItemFragment_1.default 
            // eslint-disable-next-line react/no-array-index-key
            key={`person-${action?.reportActionID}-${index}`} accountID={Number(details.delegateAccountID ?? primaryAvatar.id ?? CONST_1.default.DEFAULT_NUMBER_ID)} fragment={{ ...fragment, type: fragment.type ?? '', text: fragment.text ?? '' }} delegateAccountID={action?.delegateAccountID} isSingleLine actorIcon={primaryAvatar} moderationDecision={(0, ReportActionsUtils_1.getReportActionMessage)(action)?.moderationDecision?.decision} shouldShowTooltip={avatarType !== CONST_1.default.REPORT_ACTION_AVATARS.TYPE.MULTIPLE}/>))}
                        </PressableWithoutFeedback_1.default>
                        {!!hasEmojiStatus && (<Tooltip_1.default text={statusTooltipText}>
                                <Text_1.default style={styles.userReportStatusEmoji} numberOfLines={1}>{`${details.status?.emojiCode}`}</Text_1.default>
                            </Tooltip_1.default>)}
                        <ReportActionItemDate_1.default created={action?.created ?? ''}/>
                    </react_native_1.View>) : null}
                {!!delegateAccountID && <Text_1.default style={[styles.chatDelegateMessage]}>{translate('delegate.onBehalfOfMessage', { delegator: accountOwnerDetails?.displayName ?? '' })}</Text_1.default>}
                {!!vacationer && !!submittedTo && (<Text_1.default style={[styles.chatDelegateMessage]}>
                        {translate('statusPage.toAsVacationDelegate', {
                submittedToName: submittedToDetails?.displayName ?? submittedTo ?? '',
                vacationDelegateName: vacationDelegateDetailsForSubmit?.displayName ?? vacationer ?? '',
            })}
                    </Text_1.default>)}
                {!!managerOnVacation && (<Text_1.default style={[styles.chatDelegateMessage]}>
                        {translate('statusPage.asVacationDelegate', { nameOrEmail: vacationDelegateDetailsForApprove?.displayName ?? managerOnVacation ?? '' })}
                    </Text_1.default>)}
                <react_native_1.View style={hasBeenFlagged ? styles.blockquote : {}}>{children}</react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
ReportActionItemSingle.displayName = 'ReportActionItemSingle';
exports.default = ReportActionItemSingle;
