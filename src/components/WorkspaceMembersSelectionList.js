"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const MemberRightIcon_1 = require("@pages/workspace/MemberRightIcon");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Expensicons_1 = require("./Icon/Expensicons");
const OnyxListItemProvider_1 = require("./OnyxListItemProvider");
const SelectionList_1 = require("./SelectionList");
const InviteMemberListItem_1 = require("./SelectionList/InviteMemberListItem");
function WorkspaceMembersSelectionList({ policyID, selectedApprover, setApprover }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { didScreenTransitionEnd } = (0, useScreenWrapperTransitionStatus_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const policy = (0, usePolicy_1.default)(policyID);
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const sections = (0, react_1.useMemo)(() => {
        const approvers = [];
        if (policy?.employeeList) {
            const availableApprovers = Object.values(policy.employeeList)
                .map((employee) => {
                const email = employee.email;
                if (!email) {
                    return null;
                }
                const policyMemberEmailsToAccountIDs = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList);
                const accountID = Number(policyMemberEmailsToAccountIDs[email] ?? '');
                const { avatar, displayName = email, login } = personalDetails?.[accountID] ?? {};
                return {
                    text: displayName,
                    alternateText: email,
                    keyForList: email,
                    isSelected: selectedApprover === email,
                    login: email,
                    icons: [{ source: avatar ?? Expensicons_1.FallbackAvatar, type: CONST_1.default.ICON_TYPE_AVATAR, name: displayName, id: accountID }],
                    rightElement: (<MemberRightIcon_1.default role={employee.role} owner={policy?.owner} login={login}/>),
                };
            })
                .filter((approver) => !!approver);
            approvers.push(...availableApprovers);
        }
        const filteredApprovers = (0, tokenizedSearch_1.default)(approvers, (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode), (approver) => [approver.text ?? '', approver.login ?? '']);
        return [
            {
                title: undefined,
                data: (0, OptionsListUtils_1.sortAlphabetically)(filteredApprovers, 'text', localeCompare),
                shouldShow: true,
            },
        ];
    }, [policy?.employeeList, policy?.owner, debouncedSearchTerm, countryCode, localeCompare, personalDetails, selectedApprover]);
    const handleOnSelectRow = (approver) => {
        setApprover(approver.login);
    };
    const headerMessage = (0, react_1.useMemo)(() => (searchTerm && !sections.at(0)?.data.length ? translate('common.noResultsFound') : ''), [searchTerm, sections, translate]);
    return (<SelectionList_1.default sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={headerMessage} onSelectRow={handleOnSelectRow} showScrollIndicator showLoadingPlaceholder={!didScreenTransitionEnd} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} addBottomSafeAreaPadding/>);
}
exports.default = WorkspaceMembersSelectionList;
