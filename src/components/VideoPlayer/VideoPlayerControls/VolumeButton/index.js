"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const Hoverable_1 = require("@components/Hoverable");
const Expensicons = require("@components/Icon/Expensicons");
const IconButton_1 = require("@components/VideoPlayer/IconButton");
const VolumeContext_1 = require("@components/VideoPlayerContexts/VolumeContext");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NumberUtils = require("@libs/NumberUtils");
const getVolumeIcon = (volume) => {
    if (volume === 0) {
        return Expensicons.Mute;
    }
    if (volume <= 0.5) {
        return Expensicons.VolumeLow;
    }
    return Expensicons.VolumeHigh;
};
function VolumeButton({ style, small = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { updateVolume, volume, toggleMute } = (0, VolumeContext_1.useVolumeContext)();
    const [sliderHeight, setSliderHeight] = (0, react_1.useState)(1);
    const [volumeIcon, setVolumeIcon] = (0, react_1.useState)({ icon: getVolumeIcon(volume.get()) });
    const [isSliderBeingUsed, setIsSliderBeingUsed] = (0, react_1.useState)(false);
    const onSliderLayout = (0, react_1.useCallback)((event) => {
        setSliderHeight(event.nativeEvent.layout.height);
    }, []);
    const changeVolumeOnPan = (0, react_1.useCallback)((event) => {
        const val = NumberUtils.roundToTwoDecimalPlaces(1 - event.y / sliderHeight);
        volume.set(NumberUtils.clamp(val, 0, 1));
    }, [sliderHeight, volume]);
    const pan = react_native_gesture_handler_1.Gesture.Pan()
        .onBegin((event) => {
        (0, react_native_reanimated_1.runOnJS)(setIsSliderBeingUsed)(true);
        changeVolumeOnPan(event);
    })
        .onChange((event) => {
        changeVolumeOnPan(event);
    })
        .onFinalize(() => {
        (0, react_native_reanimated_1.runOnJS)(setIsSliderBeingUsed)(false);
    });
    const progressBarStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({ height: `${volume.get() * 100}%` }));
    const updateIcon = (0, react_1.useCallback)((vol) => {
        setVolumeIcon({ icon: getVolumeIcon(vol) });
    }, []);
    (0, react_native_reanimated_1.useDerivedValue)(() => {
        (0, react_native_reanimated_1.runOnJS)(updateVolume)(volume.get());
        (0, react_native_reanimated_1.runOnJS)(updateIcon)(volume.get());
    }, [volume]);
    return (<Hoverable_1.default>
            {(isHovered) => (<react_native_reanimated_1.default.View style={[isSliderBeingUsed ? styles.cursorGrabbing : styles.cursorPointer, style]}>
                    {(isSliderBeingUsed || isHovered) && (<react_native_1.View style={[styles.volumeSliderContainer]}>
                            <react_native_gesture_handler_1.GestureDetector gesture={pan}>
                                <react_native_1.View style={styles.ph2}>
                                    <react_native_1.View style={[styles.volumeSliderOverlay]} onLayout={onSliderLayout}>
                                        <react_native_1.View style={styles.volumeSliderThumb}/>
                                        <react_native_reanimated_1.default.View style={[styles.volumeSliderFill, progressBarStyle]}/>
                                    </react_native_1.View>
                                </react_native_1.View>
                            </react_native_gesture_handler_1.GestureDetector>
                        </react_native_1.View>)}

                    <IconButton_1.default tooltipText={volume.get() === 0 ? translate('videoPlayer.unmute') : translate('videoPlayer.mute')} onPress={toggleMute} src={volumeIcon.icon} small={small} shouldForceRenderingTooltipBelow/>
                </react_native_reanimated_1.default.View>)}
        </Hoverable_1.default>);
}
VolumeButton.displayName = 'VolumeButton';
exports.default = (0, react_1.memo)(VolumeButton);
