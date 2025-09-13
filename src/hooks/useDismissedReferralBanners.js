"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("@libs/actions/User");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useDismissedReferralBanners({ referralContentType }) {
    const [dismissedReferralBanners] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_REFERRAL_BANNERS);
    const isDismissed = dismissedReferralBanners?.[referralContentType] ?? false;
    const setAsDismissed = () => {
        if (!referralContentType) {
            return;
        }
        // Set the banner as dismissed
        (0, User_1.dismissReferralBanner)(referralContentType);
    };
    return { isDismissed, setAsDismissed };
}
exports.default = useDismissedReferralBanners;
