"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var react_native_onyx_1 = require("react-native-onyx");
var DateUtils_1 = require("@libs/DateUtils");
var CONST_1 = require("@src/CONST");
var useAncestorReportsAndReportActions_1 = require("@src/hooks/useAncestorReportsAndReportActions");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var numberOfMockReports = 13;
var mockReports = {};
var mockReportActions = {};
var parentReportID;
var parentReportActionID;
for (var reportNum = 1; reportNum <= numberOfMockReports; reportNum++) {
    var reportID = "".concat(reportNum);
    var report = {
        reportID: reportID,
        parentReportID: parentReportID,
        parentReportActionID: parentReportActionID,
    };
    var reportAction = {
        reportID: reportID,
        parentReportID: parentReportID,
        reportActionID: "".concat(reportNum),
        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
        created: DateUtils_1.default.getDBTime(),
    };
    var reportActions = (_a = {},
        _a[reportAction.reportActionID] = reportAction,
        _a);
    mockReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID)] = report;
    mockReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID)] = reportActions;
    parentReportID = reportID;
    parentReportActionID = reportAction.reportActionID;
}
describe('useAncestorReportsAndReportActions', function () {
    beforeAll(function () {
        var _a;
        react_native_onyx_1.default.multiSet((_a = {},
            _a[ONYXKEYS_1.default.COLLECTION.REPORT] = mockReports,
            _a[ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS] = mockReportActions,
            _a));
        return (0, waitForBatchedUpdates_1.default)();
    });
    test('returns correct ancestor reports and actions', function () {
        var _a, _b, _c, _d, _e, _f;
        var reportNum = 8;
        var mockReport = mockReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportNum)];
        var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)("".concat(reportNum), true); }).result;
        var _g = result.current, report = _g.report, ancestorReportsAndReportActions = _g.ancestorReportsAndReportActions;
        expect(report).toEqual(mockReport);
        expect(ancestorReportsAndReportActions).toHaveLength(7);
        // Check the oldest ancestor (should be reportID 1)
        var _h = (_a = ancestorReportsAndReportActions.at(0)) !== null && _a !== void 0 ? _a : {}, oldestAncestorReport = _h.report, oldestAncestorReportAction = _h.reportAction;
        expect(oldestAncestorReport).toEqual(mockReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT, "1")]);
        expect(oldestAncestorReportAction).toEqual((_b = mockReportActions === null || mockReportActions === void 0 ? void 0 : mockReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, "1")]) === null || _b === void 0 ? void 0 : _b['1']);
        reportNum -= 1; // 8->7
        // Check the youngest ancestor (should be reportID 7)
        var _j = (_c = ancestorReportsAndReportActions.at(-1)) !== null && _c !== void 0 ? _c : {}, youngestAncestorReport = _j.report, youngestAncestorReportAction = _j.reportAction;
        expect(youngestAncestorReport).toEqual(mockReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportNum)]);
        expect(youngestAncestorReportAction).toEqual((_d = mockReportActions === null || mockReportActions === void 0 ? void 0 : mockReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportNum)]) === null || _d === void 0 ? void 0 : _d["".concat(reportNum)]);
        // Check the rest of the ancestors
        while (reportNum > 2) {
            reportNum -= 1;
            var _k = (_e = ancestorReportsAndReportActions.at(reportNum - 1)) !== null && _e !== void 0 ? _e : {}, ancestorReport = _k.report, ancestorReportAction = _k.reportAction;
            expect(ancestorReport).toEqual(mockReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportNum)]);
            expect(ancestorReportAction).toEqual((_f = mockReportActions === null || mockReportActions === void 0 ? void 0 : mockReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportNum)]) === null || _f === void 0 ? void 0 : _f["".concat(reportNum)]);
        }
    });
    test('if no ancestor reports', function () {
        var mockReport = Object.values(mockReports).at(0); // First report, should have no ancestors
        var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)('1', true); }).result;
        expect(result.current.ancestorReportsAndReportActions).toHaveLength(0);
        expect(result.current.report).toEqual(mockReport);
    });
    test('if reportID is non-existent', function () {
        var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)('non-existent-report-id', true); }).result;
        expect(result.current.ancestorReportsAndReportActions).toHaveLength(0);
        expect(result.current.report).toBeUndefined();
    });
    test('if reportID is an empty string', function () {
        var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)('', true); }).result;
        expect(result.current.ancestorReportsAndReportActions).toHaveLength(0);
        expect(result.current.report).toBeUndefined();
    });
});
