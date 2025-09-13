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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ConfirmationPage_1 = require("@components/ConfirmationPage");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons = require("@components/Icon/Expensicons");
var Illustrations = require("@components/Icon/Illustrations");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SelectionList_1 = require("@components/SelectionList");
var UserListItem_1 = require("@components/SelectionList/UserListItem");
var Text_1 = require("@components/Text");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Policy_1 = require("@libs/actions/Policy/Policy");
var LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
var Navigation_1 = require("@libs/Navigation/Navigation");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var tokenizedSearch_1 = require("@libs/tokenizedSearch");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function InviteReceiptPartnerPolicyPage(_a) {
    var _b;
    var route = _a.route;
    var styles = (0, useThemeStyles_1.default)();
    var _c = (0, useLocalize_1.default)(), translate = _c.translate, localeCompare = _c.localeCompare;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var _d = (0, useDebouncedState_1.default)(''), searchTerm = _d[0], debouncedSearchTerm = _d[1], setSearchTerm = _d[2];
    var _e = (0, react_1.useState)([]), selectedOptions = _e[0], setSelectedOptions = _e[1];
    var _f = (0, react_1.useState)(false), isInvitationSent = _f[0], setIsInvitationSent = _f[1];
    var countryCode = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false })[0];
    var policyID = (_b = route.params) === null || _b === void 0 ? void 0 : _b.policyID;
    var policy = (0, usePolicy_1.default)(policyID);
    var shouldShowTextInput = (policy === null || policy === void 0 ? void 0 : policy.employeeList) && Object.keys(policy.employeeList).length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    var textInputLabel = shouldShowTextInput ? translate('common.search') : undefined;
    var workspaceMembers = (0, react_1.useMemo)(function () {
        var membersList = [];
        if (!(policy === null || policy === void 0 ? void 0 : policy.employeeList)) {
            return membersList;
        }
        Object.entries(policy.employeeList).forEach(function (_a) {
            var _b, _c;
            var email = _a[0], policyEmployee = _a[1];
            if ((0, PolicyUtils_1.isDeletedPolicyEmployee)(policyEmployee, isOffline)) {
                return;
            }
            var personalDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email);
            if (personalDetail) {
                var memberForList = (0, OptionsListUtils_1.formatMemberForList)({
                    text: (_b = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.displayName) !== null && _b !== void 0 ? _b : email,
                    alternateText: email,
                    login: email,
                    accountID: personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.accountID,
                    icons: [
                        {
                            source: (_c = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.avatar) !== null && _c !== void 0 ? _c : Expensicons.FallbackAvatar,
                            name: (0, LocalePhoneNumber_1.formatPhoneNumber)(email),
                            type: CONST_1.default.ICON_TYPE_AVATAR,
                            id: personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.accountID,
                        },
                    ],
                    reportID: '',
                    keyForList: email,
                    isSelected: true,
                });
                membersList.push(memberForList);
            }
        });
        membersList = (0, OptionsListUtils_1.sortAlphabetically)(membersList, 'text', localeCompare);
        return membersList;
    }, [isOffline, policy === null || policy === void 0 ? void 0 : policy.employeeList, localeCompare]);
    var sections = (0, react_1.useMemo)(function () {
        if (workspaceMembers.length === 0) {
            return [];
        }
        var membersToDisplay = workspaceMembers;
        // Apply search filter if there's a search term
        if (debouncedSearchTerm) {
            var searchValue = (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode).toLowerCase();
            membersToDisplay = (0, tokenizedSearch_1.default)(workspaceMembers, searchValue, function (option) { var _a, _b; return [(_a = option.text) !== null && _a !== void 0 ? _a : '', (_b = option.alternateText) !== null && _b !== void 0 ? _b : '']; });
        }
        // Filter to show selected members first, then apply search filter to selected members
        var filterSelectedOptions = selectedOptions;
        if (debouncedSearchTerm !== '') {
            var searchValue_1 = (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode).toLowerCase();
            filterSelectedOptions = selectedOptions.filter(function (option) {
                var _a, _b;
                var isPartOfSearchTerm = !!((_a = option.text) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchValue_1)) || !!((_b = option.login) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchValue_1));
                return isPartOfSearchTerm;
            });
        }
        // Combine selected members with unselected members
        var selectedLogins = selectedOptions.map(function (_a) {
            var login = _a.login;
            return login;
        });
        var unselectedMembers = membersToDisplay.filter(function (_a) {
            var login = _a.login;
            return !selectedLogins.includes(login);
        });
        var allMembersWithState = [];
        filterSelectedOptions.forEach(function (member) {
            allMembersWithState.push(__assign(__assign({}, member), { isSelected: true }));
        });
        unselectedMembers.forEach(function (member) {
            allMembersWithState.push(__assign(__assign({}, member), { isSelected: false }));
        });
        return [
            {
                title: undefined,
                data: allMembersWithState,
                shouldShow: true,
            },
        ];
    }, [workspaceMembers, countryCode, debouncedSearchTerm, selectedOptions]);
    // Pre-select all members only once on first load.
    (0, react_1.useEffect)(function () {
        if (workspaceMembers.length === 0) {
            return;
        }
        setSelectedOptions(function (prev) {
            if (prev.length > 0) {
                return prev;
            }
            return workspaceMembers.map(function (member) { return (__assign(__assign({}, member), { isSelected: true })); });
        });
    }, [workspaceMembers]);
    var toggleOption = (0, react_1.useCallback)(function (option) {
        (0, Policy_1.clearErrors)(policyID);
        var isOptionInList = selectedOptions.some(function (selectedOption) { return selectedOption.login === option.login; });
        var newSelectedOptions;
        if (isOptionInList) {
            newSelectedOptions = selectedOptions.filter(function (selectedOption) { return selectedOption.login !== option.login; });
        }
        else {
            newSelectedOptions = __spreadArray(__spreadArray([], selectedOptions, true), [__assign(__assign({}, option), { isSelected: true })], false);
        }
        setSelectedOptions(newSelectedOptions);
    }, [selectedOptions, policyID]);
    var headerMessage = (0, react_1.useMemo)(function () {
        var _a;
        var searchValue = debouncedSearchTerm.trim().toLowerCase();
        return (0, OptionsListUtils_1.getHeaderMessage)(((_a = sections === null || sections === void 0 ? void 0 : sections.at(0)) === null || _a === void 0 ? void 0 : _a.data.length) !== 0, false, searchValue);
    }, [debouncedSearchTerm, sections]);
    var handleConfirm = (0, react_1.useCallback)(function () {
        if (selectedOptions.length === 0) {
            return;
        }
        var emails = selectedOptions.map(function (member) { return member.login; }).filter(Boolean);
        (0, Policy_1.inviteWorkspaceEmployeesToUber)(policyID, emails);
        setIsInvitationSent(true);
    }, [selectedOptions, policyID]);
    var handleGotIt = (0, react_1.useCallback)(function () {
        Navigation_1.default.dismissModal();
    }, []);
    if (isInvitationSent) {
        return (<ScreenWrapper_1.default testID={InviteReceiptPartnerPolicyPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.receiptPartners.uber.allSet')} onBackButtonPress={function () { return Navigation_1.default.dismissModal(); }}/>
                <ConfirmationPage_1.default illustration={Illustrations.ToddInCar} illustrationStyle={styles.uberConfirmationIllustrationContainer} heading={translate('workspace.receiptPartners.uber.readyToRoll')} description={translate('workspace.receiptPartners.uber.takeBusinessRideMessage')} shouldShowButton buttonText={translate('common.buttonConfirm')} onButtonPress={handleGotIt} descriptionStyle={styles.colorMuted}/>
            </ScreenWrapper_1.default>);
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED}>
            <ScreenWrapper_1.default testID={InviteReceiptPartnerPolicyPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.receiptPartners.uber.sendInvites')} onBackButtonPress={function () { return Navigation_1.default.goBack(); }}/>
                <SelectionList_1.default canSelectMultiple textInputLabel={textInputLabel} textInputValue={searchTerm} onChangeText={setSearchTerm} sections={sections} headerContent={<Text_1.default style={[styles.ph5, styles.pb3]}>{translate('workspace.receiptPartners.uber.sendInvitesDescription')}</Text_1.default>} shouldShowTextInputAfterHeader shouldShowListEmptyContent={false} shouldUpdateFocusedIndex shouldShowHeaderMessageAfterHeader headerMessage={headerMessage} ListItem={UserListItem_1.default} shouldUseDefaultRightHandSideCheckmark onSelectRow={toggleOption} showConfirmButton confirmButtonText={translate('workspace.receiptPartners.uber.confirm')} onConfirm={handleConfirm} isConfirmButtonDisabled={selectedOptions.length === 0} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
InviteReceiptPartnerPolicyPage.displayName = 'InviteReceiptPartnerPolicyPage';
exports.default = InviteReceiptPartnerPolicyPage;
