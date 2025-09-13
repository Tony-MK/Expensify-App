"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const WorkflowUtils_1 = require("@libs/WorkflowUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const Workflow_1 = require("@userActions/Workflow");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ApprovalWorkflowEditor_1 = require("./ApprovalWorkflowEditor");
function WorkspaceWorkflowsApprovalsEditPage({ policy, isLoadingReportData = true, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [approvalWorkflow] = (0, useOnyx_1.default)(ONYXKEYS_1.default.APPROVAL_WORKFLOW, { canBeMissing: true });
    const [initialApprovalWorkflow, setInitialApprovalWorkflow] = (0, react_1.useState)();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const formRef = (0, react_1.useRef)(null);
    const updateApprovalWorkflowCallback = (0, react_1.useCallback)(() => {
        if (!approvalWorkflow || !initialApprovalWorkflow) {
            return;
        }
        if (!(0, Workflow_1.validateApprovalWorkflow)(approvalWorkflow)) {
            return;
        }
        // We need to remove members and approvers that are no longer in the updated workflow
        const membersToRemove = initialApprovalWorkflow.members.filter((initialMember) => !approvalWorkflow.members.some((member) => member.email === initialMember.email));
        const approversToRemove = initialApprovalWorkflow.approvers.filter((initialApprover) => !approvalWorkflow.approvers.some((approver) => approver.email === initialApprover.email));
        Navigation_1.default.dismissModal();
        react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, Workflow_1.updateApprovalWorkflow)(route.params.policyID, approvalWorkflow, membersToRemove, approversToRemove);
        });
    }, [approvalWorkflow, initialApprovalWorkflow, route.params.policyID]);
    const removeApprovalWorkflowCallback = (0, react_1.useCallback)(() => {
        if (!initialApprovalWorkflow) {
            return;
        }
        setIsDeleteModalVisible(false);
        Navigation_1.default.dismissModal();
        react_native_1.InteractionManager.runAfterInteractions(() => {
            // Remove the approval workflow using the initial data as it could be already edited
            (0, Workflow_1.removeApprovalWorkflow)(route.params.policyID, initialApprovalWorkflow);
        });
    }, [initialApprovalWorkflow, route.params.policyID]);
    const { currentApprovalWorkflow, defaultWorkflowMembers, usedApproverEmails } = (0, react_1.useMemo)(() => {
        if (!policy || !personalDetails) {
            return {};
        }
        const firstApprover = route.params.firstApproverEmail;
        const result = (0, WorkflowUtils_1.convertPolicyEmployeesToApprovalWorkflows)({
            policy,
            personalDetails,
            firstApprover,
            localeCompare,
        });
        return {
            defaultWorkflowMembers: result.availableMembers,
            usedApproverEmails: result.usedApproverEmails,
            currentApprovalWorkflow: result.approvalWorkflows.find((workflow) => workflow.approvers.at(0)?.email === firstApprover),
        };
    }, [personalDetails, policy, route.params.firstApproverEmail, localeCompare]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundView = ((0, EmptyObject_1.isEmptyObject)(policy) && !isLoadingReportData) || !(0, PolicyUtils_1.isPolicyAdmin)(policy) || (0, PolicyUtils_1.isPendingDeletePolicy)(policy) || !currentApprovalWorkflow;
    // Set the initial approval workflow when the page is loaded
    (0, react_1.useEffect)(() => {
        if (initialApprovalWorkflow) {
            return;
        }
        if (!currentApprovalWorkflow) {
            return (0, Workflow_1.clearApprovalWorkflow)();
        }
        (0, Workflow_1.setApprovalWorkflow)({
            ...currentApprovalWorkflow,
            availableMembers: [...currentApprovalWorkflow.members, ...defaultWorkflowMembers],
            usedApproverEmails,
            action: CONST_1.default.APPROVAL_WORKFLOW.ACTION.EDIT,
            errors: null,
            originalApprovers: currentApprovalWorkflow.approvers,
        });
        setInitialApprovalWorkflow(currentApprovalWorkflow);
    }, [currentApprovalWorkflow, defaultWorkflowMembers, initialApprovalWorkflow, usedApproverEmails]);
    const submitButtonContainerStyles = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding: true, style: [styles.mb5, styles.mh5] });
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceWorkflowsApprovalsEditPage.displayName}>
                <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundView} subtitleKey={(0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized'} onBackButtonPress={PolicyUtils_1.goBackFromInvalidPolicy} onLinkPress={PolicyUtils_1.goBackFromInvalidPolicy} addBottomSafeAreaPadding>
                    <HeaderWithBackButton_1.default title={translate('workflowsEditApprovalsPage.title')} onBackButtonPress={Navigation_1.default.goBack}/>
                    {!!approvalWorkflow && (<>
                            <ApprovalWorkflowEditor_1.default approvalWorkflow={approvalWorkflow} removeApprovalWorkflow={() => setIsDeleteModalVisible(true)} policy={policy} policyID={route.params.policyID} ref={formRef}/>
                            <FormAlertWithSubmitButton_1.default isAlertVisible={!(0, EmptyObject_1.isEmptyObject)(approvalWorkflow?.errors)} onSubmit={updateApprovalWorkflowCallback} onFixTheErrorsLinkPressed={() => {
                formRef.current?.scrollTo({ y: 0, animated: true });
            }} buttonText={translate('common.save')} containerStyles={submitButtonContainerStyles} enabledWhenOffline/>
                        </>)}
                    {!initialApprovalWorkflow && <FullscreenLoadingIndicator_1.default />}
                </FullPageNotFoundView_1.default>
                <ConfirmModal_1.default title={translate('workflowsEditApprovalsPage.deleteTitle')} isVisible={isDeleteModalVisible} onConfirm={removeApprovalWorkflowCallback} onCancel={() => setIsDeleteModalVisible(false)} prompt={translate('workflowsEditApprovalsPage.deletePrompt')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceWorkflowsApprovalsEditPage.displayName = 'WorkspaceWorkflowsApprovalsEditPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceWorkflowsApprovalsEditPage);
