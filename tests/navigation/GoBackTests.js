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
const mockedPolicyID = 'test-policy';
const mockedBackToRoute = '/test';
describe('Go back on the narrow layout', () => {
    beforeEach(() => {
        mockedGetIsNarrowLayout.mockReturnValue(true);
        mockedUseResponsiveLayout.mockReturnValue({ ...CONST_1.default.NAVIGATION_TESTS.DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE, shouldUseNarrowLayout: true });
    });
    describe('called without params', () => {
        it('Should pop the last page in the navigation state', () => {
            // Given the initialized navigation on the narrow layout with the settings split navigator
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
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const settingsSplitBeforeGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(settingsSplitBeforeGoBack?.state?.index).toBe(1);
            expect(settingsSplitBeforeGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.PROFILE.ROOT);
            // When go back without specifying fallbackRoute
            (0, react_native_1.act)(() => {
                Navigation_1.default.goBack();
            });
            // Then pop the last screen from the navigation state
            const settingsSplitAfterGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(settingsSplitAfterGoBack?.state?.index).toBe(0);
            expect(settingsSplitAfterGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.ROOT);
        });
    });
    describe('called with fallbackRoute param', () => {
        it('Should go back to the page passed to goBack as a fallbackRoute', () => {
            // Given the initialized navigation on the narrow layout with the settings split navigator
            (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                    index: 0,
                    routes: [
                        {
                            name: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR,
                            state: {
                                index: 2,
                                routes: [
                                    {
                                        name: SCREENS_1.default.SETTINGS.ROOT,
                                    },
                                    {
                                        name: SCREENS_1.default.SETTINGS.PROFILE.ROOT,
                                    },
                                    {
                                        name: SCREENS_1.default.SETTINGS.PREFERENCES.ROOT,
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const settingsSplitBeforeGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(settingsSplitBeforeGoBack?.state?.index).toBe(2);
            expect(settingsSplitBeforeGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.PREFERENCES.ROOT);
            // When go back to the fallbackRoute present in the navigation state
            (0, react_native_1.act)(() => {
                Navigation_1.default.goBack(ROUTES_1.default.SETTINGS);
            });
            // Then pop to the fallbackRoute
            const settingsSplitAfterGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(settingsSplitAfterGoBack?.state?.index).toBe(0);
            expect(settingsSplitAfterGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.ROOT);
        });
        it('Should replace the current page with the page passed as a fallbackRoute', () => {
            // Given the initialized navigation on the narrow layout with the settings split navigator
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
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const settingsSplitBeforeGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(settingsSplitBeforeGoBack?.state?.index).toBe(1);
            expect(settingsSplitBeforeGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.PROFILE.ROOT);
            // When go back to the fallbackRoute that does not exist in the navigation state
            (0, react_native_1.act)(() => {
                Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_ABOUT);
            });
            // Then replace the current page with the page passed as a fallbackRoute
            const settingsSplitAfterGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(settingsSplitAfterGoBack?.state?.index).toBe(1);
            expect(settingsSplitAfterGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.ABOUT);
        });
        it('Should go back to the page from the previous split navigator', () => {
            // Given the initialized navigation on the narrow layout with reports and settings pages
            (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                    index: 1,
                    routes: [
                        {
                            name: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR,
                            state: {
                                index: 2,
                                routes: [
                                    {
                                        name: SCREENS_1.default.SETTINGS.ROOT,
                                    },
                                    {
                                        name: SCREENS_1.default.SETTINGS.PROFILE.ROOT,
                                    },
                                    {
                                        name: SCREENS_1.default.SETTINGS.PREFERENCES.ROOT,
                                    },
                                ],
                            },
                        },
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
            const rootStateBeforeGoBack = navigationRef_1.default.current?.getRootState();
            expect(rootStateBeforeGoBack?.index).toBe(1);
            expect(rootStateBeforeGoBack?.routes.at(-1)?.name).toBe(NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR);
            // When go back to the page present in the previous split navigator
            (0, react_native_1.act)(() => {
                Navigation_1.default.goBack(ROUTES_1.default.SETTINGS);
            });
            // Then pop the current split navigator
            const rootStateAfterGoBack = navigationRef_1.default.current?.getRootState();
            expect(rootStateAfterGoBack?.index).toBe(0);
            expect(rootStateAfterGoBack?.routes.at(-1)?.name).toBe(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR);
        });
        it('Should replace the current route with a new split navigator when distance from the fallbackRoute is greater than one split navigator', () => {
            // Given the initialized navigation on the narrow layout
            (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                    index: 2,
                    routes: [
                        {
                            name: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR,
                            state: {
                                index: 2,
                                routes: [
                                    {
                                        name: SCREENS_1.default.SETTINGS.ROOT,
                                    },
                                    {
                                        name: SCREENS_1.default.SETTINGS.PROFILE.ROOT,
                                    },
                                    {
                                        name: SCREENS_1.default.SETTINGS.PREFERENCES.ROOT,
                                    },
                                ],
                            },
                        },
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
                        {
                            name: NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR,
                            state: {
                                index: 0,
                                routes: [
                                    {
                                        name: SCREENS_1.default.SEARCH.ROOT,
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const rootStateBeforeGoBack = navigationRef_1.default.current?.getRootState();
            expect(rootStateBeforeGoBack?.index).toBe(2);
            expect(rootStateBeforeGoBack?.routes.at(-1)?.name).toBe(NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR);
            // When go back to the page present in the split navigator that is more than 1 route away
            (0, react_native_1.act)(() => {
                Navigation_1.default.goBack(ROUTES_1.default.SETTINGS);
            });
            // Then replace the current route with a new split navigator including the target page to avoid losing routes from the navigation state
            const rootStateAfterGoBack = navigationRef_1.default.current?.getRootState();
            expect(rootStateAfterGoBack?.index).toBe(2);
            expect(rootStateAfterGoBack?.routes.at(-1)?.name).toBe(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR);
        });
    });
    describe('called with fallbackRoute param with route params comparison', () => {
        it('Should go back to the page with matching route params', () => {
            // Given the initialized navigation on the narrow layout with the reports split navigator
            (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                    index: 0,
                    routes: [
                        {
                            name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR,
                            state: {
                                index: 3,
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
                                    {
                                        name: SCREENS_1.default.REPORT,
                                        params: { reportID: '3' },
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const reportsSplitBeforeGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(reportsSplitBeforeGoBack?.state?.index).toBe(3);
            expect(reportsSplitBeforeGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.REPORT);
            expect(reportsSplitBeforeGoBack?.state?.routes.at(-1)?.params).toMatchObject({ reportID: '3' });
            // When go back to the same page with a different route param
            (0, react_native_1.act)(() => {
                Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID.getRoute('1'));
            });
            // Then pop to the page with matching params
            const reportsSplitAfterGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(reportsSplitAfterGoBack?.state?.index).toBe(1);
            expect(reportsSplitAfterGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.REPORT);
            expect(reportsSplitAfterGoBack?.state?.routes.at(-1)?.params).toMatchObject({ reportID: '1' });
        });
        it('Should replace the current page with the same one with different params', () => {
            // Given the initialized navigation on the narrow layout with the reports split navigator
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
            const reportsSplitBeforeGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(reportsSplitBeforeGoBack?.state?.index).toBe(2);
            expect(reportsSplitBeforeGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.REPORT);
            expect(reportsSplitBeforeGoBack?.state?.routes.at(-1)?.params).toMatchObject({ reportID: '2' });
            // When go back to the same page with different route params that does not exist in the navigation state
            (0, react_native_1.act)(() => {
                Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID.getRoute('3'));
            });
            // Then replace the current page with the same one with different params
            const reportsSplitAfterGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(reportsSplitAfterGoBack?.state?.index).toBe(2);
            expect(reportsSplitAfterGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.REPORT);
            expect(reportsSplitAfterGoBack?.state?.routes.at(-1)?.params).toMatchObject({ reportID: '3' });
        });
        it('Should go back without comparing params', () => {
            // Given the initialized navigation on the narrow layout with reports split navigator
            (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                    index: 0,
                    routes: [
                        {
                            name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR,
                            state: {
                                index: 3,
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
                                    {
                                        name: SCREENS_1.default.REPORT,
                                        params: { reportID: '3' },
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const reportsSplitBeforeGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(reportsSplitBeforeGoBack?.state?.index).toBe(3);
            expect(reportsSplitBeforeGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.REPORT);
            expect(reportsSplitBeforeGoBack?.state?.routes.at(-1)?.params).toMatchObject({ reportID: '3' });
            // When go back to the same page with different route params without comparing params
            (0, react_native_1.act)(() => {
                Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID.getRoute('1'), { compareParams: false });
            });
            // Then do not go back to the page with matching route params, instead replace the current page
            const reportsSplitAfterGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(reportsSplitAfterGoBack?.state?.index).toBe(3);
            expect(reportsSplitAfterGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.REPORT);
            expect(reportsSplitAfterGoBack?.state?.routes.at(-1)?.params).toMatchObject({ reportID: '1' });
        });
    });
});
describe('Go back on the wide layout', () => {
    beforeEach(() => {
        mockedGetIsNarrowLayout.mockReturnValue(false);
        mockedUseResponsiveLayout.mockReturnValue({
            ...CONST_1.default.NAVIGATION_TESTS.DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE,
            shouldUseNarrowLayout: false,
            isSmallScreenWidth: false,
            isLargeScreenWidth: true,
        });
    });
    it('should preserved backTo params between central screen and side bar screen', () => {
        // Given the initialized navigation with workspaces split navigator
        (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                index: 0,
                routes: [
                    {
                        name: NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR,
                        state: {
                            index: 0,
                            routes: [
                                {
                                    name: SCREENS_1.default.WORKSPACE.PER_DIEM,
                                    params: { policyID: mockedPolicyID, backTo: mockedBackToRoute },
                                },
                            ],
                        },
                    },
                ],
            }}/>);
        // Then the backTo params should be preserved in the sidebar route
        const initialRootState = navigationRef_1.default.current?.getRootState();
        const initialWorkspaceNavigator = initialRootState?.routes.at(0);
        const initialRoutes = initialWorkspaceNavigator?.state?.routes ?? [];
        const initialSidebarRoute = initialRoutes.find((route) => route.name === SCREENS_1.default.WORKSPACE.INITIAL);
        expect(initialSidebarRoute?.params).toMatchObject({
            policyID: mockedPolicyID,
            backTo: mockedBackToRoute,
        });
    });
});
