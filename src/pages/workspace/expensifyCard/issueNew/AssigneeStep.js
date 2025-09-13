"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const Text_1 = require("@components/Text");
const useCurrencyForExpensifyCard_1 = require("@hooks/useCurrencyForExpensifyCard");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const Navigation_1 = require("@navigation/Navigation");
const Card_1 = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MINIMUM_MEMBER_TO_SHOW_SEARCH = 8;
function AssigneeStep({ policy, stepNames, startStepIndex }) {
    const { translate, formatPhoneNumber, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const policyID = policy?.id;
    const [issueNewCard] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, { canBeMissing: true });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const currency = (0, useCurrencyForExpensifyCard_1.default)({ policyID });
    const isEditing = issueNewCard?.isEditing;
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const submit = (assignee) => {
        const data = {
            assigneeEmail: assignee?.login ?? '',
            currency,
        };
        if (isEditing && issueNewCard?.data?.cardTitle === (0, Card_1.getCardDefaultName)((0, PersonalDetailsUtils_1.getUserNameByEmail)(issueNewCard?.data?.assigneeEmail, 'firstName'))) {
            // If the card title is the default card title, update it with the new assignee's name
            data.cardTitle = (0, Card_1.getCardDefaultName)((0, PersonalDetailsUtils_1.getUserNameByEmail)(assignee?.login ?? '', 'firstName'));
        }
        (0, Card_1.setIssueNewCardStepAndData)({
            step: isEditing ? CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION : CONST_1.default.EXPENSIFY_CARD.STEP.CARD_TYPE,
            data,
            isEditing: false,
            policyID,
        });
    };
    const handleBackButtonPress = () => {
        if (isEditing) {
            (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION, isEditing: false, policyID });
            return;
        }
        Navigation_1.default.goBack();
        (0, Card_1.clearIssueNewCardFlow)(policyID);
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
    }, [isOffline, policy?.employeeList, formatPhoneNumber, localeCompare]);
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
    }, [debouncedSearchTerm, countryCode, membersDetails]);
    const headerMessage = (0, react_1.useMemo)(() => {
        const searchValue = debouncedSearchTerm.trim().toLowerCase();
        return (0, OptionsListUtils_1.getHeaderMessage)(sections[0].data.length !== 0, false, searchValue);
    }, [debouncedSearchTerm, sections]);
    return (<InteractiveStepWrapper_1.default wrapperID={AssigneeStep.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('workspace.card.issueCard')} handleBackButtonPress={handleBackButtonPress} startStepIndex={startStepIndex} stepNames={stepNames} enableEdgeToEdgeBottomSafeAreaPadding>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.card.issueNewCard.whoNeedsCard')}</Text_1.default>
            <SelectionList_1.default textInputLabel={textInputLabel} textInputValue={searchTerm} onChangeText={setSearchTerm} sections={sections} headerMessage={headerMessage} ListItem={UserListItem_1.default} onSelectRow={submit} addBottomSafeAreaPadding/>
        </InteractiveStepWrapper_1.default>);
}
AssigneeStep.displayName = 'AssigneeStep';
exports.default = AssigneeStep;
