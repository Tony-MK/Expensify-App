"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCursorPosition({ positionOnWeb }) {
    const x = positionOnWeb?.positionX ?? 0;
    const y = positionOnWeb?.positionY ?? 0;
    return { x, y };
}
exports.default = getCursorPosition;
