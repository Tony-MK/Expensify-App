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
var Badge_1 = require("@components/Badge");
var BlockingView_1 = require("@components/BlockingViews/BlockingView");
var Button_1 = require("@components/Button");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons = require("@components/Icon/Expensicons");
var Illustrations = require("@components/Icon/Illustrations");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SelectionList_1 = require("@components/SelectionList");
var UserListItem_1 = require("@components/SelectionList/UserListItem");
var TabSelector_1 = require("@components/TabSelector/TabSelector");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var usePolicy_1 = require("@hooks/usePolicy");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
var Navigation_1 = require("@libs/Navigation/Navigation");
var OnyxTabNavigator_1 = require("@libs/Navigation/OnyxTabNavigator");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var tokenizedSearch_1 = require("@libs/tokenizedSearch");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var TAB_NAMES = [CONST_1.default.TAB.RECEIPT_PARTNERS.ALL, CONST_1.default.TAB.RECEIPT_PARTNERS.LINKED, CONST_1.default.TAB.RECEIPT_PARTNERS.OUTSTANDING];
var UBER_EMPLOYEE_STATUS_VALUES = [
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.CREATED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.INVITED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED_PENDING_APPROVAL,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.SUSPENDED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.DELETED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.NONE,
];
function EditInviteReceiptPartnerPolicyPage(_a) {
    var route = _a.route;
    var styles = (0, useThemeStyles_1.default)();
    var _b = (0, useLocalize_1.default)(), translate = _b.translate, localeCompare = _b.localeCompare;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var policyID = route.params.policyID;
    var policy = (0, usePolicy_1.default)(policyID);
    // Maintain independent search state per tab to avoid carryover across tabs
    var _c = (0, useDebouncedState_1.default)(''), allSearchTerm = _c[0], allDebouncedSearchTerm = _c[1], setAllSearchTerm = _c[2];
    var _d = (0, useDebouncedState_1.default)(''), linkedSearchTerm = _d[0], linkedDebouncedSearchTerm = _d[1], setLinkedSearchTerm = _d[2];
    var _e = (0, useDebouncedState_1.default)(''), outstandingSearchTerm = _e[0], outstandingDebouncedSearchTerm = _e[1], setOutstandingSearchTerm = _e[2];
    var getSearchStateForTab = (0, react_1.useCallback)(function (tab) {
        if (tab === CONST_1.default.TAB.RECEIPT_PARTNERS.ALL) {
            return { searchTerm: allSearchTerm, debouncedSearchTerm: allDebouncedSearchTerm, setSearchTerm: setAllSearchTerm };
        }
        if (tab === CONST_1.default.TAB.RECEIPT_PARTNERS.LINKED) {
            return { searchTerm: linkedSearchTerm, debouncedSearchTerm: linkedDebouncedSearchTerm, setSearchTerm: setLinkedSearchTerm };
        }
        return { searchTerm: outstandingSearchTerm, debouncedSearchTerm: outstandingDebouncedSearchTerm, setSearchTerm: setOutstandingSearchTerm };
    }, [
        allSearchTerm,
        allDebouncedSearchTerm,
        linkedSearchTerm,
        linkedDebouncedSearchTerm,
        outstandingSearchTerm,
        outstandingDebouncedSearchTerm,
        setAllSearchTerm,
        setLinkedSearchTerm,
        setOutstandingSearchTerm,
    ]);
    var uberEmployeesByEmail = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        var policyWithEmployees = policy;
        return (_c = (_b = (_a = policyWithEmployees === null || policyWithEmployees === void 0 ? void 0 : policyWithEmployees.receiptPartners) === null || _a === void 0 ? void 0 : _a.uber) === null || _b === void 0 ? void 0 : _b.employees) !== null && _c !== void 0 ? _c : {};
    }, [policy]);
    var deriveStatus = (0, react_1.useCallback)(function (email) {
        var _a;
        var status = (_a = uberEmployeesByEmail[email]) === null || _a === void 0 ? void 0 : _a.status;
        return status !== null && status !== void 0 ? status : CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.NONE;
    }, [uberEmployeesByEmail]);
    var members = (0, react_1.useMemo)(function () {
        var _a;
        var list = [];
        var employees = (_a = policy === null || policy === void 0 ? void 0 : policy.employeeList) !== null && _a !== void 0 ? _a : {};
        Object.entries(employees).forEach(function (_a) {
            var _b, _c;
            var email = _a[0], policyEmployee = _a[1];
            // Skip deleted policy employees
            if ((0, PolicyUtils_1.isDeletedPolicyEmployee)(policyEmployee, isOffline)) {
                return;
            }
            var personalDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email);
            var status = deriveStatus(email);
            var rightElement;
            // Show resend button for CREATED and INVITED
            if (status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.CREATED || status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.INVITED) {
                rightElement = (<Button_1.default small text={translate('workspace.receiptPartners.uber.status.resend')} onPress={function () { }} style={[styles.ml3]}/>);
            }
            // Show invite button for DELETED and NONE
            else if (status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.DELETED || status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.NONE) {
                rightElement = (<Button_1.default small text={translate('workspace.receiptPartners.uber.status.invite')} onPress={function () { }} success style={[styles.ml3]}/>);
            }
            else {
                var badgeText = translate("workspace.receiptPartners.uber.status.".concat(status));
                var isSuccess = status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED;
                rightElement = (<Badge_1.default text={badgeText} success={isSuccess} style={[styles.ml3]}/>);
            }
            var option = (0, OptionsListUtils_1.formatMemberForList)({
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
                keyForList: email,
                reportID: '',
                isDisabled: true,
            });
            list.push(__assign(__assign({}, option), { rightElement: rightElement }));
        });
        return (0, OptionsListUtils_1.sortAlphabetically)(list, 'text', localeCompare);
    }, [deriveStatus, localeCompare, policy === null || policy === void 0 ? void 0 : policy.employeeList, translate, isOffline, styles.ml3]);
    var applyTabStatusFilter = (0, react_1.useCallback)(function (tab, data) {
        if (tab === CONST_1.default.TAB.RECEIPT_PARTNERS.ALL) {
            return data;
        }
        if (tab === CONST_1.default.TAB.RECEIPT_PARTNERS.LINKED) {
            return data.filter(function (m) {
                var _a;
                var status = deriveStatus((_a = m.login) !== null && _a !== void 0 ? _a : '');
                return (status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED ||
                    status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED_PENDING_APPROVAL ||
                    status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.SUSPENDED);
            });
        }
        // OUTSTANDING
        return data.filter(function (m) {
            var _a;
            var email = (_a = m.login) !== null && _a !== void 0 ? _a : '';
            var status = deriveStatus(email);
            return (status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.CREATED ||
                status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.INVITED ||
                status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.DELETED ||
                status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.NONE);
        });
    }, [deriveStatus]);
    var getMembersForTabWithoutSearch = (0, react_1.useCallback)(function (tab) { return applyTabStatusFilter(tab, members); }, [applyTabStatusFilter, members]);
    var filterMembers = (0, react_1.useCallback)(function (tab) {
        var debouncedSearchTerm = getSearchStateForTab(tab).debouncedSearchTerm;
        var search = debouncedSearchTerm.trim().toLowerCase();
        var data = members;
        if (search) {
            data = (0, tokenizedSearch_1.default)(members, search, function (m) { var _a, _b; return [(_a = m.text) !== null && _a !== void 0 ? _a : '', (_b = m.alternateText) !== null && _b !== void 0 ? _b : '']; });
        }
        return applyTabStatusFilter(tab, data);
    }, [applyTabStatusFilter, getSearchStateForTab, members]);
    var buildSections = (0, react_1.useCallback)(function (data) { return [
        {
            title: undefined,
            data: data,
            shouldShow: true,
        },
    ]; }, []);
    var listEmptyContent = (0, react_1.useMemo)(function () { return (<BlockingView_1.default icon={Illustrations.ToddBehindCloud} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.receiptPartners.uber.emptyContent.title')} subtitle={translate('workspace.receiptPartners.uber.emptyContent.subtitle')} subtitleStyle={styles.textSupporting} containerStyle={styles.pb10} contentFitImage="contain"/>); }, [translate, styles.textSupporting, styles.pb10]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED}>
            <ScreenWrapper_1.default testID={EditInviteReceiptPartnerPolicyPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.receiptPartners.uber.manageInvites')} onBackButtonPress={function () {
            Navigation_1.default.dismissModal();
        }}/>

                <OnyxTabNavigator_1.default id={CONST_1.default.TAB.RECEIPT_PARTNERS.NAVIGATOR_ID} tabBar={TabSelector_1.default} equalWidth>
                    {TAB_NAMES.map(function (tabName) { return (<OnyxTabNavigator_1.TopTab.Screen key={tabName} name={tabName}>
                            {function () {
                var _a = getSearchStateForTab(tabName), searchTerm = _a.searchTerm, debouncedSearchTerm = _a.debouncedSearchTerm, setSearchTerm = _a.setSearchTerm;
                var filteredMembers = filterMembers(tabName);
                var baseTabMembersCount = getMembersForTabWithoutSearch(tabName).length;
                var shouldShowListEmptyContent = baseTabMembersCount < CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
                var shouldShowTextInput = !shouldShowListEmptyContent;
                // Determine header message for search results
                var searchValue = debouncedSearchTerm.trim().toLowerCase();
                var currentHeaderMessage = (0, OptionsListUtils_1.getHeaderMessage)(members.length !== 0, false, searchValue);
                if (filteredMembers.length === 0 && searchValue) {
                    currentHeaderMessage = translate('common.noResultsFound');
                }
                return (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                        <SelectionList_1.default ListItem={UserListItem_1.default} onSelectRow={function () { }} listItemWrapperStyle={styles.cursorDefault} addBottomSafeAreaPadding shouldShowTextInput={shouldShowTextInput} textInputLabel={shouldShowTextInput ? translate('common.search') : undefined} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={currentHeaderMessage} sections={buildSections(filteredMembers)} listEmptyContent={listEmptyContent} shouldShowListEmptyContent={shouldShowListEmptyContent} sectionListStyle={styles.pt3}/>
                                    </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>);
            }}
                        </OnyxTabNavigator_1.TopTab.Screen>); })}
                </OnyxTabNavigator_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
EditInviteReceiptPartnerPolicyPage.displayName = 'EditInviteReceiptPartnerPolicyPage';
exports.default = EditInviteReceiptPartnerPolicyPage;
