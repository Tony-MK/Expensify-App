"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CONST_1 = require("@src/CONST");
function SwipeableView({ children, onSwipeDown }) {
    const minimumPixelDistance = CONST_1.default.COMPOSER_MAX_HEIGHT;
    const oldYRef = (0, react_1.useRef)(0);
    const panResponder = (0, react_1.useRef)(
    // eslint-disable-next-line react-compiler/react-compiler
    react_native_1.PanResponder.create({
        // The PanResponder gets focus only when the y-axis movement is over minimumPixelDistance & swipe direction is downwards
        onMoveShouldSetPanResponderCapture: (_event, gestureState) => {
            if (gestureState.dy - oldYRef.current > 0 && gestureState.dy > minimumPixelDistance) {
                return true;
            }
            oldYRef.current = gestureState.dy;
            return false;
        },
        // Calls the callback when the swipe down is released; after the completion of the gesture
        onPanResponderRelease: onSwipeDown,
    })).current;
    // eslint-disable-next-line react/jsx-props-no-spreading, react-compiler/react-compiler
    return <react_native_1.View {...panResponder.panHandlers}>{children}</react_native_1.View>;
}
SwipeableView.displayName = 'SwipeableView';
exports.default = SwipeableView;
