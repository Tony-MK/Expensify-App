"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = measureTooltipCoordinate;
exports.getTooltipCoordinates = getTooltipCoordinates;
function measureTooltipCoordinate(target, updateTargetBounds, showTooltip) {
    return target?.measure((x, y, width, height, px, py) => {
        updateTargetBounds({ height, width, x: px, y: py });
        showTooltip();
    });
}
function getTooltipCoordinates(target, callback) {
    return target?.measure((x, y, width, height, px, py) => {
        callback({ height, width, x: px, y: py });
    });
}
