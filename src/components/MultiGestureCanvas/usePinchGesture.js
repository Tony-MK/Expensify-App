"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
const react_1 = require("react");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const constants_1 = require("./constants");
const usePinchGesture = ({ canvasSize, zoomScale, zoomRange, offsetX, offsetY, pinchTranslateX: totalPinchTranslateX, pinchTranslateY: totalPinchTranslateY, pinchScale, shouldDisableTransformationGestures, stopAnimation, onScaleChanged, }) => {
    // The current pinch gesture event scale
    const currentPinchScale = (0, react_native_reanimated_1.useSharedValue)(1);
    // Origin of the pinch gesture
    const pinchOrigin = {
        x: (0, react_native_reanimated_1.useSharedValue)(0),
        y: (0, react_native_reanimated_1.useSharedValue)(0),
    };
    // How much the content is translated during the pinch gesture
    // While the pinch gesture is running, the pan gesture is disabled
    // Therefore we need to add the translation separately
    const pinchTranslateX = (0, react_native_reanimated_1.useSharedValue)(0);
    const pinchTranslateY = (0, react_native_reanimated_1.useSharedValue)(0);
    // In order to keep track of the "bounce" effect when "over-zooming"/"under-zooming",
    // we need to have extra "bounce" translation variables
    const pinchBounceTranslateX = (0, react_native_reanimated_1.useSharedValue)(0);
    const pinchBounceTranslateY = (0, react_native_reanimated_1.useSharedValue)(0);
    const triggerScaleChangedEvent = () => {
        'worklet';
        if (onScaleChanged === undefined) {
            return;
        }
        (0, react_native_reanimated_1.runOnJS)(onScaleChanged)(zoomScale.get());
    };
    // Update the total (pinch) translation based on the regular pinch + bounce
    (0, react_native_reanimated_1.useAnimatedReaction)(() => [pinchTranslateX.get(), pinchTranslateY.get(), pinchBounceTranslateX.get(), pinchBounceTranslateY.get()], ([translateX, translateY, bounceX, bounceY]) => {
        // eslint-disable-next-line react-compiler/react-compiler
        totalPinchTranslateX.set(translateX + bounceX);
        totalPinchTranslateY.set(translateY + bounceY);
    });
    /**
     * Calculates the adjusted focal point of the pinch gesture,
     * based on the canvas size and the current offset
     */
    const getAdjustedFocal = (0, react_1.useCallback)((focalX, focalY) => {
        'worklet';
        return {
            x: focalX - (canvasSize.width / 2 + offsetX.get()),
            y: focalY - (canvasSize.height / 2 + offsetY.get()),
        };
    }, [canvasSize.width, canvasSize.height, offsetX, offsetY]);
    // The pinch gesture is disabled when we release one of the fingers
    // On the next render, we need to re-enable the pinch gesture
    const [pinchEnabled, setPinchEnabled] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (pinchEnabled) {
            return;
        }
        setPinchEnabled(true);
    }, [pinchEnabled]);
    const pinchGesture = react_native_gesture_handler_1.Gesture.Pinch()
        .enabled(pinchEnabled)
        // The first argument is not used, but must be defined
        .onTouchesDown((_evt, state) => {
        // react-compiler optimization unintentionally make all the callbacks run on the JS thread.
        // Adding the worklet directive here will make all the callbacks run on UI thread back.
        'worklet';
        // We don't want to activate pinch gesture when we are swiping in the pager
        if (!shouldDisableTransformationGestures.get()) {
            return;
        }
        state.fail();
    })
        .onStart((evt) => {
        stopAnimation();
        // Set the origin focal point of the pinch gesture at the start of the gesture
        const adjustedFocal = getAdjustedFocal(evt.focalX, evt.focalY);
        pinchOrigin.x.set(adjustedFocal.x);
        pinchOrigin.y.set(adjustedFocal.y);
    })
        .onChange((evt) => {
        'worklet';
        // Disable the pinch gesture if one finger is released,
        // to prevent the content from shaking/jumping
        if (evt.numberOfPointers !== 2) {
            (0, react_native_reanimated_1.runOnJS)(setPinchEnabled)(false);
            return;
        }
        const newZoomScale = pinchScale.get() * evt.scale;
        // Limit the zoom scale to zoom range including bounce range
        if (zoomScale.get() >= zoomRange.min * constants_1.ZOOM_RANGE_BOUNCE_FACTORS.min && zoomScale.get() <= zoomRange.max * constants_1.ZOOM_RANGE_BOUNCE_FACTORS.max) {
            zoomScale.set(newZoomScale);
            currentPinchScale.set(evt.scale);
            triggerScaleChangedEvent();
        }
        // Calculate new pinch translation
        const adjustedFocal = getAdjustedFocal(evt.focalX, evt.focalY);
        const newPinchTranslateX = adjustedFocal.x + currentPinchScale.get() * pinchOrigin.x.get() * -1;
        const newPinchTranslateY = adjustedFocal.y + currentPinchScale.get() * pinchOrigin.y.get() * -1;
        // If the zoom scale is within the zoom range, we perform the regular pinch translation
        // Otherwise it means that we are "over-zoomed" or "under-zoomed", so we need to bounce back
        if (zoomScale.get() >= zoomRange.min && zoomScale.get() <= zoomRange.max) {
            pinchTranslateX.set(newPinchTranslateX);
            pinchTranslateY.set(newPinchTranslateY);
        }
        else {
            // Store x and y translation that is produced while bouncing
            // so we can revert the bounce once pinch gesture is released
            pinchBounceTranslateX.set(newPinchTranslateX - pinchTranslateX.get());
            pinchBounceTranslateY.set(newPinchTranslateY - pinchTranslateY.get());
        }
    })
        .onEnd(() => {
        // Add pinch translation to total offset and reset gesture variables
        offsetX.set((value) => value + pinchTranslateX.get());
        offsetY.set((value) => value + pinchTranslateY.get());
        pinchTranslateX.set(0);
        pinchTranslateY.set(0);
        currentPinchScale.set(1);
        // If the content was "over-zoomed" or "under-zoomed", we need to bounce back with an animation
        if (pinchBounceTranslateX.get() !== 0 || pinchBounceTranslateY.get() !== 0) {
            pinchBounceTranslateX.set((0, react_native_reanimated_1.withSpring)(0, constants_1.SPRING_CONFIG));
            pinchBounceTranslateY.set((0, react_native_reanimated_1.withSpring)(0, constants_1.SPRING_CONFIG));
        }
        if (zoomScale.get() < zoomRange.min) {
            // If the zoom scale is less than the minimum zoom scale, we need to set the zoom scale to the minimum
            pinchScale.set(zoomRange.min);
            zoomScale.set((0, react_native_reanimated_1.withSpring)(zoomRange.min, constants_1.SPRING_CONFIG, triggerScaleChangedEvent));
        }
        else if (zoomScale.get() > zoomRange.max) {
            // If the zoom scale is higher than the maximum zoom scale, we need to set the zoom scale to the maximum
            pinchScale.set(zoomRange.max);
            zoomScale.set((0, react_native_reanimated_1.withSpring)(zoomRange.max, constants_1.SPRING_CONFIG, triggerScaleChangedEvent));
        }
        else {
            // Otherwise, we just update the pinch scale offset
            pinchScale.set(zoomScale.get());
            triggerScaleChangedEvent();
        }
    });
    return pinchGesture;
};
exports.default = usePinchGesture;
