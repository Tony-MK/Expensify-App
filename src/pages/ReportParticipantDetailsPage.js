"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report = require("@libs/actions/Report");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const ReportUtils = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NotFoundPage_1 = require("./ErrorPage/NotFoundPage");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
function ReportParticipantDetails({ report, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { formatPhoneNumber, translate } = (0, useLocalize_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST);
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [isRemoveMemberConfirmModalVisible, setIsRemoveMemberConfirmModalVisible] = react_1.default.useState(false);
    const accountID = Number(route.params.accountID);
    const backTo = ROUTES_1.default.REPORT_PARTICIPANTS.getRoute(report?.reportID ?? '-1', route.params.backTo);
    const member = report?.participants?.[accountID];
    const details = personalDetails?.[accountID] ?? {};
    const fallbackIcon = details.fallbackIcon ?? '';
    const displayName = formatPhoneNumber(PersonalDetailsUtils.getDisplayNameOrDefault(details));
    const isCurrentUserAdmin = ReportUtils.isGroupChatAdmin(report, currentUserPersonalDetails?.accountID);
    const isSelectedMemberCurrentUser = accountID === currentUserPersonalDetails?.accountID;
    const removeUser = (0, react_1.useCallback)(() => {
        setIsRemoveMemberConfirmModalVisible(false);
        Report.removeFromGroupChat(report?.reportID, [accountID]);
        Navigation_1.default.goBack(backTo);
    }, [backTo, report, accountID]);
    const navigateToProfile = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(accountID, Navigation_1.default.getActiveRoute()));
    }, [accountID]);
    const openRoleSelectionModal = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_PARTICIPANTS_ROLE_SELECTION.getRoute(report.reportID, accountID, route.params.backTo));
    }, [accountID, report.reportID, route.params.backTo]);
    if (!member) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ReportParticipantDetails.displayName}>
            <HeaderWithBackButton_1.default title={displayName} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
            <react_native_1.View style={[styles.containerWithSpaceBetween, styles.pointerEventsBoxNone, styles.justifyContentStart]}>
                <react_native_1.View style={[styles.avatarSectionWrapper, styles.pb0]}>
                    <Avatar_1.default containerStyles={[styles.avatarXLarge, styles.mv5, styles.noOutline]} imageStyles={[styles.avatarXLarge]} source={details.avatar} avatarID={accountID} type={CONST_1.default.ICON_TYPE_AVATAR} size={CONST_1.default.AVATAR_SIZE.X_LARGE} fallbackIcon={fallbackIcon}/>
                    {!!(displayName ?? '') && (<Text_1.default style={[styles.textHeadline, styles.pre, styles.mb6, styles.w100, styles.textAlignCenter]} numberOfLines={1}>
                            {displayName}
                        </Text_1.default>)}
                    {isCurrentUserAdmin && (<>
                            <Button_1.default text={translate('workspace.people.removeGroupMemberButtonTitle')} onPress={() => setIsRemoveMemberConfirmModalVisible(true)} isDisabled={isSelectedMemberCurrentUser} icon={Expensicons.RemoveMembers} iconStyles={StyleUtils.getTransformScaleStyle(0.8)} style={styles.mv5}/>
                            <ConfirmModal_1.default danger title={translate('workspace.people.removeGroupMemberButtonTitle')} isVisible={isRemoveMemberConfirmModalVisible} onConfirm={removeUser} onCancel={() => setIsRemoveMemberConfirmModalVisible(false)} prompt={translate('workspace.people.removeMemberPrompt', { memberName: displayName })} confirmText={translate('common.remove')} cancelText={translate('common.cancel')}/>
                        </>)}
                </react_native_1.View>
                <react_native_1.View style={styles.w100}>
                    {isCurrentUserAdmin && (<OfflineWithFeedback_1.default pendingAction={member?.pendingFields?.role ?? null}>
                            <MenuItemWithTopDescription_1.default disabled={isSelectedMemberCurrentUser} title={member?.role === CONST_1.default.REPORT.ROLE.ADMIN ? translate('common.admin') : translate('common.member')} description={translate('common.role')} shouldShowRightIcon onPress={openRoleSelectionModal}/>
                        </OfflineWithFeedback_1.default>)}
                    <MenuItem_1.default title={translate('common.profile')} icon={Expensicons.Info} onPress={navigateToProfile} shouldShowRightIcon/>
                </react_native_1.View>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
ReportParticipantDetails.displayName = 'ReportParticipantDetails';
exports.default = (0, withReportOrNotFound_1.default)()(ReportParticipantDetails);
