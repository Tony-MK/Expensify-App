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
var react_native_1 = require("react-native");
var index_1 = require("@libs/ComponentUtils/index");
var mergeRefs_1 = require("@libs/mergeRefs");
var preventFormDefault = function (event) {
    // When Enter is pressed, the form is submitted to the action URL (POST /).
    // As we are using a controlled component, we need to disable this behavior here.
    event.preventDefault();
};
function FormElement(_a) {
    var ref = _a.ref, props = __rest(_a, ["ref"]);
    var formRef = (0, react_1.useRef)(null);
    // eslint-disable-next-line react-compiler/react-compiler
    var mergedRef = (0, mergeRefs_1.default)(formRef, ref);
    (0, react_1.useEffect)(function () {
        var formCurrent = formRef.current;
        if (!formCurrent) {
            return;
        }
        // Prevent the browser from applying its own validation, which affects the email input
        formCurrent.setAttribute('novalidate', '');
        // Password Managers need these attributes to be able to identify the form elements properly.
        formCurrent.setAttribute('method', 'post');
        formCurrent.setAttribute('action', '/');
        formCurrent.addEventListener('submit', preventFormDefault);
        return function () {
            formCurrent.removeEventListener('submit', preventFormDefault);
        };
    }, []);
    return (<react_native_1.View role={index_1.ACCESSIBILITY_ROLE_FORM} ref={mergedRef} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
FormElement.displayName = 'FormElement';
exports.default = FormElement;
