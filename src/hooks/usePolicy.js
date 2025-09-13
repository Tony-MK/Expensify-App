"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function getPolicyIDOrDefault(policyID) {
    if (!policyID || policyID === CONST_1.default.POLICY.OWNER_EMAIL_FAKE) {
        return '-1';
    }
    return policyID;
}
function usePolicy(policyID) {
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${getPolicyIDOrDefault(policyID)}`);
    return policy;
}
exports.default = usePolicy;
