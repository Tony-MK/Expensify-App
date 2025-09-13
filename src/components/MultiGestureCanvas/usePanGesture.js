"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const Browser = require("@libs/Browser");
const constants_1 = require("./constants");
const MultiGestureCanvasUtils = require("./utils");
// This value determines how fast the pan animation should phase out
// We're using a "withDecay" animation to smoothly phase out the pan animation
// https://docs.swmansion.com/react-native-reanimated/docs/animations/withDecay/
const PAN_DECAY_DECLARATION = 0.9915;
const SCREEN_HEIGHT = react_native_1.Dimensions.get('screen').height;
const SNAP_POINT = SCREEN_HEIGHT / 4;
const SNAP_POINT_HIDDEN = SCREEN_HEIGHT / 1.2;
const usePanGesture = ({ canvasSize, contentSize, zoomScale, totalScale, offsetX, offsetY, panTranslateX, panTranslateY, shouldDisableTransformationGestures, stopAnimation, isSwipingDownToClose, onSwipeDown, }) => {
    // The content size after fitting it to the canvas and zooming
    const zoomedContentWidth = (0, react_native_reanimated_1.useDerivedValue)(() => contentSize.width * totalScale.get(), [contentSize.width]);
    const zoomedContentHeight = (0, react_native_reanimated_1.useDerivedValue)(() => contentSize.height * totalScale.get(), [contentSize.height]);
    // Used to track previous touch position for the "swipe down to close" gesture
    const previousTouch = (0, react_native_reanimated_1.useSharedValue)(null);
    // Velocity of the pan gesture
    // We need to keep track of the velocity to properly phase out/decay the pan animation
    const panVelocityX = (0, react_native_reanimated_1.useSharedValue)(0);
    const panVelocityY = (0, react_native_reanimated_1.useSharedValue)(0);
    const isMobileBrowser = Browser.isMobile();
    // Disable "swipe down to close" gesture when content is bigger than the canvas
    const enableSwipeDownToClose = (0, react_native_reanimated_1.useDerivedValue)(() => canvasSize.height < zoomedContentHeight.get(), [canvasSize.height]);
    // Calculates bounds of the scaled content
    // Can we pan left/right/up/down
    // Can be used to limit gesture or implementing tension effect
    const getBounds = (0, react_1.useCallback)(() => {
        'worklet';
        let horizontalBoundary = 0;
        let verticalBoundary = 0;
        if (canvasSize.width < zoomedContentWidth.get()) {
            horizontalBoundary = Math.abs(canvasSize.width - zoomedContentWidth.get()) / 2;
        }
        if (canvasSize.height < zoomedContentHeight.get()) {
            verticalBoundary = Math.abs(zoomedContentHeight.get() - canvasSize.height) / 2;
        }
        const horizontalBoundaries = { min: -horizontalBoundary, max: horizontalBoundary };
        const verticalBoundaries = { min: -verticalBoundary, max: verticalBoundary };
        const clampedOffset = {
            x: MultiGestureCanvasUtils.clamp(offsetX.get(), horizontalBoundaries.min, horizontalBoundaries.max),
            y: MultiGestureCanvasUtils.clamp(offsetY.get(), verticalBoundaries.min, verticalBoundaries.max),
        };
        // If the horizontal/vertical offset is the same after clamping to the min/max boundaries, the content is within the boundaries
        const isInHorizontalBoundary = clampedOffset.x === offsetX.get();
        const isInVerticalBoundary = clampedOffset.y === offsetY.get();
        return {
            horizontalBoundaries,
            verticalBoundaries,
            clampedOffset,
            isInHorizontalBoundary,
            isInVerticalBoundary,
        };
    }, [canvasSize.width, canvasSize.height, zoomedContentWidth, zoomedContentHeight, offsetX, offsetY]);
    // We want to smoothly decay/end the gesture by phasing out the pan animation
    // In case the content is outside of the boundaries of the canvas,
    // we need to move the content back into the boundaries
    const finishPanGesture = (0, react_1.useCallback)(() => {
        'worklet';
        // If the content is centered within the canvas, we don't need to run any animations
        if (offsetX.get() === 0 && offsetY.get() === 0 && panTranslateX.get() === 0 && panTranslateY.get() === 0) {
            return;
        }
        const { clampedOffset, isInHorizontalBoundary, isInVerticalBoundary, horizontalBoundaries, verticalBoundaries } = getBounds();
        // If the content is within the horizontal/vertical boundaries of the canvas, we can smoothly phase out the animation
        // If not, we need to snap back to the boundaries
        if (isInHorizontalBoundary) {
            // If the (absolute) velocity is 0, we don't need to run an animation
            if (Math.abs(panVelocityX.get()) !== 0) {
                // Phase out the pan animation
                // eslint-disable-next-line react-compiler/react-compiler
                offsetX.set((0, react_native_reanimated_1.withDecay)({
                    velocity: panVelocityX.get(),
                    clamp: [horizontalBoundaries.min, horizontalBoundaries.max],
                    deceleration: PAN_DECAY_DECLARATION,
                    rubberBandEffect: false,
                }));
            }
        }
        else {
            // Animated back to the boundary
            offsetX.set((0, react_native_reanimated_1.withSpring)(clampedOffset.x, constants_1.SPRING_CONFIG));
        }
        if (isInVerticalBoundary) {
            // If the (absolute) velocity is 0, we don't need to run an animation
            if (Math.abs(panVelocityY.get()) !== 0) {
                // Phase out the pan animation
                offsetY.set((0, react_native_reanimated_1.withDecay)({
                    velocity: panVelocityY.get(),
                    clamp: [verticalBoundaries.min, verticalBoundaries.max],
                    deceleration: PAN_DECAY_DECLARATION,
                }));
            }
        }
        else {
            const finalTranslateY = offsetY.get() + panVelocityY.get() * 0.2;
            if (finalTranslateY > SNAP_POINT && zoomScale.get() <= 1) {
                offsetY.set((0, react_native_reanimated_1.withSpring)(SNAP_POINT_HIDDEN, constants_1.SPRING_CONFIG, () => {
                    isSwipingDownToClose.set(false);
                    if (onSwipeDown) {
                        (0, react_native_reanimated_1.runOnJS)(onSwipeDown)();
                    }
                }));
            }
            else {
                // Animated back to the boundary
                offsetY.set((0, react_native_reanimated_1.withSpring)(clampedOffset.y, constants_1.SPRING_CONFIG, () => {
                    isSwipingDownToClose.set(false);
                }));
            }
        }
        // Reset velocity variables after we finished the pan gesture
        panVelocityX.set(0);
        panVelocityY.set(0);
    }, [getBounds, isSwipingDownToClose, offsetX, offsetY, onSwipeDown, panTranslateX, panTranslateY, panVelocityX, panVelocityY, zoomScale]);
    const panGesture = react_native_gesture_handler_1.Gesture.Pan()
        .manualActivation(true)
        .averageTouches(true)
        .onTouchesUp(() => {
        previousTouch.set(null);
    })
        .onTouchesMove((evt, state) => {
        // We only allow panning when the content is zoomed in
        if (zoomScale.get() > 1 && !shouldDisableTransformationGestures.get()) {
            state.activate();
        }
        // TODO: this needs tuning to work properly
        const previousTouchValue = previousTouch.get();
        if (!shouldDisableTransformationGestures.get() && zoomScale.get() === 1 && previousTouchValue !== null) {
            const velocityX = Math.abs((evt.allTouches.at(0)?.x ?? 0) - previousTouchValue.x);
            const velocityY = (evt.allTouches.at(0)?.y ?? 0) - previousTouchValue.y;
            if (Math.abs(velocityY) > velocityX && velocityY > 20) {
                state.activate();
                isSwipingDownToClose.set(true);
                previousTouch.set(null);
                return;
            }
        }
        if (previousTouch.get() === null) {
            previousTouch.set({
                x: evt.allTouches.at(0)?.x ?? 0,
                y: evt.allTouches.at(0)?.y ?? 0,
            });
        }
    })
        .onStart(() => {
        stopAnimation();
    })
        .onChange((evt) => {
        // Since we're running both pinch and pan gesture handlers simultaneously,
        // we need to make sure that we don't pan when we pinch since we track it as pinch focal gesture.
        if (evt.numberOfPointers > 1) {
            return;
        }
        panVelocityX.set(evt.velocityX);
        panVelocityY.set(evt.velocityY);
        if (!isSwipingDownToClose.get()) {
            if (!isMobileBrowser || (isMobileBrowser && zoomScale.get() !== 1)) {
                panTranslateX.set((value) => value + evt.changeX);
            }
        }
        if (enableSwipeDownToClose.get() || isSwipingDownToClose.get()) {
            panTranslateY.set((value) => value + evt.changeY);
        }
    })
        .onEnd(() => {
        // Add pan translation to total offset and reset gesture variables
        offsetX.set((value) => value + panTranslateX.get());
        offsetY.set((value) => value + panTranslateY.get());
        // Reset pan gesture variables
        panTranslateX.set(0);
        panTranslateY.set(0);
        previousTouch.set(null);
        // If we are swiping (in the pager), we don't want to return to boundaries
        if (shouldDisableTransformationGestures.get()) {
            return;
        }
        finishPanGesture();
    });
    return panGesture;
};
exports.default = usePanGesture;
