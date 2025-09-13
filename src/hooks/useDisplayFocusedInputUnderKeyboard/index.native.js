"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
var react_native_reanimated_1 = require("react-native-reanimated");
var SplitListItem_1 = require("@components/SelectionList/SplitListItem");
var useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
var const_1 = require("./const");
var useDisplayFocusedInputUnderKeyboard = function () {
    var screenHeight = react_native_1.Dimensions.get('window').height;
    var viewRef = (0, react_1.useRef)(null);
    var bottomOffset = (0, react_1.useRef)(0);
    var footerRef = (0, react_1.useRef)(null);
    var keyboardHeight = (0, react_native_reanimated_1.useSharedValue)(0);
    var safeAreaPaddings = (0, useSafeAreaPaddings_1.default)();
    var listRef = (0, react_1.useRef)(null);
    var changeKeyboardHeight = function (_a) {
        'worklet';
        var height = _a.height;
        keyboardHeight.set(height);
    };
    (0, react_native_keyboard_controller_1.useKeyboardHandler)({
        onStart: changeKeyboardHeight,
        onMove: changeKeyboardHeight,
        onEnd: changeKeyboardHeight,
    });
    var scrollToFocusedInput = function () {
        if (!viewRef.current) {
            return;
        }
        viewRef.current.measureInWindow(function (_x, _y, _width, height) {
            var _a;
            (_a = footerRef.current) === null || _a === void 0 ? void 0 : _a.measureInWindow(function (_footerX, _footerY, _footerWidth, footerHeight) {
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
        listRef: listRef,
        viewRef: viewRef,
        footerRef: footerRef,
        bottomOffset: bottomOffset,
        scrollToFocusedInput: scrollToFocusedInput,
        SplitListItem: SplitListItem_1.default,
    };
};
exports.default = useDisplayFocusedInputUnderKeyboard;
