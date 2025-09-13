"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaybackContext = void 0;
exports.PlaybackContextProvider = PlaybackContextProvider;
exports.usePlaybackContext = usePlaybackContext;
const react_1 = require("react");
const ReportUtils_1 = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const playbackContextReportIDUtils_1 = require("./playbackContextReportIDUtils");
const usePlaybackContextVideoRefs_1 = require("./usePlaybackContextVideoRefs");
const Context = react_1.default.createContext(null);
exports.PlaybackContext = Context;
function PlaybackContextProvider({ children }) {
    const [currentlyPlayingURL, setCurrentlyPlayingURL] = (0, react_1.useState)(null);
    const [sharedElement, setSharedElement] = (0, react_1.useState)(null);
    const [originalParent, setOriginalParent] = (0, react_1.useState)(null);
    const [currentRouteReportID, setCurrentRouteReportID] = (0, react_1.useState)(playbackContextReportIDUtils_1.NO_REPORT_ID);
    const resetContextProperties = () => {
        setSharedElement(null);
        setOriginalParent(null);
        setCurrentlyPlayingURL(null);
        setCurrentRouteReportID(playbackContextReportIDUtils_1.NO_REPORT_ID);
    };
    const video = (0, usePlaybackContextVideoRefs_1.default)(resetContextProperties);
    const updateCurrentURLAndReportID = (0, react_1.useCallback)((url, reportID) => {
        if (!url || !reportID) {
            return;
        }
        if (currentlyPlayingURL && url !== currentlyPlayingURL) {
            video.pause();
        }
        const report = (0, ReportUtils_1.getReportOrDraftReport)(reportID);
        const isReportAChatThread = (0, ReportUtils_1.isChatThread)(report);
        let reportIDtoSet;
        if (isReportAChatThread) {
            reportIDtoSet = (0, playbackContextReportIDUtils_1.findURLInReportOrAncestorAttachments)(report, url) ?? playbackContextReportIDUtils_1.NO_REPORT_ID;
        }
        else {
            reportIDtoSet = reportID;
        }
        const routeReportID = (0, playbackContextReportIDUtils_1.getCurrentRouteReportID)(url);
        if (reportIDtoSet === routeReportID || routeReportID === playbackContextReportIDUtils_1.NO_REPORT_ID_IN_PARAMS) {
            setCurrentRouteReportID(reportIDtoSet);
        }
        setCurrentlyPlayingURL(url);
    }, [currentlyPlayingURL, video]);
    const shareVideoPlayerElements = (0, react_1.useCallback)((ref, parent, child, shouldNotAutoPlay, { shouldUseSharedVideoElement, url, reportID }) => {
        if (shouldUseSharedVideoElement || url !== currentlyPlayingURL || reportID !== currentRouteReportID) {
            return;
        }
        video.updateRef(ref);
        setOriginalParent(parent);
        setSharedElement(child);
        // Prevents autoplay when uploading the attachment
        if (!shouldNotAutoPlay) {
            video.play();
        }
    }, [currentRouteReportID, currentlyPlayingURL, video]);
    (0, react_1.useEffect)(() => {
        Navigation_1.default.isNavigationReady().then(() => {
            // This logic ensures that resetVideoPlayerData is only called when currentReportID
            // changes from one valid value (i.e., not an empty string or '-1') to another valid value.
            // This prevents the video that plays when the app opens from being interrupted when currentReportID
            // is initially empty or '-1', or when it changes from empty/'-1' to another value
            // after the report screen in the central pane is mounted on the large screen.
            const routeReportID = currentlyPlayingURL ? (0, playbackContextReportIDUtils_1.getCurrentRouteReportID)(currentlyPlayingURL) : undefined;
            const isSameReportID = routeReportID === currentRouteReportID || routeReportID === playbackContextReportIDUtils_1.NO_REPORT_ID;
            const isOnRouteWithoutReportID = !!currentlyPlayingURL && (0, playbackContextReportIDUtils_1.getCurrentRouteReportID)(currentlyPlayingURL) === playbackContextReportIDUtils_1.NO_REPORT_ID_IN_PARAMS;
            if (isSameReportID || isOnRouteWithoutReportID) {
                return;
            }
            // We call another setStatusAsync inside useLayoutEffect on the video component,
            // so we add a delay here to prevent the error from appearing.
            setTimeout(() => {
                video.resetPlayerData();
            }, 0);
        });
    }, [currentRouteReportID, currentlyPlayingURL, video, video.resetPlayerData]);
    const contextValue = (0, react_1.useMemo)(() => ({
        updateCurrentURLAndReportID,
        currentlyPlayingURL,
        currentRouteReportID: (0, playbackContextReportIDUtils_1.normalizeReportID)(currentRouteReportID),
        originalParent,
        sharedElement,
        shareVideoPlayerElements,
        setCurrentlyPlayingURL,
        currentVideoPlayerRef: video.ref,
        playVideo: video.play,
        pauseVideo: video.pause,
        checkIfVideoIsPlaying: video.isPlaying,
        videoResumeTryNumberRef: video.resumeTryNumberRef,
        resetVideoPlayerData: video.resetPlayerData,
    }), [updateCurrentURLAndReportID, currentlyPlayingURL, currentRouteReportID, originalParent, sharedElement, video, shareVideoPlayerElements]);
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
function usePlaybackContext() {
    const playbackContext = (0, react_1.useContext)(Context);
    if (!playbackContext) {
        throw new Error('usePlaybackContext must be used within a PlaybackContextProvider');
    }
    return playbackContext;
}
PlaybackContextProvider.displayName = 'PlaybackContextProvider';
