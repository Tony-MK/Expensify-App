"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseValidateCodeForm_1 = require("./BaseValidateCodeForm");
function ValidateCodeForm({ ref, ...props }) {
    return (<BaseValidateCodeForm_1.default autoComplete="one-time-code" ref={ref} 
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props}/>);
}
ValidateCodeForm.displayName = 'ValidateCodeForm';
exports.default = ValidateCodeForm;
