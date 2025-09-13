"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useLocalize_1 = require("@hooks/useLocalize");
const usePrevious_1 = require("@hooks/usePrevious");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Log_1 = require("@libs/Log");
const StringUtils_1 = require("@libs/StringUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const callOrReturn_1 = require("@src/types/utils/callOrReturn");
const BaseGenericTooltip_1 = require("./BaseGenericTooltip");
const TooltipSense_1 = require("./TooltipSense");
/**
 * The generic tooltip implementation, exposing the tooltip's state
 * while leaving the tooltip's target bounds computation to its parent.
 */
function GenericTooltip({ children, numberOfLines = CONST_1.default.TOOLTIP_MAX_LINES, maxWidth = variables_1.default.sideBarWidth - 2 * variables_1.default.uploadViewMargin, minWidth, text = '', renderTooltipContent, renderTooltipContentKey = [], shiftHorizontal = 0, shiftVertical = 0, shouldForceRenderingBelow = false, wrapperStyle = {}, anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
}, shouldForceAnimate = false, shouldUseOverlay: shouldUseOverlayProp = false, shouldTeleportPortalToModalLayer, shouldRender = true, isEducationTooltip = false, onTooltipPress, computeHorizontalShiftForNative = false, }) {
    const { preferredLocale } = (0, useLocalize_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    // Is tooltip already rendered on the page's body? happens once.
    const [isRendered, setIsRendered] = (0, react_1.useState)(false);
    // Is the tooltip currently visible?
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    // The distance between the left side of the wrapper view and the left side of the window
    const [xOffset, setXOffset] = (0, react_1.useState)(0);
    // The distance between the top of the wrapper view and the top of the window
    const [yOffset, setYOffset] = (0, react_1.useState)(0);
    // The width and height of the wrapper view
    const [wrapperWidth, setWrapperWidth] = (0, react_1.useState)(0);
    const [wrapperHeight, setWrapperHeight] = (0, react_1.useState)(0);
    // Transparent overlay should disappear once user taps it
    const [shouldUseOverlay, setShouldUseOverlay] = (0, react_1.useState)(shouldUseOverlayProp);
    // Whether the tooltip is first tooltip to activate the TooltipSense
    const animation = (0, react_native_reanimated_1.useSharedValue)(0);
    const isTooltipSenseInitiator = (0, react_native_reanimated_1.useSharedValue)(true);
    const isAnimationCanceled = (0, react_native_reanimated_1.useSharedValue)(false);
    const prevText = (0, usePrevious_1.default)(text);
    (0, react_1.useEffect)(() => {
        if (!renderTooltipContent || !text) {
            return;
        }
        Log_1.default.warn('Developer error: Cannot use both text and renderTooltipContent props at the same time in <TooltipRenderedOnPageBody />!');
    }, [text, renderTooltipContent]);
    /**
     * Display the tooltip in an animation.
     */
    const showTooltip = (0, react_1.useCallback)(() => {
        setIsRendered(true);
        setIsVisible(true);
        (0, react_native_reanimated_1.cancelAnimation)(animation);
        // When TooltipSense is active, immediately show the tooltip
        if (TooltipSense_1.default.isActive() && !shouldForceAnimate) {
            animation.set(1);
        }
        else {
            isTooltipSenseInitiator.set(true);
            animation.set((0, react_native_reanimated_1.withDelay)(500, (0, react_native_reanimated_1.withTiming)(1, {
                duration: 140,
            }, (finished) => {
                isAnimationCanceled.set(!finished);
            })));
        }
        TooltipSense_1.default.activate();
    }, [animation, isAnimationCanceled, isTooltipSenseInitiator, shouldForceAnimate]);
    // eslint-disable-next-line rulesdir/prefer-early-return
    (0, react_1.useEffect)(() => {
        // if the tooltip text changed before the initial animation was finished, then the tooltip won't be shown
        // we need to show the tooltip again
        if (isVisible && isAnimationCanceled.get() && text && prevText !== text) {
            isAnimationCanceled.set(false);
            showTooltip();
        }
    }, [isVisible, text, prevText, showTooltip, isAnimationCanceled]);
    /**
     * Update the tooltip's target bounding rectangle
     */
    const updateTargetBounds = (bounds) => {
        if (bounds.width === 0) {
            setIsRendered(false);
        }
        setWrapperWidth(bounds.width);
        setWrapperHeight(bounds.height);
        setXOffset(bounds.x);
        setYOffset(bounds.y);
    };
    /**
     * Hide the tooltip in an animation.
     */
    const hideTooltip = (0, react_1.useCallback)(() => {
        (0, react_native_reanimated_1.cancelAnimation)(animation);
        if (TooltipSense_1.default.isActive() && !isTooltipSenseInitiator.get()) {
            // eslint-disable-next-line react-compiler/react-compiler
            animation.set(0);
        }
        else {
            // Hide the first tooltip which initiated the TooltipSense with animation
            isTooltipSenseInitiator.set(false);
            animation.set(0);
        }
        TooltipSense_1.default.deactivate();
        setIsVisible(false);
    }, [animation, isTooltipSenseInitiator]);
    const onPressOverlay = (0, react_1.useCallback)(() => {
        if (!shouldUseOverlay) {
            return;
        }
        setShouldUseOverlay(false);
        hideTooltip();
    }, [shouldUseOverlay, hideTooltip]);
    // Skip the tooltip and return the children if the text is empty, we don't have a render function.
    if (StringUtils_1.default.isEmptyString(text) && renderTooltipContent == null) {
        // eslint-disable-next-line react-compiler/react-compiler
        return children({ isVisible, showTooltip, hideTooltip, updateTargetBounds });
    }
    return (<>
            {shouldRender && isRendered && (<BaseGenericTooltip_1.default isEducationTooltip={isEducationTooltip} 
        // eslint-disable-next-line react-compiler/react-compiler
        animation={animation} windowWidth={windowWidth} xOffset={xOffset} yOffset={yOffset} targetWidth={wrapperWidth} targetHeight={wrapperHeight} shiftHorizontal={(0, callOrReturn_1.default)(shiftHorizontal)} shiftVertical={(0, callOrReturn_1.default)(shiftVertical)} text={text} maxWidth={maxWidth} minWidth={minWidth} numberOfLines={numberOfLines} renderTooltipContent={renderTooltipContent} 
        // We pass a key, so whenever the content changes this component will completely remount with a fresh state.
        // This prevents flickering/moving while remaining performant.
        key={[text, ...renderTooltipContentKey, preferredLocale].join('-')} shouldForceRenderingBelow={shouldForceRenderingBelow} wrapperStyle={wrapperStyle} anchorAlignment={anchorAlignment} shouldUseOverlay={shouldUseOverlay} shouldTeleportPortalToModalLayer={shouldTeleportPortalToModalLayer} onHideTooltip={onPressOverlay} onTooltipPress={onTooltipPress} computeHorizontalShiftForNative={computeHorizontalShiftForNative}/>)}
            {/* eslint-disable-next-line react-compiler/react-compiler */}
            {children({ isVisible, showTooltip, hideTooltip, updateTargetBounds })}
        </>);
}
GenericTooltip.displayName = 'GenericTooltip';
exports.default = (0, react_1.memo)(GenericTooltip);
