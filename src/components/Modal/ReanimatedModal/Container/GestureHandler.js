"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var react_native_reanimated_1 = require("react-native-reanimated");
var CONST_1 = require("@src/CONST");
function hasSwipeEnded(e, initialPosition, swipeThreshold, swipeDirection, onSwipeComplete) {
    'worklet';
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!swipeDirection || !(swipeDirection === null || swipeDirection === void 0 ? void 0 : swipeDirection.length) || !onSwipeComplete) {
        return;
    }
    var directions = Array.isArray(swipeDirection) ? swipeDirection : [swipeDirection];
    for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
        var direction = directions_1[_i];
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
function GestureHandler(_a) {
    var swipeDirection = _a.swipeDirection, onSwipeComplete = _a.onSwipeComplete, _b = _a.swipeThreshold, swipeThreshold = _b === void 0 ? 100 : _b, children = _a.children;
    var initialTranslationX = (0, react_native_reanimated_1.useSharedValue)(0);
    var initialTranslationY = (0, react_native_reanimated_1.useSharedValue)(0);
    var panGesture = (0, react_1.useMemo)(function () {
        return react_native_gesture_handler_1.Gesture.Pan()
            .onStart(function (e) {
            initialTranslationX.set(e.translationX);
            initialTranslationY.set(e.translationY);
        })
            .onEnd(function (e) {
            hasSwipeEnded(e, { x: initialTranslationX.get(), y: initialTranslationY.get() }, swipeThreshold, swipeDirection, onSwipeComplete);
        });
    }, [initialTranslationX, initialTranslationY, onSwipeComplete, swipeDirection, swipeThreshold]);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!swipeDirection || !(swipeDirection === null || swipeDirection === void 0 ? void 0 : swipeDirection.length) || !onSwipeComplete) {
        return children;
    }
    return <react_native_gesture_handler_1.GestureDetector gesture={panGesture}>{children}</react_native_gesture_handler_1.GestureDetector>;
}
GestureHandler.displayName = 'GestureHandler';
exports.default = GestureHandler;
