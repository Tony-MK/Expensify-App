"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A wrapper View component allowing us to register a container element for a FocusTrap
 */
const react_1 = require("react");
const react_native_1 = require("react-native");
function FocusTrapContainerElement({ onContainerElementChanged, ref, ...props }) {
    return (<react_native_1.View ref={(node) => {
            const r = ref;
            if (typeof r === 'function') {
                r(node);
            }
            else if (r) {
                r.current = node;
            }
            onContainerElementChanged?.(node);
        }} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
FocusTrapContainerElement.displayName = 'FocusTrapContainerElement';
exports.default = FocusTrapContainerElement;
