"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Visibility_1 = require("@libs/Visibility");
function usePlaybackContextVideoRefs(resetCallback) {
    const currentVideoPlayerRef = (0, react_1.useRef)(null);
    const videoResumeTryNumberRef = (0, react_1.useRef)(0);
    const playVideoPromiseRef = (0, react_1.useRef)(undefined);
    const isPlayPendingRef = (0, react_1.useRef)(false);
    const pauseVideo = (0, react_1.useCallback)(() => {
        currentVideoPlayerRef.current?.setStatusAsync?.({ shouldPlay: false });
    }, [currentVideoPlayerRef]);
    const stopVideo = (0, react_1.useCallback)(() => {
        currentVideoPlayerRef.current?.setStatusAsync?.({ shouldPlay: false, positionMillis: 0 });
    }, [currentVideoPlayerRef]);
    const playVideo = (0, react_1.useCallback)(() => {
        if (!Visibility_1.default.isVisible()) {
            isPlayPendingRef.current = true;
            return;
        }
        currentVideoPlayerRef.current?.getStatusAsync?.().then((status) => {
            const newStatus = { shouldPlay: true };
            if ('durationMillis' in status && status.durationMillis === status.positionMillis) {
                newStatus.positionMillis = 0;
            }
            playVideoPromiseRef.current = currentVideoPlayerRef.current?.setStatusAsync(newStatus).catch((error) => {
                return error;
            });
        });
    }, [currentVideoPlayerRef]);
    const unloadVideo = (0, react_1.useCallback)(() => {
        currentVideoPlayerRef.current?.unloadAsync?.();
    }, [currentVideoPlayerRef]);
    const checkIfVideoIsPlaying = (0, react_1.useCallback)((statusCallback) => {
        currentVideoPlayerRef.current?.getStatusAsync?.().then((status) => {
            statusCallback('isPlaying' in status && status.isPlaying);
        });
    }, [currentVideoPlayerRef]);
    const resetVideoPlayerData = (0, react_1.useCallback)(() => {
        // Play video is an async operation and if we call stop video before the promise is completed,
        // it will throw a console error. So, we'll wait until the promise is resolved before stopping the video.
        (playVideoPromiseRef.current ?? Promise.resolve()).then(stopVideo).finally(() => {
            videoResumeTryNumberRef.current = 0;
            resetCallback();
            unloadVideo();
            currentVideoPlayerRef.current = null;
        });
    }, [resetCallback, stopVideo, unloadVideo]);
    (0, react_1.useEffect)(() => {
        return Visibility_1.default.onVisibilityChange(() => {
            if (!Visibility_1.default.isVisible() || !isPlayPendingRef.current) {
                return;
            }
            playVideo();
            isPlayPendingRef.current = false;
        });
    }, [playVideo]);
    const updateCurrentVideoPlayerRef = (ref) => {
        currentVideoPlayerRef.current = ref;
    };
    return (0, react_1.useMemo)(() => ({
        resetPlayerData: resetVideoPlayerData,
        isPlaying: checkIfVideoIsPlaying,
        pause: pauseVideo,
        play: playVideo,
        ref: currentVideoPlayerRef,
        resumeTryNumberRef: videoResumeTryNumberRef,
        updateRef: updateCurrentVideoPlayerRef,
    }), [checkIfVideoIsPlaying, pauseVideo, playVideo, resetVideoPlayerData]);
}
exports.default = usePlaybackContextVideoRefs;
