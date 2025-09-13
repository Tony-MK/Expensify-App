"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
const useAncestorReportsAndReportActions_1 = require("@src/hooks/useAncestorReportsAndReportActions");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const numberOfMockReports = 13;
const mockReports = {};
const mockReportActions = {};
let parentReportID;
let parentReportActionID;
for (let reportNum = 1; reportNum <= numberOfMockReports; reportNum++) {
    const reportID = `${reportNum}`;
    const report = {
        reportID,
        parentReportID,
        parentReportActionID,
    };
    const reportAction = {
        reportID,
        parentReportID,
        reportActionID: `${reportNum}`,
        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
        created: DateUtils_1.default.getDBTime(),
    };
    const reportActions = {
        [reportAction.reportActionID]: reportAction,
    };
    mockReports[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`] = report;
    mockReportActions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`] = reportActions;
    parentReportID = reportID;
    parentReportActionID = reportAction.reportActionID;
}
describe('useAncestorReportsAndReportActions', () => {
    beforeAll(() => {
        react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.COLLECTION.REPORT]: mockReports,
            [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS]: mockReportActions,
        });
        return (0, waitForBatchedUpdates_1.default)();
    });
    test('returns correct ancestor reports and actions', () => {
        let reportNum = 8;
        const mockReport = mockReports[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportNum}`];
        const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)(`${reportNum}`, true));
        const { report, ancestorReportsAndReportActions } = result.current;
        expect(report).toEqual(mockReport);
        expect(ancestorReportsAndReportActions).toHaveLength(7);
        // Check the oldest ancestor (should be reportID 1)
        const { report: oldestAncestorReport, reportAction: oldestAncestorReportAction } = ancestorReportsAndReportActions.at(0) ?? {};
        expect(oldestAncestorReport).toEqual(mockReports[`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]);
        expect(oldestAncestorReportAction).toEqual(mockReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]?.['1']);
        reportNum -= 1; // 8->7
        // Check the youngest ancestor (should be reportID 7)
        const { report: youngestAncestorReport, reportAction: youngestAncestorReportAction } = ancestorReportsAndReportActions.at(-1) ?? {};
        expect(youngestAncestorReport).toEqual(mockReports[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportNum}`]);
        expect(youngestAncestorReportAction).toEqual(mockReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportNum}`]?.[`${reportNum}`]);
        // Check the rest of the ancestors
        while (reportNum > 2) {
            reportNum -= 1;
            const { report: ancestorReport, reportAction: ancestorReportAction } = ancestorReportsAndReportActions.at(reportNum - 1) ?? {};
            expect(ancestorReport).toEqual(mockReports[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportNum}`]);
            expect(ancestorReportAction).toEqual(mockReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportNum}`]?.[`${reportNum}`]);
        }
    });
    test('if no ancestor reports', () => {
        const mockReport = Object.values(mockReports).at(0); // First report, should have no ancestors
        const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)('1', true));
        expect(result.current.ancestorReportsAndReportActions).toHaveLength(0);
        expect(result.current.report).toEqual(mockReport);
    });
    test('if reportID is non-existent', () => {
        const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)('non-existent-report-id', true));
        expect(result.current.ancestorReportsAndReportActions).toHaveLength(0);
        expect(result.current.report).toBeUndefined();
    });
    test('if reportID is an empty string', () => {
        const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)('', true));
        expect(result.current.ancestorReportsAndReportActions).toHaveLength(0);
        expect(result.current.report).toBeUndefined();
    });
});
