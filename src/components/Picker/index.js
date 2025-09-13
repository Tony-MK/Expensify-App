"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var BasePicker_1 = require("./BasePicker");
function Picker(_a) {
    var ref = _a.ref, props = __rest(_a, ["ref"]);
    var additionalPickerEvents = function (onMouseDown, onChange) { return ({
        onMouseDown: onMouseDown,
        onChange: function (e) {
            if (e.target.selectedIndex === undefined) {
                return;
            }
            var index = e.target.selectedIndex;
            var value = e.target.options[index].value;
            onChange(value, index);
        },
    }); };
    return (<BasePicker_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} 
    // Forward the ref to Picker, as we implement imperative methods there
    ref={ref} 
    // On the Web, focusing the inner picker improves the accessibility,
    // but doesn't open the picker (which we don't want), like it does on
    // Native.
    shouldFocusPicker key={props.inputID} additionalPickerEvents={additionalPickerEvents}/>);
}
exports.default = Picker;
