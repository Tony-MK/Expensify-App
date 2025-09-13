"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bounds_observer_1 = require("@react-ng/bounds-observer");
const react_1 = require("react");
const Hoverable_1 = require("@components/Hoverable");
const GenericTooltip_1 = require("@components/Tooltip/GenericTooltip");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const deviceHasHoverSupport = (0, DeviceCapabilities_1.hasHoverSupport)();
/**
 * A component used to wrap an element intended for displaying a tooltip. The term "tooltip's target" refers to the
 * wrapped element, which, upon hover, triggers the tooltip to be shown.
 */
/**
 * Choose the correct bounding box for the tooltip to be positioned against.
 * This handles the case where the target is wrapped across two lines, and
 * so we need to find the correct part (the one that the user is hovering
 * over) and show the tooltip there.
 *
 * @param target The DOM element being hovered over.
 * @param clientX The X position from the MouseEvent.
 * @param clientY The Y position from the MouseEvent.
 * @return The chosen bounding box.
 */
function chooseBoundingBox(target, clientX, clientY) {
    const slop = 5;
    const bbs = target.getClientRects();
    const clientXMin = clientX - slop;
    const clientXMax = clientX + slop;
    const clientYMin = clientY - slop;
    const clientYMax = clientY + slop;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < bbs.length; i++) {
        const bb = bbs[i];
        if (clientXMin <= bb.right && clientXMax >= bb.left && clientYMin <= bb.bottom && clientYMax >= bb.top) {
            return bb;
        }
    }
    // If no matching bounding box is found, fall back to getBoundingClientRect.
    return target.getBoundingClientRect();
}
function Tooltip({ children, shouldHandleScroll = false, isFocused = true, ref, ...props }) {
    const target = (0, react_1.useRef)(null);
    const initialMousePosition = (0, react_1.useRef)({ x: 0, y: 0 });
    const updateTargetAndMousePosition = (0, react_1.useCallback)((e) => {
        if (!(e.currentTarget instanceof HTMLElement)) {
            return;
        }
        target.current = e.currentTarget;
        initialMousePosition.current = { x: e.clientX, y: e.clientY };
    }, []);
    /**
     * Get the tooltip bounding rectangle
     */
    const getBounds = (bounds) => {
        if (!target.current) {
            return bounds;
        }
        // Choose a bounding box for the tooltip to target.
        // In the case when the target is a link that has wrapped onto
        // multiple lines, we want to show the tooltip over the part
        // of the link that the user is hovering over.
        return chooseBoundingBox(target.current, initialMousePosition.current.x, initialMousePosition.current.y);
    };
    const updateTargetPositionOnMouseEnter = (0, react_1.useCallback)((e) => {
        updateTargetAndMousePosition(e);
        if (react_1.default.isValidElement(children)) {
            const onMouseEnter = children.props.onMouseEnter;
            onMouseEnter?.(e);
        }
    }, [children, updateTargetAndMousePosition]);
    // Skip the tooltip and return the children if the device does not support hovering
    if (!deviceHasHoverSupport) {
        return children;
    }
    // Skip the tooltip and return the children if navigation does not focus.
    if (!isFocused) {
        return children;
    }
    return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <GenericTooltip_1.default {...props}>
            {({ isVisible, showTooltip, hideTooltip, updateTargetBounds }) => 
        // Checks if valid element so we can wrap the BoundsObserver around it
        // If not, we just return the primitive children
        react_1.default.isValidElement(children) ? (<bounds_observer_1.BoundsObserver enabled={isVisible} onBoundsChange={(bounds) => {
                updateTargetBounds(getBounds(bounds));
            }} ref={ref}>
                        <Hoverable_1.default onHoverIn={showTooltip} onHoverOut={hideTooltip} shouldHandleScroll={shouldHandleScroll}>
                            {react_1.default.cloneElement(children, {
                onMouseEnter: updateTargetPositionOnMouseEnter,
            })}
                        </Hoverable_1.default>
                    </bounds_observer_1.BoundsObserver>) : (children)}
        </GenericTooltip_1.default>);
}
Tooltip.displayName = 'Tooltip';
exports.default = (0, react_1.memo)(Tooltip);
