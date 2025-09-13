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
const Localize_1 = require("@libs/Localize");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const OnboardingEmployees_1 = require("@pages/OnboardingEmployees");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
jest.mock('@libs/actions/Link', () => ({
    openOldDotLink: jest.fn(),
}));
jest.mock('@rnmapbox/maps', () => {
    return {
        default: jest.fn(),
        MarkerView: jest.fn(),
        setAccessToken: jest.fn(),
    };
});
jest.mock('@react-native-community/geolocation', () => ({
    setRNConfiguration: jest.fn(),
}));
TestHelper.setupGlobalFetchMock();
const Stack = (0, createPlatformStackNavigator_1.default)();
const renderOnboardingEmployeesPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.ONBOARDING.EMPLOYEES} component={OnboardingEmployees_1.default} initialParams={initialParams}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
describe('OnboardingEmployees Page', () => {
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
    it('should display 1-10 option when the signupQualifier is not smb', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
            });
        });
        const { unmount } = renderOnboardingEmployeesPage(SCREENS_1.default.ONBOARDING.EMPLOYEES, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('onboarding.employees.1-10'))).toBeOnTheScreen();
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should hide 1-10 option when the signupQualifier is smb', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                signupQualifier: CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB,
            });
        });
        const { unmount } = renderOnboardingEmployeesPage(SCREENS_1.default.ONBOARDING.EMPLOYEES, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('onboarding.employees.1-10'))).not.toBeOnTheScreen();
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
});
