"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Tooltip_1 = require("@components/Tooltip");
const EducationalTooltip_1 = require("@components/Tooltip/EducationalTooltip");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const TabIcon_1 = require("./TabIcon");
const TabLabel_1 = require("./TabLabel");
const AnimatedPressableWithFeedback = react_native_1.Animated.createAnimatedComponent(PressableWithFeedback_1.default);
function TabSelectorItem({ icon, title = '', onPress = () => { }, backgroundColor = '', activeOpacity = 0, inactiveOpacity = 1, isActive = false, shouldShowLabelWhenInactive = true, testID, shouldShowProductTrainingTooltip = false, renderProductTrainingTooltip, parentX = 0, parentWidth = 0, equalWidth = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const childRef = (0, react_1.useRef)(null);
    const shouldShowEducationalTooltip = shouldShowProductTrainingTooltip && isActive;
    const [shiftHorizontal, setShiftHorizontal] = (0, react_1.useState)(0);
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    // Compute horizontal shift for EducationalTooltip:
    //  - on desktop, ignore RHP bounds and center tooltip on the tab (no shift needed)
    //  - on mobile (aka small screen) center tooltip within the panel
    (0, react_1.useLayoutEffect)(() => {
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
        const timerID = setTimeout(() => {
            childRef.current?.measureInWindow((x, _y, width) => {
                // To center tooltip in parent:
                const parentCenter = parentX + parentWidth / 2; // ... where it should be...
                const currentCenter = x + width / 2; // ... minus where it is now...
                setShiftHorizontal(parentCenter - currentCenter); // ...equals the shift needed
            });
        }, CONST_1.default.TOOLTIP_ANIMATION_DURATION);
        return () => {
            clearTimeout(timerID);
        };
    }, [isActive, childRef, isSmallScreenWidth, parentX, parentWidth]);
    const children = (<AnimatedPressableWithFeedback accessibilityLabel={title} style={[styles.tabSelectorButton, styles.tabBackground(isHovered, isActive, backgroundColor), styles.userSelectNone]} wrapperStyle={[equalWidth ? styles.flex1 : styles.flexGrow1]} onPress={onPress} onHoverIn={() => setIsHovered(true)} onHoverOut={() => setIsHovered(false)} role={CONST_1.default.ROLE.BUTTON} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }} testID={testID} ref={childRef}>
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
