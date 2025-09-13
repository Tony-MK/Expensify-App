"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = calculateAnchorPosition;
const CONST_1 = require("@src/CONST");
/**
 * Gets the x,y position of the passed in component for the purpose of anchoring another component to it.
 */
function calculateAnchorPosition(anchorComponent, anchorOrigin) {
    return new Promise((resolve) => {
        if (!anchorComponent || !('measureInWindow' in anchorComponent)) {
            resolve({ horizontal: 0, vertical: 0, width: 0, height: 0 });
            return;
        }
        anchorComponent.measureInWindow((x, y, width, height) => {
            if (anchorOrigin?.vertical === CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP && anchorOrigin?.horizontal === CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT) {
                resolve({ horizontal: x, vertical: y + height + (anchorOrigin?.shiftVertical ?? 0), width, height });
                return;
            }
            resolve({ horizontal: x + width, vertical: y + (anchorOrigin?.shiftVertical ?? 0), width, height });
        });
    });
}
