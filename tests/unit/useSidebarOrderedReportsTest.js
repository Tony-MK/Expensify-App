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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var react_1 = require("react");
var react_native_onyx_1 = require("react-native-onyx");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var useCurrentReportID_1 = require("@hooks/useCurrentReportID");
var useSidebarOrderedReports_1 = require("@hooks/useSidebarOrderedReports");
var SidebarUtils_1 = require("@libs/SidebarUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Mock dependencies
jest.mock('@libs/SidebarUtils', function () { return ({
    sortReportsToDisplayInLHN: jest.fn(),
    getReportsToDisplayInLHN: jest.fn(),
    updateReportsToDisplayInLHN: jest.fn(),
}); });
jest.mock('@libs/Navigation/Navigation', function () { return ({
    getTopmostReportId: jest.fn(),
}); });
jest.mock('@libs/ReportUtils', function () { return ({
    parseReportRouteParams: jest.fn(function () { return ({ reportID: undefined }); }),
    getReportIDFromLink: jest.fn(function () { return ''; }),
}); });
var mockSidebarUtils = SidebarUtils_1.default;
describe('useSidebarOrderedReports', function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
                    // Set up basic session data
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                            accountID: 12345,
                            email: 'test@example.com',
                            authTokenType: CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS,
                        })];
                case 1:
                    // Set up basic session data
                    _a.sent();
                    return [2 /*return*/, (0, waitForBatchedUpdates_1.default)()];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    jest.clearAllMocks();
                    react_native_onyx_1.default.clear();
                    // Set up basic session data for each test
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                            accountID: 12345,
                            email: 'test@example.com',
                            authTokenType: CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS,
                        })];
                case 1:
                    // Set up basic session data for each test
                    _b.sent();
                    // Set up required Onyx data that the hook depends on
                    return [4 /*yield*/, react_native_onyx_1.default.multiSet((_a = {},
                            _a[ONYXKEYS_1.default.NVP_PRIORITY_MODE] = CONST_1.default.PRIORITY_MODE.DEFAULT,
                            _a[ONYXKEYS_1.default.COLLECTION.REPORT] = {},
                            _a[ONYXKEYS_1.default.COLLECTION.POLICY] = {},
                            _a[ONYXKEYS_1.default.COLLECTION.TRANSACTION] = {},
                            _a[ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS] = {},
                            _a[ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS] = {},
                            _a[ONYXKEYS_1.default.BETAS] = [],
                            _a[ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES] = { reports: {} },
                            _a))];
                case 2:
                    // Set up required Onyx data that the hook depends on
                    _b.sent();
                    // Default mock implementations
                    mockSidebarUtils.getReportsToDisplayInLHN.mockImplementation(function () { return ({}); });
                    mockSidebarUtils.updateReportsToDisplayInLHN.mockImplementation(function (prev) { return prev; });
                    mockSidebarUtils.sortReportsToDisplayInLHN.mockReturnValue([]);
                    return [2 /*return*/, (0, waitForBatchedUpdates_1.default)()];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_native_onyx_1.default.clear();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var createMockReports = function (reports) {
        var mockReports = {};
        Object.entries(reports).forEach(function (_a) {
            var key = _a[0], report = _a[1];
            var reportId = key.replace('report', '');
            mockReports[reportId] = __assign({ reportID: reportId, reportName: "Report ".concat(reportId), lastVisibleActionCreated: '2024-01-01 10:00:00', type: CONST_1.default.REPORT.TYPE.CHAT }, report);
        });
        return mockReports;
    };
    var currentReportIDForTestsValue;
    function TestWrapper(_a) {
        var children = _a.children;
        return (<OnyxListItemProvider_1.default>
                <useCurrentReportID_1.CurrentReportIDContextProvider>
                    <useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider currentReportIDForTests={currentReportIDForTestsValue}>{children}</useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider>
                </useCurrentReportID_1.CurrentReportIDContextProvider>
            </OnyxListItemProvider_1.default>);
    }
    it('should prevent unnecessary re-renders when reports have same content but different references', function () {
        // Given reports with same content but different object references
        var reportsContent = {
            report1: { reportName: 'Chat 1', lastVisibleActionCreated: '2024-01-01 10:00:00' },
            report2: { reportName: 'Chat 2', lastVisibleActionCreated: '2024-01-01 11:00:00' },
        };
        // When the initial reports are set
        var initialReports = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(initialReports);
        mockSidebarUtils.updateReportsToDisplayInLHN.mockImplementation(function (prev) { return (__assign({}, prev)); });
        currentReportIDForTestsValue = '1';
        // When the hook is rendered
        var rerender = (0, react_native_1.renderHook)(function () { return (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(); }, {
            wrapper: TestWrapper,
        }).rerender;
        // Then the mock calls are cleared
        mockSidebarUtils.sortReportsToDisplayInLHN.mockClear();
        // When the reports are updated
        var newReportsWithSameContent = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(newReportsWithSameContent);
        rerender({});
        // Then sortReportsToDisplayInLHN should not be called again since deep comparison shows no change
        expect(mockSidebarUtils.sortReportsToDisplayInLHN).not.toHaveBeenCalled();
    });
    it('should trigger re-render when reports content actually changes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var initialReports, updatedReports, rerender;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    initialReports = createMockReports({
                        report1: { reportName: 'Chat 1' },
                        report2: { reportName: 'Chat 2' },
                    });
                    updatedReports = createMockReports({
                        report1: { reportName: 'Chat 1 Updated' }, // Content changed
                        report2: { reportName: 'Chat 2' },
                        report3: { reportName: 'Chat 3' }, // New report added
                    });
                    // Then the initial reports are set
                    return [4 /*yield*/, react_native_onyx_1.default.multiSet((_a = {},
                            _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT, "1")] = initialReports['1'],
                            _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT, "2")] = initialReports['2'],
                            _a))];
                case 1:
                    // Then the initial reports are set
                    _b.sent();
                    // When the mock is updated
                    mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(initialReports);
                    rerender = (0, react_native_1.renderHook)(function () { return (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(); }, {
                        wrapper: TestWrapper,
                    }).rerender;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 2:
                    _b.sent();
                    // Then the mock calls are cleared
                    mockSidebarUtils.sortReportsToDisplayInLHN.mockClear();
                    // When the mock is updated
                    mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(updatedReports);
                    // When the priority mode is changed
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PRIORITY_MODE, CONST_1.default.PRIORITY_MODE.GSD)];
                case 3:
                    // When the priority mode is changed
                    _b.sent();
                    rerender({});
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 4:
                    _b.sent();
                    // Then sortReportsToDisplayInLHN should be called with the updated reports
                    expect(mockSidebarUtils.sortReportsToDisplayInLHN).toHaveBeenCalledWith(updatedReports, expect.any(String), // priorityMode
                    expect.any(Function), // localeCompare
                    expect.any(Object), // reportNameValuePairs
                    expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should handle empty reports correctly with deep comparison', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rerender;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Given the initial reports are set
                    mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue({});
                    rerender = (0, react_native_1.renderHook)(function () { return (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(); }, {
                        wrapper: TestWrapper,
                    }).rerender;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    // Then the mock calls are cleared
                    mockSidebarUtils.sortReportsToDisplayInLHN.mockClear();
                    // When the mock is updated
                    mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue({});
                    rerender({});
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 2:
                    _a.sent();
                    // Then sortReportsToDisplayInLHN should not be called again since reports are empty
                    expect(mockSidebarUtils.sortReportsToDisplayInLHN).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should maintain referential stability across multiple renders with same content', function () {
        // Given the initial reports are set
        var reportsContent = {
            report1: { reportName: 'Stable Chat' },
        };
        // When the initial reports are set
        var initialReports = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(initialReports);
        mockSidebarUtils.sortReportsToDisplayInLHN.mockReturnValue(['1']);
        currentReportIDForTestsValue = '1';
        var rerender = (0, react_native_1.renderHook)(function () { return (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(); }, {
            wrapper: TestWrapper,
        }).rerender;
        // When the mock is updated
        var newReportsWithSameContent = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(newReportsWithSameContent);
        rerender({});
        currentReportIDForTestsValue = '2';
        // When the mock is updated
        var thirdReportsWithSameContent = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(thirdReportsWithSameContent);
        rerender({});
        currentReportIDForTestsValue = '3';
        // Then sortReportsToDisplayInLHN should be called only once (initial render)
        expect(mockSidebarUtils.sortReportsToDisplayInLHN).toHaveBeenCalledTimes(1);
    });
    it('should handle priority mode changes correctly with deep comparison', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reports, rerender;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reports = createMockReports({
                        report1: { reportName: 'Chat A' },
                        report2: { reportName: 'Chat B' },
                    });
                    mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(reports);
                    currentReportIDForTestsValue = '1';
                    rerender = (0, react_native_1.renderHook)(function () { return (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(); }, {
                        wrapper: TestWrapper,
                    }).rerender;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    // Then the mock calls are cleared
                    mockSidebarUtils.sortReportsToDisplayInLHN.mockClear();
                    currentReportIDForTestsValue = '2';
                    // When the priority mode is changed
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PRIORITY_MODE, CONST_1.default.PRIORITY_MODE.GSD)];
                case 2:
                    // When the priority mode is changed
                    _a.sent();
                    rerender({});
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 3:
                    _a.sent();
                    // Then sortReportsToDisplayInLHN should be called when priority mode changes
                    expect(mockSidebarUtils.sortReportsToDisplayInLHN).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
