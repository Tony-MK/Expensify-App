"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AppStateMonitor_1 = require("@libs/AppStateMonitor");
const BaseLoginForm_1 = require("./BaseLoginForm");
function LoginForm({ scrollPageToTop, ref, ...rest }) {
    const loginFormRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => ({
        isInputFocused: loginFormRef.current ? loginFormRef.current.isInputFocused : () => false,
        clearDataAndFocus: loginFormRef.current ? loginFormRef.current?.clearDataAndFocus : () => null,
    }));
    (0, react_1.useEffect)(() => {
        if (!scrollPageToTop) {
            return;
        }
        return AppStateMonitor_1.default.addBecameActiveListener(() => {
            const isInputFocused = loginFormRef.current?.isInputFocused();
            if (!isInputFocused) {
                return;
            }
            scrollPageToTop();
        });
    }, [scrollPageToTop]);
    return (<BaseLoginForm_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} scrollPageToTop={scrollPageToTop} ref={loginFormRef}/>);
}
LoginForm.displayName = 'LoginForm';
exports.default = LoginForm;
