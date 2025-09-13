"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const PressableWithSecondaryInteraction_1 = require("@components/PressableWithSecondaryInteraction");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
/*
 * This is a default anchor component for regular links.
 */
function BaseAnchorForCommentsOnly({ onPressIn, onPressOut, href = '', rel = '', target = '', children = null, style, onPress, linkHasImage, wrapperStyle, ...rest }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const linkRef = (0, react_1.useRef)(null);
    const flattenStyle = react_native_1.StyleSheet.flatten(style);
    (0, react_1.useEffect)(() => () => {
        (0, ReportActionContextMenu_1.hideContextMenu)();
    }, []);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const linkProps = {};
    if (onPress) {
        linkProps.onPress = onPress;
    }
    else {
        linkProps.href = href;
    }
    const defaultTextStyle = (0, DeviceCapabilities_1.canUseTouchScreen)() || shouldUseNarrowLayout ? {} : { ...styles.userSelectText, ...styles.cursorPointer };
    const isEmail = expensify_common_1.Str.isValidEmail(href.replace(/mailto:/i, ''));
    const linkHref = !linkHasImage ? href : undefined;
    const isFocused = (0, native_1.useIsFocused)();
    return (<PressableWithSecondaryInteraction_1.default inline suppressHighlighting style={[styles.cursorDefault, !!flattenStyle.fontSize && StyleUtils.getFontSizeStyle(flattenStyle.fontSize)]} onSecondaryInteraction={(event) => {
            (0, ReportActionContextMenu_1.showContextMenu)({
                type: isEmail ? CONST_1.default.CONTEXT_MENU_TYPES.EMAIL : CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                event,
                selection: href,
                contextMenuAnchor: linkRef.current,
            });
        }} onPress={(event) => {
            if (!linkProps.onPress) {
                return;
            }
            event?.preventDefault();
            linkProps.onPress();
        }} onPressIn={onPressIn} onPressOut={onPressOut} role={CONST_1.default.ROLE.LINK} accessibilityLabel={href} wrapperStyle={wrapperStyle}>
            <Tooltip_1.default text={linkHref} isFocused={isFocused}>
                <Text_1.default ref={linkRef} style={react_native_1.StyleSheet.flatten([style, defaultTextStyle])} role={CONST_1.default.ROLE.LINK} hrefAttrs={{
            rel,
            target: isEmail || !linkProps.href ? '_self' : target,
        }} href={linkHref} suppressHighlighting 
    // Add testID so it gets selected as an anchor tag by SelectionScraper
    testID="a" 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}>
                    {children}
                </Text_1.default>
            </Tooltip_1.default>
        </PressableWithSecondaryInteraction_1.default>);
}
BaseAnchorForCommentsOnly.displayName = 'BaseAnchorForCommentsOnly';
exports.default = BaseAnchorForCommentsOnly;
