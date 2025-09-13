"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useMobileSelectionMode;
var react_1 = require("react");
var MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useOnyx_1 = require("./useOnyx");
function useMobileSelectionMode() {
    var _a = (0, useOnyx_1.default)(ONYXKEYS_1.default.MOBILE_SELECTION_MODE, { initWithStoredValues: false, canBeMissing: true })[0], isSelectionModeEnabled = _a === void 0 ? false : _a;
    var initialSelectionModeValueRef = (0, react_1.useRef)(isSelectionModeEnabled);
    (0, react_1.useEffect)(function () {
        // in case the selection mode is already off at the start, we don't need to turn it off again
        if (!initialSelectionModeValueRef.current) {
            return;
        }
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
    }, []);
    return !!isSelectionModeEnabled;
}
