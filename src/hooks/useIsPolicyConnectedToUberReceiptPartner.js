"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useIsPolicyConnectedToUberReceiptPartner;
const usePolicy_1 = require("./usePolicy");
function useIsPolicyConnectedToUberReceiptPartner({ policyID }) {
    const policy = (0, usePolicy_1.default)(policyID);
    return !!policy?.receiptPartners?.uber?.enabled;
}
