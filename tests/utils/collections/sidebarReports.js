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
exports.createSidebarReport = createSidebarReport;
exports.createSidebarReportsCollection = createSidebarReportsCollection;
exports.createSidebarTestData = createSidebarTestData;
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var createCollection_1 = require("./createCollection");
var reports_1 = require("./reports");
/**
 * Creates a mock report for sidebar testing with specific properties
 */
function createSidebarReport(index, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (options === void 0) { options = {}; }
    var reportID = index.toString();
    var baseReport = (0, reports_1.createRandomReport)(index);
    return __assign(__assign({}, baseReport), { reportID: reportID, reportName: (_a = options.reportName) !== null && _a !== void 0 ? _a : baseReport.reportName, type: (_b = options.type) !== null && _b !== void 0 ? _b : CONST_1.default.REPORT.TYPE.CHAT, isPinned: (_c = options.isPinned) !== null && _c !== void 0 ? _c : false, hasErrorsOtherThanFailedReceipt: (_d = options.hasErrorsOtherThanFailedReceipt) !== null && _d !== void 0 ? _d : false, lastVisibleActionCreated: (_e = options.lastVisibleActionCreated) !== null && _e !== void 0 ? _e : '2024-01-01 10:00:00', isOwnPolicyExpenseChat: (_f = options.isOwnPolicyExpenseChat) !== null && _f !== void 0 ? _f : false, chatType: (_g = options.chatType) !== null && _g !== void 0 ? _g : CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM, ownerAccountID: (_h = options.ownerAccountID) !== null && _h !== void 0 ? _h : index, policyID: (_j = options.policyID) !== null && _j !== void 0 ? _j : reportID, currency: (_k = options.currency) !== null && _k !== void 0 ? _k : 'USD' });
}
/**
 * Creates a collection of mock reports for sidebar testing using the createCollection pattern
 */
function createSidebarReportsCollection(reportConfigs) {
    return (0, createCollection_1.default)(function (item) { return item.reportID; }, function (index) { var _a; return createSidebarReport(index, (_a = reportConfigs.at(index)) !== null && _a !== void 0 ? _a : {}); }, reportConfigs.length);
}
/**
 * Creates a comprehensive test set with all report types
 */
function createSidebarTestData() {
    var _a;
    var reports = createSidebarReportsCollection([
        {
            reportName: 'Pinned Report',
            isPinned: true,
            hasErrorsOtherThanFailedReceipt: false,
        },
        {
            reportName: 'Error Report',
            isPinned: false,
            hasErrorsOtherThanFailedReceipt: true,
        },
        {
            reportName: 'Draft Report',
            isPinned: false,
            hasErrorsOtherThanFailedReceipt: false,
        },
        {
            reportName: 'Normal Report',
            isPinned: false,
            hasErrorsOtherThanFailedReceipt: false,
        },
        {
            reportName: 'Archived Report',
            isPinned: false,
            hasErrorsOtherThanFailedReceipt: false,
        },
    ]);
    var reportNameValuePairs = (_a = {},
        _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, "4")] = {
            private_isArchived: '2024-01-01 10:00:00',
        },
        _a);
    var reportAttributes = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '0': {
            requiresAttention: false,
            reportName: 'Test Report',
            isEmpty: false,
            brickRoadStatus: undefined,
            reportErrors: {},
        },
    };
    return {
        reports: reports,
        reportNameValuePairs: reportNameValuePairs,
        reportAttributes: reportAttributes,
    };
}
