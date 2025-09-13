"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
var react_native_1 = require("react-native");
var PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
var Tooltip_1 = require("@components/Tooltip");
var EducationalTooltip_1 = require("@components/Tooltip/EducationalTooltip");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var TabIcon_1 = require("./TabIcon");
var TabLabel_1 = require("./TabLabel");
var AnimatedPressableWithFeedback = react_native_1.Animated.createAnimatedComponent(PressableWithFeedback_1.default);
function TabSelectorItem(_a) {
    var _b;
    var icon = _a.icon, _c = _a.title, title = _c === void 0 ? '' : _c, _d = _a.onPress, onPress = _d === void 0 ? function () { } : _d, _e = _a.backgroundColor, backgroundColor = _e === void 0 ? '' : _e, _f = _a.activeOpacity, activeOpacity = _f === void 0 ? 0 : _f, _g = _a.inactiveOpacity, inactiveOpacity = _g === void 0 ? 1 : _g, _h = _a.isActive, isActive = _h === void 0 ? false : _h, _j = _a.shouldShowLabelWhenInactive, shouldShowLabelWhenInactive = _j === void 0 ? true : _j, testID = _a.testID, _k = _a.shouldShowProductTrainingTooltip, shouldShowProductTrainingTooltip = _k === void 0 ? false : _k, renderProductTrainingTooltip = _a.renderProductTrainingTooltip, _l = _a.parentX, parentX = _l === void 0 ? 0 : _l, _m = _a.parentWidth, parentWidth = _m === void 0 ? 0 : _m, _o = _a.equalWidth, equalWidth = _o === void 0 ? false : _o;
    var styles = (0, useThemeStyles_1.default)();
    var _p = (0, react_1.useState)(false), isHovered = _p[0], setIsHovered = _p[1];
    var childRef = (0, react_1.useRef)(null);
    var shouldShowEducationalTooltip = shouldShowProductTrainingTooltip && isActive;
    var _q = (0, react_1.useState)(0), shiftHorizontal = _q[0], setShiftHorizontal = _q[1];
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    // Compute horizontal shift for EducationalTooltip:
    //  - on desktop, ignore RHP bounds and center tooltip on the tab (no shift needed)
    //  - on mobile (aka small screen) center tooltip within the panel
    (0, react_1.useLayoutEffect)(function () {
        // only active tab gets tooltip
        if (!isActive) {
            return;
        }
        if (!isSmallScreenWidth) {
            // no shift needed on desktop (note: not "shouldUseNarrowLayout")
            setShiftHorizontal(0);
            return;
        }
        // must allow animation to complete before taking measurement
        var timerID = setTimeout(function () {
            var _a;
            (_a = childRef.current) === null || _a === void 0 ? void 0 : _a.measureInWindow(function (x, _y, width) {
                // To center tooltip in parent:
                var parentCenter = parentX + parentWidth / 2; // ... where it should be...
                var currentCenter = x + width / 2; // ... minus where it is now...
                setShiftHorizontal(parentCenter - currentCenter); // ...equals the shift needed
            });
        }, CONST_1.default.TOOLTIP_ANIMATION_DURATION);
        return function () {
            clearTimeout(timerID);
        };
    }, [isActive, childRef, isSmallScreenWidth, parentX, parentWidth]);
    var children = (<AnimatedPressableWithFeedback accessibilityLabel={title} style={[styles.tabSelectorButton, styles.tabBackground(isHovered, isActive, backgroundColor), styles.userSelectNone]} wrapperStyle={[equalWidth ? styles.flex1 : styles.flexGrow1]} onPress={onPress} onHoverIn={function () { return setIsHovered(true); }} onHoverOut={function () { return setIsHovered(false); }} role={CONST_1.default.ROLE.BUTTON} dataSet={_b = {}, _b[CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT] = true, _b} testID={testID} ref={childRef}>
            <TabIcon_1.default icon={icon} activeOpacity={styles.tabOpacity(isHovered, isActive, activeOpacity, inactiveOpacity).opacity} inactiveOpacity={styles.tabOpacity(isHovered, isActive, inactiveOpacity, activeOpacity).opacity}/>
            {(shouldShowLabelWhenInactive || isActive) && (<TabLabel_1.default title={title} activeOpacity={styles.tabOpacity(isHovered, isActive, activeOpacity, inactiveOpacity).opacity} inactiveOpacity={styles.tabOpacity(isHovered, isActive, inactiveOpacity, activeOpacity).opacity} hasIcon={!!icon}/>)}
        </AnimatedPressableWithFeedback>);
    return shouldShowEducationalTooltip ? (<EducationalTooltip_1.default shouldRender renderTooltipContent={renderProductTrainingTooltip} shouldHideOnNavigate anchorAlignment={{
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
        }} wrapperStyle={[styles.productTrainingTooltipWrapper, styles.pAbsolute]} computeHorizontalShiftForNative shiftHorizontal={shiftHorizontal} minWidth={variables_1.default.minScanTooltipWidth}>
            {children}
        </EducationalTooltip_1.default>) : (<Tooltip_1.default shouldRender={!shouldShowLabelWhenInactive && !isActive} text={title}>
            {children}
        </Tooltip_1.default>);
}
TabSelectorItem.displayName = 'TabSelectorItem';
exports.default = TabSelectorItem;
