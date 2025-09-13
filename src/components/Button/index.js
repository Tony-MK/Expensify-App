"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const withNavigationFallback_1 = require("@components/withNavigationFallback");
const useActiveElementRole_1 = require("@hooks/useActiveElementRole");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const HapticFeedback_1 = require("@libs/HapticFeedback");
const CONST_1 = require("@src/CONST");
const utils_1 = require("./utils");
const validateSubmitShortcut_1 = require("./validateSubmitShortcut");
const accessibilityRoles = Object.values(CONST_1.default.ROLE);
function KeyboardShortcutComponent({ isDisabled = false, isLoading = false, onPress = () => { }, pressOnEnter, allowBubble, enterKeyEventListenerPriority, isPressOnEnterActive = false, }) {
    const isFocused = (0, native_1.useIsFocused)();
    const activeElementRole = (0, useActiveElementRole_1.default)();
    const shouldDisableEnterShortcut = (0, react_1.useMemo)(() => accessibilityRoles.includes(activeElementRole ?? '') && activeElementRole !== CONST_1.default.ROLE.PRESENTATION, [activeElementRole]);
    const keyboardShortcutCallback = (0, react_1.useCallback)((event) => {
        if (!(0, validateSubmitShortcut_1.default)(isDisabled, isLoading, event)) {
            return;
        }
        onPress();
    }, [isDisabled, isLoading, onPress]);
    const config = (0, react_1.useMemo)(() => ({
        isActive: pressOnEnter && !shouldDisableEnterShortcut && (isFocused || isPressOnEnterActive),
        shouldBubble: allowBubble,
        priority: enterKeyEventListenerPriority,
        shouldPreventDefault: false,
    }), 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [shouldDisableEnterShortcut, isFocused]);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ENTER, keyboardShortcutCallback, config);
    return null;
}
KeyboardShortcutComponent.displayName = 'KeyboardShortcutComponent';
function Button({ allowBubble = false, iconRight = Expensicons.ArrowRight, iconFill, iconHoverFill, icon = null, iconStyles = [], iconRightStyles = [], iconWrapperStyles = [], text = '', small = false, large = false, medium = !small && !large, isLoading = false, isDisabled = false, onLayout = () => { }, onPress = () => { }, onLongPress = () => { }, onPressIn = () => { }, onPressOut = () => { }, onMouseDown = undefined, pressOnEnter = false, enterKeyEventListenerPriority = 0, style = [], disabledStyle, innerStyles = [], textStyles = [], textHoverStyles = [], shouldUseDefaultHover = true, hoverStyles = undefined, success = false, danger = false, shouldRemoveRightBorderRadius = false, shouldRemoveLeftBorderRadius = false, shouldEnableHapticFeedback = false, isLongPressDisabled = false, shouldShowRightIcon = false, id = '', testID = undefined, accessibilityLabel = '', isSplitButton = false, link = false, isContentCentered = false, isPressOnEnterActive, isNested = false, secondLineText = '', shouldBlendOpacity = false, shouldStayNormalOnDisable = false, ref, ...rest }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const renderContent = () => {
        if ('children' in rest) {
            return rest.children;
        }
        const primaryText = (<Text_1.default numberOfLines={1} style={[
                isLoading && styles.opacity0,
                styles.pointerEventsNone,
                styles.buttonText,
                small && styles.buttonSmallText,
                medium && styles.buttonMediumText,
                large && styles.buttonLargeText,
                success && styles.buttonSuccessText,
                danger && styles.buttonDangerText,
                !!icon && styles.textAlignLeft,
                !!secondLineText && styles.noPaddingBottom,
                isHovered && textHoverStyles,
                link && styles.fontWeightNormal,
                link && styles.fontSizeLabel,
                textStyles,
                link && styles.link,
                link && isHovered && StyleUtils.getColorStyle(theme.linkHover),
            ]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                {text}
            </Text_1.default>);
        const textComponent = secondLineText ? (<react_native_1.View style={[styles.alignItemsCenter, styles.flexColumn, styles.flexShrink1]}>
                {primaryText}
                <Text_1.default style={[
                isLoading && styles.opacity0,
                styles.pointerEventsNone,
                styles.fontWeightNormal,
                styles.textDoubleDecker,
                !!secondLineText && styles.textExtraSmallSupporting,
                styles.textWhite,
                styles.textBold,
            ]}>
                    {secondLineText}
                </Text_1.default>
            </react_native_1.View>) : (primaryText);
        const defaultFill = success || danger ? theme.textLight : theme.icon;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (icon || shouldShowRightIcon) {
            return (<react_native_1.View style={[isContentCentered ? styles.justifyContentCenter : styles.justifyContentBetween, styles.flexRow, iconWrapperStyles, styles.mw100]}>
                    <react_native_1.View style={[styles.alignItemsCenter, styles.flexRow, styles.flexShrink1]}>
                        {!!icon && (<react_native_1.View style={[styles.mr2, !text && styles.mr0, iconStyles]}>
                                <Icon_1.default src={icon} fill={isHovered ? (iconHoverFill ?? defaultFill) : (iconFill ?? defaultFill)} small={small} medium={medium} large={large} isButtonIcon/>
                            </react_native_1.View>)}
                        {!!text && textComponent}
                    </react_native_1.View>
                    {shouldShowRightIcon && (<react_native_1.View style={[styles.justifyContentCenter, large ? styles.ml2 : styles.ml1, iconRightStyles]}>
                            {!isSplitButton ? (<Icon_1.default src={iconRight} fill={isHovered ? (iconHoverFill ?? defaultFill) : (iconFill ?? defaultFill)} small={small} medium={medium} large={large} isButtonIcon/>) : (<Icon_1.default src={iconRight} fill={isHovered ? (iconHoverFill ?? defaultFill) : (iconFill ?? defaultFill)} small={small} medium={medium} large={large} isButtonIcon/>)}
                        </react_native_1.View>)}
                </react_native_1.View>);
        }
        return textComponent;
    };
    const buttonStyles = (0, react_1.useMemo)(() => [
        styles.button,
        StyleUtils.getButtonStyleWithIcon(styles, small, medium, large, !!icon, !!(text?.length > 0), shouldShowRightIcon),
        success ? styles.buttonSuccess : undefined,
        danger ? styles.buttonDanger : undefined,
        isDisabled && !shouldStayNormalOnDisable ? styles.buttonOpacityDisabled : undefined,
        isDisabled && !danger && !success && !shouldStayNormalOnDisable ? styles.buttonDisabled : undefined,
        shouldRemoveRightBorderRadius ? styles.noRightBorderRadius : undefined,
        shouldRemoveLeftBorderRadius ? styles.noLeftBorderRadius : undefined,
        text && shouldShowRightIcon ? styles.alignItemsStretch : undefined,
        innerStyles,
        link && styles.bgTransparent,
    ], [
        StyleUtils,
        danger,
        icon,
        innerStyles,
        isDisabled,
        large,
        link,
        medium,
        shouldRemoveLeftBorderRadius,
        shouldRemoveRightBorderRadius,
        shouldShowRightIcon,
        small,
        styles,
        success,
        text,
        shouldStayNormalOnDisable,
    ]);
    const buttonContainerStyles = (0, react_1.useMemo)(() => [buttonStyles, shouldBlendOpacity && styles.buttonBlendContainer], [buttonStyles, shouldBlendOpacity, styles.buttonBlendContainer]);
    const buttonBlendForegroundStyle = (0, react_1.useMemo)(() => {
        if (!shouldBlendOpacity) {
            return undefined;
        }
        const { backgroundColor, opacity } = react_native_1.StyleSheet.flatten(buttonStyles);
        return {
            backgroundColor,
            opacity,
        };
    }, [buttonStyles, shouldBlendOpacity]);
    return (<>
            {pressOnEnter && (<KeyboardShortcutComponent isDisabled={isDisabled} isLoading={isLoading} allowBubble={allowBubble} onPress={onPress} pressOnEnter={pressOnEnter} enterKeyEventListenerPriority={enterKeyEventListenerPriority} isPressOnEnterActive={isPressOnEnterActive}/>)}
            <PressableWithFeedback_1.default dataSet={{
            listener: pressOnEnter ? CONST_1.default.KEYBOARD_SHORTCUTS.ENTER.shortcutKey : undefined,
        }} ref={ref} onLayout={onLayout} onPress={(event) => {
            if (event?.type === 'click') {
                const currentTarget = event?.currentTarget;
                currentTarget?.blur();
            }
            if (shouldEnableHapticFeedback) {
                HapticFeedback_1.default.press();
            }
            if (isDisabled || isLoading) {
                return; // Prevent the onPress from being triggered when the button is disabled or in a loading state
            }
            return onPress(event);
        }} onLongPress={(event) => {
            if (isLongPressDisabled) {
                return;
            }
            if (shouldEnableHapticFeedback) {
                HapticFeedback_1.default.longPress();
            }
            onLongPress(event);
        }} onPressIn={onPressIn} onPressOut={onPressOut} onMouseDown={onMouseDown} shouldBlendOpacity={shouldBlendOpacity} disabled={isLoading || isDisabled} wrapperStyle={[
            isDisabled && !shouldStayNormalOnDisable ? { ...styles.cursorDisabled, ...styles.noSelect } : {},
            styles.buttonContainer,
            shouldRemoveRightBorderRadius ? styles.noRightBorderRadius : undefined,
            shouldRemoveLeftBorderRadius ? styles.noLeftBorderRadius : undefined,
            style,
        ]} style={buttonContainerStyles} isNested={isNested} hoverStyle={!isDisabled || !shouldStayNormalOnDisable
            ? [
                shouldUseDefaultHover && !isDisabled ? styles.buttonDefaultHovered : undefined,
                success && !isDisabled ? styles.buttonSuccessHovered : undefined,
                danger && !isDisabled ? styles.buttonDangerHovered : undefined,
                hoverStyles,
            ]
            : []} disabledStyle={!shouldStayNormalOnDisable ? disabledStyle : undefined} id={id} testID={testID} accessibilityLabel={accessibilityLabel} role={(0, utils_1.getButtonRole)(isNested)} hoverDimmingValue={1} onHoverIn={!isDisabled || !shouldStayNormalOnDisable ? () => setIsHovered(true) : undefined} onHoverOut={!isDisabled || !shouldStayNormalOnDisable ? () => setIsHovered(false) : undefined}>
                {shouldBlendOpacity && <react_native_1.View style={[react_native_1.StyleSheet.absoluteFill, buttonBlendForegroundStyle]}/>}
                {renderContent()}
                {isLoading && (<react_native_1.ActivityIndicator color={success || danger ? theme.textLight : theme.text} style={[styles.pAbsolute, styles.l0, styles.r0]}/>)}
            </PressableWithFeedback_1.default>
        </>);
}
Button.displayName = 'Button';
exports.default = (0, withNavigationFallback_1.default)(Button);
