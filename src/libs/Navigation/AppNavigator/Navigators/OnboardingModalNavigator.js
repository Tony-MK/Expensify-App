"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stack_1 = require("@react-navigation/stack");
const react_1 = require("react");
const react_native_1 = require("react-native");
const NoDropZone_1 = require("@components/DragAndDrop/NoDropZone");
const FocusTrapForScreen_1 = require("@components/FocusTrap/FocusTrapForScreen");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const GoogleTagManager_1 = require("@libs/GoogleTagManager");
const useModalCardStyleInterpolator_1 = require("@libs/Navigation/AppNavigator/useModalCardStyleInterpolator");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const OnboardingRefManager_1 = require("@libs/OnboardingRefManager");
const OnboardingAccounting_1 = require("@pages/OnboardingAccounting");
const OnboardingEmployees_1 = require("@pages/OnboardingEmployees");
const OnboardingInterestedFeatures_1 = require("@pages/OnboardingInterestedFeatures");
const OnboardingPersonalDetails_1 = require("@pages/OnboardingPersonalDetails");
const OnboardingPrivateDomain_1 = require("@pages/OnboardingPrivateDomain");
const OnboardingPurpose_1 = require("@pages/OnboardingPurpose");
const OnboardingWorkEmail_1 = require("@pages/OnboardingWorkEmail");
const OnboardingWorkEmailValidation_1 = require("@pages/OnboardingWorkEmailValidation");
const OnboardingWorkspaceConfirmation_1 = require("@pages/OnboardingWorkspaceConfirmation");
const OnboardingWorkspaceCurrency_1 = require("@pages/OnboardingWorkspaceCurrency");
const OnboardingWorkspaceInvite_1 = require("@pages/OnboardingWorkspaceInvite");
const OnboardingWorkspaceOptional_1 = require("@pages/OnboardingWorkspaceOptional");
const OnboardingWorkspaces_1 = require("@pages/OnboardingWorkspaces");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const Overlay_1 = require("./Overlay");
const Stack = (0, createPlatformStackNavigator_1.default)();
function OnboardingModalNavigator() {
    const styles = (0, useThemeStyles_1.default)();
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const outerViewRef = react_1.default.useRef(null);
    const [account, accountMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [onboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const [onboardingPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true });
    const isOnPrivateDomainAndHasAccessiblePolicies = !account?.isFromPublicDomain && account?.hasAccessibleDomainPolicies;
    let initialRouteName = SCREENS_1.default.ONBOARDING.PURPOSE;
    if (isOnPrivateDomainAndHasAccessiblePolicies) {
        initialRouteName = SCREENS_1.default.ONBOARDING.PERSONAL_DETAILS;
    }
    if (account?.isFromPublicDomain) {
        initialRouteName = SCREENS_1.default.ONBOARDING.WORK_EMAIL;
    }
    if (onboardingPurposeSelected === CONST_1.default.ONBOARDING_CHOICES.PERSONAL_SPEND && !!onboardingPolicyID) {
        initialRouteName = SCREENS_1.default.ONBOARDING.WORKSPACE_INVITE;
    }
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, {
        selector: (session) => session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
        canBeMissing: false,
    });
    // Publish a sign_up event when we start the onboarding flow. This should track basic sign ups
    // as well as Google and Apple SSO.
    (0, react_1.useEffect)(() => {
        if (!accountID) {
            return;
        }
        GoogleTagManager_1.default.publishEvent(CONST_1.default.ANALYTICS.EVENT.SIGN_UP, accountID);
    }, [accountID]);
    const handleOuterClick = (0, react_1.useCallback)(() => {
        OnboardingRefManager_1.default.handleOuterClick();
    }, []);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ESCAPE, handleOuterClick, { shouldBubble: true });
    const customInterpolator = (0, useModalCardStyleInterpolator_1.default)();
    const defaultScreenOptions = (0, react_1.useMemo)(() => {
        return {
            headerShown: false,
            animation: animation_1.default.SLIDE_FROM_RIGHT,
            gestureDirection: 'horizontal',
            web: {
                // The .forHorizontalIOS interpolator from `@react-navigation` is misbehaving on Safari, so we override it with Expensify custom interpolator
                cardStyleInterpolator: (0, Browser_1.isMobileSafari)() ? (props) => customInterpolator({ props }) : stack_1.CardStyleInterpolators.forHorizontalIOS,
                gestureDirection: 'horizontal',
                cardStyle: {
                    height: '100%',
                },
            },
        };
    }, [customInterpolator]);
    // If the account data is not loaded yet, we don't want to show the onboarding modal
    if ((0, isLoadingOnyxValue_1.default)(accountMetadata)) {
        return null;
    }
    return (<NoDropZone_1.default>
            <Overlay_1.default />
            <react_native_1.View ref={outerViewRef} onClick={handleOuterClick} style={styles.onboardingNavigatorOuterView}>
                <FocusTrapForScreen_1.default>
                    <react_native_1.View onClick={(e) => e.stopPropagation()} style={styles.OnboardingNavigatorInnerView(onboardingIsMediumOrLargerScreenWidth)}>
                        <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName={initialRouteName}>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.PURPOSE} component={OnboardingPurpose_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.PERSONAL_DETAILS} component={OnboardingPersonalDetails_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORK_EMAIL} component={OnboardingWorkEmail_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORK_EMAIL_VALIDATION} component={OnboardingWorkEmailValidation_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.PRIVATE_DOMAIN} component={OnboardingPrivateDomain_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORKSPACES} component={OnboardingWorkspaces_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.EMPLOYEES} component={OnboardingEmployees_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.ACCOUNTING} component={OnboardingAccounting_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.INTERESTED_FEATURES} component={OnboardingInterestedFeatures_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORKSPACE_OPTIONAL} component={OnboardingWorkspaceOptional_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORKSPACE_CONFIRMATION} component={OnboardingWorkspaceConfirmation_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORKSPACE_CURRENCY} component={OnboardingWorkspaceCurrency_1.default}/>
                            <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORKSPACE_INVITE} component={OnboardingWorkspaceInvite_1.default}/>
                        </Stack.Navigator>
                    </react_native_1.View>
                </FocusTrapForScreen_1.default>
            </react_native_1.View>
        </NoDropZone_1.default>);
}
OnboardingModalNavigator.displayName = 'OnboardingModalNavigator';
exports.default = OnboardingModalNavigator;
