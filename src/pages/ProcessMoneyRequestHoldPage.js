"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ProcessMoneyRequestHoldMenu_1 = require("@components/ProcessMoneyRequestHoldMenu");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ProcessMoneyRequestHoldPage() {
    const focusTimeoutRef = (0, react_1.useRef)(null);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, blurActiveElement_1.default)();
            });
        }, CONST_1.default.ANIMATED_TRANSITION);
        return () => focusTimeoutRef.current && clearTimeout(focusTimeoutRef.current);
    }, []));
    const onConfirm = (0, react_1.useCallback)(() => {
        (0, User_1.setNameValuePair)(ONYXKEYS_1.default.NVP_DISMISSED_HOLD_USE_EXPLANATION, true, false);
    }, []);
    return (<ProcessMoneyRequestHoldMenu_1.default onClose={onConfirm} onConfirm={onConfirm}/>);
}
ProcessMoneyRequestHoldPage.displayName = 'ProcessMoneyRequestHoldPage';
exports.default = ProcessMoneyRequestHoldPage;
