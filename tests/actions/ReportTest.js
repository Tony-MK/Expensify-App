"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const globals_1 = require("@jest/globals");
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const react_native_onyx_1 = require("react-native-onyx");
const OnboardingFlow_1 = require("@libs/actions/Welcome/OnboardingFlow");
const types_1 = require("@libs/API/types");
const HttpUtils_1 = require("@libs/HttpUtils");
const NextStepUtils_1 = require("@libs/NextStepUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const CONST_1 = require("@src/CONST");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const PersistedRequests = require("@src/libs/actions/PersistedRequests");
const Report = require("@src/libs/actions/Report");
const User = require("@src/libs/actions/User");
const DateUtils_1 = require("@src/libs/DateUtils");
const Log_1 = require("@src/libs/Log");
const SequentialQueue = require("@src/libs/Network/SequentialQueue");
const ReportUtils = require("@src/libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const createCollection_1 = require("../utils/collections/createCollection");
const policies_1 = require("../utils/collections/policies");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const getIsUsingFakeTimers_1 = require("../utils/getIsUsingFakeTimers");
const PusherHelper_1 = require("../utils/PusherHelper");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForNetworkPromises_1 = require("../utils/waitForNetworkPromises");
jest.mock('@libs/NextStepUtils', () => ({
    buildNextStep: jest.fn(),
}));
jest.mock('@libs/ReportUtils', () => {
    const originalModule = jest.requireActual('@libs/ReportUtils');
    return {
        ...originalModule,
        getPolicyExpenseChat: jest.fn().mockReturnValue({ reportID: '1234', hasOutstandingChildRequest: false }),
    };
});
const currentHash = 12345;
jest.mock('@src/libs/SearchQueryUtils', () => ({
    getCurrentSearchQueryJSON: jest.fn().mockImplementation(() => ({
        hash: currentHash,
        query: 'test',
        type: 'expense',
        status: '',
        flatFilters: [],
    })),
}));
const UTC = 'UTC';
jest.mock('@src/libs/actions/Report', () => {
    const originalModule = jest.requireActual('@src/libs/actions/Report');
    return {
        ...originalModule,
        showReportActionNotification: jest.fn(),
    };
});
jest.mock('@hooks/useScreenWrapperTransitionStatus', () => ({
    default: () => ({
        didScreenTransitionEnd: true,
    }),
}));
const originalXHR = HttpUtils_1.default.xhr;
(0, OnyxUpdateManager_1.default)();
(0, globals_1.describe)('actions/Report', () => {
    (0, globals_1.beforeAll)(() => {
        PusherHelper_1.default.setup();
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    (0, globals_1.beforeEach)(() => {
        HttpUtils_1.default.xhr = originalXHR;
        const promise = react_native_onyx_1.default.clear().then(() => {
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
    (0, globals_1.afterEach)(() => {
        jest.clearAllMocks();
        PusherHelper_1.default.teardown();
    });
    (0, globals_1.it)('should store a new report action in Onyx when onyxApiUpdate event is handled via Pusher', () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const TEST_USER_ACCOUNT_ID = 1;
        const TEST_USER_LOGIN = 'test@test.com';
        const REPORT_ID = '1';
        let reportActionID;
        const REPORT_ACTION = {
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            actorAccountID: TEST_USER_ACCOUNT_ID,
            automatic: false,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            message: [{ type: 'COMMENT', html: 'Testing a comment', text: 'Testing a comment', translationKey: '' }],
            person: [{ type: 'TEXT', style: 'strong', text: 'Test User' }],
            shouldShow: true,
        };
        let reportActions;
        react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (val) => (reportActions = val),
        });
        // Set up Onyx with some test user data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(() => {
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => TestHelper.setPersonalDetails(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID))
            .then(() => {
            // This is a fire and forget response, but once it completes we should be able to verify that we
            // have an "optimistic" report action in Onyx.
            Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            const resultAction = Object.values(reportActions ?? {}).at(0);
            reportActionID = resultAction?.reportActionID;
            (0, globals_1.expect)(reportActionID).not.toBeUndefined();
            (0, globals_1.expect)(resultAction?.message).toEqual(REPORT_ACTION.message);
            (0, globals_1.expect)(resultAction?.person).toEqual(REPORT_ACTION.person);
            (0, globals_1.expect)(resultAction?.pendingAction).toBeUndefined();
            if (!reportActionID) {
                return;
            }
            // We subscribed to the Pusher channel above and now we need to simulate a reportComment action
            // Pusher event so we can verify that action was handled correctly and merged into the reportActions.
            PusherHelper_1.default.emitOnyxUpdate([
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`,
                    value: {
                        reportID: REPORT_ID,
                        participants: {
                            [TEST_USER_ACCOUNT_ID]: {
                                notificationPreference: 'always',
                            },
                        },
                        lastVisibleActionCreated: '2022-11-22 03:48:27.267',
                        lastMessageText: 'Testing a comment',
                        lastActorAccountID: TEST_USER_ACCOUNT_ID,
                    },
                },
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
                    value: {
                        [reportActionID]: { pendingAction: null },
                    },
                },
            ]);
            // Once a reportComment event is emitted to the Pusher channel we should see the comment get processed
            // by the Pusher callback and added to the storage so we must wait for promises to resolve again and
            // then verify the data is in Onyx.
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Verify there is only one action and our optimistic comment has been removed
            (0, globals_1.expect)(Object.keys(reportActions ?? {}).length).toBe(1);
            const resultAction = reportActionID ? reportActions?.[reportActionID] : undefined;
            // Verify that our action is no longer in the loading state
            (0, globals_1.expect)(resultAction?.pendingAction).toBeUndefined();
        });
    });
    (0, globals_1.it)('clearCreateChatError should not delete the report if it is not optimistic report', () => {
        const REPORT = { ...(0, reports_1.createRandomReport)(1), errorFields: { createChat: { error: 'error' } } };
        const REPORT_METADATA = { isOptimisticReport: false };
        react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT.reportID}`, REPORT);
        react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${REPORT.reportID}`, REPORT_METADATA);
        return (0, waitForBatchedUpdates_1.default)()
            .then(() => {
            Report.clearCreateChatError(REPORT);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT.reportID}`,
                callback: (report) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve();
                    // The report should exist but the create chat error field should be cleared.
                    (0, globals_1.expect)(report?.reportID).toBeDefined();
                    (0, globals_1.expect)(report?.errorFields?.createChat).toBeUndefined();
                },
            });
        }));
    });
    (0, globals_1.it)('should update pins in Onyx when togglePinned is called', () => {
        const TEST_USER_ACCOUNT_ID = 1;
        const TEST_USER_LOGIN = 'test@test.com';
        const REPORT_ID = '1';
        let reportIsPinned;
        react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`,
            callback: (val) => (reportIsPinned = val?.isPinned ?? false),
        });
        // Set up Onyx with some test user data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(() => {
            Report.togglePinnedState(REPORT_ID, false);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Test that Onyx immediately updated the report pin state.
            (0, globals_1.expect)(reportIsPinned).toEqual(true);
        });
    });
    (0, globals_1.it)('Should not leave duplicate comments when logger sends packet because of calling process queue while processing the queue', () => {
        const TEST_USER_ACCOUNT_ID = 1;
        const TEST_USER_LOGIN = 'test@test.com';
        const REPORT_ID = '1';
        const LOGGER_MAX_LOG_LINES = 50;
        // GIVEN a test user with initial data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(() => TestHelper.setPersonalDetails(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID))
            .then(() => {
            global.fetch = TestHelper.getGlobalFetchMock();
            // WHEN we add enough logs to send a packet
            for (let i = 0; i <= LOGGER_MAX_LOG_LINES; i++) {
                Log_1.default.info('Test log info');
            }
            // And leave a comment on a report
            Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            // Then we should expect that there is on persisted request
            (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
            // When we wait for the queue to run
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // THEN only ONE call to AddComment will happen
            const URL_ARGUMENT_INDEX = 0;
            const addCommentCalls = global.fetch.mock.calls.filter((callArguments) => callArguments.at(URL_ARGUMENT_INDEX)?.includes('AddComment'));
            (0, globals_1.expect)(addCommentCalls.length).toBe(1);
        });
    });
    (0, globals_1.it)('should be updated correctly when new comments are added, deleted or marked as unread', () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const REPORT_ID = '1';
        let report;
        let reportActionCreatedDate;
        let currentTime;
        react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`,
            callback: (val) => (report = val),
        });
        let reportActions;
        react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (val) => (reportActions = val ?? {}),
        });
        const USER_1_LOGIN = 'user@test.com';
        const USER_1_ACCOUNT_ID = 1;
        const USER_2_ACCOUNT_ID = 2;
        const setPromise = react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, { reportName: 'Test', reportID: REPORT_ID })
            .then(() => TestHelper.signInWithTestUser(USER_1_ACCOUNT_ID, USER_1_LOGIN))
            .then(waitForNetworkPromises_1.default)
            .then(() => {
            // Given a test user that is subscribed to Pusher events
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => TestHelper.setPersonalDetails(USER_1_LOGIN, USER_1_ACCOUNT_ID))
            .then(() => {
            // When a Pusher event is handled for a new report comment that includes a mention of the current user
            reportActionCreatedDate = DateUtils_1.default.getDBTime();
            PusherHelper_1.default.emitOnyxUpdate([
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`,
                    value: {
                        reportID: REPORT_ID,
                        participants: {
                            [USER_1_ACCOUNT_ID]: {
                                notificationPreference: 'always',
                            },
                        },
                        lastMessageText: 'Comment 1',
                        lastActorAccountID: USER_2_ACCOUNT_ID,
                        lastVisibleActionCreated: reportActionCreatedDate,
                        lastMentionedTime: reportActionCreatedDate,
                        lastReadTime: DateUtils_1.default.subtractMillisecondsFromDateTime(reportActionCreatedDate, 1),
                    },
                },
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
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
            .then(() => {
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
            .then(() => {
            // The report will be read
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)((0, date_fns_tz_1.toZonedTime)(report?.lastReadTime ?? '', UTC).getTime()).toBeGreaterThanOrEqual((0, date_fns_tz_1.toZonedTime)(currentTime, UTC).getTime());
            // And no longer show the green dot for unread mentions in the LHN
            (0, globals_1.expect)(ReportUtils.isUnreadWithMention(report)).toBe(false);
            // When the user manually marks a message as "unread"
            Report.markCommentAsUnread(REPORT_ID, reportActions['1']);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Then the report will be unread and show the green dot for unread mentions in LHN
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(true);
            (0, globals_1.expect)(ReportUtils.isUnreadWithMention(report)).toBe(true);
            (0, globals_1.expect)(report?.lastReadTime).toBe(DateUtils_1.default.subtractMillisecondsFromDateTime(reportActionCreatedDate, 1));
            // When a new comment is added by the current user
            currentTime = DateUtils_1.default.getDBTime();
            Report.addComment(REPORT_ID, 'Current User Comment 1', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // The report will be read, the green dot for unread mentions will go away, and the lastReadTime updated
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)(ReportUtils.isUnreadWithMention(report)).toBe(false);
            (0, globals_1.expect)((0, date_fns_tz_1.toZonedTime)(report?.lastReadTime ?? '', UTC).getTime()).toBeGreaterThanOrEqual((0, date_fns_tz_1.toZonedTime)(currentTime, UTC).getTime());
            (0, globals_1.expect)(report?.lastMessageText).toBe('Current User Comment 1');
            // When another comment is added by the current user
            currentTime = DateUtils_1.default.getDBTime();
            Report.addComment(REPORT_ID, 'Current User Comment 2', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // The report will be read and the lastReadTime updated
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)((0, date_fns_tz_1.toZonedTime)(report?.lastReadTime ?? '', UTC).getTime()).toBeGreaterThanOrEqual((0, date_fns_tz_1.toZonedTime)(currentTime, UTC).getTime());
            (0, globals_1.expect)(report?.lastMessageText).toBe('Current User Comment 2');
            // When another comment is added by the current user
            currentTime = DateUtils_1.default.getDBTime();
            Report.addComment(REPORT_ID, 'Current User Comment 3', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // The report will be read and the lastReadTime updated
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)((0, date_fns_tz_1.toZonedTime)(report?.lastReadTime ?? '', UTC).getTime()).toBeGreaterThanOrEqual((0, date_fns_tz_1.toZonedTime)(currentTime, UTC).getTime());
            (0, globals_1.expect)(report?.lastMessageText).toBe('Current User Comment 3');
            const USER_1_BASE_ACTION = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                actorAccountID: USER_1_ACCOUNT_ID,
                automatic: false,
                avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
                person: [{ type: 'TEXT', style: 'strong', text: 'Test User' }],
                shouldShow: true,
                created: DateUtils_1.default.getDBTime(Date.now() - 3),
            };
            const optimisticReportActions = {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
                value: {
                    200: {
                        ...USER_1_BASE_ACTION,
                        message: [{ type: 'COMMENT', html: 'Current User Comment 1', text: 'Current User Comment 1' }],
                        created: DateUtils_1.default.getDBTime(Date.now() - 2),
                        reportActionID: '200',
                    },
                    300: {
                        ...USER_1_BASE_ACTION,
                        message: [{ type: 'COMMENT', html: 'Current User Comment 2', text: 'Current User Comment 2' }],
                        created: DateUtils_1.default.getDBTime(Date.now() - 1),
                        reportActionID: '300',
                    },
                    400: {
                        ...USER_1_BASE_ACTION,
                        message: [{ type: 'COMMENT', html: 'Current User Comment 3', text: 'Current User Comment 3' }],
                        created: DateUtils_1.default.getDBTime(),
                        reportActionID: '400',
                    },
                },
            };
            reportActionCreatedDate = DateUtils_1.default.getDBTime();
            const optimisticReportActionsValue = optimisticReportActions.value;
            if (optimisticReportActionsValue?.[400]) {
                optimisticReportActionsValue[400].created = reportActionCreatedDate;
            }
            // When we emit the events for these pending created actions to update them to not pending
            PusherHelper_1.default.emitOnyxUpdate([
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`,
                    value: {
                        reportID: REPORT_ID,
                        participants: {
                            [USER_1_ACCOUNT_ID]: {
                                notificationPreference: 'always',
                            },
                        },
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
            .then(() => {
            // If the user deletes a comment that is before the last read
            Report.deleteReportComment(REPORT_ID, { ...reportActions[200] });
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Then no change will occur
            (0, globals_1.expect)(report?.lastReadTime).toBe(reportActionCreatedDate);
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            // When the user manually marks a message as "unread"
            Report.markCommentAsUnread(REPORT_ID, reportActions[400]);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Then we should expect the report to be to be unread
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(true);
            (0, globals_1.expect)(report?.lastReadTime).toBe(DateUtils_1.default.subtractMillisecondsFromDateTime(reportActions[400].created, 1));
            // If the user deletes the last comment after the lastReadTime the lastMessageText will reflect the new last comment
            Report.deleteReportComment(REPORT_ID, { ...reportActions[400] });
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            (0, globals_1.expect)(ReportUtils.isUnread(report, undefined)).toBe(false);
            (0, globals_1.expect)(report?.lastMessageText).toBe('Current User Comment 2');
        });
        (0, waitForBatchedUpdates_1.default)(); // flushing onyx.set as it will be batched
        return setPromise;
    });
    (0, globals_1.it)('Should properly update comment with links', () => {
        /* This tests a variety of scenarios when a user edits a comment.
         * We should generate a link when editing a message unless the link was
         * already in the comment and the user deleted it on purpose.
         */
        global.fetch = TestHelper.getGlobalFetchMock();
        // User edits comment to add link
        // We should generate link
        let originalCommentMarkdown = 'Original Comment';
        let afterEditCommentText = 'Original Comment www.google.com';
        let newCommentHTML = Report.handleUserDeletedLinksInHtml(afterEditCommentText, originalCommentMarkdown);
        let expectedOutput = 'Original Comment <a href="https://www.google.com" target="_blank" rel="noreferrer noopener">www.google.com</a>';
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
    (0, globals_1.it)('should show a notification for report action updates with shouldNotify', () => {
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const REPORT_ACTION = {
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
        };
        // Setup user and pusher listeners
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID)
            .then(waitForBatchedUpdates_1.default)
            .then(() => {
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Simulate a Pusher Onyx update with a report action with shouldNotify
            PusherHelper_1.default.emitOnyxUpdate([
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
                    value: {
                        1: REPORT_ACTION,
                    },
                    shouldNotify: true,
                },
            ]);
            return SequentialQueue.getCurrentRequest().then(waitForBatchedUpdates_1.default);
        })
            .then(() => {
            // Ensure we show a notification for this new report action
            (0, globals_1.expect)(Report.showReportActionNotification).toBeCalledWith(REPORT_ID, REPORT_ACTION);
        });
    });
    (0, globals_1.it)('should properly toggle reactions on a message', () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const TEST_USER_ACCOUNT_ID = 1;
        const TEST_USER_LOGIN = 'test@test.com';
        const REPORT_ID = '1';
        const EMOJI_CODE = '👍';
        const EMOJI_SKIN_TONE = 2;
        const EMOJI_NAME = '+1';
        const EMOJI = {
            code: EMOJI_CODE,
            name: EMOJI_NAME,
            types: ['👍🏿', '👍🏾', '👍🏽', '👍🏼', '👍🏻'],
        };
        let reportActions;
        react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (val) => (reportActions = val ?? {}),
        });
        const reportActionsReactions = {};
        react_native_onyx_1.default.connect({
            key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS,
            callback: (val, key) => {
                reportActionsReactions[key] = val ?? {};
            },
        });
        let reportAction;
        let reportActionID;
        // Set up Onyx with some test user data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(() => {
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => TestHelper.setPersonalDetails(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID))
            .then(() => {
            // This is a fire and forget response, but once it completes we should be able to verify that we
            // have an "optimistic" report action in Onyx.
            Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            reportAction = Object.values(reportActions).at(0);
            reportActionID = reportAction?.reportActionID;
            if (reportAction) {
                // Add a reaction to the comment
                Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionsReactions[0]);
            }
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            reportAction = Object.values(reportActions).at(0);
            // Expect the reaction to exist in the reportActionsReactions collection
            (0, globals_1.expect)(reportActionsReactions).toHaveProperty(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`);
            // Expect the reaction to have the emoji on it
            const reportActionReaction = reportActionsReactions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`];
            (0, globals_1.expect)(reportActionReaction).toHaveProperty(EMOJI.name);
            // Expect the emoji to have the user accountID
            const reportActionReactionEmoji = reportActionReaction?.[EMOJI.name];
            (0, globals_1.expect)(reportActionReactionEmoji?.users).toHaveProperty(`${TEST_USER_ACCOUNT_ID}`);
            if (reportAction) {
                // Now we remove the reaction
                Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionReaction);
            }
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Expect the reaction to have null where the users reaction used to be
            (0, globals_1.expect)(reportActionsReactions).toHaveProperty(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`);
            const reportActionReaction = reportActionsReactions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`];
            (0, globals_1.expect)(reportActionReaction?.[EMOJI.name].users[TEST_USER_ACCOUNT_ID]).toBeUndefined();
        })
            .then(() => {
            reportAction = Object.values(reportActions).at(0);
            if (reportAction) {
                // Add the same reaction to the same report action with a different skin tone
                Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionsReactions[0]);
            }
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                reportAction = Object.values(reportActions).at(0);
                const reportActionReaction = reportActionsReactions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`];
                if (reportAction) {
                    Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionReaction, EMOJI_SKIN_TONE);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                reportAction = Object.values(reportActions).at(0);
                // Expect the reaction to exist in the reportActionsReactions collection
                (0, globals_1.expect)(reportActionsReactions).toHaveProperty(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`);
                // Expect the reaction to have the emoji on it
                const reportActionReaction = reportActionsReactions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`];
                (0, globals_1.expect)(reportActionReaction).toHaveProperty(EMOJI.name);
                // Expect the emoji to have the user accountID
                const reportActionReactionEmoji = reportActionReaction?.[EMOJI.name];
                (0, globals_1.expect)(reportActionReactionEmoji?.users).toHaveProperty(`${TEST_USER_ACCOUNT_ID}`);
                // Expect two different skin tone reactions
                const reportActionReactionEmojiUserSkinTones = reportActionReactionEmoji?.users[TEST_USER_ACCOUNT_ID].skinTones;
                (0, globals_1.expect)(reportActionReactionEmojiUserSkinTones).toHaveProperty('-1');
                (0, globals_1.expect)(reportActionReactionEmojiUserSkinTones).toHaveProperty('2');
                if (reportAction) {
                    // Now we remove the reaction, and expect that both variations are removed
                    Report.toggleEmojiReaction(REPORT_ID, reportAction, EMOJI, reportActionReaction);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                // Expect the reaction to have null where the users reaction used to be
                (0, globals_1.expect)(reportActionsReactions).toHaveProperty(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`);
                const reportActionReaction = reportActionsReactions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`];
                (0, globals_1.expect)(reportActionReaction?.[EMOJI.name].users[TEST_USER_ACCOUNT_ID]).toBeUndefined();
            });
        });
    });
    (0, globals_1.it)("shouldn't add the same reaction twice when changing preferred skin color and reaction doesn't support skin colors", () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const TEST_USER_ACCOUNT_ID = 1;
        const TEST_USER_LOGIN = 'test@test.com';
        const REPORT_ID = '1';
        const EMOJI_CODE = '😄';
        const EMOJI_NAME = 'smile';
        const EMOJI = {
            code: EMOJI_CODE,
            name: EMOJI_NAME,
        };
        let reportActions = {};
        react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (val) => (reportActions = val ?? {}),
        });
        const reportActionsReactions = {};
        react_native_onyx_1.default.connect({
            key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS,
            callback: (val, key) => {
                reportActionsReactions[key] = val ?? {};
            },
        });
        let resultAction;
        // Set up Onyx with some test user data
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN)
            .then(() => {
            User.subscribeToUserEvents();
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => TestHelper.setPersonalDetails(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID))
            .then(() => {
            // This is a fire and forget response, but once it completes we should be able to verify that we
            // have an "optimistic" report action in Onyx.
            Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            resultAction = Object.values(reportActions).at(0);
            if (resultAction) {
                // Add a reaction to the comment
                Report.toggleEmojiReaction(REPORT_ID, resultAction, EMOJI, {});
            }
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            resultAction = Object.values(reportActions).at(0);
            // Now we toggle the reaction while the skin tone has changed.
            // As the emoji doesn't support skin tones, the emoji
            // should get removed instead of added again.
            const reportActionReaction = reportActionsReactions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${resultAction?.reportActionID}`];
            if (resultAction) {
                Report.toggleEmojiReaction(REPORT_ID, resultAction, EMOJI, reportActionReaction, 2);
            }
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Expect the reaction to have null where the users reaction used to be
            (0, globals_1.expect)(reportActionsReactions).toHaveProperty(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${resultAction?.reportActionID}`);
            const reportActionReaction = reportActionsReactions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${resultAction?.reportActionID}`];
            (0, globals_1.expect)(reportActionReaction?.[EMOJI.name].users[TEST_USER_ACCOUNT_ID]).toBeUndefined();
        });
    });
    (0, globals_1.it)('should send only one OpenReport, replacing any extra ones with same reportIDs', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const REPORT_ID = '1';
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        await (0, waitForBatchedUpdates_1.default)();
        for (let i = 0; i < 5; i++) {
            Report.openReport(REPORT_ID, undefined, ['test@user.com'], {
                reportID: REPORT_ID,
            });
        }
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.OPEN_REPORT, 1);
    });
    (0, globals_1.it)('should replace duplicate OpenReport commands with the same reportID', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const REPORT_ID = '1';
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        await (0, waitForBatchedUpdates_1.default)();
        for (let i = 0; i < 8; i++) {
            let reportID = REPORT_ID;
            if (i > 4) {
                reportID = `${i}`;
            }
            Report.openReport(reportID, undefined, ['test@user.com'], {
                reportID: REPORT_ID,
            });
        }
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(4);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.OPEN_REPORT, 4);
    });
    (0, globals_1.it)('should remove AddComment and UpdateComment without sending any request when DeleteComment is set', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
        const created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
        // Need the reportActionID to delete the comments
        const newComment = PersistedRequests.getAll().at(0);
        const reportActionID = newComment?.data?.reportActionID;
        const newReportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
        Report.editReportComment(REPORT_ID, newReportAction, 'Testing an edited comment');
        await (0, waitForBatchedUpdates_1.default)();
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                callback: (persistedRequests) => {
                    react_native_onyx_1.default.disconnect(connection);
                    (0, globals_1.expect)(persistedRequests?.at(0)?.command).toBe(types_1.WRITE_COMMANDS.ADD_COMMENT);
                    (0, globals_1.expect)(persistedRequests?.at(1)?.command).toBeUndefined();
                    resolve();
                },
            });
        });
        // Checking the Report Action exists before deleting it
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
                callback: (reportActions) => {
                    react_native_onyx_1.default.disconnect(connection);
                    const reportAction = reportActionID ? reportActions?.[reportActionID] : null;
                    (0, globals_1.expect)(reportAction).not.toBeNull();
                    (0, globals_1.expect)(reportAction?.reportActionID).toBe(reportActionID);
                    resolve();
                },
            });
        });
        Report.deleteReportComment(REPORT_ID, newReportAction);
        await (0, waitForBatchedUpdates_1.default)();
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(0);
        // Checking the Report Action doesn't exist after deleting it
        const connection = react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (reportActions) => {
                react_native_onyx_1.default.disconnect(connection);
                const reportAction = reportActionID ? reportActions?.[reportActionID] : undefined;
                (0, globals_1.expect)(reportAction).toBeUndefined();
            },
        });
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        // Checking no requests were or will be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.UPDATE_COMMENT, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 0);
    });
    (0, globals_1.it)('should send DeleteComment request and remove UpdateComment accordingly', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
        const created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
        // Need the reportActionID to delete the comments
        const newComment = PersistedRequests.getAll().at(1);
        const reportActionID = newComment?.data?.reportActionID;
        const reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        Report.editReportComment(REPORT_ID, reportAction, 'Testing an edited comment');
        await (0, waitForBatchedUpdates_1.default)();
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                callback: (persistedRequests) => {
                    react_native_onyx_1.default.disconnect(connection);
                    (0, globals_1.expect)(persistedRequests?.at(0)?.command).toBe(types_1.WRITE_COMMANDS.UPDATE_COMMENT);
                    resolve();
                },
            });
        });
        Report.deleteReportComment(REPORT_ID, reportAction);
        await (0, waitForBatchedUpdates_1.default)();
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        // Checking no requests were or will be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 1);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.UPDATE_COMMENT, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 1);
    });
    (0, globals_1.it)('should send DeleteComment request after AddComment is rollback', async () => {
        global.fetch = jest.fn().mockRejectedValue(new TypeError(CONST_1.default.ERROR.FAILED_TO_FETCH));
        const mockedXhr = jest.fn();
        mockedXhr.mockImplementation(originalXHR);
        HttpUtils_1.default.xhr = mockedXhr;
        await (0, waitForBatchedUpdates_1.default)();
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
        const created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
        await (0, waitForNetworkPromises_1.default)();
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
        (0, globals_1.expect)(PersistedRequests.getAll().at(0)?.isRollback).toBeTruthy();
        const newComment = PersistedRequests.getAll().at(1);
        const reportActionID = newComment?.data?.reportActionID;
        const reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
        await (0, waitForBatchedUpdates_1.default)();
        HttpUtils_1.default.xhr = mockedXhr
            .mockImplementationOnce(() => Promise.resolve({
            jsonCode: CONST_1.default.JSON_CODE.EXP_ERROR,
        }))
            .mockImplementation(() => Promise.resolve({
            jsonCode: CONST_1.default.JSON_CODE.SUCCESS,
        }));
        Report.deleteReportComment(REPORT_ID, reportAction);
        jest.runOnlyPendingTimers();
        await (0, waitForBatchedUpdates_1.default)();
        const httpCalls = HttpUtils_1.default.xhr.mock.calls;
        const addCommentCalls = httpCalls.filter(([command]) => command === 'AddComment');
        const deleteCommentCalls = httpCalls.filter(([command]) => command === 'DeleteComment');
        if (httpCalls.length === 3) {
            (0, globals_1.expect)(addCommentCalls).toHaveLength(2);
            (0, globals_1.expect)(deleteCommentCalls).toHaveLength(1);
        }
    });
    (0, globals_1.it)('should send not DeleteComment request and remove AddAttachment accordingly', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
        const created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        const file = new File([''], 'test.txt', { type: 'text/plain' });
        Report.addAttachment(REPORT_ID, file, CONST_1.default.DEFAULT_TIME_ZONE);
        // Need the reportActionID to delete the comments
        const newComment = PersistedRequests.getAll().at(0);
        const reportActionID = newComment?.data?.reportActionID;
        const newReportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
        // wait for Onyx.connect execute the callback and start processing the queue
        await (0, waitForBatchedUpdates_1.default)();
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                callback: (persistedRequests) => {
                    react_native_onyx_1.default.disconnect(connection);
                    (0, globals_1.expect)(persistedRequests?.at(0)?.command).toBe(types_1.WRITE_COMMANDS.ADD_ATTACHMENT);
                    resolve();
                },
            });
        });
        // Checking the Report Action exists before deleting it
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
                callback: (reportActions) => {
                    react_native_onyx_1.default.disconnect(connection);
                    const reportAction = reportActionID ? reportActions?.[reportActionID] : null;
                    (0, globals_1.expect)(reportAction).not.toBeNull();
                    (0, globals_1.expect)(reportAction?.reportActionID).toBe(reportActionID);
                    resolve();
                },
            });
        });
        Report.deleteReportComment(REPORT_ID, newReportAction);
        await (0, waitForBatchedUpdates_1.default)();
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(0);
        // Checking the Report Action doesn't exist after deleting it
        const connection = react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (reportActions) => {
                react_native_onyx_1.default.disconnect(connection);
                const reportAction = reportActionID ? reportActions?.[reportActionID] : undefined;
                (0, globals_1.expect)(reportAction).toBeUndefined();
            },
        });
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        // Checking no requests were or will be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_ATTACHMENT, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 0);
    });
    (0, globals_1.it)('should send not DeleteComment request and remove AddTextAndAttachment accordingly', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
        const created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        const file = new File([''], 'test.txt', { type: 'text/plain' });
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        Report.addAttachment(REPORT_ID, file, CONST_1.default.DEFAULT_TIME_ZONE, 'Attachment with comment');
        // Need the reportActionID to delete the comments
        const newComment = PersistedRequests.getAll().at(0);
        const reportActionID = newComment?.data?.reportActionID;
        const newReportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
        // wait for Onyx.connect execute the callback and start processing the queue
        await (0, waitForBatchedUpdates_1.default)();
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                callback: (persistedRequests) => {
                    react_native_onyx_1.default.disconnect(connection);
                    (0, globals_1.expect)(persistedRequests?.at(0)?.command).toBe(types_1.WRITE_COMMANDS.ADD_TEXT_AND_ATTACHMENT);
                    resolve();
                },
            });
        });
        // Checking the Report Action exists before deleting it
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
                callback: (reportActions) => {
                    react_native_onyx_1.default.disconnect(connection);
                    const reportAction = reportActionID ? reportActions?.[reportActionID] : null;
                    (0, globals_1.expect)(reportAction).not.toBeNull();
                    (0, globals_1.expect)(reportAction?.reportActionID).toBe(reportActionID);
                    resolve();
                },
            });
        });
        Report.deleteReportComment(REPORT_ID, newReportAction);
        await (0, waitForBatchedUpdates_1.default)();
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(0);
        // Checking the Report Action doesn't exist after deleting it
        const connection = react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (reportActions) => {
                react_native_onyx_1.default.disconnect(connection);
                const reportAction = reportActionID ? reportActions?.[reportActionID] : undefined;
                (0, globals_1.expect)(reportAction).toBeUndefined();
            },
        });
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        // Checking no requests were or will be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_TEXT_AND_ATTACHMENT, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 0);
    });
    (0, globals_1.it)('should not send DeleteComment request and remove any Reactions accordingly', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        jest.doMock('@libs/EmojiUtils', () => ({
            ...jest.requireActual('@libs/EmojiUtils'),
            hasAccountIDEmojiReacted: jest.fn(() => true),
        }));
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
        const created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        await Promise.resolve();
        Report.addComment(REPORT_ID, 'reactions with comment', CONST_1.default.DEFAULT_TIME_ZONE);
        // Need the reportActionID to delete the comments
        const newComment = PersistedRequests.getAll().at(0);
        const reportActionID = newComment?.data?.reportActionID;
        const newReportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
        await (0, waitForBatchedUpdates_1.default)();
        Report.toggleEmojiReaction(REPORT_ID, newReportAction, { name: 'smile', code: '😄' }, {});
        Report.toggleEmojiReaction(REPORT_ID, newReportAction, { name: 'smile', code: '😄' }, {
            smile: {
                createdAt: '2024-10-14 14:58:12',
                oldestTimestamp: '2024-10-14 14:58:12',
                users: {
                    [`${TEST_USER_ACCOUNT_ID}`]: {
                        id: `${TEST_USER_ACCOUNT_ID}`,
                        oldestTimestamp: '2024-10-14 14:58:12',
                        skinTones: {
                            '-1': '2024-10-14 14:58:12',
                        },
                    },
                },
            },
        });
        await (0, waitForBatchedUpdates_1.default)();
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                callback: (persistedRequests) => {
                    react_native_onyx_1.default.disconnect(connection);
                    (0, globals_1.expect)(persistedRequests?.at(0)?.command).toBe(types_1.WRITE_COMMANDS.ADD_COMMENT);
                    (0, globals_1.expect)(persistedRequests?.at(1)?.command).toBe(types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION);
                    (0, globals_1.expect)(persistedRequests?.at(2)?.command).toBe(types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION);
                    resolve();
                },
            });
        });
        // Checking the Report Action exists before deleting it
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
                callback: (reportActions) => {
                    react_native_onyx_1.default.disconnect(connection);
                    const reportAction = reportActionID ? reportActions?.[reportActionID] : null;
                    (0, globals_1.expect)(reportAction).not.toBeNull();
                    (0, globals_1.expect)(reportAction?.reportActionID).toBe(reportActionID);
                    resolve();
                },
            });
        });
        Report.deleteReportComment(REPORT_ID, newReportAction);
        await (0, waitForBatchedUpdates_1.default)();
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(0);
        // Checking the Report Action doesn't exist after deleting it
        const connection = react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (reportActions) => {
                react_native_onyx_1.default.disconnect(connection);
                const reportAction = reportActionID ? reportActions?.[reportActionID] : undefined;
                (0, globals_1.expect)(reportAction).toBeUndefined();
            },
        });
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        // Checking no requests were or will be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 0);
    });
    (0, globals_1.it)('should send DeleteComment request and remove any Reactions accordingly', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        jest.doMock('@libs/EmojiUtils', () => ({
            ...jest.requireActual('@libs/EmojiUtils'),
            hasAccountIDEmojiReacted: jest.fn(() => true),
        }));
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
        const created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        Report.addComment(REPORT_ID, 'Attachment with comment', CONST_1.default.DEFAULT_TIME_ZONE);
        // Need the reportActionID to delete the comments
        const newComment = PersistedRequests.getAll().at(0);
        const reportActionID = newComment?.data?.reportActionID;
        const reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        // wait for Onyx.connect execute the callback and start processing the queue
        await Promise.resolve();
        Report.toggleEmojiReaction(REPORT_ID, reportAction, { name: 'smile', code: '😄' }, {});
        Report.toggleEmojiReaction(REPORT_ID, reportAction, { name: 'smile', code: '😄' }, {
            smile: {
                createdAt: '2024-10-14 14:58:12',
                oldestTimestamp: '2024-10-14 14:58:12',
                users: {
                    [`${TEST_USER_ACCOUNT_ID}`]: {
                        id: `${TEST_USER_ACCOUNT_ID}`,
                        oldestTimestamp: '2024-10-14 14:58:12',
                        skinTones: {
                            '-1': '2024-10-14 14:58:12',
                        },
                    },
                },
            },
        });
        await (0, waitForBatchedUpdates_1.default)();
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                callback: (persistedRequests) => {
                    react_native_onyx_1.default.disconnect(connection);
                    (0, globals_1.expect)(persistedRequests?.at(0)?.command).toBe(types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION);
                    (0, globals_1.expect)(persistedRequests?.at(1)?.command).toBe(types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION);
                    resolve();
                },
            });
        });
        Report.deleteReportComment(REPORT_ID, reportAction);
        await (0, waitForBatchedUpdates_1.default)();
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        // Checking no requests were or will be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 1);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION, 0);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 1);
    });
    (0, globals_1.it)('should create and delete thread processing all the requests', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
        const created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        await (0, waitForBatchedUpdates_1.default)();
        Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
        const newComment = PersistedRequests.getAll().at(0);
        const reportActionID = newComment?.data?.reportActionID;
        const reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
        Report.openReport(REPORT_ID, undefined, ['test@user.com'], {
            parentReportID: REPORT_ID,
            parentReportActionID: reportActionID,
            reportID: '2',
        }, reportActionID);
        Report.deleteReportComment(REPORT_ID, reportAction);
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(3);
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                callback: (persistedRequests) => {
                    if (persistedRequests?.length !== 3) {
                        return;
                    }
                    react_native_onyx_1.default.disconnect(connection);
                    (0, globals_1.expect)(persistedRequests?.at(0)?.command).toBe(types_1.WRITE_COMMANDS.ADD_COMMENT);
                    (0, globals_1.expect)(persistedRequests?.at(1)?.command).toBe(types_1.WRITE_COMMANDS.OPEN_REPORT);
                    (0, globals_1.expect)(persistedRequests?.at(2)?.command).toBe(types_1.WRITE_COMMANDS.DELETE_COMMENT);
                    resolve();
                },
            });
        });
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        // Checking no requests were or will be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 1);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.OPEN_REPORT, 1);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.DELETE_COMMENT, 1);
    });
    (0, globals_1.it)('should update AddComment text with the UpdateComment text, sending just an AddComment request', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const TEST_USER_ACCOUNT_ID = 1;
        const REPORT_ID = '1';
        const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
        const created = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        Report.addComment(REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
        // Need the reportActionID to delete the comments
        const newComment = PersistedRequests.getAll().at(0);
        const reportActionID = newComment?.data?.reportActionID;
        const reportAction = TestHelper.buildTestReportComment(created, TEST_USER_ACCOUNT_ID, reportActionID);
        Report.editReportComment(REPORT_ID, reportAction, 'Testing an edited comment');
        await (0, waitForBatchedUpdates_1.default)();
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
                callback: (persistedRequests) => {
                    react_native_onyx_1.default.disconnect(connection);
                    (0, globals_1.expect)(persistedRequests?.at(0)?.command).toBe(types_1.WRITE_COMMANDS.ADD_COMMENT);
                    resolve();
                },
            });
        });
        await (0, waitForBatchedUpdates_1.default)();
        (0, globals_1.expect)(PersistedRequests.getAll().length).toBe(1);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        await (0, waitForBatchedUpdates_1.default)();
        // Checking no requests were or will be made
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.ADD_COMMENT, 1);
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.UPDATE_COMMENT, 0);
    });
    (0, globals_1.it)('it should only send the last sequential UpdateComment request to BE', async () => {
        global.fetch = TestHelper.getGlobalFetchMock();
        const reportID = '123';
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        const action = {
            reportID,
            reportActionID: '722',
            actionName: 'ADDCOMMENT',
            created: '2024-10-21 10:37:59.881',
        };
        Report.editReportComment(reportID, action, 'value1');
        Report.editReportComment(reportID, action, 'value2');
        Report.editReportComment(reportID, action, 'value3');
        const requests = PersistedRequests?.getAll();
        (0, globals_1.expect)(requests.length).toBe(1);
        (0, globals_1.expect)(requests?.at(0)?.command).toBe(types_1.WRITE_COMMANDS.UPDATE_COMMENT);
        (0, globals_1.expect)(requests?.at(0)?.data?.reportComment).toBe('value3');
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        TestHelper.expectAPICommandToHaveBeenCalled(types_1.WRITE_COMMANDS.UPDATE_COMMENT, 1);
    });
    (0, globals_1.it)('should clears lastMentionedTime when all mentions to the current user are deleted', async () => {
        const reportID = '1';
        const mentionActionID = '1';
        const mentionActionID2 = '2';
        const currentUserAccountID = 123;
        const mentionAction = {
            ...(0, reportActions_1.default)(Number(mentionActionID)),
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            originalMessage: {
                mentionedAccountIDs: [currentUserAccountID],
            },
        };
        const mentionAction2 = {
            ...(0, reportActions_1.default)(Number(mentionActionID2)),
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            originalMessage: {
                mentionedAccountIDs: [currentUserAccountID],
            },
        };
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: currentUserAccountID });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
            [mentionActionID]: mentionAction,
            [mentionActionID2]: mentionAction2,
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
            ...(0, reports_1.createRandomReport)(Number(reportID)),
            lastMentionedTime: mentionAction2.created,
        });
        Report.deleteReportComment(reportID, mentionAction);
        Report.deleteReportComment(reportID, mentionAction2);
        await (0, waitForBatchedUpdates_1.default)();
        const report = await new Promise((resolve) => {
            react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                callback: resolve,
            });
        });
        (0, globals_1.expect)(report?.lastMentionedTime).toBeUndefined();
    });
    (0, globals_1.it)('should create new report and "create report" quick action, when createNewReport gets called', async () => {
        const accountID = 1234;
        const policyID = '5678';
        const mockFetchData = fetch;
        // Given a policy with harvesting is disabled
        const policy = {
            ...(0, policies_1.default)(Number(policyID)),
            isPolicyExpenseChatEnabled: true,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            harvesting: {
                enabled: false,
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, policy);
        mockFetchData.pause();
        const reportID = Report.createNewReport({ accountID }, policyID);
        const parentReport = ReportUtils.getPolicyExpenseChat(accountID, policyID);
        const reportPreviewAction = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport?.reportID}`,
                callback: (reportActions) => {
                    react_native_onyx_1.default.disconnect(connection);
                    const action = Object.values(reportActions ?? {}).at(0);
                    resolve(action);
                },
            });
        });
        (0, globals_1.expect)((0, ReportActionsUtils_1.getOriginalMessage)(reportPreviewAction)?.linkedReportID).toBe(reportID);
        (0, globals_1.expect)(reportPreviewAction?.actorAccountID).toBe(accountID);
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (reports) => {
                    react_native_onyx_1.default.disconnect(connection);
                    const createdReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
                    const parentPolicyExpenseChat = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport?.reportID}`];
                    // assert correctness of crucial onyx data
                    (0, globals_1.expect)(createdReport?.reportID).toBe(reportID);
                    (0, globals_1.expect)(parentPolicyExpenseChat?.lastVisibleActionCreated).toBe(reportPreviewAction?.created);
                    (0, globals_1.expect)(parentPolicyExpenseChat?.hasOutstandingChildRequest).toBe(true);
                    (0, globals_1.expect)(createdReport?.total).toBe(0);
                    (0, globals_1.expect)(createdReport?.parentReportActionID).toBe(reportPreviewAction?.reportActionID);
                    resolve();
                },
            });
        });
        // When the request fails
        mockFetchData.fail();
        await mockFetchData.resume();
        await (0, waitForBatchedUpdates_1.default)();
        // Then the onyx data should be reverted to the state before the request
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (reports) => {
                    react_native_onyx_1.default.disconnect(connection);
                    const parentPolicyExpenseChat = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport?.reportID}`];
                    (0, globals_1.expect)(parentPolicyExpenseChat?.hasOutstandingChildRequest).toBe(parentReport?.hasOutstandingChildRequest);
                    resolve();
                },
            });
        });
    });
    (0, globals_1.it)('should not optimistic outstandingChildRequest when create report with harvesting is enabled', async () => {
        const accountID = 1234;
        const policyID = '5678';
        // Given a policy with harvesting is enabled
        const policy = {
            ...(0, policies_1.default)(Number(policyID)),
            isPolicyExpenseChatEnabled: true,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            harvesting: {
                enabled: true,
            },
        };
        const parentReport = ReportUtils.getPolicyExpenseChat(accountID, policyID);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, policy);
        if (parentReport?.reportID) {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport?.reportID}`, parentReport);
        }
        // When create new report
        Report.createNewReport({ accountID }, policyID);
        // Then the parent report's hasOutstandingChildRequest property should remain unchanged
        await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (reports) => {
                    react_native_onyx_1.default.disconnect(connection);
                    const parentPolicyExpenseChat = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport?.reportID}`];
                    (0, globals_1.expect)(parentPolicyExpenseChat?.hasOutstandingChildRequest).toBe(parentReport?.hasOutstandingChildRequest);
                    resolve();
                },
            });
        });
    });
    (0, globals_1.describe)('completeOnboarding', () => {
        const TEST_USER_LOGIN = 'test@gmail.com';
        const TEST_USER_ACCOUNT_ID = 1;
        global.fetch = TestHelper.getGlobalFetchMock();
        (0, globals_1.it)('should set "isOptimisticAction" to false/null for all actions in admins report after completing onboarding setup', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: TEST_USER_LOGIN, accountID: TEST_USER_ACCOUNT_ID });
            await (0, waitForBatchedUpdates_1.default)();
            const adminsChatReportID = '7957055873634067';
            const onboardingPolicyID = 'A70D00C752416807';
            const engagementChoice = CONST_1.default.INTRO_CHOICES.MANAGE_TEAM;
            const { onboardingMessages } = (0, OnboardingFlow_1.getOnboardingMessages)();
            Report.completeOnboarding({
                engagementChoice,
                onboardingMessage: onboardingMessages[engagementChoice],
                adminsChatReportID,
                onboardingPolicyID,
                companySize: CONST_1.default.ONBOARDING_COMPANY_SIZE.MICRO,
                userReportedIntegration: null,
            });
            await (0, waitForBatchedUpdates_1.default)();
            const reportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
                    callback: (id) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(id);
                    },
                });
            });
            (0, globals_1.expect)(reportActions).not.toBeNull();
            (0, globals_1.expect)(reportActions).not.toBeUndefined();
            Object.values(reportActions ?? {}).forEach((action) => {
                (0, globals_1.expect)(action.isOptimisticAction).toBeFalsy();
            });
        });
    });
    (0, globals_1.describe)('markAllMessagesAsRead', () => {
        (0, globals_1.it)('should mark all unread reports as read', async () => {
            // Given a collection of 10 unread and read reports, where even-index report is unread
            const currentTime = DateUtils_1.default.getDBTime();
            const reportCollections = (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, (index) => {
                if (index % 2 === 0) {
                    return {
                        ...(0, reports_1.createRandomReport)(index),
                        lastMessageText: 'test',
                        lastReadTime: DateUtils_1.default.subtractMillisecondsFromDateTime(currentTime, 1),
                        lastVisibleActionCreated: currentTime,
                    };
                }
                return (0, reports_1.createRandomReport)(index);
            }, 10);
            await react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT, reportCollections);
            // When mark all reports as read
            Report.markAllMessagesAsRead();
            await (0, waitForBatchedUpdates_1.default)();
            // Then all report should be read
            const isUnreadCollection = await Promise.all(Object.values(reportCollections).map((report) => {
                return new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
                        callback: (reportVal) => {
                            react_native_onyx_1.default.disconnect(connection);
                            resolve(ReportUtils.isUnread(reportVal, undefined));
                        },
                    });
                });
            }));
            (0, globals_1.expect)(isUnreadCollection.some(Boolean)).toBe(false);
        });
    });
    (0, globals_1.describe)('updateDescription', () => {
        (0, globals_1.it)('should not call UpdateRoomDescription API if the description is not changed', async () => {
            global.fetch = TestHelper.getGlobalFetchMock();
            Report.updateDescription('1', '<h1>test</h1>', '# test');
            await (0, waitForBatchedUpdates_1.default)();
            (0, globals_1.expect)(global.fetch).toHaveBeenCalledTimes(0);
        });
        (0, globals_1.it)('should revert to correct previous description if UpdateRoomDescription API fails', async () => {
            const report = {
                ...(0, reports_1.createRandomReport)(1),
                description: '<h1>test</h1>',
            };
            const mockFetch = fetch;
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            mockFetch?.fail?.();
            Report.updateDescription('1', '<h1>test</h1>', '# test1');
            await (0, waitForBatchedUpdates_1.default)();
            let updateReport;
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
                callback: (val) => (updateReport = val),
            });
            (0, globals_1.expect)(updateReport?.description).toBe('<h1>test</h1>');
            mockFetch.mockReset();
        });
    });
    (0, globals_1.describe)('deleteAppReport', () => {
        (0, globals_1.it)('should only moves CREATE or TRACK type of IOU action to self DM', async () => {
            // Given an expense report with CREATE, TRACK, and PAY of IOU actions
            const reportID = '1';
            const firstIOUAction = {
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
            const secondIOUAction = {
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
            const payAction = {
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
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
                [firstIOUAction.reportActionID]: firstIOUAction,
                [secondIOUAction.reportActionID]: secondIOUAction,
                [payAction.reportActionID]: payAction,
            });
            // When deleting the expense report
            Report.deleteAppReport(reportID);
            await (0, waitForBatchedUpdates_1.default)();
            // Then only the IOU action with type of CREATE and TRACK is moved to the self DM
            const selfDMReportID = ReportUtils.findSelfDMReportID();
            const selfDMReportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReportID}`,
                    callback: (val) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(val);
                    },
                });
            });
            // The length is 3 to include the CREATED action
            (0, globals_1.expect)(Object.keys(selfDMReportActions ?? {}).length).toBe(3);
        });
        (0, globals_1.it)('should not reset the chatReport hasOutstandingChildRequest if there is another outstanding report', async () => {
            const currentUserAccountID = 1;
            const fakePolicy = {
                ...(0, policies_1.default)(6),
                role: 'admin',
                ownerAccountID: currentUserAccountID,
                areRulesEnabled: true,
                preventSelfApproval: false,
                autoReportingFrequency: 'immediate',
                harvesting: {
                    enabled: false,
                },
            };
            const chatReport = { ...(0, reports_1.createRandomReport)(11), policyID: fakePolicy.id, chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, hasOutstandingChildRequest: true };
            const expenseReport1 = {
                ...(0, reports_1.createRandomReport)(5),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                managerID: currentUserAccountID,
                ownerAccountID: currentUserAccountID,
                policyID: fakePolicy.id,
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                chatReportID: chatReport.reportID,
                parentReportID: chatReport.reportID,
            };
            const reportPreview1 = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                originalMessage: {
                    linkedReportID: expenseReport1.reportID,
                },
            };
            const expenseReport2 = {
                ...(0, reports_1.createRandomReport)(6),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                managerID: currentUserAccountID,
                ownerAccountID: currentUserAccountID,
                policyID: fakePolicy.id,
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                chatReportID: chatReport.reportID,
                parentReportID: chatReport.reportID,
            };
            const transaction = { ...(0, transaction_1.default)(22), reportID: expenseReport2.reportID };
            const reportPreview2 = {
                ...(0, reportActions_1.default)(22),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                originalMessage: {
                    linkedReportID: expenseReport2.reportID,
                },
            };
            const iouAction1 = {
                reportActionID: '1',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                created: DateUtils_1.default.getDBTime(),
                originalMessage: {
                    amount: 100,
                    currency: CONST_1.default.CURRENCY.USD,
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                },
            };
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: currentUserAccountID });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport1.reportID}`, {
                [iouAction1.reportActionID]: iouAction1,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`, {
                [reportPreview1.reportActionID]: reportPreview1,
                [reportPreview2.reportActionID]: reportPreview2,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`, chatReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport1.reportID}`, expenseReport1);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport2.reportID}`, expenseReport2);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`, transaction);
            // When deleting the first expense report
            Report.deleteAppReport(expenseReport1.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            const report = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
                    callback: (val) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(val);
                    },
                });
            });
            // The hasOutstandingChildRequest should still remain true as there is a second outstanding report.
            (0, globals_1.expect)(report?.hasOutstandingChildRequest).toBe(true);
        });
    });
    (0, globals_1.describe)('changeReportPolicy', () => {
        (0, globals_1.it)('should unarchive the expense report', async () => {
            // Given an archived expense report
            const expenseReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: '1',
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${expenseReport.reportID}`, {
                private_isArchived: DateUtils_1.default.getDBTime(),
            });
            const newPolicy = (0, policies_1.default)(2);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`, newPolicy);
            // When moving to another workspace
            Report.changeReportPolicy(expenseReport, newPolicy);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the expense report should not be archived anymore
            const isArchived = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${expenseReport.reportID}`,
                    callback: (val) => {
                        resolve(!!val?.private_isArchived);
                        react_native_onyx_1.default.disconnect(connection);
                    },
                });
            });
            (0, globals_1.expect)(isArchived).toBe(false);
            const snapshotData = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentHash}`,
                    callback: (val) => {
                        resolve(val);
                        react_native_onyx_1.default.disconnect(connection);
                    },
                });
            });
            // Then the new policy data should also be populated on the current search snapshot.
            (0, globals_1.expect)(snapshotData?.data?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`]).toBeDefined();
        });
    });
    (0, globals_1.describe)('changeReportPolicyAndInviteSubmitter', () => {
        (0, globals_1.it)('should unarchive the expense report', async () => {
            // Given an archived expense report
            const ownerAccountID = 1;
            const ownerEmail = 'owner@gmail.com';
            const adminEmail = 'admin@gmail.com';
            const expenseReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: '1',
                ownerAccountID,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${expenseReport.reportID}`, {
                private_isArchived: DateUtils_1.default.getDBTime(),
            });
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                [ownerAccountID]: {
                    login: ownerEmail,
                },
            });
            // When moving to another workspace
            Report.changeReportPolicyAndInviteSubmitter(expenseReport, (0, policies_1.default)(Number(2)), {
                [adminEmail]: { role: CONST_1.default.POLICY.ROLE.ADMIN },
            }, TestHelper.formatPhoneNumber);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the expense report should not be archived anymore
            const isArchived = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${expenseReport.reportID}`,
                    callback: (val) => {
                        resolve(!!val?.private_isArchived);
                        react_native_onyx_1.default.disconnect(connection);
                    },
                });
            });
            (0, globals_1.expect)(isArchived).toBe(false);
        });
    });
    (0, globals_1.describe)('buildOptimisticChangePolicyData', () => {
        (0, globals_1.it)('should build the optimistic data next step for the change policy data', () => {
            const report = {
                ...(0, reports_1.createRandomReport)(1),
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            Report.buildOptimisticChangePolicyData(report, (0, policies_1.default)(Number(1)));
            (0, globals_1.expect)(NextStepUtils_1.buildNextStep).toHaveBeenCalledWith(report, CONST_1.default.REPORT.STATUS_NUM.SUBMITTED);
        });
    });
    (0, globals_1.describe)('searchInServer', () => {
        (0, globals_1.it)('should return the same result with or without uppercase input.', () => {
            Report.searchInServer('test');
            Report.searchInServer('TEST');
            const upperCaseRequest = PersistedRequests.getAll().at(0);
            const lowerCaseRequest = PersistedRequests.getAll().at(1);
            (0, globals_1.expect)(upperCaseRequest?.data?.searchInput).toBe(lowerCaseRequest?.data?.searchInput);
        });
    });
});
