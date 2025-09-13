"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var react_native_onyx_1 = require("react-native-onyx");
var useAccountTabIndicatorStatus_1 = require("@hooks/useAccountTabIndicatorStatus");
// eslint-disable-next-line no-restricted-imports
var theme_1 = require("@styles/theme");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var getMockForStatus = function (status) {
    var _a;
    return (_a = {},
        _a[ONYXKEYS_1.default.BANK_ACCOUNT_LIST] = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            12345: {
                methodID: 12345,
                errors: status === CONST_1.default.INDICATOR_STATUS.HAS_PAYMENT_METHOD_ERROR
                    ? {
                        error: 'Something went wrong',
                    }
                    : undefined,
            },
        },
        _a[ONYXKEYS_1.default.USER_WALLET] = {
            bankAccountID: 12345,
            errors: status === CONST_1.default.INDICATOR_STATUS.HAS_USER_WALLET_ERRORS
                ? {
                    error: 'Something went wrong',
                }
                : undefined,
        },
        _a[ONYXKEYS_1.default.WALLET_TERMS] = {
            errors: status === CONST_1.default.INDICATOR_STATUS.HAS_WALLET_TERMS_ERRORS
                ? {
                    error: 'Something went wrong',
                }
                : undefined,
            chatReportID: status === CONST_1.default.INDICATOR_STATUS.HAS_WALLET_TERMS_ERRORS ? undefined : '123',
        },
        _a[ONYXKEYS_1.default.LOGIN_LIST] = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'johndoe12@expensify.com': {
                partnerName: 'John Doe',
                partnerUserID: 'johndoe12@expensify.com',
                validatedDate: status !== CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_INFO ? new Date().toISOString() : undefined,
                errorFields: status === CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_ERROR
                    ? {
                        field: {
                            error: 'Something went wrong',
                        },
                    }
                    : undefined,
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'otheruser@expensify.com': {
                partnerName: 'Other User',
                partnerUserID: status === CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_INFO ? 'different@expensify.com' : 'otheruser@expensify.com',
                validatedDate: status === CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_INFO ? undefined : new Date().toISOString(),
                errorFields: undefined,
            },
        },
        _a[ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT] = {
            achData: {
                bankAccountID: 12345,
            },
            errors: status === CONST_1.default.INDICATOR_STATUS.HAS_REIMBURSEMENT_ACCOUNT_ERRORS
                ? {
                    error: 'Something went wrong',
                }
                : undefined,
        },
        _a[ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS] = {
            errorFields: status === CONST_1.default.INDICATOR_STATUS.HAS_PHONE_NUMBER_ERROR
                ? {
                    phoneNumber: 'Invalid phone number',
                }
                : undefined,
        },
        _a["".concat(ONYXKEYS_1.default.CARD_LIST)] = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            card123: {
                bank: 'OTHER_BANK',
                lastScrapeResult: status === CONST_1.default.INDICATOR_STATUS.HAS_CARD_CONNECTION_ERROR ? 403 : 200,
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            card456: {
                bank: 'ANOTHER_BANK',
                lastScrapeResult: status === CONST_1.default.INDICATOR_STATUS.HAS_CARD_CONNECTION_ERROR ? 403 : 200,
            },
        },
        _a[ONYXKEYS_1.default.SESSION] = {
            email: 'johndoe12@expensify.com',
        },
        _a);
};
var TEST_CASES = [
    {
        name: 'has user wallet errors',
        indicatorColor: theme_1.defaultTheme.danger,
        status: CONST_1.default.INDICATOR_STATUS.HAS_USER_WALLET_ERRORS,
    },
    {
        name: 'has payment method error',
        indicatorColor: theme_1.defaultTheme.danger,
        status: CONST_1.default.INDICATOR_STATUS.HAS_PAYMENT_METHOD_ERROR,
    },
    {
        name: 'has reimbursement account errors',
        indicatorColor: theme_1.defaultTheme.danger,
        status: CONST_1.default.INDICATOR_STATUS.HAS_REIMBURSEMENT_ACCOUNT_ERRORS,
    },
    {
        name: 'has login list error',
        indicatorColor: theme_1.defaultTheme.danger,
        status: CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_ERROR,
    },
    {
        name: 'has wallet terms errors',
        indicatorColor: theme_1.defaultTheme.danger,
        status: CONST_1.default.INDICATOR_STATUS.HAS_WALLET_TERMS_ERRORS,
    },
    {
        name: 'has card connection error',
        indicatorColor: theme_1.defaultTheme.danger,
        status: CONST_1.default.INDICATOR_STATUS.HAS_CARD_CONNECTION_ERROR,
    },
    {
        name: 'has phone number error',
        indicatorColor: theme_1.defaultTheme.danger,
        status: CONST_1.default.INDICATOR_STATUS.HAS_PHONE_NUMBER_ERROR,
    },
    {
        name: 'has login list info',
        indicatorColor: theme_1.defaultTheme.success,
        status: CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_INFO,
    },
];
describe('useAccountTabIndicatorStatus', function () {
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    describe.each(TEST_CASES)('$name', function (testCase) {
        beforeAll(function () {
            return react_native_onyx_1.default.multiSet(getMockForStatus(testCase.status)).then(waitForBatchedUpdates_1.default);
        });
        it('returns correct indicatorColor', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var indicatorColor = result.current.indicatorColor;
            expect(indicatorColor).toBe(testCase.indicatorColor);
        });
        it('returns correct status', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var status = result.current.status;
            expect(status).toBe(testCase.status);
        });
    });
    describe('no errors or info', function () {
        beforeAll(function () {
            var _a;
            return react_native_onyx_1.default.multiSet((_a = {},
                _a[ONYXKEYS_1.default.BANK_ACCOUNT_LIST] = {},
                _a[ONYXKEYS_1.default.USER_WALLET] = {},
                _a[ONYXKEYS_1.default.WALLET_TERMS] = {},
                _a[ONYXKEYS_1.default.LOGIN_LIST] = {},
                _a[ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT] = {},
                _a[ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS] = {},
                _a["".concat(ONYXKEYS_1.default.CARD_LIST)] = {},
                _a[ONYXKEYS_1.default.SESSION] = {
                    email: 'johndoe12@expensify.com',
                },
                _a)).then(waitForBatchedUpdates_1.default);
        });
        it('returns undefined status when no errors or info exist', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var status = result.current.status;
            expect(status).toBeUndefined();
        });
        it('returns success color when no errors or info exist', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var indicatorColor = result.current.indicatorColor;
            expect(indicatorColor).toBe(theme_1.defaultTheme.success);
        });
    });
    describe('wallet terms with chatReportID', function () {
        beforeAll(function () {
            var _a;
            return react_native_onyx_1.default.multiSet((_a = {},
                _a[ONYXKEYS_1.default.BANK_ACCOUNT_LIST] = {},
                _a[ONYXKEYS_1.default.USER_WALLET] = {},
                _a[ONYXKEYS_1.default.WALLET_TERMS] = {
                    errors: {
                        error: 'Something went wrong',
                    },
                    chatReportID: '123',
                },
                _a[ONYXKEYS_1.default.LOGIN_LIST] = {},
                _a[ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT] = {},
                _a[ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS] = {},
                _a["".concat(ONYXKEYS_1.default.CARD_LIST)] = {},
                _a[ONYXKEYS_1.default.SESSION] = {
                    email: 'johndoe12@expensify.com',
                },
                _a)).then(waitForBatchedUpdates_1.default);
        });
        it('does not show wallet terms error when chatReportID exists', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var status = result.current.status;
            expect(status).toBeUndefined();
        });
    });
    describe('multiple errors', function () {
        beforeAll(function () {
            var _a;
            return react_native_onyx_1.default.multiSet((_a = {},
                _a[ONYXKEYS_1.default.BANK_ACCOUNT_LIST] = {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    12345: {
                        methodID: 12345,
                        errors: {
                            error: 'Payment method error',
                        },
                    },
                },
                _a[ONYXKEYS_1.default.USER_WALLET] = {
                    bankAccountID: 12345,
                    errors: {
                        error: 'Wallet error',
                    },
                },
                _a[ONYXKEYS_1.default.WALLET_TERMS] = {},
                _a[ONYXKEYS_1.default.LOGIN_LIST] = {},
                _a[ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT] = {},
                _a[ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS] = {},
                _a["".concat(ONYXKEYS_1.default.CARD_LIST)] = {},
                _a[ONYXKEYS_1.default.SESSION] = {
                    email: 'johndoe12@expensify.com',
                },
                _a)).then(waitForBatchedUpdates_1.default);
        });
        it('returns the first error status found', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var status = result.current.status;
            // Should return the first error in the errorChecking object
            expect(status).toBe(CONST_1.default.INDICATOR_STATUS.HAS_USER_WALLET_ERRORS);
        });
        it('returns danger color for multiple errors', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var indicatorColor = result.current.indicatorColor;
            expect(indicatorColor).toBe(theme_1.defaultTheme.danger);
        });
    });
    describe('error takes priority over info', function () {
        beforeAll(function () {
            var _a;
            return react_native_onyx_1.default.multiSet((_a = {},
                _a[ONYXKEYS_1.default.BANK_ACCOUNT_LIST] = {},
                _a[ONYXKEYS_1.default.USER_WALLET] = {
                    bankAccountID: 12345,
                    errors: {
                        error: 'Wallet error',
                    },
                },
                _a[ONYXKEYS_1.default.WALLET_TERMS] = {},
                _a[ONYXKEYS_1.default.LOGIN_LIST] = {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'johndoe12@expensify.com': {
                        partnerName: 'John Doe',
                        partnerUserID: 'johndoe12@expensify.com',
                        validatedDate: undefined, // This would trigger info status
                    },
                },
                _a[ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT] = {},
                _a[ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS] = {},
                _a["".concat(ONYXKEYS_1.default.CARD_LIST)] = {},
                _a[ONYXKEYS_1.default.SESSION] = {
                    email: 'johndoe12@expensify.com',
                },
                _a)).then(waitForBatchedUpdates_1.default);
        });
        it('returns error status when both error and info exist', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var status = result.current.status;
            expect(status).toBe(CONST_1.default.INDICATOR_STATUS.HAS_USER_WALLET_ERRORS);
        });
        it('returns danger color when error takes priority', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var indicatorColor = result.current.indicatorColor;
            expect(indicatorColor).toBe(theme_1.defaultTheme.danger);
        });
    });
    describe('missing data', function () {
        beforeAll(function () {
            var _a;
            return react_native_onyx_1.default.multiSet((_a = {},
                _a[ONYXKEYS_1.default.BANK_ACCOUNT_LIST] = null,
                _a[ONYXKEYS_1.default.USER_WALLET] = null,
                _a[ONYXKEYS_1.default.WALLET_TERMS] = null,
                _a[ONYXKEYS_1.default.LOGIN_LIST] = null,
                _a[ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT] = null,
                _a[ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS] = null,
                _a["".concat(ONYXKEYS_1.default.CARD_LIST)] = null,
                _a[ONYXKEYS_1.default.SESSION] = null,
                _a)).then(waitForBatchedUpdates_1.default);
        });
        it('handles missing data gracefully', function () {
            var result = (0, react_native_1.renderHook)(function () { return (0, useAccountTabIndicatorStatus_1.default)(); }).result;
            var _a = result.current, status = _a.status, indicatorColor = _a.indicatorColor;
            expect(status).toBeUndefined();
            expect(indicatorColor).toBe(theme_1.defaultTheme.success);
        });
    });
});
