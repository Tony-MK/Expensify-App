"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Button_1 = require("@components/Button");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TableListItem_1 = require("@components/SelectionList/TableListItem");
const SelectionListWithModal_1 = require("@components/SelectionListWithModal");
const Text_1 = require("@components/Text");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useFilteredSelection_1 = require("@hooks/useFilteredSelection");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchBackPress_1 = require("@hooks/useSearchBackPress");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const RoomMembersUserSearchPhrase_1 = require("@libs/actions/RoomMembersUserSearchPhrase");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const StringUtils_1 = require("@libs/StringUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
function RoomMembersPage({ report, policy }) {
    const route = (0, native_1.useRoute)();
    const styles = (0, useThemeStyles_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [reportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`, { canBeMissing: false });
    const currentUserAccountID = Number(session?.accountID);
    const { formatPhoneNumber, translate, localeCompare } = (0, useLocalize_1.default)();
    const [removeMembersConfirmModalVisible, setRemoveMembersConfirmModalVisible] = (0, react_1.useState)(false);
    const [userSearchPhrase] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ROOM_MEMBERS_USER_SEARCH_PHRASE, { canBeMissing: true });
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const [didLoadRoomMembers, setDidLoadRoomMembers] = (0, react_1.useState)(false);
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const isPolicyExpenseChat = (0, react_1.useMemo)(() => (0, ReportUtils_1.isPolicyExpenseChat)(report), [report]);
    const backTo = route.params.backTo;
    const isReportArchived = (0, useReportIsArchived_1.default)(report.reportID);
    const { chatParticipants: participants, personalDetailsParticipants } = (0, react_1.useMemo)(() => (0, ReportUtils_1.getReportPersonalDetailsParticipants)(report, personalDetails, reportMetadata, true), [report, personalDetails, reportMetadata]);
    const shouldIncludeMember = (0, react_1.useCallback)((participant) => {
        if (!participant) {
            return false;
        }
        const isInParticipants = participants.includes(participant.accountID);
        const pendingChatMember = reportMetadata?.pendingChatMembers?.find((member) => member.accountID === participant.accountID.toString());
        const isPendingDelete = pendingChatMember?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
        // Keep the member only if they're still in the room and not pending removal
        return isInParticipants && !isPendingDelete;
    }, [participants, reportMetadata?.pendingChatMembers]);
    const [selectedMembers, setSelectedMembers] = (0, useFilteredSelection_1.default)(personalDetailsParticipants, shouldIncludeMember);
    const isFocusedScreen = (0, native_1.useIsFocused)();
    const { isOffline } = (0, useNetwork_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use the selection mode only on small screens
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const canSelectMultiple = isSmallScreenWidth ? isMobileSelectionModeEnabled : true;
    /**
     * Get members for the current room
     */
    const getRoomMembers = (0, react_1.useCallback)(() => {
        if (!report) {
            return;
        }
        (0, Report_1.openRoomMembersPage)(report.reportID);
        setDidLoadRoomMembers(true);
    }, [report]);
    (0, react_1.useEffect)(() => {
        (0, RoomMembersUserSearchPhrase_1.clearUserSearchPhrase)();
        getRoomMembers();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    /**
     * Open the modal to invite a user
     */
    const inviteUser = (0, react_1.useCallback)(() => {
        if (!report) {
            return;
        }
        setSearchValue('');
        Navigation_1.default.navigate(ROUTES_1.default.ROOM_INVITE.getRoute(report.reportID, backTo));
    }, [report, setSearchValue, backTo]);
    /**
     * Remove selected users from the room
     * Please see https://github.com/Expensify/App/blob/main/README.md#Security for more details
     */
    const removeUsers = () => {
        if (report) {
            (0, Report_1.removeFromRoom)(report.reportID, selectedMembers);
        }
        setSearchValue('');
        setRemoveMembersConfirmModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setSelectedMembers([]);
            (0, RoomMembersUserSearchPhrase_1.clearUserSearchPhrase)();
        });
    };
    /**
     * Add user from the selectedMembers list
     */
    const addUser = (0, react_1.useCallback)((accountID) => {
        setSelectedMembers((prevSelected) => [...prevSelected, accountID]);
    }, [setSelectedMembers]);
    /**
     * Remove user from the selectedEmployees list
     */
    const removeUser = (0, react_1.useCallback)((accountID) => {
        setSelectedMembers((prevSelected) => prevSelected.filter((id) => id !== accountID));
    }, [setSelectedMembers]);
    /** Toggle user from the selectedMembers list */
    const toggleUser = (0, react_1.useCallback)(({ accountID, pendingAction }) => {
        if (pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || !accountID) {
            return;
        }
        // Add or remove the user if the checkbox is enabled
        if (selectedMembers.includes(accountID)) {
            removeUser(accountID);
        }
        else {
            addUser(accountID);
        }
    }, [selectedMembers, addUser, removeUser]);
    /** Add or remove all users passed from the selectedMembers list */
    const toggleAllUsers = (memberList) => {
        const enabledAccounts = memberList.filter((member) => !member.isDisabled && !member.isDisabledCheckbox);
        const someSelected = enabledAccounts.some((member) => {
            if (!member.accountID) {
                return false;
            }
            return selectedMembers.includes(member.accountID);
        });
        if (someSelected) {
            setSelectedMembers([]);
        }
        else {
            const everyAccountId = enabledAccounts.map((member) => member.accountID).filter((accountID) => !!accountID);
            setSelectedMembers(everyAccountId);
        }
    };
    /** Include the search bar when there are 8 or more active members in the selection list */
    const shouldShowTextInput = (0, react_1.useMemo)(() => {
        // Get the active chat members by filtering out the pending members with delete action
        const activeParticipants = participants.filter((accountID) => {
            const pendingMember = reportMetadata?.pendingChatMembers?.findLast((member) => member.accountID === accountID.toString());
            if (!personalDetails?.[accountID]) {
                return false;
            }
            // When offline, we want to include the pending members with delete action as they are displayed in the list as well
            return !pendingMember || isOffline || pendingMember.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
        });
        return activeParticipants.length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    }, [participants, reportMetadata?.pendingChatMembers, personalDetails, isOffline]);
    (0, react_1.useEffect)(() => {
        if (!isFocusedScreen || !shouldShowTextInput) {
            return;
        }
        setSearchValue(userSearchPhrase ?? '');
    }, [isFocusedScreen, shouldShowTextInput, userSearchPhrase]);
    (0, react_1.useEffect)(() => {
        (0, RoomMembersUserSearchPhrase_1.updateUserSearchPhrase)(searchValue);
    }, [searchValue]);
    (0, react_1.useEffect)(() => {
        if (!isFocusedScreen) {
            return;
        }
        if (shouldShowTextInput) {
            setSearchValue(userSearchPhrase ?? '');
        }
        else {
            (0, RoomMembersUserSearchPhrase_1.clearUserSearchPhrase)();
            setSearchValue('');
        }
    }, [isFocusedScreen, setSearchValue, shouldShowTextInput, userSearchPhrase]);
    (0, useSearchBackPress_1.default)({
        onClearSelection: () => setSelectedMembers([]),
        onNavigationCallBack: () => {
            setSearchValue('');
            Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report.reportID, backTo));
        },
    });
    const data = (0, react_1.useMemo)(() => {
        let result = [];
        participants.forEach((accountID) => {
            const details = personalDetails?.[accountID];
            // If search value is provided, filter out members that don't match the search value
            if (!details || (searchValue.trim() && !(0, OptionsListUtils_1.isSearchStringMatchUserDetails)(details, searchValue))) {
                return;
            }
            const pendingChatMember = reportMetadata?.pendingChatMembers?.findLast((member) => member.accountID === accountID.toString());
            const isAdmin = (0, PolicyUtils_1.isUserPolicyAdmin)(policy, details.login);
            const isDisabled = pendingChatMember?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || details.isOptimisticPersonalDetail;
            const isDisabledCheckbox = (isPolicyExpenseChat && isAdmin) ||
                accountID === session?.accountID ||
                pendingChatMember?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE ||
                details.accountID === report.ownerAccountID;
            result.push({
                keyForList: String(accountID),
                accountID,
                isSelected: selectedMembers.includes(accountID),
                isDisabled,
                isDisabledCheckbox,
                text: formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(details)),
                alternateText: details?.login ? formatPhoneNumber(details.login) : '',
                icons: [
                    {
                        source: details.avatar ?? Expensicons_1.FallbackAvatar,
                        name: details.login ?? '',
                        type: CONST_1.default.ICON_TYPE_AVATAR,
                        id: accountID,
                    },
                ],
                pendingAction: pendingChatMember?.pendingAction,
                errors: pendingChatMember?.errors,
            });
        });
        result = result.sort((value1, value2) => localeCompare(value1.text ?? '', value2.text ?? ''));
        return result;
    }, [
        formatPhoneNumber,
        localeCompare,
        isPolicyExpenseChat,
        participants,
        personalDetails,
        policy,
        report.ownerAccountID,
        reportMetadata?.pendingChatMembers,
        searchValue,
        selectedMembers,
        session?.accountID,
    ]);
    const dismissError = (0, react_1.useCallback)((item) => {
        (0, Report_1.clearAddRoomMemberError)(report.reportID, String(item.accountID));
    }, [report.reportID]);
    const isPolicyEmployee = (0, react_1.useMemo)(() => (0, PolicyUtils_1.isPolicyEmployee)(report.policyID, policy), [report?.policyID, policy]);
    const headerMessage = searchValue.trim() && !data.length ? `${translate('roomMembersPage.memberNotFound')} ${translate('roomMembersPage.useInviteButton')}` : '';
    const bulkActionsButtonOptions = (0, react_1.useMemo)(() => {
        const options = [
            {
                text: translate('workspace.people.removeMembersTitle', { count: selectedMembers.length }),
                value: CONST_1.default.POLICY.MEMBERS_BULK_ACTION_TYPES.REMOVE,
                icon: Expensicons_1.RemoveMembers,
                onSelected: () => setRemoveMembersConfirmModalVisible(true),
            },
        ];
        return options;
    }, [translate, selectedMembers.length]);
    const headerButtons = (0, react_1.useMemo)(() => {
        return (<react_native_1.View style={styles.w100}>
                {(isSmallScreenWidth ? canSelectMultiple : selectedMembers.length > 0) ? (<ButtonWithDropdownMenu_1.default shouldAlwaysShowDropdownMenu pressOnEnter customText={translate('workspace.common.selected', { count: selectedMembers.length })} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} onPress={() => null} options={bulkActionsButtonOptions} isSplitButton={false} style={[shouldUseNarrowLayout && styles.flexGrow1]} isDisabled={!selectedMembers.length}/>) : (<Button_1.default success onPress={inviteUser} text={translate('workspace.invite.member')} icon={Expensicons_1.Plus} innerStyles={[shouldUseNarrowLayout && styles.alignItemsCenter]} style={[shouldUseNarrowLayout && styles.flexGrow1]}/>)}
            </react_native_1.View>);
    }, [bulkActionsButtonOptions, inviteUser, isSmallScreenWidth, selectedMembers, styles, translate, canSelectMultiple, shouldUseNarrowLayout]);
    /** Opens the room member details page */
    const openRoomMemberDetails = (0, react_1.useCallback)((item) => {
        if (!item?.accountID) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.ROOM_MEMBER_DETAILS.getRoute(report.reportID, item?.accountID, backTo));
    }, [report, backTo]);
    const selectionModeHeader = isMobileSelectionModeEnabled && isSmallScreenWidth;
    const customListHeader = (0, react_1.useMemo)(() => {
        const header = (<react_native_1.View style={[styles.flex1, styles.flexRow, styles.justifyContentBetween]}>
                <react_native_1.View>
                    <Text_1.default style={[styles.textMicroSupporting, canSelectMultiple ? styles.ml3 : styles.ml0]}>{translate('common.member')}</Text_1.default>
                </react_native_1.View>
            </react_native_1.View>);
        if (canSelectMultiple) {
            return header;
        }
        return <react_native_1.View style={[styles.peopleRow, styles.userSelectNone, styles.ph9, styles.pb5, styles.mt3]}>{header}</react_native_1.View>;
    }, [styles, translate, canSelectMultiple]);
    let subtitleKey;
    if (!(0, EmptyObject_1.isEmptyObject)(report)) {
        subtitleKey = isReportArchived ? 'roomMembersPage.roomArchived' : 'roomMembersPage.notAuthorized';
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} style={[styles.defaultModalContainer]} testID={RoomMembersPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={(0, EmptyObject_1.isEmptyObject)(report) || isReportArchived || (!(0, ReportUtils_1.isChatThread)(report) && (((0, ReportUtils_1.isUserCreatedPolicyRoom)(report) && !isPolicyEmployee) || (0, ReportUtils_1.isDefaultRoom)(report)))} subtitleKey={subtitleKey} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report.reportID, backTo));
        }}>
                <HeaderWithBackButton_1.default title={selectionModeHeader ? translate('common.selectMultiple') : translate('workspace.common.members')} subtitle={StringUtils_1.default.lineBreaksToSpaces((0, ReportUtils_1.getReportName)(report))} onBackButtonPress={() => {
            if (isMobileSelectionModeEnabled) {
                setSelectedMembers([]);
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
                return;
            }
            setSearchValue('');
            Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report.reportID, backTo));
        }}/>
                <react_native_1.View style={[styles.pl5, styles.pr5]}>{headerButtons}</react_native_1.View>
                <ConfirmModal_1.default danger title={translate('workspace.people.removeMembersTitle', { count: selectedMembers.length })} isVisible={removeMembersConfirmModalVisible} onConfirm={removeUsers} onCancel={() => setRemoveMembersConfirmModalVisible(false)} prompt={translate('roomMembersPage.removeMembersPrompt', {
            count: selectedMembers.length,
            memberName: formatPhoneNumber((0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({ accountIDs: selectedMembers, currentUserAccountID }).at(0)?.displayName ?? ''),
        })} confirmText={translate('common.remove')} cancelText={translate('common.cancel')}/>
                <react_native_1.View style={[styles.w100, styles.mt3, styles.flex1]}>
                    <SelectionListWithModal_1.default canSelectMultiple={canSelectMultiple} sections={[{ data, isDisabled: false }]} shouldShowTextInput={shouldShowTextInput} textInputLabel={translate('selectionList.findMember')} disableKeyboardShortcuts={removeMembersConfirmModalVisible} textInputValue={searchValue} onChangeText={setSearchValue} headerMessage={headerMessage} turnOnSelectionModeOnLongPress onTurnOnSelectionMode={(item) => item && toggleUser(item)} onCheckboxPress={(item) => toggleUser(item)} onSelectRow={openRoomMemberDetails} onSelectAll={() => toggleAllUsers(data)} showLoadingPlaceholder={!(0, OptionsListUtils_1.isPersonalDetailsReady)(personalDetails) || !didLoadRoomMembers} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} listHeaderWrapperStyle={[styles.ph9, styles.mt3]} customListHeader={customListHeader} ListItem={TableListItem_1.default} onDismissError={dismissError}/>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
RoomMembersPage.displayName = 'RoomMembersPage';
exports.default = (0, withReportOrNotFound_1.default)()((0, withCurrentUserPersonalDetails_1.default)(RoomMembersPage));
