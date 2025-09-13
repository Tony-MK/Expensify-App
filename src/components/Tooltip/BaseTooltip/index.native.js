"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// We can't use the common component for the Tooltip as Web implementation uses DOM specific method
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Tooltip({ children, ref }) {
    return children;
}
Tooltip.displayName = 'Tooltip';
exports.default = Tooltip;
