"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash/debounce");
const CONST_1 = require("@src/CONST");
let active = false;
/**
 * Debounced function to deactivate the TooltipSense after a specific time
 */
const debouncedDeactivate = (0, debounce_1.default)(() => {
    active = false;
}, CONST_1.default.TIMING.TOOLTIP_SENSE);
function activate() {
    active = true;
    debouncedDeactivate.cancel();
}
function deactivate() {
    return debouncedDeactivate();
}
function isActive() {
    return active === true;
}
exports.default = {
    activate,
    deactivate,
    isActive,
};
