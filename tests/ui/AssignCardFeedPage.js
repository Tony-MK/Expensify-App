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
const AssignCardFeedPage_1 = require("@pages/workspace/companyCards/assignCard/AssignCardFeedPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const LHNTestUtils = require("../utils/LHNTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
// Set up a global fetch mock for API requests in tests.
TestHelper.setupGlobalFetchMock();
jest.mock('@hooks/useNetwork', () => jest.fn(() => ({
    isOffline: false,
})));
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
jest.mock('react-native-plaid-link-sdk', () => ({
    dismissLink: jest.fn(),
    openLink: jest.fn(),
    usePlaidEmitter: jest.fn(),
}));
jest.mock('@components/FormAlertWrapper', () => 'FormAlertWrapper');
jest.mock('@components/FormAlertWithSubmitButton', () => 'FormAlertWithSubmitButton');
// Create a stack navigator for the settings pages.
const Stack = (0, createPlatformStackNavigator_1.default)();
// Renders the AssignCardFeedPage inside a navigation container with necessary providers.
const renderPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.WORKSPACE.COMPANY_CARDS_ASSIGN_CARD} component={AssignCardFeedPage_1.default} initialParams={initialParams}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
describe('AssignCardFeedPage', () => {
    beforeAll(() => {
        // Initialize Onyx with required keys before running any test.
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => {
        // Mock the useResponsiveLayout hook to control layout behavior in tests.
        jest.spyOn(useResponsiveLayoutModule, 'default').mockReturnValue({
            isSmallScreenWidth: false,
            shouldUseNarrowLayout: false,
        });
    });
    afterEach(async () => {
        // Clear Onyx data and reset all mocks after each test to ensure a clean state.
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.clear();
        });
        jest.clearAllMocks();
    });
    it('should navigate to the member details page as the assignee email has not changed', async () => {
        // Sign in as a test user before running the test.
        await TestHelper.signInWithTestUser();
        const goBack = jest.spyOn(Navigation_1.default, 'goBack');
        const policy = {
            ...LHNTestUtils.getFakePolicy(),
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            areTagsEnabled: true,
            requiresTag: true,
        };
        // Add mock policy and mock the assign card details
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.ASSIGN_CARD, {
                data: {
                    bankName: 'vcf',
                    email: 'testaccount+1@gmail.com',
                    cardName: "Test 1's card",
                    cardNumber: '490901XXXXXX1234',
                    // cspell:disable-next-line
                    encryptedCardNumber: 'v12:74E3CA3C4C0FA02FDCF754FDSFDSF',
                    dateOption: 'fromBeginning',
                    startDate: '2024-12-27',
                },
                currentStep: 'Confirmation',
                isEditing: false,
            });
        });
        // Render the page with the specified policyID and backTo param
        const { unmount } = renderPage(SCREENS_1.default.WORKSPACE.COMPANY_CARDS_ASSIGN_CARD, {
            policyID: policy.id,
            feed: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX,
            backTo: ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policy?.id, 1234),
        });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Verify that Assign card button is visible on the screen
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByTestId('assignCardButtonTestID')).toBeOnTheScreen();
        });
        // Click the Assign Card button
        const assignCardButton = react_native_1.screen.getByTestId('assignCardButtonTestID');
        // Create a mock event object that matches GestureResponderEvent.
        const mockEvent = {
            nativeEvent: {},
            type: 'press',
            target: assignCardButton,
            currentTarget: assignCardButton,
        };
        react_native_1.fireEvent.press(assignCardButton, mockEvent);
        // Verify that we navigate to the member details page as the card assignee has not changed
        await (0, react_native_1.waitFor)(() => {
            expect(goBack).toHaveBeenCalledWith(ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policy.id, 1234));
        });
        // Unmount the component after assertions to clean up.
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should navigate to the company cards page as the assignee email has changed', async () => {
        // Sign in as a test user before running the test.
        await TestHelper.signInWithTestUser();
        const navigate = jest.spyOn(Navigation_1.default, 'navigate');
        const policy = {
            ...LHNTestUtils.getFakePolicy(),
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            areTagsEnabled: true,
            requiresTag: true,
        };
        // Add mock policy and mock the assign card details
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.ASSIGN_CARD, {
                data: {
                    bankName: 'vcf',
                    email: 'testaccount+1@gmail.com',
                    cardName: "Test 1's card",
                    cardNumber: '490901XXXXXX1234',
                    // cspell:disable-next-line
                    encryptedCardNumber: 'v12:74E3CA3C4C0FA02FDCF754FDSFDSF',
                    dateOption: 'fromBeginning',
                    startDate: '2024-12-27',
                },
                currentStep: 'Confirmation',
                isEditing: false,
            });
        });
        // Render the page with the specified policyID and backTo param
        const { unmount } = renderPage(SCREENS_1.default.WORKSPACE.COMPANY_CARDS_ASSIGN_CARD, {
            policyID: policy.id,
            feed: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX,
            backTo: ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policy?.id, 1234),
        });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Mock the action of changing the assignee of the card
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.ASSIGN_CARD, {
                data: {
                    email: 'testaccount+2@gmail.com',
                },
            });
        });
        // Verify that Assign card button is visible on the screen
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByTestId('assignCardButtonTestID')).toBeOnTheScreen();
        });
        // Click the Assign Card button
        const assignCardButton = react_native_1.screen.getByTestId('assignCardButtonTestID');
        // Create a mock event object that matches GestureResponderEvent
        const mockEvent = {
            nativeEvent: {},
            type: 'press',
            target: assignCardButton,
            currentTarget: assignCardButton,
        };
        react_native_1.fireEvent.press(assignCardButton, mockEvent);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Verify that we navigate to the company cards page as the card assignee has changed
        await (0, react_native_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policy.id), { forceReplace: true });
        });
        // Unmount the component after assertions to clean up.
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
});
