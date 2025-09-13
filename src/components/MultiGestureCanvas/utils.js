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
var SCALE_BUFFER = 1.001;
var getCanvasFitScale = function (_a) {
    var canvasSize = _a.canvasSize, contentSize = _a.contentSize;
    var scaleX = clamp(canvasSize.width / contentSize.width, 0, 1);
    var scaleY = clamp(canvasSize.height / contentSize.height, 0, 1);
    // Apply small buffer to ensure scaled image always fills container completely,
    // eliminating hairline spaces that can appear due to rounding precision
    var minScale = Math.min(scaleX, scaleY) * SCALE_BUFFER;
    var maxScale = Math.max(scaleX, scaleY);
    return { scaleX: scaleX, scaleY: scaleY, minScale: minScale, maxScale: maxScale };
};
exports.getCanvasFitScale = getCanvasFitScale;
