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
var react_native_onyx_1 = require("react-native-onyx");
var OptimisticReportNames_1 = require("@libs/OptimisticReportNames");
// eslint-disable-next-line no-restricted-syntax -- disabled because we need ReportUtils to mock
var ReportUtils = require("@libs/ReportUtils");
// Mock dependencies
jest.mock('@libs/ReportUtils', function () { return (__assign(__assign({}, jest.requireActual('@libs/ReportUtils')), { isExpenseReport: jest.fn(), getTitleReportField: jest.fn(), getReportTransactions: jest.fn() })); });
jest.mock('@libs/CurrencyUtils', function () { return ({
    getCurrencySymbol: jest.fn().mockReturnValue('$'),
}); });
var mockReportUtils = ReportUtils;
describe('OptimisticReportNames', function () {
    var mockPolicy = {
        id: 'policy1',
        fieldList: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            text_title: {
                defaultValue: '{report:type} - {report:total}',
            },
        },
    };
    var mockReport = {
        reportID: '123',
        reportName: 'Old Name',
        policyID: 'policy1',
        total: -10000,
        currency: 'USD',
        lastVisibleActionCreated: '2025-01-15T10:30:00Z',
        type: 'expense',
    };
    var mockContext = {
        betas: ['authAutoReportTitle'],
        betaConfiguration: {},
        allReports: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            report_123: mockReport,
        },
        allPolicies: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            policy_policy1: mockPolicy,
        },
        allReportNameValuePairs: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            reportNameValuePairs_123: {
                private_isArchived: '',
            },
        },
        allTransactions: {},
    };
    beforeEach(function () {
        var _a;
        jest.clearAllMocks();
        mockReportUtils.isExpenseReport.mockReturnValue(true);
        mockReportUtils.getTitleReportField.mockReturnValue((_a = mockPolicy.fieldList) === null || _a === void 0 ? void 0 : _a.text_title);
    });
    describe('shouldComputeReportName()', function () {
        test('should return true for expense report with title field formula', function () {
            var result = (0, OptimisticReportNames_1.shouldComputeReportName)(mockReport, mockPolicy);
            expect(result).toBe(true);
        });
        test('should return false for reports with unsupported type', function () {
            mockReportUtils.isExpenseReport.mockReturnValue(false);
            var result = (0, OptimisticReportNames_1.shouldComputeReportName)(__assign(__assign({}, mockReport), { type: 'iou' }), mockPolicy);
            expect(result).toBe(false);
        });
        test('should return false when no policy', function () {
            var result = (0, OptimisticReportNames_1.shouldComputeReportName)(mockReport, undefined);
            expect(result).toBe(false);
        });
        test('should return false when no title field', function () {
            mockReportUtils.getTitleReportField.mockReturnValue(undefined);
            var result = (0, OptimisticReportNames_1.shouldComputeReportName)(mockReport, mockPolicy);
            expect(result).toBe(false);
        });
        test('should return true when title field has no formula', function () {
            var _a;
            var policyWithoutFormula = __assign(__assign({}, mockPolicy), { fieldList: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    text_title: { defaultValue: 'Static Title' },
                } });
            mockReportUtils.getTitleReportField.mockReturnValue((_a = policyWithoutFormula.fieldList) === null || _a === void 0 ? void 0 : _a.text_title);
            var result = (0, OptimisticReportNames_1.shouldComputeReportName)(mockReport, policyWithoutFormula);
            expect(result).toBe(true);
        });
    });
    describe('computeReportNameIfNeeded()', function () {
        test('should compute name when report data changes', function () {
            var update = {
                key: 'report_123',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { total: -20000 },
            };
            var result = (0, OptimisticReportNames_1.computeReportNameIfNeeded)(mockReport, update, mockContext);
            expect(result).toEqual('Expense Report - $200.00');
        });
        test('should return null when name would not change', function () {
            var update = {
                key: 'report_456',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { description: 'Updated description' },
            };
            var result = (0, OptimisticReportNames_1.computeReportNameIfNeeded)(__assign(__assign({}, mockReport), { reportName: 'Expense Report - $100.00' }), update, mockContext);
            expect(result).toBeNull();
        });
    });
    describe('updateOptimisticReportNamesFromUpdates()', function () {
        test('should detect new report creation and add name update', function () {
            var updates = [
                {
                    key: 'report_456',
                    onyxMethod: react_native_onyx_1.default.METHOD.SET,
                    value: {
                        reportID: '456',
                        policyID: 'policy1',
                        total: -15000,
                        currency: 'USD',
                        type: 'expense',
                    },
                },
            ];
            var result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext);
            expect(result).toHaveLength(2); // Original + name update
            expect(result.at(1)).toEqual({
                key: 'report_456',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { reportName: 'Expense Report - $150.00' },
            });
        });
        test('should handle existing report updates', function () {
            var _a;
            var updates = [
                {
                    key: 'report_123',
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    value: { total: -25000 },
                },
            ];
            var result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext);
            expect(result).toHaveLength(2); // Original + name update
            expect((_a = result.at(1)) === null || _a === void 0 ? void 0 : _a.value).toEqual({ reportName: 'Expense Report - $250.00' });
        });
        test('should handle policy updates affecting multiple reports', function () {
            var contextWithMultipleReports = __assign(__assign({}, mockContext), { allReports: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    report_123: __assign(__assign({}, mockReport), { reportID: '123' }),
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    report_456: __assign(__assign({}, mockReport), { reportID: '456' }),
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    report_789: __assign(__assign({}, mockReport), { reportID: '789' }),
                }, allReportNameValuePairs: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    reportNameValuePairs_123: { private_isArchived: '' },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    reportNameValuePairs_456: { private_isArchived: '' },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    reportNameValuePairs_789: { private_isArchived: '' },
                } });
            mockReportUtils.getTitleReportField.mockReturnValue({ defaultValue: 'Policy: {report:policyname}' });
            var updates = [
                {
                    key: 'policy_policy1',
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    value: { name: 'Updated Policy Name' },
                },
            ];
            var result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, contextWithMultipleReports);
            expect(result).toHaveLength(4);
            // Assert the original policy update
            expect(result.at(0)).toEqual({
                key: 'policy_policy1',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { name: 'Updated Policy Name' },
            });
            // Assert individual report name updates
            expect(result.at(1)).toEqual({
                key: 'report_123',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { reportName: 'Policy: Updated Policy Name' },
            });
            expect(result.at(2)).toEqual({
                key: 'report_456',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { reportName: 'Policy: Updated Policy Name' },
            });
            expect(result.at(3)).toEqual({
                key: 'report_789',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { reportName: 'Policy: Updated Policy Name' },
            });
        });
        test('should handle unknown object types gracefully', function () {
            var updates = [
                {
                    key: 'unknown_123',
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    value: { someData: 'value' },
                },
            ];
            var result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext);
            expect(result).toEqual(updates); // Unchanged
        });
    });
    describe('Edge Cases', function () {
        test('should handle missing report gracefully', function () {
            var update = {
                key: 'report_999',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { total: -10000 },
            };
            var result = (0, OptimisticReportNames_1.computeReportNameIfNeeded)(undefined, update, mockContext);
            expect(result).toBeNull();
        });
    });
    describe('Transaction Updates', function () {
        test('should process transaction updates and trigger report name updates', function () {
            var _a;
            var contextWithTransaction = __assign(__assign({}, mockContext), { allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_txn123: {
                        transactionID: 'txn123',
                        reportID: '123',
                        created: '2024-01-01',
                        amount: -5000,
                        currency: 'USD',
                        merchant: 'Original Merchant',
                    },
                } });
            var update = {
                key: 'transactions_txn123',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    created: '2024-02-15', // Updated date
                    reportID: '123',
                },
            };
            var result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)([update], contextWithTransaction);
            // Should include original update + new report name update
            expect(result).toHaveLength(2);
            expect(result.at(0)).toEqual(update); // Original transaction update
            expect((_a = result.at(1)) === null || _a === void 0 ? void 0 : _a.key).toBe('report_123'); // New report update
        });
        test('getReportByTransactionID should find report from transaction', function () {
            var contextWithTransaction = __assign(__assign({}, mockContext), { allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_abc123: {
                        transactionID: 'abc123',
                        reportID: '123',
                        amount: -7500,
                        created: '2024-01-15',
                        currency: 'USD',
                        merchant: 'Test Store',
                    },
                } });
            var result = (0, OptimisticReportNames_1.getReportByTransactionID)('abc123', contextWithTransaction);
            expect(result).toEqual(mockReport);
            expect(result === null || result === void 0 ? void 0 : result.reportID).toBe('123');
        });
        test('getReportByTransactionID should return undefined for missing transaction', function () {
            var result = (0, OptimisticReportNames_1.getReportByTransactionID)('nonexistent', mockContext);
            expect(result).toBeUndefined();
        });
        test('getReportByTransactionID should return undefined for transaction without reportID', function () {
            var contextWithIncompleteTransaction = __assign(__assign({}, mockContext), { allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_incomplete: {
                        transactionID: 'incomplete',
                        amount: -1000,
                        currency: 'USD',
                        merchant: 'Store',
                        // Missing reportID
                    },
                } });
            var result = (0, OptimisticReportNames_1.getReportByTransactionID)('incomplete', contextWithIncompleteTransaction);
            expect(result).toBeUndefined();
        });
        test('should handle transaction updates that rely on context lookup', function () {
            var _a;
            var contextWithTransaction = __assign(__assign({}, mockContext), { allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_xyz789: {
                        transactionID: 'xyz789',
                        reportID: '123',
                        created: '2024-01-01',
                        amount: -3000,
                        currency: 'EUR',
                        merchant: 'Context Store',
                    },
                } });
            // Transaction update without reportID in the value
            var update = {
                key: 'transactions_xyz789',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    amount: -4000, // Updated amount
                    // No reportID provided in update
                },
            };
            var result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)([update], contextWithTransaction);
            // Should still find the report through context lookup and generate update
            expect(result).toHaveLength(2);
            expect((_a = result.at(1)) === null || _a === void 0 ? void 0 : _a.key).toBe('report_123');
        });
        test('should use optimistic transaction data in formula computation', function () {
            mockReportUtils.getTitleReportField.mockReturnValue({
                defaultValue: 'Report from {report:startdate}',
            });
            var contextWithTransaction = __assign(__assign({}, mockContext), { allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_formula123: {
                        transactionID: 'formula123',
                        reportID: '123',
                        created: '2024-01-01', // Original date
                        amount: -5000,
                        currency: 'USD',
                        merchant: 'Original Store',
                    },
                } });
            // Mock getReportTransactions to return the original transaction
            // eslint-disable-next-line @typescript-eslint/dot-notation
            mockReportUtils.getReportTransactions.mockReturnValue([contextWithTransaction.allTransactions['transactions_formula123']]);
            var update = {
                key: 'transactions_formula123',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    transactionID: 'formula123',
                    created: '2024-03-15', // Updated date that should be used in formula
                    modifiedCreated: '2024-03-15',
                },
            };
            var result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)([update], contextWithTransaction);
            expect(result).toHaveLength(2);
            // The key test: verify exact report name with optimistic date
            var reportUpdate = result.at(1);
            expect(reportUpdate).toEqual({
                key: 'report_123',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    reportName: 'Report from 2024-03-15', // Exact expected result with updated date
                },
            });
        });
    });
});
