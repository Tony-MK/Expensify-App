"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
const SkeletonViewContentLoader_1 = require("./SkeletonViewContentLoader");
function ReportHeaderSkeletonView({ shouldAnimate = true, onBackButtonPress = () => { } }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const height = styles.headerBarHeight.height;
    const radius = 20;
    const circleY = height / 2;
    const circleTopY = circleY - radius;
    const circleBottomY = circleY + radius;
    return (<react_native_1.View style={[styles.appContentHeader, shouldUseNarrowLayout && styles.pl2, styles.h100]}>
            <react_native_1.View style={[styles.appContentHeaderTitle, !shouldUseNarrowLayout && styles.pl5]}>
                {shouldUseNarrowLayout && (<PressableWithFeedback_1.default onPress={onBackButtonPress} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.back')}>
                        <Icon_1.default fill={theme.icon} src={Expensicons.BackArrow}/>
                    </PressableWithFeedback_1.default>)}
                <SkeletonViewContentLoader_1.default animate={shouldAnimate} width={styles.w100.width} height={height} backgroundColor={theme.skeletonLHNIn} foregroundColor={theme.skeletonLHNOut}>
                    <react_native_svg_1.Circle cx="20" cy={height / 2} r={radius}/>
                    <react_native_svg_1.Rect x="55" y={circleTopY + 8} width="30%" height="8"/>
                    <react_native_svg_1.Rect x="55" y={circleBottomY - 12} width="40%" height="8"/>
                </SkeletonViewContentLoader_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
ReportHeaderSkeletonView.displayName = 'ReportHeaderSkeletonView';
exports.default = ReportHeaderSkeletonView;
