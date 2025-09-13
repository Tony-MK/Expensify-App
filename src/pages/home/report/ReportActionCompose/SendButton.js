"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function SendButton({ isDisabled: isDisabledProp, handleSendMessage }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to manage GestureDetector correctly
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const Tap = react_native_gesture_handler_1.Gesture.Tap().onEnd(() => {
        handleSendMessage();
    });
    return (<react_native_1.View style={styles.justifyContentEnd} 
    // Keep focus on the composer when Send message is clicked.
    onMouseDown={(e) => e.preventDefault()}>
            <react_native_gesture_handler_1.GestureDetector 
    // A new GestureDetector instance must be created when switching from a large screen to a small screen
    // if not, the GestureDetector may not function correctly.
    key={`send-button-${isSmallScreenWidth ? 'small-screen' : 'normal-screen'}`} gesture={Tap}>
                <react_native_1.View collapsable={false}>
                    <Tooltip_1.default text={translate('common.send')}>
                        <PressableWithFeedback_1.default style={({ pressed, isDisabled }) => [
            styles.chatItemSubmitButton,
            isDisabledProp || pressed || isDisabled ? undefined : styles.buttonSuccess,
            isDisabledProp ? styles.cursorDisabled : undefined,
        ]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.send')}>
                            {({ pressed }) => (<Icon_1.default src={Expensicons.Send} fill={isDisabledProp || pressed ? theme.icon : theme.textLight}/>)}
                        </PressableWithFeedback_1.default>
                    </Tooltip_1.default>
                </react_native_1.View>
            </react_native_gesture_handler_1.GestureDetector>
        </react_native_1.View>);
}
SendButton.displayName = 'SendButton';
exports.default = (0, react_1.memo)(SendButton);
