"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
const react_1 = require("react");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const constants_1 = require("./constants");
const MultiGestureCanvasUtils = require("./utils");
const useTapGestures = ({ canvasSize, contentSize, minContentScale, maxContentScale, offsetX, offsetY, pinchScale, zoomScale, reset, stopAnimation, shouldDisableTransformationGestures, onScaleChanged, onTap, }) => {
    // The content size after scaling it with minimum scale to fit the content into the canvas
    const scaledContentWidth = (0, react_1.useMemo)(() => contentSize.width * minContentScale, [contentSize.width, minContentScale]);
    const scaledContentHeight = (0, react_1.useMemo)(() => contentSize.height * minContentScale, [contentSize.height, minContentScale]);
    // On double tap the content should be zoomed to fill, but at least zoomed by DOUBLE_TAP_SCALE
    const doubleTapScale = (0, react_1.useMemo)(() => Math.max(constants_1.DOUBLE_TAP_SCALE, maxContentScale / minContentScale), [maxContentScale, minContentScale]);
    const zoomToCoordinates = (0, react_1.useCallback)((focalX, focalY, callback) => {
        'worklet';
        stopAnimation();
        // By how much the canvas is bigger than the content horizontally and vertically per side
        const horizontalCanvasOffset = Math.max(0, (canvasSize.width - scaledContentWidth) / 2);
        const verticalCanvasOffset = Math.max(0, (canvasSize.height - scaledContentHeight) / 2);
        // We need to adjust the focal point to take into account the canvas offset
        // The focal point cannot be outside of the content's bounds
        const adjustedFocalPoint = {
            x: MultiGestureCanvasUtils.clamp(focalX - horizontalCanvasOffset, 0, scaledContentWidth),
            y: MultiGestureCanvasUtils.clamp(focalY - verticalCanvasOffset, 0, scaledContentHeight),
        };
        // The center of the canvas
        const canvasCenter = {
            x: canvasSize.width / 2,
            y: canvasSize.height / 2,
        };
        // The center of the content before zooming
        const originalContentCenter = {
            x: scaledContentWidth / 2,
            y: scaledContentHeight / 2,
        };
        // The size of the content after zooming
        const zoomedContentSize = {
            width: scaledContentWidth * doubleTapScale,
            height: scaledContentHeight * doubleTapScale,
        };
        // The center of the zoomed content
        const zoomedContentCenter = {
            x: zoomedContentSize.width / 2,
            y: zoomedContentSize.height / 2,
        };
        // By how much the zoomed content is bigger/smaller than the canvas.
        const zoomedContentOffset = {
            x: zoomedContentCenter.x - canvasCenter.x,
            y: zoomedContentCenter.y - canvasCenter.y,
        };
        // How much the content needs to be shifted based on the focal point
        const shiftingFactor = {
            x: adjustedFocalPoint.x / originalContentCenter.x - 1,
            y: adjustedFocalPoint.y / originalContentCenter.y - 1,
        };
        // The offset after applying the focal point adjusted shift.
        // We need to invert the shift, because the content is moving in the opposite direction (* -1)
        const offsetAfterZooming = {
            x: zoomedContentOffset.x * (shiftingFactor.x * -1),
            y: zoomedContentOffset.y * (shiftingFactor.y * -1),
        };
        // If the zoomed content is less tall than the canvas, we need to reset the vertical offset
        if (zoomedContentSize.height < canvasSize.height) {
            offsetAfterZooming.y = 0;
        }
        offsetX.set((0, react_native_reanimated_1.withSpring)(offsetAfterZooming.x, constants_1.SPRING_CONFIG));
        offsetY.set((0, react_native_reanimated_1.withSpring)(offsetAfterZooming.y, constants_1.SPRING_CONFIG));
        zoomScale.set((0, react_native_reanimated_1.withSpring)(doubleTapScale, constants_1.SPRING_CONFIG, callback));
        pinchScale.set(doubleTapScale);
    }, [stopAnimation, canvasSize.width, canvasSize.height, scaledContentWidth, scaledContentHeight, doubleTapScale, offsetX, offsetY, zoomScale, pinchScale]);
    const doubleTapGesture = react_native_gesture_handler_1.Gesture.Tap()
        // The first argument is not used, but must be defined
        .onTouchesDown((_evt, state) => {
        'worklet';
        if (!shouldDisableTransformationGestures.get()) {
            return;
        }
        state.fail();
    })
        .numberOfTaps(2)
        .maxDelay(150)
        .maxDistance(20)
        .onEnd((evt) => {
        'worklet';
        const triggerScaleChangedEvent = () => {
            'worklet';
            if (onScaleChanged != null) {
                (0, react_native_reanimated_1.runOnJS)(onScaleChanged)(zoomScale.get());
            }
        };
        // If the content is already zoomed, we want to reset the zoom,
        // otherwise we want to zoom in
        if (zoomScale.get() > 1) {
            reset(true, triggerScaleChangedEvent);
        }
        else {
            zoomToCoordinates(evt.x, evt.y, triggerScaleChangedEvent);
        }
    });
    const singleTapGesture = react_native_gesture_handler_1.Gesture.Tap()
        .numberOfTaps(1)
        .maxDuration(125)
        .onBegin(() => {
        'worklet';
        stopAnimation();
    })
        .onFinalize((_evt, success) => {
        'worklet';
        if (!success || onTap === undefined) {
            return;
        }
        (0, react_native_reanimated_1.runOnJS)(onTap)();
    });
    return { singleTapGesture, doubleTapGesture };
};
exports.default = useTapGestures;
