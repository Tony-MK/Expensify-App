"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// We use Animated for all functionality related to wide RHP to make it easier
// to interact with react-navigation components (e.g., CardContainer, interpolator), which also use Animated.
// eslint-disable-next-line no-restricted-imports
var react_native_1 = require("react-native");
var NoDropZone_1 = require("@components/DragAndDrop/NoDropZone");
var WideRHPContextProvider_1 = require("@components/WideRHPContextProvider");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Transaction_1 = require("@libs/actions/Transaction");
var TwoFactorAuthActions_1 = require("@libs/actions/TwoFactorAuthActions");
var hideKeyboardOnSwipe_1 = require("@libs/Navigation/AppNavigator/hideKeyboardOnSwipe");
var ModalStackNavigators = require("@libs/Navigation/AppNavigator/ModalStackNavigators");
var useRHPScreenOptions_1 = require("@libs/Navigation/AppNavigator/useRHPScreenOptions");
var createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
var CONST_1 = require("@src/CONST");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var SCREENS_1 = require("@src/SCREENS");
var NarrowPaneContext_1 = require("./NarrowPaneContext");
var Overlay_1 = require("./Overlay");
var Stack = (0, createPlatformStackNavigator_1.default)();
function RightModalNavigator(_a) {
    var navigation = _a.navigation, route = _a.route;
    var styles = (0, useThemeStyles_1.default)();
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var isExecutingRef = (0, react_1.useRef)(false);
    var screenOptions = (0, useRHPScreenOptions_1.default)();
    var _b = (0, react_1.useContext)(WideRHPContextProvider_1.WideRHPContext), shouldRenderSecondaryOverlay = _b.shouldRenderSecondaryOverlay, secondOverlayProgress = _b.secondOverlayProgress, dismissToWideReport = _b.dismissToWideReport;
    var screenListeners = (0, react_1.useMemo)(function () { return ({
        blur: function () {
            var _a, _b;
            var rhpParams = (_a = navigation.getState().routes.find(function (innerRoute) { return innerRoute.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR; })) === null || _a === void 0 ? void 0 : _a.params;
            if ((rhpParams === null || rhpParams === void 0 ? void 0 : rhpParams.screen) === SCREENS_1.default.RIGHT_MODAL.TRANSACTION_DUPLICATE || ((_b = route.params) === null || _b === void 0 ? void 0 : _b.screen) !== SCREENS_1.default.RIGHT_MODAL.TRANSACTION_DUPLICATE) {
                return;
            }
            // Delay clearing review duplicate data till the RHP is completely closed
            // to avoid not found showing briefly in confirmation page when RHP is closing
            react_native_1.InteractionManager.runAfterInteractions(function () {
                (0, Transaction_1.abandonReviewDuplicateTransactions)();
            });
        },
    }); }, [navigation, route]);
    var handleOverlayPress = (0, react_1.useCallback)(function () {
        if (isExecutingRef.current) {
            return;
        }
        isExecutingRef.current = true;
        navigation.goBack();
        setTimeout(function () {
            isExecutingRef.current = false;
        }, CONST_1.default.ANIMATED_TRANSITION);
    }, [navigation]);
    return (<NarrowPaneContext_1.NarrowPaneContextProvider>
            <NoDropZone_1.default>
                {!shouldUseNarrowLayout && <Overlay_1.default onPress={handleOverlayPress}/>}
                {/* This one is to limit the outer Animated.View and allow the background to be pressable */}
                {/* Without it, the transparent half of the narrow format RHP card would cover the pressable part of the overlay */}
                <react_native_1.Animated.View style={styles.animatedRHPNavigatorContainer(shouldUseNarrowLayout, WideRHPContextProvider_1.expandedRHPProgress)}>
                    <Stack.Navigator screenOptions={screenOptions} screenListeners={screenListeners} id={NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR}>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.SETTINGS} component={ModalStackNavigators.SettingsModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.TWO_FACTOR_AUTH} component={ModalStackNavigators.TwoFactorAuthenticatorStackNavigator} listeners={{
            beforeRemove: function () {
                react_native_1.InteractionManager.runAfterInteractions(TwoFactorAuthActions_1.clearTwoFactorAuthData);
            },
        }}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.NEW_CHAT} component={ModalStackNavigators.NewChatModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.PROFILE} component={ModalStackNavigators.ProfileModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.DEBUG} component={ModalStackNavigators.DebugModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.NEW_REPORT_WORKSPACE_SELECTION} component={ModalStackNavigators.NewReportWorkspaceSelectionModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.REPORT_DETAILS} component={ModalStackNavigators.ReportDetailsModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.REPORT_CHANGE_WORKSPACE} component={ModalStackNavigators.ReportChangeWorkspaceModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.REPORT_CHANGE_APPROVER} component={ModalStackNavigators.ReportChangeApproverModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.REPORT_SETTINGS} component={ModalStackNavigators.ReportSettingsModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.REPORT_DESCRIPTION} component={ModalStackNavigators.ReportDescriptionModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.SETTINGS_CATEGORIES} component={ModalStackNavigators.CategoriesModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.SETTINGS_TAGS} component={ModalStackNavigators.TagsModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.EXPENSIFY_CARD} component={ModalStackNavigators.ExpensifyCardModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.DOMAIN_CARD} component={ModalStackNavigators.DomainCardModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.PARTICIPANTS} component={ModalStackNavigators.ReportParticipantsModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.ROOM_MEMBERS} component={ModalStackNavigators.RoomMembersModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.MONEY_REQUEST} component={ModalStackNavigators.MoneyRequestModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.WORKSPACE_CONFIRMATION} component={ModalStackNavigators.WorkspaceConfirmationModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.WORKSPACE_DUPLICATE} component={ModalStackNavigators.WorkspaceDuplicateModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.NEW_TASK} component={ModalStackNavigators.NewTaskModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.TEACHERS_UNITE} component={ModalStackNavigators.NewTeachersUniteNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.TASK_DETAILS} component={ModalStackNavigators.TaskModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.ENABLE_PAYMENTS} component={ModalStackNavigators.EnablePaymentsStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.SPLIT_DETAILS} component={ModalStackNavigators.SplitDetailsModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.ADD_PERSONAL_BANK_ACCOUNT} component={ModalStackNavigators.AddPersonalBankAccountModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.WALLET_STATEMENT} component={ModalStackNavigators.WalletStatementStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.FLAG_COMMENT} component={ModalStackNavigators.FlagCommentStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.EDIT_REQUEST} component={ModalStackNavigators.EditRequestStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.SIGN_IN} component={ModalStackNavigators.SignInModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.REFERRAL} component={ModalStackNavigators.ReferralModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.PRIVATE_NOTES} component={ModalStackNavigators.PrivateNotesModalStackNavigator} options={hideKeyboardOnSwipe_1.default}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.TRANSACTION_DUPLICATE} component={ModalStackNavigators.TransactionDuplicateStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.MERGE_TRANSACTION} component={ModalStackNavigators.MergeTransactionStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.TRAVEL} component={ModalStackNavigators.TravelModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.SEARCH_REPORT} component={ModalStackNavigators.SearchReportModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.RESTRICTED_ACTION} component={ModalStackNavigators.RestrictedActionModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.SEARCH_ADVANCED_FILTERS} component={ModalStackNavigators.SearchAdvancedFiltersModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.SEARCH_SAVED_SEARCH} component={ModalStackNavigators.SearchSavedSearchModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.MISSING_PERSONAL_DETAILS} component={ModalStackNavigators.MissingPersonalDetailsModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.ADD_UNREPORTED_EXPENSE} component={ModalStackNavigators.AddUnreportedExpenseModalStackNavigator}/>
                        <Stack.Screen name={SCREENS_1.default.RIGHT_MODAL.SCHEDULE_CALL} component={ModalStackNavigators.ScheduleCallModalStackNavigator}/>
                    </Stack.Navigator>
                </react_native_1.Animated.View>
                {/* The second overlay is here to cover the wide rhp screen underneath */}
                {/* It has a gap on the right to make the last rhp route (narrow) visible and pressable */}
                {shouldRenderSecondaryOverlay && !shouldUseNarrowLayout && (<Overlay_1.default hasMarginRight progress={secondOverlayProgress} onPress={dismissToWideReport}/>)}
            </NoDropZone_1.default>
        </NarrowPaneContext_1.NarrowPaneContextProvider>);
}
RightModalNavigator.displayName = 'RightModalNavigator';
exports.default = RightModalNavigator;
