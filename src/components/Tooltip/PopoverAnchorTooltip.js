"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PopoverProvider_1 = require("@components/PopoverProvider");
const BaseTooltip_1 = require("./BaseTooltip");
function PopoverAnchorTooltip({ shouldRender = true, children, ...props }) {
    const { isOpen, popoverAnchor } = (0, react_1.useContext)(PopoverProvider_1.PopoverContext);
    const tooltipRef = (0, react_1.useRef)(null);
    const isPopoverRelatedToTooltipOpen = (0, react_1.useMemo)(() => {
        // eslint-disable-next-line @typescript-eslint/dot-notation, react-compiler/react-compiler
        const tooltipNode = tooltipRef.current?.['_childNode'] ?? null;
        if (isOpen && popoverAnchor && tooltipNode && ((popoverAnchor instanceof Node && tooltipNode.contains(popoverAnchor)) || tooltipNode === popoverAnchor)) {
            return true;
        }
        return false;
    }, [isOpen, popoverAnchor]);
    if (!shouldRender || isPopoverRelatedToTooltipOpen) {
        return children;
    }
    return (<BaseTooltip_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={tooltipRef}>
            {children}
        </BaseTooltip_1.default>);
}
PopoverAnchorTooltip.displayName = 'PopoverAnchorTooltip';
exports.default = PopoverAnchorTooltip;
