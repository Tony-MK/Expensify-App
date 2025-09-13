"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function ApprovalWorkflowEditor({ approvalWorkflow, removeApprovalWorkflow, policy, policyID }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, toLocaleOrdinal, localeCompare } = (0, useLocalize_1.default)();
    const approverCount = approvalWorkflow.approvers.length;
    const approverDescription = (0, react_1.useCallback)((index) => (approverCount > 1 ? `${toLocaleOrdinal(index + 1, true)} ${translate('workflowsPage.approver').toLowerCase()}` : `${translate('workflowsPage.approver')}`), [approverCount, toLocaleOrdinal, translate]);
    const getApprovalPendingAction = (0, react_1.useCallback)((index) => {
        let pendingAction;
        if (index === 0) {
            approvalWorkflow?.members?.forEach((member) => {
                pendingAction = pendingAction ?? member.pendingFields?.submitsTo;
            });
            return pendingAction;
        }
        const previousApprover = approvalWorkflow?.approvers.at(index - 1);
        const previousMember = approvalWorkflow?.members?.find((member) => member?.email === previousApprover?.email);
        return previousMember?.pendingFields?.forwardsTo;
    }, [approvalWorkflow]);
    const members = (0, react_1.useMemo)(() => {
        if (approvalWorkflow.isDefault) {
            return translate('workspace.common.everyone');
        }
        return (0, OptionsListUtils_1.sortAlphabetically)(approvalWorkflow.members, 'displayName', localeCompare)
            .map((m) => expensify_common_1.Str.removeSMSDomain(m.displayName))
            .join(', ');
    }, [approvalWorkflow.isDefault, approvalWorkflow.members, translate, localeCompare]);
    const approverErrorMessage = (0, react_1.useCallback)((approver, approverIndex) => {
        const previousApprover = approvalWorkflow.approvers.slice(0, approverIndex).filter(Boolean).at(-1);
        const error = approvalWorkflow?.errors?.[`approver-${approverIndex}`];
        if (!error) {
            return;
        }
        if (error === 'workflowsPage.approverCircularReference') {
            if (!previousApprover || !approver) {
                return;
            }
            return translate('workflowsPage.approverCircularReference', {
                name1: expensify_common_1.Str.removeSMSDomain(approver.displayName),
                name2: expensify_common_1.Str.removeSMSDomain(previousApprover.displayName),
            });
        }
        return translate(error);
    }, [approvalWorkflow.approvers, approvalWorkflow.errors, translate]);
    const editMembers = (0, react_1.useCallback)(() => {
        const backTo = approvalWorkflow.action === CONST_1.default.APPROVAL_WORKFLOW.ACTION.CREATE ? ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_NEW.getRoute(policyID) : undefined;
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_EXPENSES_FROM.getRoute(policyID, backTo));
    }, [approvalWorkflow.action, policyID]);
    const editApprover = (0, react_1.useCallback)((approverIndex) => {
        const backTo = approvalWorkflow.action === CONST_1.default.APPROVAL_WORKFLOW.ACTION.CREATE ? ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_NEW.getRoute(policyID) : undefined;
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_APPROVER.getRoute(policyID, approverIndex, backTo));
    }, [approvalWorkflow.action, policyID]);
    // User should be allowed to add additional approver only if they upgraded to Control Plan, otherwise redirected to the Upgrade Page
    const addAdditionalApprover = (0, react_1.useCallback)(() => {
        if (!(0, PolicyUtils_1.isControlPolicy)(policy) && approverCount > 0) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.approvals.alias, Navigation_1.default.getActiveRoute()));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_APPROVER.getRoute(policyID, approverCount, ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_NEW.getRoute(policyID)));
    }, [approverCount, policy, policyID]);
    return (<ScrollView_1.default style={[styles.flex1]} ref={ref} addBottomSafeAreaPadding>
            <react_native_1.View style={[styles.mh5]}>
                {approvalWorkflow.action === CONST_1.default.APPROVAL_WORKFLOW.ACTION.CREATE && (<Text_1.default style={[styles.textHeadlineH1, styles.mv3]}>{translate('workflowsCreateApprovalsPage.header')}</Text_1.default>)}

                <MenuItemWithTopDescription_1.default title={members} titleStyle={styles.textNormalThemeText} numberOfLinesTitle={4} description={translate('workflowsExpensesFromPage.title')} descriptionTextStyle={!!members && styles.textLabelSupportingNormal} onPress={editMembers} wrapperStyle={[styles.sectionMenuItemTopDescription]} errorText={approvalWorkflow?.errors?.members ? translate(approvalWorkflow.errors.members) : undefined} brickRoadIndicator={approvalWorkflow?.errors?.members ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} shouldShowRightIcon={!approvalWorkflow.isDefault} interactive={!approvalWorkflow.isDefault}/>

                {approvalWorkflow.approvers.map((approver, approverIndex) => {
            const errorText = approverErrorMessage(approver, approverIndex);
            const hintText = !errorText && approvalWorkflow.usedApproverEmails.some((approverEmail) => approverEmail === approver?.email)
                ? translate('workflowsPage.approverInMultipleWorkflows')
                : undefined;
            return (<OfflineWithFeedback_1.default 
            // eslint-disable-next-line react/no-array-index-key
            key={`approver-${approver?.email}-${approverIndex}`} pendingAction={getApprovalPendingAction(approverIndex)}>
                            <MenuItemWithTopDescription_1.default title={expensify_common_1.Str.removeSMSDomain(approver?.displayName ?? '')} titleStyle={styles.textNormalThemeText} wrapperStyle={styles.sectionMenuItemTopDescription} description={approverDescription(approverIndex)} descriptionTextStyle={!!approver?.displayName && styles.textLabelSupportingNormal} onPress={() => editApprover(approverIndex)} shouldShowRightIcon hintText={hintText} shouldRenderHintAsHTML brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} shouldRenderErrorAsHTML/>
                        </OfflineWithFeedback_1.default>);
        })}

                <MenuItemWithTopDescription_1.default description={approverCount > 0 ? translate('workflowsCreateApprovalsPage.additionalApprover') : translate('workflowsPage.approver')} onPress={addAdditionalApprover} shouldShowRightIcon wrapperStyle={styles.sectionMenuItemTopDescription} errorText={approvalWorkflow?.errors?.additionalApprover ? translate(approvalWorkflow.errors.additionalApprover) : undefined} brickRoadIndicator={approvalWorkflow?.errors?.additionalApprover ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>

                {!!removeApprovalWorkflow && !approvalWorkflow.isDefault && (<MenuItem_1.default wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt6]} icon={Expensicons.Trashcan} title={translate('common.delete')} onPress={removeApprovalWorkflow}/>)}
            </react_native_1.View>
        </ScrollView_1.default>);
}
ApprovalWorkflowEditor.displayName = 'ApprovalWorkflowEditor';
exports.default = (0, react_1.forwardRef)(ApprovalWorkflowEditor);
