"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const TextCommentFragment_1 = require("./comment/TextCommentFragment");
const ReportActionItemFragment_1 = require("./ReportActionItemFragment");
function ReportActionItemMessage({ action, displayAsGroup, reportID, style, isHidden = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)((0, ReportActionsUtils_1.getLinkedTransactionID)(action))}`, { canBeMissing: true });
    const fragments = (0, ReportActionsUtils_1.getReportActionMessageFragments)(action);
    const isIOUReport = (0, ReportActionsUtils_1.isMoneyRequestAction)(action);
    if ((0, ReportActionsUtils_1.isMemberChangeAction)(action)) {
        const fragment = (0, ReportActionsUtils_1.getMemberChangeMessageFragment)(action, ReportUtils_1.getReportName);
        return (<react_native_1.View style={[styles.chatItemMessage, style]}>
                <TextCommentFragment_1.default fragment={fragment} displayAsGroup={displayAsGroup} style={style} source="" styleAsDeleted={false}/>
            </react_native_1.View>);
    }
    if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.UPDATE_ROOM_DESCRIPTION) {
        const fragment = (0, ReportActionsUtils_1.getUpdateRoomDescriptionFragment)(action);
        return (<react_native_1.View style={[styles.chatItemMessage, style]}>
                <TextCommentFragment_1.default fragment={fragment} displayAsGroup={displayAsGroup} style={style} source="" styleAsDeleted={false}/>
            </react_native_1.View>);
    }
    const handleEnterSignerInfoPress = (policyID, bankAccountID, isCompleted) => {
        if (!policyID || !bankAccountID) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.BANK_ACCOUNT_ENTER_SIGNER_INFO.getRoute(policyID, bankAccountID, isCompleted));
    };
    if ((0, ReportActionsUtils_1.isReimbursementDirectionInformationRequiredAction)(action)) {
        const { bankAccountLastFour, currency, policyID, bankAccountID, completed } = (0, ReportActionsUtils_1.getOriginalMessage)(action) ?? {};
        return (<react_native_1.View style={[styles.chatItemMessage, style]}>
                <Text_1.default>{translate('signerInfoStep.isConnecting', { bankAccountLastFour, currency })}</Text_1.default>
                <Button_1.default style={[styles.mt2, styles.alignSelfStart]} success isDisabled={completed} text={translate(completed ? 'signerInfoStep.thisStep' : 'signerInfoStep.enterSignerInfo')} onPress={() => handleEnterSignerInfoPress(policyID, bankAccountID, !!completed)}/>
            </react_native_1.View>);
    }
    let iouMessage;
    if (isIOUReport) {
        const originalMessage = action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.IOU ? (0, ReportActionsUtils_1.getOriginalMessage)(action) : null;
        const iouReportID = originalMessage?.IOUReportID;
        if (iouReportID) {
            iouMessage = (0, ReportUtils_1.getIOUReportActionDisplayMessage)(action, transaction, report);
        }
    }
    const isApprovedOrSubmittedReportAction = (0, ReportActionsUtils_1.isApprovedOrSubmittedReportAction)(action);
    const isHoldReportAction = [CONST_1.default.REPORT.ACTIONS.TYPE.HOLD, CONST_1.default.REPORT.ACTIONS.TYPE.UNHOLD].some((type) => type === action.actionName);
    /**
     * Get the ReportActionItemFragments
     * @param shouldWrapInText determines whether the fragments are wrapped in a Text component
     * @returns report action item fragments
     */
    const renderReportActionItemFragments = (shouldWrapInText) => {
        const reportActionItemFragments = fragments.map((fragment, index) => (<ReportActionItemFragment_1.default 
        /* eslint-disable-next-line react/no-array-index-key */
        key={`actionFragment-${action.reportActionID}-${index}`} reportActionID={action.reportActionID} fragment={fragment} iouMessage={iouMessage} isThreadParentMessage={(0, ReportActionsUtils_1.isThreadParentMessage)(action, reportID)} pendingAction={action.pendingAction} actionName={action.actionName} source={(0, ReportActionsUtils_1.isAddCommentAction)(action) ? (0, ReportActionsUtils_1.getOriginalMessage)(action)?.source : ''} accountID={action.actorAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID} style={style} displayAsGroup={displayAsGroup} isApprovedOrSubmittedReportAction={isApprovedOrSubmittedReportAction} isHoldReportAction={isHoldReportAction} 
        // Since system messages from Old Dot begin with the person who performed the action,
        // the first fragment will contain the person's display name and their email. We'll use this
        // to decide if the fragment should be from left to right for RTL display names e.g. Arabic for proper
        // formatting.
        isFragmentContainingDisplayName={index === 0} moderationDecision={(0, ReportActionsUtils_1.getReportActionMessage)(action)?.moderationDecision?.decision}/>));
        // Approving or submitting reports in oldDot results in system messages made up of multiple fragments of `TEXT` type
        // which we need to wrap in `<Text>` to prevent them rendering on separate lines.
        return shouldWrapInText ? <Text_1.default style={styles.ltr}>{reportActionItemFragments}</Text_1.default> : reportActionItemFragments;
    };
    const openWorkspaceInvoicesPage = () => {
        const policyID = report?.policyID;
        if (!policyID) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INVOICES.getRoute(policyID));
    };
    const shouldShowAddBankAccountButton = action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.IOU && (0, ReportUtils_1.hasMissingInvoiceBankAccount)(reportID) && !(0, ReportUtils_1.isSettled)(reportID);
    return (<react_native_1.View style={[styles.chatItemMessage, style]}>
            {!isHidden ? (<>
                    {renderReportActionItemFragments(isApprovedOrSubmittedReportAction)}
                    {shouldShowAddBankAccountButton && (<Button_1.default style={[styles.mt2, styles.alignSelfStart]} success text={translate('bankAccount.addBankAccount')} onPress={openWorkspaceInvoicesPage}/>)}
                </>) : (<Text_1.default style={[styles.textLabelSupporting, styles.lh20]}>{translate('moderation.flaggedContent')}</Text_1.default>)}
        </react_native_1.View>);
}
ReportActionItemMessage.displayName = 'ReportActionItemMessage';
exports.default = ReportActionItemMessage;
