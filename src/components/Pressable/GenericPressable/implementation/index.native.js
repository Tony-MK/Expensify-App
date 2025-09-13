"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseGenericPressable_1 = require("./BaseGenericPressable");
function NativeGenericPressable({ ref, ...props }) {
    return (<BaseGenericPressable_1.default focusable accessible accessibilityHint={props.accessibilityHint ?? props.accessibilityLabel} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref}/>);
}
NativeGenericPressable.displayName = 'NativeGenericPressable';
exports.default = NativeGenericPressable;
