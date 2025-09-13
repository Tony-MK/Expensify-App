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
var react_native_onyx_1 = require("react-native-onyx");
var CONST_1 = require("@src/CONST");
var IntlStore_1 = require("@src/languages/IntlStore");
var resetUSDBankAccount_1 = require("@src/libs/actions/ReimbursementAccount/resetUSDBankAccount");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var TestHelper = require("../utils/TestHelper");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var TEST_EMAIL = 'test@test.com';
var TEST_ACCOUNT_ID = 1;
var bankAccountID = 1;
var policyID = '1234567890';
var session = { email: TEST_EMAIL, accountID: TEST_ACCOUNT_ID };
describe('ReimbursementAccount', function () {
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    var mockFetch;
    beforeEach(function () {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    describe('resetUSDBankAccount', function () {
        afterEach(function () {
            var _a;
            (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.resume) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
        });
        it('should reset the USDBankAccount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var achAccount;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = fetch === null || fetch === void 0 ? void 0 : fetch.pause) === null || _a === void 0 ? void 0 : _a.call(fetch);
                        achAccount = {
                            bankAccountID: bankAccountID,
                            addressName: 'Test Address',
                            bankName: 'Test Bank',
                            reimburser: TEST_EMAIL,
                            accountNumber: '1234567890',
                            routingNumber: '123456789',
                        };
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), { achAccount: achAccount })];
                    case 1:
                        _b.sent();
                        (0, resetUSDBankAccount_1.default)(bankAccountID, session, policyID, achAccount);
                        return [2 /*return*/, (0, waitForBatchedUpdates_1.default)().then(function () {
                                return new Promise(function (resolve) {
                                    var connection = react_native_onyx_1.default.connect({
                                        key: "".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID),
                                        callback: function (policy) {
                                            react_native_onyx_1.default.disconnect(connection);
                                            expect(policy === null || policy === void 0 ? void 0 : policy.achAccount).toBeUndefined();
                                            resolve();
                                        },
                                    });
                                });
                            })];
                }
            });
        }); });
    });
});
