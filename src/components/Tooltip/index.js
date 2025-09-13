"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseTooltip_1 = require("./BaseTooltip");
function Tooltip({ shouldRender = true, children, ...props }) {
    if (!shouldRender) {
        return children;
    }
    return (<BaseTooltip_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            {children}
        </BaseTooltip_1.default>);
}
Tooltip.displayName = 'Tooltip';
exports.default = Tooltip;
