"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Expensicons = require("@components/Icon/Expensicons");
const SearchContext_1 = require("@components/Search/SearchContext");
const VideoPlayer_1 = require("@components/VideoPlayer");
const IconButton_1 = require("@components/VideoPlayer/IconButton");
const PlaybackContext_1 = require("@components/VideoPlayerContexts/PlaybackContext");
const useCheckIfRouteHasRemainedUnchanged_1 = require("@hooks/useCheckIfRouteHasRemainedUnchanged");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useThumbnailDimensions_1 = require("@hooks/useThumbnailDimensions");
const Navigation_1 = require("@navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
const VideoPlayerThumbnail_1 = require("./VideoPlayerThumbnail");
const isOnAttachmentRoute = () => Navigation_1.default.getActiveRouteWithoutParams() === `/${ROUTES_1.default.ATTACHMENTS.route}`;
function VideoPlayerPreview({ videoUrl, thumbnailUrl, reportID, fileName, videoDimensions, videoDuration, onShowModalPress, isDeleted }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { currentlyPlayingURL, currentRouteReportID, updateCurrentURLAndReportID } = (0, PlaybackContext_1.usePlaybackContext)();
    /* This needs to be isSmallScreenWidth because we want to be able to play video in chat (not in attachment modal) when preview is inside an RHP */
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [isThumbnail, setIsThumbnail] = (0, react_1.useState)(true);
    const [measuredDimensions, setMeasuredDimensions] = (0, react_1.useState)(videoDimensions);
    const { thumbnailDimensionsStyles } = (0, useThumbnailDimensions_1.default)(measuredDimensions.width, measuredDimensions.height);
    const { isOnSearch } = (0, SearchContext_1.useSearchContext)();
    const navigation = (0, native_1.useNavigation)();
    // We want to play the video only when the user is on the page where it was initially rendered
    const doesUserRemainOnFirstRenderRoute = (0, useCheckIfRouteHasRemainedUnchanged_1.default)(videoUrl);
    // `onVideoLoaded` is passed to VideoPlayerPreview's `Video` element which is displayed only on web.
    // VideoReadyForDisplayEvent type is lacking srcElement, that's why it's added here
    const onVideoLoaded = (event) => {
        setMeasuredDimensions({ width: event.srcElement.videoWidth, height: event.srcElement.videoHeight });
    };
    const handleOnPress = () => {
        updateCurrentURLAndReportID(videoUrl, reportID);
        if (isSmallScreenWidth) {
            onShowModalPress();
        }
    };
    (0, react_1.useEffect)(() => {
        return navigation.addListener('blur', () => !isOnAttachmentRoute() && setIsThumbnail(true));
    }, [navigation]);
    (0, react_1.useEffect)(() => {
        const isFocused = doesUserRemainOnFirstRenderRoute();
        if (videoUrl !== currentlyPlayingURL || reportID !== currentRouteReportID || !isFocused) {
            return;
        }
        setIsThumbnail(false);
    }, [currentlyPlayingURL, currentRouteReportID, updateCurrentURLAndReportID, videoUrl, reportID, doesUserRemainOnFirstRenderRoute, isOnSearch]);
    return (<react_native_1.View style={[styles.webViewStyles.tagStyles.video, thumbnailDimensionsStyles]}>
            {isSmallScreenWidth || isThumbnail || isDeleted ? (<VideoPlayerThumbnail_1.default thumbnailUrl={thumbnailUrl} onPress={handleOnPress} accessibilityLabel={fileName} isDeleted={isDeleted}/>) : (<react_native_1.View style={styles.flex1}>
                    <VideoPlayer_1.default url={videoUrl} onVideoLoaded={onVideoLoaded} videoDuration={videoDuration} shouldUseSmallVideoControls style={[styles.w100, styles.h100]} isPreview videoPlayerStyle={styles.videoPlayerPreview} reportID={reportID}/>
                    <react_native_1.View style={[styles.pAbsolute, styles.w100]}>
                        <IconButton_1.default src={Expensicons.Expand} style={[styles.videoExpandButton]} tooltipText={translate('videoPlayer.expand')} onPress={onShowModalPress} small/>
                    </react_native_1.View>
                </react_native_1.View>)}
        </react_native_1.View>);
}
VideoPlayerPreview.displayName = 'VideoPlayerPreview';
exports.default = VideoPlayerPreview;
