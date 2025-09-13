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
/* eslint-disable @typescript-eslint/naming-convention */
var globals_1 = require("@jest/globals");
var date_fns_1 = require("date-fns");
var date_fns_tz_1 = require("date-fns-tz");
var react_native_onyx_1 = require("react-native-onyx");
var OnboardingFlow_1 = require("@libs/actions/Welcome/OnboardingFlow");
var types_1 = require("@libs/API/types");
var HttpUtils_1 = require("@libs/HttpUtils");
var NextStepUtils_1 = require("@libs/NextStepUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var CONST_1 = require("@src/CONST");
var OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
var PersistedRequests = require("@src/libs/actions/PersistedRequests");
var Report = require("@src/libs/actions/Report");
var User = require("@src/libs/actions/User");
var DateUtils_1 = require("@src/libs/DateUtils");
var Log_1 = require("@src/libs/Log");
var SequentialQueue = require("@src/libs/Network/SequentialQueue");
var ReportUtils = require("@src/libs/ReportUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var createCollection_1 = require("../utils/collections/createCollection");
var policies_1 = require("../utils/collections/policies");
var reportActions_1 = require("../utils/collections/reportActions");
var reports_1 = require("../utils/collections/reports");
var transaction_1 = require("../utils/collections/transaction");
var getIsUsingFakeTimers_1 = require("../utils/getIsUsingFakeTimers");
var PusherHelper_1 = require("../utils/PusherHelper");
var TestHelper = require("../utils/TestHelper");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var waitForNetworkPromises_1 = require("../utils/waitForNetworkPromises");
jest.mock('@libs/NextStepUtils', function () { return ({
    buildNextStep: jest.fn(),
}); });
jest.mock('@libs/ReportUtils', function () {
    var originalModule = jest.requireActual('@libs/ReportUtils');
    return __assign(__assign({}, originalModule), { getPolicyExpenseChat: jest.fn().mockReturnValue({ reportID: '1234', hasOutstandingChildRequest: false }) });
});
var currentHash = 12345;
jest.mock('@src/libs/SearchQueryUtils', function () { return ({
    getCurrentSearchQueryJSON: jest.fn().mockImplementation(function () { return ({
        hash: currentHash,
        query: 'test',
        type: 'expense',
        status: '',
        flatFilters: [],
    }); }),
}); });
var UTC = 'UTC';
jest.mock('@src/libs/actions/Report', function () {
    var originalModule = jest.requireActual('@src/libs/actions/Report');
    return __assign(__assign({}, originalModule), { showReportActionNotification: jest.fn() });
});
jest.mock('@hooks/useScreenWrapperTransitionStatus', function () { return ({
    default: function () { return ({
        didScreenTransitionEnd: true,
    }); },
}); });
var originalXHR = HttpUtils_1.default.xhr;
(0, OnyxUpdateManager_1.default)();
(0, globals_1.describe)('actions/Report', function () {
    (0, globals_1.beforeAll)(function () {
        PusherHelper_1.default.setup();
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    (0, globals_1.beforeEach)(function () {
        HttpUtils_1.default.xhr = originalXHR;
        var promise = react_native_onyx_1.default.clear().then(function () {
            jest.useRealTimers();
            (0, waitForBatchedUpdates_1.default)();
        });
        if ((0, getIsUsingFakeTimers_1.default)()) {
            // flushing pending timers
            // Onyx.clear() promise is resolved in batch which happens after the current microtasks cycle
            setImmediate(jest.runOnlyPendingTimers);
        }
        global.fetch = TestHelper.getGlobalFetchMock();
        // Clear the queue before each test to avoid test pollution
        SequentialQueue.resetQueue();
        return promise;
    });
    (0, globals_1.afterEach)(function () {
        jest.clearAllMocks();
        PusherHelper_1.default.teardown();
    });
    (0, globals_1.it)('should store a new report action in Onyx when onyxApiUpdate event is handled via Pusher', function () {
        global.fetch = TestHelper.getGlobalFetchMock();
        var TEST_USER_ACCOUNT_ID = 1;
        var TEST_USER_LOGIN = 'test@test.com';
        var REPORT_ID = '1';
        var reportActionID;
        var REPORT_ACTION = {
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            actorAccountID: TEST_USER_ACCOUNT_ID,
            automatic: false,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            message: [{ type: 'COMMENT', html: 'Testing a comment', text: 'Testing a comment', translationKey: '' }],
            person: [{ type: 'TEXT', style: 'strong', text: 'Test User' }],
            shouldShow: true,
        };
        var reportActions;
        react_native_onyx_1.default.connect({
            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
            callback: function (val) { return (reportActions = val); },
        });
        // Set up Onyx with some test user data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(function () {
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () { return TestHelper.setPersonalDetails(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID); })
            .then(function () {
            // This is a fire and forget response, but once it completes we should be able to verify that we
            // have an "optimistic" report action in Onyx.
            Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            var _a, _b;
            var resultAction = Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).at(0);
            reportActionID = resultAction === null || resultAction === void 0 ? void 0 : resultAction.reportActionID;
            (0, globals_1.expect)(reportActionID).not.toBeUndefined();
            (0, globals_1.expect)(resultAction === null || resultAction === void 0 ? void 0 : resultAction.message).toEqual(REPORT_ACTION.message);
            (0, globals_1.expect)(resultAction === null || resultAction === void 0 ? void 0 : resultAction.person).toEqual(REPORT_ACTION.person);
            (0, globals_1.expect)(resultAction === null || resultAction === void 0 ? void 0 : resultAction.pendingAction).toBeUndefined();
            if (!reportActionID) {
                return;
            }
            // We subscribed to the Pusher channel above and now we need to simulate a reportComment action
            // Pusher event so we can verify that action was handled correctly and merged into the reportActions.
            PusherHelper_1.default.emitOnyxUpdate([
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(REPORT_ID),
                    value: {
                        reportID: REPORT_ID,
                        participants: (_a = {},
                            _a[TEST_USER_ACCOUNT_ID] = {
                                notificationPreference: 'always',
                            },
                            _a),
                        lastVisibleActionCreated: '2022-11-22 03:48:27.267',
                        lastMessageText: 'Testing a comment',
                        lastActorAccountID: TEST_USER_ACCOUNT_ID,
                    },
                },
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                    value: (_b = {},
                        _b[reportActionID] = { pendingAction: null },
                        _b),
                },
            ]);
            // Once a reportComment event is emitted to the Pusher channel we should see the comment get processed
            // by the Pusher callback and added to the storage so we must wait for promises to resolve again and
            // then verify the data is in Onyx.
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            // Verify there is only one action and our optimistic comment has been removed
            (0, globals_1.expect)(Object.keys(reportActions !== null && reportActions !== void 0 ? reportActions : {}).length).toBe(1);
            var resultAction = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : undefined;
            // Verify that our action is no longer in the loading state
            (0, globals_1.expect)(resultAction === null || resultAction === void 0 ? void 0 : resultAction.pendingAction).toBeUndefined();
        });
    });
    (0, globals_1.it)('clearCreateChatError should not delete the report if it is not optimistic report', function () {
        var REPORT = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { errorFields: { createChat: { error: 'error' } } });
        var REPORT_METADATA = { isOptimisticReport: false };
        react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(REPORT.reportID), REPORT);
        react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_METADATA).concat(REPORT.reportID), REPORT_METADATA);
        return (0, waitForBatchedUpdates_1.default)()
            .then(function () {
            Report.clearCreateChatError(REPORT);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            return new Promise(function (resolve) {
                var connection = react_native_onyx_1.default.connect({
                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(REPORT.reportID),
                    callback: function (report) {
                        var _a;
                        react_native_onyx_1.default.disconnect(connection);
                        resolve();
                        // The report should exist but the create chat error field should be cleared.
                        (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.reportID).toBeDefined();
                        (0, globals_1.expect)((_a = report === null || report === void 0 ? void 0 : report.errorFields) === null || _a === void 0 ? void 0 : _a.createChat).toBeUndefined();
                    },
                });
            });
        });
    });
    (0, globals_1.it)('should update pins in Onyx when togglePinned is called', function () {
        var TEST_USER_ACCOUNT_ID = 1;
        var TEST_USER_LOGIN = 'test@test.com';
        var REPORT_ID = '1';
        var reportIsPinned;
        react_native_onyx_1.default.connect({
            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(REPORT_ID),
            callback: function (val) { var _a; return (reportIsPinned = (_a = val === null || val === void 0 ? void 0 : val.isPinned) !== null && _a !== void 0 ? _a : false); },
        });
        // Set up Onyx with some test user data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(function () {
            Report.togglePinnedState(REPORT_ID, false);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            // Test that Onyx immediately updated the report pin state.
            (0, globals_1.expect)(reportIsPinned).toEqual(true);
        });
    });
    (0, globals_1.it)('Should not leave duplicate comments when logger sends packet because of calling process queue while processing the queue', function () {
        var TEST_USER_ACCOUNT_ID = 1;
        var TEST_USER_LOGIN = 'test@test.com';
        var REPORT_ID = '1';
        var LOGGER_MAX_LOG_LINES = 50;
        // GIVEN a test user with initial data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(function () { return TestHelper.setPersonalDetails(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID); })
            .then(function () {
            global.fetch = TestHelper.getGlobalFetchMock();
            // WHEN we add enough logs to send a packet
            for (var i = 0; i <= LOGGER_MAX_LOG_LINES; i++) {
                Log_1.default.info('Test log info');
            }
            // And leave a comment on a report
            Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            // Then we should expect that there is on persisted request
            (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
            // When we wait for the queue to run
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            // THEN only ONE call to AddComment will happen
            var URL_ARGUMENT_INDEX = 0;
            var addCommentCalls = global.fetch.mock.calls.filter(function (callArguments) { var _a; return (_a = callArguments.at(URL_ARGUMENT_INDEX)) === null || _a === void 0 ? void 0 : _a.includes('AddComment'); });
            (0, globals_1.expect)(addCommentCalls.length).toBe(1);
        });
    });
    (0, globals_1.it)('should be updated correctly when new comments are added, deleted or marked as unread', function () {
        global.fetch = TestHelper.getGlobalFetchMock();
        var REPORT_ID = '1';
        var report;
        var reportActionCreatedDate;
        var currentTime;
        react_native_onyx_1.default.connect({
            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(REPORT_ID),
            callback: function (val) { return (report = val); },
        });
        var reportActions;
        react_native_onyx_1.default.connect({
            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
            callback: function (val) { return (reportActions = val !== null && val !== void 0 ? val : {}); },
        });
        var USER_1_LOGIN = 'user@test.com';
        var USER_1_ACCOUNT_ID = 1;
        var USER_2_ACCOUNT_ID = 2;
        var setPromise = react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(REPORT_ID), { reportName: 'Test', reportID: REPORT_ID })
            .then(function () { return TestHelper.signInWithTestUser(USER_1_ACCOUNT_ID, USER_1_LOGIN); })
            .then(waitForNetworkPromises_1.default)
            .then(function () {
            // Given a test user that is subscribed to Pusher events
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () { return TestHelper.setPersonalDetails(USER_1_LOGIN, USER_1_ACCOUNT_ID); })
            .then(function () {
            var _a;
            // When a Pusher event is handled for a new report comment that includes a mention of the current user
            reportActionCreatedDate = DateUtils_1.default.getDBTime();
            PusherHelper_1.default.emitOnyxUpdate([
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(REPORT_ID),
                    value: {
                        reportID: REPORT_ID,
                        participants: (_a = {},
                            _a[USER_1_ACCOUNT_ID] = {
                                notificationPreference: 'always',
                            },
                            _a),
                        lastMessageText: 'Comment 1',
                        lastActorAccountID: USER_2_ACCOUNT_ID,
                        lastVisibleActionCreated: reportActionCreatedDate,
                        lastMentionedTime: reportActionCreatedDate,
                        lastReadTime: DateUtils_1.default.subtractMillisecondsFromDateTime(reportActionCreatedDate, 1),
                    },
                },
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                    value: {
                        1: {
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                            actorAccountID: USER_2_ACCOUNT_ID,
                            automatic: false,
                            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                            message: [{ type: 'COMMENT', html: 'Comment 1', text: 'Comment 1' }],
                            person: [{ type: 'TEXT', style: 'strong', text: 'Test User' }],
                            shouldShow: true,
                            created: reportActionCreatedDate,
                            reportActionID: '1',
                        },
                    },
                },
            ]);
            return (0, waitForNetworkPromises_1.default)();
        })
            .then(function () {
            // Then the report will be unread
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(true);
            // And show a green dot for unread mentions in the LHN
            (0, globals_1.expect)(ReportUtils.isUnreadWithMention(report)).toBe(true);
            // When the user visits the report
            currentTime = DateUtils_1.default.getDBTime();
            Report.openReport(REPORT_ID);
            Report.readNewestAction(REPORT_ID);
            (0, waitForBatchedUpdates_1.default)();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            var _a;
            // The report will be read
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)((0, date_fns_tz_1.toZonedTime)((_a = report === null || report === void 0 ? void 0 : report.lastReadTime) !== null && _a !== void 0 ? _a : '', UTC).getTime()).toBeGreaterThanOrEqual((0, date_fns_tz_1.toZonedTime)(currentTime, UTC).getTime());
            // And no longer show the green dot for unread mentions in the LHN
            (0, globals_1.expect)(ReportUtils.isUnreadWithMention(report)).toBe(false);
            // When the user manually marks a message as "unread"
            Report.markCommentAsUnread(REPORT_ID, reportActions['1']);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            // Then the report will be unread and show the green dot for unread mentions in LHN
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(true);
            (0, globals_1.expect)(ReportUtils.isUnreadWithMention(report)).toBe(true);
            (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.lastReadTime).toBe(DateUtils_1.default.subtractMillisecondsFromDateTime(reportActionCreatedDate, 1));
            // When a new comment is added by the current user
            currentTime = DateUtils_1.default.getDBTime();
            Report.addComment(REPORT_ID, 'Current User Comment 1', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            var _a;
            // The report will be read, the green dot for unread mentions will go away, and the lastReadTime updated
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)(ReportUtils.isUnreadWithMention(report)).toBe(false);
            (0, globals_1.expect)((0, date_fns_tz_1.toZonedTime)((_a = report === null || report === void 0 ? void 0 : report.lastReadTime) !== null && _a !== void 0 ? _a : '', UTC).getTime()).toBeGreaterThanOrEqual((0, date_fns_tz_1.toZonedTime)(currentTime, UTC).getTime());
            (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.lastMessageText).toBe('Current User Comment 1');
            // When another comment is added by the current user
            currentTime = DateUtils_1.default.getDBTime();
            Report.addComment(REPORT_ID, 'Current User Comment 2', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            var _a;
            // The report will be read and the lastReadTime updated
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)((0, date_fns_tz_1.toZonedTime)((_a = report === null || report === void 0 ? void 0 : report.lastReadTime) !== null && _a !== void 0 ? _a : '', UTC).getTime()).toBeGreaterThanOrEqual((0, date_fns_tz_1.toZonedTime)(currentTime, UTC).getTime());
            (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.lastMessageText).toBe('Current User Comment 2');
            // When another comment is added by the current user
            currentTime = DateUtils_1.default.getDBTime();
            Report.addComment(REPORT_ID, 'Current User Comment 3', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            var _a;
            var _b;
            // The report will be read and the lastReadTime updated
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)((0, date_fns_tz_1.toZonedTime)((_b = report === null || report === void 0 ? void 0 : report.lastReadTime) !== null && _b !== void 0 ? _b : '', UTC).getTime()).toBeGreaterThanOrEqual((0, date_fns_tz_1.toZonedTime)(currentTime, UTC).getTime());
            (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.lastMessageText).toBe('Current User Comment 3');
            var USER_1_BASE_ACTION = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                actorAccountID: USER_1_ACCOUNT_ID,
                automatic: false,
                avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                person: [{ type: 'TEXT', style: 'strong', text: 'Test User' }],
                shouldShow: true,
                created: DateUtils_1.default.getDBTime(Date.now() - 3),
            };
            var optimisticReportActions = {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                value: {
                    200: __assign(__assign({}, USER_1_BASE_ACTION), { message: [{ type: 'COMMENT', html: 'Current User Comment 1', text: 'Current User Comment 1' }], created: DateUtils_1.default.getDBTime(Date.now() - 2), reportActionID: '200' }),
                    300: __assign(__assign({}, USER_1_BASE_ACTION), { message: [{ type: 'COMMENT', html: 'Current User Comment 2', text: 'Current User Comment 2' }], created: DateUtils_1.default.getDBTime(Date.now() - 1), reportActionID: '300' }),
                    400: __assign(__assign({}, USER_1_BASE_ACTION), { message: [{ type: 'COMMENT', html: 'Current User Comment 3', text: 'Current User Comment 3' }], created: DateUtils_1.default.getDBTime(), reportActionID: '400' }),
                },
            };
            reportActionCreatedDate = DateUtils_1.default.getDBTime();
            var optimisticReportActionsValue = optimisticReportActions.value;
            if (optimisticReportActionsValue === null || optimisticReportActionsValue === void 0 ? void 0 : optimisticReportActionsValue[400]) {
                optimisticReportActionsValue[400].created = reportActionCreatedDate;
            }
            // When we emit the events for these pending created actions to update them to not pending
            PusherHelper_1.default.emitOnyxUpdate([
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(REPORT_ID),
                    value: {
                        reportID: REPORT_ID,
                        participants: (_a = {},
                            _a[USER_1_ACCOUNT_ID] = {
                                notificationPreference: 'always',
                            },
                            _a),
                        lastMessageText: 'Current User Comment 3',
                        lastActorAccountID: 1,
                        lastVisibleActionCreated: reportActionCreatedDate,
                        lastReadTime: reportActionCreatedDate,
                    },
                },
                optimisticReportActions,
            ]);
            return (0, waitForNetworkPromises_1.default)();
        })
            .then(function () {
            // If the user deletes a comment that is before the last read
            Report.deleteReportComment(REPORT_ID, __assign({}, reportActions[200]));
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            // Then no change will occur
            (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.lastReadTime).toBe(reportActionCreatedDate);
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            // When the user manually marks a message as "unread"
            Report.markCommentAsUnread(REPORT_ID, reportActions[400]);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            // Then we should expect the report to be to be unread
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(true);
            (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.lastReadTime).toBe(DateUtils_1.default.subtractMillisecondsFromDateTime(reportActions[400].created, 1));
            // If the user deletes the last comment after the lastReadTime the lastMessageText will reflect the new last comment
            Report.deleteReportComment(REPORT_ID, __assign({}, reportActions[400]));
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.lastMessageText).toBe('Current User Comment 2');
        });
        (0, waitForBatchedUpdates_1.default)(); // flushing onyx.set as it will be batched
        return setPromise;
    });
    (0, globals_1.it)('Should properly update comment with links', function () {
        /* This tests a variety of scenarios when a user edits a comment.
         * We should generate a link when editing a message unless the link was
         * already in the comment and the user deleted it on purpose.
         */
        global.fetch = TestHelper.getGlobalFetchMock();
        // User edits comment to add link
        // We should generate link
        var originalCommentMarkdown = 'Original Comment';
        var afterEditCommentText = 'Original Comment www.google.com';
        var newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        var expectedOutput = 'Original Comment <a href="https://www.google.com" target="_blank" rel="noreferrer noopener">www.google.com</a>';
        (0, globals_1.expect)(newCommentHTML).toBe(expectedOutput);
        // User deletes www.google.com link from comment but keeps link text
        // We should not generate link
        originalCommentMarkdown = 'Comment [www.google.com](https://www.google.com)';
        afterEditCommentText = 'Comment www.google.com';
        newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        expectedOutput = 'Comment www.google.com';
        (0, globals_1.expect)(newCommentHTML).toBe(expectedOutput);
        // User Delete only () part of link but leaves the []
        // We should not generate link
        originalCommentMarkdown = 'Comment [www.google.com](https://www.google.com)';
        afterEditCommentText = 'Comment [www.google.com]';
        newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        expectedOutput = 'Comment [www.google.com]';
        (0, globals_1.expect)(newCommentHTML).toBe(expectedOutput);
        // User Generates multiple links in one edit
        // We should generate both links
        originalCommentMarkdown = 'Comment';
        afterEditCommentText = 'Comment www.google.com www.facebook.com';
        newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        expectedOutput =
            'Comment <a href="https://www.google.com" target="_blank" rel="noreferrer noopener">www.google.com</a> ' +
                '<a href="https://www.facebook.com" target="_blank" rel="noreferrer noopener">www.facebook.com</a>';
        (0, globals_1.expect)(newCommentHTML).toBe(expectedOutput);
        // Comment has two links but user deletes only one of them
        // Should not generate link again for the deleted one
        originalCommentMarkdown = 'Comment [www.google.com](https://www.google.com)  [www.facebook.com](https://www.facebook.com)';
        afterEditCommentText = 'Comment www.google.com  [www.facebook.com](https://www.facebook.com)';
        newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        expectedOutput = 'Comment www.google.com  <a href="https://www.facebook.com" target="_blank" rel="noreferrer noopener">www.facebook.com</a>';
        (0, globals_1.expect)(newCommentHTML).toBe(expectedOutput);
        // User edits and replaces comment with a link containing underscores
        // We should generate link
        originalCommentMarkdown = 'Comment';
        afterEditCommentText = 'https://www.facebook.com/hashtag/__main/?__eep__=6';
        newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        expectedOutput = '<a href="https://www.facebook.com/hashtag/__main/?__eep__=6" target="_blank" rel="noreferrer noopener">https://www.facebook.com/hashtag/__main/?__eep__=6</a>';
        (0, globals_1.expect)(newCommentHTML).toBe(expectedOutput);
        // User edits and deletes the link containing underscores
        // We should not generate link
        originalCommentMarkdown = '[https://www.facebook.com/hashtag/__main/?__eep__=6](https://www.facebook.com/hashtag/__main/?__eep__=6)';
        afterEditCommentText = 'https://www.facebook.com/hashtag/__main/?__eep__=6';
        newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        expectedOutput = 'https://www.facebook.com/hashtag/__main/?__eep__=6';
        (0, globals_1.expect)(newCommentHTML).toBe(expectedOutput);
        // User edits and replaces comment with a link containing asterisks
        // We should generate link
        originalCommentMarkdown = 'Comment';
        afterEditCommentText = 'http://example.com/foo/*/bar/*/test.txt';
        newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        expectedOutput = '<a href="http://example.com/foo/*/bar/*/test.txt" target="_blank" rel="noreferrer noopener">http://example.com/foo/*/bar/*/test.txt</a>';
        (0, globals_1.expect)(newCommentHTML).toBe(expectedOutput);
        // User edits and deletes the link containing asterisks
        // We should not generate link
        originalCommentMarkdown = '[http://example.com/foo/*/bar/*/test.txt](http://example.com/foo/*/bar/*/test.txt)';
        afterEditCommentText = 'http://example.com/foo/*/bar/*/test.txt';
        newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        expectedOutput = 'http://example.com/foo/*/bar/*/test.txt';
        (0, globals_1.expect)(newCommentHTML).toBe(expectedOutput);
    });
    (0, globals_1.it)('should show a notification for report action updates with shouldNotify', function () {
        var TEST_USER_ACCOUNT_ID = 1;
        var REPORT_ID = '1';
        var REPORT_ACTION = {
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
        };
        // Setup user and pusher listeners
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID)
            .then(waitForBatchedUpdates_1.default)
            .then(function () {
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            // Simulate a Pusher Onyx update with a report action with shouldNotify
            PusherHelper_1.default.emitOnyxUpdate([
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                    value: {
                        1: REPORT_ACTION,
                    },
                    shouldNotify: true,
                },
            ]);
            return SequentialQueue.getCurrentRequest().then(waitForBatchedUpdates_1.default);
        })
            .then(function () {
            // Ensure we show a notification for this new report action
            (0, globals_1.expect)(Report.showReportActionNotification).toBeCalledWith(REPORT_ID, REPORT_ACTION);
        });
    });
    (0, globals_1.it)('should properly toggle reactions on a message', function () {
        global.fetch = TestHelper.getGlobalFetchMock();
        var TEST_USER_ACCOUNT_ID = 1;
        var TEST_USER_LOGIN = 'test@test.com';
        var REPORT_ID = '1';
        var EMOJI_CODE = '👍';
        var EMOJI_SKIN_TONE = 2;
        var EMOJI_NAME = '+1';
        var EMOJI = {
            code: EMOJI_CODE,
            name: EMOJI_NAME,
            types: ['👍🏿', '👍🏾', '👍🏽', '👍🏼', '👍🏻'],
        };
        var reportActions;
        react_native_onyx_1.default.connect({
            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
            callback: function (val) { return (reportActions = val !== null && val !== void 0 ? val : {}); },
        });
        var reportActionsReactions = {};
        react_native_onyx_1.default.connect({
            key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS,
            callback: function (val, key) {
                reportActionsReactions[key] = val !== null && val !== void 0 ? val : {};
            },
        });
        var reportAction;
        var reportActionID;
        // Set up Onyx with some test user data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(function () {
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () { return TestHelper.setPersonalDetails(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID); })
            .then(function () {
            // This is a fire and forget response, but once it completes we should be able to verify that we
            // have an "optimistic" report action in Onyx.
            Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            reportAction = Object.values(reportActions).at(0);
            reportActionID = reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportActionID;
            if (reportAction) {
                // Add a reaction to the comment
                Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionsReactions[0]);
            }
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            reportAction = Object.values(reportActions).at(0);
            // Expect the reaction to exist in the reportActionsReactions collection
            (0, globals_1.expect)(reportActionsReactions).toHaveProperty("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportActionID));
            // Expect the reaction to have the emoji on it
            var reportActionReaction = reportActionsReactions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportActionID)];
            (0, globals_1.expect)(reportActionReaction).toHaveProperty(EMOJI.name);
            // Expect the emoji to have the user accountID
            var reportActionReactionEmoji = reportActionReaction === null || reportActionReaction === void 0 ? void 0 : reportActionReaction[EMOJI.name];
            (0, globals_1.expect)(reportActionReactionEmoji === null || reportActionReactionEmoji === void 0 ? void 0 : reportActionReactionEmoji.users).toHaveProperty("".concat(TEST_USER_ACCOUNT_ID));
            if (reportAction) {
                // Now we remove the reaction
                Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionReaction);
            }
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            // Expect the reaction to have null where the users reaction used to be
            (0, globals_1.expect)(reportActionsReactions).toHaveProperty("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportActionID));
            var reportActionReaction = reportActionsReactions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportActionID)];
            (0, globals_1.expect)(reportActionReaction === null || reportActionReaction === void 0 ? void 0 : reportActionReaction[EMOJI.name].users[TEST_USER_ACCOUNT_ID]).toBeUndefined();
        })
            .then(function () {
            reportAction = Object.values(reportActions).at(0);
            if (reportAction) {
                // Add the same reaction to the same report action with a different skin tone
                Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionsReactions[0]);
            }
            return (0, waitForBatchedUpdates_1.default)()
                .then(function () {
                reportAction = Object.values(reportActions).at(0);
                var reportActionReaction = reportActionsReactions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportActionID)];
                if (reportAction) {
                    Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionReaction, EMOJI_SKIN_TONE);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                reportAction = Object.values(reportActions).at(0);
                // Expect the reaction to exist in the reportActionsReactions collection
                (0, globals_1.expect)(reportActionsReactions).toHaveProperty("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportActionID));
                // Expect the reaction to have the emoji on it
                var reportActionReaction = reportActionsReactions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportActionID)];
                (0, globals_1.expect)(reportActionReaction).toHaveProperty(EMOJI.name);
                // Expect the emoji to have the user accountID
                var reportActionReactionEmoji = reportActionReaction === null || reportActionReaction === void 0 ? void 0 : reportActionReaction[EMOJI.name];
                (0, globals_1.expect)(reportActionReactionEmoji === null || reportActionReactionEmoji === void 0 ? void 0 : reportActionReactionEmoji.users).toHaveProperty("".concat(TEST_USER_ACCOUNT_ID));
                // Expect two different skin tone reactions
                var reportActionReactionEmojiUserSkinTones = reportActionReactionEmoji === null || reportActionReactionEmoji === void 0 ? void 0 : reportActionReactionEmoji.users[TEST_USER_ACCOUNT_ID].skinTones;
                (0, globals_1.expect)(reportActionReactionEmojiUserSkinTones).toHaveProperty('-1');
                (0, globals_1.expect)(reportActionReactionEmojiUserSkinTones).toHaveProperty('2');
                if (reportAction) {
                    // Now we remove the reaction, and expect that both variations are removed
                    Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionReaction);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(function () {
                // Expect the reaction to have null where the users reaction used to be
                (0, globals_1.expect)(reportActionsReactions).toHaveProperty("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportActionID));
                var reportActionReaction = reportActionsReactions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportActionID)];
                (0, globals_1.expect)(reportActionReaction === null || reportActionReaction === void 0 ? void 0 : reportActionReaction[EMOJI.name].users[TEST_USER_ACCOUNT_ID]).toBeUndefined();
            });
        });
    });
    (0, globals_1.it)("shouldn't add the same reaction twice when changing preferred skin color and reaction doesn't support skin colors", function () {
        global.fetch = TestHelper.getGlobalFetchMock();
        var TEST_USER_ACCOUNT_ID = 1;
        var TEST_USER_LOGIN = 'test@test.com';
        var REPORT_ID = '1';
        var EMOJI_CODE = '😄';
        var EMOJI_NAME = 'smile';
        var EMOJI = {
            code: EMOJI_CODE,
            name: EMOJI_NAME,
        };
        var reportActions = {};
        react_native_onyx_1.default.connect({
            key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
            callback: function (val) { return (reportActions = val !== null && val !== void 0 ? val : {}); },
        });
        var reportActionsReactions = {};
        react_native_onyx_1.default.connect({
            key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS,
            callback: function (val, key) {
                reportActionsReactions[key] = val !== null && val !== void 0 ? val : {};
            },
        });
        var resultAction;
        // Set up Onyx with some test user data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(function () {
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () { return TestHelper.setPersonalDetails(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID); })
            .then(function () {
            // This is a fire and forget response, but once it completes we should be able to verify that we
            // have an "optimistic" report action in Onyx.
            Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            resultAction = Object.values(reportActions).at(0);
            if (resultAction) {
                // Add a reaction to the comment
                Report.toggleEmojiReaction(REPORT_ID, resultAction, EMOJI, {});
            }
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            resultAction = Object.values(reportActions).at(0);
            // Now we toggle the reaction while the skin tone has changed.
            // As the emoji doesn't support skin tones, the emoji
            // should get removed instead of added again.
            var reportActionReaction = reportActionsReactions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(resultAction === null || resultAction === void 0 ? void 0 : resultAction.reportActionID)];
            if (resultAction) {
                Report.toggleEmojiReaction(REPORT_ID, resultAction, EMOJI, reportActionReaction, 2);
            }
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(function () {
            // Expect the reaction to have null where the users reaction used to be
            (0, globals_1.expect)(reportActionsReactions).toHaveProperty("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(resultAction === null || resultAction === void 0 ? void 0 : resultAction.reportActionID));
            var reportActionReaction = reportActionsReactions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(resultAction === null || resultAction === void 0 ? void 0 : resultAction.reportActionID)];
            (0, globals_1.expect)(reportActionReaction === null || reportActionReaction === void 0 ? void 0 : reportActionReaction[EMOJI.name].users[TEST_USER_ACCOUNT_ID]).toBeUndefined();
        });
    });
    (0, globals_1.it)('should send only one OpenReport, replacing any extra ones with same reportIDs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var REPORT_ID, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    REPORT_ID = '1';
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 2:
                    _a.sent();
                    for (i = 0; i < 5; i++) {
                        Report.openReport(REPORT_ID, undefined, ['test@user.com'], {
                            reportID: REPORT_ID,
                        });
                    }
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 4:
                    _a.sent();
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.OPEN_REPORT, 1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should replace duplicate OpenReport commands with the same reportID', function () { return __awaiter(void 0, void 0, void 0, function () {
        var REPORT_ID, i, reportID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    REPORT_ID = '1';
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 2:
                    _a.sent();
                    for (i = 0; i < 8; i++) {
                        reportID = REPORT_ID;
                        if (i > 4) {
                            reportID = "".concat(i);
                        }
                        Report.openReport(reportID, undefined, ['test@user.com'], {
                            reportID: REPORT_ID,
                        });
                    }
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(4);
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 4:
                    _a.sent();
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.OPEN_REPORT, 4);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should remove AddComment and UpdateComment without sending any request when DeleteComment is set', function () { return __awaiter(void 0, void 0, void 0, function () {
        var TEST_USER_ACCOUNT_ID, REPORT_ID, TEN_MINUTES_AGO, created, newComment, reportActionID, newReportAction, connection;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    TEST_USER_ACCOUNT_ID = 1;
                    REPORT_ID = '1';
                    TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
                    created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
                    Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
                    newComment = PersistedRequests.getAll().at(0);
                    reportActionID = (_a = newComment === null || newComment === void 0 ? void 0 : newComment.data) === null || _a === void 0 ? void 0 : _a.reportActionID;
                    newReportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
                    Report.editReportComment(REPORT_ID, newReportAction, 'Testing an edited comment');
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                                callback: function (persistedRequests) {
                                    var _a, _b;
                                    react_native_onyx_1.default.disconnect(connection);
                                    (0, globals_1.expect)((_a = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(0)) === null || _a === void 0 ? void 0 : _a.command).toBe(types_1.WRITE_COMMANDS.ADD_COMMENT);
                                    (0, globals_1.expect)((_b = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(1)) === null || _b === void 0 ? void 0 : _b.command).toBeUndefined();
                                    resolve();
                                },
                            });
                        })];
                case 2:
                    _b.sent();
                    // Checking the Report Action exists before deleting it
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                                callback: function (reportActions) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    var reportAction = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : null;
                                    (0, globals_1.expect)(reportAction).not.toBeNull();
                                    (0, globals_1.expect)(reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportActionID).toBe(reportActionID);
                                    resolve();
                                },
                            });
                        })];
                case 3:
                    // Checking the Report Action exists before deleting it
                    _b.sent();
                    Report.deleteReportComment(REPORT_ID, newReportAction);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 4:
                    _b.sent();
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(0);
                    connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                        callback: function (reportActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            var reportAction = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : undefined;
                            (0, globals_1.expect)(reportAction).toBeUndefined();
                        },
                    });
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 5:
                    _b.sent();
                    // Checking no requests were or will be made
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.UPDATE_COMMENT, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should send DeleteComment request and remove UpdateComment accordingly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var TEST_USER_ACCOUNT_ID, REPORT_ID, TEN_MINUTES_AGO, created, newComment, reportActionID, reportAction;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    TEST_USER_ACCOUNT_ID = 1;
                    REPORT_ID = '1';
                    TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
                    created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false })];
                case 1:
                    _b.sent();
                    Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
                    newComment = PersistedRequests.getAll().at(1);
                    reportActionID = (_a = newComment === null || newComment === void 0 ? void 0 : newComment.data) === null || _a === void 0 ? void 0 : _a.reportActionID;
                    reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true })];
                case 2:
                    _b.sent();
                    Report.editReportComment(REPORT_ID, reportAction, 'Testing an edited comment');
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                                callback: function (persistedRequests) {
                                    var _a;
                                    react_native_onyx_1.default.disconnect(connection);
                                    (0, globals_1.expect)((_a = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(0)) === null || _a === void 0 ? void 0 : _a.command).toBe(types_1.WRITE_COMMANDS.UPDATE_COMMENT);
                                    resolve();
                                },
                            });
                        })];
                case 4:
                    _b.sent();
                    Report.deleteReportComment(REPORT_ID, reportAction);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 5:
                    _b.sent();
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 6:
                    _b.sent();
                    // Checking no requests were or will be made
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 1);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.UPDATE_COMMENT, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should send DeleteComment request after AddComment is rollback', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockedXhr, TEST_USER_ACCOUNT_ID, REPORT_ID, TEN_MINUTES_AGO, created, newComment, reportActionID, reportAction, httpCalls, addCommentCalls, deleteCommentCalls;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    global.fetch = jest.fn().mockRejectedValue(new TypeError(CONST_1.default.ERROR.FAILED_TO_FETCH));
                    mockedXhr = jest.fn();
                    mockedXhr.mockImplementation(originalXHR);
                    HttpUtils_1.default.xhr = mockedXhr;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _c.sent();
                    TEST_USER_ACCOUNT_ID = 1;
                    REPORT_ID = '1';
                    TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
                    created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
                    Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
                    return [4 /*yield*/, (0, waitForNetworkPromises_1.default)()];
                case 2:
                    _c.sent();
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
                    (0, globals_1.expect)((_a = PersistedRequests.getAll().at(0)) === null || _a === void 0 ? void 0 : _a.isRollback).toBeTruthy();
                    newComment = PersistedRequests.getAll().at(1);
                    reportActionID = (_b = newComment === null || newComment === void 0 ? void 0 : newComment.data) === null || _b === void 0 ? void 0 : _b.reportActionID;
                    reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 3:
                    _c.sent();
                    HttpUtils_1.default.xhr = mockedXhr
                        .mockImplementationOnce(function () {
                        return Promise.resolve({
                            jsonCode: CONST_1.default.JSON_CODE.EXP_ERROR,
                        });
                    })
                        .mockImplementation(function () {
                        return Promise.resolve({
                            jsonCode: CONST_1.default.JSON_CODE.SUCCESS,
                        });
                    });
                    Report.deleteReportComment(REPORT_ID, reportAction);
                    jest.runOnlyPendingTimers();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 4:
                    _c.sent();
                    httpCalls = HttpUtils_1.default.xhr.mock.calls;
                    addCommentCalls = httpCalls.filter(function (_a) {
                        var command = _a[0];
                        return command === 'AddComment';
                    });
                    deleteCommentCalls = httpCalls.filter(function (_a) {
                        var command = _a[0];
                        return command === 'DeleteComment';
                    });
                    if (httpCalls.length === 3) {
                        (0, globals_1.expect)(addCommentCalls).toHaveLength(2);
                        (0, globals_1.expect)(deleteCommentCalls).toHaveLength(1);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should send not DeleteComment request and remove AddAttachment accordingly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var TEST_USER_ACCOUNT_ID, REPORT_ID, TEN_MINUTES_AGO, created, file, newComment, reportActionID, newReportAction, connection;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    TEST_USER_ACCOUNT_ID = 1;
                    REPORT_ID = '1';
                    TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
                    created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true })];
                case 1:
                    _b.sent();
                    file = new File([''], 'test.txt', { type: 'text/plain' });
                    Report.addAttachment(REPORT_ID, file, CONST_1.default.DEFAULT_TIME_ZONE);
                    newComment = PersistedRequests.getAll().at(0);
                    reportActionID = (_a = newComment === null || newComment === void 0 ? void 0 : newComment.data) === null || _a === void 0 ? void 0 : _a.reportActionID;
                    newReportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
                    // wait for Onyx.connect execute the callback and start processing the queue
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 2:
                    // wait for Onyx.connect execute the callback and start processing the queue
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                                callback: function (persistedRequests) {
                                    var _a;
                                    react_native_onyx_1.default.disconnect(connection);
                                    (0, globals_1.expect)((_a = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(0)) === null || _a === void 0 ? void 0 : _a.command).toBe(types_1.WRITE_COMMANDS.ADD_ATTACHMENT);
                                    resolve();
                                },
                            });
                        })];
                case 3:
                    _b.sent();
                    // Checking the Report Action exists before deleting it
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                                callback: function (reportActions) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    var reportAction = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : null;
                                    (0, globals_1.expect)(reportAction).not.toBeNull();
                                    (0, globals_1.expect)(reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportActionID).toBe(reportActionID);
                                    resolve();
                                },
                            });
                        })];
                case 4:
                    // Checking the Report Action exists before deleting it
                    _b.sent();
                    Report.deleteReportComment(REPORT_ID, newReportAction);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 5:
                    _b.sent();
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(0);
                    connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                        callback: function (reportActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            var reportAction = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : undefined;
                            (0, globals_1.expect)(reportAction).toBeUndefined();
                        },
                    });
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 6:
                    _b.sent();
                    // Checking no requests were or will be made
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_ATTACHMENT, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should send not DeleteComment request and remove AddTextAndAttachment accordingly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var TEST_USER_ACCOUNT_ID, REPORT_ID, TEN_MINUTES_AGO, created, file, newComment, reportActionID, newReportAction, connection;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    TEST_USER_ACCOUNT_ID = 1;
                    REPORT_ID = '1';
                    TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
                    created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
                    file = new File([''], 'test.txt', { type: 'text/plain' });
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true })];
                case 1:
                    _b.sent();
                    Report.addAttachment(REPORT_ID, file, CONST_1.default.DEFAULT_TIME_ZONE, 'Attachment with comment');
                    newComment = PersistedRequests.getAll().at(0);
                    reportActionID = (_a = newComment === null || newComment === void 0 ? void 0 : newComment.data) === null || _a === void 0 ? void 0 : _a.reportActionID;
                    newReportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
                    // wait for Onyx.connect execute the callback and start processing the queue
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 2:
                    // wait for Onyx.connect execute the callback and start processing the queue
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                                callback: function (persistedRequests) {
                                    var _a;
                                    react_native_onyx_1.default.disconnect(connection);
                                    (0, globals_1.expect)((_a = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(0)) === null || _a === void 0 ? void 0 : _a.command).toBe(types_1.WRITE_COMMANDS.ADD_TEXT_AND_ATTACHMENT);
                                    resolve();
                                },
                            });
                        })];
                case 3:
                    _b.sent();
                    // Checking the Report Action exists before deleting it
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                                callback: function (reportActions) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    var reportAction = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : null;
                                    (0, globals_1.expect)(reportAction).not.toBeNull();
                                    (0, globals_1.expect)(reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportActionID).toBe(reportActionID);
                                    resolve();
                                },
                            });
                        })];
                case 4:
                    // Checking the Report Action exists before deleting it
                    _b.sent();
                    Report.deleteReportComment(REPORT_ID, newReportAction);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 5:
                    _b.sent();
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(0);
                    connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                        callback: function (reportActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            var reportAction = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : undefined;
                            (0, globals_1.expect)(reportAction).toBeUndefined();
                        },
                    });
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 6:
                    _b.sent();
                    // Checking no requests were or will be made
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_TEXT_AND_ATTACHMENT, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should not send DeleteComment request and remove any Reactions accordingly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var TEST_USER_ACCOUNT_ID, REPORT_ID, TEN_MINUTES_AGO, created, newComment, reportActionID, newReportAction, connection;
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    jest.doMock('@libs/EmojiUtils', function () { return (__assign(__assign({}, jest.requireActual('@libs/EmojiUtils')), { hasAccountIDEmojiReacted: jest.fn(function () { return true; }) })); });
                    TEST_USER_ACCOUNT_ID = 1;
                    REPORT_ID = '1';
                    TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
                    created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, Promise.resolve()];
                case 2:
                    _c.sent();
                    Report.addComment(REPORT_ID, 'reactions with comment', CONST_1.default.DEFAULT_TIME_ZONE);
                    newComment = PersistedRequests.getAll().at(0);
                    reportActionID = (_b = newComment === null || newComment === void 0 ? void 0 : newComment.data) === null || _b === void 0 ? void 0 : _b.reportActionID;
                    newReportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 3:
                    _c.sent();
                    Report.toggleEmojiReaction(REPORT_ID, newReportAction, { name: 'smile', code: '😄' }, {});
                    Report.toggleEmojiReaction(REPORT_ID, newReportAction, { name: 'smile', code: '😄' }, {
                        smile: {
                            createdAt: '2024-10-14 14:58:12',
                            oldestTimestamp: '2024-10-14 14:58:12',
                            users: (_a = {},
                                _a["".concat(TEST_USER_ACCOUNT_ID)] = {
                                    id: "".concat(TEST_USER_ACCOUNT_ID),
                                    oldestTimestamp: '2024-10-14 14:58:12',
                                    skinTones: {
                                        '-1': '2024-10-14 14:58:12',
                                    },
                                },
                                _a),
                        },
                    });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                                callback: function (persistedRequests) {
                                    var _a, _b, _c;
                                    react_native_onyx_1.default.disconnect(connection);
                                    (0, globals_1.expect)((_a = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(0)) === null || _a === void 0 ? void 0 : _a.command).toBe(types_1.WRITE_COMMANDS.ADD_COMMENT);
                                    (0, globals_1.expect)((_b = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(1)) === null || _b === void 0 ? void 0 : _b.command).toBe(types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION);
                                    (0, globals_1.expect)((_c = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(2)) === null || _c === void 0 ? void 0 : _c.command).toBe(types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION);
                                    resolve();
                                },
                            });
                        })];
                case 5:
                    _c.sent();
                    // Checking the Report Action exists before deleting it
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                                callback: function (reportActions) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    var reportAction = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : null;
                                    (0, globals_1.expect)(reportAction).not.toBeNull();
                                    (0, globals_1.expect)(reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportActionID).toBe(reportActionID);
                                    resolve();
                                },
                            });
                        })];
                case 6:
                    // Checking the Report Action exists before deleting it
                    _c.sent();
                    Report.deleteReportComment(REPORT_ID, newReportAction);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 7:
                    _c.sent();
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(0);
                    connection = react_native_onyx_1.default.connect({
                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(REPORT_ID),
                        callback: function (reportActions) {
                            react_native_onyx_1.default.disconnect(connection);
                            var reportAction = reportActionID ? reportActions === null || reportActions === void 0 ? void 0 : reportActions[reportActionID] : undefined;
                            (0, globals_1.expect)(reportAction).toBeUndefined();
                        },
                    });
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 8:
                    _c.sent();
                    // Checking no requests were or will be made
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should send DeleteComment request and remove any Reactions accordingly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var TEST_USER_ACCOUNT_ID, REPORT_ID, TEN_MINUTES_AGO, created, newComment, reportActionID, reportAction;
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    jest.doMock('@libs/EmojiUtils', function () { return (__assign(__assign({}, jest.requireActual('@libs/EmojiUtils')), { hasAccountIDEmojiReacted: jest.fn(function () { return true; }) })); });
                    TEST_USER_ACCOUNT_ID = 1;
                    REPORT_ID = '1';
                    TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
                    created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
                    Report.addComment(REPORT_ID, 'Attachment with comment', CONST_1.default.DEFAULT_TIME_ZONE);
                    newComment = PersistedRequests.getAll().at(0);
                    reportActionID = (_b = newComment === null || newComment === void 0 ? void 0 : newComment.data) === null || _b === void 0 ? void 0 : _b.reportActionID;
                    reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true })];
                case 1:
                    _c.sent();
                    // wait for Onyx.connect execute the callback and start processing the queue
                    return [4 /*yield*/, Promise.resolve()];
                case 2:
                    // wait for Onyx.connect execute the callback and start processing the queue
                    _c.sent();
                    Report.toggleEmojiReaction(REPORT_ID, reportAction, { name: 'smile', code: '😄' }, {});
                    Report.toggleEmojiReaction(REPORT_ID, reportAction, { name: 'smile', code: '😄' }, {
                        smile: {
                            createdAt: '2024-10-14 14:58:12',
                            oldestTimestamp: '2024-10-14 14:58:12',
                            users: (_a = {},
                                _a["".concat(TEST_USER_ACCOUNT_ID)] = {
                                    id: "".concat(TEST_USER_ACCOUNT_ID),
                                    oldestTimestamp: '2024-10-14 14:58:12',
                                    skinTones: {
                                        '-1': '2024-10-14 14:58:12',
                                    },
                                },
                                _a),
                        },
                    });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                                callback: function (persistedRequests) {
                                    var _a, _b;
                                    react_native_onyx_1.default.disconnect(connection);
                                    (0, globals_1.expect)((_a = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(0)) === null || _a === void 0 ? void 0 : _a.command).toBe(types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION);
                                    (0, globals_1.expect)((_b = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(1)) === null || _b === void 0 ? void 0 : _b.command).toBe(types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION);
                                    resolve();
                                },
                            });
                        })];
                case 4:
                    _c.sent();
                    Report.deleteReportComment(REPORT_ID, reportAction);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 5:
                    _c.sent();
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 6:
                    _c.sent();
                    // Checking no requests were or will be made
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 1);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION, 0);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should create and delete thread processing all the requests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var TEST_USER_ACCOUNT_ID, REPORT_ID, TEN_MINUTES_AGO, created, newComment, reportActionID, reportAction;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    TEST_USER_ACCOUNT_ID = 1;
                    REPORT_ID = '1';
                    TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
                    created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 2:
                    _b.sent();
                    Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
                    newComment = PersistedRequests.getAll().at(0);
                    reportActionID = (_a = newComment === null || newComment === void 0 ? void 0 : newComment.data) === null || _a === void 0 ? void 0 : _a.reportActionID;
                    reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
                    Report.openReport(REPORT_ID, undefined, ['test@user.com'], {
                        parentReportID: REPORT_ID,
                        parentReportActionID: reportActionID,
                        reportID: '2',
                    }, reportActionID);
                    Report.deleteReportComment(REPORT_ID, reportAction);
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(3);
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                                callback: function (persistedRequests) {
                                    var _a, _b, _c;
                                    if ((persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.length) !== 3) {
                                        return;
                                    }
                                    react_native_onyx_1.default.disconnect(connection);
                                    (0, globals_1.expect)((_a = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(0)) === null || _a === void 0 ? void 0 : _a.command).toBe(types_1.WRITE_COMMANDS.ADD_COMMENT);
                                    (0, globals_1.expect)((_b = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(1)) === null || _b === void 0 ? void 0 : _b.command).toBe(types_1.WRITE_COMMANDS.OPEN_REPORT);
                                    (0, globals_1.expect)((_c = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(2)) === null || _c === void 0 ? void 0 : _c.command).toBe(types_1.WRITE_COMMANDS.DELETE_COMMENT);
                                    resolve();
                                },
                            });
                        })];
                case 3:
                    _b.sent();
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 4:
                    _b.sent();
                    // Checking no requests were or will be made
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 1);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.OPEN_REPORT, 1);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should update AddComment text with the UpdateComment text, sending just an AddComment request', function () { return __awaiter(void 0, void 0, void 0, function () {
        var TEST_USER_ACCOUNT_ID, REPORT_ID, TEN_MINUTES_AGO, created, newComment, reportActionID, reportAction;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    TEST_USER_ACCOUNT_ID = 1;
                    REPORT_ID = '1';
                    TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
                    created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
                    Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
                    newComment = PersistedRequests.getAll().at(0);
                    reportActionID = (_a = newComment === null || newComment === void 0 ? void 0 : newComment.data) === null || _a === void 0 ? void 0 : _a.reportActionID;
                    reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
                    Report.editReportComment(REPORT_ID, reportAction, 'Testing an edited comment');
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                                callback: function (persistedRequests) {
                                    var _a;
                                    react_native_onyx_1.default.disconnect(connection);
                                    (0, globals_1.expect)((_a = persistedRequests === null || persistedRequests === void 0 ? void 0 : persistedRequests.at(0)) === null || _a === void 0 ? void 0 : _a.command).toBe(types_1.WRITE_COMMANDS.ADD_COMMENT);
                                    resolve();
                                },
                            });
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 3:
                    _b.sent();
                    (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 4:
                    _b.sent();
                    // Checking no requests were or will be made
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 1);
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.UPDATE_COMMENT, 0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('it should only send the last sequential UpdateComment request to BE', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reportID, action, requests;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    global.fetch = TestHelper.getGlobalFetchMock();
                    reportID = '123';
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true })];
                case 1:
                    _d.sent();
                    action = {
                        reportID: reportID,
                        reportActionID: '722',
                        actionName: 'ADDCOMMENT',
                        created: '2024-10-21 10:37:59.881',
                    };
                    Report.editReportComment(reportID, action, 'value1');
                    Report.editReportComment(reportID, action, 'value2');
                    Report.editReportComment(reportID, action, 'value3');
                    requests = PersistedRequests === null || PersistedRequests === void 0 ? void 0 : PersistedRequests.getAll();
                    (0, globals_1.expect)(requests.length).toBe(1);
                    (0, globals_1.expect)((_a = requests === null || requests === void 0 ? void 0 : requests.at(0)) === null || _a === void 0 ? void 0 : _a.command).toBe(types_1.WRITE_COMMANDS.UPDATE_COMMENT);
                    (0, globals_1.expect)((_c = (_b = requests === null || requests === void 0 ? void 0 : requests.at(0)) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.reportComment).toBe('value3');
                    return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false })];
                case 2:
                    _d.sent();
                    TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.UPDATE_COMMENT, 1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should clears lastMentionedTime when all mentions to the current user are deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reportID, mentionActionID, mentionActionID2, currentUserAccountID, mentionAction, mentionAction2, report;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reportID = '1';
                    mentionActionID = '1';
                    mentionActionID2 = '2';
                    currentUserAccountID = 123;
                    mentionAction = __assign(__assign({}, (0, reportActions_1.default)(Number(mentionActionID))), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT, originalMessage: {
                            mentionedAccountIDs: [currentUserAccountID],
                        } });
                    mentionAction2 = __assign(__assign({}, (0, reportActions_1.default)(Number(mentionActionID2))), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT, originalMessage: {
                            mentionedAccountIDs: [currentUserAccountID],
                        } });
                    return [4 /*yield*/, react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: currentUserAccountID })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID), (_a = {},
                            _a[mentionActionID] = mentionAction,
                            _a[mentionActionID2] = mentionAction2,
                            _a))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), __assign(__assign({}, (0, reports_1.createRandomReport)(Number(reportID))), { lastMentionedTime: mentionAction2.created }))];
                case 3:
                    _b.sent();
                    Report.deleteReportComment(reportID, mentionAction);
                    Report.deleteReportComment(reportID, mentionAction2);
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID),
                                callback: resolve,
                            });
                        })];
                case 5:
                    report = _b.sent();
                    (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.lastMentionedTime).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should create new report and "create report" quick action, when createNewReport gets called', function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountID, policyID, mockFetchData, policy, reportID, parentReport, reportPreviewAction;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    accountID = 1234;
                    policyID = '5678';
                    mockFetchData = fetch;
                    policy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { isPolicyExpenseChatEnabled: true, type: CONST_1.default.POLICY.TYPE.TEAM, harvesting: {
                            enabled: false,
                        } });
                    return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), policy)];
                case 1:
                    _b.sent();
                    mockFetchData.pause();
                    reportID = Report.createNewReport({ accountID: accountID }, policyID);
                    parentReport = ReportUtils.getPolicyExpenseChat(accountID, policyID);
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(parentReport === null || parentReport === void 0 ? void 0 : parentReport.reportID),
                                callback: function (reportActions) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    var action = Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).at(0);
                                    resolve(action);
                                },
                            });
                        })];
                case 2:
                    reportPreviewAction = _b.sent();
                    (0, globals_1.expect)((_a = (0, ReportActionsUtils_1.getOriginalMessage)(reportPreviewAction)) === null || _a === void 0 ? void 0 : _a.linkedReportID).toBe(reportID);
                    (0, globals_1.expect)(reportPreviewAction === null || reportPreviewAction === void 0 ? void 0 : reportPreviewAction.actorAccountID).toBe(accountID);
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                waitForCollectionCallback: true,
                                callback: function (reports) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    var createdReport = reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID)];
                                    var parentPolicyExpenseChat = reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(parentReport === null || parentReport === void 0 ? void 0 : parentReport.reportID)];
                                    // assert correctness of crucial onyx data
                                    (0, globals_1.expect)(createdReport === null || createdReport === void 0 ? void 0 : createdReport.reportID).toBe(reportID);
                                    (0, globals_1.expect)(parentPolicyExpenseChat === null || parentPolicyExpenseChat === void 0 ? void 0 : parentPolicyExpenseChat.lastVisibleActionCreated).toBe(reportPreviewAction === null || reportPreviewAction === void 0 ? void 0 : reportPreviewAction.created);
                                    (0, globals_1.expect)(parentPolicyExpenseChat === null || parentPolicyExpenseChat === void 0 ? void 0 : parentPolicyExpenseChat.hasOutstandingChildRequest).toBe(true);
                                    (0, globals_1.expect)(createdReport === null || createdReport === void 0 ? void 0 : createdReport.total).toBe(0);
                                    (0, globals_1.expect)(createdReport === null || createdReport === void 0 ? void 0 : createdReport.parentReportActionID).toBe(reportPreviewAction === null || reportPreviewAction === void 0 ? void 0 : reportPreviewAction.reportActionID);
                                    resolve();
                                },
                            });
                        })];
                case 3:
                    _b.sent();
                    // When the request fails
                    mockFetchData.fail();
                    return [4 /*yield*/, mockFetchData.resume()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 5:
                    _b.sent();
                    // Then the onyx data should be reverted to the state before the request
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                waitForCollectionCallback: true,
                                callback: function (reports) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    var parentPolicyExpenseChat = reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(parentReport === null || parentReport === void 0 ? void 0 : parentReport.reportID)];
                                    (0, globals_1.expect)(parentPolicyExpenseChat === null || parentPolicyExpenseChat === void 0 ? void 0 : parentPolicyExpenseChat.hasOutstandingChildRequest).toBe(parentReport === null || parentReport === void 0 ? void 0 : parentReport.hasOutstandingChildRequest);
                                    resolve();
                                },
                            });
                        })];
                case 6:
                    // Then the onyx data should be reverted to the state before the request
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.it)('should not optimistic outstandingChildRequest when create report with harvesting is enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountID, policyID, policy, parentReport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    accountID = 1234;
                    policyID = '5678';
                    policy = __assign(__assign({}, (0, policies_1.default)(Number(policyID))), { isPolicyExpenseChatEnabled: true, type: CONST_1.default.POLICY.TYPE.TEAM, harvesting: {
                            enabled: true,
                        } });
                    parentReport = ReportUtils.getPolicyExpenseChat(accountID, policyID);
                    return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), policy)];
                case 1:
                    _a.sent();
                    if (!(parentReport === null || parentReport === void 0 ? void 0 : parentReport.reportID)) return [3 /*break*/, 3];
                    return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(parentReport === null || parentReport === void 0 ? void 0 : parentReport.reportID), parentReport)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    // When create new report
                    Report.createNewReport({ accountID: accountID }, policyID);
                    // Then the parent report's hasOutstandingChildRequest property should remain unchanged
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var connection = react_native_onyx_1.default.connect({
                                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                                waitForCollectionCallback: true,
                                callback: function (reports) {
                                    react_native_onyx_1.default.disconnect(connection);
                                    var parentPolicyExpenseChat = reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(parentReport === null || parentReport === void 0 ? void 0 : parentReport.reportID)];
                                    (0, globals_1.expect)(parentPolicyExpenseChat === null || parentPolicyExpenseChat === void 0 ? void 0 : parentPolicyExpenseChat.hasOutstandingChildRequest).toBe(parentReport === null || parentReport === void 0 ? void 0 : parentReport.hasOutstandingChildRequest);
                                    resolve();
                                },
                            });
                        })];
                case 4:
                    // Then the parent report's hasOutstandingChildRequest property should remain unchanged
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.describe)('completeOnboarding', function () {
        var TEST_USER_LOGIN = 'test@gmail.com';
        var TEST_USER_ACCOUNT_ID = 1;
        global.fetch = TestHelper.getGlobalFetchMock();
        (0, globals_1.it)('should set "isOptimisticAction" to false/null for all actions in admins report after completing onboarding setup', function () { return __awaiter(void 0, void 0, void 0, function () {
            var adminsChatReportID, onboardingPolicyID, engagementChoice, onboardingMessages, reportActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: TEST_USER_LOGIN, accountID: TEST_USER_ACCOUNT_ID })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        adminsChatReportID = '7957055873634067';
                        onboardingPolicyID = 'A70D00C752416807';
                        engagementChoice = CONST_1.default.INTRO_CHOICES.MANAGE_TEAM;
                        onboardingMessages = (0, OnboardingFlow_1.getOnboardingMessages)().onboardingMessages;
                        Report.completeOnboarding({
                            engagementChoice: engagementChoice,
                            onboardingMessage: onboardingMessages[engagementChoice],
                            adminsChatReportID: adminsChatReportID,
                            onboardingPolicyID: onboardingPolicyID,
                            companySize: CONST_1.default.ONBOARDING_COMPANY_SIZE.MICRO,
                            userReportedIntegration: null,
                        });
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(adminsChatReportID),
                                    callback: function (id) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(id);
                                    },
                                });
                            })];
                    case 4:
                        reportActions = _a.sent();
                        (0, globals_1.expect)(reportActions).not.toBeNull();
                        (0, globals_1.expect)(reportActions).not.toBeUndefined();
                        Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}).forEach(function (action) {
                            (0, globals_1.expect)(action.isOptimisticAction).toBeFalsy();
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, globals_1.describe)('markAllMessagesAsRead', function () {
        (0, globals_1.it)('should mark all unread reports as read', function () { return __awaiter(void 0, void 0, void 0, function () {
            var currentTime, reportCollections, isUnreadCollection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentTime = DateUtils_1.default.getDBTime();
                        reportCollections = (0, createCollection_1.default)(function (item) { return "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(item.reportID); }, function (index) {
                            if (index % 2 === 0) {
                                return __assign(__assign({}, (0, reports_1.createRandomReport)(index)), { lastMessageText: 'test', lastReadTime: DateUtils_1.default.subtractMillisecondsFromDateTime(currentTime, 1), lastVisibleActionCreated: currentTime });
                            }
                            return (0, reports_1.createRandomReport)(index);
                        }, 10);
                        return [4 /*yield*/, react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT, reportCollections)];
                    case 1:
                        _a.sent();
                        // When mark all reports as read
                        Report.markAllMessagesAsRead();
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(Object.values(reportCollections).map(function (report) {
                                return new Promise(function (resolve) {
                                    var connection = react_native_onyx_1.default.connect({
                                        key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report.reportID),
                                        callback: function (reportVal) {
                                            react_native_onyx_1.default.disconnect(connection);
                                            resolve(ReportUtils.isUnread(reportVal, undefined));
                                        },
                                    });
                                });
                            }))];
                    case 3:
                        isUnreadCollection = _a.sent();
                        (0, globals_1.expect)(isUnreadCollection.some(Boolean)).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, globals_1.describe)('updateDescription', function () {
        (0, globals_1.it)('should not call UpdateRoomDescription API if the description is not changed', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch = TestHelper.getGlobalFetchMock();
                        Report.updateDescription('1', '<h1>test</h1>', '# test');
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 1:
                        _a.sent();
                        (0, globals_1.expect)(global.fetch).toHaveBeenCalledTimes(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should revert to correct previous description if UpdateRoomDescription API fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var report, mockFetch, updateReport;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        report = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { description: '<h1>test</h1>' });
                        mockFetch = fetch;
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report.reportID), report)];
                    case 1:
                        _b.sent();
                        (_a = mockFetch === null || mockFetch === void 0 ? void 0 : mockFetch.fail) === null || _a === void 0 ? void 0 : _a.call(mockFetch);
                        Report.updateDescription('1', '<h1>test</h1>', '# test1');
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, TestHelper.getOnyxData({
                                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report.reportID),
                                callback: function (val) { return (updateReport = val); },
                            })];
                    case 3:
                        _b.sent();
                        (0, globals_1.expect)(updateReport === null || updateReport === void 0 ? void 0 : updateReport.description).toBe('<h1>test</h1>');
                        mockFetch.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, globals_1.describe)('deleteAppReport', function () {
        (0, globals_1.it)('should only moves CREATE or TRACK type of IOU action to self DM', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reportID, firstIOUAction, secondIOUAction, payAction, selfDMReportID, selfDMReportActions;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reportID = '1';
                        firstIOUAction = {
                            reportActionID: '1',
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            created: DateUtils_1.default.getDBTime(),
                            message: [{ type: 'COMMENT', html: 'Comment 1', text: 'Comment 1' }],
                            originalMessage: {
                                amount: 100,
                                currency: CONST_1.default.CURRENCY.USD,
                                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                            },
                        };
                        secondIOUAction = {
                            reportActionID: '2',
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            created: DateUtils_1.default.getDBTime(),
                            message: [{ type: 'COMMENT', html: 'Comment 2', text: 'Comment 2' }],
                            originalMessage: {
                                amount: 100,
                                currency: CONST_1.default.CURRENCY.USD,
                                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK,
                            },
                        };
                        payAction = {
                            reportActionID: '3',
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            created: DateUtils_1.default.getDBTime(),
                            message: [{ type: 'COMMENT', html: 'Comment 3', text: 'Comment 3' }],
                            originalMessage: {
                                amount: 100,
                                currency: CONST_1.default.CURRENCY.USD,
                                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
                            },
                        };
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID), (_a = {},
                                _a[firstIOUAction.reportActionID] = firstIOUAction,
                                _a[secondIOUAction.reportActionID] = secondIOUAction,
                                _a[payAction.reportActionID] = payAction,
                                _a))];
                    case 1:
                        _b.sent();
                        // When deleting the expense report
                        Report.deleteAppReport(reportID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 2:
                        _b.sent();
                        selfDMReportID = ReportUtils.findSelfDMReportID();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(selfDMReportID),
                                    callback: function (val) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(val);
                                    },
                                });
                            })];
                    case 3:
                        selfDMReportActions = _b.sent();
                        // The length is 3 to include the CREATED action
                        (0, globals_1.expect)(Object.keys(selfDMReportActions !== null && selfDMReportActions !== void 0 ? selfDMReportActions : {}).length).toBe(3);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should not reset the chatReport hasOutstandingChildRequest if there is another outstanding report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var currentUserAccountID, fakePolicy, chatReport, expenseReport1, reportPreview1, expenseReport2, transaction, reportPreview2, iouAction1, report;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        currentUserAccountID = 1;
                        fakePolicy = __assign(__assign({}, (0, policies_1.default)(6)), { role: 'admin', ownerAccountID: currentUserAccountID, areRulesEnabled: true, preventSelfApproval: false, autoReportingFrequency: 'immediate', harvesting: {
                                enabled: false,
                            } });
                        chatReport = __assign(__assign({}, (0, reports_1.createRandomReport)(11)), { policyID: fakePolicy.id, chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, hasOutstandingChildRequest: true });
                        expenseReport1 = __assign(__assign({}, (0, reports_1.createRandomReport)(5)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, managerID: currentUserAccountID, ownerAccountID: currentUserAccountID, policyID: fakePolicy.id, stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN, statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN, chatReportID: chatReport.reportID, parentReportID: chatReport.reportID });
                        reportPreview1 = __assign(__assign({}, (0, reportActions_1.default)(1)), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW, originalMessage: {
                                linkedReportID: expenseReport1.reportID,
                            } });
                        expenseReport2 = __assign(__assign({}, (0, reports_1.createRandomReport)(6)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, managerID: currentUserAccountID, ownerAccountID: currentUserAccountID, policyID: fakePolicy.id, stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN, statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN, chatReportID: chatReport.reportID, parentReportID: chatReport.reportID });
                        transaction = __assign(__assign({}, (0, transaction_1.default)(22)), { reportID: expenseReport2.reportID });
                        reportPreview2 = __assign(__assign({}, (0, reportActions_1.default)(22)), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW, originalMessage: {
                                linkedReportID: expenseReport2.reportID,
                            } });
                        iouAction1 = {
                            reportActionID: '1',
                            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                            created: DateUtils_1.default.getDBTime(),
                            originalMessage: {
                                amount: 100,
                                currency: CONST_1.default.CURRENCY.USD,
                                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                            },
                        };
                        return [4 /*yield*/, react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: currentUserAccountID })];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(fakePolicy.id), fakePolicy)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(expenseReport1.reportID), (_a = {},
                                _a[iouAction1.reportActionID] = iouAction1,
                                _a))];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport.reportID), (_b = {},
                                _b[reportPreview1.reportActionID] = reportPreview1,
                                _b[reportPreview2.reportActionID] = reportPreview2,
                                _b))];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReport.reportID), chatReport)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(expenseReport1.reportID), expenseReport1)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(expenseReport2.reportID), expenseReport2)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction.transactionID), transaction)];
                    case 8:
                        _c.sent();
                        // When deleting the first expense report
                        Report.deleteAppReport(expenseReport1.reportID);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReport.reportID),
                                    callback: function (val) {
                                        react_native_onyx_1.default.disconnect(connection);
                                        resolve(val);
                                    },
                                });
                            })];
                    case 10:
                        report = _c.sent();
                        // The hasOutstandingChildRequest should still remain true as there is a second outstanding report.
                        (0, globals_1.expect)(report === null || report === void 0 ? void 0 : report.hasOutstandingChildRequest).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, globals_1.describe)('changeReportPolicy', function () {
        (0, globals_1.it)('should unarchive the expense report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expenseReport, newPolicy, isArchived, snapshotData;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expenseReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1' });
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(expenseReport.reportID), {
                                private_isArchived: DateUtils_1.default.getDBTime(),
                            })];
                    case 1:
                        _b.sent();
                        newPolicy = (0, policies_1.default)(2);
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(newPolicy.id), newPolicy)];
                    case 2:
                        _b.sent();
                        // When moving to another workspace
                        Report.changeReportPolicy(expenseReport, newPolicy);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(expenseReport.reportID),
                                    callback: function (val) {
                                        resolve(!!(val === null || val === void 0 ? void 0 : val.private_isArchived));
                                        react_native_onyx_1.default.disconnect(connection);
                                    },
                                });
                            })];
                    case 4:
                        isArchived = _b.sent();
                        (0, globals_1.expect)(isArchived).toBe(false);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(currentHash),
                                    callback: function (val) {
                                        resolve(val);
                                        react_native_onyx_1.default.disconnect(connection);
                                    },
                                });
                            })];
                    case 5:
                        snapshotData = _b.sent();
                        // Then the new policy data should also be populated on the current search snapshot.
                        (0, globals_1.expect)((_a = snapshotData === null || snapshotData === void 0 ? void 0 : snapshotData.data) === null || _a === void 0 ? void 0 : _a["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(newPolicy.id)]).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, globals_1.describe)('changeReportPolicyAndInviteSubmitter', function () {
        (0, globals_1.it)('should unarchive the expense report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ownerAccountID, ownerEmail, adminEmail, expenseReport, isArchived;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ownerAccountID = 1;
                        ownerEmail = 'owner@gmail.com';
                        adminEmail = 'admin@gmail.com';
                        expenseReport = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1', ownerAccountID: ownerAccountID });
                        return [4 /*yield*/, react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(expenseReport.reportID), {
                                private_isArchived: DateUtils_1.default.getDBTime(),
                            })];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, (_a = {},
                                _a[ownerAccountID] = {
                                    login: ownerEmail,
                                },
                                _a))];
                    case 2:
                        _c.sent();
                        // When moving to another workspace
                        Report.changeReportPolicyAndInviteSubmitter(expenseReport, (0, policies_1.default)(Number(2)), (_b = {},
                            _b[adminEmail] = { role: CONST_1.default.POLICY.ROLE.ADMIN },
                            _b), TestHelper.formatPhoneNumber);
                        return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var connection = react_native_onyx_1.default.connect({
                                    key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(expenseReport.reportID),
                                    callback: function (val) {
                                        resolve(!!(val === null || val === void 0 ? void 0 : val.private_isArchived));
                                        react_native_onyx_1.default.disconnect(connection);
                                    },
                                });
                            })];
                    case 4:
                        isArchived = _c.sent();
                        (0, globals_1.expect)(isArchived).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, globals_1.describe)('buildOptimisticChangePolicyData', function () {
        (0, globals_1.it)('should build the optimistic data next step for the change policy data', function () {
            var report = __assign(__assign({}, (0, reports_1.createRandomReport)(1)), { statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, type: CONST_1.default.REPORT.TYPE.EXPENSE });
            Report.buildOptimisticChangePolicyData(report, (0, policies_1.default)(Number(1)));
            (0, globals_1.expect)(NextStepUtils_1.buildNextStep).toHaveBeenCalledWith(report, CONST_1.default.REPORT.STATUS_NUM.SUBMITTED);
        });
    });
    (0, globals_1.describe)('searchInServer', function () {
        (0, globals_1.it)('should return the same result with or without uppercase input.', function () {
            var _a, _b;
            Report.searchInServer('test');
            Report.searchInServer('TEST');
            var upperCaseRequest = PersistedRequests.getAll().at(0);
            var lowerCaseRequest = PersistedRequests.getAll().at(1);
            (0, globals_1.expect)((_a = upperCaseRequest === null || upperCaseRequest === void 0 ? void 0 : upperCaseRequest.data) === null || _a === void 0 ? void 0 : _a.searchInput).toBe((_b = lowerCaseRequest === null || lowerCaseRequest === void 0 ? void 0 : lowerCaseRequest.data) === null || _b === void 0 ? void 0 : _b.searchInput);
        });
    });
});
