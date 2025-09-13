"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const Workflow = require("@userActions/Workflow");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ApprovalWorkflowEditor_1 = require("./ApprovalWorkflowEditor");
function WorkspaceWorkflowsApprovalsCreatePage({ policy, isLoadingReportData = true, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [approvalWorkflow] = (0, useOnyx_1.default)(ONYXKEYS_1.default.APPROVAL_WORKFLOW);
    const formRef = (0, react_1.useRef)(null);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundView = ((0, EmptyObject_1.isEmptyObject)(policy) && !isLoadingReportData) || !PolicyUtils.isPolicyAdmin(policy) || PolicyUtils.isPendingDeletePolicy(policy);
    const createApprovalWorkflow = (0, react_1.useCallback)(() => {
        if (!approvalWorkflow) {
            return;
        }
        if (!Workflow.validateApprovalWorkflow(approvalWorkflow)) {
            return;
        }
        Workflow.createApprovalWorkflow(route.params.policyID, approvalWorkflow);
        Navigation_1.default.dismissModal();
    }, [approvalWorkflow, route.params.policyID]);
    const submitButtonContainerStyles = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding: true, style: [styles.mb5, styles.mh5] });
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceWorkflowsApprovalsCreatePage.displayName}>
                <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundView} subtitleKey={(0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized'} onBackButtonPress={PolicyUtils.goBackFromInvalidPolicy} onLinkPress={PolicyUtils.goBackFromInvalidPolicy} addBottomSafeAreaPadding>
                    <HeaderWithBackButton_1.default title={translate('workflowsCreateApprovalsPage.title')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_APPROVER.getRoute(route.params.policyID, 0))}/>
                    {!!approvalWorkflow && (<>
                            <ApprovalWorkflowEditor_1.default approvalWorkflow={approvalWorkflow} policy={policy} policyID={route.params.policyID} ref={formRef}/>
                            <FormAlertWithSubmitButton_1.default isAlertVisible={!(0, EmptyObject_1.isEmptyObject)(approvalWorkflow?.errors)} onSubmit={createApprovalWorkflow} onFixTheErrorsLinkPressed={() => {
                formRef.current?.scrollTo({ y: 0, animated: true });
            }} buttonText={translate('workflowsCreateApprovalsPage.submitButton')} containerStyles={submitButtonContainerStyles} enabledWhenOffline/>
                        </>)}
                    {!approvalWorkflow && <FullscreenLoadingIndicator_1.default />}
                </FullPageNotFoundView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceWorkflowsApprovalsCreatePage.displayName = 'WorkspaceWorkflowsApprovalsCreatePage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceWorkflowsApprovalsCreatePage);
