"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const Expensicons = require("@components/Icon/Expensicons");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const Text_1 = require("@components/Text");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCardsList_1 = require("@hooks/useCardsList");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const Navigation_1 = require("@navigation/Navigation");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MINIMUM_MEMBER_TO_SHOW_SEARCH = 8;
function AssigneeStep({ policy, feed }) {
    const { translate, formatPhoneNumber, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [assignCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ASSIGN_CARD, { canBeMissing: true });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: false });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [list] = (0, useCardsList_1.default)(policy?.id, feed);
    const [cardFeeds] = (0, useCardFeeds_1.default)(policy?.id);
    const filteredCardList = (0, CardUtils_1.getFilteredCardList)(list, cardFeeds?.settings?.oAuthAccountDetails?.[feed], workspaceCardFeeds);
    const isEditing = assignCard?.isEditing;
    const [selectedMember, setSelectedMember] = (0, react_1.useState)(assignCard?.data?.email ?? '');
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [shouldShowError, setShouldShowError] = (0, react_1.useState)(false);
    const selectMember = (assignee) => {
        react_native_1.Keyboard.dismiss();
        setSelectedMember(assignee.login ?? '');
        setShouldShowError(false);
    };
    const submit = () => {
        let nextStep = CONST_1.default.COMPANY_CARD.STEP.CARD;
        if (selectedMember === assignCard?.data?.email) {
            (0, CompanyCards_1.setAssignCardStepAndData)({
                currentStep: isEditing ? CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION : nextStep,
                isEditing: false,
            });
            return;
        }
        if (!selectedMember) {
            setShouldShowError(true);
            return;
        }
        const personalDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(selectedMember);
        const memberName = personalDetail?.firstName ? personalDetail.firstName : personalDetail?.login;
        const data = {
            email: selectedMember,
            cardName: (0, CardUtils_1.getDefaultCardName)(memberName),
        };
        if ((0, CardUtils_1.hasOnlyOneCardToAssign)(filteredCardList)) {
            nextStep = CONST_1.default.COMPANY_CARD.STEP.TRANSACTION_START_DATE;
            data.cardNumber = Object.keys(filteredCardList).at(0);
            data.encryptedCardNumber = Object.values(filteredCardList).at(0);
        }
        (0, CompanyCards_1.setAssignCardStepAndData)({
            currentStep: isEditing ? CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION : nextStep,
            data,
            isEditing: false,
        });
    };
    const handleBackButtonPress = () => {
        if (isEditing) {
            (0, CompanyCards_1.setAssignCardStepAndData)({
                currentStep: CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION,
                isEditing: false,
            });
            return;
        }
        Navigation_1.default.goBack();
    };
    const shouldShowSearchInput = policy?.employeeList && Object.keys(policy.employeeList).length >= MINIMUM_MEMBER_TO_SHOW_SEARCH;
    const textInputLabel = shouldShowSearchInput ? translate('workspace.card.issueNewCard.findMember') : undefined;
    const membersDetails = (0, react_1.useMemo)(() => {
        let membersList = [];
        if (!policy?.employeeList) {
            return membersList;
        }
        Object.entries(policy.employeeList ?? {}).forEach(([email, policyEmployee]) => {
            if ((0, PolicyUtils_1.isDeletedPolicyEmployee)(policyEmployee, isOffline)) {
                return;
            }
            const personalDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email);
            membersList.push({
                keyForList: email,
                text: personalDetail?.displayName,
                alternateText: email,
                login: email,
                accountID: personalDetail?.accountID,
                isSelected: selectedMember === email,
                icons: [
                    {
                        source: personalDetail?.avatar ?? Expensicons.FallbackAvatar,
                        name: formatPhoneNumber(email),
                        type: CONST_1.default.ICON_TYPE_AVATAR,
                        id: personalDetail?.accountID,
                    },
                ],
            });
        });
        membersList = (0, OptionsListUtils_1.sortAlphabetically)(membersList, 'text', localeCompare);
        return membersList;
    }, [isOffline, policy?.employeeList, selectedMember, formatPhoneNumber, localeCompare]);
    const sections = (0, react_1.useMemo)(() => {
        if (!debouncedSearchTerm) {
            return [
                {
                    data: membersDetails,
                    shouldShow: true,
                },
            ];
        }
        const searchValue = (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode).toLowerCase();
        const filteredOptions = (0, tokenizedSearch_1.default)(membersDetails, searchValue, (option) => [option.text ?? '', option.alternateText ?? '']);
        return [
            {
                title: undefined,
                data: filteredOptions,
                shouldShow: true,
            },
        ];
    }, [membersDetails, debouncedSearchTerm, countryCode]);
    const headerMessage = (0, react_1.useMemo)(() => {
        const searchValue = debouncedSearchTerm.trim().toLowerCase();
        return (0, OptionsListUtils_1.getHeaderMessage)(sections[0].data.length !== 0, false, searchValue);
    }, [debouncedSearchTerm, sections]);
    return (<InteractiveStepWrapper_1.default wrapperID={AssigneeStep.displayName} handleBackButtonPress={handleBackButtonPress} startStepIndex={0} stepNames={CONST_1.default.COMPANY_CARD.STEP_NAMES} headerTitle={translate('workspace.companyCards.assignCard')} enableEdgeToEdgeBottomSafeAreaPadding>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.companyCards.whoNeedsCardAssigned')}</Text_1.default>
            <SelectionList_1.default textInputLabel={textInputLabel} textInputValue={searchTerm} onChangeText={setSearchTerm} sections={sections} headerMessage={headerMessage} ListItem={UserListItem_1.default} onSelectRow={selectMember} initiallyFocusedOptionKey={selectedMember} shouldUpdateFocusedIndex addBottomSafeAreaPadding footerContent={<FormAlertWithSubmitButton_1.default buttonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={submit} isAlertVisible={shouldShowError} containerStyles={[!shouldShowError && styles.mt5]} addButtonBottomPadding={false} message={translate('common.error.pleaseSelectOne')}/>}/>
        </InteractiveStepWrapper_1.default>);
}
AssigneeStep.displayName = 'AssigneeStep';
exports.default = AssigneeStep;
