"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseUserDetailsTooltip_1 = require("./BaseUserDetailsTooltip");
function UserDetailsTooltip({ shouldRender = true, children, ...props }) {
    if (!shouldRender) {
        return children;
    }
    return (<BaseUserDetailsTooltip_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            {children}
        </BaseUserDetailsTooltip_1.default>);
}
UserDetailsTooltip.displayName = 'UserDetailsTooltip';
exports.default = UserDetailsTooltip;
