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
// eslint-disable-next-line no-restricted-syntax -- disabled because we need CurrencyUtils to mock
var CurrencyUtils = require("@libs/CurrencyUtils");
var Formula_1 = require("@libs/Formula");
// eslint-disable-next-line no-restricted-syntax -- disabled because we need ReportActionsUtils to mock
var ReportActionsUtils = require("@libs/ReportActionsUtils");
// eslint-disable-next-line no-restricted-syntax -- disabled because we need ReportUtils to mock
var ReportUtils = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
jest.mock('@libs/ReportActionsUtils', function () { return ({
    getAllReportActions: jest.fn(),
}); });
jest.mock('@libs/ReportUtils', function () { return (__assign(__assign({}, jest.requireActual('@libs/ReportUtils')), { getReportTransactions: jest.fn() })); });
jest.mock('@libs/CurrencyUtils', function () { return ({
    getCurrencySymbol: jest.fn(),
}); });
var mockReportActionsUtils = ReportActionsUtils;
var mockReportUtils = ReportUtils;
var mockCurrencyUtils = CurrencyUtils;
describe('CustomFormula', function () {
    describe('extract()', function () {
        test('should extract formula parts with default braces', function () {
            expect((0, Formula_1.extract)('{report:type} - {report:total}')).toEqual(['{report:type}', '{report:total}']);
        });
        test('should handle nested braces', function () {
            expect((0, Formula_1.extract)('{report:{report:submit:from:firstName|substr:2}}')).toEqual(['{report:{report:submit:from:firstName|substr:2}}']);
        });
        test('should handle escaped braces', function () {
            expect((0, Formula_1.extract)('\\{not-formula} {report:type}')).toEqual(['{report:type}']);
        });
        test('should handle empty formula', function () {
            expect((0, Formula_1.extract)('')).toEqual([]);
        });
        test('should handle formula without braces', function () {
            expect((0, Formula_1.extract)('no braces here')).toEqual([]);
        });
    });
    describe('parse()', function () {
        test('should parse report formula parts', function () {
            var parts = (0, Formula_1.parse)('{report:type} {report:startdate}');
            expect(parts).toHaveLength(3);
            expect(parts.at(0)).toEqual({
                definition: '{report:type}',
                type: 'report',
                fieldPath: ['type'],
                functions: [],
            });
            expect(parts.at(2)).toEqual({
                definition: '{report:startdate}',
                type: 'report',
                fieldPath: ['startdate'],
                functions: [],
            });
        });
        test('should parse field formula parts', function () {
            var parts = (0, Formula_1.parse)('{field:custom_field}');
            expect(parts.at(0)).toEqual({
                definition: '{field:custom_field}',
                type: 'field',
                fieldPath: ['custom_field'],
                functions: [],
            });
        });
        test('should parse user formula parts with functions', function () {
            var parts = (0, Formula_1.parse)('{user:email|frontPart}');
            expect(parts.at(0)).toEqual({
                definition: '{user:email|frontPart}',
                type: 'user',
                fieldPath: ['email'],
                functions: ['frontPart'],
            });
        });
        test('should handle empty formula', function () {
            expect((0, Formula_1.parse)('')).toEqual([]);
        });
        test('should treat formula without braces as free text', function () {
            var _a;
            var parts = (0, Formula_1.parse)('no braces here');
            expect(parts).toHaveLength(1);
            expect((_a = parts.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe('freetext');
        });
    });
    describe('compute()', function () {
        var mockContext = {
            report: {
                reportID: '123',
                reportName: '',
                type: 'expense',
                total: -10000, // -$100.00
                currency: 'USD',
                lastVisibleActionCreated: '2025-01-15T10:30:00Z',
                policyID: 'policy1',
            },
            policy: {
                name: 'Test Policy',
            },
        };
        beforeEach(function () {
            jest.clearAllMocks();
            mockCurrencyUtils.getCurrencySymbol.mockImplementation(function (currency) {
                if (currency === 'USD') {
                    return '$';
                }
                return currency;
            });
            var mockReportActions = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': {
                    reportActionID: '1',
                    created: '2025-01-10T08:00:00Z', // Oldest action
                    actionName: 'CREATED',
                },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '2': {
                    reportActionID: '2',
                    created: '2025-01-15T10:30:00Z', // Later action
                    actionName: 'IOU',
                },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '3': {
                    reportActionID: '3',
                    created: '2025-01-12T14:20:00Z', // Middle action
                    actionName: 'COMMENT',
                },
            };
            var mockTransactions = [
                {
                    transactionID: 'trans1',
                    created: '2025-01-08T12:00:00Z', // Oldest transaction
                    amount: 5000,
                    merchant: 'ACME Ltd.',
                },
                {
                    transactionID: 'trans2',
                    created: '2025-01-14T16:45:00Z', // Later transaction
                    amount: 3000,
                    merchant: 'ACME Ltd.',
                },
                {
                    transactionID: 'trans3',
                    created: '2025-01-11T09:15:00Z', // Middle transaction
                    amount: 2000,
                    merchant: 'ACME Ltd.',
                },
            ];
            mockReportActionsUtils.getAllReportActions.mockReturnValue(mockReportActions);
            mockReportUtils.getReportTransactions.mockReturnValue(mockTransactions);
        });
        test('should compute basic report formula', function () {
            var result = (0, Formula_1.compute)('{report:type} {report:total}', mockContext);
            expect(result).toBe('Expense Report $100.00'); // No space between parts
        });
        test('should compute startdate formula using transactions', function () {
            var result = (0, Formula_1.compute)('{report:startdate}', mockContext);
            expect(result).toBe('2025-01-08'); // Should use oldest transaction date (2025-01-08)
        });
        test('should compute created formula using report actions', function () {
            var result = (0, Formula_1.compute)('{report:created}', mockContext);
            expect(result).toBe('2025-01-10'); // Should use oldest report action date (2025-01-10)
        });
        test('should compute startdate with custom format', function () {
            var result = (0, Formula_1.compute)('{report:startdate:MM/dd/yyyy}', mockContext);
            expect(result).toBe('01/08/2025'); // Should use oldest transaction date with yyyy-MM-dd format
        });
        test('should compute created with custom format', function () {
            var result = (0, Formula_1.compute)('{report:created:MMMM dd, yyyy}', mockContext);
            expect(result).toBe('January 10, 2025'); // Should use oldest report action date with MMMM dd, yyyy format
        });
        test('should compute startdate with short month format', function () {
            var result = (0, Formula_1.compute)('{report:startdate:dd MMM yyyy}', mockContext);
            expect(result).toBe('08 Jan 2025'); // Should use oldest transaction date with dd MMM yyyy format
        });
        test('should compute policy name', function () {
            var result = (0, Formula_1.compute)('{report:policyname}', mockContext);
            expect(result).toBe('Test Policy');
        });
        test('should handle empty formula', function () {
            expect((0, Formula_1.compute)('', mockContext)).toBe('');
        });
        test('should handle unknown formula parts', function () {
            var result = (0, Formula_1.compute)('{report:unknown}', mockContext);
            expect(result).toBe('{report:unknown}');
        });
        test('should handle missing report data gracefully', function () {
            var contextWithMissingData = {
                report: {},
                policy: null,
            };
            var result = (0, Formula_1.compute)('{report:total} {report:policyname}', contextWithMissingData);
            expect(result).toBe('{report:total} {report:policyname}'); // Empty data is replaced with definition
        });
        test('should preserve free text', function () {
            var result = (0, Formula_1.compute)('Expense Report - {report:total}', mockContext);
            expect(result).toBe('Expense Report - $100.00');
        });
        test('should preserve exact spacing around formula parts', function () {
            var result = (0, Formula_1.compute)('Report with type after 4 spaces   {report:type}-and no space after computed part', mockContext);
            expect(result).toBe('Report with type after 4 spaces   Expense Report-and no space after computed part');
        });
    });
    describe('Edge Cases', function () {
        test('should handle malformed braces', function () {
            var _a;
            var parts = (0, Formula_1.parse)('{incomplete');
            expect((_a = parts.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe('freetext');
        });
        test('should handle undefined amounts', function () {
            var context = {
                report: { total: undefined },
                policy: null,
            };
            var result = (0, Formula_1.compute)('{report:total}', context);
            expect(result).toBe('{report:total}');
        });
        test('should handle missing report actions for created', function () {
            mockReportActionsUtils.getAllReportActions.mockReturnValue({});
            var context = {
                report: { reportID: '123' },
                policy: null,
            };
            var result = (0, Formula_1.compute)('{report:created}', context);
            expect(result).toBe('{report:created}');
        });
        test('should handle missing transactions for startdate', function () {
            mockReportUtils.getReportTransactions.mockReturnValue([]);
            var context = {
                report: { reportID: '123' },
                policy: null,
            };
            var today = new Date();
            var expected = "".concat(today.getFullYear(), "-").concat(String(today.getMonth() + 1).padStart(2, '0'), "-").concat(String(today.getDate()).padStart(2, '0'));
            var result = (0, Formula_1.compute)('{report:startdate}', context);
            expect(result).toBe(expected);
        });
        test('should call getReportTransactions with correct reportID for startdate', function () {
            var context = {
                report: { reportID: 'test-report-123' },
                policy: null,
            };
            (0, Formula_1.compute)('{report:startdate}', context);
            expect(mockReportUtils.getReportTransactions).toHaveBeenCalledWith('test-report-123');
        });
        test('should call getAllReportActions with correct reportID for created', function () {
            var context = {
                report: { reportID: 'test-report-456' },
                policy: null,
            };
            (0, Formula_1.compute)('{report:created}', context);
            expect(mockReportActionsUtils.getAllReportActions).toHaveBeenCalledWith('test-report-456');
        });
        test('should skip partial transactions (empty merchant)', function () {
            var mockTransactions = [
                {
                    transactionID: 'trans1',
                    created: '2025-01-15T12:00:00Z',
                    amount: 5000,
                    merchant: 'ACME Ltd.',
                },
                {
                    transactionID: 'trans2',
                    created: '2025-01-08T16:45:00Z', // Older but partial
                    amount: 3000,
                    merchant: '', // Empty merchant = partial
                },
                {
                    transactionID: 'trans3',
                    created: '2025-01-12T09:15:00Z', // Should be oldest valid
                    amount: 2000,
                    merchant: 'Gamma Inc.',
                },
            ];
            mockReportUtils.getReportTransactions.mockReturnValue(mockTransactions);
            var context = {
                report: { reportID: 'test-report-123' },
                policy: null,
            };
            var result = (0, Formula_1.compute)('{report:startdate}', context);
            expect(result).toBe('2025-01-12');
        });
        test('should skip partial transactions (zero amount)', function () {
            var mockTransactions = [
                {
                    transactionID: 'trans1',
                    created: '2025-01-15T12:00:00Z',
                    amount: 5000,
                    merchant: 'ACME Ltd.',
                },
                {
                    transactionID: 'trans2',
                    created: '2025-01-08T16:45:00Z', // Older but partial
                    amount: 0, // Zero amount = partial
                    merchant: 'Beta Corp.',
                    iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
                },
                {
                    transactionID: 'trans3',
                    created: '2025-01-12T09:15:00Z', // Should be oldest valid
                    amount: 2000,
                    merchant: 'Gamma Inc.',
                },
            ];
            mockReportUtils.getReportTransactions.mockReturnValue(mockTransactions);
            var context = {
                report: { reportID: 'test-report-123' },
                policy: null,
            };
            var result = (0, Formula_1.compute)('{report:startdate}', context);
            expect(result).toBe('2025-01-12');
        });
    });
});
