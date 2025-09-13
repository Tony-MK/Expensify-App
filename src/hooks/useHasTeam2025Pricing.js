"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useHasTeam2025Pricing() {
    const [firstPolicyDate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_FIRST_POLICY_CREATED_DATE, { canBeMissing: true });
    const [hasManualTeam2025Pricing] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_MANUAL_TEAM_2025_PRICING, { canBeMissing: true });
    if (hasManualTeam2025Pricing) {
        return true;
    }
    if (!firstPolicyDate) {
        return true;
    }
    return (0, date_fns_1.differenceInDays)(firstPolicyDate, CONST_1.default.SUBSCRIPTION.TEAM_2025_PRICING_START_DATE) >= 0;
}
exports.default = useHasTeam2025Pricing;
