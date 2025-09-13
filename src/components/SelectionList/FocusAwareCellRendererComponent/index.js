"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
function FocusAwareCellRendererComponent({ onFocusCapture, ...rest }) {
    return (<react_native_1.View 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} 
    // Forward bubbled events to VirtualizedList's captured handler which is not supported on web platforms.
    onFocus={onFocusCapture}/>);
}
FocusAwareCellRendererComponent.displayName = 'FocusAwareCellRendererComponent';
exports.default = FocusAwareCellRendererComponent;
