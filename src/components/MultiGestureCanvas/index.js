"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ZOOM_RANGE = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const constants_1 = require("./constants");
Object.defineProperty(exports, "DEFAULT_ZOOM_RANGE", { enumerable: true, get: function () { return constants_1.DEFAULT_ZOOM_RANGE; } });
const usePanGesture_1 = require("./usePanGesture");
const usePinchGesture_1 = require("./usePinchGesture");
const useTapGestures_1 = require("./useTapGestures");
const MultiGestureCanvasUtils = require("./utils");
const defaultContentSize = { width: 1, height: 1 };
function MultiGestureCanvas({ canvasSize, contentSize: contentSizeProp, zoomRange: zoomRangeProp, isActive = true, children, pagerRef, isUsedInCarousel, shouldDisableTransformationGestures: shouldDisableTransformationGesturesProp, isPagerScrollEnabled, onTap, onScaleChanged, onSwipeDown, externalGestureHandler, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const contentSize = contentSizeProp ?? defaultContentSize;
    const shouldDisableTransformationGesturesFallback = (0, react_native_reanimated_1.useSharedValue)(false);
    const shouldDisableTransformationGestures = shouldDisableTransformationGesturesProp ?? shouldDisableTransformationGesturesFallback;
    const zoomRange = (0, react_1.useMemo)(() => ({
        min: zoomRangeProp?.min ?? constants_1.DEFAULT_ZOOM_RANGE.min,
        max: zoomRangeProp?.max ?? constants_1.DEFAULT_ZOOM_RANGE.max,
    }), [zoomRangeProp?.max, zoomRangeProp?.min]);
    // Based on the (original) content size and the canvas size, we calculate the horizontal and vertical scale factors
    // to fit the content inside the canvas
    // We later use the lower of the two scale factors to fit the content inside the canvas
    const { minScale: minContentScale, maxScale: maxContentScale } = (0, react_1.useMemo)(() => MultiGestureCanvasUtils.getCanvasFitScale({ canvasSize, contentSize }), [canvasSize, contentSize]);
    const zoomScale = (0, react_native_reanimated_1.useSharedValue)(1);
    // Adding together zoom scale and the initial scale to fit the content into the canvas
    // Using the minimum content scale, so that the image is not bigger than the canvas
    // and not smaller than needed to fit
    const totalScale = (0, react_native_reanimated_1.useDerivedValue)(() => zoomScale.get() * minContentScale, [minContentScale]);
    const panTranslateX = (0, react_native_reanimated_1.useSharedValue)(0);
    const panTranslateY = (0, react_native_reanimated_1.useSharedValue)(0);
    const isSwipingDownToClose = (0, react_native_reanimated_1.useSharedValue)(false);
    const panGestureRef = (0, react_1.useRef)(react_native_gesture_handler_1.Gesture.Pan());
    const pinchScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const pinchTranslateX = (0, react_native_reanimated_1.useSharedValue)(0);
    const pinchTranslateY = (0, react_native_reanimated_1.useSharedValue)(0);
    // Total offset of the content including previous translations from panning and pinching gestures
    const offsetX = (0, react_native_reanimated_1.useSharedValue)(0);
    const offsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_native_reanimated_1.useAnimatedReaction)(() => isSwipingDownToClose.get(), (current) => {
        if (!isUsedInCarousel) {
            return;
        }
        // eslint-disable-next-line react-compiler/react-compiler, no-param-reassign
        isPagerScrollEnabled.set(!current);
    });
    /**
     * Stops any currently running decay animation from panning
     */
    const stopAnimation = (0, react_1.useCallback)(() => {
        'worklet';
        (0, react_native_reanimated_1.cancelAnimation)(offsetX);
        (0, react_native_reanimated_1.cancelAnimation)(offsetY);
    }, [offsetX, offsetY]);
    /**
     * Resets the canvas to the initial state and animates back smoothly
     */
    const reset = (0, react_1.useCallback)((animated, callback) => {
        'worklet';
        stopAnimation();
        offsetX.set(0);
        offsetY.set(0);
        pinchScale.set(1);
        if (animated) {
            panTranslateX.set((0, react_native_reanimated_1.withSpring)(0, constants_1.SPRING_CONFIG));
            panTranslateY.set((0, react_native_reanimated_1.withSpring)(0, constants_1.SPRING_CONFIG));
            pinchTranslateX.set((0, react_native_reanimated_1.withSpring)(0, constants_1.SPRING_CONFIG));
            pinchTranslateY.set((0, react_native_reanimated_1.withSpring)(0, constants_1.SPRING_CONFIG));
            zoomScale.set((0, react_native_reanimated_1.withSpring)(1, constants_1.SPRING_CONFIG, callback));
            return;
        }
        panTranslateX.set(0);
        panTranslateY.set(0);
        pinchTranslateX.set(0);
        pinchTranslateY.set(0);
        zoomScale.set(1);
        if (callback === undefined) {
            return;
        }
        callback();
    }, [offsetX, offsetY, panTranslateX, panTranslateY, pinchScale, pinchTranslateX, pinchTranslateY, stopAnimation, zoomScale]);
    const { singleTapGesture: baseSingleTapGesture, doubleTapGesture } = (0, useTapGestures_1.default)({
        canvasSize,
        contentSize,
        minContentScale,
        maxContentScale,
        offsetX,
        offsetY,
        pinchScale,
        zoomScale,
        reset,
        stopAnimation,
        onScaleChanged,
        onTap,
        shouldDisableTransformationGestures,
    });
    // eslint-disable-next-line react-compiler/react-compiler
    const singleTapGesture = baseSingleTapGesture.requireExternalGestureToFail(doubleTapGesture, panGestureRef);
    const panGestureSimultaneousList = (0, react_1.useMemo)(() => (pagerRef === undefined ? [singleTapGesture, doubleTapGesture] : [pagerRef, singleTapGesture, doubleTapGesture]), [doubleTapGesture, pagerRef, singleTapGesture]);
    const panGesture = (0, usePanGesture_1.default)({
        canvasSize,
        contentSize,
        zoomScale,
        totalScale,
        offsetX,
        offsetY,
        panTranslateX,
        panTranslateY,
        stopAnimation,
        shouldDisableTransformationGestures,
        isSwipingDownToClose,
        onSwipeDown,
    })
        .simultaneousWithExternalGesture(...panGestureSimultaneousList)
        // eslint-disable-next-line react-compiler/react-compiler
        .withRef(panGestureRef);
    const pinchGesture = (0, usePinchGesture_1.default)({
        canvasSize,
        zoomScale,
        zoomRange,
        offsetX,
        offsetY,
        pinchTranslateX,
        pinchTranslateY,
        pinchScale,
        stopAnimation,
        onScaleChanged,
        shouldDisableTransformationGestures,
    }).simultaneousWithExternalGesture(panGesture, singleTapGesture, doubleTapGesture);
    // Trigger a reset when the canvas gets inactive, but only if it was already mounted before
    const mounted = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        if (!isActive) {
            (0, react_native_reanimated_1.runOnUI)(reset)(false);
        }
    }, [isActive, mounted, reset]);
    // Animate the x and y position of the content within the canvas based on all of the gestures
    const animatedStyles = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const x = pinchTranslateX.get() + panTranslateX.get() + offsetX.get();
        const y = pinchTranslateY.get() + panTranslateY.get() + offsetY.get();
        return {
            transform: [
                {
                    translateX: x,
                },
                {
                    translateY: y,
                },
                { scale: totalScale.get() },
            ],
            // Hide the image if the size is not ready yet
            opacity: contentSizeProp?.width ? 1 : 0,
        };
    });
    const containerStyles = (0, react_1.useMemo)(() => [styles.flex1, StyleUtils.getMultiGestureCanvasContainerStyle(canvasSize.width)], [StyleUtils, canvasSize.width, styles.flex1]);
    const panGestureWrapper = externalGestureHandler ? panGesture.simultaneousWithExternalGesture(externalGestureHandler) : panGesture;
    return (<react_native_1.View collapsable={false} style={containerStyles}>
            <react_native_gesture_handler_1.GestureDetector gesture={react_native_gesture_handler_1.Gesture.Simultaneous(pinchGesture, react_native_gesture_handler_1.Gesture.Race(singleTapGesture, doubleTapGesture, panGestureWrapper))}>
                <react_native_1.View collapsable={false} onTouchEnd={(e) => e.preventDefault()} style={StyleUtils.getFullscreenCenteredContentStyles()}>
                    <react_native_reanimated_1.default.View collapsable={false} style={[animatedStyles, styles.canvasContainer]}>
                        {children}
                    </react_native_reanimated_1.default.View>
                </react_native_1.View>
            </react_native_gesture_handler_1.GestureDetector>
        </react_native_1.View>);
}
MultiGestureCanvas.displayName = 'MultiGestureCanvas';
exports.default = MultiGestureCanvas;
