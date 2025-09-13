"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const Text_1 = require("@components/Text");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Workflow_1 = require("@libs/actions/Workflow");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const MemberRightIcon_1 = require("@pages/workspace/MemberRightIcon");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function WorkspaceWorkflowsApprovalsApproverPage({ policy, personalDetails, isLoadingReportData = true, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [approvalWorkflow, approvalWorkflowMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.APPROVAL_WORKFLOW, { canBeMissing: true });
    const isApprovalWorkflowLoading = (0, isLoadingOnyxValue_1.default)(approvalWorkflowMetadata);
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [selectedApproverEmail, setSelectedApproverEmail] = (0, react_1.useState)(undefined);
    const [allApprovers, setAllApprovers] = (0, react_1.useState)([]);
    const shouldShowTextInput = allApprovers?.length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundView = ((0, EmptyObject_1.isEmptyObject)(policy) && !isLoadingReportData) || !(0, PolicyUtils_1.isPolicyAdmin)(policy) || (0, PolicyUtils_1.isPendingDeletePolicy)(policy);
    const approverIndex = Number(route.params.approverIndex) ?? 0;
    const isInitialCreationFlow = approvalWorkflow?.action === CONST_1.default.APPROVAL_WORKFLOW.ACTION.CREATE && !route.params.backTo;
    const defaultApprover = (0, PolicyUtils_1.getDefaultApprover)(policy);
    const firstApprover = approvalWorkflow?.approvers?.[0]?.email ?? '';
    const rhpRoutes = (0, native_1.useNavigationState)((state) => state.routes);
    (0, react_1.useEffect)(() => {
        const currentApprover = approvalWorkflow?.approvers[approverIndex];
        if (!currentApprover) {
            return;
        }
        setSelectedApproverEmail(currentApprover.email);
    }, [approvalWorkflow?.approvers, approverIndex]);
    const employeeList = policy?.employeeList;
    const approversFromWorkflow = approvalWorkflow?.approvers;
    const isDefault = approvalWorkflow?.isDefault;
    const membersEmail = (0, react_1.useMemo)(() => approvalWorkflow?.members.map((member) => member.email), [approvalWorkflow?.members]);
    const sections = (0, react_1.useMemo)(() => {
        const approvers = [];
        if (isApprovalWorkflowLoading) {
            return [];
        }
        if (employeeList) {
            const availableApprovers = Object.values(employeeList)
                .map((employee) => {
                const email = employee.email;
                if (!email) {
                    return null;
                }
                if (!isDefault && policy?.preventSelfApproval && membersEmail?.includes(email)) {
                    return null;
                }
                // Do not allow the same email to be added twice
                const isEmailAlreadyInApprovers = approversFromWorkflow?.some((approver, index) => approver?.email === email && index !== approverIndex);
                if (isEmailAlreadyInApprovers && selectedApproverEmail !== email) {
                    return null;
                }
                // Do not allow the default approver to be added as the first approver
                if (!isDefault && approverIndex === 0 && defaultApprover === email) {
                    return null;
                }
                const policyMemberEmailsToAccountIDs = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(employeeList);
                const accountID = Number(policyMemberEmailsToAccountIDs[email] ?? '');
                const { avatar, displayName = email, login } = personalDetails?.[accountID] ?? {};
                return {
                    text: displayName,
                    alternateText: email,
                    keyForList: email,
                    isSelected: selectedApproverEmail === email,
                    login: email,
                    icons: [{ source: avatar ?? Expensicons_1.FallbackAvatar, type: CONST_1.default.ICON_TYPE_AVATAR, name: displayName, id: accountID }],
                    rightElement: (<MemberRightIcon_1.default role={employee.role} owner={policy?.owner} login={login}/>),
                };
            })
                .filter((approver) => !!approver);
            approvers.push(...availableApprovers);
            // eslint-disable-next-line react-compiler/react-compiler
            setAllApprovers(approvers);
        }
        const filteredApprovers = debouncedSearchTerm !== ''
            ? (0, tokenizedSearch_1.default)(approvers, (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode), (option) => [option.text ?? '', option.login ?? ''])
            : approvers;
        const data = (0, OptionsListUtils_1.sortAlphabetically)(filteredApprovers, 'text', localeCompare);
        return [
            {
                title: undefined,
                data,
                shouldShow: true,
            },
        ];
    }, [
        isApprovalWorkflowLoading,
        employeeList,
        debouncedSearchTerm,
        countryCode,
        localeCompare,
        policy?.preventSelfApproval,
        policy?.owner,
        membersEmail,
        approversFromWorkflow,
        selectedApproverEmail,
        isDefault,
        approverIndex,
        defaultApprover,
        personalDetails,
    ]);
    const shouldShowListEmptyContent = !debouncedSearchTerm && !!approvalWorkflow && !sections.at(0)?.data.length && !isApprovalWorkflowLoading;
    const goBack = (0, react_1.useCallback)(() => {
        let backTo;
        if (isInitialCreationFlow) {
            backTo = ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_EXPENSES_FROM.getRoute(route.params.policyID);
            (0, Workflow_1.clearApprovalWorkflowApprovers)();
        }
        else if (approvalWorkflow?.action === CONST_1.default.APPROVAL_WORKFLOW.ACTION.EDIT) {
            backTo = rhpRoutes.length > 1 ? undefined : ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_EDIT.getRoute(route.params.policyID, firstApprover);
        }
        else {
            backTo = ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_NEW.getRoute(route.params.policyID);
        }
        Navigation_1.default.goBack(backTo);
    }, [isInitialCreationFlow, approvalWorkflow?.action, route.params.policyID, rhpRoutes.length, firstApprover]);
    const nextStep = (0, react_1.useCallback)(() => {
        if (selectedApproverEmail) {
            const policyMemberEmailsToAccountIDs = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(employeeList);
            const accountID = Number(policyMemberEmailsToAccountIDs[selectedApproverEmail] ?? '');
            const { avatar, displayName = selectedApproverEmail } = personalDetails?.[accountID] ?? {};
            (0, Workflow_1.setApprovalWorkflowApprover)({
                email: selectedApproverEmail,
                avatar,
                displayName,
            }, approverIndex, route.params.policyID);
        }
        else {
            (0, Workflow_1.clearApprovalWorkflowApprover)(approverIndex);
        }
        if (isInitialCreationFlow) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_NEW.getRoute(route.params.policyID));
        }
        else {
            goBack();
        }
    }, [selectedApproverEmail, employeeList, personalDetails, approverIndex, route.params.policyID, isInitialCreationFlow, goBack]);
    const button = (0, react_1.useMemo)(() => {
        let buttonText = isInitialCreationFlow ? translate('common.next') : translate('common.save');
        if (shouldShowListEmptyContent) {
            buttonText = translate('common.buttonConfirm');
        }
        return (<FormAlertWithSubmitButton_1.default isDisabled={!shouldShowListEmptyContent && !selectedApproverEmail && isInitialCreationFlow} buttonText={buttonText} onSubmit={nextStep} containerStyles={[styles.flexReset, styles.flexGrow0, styles.flexShrink0, styles.flexBasisAuto]} enabledWhenOffline shouldBlendOpacity/>);
    }, [isInitialCreationFlow, nextStep, selectedApproverEmail, shouldShowListEmptyContent, styles.flexBasisAuto, styles.flexGrow0, styles.flexReset, styles.flexShrink0, translate]);
    const toggleApprover = (0, react_1.useCallback)((approver) => (0, debounce_1.default)(() => {
        if (selectedApproverEmail === approver.login) {
            setSelectedApproverEmail(undefined);
            return;
        }
        setSelectedApproverEmail(approver.login);
    }, 200)(), [selectedApproverEmail]);
    const headerMessage = (0, react_1.useMemo)(() => (searchTerm && !sections.at(0)?.data?.length ? translate('common.noResultsFound') : ''), [searchTerm, sections, translate]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TurtleInShell} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workflowsPage.emptyContent.title')} subtitle={translate('workflowsPage.emptyContent.approverSubtitle')} subtitleStyle={styles.textSupporting} containerStyle={styles.pb10} contentFitImage="contain"/>), [translate, styles.textSupporting, styles.pb10]);
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceWorkflowsApprovalsApproverPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
                <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundView} subtitleKey={(0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized'} onBackButtonPress={PolicyUtils_1.goBackFromInvalidPolicy} onLinkPress={PolicyUtils_1.goBackFromInvalidPolicy} addBottomSafeAreaPadding>
                    <HeaderWithBackButton_1.default title={translate('workflowsPage.approver')} onBackButtonPress={goBack}/>
                    {approvalWorkflow?.action === CONST_1.default.APPROVAL_WORKFLOW.ACTION.CREATE && !shouldShowListEmptyContent && (<Text_1.default style={[styles.textHeadlineH1, styles.mh5, styles.mv3]}>{translate('workflowsApproverPage.header')}</Text_1.default>)}
                    <SelectionList_1.default sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={shouldShowListEmptyContent ? undefined : translate('selectionList.findMember')} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={headerMessage} onSelectRow={toggleApprover} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} footerContent={button} listEmptyContent={listEmptyContent} shouldShowListEmptyContent={shouldShowListEmptyContent} initiallyFocusedOptionKey={selectedApproverEmail} shouldUpdateFocusedIndex shouldShowTextInput={shouldShowTextInput} addBottomSafeAreaPadding/>
                </FullPageNotFoundView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceWorkflowsApprovalsApproverPage.displayName = 'WorkspaceWorkflowsApprovalsApproverPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceWorkflowsApprovalsApproverPage);
