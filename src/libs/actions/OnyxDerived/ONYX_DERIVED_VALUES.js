"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const outstandingReportsByPolicyID_1 = require("./configs/outstandingReportsByPolicyID");
const reportAttributes_1 = require("./configs/reportAttributes");
const reportTransactionsAndViolations_1 = require("./configs/reportTransactionsAndViolations");
/**
 * Global map of derived configs.
 * This object holds our derived value configurations.
 */
const ONYX_DERIVED_VALUES = {
    [ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES]: reportAttributes_1.default,
    [ONYXKEYS_1.default.DERIVED.REPORT_TRANSACTIONS_AND_VIOLATIONS]: reportTransactionsAndViolations_1.default,
    [ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID]: outstandingReportsByPolicyID_1.default,
};
exports.default = ONYX_DERIVED_VALUES;
