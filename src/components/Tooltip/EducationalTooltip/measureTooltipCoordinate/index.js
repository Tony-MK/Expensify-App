"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = measureTooltipCoordinate;
exports.getTooltipCoordinates = getTooltipCoordinates;
function measureTooltipCoordinate(target, updateTargetBounds, showTooltip) {
    return target?.measureInWindow((x, y, width, height) => {
        updateTargetBounds({ height, width, x, y });
        showTooltip();
    });
}
function getTooltipCoordinates(target, callback) {
    return target?.measureInWindow((x, y, width, height) => {
        callback({ height, width, x, y });
    });
}
