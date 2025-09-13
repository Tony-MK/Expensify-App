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
const WorkspaceTagsPage_1 = require("@pages/workspace/tags/WorkspaceTagsPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const LHNTestUtils = require("../utils/LHNTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
TestHelper.setupGlobalFetchMock();
jest.unmock('react-native-reanimated');
const Stack = (0, createPlatformStackNavigator_1.default)();
const renderPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.WORKSPACE.TAGS} component={WorkspaceTagsPage_1.default} initialParams={initialParams}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
const FIRST_TAG = 'Tag One';
const SECOND_TAG = 'Tag Two';
const tags = {
    TagListOne: {
        name: 'TagListOne',
        required: true,
        orderWeight: 1,
        tags: {
            [FIRST_TAG]: {
                name: FIRST_TAG,
                enabled: true,
            },
            [SECOND_TAG]: {
                name: SECOND_TAG,
                enabled: true,
            },
        },
    },
};
describe('WorkspaceTags', () => {
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
            isSmallScreenWidth: true,
            shouldUseNarrowLayout: true,
        });
    });
    afterEach(async () => {
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.clear();
        });
        jest.clearAllMocks();
    });
    it('should show select option when the item is not selected and deselect option when the item is selected', async () => {
        await TestHelper.signInWithTestUser();
        const policy = {
            ...LHNTestUtils.getFakePolicy(),
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            areTagsEnabled: true,
            requiresTag: true,
        };
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policy.id}`, tags);
        });
        const { unmount } = renderPage(SCREENS_1.default.WORKSPACE.TAGS, { policyID: policy.id });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText(FIRST_TAG)).toBeOnTheScreen();
        });
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText(SECOND_TAG)).toBeOnTheScreen();
        });
        // Long press on the first tag to trigger the select action
        (0, react_native_1.fireEvent)(react_native_1.screen.getByTestId(`base-list-item-Tag One`), 'onLongPress');
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Wait for the "Select" option to appear
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.select'))).toBeOnTheScreen();
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    it('should show a blocking modal when trying to disable the only enabled tag when policy has requiresTag set to true', async () => {
        jest.spyOn(useResponsiveLayoutModule, 'default').mockReturnValue({
            isSmallScreenWidth: false,
            shouldUseNarrowLayout: false,
        });
        await TestHelper.signInWithTestUser();
        const policy = {
            ...LHNTestUtils.getFakePolicy(),
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            areTagsEnabled: true,
            requiresTag: true,
        };
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policy.id}`, tags);
        });
        const { unmount } = renderPage(SCREENS_1.default.WORKSPACE.TAGS, { policyID: policy.id });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText(FIRST_TAG)).toBeOnTheScreen();
        });
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText(SECOND_TAG)).toBeOnTheScreen();
        });
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(`TableListItemCheckbox-${FIRST_TAG}`));
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(`TableListItemCheckbox-${SECOND_TAG}`));
        const dropdownMenuButtonTestID = `${WorkspaceTagsPage_1.default.displayName}-header-dropdown-menu-button`;
        react_native_1.fireEvent.press(react_native_1.screen.getByTestId(dropdownMenuButtonTestID));
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('workspace.tags.disableTags'))).toBeOnTheScreen();
        });
        const disableMenuItem = react_native_1.screen.getByTestId('PopoverMenuItem-Disable tags');
        const mockEvent = { nativeEvent: {}, type: 'press', target: disableMenuItem, currentTarget: disableMenuItem };
        react_native_1.fireEvent.press(disableMenuItem, mockEvent);
        await (0, react_native_1.waitFor)(() => {
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('workspace.tags.cannotDeleteOrDisableAllTags.title'))).toBeOnTheScreen();
        });
        unmount();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
});
