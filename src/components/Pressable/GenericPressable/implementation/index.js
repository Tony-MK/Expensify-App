"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseGenericPressable_1 = require("./BaseGenericPressable");
function WebGenericPressable({ focusable = true, ref, ...props }) {
    const accessible = (props.accessible ?? props.accessible === undefined) ? true : props.accessible;
    return (<BaseGenericPressable_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref} 
    // change native accessibility props to web accessibility props
    focusable={focusable} tabIndex={(props.tabIndex ?? (!accessible || !focusable)) ? -1 : 0} role={(props.accessibilityRole ?? props.role)} id={props.id} aria-label={props.accessibilityLabel} aria-labelledby={props.accessibilityLabelledBy} aria-valuenow={props.accessibilityValue?.now} aria-valuemin={props.accessibilityValue?.min} aria-valuemax={props.accessibilityValue?.max} aria-valuetext={props.accessibilityValue?.text} dataSet={{ tag: 'pressable', ...(props.noDragArea && { dragArea: false }), ...props.dataSet }}/>);
}
WebGenericPressable.displayName = 'WebGenericPressable';
exports.default = WebGenericPressable;
