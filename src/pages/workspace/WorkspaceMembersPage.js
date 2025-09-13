"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DecisionModal_1 = require("@components/DecisionModal");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations_1 = require("@components/Icon/Illustrations");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const MessagesRow_1 = require("@components/MessagesRow");
const SearchBar_1 = require("@components/SearchBar");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const CustomListHeader_1 = require("@components/SelectionListWithModal/CustomListHeader");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useFilteredSelection_1 = require("@hooks/useFilteredSelection");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchBackPress_1 = require("@hooks/useSearchBackPress");
const useSearchResults_1 = require("@hooks/useSearchResults");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const Member_1 = require("@libs/actions/Policy/Member");
const Workflow_1 = require("@libs/actions/Workflow");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const StringUtils_1 = require("@libs/StringUtils");
const WorkflowUtils_1 = require("@libs/WorkflowUtils");
const Modal_1 = require("@userActions/Modal");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const MemberRightIcon_1 = require("./MemberRightIcon");
const withPolicyAndFullscreenLoading_1 = require("./withPolicyAndFullscreenLoading");
const WorkspacePageWithSections_1 = require("./WorkspacePageWithSections");
/**
 * Inverts an object, equivalent of _.invert
 */
function invertObject(object) {
    const invertedEntries = Object.entries(object).map(([key, value]) => [value, key]);
    return Object.fromEntries(invertedEntries);
}
function WorkspaceMembersPage({ personalDetails, route, policy }) {
    const { policyMemberEmailsToAccountIDs, employeeListDetails } = (0, react_1.useMemo)(() => {
        const emailsToAccountIDs = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList, true);
        const details = Object.keys(policy?.employeeList ?? {}).reduce((acc, email) => {
            const employee = policy?.employeeList?.[email];
            const accountID = emailsToAccountIDs[email];
            if (!employee) {
                return acc;
            }
            acc[accountID] = employee;
            return acc;
        }, {});
        return { policyMemberEmailsToAccountIDs: emailsToAccountIDs, employeeListDetails: details };
    }, [policy?.employeeList]);
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [removeMembersConfirmModalVisible, setRemoveMembersConfirmModalVisible] = (0, react_1.useState)(false);
    const [errors, setErrors] = (0, react_1.useState)({});
    const { isOffline } = (0, useNetwork_1.default)();
    const prevIsOffline = (0, usePrevious_1.default)(isOffline);
    const accountIDs = (0, react_1.useMemo)(() => Object.values(policyMemberEmailsToAccountIDs ?? {}).map((accountID) => Number(accountID)), [policyMemberEmailsToAccountIDs]);
    const prevAccountIDs = (0, usePrevious_1.default)(accountIDs);
    const textInputRef = (0, react_1.useRef)(null);
    const [isOfflineModalVisible, setIsOfflineModalVisible] = (0, react_1.useState)(false);
    const [isDownloadFailureModalVisible, setIsDownloadFailureModalVisible] = (0, react_1.useState)(false);
    const isOfflineAndNoMemberDataAvailable = (0, EmptyObject_1.isEmptyObject)(policy?.employeeList) && isOffline;
    const prevPersonalDetails = (0, usePrevious_1.default)(personalDetails);
    const { translate, formatPhoneNumber, localeCompare } = (0, useLocalize_1.default)();
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const filterEmployees = (0, react_1.useCallback)((employee) => {
        if (!employee?.email) {
            return false;
        }
        const employeeAccountID = (0, PersonalDetailsUtils_1.getAccountIDsByLogins)([employee.email]).at(0);
        if (!employeeAccountID) {
            return false;
        }
        const isPendingDelete = employeeListDetails?.[employeeAccountID]?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
        return accountIDs.includes(employeeAccountID) && !isPendingDelete;
    }, [accountIDs, employeeListDetails]);
    const [selectedEmployees, setSelectedEmployees] = (0, useFilteredSelection_1.default)(employeeListDetails, filterEmployees);
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply the correct modal type for the decision modal
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const isPolicyAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy);
    const isLoading = (0, react_1.useMemo)(() => !isOfflineAndNoMemberDataAvailable && (!(0, OptionsListUtils_1.isPersonalDetailsReady)(personalDetails) || (0, EmptyObject_1.isEmptyObject)(policy?.employeeList)), [isOfflineAndNoMemberDataAvailable, personalDetails, policy?.employeeList]);
    const [invitedEmailsToAccountIDsDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_MEMBERS_DRAFT}${route.params.policyID.toString()}`, { canBeMissing: true });
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const currentUserAccountID = Number(session?.accountID);
    const selectionListRef = (0, react_1.useRef)(null);
    const isFocused = (0, native_1.useIsFocused)();
    const policyID = route.params.policyID;
    const ownerDetails = personalDetails?.[policy?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID] ?? {};
    const { approvalWorkflows } = (0, react_1.useMemo)(() => (0, WorkflowUtils_1.convertPolicyEmployeesToApprovalWorkflows)({
        policy,
        personalDetails: personalDetails ?? {},
        localeCompare,
    }), [personalDetails, policy, localeCompare]);
    const canSelectMultiple = isPolicyAdmin && (shouldUseNarrowLayout ? isMobileSelectionModeEnabled : true);
    const confirmModalPrompt = (0, react_1.useMemo)(() => {
        const approverAccountID = selectedEmployees.find((selectedEmployee) => (0, Member_1.isApprover)(policy, selectedEmployee));
        if (!approverAccountID) {
            return translate('workspace.people.removeMembersPrompt', {
                count: selectedEmployees.length,
                memberName: formatPhoneNumber((0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({ accountIDs: selectedEmployees, currentUserAccountID }).at(0)?.displayName ?? ''),
            });
        }
        return translate('workspace.people.removeMembersWarningPrompt', {
            memberName: (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: approverAccountID }),
            ownerName: (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: policy?.ownerAccountID }),
        });
    }, [selectedEmployees, translate, policy, currentUserAccountID, formatPhoneNumber]);
    /**
     * Get filtered personalDetails list with current employeeList
     */
    const filterPersonalDetails = (members, details) => Object.keys(members ?? {}).reduce((acc, key) => {
        const memberAccountIdKey = policyMemberEmailsToAccountIDs[key] ?? '';
        if (details?.[memberAccountIdKey]) {
            acc[memberAccountIdKey] = details[memberAccountIdKey];
        }
        return acc;
    }, {});
    /**
     * Get members for the current workspace
     */
    const getWorkspaceMembers = (0, react_1.useCallback)(() => {
        (0, Member_1.openWorkspaceMembersPage)(route.params.policyID, Object.keys((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList)));
    }, [route.params.policyID, policy?.employeeList]);
    /**
     * Check if the current selection includes members that cannot be removed
     */
    const validateSelection = (0, react_1.useCallback)(() => {
        const newErrors = {};
        selectedEmployees.forEach((member) => {
            if (member !== policy?.ownerAccountID && member !== session?.accountID) {
                return;
            }
            newErrors[member] = translate('workspace.people.error.cannotRemove');
        });
        setErrors(newErrors);
    }, [selectedEmployees, policy?.ownerAccountID, session?.accountID, translate]);
    (0, react_1.useEffect)(() => {
        getWorkspaceMembers();
    }, [getWorkspaceMembers]);
    (0, react_1.useEffect)(() => {
        validateSelection();
    }, [validateSelection]);
    (0, react_1.useEffect)(() => {
        if (removeMembersConfirmModalVisible && !(0, fast_equals_1.deepEqual)(accountIDs, prevAccountIDs)) {
            setRemoveMembersConfirmModalVisible(false);
        }
        setSelectedEmployees((prevSelectedEmployees) => {
            // Filter all personal details in order to use the elements needed for the current workspace
            const currentPersonalDetails = filterPersonalDetails(policy?.employeeList ?? {}, personalDetails);
            // We need to filter the previous selected employees by the new personal details, since unknown/new user id's change when transitioning from offline to online
            const prevSelectedElements = prevSelectedEmployees.map((id) => {
                const prevItem = prevPersonalDetails?.[id];
                const res = Object.values(currentPersonalDetails).find((item) => prevItem?.login === item?.login);
                return res?.accountID ?? id;
            });
            const currentSelectedElements = Object.entries((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList))
                .filter((employee) => policy?.employeeList?.[employee[0]]?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)
                .map((employee) => employee[1]);
            // This is an equivalent of the lodash intersection function. The reduce method below is used to filter the items that exist in both arrays.
            return [prevSelectedElements, currentSelectedElements].reduce((prev, members) => prev.filter((item) => members.includes(item)));
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [policy?.employeeList, policyMemberEmailsToAccountIDs]);
    (0, react_1.useEffect)(() => {
        const isReconnecting = prevIsOffline && !isOffline;
        if (!isReconnecting) {
            return;
        }
        getWorkspaceMembers();
    }, [isOffline, prevIsOffline, getWorkspaceMembers]);
    /**
     * Open the modal to invite a user
     */
    const inviteUser = (0, react_1.useCallback)(() => {
        if (isAccountLocked) {
            showLockedAccountModal();
            return;
        }
        (0, Member_1.clearInviteDraft)(route.params.policyID);
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INVITE.getRoute(route.params.policyID, Navigation_1.default.getActiveRouteWithoutParams()));
    }, [route.params.policyID, isAccountLocked, showLockedAccountModal]);
    /**
     * Remove selected users from the workspace
     * Please see https://github.com/Expensify/App/blob/main/README.md#Security for more details
     */
    const removeUsers = () => {
        if (!(0, EmptyObject_1.isEmptyObject)(errors)) {
            return;
        }
        // Remove the admin from the list
        const accountIDsToRemove = session?.accountID ? selectedEmployees.filter((id) => id !== session.accountID) : selectedEmployees;
        // Check if any of the account IDs are approvers
        const hasApprovers = accountIDsToRemove.some((accountID) => (0, Member_1.isApprover)(policy, accountID));
        if (hasApprovers) {
            const ownerEmail = ownerDetails.login;
            accountIDsToRemove.forEach((accountID) => {
                const removedApprover = personalDetails?.[accountID];
                if (!removedApprover?.login || !ownerEmail) {
                    return;
                }
                const updatedWorkflows = (0, WorkflowUtils_1.updateWorkflowDataOnApproverRemoval)({
                    approvalWorkflows,
                    removedApprover,
                    ownerDetails,
                });
                updatedWorkflows.forEach((workflow) => {
                    if (workflow?.removeApprovalWorkflow) {
                        const { removeApprovalWorkflow, ...updatedWorkflow } = workflow;
                        (0, Workflow_1.removeApprovalWorkflow)(policyID, updatedWorkflow);
                    }
                    else {
                        (0, Workflow_1.updateApprovalWorkflow)(policyID, workflow, [], []);
                    }
                });
            });
        }
        setRemoveMembersConfirmModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedEmployees([]);
            (0, Member_1.removeMembers)(accountIDsToRemove, route.params.policyID);
        });
    };
    /**
     * Show the modal to confirm removal of the selected members
     */
    const askForConfirmationToRemove = () => {
        if (!(0, EmptyObject_1.isEmptyObject)(errors)) {
            return;
        }
        setRemoveMembersConfirmModalVisible(true);
    };
    /**
     * Add or remove all users passed from the selectedEmployees list
     */
    const toggleAllUsers = (memberList) => {
        const enabledAccounts = memberList.filter((member) => !member.isDisabled && !member.isDisabledCheckbox);
        const someSelected = enabledAccounts.some((member) => selectedEmployees.includes(member.accountID));
        if (someSelected) {
            setSelectedEmployees([]);
        }
        else {
            const everyAccountId = enabledAccounts.map((member) => member.accountID);
            setSelectedEmployees(everyAccountId);
        }
        validateSelection();
    };
    /**
     * Add user from the selectedEmployees list
     */
    const addUser = (0, react_1.useCallback)((accountID) => {
        setSelectedEmployees((prevSelected) => [...prevSelected, accountID]);
        validateSelection();
    }, [validateSelection, setSelectedEmployees]);
    /**
     * Remove user from the selectedEmployees list
     */
    const removeUser = (0, react_1.useCallback)((accountID) => {
        setSelectedEmployees((prevSelected) => prevSelected.filter((id) => id !== accountID));
        validateSelection();
    }, [validateSelection, setSelectedEmployees]);
    /**
     * Toggle user from the selectedEmployees list
     */
    const toggleUser = (0, react_1.useCallback)((accountID, pendingAction) => {
        if (accountID === policy?.ownerAccountID && accountID !== session?.accountID) {
            return;
        }
        if (pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
            return;
        }
        // Add or remove the user if the checkbox is enabled
        if (selectedEmployees.includes(accountID)) {
            removeUser(accountID);
        }
        else {
            addUser(accountID);
        }
    }, [selectedEmployees, addUser, removeUser, policy?.ownerAccountID, session?.accountID]);
    /** Opens the member details page */
    const openMemberDetails = (0, react_1.useCallback)((item) => {
        if (!isPolicyAdmin || !(0, PolicyUtils_1.isPaidGroupPolicy)(policy)) {
            Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(item.accountID, Navigation_1.default.getActiveRoute()));
            return;
        }
        (0, Member_1.clearWorkspaceOwnerChangeFlow)(policyID);
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(route.params.policyID, item.accountID));
    }, [isPolicyAdmin, policy, policyID, route.params.policyID]);
    /**
     * Dismisses the errors on one item
     */
    const dismissError = (0, react_1.useCallback)((item) => {
        if (item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
            (0, Member_1.clearDeleteMemberError)(route.params.policyID, item.accountID);
        }
        else {
            (0, Member_1.clearAddMemberError)(route.params.policyID, item.accountID);
        }
    }, [route.params.policyID]);
    const policyOwner = policy?.owner;
    const currentUserLogin = currentUserPersonalDetails.login;
    const invitedPrimaryToSecondaryLogins = (0, react_1.useMemo)(() => invertObject(policy?.primaryLoginsInvited ?? {}), [policy?.primaryLoginsInvited]);
    const data = (0, react_1.useMemo)(() => {
        const result = [];
        Object.entries(policy?.employeeList ?? {}).forEach(([email, policyEmployee]) => {
            const accountID = Number(policyMemberEmailsToAccountIDs[email] ?? '');
            if ((0, PolicyUtils_1.isDeletedPolicyEmployee)(policyEmployee, isOffline)) {
                return;
            }
            const details = personalDetails?.[accountID];
            if (!details) {
                Log_1.default.hmmm(`[WorkspaceMembersPage] no personal details found for policy member with accountID: ${accountID}`);
                return;
            }
            // If this policy is owned by Expensify then show all support (expensify.com or team.expensify.com) emails
            // We don't want to show guides as policy members unless the user is a guide. Some customers get confused when they
            // see random people added to their policy, but guides having access to the policies help set them up.
            if ((0, PolicyUtils_1.isExpensifyTeam)(details?.login ?? details?.displayName)) {
                if (policyOwner && currentUserLogin && !(0, PolicyUtils_1.isExpensifyTeam)(policyOwner) && !(0, PolicyUtils_1.isExpensifyTeam)(currentUserLogin)) {
                    return;
                }
            }
            const isPendingDeleteOrError = isPolicyAdmin && (policyEmployee.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || !(0, EmptyObject_1.isEmptyObject)(policyEmployee.errors));
            result.push({
                keyForList: String(accountID),
                accountID,
                isDisabledCheckbox: !(isPolicyAdmin && accountID !== policy?.ownerAccountID && accountID !== session?.accountID),
                isDisabled: isPendingDeleteOrError,
                isInteractive: !details.isOptimisticPersonalDetail,
                cursorStyle: details.isOptimisticPersonalDetail ? styles.cursorDefault : {},
                text: formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(details)),
                alternateText: formatPhoneNumber(details?.login ?? ''),
                rightElement: (<MemberRightIcon_1.default role={policyEmployee.role} owner={policy?.owner} login={details.login}/>),
                icons: [
                    {
                        source: details.avatar ?? Expensicons_1.FallbackAvatar,
                        name: formatPhoneNumber(details?.login ?? ''),
                        type: CONST_1.default.ICON_TYPE_AVATAR,
                        id: accountID,
                    },
                ],
                errors: policyEmployee.errors,
                pendingAction: policyEmployee.pendingAction,
                // Note which secondary login was used to invite this primary login
                invitedSecondaryLogin: details?.login ? (invitedPrimaryToSecondaryLogins[details.login] ?? '') : '',
            });
        });
        return result;
    }, [
        isOffline,
        currentUserLogin,
        formatPhoneNumber,
        invitedPrimaryToSecondaryLogins,
        personalDetails,
        policy?.owner,
        policy?.ownerAccountID,
        policy?.employeeList,
        policyMemberEmailsToAccountIDs,
        policyOwner,
        session?.accountID,
        styles.cursorDefault,
        isPolicyAdmin,
    ]);
    const filterMember = (0, react_1.useCallback)((memberOption, searchQuery) => {
        const memberText = StringUtils_1.default.normalize(memberOption.text?.toLowerCase() ?? '');
        const alternateText = StringUtils_1.default.normalize(memberOption.alternateText?.toLowerCase() ?? '');
        const normalizedSearchQuery = StringUtils_1.default.normalize(searchQuery);
        return memberText.includes(normalizedSearchQuery) || alternateText.includes(normalizedSearchQuery);
    }, []);
    const sortMembers = (0, react_1.useCallback)((memberOptions) => (0, OptionsListUtils_1.sortAlphabetically)(memberOptions, 'text', localeCompare), [localeCompare]);
    const [inputValue, setInputValue, filteredData] = (0, useSearchResults_1.default)(data, filterMember, sortMembers);
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        if ((0, EmptyObject_1.isEmptyObject)(invitedEmailsToAccountIDsDraft) || accountIDs === prevAccountIDs) {
            return;
        }
        const invitedEmails = Object.values(invitedEmailsToAccountIDsDraft).map(String);
        selectionListRef.current?.scrollAndHighlightItem?.(invitedEmails);
        (0, Member_1.clearInviteDraft)(route.params.policyID);
    }, [invitedEmailsToAccountIDsDraft, isFocused, accountIDs, prevAccountIDs, route.params.policyID]);
    const headerMessage = (0, react_1.useMemo)(() => {
        if (isOfflineAndNoMemberDataAvailable) {
            return translate('workspace.common.mustBeOnlineToViewMembers');
        }
        return !isLoading && (0, EmptyObject_1.isEmptyObject)(policy?.employeeList) ? translate('workspace.common.memberNotFound') : '';
    }, [isLoading, policy?.employeeList, translate, isOfflineAndNoMemberDataAvailable]);
    const memberCount = data.filter((member) => member.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE).length;
    const isPendingAddOrDelete = isOffline && data?.some((member) => member.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || member.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
    const getHeaderContent = () => (<react_native_1.View style={shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection}>
            <Text_1.default style={[styles.pl5, styles.mb5, styles.mt3, styles.textSupporting, isPendingAddOrDelete && styles.offlineFeedback.pending]}>
                {translate('workspace.people.workspaceMembersCount', { count: memberCount })}
            </Text_1.default>
            {!(0, EmptyObject_1.isEmptyObject)(invitedPrimaryToSecondaryLogins) && (<MessagesRow_1.default type="success" 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        messages={{ 0: translate('workspace.people.addedWithPrimary') }} containerStyles={[styles.pb5, styles.ph5]} onClose={() => (0, Policy_1.dismissAddedWithPrimaryLoginMessages)(policyID)}/>)}
        </react_native_1.View>);
    (0, react_1.useEffect)(() => {
        if (isMobileSelectionModeEnabled) {
            return;
        }
        setSelectedEmployees([]);
    }, [setSelectedEmployees, isMobileSelectionModeEnabled]);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => setSelectedEmployees([]),
        onNavigationCallBack: () => Navigation_1.default.goBack(),
    });
    const getCustomListHeader = () => {
        if (filteredData.length === 0) {
            return null;
        }
        return (<CustomListHeader_1.default canSelectMultiple={canSelectMultiple} leftHeaderText={translate('common.member')} rightHeaderText={translate('common.role')}/>);
    };
    const changeUserRole = (role) => {
        if (!(0, EmptyObject_1.isEmptyObject)(errors)) {
            return;
        }
        const accountIDsToUpdate = selectedEmployees.filter((accountID) => {
            const email = personalDetails?.[accountID]?.login ?? '';
            return policy?.employeeList?.[email]?.role !== role;
        });
        setSelectedEmployees([]);
        (0, Member_1.updateWorkspaceMembersRole)(route.params.policyID, accountIDsToUpdate, role);
    };
    const getBulkActionsButtonOptions = () => {
        const options = [
            {
                text: translate('workspace.people.removeMembersTitle', { count: selectedEmployees.length }),
                value: CONST_1.default.POLICY.MEMBERS_BULK_ACTION_TYPES.REMOVE,
                icon: Expensicons_1.RemoveMembers,
                onSelected: askForConfirmationToRemove,
            },
        ];
        if (!(0, PolicyUtils_1.isPaidGroupPolicy)(policy)) {
            return options;
        }
        const selectedEmployeesRoles = selectedEmployees.map((accountID) => {
            const email = personalDetails?.[accountID]?.login ?? '';
            return policy?.employeeList?.[email]?.role;
        });
        const memberOption = {
            text: translate('workspace.people.makeMember'),
            value: CONST_1.default.POLICY.MEMBERS_BULK_ACTION_TYPES.MAKE_MEMBER,
            icon: Expensicons_1.User,
            onSelected: () => changeUserRole(CONST_1.default.POLICY.ROLE.USER),
        };
        const adminOption = {
            text: translate('workspace.people.makeAdmin'),
            value: CONST_1.default.POLICY.MEMBERS_BULK_ACTION_TYPES.MAKE_ADMIN,
            icon: Expensicons_1.MakeAdmin,
            onSelected: () => changeUserRole(CONST_1.default.POLICY.ROLE.ADMIN),
        };
        const auditorOption = {
            text: translate('workspace.people.makeAuditor'),
            value: CONST_1.default.POLICY.MEMBERS_BULK_ACTION_TYPES.MAKE_AUDITOR,
            icon: Expensicons_1.UserEye,
            onSelected: () => changeUserRole(CONST_1.default.POLICY.ROLE.AUDITOR),
        };
        const hasAtLeastOneNonAuditorRole = selectedEmployeesRoles.some((role) => role !== CONST_1.default.POLICY.ROLE.AUDITOR);
        const hasAtLeastOneNonMemberRole = selectedEmployeesRoles.some((role) => role !== CONST_1.default.POLICY.ROLE.USER);
        const hasAtLeastOneNonAdminRole = selectedEmployeesRoles.some((role) => role !== CONST_1.default.POLICY.ROLE.ADMIN);
        if (hasAtLeastOneNonMemberRole) {
            options.push(memberOption);
        }
        if (hasAtLeastOneNonAdminRole) {
            options.push(adminOption);
        }
        if (hasAtLeastOneNonAuditorRole) {
            options.push(auditorOption);
        }
        return options;
    };
    const secondaryActions = (0, react_1.useMemo)(() => {
        if (!isPolicyAdmin) {
            return [];
        }
        const menuItems = [
            {
                icon: Expensicons_1.Table,
                text: translate('spreadsheet.importSpreadsheet'),
                onSelected: () => {
                    if (isAccountLocked) {
                        showLockedAccountModal();
                        return;
                    }
                    if (isOffline) {
                        (0, Modal_1.close)(() => setIsOfflineModalVisible(true));
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBERS_IMPORT.getRoute(policyID));
                },
                value: CONST_1.default.POLICY.SECONDARY_ACTIONS.IMPORT_SPREADSHEET,
            },
            {
                icon: Expensicons_1.Download,
                text: translate('spreadsheet.downloadCSV'),
                onSelected: () => {
                    if (isOffline) {
                        (0, Modal_1.close)(() => setIsOfflineModalVisible(true));
                        return;
                    }
                    (0, Modal_1.close)(() => {
                        (0, Member_1.downloadMembersCSV)(policyID, () => {
                            setIsDownloadFailureModalVisible(true);
                        });
                    });
                },
                value: CONST_1.default.POLICY.SECONDARY_ACTIONS.DOWNLOAD_CSV,
            },
        ];
        return menuItems;
    }, [policyID, translate, isOffline, isPolicyAdmin, isAccountLocked, showLockedAccountModal]);
    const getHeaderButtons = () => {
        if (!isPolicyAdmin) {
            return null;
        }
        return (shouldUseNarrowLayout ? canSelectMultiple : selectedEmployees.length > 0) ? (<ButtonWithDropdownMenu_1.default shouldAlwaysShowDropdownMenu customText={translate('workspace.common.selected', { count: selectedEmployees.length })} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} onPress={() => null} options={getBulkActionsButtonOptions()} isSplitButton={false} style={[shouldUseNarrowLayout && styles.flexGrow1, shouldUseNarrowLayout && styles.mb3]} isDisabled={!selectedEmployees.length}/>) : (<react_native_1.View style={[styles.flexRow, styles.gap2]}>
                <Button_1.default success onPress={inviteUser} text={translate('workspace.invite.member')} icon={Expensicons_1.Plus} innerStyles={[shouldUseNarrowLayout && styles.alignItemsCenter]} style={[shouldUseNarrowLayout && styles.flexGrow1, shouldUseNarrowLayout && styles.mb3]}/>
                <ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('common.more')} options={secondaryActions} isSplitButton={false} wrapperStyle={styles.flexGrow0}/>
            </react_native_1.View>);
    };
    const selectionModeHeader = isMobileSelectionModeEnabled && shouldUseNarrowLayout;
    const headerContent = (<>
            {shouldUseNarrowLayout && data.length > 0 && <react_native_1.View style={[styles.pr5]}>{getHeaderContent()}</react_native_1.View>}
            {!shouldUseNarrowLayout && (<>
                    {!!headerMessage && (<react_native_1.View style={[styles.ph5, styles.pb5]}>
                            <Text_1.default style={[styles.textLabel, styles.colorMuted, styles.minHeight5]}>{headerMessage}</Text_1.default>
                        </react_native_1.View>)}
                    {getHeaderContent()}
                </>)}
            {data.length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default inputValue={inputValue} onChangeText={setInputValue} label={translate('workspace.people.findMember')} shouldShowEmptyState={!filteredData.length}/>)}
        </>);
    return (<WorkspacePageWithSections_1.default headerText={selectionModeHeader ? translate('common.selectMultiple') : translate('workspace.common.members')} route={route} icon={!selectionModeHeader ? Illustrations_1.ReceiptWrangler : undefined} headerContent={!shouldUseNarrowLayout && getHeaderButtons()} testID={WorkspaceMembersPage.displayName} shouldShowLoading={false} shouldUseHeadlineHeader={!selectionModeHeader} shouldShowOfflineIndicatorInWideScreen shouldShowNonAdmin onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedEmployees([]);
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
                return;
            }
            Navigation_1.default.popToSidebar();
        }}>
            {() => (<>
                    {shouldUseNarrowLayout && <react_native_1.View style={[styles.pl5, styles.pr5]}>{getHeaderButtons()}</react_native_1.View>}
                    <ConfirmModal_1.default isVisible={isOfflineModalVisible} onConfirm={() => setIsOfflineModalVisible(false)} title={translate('common.youAppearToBeOffline')} prompt={translate('common.thisFeatureRequiresInternet')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} onCancel={() => setIsOfflineModalVisible(false)} shouldHandleNavigationBack/>

                    <ConfirmModal_1.default danger title={translate('workspace.people.removeMembersTitle', { count: selectedEmployees.length })} isVisible={removeMembersConfirmModalVisible} onConfirm={removeUsers} onCancel={() => setRemoveMembersConfirmModalVisible(false)} prompt={confirmModalPrompt} confirmText={translate('common.remove')} cancelText={translate('common.cancel')} onModalHide={() => {
                react_native_1.InteractionManager.runAfterInteractions(() => {
                    if (!textInputRef.current) {
                        return;
                    }
                    textInputRef.current.focus();
                });
            }}/>
                    <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsDownloadFailureModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadFailureModalVisible} onClose={() => setIsDownloadFailureModalVisible(false)}/>
                    <SelectionListWithModal_1.default ref={selectionListRef} canSelectMultiple={canSelectMultiple} sections={[{ data: filteredData, isDisabled: false }]} selectedItems={selectedEmployees.map(String)} ListItem={TableListItem_1.default} shouldUseDefaultRightHandSideCheckmark={false} turnOnSelectionModeOnLongPress={isPolicyAdmin} onTurnOnSelectionMode={(item) => item && toggleUser(item?.accountID)} shouldUseUserSkeletonView disableKeyboardShortcuts={removeMembersConfirmModalVisible} headerMessage={shouldUseNarrowLayout ? headerMessage : undefined} onSelectRow={openMemberDetails} shouldSingleExecuteRowSelect={!isPolicyAdmin} onCheckboxPress={(item) => toggleUser(item.accountID)} onSelectAll={filteredData.length > 0 ? () => toggleAllUsers(filteredData) : undefined} onDismissError={dismissError} showLoadingPlaceholder={isLoading} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} textInputRef={textInputRef} listHeaderContent={headerContent} shouldShowListEmptyContent={false} customListHeader={getCustomListHeader()} listHeaderWrapperStyle={[styles.ph9, styles.pv3, styles.pb5]} showScrollIndicator={false} addBottomSafeAreaPadding/>
                </>)}
        </WorkspacePageWithSections_1.default>);
}
WorkspaceMembersPage.displayName = 'WorkspaceMembersPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceMembersPage);
