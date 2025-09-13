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
var OnyxUtils_1 = require("react-native-onyx/dist/OnyxUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var OnyxDerived_1 = require("@userActions/OnyxDerived");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
var policies_1 = require("../utils/collections/policies");
var reportActions_1 = require("../utils/collections/reportActions");
var reports_1 = require("../utils/collections/reports");
var transaction_1 = require("../utils/collections/transaction");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var currentUserAccountID = 5;
var currentUserEmail = 'bjorn@vikings.net';
var secondUserAccountID = 6;
var policy = {
    id: '1',
    name: 'Vikings Policy',
    role: 'user',
    type: CONST_1.default.POLICY.TYPE.TEAM,
    owner: '',
    outputCurrency: '',
    isPolicyExpenseChatEnabled: false,
};
describe('canEditFieldOfMoneyRequest', function () {
    describe('move expense', function () {
        beforeAll(function () {
            var _a;
            react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
            var policyCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, [policy], function (current) { return current.id; });
            react_native_onyx_1.default.multiSet(__assign((_a = {}, _a[ONYXKEYS_1.default.SESSION] = { email: currentUserEmail, accountID: currentUserAccountID }, _a), policyCollectionDataSet));
            (0, OnyxDerived_1.default)();
            return (0, waitForBatchedUpdates_1.default)();
        });
        describe('type is invoice', function () {
            var reportActionID = 2;
            var IOUReportID = '1234';
            var IOUTransactionID = '123';
            var randomReportAction = (0, reportActions_1.default)(reportActionID);
            var policyID = '2424';
            var amount = 39;
            var policy1 = __assign(__assign({}, (0, policies_1.default)(Number(policyID), CONST_1.default.POLICY.TYPE.TEAM)), { areInvoicesEnabled: true, role: CONST_1.default.POLICY.ROLE.ADMIN });
            // Given that there is at least one outstanding expense report in a policy
            var outstandingExpenseReport = __assign(__assign({}, (0, reports_1.createExpenseReport)(483)), { policyID: policyID, stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN, statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN, ownerAccountID: currentUserAccountID });
            // When a user creates an invoice in the same policy
            var reportAction = __assign(__assign({}, randomReportAction), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU, actorAccountID: currentUserAccountID, childStateNum: CONST_1.default.REPORT.STATE_NUM.OPEN, childStatusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN, originalMessage: __assign(__assign({}, randomReportAction.originalMessage), { IOUReportID: IOUReportID, IOUTransactionID: IOUTransactionID, type: CONST_1.default.IOU.ACTION.CREATE, amount: amount, currency: CONST_1.default.CURRENCY.USD }) });
            var moneyRequestTransaction = __assign(__assign({}, (0, transaction_1.default)(Number(IOUTransactionID))), { reportID: IOUReportID, transactionID: IOUTransactionID, amount: amount });
            var invoiceReport = __assign(__assign({}, (0, reports_1.createInvoiceReport)(Number(IOUReportID))), { policyID: policyID, ownerAccountID: currentUserAccountID, state: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED, stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, managerID: 8723 });
            beforeEach(function () {
                react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(IOUTransactionID), moneyRequestTransaction);
                react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(IOUReportID), invoiceReport);
                react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(483), outstandingExpenseReport);
                react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), policy1);
                return (0, waitForBatchedUpdates_1.default)();
            });
            afterEach(function () {
                react_native_onyx_1.default.clear();
                return (0, waitForBatchedUpdates_1.default)();
            });
            it('should return false for invoice report action if it is not outstanding report', function () { return __awaiter(void 0, void 0, void 0, function () {
                var outstandingReportsByPolicyID, canEditReportField;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID)];
                        case 1:
                            outstandingReportsByPolicyID = _a.sent();
                            canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                            expect(canEditReportField).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return true for invoice report action when there are outstanding reports', function () { return __awaiter(void 0, void 0, void 0, function () {
                var outstandingReportsByPolicyID, canEditReportField;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(IOUReportID), outstandingExpenseReport)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID)];
                        case 3:
                            outstandingReportsByPolicyID = _a.sent();
                            canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                            expect(canEditReportField).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('type is expense', function () {
            // Test constants for expense report scenarios
            var EXPENSE_OUTSTANDING_REPORT_1_ID = 11;
            var EXPENSE_OUTSTANDING_REPORT_2_ID = 22;
            var EXPENSE_IOU_REPORT_ID = 33;
            var EXPENSE_IOU_TRANSACTION_ID = 44;
            var EXPENSE_AMOUNT = 50;
            var EXPENSE_NON_SUBMITTER_ACCOUNT_ID = 9999;
            var reportActionID = 11;
            var IOUReportID = EXPENSE_IOU_REPORT_ID;
            var IOUTransactionID = EXPENSE_IOU_TRANSACTION_ID;
            var randomReportAction = (0, reportActions_1.default)(reportActionID);
            var policyID = '11';
            var expensePolicy = __assign(__assign({}, (0, policies_1.default)(Number(policyID), CONST_1.default.POLICY.TYPE.TEAM)), { role: CONST_1.default.POLICY.ROLE.USER });
            // Create outstanding expense reports in the same policy (different IDs than our main expense report)
            var outstandingExpenseReport1 = __assign(__assign({}, (0, reports_1.createExpenseReport)(EXPENSE_OUTSTANDING_REPORT_1_ID)), { policyID: policyID, stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN, statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN, ownerAccountID: currentUserAccountID });
            var outstandingExpenseReport2 = __assign(__assign({}, (0, reports_1.createExpenseReport)(EXPENSE_OUTSTANDING_REPORT_2_ID)), { policyID: policyID, stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, ownerAccountID: currentUserAccountID });
            var reportAction = __assign(__assign({}, randomReportAction), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU, actorAccountID: currentUserAccountID, childStateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED, childStatusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, originalMessage: __assign(__assign({}, randomReportAction.originalMessage), { IOUReportID: IOUReportID, IOUTransactionID: IOUTransactionID, type: CONST_1.default.IOU.ACTION.CREATE, amount: EXPENSE_AMOUNT, currency: CONST_1.default.CURRENCY.USD }) });
            var moneyRequestTransaction = __assign(__assign({}, (0, transaction_1.default)(Number(IOUTransactionID))), { reportID: IOUReportID, transactionID: IOUTransactionID, amount: EXPENSE_AMOUNT });
            var expenseReport = __assign(__assign({}, (0, reports_1.createExpenseReport)(Number(IOUReportID))), { policyID: policyID, ownerAccountID: currentUserAccountID, stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED });
            beforeEach(function () {
                var _a;
                var policyCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, [expensePolicy], function (current) { return current.id; });
                react_native_onyx_1.default.multiSet(__assign((_a = {}, _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(IOUTransactionID)] = moneyRequestTransaction, _a), policyCollectionDataSet));
                return (0, waitForBatchedUpdates_1.default)();
            });
            afterEach(function () {
                react_native_onyx_1.default.clear();
                return (0, waitForBatchedUpdates_1.default)();
            });
            it('should return true for submitter when there are multiple outstanding reports', function () { return __awaiter(void 0, void 0, void 0, function () {
                var outstandingReportsByPolicyID, canEditReportField;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Given that there are multiple outstanding expense reports in the same policy
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(IOUReportID), expenseReport)];
                        case 1:
                            // Given that there are multiple outstanding expense reports in the same policy
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(EXPENSE_OUTSTANDING_REPORT_1_ID), outstandingExpenseReport1)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(EXPENSE_OUTSTANDING_REPORT_2_ID), outstandingExpenseReport2)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID)];
                        case 5:
                            outstandingReportsByPolicyID = _a.sent();
                            canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                            // Then they should be able to move the expense since there are multiple outstanding expense reports
                            expect(canEditReportField).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return false when the current user is not the submitter or admin and the report is open', function () { return __awaiter(void 0, void 0, void 0, function () {
                var nonSubmitterExpenseReport, outstandingReportsByPolicyID, canEditReportField;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            nonSubmitterExpenseReport = __assign(__assign({}, expenseReport), { ownerAccountID: EXPENSE_NON_SUBMITTER_ACCOUNT_ID, stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN, statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN });
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(IOUReportID), nonSubmitterExpenseReport)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(EXPENSE_OUTSTANDING_REPORT_1_ID), outstandingExpenseReport1)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(EXPENSE_OUTSTANDING_REPORT_2_ID), outstandingExpenseReport2)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID)];
                        case 5:
                            outstandingReportsByPolicyID = _a.sent();
                            canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                            // Then they should not be able to move the expense since only the submitter or admin can edit the report when the report is open
                            expect(canEditReportField).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return false when there is only one outstanding report and the current user is not the submitter', function () { return __awaiter(void 0, void 0, void 0, function () {
                var approvedReport1, reimbursedReport2, outstandingReportsByPolicyID, canEditReportField;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            approvedReport1 = __assign(__assign({}, outstandingExpenseReport1), { stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED });
                            reimbursedReport2 = __assign(__assign({}, outstandingExpenseReport2), { stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED });
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(IOUReportID), __assign(__assign({}, expenseReport), { ownerAccountID: secondUserAccountID }))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(EXPENSE_OUTSTANDING_REPORT_1_ID), approvedReport1)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(EXPENSE_OUTSTANDING_REPORT_2_ID), reimbursedReport2)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID)];
                        case 5:
                            outstandingReportsByPolicyID = _a.sent();
                            canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                            // Then they should not be able to move the expense since there's only one outstanding report
                            expect(canEditReportField).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return false when the expense report is not outstanding report', function () { return __awaiter(void 0, void 0, void 0, function () {
                var outstandingReportsByPolicyID, canEditReportField;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Given that there are multiple outstanding expense reports in the same policy
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(IOUReportID), __assign(__assign({}, expenseReport), { stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED }))];
                        case 1:
                            // Given that there are multiple outstanding expense reports in the same policy
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(EXPENSE_OUTSTANDING_REPORT_1_ID), outstandingExpenseReport1)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(EXPENSE_OUTSTANDING_REPORT_2_ID), outstandingExpenseReport2)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID)];
                        case 5:
                            outstandingReportsByPolicyID = _a.sent();
                            canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                            // Then they should be able to move the expense since there are multiple outstanding expense reports
                            expect(canEditReportField).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
