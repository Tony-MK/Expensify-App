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
var react_native_1 = require("@testing-library/react-native");
var react_native_onyx_1 = require("react-native-onyx");
var useParticipantsInvoiceReport_1 = require("@hooks/useParticipantsInvoiceReport");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var reports_1 = require("../utils/collections/reports");
var accountID = 12345;
var mockPolicyID = '123';
var activeReportID = 12;
var archivedReportID = 233;
var activeBusinessReportID = 456;
var archivedBusinessReportID = 789;
var activeBusinessPolicyID = 'active_policy_123';
var archivedBusinessPolicyID = 'archived_policy_456';
var activeIndividualInvoiceReceiver = {
    accountID: accountID,
    type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
};
var archivedIndividualReportInvoiceReceiver = {
    accountID: 67890,
    type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
};
var archivedReportNameValuePairs = {
    private_isArchived: '12-3-2024',
};
var activeBusinessInvoiceReceiver = {
    policyID: activeBusinessPolicyID,
    type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS,
};
var archivedBusinessInvoiceReceiver = {
    policyID: archivedBusinessPolicyID,
    type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS,
};
var mockActiveIndividualInvoiceReport = __assign(__assign({}, (0, reports_1.createInvoiceRoom)(activeReportID)), { invoiceReceiver: activeIndividualInvoiceReceiver, policyID: mockPolicyID });
var mockArchivedIndividualInvoiceReport = __assign(__assign({}, (0, reports_1.createInvoiceRoom)(archivedReportID)), { invoiceReceiver: archivedIndividualReportInvoiceReceiver, policyID: mockPolicyID });
var mockActiveBusinessInvoiceReport = __assign(__assign({}, (0, reports_1.createInvoiceRoom)(activeBusinessReportID)), { invoiceReceiver: activeBusinessInvoiceReceiver, policyID: activeBusinessPolicyID });
var mockArchivedBusinessInvoiceReport = __assign(__assign({}, (0, reports_1.createInvoiceRoom)(archivedBusinessReportID)), { invoiceReceiver: archivedBusinessInvoiceReceiver, policyID: archivedBusinessPolicyID });
describe('useParticipantsInvoiceReport', function () {
    describe('Individual Invoice Receiver', function () {
        beforeEach(function () {
            react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        });
        afterEach(function () {
            react_native_onyx_1.default.clear();
        });
        it('should return the invoice report when there is an active individual invoice report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, result, rerender, differentReceiverID, differentPolicyID;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(mockActiveIndividualInvoiceReport === null || mockActiveIndividualInvoiceReport === void 0 ? void 0 : mockActiveIndividualInvoiceReport.reportID), mockActiveIndividualInvoiceReport)];
                    case 1:
                        _b.sent();
                        _a = (0, react_native_1.renderHook)(function (_a) {
                            var receiverID = _a.receiverID, receiverType = _a.receiverType, policyID = _a.policyID;
                            return (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID);
                        }, {
                            initialProps: { receiverID: accountID, receiverType: activeIndividualInvoiceReceiver.type, policyID: mockPolicyID },
                        }), result = _a.result, rerender = _a.rerender;
                        // Should return the active individual invoice report when receiverID, receiverType, and policyID match
                        expect(result.current).toEqual(mockActiveIndividualInvoiceReport);
                        differentReceiverID = 99999;
                        rerender({ receiverID: differentReceiverID, receiverType: activeIndividualInvoiceReceiver.type, policyID: mockPolicyID });
                        expect(result.current).toBeUndefined();
                        differentPolicyID = 'different_policyID_999807';
                        rerender({ receiverID: accountID, receiverType: activeIndividualInvoiceReceiver.type, policyID: differentPolicyID });
                        expect(result.current).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return undefined when the invoice report is archived', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(mockArchivedIndividualInvoiceReport === null || mockArchivedIndividualInvoiceReport === void 0 ? void 0 : mockArchivedIndividualInvoiceReport.reportID), mockArchivedIndividualInvoiceReport)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(mockArchivedIndividualInvoiceReport === null || mockArchivedIndividualInvoiceReport === void 0 ? void 0 : mockArchivedIndividualInvoiceReport.reportID), archivedReportNameValuePairs)];
                    case 2:
                        _a.sent();
                        result = (0, react_native_1.renderHook)(function (_a) {
                            var receiverID = _a.receiverID, receiverType = _a.receiverType, policyID = _a.policyID;
                            return (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID);
                        }, {
                            initialProps: { receiverID: archivedIndividualReportInvoiceReceiver.accountID, receiverType: archivedIndividualReportInvoiceReceiver.type, policyID: mockPolicyID },
                        }).result;
                        // Should return undefined when the invoice report is archived
                        expect(result.current).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return undefined when the report is not an invoice report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expenseReport, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expenseReport = __assign(__assign({}, (0, reports_1.createExpenseReport)(5645)), { invoiceReceiver: activeIndividualInvoiceReceiver, policyID: mockPolicyID });
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(expenseReport.reportID), expenseReport)];
                    case 1:
                        _a.sent();
                        result = (0, react_native_1.renderHook)(function (_a) {
                            var receiverID = _a.receiverID, receiverType = _a.receiverType, policyID = _a.policyID;
                            return (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID);
                        }, {
                            initialProps: { receiverID: accountID, receiverType: activeIndividualInvoiceReceiver.type, policyID: mockPolicyID },
                        }).result;
                        expect(result.current).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Business Invoice Receiver', function () {
        beforeAll(function () {
            react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        });
        afterAll(function () {
            react_native_onyx_1.default.clear();
        });
        it('should return the invoice report when there is an active business invoice report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, result, rerender, differentBusinessPolicyID;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(mockActiveBusinessInvoiceReport === null || mockActiveBusinessInvoiceReport === void 0 ? void 0 : mockActiveBusinessInvoiceReport.reportID), mockActiveBusinessInvoiceReport)];
                    case 1:
                        _b.sent();
                        _a = (0, react_native_1.renderHook)(function (_a) {
                            var receiverID = _a.receiverID, receiverType = _a.receiverType, policyID = _a.policyID;
                            return (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID);
                        }, {
                            initialProps: { receiverID: activeBusinessInvoiceReceiver.policyID, receiverType: activeBusinessInvoiceReceiver.type, policyID: activeBusinessPolicyID },
                        }), result = _a.result, rerender = _a.rerender;
                        // Should return the active business invoice report when receiverID, receiverType, and policyID match
                        expect(result.current).toEqual(mockActiveBusinessInvoiceReport);
                        differentBusinessPolicyID = 'different_business_policy_123';
                        rerender({ receiverID: differentBusinessPolicyID, receiverType: activeBusinessInvoiceReceiver.type, policyID: activeBusinessPolicyID });
                        expect(result.current).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return undefined when the invoice report is archived', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(mockArchivedBusinessInvoiceReport === null || mockArchivedBusinessInvoiceReport === void 0 ? void 0 : mockArchivedBusinessInvoiceReport.reportID), mockArchivedBusinessInvoiceReport)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(mockArchivedBusinessInvoiceReport === null || mockArchivedBusinessInvoiceReport === void 0 ? void 0 : mockArchivedBusinessInvoiceReport.reportID), archivedReportNameValuePairs)];
                    case 2:
                        _a.sent();
                        result = (0, react_native_1.renderHook)(function (_a) {
                            var receiverID = _a.receiverID, receiverType = _a.receiverType, policyID = _a.policyID;
                            return (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID);
                        }, {
                            initialProps: { receiverID: archivedBusinessInvoiceReceiver.policyID, receiverType: archivedBusinessInvoiceReceiver.type, policyID: archivedBusinessPolicyID },
                        }).result;
                        // Should return undefined when the business invoice report is archived
                        expect(result.current).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
