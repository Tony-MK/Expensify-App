"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSidebarReport = createSidebarReport;
exports.createSidebarReportsCollection = createSidebarReportsCollection;
exports.createSidebarTestData = createSidebarTestData;
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const createCollection_1 = require("./createCollection");
const reports_1 = require("./reports");
/**
 * Creates a mock report for sidebar testing with specific properties
 */
function createSidebarReport(index, options = {}) {
    const reportID = index.toString();
    const baseReport = (0, reports_1.createRandomReport)(index);
    return {
        ...baseReport,
        reportID,
        reportName: options.reportName ?? baseReport.reportName,
        type: options.type ?? CONST_1.default.REPORT.TYPE.CHAT,
        isPinned: options.isPinned ?? false,
        hasErrorsOtherThanFailedReceipt: options.hasErrorsOtherThanFailedReceipt ?? false,
        lastVisibleActionCreated: options.lastVisibleActionCreated ?? '2024-01-01 10:00:00',
        isOwnPolicyExpenseChat: options.isOwnPolicyExpenseChat ?? false,
        chatType: options.chatType ?? CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
        ownerAccountID: options.ownerAccountID ?? index,
        policyID: options.policyID ?? reportID,
        currency: options.currency ?? 'USD',
    };
}
/**
 * Creates a collection of mock reports for sidebar testing using the createCollection pattern
 */
function createSidebarReportsCollection(reportConfigs) {
    return (0, createCollection_1.default)((item) => item.reportID, (index) => createSidebarReport(index, reportConfigs.at(index) ?? {}), reportConfigs.length);
}
/**
 * Creates a comprehensive test set with all report types
 */
function createSidebarTestData() {
    const reports = createSidebarReportsCollection([
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
    const reportNameValuePairs = {
        [`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}4`]: {
            private_isArchived: '2024-01-01 10:00:00',
        },
    };
    const reportAttributes = {
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
        reports,
        reportNameValuePairs,
        reportAttributes,
    };
}
