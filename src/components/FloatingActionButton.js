"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_reanimated_1 = require("react-native-reanimated");
var react_native_svg_1 = require("react-native-svg");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var useIsHomeRouteActive_1 = require("@navigation/helpers/useIsHomeRouteActive");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var Pressable_1 = require("./Pressable");
var ProductTrainingContext_1 = require("./ProductTrainingContext");
var EducationalTooltip_1 = require("./Tooltip/EducationalTooltip");
var FAB_PATH = 'M12,3c0-1.1-0.9-2-2-2C8.9,1,8,1.9,8,3v5H3c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h5v5c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2v-5h5c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2h-5V3z';
var SMALL_FAB_PATH = 'M9.6 13.6002C9.6 14.4839 8.88366 15.2002 8 15.2002C7.11635 15.2002 6.4 14.4839 6.4 13.6002V9.6002H2.4C1.51635 9.6002 0.800003 8.88385 0.800003 8.0002C0.800003 7.11654 1.51635 6.4002 2.4 6.4002H6.4V2.4002C6.4 1.51654 7.11635 0.800196 8 0.800196C8.88366 0.800196 9.6 1.51654 9.6 2.4002V6.4002H13.6C14.4837 6.4002 15.2 7.11654 15.2 8.0002C15.2 8.88385 14.4837 9.6002 13.6 9.6002H9.6V13.6002Z';
var AnimatedPath = react_native_reanimated_1.default.createAnimatedComponent(react_native_svg_1.Path);
AnimatedPath.displayName = 'AnimatedPath';
function FloatingActionButton(_a) {
    var onPress = _a.onPress, onLongPress = _a.onLongPress, isActive = _a.isActive, accessibilityLabel = _a.accessibilityLabel, role = _a.role, isTooltipAllowed = _a.isTooltipAllowed, ref = _a.ref;
    var _b = (0, useTheme_1.default)(), success = _b.success, successHover = _b.successHover, buttonDefaultBG = _b.buttonDefaultBG, textLight = _b.textLight;
    var styles = (0, useThemeStyles_1.default)();
    var borderRadius = styles.floatingActionButton.borderRadius;
    var fabPressable = (0, react_1.useRef)(null);
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var _c = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SIDEBAR_LOADED, { canBeMissing: true })[0], isSidebarLoaded = _c === void 0 ? false : _c;
    var isHomeRouteActive = (0, useIsHomeRouteActive_1.default)(shouldUseNarrowLayout);
    var _d = (0, ProductTrainingContext_1.useProductTrainingContext)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.GLOBAL_CREATE_TOOLTIP, 
    // On Home screen, We need to wait for the sidebar to load before showing the tooltip because there is the Concierge tooltip which is higher priority
    isTooltipAllowed && (!isHomeRouteActive || isSidebarLoaded)), renderProductTrainingTooltip = _d.renderProductTrainingTooltip, shouldShowProductTrainingTooltip = _d.shouldShowProductTrainingTooltip, hideProductTrainingTooltip = _d.hideProductTrainingTooltip;
    var isLHBVisible = !shouldUseNarrowLayout;
    var fabSize = isLHBVisible ? variables_1.default.iconSizeSmall : variables_1.default.iconSizeNormal;
    var sharedValue = (0, react_native_reanimated_1.useSharedValue)(isActive ? 1 : 0);
    var buttonRef = ref;
    var tooltipHorizontalAnchorAlignment = isLHBVisible ? CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT : CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT;
    var tooltipShiftHorizontal = isLHBVisible ? variables_1.default.lhbFabTooltipShiftHorizontal : variables_1.default.fabTooltipShiftHorizontal;
    (0, react_1.useEffect)(function () {
        sharedValue.set((0, react_native_reanimated_1.withTiming)(isActive ? 1 : 0, {
            duration: 340,
            easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease),
        }));
    }, [isActive, sharedValue]);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        var backgroundColor = (0, react_native_reanimated_1.interpolateColor)(sharedValue.get(), [0, 1], [success, buttonDefaultBG]);
        return {
            transform: [{ rotate: "".concat(sharedValue.get() * 135, "deg") }],
            backgroundColor: backgroundColor,
        };
    });
    var toggleFabAction = function (event) {
        var _a;
        hideProductTrainingTooltip();
        // Drop focus to avoid blue focus ring.
        (_a = fabPressable.current) === null || _a === void 0 ? void 0 : _a.blur();
        onPress(event);
    };
    var longPressFabAction = function (event) {
        var _a;
        // Only execute on narrow layout - prevent event from firing on wide screens
        if (!shouldUseNarrowLayout) {
            return;
        }
        hideProductTrainingTooltip();
        // Drop focus to avoid blue focus ring.
        (_a = fabPressable.current) === null || _a === void 0 ? void 0 : _a.blur();
        onLongPress === null || onLongPress === void 0 ? void 0 : onLongPress(event);
    };
    return (<EducationalTooltip_1.default shouldRender={shouldShowProductTrainingTooltip} anchorAlignment={{
            horizontal: shouldUseNarrowLayout ? CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER : tooltipHorizontalAnchorAlignment,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
        }} shiftHorizontal={shouldUseNarrowLayout ? 0 : tooltipShiftHorizontal} renderTooltipContent={renderProductTrainingTooltip} wrapperStyle={styles.productTrainingTooltipWrapper} shouldHideOnNavigate={false} onTooltipPress={toggleFabAction}>
            <Pressable_1.PressableWithoutFeedback ref={function (el) {
            fabPressable.current = el !== null && el !== void 0 ? el : null;
            if (buttonRef && 'current' in buttonRef) {
                buttonRef.current = el !== null && el !== void 0 ? el : null;
            }
        }} style={[
            styles.h100,
            styles.navigationTabBarItem,
            // Prevent text selection on touch devices (e.g. on long press)
            (0, DeviceCapabilities_1.canUseTouchScreen)() && styles.userSelectNone,
        ]} accessibilityLabel={accessibilityLabel} onPress={toggleFabAction} onLongPress={longPressFabAction} role={role} shouldUseHapticsOnLongPress testID="floating-action-button">
                {function (_a) {
            var hovered = _a.hovered;
            return (<react_native_reanimated_1.default.View style={[styles.floatingActionButton, { borderRadius: borderRadius }, isLHBVisible && styles.floatingActionButtonSmall, animatedStyle, hovered && { backgroundColor: successHover }]} testID="fab-animated-container">
                        <react_native_svg_1.default width={fabSize} height={fabSize}>
                            <AnimatedPath d={isLHBVisible ? SMALL_FAB_PATH : FAB_PATH} fill={textLight}/>
                        </react_native_svg_1.default>
                    </react_native_reanimated_1.default.View>);
        }}
            </Pressable_1.PressableWithoutFeedback>
        </EducationalTooltip_1.default>);
}
FloatingActionButton.displayName = 'FloatingActionButton';
exports.default = FloatingActionButton;
