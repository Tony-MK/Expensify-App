"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const createSplitNavigator_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator");
const useNavigationResetOnLayoutChange_1 = require("@libs/Navigation/AppNavigator/useNavigationResetOnLayoutChange");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const InitialSettingsPage_1 = require("@pages/settings/InitialSettingsPage");
const ProfilePage_1 = require("@pages/settings/Profile/ProfilePage");
const CONST_1 = require("@src/CONST");
const SCREENS_1 = require("@src/SCREENS");
const Split = (0, createSplitNavigator_1.default)();
jest.mock('@hooks/useResponsiveLayout', () => jest.fn());
jest.mock('@libs/getIsNarrowLayout', () => jest.fn());
jest.mock('@pages/settings/InitialSettingsPage');
jest.mock('@pages/settings/Profile/ProfilePage');
const INITIAL_STATE = {
    index: 0,
    routes: [
        {
            name: SCREENS_1.default.SETTINGS.ROOT,
        },
    ],
};
const mockedGetIsNarrowLayout = getIsNarrowLayout_1.default;
const mockedUseResponsiveLayout = useResponsiveLayout_1.default;
describe('Resize screen', () => {
    it('Should display the settings profile after resizing the screen with the settings page opened to the wide layout', () => {
        // Given the initialized navigation on the narrow layout with the settings screen
        mockedGetIsNarrowLayout.mockReturnValue(true);
        mockedUseResponsiveLayout.mockReturnValue({ ...CONST_1.default.NAVIGATION_TESTS.DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE, shouldUseNarrowLayout: true });
        (0, react_native_1.render)(<native_1.NavigationContainer ref={navigationRef_1.default} initialState={INITIAL_STATE}>
                <Split.Navigator sidebarScreen={SCREENS_1.default.SETTINGS.ROOT} defaultCentralScreen={SCREENS_1.default.SETTINGS.PROFILE.ROOT} parentRoute={CONST_1.default.NAVIGATION_TESTS.DEFAULT_PARENT_ROUTE}>
                    <Split.Screen name={SCREENS_1.default.SETTINGS.ROOT} component={InitialSettingsPage_1.default}/>
                    <Split.Screen name={SCREENS_1.default.SETTINGS.PROFILE.ROOT} component={ProfilePage_1.default}/>
                </Split.Navigator>
            </native_1.NavigationContainer>);
        const { rerender } = (0, react_native_1.renderHook)(() => (0, useNavigationResetOnLayoutChange_1.default)({
            navigation: navigationRef_1.default.current,
            displayName: 'SplitNavigator',
            descriptors: {},
            state: navigationRef_1.default.current?.getState(),
        }));
        const rootStateBeforeResize = navigationRef_1.default.current?.getRootState();
        expect(rootStateBeforeResize?.routes.at(0)?.name).toBe(SCREENS_1.default.SETTINGS.ROOT);
        expect(rootStateBeforeResize?.routes.at(1)).toBeUndefined();
        expect(rootStateBeforeResize?.index).toBe(0);
        // When resizing the screen to the wide layout
        mockedGetIsNarrowLayout.mockReturnValue(false);
        mockedUseResponsiveLayout.mockReturnValue({ ...CONST_1.default.NAVIGATION_TESTS.DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE, shouldUseNarrowLayout: false });
        rerender({});
        const rootStateAfterResize = navigationRef_1.default.current?.getRootState();
        // Then the settings profile page should be displayed on the screen
        expect(rootStateAfterResize?.routes.at(0)?.name).toBe(SCREENS_1.default.SETTINGS.ROOT);
        expect(rootStateAfterResize?.routes.at(1)?.name).toBe(SCREENS_1.default.SETTINGS.PROFILE.ROOT);
        expect(rootStateAfterResize?.index).toBe(1);
    });
});
