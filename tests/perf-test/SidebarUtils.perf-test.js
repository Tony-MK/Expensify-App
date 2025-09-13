"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const falso_1 = require("@ngneat/falso");
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const SidebarUtils_1 = require("@libs/SidebarUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const createCollection_1 = require("../utils/collections/createCollection");
const personalDetails_1 = require("../utils/collections/personalDetails");
const policies_1 = require("../utils/collections/policies");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const REPORTS_COUNT = 15000;
const REPORT_THRESHOLD = 5;
const PERSONAL_DETAILS_LIST_COUNT = 1000;
const allReports = (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, (index) => ({
    ...(0, reports_1.createRandomReport)(index),
    type: (0, falso_1.rand)(Object.values(CONST_1.default.REPORT.TYPE)),
    lastVisibleActionCreated: (0, reportActions_1.getRandomDate)(),
    // add status and state to every 5th report to mock non-archived reports
    statusNum: index % REPORT_THRESHOLD ? 0 : CONST_1.default.REPORT.STATUS_NUM.CLOSED,
    stateNum: index % REPORT_THRESHOLD ? 0 : CONST_1.default.REPORT.STATE_NUM.APPROVED,
    isUnreadWithMention: false,
}), REPORTS_COUNT);
const personalDetails = (0, createCollection_1.default)((item) => item.accountID, (index) => (0, personalDetails_1.default)(index), PERSONAL_DETAILS_LIST_COUNT);
const policies = (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.POLICY}${item.id}`, (index) => (0, policies_1.default)(index));
const mockedBetas = Object.values(CONST_1.default.BETAS);
const currentReportId = '1';
const transactionViolations = {};
describe('SidebarUtils', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
        react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: personalDetails,
            [ONYXKEYS_1.default.NVP_PREFERRED_LOCALE]: 'en',
        });
    });
    afterAll(() => {
        react_native_onyx_1.default.clear();
    });
    test('[SidebarUtils] getOptionData', async () => {
        const report = (0, reports_1.createRandomReport)(1);
        const policy = (0, policies_1.default)(1);
        const parentReportAction = (0, reportActions_1.default)(1);
        const reportNameValuePairs = {};
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => SidebarUtils_1.default.getOptionData({
            report,
            reportAttributes: undefined,
            reportNameValuePairs,
            personalDetails,
            policy,
            parentReportAction,
            oneTransactionThreadReport: undefined,
            card: undefined,
            lastAction: undefined,
            localeCompare: TestHelper_1.localeCompare,
        }));
    });
    test('[SidebarUtils] getReportsToDisplayInLHN on 15k reports for default priorityMode', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => SidebarUtils_1.default.getReportsToDisplayInLHN(currentReportId, allReports, mockedBetas, policies, CONST_1.default.PRIORITY_MODE.DEFAULT, transactionViolations));
    });
    test('[SidebarUtils] getReportsToDisplayInLHN on 15k reports for GSD priorityMode', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => SidebarUtils_1.default.getReportsToDisplayInLHN(currentReportId, allReports, mockedBetas, policies, CONST_1.default.PRIORITY_MODE.GSD, transactionViolations));
    });
});
