"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useMobileSelectionMode;
const react_1 = require("react");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useMobileSelectionMode() {
    const [isSelectionModeEnabled = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MOBILE_SELECTION_MODE, { initWithStoredValues: false, canBeMissing: true });
    const initialSelectionModeValueRef = (0, react_1.useRef)(isSelectionModeEnabled);
    (0, react_1.useEffect)(() => {
        // in case the selection mode is already off at the start, we don't need to turn it off again
        if (!initialSelectionModeValueRef.current) {
            return;
        }
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
    }, []);
    return !!isSelectionModeEnabled;
}
