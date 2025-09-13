"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const CaretWrapper_1 = require("@components/CaretWrapper");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DisplayNames_1 = require("@components/DisplayNames");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const LoadingBar_1 = require("@components/LoadingBar");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const OnboardingHelpDropdownButton_1 = require("@components/OnboardingHelpDropdownButton");
const ParentNavigationSubtitle_1 = require("@components/ParentNavigationSubtitle");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const ReportHeaderSkeletonView_1 = require("@components/ReportHeaderSkeletonView");
const SearchButton_1 = require("@components/Search/SearchRouter/SearchButton");
const HelpButton_1 = require("@components/SidePanel/HelpComponents/HelpButton");
const TaskHeaderActionButton_1 = require("@components/TaskHeaderActionButton");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const useHasTeam2025Pricing_1 = require("@hooks/useHasTeam2025Pricing");
const useLoadingBarVisibility_1 = require("@hooks/useLoadingBarVisibility");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Fullstory_1 = require("@libs/Fullstory");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Parser_1 = require("@libs/Parser");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const EarlyDiscountBanner_1 = require("@pages/settings/Subscription/CardSection/BillingBanner/EarlyDiscountBanner");
const FreeTrial_1 = require("@pages/settings/Subscription/FreeTrial");
const Report_1 = require("@userActions/Report");
const Session_1 = require("@userActions/Session");
const Task_1 = require("@userActions/Task");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function HeaderView({ report, parentReportAction, onNavigationMenuButtonClicked, shouldUseNarrowLayout = false }) {
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const route = (0, native_1.useRoute)();
    const [isDeleteTaskConfirmModalVisible, setIsDeleteTaskConfirmModalVisible] = react_1.default.useState(false);
    const invoiceReceiverPolicyID = report?.invoiceReceiver && 'policyID' in report.invoiceReceiver ? report.invoiceReceiver.policyID : undefined;
    const [invoiceReceiverPolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${invoiceReceiverPolicyID}`, { canBeMissing: true });
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, getNonEmptyStringOnyxID_1.default)(report?.parentReportID) ?? (0, getNonEmptyStringOnyxID_1.default)(report?.reportID)}`, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: true });
    const shouldShowLoadingBar = (0, useLoadingBarVisibility_1.default)();
    const [firstDayFreeTrial] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL, { canBeMissing: true });
    const [lastDayFreeTrial] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`, { canBeMissing: true });
    const [reportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`, { canBeMissing: true });
    const isReportArchived = (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs);
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const isSelfDM = (0, ReportUtils_1.isSelfDM)(report);
    const isGroupChat = (0, ReportUtils_1.isGroupChat)(report) || (0, ReportUtils_1.isDeprecatedGroupDM)(report, isReportArchived);
    const [introSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTRO_SELECTED, { canBeMissing: true });
    const allParticipants = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, false, true, undefined, reportMetadata);
    const shouldAddEllipsis = allParticipants?.length > CONST_1.default.DISPLAY_PARTICIPANTS_LIMIT;
    const participants = allParticipants.slice(0, CONST_1.default.DISPLAY_PARTICIPANTS_LIMIT);
    const isMultipleParticipant = participants.length > 1;
    const participantPersonalDetails = (0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(participants, personalDetails);
    const displayNamesWithTooltips = (0, ReportUtils_1.getDisplayNamesWithTooltips)(participantPersonalDetails, isMultipleParticipant, localeCompare, undefined, isSelfDM);
    const isChatThread = (0, ReportUtils_1.isChatThread)(report);
    const isChatRoom = (0, ReportUtils_1.isChatRoom)(report);
    const isPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(report);
    const isTaskReport = (0, ReportUtils_1.isTaskReport)(report);
    const reportHeaderData = !isTaskReport && !isChatThread && report?.parentReportID ? parentReport : report;
    // Use sorted display names for the title for group chats on native small screen widths
    const title = (0, ReportUtils_1.getReportName)(reportHeaderData, policy, parentReportAction, personalDetails, invoiceReceiverPolicy);
    const isReportHeaderDataArchived = (0, useReportIsArchived_1.default)(reportHeaderData?.reportID);
    const subtitle = (0, ReportUtils_1.getChatRoomSubtitle)(reportHeaderData, false, isReportHeaderDataArchived);
    const isParentReportHeaderDataArchived = (0, useReportIsArchived_1.default)(reportHeaderData?.parentReportID);
    const parentNavigationSubtitleData = (0, ReportUtils_1.getParentNavigationSubtitle)(reportHeaderData, isParentReportHeaderDataArchived);
    const reportDescription = Parser_1.default.htmlToText((0, ReportUtils_1.getReportDescription)(report));
    const policyName = (0, ReportUtils_1.getPolicyName)({ report, returnEmptyIfNotFound: true });
    const policyDescription = (0, ReportUtils_1.getPolicyDescriptionText)(policy);
    const isPersonalExpenseChat = isPolicyExpenseChat && (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const hasTeam2025Pricing = (0, useHasTeam2025Pricing_1.default)();
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const displayNamesFSClass = Fullstory_1.default.getChatFSClass(personalDetails, report);
    const shouldShowSubtitle = () => {
        if (!subtitle) {
            return false;
        }
        if ((0, ReportUtils_1.isInvoiceRoom)(reportHeaderData)) {
            return true;
        }
        if (isChatRoom) {
            return !reportDescription;
        }
        if (isPolicyExpenseChat) {
            return !policyDescription;
        }
        return true;
    };
    const shouldShowGuideBooking = !!account &&
        account?.guideDetails?.email !== CONST_1.default.EMAIL.CONCIERGE &&
        !!account?.guideDetails?.calendarLink &&
        (0, ReportUtils_1.isAdminRoom)(report) &&
        !!(0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived) &&
        !isChatThread &&
        introSelected?.companySize !== CONST_1.default.ONBOARDING_COMPANY_SIZE.MICRO;
    const join = (0, Session_1.callFunctionIfActionIsAllowed)(() => (0, Report_1.joinRoom)(report));
    const canJoin = (0, ReportUtils_1.canJoinChat)(report, parentReportAction, policy, isReportArchived);
    const joinButton = (<Button_1.default success text={translate('common.join')} onPress={join}/>);
    const renderAdditionalText = () => {
        if (shouldShowSubtitle() || isPersonalExpenseChat || !policyName || !(0, EmptyObject_1.isEmptyObject)(parentNavigationSubtitleData) || isSelfDM) {
            return null;
        }
        return (<>
                <Text_1.default style={[styles.sidebarLinkText, styles.textLabelSupporting]}> {translate('threads.in')} </Text_1.default>
                <Text_1.default style={[styles.sidebarLinkText, styles.textLabelSupporting, styles.textStrong]}>{policyName}</Text_1.default>
            </>);
    };
    // If the onboarding report is directly loaded, shouldShowDiscountBanner can return wrong value as it is not
    // linked to the react lifecycle directly. Wait for trial dates to load, before calculating.
    const shouldShowDiscount = (0, react_1.useMemo)(() => (0, SubscriptionUtils_1.shouldShowDiscountBanner)(hasTeam2025Pricing, subscriptionPlan) && !isReportArchived, 
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [firstDayFreeTrial, lastDayFreeTrial, hasTeam2025Pricing, reportNameValuePairs, subscriptionPlan]);
    const shouldShowSubscript = (0, ReportUtils_1.shouldReportShowSubscript)(report, isReportArchived);
    const defaultSubscriptSize = (0, ReportUtils_1.isExpenseRequest)(report) ? CONST_1.default.AVATAR_SIZE.SMALL_NORMAL : CONST_1.default.AVATAR_SIZE.DEFAULT;
    const brickRoadIndicator = (0, ReportUtils_1.hasReportNameError)(report) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : '';
    const shouldDisableDetailPage = (0, ReportUtils_1.shouldDisableDetailPage)(report);
    const shouldUseGroupTitle = isGroupChat && (!!report?.reportName || !isMultipleParticipant);
    const isLoading = !report?.reportID || !title;
    const isParentReportLoading = !!report?.parentReportID && !parentReport;
    const isReportInRHP = route.name === SCREENS_1.default.SEARCH.REPORT_RHP;
    const shouldDisplaySearchRouter = !isReportInRHP || isSmallScreenWidth;
    const [onboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const isChatUsedForOnboarding = (0, ReportUtils_1.isChatUsedForOnboarding)(report, onboardingPurposeSelected);
    const shouldShowRegisterForWebinar = introSelected?.companySize === CONST_1.default.ONBOARDING_COMPANY_SIZE.MICRO && (isChatUsedForOnboarding || ((0, ReportUtils_1.isAdminRoom)(report) && !isChatThread));
    const shouldShowOnBoardingHelpDropdownButton = (shouldShowRegisterForWebinar || shouldShowGuideBooking) && !isReportArchived;
    const shouldShowEarlyDiscountBanner = shouldShowDiscount && isChatUsedForOnboarding;
    const latestScheduledCall = reportNameValuePairs?.calendlyCalls?.at(-1);
    const hasActiveScheduledCall = latestScheduledCall && !(0, date_fns_1.isPast)(latestScheduledCall.eventTime) && latestScheduledCall.status !== CONST_1.default.SCHEDULE_CALL_STATUS.CANCELLED;
    const onboardingHelpDropdownButton = (<OnboardingHelpDropdownButton_1.default reportID={report?.reportID} shouldUseNarrowLayout={shouldUseNarrowLayout} shouldShowRegisterForWebinar={shouldShowRegisterForWebinar} shouldShowGuideBooking={shouldShowGuideBooking} hasActiveScheduledCall={hasActiveScheduledCall}/>);
    const multipleAvatars = (<ReportActionAvatars_1.default reportID={report?.reportID} size={shouldShowSubscript ? defaultSubscriptSize : undefined} singleAvatarContainerStyle={[styles.actionAvatar, styles.mr3]}/>);
    return (<>
            <react_native_1.View style={[styles.borderBottom]} dataSet={{ dragArea: true }}>
                <react_native_1.View style={[styles.appContentHeader, styles.pr3]}>
                    {isLoading ? (<ReportHeaderSkeletonView_1.default onBackButtonPress={onNavigationMenuButtonClicked}/>) : (<react_native_1.View style={[styles.appContentHeaderTitle, !shouldUseNarrowLayout && !isLoading && styles.pl5]}>
                            {shouldUseNarrowLayout && (<PressableWithoutFeedback_1.default onPress={onNavigationMenuButtonClicked} style={styles.LHNToggle} accessibilityHint={translate('accessibilityHints.navigateToChatsList')} accessibilityLabel={translate('common.back')} role={CONST_1.default.ROLE.BUTTON}>
                                    <Tooltip_1.default text={translate('common.back')} shiftVertical={4}>
                                        <react_native_1.View>
                                            <Icon_1.default src={Expensicons_1.BackArrow} fill={theme.icon}/>
                                        </react_native_1.View>
                                    </Tooltip_1.default>
                                </PressableWithoutFeedback_1.default>)}
                            <react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween]}>
                                <PressableWithoutFeedback_1.default onPress={() => (0, ReportUtils_1.navigateToDetailsPage)(report, Navigation_1.default.getReportRHPActiveRoute(), true)} style={[styles.flexRow, styles.alignItemsCenter, styles.flex1]} disabled={shouldDisableDetailPage} accessibilityLabel={title} role={CONST_1.default.ROLE.BUTTON}>
                                    {shouldShowSubscript ? multipleAvatars : <OfflineWithFeedback_1.default pendingAction={report?.pendingFields?.avatar}>{multipleAvatars}</OfflineWithFeedback_1.default>}
                                    <react_native_1.View fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK} style={[styles.flex1, styles.flexColumn]}>
                                        <CaretWrapper_1.default>
                                            <DisplayNames_1.default fullTitle={title} displayNamesWithTooltips={displayNamesWithTooltips} tooltipEnabled numberOfLines={1} textStyles={[styles.headerText, styles.pre]} shouldUseFullTitle={isChatRoom || isPolicyExpenseChat || isChatThread || isTaskReport || shouldUseGroupTitle || isReportArchived} renderAdditionalText={renderAdditionalText} shouldAddEllipsis={shouldAddEllipsis} forwardedFSClass={displayNamesFSClass}/>
                                        </CaretWrapper_1.default>
                                        {!(0, EmptyObject_1.isEmptyObject)(parentNavigationSubtitleData) && (<ParentNavigationSubtitle_1.default parentNavigationSubtitleData={parentNavigationSubtitleData} parentReportID={reportHeaderData?.parentReportID} parentReportActionID={reportHeaderData?.parentReportActionID} pressableStyles={[styles.alignSelfStart, styles.mw100]}/>)}
                                        {shouldShowSubtitle() && (<Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText, styles.textLabelSupporting]} numberOfLines={1}>
                                                {subtitle}
                                            </Text_1.default>)}
                                        {isChatRoom && !(0, ReportUtils_1.isInvoiceRoom)(reportHeaderData) && !!reportDescription && (0, EmptyObject_1.isEmptyObject)(parentNavigationSubtitleData) && (<react_native_1.View style={[styles.alignSelfStart, styles.mw100]}>
                                                <Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText, styles.textLabelSupporting]} numberOfLines={1}>
                                                    {reportDescription}
                                                </Text_1.default>
                                            </react_native_1.View>)}
                                        {isPolicyExpenseChat && !!policyDescription && (0, EmptyObject_1.isEmptyObject)(parentNavigationSubtitleData) && (<react_native_1.View style={[styles.alignSelfStart, styles.mw100]}>
                                                <Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText, styles.textLabelSupporting]} numberOfLines={1}>
                                                    {policyDescription}
                                                </Text_1.default>
                                            </react_native_1.View>)}
                                    </react_native_1.View>
                                    {brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR && (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter]}>
                                            <Icon_1.default src={Expensicons_1.DotIndicator} fill={theme.danger}/>
                                        </react_native_1.View>)}
                                </PressableWithoutFeedback_1.default>
                                <react_native_1.View style={[styles.reportOptions, styles.flexRow, styles.alignItemsCenter, styles.gap2]}>
                                    {shouldShowOnBoardingHelpDropdownButton && !shouldUseNarrowLayout && onboardingHelpDropdownButton}
                                    {!shouldUseNarrowLayout && !shouldShowDiscount && isChatUsedForOnboarding && (<FreeTrial_1.default pressable success={!hasActiveScheduledCall}/>)}
                                    {!shouldUseNarrowLayout && (0, ReportUtils_1.isOpenTaskReport)(report, parentReportAction) && <TaskHeaderActionButton_1.default report={report}/>}
                                    {!isParentReportLoading && canJoin && !shouldUseNarrowLayout && joinButton}
                                </react_native_1.View>
                                <HelpButton_1.default style={styles.ml2}/>
                                {shouldDisplaySearchRouter && <SearchButton_1.default />}
                            </react_native_1.View>
                            <ConfirmModal_1.default isVisible={isDeleteTaskConfirmModalVisible} onConfirm={() => {
                setIsDeleteTaskConfirmModalVisible(false);
                (0, Task_1.deleteTask)(report, isReportArchived);
            }} onCancel={() => setIsDeleteTaskConfirmModalVisible(false)} title={translate('task.deleteTask')} prompt={translate('task.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>
                        </react_native_1.View>)}
                </react_native_1.View>
                {!isParentReportLoading && !isLoading && canJoin && shouldUseNarrowLayout && <react_native_1.View style={[styles.ph5, styles.pb2]}>{joinButton}</react_native_1.View>}
                <react_native_1.View style={shouldShowOnBoardingHelpDropdownButton && [styles.flexRow, styles.alignItemsCenter, styles.gap1, styles.ph5]}>
                    {!shouldShowEarlyDiscountBanner && shouldShowOnBoardingHelpDropdownButton && shouldUseNarrowLayout && (<react_native_1.View style={[styles.flex1, styles.pb3]}>{onboardingHelpDropdownButton}</react_native_1.View>)}
                    {!isLoading && !shouldShowDiscount && isChatUsedForOnboarding && shouldUseNarrowLayout && (<FreeTrial_1.default pressable addSpacing success={!hasActiveScheduledCall} inARow={shouldShowOnBoardingHelpDropdownButton}/>)}
                </react_native_1.View>
                {!!report && shouldUseNarrowLayout && (0, ReportUtils_1.isOpenTaskReport)(report, parentReportAction) && (<react_native_1.View style={[styles.appBG, styles.pl0]}>
                        <react_native_1.View style={[styles.ph5, styles.pb3]}>
                            <TaskHeaderActionButton_1.default report={report}/>
                        </react_native_1.View>
                    </react_native_1.View>)}
                <LoadingBar_1.default shouldShow={shouldShowLoadingBar && shouldUseNarrowLayout}/>
            </react_native_1.View>
            {shouldShowEarlyDiscountBanner && (<EarlyDiscountBanner_1.default onboardingHelpDropdownButton={shouldUseNarrowLayout && shouldShowOnBoardingHelpDropdownButton ? onboardingHelpDropdownButton : undefined} isSubscriptionPage={false} hasActiveScheduledCall={hasActiveScheduledCall}/>)}
        </>);
}
HeaderView.displayName = 'HeaderView';
exports.default = (0, react_1.memo)(HeaderView);
