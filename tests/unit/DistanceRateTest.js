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
var DistanceRate_1 = require("@libs/actions/Policy/DistanceRate");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var policies_1 = require("../utils/collections/policies");
var transaction_1 = require("../utils/collections/transaction");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
describe('DistanceRate', function () {
    beforeAll(function () {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        return (0, waitForBatchedUpdates_1.default)();
    });
    describe('deletePolicyDistanceRates', function () {
        it('should set customUnitOutOfPolicy violation only for transactions that have the deleted custom unit rate', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customUnitID, customUnitRateID1, customUnitRateID2, transaction1, transaction2, policy, transactionViolations;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        customUnitID = '5A55C2B68DDCB';
                        customUnitRateID1 = '7255CA72C7E7B';
                        customUnitRateID2 = '7255CA72C7E72';
                        transaction1 = __assign(__assign({}, (0, transaction_1.default)(1)), { comment: {
                                customUnit: {
                                    customUnitID: customUnitID,
                                    customUnitRateID: customUnitRateID1,
                                },
                            } });
                        transaction2 = __assign(__assign({}, (0, transaction_1.default)(2)), { comment: {
                                customUnit: {
                                    customUnitID: customUnitID,
                                    customUnitRateID: customUnitRateID2,
                                },
                            } });
                        policy = __assign(__assign({}, (0, policies_1.default)(3)), {
                            areDistanceRatesEnabled: true,
                            customUnits: (_a = {},
                                _a[customUnitID] = {
                                    attributes: {
                                        unit: CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES,
                                    },
                                    customUnitID: customUnitID,
                                    defaultCategory: 'Car',
                                    enabled: true,
                                    name: 'Distance',
                                    rates: (_b = {},
                                        _b[customUnitRateID1] = {
                                            currency: 'ETB',
                                            customUnitRateID: customUnitRateID1,
                                            enabled: true,
                                            name: 'Default Rate',
                                            rate: 70,
                                            subRates: [],
                                        },
                                        _b[customUnitRateID2] = {
                                            currency: 'ETB',
                                            customUnitRateID: customUnitRateID2,
                                            enabled: true,
                                            name: 'Default Rate',
                                            rate: 71,
                                            subRates: [],
                                        },
                                        _b),
                                },
                                _a),
                        });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction1.transactionID), transaction1)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction2.transactionID), transaction2)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policy.id), policy)];
                    case 3:
                        _d.sent();
                        if (policy.customUnits) {
                            (0, DistanceRate_1.deletePolicyDistanceRates)(policy.id, policy.customUnits[customUnitID], [customUnitRateID1], [transaction1.transactionID], undefined);
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                react_native_onyx_1.default.connect({
                                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
                                    callback: resolve,
                                    waitForCollectionCallback: true,
                                });
                            })];
                    case 5:
                        transactionViolations = _d.sent();
                        expect(transactionViolations).toEqual((_c = {},
                            _c["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transaction1.transactionID)] = [
                                { name: CONST_1.default.VIOLATIONS.CUSTOM_UNIT_OUT_OF_POLICY, showInReview: true, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                            ],
                            _c));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('enablePolicyDistanceRates', function () {
        it('should disable all rates except the default rate when the we disable the feature', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customUnitID, customUnitRateID1, customUnitRateID2, policy, onyxPolicy;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        customUnitID = '5A55C2B68DDCB';
                        customUnitRateID1 = '7255CA72C7E7B';
                        customUnitRateID2 = '7255CA72C7E72';
                        policy = __assign(__assign({}, (0, policies_1.default)(3)), {
                            areDistanceRatesEnabled: true,
                            customUnits: (_a = {},
                                _a[customUnitID] = {
                                    attributes: {
                                        unit: CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES,
                                    },
                                    customUnitID: customUnitID,
                                    defaultCategory: 'Car',
                                    enabled: true,
                                    name: 'Distance',
                                    rates: (_b = {},
                                        _b[customUnitRateID1] = {
                                            currency: 'ETB',
                                            customUnitRateID: customUnitRateID1,
                                            enabled: true,
                                            name: 'Default Rate',
                                            rate: 70,
                                            subRates: [],
                                        },
                                        _b[customUnitRateID2] = {
                                            currency: 'ETB',
                                            customUnitRateID: customUnitRateID2,
                                            enabled: true,
                                            name: 'Default Rate',
                                            rate: 71,
                                            subRates: [],
                                        },
                                        _b),
                                },
                                _a),
                        });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policy.id), policy)];
                    case 1:
                        _e.sent();
                        if (policy.customUnits) {
                            (0, DistanceRate_1.enablePolicyDistanceRates)(policy.id, false, policy.customUnits[customUnitID]);
                        }
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policy.id),
                                    // eslint-disable-next-line rulesdir/prefer-early-return
                                    callback: function (value) {
                                        if (value !== undefined) {
                                            resolve(value);
                                        }
                                    },
                                });
                            })];
                    case 3:
                        onyxPolicy = _e.sent();
                        if (!policy || !policy.customUnits) {
                            return [2 /*return*/];
                        }
                        expect(onyxPolicy).toEqual(__assign(__assign({}, policy), { areDistanceRatesEnabled: false, pendingFields: {
                                areDistanceRatesEnabled: 'update',
                            }, customUnits: (_c = {},
                                _c[customUnitID] = __assign(__assign({}, policy.customUnits[customUnitID]), { rates: (_d = {},
                                        _d[customUnitRateID1] = __assign(__assign({}, policy.customUnits[customUnitID].rates[customUnitRateID1]), { enabled: true }),
                                        _d[customUnitRateID2] = __assign(__assign({}, policy.customUnits[customUnitID].rates[customUnitRateID2]), { enabled: false }),
                                        _d) }),
                                _c) }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
