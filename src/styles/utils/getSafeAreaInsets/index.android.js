"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultInsets_1 = require("./defaultInsets");
/**
 * On Android we want to use the StatusBar height rather than the top safe area inset.
 * @returns
 */
function getSafeAreaInsets(safeAreaInsets) {
    const insets = safeAreaInsets ?? defaultInsets_1.default;
    return insets;
}
exports.default = getSafeAreaInsets;
