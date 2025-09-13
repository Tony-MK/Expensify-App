"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AutoUpdateTime_1 = require("@components/AutoUpdateTime");
const Avatar_1 = require("@components/Avatar");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PressableWithoutFocus_1 = require("@components/Pressable/PressableWithoutFocus");
const PromotedActionsBar_1 = require("@components/PromotedActionsBar");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const UserUtils_1 = require("@libs/UserUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Link_1 = require("@userActions/Link");
const PersonalDetails_1 = require("@userActions/PersonalDetails");
const Report_1 = require("@userActions/Report");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
/**
 * This function narrows down the data from Onyx to just the properties that we want to trigger a re-render of the component. This helps minimize re-rendering
 * and makes the entire component more performant because it's not re-rendering when a bunch of properties change which aren't ever used in the UI.
 */
const chatReportSelector = (report) => report && {
    reportID: report.reportID,
    participants: report.participants,
    parentReportID: report.parentReportID,
    parentReportActionID: report.parentReportActionID,
    type: report.type,
    chatType: report.chatType,
};
function ProfilePage({ route }) {
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { selector: (c) => (0, mapOnyxCollectionItems_1.default)(c, chatReportSelector), canBeMissing: true });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: true });
    const [personalDetailsMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_METADATA, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [isDebugModeEnabled = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, { canBeMissing: true });
    const guideCalendarLink = account?.guideDetails?.calendarLink ?? '';
    const accountID = Number(route.params?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
    const isCurrentUser = session?.accountID === accountID;
    const reportKey = (0, react_1.useMemo)(() => {
        const reportID = isCurrentUser ? (0, ReportUtils_1.findSelfDMReportID)() : (0, ReportUtils_1.getChatByParticipants)(session?.accountID ? [accountID, session.accountID] : [], reports)?.reportID;
        if ((0, Session_1.isAnonymousUser)() || !reportID) {
            return `${ONYXKEYS_1.default.COLLECTION.REPORT}0`;
        }
        return `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`;
    }, [accountID, isCurrentUser, reports, session]);
    const [report] = (0, useOnyx_1.default)(reportKey, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const isValidAccountID = (0, ValidationUtils_1.isValidAccountRoute)(accountID);
    const loginParams = route.params?.login;
    const details = (0, react_1.useMemo)(() => {
        // Check if we have the personal details already in Onyx
        if (personalDetails?.[accountID]) {
            return personalDetails?.[accountID] ?? undefined;
        }
        // Check if we have the login param
        if (!loginParams) {
            return isValidAccountID ? undefined : { accountID: 0 };
        }
        // Look up the personal details by login
        const foundDetails = Object.values(personalDetails ?? {}).find((personalDetail) => personalDetail?.login === loginParams?.toLowerCase());
        if (foundDetails) {
            return foundDetails;
        }
        // If we don't have the personal details in Onyx, we can create an optimistic account
        const optimisticAccountID = (0, UserUtils_1.generateAccountID)(loginParams);
        return { accountID: optimisticAccountID, login: loginParams, displayName: loginParams };
    }, [personalDetails, accountID, loginParams, isValidAccountID]);
    const displayName = formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(details, undefined, undefined, isCurrentUser, translate('common.you').toLowerCase()));
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const fallbackIcon = details?.fallbackIcon ?? '';
    const login = details?.login ?? '';
    const timezone = details?.timezone;
    const reportRecipient = personalDetails?.[accountID];
    const isParticipantValidated = reportRecipient?.validated ?? false;
    // If we have a reportID param this means that we
    // arrived here via the ParticipantsPage and should be allowed to navigate back to it
    const shouldShowLocalTime = !(0, ReportUtils_1.hasAutomatedExpensifyAccountIDs)([accountID]) && !(0, EmptyObject_1.isEmptyObject)(timezone) && isParticipantValidated;
    let pronouns = details?.pronouns ?? '';
    if (pronouns?.startsWith(CONST_1.default.PRONOUNS.PREFIX)) {
        const localeKey = pronouns.replace(CONST_1.default.PRONOUNS.PREFIX, '');
        pronouns = translate(`pronouns.${localeKey}`);
    }
    const isSMSLogin = expensify_common_1.Str.isSMSLogin(login);
    const phoneNumber = (0, PersonalDetailsUtils_1.getPhoneNumber)(details);
    const hasAvatar = !!details?.avatar;
    const isLoading = !!personalDetailsMetadata?.[accountID]?.isLoading || (0, EmptyObject_1.isEmptyObject)(details);
    const shouldShowBlockingView = (!isValidAccountID && !isLoading) || CONST_1.default.RESTRICTED_ACCOUNT_IDS.includes(accountID);
    const statusEmojiCode = details?.status?.emojiCode ?? '';
    const statusText = details?.status?.text ?? '';
    const hasStatus = !!statusEmojiCode;
    const statusContent = `${statusEmojiCode}  ${statusText}`;
    const navigateBackTo = route?.params?.backTo;
    const notificationPreferenceValue = (0, ReportUtils_1.getReportNotificationPreference)(report);
    const shouldShowNotificationPreference = !(0, EmptyObject_1.isEmptyObject)(report) && !isCurrentUser && !(0, ReportUtils_1.isHiddenForCurrentUser)(notificationPreferenceValue);
    const notificationPreference = shouldShowNotificationPreference
        ? translate(`notificationPreferencesPage.notificationPreferences.${notificationPreferenceValue}`)
        : '';
    const isConcierge = (0, ReportUtils_1.isConciergeChatReport)(report);
    // eslint-disable-next-line rulesdir/prefer-early-return
    (0, react_1.useEffect)(() => {
        // Concierge's profile page information is already available in CONST.ts
        if ((0, ValidationUtils_1.isValidAccountRoute)(accountID) && !loginParams && !isConcierge) {
            (0, PersonalDetails_1.openPublicProfilePage)(accountID);
        }
    }, [accountID, loginParams, isConcierge]);
    const promotedActions = (0, react_1.useMemo)(() => {
        const result = [];
        if (report) {
            result.push(PromotedActionsBar_1.PromotedActions.pin(report));
        }
        // If it's a self DM, we only want to show the Message button if the self DM report exists because we don't want to optimistically create a report for self DM
        if ((!isCurrentUser || report) && !(0, Session_1.isAnonymousUser)()) {
            result.push(PromotedActionsBar_1.PromotedActions.message({ reportID: report?.reportID, accountID, login: loginParams }));
        }
        return result;
    }, [accountID, isCurrentUser, loginParams, report]);
    return (<ScreenWrapper_1.default testID={ProfilePage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={shouldShowBlockingView}>
                <HeaderWithBackButton_1.default title={translate('common.profile')} onBackButtonPress={() => Navigation_1.default.goBack(navigateBackTo)}/>
                <react_native_1.View style={[styles.containerWithSpaceBetween, styles.pointerEventsBoxNone]}>
                    <ScrollView_1.default>
                        <react_native_1.View style={[styles.avatarSectionWrapper, styles.pb0]}>
                            <PressableWithoutFocus_1.default style={[styles.noOutline, styles.mb4]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.PROFILE_AVATAR.getRoute(accountID, Navigation_1.default.getActiveRoute()))} accessibilityLabel={translate('common.profile')} accessibilityRole={CONST_1.default.ROLE.BUTTON} disabled={!hasAvatar}>
                                <OfflineWithFeedback_1.default pendingAction={details?.pendingFields?.avatar}>
                                    <Avatar_1.default containerStyles={[styles.avatarXLarge]} imageStyles={[styles.avatarXLarge]} source={details?.avatar} avatarID={accountID} type={CONST_1.default.ICON_TYPE_AVATAR} size={CONST_1.default.AVATAR_SIZE.X_LARGE} fallbackIcon={fallbackIcon}/>
                                </OfflineWithFeedback_1.default>
                            </PressableWithoutFocus_1.default>
                            {!!displayName && (<Text_1.default style={[styles.textHeadline, styles.pre, styles.mb8, styles.w100, styles.textAlignCenter]} numberOfLines={1}>
                                    {displayName}
                                </Text_1.default>)}
                            <PromotedActionsBar_1.default promotedActions={promotedActions} containerStyle={[styles.ph0, styles.mb8]}/>
                            {hasStatus && (<react_native_1.View style={[styles.detailsPageSectionContainer, styles.w100]}>
                                    <MenuItemWithTopDescription_1.default style={[styles.ph0]} title={statusContent} description={translate('statusPage.status')} interactive={false}/>
                                </react_native_1.View>)}

                            {/* Don't display email if current user is anonymous */}
                            {!(isCurrentUser && (0, Session_1.isAnonymousUser)()) && login ? (<react_native_1.View style={[styles.w100, styles.detailsPageSectionContainer]}>
                                    <MenuItemWithTopDescription_1.default style={[styles.ph0]} title={isSMSLogin ? formatPhoneNumber(phoneNumber ?? '') : login} copyValue={isSMSLogin ? formatPhoneNumber(phoneNumber ?? '') : login} description={translate(isSMSLogin ? 'common.phoneNumber' : 'common.email')} interactive={false} copyable/>
                                </react_native_1.View>) : null}
                            {pronouns ? (<react_native_1.View style={[styles.w100, styles.detailsPageSectionContainer]}>
                                    <MenuItemWithTopDescription_1.default style={[styles.ph0]} title={pronouns} description={translate('profilePage.preferredPronouns')} interactive={false}/>
                                </react_native_1.View>) : null}
                            {shouldShowLocalTime && <AutoUpdateTime_1.default timezone={timezone}/>}
                        </react_native_1.View>
                        {isCurrentUser && (<MenuItem_1.default shouldShowRightIcon title={translate('common.editYourProfile')} icon={Expensicons.Pencil} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_PROFILE.getRoute(Navigation_1.default.getActiveRoute()))}/>)}
                        {shouldShowNotificationPreference && (<MenuItemWithTopDescription_1.default shouldShowRightIcon title={notificationPreference} description={translate('notificationPreferencesPage.label')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_SETTINGS_NOTIFICATION_PREFERENCES.getRoute(report.reportID, navigateBackTo))}/>)}
                        {!(0, EmptyObject_1.isEmptyObject)(report) && !!report.reportID && !isCurrentUser && (<MenuItem_1.default title={`${translate('privateNotes.title')}`} titleStyle={styles.flex1} icon={Expensicons.Pencil} onPress={() => (0, ReportUtils_1.navigateToPrivateNotes)(report, session, navigateBackTo)} wrapperStyle={styles.breakAll} shouldShowRightIcon brickRoadIndicator={(0, Report_1.hasErrorInPrivateNotes)(report) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>)}
                        {isConcierge && !!guideCalendarLink && (<MenuItem_1.default title={translate('videoChatButtonAndMenu.tooltip')} icon={Expensicons.Phone} isAnonymousAction={false} onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => {
                (0, Link_1.openExternalLink)(guideCalendarLink);
            })}/>)}
                        {!!report?.reportID && !!isDebugModeEnabled && (<MenuItem_1.default title={translate('debug.debug')} icon={Expensicons.Bug} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.DEBUG_REPORT.getRoute(report.reportID))}/>)}
                    </ScrollView_1.default>
                    {!hasAvatar && isLoading && <FullscreenLoadingIndicator_1.default style={styles.flex1}/>}
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
ProfilePage.displayName = 'ProfilePage';
exports.default = ProfilePage;
