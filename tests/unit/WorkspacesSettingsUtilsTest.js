"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const OnyxUtils_1 = require("react-native-onyx/dist/OnyxUtils");
const WorkspacesSettingsUtils_1 = require("@libs/WorkspacesSettingsUtils");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const WorkspacesSettingsUtilsTest_json_1 = require("./WorkspacesSettingsUtilsTest.json");
describe('WorkspacesSettingsUtils', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        (0, OnyxDerived_1.default)();
    });
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        react_native_onyx_1.default.clear([ONYXKEYS_1.default.NVP_PREFERRED_LOCALE]).then(waitForBatchedUpdates_1.default);
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return (0, waitForBatchedUpdates_1.default)();
    });
    describe('getBrickRoadForPolicy', () => {
        it('Should return "error"', async () => {
            const report = Object.values(WorkspacesSettingsUtilsTest_json_1.default.reports)?.at(0);
            const transactionViolations = WorkspacesSettingsUtilsTest_json_1.default.transactionViolations;
            const reports = WorkspacesSettingsUtilsTest_json_1.default.reports;
            const session = WorkspacesSettingsUtilsTest_json_1.default.session;
            const reportActions = WorkspacesSettingsUtilsTest_json_1.default.reportActions;
            const transactions = WorkspacesSettingsUtilsTest_json_1.default.transactions;
            await react_native_onyx_1.default.multiSet({
                session,
                ...reports,
                ...reportActions,
                ...transactionViolations,
                ...transactions,
            });
            await (0, waitForBatchedUpdates_1.default)();
            const reportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            // eslint-disable-next-line rulesdir/no-default-id-values
            const result = (0, WorkspacesSettingsUtils_1.getBrickRoadForPolicy)(report?.reportID ?? '', reportAttributes?.reports);
            // The result should be 'error' because there is at least one IOU action associated with a transaction that has a violation.
            expect(result).toBe('error');
        });
        it('Should return "undefined"', async () => {
            const report = Object.values(WorkspacesSettingsUtilsTest_json_1.default.reports)?.at(0);
            const reports = WorkspacesSettingsUtilsTest_json_1.default.reports;
            const session = WorkspacesSettingsUtilsTest_json_1.default.session;
            const reportActions = WorkspacesSettingsUtilsTest_json_1.default.reportActions;
            await react_native_onyx_1.default.multiSet({
                ...reports,
                ...reportActions,
                session,
            });
            await (0, waitForBatchedUpdates_1.default)();
            const reportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            // eslint-disable-next-line rulesdir/no-default-id-values
            const result = (0, WorkspacesSettingsUtils_1.getBrickRoadForPolicy)(report?.reportID ?? '', reportAttributes?.reports);
            // Then the result should be 'undefined' since no IOU action is linked to a transaction with a violation.
            expect(result).toBe(undefined);
        });
    });
    describe('getChatTabBrickRoadReportID', () => {
        it('Should return "error"', async () => {
            const transactionViolations = WorkspacesSettingsUtilsTest_json_1.default.transactionViolations;
            const reports = WorkspacesSettingsUtilsTest_json_1.default.reports;
            const session = WorkspacesSettingsUtilsTest_json_1.default.session;
            const reportActions = WorkspacesSettingsUtilsTest_json_1.default.reportActions;
            const transactions = WorkspacesSettingsUtilsTest_json_1.default.transactions;
            await react_native_onyx_1.default.multiSet({
                session,
                ...reports,
                ...reportActions,
                ...transactionViolations,
                ...transactions,
            });
            const reportIDs = Object.values(reports).map((report) => report.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            const reportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            const result = (0, WorkspacesSettingsUtils_1.getChatTabBrickRoadReportID)(reportIDs, reportAttributes?.reports);
            // The result should be '4286515777714555' as it is the reportID associated with the violation.
            expect(result).toBe('4286515777714555');
        });
        it('Should return "undefined"', async () => {
            const reports = WorkspacesSettingsUtilsTest_json_1.default.reports;
            const session = WorkspacesSettingsUtilsTest_json_1.default.session;
            const reportActions = WorkspacesSettingsUtilsTest_json_1.default.reportActions;
            await react_native_onyx_1.default.multiSet({
                ...reports,
                ...reportActions,
                session,
            });
            const reportIDs = Object.values(reports).map((report) => report.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            const reportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            const result = (0, WorkspacesSettingsUtils_1.getChatTabBrickRoadReportID)(reportIDs, reportAttributes?.reports);
            // Then the result should be 'undefined' since no IOU action is linked to a transaction with a violation.
            expect(result).toBe(undefined);
        });
    });
    describe('getChatTabBrickRoad', () => {
        it('Should return reportID which has "error"', async () => {
            const transactionViolations = WorkspacesSettingsUtilsTest_json_1.default.transactionViolations;
            const reports = WorkspacesSettingsUtilsTest_json_1.default.reports;
            const session = WorkspacesSettingsUtilsTest_json_1.default.session;
            const reportActions = WorkspacesSettingsUtilsTest_json_1.default.reportActions;
            const transactions = WorkspacesSettingsUtilsTest_json_1.default.transactions;
            await react_native_onyx_1.default.multiSet({
                session,
                ...reports,
                ...reportActions,
                ...transactionViolations,
                ...transactions,
            });
            const reportIDs = Object.values(reports).map((report) => report.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            const reportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            const result = (0, WorkspacesSettingsUtils_1.getChatTabBrickRoad)(reportIDs, reportAttributes?.reports);
            // The result should be 'error' due to violation present in the reports.
            expect(result).toBe('error');
        });
        it('Should return "undefined"', async () => {
            const reports = WorkspacesSettingsUtilsTest_json_1.default.reports;
            const session = WorkspacesSettingsUtilsTest_json_1.default.session;
            const reportActions = WorkspacesSettingsUtilsTest_json_1.default.reportActions;
            await react_native_onyx_1.default.multiSet({
                ...reports,
                ...reportActions,
                session,
            });
            const reportIDs = Object.values(reports).map((report) => report.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            const reportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            const result = (0, WorkspacesSettingsUtils_1.getChatTabBrickRoad)(reportIDs, reportAttributes?.reports);
            // Then the result should be 'undefined' since no IOU action is linked to a transaction with a violation.
            expect(result).toBe(undefined);
        });
    });
});
