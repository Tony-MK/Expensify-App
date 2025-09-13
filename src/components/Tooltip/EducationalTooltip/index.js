"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseEducationalTooltip_1 = require("./BaseEducationalTooltip");
function EducationalTooltip({ children, ...props }) {
    const { shouldRender } = props;
    if (!shouldRender) {
        return children;
    }
    return (<BaseEducationalTooltip_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            {children}
        </BaseEducationalTooltip_1.default>);
}
EducationalTooltip.displayName = 'EducationalTooltip';
exports.default = EducationalTooltip;
