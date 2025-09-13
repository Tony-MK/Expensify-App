"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var ConfirmModal_1 = require("@components/ConfirmModal");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons = require("@components/Icon/Expensicons");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var OptionListContextProvider_1 = require("@components/OptionListContextProvider");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SelectionList_1 = require("@components/SelectionList");
var UserListItem_1 = require("@components/SelectionList/UserListItem");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Report_1 = require("@libs/actions/Report");
var VacationDelegate_1 = require("@libs/actions/VacationDelegate");
var LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
var Navigation_1 = require("@libs/Navigation/Navigation");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
function useOptions() {
    var betas = (0, OnyxListItemProvider_1.useBetas)();
    var countryCode = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false })[0];
    var _a = (0, useDebouncedState_1.default)(''), searchValue = _a[0], debouncedSearchValue = _a[1], setSearchValue = _a[2];
    var _b = (0, OptionListContextProvider_1.useOptionsList)(), optionsList = _b.options, areOptionsInitialized = _b.areOptionsInitialized;
    var vacationDelegate = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE, { canBeMissing: true })[0];
    var currentVacationDelegate = vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.delegate;
    var delegatePersonalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(currentVacationDelegate !== null && currentVacationDelegate !== void 0 ? currentVacationDelegate : '');
    var excludeLogins = (0, react_1.useMemo)(function () {
        var _a;
        return (__assign(__assign({}, CONST_1.default.EXPENSIFY_EMAILS_OBJECT), (_a = {}, _a[currentVacationDelegate !== null && currentVacationDelegate !== void 0 ? currentVacationDelegate : ''] = true, _a)));
    }, [currentVacationDelegate]);
    var defaultOptions = (0, react_1.useMemo)(function () {
        var _a = (0, OptionsListUtils_1.getValidOptions)({
            reports: optionsList.reports,
            personalDetails: optionsList.personalDetails,
        }, {
            betas: betas,
            excludeLogins: excludeLogins,
        }), recentReports = _a.recentReports, personalDetails = _a.personalDetails, userToInvite = _a.userToInvite, currentUserOption = _a.currentUserOption;
        var headerMessage = (0, OptionsListUtils_1.getHeaderMessage)(((recentReports === null || recentReports === void 0 ? void 0 : recentReports.length) || 0) + ((personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails.length) || 0) !== 0, !!userToInvite, '');
        return {
            userToInvite: userToInvite,
            recentReports: recentReports,
            personalDetails: personalDetails,
            currentUserOption: currentUserOption,
            headerMessage: headerMessage,
        };
    }, [optionsList.reports, optionsList.personalDetails, betas, excludeLogins]);
    var options = (0, react_1.useMemo)(function () {
        var _a, _b;
        var filteredOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchValue.trim(), countryCode, {
            excludeLogins: excludeLogins,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
        });
        var headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((((_a = filteredOptions.recentReports) === null || _a === void 0 ? void 0 : _a.length) || 0) + (((_b = filteredOptions.personalDetails) === null || _b === void 0 ? void 0 : _b.length) || 0) !== 0, !!filteredOptions.userToInvite, debouncedSearchValue);
        return __assign(__assign({}, filteredOptions), { headerMessage: headerMessage });
    }, [debouncedSearchValue, defaultOptions, excludeLogins, countryCode]);
    return __assign(__assign({}, options), { vacationDelegate: vacationDelegate, searchValue: searchValue, debouncedSearchValue: debouncedSearchValue, setSearchValue: setSearchValue, areOptionsInitialized: areOptionsInitialized, delegatePersonalDetails: delegatePersonalDetails });
}
function VacationDelegatePage() {
    var _a, _b;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var _c = (0, react_1.useState)(false), isWarningModalVisible = _c[0], setIsWarningModalVisible = _c[1];
    var _d = (0, react_1.useState)(''), newVacationDelegate = _d[0], setNewVacationDelegate = _d[1];
    var currentUserLogin = (0, useCurrentUserPersonalDetails_1.default)().login;
    var isSearchingForReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: false })[0];
    var _e = useOptions(), vacationDelegate = _e.vacationDelegate, userToInvite = _e.userToInvite, recentReports = _e.recentReports, personalDetails = _e.personalDetails, searchValue = _e.searchValue, debouncedSearchValue = _e.debouncedSearchValue, setSearchValue = _e.setSearchValue, headerMessage = _e.headerMessage, areOptionsInitialized = _e.areOptionsInitialized, delegatePersonalDetails = _e.delegatePersonalDetails;
    var sections = (0, react_1.useMemo)(function () {
        var _a, _b, _c, _d, _e;
        var sectionsList = [];
        if (vacationDelegate && delegatePersonalDetails) {
            sectionsList.push({
                title: undefined,
                data: [
                    __assign(__assign({}, delegatePersonalDetails), { text: (_a = delegatePersonalDetails === null || delegatePersonalDetails === void 0 ? void 0 : delegatePersonalDetails.displayName) !== null && _a !== void 0 ? _a : vacationDelegate.delegate, alternateText: (_b = delegatePersonalDetails === null || delegatePersonalDetails === void 0 ? void 0 : delegatePersonalDetails.login) !== null && _b !== void 0 ? _b : vacationDelegate.delegate, login: (_c = delegatePersonalDetails.login) !== null && _c !== void 0 ? _c : vacationDelegate.delegate, keyForList: "vacationDelegate-".concat(delegatePersonalDetails.login), isDisabled: false, isSelected: true, shouldShowSubscript: undefined, icons: [
                            {
                                source: (_d = delegatePersonalDetails === null || delegatePersonalDetails === void 0 ? void 0 : delegatePersonalDetails.avatar) !== null && _d !== void 0 ? _d : Expensicons.FallbackAvatar,
                                name: (0, LocalePhoneNumber_1.formatPhoneNumber)((_e = delegatePersonalDetails === null || delegatePersonalDetails === void 0 ? void 0 : delegatePersonalDetails.login) !== null && _e !== void 0 ? _e : ''),
                                type: CONST_1.default.ICON_TYPE_AVATAR,
                                id: delegatePersonalDetails === null || delegatePersonalDetails === void 0 ? void 0 : delegatePersonalDetails.accountID,
                            },
                        ] }),
                ],
                shouldShow: true,
            });
        }
        sectionsList.push({
            title: translate('common.recents'),
            data: recentReports,
            shouldShow: (recentReports === null || recentReports === void 0 ? void 0 : recentReports.length) > 0,
        });
        sectionsList.push({
            title: translate('common.contacts'),
            data: personalDetails,
            shouldShow: (personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails.length) > 0,
        });
        if (userToInvite) {
            sectionsList.push({
                title: undefined,
                data: [userToInvite],
                shouldShow: true,
            });
        }
        return sectionsList.map(function (section) { return (__assign(__assign({}, section), { data: section.data.map(function (option) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return (__assign(__assign({}, option), { text: (_b = (_a = option.text) !== null && _a !== void 0 ? _a : option.displayName) !== null && _b !== void 0 ? _b : '', alternateText: (_d = (_c = option.alternateText) !== null && _c !== void 0 ? _c : option.login) !== null && _d !== void 0 ? _d : undefined, keyForList: (_e = option.keyForList) !== null && _e !== void 0 ? _e : '', isDisabled: (_f = option.isDisabled) !== null && _f !== void 0 ? _f : undefined, isSelected: (_g = option.isSelected) !== null && _g !== void 0 ? _g : undefined, login: (_h = option.login) !== null && _h !== void 0 ? _h : undefined, shouldShowSubscript: (_j = option.shouldShowSubscript) !== null && _j !== void 0 ? _j : undefined }));
            }) })); });
    }, [vacationDelegate, delegatePersonalDetails, personalDetails, recentReports, translate, userToInvite]);
    var onSelectRow = (0, react_1.useCallback)(function (option) {
        var _a;
        // Clear search to prevent "No results found" after selection
        setSearchValue('');
        if ((option === null || option === void 0 ? void 0 : option.login) === (vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.delegate)) {
            (0, VacationDelegate_1.deleteVacationDelegate)(vacationDelegate);
            Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS);
            return;
        }
        (0, VacationDelegate_1.setVacationDelegate)(currentUserLogin !== null && currentUserLogin !== void 0 ? currentUserLogin : '', (_a = option === null || option === void 0 ? void 0 : option.login) !== null && _a !== void 0 ? _a : '', false, vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.delegate).then(function (response) {
            var _a;
            if (!(response === null || response === void 0 ? void 0 : response.jsonCode)) {
                Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS);
                return;
            }
            if (response.jsonCode === CONST_1.default.JSON_CODE.POLICY_DIFF_WARNING) {
                setIsWarningModalVisible(true);
                setNewVacationDelegate((_a = option === null || option === void 0 ? void 0 : option.login) !== null && _a !== void 0 ? _a : '');
                return;
            }
            Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS);
        });
    }, [currentUserLogin, vacationDelegate, setSearchValue]);
    (0, react_1.useEffect)(function () {
        (0, Report_1.searchInServer)(debouncedSearchValue);
    }, [debouncedSearchValue]);
    return (<>
            <ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={VacationDelegatePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('statusPage.vacationDelegate')} onBackButtonPress={function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS); }}/>
                <react_native_1.View style={[styles.flex1, styles.w100, styles.pRelative]}>
                    <SelectionList_1.default sections={areOptionsInitialized ? sections : []} ListItem={UserListItem_1.default} onSelectRow={onSelectRow} shouldSingleExecuteRowSelect onChangeText={setSearchValue} textInputValue={searchValue} headerMessage={headerMessage} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} showLoadingPlaceholder={!areOptionsInitialized} isLoadingNewOptions={!!isSearchingForReports}/>
                </react_native_1.View>
            </ScreenWrapper_1.default>
            <ConfirmModal_1.default isVisible={isWarningModalVisible} title={translate('common.headsUp')} prompt={translate('statusPage.vacationDelegateWarning', { nameOrEmail: (_b = (_a = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(newVacationDelegate)) === null || _a === void 0 ? void 0 : _a.displayName) !== null && _b !== void 0 ? _b : newVacationDelegate })} onConfirm={function () {
            setIsWarningModalVisible(false);
            (0, VacationDelegate_1.setVacationDelegate)(currentUserLogin !== null && currentUserLogin !== void 0 ? currentUserLogin : '', newVacationDelegate, true, vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.delegate).then(function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS); });
        }} onCancel={function () {
            setIsWarningModalVisible(false);
            (0, VacationDelegate_1.clearVacationDelegateError)(vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.previousDelegate);
        }} confirmText={translate('common.confirm')} cancelText={translate('common.cancel')}/>
        </>);
}
VacationDelegatePage.displayName = 'VacationDelegatePage';
exports.default = VacationDelegatePage;
