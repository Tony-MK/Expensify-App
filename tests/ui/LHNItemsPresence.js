"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const OnyxDerived_1 = require("@libs/actions/OnyxDerived");
const DateUtils_1 = require("@libs/DateUtils");
const Localize_1 = require("@libs/Localize");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const FontUtils_1 = require("@styles/utils/FontUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reports_1 = require("../../__mocks__/reportData/reports");
const LHNTestUtils = require("../utils/LHNTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
// Be sure to include the mocked permissions library, as some components that are rendered
// during the test depend on its methods.
jest.mock('@libs/Permissions');
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigationState: () => undefined,
    useIsFocused: () => true,
    useRoute: () => ({ name: 'Home' }),
    useNavigation: () => undefined,
    useFocusEffect: () => undefined,
}));
jest.mock('@components/withCurrentUserPersonalDetails', () => {
    // Lazy loading of LHNTestUtils
    const lazyLoadLHNTestUtils = () => require('../utils/LHNTestUtils');
    return (Component) => {
        function WrappedComponent(props) {
            const currentUserAccountID = 1;
            const LHNTestUtilsMock = lazyLoadLHNTestUtils(); // Load LHNTestUtils here
            return (<Component 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props} currentUserPersonalDetails={LHNTestUtilsMock.fakePersonalDetails[currentUserAccountID]}/>);
        }
        WrappedComponent.displayName = 'WrappedComponent';
        return WrappedComponent;
    };
});
const TEST_USER_ACCOUNT_ID = 1;
const TEST_USER_LOGIN = 'test@test.com';
const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
const TEST_POLICY_ID = '1';
const signUpWithTestUser = () => {
    TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN);
};
const getOptionRows = () => {
    return react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
};
const getDisplayNames = () => {
    const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
    return react_native_1.screen.queryAllByLabelText(hintText);
};
// Reusable function to setup a mock report. Feel free to add more parameters as needed.
const createReport = (isPinned = false, participants = [1, 2], messageCount = 1, chatType = undefined, policyID = CONST_1.default.POLICY.ID_FAKE, isUnread = false) => {
    return {
        ...LHNTestUtils.getFakeReport(participants, messageCount, isUnread),
        isPinned,
        chatType,
        policyID,
    };
};
const createFakeTransactionViolation = (violationName = CONST_1.default.VIOLATIONS.HOLD, showInReview = true) => {
    return LHNTestUtils.getFakeTransactionViolation(violationName, showInReview);
};
describe('SidebarLinksData', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
        (0, OnyxDerived_1.default)();
    });
    // Helper to initialize common state
    const initializeState = async (reportData, otherData) => {
        await (0, waitForBatchedUpdates_1.default)();
        await react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.GSD,
            [ONYXKEYS_1.default.BETAS]: betas,
            [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
            [ONYXKEYS_1.default.IS_LOADING_APP]: false,
            ...(reportData ?? {}),
            ...(otherData ?? {}),
        });
    };
    beforeEach(() => {
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        // Initialize the network key for OfflineWithFeedback
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, CONST_1.default.LOCALES.EN);
        signUpWithTestUser();
    });
    afterEach(async () => {
        await react_native_onyx_1.default.clear();
        await (0, waitForBatchedUpdatesWithAct_1.default)();
    });
    describe('Report that should be included in the LHN', () => {
        it('should display the current active report', async () => {
            // Given the SidebarLinks are rendered without a specified report ID.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = createReport();
            // When the Onyx state is initialized with a report.
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            // Then no other reports should be displayed in the sidebar.
            expect(getOptionRows()).toHaveLength(0);
            // When the SidebarLinks are rendered again with the current active report ID.
            await LHNTestUtils.getDefaultRenderedSidebarLinks(report.reportID);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the active report should be displayed as part of LHN,
            expect(getOptionRows()).toHaveLength(1);
            // And the active report should be highlighted.
            // TODO add the proper assertion for the highlighted report.
        });
        it('should display draft report', async () => {
            // Given SidebarLinks are rendered initially.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const draftReport = {
                ...createReport(false, [1, 2], 0),
                writeCapability: CONST_1.default.REPORT.WRITE_CAPABILITIES.ALL,
            };
            // When Onyx state is initialized with a draft report.
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${draftReport.reportID}`]: draftReport,
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // And a draft message is added to the report.
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${draftReport.reportID}`, 'draft report message');
            // Then the sidebar should display the draft report.
            expect(getDisplayNames()).toHaveLength(1);
            // And the draft icon should be shown, indicating there is unsent content.
            expect(react_native_1.screen.getByTestId('Pencil Icon')).toBeOnTheScreen();
        });
        it('should display pinned report', async () => {
            // Given the SidebarLinks are rendered.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = createReport(false);
            // When the report is initialized in Onyx.
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            // Then the report should not appear in the sidebar as it is not pinned.
            expect(getOptionRows()).toHaveLength(0);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // When the report is marked as pinned.
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, { isPinned: true });
            // Then the report should appear in the sidebar because it’s pinned.
            expect(getOptionRows()).toHaveLength(1);
            // And the pin icon should be shown
            expect(react_native_1.screen.getByTestId('Pin Icon')).toBeOnTheScreen();
        });
        it('should display the report with violations', async () => {
            // Given the SidebarLinks are rendered.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            // When the report is initialized in Onyx.
            const report = {
                ...createReport(true, undefined, undefined, CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, TEST_POLICY_ID),
                ownerAccountID: TEST_USER_ACCOUNT_ID,
            };
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the report should appear in the sidebar because it’s pinned.
            expect(getOptionRows()).toHaveLength(1);
            const expenseReport = {
                ...createReport(false, undefined, undefined, undefined, TEST_POLICY_ID),
                ownerAccountID: TEST_USER_ACCOUNT_ID,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                chatReportID: report.reportID,
            };
            const transaction = LHNTestUtils.getFakeTransaction(expenseReport.reportID);
            const transactionViolation = createFakeTransactionViolation();
            const reportAction = LHNTestUtils.getFakeAdvancedReportAction();
            // When the report has outstanding violations
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`, {
                [reportAction.reportActionID]: reportAction,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`, transaction);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`, [transactionViolation]);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the RBR icon should be shown
            expect(react_native_1.screen.getByTestId('RBR Icon')).toBeOnTheScreen();
        });
        it('should display the report awaiting user action', async () => {
            // Given the SidebarLinks are rendered.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = {
                ...createReport(false),
                hasOutstandingChildRequest: true,
            };
            // When the report is initialized in Onyx.
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the report should appear in the sidebar because it requires attention from the user
            expect(getOptionRows()).toHaveLength(1);
            // And a green dot icon should be shown
            expect(react_native_1.screen.getByTestId('GBR Icon')).toBeOnTheScreen();
        });
        it('should display the archived report in the default mode', async () => {
            // Given the SidebarLinks are rendered.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const archivedReport = {
                ...createReport(false),
            };
            const reportNameValuePairs = {
                type: 'chat',
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${archivedReport.reportID}`]: archivedReport,
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // When the user is in the default mode
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_PRIORITY_MODE, CONST_1.default.PRIORITY_MODE.DEFAULT);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${archivedReport.reportID}`, reportNameValuePairs);
            // Then the report should appear in the sidebar because it's archived
            expect(getOptionRows()).toHaveLength(1);
        });
        it('should display the selfDM report by default', async () => {
            // Given the SidebarLinks are rendered.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = createReport(true, undefined, undefined, undefined, CONST_1.default.REPORT.CHAT_TYPE.SELF_DM, undefined);
            // When the selfDM is initialized in Onyx
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the selfDM report should appear in the sidebar by default
            expect(getOptionRows()).toHaveLength(1);
        });
        it('should display the unread report in the focus mode with the bold text', async () => {
            // Given the SidebarLinks are rendered.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = {
                ...createReport(undefined, undefined, undefined, undefined, undefined, true),
                lastMessageText: 'fake last message',
                lastActorAccountID: TEST_USER_ACCOUNT_ID,
            };
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // When the user is in focus mode
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_PRIORITY_MODE, CONST_1.default.PRIORITY_MODE.GSD);
            // Then the report should appear in the sidebar because it's unread
            expect(getOptionRows()).toHaveLength(1);
            // And the text is bold
            const displayNameText = getDisplayNames()?.at(0);
            expect(displayNameText).toHaveStyle({ fontWeight: FontUtils_1.default.fontWeight.bold });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // When the report is marked as read
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, {
                lastReadTime: report.lastVisibleActionCreated,
            });
            // Then the report should not disappear in the sidebar because we are in the focus mode
            expect(getOptionRows()).toHaveLength(0);
        });
    });
    describe('Report that should NOT be included in the LHN', () => {
        it('should not display report with no participants', async () => {
            // Given the SidebarLinks are rendered.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = LHNTestUtils.getFakeReport([]);
            // When a report with no participants is initialized in Onyx.
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            // Then the report should not appear in the sidebar.
            expect(getOptionRows()).toHaveLength(0);
        });
        it('should not display empty chat', async () => {
            // Given the SidebarLinks are rendered.
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = LHNTestUtils.getFakeReport([1, 2], 0);
            // When a report with no messages is initialized in Onyx
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            // Then the empty report should not appear in the sidebar.
            expect(getOptionRows()).toHaveLength(0);
        });
        it('should not display the report marked as hidden', async () => {
            // Given the SidebarLinks are rendered
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = {
                ...createReport(),
                participants: {
                    [TEST_USER_ACCOUNT_ID]: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
            };
            // When a report with notification preference set as hidden is initialized in Onyx
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            // Then hidden report should not appear in the sidebar.
            expect(getOptionRows()).toHaveLength(0);
        });
        it('should not display the report has empty notification preference', async () => {
            // Given the SidebarLinks are rendered
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = createReport(false, [2]);
            // When a report with empty notification preference is initialized in Onyx
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            // Then the report should not appear in the sidebar.
            expect(getOptionRows()).toHaveLength(0);
        });
        it('should not display the report the user cannot access due to policy restrictions', async () => {
            // Given the SidebarLinks are rendered
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = {
                ...createReport(),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.DOMAIN_ALL,
                lastMessageText: 'fake last message',
            };
            // When a default room is initialized in Onyx
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            // And the defaultRooms beta is removed
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.BETAS, []);
            // Then the default room should not appear in the sidebar.
            expect(getOptionRows()).toHaveLength(0);
        });
        it('should not display the single transaction thread', async () => {
            // Given the SidebarLinks are rendered
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const expenseReport = (0, ReportUtils_1.buildOptimisticExpenseReport)(reports_1.chatReportR14932.reportID, '123', 100, 122, 'USD');
            const expenseTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: expenseReport.reportID,
                },
            });
            const expenseCreatedAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: 'create',
                amount: 100,
                currency: 'USD',
                comment: '',
                participants: [],
                transactionID: expenseTransaction.transactionID,
                iouReportID: expenseReport.reportID,
            });
            const transactionThreadReport = (0, ReportUtils_1.buildTransactionThread)(expenseCreatedAction, expenseReport);
            expenseCreatedAction.childReportID = transactionThreadReport.reportID;
            // When a single transaction thread is initialized in Onyx
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport.reportID}`]: transactionThreadReport,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reports_1.chatReportR14932.reportID}`, reports_1.chatReportR14932);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`, {
                [expenseCreatedAction.reportActionID]: expenseCreatedAction,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${expenseTransaction.transactionID}`, expenseTransaction);
            // Then such report should not appear in the sidebar because the highest level context is on the expense chat with GBR that is visible in the LHN
            expect(getOptionRows()).toHaveLength(0);
        });
        it('should not display the report with parent message is pending removal', async () => {
            // Given the SidebarLinks are rendered
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const parentReport = createReport();
            const report = createReport();
            const parentReportAction = {
                ...LHNTestUtils.getFakeReportAction(),
                message: [
                    {
                        type: 'COMMENT',
                        html: 'hey',
                        text: 'hey',
                        isEdited: false,
                        whisperedTo: [],
                        isDeletedParentAction: false,
                        moderationDecision: {
                            decision: CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING_REMOVE,
                        },
                    },
                ],
                childReportID: report.reportID,
            };
            report.parentReportID = parentReport.reportID;
            report.parentReportActionID = parentReportAction.reportActionID;
            // When a report with parent message is pending removal is initialized in Onyx
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`, parentReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport.reportID}`, {
                [parentReportAction.reportActionID]: parentReportAction,
            });
            // Then report should not appear in the sidebar until the moderation feature decides if the message should be removed
            expect(getOptionRows()).toHaveLength(0);
        });
        it('should not display the read report in the focus mode', async () => {
            // Given the SidebarLinks are rendered
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            const report = {
                ...createReport(),
                lastMessageText: 'fake last message',
                lastActorAccountID: TEST_USER_ACCOUNT_ID,
            };
            // When a read report that isn't empty is initialized in Onyx
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // And the user is in default mode
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_PRIORITY_MODE, CONST_1.default.PRIORITY_MODE.DEFAULT);
            // Then the report should appear in the sidebar
            expect(getOptionRows()).toHaveLength(1);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // When the user is in focus mode
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_PRIORITY_MODE, CONST_1.default.PRIORITY_MODE.GSD);
            // Then the report should not disappear in the sidebar because it's read
            expect(getOptionRows()).toHaveLength(0);
        });
        it('should not display an empty submitted report having only a CREATED action', async () => {
            // Given the SidebarLinks are rendered
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            // When creating a report with total = 0, stateNum = SUBMITTED, statusNum = SUBMITTED
            const report = {
                ...createReport(false, [1, 2], 0),
                total: 0,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            };
            // And setting up a report action collection with only a CREATED action
            const reportActionID = '1';
            const reportAction = {
                ...LHNTestUtils.getFakeReportAction(),
                reportActionID,
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
            };
            // When the Onyx state is initialized with this report
            await initializeState({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            });
            // And a report action collection with only a CREATED action is added
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`, {
                [reportActionID]: reportAction,
            });
            // Then the report should not be displayed in the sidebar
            expect(getOptionRows()).toHaveLength(0);
            expect(getDisplayNames()).toHaveLength(0);
        });
    });
});
