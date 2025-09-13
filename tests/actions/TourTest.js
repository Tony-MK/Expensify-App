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
var OnyxUpdateManager_1 = require("@libs/actions/OnyxUpdateManager");
var Task_1 = require("@libs/actions/Task");
var Tour_1 = require("@libs/actions/Tour");
var Localize_1 = require("@libs/Localize");
var Navigation_1 = require("@libs/Navigation/Navigation");
var Parser_1 = require("@libs/Parser");
var OnyxDerived_1 = require("@userActions/OnyxDerived");
var CONST_1 = require("@src/CONST");
var SequentialQueue = require("@src/libs/Network/SequentialQueue");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var LHNTestUtils = require("../utils/LHNTestUtils");
var TestHelper = require("../utils/TestHelper");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@libs/Navigation/Navigation', function () { return ({
    navigate: jest.fn(),
}); });
(0, OnyxUpdateManager_1.default)();
describe('actions/Tour', function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_native_onyx_1.default.init({
                        keys: ONYXKEYS_1.default,
                    });
                    (0, OnyxDerived_1.default)();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    SequentialQueue.resetQueue();
                    return [4 /*yield*/, react_native_onyx_1.default.clear()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('startTestDrive', function () {
        describe('migrated users', function () {
            it('should show the Test Drive demo if user has been nudged to migrate', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (0, Tour_1.startTestDrive)(undefined, false, true, false);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 1:
                            _a.sent();
                            expect(Navigation_1.default.navigate).toBeCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should show the Test Drive demo if user doesn't have the nudge flag but is member of a paid policy", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (0, Tour_1.startTestDrive)(undefined, false, false, true);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 1:
                            _a.sent();
                            expect(Navigation_1.default.navigate).toBeCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('NewDot users', function () {
            var onboardingChoices = Object.values(CONST_1.default.ONBOARDING_CHOICES);
            var onboardingDemoChoices = [CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM, CONST_1.default.ONBOARDING_CHOICES.TEST_DRIVE_RECEIVER, CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE];
            var setTestDriveTaskData = function () { return __awaiter(void 0, void 0, void 0, function () {
                var accountID, conciergeChatReport, testDriveTaskReport, testDriveTaskAction, reportCollectionDataSet, reportActionsCollectionDataSet;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            accountID = 2;
                            conciergeChatReport = LHNTestUtils.getFakeReport([accountID, CONST_1.default.ACCOUNT_ID.CONCIERGE]);
                            testDriveTaskReport = __assign(__assign({}, LHNTestUtils.getFakeReport()), { ownerAccountID: accountID });
                            testDriveTaskAction = __assign(__assign({}, LHNTestUtils.getFakeReportAction()), { childType: CONST_1.default.REPORT.TYPE.TASK, childReportName: Parser_1.default.replace((0, Localize_1.translateLocal)('onboarding.testDrive.name', { testDriveURL: "".concat(CONST_1.default.STAGING_NEW_EXPENSIFY_URL, "/").concat(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT) })), childReportID: testDriveTaskReport.reportID });
                            reportCollectionDataSet = (_a = {},
                                _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(testDriveTaskReport.reportID)] = testDriveTaskReport,
                                _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(conciergeChatReport.reportID)] = conciergeChatReport,
                                _a);
                            reportActionsCollectionDataSet = (_b = {},
                                _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(conciergeChatReport.reportID)] = (_c = {},
                                    _c[testDriveTaskAction.reportActionID] = testDriveTaskAction,
                                    _c),
                                _b);
                            return [4 /*yield*/, react_native_onyx_1.default.multiSet(__assign(__assign(__assign({}, reportCollectionDataSet), reportActionsCollectionDataSet), (_d = {}, _d[ONYXKEYS_1.default.NVP_INTRO_SELECTED] = {
                                    viewTour: testDriveTaskReport.reportID,
                                }, _d[ONYXKEYS_1.default.SESSION] = {
                                    accountID: accountID,
                                }, _d)))];
                        case 1:
                            _e.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            it.each(onboardingChoices.filter(function (choice) { return onboardingDemoChoices.includes(choice); }))('should show the Test Drive demo if user has "%s" onboarding choice', function (choice) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setTestDriveTaskData()];
                        case 1:
                            _a.sent();
                            (0, Tour_1.startTestDrive)({ choice: choice }, false, false, false);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 2:
                            _a.sent();
                            expect(Navigation_1.default.navigate).toHaveBeenCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
                            // An empty object means the task was completed.
                            expect(Object.values((0, Task_1.getFinishOnboardingTaskOnyxData)(CONST_1.default.ONBOARDING_TASK_TYPE.VIEW_TOUR)).length).toBe(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it.each(onboardingChoices.filter(function (choice) { return !onboardingDemoChoices.includes(choice); }))('should show the Test Drive modal if user has "%s" onboarding choice', function (choice) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (0, Tour_1.startTestDrive)({ choice: choice }, false, false, false);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 1:
                            _a.sent();
                            expect(Navigation_1.default.navigate).toHaveBeenCalledWith(ROUTES_1.default.TEST_DRIVE_MODAL_ROOT.route);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should show the Test Drive demo if user is an invited employee', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setTestDriveTaskData()];
                        case 1:
                            _a.sent();
                            (0, Tour_1.startTestDrive)({ choice: CONST_1.default.ONBOARDING_CHOICES.SUBMIT, inviteType: CONST_1.default.ONBOARDING_INVITE_TYPES.WORKSPACE }, false, false, false);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 2:
                            _a.sent();
                            expect(Navigation_1.default.navigate).toBeCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
                            // An empty object means the task was completed.
                            expect(Object.values((0, Task_1.getFinishOnboardingTaskOnyxData)(CONST_1.default.ONBOARDING_TASK_TYPE.VIEW_TOUR)).length).toBe(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should show the Test Drive demo if user is member of a paid policy', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (0, Tour_1.startTestDrive)({ choice: CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND }, false, false, true);
                            return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                        case 1:
                            _a.sent();
                            expect(Navigation_1.default.navigate).toBeCalledWith(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
