"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const OnboardingFlow_1 = require("@libs/actions/Welcome/OnboardingFlow");
const currentUrl_1 = require("@libs/Navigation/currentUrl");
const Navigation_1 = require("@libs/Navigation/Navigation");
const onboardingSelectors_1 = require("@libs/onboardingSelectors");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SessionUtils_1 = require("@libs/SessionUtils");
const TooltipUtils_1 = require("@libs/TooltipUtils");
const CONFIG_1 = require("@src/CONFIG");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const useOnyx_1 = require("./useOnyx");
const useSearchTypeMenuSections_1 = require("./useSearchTypeMenuSections");
/**
 * Hook to handle redirection to the onboarding flow based on the user's onboarding status
 *
 * Warning: This hook should be used only once in the app
 */
function useOnboardingFlowRouter() {
    const currentUrl = (0, currentUrl_1.default)();
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const [onboardingValues, isOnboardingCompletedMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, {
        canBeMissing: true,
    });
    const [currentOnboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const [currentOnboardingCompanySize] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true });
    const [onboardingInitialPath, onboardingInitialPathResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_LAST_VISITED_PATH, { canBeMissing: true });
    const isOnboardingInitialPathLoading = (0, isLoadingOnyxValue_1.default)(onboardingInitialPathResult);
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [sessionEmail] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true, selector: (session) => session?.email });
    const isLoggingInAsNewSessionUser = (0, SessionUtils_1.isLoggingInAsNewUser)(currentUrl, sessionEmail);
    const startedOnboardingFlowRef = (0, react_1.useRef)(false);
    const [tryNewDot, tryNewDotMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, {
        selector: onboardingSelectors_1.tryNewDotOnyxSelector,
        canBeMissing: true,
    });
    const { isHybridAppOnboardingCompleted, hasBeenAddedToNudgeMigration } = tryNewDot ?? {};
    const [dismissedProductTraining, dismissedProductTrainingMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, { canBeMissing: true });
    const [isSingleNewDotEntry, isSingleNewDotEntryMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.HYBRID_APP, { selector: (hybridApp) => hybridApp?.isSingleNewDotEntry, canBeMissing: true });
    const { typeMenuSections } = (0, useSearchTypeMenuSections_1.default)();
    (0, react_1.useEffect)(() => {
        // This should delay opening the onboarding modal so it does not interfere with the ongoing ReportScreen params changes
        react_native_1.InteractionManager.runAfterInteractions(() => {
            // Prevent starting the onboarding flow if we are logging in as a new user with short lived token
            if (currentUrl?.includes(ROUTES_1.default.TRANSITION_BETWEEN_APPS) && isLoggingInAsNewSessionUser) {
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
                const navigationState = Navigation_1.navigationRef.getRootState();
                const lastRoute = navigationState.routes.at(-1);
                // Prevent duplicate navigation if the migrated user modal is already shown.
                if (lastRoute?.name !== NAVIGATORS_1.default.MIGRATED_USER_MODAL_NAVIGATOR) {
                    const nonExploreTypeQuery = typeMenuSections.at(0)?.menuItems.at(0)?.searchQuery;
                    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: nonExploreTypeQuery ?? (0, SearchQueryUtils_1.buildCannedSearchQuery)() }));
                    Navigation_1.default.navigate(ROUTES_1.default.MIGRATED_USER_WELCOME_MODAL.getRoute(true));
                }
                return;
            }
            if (hasBeenAddedToNudgeMigration) {
                return;
            }
            const isOnboardingCompleted = (0, onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector)(onboardingValues);
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
                        isUserFromPublicDomain: !!account?.isFromPublicDomain,
                        hasAccessiblePolicies: !!account?.hasAccessibleDomainPolicies,
                        currentOnboardingCompanySize,
                        currentOnboardingPurposeSelected,
                        onboardingInitialPath,
                    });
                }
            }
            // If the user is not transitioning from OldDot to NewDot, we should start NewDot onboarding flow if it's not completed yet
            if (!CONFIG_1.default.IS_HYBRID_APP && isOnboardingCompleted === false && !startedOnboardingFlowRef.current) {
                startedOnboardingFlowRef.current = true;
                (0, OnboardingFlow_1.startOnboardingFlow)({
                    onboardingValuesParam: onboardingValues,
                    isUserFromPublicDomain: !!account?.isFromPublicDomain,
                    hasAccessiblePolicies: !!account?.hasAccessibleDomainPolicies,
                    currentOnboardingCompanySize,
                    currentOnboardingPurposeSelected,
                    onboardingInitialPath,
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
        dismissedProductTraining?.migratedUserWelcomeModal,
        onboardingValues,
        dismissedProductTraining,
        account?.isFromPublicDomain,
        account?.hasAccessibleDomainPolicies,
        currentUrl,
        isLoggingInAsNewSessionUser,
        currentOnboardingCompanySize,
        currentOnboardingPurposeSelected,
        onboardingInitialPath,
        isOnboardingInitialPathLoading,
        typeMenuSections,
    ]);
    return { isOnboardingCompleted: (0, onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector)(onboardingValues), isHybridAppOnboardingCompleted };
}
exports.default = useOnboardingFlowRouter;
