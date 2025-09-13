"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReportUtils_1 = require("@libs/ReportUtils");
const createOnyxDerivedValueConfig_1 = require("@userActions/OnyxDerived/createOnyxDerivedValueConfig");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
exports.default = (0, createOnyxDerivedValueConfig_1.default)({
    key: ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID,
    dependencies: [ONYXKEYS_1.default.COLLECTION.REPORT],
    compute: ([reports]) => {
        if (!reports) {
            return {};
        }
        const outstandingReportsByPolicyID = Object.entries(reports ?? {}).reduce((acc, [reportID, report]) => {
            if (!report) {
                return acc;
            }
            // Get all reports, which are the ones that are:
            // - Expense reports
            // - Are either open or submitted
            // - Are not pending delete
            // - Belong to a workspace
            // This condition is similar to getOutstandingReportsForUser function
            if ((0, ReportUtils_1.isExpenseReport)(report) &&
                report.policyID &&
                report?.pendingFields?.preview !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE &&
                (report.stateNum ?? CONST_1.default.REPORT.STATE_NUM.OPEN) <= CONST_1.default.REPORT.STATE_NUM.SUBMITTED) {
                if (!acc[report.policyID]) {
                    acc[report.policyID] = {};
                }
                acc[report.policyID] = {
                    ...acc[report.policyID],
                    [reportID]: report,
                };
            }
            return acc;
        }, {});
        return outstandingReportsByPolicyID;
    },
});
