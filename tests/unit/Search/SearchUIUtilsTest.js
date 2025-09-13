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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_onyx_1 = require("react-native-onyx");
var ChatListItem_1 = require("@components/SelectionList/ChatListItem");
var TransactionGroupListItem_1 = require("@components/SelectionList/Search/TransactionGroupListItem");
var TransactionListItem_1 = require("@components/SelectionList/Search/TransactionListItem");
var Navigation_1 = require("@navigation/Navigation");
var Report_1 = require("@userActions/Report");
var Search_1 = require("@userActions/Search");
var Expensicons = require("@src/components/Icon/Expensicons");
var CONST_1 = require("@src/CONST");
var IntlStore_1 = require("@src/languages/IntlStore");
var SearchUIUtils = require("@src/libs/SearchUIUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var TestHelper_1 = require("../../utils/TestHelper");
var waitForBatchedUpdates_1 = require("../../utils/waitForBatchedUpdates");
jest.mock('@src/components/ConfirmedRoute.tsx');
jest.mock('@src/libs/Navigation/Navigation', function () { return ({
    navigate: jest.fn(),
}); });
jest.mock('@userActions/Report', function () { return (__assign(__assign({}, jest.requireActual('@userActions/Report')), { createTransactionThreadReport: jest.fn(), openReport: jest.fn() })); });
jest.mock('@userActions/Search', function () { return (__assign(__assign({}, jest.requireActual('@userActions/Search')), { updateSearchResultsWithTransactionThreadReportID: jest.fn() })); });
var adminAccountID = 18439984;
var adminEmail = 'admin@policy.com';
var approverAccountID = 1111111;
var approverEmail = 'approver@policy.com';
var overlimitApproverAccountID = 222222;
var overlimitApproverEmail = 'overlimit@policy.com';
var submitterAccountID = 333333;
var submitterEmail = 'submitter@policy.com';
var policyID = 'A1B2C3';
var reportID = '123456789';
var reportID2 = '11111';
var reportID3 = '99999';
var reportID4 = '6155022250251839';
var reportID5 = '22222';
var transactionID = '1';
var transactionID2 = '2';
var transactionID3 = '3';
var transactionID4 = '4';
var cardID = 20202020;
var cardID2 = 30303030;
var entryID = 5;
var entryID2 = 6;
var accountNumber = 'XXXXXXXX6789';
var accountNumber2 = 'XXXXXXXX5544';
var report1 = {
    accountID: adminAccountID,
    action: 'view',
    chatReportID: '1706144653204915',
    created: '2024-12-21 13:05:20',
    currency: 'USD',
    isOneTransactionReport: true,
    isPolicyExpenseChat: false,
    isWaitingOnBankAccount: false,
    managerID: adminAccountID,
    nonReimbursableTotal: 0,
    ownerAccountID: adminAccountID,
    policyID: policyID,
    reportID: reportID,
    reportName: 'Expense Report #123',
    stateNum: 0,
    statusNum: 0,
    total: -5000,
    type: 'expense',
    unheldTotal: -5000,
};
var report2 = {
    accountID: adminAccountID,
    action: 'view',
    chatReportID: '1706144653204915',
    created: '2024-12-21 13:05:20',
    currency: 'USD',
    isOneTransactionReport: true,
    isPolicyExpenseChat: false,
    isWaitingOnBankAccount: false,
    managerID: adminAccountID,
    nonReimbursableTotal: 0,
    ownerAccountID: adminAccountID,
    policyID: policyID,
    reportID: reportID2,
    reportName: 'Expense Report #123',
    stateNum: 1,
    statusNum: 1,
    total: -5000,
    type: 'expense',
    unheldTotal: -5000,
};
var report3 = {
    accountID: adminAccountID,
    chatReportID: '6155022250251839',
    chatType: undefined,
    created: '2025-03-05 16:34:27',
    currency: 'VND',
    isOneTransactionReport: false,
    isOwnPolicyExpenseChat: false,
    isPolicyExpenseChat: false,
    isWaitingOnBankAccount: false,
    managerID: approverAccountID,
    nonReimbursableTotal: 0,
    oldPolicyName: '',
    ownerAccountID: adminAccountID,
    policyID: policyID,
    private_isArchived: '',
    reportID: reportID3,
    reportName: 'Report Name',
    stateNum: 1,
    statusNum: 1,
    total: 4400,
    type: 'iou',
    unheldTotal: 4400,
};
var report4 = {
    accountID: adminAccountID,
    reportID: reportID4,
    chatReportID: '',
    chatType: 'policyExpenseChat',
    created: '2025-03-05 16:34:27',
    type: 'chat',
};
var report5 = {
    accountID: adminAccountID,
    action: 'view',
    chatReportID: '1706144653204915',
    created: '2024-12-21 13:05:20',
    currency: 'USD',
    isOneTransactionReport: true,
    isPolicyExpenseChat: false,
    isWaitingOnBankAccount: false,
    managerID: adminAccountID,
    nonReimbursableTotal: 0,
    ownerAccountID: adminAccountID,
    policyID: policyID,
    reportID: reportID5,
    reportName: 'Expense Report #123',
    stateNum: 0,
    statusNum: 0,
    total: 0,
    type: 'expense',
    unheldTotal: 0,
};
var allViolations = (_a = {},
    _a["transactionViolations_".concat(transactionID2)] = [
        {
            name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
        },
    ],
    _a);
// Given search data results consisting of involved users' personal details, policyID, reportID and transactionID
var searchResults = {
    data: __assign(__assign((_b = { personalDetailsList: (_c = {},
                _c[adminAccountID] = {
                    accountID: adminAccountID,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Admin',
                    login: adminEmail,
                },
                _c[approverAccountID] = {
                    accountID: approverAccountID,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Approver',
                    login: approverEmail,
                },
                _c[overlimitApproverAccountID] = {
                    accountID: overlimitApproverAccountID,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Overlimit Approver',
                    login: overlimitApproverEmail,
                },
                _c[submitterAccountID] = {
                    accountID: submitterAccountID,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Submitter',
                    login: submitterEmail,
                },
                _c) }, _b["policy_".concat(policyID)] = {
        id: 'Admin',
        approvalMode: 'ADVANCED',
        autoReimbursement: {
            limit: 0,
        },
        autoReimbursementLimit: 0,
        autoReporting: true,
        autoReportingFrequency: 'immediate',
        harvesting: {
            enabled: false,
        },
        preventSelfApproval: false,
        owner: adminEmail,
        reimbursementChoice: 'reimburseManual',
        role: 'admin',
        type: 'team',
        employeeList: (_d = {},
            _d[adminEmail] = {
                email: adminEmail,
                role: CONST_1.default.POLICY.ROLE.ADMIN,
                forwardsTo: '',
                submitsTo: approverEmail,
            },
            _d[approverEmail] = {
                email: approverEmail,
                role: CONST_1.default.POLICY.ROLE.USER,
                approvalLimit: 100,
                submitsTo: adminEmail,
                overLimitForwardsTo: overlimitApproverEmail,
            },
            _d[overlimitApproverEmail] = {
                email: overlimitApproverEmail,
                role: CONST_1.default.POLICY.ROLE.ADMIN,
                submitsTo: approverEmail,
            },
            _d[submitterEmail] = {
                email: submitterEmail,
                role: CONST_1.default.POLICY.ROLE.USER,
                submitsTo: adminEmail,
            },
            _d),
    }, _b["reportActions_".concat(reportID)] = {
        test: {
            accountID: adminAccountID,
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            created: '2024-12-21 13:05:20',
            message: [
                {
                    type: 'text',
                    text: 'Payment has been processed.',
                    html: '<p>Payment has been processed.</p>',
                    whisperedTo: [],
                },
                {
                    type: 'comment',
                    text: 'Please review this expense.',
                    html: '<p>Please review this expense.</p>',
                },
            ],
            reportActionID: 'Admin',
            reportID: reportID,
            reportName: 'Admin',
        },
        test1: {
            accountID: adminAccountID,
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            created: '2024-12-21 13:05:20',
            message: [
                {
                    type: 'text',
                    text: 'Payment has been processed.',
                    html: '<p>Payment has been processed.</p>',
                    whisperedTo: [12345678, 87654321],
                },
                {
                    type: 'comment',
                    text: 'Please review this expense.',
                    html: '<p>Please review this expense.</p>',
                },
            ],
            reportActionID: 'Admin1',
            reportID: reportID,
            reportName: 'Admin1',
        },
    }, _b["report_".concat(reportID)] = report1, _b["report_".concat(reportID2)] = report2, _b["report_".concat(reportID3)] = report3, _b["report_".concat(reportID4)] = report4, _b["report_".concat(reportID5)] = report5, _b["transactions_".concat(transactionID)] = {
        accountID: adminAccountID,
        action: 'view',
        allActions: ['view'],
        amount: -5000,
        canDelete: true,
        canHold: true,
        canUnhold: false,
        cardID: undefined,
        cardName: undefined,
        category: '',
        comment: {
            comment: '',
        },
        created: '2024-12-21',
        currency: 'USD',
        hasEReceipt: false,
        isFromOneTransactionReport: true,
        managerID: adminAccountID,
        description: '',
        hasViolation: false,
        merchant: 'Expense',
        modifiedAmount: 0,
        modifiedCreated: '',
        modifiedCurrency: '',
        modifiedMerchant: 'Expense',
        parentTransactionID: '',
        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
        policyID: policyID,
        reportID: reportID,
        reportType: 'expense',
        tag: '',
        transactionID: transactionID,
        transactionThreadReportID: '456',
        transactionType: 'cash',
        receipt: undefined,
        taxAmount: undefined,
        mccGroup: undefined,
        modifiedMCCGroup: undefined,
        moneyRequestReportActionID: undefined,
        errors: undefined,
        filename: undefined,
        isActionLoading: false,
        convertedAmount: -5000,
        convertedCurrency: 'USD',
    }, _b["transactions_".concat(transactionID2)] = {
        accountID: adminAccountID,
        action: 'view',
        allActions: ['view'],
        amount: -5000,
        canDelete: true,
        canHold: true,
        canUnhold: false,
        cardID: undefined,
        cardName: undefined,
        category: '',
        comment: {
            comment: '',
        },
        created: '2024-12-21',
        currency: 'USD',
        hasEReceipt: false,
        isFromOneTransactionReport: true,
        managerID: adminAccountID,
        description: '',
        hasViolation: true,
        merchant: 'Expense',
        modifiedAmount: 0,
        modifiedCreated: '',
        modifiedCurrency: '',
        modifiedMerchant: 'Expense',
        parentTransactionID: '',
        policyID: policyID,
        reportID: reportID2,
        reportType: 'expense',
        tag: '',
        transactionID: transactionID2,
        transactionThreadReportID: '456',
        transactionType: 'cash',
        receipt: undefined,
        taxAmount: undefined,
        mccGroup: undefined,
        modifiedMCCGroup: undefined,
        moneyRequestReportActionID: undefined,
        pendingAction: undefined,
        errors: undefined,
        filename: undefined,
        isActionLoading: false,
        convertedAmount: -5000,
        convertedCurrency: 'USD',
    }, _b), allViolations), (_e = {}, _e["transactions_".concat(transactionID3)] = {
        accountID: adminAccountID,
        amount: 1200,
        action: 'view',
        allActions: ['view'],
        canDelete: true,
        canHold: true,
        canUnhold: false,
        cardID: undefined,
        cardName: undefined,
        category: '',
        comment: {
            comment: '',
        },
        created: '2025-03-05',
        currency: 'VND',
        hasEReceipt: false,
        isFromOneTransactionReport: false,
        managerID: approverAccountID,
        merchant: '(none)',
        modifiedAmount: 0,
        modifiedCreated: '',
        modifiedCurrency: '',
        modifiedMerchant: '',
        parentTransactionID: '',
        policyID: policyID,
        reportID: reportID3,
        reportType: 'iou',
        tag: '',
        transactionID: transactionID3,
        transactionThreadReportID: '8287398995021380',
        transactionType: 'cash',
        receipt: undefined,
        taxAmount: undefined,
        description: '',
        mccGroup: undefined,
        modifiedMCCGroup: undefined,
        moneyRequestReportActionID: undefined,
        pendingAction: undefined,
        errors: undefined,
        filename: undefined,
        isActionLoading: false,
        hasViolation: undefined,
        convertedAmount: -5000,
        convertedCurrency: 'USD',
    }, _e["transactions_".concat(transactionID4)] = {
        accountID: adminAccountID,
        amount: 3200,
        action: 'view',
        allActions: ['view'],
        canDelete: true,
        canHold: true,
        canUnhold: false,
        cardID: undefined,
        cardName: undefined,
        category: '',
        comment: {
            comment: '',
        },
        created: '2025-03-05',
        currency: 'VND',
        hasEReceipt: false,
        isFromOneTransactionReport: false,
        managerID: approverAccountID,
        merchant: '(none)',
        modifiedAmount: 0,
        modifiedCreated: '',
        modifiedCurrency: '',
        modifiedMerchant: '',
        parentTransactionID: '',
        policyID: policyID,
        reportID: reportID3,
        reportType: 'iou',
        tag: '',
        transactionID: transactionID3,
        transactionThreadReportID: '1014872441234902',
        transactionType: 'cash',
        description: '',
        receipt: undefined,
        taxAmount: undefined,
        mccGroup: undefined,
        modifiedMCCGroup: undefined,
        moneyRequestReportActionID: undefined,
        pendingAction: undefined,
        errors: undefined,
        filename: undefined,
        isActionLoading: false,
        hasViolation: undefined,
        convertedAmount: -5000,
        convertedCurrency: 'USD',
    }, _e)),
    search: {
        hasMoreResults: false,
        hasResults: true,
        offset: 0,
        status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL,
        isLoading: false,
        type: 'expense',
    },
};
var searchResultsGroupByFrom = {
    data: (_f = {
            personalDetailsList: (_g = {},
                _g[adminAccountID] = {
                    accountID: adminAccountID,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Zara',
                    login: adminEmail,
                },
                _g[approverAccountID] = {
                    accountID: approverAccountID,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Andrew',
                    login: approverEmail,
                },
                _g)
        },
        _f["".concat(CONST_1.default.SEARCH.GROUP_PREFIX).concat(adminAccountID)] = {
            accountID: adminAccountID,
            count: 3,
            currency: 'USD',
            total: 70,
        },
        _f["".concat(CONST_1.default.SEARCH.GROUP_PREFIX).concat(approverAccountID)] = {
            accountID: approverAccountID,
            count: 2,
            currency: 'USD',
            total: 30,
        },
        _f),
    search: {
        count: 5,
        currency: 'USD',
        hasMoreResults: false,
        hasResults: true,
        offset: 0,
        status: [CONST_1.default.SEARCH.STATUS.EXPENSE.DRAFTS, CONST_1.default.SEARCH.STATUS.EXPENSE.OUTSTANDING],
        total: 100,
        isLoading: false,
        type: 'expense',
    },
};
var searchResultsGroupByCard = {
    data: (_h = {
            personalDetailsList: (_j = {},
                _j[adminAccountID] = {
                    accountID: adminAccountID,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Zara',
                    login: adminEmail,
                },
                _j[approverAccountID] = {
                    accountID: approverAccountID,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Andrew',
                    login: approverEmail,
                },
                _j)
        },
        _h["".concat(CONST_1.default.SEARCH.GROUP_PREFIX).concat(cardID)] = {
            accountID: adminAccountID,
            bank: CONST_1.default.BANK_NAMES.CHASE,
            cardID: cardID,
            cardName: "Zara's card",
            count: 4,
            currency: 'USD',
            lastFourPAN: '1234',
            total: 40,
        },
        _h["".concat(CONST_1.default.SEARCH.GROUP_PREFIX).concat(cardID2)] = {
            accountID: approverAccountID,
            bank: CONST_1.default.BANK_NAMES.AMERICAN_EXPRESS,
            cardID: cardID2,
            cardName: "Andrew's card",
            count: 6,
            currency: 'USD',
            lastFourPAN: '1234',
            total: 20,
        },
        _h),
    search: {
        count: 10,
        currency: 'USD',
        hasMoreResults: false,
        hasResults: true,
        offset: 0,
        status: [CONST_1.default.SEARCH.STATUS.EXPENSE.DRAFTS, CONST_1.default.SEARCH.STATUS.EXPENSE.OUTSTANDING],
        total: 60,
        isLoading: false,
        type: 'expense',
    },
};
var searchResultsGroupByWithdrawalID = {
    data: (_k = {
            personalDetailsList: {}
        },
        _k["".concat(CONST_1.default.SEARCH.GROUP_PREFIX).concat(entryID)] = {
            entryID: entryID,
            accountNumber: accountNumber,
            bankName: CONST_1.default.BANK_NAMES.CHASE,
            debitPosted: '2025-08-12 17:11:22',
            count: 4,
            currency: 'USD',
            total: 40,
        },
        _k["".concat(CONST_1.default.SEARCH.GROUP_PREFIX).concat(cardID2)] = {
            entryID: entryID2,
            accountNumber: accountNumber2,
            bankName: CONST_1.default.BANK_NAMES.CITIBANK,
            debitPosted: '2025-08-19 18:10:54',
            count: 6,
            currency: 'USD',
            total: 20,
        },
        _k),
    search: {
        count: 10,
        currency: 'USD',
        hasMoreResults: false,
        hasResults: true,
        offset: 0,
        status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL,
        total: 60,
        isLoading: false,
        type: 'expense',
    },
};
var reportActionListItems = [
    {
        accountID: 18439984,
        actionName: 'ADDCOMMENT',
        created: '2024-12-21 13:05:20',
        date: '2024-12-21 13:05:20',
        formattedFrom: 'Admin',
        from: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: adminEmail,
        },
        keyForList: 'Admin',
        message: [
            {
                type: 'text',
                text: 'Payment has been processed.',
                html: '<p>Payment has been processed.</p>',
                whisperedTo: [],
            },
            {
                type: 'comment',
                text: 'Please review this expense.',
                html: '<p>Please review this expense.</p>',
            },
        ],
        reportActionID: 'Admin',
        reportID: '123456789',
        reportName: 'Expense Report #123',
    },
];
var transactionsListItems = [
    {
        accountID: 18439984,
        action: 'submit',
        allActions: ['submit'],
        amount: -5000,
        report: report1,
        canDelete: true,
        canHold: true,
        canUnhold: false,
        cardID: undefined,
        cardName: undefined,
        category: '',
        comment: { comment: '' },
        created: '2024-12-21',
        currency: 'USD',
        date: '2024-12-21',
        formattedFrom: 'Admin',
        formattedMerchant: 'Expense',
        formattedTo: '',
        formattedTotal: 5000,
        from: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: adminEmail,
        },
        hasEReceipt: false,
        isFromOneTransactionReport: true,
        keyForList: '1',
        managerID: 18439984,
        merchant: 'Expense',
        modifiedAmount: 0,
        modifiedCreated: '',
        modifiedCurrency: '',
        modifiedMerchant: 'Expense',
        parentTransactionID: '',
        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
        policyID: 'A1B2C3',
        reportID: '123456789',
        reportType: 'expense',
        shouldShowMerchant: true,
        shouldShowYear: true,
        isAmountColumnWide: false,
        isTaxAmountColumnWide: false,
        tag: '',
        to: {
            accountID: 0,
            avatar: '',
            displayName: undefined,
            login: undefined,
        },
        transactionID: '1',
        transactionThreadReportID: '456',
        transactionType: 'cash',
        receipt: undefined,
        taxAmount: undefined,
        description: '',
        mccGroup: undefined,
        modifiedMCCGroup: undefined,
        moneyRequestReportActionID: undefined,
        errors: undefined,
        filename: undefined,
        isActionLoading: false,
        hasViolation: false,
        violations: [],
        convertedAmount: -5000,
        convertedCurrency: 'USD',
    },
    {
        accountID: 18439984,
        action: 'review',
        allActions: ['review', 'approve'],
        amount: -5000,
        report: report2,
        canDelete: true,
        canHold: true,
        canUnhold: false,
        cardID: undefined,
        cardName: undefined,
        category: '',
        comment: { comment: '' },
        created: '2024-12-21',
        currency: 'USD',
        date: '2024-12-21',
        formattedFrom: 'Admin',
        formattedMerchant: 'Expense',
        formattedTo: 'Admin',
        formattedTotal: 5000,
        from: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: adminEmail,
        },
        hasEReceipt: false,
        isFromOneTransactionReport: true,
        keyForList: '2',
        managerID: 18439984,
        merchant: 'Expense',
        modifiedAmount: 0,
        modifiedCreated: '',
        modifiedCurrency: '',
        modifiedMerchant: 'Expense',
        parentTransactionID: '',
        policyID: 'A1B2C3',
        reportID: '11111',
        reportType: 'expense',
        shouldShowMerchant: true,
        shouldShowYear: true,
        isAmountColumnWide: false,
        isTaxAmountColumnWide: false,
        tag: '',
        to: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: adminEmail,
        },
        transactionID: '2',
        transactionThreadReportID: '456',
        transactionType: 'cash',
        receipt: undefined,
        taxAmount: undefined,
        description: '',
        mccGroup: undefined,
        modifiedMCCGroup: undefined,
        moneyRequestReportActionID: undefined,
        pendingAction: undefined,
        errors: undefined,
        filename: undefined,
        isActionLoading: false,
        hasViolation: true,
        violations: [
            {
                name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
        ],
        convertedAmount: -5000,
        convertedCurrency: 'USD',
    },
    {
        accountID: 18439984,
        amount: 1200,
        action: 'view',
        allActions: ['view'],
        report: report3,
        canDelete: true,
        canHold: true,
        canUnhold: false,
        cardID: undefined,
        cardName: undefined,
        category: '',
        comment: { comment: '' },
        created: '2025-03-05',
        currency: 'VND',
        hasEReceipt: false,
        isFromOneTransactionReport: false,
        managerID: 1111111,
        merchant: '(none)',
        modifiedAmount: 0,
        modifiedCreated: '',
        modifiedCurrency: '',
        modifiedMerchant: '',
        parentTransactionID: '',
        policyID: 'A1B2C3',
        reportID: '99999',
        reportType: 'iou',
        tag: '',
        transactionID: '3',
        transactionThreadReportID: '8287398995021380',
        transactionType: 'cash',
        from: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: 'admin@policy.com',
        },
        to: {
            accountID: 1111111,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Approver',
            login: 'approver@policy.com',
        },
        formattedFrom: 'Admin',
        formattedTo: 'Approver',
        formattedTotal: 1200,
        formattedMerchant: '',
        date: '2025-03-05',
        shouldShowMerchant: true,
        shouldShowYear: true,
        keyForList: '3',
        isAmountColumnWide: false,
        isTaxAmountColumnWide: false,
        receipt: undefined,
        taxAmount: undefined,
        description: '',
        mccGroup: undefined,
        modifiedMCCGroup: undefined,
        moneyRequestReportActionID: undefined,
        pendingAction: undefined,
        errors: undefined,
        filename: undefined,
        isActionLoading: false,
        hasViolation: undefined,
        violations: [],
        convertedAmount: -5000,
        convertedCurrency: 'USD',
    },
    {
        accountID: 18439984,
        amount: 3200,
        action: 'view',
        allActions: ['view'],
        report: report3,
        canDelete: true,
        canHold: true,
        canUnhold: false,
        cardID: undefined,
        cardName: undefined,
        category: '',
        comment: { comment: '' },
        created: '2025-03-05',
        currency: 'VND',
        hasEReceipt: false,
        isFromOneTransactionReport: false,
        managerID: 1111111,
        merchant: '(none)',
        modifiedAmount: 0,
        modifiedCreated: '',
        modifiedCurrency: '',
        modifiedMerchant: '',
        parentTransactionID: '',
        policyID: 'A1B2C3',
        reportID: '99999',
        reportType: 'iou',
        tag: '',
        transactionID: '3',
        transactionThreadReportID: '1014872441234902',
        transactionType: 'cash',
        from: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: 'admin@policy.com',
        },
        to: {
            accountID: 1111111,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Approver',
            login: 'approver@policy.com',
        },
        formattedFrom: 'Admin',
        formattedTo: 'Approver',
        formattedTotal: 3200,
        formattedMerchant: '',
        date: '2025-03-05',
        shouldShowMerchant: true,
        shouldShowYear: true,
        keyForList: '3',
        isAmountColumnWide: false,
        isTaxAmountColumnWide: false,
        receipt: undefined,
        taxAmount: undefined,
        description: '',
        mccGroup: undefined,
        modifiedMCCGroup: undefined,
        moneyRequestReportActionID: undefined,
        pendingAction: undefined,
        errors: undefined,
        filename: undefined,
        isActionLoading: false,
        hasViolation: undefined,
        violations: [],
        convertedAmount: -5000,
        convertedCurrency: 'USD',
    },
];
var transactionReportGroupListItems = [
    {
        groupedBy: 'reports',
        accountID: 18439984,
        action: 'submit',
        allActions: ['submit'],
        chatReportID: '1706144653204915',
        created: '2024-12-21 13:05:20',
        currency: 'USD',
        from: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: adminEmail,
        },
        isOneTransactionReport: true,
        isPolicyExpenseChat: false,
        isWaitingOnBankAccount: false,
        keyForList: '123456789',
        managerID: 18439984,
        nonReimbursableTotal: 0,
        ownerAccountID: 18439984,
        policyID: 'A1B2C3',
        reportID: '123456789',
        reportName: 'Expense Report #123',
        stateNum: 0,
        statusNum: 0,
        to: {
            accountID: 0,
            avatar: '',
            displayName: undefined,
            login: undefined,
        },
        total: -5000,
        transactions: [
            {
                accountID: 18439984,
                action: 'submit',
                allActions: ['submit'],
                report: report1,
                amount: -5000,
                canDelete: true,
                canHold: true,
                canUnhold: false,
                cardID: undefined,
                cardName: undefined,
                category: '',
                comment: { comment: '' },
                created: '2024-12-21',
                currency: 'USD',
                date: '2024-12-21',
                description: '',
                formattedFrom: 'Admin',
                formattedMerchant: 'Expense',
                formattedTo: '',
                formattedTotal: 5000,
                from: {
                    accountID: 18439984,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Admin',
                    login: adminEmail,
                },
                hasEReceipt: false,
                hasViolation: false,
                isFromOneTransactionReport: true,
                keyForList: '1',
                managerID: 18439984,
                merchant: 'Expense',
                modifiedAmount: 0,
                modifiedCreated: '',
                modifiedCurrency: '',
                modifiedMerchant: 'Expense',
                parentTransactionID: '',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                policyID: 'A1B2C3',
                reportID: '123456789',
                reportType: 'expense',
                shouldShowMerchant: true,
                shouldShowYear: true,
                isAmountColumnWide: false,
                isTaxAmountColumnWide: false,
                tag: '',
                to: {
                    accountID: 0,
                    avatar: '',
                    displayName: undefined,
                    login: undefined,
                },
                transactionID: '1',
                transactionThreadReportID: '456',
                transactionType: 'cash',
                receipt: undefined,
                taxAmount: undefined,
                mccGroup: undefined,
                modifiedMCCGroup: undefined,
                moneyRequestReportActionID: undefined,
                errors: undefined,
                filename: undefined,
                isActionLoading: false,
                violations: [],
                convertedAmount: -5000,
                convertedCurrency: 'USD',
            },
        ],
        type: 'expense',
        unheldTotal: -5000,
    },
    {
        groupedBy: 'reports',
        accountID: 18439984,
        action: 'review',
        allActions: ['review', 'approve'],
        chatReportID: '1706144653204915',
        created: '2024-12-21 13:05:20',
        currency: 'USD',
        from: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: adminEmail,
        },
        isOneTransactionReport: true,
        isPolicyExpenseChat: false,
        isWaitingOnBankAccount: false,
        keyForList: '11111',
        managerID: 18439984,
        nonReimbursableTotal: 0,
        ownerAccountID: 18439984,
        policyID: 'A1B2C3',
        reportID: '11111',
        reportName: 'Expense Report #123',
        stateNum: 1,
        statusNum: 1,
        to: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: adminEmail,
        },
        total: -5000,
        transactions: [
            {
                accountID: 18439984,
                action: 'review',
                allActions: ['review', 'approve'],
                report: report2,
                amount: -5000,
                canDelete: true,
                canHold: true,
                canUnhold: false,
                cardID: undefined,
                cardName: undefined,
                category: '',
                comment: { comment: '' },
                created: '2024-12-21',
                currency: 'USD',
                date: '2024-12-21',
                description: '',
                formattedFrom: 'Admin',
                formattedMerchant: 'Expense',
                formattedTo: 'Admin',
                formattedTotal: 5000,
                from: {
                    accountID: 18439984,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Admin',
                    login: adminEmail,
                },
                hasEReceipt: false,
                hasViolation: true,
                violations: [
                    {
                        name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                        type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                    },
                ],
                isFromOneTransactionReport: true,
                keyForList: '2',
                managerID: 18439984,
                merchant: 'Expense',
                modifiedAmount: 0,
                modifiedCreated: '',
                modifiedCurrency: '',
                modifiedMerchant: 'Expense',
                parentTransactionID: '',
                policyID: 'A1B2C3',
                reportID: '11111',
                reportType: 'expense',
                shouldShowMerchant: true,
                shouldShowYear: true,
                isAmountColumnWide: false,
                isTaxAmountColumnWide: false,
                tag: '',
                to: {
                    accountID: 18439984,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                    displayName: 'Admin',
                    login: adminEmail,
                },
                transactionID: '2',
                transactionThreadReportID: '456',
                transactionType: 'cash',
                receipt: undefined,
                taxAmount: undefined,
                mccGroup: undefined,
                modifiedMCCGroup: undefined,
                moneyRequestReportActionID: undefined,
                pendingAction: undefined,
                errors: undefined,
                filename: undefined,
                isActionLoading: false,
                convertedAmount: -5000,
                convertedCurrency: 'USD',
            },
        ],
        type: 'expense',
        unheldTotal: -5000,
    },
    {
        groupedBy: 'reports',
        accountID: 18439984,
        chatReportID: '6155022250251839',
        chatType: undefined,
        created: '2025-03-05 16:34:27',
        currency: 'VND',
        isOneTransactionReport: false,
        isOwnPolicyExpenseChat: false,
        isPolicyExpenseChat: false,
        isWaitingOnBankAccount: false,
        managerID: 1111111,
        nonReimbursableTotal: 0,
        oldPolicyName: '',
        ownerAccountID: 18439984,
        policyID: 'A1B2C3',
        private_isArchived: '',
        reportID: '99999',
        reportName: 'Approver owes ₫44.00',
        stateNum: 1,
        statusNum: 1,
        total: 4400,
        type: 'iou',
        unheldTotal: 4400,
        action: 'pay',
        allActions: ['pay'],
        keyForList: '99999',
        from: {
            accountID: 18439984,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Admin',
            login: 'admin@policy.com',
        },
        to: {
            accountID: 1111111,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            displayName: 'Approver',
            login: 'approver@policy.com',
        },
        transactions: [transactionsListItems.at(2), transactionsListItems.at(3)],
    },
    {
        groupedBy: 'reports',
        accountID: 18439984,
        action: 'view',
        allActions: ['view'],
        chatReportID: '1706144653204915',
        created: '2024-12-21 13:05:20',
        currency: 'USD',
        from: {
            accountID: CONST_1.default.REPORT.OWNER_ACCOUNT_ID_FAKE,
            avatar: '',
            displayName: undefined,
            login: undefined,
        },
        isOneTransactionReport: true,
        isPolicyExpenseChat: false,
        isWaitingOnBankAccount: false,
        keyForList: reportID5,
        managerID: 18439984,
        nonReimbursableTotal: 0,
        ownerAccountID: 18439984,
        policyID: 'A1B2C3',
        reportID: reportID5,
        reportName: 'Expense Report #123',
        stateNum: 0,
        statusNum: 0,
        to: {
            accountID: 0,
            avatar: '',
            displayName: undefined,
            login: undefined,
        },
        total: 0,
        transactions: [],
        type: 'expense',
        unheldTotal: 0,
    },
];
var transactionMemberGroupListItems = [
    {
        accountID: 18439984,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
        count: 3,
        currency: 'USD',
        displayName: 'Zara',
        groupedBy: 'from',
        login: 'admin@policy.com',
        total: 70,
        transactions: [],
        transactionsQueryJSON: undefined,
    },
    {
        accountID: 1111111,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
        count: 2,
        currency: 'USD',
        displayName: 'Andrew',
        groupedBy: 'from',
        login: 'approver@policy.com',
        total: 30,
        transactions: [],
        transactionsQueryJSON: undefined,
    },
];
var transactionMemberGroupListItemsSorted = [
    {
        accountID: 1111111,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
        count: 2,
        currency: 'USD',
        displayName: 'Andrew',
        groupedBy: 'from',
        login: 'approver@policy.com',
        total: 30,
        transactions: [],
        transactionsQueryJSON: undefined,
    },
    {
        accountID: 18439984,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
        count: 3,
        currency: 'USD',
        displayName: 'Zara',
        groupedBy: 'from',
        login: 'admin@policy.com',
        total: 70,
        transactions: [],
        transactionsQueryJSON: undefined,
    },
];
var transactionCardGroupListItems = [
    {
        accountID: 18439984,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
        bank: CONST_1.default.BANK_NAMES.CHASE,
        cardID: 20202020,
        cardName: "Zara's card",
        count: 4,
        currency: 'USD',
        displayName: 'Zara',
        groupedBy: 'card',
        lastFourPAN: '1234',
        login: 'admin@policy.com',
        total: 40,
        transactions: [],
        transactionsQueryJSON: undefined,
    },
    {
        accountID: 1111111,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
        bank: CONST_1.default.BANK_NAMES.AMERICAN_EXPRESS,
        cardID: 30303030,
        cardName: "Andrew's card",
        count: 6,
        currency: 'USD',
        displayName: 'Andrew',
        groupedBy: 'card',
        lastFourPAN: '1234',
        login: 'approver@policy.com',
        total: 20,
        transactions: [],
        transactionsQueryJSON: undefined,
    },
];
var transactionCardGroupListItemsSorted = [
    {
        accountID: 1111111,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
        bank: CONST_1.default.BANK_NAMES.AMERICAN_EXPRESS,
        cardID: 30303030,
        cardName: "Andrew's card",
        count: 6,
        currency: 'USD',
        displayName: 'Andrew',
        groupedBy: 'card',
        lastFourPAN: '1234',
        login: 'approver@policy.com',
        total: 20,
        transactions: [],
        transactionsQueryJSON: undefined,
    },
    {
        accountID: 18439984,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
        bank: CONST_1.default.BANK_NAMES.CHASE,
        cardID: 20202020,
        cardName: "Zara's card",
        count: 4,
        currency: 'USD',
        displayName: 'Zara',
        groupedBy: 'card',
        lastFourPAN: '1234',
        login: 'admin@policy.com',
        total: 40,
        transactions: [],
        transactionsQueryJSON: undefined,
    },
];
var transactionWithdrawalIDGroupListItems = [
    {
        bankName: CONST_1.default.BANK_NAMES.CHASE,
        entryID: entryID,
        accountNumber: accountNumber,
        debitPosted: '2025-08-12 17:11:22',
        count: 4,
        currency: 'USD',
        total: 40,
        groupedBy: 'withdrawal-id',
        transactions: [],
        transactionsQueryJSON: undefined,
    },
    {
        bankName: CONST_1.default.BANK_NAMES.CITIBANK,
        entryID: entryID2,
        accountNumber: accountNumber2,
        debitPosted: '2025-08-19 18:10:54',
        count: 6,
        currency: 'USD',
        total: 20,
        groupedBy: 'withdrawal-id',
        transactions: [],
        transactionsQueryJSON: undefined,
    },
];
var transactionWithdrawalIDGroupListItemsSorted = [
    {
        bankName: CONST_1.default.BANK_NAMES.CITIBANK,
        entryID: entryID2,
        accountNumber: accountNumber2,
        debitPosted: '2025-08-19 18:10:54',
        count: 6,
        currency: 'USD',
        total: 20,
        groupedBy: 'withdrawal-id',
        transactions: [],
        transactionsQueryJSON: undefined,
    },
    {
        bankName: CONST_1.default.BANK_NAMES.CHASE,
        entryID: entryID,
        accountNumber: accountNumber,
        debitPosted: '2025-08-12 17:11:22',
        count: 4,
        currency: 'USD',
        total: 40,
        groupedBy: 'withdrawal-id',
        transactions: [],
        transactionsQueryJSON: undefined,
    },
];
describe('SearchUIUtils', function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_native_onyx_1.default.init({
                        keys: ONYXKEYS_1.default,
                    });
                    return [4 /*yield*/, IntlStore_1.default.load('en')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Test getAction', function () {
        test('Should return `View` action for an invalid key', function () {
            var action = SearchUIUtils.getActions(searchResults.data, {}, 'invalid_key', CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.VIEW);
        });
        test('Should return `Submit` action for transaction on policy with delayed submission and no violations', function () {
            var action = SearchUIUtils.getActions(searchResults.data, {}, "report_".concat(reportID), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.SUBMIT);
            action = SearchUIUtils.getActions(searchResults.data, {}, "transactions_".concat(transactionID), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.SUBMIT);
        });
        test('Should return `View` action for transaction on policy with delayed submission and with violations when current user is submitter and the expense was submitted', function () { return __awaiter(void 0, void 0, void 0, function () {
            var localSearchResults;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: submitterAccountID })];
                    case 1:
                        _b.sent();
                        localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a["policy_".concat(policyID)] = __assign(__assign({}, searchResults.data["policy_".concat(policyID)]), { role: CONST_1.default.POLICY.ROLE.USER }), _a["report_".concat(reportID2)] = __assign(__assign({}, searchResults.data["report_".concat(reportID2)]), { accountID: submitterAccountID, ownerAccountID: submitterAccountID }), _a["transactions_".concat(transactionID2)] = __assign(__assign({}, searchResults.data["transactions_".concat(transactionID2)]), { accountID: submitterAccountID, managerID: adminAccountID }), _a));
                        expect(SearchUIUtils.getActions(localSearchResults, allViolations, "report_".concat(reportID2), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, submitterAccountID).at(0)).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.VIEW);
                        expect(SearchUIUtils.getActions(localSearchResults, allViolations, "transactions_".concat(transactionID2), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, submitterAccountID).at(0)).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.VIEW);
                        return [2 /*return*/];
                }
            });
        }); });
        test('Should return `Review` action for transaction with duplicate violation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var duplicateViolation, action;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        duplicateViolation = (_a = {},
                            _a["transactionViolations_".concat(transactionID2)] = [
                                {
                                    name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
                                    type: CONST_1.default.VIOLATION_TYPES.WARNING,
                                    showInReview: true,
                                },
                            ],
                            _a);
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID2), searchResults.data["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID2)])];
                    case 1:
                        _b.sent();
                        action = SearchUIUtils.getActions(searchResults.data, duplicateViolation, "report_".concat(reportID2), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
                        expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.REVIEW);
                        return [2 /*return*/];
                }
            });
        }); });
        test('Should return `Review` action for transaction on policy with delayed submission and with violations', function () {
            var action = SearchUIUtils.getActions(searchResults.data, allViolations, "report_".concat(reportID2), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.REVIEW);
            action = SearchUIUtils.getActions(searchResults.data, allViolations, "transactions_".concat(transactionID2), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.REVIEW);
        });
        test('Should return `Paid` action for a manually settled report', function () {
            var _a;
            var paidReportID = 'report_paid';
            var localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a[paidReportID] = __assign(__assign({}, searchResults.data["report_".concat(reportID)]), { reportID: paidReportID, stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED }), _a["reportNameValuePairs_".concat(paidReportID)] = {
                manualReimbursed: '2024-01-01',
            }, _a));
            var action = SearchUIUtils.getActions(localSearchResults, {}, paidReportID, CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.PAID);
        });
        test('Should return `Paid` action for a settled report on an auto-reimbursement policy', function () {
            var _a;
            var paidReportID = 'report_paid_auto';
            var policyIDAuto = 'policy_auto';
            var localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a["policy_".concat(policyIDAuto)] = __assign(__assign({}, searchResults.data["policy_".concat(policyID)]), { id: policyIDAuto, reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES }), _a[paidReportID] = __assign(__assign({}, searchResults.data["report_".concat(reportID)]), { reportID: paidReportID, policyID: policyIDAuto, stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED }), _a));
            var action = SearchUIUtils.getActions(localSearchResults, {}, paidReportID, CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.PAID);
        });
        test('Should return `Pay` action for a closed IOU report with an outstanding balance', function () {
            var _a;
            var closedReportID = 'report_closed_with_balance';
            var localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a["report_".concat(closedReportID)] = __assign(__assign({}, searchResults.data["report_".concat(reportID3)]), { reportID: closedReportID, stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED }), _a));
            var action = SearchUIUtils.getActions(localSearchResults, {}, "report_".concat(closedReportID), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.PAY);
        });
        test('Should return `Done` action for a closed report with a zero balance', function () {
            var _a;
            var closedReportID = 'report_closed';
            var localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a["report_".concat(closedReportID)] = __assign(__assign({}, searchResults.data["report_".concat(reportID)]), { reportID: closedReportID, stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED, total: 0 }), _a));
            var action = SearchUIUtils.getActions(localSearchResults, {}, "report_".concat(closedReportID), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.DONE);
        });
        test('Should return `Review` action if report has errors', function () {
            var _a;
            var errorReportID = 'report_error';
            var localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a["report_".concat(errorReportID)] = __assign(__assign({}, searchResults.data["report_".concat(reportID)]), { reportID: errorReportID, errors: { error: 'An error' } }), _a));
            var action = SearchUIUtils.getActions(localSearchResults, {}, "report_".concat(errorReportID), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.REVIEW);
        });
        test('Should return `View` action for non-money request reports', function () {
            var action = SearchUIUtils.getActions(searchResults.data, {}, "report_".concat(reportID4), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.VIEW);
        });
        test('Should return `View` action for an orphaned transaction', function () {
            var _a;
            var orphanedTransactionID = 'transaction_orphaned';
            var localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a["transactions_".concat(orphanedTransactionID)] = __assign(__assign({}, searchResults.data["transactions_".concat(transactionID)]), { transactionID: orphanedTransactionID, reportID: 'non_existent_report' }), _a));
            var action = SearchUIUtils.getActions(localSearchResults, {}, "transactions_".concat(orphanedTransactionID), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.VIEW);
        });
        test('Should return `View` action for a transaction in a multi-transaction report', function () {
            var _a;
            var multiTransactionID = 'transaction_multi';
            var localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a["transactions_".concat(multiTransactionID)] = __assign(__assign({}, searchResults.data["transactions_".concat(transactionID)]), { transactionID: multiTransactionID, isFromOneTransactionReport: false }), _a));
            var action = SearchUIUtils.getActions(localSearchResults, {}, "transactions_".concat(multiTransactionID), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.VIEW);
        });
        test('Should return `Review` action if report export has failed', function () {
            var _a;
            var failedExportReportID = 'report_failed_export';
            var localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a["report_".concat(failedExportReportID)] = __assign(__assign({}, searchResults.data["report_".concat(reportID)]), { reportID: failedExportReportID, stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN, statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN }), _a["reportNameValuePairs_".concat(failedExportReportID)] = {
                exportFailedTime: '2024-01-01',
            }, _a));
            var action = SearchUIUtils.getActions(localSearchResults, {}, "report_".concat(failedExportReportID), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.REVIEW);
        });
        test('Should return `Review` action if transaction has errors', function () {
            var _a;
            var errorTransactionID = 'transaction_error';
            var localSearchResults = __assign(__assign({}, searchResults.data), (_a = {}, _a["transactions_".concat(errorTransactionID)] = __assign(__assign({}, searchResults.data["transactions_".concat(transactionID)]), { transactionID: errorTransactionID, errors: { error: 'An error' } }), _a));
            var action = SearchUIUtils.getActions(localSearchResults, {}, "transactions_".concat(errorTransactionID), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toStrictEqual(CONST_1.default.SEARCH.ACTION_TYPES.REVIEW);
        });
        test('Should return `Pay` action for an IOU report ready to be paid', function () { return __awaiter(void 0, void 0, void 0, function () {
            var iouReportKey, action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: adminAccountID });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        iouReportKey = "report_".concat(reportID3);
                        action = SearchUIUtils.getActions(searchResults.data, {}, iouReportKey, CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
                        expect(action).toEqual(CONST_1.default.SEARCH.ACTION_TYPES.PAY);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Test getListItem', function () {
        it('should return ChatListItem when type is CHAT', function () {
            expect(SearchUIUtils.getListItem(CONST_1.default.SEARCH.DATA_TYPES.CHAT, CONST_1.default.SEARCH.STATUS.EXPENSE.ALL)).toStrictEqual(ChatListItem_1.default);
        });
        it('should return TransactionListItem when groupBy is undefined', function () {
            expect(SearchUIUtils.getListItem(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, undefined)).toStrictEqual(TransactionListItem_1.default);
        });
        it('should return TransactionGroupListItem when type is EXPENSE and groupBy is report', function () {
            expect(SearchUIUtils.getListItem(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, CONST_1.default.SEARCH.GROUP_BY.REPORTS)).toStrictEqual(TransactionGroupListItem_1.default);
        });
        it('should return TransactionGroupListItem when type is TRIP and groupBy is report', function () {
            expect(SearchUIUtils.getListItem(CONST_1.default.SEARCH.DATA_TYPES.TRIP, CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, CONST_1.default.SEARCH.GROUP_BY.REPORTS)).toStrictEqual(TransactionGroupListItem_1.default);
        });
        it('should return TransactionGroupListItem when type is INVOICE and groupBy is report', function () {
            expect(SearchUIUtils.getListItem(CONST_1.default.SEARCH.DATA_TYPES.INVOICE, CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, CONST_1.default.SEARCH.GROUP_BY.REPORTS)).toStrictEqual(TransactionGroupListItem_1.default);
        });
        it('should return TransactionGroupListItem when type is EXPENSE and groupBy is member', function () {
            expect(SearchUIUtils.getListItem(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, CONST_1.default.SEARCH.GROUP_BY.FROM)).toStrictEqual(TransactionGroupListItem_1.default);
        });
        it('should return TransactionGroupListItem when type is TRIP and groupBy is member', function () {
            expect(SearchUIUtils.getListItem(CONST_1.default.SEARCH.DATA_TYPES.TRIP, CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, CONST_1.default.SEARCH.GROUP_BY.FROM)).toStrictEqual(TransactionGroupListItem_1.default);
        });
        it('should return TransactionGroupListItem when type is INVOICE and groupBy is member', function () {
            expect(SearchUIUtils.getListItem(CONST_1.default.SEARCH.DATA_TYPES.INVOICE, CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, CONST_1.default.SEARCH.GROUP_BY.FROM)).toStrictEqual(TransactionGroupListItem_1.default);
        });
    });
    describe('Test getSections', function () {
        it('should return getReportActionsSections result when type is CHAT', function () {
            expect(SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.CHAT, searchResults.data, 2074551, TestHelper_1.formatPhoneNumber)).toStrictEqual(reportActionListItems);
        });
        it('should return getTransactionsSections result when groupBy is undefined', function () {
            expect(SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, searchResults.data, 2074551, TestHelper_1.formatPhoneNumber)).toEqual(transactionsListItems);
        });
        it('should include iouRequestType property for distance transactions', function () {
            var _a;
            var distanceTransactionID = 'distance_transaction_123';
            var testSearchResults = __assign(__assign({}, searchResults), { data: __assign(__assign({}, searchResults.data), (_a = {}, _a["transactions_".concat(distanceTransactionID)] = __assign(__assign({}, searchResults.data["transactions_".concat(transactionID)]), { transactionID: distanceTransactionID, transactionType: CONST_1.default.SEARCH.TRANSACTION_TYPE.DISTANCE, iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.DISTANCE }), _a)) });
            var result = SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, testSearchResults.data, 2074551, TestHelper_1.formatPhoneNumber);
            var distanceTransaction = result.find(function (item) { return item.transactionID === distanceTransactionID; });
            expect(distanceTransaction).toBeDefined();
            expect(distanceTransaction === null || distanceTransaction === void 0 ? void 0 : distanceTransaction.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.DISTANCE);
            var expectedPropertyCount = 57;
            expect(Object.keys(distanceTransaction !== null && distanceTransaction !== void 0 ? distanceTransaction : {}).length).toBe(expectedPropertyCount);
        });
        it('should include iouRequestType property for distance transactions in grouped results', function () {
            var _a;
            var _b;
            var distanceTransactionID = 'distance_transaction_grouped_123';
            var testSearchResults = __assign(__assign({}, searchResults), { data: __assign(__assign({}, searchResults.data), (_a = {}, _a["transactions_".concat(distanceTransactionID)] = __assign(__assign({}, searchResults.data["transactions_".concat(transactionID)]), { transactionID: distanceTransactionID, transactionType: CONST_1.default.SEARCH.TRANSACTION_TYPE.DISTANCE, iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.DISTANCE }), _a)) });
            var result = SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, testSearchResults.data, 2074551, TestHelper_1.formatPhoneNumber, CONST_1.default.SEARCH.GROUP_BY.REPORTS);
            var reportGroup = result.find(function (group) { var _a; return (_a = group.transactions) === null || _a === void 0 ? void 0 : _a.some(function (transaction) { return transaction.transactionID === distanceTransactionID; }); });
            var distanceTransaction = (_b = reportGroup === null || reportGroup === void 0 ? void 0 : reportGroup.transactions) === null || _b === void 0 ? void 0 : _b.find(function (transaction) { return transaction.transactionID === distanceTransactionID; });
            expect(distanceTransaction).toBeDefined();
            expect(distanceTransaction === null || distanceTransaction === void 0 ? void 0 : distanceTransaction.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.DISTANCE);
            var expectedPropertyCount = 57;
            expect(Object.keys(distanceTransaction !== null && distanceTransaction !== void 0 ? distanceTransaction : {}).length).toBe(expectedPropertyCount);
        });
        it('should return getReportSections result when type is EXPENSE and groupBy is report', function () {
            expect(SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, searchResults.data, 2074551, TestHelper_1.formatPhoneNumber, CONST_1.default.SEARCH.GROUP_BY.REPORTS)).toStrictEqual(transactionReportGroupListItems);
        });
        it('should return getReportSections result when type is TRIP and groupBy is report', function () {
            expect(SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.TRIP, searchResults.data, 2074551, TestHelper_1.formatPhoneNumber, CONST_1.default.SEARCH.GROUP_BY.REPORTS)).toStrictEqual(transactionReportGroupListItems);
        });
        it('should return getReportSections result when type is INVOICE and groupBy is report', function () {
            expect(SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.INVOICE, searchResults.data, 2074551, TestHelper_1.formatPhoneNumber, CONST_1.default.SEARCH.GROUP_BY.REPORTS)).toStrictEqual(transactionReportGroupListItems);
        });
        it('should return getMemberSections result when type is EXPENSE and groupBy is from', function () {
            expect(SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, searchResultsGroupByFrom.data, 2074551, TestHelper_1.formatPhoneNumber, CONST_1.default.SEARCH.GROUP_BY.FROM)).toStrictEqual(transactionMemberGroupListItems);
        });
        it('should return getCardSections result when type is EXPENSE and groupBy is card', function () {
            expect(SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, searchResultsGroupByCard.data, 2074551, TestHelper_1.formatPhoneNumber, CONST_1.default.SEARCH.GROUP_BY.CARD)).toStrictEqual(transactionCardGroupListItems);
        });
        it('should return getWithdrawalIDSections result when type is EXPENSE and groupBy is withdrawal-id', function () {
            expect(SearchUIUtils.getSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, searchResultsGroupByWithdrawalID.data, 2074551, TestHelper_1.formatPhoneNumber, CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID)).toStrictEqual(transactionWithdrawalIDGroupListItems);
        });
    });
    describe('Test getSortedSections', function () {
        it('should return getSortedReportActionData result when type is CHAT', function () {
            expect(SearchUIUtils.getSortedSections(CONST_1.default.SEARCH.DATA_TYPES.CHAT, CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, reportActionListItems, TestHelper_1.localeCompare)).toStrictEqual([
                {
                    accountID: 18439984,
                    actionName: 'ADDCOMMENT',
                    created: '2024-12-21 13:05:20',
                    date: '2024-12-21 13:05:20',
                    formattedFrom: 'Admin',
                    from: {
                        accountID: 18439984,
                        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                        displayName: 'Admin',
                        login: adminEmail,
                    },
                    keyForList: 'Admin',
                    message: [
                        {
                            html: '<p>Payment has been processed.</p>',
                            text: 'Payment has been processed.',
                            type: 'text',
                            whisperedTo: [],
                        },
                        {
                            html: '<p>Please review this expense.</p>',
                            text: 'Please review this expense.',
                            type: 'comment',
                        },
                    ],
                    reportActionID: 'Admin',
                    reportID: '123456789',
                    reportName: 'Expense Report #123',
                },
            ]);
        });
        it('should return getSortedTransactionData result when groupBy is undefined', function () {
            expect(SearchUIUtils.getSortedSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, '', transactionsListItems, TestHelper_1.localeCompare, 'date', 'asc', undefined)).toStrictEqual(transactionsListItems);
        });
        it('should return getSortedReportData result when type is EXPENSE and groupBy is report', function () {
            expect(SearchUIUtils.getSortedSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, '', transactionReportGroupListItems, TestHelper_1.localeCompare, 'date', 'asc', CONST_1.default.SEARCH.GROUP_BY.REPORTS)).toStrictEqual(transactionReportGroupListItems);
        });
        it('should return getSortedReportData result when type is TRIP and groupBy is report', function () {
            expect(SearchUIUtils.getSortedSections(CONST_1.default.SEARCH.DATA_TYPES.TRIP, '', transactionReportGroupListItems, TestHelper_1.localeCompare, 'date', 'asc', CONST_1.default.SEARCH.GROUP_BY.REPORTS)).toStrictEqual(transactionReportGroupListItems);
        });
        it('should return getSortedReportData result when type is INVOICE and groupBy is report', function () {
            expect(SearchUIUtils.getSortedSections(CONST_1.default.SEARCH.DATA_TYPES.INVOICE, '', transactionReportGroupListItems, TestHelper_1.localeCompare, 'date', 'asc', CONST_1.default.SEARCH.GROUP_BY.REPORTS)).toStrictEqual(transactionReportGroupListItems);
        });
        it('should return getSortedMemberData result when type is EXPENSE and groupBy is member', function () {
            expect(SearchUIUtils.getSortedSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, '', transactionMemberGroupListItems, TestHelper_1.localeCompare, 'date', 'asc', CONST_1.default.SEARCH.GROUP_BY.FROM)).toStrictEqual(transactionMemberGroupListItemsSorted);
        });
        it('should return getSortedCardData result when type is EXPENSE and groupBy is card', function () {
            expect(SearchUIUtils.getSortedSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, '', transactionCardGroupListItems, TestHelper_1.localeCompare, 'date', 'asc', CONST_1.default.SEARCH.GROUP_BY.CARD)).toStrictEqual(transactionCardGroupListItemsSorted);
        });
        it('should return getSortedWithdrawalIDData result when type is EXPENSE and groupBy is withdrawal-id', function () {
            expect(SearchUIUtils.getSortedSections(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, '', transactionWithdrawalIDGroupListItems, TestHelper_1.localeCompare, 'date', 'asc', CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID)).toStrictEqual(transactionWithdrawalIDGroupListItemsSorted);
        });
    });
    describe('Test createTypeMenuItems', function () {
        it('should return the default menu items', function () {
            var menuItems = SearchUIUtils.createTypeMenuSections(undefined, undefined, {}, undefined, {}, undefined, {}, false)
                .map(function (section) { return section.menuItems; })
                .flat();
            expect(menuItems).toHaveLength(3);
            expect(menuItems).toStrictEqual(expect.arrayContaining([
                expect.objectContaining({
                    translationPath: 'common.expenses',
                    type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                    icon: Expensicons.Receipt,
                }),
                expect.objectContaining({
                    translationPath: 'common.reports',
                    type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                    icon: Expensicons.Document,
                }),
                expect.objectContaining({
                    translationPath: 'common.chats',
                    type: CONST_1.default.SEARCH.DATA_TYPES.CHAT,
                    icon: Expensicons.ChatBubbles,
                }),
            ]));
        });
        it('should show todo section with submit, approve, pay, and export items when user has appropriate permissions', function () {
            var _a;
            var _b;
            var mockPolicies = {
                policy1: {
                    id: 'policy1',
                    name: 'Test Policy',
                    owner: adminEmail,
                    outputCurrency: 'USD',
                    isPolicyExpenseChatEnabled: true,
                    role: CONST_1.default.POLICY.ROLE.ADMIN,
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                    approver: adminEmail,
                    exporter: adminEmail,
                    achAccount: {
                        bankAccountID: 1,
                        reimburser: adminEmail,
                        state: CONST_1.default.BANK_ACCOUNT.STATE.OPEN,
                        accountNumber: '1234567890',
                        routingNumber: '1234567890',
                        addressName: 'Test Address',
                        bankName: 'Test Bank',
                    },
                    areExpensifyCardsEnabled: true,
                    areCompanyCardsEnabled: true,
                    employeeList: (_a = {},
                        _a[adminEmail] = {
                            email: adminEmail,
                            role: CONST_1.default.POLICY.ROLE.ADMIN,
                            submitsTo: approverEmail,
                        },
                        _a[approverEmail] = {
                            email: approverEmail,
                            role: CONST_1.default.POLICY.ROLE.USER,
                            submitsTo: adminEmail,
                        },
                        _a),
                },
            };
            var mockCardFeedsByPolicy = {
                policy1: [
                    {
                        id: 'card1',
                        feed: 'Expensify Card',
                        fundID: 'fund1',
                        name: 'Test Card Feed',
                    },
                ],
            };
            var mockSavedSearches = {};
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, mockCardFeedsByPolicy, undefined, mockPolicies, undefined, mockSavedSearches, false);
            var todoSection = sections.find(function (section) { return section.translationPath === 'common.todo'; });
            expect(todoSection).toBeDefined();
            expect(todoSection === null || todoSection === void 0 ? void 0 : todoSection.menuItems.length).toBeGreaterThan(0);
            var menuItemKeys = (_b = todoSection === null || todoSection === void 0 ? void 0 : todoSection.menuItems.map(function (item) { return item.key; })) !== null && _b !== void 0 ? _b : [];
            expect(menuItemKeys).toContain(CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT);
            expect(menuItemKeys).toContain(CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE);
            expect(menuItemKeys).toContain(CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT);
        });
        it('should show accounting section with statements, unapproved cash, unapproved card, and reconciliation items', function () {
            var _a;
            var mockPolicies = {
                policy1: {
                    id: 'policy1',
                    name: 'Test Policy',
                    owner: adminEmail,
                    outputCurrency: 'USD',
                    isPolicyExpenseChatEnabled: true,
                    role: CONST_1.default.POLICY.ROLE.ADMIN,
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                    areExpensifyCardsEnabled: true,
                    areCompanyCardsEnabled: true,
                    achAccount: {
                        bankAccountID: 1234,
                        reimburser: adminEmail,
                        state: CONST_1.default.BANK_ACCOUNT.STATE.OPEN,
                        accountNumber: '1234567890',
                        routingNumber: '1234567890',
                        addressName: 'Test Address',
                        bankName: 'Test Bank',
                    },
                },
            };
            var mockCardFeedsByPolicy = {
                policy1: [
                    {
                        id: 'card1',
                        feed: 'Expensify Card',
                        fundID: 'fund1',
                        name: 'Test Card Feed',
                    },
                ],
            };
            var mockSavedSearches = {};
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, mockCardFeedsByPolicy, undefined, mockPolicies, undefined, mockSavedSearches, false);
            var accountingSection = sections.find(function (section) { return section.translationPath === 'workspace.common.accounting'; });
            expect(accountingSection).toBeDefined();
            expect(accountingSection === null || accountingSection === void 0 ? void 0 : accountingSection.menuItems.length).toBeGreaterThan(0);
            var menuItemKeys = (_a = accountingSection === null || accountingSection === void 0 ? void 0 : accountingSection.menuItems.map(function (item) { return item.key; })) !== null && _a !== void 0 ? _a : [];
            expect(menuItemKeys).toContain(CONST_1.default.SEARCH.SEARCH_KEYS.STATEMENTS);
            expect(menuItemKeys).toContain(CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CASH);
            expect(menuItemKeys).toContain(CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CARD);
            expect(menuItemKeys).toContain(CONST_1.default.SEARCH.SEARCH_KEYS.RECONCILIATION);
        });
        it('should show saved section when there are saved searches', function () {
            var mockSavedSearches = {
                search1: {
                    id: 'search1',
                    name: 'My Saved Search',
                    query: 'type:expense',
                    pendingAction: undefined,
                },
                search2: {
                    id: 'search2',
                    name: 'Another Search',
                    query: 'type:report',
                    pendingAction: undefined,
                },
            };
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, {}, undefined, {}, undefined, mockSavedSearches, false);
            var savedSection = sections.find(function (section) { return section.translationPath === 'search.savedSearchesMenuItemTitle'; });
            expect(savedSection).toBeDefined();
        });
        it('should not show saved section when there are no saved searches', function () {
            var mockSavedSearches = {};
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, {}, undefined, {}, undefined, mockSavedSearches, false);
            var savedSection = sections.find(function (section) { return section.translationPath === 'search.savedSearchesMenuItemTitle'; });
            expect(savedSection).toBeUndefined();
        });
        it('should not show saved section when all saved searches are pending deletion and not offline', function () {
            var mockSavedSearches = {
                search1: {
                    id: 'search1',
                    name: 'Deleted Search',
                    query: 'type:expense',
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                },
            };
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, {}, undefined, {}, undefined, mockSavedSearches, false);
            var savedSection = sections.find(function (section) { return section.translationPath === 'search.savedSearchesMenuItemTitle'; });
            expect(savedSection).toBeUndefined();
        });
        it('should show saved section when searches are pending deletion but user is offline', function () {
            var mockSavedSearches = {
                search1: {
                    id: 'search1',
                    name: 'Deleted Search',
                    query: 'type:expense',
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                },
            };
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, {}, undefined, {}, undefined, mockSavedSearches, true);
            var savedSection = sections.find(function (section) { return section.translationPath === 'search.savedSearchesMenuItemTitle'; });
            expect(savedSection).toBeDefined();
        });
        it('should not show todo section when user has no appropriate permissions', function () {
            var mockPolicies = {
                policy1: {
                    id: 'policy1',
                    name: 'Personal Policy',
                    owner: adminEmail,
                    outputCurrency: 'USD',
                    isPolicyExpenseChatEnabled: false,
                    role: CONST_1.default.POLICY.ROLE.USER,
                    type: CONST_1.default.POLICY.TYPE.PERSONAL, // personal policy, not team
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL,
                },
            };
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, {}, undefined, mockPolicies, undefined, {}, false);
            var todoSection = sections.find(function (section) { return section.translationPath === 'common.todo'; });
            expect(todoSection).toBeUndefined();
        });
        it('should not show accounting section when user has no admin permissions or card feeds', function () {
            var mockPolicies = {
                policy1: {
                    id: 'policy1',
                    name: 'Team Policy',
                    owner: adminEmail,
                    outputCurrency: 'USD',
                    isPolicyExpenseChatEnabled: true,
                    role: CONST_1.default.POLICY.ROLE.USER, // not admin
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    areCompanyCardsEnabled: false,
                },
            };
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, {}, // no card feeds
            undefined, mockPolicies, undefined, {}, false);
            var accountingSection = sections.find(function (section) { return section.translationPath === 'workspace.common.accounting'; });
            expect(accountingSection).toBeUndefined();
        });
        it('should show reconciliation for ACH-only scenario (payments enabled, active VBBA, reimburser set, areExpensifyCardsEnabled = false)', function () {
            var _a;
            var mockPolicies = {
                policy1: {
                    id: 'policy1',
                    name: 'ACH Only Policy',
                    owner: adminEmail,
                    outputCurrency: 'USD',
                    isPolicyExpenseChatEnabled: true,
                    role: CONST_1.default.POLICY.ROLE.ADMIN,
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                    areExpensifyCardsEnabled: false,
                    achAccount: {
                        bankAccountID: 1234,
                        reimburser: adminEmail,
                        state: CONST_1.default.BANK_ACCOUNT.STATE.OPEN,
                        accountNumber: '1234567890',
                        routingNumber: '1234567890',
                        addressName: 'Test Address',
                        bankName: 'Test Bank',
                    },
                },
            };
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, {}, undefined, mockPolicies, undefined, {}, false);
            var accountingSection = sections.find(function (section) { return section.translationPath === 'workspace.common.accounting'; });
            expect(accountingSection).toBeDefined();
            var menuItemKeys = (_a = accountingSection === null || accountingSection === void 0 ? void 0 : accountingSection.menuItems.map(function (item) { return item.key; })) !== null && _a !== void 0 ? _a : [];
            expect(menuItemKeys).toContain(CONST_1.default.SEARCH.SEARCH_KEYS.RECONCILIATION);
        });
        it('should not show reconciliation for card-only scenario without card feeds (areExpensifyCardsEnabled = true but no card feeds)', function () {
            var _a;
            var mockPolicies = {
                policy1: {
                    id: 'policy1',
                    name: 'Card Only Policy',
                    owner: adminEmail,
                    outputCurrency: 'USD',
                    isPolicyExpenseChatEnabled: true,
                    role: CONST_1.default.POLICY.ROLE.ADMIN,
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                    areExpensifyCardsEnabled: true,
                },
            };
            var mockCardFeedsByPolicy = {};
            var sections = SearchUIUtils.createTypeMenuSections(adminEmail, adminAccountID, mockCardFeedsByPolicy, undefined, mockPolicies, undefined, {}, false);
            var accountingSection = sections.find(function (section) { return section.translationPath === 'workspace.common.accounting'; });
            expect(accountingSection).toBeDefined();
            var menuItemKeys = (_a = accountingSection === null || accountingSection === void 0 ? void 0 : accountingSection.menuItems.map(function (item) { return item.key; })) !== null && _a !== void 0 ? _a : [];
            expect(menuItemKeys).toContain(CONST_1.default.SEARCH.SEARCH_KEYS.RECONCILIATION);
        });
        it('should generate correct routes', function () {
            var menuItems = SearchUIUtils.createTypeMenuSections(undefined, undefined, {}, undefined, {}, undefined, {}, false)
                .map(function (section) { return section.menuItems; })
                .flat();
            var expectedQueries = ['type:expense sortBy:date sortOrder:desc', 'type:expense sortBy:date sortOrder:desc groupBy:reports', 'type:chat sortBy:date sortOrder:desc'];
            menuItems.forEach(function (item, index) {
                expect(item.searchQuery).toStrictEqual(expectedQueries.at(index));
            });
        });
    });
    describe('Test isSearchResultsEmpty', function () {
        it('should return true when all transactions have delete pending action', function () {
            var results = {
                data: {
                    personalDetailsList: {},
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    transactions_1805965960759424086: {
                        accountID: 2074551,
                        amount: 0,
                        canDelete: false,
                        canHold: true,
                        canUnhold: false,
                        category: 'Employee Meals Remote (Fringe Benefit)',
                        action: 'approve',
                        allActions: ['approve'],
                        comment: {
                            comment: '',
                        },
                        created: '2025-05-26',
                        currency: 'USD',
                        hasEReceipt: false,
                        isFromOneTransactionReport: true,
                        managerID: adminAccountID,
                        merchant: '(none)',
                        modifiedAmount: -1000,
                        modifiedCreated: '2025-05-22',
                        modifiedCurrency: 'USD',
                        modifiedMerchant: 'Costco Wholesale',
                        parentTransactionID: '',
                        policyID: '137DA25D273F2423',
                        receipt: {
                            source: 'https://www.expensify.com/receipts/fake.jpg',
                            state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_COMPLETE,
                        },
                        reportID: '6523565988285061',
                        reportType: 'expense',
                        tag: '',
                        transactionID: '1805965960759424086',
                        transactionThreadReportID: '4139222832581831',
                        transactionType: 'cash',
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                        convertedAmount: -5000,
                        convertedCurrency: 'USD',
                    },
                },
                search: {
                    type: 'expense',
                    status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL,
                    offset: 0,
                    hasMoreResults: false,
                    hasResults: true,
                    isLoading: false,
                },
            };
            expect(SearchUIUtils.isSearchResultsEmpty(results)).toBe(true);
        });
    });
    test('Should show `View` to overlimit approver', function () {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: overlimitApproverAccountID });
        searchResults.data["policy_".concat(policyID)].role = CONST_1.default.POLICY.ROLE.USER;
        return (0, waitForBatchedUpdates_1.default)().then(function () {
            var action = SearchUIUtils.getActions(searchResults.data, allViolations, "report_".concat(reportID2), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, overlimitApproverAccountID).at(0);
            expect(action).toEqual(CONST_1.default.SEARCH.ACTION_TYPES.VIEW);
            action = SearchUIUtils.getActions(searchResults.data, allViolations, "transactions_".concat(transactionID2), CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, overlimitApproverAccountID).at(0);
            expect(action).toEqual(CONST_1.default.SEARCH.ACTION_TYPES.VIEW);
        });
    });
    test('Should show `Approve` for report', function () {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: adminAccountID });
        var result = {
            data: {
                personalDetailsList: {
                    adminAccountID: {
                        accountID: adminAccountID,
                        avatar: 'https://d1wpcgnaa73g0y.cloudfront.net/fake.jpeg',
                        displayName: 'You',
                        login: 'you@expensifail.com',
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '2074551': {
                        accountID: 2074551,
                        avatar: 'https://d1wpcgnaa73g0y.cloudfront.net/fake2.jpeg',
                        displayName: 'Jason',
                        login: 'jason@expensifail.com',
                    },
                },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                policy_137DA25D273F2423: {
                    approvalMode: 'ADVANCED',
                    approver: '',
                    autoReimbursement: {
                        limit: 500000,
                    },
                    autoReimbursementLimit: 500000,
                    autoReporting: true,
                    autoReportingFrequency: 'immediate',
                    harvesting: {
                        enabled: true,
                    },
                    id: '137DA25D273F2423',
                    name: 'Expenses - Expensify US',
                    owner: 'accounting@expensifail.com',
                    preventSelfApproval: true,
                    reimbursementChoice: 'reimburseYes',
                    role: 'user',
                    rules: {
                        approvalRules: [],
                        expenseRules: [],
                    },
                    type: 'corporate',
                },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                report_6523565988285061: {
                    accountID: 2074551,
                    chatReportID: '4128157185472356',
                    created: '2025-05-26 19:49:56',
                    currency: 'USD',
                    isOneTransactionReport: true,
                    isOwnPolicyExpenseChat: false,
                    isPolicyExpenseChat: false,
                    isWaitingOnBankAccount: false,
                    managerID: adminAccountID,
                    nonReimbursableTotal: 0,
                    oldPolicyName: '',
                    ownerAccountID: 2074551,
                    parentReportActionID: '5568426544518647396',
                    parentReportID: '4128157185472356',
                    policyID: '137DA25D273F2423',
                    private_isArchived: '',
                    reportID: '6523565988285061',
                    reportName: 'Expense Report #6523565988285061',
                    stateNum: 1,
                    statusNum: 1,
                    total: -1000,
                    type: 'expense',
                    unheldTotal: -1000,
                },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                transactions_1805965960759424086: {
                    accountID: 2074551,
                    amount: 0,
                    canDelete: false,
                    canHold: true,
                    canUnhold: false,
                    cardID: undefined,
                    cardName: undefined,
                    category: 'Employee Meals Remote (Fringe Benefit)',
                    action: 'approve',
                    allActions: ['approve'],
                    comment: {
                        comment: '',
                    },
                    created: '2025-05-26',
                    currency: 'USD',
                    hasEReceipt: false,
                    isFromOneTransactionReport: true,
                    managerID: adminAccountID,
                    merchant: '(none)',
                    modifiedAmount: -1000,
                    modifiedCreated: '2025-05-22',
                    modifiedCurrency: 'USD',
                    modifiedMerchant: 'Costco Wholesale',
                    parentTransactionID: '',
                    policyID: '137DA25D273F2423',
                    receipt: {
                        source: 'https://www.expensify.com/receipts/fake.jpg',
                        state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_COMPLETE,
                    },
                    reportID: '6523565988285061',
                    reportType: 'expense',
                    tag: '',
                    transactionID: '1805965960759424086',
                    transactionThreadReportID: '4139222832581831',
                    transactionType: 'cash',
                    convertedAmount: -5000,
                    convertedCurrency: 'USD',
                },
            },
            search: {
                type: 'expense',
                status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL,
                offset: 0,
                hasMoreResults: false,
                hasResults: true,
                isLoading: false,
            },
        };
        return (0, waitForBatchedUpdates_1.default)().then(function () {
            var action = SearchUIUtils.getActions(result.data, allViolations, 'report_6523565988285061', CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, adminAccountID).at(0);
            expect(action).toEqual(CONST_1.default.SEARCH.ACTION_TYPES.APPROVE);
        });
    });
    test('Should return true if the search result has valid type', function () {
        expect(SearchUIUtils.shouldShowEmptyState(false, transactionReportGroupListItems.length, searchResults.search.type)).toBe(true);
        expect(SearchUIUtils.shouldShowEmptyState(true, 0, searchResults.search.type)).toBe(true);
        var inValidSearchType = 'expensify';
        expect(SearchUIUtils.shouldShowEmptyState(true, transactionReportGroupListItems.length, inValidSearchType)).toBe(true);
        expect(SearchUIUtils.shouldShowEmptyState(true, transactionReportGroupListItems.length, searchResults.search.type)).toBe(false);
    });
    test('Should determine whether the date, amount, and tax column require wide columns or not', function () {
        // Test case 1: `isAmountLengthLong` should be false if the current symbol + amount length does not exceed 11 characters
        var shouldShowAmountInWideColumn = SearchUIUtils.getWideAmountIndicators(transactionsListItems).shouldShowAmountInWideColumn;
        expect(shouldShowAmountInWideColumn).toBe(false);
        var transaction = transactionsListItems.at(0);
        // Test case 2: `isAmountLengthLong` should be true when the current symbol + amount length exceeds 11 characters
        // `isTaxAmountLengthLong` should be false if current symbol + tax amount length does not exceed 11 characters
        var _a = SearchUIUtils.getWideAmountIndicators(__spreadArray(__spreadArray([], transactionsListItems, true), [
            __assign(__assign({}, transaction), { amount: 99999999.99, taxAmount: 2332.77, modifiedAmount: undefined }),
        ], false)), isAmountLengthLong2 = _a.shouldShowAmountInWideColumn, shouldShowTaxAmountInWideColumn = _a.shouldShowTaxAmountInWideColumn;
        expect(isAmountLengthLong2).toBe(true);
        expect(shouldShowTaxAmountInWideColumn).toBe(false);
        // Test case 3: Both `isAmountLengthLong` and `isTaxAmountLengthLong` should be true
        // when the current symbol + amount and current symbol + tax amount lengths exceed 11 characters
        var _b = SearchUIUtils.getWideAmountIndicators(__spreadArray(__spreadArray([], transactionsListItems, true), [
            __assign(__assign({}, transaction), { amount: 99999999.99, taxAmount: 45555555.55, modifiedAmount: undefined }),
        ], false)), isAmountLengthLong3 = _b.shouldShowAmountInWideColumn, isTaxAmountLengthLong2 = _b.shouldShowTaxAmountInWideColumn;
        expect(isAmountLengthLong3).toBe(true);
        expect(isTaxAmountLengthLong2).toBe(true);
    });
    describe('Test getColumnsToShow', function () {
        test('Should only show columns when at least one transaction has a value for them', function () {
            var _a;
            // Use the existing transaction as a base and modify only the fields we need to test
            var baseTransaction = searchResults.data["transactions_".concat(transactionID)];
            // Create test transactions as arrays (getColumnsToShow accepts arrays)
            var emptyTransaction = __assign(__assign({}, baseTransaction), { transactionID: 'empty', merchant: '', modifiedMerchant: '', comment: { comment: '' }, category: '', tag: '', accountID: submitterAccountID, managerID: submitterAccountID });
            var merchantTransaction = __assign(__assign({}, baseTransaction), { transactionID: 'merchant', merchant: 'Test Merchant', modifiedMerchant: '', comment: { comment: '' }, category: '', tag: '', accountID: submitterAccountID, managerID: submitterAccountID });
            var categoryTransaction = __assign(__assign({}, baseTransaction), { transactionID: 'category', merchant: '', modifiedMerchant: '', comment: { comment: '' }, category: 'Office Supplies', tag: '', accountID: submitterAccountID, managerID: submitterAccountID });
            var tagTransaction = __assign(__assign({}, baseTransaction), { transactionID: 'tag', merchant: '', modifiedMerchant: '', comment: { comment: '' }, category: '', tag: 'Project A', accountID: submitterAccountID, managerID: submitterAccountID });
            var descriptionTransaction = __assign(__assign({}, baseTransaction), { transactionID: 'description', merchant: '', modifiedMerchant: '', comment: { comment: 'Business meeting lunch' }, category: '', tag: '', accountID: submitterAccountID, managerID: submitterAccountID });
            var differentUsersTransaction = __assign(__assign({}, baseTransaction), { transactionID: 'differentUsers', merchant: '', modifiedMerchant: '', comment: { comment: '' }, category: '', tag: '', accountID: approverAccountID, managerID: adminAccountID, reportID: reportID2 });
            // Test 1: No optional fields should be shown when all transactions are empty
            var columns = SearchUIUtils.getColumnsToShow(submitterAccountID, [emptyTransaction, emptyTransaction], false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT]).toBe(false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY]).toBe(false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.TAG]).toBe(false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION]).toBe(false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.FROM]).toBe(false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.TO]).toBe(false);
            // Test 2: Merchant column should show when at least one transaction has merchant
            columns = SearchUIUtils.getColumnsToShow(submitterAccountID, [emptyTransaction, merchantTransaction], false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT]).toBe(true);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY]).toBe(false);
            // Test 3: Category column should show when at least one transaction has category
            columns = SearchUIUtils.getColumnsToShow(submitterAccountID, [emptyTransaction, categoryTransaction], false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY]).toBe(true);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT]).toBe(false);
            // Test 4: Tag column should show when at least one transaction has tag
            columns = SearchUIUtils.getColumnsToShow(submitterAccountID, [emptyTransaction, tagTransaction], false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.TAG]).toBe(true);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY]).toBe(false);
            // Test 5: Description column should show when at least one transaction has description
            columns = SearchUIUtils.getColumnsToShow(submitterAccountID, [emptyTransaction, descriptionTransaction], false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION]).toBe(true);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT]).toBe(false);
            // Test 6: From/To columns should show when at least one transaction has different users
            // @ts-expect-error -- no need to construct all data again, the function below only needs the report and transactions
            var data = (_a = {},
                _a["report_".concat(reportID2)] = searchResults.data["report_".concat(reportID2)],
                _a["transactions_".concat(emptyTransaction.transactionID)] = emptyTransaction,
                _a["transactions_".concat(differentUsersTransaction.transactionID)] = differentUsersTransaction,
                _a);
            columns = SearchUIUtils.getColumnsToShow(submitterAccountID, data, false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.FROM]).toBe(true);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.TO]).toBe(true);
            // Test 7: Multiple columns should show when transactions have different fields
            columns = SearchUIUtils.getColumnsToShow(submitterAccountID, [merchantTransaction, categoryTransaction, tagTransaction], false);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT]).toBe(true);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY]).toBe(true);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.TAG]).toBe(true);
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION]).toBe(false);
        });
        test('Should respect isExpenseReportView flag and not show From/To columns', function () {
            // Create transaction with different users using existing transaction as base
            var baseTransaction = searchResults.data["transactions_".concat(transactionID)];
            var testTransaction = __assign(__assign({}, baseTransaction), { transactionID: 'test', merchant: 'Test Merchant', modifiedMerchant: '', comment: { comment: 'Test description' }, category: 'Office Supplies', tag: 'Project A', accountID: submitterAccountID, managerID: approverAccountID });
            // In expense report view, From/To columns should not be shown
            var columns = SearchUIUtils.getColumnsToShow(submitterAccountID, [testTransaction], true);
            // These columns should be shown based on data
            expect(columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.MERCHANT]).toBe(true);
            expect(columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.CATEGORY]).toBe(true);
            expect(columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAG]).toBe(true);
            expect(columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DESCRIPTION]).toBe(true);
            // From/To columns should not exist in expense report view
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.FROM]).toBeUndefined();
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.TO]).toBeUndefined();
        });
        test('Should handle modifiedMerchant and empty category/tag values correctly', function () {
            var baseTransaction = searchResults.data["transactions_".concat(transactionID)];
            var testTransaction = __assign(__assign({}, baseTransaction), { transactionID: 'modified', merchant: '', modifiedMerchant: 'Modified Merchant', comment: { comment: '' }, category: 'Uncategorized', tag: CONST_1.default.SEARCH.TAG_EMPTY_VALUE, accountID: adminAccountID, managerID: adminAccountID });
            var columns = SearchUIUtils.getColumnsToShow(submitterAccountID, [testTransaction], false);
            // Should show merchant column because modifiedMerchant has value
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT]).toBe(true);
            // Should not show category column because 'Uncategorized' is an empty value
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY]).toBe(false);
            // Should not show tag column because it's the empty tag value
            expect(columns[CONST_1.default.SEARCH.TABLE_COLUMNS.TAG]).toBe(false);
        });
    });
    describe('createAndOpenSearchTransactionThread', function () {
        var threadReportID = 'thread-report-123';
        var threadReport = { reportID: threadReportID };
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        var transactionListItem = transactionsListItems.at(0);
        var iouReportAction = { reportActionID: 'action-123' };
        var hash = 12345;
        var backTo = '/search/all';
        test('Should create transaction thread report and navigate to it', function () {
            Report_1.createTransactionThreadReport.mockReturnValue(threadReport);
            SearchUIUtils.createAndOpenSearchTransactionThread(transactionListItem, iouReportAction, hash, backTo);
            expect(Report_1.createTransactionThreadReport).toHaveBeenCalledWith(report1, iouReportAction);
            expect(Search_1.updateSearchResultsWithTransactionThreadReportID).toHaveBeenCalledWith(hash, transactionID, threadReportID);
            expect(Navigation_1.default.navigate).toHaveBeenCalledWith(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID: threadReportID, backTo: backTo }));
        });
        test('Should not load iou report if iouReportAction was provided', function () {
            SearchUIUtils.createAndOpenSearchTransactionThread(transactionListItem, iouReportAction, hash, backTo);
            expect(Report_1.openReport).not.toHaveBeenCalled();
        });
        test('Should load iou report if iouReportAction was not provided', function () {
            SearchUIUtils.createAndOpenSearchTransactionThread(transactionListItem, undefined, hash, backTo);
            expect(Report_1.openReport).toHaveBeenCalled();
        });
    });
});
