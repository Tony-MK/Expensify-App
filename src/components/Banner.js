"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
const CONST_1 = require("@src/CONST");
const Button_1 = require("./Button");
const Hoverable_1 = require("./Hoverable");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
const RenderHTML_1 = require("./RenderHTML");
const Text_1 = require("./Text");
const Tooltip_1 = require("./Tooltip");
function Banner({ text, content, icon = Expensicons.Exclamation, onClose, onPress, onButtonPress, containerStyles, textStyles, shouldRenderHTML = false, shouldShowIcon = false, shouldShowCloseButton = false, shouldShowButton = false, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<Hoverable_1.default>
            {(isHovered) => {
            const isClickable = onClose && onPress;
            const shouldHighlight = isClickable && isHovered;
            return (<react_native_1.View style={[
                    styles.flexRow,
                    styles.alignItemsCenter,
                    styles.p5,
                    styles.borderRadiusNormal,
                    shouldHighlight ? styles.activeComponentBG : styles.hoveredComponentBG,
                    styles.breakAll,
                    containerStyles,
                ]}>
                        <react_native_1.View style={[styles.flexRow, styles.flex1, styles.mw100, styles.alignItemsCenter]}>
                            {shouldShowIcon && !!icon && (<react_native_1.View style={[styles.mr3]}>
                                    <Icon_1.default src={icon} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(shouldHighlight))}/>
                                </react_native_1.View>)}
                            {content && content}

                            {text &&
                    (shouldRenderHTML ? (<RenderHTML_1.default html={text}/>) : (<Text_1.default style={[styles.flex1, styles.flexWrap, textStyles]} onPress={onPress} suppressHighlighting>
                                        {text}
                                    </Text_1.default>))}
                        </react_native_1.View>
                        {shouldShowButton && (<Button_1.default success style={[styles.pr3]} text={translate('common.chatNow')} onPress={onButtonPress}/>)}
                        {shouldShowCloseButton && !!onClose && (<Tooltip_1.default text={translate('common.close')}>
                                <PressableWithFeedback_1.default onPress={onClose} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.close')}>
                                    <Icon_1.default src={Expensicons.Close} fill={theme.icon}/>
                                </PressableWithFeedback_1.default>
                            </Tooltip_1.default>)}
                    </react_native_1.View>);
        }}
        </Hoverable_1.default>);
}
Banner.displayName = 'Banner';
exports.default = (0, react_1.memo)(Banner);
