"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const uniqueID_1 = require("@components/VideoPlayerContexts/PlaybackContext/uniqueID");
const BaseVideoPlayer_1 = require("./BaseVideoPlayer");
function VideoPlayer(props) {
    const { fakeReportID } = (0, uniqueID_1.default)();
    const { reportID } = props;
    return (<BaseVideoPlayer_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} reportID={reportID ?? fakeReportID}/>);
}
VideoPlayer.displayName = 'VideoPlayer';
exports.default = VideoPlayer;
