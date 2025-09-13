"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react-compiler/react-compiler */
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const AnimatedPressableWithoutFeedback_1 = require("@components/AnimatedPressableWithoutFeedback");
const TransparentOverlay_1 = require("@components/AutoCompleteSuggestions/AutoCompleteSuggestionsPortal/TransparentOverlay/TransparentOverlay");
const PopoverProvider_1 = require("@components/PopoverProvider");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const CONST_1 = require("@src/CONST");
const textRef_1 = require("@src/types/utils/textRef");
const viewRef_1 = require("@src/types/utils/viewRef");
// Props will change frequently.
// On every tooltip hover, we update the position in state which will result in re-rendering.
// We also update the state on layout changes which will be triggered often.
// There will be n number of tooltip components in the page.
// It's good to memoize this one.
function BaseGenericTooltip({ animation, windowWidth, xOffset, yOffset, targetWidth, targetHeight, shiftHorizontal = 0, shiftVertical = 0, text, numberOfLines, maxWidth = 0, minWidth, renderTooltipContent, shouldForceRenderingBelow = false, wrapperStyle = {}, anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
}, shouldUseOverlay = false, onHideTooltip = () => { }, isEducationTooltip = false, onTooltipPress, }) {
    // The width of tooltip's inner content. Has to be undefined in the beginning
    // as a width of 0 will cause the content to be rendered of a width of 0,
    // which prevents us from measuring it correctly.
    const [contentMeasuredWidth, setContentMeasuredWidth] = (0, react_1.useState)();
    // The height of tooltip's wrapper.
    const [wrapperMeasuredHeight, setWrapperMeasuredHeight] = (0, react_1.useState)();
    const contentRef = (0, react_1.useRef)(null);
    const rootWrapper = (0, react_1.useRef)(null);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { setActivePopoverExtraAnchorRef } = (0, react_1.useContext)(PopoverProvider_1.PopoverContext);
    (0, react_1.useEffect)(() => {
        if (!isEducationTooltip) {
            return;
        }
        setActivePopoverExtraAnchorRef(rootWrapper);
    }, [isEducationTooltip, setActivePopoverExtraAnchorRef]);
    (0, react_1.useLayoutEffect)(() => {
        // Calculate the tooltip width and height before the browser repaints the screen to prevent flicker
        // because of the late update of the width and the height from onLayout.
        const rootWrapperStyle = rootWrapper?.current?.style;
        const isScaled = rootWrapperStyle?.transform === 'scale(0)';
        if (isScaled) {
            // Temporarily reset the scale caused by animation to get the untransformed size.
            rootWrapperStyle.transform = 'scale(1)';
        }
        setContentMeasuredWidth(contentRef.current?.getBoundingClientRect().width);
        setWrapperMeasuredHeight(rootWrapper.current?.getBoundingClientRect().height);
        if (isScaled) {
            rootWrapperStyle.transform = 'scale(0)';
        }
    }, []);
    const { rootWrapperStyle, textStyle, pointerWrapperStyle, pointerStyle } = (0, react_1.useMemo)(() => StyleUtils.getTooltipStyles({
        tooltip: rootWrapper.current,
        windowWidth,
        xOffset,
        yOffset,
        tooltipTargetWidth: targetWidth,
        tooltipTargetHeight: targetHeight,
        maxWidth,
        minWidth,
        tooltipContentWidth: contentMeasuredWidth,
        tooltipWrapperHeight: wrapperMeasuredHeight,
        manualShiftHorizontal: shiftHorizontal,
        manualShiftVertical: shiftVertical,
        shouldForceRenderingBelow,
        anchorAlignment,
        wrapperStyle,
        isEducationTooltip,
    }), [
        StyleUtils,
        windowWidth,
        xOffset,
        yOffset,
        targetWidth,
        targetHeight,
        maxWidth,
        minWidth,
        contentMeasuredWidth,
        wrapperMeasuredHeight,
        shiftHorizontal,
        shiftVertical,
        shouldForceRenderingBelow,
        anchorAlignment,
        wrapperStyle,
        isEducationTooltip,
    ]);
    const animationStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return StyleUtils.getTooltipAnimatedStyles({ tooltipContentWidth: contentMeasuredWidth, tooltipWrapperHeight: wrapperMeasuredHeight, currentSize: animation });
    });
    let content;
    if (renderTooltipContent) {
        content = (<react_native_1.View ref={(0, viewRef_1.default)(contentRef)} fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}>
                {renderTooltipContent()}
            </react_native_1.View>);
    }
    else {
        content = (<Text_1.default numberOfLines={numberOfLines} style={textStyle} fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}>
                <Text_1.default style={textStyle} ref={(0, textRef_1.default)(contentRef)}>
                    {text}
                </Text_1.default>
            </Text_1.default>);
    }
    const AnimatedWrapper = isEducationTooltip ? AnimatedPressableWithoutFeedback_1.default : react_native_reanimated_1.default.View;
    const body = document.querySelector('body');
    if (!body) {
        return null;
    }
    return react_dom_1.default.createPortal(<>
            {shouldUseOverlay && <TransparentOverlay_1.default onPress={onHideTooltip}/>}
            <AnimatedWrapper ref={(0, viewRef_1.default)(rootWrapper)} style={[rootWrapperStyle, animationStyle]} onPress={isEducationTooltip ? onTooltipPress : undefined} role={isEducationTooltip ? CONST_1.default.ROLE.TOOLTIP : undefined} accessibilityLabel={isEducationTooltip ? CONST_1.default.ROLE.TOOLTIP : undefined} interactive={isEducationTooltip ? !!onTooltipPress : undefined}>
                {content}
                <react_native_1.View style={pointerWrapperStyle}>
                    <react_native_1.View style={pointerStyle}/>
                </react_native_1.View>
            </AnimatedWrapper>
        </>, body);
}
BaseGenericTooltip.displayName = 'BaseGenericTooltip';
exports.default = react_1.default.memo(BaseGenericTooltip);
