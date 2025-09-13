"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ReportUtils_1 = require("@libs/ReportUtils");
var createOnyxDerivedValueConfig_1 = require("@userActions/OnyxDerived/createOnyxDerivedValueConfig");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
exports.default = (0, createOnyxDerivedValueConfig_1.default)({
    key: ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID,
    dependencies: [ONYXKEYS_1.default.COLLECTION.REPORT],
    compute: function (_a) {
        var reports = _a[0];
        if (!reports) {
            return {};
        }
        var outstandingReportsByPolicyID = Object.entries(reports !== null && reports !== void 0 ? reports : {}).reduce(function (acc, _a) {
            var _b;
            var _c, _d;
            var reportID = _a[0], report = _a[1];
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
                ((_c = report === null || report === void 0 ? void 0 : report.pendingFields) === null || _c === void 0 ? void 0 : _c.preview) !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE &&
                ((_d = report.stateNum) !== null && _d !== void 0 ? _d : CONST_1.default.REPORT.STATE_NUM.OPEN) <= CONST_1.default.REPORT.STATE_NUM.SUBMITTED) {
                if (!acc[report.policyID]) {
                    acc[report.policyID] = {};
                }
                acc[report.policyID] = __assign(__assign({}, acc[report.policyID]), (_b = {}, _b[reportID] = report, _b));
            }
            return acc;
        }, {});
        return outstandingReportsByPolicyID;
    },
});
