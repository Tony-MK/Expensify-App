"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("@userActions/User");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useOnyx_1 = require("./useOnyx");
function useDismissedUberBanners(_a) {
    var policyID = _a.policyID;
    var _b = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_UBER_BANNERS, { canBeMissing: true }), dismissedUberBanners = _b[0], metadata = _b[1];
    var isDismissed = (!!policyID && !!dismissedUberBanners) || metadata.status !== 'loaded';
    var setAsDismissed = function () {
        if (!policyID) {
            return;
        }
        (0, User_1.setNameValuePair)(ONYXKEYS_1.default.NVP_DISMISSED_UBER_BANNERS, !isDismissed, isDismissed);
    };
    return { isDismissed: isDismissed, setAsDismissed: setAsDismissed };
}
exports.default = useDismissedUberBanners;
