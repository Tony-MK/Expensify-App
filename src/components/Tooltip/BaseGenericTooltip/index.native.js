"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const AnimatedPressableWithoutFeedback_1 = require("@components/AnimatedPressableWithoutFeedback");
const TransparentOverlay_1 = require("@components/AutoCompleteSuggestions/AutoCompleteSuggestionsPortal/TransparentOverlay/TransparentOverlay");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const CONST_1 = require("@src/CONST");
// Props will change frequently.
// On every tooltip hover, we update the position in state which will result in re-rendering.
// We also update the state on layout changes which will be triggered often.
// There will be n number of tooltip components in the page.
// It's good to memoize this one.
function BaseGenericTooltip({ animation, windowWidth, xOffset, yOffset, targetWidth, targetHeight, shiftHorizontal = 0, shiftVertical = 0, text, numberOfLines, maxWidth = 0, renderTooltipContent, shouldForceRenderingBelow = false, anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
}, wrapperStyle = {}, shouldUseOverlay = false, onHideTooltip = () => { }, shouldTeleportPortalToModalLayer = false, isEducationTooltip = false, onTooltipPress = () => { }, computeHorizontalShiftForNative = false, }) {
    // The width of tooltip's inner content. Has to be undefined in the beginning
    // as a width of 0 will cause the content to be rendered of a width of 0,
    // which prevents us from measuring it correctly.
    const [contentMeasuredWidthState, setContentMeasuredWidth] = (0, react_1.useState)();
    const contentMeasuredWidthAnimated = (0, react_native_reanimated_1.useSharedValue)(0);
    // The height of tooltip's wrapper.
    const [wrapperMeasuredHeightState, setWrapperMeasuredHeight] = (0, react_1.useState)();
    const wrapperMeasuredHeightAnimated = (0, react_native_reanimated_1.useSharedValue)(0);
    const rootWrapper = (0, react_1.useRef)(null);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { rootWrapperStyle, textStyle, pointerWrapperStyle, pointerStyle } = (0, react_1.useMemo)(() => StyleUtils.getTooltipStyles({
        // eslint-disable-next-line react-compiler/react-compiler
        tooltip: rootWrapper.current,
        windowWidth,
        xOffset,
        yOffset,
        tooltipTargetWidth: targetWidth,
        tooltipTargetHeight: targetHeight,
        maxWidth,
        tooltipContentWidth: contentMeasuredWidthState,
        tooltipWrapperHeight: wrapperMeasuredHeightState,
        manualShiftHorizontal: shiftHorizontal,
        manualShiftVertical: shiftVertical,
        shouldForceRenderingBelow,
        anchorAlignment,
        wrapperStyle,
        shouldAddHorizontalPadding: false,
        isEducationTooltip,
        computeHorizontalShiftForNative,
    }), [
        StyleUtils,
        windowWidth,
        xOffset,
        yOffset,
        targetWidth,
        targetHeight,
        maxWidth,
        contentMeasuredWidthState,
        wrapperMeasuredHeightState,
        shiftHorizontal,
        shiftVertical,
        shouldForceRenderingBelow,
        anchorAlignment,
        wrapperStyle,
        isEducationTooltip,
        computeHorizontalShiftForNative,
    ]);
    const animationStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return StyleUtils.getTooltipAnimatedStyles({
            tooltipContentWidth: contentMeasuredWidthAnimated.get(),
            tooltipWrapperHeight: wrapperMeasuredHeightAnimated.get(),
            currentSize: animation,
        });
    });
    let content;
    if (renderTooltipContent) {
        content = <react_native_1.View fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}>{renderTooltipContent()}</react_native_1.View>;
    }
    else {
        content = (<Text_1.default numberOfLines={numberOfLines} style={textStyle} fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}>
                <Text_1.default style={textStyle}>{text}</Text_1.default>
            </Text_1.default>);
    }
    const AnimatedWrapper = isEducationTooltip ? AnimatedPressableWithoutFeedback_1.default : react_native_reanimated_1.default.View;
    return (<portal_1.Portal hostName={shouldTeleportPortalToModalLayer ? 'modal' : undefined}>
            {shouldUseOverlay && <TransparentOverlay_1.default onPress={onHideTooltip}/>}
            <AnimatedWrapper style={[rootWrapperStyle, animationStyle]} ref={rootWrapper} onPress={isEducationTooltip ? onTooltipPress : undefined} role={isEducationTooltip ? CONST_1.default.ROLE.TOOLTIP : undefined} accessibilityLabel={isEducationTooltip ? CONST_1.default.ROLE.TOOLTIP : undefined} onLayout={(e) => {
            const { height, width } = e.nativeEvent.layout;
            if (height === wrapperMeasuredHeightAnimated.get()) {
                return;
            }
            // To avoid unnecessary re-renders of the content container when passing state values to useAnimatedStyle,
            // we use SharedValue for managing content and wrapper measurements.
            contentMeasuredWidthAnimated.set(width);
            wrapperMeasuredHeightAnimated.set(height);
            setContentMeasuredWidth(width);
            setWrapperMeasuredHeight(height);
        }}>
                {content}
                <react_native_1.View style={pointerWrapperStyle}>
                    <react_native_1.View style={pointerStyle}/>
                </react_native_1.View>
            </AnimatedWrapper>
        </portal_1.Portal>);
}
BaseGenericTooltip.displayName = 'BaseGenericTooltip';
exports.default = react_1.default.memo(BaseGenericTooltip);
