"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
const react_native_reanimated_1 = require("react-native-reanimated");
const SplitListItem_1 = require("@components/SelectionList/SplitListItem");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const const_1 = require("./const");
const useDisplayFocusedInputUnderKeyboard = () => {
    const screenHeight = react_native_1.Dimensions.get('window').height;
    const viewRef = (0, react_1.useRef)(null);
    const bottomOffset = (0, react_1.useRef)(0);
    const footerRef = (0, react_1.useRef)(null);
    const keyboardHeight = (0, react_native_reanimated_1.useSharedValue)(0);
    const safeAreaPaddings = (0, useSafeAreaPaddings_1.default)();
    const listRef = (0, react_1.useRef)(null);
    const changeKeyboardHeight = ({ height }) => {
        'worklet';
        keyboardHeight.set(height);
    };
    (0, react_native_keyboard_controller_1.useKeyboardHandler)({
        onStart: changeKeyboardHeight,
        onMove: changeKeyboardHeight,
        onEnd: changeKeyboardHeight,
    });
    const scrollToFocusedInput = () => {
        if (!viewRef.current) {
            return;
        }
        viewRef.current.measureInWindow((_x, _y, _width, height) => {
            footerRef.current?.measureInWindow((_footerX, _footerY, _footerWidth, footerHeight) => {
                if (keyboardHeight.get() >= 1.0) {
                    return;
                }
                bottomOffset.current =
                    screenHeight -
                        safeAreaPaddings.paddingBottom -
                        safeAreaPaddings.paddingTop -
                        height +
                        footerHeight +
                        react_native_1.Platform.select({ ios: const_1.MARGIN_FROM_INPUT_IOS, default: const_1.MARGIN_FROM_INPUT_ANDROID }) +
                        const_1.FOOTER_BOTTOM_MARGIN;
            });
        });
    };
    return {
        listRef,
        viewRef,
        footerRef,
        bottomOffset,
        scrollToFocusedInput,
        SplitListItem: SplitListItem_1.default,
    };
};
exports.default = useDisplayFocusedInputUnderKeyboard;
