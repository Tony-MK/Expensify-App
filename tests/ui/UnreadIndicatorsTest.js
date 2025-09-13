"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const NativeNavigation = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const react_1 = require("react");
const react_native_2 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const App_1 = require("@libs/actions/App");
const IOU_1 = require("@libs/actions/IOU");
const Report_1 = require("@libs/actions/Report");
const User_1 = require("@libs/actions/User");
const CollectionUtils_1 = require("@libs/CollectionUtils");
const DateUtils_1 = require("@libs/DateUtils");
const Localize_1 = require("@libs/Localize");
const LocalNotification_1 = require("@libs/Notification/LocalNotification");
const NumberUtils_1 = require("@libs/NumberUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const FontUtils_1 = require("@styles/utils/FontUtils");
const App_2 = require("@src/App");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const PusherHelper_1 = require("../utils/PusherHelper");
const TestHelper = require("../utils/TestHelper");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
// We need a large timeout here as we are lazy loading React Navigation screens and this test is running against the entire mounted App
jest.setTimeout(60000);
jest.mock('@react-navigation/native');
jest.mock('../../src/libs/Notification/LocalNotification');
jest.mock('../../src/components/Icon/Expensicons');
jest.mock('../../src/components/ConfirmedRoute.tsx');
jest.mock('@libs/Navigation/AppNavigator/usePreloadFullScreenNavigators', () => jest.fn());
TestHelper.setupApp();
TestHelper.setupGlobalFetchMock();
beforeEach(() => {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true });
});
function scrollUpToRevealNewMessagesBadge() {
    const hintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChatMessages');
    react_native_1.fireEvent.scroll(react_native_1.screen.getByLabelText(hintText), {
        nativeEvent: {
            contentOffset: {
                y: 250,
            },
            contentSize: {
                // Dimensions of the scrollable content
                height: 500,
                width: 100,
            },
            layoutMeasurement: {
                // Dimensions of the device
                height: 700,
                width: 300,
            },
        },
    });
}
function isNewMessagesBadgeVisible() {
    const hintText = (0, Localize_1.translateLocal)('accessibilityHints.scrollToNewestMessages');
    const badge = react_native_1.screen.queryByAccessibilityHint(hintText);
    const badgeProps = badge?.props;
    const transformStyle = badgeProps.style.transform?.[0];
    return Math.round(transformStyle.translateY) === -40;
}
function navigateToSidebar() {
    const hintText = (0, Localize_1.translateLocal)('accessibilityHints.navigateToChatsList');
    const reportHeaderBackButton = react_native_1.screen.queryByAccessibilityHint(hintText);
    if (reportHeaderBackButton) {
        (0, react_native_1.fireEvent)(reportHeaderBackButton, 'press');
    }
    return (0, waitForBatchedUpdates_1.default)();
}
function areYouOnChatListScreen() {
    const hintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
    const sidebarLinks = react_native_1.screen.queryAllByLabelText(hintText, { includeHiddenElements: true });
    return !sidebarLinks?.at(0)?.props?.accessibilityElementsHidden;
}
const REPORT_ID = '1';
const USER_A_ACCOUNT_ID = 1;
const USER_A_EMAIL = 'user_a@test.com';
const USER_B_ACCOUNT_ID = 2;
const USER_B_EMAIL = 'user_b@test.com';
const USER_C_ACCOUNT_ID = 3;
const USER_C_EMAIL = 'user_c@test.com';
let reportAction3CreatedDate;
let reportAction9CreatedDate;
const TEN_MINUTES_AGO = (0, date_fns_1.subMinutes)(new Date(), 10);
const createdReportActionID = (0, NumberUtils_1.rand64)().toString();
const createdReportAction = {
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
    automatic: false,
    created: (0, date_fns_1.format)(TEN_MINUTES_AGO, CONST_1.default.DATE.FNS_DB_FORMAT_STRING),
    reportActionID: createdReportActionID,
    message: [
        {
            style: 'strong',
            text: '__FAKE__',
            type: 'TEXT',
        },
        {
            style: 'normal',
            text: 'created this report',
            type: 'TEXT',
        },
    ],
};
/**
 * Sets up a test with a logged in user that has one unread chat from another user. Returns the <App/> test instance.
 */
function signInAndGetAppWithUnreadChat() {
    // Render the App and sign in as a test user.
    (0, react_native_1.render)(<App_2.default />);
    return (0, waitForBatchedUpdatesWithAct_1.default)()
        .then(async () => {
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const hintText = (0, Localize_1.translateLocal)('loginForm.loginForm');
        const loginForm = react_native_1.screen.queryAllByLabelText(hintText);
        expect(loginForm).toHaveLength(1);
    })
        .then(async () => TestHelper.signInWithTestUser(USER_A_ACCOUNT_ID, USER_A_EMAIL, undefined, undefined, 'A'))
        .then(() => {
        (0, User_1.subscribeToUserEvents)();
        return (0, waitForBatchedUpdates_1.default)();
    })
        .then(async () => {
        reportAction3CreatedDate = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 30), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        reportAction9CreatedDate = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 90), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
            [USER_B_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_B_EMAIL, USER_B_ACCOUNT_ID, 'B'),
        });
        // Simulate setting an unread report and personal details
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, {
            reportID: REPORT_ID,
            reportName: CONST_1.default.REPORT.DEFAULT_REPORT_NAME,
            lastReadTime: reportAction3CreatedDate,
            lastVisibleActionCreated: reportAction9CreatedDate,
            lastMessageText: 'Test',
            participants: {
                [USER_B_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                [USER_A_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
            },
            lastActorAccountID: USER_B_ACCOUNT_ID,
            type: CONST_1.default.REPORT.TYPE.CHAT,
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`, {
            [createdReportActionID]: createdReportAction,
            1: TestHelper.buildTestReportComment((0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 10), CONST_1.default.DATE.FNS_DB_FORMAT_STRING), USER_B_ACCOUNT_ID, '1'),
            2: TestHelper.buildTestReportComment((0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 20), CONST_1.default.DATE.FNS_DB_FORMAT_STRING), USER_B_ACCOUNT_ID, '2'),
            3: TestHelper.buildTestReportComment(reportAction3CreatedDate, USER_B_ACCOUNT_ID, '3'),
            4: TestHelper.buildTestReportComment((0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 40), CONST_1.default.DATE.FNS_DB_FORMAT_STRING), USER_B_ACCOUNT_ID, '4'),
            5: TestHelper.buildTestReportComment((0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 50), CONST_1.default.DATE.FNS_DB_FORMAT_STRING), USER_B_ACCOUNT_ID, '5'),
            6: TestHelper.buildTestReportComment((0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 60), CONST_1.default.DATE.FNS_DB_FORMAT_STRING), USER_B_ACCOUNT_ID, '6'),
            7: TestHelper.buildTestReportComment((0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 70), CONST_1.default.DATE.FNS_DB_FORMAT_STRING), USER_B_ACCOUNT_ID, '7'),
            8: TestHelper.buildTestReportComment((0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 80), CONST_1.default.DATE.FNS_DB_FORMAT_STRING), USER_B_ACCOUNT_ID, '8'),
            9: TestHelper.buildTestReportComment(reportAction9CreatedDate, USER_B_ACCOUNT_ID, '9'),
        });
        // We manually setting the sidebar as loaded since the onLayout event does not fire in tests
        (0, App_1.setSidebarLoaded)();
        return (0, waitForBatchedUpdatesWithAct_1.default)();
    });
}
// Skipping this test because it is flaky and will be fixed here https://github.com/Expensify/App/issues/70126
describe.skip('Unread Indicators', () => {
    beforeAll(() => {
        PusherHelper_1.default.setup();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = TestHelper.getGlobalFetchMock();
        // Unsubscribe to pusher channels
        PusherHelper_1.default.teardown();
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    it('Display bold in the LHN for unread chat and new line indicator above the chat message when we navigate to it', () => signInAndGetAppWithUnreadChat()
        .then(() => {
        // Verify no notifications are created for these older messages
        expect(LocalNotification_1.default.showCommentNotification.mock.calls).toHaveLength(0);
        // Verify the sidebar links are rendered
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
        expect(sidebarLinks).toHaveLength(1);
        // Verify there is only one option in the sidebar
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(1);
        // And that the text is bold
        const displayNameHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameText = react_native_1.screen.queryByLabelText(displayNameHintText);
        expect(displayNameText?.props?.style?.fontWeight).toBe(FontUtils_1.default.fontWeight.bold);
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(async () => {
        (0, react_native_1.act)(() => NativeNavigation.triggerTransitionEnd());
        // That the report actions are visible along with the created action
        const welcomeMessageHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatWelcomeMessage');
        const createdAction = react_native_1.screen.queryByLabelText(welcomeMessageHintText);
        expect(createdAction).toBeTruthy();
        const reportCommentsHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatMessage');
        const reportComments = react_native_1.screen.queryAllByLabelText(reportCommentsHintText);
        expect(reportComments).toHaveLength(9);
        // Since the last read timestamp is the timestamp of action 3 we should have an unread indicator above the next "unread" action which will
        // have actionID of 4
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(1);
        const reportActionID = unreadIndicator.at(0)?.props?.['data-action-id'];
        expect(reportActionID).toBe('4');
        // Scroll up and verify that the "New messages" badge appears
        scrollUpToRevealNewMessagesBadge();
        return (0, react_native_1.waitFor)(() => expect(isNewMessagesBadgeVisible()).toBe(true));
    }));
    it('Clear the new line indicator and bold when we navigate away from a chat that is now read', () => signInAndGetAppWithUnreadChat()
        // Navigate to the unread chat from the sidebar
        .then(() => (0, TestHelper_1.navigateToSidebarOption)(0))
        .then(() => {
        (0, react_native_1.act)(() => NativeNavigation.triggerTransitionEnd());
        // Verify the unread indicator is present
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(1);
    })
        .then(() => {
        expect(areYouOnChatListScreen()).toBe(false);
        // Then navigate back to the sidebar
        return navigateToSidebar();
    })
        .then(() => {
        // Verify the LHN is now open
        expect(areYouOnChatListScreen()).toBe(true);
        // Tap on the chat again
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(() => {
        // Sending event to clear the unread indicator cache, given that the test doesn't behave as the app
        react_native_2.DeviceEventEmitter.emit(`unreadAction_${REPORT_ID}`, (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_DB_FORMAT_STRING));
        return (0, waitForBatchedUpdatesWithAct_1.default)();
    })
        .then(() => {
        // Verify the unread indicator is not present
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(0);
        // Tap on the chat again
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(() => {
        // Verify the unread indicator is not present
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(0);
        expect(areYouOnChatListScreen()).toBe(false);
    }));
    it('Shows a browser notification and bold text when a new message arrives for a chat that is read', () => signInAndGetAppWithUnreadChat()
        .then(() => {
        // Simulate a new report arriving via Pusher along with reportActions and personalDetails for the other participant
        // We set the created date 5 seconds in the past to ensure that time has passed when we open the report
        const NEW_REPORT_ID = '2';
        const NEW_REPORT_CREATED_DATE = (0, date_fns_1.subSeconds)(new Date(), 5);
        const NEW_REPORT_FIST_MESSAGE_CREATED_DATE = (0, date_fns_1.addSeconds)(NEW_REPORT_CREATED_DATE, 1);
        const createdReportActionIDLocal = (0, NumberUtils_1.rand64)();
        const commentReportActionID = (0, NumberUtils_1.rand64)();
        PusherHelper_1.default.emitOnyxUpdate([
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${NEW_REPORT_ID}`,
                value: {
                    reportID: NEW_REPORT_ID,
                    reportName: CONST_1.default.REPORT.DEFAULT_REPORT_NAME,
                    lastReadTime: '',
                    lastVisibleActionCreated: DateUtils_1.default.getDBTime((0, date_fns_tz_1.toZonedTime)(NEW_REPORT_FIST_MESSAGE_CREATED_DATE, 'UTC').valueOf()),
                    lastMessageText: 'Comment 1',
                    lastActorAccountID: USER_C_ACCOUNT_ID,
                    participants: {
                        [USER_C_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                        [USER_A_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                    },
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${NEW_REPORT_ID}`,
                value: {
                    [createdReportActionIDLocal]: {
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                        automatic: false,
                        created: (0, date_fns_1.format)(NEW_REPORT_CREATED_DATE, CONST_1.default.DATE.FNS_DB_FORMAT_STRING),
                        reportActionID: createdReportActionIDLocal,
                    },
                    [commentReportActionID]: {
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        actorAccountID: USER_C_ACCOUNT_ID,
                        person: [{ type: 'TEXT', style: 'strong', text: 'User C' }],
                        created: (0, date_fns_1.format)(NEW_REPORT_FIST_MESSAGE_CREATED_DATE, CONST_1.default.DATE.FNS_DB_FORMAT_STRING),
                        message: [{ type: 'COMMENT', html: 'Comment 1', text: 'Comment 1' }],
                        reportActionID: commentReportActionID,
                    },
                },
                shouldNotify: true,
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                value: {
                    [USER_C_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_C_EMAIL, USER_C_ACCOUNT_ID, 'C'),
                },
            },
        ]);
        return (0, waitForBatchedUpdates_1.default)();
    })
        .then(() => {
        // Verify notification was created
        expect(LocalNotification_1.default.showCommentNotification).toHaveBeenCalled();
    })
        .then(() => {
        // // Verify the new report option appears in the LHN
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(2);
        // Verify the text for both chats are bold indicating that nothing has not yet been read
        const displayNameHintTexts = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameTexts = react_native_1.screen.queryAllByLabelText(displayNameHintTexts);
        expect(displayNameTexts).toHaveLength(2);
        const firstReportOption = displayNameTexts.at(0);
        expect(firstReportOption?.props?.style?.fontWeight).toBe(FontUtils_1.default.fontWeight.bold);
        expect(react_native_1.screen.getByText('C User')).toBeOnTheScreen();
        const secondReportOption = displayNameTexts.at(1);
        expect(secondReportOption?.props?.style?.fontWeight).toBe(FontUtils_1.default.fontWeight.bold);
        expect(react_native_1.screen.getByText('B User')).toBeOnTheScreen();
        // Tap the new report option and navigate back to the sidebar again via the back button
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(waitForBatchedUpdates_1.default)
        .then(() => {
        (0, react_native_1.act)(() => NativeNavigation.triggerTransitionEnd());
        // Verify that report we navigated to appears in a "read" state while the original unread report still shows as unread
        const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameTexts = react_native_1.screen.queryAllByLabelText(hintText, { includeHiddenElements: true });
        expect(displayNameTexts).toHaveLength(2);
        expect(displayNameTexts.at(0)?.props?.style?.fontWeight).toBe(FontUtils_1.default.fontWeight.normal);
        expect(react_native_1.screen.getAllByText('C User').at(0)).toBeOnTheScreen();
        expect(displayNameTexts.at(1)?.props?.style?.fontWeight).toBe(FontUtils_1.default.fontWeight.bold);
        expect(react_native_1.screen.getByText('B User', { includeHiddenElements: true })).toBeOnTheScreen();
    }));
    xit('Manually marking a chat message as unread shows the new line indicator and updates the LHN', () => signInAndGetAppWithUnreadChat()
        // Navigate to the unread report
        .then(() => (0, TestHelper_1.navigateToSidebarOption)(0))
        .then(() => {
        // It's difficult to trigger marking a report comment as unread since we would have to mock the long press event and then
        // another press on the context menu item so we will do it via the action directly and then test if the UI has updated properly
        (0, Report_1.markCommentAsUnread)(REPORT_ID, createdReportAction);
        return (0, waitForBatchedUpdates_1.default)();
    })
        .then(() => {
        // Verify the indicator appears above the last action
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(1);
        const reportActionID = unreadIndicator.at(0)?.props?.['data-action-id'];
        expect(reportActionID).toBe('3');
        // Scroll up and verify the new messages badge appears
        scrollUpToRevealNewMessagesBadge();
        return (0, react_native_1.waitFor)(() => expect(isNewMessagesBadgeVisible()).toBe(true));
    })
        // Navigate to the sidebar
        .then(navigateToSidebar)
        .then(() => {
        // Verify the report is marked as unread in the sidebar
        const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameTexts = react_native_1.screen.queryAllByLabelText(hintText);
        expect(displayNameTexts).toHaveLength(1);
        expect(displayNameTexts.at(0)?.props?.style?.fontWeight).toBe(FontUtils_1.default.fontWeight.bold);
        expect(react_native_1.screen.getByText('B User')).toBeOnTheScreen();
        // Navigate to the report again and back to the sidebar
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(() => navigateToSidebar())
        .then(() => {
        // Verify the report is now marked as read
        const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameTexts = react_native_1.screen.queryAllByLabelText(hintText);
        expect(displayNameTexts).toHaveLength(1);
        expect(displayNameTexts.at(0)?.props?.style?.fontWeight).toBe(undefined);
        expect(react_native_1.screen.getByText('B User')).toBeOnTheScreen();
        // Navigate to the report again and verify the new line indicator is missing
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(() => {
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(0);
        // Scroll up and verify the "New messages" badge is hidden
        scrollUpToRevealNewMessagesBadge();
        return (0, react_native_1.waitFor)(() => expect(isNewMessagesBadgeVisible()).toBe(false));
    }));
    it('Keep showing the new line indicator when a new message is created by the current user', () => signInAndGetAppWithUnreadChat()
        .then(() => {
        // Verify we are on the LHN and that the chat shows as unread in the LHN
        expect(areYouOnChatListScreen()).toBe(true);
        // Navigate to the report and verify the indicator is present
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(async () => {
        (0, react_native_1.act)(() => NativeNavigation.triggerTransitionEnd());
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(1);
        // Leave a comment as the current user and verify the indicator is removed
        (0, Report_1.addComment)(REPORT_ID, 'Current User Comment 1', CONST_1.default.DEFAULT_TIME_ZONE);
        return (0, waitForBatchedUpdates_1.default)();
    })
        .then(() => {
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(1);
    }));
    xit('Keeps the new line indicator when the user moves the App to the background', () => signInAndGetAppWithUnreadChat()
        .then(() => {
        // Verify we are on the LHN and that the chat shows as unread in the LHN
        expect(areYouOnChatListScreen()).toBe(true);
        // Navigate to the chat and verify the new line indicator is present
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(() => {
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(1);
        // Then back to the LHN - then back to the chat again and verify the new line indicator has cleared
        return navigateToSidebar();
    })
        .then(() => (0, TestHelper_1.navigateToSidebarOption)(0))
        .then(() => {
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(0);
        // Mark a previous comment as unread and verify the unread action indicator returns
        (0, Report_1.markCommentAsUnread)(REPORT_ID, createdReportAction);
        return (0, waitForBatchedUpdates_1.default)();
    })
        .then(() => {
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        let unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(1);
        // Trigger the app going inactive and active again
        react_native_2.AppState.emitCurrentTestState('background');
        react_native_2.AppState.emitCurrentTestState('active');
        // Verify the new line is still present
        unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(1);
    }));
    it('Displays the correct chat message preview in the LHN when a comment is added then deleted', () => {
        let reportActions;
        let lastReportAction;
        react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (val) => (reportActions = val),
        });
        return (signInAndGetAppWithUnreadChat()
            // Navigate to the chat and simulate leaving a comment from the current user
            .then(() => (0, TestHelper_1.navigateToSidebarOption)(0))
            .then(() => {
            // Leave a comment as the current user
            (0, Report_1.addComment)(REPORT_ID, 'Current User Comment 1', CONST_1.default.DEFAULT_TIME_ZONE);
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Simulate the response from the server so that the comment can be deleted in this test
            lastReportAction = reportActions ? (0, CollectionUtils_1.lastItem)(reportActions) : undefined;
            react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, {
                lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(lastReportAction),
                lastActorAccountID: lastReportAction?.actorAccountID,
                reportID: REPORT_ID,
            });
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            // Verify the chat preview text matches the last comment from the current user
            const hintText = (0, Localize_1.translateLocal)('accessibilityHints.lastChatMessagePreview');
            const alternateText = react_native_1.screen.queryAllByLabelText(hintText, { includeHiddenElements: true });
            expect(alternateText).toHaveLength(1);
            // This message is visible on the sidebar and the report screen, so there are two occurrences.
            expect(react_native_1.screen.getAllByText('Current User Comment 1').at(0)).toBeOnTheScreen();
            if (lastReportAction) {
                (0, Report_1.deleteReportComment)(REPORT_ID, lastReportAction);
            }
            return (0, waitForBatchedUpdates_1.default)();
        })
            .then(() => {
            const hintText = (0, Localize_1.translateLocal)('accessibilityHints.lastChatMessagePreview');
            const alternateText = react_native_1.screen.queryAllByLabelText(hintText, { includeHiddenElements: true });
            expect(alternateText).toHaveLength(1);
            expect(react_native_1.screen.getAllByText('Comment 9').at(0)).toBeOnTheScreen();
        }));
    });
    it('Move the new line indicator to the next message when the unread message is deleted', async () => {
        let reportActions;
        const connection = react_native_onyx_1.default.connect({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`,
            callback: (val) => (reportActions = val),
        });
        await signInAndGetAppWithUnreadChat();
        await (0, TestHelper_1.navigateToSidebarOption)(0);
        (0, Report_1.addComment)(REPORT_ID, 'Comment 1', CONST_1.default.DEFAULT_TIME_ZONE);
        await (0, waitForBatchedUpdates_1.default)();
        const firstNewReportAction = reportActions ? (0, CollectionUtils_1.lastItem)(reportActions) : undefined;
        if (firstNewReportAction) {
            (0, Report_1.markCommentAsUnread)(REPORT_ID, firstNewReportAction);
            await (0, waitForBatchedUpdates_1.default)();
            (0, Report_1.addComment)(REPORT_ID, 'Comment 2', CONST_1.default.DEFAULT_TIME_ZONE);
            await (0, waitForBatchedUpdates_1.default)();
            (0, Report_1.deleteReportComment)(REPORT_ID, firstNewReportAction);
            await (0, waitForBatchedUpdates_1.default)();
        }
        const secondNewReportAction = reportActions ? (0, CollectionUtils_1.lastItem)(reportActions) : undefined;
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(1);
        const reportActionID = unreadIndicator.at(0)?.props?.['data-action-id'];
        expect(reportActionID).toBe(secondNewReportAction?.reportActionID);
        react_native_onyx_1.default.disconnect(connection);
    });
    it('Do not display the new line indicator when receiving a new message from another user', async () => {
        // Given a read report
        await signInAndGetAppWithUnreadChat();
        (0, Report_1.readNewestAction)(REPORT_ID, true);
        await (0, waitForBatchedUpdates_1.default)();
        await (0, TestHelper_1.navigateToSidebarOption)(0);
        // When another user adds a new message
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`, {
            10: TestHelper.buildTestReportComment(DateUtils_1.default.getDBTime(), USER_B_ACCOUNT_ID, '10'),
        });
        // Then the new line indicator shouldn't be displayed
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(0);
    });
    it('Do not display the new line indicator when tracking an expense on self DM while offline', async () => {
        // Given a self DM report and an offline network
        await signInAndGetAppWithUnreadChat();
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: true });
        // Remove unnecessary report
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, null);
        const selfDMReport = {
            ...(0, reports_1.createRandomReport)(2),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
            type: CONST_1.default.REPORT.TYPE.CHAT,
            lastMessageText: 'test',
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${selfDMReport.reportID}`, selfDMReport);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`, {
            1: {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                automatic: false,
                created: DateUtils_1.default.getDBTime(),
                reportActionID: '1',
                message: [
                    {
                        style: 'strong',
                        text: '__FAKE__',
                        type: 'TEXT',
                    },
                    {
                        style: 'normal',
                        text: 'created this report',
                        type: 'TEXT',
                    },
                ],
            },
        });
        await (0, TestHelper_1.navigateToSidebarOption)(0);
        const fakeTransaction = {
            ...(0, transaction_1.default)(1),
            iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.MANUAL,
            comment: 'description',
        };
        // When the user track an expense on the self DM
        const participant = { login: USER_A_EMAIL, accountID: USER_A_ACCOUNT_ID };
        (0, IOU_1.trackExpense)({
            report: selfDMReport,
            isDraftPolicy: true,
            action: CONST_1.default.IOU.ACTION.CREATE,
            participantParams: {
                payeeEmail: participant.login,
                payeeAccountID: participant.accountID,
                participant,
            },
            transactionParams: {
                amount: fakeTransaction.amount,
                currency: fakeTransaction.currency,
                created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
            },
        });
        await (0, waitForBatchedUpdates_1.default)();
        // Then the new line indicator shouldn't be displayed
        const newMessageLineIndicatorHintText = (0, Localize_1.translateLocal)('accessibilityHints.newMessageLineIndicator');
        const unreadIndicator = react_native_1.screen.queryAllByLabelText(newMessageLineIndicatorHintText);
        expect(unreadIndicator).toHaveLength(0);
    });
    it('Mark the chat as unread on clicking "Mark as unread" on an item in LHN when the last message of the chat was deleted by another user', async () => {
        await signInAndGetAppWithUnreadChat();
        await navigateToSidebar();
        const reportAction11CreatedDate = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 110), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        const reportAction11 = TestHelper.buildTestReportComment(reportAction11CreatedDate, USER_B_ACCOUNT_ID, '11');
        const reportAction12CreatedDate = (0, date_fns_1.format)((0, date_fns_1.addSeconds)(TEN_MINUTES_AGO, 120), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
        const reportAction12 = TestHelper.buildTestReportComment(reportAction12CreatedDate, USER_B_ACCOUNT_ID, '12');
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`, {
            11: reportAction11,
            12: reportAction12,
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, {
            lastVisibleActionCreated: reportAction12CreatedDate,
        });
        const message = reportAction12.message.at(0);
        if (message) {
            message.html = ''; // Simulate the server response for deleting the last message
        }
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, {
            lastVisibleActionCreated: reportAction11CreatedDate,
        });
        (0, Report_1.markCommentAsUnread)(REPORT_ID, { reportActionID: -1 }); // Marking the chat as unread from LHN passing a dummy reportActionID
        await (0, waitForBatchedUpdates_1.default)();
        const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameTexts = react_native_1.screen.queryAllByLabelText(hintText);
        expect(displayNameTexts).toHaveLength(1);
        expect(displayNameTexts.at(0)?.props?.style?.fontWeight).toBe(FontUtils_1.default.fontWeight.bold);
    });
});
