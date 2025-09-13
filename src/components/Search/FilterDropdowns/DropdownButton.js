"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const CaretWrapper_1 = require("@components/CaretWrapper");
const PopoverWithMeasuredContent_1 = require("@components/PopoverWithMeasuredContent");
const Text_1 = require("@components/Text");
const withViewportOffsetTop_1 = require("@components/withViewportOffsetTop");
const useOnyx_1 = require("@hooks/useOnyx");
const usePopoverPosition_1 = require("@hooks/usePopoverPosition");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PADDING_MODAL = 8;
const ANCHOR_ORIGIN = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
};
function DropdownButton({ label, value, viewportOffsetTop, PopoverComponent }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to distinguish RHL and narrow layout
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const triggerRef = (0, react_1.useRef)(null);
    const anchorRef = (0, react_1.useRef)(null);
    const [isOverlayVisible, setIsOverlayVisible] = (0, react_1.useState)(false);
    const { calculatePopoverPosition } = (0, usePopoverPosition_1.default)();
    const [popoverTriggerPosition, setPopoverTriggerPosition] = (0, react_1.useState)({
        horizontal: 0,
        vertical: 0,
    });
    const [willAlertModalBecomeVisible] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { selector: (modal) => modal?.willAlertModalBecomeVisible, canBeMissing: true });
    /**
     * Toggle the overlay between open & closed
     */
    const toggleOverlay = (0, react_1.useCallback)(() => {
        setIsOverlayVisible((previousValue) => {
            if (!previousValue && willAlertModalBecomeVisible) {
                return false;
            }
            return !previousValue;
        });
    }, [willAlertModalBecomeVisible]);
    /**
     * Calculate popover position and toggle overlay
     */
    const calculatePopoverPositionAndToggleOverlay = (0, react_1.useCallback)(() => {
        calculatePopoverPosition(anchorRef, ANCHOR_ORIGIN).then((pos) => {
            setPopoverTriggerPosition({ ...pos, vertical: pos.vertical + PADDING_MODAL });
            toggleOverlay();
        });
    }, [calculatePopoverPosition, toggleOverlay]);
    /**
     * When no items are selected, render the label, otherwise, render the
     * list of selected items as well
     */
    const buttonText = (0, react_1.useMemo)(() => {
        if (!value?.length) {
            return label;
        }
        const selectedItems = Array.isArray(value) ? value.join(', ') : value;
        return `${label}: ${selectedItems}`;
    }, [label, value]);
    const containerStyles = (0, react_1.useMemo)(() => {
        if (isSmallScreenWidth) {
            return styles.w100;
        }
        return { width: CONST_1.default.POPOVER_DROPDOWN_WIDTH };
    }, [isSmallScreenWidth, styles]);
    const popoverContent = (0, react_1.useMemo)(() => {
        return PopoverComponent({ closeOverlay: toggleOverlay });
        // PopoverComponent is stable so we don't need it here as a dep.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [toggleOverlay]);
    return (<react_native_1.View ref={anchorRef}>
            {/* Dropdown Trigger */}
            <Button_1.default small ref={triggerRef} innerStyles={[isOverlayVisible && styles.buttonHoveredBG, { maxWidth: 256 }]} onPress={calculatePopoverPositionAndToggleOverlay}>
                <CaretWrapper_1.default style={[styles.flex1, styles.mw100]}>
                    <Text_1.default numberOfLines={1} style={[styles.textMicroBold, styles.flexShrink1]}>
                        {buttonText}
                    </Text_1.default>
                </CaretWrapper_1.default>
            </Button_1.default>

            {/* Dropdown overlay */}
            <PopoverWithMeasuredContent_1.default anchorRef={triggerRef} avoidKeyboard isVisible={isOverlayVisible} onClose={toggleOverlay} anchorPosition={popoverTriggerPosition} anchorAlignment={ANCHOR_ORIGIN} restoreFocusType={CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.DELETE} shouldEnableNewFocusManagement shouldMeasureAnchorPositionFromTop={false} outerStyle={{ ...StyleUtils.getOuterModalStyle(windowHeight, viewportOffsetTop), ...containerStyles }} 
    // This must be false because we dont want the modal to close if we open the RHP for selections
    // such as date years
    shouldCloseWhenBrowserNavigationChanged={false} innerContainerStyle={containerStyles} popoverDimensions={{
            width: CONST_1.default.POPOVER_DROPDOWN_WIDTH,
            height: CONST_1.default.POPOVER_DROPDOWN_MIN_HEIGHT,
        }} shouldSkipRemeasurement>
                {popoverContent}
            </PopoverWithMeasuredContent_1.default>
        </react_native_1.View>);
}
DropdownButton.displayName = 'DropdownButton';
exports.default = (0, withViewportOffsetTop_1.default)(DropdownButton);
