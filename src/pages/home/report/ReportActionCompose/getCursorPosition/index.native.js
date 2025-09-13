"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCursorPosition({ positionOnMobile }) {
    return {
        x: positionOnMobile?.x ?? 0,
        y: positionOnMobile?.y ?? 0,
    };
}
exports.default = getCursorPosition;
