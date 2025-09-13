"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var OnboardingFlow_1 = require("@libs/actions/Welcome/OnboardingFlow");
var currentUrl_1 = require("@libs/Navigation/currentUrl");
var Navigation_1 = require("@libs/Navigation/Navigation");
var onboardingSelectors_1 = require("@libs/onboardingSelectors");
var SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
var SessionUtils_1 = require("@libs/SessionUtils");
var TooltipUtils_1 = require("@libs/TooltipUtils");
var CONFIG_1 = require("@src/CONFIG");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var useOnyx_1 = require("./useOnyx");
var useSearchTypeMenuSections_1 = require("./useSearchTypeMenuSections");
/**
 * Hook to handle redirection to the onboarding flow based on the user's onboarding status
 *
 * Warning: This hook should be used only once in the app
 */
function useOnboardingFlowRouter() {
    var currentUrl = (0, currentUrl_1.default)();
    var _a = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true })[0], isLoadingApp = _a === void 0 ? true : _a;
    var _b = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, {
        canBeMissing: true,
    }), onboardingValues = _b[0], isOnboardingCompletedMetadata = _b[1];
    var currentOnboardingPurposeSelected = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true })[0];
    var currentOnboardingCompanySize = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true })[0];
    var _c = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_LAST_VISITED_PATH, { canBeMissing: true }), onboardingInitialPath = _c[0], onboardingInitialPathResult = _c[1];
    var isOnboardingInitialPathLoading = (0, isLoadingOnyxValue_1.default)(onboardingInitialPathResult);
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true })[0];
    var sessionEmail = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true, selector: function (session) { return session === null || session === void 0 ? void 0 : session.email; } })[0];
    var isLoggingInAsNewSessionUser = (0, SessionUtils_1.isLoggingInAsNewUser)(currentUrl, sessionEmail);
    var startedOnboardingFlowRef = (0, react_1.useRef)(false);
    var _d = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, {
        selector: onboardingSelectors_1.tryNewDotOnyxSelector,
        canBeMissing: true,
    }), tryNewDot = _d[0], tryNewDotMetadata = _d[1];
    var _e = tryNewDot !== null && tryNewDot !== void 0 ? tryNewDot : {}, isHybridAppOnboardingCompleted = _e.isHybridAppOnboardingCompleted, hasBeenAddedToNudgeMigration = _e.hasBeenAddedToNudgeMigration;
    var _f = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, { canBeMissing: true }), dismissedProductTraining = _f[0], dismissedProductTrainingMetadata = _f[1];
    var _g = (0, useOnyx_1.default)(ONYXKEYS_1.default.HYBRID_APP, { selector: function (hybridApp) { return hybridApp === null || hybridApp === void 0 ? void 0 : hybridApp.isSingleNewDotEntry; }, canBeMissing: true }), isSingleNewDotEntry = _g[0], isSingleNewDotEntryMetadata = _g[1];
    var typeMenuSections = (0, useSearchTypeMenuSections_1.default)().typeMenuSections;
    (0, react_1.useEffect)(function () {
        // This should delay opening the onboarding modal so it does not interfere with the ongoing ReportScreen params changes
        react_native_1.InteractionManager.runAfterInteractions(function () {
            var _a, _b;
            // Prevent starting the onboarding flow if we are logging in as a new user with short lived token
            if ((currentUrl === null || currentUrl === void 0 ? void 0 : currentUrl.includes(ROUTES_1.default.TRANSITION_BETWEEN_APPS)) && isLoggingInAsNewSessionUser) {
                return;
            }
            if (isLoadingApp !== false || isOnboardingInitialPathLoading) {
                return;
            }
            if ((0, isLoadingOnyxValue_1.default)(isOnboardingCompletedMetadata, tryNewDotMetadata, dismissedProductTrainingMetadata)) {
                return;
            }
            if (CONFIG_1.default.IS_HYBRID_APP && (0, isLoadingOnyxValue_1.default)(isSingleNewDotEntryMetadata)) {
                return;
            }
            if (currentUrl.endsWith('/r')) {
                // Don't trigger onboarding if we are in the middle of a redirect to a report
                return;
            }
            if (hasBeenAddedToNudgeMigration && !(0, TooltipUtils_1.default)('migratedUserWelcomeModal', dismissedProductTraining)) {
                var navigationState = Navigation_1.navigationRef.getRootState();
                var lastRoute = navigationState.routes.at(-1);
                // Prevent duplicate navigation if the migrated user modal is already shown.
                if ((lastRoute === null || lastRoute === void 0 ? void 0 : lastRoute.name) !== NAVIGATORS_1.default.MIGRATED_USER_MODAL_NAVIGATOR) {
                    var nonExploreTypeQuery = (_b = (_a = typeMenuSections.at(0)) === null || _a === void 0 ? void 0 : _a.menuItems.at(0)) === null || _b === void 0 ? void 0 : _b.searchQuery;
                    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: nonExploreTypeQuery !== null && nonExploreTypeQuery !== void 0 ? nonExploreTypeQuery : (0, SearchQueryUtils_1.buildCannedSearchQuery)() }));
                    Navigation_1.default.navigate(ROUTES_1.default.MIGRATED_USER_WELCOME_MODAL.getRoute(true));
                }
                return;
            }
            if (hasBeenAddedToNudgeMigration) {
                return;
            }
            var isOnboardingCompleted = (0, onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector)(onboardingValues);
            if (CONFIG_1.default.IS_HYBRID_APP) {
                // For single entries, such as using the Travel feature from OldDot, we don't want to show onboarding
                if (isSingleNewDotEntry) {
                    return;
                }
                // When user is transitioning from OldDot to NewDot, we usually show the explanation modal
                if (isHybridAppOnboardingCompleted === false) {
                    Navigation_1.default.navigate(ROUTES_1.default.EXPLANATION_MODAL_ROOT);
                }
                // But if the hybrid app onboarding is completed, but NewDot onboarding is not completed, we start NewDot onboarding flow
                // This is a special case when user created an account from NewDot without finishing the onboarding flow and then logged in from OldDot
                if (isHybridAppOnboardingCompleted === true && isOnboardingCompleted === false && !startedOnboardingFlowRef.current) {
                    startedOnboardingFlowRef.current = true;
                    (0, OnboardingFlow_1.startOnboardingFlow)({
                        onboardingValuesParam: onboardingValues,
                        isUserFromPublicDomain: !!(account === null || account === void 0 ? void 0 : account.isFromPublicDomain),
                        hasAccessiblePolicies: !!(account === null || account === void 0 ? void 0 : account.hasAccessibleDomainPolicies),
                        currentOnboardingCompanySize: currentOnboardingCompanySize,
                        currentOnboardingPurposeSelected: currentOnboardingPurposeSelected,
                        onboardingInitialPath: onboardingInitialPath,
                    });
                }
            }
            // If the user is not transitioning from OldDot to NewDot, we should start NewDot onboarding flow if it's not completed yet
            if (!CONFIG_1.default.IS_HYBRID_APP && isOnboardingCompleted === false && !startedOnboardingFlowRef.current) {
                startedOnboardingFlowRef.current = true;
                (0, OnboardingFlow_1.startOnboardingFlow)({
                    onboardingValuesParam: onboardingValues,
                    isUserFromPublicDomain: !!(account === null || account === void 0 ? void 0 : account.isFromPublicDomain),
                    hasAccessiblePolicies: !!(account === null || account === void 0 ? void 0 : account.hasAccessibleDomainPolicies),
                    currentOnboardingCompanySize: currentOnboardingCompanySize,
                    currentOnboardingPurposeSelected: currentOnboardingPurposeSelected,
                    onboardingInitialPath: onboardingInitialPath,
                });
            }
        });
    }, [
        isLoadingApp,
        isHybridAppOnboardingCompleted,
        isOnboardingCompletedMetadata,
        tryNewDotMetadata,
        isSingleNewDotEntryMetadata,
        isSingleNewDotEntry,
        hasBeenAddedToNudgeMigration,
        dismissedProductTrainingMetadata,
        dismissedProductTraining === null || dismissedProductTraining === void 0 ? void 0 : dismissedProductTraining.migratedUserWelcomeModal,
        onboardingValues,
        dismissedProductTraining,
        account === null || account === void 0 ? void 0 : account.isFromPublicDomain,
        account === null || account === void 0 ? void 0 : account.hasAccessibleDomainPolicies,
        currentUrl,
        isLoggingInAsNewSessionUser,
        currentOnboardingCompanySize,
        currentOnboardingPurposeSelected,
        onboardingInitialPath,
        isOnboardingInitialPathLoading,
        typeMenuSections,
    ]);
    return { isOnboardingCompleted: (0, onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector)(onboardingValues), isHybridAppOnboardingCompleted: isHybridAppOnboardingCompleted };
}
exports.default = useOnboardingFlowRouter;
