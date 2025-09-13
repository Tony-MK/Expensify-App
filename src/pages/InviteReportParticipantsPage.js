"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
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
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const RoomMembersUserSearchPhrase_1 = require("@libs/actions/RoomMembersUserSearchPhrase");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const LoginUtils_1 = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const ReportUtils_1 = require("@libs/ReportUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
function InviteReportParticipantsPage({ betas, report, didScreenTransitionEnd }) {
    const route = (0, native_1.useRoute)();
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [userSearchPhrase] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ROOM_MEMBERS_USER_SEARCH_PHRASE, { canBeMissing: true });
    const [searchValue, debouncedSearchTerm, setSearchValue] = (0, useDebouncedState_1.default)(userSearchPhrase ?? '');
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        (0, RoomMembersUserSearchPhrase_1.updateUserSearchPhrase)(debouncedSearchTerm);
        (0, Report_1.searchInServer)(debouncedSearchTerm);
    }, [debouncedSearchTerm]);
    // Any existing participants and Expensify emails should not be eligible for invitation
    const excludedUsers = (0, react_1.useMemo)(() => {
        const res = {
            ...CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
        };
        const participantsAccountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, false, true);
        const loginsByAccountIDs = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantsAccountIDs);
        for (const login of loginsByAccountIDs) {
            res[login] = true;
        }
        return res;
    }, [report]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return (0, OptionsListUtils_1.getEmptyOptions)();
        }
        return (0, OptionsListUtils_1.getMemberInviteOptions)(options.personalDetails, betas ?? [], excludedUsers, false, options.reports, true);
    }, [areOptionsInitialized, betas, excludedUsers, options.personalDetails, options.reports]);
    const inviteOptions = (0, react_1.useMemo)(() => (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchTerm, countryCode, { excludeLogins: excludedUsers }), [debouncedSearchTerm, defaultOptions, excludedUsers, countryCode]);
    (0, react_1.useEffect)(() => {
        // Update selectedOptions with the latest personalDetails information
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
        setSelectedOptions(newSelectedOptions);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want to recalculate when selectedOptions change
    }, [personalDetails, betas, debouncedSearchTerm, excludedUsers, options]);
    const sections = (0, react_1.useMemo)(() => {
        const sectionsArr = [];
        if (!areOptionsInitialized) {
            return [];
        }
        // Filter all options that is a part of the search term or in the personal details
        let filterSelectedOptions = selectedOptions;
        if (debouncedSearchTerm !== '') {
            const processedSearchValue = (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode);
            filterSelectedOptions = (0, tokenizedSearch_1.default)(selectedOptions, processedSearchValue, (option) => [option.text ?? '', option.login ?? '']).filter((option) => {
                const accountID = option?.accountID;
                const isOptionInPersonalDetails = inviteOptions.personalDetails.some((personalDetail) => accountID && personalDetail?.accountID === accountID);
                const isPartOfSearchTerm = !!option.text?.toLowerCase().includes(processedSearchValue) || !!option.login?.toLowerCase().includes(processedSearchValue);
                return isPartOfSearchTerm || isOptionInPersonalDetails;
            });
        }
        const filterSelectedOptionsFormatted = filterSelectedOptions.map((selectedOption) => (0, OptionsListUtils_1.formatMemberForList)(selectedOption));
        sectionsArr.push({
            title: undefined,
            data: filterSelectedOptionsFormatted,
        });
        // Filtering out selected users from the search results
        const selectedLogins = selectedOptions.map(({ login }) => login);
        const recentReportsWithoutSelected = inviteOptions.recentReports.filter(({ login }) => !selectedLogins.includes(login));
        const recentReportsFormatted = recentReportsWithoutSelected.map((reportOption) => (0, OptionsListUtils_1.formatMemberForList)(reportOption));
        const personalDetailsWithoutSelected = inviteOptions.personalDetails.filter(({ login }) => !selectedLogins.includes(login));
        const personalDetailsFormatted = personalDetailsWithoutSelected.map((personalDetail) => (0, OptionsListUtils_1.formatMemberForList)(personalDetail));
        const hasUnselectedUserToInvite = inviteOptions.userToInvite && !selectedLogins.includes(inviteOptions.userToInvite.login);
        sectionsArr.push({
            title: translate('common.recents'),
            data: recentReportsFormatted,
        });
        sectionsArr.push({
            title: translate('common.contacts'),
            data: personalDetailsFormatted,
        });
        if (hasUnselectedUserToInvite) {
            sectionsArr.push({
                title: undefined,
                data: inviteOptions.userToInvite ? [(0, OptionsListUtils_1.formatMemberForList)(inviteOptions.userToInvite)] : [],
            });
        }
        return sectionsArr;
    }, [areOptionsInitialized, selectedOptions, debouncedSearchTerm, inviteOptions.recentReports, inviteOptions.personalDetails, inviteOptions.userToInvite, translate, countryCode]);
    const toggleOption = (0, react_1.useCallback)((option) => {
        const isOptionInList = selectedOptions.some((selectedOption) => selectedOption.login === option.login);
        let newSelectedOptions;
        if (isOptionInList) {
            newSelectedOptions = selectedOptions.filter((selectedOption) => selectedOption.login !== option.login);
        }
        else {
            newSelectedOptions = [...selectedOptions, { ...option, isSelected: true }];
        }
        setSelectedOptions(newSelectedOptions);
    }, [selectedOptions]);
    const validate = (0, react_1.useCallback)(() => selectedOptions.length > 0, [selectedOptions]);
    const reportID = report.reportID;
    const reportName = (0, react_1.useMemo)(() => (0, ReportUtils_1.getGroupChatName)(undefined, true, report), [report]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(ROUTES_1.default.REPORT_PARTICIPANTS.getRoute(reportID, route.params.backTo));
    }, [reportID, route.params.backTo]);
    const inviteUsers = (0, react_1.useCallback)(() => {
        if (!validate()) {
            return;
        }
        const invitedEmailsToAccountIDs = {};
        selectedOptions.forEach((option) => {
            const login = option.login ?? '';
            const accountID = option.accountID;
            if (!login.toLowerCase().trim() || !accountID) {
                return;
            }
            invitedEmailsToAccountIDs[login] = accountID;
        });
        (0, Report_1.inviteToGroupChat)(reportID, invitedEmailsToAccountIDs, formatPhoneNumber);
        goBack();
    }, [selectedOptions, goBack, reportID, validate, formatPhoneNumber]);
    const headerMessage = (0, react_1.useMemo)(() => {
        const processedLogin = debouncedSearchTerm.trim().toLowerCase();
        const expensifyEmails = CONST_1.default.EXPENSIFY_EMAILS;
        if (!inviteOptions.userToInvite && expensifyEmails.includes(processedLogin)) {
            return translate('messages.errorMessageInvalidEmail');
        }
        if (!inviteOptions.userToInvite &&
            excludedUsers[(0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCode)(processedLogin)).possible ? (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)((0, LoginUtils_1.appendCountryCode)(processedLogin)) : processedLogin]) {
            return translate('messages.userIsAlreadyMember', { login: processedLogin, name: reportName ?? '' });
        }
        return (0, OptionsListUtils_1.getHeaderMessage)(inviteOptions.recentReports.length + inviteOptions.personalDetails.length !== 0, !!inviteOptions.userToInvite, processedLogin);
    }, [debouncedSearchTerm, inviteOptions.userToInvite, inviteOptions.recentReports.length, inviteOptions.personalDetails.length, excludedUsers, translate, reportName]);
    const footerContent = (0, react_1.useMemo)(() => (<FormAlertWithSubmitButton_1.default isDisabled={!selectedOptions.length} buttonText={translate('common.invite')} onSubmit={() => {
            (0, RoomMembersUserSearchPhrase_1.clearUserSearchPhrase)();
            inviteUsers();
        }} containerStyles={[styles.flexReset, styles.flexGrow0, styles.flexShrink0, styles.flexBasisAuto]} enabledWhenOffline/>), [selectedOptions.length, inviteUsers, translate, styles]);
    return (<ScreenWrapper_1.default shouldEnableMaxHeight testID={InviteReportParticipantsPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('workspace.invite.members')} subtitle={reportName} onBackButtonPress={goBack}/>

            <SelectionList_1.default canSelectMultiple sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputValue={searchValue} onChangeText={(value) => {
            setSearchValue(value);
        }} headerMessage={headerMessage} onSelectRow={toggleOption} onConfirm={inviteUsers} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} showLoadingPlaceholder={!didScreenTransitionEnd || !(0, OptionsListUtils_1.isPersonalDetailsReady)(personalDetails)} footerContent={footerContent}/>
        </ScreenWrapper_1.default>);
}
InviteReportParticipantsPage.displayName = 'InviteReportParticipantsPage';
exports.default = (0, withNavigationTransitionEnd_1.default)((0, withReportOrNotFound_1.default)()(InviteReportParticipantsPage));
