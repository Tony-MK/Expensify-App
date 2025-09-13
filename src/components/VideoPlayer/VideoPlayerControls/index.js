"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const IconButton_1 = require("@components/VideoPlayer/IconButton");
const utils_1 = require("@components/VideoPlayer/utils");
const FullScreenContext_1 = require("@components/VideoPlayerContexts/FullScreenContext");
const PlaybackContext_1 = require("@components/VideoPlayerContexts/PlaybackContext");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const ProgressBar_1 = require("./ProgressBar");
const VolumeButton_1 = require("./VolumeButton");
function VideoPlayerControls({ duration, position, url, videoPlayerRef, isPlaying, small = false, style, showPopoverMenu, togglePlayCurrentVideo, controlsStatus = CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.SHOW, reportID, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { updateCurrentURLAndReportID } = (0, PlaybackContext_1.usePlaybackContext)();
    const { isFullScreenRef } = (0, FullScreenContext_1.useFullScreenContext)();
    const [shouldShowTime, setShouldShowTime] = (0, react_1.useState)(false);
    const iconSpacing = small ? styles.mr3 : styles.mr4;
    const onLayout = (event) => {
        setShouldShowTime(event.nativeEvent.layout.width > CONST_1.default.VIDEO_PLAYER.HIDE_TIME_TEXT_WIDTH);
    };
    const enterFullScreenMode = (0, react_1.useCallback)(() => {
        // eslint-disable-next-line react-compiler/react-compiler
        isFullScreenRef.current = true;
        updateCurrentURLAndReportID(url, reportID);
        videoPlayerRef.current?.presentFullscreenPlayer();
    }, [isFullScreenRef, reportID, updateCurrentURLAndReportID, url, videoPlayerRef]);
    const seekPosition = (0, react_1.useCallback)((newPosition) => {
        videoPlayerRef.current?.setStatusAsync({ positionMillis: newPosition });
    }, [videoPlayerRef]);
    const durationFormatted = (0, react_1.useMemo)(() => (0, utils_1.convertMillisecondsToTime)(duration), [duration]);
    return (<react_native_reanimated_1.default.View style={[
            styles.videoPlayerControlsContainer,
            small ? [styles.p2, styles.pb0] : [styles.p3, styles.pb1],
            controlsStatus === CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.VOLUME_ONLY && [styles.pt2, styles.pb2],
            style,
        ]} onLayout={onLayout}>
            {controlsStatus === CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.SHOW && (<react_native_1.View style={[styles.videoPlayerControlsButtonContainer, !small && styles.mb4]}>
                    <react_native_1.View style={[styles.videoPlayerControlsRow]}>
                        <IconButton_1.default src={isPlaying ? Expensicons.Pause : Expensicons.Play} tooltipText={isPlaying ? translate('videoPlayer.pause') : translate('videoPlayer.play')} onPress={togglePlayCurrentVideo} style={styles.mr2} small={small}/>
                        {shouldShowTime && (<react_native_1.View style={[styles.videoPlayerControlsRow]}>
                                <Text_1.default style={[styles.videoPlayerText, styles.videoPlayerTimeComponentWidth]}>{(0, utils_1.convertMillisecondsToTime)(position)}</Text_1.default>
                                <Text_1.default style={[styles.videoPlayerText]}>/</Text_1.default>
                                <Text_1.default style={[styles.videoPlayerText, styles.videoPlayerTimeComponentWidth]}>{durationFormatted}</Text_1.default>
                            </react_native_1.View>)}
                    </react_native_1.View>
                    <react_native_1.View style={[styles.videoPlayerControlsRow]}>
                        <VolumeButton_1.default style={iconSpacing}/>
                        <IconButton_1.default src={Expensicons.Fullscreen} tooltipText={translate('videoPlayer.fullscreen')} onPress={enterFullScreenMode} style={iconSpacing} small={small}/>
                        <IconButton_1.default src={Expensicons.ThreeDots} tooltipText={translate('common.more')} onPress={showPopoverMenu} small={small}/>
                    </react_native_1.View>
                </react_native_1.View>)}
            <react_native_1.View style={styles.videoPlayerControlsRow}>
                <react_native_1.View style={[styles.flex1]}>
                    <ProgressBar_1.default duration={duration} position={position} seekPosition={seekPosition}/>
                </react_native_1.View>
                {controlsStatus === CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.VOLUME_ONLY && <VolumeButton_1.default style={styles.ml3}/>}
            </react_native_1.View>
        </react_native_reanimated_1.default.View>);
}
VideoPlayerControls.displayName = 'VideoPlayerControls';
exports.default = VideoPlayerControls;
