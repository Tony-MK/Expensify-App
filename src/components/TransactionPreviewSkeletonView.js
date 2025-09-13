"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const SkeletonViewContentLoader_1 = require("./SkeletonViewContentLoader");
function TransactionPreviewSkeletonView({ transactionPreviewWidth }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const height = variables_1.default.transactionPreviewSkeletonHeight;
    const widthOfTheLeftSkeleton = 120;
    const widthOfTheRightSkeleton = 68;
    return (<react_native_1.View style={[styles.p4, styles.mtn1, styles.justifyContentBetween, { width: transactionPreviewWidth }]}>
            <SkeletonViewContentLoader_1.default testID={TransactionPreviewSkeletonView.displayName} animate width={widthOfTheLeftSkeleton} height={height} backgroundColor={theme.skeletonLHNIn} foregroundColor={theme.skeletonLHNOut}>
                <react_native_svg_1.Rect x="0" y="4" width="64" height="8"/>
                <react_native_svg_1.Rect x="0" y="24" width={widthOfTheLeftSkeleton} height="20"/>
                <react_native_svg_1.Rect x="0" y="54.75" width="80" height="7"/>
            </SkeletonViewContentLoader_1.default>
            <react_native_1.View style={[styles.r0, styles.b0, styles.p4, styles.mtn1, styles.pAbsolute]}>
                <SkeletonViewContentLoader_1.default width={widthOfTheRightSkeleton} height={height} foregroundColor={theme.skeletonLHNOut} backgroundColor={theme.skeletonLHNIn}>
                    <react_native_svg_1.Rect x="0" y="24" width={widthOfTheRightSkeleton} height="20"/>
                </SkeletonViewContentLoader_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
TransactionPreviewSkeletonView.displayName = 'TransactionPreviewSkeletonView';
exports.default = TransactionPreviewSkeletonView;
