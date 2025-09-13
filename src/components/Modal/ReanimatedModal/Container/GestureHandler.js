"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const CONST_1 = require("@src/CONST");
function hasSwipeEnded(e, initialPosition, swipeThreshold, swipeDirection, onSwipeComplete) {
    'worklet';
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!swipeDirection || !swipeDirection?.length || !onSwipeComplete) {
        return;
    }
    const directions = Array.isArray(swipeDirection) ? swipeDirection : [swipeDirection];
    for (const direction of directions) {
        switch (direction) {
            case CONST_1.default.SWIPE_DIRECTION.RIGHT:
                if (e.translationX - initialPosition.x > swipeThreshold) {
                    (0, react_native_reanimated_1.runOnJS)(onSwipeComplete)();
                }
                break;
            case CONST_1.default.SWIPE_DIRECTION.LEFT:
                if (initialPosition.x - e.translationX > swipeThreshold) {
                    (0, react_native_reanimated_1.runOnJS)(onSwipeComplete)();
                }
                break;
            case CONST_1.default.SWIPE_DIRECTION.UP:
                if (initialPosition.y - e.translationY > swipeThreshold) {
                    (0, react_native_reanimated_1.runOnJS)(onSwipeComplete)();
                }
                break;
            case CONST_1.default.SWIPE_DIRECTION.DOWN:
                if (e.translationY - initialPosition.y > swipeThreshold) {
                    (0, react_native_reanimated_1.runOnJS)(onSwipeComplete)();
                }
                break;
            default:
                throw new Error('Unknown swipe direction');
        }
    }
}
function GestureHandler({ swipeDirection, onSwipeComplete, swipeThreshold = 100, children }) {
    const initialTranslationX = (0, react_native_reanimated_1.useSharedValue)(0);
    const initialTranslationY = (0, react_native_reanimated_1.useSharedValue)(0);
    const panGesture = (0, react_1.useMemo)(() => react_native_gesture_handler_1.Gesture.Pan()
        .onStart((e) => {
        initialTranslationX.set(e.translationX);
        initialTranslationY.set(e.translationY);
    })
        .onEnd((e) => {
        hasSwipeEnded(e, { x: initialTranslationX.get(), y: initialTranslationY.get() }, swipeThreshold, swipeDirection, onSwipeComplete);
    }), [initialTranslationX, initialTranslationY, onSwipeComplete, swipeDirection, swipeThreshold]);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!swipeDirection || !swipeDirection?.length || !onSwipeComplete) {
        return children;
    }
    return <react_native_gesture_handler_1.GestureDetector gesture={panGesture}>{children}</react_native_gesture_handler_1.GestureDetector>;
}
GestureHandler.displayName = 'GestureHandler';
exports.default = GestureHandler;
