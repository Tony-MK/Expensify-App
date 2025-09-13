"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var outstandingReportsByPolicyID_1 = require("./configs/outstandingReportsByPolicyID");
var reportAttributes_1 = require("./configs/reportAttributes");
var reportTransactionsAndViolations_1 = require("./configs/reportTransactionsAndViolations");
/**
 * Global map of derived configs.
 * This object holds our derived value configurations.
 */
var ONYX_DERIVED_VALUES = (_a = {},
    _a[ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES] = reportAttributes_1.default,
    _a[ONYXKEYS_1.default.DERIVED.REPORT_TRANSACTIONS_AND_VIOLATIONS] = reportTransactionsAndViolations_1.default,
    _a[ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID] = outstandingReportsByPolicyID_1.default,
    _a);
exports.default = ONYX_DERIVED_VALUES;
