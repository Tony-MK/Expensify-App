"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const CurrentUserPersonalDetailsProvider_1 = require("@components/CurrentUserPersonalDetailsProvider");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const useResponsiveLayoutModule = require("@hooks/useResponsiveLayout");
const Localize_1 = require("@libs/Localize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const OnboardingPersonalDetails_1 = require("@pages/OnboardingPersonalDetails");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
TestHelper.setupGlobalFetchMock();
const Stack = (0, createPlatformStackNavigator_1.default)();
const navigate = jest.spyOn(Navigation_1.default, 'navigate');
const fakeEmail = 'fake@gmail.com';
const mockLoginList = {
    [fakeEmail]: {
        partnerName: 'expensify.com',
        partnerUserID: fakeEmail,
        validatedDate: 'fake-validatedDate',
    },
};
const renderOnboardingPersonalDetailsPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsProvider, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.ONBOARDING.PERSONAL_DETAILS} component={OnboardingPersonalDetails_1.default} initialParams={initialParams}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
describe('OnboardingPersonalDetails Page', () => {
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
    it('should navigate to Onboarding Private Domain page when submitting form and user is routed app via VSB with unvalidated account and private domain', async () => {
        await TestHelper.signInWithTestUser();
        // Setup account as private domain and has accessible policies
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, {
                isFromPublicDomain: false,
                hasAccessibleDomainPolicies: true,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.LOGIN_LIST, mockLoginList);
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                signupQualifier: CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM);
        });
        const { unmount } = renderOnboardingPersonalDetailsPage(SCREENS_1.default.ONBOARDING.PERSONAL_DETAILS, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Submit the form
        react_native_1.fireEvent.press(react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.continue')));
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_PRIVATE_DOMAIN.getRoute());
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to Onboarding workspaces page when submitting form and user is routed app via SMB with unvalidated account and private domain', async () => {
        await TestHelper.signInWithTestUser();
        // Setup account as private domain and has accessible policies
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, {
                isFromPublicDomain: false,
                hasAccessibleDomainPolicies: true,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.LOGIN_LIST, mockLoginList);
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                signupQualifier: CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM);
        });
        const { unmount } = renderOnboardingPersonalDetailsPage(SCREENS_1.default.ONBOARDING.PERSONAL_DETAILS, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Submit the form
        react_native_1.fireEvent.press(react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.continue')));
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_PRIVATE_DOMAIN.getRoute());
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
});
