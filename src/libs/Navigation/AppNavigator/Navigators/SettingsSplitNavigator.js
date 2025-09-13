"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CENTRAL_PANE_SETTINGS_SCREENS = void 0;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FocusTrapForScreen_1 = require("@components/FocusTrap/FocusTrapForScreen");
const createSplitNavigator_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator");
const usePreloadFullScreenNavigators_1 = require("@libs/Navigation/AppNavigator/usePreloadFullScreenNavigators");
const useSplitNavigatorScreenOptions_1 = require("@libs/Navigation/AppNavigator/useSplitNavigatorScreenOptions");
const SCREENS_1 = require("@src/SCREENS");
const loadInitialSettingsPage = () => require('../../../../pages/settings/InitialSettingsPage').default;
const CENTRAL_PANE_SETTINGS_SCREENS = {
    [SCREENS_1.default.SETTINGS.PREFERENCES.ROOT]: () => require('../../../../pages/settings/Preferences/PreferencesPage').default,
    [SCREENS_1.default.SETTINGS.SECURITY]: () => require('../../../../pages/settings/Security/SecuritySettingsPage').default,
    [SCREENS_1.default.SETTINGS.PROFILE.ROOT]: () => require('../../../../pages/settings/Profile/ProfilePage').default,
    [SCREENS_1.default.SETTINGS.WALLET.ROOT]: () => require('../../../../pages/settings/Wallet/WalletPage').default,
    [SCREENS_1.default.SETTINGS.ABOUT]: () => require('../../../../pages/settings/AboutPage/AboutPage').default,
    [SCREENS_1.default.SETTINGS.TROUBLESHOOT]: () => require('../../../../pages/settings/Troubleshoot/TroubleshootPage').default,
    [SCREENS_1.default.SETTINGS.SAVE_THE_WORLD]: () => require('../../../../pages/TeachersUnite/SaveTheWorldPage').default,
    [SCREENS_1.default.SETTINGS.SUBSCRIPTION.ROOT]: () => require('../../../../pages/settings/Subscription/SubscriptionSettingsPage').default,
};
exports.CENTRAL_PANE_SETTINGS_SCREENS = CENTRAL_PANE_SETTINGS_SCREENS;
const Split = (0, createSplitNavigator_1.default)();
function SettingsSplitNavigator() {
    const route = (0, native_1.useRoute)();
    const splitNavigatorScreenOptions = (0, useSplitNavigatorScreenOptions_1.default)();
    // This hook preloads the screens of adjacent tabs to make changing tabs faster.
    (0, usePreloadFullScreenNavigators_1.default)();
    return (<FocusTrapForScreen_1.default>
            <react_native_1.View style={{ flex: 1 }}>
                <Split.Navigator persistentScreens={[SCREENS_1.default.SETTINGS.ROOT]} sidebarScreen={SCREENS_1.default.SETTINGS.ROOT} defaultCentralScreen={SCREENS_1.default.SETTINGS.PROFILE.ROOT} parentRoute={route} screenOptions={splitNavigatorScreenOptions.centralScreen}>
                    <Split.Screen name={SCREENS_1.default.SETTINGS.ROOT} getComponent={loadInitialSettingsPage} options={splitNavigatorScreenOptions.sidebarScreen}/>
                    {Object.entries(CENTRAL_PANE_SETTINGS_SCREENS).map(([screenName, componentGetter]) => {
            return (<Split.Screen key={screenName} name={screenName} getComponent={componentGetter}/>);
        })}
                </Split.Navigator>
            </react_native_1.View>
        </FocusTrapForScreen_1.default>);
}
SettingsSplitNavigator.displayName = 'SettingsSplitNavigator';
exports.default = SettingsSplitNavigator;
