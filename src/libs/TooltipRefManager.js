"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const tooltipRef = react_1.default.createRef();
const TooltipRefManager = {
    ref: tooltipRef,
    hideTooltip: () => {
        tooltipRef.current?.hideTooltip();
    },
};
exports.default = TooltipRefManager;
