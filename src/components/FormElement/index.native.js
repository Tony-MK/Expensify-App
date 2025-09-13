"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
function FormElement({ ref, ...props }) {
    return (<react_native_1.View ref={ref} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
FormElement.displayName = 'FormElement';
exports.default = FormElement;
