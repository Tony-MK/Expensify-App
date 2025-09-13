"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const memoize_1 = require("@libs/memoize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const memoizedGetValidOptions = (0, memoize_1.default)(OptionsListUtils_1.getValidOptions, { maxSize: 5, monitoringName: 'AddDelegatePage.getValidOptions' });
function useOptions() {
    const betas = (0, OnyxListItemProvider_1.useBetas)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const { options: optionsList, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const existingDelegates = (0, react_1.useMemo)(() => account?.delegatedAccess?.delegates?.reduce((prev, { email }) => {
        // eslint-disable-next-line no-param-reassign
        prev[email] = true;
        return prev;
    }, {}), [account?.delegatedAccess?.delegates]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        const { recentReports, personalDetails, userToInvite, currentUserOption } = memoizedGetValidOptions({
            reports: optionsList.reports,
            personalDetails: optionsList.personalDetails,
        }, {
            betas,
            excludeLogins: { ...CONST_1.default.EXPENSIFY_EMAILS_OBJECT, ...existingDelegates },
        });
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((recentReports?.length || 0) + (personalDetails?.length || 0) !== 0, !!userToInvite, '');
        if (isLoading) {
            // eslint-disable-next-line react-compiler/react-compiler
            setIsLoading(false);
        }
        return {
            userToInvite,
            recentReports,
            personalDetails,
            currentUserOption,
            headerMessage,
        };
    }, [optionsList.reports, optionsList.personalDetails, betas, existingDelegates, isLoading]);
    const options = (0, react_1.useMemo)(() => {
        const filteredOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchValue.trim(), countryCode, {
            excludeLogins: { ...CONST_1.default.EXPENSIFY_EMAILS_OBJECT, ...existingDelegates },
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
        });
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((filteredOptions.recentReports?.length || 0) + (filteredOptions.personalDetails?.length || 0) !== 0, !!filteredOptions.userToInvite, debouncedSearchValue);
        return {
            ...filteredOptions,
            headerMessage,
        };
    }, [debouncedSearchValue, defaultOptions, existingDelegates, countryCode]);
    return { ...options, searchValue, debouncedSearchValue, setSearchValue, areOptionsInitialized };
}
function AddDelegatePage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const { userToInvite, recentReports, personalDetails, searchValue, debouncedSearchValue, setSearchValue, headerMessage, areOptionsInitialized } = useOptions();
    const sections = (0, react_1.useMemo)(() => {
        const sectionsList = [];
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
                text: option.text ?? '',
                alternateText: option.alternateText ?? undefined,
                keyForList: option.keyForList ?? '',
                isDisabled: option.isDisabled ?? undefined,
                login: option.login ?? undefined,
                shouldShowSubscript: option.shouldShowSubscript ?? undefined,
            })),
        }));
    }, [personalDetails, recentReports, translate, userToInvite]);
    const onSelectRow = (0, react_1.useCallback)((option) => {
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_DELEGATE_ROLE.getRoute(option?.login ?? ''));
    }, []);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchValue);
    }, [debouncedSearchValue]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={AddDelegatePage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('delegate.addCopilot')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <react_native_1.View style={[styles.flex1, styles.w100, styles.pRelative]}>
                    <SelectionList_1.default sections={areOptionsInitialized ? sections : []} ListItem={UserListItem_1.default} onSelectRow={onSelectRow} shouldSingleExecuteRowSelect onChangeText={setSearchValue} textInputValue={searchValue} headerMessage={headerMessage} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} showLoadingPlaceholder={!areOptionsInitialized} isLoadingNewOptions={!!isSearchingForReports}/>
                </react_native_1.View>
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
AddDelegatePage.displayName = 'AddDelegatePage';
exports.default = AddDelegatePage;
