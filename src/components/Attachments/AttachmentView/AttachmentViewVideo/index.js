"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const VideoPlayer_1 = require("@components/VideoPlayer");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function AttachmentViewVideo({ source, isHovered = false, shouldUseSharedVideoElement = false, duration = 0, reportID }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<VideoPlayer_1.default url={source} shouldUseSharedVideoElement={shouldUseSharedVideoElement && !shouldUseNarrowLayout} isVideoHovered={isHovered} videoDuration={duration} style={[styles.w100, styles.h100, styles.pb5]} reportID={reportID}/>);
}
AttachmentViewVideo.displayName = 'AttachmentViewVideo';
exports.default = react_1.default.memo(AttachmentViewVideo);
