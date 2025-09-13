"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const OptimisticReportNames_1 = require("@libs/OptimisticReportNames");
// eslint-disable-next-line no-restricted-syntax -- disabled because we need ReportUtils to mock
const ReportUtils = require("@libs/ReportUtils");
// Mock dependencies
jest.mock('@libs/ReportUtils', () => ({
    ...jest.requireActual('@libs/ReportUtils'),
    isExpenseReport: jest.fn(),
    getTitleReportField: jest.fn(),
    getReportTransactions: jest.fn(),
}));
jest.mock('@libs/CurrencyUtils', () => ({
    getCurrencySymbol: jest.fn().mockReturnValue('$'),
}));
const mockReportUtils = ReportUtils;
describe('OptimisticReportNames', () => {
    const mockPolicy = {
        id: 'policy1',
        fieldList: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            text_title: {
                defaultValue: '{report:type} - {report:total}',
            },
        },
    };
    const mockReport = {
        reportID: '123',
        reportName: 'Old Name',
        policyID: 'policy1',
        total: -10000,
        currency: 'USD',
        lastVisibleActionCreated: '2025-01-15T10:30:00Z',
        type: 'expense',
    };
    const mockContext = {
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
    beforeEach(() => {
        jest.clearAllMocks();
        mockReportUtils.isExpenseReport.mockReturnValue(true);
        mockReportUtils.getTitleReportField.mockReturnValue(mockPolicy.fieldList?.text_title);
    });
    describe('shouldComputeReportName()', () => {
        test('should return true for expense report with title field formula', () => {
            const result = (0, OptimisticReportNames_1.shouldComputeReportName)(mockReport, mockPolicy);
            expect(result).toBe(true);
        });
        test('should return false for reports with unsupported type', () => {
            mockReportUtils.isExpenseReport.mockReturnValue(false);
            const result = (0, OptimisticReportNames_1.shouldComputeReportName)({
                ...mockReport,
                type: 'iou',
            }, mockPolicy);
            expect(result).toBe(false);
        });
        test('should return false when no policy', () => {
            const result = (0, OptimisticReportNames_1.shouldComputeReportName)(mockReport, undefined);
            expect(result).toBe(false);
        });
        test('should return false when no title field', () => {
            mockReportUtils.getTitleReportField.mockReturnValue(undefined);
            const result = (0, OptimisticReportNames_1.shouldComputeReportName)(mockReport, mockPolicy);
            expect(result).toBe(false);
        });
        test('should return true when title field has no formula', () => {
            const policyWithoutFormula = {
                ...mockPolicy,
                fieldList: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    text_title: { defaultValue: 'Static Title' },
                },
            };
            mockReportUtils.getTitleReportField.mockReturnValue(policyWithoutFormula.fieldList?.text_title);
            const result = (0, OptimisticReportNames_1.shouldComputeReportName)(mockReport, policyWithoutFormula);
            expect(result).toBe(true);
        });
    });
    describe('computeReportNameIfNeeded()', () => {
        test('should compute name when report data changes', () => {
            const update = {
                key: 'report_123',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { total: -20000 },
            };
            const result = (0, OptimisticReportNames_1.computeReportNameIfNeeded)(mockReport, update, mockContext);
            expect(result).toEqual('Expense Report - $200.00');
        });
        test('should return null when name would not change', () => {
            const update = {
                key: 'report_456',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { description: 'Updated description' },
            };
            const result = (0, OptimisticReportNames_1.computeReportNameIfNeeded)({
                ...mockReport,
                reportName: 'Expense Report - $100.00',
            }, update, mockContext);
            expect(result).toBeNull();
        });
    });
    describe('updateOptimisticReportNamesFromUpdates()', () => {
        test('should detect new report creation and add name update', () => {
            const updates = [
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
            const result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext);
            expect(result).toHaveLength(2); // Original + name update
            expect(result.at(1)).toEqual({
                key: 'report_456',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { reportName: 'Expense Report - $150.00' },
            });
        });
        test('should handle existing report updates', () => {
            const updates = [
                {
                    key: 'report_123',
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    value: { total: -25000 },
                },
            ];
            const result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext);
            expect(result).toHaveLength(2); // Original + name update
            expect(result.at(1)?.value).toEqual({ reportName: 'Expense Report - $250.00' });
        });
        test('should handle policy updates affecting multiple reports', () => {
            const contextWithMultipleReports = {
                ...mockContext,
                allReports: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    report_123: { ...mockReport, reportID: '123' },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    report_456: { ...mockReport, reportID: '456' },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    report_789: { ...mockReport, reportID: '789' },
                },
                allReportNameValuePairs: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    reportNameValuePairs_123: { private_isArchived: '' },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    reportNameValuePairs_456: { private_isArchived: '' },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    reportNameValuePairs_789: { private_isArchived: '' },
                },
            };
            mockReportUtils.getTitleReportField.mockReturnValue({ defaultValue: 'Policy: {report:policyname}' });
            const updates = [
                {
                    key: 'policy_policy1',
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    value: { name: 'Updated Policy Name' },
                },
            ];
            const result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, contextWithMultipleReports);
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
        test('should handle unknown object types gracefully', () => {
            const updates = [
                {
                    key: 'unknown_123',
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    value: { someData: 'value' },
                },
            ];
            const result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext);
            expect(result).toEqual(updates); // Unchanged
        });
    });
    describe('Edge Cases', () => {
        test('should handle missing report gracefully', () => {
            const update = {
                key: 'report_999',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { total: -10000 },
            };
            const result = (0, OptimisticReportNames_1.computeReportNameIfNeeded)(undefined, update, mockContext);
            expect(result).toBeNull();
        });
    });
    describe('Transaction Updates', () => {
        test('should process transaction updates and trigger report name updates', () => {
            const contextWithTransaction = {
                ...mockContext,
                allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_txn123: {
                        transactionID: 'txn123',
                        reportID: '123',
                        created: '2024-01-01',
                        amount: -5000,
                        currency: 'USD',
                        merchant: 'Original Merchant',
                    },
                },
            };
            const update = {
                key: 'transactions_txn123',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    created: '2024-02-15', // Updated date
                    reportID: '123',
                },
            };
            const result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)([update], contextWithTransaction);
            // Should include original update + new report name update
            expect(result).toHaveLength(2);
            expect(result.at(0)).toEqual(update); // Original transaction update
            expect(result.at(1)?.key).toBe('report_123'); // New report update
        });
        test('getReportByTransactionID should find report from transaction', () => {
            const contextWithTransaction = {
                ...mockContext,
                allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_abc123: {
                        transactionID: 'abc123',
                        reportID: '123',
                        amount: -7500,
                        created: '2024-01-15',
                        currency: 'USD',
                        merchant: 'Test Store',
                    },
                },
            };
            const result = (0, OptimisticReportNames_1.getReportByTransactionID)('abc123', contextWithTransaction);
            expect(result).toEqual(mockReport);
            expect(result?.reportID).toBe('123');
        });
        test('getReportByTransactionID should return undefined for missing transaction', () => {
            const result = (0, OptimisticReportNames_1.getReportByTransactionID)('nonexistent', mockContext);
            expect(result).toBeUndefined();
        });
        test('getReportByTransactionID should return undefined for transaction without reportID', () => {
            const contextWithIncompleteTransaction = {
                ...mockContext,
                allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_incomplete: {
                        transactionID: 'incomplete',
                        amount: -1000,
                        currency: 'USD',
                        merchant: 'Store',
                        // Missing reportID
                    },
                },
            };
            const result = (0, OptimisticReportNames_1.getReportByTransactionID)('incomplete', contextWithIncompleteTransaction);
            expect(result).toBeUndefined();
        });
        test('should handle transaction updates that rely on context lookup', () => {
            const contextWithTransaction = {
                ...mockContext,
                allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_xyz789: {
                        transactionID: 'xyz789',
                        reportID: '123',
                        created: '2024-01-01',
                        amount: -3000,
                        currency: 'EUR',
                        merchant: 'Context Store',
                    },
                },
            };
            // Transaction update without reportID in the value
            const update = {
                key: 'transactions_xyz789',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    amount: -4000, // Updated amount
                    // No reportID provided in update
                },
            };
            const result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)([update], contextWithTransaction);
            // Should still find the report through context lookup and generate update
            expect(result).toHaveLength(2);
            expect(result.at(1)?.key).toBe('report_123');
        });
        test('should use optimistic transaction data in formula computation', () => {
            mockReportUtils.getTitleReportField.mockReturnValue({
                defaultValue: 'Report from {report:startdate}',
            });
            const contextWithTransaction = {
                ...mockContext,
                allTransactions: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_formula123: {
                        transactionID: 'formula123',
                        reportID: '123',
                        created: '2024-01-01', // Original date
                        amount: -5000,
                        currency: 'USD',
                        merchant: 'Original Store',
                    },
                },
            };
            // Mock getReportTransactions to return the original transaction
            // eslint-disable-next-line @typescript-eslint/dot-notation
            mockReportUtils.getReportTransactions.mockReturnValue([contextWithTransaction.allTransactions['transactions_formula123']]);
            const update = {
                key: 'transactions_formula123',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    transactionID: 'formula123',
                    created: '2024-03-15', // Updated date that should be used in formula
                    modifiedCreated: '2024-03-15',
                },
            };
            const result = (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)([update], contextWithTransaction);
            expect(result).toHaveLength(2);
            // The key test: verify exact report name with optimistic date
            const reportUpdate = result.at(1);
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
