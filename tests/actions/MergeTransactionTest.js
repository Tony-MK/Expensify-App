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
var react_native_onyx_1 = require("react-native-onyx");
var MergeTransaction_1 = require("@libs/actions/MergeTransaction");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var mergeTransaction_1 = require("../utils/collections/mergeTransaction");
var reports_1 = require("../utils/collections/reports");
var transaction_1 = require("../utils/collections/transaction");
var TestHelper = require("../utils/TestHelper");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Helper function to create mock violations
function createMockViolations() {
    return [
        {
            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
            showInReview: true,
        },
        {
            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
            showInReview: true,
        },
    ];
}
describe('mergeTransactionRequest', function () {
    var mockFetch;
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(function () {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    it('should update target transaction with merged values optimistically', function () { return __awaiter(void 0, void 0, void 0, function () {
        var targetTransaction, sourceExpenseReport, sourceTransaction, mergeTransaction, mergeTransactionID, updatedTargetTransaction, updatedSourceTransaction, updatedSourceReport, updatedMergeTransaction;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    targetTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { amount: 100, currency: 'USD', transactionID: 'target123', merchant: 'Original Merchant', category: 'Original Category', reportID: 'target-report-456' });
                    sourceExpenseReport = __assign(__assign({}, (0, reports_1.createExpenseReport)(1)), { reportID: 'source-report-123' });
                    sourceTransaction = __assign(__assign({}, (0, transaction_1.default)(2)), { transactionID: 'source456', reportID: sourceExpenseReport.reportID });
                    mergeTransaction = __assign(__assign({}, (0, mergeTransaction_1.default)(1)), { amount: 200, currency: 'USD', targetTransactionID: 'target123', sourceTransactionID: 'source456', merchant: 'Updated Merchant', category: 'Updated Category', tag: 'Updated Tag' });
                    mergeTransactionID = 'merge789';
                    // Set up initial state in Onyx
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(targetTransaction.transactionID), targetTransaction)];
                case 1:
                    // Set up initial state in Onyx
                    _d.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(sourceTransaction.transactionID), sourceTransaction)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(sourceExpenseReport.reportID), sourceExpenseReport)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(mergeTransactionID), mergeTransaction)];
                case 4:
                    _d.sent();
                    (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                    // When: The merge transaction request is initiated
                    // This should immediately update the UI with optimistic values
                    (0, MergeTransaction_1.mergeTransactionRequest)(mergeTransactionID, mergeTransaction, targetTransaction, sourceTransaction);
                    return [4 /*yield*/, ((_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch))];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(targetTransaction.transactionID),
                                callback: function (transaction) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(transaction !== null && transaction !== void 0 ? transaction : null);
                                },
                            });
                        })];
                case 7:
                    updatedTargetTransaction = _d.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(sourceTransaction.transactionID),
                                callback: function (transaction) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(transaction !== null && transaction !== void 0 ? transaction : null);
                                },
                            });
                        })];
                case 8:
                    updatedSourceTransaction = _d.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(sourceExpenseReport.reportID),
                                callback: function (report) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(report !== null && report !== void 0 ? report : null);
                                },
                            });
                        })];
                case 9:
                    updatedSourceReport = _d.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(mergeTransactionID),
                                callback: function (transaction) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(transaction !== null && transaction !== void 0 ? transaction : null);
                                },
                            });
                        })];
                case 10:
                    updatedMergeTransaction = _d.sent();
                    // Verify target transaction is updated with merged values
                    expect(updatedTargetTransaction === null || updatedTargetTransaction === void 0 ? void 0 : updatedTargetTransaction.modifiedAmount).toBe(mergeTransaction.amount);
                    expect(updatedTargetTransaction === null || updatedTargetTransaction === void 0 ? void 0 : updatedTargetTransaction.modifiedMerchant).toBe(mergeTransaction.merchant);
                    expect(updatedTargetTransaction === null || updatedTargetTransaction === void 0 ? void 0 : updatedTargetTransaction.category).toBe(mergeTransaction.category);
                    expect(updatedTargetTransaction === null || updatedTargetTransaction === void 0 ? void 0 : updatedTargetTransaction.tag).toBe(mergeTransaction.tag);
                    expect((_c = updatedTargetTransaction === null || updatedTargetTransaction === void 0 ? void 0 : updatedTargetTransaction.comment) === null || _c === void 0 ? void 0 : _c.comment).toBe(mergeTransaction.description);
                    // Verify source transaction is deleted
                    expect(updatedSourceTransaction).toBeNull();
                    // Verify source report is deleted (since it only had one transaction)
                    expect(updatedSourceReport).toBeNull();
                    // Verify merge transaction is cleaned up
                    expect(updatedMergeTransaction).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should restore original state when API returns error', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceReport, targetTransaction, sourceTransaction, mergeTransaction, mergeTransactionID, mockViolations, restoredTargetTransaction, restoredSourceTransaction, restoredSourceReport;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sourceReport = __assign(__assign({}, (0, reports_1.createExpenseReport)(1)), { reportID: 'source-report-123' });
                    targetTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { transactionID: 'target123', merchant: 'Original Merchant', category: 'Original Category', reportID: 'target-report-456' });
                    sourceTransaction = __assign(__assign({}, (0, transaction_1.default)(2)), { transactionID: 'source456', merchant: 'Source Merchant', reportID: sourceReport.reportID });
                    mergeTransaction = __assign(__assign({}, (0, mergeTransaction_1.default)(1)), { targetTransactionID: 'target123', sourceTransactionID: 'source456', merchant: 'Updated Merchant', category: 'Updated Category' });
                    mergeTransactionID = 'merge789';
                    mockViolations = createMockViolations();
                    (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                    // Set up initial state in Onyx
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(targetTransaction.transactionID), targetTransaction)];
                case 1:
                    // Set up initial state in Onyx
                    _d.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(sourceTransaction.transactionID), sourceTransaction)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(sourceReport.reportID), sourceReport)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(mergeTransactionID), mergeTransaction)];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(targetTransaction.transactionID), mockViolations)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(sourceTransaction.transactionID), mockViolations)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 7:
                    _d.sent();
                    // When: The merge request is executed but the API will return an error
                    (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.fail) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                    (0, MergeTransaction_1.mergeTransactionRequest)(mergeTransactionID, mergeTransaction, targetTransaction, sourceTransaction);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 8:
                    _d.sent();
                    // Resume fetch to process the failed API response
                    return [4 /*yield*/, ((_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _c === void 0 ? void 0 : _c.call(mockFetch))];
                case 9:
                    // Resume fetch to process the failed API response
                    _d.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(targetTransaction.transactionID),
                                callback: function (transaction) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(transaction !== null && transaction !== void 0 ? transaction : null);
                                },
                            });
                        })];
                case 11:
                    restoredTargetTransaction = _d.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(sourceTransaction.transactionID),
                                callback: function (transaction) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(transaction !== null && transaction !== void 0 ? transaction : null);
                                },
                            });
                        })];
                case 12:
                    restoredSourceTransaction = _d.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(sourceReport.reportID),
                                callback: function (report) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(report !== null && report !== void 0 ? report : null);
                                },
                            });
                        })];
                case 13:
                    restoredSourceReport = _d.sent();
                    // Verify target transaction is restored to original state
                    expect(restoredTargetTransaction === null || restoredTargetTransaction === void 0 ? void 0 : restoredTargetTransaction.merchant).toBe('Original Merchant');
                    expect(restoredTargetTransaction === null || restoredTargetTransaction === void 0 ? void 0 : restoredTargetTransaction.category).toBe('Original Category');
                    // Verify source transaction is restored (not deleted)
                    expect(restoredSourceTransaction === null || restoredSourceTransaction === void 0 ? void 0 : restoredSourceTransaction.transactionID).toBe('source456');
                    expect(restoredSourceTransaction === null || restoredSourceTransaction === void 0 ? void 0 : restoredSourceTransaction.merchant).toBe('Source Merchant');
                    // Verify source report is restored (not deleted)
                    expect(restoredSourceReport === null || restoredSourceReport === void 0 ? void 0 : restoredSourceReport.reportID).toBe(sourceReport.reportID);
                    expect(restoredSourceReport).toEqual(sourceReport);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should handle transaction violations correctly during merge', function () { return __awaiter(void 0, void 0, void 0, function () {
        var targetTransaction, sourceTransaction, mergeTransaction, mergeTransactionID, mockViolations, updatedTargetViolations;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    targetTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { transactionID: 'target123' });
                    sourceTransaction = __assign(__assign({}, (0, transaction_1.default)(2)), { transactionID: 'source456' });
                    mergeTransaction = __assign(__assign({}, (0, mergeTransaction_1.default)(1)), { targetTransactionID: 'target123', sourceTransactionID: 'source456' });
                    mergeTransactionID = 'merge789';
                    mockViolations = createMockViolations();
                    // Set up initial state with violations in Onyx
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(targetTransaction.transactionID), targetTransaction)];
                case 1:
                    // Set up initial state with violations in Onyx
                    _c.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(sourceTransaction.transactionID), sourceTransaction)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(mergeTransactionID), mergeTransaction)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(targetTransaction.transactionID), mockViolations)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(sourceTransaction.transactionID), mockViolations)];
                case 5:
                    _c.sent();
                    (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                    // When: The merge request is executed, which should handle violation updates
                    // - Optimistically remove DUPLICATED_TRANSACTION violations since transactions are being merged
                    // - Keep other violations like MISSING_CATEGORY intact
                    (0, MergeTransaction_1.mergeTransactionRequest)(mergeTransactionID, mergeTransaction, targetTransaction, sourceTransaction);
                    return [4 /*yield*/, ((_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch))];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(targetTransaction.transactionID),
                                callback: function (violations) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(violations !== null && violations !== void 0 ? violations : null);
                                },
                            });
                        })];
                case 8:
                    updatedTargetViolations = _c.sent();
                    // Should only contain non-duplicate violations
                    expect(updatedTargetViolations).toEqual([
                        expect.objectContaining({
                            name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                        }),
                    ]);
                    // Should not contain duplicate transaction violations
                    expect(updatedTargetViolations === null || updatedTargetViolations === void 0 ? void 0 : updatedTargetViolations.some(function (v) { return v.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION; })).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Report deletion logic', function () {
        it('should NOT delete source report optimistically when it contains multiple transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sourceReport, targetTransaction, sourceTransaction, otherTransaction, mergeTransaction, mergeTransactionID, updatedSourceReport;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sourceReport = __assign(__assign({}, (0, reports_1.createExpenseReport)(1)), { reportID: 'source-report-123' });
                        targetTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { transactionID: 'target123', reportID: 'target-report-456' });
                        sourceTransaction = __assign(__assign({}, (0, transaction_1.default)(2)), { transactionID: 'source456', reportID: sourceReport.reportID });
                        otherTransaction = __assign(__assign({}, (0, transaction_1.default)(3)), { transactionID: 'other789', reportID: sourceReport.reportID });
                        mergeTransaction = __assign(__assign({}, (0, mergeTransaction_1.default)(1)), { targetTransactionID: 'target123', sourceTransactionID: 'source456' });
                        mergeTransactionID = 'merge789';
                        // Set up initial state
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(targetTransaction.transactionID), targetTransaction)];
                    case 1:
                        // Set up initial state
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(sourceTransaction.transactionID), sourceTransaction)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(otherTransaction.transactionID), otherTransaction)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(sourceReport.reportID), sourceReport)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(mergeTransactionID), mergeTransaction)];
                    case 5:
                        _c.sent();
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        // When: The merge request is executed
                        (0, MergeTransaction_1.mergeTransactionRequest)(mergeTransactionID, mergeTransaction, targetTransaction, sourceTransaction);
                        return [4 /*yield*/, ((_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch))];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(sourceReport.reportID),
                                    callback: function (report) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(report !== null && report !== void 0 ? report : null);
                                    },
                                });
                            })];
                    case 8:
                        updatedSourceReport = _c.sent();
                        expect(updatedSourceReport).toEqual(sourceReport);
                        expect(updatedSourceReport === null || updatedSourceReport === void 0 ? void 0 : updatedSourceReport.reportID).toBe(sourceReport.reportID);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('setupMergeTransactionData', function () {
    beforeEach(function () {
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    it('should set merge transaction data with initial values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionID, mergeTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionID = 'test-transaction-123';
                    // When we setup merge transaction data
                    (0, MergeTransaction_1.setupMergeTransactionData)(transactionID, { targetTransactionID: transactionID });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID),
                                callback: function (transaction) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(transaction !== null && transaction !== void 0 ? transaction : null);
                                },
                            });
                        })];
                case 2:
                    mergeTransaction = _a.sent();
                    expect(mergeTransaction).toEqual({
                        targetTransactionID: transactionID,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('setMergeTransactionKey', function () {
    beforeEach(function () {
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    it('should merge values into existing merge transaction data', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionID, existingMergeTransaction, newValues, mergeTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionID = 'test-transaction-789';
                    existingMergeTransaction = {
                        targetTransactionID: transactionID,
                        merchant: 'Original Merchant',
                        amount: 1000,
                    };
                    return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID), existingMergeTransaction)];
                case 1:
                    _a.sent();
                    newValues = {
                        merchant: 'Updated Merchant',
                        category: 'New Category',
                        description: 'New Description',
                    };
                    (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, newValues);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID),
                                callback: function (transaction) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    resolve(transaction !== null && transaction !== void 0 ? transaction : null);
                                },
                            });
                        })];
                case 3:
                    mergeTransaction = _a.sent();
                    expect(mergeTransaction).toEqual({
                        targetTransactionID: transactionID,
                        merchant: 'Updated Merchant', // Updated
                        amount: 1000, // Preserved
                        category: 'New Category', // Added
                        description: 'New Description', // Added
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
