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
describe('Navigate', () => {
    beforeEach(() => {
        mockedGetIsNarrowLayout.mockReturnValue(true);
        mockedUseResponsiveLayout.mockReturnValue({ ...CONST_1.default.NAVIGATION_TESTS.DEFAULT_USE_RESPONSIVE_LAYOUT_VALUE, shouldUseNarrowLayout: true });
    });
    describe('on the narrow layout', () => {
        it('to the page within the same navigator', () => {
            // Given the initialized navigation on the narrow layout with the settings split navigator
            (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                    index: 0,
                    routes: [
                        {
                            name: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR,
                            state: {
                                index: 0,
                                routes: [
                                    {
                                        name: SCREENS_1.default.SETTINGS.ROOT,
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const settingsSplitBeforeGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(settingsSplitBeforeGoBack?.state?.index).toBe(0);
            expect(settingsSplitBeforeGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.ROOT);
            // When navigate to the page from the same split navigator
            (0, react_native_1.act)(() => {
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_PROFILE.getRoute());
            });
            // Then push a new page to the current split navigator
            const settingsSplitAfterGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(settingsSplitAfterGoBack?.state?.index).toBe(1);
            expect(settingsSplitAfterGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.PROFILE.ROOT);
        });
        it('to the page within the same navigator using replace action', () => {
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
            // When navigate to the page from the same split navigator using replace action
            (0, react_native_1.act)(() => {
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ABOUT, { forceReplace: true });
            });
            // Then replace the current page with the page passed to the navigate function
            const settingsSplitAfterGoBack = navigationRef_1.default.current?.getRootState().routes.at(0);
            expect(settingsSplitAfterGoBack?.state?.index).toBe(1);
            expect(settingsSplitAfterGoBack?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.ABOUT);
        });
        it('to the page from the different split navigator', () => {
            // Given the initialized navigation on the narrow layout with the settings split navigator
            (0, react_native_1.render)(<TestNavigationContainer_1.default initialState={{
                    index: 0,
                    routes: [
                        {
                            name: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR,
                            state: {
                                index: 0,
                                routes: [
                                    {
                                        name: SCREENS_1.default.SETTINGS.ROOT,
                                    },
                                ],
                            },
                        },
                    ],
                }}/>);
            const rootStateBeforeNavigate = navigationRef_1.default.current?.getRootState();
            const lastSplitBeforeNavigate = rootStateBeforeNavigate?.routes.at(-1);
            expect(rootStateBeforeNavigate?.index).toBe(0);
            expect(lastSplitBeforeNavigate?.name).toBe(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR);
            expect(lastSplitBeforeNavigate?.state?.routes.at(-1)?.name).toBe(SCREENS_1.default.SETTINGS.ROOT);
            // When navigate to the page from the different split navigator
            (0, react_native_1.act)(() => {
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute('1'));
            });
            // Then push a new split navigator to the navigation state
            const rootStateAfterNavigate = navigationRef_1.default.current?.getRootState();
            const lastSplitAfterNavigate = rootStateAfterNavigate?.routes.at(-1);
            expect(rootStateAfterNavigate?.index).toBe(1);
            expect(lastSplitAfterNavigate?.name).toBe(NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR);
        });
    });
});
