"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ActionSheetAwareScrollView = require("@components/ActionSheetAwareScrollView");
const Popover_1 = require("@components/Popover");
const usePrevious_1 = require("@hooks/usePrevious");
const useSidePanel_1 = require("@hooks/useSidePanel");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const ComposerFocusManager_1 = require("@libs/ComposerFocusManager");
const PopoverWithMeasuredContentUtils_1 = require("@libs/PopoverWithMeasuredContentUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
/**
 * This is a convenient wrapper around the regular Popover component that allows us to use a more sophisticated
 * positioning schema responsively (without having to provide a static width and height for the popover content).
 * This way, we can shift the position of popover so that the content is anchored where we want it relative to the
 * anchor position.
 */
function PopoverWithMeasuredContentBase({ popoverDimensions = {
    width: CONST_1.default.POPOVER_DROPDOWN_WIDTH,
    height: CONST_1.default.POPOVER_DROPDOWN_MIN_HEIGHT,
}, anchorPosition, isVisible, anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
}, children, withoutOverlay = false, fullscreen = true, shouldCloseOnOutsideClick = false, shouldSetModalVisibility = true, statusBarTranslucent = true, navigationBarTranslucent = true, avoidKeyboard = false, hideModalContentWhileAnimating = false, anchorDimensions = {
    height: 0,
    width: 0,
}, shouldSwitchPositionIfOverflow = false, shouldHandleNavigationBack = false, shouldEnableNewFocusManagement, shouldMeasureAnchorPositionFromTop = false, shouldSkipRemeasurement = false, ...props }) {
    const actionSheetAwareScrollViewContext = (0, react_1.useContext)(ActionSheetAwareScrollView.ActionSheetAwareScrollViewContext);
    const styles = (0, useThemeStyles_1.default)();
    const { windowWidth, windowHeight } = (0, useWindowDimensions_1.default)();
    const [popoverWidth, setPopoverWidth] = (0, react_1.useState)(popoverDimensions.width);
    const [popoverHeight, setPopoverHeight] = (0, react_1.useState)(popoverDimensions.height);
    const [isContentMeasured, setIsContentMeasured] = (0, react_1.useState)(popoverWidth > 0 && popoverHeight > 0);
    const prevIsVisible = (0, usePrevious_1.default)(isVisible);
    const prevAnchorPosition = (0, usePrevious_1.default)(anchorPosition);
    const { shouldHideSidePanel } = (0, useSidePanel_1.default)();
    const availableWidth = windowWidth - (shouldHideSidePanel ? 0 : variables_1.default.sideBarWidth);
    const prevWindowDimensions = (0, usePrevious_1.default)({ availableWidth, windowHeight });
    const hasStaticDimensions = popoverDimensions.width > 0 && popoverDimensions.height > 0;
    const modalId = (0, react_1.useMemo)(() => ComposerFocusManager_1.default.getId(), []);
    (0, react_1.useEffect)(() => {
        if (prevIsVisible || !isVisible || !shouldEnableNewFocusManagement) {
            return;
        }
        ComposerFocusManager_1.default.saveFocusState(modalId);
    }, [isVisible, shouldEnableNewFocusManagement, prevIsVisible, modalId]);
    if (!prevIsVisible && isVisible && isContentMeasured && !shouldSkipRemeasurement) {
        // Check if anything significant changed that would require re-measurement
        const hasAnchorPositionChanged = !(0, fast_equals_1.deepEqual)(prevAnchorPosition, anchorPosition);
        const hasWindowSizeChanged = !(0, fast_equals_1.deepEqual)(prevWindowDimensions, { availableWidth, windowHeight });
        // Only reset if:
        // 1. We don't have static dimensions, OR
        // 2. The anchor position changed significantly, OR
        // 3. The window size changed significantly
        if (!hasStaticDimensions || hasAnchorPositionChanged || hasWindowSizeChanged) {
            setIsContentMeasured(false);
        }
    }
    /**
     * Measure the size of the popover's content.
     */
    const measurePopover = ({ nativeEvent }) => {
        const { width, height } = nativeEvent.layout;
        if (width !== 0 && !hasStaticDimensions) {
            setPopoverWidth(width);
        }
        if (height !== 0 && !hasStaticDimensions) {
            setPopoverHeight(height);
        }
        setIsContentMeasured(true);
        // it handles the case when `measurePopover` is called with values like: 192, 192.00003051757812, 192
        // if we update it, then animation in `ActionSheetAwareScrollView` may be re-running
        // and we'll see out-of-sync and junky animation
        if (actionSheetAwareScrollViewContext.currentActionSheetState.get().current.payload?.popoverHeight !== Math.floor(height) && height !== 0) {
            actionSheetAwareScrollViewContext.transitionActionSheetState({
                type: ActionSheetAwareScrollView.Actions.MEASURE_POPOVER,
                payload: {
                    popoverHeight: Math.floor(height),
                },
            });
        }
    };
    const adjustedAnchorPosition = (0, react_1.useMemo)(() => {
        let horizontalConstraint;
        switch (anchorAlignment.horizontal) {
            case CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT:
                horizontalConstraint = { left: anchorPosition.horizontal - popoverWidth };
                break;
            case CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER:
                horizontalConstraint = {
                    left: Math.floor(anchorPosition.horizontal - popoverWidth / 2),
                };
                break;
            case CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT:
            default:
                horizontalConstraint = { left: anchorPosition.horizontal };
        }
        let verticalConstraint;
        switch (anchorAlignment.vertical) {
            case CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM:
                verticalConstraint = { top: anchorPosition.vertical - popoverHeight };
                break;
            case CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.CENTER:
                verticalConstraint = {
                    top: Math.floor(anchorPosition.vertical - popoverHeight / 2),
                };
                break;
            case CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP:
            default:
                verticalConstraint = { top: anchorPosition.vertical };
        }
        return {
            ...horizontalConstraint,
            ...verticalConstraint,
        };
    }, [anchorPosition, anchorAlignment, popoverWidth, popoverHeight]);
    const positionCalculations = (0, react_1.useMemo)(() => {
        const horizontalShift = PopoverWithMeasuredContentUtils_1.default.computeHorizontalShift(adjustedAnchorPosition.left, popoverWidth, availableWidth);
        const verticalShift = PopoverWithMeasuredContentUtils_1.default.computeVerticalShift(adjustedAnchorPosition.top, popoverHeight, windowHeight, anchorDimensions.height, shouldSwitchPositionIfOverflow);
        return { horizontalShift, verticalShift };
    }, [adjustedAnchorPosition.left, adjustedAnchorPosition.top, popoverWidth, popoverHeight, availableWidth, windowHeight, anchorDimensions.height, shouldSwitchPositionIfOverflow]);
    const shiftedAnchorPosition = (0, react_1.useMemo)(() => {
        const result = {
            left: adjustedAnchorPosition.left + positionCalculations.horizontalShift,
        };
        if (shouldMeasureAnchorPositionFromTop) {
            result.top = adjustedAnchorPosition.top + positionCalculations.verticalShift;
        }
        if (anchorAlignment.vertical === CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP) {
            const top = adjustedAnchorPosition.top + positionCalculations.verticalShift;
            const maxTop = windowHeight - popoverHeight - positionCalculations.verticalShift;
            result.top = Math.min(Math.max(positionCalculations.verticalShift, top), maxTop);
        }
        if (anchorAlignment.vertical === CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM) {
            result.bottom = windowHeight - (adjustedAnchorPosition.top + popoverHeight) - positionCalculations.verticalShift;
        }
        return result;
    }, [adjustedAnchorPosition, positionCalculations, anchorAlignment.vertical, windowHeight, popoverHeight, shouldMeasureAnchorPositionFromTop]);
    return isContentMeasured ? (<Popover_1.default shouldHandleNavigationBack={shouldHandleNavigationBack} popoverDimensions={{ height: popoverHeight, width: popoverWidth }} anchorAlignment={anchorAlignment} isVisible={isVisible} withoutOverlay={withoutOverlay} fullscreen={fullscreen} shouldCloseOnOutsideClick={shouldCloseOnOutsideClick} shouldSetModalVisibility={shouldSetModalVisibility} statusBarTranslucent={statusBarTranslucent} navigationBarTranslucent={navigationBarTranslucent} avoidKeyboard={avoidKeyboard} hideModalContentWhileAnimating={hideModalContentWhileAnimating} modalId={modalId} shouldEnableNewFocusManagement={shouldEnableNewFocusManagement} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} anchorPosition={shiftedAnchorPosition}>
            <react_native_1.View onLayout={measurePopover}>{(isVisible || prevIsVisible) && children}</react_native_1.View>
        </Popover_1.default>) : (
    /*
  This is an invisible view used to measure the size of the popover,
  before it ever needs to be displayed.
  We do this because we need to know its dimensions in order to correctly animate the popover,
  but we can't measure its dimensions without first rendering it.
*/
    <react_native_1.View style={styles.invisiblePopover} onLayout={measurePopover}>
            {children}
        </react_native_1.View>);
}
PopoverWithMeasuredContentBase.displayName = 'PopoverWithMeasuredContentBase';
exports.default = react_1.default.memo(PopoverWithMeasuredContentBase, (prevProps, nextProps) => {
    if (prevProps.isVisible === nextProps.isVisible && nextProps.isVisible === false) {
        return true;
    }
    return (0, fast_equals_1.circularDeepEqual)(prevProps, nextProps);
});
