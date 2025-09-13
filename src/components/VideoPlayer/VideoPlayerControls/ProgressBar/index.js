"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const PlaybackContext_1 = require("@components/VideoPlayerContexts/PlaybackContext");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function getProgress(currentPosition, maxPosition) {
    return Math.min(Math.max((currentPosition / maxPosition) * 100, 0), 100);
}
function ProgressBar({ duration, position, seekPosition }) {
    const styles = (0, useThemeStyles_1.default)();
    const { pauseVideo, playVideo, checkIfVideoIsPlaying } = (0, PlaybackContext_1.usePlaybackContext)();
    const [sliderWidth, setSliderWidth] = (0, react_1.useState)(1);
    const [isSliderPressed, setIsSliderPressed] = (0, react_1.useState)(false);
    const progressWidth = (0, react_native_reanimated_1.useSharedValue)(0);
    const wasVideoPlayingOnCheck = (0, react_native_reanimated_1.useSharedValue)(false);
    const onCheckIfVideoIsPlaying = (isPlaying) => {
        wasVideoPlayingOnCheck.set(isPlaying);
    };
    const progressBarInteraction = (event) => {
        const progress = getProgress(event.x, sliderWidth);
        progressWidth.set(progress);
        (0, react_native_reanimated_1.runOnJS)(seekPosition)((progress * duration) / 100);
    };
    const onSliderLayout = (event) => {
        setSliderWidth(event.nativeEvent.layout.width);
    };
    const pan = react_native_gesture_handler_1.Gesture.Pan()
        .runOnJS(true)
        .onBegin((event) => {
        setIsSliderPressed(true);
        checkIfVideoIsPlaying(onCheckIfVideoIsPlaying);
        pauseVideo();
        progressBarInteraction(event);
    })
        .onChange((event) => {
        progressBarInteraction(event);
    })
        .onFinalize(() => {
        setIsSliderPressed(false);
        if (!wasVideoPlayingOnCheck.get()) {
            return;
        }
        playVideo();
    });
    (0, react_1.useEffect)(() => {
        if (isSliderPressed) {
            return;
        }
        progressWidth.set(getProgress(position, duration));
    }, [duration, isSliderPressed, position, progressWidth]);
    const progressBarStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({ width: `${progressWidth.get()}%` }));
    return (<react_native_gesture_handler_1.GestureDetector gesture={pan}>
            <react_native_reanimated_1.default.View style={[styles.w100, styles.h100, styles.pv2, styles.cursorPointer, styles.flex1, styles.justifyContentCenter]}>
                <react_native_reanimated_1.default.View style={styles.progressBarOutline} onLayout={onSliderLayout}>
                    <react_native_reanimated_1.default.View style={styles.progressBarFill} animatedProps={progressBarStyle}/>
                </react_native_reanimated_1.default.View>
            </react_native_reanimated_1.default.View>
        </react_native_gesture_handler_1.GestureDetector>);
}
ProgressBar.displayName = 'ProgressBar';
exports.default = ProgressBar;
