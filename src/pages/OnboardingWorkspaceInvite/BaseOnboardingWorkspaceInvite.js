"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Member_1 = require("@libs/actions/Policy/Member");
const Report_1 = require("@libs/actions/Report");
const types_1 = require("@libs/API/types");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const HttpUtils_1 = require("@libs/HttpUtils");
const LoginUtils_1 = require("@libs/LoginUtils");
const navigateAfterOnboarding_1 = require("@libs/navigateAfterOnboarding");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Report_2 = require("@userActions/Report");
const Welcome_1 = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function BaseOnboardingWorkspaceInvite({ shouldUseNativeStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const [onboardingPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true });
    const [onboardingAdminsChatReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ADMINS_CHAT_REPORT_ID, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(onboardingPolicyID);
    const { onboardingMessages } = (0, useOnboardingMessages_1.default)();
    // We need to use isSmallScreenWidth, see navigateAfterOnboarding function comment
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { onboardingIsMediumOrLargerScreenWidth, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)([]);
    const [personalDetails, setPersonalDetails] = (0, react_1.useState)([]);
    const [usersToInvite, setUsersToInvite] = (0, react_1.useState)([]);
    const [didScreenTransitionEnd, setDidScreenTransitionEnd] = (0, react_1.useState)(false);
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { canBeMissing: true, initWithStoredValues: false });
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: false });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const session = (0, OnyxListItemProvider_1.useSession)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    const welcomeNoteSubject = (0, react_1.useMemo)(() => `# ${currentUserPersonalDetails?.displayName ?? ''} invited you to ${policy?.name ?? 'a workspace'}`, [policy?.name, currentUserPersonalDetails?.displayName]);
    const welcomeNote = (0, react_1.useMemo)(() => translate('workspace.common.welcomeNote'), [translate]);
    const excludedUsers = (0, react_1.useMemo)(() => {
        const ineligibleInvitees = (0, PolicyUtils_1.getIneligibleInvitees)(policy?.employeeList);
        return ineligibleInvitees.reduce((acc, login) => {
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
        selectedOptions.forEach((option) => {
            newSelectedOptions.push(option.login && option.login in detailsMap ? { ...detailsMap[option.login], isSelected: true } : option);
        });
        const userToInvite = inviteOptions.userToInvite;
        // Only add the user to the invitees list if it is valid
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
        const selectedLoginsSet = new Set(selectedOptions.map(({ login }) => login));
        const personalDetailsFormatted = Object.values(personalDetails)
            .filter(({ login }) => !selectedLoginsSet.has(login ?? ''))
            .map(OptionsListUtils_1.formatMemberForList);
        sectionsArr.push({
            title: translate('common.contacts'),
            data: personalDetailsFormatted,
            shouldShow: !(0, EmptyObject_1.isEmptyObject)(personalDetailsFormatted),
        });
        Object.values(usersToInvite).forEach((userToInvite) => {
            const hasUnselectedUserToInvite = !selectedLoginsSet.has(userToInvite.login ?? '');
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
    const completeOnboarding = (0, react_1.useCallback)(() => {
        (0, Report_2.completeOnboarding)({
            engagementChoice: CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE,
            onboardingMessage: onboardingMessages[CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE],
            firstName: currentUserPersonalDetails.firstName,
            lastName: currentUserPersonalDetails.lastName,
            adminsChatReportID: onboardingAdminsChatReportID,
            onboardingPolicyID,
        });
        (0, Welcome_1.setOnboardingAdminsChatReportID)();
        (0, Welcome_1.setOnboardingPolicyID)();
        (0, navigateAfterOnboarding_1.navigateAfterOnboardingWithMicrotaskQueue)(isSmallScreenWidth, isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS), onboardingPolicyID, onboardingAdminsChatReportID, 
        // Onboarding tasks would show in Concierge instead of admins room for testing accounts, we should open where onboarding tasks are located
        // See https://github.com/Expensify/App/issues/57167 for more details
        (session?.email ?? '').includes('+'));
    }, [
        currentUserPersonalDetails.firstName,
        onboardingMessages,
        currentUserPersonalDetails.lastName,
        onboardingAdminsChatReportID,
        onboardingPolicyID,
        isSmallScreenWidth,
        isBetaEnabled,
        session?.email,
    ]);
    const inviteUser = (0, react_1.useCallback)(() => {
        let isValid = true;
        if (selectedOptions.length <= 0) {
            isValid = false;
        }
        if (!isValid || !onboardingPolicyID) {
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
        const policyMemberAccountIDs = Object.values((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList, false, false));
        (0, Member_1.addMembersToWorkspace)(invitedEmailsToAccountIDs, `${welcomeNoteSubject}\n\n${welcomeNote}`, onboardingPolicyID, policyMemberAccountIDs, CONST_1.default.POLICY.ROLE.USER, formatPhoneNumber);
        completeOnboarding();
    }, [completeOnboarding, onboardingPolicyID, policy?.employeeList, selectedOptions, welcomeNote, welcomeNoteSubject, formatPhoneNumber]);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchTerm);
    }, [debouncedSearchTerm]);
    const headerMessage = (0, react_1.useMemo)(() => {
        const searchValue = debouncedSearchTerm.trim().toLowerCase();
        if (usersToInvite.length === 0 && CONST_1.default.EXPENSIFY_EMAILS_OBJECT[searchValue]) {
            return translate('messages.errorMessageInvalidEmail');
        }
        if (usersToInvite.length === 0 &&
            excludedUsers[(0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCode)(searchValue)).possible ? (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)((0, LoginUtils_1.appendCountryCode)(searchValue)) : searchValue]) {
            return translate('messages.userIsAlreadyMember', { login: searchValue, name: policy?.name ?? '' });
        }
        return (0, OptionsListUtils_1.getHeaderMessage)(personalDetails.length !== 0, usersToInvite.length > 0, searchValue);
    }, [excludedUsers, translate, debouncedSearchTerm, policy?.name, usersToInvite, personalDetails.length]);
    const footerContent = (0, react_1.useMemo)(() => (<react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.mh3 : undefined]}>
                <react_native_1.View style={styles.mb2}>
                    <Button_1.default large text={translate('common.skip')} onPress={() => completeOnboarding()}/>
                </react_native_1.View>
                <react_native_1.View>
                    <Button_1.default success large text={translate('common.continue')} onPress={() => inviteUser()} isDisabled={selectedOptions.length <= 0}/>
                </react_native_1.View>
            </react_native_1.View>), [completeOnboarding, inviteUser, onboardingIsMediumOrLargerScreenWidth, selectedOptions.length, styles.mb2, styles.mh3, translate]);
    return (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={BaseOnboardingWorkspaceInvite.displayName} style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]} shouldShowOfflineIndicator={isSmallScreenWidth} onEntryTransitionEnd={() => setDidScreenTransitionEnd(true)}>
            <HeaderWithBackButton_1.default progressBarPercentage={100} shouldShowBackButton={false}/>
            <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5, onboardingIsMediumOrLargerScreenWidth ? styles.flexRow : styles.flexColumn, styles.mb3]}>
                <Text_1.default style={styles.textHeadlineH1}>{translate('onboarding.inviteMembers.title')}</Text_1.default>
            </react_native_1.View>
            <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5, onboardingIsMediumOrLargerScreenWidth ? styles.flexRow : styles.flexColumn, styles.mb5]}>
                <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('onboarding.inviteMembers.subtitle')}</Text_1.default>
            </react_native_1.View>
            <SelectionList_1.default listItemWrapperStyle={onboardingIsMediumOrLargerScreenWidth ? [styles.pl8, styles.pr8] : []} textInputStyle={onboardingIsMediumOrLargerScreenWidth ? styles.ph8 : styles.ph5} sectionTitleStyles={onboardingIsMediumOrLargerScreenWidth ? styles.ph3 : undefined} headerMessageStyle={[onboardingIsMediumOrLargerScreenWidth ? styles.ph8 : styles.ph5, styles.pb5]} canSelectMultiple sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputValue={searchTerm} onChangeText={(value) => {
            setSearchTerm(value);
        }} headerMessage={headerMessage} onSelectRow={toggleOption} onConfirm={inviteUser} showScrollIndicator showLoadingPlaceholder={!areOptionsInitialized || !didScreenTransitionEnd} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} footerContent={footerContent} isLoadingNewOptions={!!isSearchingForReports} addBottomSafeAreaPadding={isSmallScreenWidth}/>
        </ScreenWrapper_1.default>);
}
BaseOnboardingWorkspaceInvite.displayName = 'BaseOnboardingWorkspaceInvite';
exports.default = BaseOnboardingWorkspaceInvite;
