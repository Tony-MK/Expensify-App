"use strict";
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
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var CONST_1 = require("@src/CONST");
var useGetExpensifyCardFromReportAction_1 = require("@src/hooks/useGetExpensifyCardFromReportAction");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
// Mock the dependencies
jest.mock('@libs/PolicyUtils');
jest.mock('@libs/ReportActionsUtils');
jest.mock('@components/OnyxListItemProvider', function () { return ({
    useCardList: jest.fn(),
    useWorkspaceCardList: jest.fn(),
}); });
// This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
// eslint-disable-next-line deprecation/deprecation
var mockGetPolicy = PolicyUtils_1.getPolicy;
var mockGetWorkspaceAccountID = PolicyUtils_1.getWorkspaceAccountID;
var mockIsPolicyAdmin = PolicyUtils_1.isPolicyAdmin;
var mockGetOriginalMessage = ReportActionsUtils_1.getOriginalMessage;
var mockIsCardIssuedAction = ReportActionsUtils_1.isCardIssuedAction;
var mockUseCardList = OnyxListItemProvider_1.useCardList;
var mockUseWorkspaceCardList = OnyxListItemProvider_1.useWorkspaceCardList;
describe('useGetExpensifyCardFromReportAction', function () {
    var mockCard = {
        cardID: 123,
        cardName: 'Test Card',
        cardNumber: '1234567890123456',
        domainName: 'test.com',
        lastUpdated: '2023-01-01T00:00:00.000Z',
        fraud: CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.NONE,
        state: CONST_1.default.EXPENSIFY_CARD.STATE.OPEN,
        bank: 'Test Bank',
    };
    var createMockReportAction = function (cardID) {
        if (cardID === void 0) { cardID = 123; }
        return ({
            reportActionID: '1',
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_ADD_PAYMENT_CARD,
            originalMessage: { cardID: cardID, assigneeAccountID: 1 },
            created: '2023-01-01T00:00:00.000Z',
            actorAccountID: 1,
            person: [],
            shouldShow: true,
            isAttachmentOnly: false,
            isFirstItem: false,
            pendingAction: null,
            errors: undefined,
            message: [],
            reportID: '1',
        });
    };
    var mockPolicy = {
        id: 'policy123',
        name: 'Test Policy',
        role: CONST_1.default.POLICY.ROLE.USER,
        type: CONST_1.default.POLICY.TYPE.CORPORATE,
        isAttendeeTrackingEnabled: false,
        owner: '1',
        outputCurrency: 'USD',
        isPolicyExpenseChatEnabled: false,
        workspaceAccountID: 123,
    };
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, react_native_onyx_1.default.clear()];
                case 1:
                    _a.sent();
                    jest.clearAllMocks();
                    mockGetPolicy.mockReturnValue(mockPolicy);
                    mockGetWorkspaceAccountID.mockReturnValue(123);
                    mockIsPolicyAdmin.mockReturnValue(false);
                    mockGetOriginalMessage.mockReturnValue({ cardID: 123, assigneeAccountID: 1 });
                    mockIsCardIssuedAction.mockReturnValue(true);
                    mockUseCardList.mockReturnValue({});
                    mockUseWorkspaceCardList.mockReturnValue({});
                    return [2 /*return*/];
            }
        });
    }); });
    describe('when reportAction is not a card issued action', function () {
        it('returns undefined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockIsCardIssuedAction.mockReturnValue(false);
                        result = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _a.sent();
                        expect(result.current).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when reportAction is a card issued action', function () {
        beforeEach(function () {
            mockIsCardIssuedAction.mockReturnValue(true);
            mockGetOriginalMessage.mockReturnValue({ cardID: 123, assigneeAccountID: 1 });
        });
        describe('when user is not a policy admin', function () {
            beforeEach(function () {
                mockIsPolicyAdmin.mockReturnValue(false);
            });
            it('returns card from allUserCards when card exists', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            mockUseCardList.mockReturnValue({ '123': mockCard });
                            result = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                            return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                        case 1:
                            _a.sent();
                            expect(result.current).toEqual(mockCard);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns undefined when card does not exist in allUserCards', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockUseCardList.mockReturnValue({});
                            result = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                            return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                        case 1:
                            _a.sent();
                            expect(result.current).toBeUndefined();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when user is a policy admin', function () {
            beforeEach(function () {
                mockIsPolicyAdmin.mockReturnValue(true);
                mockGetWorkspaceAccountID.mockReturnValue(123);
                // Override the default policy for admin tests
                mockGetPolicy.mockReturnValue({
                    id: 'policy123',
                    name: 'Test Policy',
                    role: CONST_1.default.POLICY.ROLE.ADMIN,
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                    isAttendeeTrackingEnabled: false,
                    owner: '1',
                    outputCurrency: 'USD',
                    isPolicyExpenseChatEnabled: false,
                    workspaceAccountID: 123,
                });
            });
            it('returns card from allExpensifyCards when card exists', function () { return __awaiter(void 0, void 0, void 0, function () {
                var workspaceCardsKey, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            workspaceCardsKey = "".concat(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, "123_").concat(CONST_1.default.EXPENSIFY_CARD.BANK);
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            mockUseWorkspaceCardList.mockReturnValue((_a = {}, _a[workspaceCardsKey] = { 123: mockCard }, _a));
                            result = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                            return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                        case 1:
                            _b.sent();
                            expect(result.current).toEqual(mockCard);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns undefined when card does not exist in allExpensifyCards', function () { return __awaiter(void 0, void 0, void 0, function () {
                var workspaceCardsKey, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            workspaceCardsKey = "".concat(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, "123_").concat(CONST_1.default.EXPENSIFY_CARD.BANK);
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            mockUseWorkspaceCardList.mockReturnValue((_a = {}, _a[workspaceCardsKey] = {}, _a));
                            result = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                            return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                        case 1:
                            _b.sent();
                            expect(result.current).toBeUndefined();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('reactivity to Onyx changes', function () {
        it('updates when allUserCards changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, updatedResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUseCardList.mockReturnValue({});
                        mockUseWorkspaceCardList.mockReturnValue({});
                        result = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _a.sent();
                        expect(result.current).toBeUndefined();
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        mockUseCardList.mockReturnValue({ '123': mockCard });
                        updatedResult = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 2:
                        _a.sent();
                        expect(updatedResult.current).toEqual(mockCard);
                        return [2 /*return*/];
                }
            });
        }); });
        it('updates when allExpensifyCards changes for policy admin', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, workspaceCardsKey, updatedResult;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockIsPolicyAdmin.mockReturnValue(true);
                        mockGetPolicy.mockReturnValue({
                            id: 'policy123',
                            name: 'Test Policy',
                            role: CONST_1.default.POLICY.ROLE.ADMIN,
                            type: CONST_1.default.POLICY.TYPE.CORPORATE,
                            isAttendeeTrackingEnabled: false,
                            owner: '1',
                            outputCurrency: 'USD',
                            isPolicyExpenseChatEnabled: false,
                            workspaceAccountID: 123,
                        });
                        // Set initial state
                        mockUseCardList.mockReturnValue({});
                        mockUseWorkspaceCardList.mockReturnValue({});
                        result = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _b.sent();
                        expect(result.current).toBeUndefined();
                        workspaceCardsKey = "".concat(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, "123_").concat(CONST_1.default.EXPENSIFY_CARD.BANK);
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        mockUseWorkspaceCardList.mockReturnValue((_a = {}, _a[workspaceCardsKey] = { 123: mockCard }, _a));
                        updatedResult = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 2:
                        _b.sent();
                        expect(updatedResult.current).toEqual(mockCard);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('workspace account ID generation', function () {
        it('calls getWorkspaceAccountID with correct policyID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        mockUseCardList.mockReturnValue({ '123': mockCard });
                        result = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'test-policy-123' }); }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockGetWorkspaceAccountID).toHaveBeenCalledWith('test-policy-123');
                        expect(result.current).toEqual(mockCard);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('policy admin check', function () {
        it('calls isPolicyAdmin with correct policy', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testPolicy, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testPolicy = {
                            id: 'policy123',
                            name: 'Test Policy',
                            role: CONST_1.default.POLICY.ROLE.ADMIN,
                            type: CONST_1.default.POLICY.TYPE.CORPORATE,
                            isAttendeeTrackingEnabled: false,
                            owner: '1',
                            outputCurrency: 'USD',
                            isPolicyExpenseChatEnabled: false,
                            workspaceAccountID: 123,
                        };
                        mockGetPolicy.mockReturnValue(testPolicy);
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        mockUseCardList.mockReturnValue({ '123': mockCard });
                        result = (0, react_native_1.renderHook)(function () { return (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }); }).result;
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _a.sent();
                        expect(mockGetPolicy).toHaveBeenCalledWith('policy123');
                        expect(mockIsPolicyAdmin).toHaveBeenCalledWith(testPolicy);
                        expect(result.current).toEqual(mockCard);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
