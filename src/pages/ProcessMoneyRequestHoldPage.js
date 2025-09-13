"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var ProcessMoneyRequestHoldMenu_1 = require("@components/ProcessMoneyRequestHoldMenu");
var blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
var User_1 = require("@userActions/User");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function ProcessMoneyRequestHoldPage() {
    var focusTimeoutRef = (0, react_1.useRef)(null);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        focusTimeoutRef.current = setTimeout(function () {
            react_native_1.InteractionManager.runAfterInteractions(function () {
                (0, blurActiveElement_1.default)();
            });
        }, CONST_1.default.ANIMATED_TRANSITION);
        return function () { return focusTimeoutRef.current && clearTimeout(focusTimeoutRef.current); };
    }, []));
    var onConfirm = (0, react_1.useCallback)(function () {
        (0, User_1.setNameValuePair)(ONYXKEYS_1.default.NVP_DISMISSED_HOLD_USE_EXPLANATION, true, false);
    }, []);
    return (<ProcessMoneyRequestHoldMenu_1.default onClose={onConfirm} onConfirm={onConfirm}/>);
}
ProcessMoneyRequestHoldPage.displayName = 'ProcessMoneyRequestHoldPage';
exports.default = ProcessMoneyRequestHoldPage;
