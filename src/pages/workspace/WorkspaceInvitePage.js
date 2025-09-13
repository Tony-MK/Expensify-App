"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const withNavigationTransitionEnd_1 = require("@components/withNavigationTransitionEnd");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Member_1 = require("@libs/actions/Policy/Member");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Report_1 = require("@libs/actions/Report");
const types_1 = require("@libs/API/types");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const HttpUtils_1 = require("@libs/HttpUtils");
const LoginUtils_1 = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AccessOrNotFoundWrapper_1 = require("./AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("./withPolicyAndFullscreenLoading");
function WorkspaceInvitePage({ route, policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)([]);
    const [personalDetails, setPersonalDetails] = (0, react_1.useState)([]);
    const [usersToInvite, setUsersToInvite] = (0, react_1.useState)([]);
    const [didScreenTransitionEnd, setDidScreenTransitionEnd] = (0, react_1.useState)(false);
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const firstRenderRef = (0, react_1.useRef)(true);
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: false });
    const [invitedEmailsToAccountIDsDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_MEMBERS_DRAFT}${route.params.policyID.toString()}`, { canBeMissing: true });
    const openWorkspaceInvitePage = () => {
        const policyMemberEmailsToAccountIDs = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList);
        (0, Policy_1.openWorkspaceInvitePage)(route.params.policyID, Object.keys(policyMemberEmailsToAccountIDs));
    };
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    (0, react_1.useEffect)(() => {
        (0, Policy_1.clearErrors)(route.params.policyID);
        openWorkspaceInvitePage();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- policyID changes remount the component
    }, []);
    (0, useNetwork_1.default)({ onReconnect: openWorkspaceInvitePage });
    const excludedUsers = (0, react_1.useMemo)(() => {
        const ineligibleInvites = (0, PolicyUtils_1.getIneligibleInvitees)(policy?.employeeList);
        return ineligibleInvites.reduce((acc, login) => {
            acc[login] = true;
            return acc;
        }, {});
    }, [policy?.employeeList]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return { recentReports: [], personalDetails: [], userToInvite: null, currentUserOption: null };
        }
        const inviteOptions = (0, OptionsListUtils_1.getMemberInviteOptions)(options.personalDetails, betas ?? [], excludedUsers, true);
        return { ...inviteOptions, recentReports: [], currentUserOption: null };
    }, [areOptionsInitialized, betas, excludedUsers, options.personalDetails]);
    const inviteOptions = (0, react_1.useMemo)(() => (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchTerm, countryCode, { excludeLogins: excludedUsers }), [debouncedSearchTerm, defaultOptions, excludedUsers, countryCode]);
    (0, react_1.useEffect)(() => {
        if (!areOptionsInitialized) {
            return;
        }
        const newUsersToInviteDict = {};
        const newPersonalDetailsDict = {};
        const newSelectedOptionsDict = {};
        // Update selectedOptions with the latest personalDetails and policyEmployeeList information
        const detailsMap = {};
        inviteOptions.personalDetails.forEach((detail) => {
            if (!detail.login) {
                return;
            }
            detailsMap[detail.login] = (0, OptionsListUtils_1.formatMemberForList)(detail);
        });
        const newSelectedOptions = [];
        if (firstRenderRef.current) {
            // We only want to add the saved selected user on first render
            firstRenderRef.current = false;
            Object.keys(invitedEmailsToAccountIDsDraft ?? {}).forEach((login) => {
                if (!(login in detailsMap)) {
                    return;
                }
                newSelectedOptions.push({ ...detailsMap[login], isSelected: true });
            });
        }
        selectedOptions.forEach((option) => {
            newSelectedOptions.push(option.login && option.login in detailsMap ? { ...detailsMap[option.login], isSelected: true } : option);
        });
        const userToInvite = inviteOptions.userToInvite;
        // Only add the user to the invites list if it is valid
        if (typeof userToInvite?.accountID === 'number') {
            newUsersToInviteDict[userToInvite.accountID] = userToInvite;
        }
        // Add all personal details to the new dict
        inviteOptions.personalDetails.forEach((details) => {
            if (typeof details.accountID !== 'number') {
                return;
            }
            newPersonalDetailsDict[details.accountID] = details;
        });
        // Add all selected options to the new dict
        newSelectedOptions.forEach((option) => {
            if (typeof option.accountID !== 'number') {
                return;
            }
            newSelectedOptionsDict[option.accountID] = option;
        });
        // Strip out dictionary keys and update arrays
        setUsersToInvite(Object.values(newUsersToInviteDict));
        setPersonalDetails(Object.values(newPersonalDetailsDict));
        setSelectedOptions(Object.values(newSelectedOptionsDict));
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want to recalculate when selectedOptions change
    }, [options.personalDetails, policy?.employeeList, betas, debouncedSearchTerm, excludedUsers, areOptionsInitialized, inviteOptions.personalDetails, inviteOptions.userToInvite]);
    const sections = (0, react_1.useMemo)(() => {
        const sectionsArr = [];
        if (!areOptionsInitialized) {
            return [];
        }
        // Filter all options that is a part of the search term or in the personal details
        let filterSelectedOptions = selectedOptions;
        if (debouncedSearchTerm !== '') {
            filterSelectedOptions = selectedOptions.filter((option) => {
                const accountID = option.accountID;
                const isOptionInPersonalDetails = Object.values(personalDetails).some((personalDetail) => personalDetail.accountID === accountID);
                const searchValue = (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode);
                const isPartOfSearchTerm = !!option.text?.toLowerCase().includes(searchValue) || !!option.login?.toLowerCase().includes(searchValue);
                return isPartOfSearchTerm || isOptionInPersonalDetails;
            });
        }
        sectionsArr.push({
            title: undefined,
            data: filterSelectedOptions,
            shouldShow: true,
        });
        // Filtering out selected users from the search results
        const selectedLogins = selectedOptions.map(({ login }) => login);
        const personalDetailsWithoutSelected = Object.values(personalDetails).filter(({ login }) => !selectedLogins.some((selectedLogin) => selectedLogin === login));
        const personalDetailsFormatted = personalDetailsWithoutSelected.map((item) => (0, OptionsListUtils_1.formatMemberForList)(item));
        sectionsArr.push({
            title: translate('common.contacts'),
            data: personalDetailsFormatted,
            shouldShow: !(0, EmptyObject_1.isEmptyObject)(personalDetailsFormatted),
        });
        Object.values(usersToInvite).forEach((userToInvite) => {
            const hasUnselectedUserToInvite = !selectedLogins.some((selectedLogin) => selectedLogin === userToInvite.login);
            if (hasUnselectedUserToInvite) {
                sectionsArr.push({
                    title: undefined,
                    data: [(0, OptionsListUtils_1.formatMemberForList)(userToInvite)],
                    shouldShow: true,
                });
            }
        });
        return sectionsArr;
    }, [areOptionsInitialized, selectedOptions, debouncedSearchTerm, personalDetails, translate, usersToInvite, countryCode]);
    const toggleOption = (option) => {
        (0, Policy_1.clearErrors)(route.params.policyID);
        const isOptionInList = selectedOptions.some((selectedOption) => selectedOption.login === option.login);
        let newSelectedOptions;
        if (isOptionInList) {
            newSelectedOptions = selectedOptions.filter((selectedOption) => selectedOption.login !== option.login);
        }
        else {
            newSelectedOptions = [...selectedOptions, { ...option, isSelected: true }];
        }
        setSelectedOptions(newSelectedOptions);
    };
    const inviteUser = (0, react_1.useCallback)(() => {
        const errors = {};
        if (selectedOptions.length <= 0) {
            errors.noUserSelected = 'true';
        }
        (0, Policy_1.setWorkspaceErrors)(route.params.policyID, errors);
        const isValid = (0, EmptyObject_1.isEmptyObject)(errors);
        if (!isValid) {
            return;
        }
        HttpUtils_1.default.cancelPendingRequests(types_1.READ_COMMANDS.SEARCH_FOR_REPORTS);
        const invitedEmailsToAccountIDs = {};
        selectedOptions.forEach((option) => {
            const login = option.login ?? '';
            const accountID = option.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
            if (!login.toLowerCase().trim() || !accountID) {
                return;
            }
            invitedEmailsToAccountIDs[login] = Number(accountID);
        });
        (0, Member_1.setWorkspaceInviteMembersDraft)(route.params.policyID, invitedEmailsToAccountIDs);
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INVITE_MESSAGE.getRoute(route.params.policyID, Navigation_1.default.getActiveRoute()));
    }, [route.params.policyID, selectedOptions]);
    const [policyName, shouldShowAlertPrompt] = (0, react_1.useMemo)(() => [policy?.name ?? '', !(0, EmptyObject_1.isEmptyObject)(policy?.errors) || !!policy?.alertMessage], [policy]);
    const headerMessage = (0, react_1.useMemo)(() => {
        const searchValue = debouncedSearchTerm.trim().toLowerCase();
        if (usersToInvite.length === 0 && CONST_1.default.EXPENSIFY_EMAILS_OBJECT[searchValue]) {
            return translate('messages.errorMessageInvalidEmail');
        }
        if (usersToInvite.length === 0 &&
            excludedUsers[(0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCode)(searchValue)).possible ? (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)((0, LoginUtils_1.appendCountryCode)(searchValue)) : searchValue]) {
            return translate('messages.userIsAlreadyMember', { login: searchValue, name: policyName });
        }
        return (0, OptionsListUtils_1.getHeaderMessage)(personalDetails.length !== 0, usersToInvite.length > 0, searchValue);
    }, [excludedUsers, translate, debouncedSearchTerm, policyName, usersToInvite, personalDetails.length]);
    const footerContent = (0, react_1.useMemo)(() => (<FormAlertWithSubmitButton_1.default isDisabled={!selectedOptions.length} isAlertVisible={shouldShowAlertPrompt} buttonText={translate('common.next')} onSubmit={inviteUser} message={policy?.alertMessage ?? ''} containerStyles={[styles.flexReset, styles.flexGrow0, styles.flexShrink0, styles.flexBasisAuto]} enabledWhenOffline/>), [inviteUser, policy?.alertMessage, selectedOptions.length, shouldShowAlertPrompt, styles.flexBasisAuto, styles.flexGrow0, styles.flexReset, styles.flexShrink0, translate]);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchTerm);
    }, [debouncedSearchTerm]);
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} fullPageNotFoundViewProps={{ subtitleKey: (0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized', onLinkPress: PolicyUtils_1.goBackFromInvalidPolicy }}>
            <ScreenWrapper_1.default shouldEnableMaxHeight shouldUseCachedViewportHeight testID={WorkspaceInvitePage.displayName} enableEdgeToEdgeBottomSafeAreaPadding onEntryTransitionEnd={() => setDidScreenTransitionEnd(true)}>
                <HeaderWithBackButton_1.default title={translate('workspace.invite.invitePeople')} subtitle={policyName} onBackButtonPress={() => {
            (0, Policy_1.clearErrors)(route.params.policyID);
            Navigation_1.default.goBack();
        }}/>
                <SelectionList_1.default canSelectMultiple sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputValue={searchTerm} onChangeText={(value) => {
            setSearchTerm(value);
        }} headerMessage={headerMessage} onSelectRow={toggleOption} onConfirm={inviteUser} showScrollIndicator showLoadingPlaceholder={!areOptionsInitialized || !didScreenTransitionEnd} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} footerContent={footerContent} isLoadingNewOptions={!!isSearchingForReports} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceInvitePage.displayName = 'WorkspaceInvitePage';
exports.default = (0, withNavigationTransitionEnd_1.default)((0, withPolicyAndFullscreenLoading_1.default)(WorkspaceInvitePage));
