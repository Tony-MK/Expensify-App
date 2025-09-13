"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useIOUUtils() {
    const [lastLocationPermissionPrompt] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, { canBeMissing: true });
    function shouldStartLocationPermissionFlow() {
        return (!lastLocationPermissionPrompt ||
            (DateUtils_1.default.isValidDateString(lastLocationPermissionPrompt ?? '') &&
                DateUtils_1.default.getDifferenceInDaysFromNow(new Date(lastLocationPermissionPrompt ?? '')) > CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS));
    }
    return { shouldStartLocationPermissionFlow };
}
exports.default = useIOUUtils;
