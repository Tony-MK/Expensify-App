"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const useResponsiveLayoutModule = require("@hooks/useResponsiveLayout");
const Navigation_1 = require("@libs/Navigation/Navigation");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const OnboardingWorkspaces_1 = require("@pages/OnboardingWorkspaces");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
TestHelper.setupGlobalFetchMock();
const Stack = (0, createPlatformStackNavigator_1.default)();
const navigate = jest.spyOn(Navigation_1.default, 'navigate');
const renderOnboardingWorkspacesPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORKSPACES} component={OnboardingWorkspaces_1.default} initialParams={initialParams}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
describe('OnboardingWorkspaces Page', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => {
        jest.spyOn(useResponsiveLayoutModule, 'default').mockReturnValue({
            isSmallScreenWidth: false,
            shouldUseNarrowLayout: false,
        });
    });
    afterEach(async () => {
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.clear();
        });
        jest.clearAllMocks();
    });
    it('should navigate to Onboarding employee page when skip is pressed and user is routed app via SMB', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                signupQualifier: CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB,
            });
        });
        const { unmount } = renderOnboardingWorkspacesPage(SCREENS_1.default.ONBOARDING.WORKSPACES, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const skipButton = react_native_1.screen.getByTestId('onboardingWorkSpaceSkipButton');
        const mockEvent = {
            nativeEvent: {},
            type: 'press',
            target: skipButton,
            currentTarget: skipButton,
        };
        react_native_1.fireEvent.press(skipButton, mockEvent);
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute());
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to Onboarding accounting page when skip is pressed and user is routed app via VSB', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                signupQualifier: CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB,
            });
        });
        const { unmount } = renderOnboardingWorkspacesPage(SCREENS_1.default.ONBOARDING.WORKSPACES, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const skipButton = react_native_1.screen.getByTestId('onboardingWorkSpaceSkipButton');
        const mockEvent = {
            nativeEvent: {},
            type: 'press',
            target: skipButton,
            currentTarget: skipButton,
        };
        react_native_1.fireEvent.press(skipButton, mockEvent);
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_ACCOUNTING.getRoute());
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
});
