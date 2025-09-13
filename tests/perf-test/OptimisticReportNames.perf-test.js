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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_onyx_1 = require("react-native-onyx");
var reassure_1 = require("reassure");
var OptimisticReportNames_1 = require("@libs/OptimisticReportNames");
// eslint-disable-next-line no-restricted-syntax -- disabled because we need ReportUtils to mock
var ReportUtils = require("@libs/ReportUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var createCollection_1 = require("../utils/collections/createCollection");
var reports_1 = require("../utils/collections/reports");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Mock dependencies
jest.mock('@libs/ReportUtils', function () { return (__assign(__assign({}, jest.requireActual('@libs/ReportUtils')), { 
    // These methods are mocked below in the beforeAll function to return specific values
    isExpenseReport: jest.fn(), getTitleReportField: jest.fn() })); });
jest.mock('@libs/Log', function () { return ({
    info: jest.fn(),
}); });
var mockReportUtils = ReportUtils;
describe('[OptimisticReportNames] Performance Tests', function () {
    var REPORTS_COUNT = 1000;
    var POLICIES_COUNT = 100;
    var mockPolicy = {
        id: 'policy1',
        name: 'Test Policy',
        fieldList: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            text_title: {
                defaultValue: '{report:type} - {report:startdate} - {report:total} {report:currency}',
            },
        },
    };
    var mockPolicies = (0, createCollection_1.default)(function (item) { return "policy_".concat(item.id); }, function (index) { return (__assign(__assign({}, mockPolicy), { id: "policy".concat(index), name: "Policy ".concat(index) })); }, POLICIES_COUNT);
    var mockReports = (0, createCollection_1.default)(function (item) { return "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(item.reportID); }, function (index) { return (__assign(__assign({}, (0, reports_1.createRandomReport)(index)), { policyID: "policy".concat(index % POLICIES_COUNT), total: -(Math.random() * 100000), currency: 'USD', lastVisibleActionCreated: new Date().toISOString() })); }, REPORTS_COUNT);
    var mockContext = {
        betas: ['authAutoReportTitle'],
        betaConfiguration: {},
        allReports: mockReports,
        allPolicies: mockPolicies,
        allReportNameValuePairs: {},
        allTransactions: {},
    };
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
                    mockReportUtils.isExpenseReport.mockReturnValue(true);
                    mockReportUtils.getTitleReportField.mockReturnValue((_a = mockPolicy.fieldList) === null || _a === void 0 ? void 0 : _a.text_title);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () {
        react_native_onyx_1.default.clear();
    });
    describe('Single Report Name Computation', function () {
        test('[OptimisticReportNames] computeReportNameIfNeeded() single report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var report, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        report = Object.values(mockReports).at(0);
                        update = {
                            key: "report_".concat(report === null || report === void 0 ? void 0 : report.reportID),
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            value: { total: -20000 },
                        };
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.computeReportNameIfNeeded)(report, update, mockContext); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Batch Processing Performance', function () {
        test('[OptimisticReportNames] updateOptimisticReportNamesFromUpdates() with 10 new reports', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = Array.from({ length: 10 }, function (_, i) { return ({
                            key: "report_new".concat(i),
                            onyxMethod: react_native_onyx_1.default.METHOD.SET,
                            value: {
                                reportID: "new".concat(i),
                                policyID: "policy".concat(i % 10),
                                total: -(Math.random() * 50000),
                                currency: 'USD',
                                lastVisibleActionCreated: new Date().toISOString(),
                            },
                        }); });
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('[OptimisticReportNames] updateOptimisticReportNamesFromUpdates() with 50 existing report updates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportKeys, updates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportKeys = Object.keys(mockReports).slice(0, 50);
                        updates = reportKeys.map(function (key) { return ({
                            key: key,
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            value: { total: -(Math.random() * 100000) },
                        }); });
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('[OptimisticReportNames] updateOptimisticReportNamesFromUpdates() with 100 mixed updates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var newReportUpdates, existingReportUpdates, allUpdates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newReportUpdates = Array.from({ length: 50 }, function (_, i) { return ({
                            key: "report_batch".concat(i),
                            onyxMethod: react_native_onyx_1.default.METHOD.SET,
                            value: {
                                reportID: "batch".concat(i),
                                policyID: "policy".concat(i % 20),
                                total: -(Math.random() * 75000),
                                currency: 'USD',
                                lastVisibleActionCreated: new Date().toISOString(),
                            },
                        }); });
                        existingReportUpdates = Object.keys(mockReports)
                            .slice(0, 50)
                            .map(function (key) { return ({
                            key: key,
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            value: { total: -(Math.random() * 125000) },
                        }); });
                        allUpdates = __spreadArray(__spreadArray([], newReportUpdates, true), existingReportUpdates, true);
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(allUpdates, mockContext); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Policy Update Impact Performance', function () {
        test('[OptimisticReportNames] policy update affecting multiple reports', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policyUpdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policyUpdate = {
                            key: 'policy_policy1',
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            value: { name: 'Updated Policy Name' },
                        };
                        // This should trigger name computation for all reports using policy1
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)([policyUpdate], mockContext); })];
                    case 1:
                        // This should trigger name computation for all reports using policy1
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('[OptimisticReportNames] multiple policy updates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policyUpdates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policyUpdates = Array.from({ length: 10 }, function (_, i) { return ({
                            key: "policy_policy".concat(i),
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            value: { name: "Bulk Updated Policy ".concat(i) },
                        }); });
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(policyUpdates, mockContext); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Large Dataset Performance', function () {
        test('[OptimisticReportNames] processing with large context (1000 reports)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = Array.from({ length: 1000 }, function (_, i) { return ({
                            key: "report_large".concat(i),
                            onyxMethod: react_native_onyx_1.default.METHOD.SET,
                            value: {
                                reportID: "large".concat(i),
                                policyID: "policy".concat(i % 50),
                                total: -(Math.random() * 200000),
                                currency: 'USD',
                                lastVisibleActionCreated: new Date().toISOString(),
                            },
                        }); });
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('[OptimisticReportNames] worst case: many irrelevant updates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var irrelevantUpdates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        irrelevantUpdates = Array.from({ length: 100 }, function (_, i) { return ({
                            key: "transaction_".concat(i),
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            value: { description: "Updated transaction ".concat(i) },
                        }); });
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(irrelevantUpdates, mockContext); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Edge Cases Performance', function () {
        test('[OptimisticReportNames] reports without formulas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var contextWithoutFormulas, updates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contextWithoutFormulas = __assign(__assign({}, mockContext), { allPolicies: (0, createCollection_1.default)(function (item) { return "policy_".concat(item.id); }, function (index) {
                                return ({
                                    id: "policy".concat(index),
                                    name: "Policy ".concat(index),
                                    fieldList: {
                                        // eslint-disable-next-line @typescript-eslint/naming-convention
                                        text_title: {
                                            name: 'Title',
                                            defaultValue: 'Static Title',
                                            fieldID: 'text_title',
                                            orderWeight: 0,
                                            type: 'text',
                                            deletable: true,
                                            values: [],
                                            keys: [],
                                            externalIDs: [],
                                            disabledOptions: [],
                                            isTax: false,
                                        },
                                    },
                                });
                            }, 50), allReportNameValuePairs: {} });
                        updates = Array.from({ length: 20 }, function (_, i) { return ({
                            key: "report_static".concat(i),
                            onyxMethod: react_native_onyx_1.default.METHOD.SET,
                            value: {
                                reportID: "static".concat(i),
                                policyID: "policy".concat(i % 10),
                                total: -10000,
                                currency: 'USD',
                            },
                        }); });
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, contextWithoutFormulas); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('[OptimisticReportNames] missing policies and reports', function () { return __awaiter(void 0, void 0, void 0, function () {
            var contextWithMissingData, updates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contextWithMissingData = {
                            betas: ['authAutoReportTitle'],
                            betaConfiguration: {},
                            allReports: {},
                            allPolicies: {},
                            allReportNameValuePairs: {},
                            allTransactions: {},
                        };
                        updates = Array.from({ length: 10 }, function (_, i) { return ({
                            key: "report_missing".concat(i),
                            onyxMethod: react_native_onyx_1.default.METHOD.SET,
                            value: {
                                reportID: "missing".concat(i),
                                policyID: 'nonexistent',
                                total: -10000,
                                currency: 'USD',
                            },
                        }); });
                        return [4 /*yield*/, (0, reassure_1.measureFunction)(function () { return (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, contextWithMissingData); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
