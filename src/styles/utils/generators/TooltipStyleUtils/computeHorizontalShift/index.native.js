"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roundToNearestMultipleOfFour_1 = require("@libs/roundToNearestMultipleOfFour");
const variables_1 = require("@styles/variables");
/** This defines the proximity with the edge of the window in which tooltips should not be displayed.
 * If a tooltip is too close to the edge of the screen, we'll shift it towards the center. */
const GUTTER_WIDTH = variables_1.default.gutterWidth;
/**
 * Compute the amount the tooltip needs to be horizontally shifted in order to keep it from displaying in the gutters.
 *
 * @param windowWidth - The width of the window.
 * @param tooltipLeftEdge - The distance between the left edge of the tooltip
 *                           and the left edge of the wrapped component.
 * @param tooltipWidth - The width of the tooltip itself.
 */
const computeHorizontalShift = (windowWidth, tooltipLeftEdge, tooltipWidth, tooltipWrapperLeft, tooltipWrapperWidth, computeHorizontalShiftForNative = false) => {
    if (!computeHorizontalShiftForNative) {
        return 0;
    }
    const tooltipRightEdge = tooltipLeftEdge + tooltipWidth;
    const tooltipWrapperRight = tooltipWrapperLeft + tooltipWrapperWidth;
    if (tooltipWrapperLeft < 0 || tooltipWrapperRight > windowWidth) {
        return 0;
    }
    if (tooltipLeftEdge < GUTTER_WIDTH) {
        // Tooltip is in left gutter, shift right by a multiple of four.
        return (0, roundToNearestMultipleOfFour_1.default)(GUTTER_WIDTH - tooltipLeftEdge);
    }
    if (tooltipRightEdge > windowWidth - GUTTER_WIDTH) {
        // Tooltip is in right gutter, shift left by a multiple of four.
        return (0, roundToNearestMultipleOfFour_1.default)(windowWidth - GUTTER_WIDTH - tooltipRightEdge);
    }
    // Tooltip is not in the gutter, so no need to shift it horizontally
    return 0;
};
exports.default = computeHorizontalShift;
