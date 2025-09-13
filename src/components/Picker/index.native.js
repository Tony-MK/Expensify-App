"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BasePicker_1 = require("./BasePicker");
function Picker({ ref, ...props }) {
    return (<BasePicker_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} key={props.inputID} ref={ref}/>);
}
exports.default = Picker;
