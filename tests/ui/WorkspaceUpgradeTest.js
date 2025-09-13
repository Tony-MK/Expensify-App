"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const HTMLEngineProvider_1 = require("@components/HTMLEngineProvider");
const types_1 = require("@libs/API/types");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const SequentialQueue_1 = require("@libs/Network/SequentialQueue");
const WorkspaceUpgradePage_1 = require("@pages/workspace/upgrade/WorkspaceUpgradePage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const LHNTestUtils = require("../utils/LHNTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
TestHelper.setupGlobalFetchMock();
const Stack = (0, createPlatformStackNavigator_1.default)();
const renderPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<native_1.NavigationContainer>
            <HTMLEngineProvider_1.default>
                <Stack.Navigator initialRouteName={initialRouteName}>
                    <Stack.Screen name={SCREENS_1.default.WORKSPACE.UPGRADE} component={WorkspaceUpgradePage_1.default} initialParams={initialParams}/>
                </Stack.Navigator>
            </HTMLEngineProvider_1.default>
        </native_1.NavigationContainer>);
};
describe('WorkspaceUpgrade', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    afterEach(async () => {
        await (0, SequentialQueue_1.waitForIdle)();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.clear();
        });
        jest.clearAllMocks();
    });
    it('should enable policy rules', async () => {
        const policy = LHNTestUtils.getFakePolicy();
        // Given that a policy is initialized in Onyx
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
        // And WorkspaceUpgradePage for rules is opened
        const { unmount } = renderPage(SCREENS_1.default.WORKSPACE.UPGRADE, { policyID: policy.id, featureName: 'rules' });
        // When the policy is upgraded by clicking on the Upgrade button
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId('upgrade-button'));
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Then "Upgrade to Corporate" API request should be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.UPGRADE_TO_CORPORATE, 1);
        // When WorkspaceUpgradePage is unmounted
        unmount();
        await (0, waitForBatchedUpdates_1.default)();
        // Then "Set policy rules enabled" API request should be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.SET_POLICY_RULES_ENABLED, 1);
    });
    it("should show the upgrade corporate plan price is in the user's local currency", async () => {
        // Team policy which the user can upgrade to corporate
        const policy = LHNTestUtils.getFakePolicy();
        // Given that a policy is initialized in Onyx
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
        // Render the WorkspaceUpgradePage without initializing user's preferred currency
        renderPage(SCREENS_1.default.WORKSPACE.UPGRADE, { policyID: policy.id });
        // Expect the price to be in USD, as the user's preferred currency is not initialized
        expect(react_native_1.screen.getByText(`${(0, CurrencyUtils_1.convertToShortDisplayString)(CONST_1.default.SUBSCRIPTION_PRICES[CONST_1.default.PAYMENT_CARD_CURRENCY.USD][CONST_1.default.POLICY.TYPE.CORPORATE][CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL], CONST_1.default.PAYMENT_CARD_CURRENCY.USD)}`)).toBeTruthy();
        // Iterate through all payment card currencies
        for (const currency of Object.values(CONST_1.default.PAYMENT_CARD_CURRENCY)) {
            // Format the price in the user's preferred currency
            const price = `${(0, CurrencyUtils_1.convertToShortDisplayString)(CONST_1.default.SUBSCRIPTION_PRICES[currency][CONST_1.default.POLICY.TYPE.CORPORATE][CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL], currency)}`;
            // Initialized the user's preferred currency to another payment card currency
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [CONST_1.default.DEFAULT_NUMBER_ID]: { localCurrencyCode: currency } });
            // Render the WorkspaceUpgradePage without a feature to render GenericFeaturesView
            renderPage(SCREENS_1.default.WORKSPACE.UPGRADE, { policyID: policy.id });
            expect(react_native_1.screen.getByText(price)).toBeTruthy();
            // Render the WorkspaceUpgradePage with rules as a feature to render UpgradeIntro
            const { unmount } = renderPage(SCREENS_1.default.WORKSPACE.UPGRADE, { policyID: policy.id, featureName: 'rules' });
            expect(react_native_1.screen.getByText(price)).toBeTruthy();
            unmount();
        }
        await (0, waitForBatchedUpdates_1.default)();
    });
});
