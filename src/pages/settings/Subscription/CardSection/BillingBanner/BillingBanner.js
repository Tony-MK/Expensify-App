"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Pressable_1 = require("@components/Pressable");
const Text_1 = require("@components/Text");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function BillingBanner({ title, subtitle, icon, brickRoadIndicator, style, titleStyle, subtitleStyle, rightIcon, onRightIconPress, rightIconAccessibilityLabel, rightComponent, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const rightIconComponent = (0, react_1.useMemo)(() => {
        if (rightIcon) {
            return onRightIconPress && rightIconAccessibilityLabel ? (<Pressable_1.PressableWithoutFeedback onPress={onRightIconPress} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={rightIconAccessibilityLabel}>
                    <Icon_1.default src={rightIcon} fill={theme.icon}/>
                </Pressable_1.PressableWithoutFeedback>) : (<Icon_1.default src={rightIcon} fill={theme.icon}/>);
        }
        return (!!brickRoadIndicator && (<Icon_1.default src={Expensicons.DotIndicator} fill={brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR ? theme.danger : theme.success}/>));
    }, [brickRoadIndicator, onRightIconPress, rightIcon, rightIconAccessibilityLabel, styles.touchableButtonImage, theme.danger, theme.icon, theme.success]);
    return (<react_native_1.View style={[styles.pv4, styles.ph5, styles.flexRow, styles.flexWrap, styles.gap3, styles.w100, styles.alignItemsCenter, styles.trialBannerBackgroundColor, style]}>
            <Icon_1.default src={icon} width={variables_1.default.menuIconSize} height={variables_1.default.menuIconSize}/>

            <react_native_1.View style={[styles.flex1, styles.justifyContentCenter]}>
                {typeof title === 'string' ? <Text_1.default style={[styles.textStrong, titleStyle]}>{title}</Text_1.default> : title}
                {typeof subtitle === 'string' ? <Text_1.default style={subtitleStyle}>{subtitle}</Text_1.default> : subtitle}
            </react_native_1.View>
            {shouldUseNarrowLayout ? (<>
                    {rightIconComponent}
                    {!!rightComponent && rightComponent}
                </>) : (<>
                    {!!rightComponent && rightComponent}
                    {rightIconComponent}
                </>)}
        </react_native_1.View>);
}
BillingBanner.displayName = 'BillingBanner';
exports.default = BillingBanner;
