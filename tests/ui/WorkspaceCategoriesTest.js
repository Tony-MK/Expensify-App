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
const WorkspaceCategoriesPage_1 = require("@pages/workspace/categories/WorkspaceCategoriesPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const LHNTestUtils = require("../utils/LHNTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
jest.unmock('react-native-reanimated');
jest.mock('@src/components/ConfirmedRoute.tsx');
TestHelper.setupGlobalFetchMock();
const Stack = (0, createPlatformStackNavigator_1.default)();
const renderPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.WORKSPACE.CATEGORIES} component={WorkspaceCategoriesPage_1.default} initialParams={initialParams}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
describe('WorkspaceCategories', () => {
    const FIRST_CATEGORY = 'categoryOne';
    const SECOND_CATEGORY = 'categoryTwo';
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, CONST_1.default.LOCALES.EN);
        });
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
    it('should delete categories through UI interactions', async () => {
        await TestHelper.signInWithTestUser();
        const policy = {
            ...LHNTestUtils.getFakePolicy(),
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            areCategoriesEnabled: true,
        };
        const categories = {
            [FIRST_CATEGORY]: {
                name: FIRST_CATEGORY,
                enabled: true,
            },
            [SECOND_CATEGORY]: {
                name: SECOND_CATEGORY,
                enabled: true,
            },
        };
        // Initialize categories
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policy.id}`, categories);
        });
        const { unmount } = renderPage(SCREENS_1.default.WORKSPACE.CATEGORIES, { policyID: policy.id });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Wait for initial render and verify categories are visible
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText(FIRST_CATEGORY)).toBeOnTheScreen();
        });
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText(SECOND_CATEGORY)).toBeOnTheScreen();
        });
        // Select categories to delete by clicking their checkboxes
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(`TableListItemCheckbox-${FIRST_CATEGORY}`));
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(`TableListItemCheckbox-${SECOND_CATEGORY}`));
        const dropdownMenuButtonTestID = `${WorkspaceCategoriesPage_1.default.displayName}-header-dropdown-menu-button`;
        // Wait for selection mode to be active and click the dropdown menu button
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByTestId(dropdownMenuButtonTestID)).toBeOnTheScreen();
        });
        // Click the "2 selected" button to open the menu
        const dropdownButton = react_native_1.screen.getByTestId(dropdownMenuButtonTestID);
        react_native_1.fireEvent.press(dropdownButton);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Wait for menu items to be visible
        await (0, react_native_1.waitFor)(() => {
            const deleteText = (0, Localize_1.translateLocal)('workspace.categories.deleteCategories');
            expect(react_native_1.screen.getByText(deleteText)).toBeOnTheScreen();
        });
        // Find and verify "Delete categories" dropdown menu item
        const deleteMenuItem = react_native_1.screen.getByTestId('PopoverMenuItem-Delete categories');
        expect(deleteMenuItem).toBeOnTheScreen();
        // Create a mock event object that matches GestureResponderEvent. Needed for onPress in MenuItem to be called
        const mockEvent = {
            nativeEvent: {},
            type: 'press',
            target: deleteMenuItem,
            currentTarget: deleteMenuItem,
        };
        react_native_1.fireEvent.press(deleteMenuItem, mockEvent);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // After clicking delete categories dropdown menu item, verify the confirmation modal appears
        await (0, react_native_1.waitFor)(() => {
            const confirmModalPrompt = (0, Localize_1.translateLocal)('workspace.categories.deleteCategoriesPrompt');
            expect(react_native_1.screen.getByText(confirmModalPrompt)).toBeOnTheScreen();
        });
        // Verify the delete button in the modal is visible
        await (0, react_native_1.waitFor)(() => {
            const deleteConfirmButton = react_native_1.screen.getByLabelText((0, Localize_1.translateLocal)('common.delete'));
            expect(deleteConfirmButton).toBeOnTheScreen();
        });
        // Click the delete button in the confirmation modal
        const deleteConfirmButton = react_native_1.screen.getByLabelText((0, Localize_1.translateLocal)('common.delete'));
        react_native_1.fireEvent.press(deleteConfirmButton);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Verify the categories are deleted from the UI
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.queryByText(FIRST_CATEGORY)).not.toBeOnTheScreen();
        });
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.queryByText(SECOND_CATEGORY)).not.toBeOnTheScreen();
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should show a blocking modal when trying to disable the only enabled category when policy has requiresCategory set to true', async () => {
        await TestHelper.signInWithTestUser();
        const policy = {
            ...LHNTestUtils.getFakePolicy(),
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            areCategoriesEnabled: true,
            requiresCategory: true,
        };
        const categories = {
            [FIRST_CATEGORY]: {
                name: FIRST_CATEGORY,
                enabled: true,
            },
            [SECOND_CATEGORY]: {
                name: SECOND_CATEGORY,
                enabled: true,
            },
        };
        // Initialize categories
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policy.id}`, categories);
        });
        const { unmount } = renderPage(SCREENS_1.default.WORKSPACE.CATEGORIES, { policyID: policy.id });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Wait for initial render and verify categories are visible
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText(FIRST_CATEGORY)).toBeOnTheScreen();
        });
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText(SECOND_CATEGORY)).toBeOnTheScreen();
        });
        // Select categories to delete by clicking their checkboxes
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(`TableListItemCheckbox-${FIRST_CATEGORY}`));
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(`TableListItemCheckbox-${SECOND_CATEGORY}`));
        const dropdownMenuButtonTestID = `${WorkspaceCategoriesPage_1.default.displayName}-header-dropdown-menu-button`;
        // Wait for selection mode to be active and click the dropdown menu button
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByTestId(dropdownMenuButtonTestID)).toBeOnTheScreen();
        });
        // Click the "2 selected" button to open the menu
        const dropdownButton = react_native_1.screen.getByTestId(dropdownMenuButtonTestID);
        react_native_1.fireEvent.press(dropdownButton);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Wait for menu items to be visible
        await (0, react_native_1.waitFor)(() => {
            const disableText = (0, Localize_1.translateLocal)('workspace.categories.disableCategories');
            expect(react_native_1.screen.getByText(disableText)).toBeOnTheScreen();
        });
        // Find and verify "Disable categories" dropdown menu item
        const disableMenuItem = react_native_1.screen.getByTestId('PopoverMenuItem-Disable categories');
        expect(disableMenuItem).toBeOnTheScreen();
        // Create a mock event object that matches GestureResponderEvent. Needed for onPress in MenuItem to be called
        const mockEvent = {
            nativeEvent: {},
            type: 'press',
            target: disableMenuItem,
            currentTarget: disableMenuItem,
        };
        react_native_1.fireEvent.press(disableMenuItem, mockEvent);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // After clicking disable categories dropdown menu item, verify the blocking modal appears
        await (0, react_native_1.waitFor)(() => {
            const blockingPrompt = (0, Localize_1.translateLocal)('workspace.categories.cannotDeleteOrDisableAllCategories.title');
            expect(react_native_1.screen.getByText(blockingPrompt)).toBeOnTheScreen();
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
});
