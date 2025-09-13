"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SkeletonViewContentLoader_1 = require("./SkeletonViewContentLoader");
function MoneyReportHeaderStatusBarSkeleton() {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    return (<react_native_1.View style={[styles.dFlex, styles.flexRow, styles.overflowHidden, styles.w100, { height: 28 }]}>
            <SkeletonViewContentLoader_1.default height={28} backgroundColor={theme.skeletonLHNIn} foregroundColor={theme.skeletonLHNOut}>
                <react_native_svg_1.Rect x={0} y={12} width={16} height={8}/>
                <react_native_svg_1.Rect x={24} y={12} width={120} height={8}/>
            </SkeletonViewContentLoader_1.default>
        </react_native_1.View>);
}
MoneyReportHeaderStatusBarSkeleton.displayName = 'MoneyReportHeaderStatusBarSkeleton';
exports.default = MoneyReportHeaderStatusBarSkeleton;
