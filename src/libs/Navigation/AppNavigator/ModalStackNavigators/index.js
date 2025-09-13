"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeTransactionStackNavigator = exports.ScheduleCallModalStackNavigator = exports.AddUnreportedExpenseModalStackNavigator = exports.ConsoleModalStackNavigator = exports.WorkspaceDuplicateModalStackNavigator = exports.WorkspaceConfirmationModalStackNavigator = exports.DebugModalStackNavigator = exports.MissingPersonalDetailsModalStackNavigator = exports.SearchSavedSearchModalStackNavigator = exports.ShareModalStackNavigator = exports.SearchAdvancedFiltersModalStackNavigator = exports.RestrictedActionModalStackNavigator = exports.SearchReportModalStackNavigator = exports.TransactionDuplicateStackNavigator = exports.WalletStatementStackNavigator = exports.TaskModalStackNavigator = exports.SplitDetailsModalStackNavigator = exports.DomainCardModalStackNavigator = exports.ExpensifyCardModalStackNavigator = exports.TagsModalStackNavigator = exports.CategoriesModalStackNavigator = exports.SignInModalStackNavigator = exports.TwoFactorAuthenticatorStackNavigator = exports.SettingsModalStackNavigator = exports.RoomMembersModalStackNavigator = exports.ReportSettingsModalStackNavigator = exports.ReportParticipantsModalStackNavigator = exports.ReportChangeApproverModalStackNavigator = exports.ReportChangeWorkspaceModalStackNavigator = exports.ReportDetailsModalStackNavigator = exports.ReportDescriptionModalStackNavigator = exports.NewReportWorkspaceSelectionModalStackNavigator = exports.TravelModalStackNavigator = exports.ReferralModalStackNavigator = exports.ProfileModalStackNavigator = exports.PrivateNotesModalStackNavigator = exports.NewTeachersUniteNavigator = exports.NewTaskModalStackNavigator = exports.NewChatModalStackNavigator = exports.MoneyRequestModalStackNavigator = exports.FlagCommentStackNavigator = exports.EnablePaymentsStackNavigator = exports.EditRequestStackNavigator = exports.AddPersonalBankAccountModalStackNavigator = void 0;
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var WideRHPContextProvider_1 = require("@components/WideRHPContextProvider");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Overlay_1 = require("@libs/Navigation/AppNavigator/Navigators/Overlay");
var createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
var animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
var SCREENS_1 = require("@src/SCREENS");
var useModalStackScreenOptions_1 = require("./useModalStackScreenOptions");
var OPTIONS_PER_SCREEN = (_a = {},
    _a[SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.MERGE_RESULT] = {
        animationTypeForReplace: 'push',
    },
    _a[SCREENS_1.default.SEARCH.REPORT_RHP] = {
        animation: animation_1.default.NONE,
    },
    _a[SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS] = {
        animation: animation_1.default.NONE,
    },
    _a[SCREENS_1.default.SEARCH.TRANSACTION_HOLD_REASON_RHP] = {
        animation: animation_1.default.NONE,
    },
    _a[SCREENS_1.default.SEARCH.TRANSACTIONS_CHANGE_REPORT_SEARCH_RHP] = {
        animation: animation_1.default.NONE,
    },
    _a);
/**
 * Create a modal stack navigator with an array of sub-screens.
 *
 * @param screens key/value pairs where the key is the name of the screen and the value is a function that returns the lazy-loaded component
 */
function createModalStackNavigator(screens) {
    var ModalStackNavigator = (0, createPlatformStackNavigator_1.default)();
    function ModalStack() {
        var styles = (0, useThemeStyles_1.default)();
        var screenOptions = (0, useModalStackScreenOptions_1.default)();
        var _a = (0, react_1.useContext)(WideRHPContextProvider_1.WideRHPContext), secondOverlayProgress = _a.secondOverlayProgress, shouldRenderSecondaryOverlay = _a.shouldRenderSecondaryOverlay;
        var route = (0, native_1.useRoute)();
        // We have to use the isSmallScreenWidth instead of shouldUseNarrow layout, because we want to have information about screen width without the context of side modal.
        // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
        var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
        var getScreenOptions = (0, react_1.useCallback)(function (_a) {
            var optionRoute = _a.route;
            // Extend common options if they are defined for the screen.
            if (OPTIONS_PER_SCREEN[optionRoute.name]) {
                return __assign(__assign({}, screenOptions({ route: optionRoute })), OPTIONS_PER_SCREEN[optionRoute.name]);
            }
            return screenOptions({ route: optionRoute });
        }, [screenOptions]);
        return (
        // This container is necessary to hide card translation during transition. Without it the user would see un-clipped cards.
        <react_native_1.View style={styles.modalStackNavigatorContainer(isSmallScreenWidth)}>
                <ModalStackNavigator.Navigator>
                    {Object.keys(screens).map(function (name) { return (<ModalStackNavigator.Screen key={name} name={name} getComponent={screens[name]} 
            // For some reason, screenOptions is not working with function as options so we have to pass it to every screen.
            options={getScreenOptions}/>); })}
                </ModalStackNavigator.Navigator>
                {!isSmallScreenWidth && shouldRenderSecondaryOverlay && route.name === SCREENS_1.default.RIGHT_MODAL.SEARCH_REPORT ? (
            // This overlay is necessary to cover the gap under the narrow format RHP screen
            <Overlay_1.default progress={secondOverlayProgress} hasMarginLeft/>) : null}
            </react_native_1.View>);
    }
    ModalStack.displayName = 'ModalStack';
    return ModalStack;
}
var MoneyRequestModalStackNavigator = createModalStackNavigator((_b = {},
    _b[SCREENS_1.default.MONEY_REQUEST.START] = function () { return require('../../../../pages/iou/request/IOURequestRedirectToStartPage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.CREATE] = function () { return require('../../../../pages/iou/request/IOURequestStartPage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_CONFIRMATION] = function () { return require('../../../../pages/iou/request/step/IOURequestStepConfirmation').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_AMOUNT] = function () { return require('../../../../pages/iou/request/step/IOURequestStepAmount').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_TAX_AMOUNT] = function () { return require('../../../../pages/iou/request/step/IOURequestStepTaxAmountPage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_TAX_RATE] = function () { return require('../../../../pages/iou/request/step/IOURequestStepTaxRatePage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_CATEGORY] = function () { return require('../../../../pages/iou/request/step/IOURequestStepCategory').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_CURRENCY] = function () { return require('../../../../pages/iou/request/step/IOURequestStepCurrency').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_DATE] = function () { return require('../../../../pages/iou/request/step/IOURequestStepDate').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_DESCRIPTION] = function () { return require('../../../../pages/iou/request/step/IOURequestStepDescription').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE] = function () { return require('../../../../pages/iou/request/step/IOURequestStepDistance').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE_RATE] = function () { return require('@pages/iou/request/step/IOURequestStepDistanceRate').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_MERCHANT] = function () { return require('../../../../pages/iou/request/step/IOURequestStepMerchant').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_PARTICIPANTS] = function () { return require('../../../../pages/iou/request/step/IOURequestStepParticipants').default; },
    _b[SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_ROOT] = function () { return require('../../../../pages/workspace/categories/WorkspaceCategoriesPage').default; },
    _b[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_ROOT] = function () { return require('../../../../pages/workspace/tags/WorkspaceTagsPage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.EDIT_REPORT] = function () { return require('../../../../pages/iou/request/step/IOURequestEditReport').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_SCAN] = function () { return require('../../../../pages/iou/request/step/IOURequestStepScan').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_TAG] = function () { return require('../../../../pages/iou/request/step/IOURequestStepTag').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_WAYPOINT] = function () { return require('../../../../pages/iou/request/step/IOURequestStepWaypoint').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_SPLIT_PAYER] = function () { return require('../../../../pages/iou/request/step/IOURequestStepSplitPayer').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_SEND_FROM] = function () { return require('../../../../pages/iou/request/step/IOURequestStepSendFrom').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_REPORT] = function () { return require('../../../../pages/iou/request/step/IOURequestStepReport').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_COMPANY_INFO] = function () { return require('../../../../pages/iou/request/step/IOURequestStepCompanyInfo').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.HOLD] = function () { return require('../../../../pages/iou/HoldReasonPage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.REJECT] = function () { return require('../../../../pages/iou/RejectReasonPage').default; },
    _b[SCREENS_1.default.IOU_SEND.ADD_BANK_ACCOUNT] = function () { return require('../../../../pages/AddPersonalBankAccountPage').default; },
    _b[SCREENS_1.default.IOU_SEND.ADD_DEBIT_CARD] = function () { return require('../../../../pages/settings/Wallet/AddDebitCardPage').default; },
    _b[SCREENS_1.default.IOU_SEND.ENABLE_PAYMENTS] = function () { return require('../../../../pages/EnablePayments/EnablePaymentsPage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STATE_SELECTOR] = function () { return require('../../../../pages/settings/Profile/PersonalDetails/StateSelectionPage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_ATTENDEES] = function () { return require('../../../../pages/iou/request/step/IOURequestStepAttendees').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_ACCOUNTANT] = function () { return require('../../../../pages/iou/request/step/IOURequestStepAccountant').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_UPGRADE] = function () { return require('../../../../pages/iou/request/step/IOURequestStepUpgrade').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_DESTINATION] = function () { return require('../../../../pages/iou/request/step/IOURequestStepDestination').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_TIME] = function () { return require('../../../../pages/iou/request/step/IOURequestStepTime').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_SUBRATE] = function () { return require('../../../../pages/iou/request/step/IOURequestStepSubrate').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_DESTINATION_EDIT] = function () { return require('../../../../pages/iou/request/step/IOURequestStepDestination').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_TIME_EDIT] = function () { return require('../../../../pages/iou/request/step/IOURequestStepTime').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_SUBRATE_EDIT] = function () { return require('../../../../pages/iou/request/step/IOURequestStepSubrate').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.RECEIPT_VIEW] = function () { return require('../../../../pages/iou/request/step/IOURequestStepScan/ReceiptView').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.SPLIT_EXPENSE] = function () { return require('../../../../pages/iou/SplitExpensePage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.SPLIT_EXPENSE_EDIT] = function () { return require('../../../../pages/iou/SplitExpenseEditPage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.DISTANCE_CREATE] = function () { return require('../../../../pages/iou/request/DistanceRequestStartPage').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE_MAP] = function () { return require('../../../../pages/iou/request/step/IOURequestStepDistanceMap').default; },
    _b[SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE_MANUAL] = function () { return require('../../../../pages/iou/request/step/IOURequestStepDistanceManual').default; },
    _b));
exports.MoneyRequestModalStackNavigator = MoneyRequestModalStackNavigator;
var TravelModalStackNavigator = createModalStackNavigator((_c = {},
    _c[SCREENS_1.default.TRAVEL.MY_TRIPS] = function () { return require('../../../../pages/Travel/MyTripsPage').default; },
    _c[SCREENS_1.default.TRAVEL.TRAVEL_DOT_LINK_WEB_VIEW] = function () { return require('../../../../pages/Travel/TravelDotLinkWebview').default; },
    _c[SCREENS_1.default.TRAVEL.TCS] = function () { return require('../../../../pages/Travel/TravelTerms').default; },
    _c[SCREENS_1.default.TRAVEL.UPGRADE] = function () { return require('../../../../pages/Travel/TravelUpgrade').default; },
    _c[SCREENS_1.default.TRAVEL.TRIP_SUMMARY] = function () { return require('../../../../pages/Travel/TripSummaryPage').default; },
    _c[SCREENS_1.default.TRAVEL.TRIP_DETAILS] = function () { return require('../../../../pages/Travel/TripDetailsPage').default; },
    _c[SCREENS_1.default.TRAVEL.DOMAIN_SELECTOR] = function () { return require('../../../../pages/Travel/DomainSelectorPage').default; },
    _c[SCREENS_1.default.TRAVEL.DOMAIN_PERMISSION_INFO] = function () { return require('../../../../pages/Travel/DomainPermissionInfoPage').default; },
    _c[SCREENS_1.default.TRAVEL.PUBLIC_DOMAIN_ERROR] = function () { return require('../../../../pages/Travel/PublicDomainErrorPage').default; },
    _c[SCREENS_1.default.TRAVEL.WORKSPACE_ADDRESS] = function () { return require('../../../../pages/Travel/WorkspaceAddressForTravelPage').default; },
    _c));
exports.TravelModalStackNavigator = TravelModalStackNavigator;
var SplitDetailsModalStackNavigator = createModalStackNavigator((_d = {},
    _d[SCREENS_1.default.SPLIT_DETAILS.ROOT] = function () { return require('../../../../pages/iou/SplitBillDetailsPage').default; },
    _d));
exports.SplitDetailsModalStackNavigator = SplitDetailsModalStackNavigator;
var ProfileModalStackNavigator = createModalStackNavigator((_e = {},
    _e[SCREENS_1.default.PROFILE_ROOT] = function () { return require('../../../../pages/ProfilePage').default; },
    _e));
exports.ProfileModalStackNavigator = ProfileModalStackNavigator;
var NewReportWorkspaceSelectionModalStackNavigator = createModalStackNavigator((_f = {},
    _f[SCREENS_1.default.NEW_REPORT_WORKSPACE_SELECTION.ROOT] = function () { return require('../../../../pages/NewReportWorkspaceSelectionPage').default; },
    _f));
exports.NewReportWorkspaceSelectionModalStackNavigator = NewReportWorkspaceSelectionModalStackNavigator;
var ReportDetailsModalStackNavigator = createModalStackNavigator((_g = {},
    _g[SCREENS_1.default.REPORT_DETAILS.ROOT] = function () { return require('../../../../pages/ReportDetailsPage').default; },
    _g[SCREENS_1.default.REPORT_DETAILS.SHARE_CODE] = function () { return require('../../../../pages/home/report/ReportDetailsShareCodePage').default; },
    _g[SCREENS_1.default.REPORT_DETAILS.EXPORT] = function () { return require('../../../../pages/home/report/ReportDetailsExportPage').default; },
    _g));
exports.ReportDetailsModalStackNavigator = ReportDetailsModalStackNavigator;
var ReportChangeWorkspaceModalStackNavigator = createModalStackNavigator((_h = {},
    _h[SCREENS_1.default.REPORT_CHANGE_WORKSPACE.ROOT] = function () { return require('../../../../pages/ReportChangeWorkspacePage').default; },
    _h));
exports.ReportChangeWorkspaceModalStackNavigator = ReportChangeWorkspaceModalStackNavigator;
var ReportChangeApproverModalStackNavigator = createModalStackNavigator((_j = {},
    _j[SCREENS_1.default.REPORT_CHANGE_APPROVER.ROOT] = function () { return require('../../../../pages/ReportChangeApproverPage').default; },
    _j[SCREENS_1.default.REPORT_CHANGE_APPROVER.ADD_APPROVER] = function () { return require('../../../../pages/ReportAddApproverPage').default; },
    _j));
exports.ReportChangeApproverModalStackNavigator = ReportChangeApproverModalStackNavigator;
var ReportSettingsModalStackNavigator = createModalStackNavigator((_k = {},
    _k[SCREENS_1.default.REPORT_SETTINGS.ROOT] = function () { return require('../../../../pages/settings/Report/ReportSettingsPage').default; },
    _k[SCREENS_1.default.REPORT_SETTINGS.NAME] = function () { return require('../../../../pages/settings/Report/NamePage').default; },
    _k[SCREENS_1.default.REPORT_SETTINGS.NOTIFICATION_PREFERENCES] = function () { return require('../../../../pages/settings/Report/NotificationPreferencePage').default; },
    _k[SCREENS_1.default.REPORT_SETTINGS.WRITE_CAPABILITY] = function () { return require('../../../../pages/settings/Report/WriteCapabilityPage').default; },
    _k[SCREENS_1.default.REPORT_SETTINGS.VISIBILITY] = function () { return require('../../../../pages/settings/Report/VisibilityPage').default; },
    _k));
exports.ReportSettingsModalStackNavigator = ReportSettingsModalStackNavigator;
var WorkspaceConfirmationModalStackNavigator = createModalStackNavigator((_l = {},
    _l[SCREENS_1.default.WORKSPACE_CONFIRMATION.ROOT] = function () { return require('../../../../pages/workspace/WorkspaceConfirmationPage').default; },
    _l));
exports.WorkspaceConfirmationModalStackNavigator = WorkspaceConfirmationModalStackNavigator;
var WorkspaceDuplicateModalStackNavigator = createModalStackNavigator((_m = {},
    _m[SCREENS_1.default.WORKSPACE_DUPLICATE.ROOT] = function () { return require('../../../../pages/workspace/duplicate/WorkspaceDuplicatePage').default; },
    _m[SCREENS_1.default.WORKSPACE_DUPLICATE.SELECT_FEATURES] = function () { return require('../../../../pages/workspace/duplicate/WorkspaceDuplicateSelectFeaturesPage').default; },
    _m));
exports.WorkspaceDuplicateModalStackNavigator = WorkspaceDuplicateModalStackNavigator;
var TaskModalStackNavigator = createModalStackNavigator((_o = {},
    _o[SCREENS_1.default.TASK.TITLE] = function () { return require('../../../../pages/tasks/TaskTitlePage').default; },
    _o[SCREENS_1.default.TASK.ASSIGNEE] = function () { return require('../../../../pages/tasks/TaskAssigneeSelectorModal').default; },
    _o));
exports.TaskModalStackNavigator = TaskModalStackNavigator;
var ReportDescriptionModalStackNavigator = createModalStackNavigator((_p = {},
    _p[SCREENS_1.default.REPORT_DESCRIPTION_ROOT] = function () { return require('../../../../pages/ReportDescriptionPage').default; },
    _p));
exports.ReportDescriptionModalStackNavigator = ReportDescriptionModalStackNavigator;
var CategoriesModalStackNavigator = createModalStackNavigator((_q = {},
    _q[SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_SETTINGS] = function () { return require('../../../../pages/workspace/categories/WorkspaceCategoriesSettingsPage').default; },
    _q[SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_CREATE] = function () { return require('../../../../pages/workspace/categories/CreateCategoryPage').default; },
    _q[SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_EDIT] = function () { return require('../../../../pages/workspace/categories/EditCategoryPage').default; },
    _q[SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_SETTINGS] = function () { return require('../../../../pages/workspace/categories/CategorySettingsPage').default; },
    _q[SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_IMPORT] = function () { return require('../../../../pages/workspace/categories/ImportCategoriesPage').default; },
    _q[SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_IMPORTED] = function () { return require('../../../../pages/workspace/categories/ImportedCategoriesPage').default; },
    _q[SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_PAYROLL_CODE] = function () { return require('../../../../pages/workspace/categories/CategoryPayrollCodePage').default; },
    _q[SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_GL_CODE] = function () { return require('../../../../pages/workspace/categories/CategoryGLCodePage').default; },
    _q));
exports.CategoriesModalStackNavigator = CategoriesModalStackNavigator;
var TagsModalStackNavigator = createModalStackNavigator((_r = {},
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_SETTINGS] = function () { return require('../../../../pages/workspace/tags/WorkspaceTagsSettingsPage').default; },
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_EDIT] = function () { return require('../../../../pages/workspace/tags/WorkspaceEditTagsPage').default; },
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_IMPORT] = function () { return require('../../../../pages/workspace/tags/ImportTagsPage').default; },
    _r[SCREENS_1.default.WORKSPACE.TAGS_IMPORT_OPTIONS] = function () { return require('../../../../pages/workspace/tags/ImportTagsOptionsPage').default; },
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_IMPORTED] = function () { return require('../../../../pages/workspace/tags/ImportedTagsPage').default; },
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_SETTINGS] = function () { return require('../../../../pages/workspace/tags/TagSettingsPage').default; },
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_LIST_VIEW] = function () { return require('../../../../pages/workspace/tags/WorkspaceViewTagsPage').default; },
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_CREATE] = function () { return require('../../../../pages/workspace/tags/WorkspaceCreateTagPage').default; },
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_EDIT] = function () { return require('../../../../pages/workspace/tags/EditTagPage').default; },
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_APPROVER] = function () { return require('../../../../pages/workspace/tags/TagApproverPage').default; },
    _r[SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_GL_CODE] = function () { return require('../../../../pages/workspace/tags/TagGLCodePage').default; },
    _r));
exports.TagsModalStackNavigator = TagsModalStackNavigator;
var ExpensifyCardModalStackNavigator = createModalStackNavigator((_s = {},
    _s[SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_DETAILS] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceExpensifyCardDetailsPage').default; },
    _s[SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_NAME] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardNamePage').default; },
    _s[SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_LIMIT] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardLimitPage').default; },
    _s[SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_LIMIT_TYPE] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardLimitTypePage').default; },
    _s));
exports.ExpensifyCardModalStackNavigator = ExpensifyCardModalStackNavigator;
var DomainCardModalStackNavigator = createModalStackNavigator((_t = {},
    _t[SCREENS_1.default.DOMAIN_CARD.DOMAIN_CARD_DETAIL] = function () { return require('../../../../pages/settings/Wallet/ExpensifyCardPage').default; },
    _t[SCREENS_1.default.DOMAIN_CARD.DOMAIN_CARD_REPORT_FRAUD] = function () { return require('../../../../pages/settings/Wallet/ReportVirtualCardFraudPage').default; },
    _t));
exports.DomainCardModalStackNavigator = DomainCardModalStackNavigator;
var ReportParticipantsModalStackNavigator = createModalStackNavigator((_u = {},
    _u[SCREENS_1.default.REPORT_PARTICIPANTS.ROOT] = function () { return require('../../../../pages/ReportParticipantsPage').default; },
    _u[SCREENS_1.default.REPORT_PARTICIPANTS.INVITE] = function () { return require('../../../../pages/InviteReportParticipantsPage').default; },
    _u[SCREENS_1.default.REPORT_PARTICIPANTS.DETAILS] = function () { return require('../../../../pages/ReportParticipantDetailsPage').default; },
    _u[SCREENS_1.default.REPORT_PARTICIPANTS.ROLE] = function () { return require('../../../../pages/ReportParticipantRoleSelectionPage').default; },
    _u));
exports.ReportParticipantsModalStackNavigator = ReportParticipantsModalStackNavigator;
var RoomMembersModalStackNavigator = createModalStackNavigator((_v = {},
    _v[SCREENS_1.default.ROOM_MEMBERS.ROOT] = function () { return require('../../../../pages/RoomMembersPage').default; },
    _v[SCREENS_1.default.ROOM_MEMBERS.INVITE] = function () { return require('../../../../pages/RoomInvitePage').default; },
    _v[SCREENS_1.default.ROOM_MEMBERS.DETAILS] = function () { return require('../../../../pages/RoomMemberDetailsPage').default; },
    _v));
exports.RoomMembersModalStackNavigator = RoomMembersModalStackNavigator;
var NewChatModalStackNavigator = createModalStackNavigator((_w = {},
    _w[SCREENS_1.default.NEW_CHAT.ROOT] = function () { return require('../../../../pages/NewChatSelectorPage').default; },
    _w[SCREENS_1.default.NEW_CHAT.NEW_CHAT_CONFIRM] = function () { return require('../../../../pages/NewChatConfirmPage').default; },
    _w[SCREENS_1.default.NEW_CHAT.NEW_CHAT_EDIT_NAME] = function () { return require('../../../../pages/GroupChatNameEditPage').default; },
    _w));
exports.NewChatModalStackNavigator = NewChatModalStackNavigator;
var NewTaskModalStackNavigator = createModalStackNavigator((_x = {},
    _x[SCREENS_1.default.NEW_TASK.ROOT] = function () { return require('../../../../pages/tasks/NewTaskPage').default; },
    _x[SCREENS_1.default.NEW_TASK.TASK_ASSIGNEE_SELECTOR] = function () { return require('../../../../pages/tasks/TaskAssigneeSelectorModal').default; },
    _x[SCREENS_1.default.NEW_TASK.TASK_SHARE_DESTINATION_SELECTOR] = function () { return require('../../../../pages/tasks/TaskShareDestinationSelectorModal').default; },
    _x[SCREENS_1.default.NEW_TASK.DETAILS] = function () { return require('../../../../pages/tasks/NewTaskDetailsPage').default; },
    _x[SCREENS_1.default.NEW_TASK.TITLE] = function () { return require('../../../../pages/tasks/NewTaskTitlePage').default; },
    _x[SCREENS_1.default.NEW_TASK.DESCRIPTION] = function () { return require('../../../../pages/tasks/NewTaskDescriptionPage').default; },
    _x));
exports.NewTaskModalStackNavigator = NewTaskModalStackNavigator;
var NewTeachersUniteNavigator = createModalStackNavigator((_y = {},
    _y[SCREENS_1.default.SAVE_THE_WORLD.ROOT] = function () { return require('../../../../pages/TeachersUnite/SaveTheWorldPage').default; },
    _y[SCREENS_1.default.I_KNOW_A_TEACHER] = function () { return require('../../../../pages/TeachersUnite/KnowATeacherPage').default; },
    _y[SCREENS_1.default.INTRO_SCHOOL_PRINCIPAL] = function () { return require('../../../../pages/TeachersUnite/ImTeacherPage').default; },
    _y[SCREENS_1.default.I_AM_A_TEACHER] = function () { return require('../../../../pages/TeachersUnite/ImTeacherPage').default; },
    _y));
exports.NewTeachersUniteNavigator = NewTeachersUniteNavigator;
var ConsoleModalStackNavigator = createModalStackNavigator((_z = {},
    _z[SCREENS_1.default.PUBLIC_CONSOLE_DEBUG] = function () { return require('../../../../pages/settings/AboutPage/ConsolePage').default; },
    _z));
exports.ConsoleModalStackNavigator = ConsoleModalStackNavigator;
var SettingsModalStackNavigator = createModalStackNavigator((_0 = {},
    _0[SCREENS_1.default.SETTINGS.SHARE_CODE] = function () { return require('../../../../pages/ShareCodePage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.PRONOUNS] = function () { return require('../../../../pages/settings/Profile/PronounsPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.DISPLAY_NAME] = function () { return require('../../../../pages/settings/Profile/DisplayNamePage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.TIMEZONE] = function () { return require('../../../../pages/settings/Profile/TimezoneInitialPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.TIMEZONE_SELECT] = function () { return require('../../../../pages/settings/Profile/TimezoneSelectPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.LEGAL_NAME] = function () { return require('../../../../pages/settings/Profile/PersonalDetails/LegalNamePage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.DATE_OF_BIRTH] = function () { return require('../../../../pages/settings/Profile/PersonalDetails/DateOfBirthPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.PHONE_NUMBER] = function () { return require('../../../../pages/settings/Profile/PersonalDetails/PhoneNumberPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.ADDRESS] = function () { return require('../../../../pages/settings/Profile/PersonalDetails/PersonalAddressPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.ADDRESS_COUNTRY] = function () { return require('../../../../pages/settings/Profile/PersonalDetails/CountrySelectionPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.ADDRESS_STATE] = function () { return require('../../../../pages/settings/Profile/PersonalDetails/StateSelectionPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.CONTACT_METHODS] = function () { return require('../../../../pages/settings/Profile/Contacts/ContactMethodsPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.CONTACT_METHOD_DETAILS] = function () { return require('../../../../pages/settings/Profile/Contacts/ContactMethodDetailsPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.NEW_CONTACT_METHOD] = function () { return require('../../../../pages/settings/Profile/Contacts/NewContactMethodPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.CONTACT_METHOD_VERIFY_ACCOUNT] = function () { return require('../../../../pages/settings/Profile/Contacts/VerifyAccountPage').default; },
    _0[SCREENS_1.default.SETTINGS.PREFERENCES.PRIORITY_MODE] = function () { return require('../../../../pages/settings/Preferences/PriorityModePage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.ROOT] = function () { return require('../../../../pages/workspace/accounting/PolicyAccountingPage').default; },
    _0[SCREENS_1.default.SETTINGS.PREFERENCES.LANGUAGE] = function () { return require('../../../../pages/settings/Preferences/LanguagePage').default; },
    _0[SCREENS_1.default.SETTINGS.PREFERENCES.THEME] = function () { return require('../../../../pages/settings/Preferences/ThemePage').default; },
    _0[SCREENS_1.default.SETTINGS.PREFERENCES.PAYMENT_CURRENCY] = function () { return require('../../../../pages/settings/Preferences/PaymentCurrencyPage').default; },
    _0[SCREENS_1.default.SETTINGS.CLOSE] = function () { return require('../../../../pages/settings/Security/CloseAccountPage').default; },
    _0[SCREENS_1.default.SETTINGS.APP_DOWNLOAD_LINKS] = function () { return require('../../../../pages/settings/AppDownloadLinks').default; },
    _0[SCREENS_1.default.SETTINGS.CONSOLE] = function () { return require('../../../../pages/settings/AboutPage/ConsolePage').default; },
    _0[SCREENS_1.default.SETTINGS.SHARE_LOG] = function () { return require('../../../../pages/settings/AboutPage/ShareLogPage').default; },
    _0[SCREENS_1.default.SETTINGS.WALLET.CARDS_DIGITAL_DETAILS_UPDATE_ADDRESS] = function () { return require('../../../../pages/settings/Profile/PersonalDetails/PersonalAddressPage').default; },
    _0[SCREENS_1.default.SETTINGS.WALLET.DOMAIN_CARD] = function () { return require('../../../../pages/settings/Wallet/ExpensifyCardPage').default; },
    _0[SCREENS_1.default.SETTINGS.WALLET.REPORT_VIRTUAL_CARD_FRAUD] = function () { return require('../../../../pages/settings/Wallet/ReportVirtualCardFraudPage').default; },
    _0[SCREENS_1.default.SETTINGS.WALLET.REPORT_VIRTUAL_CARD_FRAUD_CONFIRMATION] = function () { return require('../../../../pages/settings/Wallet/ReportVirtualCardFraudConfirmationPage').default; },
    _0[SCREENS_1.default.SETTINGS.WALLET.CARD_ACTIVATE] = function () { return require('../../../../pages/settings/Wallet/ActivatePhysicalCardPage').default; },
    _0[SCREENS_1.default.SETTINGS.WALLET.TRANSFER_BALANCE] = function () { return require('../../../../pages/settings/Wallet/TransferBalancePage').default; },
    _0[SCREENS_1.default.SETTINGS.WALLET.CHOOSE_TRANSFER_ACCOUNT] = function () { return require('../../../../pages/settings/Wallet/ChooseTransferAccountPage').default; },
    _0[SCREENS_1.default.SETTINGS.WALLET.ENABLE_PAYMENTS] = function () { return require('../../../../pages/EnablePayments/EnablePayments').default; },
    _0[SCREENS_1.default.SETTINGS.WALLET.ENABLE_GLOBAL_REIMBURSEMENTS] = function () { return require('../../../../pages/settings/Wallet/EnableGlobalReimbursements').default; },
    _0[SCREENS_1.default.SETTINGS.ADD_DEBIT_CARD] = function () { return require('../../../../pages/settings/Wallet/AddDebitCardPage').default; },
    _0[SCREENS_1.default.SETTINGS.ADD_BANK_ACCOUNT] = function () { return require('../../../../pages/settings/Wallet/InternationalDepositAccount').default; },
    _0[SCREENS_1.default.SETTINGS.ADD_US_BANK_ACCOUNT] = function () { return require('../../../../pages/AddPersonalBankAccountPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.STATUS] = function () { return require('../../../../pages/settings/Profile/CustomStatus/StatusPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.STATUS_CLEAR_AFTER] = function () { return require('../../../../pages/settings/Profile/CustomStatus/StatusClearAfterPage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.STATUS_CLEAR_AFTER_DATE] = function () { return require('../../../../pages/settings/Profile/CustomStatus/SetDatePage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.STATUS_CLEAR_AFTER_TIME] = function () { return require('../../../../pages/settings/Profile/CustomStatus/SetTimePage').default; },
    _0[SCREENS_1.default.SETTINGS.PROFILE.VACATION_DELEGATE] = function () { return require('../../../../pages/settings/Profile/CustomStatus/VacationDelegatePage').default; },
    _0[SCREENS_1.default.SETTINGS.SUBSCRIPTION.SIZE] = function () { return require('../../../../pages/settings/Subscription/SubscriptionSize').default; },
    _0[SCREENS_1.default.SETTINGS.SUBSCRIPTION.SETTINGS_DETAILS] = function () { return require('../../../../pages/settings/Subscription/SubscriptionSettings').default; },
    _0[SCREENS_1.default.SETTINGS.SUBSCRIPTION.DISABLE_AUTO_RENEW_SURVEY] = function () { return require('../../../../pages/settings/Subscription/DisableAutoRenewSurveyPage').default; },
    _0[SCREENS_1.default.SETTINGS.SUBSCRIPTION.REQUEST_EARLY_CANCELLATION] = function () { return require('../../../../pages/settings/Subscription/RequestEarlyCancellationPage').default; },
    _0[SCREENS_1.default.SETTINGS.SUBSCRIPTION.SUBSCRIPTION_DOWNGRADE_BLOCKED] = function () {
        return require('../../../../pages/settings/Subscription/SubscriptionPlan/SubscriptionPlanDowngradeBlockedPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.INVITE] = function () { return require('../../../../pages/workspace/WorkspaceInvitePage').default; },
    _0[SCREENS_1.default.WORKSPACE.MEMBERS_IMPORT] = function () { return require('../../../../pages/workspace/members/ImportMembersPage').default; },
    _0[SCREENS_1.default.WORKSPACE.MEMBERS_IMPORTED] = function () { return require('../../../../pages/workspace/members/ImportedMembersPage').default; },
    _0[SCREENS_1.default.WORKSPACE.MEMBERS_IMPORTED_CONFIRMATION] = function () { return require('../../../../pages/workspace/members/ImportedMembersConfirmationPage').default; },
    _0[SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_NEW] = function () { return require('../../../../pages/workspace/workflows/approvals/WorkspaceWorkflowsApprovalsCreatePage').default; },
    _0[SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_EDIT] = function () { return require('../../../../pages/workspace/workflows/approvals/WorkspaceWorkflowsApprovalsEditPage').default; },
    _0[SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_EXPENSES_FROM] = function () {
        return require('../../../../pages/workspace/workflows/approvals/WorkspaceWorkflowsApprovalsExpensesFromPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_APPROVER] = function () { return require('../../../../pages/workspace/workflows/approvals/WorkspaceWorkflowsApprovalsApproverPage').default; },
    _0[SCREENS_1.default.WORKSPACE.INVITE_MESSAGE] = function () { return require('../../../../pages/workspace/WorkspaceInviteMessagePage').default; },
    _0[SCREENS_1.default.WORKSPACE.INVITE_MESSAGE_ROLE] = function () { return require('../../../../pages/workspace/WorkspaceInviteMessageRolePage').default; },
    _0[SCREENS_1.default.WORKSPACE.WORKFLOWS_PAYER] = function () { return require('../../../../pages/workspace/workflows/WorkspaceWorkflowsPayerPage').default; },
    _0[SCREENS_1.default.WORKSPACE.NAME] = function () { return require('../../../../pages/workspace/WorkspaceNamePage').default; },
    _0[SCREENS_1.default.WORKSPACE.DESCRIPTION] = function () { return require('../../../../pages/workspace/WorkspaceOverviewDescriptionPage').default; },
    _0[SCREENS_1.default.WORKSPACE.SHARE] = function () { return require('../../../../pages/workspace/WorkspaceOverviewSharePage').default; },
    _0[SCREENS_1.default.WORKSPACE.CURRENCY] = function () { return require('../../../../pages/workspace/WorkspaceOverviewCurrencyPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_SETTINGS] = function () { return require('../../../../pages/workspace/categories/CategorySettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ADDRESS] = function () { return require('../../../../pages/workspace/WorkspaceOverviewAddressPage').default; },
    _0[SCREENS_1.default.WORKSPACE.PLAN] = function () { return require('../../../../pages/workspace/WorkspaceOverviewPlanTypePage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORIES_SETTINGS] = function () { return require('../../../../pages/workspace/categories/WorkspaceCategoriesSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORIES_IMPORT] = function () { return require('../../../../pages/workspace/categories/ImportCategoriesPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORIES_IMPORTED] = function () { return require('../../../../pages/workspace/categories/ImportedCategoriesPage').default; },
    _0[SCREENS_1.default.WORKSPACE.UPGRADE] = function () { return require('../../../../pages/workspace/upgrade/WorkspaceUpgradePage').default; },
    _0[SCREENS_1.default.WORKSPACE.DOWNGRADE] = function () { return require('../../../../pages/workspace/downgrade/WorkspaceDowngradePage').default; },
    _0[SCREENS_1.default.WORKSPACE.PAY_AND_DOWNGRADE] = function () { return require('../../../../pages/workspace/downgrade/PayAndDowngradePage').default; },
    _0[SCREENS_1.default.WORKSPACE.MEMBER_DETAILS] = function () { return require('../../../../pages/workspace/members/WorkspaceMemberDetailsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.MEMBER_CUSTOM_FIELD] = function () { return require('../../../../pages/workspace/members/WorkspaceMemberCustomFieldPage').default; },
    _0[SCREENS_1.default.WORKSPACE.MEMBER_NEW_CARD] = function () { return require('../../../../pages/workspace/members/WorkspaceMemberNewCardPage').default; },
    _0[SCREENS_1.default.WORKSPACE.OWNER_CHANGE_CHECK] = function () { return require('@pages/workspace/members/WorkspaceOwnerChangeWrapperPage').default; },
    _0[SCREENS_1.default.WORKSPACE.OWNER_CHANGE_SUCCESS] = function () { return require('../../../../pages/workspace/members/WorkspaceOwnerChangeSuccessPage').default; },
    _0[SCREENS_1.default.WORKSPACE.OWNER_CHANGE_ERROR] = function () { return require('../../../../pages/workspace/members/WorkspaceOwnerChangeErrorPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_CREATE] = function () { return require('../../../../pages/workspace/categories/CreateCategoryPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_EDIT] = function () { return require('../../../../pages/workspace/categories/EditCategoryPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_PAYROLL_CODE] = function () { return require('../../../../pages/workspace/categories/CategoryPayrollCodePage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_GL_CODE] = function () { return require('../../../../pages/workspace/categories/CategoryGLCodePage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_DEFAULT_TAX_RATE] = function () { return require('../../../../pages/workspace/categories/CategoryDefaultTaxRatePage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_FLAG_AMOUNTS_OVER] = function () { return require('../../../../pages/workspace/categories/CategoryFlagAmountsOverPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_DESCRIPTION_HINT] = function () { return require('../../../../pages/workspace/categories/CategoryDescriptionHintPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_REQUIRE_RECEIPTS_OVER] = function () { return require('../../../../pages/workspace/categories/CategoryRequireReceiptsOverPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CATEGORY_APPROVER] = function () { return require('../../../../pages/workspace/categories/CategoryApproverPage').default; },
    _0[SCREENS_1.default.WORKSPACE.CREATE_DISTANCE_RATE] = function () { return require('../../../../pages/workspace/distanceRates/CreateDistanceRatePage').default; },
    _0[SCREENS_1.default.WORKSPACE.DISTANCE_RATES_SETTINGS] = function () { return require('../../../../pages/workspace/distanceRates/PolicyDistanceRatesSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.DISTANCE_RATE_DETAILS] = function () { return require('../../../../pages/workspace/distanceRates/PolicyDistanceRateDetailsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.DISTANCE_RATE_EDIT] = function () { return require('../../../../pages/workspace/distanceRates/PolicyDistanceRateEditPage').default; },
    _0[SCREENS_1.default.WORKSPACE.DISTANCE_RATE_NAME_EDIT] = function () { return require('../../../../pages/workspace/distanceRates/PolicyDistanceRateNameEditPage').default; },
    _0[SCREENS_1.default.WORKSPACE.DISTANCE_RATE_TAX_RECLAIMABLE_ON_EDIT] = function () {
        return require('../../../../pages/workspace/distanceRates/PolicyDistanceRateTaxReclaimableEditPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.DISTANCE_RATE_TAX_RATE_EDIT] = function () { return require('../../../../pages/workspace/distanceRates/PolicyDistanceRateTaxRateEditPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAGS_IMPORT] = function () { return require('../../../../pages/workspace/tags/ImportTagsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAGS_IMPORT_OPTIONS] = function () { return require('../../../../pages/workspace/tags/ImportTagsOptionsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAGS_IMPORT_MULTI_LEVEL_SETTINGS] = function () { return require('../../../../pages/workspace/tags/ImportMultiLevelTagsSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAGS_IMPORTED] = function () { return require('../../../../pages/workspace/tags/ImportedTagsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAGS_IMPORTED_MULTI_LEVEL] = function () { return require('../../../../pages/workspace/tags/ImportedMultiLevelTagsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAGS_SETTINGS] = function () { return require('../../../../pages/workspace/tags/WorkspaceTagsSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAG_SETTINGS] = function () { return require('../../../../pages/workspace/tags/TagSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAG_LIST_VIEW] = function () { return require('../../../../pages/workspace/tags/WorkspaceViewTagsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAGS_EDIT] = function () { return require('../../../../pages/workspace/tags/WorkspaceEditTagsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAG_CREATE] = function () { return require('../../../../pages/workspace/tags/WorkspaceCreateTagPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAG_EDIT] = function () { return require('../../../../pages/workspace/tags/EditTagPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAG_APPROVER] = function () { return require('../../../../pages/workspace/tags/TagApproverPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAG_GL_CODE] = function () { return require('../../../../pages/workspace/tags/TagGLCodePage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAXES_SETTINGS] = function () { return require('../../../../pages/workspace/taxes/WorkspaceTaxesSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAXES_SETTINGS_CUSTOM_TAX_NAME] = function () { return require('../../../../pages/workspace/taxes/WorkspaceTaxesSettingsCustomTaxName').default; },
    _0[SCREENS_1.default.WORKSPACE.TAXES_SETTINGS_FOREIGN_CURRENCY_DEFAULT] = function () { return require('../../../../pages/workspace/taxes/WorkspaceTaxesSettingsForeignCurrency').default; },
    _0[SCREENS_1.default.WORKSPACE.TAXES_SETTINGS_WORKSPACE_CURRENCY_DEFAULT] = function () { return require('../../../../pages/workspace/taxes/WorkspaceTaxesSettingsWorkspaceCurrency').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksExportConfigurationPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_DATE_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksExportDateSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_INVOICE_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksExportInvoiceAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksOutOfPocketExpenseAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksOutOfPocketExpenseConfigurationPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksOutOfPocketExpenseEntitySelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksNonReimbursableDefaultVendorSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT] = function () {
        return require('@pages/workspace/accounting/qbo/export/QuickbooksCompanyCardExpenseAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_COMPANY_CARD_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksCompanyCardExpenseAccountSelectCardPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_AUTO_SYNC] = function () { return require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksAutoSyncPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_ACCOUNTING_METHOD] = function () {
        return require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksAccountingMethodPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksCompanyCardExpenseAccountPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_PREFERRED_EXPORTER] = function () {
        return require('../../../../pages/workspace/accounting/qbo/export/QuickbooksPreferredExporterConfigurationPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopCompanyCardExpenseAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_COMPANY_CARD_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopCompanyCardExpenseAccountSelectCardPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopNonReimbursableDefaultVendorSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT] = function () {
        return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopCompanyCardExpenseAccountPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_DATE_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopExportDateSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_PREFERRED_EXPORTER] = function () {
        return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopPreferredExporterConfigurationPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopOutOfPocketExpenseAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES] = function () {
        return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopOutOfPocketExpenseConfigurationPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopOutOfPocketExpenseEntitySelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT] = function () { return require('../../../../pages/workspace/accounting/qbd/export/QuickbooksDesktopExportPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_ADVANCED] = function () {
        return require('../../../../pages/workspace/accounting/qbd/advanced/QuickbooksDesktopAdvancedPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_SETUP_MODAL] = function () { return require('../../../../pages/workspace/accounting/qbd/QuickBooksDesktopSetupPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_SETUP_REQUIRED_DEVICE_MODAL] = function () {
        return require('../../../../pages/workspace/accounting/qbd/RequireQuickBooksDesktopPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_TRIGGER_FIRST_SYNC] = function () {
        return require('../../../../pages/workspace/accounting/qbd/QuickBooksDesktopSetupFlowSyncPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_IMPORT] = function () { return require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopImportPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CHART_OF_ACCOUNTS] = function () {
        return require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopChartOfAccountsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CLASSES] = function () { return require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopClassesPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CLASSES_DISPLAYED_AS] = function () {
        return require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopClassesDisplayedAsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CUSTOMERS] = function () {
        return require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopCustomersPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CUSTOMERS_DISPLAYED_AS] = function () {
        return require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopCustomersDisplayedAsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_ITEMS] = function () { return require('../../../../pages/workspace/accounting/qbd/import/QuickbooksDesktopItemsPage').default; },
    _0[SCREENS_1.default.REIMBURSEMENT_ACCOUNT] = function () { return require('../../../../pages/ReimbursementAccount/ReimbursementAccountPage').default; },
    _0[SCREENS_1.default.REIMBURSEMENT_ACCOUNT_ENTER_SIGNER_INFO] = function () { return require('../../../../pages/ReimbursementAccount/EnterSignerInfo').default; },
    _0[SCREENS_1.default.SETTINGS.REPORT_CARD_LOST_OR_DAMAGED] = function () { return require('../../../../pages/settings/Wallet/ReportCardLostPage').default; },
    _0[SCREENS_1.default.KEYBOARD_SHORTCUTS] = function () { return require('../../../../pages/KeyboardShortcutsPage').default; },
    _0[SCREENS_1.default.SETTINGS.EXIT_SURVEY.REASON] = function () { return require('../../../../pages/settings/ExitSurvey/ExitSurveyReasonPage').default; },
    _0[SCREENS_1.default.SETTINGS.EXIT_SURVEY.RESPONSE] = function () { return require('../../../../pages/settings/ExitSurvey/ExitSurveyResponsePage').default; },
    _0[SCREENS_1.default.SETTINGS.EXIT_SURVEY.CONFIRM] = function () { return require('../../../../pages/settings/ExitSurvey/ExitSurveyConfirmPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_IMPORT] = function () { return require('../../../../pages/workspace/accounting/qbo/import/QuickbooksImportPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CHART_OF_ACCOUNTS] = function () {
        return require('../../../../pages/workspace/accounting/qbo/import/QuickbooksChartOfAccountsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CUSTOMERS] = function () { return require('../../../../pages/workspace/accounting/qbo/import/QuickbooksCustomersPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_TAXES] = function () { return require('../../../../pages/workspace/accounting/qbo/import/QuickbooksTaxesPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_LOCATIONS] = function () { return require('../../../../pages/workspace/accounting/qbo/import/QuickbooksLocationsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CLASSES] = function () { return require('../../../../pages/workspace/accounting/qbo/import/QuickbooksClassesPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CLASSES_DISPLAYED_AS] = function () {
        return require('../../../../pages/workspace/accounting/qbo/import/QuickbooksClassesDisplayedAsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CUSTOMERS_DISPLAYED_AS] = function () {
        return require('../../../../pages/workspace/accounting/qbo/import/QuickbooksCustomersDisplayedAsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_LOCATIONS_DISPLAYED_AS] = function () {
        return require('../../../../pages/workspace/accounting/qbo/import/QuickbooksLocationsDisplayedAsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_ADVANCED] = function () { return require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksAdvancedPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_ACCOUNT_SELECTOR] = function () {
        return require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_INVOICE_ACCOUNT_SELECTOR] = function () {
        return require('../../../../pages/workspace/accounting/qbo/advanced/QuickbooksInvoiceAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_IMPORT] = function () { return require('../../../../pages/workspace/accounting/xero/XeroImportPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_ORGANIZATION] = function () { return require('../../../../pages/workspace/accounting/xero/XeroOrganizationConfigurationPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_CHART_OF_ACCOUNTS] = function () { return require('../../../../pages/workspace/accounting/xero/import/XeroChartOfAccountsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_CUSTOMER] = function () { return require('../../../../pages/workspace/accounting/xero/import/XeroCustomerConfigurationPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_TAXES] = function () { return require('../../../../pages/workspace/accounting/xero/XeroTaxesConfigurationPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_TRACKING_CATEGORIES] = function () { return require('../../../../pages/workspace/accounting/xero/XeroTrackingCategoryConfigurationPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_MAP_TRACKING_CATEGORY] = function () {
        return require('../../../../pages/workspace/accounting/xero/XeroMapTrackingCategoryConfigurationPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT] = function () { return require('../../../../pages/workspace/accounting/xero/export/XeroExportConfigurationPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT_PURCHASE_BILL_DATE_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/xero/export/XeroPurchaseBillDateSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT_BANK_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/xero/export/XeroBankAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_ADVANCED] = function () { return require('../../../../pages/workspace/accounting/xero/advanced/XeroAdvancedPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_AUTO_SYNC] = function () { return require('../../../../pages/workspace/accounting/xero/advanced/XeroAutoSyncPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_ACCOUNTING_METHOD] = function () { return require('../../../../pages/workspace/accounting/xero/advanced/XeroAccountingMethodPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_BILL_STATUS_SELECTOR] = function () {
        return require('../../../../pages/workspace/accounting/xero/export/XeroPurchaseBillStatusSelectorPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_INVOICE_ACCOUNT_SELECTOR] = function () {
        return require('../../../../pages/workspace/accounting/xero/advanced/XeroInvoiceAccountSelectorPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT_PREFERRED_EXPORTER_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/xero/export/XeroPreferredExporterSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_BILL_PAYMENT_ACCOUNT_SELECTOR] = function () {
        return require('../../../../pages/workspace/accounting/xero/advanced/XeroBillPaymentAccountSelectorPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_SUBSIDIARY_SELECTOR] = function () { return require('../../../../pages/workspace/accounting/netsuite/NetSuiteSubsidiarySelector').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_REUSE_EXISTING_CONNECTIONS] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/NetSuiteTokenInput/NetSuiteExistingConnectionsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_TOKEN_INPUT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/NetSuiteTokenInput/NetSuiteTokenInputPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT] = function () { return require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_MAPPING] = function () { return require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportMappingPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_FIELD] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_FIELD_VIEW] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldView').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_FIELD_EDIT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldEdit').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_LIST_ADD] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldNew/NetSuiteImportAddCustomListPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_SEGMENT_ADD] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldNew/NetSuiteImportAddCustomSegmentPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomersOrProjectsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/import/NetSuiteImportCustomersOrProjectSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT] = function () { return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportConfigurationPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_PREFERRED_EXPORTER_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuitePreferredExporterSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_DATE_SELECT] = function () { return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteDateSelectPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES] = function () { return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_DESTINATION_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesDestinationSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_VENDOR_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesVendorSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_PAYABLE_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesPayableAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_JOURNAL_POSTING_PREFERENCE_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteExportExpensesJournalPostingPreferenceSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_RECEIVABLE_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteReceivableAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_INVOICE_ITEM_PREFERENCE_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteInvoiceItemPreferenceSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_INVOICE_ITEM_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteInvoiceItemSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_TAX_POSTING_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteTaxPostingAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_PROVINCIAL_TAX_POSTING_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/export/NetSuiteProvincialTaxPostingAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_ADVANCED] = function () { return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteAdvancedPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_REIMBURSEMENT_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteReimbursementAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_COLLECTION_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteCollectionAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPENSE_REPORT_APPROVAL_LEVEL_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteExpenseReportApprovalLevelSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_VENDOR_BILL_APPROVAL_LEVEL_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteVendorBillApprovalLevelSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_JOURNAL_ENTRY_APPROVAL_LEVEL_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteJournalEntryApprovalLevelSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_APPROVAL_ACCOUNT_SELECT] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteApprovalAccountSelectPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_CUSTOM_FORM_ID] = function () { return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteCustomFormIDPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_AUTO_SYNC] = function () { return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteAutoSyncPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_ACCOUNTING_METHOD] = function () {
        return require('../../../../pages/workspace/accounting/netsuite/advanced/NetSuiteAccountingMethodPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_PREREQUISITES] = function () { return require('../../../../pages/workspace/accounting/intacct/SageIntacctPrerequisitesPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.ENTER_SAGE_INTACCT_CREDENTIALS] = function () {
        return require('../../../../pages/workspace/accounting/intacct/EnterSageIntacctCredentialsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.EXISTING_SAGE_INTACCT_CONNECTIONS] = function () { return require('../../../../pages/workspace/accounting/intacct/ExistingConnectionsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ENTITY] = function () { return require('../../../../pages/workspace/accounting/intacct/SageIntacctEntityPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_EXPORT] = function () { return require('../../../../pages/workspace/accounting/intacct/export/SageIntacctExportPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_PREFERRED_EXPORTER] = function () {
        return require('../../../../pages/workspace/accounting/intacct/export/SageIntacctPreferredExporterPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_EXPORT_DATE] = function () { return require('../../../../pages/workspace/accounting/intacct/export/SageIntacctDatePage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_REIMBURSABLE_EXPENSES] = function () {
        return require('../../../../pages/workspace/accounting/intacct/export/SageIntacctReimbursableExpensesPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES] = function () {
        return require('../../../../pages/workspace/accounting/intacct/export/SageIntacctNonReimbursableExpensesPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_REIMBURSABLE_DESTINATION] = function () {
        return require('../../../../pages/workspace/accounting/intacct/export/SageIntacctReimbursableExpensesDestinationPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_NON_REIMBURSABLE_DESTINATION] = function () {
        return require('../../../../pages/workspace/accounting/intacct/export/SageIntacctNonReimbursableExpensesDestinationPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_DEFAULT_VENDOR] = function () {
        return require('../../../../pages/workspace/accounting/intacct/export/SageIntacctDefaultVendorPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_NON_REIMBURSABLE_CREDIT_CARD_ACCOUNT] = function () {
        return require('../../../../pages/workspace/accounting/intacct/export/SageIntacctNonReimbursableCreditCardAccountPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ADVANCED] = function () { return require('../../../../pages/workspace/accounting/intacct/advanced/SageIntacctAdvancedPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_AUTO_SYNC] = function () { return require('../../../../pages/workspace/accounting/intacct/advanced/SageIntacctAutoSyncPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ACCOUNTING_METHOD] = function () {
        return require('../../../../pages/workspace/accounting/intacct/advanced/SageIntacctAccountingMethodPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_PAYMENT_ACCOUNT] = function () {
        return require('../../../../pages/workspace/accounting/intacct/advanced/SageIntacctPaymentAccountPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.CARD_RECONCILIATION] = function () { return require('../../../../pages/workspace/accounting/reconciliation/CardReconciliationPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.RECONCILIATION_ACCOUNT_SETTINGS] = function () {
        return require('../../../../pages/workspace/accounting/reconciliation/ReconciliationAccountSettingsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.WORKFLOWS_AUTO_REPORTING_FREQUENCY] = function () { return require('../../../../pages/workspace/workflows/WorkspaceAutoReportingFrequencyPage').default; },
    _0[SCREENS_1.default.WORKSPACE.WORKFLOWS_AUTO_REPORTING_MONTHLY_OFFSET] = function () { return require('../../../../pages/workspace/workflows/WorkspaceAutoReportingMonthlyOffsetPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAX_EDIT] = function () { return require('../../../../pages/workspace/taxes/WorkspaceEditTaxPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAX_NAME] = function () { return require('../../../../pages/workspace/taxes/NamePage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAX_VALUE] = function () { return require('../../../../pages/workspace/taxes/ValuePage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAX_CREATE] = function () { return require('../../../../pages/workspace/taxes/WorkspaceCreateTaxPage').default; },
    _0[SCREENS_1.default.WORKSPACE.TAX_CODE] = function () { return require('../../../../pages/workspace/taxes/WorkspaceTaxCodePage').default; },
    _0[SCREENS_1.default.WORKSPACE.INVOICES_COMPANY_NAME] = function () { return require('../../../../pages/workspace/invoices/WorkspaceInvoicingDetailsName').default; },
    _0[SCREENS_1.default.WORKSPACE.INVOICES_COMPANY_WEBSITE] = function () { return require('../../../../pages/workspace/invoices/WorkspaceInvoicingDetailsWebsite').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARDS_ASSIGN_CARD] = function () { return require('../../../../pages/workspace/companyCards/assignCard/AssignCardFeedPage').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SELECT_FEED] = function () { return require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardFeedSelectorPage').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARDS_BANK_CONNECTION] = function () { return require('../../../../pages/workspace/companyCards/BankConnection').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARDS_ADD_NEW] = function () { return require('../../../../pages/workspace/companyCards/addNew/AddNewCardPage').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARDS_TRANSACTION_START_DATE] = function () {
        return require('../../../../pages/workspace/companyCards/assignCard/TransactionStartDateSelectorPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARD_DETAILS] = function () { return require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardDetailsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARD_NAME] = function () { return require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardEditCardNamePage').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARD_EXPORT] = function () { return require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardAccountSelectCardPage').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_ISSUE_NEW] = function () { return require('../../../../pages/workspace/expensifyCard/issueNew/IssueNewCardPage').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SETTINGS] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceCardSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SETTINGS_ACCOUNT] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceSettlementAccountPage').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SETTINGS_FREQUENCY] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceSettlementFrequencyPage').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SELECT_FEED] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceExpensifyCardSelectorPage').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_BANK_ACCOUNT] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceExpensifyCardBankAccounts').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_DETAILS] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceExpensifyCardDetailsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_NAME] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardNamePage').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_LIMIT] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardLimitPage').default; },
    _0[SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_LIMIT_TYPE] = function () { return require('../../../../pages/workspace/expensifyCard/WorkspaceEditCardLimitTypePage').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SETTINGS] = function () { return require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardsSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SETTINGS_FEED_NAME] = function () { return require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardsSettingsFeedNamePage').default; },
    _0[SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SETTINGS_STATEMENT_CLOSE_DATE] = function () {
        return require('../../../../pages/workspace/companyCards/WorkspaceCompanyCardStatementCloseDatePage').default;
    },
    _0[SCREENS_1.default.SETTINGS.SAVE_THE_WORLD] = function () { return require('../../../../pages/TeachersUnite/SaveTheWorldPage').default; },
    _0[SCREENS_1.default.SETTINGS.SUBSCRIPTION.CHANGE_PAYMENT_CURRENCY] = function () { return require('../../../../pages/settings/PaymentCard/ChangeCurrency').default; },
    _0[SCREENS_1.default.SETTINGS.SUBSCRIPTION.CHANGE_BILLING_CURRENCY] = function () { return require('../../../../pages/settings/Subscription/PaymentCard/ChangeBillingCurrency').default; },
    _0[SCREENS_1.default.SETTINGS.SUBSCRIPTION.ADD_PAYMENT_CARD] = function () { return require('../../../../pages/settings/Subscription/PaymentCard').default; },
    _0[SCREENS_1.default.SETTINGS.ADD_PAYMENT_CARD_CHANGE_CURRENCY] = function () { return require('../../../../pages/settings/PaymentCard/ChangeCurrency').default; },
    _0[SCREENS_1.default.WORKSPACE.REPORT_FIELDS_CREATE] = function () { return require('../../../../pages/workspace/reports/CreateReportFieldsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.REPORT_FIELDS_SETTINGS] = function () { return require('../../../../pages/workspace/reports/ReportFieldsSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.REPORT_FIELDS_LIST_VALUES] = function () { return require('../../../../pages/workspace/reports/ReportFieldsListValuesPage').default; },
    _0[SCREENS_1.default.WORKSPACE.REPORT_FIELDS_ADD_VALUE] = function () { return require('../../../../pages/workspace/reports/ReportFieldsAddListValuePage').default; },
    _0[SCREENS_1.default.WORKSPACE.REPORT_FIELDS_VALUE_SETTINGS] = function () { return require('../../../../pages/workspace/reports/ReportFieldsValueSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.REPORT_FIELDS_EDIT_INITIAL_VALUE] = function () { return require('../../../../pages/workspace/reports/ReportFieldsInitialValuePage').default; },
    _0[SCREENS_1.default.WORKSPACE.REPORT_FIELDS_EDIT_VALUE] = function () { return require('../../../../pages/workspace/reports/ReportFieldsEditValuePage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_IMPORT] = function () { return require('../../../../pages/workspace/accounting/intacct/import/SageIntacctImportPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_TOGGLE_MAPPING] = function () {
        return require('../../../../pages/workspace/accounting/intacct/import/SageIntacctToggleMappingsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_MAPPING_TYPE] = function () {
        return require('../../../../pages/workspace/accounting/intacct/import/SageIntacctMappingsTypePage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_IMPORT_TAX] = function () { return require('../../../../pages/workspace/accounting/intacct/import/SageIntacctImportTaxPage').default; },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_IMPORT_TAX_MAPPING] = function () {
        return require('../../../../pages/workspace/accounting/intacct/import/SageIntacctImportTaxMappingPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_USER_DIMENSIONS] = function () {
        return require('../../../../pages/workspace/accounting/intacct/import/SageIntacctUserDimensionsPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ADD_USER_DIMENSION] = function () {
        return require('../../../../pages/workspace/accounting/intacct/import/SageIntacctAddUserDimensionPage').default;
    },
    _0[SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_EDIT_USER_DIMENSION] = function () {
        return require('../../../../pages/workspace/accounting/intacct/import/SageIntacctEditUserDimensionsPage').default;
    },
    _0[SCREENS_1.default.SETTINGS.DELEGATE.VERIFY_ACCOUNT] = function () { return require('../../../../pages/settings/Security/AddDelegate/VerifyAccountPage').default; },
    _0[SCREENS_1.default.SETTINGS.DELEGATE.ADD_DELEGATE] = function () { return require('../../../../pages/settings/Security/AddDelegate/AddDelegatePage').default; },
    _0[SCREENS_1.default.SETTINGS.DELEGATE.DELEGATE_ROLE] = function () { return require('../../../../pages/settings/Security/AddDelegate/SelectDelegateRolePage').default; },
    _0[SCREENS_1.default.SETTINGS.DELEGATE.UPDATE_DELEGATE_ROLE] = function () {
        return require('../../../../pages/settings/Security/AddDelegate/UpdateDelegateRole/UpdateDelegateRolePage').default;
    },
    _0[SCREENS_1.default.SETTINGS.DELEGATE.DELEGATE_CONFIRM] = function () { return require('../../../../pages/settings/Security/AddDelegate/ConfirmDelegatePage').default; },
    _0[SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.ACCOUNT_DETAILS] = function () { return require('../../../../pages/settings/Security/MergeAccounts/AccountDetailsPage').default; },
    _0[SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.ACCOUNT_VALIDATE] = function () { return require('../../../../pages/settings/Security/MergeAccounts/AccountValidatePage').default; },
    _0[SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.MERGE_RESULT] = function () { return require('../../../../pages/settings/Security/MergeAccounts/MergeResultPage').default; },
    _0[SCREENS_1.default.SETTINGS.LOCK.LOCK_ACCOUNT] = function () { return require('../../../../pages/settings/Security/LockAccount/LockAccountPage').default; },
    _0[SCREENS_1.default.SETTINGS.LOCK.UNLOCK_ACCOUNT] = function () { return require('../../../../pages/settings/Security/LockAccount/UnlockAccountPage').default; },
    _0[SCREENS_1.default.SETTINGS.LOCK.FAILED_TO_LOCK_ACCOUNT] = function () { return require('../../../../pages/settings/Security/LockAccount/FailedToLockAccountPage').default; },
    _0[SCREENS_1.default.WORKSPACE.REPORTS_DEFAULT_TITLE] = function () { return require('../../../../pages/workspace/reports/ReportsDefaultTitle').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_AUTO_APPROVE_REPORTS_UNDER] = function () { return require('../../../../pages/workspace/rules/RulesAutoApproveReportsUnderPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_RANDOM_REPORT_AUDIT] = function () { return require('../../../../pages/workspace/rules/RulesRandomReportAuditPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_AUTO_PAY_REPORTS_UNDER] = function () { return require('../../../../pages/workspace/rules/RulesAutoPayReportsUnderPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_RECEIPT_REQUIRED_AMOUNT] = function () { return require('../../../../pages/workspace/rules/RulesReceiptRequiredAmountPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_MAX_EXPENSE_AMOUNT] = function () { return require('../../../../pages/workspace/rules/RulesMaxExpenseAmountPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_MAX_EXPENSE_AGE] = function () { return require('../../../../pages/workspace/rules/RulesMaxExpenseAgePage').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_BILLABLE_DEFAULT] = function () { return require('../../../../pages/workspace/rules/RulesBillableDefaultPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_REIMBURSABLE_DEFAULT] = function () { return require('../../../../pages/workspace/rules/RulesReimbursableDefaultPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_CUSTOM] = function () { return require('../../../../pages/workspace/rules/RulesCustomPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RULES_PROHIBITED_DEFAULT] = function () { return require('../../../../pages/workspace/rules/RulesProhibitedDefaultPage').default; },
    _0[SCREENS_1.default.WORKSPACE.PER_DIEM_IMPORT] = function () { return require('../../../../pages/workspace/perDiem/ImportPerDiemPage').default; },
    _0[SCREENS_1.default.WORKSPACE.PER_DIEM_IMPORTED] = function () { return require('../../../../pages/workspace/perDiem/ImportedPerDiemPage').default; },
    _0[SCREENS_1.default.WORKSPACE.PER_DIEM_SETTINGS] = function () { return require('../../../../pages/workspace/perDiem/WorkspacePerDiemSettingsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.PER_DIEM_DETAILS] = function () { return require('../../../../pages/workspace/perDiem/WorkspacePerDiemDetailsPage').default; },
    _0[SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_DESTINATION] = function () { return require('../../../../pages/workspace/perDiem/EditPerDiemDestinationPage').default; },
    _0[SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_SUBRATE] = function () { return require('../../../../pages/workspace/perDiem/EditPerDiemSubratePage').default; },
    _0[SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_AMOUNT] = function () { return require('../../../../pages/workspace/perDiem/EditPerDiemAmountPage').default; },
    _0[SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_CURRENCY] = function () { return require('../../../../pages/workspace/perDiem/EditPerDiemCurrencyPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RECEIPT_PARTNERS_INVITE] = function () { return require('../../../../pages/workspace/receiptPartners/InviteReceiptPartnerPolicyPage').default; },
    _0[SCREENS_1.default.WORKSPACE.RECEIPT_PARTNERS_INVITE_EDIT] = function () { return require('../../../../pages/workspace/receiptPartners/EditInviteReceiptPartnerPolicyPage').default; },
    _0));
exports.SettingsModalStackNavigator = SettingsModalStackNavigator;
var TwoFactorAuthenticatorStackNavigator = createModalStackNavigator((_1 = {},
    _1[SCREENS_1.default.TWO_FACTOR_AUTH.ROOT] = function () { return require('../../../../pages/settings/Security/TwoFactorAuth/TwoFactorAuthPage').default; },
    _1[SCREENS_1.default.TWO_FACTOR_AUTH.VERIFY] = function () { return require('../../../../pages/settings/Security/TwoFactorAuth/VerifyPage').default; },
    _1[SCREENS_1.default.TWO_FACTOR_AUTH.DISABLED] = function () { return require('../../../../pages/settings/Security/TwoFactorAuth/DisabledPage').default; },
    _1[SCREENS_1.default.TWO_FACTOR_AUTH.DISABLE] = function () { return require('../../../../pages/settings/Security/TwoFactorAuth/DisablePage').default; },
    _1[SCREENS_1.default.TWO_FACTOR_AUTH.SUCCESS] = function () { return require('../../../../pages/settings/Security/TwoFactorAuth/SuccessPage').default; },
    _1));
exports.TwoFactorAuthenticatorStackNavigator = TwoFactorAuthenticatorStackNavigator;
var EnablePaymentsStackNavigator = createModalStackNavigator((_2 = {},
    _2[SCREENS_1.default.ENABLE_PAYMENTS_ROOT] = function () { return require('../../../../pages/EnablePayments/EnablePaymentsPage').default; },
    _2));
exports.EnablePaymentsStackNavigator = EnablePaymentsStackNavigator;
var AddPersonalBankAccountModalStackNavigator = createModalStackNavigator((_3 = {},
    _3[SCREENS_1.default.ADD_PERSONAL_BANK_ACCOUNT_ROOT] = function () { return require('../../../../pages/AddPersonalBankAccountPage').default; },
    _3));
exports.AddPersonalBankAccountModalStackNavigator = AddPersonalBankAccountModalStackNavigator;
var WalletStatementStackNavigator = createModalStackNavigator((_4 = {},
    _4[SCREENS_1.default.WALLET_STATEMENT_ROOT] = function () { return require('../../../../pages/wallet/WalletStatementPage').default; },
    _4));
exports.WalletStatementStackNavigator = WalletStatementStackNavigator;
var FlagCommentStackNavigator = createModalStackNavigator((_5 = {},
    _5[SCREENS_1.default.FLAG_COMMENT_ROOT] = function () { return require('../../../../pages/FlagCommentPage').default; },
    _5));
exports.FlagCommentStackNavigator = FlagCommentStackNavigator;
var EditRequestStackNavigator = createModalStackNavigator((_6 = {},
    _6[SCREENS_1.default.EDIT_REQUEST.REPORT_FIELD] = function () { return require('../../../../pages/EditReportFieldPage').default; },
    _6));
exports.EditRequestStackNavigator = EditRequestStackNavigator;
var PrivateNotesModalStackNavigator = createModalStackNavigator((_7 = {},
    _7[SCREENS_1.default.PRIVATE_NOTES.LIST] = function () { return require('../../../../pages/PrivateNotes/PrivateNotesListPage').default; },
    _7[SCREENS_1.default.PRIVATE_NOTES.EDIT] = function () { return require('../../../../pages/PrivateNotes/PrivateNotesEditPage').default; },
    _7));
exports.PrivateNotesModalStackNavigator = PrivateNotesModalStackNavigator;
var SignInModalStackNavigator = createModalStackNavigator((_8 = {},
    _8[SCREENS_1.default.SIGN_IN_ROOT] = function () { return require('../../../../pages/signin/SignInModal').default; },
    _8));
exports.SignInModalStackNavigator = SignInModalStackNavigator;
var ReferralModalStackNavigator = createModalStackNavigator((_9 = {},
    _9[SCREENS_1.default.REFERRAL_DETAILS] = function () { return require('../../../../pages/ReferralDetailsPage').default; },
    _9));
exports.ReferralModalStackNavigator = ReferralModalStackNavigator;
var TransactionDuplicateStackNavigator = createModalStackNavigator((_10 = {},
    _10[SCREENS_1.default.TRANSACTION_DUPLICATE.REVIEW] = function () { return require('../../../../pages/TransactionDuplicate/Review').default; },
    _10[SCREENS_1.default.TRANSACTION_DUPLICATE.MERCHANT] = function () { return require('../../../../pages/TransactionDuplicate/ReviewMerchant').default; },
    _10[SCREENS_1.default.TRANSACTION_DUPLICATE.CATEGORY] = function () { return require('../../../../pages/TransactionDuplicate/ReviewCategory').default; },
    _10[SCREENS_1.default.TRANSACTION_DUPLICATE.TAG] = function () { return require('../../../../pages/TransactionDuplicate/ReviewTag').default; },
    _10[SCREENS_1.default.TRANSACTION_DUPLICATE.DESCRIPTION] = function () { return require('../../../../pages/TransactionDuplicate/ReviewDescription').default; },
    _10[SCREENS_1.default.TRANSACTION_DUPLICATE.TAX_CODE] = function () { return require('../../../../pages/TransactionDuplicate/ReviewTaxCode').default; },
    _10[SCREENS_1.default.TRANSACTION_DUPLICATE.BILLABLE] = function () { return require('../../../../pages/TransactionDuplicate/ReviewBillable').default; },
    _10[SCREENS_1.default.TRANSACTION_DUPLICATE.REIMBURSABLE] = function () { return require('../../../../pages/TransactionDuplicate/ReviewReimbursable').default; },
    _10[SCREENS_1.default.TRANSACTION_DUPLICATE.CONFIRMATION] = function () { return require('../../../../pages/TransactionDuplicate/Confirmation').default; },
    _10));
exports.TransactionDuplicateStackNavigator = TransactionDuplicateStackNavigator;
var MergeTransactionStackNavigator = createModalStackNavigator((_11 = {},
    _11[SCREENS_1.default.MERGE_TRANSACTION.LIST_PAGE] = function () { return require('../../../../pages/TransactionMerge/MergeTransactionsListPage').default; },
    _11[SCREENS_1.default.MERGE_TRANSACTION.RECEIPT_PAGE] = function () { return require('../../../../pages/TransactionMerge/ReceiptReviewPage').default; },
    _11[SCREENS_1.default.MERGE_TRANSACTION.DETAILS_PAGE] = function () { return require('../../../../pages/TransactionMerge/DetailsReviewPage').default; },
    _11[SCREENS_1.default.MERGE_TRANSACTION.CONFIRMATION_PAGE] = function () { return require('../../../../pages/TransactionMerge/ConfirmationPage').default; },
    _11));
exports.MergeTransactionStackNavigator = MergeTransactionStackNavigator;
var SearchReportModalStackNavigator = createModalStackNavigator((_12 = {},
    _12[SCREENS_1.default.SEARCH.REPORT_RHP] = function () { return require('../../../../pages/home/ReportScreen').default; },
    _12[SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS] = function () { return require('../../../../pages/Search/SearchHoldReasonPage').default; },
    _12[SCREENS_1.default.SEARCH.TRANSACTION_HOLD_REASON_RHP] = function () { return require('../../../../pages/Search/SearchHoldReasonPage').default; },
    _12[SCREENS_1.default.SEARCH.TRANSACTIONS_CHANGE_REPORT_SEARCH_RHP] = function () { return require('../../../../pages/Search/SearchTransactionsChangeReport').default; },
    _12));
exports.SearchReportModalStackNavigator = SearchReportModalStackNavigator;
var SearchAdvancedFiltersModalStackNavigator = createModalStackNavigator((_13 = {},
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TYPE_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersTypePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_GROUP_BY_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersGroupByPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_STATUS_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersStatusPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_DATE_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersDatePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_SUBMITTED_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersSubmittedPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_APPROVED_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersApprovedPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_PAID_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersPaidPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_EXPORTED_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersExportedPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_POSTED_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersPostedPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WITHDRAWN_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersWithdrawnPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_CURRENCY_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersCurrencyPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_GROUP_CURRENCY_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersGroupCurrencyPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_DESCRIPTION_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersDescriptionPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_MERCHANT_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersMerchantPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_REPORT_ID_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersReportIDPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_AMOUNT_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersAmountPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TOTAL_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersTotalPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_CATEGORY_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersCategoryPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_KEYWORD_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersKeywordPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_CARD_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersCardPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TAX_RATE_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersTaxRatePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_EXPENSE_TYPE_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersExpenseTypePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WITHDRAWAL_TYPE_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersWithdrawalTypePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TAG_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersTagPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_HAS_RHP] = function () { return require('../../../../pages/Search/SearchAdvancedFiltersPage/SearchFiltersHasPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_FROM_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersFromPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TO_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersToPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_IN_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersInPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TITLE_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersTitlePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_ASSIGNEE_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersAssigneePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_BILLABLE_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersBillablePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_REIMBURSABLE_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersReimbursablePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WORKSPACE_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersWorkspacePage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_PURCHASE_AMOUNT_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersPurchaseAmountPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_PURCHASE_CURRENCY_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersPurchaseCurrencyPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WITHDRAWAL_ID_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersWithdrawalIDPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_ACTION_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersActionPage').default; },
    _13[SCREENS_1.default.SEARCH.ADVANCED_FILTERS_ATTENDEE_RHP] = function () { return require('@pages/Search/SearchAdvancedFiltersPage/SearchFiltersAttendeePage').default; },
    _13));
exports.SearchAdvancedFiltersModalStackNavigator = SearchAdvancedFiltersModalStackNavigator;
var SearchSavedSearchModalStackNavigator = createModalStackNavigator((_14 = {},
    _14[SCREENS_1.default.SEARCH.SAVED_SEARCH_RENAME_RHP] = function () { return require('../../../../pages/Search/SavedSearchRenamePage').default; },
    _14));
exports.SearchSavedSearchModalStackNavigator = SearchSavedSearchModalStackNavigator;
var RestrictedActionModalStackNavigator = createModalStackNavigator((_15 = {},
    _15[SCREENS_1.default.RESTRICTED_ACTION_ROOT] = function () { return require('../../../../pages/RestrictedAction/Workspace/WorkspaceRestrictedActionPage').default; },
    _15));
exports.RestrictedActionModalStackNavigator = RestrictedActionModalStackNavigator;
var ShareModalStackNavigator = createModalStackNavigator((_16 = {},
    _16[SCREENS_1.default.SHARE.ROOT] = function () { return require('@pages/Share/ShareRootPage').default; },
    _16[SCREENS_1.default.SHARE.SHARE_DETAILS] = function () { return require('@pages/Share/ShareDetailsPage').default; },
    _16[SCREENS_1.default.SHARE.SUBMIT_DETAILS] = function () { return require('@pages/Share/SubmitDetailsPage').default; },
    _16));
exports.ShareModalStackNavigator = ShareModalStackNavigator;
var MissingPersonalDetailsModalStackNavigator = createModalStackNavigator((_17 = {},
    _17[SCREENS_1.default.MISSING_PERSONAL_DETAILS_ROOT] = function () { return require('../../../../pages/MissingPersonalDetails').default; },
    _17));
exports.MissingPersonalDetailsModalStackNavigator = MissingPersonalDetailsModalStackNavigator;
var AddUnreportedExpenseModalStackNavigator = createModalStackNavigator((_18 = {},
    _18[SCREENS_1.default.ADD_UNREPORTED_EXPENSES_ROOT] = function () { return require('../../../../pages/AddUnreportedExpense').default; },
    _18));
exports.AddUnreportedExpenseModalStackNavigator = AddUnreportedExpenseModalStackNavigator;
var DebugModalStackNavigator = createModalStackNavigator((_19 = {},
    _19[SCREENS_1.default.DEBUG.REPORT] = function () { return require('../../../../pages/Debug/Report/DebugReportPage').default; },
    _19[SCREENS_1.default.DEBUG.REPORT_ACTION] = function () { return require('../../../../pages/Debug/ReportAction/DebugReportActionPage').default; },
    _19[SCREENS_1.default.DEBUG.REPORT_ACTION_CREATE] = function () { return require('../../../../pages/Debug/ReportAction/DebugReportActionCreatePage').default; },
    _19[SCREENS_1.default.DEBUG.DETAILS_CONSTANT_PICKER_PAGE] = function () { return require('../../../../pages/Debug/DebugDetailsConstantPickerPage').default; },
    _19[SCREENS_1.default.DEBUG.DETAILS_DATE_TIME_PICKER_PAGE] = function () { return require('../../../../pages/Debug/DebugDetailsDateTimePickerPage').default; },
    _19[SCREENS_1.default.DEBUG.TRANSACTION] = function () { return require('../../../../pages/Debug/Transaction/DebugTransactionPage').default; },
    _19[SCREENS_1.default.DEBUG.TRANSACTION_VIOLATION_CREATE] = function () { return require('../../../../pages/Debug/TransactionViolation/DebugTransactionViolationCreatePage').default; },
    _19[SCREENS_1.default.DEBUG.TRANSACTION_VIOLATION] = function () { return require('../../../../pages/Debug/TransactionViolation/DebugTransactionViolationPage').default; },
    _19));
exports.DebugModalStackNavigator = DebugModalStackNavigator;
var ScheduleCallModalStackNavigator = createModalStackNavigator((_20 = {},
    _20[SCREENS_1.default.SCHEDULE_CALL.BOOK] = function () { return require('../../../../pages/ScheduleCall/ScheduleCallPage').default; },
    _20[SCREENS_1.default.SCHEDULE_CALL.CONFIRMATION] = function () { return require('../../../../pages/ScheduleCall/ScheduleCallConfirmationPage').default; },
    _20));
exports.ScheduleCallModalStackNavigator = ScheduleCallModalStackNavigator;
