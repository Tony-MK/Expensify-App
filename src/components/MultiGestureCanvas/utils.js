"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCanvasFitScale = void 0;
exports.clamp = clamp;
/** Clamps a value between a lower and upper bound */
function clamp(value, lowerBound, upperBound) {
    'worklet';
    return Math.min(Math.max(lowerBound, value), upperBound);
}
// Small buffer to prevent hairline spacing issues caused by floating-point precision errors
// When scaling images, rounding can create sub-pixel gaps that appear as thin lines
const SCALE_BUFFER = 1.001;
const getCanvasFitScale = ({ canvasSize, contentSize }) => {
    const scaleX = clamp(canvasSize.width / contentSize.width, 0, 1);
    const scaleY = clamp(canvasSize.height / contentSize.height, 0, 1);
    // Apply small buffer to ensure scaled image always fills container completely,
    // eliminating hairline spaces that can appear due to rounding precision
    const minScale = Math.min(scaleX, scaleY) * SCALE_BUFFER;
    const maxScale = Math.max(scaleX, scaleY);
    return { scaleX, scaleY, minScale, maxScale };
};
exports.getCanvasFitScale = getCanvasFitScale;
