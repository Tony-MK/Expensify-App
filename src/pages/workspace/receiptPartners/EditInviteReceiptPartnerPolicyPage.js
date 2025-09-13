"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Badge_1 = require("@components/Badge");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const TabSelector_1 = require("@components/TabSelector/TabSelector");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OnyxTabNavigator_1 = require("@libs/Navigation/OnyxTabNavigator");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const TAB_NAMES = [CONST_1.default.TAB.RECEIPT_PARTNERS.ALL, CONST_1.default.TAB.RECEIPT_PARTNERS.LINKED, CONST_1.default.TAB.RECEIPT_PARTNERS.OUTSTANDING];
const UBER_EMPLOYEE_STATUS_VALUES = [
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.CREATED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.INVITED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED_PENDING_APPROVAL,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.SUSPENDED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.DELETED,
    CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.NONE,
];
function EditInviteReceiptPartnerPolicyPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    // Maintain independent search state per tab to avoid carryover across tabs
    const [allSearchTerm, allDebouncedSearchTerm, setAllSearchTerm] = (0, useDebouncedState_1.default)('');
    const [linkedSearchTerm, linkedDebouncedSearchTerm, setLinkedSearchTerm] = (0, useDebouncedState_1.default)('');
    const [outstandingSearchTerm, outstandingDebouncedSearchTerm, setOutstandingSearchTerm] = (0, useDebouncedState_1.default)('');
    const getSearchStateForTab = (0, react_1.useCallback)((tab) => {
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
    const uberEmployeesByEmail = (0, react_1.useMemo)(() => {
        const policyWithEmployees = policy;
        return policyWithEmployees?.receiptPartners?.uber?.employees ?? {};
    }, [policy]);
    const deriveStatus = (0, react_1.useCallback)((email) => {
        const status = uberEmployeesByEmail[email]?.status;
        return status ?? CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.NONE;
    }, [uberEmployeesByEmail]);
    const members = (0, react_1.useMemo)(() => {
        const list = [];
        const employees = policy?.employeeList ?? {};
        Object.entries(employees).forEach(([email, policyEmployee]) => {
            // Skip deleted policy employees
            if ((0, PolicyUtils_1.isDeletedPolicyEmployee)(policyEmployee, isOffline)) {
                return;
            }
            const personalDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email);
            const status = deriveStatus(email);
            let rightElement;
            // Show resend button for CREATED and INVITED
            if (status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.CREATED || status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.INVITED) {
                rightElement = (<Button_1.default small text={translate('workspace.receiptPartners.uber.status.resend')} onPress={() => { }} style={[styles.ml3]}/>);
            }
            // Show invite button for DELETED and NONE
            else if (status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.DELETED || status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.NONE) {
                rightElement = (<Button_1.default small text={translate('workspace.receiptPartners.uber.status.invite')} onPress={() => { }} success style={[styles.ml3]}/>);
            }
            else {
                const badgeText = translate(`workspace.receiptPartners.uber.status.${status}`);
                const isSuccess = status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED;
                rightElement = (<Badge_1.default text={badgeText} success={isSuccess} style={[styles.ml3]}/>);
            }
            const option = (0, OptionsListUtils_1.formatMemberForList)({
                text: personalDetail?.displayName ?? email,
                alternateText: email,
                login: email,
                accountID: personalDetail?.accountID,
                icons: [
                    {
                        source: personalDetail?.avatar ?? Expensicons.FallbackAvatar,
                        name: (0, LocalePhoneNumber_1.formatPhoneNumber)(email),
                        type: CONST_1.default.ICON_TYPE_AVATAR,
                        id: personalDetail?.accountID,
                    },
                ],
                keyForList: email,
                reportID: '',
                isDisabled: true,
            });
            list.push({ ...option, rightElement });
        });
        return (0, OptionsListUtils_1.sortAlphabetically)(list, 'text', localeCompare);
    }, [deriveStatus, localeCompare, policy?.employeeList, translate, isOffline, styles.ml3]);
    const applyTabStatusFilter = (0, react_1.useCallback)((tab, data) => {
        if (tab === CONST_1.default.TAB.RECEIPT_PARTNERS.ALL) {
            return data;
        }
        if (tab === CONST_1.default.TAB.RECEIPT_PARTNERS.LINKED) {
            return data.filter((m) => {
                const status = deriveStatus(m.login ?? '');
                return (status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED ||
                    status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.LINKED_PENDING_APPROVAL ||
                    status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.SUSPENDED);
            });
        }
        // OUTSTANDING
        return data.filter((m) => {
            const email = m.login ?? '';
            const status = deriveStatus(email);
            return (status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.CREATED ||
                status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.INVITED ||
                status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.DELETED ||
                status === CONST_1.default.POLICY.RECEIPT_PARTNERS.UBER_EMPLOYEE_STATUS.NONE);
        });
    }, [deriveStatus]);
    const getMembersForTabWithoutSearch = (0, react_1.useCallback)((tab) => applyTabStatusFilter(tab, members), [applyTabStatusFilter, members]);
    const filterMembers = (0, react_1.useCallback)((tab) => {
        const { debouncedSearchTerm } = getSearchStateForTab(tab);
        const search = debouncedSearchTerm.trim().toLowerCase();
        let data = members;
        if (search) {
            data = (0, tokenizedSearch_1.default)(members, search, (m) => [m.text ?? '', m.alternateText ?? '']);
        }
        return applyTabStatusFilter(tab, data);
    }, [applyTabStatusFilter, getSearchStateForTab, members]);
    const buildSections = (0, react_1.useCallback)((data) => [
        {
            title: undefined,
            data,
            shouldShow: true,
        },
    ], []);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.ToddBehindCloud} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.receiptPartners.uber.emptyContent.title')} subtitle={translate('workspace.receiptPartners.uber.emptyContent.subtitle')} subtitleStyle={styles.textSupporting} containerStyle={styles.pb10} contentFitImage="contain"/>), [translate, styles.textSupporting, styles.pb10]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED}>
            <ScreenWrapper_1.default testID={EditInviteReceiptPartnerPolicyPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.receiptPartners.uber.manageInvites')} onBackButtonPress={() => {
            Navigation_1.default.dismissModal();
        }}/>

                <OnyxTabNavigator_1.default id={CONST_1.default.TAB.RECEIPT_PARTNERS.NAVIGATOR_ID} tabBar={TabSelector_1.default} equalWidth>
                    {TAB_NAMES.map((tabName) => (<OnyxTabNavigator_1.TopTab.Screen key={tabName} name={tabName}>
                            {() => {
                const { searchTerm, debouncedSearchTerm, setSearchTerm } = getSearchStateForTab(tabName);
                const filteredMembers = filterMembers(tabName);
                const baseTabMembersCount = getMembersForTabWithoutSearch(tabName).length;
                const shouldShowListEmptyContent = baseTabMembersCount < CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
                const shouldShowTextInput = !shouldShowListEmptyContent;
                // Determine header message for search results
                const searchValue = debouncedSearchTerm.trim().toLowerCase();
                let currentHeaderMessage = (0, OptionsListUtils_1.getHeaderMessage)(members.length !== 0, false, searchValue);
                if (filteredMembers.length === 0 && searchValue) {
                    currentHeaderMessage = translate('common.noResultsFound');
                }
                return (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                        <SelectionList_1.default ListItem={UserListItem_1.default} onSelectRow={() => { }} listItemWrapperStyle={styles.cursorDefault} addBottomSafeAreaPadding shouldShowTextInput={shouldShowTextInput} textInputLabel={shouldShowTextInput ? translate('common.search') : undefined} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={currentHeaderMessage} sections={buildSections(filteredMembers)} listEmptyContent={listEmptyContent} shouldShowListEmptyContent={shouldShowListEmptyContent} sectionListStyle={styles.pt3}/>
                                    </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>);
            }}
                        </OnyxTabNavigator_1.TopTab.Screen>))}
                </OnyxTabNavigator_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
EditInviteReceiptPartnerPolicyPage.displayName = 'EditInviteReceiptPartnerPolicyPage';
exports.default = EditInviteReceiptPartnerPolicyPage;
