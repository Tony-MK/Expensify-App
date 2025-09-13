"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ProductTrainingContext_1 = require("@components/ProductTrainingContext");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const TestHelper = require("../../utils/TestHelper");
const waitForBatchedUpdatesWithAct_1 = require("../../utils/waitForBatchedUpdatesWithAct");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../../utils/wrapOnyxWithWaitForBatchedUpdates");
jest.mock('@hooks/useResponsiveLayout', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(),
}));
const DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE = {
    shouldUseNarrowLayout: true,
    isSmallScreenWidth: true,
    isInNarrowPaneModal: false,
    isExtraSmallScreenHeight: false,
    isMediumScreenWidth: false,
    isLargeScreenWidth: false,
    isExtraSmallScreenWidth: false,
    isSmallScreen: false,
    onboardingIsMediumOrLargerScreenWidth: false,
    isExtraLargeScreenWidth: false,
};
const TEST_USER_ACCOUNT_ID = 1;
const TEST_USER_LOGIN = 'test@test.com';
const wrapper = ({ children }) => <ProductTrainingContext_1.ProductTrainingContextProvider>{children}</ProductTrainingContext_1.ProductTrainingContextProvider>;
// A simple component that calls useProductTrainingContext and sets its result into the ref.
// Used in cases where using renderHook is not possible, for example, when we need to share the same instance of the context.
const ProductTraining = (0, react_1.forwardRef)(({ tooltipName, shouldShow }, ref) => {
    const result = (0, ProductTrainingContext_1.useProductTrainingContext)(tooltipName, shouldShow);
    (0, react_1.useImperativeHandle)(ref, () => result);
    return null;
});
const signUpWithTestUser = () => {
    TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN);
};
describe('ProductTrainingContextProvider', () => {
    beforeAll(() => {
        // Initialize Onyx
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        return (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    beforeEach(() => {
        // Set up test environment before each test
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.IS_LOADING_APP, false);
        signUpWithTestUser();
    });
    afterEach(async () => {
        // Clean up test environment after each test
        await react_native_onyx_1.default.clear();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    const mockUseResponsiveLayout = useResponsiveLayout_1.default;
    mockUseResponsiveLayout.mockReturnValue({ ...DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE, shouldUseNarrowLayout: false });
    describe('Basic Tooltip Registration', () => {
        it('should not register tooltips when app is loading', async () => {
            // When app is loading
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.IS_LOADING_APP, true);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const testTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP;
            const { result } = (0, react_native_1.renderHook)(() => (0, ProductTrainingContext_1.useProductTrainingContext)(testTooltip), { wrapper });
            // Then tooltip should not show
            expect(result.current.shouldShowProductTrainingTooltip).toBe(false);
        });
        it('should not register tooltips when onboarding is not completed', async () => {
            // When onboarding is not completed
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: false });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const testTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP;
            const { result } = (0, react_native_1.renderHook)(() => (0, ProductTrainingContext_1.useProductTrainingContext)(testTooltip), { wrapper });
            // Then tooltip should not show
            expect(result.current.shouldShowProductTrainingTooltip).toBe(false);
        });
        it('should register tooltips when onboarding is completed and user is not migrated', async () => {
            // When onboarding is completed
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const testTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP;
            const { result } = (0, react_native_1.renderHook)(() => (0, ProductTrainingContext_1.useProductTrainingContext)(testTooltip), { wrapper });
            // Then tooltip should show
            expect(result.current.shouldShowProductTrainingTooltip).toBe(true);
        });
        it('should keep tooltip visible when another tooltip with shouldShow=false is unmounted', async () => {
            const testTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP;
            const ref = (0, react_1.createRef)();
            // When multiple tooltips with the same name but different shouldShow values are rendered
            const { rerender } = (0, react_native_1.render)(wrapper({
                children: (<>
                            <ProductTraining ref={ref} tooltipName={testTooltip} shouldShow/>
                            <ProductTraining tooltipName={testTooltip} shouldShow={false}/>
                        </>),
            }));
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then tooltip should be shown
            expect(ref.current?.shouldShowProductTrainingTooltip).toBe(true);
            // When tooltip with shouldShow=false is unmounted
            rerender(wrapper({
                children: (<ProductTraining ref={ref} tooltipName={testTooltip} shouldShow/>),
            }));
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the remaining tooltip should still be shown
            expect(ref.current?.shouldShowProductTrainingTooltip).toBe(true);
        });
    });
    describe('Migrated User Scenarios', () => {
        it('should not show tooltips for migrated users before welcome modal dismissal', async () => {
            // When user is a migrated user and welcome modal is not dismissed
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { nudgeMigration: { timestamp: new Date() } });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then tooltips should not show
            const testTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.BOTTOM_NAV_INBOX_TOOLTIP;
            const { result } = (0, react_native_1.renderHook)(() => (0, ProductTrainingContext_1.useProductTrainingContext)(testTooltip), { wrapper });
            // Expect tooltip to be hidden
            expect(result.current.shouldShowProductTrainingTooltip).toBe(false);
        });
        it('should show tooltips for migrated users after welcome modal dismissal', async () => {
            // When migrated user has dismissed welcome modal
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { nudgeMigration: { timestamp: new Date() } });
            const date = new Date();
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, {
                migratedUserWelcomeModal: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                },
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const testTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.BOTTOM_NAV_INBOX_TOOLTIP;
            const { result } = (0, react_native_1.renderHook)(() => (0, ProductTrainingContext_1.useProductTrainingContext)(testTooltip), { wrapper });
            // Then tooltip should show
            expect(result.current.shouldShowProductTrainingTooltip).toBe(true);
        });
    });
    describe('Tooltip Dismissal', () => {
        it('should not show dismissed tooltips', async () => {
            // When a tooltip has been dismissed
            const date = new Date();
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
            const testTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP;
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, {
                migratedUserWelcomeModal: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                },
                [testTooltip]: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                },
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const { result } = (0, react_native_1.renderHook)(() => (0, ProductTrainingContext_1.useProductTrainingContext)(testTooltip), { wrapper });
            // Then tooltip should not show
            expect(result.current.shouldShowProductTrainingTooltip).toBe(false);
        });
        it('should hide tooltip when hideProductTrainingTooltip is called', async () => {
            // When migrated user has dismissed welcome modal
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
            const date = new Date();
            react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, {
                migratedUserWelcomeModal: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                },
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const testTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP;
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, ProductTrainingContext_1.useProductTrainingContext)(testTooltip), { wrapper });
            // When the user dismiss the tooltip
            result.current.hideProductTrainingTooltip();
            rerender({});
            // Then tooltip should not show
            expect(result.current.shouldShowProductTrainingTooltip).toBe(false);
            // And dismissed tooltip should be recorded in Onyx
            const dismissedTooltipsOnyxState = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING,
                    callback: (dismissedTooltips) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(dismissedTooltips);
                    },
                });
            });
            // Expect dismissed tooltip to be recorded
            expect(dismissedTooltipsOnyxState).toHaveProperty(testTooltip);
        });
    });
    describe('Layout Specific Behavior', () => {
        it('should handle wide layout specific tooltips based on screen width', async () => {
            // When narrow layout is true
            mockUseResponsiveLayout.mockReturnValue({ ...DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE, shouldUseNarrowLayout: true });
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const testTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.RENAME_SAVED_SEARCH;
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, ProductTrainingContext_1.useProductTrainingContext)(testTooltip), { wrapper });
            // Then wide layout tooltip should not show
            expect(result.current.shouldShowProductTrainingTooltip).toBe(false);
            // When narrow layout changes to false
            mockUseResponsiveLayout.mockReturnValue({ ...DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE, shouldUseNarrowLayout: false });
            rerender({});
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then wide layout tooltip should show
            expect(result.current.shouldShowProductTrainingTooltip).toBe(true);
        });
    });
    describe('Priority Handling', () => {
        it('should show only highest priority tooltip when multiple are active', async () => {
            // When multiple tooltips are registered and no tooltips are dismissed
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
            const date = new Date();
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, {
                migratedUserWelcomeModal: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                },
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then only highest priority tooltip should show
            const highPriorityTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP_MANAGER;
            const lowPriorityTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP;
            const { result } = (0, react_native_1.renderHook)(() => ({
                higher: (0, ProductTrainingContext_1.useProductTrainingContext)(highPriorityTooltip),
                lower: (0, ProductTrainingContext_1.useProductTrainingContext)(lowPriorityTooltip),
            }), { wrapper });
            // Expect only higher priority tooltip to be visible
            expect(result.current.higher.shouldShowProductTrainingTooltip).toBe(true);
            expect(result.current.lower.shouldShowProductTrainingTooltip).toBe(false);
        });
        it('should show lower priority tooltip when higher priority is dismissed', async () => {
            // When higher priority tooltip is dismissed
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
            const date = new Date();
            const highPriorityTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP_MANAGER;
            const lowPriorityTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP;
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, {
                migratedUserWelcomeModal: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                },
                [highPriorityTooltip]: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                },
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then lower priority tooltip should show
            const { result } = (0, react_native_1.renderHook)(() => ({
                higher: (0, ProductTrainingContext_1.useProductTrainingContext)(highPriorityTooltip),
                lower: (0, ProductTrainingContext_1.useProductTrainingContext)(lowPriorityTooltip),
            }), { wrapper });
            // Expect higher priority tooltip to be hidden and lower priority to be visible
            expect(result.current.higher.shouldShowProductTrainingTooltip).toBe(false);
            expect(result.current.lower.shouldShowProductTrainingTooltip).toBe(true);
        });
        it('should transition to next priority tooltip when current is dismissed', async () => {
            // When starting with all tooltips visible
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
            const date = new Date();
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, {
                migratedUserWelcomeModal: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                },
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            const highPriorityTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP_MANAGER;
            const lowPriorityTooltip = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP;
            const { result } = (0, react_native_1.renderHook)(() => ({
                higher: (0, ProductTrainingContext_1.useProductTrainingContext)(highPriorityTooltip),
                lower: (0, ProductTrainingContext_1.useProductTrainingContext)(lowPriorityTooltip),
            }), { wrapper });
            // Then initially higher priority should be visible
            expect(result.current.higher.shouldShowProductTrainingTooltip).toBe(true);
            expect(result.current.lower.shouldShowProductTrainingTooltip).toBe(false);
            // When dismissing higher priority tooltip
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, {
                [highPriorityTooltip]: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                },
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then lower priority tooltip should become visible
            expect(result.current.lower.shouldShowProductTrainingTooltip).toBe(true);
        });
    });
});
