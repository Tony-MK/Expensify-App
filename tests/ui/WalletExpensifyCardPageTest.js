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
const ExpensifyCardPage_1 = require("@pages/settings/Wallet/ExpensifyCardPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
// Set up a global fetch mock for API requests in tests.
TestHelper.setupGlobalFetchMock();
// Create a stack navigator for the settings pages.
const Stack = (0, createPlatformStackNavigator_1.default)();
const userCardID = '1234';
// Renders the ExpensifyCardPage inside a navigation container with necessary providers.
const renderPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.SETTINGS.WALLET.DOMAIN_CARD} component={ExpensifyCardPage_1.default} initialParams={initialParams}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
describe('ExpensifyCardPage', () => {
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
    it('should show the Report Fraud and Reveal details options on screen', async () => {
        // Sign in as a test user before running the test.
        await TestHelper.signInWithTestUser();
        // Add a mock card to Onyx storage to simulate a valid card being loaded.
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.CARD_LIST, {
                [userCardID]: {
                    cardID: 1234,
                    state: CONST_1.default.EXPENSIFY_CARD.STATE.OPEN,
                    domainName: 'xyz',
                    nameValuePairs: {
                        isVirtual: true,
                        cardTitle: 'Test Virtual Card',
                    },
                    availableSpend: 50000,
                    fraud: null,
                },
            });
        });
        // Render the page with the specified card ID.
        const { unmount } = renderPage(SCREENS_1.default.SETTINGS.WALLET.DOMAIN_CARD, { cardID: '1234' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Verify that the "Report Fraud" option is displayed on the screen.
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('cardPage.reportFraud'))).toBeOnTheScreen();
        });
        // Verify that the "Reveal Details" option is displayed on the screen.
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('cardPage.cardDetails.revealDetails'))).toBeOnTheScreen();
        });
        // Unmount the component after assertions to clean up.
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should not show the Report Fraud and Reveal details options on screen', async () => {
        // Sign in as a test user before running the test.
        await TestHelper.signInWithTestUser();
        // Add a mock card to Onyx storage with additional delegated access data.
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.CARD_LIST, {
                [userCardID]: {
                    cardID: 1234,
                    state: CONST_1.default.EXPENSIFY_CARD.STATE.OPEN,
                    domainName: 'xyz',
                    nameValuePairs: {
                        isVirtual: true,
                        cardTitle: 'Test Virtual Card',
                    },
                    availableSpend: 50000,
                    fraud: null,
                },
            });
            // Add delegated access data to simulate a user without fraud reporting permissions.
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, {
                delegatedAccess: {
                    delegate: 'test@test.com',
                },
            });
        });
        // Render the page with the specified card ID.
        const { unmount } = renderPage(SCREENS_1.default.SETTINGS.WALLET.DOMAIN_CARD, { cardID: '1234' });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Verify that the "Report Fraud" option is NOT displayed on the screen.
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('cardPage.reportFraud'))).not.toBeOnTheScreen();
        });
        // Verify that the "Reveal Details" option is NOT displayed on the screen.
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('cardPage.cardDetails.revealDetails'))).not.toBeOnTheScreen();
        });
        // Unmount the component after assertions to clean up.
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
});
