"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const VacationDelegate_1 = require("@libs/actions/VacationDelegate");
const LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function useOptions() {
    const betas = (0, OnyxListItemProvider_1.useBetas)();
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const { options: optionsList, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)();
    const [vacationDelegate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE, { canBeMissing: true });
    const currentVacationDelegate = vacationDelegate?.delegate;
    const delegatePersonalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(currentVacationDelegate ?? '');
    const excludeLogins = (0, react_1.useMemo)(() => ({
        ...CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
        [currentVacationDelegate ?? '']: true,
    }), [currentVacationDelegate]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        const { recentReports, personalDetails, userToInvite, currentUserOption } = (0, OptionsListUtils_1.getValidOptions)({
            reports: optionsList.reports,
            personalDetails: optionsList.personalDetails,
        }, {
            betas,
            excludeLogins,
        });
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((recentReports?.length || 0) + (personalDetails?.length || 0) !== 0, !!userToInvite, '');
        return {
            userToInvite,
            recentReports,
            personalDetails,
            currentUserOption,
            headerMessage,
        };
    }, [optionsList.reports, optionsList.personalDetails, betas, excludeLogins]);
    const options = (0, react_1.useMemo)(() => {
        const filteredOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchValue.trim(), countryCode, {
            excludeLogins,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
        });
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((filteredOptions.recentReports?.length || 0) + (filteredOptions.personalDetails?.length || 0) !== 0, !!filteredOptions.userToInvite, debouncedSearchValue);
        return {
            ...filteredOptions,
            headerMessage,
        };
    }, [debouncedSearchValue, defaultOptions, excludeLogins, countryCode]);
    return { ...options, vacationDelegate, searchValue, debouncedSearchValue, setSearchValue, areOptionsInitialized, delegatePersonalDetails };
}
function VacationDelegatePage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isWarningModalVisible, setIsWarningModalVisible] = (0, react_1.useState)(false);
    const [newVacationDelegate, setNewVacationDelegate] = (0, react_1.useState)('');
    const { login: currentUserLogin } = (0, useCurrentUserPersonalDetails_1.default)();
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: false });
    const { vacationDelegate, userToInvite, recentReports, personalDetails, searchValue, debouncedSearchValue, setSearchValue, headerMessage, areOptionsInitialized, delegatePersonalDetails } = useOptions();
    const sections = (0, react_1.useMemo)(() => {
        const sectionsList = [];
        if (vacationDelegate && delegatePersonalDetails) {
            sectionsList.push({
                title: undefined,
                data: [
                    {
                        ...delegatePersonalDetails,
                        text: delegatePersonalDetails?.displayName ?? vacationDelegate.delegate,
                        alternateText: delegatePersonalDetails?.login ?? vacationDelegate.delegate,
                        login: delegatePersonalDetails.login ?? vacationDelegate.delegate,
                        keyForList: `vacationDelegate-${delegatePersonalDetails.login}`,
                        isDisabled: false,
                        isSelected: true,
                        shouldShowSubscript: undefined,
                        icons: [
                            {
                                source: delegatePersonalDetails?.avatar ?? Expensicons.FallbackAvatar,
                                name: (0, LocalePhoneNumber_1.formatPhoneNumber)(delegatePersonalDetails?.login ?? ''),
                                type: CONST_1.default.ICON_TYPE_AVATAR,
                                id: delegatePersonalDetails?.accountID,
                            },
                        ],
                    },
                ],
                shouldShow: true,
            });
        }
        sectionsList.push({
            title: translate('common.recents'),
            data: recentReports,
            shouldShow: recentReports?.length > 0,
        });
        sectionsList.push({
            title: translate('common.contacts'),
            data: personalDetails,
            shouldShow: personalDetails?.length > 0,
        });
        if (userToInvite) {
            sectionsList.push({
                title: undefined,
                data: [userToInvite],
                shouldShow: true,
            });
        }
        return sectionsList.map((section) => ({
            ...section,
            data: section.data.map((option) => ({
                ...option,
                text: option.text ?? option.displayName ?? '',
                alternateText: option.alternateText ?? option.login ?? undefined,
                keyForList: option.keyForList ?? '',
                isDisabled: option.isDisabled ?? undefined,
                isSelected: option.isSelected ?? undefined,
                login: option.login ?? undefined,
                shouldShowSubscript: option.shouldShowSubscript ?? undefined,
            })),
        }));
    }, [vacationDelegate, delegatePersonalDetails, personalDetails, recentReports, translate, userToInvite]);
    const onSelectRow = (0, react_1.useCallback)((option) => {
        // Clear search to prevent "No results found" after selection
        setSearchValue('');
        if (option?.login === vacationDelegate?.delegate) {
            (0, VacationDelegate_1.deleteVacationDelegate)(vacationDelegate);
            Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS);
            return;
        }
        (0, VacationDelegate_1.setVacationDelegate)(currentUserLogin ?? '', option?.login ?? '', false, vacationDelegate?.delegate).then((response) => {
            if (!response?.jsonCode) {
                Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS);
                return;
            }
            if (response.jsonCode === CONST_1.default.JSON_CODE.POLICY_DIFF_WARNING) {
                setIsWarningModalVisible(true);
                setNewVacationDelegate(option?.login ?? '');
                return;
            }
            Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS);
        });
    }, [currentUserLogin, vacationDelegate, setSearchValue]);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchValue);
    }, [debouncedSearchValue]);
    return (<>
            <ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={VacationDelegatePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('statusPage.vacationDelegate')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS)}/>
                <react_native_1.View style={[styles.flex1, styles.w100, styles.pRelative]}>
                    <SelectionList_1.default sections={areOptionsInitialized ? sections : []} ListItem={UserListItem_1.default} onSelectRow={onSelectRow} shouldSingleExecuteRowSelect onChangeText={setSearchValue} textInputValue={searchValue} headerMessage={headerMessage} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} showLoadingPlaceholder={!areOptionsInitialized} isLoadingNewOptions={!!isSearchingForReports}/>
                </react_native_1.View>
            </ScreenWrapper_1.default>
            <ConfirmModal_1.default isVisible={isWarningModalVisible} title={translate('common.headsUp')} prompt={translate('statusPage.vacationDelegateWarning', { nameOrEmail: (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(newVacationDelegate)?.displayName ?? newVacationDelegate })} onConfirm={() => {
            setIsWarningModalVisible(false);
            (0, VacationDelegate_1.setVacationDelegate)(currentUserLogin ?? '', newVacationDelegate, true, vacationDelegate?.delegate).then(() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS));
        }} onCancel={() => {
            setIsWarningModalVisible(false);
            (0, VacationDelegate_1.clearVacationDelegateError)(vacationDelegate?.previousDelegate);
        }} confirmText={translate('common.confirm')} cancelText={translate('common.cancel')}/>
        </>);
}
VacationDelegatePage.displayName = 'VacationDelegatePage';
exports.default = VacationDelegatePage;
