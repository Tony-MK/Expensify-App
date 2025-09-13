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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_onyx_1 = require("react-native-onyx");
var Search_1 = require("@libs/actions/Search");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
jest.mock('@src/components/ConfirmedRoute.tsx');
var mockReportItemWithHold = {
    groupedBy: 'reports',
    shouldAnimateInHighlight: false,
    accountID: 1206,
    action: 'approve',
    allActions: ['approve'],
    chatReportID: '2108006919825366',
    created: '2024-12-04 23:18:33',
    currency: 'USD',
    isOneTransactionReport: false,
    isPolicyExpenseChat: false,
    isWaitingOnBankAccount: false,
    managerID: 1206,
    nonReimbursableTotal: 0,
    ownerAccountID: 1206,
    policyID: '48D7178DE42EE9F9',
    private_isArchived: '',
    reportID: '1350959062018695',
    reportName: 'Expense Report #1350959062018695',
    stateNum: 1,
    statusNum: 1,
    total: -13500,
    type: 'expense',
    unheldTotal: -12300,
    keyForList: '1350959062018695',
    from: {
        accountID: 1206,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png',
        displayName: 'Ames',
        firstName: 'Ames',
        lastName: '',
        login: 'apb@apb.com',
        pronouns: '',
        timezone: {
            automatic: true,
            selected: 'America/Edmonton',
        },
        phoneNumber: '',
        validated: false,
    },
    to: {
        accountID: 1206,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png',
        displayName: 'Ames',
        firstName: 'Ames',
        lastName: '',
        login: 'apb@apb.com',
        pronouns: '',
        timezone: {
            automatic: true,
            selected: 'America/Edmonton',
        },
        phoneNumber: '',
        validated: false,
    },
    transactions: [
        {
            report: {
                reportID: '1350959062018695',
            },
            accountID: 1206,
            action: 'view',
            allActions: ['view'],
            amount: -1200,
            canDelete: true,
            canHold: false,
            canUnhold: true,
            category: '',
            comment: {
                comment: '',
                hold: '3042630993757922770',
            },
            created: '2024-12-04',
            currency: 'USD',
            hasEReceipt: false,
            isFromOneTransactionReport: false,
            managerID: 1206,
            merchant: 'Qatar',
            modifiedAmount: 0,
            modifiedCreated: '',
            modifiedCurrency: '',
            modifiedMerchant: '',
            parentTransactionID: '',
            policyID: '48D7178DE42EE9F9',
            reportID: '1350959062018695',
            reportType: 'expense',
            tag: '',
            transactionID: '1049531721038862176',
            transactionThreadReportID: '2957345659269055',
            transactionType: 'cash',
            from: {
                accountID: 1206,
                avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png',
                displayName: 'Ames',
                firstName: 'Ames',
                lastName: '',
                login: 'apb@apb.com',
                pronouns: '',
                timezone: {
                    automatic: true,
                    selected: 'America/Edmonton',
                },
                phoneNumber: '',
                validated: false,
            },
            to: {
                accountID: 1206,
                avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png',
                displayName: 'Ames',
                firstName: 'Ames',
                lastName: '',
                login: 'apb@apb.com',
                pronouns: '',
                timezone: {
                    automatic: true,
                    selected: 'America/Edmonton',
                },
                phoneNumber: '',
                validated: false,
            },
            formattedFrom: 'Ames',
            formattedTo: 'Ames',
            formattedTotal: 1200,
            formattedMerchant: 'Qatar',
            date: '2024-12-04',
            shouldShowMerchant: true,
            shouldShowYear: false,
            keyForList: '1049531721038862176',
            isAmountColumnWide: false,
            isTaxAmountColumnWide: false,
            shouldAnimateInHighlight: false,
            convertedAmount: 1200,
            convertedCurrency: 'USD',
        },
        {
            report: {
                reportID: '1350959062018695',
            },
            accountID: 1206,
            action: 'view',
            allActions: ['view'],
            amount: -12300,
            canDelete: true,
            canHold: true,
            canUnhold: false,
            category: '',
            comment: {
                comment: '',
            },
            created: '2024-12-04',
            currency: 'USD',
            hasEReceipt: false,
            isFromOneTransactionReport: false,
            managerID: 1206,
            merchant: 'Forbes',
            modifiedAmount: 0,
            modifiedCreated: '',
            modifiedCurrency: '',
            modifiedMerchant: '',
            parentTransactionID: '',
            policyID: '48D7178DE42EE9F9',
            reportID: '1350959062018695',
            reportType: 'expense',
            tag: '',
            transactionID: '5345995386715609966',
            transactionThreadReportID: '740282333335072',
            transactionType: 'cash',
            from: {
                accountID: 1206,
                avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png',
                displayName: 'Ames',
                login: 'apb@apb.com',
            },
            to: {
                accountID: 1206,
                avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_7.png',
                displayName: 'Ames',
            },
            formattedFrom: 'Ames',
            formattedTo: 'Ames',
            formattedTotal: 12300,
            formattedMerchant: 'Forbes',
            date: '2024-12-04',
            shouldShowMerchant: true,
            shouldShowYear: false,
            keyForList: '5345995386715609966',
            isAmountColumnWide: false,
            isTaxAmountColumnWide: false,
            shouldAnimateInHighlight: false,
            convertedAmount: 1200,
            convertedCurrency: 'USD',
        },
    ],
    isSelected: false,
};
var updatedMockReportItem = __assign(__assign({}, mockReportItemWithHold), { transactions: mockReportItemWithHold.transactions.map(function (transaction, index) {
        if (index === 0) {
            return __assign(__assign({}, transaction), { comment: {
                    comment: '',
                } });
        }
        return transaction;
    }) });
var mockSnapshotForItem = {
    // @ts-expect-error: Allow partial record in snapshot update for testing
    data: (_a = {},
        _a["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(mockReportItemWithHold === null || mockReportItemWithHold === void 0 ? void 0 : mockReportItemWithHold.policyID)] = __assign({}, (mockReportItemWithHold.policyID
            ? (_b = {},
                _b[String(mockReportItemWithHold.policyID)] = __assign({ type: 'policy', id: String(mockReportItemWithHold.policyID), role: 'admin', owner: 'apb@apb.com' }, mockReportItemWithHold),
                _b) : {})),
        _a),
};
var mockLastPaymentMethod = {
    expense: 'Elsewhere',
    lastUsed: 'Elsewhere',
};
describe('handleActionButtonPress', function () {
    var _a, _b, _c, _d;
    var searchHash = 1;
    beforeAll(function () {
        react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(searchHash), 
        // @ts-expect-error: Allow partial record in snapshot update for testing
        mockSnapshotForItem);
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, mockLastPaymentMethod);
    });
    var snapshotReport = (_b = (_a = mockSnapshotForItem === null || mockSnapshotForItem === void 0 ? void 0 : mockSnapshotForItem.data) === null || _a === void 0 ? void 0 : _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(mockReportItemWithHold.reportID)]) !== null && _b !== void 0 ? _b : {};
    var snapshotPolicy = (_d = (_c = mockSnapshotForItem === null || mockSnapshotForItem === void 0 ? void 0 : mockSnapshotForItem.data) === null || _c === void 0 ? void 0 : _c["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(mockReportItemWithHold.policyID)]) !== null && _d !== void 0 ? _d : {};
    test('Should navigate to item when report has one transaction on hold', function () {
        var goToItem = jest.fn(function () { });
        // @ts-expect-error: Allow partial record in snapshot update for testing
        (0, Search_1.handleActionButtonPress)(searchHash, mockReportItemWithHold, goToItem, false, snapshotReport, snapshotPolicy, mockLastPaymentMethod);
        expect(goToItem).toHaveBeenCalledTimes(1);
    });
    test('Should not navigate to item when the hold is removed', function () {
        var goToItem = jest.fn(function () { });
        // @ts-expect-error: Allow partial record in snapshot update for testing
        (0, Search_1.handleActionButtonPress)(searchHash, updatedMockReportItem, goToItem, false, snapshotReport, snapshotPolicy, mockLastPaymentMethod);
        expect(goToItem).toHaveBeenCalledTimes(0);
    });
    test('Should run goToItem callback when user is in mobile selection mode', function () {
        var goToItem = jest.fn(function () { });
        // @ts-expect-error: Allow partial record in snapshot update for testing
        (0, Search_1.handleActionButtonPress)(searchHash, updatedMockReportItem, goToItem, true, snapshotReport, snapshotPolicy, mockLastPaymentMethod);
        expect(goToItem).toHaveBeenCalledTimes(1);
    });
});
