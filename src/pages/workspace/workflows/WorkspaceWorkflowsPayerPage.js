"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Badge_1 = require("@components/Badge");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function WorkspaceWorkflowsPayerPage({ route, policy, personalDetails, isLoadingReportData = true }) {
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const policyName = policy?.name ?? '';
    const { isOffline } = (0, useNetwork_1.default)();
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const isDeletedPolicyEmployee = (0, react_1.useCallback)((policyEmployee) => !isOffline && policyEmployee.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && (0, EmptyObject_1.isEmptyObject)(policyEmployee.errors), [isOffline]);
    const [formattedPolicyAdmins, formattedAuthorizedPayer] = (0, react_1.useMemo)(() => {
        const policyAdminDetails = [];
        const authorizedPayerDetails = [];
        const policyMemberEmailsToAccountIDs = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList);
        Object.entries(policy?.employeeList ?? {}).forEach(([email, policyEmployee]) => {
            const accountID = policyMemberEmailsToAccountIDs?.[email] ?? '';
            const details = personalDetails?.[accountID];
            if (!details) {
                Log_1.default.hmmm(`[WorkspaceMembersPage] no personal details found for policy member with accountID: ${accountID}`);
                return;
            }
            const isOwner = policy?.owner === details?.login;
            const isAdmin = policyEmployee.role === CONST_1.default.POLICY.ROLE.ADMIN;
            const shouldSkipMember = isDeletedPolicyEmployee(policyEmployee) || (0, PolicyUtils_1.isExpensifyTeam)(details?.login) || (!isOwner && !isAdmin);
            if (shouldSkipMember) {
                return;
            }
            const roleBadge = <Badge_1.default text={isOwner ? translate('common.owner') : translate('common.admin')}/>;
            const isAuthorizedPayer = policy?.achAccount?.reimburser === details?.login;
            const formattedMember = {
                keyForList: String(accountID),
                accountID,
                isSelected: isAuthorizedPayer,
                isDisabled: policyEmployee.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || !(0, EmptyObject_1.isEmptyObject)(policyEmployee.errors),
                text: formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(details)),
                alternateText: formatPhoneNumber(details?.login ?? ''),
                rightElement: roleBadge,
                icons: [
                    {
                        source: details.avatar ?? Expensicons_1.FallbackAvatar,
                        name: formatPhoneNumber(details?.login ?? ''),
                        type: CONST_1.default.ICON_TYPE_AVATAR,
                        id: accountID,
                    },
                ],
                errors: policyEmployee.errors,
                pendingAction: (policyEmployee.pendingAction ?? isAuthorizedPayer) ? policy?.pendingFields?.reimburser : null,
            };
            if (isAuthorizedPayer) {
                authorizedPayerDetails.push(formattedMember);
            }
            else {
                policyAdminDetails.push(formattedMember);
            }
        });
        return [policyAdminDetails, authorizedPayerDetails];
    }, [personalDetails, policy?.employeeList, translate, policy?.achAccount?.reimburser, isDeletedPolicyEmployee, policy?.owner, policy?.pendingFields?.reimburser, formatPhoneNumber]);
    const sections = (0, react_1.useMemo)(() => {
        const sectionsArray = [];
        if (searchTerm !== '') {
            const searchValue = (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(searchTerm, countryCode);
            const filteredOptions = (0, tokenizedSearch_1.default)([...formattedPolicyAdmins, ...formattedAuthorizedPayer], searchValue, (option) => [option.text ?? '', option.login ?? '']);
            return [
                {
                    title: undefined,
                    data: filteredOptions,
                    shouldShow: true,
                },
            ];
        }
        sectionsArray.push({
            data: formattedAuthorizedPayer,
            shouldShow: true,
        });
        sectionsArray.push({
            title: translate('workflowsPayerPage.admins'),
            data: formattedPolicyAdmins,
            shouldShow: true,
        });
        return sectionsArray;
    }, [searchTerm, formattedAuthorizedPayer, translate, formattedPolicyAdmins, countryCode]);
    const headerMessage = (0, react_1.useMemo)(() => (searchTerm && !sections.at(0)?.data.length ? translate('common.noResultsFound') : ''), 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [translate, sections]);
    const setPolicyAuthorizedPayer = (member) => {
        const authorizedPayerEmail = personalDetails?.[member.accountID]?.login ?? '';
        if (policy?.achAccount?.reimburser === authorizedPayerEmail || policy?.reimbursementChoice !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES) {
            Navigation_1.default.goBack();
            return;
        }
        (0, Policy_1.setWorkspacePayer)(policy?.id, authorizedPayerEmail);
        Navigation_1.default.goBack();
    };
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, react_1.useMemo)(() => ((0, EmptyObject_1.isEmptyObject)(policy) && !isLoadingReportData) || (0, PolicyUtils_1.isPendingDeletePolicy)(policy) || policy?.reimbursementChoice !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES, [policy, isLoadingReportData]);
    const totalNumberOfEmployeesEitherOwnerOrAdmin = (0, react_1.useMemo)(() => {
        return Object.entries(policy?.employeeList ?? {}).filter(([email, policyEmployee]) => {
            const isOwner = policy?.owner === email;
            const isAdmin = policyEmployee.role === CONST_1.default.POLICY.ROLE.ADMIN;
            return !isDeletedPolicyEmployee(policyEmployee) && (isOwner || isAdmin);
        });
    }, [isDeletedPolicyEmployee, policy?.employeeList, policy?.owner]);
    const shouldShowSearchInput = totalNumberOfEmployeesEitherOwnerOrAdmin.length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    const textInputLabel = shouldShowSearchInput ? translate('selectionList.findMember') : undefined;
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={route.params.policyID}>
            <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundPage} subtitleKey={(0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized'} onBackButtonPress={PolicyUtils_1.goBackFromInvalidPolicy} onLinkPress={PolicyUtils_1.goBackFromInvalidPolicy}>
                <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceWorkflowsPayerPage.displayName}>
                    <HeaderWithBackButton_1.default title={translate('workflowsPayerPage.title')} subtitle={policyName} onBackButtonPress={Navigation_1.default.goBack}/>
                    <SelectionList_1.default sections={sections} textInputLabel={textInputLabel} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={headerMessage} ListItem={UserListItem_1.default} onSelectRow={setPolicyAuthorizedPayer} shouldSingleExecuteRowSelect showScrollIndicator addBottomSafeAreaPadding/>
                </ScreenWrapper_1.default>
            </FullPageNotFoundView_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceWorkflowsPayerPage.displayName = 'WorkspaceWorkflowsPayerPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceWorkflowsPayerPage);
