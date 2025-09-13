"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var react_native_1 = require("@testing-library/react-native");
var date_fns_1 = require("date-fns");
var fast_equals_1 = require("fast-equals");
var react_native_onyx_1 = require("react-native-onyx");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var useAncestorReportsAndReportActions_1 = require("@hooks/useAncestorReportsAndReportActions");
var useReportWithTransactionsAndViolations_1 = require("@hooks/useReportWithTransactionsAndViolations");
var IOU_1 = require("@libs/actions/IOU");
var OnyxDerived_1 = require("@libs/actions/OnyxDerived");
var Policy_1 = require("@libs/actions/Policy/Policy");
var Report_1 = require("@libs/actions/Report");
var ReportActions_1 = require("@libs/actions/ReportActions");
var User_1 = require("@libs/actions/User");
var types_1 = require("@libs/API/types");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Localize_1 = require("@libs/Localize");
var Navigation_1 = require("@libs/Navigation/Navigation");
var NumberUtils_1 = require("@libs/NumberUtils");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var CONST_1 = require("@src/CONST");
var IntlStore_1 = require("@src/languages/IntlStore");
var OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
var API = require("@src/libs/API");
var DateUtils_1 = require("@src/libs/DateUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var Transaction_1 = require("../../src/libs/actions/Transaction");
var InvoiceData = require("../data/Invoice");
var policies_1 = require("../utils/collections/policies");
var policyCategory_1 = require("../utils/collections/policyCategory");
var policyTags_1 = require("../utils/collections/policyTags");
var reports_1 = require("../utils/collections/reports");
var transaction_1 = require("../utils/collections/transaction");
var getOnyxValue_1 = require("../utils/getOnyxValue");
var PusherHelper_1 = require("../utils/PusherHelper");
var TestHelper_1 = require("../utils/TestHelper");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var waitForNetworkPromises_1 = require("../utils/waitForNetworkPromises");
var topMostReportID = '23423423';
jest.mock('@src/libs/Navigation/Navigation', function () { return ({
    navigate: jest.fn(),
    dismissModal: jest.fn(),
    dismissModalWithReport: jest.fn(),
    goBack: jest.fn(),
    getTopmostReportId: jest.fn(function () { return topMostReportID; }),
    setNavigationActionToMicrotaskQueue: jest.fn(),
    removeScreenByKey: jest.fn(),
    isNavigationReady: jest.fn(function () { return Promise.resolve(); }),
    getReportRouteByID: jest.fn(),
    getActiveRouteWithoutParams: jest.fn(),
    getActiveRoute: jest.fn(),
    navigationRef: {
        getRootState: jest.fn(),
    },
}); });
jest.mock('@react-navigation/native');
jest.mock('@src/libs/actions/Report', function () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    var originalModule = jest.requireActual('@src/libs/actions/Report');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return __assign(__assign({}, originalModule), { notifyNewAction: jest.fn() });
});
jest.mock('@libs/Navigation/helpers/isSearchTopmostFullScreenRoute', function () { return jest.fn(); });
jest.mock('@src/libs/SearchQueryUtils', function () { return ({
    getCurrentSearchQueryJSON: jest.fn().mockImplementation(function () { return ({
        hash: 12345,
        query: 'test',
        type: 'invoice',
        status: '',
        flatFilters: [],
    }); }),
    buildQueryStringFromFilterFormValues: jest.fn().mockImplementation(function () { return 'type:expense'; }),
    buildCannedSearchQuery: jest.fn(),
    buildSearchQueryJSON: jest.fn(),
}); });
var CARLOS_EMAIL = 'cmartins@expensifail.com';
var CARLOS_ACCOUNT_ID = 1;
var CARLOS_PARTICIPANT = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS, role: 'member' };
var JULES_EMAIL = 'jules@expensifail.com';
var JULES_ACCOUNT_ID = 2;
var JULES_PARTICIPANT = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS, role: 'member' };
var RORY_EMAIL = 'rory@expensifail.com';
var RORY_ACCOUNT_ID = 3;
var RORY_PARTICIPANT = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS, role: 'admin' };
var VIT_EMAIL = 'vit@expensifail.com';
var VIT_ACCOUNT_ID = 4;
var VIT_PARTICIPANT = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS, role: 'member' };
(0, OnyxUpdateManager_1.default)();
describe('actions/IOU', function () {
    beforeAll(function () {
        var _a, _b;
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            initialKeyStates: (_a = {},
                _a[ONYXKEYS_1.default.SESSION] = { accountID: RORY_ACCOUNT_ID, email: RORY_EMAIL },
                _a[ONYXKEYS_1.default.PERSONAL_DETAILS_LIST] = (_b = {}, _b[RORY_ACCOUNT_ID] = { accountID: RORY_ACCOUNT_ID, login: RORY_EMAIL }, _b),
                _a),
        });
        (0, OnyxDerived_1.default)();
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return (0, waitForBatchedUpdates_1.default)();
    });
    var mockFetch;
    beforeEach(function () {
        jest.clearAllTimers();
        global.fetch = (0, TestHelper_1.getGlobalFetchMock)();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    describe('trackExpense', function () {
        it('category a distance expense of selfDM report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var participant, fakeWayPoints, selfDMReport, policyExpenseChat, fakeCategories, fakePolicy, fakeTransaction, transaction, allReportActions, selfDMReportActions, reportActionableTrackExpense, allTransactionsDraft, transactionDraft;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        participant = { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID };
                        fakeWayPoints = {
                            waypoint0: {
                                keyForList: '88 Kearny Street_1735023533854',
                                lat: 37.7886378,
                                lng: -122.4033442,
                                address: '88 Kearny Street, San Francisco, CA, USA',
                                name: '88 Kearny Street',
                            },
                            waypoint1: {
                                keyForList: 'Golden Gate Bridge Vista Point_1735023537514',
                                lat: 37.8077876,
                                lng: -122.4752007,
                                address: 'Golden Gate Bridge Vista Point, San Francisco, CA, USA',
                                name: 'Golden Gate Bridge Vista Point',
                            },
                        };
                        selfDMReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM });
                        policyExpenseChat = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT });
                        fakeCategories = (0, policyCategory_1.default)(3);
                        fakePolicy = (0, policies_1.default)(1);
                        fakeTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.DISTANCE, comment: __assign(__assign({}, (0, transaction_1.default)(1).comment), { type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT, customUnit: {
                                    name: CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE,
                                }, waypoints: fakeWayPoints }) });
                        // When the transaction is saved to draft before being submitted
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(fakeTransaction.transactionID), fakeTransaction)];
                    case 1:
                        // When the transaction is saved to draft before being submitted
                        _l.sent();
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        // When the user submits the transaction to the selfDM report
                        (0, IOU_1.trackExpense)({
                            report: selfDMReport,
                            isDraftPolicy: true,
                            action: CONST_1.default.IOU.ACTION.CREATE,
                            participantParams: {
                                payeeEmail: participant.login,
                                payeeAccountID: participant.accountID,
                                participant: participant,
                            },
                            transactionParams: {
                                amount: fakeTransaction.amount,
                                currency: fakeTransaction.currency,
                                created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                                merchant: fakeTransaction.merchant,
                                billable: false,
                                validWaypoints: fakeWayPoints,
                                actionableWhisperReportActionID: fakeTransaction === null || fakeTransaction === void 0 ? void 0 : fakeTransaction.actionableWhisperReportActionID,
                                linkedTrackedExpenseReportAction: fakeTransaction === null || fakeTransaction === void 0 ? void 0 : fakeTransaction.linkedTrackedExpenseReportAction,
                                linkedTrackedExpenseReportID: fakeTransaction === null || fakeTransaction === void 0 ? void 0 : fakeTransaction.linkedTrackedExpenseReportID,
                                customUnitRateID: CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID,
                            },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _l.sent();
                        return [4 /*yield*/, ((_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch))];
                    case 3:
                        _l.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                    waitForCollectionCallback: true,
                                    callback: function (transactions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        var trackedExpenseTransaction = Object.values(transactions !== null && transactions !== void 0 ? transactions : {}).at(0);
                                        // Then the transaction must remain a distance request
                                        var isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(trackedExpenseTransaction);
                                        expect(isDistanceRequest).toBe(true);
                                        resolve(trackedExpenseTransaction);
                                    },
                                });
                            })];
                    case 4:
                        transaction = _l.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                                    waitForCollectionCallback: true,
                                    callback: function (reportActions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reportActions);
                                    },
                                });
                            })];
                    case 5:
                        allReportActions = _l.sent();
                        selfDMReportActions = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(selfDMReport.reportID)];
                        expect(Object.values(selfDMReportActions !== null && selfDMReportActions !== void 0 ? selfDMReportActions : {}).length).toBe(2);
                        // When the cache is cleared before categorizing the tracked expense
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID), {
                                iouRequestType: null,
                            })];
                    case 6:
                        // When the cache is cleared before categorizing the tracked expense
                        _l.sent();
                        reportActionableTrackExpense = Object.values(selfDMReportActions !== null && selfDMReportActions !== void 0 ? selfDMReportActions : {}).find(function (reportAction) { return (0, ReportActionsUtils_1.isActionableTrackExpense)(reportAction); });
                        (0, ReportUtils_1.createDraftTransactionAndNavigateToParticipantSelector)(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID, selfDMReport.reportID, CONST_1.default.IOU.ACTION.CATEGORIZE, reportActionableTrackExpense === null || reportActionableTrackExpense === void 0 ? void 0 : reportActionableTrackExpense.reportActionID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 7:
                        _l.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT,
                                    waitForCollectionCallback: true,
                                    callback: function (transactionDrafts) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(transactionDrafts);
                                    },
                                });
                            })];
                    case 8:
                        allTransactionsDraft = _l.sent();
                        transactionDraft = allTransactionsDraft === null || allTransactionsDraft === void 0 ? void 0 : allTransactionsDraft["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID)];
                        // When the user confirms the category for the tracked expense
                        (0, IOU_1.trackExpense)({
                            report: policyExpenseChat,
                            isDraftPolicy: false,
                            action: CONST_1.default.IOU.ACTION.CATEGORIZE,
                            participantParams: {
                                payeeEmail: participant.login,
                                payeeAccountID: participant.accountID,
                                participant: __assign(__assign({}, participant), { isPolicyExpenseChat: true }),
                            },
                            policyParams: {
                                policy: fakePolicy,
                                policyCategories: fakeCategories,
                            },
                            transactionParams: {
                                amount: (_c = transactionDraft === null || transactionDraft === void 0 ? void 0 : transactionDraft.amount) !== null && _c !== void 0 ? _c : fakeTransaction.amount,
                                currency: (_d = transactionDraft === null || transactionDraft === void 0 ? void 0 : transactionDraft.currency) !== null && _d !== void 0 ? _d : fakeTransaction.currency,
                                created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                                merchant: (_e = transactionDraft === null || transactionDraft === void 0 ? void 0 : transactionDraft.merchant) !== null && _e !== void 0 ? _e : fakeTransaction.merchant,
                                category: (_f = Object.keys(fakeCategories).at(0)) !== null && _f !== void 0 ? _f : '',
                                validWaypoints: Object.keys((_h = (_g = transactionDraft === null || transactionDraft === void 0 ? void 0 : transactionDraft.comment) === null || _g === void 0 ? void 0 : _g.waypoints) !== null && _h !== void 0 ? _h : {}).length ? (0, TransactionUtils_1.getValidWaypoints)((_j = transactionDraft === null || transactionDraft === void 0 ? void 0 : transactionDraft.comment) === null || _j === void 0 ? void 0 : _j.waypoints, true) : undefined,
                                actionableWhisperReportActionID: transactionDraft === null || transactionDraft === void 0 ? void 0 : transactionDraft.actionableWhisperReportActionID,
                                linkedTrackedExpenseReportAction: transactionDraft === null || transactionDraft === void 0 ? void 0 : transactionDraft.linkedTrackedExpenseReportAction,
                                linkedTrackedExpenseReportID: transactionDraft === null || transactionDraft === void 0 ? void 0 : transactionDraft.linkedTrackedExpenseReportID,
                                customUnitRateID: CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID,
                            },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 9:
                        _l.sent();
                        return [4 /*yield*/, ((_k = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _k === void 0 ? void 0 : _k.call(mockFetch))];
                    case 10:
                        _l.sent();
                        // Then the expense should be categorized successfully
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                    waitForCollectionCallback: true,
                                    callback: function (transactions) {
                                        var _a;
                                        react_native_onyx_1.default.disconnect(connection);
                                        var categorizedTransaction = transactions === null || transactions === void 0 ? void 0 : transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID)];
                                        // Then the transaction must remain a distance request, ensuring that the optimistic data is correctly built and the transaction type remains accurate.
                                        var isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(categorizedTransaction);
                                        expect(isDistanceRequest).toBe(true);
                                        // Then the transaction category must match the original category
                                        expect(categorizedTransaction === null || categorizedTransaction === void 0 ? void 0 : categorizedTransaction.category).toBe((_a = Object.keys(fakeCategories).at(0)) !== null && _a !== void 0 ? _a : '');
                                        resolve();
                                    },
                                });
                            })];
                    case 11:
                        // Then the expense should be categorized successfully
                        _l.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
                                    callback: function (quickAction) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve();
                                        // Then the quickAction.action should be set to REQUEST_DISTANCE
                                        expect(quickAction === null || quickAction === void 0 ? void 0 : quickAction.action).toBe(CONST_1.default.QUICK_ACTIONS.REQUEST_DISTANCE);
                                        // Then the quickAction.chatReportID should be set to the given policyExpenseChat reportID
                                        expect(quickAction === null || quickAction === void 0 ? void 0 : quickAction.chatReportID).toBe(policyExpenseChat.reportID);
                                    },
                                });
                            })];
                    case 12:
                        _l.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('share with accountant', function () { return __awaiter(void 0, void 0, void 0, function () {
            var accountant, policy, selfDMReport, policyExpenseChat, transaction, selfDMReportActionsOnyx, linkedTrackedExpenseReportAction, reportActionableTrackExpense, policyExpenseChatOnyx, policyOnyx;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        accountant = { login: VIT_EMAIL, accountID: VIT_ACCOUNT_ID };
                        policy = __assign(__assign({}, (0, policies_1.default)(1)), { id: 'ABC' });
                        selfDMReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { reportID: '10', chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM });
                        policyExpenseChat = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { reportID: '123', policyID: policy.id, type: CONST_1.default.REPORT.TYPE.CHAT, chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, isOwnPolicyExpenseChat: true });
                        transaction = __assign(__assign({}, (0, transaction_1.default)(1)), { transactionID: '555' });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policy.id), policy)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(policyExpenseChat.reportID), policyExpenseChat)];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transaction.transactionID), transaction)];
                    case 3:
                        _e.sent();
                        // Create a tracked expense
                        (0, IOU_1.trackExpense)({
                            report: selfDMReport,
                            isDraftPolicy: true,
                            action: CONST_1.default.IOU.ACTION.CREATE,
                            participantParams: {
                                payeeEmail: RORY_EMAIL,
                                payeeAccountID: RORY_ACCOUNT_ID,
                                participant: { accountID: RORY_ACCOUNT_ID },
                            },
                            transactionParams: {
                                amount: transaction.amount,
                                currency: transaction.currency,
                                created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                                merchant: transaction.merchant,
                                billable: false,
                            },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(selfDMReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (value) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(value);
                                    },
                                });
                            })];
                    case 5:
                        selfDMReportActionsOnyx = _e.sent();
                        expect(Object.values(selfDMReportActionsOnyx !== null && selfDMReportActionsOnyx !== void 0 ? selfDMReportActionsOnyx : {}).length).toBe(2);
                        linkedTrackedExpenseReportAction = Object.values(selfDMReportActionsOnyx !== null && selfDMReportActionsOnyx !== void 0 ? selfDMReportActionsOnyx : {}).find(function (reportAction) { return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction); });
                        reportActionableTrackExpense = Object.values(selfDMReportActionsOnyx !== null && selfDMReportActionsOnyx !== void 0 ? selfDMReportActionsOnyx : {}).find(function (reportAction) { return (0, ReportActionsUtils_1.isActionableTrackExpense)(reportAction); });
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        // Share the tracked expense with an accountant
                        (0, IOU_1.trackExpense)({
                            report: policyExpenseChat,
                            isDraftPolicy: false,
                            action: CONST_1.default.IOU.ACTION.SHARE,
                            participantParams: {
                                payeeEmail: RORY_EMAIL,
                                payeeAccountID: RORY_ACCOUNT_ID,
                                participant: { reportID: policyExpenseChat.reportID, isPolicyExpenseChat: true },
                            },
                            policyParams: {
                                policy: policy,
                            },
                            transactionParams: {
                                amount: transaction.amount,
                                currency: transaction.currency,
                                created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                                merchant: transaction.merchant,
                                billable: false,
                                actionableWhisperReportActionID: reportActionableTrackExpense === null || reportActionableTrackExpense === void 0 ? void 0 : reportActionableTrackExpense.reportActionID,
                                linkedTrackedExpenseReportAction: linkedTrackedExpenseReportAction,
                                linkedTrackedExpenseReportID: selfDMReport.reportID,
                            },
                            accountantParams: {
                                accountant: accountant,
                            },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(policyExpenseChat.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (value) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(value);
                                    },
                                });
                            })];
                    case 7:
                        policyExpenseChatOnyx = _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policy.id),
                                    waitForCollectionCallback: false,
                                    callback: function (value) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(value);
                                    },
                                });
                            })];
                    case 8:
                        policyOnyx = _e.sent();
                        return [4 /*yield*/, ((_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch))];
                    case 9:
                        _e.sent();
                        // Accountant should be invited to the expense report
                        expect((_c = policyExpenseChatOnyx === null || policyExpenseChatOnyx === void 0 ? void 0 : policyExpenseChatOnyx.participants) === null || _c === void 0 ? void 0 : _c[accountant.accountID]).toBeTruthy();
                        // Accountant should be added to the workspace as an admin
                        expect((_d = policyOnyx === null || policyOnyx === void 0 ? void 0 : policyOnyx.employeeList) === null || _d === void 0 ? void 0 : _d[accountant.login].role).toBe(CONST_1.default.POLICY.ROLE.ADMIN);
                        return [2 /*return*/];
                }
            });
        }); });
        it('share with accountant who is already a member', function () { return __awaiter(void 0, void 0, void 0, function () {
            var accountant, policy, selfDMReport, policyExpenseChat, transaction, selfDMReportActionsOnyx, linkedTrackedExpenseReportAction, reportActionableTrackExpense, policyExpenseChatOnyx, policyOnyx;
            var _a, _b, _c;
            var _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        accountant = { login: VIT_EMAIL, accountID: VIT_ACCOUNT_ID };
                        policy = __assign(__assign({}, (0, policies_1.default)(1)), { id: 'ABC', employeeList: (_a = {}, _a[accountant.login] = { email: accountant.login, role: CONST_1.default.POLICY.ROLE.USER }, _a) });
                        selfDMReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { reportID: '10', chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM });
                        policyExpenseChat = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { reportID: '123', policyID: policy.id, type: CONST_1.default.REPORT.TYPE.CHAT, chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, isOwnPolicyExpenseChat: true, participants: (_b = {}, _b[accountant.accountID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS }, _b) });
                        transaction = __assign(__assign({}, (0, transaction_1.default)(1)), { transactionID: '555' });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policy.id), policy)];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(policyExpenseChat.reportID), policyExpenseChat)];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transaction.transactionID), transaction)];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, (_c = {}, _c[accountant.accountID] = accountant, _c))];
                    case 4:
                        _h.sent();
                        // Create a tracked expense
                        (0, IOU_1.trackExpense)({
                            report: selfDMReport,
                            isDraftPolicy: true,
                            action: CONST_1.default.IOU.ACTION.CREATE,
                            participantParams: {
                                payeeEmail: RORY_EMAIL,
                                payeeAccountID: RORY_ACCOUNT_ID,
                                participant: { accountID: RORY_ACCOUNT_ID },
                            },
                            transactionParams: {
                                amount: transaction.amount,
                                currency: transaction.currency,
                                created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                                merchant: transaction.merchant,
                                billable: false,
                            },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(selfDMReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (value) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(value);
                                    },
                                });
                            })];
                    case 6:
                        selfDMReportActionsOnyx = _h.sent();
                        expect(Object.values(selfDMReportActionsOnyx !== null && selfDMReportActionsOnyx !== void 0 ? selfDMReportActionsOnyx : {}).length).toBe(2);
                        linkedTrackedExpenseReportAction = Object.values(selfDMReportActionsOnyx !== null && selfDMReportActionsOnyx !== void 0 ? selfDMReportActionsOnyx : {}).find(function (reportAction) { return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction); });
                        reportActionableTrackExpense = Object.values(selfDMReportActionsOnyx !== null && selfDMReportActionsOnyx !== void 0 ? selfDMReportActionsOnyx : {}).find(function (reportAction) { return (0, ReportActionsUtils_1.isActionableTrackExpense)(reportAction); });
                        (_d = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _d === void 0 ? void 0 : _d.call(mockFetch);
                        // Share the tracked expense with an accountant
                        (0, IOU_1.trackExpense)({
                            report: policyExpenseChat,
                            isDraftPolicy: false,
                            action: CONST_1.default.IOU.ACTION.SHARE,
                            participantParams: {
                                payeeEmail: RORY_EMAIL,
                                payeeAccountID: RORY_ACCOUNT_ID,
                                participant: { reportID: policyExpenseChat.reportID, isPolicyExpenseChat: true },
                            },
                            policyParams: {
                                policy: policy,
                            },
                            transactionParams: {
                                amount: transaction.amount,
                                currency: transaction.currency,
                                created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                                merchant: transaction.merchant,
                                billable: false,
                                actionableWhisperReportActionID: reportActionableTrackExpense === null || reportActionableTrackExpense === void 0 ? void 0 : reportActionableTrackExpense.reportActionID,
                                linkedTrackedExpenseReportAction: linkedTrackedExpenseReportAction,
                                linkedTrackedExpenseReportID: selfDMReport.reportID,
                            },
                            accountantParams: {
                                accountant: accountant,
                            },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 7:
                        _h.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(policyExpenseChat.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (value) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(value);
                                    },
                                });
                            })];
                    case 8:
                        policyExpenseChatOnyx = _h.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policy.id),
                                    waitForCollectionCallback: false,
                                    callback: function (value) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(value);
                                    },
                                });
                            })];
                    case 9:
                        policyOnyx = _h.sent();
                        return [4 /*yield*/, ((_e = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _e === void 0 ? void 0 : _e.call(mockFetch))];
                    case 10:
                        _h.sent();
                        // Accountant should be still a participant in the expense report
                        expect((_f = policyExpenseChatOnyx === null || policyExpenseChatOnyx === void 0 ? void 0 : policyExpenseChatOnyx.participants) === null || _f === void 0 ? void 0 : _f[accountant.accountID]).toBeTruthy();
                        // Accountant role should change to admin
                        expect((_g = policyOnyx === null || policyOnyx === void 0 ? void 0 : policyOnyx.employeeList) === null || _g === void 0 ? void 0 : _g[accountant.login].role).toBe(CONST_1.default.POLICY.ROLE.ADMIN);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('requestMoney', function () {
        it('creates new chat if needed', function () {
            var _a;
            var amount = 10000;
            var comment = 'Giv money plz';
            var merchant = 'KFC';
            var iouReportID;
            var createdAction;
            var iouAction;
            var transactionID;
            var transactionThread;
            var transactionThreadCreatedAction;
            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
            (0, IOU_1.requestMoney)({
                report: { reportID: '' },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: amount,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: merchant,
                    comment: comment,
                },
                shouldGenerateTransactionThreadReport: true,
            });
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            var _a, _b;
                            react_native_onyx_1.default.disconnect(connection);
                            // A chat report, a transaction thread, and an iou report should be created
                            var chatReports = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).filter(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT; });
                            var iouReports = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).filter(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            expect(Object.keys(chatReports).length).toBe(2);
                            expect(Object.keys(iouReports).length).toBe(1);
                            var chatReport = chatReports.at(0);
                            var transactionThreadReport = chatReports.at(1);
                            var iouReport = iouReports.at(0);
                            iouReportID = iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID;
                            transactionThread = transactionThreadReport;
                            expect(iouReport === null || iouReport === void 0 ? void 0 : iouReport.participants).toEqual((_a = {},
                                _a[RORY_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                                _a[CARLOS_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                                _a));
                            // They should be linked together
                            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.participants).toEqual((_b = {}, _b[RORY_ACCOUNT_ID] = RORY_PARTICIPANT, _b[CARLOS_ACCOUNT_ID] = CARLOS_PARTICIPANT, _b));
                            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID).toBe(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_METADATA).concat(iouReportID),
                        callback: function (iouReportMetadata) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(iouReportMetadata === null || iouReportMetadata === void 0 ? void 0 : iouReportMetadata.isOptimisticReport).toBe(true);
                            expect(iouReportMetadata === null || iouReportMetadata === void 0 ? void 0 : iouReportMetadata.hasOnceLoadedReportActions).toBe(true);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForIOUReport) {
                            var _a, _b;
                            react_native_onyx_1.default.disconnect(connection);
                            // The IOU report should have a CREATED action and IOU action
                            expect(Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).length).toBe(2);
                            var createdActions = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).filter(function (reportAction) { return (reportAction === null || reportAction === void 0 ? void 0 : reportAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
                            var iouActions = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).filter(function (reportAction) { return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction); });
                            expect(Object.values(createdActions).length).toBe(1);
                            expect(Object.values(iouActions).length).toBe(1);
                            createdAction = createdActions === null || createdActions === void 0 ? void 0 : createdActions.at(0);
                            iouAction = iouActions === null || iouActions === void 0 ? void 0 : iouActions.at(0);
                            var originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(iouAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(iouAction) : undefined;
                            // The CREATED action should not be created after the IOU action
                            expect(Date.parse((_a = createdAction === null || createdAction === void 0 ? void 0 : createdAction.created) !== null && _a !== void 0 ? _a : '')).toBeLessThan(Date.parse((_b = iouAction === null || iouAction === void 0 ? void 0 : iouAction.created) !== null && _b !== void 0 ? _b : ''));
                            // The IOUReportID should be correct
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.IOUReportID).toBe(iouReportID);
                            // The comment should be included in the IOU action
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.comment).toBe(comment);
                            // The amount in the IOU action should be correct
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.amount).toBe(amount);
                            // The IOU type should be correct
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                            // Both actions should be pending
                            expect(createdAction === null || createdAction === void 0 ? void 0 : createdAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(iouAction === null || iouAction === void 0 ? void 0 : iouAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transactionThread === null || transactionThread === void 0 ? void 0 : transactionThread.reportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForTransactionThread) {
                            react_native_onyx_1.default.disconnect(connection);
                            // The transaction thread should have a CREATED action
                            expect(Object.values(reportActionsForTransactionThread !== null && reportActionsForTransactionThread !== void 0 ? reportActionsForTransactionThread : {}).length).toBe(1);
                            var createdActions = Object.values(reportActionsForTransactionThread !== null && reportActionsForTransactionThread !== void 0 ? reportActionsForTransactionThread : {}).filter(function (reportAction) { return (reportAction === null || reportAction === void 0 ? void 0 : reportAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
                            expect(Object.values(createdActions).length).toBe(1);
                            transactionThreadCreatedAction = createdActions.at(0);
                            expect(transactionThreadCreatedAction === null || transactionThreadCreatedAction === void 0 ? void 0 : transactionThreadCreatedAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                        waitForCollectionCallback: true,
                        callback: function (allTransactions) {
                            var _a, _b;
                            react_native_onyx_1.default.disconnect(connection);
                            // There should be one transaction
                            expect(Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).length).toBe(1);
                            var transaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : []).find(function (t) { return !(0, EmptyObject_1.isEmptyObject)(t); });
                            transactionID = transaction === null || transaction === void 0 ? void 0 : transaction.transactionID;
                            // The transaction should be attached to the IOU report
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.reportID).toBe(iouReportID);
                            // Its amount should match the amount of the expense
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.amount).toBe(amount);
                            // The comment should be correct
                            expect((_a = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _a === void 0 ? void 0 : _a.comment).toBe(comment);
                            // It should be pending
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            // The transactionID on the iou action should match the one from the transactions collection
                            expect(iouAction && ((_b = (0, ReportActionsUtils_1.getOriginalMessage)(iouAction)) === null || _b === void 0 ? void 0 : _b.IOUTransactionID)).toBe(transactionID);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.merchant).toBe(merchant);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.SNAPSHOT,
                        waitForCollectionCallback: true,
                        callback: function (snapshotData) {
                            react_native_onyx_1.default.disconnect(connection);
                            // Snapshot data shouldn't be updated optimistically for requestMoney when the current search query type is invoice.
                            expect(snapshotData).toBeUndefined();
                            resolve();
                        },
                    });
                });
            })
                .then(mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume)
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForIOUReport) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).length).toBe(2);
                            Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).forEach(function (reportAction) { return expect(reportAction === null || reportAction === void 0 ? void 0 : reportAction.pendingAction).toBeFalsy(); });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID),
                        waitForCollectionCallback: false,
                        callback: function (transaction) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction).toBeFalsy();
                            resolve();
                        },
                    });
                });
            });
        });
        it('updates existing chat report if there is one', function () {
            var _a;
            var _b;
            var amount = 10000;
            var comment = 'Giv money plz';
            var chatReport = {
                reportID: '1234',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: (_a = {}, _a[RORY_ACCOUNT_ID] = RORY_PARTICIPANT, _a[CARLOS_ACCOUNT_ID] = CARLOS_PARTICIPANT, _a),
            };
            var createdAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
            };
            var iouReportID;
            var iouAction;
            var iouCreatedAction;
            var transactionID;
            (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
            return react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReport.reportID), chatReport)
                .then(function () {
                var _a;
                return react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport.reportID), (_a = {},
                    _a[createdAction.reportActionID] = createdAction,
                    _a));
            })
                .then(function () {
                (0, IOU_1.requestMoney)({
                    report: chatReport,
                    participantParams: {
                        payeeEmail: RORY_EMAIL,
                        payeeAccountID: RORY_ACCOUNT_ID,
                        participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                    },
                    transactionParams: {
                        amount: amount,
                        attendees: [],
                        currency: CONST_1.default.CURRENCY.USD,
                        created: '',
                        merchant: '',
                        comment: comment,
                    },
                    shouldGenerateTransactionThreadReport: true,
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            var _a;
                            var _b, _c;
                            react_native_onyx_1.default.disconnect(connection);
                            // The same chat report should be reused, a transaction thread and an IOU report should be created
                            expect(Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).length).toBe(3);
                            expect((_b = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT; })) === null || _b === void 0 ? void 0 : _b.reportID).toBe(chatReport.reportID);
                            chatReport = (_c = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT; })) !== null && _c !== void 0 ? _c : chatReport;
                            var iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            iouReportID = iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID;
                            expect(iouReport === null || iouReport === void 0 ? void 0 : iouReport.participants).toEqual((_a = {},
                                _a[RORY_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                                _a[CARLOS_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                                _a));
                            // They should be linked together
                            expect(chatReport.iouReportID).toBe(iouReportID);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID),
                        waitForCollectionCallback: false,
                        callback: function (allIOUReportActions) {
                            var _a, _b;
                            react_native_onyx_1.default.disconnect(connection);
                            iouCreatedAction = Object.values(allIOUReportActions !== null && allIOUReportActions !== void 0 ? allIOUReportActions : {}).find(function (reportAction) { return reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
                            iouAction = Object.values(allIOUReportActions !== null && allIOUReportActions !== void 0 ? allIOUReportActions : {}).find(function (reportAction) {
                                return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                            });
                            var originalMessage = iouAction ? (0, ReportActionsUtils_1.getOriginalMessage)(iouAction) : null;
                            // The CREATED action should not be created after the IOU action
                            expect(Date.parse((_a = iouCreatedAction === null || iouCreatedAction === void 0 ? void 0 : iouCreatedAction.created) !== null && _a !== void 0 ? _a : '')).toBeLessThan(Date.parse((_b = iouAction === null || iouAction === void 0 ? void 0 : iouAction.created) !== null && _b !== void 0 ? _b : ''));
                            // The IOUReportID should be correct
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.IOUReportID).toBe(iouReportID);
                            // The comment should be included in the IOU action
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.comment).toBe(comment);
                            // The amount in the IOU action should be correct
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.amount).toBe(amount);
                            // The IOU action type should be correct
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                            // The IOU action should be pending
                            expect(iouAction === null || iouAction === void 0 ? void 0 : iouAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                        waitForCollectionCallback: true,
                        callback: function (allTransactions) {
                            var _a;
                            react_native_onyx_1.default.disconnect(connection);
                            // There should be one transaction
                            expect(Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).length).toBe(1);
                            var transaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (t) { return !(0, EmptyObject_1.isEmptyObject)(t); });
                            transactionID = transaction === null || transaction === void 0 ? void 0 : transaction.transactionID;
                            var originalMessage = iouAction ? (0, ReportActionsUtils_1.getOriginalMessage)(iouAction) : null;
                            // The transaction should be attached to the IOU report
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.reportID).toBe(iouReportID);
                            // Its amount should match the amount of the expense
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.amount).toBe(amount);
                            // The comment should be correct
                            expect((_a = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _a === void 0 ? void 0 : _a.comment).toBe(comment);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.merchant).toBe(CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT);
                            // It should be pending
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            // The transactionID on the iou action should match the one from the transactions collection
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.IOUTransactionID).toBe(transactionID);
                            resolve();
                        },
                    });
                });
            })
                .then(mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForIOUReport) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).length).toBe(2);
                            Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).forEach(function (reportAction) { return expect(reportAction === null || reportAction === void 0 ? void 0 : reportAction.pendingAction).toBeFalsy(); });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID),
                        callback: function (transaction) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction).toBeFalsy();
                            resolve();
                        },
                    });
                });
            });
        });
        it('updates existing IOU report if there is one', function () {
            var _a;
            var _b;
            var amount = 10000;
            var comment = 'Giv money plz';
            var chatReportID = '1234';
            var iouReportID = '5678';
            var chatReport = {
                reportID: chatReportID,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                iouReportID: iouReportID,
                participants: (_a = {}, _a[RORY_ACCOUNT_ID] = RORY_PARTICIPANT, _a[CARLOS_ACCOUNT_ID] = CARLOS_PARTICIPANT, _a),
            };
            var createdAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
            };
            var existingTransaction = {
                transactionID: (0, NumberUtils_1.rand64)(),
                amount: 1000,
                comment: {
                    comment: 'Existing transaction',
                    attendees: [{ email: 'text@expensify.com', displayName: 'Test User', avatarUrl: '' }],
                },
                created: DateUtils_1.default.getDBTime(),
                currency: CONST_1.default.CURRENCY.USD,
                merchant: '',
                reportID: '',
            };
            var iouReport = {
                reportID: iouReportID,
                chatReportID: chatReportID,
                type: CONST_1.default.REPORT.TYPE.IOU,
                ownerAccountID: RORY_ACCOUNT_ID,
                managerID: CARLOS_ACCOUNT_ID,
                currency: CONST_1.default.CURRENCY.USD,
                total: existingTransaction.amount,
            };
            var iouAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                actorAccountID: RORY_ACCOUNT_ID,
                created: DateUtils_1.default.getDBTime(),
                originalMessage: {
                    IOUReportID: iouReportID,
                    IOUTransactionID: existingTransaction.transactionID,
                    amount: existingTransaction.amount,
                    currency: CONST_1.default.CURRENCY.USD,
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                    participantAccountIDs: [RORY_ACCOUNT_ID, CARLOS_ACCOUNT_ID],
                },
            };
            var newIOUAction;
            var newTransaction;
            (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
            return react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReportID), chatReport)
                .then(function () { return react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReportID), iouReport !== null && iouReport !== void 0 ? iouReport : null); })
                .then(function () {
                var _a;
                return react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID), (_a = {},
                    _a[createdAction.reportActionID] = createdAction,
                    _a[iouAction.reportActionID] = iouAction,
                    _a));
            })
                .then(function () { return react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(existingTransaction.transactionID), existingTransaction); })
                .then(function () {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                        },
                        transactionParams: {
                            amount: amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant: '',
                            comment: comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            // No new reports should be created
                            expect(Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).length).toBe(3);
                            expect(Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.reportID) === chatReportID; })).toBeTruthy();
                            expect(Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.reportID) === iouReportID; })).toBeTruthy();
                            chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT; });
                            iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            // The total on the iou report should be updated
                            expect(iouReport === null || iouReport === void 0 ? void 0 : iouReport.total).toBe(11000);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForIOUReport) {
                            var _a;
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).length).toBe(3);
                            newIOUAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) {
                                return (reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportActionID) !== createdAction.reportActionID && (reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportActionID) !== (iouAction === null || iouAction === void 0 ? void 0 : iouAction.reportActionID);
                            });
                            var newOriginalMessage = newIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(newIOUAction) : null;
                            // The IOUReportID should be correct
                            expect((_a = (0, ReportActionsUtils_1.getOriginalMessage)(iouAction)) === null || _a === void 0 ? void 0 : _a.IOUReportID).toBe(iouReportID);
                            // The comment should be included in the IOU action
                            expect(newOriginalMessage === null || newOriginalMessage === void 0 ? void 0 : newOriginalMessage.comment).toBe(comment);
                            // The amount in the IOU action should be correct
                            expect(newOriginalMessage === null || newOriginalMessage === void 0 ? void 0 : newOriginalMessage.amount).toBe(amount);
                            // The type of the IOU action should be correct
                            expect(newOriginalMessage === null || newOriginalMessage === void 0 ? void 0 : newOriginalMessage.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                            // The IOU action should be pending
                            expect(newIOUAction === null || newIOUAction === void 0 ? void 0 : newIOUAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                        waitForCollectionCallback: true,
                        callback: function (allTransactions) {
                            var _a, _b;
                            react_native_onyx_1.default.disconnect(connection);
                            // There should be two transactions
                            expect(Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).length).toBe(2);
                            newTransaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (transaction) { return (transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) !== existingTransaction.transactionID; });
                            expect(newTransaction === null || newTransaction === void 0 ? void 0 : newTransaction.reportID).toBe(iouReportID);
                            expect(newTransaction === null || newTransaction === void 0 ? void 0 : newTransaction.amount).toBe(amount);
                            expect((_a = newTransaction === null || newTransaction === void 0 ? void 0 : newTransaction.comment) === null || _a === void 0 ? void 0 : _a.comment).toBe(comment);
                            expect(newTransaction === null || newTransaction === void 0 ? void 0 : newTransaction.merchant).toBe(CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT);
                            expect(newTransaction === null || newTransaction === void 0 ? void 0 : newTransaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            // The transactionID on the iou action should match the one from the transactions collection
                            expect((0, ReportActionsUtils_1.isMoneyRequestAction)(newIOUAction) ? (_b = (0, ReportActionsUtils_1.getOriginalMessage)(newIOUAction)) === null || _b === void 0 ? void 0 : _b.IOUTransactionID : undefined).toBe(newTransaction === null || newTransaction === void 0 ? void 0 : newTransaction.transactionID);
                            resolve();
                        },
                    });
                });
            })
                .then(mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume)
                .then(waitForNetworkPromises_1.default)
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForIOUReport) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).length).toBe(3);
                            Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).forEach(function (reportAction) { return expect(reportAction === null || reportAction === void 0 ? void 0 : reportAction.pendingAction).toBeFalsy(); });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                        waitForCollectionCallback: true,
                        callback: function (allTransactions) {
                            react_native_onyx_1.default.disconnect(connection);
                            Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).forEach(function (transaction) { return expect(transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction).toBeFalsy(); });
                            resolve();
                        },
                    });
                });
            });
        });
        it('correctly implements RedBrickRoad error handling', function () {
            var _a;
            var amount = 10000;
            var comment = 'Giv money plz';
            var chatReportID;
            var iouReportID;
            var createdAction;
            var iouAction;
            var transactionID;
            var transactionThreadReport;
            var transactionThreadAction;
            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
            (0, IOU_1.requestMoney)({
                report: { reportID: '' },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: amount,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: comment,
                },
                shouldGenerateTransactionThreadReport: true,
            });
            return ((0, waitForBatchedUpdates_1.default)()
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            var _a, _b;
                            react_native_onyx_1.default.disconnect(connection);
                            // A chat report, transaction thread and an iou report should be created
                            var chatReports = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).filter(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT; });
                            var iouReports = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).filter(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            expect(Object.values(chatReports).length).toBe(2);
                            expect(Object.values(iouReports).length).toBe(1);
                            var chatReport = chatReports.at(0);
                            chatReportID = chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID;
                            transactionThreadReport = chatReports.at(1);
                            var iouReport = iouReports.at(0);
                            iouReportID = iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID;
                            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.participants).toStrictEqual((_a = {}, _a[RORY_ACCOUNT_ID] = RORY_PARTICIPANT, _a[CARLOS_ACCOUNT_ID] = CARLOS_PARTICIPANT, _a));
                            // They should be linked together
                            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.participants).toStrictEqual((_b = {}, _b[RORY_ACCOUNT_ID] = RORY_PARTICIPANT, _b[CARLOS_ACCOUNT_ID] = CARLOS_PARTICIPANT, _b));
                            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID).toBe(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForIOUReport) {
                            var _a, _b, _c, _d;
                            react_native_onyx_1.default.disconnect(connection);
                            // The chat report should have a CREATED action and IOU action
                            expect(Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).length).toBe(2);
                            var createdActions = (_a = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).filter(function (reportAction) { return (reportAction === null || reportAction === void 0 ? void 0 : reportAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; })) !== null && _a !== void 0 ? _a : null;
                            var iouActions = (_b = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).filter(function (reportAction) {
                                return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                            })) !== null && _b !== void 0 ? _b : null;
                            expect(Object.values(createdActions).length).toBe(1);
                            expect(Object.values(iouActions).length).toBe(1);
                            createdAction = createdActions.at(0);
                            iouAction = iouActions.at(0);
                            var originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(iouAction);
                            // The CREATED action should not be created after the IOU action
                            expect(Date.parse((_c = createdAction === null || createdAction === void 0 ? void 0 : createdAction.created) !== null && _c !== void 0 ? _c : '')).toBeLessThan(Date.parse((_d = iouAction === null || iouAction === void 0 ? void 0 : iouAction.created) !== null && _d !== void 0 ? _d : ''));
                            // The IOUReportID should be correct
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.IOUReportID).toBe(iouReportID);
                            // The comment should be included in the IOU action
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.comment).toBe(comment);
                            // The amount in the IOU action should be correct
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.amount).toBe(amount);
                            // The type should be correct
                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                            // Both actions should be pending
                            expect(createdAction === null || createdAction === void 0 ? void 0 : createdAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(iouAction === null || iouAction === void 0 ? void 0 : iouAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                        waitForCollectionCallback: true,
                        callback: function (allTransactions) {
                            var _a, _b;
                            react_native_onyx_1.default.disconnect(connection);
                            // There should be one transaction
                            expect(Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).length).toBe(1);
                            var transaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (t) { return !(0, EmptyObject_1.isEmptyObject)(t); });
                            transactionID = transaction === null || transaction === void 0 ? void 0 : transaction.transactionID;
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.reportID).toBe(iouReportID);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.amount).toBe(amount);
                            expect((_a = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _a === void 0 ? void 0 : _a.comment).toBe(comment);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.merchant).toBe(CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            // The transactionID on the iou action should match the one from the transactions collection
                            expect(iouAction && ((_b = (0, ReportActionsUtils_1.getOriginalMessage)(iouAction)) === null || _b === void 0 ? void 0 : _b.IOUTransactionID)).toBe(transactionID);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                var _a, _b;
                (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.fail) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                return (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForIOUReport) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).length).toBe(2);
                            iouAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) {
                                return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                            });
                            expect(iouAction === null || iouAction === void 0 ? void 0 : iouAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                        waitForCollectionCallback: true,
                        callback: function (reportActionsForTransactionThread) {
                            var _a;
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(reportActionsForTransactionThread !== null && reportActionsForTransactionThread !== void 0 ? reportActionsForTransactionThread : {}).length).toBe(3);
                            transactionThreadAction = Object.values((_a = reportActionsForTransactionThread === null || reportActionsForTransactionThread === void 0 ? void 0 : reportActionsForTransactionThread["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transactionThreadReport === null || transactionThreadReport === void 0 ? void 0 : transactionThreadReport.reportID)]) !== null && _a !== void 0 ? _a : {}).find(function (reportAction) { return reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
                            expect(transactionThreadAction === null || transactionThreadAction === void 0 ? void 0 : transactionThreadAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID),
                        waitForCollectionCallback: false,
                        callback: function (transaction) {
                            var _a;
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.errors).toBeTruthy();
                            expect(Object.values((_a = transaction === null || transaction === void 0 ? void 0 : transaction.errors) !== null && _a !== void 0 ? _a : {}).at(0)).toEqual((0, Localize_1.translateLocal)('iou.error.genericCreateFailureMessage'));
                            resolve();
                        },
                    });
                });
            })
                // If the user clears the errors on the IOU action
                .then(function () {
                return new Promise(function (resolve) {
                    if (iouReportID) {
                        (0, ReportActions_1.clearAllRelatedReportActionErrors)(iouReportID, iouAction !== null && iouAction !== void 0 ? iouAction : null);
                    }
                    resolve();
                });
            })
                // Then the reportAction from chat report should be removed from Onyx
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForReport) {
                            react_native_onyx_1.default.disconnect(connection);
                            iouAction = Object.values(reportActionsForReport !== null && reportActionsForReport !== void 0 ? reportActionsForReport : {}).find(function (reportAction) {
                                return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                            });
                            expect(iouAction).toBeFalsy();
                            resolve();
                        },
                    });
                });
            })
                // Then the reportAction from iou report should be removed from Onyx
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForReport) {
                            react_native_onyx_1.default.disconnect(connection);
                            iouAction = Object.values(reportActionsForReport !== null && reportActionsForReport !== void 0 ? reportActionsForReport : {}).find(function (reportAction) {
                                return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                            });
                            expect(iouAction).toBeFalsy();
                            resolve();
                        },
                    });
                });
            })
                // Then the reportAction from transaction report should be removed from Onyx
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transactionThreadReport === null || transactionThreadReport === void 0 ? void 0 : transactionThreadReport.reportID),
                        waitForCollectionCallback: false,
                        callback: function (reportActionsForReport) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(reportActionsForReport).toMatchObject({});
                            resolve();
                        },
                    });
                });
            })
                // Along with the associated transaction
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID),
                        waitForCollectionCallback: false,
                        callback: function (transaction) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction).toBeFalsy();
                            resolve();
                        },
                    });
                });
            })
                // If a user clears the errors on the CREATED action (which, technically are just errors on the report)
                .then(function () {
                return new Promise(function (resolve) {
                    if (chatReportID) {
                        (0, Report_1.deleteReport)(chatReportID);
                    }
                    if (transactionThreadReport === null || transactionThreadReport === void 0 ? void 0 : transactionThreadReport.reportID) {
                        (0, Report_1.deleteReport)(transactionThreadReport === null || transactionThreadReport === void 0 ? void 0 : transactionThreadReport.reportID);
                    }
                    resolve();
                });
            })
                // Then the report should be deleted
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).forEach(function (report) { return expect(report).toBeFalsy(); });
                            resolve();
                        },
                    });
                });
            })
                // All reportActions should also be deleted
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                        waitForCollectionCallback: false,
                        callback: function (allReportActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            Object.values(allReportActions !== null && allReportActions !== void 0 ? allReportActions : {}).forEach(function (reportAction) { return expect(reportAction).toBeFalsy(); });
                            resolve();
                        },
                    });
                });
            })
                // All transactions should also be deleted
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                        waitForCollectionCallback: true,
                        callback: function (allTransactions) {
                            react_native_onyx_1.default.disconnect(connection);
                            Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).forEach(function (transaction) { return expect(transaction).toBeFalsy(); });
                            resolve();
                        },
                    });
                });
            })
                // Cleanup
                .then(mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.succeed));
        });
        it('does not trigger notifyNewAction when doing the money request in a money request report', function () {
            (0, IOU_1.requestMoney)({
                report: { reportID: '123', type: CONST_1.default.REPORT.TYPE.EXPENSE },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: 1,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: '',
                },
                shouldGenerateTransactionThreadReport: true,
            });
            expect(Report_1.notifyNewAction).toHaveBeenCalledTimes(0);
        });
        it('trigger notifyNewAction when doing the money request in a chat report', function () {
            (0, IOU_1.requestMoney)({
                report: { reportID: '123' },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: 1,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: '',
                },
                shouldGenerateTransactionThreadReport: true,
            });
            expect(Navigation_1.default.setNavigationActionToMicrotaskQueue).toHaveBeenCalledTimes(1);
        });
    });
    describe('createDistanceRequest', function () {
        it('does not trigger notifyNewAction when doing the money request in a money request report', function () {
            (0, IOU_1.createDistanceRequest)({
                report: { reportID: '123', type: CONST_1.default.REPORT.TYPE.EXPENSE },
                participants: [],
                transactionParams: {
                    amount: 1,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: '',
                    validWaypoints: {},
                },
            });
            expect(Report_1.notifyNewAction).toHaveBeenCalledTimes(0);
        });
        it('trigger notifyNewAction when doing the money request in a chat report', function () {
            (0, IOU_1.createDistanceRequest)({
                report: { reportID: '123' },
                participants: [],
                transactionParams: {
                    amount: 1,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: '',
                    validWaypoints: {},
                },
            });
            expect(Report_1.notifyNewAction).toHaveBeenCalledTimes(1);
        });
    });
    describe('split expense', function () {
        it('creates and updates new chats and IOUs as needed', function () {
            var _a, _b, _c, _d, _e;
            var _f;
            jest.setTimeout(10 * 1000);
            /*
             * Given that:
             *   - Rory and Carlos have chatted before
             *   - Rory and Jules have chatted before and have an active IOU report
             *   - Rory and Vit have never chatted together before
             *   - There is no existing group chat with the four of them
             */
            var amount = 400;
            var comment = 'Yes, I am splitting a bill for $4 USD';
            var merchant = 'Yema Kitchen';
            var carlosChatReport = {
                reportID: (0, NumberUtils_1.rand64)(),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: (_a = {}, _a[RORY_ACCOUNT_ID] = RORY_PARTICIPANT, _a[CARLOS_ACCOUNT_ID] = CARLOS_PARTICIPANT, _a),
            };
            var carlosCreatedAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
                reportID: carlosChatReport.reportID,
            };
            var julesIOUReportID = (0, NumberUtils_1.rand64)();
            var julesChatReport = {
                reportID: (0, NumberUtils_1.rand64)(),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                iouReportID: julesIOUReportID,
                participants: (_b = {}, _b[RORY_ACCOUNT_ID] = RORY_PARTICIPANT, _b[JULES_ACCOUNT_ID] = JULES_PARTICIPANT, _b),
            };
            var julesChatCreatedAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
                reportID: julesChatReport.reportID,
            };
            var julesCreatedAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
                reportID: julesIOUReportID,
            };
            jest.advanceTimersByTime(200);
            var julesExistingTransaction = {
                transactionID: (0, NumberUtils_1.rand64)(),
                amount: 1000,
                comment: {
                    comment: 'This is an existing transaction',
                    attendees: [{ email: 'text@expensify.com', displayName: 'Test User', avatarUrl: '' }],
                },
                created: DateUtils_1.default.getDBTime(),
                currency: '',
                merchant: '',
                reportID: '',
            };
            var julesIOUReport = {
                reportID: julesIOUReportID,
                chatReportID: julesChatReport.reportID,
                type: CONST_1.default.REPORT.TYPE.IOU,
                ownerAccountID: RORY_ACCOUNT_ID,
                managerID: JULES_ACCOUNT_ID,
                currency: CONST_1.default.CURRENCY.USD,
                total: julesExistingTransaction === null || julesExistingTransaction === void 0 ? void 0 : julesExistingTransaction.amount,
            };
            var julesExistingIOUAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                actorAccountID: RORY_ACCOUNT_ID,
                created: DateUtils_1.default.getDBTime(),
                originalMessage: {
                    IOUReportID: julesIOUReportID,
                    IOUTransactionID: julesExistingTransaction === null || julesExistingTransaction === void 0 ? void 0 : julesExistingTransaction.transactionID,
                    amount: (_f = julesExistingTransaction === null || julesExistingTransaction === void 0 ? void 0 : julesExistingTransaction.amount) !== null && _f !== void 0 ? _f : 0,
                    currency: CONST_1.default.CURRENCY.USD,
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                    participantAccountIDs: [RORY_ACCOUNT_ID, JULES_ACCOUNT_ID],
                },
                reportID: julesIOUReportID,
            };
            var carlosIOUReport;
            var carlosIOUAction;
            var carlosIOUCreatedAction;
            var carlosTransaction;
            var julesIOUAction;
            var julesIOUCreatedAction;
            var julesTransaction;
            var vitChatReport;
            var vitIOUReport;
            var vitCreatedAction;
            var vitIOUAction;
            var vitTransaction;
            var groupChat;
            var groupCreatedAction;
            var groupIOUAction;
            var groupTransaction;
            var reportCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT, [carlosChatReport, julesChatReport, julesIOUReport], function (item) { return item.reportID; });
            var carlosActionsCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS), [
                (_c = {},
                    _c[carlosCreatedAction.reportActionID] = carlosCreatedAction,
                    _c),
            ], function (item) { return item[carlosCreatedAction.reportActionID].reportID; });
            var julesActionsCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS), [
                (_d = {},
                    _d[julesCreatedAction.reportActionID] = julesCreatedAction,
                    _d[julesExistingIOUAction.reportActionID] = julesExistingIOUAction,
                    _d),
            ], function (item) { return item[julesCreatedAction.reportActionID].reportID; });
            var julesCreatedActionsCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS), [
                (_e = {},
                    _e[julesChatCreatedAction.reportActionID] = julesChatCreatedAction,
                    _e),
            ], function (item) { return item[julesChatCreatedAction.reportActionID].reportID; });
            return react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT, __assign({}, reportCollectionDataSet))
                .then(function () {
                return react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, __assign(__assign(__assign({}, carlosActionsCollectionDataSet), julesCreatedActionsCollectionDataSet), julesActionsCollectionDataSet));
            })
                .then(function () { return react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(julesExistingTransaction === null || julesExistingTransaction === void 0 ? void 0 : julesExistingTransaction.transactionID), julesExistingTransaction); })
                .then(function () {
                var _a;
                // When we split a bill offline
                (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                (0, IOU_1.splitBill)(
                // TODO: Migrate after the backend accepts accountIDs
                {
                    participants: [
                        [CARLOS_EMAIL, String(CARLOS_ACCOUNT_ID)],
                        [JULES_EMAIL, String(JULES_ACCOUNT_ID)],
                        [VIT_EMAIL, String(VIT_ACCOUNT_ID)],
                    ].map(function (_a) {
                        var email = _a[0], accountID = _a[1];
                        return ({ login: email, accountID: Number(accountID) });
                    }),
                    currentUserLogin: RORY_EMAIL,
                    currentUserAccountID: RORY_ACCOUNT_ID,
                    amount: amount,
                    comment: comment,
                    currency: CONST_1.default.CURRENCY.USD,
                    merchant: merchant,
                    created: '',
                    tag: '',
                    existingSplitChatReportID: '',
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            var _a, _b;
                            react_native_onyx_1.default.disconnect(connection);
                            // There should now be 10 reports
                            expect(Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).length).toBe(10);
                            // 1. The chat report with Rory + Carlos
                            carlosChatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.reportID) === (carlosChatReport === null || carlosChatReport === void 0 ? void 0 : carlosChatReport.reportID); });
                            expect((0, EmptyObject_1.isEmptyObject)(carlosChatReport)).toBe(false);
                            expect(carlosChatReport === null || carlosChatReport === void 0 ? void 0 : carlosChatReport.pendingFields).toBeFalsy();
                            // 2. The IOU report with Rory + Carlos (new)
                            carlosIOUReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU && report.managerID === CARLOS_ACCOUNT_ID; });
                            expect((0, EmptyObject_1.isEmptyObject)(carlosIOUReport)).toBe(false);
                            expect(carlosIOUReport === null || carlosIOUReport === void 0 ? void 0 : carlosIOUReport.total).toBe(amount / 4);
                            // 3. The chat report with Rory + Jules
                            julesChatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.reportID) === (julesChatReport === null || julesChatReport === void 0 ? void 0 : julesChatReport.reportID); });
                            expect((0, EmptyObject_1.isEmptyObject)(julesChatReport)).toBe(false);
                            expect(julesChatReport === null || julesChatReport === void 0 ? void 0 : julesChatReport.pendingFields).toBeFalsy();
                            // 4. The IOU report with Rory + Jules
                            julesIOUReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.reportID) === (julesIOUReport === null || julesIOUReport === void 0 ? void 0 : julesIOUReport.reportID); });
                            expect((0, EmptyObject_1.isEmptyObject)(julesIOUReport)).toBe(false);
                            expect(julesChatReport === null || julesChatReport === void 0 ? void 0 : julesChatReport.pendingFields).toBeFalsy();
                            expect(julesIOUReport === null || julesIOUReport === void 0 ? void 0 : julesIOUReport.total).toBe(((_a = julesExistingTransaction === null || julesExistingTransaction === void 0 ? void 0 : julesExistingTransaction.amount) !== null && _a !== void 0 ? _a : 0) + amount / 4);
                            // 5. The chat report with Rory + Vit (new)
                            vitChatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) {
                                var _a;
                                return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT &&
                                    (0, fast_equals_1.deepEqual)(report.participants, (_a = {}, _a[RORY_ACCOUNT_ID] = RORY_PARTICIPANT, _a[VIT_ACCOUNT_ID] = VIT_PARTICIPANT, _a));
                            });
                            expect((0, EmptyObject_1.isEmptyObject)(vitChatReport)).toBe(false);
                            expect(vitChatReport === null || vitChatReport === void 0 ? void 0 : vitChatReport.pendingFields).toStrictEqual({ createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD });
                            // 6. The IOU report with Rory + Vit (new)
                            vitIOUReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU && report.managerID === VIT_ACCOUNT_ID; });
                            expect((0, EmptyObject_1.isEmptyObject)(vitIOUReport)).toBe(false);
                            expect(vitIOUReport === null || vitIOUReport === void 0 ? void 0 : vitIOUReport.total).toBe(amount / 4);
                            // 7. The group chat with everyone
                            groupChat = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) {
                                var _a;
                                return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT &&
                                    (0, fast_equals_1.deepEqual)(report.participants, (_a = {},
                                        _a[CARLOS_ACCOUNT_ID] = CARLOS_PARTICIPANT,
                                        _a[JULES_ACCOUNT_ID] = JULES_PARTICIPANT,
                                        _a[VIT_ACCOUNT_ID] = VIT_PARTICIPANT,
                                        _a[RORY_ACCOUNT_ID] = RORY_PARTICIPANT,
                                        _a));
                            });
                            expect((0, EmptyObject_1.isEmptyObject)(groupChat)).toBe(false);
                            expect(groupChat === null || groupChat === void 0 ? void 0 : groupChat.pendingFields).toStrictEqual({ createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD });
                            // The 1:1 chat reports and the IOU reports should be linked together
                            expect(carlosChatReport === null || carlosChatReport === void 0 ? void 0 : carlosChatReport.iouReportID).toBe(carlosIOUReport === null || carlosIOUReport === void 0 ? void 0 : carlosIOUReport.reportID);
                            expect(carlosIOUReport === null || carlosIOUReport === void 0 ? void 0 : carlosIOUReport.chatReportID).toBe(carlosChatReport === null || carlosChatReport === void 0 ? void 0 : carlosChatReport.reportID);
                            Object.values((_b = carlosIOUReport === null || carlosIOUReport === void 0 ? void 0 : carlosIOUReport.participants) !== null && _b !== void 0 ? _b : {}).forEach(function (participant) {
                                expect(participant.notificationPreference).toBe(CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN);
                            });
                            expect(julesChatReport === null || julesChatReport === void 0 ? void 0 : julesChatReport.iouReportID).toBe(julesIOUReport === null || julesIOUReport === void 0 ? void 0 : julesIOUReport.reportID);
                            expect(julesIOUReport === null || julesIOUReport === void 0 ? void 0 : julesIOUReport.chatReportID).toBe(julesChatReport === null || julesChatReport === void 0 ? void 0 : julesChatReport.reportID);
                            expect(vitChatReport === null || vitChatReport === void 0 ? void 0 : vitChatReport.iouReportID).toBe(vitIOUReport === null || vitIOUReport === void 0 ? void 0 : vitIOUReport.reportID);
                            expect(vitIOUReport === null || vitIOUReport === void 0 ? void 0 : vitIOUReport.chatReportID).toBe(vitChatReport === null || vitChatReport === void 0 ? void 0 : vitChatReport.reportID);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                        waitForCollectionCallback: true,
                        callback: function (allReportActions) {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            react_native_onyx_1.default.disconnect(connection);
                            // There should be reportActions on all 7 chat reports + 3 IOU reports in each 1:1 chat
                            expect(Object.values(allReportActions !== null && allReportActions !== void 0 ? allReportActions : {}).length).toBe(10);
                            var carlosReportActions = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(carlosChatReport === null || carlosChatReport === void 0 ? void 0 : carlosChatReport.iouReportID)];
                            var julesReportActions = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(julesChatReport === null || julesChatReport === void 0 ? void 0 : julesChatReport.iouReportID)];
                            var vitReportActions = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(vitChatReport === null || vitChatReport === void 0 ? void 0 : vitChatReport.iouReportID)];
                            var groupReportActions = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(groupChat === null || groupChat === void 0 ? void 0 : groupChat.reportID)];
                            // Carlos DM should have two reportActions – the existing CREATED action and a pending IOU action
                            expect(Object.values(carlosReportActions !== null && carlosReportActions !== void 0 ? carlosReportActions : {}).length).toBe(2);
                            carlosIOUCreatedAction = Object.values(carlosReportActions !== null && carlosReportActions !== void 0 ? carlosReportActions : {}).find(function (reportAction) { return reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
                            carlosIOUAction = Object.values(carlosReportActions !== null && carlosReportActions !== void 0 ? carlosReportActions : {}).find(function (reportAction) {
                                return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                            });
                            var carlosOriginalMessage = carlosIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(carlosIOUAction) : undefined;
                            expect(carlosIOUAction === null || carlosIOUAction === void 0 ? void 0 : carlosIOUAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(carlosOriginalMessage === null || carlosOriginalMessage === void 0 ? void 0 : carlosOriginalMessage.IOUReportID).toBe(carlosIOUReport === null || carlosIOUReport === void 0 ? void 0 : carlosIOUReport.reportID);
                            expect(carlosOriginalMessage === null || carlosOriginalMessage === void 0 ? void 0 : carlosOriginalMessage.amount).toBe(amount / 4);
                            expect(carlosOriginalMessage === null || carlosOriginalMessage === void 0 ? void 0 : carlosOriginalMessage.comment).toBe(comment);
                            expect(carlosOriginalMessage === null || carlosOriginalMessage === void 0 ? void 0 : carlosOriginalMessage.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                            expect(Date.parse((_a = carlosIOUCreatedAction === null || carlosIOUCreatedAction === void 0 ? void 0 : carlosIOUCreatedAction.created) !== null && _a !== void 0 ? _a : '')).toBeLessThan(Date.parse((_b = carlosIOUAction === null || carlosIOUAction === void 0 ? void 0 : carlosIOUAction.created) !== null && _b !== void 0 ? _b : ''));
                            // Jules DM should have three reportActions, the existing CREATED action, the existing IOU action, and a new pending IOU action
                            expect(Object.values(julesReportActions !== null && julesReportActions !== void 0 ? julesReportActions : {}).length).toBe(3);
                            expect(julesReportActions === null || julesReportActions === void 0 ? void 0 : julesReportActions[julesCreatedAction.reportActionID]).toStrictEqual(julesCreatedAction);
                            julesIOUCreatedAction = Object.values(julesReportActions !== null && julesReportActions !== void 0 ? julesReportActions : {}).find(function (reportAction) { return reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
                            julesIOUAction = Object.values(julesReportActions !== null && julesReportActions !== void 0 ? julesReportActions : {}).find(function (reportAction) {
                                return reportAction.reportActionID !== julesCreatedAction.reportActionID && reportAction.reportActionID !== julesExistingIOUAction.reportActionID;
                            });
                            var julesOriginalMessage = julesIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(julesIOUAction) : undefined;
                            expect(julesIOUAction === null || julesIOUAction === void 0 ? void 0 : julesIOUAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(julesOriginalMessage === null || julesOriginalMessage === void 0 ? void 0 : julesOriginalMessage.IOUReportID).toBe(julesIOUReport === null || julesIOUReport === void 0 ? void 0 : julesIOUReport.reportID);
                            expect(julesOriginalMessage === null || julesOriginalMessage === void 0 ? void 0 : julesOriginalMessage.amount).toBe(amount / 4);
                            expect(julesOriginalMessage === null || julesOriginalMessage === void 0 ? void 0 : julesOriginalMessage.comment).toBe(comment);
                            expect(julesOriginalMessage === null || julesOriginalMessage === void 0 ? void 0 : julesOriginalMessage.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                            expect(Date.parse((_c = julesIOUCreatedAction === null || julesIOUCreatedAction === void 0 ? void 0 : julesIOUCreatedAction.created) !== null && _c !== void 0 ? _c : '')).toBeLessThan(Date.parse((_d = julesIOUAction === null || julesIOUAction === void 0 ? void 0 : julesIOUAction.created) !== null && _d !== void 0 ? _d : ''));
                            // Vit DM should have two reportActions – a pending CREATED action and a pending IOU action
                            expect(Object.values(vitReportActions !== null && vitReportActions !== void 0 ? vitReportActions : {}).length).toBe(2);
                            vitCreatedAction = Object.values(vitReportActions !== null && vitReportActions !== void 0 ? vitReportActions : {}).find(function (reportAction) { return reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
                            vitIOUAction = Object.values(vitReportActions !== null && vitReportActions !== void 0 ? vitReportActions : {}).find(function (reportAction) {
                                return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                            });
                            var vitOriginalMessage = vitIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(vitIOUAction) : undefined;
                            expect(vitCreatedAction === null || vitCreatedAction === void 0 ? void 0 : vitCreatedAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(vitIOUAction === null || vitIOUAction === void 0 ? void 0 : vitIOUAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(vitOriginalMessage === null || vitOriginalMessage === void 0 ? void 0 : vitOriginalMessage.IOUReportID).toBe(vitIOUReport === null || vitIOUReport === void 0 ? void 0 : vitIOUReport.reportID);
                            expect(vitOriginalMessage === null || vitOriginalMessage === void 0 ? void 0 : vitOriginalMessage.amount).toBe(amount / 4);
                            expect(vitOriginalMessage === null || vitOriginalMessage === void 0 ? void 0 : vitOriginalMessage.comment).toBe(comment);
                            expect(vitOriginalMessage === null || vitOriginalMessage === void 0 ? void 0 : vitOriginalMessage.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                            expect(Date.parse((_e = vitCreatedAction === null || vitCreatedAction === void 0 ? void 0 : vitCreatedAction.created) !== null && _e !== void 0 ? _e : '')).toBeLessThan(Date.parse((_f = vitIOUAction === null || vitIOUAction === void 0 ? void 0 : vitIOUAction.created) !== null && _f !== void 0 ? _f : ''));
                            // Group chat should have two reportActions – a pending CREATED action and a pending IOU action w/ type SPLIT
                            expect(Object.values(groupReportActions !== null && groupReportActions !== void 0 ? groupReportActions : {}).length).toBe(2);
                            groupCreatedAction = Object.values(groupReportActions !== null && groupReportActions !== void 0 ? groupReportActions : {}).find(function (reportAction) { return reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
                            groupIOUAction = Object.values(groupReportActions !== null && groupReportActions !== void 0 ? groupReportActions : {}).find(function (reportAction) {
                                return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                            });
                            var groupOriginalMessage = groupIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(groupIOUAction) : undefined;
                            expect(groupCreatedAction === null || groupCreatedAction === void 0 ? void 0 : groupCreatedAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(groupIOUAction === null || groupIOUAction === void 0 ? void 0 : groupIOUAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(groupOriginalMessage).not.toHaveProperty('IOUReportID');
                            expect(groupOriginalMessage === null || groupOriginalMessage === void 0 ? void 0 : groupOriginalMessage.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT);
                            expect(Date.parse((_g = groupCreatedAction === null || groupCreatedAction === void 0 ? void 0 : groupCreatedAction.created) !== null && _g !== void 0 ? _g : '')).toBeLessThanOrEqual(Date.parse((_h = groupIOUAction === null || groupIOUAction === void 0 ? void 0 : groupIOUAction.created) !== null && _h !== void 0 ? _h : ''));
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                        waitForCollectionCallback: true,
                        callback: function (allTransactions) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            react_native_onyx_1.default.disconnect(connection);
                            /* There should be 5 transactions
                             *   – one existing one with Jules
                             *   - one for each of the three IOU reports
                             *   - one on the group chat w/ deleted report
                             */
                            expect(Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).length).toBe(5);
                            expect(allTransactions === null || allTransactions === void 0 ? void 0 : allTransactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(julesExistingTransaction === null || julesExistingTransaction === void 0 ? void 0 : julesExistingTransaction.transactionID)]).toBeTruthy();
                            carlosTransaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (transaction) { var _a; return carlosIOUAction && (transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) === ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(carlosIOUAction)) === null || _a === void 0 ? void 0 : _a.IOUTransactionID); });
                            julesTransaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (transaction) { var _a; return julesIOUAction && (transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) === ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(julesIOUAction)) === null || _a === void 0 ? void 0 : _a.IOUTransactionID); });
                            vitTransaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (transaction) { var _a; return vitIOUAction && (transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) === ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(vitIOUAction)) === null || _a === void 0 ? void 0 : _a.IOUTransactionID); });
                            groupTransaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (transaction) { return (transaction === null || transaction === void 0 ? void 0 : transaction.reportID) === CONST_1.default.REPORT.SPLIT_REPORT_ID; });
                            expect(carlosTransaction === null || carlosTransaction === void 0 ? void 0 : carlosTransaction.reportID).toBe(carlosIOUReport === null || carlosIOUReport === void 0 ? void 0 : carlosIOUReport.reportID);
                            expect(julesTransaction === null || julesTransaction === void 0 ? void 0 : julesTransaction.reportID).toBe(julesIOUReport === null || julesIOUReport === void 0 ? void 0 : julesIOUReport.reportID);
                            expect(vitTransaction === null || vitTransaction === void 0 ? void 0 : vitTransaction.reportID).toBe(vitIOUReport === null || vitIOUReport === void 0 ? void 0 : vitIOUReport.reportID);
                            expect(groupTransaction).toBeTruthy();
                            expect(carlosTransaction === null || carlosTransaction === void 0 ? void 0 : carlosTransaction.amount).toBe(amount / 4);
                            expect(julesTransaction === null || julesTransaction === void 0 ? void 0 : julesTransaction.amount).toBe(amount / 4);
                            expect(vitTransaction === null || vitTransaction === void 0 ? void 0 : vitTransaction.amount).toBe(amount / 4);
                            expect(groupTransaction === null || groupTransaction === void 0 ? void 0 : groupTransaction.amount).toBe(amount);
                            expect((_a = carlosTransaction === null || carlosTransaction === void 0 ? void 0 : carlosTransaction.comment) === null || _a === void 0 ? void 0 : _a.comment).toBe(comment);
                            expect((_b = julesTransaction === null || julesTransaction === void 0 ? void 0 : julesTransaction.comment) === null || _b === void 0 ? void 0 : _b.comment).toBe(comment);
                            expect((_c = vitTransaction === null || vitTransaction === void 0 ? void 0 : vitTransaction.comment) === null || _c === void 0 ? void 0 : _c.comment).toBe(comment);
                            expect((_d = groupTransaction === null || groupTransaction === void 0 ? void 0 : groupTransaction.comment) === null || _d === void 0 ? void 0 : _d.comment).toBe(comment);
                            expect(carlosTransaction === null || carlosTransaction === void 0 ? void 0 : carlosTransaction.merchant).toBe(merchant);
                            expect(julesTransaction === null || julesTransaction === void 0 ? void 0 : julesTransaction.merchant).toBe(merchant);
                            expect(vitTransaction === null || vitTransaction === void 0 ? void 0 : vitTransaction.merchant).toBe(merchant);
                            expect(groupTransaction === null || groupTransaction === void 0 ? void 0 : groupTransaction.merchant).toBe(merchant);
                            expect((_e = carlosTransaction === null || carlosTransaction === void 0 ? void 0 : carlosTransaction.comment) === null || _e === void 0 ? void 0 : _e.source).toBe(CONST_1.default.IOU.TYPE.SPLIT);
                            expect((_f = julesTransaction === null || julesTransaction === void 0 ? void 0 : julesTransaction.comment) === null || _f === void 0 ? void 0 : _f.source).toBe(CONST_1.default.IOU.TYPE.SPLIT);
                            expect((_g = vitTransaction === null || vitTransaction === void 0 ? void 0 : vitTransaction.comment) === null || _g === void 0 ? void 0 : _g.source).toBe(CONST_1.default.IOU.TYPE.SPLIT);
                            expect((_h = carlosTransaction === null || carlosTransaction === void 0 ? void 0 : carlosTransaction.comment) === null || _h === void 0 ? void 0 : _h.originalTransactionID).toBe(groupTransaction === null || groupTransaction === void 0 ? void 0 : groupTransaction.transactionID);
                            expect((_j = julesTransaction === null || julesTransaction === void 0 ? void 0 : julesTransaction.comment) === null || _j === void 0 ? void 0 : _j.originalTransactionID).toBe(groupTransaction === null || groupTransaction === void 0 ? void 0 : groupTransaction.transactionID);
                            expect((_k = vitTransaction === null || vitTransaction === void 0 ? void 0 : vitTransaction.comment) === null || _k === void 0 ? void 0 : _k.originalTransactionID).toBe(groupTransaction === null || groupTransaction === void 0 ? void 0 : groupTransaction.transactionID);
                            expect(carlosTransaction === null || carlosTransaction === void 0 ? void 0 : carlosTransaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(julesTransaction === null || julesTransaction === void 0 ? void 0 : julesTransaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(vitTransaction === null || vitTransaction === void 0 ? void 0 : vitTransaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            expect(groupTransaction === null || groupTransaction === void 0 ? void 0 : groupTransaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        waitForCollectionCallback: false,
                        callback: function (allPersonalDetails) {
                            var _a;
                            react_native_onyx_1.default.disconnect(connection);
                            expect(allPersonalDetails).toMatchObject((_a = {},
                                _a[VIT_ACCOUNT_ID] = {
                                    accountID: VIT_ACCOUNT_ID,
                                    displayName: VIT_EMAIL,
                                    login: VIT_EMAIL,
                                },
                                _a));
                            resolve();
                        },
                    });
                });
            })
                .then(mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume)
                .then(waitForNetworkPromises_1.default)
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).forEach(function (report) {
                                if (!(report === null || report === void 0 ? void 0 : report.pendingFields)) {
                                    return;
                                }
                                Object.values(report === null || report === void 0 ? void 0 : report.pendingFields).forEach(function (pendingField) { return expect(pendingField).toBeFalsy(); });
                            });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                        waitForCollectionCallback: true,
                        callback: function (allReportActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            Object.values(allReportActions !== null && allReportActions !== void 0 ? allReportActions : {}).forEach(function (reportAction) { return expect(reportAction === null || reportAction === void 0 ? void 0 : reportAction.pendingAction).toBeFalsy(); });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                        waitForCollectionCallback: true,
                        callback: function (allTransactions) {
                            react_native_onyx_1.default.disconnect(connection);
                            Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).forEach(function (transaction) { return expect(transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction).toBeFalsy(); });
                            resolve();
                        },
                    });
                });
            });
        });
        it('should update split chat report lastVisibleActionCreated to the report preview action', function () { return __awaiter(void 0, void 0, void 0, function () {
            var workspaceReportID, reportPreviewAction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workspaceReportID = '1';
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(workspaceReportID), { reportID: workspaceReportID, isOwnPolicyExpenseChat: true })];
                    case 1:
                        _a.sent();
                        // When the user split bill on the workspace
                        (0, IOU_1.splitBill)({
                            participants: [{ reportID: workspaceReportID }],
                            currentUserLogin: RORY_EMAIL,
                            currentUserAccountID: RORY_ACCOUNT_ID,
                            comment: '',
                            amount: 100,
                            currency: CONST_1.default.CURRENCY.USD,
                            merchant: 'test',
                            created: '',
                            existingSplitChatReportID: workspaceReportID,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(workspaceReportID),
                                    callback: function (reportActions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).find(function (action) { return action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW; }));
                                    },
                                });
                            })];
                    case 3:
                        reportPreviewAction = _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(workspaceReportID),
                                    callback: function (report) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(report === null || report === void 0 ? void 0 : report.lastVisibleActionCreated).toBe(reportPreviewAction === null || reportPreviewAction === void 0 ? void 0 : reportPreviewAction.created);
                                        resolve(report);
                                    },
                                });
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update split chat report lastVisibleActionCreated to the latest IOU action when split bill in a DM', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, iouAction, report;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reportID = '1';
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), {
                                reportID: reportID,
                                type: CONST_1.default.REPORT.TYPE.CHAT,
                                participants: (_a = {}, _a[RORY_ACCOUNT_ID] = RORY_PARTICIPANT, _a[CARLOS_ACCOUNT_ID] = CARLOS_PARTICIPANT, _a),
                            })];
                    case 1:
                        _b.sent();
                        // When the user split bill twice on the DM
                        (0, IOU_1.splitBill)({
                            participants: [{ accountID: CARLOS_ACCOUNT_ID, login: CARLOS_EMAIL }],
                            currentUserLogin: RORY_EMAIL,
                            currentUserAccountID: RORY_ACCOUNT_ID,
                            comment: '',
                            amount: 100,
                            currency: CONST_1.default.CURRENCY.USD,
                            merchant: 'test',
                            created: '',
                            existingSplitChatReportID: reportID,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _b.sent();
                        (0, IOU_1.splitBill)({
                            participants: [{ accountID: CARLOS_ACCOUNT_ID, login: CARLOS_EMAIL }],
                            currentUserLogin: RORY_EMAIL,
                            currentUserAccountID: RORY_ACCOUNT_ID,
                            comment: '',
                            amount: 200,
                            currency: CONST_1.default.CURRENCY.USD,
                            merchant: 'test',
                            created: '',
                            existingSplitChatReportID: reportID,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID),
                                    callback: function (reportActions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).find(function (action) { var _a; return (0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.IOU) && ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(action)) === null || _a === void 0 ? void 0 : _a.amount) === 200; }));
                                    },
                                });
                            })];
                    case 4:
                        iouAction = _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID),
                                    callback: function (reportVal) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reportVal);
                                    },
                                });
                            })];
                    case 5:
                        report = _b.sent();
                        expect(report === null || report === void 0 ? void 0 : report.lastVisibleActionCreated).toBe(iouAction === null || iouAction === void 0 ? void 0 : iouAction.created);
                        return [2 /*return*/];
                }
            });
        }); });
        it('optimistic transaction should be merged with the draft transaction if it is a distance request', function () { return __awaiter(void 0, void 0, void 0, function () {
            var workspaceReportID, transactionAmount, draftTransaction, optimisticTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workspaceReportID = '1';
                        transactionAmount = 100;
                        draftTransaction = {
                            amount: transactionAmount,
                            currency: CONST_1.default.CURRENCY.USD,
                            merchant: 'test',
                            created: '',
                            iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.DISTANCE,
                        };
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(workspaceReportID), { reportID: workspaceReportID, isOwnPolicyExpenseChat: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID), draftTransaction)];
                    case 2:
                        _a.sent();
                        // When doing a distance split expense
                        (0, IOU_1.splitBill)(__assign(__assign({ participants: [{ reportID: workspaceReportID }], currentUserLogin: RORY_EMAIL, currentUserAccountID: RORY_ACCOUNT_ID, existingSplitChatReportID: workspaceReportID }, draftTransaction), { comment: '' }));
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                    waitForCollectionCallback: true,
                                    callback: function (transactions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(Object.values(transactions !== null && transactions !== void 0 ? transactions : {}).find(function (transaction) { return (transaction === null || transaction === void 0 ? void 0 : transaction.amount) === -(transactionAmount / 2); }));
                                    },
                                });
                            })];
                    case 4:
                        optimisticTransaction = _a.sent();
                        // Then the data from the transaction draft should be merged into the optimistic transaction
                        expect(optimisticTransaction === null || optimisticTransaction === void 0 ? void 0 : optimisticTransaction.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.DISTANCE);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should update the notification preference of the report to ALWAYS if it's previously hidden", function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, report;
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reportID = '1';
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), {
                                reportID: reportID,
                                type: CONST_1.default.REPORT.TYPE.CHAT,
                                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                                participants: (_a = {},
                                    _a[RORY_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                                    _a[CARLOS_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                                    _a),
                            })];
                    case 1:
                        _c.sent();
                        // When the user split bill on the group chat
                        (0, IOU_1.splitBill)({
                            participants: [{ accountID: CARLOS_ACCOUNT_ID, login: CARLOS_EMAIL }],
                            currentUserLogin: RORY_EMAIL,
                            currentUserAccountID: RORY_ACCOUNT_ID,
                            comment: '',
                            amount: 100,
                            currency: CONST_1.default.CURRENCY.USD,
                            merchant: 'test',
                            created: '',
                            existingSplitChatReportID: reportID,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID),
                                    callback: function (reportVal) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reportVal);
                                    },
                                });
                            })];
                    case 3:
                        report = _c.sent();
                        expect((_b = report === null || report === void 0 ? void 0 : report.participants) === null || _b === void 0 ? void 0 : _b[RORY_ACCOUNT_ID].notificationPreference).toBe(CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS);
                        return [2 /*return*/];
                }
            });
        }); });
        it('the description should not be parsed again after completing the scan split bill without changing the description', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, splitTransactionID, splitTransaction, updatedSplitTransaction, reportActions, iouAction;
            var _a;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        reportID = '1';
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), {
                                reportID: reportID,
                                type: CONST_1.default.REPORT.TYPE.CHAT,
                                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                                participants: (_a = {},
                                    _a[RORY_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                                    _a[CARLOS_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                                    _a),
                            })];
                    case 1:
                        _d.sent();
                        splitTransactionID = (0, IOU_1.startSplitBill)({
                            participants: [{ accountID: CARLOS_ACCOUNT_ID, login: CARLOS_EMAIL }],
                            currentUserLogin: RORY_EMAIL,
                            currentUserAccountID: RORY_ACCOUNT_ID,
                            comment: '# test',
                            currency: CONST_1.default.CURRENCY.USD,
                            existingSplitChatReportID: reportID,
                            receipt: {},
                            category: undefined,
                            tag: undefined,
                            taxCode: '',
                            taxAmount: 0,
                        }).splitTransactionID;
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(splitTransactionID))];
                    case 3:
                        splitTransaction = _d.sent();
                        // Then the description should be parsed correctly
                        expect((_b = splitTransaction === null || splitTransaction === void 0 ? void 0 : splitTransaction.comment) === null || _b === void 0 ? void 0 : _b.comment).toBe('<h1>test</h1>');
                        updatedSplitTransaction = splitTransaction
                            ? __assign(__assign({}, splitTransaction), { amount: 100 }) : undefined;
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID))];
                    case 4:
                        reportActions = _d.sent();
                        iouAction = Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).find(function (action) { return (0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.IOU); });
                        expect(iouAction).toBeTruthy();
                        // Complete this split bill without changing the description
                        (0, IOU_1.completeSplitBill)(reportID, iouAction, updatedSplitTransaction, RORY_ACCOUNT_ID, RORY_EMAIL);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(splitTransactionID))];
                    case 6:
                        splitTransaction = _d.sent();
                        // Then the description should be the same since it was not changed
                        expect((_c = splitTransaction === null || splitTransaction === void 0 ? void 0 : splitTransaction.comment) === null || _c === void 0 ? void 0 : _c.comment).toBe('<h1>test</h1>');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('saveSplitTransactions', function () {
        it('should delete the original transaction thread report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expenseReport, transaction, transactionThread, iouAction, draftTransaction, originalTransactionThread;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expenseReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE });
                        transaction = {
                            amount: 100,
                            currency: 'USD',
                            transactionID: '1',
                            reportID: expenseReport.reportID,
                            created: DateUtils_1.default.getDBTime(),
                            merchant: 'test',
                        };
                        transactionThread = __assign({}, (0, reports_1.createRandomReport)(2));
                        iouAction = __assign(__assign({}, (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                            type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                            amount: transaction.amount,
                            currency: transaction.currency,
                            comment: '',
                            participants: [],
                            transactionID: transaction.transactionID,
                            iouReportID: expenseReport.reportID,
                        })), { childReportID: transactionThread.reportID });
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(expenseReport.reportID), expenseReport)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionThread.reportID), transactionThread)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseReport.reportID), (_a = {},
                                _a[iouAction.reportActionID] = iouAction,
                                _a))];
                    case 3:
                        _b.sent();
                        draftTransaction = __assign(__assign({}, transaction), { comment: {
                                originalTransactionID: transaction.transactionID,
                            } });
                        (0, IOU_1.saveSplitTransactions)(draftTransaction, 1);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouAction.childReportID),
                                    callback: function (val) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(val);
                                    },
                                });
                            })];
                    case 5:
                        originalTransactionThread = _b.sent();
                        expect(originalTransactionThread).toBe(undefined);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should remove the original transaction from the search snapshot data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expenseReport, transaction, transactionThread, iouAction, draftTransaction, hash, searchSnapshot;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expenseReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE });
                        transaction = {
                            amount: 100,
                            currency: 'USD',
                            transactionID: '1',
                            reportID: expenseReport.reportID,
                            created: DateUtils_1.default.getDBTime(),
                            merchant: 'test',
                        };
                        transactionThread = __assign({}, (0, reports_1.createRandomReport)(2));
                        iouAction = __assign(__assign({}, (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                            type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                            amount: transaction.amount,
                            currency: transaction.currency,
                            comment: '',
                            participants: [],
                            transactionID: transaction.transactionID,
                            iouReportID: expenseReport.reportID,
                        })), { childReportID: transactionThread.reportID });
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(expenseReport.reportID), expenseReport)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionThread.reportID), transactionThread)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseReport.reportID), (_a = {},
                                _a[iouAction.reportActionID] = iouAction,
                                _a))];
                    case 3:
                        _b.sent();
                        draftTransaction = __assign(__assign({}, transaction), { comment: {
                                originalTransactionID: transaction.transactionID,
                            } });
                        hash = 1;
                        (0, IOU_1.saveSplitTransactions)(draftTransaction, hash);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
                                    callback: function (val) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(val);
                                    },
                                });
                            })];
                    case 5:
                        searchSnapshot = _b.sent();
                        expect(searchSnapshot === null || searchSnapshot === void 0 ? void 0 : searchSnapshot.data["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction.transactionID)]).toBe(undefined);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('payMoneyRequestElsewhere', function () {
        it('clears outstanding IOUReport', function () {
            var amount = 10000;
            var comment = 'Giv money plz';
            var chatReport;
            var iouReport;
            var createIOUAction;
            var payIOUAction;
            var transaction;
            (0, IOU_1.requestMoney)({
                report: { reportID: '' },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: amount,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: comment,
                },
                shouldGenerateTransactionThreadReport: true,
            });
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).length).toBe(3);
                            var chatReports = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).filter(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT; });
                            chatReport = chatReports.at(0);
                            expect(chatReport).toBeTruthy();
                            expect(chatReport).toHaveProperty('reportID');
                            expect(chatReport).toHaveProperty('iouReportID');
                            iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            expect(iouReport).toBeTruthy();
                            expect(iouReport).toHaveProperty('reportID');
                            expect(iouReport).toHaveProperty('chatReportID');
                            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID).toBe(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID);
                            expect(iouReport === null || iouReport === void 0 ? void 0 : iouReport.chatReportID).toBe(chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID);
                            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.pendingFields).toBeFalsy();
                            expect(iouReport === null || iouReport === void 0 ? void 0 : iouReport.pendingFields).toBeFalsy();
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                        waitForCollectionCallback: true,
                        callback: function (allReportActions) {
                            var _a;
                            react_native_onyx_1.default.disconnect(connection);
                            var reportActionsForIOUReport = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID)];
                            createIOUAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) { return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction); });
                            expect(createIOUAction).toBeTruthy();
                            expect(createIOUAction && ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(createIOUAction)) === null || _a === void 0 ? void 0 : _a.IOUReportID)).toBe(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                        waitForCollectionCallback: true,
                        callback: function (allTransactions) {
                            var _a;
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).length).toBe(1);
                            transaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (t) { return t; });
                            expect(transaction).toBeTruthy();
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.amount).toBe(amount);
                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.reportID).toBe(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID);
                            expect(createIOUAction && ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(createIOUAction)) === null || _a === void 0 ? void 0 : _a.IOUTransactionID)).toBe(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                var _a;
                (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                if (chatReport && iouReport) {
                    (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, chatReport, iouReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).length).toBe(3);
                            chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.type) === CONST_1.default.REPORT.TYPE.CHAT; });
                            iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID).toBeFalsy();
                            // expect(iouReport.status).toBe(CONST.REPORT.STATUS_NUM.REIMBURSED);
                            // expect(iouReport.stateNum).toBe(CONST.REPORT.STATE_NUM.APPROVED);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                        waitForCollectionCallback: true,
                        callback: function (allReportActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            var reportActionsForIOUReport = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID)];
                            expect(Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).length).toBe(3);
                            payIOUAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) { var _a; return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) && ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)) === null || _a === void 0 ? void 0 : _a.type) === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY; });
                            expect(payIOUAction).toBeTruthy();
                            expect(payIOUAction === null || payIOUAction === void 0 ? void 0 : payIOUAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                            resolve();
                        },
                    });
                });
            })
                .then(mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume)
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).length).toBe(3);
                            chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.type) === CONST_1.default.REPORT.TYPE.CHAT; });
                            iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID).toBeFalsy();
                            // expect(iouReport.status).toBe(CONST.REPORT.STATUS_NUM.REIMBURSED);
                            // expect(iouReport.stateNum).toBe(CONST.REPORT.STATE_NUM.APPROVED);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                        waitForCollectionCallback: true,
                        callback: function (allReportActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            var reportActionsForIOUReport = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID)];
                            expect(Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).length).toBe(3);
                            payIOUAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) { var _a; return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) && ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)) === null || _a === void 0 ? void 0 : _a.type) === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY; });
                            resolve();
                            expect(payIOUAction).toBeTruthy();
                            expect(payIOUAction === null || payIOUAction === void 0 ? void 0 : payIOUAction.pendingAction).toBeFalsy();
                        },
                    });
                });
            });
        });
    });
    describe('pay expense report via ACH', function () {
        var amount = 10000;
        var comment = '💸💸💸💸';
        var merchant = 'NASDAQ';
        afterEach(function () {
            var _a;
            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
        });
        it('updates the expense request and expense report when paid while offline', function () {
            var _a;
            var expenseReport;
            var chatReport;
            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () {
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                        },
                        transactionParams: {
                            amount: amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant: merchant,
                            comment: comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                if (chatReport && expenseReport) {
                    (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.VBBA, chatReport, expenseReport, undefined);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID),
                        waitForCollectionCallback: false,
                        callback: function (allActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(Object.values(allActions !== null && allActions !== void 0 ? allActions : {})).toEqual(expect.arrayContaining([
                                expect.objectContaining({
                                    message: expect.arrayContaining([
                                        expect.objectContaining({
                                            html: "paid $".concat(amount / 100, ".00 with Expensify"),
                                            text: "paid $".concat(amount / 100, ".00 with Expensify"),
                                        }),
                                    ]),
                                    originalMessage: expect.objectContaining({
                                        amount: amount,
                                        paymentType: CONST_1.default.IOU.PAYMENT_TYPE.VBBA,
                                        type: 'pay',
                                    }),
                                }),
                            ]));
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            var updatedIOUReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            var updatedChatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.reportID) === (expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.chatReportID); });
                            expect(updatedIOUReport).toEqual(expect.objectContaining({
                                lastMessageHtml: "paid $".concat(amount / 100, ".00 with Expensify"),
                                lastMessageText: "paid $".concat(amount / 100, ".00 with Expensify"),
                                statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
                                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                            }));
                            expect(updatedChatReport).toEqual(expect.objectContaining({
                                lastMessageHtml: "paid $".concat(amount / 100, ".00 with Expensify"),
                                lastMessageText: "paid $".concat(amount / 100, ".00 with Expensify"),
                            }));
                            resolve();
                        },
                    });
                });
            });
        });
        it('shows an error when paying results in an error', function () {
            var expenseReport;
            var chatReport;
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () {
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                        },
                        transactionParams: {
                            amount: amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant: merchant,
                            comment: comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                var _a;
                (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.fail) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                if (chatReport && expenseReport) {
                    (0, IOU_1.payMoneyRequest)('ACH', chatReport, expenseReport, undefined);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID),
                        waitForCollectionCallback: false,
                        callback: function (allActions) {
                            var _a;
                            react_native_onyx_1.default.disconnect(connection);
                            var erroredAction = Object.values(allActions !== null && allActions !== void 0 ? allActions : {}).find(function (action) { return !(0, EmptyObject_1.isEmptyObject)(action === null || action === void 0 ? void 0 : action.errors); });
                            expect(Object.values((_a = erroredAction === null || erroredAction === void 0 ? void 0 : erroredAction.errors) !== null && _a !== void 0 ? _a : {}).at(0)).toEqual((0, Localize_1.translateLocal)('iou.error.other'));
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('payMoneyRequest', function () {
        it('should apply optimistic data correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var chatReport, iouReport, payReportAction;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        chatReport = __assign(__assign({}, (0, reports_1.createRandomReport)(0)), { lastReadTime: DateUtils_1.default.getDBTime(), lastVisibleActionCreated: DateUtils_1.default.getDBTime() });
                        iouReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { chatType: undefined, type: CONST_1.default.REPORT.TYPE.IOU, total: 10 });
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        jest.advanceTimersByTime(10);
                        // When paying the IOU report
                        (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, chatReport, iouReport);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID),
                                    callback: function (reportActions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).pop());
                                    },
                                });
                            })];
                    case 2:
                        payReportAction = _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReport.reportID),
                                    callback: function (report) {
                                        var _a, _b;
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(report === null || report === void 0 ? void 0 : report.lastVisibleActionCreated).toBe(chatReport.lastVisibleActionCreated);
                                        expect(report === null || report === void 0 ? void 0 : report.hasOutstandingChildRequest).toBe(false);
                                        expect(report === null || report === void 0 ? void 0 : report.iouReportID).toBeUndefined();
                                        expect(new Date((_a = report === null || report === void 0 ? void 0 : report.lastReadTime) !== null && _a !== void 0 ? _a : '').getTime()).toBeGreaterThan(new Date((_b = chatReport === null || chatReport === void 0 ? void 0 : chatReport.lastReadTime) !== null && _b !== void 0 ? _b : '').getTime());
                                        expect(report === null || report === void 0 ? void 0 : report.lastMessageText).toBe((0, ReportActionsUtils_1.getReportActionText)(payReportAction));
                                        expect(report === null || report === void 0 ? void 0 : report.lastMessageHtml).toBe((0, ReportActionsUtils_1.getReportActionHtml)(payReportAction));
                                        resolve();
                                    },
                                });
                            })];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport.reportID),
                                    callback: function (report) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(report === null || report === void 0 ? void 0 : report.hasOutstandingChildRequest).toBe(false);
                                        expect(report === null || report === void 0 ? void 0 : report.statusNum).toBe(CONST_1.default.REPORT.STATUS_NUM.REIMBURSED);
                                        expect(report === null || report === void 0 ? void 0 : report.lastVisibleActionCreated).toBe(payReportAction === null || payReportAction === void 0 ? void 0 : payReportAction.created);
                                        expect(report === null || report === void 0 ? void 0 : report.lastMessageText).toBe((0, ReportActionsUtils_1.getReportActionText)(payReportAction));
                                        expect(report === null || report === void 0 ? void 0 : report.lastMessageHtml).toBe((0, ReportActionsUtils_1.getReportActionHtml)(payReportAction));
                                        expect(report === null || report === void 0 ? void 0 : report.pendingFields).toEqual({
                                            preview: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                            reimbursed: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                        });
                                        resolve();
                                    },
                                });
                            })];
                    case 4:
                        _c.sent();
                        (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls notifyNewAction for the top most report', function () {
            var _a, _b;
            // Given two expenses in an iou report where one of them held
            var iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            var transaction1 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            var transaction2 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            var transactionCollectionDataSet = (_a = {},
                _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction1.transactionID)] = transaction1,
                _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction2.transactionID)] = transaction2,
                _a);
            var iouActions = [];
            [transaction1, transaction2].forEach(function (transaction) {
                return iouActions.push((0, ReportUtils_1.buildOptimisticIOUReportAction)({
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    comment: '',
                    participants: [],
                    transactionID: transaction.transactionID,
                }));
            });
            var actions = {};
            iouActions.forEach(function (iouAction) { return (actions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouAction.reportActionID)] = iouAction); });
            var actionCollectionDataSet = (_b = {}, _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID)] = actions, _b);
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () { return react_native_onyx_1.default.multiSet(__assign(__assign({}, transactionCollectionDataSet), actionCollectionDataSet)); })
                .then(function () {
                var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID); }).result;
                (0, IOU_1.putOnHold)(transaction1.transactionID, 'comment', result.current.ancestorReportsAndReportActions, iouReport.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                // When partially paying  an iou report from the chat report via the report preview
                (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, { reportID: topMostReportID }, iouReport, undefined, false);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                // Then notifyNewAction should be called on the top most report.
                expect(Report_1.notifyNewAction).toHaveBeenCalledWith(topMostReportID, expect.anything());
            });
        });
    });
    describe('a expense chat with a cancelled payment', function () {
        var amount = 10000;
        var comment = '💸💸💸💸';
        var merchant = 'NASDAQ';
        afterEach(function () {
            var _a;
            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
        });
        it("has an iouReportID of the cancelled payment's expense report", function () {
            var expenseReport;
            var chatReport;
            // Given a signed in account, which owns a workspace, and has a policy expense chat
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () {
                // Which owns a workspace
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return (0, TestHelper_1.getOnyxData)({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: function (allReports) {
                        chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                    },
                });
            })
                .then(function () {
                if (chatReport) {
                    // When an IOU expense is submitted to that policy expense chat
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                        },
                        transactionParams: {
                            amount: amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant: merchant,
                            comment: comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                // And given an expense report has now been created which holds the IOU
                return (0, TestHelper_1.getOnyxData)({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: function (allReports) {
                        expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                    },
                });
            })
                .then(function () {
                // When the expense report is paid elsewhere (but really, any payment option would work)
                if (chatReport && expenseReport) {
                    (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, chatReport, expenseReport, undefined);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                if (chatReport && expenseReport) {
                    // And when the payment is cancelled
                    (0, IOU_1.cancelPayment)(expenseReport, chatReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return (0, TestHelper_1.getOnyxData)({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: function (allReports) {
                        var chatReportData = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID)];
                        // Then the policy expense chat report has the iouReportID of the IOU expense report
                        expect(chatReportData === null || chatReportData === void 0 ? void 0 : chatReportData.iouReportID).toBe(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID);
                    },
                });
            });
        });
    });
    describe('deleteMoneyRequest', function () {
        var amount = 10000;
        var comment = 'Send me money please';
        var chatReport;
        var iouReport;
        var createIOUAction;
        var transaction;
        var thread;
        var TEST_USER_ACCOUNT_ID = 1;
        var TEST_USER_LOGIN = 'test@test.com';
        var IOU_REPORT_ID;
        var reportActionID;
        var REPORT_ACTION = {
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            actorAccountID: TEST_USER_ACCOUNT_ID,
            automatic: false,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            message: [{ type: 'COMMENT', html: 'Testing a comment', text: 'Testing a comment', translationKey: '' }],
            person: [{ type: 'TEXT', style: 'strong', text: 'Test User' }],
            shouldShow: true,
            created: DateUtils_1.default.getDBTime(),
            reportActionID: '1',
            originalMessage: {
                html: '',
                whisperedTo: [],
            },
        };
        var reportActions;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var allReports, allReportActions, reportActionsForIOUReport, allTransactions;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Given mocks are cleared and helpers are set up
                        jest.clearAllMocks();
                        PusherHelper_1.default.setup();
                        // Given a test user is signed in with Onyx setup and some initial data
                        return [4 /*yield*/, (0, TestHelper_1.signInWithTestUser)(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)];
                    case 1:
                        // Given a test user is signed in with Onyx setup and some initial data
                        _c.sent();
                        (0, User_1.subscribeToUserEvents)();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, (0, TestHelper_1.setPersonalDetails)(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID)];
                    case 3:
                        _c.sent();
                        // When a submit IOU expense is made
                        (0, IOU_1.requestMoney)({
                            report: chatReport,
                            participantParams: {
                                payeeEmail: TEST_USER_LOGIN,
                                payeeAccountID: TEST_USER_ACCOUNT_ID,
                                participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID },
                            },
                            transactionParams: {
                                amount: amount,
                                attendees: [],
                                currency: CONST_1.default.CURRENCY.USD,
                                created: '',
                                merchant: '',
                                comment: comment,
                            },
                            shouldGenerateTransactionThreadReport: true,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                    waitForCollectionCallback: true,
                                    callback: function (reports) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reports);
                                    },
                                });
                            })];
                    case 5:
                        allReports = _c.sent();
                        // Then we should have exactly 3 reports
                        expect(Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).length).toBe(3);
                        // Then one of them should be a chat report with relevant properties
                        chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.CHAT; });
                        expect(chatReport).toBeTruthy();
                        expect(chatReport).toHaveProperty('reportID');
                        expect(chatReport).toHaveProperty('iouReportID');
                        // Then one of them should be an IOU report with relevant properties
                        iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                        expect(iouReport).toBeTruthy();
                        expect(iouReport).toHaveProperty('reportID');
                        expect(iouReport).toHaveProperty('chatReportID');
                        // Then their IDs should reference each other
                        expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID).toBe(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID);
                        expect(iouReport === null || iouReport === void 0 ? void 0 : iouReport.chatReportID).toBe(chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID);
                        // Storing IOU Report ID for further reference
                        IOU_REPORT_ID = chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID;
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                                    waitForCollectionCallback: true,
                                    callback: function (actions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(actions);
                                    },
                                });
                            })];
                    case 7:
                        allReportActions = _c.sent();
                        reportActionsForIOUReport = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID)];
                        createIOUAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) {
                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                        });
                        expect(createIOUAction).toBeTruthy();
                        expect(createIOUAction && ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(createIOUAction)) === null || _a === void 0 ? void 0 : _a.IOUReportID)).toBe(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                    waitForCollectionCallback: true,
                                    callback: function (transactions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(transactions);
                                    },
                                });
                            })];
                    case 8:
                        allTransactions = _c.sent();
                        // Then we should find a specific transaction with relevant properties
                        transaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (t) { return t; });
                        expect(transaction).toBeTruthy();
                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.amount).toBe(amount);
                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.reportID).toBe(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID);
                        expect(createIOUAction && ((_b = (0, ReportActionsUtils_1.getOriginalMessage)(createIOUAction)) === null || _b === void 0 ? void 0 : _b.IOUTransactionID)).toBe(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID);
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(PusherHelper_1.default.teardown);
        it('delete an expense (IOU Action and transaction) successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportActionsForReport, t, tr;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Given the fetch operations are paused and an expense is initiated
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        if (transaction && createIOUAction) {
                            // When the expense is deleted
                            (0, IOU_1.deleteMoneyRequest)(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID, createIOUAction, {}, {}, true);
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (actionsForReport) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(actionsForReport);
                                    },
                                });
                            })];
                    case 2:
                        reportActionsForReport = _c.sent();
                        createIOUAction = Object.values(reportActionsForReport !== null && reportActionsForReport !== void 0 ? reportActionsForReport : {}).find(function (reportAction) {
                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                        });
                        // Then the IOU Action should be truthy for offline support.
                        expect(createIOUAction).toBeTruthy();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID),
                                    waitForCollectionCallback: false,
                                    callback: function (transactionResult) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(transactionResult);
                                    },
                                });
                            })];
                    case 3:
                        t = _c.sent();
                        expect(t).toBeTruthy();
                        expect(t === null || t === void 0 ? void 0 : t.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
                        // Given fetch operations are resumed
                        (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (actionsForReport) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(actionsForReport);
                                    },
                                });
                            })];
                    case 5:
                        // Then we recheck the IOU report action from the report actions collection
                        reportActionsForReport = _c.sent();
                        createIOUAction = Object.values(reportActionsForReport !== null && reportActionsForReport !== void 0 ? reportActionsForReport : {}).find(function (reportAction) {
                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                        });
                        expect(createIOUAction).toBeFalsy();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID),
                                    waitForCollectionCallback: false,
                                    callback: function (transactionResult) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(transactionResult);
                                    },
                                });
                            })];
                    case 6:
                        tr = _c.sent();
                        expect(tr).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete the IOU report when there are no expenses left in the IOU report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var report;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Given an IOU report and a paused fetch state
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        if (transaction && createIOUAction) {
                            // When the IOU expense is deleted
                            (0, IOU_1.deleteMoneyRequest)(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID, createIOUAction, {}, {}, true);
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (res) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(res);
                                    },
                                });
                            })];
                    case 2:
                        report = _c.sent();
                        // Then the report should be truthy for offline support
                        expect(report).toBeTruthy();
                        // Given the resumed fetch state
                        (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (res) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(res);
                                    },
                                });
                            })];
                    case 4:
                        report = _c.sent();
                        // Then the report should be falsy so that there is no trace of the expense.
                        expect(report).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not delete the IOU report when there are expenses left in the IOU report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var allReports;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Given multiple expenses on an IOU report
                        (0, IOU_1.requestMoney)({
                            report: chatReport,
                            participantParams: {
                                payeeEmail: TEST_USER_LOGIN,
                                payeeAccountID: TEST_USER_ACCOUNT_ID,
                                participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID },
                            },
                            transactionParams: {
                                amount: amount,
                                attendees: [],
                                currency: CONST_1.default.CURRENCY.USD,
                                created: '',
                                merchant: '',
                                comment: comment,
                            },
                            shouldGenerateTransactionThreadReport: true,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _c.sent();
                        // When we attempt to delete an expense from the IOU report
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        if (transaction && createIOUAction) {
                            (0, IOU_1.deleteMoneyRequest)(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID, createIOUAction, {}, {});
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                    waitForCollectionCallback: true,
                                    callback: function (reports) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reports);
                                    },
                                });
                            })];
                    case 3:
                        allReports = _c.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _c.sent();
                        iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (0, ReportUtils_1.isIOUReport)(report); });
                        expect(iouReport).toBeTruthy();
                        expect(iouReport).toHaveProperty('reportID');
                        expect(iouReport).toHaveProperty('chatReportID');
                        // Given the resumed fetch state
                        return [4 /*yield*/, ((_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch))];
                    case 5:
                        // Given the resumed fetch state
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                    waitForCollectionCallback: true,
                                    callback: function (reports) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reports);
                                    },
                                });
                            })];
                    case 6:
                        allReports = _c.sent();
                        // Then expect that the IOU report still exists
                        iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (0, ReportUtils_1.isIOUReport)(report); });
                        expect(iouReport).toBeTruthy();
                        expect(iouReport).toHaveProperty('reportID');
                        expect(iouReport).toHaveProperty('chatReportID');
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete the transaction thread if there are no visible comments in the thread', function () { return __awaiter(void 0, void 0, void 0, function () {
            var participantAccountIDs, userLogins, allReportActions, reportActionsForIOUReport, report;
            var _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: 
                    // Given all promises are resolved
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        // Given all promises are resolved
                        _e.sent();
                        jest.advanceTimersByTime(10);
                        // Given a transaction thread
                        thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
                        expect(thread.participants).toStrictEqual((_a = {}, _a[CARLOS_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN, role: CONST_1.default.REPORT.ROLE.ADMIN }, _a));
                        react_native_onyx_1.default.connect({
                            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(thread.reportID),
                            callback: function (val) { return (reportActions = val); },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _e.sent();
                        jest.advanceTimersByTime(10);
                        participantAccountIDs = Object.keys((_b = thread.participants) !== null && _b !== void 0 ? _b : {}).map(Number);
                        userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
                        // When Opening a thread report with the given details
                        (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction === null || createIOUAction === void 0 ? void 0 : createIOUAction.reportActionID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                                    waitForCollectionCallback: true,
                                    callback: function (actions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(actions);
                                    },
                                });
                            })];
                    case 4:
                        allReportActions = _e.sent();
                        reportActionsForIOUReport = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID)];
                        createIOUAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) {
                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                        });
                        expect(createIOUAction === null || createIOUAction === void 0 ? void 0 : createIOUAction.childReportID).toBe(thread.reportID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _e.sent();
                        // Given Fetch is paused and timers have advanced
                        (_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _c === void 0 ? void 0 : _c.call(mockFetch);
                        jest.advanceTimersByTime(10);
                        if (transaction && createIOUAction) {
                            // When Deleting an expense
                            (0, IOU_1.deleteMoneyRequest)(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID, createIOUAction, {}, {});
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(thread.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (reportData) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reportData);
                                    },
                                });
                            })];
                    case 7:
                        report = _e.sent();
                        expect(report === null || report === void 0 ? void 0 : report.reportID).toBeFalsy();
                        (_d = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _d === void 0 ? void 0 : _d.call(mockFetch);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(thread.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (reportData) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reportData);
                                    },
                                });
                            })];
                    case 8:
                        // Then After resuming fetch, the report for the given thread ID still does not exist
                        report = _e.sent();
                        expect(report === null || report === void 0 ? void 0 : report.reportID).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('delete the transaction thread if there are only changelogs (i.e. MODIFIED_EXPENSE actions) in the thread', function () { return __awaiter(void 0, void 0, void 0, function () {
            var participantAccountIDs, userLogins, allReportActions, reportActionsForIOUReport, report;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // Given all promises are resolved
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        // Given all promises are resolved
                        _b.sent();
                        jest.advanceTimersByTime(10);
                        // Given a transaction thread
                        thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
                        react_native_onyx_1.default.connect({
                            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(thread.reportID),
                            callback: function (val) { return (reportActions = val); },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _b.sent();
                        jest.advanceTimersByTime(10);
                        participantAccountIDs = Object.keys((_a = thread.participants) !== null && _a !== void 0 ? _a : {}).map(Number);
                        userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
                        // When Opening a thread report with the given details
                        (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction === null || createIOUAction === void 0 ? void 0 : createIOUAction.reportActionID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                                    waitForCollectionCallback: true,
                                    callback: function (actions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(actions);
                                    },
                                });
                            })];
                    case 4:
                        allReportActions = _b.sent();
                        reportActionsForIOUReport = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID)];
                        createIOUAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) {
                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                        });
                        expect(createIOUAction === null || createIOUAction === void 0 ? void 0 : createIOUAction.childReportID).toBe(thread.reportID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _b.sent();
                        jest.advanceTimersByTime(10);
                        if (transaction && createIOUAction) {
                            (0, IOU_1.updateMoneyRequestAmountAndCurrency)({
                                transactionID: transaction.transactionID,
                                transactions: {},
                                transactionThreadReportID: thread.reportID,
                                transactionViolations: {},
                                amount: 20000,
                                currency: CONST_1.default.CURRENCY.USD,
                                taxAmount: 0,
                                taxCode: '',
                                policy: {
                                    id: '123',
                                    role: 'user',
                                    type: CONST_1.default.POLICY.TYPE.TEAM,
                                    name: '',
                                    owner: '',
                                    outputCurrency: '',
                                    isPolicyExpenseChatEnabled: false,
                                },
                                policyTagList: {},
                                policyCategories: {},
                            });
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _b.sent();
                        // Verify there are two actions (created + changelog)
                        expect(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).length).toBe(2);
                        // Fetch the updated IOU Action from Onyx
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (reportActionsForReport) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        createIOUAction = Object.values(reportActionsForReport !== null && reportActionsForReport !== void 0 ? reportActionsForReport : {}).find(function (reportAction) {
                                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                                        });
                                        resolve();
                                    },
                                });
                            })];
                    case 7:
                        // Fetch the updated IOU Action from Onyx
                        _b.sent();
                        if (transaction && createIOUAction) {
                            // When Deleting an expense
                            (0, IOU_1.deleteMoneyRequest)(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID, createIOUAction, {}, {});
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(thread.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (reportData) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reportData);
                                    },
                                });
                            })];
                    case 9:
                        report = _b.sent();
                        expect(report === null || report === void 0 ? void 0 : report.reportID).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not delete the transaction thread if there are visible comments in the thread', function () { return __awaiter(void 0, void 0, void 0, function () {
            var participantAccountIDs, userLogins, resultAction, resultActionAfter;
            var _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: 
                    // Given initial environment is set up
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        // Given initial environment is set up
                        _e.sent();
                        // Given a transaction thread
                        thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
                        expect(thread.participants).toEqual((_a = {}, _a[CARLOS_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN, role: CONST_1.default.REPORT.ROLE.ADMIN }, _a));
                        participantAccountIDs = Object.keys((_b = thread.participants) !== null && _b !== void 0 ? _b : {}).map(Number);
                        userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
                        jest.advanceTimersByTime(10);
                        (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction === null || createIOUAction === void 0 ? void 0 : createIOUAction.reportActionID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _e.sent();
                        react_native_onyx_1.default.connect({
                            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(thread.reportID),
                            callback: function (val) { return (reportActions = val); },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(thread.reportID),
                                    callback: function (report) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(report).toBeTruthy();
                                        resolve();
                                    },
                                });
                            })];
                    case 4:
                        _e.sent();
                        jest.advanceTimersByTime(10);
                        // When a comment is added
                        (0, Report_1.addComment)(thread.reportID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _e.sent();
                        resultAction = Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).find(function (reportAction) { return (reportAction === null || reportAction === void 0 ? void 0 : reportAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT; });
                        reportActionID = resultAction === null || resultAction === void 0 ? void 0 : resultAction.reportActionID;
                        expect(resultAction === null || resultAction === void 0 ? void 0 : resultAction.message).toEqual(REPORT_ACTION.message);
                        expect(resultAction === null || resultAction === void 0 ? void 0 : resultAction.person).toEqual(REPORT_ACTION.person);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _e.sent();
                        // Then the report should have 2 actions
                        expect(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).length).toBe(2);
                        resultActionAfter = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : undefined;
                        expect(resultActionAfter === null || resultActionAfter === void 0 ? void 0 : resultActionAfter.pendingAction).toBeUndefined();
                        (_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _c === void 0 ? void 0 : _c.call(mockFetch);
                        if (transaction && createIOUAction) {
                            // When deleting expense
                            (0, IOU_1.deleteMoneyRequest)(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID, createIOUAction, {}, {});
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 7:
                        _e.sent();
                        // Then the transaction thread report should still exist
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(thread.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (report) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(report).toBeTruthy();
                                        resolve();
                                    },
                                });
                            })];
                    case 8:
                        // Then the transaction thread report should still exist
                        _e.sent();
                        // When fetch resumes
                        // Then the transaction thread report should still exist
                        (_d = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _d === void 0 ? void 0 : _d.call(mockFetch);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(thread.reportID),
                                    callback: function (report) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(report).toBeTruthy();
                                        resolve();
                                    },
                                });
                            })];
                    case 9:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('update the moneyRequestPreview to show [Deleted expense] when appropriate', function () { return __awaiter(void 0, void 0, void 0, function () {
            var participantAccountIDs, userLogins, allReportActions, reportActionsForIOUReport, resultAction, resultActionAfterUpdate;
            var _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _e.sent();
                        // Given a thread report
                        jest.advanceTimersByTime(10);
                        thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
                        expect(thread.participants).toStrictEqual((_a = {}, _a[CARLOS_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN, role: CONST_1.default.REPORT.ROLE.ADMIN }, _a));
                        react_native_onyx_1.default.connect({
                            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(thread.reportID),
                            callback: function (val) { return (reportActions = val); },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _e.sent();
                        jest.advanceTimersByTime(10);
                        participantAccountIDs = Object.keys((_b = thread.participants) !== null && _b !== void 0 ? _b : {}).map(Number);
                        userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
                        (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction === null || createIOUAction === void 0 ? void 0 : createIOUAction.reportActionID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                                    waitForCollectionCallback: true,
                                    callback: function (actions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(actions);
                                    },
                                });
                            })];
                    case 4:
                        allReportActions = _e.sent();
                        reportActionsForIOUReport = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID)];
                        createIOUAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) {
                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                        });
                        expect(createIOUAction === null || createIOUAction === void 0 ? void 0 : createIOUAction.childReportID).toBe(thread.reportID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _e.sent();
                        // Given an added comment to the thread report
                        jest.advanceTimersByTime(10);
                        (0, Report_1.addComment)(thread.reportID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _e.sent();
                        // Fetch the updated IOU Action from Onyx due to addition of comment to transaction thread.
                        // This needs to be fetched as `deleteMoneyRequest` depends on `childVisibleActionCount` in `createIOUAction`.
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (reportActionsForReport) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        createIOUAction = Object.values(reportActionsForReport !== null && reportActionsForReport !== void 0 ? reportActionsForReport : {}).find(function (reportAction) {
                                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                                        });
                                        resolve();
                                    },
                                });
                            })];
                    case 7:
                        // Fetch the updated IOU Action from Onyx due to addition of comment to transaction thread.
                        // This needs to be fetched as `deleteMoneyRequest` depends on `childVisibleActionCount` in `createIOUAction`.
                        _e.sent();
                        resultAction = Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).find(function (reportAction) { return (reportAction === null || reportAction === void 0 ? void 0 : reportAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT; });
                        reportActionID = resultAction === null || resultAction === void 0 ? void 0 : resultAction.reportActionID;
                        expect(resultAction === null || resultAction === void 0 ? void 0 : resultAction.message).toEqual(REPORT_ACTION.message);
                        expect(resultAction === null || resultAction === void 0 ? void 0 : resultAction.person).toEqual(REPORT_ACTION.person);
                        expect(resultAction === null || resultAction === void 0 ? void 0 : resultAction.pendingAction).toBeUndefined();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 8:
                        _e.sent();
                        // Verify there are three actions (created + addcomment) and our optimistic comment has been removed
                        expect(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).length).toBe(2);
                        resultActionAfterUpdate = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : undefined;
                        // Verify that our action is no longer in the loading state
                        expect(resultActionAfterUpdate === null || resultActionAfterUpdate === void 0 ? void 0 : resultActionAfterUpdate.pendingAction).toBeUndefined();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 9:
                        _e.sent();
                        // Given an added comment to the IOU report
                        react_native_onyx_1.default.connect({
                            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(IOU_REPORT_ID),
                            callback: function (val) { return (reportActions = val); },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 10:
                        _e.sent();
                        jest.advanceTimersByTime(10);
                        if (IOU_REPORT_ID) {
                            (0, Report_1.addComment)(IOU_REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 11:
                        _e.sent();
                        resultAction = Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).find(function (reportAction) { return (reportAction === null || reportAction === void 0 ? void 0 : reportAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT; });
                        reportActionID = resultAction === null || resultAction === void 0 ? void 0 : resultAction.reportActionID;
                        expect(resultAction === null || resultAction === void 0 ? void 0 : resultAction.message).toEqual(REPORT_ACTION.message);
                        expect(resultAction === null || resultAction === void 0 ? void 0 : resultAction.person).toEqual(REPORT_ACTION.person);
                        expect(resultAction === null || resultAction === void 0 ? void 0 : resultAction.pendingAction).toBeUndefined();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 12:
                        _e.sent();
                        // Verify there are three actions (created + iou + addcomment) and our optimistic comment has been removed
                        expect(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).length).toBe(3);
                        resultActionAfterUpdate = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : undefined;
                        // Verify that our action is no longer in the loading state
                        expect(resultActionAfterUpdate === null || resultActionAfterUpdate === void 0 ? void 0 : resultActionAfterUpdate.pendingAction).toBeUndefined();
                        (_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _c === void 0 ? void 0 : _c.call(mockFetch);
                        if (transaction && createIOUAction) {
                            // When we delete the expense
                            (0, IOU_1.deleteMoneyRequest)(transaction.transactionID, createIOUAction, {}, {});
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 13:
                        _e.sent();
                        // Then we expect the moneyRequestPreview to show [Deleted expense]
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (reportActionsForReport) {
                                        var _a;
                                        react_native_onyx_1.default.disconnect(connection);
                                        createIOUAction = Object.values(reportActionsForReport !== null && reportActionsForReport !== void 0 ? reportActionsForReport : {}).find(function (reportAction) {
                                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                                        });
                                        expect((_a = (0, ReportActionsUtils_1.getReportActionMessage)(createIOUAction)) === null || _a === void 0 ? void 0 : _a.isDeletedParentAction).toBeTruthy();
                                        resolve();
                                    },
                                });
                            })];
                    case 14:
                        // Then we expect the moneyRequestPreview to show [Deleted expense]
                        _e.sent();
                        // When we resume fetch
                        (_d = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _d === void 0 ? void 0 : _d.call(mockFetch);
                        // Then we expect the moneyRequestPreview to show [Deleted expense]
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (reportActionsForReport) {
                                        var _a;
                                        react_native_onyx_1.default.disconnect(connection);
                                        createIOUAction = Object.values(reportActionsForReport !== null && reportActionsForReport !== void 0 ? reportActionsForReport : {}).find(function (reportAction) {
                                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                                        });
                                        expect((_a = (0, ReportActionsUtils_1.getReportActionMessage)(createIOUAction)) === null || _a === void 0 ? void 0 : _a.isDeletedParentAction).toBeTruthy();
                                        resolve();
                                    },
                                });
                            })];
                    case 15:
                        // Then we expect the moneyRequestPreview to show [Deleted expense]
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('update IOU report and reportPreview with new totals and messages if the IOU report is not deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount2, comment2, iouPreview;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _c.sent();
                        react_native_onyx_1.default.connect({
                            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID),
                            callback: function (val) { return (iouReport = val); },
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _c.sent();
                        // Given a second expense in addition to the first one
                        jest.advanceTimersByTime(10);
                        amount2 = 20000;
                        comment2 = 'Send me money please 2';
                        if (chatReport) {
                            (0, IOU_1.requestMoney)({
                                report: chatReport,
                                participantParams: {
                                    payeeEmail: TEST_USER_LOGIN,
                                    payeeAccountID: TEST_USER_ACCOUNT_ID,
                                    participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID },
                                },
                                transactionParams: {
                                    amount: amount2,
                                    attendees: [],
                                    currency: CONST_1.default.CURRENCY.USD,
                                    created: '',
                                    merchant: '',
                                    comment: comment2,
                                },
                                shouldGenerateTransactionThreadReport: true,
                            });
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _c.sent();
                        // Then we expect the IOU report and reportPreview to update with new totals
                        expect(iouReport).toBeTruthy();
                        expect(iouReport).toHaveProperty('reportID');
                        expect(iouReport).toHaveProperty('chatReportID');
                        expect(iouReport === null || iouReport === void 0 ? void 0 : iouReport.total).toBe(30000);
                        iouPreview = (chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID) && (iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID) ? (0, ReportActionsUtils_1.getReportPreviewAction)(chatReport.reportID, iouReport.reportID) : undefined;
                        expect(iouPreview).toBeTruthy();
                        expect((0, ReportActionsUtils_1.getReportActionText)(iouPreview)).toBe('rory@expensifail.com owes $300.00');
                        // When we delete the first expense
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        jest.advanceTimersByTime(10);
                        if (transaction && createIOUAction) {
                            (0, IOU_1.deleteMoneyRequest)(transaction.transactionID, createIOUAction, {}, {});
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _c.sent();
                        // Then we expect the IOU report and reportPreview to update with new totals
                        expect(iouReport).toBeTruthy();
                        expect(iouReport).toHaveProperty('reportID');
                        expect(iouReport).toHaveProperty('chatReportID');
                        expect(iouReport === null || iouReport === void 0 ? void 0 : iouReport.total).toBe(20000);
                        // When we resume
                        (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                        // Then we expect the IOU report and reportPreview to update with new totals
                        expect(iouReport).toBeTruthy();
                        expect(iouReport).toHaveProperty('reportID');
                        expect(iouReport).toHaveProperty('chatReportID');
                        expect(iouReport === null || iouReport === void 0 ? void 0 : iouReport.total).toBe(20000);
                        return [2 /*return*/];
                }
            });
        }); });
        it('navigate the user correctly to the iou Report when appropriate', function () { return __awaiter(void 0, void 0, void 0, function () {
            var participantAccountIDs, userLogins, allReportActions, reportActionsForIOUReport, navigateToAfterDelete, allReports;
            var _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // Given multiple expenses on an IOU report
                        (0, IOU_1.requestMoney)({
                            report: chatReport,
                            participantParams: {
                                payeeEmail: TEST_USER_LOGIN,
                                payeeAccountID: TEST_USER_ACCOUNT_ID,
                                participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID },
                            },
                            transactionParams: {
                                amount: amount,
                                attendees: [],
                                currency: CONST_1.default.CURRENCY.USD,
                                created: '',
                                merchant: '',
                                comment: comment,
                            },
                            shouldGenerateTransactionThreadReport: true,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _e.sent();
                        // Given a thread report
                        jest.advanceTimersByTime(10);
                        thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
                        expect(thread.participants).toStrictEqual((_a = {}, _a[CARLOS_ACCOUNT_ID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN, role: CONST_1.default.REPORT.ROLE.ADMIN }, _a));
                        jest.advanceTimersByTime(10);
                        participantAccountIDs = Object.keys((_b = thread.participants) !== null && _b !== void 0 ? _b : {}).map(Number);
                        userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
                        (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction === null || createIOUAction === void 0 ? void 0 : createIOUAction.reportActionID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                                    waitForCollectionCallback: true,
                                    callback: function (actions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(actions);
                                    },
                                });
                            })];
                    case 3:
                        allReportActions = _e.sent();
                        reportActionsForIOUReport = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport === null || chatReport === void 0 ? void 0 : chatReport.iouReportID)];
                        createIOUAction = Object.values(reportActionsForIOUReport !== null && reportActionsForIOUReport !== void 0 ? reportActionsForIOUReport : {}).find(function (reportAction) {
                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                        });
                        expect(createIOUAction === null || createIOUAction === void 0 ? void 0 : createIOUAction.childReportID).toBe(thread.reportID);
                        // When we delete the expense, we should not delete the IOU report
                        (_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _c === void 0 ? void 0 : _c.call(mockFetch);
                        if (transaction && createIOUAction) {
                            navigateToAfterDelete = (0, IOU_1.deleteMoneyRequest)(transaction.transactionID, createIOUAction, {}, {}, true);
                        }
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                    waitForCollectionCallback: true,
                                    callback: function (reports) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reports);
                                    },
                                });
                            })];
                    case 4:
                        allReports = _e.sent();
                        iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (0, ReportUtils_1.isIOUReport)(report); });
                        expect(iouReport).toBeTruthy();
                        expect(iouReport).toHaveProperty('reportID');
                        expect(iouReport).toHaveProperty('chatReportID');
                        return [4 /*yield*/, ((_d = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _d === void 0 ? void 0 : _d.call(mockFetch))];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                    waitForCollectionCallback: true,
                                    callback: function (reports) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(reports);
                                    },
                                });
                            })];
                    case 6:
                        allReports = _e.sent();
                        iouReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (0, ReportUtils_1.isIOUReport)(report); });
                        expect(iouReport).toBeTruthy();
                        expect(iouReport).toHaveProperty('reportID');
                        expect(iouReport).toHaveProperty('chatReportID');
                        // Then we expect to navigate to the iou report
                        expect(IOU_REPORT_ID).not.toBeUndefined();
                        if (IOU_REPORT_ID) {
                            expect(navigateToAfterDelete).toEqual(ROUTES_1.default.REPORT_WITH_ID.getRoute(IOU_REPORT_ID));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('navigate the user correctly to the chat Report when appropriate', function () {
            var navigateToAfterDelete;
            if (transaction && createIOUAction) {
                // When we delete the expense and we should delete the IOU report
                navigateToAfterDelete = (0, IOU_1.deleteMoneyRequest)(transaction.transactionID, createIOUAction, {}, {});
            }
            // Then we expect to navigate to the chat report
            expect(chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID).not.toBeUndefined();
            if (chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID) {
                expect(navigateToAfterDelete).toEqual(ROUTES_1.default.REPORT_WITH_ID.getRoute(chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID));
            }
        });
    });
    describe('submitReport', function () {
        it('correctly submits a report', function () {
            var amount = 10000;
            var comment = '💸💸💸💸';
            var merchant = 'NASDAQ';
            var expenseReport;
            var chatReport;
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () {
                var policyID = (0, Policy_1.generatePolicyID)();
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                    policyID: policyID,
                });
                // Change the approval mode for the policy since default is Submit and Close
                (0, Policy_1.setWorkspaceApprovalMode)(policyID, CARLOS_EMAIL, CONST_1.default.POLICY.APPROVAL_MODE.BASIC);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport.reportID },
                        },
                        transactionParams: {
                            amount: amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant: merchant,
                            comment: comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                            react_native_onyx_1.default.merge("report_".concat(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID), {
                                statusNum: 0,
                                stateNum: 0,
                            });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                            // Verify report is a draft
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.stateNum).toBe(0);
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.statusNum).toBe(0);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                if (expenseReport) {
                    (0, IOU_1.submitReport)(expenseReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                            // Report was submitted correctly
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.stateNum).toBe(1);
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.statusNum).toBe(1);
                            resolve();
                        },
                    });
                });
            });
        });
        it('correctly submits a report with Submit and Close approval mode', function () {
            var amount = 10000;
            var comment = '💸💸💸💸';
            var merchant = 'NASDAQ';
            var expenseReport;
            var chatReport;
            var policy;
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () {
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                    policyID: undefined,
                    engagementChoice: CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT,
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport.reportID },
                        },
                        transactionParams: {
                            amount: amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant: merchant,
                            comment: comment,
                            reimbursable: true,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.POLICY,
                        waitForCollectionCallback: true,
                        callback: function (allPolicies) {
                            react_native_onyx_1.default.disconnect(connection);
                            policy = Object.values(allPolicies !== null && allPolicies !== void 0 ? allPolicies : {}).find(function (p) { return (p === null || p === void 0 ? void 0 : p.name) === "Carlos's Workspace"; });
                            expect(policy).toBeTruthy();
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                            react_native_onyx_1.default.merge("report_".concat(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID), {
                                statusNum: 0,
                                stateNum: 0,
                            });
                            resolve();
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(true);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(true);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                            resolve();
                            // Verify report is a draft
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.stateNum).toBe(0);
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.statusNum).toBe(0);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                        },
                    });
                });
            })
                .then(function () {
                if (expenseReport) {
                    (0, IOU_1.submitReport)(expenseReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                            resolve();
                            // Report is closed since the default policy settings is Submit and Close
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.stateNum).toBe(2);
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.statusNum).toBe(2);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(true);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(true);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                        },
                    });
                });
            })
                .then(function () {
                if (policy) {
                    (0, Policy_1.deleteWorkspace)(policy.id, policy.name, undefined);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                            resolve();
                        },
                    });
                });
            });
        });
        it('correctly implements error handling', function () {
            var amount = 10000;
            var comment = '💸💸💸💸';
            var merchant = 'NASDAQ';
            var expenseReport;
            var chatReport;
            var policy;
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () {
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                    policyID: undefined,
                    engagementChoice: CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT,
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport.reportID },
                        },
                        transactionParams: {
                            amount: amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant: merchant,
                            comment: comment,
                            reimbursable: true,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.POLICY,
                        waitForCollectionCallback: true,
                        callback: function (allPolicies) {
                            react_native_onyx_1.default.disconnect(connection);
                            policy = Object.values(allPolicies !== null && allPolicies !== void 0 ? allPolicies : {}).find(function (p) { return (p === null || p === void 0 ? void 0 : p.name) === "Carlos's Workspace"; });
                            expect(policy).toBeTruthy();
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                            react_native_onyx_1.default.merge("report_".concat(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID), {
                                statusNum: 0,
                                stateNum: 0,
                            });
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(true);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(true);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                            // Verify report is a draft
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.stateNum).toBe(0);
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.statusNum).toBe(0);
                            resolve();
                        },
                    });
                });
            })
                .then(function () {
                var _a;
                (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.fail) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                if (expenseReport) {
                    (0, IOU_1.submitReport)(expenseReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: ONYXKEYS_1.default.COLLECTION.REPORT,
                        waitForCollectionCallback: true,
                        callback: function (allReports) {
                            react_native_onyx_1.default.disconnect(connection);
                            expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                            // Report was submitted with some fail
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.stateNum).toBe(0);
                            expect(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.statusNum).toBe(0);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                            expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('resolveDuplicate', function () {
        test('Resolving duplicates of two transaction by keeping one of them should properly set the other one on hold even if the transaction thread reports do not exist in onyx', function () {
            var _a, _b;
            // Given two duplicate transactions
            var iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            var transaction1 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            var transaction2 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            var transactionCollectionDataSet = (_a = {},
                _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction1.transactionID)] = transaction1,
                _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction2.transactionID)] = transaction2,
                _a);
            var iouActions = [];
            [transaction1, transaction2].forEach(function (transaction) {
                return iouActions.push((0, ReportUtils_1.buildOptimisticIOUReportAction)({
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    comment: '',
                    participants: [],
                    transactionID: transaction.transactionID,
                }));
            });
            var actions = {};
            iouActions.forEach(function (iouAction) { return (actions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouAction.reportActionID)] = iouAction); });
            var actionCollectionDataSet = (_b = {}, _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID)] = actions, _b);
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () { return react_native_onyx_1.default.multiSet(__assign(__assign({}, transactionCollectionDataSet), actionCollectionDataSet)); })
                .then(function () {
                // When resolving duplicates with transaction thread reports no existing in onyx
                (0, IOU_1.resolveDuplicates)(__assign(__assign({}, transaction1), { receiptID: 1, category: '', comment: '', billable: false, reimbursable: true, tag: '', transactionIDList: [transaction2.transactionID] }));
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction2.transactionID),
                        callback: function (transaction) {
                            var _a;
                            react_native_onyx_1.default.disconnect(connection);
                            // Then the duplicate transaction should correctly be set on hold.
                            expect((_a = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _a === void 0 ? void 0 : _a.hold).toBeDefined();
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('bulkHold', function () {
        test('Bulk hold transactions without transaction threads', function () {
            var _a, _b, _c, _d, _e;
            var iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 300, '1', 'USD');
            var transaction1 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
                existingTransactionID: '1',
            });
            var transaction2 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 200,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
                existingTransactionID: '2',
            });
            var iouAction1 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction1.amount,
                currency: transaction1.currency,
                comment: '',
                participants: [],
                iouReportID: iouReport.reportID,
                transactionID: transaction1.transactionID,
            });
            var iouAction2 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction2.amount,
                currency: transaction2.currency,
                comment: '',
                participants: [],
                iouReportID: iouReport.reportID,
                transactionID: transaction2.transactionID,
            });
            var reportCollection = (_a = {},
                _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport.reportID)] = iouReport,
                _a);
            var transactionsIOUActions = (_b = {},
                _b[transaction1.transactionID] = iouAction1,
                _b[transaction2.transactionID] = iouAction2,
                _b);
            var transactionCollection = (_c = {},
                _c["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction1.transactionID)] = transaction1,
                _c["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction2.transactionID)] = transaction2,
                _c);
            var actionCollection = (_d = {},
                _d["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID)] = (_e = {},
                    _e["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouAction1.reportActionID)] = iouAction1,
                    _e["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouAction2.reportActionID)] = iouAction2,
                    _e),
                _d);
            var comment = 'Bulk Hold';
            return react_native_onyx_1.default.multiSet(__assign(__assign(__assign({}, reportCollection), transactionCollection), actionCollection))
                .then(waitForBatchedUpdates_1.default)
                .then(function () {
                var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID); }).result;
                (0, IOU_1.bulkHold)(comment, result.current.report, result.current.ancestorReportsAndReportActions, transactionCollection, {}, transactionsIOUActions);
            })
                .then(waitForBatchedUpdates_1.default)
                .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                var expectedViolations, transaction1Violation, transaction2Violation, report;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expectedViolations = [
                                {
                                    name: CONST_1.default.VIOLATIONS.HOLD,
                                    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                                    showInReview: true,
                                },
                            ];
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transaction1.transactionID))];
                        case 1:
                            transaction1Violation = _a.sent();
                            expect(transaction1Violation).toMatchObject(expectedViolations);
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transaction2.transactionID))];
                        case 2:
                            transaction2Violation = _a.sent();
                            expect(transaction2Violation).toMatchObject(expectedViolations);
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport.reportID))];
                        case 3:
                            report = _a.sent();
                            expect(report === null || report === void 0 ? void 0 : report.unheldTotal).toEqual(-300);
                            expect(report === null || report === void 0 ? void 0 : report.unheldNonReimbursableTotal).toBeUndefined();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        test('Bulk hold transactions with optimistic transaction threads', function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var iouReportID = '12';
            var expenseChatReportID = '34';
            var reportPreviewActionID = '7890';
            var transaction1ThreadReportID = '12345';
            var transaction2ThreadReportID = '67890';
            var transaction1 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReportID,
                },
                existingTransactionID: '1',
            });
            var transaction2 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 200,
                    currency: 'USD',
                    reportID: iouReportID,
                },
                existingTransactionID: '2',
            });
            var iouAction1 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction1.amount,
                currency: transaction1.currency,
                comment: '',
                participants: [],
                iouReportID: iouReportID,
                transactionID: transaction1.transactionID,
            });
            var iouAction2 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction2.amount,
                currency: transaction2.currency,
                comment: '',
                participants: [],
                iouReportID: iouReportID,
                transactionID: transaction2.transactionID,
            });
            var iouReport = __assign(__assign({}, (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 300, undefined, 'USD', false, reportPreviewActionID, iouReportID)), { parentReportID: expenseChatReportID });
            var transaction1ThreadCreatedAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)('rory@expensifail.com');
            var transaction2ThreadCreatedAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)('rory@expensifail.com');
            var transaction1Thread = (0, ReportUtils_1.buildTransactionThread)(iouAction1, iouReport, undefined, transaction1ThreadReportID);
            var transaction2Thread = (0, ReportUtils_1.buildTransactionThread)(iouAction2, iouReport, undefined, transaction2ThreadReportID);
            var transaction1IOUAction = __assign(__assign({}, iouAction1), { childReportID: transaction1Thread.reportID });
            var transaction2IOUAction = __assign(__assign({}, iouAction2), { childReportID: transaction2Thread.reportID });
            var expenseChatReport = {
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                reportID: expenseChatReportID,
            };
            var reportPreviewAction = (0, ReportUtils_1.updateReportPreview)(iouReport, (0, ReportUtils_1.buildOptimisticReportPreview)(expenseChatReport, iouReport, undefined, transaction1, iouReportID, reportPreviewActionID), false, undefined, transaction2);
            var transactionThreads = (_a = {},
                _a[transaction1.transactionID] = transaction1Thread,
                _a[transaction2.transactionID] = transaction2Thread,
                _a);
            var transactionsIOUActions = (_b = {},
                _b[transaction1.transactionID] = transaction1IOUAction,
                _b[transaction2.transactionID] = transaction2IOUAction,
                _b);
            var transactionCollection = (_c = {},
                _c["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction1.transactionID)] = transaction1,
                _c["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction2.transactionID)] = transaction2,
                _c);
            var reportCollection = (_d = {},
                _d["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transaction1Thread.reportID)] = transaction1Thread,
                _d["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transaction2Thread.reportID)] = transaction2Thread,
                _d["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(expenseChatReport.reportID)] = expenseChatReport,
                _d["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport.reportID)] = iouReport,
                _d);
            var actionCollection = (_e = {},
                _e["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transaction1Thread.reportID)] = (_f = {},
                    _f[transaction1ThreadCreatedAction.reportActionID] = transaction1ThreadCreatedAction,
                    _f),
                _e["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transaction2Thread.reportID)] = (_g = {},
                    _g[transaction2ThreadCreatedAction.reportActionID] = transaction2ThreadCreatedAction,
                    _g),
                _e["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID)] = (_h = {},
                    _h[transaction1IOUAction.reportActionID] = transaction1IOUAction,
                    _h[transaction2IOUAction.reportActionID] = transaction2IOUAction,
                    _h),
                _e["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseChatReport.reportID)] = (_j = {},
                    _j[reportPreviewAction.reportActionID] = reportPreviewAction,
                    _j),
                _e);
            react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.TRANSACTION, transactionCollection);
            react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, actionCollection);
            react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.REPORT, reportCollection);
            var comment = 'Bulk Hold';
            return (0, waitForBatchedUpdates_1.default)().then(function () { return __awaiter(void 0, void 0, void 0, function () {
                var result, expectedViolations, transaction1Violation, transaction2Violation, transaction1ThreadReport, transaction1ThreadReportActions, _a, _b, transaction1ThreadReportLastAction, transaction1ThreadReportLastActionMessage, transaction2ThreadReport, transaction2ThreadReportActions, _c, _d, transaction2ThreadReportLastAction, transaction2ThreadReportLastActionMessage, report, iouReportActions, _e, _f, expenseChatReportActions, _g, _h;
                var _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
                return __generator(this, function (_0) {
                    switch (_0.label) {
                        case 0:
                            result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID, true); }).result;
                            expect(result.current.ancestorReportsAndReportActions).toHaveLength(1); // 1 Policy expense chat report
                            expect((_l = (_k = (_j = result.current.ancestorReportsAndReportActions) === null || _j === void 0 ? void 0 : _j.at(0)) === null || _k === void 0 ? void 0 : _k.report) === null || _l === void 0 ? void 0 : _l.reportID).toBe(expenseChatReportID);
                            expect((_p = (_o = (_m = result.current.ancestorReportsAndReportActions) === null || _m === void 0 ? void 0 : _m.at(0)) === null || _o === void 0 ? void 0 : _o.reportAction) === null || _p === void 0 ? void 0 : _p.reportActionID).toBe(reportPreviewAction.reportActionID);
                            (0, IOU_1.bulkHold)(comment, result.current.report, result.current.ancestorReportsAndReportActions, transactionCollection, {}, transactionsIOUActions, transactionThreads);
                            expectedViolations = [
                                {
                                    name: CONST_1.default.VIOLATIONS.HOLD,
                                    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                                    showInReview: true,
                                },
                            ];
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transaction1.transactionID))];
                        case 1:
                            transaction1Violation = _0.sent();
                            expect(transaction1Violation).toMatchObject(expectedViolations);
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transaction2.transactionID))];
                        case 2:
                            transaction2Violation = _0.sent();
                            expect(transaction2Violation).toMatchObject(expectedViolations);
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transaction1Thread.reportID))];
                        case 3:
                            transaction1ThreadReport = _0.sent();
                            _b = (_a = Object).values;
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transaction1Thread.reportID))];
                        case 4:
                            transaction1ThreadReportActions = _b.apply(_a, [(_q = (_0.sent())) !== null && _q !== void 0 ? _q : {}]);
                            transaction1ThreadReportLastAction = (0, ReportActionsUtils_1.getSortedReportActions)(transaction1ThreadReportActions, true).at(0);
                            transaction1ThreadReportLastActionMessage = (0, ReportActionsUtils_1.getReportActionMessage)(transaction1ThreadReportLastAction);
                            expect(transaction1ThreadReportActions).toHaveLength(3); // 1 created action + 2 hold actions
                            expect(transaction1ThreadReportLastActionMessage === null || transaction1ThreadReportLastActionMessage === void 0 ? void 0 : transaction1ThreadReportLastActionMessage.text).toBe(comment);
                            expect(transaction1ThreadReport === null || transaction1ThreadReport === void 0 ? void 0 : transaction1ThreadReport.lastVisibleActionCreated).toBe(transaction1ThreadReportLastAction === null || transaction1ThreadReportLastAction === void 0 ? void 0 : transaction1ThreadReportLastAction.created);
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transaction2Thread.reportID))];
                        case 5:
                            transaction2ThreadReport = _0.sent();
                            _d = (_c = Object).values;
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transaction2Thread.reportID))];
                        case 6:
                            transaction2ThreadReportActions = _d.apply(_c, [(_r = (_0.sent())) !== null && _r !== void 0 ? _r : {}]);
                            transaction2ThreadReportLastAction = (0, ReportActionsUtils_1.getSortedReportActions)(Object.values(transaction2ThreadReportActions !== null && transaction2ThreadReportActions !== void 0 ? transaction2ThreadReportActions : {}), true).at(0);
                            transaction2ThreadReportLastActionMessage = (0, ReportActionsUtils_1.getReportActionMessage)(transaction2ThreadReportLastAction);
                            expect(transaction2ThreadReportActions).toHaveLength(3); // 1 created action + 2 hold actions
                            expect(transaction2ThreadReportLastActionMessage === null || transaction2ThreadReportLastActionMessage === void 0 ? void 0 : transaction2ThreadReportLastActionMessage.text).toBe(comment);
                            expect(transaction2ThreadReport === null || transaction2ThreadReport === void 0 ? void 0 : transaction2ThreadReport.lastVisibleActionCreated).toBe(transaction2ThreadReportLastAction === null || transaction2ThreadReportLastAction === void 0 ? void 0 : transaction2ThreadReportLastAction.created);
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport.reportID))];
                        case 7:
                            report = _0.sent();
                            expect(report === null || report === void 0 ? void 0 : report.unheldTotal).toEqual(-300);
                            expect(report === null || report === void 0 ? void 0 : report.unheldNonReimbursableTotal).toBeUndefined();
                            _f = (_e = Object).values;
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID))];
                        case 8:
                            iouReportActions = _f.apply(_e, [(_s = (_0.sent())) !== null && _s !== void 0 ? _s : {}]);
                            expect(iouReportActions).toHaveLength(2); // 2 iou actions
                            expect((_t = iouReportActions.at(0)) === null || _t === void 0 ? void 0 : _t.childCommenterCount).toBe(1);
                            expect((_u = iouReportActions.at(1)) === null || _u === void 0 ? void 0 : _u.childCommenterCount).toBe(1);
                            expect((_v = iouReportActions.at(0)) === null || _v === void 0 ? void 0 : _v.childVisibleActionCount).toBe(1);
                            expect((_w = iouReportActions.at(1)) === null || _w === void 0 ? void 0 : _w.childVisibleActionCount).toBe(1);
                            _h = (_g = Object).values;
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseChatReport.reportID))];
                        case 9:
                            expenseChatReportActions = _h.apply(_g, [(_x = (_0.sent())) !== null && _x !== void 0 ? _x : {}]);
                            expect(expenseChatReportActions).toHaveLength(1); // 1 report preview action
                            expect((_y = expenseChatReportActions.at(0)) === null || _y === void 0 ? void 0 : _y.childCommenterCount).toBe(1);
                            expect((_z = expenseChatReportActions.at(0)) === null || _z === void 0 ? void 0 : _z.childVisibleActionCount).toBe(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('putOnHold', function () {
        test("should update the transaction thread report's lastVisibleActionCreated to the optimistically added hold comment report action created timestamp", function () {
            var _a, _b, _c, _d;
            var iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            var transaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            var transactionCollectionDataSet = (_a = {},
                _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction.transactionID)] = transaction,
                _a);
            var iouAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            });
            var transactionThread = (0, ReportUtils_1.buildTransactionThread)(iouAction, iouReport);
            var actions = (_b = {}, _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouAction.reportActionID)] = iouAction, _b);
            var reportCollectionDataSet = (_c = {},
                _c["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionThread.reportID)] = transactionThread,
                _c["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport.reportID)] = iouReport,
                _c);
            var actionCollectionDataSet = (_d = {}, _d["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID)] = actions, _d);
            var comment = 'hold reason';
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () { return react_native_onyx_1.default.multiSet(__assign(__assign(__assign({}, reportCollectionDataSet), transactionCollectionDataSet), actionCollectionDataSet)); })
                .then(function () {
                var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID); }).result;
                // When an expense is put on hold
                (0, IOU_1.putOnHold)(transaction.transactionID, comment, result.current.ancestorReportsAndReportActions, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionThread.reportID),
                        callback: function (report) {
                            react_native_onyx_1.default.disconnect(connection);
                            var lastVisibleActionCreated = report === null || report === void 0 ? void 0 : report.lastVisibleActionCreated;
                            var connection2 = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transactionThread.reportID),
                                callback: function (reportActions) {
                                    react_native_onyx_1.default.disconnect(connection2);
                                    resolve();
                                    var lastAction = (0, ReportActionsUtils_1.getSortedReportActions)(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}), true).at(0);
                                    var message = (0, ReportActionsUtils_1.getReportActionMessage)(lastAction);
                                    // Then the transaction thread report lastVisibleActionCreated should equal the hold comment action created timestamp.
                                    expect(message === null || message === void 0 ? void 0 : message.text).toBe(comment);
                                    expect(lastVisibleActionCreated).toBe(lastAction === null || lastAction === void 0 ? void 0 : lastAction.created);
                                },
                            });
                        },
                    });
                });
            });
        });
        test('should create transaction thread optimistically when initialReportID is undefined', function () {
            var _a, _b, _c, _d;
            var iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            var transaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            var transactionCollectionDataSet = (_a = {},
                _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction.transactionID)] = transaction,
                _a);
            var iouAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            });
            var actions = (_b = {}, _b[iouAction.reportActionID] = iouAction, _b);
            var reportCollectionDataSet = (_c = {},
                _c["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport.reportID)] = iouReport,
                _c);
            var actionCollectionDataSet = (_d = {},
                _d["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID)] = actions,
                _d);
            var comment = 'hold reason for new thread';
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () { return react_native_onyx_1.default.multiSet(__assign(__assign(__assign({}, reportCollectionDataSet), transactionCollectionDataSet), actionCollectionDataSet)); })
                .then(function () {
                var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID); }).result;
                // When an expense is put on hold without existing transaction thread (undefined initialReportID)
                (0, IOU_1.putOnHold)(transaction.transactionID, comment, result.current.ancestorReportsAndReportActions, undefined);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID),
                        callback: function (reportActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            var updatedIOUAction = reportActions === null || reportActions === void 0 ? void 0 : reportActions[iouAction.reportActionID];
                            // Verify that IOU action now has childReportID set optimistically
                            expect(updatedIOUAction === null || updatedIOUAction === void 0 ? void 0 : updatedIOUAction.childReportID).toBeDefined();
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('unHoldRequest', function () {
        test("should update the transaction thread report's lastVisibleActionCreated to the optimistically added unhold report action created timestamp", function () {
            var _a, _b, _c, _d;
            var iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            var transaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            var transactionCollectionDataSet = (_a = {},
                _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction.transactionID)] = transaction,
                _a);
            var iouAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            });
            var transactionThread = (0, ReportUtils_1.buildTransactionThread)(iouAction, iouReport);
            var actions = (_b = {}, _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouAction.reportActionID)] = iouAction, _b);
            var reportCollectionDataSet = (_c = {},
                _c["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionThread.reportID)] = transactionThread,
                _c["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport.reportID)] = iouReport,
                _c);
            var actionCollectionDataSet = (_d = {}, _d["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID)] = actions, _d);
            var comment = 'hold reason';
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () { return react_native_onyx_1.default.multiSet(__assign(__assign(__assign({}, reportCollectionDataSet), transactionCollectionDataSet), actionCollectionDataSet)); })
                .then(function () {
                var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID); }).result;
                (0, IOU_1.putOnHold)(transaction.transactionID, comment, result.current.ancestorReportsAndReportActions, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                // When an expense is unhold
                (0, IOU_1.unholdRequest)(transaction.transactionID, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionThread.reportID),
                        callback: function (report) {
                            react_native_onyx_1.default.disconnect(connection);
                            var lastVisibleActionCreated = report === null || report === void 0 ? void 0 : report.lastVisibleActionCreated;
                            var connection2 = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transactionThread.reportID),
                                callback: function (reportActions) {
                                    react_native_onyx_1.default.disconnect(connection2);
                                    resolve();
                                    var lastAction = (0, ReportActionsUtils_1.getSortedReportActions)(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}), true).at(0);
                                    // Then the transaction thread report lastVisibleActionCreated should equal the unhold action created timestamp.
                                    expect(lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName).toBe(CONST_1.default.REPORT.ACTIONS.TYPE.UNHOLD);
                                    expect(lastVisibleActionCreated).toBe(lastAction === null || lastAction === void 0 ? void 0 : lastAction.created);
                                },
                            });
                        },
                    });
                });
            });
        });
        test('should rollback unhold request on API failure', function () {
            var _a, _b, _c, _d;
            var iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            var transaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            var transactionCollectionDataSet = (_a = {},
                _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction.transactionID)] = transaction,
                _a);
            var iouAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            });
            var transactionThread = (0, ReportUtils_1.buildTransactionThread)(iouAction, iouReport);
            var actions = (_b = {}, _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouAction.reportActionID)] = iouAction, _b);
            var reportCollectionDataSet = (_c = {},
                _c["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionThread.reportID)] = transactionThread,
                _c["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport.reportID)] = iouReport,
                _c);
            var actionCollectionDataSet = (_d = {}, _d["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport.reportID)] = actions, _d);
            var comment = 'hold reason';
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () { return react_native_onyx_1.default.multiSet(__assign(__assign(__assign({}, reportCollectionDataSet), transactionCollectionDataSet), actionCollectionDataSet)); })
                .then(function () {
                var result = (0, react_native_1.renderHook)(function () { return (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID); }).result;
                (0, IOU_1.putOnHold)(transaction.transactionID, comment, result.current.ancestorReportsAndReportActions, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                var _a;
                mockFetch.fail();
                (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                (0, IOU_1.unholdRequest)(transaction.transactionID, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                return new Promise(function (resolve) {
                    var connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction.transactionID),
                        callback: function (updatedTransaction) {
                            var _a, _b, _c;
                            react_native_onyx_1.default.disconnect(connection);
                            expect(updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.pendingAction).toBeFalsy();
                            expect((_a = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.comment) === null || _a === void 0 ? void 0 : _a.hold).toBeTruthy();
                            expect(Object.values((_b = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.errors) !== null && _b !== void 0 ? _b : {})).toEqual(Object.values((_c = (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericUnholdExpenseFailureMessage')) !== null && _c !== void 0 ? _c : {}));
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('sendInvoice', function () {
        it('creates a new invoice chat when one has been converted from individual to business', function () { return __awaiter(void 0, void 0, void 0, function () {
            var writeSpy, policy, transaction, convertedInvoiceChat, currentUserAccountID, companyName, companyWebsite;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        writeSpy = jest.spyOn(API, 'write').mockImplementation(jest.fn());
                        policy = InvoiceData.policy, transaction = InvoiceData.transaction, convertedInvoiceChat = InvoiceData.convertedInvoiceChat;
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(convertedInvoiceChat === null || convertedInvoiceChat === void 0 ? void 0 : convertedInvoiceChat.reportID), convertedInvoiceChat !== null && convertedInvoiceChat !== void 0 ? convertedInvoiceChat : {})];
                    case 1:
                        _a.sent();
                        currentUserAccountID = 32;
                        companyName = 'b1-53019';
                        companyWebsite = 'https://www.53019.com';
                        // When the user sends a new invoice to an individual
                        (0, IOU_1.sendInvoice)(currentUserAccountID, transaction, undefined, undefined, policy, undefined, undefined, companyName, companyWebsite);
                        // Then a new invoice chat is created instead of incorrectly using the invoice chat which has been converted from individual to business
                        expect(writeSpy).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
                            invoiceRoomReportID: expect.not.stringMatching(convertedInvoiceChat.reportID),
                        }), expect.anything());
                        writeSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not clear transaction pending action when send invoice fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Given a send invoice request
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        (0, IOU_1.sendInvoice)(1, (0, transaction_1.default)(1));
                        // When the request fails
                        (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.fail) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                        (_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _c === void 0 ? void 0 : _c.call(mockFetch);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _d.sent();
                        // Then the pending action of the optimistic transaction shouldn't be cleared
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                    waitForCollectionCallback: true,
                                    callback: function (allTransactions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        var transaction = Object.values(allTransactions).at(0);
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.errors).not.toBeUndefined();
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                                        resolve();
                                    },
                                });
                            })];
                    case 2:
                        // Then the pending action of the optimistic transaction shouldn't be cleared
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('canIOUBePaid', function () {
        it('For invoices from archived workspaces', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policy, chatReport, chatReportRNVP, invoiceReceiver, iouReport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policy = InvoiceData.policy, chatReport = InvoiceData.convertedInvoiceChat;
                        chatReportRNVP = { private_isArchived: DateUtils_1.default.getDBTime() };
                        invoiceReceiver = chatReport === null || chatReport === void 0 ? void 0 : chatReport.invoiceReceiver;
                        iouReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.INVOICE, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED });
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(invoiceReceiver.policyID), { id: invoiceReceiver.policyID, role: CONST_1.default.POLICY.ROLE.ADMIN })];
                    case 1:
                        _a.sent();
                        expect((0, IOU_1.canIOUBePaid)(iouReport, chatReport, policy, [], true)).toBe(true);
                        expect((0, IOU_1.canIOUBePaid)(iouReport, chatReport, policy, [], false)).toBe(true);
                        // When the invoice is archived
                        expect((0, IOU_1.canIOUBePaid)(iouReport, chatReport, policy, [], true, chatReportRNVP)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(iouReport, chatReport, policy, [], false, chatReportRNVP)).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setMoneyRequestCategory', function () {
        it('should set the associated tax for the category based on the tax expense rules', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionID, category, policyID, taxCode, ruleTaxCode, fakePolicy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionID = '1';
                        category = 'Advertising';
                        policyID = '2';
                        taxCode = 'id_TAX_EXEMPT';
                        ruleTaxCode = 'id_TAX_RATE_1';
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { taxRates: CONST_1.default.DEFAULT_TAX, rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) } });
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transactionID), {
                                taxCode: taxCode,
                                taxAmount: 0,
                                amount: 100,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                    case 2:
                        _a.sent();
                        // When setting the money request category
                        (0, IOU_1.setMoneyRequestCategory)(transactionID, category, policyID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _a.sent();
                        // Then the transaction tax rate and amount should be updated based on the expense rules
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transactionID),
                                    callback: function (transaction) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBe(ruleTaxCode);
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBe(5);
                                        resolve();
                                    },
                                });
                            })];
                    case 4:
                        // Then the transaction tax rate and amount should be updated based on the expense rules
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('should not change the tax', function () {
            it('if the transaction type is distance', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionID, category, policyID, taxCode, ruleTaxCode, taxAmount, fakePolicy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionID = '1';
                            category = 'Advertising';
                            policyID = '2';
                            taxCode = 'id_TAX_EXEMPT';
                            ruleTaxCode = 'id_TAX_RATE_1';
                            taxAmount = 0;
                            fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { taxRates: CONST_1.default.DEFAULT_TAX, rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) } });
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transactionID), {
                                    taxCode: taxCode,
                                    taxAmount: taxAmount,
                                    amount: 100,
                                    iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.DISTANCE,
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                        case 2:
                            _a.sent();
                            // When setting the money request category
                            (0, IOU_1.setMoneyRequestCategory)(transactionID, category, policyID);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 3:
                            _a.sent();
                            // Then the transaction tax rate and amount shouldn't be updated
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    var connection = react_native_onyx_1.default.connect({
                                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transactionID),
                                        callback: function (transaction) {
                                            react_native_onyx_1.default.disconnect(connection);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBe(taxCode);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBe(taxAmount);
                                            resolve();
                                        },
                                    });
                                })];
                        case 4:
                            // Then the transaction tax rate and amount shouldn't be updated
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('if there are no tax expense rules', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionID, category, policyID, taxCode, taxAmount, fakePolicy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionID = '1';
                            category = 'Advertising';
                            policyID = '2';
                            taxCode = 'id_TAX_EXEMPT';
                            taxAmount = 0;
                            fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { taxRates: CONST_1.default.DEFAULT_TAX, rules: {} });
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transactionID), {
                                    taxCode: taxCode,
                                    taxAmount: taxAmount,
                                    amount: 100,
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                        case 2:
                            _a.sent();
                            // When setting the money request category
                            (0, IOU_1.setMoneyRequestCategory)(transactionID, category, policyID);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 3:
                            _a.sent();
                            // Then the transaction tax rate and amount shouldn't be updated
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    var connection = react_native_onyx_1.default.connect({
                                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transactionID),
                                        callback: function (transaction) {
                                            react_native_onyx_1.default.disconnect(connection);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBe(taxCode);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBe(taxAmount);
                                            resolve();
                                        },
                                    });
                                })];
                        case 4:
                            // Then the transaction tax rate and amount shouldn't be updated
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should clear the tax when the policyID is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionID, taxCode, taxAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionID = '1';
                        taxCode = 'id_TAX_EXEMPT';
                        taxAmount = 0;
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transactionID), {
                                taxCode: taxCode,
                                taxAmount: taxAmount,
                                amount: 100,
                            })];
                    case 1:
                        _a.sent();
                        // When setting the money request category without a policyID
                        (0, IOU_1.setMoneyRequestCategory)(transactionID, '');
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        // Then the transaction tax should be cleared
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transactionID),
                                    callback: function (transaction) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBe('');
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBeUndefined();
                                        resolve();
                                    },
                                });
                            })];
                    case 3:
                        // Then the transaction tax should be cleared
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateMoneyRequestCategory', function () {
        it('should update the tax when there are tax expense rules', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionID, policyID, transactionThreadReportID, category, taxCode, ruleTaxCode, fakePolicy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionID = '1';
                        policyID = '2';
                        transactionThreadReportID = '3';
                        category = 'Advertising';
                        taxCode = 'id_TAX_EXEMPT';
                        ruleTaxCode = 'id_TAX_RATE_1';
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { taxRates: CONST_1.default.DEFAULT_TAX, rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) } });
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), {
                                taxCode: taxCode,
                                taxAmount: 0,
                                amount: 100,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionThreadReportID), { reportID: transactionThreadReportID })];
                    case 3:
                        _a.sent();
                        // When updating a money request category
                        (0, IOU_1.updateMoneyRequestCategory)(transactionID, transactionThreadReportID, category, fakePolicy, undefined, undefined);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _a.sent();
                        // Then the transaction tax rate and amount should be updated based on the expense rules
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID),
                                    callback: function (transaction) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBe(ruleTaxCode);
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBe(5);
                                        resolve();
                                    },
                                });
                            })];
                    case 5:
                        // Then the transaction tax rate and amount should be updated based on the expense rules
                        _a.sent();
                        // But the original message should only contains the old and new category data
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transactionThreadReportID),
                                    callback: function (reportActions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        var reportAction = Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).at(0);
                                        if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE)) {
                                            var originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction);
                                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.oldCategory).toBe('');
                                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.category).toBe(category);
                                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.oldTaxRate).toBeUndefined();
                                            expect(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.oldTaxAmount).toBeUndefined();
                                            resolve();
                                        }
                                    },
                                });
                            })];
                    case 6:
                        // But the original message should only contains the old and new category data
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('should not update the tax', function () {
            it('if the transaction type is distance', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionID, policyID, category, taxCode, taxAmount, ruleTaxCode, fakePolicy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionID = '1';
                            policyID = '2';
                            category = 'Advertising';
                            taxCode = 'id_TAX_EXEMPT';
                            taxAmount = 0;
                            ruleTaxCode = 'id_TAX_RATE_1';
                            fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { taxRates: CONST_1.default.DEFAULT_TAX, rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) } });
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), {
                                    taxCode: taxCode,
                                    taxAmount: taxAmount,
                                    amount: 100,
                                    comment: {
                                        type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                                        customUnit: {
                                            name: CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE,
                                        },
                                    },
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                        case 2:
                            _a.sent();
                            // When updating a money request category
                            (0, IOU_1.updateMoneyRequestCategory)(transactionID, '3', category, fakePolicy, undefined, undefined);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 3:
                            _a.sent();
                            // Then the transaction tax rate and amount shouldn't be updated
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    var connection = react_native_onyx_1.default.connect({
                                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID),
                                        callback: function (transaction) {
                                            react_native_onyx_1.default.disconnect(connection);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBe(taxCode);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBe(taxAmount);
                                            resolve();
                                        },
                                    });
                                })];
                        case 4:
                            // Then the transaction tax rate and amount shouldn't be updated
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('if there are no tax expense rules', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionID, policyID, category, fakePolicy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionID = '1';
                            policyID = '2';
                            category = 'Advertising';
                            fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { taxRates: CONST_1.default.DEFAULT_TAX, rules: {} });
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), { amount: 100 })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                        case 2:
                            _a.sent();
                            // When updating the money request category
                            (0, IOU_1.updateMoneyRequestCategory)(transactionID, '3', category, fakePolicy, undefined, undefined);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 3:
                            _a.sent();
                            // Then the transaction tax rate and amount shouldn't be updated
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    var connection = react_native_onyx_1.default.connect({
                                        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID),
                                        callback: function (transaction) {
                                            react_native_onyx_1.default.disconnect(connection);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBeUndefined();
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBeUndefined();
                                            resolve();
                                        },
                                    });
                                })];
                        case 4:
                            // Then the transaction tax rate and amount shouldn't be updated
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('setDraftSplitTransaction', function () {
        it('should set the associated tax for the category based on the tax expense rules', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionID, category, policyID, taxCode, ruleTaxCode, fakePolicy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionID = '1';
                        category = 'Advertising';
                        policyID = '2';
                        taxCode = 'id_TAX_EXEMPT';
                        ruleTaxCode = 'id_TAX_RATE_1';
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { taxRates: CONST_1.default.DEFAULT_TAX, rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) } });
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transactionID), {
                                taxCode: taxCode,
                                taxAmount: 0,
                                amount: 100,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                    case 2:
                        _a.sent();
                        // When setting a category of a draft split transaction
                        (0, IOU_1.setDraftSplitTransaction)(transactionID, { category: category }, fakePolicy);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _a.sent();
                        // Then the transaction tax rate and amount should be updated based on the expense rules
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transactionID),
                                    callback: function (transaction) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBe(ruleTaxCode);
                                        expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBe(5);
                                        resolve();
                                    },
                                });
                            })];
                    case 4:
                        // Then the transaction tax rate and amount should be updated based on the expense rules
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('should not change the tax', function () {
            it('if there are no tax expense rules', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionID, category, policyID, taxCode, taxAmount, fakePolicy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionID = '1';
                            category = 'Advertising';
                            policyID = '2';
                            taxCode = 'id_TAX_EXEMPT';
                            taxAmount = 0;
                            fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { taxRates: CONST_1.default.DEFAULT_TAX, rules: {} });
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transactionID), {
                                    taxCode: taxCode,
                                    taxAmount: taxAmount,
                                    amount: 100,
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                        case 2:
                            _a.sent();
                            // When setting a category of a draft split transaction
                            (0, IOU_1.setDraftSplitTransaction)(transactionID, { category: category }, fakePolicy);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 3:
                            _a.sent();
                            // Then the transaction tax rate and amount shouldn't be updated
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    var connection = react_native_onyx_1.default.connect({
                                        key: "".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transactionID),
                                        callback: function (transaction) {
                                            react_native_onyx_1.default.disconnect(connection);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBe(taxCode);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBe(taxAmount);
                                            resolve();
                                        },
                                    });
                                })];
                        case 4:
                            // Then the transaction tax rate and amount shouldn't be updated
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('if we are not updating category', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionID, category, policyID, ruleTaxCode, fakePolicy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionID = '1';
                            category = 'Advertising';
                            policyID = '2';
                            ruleTaxCode = 'id_TAX_RATE_1';
                            fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { taxRates: CONST_1.default.DEFAULT_TAX, rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) } });
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transactionID), { amount: 100 })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                        case 2:
                            _a.sent();
                            // When setting a draft split transaction without category update
                            (0, IOU_1.setDraftSplitTransaction)(transactionID, {}, fakePolicy);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 3:
                            _a.sent();
                            // Then the transaction tax rate and amount shouldn't be updated
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    var connection = react_native_onyx_1.default.connect({
                                        key: "".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transactionID),
                                        callback: function (transaction) {
                                            react_native_onyx_1.default.disconnect(connection);
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxCode).toBeUndefined();
                                            expect(transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount).toBeUndefined();
                                            resolve();
                                        },
                                    });
                                })];
                        case 4:
                            // Then the transaction tax rate and amount shouldn't be updated
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('should have valid parameters', function () {
        var writeSpy;
        var isValid = function (value) { return !value || typeof value !== 'object' || value instanceof Blob; };
        beforeEach(function () {
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            writeSpy = jest.spyOn(API, 'write').mockImplementation(jest.fn());
        });
        afterEach(function () {
            writeSpy.mockRestore();
        });
        test.each([
            [types_1.WRITE_COMMANDS.REQUEST_MONEY, CONST_1.default.IOU.ACTION.CREATE],
            [types_1.WRITE_COMMANDS.CONVERT_TRACKED_EXPENSE_TO_REQUEST, CONST_1.default.IOU.ACTION.SUBMIT],
        ])('%s', function (expectedCommand, action) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, command, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // When an expense is created
                        (0, IOU_1.requestMoney)({
                            action: action,
                            report: { reportID: '' },
                            participantParams: {
                                payeeEmail: RORY_EMAIL,
                                payeeAccountID: RORY_ACCOUNT_ID,
                                participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                            },
                            transactionParams: {
                                amount: 10000,
                                attendees: [],
                                currency: CONST_1.default.CURRENCY.USD,
                                created: '',
                                merchant: 'KFC',
                                comment: '',
                                linkedTrackedExpenseReportAction: {
                                    reportActionID: '',
                                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                                    created: '2024-10-30',
                                },
                                actionableWhisperReportActionID: '1',
                                linkedTrackedExpenseReportID: '1',
                            },
                            shouldGenerateTransactionThreadReport: true,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _b.sent();
                        // Then the correct API request should be made
                        expect(writeSpy).toHaveBeenCalledTimes(1);
                        _a = writeSpy.mock.calls.at(0), command = _a[0], params = _a[1];
                        expect(command).toBe(expectedCommand);
                        // And the parameters should be supported by XMLHttpRequest
                        Object.values(params).forEach(function (value) {
                            expect(Array.isArray(value) ? value.every(isValid) : isValid(value)).toBe(true);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        test.each([
            [types_1.WRITE_COMMANDS.TRACK_EXPENSE, CONST_1.default.IOU.ACTION.CREATE],
            [types_1.WRITE_COMMANDS.CATEGORIZE_TRACKED_EXPENSE, CONST_1.default.IOU.ACTION.CATEGORIZE],
            [types_1.WRITE_COMMANDS.SHARE_TRACKED_EXPENSE, CONST_1.default.IOU.ACTION.SHARE],
        ])('%s', function (expectedCommand, action) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, command, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // When a track expense is created
                        (0, IOU_1.trackExpense)({
                            report: { reportID: '123', policyID: 'A' },
                            isDraftPolicy: false,
                            action: action,
                            participantParams: {
                                payeeEmail: RORY_EMAIL,
                                payeeAccountID: RORY_ACCOUNT_ID,
                                participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                            },
                            transactionParams: {
                                amount: 10000,
                                currency: CONST_1.default.CURRENCY.USD,
                                created: '2024-10-30',
                                merchant: 'KFC',
                                receipt: {},
                                actionableWhisperReportActionID: '1',
                                linkedTrackedExpenseReportAction: {
                                    reportActionID: '',
                                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                                    created: '2024-10-30',
                                },
                                linkedTrackedExpenseReportID: '1',
                            },
                            accountantParams: action === CONST_1.default.IOU.ACTION.SHARE ? { accountant: { accountID: VIT_ACCOUNT_ID, login: VIT_EMAIL } } : undefined,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _b.sent();
                        // Then the correct API request should be made
                        expect(writeSpy).toHaveBeenCalledTimes(1);
                        _a = writeSpy.mock.calls.at(0), command = _a[0], params = _a[1];
                        expect(command).toBe(expectedCommand);
                        if (expectedCommand === types_1.WRITE_COMMANDS.SHARE_TRACKED_EXPENSE) {
                            expect(params).toHaveProperty('policyName');
                        }
                        // And the parameters should be supported by XMLHttpRequest
                        Object.values(params).forEach(function (value) {
                            expect(Array.isArray(value) ? value.every(isValid) : isValid(value)).toBe(true);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('canApproveIOU', function () {
        it('should return false if we have only pending card transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policyID, reportID, fakePolicy, fakeReport, fakeTransaction1, fakeTransaction2, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policyID = '2';
                        reportID = '1';
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { type: CONST_1.default.POLICY.TYPE.TEAM, approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC });
                        fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(Number(reportID))), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: policyID });
                        fakeTransaction1 = __assign(__assign({}, (0, transaction_1.default)(0)), { reportID: reportID, bank: CONST_1.default.EXPENSIFY_CARD.BANK, status: CONST_1.default.TRANSACTION.STATUS.PENDING });
                        fakeTransaction2 = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: reportID, bank: CONST_1.default.EXPENSIFY_CARD.BANK, status: CONST_1.default.TRANSACTION.STATUS.PENDING });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(fakeReport.reportID), fakeReport)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction1.transactionID), fakeTransaction1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction2.transactionID), fakeTransaction2)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _a.sent();
                        expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeFalsy();
                        result = (0, react_native_1.renderHook)(function () { return (0, useReportWithTransactionsAndViolations_1.default)(reportID); }, { wrapper: OnyxListItemProvider_1.default }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _a.sent();
                        expect((0, IOU_1.canApproveIOU)(result.current.at(0), fakePolicy, result.current.at(1))).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false if we have only scan failure transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policyID, reportID, fakePolicy, fakeReport, fakeTransaction1, fakeTransaction2, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        policyID = '2';
                        reportID = '1';
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { type: CONST_1.default.POLICY.TYPE.TEAM, approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC });
                        fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(Number(reportID))), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: policyID, stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, managerID: RORY_ACCOUNT_ID });
                        fakeTransaction1 = __assign(__assign({}, (0, transaction_1.default)(0)), { reportID: reportID, amount: 0, modifiedAmount: 0, receipt: {
                                source: 'test',
                                state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                            }, merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT, modifiedMerchant: undefined });
                        fakeTransaction2 = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: reportID, amount: 0, modifiedAmount: 0, receipt: {
                                source: 'test',
                                state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                            }, merchant: 'test merchant', modifiedMerchant: undefined });
                        return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.REPORT, (_a = {},
                                _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(fakeReport.reportID)] = fakeReport,
                                _a))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(fakeReport.reportID), fakeReport)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction1.transactionID), fakeTransaction1)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction2.transactionID), fakeTransaction2)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _b.sent();
                        expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeFalsy();
                        result = (0, react_native_1.renderHook)(function () { return (0, useReportWithTransactionsAndViolations_1.default)(reportID); }, { wrapper: OnyxListItemProvider_1.default }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _b.sent();
                        expect((0, IOU_1.canApproveIOU)(result.current.at(0), fakePolicy, result.current.at(1))).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false if all transactions are pending card or scan failure transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policyID, reportID, fakePolicy, fakeReport, fakeTransaction1, fakeTransaction2, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policyID = '2';
                        reportID = '1';
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { type: CONST_1.default.POLICY.TYPE.TEAM, approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC });
                        fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(Number(reportID))), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: policyID, stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, managerID: RORY_ACCOUNT_ID });
                        fakeTransaction1 = __assign(__assign({}, (0, transaction_1.default)(0)), { reportID: reportID, bank: CONST_1.default.EXPENSIFY_CARD.BANK, status: CONST_1.default.TRANSACTION.STATUS.PENDING });
                        fakeTransaction2 = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: reportID, amount: 0, modifiedAmount: 0, receipt: {
                                source: 'test',
                                state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                            }, merchant: 'test merchant', modifiedMerchant: undefined });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(fakeReport.reportID), fakeReport)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction1.transactionID), fakeTransaction1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction2.transactionID), fakeTransaction2)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _a.sent();
                        expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeFalsy();
                        result = (0, react_native_1.renderHook)(function () { return (0, useReportWithTransactionsAndViolations_1.default)(reportID); }, { wrapper: OnyxListItemProvider_1.default }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _a.sent();
                        expect((0, IOU_1.canApproveIOU)(result.current.at(0), fakePolicy, result.current.at(1))).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return true if at least one transactions is not pending card or scan failure transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policyID, reportID, fakePolicy, fakeReport, fakeTransaction1, fakeTransaction2, fakeTransaction3, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policyID = '2';
                        reportID = '1';
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { type: CONST_1.default.POLICY.TYPE.TEAM, approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC });
                        fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(Number(reportID))), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: policyID, stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, managerID: RORY_ACCOUNT_ID });
                        fakeTransaction1 = __assign(__assign({}, (0, transaction_1.default)(0)), { reportID: reportID, bank: CONST_1.default.EXPENSIFY_CARD.BANK, status: CONST_1.default.TRANSACTION.STATUS.PENDING });
                        fakeTransaction2 = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: reportID, amount: 0, receipt: {
                                source: 'test',
                                state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                            }, merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT, modifiedMerchant: undefined });
                        fakeTransaction3 = __assign(__assign({}, (0, transaction_1.default)(2)), { reportID: reportID, amount: 100 });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(fakeReport.reportID), fakeReport)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction1.transactionID), fakeTransaction1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction2.transactionID), fakeTransaction2)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction3.transactionID), fakeTransaction3)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _a.sent();
                        expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeTruthy();
                        result = (0, react_native_1.renderHook)(function () { return (0, useReportWithTransactionsAndViolations_1.default)(reportID); }, { wrapper: OnyxListItemProvider_1.default }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _a.sent();
                        expect((0, IOU_1.canApproveIOU)(result.current.at(0), fakePolicy, result.current.at(1))).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false if the report is closed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policyID, reportID, fakePolicy, fakeReport, fakeTransaction;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        policyID = '2';
                        reportID = '1';
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { type: CONST_1.default.POLICY.TYPE.TEAM, approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC });
                        fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(Number(reportID))), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: policyID, stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED, managerID: RORY_ACCOUNT_ID });
                        fakeTransaction = __assign({}, (0, transaction_1.default)(1));
                        react_native_onyx_1.default.multiSet((_a = {},
                            _a[ONYXKEYS_1.default.COLLECTION.REPORT] = fakeReport,
                            _a[ONYXKEYS_1.default.COLLECTION.TRANSACTION] = fakeTransaction,
                            _a));
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _b.sent();
                        // Then, canApproveIOU should return false since the report is closed
                        expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeFalsy();
                        // Then should return false when passing transactions directly as the third parameter instead of relying on Onyx data
                        expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy, [fakeTransaction])).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('canUnapproveIOU', function () {
        it('should return false if the report is waiting for a bank account', function () {
            var fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: 'A', stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED, isWaitingOnBankAccount: true, managerID: RORY_ACCOUNT_ID });
            expect((0, IOU_1.canUnapproveIOU)(fakeReport, undefined)).toBeFalsy();
        });
    });
    describe('canCancelPayment', function () {
        it('should return true if the report is waiting for a bank account', function () {
            var fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: 'A', stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED, isWaitingOnBankAccount: true, managerID: RORY_ACCOUNT_ID });
            expect((0, IOU_1.canCancelPayment)(fakeReport, { accountID: RORY_ACCOUNT_ID })).toBeTruthy();
        });
    });
    describe('canIOUBePaid', function () {
        it('should return false if the report has negative total', function () {
            var policyChat = (0, reports_1.createRandomReport)(1);
            var fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number('AA'))), { type: CONST_1.default.POLICY.TYPE.TEAM, approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC });
            var fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: 'AA', stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED, managerID: RORY_ACCOUNT_ID, total: 100 });
            expect((0, IOU_1.canIOUBePaid)(fakeReport, policyChat, fakePolicy)).toBeFalsy();
        });
    });
    describe('calculateDiffAmount', function () {
        it('should return 0 if iouReport is undefined', function () {
            var fakeTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: '1', amount: 100, currency: 'USD' });
            expect((0, IOU_1.calculateDiffAmount)(undefined, fakeTransaction, fakeTransaction)).toBe(0);
        });
        it('should return 0 when the currency and amount of the transactions are the same', function () {
            var fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1', stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED, managerID: RORY_ACCOUNT_ID });
            var fakeTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: fakeReport.reportID, amount: 100, currency: 'USD' });
            expect((0, IOU_1.calculateDiffAmount)(fakeReport, fakeTransaction, fakeTransaction)).toBe(0);
        });
        it('should return the difference between the updated amount and the current amount when the currency of the updated and current transactions have the same currency', function () {
            var fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1', stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED, managerID: RORY_ACCOUNT_ID, currency: 'USD' });
            var fakeTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { amount: 100, currency: 'USD' });
            var updatedTransaction = __assign(__assign({}, fakeTransaction), { amount: 200, currency: 'USD' });
            expect((0, IOU_1.calculateDiffAmount)(fakeReport, updatedTransaction, fakeTransaction)).toBe(-100);
        });
        it('should return null when the currency of the updated and current transactions have different values', function () {
            var fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1', stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED, managerID: RORY_ACCOUNT_ID });
            var fakeTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { amount: 100, currency: 'USD' });
            var updatedTransaction = __assign(__assign({}, fakeTransaction), { amount: 200, currency: 'EUR' });
            expect((0, IOU_1.calculateDiffAmount)(fakeReport, updatedTransaction, fakeTransaction)).toBeNull();
        });
    });
    describe('initMoneyRequest', function () {
        var fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(0)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1', managerID: CARLOS_ACCOUNT_ID });
        var fakePolicy = __assign(__assign({}, (0, policies_1.default)(1)), { type: CONST_1.default.POLICY.TYPE.TEAM, outputCurrency: 'USD' });
        var fakeParentReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { reportID: fakeReport.reportID, type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1', managerID: CARLOS_ACCOUNT_ID });
        var fakePersonalPolicy = __assign(__assign({}, (0, policies_1.default)(2)), { type: CONST_1.default.POLICY.TYPE.PERSONAL, outputCurrency: 'NZD' });
        var transactionResult = {
            amount: 0,
            comment: {
                attendees: [
                    {
                        email: 'rory@expensifail.com',
                        login: 'rory@expensifail.com',
                        accountID: 3,
                        text: 'rory@expensifail.com',
                        selected: true,
                        reportID: '0',
                        avatarUrl: '',
                        displayName: '',
                    },
                ],
            },
            created: '2025-04-01',
            currency: 'USD',
            iouRequestType: 'manual',
            reportID: fakeReport.reportID,
            transactionID: CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID,
            isFromGlobalCreate: true,
            merchant: '(none)',
            splitPayerAccountIDs: [3],
        };
        var currentDate = '2025-04-01';
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID), null)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.CURRENT_DATE), currentDate)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(fakeReport.reportID), fakeReport)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(fakePolicy.id), fakePolicy)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(fakePersonalPolicy.id), fakePersonalPolicy)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, (0, waitForBatchedUpdates_1.default)()];
                }
            });
        }); });
        it('should merge transaction draft onyx value', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()
                            .then(function () {
                            (0, IOU_1.initMoneyRequest)({
                                reportID: fakeReport.reportID,
                                policy: fakePolicy,
                                isFromGlobalCreate: true,
                                newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.MANUAL,
                                report: fakeReport,
                                parentReport: fakeParentReport,
                                currentDate: currentDate,
                            });
                        })
                            .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = expect;
                                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID))];
                                    case 1:
                                        _a.apply(void 0, [_b.sent()]).toStrictEqual(transactionResult);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should modify transaction draft when currentIouRequestType is different', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()
                            .then(function () {
                            return (0, IOU_1.initMoneyRequest)({
                                reportID: fakeReport.reportID,
                                policy: fakePolicy,
                                isFromGlobalCreate: true,
                                currentIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.MANUAL,
                                newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
                                report: fakeReport,
                                parentReport: fakeParentReport,
                                currentDate: currentDate,
                            });
                        })
                            .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = expect;
                                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID))];
                                    case 1:
                                        _a.apply(void 0, [_b.sent()]).toStrictEqual(__assign(__assign({}, transactionResult), { iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN }));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return personal currency when policy is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()
                            .then(function () {
                            return (0, IOU_1.initMoneyRequest)({
                                reportID: fakeReport.reportID,
                                isFromGlobalCreate: true,
                                newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.MANUAL,
                                report: fakeReport,
                                parentReport: fakeParentReport,
                                currentDate: currentDate,
                            });
                        })
                            .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = expect;
                                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID))];
                                    case 1:
                                        _a.apply(void 0, [_b.sent()]).toStrictEqual(__assign(__assign({}, transactionResult), { currency: fakePersonalPolicy.outputCurrency }));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateMoneyRequestAmountAndCurrency', function () {
        it('update the amount of the money request successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeReport, fakeTransaction, updatedTransaction;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1', stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED, managerID: RORY_ACCOUNT_ID });
                        fakeTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: fakeReport.reportID, amount: 100, currency: 'USD' });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction.transactionID), fakeTransaction)];
                    case 1:
                        _d.sent();
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        (0, IOU_1.updateMoneyRequestAmountAndCurrency)({
                            transactionID: fakeTransaction.transactionID,
                            transactionThreadReportID: fakeReport.reportID,
                            amount: 20000,
                            currency: CONST_1.default.CURRENCY.USD,
                            taxAmount: 0,
                            taxCode: '',
                            policy: {
                                id: '123',
                                role: 'user',
                                type: CONST_1.default.POLICY.TYPE.TEAM,
                                name: '',
                                owner: '',
                                outputCurrency: '',
                                isPolicyExpenseChatEnabled: false,
                            },
                            policyTagList: {},
                            policyCategories: {},
                            transactions: {},
                            transactionViolations: {},
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _d.sent();
                        (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.succeed) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                        return [4 /*yield*/, ((_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _c === void 0 ? void 0 : _c.call(mockFetch))];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                    waitForCollectionCallback: true,
                                    callback: function (transactions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        var newTransaction = transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction.transactionID)];
                                        resolve(newTransaction);
                                    },
                                });
                            })];
                    case 4:
                        updatedTransaction = _d.sent();
                        expect(updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.modifiedAmount).toBe(20000);
                        return [2 /*return*/];
                }
            });
        }); });
        it('update the amount of the money request failed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeReport, fakeTransaction, updatedTransaction;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1', stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED, managerID: RORY_ACCOUNT_ID });
                        fakeTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: fakeReport.reportID, amount: 100, currency: 'USD' });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction.transactionID), fakeTransaction)];
                    case 1:
                        _d.sent();
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        (0, IOU_1.updateMoneyRequestAmountAndCurrency)({
                            transactionID: fakeTransaction.transactionID,
                            transactionThreadReportID: fakeReport.reportID,
                            amount: 20000,
                            currency: CONST_1.default.CURRENCY.USD,
                            taxAmount: 0,
                            taxCode: '',
                            policy: {
                                id: '123',
                                role: 'user',
                                type: CONST_1.default.POLICY.TYPE.TEAM,
                                name: '',
                                owner: '',
                                outputCurrency: '',
                                isPolicyExpenseChatEnabled: false,
                            },
                            policyTagList: {},
                            policyCategories: {},
                            transactions: {},
                            transactionViolations: {},
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _d.sent();
                        (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.fail) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                        return [4 /*yield*/, ((_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _c === void 0 ? void 0 : _c.call(mockFetch))];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                    waitForCollectionCallback: true,
                                    callback: function (transactions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        var newTransaction = transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction.transactionID)];
                                        resolve(newTransaction);
                                    },
                                });
                            })];
                    case 4:
                        updatedTransaction = _d.sent();
                        expect(updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.modifiedAmount).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('cancelPayment', function () {
        var amount = 10000;
        var comment = '💸💸💸💸';
        var merchant = 'NASDAQ';
        afterEach(function () {
            var _a;
            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
        });
        it('pendingAction is not null after canceling the payment failed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expenseReport, chatReport;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Given a signed in account, which owns a workspace, and has a policy expense chat
                        react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
                        // Which owns a workspace
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        // Which owns a workspace
                        _d.sent();
                        (0, Policy_1.createWorkspace)({
                            policyOwnerEmail: CARLOS_EMAIL,
                            makeMeAdmin: true,
                            policyName: "Carlos's Workspace",
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _d.sent();
                        // Get the policy expense chat report
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                waitForCollectionCallback: true,
                                callback: function (allReports) {
                                    chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                                },
                            })];
                    case 3:
                        // Get the policy expense chat report
                        _d.sent();
                        if (chatReport) {
                            // When an IOU expense is submitted to that policy expense chat
                            (0, IOU_1.requestMoney)({
                                report: chatReport,
                                participantParams: {
                                    payeeEmail: RORY_EMAIL,
                                    payeeAccountID: RORY_ACCOUNT_ID,
                                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                                },
                                transactionParams: {
                                    amount: amount,
                                    attendees: [],
                                    currency: CONST_1.default.CURRENCY.USD,
                                    created: '',
                                    merchant: merchant,
                                    comment: comment,
                                },
                                shouldGenerateTransactionThreadReport: true,
                            });
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _d.sent();
                        // And given an expense report has now been created which holds the IOU
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                waitForCollectionCallback: true,
                                callback: function (allReports) {
                                    expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                                },
                            })];
                    case 5:
                        // And given an expense report has now been created which holds the IOU
                        _d.sent();
                        if (chatReport && expenseReport) {
                            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                            // And when the payment is cancelled
                            (0, IOU_1.cancelPayment)(expenseReport, chatReport);
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _d.sent();
                        (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.fail) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                        return [4 /*yield*/, ((_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _c === void 0 ? void 0 : _c.call(mockFetch))];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID),
                                callback: function (allReportActions) {
                                    var action = Object.values(allReportActions !== null && allReportActions !== void 0 ? allReportActions : {}).find(function (a) { return (a === null || a === void 0 ? void 0 : a.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_DEQUEUED; });
                                    expect(action === null || action === void 0 ? void 0 : action.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                                },
                            })];
                    case 8:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('payMoneyRequest', function () {
        var amount = 10000;
        var comment = '💸💸💸💸';
        var merchant = 'NASDAQ';
        afterEach(function () {
            var _a;
            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
        });
        it('pendingAction is not null after paying the money request', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expenseReport, chatReport;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Given a signed in account, which owns a workspace, and has a policy expense chat
                        react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
                        // Which owns a workspace
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        // Which owns a workspace
                        _d.sent();
                        (0, Policy_1.createWorkspace)({
                            policyOwnerEmail: CARLOS_EMAIL,
                            makeMeAdmin: true,
                            policyName: "Carlos's Workspace",
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _d.sent();
                        // Get the policy expense chat report
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                waitForCollectionCallback: true,
                                callback: function (allReports) {
                                    chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                                },
                            })];
                    case 3:
                        // Get the policy expense chat report
                        _d.sent();
                        if (chatReport) {
                            // When an IOU expense is submitted to that policy expense chat
                            (0, IOU_1.requestMoney)({
                                report: chatReport,
                                participantParams: {
                                    payeeEmail: RORY_EMAIL,
                                    payeeAccountID: RORY_ACCOUNT_ID,
                                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                                },
                                transactionParams: {
                                    amount: amount,
                                    attendees: [],
                                    currency: CONST_1.default.CURRENCY.USD,
                                    created: '',
                                    merchant: merchant,
                                    comment: comment,
                                },
                                shouldGenerateTransactionThreadReport: true,
                            });
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _d.sent();
                        // And given an expense report has now been created which holds the IOU
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                waitForCollectionCallback: true,
                                callback: function (allReports) {
                                    expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.IOU; });
                                },
                            })];
                    case 5:
                        // And given an expense report has now been created which holds the IOU
                        _d.sent();
                        // When the expense report is paid elsewhere (but really, any payment option would work)
                        if (chatReport && expenseReport) {
                            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.pause) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                            (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, chatReport, expenseReport);
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _d.sent();
                        (_b = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.fail) === null || _b === void 0 ? void 0 : _b.call(mockFetch);
                        return [4 /*yield*/, ((_c = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _c === void 0 ? void 0 : _c.call(mockFetch))];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID),
                                callback: function (allReportActions) {
                                    var action = Object.values(allReportActions !== null && allReportActions !== void 0 ? allReportActions : {}).find(function (a) {
                                        var originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(a) ? (0, ReportActionsUtils_1.getOriginalMessage)(a) : undefined;
                                        return (originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.type) === 'pay';
                                    });
                                    expect(action === null || action === void 0 ? void 0 : action.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                                },
                            })];
                    case 8:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('initSplitExpense', function () {
        it('should initialize split expense with correct transaction details', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transaction, draftTransaction, splitExpenses;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transaction = {
                            transactionID: '123',
                            amount: 100,
                            currency: 'USD',
                            merchant: 'Test Merchant',
                            comment: {
                                comment: 'Test comment',
                                splitExpenses: [],
                                attendees: [],
                                type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                            },
                            category: 'Food',
                            tag: 'lunch',
                            created: DateUtils_1.default.getDBTime(),
                            reportID: '456',
                        };
                        (0, IOU_1.initSplitExpense)(transaction);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transaction.transactionID))];
                    case 2:
                        draftTransaction = _b.sent();
                        expect(draftTransaction).toBeTruthy();
                        splitExpenses = (_a = draftTransaction === null || draftTransaction === void 0 ? void 0 : draftTransaction.comment) === null || _a === void 0 ? void 0 : _a.splitExpenses;
                        expect(splitExpenses).toHaveLength(2);
                        expect(draftTransaction === null || draftTransaction === void 0 ? void 0 : draftTransaction.amount).toBe(100);
                        expect(draftTransaction === null || draftTransaction === void 0 ? void 0 : draftTransaction.currency).toBe('USD');
                        expect(draftTransaction === null || draftTransaction === void 0 ? void 0 : draftTransaction.merchant).toBe('Test Merchant');
                        expect(draftTransaction === null || draftTransaction === void 0 ? void 0 : draftTransaction.reportID).toBe(transaction.reportID);
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[0].amount).toBe(50);
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[0].description).toBe('Test comment');
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[0].category).toBe('Food');
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[0].tags).toEqual(['lunch']);
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[1].amount).toBe(50);
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[1].description).toBe('Test comment');
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[1].category).toBe('Food');
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[1].tags).toEqual(['lunch']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not initialize split expense for null transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = undefined;
                        (0, IOU_1.initSplitExpense)(transaction);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        expect(transaction).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('addSplitExpenseField', function () {
        it('should add new split expense field to draft transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transaction, draftTransaction, updatedDraftTransaction, splitExpenses;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transaction = {
                            transactionID: '123',
                            amount: 100,
                            currency: 'USD',
                            merchant: 'Test Merchant',
                            comment: {
                                comment: 'Test comment',
                                splitExpenses: [],
                                attendees: [],
                                type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                            },
                            category: 'Food',
                            tag: 'lunch',
                            created: DateUtils_1.default.getDBTime(),
                            reportID: '456',
                        };
                        draftTransaction = {
                            transactionID: '123',
                            amount: 100,
                            currency: 'USD',
                            merchant: 'Test Merchant',
                            comment: {
                                comment: 'Test comment',
                                splitExpenses: [
                                    {
                                        transactionID: '789',
                                        amount: 50,
                                        description: 'Test comment',
                                        category: 'Food',
                                        tags: ['lunch'],
                                        created: DateUtils_1.default.getDBTime(),
                                    },
                                ],
                                attendees: [],
                                type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                            },
                            category: 'Food',
                            tag: 'lunch',
                            created: DateUtils_1.default.getDBTime(),
                            reportID: '456',
                        };
                        (0, IOU_1.addSplitExpenseField)(transaction, draftTransaction);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transaction.transactionID))];
                    case 2:
                        updatedDraftTransaction = _b.sent();
                        expect(updatedDraftTransaction).toBeTruthy();
                        splitExpenses = (_a = updatedDraftTransaction === null || updatedDraftTransaction === void 0 ? void 0 : updatedDraftTransaction.comment) === null || _a === void 0 ? void 0 : _a.splitExpenses;
                        expect(splitExpenses).toHaveLength(2);
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[1].amount).toBe(0);
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[1].description).toBe('Test comment');
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[1].category).toBe('Food');
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[1].tags).toEqual(['lunch']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateSplitExpenseAmountField', function () {
        it('should update amount expense field to draft transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var originalTransactionID, currentTransactionID, draftTransaction, updatedDraftTransaction, splitExpenses;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        originalTransactionID = '123';
                        currentTransactionID = '789';
                        draftTransaction = {
                            transactionID: '234',
                            amount: 100,
                            currency: 'USD',
                            merchant: 'Test Merchant',
                            comment: {
                                comment: 'Test comment',
                                originalTransactionID: originalTransactionID,
                                splitExpenses: [
                                    {
                                        transactionID: currentTransactionID,
                                        amount: 50,
                                        description: 'Test comment',
                                        category: 'Food',
                                        tags: ['lunch'],
                                        created: DateUtils_1.default.getDBTime(),
                                    },
                                ],
                                attendees: [],
                                type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                            },
                            category: 'Food',
                            tag: 'lunch',
                            created: DateUtils_1.default.getDBTime(),
                            reportID: '456',
                        };
                        (0, IOU_1.updateSplitExpenseAmountField)(draftTransaction, currentTransactionID, 20);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(originalTransactionID))];
                    case 2:
                        updatedDraftTransaction = _b.sent();
                        expect(updatedDraftTransaction).toBeTruthy();
                        splitExpenses = (_a = updatedDraftTransaction === null || updatedDraftTransaction === void 0 ? void 0 : updatedDraftTransaction.comment) === null || _a === void 0 ? void 0 : _a.splitExpenses;
                        expect(splitExpenses === null || splitExpenses === void 0 ? void 0 : splitExpenses[0].amount).toBe(20);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('replaceReceipt', function () {
        it('should replace the receipt of the transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionID, file, source, transaction, searchQueryJSON, updatedTransaction, updatedSnapshot;
            var _a;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        transactionID = '123';
                        file = new File([new Blob(['test'])], 'test.jpg', { type: 'image/jpeg' });
                        file.source = 'test';
                        source = 'test';
                        transaction = {
                            transactionID: transactionID,
                            receipt: {
                                source: 'test1',
                            },
                        };
                        // Given a transaction with a receipt
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), transaction)];
                    case 1:
                        // Given a transaction with a receipt
                        _f.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _f.sent();
                        searchQueryJSON = {
                            hash: 12345,
                            query: 'test',
                        };
                        // Given a snapshot of the transaction
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(searchQueryJSON.hash), {
                                // @ts-expect-error: Allow partial record in snapshot update
                                data: (_a = {},
                                    _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)] = transaction,
                                    _a),
                            })];
                    case 3:
                        // Given a snapshot of the transaction
                        _f.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _f.sent();
                        // When the receipt is replaced
                        (0, IOU_1.replaceReceipt)({ transactionID: transactionID, file: file, source: source });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                    waitForCollectionCallback: true,
                                    callback: function (transactions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        var newTransaction = transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)];
                                        resolve(newTransaction);
                                    },
                                });
                            })];
                    case 6:
                        updatedTransaction = _f.sent();
                        expect((_b = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.receipt) === null || _b === void 0 ? void 0 : _b.source).toBe(source);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.SNAPSHOT,
                                    waitForCollectionCallback: true,
                                    callback: function (snapshots) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        var newSnapshot = snapshots["".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(searchQueryJSON.hash)];
                                        resolve(newSnapshot);
                                    },
                                });
                            })];
                    case 7:
                        updatedSnapshot = _f.sent();
                        expect((_e = (_d = (_c = updatedSnapshot === null || updatedSnapshot === void 0 ? void 0 : updatedSnapshot.data) === null || _c === void 0 ? void 0 : _c["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)]) === null || _d === void 0 ? void 0 : _d.receipt) === null || _e === void 0 ? void 0 : _e.source).toBe(source);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add receipt if it does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionID, file, source, transaction, searchQueryJSON, updatedTransaction, updatedSnapshot;
            var _a;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        transactionID = '123';
                        file = new File([new Blob(['test'])], 'test.jpg', { type: 'image/jpeg' });
                        file.source = 'test';
                        source = 'test';
                        transaction = {
                            transactionID: transactionID,
                        };
                        // Given a transaction without a receipt
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), transaction)];
                    case 1:
                        // Given a transaction without a receipt
                        _f.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _f.sent();
                        searchQueryJSON = {
                            hash: 12345,
                            query: 'test',
                        };
                        // Given a snapshot of the transaction
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(searchQueryJSON.hash), {
                                // @ts-expect-error: Allow partial record in snapshot update
                                data: (_a = {},
                                    _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)] = transaction,
                                    _a),
                            })];
                    case 3:
                        // Given a snapshot of the transaction
                        _f.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _f.sent();
                        // When the receipt is replaced
                        (0, IOU_1.replaceReceipt)({ transactionID: transactionID, file: file, source: source });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                    waitForCollectionCallback: true,
                                    callback: function (transactions) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        var newTransaction = transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)];
                                        resolve(newTransaction);
                                    },
                                });
                            })];
                    case 6:
                        updatedTransaction = _f.sent();
                        expect((_b = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.receipt) === null || _b === void 0 ? void 0 : _b.source).toBe(source);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.SNAPSHOT,
                                    waitForCollectionCallback: true,
                                    callback: function (snapshots) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        var newSnapshot = snapshots["".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(searchQueryJSON.hash)];
                                        resolve(newSnapshot);
                                    },
                                });
                            })];
                    case 7:
                        updatedSnapshot = _f.sent();
                        expect((_e = (_d = (_c = updatedSnapshot === null || updatedSnapshot === void 0 ? void 0 : updatedSnapshot.data) === null || _c === void 0 ? void 0 : _c["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)]) === null || _d === void 0 ? void 0 : _d.receipt) === null || _e === void 0 ? void 0 : _e.source).toBe(source);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('changeTransactionsReport', function () {
        it('should set the correct optimistic onyx data for reporting a tracked expense', function () { return __awaiter(void 0, void 0, void 0, function () {
            var personalDetailsList, expenseReport, transaction, creatorPersonalDetails, policyID, selfDMReport, amount, iouReportActionOnSelfDMReport, trackExpenseActionableWhisper, updatedTransaction, updatedIOUReportActionOnSelfDMReport, updatedTrackExpenseActionableWhisper, updatedExpenseReport;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Given a signed in account, which owns a workspace, and has a policy expense chat
                        react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
                        creatorPersonalDetails = (_a = personalDetailsList === null || personalDetailsList === void 0 ? void 0 : personalDetailsList[CARLOS_ACCOUNT_ID]) !== null && _a !== void 0 ? _a : { accountID: CARLOS_ACCOUNT_ID };
                        policyID = (0, Policy_1.generatePolicyID)();
                        (0, Policy_1.createWorkspace)({
                            policyOwnerEmail: CARLOS_EMAIL,
                            makeMeAdmin: true,
                            policyName: "Carlos's Workspace",
                            policyID: policyID,
                        });
                        (0, Report_1.createNewReport)(creatorPersonalDetails, policyID);
                        selfDMReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { reportID: '10', chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM });
                        amount = 100;
                        (0, IOU_1.trackExpense)({
                            report: selfDMReport,
                            isDraftPolicy: true,
                            action: CONST_1.default.IOU.ACTION.CREATE,
                            participantParams: {
                                payeeEmail: RORY_EMAIL,
                                payeeAccountID: RORY_ACCOUNT_ID,
                                participant: { accountID: RORY_ACCOUNT_ID },
                            },
                            transactionParams: {
                                amount: amount,
                                currency: CONST_1.default.CURRENCY.USD,
                                created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                                merchant: 'merchant',
                                billable: false,
                            },
                        });
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                waitForCollectionCallback: true,
                                callback: function (allTransactions) {
                                    transaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (t) { return !!t; });
                                },
                            })];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                waitForCollectionCallback: true,
                                callback: function (allReports) {
                                    expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                                },
                            })];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                                waitForCollectionCallback: true,
                                callback: function (allReportActions) {
                                    var _a, _b;
                                    iouReportActionOnSelfDMReport = Object.values((_a = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(selfDMReport.reportID)]) !== null && _a !== void 0 ? _a : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.IOU; });
                                    trackExpenseActionableWhisper = Object.values((_b = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(selfDMReport === null || selfDMReport === void 0 ? void 0 : selfDMReport.reportID)]) !== null && _b !== void 0 ? _b : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_TRACK_EXPENSE_WHISPER; });
                                },
                            })];
                    case 3:
                        _d.sent();
                        expect((0, ReportActionsUtils_1.isMoneyRequestAction)(iouReportActionOnSelfDMReport) ? (_b = (0, ReportActionsUtils_1.getOriginalMessage)(iouReportActionOnSelfDMReport)) === null || _b === void 0 ? void 0 : _b.IOUTransactionID : undefined).toBe(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID);
                        expect(trackExpenseActionableWhisper).toBeDefined();
                        if (!transaction || !expenseReport) {
                            return [2 /*return*/];
                        }
                        (0, Transaction_1.changeTransactionsReport)([transaction === null || transaction === void 0 ? void 0 : transaction.transactionID], expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID, false, CARLOS_ACCOUNT_ID, CARLOS_EMAIL);
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                                waitForCollectionCallback: true,
                                callback: function (allTransactions) {
                                    updatedTransaction = Object.values(allTransactions !== null && allTransactions !== void 0 ? allTransactions : {}).find(function (t) { return (t === null || t === void 0 ? void 0 : t.transactionID) === (transaction === null || transaction === void 0 ? void 0 : transaction.transactionID); });
                                },
                            })];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                                waitForCollectionCallback: true,
                                callback: function (allReportActions) {
                                    var _a, _b;
                                    updatedIOUReportActionOnSelfDMReport = Object.values((_a = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(selfDMReport.reportID)]) !== null && _a !== void 0 ? _a : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.IOU; });
                                    updatedTrackExpenseActionableWhisper = Object.values((_b = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(selfDMReport === null || selfDMReport === void 0 ? void 0 : selfDMReport.reportID)]) !== null && _b !== void 0 ? _b : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_TRACK_EXPENSE_WHISPER; });
                                },
                            })];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                waitForCollectionCallback: true,
                                callback: function (allReports) {
                                    updatedExpenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (r) { return (r === null || r === void 0 ? void 0 : r.reportID) === (expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID); });
                                },
                            })];
                    case 6:
                        _d.sent();
                        expect(updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.reportID).toBe(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID);
                        expect((0, ReportActionsUtils_1.isMoneyRequestAction)(updatedIOUReportActionOnSelfDMReport) ? (_c = (0, ReportActionsUtils_1.getOriginalMessage)(updatedIOUReportActionOnSelfDMReport)) === null || _c === void 0 ? void 0 : _c.IOUTransactionID : undefined).toBe(undefined);
                        expect(updatedTrackExpenseActionableWhisper).toBe(undefined);
                        expect(updatedExpenseReport === null || updatedExpenseReport === void 0 ? void 0 : updatedExpenseReport.nonReimbursableTotal).toBe(-amount);
                        expect(updatedExpenseReport === null || updatedExpenseReport === void 0 ? void 0 : updatedExpenseReport.total).toBe(-amount);
                        expect(updatedExpenseReport === null || updatedExpenseReport === void 0 ? void 0 : updatedExpenseReport.unheldNonReimbursableTotal).toBe(-amount);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('saveSplitTransactions', function () {
            it("should update split transaction's description correctly ", function () { return __awaiter(void 0, void 0, void 0, function () {
                var amount, expenseReport, chatReport, originalTransactionID, policyID, originalTransaction, draftTransaction, split1, split2;
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            amount = 10000;
                            policyID = (0, Policy_1.generatePolicyID)();
                            (0, Policy_1.createWorkspace)({
                                policyOwnerEmail: CARLOS_EMAIL,
                                makeMeAdmin: true,
                                policyName: "Carlos's Workspace",
                                policyID: policyID,
                            });
                            // Change the approval mode for the policy since default is Submit and Close
                            (0, Policy_1.setWorkspaceApprovalMode)(policyID, CARLOS_EMAIL, CONST_1.default.POLICY.APPROVAL_MODE.BASIC);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 1:
                            _j.sent();
                            return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                    waitForCollectionCallback: true,
                                    callback: function (allReports) {
                                        chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                                    },
                                })];
                        case 2:
                            _j.sent();
                            (0, IOU_1.requestMoney)({
                                report: chatReport,
                                participantParams: {
                                    payeeEmail: RORY_EMAIL,
                                    payeeAccountID: RORY_ACCOUNT_ID,
                                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID },
                                },
                                transactionParams: {
                                    amount: amount,
                                    attendees: [],
                                    currency: CONST_1.default.CURRENCY.USD,
                                    created: '',
                                    merchant: 'NASDAQ',
                                    comment: '*hey* `hey`',
                                },
                                shouldGenerateTransactionThreadReport: true,
                            });
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 3:
                            _j.sent();
                            return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                    waitForCollectionCallback: true,
                                    callback: function (allReports) {
                                        expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                                    },
                                })];
                        case 4:
                            _j.sent();
                            return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (allReportsAction) {
                                        var iouActions = Object.values(allReportsAction !== null && allReportsAction !== void 0 ? allReportsAction : {}).filter(function (reportAction) {
                                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                                        });
                                        var originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(iouActions === null || iouActions === void 0 ? void 0 : iouActions.at(0)) ? (0, ReportActionsUtils_1.getOriginalMessage)(iouActions === null || iouActions === void 0 ? void 0 : iouActions.at(0)) : undefined;
                                        originalTransactionID = originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.IOUTransactionID;
                                    },
                                })];
                        case 5:
                            _j.sent();
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(originalTransactionID))];
                        case 6:
                            originalTransaction = _j.sent();
                            draftTransaction = {
                                reportID: (_a = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.reportID) !== null && _a !== void 0 ? _a : '456',
                                transactionID: (_b = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.transactionID) !== null && _b !== void 0 ? _b : '234',
                                amount: amount,
                                created: (_c = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.created) !== null && _c !== void 0 ? _c : DateUtils_1.default.getDBTime(),
                                currency: CONST_1.default.CURRENCY.USD,
                                merchant: (_d = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.merchant) !== null && _d !== void 0 ? _d : '',
                                comment: {
                                    originalTransactionID: originalTransactionID,
                                    comment: (_f = (_e = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.comment) === null || _e === void 0 ? void 0 : _e.comment) !== null && _f !== void 0 ? _f : '',
                                    splitExpenses: [
                                        {
                                            transactionID: '235',
                                            amount: amount / 2,
                                            description: '<strong>hey</strong><br /><code>hey</code>',
                                            created: DateUtils_1.default.getDBTime(),
                                        },
                                        {
                                            transactionID: '234',
                                            amount: amount / 2,
                                            description: '*hey1* `hey`',
                                            created: DateUtils_1.default.getDBTime(),
                                        },
                                    ],
                                    attendees: [],
                                    type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                                },
                            };
                            (0, IOU_1.saveSplitTransactions)(draftTransaction, -2);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 7:
                            _j.sent();
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION, "235"))];
                        case 8:
                            split1 = _j.sent();
                            expect((_g = split1 === null || split1 === void 0 ? void 0 : split1.comment) === null || _g === void 0 ? void 0 : _g.comment).toBe('<strong>hey</strong><br /><code>hey</code>');
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION, "234"))];
                        case 9:
                            split2 = _j.sent();
                            expect((_h = split2 === null || split2 === void 0 ? void 0 : split2.comment) === null || _h === void 0 ? void 0 : _h.comment).toBe('<strong>hey1</strong> <code>hey</code>');
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should not create new expense report if the admin split the employee's expense", function () { return __awaiter(void 0, void 0, void 0, function () {
                var amount, expenseReport, chatReport, originalTransactionID, policyID, originalTransaction, draftTransaction, split1, split2;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            amount = 10000;
                            policyID = (0, Policy_1.generatePolicyID)();
                            (0, Policy_1.createWorkspace)({
                                policyOwnerEmail: RORY_EMAIL,
                                makeMeAdmin: true,
                                policyName: "Rory's Workspace",
                                policyID: policyID,
                            });
                            // Change the approval mode for the policy since default is Submit and Close
                            (0, Policy_1.setWorkspaceApprovalMode)(policyID, RORY_EMAIL, CONST_1.default.POLICY.APPROVAL_MODE.BASIC);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 1:
                            _g.sent();
                            return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                    waitForCollectionCallback: true,
                                    callback: function (allReports) {
                                        chatReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.chatType) === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT; });
                                    },
                                })];
                        case 2:
                            _g.sent();
                            (0, IOU_1.requestMoney)({
                                report: chatReport,
                                participantParams: {
                                    payeeEmail: CARLOS_EMAIL,
                                    payeeAccountID: CARLOS_ACCOUNT_ID,
                                    participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID },
                                },
                                transactionParams: {
                                    amount: amount,
                                    attendees: [],
                                    currency: CONST_1.default.CURRENCY.USD,
                                    created: '',
                                    merchant: 'NASDAQ',
                                    comment: '*hey* `hey`',
                                },
                                shouldGenerateTransactionThreadReport: true,
                            });
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 3:
                            _g.sent();
                            return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                    waitForCollectionCallback: true,
                                    callback: function (allReports) {
                                        expenseReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.type) === CONST_1.default.REPORT.TYPE.EXPENSE; });
                                    },
                                })];
                        case 4:
                            _g.sent();
                            return [4 /*yield*/, (0, TestHelper_1.getOnyxData)({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID),
                                    waitForCollectionCallback: false,
                                    callback: function (allReportsAction) {
                                        var iouActions = Object.values(allReportsAction !== null && allReportsAction !== void 0 ? allReportsAction : {}).filter(function (reportAction) {
                                            return (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction);
                                        });
                                        var originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(iouActions === null || iouActions === void 0 ? void 0 : iouActions.at(0)) ? (0, ReportActionsUtils_1.getOriginalMessage)(iouActions === null || iouActions === void 0 ? void 0 : iouActions.at(0)) : undefined;
                                        originalTransactionID = originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.IOUTransactionID;
                                    },
                                })];
                        case 5:
                            _g.sent();
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(originalTransactionID))];
                        case 6:
                            originalTransaction = _g.sent();
                            draftTransaction = {
                                reportID: (_a = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.reportID) !== null && _a !== void 0 ? _a : '456',
                                transactionID: (_b = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.transactionID) !== null && _b !== void 0 ? _b : '234',
                                amount: amount,
                                created: (_c = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.created) !== null && _c !== void 0 ? _c : DateUtils_1.default.getDBTime(),
                                currency: CONST_1.default.CURRENCY.USD,
                                merchant: (_d = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.merchant) !== null && _d !== void 0 ? _d : '',
                                comment: {
                                    originalTransactionID: originalTransactionID,
                                    comment: (_f = (_e = originalTransaction === null || originalTransaction === void 0 ? void 0 : originalTransaction.comment) === null || _e === void 0 ? void 0 : _e.comment) !== null && _f !== void 0 ? _f : '',
                                    splitExpenses: [
                                        {
                                            transactionID: '235',
                                            amount: amount / 2,
                                            description: '<strong>hey</strong><br /><code>hey</code>',
                                            created: DateUtils_1.default.getDBTime(),
                                        },
                                        {
                                            transactionID: '234',
                                            amount: amount / 2,
                                            description: '*hey1* `hey`',
                                            created: DateUtils_1.default.getDBTime(),
                                        },
                                    ],
                                    attendees: [],
                                    type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                                },
                            };
                            (0, IOU_1.saveSplitTransactions)(draftTransaction, -2);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 7:
                            _g.sent();
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION, "235"))];
                        case 8:
                            split1 = _g.sent();
                            expect(split1 === null || split1 === void 0 ? void 0 : split1.reportID).toBe(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID);
                            return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION, "234"))];
                        case 9:
                            split2 = _g.sent();
                            expect(split2 === null || split2 === void 0 ? void 0 : split2.reportID).toBe(expenseReport === null || expenseReport === void 0 ? void 0 : expenseReport.reportID);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('getIOUReportActionToApproveOrPay', function () {
        it('should exclude deleted actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, policyID, fakePolicy, fakeReport, fakeTransaction1, fakeTransaction2, fakeTransaction3, deletedReportAction, MOCK_REPORT_ACTIONS;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reportID = '1';
                        policyID = '2';
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC, type: CONST_1.default.POLICY.TYPE.TEAM });
                        fakeReport = __assign(__assign({}, (0, reports_1.createRandomReport)(Number(reportID))), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: policyID, stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, managerID: RORY_ACCOUNT_ID, chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT });
                        fakeTransaction1 = __assign(__assign({}, (0, transaction_1.default)(0)), { reportID: reportID, bank: CONST_1.default.EXPENSIFY_CARD.BANK, status: CONST_1.default.TRANSACTION.STATUS.PENDING });
                        fakeTransaction2 = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: reportID, amount: 27, receipt: {
                                source: 'test',
                                state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                            }, merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT, modifiedMerchant: undefined });
                        fakeTransaction3 = __assign(__assign({}, (0, transaction_1.default)(2)), { reportID: reportID, amount: 100 });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(fakeReport.reportID), fakeReport)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction1.transactionID), fakeTransaction1)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction2.transactionID), fakeTransaction2)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(fakeTransaction3.transactionID), fakeTransaction3)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), fakePolicy)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _b.sent();
                        deletedReportAction = {
                            reportActionID: '0',
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                            created: '2024-08-08 18:70:44.171',
                            childReportID: reportID,
                        };
                        MOCK_REPORT_ACTIONS = (_a = {},
                            _a[deletedReportAction.reportActionID] = deletedReportAction,
                            _a[reportID] = {
                                reportActionID: reportID,
                                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                                created: '2024-08-08 19:70:44.171',
                                childReportID: reportID,
                                message: [
                                    {
                                        type: 'TEXT',
                                        text: 'Hello world!',
                                    },
                                ],
                            },
                            _a);
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(fakeReport.reportID), MOCK_REPORT_ACTIONS)];
                    case 7:
                        _b.sent();
                        expect((0, IOU_1.getIOUReportActionToApproveOrPay)(fakeReport, undefined)).toMatchObject(MOCK_REPORT_ACTIONS[reportID]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('mergeDuplicates', function () {
        var writeSpy;
        beforeEach(function () {
            jest.clearAllMocks();
            global.fetch = (0, TestHelper_1.getGlobalFetchMock)();
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            writeSpy = jest.spyOn(API, 'write').mockImplementation(function (command, params, options) {
                // Apply optimistic data for testing
                if (options === null || options === void 0 ? void 0 : options.optimisticData) {
                    options.optimisticData.forEach(function (update) {
                        if (update.onyxMethod === react_native_onyx_1.default.METHOD.MERGE) {
                            react_native_onyx_1.default.merge(update.key, update.value);
                        }
                        else if (update.onyxMethod === react_native_onyx_1.default.METHOD.SET) {
                            react_native_onyx_1.default.set(update.key, update.value);
                        }
                    });
                }
                return Promise.resolve();
            });
            return react_native_onyx_1.default.clear();
        });
        afterEach(function () {
            writeSpy.mockRestore();
        });
        var createMockTransaction = function (id, reportID, amount) {
            if (amount === void 0) { amount = 100; }
            return (__assign(__assign({}, (0, transaction_1.default)(Number(id))), { transactionID: id, reportID: reportID, amount: amount, created: '2024-01-01 12:00:00', currency: 'EUR', merchant: 'Test Merchant', modifiedMerchant: 'Updated Merchant', comment: { comment: 'Updated comment' }, category: 'Travel', tag: 'UpdatedProject', billable: true, reimbursable: false }));
        };
        var createMockReport = function (reportID, total) {
            if (total === void 0) { total = 300; }
            return (__assign(__assign({}, (0, reports_1.createRandomReport)(Number(reportID))), { reportID: reportID, type: CONST_1.default.REPORT.TYPE.EXPENSE, total: total }));
        };
        var createMockViolations = function () { return [
            { name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
            { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
        ]; };
        var createMockIouAction = function (transactionID, reportActionID, childReportID) { return ({
            reportActionID: reportActionID,
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            created: '2024-01-01 12:00:00',
            originalMessage: {
                IOUTransactionID: transactionID,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
            },
            message: [{ type: 'TEXT', text: 'Test IOU message' }],
            childReportID: childReportID,
        }); };
        it('should merge duplicate transactions successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, mainTransactionID, duplicate1ID, duplicate2ID, duplicateTransactionIDs, childReportID, mainTransaction, duplicateTransaction1, duplicateTransaction2, expenseReport, mainViolations, duplicate1Violations, duplicate2Violations, iouAction1, iouAction2, mergeParams, updatedMainTransaction, removedDuplicate1, removedDuplicate2, updatedMainViolations, updatedDup1Violations, updatedDup2Violations, updatedReport, updatedReportActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportID = 'report123';
                        mainTransactionID = 'main123';
                        duplicate1ID = 'dup456';
                        duplicate2ID = 'dup789';
                        duplicateTransactionIDs = [duplicate1ID, duplicate2ID];
                        childReportID = 'child123';
                        mainTransaction = createMockTransaction(mainTransactionID, reportID, 150);
                        duplicateTransaction1 = createMockTransaction(duplicate1ID, reportID, 100);
                        duplicateTransaction2 = createMockTransaction(duplicate2ID, reportID, 50);
                        expenseReport = createMockReport(reportID, 300);
                        mainViolations = createMockViolations();
                        duplicate1Violations = createMockViolations();
                        duplicate2Violations = createMockViolations();
                        iouAction1 = createMockIouAction(duplicate1ID, 'action456', childReportID);
                        iouAction2 = createMockIouAction(duplicate2ID, 'action789', childReportID);
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID), mainTransaction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate1ID), duplicateTransaction1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate2ID), duplicateTransaction2)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), expenseReport)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(mainTransactionID), mainViolations)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate1ID), duplicate1Violations)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate2ID), duplicate2Violations)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID), {
                                action456: iouAction1,
                                action789: iouAction2,
                            })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(childReportID), {})];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 10:
                        _a.sent();
                        mergeParams = {
                            transactionID: mainTransactionID,
                            transactionIDList: duplicateTransactionIDs,
                            created: '2024-01-01 12:00:00',
                            merchant: 'Updated Merchant',
                            amount: 200,
                            currency: CONST_1.default.CURRENCY.EUR,
                            category: 'Travel',
                            comment: 'Updated comment',
                            billable: true,
                            reimbursable: false,
                            tag: 'UpdatedProject',
                            receiptID: 123,
                            reportID: reportID,
                        };
                        // When: Call mergeDuplicates
                        (0, IOU_1.mergeDuplicates)(mergeParams);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID))];
                    case 12:
                        updatedMainTransaction = _a.sent();
                        expect(updatedMainTransaction).toMatchObject({
                            billable: true,
                            comment: { comment: 'Updated comment' },
                            category: 'Travel',
                            created: '2024-01-01 12:00:00',
                            currency: CONST_1.default.CURRENCY.EUR,
                            modifiedMerchant: 'Updated Merchant',
                            reimbursable: false,
                            tag: 'UpdatedProject',
                        });
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate1ID))];
                    case 13:
                        removedDuplicate1 = _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate2ID))];
                    case 14:
                        removedDuplicate2 = _a.sent();
                        expect(removedDuplicate1).toBeFalsy();
                        expect(removedDuplicate2).toBeFalsy();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(mainTransactionID))];
                    case 15:
                        updatedMainViolations = _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate1ID))];
                    case 16:
                        updatedDup1Violations = _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate2ID))];
                    case 17:
                        updatedDup2Violations = _a.sent();
                        expect(updatedMainViolations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
                        expect(updatedDup1Violations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
                        expect(updatedDup2Violations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID))];
                    case 18:
                        updatedReport = _a.sent();
                        expect(updatedReport === null || updatedReport === void 0 ? void 0 : updatedReport.total).toBe(150); // 300 - 100 - 50 = 150
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID))];
                    case 19:
                        updatedReportActions = _a.sent();
                        expect((0, ReportActionsUtils_1.getOriginalMessage)(updatedReportActions === null || updatedReportActions === void 0 ? void 0 : updatedReportActions.action456)).toHaveProperty('deleted');
                        expect((0, ReportActionsUtils_1.getOriginalMessage)(updatedReportActions === null || updatedReportActions === void 0 ? void 0 : updatedReportActions.action789)).toHaveProperty('deleted');
                        // Then: Verify API was called with correct parameters
                        expect(writeSpy).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.MERGE_DUPLICATES, expect.objectContaining(mergeParams), expect.objectContaining({
                            optimisticData: expect.arrayContaining([]),
                            failureData: expect.arrayContaining([]),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle empty duplicate transaction list', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, mainTransactionID, mainTransaction, expenseReport, mergeParams, updatedMainTransaction, updatedReport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportID = 'report123';
                        mainTransactionID = 'main123';
                        mainTransaction = createMockTransaction(mainTransactionID, reportID);
                        expenseReport = createMockReport(reportID, 150);
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID), mainTransaction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), expenseReport)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(mainTransactionID), [])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID), {})];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _a.sent();
                        mergeParams = {
                            transactionID: mainTransactionID,
                            transactionIDList: [],
                            created: '2024-01-01 12:00:00',
                            merchant: 'Updated Merchant',
                            amount: 200,
                            currency: CONST_1.default.CURRENCY.EUR,
                            category: 'Travel',
                            comment: 'Updated comment',
                            billable: true,
                            reimbursable: false,
                            tag: 'UpdatedProject',
                            receiptID: 123,
                            reportID: reportID,
                        };
                        // When: Call mergeDuplicates with empty duplicate list
                        (0, IOU_1.mergeDuplicates)(mergeParams);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID))];
                    case 7:
                        updatedMainTransaction = _a.sent();
                        expect(updatedMainTransaction).toMatchObject({
                            billable: true,
                            comment: { comment: 'Updated comment' },
                            category: 'Travel',
                            modifiedMerchant: 'Updated Merchant',
                        });
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID))];
                    case 8:
                        updatedReport = _a.sent();
                        expect(updatedReport === null || updatedReport === void 0 ? void 0 : updatedReport.total).toBe(150);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle missing expense report gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, mainTransactionID, duplicate1ID, duplicateTransactionIDs, mainTransaction, duplicateTransaction, mergeParams, updatedMainTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportID = 'report123';
                        mainTransactionID = 'main123';
                        duplicate1ID = 'dup456';
                        duplicateTransactionIDs = [duplicate1ID];
                        mainTransaction = createMockTransaction(mainTransactionID, reportID);
                        duplicateTransaction = createMockTransaction(duplicate1ID, reportID, 50);
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID), mainTransaction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate1ID), duplicateTransaction)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(mainTransactionID), [])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate1ID), [])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID), {})];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _a.sent();
                        mergeParams = {
                            transactionID: mainTransactionID,
                            transactionIDList: duplicateTransactionIDs,
                            created: '2024-01-01 12:00:00',
                            merchant: 'Updated Merchant',
                            amount: 200,
                            currency: CONST_1.default.CURRENCY.EUR,
                            category: 'Travel',
                            comment: 'Updated comment',
                            billable: true,
                            reimbursable: false,
                            tag: 'UpdatedProject',
                            receiptID: 123,
                            reportID: reportID,
                        };
                        // When: Call mergeDuplicates without expense report
                        (0, IOU_1.mergeDuplicates)(mergeParams);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID))];
                    case 8:
                        updatedMainTransaction = _a.sent();
                        expect(updatedMainTransaction).toMatchObject({
                            category: 'Travel',
                            modifiedMerchant: 'Updated Merchant',
                        });
                        // Then: Verify API was still called
                        expect(writeSpy).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.MERGE_DUPLICATES, expect.objectContaining({}), expect.objectContaining({}));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('resolveDuplicates', function () {
        var writeSpy;
        beforeEach(function () {
            jest.clearAllMocks();
            global.fetch = (0, TestHelper_1.getGlobalFetchMock)();
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            writeSpy = jest.spyOn(API, 'write').mockImplementation(function (command, params, options) {
                // Apply optimistic data for testing
                if (options === null || options === void 0 ? void 0 : options.optimisticData) {
                    options.optimisticData.forEach(function (update) {
                        if (update.onyxMethod === react_native_onyx_1.default.METHOD.MERGE) {
                            react_native_onyx_1.default.merge(update.key, update.value);
                        }
                        else if (update.onyxMethod === react_native_onyx_1.default.METHOD.SET) {
                            react_native_onyx_1.default.set(update.key, update.value);
                        }
                    });
                }
                return Promise.resolve();
            });
            return react_native_onyx_1.default.clear();
        });
        afterEach(function () {
            writeSpy.mockRestore();
        });
        var createMockTransaction = function (id, reportID, amount) {
            if (amount === void 0) { amount = 100; }
            return (__assign(__assign({}, (0, transaction_1.default)(Number(id))), { transactionID: id, reportID: reportID, amount: amount, created: '2024-01-01 12:00:00', currency: 'EUR', merchant: 'Test Merchant', modifiedMerchant: 'Updated Merchant', comment: { comment: 'Updated comment' }, category: 'Travel', tag: 'UpdatedProject', billable: true, reimbursable: false }));
        };
        var createMockViolations = function () { return [
            { name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
            { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
        ]; };
        var createMockIouAction = function (transactionID, reportActionID, childReportID) { return ({
            reportActionID: reportActionID,
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            originalMessage: {
                IOUTransactionID: transactionID,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
            },
            message: [{ type: 'TEXT', text: 'Test IOU message' }],
            childReportID: childReportID,
        }); };
        it('should resolve duplicate transactions successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, mainTransactionID, duplicate1ID, duplicate2ID, duplicateTransactionIDs, childReportID1, childReportID2, mainChildReportID, mainTransaction, duplicateTransaction1, duplicateTransaction2, mainViolations, duplicate1Violations, duplicate2Violations, iouAction1, iouAction2, mainIouAction, resolveParams, updatedMainTransaction, duplicateTransaction1Updated, duplicateTransaction2Updated, updatedMainViolations, updatedDup1Violations, updatedDup2Violations, childReportActions1, childReportActions2, mainChildReportActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportID = 'report123';
                        mainTransactionID = 'main123';
                        duplicate1ID = 'dup456';
                        duplicate2ID = 'dup789';
                        duplicateTransactionIDs = [duplicate1ID, duplicate2ID];
                        childReportID1 = 'child456';
                        childReportID2 = 'child789';
                        mainChildReportID = 'mainChild123';
                        mainTransaction = createMockTransaction(mainTransactionID, reportID, 150);
                        duplicateTransaction1 = createMockTransaction(duplicate1ID, reportID, 100);
                        duplicateTransaction2 = createMockTransaction(duplicate2ID, reportID, 50);
                        mainViolations = createMockViolations();
                        duplicate1Violations = createMockViolations();
                        duplicate2Violations = createMockViolations();
                        iouAction1 = createMockIouAction(duplicate1ID, 'action456', childReportID1);
                        iouAction2 = createMockIouAction(duplicate2ID, 'action789', childReportID2);
                        mainIouAction = createMockIouAction(mainTransactionID, 'mainAction123', mainChildReportID);
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID), mainTransaction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate1ID), duplicateTransaction1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate2ID), duplicateTransaction2)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(mainTransactionID), mainViolations)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate1ID), duplicate1Violations)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate2ID), duplicate2Violations)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID), {
                                action456: iouAction1,
                                action789: iouAction2,
                                mainAction123: mainIouAction,
                            })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(childReportID1), {})];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(childReportID2), {})];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 10:
                        _a.sent();
                        resolveParams = {
                            transactionID: mainTransactionID,
                            transactionIDList: duplicateTransactionIDs,
                            created: '2024-01-01 12:00:00',
                            merchant: 'Updated Merchant',
                            amount: 200,
                            currency: CONST_1.default.CURRENCY.EUR,
                            category: 'Travel',
                            comment: 'Updated comment',
                            billable: true,
                            reimbursable: false,
                            tag: 'UpdatedProject',
                            receiptID: 123,
                            reportID: reportID,
                        };
                        // When: Call resolveDuplicates
                        (0, IOU_1.resolveDuplicates)(resolveParams);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID))];
                    case 12:
                        updatedMainTransaction = _a.sent();
                        expect(updatedMainTransaction).toMatchObject({
                            billable: true,
                            comment: { comment: 'Updated comment' },
                            category: 'Travel',
                            created: '2024-01-01 12:00:00',
                            currency: CONST_1.default.CURRENCY.EUR,
                            modifiedMerchant: 'Updated Merchant',
                            reimbursable: false,
                            tag: 'UpdatedProject',
                        });
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate1ID))];
                    case 13:
                        duplicateTransaction1Updated = _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate2ID))];
                    case 14:
                        duplicateTransaction2Updated = _a.sent();
                        expect(duplicateTransaction1Updated).not.toBeNull();
                        expect(duplicateTransaction2Updated).not.toBeNull();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(mainTransactionID))];
                    case 15:
                        updatedMainViolations = _a.sent();
                        expect(updatedMainViolations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate1ID))];
                    case 16:
                        updatedDup1Violations = _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate2ID))];
                    case 17:
                        updatedDup2Violations = _a.sent();
                        expect(updatedDup1Violations).toEqual(expect.arrayContaining([
                            { name: CONST_1.default.VIOLATIONS.HOLD, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                            { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                        ]));
                        expect(updatedDup2Violations).toEqual(expect.arrayContaining([
                            { name: CONST_1.default.VIOLATIONS.HOLD, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                            { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                        ]));
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(childReportID1))];
                    case 18:
                        childReportActions1 = _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(childReportID2))];
                    case 19:
                        childReportActions2 = _a.sent();
                        // Should have hold actions added
                        expect(Object.keys(childReportActions1 !== null && childReportActions1 !== void 0 ? childReportActions1 : {})).toHaveLength(1);
                        expect(Object.keys(childReportActions2 !== null && childReportActions2 !== void 0 ? childReportActions2 : {})).toHaveLength(1);
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(mainChildReportID))];
                    case 20:
                        mainChildReportActions = _a.sent();
                        expect(Object.keys(mainChildReportActions !== null && mainChildReportActions !== void 0 ? mainChildReportActions : {})).toHaveLength(1);
                        // Then: Verify API was called with correct parameters
                        expect(writeSpy).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.RESOLVE_DUPLICATES, expect.objectContaining({
                            transactionID: mainTransactionID,
                            transactionIDList: duplicateTransactionIDs,
                            reportActionIDList: expect.arrayContaining([]),
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            dismissedViolationReportActionID: expect.anything(),
                        }), expect.objectContaining({
                            optimisticData: expect.arrayContaining([]),
                            failureData: expect.arrayContaining([]),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return early when transactionID is undefined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resolveParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resolveParams = {
                            transactionID: undefined,
                            transactionIDList: ['dup456'],
                            created: '2024-01-01 12:00:00',
                            merchant: 'Updated Merchant',
                            amount: 200,
                            currency: CONST_1.default.CURRENCY.EUR,
                            category: 'Travel',
                            comment: 'Updated comment',
                            billable: true,
                            reimbursable: false,
                            tag: 'UpdatedProject',
                            receiptID: 123,
                            reportID: 'report123',
                        };
                        // When: Call resolveDuplicates with undefined transactionID
                        (0, IOU_1.resolveDuplicates)(resolveParams);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        // Then: Verify API was not called
                        expect(writeSpy).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle empty duplicate transaction list', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, mainTransactionID, mainChildReportID, mainTransaction, mainViolations, mainIouAction, resolveParams, updatedMainTransaction, updatedMainViolations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportID = 'report123';
                        mainTransactionID = 'main123';
                        mainChildReportID = 'mainChild123';
                        mainTransaction = createMockTransaction(mainTransactionID, reportID);
                        mainViolations = createMockViolations();
                        mainIouAction = createMockIouAction(mainTransactionID, 'mainAction123', mainChildReportID);
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID), mainTransaction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(mainTransactionID), mainViolations)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID), {
                                mainAction123: mainIouAction,
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(mainChildReportID), {})];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 5:
                        _a.sent();
                        resolveParams = {
                            transactionID: mainTransactionID,
                            transactionIDList: [],
                            created: '2024-01-01 12:00:00',
                            merchant: 'Updated Merchant',
                            amount: 200,
                            currency: CONST_1.default.CURRENCY.EUR,
                            category: 'Travel',
                            comment: 'Updated comment',
                            billable: true,
                            reimbursable: false,
                            tag: 'UpdatedProject',
                            receiptID: 123,
                            reportID: reportID,
                        };
                        // When: Call resolveDuplicates with empty duplicate list
                        (0, IOU_1.resolveDuplicates)(resolveParams);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID))];
                    case 7:
                        updatedMainTransaction = _a.sent();
                        expect(updatedMainTransaction).toMatchObject({
                            billable: true,
                            category: 'Travel',
                            modifiedMerchant: 'Updated Merchant',
                        });
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(mainTransactionID))];
                    case 8:
                        updatedMainViolations = _a.sent();
                        expect(updatedMainViolations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
                        // Then: Verify API was called
                        // eslint-disable-next-line
                        expect(API.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.RESOLVE_DUPLICATES, expect.objectContaining({}), expect.objectContaining({}));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle missing IOU actions gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, mainTransactionID, duplicate1ID, duplicateTransactionIDs, mainTransaction, duplicateTransaction, mainViolations, duplicateViolations, resolveParams, updatedMainTransaction, updatedDuplicateViolations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportID = 'report123';
                        mainTransactionID = 'main123';
                        duplicate1ID = 'dup456';
                        duplicateTransactionIDs = [duplicate1ID];
                        mainTransaction = createMockTransaction(mainTransactionID, reportID);
                        duplicateTransaction = createMockTransaction(duplicate1ID, reportID);
                        mainViolations = createMockViolations();
                        duplicateViolations = createMockViolations();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID), mainTransaction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicate1ID), duplicateTransaction)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(mainTransactionID), mainViolations)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate1ID), duplicateViolations)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID), {})];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _a.sent();
                        resolveParams = {
                            transactionID: mainTransactionID,
                            transactionIDList: duplicateTransactionIDs,
                            created: '2024-01-01 12:00:00',
                            merchant: 'Updated Merchant',
                            amount: 200,
                            currency: CONST_1.default.CURRENCY.EUR,
                            category: 'Travel',
                            comment: 'Updated comment',
                            billable: true,
                            reimbursable: false,
                            tag: 'UpdatedProject',
                            receiptID: 123,
                            reportID: reportID,
                        };
                        // When: Call resolveDuplicates without IOU actions
                        (0, IOU_1.resolveDuplicates)(resolveParams);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mainTransactionID))];
                    case 8:
                        updatedMainTransaction = _a.sent();
                        expect(updatedMainTransaction).toMatchObject({
                            category: 'Travel',
                            modifiedMerchant: 'Updated Merchant',
                        });
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicate1ID))];
                    case 9:
                        updatedDuplicateViolations = _a.sent();
                        expect(updatedDuplicateViolations).toEqual(expect.arrayContaining([
                            { name: CONST_1.default.VIOLATIONS.HOLD, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                            { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                        ]));
                        // Then: Verify API was called
                        expect(writeSpy).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.RESOLVE_DUPLICATES, expect.objectContaining({}), expect.objectContaining({}));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPerDiemExpenseInformation', function () {
        it('should return correct per diem expense information with new chat report', function () {
            var _a;
            // Given: Mock data for per diem expense
            var mockCustomUnit = {
                customUnitID: 'per_diem_123',
                customUnitRateID: 'rate_456',
                name: CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL,
                attributes: {
                    dates: {
                        start: '2024-01-15',
                        end: '2024-01-15',
                    },
                },
                subRates: [
                    {
                        id: 'breakfast_1',
                        name: 'Breakfast',
                        rate: 25,
                        quantity: 1,
                    },
                    {
                        id: 'lunch_1',
                        name: 'Lunch',
                        rate: 35,
                        quantity: 1,
                    },
                ],
                quantity: 1,
            };
            var mockParticipant = {
                accountID: 123,
                login: 'test@example.com',
                displayName: 'Test User',
                isPolicyExpenseChat: false,
                notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                role: CONST_1.default.REPORT.ROLE.MEMBER,
            };
            var mockTransactionParams = {
                currency: 'USD',
                created: '2024-01-15',
                category: 'Travel',
                tag: 'Project A',
                customUnit: mockCustomUnit,
                billable: true,
                attendees: [],
                reimbursable: true,
                comment: 'Business trip per diem',
            };
            var mockParticipantParams = {
                payeeAccountID: 456,
                payeeEmail: 'payee@example.com',
                participant: mockParticipant,
            };
            var mockPolicyParams = {
                policy: (0, policies_1.default)(1),
                policyCategories: (0, policyCategory_1.default)(3),
                policyTagList: (0, policyTags_1.default)('tagList', 2),
            };
            // When: Call getPerDiemExpenseInformation
            var result = (0, IOU_1.getPerDiemExpenseInformation)({
                parentChatReport: {},
                transactionParams: mockTransactionParams,
                participantParams: mockParticipantParams,
                policyParams: mockPolicyParams,
                recentlyUsedParams: {},
                moneyRequestReportID: '1',
            });
            // Then: Verify the result structure and key values
            expect(result).toMatchObject({
                payerAccountID: 123,
                payerEmail: 'test@example.com',
                billable: true,
                reimbursable: true,
            });
            // Verify chat report was created
            expect(result.chatReport).toBeDefined();
            expect(result.chatReport.reportID).toBeDefined();
            // Verify IOU report was created
            expect(result.iouReport).toBeDefined();
            expect(result.iouReport.reportID).toBeDefined();
            expect(result.iouReport.type).toBe(CONST_1.default.REPORT.TYPE.IOU);
            // Verify transaction was created with correct per diem data
            expect(result.transaction).toBeDefined();
            expect(result.transaction.transactionID).toBeDefined();
            expect(result.transaction.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM);
            expect(result.transaction.hasEReceipt).toBe(true);
            expect(result.transaction.currency).toBe('USD');
            expect(result.transaction.category).toBe('Travel');
            expect(result.transaction.tag).toBe('Project A');
            expect((_a = result.transaction.comment) === null || _a === void 0 ? void 0 : _a.comment).toBe('Business trip per diem');
            // Verify IOU action was created
            expect(result.iouAction).toBeDefined();
            expect(result.iouAction.reportActionID).toBeDefined();
            expect(result.iouAction.actionName).toBe(CONST_1.default.REPORT.ACTIONS.TYPE.IOU);
            // Verify report preview action
            expect(result.reportPreviewAction).toBeDefined();
            expect(result.reportPreviewAction.reportActionID).toBeDefined();
            // Verify Onyx data structure
            expect(result.onyxData).toBeDefined();
            expect(result.onyxData.optimisticData).toBeDefined();
            expect(result.onyxData.successData).toBeDefined();
            expect(result.onyxData.failureData).toBeDefined();
            // Verify created action IDs for new reports
            expect(result.createdChatReportActionID).toBeDefined();
            expect(result.createdIOUReportActionID).toBeDefined();
        });
        it('should return correct per diem expense information with existing chat report', function () {
            var _a;
            // Given: Existing chat report
            var existingChatReport = {
                reportID: 'chat_123',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                participants: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '123': {
                        accountID: 123,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '456': {
                        accountID: 456,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
                iouReportID: 'iou_456',
                type: CONST_1.default.REPORT.TYPE.CHAT,
            };
            var mockCustomUnit = {
                customUnitID: 'per_diem_789',
                customUnitRateID: 'rate_101',
                name: CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL,
                attributes: {
                    dates: {
                        start: '2024-01-20',
                        end: '2024-01-20',
                    },
                },
                subRates: [
                    {
                        id: 'dinner_1',
                        name: 'Dinner',
                        rate: 45,
                        quantity: 1,
                    },
                ],
                quantity: 2,
            };
            var mockParticipant = {
                accountID: 123,
                login: 'existing@example.com',
                displayName: 'Existing User',
                isPolicyExpenseChat: false,
                notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                role: CONST_1.default.REPORT.ROLE.MEMBER,
            };
            var mockTransactionParams = {
                comment: 'Conference per diem',
                currency: 'USD',
                created: '2024-01-20',
                category: 'Meals',
                tag: 'Conference',
                customUnit: mockCustomUnit,
                billable: false,
                attendees: [],
                reimbursable: true,
            };
            var mockParticipantParams = {
                payeeAccountID: 456,
                payeeEmail: 'payee@example.com',
                participant: mockParticipant,
            };
            // When: Call getPerDiemExpenseInformation with existing chat report
            var result = (0, IOU_1.getPerDiemExpenseInformation)({
                parentChatReport: existingChatReport,
                transactionParams: mockTransactionParams,
                participantParams: mockParticipantParams,
                recentlyUsedParams: {},
            });
            // Then: Verify the result uses existing chat report
            expect(result.chatReport.reportID).toBe('chat_123');
            expect(result.chatReport.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.GROUP);
            // Verify transaction has correct per diem data
            expect(result.transaction.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM);
            expect(result.transaction.hasEReceipt).toBe(true);
            expect(result.transaction.currency).toBe('USD');
            expect(result.transaction.category).toBe('Meals');
            expect(result.transaction.tag).toBe('Conference');
            expect((_a = result.transaction.comment) === null || _a === void 0 ? void 0 : _a.comment).toBe('Conference per diem');
            // Verify no new chat report action ID since using existing
            expect(result.createdChatReportActionID).toBeUndefined();
        });
        it('should handle policy expense chat correctly', function () {
            // Given: Policy expense chat participant
            var mockParticipant = {
                accountID: 123,
                login: 'policy@example.com',
                displayName: 'Policy User',
                isPolicyExpenseChat: true,
                reportID: 'policy_chat_123',
                notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                role: CONST_1.default.REPORT.ROLE.MEMBER,
            };
            var mockCustomUnit = {
                customUnitID: 'per_diem_policy',
                customUnitRateID: 'rate_policy',
                name: CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL,
                attributes: {
                    dates: {
                        start: '2024-01-25',
                        end: '2024-01-25',
                    },
                },
                subRates: [
                    {
                        id: 'lodging_1',
                        name: 'Lodging',
                        rate: 150,
                        quantity: 1,
                    },
                ],
                quantity: 1,
            };
            var mockTransactionParams = {
                comment: 'Policy per diem',
                currency: 'USD',
                created: '2024-01-25',
                category: 'Lodging',
                tag: 'Policy',
                customUnit: mockCustomUnit,
                billable: true,
                attendees: [],
                reimbursable: true,
            };
            var mockParticipantParams = {
                payeeAccountID: 456,
                payeeEmail: 'payee@example.com',
                participant: mockParticipant,
            };
            var mockPolicyParams = {
                policy: (0, policies_1.default)(2),
            };
            // When: Call getPerDiemExpenseInformation for policy expense chat
            var result = (0, IOU_1.getPerDiemExpenseInformation)({
                parentChatReport: {},
                transactionParams: mockTransactionParams,
                participantParams: mockParticipantParams,
                policyParams: mockPolicyParams,
                recentlyUsedParams: {},
            });
            // Then: Verify policy expense chat handling
            expect(result.payerAccountID).toBe(123);
            expect(result.payerEmail).toBe('policy@example.com');
            expect(result.transaction.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM);
            expect(result.transaction.hasEReceipt).toBe(true);
            expect(result.billable).toBe(true);
            expect(result.reimbursable).toBe(true);
        });
    });
    describe('getSendInvoiceInformation', function () {
        it('should return correct invoice information with new chat report', function () {
            // Given: Mock transaction data
            var mockTransaction = {
                transactionID: 'transaction_123',
                reportID: 'report_123',
                amount: 500,
                currency: 'USD',
                created: '2024-01-15',
                merchant: 'Test Company',
                category: 'Services',
                tag: 'Project B',
                taxCode: 'TAX001',
                taxAmount: 50,
                billable: true,
                comment: {
                    comment: 'Invoice for consulting services',
                },
                participants: [
                    {
                        accountID: 123,
                        isSender: true,
                        policyID: 'workspace_123',
                    },
                    {
                        accountID: 456,
                        isSender: false,
                    },
                ],
            };
            var currentUserAccountID = 123;
            var mockPolicy = (0, policies_1.default)(1);
            var mockPolicyCategories = {
                Services: {
                    name: 'Services',
                    enabled: true,
                },
            };
            var mockPolicyTagList = {
                tagList: {
                    name: 'tagList',
                    orderWeight: 0,
                    required: false,
                    tags: {
                        projectB: {
                            name: 'Project B',
                            enabled: true,
                        },
                    },
                },
            };
            // When: Call getSendInvoiceInformation
            var result = (0, IOU_1.getSendInvoiceInformation)(mockTransaction, currentUserAccountID, undefined, // invoiceChatReport
            undefined, // receipt
            mockPolicy, mockPolicyTagList, mockPolicyCategories, 'Test Company Inc.', 'https://testcompany.com', ['Services', 'Consulting']);
            // Then: Verify the result structure and key values
            expect(result).toMatchObject({
                senderWorkspaceID: 'workspace_123',
                invoiceReportID: expect.any(String),
                transactionID: expect.any(String),
                transactionThreadReportID: expect.any(String),
                createdIOUReportActionID: expect.any(String),
                reportActionID: expect.any(String),
                createdChatReportActionID: expect.any(String),
                reportPreviewReportActionID: expect.any(String),
            });
            // Verify receiver information
            expect(result.receiver).toBeDefined();
            expect(result.receiver.accountID).toBe(123);
            // Verify invoice room (chat report)
            expect(result.invoiceRoom).toBeDefined();
            expect(result.invoiceRoom.reportID).toBeDefined();
            expect(result.invoiceRoom.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.INVOICE);
            // Verify Onyx data structure
            expect(result.onyxData).toBeDefined();
            expect(result.onyxData.optimisticData).toBeDefined();
            expect(result.onyxData.successData).toBeDefined();
            expect(result.onyxData.failureData).toBeDefined();
        });
        it('should return correct invoice information with existing chat report', function () {
            // Given: Existing invoice chat report
            var existingInvoiceChatReport = {
                reportID: 'invoice_chat_123',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '123': {
                        accountID: 123,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '456': {
                        accountID: 456,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
                invoiceReceiver: {
                    type: 'individual',
                    accountID: 456,
                    displayName: 'Client Company',
                    login: 'client@example.com',
                },
            };
            var mockTransaction = {
                transactionID: 'transaction_456',
                reportID: 'report_456',
                amount: 750,
                currency: 'EUR',
                created: '2024-01-20',
                merchant: 'Client Company',
                category: 'Development',
                tag: 'Project C',
                taxCode: 'TAX002',
                taxAmount: 75,
                billable: true,
                comment: {
                    comment: 'Invoice for development work',
                },
                participants: [
                    {
                        accountID: 123,
                        isSender: true,
                        policyID: 'workspace_456',
                    },
                    {
                        accountID: 456,
                        isSender: false,
                    },
                ],
            };
            var currentUserAccountID = 123;
            // When: Call getSendInvoiceInformation with existing chat report
            var result = (0, IOU_1.getSendInvoiceInformation)(mockTransaction, currentUserAccountID, existingInvoiceChatReport, undefined, // receipt
            undefined, // policy
            undefined, // policyTagList
            undefined, // policyCategories
            'Client Company Ltd.', 'https://clientcompany.com');
            // Then: Verify the result uses existing chat report
            expect(result.invoiceRoom.reportID).toBe('invoice_chat_123');
            expect(result.invoiceRoom.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.INVOICE);
            // Verify transaction data
            expect(result.transactionID).toBeDefined();
            expect(result.senderWorkspaceID).toBe('workspace_456');
        });
        it('should handle receipt attachment correctly', function () {
            // Given: Transaction with receipt
            var mockTransaction = {
                transactionID: 'transaction_789',
                reportID: 'report_789',
                amount: 300,
                currency: 'USD',
                created: '2024-01-25',
                merchant: 'Receipt Company',
                category: 'Equipment',
                tag: 'Hardware',
                taxCode: 'TAX003',
                taxAmount: 30,
                billable: true,
                comment: {
                    comment: 'Invoice with receipt',
                },
                participants: [
                    {
                        accountID: 123,
                        isSender: true,
                        policyID: 'workspace_789',
                    },
                    {
                        accountID: 456,
                        isSender: false,
                    },
                ],
            };
            var mockReceipt = {
                source: 'receipt_source_123',
                name: 'receipt.pdf',
                state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY,
            };
            var currentUserAccountID = 123;
            // When: Call getSendInvoiceInformation with receipt
            var result = (0, IOU_1.getSendInvoiceInformation)(mockTransaction, currentUserAccountID, undefined, // invoiceChatReport
            mockReceipt, undefined, // policy
            undefined, // policyTagList
            undefined);
            // Then: Verify receipt handling
            expect(result.transactionID).toBeDefined();
            expect(result.invoiceRoom).toBeDefined();
            expect(result.invoiceRoom.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.INVOICE);
            // Verify Onyx data includes receipt information
            expect(result.onyxData).toBeDefined();
            expect(result.onyxData.optimisticData).toBeDefined();
        });
        it('should handle missing transaction data gracefully', function () {
            // Given: Minimal transaction data
            var mockTransaction = {
                transactionID: 'transaction_minimal',
                reportID: 'report_minimal',
                amount: 100,
                currency: 'USD',
                created: '2024-01-30',
                merchant: 'Minimal Company',
                participants: [
                    {
                        accountID: 123,
                        isSender: true,
                    },
                    {
                        accountID: 456,
                        isSender: false,
                    },
                ],
            };
            var currentUserAccountID = 123;
            // When: Call getSendInvoiceInformation with minimal data
            var result = (0, IOU_1.getSendInvoiceInformation)(mockTransaction, currentUserAccountID);
            // Then: Verify function handles missing data gracefully
            expect(result).toBeDefined();
            expect(result.transactionID).toBeDefined();
            expect(result.invoiceRoom).toBeDefined();
            expect(result.invoiceRoom.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.INVOICE);
            expect(result.receiver).toBeDefined();
            expect(result.onyxData).toBeDefined();
        });
    });
    describe('rejectMoneyRequest', function () {
        var amount = 10000;
        var comment = 'This expense is rejected';
        var chatReport;
        var iouReport;
        var transaction;
        var policy;
        var TEST_USER_ACCOUNT_ID = 1;
        var MANAGER_ACCOUNT_ID = 2;
        var ADMIN_ACCOUNT_ID = 3;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Set up test data
                        policy = (0, policies_1.default)(1);
                        policy.role = CONST_1.default.POLICY.ROLE.ADMIN;
                        policy.autoReporting = true;
                        policy.autoReportingFrequency = CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY;
                        chatReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, policyID: policy === null || policy === void 0 ? void 0 : policy.id, type: CONST_1.default.REPORT.TYPE.CHAT });
                        iouReport = __assign(__assign({}, (0, reports_1.createRandomReport)(2)), { type: CONST_1.default.REPORT.TYPE.IOU, ownerAccountID: TEST_USER_ACCOUNT_ID, managerID: MANAGER_ACCOUNT_ID, total: amount, currency: CONST_1.default.CURRENCY.USD, stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, policyID: policy === null || policy === void 0 ? void 0 : policy.id, chatReportID: chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID });
                        transaction = __assign(__assign({}, (0, transaction_1.default)(1)), { reportID: iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID, amount: amount, currency: CONST_1.default.CURRENCY.USD, merchant: 'Test Merchant', transactionID: '1' });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policy === null || policy === void 0 ? void 0 : policy.id), policy)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID), chatReport)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID), iouReport)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID), transaction)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { accountID: ADMIN_ACCOUNT_ID })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.clear()];
                    case 1:
                        _a.sent();
                        jest.clearAllMocks();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reject a money request and return navigation route', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expenseReport, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expenseReport = __assign(__assign({}, iouReport), { type: CONST_1.default.REPORT.TYPE.EXPENSE });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID), expenseReport)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        // When: Reject the money request
                        if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID)) {
                            throw new Error('Required transaction or report data is missing');
                        }
                        result = (0, IOU_1.rejectMoneyRequest)(transaction.transactionID, iouReport.reportID, comment);
                        // Then: Should return navigation route to chat report
                        expect(result).toBe(ROUTES_1.default.REPORT_WITH_ID.getRoute(iouReport.reportID));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add AUTO_REPORTED_REJECTED_EXPENSE violation for expense reports', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expenseReport, violations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expenseReport = __assign(__assign({}, iouReport), { type: CONST_1.default.REPORT.TYPE.EXPENSE });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID), expenseReport)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        // When: Reject the money request
                        if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID)) {
                            throw new Error('Required transaction or report data is missing');
                        }
                        (0, IOU_1.rejectMoneyRequest)(transaction.transactionID, iouReport.reportID, comment);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID))];
                    case 4:
                        violations = _a.sent();
                        expect(violations).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                                type: CONST_1.default.VIOLATION_TYPES.WARNING,
                                data: expect.objectContaining({
                                    comment: comment,
                                }),
                            }),
                        ]));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('markRejectViolationAsResolved', function () {
        var transaction;
        var iouReport;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = (0, transaction_1.default)(1);
                        iouReport = (0, reports_1.createRandomReport)(1);
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID), transaction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID), iouReport)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID), [
                                {
                                    name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                                    type: CONST_1.default.VIOLATION_TYPES.WARNING,
                                    data: { comment: 'Test reject reason' },
                                },
                            ])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.clear()];
                    case 1:
                        _a.sent();
                        jest.clearAllMocks();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should remove AUTO_REPORTED_REJECTED_EXPENSE violation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var violations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // When: Mark violation as resolved
                        if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID)) {
                            throw new Error('Required transaction or report data is missing');
                        }
                        (0, IOU_1.markRejectViolationAsResolved)(transaction.transactionID, iouReport.reportID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, getOnyxValue_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID))];
                    case 2:
                        violations = _a.sent();
                        expect(violations).not.toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                            }),
                        ]));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
