"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Pressables = require("@components/Pressable");
const Text_1 = require("@components/Text");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Growl = require("@libs/Growl");
const CONST_1 = require("@src/CONST");
const GrowlNotificationContainer_1 = require("./GrowlNotificationContainer");
const INACTIVE_POSITION_Y = -255;
const PressableWithoutFeedback = Pressables.PressableWithoutFeedback;
function GrowlNotification(_, ref) {
    const translateY = (0, react_native_reanimated_1.useSharedValue)(INACTIVE_POSITION_Y);
    const [bodyText, setBodyText] = (0, react_1.useState)('');
    const [type, setType] = (0, react_1.useState)('success');
    const [duration, setDuration] = (0, react_1.useState)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const types = {
        [CONST_1.default.GROWL.SUCCESS]: {
            icon: Expensicons.Checkmark,
            iconColor: theme.success,
        },
        [CONST_1.default.GROWL.ERROR]: {
            icon: Expensicons.Exclamation,
            iconColor: theme.danger,
        },
        [CONST_1.default.GROWL.WARNING]: {
            icon: Expensicons.Exclamation,
            iconColor: theme.warning,
        },
    };
    /**
     * Show the growl notification
     *
     * @param {String} bodyText
     * @param {String} type
     * @param {Number} duration
     */
    const show = (0, react_1.useCallback)((text, growlType, growlDuration) => {
        setBodyText(text);
        setType(growlType);
        setDuration(growlDuration);
    }, []);
    /**
     * Animate growl notification
     *
     * @param {Number} val
     */
    const fling = (0, react_1.useCallback)((val = INACTIVE_POSITION_Y) => {
        'worklet';
        translateY.set((0, react_native_reanimated_1.withSpring)(val, {
            overshootClamping: false,
        }));
    }, [translateY]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        show,
    }), [show]);
    (0, react_1.useEffect)(() => {
        Growl.setIsReady();
    }, []);
    (0, react_1.useEffect)(() => {
        if (!duration) {
            return;
        }
        fling(0);
        setTimeout(() => {
            fling();
            setDuration(undefined);
        }, duration);
    }, [duration, fling]);
    // GestureDetector by default runs callbacks on UI thread using Reanimated. In this
    // case we want to trigger an RN's Animated animation, which needs to be done on JS thread.
    const flingGesture = react_native_gesture_handler_1.Gesture.Fling()
        .direction(react_native_gesture_handler_1.Directions.UP)
        .runOnJS(true)
        .onStart(() => {
        fling();
    });
    return (<react_native_1.View style={[styles.growlNotificationWrapper]}>
            <GrowlNotificationContainer_1.default translateY={translateY}>
                <PressableWithoutFeedback accessibilityLabel={bodyText} onPress={() => fling()}>
                    <react_native_gesture_handler_1.GestureDetector gesture={flingGesture}>
                        <react_native_1.View style={styles.growlNotificationBox}>
                            <Icon_1.default src={types[type].icon} fill={types[type].iconColor}/>
                            <Text_1.default style={styles.growlNotificationText}>{bodyText}</Text_1.default>
                        </react_native_1.View>
                    </react_native_gesture_handler_1.GestureDetector>
                </PressableWithoutFeedback>
            </GrowlNotificationContainer_1.default>
        </react_native_1.View>);
}
GrowlNotification.displayName = 'GrowlNotification';
exports.default = (0, react_1.forwardRef)(GrowlNotification);
