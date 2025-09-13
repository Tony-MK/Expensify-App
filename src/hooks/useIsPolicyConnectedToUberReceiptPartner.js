"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useIsPolicyConnectedToUberReceiptPartner;
var usePolicy_1 = require("./usePolicy");
function useIsPolicyConnectedToUberReceiptPartner(_a) {
    var _b, _c;
    var policyID = _a.policyID;
    var policy = (0, usePolicy_1.default)(policyID);
    return !!((_c = (_b = policy === null || policy === void 0 ? void 0 : policy.receiptPartners) === null || _b === void 0 ? void 0 : _b.uber) === null || _c === void 0 ? void 0 : _c.enabled);
}
