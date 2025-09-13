"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_av_1 = require("expo-av");
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const AttachmentOfflineIndicator_1 = require("@components/AttachmentOfflineIndicator");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const Hoverable_1 = require("@components/Hoverable");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const FullScreenContext_1 = require("@components/VideoPlayerContexts/FullScreenContext");
const PlaybackContext_1 = require("@components/VideoPlayerContexts/PlaybackContext");
const VideoPopoverMenuContext_1 = require("@components/VideoPlayerContexts/VideoPopoverMenuContext");
const VolumeContext_1 = require("@components/VideoPlayerContexts/VolumeContext");
const VideoPopoverMenu_1 = require("@components/VideoPopoverMenu");
const useNetwork_1 = require("@hooks/useNetwork");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const Browser_1 = require("@libs/Browser");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const CONST_1 = require("@src/CONST");
const shouldReplayVideo_1 = require("./shouldReplayVideo");
const useHandleNativeVideoControls_1 = require("./useHandleNativeVideoControls");
const VideoUtils = require("./utils");
const VideoErrorIndicator_1 = require("./VideoErrorIndicator");
const VideoPlayerControls_1 = require("./VideoPlayerControls");
function BaseVideoPlayer({ url, resizeMode = expo_av_1.ResizeMode.CONTAIN, onVideoLoaded, isLooping = false, style, videoPlayerStyle, videoStyle, videoControlsStyle, videoDuration = 0, controlsStatus = CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.SHOW, shouldUseSharedVideoElement = false, shouldUseSmallVideoControls = false, onPlaybackStatusUpdate, onFullscreenUpdate, shouldPlay, 
// TODO: investigate what is the root cause of the bug with unexpected video switching
// isVideoHovered caused a bug with unexpected video switching. We are investigating the root cause of the issue,
// but current workaround is just not to use it here for now. This causes not displaying the video controls when
// user hovers the mouse over the carousel arrows, but this UI bug feels much less troublesome for now.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
isVideoHovered = false, isPreview, reportID, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { pauseVideo, playVideo, currentlyPlayingURL, sharedElement, originalParent, shareVideoPlayerElements, currentVideoPlayerRef, updateCurrentURLAndReportID, videoResumeTryNumberRef, setCurrentlyPlayingURL, } = (0, PlaybackContext_1.usePlaybackContext)();
    const { isFullScreenRef } = (0, FullScreenContext_1.useFullScreenContext)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [duration, setDuration] = (0, react_1.useState)(videoDuration * 1000);
    const [position, setPosition] = (0, react_1.useState)(0);
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [isEnded, setIsEnded] = (0, react_1.useState)(false);
    const [isBuffering, setIsBuffering] = (0, react_1.useState)(true);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    // we add "#t=0.001" at the end of the URL to skip first millisecond of the video and always be able to show proper video preview when video is paused at the beginning
    const [sourceURL] = (0, react_1.useState)(() => VideoUtils.addSkipTimeTagToURL(url.includes('blob:') || url.includes('file:///') ? url : (0, addEncryptedAuthTokenToURL_1.default)(url), 0.001));
    const [isPopoverVisible, setIsPopoverVisible] = (0, react_1.useState)(false);
    const [popoverAnchorPosition, setPopoverAnchorPosition] = (0, react_1.useState)({ horizontal: 0, vertical: 0 });
    const [controlStatusState, setControlStatusState] = (0, react_1.useState)(controlsStatus);
    const controlsOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const controlsAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        opacity: controlsOpacity.get(),
    }));
    const videoPlayerRef = (0, react_1.useRef)(null);
    const videoPlayerElementParentRef = (0, react_1.useRef)(null);
    const videoPlayerElementRef = (0, react_1.useRef)(null);
    const sharedVideoPlayerParentRef = (0, react_1.useRef)(null);
    const isReadyForDisplayRef = (0, react_1.useRef)(false);
    const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    const isCurrentlyURLSet = currentlyPlayingURL === url;
    const isUploading = CONST_1.default.ATTACHMENT_LOCAL_URL_PREFIX.some((prefix) => url.startsWith(prefix));
    const videoStateRef = (0, react_1.useRef)(null);
    const { updateVolume, lastNonZeroVolume } = (0, VolumeContext_1.useVolumeContext)();
    (0, useHandleNativeVideoControls_1.default)({
        videoPlayerRef,
        isOffline,
        isLocalFile: isUploading,
    });
    const { videoPopoverMenuPlayerRef, currentPlaybackSpeed, setCurrentPlaybackSpeed, setSource: setPopoverMenuSource } = (0, VideoPopoverMenuContext_1.useVideoPopoverMenuContext)();
    const { source } = videoPopoverMenuPlayerRef.current?.props ?? {};
    const shouldUseNewRate = typeof source === 'number' || !source || source.uri !== sourceURL;
    const togglePlayCurrentVideo = (0, react_1.useCallback)(() => {
        setIsEnded(false);
        videoResumeTryNumberRef.current = 0;
        if (!isCurrentlyURLSet) {
            updateCurrentURLAndReportID(url, reportID);
        }
        else if (isPlaying) {
            pauseVideo();
        }
        else {
            playVideo();
        }
    }, [isCurrentlyURLSet, isPlaying, pauseVideo, playVideo, reportID, updateCurrentURLAndReportID, url, videoResumeTryNumberRef]);
    const hideControl = (0, react_1.useCallback)(() => {
        if (isEnded) {
            return;
        }
        controlsOpacity.set((0, react_native_reanimated_1.withTiming)(0, { duration: 500 }, () => (0, react_native_reanimated_1.runOnJS)(setControlStatusState)(CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.HIDE)));
    }, [controlsOpacity, isEnded]);
    const debouncedHideControl = (0, react_1.useMemo)(() => (0, debounce_1.default)(hideControl, 1500), [hideControl]);
    (0, react_1.useEffect)(() => {
        if (canUseTouchScreen) {
            return;
        }
        // If the device cannot use touch screen, always set the control status as 'show'.
        // Then if user hover over the video, controls is shown.
        setControlStatusState(CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.SHOW);
    }, [canUseTouchScreen]);
    (0, react_1.useEffect)(() => {
        // We only auto hide the control if the device can use touch screen.
        if (!canUseTouchScreen) {
            return;
        }
        if (controlStatusState !== CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.SHOW) {
            return;
        }
        if (!isPlaying || isPopoverVisible) {
            debouncedHideControl.cancel();
            return;
        }
        debouncedHideControl();
    }, [isPlaying, debouncedHideControl, controlStatusState, isPopoverVisible, canUseTouchScreen]);
    const stopWheelPropagation = (0, react_1.useCallback)((ev) => ev.stopPropagation(), []);
    const toggleControl = (0, react_1.useCallback)(() => {
        if (controlStatusState === CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.SHOW) {
            hideControl();
            return;
        }
        setControlStatusState(CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.SHOW);
        controlsOpacity.set(1);
    }, [controlStatusState, controlsOpacity, hideControl]);
    const showPopoverMenu = (event) => {
        videoPopoverMenuPlayerRef.current = videoPlayerRef.current;
        videoPlayerRef.current?.getStatusAsync().then((status) => {
            if (!('rate' in status && status.rate)) {
                return;
            }
            if (shouldUseNewRate) {
                setCurrentPlaybackSpeed(status.rate);
            }
            setIsPopoverVisible(true);
        });
        setPopoverMenuSource(url);
        if (!event || !('nativeEvent' in event)) {
            return;
        }
        setPopoverAnchorPosition({ horizontal: event.nativeEvent.pageX, vertical: event.nativeEvent.pageY });
    };
    const hidePopoverMenu = () => {
        setIsPopoverVisible(false);
    };
    // fix for iOS mWeb: preventing iOS native player default behavior from pausing the video when exiting fullscreen
    const preventPausingWhenExitingFullscreen = (0, react_1.useCallback)((isVideoPlaying) => {
        if (videoResumeTryNumberRef.current === 0 || isVideoPlaying) {
            return;
        }
        if (videoResumeTryNumberRef.current === 1) {
            playVideo();
        }
        // eslint-disable-next-line react-compiler/react-compiler
        videoResumeTryNumberRef.current -= 1;
    }, [playVideo, videoResumeTryNumberRef]);
    const prevIsMuted = (0, react_native_reanimated_1.useSharedValue)(true);
    const prevVolume = (0, react_native_reanimated_1.useSharedValue)(0);
    const handlePlaybackStatusUpdate = (0, react_1.useCallback)((status) => {
        if (!status.isLoaded) {
            preventPausingWhenExitingFullscreen(false);
            setIsPlaying(false);
            setIsLoading(true); // when video is ready to display duration is not NaN
            setIsBuffering(false);
            setDuration(videoDuration * 1000);
            setPosition(0);
            onPlaybackStatusUpdate?.(status);
            return;
        }
        if (status.didJustFinish) {
            setIsEnded(status.didJustFinish && !status.isLooping);
            setControlStatusState(CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.SHOW);
            controlsOpacity.set(1);
        }
        else if (status.isPlaying && isEnded) {
            setIsEnded(false);
        }
        // These two conditions are essential for the mute and unmute functionality to work properly during
        // fullscreen playback on the web
        if (prevIsMuted.get() && prevVolume.get() === 0 && !status.isMuted && status.volume === 0) {
            updateVolume(lastNonZeroVolume.get());
        }
        if (isFullScreenRef.current && prevVolume.get() !== 0 && status.volume === 0 && !status.isMuted) {
            currentVideoPlayerRef.current?.setStatusAsync({ isMuted: true });
        }
        prevIsMuted.set(status.isMuted);
        prevVolume.set(status.volume);
        const isVideoPlaying = status.isPlaying;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const currentDuration = status.durationMillis || videoDuration * 1000;
        const currentPosition = status.positionMillis || 0;
        if ((0, shouldReplayVideo_1.default)(status, isVideoPlaying, currentDuration, currentPosition) && !isEnded) {
            videoPlayerRef.current?.setStatusAsync({ positionMillis: 0, shouldPlay: true });
        }
        preventPausingWhenExitingFullscreen(isVideoPlaying);
        setIsPlaying(isVideoPlaying);
        setIsLoading(Number.isNaN(status.durationMillis)); // when video is ready to display duration is not NaN
        setIsBuffering(status.isBuffering);
        setDuration(currentDuration);
        setPosition(currentPosition);
        videoStateRef.current = status;
        onPlaybackStatusUpdate?.(status);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want to trigger this when isPlaying changes because isPlaying is only used inside shouldReplayVideo
    [onPlaybackStatusUpdate, preventPausingWhenExitingFullscreen, videoDuration, isEnded]);
    const handleFullscreenUpdate = (0, react_1.useCallback)((event) => {
        onFullscreenUpdate?.(event);
        if (event.fullscreenUpdate === expo_av_1.VideoFullscreenUpdate.PLAYER_DID_PRESENT) {
            // When the video is in fullscreen, we don't want the scroll to be captured by the InvertedFlatList of report screen.
            // This will also allow the user to scroll the video playback speed.
            if (videoPlayerElementParentRef.current && 'addEventListener' in videoPlayerElementParentRef.current) {
                videoPlayerElementParentRef.current.addEventListener('wheel', stopWheelPropagation);
            }
        }
        if (event.fullscreenUpdate === expo_av_1.VideoFullscreenUpdate.PLAYER_DID_DISMISS) {
            if (videoPlayerElementParentRef.current && 'removeEventListener' in videoPlayerElementParentRef.current) {
                videoPlayerElementParentRef.current.removeEventListener('wheel', stopWheelPropagation);
            }
            isFullScreenRef.current = false;
            // Sync volume updates in full screen mode after leaving it
            currentVideoPlayerRef.current?.getStatusAsync?.().then((status) => {
                if (!('isMuted' in status)) {
                    return;
                }
                updateVolume(status.isMuted ? 0 : status.volume || 1);
            });
            // we need to use video state ref to check if video is playing, to catch proper state after exiting fullscreen
            // and also fix a bug with fullscreen mode dismissing when handleFullscreenUpdate function changes
            if (videoStateRef.current && (!('isPlaying' in videoStateRef.current) || videoStateRef.current.isPlaying)) {
                pauseVideo();
                playVideo();
                videoResumeTryNumberRef.current = 3;
            }
        }
    }, [isFullScreenRef, onFullscreenUpdate, pauseVideo, playVideo, videoResumeTryNumberRef, updateVolume, currentVideoPlayerRef, stopWheelPropagation]);
    const bindFunctions = (0, react_1.useCallback)(() => {
        const currentVideoPlayer = currentVideoPlayerRef.current;
        if (!currentVideoPlayer) {
            return;
        }
        currentVideoPlayer._onPlaybackStatusUpdate = handlePlaybackStatusUpdate;
        currentVideoPlayer._onFullscreenUpdate = handleFullscreenUpdate;
        // update states after binding
        currentVideoPlayer.getStatusAsync().then((status) => {
            handlePlaybackStatusUpdate(status);
        });
    }, [currentVideoPlayerRef, handleFullscreenUpdate, handlePlaybackStatusUpdate]);
    // use `useLayoutEffect` instead of `useEffect` because ref is null when unmount in `useEffect` hook
    // ref url: https://reactjs.org/blog/2020/08/10/react-v17-rc.html#effect-cleanup-timing
    (0, react_1.useLayoutEffect)(() => () => {
        if (shouldUseSharedVideoElement || videoPlayerRef.current !== currentVideoPlayerRef.current) {
            return;
        }
        currentVideoPlayerRef.current?.setStatusAsync?.({ shouldPlay: false, positionMillis: 0 }).then(() => {
            currentVideoPlayerRef.current = null;
        });
    }, [currentVideoPlayerRef, shouldUseSharedVideoElement]);
    (0, react_1.useEffect)(() => {
        if (!isUploading || !videoPlayerRef.current) {
            return;
        }
        // If we are uploading a new video, we want to pause previous playing video and immediately set the video player ref.
        if (currentVideoPlayerRef.current) {
            pauseVideo();
        }
        currentVideoPlayerRef.current = videoPlayerRef.current;
    }, [url, currentVideoPlayerRef, isUploading, pauseVideo]);
    const isCurrentlyURLSetRef = (0, react_1.useRef)(undefined);
    isCurrentlyURLSetRef.current = isCurrentlyURLSet;
    (0, react_1.useEffect)(() => () => {
        if (shouldUseSharedVideoElement || !isCurrentlyURLSetRef.current) {
            return;
        }
        setCurrentlyPlayingURL(null);
    }, [setCurrentlyPlayingURL, shouldUseSharedVideoElement]);
    // update shared video elements
    (0, react_1.useEffect)(() => {
        // On mobile safari, we need to auto-play when sharing video element here
        shareVideoPlayerElements(videoPlayerRef.current, videoPlayerElementParentRef.current, videoPlayerElementRef.current, isUploading || isFullScreenRef.current || (!isReadyForDisplayRef.current && !(0, Browser_1.isMobileSafari)()), { shouldUseSharedVideoElement, url, reportID });
    }, [currentlyPlayingURL, shouldUseSharedVideoElement, shareVideoPlayerElements, url, isUploading, isFullScreenRef, reportID]);
    // Call bindFunctions() through the refs to avoid adding it to the dependency array of the DOM mutation effect, as doing so would change the DOM when the functions update.
    const bindFunctionsRef = (0, react_1.useRef)(null);
    const shouldBindFunctionsRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        bindFunctionsRef.current = bindFunctions;
        if (shouldBindFunctionsRef.current) {
            bindFunctions();
        }
    }, [bindFunctions]);
    // append shared video element to new parent (used for example in attachment modal)
    (0, react_1.useEffect)(() => {
        shouldBindFunctionsRef.current = false;
        if (url !== currentlyPlayingURL || !sharedElement || isFullScreenRef.current) {
            return;
        }
        const newParentRef = sharedVideoPlayerParentRef.current;
        if (!shouldUseSharedVideoElement) {
            if (newParentRef && 'childNodes' in newParentRef && newParentRef.childNodes[0]) {
                newParentRef.childNodes[0]?.remove();
            }
            return;
        }
        videoPlayerRef.current = currentVideoPlayerRef.current;
        if (currentlyPlayingURL === url && newParentRef && 'appendChild' in newParentRef) {
            newParentRef.appendChild(sharedElement);
            bindFunctionsRef.current?.();
            shouldBindFunctionsRef.current = true;
        }
        return () => {
            if (!originalParent || !('appendChild' in originalParent)) {
                return;
            }
            originalParent.appendChild(sharedElement);
            if (!newParentRef || !('childNodes' in newParentRef)) {
                return;
            }
            newParentRef.childNodes[0]?.remove();
        };
    }, [currentVideoPlayerRef, currentlyPlayingURL, isFullScreenRef, originalParent, reportID, sharedElement, shouldUseSharedVideoElement, url]);
    (0, react_1.useEffect)(() => {
        if (!shouldPlay) {
            return;
        }
        updateCurrentURLAndReportID(url, reportID);
    }, [reportID, shouldPlay, updateCurrentURLAndReportID, url]);
    (0, react_1.useEffect)(() => {
        videoPlayerRef.current?.setStatusAsync({ isMuted: true });
    }, []);
    return (<>
            {/* We need to wrap the video component in a component that will catch unhandled pointer events. Otherwise, these
        events will bubble up the tree, and it will cause unexpected press behavior. */}
            <PressableWithoutFeedback_1.default accessible={false} style={[styles.cursorDefault, style]}>
                <Hoverable_1.default shouldFreezeCapture={isPopoverVisible}>
                    {(isHovered) => (<react_native_1.View style={[styles.w100, styles.h100]}>
                            <PressableWithoutFeedback_1.default accessibilityRole="button" accessible={false} onPress={() => {
                if (isFullScreenRef.current) {
                    return;
                }
                if (!canUseTouchScreen) {
                    togglePlayCurrentVideo();
                    return;
                }
                toggleControl();
            }} style={[styles.flex1, styles.noSelect]}>
                                {shouldUseSharedVideoElement ? (<>
                                        <react_native_1.View ref={sharedVideoPlayerParentRef} style={[styles.flex1]}/>
                                        {/* We are adding transparent absolute View between appended video component and control buttons to enable
            catching onMouse events from Attachment Carousel. Due to late appending React doesn't handle
            element's events properly. */}
                                        <react_native_1.View style={[styles.w100, styles.h100, styles.pAbsolute]}/>
                                    </>) : (<react_native_1.View fsClass={CONST_1.default.FULLSTORY.CLASS.EXCLUDE} style={styles.flex1} ref={(el) => {
                    if (!el) {
                        return;
                    }
                    const elHTML = el;
                    if ('childNodes' in elHTML && elHTML.childNodes[0]) {
                        videoPlayerElementRef.current = elHTML.childNodes[0];
                    }
                    videoPlayerElementParentRef.current = el;
                }}>
                                        <expo_av_1.Video ref={videoPlayerRef} style={[styles.w100, styles.h100, videoPlayerStyle]} videoStyle={[styles.w100, styles.h100, videoStyle]} source={{
                    // if video is loading and is offline, we want to change uri to "" to
                    // reset the video player after connection is back
                    uri: !isLoading || (isLoading && !isOffline) ? sourceURL : '',
                }} shouldPlay={shouldPlay} useNativeControls={false} resizeMode={resizeMode} isLooping={isLooping} onReadyForDisplay={(e) => {
                    isReadyForDisplayRef.current = true;
                    onVideoLoaded?.(e);
                    if (shouldUseNewRate) {
                        return;
                    }
                    videoPlayerRef.current?.setStatusAsync?.({ rate: currentPlaybackSpeed });
                }} onLoad={() => {
                    if (hasError) {
                        setHasError(false);
                    }
                    if (!isCurrentlyURLSet || isUploading) {
                        return;
                    }
                    playVideo();
                }} onPlaybackStatusUpdate={handlePlaybackStatusUpdate} onFullscreenUpdate={handleFullscreenUpdate} onError={() => {
                    // No need to set hasError while offline, since the offline indicator is already shown.
                    // Once the user reconnects, if the video is unsupported, the error will be triggered again.
                    if (isOffline) {
                        return;
                    }
                    setHasError(true);
                }} testID={CONST_1.default.VIDEO_PLAYER_TEST_ID}/>
                                    </react_native_1.View>)}
                            </PressableWithoutFeedback_1.default>
                            {hasError && !isBuffering && !isOffline && <VideoErrorIndicator_1.default isPreview={isPreview}/>}
                            {((isLoading && !isOffline && !hasError) || (isBuffering && !isPlaying && !hasError)) && (<FullscreenLoadingIndicator_1.default style={[styles.opacity1, styles.bgTransparent]}/>)}
                            {isLoading && (isOffline || !isBuffering) && <AttachmentOfflineIndicator_1.default isPreview={isPreview}/>}
                            {controlStatusState !== CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.HIDE && !isLoading && (isPopoverVisible || isHovered || canUseTouchScreen || isEnded) && (<VideoPlayerControls_1.default duration={duration} position={position} url={url} videoPlayerRef={videoPlayerRef} isPlaying={isPlaying} small={shouldUseSmallVideoControls} style={[videoControlsStyle, controlsAnimatedStyle]} togglePlayCurrentVideo={togglePlayCurrentVideo} controlsStatus={controlStatusState} showPopoverMenu={showPopoverMenu} reportID={reportID}/>)}
                        </react_native_1.View>)}
                </Hoverable_1.default>
            </PressableWithoutFeedback_1.default>
            <VideoPopoverMenu_1.default isPopoverVisible={isPopoverVisible} hidePopover={hidePopoverMenu} anchorPosition={popoverAnchorPosition}/>
        </>);
}
BaseVideoPlayer.displayName = 'BaseVideoPlayer';
exports.default = BaseVideoPlayer;
