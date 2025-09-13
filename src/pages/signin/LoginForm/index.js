"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseLoginForm_1 = require("./BaseLoginForm");
function LoginForm({ ref, ...props }) {
    return (<BaseLoginForm_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref}/>);
}
LoginForm.displayName = 'LoginForm';
exports.default = LoginForm;
