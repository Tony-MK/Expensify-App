"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const GenericTooltip_1 = require("@components/Tooltip/GenericTooltip");
const useIsResizing_1 = require("@hooks/useIsResizing");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const measureTooltipCoordinate_1 = require("./measureTooltipCoordinate");
/**
 * A component used to wrap an element intended for displaying a tooltip.
 * This tooltip would show immediately without user's interaction and hide after 5 seconds.
 */
function BaseEducationalTooltip({ children, shouldRender = false, shouldHideOnNavigate = true, shouldHideOnScroll = false, ...props }) {
    const genericTooltipStateRef = (0, react_1.useRef)(undefined);
    const tooltipElementRef = (0, react_1.useRef)(undefined);
    const [shouldMeasure, setShouldMeasure] = (0, react_1.useState)(false);
    const show = (0, react_1.useRef)(undefined);
    const navigator = (0, react_1.useContext)(native_1.NavigationContext);
    const isFocused = (0, native_1.useIsFocused)();
    const insets = (0, useSafeAreaInsets_1.default)();
    const isResizing = (0, useIsResizing_1.default)();
    const shouldSuppressTooltip = !isFocused && shouldHideOnNavigate;
    const renderTooltip = (0, react_1.useCallback)(() => {
        if (!tooltipElementRef.current || !genericTooltipStateRef.current || shouldSuppressTooltip) {
            return;
        }
        const { hideTooltip, showTooltip, updateTargetBounds } = genericTooltipStateRef.current;
        (0, measureTooltipCoordinate_1.getTooltipCoordinates)(tooltipElementRef.current, (bounds) => {
            updateTargetBounds(bounds);
            const { x, y, width: elementWidth, height } = bounds;
            const offset = 10; // Tooltip hides when content moves 10px past header/footer.
            const dimensions = react_native_1.Dimensions.get('window');
            const top = y - (insets.top || 0);
            const bottom = y + height + insets.bottom || 0;
            const left = x - (insets.left || 0);
            const right = x + elementWidth + (insets.right || 0);
            // Calculate the available space at the top, considering the header height and offset
            const availableHeightForTop = top - (variables_1.default.contentHeaderHeight - offset);
            // Calculate the total height available after accounting for the bottom tab and offset
            const availableHeightForBottom = dimensions.height - (bottom + variables_1.default.bottomTabHeight - offset);
            // Calculate available horizontal space, taking into account safe-area insets
            const availableWidthForLeft = left - offset;
            const availableWidthForRight = dimensions.width - (right - offset);
            // Hide if the element scrolled out vertically or horizontally
            if (availableHeightForTop < 0 || availableHeightForBottom < 0 || availableWidthForLeft < 0 || availableWidthForRight < 0) {
                hideTooltip();
            }
            else {
                showTooltip();
            }
        });
    }, [insets, shouldSuppressTooltip]);
    (0, react_1.useEffect)(() => {
        if (!genericTooltipStateRef.current || !shouldRender) {
            return;
        }
        if (isResizing) {
            const { hideTooltip } = genericTooltipStateRef.current;
            // Hide the tooltip if the screen is being resized
            hideTooltip();
        }
        else {
            // Re-render the tooltip when resizing ends
            // This is necessary to ensure the tooltip is positioned correctly after resizing
            renderTooltip();
        }
    }, [isResizing, renderTooltip, shouldRender]);
    const setTooltipPosition = (0, react_1.useCallback)((isScrolling) => {
        if (!shouldHideOnScroll || !genericTooltipStateRef.current) {
            return;
        }
        const { hideTooltip } = genericTooltipStateRef.current;
        if (isScrolling) {
            hideTooltip();
        }
        else {
            renderTooltip();
        }
    }, [renderTooltip, shouldHideOnScroll]);
    (0, react_1.useLayoutEffect)(() => {
        if (!shouldRender || !shouldHideOnScroll) {
            return;
        }
        setTooltipPosition(false);
        const scrollingListener = react_native_1.DeviceEventEmitter.addListener(CONST_1.default.EVENTS.SCROLLING, ({ isScrolling } = { isScrolling: false }) => {
            setTooltipPosition(isScrolling);
        });
        return () => scrollingListener.remove();
    }, [shouldRender, shouldHideOnScroll, setTooltipPosition]);
    (0, react_1.useEffect)(() => {
        return () => {
            genericTooltipStateRef.current?.hideTooltip();
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!shouldMeasure || shouldSuppressTooltip) {
            return;
        }
        if (!shouldRender) {
            genericTooltipStateRef.current?.hideTooltip();
            return;
        }
        // When tooltip is used inside an animated view (e.g. popover), we need to wait for the animation to finish before measuring content.
        const timerID = setTimeout(() => {
            show.current?.();
        }, CONST_1.default.TOOLTIP_ANIMATION_DURATION);
        return () => {
            clearTimeout(timerID);
        };
    }, [shouldMeasure, shouldRender, shouldSuppressTooltip]);
    (0, react_1.useEffect)(() => {
        if (!navigator) {
            return;
        }
        const unsubscribe = navigator.addListener('blur', () => {
            if (!shouldHideOnNavigate) {
                return;
            }
            genericTooltipStateRef.current?.hideTooltip();
        });
        return unsubscribe;
    }, [navigator, shouldHideOnNavigate]);
    return (<GenericTooltip_1.default shouldForceAnimate shouldRender={shouldRender} isEducationTooltip 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            {(genericTooltipState) => {
            const { updateTargetBounds, showTooltip } = genericTooltipState;
            // eslint-disable-next-line react-compiler/react-compiler
            genericTooltipStateRef.current = genericTooltipState;
            return react_1.default.cloneElement(children, {
                onLayout: (e) => {
                    if (!shouldMeasure) {
                        setShouldMeasure(true);
                    }
                    // e.target is specific to native, use e.nativeEvent.target on web instead
                    const target = e.target || e.nativeEvent.target;
                    tooltipElementRef.current = target;
                    show.current = () => (0, measureTooltipCoordinate_1.default)(target, updateTargetBounds, showTooltip);
                },
            });
        }}
        </GenericTooltip_1.default>);
}
BaseEducationalTooltip.displayName = 'BaseEducationalTooltip';
exports.default = (0, react_1.memo)(BaseEducationalTooltip);
