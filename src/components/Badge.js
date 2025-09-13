"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const Text_1 = require("./Text");
function Badge({ success = false, error = false, pressable = false, text, environment = CONST_1.default.ENVIRONMENT.DEV, badgeStyles, textStyles, onPress = () => { }, icon, iconStyles = [], style, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const Wrapper = pressable ? PressableWithoutFeedback_1.default : react_native_1.View;
    const isDeleted = style && Array.isArray(style) ? style.includes(styles.offlineFeedback.deleted) : false;
    const iconColor = StyleUtils.getIconColorStyle(success, error);
    const wrapperStyles = (0, react_1.useCallback)(({ pressed }) => [
        styles.defaultBadge,
        styles.alignSelfCenter,
        styles.ml2,
        StyleUtils.getBadgeColorStyle(success, error, pressed, environment === CONST_1.default.ENVIRONMENT.ADHOC),
        badgeStyles,
    ], [styles.defaultBadge, styles.alignSelfCenter, styles.ml2, StyleUtils, success, error, environment, badgeStyles]);
    return (<Wrapper style={pressable ? wrapperStyles : wrapperStyles({ focused: false, hovered: false, isDisabled: false, isScreenReaderActive: false, pressed: false })} onPress={onPress} role={pressable ? CONST_1.default.ROLE.BUTTON : CONST_1.default.ROLE.PRESENTATION} accessibilityLabel={pressable ? text : undefined} aria-label={!pressable ? text : undefined} accessible={false}>
            {!!icon && (<react_native_1.View style={[styles.mr2, iconStyles]}>
                    <Icon_1.default width={variables_1.default.iconSizeExtraSmall} height={variables_1.default.iconSizeExtraSmall} src={icon} fill={iconColor}/>
                </react_native_1.View>)}
            <Text_1.default style={[styles.badgeText, styles.textStrong, textStyles, isDeleted ? styles.offlineFeedback.deleted : {}]} numberOfLines={1}>
                {text}
            </Text_1.default>
        </Wrapper>);
}
Badge.displayName = 'Badge';
exports.default = Badge;
