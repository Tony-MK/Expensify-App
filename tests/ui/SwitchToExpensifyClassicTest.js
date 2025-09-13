"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NativeNavigation = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const react_test_renderer_1 = require("react-test-renderer");
const Localize_1 = require("@libs/Localize");
const App_1 = require("@src/App");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PusherHelper_1 = require("../utils/PusherHelper");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
const USER_A_ACCOUNT_ID = 1;
const USER_A_EMAIL = 'user_a@test.com';
jest.setTimeout(60000);
jest.mock('@react-navigation/native');
TestHelper.setupApp();
TestHelper.setupGlobalFetchMock();
function navigateToSetting() {
    const hintText = (0, Localize_1.translateLocal)('sidebarScreen.buttonMySettings');
    const mySettingButton = react_native_1.screen.queryByAccessibilityHint(hintText);
    if (mySettingButton) {
        (0, react_native_1.fireEvent)(mySettingButton, 'press');
    }
    return (0, waitForBatchedUpdatesWithAct_1.default)();
}
function navigateToExpensifyClassicFlow() {
    const hintText = (0, Localize_1.translateLocal)('exitSurvey.goToExpensifyClassic');
    const switchToExpensifyClassicBtn = react_native_1.screen.queryByAccessibilityHint(hintText);
    if (switchToExpensifyClassicBtn) {
        (0, react_native_1.fireEvent)(switchToExpensifyClassicBtn, 'press');
    }
    return (0, waitForBatchedUpdatesWithAct_1.default)();
}
function signInAppAndEnterTestFlow(dismissedValue) {
    (0, react_native_1.render)(<App_1.default />);
    return (0, waitForBatchedUpdatesWithAct_1.default)()
        .then(async () => {
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const hintText = (0, Localize_1.translateLocal)('loginForm.loginForm');
        const loginForm = react_native_1.screen.queryAllByLabelText(hintText);
        expect(loginForm).toHaveLength(1);
        await (0, react_test_renderer_1.act)(async () => {
            await TestHelper.signInWithTestUser(USER_A_ACCOUNT_ID, USER_A_EMAIL, undefined, undefined, 'A');
        });
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, {
            classicRedirect: {
                dismissed: dismissedValue,
            },
        });
        await (0, waitForBatchedUpdates_1.default)();
        return navigateToSetting();
    })
        .then(async () => {
        await (0, react_test_renderer_1.act)(() => NativeNavigation.triggerTransitionEnd());
        return navigateToExpensifyClassicFlow();
    });
}
describe('Switch to Expensify Classic flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        // Unsubscribe to pusher channels
        PusherHelper_1.default.teardown();
    });
    test('Should navigate to exit survey reason page', () => {
        signInAppAndEnterTestFlow(true).then(() => {
            expect(react_native_1.screen.getAllByText((0, Localize_1.translateLocal)('exitSurvey.reasonPage.subtitle')).at(0)).toBeOnTheScreen();
        });
    });
});
