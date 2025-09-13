"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CONST_1 = require("@src/CONST");
const SkeletonViewLines_1 = require("./SkeletonViewLines");
function ReportActionsSkeletonView({ shouldAnimate = true, possibleVisibleContentItems = 0 }) {
    const contentItems = possibleVisibleContentItems || Math.ceil(react_native_1.Dimensions.get('screen').height / CONST_1.default.CHAT_SKELETON_VIEW.AVERAGE_ROW_HEIGHT);
    const skeletonViewLines = [];
    for (let index = 0; index < contentItems; index++) {
        const iconIndex = (index + 1) % 4;
        switch (iconIndex) {
            case 2:
                skeletonViewLines.push(<SkeletonViewLines_1.default shouldAnimate={shouldAnimate} numberOfRows={2} key={`skeletonViewLines${index}`}/>);
                break;
            case 0:
                skeletonViewLines.push(<SkeletonViewLines_1.default shouldAnimate={shouldAnimate} numberOfRows={3} key={`skeletonViewLines${index}`}/>);
                break;
            default:
                skeletonViewLines.push(<SkeletonViewLines_1.default shouldAnimate={shouldAnimate} numberOfRows={1} key={`skeletonViewLines${index}`}/>);
        }
    }
    return <react_native_1.View testID="ReportActionsSkeletonView">{skeletonViewLines}</react_native_1.View>;
}
ReportActionsSkeletonView.displayName = 'ReportActionsSkeletonView';
exports.default = ReportActionsSkeletonView;
