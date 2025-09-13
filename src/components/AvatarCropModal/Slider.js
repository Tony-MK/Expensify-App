"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser = require("@libs/Browser");
const ControlSelection_1 = require("@libs/ControlSelection");
// This component can't be written using class since reanimated API uses hooks.
function Slider({ sliderValue, gestureCallbacks }) {
    const styles = (0, useThemeStyles_1.default)();
    const [tooltipIsVisible, setTooltipIsVisible] = (0, react_1.useState)(true);
    const { translate } = (0, useLocalize_1.default)();
    // A reanimated memoized style, which tracks
    // a translateX shared value and updates the slider position.
    const rSliderStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        'worklet';
        return {
            transform: [{ translateX: sliderValue.get() }],
        };
    });
    const panGesture = react_native_gesture_handler_1.Gesture.Pan()
        .minDistance(5)
        .onBegin(() => {
        (0, react_native_reanimated_1.runOnJS)(setTooltipIsVisible)(false);
        gestureCallbacks.onBegin();
    })
        .onChange((event) => {
        gestureCallbacks.onChange(event);
    })
        .onFinalize(() => {
        (0, react_native_reanimated_1.runOnJS)(setTooltipIsVisible)(true);
        gestureCallbacks.onFinalize();
    });
    // We're preventing text selection with ControlSelection.blockElement to prevent safari
    // default behaviour of cursor - I-beam cursor on drag. See https://github.com/Expensify/App/issues/13688
    return (<react_native_1.View ref={(el) => ControlSelection_1.default.blockElement(el)} style={styles.sliderBar}>
            <react_native_gesture_handler_1.GestureDetector gesture={panGesture}>
                <react_native_reanimated_1.default.View style={[styles.sliderKnob, rSliderStyle]}>
                    {tooltipIsVisible && (<Tooltip_1.default text={translate('common.zoom')} shiftVertical={-2}>
                            {/* pointerEventsNone is a workaround to make sure the pan gesture works correctly on mobile safari */}
                            <react_native_1.View style={[styles.sliderKnobTooltipView, Browser.isMobileSafari() && styles.pointerEventsNone]}/>
                        </Tooltip_1.default>)}
                </react_native_reanimated_1.default.View>
            </react_native_gesture_handler_1.GestureDetector>
        </react_native_1.View>);
}
Slider.displayName = 'Slider';
exports.default = Slider;
