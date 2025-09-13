"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Badge_1 = require("@components/Badge");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Button_1 = require("@components/Button");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const Text_1 = require("@components/Text");
const useFilteredSelection_1 = require("@hooks/useFilteredSelection");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchBackPress_1 = require("@hooks/useSearchBackPress");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const Report_1 = require("@libs/actions/Report");
const RoomMembersUserSearchPhrase_1 = require("@libs/actions/RoomMembersUserSearchPhrase");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const StringUtils_1 = require("@libs/StringUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
function ReportParticipantsPage({ report, route }) {
    const backTo = route.params.backTo;
    const [removeMembersConfirmModalVisible, setRemoveMembersConfirmModalVisible] = (0, react_1.useState)(false);
    const { translate, formatPhoneNumber, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use the selection mode only on small screens
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const selectionListRef = (0, react_1.useRef)(null);
    const textInputRef = (0, react_1.useRef)(null);
    const [userSearchPhrase] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ROOM_MEMBERS_USER_SEARCH_PHRASE, { canBeMissing: true });
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const [reportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`, { canBeMissing: false });
    const [reportAttributes] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { selector: (attributes) => attributes?.reports, canBeMissing: false });
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const currentUserAccountID = Number(session?.accountID);
    const isCurrentUserAdmin = (0, ReportUtils_1.isGroupChatAdmin)(report, currentUserAccountID);
    const isGroupChat = (0, react_1.useMemo)(() => (0, ReportUtils_1.isGroupChat)(report), [report]);
    const isFocused = (0, native_1.useIsFocused)();
    const { isOffline } = (0, useNetwork_1.default)();
    const canSelectMultiple = isGroupChat && isCurrentUserAdmin && (isSmallScreenWidth ? isMobileSelectionModeEnabled : true);
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const { chatParticipants, personalDetailsParticipants } = (0, react_1.useMemo)(() => (0, ReportUtils_1.getReportPersonalDetailsParticipants)(report, personalDetails, reportMetadata), [report, personalDetails, reportMetadata]);
    const filterParticipants = (0, react_1.useCallback)((participant) => {
        if (!participant) {
            return false;
        }
        const isInParticipants = chatParticipants.includes(participant.accountID);
        const pendingChatMember = reportMetadata?.pendingChatMembers?.find((member) => member.accountID === participant.accountID.toString());
        const isPendingDelete = pendingChatMember?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
        return isInParticipants && !isPendingDelete;
    }, [chatParticipants, reportMetadata?.pendingChatMembers]);
    const [selectedMembers, setSelectedMembers] = (0, useFilteredSelection_1.default)(personalDetailsParticipants, filterParticipants);
    const pendingChatMembers = reportMetadata?.pendingChatMembers;
    const reportParticipants = report?.participants;
    // Get the active chat members by filtering out the pending members with delete action
    const activeParticipants = chatParticipants.filter((accountID) => {
        const pendingMember = pendingChatMembers?.findLast((member) => member.accountID === accountID.toString());
        if (!personalDetails?.[accountID]) {
            return false;
        }
        // When offline, we want to include the pending members with delete action as they are displayed in the list as well
        return !pendingMember || isOffline || pendingMember.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
    });
    // Include the search bar when there are 8 or more active members in the selection list
    const shouldShowTextInput = activeParticipants.length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        if (shouldShowTextInput) {
            setSearchValue(userSearchPhrase ?? '');
        }
        else {
            (0, RoomMembersUserSearchPhrase_1.clearUserSearchPhrase)();
            setSearchValue('');
        }
    }, [isFocused, setSearchValue, shouldShowTextInput, userSearchPhrase]);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => setSelectedMembers([]),
        onNavigationCallBack: () => {
            if (!report) {
                return;
            }
            setSearchValue('');
            Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report.reportID, backTo));
        },
    });
    const getParticipants = () => {
        let result = [];
        chatParticipants.forEach((accountID) => {
            const role = reportParticipants?.[accountID].role;
            const details = personalDetails?.[accountID];
            // If search value is provided, filter out members that don't match the search value
            if (!details || (searchValue.trim() && !(0, OptionsListUtils_1.isSearchStringMatchUserDetails)(details, searchValue))) {
                return;
            }
            const pendingChatMember = pendingChatMembers?.findLast((member) => member.accountID === accountID.toString());
            const isSelected = selectedMembers.includes(accountID) && canSelectMultiple;
            const isAdmin = role === CONST_1.default.REPORT.ROLE.ADMIN;
            let roleBadge = null;
            if (isAdmin) {
                roleBadge = <Badge_1.default text={translate('common.admin')}/>;
            }
            const pendingAction = pendingChatMember?.pendingAction ?? reportParticipants?.[accountID]?.pendingAction;
            result.push({
                keyForList: `${accountID}`,
                accountID,
                isSelected,
                isDisabledCheckbox: accountID === currentUserAccountID,
                isDisabled: pendingChatMember?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || details?.isOptimisticPersonalDetail,
                text: formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(details)),
                alternateText: formatPhoneNumber(details?.login ?? ''),
                rightElement: roleBadge,
                pendingAction,
                icons: [
                    {
                        source: details?.avatar ?? Expensicons_1.FallbackAvatar,
                        name: formatPhoneNumber(details?.login ?? ''),
                        type: CONST_1.default.ICON_TYPE_AVATAR,
                        id: accountID,
                    },
                ],
            });
        });
        result = result.sort((a, b) => localeCompare((a.text ?? '').toLowerCase(), (b.text ?? '').toLowerCase()));
        return result;
    };
    const participants = getParticipants();
    /**
     * Add user from the selectedMembers list
     */
    const addUser = (0, react_1.useCallback)((accountID) => setSelectedMembers((prevSelected) => [...prevSelected, accountID]), [setSelectedMembers]);
    /**
     * Add or remove all users passed from the selectedEmployees list
     */
    const toggleAllUsers = (memberList) => {
        const enabledAccounts = memberList.filter((member) => !member.isDisabled && !member.isDisabledCheckbox);
        const someSelected = enabledAccounts.some((member) => selectedMembers.includes(member.accountID));
        if (someSelected) {
            setSelectedMembers([]);
        }
        else {
            const everyAccountId = enabledAccounts.map((member) => member.accountID);
            setSelectedMembers(everyAccountId);
        }
    };
    /**
     * Remove user from the selectedMembers list
     */
    const removeUser = (0, react_1.useCallback)((accountID) => {
        setSelectedMembers((prevSelected) => prevSelected.filter((id) => id !== accountID));
    }, [setSelectedMembers]);
    /**
     * Open the modal to invite a user
     */
    const inviteUser = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_PARTICIPANTS_INVITE.getRoute(report.reportID, backTo));
    }, [report, backTo]);
    /**
     * Remove selected users from the workspace
     * Please see https://github.com/Expensify/App/blob/main/README.md#Security for more details
     */
    const removeUsers = () => {
        // Remove the admin from the list
        const accountIDsToRemove = selectedMembers.filter((id) => id !== currentUserAccountID);
        (0, Report_1.removeFromGroupChat)(report.reportID, accountIDsToRemove);
        setSearchValue('');
        setRemoveMembersConfirmModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedMembers([]);
            (0, RoomMembersUserSearchPhrase_1.clearUserSearchPhrase)();
        });
    };
    const changeUserRole = (0, react_1.useCallback)((role) => {
        const accountIDsToUpdate = selectedMembers.filter((id) => report.participants?.[id].role !== role);
        (0, Report_1.updateGroupChatMemberRoles)(report.reportID, accountIDsToUpdate, role);
        setSelectedMembers([]);
    }, [report, selectedMembers, setSelectedMembers]);
    /**
     * Toggle user from the selectedMembers list
     */
    const toggleUser = (0, react_1.useCallback)((user) => {
        if (user.accountID === currentUserAccountID) {
            return;
        }
        // Add or remove the user if the checkbox is enabled
        if (selectedMembers.includes(user.accountID)) {
            removeUser(user.accountID);
        }
        else {
            addUser(user.accountID);
        }
    }, [selectedMembers, addUser, removeUser, currentUserAccountID]);
    const customListHeader = (0, react_1.useMemo)(() => {
        const header = (<react_native_1.View style={[styles.flex1, styles.flexRow, styles.justifyContentBetween]}>
                <react_native_1.View>
                    <Text_1.default style={[styles.textMicroSupporting, canSelectMultiple ? styles.ml3 : styles.ml0]}>{translate('common.member')}</Text_1.default>
                </react_native_1.View>
                {isGroupChat && (<react_native_1.View style={[StyleUtils.getMinimumWidth(60)]}>
                        <Text_1.default style={[styles.textMicroSupporting, styles.textAlignCenter]}>{translate('common.role')}</Text_1.default>
                    </react_native_1.View>)}
            </react_native_1.View>);
        if (canSelectMultiple) {
            return header;
        }
        return <react_native_1.View style={[styles.peopleRow, styles.userSelectNone, styles.ph9, styles.pb5, shouldShowTextInput ? styles.mt3 : styles.mt0]}>{header}</react_native_1.View>;
    }, [styles, translate, isGroupChat, shouldShowTextInput, StyleUtils, canSelectMultiple]);
    const bulkActionsButtonOptions = (0, react_1.useMemo)(() => {
        const options = [
            {
                text: translate('workspace.people.removeMembersTitle', { count: selectedMembers.length }),
                value: CONST_1.default.POLICY.MEMBERS_BULK_ACTION_TYPES.REMOVE,
                icon: Expensicons_1.RemoveMembers,
                onSelected: () => setRemoveMembersConfirmModalVisible(true),
            },
        ];
        const isAtLeastOneAdminSelected = selectedMembers.some((accountId) => report.participants?.[accountId]?.role === CONST_1.default.REPORT.ROLE.ADMIN);
        if (isAtLeastOneAdminSelected) {
            options.push({
                text: translate('workspace.people.makeMember'),
                value: CONST_1.default.POLICY.MEMBERS_BULK_ACTION_TYPES.MAKE_MEMBER,
                icon: Expensicons_1.User,
                onSelected: () => changeUserRole(CONST_1.default.REPORT.ROLE.MEMBER),
            });
        }
        const isAtLeastOneMemberSelected = selectedMembers.some((accountId) => report.participants?.[accountId]?.role === CONST_1.default.REPORT.ROLE.MEMBER);
        if (isAtLeastOneMemberSelected) {
            options.push({
                text: translate('workspace.people.makeAdmin'),
                value: CONST_1.default.POLICY.MEMBERS_BULK_ACTION_TYPES.MAKE_ADMIN,
                icon: Expensicons_1.MakeAdmin,
                onSelected: () => changeUserRole(CONST_1.default.REPORT.ROLE.ADMIN),
            });
        }
        return options;
    }, [changeUserRole, translate, setRemoveMembersConfirmModalVisible, selectedMembers, report.participants]);
    const headerButtons = (0, react_1.useMemo)(() => {
        if (!isGroupChat) {
            return;
        }
        return (<react_native_1.View style={styles.w100}>
                {(isSmallScreenWidth ? canSelectMultiple : selectedMembers.length > 0) ? (<ButtonWithDropdownMenu_1.default shouldAlwaysShowDropdownMenu pressOnEnter customText={translate('workspace.common.selected', { count: selectedMembers.length })} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} onPress={() => null} isSplitButton={false} options={bulkActionsButtonOptions} style={[shouldUseNarrowLayout && styles.flexGrow1]} isDisabled={!selectedMembers.length}/>) : (<Button_1.default success onPress={inviteUser} text={translate('workspace.invite.member')} icon={Expensicons_1.Plus} innerStyles={[shouldUseNarrowLayout && styles.alignItemsCenter]} style={[shouldUseNarrowLayout && styles.flexGrow1]}/>)}
            </react_native_1.View>);
    }, [bulkActionsButtonOptions, inviteUser, isSmallScreenWidth, selectedMembers, styles, translate, isGroupChat, canSelectMultiple, shouldUseNarrowLayout]);
    /** Opens the member details page */
    const openMemberDetails = (0, react_1.useCallback)((item) => {
        if (isGroupChat && isCurrentUserAdmin) {
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_PARTICIPANTS_DETAILS.getRoute(report.reportID, item.accountID, backTo));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(item.accountID, Navigation_1.default.getActiveRoute()));
    }, [report, isCurrentUserAdmin, isGroupChat, backTo]);
    const headerTitle = (0, react_1.useMemo)(() => {
        if ((0, ReportUtils_1.isChatRoom)(report) || (0, ReportUtils_1.isPolicyExpenseChat)(report) || (0, ReportUtils_1.isChatThread)(report) || (0, ReportUtils_1.isTaskReport)(report) || (0, ReportUtils_1.isMoneyRequestReport)(report) || isGroupChat) {
            return translate('common.members');
        }
        return translate('common.details');
    }, [report, translate, isGroupChat]);
    const selectionModeHeader = isMobileSelectionModeEnabled && isSmallScreenWidth;
    // eslint-disable-next-line rulesdir/no-negated-variables
    const memberNotFoundMessage = isGroupChat
        ? `${translate('roomMembersPage.memberNotFound')} ${translate('roomMembersPage.useInviteButton')}`
        : translate('roomMembersPage.memberNotFound');
    const headerMessage = searchValue.trim() && !participants.length ? memberNotFoundMessage : '';
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} style={[styles.defaultModalContainer]} testID={ReportParticipantsPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!report || (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived) || (0, ReportUtils_1.isSelfDM)(report)}>
                <HeaderWithBackButton_1.default title={selectionModeHeader ? translate('common.selectMultiple') : headerTitle} onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedMembers([]);
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
                return;
            }
            if (report) {
                setSearchValue('');
                Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report.reportID, backTo));
            }
        }} subtitle={StringUtils_1.default.lineBreaksToSpaces((0, ReportUtils_1.getReportName)(report, undefined, undefined, undefined, undefined, reportAttributes))}/>
                <react_native_1.View style={[styles.pl5, styles.pr5]}>{headerButtons}</react_native_1.View>
                <ConfirmModal_1.default danger title={translate('workspace.people.removeMembersTitle', { count: selectedMembers.length })} isVisible={removeMembersConfirmModalVisible} onConfirm={removeUsers} onCancel={() => setRemoveMembersConfirmModalVisible(false)} prompt={translate('workspace.people.removeMembersPrompt', {
            count: selectedMembers.length,
            memberName: formatPhoneNumber((0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({ accountIDs: selectedMembers, currentUserAccountID }).at(0)?.displayName ?? ''),
        })} confirmText={translate('common.remove')} cancelText={translate('common.cancel')} onModalHide={() => {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                if (!textInputRef.current) {
                    return;
                }
                textInputRef.current.focus();
            });
        }}/>
                <react_native_1.View style={[styles.w100, isGroupChat ? styles.mt3 : styles.mt0, styles.flex1]}>
                    <SelectionListWithModal_1.default ref={selectionListRef} canSelectMultiple={canSelectMultiple} turnOnSelectionModeOnLongPress={isCurrentUserAdmin && isGroupChat} onTurnOnSelectionMode={(item) => item && toggleUser(item)} sections={[{ data: participants }]} shouldShowTextInput={shouldShowTextInput} textInputLabel={translate('selectionList.findMember')} textInputValue={searchValue} onChangeText={setSearchValue} headerMessage={headerMessage} ListItem={TableListItem_1.default} onSelectRow={openMemberDetails} shouldSingleExecuteRowSelect={!(isGroupChat && isCurrentUserAdmin)} onCheckboxPress={(item) => toggleUser(item)} onSelectAll={() => toggleAllUsers(participants)} showScrollIndicator textInputRef={textInputRef} customListHeader={customListHeader} listHeaderWrapperStyle={[styles.ph9, styles.mt3]}/>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
ReportParticipantsPage.displayName = 'ReportParticipantsPage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportParticipantsPage);
