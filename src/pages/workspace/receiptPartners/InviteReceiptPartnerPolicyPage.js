"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const Text_1 = require("@components/Text");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function InviteReceiptPartnerPolicyPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)([]);
    const [isInvitationSent, setIsInvitationSent] = (0, react_1.useState)(false);
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const policyID = route.params?.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const shouldShowTextInput = policy?.employeeList && Object.keys(policy.employeeList).length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    const textInputLabel = shouldShowTextInput ? translate('common.search') : undefined;
    const workspaceMembers = (0, react_1.useMemo)(() => {
        let membersList = [];
        if (!policy?.employeeList) {
            return membersList;
        }
        Object.entries(policy.employeeList).forEach(([email, policyEmployee]) => {
            if ((0, PolicyUtils_1.isDeletedPolicyEmployee)(policyEmployee, isOffline)) {
                return;
            }
            const personalDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email);
            if (personalDetail) {
                const memberForList = (0, OptionsListUtils_1.formatMemberForList)({
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
                    reportID: '',
                    keyForList: email,
                    isSelected: true,
                });
                membersList.push(memberForList);
            }
        });
        membersList = (0, OptionsListUtils_1.sortAlphabetically)(membersList, 'text', localeCompare);
        return membersList;
    }, [isOffline, policy?.employeeList, localeCompare]);
    const sections = (0, react_1.useMemo)(() => {
        if (workspaceMembers.length === 0) {
            return [];
        }
        let membersToDisplay = workspaceMembers;
        // Apply search filter if there's a search term
        if (debouncedSearchTerm) {
            const searchValue = (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode).toLowerCase();
            membersToDisplay = (0, tokenizedSearch_1.default)(workspaceMembers, searchValue, (option) => [option.text ?? '', option.alternateText ?? '']);
        }
        // Filter to show selected members first, then apply search filter to selected members
        let filterSelectedOptions = selectedOptions;
        if (debouncedSearchTerm !== '') {
            const searchValue = (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode).toLowerCase();
            filterSelectedOptions = selectedOptions.filter((option) => {
                const isPartOfSearchTerm = !!option.text?.toLowerCase().includes(searchValue) || !!option.login?.toLowerCase().includes(searchValue);
                return isPartOfSearchTerm;
            });
        }
        // Combine selected members with unselected members
        const selectedLogins = selectedOptions.map(({ login }) => login);
        const unselectedMembers = membersToDisplay.filter(({ login }) => !selectedLogins.includes(login));
        const allMembersWithState = [];
        filterSelectedOptions.forEach((member) => {
            allMembersWithState.push({ ...member, isSelected: true });
        });
        unselectedMembers.forEach((member) => {
            allMembersWithState.push({ ...member, isSelected: false });
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
    (0, react_1.useEffect)(() => {
        if (workspaceMembers.length === 0) {
            return;
        }
        setSelectedOptions((prev) => {
            if (prev.length > 0) {
                return prev;
            }
            return workspaceMembers.map((member) => ({ ...member, isSelected: true }));
        });
    }, [workspaceMembers]);
    const toggleOption = (0, react_1.useCallback)((option) => {
        (0, Policy_1.clearErrors)(policyID);
        const isOptionInList = selectedOptions.some((selectedOption) => selectedOption.login === option.login);
        let newSelectedOptions;
        if (isOptionInList) {
            newSelectedOptions = selectedOptions.filter((selectedOption) => selectedOption.login !== option.login);
        }
        else {
            newSelectedOptions = [...selectedOptions, { ...option, isSelected: true }];
        }
        setSelectedOptions(newSelectedOptions);
    }, [selectedOptions, policyID]);
    const headerMessage = (0, react_1.useMemo)(() => {
        const searchValue = debouncedSearchTerm.trim().toLowerCase();
        return (0, OptionsListUtils_1.getHeaderMessage)(sections?.at(0)?.data.length !== 0, false, searchValue);
    }, [debouncedSearchTerm, sections]);
    const handleConfirm = (0, react_1.useCallback)(() => {
        if (selectedOptions.length === 0) {
            return;
        }
        const emails = selectedOptions.map((member) => member.login).filter(Boolean);
        (0, Policy_1.inviteWorkspaceEmployeesToUber)(policyID, emails);
        setIsInvitationSent(true);
    }, [selectedOptions, policyID]);
    const handleGotIt = (0, react_1.useCallback)(() => {
        Navigation_1.default.dismissModal();
    }, []);
    if (isInvitationSent) {
        return (<ScreenWrapper_1.default testID={InviteReceiptPartnerPolicyPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.receiptPartners.uber.allSet')} onBackButtonPress={() => Navigation_1.default.dismissModal()}/>
                <ConfirmationPage_1.default illustration={Illustrations.ToddInCar} illustrationStyle={styles.uberConfirmationIllustrationContainer} heading={translate('workspace.receiptPartners.uber.readyToRoll')} description={translate('workspace.receiptPartners.uber.takeBusinessRideMessage')} shouldShowButton buttonText={translate('common.buttonConfirm')} onButtonPress={handleGotIt} descriptionStyle={styles.colorMuted}/>
            </ScreenWrapper_1.default>);
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED}>
            <ScreenWrapper_1.default testID={InviteReceiptPartnerPolicyPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.receiptPartners.uber.sendInvites')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <SelectionList_1.default canSelectMultiple textInputLabel={textInputLabel} textInputValue={searchTerm} onChangeText={setSearchTerm} sections={sections} headerContent={<Text_1.default style={[styles.ph5, styles.pb3]}>{translate('workspace.receiptPartners.uber.sendInvitesDescription')}</Text_1.default>} shouldShowTextInputAfterHeader shouldShowListEmptyContent={false} shouldUpdateFocusedIndex shouldShowHeaderMessageAfterHeader headerMessage={headerMessage} ListItem={UserListItem_1.default} shouldUseDefaultRightHandSideCheckmark onSelectRow={toggleOption} showConfirmButton confirmButtonText={translate('workspace.receiptPartners.uber.confirm')} onConfirm={handleConfirm} isConfirmButtonDisabled={selectedOptions.length === 0} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
InviteReceiptPartnerPolicyPage.displayName = 'InviteReceiptPartnerPolicyPage';
exports.default = InviteReceiptPartnerPolicyPage;
