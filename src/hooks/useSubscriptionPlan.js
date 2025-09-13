"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const useOnyx_1 = require("./useOnyx");
function useSubscriptionPlan() {
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [userMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_METADATA, { canBeMissing: true });
    // Filter workspaces in which user is the owner and the type is either corporate (control) or team (collect)
    const ownerPolicies = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getOwnedPaidPolicies)(policies, userMetadata?.accountID), [policies, userMetadata?.accountID]);
    if ((0, EmptyObject_1.isEmptyObject)(ownerPolicies)) {
        return null;
    }
    // Check if user has corporate (control) workspace
    const hasControlWorkspace = ownerPolicies.some((policy) => policy?.type === CONST_1.default.POLICY.TYPE.CORPORATE);
    // Corporate (control) workspace is supposed to be the higher priority
    return hasControlWorkspace ? CONST_1.default.POLICY.TYPE.CORPORATE : CONST_1.default.POLICY.TYPE.TEAM;
}
exports.default = useSubscriptionPlan;
