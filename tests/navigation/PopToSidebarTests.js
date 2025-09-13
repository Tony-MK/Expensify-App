"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const Navigation_1 = require("@libs/Navigation/Navigation");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const TestNavigationContainer_1 = require("../utils/TestNavigationContainer");
jest.mock('@hooks/useResponsiveLayout', () => jest.fn());
jest.mock('@libs/getIsNarrowLayout', () => jest.fn());
jest.mock('@pages/home/sidebar/NavigationTabBarAvatar');
jest.mock('@src/components/Navigation/TopLevelNavigationTabBar');
const mockedGetIsNarrowLayout = getIsNarrowLayout_1.default;
const mockedUseResponsiveLayout = useResponsiveLayout_1.default;
describe('Pop to sidebar after resize from wide to narrow layout', () => {
    beforeEach(() => {
        mockedGetIsNarrowLayout.mockReturnValue(true);
        mockedUseResponsiveLayout.mockReturnValue({ ...CONST_1.default.NAVIGATION_TESTS.DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE, shouldUseNarrowLayout: true });
    });
    describe('After opening several screens in the settings tab', () => {
        it('Should pop all visited screens and go back to the settings sidebar screen', () => {
            (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                    index: 0,
                    routes: [
                        {
                            name: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR,
                            state: {
                                index: 3,
                                routes: [
                                    {
                                        name: SCREENS_1.default.SETTINGS.ROOT,
                                    },
                                    {
                                        name: SCREENS_1.default.SETTINGS.ABOUT,
                                    },
                                    {
                                        name: SCREENS_1.default.SETTINGS.PREFERENCES.ROOT,
                                    },
                                    {
                                        name: SCREENS_1.default.SETTINGS.PROFILE.ROOT,
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const settingsSplitBeforePopToSidebar = navigationRef_1.default.current?.getRootState().routes.at(-1);
            expect(settingsSplitBeforePopToSidebar?.state?.index).toBe(3);
            // When we pop with LHN on top of stack
            (0, react_native_1.act)(() => {
                Navigation_1.default.popToSidebar();
            });
            // Then all screens should be popped of the stack and only settings root left
            const settingsSplitAfterPopToSidebar = navigationRef_1.default.current?.getRootState().routes.at(-1);
            expect(settingsSplitAfterPopToSidebar?.state?.index).toBe(0);
            expect(settingsSplitAfterPopToSidebar?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.ROOT);
        });
    });
    describe('After navigating to the central screen in the settings tab from the chat', () => {
        it('Should replace the route with LHN', () => {
            (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                    index: 0,
                    routes: [
                        {
                            name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR,
                            state: {
                                index: 2,
                                routes: [
                                    {
                                        name: SCREENS_1.default.HOME,
                                    },
                                    {
                                        name: SCREENS_1.default.REPORT,
                                        params: { reportID: '1' },
                                    },
                                    {
                                        name: SCREENS_1.default.REPORT,
                                        params: { reportID: '2' },
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const lastSplitBeforeNavigate = navigationRef_1.default.current?.getRootState().routes.at(-1);
            expect(lastSplitBeforeNavigate?.name).toBe(NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR);
            (0, react_native_1.act)(() => {
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ABOUT);
            });
            const lastSplitAfterNavigate = navigationRef_1.default.current?.getRootState().routes.at(-1);
            expect(lastSplitAfterNavigate?.name).toBe(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR);
            expect(lastSplitAfterNavigate?.state?.index).toBe(0);
            expect(lastSplitAfterNavigate?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.ABOUT);
            // When we pop to sidebar without LHN on top of stack
            (0, react_native_1.act)(() => {
                Navigation_1.default.popToSidebar();
            });
            // Then the top screen should be replaced with LHN
            const lastSplitAfterPopToSidebar = navigationRef_1.default.current?.getRootState().routes.at(-1);
            expect(lastSplitAfterPopToSidebar?.state?.index).toBe(0);
            expect(lastSplitAfterPopToSidebar?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.ROOT);
        });
    });
});
