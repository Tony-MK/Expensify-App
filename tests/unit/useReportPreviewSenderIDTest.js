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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var react_native_onyx_1 = require("react-native-onyx");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var useReportPreviewSenderID_1 = require("@components/ReportActionAvatars/useReportPreviewSenderID");
var OnyxDerived_1 = require("@libs/actions/OnyxDerived");
var CONST_1 = require("@src/CONST");
var PersonalDetailsUtils = require("@src/libs/PersonalDetailsUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
var actions_1 = require("../../__mocks__/reportData/actions");
var personalDetails_1 = require("../../__mocks__/reportData/personalDetails");
var reports_1 = require("../../__mocks__/reportData/reports");
var transactions_1 = require("../../__mocks__/reportData/transactions");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var reportActions = [(_a = {}, _a[actions_1.actionR14932.reportActionID] = actions_1.actionR14932, _a)];
var transactions = [transactions_1.transactionR14932];
var transactionCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, transactions, function (transaction) { return transaction.transactionID; });
var reportActionCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, reportActions, function (actions) { var _a; return (_a = Object.values(actions).at(0)) === null || _a === void 0 ? void 0 : _a.childReportID; });
var validAction = __assign(__assign({}, actions_1.actionR98765), { childReportID: reports_1.iouReportR14932.reportID, actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW, childOwnerAccountID: reports_1.iouReportR14932.ownerAccountID, childManagerAccountID: reports_1.iouReportR14932.managerID });
describe('useReportPreviewSenderID', function () {
    var _a;
    var mockedDMChatRoom = __assign(__assign({}, reports_1.chatReportR14932), { chatType: undefined });
    var mockedEmailToID = (_a = {},
        _a[personalDetails_1.default[15593135].login] = 15593135,
        _a[personalDetails_1.default[51760358].login] = 51760358,
        _a);
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        (0, OnyxDerived_1.default)();
        jest.spyOn(PersonalDetailsUtils, 'getPersonalDetailByEmail').mockImplementation(function (email) { return personalDetails_1.default[mockedEmailToID[email]]; });
    });
    beforeEach(function () {
        react_native_onyx_1.default.multiSet(__assign(__assign({}, reportActionCollectionDataSet), transactionCollectionDataSet));
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterEach(function () {
        react_native_onyx_1.default.clear();
        return (0, waitForBatchedUpdates_1.default)();
    });
    it('returns avatar with no reportPreviewSenderID when action is not a report preview', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = (0, react_native_1.renderHook)(function () {
                        return (0, useReportPreviewSenderID_1.default)({
                            action: actions_1.actionR14932,
                            iouReport: reports_1.iouReportR14932,
                            chatReport: mockedDMChatRoom,
                        });
                    }, { wrapper: OnyxListItemProvider_1.default }).result;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    expect(result.current).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns childManagerAccountID and his avatar when all conditions are met for Send Money flow', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = (0, react_native_1.renderHook)(function () {
                        return (0, useReportPreviewSenderID_1.default)({
                            action: __assign(__assign({}, validAction), { childMoneyRequestCount: 0 }),
                            iouReport: reports_1.iouReportR14932,
                            chatReport: mockedDMChatRoom,
                        });
                    }, { wrapper: OnyxListItemProvider_1.default }).result;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    expect(result.current).toBe(reports_1.iouReportR14932.managerID);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns both avatars & no reportPreviewSenderID when there are multiple attendees', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactions_1.transactionR14932.transactionID), __assign(__assign({}, transactions_1.transactionR14932), { comment: {
                            attendees: [{ email: personalDetails_1.default[15593135].login, displayName: 'Test One', avatarUrl: 'https://none.com/none' }],
                        } }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactions_1.transactionR14932.transactionID, "2"), __assign(__assign({}, transactions_1.transactionR14932), { comment: {
                                attendees: [{ email: personalDetails_1.default[51760358].login, displayName: 'Test Two', avatarUrl: 'https://none.com/none2' }],
                            } }))];
                case 2:
                    _a.sent();
                    result = (0, react_native_1.renderHook)(function () {
                        return (0, useReportPreviewSenderID_1.default)({
                            action: validAction,
                            iouReport: reports_1.iouReportR14932,
                            chatReport: mockedDMChatRoom,
                        });
                    }, { wrapper: OnyxListItemProvider_1.default }).result;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 3:
                    _a.sent();
                    expect(result.current).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns both avatars & no reportPreviewSenderID when amounts have different signs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactions_1.transactionR14932.transactionID), __assign(__assign({}, transactions_1.transactionR14932), { amount: 100 }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactions_1.transactionR14932.transactionID, "2"), __assign(__assign({}, transactions_1.transactionR14932), { amount: -100 }))];
                case 2:
                    _a.sent();
                    result = (0, react_native_1.renderHook)(function () {
                        return (0, useReportPreviewSenderID_1.default)({
                            action: validAction,
                            iouReport: reports_1.iouReportR14932,
                            chatReport: mockedDMChatRoom,
                        });
                    }, { wrapper: OnyxListItemProvider_1.default }).result;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 3:
                    _a.sent();
                    expect(result.current).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns childOwnerAccountID as reportPreviewSenderID and a single avatar when all conditions are met', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = (0, react_native_1.renderHook)(function () {
                        return (0, useReportPreviewSenderID_1.default)({
                            action: validAction,
                            iouReport: reports_1.iouReportR14932,
                            chatReport: mockedDMChatRoom,
                        });
                    }, { wrapper: OnyxListItemProvider_1.default }).result;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    expect(result.current).toBe(reports_1.iouReportR14932.ownerAccountID);
                    return [2 /*return*/];
            }
        });
    }); });
});
