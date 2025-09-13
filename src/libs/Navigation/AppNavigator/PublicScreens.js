"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const ConnectionCompletePage_1 = require("@pages/ConnectionCompletePage");
const LogInWithShortLivedAuthTokenPage_1 = require("@pages/LogInWithShortLivedAuthTokenPage");
const AppleSignInDesktopPage_1 = require("@pages/signin/AppleSignInDesktopPage");
const GoogleSignInDesktopPage_1 = require("@pages/signin/GoogleSignInDesktopPage");
const SAMLSignInPage_1 = require("@pages/signin/SAMLSignInPage");
const SignInPage_1 = require("@pages/signin/SignInPage");
const UnlinkLoginPage_1 = require("@pages/UnlinkLoginPage");
const ValidateLoginPage_1 = require("@pages/ValidateLoginPage");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const defaultScreenOptions_1 = require("./defaultScreenOptions");
const PublicRightModalNavigator_1 = require("./Navigators/PublicRightModalNavigator");
const TestToolsModalNavigator_1 = require("./Navigators/TestToolsModalNavigator");
const useRootNavigatorScreenOptions_1 = require("./useRootNavigatorScreenOptions");
const RootStack = (0, createPlatformStackNavigator_1.default)();
function PublicScreens() {
    const rootNavigatorScreenOptions = (0, useRootNavigatorScreenOptions_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<RootStack.Navigator screenOptions={defaultScreenOptions_1.default}>
            {/* The structure for the HOME route has to be the same in public and auth screens. That's why the name for SignInPage is REPORTS_SPLIT_NAVIGATOR. */}
            <RootStack.Screen name={NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR} options={{
            ...defaultScreenOptions_1.default,
            // If you want to change this, make sure there aren't any animation bugs when signing out.
            // This was put here to prevent excessive animations when resetting the navigation state in `resetNavigationState`
            animation: animation_1.default.NONE,
        }} component={SignInPage_1.default}/>
            <RootStack.Screen name={SCREENS_1.default.TRANSITION_BETWEEN_APPS} component={LogInWithShortLivedAuthTokenPage_1.default}/>
            <RootStack.Screen name={SCREENS_1.default.VALIDATE_LOGIN} options={defaultScreenOptions_1.default} component={ValidateLoginPage_1.default}/>
            <RootStack.Screen name={SCREENS_1.default.CONNECTION_COMPLETE} component={ConnectionCompletePage_1.default}/>
            <RootStack.Screen name={SCREENS_1.default.BANK_CONNECTION_COMPLETE} component={ConnectionCompletePage_1.default}/>
            <RootStack.Screen name={SCREENS_1.default.UNLINK_LOGIN} component={UnlinkLoginPage_1.default}/>
            <RootStack.Screen name={SCREENS_1.default.SIGN_IN_WITH_APPLE_DESKTOP} component={AppleSignInDesktopPage_1.default}/>
            <RootStack.Screen name={SCREENS_1.default.SIGN_IN_WITH_GOOGLE_DESKTOP} component={GoogleSignInDesktopPage_1.default}/>
            <RootStack.Screen name={SCREENS_1.default.SAML_SIGN_IN} component={SAMLSignInPage_1.default}/>
            <RootStack.Screen name={NAVIGATORS_1.default.PUBLIC_RIGHT_MODAL_NAVIGATOR} component={PublicRightModalNavigator_1.default} options={rootNavigatorScreenOptions.rightModalNavigator}/>
            <RootStack.Screen name={NAVIGATORS_1.default.TEST_TOOLS_MODAL_NAVIGATOR} options={{
            ...rootNavigatorScreenOptions.basicModalNavigator,
            native: {
                contentStyle: {
                    ...StyleUtils.getBackgroundColorWithOpacityStyle(theme.overlay, 0.72),
                },
                animation: animation_1.InternalPlatformAnimations.FADE,
            },
            web: {
                cardStyle: {
                    ...StyleUtils.getBackgroundColorWithOpacityStyle(theme.overlay, 0.72),
                },
                animation: animation_1.InternalPlatformAnimations.FADE,
            },
        }} component={TestToolsModalNavigator_1.default}/>
        </RootStack.Navigator>);
}
PublicScreens.displayName = 'PublicScreens';
exports.default = PublicScreens;
