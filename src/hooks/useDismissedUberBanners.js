"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("@userActions/User");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useDismissedUberBanners({ policyID }) {
    const [dismissedUberBanners, metadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_UBER_BANNERS, { canBeMissing: true });
    const isDismissed = (!!policyID && !!dismissedUberBanners) || metadata.status !== 'loaded';
    const setAsDismissed = () => {
        if (!policyID) {
            return;
        }
        (0, User_1.setNameValuePair)(ONYXKEYS_1.default.NVP_DISMISSED_UBER_BANNERS, !isDismissed, isDismissed);
    };
    return { isDismissed, setAsDismissed };
}
exports.default = useDismissedUberBanners;
