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
var BaseValidateCodeForm_1 = require("./BaseValidateCodeForm");
function ValidateCodeForm(_a) {
    var ref = _a.ref, props = __rest(_a, ["ref"]);
    return (<BaseValidateCodeForm_1.default autoComplete="sms-otp" ref={ref} 
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props}/>);
}
ValidateCodeForm.displayName = 'ValidateCodeForm';
exports.default = ValidateCodeForm;
