"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
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
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const RoomMembersUserSearchPhrase_1 = require("@libs/actions/RoomMembersUserSearchPhrase");
const types_1 = require("@libs/API/types");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const HttpUtils_1 = require("@libs/HttpUtils");
const LoginUtils_1 = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
function RoomInvitePage({ betas, report, policy, route: { params: { backTo }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const [userSearchPhrase] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ROOM_MEMBERS_USER_SEARCH_PHRASE, { canBeMissing: true });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)(userSearchPhrase ?? '');
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)([]);
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const isReportArchived = (0, useReportIsArchived_1.default)(report.reportID);
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)();
    // Any existing participants and Expensify emails should not be eligible for invitation
    const excludedUsers = (0, react_1.useMemo)(() => {
        const res = {
            ...CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
        };
        const visibleParticipantAccountIDs = Object.entries(report.participants ?? {})
            .filter(([, participant]) => participant && !(0, ReportUtils_1.isHiddenForCurrentUser)(participant.notificationPreference))
            .map(([accountID]) => Number(accountID));
        (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(visibleParticipantAccountIDs).forEach((participant) => {
            const smsDomain = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(participant);
            res[smsDomain] = true;
        });
        return res;
    }, [report.participants]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return { recentReports: [], personalDetails: [], userToInvite: null, currentUserOption: null };
        }
        const inviteOptions = (0, OptionsListUtils_1.getMemberInviteOptions)(options.personalDetails, betas ?? [], excludedUsers);
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
        return {
            userToInvite: inviteOptions.userToInvite,
            personalDetails: inviteOptions.personalDetails,
            selectedOptions: newSelectedOptions,
            recentReports: [],
            currentUserOption: null,
        };
    }, [areOptionsInitialized, betas, excludedUsers, options.personalDetails, selectedOptions]);
    const inviteOptions = (0, react_1.useMemo)(() => {
        if (debouncedSearchTerm.trim() === '') {
            return defaultOptions;
        }
        const filteredOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchTerm, countryCode, { excludeLogins: excludedUsers });
        return filteredOptions;
    }, [debouncedSearchTerm, defaultOptions, excludedUsers, countryCode]);
    const sections = (0, react_1.useMemo)(() => {
        const sectionsArr = [];
        const { personalDetails, userToInvite } = inviteOptions;
        if (!areOptionsInitialized) {
            return [];
        }
        // Filter all options that is a part of the search term or in the personal details
        let filterSelectedOptions = selectedOptions;
        if (debouncedSearchTerm !== '') {
            filterSelectedOptions = selectedOptions.filter((option) => {
                const accountID = option?.accountID;
                const isOptionInPersonalDetails = personalDetails ? personalDetails.some((personalDetail) => accountID && personalDetail?.accountID === accountID) : false;
                const parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCode)(expensify_common_1.Str.removeSMSDomain(debouncedSearchTerm)));
                const searchValue = parsedPhoneNumber.possible && parsedPhoneNumber.number ? parsedPhoneNumber.number.e164 : debouncedSearchTerm.toLowerCase();
                const isPartOfSearchTerm = (option.text?.toLowerCase() ?? '').includes(searchValue) || (option.login?.toLowerCase() ?? '').includes(searchValue);
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
        const personalDetailsWithoutSelected = personalDetails ? personalDetails.filter(({ login }) => !selectedLogins.includes(login)) : [];
        const personalDetailsFormatted = personalDetailsWithoutSelected.map((personalDetail) => (0, OptionsListUtils_1.formatMemberForList)(personalDetail));
        const hasUnselectedUserToInvite = userToInvite && !selectedLogins.includes(userToInvite.login);
        sectionsArr.push({
            title: translate('common.contacts'),
            data: personalDetailsFormatted,
        });
        if (hasUnselectedUserToInvite) {
            sectionsArr.push({
                title: undefined,
                data: [(0, OptionsListUtils_1.formatMemberForList)(userToInvite)],
            });
        }
        return sectionsArr;
    }, [inviteOptions, areOptionsInitialized, selectedOptions, debouncedSearchTerm, translate]);
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
    // Non policy members should not be able to view the participants of a room
    const reportID = report?.reportID;
    const isPolicyEmployee = (0, react_1.useMemo)(() => (0, PolicyUtils_1.isPolicyEmployee)(report?.policyID, policy), [report?.policyID, policy]);
    const backRoute = (0, react_1.useMemo)(() => {
        return reportID && (!isPolicyEmployee || isReportArchived ? ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(reportID, backTo) : ROUTES_1.default.ROOM_MEMBERS.getRoute(reportID, backTo));
    }, [isPolicyEmployee, reportID, backTo, isReportArchived]);
    const reportName = (0, react_1.useMemo)(() => (0, ReportUtils_1.getReportName)(report), [report]);
    const inviteUsers = (0, react_1.useCallback)(() => {
        HttpUtils_1.default.cancelPendingRequests(types_1.READ_COMMANDS.SEARCH_FOR_REPORTS);
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
            invitedEmailsToAccountIDs[login] = Number(accountID);
        });
        if (reportID) {
            (0, Report_1.inviteToRoom)(reportID, invitedEmailsToAccountIDs, formatPhoneNumber);
        }
        (0, RoomMembersUserSearchPhrase_1.clearUserSearchPhrase)();
        Navigation_1.default.goBack(backRoute);
    }, [selectedOptions, backRoute, reportID, validate, formatPhoneNumber]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backRoute);
    }, [backRoute]);
    const headerMessage = (0, react_1.useMemo)(() => {
        const searchValue = debouncedSearchTerm.trim().toLowerCase();
        const expensifyEmails = CONST_1.default.EXPENSIFY_EMAILS;
        if (!inviteOptions.userToInvite && expensifyEmails.includes(searchValue)) {
            return translate('messages.errorMessageInvalidEmail');
        }
        if (!inviteOptions.userToInvite &&
            excludedUsers[(0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCode)(searchValue)).possible ? (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)((0, LoginUtils_1.appendCountryCode)(searchValue)) : searchValue]) {
            return translate('messages.userIsAlreadyMember', { login: searchValue, name: reportName });
        }
        return (0, OptionsListUtils_1.getHeaderMessage)((inviteOptions.personalDetails ?? []).length !== 0, !!inviteOptions.userToInvite, debouncedSearchTerm);
    }, [debouncedSearchTerm, inviteOptions.userToInvite, inviteOptions.personalDetails, excludedUsers, translate, reportName]);
    (0, react_1.useEffect)(() => {
        (0, RoomMembersUserSearchPhrase_1.updateUserSearchPhrase)(debouncedSearchTerm);
        (0, Report_1.searchInServer)(debouncedSearchTerm);
    }, [debouncedSearchTerm]);
    let subtitleKey;
    if (!(0, EmptyObject_1.isEmptyObject)(report)) {
        subtitleKey = isReportArchived ? 'roomMembersPage.roomArchived' : 'roomMembersPage.notAuthorized';
    }
    return (<ScreenWrapper_1.default shouldEnableMaxHeight testID={RoomInvitePage.displayName} includeSafeAreaPaddingBottom>
            <FullPageNotFoundView_1.default shouldShow={(0, EmptyObject_1.isEmptyObject)(report) || isReportArchived} subtitleKey={subtitleKey} onBackButtonPress={goBack}>
                <HeaderWithBackButton_1.default title={translate('workspace.invite.invitePeople')} subtitle={reportName} onBackButtonPress={goBack}/>
                <SelectionList_1.default canSelectMultiple sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputValue={searchTerm} onChangeText={(value) => {
            setSearchTerm(value);
        }} headerMessage={headerMessage} onSelectRow={toggleOption} onConfirm={inviteUsers} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} showLoadingPlaceholder={!areOptionsInitialized} isLoadingNewOptions={!!isSearchingForReports}/>
                <react_native_1.View style={[styles.flexShrink0]}>
                    <FormAlertWithSubmitButton_1.default isDisabled={!selectedOptions.length} buttonText={translate('common.invite')} onSubmit={inviteUsers} containerStyles={[styles.flexReset, styles.flexGrow0, styles.flexShrink0, styles.flexBasisAuto, styles.mb5, styles.ph5]} enabledWhenOffline isAlertVisible={false}/>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
RoomInvitePage.displayName = 'RoomInvitePage';
exports.default = (0, withNavigationTransitionEnd_1.default)((0, withReportOrNotFound_1.default)()(RoomInvitePage));
