"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const index_1 = require("@libs/ComponentUtils/index");
const mergeRefs_1 = require("@libs/mergeRefs");
const preventFormDefault = (event) => {
    // When Enter is pressed, the form is submitted to the action URL (POST /).
    // As we are using a controlled component, we need to disable this behavior here.
    event.preventDefault();
};
function FormElement({ ref, ...props }) {
    const formRef = (0, react_1.useRef)(null);
    // eslint-disable-next-line react-compiler/react-compiler
    const mergedRef = (0, mergeRefs_1.default)(formRef, ref);
    (0, react_1.useEffect)(() => {
        const formCurrent = formRef.current;
        if (!formCurrent) {
            return;
        }
        // Prevent the browser from applying its own validation, which affects the email input
        formCurrent.setAttribute('novalidate', '');
        // Password Managers need these attributes to be able to identify the form elements properly.
        formCurrent.setAttribute('method', 'post');
        formCurrent.setAttribute('action', '/');
        formCurrent.addEventListener('submit', preventFormDefault);
        return () => {
            formCurrent.removeEventListener('submit', preventFormDefault);
        };
    }, []);
    return (<react_native_1.View role={index_1.ACCESSIBILITY_ROLE_FORM} ref={mergedRef} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
FormElement.displayName = 'FormElement';
exports.default = FormElement;
