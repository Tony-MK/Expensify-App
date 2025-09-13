"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const DebugTabView_1 = require("@components/Navigation/DebugTabView");
const NavigationTabBar_1 = require("@components/Navigation/NavigationTabBar");
const NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useSidebarOrderedReports_1 = require("@hooks/useSidebarOrderedReports");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
jest.mock('@src/hooks/useRootNavigationState');
describe('NavigationTabBar', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        (0, OnyxDerived_1.default)();
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, CONST_1.default.LOCALES.EN);
    });
    beforeEach(() => {
        react_native_onyx_1.default.clear([ONYXKEYS_1.default.NVP_PREFERRED_LOCALE]);
    });
    describe('Home tab', () => {
        describe('Debug mode enabled', () => {
            beforeEach(() => {
                react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, true);
            });
            describe('Has GBR', () => {
                it('renders DebugTabView', async () => {
                    await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}1`, {
                        reportID: '1',
                        reportName: 'My first report',
                        chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
                        type: CONST_1.default.REPORT.TYPE.CHAT,
                        hasOutstandingChildTask: true,
                        lastMessageText: 'Hello world!',
                    });
                    (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider]}>
                            <native_1.NavigationContainer>
                                <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.HOME}/>
                            </native_1.NavigationContainer>
                        </ComposeProviders_1.default>);
                    expect(await react_native_1.screen.findByTestId(DebugTabView_1.default.displayName)).toBeOnTheScreen();
                });
            });
            describe('Has RBR', () => {
                it('renders DebugTabView', async () => {
                    await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}1`, {
                        reportID: '1',
                        reportName: 'My first report',
                        chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
                        type: CONST_1.default.REPORT.TYPE.CHAT,
                        errorFields: {
                            error: {
                                message: 'Some error occurred!',
                            },
                        },
                        lastMessageText: 'Hello world!',
                    });
                    (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider]}>
                            <native_1.NavigationContainer>
                                <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.HOME}/>
                            </native_1.NavigationContainer>
                        </ComposeProviders_1.default>);
                    expect(await react_native_1.screen.findByTestId(DebugTabView_1.default.displayName)).toBeOnTheScreen();
                });
            });
        });
    });
    describe('Settings tab', () => {
        describe('Debug mode enabled', () => {
            beforeEach(() => {
                react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, true);
            });
            describe('Has GBR', () => {
                it('renders DebugTabView', async () => {
                    await react_native_onyx_1.default.multiSet({
                        [ONYXKEYS_1.default.SESSION]: {
                            email: 'foo@bar.com',
                        },
                        [ONYXKEYS_1.default.LOGIN_LIST]: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'foo@bar.com': {
                                partnerUserID: 'john.doe@mail.com',
                                validatedDate: undefined,
                            },
                        },
                    });
                    (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider]}>
                            <native_1.NavigationContainer>
                                <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.SETTINGS}/>
                            </native_1.NavigationContainer>
                        </ComposeProviders_1.default>);
                    expect(await react_native_1.screen.findByTestId(DebugTabView_1.default.displayName)).toBeOnTheScreen();
                });
            });
            describe('Has RBR', () => {
                it('renders DebugTabView', async () => {
                    await react_native_onyx_1.default.set(ONYXKEYS_1.default.LOGIN_LIST, {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'foo@bar.com': {
                            partnerUserID: 'john.doe@mail.com',
                            errorFields: {
                                partnerName: {
                                    message: 'Partner name is missing!',
                                },
                            },
                        },
                    });
                    (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider]}>
                            <native_1.NavigationContainer>
                                <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.SETTINGS}/>
                            </native_1.NavigationContainer>
                        </ComposeProviders_1.default>);
                    expect(await react_native_1.screen.findByTestId(DebugTabView_1.default.displayName)).toBeOnTheScreen();
                });
            });
        });
    });
});
