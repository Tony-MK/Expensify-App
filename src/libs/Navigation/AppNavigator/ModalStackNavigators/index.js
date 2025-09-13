"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeTransactionStackNavigator = exports.ScheduleCallModalStackNavigator = exports.AddUnreportedExpenseModalStackNavigator = exports.ConsoleModalStackNavigator = exports.WorkspaceDuplicateModalStackNavigator = exports.WorkspaceConfirmationModalStackNavigator = exports.DebugModalStackNavigator = exports.MissingPersonalDetailsModalStackNavigator = exports.SearchSavedSearchModalStackNavigator = exports.ShareModalStackNavigator = exports.SearchAdvancedFiltersModalStackNavigator = exports.RestrictedActionModalStackNavigator = exports.SearchReportModalStackNavigator = exports.TransactionDuplicateStackNavigator = exports.WalletStatementStackNavigator = exports.TaskModalStackNavigator = exports.SplitDetailsModalStackNavigator = exports.DomainCardModalStackNavigator = exports.ExpensifyCardModalStackNavigator = exports.TagsModalStackNavigator = exports.CategoriesModalStackNavigator = exports.SignInModalStackNavigator = exports.TwoFactorAuthenticatorStackNavigator = exports.SettingsModalStackNavigator = exports.RoomMembersModalStackNavigator = exports.ReportSettingsModalStackNavigator = exports.ReportParticipantsModalStackNavigator = exports.ReportChangeApproverModalStackNavigator = exports.ReportChangeWorkspaceModalStackNavigator = exports.ReportDetailsModalStackNavigator = exports.ReportDescriptionModalStackNavigator = exports.NewReportWorkspaceSelectionModalStackNavigator = exports.TravelModalStackNavigator = exports.ReferralModalStackNavigator = exports.ProfileModalStackNavigator = exports.PrivateNotesModalStackNavigator = exports.NewTeachersUniteNavigator = exports.NewTaskModalStackNavigator = exports.NewChatModalStackNavigator = exports.MoneyRequestModalStackNavigator = exports.FlagCommentStackNavigator = exports.EnablePaymentsStackNavigator = exports.EditRequestStackNavigator = exports.AddPersonalBankAccountModalStackNavigator = void 0;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const WideRHPContextProvider_1 = require("@components/WideRHPContextProvider");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Overlay_1 = require("@libs/Navigation/AppNavigator/Navigators/Overlay");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const SCREENS_1 = require("@src/SCREENS");
const useModalStackScreenOptions_1 = require("./useModalStackScreenOptions");
const OPTIONS_PER_SCREEN = {
    [SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.MERGE_RESULT]: {
        animationTypeForReplace: 'push',
    },
    [SCREENS_1.default.SEARCH.REPORT_RHP]: {
        animation: animation_1.default.NONE,
    },
    [SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS]: {
        animation: animation_1.default.NONE,
    },
    [SCREENS_1.default.SEARCH.TRANSACTION_HOLD_REASON_RHP]: {
        animation: animation_1.default.NONE,
    },
    [SCREENS_1.default.SEARCH.TRANSACTIONS_CHANGE_REPORT_SEARCH_RHP]: {
        animation: animation_1.default.NONE,
    },
};
/**
 * Create a modal stack navigator with an array of sub-screens.
 *
 * @param screens key/value pairs where the key is the name of the screen and the value is a function that returns the lazy-loaded component
 */
function createModalStackNavigator(screens) {
    const ModalStackNavigator = (0, createPlatformStackNavigator_1.default)();
    function ModalStack() {
        const styles = (0, useThemeStyles_1.default)();
        const screenOptions = (0, useModalStackScreenOptions_1.default)();
        const { secondOverlayProgress, shouldRenderSecondaryOverlay } = (0, react_1.useContext)(WideRHPContextProvider_1.WideRHPContext);
        const route = (0, native_1.useRoute)();
        // We have to use the isSmallScreenWidth instead of shouldUseNarrow layout, because we want to have information about screen width without the context of side modal.
        // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
        const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
        const getScreenOptions = (0, react_1.useCallback)(({ route: optionRoute }) => {
            // Extend common options if they are defined for the screen.
            if (OPTIONS_PER_SCREEN[optionRoute.name]) {
                return { ...screenOptions({ route: optionRoute }), ...OPTIONS_PER_SCREEN[optionRoute.name] };
            }
            return screenOptions({ route: optionRoute });
        }, [screenOptions]);
        return (
        // This container is necessary to hide card translation during transition. Without it the user would see un-clipped cards.
        <react_native_1.View style={styles.modalStackNavigatorContainer(isSmallScreenWidth)}>
                <ModalStackNavigator.Navigator>
                    {Object.keys(screens).map((name) => (<ModalStackNavigator.Screen key={name} name={name} getComponent={screens[name]} 
            // For some reason, screenOptions is not working with function as options so we have to pass it to every screen.
            options={getScreenOptions}/>))}
                </ModalStackNavigator.Navigator>
                {!isSmallScreenWidth && shouldRenderSecondaryOverlay && route.name === SCREENS_1.default.RIGHT_MODAL.SEARCH_REPORT ? (
            // This overlay is necessary to cover the gap under the narrow format RHP screen
            <Overlay_1.default progress={secondOverlayProgress} hasMarginLeft/>) : null}
            </react_native_1.View>);
    }
    ModalStack.displayName = 'ModalStack';
    return ModalStack;
}
const MoneyRequestModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.MONEY_REQUEST.START]: () => require('../../../../pages/iou/request/IOURequestRedirectToStartPage').default,
    [SCREENS_1.default.MONEY_REQUEST.CREATE]: () => require('../../../../pages/iou/request/IOURequestStartPage').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_CONFIRMATION]: () => require('../../../../pages/iou/request/step/IOURequestStepConfirmation').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_AMOUNT]: () => require('../../../../pages/iou/request/step/IOURequestStepAmount').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_TAX_AMOUNT]: () => require('../../../../pages/iou/request/step/IOURequestStepTaxAmountPage').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_TAX_RATE]: () => require('../../../../pages/iou/request/step/IOURequestStepTaxRatePage').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_CATEGORY]: () => require('../../../../pages/iou/request/step/IOURequestStepCategory').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_CURRENCY]: () => require('../../../../pages/iou/request/step/IOURequestStepCurrency').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_DATE]: () => require('../../../../pages/iou/request/step/IOURequestStepDate').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_DESCRIPTION]: () => require('../../../../pages/iou/request/step/IOURequestStepDescription').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE]: () => require('../../../../pages/iou/request/step/IOURequestStepDistance').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE_RATE]: () => require('@pages/iou/request/step/IOURequestStepDistanceRate').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_MERCHANT]: () => require('../../../../pages/iou/request/step/IOURequestStepMerchant').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_PARTICIPANTS]: () => require('../../../../pages/iou/request/step/IOURequestStepParticipants').default,
    [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_ROOT]: () => require('../../../../pages/workspace/categories/WorkspaceCategoriesPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_ROOT]: () => require('../../../../pages/workspace/tags/WorkspaceTagsPage').default,
    [SCREENS_1.default.MONEY_REQUEST.EDIT_REPORT]: () => require('../../../../pages/iou/request/step/IOURequestEditReport').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_SCAN]: () => require('../../../../pages/iou/request/step/IOURequestStepScan').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_TAG]: () => require('../../../../pages/iou/request/step/IOURequestStepTag').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_WAYPOINT]: () => require('../../../../pages/iou/request/step/IOURequestStepWaypoint').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_SPLIT_PAYER]: () => require('../../../../pages/iou/request/step/IOURequestStepSplitPayer').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_SEND_FROM]: () => require('../../../../pages/iou/request/step/IOURequestStepSendFrom').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_REPORT]: () => require('../../../../pages/iou/request/step/IOURequestStepReport').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_COMPANY_INFO]: () => require('../../../../pages/iou/request/step/IOURequestStepCompanyInfo').default,
    [SCREENS_1.default.MONEY_REQUEST.HOLD]: () => require('../../../../pages/iou/HoldReasonPage').default,
    [SCREENS_1.default.MONEY_REQUEST.REJECT]: () => require('../../../../pages/iou/RejectReasonPage').default,
    [SCREENS_1.default.IOU_SEND.ADD_BANK_ACCOUNT]: () => require('../../../../pages/AddPersonalBankAccountPage').default,
    [SCREENS_1.default.IOU_SEND.ADD_DEBIT_CARD]: () => require('../../../../pages/settings/Wallet/AddDebitCardPage').default,
    [SCREENS_1.default.IOU_SEND.ENABLE_PAYMENTS]: () => require('../../../../pages/EnablePayments/EnablePaymentsPage').default,
    [SCREENS_1.default.MONEY_REQUEST.STATE_SELECTOR]: () => require('../../../../pages/settings/Profile/PersonalDetails/StateSelectionPage').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_ATTENDEES]: () => require('../../../../pages/iou/request/step/IOURequestStepAttendees').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_ACCOUNTANT]: () => require('../../../../pages/iou/request/step/IOURequestStepAccountant').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_UPGRADE]: () => require('../../../../pages/iou/request/step/IOURequestStepUpgrade').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_DESTINATION]: () => require('../../../../pages/iou/request/step/IOURequestStepDestination').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_TIME]: () => require('../../../../pages/iou/request/step/IOURequestStepTime').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_SUBRATE]: () => require('../../../../pages/iou/request/step/IOURequestStepSubrate').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_DESTINATION_EDIT]: () => require('../../../../pages/iou/request/step/IOURequestStepDestination').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_TIME_EDIT]: () => require('../../../../pages/iou/request/step/IOURequestStepTime').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_SUBRATE_EDIT]: () => require('../../../../pages/iou/request/step/IOURequestStepSubrate').default,
    [SCREENS_1.default.MONEY_REQUEST.RECEIPT_VIEW]: () => require('../../../../pages/iou/request/step/IOURequestStepScan/ReceiptView').default,
    [SCREENS_1.default.MONEY_REQUEST.SPLIT_EXPENSE]: () => require('../../../../pages/iou/SplitExpensePage').default,
    [SCREENS_1.default.MONEY_REQUEST.SPLIT_EXPENSE_EDIT]: () => require('../../../../pages/iou/SplitExpenseEditPage').default,
    [SCREENS_1.default.MONEY_REQUEST.DISTANCE_CREATE]: () => require('../../../../pages/iou/request/DistanceRequestStartPage').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE_MAP]: () => require('../../../../pages/iou/request/step/IOURequestStepDistanceMap').default,
    [SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE_MANUAL]: () => require('../../../../pages/iou/request/step/IOURequestStepDistanceManual').default,
});
exports.MoneyRequestModalStackNavigator = MoneyRequestModalStackNavigator;
const TravelModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.TRAVEL.MY_TRIPS]: () => require('../../../../pages/Travel/MyTripsPage').default,
    [SCREENS_1.default.TRAVEL.TRAVEL_DOT_LINK_WEB_VIEW]: () => require('../../../../pages/Travel/TravelDotLinkWebview').default,
    [SCREENS_1.default.TRAVEL.TCS]: () => require('../../../../pages/Travel/TravelTerms').default,
    [SCREENS_1.default.TRAVEL.UPGRADE]: () => require('../../../../pages/Travel/TravelUpgrade').default,
    [SCREENS_1.default.TRAVEL.TRIP_SUMMARY]: () => require('../../../../pages/Travel/TripSummaryPage').default,
    [SCREENS_1.default.TRAVEL.TRIP_DETAILS]: () => require('../../../../pages/Travel/TripDetailsPage').default,
    [SCREENS_1.default.TRAVEL.DOMAIN_SELECTOR]: () => require('../../../../pages/Travel/DomainSelectorPage').default,
    [SCREENS_1.default.TRAVEL.DOMAIN_PERMISSION_INFO]: () => require('../../../../pages/Travel/DomainPermissionInfoPage').default,
    [SCREENS_1.default.TRAVEL.PUBLIC_DOMAIN_ERROR]: () => require('../../../../pages/Travel/PublicDomainErrorPage').default,
    [SCREENS_1.default.TRAVEL.WORKSPACE_ADDRESS]: () => require('../../../../pages/Travel/WorkspaceAddressForTravelPage').default,
});
exports.TravelModalStackNavigator = TravelModalStackNavigator;
const SplitDetailsModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SPLIT_DETAILS.ROOT]: () => require('../../../../pages/iou/SplitBillDetailsPage').default,
});
exports.SplitDetailsModalStackNavigator = SplitDetailsModalStackNavigator;
const ProfileModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.PROFILE_ROOT]: () => require('../../../../pages/ProfilePage').default,
});
exports.ProfileModalStackNavigator = ProfileModalStackNavigator;
const NewReportWorkspaceSelectionModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.NEW_REPORT_WORKSPACE_SELECTION.ROOT]: () => require('../../../../pages/NewReportWorkspaceSelectionPage').default,
});
exports.NewReportWorkspaceSelectionModalStackNavigator = NewReportWorkspaceSelectionModalStackNavigator;
const ReportDetailsModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.REPORT_DETAILS.ROOT]: () => require('../../../../pages/ReportDetailsPage').default,
    [SCREENS_1.default.REPORT_DETAILS.SHARE_CODE]: () => require('../../../../pages/home/report/ReportDetailsShareCodePage').default,
    [SCREENS_1.default.REPORT_DETAILS.EXPORT]: () => require('../../../../pages/home/report/ReportDetailsExportPage').default,
});
exports.ReportDetailsModalStackNavigator = ReportDetailsModalStackNavigator;
const ReportChangeWorkspaceModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.REPORT_CHANGE_WORKSPACE.ROOT]: () => require('../../../../pages/ReportChangeWorkspacePage').default,
});
exports.ReportChangeWorkspaceModalStackNavigator = ReportChangeWorkspaceModalStackNavigator;
const ReportChangeApproverModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.REPORT_CHANGE_APPROVER.ROOT]: () => require('../../../../pages/ReportChangeApproverPage').default,
    [SCREENS_1.default.REPORT_CHANGE_APPROVER.ADD_APPROVER]: () => require('../../../../pages/ReportAddApproverPage').default,
});
exports.ReportChangeApproverModalStackNavigator = ReportChangeApproverModalStackNavigator;
const ReportSettingsModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.REPORT_SETTINGS.ROOT]: () => require('../../../../pages/settings/Report/ReportSettingsPage').default,
    [SCREENS_1.default.REPORT_SETTINGS.NAME]: () => require('../../../../pages/settings/Report/NamePage').default,
    [SCREENS_1.default.REPORT_SETTINGS.NOTIFICATION_PREFERENCES]: () => require('../../../../pages/settings/Report/NotificationPreferencePage').default,
    [SCREENS_1.default.REPORT_SETTINGS.WRITE_CAPABILITY]: () => require('../../../../pages/settings/Report/WriteCapabilityPage').default,
    [SCREENS_1.default.REPORT_SETTINGS.VISIBILITY]: () => require('../../../../pages/settings/Report/VisibilityPage').default,
});
exports.ReportSettingsModalStackNavigator = ReportSettingsModalStackNavigator;
const WorkspaceConfirmationModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.WORKSPACE_CONFIRMATION.ROOT]: () => require('../../../../pages/workspace/WorkspaceConfirmationPage').default,
});
exports.WorkspaceConfirmationModalStackNavigator = WorkspaceConfirmationModalStackNavigator;
const WorkspaceDuplicateModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.WORKSPACE_DUPLICATE.ROOT]: () => require('../../../../pages/workspace/duplicate/WorkspaceDuplicatePage').default,
    [SCREENS_1.default.WORKSPACE_DUPLICATE.SELECT_FEATURES]: () => require('../../../../pages/workspace/duplicate/WorkspaceDuplicateSelectFeaturesPage').default,
});
exports.WorkspaceDuplicateModalStackNavigator = WorkspaceDuplicateModalStackNavigator;
const TaskModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.TASK.TITLE]: () => require('../../../../pages/tasks/TaskTitlePage').default,
    [SCREENS_1.default.TASK.ASSIGNEE]: () => require('../../../../pages/tasks/TaskAssigneeSelectorModal').default,
});
exports.TaskModalStackNavigator = TaskModalStackNavigator;
const ReportDescriptionModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.REPORT_DESCRIPTION_ROOT]: () => require('../../../../pages/ReportDescriptionPage').default,
});
exports.ReportDescriptionModalStackNavigator = ReportDescriptionModalStackNavigator;
const CategoriesModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_SETTINGS]: () => require('../../../../pages/workspace/categories/WorkspaceCategoriesSettingsPage').default,
    [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_CREATE]: () => require('../../../../pages/workspace/categories/CreateCategoryPage').default,
    [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_EDIT]: () => require('../../../../pages/workspace/categories/EditCategoryPage').default,
    [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_SETTINGS]: () => require('../../../../pages/workspace/categories/CategorySettingsPage').default,
    [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_IMPORT]: () => require('../../../../pages/workspace/categories/ImportCategoriesPage').default,
    [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_IMPORTED]: () => require('../../../../pages/workspace/categories/ImportedCategoriesPage').default,
    [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_PAYROLL_CODE]: () => require('../../../../pages/workspace/categories/CategoryPayrollCodePage').default,
    [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_GL_CODE]: () => require('../../../../pages/workspace/categories/CategoryGLCodePage').default,
});
exports.CategoriesModalStackNavigator = CategoriesModalStackNavigator;
const TagsModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_SETTINGS]: () => require('../../../../pages/workspace/tags/WorkspaceTagsSettingsPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_EDIT]: () => require('../../../../pages/workspace/tags/WorkspaceEditTagsPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_IMPORT]: () => require('../../../../pages/workspace/tags/ImportTagsPage').default,
    [SCREENS_1.default.WORKSPACE.TAGS_IMPORT_OPTIONS]: () => require('../../../../pages/workspace/tags/ImportTagsOptionsPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_IMPORTED]: () => require('../../../../pages/workspace/tags/ImportedTagsPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_SETTINGS]: () => require('../../../../pages/workspace/tags/TagSettingsPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_LIST_VIEW]: () => require('../../../../pages/workspace/tags/WorkspaceViewTagsPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_CREATE]: () => require('../../../../pages/workspace/tags/WorkspaceCreateTagPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_EDIT]: () => require('../../../../pages/workspace/tags/EditTagPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_APPROVER]: () => require('../../../../pages/workspace/tags/TagApproverPage').default,
    [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_GL_CODE]: () => require('../../../../pages/workspace/tags/TagGLCodePage').default,
});
exports.TagsModalStackNavigator = TagsModalStackNavigator;
const ExpensifyCardModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_DETAILS]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceExpensifyCardDetailsPage').default,
    [SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_NAME]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardNamePage').default,
    [SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_LIMIT]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardLimitPage').default,
    [SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_LIMIT_TYPE]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardLimitTypePage').default,
});
exports.ExpensifyCardModalStackNavigator = ExpensifyCardModalStackNavigator;
const DomainCardModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.DOMAIN_CARD.DOMAIN_CARD_DETAIL]: () => require('../../../../pages/settings/Wallet/ExpensifyCardPage').default,
    [SCREENS_1.default.DOMAIN_CARD.DOMAIN_CARD_REPORT_FRAUD]: () => require('../../../../pages/settings/Wallet/ReportVirtualCardFraudPage').default,
});
exports.DomainCardModalStackNavigator = DomainCardModalStackNavigator;
const ReportParticipantsModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.REPORT_PARTICIPANTS.ROOT]: () => require('../../../../pages/ReportParticipantsPage').default,
    [SCREENS_1.default.REPORT_PARTICIPANTS.INVITE]: () => require('../../../../pages/InviteReportParticipantsPage').default,
    [SCREENS_1.default.REPORT_PARTICIPANTS.DETAILS]: () => require('../../../../pages/ReportParticipantDetailsPage').default,
    [SCREENS_1.default.REPORT_PARTICIPANTS.ROLE]: () => require('../../../../pages/ReportParticipantRoleSelectionPage').default,
});
exports.ReportParticipantsModalStackNavigator = ReportParticipantsModalStackNavigator;
const RoomMembersModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.ROOM_MEMBERS.ROOT]: () => require('../../../../pages/RoomMembersPage').default,
    [SCREENS_1.default.ROOM_MEMBERS.INVITE]: () => require('../../../../pages/RoomInvitePage').default,
    [SCREENS_1.default.ROOM_MEMBERS.DETAILS]: () => require('../../../../pages/RoomMemberDetailsPage').default,
});
exports.RoomMembersModalStackNavigator = RoomMembersModalStackNavigator;
const NewChatModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.NEW_CHAT.ROOT]: () => require('../../../../pages/NewChatSelectorPage').default,
    [SCREENS_1.default.NEW_CHAT.NEW_CHAT_CONFIRM]: () => require('../../../../pages/NewChatConfirmPage').default,
    [SCREENS_1.default.NEW_CHAT.NEW_CHAT_EDIT_NAME]: () => require('../../../../pages/GroupChatNameEditPage').default,
});
exports.NewChatModalStackNavigator = NewChatModalStackNavigator;
const NewTaskModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.NEW_TASK.ROOT]: () => require('../../../../pages/tasks/NewTaskPage').default,
    [SCREENS_1.default.NEW_TASK.TASK_ASSIGNEE_SELECTOR]: () => require('../../../../pages/tasks/TaskAssigneeSelectorModal').default,
    [SCREENS_1.default.NEW_TASK.TASK_SHARE_DESTINATION_SELECTOR]: () => require('../../../../pages/tasks/TaskShareDestinationSelectorModal').default,
    [SCREENS_1.default.NEW_TASK.DETAILS]: () => require('../../../../pages/tasks/NewTaskDetailsPage').default,
    [SCREENS_1.default.NEW_TASK.TITLE]: () => require('../../../../pages/tasks/NewTaskTitlePage').default,
    [SCREENS_1.default.NEW_TASK.DESCRIPTION]: () => require('../../../../pages/tasks/NewTaskDescriptionPage').default,
});
exports.NewTaskModalStackNavigator = NewTaskModalStackNavigator;
const NewTeachersUniteNavigator = createModalStackNavigator({
    [SCREENS_1.default.SAVE_THE_WORLD.ROOT]: () => require('../../../../pages/TeachersUnite/SaveTheWorldPage').default,
    [SCREENS_1.default.I_KNOW_A_TEACHER]: () => require('../../../../pages/TeachersUnite/KnowATeacherPage').default,
    [SCREENS_1.default.INTRO_SCHOOL_PRINCIPAL]: () => require('../../../../pages/TeachersUnite/ImTeacherPage').default,
    [SCREENS_1.default.I_AM_A_TEACHER]: () => require('../../../../pages/TeachersUnite/ImTeacherPage').default,
});
exports.NewTeachersUniteNavigator = NewTeachersUniteNavigator;
const ConsoleModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.PUBLIC_CONSOLE_DEBUG]: () => require('../../../../pages/settings/AboutPage/ConsolePage').default,
});
exports.ConsoleModalStackNavigator = ConsoleModalStackNavigator;
const SettingsModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SETTINGS.SHARE_CODE]: () => require('../../../../pages/ShareCodePage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.PRONOUNS]: () => require('../../../../pages/settings/Profile/PronounsPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.DISPLAY_NAME]: () => require('../../../../pages/settings/Profile/DisplayNamePage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.TIMEZONE]: () => require('../../../../pages/settings/Profile/TimezoneInitialPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.TIMEZONE_SELECT]: () => require('../../../../pages/settings/Profile/TimezoneSelectPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.LEGAL_NAME]: () => require('../../../../pages/settings/Profile/PersonalDetails/LegalNamePage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.DATE_OF_BIRTH]: () => require('../../../../pages/settings/Profile/PersonalDetails/DateOfBirthPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.PHONE_NUMBER]: () => require('../../../../pages/settings/Profile/PersonalDetails/PhoneNumberPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.ADDRESS]: () => require('../../../../pages/settings/Profile/PersonalDetails/PersonalAddressPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.ADDRESS_COUNTRY]: () => require('../../../../pages/settings/Profile/PersonalDetails/CountrySelectionPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.ADDRESS_STATE]: () => require('../../../../pages/settings/Profile/PersonalDetails/StateSelectionPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.CONTACT_METHODS]: () => require('../../../../pages/settings/Profile/Contacts/ContactMethodsPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.CONTACT_METHOD_DETAILS]: () => require('../../../../pages/settings/Profile/Contacts/ContactMethodDetailsPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.NEW_CONTACT_METHOD]: () => require('../../../../pages/settings/Profile/Contacts/NewContactMethodPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.CONTACT_METHOD_VERIFY_ACCOUNT]: () => require('../../../../pages/settings/Profile/Contacts/VerifyAccountPage').default,
    [SCREENS_1.default.SETTINGS.PREFERENCES.PRIORITY_MODE]: () => require('../../../../pages/settings/Preferences/PriorityModePage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.ROOT]: () => require('../../../../pages/workspace/accounting/PolicyAccountingPage').default,
    [SCREENS_1.default.SETTINGS.PREFERENCES.LANGUAGE]: () => require('../../../../pages/settings/Preferences/LanguagePage').default,
    [SCREENS_1.default.SETTINGS.PREFERENCES.THEME]: () => require('../../../../pages/settings/Preferences/ThemePage').default,
    [SCREENS_1.default.SETTINGS.PREFERENCES.PAYMENT_CURRENCY]: () => require('../../../../pages/settings/Preferences/PaymentCurrencyPage').default,
    [SCREENS_1.default.SETTINGS.CLOSE]: () => require('../../../../pages/settings/Security/CloseAccountPage').default,
    [SCREENS_1.default.SETTINGS.APP_DOWNLOAD_LINKS]: () => require('../../../../pages/settings/AppDownloadLinks').default,
    [SCREENS_1.default.SETTINGS.CONSOLE]: () => require('../../../../pages/settings/AboutPage/ConsolePage').default,
    [SCREENS_1.default.SETTINGS.SHARE_LOG]: () => require('../../../../pages/settings/AboutPage/ShareLogPage').default,
    [SCREENS_1.default.SETTINGS.WALLET.CARDS_DIGITAL_DETAILS_UPDATE_ADDRESS]: () => require('../../../../pages/settings/Profile/PersonalDetails/PersonalAddressPage').default,
    [SCREENS_1.default.SETTINGS.WALLET.DOMAIN_CARD]: () => require('../../../../pages/settings/Wallet/ExpensifyCardPage').default,
    [SCREENS_1.default.SETTINGS.WALLET.REPORT_VIRTUAL_CARD_FRAUD]: () => require('../../../../pages/settings/Wallet/ReportVirtualCardFraudPage').default,
    [SCREENS_1.default.SETTINGS.WALLET.REPORT_VIRTUAL_CARD_FRAUD_CONFIRMATION]: () => require('../../../../pages/settings/Wallet/ReportVirtualCardFraudConfirmationPage').default,
    [SCREENS_1.default.SETTINGS.WALLET.CARD_ACTIVATE]: () => require('../../../../pages/settings/Wallet/ActivatePhysicalCardPage').default,
    [SCREENS_1.default.SETTINGS.WALLET.TRANSFER_BALANCE]: () => require('../../../../pages/settings/Wallet/TransferBalancePage').default,
    [SCREENS_1.default.SETTINGS.WALLET.CHOOSE_TRANSFER_ACCOUNT]: () => require('../../../../pages/settings/Wallet/ChooseTransferAccountPage').default,
    [SCREENS_1.default.SETTINGS.WALLET.ENABLE_PAYMENTS]: () => require('../../../../pages/EnablePayments/EnablePayments').default,
    [SCREENS_1.default.SETTINGS.WALLET.ENABLE_GLOBAL_REIMBURSEMENTS]: () => require('../../../../pages/settings/Wallet/EnableGlobalReimbursements').default,
    [SCREENS_1.default.SETTINGS.ADD_DEBIT_CARD]: () => require('../../../../pages/settings/Wallet/AddDebitCardPage').default,
    [SCREENS_1.default.SETTINGS.ADD_BANK_ACCOUNT]: () => require('../../../../pages/settings/Wallet/InternationalDepositAccount').default,
    [SCREENS_1.default.SETTINGS.ADD_US_BANK_ACCOUNT]: () => require('../../../../pages/AddPersonalBankAccountPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.STATUS]: () => require('../../../../pages/settings/Profile/CustomStatus/StatusPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.STATUS_CLEAR_AFTER]: () => require('../../../../pages/settings/Profile/CustomStatus/StatusClearAfterPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.STATUS_CLEAR_AFTER_DATE]: () => require('../../../../pages/settings/Profile/CustomStatus/SetDatePage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.STATUS_CLEAR_AFTER_TIME]: () => require('../../../../pages/settings/Profile/CustomStatus/SetTimePage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.VACATION_DELEGATE]: () => require('../../../../pages/settings/Profile/CustomStatus/VacationDelegatePage').default,
    [SCREENS_1.default.SETTINGS.SUBSCRIPTION.SIZE]: () => require('../../../../pages/settings/Subscription/SubscriptionSize').default,
    [SCREENS_1.default.SETTINGS.SUBSCRIPTION.SETTINGS_DETAILS]: () => require('../../../../pages/settings/Subscription/SubscriptionSettings').default,
    [SCREENS_1.default.SETTINGS.SUBSCRIPTION.DISABLE_AUTO_RENEW_SURVEY]: () => require('../../../../pages/settings/Subscription/DisableAutoRenewSurveyPage').default,
    [SCREENS_1.default.SETTINGS.SUBSCRIPTION.REQUEST_EARLY_CANCELLATION]: () => require('../../../../pages/settings/Subscription/RequestEarlyCancellationPage').default,
    [SCREENS_1.default.SETTINGS.SUBSCRIPTION.SUBSCRIPTION_DOWNGRADE_BLOCKED]: () => require('../../../../pages/settings/Subscription/SubscriptionPlan/SubscriptionPlanDowngradeBlockedPage').default,
    [SCREENS_1.default.WORKSPACE.INVITE]: () => require('../../../../pages/workspace/WorkspaceInvitePage').default,
    [SCREENS_1.default.WORKSPACE.MEMBERS_IMPORT]: () => require('../../../../pages/workspace/members/ImportMembersPage').default,
    [SCREENS_1.default.WORKSPACE.MEMBERS_IMPORTED]: () => require('../../../../pages/workspace/members/ImportedMembersPage').default,
    [SCREENS_1.default.WORKSPACE.MEMBERS_IMPORTED_CONFIRMATION]: () => require('../../../../pages/workspace/members/ImportedMembersConfirmationPage').default,
    [SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_NEW]: () => require('../../../../pages/workspace/workflows/approvals/WorkspaceWorkflowsApprovalsCreatePage').default,
    [SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_EDIT]: () => require('../../../../pages/workspace/workflows/approvals/WorkspaceWorkflowsApprovalsEditPage').default,
    [SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_EXPENSES_FROM]: () => require('../../../../pages/workspace/workflows/approvals/WorkspaceWorkflowsApprovalsExpensesFromPage').default,
    [SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_APPROVER]: () => require('../../../../pages/workspace/workflows/approvals/WorkspaceWorkflowsApprovalsApproverPage').default,
    [SCREENS_1.default.WORKSPACE.INVITE_MESSAGE]: () => require('../../../../pages/workspace/WorkspaceInviteMessagePage').default,
    [SCREENS_1.default.WORKSPACE.INVITE_MESSAGE_ROLE]: () => require('../../../../pages/workspace/WorkspaceInviteMessageRolePage').default,
    [SCREENS_1.default.WORKSPACE.WORKFLOWS_PAYER]: () => require('../../../../pages/workspace/workflows/WorkspaceWorkflowsPayerPage').default,
    [SCREENS_1.default.WORKSPACE.NAME]: () => require('../../../../pages/workspace/WorkspaceNamePage').default,
    [SCREENS_1.default.WORKSPACE.DESCRIPTION]: () => require('../../../../pages/workspace/WorkspaceOverviewDescriptionPage').default,
    [SCREENS_1.default.WORKSPACE.SHARE]: () => require('../../../../pages/workspace/WorkspaceOverviewSharePage').default,
    [SCREENS_1.default.WORKSPACE.CURRENCY]: () => require('../../../../pages/workspace/WorkspaceOverviewCurrencyPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_SETTINGS]: () => require('../../../../pages/workspace/categories/CategorySettingsPage').default,
    [SCREENS_1.default.WORKSPACE.ADDRESS]: () => require('../../../../pages/workspace/WorkspaceOverviewAddressPage').default,
    [SCREENS_1.default.WORKSPACE.PLAN]: () => require('../../../../pages/workspace/WorkspaceOverviewPlanTypePage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORIES_SETTINGS]: () => require('../../../../pages/workspace/categories/WorkspaceCategoriesSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORIES_IMPORT]: () => require('../../../../pages/workspace/categories/ImportCategoriesPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORIES_IMPORTED]: () => require('../../../../pages/workspace/categories/ImportedCategoriesPage').default,
    [SCREENS_1.default.WORKSPACE.UPGRADE]: () => require('../../../../pages/workspace/upgrade/WorkspaceUpgradePage').default,
    [SCREENS_1.default.WORKSPACE.DOWNGRADE]: () => require('../../../../pages/workspace/downgrade/WorkspaceDowngradePage').default,
    [SCREENS_1.default.WORKSPACE.PAY_AND_DOWNGRADE]: () => require('../../../../pages/workspace/downgrade/PayAndDowngradePage').default,
    [SCREENS_1.default.WORKSPACE.MEMBER_DETAILS]: () => require('../../../../pages/workspace/members/WorkspaceMemberDetailsPage').default,
    [SCREENS_1.default.WORKSPACE.MEMBER_CUSTOM_FIELD]: () => require('../../../../pages/workspace/members/WorkspaceMemberCustomFieldPage').default,
    [SCREENS_1.default.WORKSPACE.MEMBER_NEW_CARD]: () => require('../../../../pages/workspace/members/WorkspaceMemberNewCardPage').default,
    [SCREENS_1.default.WORKSPACE.OWNER_CHANGE_CHECK]: () => require('@pages/workspace/members/WorkspaceOwnerChangeWrapperPage').default,
    [SCREENS_1.default.WORKSPACE.OWNER_CHANGE_SUCCESS]: () => require('../../../../pages/workspace/members/WorkspaceOwnerChangeSuccessPage').default,
    [SCREENS_1.default.WORKSPACE.OWNER_CHANGE_ERROR]: () => require('../../../../pages/workspace/members/WorkspaceOwnerChangeErrorPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_CREATE]: () => require('../../../../pages/workspace/categories/CreateCategoryPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_EDIT]: () => require('../../../../pages/workspace/categories/EditCategoryPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_PAYROLL_CODE]: () => require('../../../../pages/workspace/categories/CategoryPayrollCodePage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_GL_CODE]: () => require('../../../../pages/workspace/categories/CategoryGLCodePage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_DEFAULT_TAX_RATE]: () => require('../../../../pages/workspace/categories/CategoryDefaultTaxRatePage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_FLAG_AMOUNTS_OVER]: () => require('../../../../pages/workspace/categories/CategoryFlagAmountsOverPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_DESCRIPTION_HINT]: () => require('../../../../pages/workspace/categories/CategoryDescriptionHintPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_REQUIRE_RECEIPTS_OVER]: () => require('../../../../pages/workspace/categories/CategoryRequireReceiptsOverPage').default,
    [SCREENS_1.default.WORKSPACE.CATEGORY_APPROVER]: () => require('../../../../pages/workspace/categories/CategoryApproverPage').default,
    [SCREENS_1.default.WORKSPACE.CREATE_DISTANCE_RATE]: () => require('../../../../pages/workspace/distanceRates/CreateDistanceRatePage').default,
    [SCREENS_1.default.WORKSPACE.DISTANCE_RATES_SETTINGS]: () => require('../../../../pages/workspace/distanceRates/PolicyDistanceRatesSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_DETAILS]: () => require('../../../../pages/workspace/distanceRates/PolicyDistanceRateDetailsPage').default,
    [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_EDIT]: () => require('../../../../pages/workspace/distanceRates/PolicyDistanceRateEditPage').default,
    [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_NAME_EDIT]: () => require('../../../../pages/workspace/distanceRates/PolicyDistanceRateNameEditPage').default,
    [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_TAX_RECLAIMABLE_ON_EDIT]: () => require('../../../../pages/workspace/distanceRates/PolicyDistanceRateTaxReclaimableEditPage').default,
    [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_TAX_RATE_EDIT]: () => require('../../../../pages/workspace/distanceRates/PolicyDistanceRateTaxRateEditPage').default,
    [SCREENS_1.default.WORKSPACE.TAGS_IMPORT]: () => require('../../../../pages/workspace/tags/ImportTagsPage').default,
    [SCREENS_1.default.WORKSPACE.TAGS_IMPORT_OPTIONS]: () => require('../../../../pages/workspace/tags/ImportTagsOptionsPage').default,
    [SCREENS_1.default.WORKSPACE.TAGS_IMPORT_MULTI_LEVEL_SETTINGS]: () => require('../../../../pages/workspace/tags/ImportMultiLevelTagsSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.TAGS_IMPORTED]: () => require('../../../../pages/workspace/tags/ImportedTagsPage').default,
    [SCREENS_1.default.WORKSPACE.TAGS_IMPORTED_MULTI_LEVEL]: () => require('../../../../pages/workspace/tags/ImportedMultiLevelTagsPage').default,
    [SCREENS_1.default.WORKSPACE.TAGS_SETTINGS]: () => require('../../../../pages/workspace/tags/WorkspaceTagsSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.TAG_SETTINGS]: () => require('../../../../pages/workspace/tags/TagSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.TAG_LIST_VIEW]: () => require('../../../../pages/workspace/tags/WorkspaceViewTagsPage').default,
    [SCREENS_1.default.WORKSPACE.TAGS_EDIT]: () => require('../../../../pages/workspace/tags/WorkspaceEditTagsPage').default,
    [SCREENS_1.default.WORKSPACE.TAG_CREATE]: () => require('../../../../pages/workspace/tags/WorkspaceCreateTagPage').default,
    [SCREENS_1.default.WORKSPACE.TAG_EDIT]: () => require('../../../../pages/workspace/tags/EditTagPage').default,
    [SCREENS_1.default.WORKSPACE.TAG_APPROVER]: () => require('../../../../pages/workspace/tags/TagApproverPage').default,
    [SCREENS_1.default.WORKSPACE.TAG_GL_CODE]: () => require('../../../../pages/workspace/tags/TagGLCodePage').default,
    [SCREENS_1.default.WORKSPACE.TAXES_SETTINGS]: () => require('../../../../pages/workspace/taxes/WorkspaceTaxesSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.TAXES_SETTINGS_CUSTOM_TAX_NAME]: () => require('../../../../pages/workspace/taxes/WorkspaceTaxesSettingsCustomTaxName').default,
    [SCREENS_1.default.WORKSPACE.TAXES_SETTINGS_FOREIGN_CURRENCY_DEFAULT]: () => require('../../../../pages/workspace/taxes/WorkspaceTaxesSettingsForeignCurrency').default,
    [SCREENS_1.default.WORKSPACE.TAXES_SETTINGS_WORKSPACE_CURRENCY_DEFAULT]: () => require('../../../../pages/workspace/taxes/WorkspaceTaxesSettingsWorkspaceCurrency').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksExportConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_DATE_SELECT]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksExportDateSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_INVOICE_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksExportInvoiceAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksOutOfPocketExpenseAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksOutOfPocketExpenseConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksOutOfPocketExpenseEntitySelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksNonReimbursableDefaultVendorSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT]: () => require('@pages/workspace/accounting/qbo/export/QuickbooksCompanyCardExpenseAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_COMPANY_CARD_SELECT]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksCompanyCardExpenseAccountSelectCardPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_AUTO_SYNC]: () => require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksAutoSyncPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_ACCOUNTING_METHOD]: () => require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksAccountingMethodPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksCompanyCardExpenseAccountPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_PREFERRED_EXPORTER]: () => require('../../../../pages/workspace/accounting/qbo/export/QuickbooksPreferredExporterConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopCompanyCardExpenseAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_COMPANY_CARD_SELECT]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopCompanyCardExpenseAccountSelectCardPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopNonReimbursableDefaultVendorSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopCompanyCardExpenseAccountPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_DATE_SELECT]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopExportDateSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_PREFERRED_EXPORTER]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopPreferredExporterConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopOutOfPocketExpenseAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopOutOfPocketExpenseConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopOutOfPocketExpenseEntitySelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT]: () => require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopExportPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_ADVANCED]: () => require('../../../../pages/workspace/accounting/qbd/advanced/QuickbooksDesktopAdvancedPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_SETUP_MODAL]: () => require('../../../../pages/workspace/accounting/qbd/QuickBooksDesktopSetupPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_SETUP_REQUIRED_DEVICE_MODAL]: () => require('../../../../pages/workspace/accounting/qbd/RequireQuickBooksDesktopPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_TRIGGER_FIRST_SYNC]: () => require('../../../../pages/workspace/accounting/qbd/QuickBooksDesktopSetupFlowSyncPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_IMPORT]: () => require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopImportPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CHART_OF_ACCOUNTS]: () => require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopChartOfAccountsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CLASSES]: () => require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopClassesPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CLASSES_DISPLAYED_AS]: () => require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopClassesDisplayedAsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CUSTOMERS]: () => require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopCustomersPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CUSTOMERS_DISPLAYED_AS]: () => require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopCustomersDisplayedAsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_ITEMS]: () => require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopItemsPage').default,
    [SCREENS_1.default.REIMBURSEMENT_ACCOUNT]: () => require('../../../../pages/ReimbursementAccount/ReimbursementAccountPage').default,
    [SCREENS_1.default.REIMBURSEMENT_ACCOUNT_ENTER_SIGNER_INFO]: () => require('../../../../pages/ReimbursementAccount/EnterSignerInfo').default,
    [SCREENS_1.default.SETTINGS.REPORT_CARD_LOST_OR_DAMAGED]: () => require('../../../../pages/settings/Wallet/ReportCardLostPage').default,
    [SCREENS_1.default.KEYBOARD_SHORTCUTS]: () => require('../../../../pages/KeyboardShortcutsPage').default,
    [SCREENS_1.default.SETTINGS.EXIT_SURVEY.REASON]: () => require('../../../../pages/settings/ExitSurvey/ExitSurveyReasonPage').default,
    [SCREENS_1.default.SETTINGS.EXIT_SURVEY.RESPONSE]: () => require('../../../../pages/settings/ExitSurvey/ExitSurveyResponsePage').default,
    [SCREENS_1.default.SETTINGS.EXIT_SURVEY.CONFIRM]: () => require('../../../../pages/settings/ExitSurvey/ExitSurveyConfirmPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_IMPORT]: () => require('../../../../pages/workspace/accounting/qbo/import/QuickbooksImportPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CHART_OF_ACCOUNTS]: () => require('../../../../pages/workspace/accounting/qbo/import/QuickbooksChartOfAccountsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CUSTOMERS]: () => require('../../../../pages/workspace/accounting/qbo/import/QuickbooksCustomersPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_TAXES]: () => require('../../../../pages/workspace/accounting/qbo/import/QuickbooksTaxesPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_LOCATIONS]: () => require('../../../../pages/workspace/accounting/qbo/import/QuickbooksLocationsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CLASSES]: () => require('../../../../pages/workspace/accounting/qbo/import/QuickbooksClassesPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CLASSES_DISPLAYED_AS]: () => require('../../../../pages/workspace/accounting/qbo/import/QuickbooksClassesDisplayedAsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CUSTOMERS_DISPLAYED_AS]: () => require('../../../../pages/workspace/accounting/qbo/import/QuickbooksCustomersDisplayedAsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_LOCATIONS_DISPLAYED_AS]: () => require('../../../../pages/workspace/accounting/qbo/import/QuickbooksLocationsDisplayedAsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_ADVANCED]: () => require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksAdvancedPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_ACCOUNT_SELECTOR]: () => require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_INVOICE_ACCOUNT_SELECTOR]: () => require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksInvoiceAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_IMPORT]: () => require('../../../../pages/workspace/accounting/xero/XeroImportPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_ORGANIZATION]: () => require('../../../../pages/workspace/accounting/xero/XeroOrganizationConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_CHART_OF_ACCOUNTS]: () => require('../../../../pages/workspace/accounting/xero/import/XeroChartOfAccountsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_CUSTOMER]: () => require('../../../../pages/workspace/accounting/xero/import/XeroCustomerConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_TAXES]: () => require('../../../../pages/workspace/accounting/xero/XeroTaxesConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_TRACKING_CATEGORIES]: () => require('../../../../pages/workspace/accounting/xero/XeroTrackingCategoryConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_MAP_TRACKING_CATEGORY]: () => require('../../../../pages/workspace/accounting/xero/XeroMapTrackingCategoryConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT]: () => require('../../../../pages/workspace/accounting/xero/export/XeroExportConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT_PURCHASE_BILL_DATE_SELECT]: () => require('../../../../pages/workspace/accounting/xero/export/XeroPurchaseBillDateSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT_BANK_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/xero/export/XeroBankAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_ADVANCED]: () => require('../../../../pages/workspace/accounting/xero/advanced/XeroAdvancedPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_AUTO_SYNC]: () => require('../../../../pages/workspace/accounting/xero/advanced/XeroAutoSyncPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_ACCOUNTING_METHOD]: () => require('../../../../pages/workspace/accounting/xero/advanced/XeroAccountingMethodPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_BILL_STATUS_SELECTOR]: () => require('../../../../pages/workspace/accounting/xero/export/XeroPurchaseBillStatusSelectorPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_INVOICE_ACCOUNT_SELECTOR]: () => require('../../../../pages/workspace/accounting/xero/advanced/XeroInvoiceAccountSelectorPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT_PREFERRED_EXPORTER_SELECT]: () => require('../../../../pages/workspace/accounting/xero/export/XeroPreferredExporterSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_BILL_PAYMENT_ACCOUNT_SELECTOR]: () => require('../../../../pages/workspace/accounting/xero/advanced/XeroBillPaymentAccountSelectorPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_SUBSIDIARY_SELECTOR]: () => require('../../../../pages/workspace/accounting/netsuite/NetSuiteSubsidiarySelector').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_REUSE_EXISTING_CONNECTIONS]: () => require('../../../../pages/workspace/accounting/netsuite/NetSuiteTokenInput/NetSuiteExistingConnectionsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_TOKEN_INPUT]: () => require('../../../../pages/workspace/accounting/netsuite/NetSuiteTokenInput/NetSuiteTokenInputPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT]: () => require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_MAPPING]: () => require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportMappingPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_FIELD]: () => require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_FIELD_VIEW]: () => require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldView').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_FIELD_EDIT]: () => require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldEdit').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_LIST_ADD]: () => require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldNew/NetSuiteImportAddCustomListPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_SEGMENT_ADD]: () => require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldNew/NetSuiteImportAddCustomSegmentPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS]: () => require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomersOrProjectsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomersOrProjectSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportConfigurationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_PREFERRED_EXPORTER_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuitePreferredExporterSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_DATE_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteDateSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_DESTINATION_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesDestinationSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_VENDOR_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesVendorSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_PAYABLE_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesPayableAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_JOURNAL_POSTING_PREFERENCE_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesJournalPostingPreferenceSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_RECEIVABLE_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteReceivableAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_INVOICE_ITEM_PREFERENCE_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteInvoiceItemPreferenceSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_INVOICE_ITEM_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteInvoiceItemSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_TAX_POSTING_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteTaxPostingAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_PROVINCIAL_TAX_POSTING_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteProvincialTaxPostingAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_ADVANCED]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteAdvancedPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_REIMBURSEMENT_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteReimbursementAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_COLLECTION_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteCollectionAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPENSE_REPORT_APPROVAL_LEVEL_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteExpenseReportApprovalLevelSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_VENDOR_BILL_APPROVAL_LEVEL_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteVendorBillApprovalLevelSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_JOURNAL_ENTRY_APPROVAL_LEVEL_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteJournalEntryApprovalLevelSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_APPROVAL_ACCOUNT_SELECT]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteApprovalAccountSelectPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_CUSTOM_FORM_ID]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteCustomFormIDPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_AUTO_SYNC]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteAutoSyncPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_ACCOUNTING_METHOD]: () => require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteAccountingMethodPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_PREREQUISITES]: () => require('../../../../pages/workspace/accounting/intacct/SageIntacctPrerequisitesPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.ENTER_SAGE_INTACCT_CREDENTIALS]: () => require('../../../../pages/workspace/accounting/intacct/EnterSageIntacctCredentialsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.EXISTING_SAGE_INTACCT_CONNECTIONS]: () => require('../../../../pages/workspace/accounting/intacct/ExistingConnectionsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ENTITY]: () => require('../../../../pages/workspace/accounting/intacct/SageIntacctEntityPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_EXPORT]: () => require('../../../../pages/workspace/accounting/intacct/export/SageIntacctExportPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_PREFERRED_EXPORTER]: () => require('../../../../pages/workspace/accounting/intacct/export/SageIntacctPreferredExporterPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_EXPORT_DATE]: () => require('../../../../pages/workspace/accounting/intacct/export/SageIntacctDatePage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_REIMBURSABLE_EXPENSES]: () => require('../../../../pages/workspace/accounting/intacct/export/SageIntacctReimbursableExpensesPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES]: () => require('../../../../pages/workspace/accounting/intacct/export/SageIntacctNonReimbursableExpensesPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_REIMBURSABLE_DESTINATION]: () => require('../../../../pages/workspace/accounting/intacct/export/SageIntacctReimbursableExpensesDestinationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_NON_REIMBURSABLE_DESTINATION]: () => require('../../../../pages/workspace/accounting/intacct/export/SageIntacctNonReimbursableExpensesDestinationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_DEFAULT_VENDOR]: () => require('../../../../pages/workspace/accounting/intacct/export/SageIntacctDefaultVendorPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_NON_REIMBURSABLE_CREDIT_CARD_ACCOUNT]: () => require('../../../../pages/workspace/accounting/intacct/export/SageIntacctNonReimbursableCreditCardAccountPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ADVANCED]: () => require('../../../../pages/workspace/accounting/intacct/advanced/SageIntacctAdvancedPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_AUTO_SYNC]: () => require('../../../../pages/workspace/accounting/intacct/advanced/SageIntacctAutoSyncPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ACCOUNTING_METHOD]: () => require('../../../../pages/workspace/accounting/intacct/advanced/SageIntacctAccountingMethodPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_PAYMENT_ACCOUNT]: () => require('../../../../pages/workspace/accounting/intacct/advanced/SageIntacctPaymentAccountPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.CARD_RECONCILIATION]: () => require('../../../../pages/workspace/accounting/reconciliation/CardReconciliationPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.RECONCILIATION_ACCOUNT_SETTINGS]: () => require('../../../../pages/workspace/accounting/reconciliation/ReconciliationAccountSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.WORKFLOWS_AUTO_REPORTING_FREQUENCY]: () => require('../../../../pages/workspace/workflows/WorkspaceAutoReportingFrequencyPage').default,
    [SCREENS_1.default.WORKSPACE.WORKFLOWS_AUTO_REPORTING_MONTHLY_OFFSET]: () => require('../../../../pages/workspace/workflows/WorkspaceAutoReportingMonthlyOffsetPage').default,
    [SCREENS_1.default.WORKSPACE.TAX_EDIT]: () => require('../../../../pages/workspace/taxes/WorkspaceEditTaxPage').default,
    [SCREENS_1.default.WORKSPACE.TAX_NAME]: () => require('../../../../pages/workspace/taxes/NamePage').default,
    [SCREENS_1.default.WORKSPACE.TAX_VALUE]: () => require('../../../../pages/workspace/taxes/ValuePage').default,
    [SCREENS_1.default.WORKSPACE.TAX_CREATE]: () => require('../../../../pages/workspace/taxes/WorkspaceCreateTaxPage').default,
    [SCREENS_1.default.WORKSPACE.TAX_CODE]: () => require('../../../../pages/workspace/taxes/WorkspaceTaxCodePage').default,
    [SCREENS_1.default.WORKSPACE.INVOICES_COMPANY_NAME]: () => require('../../../../pages/workspace/invoices/WorkspaceInvoicingDetailsName').default,
    [SCREENS_1.default.WORKSPACE.INVOICES_COMPANY_WEBSITE]: () => require('../../../../pages/workspace/invoices/WorkspaceInvoicingDetailsWebsite').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_ASSIGN_CARD]: () => require('../../../../pages/workspace/companyCards/assignCard/AssignCardFeedPage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SELECT_FEED]: () => require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardFeedSelectorPage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_BANK_CONNECTION]: () => require('../../../../pages/workspace/companyCards/BankConnection').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_ADD_NEW]: () => require('../../../../pages/workspace/companyCards/addNew/AddNewCardPage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_TRANSACTION_START_DATE]: () => require('../../../../pages/workspace/companyCards/assignCard/TransactionStartDateSelectorPage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARD_DETAILS]: () => require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardDetailsPage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARD_NAME]: () => require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardEditCardNamePage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARD_EXPORT]: () => require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardAccountSelectCardPage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_ISSUE_NEW]: () => require('../../../../pages/workspace/expensifyCard/issueNew/IssueNewCardPage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SETTINGS]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceCardSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SETTINGS_ACCOUNT]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceSettlementAccountPage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SETTINGS_FREQUENCY]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceSettlementFrequencyPage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SELECT_FEED]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceExpensifyCardSelectorPage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_BANK_ACCOUNT]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceExpensifyCardBankAccounts').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_DETAILS]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceExpensifyCardDetailsPage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_NAME]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardNamePage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_LIMIT]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardLimitPage').default,
    [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_LIMIT_TYPE]: () => require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardLimitTypePage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SETTINGS]: () => require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardsSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SETTINGS_FEED_NAME]: () => require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardsSettingsFeedNamePage').default,
    [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SETTINGS_STATEMENT_CLOSE_DATE]: () => require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardStatementCloseDatePage').default,
    [SCREENS_1.default.SETTINGS.SAVE_THE_WORLD]: () => require('../../../../pages/TeachersUnite/SaveTheWorldPage').default,
    [SCREENS_1.default.SETTINGS.SUBSCRIPTION.CHANGE_PAYMENT_CURRENCY]: () => require('../../../../pages/settings/PaymentCard/ChangeCurrency').default,
    [SCREENS_1.default.SETTINGS.SUBSCRIPTION.CHANGE_BILLING_CURRENCY]: () => require('../../../../pages/settings/Subscription/PaymentCard/ChangeBillingCurrency').default,
    [SCREENS_1.default.SETTINGS.SUBSCRIPTION.ADD_PAYMENT_CARD]: () => require('../../../../pages/settings/Subscription/PaymentCard').default,
    [SCREENS_1.default.SETTINGS.ADD_PAYMENT_CARD_CHANGE_CURRENCY]: () => require('../../../../pages/settings/PaymentCard/ChangeCurrency').default,
    [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_CREATE]: () => require('../../../../pages/workspace/reports/CreateReportFieldsPage').default,
    [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_SETTINGS]: () => require('../../../../pages/workspace/reports/ReportFieldsSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_LIST_VALUES]: () => require('../../../../pages/workspace/reports/ReportFieldsListValuesPage').default,
    [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_ADD_VALUE]: () => require('../../../../pages/workspace/reports/ReportFieldsAddListValuePage').default,
    [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_VALUE_SETTINGS]: () => require('../../../../pages/workspace/reports/ReportFieldsValueSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_EDIT_INITIAL_VALUE]: () => require('../../../../pages/workspace/reports/ReportFieldsInitialValuePage').default,
    [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_EDIT_VALUE]: () => require('../../../../pages/workspace/reports/ReportFieldsEditValuePage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_IMPORT]: () => require('../../../../pages/workspace/accounting/intacct/import/SageIntacctImportPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_TOGGLE_MAPPING]: () => require('../../../../pages/workspace/accounting/intacct/import/SageIntacctToggleMappingsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_MAPPING_TYPE]: () => require('../../../../pages/workspace/accounting/intacct/import/SageIntacctMappingsTypePage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_IMPORT_TAX]: () => require('../../../../pages/workspace/accounting/intacct/import/SageIntacctImportTaxPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_IMPORT_TAX_MAPPING]: () => {
        return require('../../../../pages/workspace/accounting/intacct/import/SageIntacctImportTaxMappingPage').default;
    },
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_USER_DIMENSIONS]: () => require('../../../../pages/workspace/accounting/intacct/import/SageIntacctUserDimensionsPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ADD_USER_DIMENSION]: () => require('../../../../pages/workspace/accounting/intacct/import/SageIntacctAddUserDimensionPage').default,
    [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_EDIT_USER_DIMENSION]: () => require('../../../../pages/workspace/accounting/intacct/import/SageIntacctEditUserDimensionsPage').default,
    [SCREENS_1.default.SETTINGS.DELEGATE.VERIFY_ACCOUNT]: () => require('../../../../pages/settings/Security/AddDelegate/VerifyAccountPage').default,
    [SCREENS_1.default.SETTINGS.DELEGATE.ADD_DELEGATE]: () => require('../../../../pages/settings/Security/AddDelegate/AddDelegatePage').default,
    [SCREENS_1.default.SETTINGS.DELEGATE.DELEGATE_ROLE]: () => require('../../../../pages/settings/Security/AddDelegate/SelectDelegateRolePage').default,
    [SCREENS_1.default.SETTINGS.DELEGATE.UPDATE_DELEGATE_ROLE]: () => require('../../../../pages/settings/Security/AddDelegate/UpdateDelegateRole/UpdateDelegateRolePage').default,
    [SCREENS_1.default.SETTINGS.DELEGATE.DELEGATE_CONFIRM]: () => require('../../../../pages/settings/Security/AddDelegate/ConfirmDelegatePage').default,
    [SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.ACCOUNT_DETAILS]: () => require('../../../../pages/settings/Security/MergeAccounts/AccountDetailsPage').default,
    [SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.ACCOUNT_VALIDATE]: () => require('../../../../pages/settings/Security/MergeAccounts/AccountValidatePage').default,
    [SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.MERGE_RESULT]: () => require('../../../../pages/settings/Security/MergeAccounts/MergeResultPage').default,
    [SCREENS_1.default.SETTINGS.LOCK.LOCK_ACCOUNT]: () => require('../../../../pages/settings/Security/LockAccount/LockAccountPage').default,
    [SCREENS_1.default.SETTINGS.LOCK.UNLOCK_ACCOUNT]: () => require('../../../../pages/settings/Security/LockAccount/UnlockAccountPage').default,
    [SCREENS_1.default.SETTINGS.LOCK.FAILED_TO_LOCK_ACCOUNT]: () => require('../../../../pages/settings/Security/LockAccount/FailedToLockAccountPage').default,
    [SCREENS_1.default.WORKSPACE.REPORTS_DEFAULT_TITLE]: () => require('../../../../pages/workspace/reports/ReportsDefaultTitle').default,
    [SCREENS_1.default.WORKSPACE.RULES_AUTO_APPROVE_REPORTS_UNDER]: () => require('../../../../pages/workspace/rules/RulesAutoApproveReportsUnderPage').default,
    [SCREENS_1.default.WORKSPACE.RULES_RANDOM_REPORT_AUDIT]: () => require('../../../../pages/workspace/rules/RulesRandomReportAuditPage').default,
    [SCREENS_1.default.WORKSPACE.RULES_AUTO_PAY_REPORTS_UNDER]: () => require('../../../../pages/workspace/rules/RulesAutoPayReportsUnderPage').default,
    [SCREENS_1.default.WORKSPACE.RULES_RECEIPT_REQUIRED_AMOUNT]: () => require('../../../../pages/workspace/rules/RulesReceiptRequiredAmountPage').default,
    [SCREENS_1.default.WORKSPACE.RULES_MAX_EXPENSE_AMOUNT]: () => require('../../../../pages/workspace/rules/RulesMaxExpenseAmountPage').default,
    [SCREENS_1.default.WORKSPACE.RULES_MAX_EXPENSE_AGE]: () => require('../../../../pages/workspace/rules/RulesMaxExpenseAgePage').default,
    [SCREENS_1.default.WORKSPACE.RULES_BILLABLE_DEFAULT]: () => require('../../../../pages/workspace/rules/RulesBillableDefaultPage').default,
    [SCREENS_1.default.WORKSPACE.RULES_REIMBURSABLE_DEFAULT]: () => require('../../../../pages/workspace/rules/RulesReimbursableDefaultPage').default,
    [SCREENS_1.default.WORKSPACE.RULES_CUSTOM]: () => require('../../../../pages/workspace/rules/RulesCustomPage').default,
    [SCREENS_1.default.WORKSPACE.RULES_PROHIBITED_DEFAULT]: () => require('../../../../pages/workspace/rules/RulesProhibitedDefaultPage').default,
    [SCREENS_1.default.WORKSPACE.PER_DIEM_IMPORT]: () => require('../../../../pages/workspace/perDiem/ImportPerDiemPage').default,
    [SCREENS_1.default.WORKSPACE.PER_DIEM_IMPORTED]: () => require('../../../../pages/workspace/perDiem/ImportedPerDiemPage').default,
    [SCREENS_1.default.WORKSPACE.PER_DIEM_SETTINGS]: () => require('../../../../pages/workspace/perDiem/WorkspacePerDiemSettingsPage').default,
    [SCREENS_1.default.WORKSPACE.PER_DIEM_DETAILS]: () => require('../../../../pages/workspace/perDiem/WorkspacePerDiemDetailsPage').default,
    [SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_DESTINATION]: () => require('../../../../pages/workspace/perDiem/EditPerDiemDestinationPage').default,
    [SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_SUBRATE]: () => require('../../../../pages/workspace/perDiem/EditPerDiemSubratePage').default,
    [SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_AMOUNT]: () => require('../../../../pages/workspace/perDiem/EditPerDiemAmountPage').default,
    [SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_CURRENCY]: () => require('../../../../pages/workspace/perDiem/EditPerDiemCurrencyPage').default,
    [SCREENS_1.default.WORKSPACE.RECEIPT_PARTNERS_INVITE]: () => require('../../../../pages/workspace/receiptPartners/InviteReceiptPartnerPolicyPage').default,
    [SCREENS_1.default.WORKSPACE.RECEIPT_PARTNERS_INVITE_EDIT]: () => require('../../../../pages/workspace/receiptPartners/EditInviteReceiptPartnerPolicyPage').default,
});
exports.SettingsModalStackNavigator = SettingsModalStackNavigator;
const TwoFactorAuthenticatorStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.TWO_FACTOR_AUTH.ROOT]: () => require('../../../../pages/settings/Security/TwoFactorAuth/TwoFactorAuthPage').default,
    [SCREENS_1.default.TWO_FACTOR_AUTH.VERIFY]: () => require('../../../../pages/settings/Security/TwoFactorAuth/VerifyPage').default,
    [SCREENS_1.default.TWO_FACTOR_AUTH.DISABLED]: () => require('../../../../pages/settings/Security/TwoFactorAuth/DisabledPage').default,
    [SCREENS_1.default.TWO_FACTOR_AUTH.DISABLE]: () => require('../../../../pages/settings/Security/TwoFactorAuth/DisablePage').default,
    [SCREENS_1.default.TWO_FACTOR_AUTH.SUCCESS]: () => require('../../../../pages/settings/Security/TwoFactorAuth/SuccessPage').default,
});
exports.TwoFactorAuthenticatorStackNavigator = TwoFactorAuthenticatorStackNavigator;
const EnablePaymentsStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.ENABLE_PAYMENTS_ROOT]: () => require('../../../../pages/EnablePayments/EnablePaymentsPage').default,
});
exports.EnablePaymentsStackNavigator = EnablePaymentsStackNavigator;
const AddPersonalBankAccountModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.ADD_PERSONAL_BANK_ACCOUNT_ROOT]: () => require('../../../../pages/AddPersonalBankAccountPage').default,
});
exports.AddPersonalBankAccountModalStackNavigator = AddPersonalBankAccountModalStackNavigator;
const WalletStatementStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.WALLET_STATEMENT_ROOT]: () => require('../../../../pages/wallet/WalletStatementPage').default,
});
exports.WalletStatementStackNavigator = WalletStatementStackNavigator;
const FlagCommentStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.FLAG_COMMENT_ROOT]: () => require('../../../../pages/FlagCommentPage').default,
});
exports.FlagCommentStackNavigator = FlagCommentStackNavigator;
const EditRequestStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.EDIT_REQUEST.REPORT_FIELD]: () => require('../../../../pages/EditReportFieldPage').default,
});
exports.EditRequestStackNavigator = EditRequestStackNavigator;
const PrivateNotesModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.PRIVATE_NOTES.LIST]: () => require('../../../../pages/PrivateNotes/PrivateNotesListPage').default,
    [SCREENS_1.default.PRIVATE_NOTES.EDIT]: () => require('../../../../pages/PrivateNotes/PrivateNotesEditPage').default,
});
exports.PrivateNotesModalStackNavigator = PrivateNotesModalStackNavigator;
const SignInModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SIGN_IN_ROOT]: () => require('../../../../pages/signin/SignInModal').default,
});
exports.SignInModalStackNavigator = SignInModalStackNavigator;
const ReferralModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.REFERRAL_DETAILS]: () => require('../../../../pages/ReferralDetailsPage').default,
});
exports.ReferralModalStackNavigator = ReferralModalStackNavigator;
const TransactionDuplicateStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.TRANSACTION_DUPLICATE.REVIEW]: () => require('../../../../pages/TransactionDuplicate/Review').default,
    [SCREENS_1.default.TRANSACTION_DUPLICATE.MERCHANT]: () => require('../../../../pages/TransactionDuplicate/ReviewMerchant').default,
    [SCREENS_1.default.TRANSACTION_DUPLICATE.CATEGORY]: () => require('../../../../pages/TransactionDuplicate/ReviewCategory').default,
    [SCREENS_1.default.TRANSACTION_DUPLICATE.TAG]: () => require('../../../../pages/TransactionDuplicate/ReviewTag').default,
    [SCREENS_1.default.TRANSACTION_DUPLICATE.DESCRIPTION]: () => require('../../../../pages/TransactionDuplicate/ReviewDescription').default,
    [SCREENS_1.default.TRANSACTION_DUPLICATE.TAX_CODE]: () => require('../../../../pages/TransactionDuplicate/ReviewTaxCode').default,
    [SCREENS_1.default.TRANSACTION_DUPLICATE.BILLABLE]: () => require('../../../../pages/TransactionDuplicate/ReviewBillable').default,
    [SCREENS_1.default.TRANSACTION_DUPLICATE.REIMBURSABLE]: () => require('../../../../pages/TransactionDuplicate/ReviewReimbursable').default,
    [SCREENS_1.default.TRANSACTION_DUPLICATE.CONFIRMATION]: () => require('../../../../pages/TransactionDuplicate/Confirmation').default,
});
exports.TransactionDuplicateStackNavigator = TransactionDuplicateStackNavigator;
const MergeTransactionStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.MERGE_TRANSACTION.LIST_PAGE]: () => require('../../../../pages/TransactionMerge/MergeTransactionsListPage').default,
    [SCREENS_1.default.MERGE_TRANSACTION.RECEIPT_PAGE]: () => require('../../../../pages/TransactionMerge/ReceiptReviewPage').default,
    [SCREENS_1.default.MERGE_TRANSACTION.DETAILS_PAGE]: () => require('../../../../pages/TransactionMerge/DetailsReviewPage').default,
    [SCREENS_1.default.MERGE_TRANSACTION.CONFIRMATION_PAGE]: () => require('../../../../pages/TransactionMerge/ConfirmationPage').default,
});
exports.MergeTransactionStackNavigator = MergeTransactionStackNavigator;
const SearchReportModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SEARCH.REPORT_RHP]: () => require('../../../../pages/home/ReportScreen').default,
    [SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS]: () => require('../../../../pages/Search/SearchHoldReasonPage').default,
    [SCREENS_1.default.SEARCH.TRANSACTION_HOLD_REASON_RHP]: () => require('../../../../pages/Search/SearchHoldReasonPage').default,
    [SCREENS_1.default.SEARCH.TRANSACTIONS_CHANGE_REPORT_SEARCH_RHP]: () => require('../../../../pages/Search/SearchTransactionsChangeReport').default,
});
exports.SearchReportModalStackNavigator = SearchReportModalStackNavigator;
const SearchAdvancedFiltersModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TYPE_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersTypePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_GROUP_BY_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersGroupByPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_STATUS_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersStatusPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_DATE_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersDatePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_SUBMITTED_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersSubmittedPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_APPROVED_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersApprovedPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_PAID_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersPaidPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_EXPORTED_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersExportedPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_POSTED_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersPostedPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WITHDRAWN_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersWithdrawnPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_CURRENCY_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersCurrencyPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_GROUP_CURRENCY_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersGroupCurrencyPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_DESCRIPTION_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersDescriptionPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_MERCHANT_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersMerchantPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_REPORT_ID_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersReportIDPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_AMOUNT_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersAmountPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TOTAL_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersTotalPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_CATEGORY_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersCategoryPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_KEYWORD_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersKeywordPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_CARD_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersCardPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TAX_RATE_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersTaxRatePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_EXPENSE_TYPE_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersExpenseTypePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WITHDRAWAL_TYPE_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersWithdrawalTypePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TAG_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersTagPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_HAS_RHP]: () => require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersHasPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_FROM_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersFromPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TO_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersToPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_IN_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersInPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TITLE_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersTitlePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_ASSIGNEE_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersAssigneePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_BILLABLE_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersBillablePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_REIMBURSABLE_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersReimbursablePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WORKSPACE_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersWorkspacePage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_PURCHASE_AMOUNT_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersPurchaseAmountPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_PURCHASE_CURRENCY_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersPurchaseCurrencyPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WITHDRAWAL_ID_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersWithdrawalIDPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_ACTION_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersActionPage').default,
    [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_ATTENDEE_RHP]: () => require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersAttendeePage').default,
});
exports.SearchAdvancedFiltersModalStackNavigator = SearchAdvancedFiltersModalStackNavigator;
const SearchSavedSearchModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SEARCH.SAVED_SEARCH_RENAME_RHP]: () => require('../../../../pages/Search/SavedSearchRenamePage').default,
});
exports.SearchSavedSearchModalStackNavigator = SearchSavedSearchModalStackNavigator;
const RestrictedActionModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.RESTRICTED_ACTION_ROOT]: () => require('../../../../pages/RestrictedAction/Workspace/WorkspaceRestrictedActionPage').default,
});
exports.RestrictedActionModalStackNavigator = RestrictedActionModalStackNavigator;
const ShareModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SHARE.ROOT]: () => require('@pages/Share/ShareRootPage').default,
    [SCREENS_1.default.SHARE.SHARE_DETAILS]: () => require('@pages/Share/ShareDetailsPage').default,
    [SCREENS_1.default.SHARE.SUBMIT_DETAILS]: () => require('@pages/Share/SubmitDetailsPage').default,
});
exports.ShareModalStackNavigator = ShareModalStackNavigator;
const MissingPersonalDetailsModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.MISSING_PERSONAL_DETAILS_ROOT]: () => require('../../../../pages/MissingPersonalDetails').default,
});
exports.MissingPersonalDetailsModalStackNavigator = MissingPersonalDetailsModalStackNavigator;
const AddUnreportedExpenseModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.ADD_UNREPORTED_EXPENSES_ROOT]: () => require('../../../../pages/AddUnreportedExpense').default,
});
exports.AddUnreportedExpenseModalStackNavigator = AddUnreportedExpenseModalStackNavigator;
const DebugModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.DEBUG.REPORT]: () => require('../../../../pages/Debug/Report/DebugReportPage').default,
    [SCREENS_1.default.DEBUG.REPORT_ACTION]: () => require('../../../../pages/Debug/ReportAction/DebugReportActionPage').default,
    [SCREENS_1.default.DEBUG.REPORT_ACTION_CREATE]: () => require('../../../../pages/Debug/ReportAction/DebugReportActionCreatePage').default,
    [SCREENS_1.default.DEBUG.DETAILS_CONSTANT_PICKER_PAGE]: () => require('../../../../pages/Debug/DebugDetailsConstantPickerPage').default,
    [SCREENS_1.default.DEBUG.DETAILS_DATE_TIME_PICKER_PAGE]: () => require('../../../../pages/Debug/DebugDetailsDateTimePickerPage').default,
    [SCREENS_1.default.DEBUG.TRANSACTION]: () => require('../../../../pages/Debug/Transaction/DebugTransactionPage').default,
    [SCREENS_1.default.DEBUG.TRANSACTION_VIOLATION_CREATE]: () => require('../../../../pages/Debug/TransactionViolation/DebugTransactionViolationCreatePage').default,
    [SCREENS_1.default.DEBUG.TRANSACTION_VIOLATION]: () => require('../../../../pages/Debug/TransactionViolation/DebugTransactionViolationPage').default,
});
exports.DebugModalStackNavigator = DebugModalStackNavigator;
const ScheduleCallModalStackNavigator = createModalStackNavigator({
    [SCREENS_1.default.SCHEDULE_CALL.BOOK]: () => require('../../../../pages/ScheduleCall/ScheduleCallPage').default,
    [SCREENS_1.default.SCHEDULE_CALL.CONFIRMATION]: () => require('../../../../pages/ScheduleCall/ScheduleCallConfirmationPage').default,
});
exports.ScheduleCallModalStackNavigator = ScheduleCallModalStackNavigator;
