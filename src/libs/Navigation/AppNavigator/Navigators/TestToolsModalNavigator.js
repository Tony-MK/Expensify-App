"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const NoDropZone_1 = require("@components/DragAndDrop/NoDropZone");
const FocusTrapForScreen_1 = require("@components/FocusTrap/FocusTrapForScreen");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const TestToolsModalPage_1 = require("@components/TestToolsModalPage");
const useIsAuthenticated_1 = require("@hooks/useIsAuthenticated");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const TestTool_1 = require("@userActions/TestTool");
const CONST_1 = require("@src/CONST");
const SCREENS_1 = require("@src/SCREENS");
const Overlay_1 = require("./Overlay");
const Stack = (0, createPlatformStackNavigator_1.default)();
function TestToolsModalNavigator() {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const outerViewRef = (0, react_1.useRef)(null);
    const isAuthenticated = (0, useIsAuthenticated_1.default)();
    const handleOuterClick = (0, react_1.useCallback)(() => {
        // Release focus from any focused element before closing the modal
        (0, blurActiveElement_1.default)();
        requestAnimationFrame(() => {
            (0, TestTool_1.default)();
        });
    }, []);
    const handleInnerClick = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
    }, []);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ESCAPE, () => (0, TestTool_1.default)(), { shouldBubble: false });
    return (<NoDropZone_1.default>
            <Overlay_1.default />
            <PressableWithoutFeedback_1.default ref={outerViewRef} onPress={handleOuterClick} style={[styles.getTestToolsNavigatorOuterView(shouldUseNarrowLayout)]} accessible={false}>
                <FocusTrapForScreen_1.default>
                    <react_native_1.View onStartShouldSetResponder={() => true} onClick={handleInnerClick} style={styles.getTestToolsNavigatorInnerView(shouldUseNarrowLayout, isAuthenticated)}>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            <Stack.Screen name={SCREENS_1.default.TEST_TOOLS_MODAL.ROOT} component={TestToolsModalPage_1.default}/>
                        </Stack.Navigator>
                    </react_native_1.View>
                </FocusTrapForScreen_1.default>
            </PressableWithoutFeedback_1.default>
        </NoDropZone_1.default>);
}
TestToolsModalNavigator.displayName = 'TestToolsModalNavigator';
exports.default = TestToolsModalNavigator;
