"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateUtils_1 = require("@libs/DateUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useOnyx_1 = require("./useOnyx");
function useIOUUtils() {
    var lastLocationPermissionPrompt = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, { canBeMissing: true })[0];
    function shouldStartLocationPermissionFlow() {
        return (!lastLocationPermissionPrompt ||
            (DateUtils_1.default.isValidDateString(lastLocationPermissionPrompt !== null && lastLocationPermissionPrompt !== void 0 ? lastLocationPermissionPrompt : '') &&
                DateUtils_1.default.getDifferenceInDaysFromNow(new Date(lastLocationPermissionPrompt !== null && lastLocationPermissionPrompt !== void 0 ? lastLocationPermissionPrompt : '')) > CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS));
    }
    return { shouldStartLocationPermissionFlow: shouldStartLocationPermissionFlow };
}
exports.default = useIOUUtils;
