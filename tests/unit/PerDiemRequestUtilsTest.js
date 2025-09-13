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
var PerDiemRequestUtils_1 = require("@libs/PerDiemRequestUtils");
var CONST_1 = require("@src/CONST");
var PerDiemRequestUtils_2 = require("@src/libs/PerDiemRequestUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var LHNTestUtils_1 = require("../utils/LHNTestUtils");
var policyID = '1';
var report = __assign(__assign({}, (0, LHNTestUtils_1.getFakeReport)()), { policyID: policyID, chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT });
var parentReport = __assign(__assign({}, (0, LHNTestUtils_1.getFakeReport)()), { policyID: policyID });
describe('PerDiemRequestUtils', function () {
    beforeAll(function () {
        return react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(function () {
        react_native_onyx_1.default.clear();
    });
    it('getDestinationListSections()', function () {
        var tokenizeSearch = 'Antigua Barbuda';
        var destinations = [
            {
                currency: 'EUR',
                customUnitRateID: 'Afghanistan',
                enabled: true,
                name: 'Afghanistan',
                rate: 0,
            },
            {
                currency: 'EUR',
                customUnitRateID: 'Antigua and Barbuda',
                enabled: true,
                name: 'Antigua and Barbuda',
                rate: 0,
            },
        ];
        var searchResultList = [
            {
                data: [
                    {
                        currency: 'EUR',
                        isDisabled: false,
                        isSelected: false,
                        keyForList: 'Antigua and Barbuda',
                        searchText: 'Antigua and Barbuda',
                        text: 'Antigua and Barbuda',
                        tooltipText: 'Antigua and Barbuda',
                    },
                ],
                indexOffset: 1,
                shouldShow: true,
                title: '',
            },
        ];
        var tokenizeSearchResult = (0, PerDiemRequestUtils_1.getDestinationListSections)({
            destinations: destinations,
            searchValue: tokenizeSearch,
        });
        expect(tokenizeSearchResult).toStrictEqual(searchResultList);
    });
    describe('getCustomUnitID', function () {
        it('should return the correct custom unit ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policy, customUnitID;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        policy = __assign(__assign({}, (0, LHNTestUtils_1.getFakePolicy)()), { id: policyID, customUnits: (_a = {},
                                _a[CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS] = {
                                    name: CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL,
                                    customUnitID: CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS,
                                    rates: {},
                                },
                                _a) });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), policy)];
                    case 1:
                        _b.sent();
                        customUnitID = (0, PerDiemRequestUtils_2.getCustomUnitID)(report, parentReport);
                        expect(customUnitID.customUnitID).toBe(CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return fake P2P ID if the policy does not have a custom unit', function () { return __awaiter(void 0, void 0, void 0, function () {
            var policy, customUnitID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policy = __assign(__assign({}, (0, LHNTestUtils_1.getFakePolicy)()), { customUnits: {} });
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), policy)];
                    case 1:
                        _a.sent();
                        customUnitID = (0, PerDiemRequestUtils_2.getCustomUnitID)(report, parentReport);
                        expect(customUnitID.customUnitID).toBe(CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
