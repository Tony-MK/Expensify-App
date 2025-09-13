"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const falso_1 = require("@ngneat/falso");
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ModifiedExpenseMessage_1 = require("../../src/libs/ModifiedExpenseMessage");
const createCollection_1 = require("../utils/collections/createCollection");
const policies_1 = require("../utils/collections/policies");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
beforeAll(() => react_native_onyx_1.default.init({
    keys: ONYXKEYS_1.default,
    evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
}));
// Clear out Onyx after each test so that each test starts with a clean state
afterEach(() => {
    react_native_onyx_1.default.clear();
});
const getMockedReports = (length = 500) => (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, (index) => (0, reports_1.createRandomReport)(index), length);
const getMockedPolicies = (length = 500) => (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.POLICY}${item.id}`, (index) => (0, policies_1.default)(index), length);
const mockedReportsMap = getMockedReports(1000);
const mockedPoliciesMap = getMockedPolicies(1000);
test('[ModifiedExpenseMessage] getForReportAction on 1k reports and policies', async () => {
    const report = (0, reports_1.createRandomReport)(1);
    const reportAction = {
        ...(0, reportActions_1.default)(1),
        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
        originalMessage: {
            amount: (0, falso_1.randAmount)(),
            currency: CONST_1.default.CURRENCY.USD,
            oldAmount: (0, falso_1.randAmount)(),
            oldCurrency: CONST_1.default.CURRENCY.USD,
        },
    };
    await react_native_onyx_1.default.multiSet({
        ...mockedPoliciesMap,
        ...mockedReportsMap,
    });
    await (0, waitForBatchedUpdates_1.default)();
    await (0, reassure_1.measureFunction)(() => (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID }));
});
