"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AnonymousReportFooter_1 = require("@components/AnonymousReportFooter");
const ArchivedReportFooter_1 = require("@components/ArchivedReportFooter");
const Banner_1 = require("@components/Banner");
const BlockedReportFooter_1 = require("@components/BlockedReportFooter");
const Expensicons = require("@components/Icon/Expensicons");
const OfflineIndicator_1 = require("@components/OfflineIndicator");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SwipeableView_1 = require("@components/SwipeableView");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useShortMentionsList_1 = require("@hooks/useShortMentionsList");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Report_1 = require("@libs/actions/Report");
const Task_1 = require("@libs/actions/Task");
const Log_1 = require("@libs/Log");
const LoginUtils_1 = require("@libs/LoginUtils");
const NetworkStore_1 = require("@libs/Network/NetworkStore");
const ParsingUtils_1 = require("@libs/ParsingUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const UserUtils_1 = require("@libs/UserUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReportActionCompose_1 = require("./ReportActionCompose/ReportActionCompose");
const SystemChatReportFooterMessage_1 = require("./SystemChatReportFooterMessage");
function ReportFooter({ lastReportAction, pendingAction, report = { reportID: '-1' }, reportMetadata, policy, isComposerFullSize = false, onComposerBlur, onComposerFocus, reportTransactions, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const personalDetail = (0, useCurrentUserPersonalDetails_1.default)();
    const [shouldShowComposeInput = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_SHOW_COMPOSE_INPUT, { canBeMissing: true });
    const [quickAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE, { canBeMissing: true });
    const [isAnonymousUser = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.authTokenType === CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS, canBeMissing: false });
    const [isBlockedFromChat] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BLOCKED_FROM_CHAT, {
        selector: (dateString) => {
            if (!dateString) {
                return false;
            }
            try {
                return new Date(dateString) >= new Date();
            }
            catch (error) {
                // If the NVP is malformed, we'll assume the user is not blocked from chat. This is not expected, so if it happens we'll log an alert.
                Log_1.default.alert(`[${CONST_1.default.ERROR.ENSURE_BUG_BOT}] Found malformed ${ONYXKEYS_1.default.NVP_BLOCKED_FROM_CHAT} nvp`, dateString);
                return false;
            }
        },
        canBeMissing: true,
    });
    const chatFooterStyles = { ...styles.chatFooter, minHeight: !isOffline ? CONST_1.default.CHAT_FOOTER_MIN_HEIGHT : 0 };
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isArchivedRoom = (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived);
    const isSmallSizeLayout = windowWidth - (shouldUseNarrowLayout ? 0 : variables_1.default.sideBarWithLHBWidth) < variables_1.default.anonymousReportFooterBreakpoint;
    // If a user just signed in and is viewing a public report, optimistically show the composer while loading the report, since they will have write access when the response comes back.
    const shouldShowComposerOptimistically = !isAnonymousUser && (0, ReportUtils_1.isPublicRoom)(report) && !!reportMetadata?.isLoadingInitialReportActions;
    const canPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived) ?? shouldShowComposerOptimistically;
    const shouldHideComposer = !canPerformWriteAction || isBlockedFromChat;
    const canWriteInReport = (0, ReportUtils_1.canWriteInReport)(report);
    const isSystemChat = (0, ReportUtils_1.isSystemChat)(report);
    const isAdminsOnlyPostingRoom = (0, ReportUtils_1.isAdminsOnlyPostingRoom)(report);
    const isUserPolicyAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy);
    const allPersonalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { availableLoginsList } = (0, useShortMentionsList_1.default)();
    const currentUserEmail = (0, NetworkStore_1.getCurrentUserEmail)();
    const handleCreateTask = (0, react_1.useCallback)((text) => {
        const match = text.match(CONST_1.default.REGEX.TASK_TITLE_WITH_OPTIONAL_SHORT_MENTION);
        if (!match) {
            return false;
        }
        let title = match[3] ? match[3].trim().replace(/\n/g, ' ') : undefined;
        if (!title) {
            return false;
        }
        const mention = match[1] ? match[1].trim() : '';
        const currentUserPrivateDomain = (0, LoginUtils_1.isEmailPublicDomain)(currentUserEmail ?? '') ? '' : expensify_common_1.Str.extractEmailDomain(currentUserEmail ?? '');
        const mentionWithDomain = (0, ParsingUtils_1.addDomainToShortMention)(mention, availableLoginsList, currentUserPrivateDomain) ?? mention;
        const isValidMention = expensify_common_1.Str.isValidEmail(mentionWithDomain);
        let assignee;
        let assigneeChatReport;
        if (mentionWithDomain) {
            if (isValidMention) {
                assignee = Object.values(allPersonalDetails ?? {}).find((value) => value?.login === mentionWithDomain) ?? undefined;
                if (!Object.keys(assignee ?? {}).length) {
                    const assigneeAccountID = (0, UserUtils_1.generateAccountID)(mentionWithDomain);
                    const optimisticDataForNewAssignee = (0, Task_1.setNewOptimisticAssignee)(mentionWithDomain, assigneeAccountID);
                    assignee = optimisticDataForNewAssignee.assignee;
                    assigneeChatReport = optimisticDataForNewAssignee.assigneeReport;
                }
            }
            else {
                // If the mention is not valid, include it on the title.
                // The mention could be invalid if it's a short mention and failed to be converted to a full mention.
                title = `@${mentionWithDomain} ${title}`;
            }
        }
        (0, Task_1.createTaskAndNavigate)(report.reportID, title, '', assignee?.login ?? '', assignee?.accountID, assigneeChatReport, report.policyID, true, quickAction);
        return true;
    }, [allPersonalDetails, availableLoginsList, currentUserEmail, quickAction, report.policyID, report.reportID]);
    const onSubmitComment = (0, react_1.useCallback)((text) => {
        const isTaskCreated = handleCreateTask(text);
        if (isTaskCreated) {
            return;
        }
        (0, Report_1.addComment)(report.reportID, text, personalDetail.timezone ?? CONST_1.default.DEFAULT_TIME_ZONE, true);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [report.reportID, handleCreateTask]);
    const [didHideComposerInput, setDidHideComposerInput] = (0, react_1.useState)(!shouldShowComposeInput);
    (0, react_1.useEffect)(() => {
        if (didHideComposerInput || shouldShowComposeInput) {
            return;
        }
        setDidHideComposerInput(true);
    }, [shouldShowComposeInput, didHideComposerInput]);
    return (<>
            {!!shouldHideComposer && (<react_native_1.View style={[
                styles.chatFooter,
                isArchivedRoom || isAnonymousUser || !canWriteInReport || (isAdminsOnlyPostingRoom && !isUserPolicyAdmin) ? styles.mt4 : {},
                shouldUseNarrowLayout ? styles.mb5 : null,
            ]}>
                    {isAnonymousUser && !isArchivedRoom && (<AnonymousReportFooter_1.default report={report} isSmallSizeLayout={isSmallSizeLayout}/>)}
                    {isArchivedRoom && <ArchivedReportFooter_1.default report={report}/>}
                    {!isArchivedRoom && !!isBlockedFromChat && <BlockedReportFooter_1.default />}
                    {!isAnonymousUser && !canWriteInReport && isSystemChat && <SystemChatReportFooterMessage_1.default />}
                    {isAdminsOnlyPostingRoom && !isUserPolicyAdmin && !isArchivedRoom && !isAnonymousUser && !isBlockedFromChat && (<Banner_1.default containerStyles={[styles.chatFooterBanner]} text={translate('adminOnlyCanPost')} icon={Expensicons.Lightbulb} shouldShowIcon/>)}
                    {!shouldUseNarrowLayout && (<react_native_1.View style={styles.offlineIndicatorContainer}>{shouldHideComposer && <OfflineIndicator_1.default containerStyles={[styles.chatItemComposeSecondaryRow]}/>}</react_native_1.View>)}
                </react_native_1.View>)}
            {!shouldHideComposer && (!!shouldShowComposeInput || !shouldUseNarrowLayout) && (<react_native_1.View style={[chatFooterStyles, isComposerFullSize && styles.chatFooterFullCompose]}>
                    <SwipeableView_1.default onSwipeDown={react_native_1.Keyboard.dismiss}>
                        <ReportActionCompose_1.default onSubmit={onSubmitComment} onComposerFocus={onComposerFocus} onComposerBlur={onComposerBlur} reportID={report.reportID} report={report} lastReportAction={lastReportAction} pendingAction={pendingAction} isComposerFullSize={isComposerFullSize} didHideComposerInput={didHideComposerInput} reportTransactions={reportTransactions}/>
                    </SwipeableView_1.default>
                </react_native_1.View>)}
        </>);
}
ReportFooter.displayName = 'ReportFooter';
exports.default = (0, react_1.memo)(ReportFooter, (prevProps, nextProps) => (0, fast_equals_1.deepEqual)(prevProps.report, nextProps.report) &&
    prevProps.pendingAction === nextProps.pendingAction &&
    prevProps.isComposerFullSize === nextProps.isComposerFullSize &&
    prevProps.lastReportAction === nextProps.lastReportAction &&
    (0, fast_equals_1.deepEqual)(prevProps.reportMetadata, nextProps.reportMetadata) &&
    (0, fast_equals_1.deepEqual)(prevProps.policy?.employeeList, nextProps.policy?.employeeList) &&
    (0, fast_equals_1.deepEqual)(prevProps.policy?.role, nextProps.policy?.role) &&
    (0, fast_equals_1.deepEqual)(prevProps.reportTransactions, nextProps.reportTransactions));
