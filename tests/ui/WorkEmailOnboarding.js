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
const Link_1 = require("@libs/actions/Link");
const Session_1 = require("@libs/actions/Session");
const HttpUtils_1 = require("@libs/HttpUtils");
const Localize_1 = require("@libs/Localize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const OnboardingWorkEmail_1 = require("@pages/OnboardingWorkEmail");
const OnboardingWorkEmailValidation_1 = require("@pages/OnboardingWorkEmailValidation");
const CONST_1 = require("@src/CONST");
const Session_2 = require("@src/libs/actions/Session");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
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
const workEmail = 'testprivateemail@privateEmail.com';
const renderOnboardingWorkEmailPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORK_EMAIL} component={OnboardingWorkEmail_1.default} initialParams={initialParams}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
const renderOnboardingWorkEmailValidationPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.ONBOARDING.WORK_EMAIL_VALIDATION} component={OnboardingWorkEmailValidation_1.default} initialParams={initialParams}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
const navigate = jest.spyOn(Navigation_1.default, 'navigate');
function MergeIntoAccountAndLoginBlockMerge() {
    const originalXhr = HttpUtils_1.default.xhr;
    HttpUtils_1.default.xhr = jest.fn().mockImplementation(() => {
        const mockedResponse = {
            jsonCode: 501,
            onyxData: [
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.NVP_ONBOARDING,
                    value: {
                        isMergeAccountStepCompleted: true,
                        shouldRedirectToClassicAfterMerge: false,
                        isMergingAccountBlocked: true,
                    },
                },
            ],
        };
        // Return a Promise that resolves with the mocked response
        return Promise.resolve(mockedResponse);
    });
    (0, Session_2.MergeIntoAccountAndLogin)(workEmail, '123456', 1);
    return (0, waitForBatchedUpdates_1.default)().then(() => (HttpUtils_1.default.xhr = originalXhr));
}
function MergeIntoAccountAndLoginSuccessful() {
    const originalXhr = HttpUtils_1.default.xhr;
    HttpUtils_1.default.xhr = jest.fn().mockImplementation(() => {
        const mockedResponse = {
            jsonCode: 401,
            onyxData: [
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.NVP_ONBOARDING,
                    value: {
                        isMergeAccountStepCompleted: true,
                    },
                },
            ],
        };
        // Return a Promise that resolves with the mocked response
        return Promise.resolve(mockedResponse);
    });
    (0, Session_2.MergeIntoAccountAndLogin)(workEmail, '123456', 1);
    return (0, waitForBatchedUpdates_1.default)().then(() => (HttpUtils_1.default.xhr = originalXhr));
}
function MergeIntoAccountAndLoginRedirectToClassic() {
    const originalXhr = HttpUtils_1.default.xhr;
    HttpUtils_1.default.xhr = jest.fn().mockImplementation(() => {
        const mockedResponse = {
            jsonCode: 200,
            onyxData: [
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.NVP_ONBOARDING,
                    value: {
                        isMergeAccountStepCompleted: true,
                        shouldRedirectToClassicAfterMerge: true,
                    },
                },
            ],
        };
        // Return a Promise that resolves with the mocked response
        return Promise.resolve(mockedResponse);
    });
    (0, Session_2.MergeIntoAccountAndLogin)(workEmail, '123456', 1);
    return (0, waitForBatchedUpdates_1.default)().then(() => (HttpUtils_1.default.xhr = originalXhr));
}
function AddWorkEmailShouldValidateFailure() {
    const originalXhr = HttpUtils_1.default.xhr;
    HttpUtils_1.default.xhr = jest.fn().mockImplementation(() => {
        const mockedResponse = {
            jsonCode: 200,
            onyxData: [
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.NVP_ONBOARDING,
                    value: {
                        shouldValidate: false,
                    },
                },
            ],
        };
        // Return a Promise that resolves with the mocked response
        return Promise.resolve(mockedResponse);
    });
    (0, Session_1.AddWorkEmail)(workEmail);
    return (0, waitForBatchedUpdates_1.default)().then(() => (HttpUtils_1.default.xhr = originalXhr));
}
function AddWorkEmailShouldValidate() {
    const originalXhr = HttpUtils_1.default.xhr;
    HttpUtils_1.default.xhr = jest.fn().mockImplementation(() => {
        const mockedResponse = {
            jsonCode: 200,
            onyxData: [
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.NVP_ONBOARDING,
                    value: {
                        shouldValidate: true,
                    },
                },
            ],
        };
        // Return a Promise that resolves with the mocked response
        return Promise.resolve(mockedResponse);
    });
    (0, Session_1.AddWorkEmail)(workEmail);
    return (0, waitForBatchedUpdates_1.default)().then(() => (HttpUtils_1.default.xhr = originalXhr));
}
describe('OnboardingWorkEmail Page', () => {
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
    it('should display onboarding work email screen content correctly', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
            });
        });
        const { unmount } = renderOnboardingWorkEmailPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('onboarding.workEmail.title'))).toBeOnTheScreen();
        });
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('onboarding.workEmail.addWorkEmail'))).toBeOnTheScreen();
        });
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.skip'))).toBeOnTheScreen();
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to Onboarding purpose page when skip is pressed and there is no signupQualifier', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
            });
        });
        const { unmount } = renderOnboardingWorkEmailPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const skipButton = react_native_1.screen.getByTestId('onboardingPrivateEmailSkipButton');
        const mockEvent = {
            nativeEvent: {},
            type: 'press',
            target: skipButton,
            currentTarget: skipButton,
        };
        react_native_1.fireEvent.press(skipButton, mockEvent);
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_PURPOSE.getRoute(), { forceReplace: true });
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to Onboarding private domain page when email is entered but shouldValidate is set to false', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
            });
        });
        const { unmount } = renderOnboardingWorkEmailPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        AddWorkEmailShouldValidateFailure();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_PRIVATE_DOMAIN.getRoute(), { forceReplace: true });
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to Onboarding work email validation page when email is entered and shouldValidate is set to true', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
            });
        });
        const { unmount } = renderOnboardingWorkEmailPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        AddWorkEmailShouldValidate();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_WORK_EMAIL_VALIDATION.getRoute());
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to Onboarding employee page when skip is pressed and user is routed app via smb', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                signupQualifier: CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB,
            });
        });
        const { unmount } = renderOnboardingWorkEmailPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const skipButton = react_native_1.screen.getByTestId('onboardingPrivateEmailSkipButton');
        const mockEvent = {
            nativeEvent: {},
            type: 'press',
            target: skipButton,
            currentTarget: skipButton,
        };
        react_native_1.fireEvent.press(skipButton, mockEvent);
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute(), { forceReplace: true });
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
});
describe('OnboardingWorkEmailValidation Page', () => {
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
    it('should display onboarding work email screen content correctly', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                shouldValidate: true,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM, {
                onboardingWorkEmail: workEmail,
            });
        });
        const { unmount } = renderOnboardingWorkEmailValidationPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL_VALIDATION, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('onboarding.workEmailValidation.magicCodeSent', { workEmail }))).toBeOnTheScreen();
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should display onboarding merge block screen content correctly', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                shouldValidate: true,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM, {
                onboardingWorkEmail: workEmail,
            });
        });
        const { unmount } = renderOnboardingWorkEmailValidationPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL_VALIDATION, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await MergeIntoAccountAndLoginBlockMerge();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('onboarding.mergeBlockScreen.subtitle', { workEmail }))).toBeOnTheScreen();
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to Onboarding purpose page when skip is pressed and there is no signupQualifier', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                shouldValidate: true,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM, {
                onboardingWorkEmail: workEmail,
            });
        });
        const { unmount } = renderOnboardingWorkEmailValidationPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL_VALIDATION, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const skipButton = react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.skip'));
        const mockEvent = {
            nativeEvent: {},
            type: 'press',
            target: skipButton,
            currentTarget: skipButton,
        };
        react_native_1.fireEvent.press(skipButton, mockEvent);
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_PURPOSE.getRoute(), { forceReplace: true });
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to Onboarding workspaces page when validate code step is successful and there is no signupQualifier', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                shouldValidate: true,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM, {
                onboardingWorkEmail: workEmail,
            });
        });
        const { unmount } = renderOnboardingWorkEmailValidationPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL_VALIDATION, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        MergeIntoAccountAndLoginSuccessful();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_WORKSPACES.getRoute(), { forceReplace: true });
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should redirect to classic when merging is completed and shouldRedirectToClassicAfterMerge is returned as `true` by the API', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                shouldValidate: true,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM, {
                onboardingWorkEmail: workEmail,
            });
        });
        const { unmount } = renderOnboardingWorkEmailValidationPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL_VALIDATION, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        MergeIntoAccountAndLoginRedirectToClassic();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(Link_1.openOldDotLink).toHaveBeenCalledWith(CONST_1.default.OLDDOT_URLS.INBOX, true);
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to Onboarding employee page when validate code step is successful and user is routed app via smb', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, {
                hasCompletedGuidedSetupFlow: false,
                shouldValidate: true,
                signupQualifier: CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB,
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM, {
                onboardingWorkEmail: workEmail,
            });
        });
        const { unmount } = renderOnboardingWorkEmailValidationPage(SCREENS_1.default.ONBOARDING.WORK_EMAIL_VALIDATION, { backTo: '' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        MergeIntoAccountAndLoginSuccessful();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute(), { forceReplace: true });
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
});
