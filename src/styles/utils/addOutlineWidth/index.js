"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Adds the addOutlineWidth property to an object to be used when styling
 */
const addOutlineWidth = (theme, obj, val, hasError = false) => ({
    ...obj,
    outlineWidth: val,
    outlineStyle: val ? 'auto' : 'none',
    boxShadow: val !== 0 ? `0px 0px 0px ${val}px ${hasError ? theme.danger : theme.borderFocus}` : 'none',
});
exports.default = addOutlineWidth;
