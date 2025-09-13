"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
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
const useDeepCompareRef_1 = require("@hooks/useDeepCompareRef");
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
function WorkspaceWorkflowsApprovalsExpensesFromPage({ policy, isLoadingReportData = true, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [approvalWorkflow, approvalWorkflowResults] = (0, useOnyx_1.default)(ONYXKEYS_1.default.APPROVAL_WORKFLOW, { canBeMissing: true });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const isLoadingApprovalWorkflow = (0, isLoadingOnyxValue_1.default)(approvalWorkflowResults);
    const [selectedMembers, setSelectedMembers] = (0, react_1.useState)([]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundView = ((0, EmptyObject_1.isEmptyObject)(policy) && !isLoadingReportData) || !(0, PolicyUtils_1.isPolicyAdmin)(policy) || (0, PolicyUtils_1.isPendingDeletePolicy)(policy);
    const isInitialCreationFlow = approvalWorkflow?.action === CONST_1.default.APPROVAL_WORKFLOW.ACTION.CREATE && !route.params.backTo;
    const shouldShowListEmptyContent = !isLoadingApprovalWorkflow && approvalWorkflow && approvalWorkflow.availableMembers.length === 0;
    const firstApprover = approvalWorkflow?.originalApprovers?.[0]?.email ?? '';
    const personalDetailLogins = (0, useDeepCompareRef_1.default)(Object.fromEntries(Object.entries(personalDetails ?? {}).map(([id, details]) => [id, details?.login])));
    (0, react_1.useEffect)(() => {
        if (!approvalWorkflow?.members) {
            return;
        }
        setSelectedMembers(approvalWorkflow.members.map((member) => {
            const policyMemberEmailsToAccountIDs = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList);
            const accountID = Number(policyMemberEmailsToAccountIDs[member.email] ?? '');
            const login = personalDetailLogins?.[accountID];
            return {
                text: expensify_common_1.Str.removeSMSDomain(member.displayName),
                alternateText: member.email,
                keyForList: member.email,
                isSelected: true,
                login: member.email,
                icons: [{ source: member.avatar ?? Expensicons_1.FallbackAvatar, type: CONST_1.default.ICON_TYPE_AVATAR, name: expensify_common_1.Str.removeSMSDomain(member.displayName), id: accountID }],
                rightElement: (<MemberRightIcon_1.default role={policy?.employeeList?.[member.email]?.role} owner={policy?.owner} login={login}/>),
            };
        }));
    }, [approvalWorkflow?.members, policy?.employeeList, policy?.owner, personalDetailLogins, translate]);
    const approversEmail = (0, react_1.useMemo)(() => approvalWorkflow?.approvers.map((member) => member?.email), [approvalWorkflow?.approvers]);
    const sections = (0, react_1.useMemo)(() => {
        const members = [...selectedMembers];
        if (approvalWorkflow?.availableMembers) {
            const availableMembers = approvalWorkflow.availableMembers
                .map((member) => {
                const policyMemberEmailsToAccountIDs = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList);
                const accountID = Number(policyMemberEmailsToAccountIDs[member.email] ?? '');
                const login = personalDetailLogins?.[accountID];
                return {
                    text: expensify_common_1.Str.removeSMSDomain(member.displayName),
                    alternateText: member.email,
                    keyForList: member.email,
                    isSelected: false,
                    login: member.email,
                    icons: [{ source: member.avatar ?? Expensicons_1.FallbackAvatar, type: CONST_1.default.ICON_TYPE_AVATAR, name: expensify_common_1.Str.removeSMSDomain(member.displayName), id: accountID }],
                    rightElement: (<MemberRightIcon_1.default role={policy?.employeeList?.[member.email]?.role} owner={policy?.owner} login={login}/>),
                };
            })
                .filter((member) => (!policy?.preventSelfApproval || !approversEmail?.includes(member.login)) && !selectedMembers.some((selectedOption) => selectedOption.login === member.login));
            members.push(...availableMembers);
        }
        const filteredMembers = debouncedSearchTerm !== ''
            ? (0, tokenizedSearch_1.default)(members, (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode), (option) => [option.text ?? '', option.login ?? ''])
            : members;
        return [
            {
                title: undefined,
                data: (0, OptionsListUtils_1.sortAlphabetically)(filteredMembers, 'text', localeCompare),
                shouldShow: true,
            },
        ];
    }, [
        selectedMembers,
        approvalWorkflow?.availableMembers,
        debouncedSearchTerm,
        countryCode,
        localeCompare,
        policy?.employeeList,
        policy?.owner,
        policy?.preventSelfApproval,
        personalDetailLogins,
        approversEmail,
    ]);
    const goBack = (0, react_1.useCallback)(() => {
        let backTo;
        if (approvalWorkflow?.action === CONST_1.default.APPROVAL_WORKFLOW.ACTION.EDIT) {
            backTo = ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_EDIT.getRoute(route.params.policyID, firstApprover);
        }
        else if (!isInitialCreationFlow) {
            backTo = ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_NEW.getRoute(route.params.policyID);
        }
        Navigation_1.default.goBack(backTo);
    }, [isInitialCreationFlow, route.params.policyID, firstApprover, approvalWorkflow?.action]);
    const nextStep = (0, react_1.useCallback)(() => {
        const members = selectedMembers.map((member) => ({ displayName: member.text, avatar: member.icons?.[0]?.source, email: member.login }));
        (0, Workflow_1.setApprovalWorkflowMembers)(members);
        if (isInitialCreationFlow) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_APPROVER.getRoute(route.params.policyID, 0));
        }
        else {
            goBack();
        }
    }, [route.params.policyID, selectedMembers, isInitialCreationFlow, goBack]);
    const button = (0, react_1.useMemo)(() => {
        let buttonText = isInitialCreationFlow ? translate('common.next') : translate('common.save');
        if (shouldShowListEmptyContent) {
            buttonText = translate('common.buttonConfirm');
        }
        return (<FormAlertWithSubmitButton_1.default isDisabled={!shouldShowListEmptyContent && !selectedMembers.length} buttonText={buttonText} onSubmit={shouldShowListEmptyContent ? () => Navigation_1.default.goBack() : nextStep} containerStyles={[styles.flexReset, styles.flexGrow0, styles.flexShrink0, styles.flexBasisAuto]} enabledWhenOffline/>);
    }, [isInitialCreationFlow, nextStep, selectedMembers.length, shouldShowListEmptyContent, styles.flexBasisAuto, styles.flexGrow0, styles.flexReset, styles.flexShrink0, translate]);
    const toggleMember = (member) => {
        const isAlreadySelected = selectedMembers.some((selectedOption) => selectedOption.login === member.login);
        setSelectedMembers(isAlreadySelected ? selectedMembers.filter((selectedOption) => selectedOption.login !== member.login) : [...selectedMembers, { ...member, isSelected: true }]);
    };
    const headerMessage = (0, react_1.useMemo)(() => (searchTerm && !sections.at(0)?.data?.length ? translate('common.noResultsFound') : ''), [searchTerm, sections, translate]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TurtleInShell} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workflowsPage.emptyContent.title')} subtitle={translate('workflowsPage.emptyContent.expensesFromSubtitle')} subtitleStyle={styles.textSupporting} containerStyle={styles.pb10} contentFitImage="contain"/>), [translate, styles.textSupporting, styles.pb10]);
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceWorkflowsApprovalsExpensesFromPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight>
                <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundView} subtitleKey={(0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized'} onBackButtonPress={PolicyUtils_1.goBackFromInvalidPolicy} onLinkPress={PolicyUtils_1.goBackFromInvalidPolicy} addBottomSafeAreaPadding>
                    <HeaderWithBackButton_1.default title={translate('workflowsExpensesFromPage.title')} onBackButtonPress={goBack}/>

                    {approvalWorkflow?.action === CONST_1.default.APPROVAL_WORKFLOW.ACTION.CREATE && !shouldShowListEmptyContent && (<Text_1.default style={[styles.textHeadlineH1, styles.mh5, styles.mv3]}>{translate('workflowsExpensesFromPage.header')}</Text_1.default>)}
                    <SelectionList_1.default canSelectMultiple sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={shouldShowListEmptyContent ? undefined : translate('selectionList.findMember')} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={headerMessage} onSelectRow={toggleMember} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} footerContent={button} listEmptyContent={listEmptyContent} shouldShowListEmptyContent={shouldShowListEmptyContent} showLoadingPlaceholder={isLoadingApprovalWorkflow} addBottomSafeAreaPadding/>
                </FullPageNotFoundView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceWorkflowsApprovalsExpensesFromPage.displayName = 'WorkspaceWorkflowsApprovalsExpensesFromPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceWorkflowsApprovalsExpensesFromPage);
