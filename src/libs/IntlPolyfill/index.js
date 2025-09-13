"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polyfillNumberFormat_1 = require("./polyfillNumberFormat");
/**
 * Polyfill the Intl API if the ICU version is old.
 * This ensures that the currency data is consistent across platforms and browsers.
 */
const intlPolyfill = () => {
    (0, polyfillNumberFormat_1.default)();
};
exports.default = intlPolyfill;
