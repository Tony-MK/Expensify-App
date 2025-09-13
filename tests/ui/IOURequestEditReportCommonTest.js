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
var ComposeProviders_1 = require("@components/ComposeProviders");
var LocaleContextProvider_1 = require("@components/LocaleContextProvider");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var IOURequestEditReportCommon_1 = require("@pages/iou/request/step/IOURequestEditReportCommon");
var OnyxDerived_1 = require("@userActions/OnyxDerived");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var policies_1 = require("../utils/collections/policies");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
var FAKE_REPORT_ID = '1';
var FAKE_POLICY_ID = '1';
var FAKE_TRANSACTION_ID = '2';
var FAKE_EMAIL = 'fake@gmail.com';
var FAKE_ACCOUNT_ID = 1;
var FAKE_SECOND_ACCOUNT_ID = 2;
/**
 * Mock the OptionListContextProvider to provide test data for the component.
 * This ensures consistent test data and isolates the component from external dependencies.
 */
jest.mock('@components/OptionListContextProvider', function () { return ({
    useOptionsList: function () { return ({
        options: {
            reports: [
                {
                    reportID: FAKE_REPORT_ID,
                    text: 'Expense Report',
                    keyForList: FAKE_REPORT_ID,
                    brickRoadIndicator: 'error',
                },
            ],
        },
    }); },
    OptionsListContextProvider: function (_a) {
        var children = _a.children;
        return children;
    },
}); });
/**
 * Helper function to render the IOURequestEditReportCommon component with required providers.
 * This encapsulates the component setup and makes tests more readable.
 */
var renderIOURequestEditReportCommon = function (_a) {
    var _b = _a.selectedReportID, selectedReportID = _b === void 0 ? '' : _b, selectedPolicyID = _a.selectedPolicyID;
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            <IOURequestEditReportCommon_1.default selectedReportID={selectedReportID} selectedPolicyID={selectedPolicyID} selectReport={jest.fn()} backTo=""/>
        </ComposeProviders_1.default>);
};
describe('IOURequestEditReportCommon', function () {
    describe('RBR', function () {
        beforeAll(function () {
            var _a;
            // Initialize Onyx with test configuration
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
                initialKeyStates: (_a = {},
                    _a[ONYXKEYS_1.default.SESSION] = { accountID: FAKE_ACCOUNT_ID, email: FAKE_EMAIL },
                    _a),
            });
            (0, OnyxDerived_1.default)();
            return (0, waitForBatchedUpdates_1.default)();
        });
        beforeEach(function () {
            var _a;
            react_native_onyx_1.default.multiSet((_a = {},
                _a["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(FAKE_POLICY_ID)] = (0, policies_1.default)(Number(FAKE_POLICY_ID), CONST_1.default.POLICY.TYPE.TEAM),
                _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(FAKE_REPORT_ID)] = {
                    reportID: FAKE_REPORT_ID,
                    reportName: 'Expense Report',
                    ownerAccountID: FAKE_ACCOUNT_ID,
                    policyID: FAKE_POLICY_ID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                },
                _a));
            return (0, waitForBatchedUpdates_1.default)();
        });
        afterEach(function () {
            react_native_onyx_1.default.clear();
            jest.clearAllMocks();
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('should not show DotIndicator when the report has brickRoadIndicator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockTransactionReport, reportItem, dotIndicators;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockTransactionReport = {
                            reportID: FAKE_TRANSACTION_ID,
                            reportName: 'Transaction Report',
                            ownerAccountID: FAKE_ACCOUNT_ID,
                            policyID: FAKE_POLICY_ID,
                        };
                        react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(mockTransactionReport.reportID), mockTransactionReport);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        // When the component is rendered with the transaction reports
                        renderIOURequestEditReportCommon({ selectedReportID: mockTransactionReport.reportID, selectedPolicyID: mockTransactionReport.policyID });
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 2:
                        _a.sent();
                        reportItem = react_native_1.screen.getByText('Expense Report');
                        expect(reportItem).toBeTruthy();
                        dotIndicators = react_native_1.screen.queryAllByTestId(CONST_1.default.DOT_INDICATOR_TEST_ID);
                        expect(dotIndicators).toHaveLength(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('NotFound', function () {
        beforeAll(function () {
            var _a;
            // Initialize Onyx with test configuration
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
                initialKeyStates: (_a = {},
                    _a[ONYXKEYS_1.default.SESSION] = { accountID: FAKE_SECOND_ACCOUNT_ID, email: FAKE_EMAIL },
                    _a),
            });
        });
        beforeEach(function () {
            var _a;
            react_native_onyx_1.default.multiSet((_a = {},
                _a["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(FAKE_POLICY_ID)] = __assign(__assign({}, (0, policies_1.default)(Number(FAKE_POLICY_ID), CONST_1.default.POLICY.TYPE.TEAM)), { role: CONST_1.default.POLICY.ROLE.USER }),
                _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(FAKE_REPORT_ID)] = {
                    reportID: FAKE_REPORT_ID,
                    reportName: 'Expense Report',
                    ownerAccountID: FAKE_ACCOUNT_ID,
                    policyID: FAKE_POLICY_ID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                },
                _a));
            return (0, waitForBatchedUpdates_1.default)();
        });
        afterEach(function () {
            react_native_onyx_1.default.clear();
            jest.clearAllMocks();
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('should display not found page when the report is Open and the user is not the owner or admin', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockTransactionReport, fullPageNotFoundView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockTransactionReport = {
                            reportID: FAKE_TRANSACTION_ID,
                            reportName: 'Transaction Report',
                            ownerAccountID: FAKE_ACCOUNT_ID,
                            policyID: FAKE_POLICY_ID,
                            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                        };
                        react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(mockTransactionReport.reportID), mockTransactionReport);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        // When the component is rendered with the transaction reports
                        renderIOURequestEditReportCommon({ selectedReportID: mockTransactionReport.reportID, selectedPolicyID: mockTransactionReport.policyID });
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 2:
                        _a.sent();
                        fullPageNotFoundView = react_native_1.screen.getByTestId('FullPageNotFoundView');
                        expect(fullPageNotFoundView).toBeVisible();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
