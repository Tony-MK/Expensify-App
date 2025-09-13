"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const react_native_1 = require("@testing-library/react-native");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const CONST_1 = require("@src/CONST");
const Navigation_1 = require("@src/libs/Navigation/Navigation");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const TestNavigationContainer_1 = require("../utils/TestNavigationContainer");
jest.mock('@hooks/useResponsiveLayout', () => jest.fn());
jest.mock('@libs/getIsNarrowLayout', () => jest.fn());
jest.mock('@pages/home/sidebar/NavigationTabBarAvatar');
jest.mock('@src/components/Navigation/TopLevelNavigationTabBar');
const mockedGetIsNarrowLayout = getIsNarrowLayout_1.default;
const mockedUseResponsiveLayout = useResponsiveLayout_1.default;
(0, globals_1.describe)('Navigation', () => {
    beforeEach(() => {
        mockedGetIsNarrowLayout.mockReturnValue(true);
        mockedUseResponsiveLayout.mockReturnValue({ ...CONST_1.default.NAVIGATION_TESTS.DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE, shouldUseNarrowLayout: true });
    });
    // given current active route is "/settings/profile?backTo=settings%2profile"
    globals_1.test.each([
        ['settings/profile', true],
        ['settings/profile/', true],
        ['settings/profile?param=1', true],
        ['settings/profile/display-name', false],
        ['settings/profile/display-name/', false],
        ['settings/preferences', false],
        ['report', false],
        ['report/123/', false],
        ['report/123', false],
    ])('isActiveRoute("%s") should return %s', (routeToCheck, expectedResult) => {
        (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                index: 0,
                routes: [
                    {
                        name: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR,
                        state: {
                            index: 1,
                            routes: [
                                {
                                    name: SCREENS_1.default.SETTINGS.ROOT,
                                },
                                {
                                    name: SCREENS_1.default.SETTINGS.PROFILE.ROOT,
                                    params: {
                                        backTo: 'settings/profile',
                                    },
                                },
                            ],
                        },
                    },
                ],
            }}/>);
        const result = Navigation_1.default.isActiveRoute(routeToCheck);
        (0, globals_1.expect)(result).toBe(expectedResult);
    });
});
