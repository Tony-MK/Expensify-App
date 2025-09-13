"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useIsAuthenticated_1 = require("@hooks/useIsAuthenticated");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const navigateAfterInteraction_1 = require("@libs/Navigation/navigateAfterInteraction");
const Navigation_1 = require("@navigation/Navigation");
const TestTool_1 = require("@userActions/TestTool");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const Button_1 = require("./Button");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const RecordTroubleshootDataToolMenu_1 = require("./RecordTroubleshootDataToolMenu");
const SafeAreaConsumer_1 = require("./SafeAreaConsumer");
const ScrollView_1 = require("./ScrollView");
const TestToolMenu_1 = require("./TestToolMenu");
const TestToolRow_1 = require("./TestToolRow");
const Text_1 = require("./Text");
function getRouteBasedOnAuthStatus(isAuthenticated, activeRoute) {
    return isAuthenticated ? ROUTES_1.default.SETTINGS_CONSOLE.getRoute(activeRoute) : ROUTES_1.default.PUBLIC_CONSOLE_DEBUG.getRoute(activeRoute);
}
function TestToolsModalPage() {
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const [shouldStoreLogs = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_STORE_LOGS, { canBeMissing: true });
    const isAuthenticated = (0, useIsAuthenticated_1.default)();
    // If no backTo param is provided (direct access to /test-tools),
    // use home route as a default backTo param for console navigation
    const effectiveBackTo = backTo ?? ROUTES_1.default.HOME;
    const consoleRoute = getRouteBasedOnAuthStatus(isAuthenticated, effectiveBackTo);
    const maxHeight = windowHeight;
    return (<SafeAreaConsumer_1.default>
            {({ safeAreaPaddingBottomStyle }) => (<react_native_1.View style={[{ maxHeight }, styles.h100, styles.defaultModalContainer, safeAreaPaddingBottomStyle]}>
                    <ScrollView_1.default style={[styles.flex1, styles.ph5]} contentContainerStyle={styles.flexGrow1}>
                        <PressableWithoutFeedback_1.default accessible={false} style={[styles.cursorDefault]}>
                            <Text_1.default style={[styles.textLabelSupporting, styles.mt5, styles.mb3]} numberOfLines={1}>
                                {translate('initialSettingsPage.troubleshoot.releaseOptions')}
                            </Text_1.default>
                            <RecordTroubleshootDataToolMenu_1.default />
                            {!!shouldStoreLogs && (<TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.debugConsole')}>
                                    <Button_1.default small text={translate('initialSettingsPage.debugConsole.viewConsole')} onPress={() => {
                    // Close the test tools modal first, then navigate to console page
                    (0, TestTool_1.default)();
                    (0, navigateAfterInteraction_1.default)(() => {
                        Navigation_1.default.navigate(consoleRoute);
                    });
                }}/>
                                </TestToolRow_1.default>)}
                            <TestToolMenu_1.default />
                        </PressableWithoutFeedback_1.default>
                    </ScrollView_1.default>
                </react_native_1.View>)}
        </SafeAreaConsumer_1.default>);
}
TestToolsModalPage.displayName = 'TestToolsModalPage';
exports.default = TestToolsModalPage;
