"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const react_native_1 = require("@testing-library/react-native");
const date_fns_1 = require("date-fns");
const fast_equals_1 = require("fast-equals");
const react_native_onyx_1 = require("react-native-onyx");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useAncestorReportsAndReportActions_1 = require("@hooks/useAncestorReportsAndReportActions");
const useReportWithTransactionsAndViolations_1 = require("@hooks/useReportWithTransactionsAndViolations");
const IOU_1 = require("@libs/actions/IOU");
const OnyxDerived_1 = require("@libs/actions/OnyxDerived");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Report_1 = require("@libs/actions/Report");
const ReportActions_1 = require("@libs/actions/ReportActions");
const User_1 = require("@libs/actions/User");
const types_1 = require("@libs/API/types");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Localize_1 = require("@libs/Localize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NumberUtils_1 = require("@libs/NumberUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const API = require("@src/libs/API");
const DateUtils_1 = require("@src/libs/DateUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const Transaction_1 = require("../../src/libs/actions/Transaction");
const InvoiceData = require("../data/Invoice");
const policies_1 = require("../utils/collections/policies");
const policyCategory_1 = require("../utils/collections/policyCategory");
const policyTags_1 = require("../utils/collections/policyTags");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const getOnyxValue_1 = require("../utils/getOnyxValue");
const PusherHelper_1 = require("../utils/PusherHelper");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForNetworkPromises_1 = require("../utils/waitForNetworkPromises");
const topMostReportID = '23423423';
jest.mock('@src/libs/Navigation/Navigation', () => ({
    navigate: jest.fn(),
    dismissModal: jest.fn(),
    dismissModalWithReport: jest.fn(),
    goBack: jest.fn(),
    getTopmostReportId: jest.fn(() => topMostReportID),
    setNavigationActionToMicrotaskQueue: jest.fn(),
    removeScreenByKey: jest.fn(),
    isNavigationReady: jest.fn(() => Promise.resolve()),
    getReportRouteByID: jest.fn(),
    getActiveRouteWithoutParams: jest.fn(),
    getActiveRoute: jest.fn(),
    navigationRef: {
        getRootState: jest.fn(),
    },
}));
jest.mock('@react-navigation/native');
jest.mock('@src/libs/actions/Report', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const originalModule = jest.requireActual('@src/libs/actions/Report');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
        ...originalModule,
        notifyNewAction: jest.fn(),
    };
});
jest.mock('@libs/Navigation/helpers/isSearchTopmostFullScreenRoute', () => jest.fn());
jest.mock('@src/libs/SearchQueryUtils', () => ({
    getCurrentSearchQueryJSON: jest.fn().mockImplementation(() => ({
        hash: 12345,
        query: 'test',
        type: 'invoice',
        status: '',
        flatFilters: [],
    })),
    buildQueryStringFromFilterFormValues: jest.fn().mockImplementation(() => 'type:expense'),
    buildCannedSearchQuery: jest.fn(),
    buildSearchQueryJSON: jest.fn(),
}));
const CARLOS_EMAIL = 'cmartins@expensifail.com';
const CARLOS_ACCOUNT_ID = 1;
const CARLOS_PARTICIPANT = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS, role: 'member' };
const JULES_EMAIL = 'jules@expensifail.com';
const JULES_ACCOUNT_ID = 2;
const JULES_PARTICIPANT = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS, role: 'member' };
const RORY_EMAIL = 'rory@expensifail.com';
const RORY_ACCOUNT_ID = 3;
const RORY_PARTICIPANT = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS, role: 'admin' };
const VIT_EMAIL = 'vit@expensifail.com';
const VIT_ACCOUNT_ID = 4;
const VIT_PARTICIPANT = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS, role: 'member' };
(0, OnyxUpdateManager_1.default)();
describe('actions/IOU', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            initialKeyStates: {
                [ONYXKEYS_1.default.SESSION]: { accountID: RORY_ACCOUNT_ID, email: RORY_EMAIL },
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: { [RORY_ACCOUNT_ID]: { accountID: RORY_ACCOUNT_ID, login: RORY_EMAIL } },
            },
        });
        (0, OnyxDerived_1.default)();
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return (0, waitForBatchedUpdates_1.default)();
    });
    let mockFetch;
    beforeEach(() => {
        jest.clearAllTimers();
        global.fetch = (0, TestHelper_1.getGlobalFetchMock)();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('trackExpense', () => {
        it('category a distance expense of selfDM report', async () => {
            /*
             * This step simulates the following steps:
             *   - Go to self DM
             *   - Track a distance expense
             *   - Go to Troubleshoot > Clear cache and restart > Reset and refresh
             *   - Go to self DM
             *   - Click Categorize it (click Upgrade if there is no workspace)
             *   - Select category and submit the expense to the workspace
             */
            // Given a participant of the report
            const participant = { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID };
            // Given valid waypoints of the transaction
            const fakeWayPoints = {
                waypoint0: {
                    keyForList: '88 Kearny Street_1735023533854',
                    lat: 37.7886378,
                    lng: -122.4033442,
                    address: '88 Kearny Street, San Francisco, CA, USA',
                    name: '88 Kearny Street',
                },
                waypoint1: {
                    keyForList: 'Golden Gate Bridge Vista Point_1735023537514',
                    lat: 37.8077876,
                    lng: -122.4752007,
                    address: 'Golden Gate Bridge Vista Point, San Francisco, CA, USA',
                    name: 'Golden Gate Bridge Vista Point',
                },
            };
            // Given a selfDM report
            const selfDMReport = {
                ...(0, reports_1.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
            };
            // Given a policyExpenseChat report
            const policyExpenseChat = {
                ...(0, reports_1.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
            };
            // Given policy categories and a policy
            const fakeCategories = (0, policyCategory_1.default)(3);
            const fakePolicy = (0, policies_1.default)(1);
            // Given a transaction with a distance request type and valid waypoints
            const fakeTransaction = {
                ...(0, transaction_1.default)(1),
                iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.DISTANCE,
                comment: {
                    ...(0, transaction_1.default)(1).comment,
                    type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                    customUnit: {
                        name: CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE,
                    },
                    waypoints: fakeWayPoints,
                },
            };
            // When the transaction is saved to draft before being submitted
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${fakeTransaction.transactionID}`, fakeTransaction);
            mockFetch?.pause?.();
            // When the user submits the transaction to the selfDM report
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
                    merchant: fakeTransaction.merchant,
                    billable: false,
                    validWaypoints: fakeWayPoints,
                    actionableWhisperReportActionID: fakeTransaction?.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: fakeTransaction?.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: fakeTransaction?.linkedTrackedExpenseReportID,
                    customUnitRateID: CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID,
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            await mockFetch?.resume?.();
            // Given transaction after tracked expense
            const transaction = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (transactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const trackedExpenseTransaction = Object.values(transactions ?? {}).at(0);
                        // Then the transaction must remain a distance request
                        const isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(trackedExpenseTransaction);
                        expect(isDistanceRequest).toBe(true);
                        resolve(trackedExpenseTransaction);
                    },
                });
            });
            // Given all report actions of the selfDM report
            const allReportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (reportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reportActions);
                    },
                });
            });
            // Then the selfDM report should have an actionable track expense whisper action and an IOU action
            const selfDMReportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`];
            expect(Object.values(selfDMReportActions ?? {}).length).toBe(2);
            // When the cache is cleared before categorizing the tracked expense
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction?.transactionID}`, {
                iouRequestType: null,
            });
            // When the transaction is saved to draft by selecting a category in the selfDM report
            const reportActionableTrackExpense = Object.values(selfDMReportActions ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isActionableTrackExpense)(reportAction));
            (0, ReportUtils_1.createDraftTransactionAndNavigateToParticipantSelector)(transaction?.transactionID, selfDMReport.reportID, CONST_1.default.IOU.ACTION.CATEGORIZE, reportActionableTrackExpense?.reportActionID);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the transaction draft should be saved successfully
            const allTransactionsDraft = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT,
                    waitForCollectionCallback: true,
                    callback: (transactionDrafts) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(transactionDrafts);
                    },
                });
            });
            const transactionDraft = allTransactionsDraft?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction?.transactionID}`];
            // When the user confirms the category for the tracked expense
            (0, IOU_1.trackExpense)({
                report: policyExpenseChat,
                isDraftPolicy: false,
                action: CONST_1.default.IOU.ACTION.CATEGORIZE,
                participantParams: {
                    payeeEmail: participant.login,
                    payeeAccountID: participant.accountID,
                    participant: { ...participant, isPolicyExpenseChat: true },
                },
                policyParams: {
                    policy: fakePolicy,
                    policyCategories: fakeCategories,
                },
                transactionParams: {
                    amount: transactionDraft?.amount ?? fakeTransaction.amount,
                    currency: transactionDraft?.currency ?? fakeTransaction.currency,
                    created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                    merchant: transactionDraft?.merchant ?? fakeTransaction.merchant,
                    category: Object.keys(fakeCategories).at(0) ?? '',
                    validWaypoints: Object.keys(transactionDraft?.comment?.waypoints ?? {}).length ? (0, TransactionUtils_1.getValidWaypoints)(transactionDraft?.comment?.waypoints, true) : undefined,
                    actionableWhisperReportActionID: transactionDraft?.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: transactionDraft?.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: transactionDraft?.linkedTrackedExpenseReportID,
                    customUnitRateID: CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID,
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            await mockFetch?.resume?.();
            // Then the expense should be categorized successfully
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (transactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const categorizedTransaction = transactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction?.transactionID}`];
                        // Then the transaction must remain a distance request, ensuring that the optimistic data is correctly built and the transaction type remains accurate.
                        const isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(categorizedTransaction);
                        expect(isDistanceRequest).toBe(true);
                        // Then the transaction category must match the original category
                        expect(categorizedTransaction?.category).toBe(Object.keys(fakeCategories).at(0) ?? '');
                        resolve();
                    },
                });
            });
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
                    callback: (quickAction) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve();
                        // Then the quickAction.action should be set to REQUEST_DISTANCE
                        expect(quickAction?.action).toBe(CONST_1.default.QUICK_ACTIONS.REQUEST_DISTANCE);
                        // Then the quickAction.chatReportID should be set to the given policyExpenseChat reportID
                        expect(quickAction?.chatReportID).toBe(policyExpenseChat.reportID);
                    },
                });
            });
        });
        it('share with accountant', async () => {
            const accountant = { login: VIT_EMAIL, accountID: VIT_ACCOUNT_ID };
            const policy = { ...(0, policies_1.default)(1), id: 'ABC' };
            const selfDMReport = {
                ...(0, reports_1.createRandomReport)(1),
                reportID: '10',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
            };
            const policyExpenseChat = {
                ...(0, reports_1.createRandomReport)(1),
                reportID: '123',
                policyID: policy.id,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                isOwnPolicyExpenseChat: true,
            };
            const transaction = { ...(0, transaction_1.default)(1), transactionID: '555' };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${policyExpenseChat.reportID}`, policyExpenseChat);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction.transactionID}`, transaction);
            // Create a tracked expense
            (0, IOU_1.trackExpense)({
                report: selfDMReport,
                isDraftPolicy: true,
                action: CONST_1.default.IOU.ACTION.CREATE,
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { accountID: RORY_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: transaction.amount,
                    currency: transaction.currency,
                    created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                    merchant: transaction.merchant,
                    billable: false,
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            const selfDMReportActionsOnyx = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            expect(Object.values(selfDMReportActionsOnyx ?? {}).length).toBe(2);
            const linkedTrackedExpenseReportAction = Object.values(selfDMReportActionsOnyx ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
            const reportActionableTrackExpense = Object.values(selfDMReportActionsOnyx ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isActionableTrackExpense)(reportAction));
            mockFetch?.pause?.();
            // Share the tracked expense with an accountant
            (0, IOU_1.trackExpense)({
                report: policyExpenseChat,
                isDraftPolicy: false,
                action: CONST_1.default.IOU.ACTION.SHARE,
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { reportID: policyExpenseChat.reportID, isPolicyExpenseChat: true },
                },
                policyParams: {
                    policy,
                },
                transactionParams: {
                    amount: transaction.amount,
                    currency: transaction.currency,
                    created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                    merchant: transaction.merchant,
                    billable: false,
                    actionableWhisperReportActionID: reportActionableTrackExpense?.reportActionID,
                    linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: selfDMReport.reportID,
                },
                accountantParams: {
                    accountant,
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            const policyExpenseChatOnyx = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${policyExpenseChat.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            const policyOnyx = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                    waitForCollectionCallback: false,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            await mockFetch?.resume?.();
            // Accountant should be invited to the expense report
            expect(policyExpenseChatOnyx?.participants?.[accountant.accountID]).toBeTruthy();
            // Accountant should be added to the workspace as an admin
            expect(policyOnyx?.employeeList?.[accountant.login].role).toBe(CONST_1.default.POLICY.ROLE.ADMIN);
        });
        it('share with accountant who is already a member', async () => {
            const accountant = { login: VIT_EMAIL, accountID: VIT_ACCOUNT_ID };
            const policy = { ...(0, policies_1.default)(1), id: 'ABC', employeeList: { [accountant.login]: { email: accountant.login, role: CONST_1.default.POLICY.ROLE.USER } } };
            const selfDMReport = {
                ...(0, reports_1.createRandomReport)(1),
                reportID: '10',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
            };
            const policyExpenseChat = {
                ...(0, reports_1.createRandomReport)(1),
                reportID: '123',
                policyID: policy.id,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                isOwnPolicyExpenseChat: true,
                participants: { [accountant.accountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS } },
            };
            const transaction = { ...(0, transaction_1.default)(1), transactionID: '555' };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${policyExpenseChat.reportID}`, policyExpenseChat);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction.transactionID}`, transaction);
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [accountant.accountID]: accountant });
            // Create a tracked expense
            (0, IOU_1.trackExpense)({
                report: selfDMReport,
                isDraftPolicy: true,
                action: CONST_1.default.IOU.ACTION.CREATE,
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { accountID: RORY_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: transaction.amount,
                    currency: transaction.currency,
                    created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                    merchant: transaction.merchant,
                    billable: false,
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            const selfDMReportActionsOnyx = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            expect(Object.values(selfDMReportActionsOnyx ?? {}).length).toBe(2);
            const linkedTrackedExpenseReportAction = Object.values(selfDMReportActionsOnyx ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
            const reportActionableTrackExpense = Object.values(selfDMReportActionsOnyx ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isActionableTrackExpense)(reportAction));
            mockFetch?.pause?.();
            // Share the tracked expense with an accountant
            (0, IOU_1.trackExpense)({
                report: policyExpenseChat,
                isDraftPolicy: false,
                action: CONST_1.default.IOU.ACTION.SHARE,
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { reportID: policyExpenseChat.reportID, isPolicyExpenseChat: true },
                },
                policyParams: {
                    policy,
                },
                transactionParams: {
                    amount: transaction.amount,
                    currency: transaction.currency,
                    created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                    merchant: transaction.merchant,
                    billable: false,
                    actionableWhisperReportActionID: reportActionableTrackExpense?.reportActionID,
                    linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: selfDMReport.reportID,
                },
                accountantParams: {
                    accountant,
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            const policyExpenseChatOnyx = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${policyExpenseChat.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            const policyOnyx = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                    waitForCollectionCallback: false,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            await mockFetch?.resume?.();
            // Accountant should be still a participant in the expense report
            expect(policyExpenseChatOnyx?.participants?.[accountant.accountID]).toBeTruthy();
            // Accountant role should change to admin
            expect(policyOnyx?.employeeList?.[accountant.login].role).toBe(CONST_1.default.POLICY.ROLE.ADMIN);
        });
    });
    describe('requestMoney', () => {
        it('creates new chat if needed', () => {
            const amount = 10000;
            const comment = 'Giv money plz';
            const merchant = 'KFC';
            let iouReportID;
            let createdAction;
            let iouAction;
            let transactionID;
            let transactionThread;
            let transactionThreadCreatedAction;
            mockFetch?.pause?.();
            (0, IOU_1.requestMoney)({
                report: { reportID: '' },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant,
                    comment,
                },
                shouldGenerateTransactionThreadReport: true,
            });
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // A chat report, a transaction thread, and an iou report should be created
                        const chatReports = Object.values(allReports ?? {}).filter((report) => report?.type === CONST_1.default.REPORT.TYPE.CHAT);
                        const iouReports = Object.values(allReports ?? {}).filter((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                        expect(Object.keys(chatReports).length).toBe(2);
                        expect(Object.keys(iouReports).length).toBe(1);
                        const chatReport = chatReports.at(0);
                        const transactionThreadReport = chatReports.at(1);
                        const iouReport = iouReports.at(0);
                        iouReportID = iouReport?.reportID;
                        transactionThread = transactionThreadReport;
                        expect(iouReport?.participants).toEqual({
                            [RORY_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                            [CARLOS_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                        });
                        // They should be linked together
                        expect(chatReport?.participants).toEqual({ [RORY_ACCOUNT_ID]: RORY_PARTICIPANT, [CARLOS_ACCOUNT_ID]: CARLOS_PARTICIPANT });
                        expect(chatReport?.iouReportID).toBe(iouReport?.reportID);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${iouReportID}`,
                    callback: (iouReportMetadata) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(iouReportMetadata?.isOptimisticReport).toBe(true);
                        expect(iouReportMetadata?.hasOnceLoadedReportActions).toBe(true);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForIOUReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // The IOU report should have a CREATED action and IOU action
                        expect(Object.values(reportActionsForIOUReport ?? {}).length).toBe(2);
                        const createdActions = Object.values(reportActionsForIOUReport ?? {}).filter((reportAction) => reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                        const iouActions = Object.values(reportActionsForIOUReport ?? {}).filter((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        expect(Object.values(createdActions).length).toBe(1);
                        expect(Object.values(iouActions).length).toBe(1);
                        createdAction = createdActions?.at(0);
                        iouAction = iouActions?.at(0);
                        const originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(iouAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(iouAction) : undefined;
                        // The CREATED action should not be created after the IOU action
                        expect(Date.parse(createdAction?.created ?? '')).toBeLessThan(Date.parse(iouAction?.created ?? ''));
                        // The IOUReportID should be correct
                        expect(originalMessage?.IOUReportID).toBe(iouReportID);
                        // The comment should be included in the IOU action
                        expect(originalMessage?.comment).toBe(comment);
                        // The amount in the IOU action should be correct
                        expect(originalMessage?.amount).toBe(amount);
                        // The IOU type should be correct
                        expect(originalMessage?.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                        // Both actions should be pending
                        expect(createdAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(iouAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThread?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForTransactionThread) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // The transaction thread should have a CREATED action
                        expect(Object.values(reportActionsForTransactionThread ?? {}).length).toBe(1);
                        const createdActions = Object.values(reportActionsForTransactionThread ?? {}).filter((reportAction) => reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                        expect(Object.values(createdActions).length).toBe(1);
                        transactionThreadCreatedAction = createdActions.at(0);
                        expect(transactionThreadCreatedAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // There should be one transaction
                        expect(Object.values(allTransactions ?? {}).length).toBe(1);
                        const transaction = Object.values(allTransactions ?? []).find((t) => !(0, EmptyObject_1.isEmptyObject)(t));
                        transactionID = transaction?.transactionID;
                        // The transaction should be attached to the IOU report
                        expect(transaction?.reportID).toBe(iouReportID);
                        // Its amount should match the amount of the expense
                        expect(transaction?.amount).toBe(amount);
                        // The comment should be correct
                        expect(transaction?.comment?.comment).toBe(comment);
                        // It should be pending
                        expect(transaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        // The transactionID on the iou action should match the one from the transactions collection
                        expect(iouAction && (0, ReportActionsUtils_1.getOriginalMessage)(iouAction)?.IOUTransactionID).toBe(transactionID);
                        expect(transaction?.merchant).toBe(merchant);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.SNAPSHOT,
                    waitForCollectionCallback: true,
                    callback: (snapshotData) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // Snapshot data shouldn't be updated optimistically for requestMoney when the current search query type is invoice.
                        expect(snapshotData).toBeUndefined();
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForIOUReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(reportActionsForIOUReport ?? {}).length).toBe(2);
                        Object.values(reportActionsForIOUReport ?? {}).forEach((reportAction) => expect(reportAction?.pendingAction).toBeFalsy());
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                    waitForCollectionCallback: false,
                    callback: (transaction) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(transaction?.pendingAction).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('updates existing chat report if there is one', () => {
            const amount = 10000;
            const comment = 'Giv money plz';
            let chatReport = {
                reportID: '1234',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: { [RORY_ACCOUNT_ID]: RORY_PARTICIPANT, [CARLOS_ACCOUNT_ID]: CARLOS_PARTICIPANT },
            };
            const createdAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
            };
            let iouReportID;
            let iouAction;
            let iouCreatedAction;
            let transactionID;
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`, chatReport)
                .then(() => react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`, {
                [createdAction.reportActionID]: createdAction,
            }))
                .then(() => {
                (0, IOU_1.requestMoney)({
                    report: chatReport,
                    participantParams: {
                        payeeEmail: RORY_EMAIL,
                        payeeAccountID: RORY_ACCOUNT_ID,
                        participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                    },
                    transactionParams: {
                        amount,
                        attendees: [],
                        currency: CONST_1.default.CURRENCY.USD,
                        created: '',
                        merchant: '',
                        comment,
                    },
                    shouldGenerateTransactionThreadReport: true,
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // The same chat report should be reused, a transaction thread and an IOU report should be created
                        expect(Object.values(allReports ?? {}).length).toBe(3);
                        expect(Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.CHAT)?.reportID).toBe(chatReport.reportID);
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.CHAT) ?? chatReport;
                        const iouReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                        iouReportID = iouReport?.reportID;
                        expect(iouReport?.participants).toEqual({
                            [RORY_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                            [CARLOS_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                        });
                        // They should be linked together
                        expect(chatReport.iouReportID).toBe(iouReportID);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`,
                    waitForCollectionCallback: false,
                    callback: (allIOUReportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        iouCreatedAction = Object.values(allIOUReportActions ?? {}).find((reportAction) => reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                        iouAction = Object.values(allIOUReportActions ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        const originalMessage = iouAction ? (0, ReportActionsUtils_1.getOriginalMessage)(iouAction) : null;
                        // The CREATED action should not be created after the IOU action
                        expect(Date.parse(iouCreatedAction?.created ?? '')).toBeLessThan(Date.parse(iouAction?.created ?? ''));
                        // The IOUReportID should be correct
                        expect(originalMessage?.IOUReportID).toBe(iouReportID);
                        // The comment should be included in the IOU action
                        expect(originalMessage?.comment).toBe(comment);
                        // The amount in the IOU action should be correct
                        expect(originalMessage?.amount).toBe(amount);
                        // The IOU action type should be correct
                        expect(originalMessage?.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                        // The IOU action should be pending
                        expect(iouAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // There should be one transaction
                        expect(Object.values(allTransactions ?? {}).length).toBe(1);
                        const transaction = Object.values(allTransactions ?? {}).find((t) => !(0, EmptyObject_1.isEmptyObject)(t));
                        transactionID = transaction?.transactionID;
                        const originalMessage = iouAction ? (0, ReportActionsUtils_1.getOriginalMessage)(iouAction) : null;
                        // The transaction should be attached to the IOU report
                        expect(transaction?.reportID).toBe(iouReportID);
                        // Its amount should match the amount of the expense
                        expect(transaction?.amount).toBe(amount);
                        // The comment should be correct
                        expect(transaction?.comment?.comment).toBe(comment);
                        expect(transaction?.merchant).toBe(CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT);
                        // It should be pending
                        expect(transaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        // The transactionID on the iou action should match the one from the transactions collection
                        expect(originalMessage?.IOUTransactionID).toBe(transactionID);
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForIOUReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(reportActionsForIOUReport ?? {}).length).toBe(2);
                        Object.values(reportActionsForIOUReport ?? {}).forEach((reportAction) => expect(reportAction?.pendingAction).toBeFalsy());
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                    callback: (transaction) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(transaction?.pendingAction).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('updates existing IOU report if there is one', () => {
            const amount = 10000;
            const comment = 'Giv money plz';
            const chatReportID = '1234';
            const iouReportID = '5678';
            let chatReport = {
                reportID: chatReportID,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                iouReportID,
                participants: { [RORY_ACCOUNT_ID]: RORY_PARTICIPANT, [CARLOS_ACCOUNT_ID]: CARLOS_PARTICIPANT },
            };
            const createdAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
            };
            const existingTransaction = {
                transactionID: (0, NumberUtils_1.rand64)(),
                amount: 1000,
                comment: {
                    comment: 'Existing transaction',
                    attendees: [{ email: 'text@expensify.com', displayName: 'Test User', avatarUrl: '' }],
                },
                created: DateUtils_1.default.getDBTime(),
                currency: CONST_1.default.CURRENCY.USD,
                merchant: '',
                reportID: '',
            };
            let iouReport = {
                reportID: iouReportID,
                chatReportID,
                type: CONST_1.default.REPORT.TYPE.IOU,
                ownerAccountID: RORY_ACCOUNT_ID,
                managerID: CARLOS_ACCOUNT_ID,
                currency: CONST_1.default.CURRENCY.USD,
                total: existingTransaction.amount,
            };
            const iouAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                actorAccountID: RORY_ACCOUNT_ID,
                created: DateUtils_1.default.getDBTime(),
                originalMessage: {
                    IOUReportID: iouReportID,
                    IOUTransactionID: existingTransaction.transactionID,
                    amount: existingTransaction.amount,
                    currency: CONST_1.default.CURRENCY.USD,
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                    participantAccountIDs: [RORY_ACCOUNT_ID, CARLOS_ACCOUNT_ID],
                },
            };
            let newIOUAction;
            let newTransaction;
            mockFetch?.pause?.();
            return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`, chatReport)
                .then(() => react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReportID}`, iouReport ?? null))
                .then(() => react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`, {
                [createdAction.reportActionID]: createdAction,
                [iouAction.reportActionID]: iouAction,
            }))
                .then(() => react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${existingTransaction.transactionID}`, existingTransaction))
                .then(() => {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                        },
                        transactionParams: {
                            amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant: '',
                            comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // No new reports should be created
                        expect(Object.values(allReports ?? {}).length).toBe(3);
                        expect(Object.values(allReports ?? {}).find((report) => report?.reportID === chatReportID)).toBeTruthy();
                        expect(Object.values(allReports ?? {}).find((report) => report?.reportID === iouReportID)).toBeTruthy();
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.CHAT);
                        iouReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                        // The total on the iou report should be updated
                        expect(iouReport?.total).toBe(11000);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForIOUReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(reportActionsForIOUReport ?? {}).length).toBe(3);
                        newIOUAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => reportAction?.reportActionID !== createdAction.reportActionID && reportAction?.reportActionID !== iouAction?.reportActionID);
                        const newOriginalMessage = newIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(newIOUAction) : null;
                        // The IOUReportID should be correct
                        expect((0, ReportActionsUtils_1.getOriginalMessage)(iouAction)?.IOUReportID).toBe(iouReportID);
                        // The comment should be included in the IOU action
                        expect(newOriginalMessage?.comment).toBe(comment);
                        // The amount in the IOU action should be correct
                        expect(newOriginalMessage?.amount).toBe(amount);
                        // The type of the IOU action should be correct
                        expect(newOriginalMessage?.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                        // The IOU action should be pending
                        expect(newIOUAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // There should be two transactions
                        expect(Object.values(allTransactions ?? {}).length).toBe(2);
                        newTransaction = Object.values(allTransactions ?? {}).find((transaction) => transaction?.transactionID !== existingTransaction.transactionID);
                        expect(newTransaction?.reportID).toBe(iouReportID);
                        expect(newTransaction?.amount).toBe(amount);
                        expect(newTransaction?.comment?.comment).toBe(comment);
                        expect(newTransaction?.merchant).toBe(CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT);
                        expect(newTransaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        // The transactionID on the iou action should match the one from the transactions collection
                        expect((0, ReportActionsUtils_1.isMoneyRequestAction)(newIOUAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(newIOUAction)?.IOUTransactionID : undefined).toBe(newTransaction?.transactionID);
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForNetworkPromises_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForIOUReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(reportActionsForIOUReport ?? {}).length).toBe(3);
                        Object.values(reportActionsForIOUReport ?? {}).forEach((reportAction) => expect(reportAction?.pendingAction).toBeFalsy());
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.values(allTransactions ?? {}).forEach((transaction) => expect(transaction?.pendingAction).toBeFalsy());
                        resolve();
                    },
                });
            }));
        });
        it('correctly implements RedBrickRoad error handling', () => {
            const amount = 10000;
            const comment = 'Giv money plz';
            let chatReportID;
            let iouReportID;
            let createdAction;
            let iouAction;
            let transactionID;
            let transactionThreadReport;
            let transactionThreadAction;
            mockFetch?.pause?.();
            (0, IOU_1.requestMoney)({
                report: { reportID: '' },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment,
                },
                shouldGenerateTransactionThreadReport: true,
            });
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // A chat report, transaction thread and an iou report should be created
                        const chatReports = Object.values(allReports ?? {}).filter((report) => report?.type === CONST_1.default.REPORT.TYPE.CHAT);
                        const iouReports = Object.values(allReports ?? {}).filter((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                        expect(Object.values(chatReports).length).toBe(2);
                        expect(Object.values(iouReports).length).toBe(1);
                        const chatReport = chatReports.at(0);
                        chatReportID = chatReport?.reportID;
                        transactionThreadReport = chatReports.at(1);
                        const iouReport = iouReports.at(0);
                        iouReportID = iouReport?.reportID;
                        expect(chatReport?.participants).toStrictEqual({ [RORY_ACCOUNT_ID]: RORY_PARTICIPANT, [CARLOS_ACCOUNT_ID]: CARLOS_PARTICIPANT });
                        // They should be linked together
                        expect(chatReport?.participants).toStrictEqual({ [RORY_ACCOUNT_ID]: RORY_PARTICIPANT, [CARLOS_ACCOUNT_ID]: CARLOS_PARTICIPANT });
                        expect(chatReport?.iouReportID).toBe(iouReport?.reportID);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForIOUReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // The chat report should have a CREATED action and IOU action
                        expect(Object.values(reportActionsForIOUReport ?? {}).length).toBe(2);
                        const createdActions = Object.values(reportActionsForIOUReport ?? {}).filter((reportAction) => reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED) ?? null;
                        const iouActions = Object.values(reportActionsForIOUReport ?? {}).filter((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction)) ?? null;
                        expect(Object.values(createdActions).length).toBe(1);
                        expect(Object.values(iouActions).length).toBe(1);
                        createdAction = createdActions.at(0);
                        iouAction = iouActions.at(0);
                        const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(iouAction);
                        // The CREATED action should not be created after the IOU action
                        expect(Date.parse(createdAction?.created ?? '')).toBeLessThan(Date.parse(iouAction?.created ?? ''));
                        // The IOUReportID should be correct
                        expect(originalMessage?.IOUReportID).toBe(iouReportID);
                        // The comment should be included in the IOU action
                        expect(originalMessage?.comment).toBe(comment);
                        // The amount in the IOU action should be correct
                        expect(originalMessage?.amount).toBe(amount);
                        // The type should be correct
                        expect(originalMessage?.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                        // Both actions should be pending
                        expect(createdAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(iouAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // There should be one transaction
                        expect(Object.values(allTransactions ?? {}).length).toBe(1);
                        const transaction = Object.values(allTransactions ?? {}).find((t) => !(0, EmptyObject_1.isEmptyObject)(t));
                        transactionID = transaction?.transactionID;
                        expect(transaction?.reportID).toBe(iouReportID);
                        expect(transaction?.amount).toBe(amount);
                        expect(transaction?.comment?.comment).toBe(comment);
                        expect(transaction?.merchant).toBe(CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT);
                        expect(transaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        // The transactionID on the iou action should match the one from the transactions collection
                        expect(iouAction && (0, ReportActionsUtils_1.getOriginalMessage)(iouAction)?.IOUTransactionID).toBe(transactionID);
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                return mockFetch?.resume?.();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForIOUReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(reportActionsForIOUReport ?? {}).length).toBe(2);
                        iouAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        expect(iouAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (reportActionsForTransactionThread) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(reportActionsForTransactionThread ?? {}).length).toBe(3);
                        transactionThreadAction = Object.values(reportActionsForTransactionThread?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport?.reportID}`] ?? {}).find((reportAction) => reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                        expect(transactionThreadAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                    waitForCollectionCallback: false,
                    callback: (transaction) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(transaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(transaction?.errors).toBeTruthy();
                        expect(Object.values(transaction?.errors ?? {}).at(0)).toEqual((0, Localize_1.translateLocal)('iou.error.genericCreateFailureMessage'));
                        resolve();
                    },
                });
            }))
                // If the user clears the errors on the IOU action
                .then(() => new Promise((resolve) => {
                if (iouReportID) {
                    (0, ReportActions_1.clearAllRelatedReportActionErrors)(iouReportID, iouAction ?? null);
                }
                resolve();
            }))
                // Then the reportAction from chat report should be removed from Onyx
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        iouAction = Object.values(reportActionsForReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        expect(iouAction).toBeFalsy();
                        resolve();
                    },
                });
            }))
                // Then the reportAction from iou report should be removed from Onyx
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        iouAction = Object.values(reportActionsForReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        expect(iouAction).toBeFalsy();
                        resolve();
                    },
                });
            }))
                // Then the reportAction from transaction report should be removed from Onyx
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(reportActionsForReport).toMatchObject({});
                        resolve();
                    },
                });
            }))
                // Along with the associated transaction
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                    waitForCollectionCallback: false,
                    callback: (transaction) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(transaction).toBeFalsy();
                        resolve();
                    },
                });
            }))
                // If a user clears the errors on the CREATED action (which, technically are just errors on the report)
                .then(() => new Promise((resolve) => {
                if (chatReportID) {
                    (0, Report_1.deleteReport)(chatReportID);
                }
                if (transactionThreadReport?.reportID) {
                    (0, Report_1.deleteReport)(transactionThreadReport?.reportID);
                }
                resolve();
            }))
                // Then the report should be deleted
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.values(allReports ?? {}).forEach((report) => expect(report).toBeFalsy());
                        resolve();
                    },
                });
            }))
                // All reportActions should also be deleted
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: false,
                    callback: (allReportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.values(allReportActions ?? {}).forEach((reportAction) => expect(reportAction).toBeFalsy());
                        resolve();
                    },
                });
            }))
                // All transactions should also be deleted
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.values(allTransactions ?? {}).forEach((transaction) => expect(transaction).toBeFalsy());
                        resolve();
                    },
                });
            }))
                // Cleanup
                .then(mockFetch?.succeed));
        });
        it('does not trigger notifyNewAction when doing the money request in a money request report', () => {
            (0, IOU_1.requestMoney)({
                report: { reportID: '123', type: CONST_1.default.REPORT.TYPE.EXPENSE },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: 1,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: '',
                },
                shouldGenerateTransactionThreadReport: true,
            });
            expect(Report_1.notifyNewAction).toHaveBeenCalledTimes(0);
        });
        it('trigger notifyNewAction when doing the money request in a chat report', () => {
            (0, IOU_1.requestMoney)({
                report: { reportID: '123' },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: 1,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: '',
                },
                shouldGenerateTransactionThreadReport: true,
            });
            expect(Navigation_1.default.setNavigationActionToMicrotaskQueue).toHaveBeenCalledTimes(1);
        });
    });
    describe('createDistanceRequest', () => {
        it('does not trigger notifyNewAction when doing the money request in a money request report', () => {
            (0, IOU_1.createDistanceRequest)({
                report: { reportID: '123', type: CONST_1.default.REPORT.TYPE.EXPENSE },
                participants: [],
                transactionParams: {
                    amount: 1,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: '',
                    validWaypoints: {},
                },
            });
            expect(Report_1.notifyNewAction).toHaveBeenCalledTimes(0);
        });
        it('trigger notifyNewAction when doing the money request in a chat report', () => {
            (0, IOU_1.createDistanceRequest)({
                report: { reportID: '123' },
                participants: [],
                transactionParams: {
                    amount: 1,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment: '',
                    validWaypoints: {},
                },
            });
            expect(Report_1.notifyNewAction).toHaveBeenCalledTimes(1);
        });
    });
    describe('split expense', () => {
        it('creates and updates new chats and IOUs as needed', () => {
            jest.setTimeout(10 * 1000);
            /*
             * Given that:
             *   - Rory and Carlos have chatted before
             *   - Rory and Jules have chatted before and have an active IOU report
             *   - Rory and Vit have never chatted together before
             *   - There is no existing group chat with the four of them
             */
            const amount = 400;
            const comment = 'Yes, I am splitting a bill for $4 USD';
            const merchant = 'Yema Kitchen';
            let carlosChatReport = {
                reportID: (0, NumberUtils_1.rand64)(),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: { [RORY_ACCOUNT_ID]: RORY_PARTICIPANT, [CARLOS_ACCOUNT_ID]: CARLOS_PARTICIPANT },
            };
            const carlosCreatedAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
                reportID: carlosChatReport.reportID,
            };
            const julesIOUReportID = (0, NumberUtils_1.rand64)();
            let julesChatReport = {
                reportID: (0, NumberUtils_1.rand64)(),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                iouReportID: julesIOUReportID,
                participants: { [RORY_ACCOUNT_ID]: RORY_PARTICIPANT, [JULES_ACCOUNT_ID]: JULES_PARTICIPANT },
            };
            const julesChatCreatedAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
                reportID: julesChatReport.reportID,
            };
            const julesCreatedAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                created: DateUtils_1.default.getDBTime(),
                reportID: julesIOUReportID,
            };
            jest.advanceTimersByTime(200);
            const julesExistingTransaction = {
                transactionID: (0, NumberUtils_1.rand64)(),
                amount: 1000,
                comment: {
                    comment: 'This is an existing transaction',
                    attendees: [{ email: 'text@expensify.com', displayName: 'Test User', avatarUrl: '' }],
                },
                created: DateUtils_1.default.getDBTime(),
                currency: '',
                merchant: '',
                reportID: '',
            };
            let julesIOUReport = {
                reportID: julesIOUReportID,
                chatReportID: julesChatReport.reportID,
                type: CONST_1.default.REPORT.TYPE.IOU,
                ownerAccountID: RORY_ACCOUNT_ID,
                managerID: JULES_ACCOUNT_ID,
                currency: CONST_1.default.CURRENCY.USD,
                total: julesExistingTransaction?.amount,
            };
            const julesExistingIOUAction = {
                reportActionID: (0, NumberUtils_1.rand64)(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                actorAccountID: RORY_ACCOUNT_ID,
                created: DateUtils_1.default.getDBTime(),
                originalMessage: {
                    IOUReportID: julesIOUReportID,
                    IOUTransactionID: julesExistingTransaction?.transactionID,
                    amount: julesExistingTransaction?.amount ?? 0,
                    currency: CONST_1.default.CURRENCY.USD,
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                    participantAccountIDs: [RORY_ACCOUNT_ID, JULES_ACCOUNT_ID],
                },
                reportID: julesIOUReportID,
            };
            let carlosIOUReport;
            let carlosIOUAction;
            let carlosIOUCreatedAction;
            let carlosTransaction;
            let julesIOUAction;
            let julesIOUCreatedAction;
            let julesTransaction;
            let vitChatReport;
            let vitIOUReport;
            let vitCreatedAction;
            let vitIOUAction;
            let vitTransaction;
            let groupChat;
            let groupCreatedAction;
            let groupIOUAction;
            let groupTransaction;
            const reportCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT, [carlosChatReport, julesChatReport, julesIOUReport], (item) => item.reportID);
            const carlosActionsCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}`, [
                {
                    [carlosCreatedAction.reportActionID]: carlosCreatedAction,
                },
            ], (item) => item[carlosCreatedAction.reportActionID].reportID);
            const julesActionsCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}`, [
                {
                    [julesCreatedAction.reportActionID]: julesCreatedAction,
                    [julesExistingIOUAction.reportActionID]: julesExistingIOUAction,
                },
            ], (item) => item[julesCreatedAction.reportActionID].reportID);
            const julesCreatedActionsCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}`, [
                {
                    [julesChatCreatedAction.reportActionID]: julesChatCreatedAction,
                },
            ], (item) => item[julesChatCreatedAction.reportActionID].reportID);
            return react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT, {
                ...reportCollectionDataSet,
            })
                .then(() => react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, {
                ...carlosActionsCollectionDataSet,
                ...julesCreatedActionsCollectionDataSet,
                ...julesActionsCollectionDataSet,
            }))
                .then(() => react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${julesExistingTransaction?.transactionID}`, julesExistingTransaction))
                .then(() => {
                // When we split a bill offline
                mockFetch?.pause?.();
                (0, IOU_1.splitBill)(
                // TODO: Migrate after the backend accepts accountIDs
                {
                    participants: [
                        [CARLOS_EMAIL, String(CARLOS_ACCOUNT_ID)],
                        [JULES_EMAIL, String(JULES_ACCOUNT_ID)],
                        [VIT_EMAIL, String(VIT_ACCOUNT_ID)],
                    ].map(([email, accountID]) => ({ login: email, accountID: Number(accountID) })),
                    currentUserLogin: RORY_EMAIL,
                    currentUserAccountID: RORY_ACCOUNT_ID,
                    amount,
                    comment,
                    currency: CONST_1.default.CURRENCY.USD,
                    merchant,
                    created: '',
                    tag: '',
                    existingSplitChatReportID: '',
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // There should now be 10 reports
                        expect(Object.values(allReports ?? {}).length).toBe(10);
                        // 1. The chat report with Rory + Carlos
                        carlosChatReport = Object.values(allReports ?? {}).find((report) => report?.reportID === carlosChatReport?.reportID);
                        expect((0, EmptyObject_1.isEmptyObject)(carlosChatReport)).toBe(false);
                        expect(carlosChatReport?.pendingFields).toBeFalsy();
                        // 2. The IOU report with Rory + Carlos (new)
                        carlosIOUReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU && report.managerID === CARLOS_ACCOUNT_ID);
                        expect((0, EmptyObject_1.isEmptyObject)(carlosIOUReport)).toBe(false);
                        expect(carlosIOUReport?.total).toBe(amount / 4);
                        // 3. The chat report with Rory + Jules
                        julesChatReport = Object.values(allReports ?? {}).find((report) => report?.reportID === julesChatReport?.reportID);
                        expect((0, EmptyObject_1.isEmptyObject)(julesChatReport)).toBe(false);
                        expect(julesChatReport?.pendingFields).toBeFalsy();
                        // 4. The IOU report with Rory + Jules
                        julesIOUReport = Object.values(allReports ?? {}).find((report) => report?.reportID === julesIOUReport?.reportID);
                        expect((0, EmptyObject_1.isEmptyObject)(julesIOUReport)).toBe(false);
                        expect(julesChatReport?.pendingFields).toBeFalsy();
                        expect(julesIOUReport?.total).toBe((julesExistingTransaction?.amount ?? 0) + amount / 4);
                        // 5. The chat report with Rory + Vit (new)
                        vitChatReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.CHAT &&
                            (0, fast_equals_1.deepEqual)(report.participants, { [RORY_ACCOUNT_ID]: RORY_PARTICIPANT, [VIT_ACCOUNT_ID]: VIT_PARTICIPANT }));
                        expect((0, EmptyObject_1.isEmptyObject)(vitChatReport)).toBe(false);
                        expect(vitChatReport?.pendingFields).toStrictEqual({ createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD });
                        // 6. The IOU report with Rory + Vit (new)
                        vitIOUReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU && report.managerID === VIT_ACCOUNT_ID);
                        expect((0, EmptyObject_1.isEmptyObject)(vitIOUReport)).toBe(false);
                        expect(vitIOUReport?.total).toBe(amount / 4);
                        // 7. The group chat with everyone
                        groupChat = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.CHAT &&
                            (0, fast_equals_1.deepEqual)(report.participants, {
                                [CARLOS_ACCOUNT_ID]: CARLOS_PARTICIPANT,
                                [JULES_ACCOUNT_ID]: JULES_PARTICIPANT,
                                [VIT_ACCOUNT_ID]: VIT_PARTICIPANT,
                                [RORY_ACCOUNT_ID]: RORY_PARTICIPANT,
                            }));
                        expect((0, EmptyObject_1.isEmptyObject)(groupChat)).toBe(false);
                        expect(groupChat?.pendingFields).toStrictEqual({ createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD });
                        // The 1:1 chat reports and the IOU reports should be linked together
                        expect(carlosChatReport?.iouReportID).toBe(carlosIOUReport?.reportID);
                        expect(carlosIOUReport?.chatReportID).toBe(carlosChatReport?.reportID);
                        Object.values(carlosIOUReport?.participants ?? {}).forEach((participant) => {
                            expect(participant.notificationPreference).toBe(CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN);
                        });
                        expect(julesChatReport?.iouReportID).toBe(julesIOUReport?.reportID);
                        expect(julesIOUReport?.chatReportID).toBe(julesChatReport?.reportID);
                        expect(vitChatReport?.iouReportID).toBe(vitIOUReport?.reportID);
                        expect(vitIOUReport?.chatReportID).toBe(vitChatReport?.reportID);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (allReportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // There should be reportActions on all 7 chat reports + 3 IOU reports in each 1:1 chat
                        expect(Object.values(allReportActions ?? {}).length).toBe(10);
                        const carlosReportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${carlosChatReport?.iouReportID}`];
                        const julesReportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${julesChatReport?.iouReportID}`];
                        const vitReportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${vitChatReport?.iouReportID}`];
                        const groupReportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${groupChat?.reportID}`];
                        // Carlos DM should have two reportActions – the existing CREATED action and a pending IOU action
                        expect(Object.values(carlosReportActions ?? {}).length).toBe(2);
                        carlosIOUCreatedAction = Object.values(carlosReportActions ?? {}).find((reportAction) => reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                        carlosIOUAction = Object.values(carlosReportActions ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        const carlosOriginalMessage = carlosIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(carlosIOUAction) : undefined;
                        expect(carlosIOUAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(carlosOriginalMessage?.IOUReportID).toBe(carlosIOUReport?.reportID);
                        expect(carlosOriginalMessage?.amount).toBe(amount / 4);
                        expect(carlosOriginalMessage?.comment).toBe(comment);
                        expect(carlosOriginalMessage?.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                        expect(Date.parse(carlosIOUCreatedAction?.created ?? '')).toBeLessThan(Date.parse(carlosIOUAction?.created ?? ''));
                        // Jules DM should have three reportActions, the existing CREATED action, the existing IOU action, and a new pending IOU action
                        expect(Object.values(julesReportActions ?? {}).length).toBe(3);
                        expect(julesReportActions?.[julesCreatedAction.reportActionID]).toStrictEqual(julesCreatedAction);
                        julesIOUCreatedAction = Object.values(julesReportActions ?? {}).find((reportAction) => reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                        julesIOUAction = Object.values(julesReportActions ?? {}).find((reportAction) => reportAction.reportActionID !== julesCreatedAction.reportActionID && reportAction.reportActionID !== julesExistingIOUAction.reportActionID);
                        const julesOriginalMessage = julesIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(julesIOUAction) : undefined;
                        expect(julesIOUAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(julesOriginalMessage?.IOUReportID).toBe(julesIOUReport?.reportID);
                        expect(julesOriginalMessage?.amount).toBe(amount / 4);
                        expect(julesOriginalMessage?.comment).toBe(comment);
                        expect(julesOriginalMessage?.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                        expect(Date.parse(julesIOUCreatedAction?.created ?? '')).toBeLessThan(Date.parse(julesIOUAction?.created ?? ''));
                        // Vit DM should have two reportActions – a pending CREATED action and a pending IOU action
                        expect(Object.values(vitReportActions ?? {}).length).toBe(2);
                        vitCreatedAction = Object.values(vitReportActions ?? {}).find((reportAction) => reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                        vitIOUAction = Object.values(vitReportActions ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        const vitOriginalMessage = vitIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(vitIOUAction) : undefined;
                        expect(vitCreatedAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(vitIOUAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(vitOriginalMessage?.IOUReportID).toBe(vitIOUReport?.reportID);
                        expect(vitOriginalMessage?.amount).toBe(amount / 4);
                        expect(vitOriginalMessage?.comment).toBe(comment);
                        expect(vitOriginalMessage?.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE);
                        expect(Date.parse(vitCreatedAction?.created ?? '')).toBeLessThan(Date.parse(vitIOUAction?.created ?? ''));
                        // Group chat should have two reportActions – a pending CREATED action and a pending IOU action w/ type SPLIT
                        expect(Object.values(groupReportActions ?? {}).length).toBe(2);
                        groupCreatedAction = Object.values(groupReportActions ?? {}).find((reportAction) => reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                        groupIOUAction = Object.values(groupReportActions ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        const groupOriginalMessage = groupIOUAction ? (0, ReportActionsUtils_1.getOriginalMessage)(groupIOUAction) : undefined;
                        expect(groupCreatedAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(groupIOUAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(groupOriginalMessage).not.toHaveProperty('IOUReportID');
                        expect(groupOriginalMessage?.type).toBe(CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT);
                        expect(Date.parse(groupCreatedAction?.created ?? '')).toBeLessThanOrEqual(Date.parse(groupIOUAction?.created ?? ''));
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        /* There should be 5 transactions
                         *   – one existing one with Jules
                         *   - one for each of the three IOU reports
                         *   - one on the group chat w/ deleted report
                         */
                        expect(Object.values(allTransactions ?? {}).length).toBe(5);
                        expect(allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${julesExistingTransaction?.transactionID}`]).toBeTruthy();
                        carlosTransaction = Object.values(allTransactions ?? {}).find((transaction) => carlosIOUAction && transaction?.transactionID === (0, ReportActionsUtils_1.getOriginalMessage)(carlosIOUAction)?.IOUTransactionID);
                        julesTransaction = Object.values(allTransactions ?? {}).find((transaction) => julesIOUAction && transaction?.transactionID === (0, ReportActionsUtils_1.getOriginalMessage)(julesIOUAction)?.IOUTransactionID);
                        vitTransaction = Object.values(allTransactions ?? {}).find((transaction) => vitIOUAction && transaction?.transactionID === (0, ReportActionsUtils_1.getOriginalMessage)(vitIOUAction)?.IOUTransactionID);
                        groupTransaction = Object.values(allTransactions ?? {}).find((transaction) => transaction?.reportID === CONST_1.default.REPORT.SPLIT_REPORT_ID);
                        expect(carlosTransaction?.reportID).toBe(carlosIOUReport?.reportID);
                        expect(julesTransaction?.reportID).toBe(julesIOUReport?.reportID);
                        expect(vitTransaction?.reportID).toBe(vitIOUReport?.reportID);
                        expect(groupTransaction).toBeTruthy();
                        expect(carlosTransaction?.amount).toBe(amount / 4);
                        expect(julesTransaction?.amount).toBe(amount / 4);
                        expect(vitTransaction?.amount).toBe(amount / 4);
                        expect(groupTransaction?.amount).toBe(amount);
                        expect(carlosTransaction?.comment?.comment).toBe(comment);
                        expect(julesTransaction?.comment?.comment).toBe(comment);
                        expect(vitTransaction?.comment?.comment).toBe(comment);
                        expect(groupTransaction?.comment?.comment).toBe(comment);
                        expect(carlosTransaction?.merchant).toBe(merchant);
                        expect(julesTransaction?.merchant).toBe(merchant);
                        expect(vitTransaction?.merchant).toBe(merchant);
                        expect(groupTransaction?.merchant).toBe(merchant);
                        expect(carlosTransaction?.comment?.source).toBe(CONST_1.default.IOU.TYPE.SPLIT);
                        expect(julesTransaction?.comment?.source).toBe(CONST_1.default.IOU.TYPE.SPLIT);
                        expect(vitTransaction?.comment?.source).toBe(CONST_1.default.IOU.TYPE.SPLIT);
                        expect(carlosTransaction?.comment?.originalTransactionID).toBe(groupTransaction?.transactionID);
                        expect(julesTransaction?.comment?.originalTransactionID).toBe(groupTransaction?.transactionID);
                        expect(vitTransaction?.comment?.originalTransactionID).toBe(groupTransaction?.transactionID);
                        expect(carlosTransaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(julesTransaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(vitTransaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(groupTransaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                    waitForCollectionCallback: false,
                    callback: (allPersonalDetails) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(allPersonalDetails).toMatchObject({
                            [VIT_ACCOUNT_ID]: {
                                accountID: VIT_ACCOUNT_ID,
                                displayName: VIT_EMAIL,
                                login: VIT_EMAIL,
                            },
                        });
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForNetworkPromises_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.values(allReports ?? {}).forEach((report) => {
                            if (!report?.pendingFields) {
                                return;
                            }
                            Object.values(report?.pendingFields).forEach((pendingField) => expect(pendingField).toBeFalsy());
                        });
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (allReportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.values(allReportActions ?? {}).forEach((reportAction) => expect(reportAction?.pendingAction).toBeFalsy());
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        Object.values(allTransactions ?? {}).forEach((transaction) => expect(transaction?.pendingAction).toBeFalsy());
                        resolve();
                    },
                });
            }));
        });
        it('should update split chat report lastVisibleActionCreated to the report preview action', async () => {
            // Given a expense chat with no expenses
            const workspaceReportID = '1';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${workspaceReportID}`, { reportID: workspaceReportID, isOwnPolicyExpenseChat: true });
            // When the user split bill on the workspace
            (0, IOU_1.splitBill)({
                participants: [{ reportID: workspaceReportID }],
                currentUserLogin: RORY_EMAIL,
                currentUserAccountID: RORY_ACCOUNT_ID,
                comment: '',
                amount: 100,
                currency: CONST_1.default.CURRENCY.USD,
                merchant: 'test',
                created: '',
                existingSplitChatReportID: workspaceReportID,
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Then the expense chat lastVisibleActionCreated should be updated to the report preview action created
            const reportPreviewAction = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${workspaceReportID}`,
                    callback: (reportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(Object.values(reportActions ?? {}).find((action) => action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW));
                    },
                });
            });
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${workspaceReportID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(report?.lastVisibleActionCreated).toBe(reportPreviewAction?.created);
                        resolve(report);
                    },
                });
            });
        });
        it('should update split chat report lastVisibleActionCreated to the latest IOU action when split bill in a DM', async () => {
            // Given a DM chat with no expenses
            const reportID = '1';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
                reportID,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: { [RORY_ACCOUNT_ID]: RORY_PARTICIPANT, [CARLOS_ACCOUNT_ID]: CARLOS_PARTICIPANT },
            });
            // When the user split bill twice on the DM
            (0, IOU_1.splitBill)({
                participants: [{ accountID: CARLOS_ACCOUNT_ID, login: CARLOS_EMAIL }],
                currentUserLogin: RORY_EMAIL,
                currentUserAccountID: RORY_ACCOUNT_ID,
                comment: '',
                amount: 100,
                currency: CONST_1.default.CURRENCY.USD,
                merchant: 'test',
                created: '',
                existingSplitChatReportID: reportID,
            });
            await (0, waitForBatchedUpdates_1.default)();
            (0, IOU_1.splitBill)({
                participants: [{ accountID: CARLOS_ACCOUNT_ID, login: CARLOS_EMAIL }],
                currentUserLogin: RORY_EMAIL,
                currentUserAccountID: RORY_ACCOUNT_ID,
                comment: '',
                amount: 200,
                currency: CONST_1.default.CURRENCY.USD,
                merchant: 'test',
                created: '',
                existingSplitChatReportID: reportID,
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Then the DM lastVisibleActionCreated should be updated to the second IOU action created
            const iouAction = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
                    callback: (reportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(Object.values(reportActions ?? {}).find((action) => (0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.IOU) && (0, ReportActionsUtils_1.getOriginalMessage)(action)?.amount === 200));
                    },
                });
            });
            const report = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                    callback: (reportVal) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reportVal);
                    },
                });
            });
            expect(report?.lastVisibleActionCreated).toBe(iouAction?.created);
        });
        it('optimistic transaction should be merged with the draft transaction if it is a distance request', async () => {
            // Given a workspace expense chat and a draft split transaction
            const workspaceReportID = '1';
            const transactionAmount = 100;
            const draftTransaction = {
                amount: transactionAmount,
                currency: CONST_1.default.CURRENCY.USD,
                merchant: 'test',
                created: '',
                iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.DISTANCE,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${workspaceReportID}`, { reportID: workspaceReportID, isOwnPolicyExpenseChat: true });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`, draftTransaction);
            // When doing a distance split expense
            (0, IOU_1.splitBill)({
                participants: [{ reportID: workspaceReportID }],
                currentUserLogin: RORY_EMAIL,
                currentUserAccountID: RORY_ACCOUNT_ID,
                existingSplitChatReportID: workspaceReportID,
                ...draftTransaction,
                comment: '',
            });
            await (0, waitForBatchedUpdates_1.default)();
            const optimisticTransaction = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (transactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(Object.values(transactions ?? {}).find((transaction) => transaction?.amount === -(transactionAmount / 2)));
                    },
                });
            });
            // Then the data from the transaction draft should be merged into the optimistic transaction
            expect(optimisticTransaction?.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.DISTANCE);
        });
        it("should update the notification preference of the report to ALWAYS if it's previously hidden", async () => {
            // Given a group chat with hidden notification preference
            const reportID = '1';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
                reportID,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                participants: {
                    [RORY_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                    [CARLOS_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN },
                },
            });
            // When the user split bill on the group chat
            (0, IOU_1.splitBill)({
                participants: [{ accountID: CARLOS_ACCOUNT_ID, login: CARLOS_EMAIL }],
                currentUserLogin: RORY_EMAIL,
                currentUserAccountID: RORY_ACCOUNT_ID,
                comment: '',
                amount: 100,
                currency: CONST_1.default.CURRENCY.USD,
                merchant: 'test',
                created: '',
                existingSplitChatReportID: reportID,
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Then the DM notification preference should be updated to ALWAYS
            const report = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                    callback: (reportVal) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reportVal);
                    },
                });
            });
            expect(report?.participants?.[RORY_ACCOUNT_ID].notificationPreference).toBe(CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS);
        });
        it('the description should not be parsed again after completing the scan split bill without changing the description', async () => {
            const reportID = '1';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
                reportID,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                participants: {
                    [RORY_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                    [CARLOS_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                },
            });
            // Start a scan split bill
            const { splitTransactionID } = (0, IOU_1.startSplitBill)({
                participants: [{ accountID: CARLOS_ACCOUNT_ID, login: CARLOS_EMAIL }],
                currentUserLogin: RORY_EMAIL,
                currentUserAccountID: RORY_ACCOUNT_ID,
                comment: '# test',
                currency: CONST_1.default.CURRENCY.USD,
                existingSplitChatReportID: reportID,
                receipt: {},
                category: undefined,
                tag: undefined,
                taxCode: '',
                taxAmount: 0,
            });
            await (0, waitForBatchedUpdates_1.default)();
            let splitTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransactionID}`);
            // Then the description should be parsed correctly
            expect(splitTransaction?.comment?.comment).toBe('<h1>test</h1>');
            const updatedSplitTransaction = splitTransaction
                ? {
                    ...splitTransaction,
                    amount: 100,
                }
                : undefined;
            const reportActions = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`);
            const iouAction = Object.values(reportActions ?? {}).find((action) => (0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.IOU));
            expect(iouAction).toBeTruthy();
            // Complete this split bill without changing the description
            (0, IOU_1.completeSplitBill)(reportID, iouAction, updatedSplitTransaction, RORY_ACCOUNT_ID, RORY_EMAIL);
            await (0, waitForBatchedUpdates_1.default)();
            splitTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransactionID}`);
            // Then the description should be the same since it was not changed
            expect(splitTransaction?.comment?.comment).toBe('<h1>test</h1>');
        });
    });
    describe('saveSplitTransactions', () => {
        it('should delete the original transaction thread report', async () => {
            const expenseReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            const transaction = {
                amount: 100,
                currency: 'USD',
                transactionID: '1',
                reportID: expenseReport.reportID,
                created: DateUtils_1.default.getDBTime(),
                merchant: 'test',
            };
            const transactionThread = {
                ...(0, reports_1.createRandomReport)(2),
            };
            const iouAction = {
                ...(0, ReportUtils_1.buildOptimisticIOUReportAction)({
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    comment: '',
                    participants: [],
                    transactionID: transaction.transactionID,
                    iouReportID: expenseReport.reportID,
                }),
                childReportID: transactionThread.reportID,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread.reportID}`, transactionThread);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`, {
                [iouAction.reportActionID]: iouAction,
            });
            const draftTransaction = {
                ...transaction,
                comment: {
                    originalTransactionID: transaction.transactionID,
                },
            };
            (0, IOU_1.saveSplitTransactions)(draftTransaction, 1);
            await (0, waitForBatchedUpdates_1.default)();
            const originalTransactionThread = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouAction.childReportID}`,
                    callback: (val) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(val);
                    },
                });
            });
            expect(originalTransactionThread).toBe(undefined);
        });
        it('should remove the original transaction from the search snapshot data', async () => {
            // Given a single expense
            const expenseReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            const transaction = {
                amount: 100,
                currency: 'USD',
                transactionID: '1',
                reportID: expenseReport.reportID,
                created: DateUtils_1.default.getDBTime(),
                merchant: 'test',
            };
            const transactionThread = {
                ...(0, reports_1.createRandomReport)(2),
            };
            const iouAction = {
                ...(0, ReportUtils_1.buildOptimisticIOUReportAction)({
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    comment: '',
                    participants: [],
                    transactionID: transaction.transactionID,
                    iouReportID: expenseReport.reportID,
                }),
                childReportID: transactionThread.reportID,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread.reportID}`, transactionThread);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`, {
                [iouAction.reportActionID]: iouAction,
            });
            const draftTransaction = {
                ...transaction,
                comment: {
                    originalTransactionID: transaction.transactionID,
                },
            };
            // When splitting the expense
            const hash = 1;
            (0, IOU_1.saveSplitTransactions)(draftTransaction, hash);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the original expense/transaction should be removed from the search snapshot data
            const searchSnapshot = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
                    callback: (val) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(val);
                    },
                });
            });
            expect(searchSnapshot?.data[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]).toBe(undefined);
        });
    });
    describe('payMoneyRequestElsewhere', () => {
        it('clears outstanding IOUReport', () => {
            const amount = 10000;
            const comment = 'Giv money plz';
            let chatReport;
            let iouReport;
            let createIOUAction;
            let payIOUAction;
            let transaction;
            (0, IOU_1.requestMoney)({
                report: { reportID: '' },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment,
                },
                shouldGenerateTransactionThreadReport: true,
            });
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(allReports ?? {}).length).toBe(3);
                        const chatReports = Object.values(allReports ?? {}).filter((report) => report?.type === CONST_1.default.REPORT.TYPE.CHAT);
                        chatReport = chatReports.at(0);
                        expect(chatReport).toBeTruthy();
                        expect(chatReport).toHaveProperty('reportID');
                        expect(chatReport).toHaveProperty('iouReportID');
                        iouReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                        expect(iouReport).toBeTruthy();
                        expect(iouReport).toHaveProperty('reportID');
                        expect(iouReport).toHaveProperty('chatReportID');
                        expect(chatReport?.iouReportID).toBe(iouReport?.reportID);
                        expect(iouReport?.chatReportID).toBe(chatReport?.reportID);
                        expect(chatReport?.pendingFields).toBeFalsy();
                        expect(iouReport?.pendingFields).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (allReportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const reportActionsForIOUReport = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.iouReportID}`];
                        createIOUAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        expect(createIOUAction).toBeTruthy();
                        expect(createIOUAction && (0, ReportActionsUtils_1.getOriginalMessage)(createIOUAction)?.IOUReportID).toBe(iouReport?.reportID);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(allTransactions ?? {}).length).toBe(1);
                        transaction = Object.values(allTransactions ?? {}).find((t) => t);
                        expect(transaction).toBeTruthy();
                        expect(transaction?.amount).toBe(amount);
                        expect(transaction?.reportID).toBe(iouReport?.reportID);
                        expect(createIOUAction && (0, ReportActionsUtils_1.getOriginalMessage)(createIOUAction)?.IOUTransactionID).toBe(transaction?.transactionID);
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.pause?.();
                if (chatReport && iouReport) {
                    (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, chatReport, iouReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(allReports ?? {}).length).toBe(3);
                        chatReport = Object.values(allReports ?? {}).find((r) => r?.type === CONST_1.default.REPORT.TYPE.CHAT);
                        iouReport = Object.values(allReports ?? {}).find((r) => r?.type === CONST_1.default.REPORT.TYPE.IOU);
                        expect(chatReport?.iouReportID).toBeFalsy();
                        // expect(iouReport.status).toBe(CONST.REPORT.STATUS_NUM.REIMBURSED);
                        // expect(iouReport.stateNum).toBe(CONST.REPORT.STATE_NUM.APPROVED);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (allReportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const reportActionsForIOUReport = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`];
                        expect(Object.values(reportActionsForIOUReport ?? {}).length).toBe(3);
                        payIOUAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) && (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY);
                        expect(payIOUAction).toBeTruthy();
                        expect(payIOUAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(allReports ?? {}).length).toBe(3);
                        chatReport = Object.values(allReports ?? {}).find((r) => r?.type === CONST_1.default.REPORT.TYPE.CHAT);
                        iouReport = Object.values(allReports ?? {}).find((r) => r?.type === CONST_1.default.REPORT.TYPE.IOU);
                        expect(chatReport?.iouReportID).toBeFalsy();
                        // expect(iouReport.status).toBe(CONST.REPORT.STATUS_NUM.REIMBURSED);
                        // expect(iouReport.stateNum).toBe(CONST.REPORT.STATE_NUM.APPROVED);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (allReportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const reportActionsForIOUReport = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`];
                        expect(Object.values(reportActionsForIOUReport ?? {}).length).toBe(3);
                        payIOUAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) && (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY);
                        resolve();
                        expect(payIOUAction).toBeTruthy();
                        expect(payIOUAction?.pendingAction).toBeFalsy();
                    },
                });
            }));
        });
    });
    describe('pay expense report via ACH', () => {
        const amount = 10000;
        const comment = '💸💸💸💸';
        const merchant = 'NASDAQ';
        afterEach(() => {
            mockFetch?.resume?.();
        });
        it('updates the expense request and expense report when paid while offline', () => {
            let expenseReport;
            let chatReport;
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                        resolve();
                    },
                });
            }))
                .then(() => {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                        },
                        transactionParams: {
                            amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant,
                            comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                        resolve();
                    },
                });
            }))
                .then(() => {
                if (chatReport && expenseReport) {
                    (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.VBBA, chatReport, expenseReport, undefined);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (allActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(Object.values(allActions ?? {})).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                message: expect.arrayContaining([
                                    expect.objectContaining({
                                        html: `paid $${amount / 100}.00 with Expensify`,
                                        text: `paid $${amount / 100}.00 with Expensify`,
                                    }),
                                ]),
                                originalMessage: expect.objectContaining({
                                    amount,
                                    paymentType: CONST_1.default.IOU.PAYMENT_TYPE.VBBA,
                                    type: 'pay',
                                }),
                            }),
                        ]));
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const updatedIOUReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                        const updatedChatReport = Object.values(allReports ?? {}).find((report) => report?.reportID === expenseReport?.chatReportID);
                        expect(updatedIOUReport).toEqual(expect.objectContaining({
                            lastMessageHtml: `paid $${amount / 100}.00 with Expensify`,
                            lastMessageText: `paid $${amount / 100}.00 with Expensify`,
                            statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
                            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                        }));
                        expect(updatedChatReport).toEqual(expect.objectContaining({
                            lastMessageHtml: `paid $${amount / 100}.00 with Expensify`,
                            lastMessageText: `paid $${amount / 100}.00 with Expensify`,
                        }));
                        resolve();
                    },
                });
            }));
        });
        it('shows an error when paying results in an error', () => {
            let expenseReport;
            let chatReport;
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                        resolve();
                    },
                });
            }))
                .then(() => {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                        },
                        transactionParams: {
                            amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant,
                            comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                if (chatReport && expenseReport) {
                    (0, IOU_1.payMoneyRequest)('ACH', chatReport, expenseReport, undefined);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (allActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const erroredAction = Object.values(allActions ?? {}).find((action) => !(0, EmptyObject_1.isEmptyObject)(action?.errors));
                        expect(Object.values(erroredAction?.errors ?? {}).at(0)).toEqual((0, Localize_1.translateLocal)('iou.error.other'));
                        resolve();
                    },
                });
            }));
        });
    });
    describe('payMoneyRequest', () => {
        it('should apply optimistic data correctly', async () => {
            // Given an outstanding IOU report
            const chatReport = {
                ...(0, reports_1.createRandomReport)(0),
                lastReadTime: DateUtils_1.default.getDBTime(),
                lastVisibleActionCreated: DateUtils_1.default.getDBTime(),
            };
            const iouReport = {
                ...(0, reports_1.createRandomReport)(1),
                chatType: undefined,
                type: CONST_1.default.REPORT.TYPE.IOU,
                total: 10,
            };
            mockFetch?.pause?.();
            jest.advanceTimersByTime(10);
            // When paying the IOU report
            (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, chatReport, iouReport);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the optimistic data should be applied correctly
            const payReportAction = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`,
                    callback: (reportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(Object.values(reportActions ?? {}).pop());
                    },
                });
            });
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(report?.lastVisibleActionCreated).toBe(chatReport.lastVisibleActionCreated);
                        expect(report?.hasOutstandingChildRequest).toBe(false);
                        expect(report?.iouReportID).toBeUndefined();
                        expect(new Date(report?.lastReadTime ?? '').getTime()).toBeGreaterThan(new Date(chatReport?.lastReadTime ?? '').getTime());
                        expect(report?.lastMessageText).toBe((0, ReportActionsUtils_1.getReportActionText)(payReportAction));
                        expect(report?.lastMessageHtml).toBe((0, ReportActionsUtils_1.getReportActionHtml)(payReportAction));
                        resolve();
                    },
                });
            });
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(report?.hasOutstandingChildRequest).toBe(false);
                        expect(report?.statusNum).toBe(CONST_1.default.REPORT.STATUS_NUM.REIMBURSED);
                        expect(report?.lastVisibleActionCreated).toBe(payReportAction?.created);
                        expect(report?.lastMessageText).toBe((0, ReportActionsUtils_1.getReportActionText)(payReportAction));
                        expect(report?.lastMessageHtml).toBe((0, ReportActionsUtils_1.getReportActionHtml)(payReportAction));
                        expect(report?.pendingFields).toEqual({
                            preview: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            reimbursed: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        });
                        resolve();
                    },
                });
            });
            mockFetch?.resume?.();
        });
        it('calls notifyNewAction for the top most report', () => {
            // Given two expenses in an iou report where one of them held
            const iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            const transaction1 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const transaction2 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const transactionCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction1.transactionID}`]: transaction1,
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction2.transactionID}`]: transaction2,
            };
            const iouActions = [];
            [transaction1, transaction2].forEach((transaction) => iouActions.push((0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            })));
            const actions = {};
            iouActions.forEach((iouAction) => (actions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouAction.reportActionID}`] = iouAction));
            const actionCollectionDataSet = { [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`]: actions };
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => react_native_onyx_1.default.multiSet({ ...transactionCollectionDataSet, ...actionCollectionDataSet }))
                .then(() => {
                const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID));
                (0, IOU_1.putOnHold)(transaction1.transactionID, 'comment', result.current.ancestorReportsAndReportActions, iouReport.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                // When partially paying  an iou report from the chat report via the report preview
                (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, { reportID: topMostReportID }, iouReport, undefined, false);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                // Then notifyNewAction should be called on the top most report.
                expect(Report_1.notifyNewAction).toHaveBeenCalledWith(topMostReportID, expect.anything());
            });
        });
    });
    describe('a expense chat with a cancelled payment', () => {
        const amount = 10000;
        const comment = '💸💸💸💸';
        const merchant = 'NASDAQ';
        afterEach(() => {
            mockFetch?.resume?.();
        });
        it("has an iouReportID of the cancelled payment's expense report", () => {
            let expenseReport;
            let chatReport;
            // Given a signed in account, which owns a workspace, and has a policy expense chat
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                // Which owns a workspace
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (allReports) => {
                    chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                },
            }))
                .then(() => {
                if (chatReport) {
                    // When an IOU expense is submitted to that policy expense chat
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                        },
                        transactionParams: {
                            amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant,
                            comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => 
            // And given an expense report has now been created which holds the IOU
            (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (allReports) => {
                    expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                },
            }))
                .then(() => {
                // When the expense report is paid elsewhere (but really, any payment option would work)
                if (chatReport && expenseReport) {
                    (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, chatReport, expenseReport, undefined);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                if (chatReport && expenseReport) {
                    // And when the payment is cancelled
                    (0, IOU_1.cancelPayment)(expenseReport, chatReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (allReports) => {
                    const chatReportData = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`];
                    // Then the policy expense chat report has the iouReportID of the IOU expense report
                    expect(chatReportData?.iouReportID).toBe(expenseReport?.reportID);
                },
            }));
        });
    });
    describe('deleteMoneyRequest', () => {
        const amount = 10000;
        const comment = 'Send me money please';
        let chatReport;
        let iouReport;
        let createIOUAction;
        let transaction;
        let thread;
        const TEST_USER_ACCOUNT_ID = 1;
        const TEST_USER_LOGIN = 'test@test.com';
        let IOU_REPORT_ID;
        let reportActionID;
        const REPORT_ACTION = {
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            actorAccountID: TEST_USER_ACCOUNT_ID,
            automatic: false,
            avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
            message: [{ type: 'COMMENT', html: 'Testing a comment', text: 'Testing a comment', translationKey: '' }],
            person: [{ type: 'TEXT', style: 'strong', text: 'Test User' }],
            shouldShow: true,
            created: DateUtils_1.default.getDBTime(),
            reportActionID: '1',
            originalMessage: {
                html: '',
                whisperedTo: [],
            },
        };
        let reportActions;
        beforeEach(async () => {
            // Given mocks are cleared and helpers are set up
            jest.clearAllMocks();
            PusherHelper_1.default.setup();
            // Given a test user is signed in with Onyx setup and some initial data
            await (0, TestHelper_1.signInWithTestUser)(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN);
            (0, User_1.subscribeToUserEvents)();
            await (0, waitForBatchedUpdates_1.default)();
            await (0, TestHelper_1.setPersonalDetails)(TEST_USER_LOGIN, TEST_USER_ACCOUNT_ID);
            // When a submit IOU expense is made
            (0, IOU_1.requestMoney)({
                report: chatReport,
                participantParams: {
                    payeeEmail: TEST_USER_LOGIN,
                    payeeAccountID: TEST_USER_ACCOUNT_ID,
                    participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID },
                },
                transactionParams: {
                    amount,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment,
                },
                shouldGenerateTransactionThreadReport: true,
            });
            await (0, waitForBatchedUpdates_1.default)();
            // When fetching all reports from Onyx
            const allReports = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (reports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reports);
                    },
                });
            });
            // Then we should have exactly 3 reports
            expect(Object.values(allReports ?? {}).length).toBe(3);
            // Then one of them should be a chat report with relevant properties
            chatReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.CHAT);
            expect(chatReport).toBeTruthy();
            expect(chatReport).toHaveProperty('reportID');
            expect(chatReport).toHaveProperty('iouReportID');
            // Then one of them should be an IOU report with relevant properties
            iouReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
            expect(iouReport).toBeTruthy();
            expect(iouReport).toHaveProperty('reportID');
            expect(iouReport).toHaveProperty('chatReportID');
            // Then their IDs should reference each other
            expect(chatReport?.iouReportID).toBe(iouReport?.reportID);
            expect(iouReport?.chatReportID).toBe(chatReport?.reportID);
            // Storing IOU Report ID for further reference
            IOU_REPORT_ID = chatReport?.iouReportID;
            await (0, waitForBatchedUpdates_1.default)();
            // When fetching all report actions from Onyx
            const allReportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (actions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actions);
                    },
                });
            });
            // Then we should find an IOU action with specific properties
            const reportActionsForIOUReport = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.iouReportID}`];
            createIOUAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
            expect(createIOUAction).toBeTruthy();
            expect(createIOUAction && (0, ReportActionsUtils_1.getOriginalMessage)(createIOUAction)?.IOUReportID).toBe(iouReport?.reportID);
            // When fetching all transactions from Onyx
            const allTransactions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (transactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(transactions);
                    },
                });
            });
            // Then we should find a specific transaction with relevant properties
            transaction = Object.values(allTransactions ?? {}).find((t) => t);
            expect(transaction).toBeTruthy();
            expect(transaction?.amount).toBe(amount);
            expect(transaction?.reportID).toBe(iouReport?.reportID);
            expect(createIOUAction && (0, ReportActionsUtils_1.getOriginalMessage)(createIOUAction)?.IOUTransactionID).toBe(transaction?.transactionID);
        });
        afterEach(PusherHelper_1.default.teardown);
        it('delete an expense (IOU Action and transaction) successfully', async () => {
            // Given the fetch operations are paused and an expense is initiated
            mockFetch?.pause?.();
            if (transaction && createIOUAction) {
                // When the expense is deleted
                (0, IOU_1.deleteMoneyRequest)(transaction?.transactionID, createIOUAction, {}, {}, true);
            }
            await (0, waitForBatchedUpdates_1.default)();
            // Then we check if the IOU report action is removed from the report actions collection
            let reportActionsForReport = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (actionsForReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actionsForReport);
                    },
                });
            });
            createIOUAction = Object.values(reportActionsForReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
            // Then the IOU Action should be truthy for offline support.
            expect(createIOUAction).toBeTruthy();
            // Then we check if the transaction is removed from the transactions collection
            const t = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction?.transactionID}`,
                    waitForCollectionCallback: false,
                    callback: (transactionResult) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(transactionResult);
                    },
                });
            });
            expect(t).toBeTruthy();
            expect(t?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            // Given fetch operations are resumed
            mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            // Then we recheck the IOU report action from the report actions collection
            reportActionsForReport = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (actionsForReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actionsForReport);
                    },
                });
            });
            createIOUAction = Object.values(reportActionsForReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
            expect(createIOUAction).toBeFalsy();
            // Then we recheck the transaction from the transactions collection
            const tr = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction?.transactionID}`,
                    waitForCollectionCallback: false,
                    callback: (transactionResult) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(transactionResult);
                    },
                });
            });
            expect(tr).toBeFalsy();
        });
        it('delete the IOU report when there are no expenses left in the IOU report', async () => {
            // Given an IOU report and a paused fetch state
            mockFetch?.pause?.();
            if (transaction && createIOUAction) {
                // When the IOU expense is deleted
                (0, IOU_1.deleteMoneyRequest)(transaction?.transactionID, createIOUAction, {}, {}, true);
            }
            await (0, waitForBatchedUpdates_1.default)();
            let report = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (res) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(res);
                    },
                });
            });
            // Then the report should be truthy for offline support
            expect(report).toBeTruthy();
            // Given the resumed fetch state
            mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            report = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (res) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(res);
                    },
                });
            });
            // Then the report should be falsy so that there is no trace of the expense.
            expect(report).toBeFalsy();
        });
        it('does not delete the IOU report when there are expenses left in the IOU report', async () => {
            // Given multiple expenses on an IOU report
            (0, IOU_1.requestMoney)({
                report: chatReport,
                participantParams: {
                    payeeEmail: TEST_USER_LOGIN,
                    payeeAccountID: TEST_USER_ACCOUNT_ID,
                    participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID },
                },
                transactionParams: {
                    amount,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment,
                },
                shouldGenerateTransactionThreadReport: true,
            });
            await (0, waitForBatchedUpdates_1.default)();
            // When we attempt to delete an expense from the IOU report
            mockFetch?.pause?.();
            if (transaction && createIOUAction) {
                (0, IOU_1.deleteMoneyRequest)(transaction?.transactionID, createIOUAction, {}, {});
            }
            await (0, waitForBatchedUpdates_1.default)();
            // Then expect that the IOU report still exists
            let allReports = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (reports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reports);
                    },
                });
            });
            await (0, waitForBatchedUpdates_1.default)();
            iouReport = Object.values(allReports ?? {}).find((report) => (0, ReportUtils_1.isIOUReport)(report));
            expect(iouReport).toBeTruthy();
            expect(iouReport).toHaveProperty('reportID');
            expect(iouReport).toHaveProperty('chatReportID');
            // Given the resumed fetch state
            await mockFetch?.resume?.();
            allReports = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (reports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reports);
                    },
                });
            });
            // Then expect that the IOU report still exists
            iouReport = Object.values(allReports ?? {}).find((report) => (0, ReportUtils_1.isIOUReport)(report));
            expect(iouReport).toBeTruthy();
            expect(iouReport).toHaveProperty('reportID');
            expect(iouReport).toHaveProperty('chatReportID');
        });
        it('delete the transaction thread if there are no visible comments in the thread', async () => {
            // Given all promises are resolved
            await (0, waitForBatchedUpdates_1.default)();
            jest.advanceTimersByTime(10);
            // Given a transaction thread
            thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
            expect(thread.participants).toStrictEqual({ [CARLOS_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN, role: CONST_1.default.REPORT.ROLE.ADMIN } });
            react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${thread.reportID}`,
                callback: (val) => (reportActions = val),
            });
            await (0, waitForBatchedUpdates_1.default)();
            jest.advanceTimersByTime(10);
            // Given User logins from the participant accounts
            const participantAccountIDs = Object.keys(thread.participants ?? {}).map(Number);
            const userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
            // When Opening a thread report with the given details
            (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction?.reportActionID);
            await (0, waitForBatchedUpdates_1.default)();
            // Then The iou action has the transaction report id as a child report ID
            const allReportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (actions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actions);
                    },
                });
            });
            const reportActionsForIOUReport = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.iouReportID}`];
            createIOUAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
            expect(createIOUAction?.childReportID).toBe(thread.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            // Given Fetch is paused and timers have advanced
            mockFetch?.pause?.();
            jest.advanceTimersByTime(10);
            if (transaction && createIOUAction) {
                // When Deleting an expense
                (0, IOU_1.deleteMoneyRequest)(transaction?.transactionID, createIOUAction, {}, {});
            }
            await (0, waitForBatchedUpdates_1.default)();
            // Then The report for the given thread ID does not exist
            let report = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${thread.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportData) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reportData);
                    },
                });
            });
            expect(report?.reportID).toBeFalsy();
            mockFetch?.resume?.();
            // Then After resuming fetch, the report for the given thread ID still does not exist
            report = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${thread.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportData) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reportData);
                    },
                });
            });
            expect(report?.reportID).toBeFalsy();
        });
        it('delete the transaction thread if there are only changelogs (i.e. MODIFIED_EXPENSE actions) in the thread', async () => {
            // Given all promises are resolved
            await (0, waitForBatchedUpdates_1.default)();
            jest.advanceTimersByTime(10);
            // Given a transaction thread
            thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
            react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${thread.reportID}`,
                callback: (val) => (reportActions = val),
            });
            await (0, waitForBatchedUpdates_1.default)();
            jest.advanceTimersByTime(10);
            // Given User logins from the participant accounts
            const participantAccountIDs = Object.keys(thread.participants ?? {}).map(Number);
            const userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
            // When Opening a thread report with the given details
            (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction?.reportActionID);
            await (0, waitForBatchedUpdates_1.default)();
            // Then The iou action has the transaction report id as a child report ID
            const allReportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (actions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actions);
                    },
                });
            });
            const reportActionsForIOUReport = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.iouReportID}`];
            createIOUAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
            expect(createIOUAction?.childReportID).toBe(thread.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            jest.advanceTimersByTime(10);
            if (transaction && createIOUAction) {
                (0, IOU_1.updateMoneyRequestAmountAndCurrency)({
                    transactionID: transaction.transactionID,
                    transactions: {},
                    transactionThreadReportID: thread.reportID,
                    transactionViolations: {},
                    amount: 20000,
                    currency: CONST_1.default.CURRENCY.USD,
                    taxAmount: 0,
                    taxCode: '',
                    policy: {
                        id: '123',
                        role: 'user',
                        type: CONST_1.default.POLICY.TYPE.TEAM,
                        name: '',
                        owner: '',
                        outputCurrency: '',
                        isPolicyExpenseChatEnabled: false,
                    },
                    policyTagList: {},
                    policyCategories: {},
                });
            }
            await (0, waitForBatchedUpdates_1.default)();
            // Verify there are two actions (created + changelog)
            expect(Object.values(reportActions ?? {}).length).toBe(2);
            // Fetch the updated IOU Action from Onyx
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        createIOUAction = Object.values(reportActionsForReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        resolve();
                    },
                });
            });
            if (transaction && createIOUAction) {
                // When Deleting an expense
                (0, IOU_1.deleteMoneyRequest)(transaction?.transactionID, createIOUAction, {}, {});
            }
            await (0, waitForBatchedUpdates_1.default)();
            // Then, the report for the given thread ID does not exist
            const report = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${thread.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportData) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reportData);
                    },
                });
            });
            expect(report?.reportID).toBeFalsy();
        });
        it('does not delete the transaction thread if there are visible comments in the thread', async () => {
            // Given initial environment is set up
            await (0, waitForBatchedUpdates_1.default)();
            // Given a transaction thread
            thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
            expect(thread.participants).toEqual({ [CARLOS_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN, role: CONST_1.default.REPORT.ROLE.ADMIN } });
            const participantAccountIDs = Object.keys(thread.participants ?? {}).map(Number);
            const userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
            jest.advanceTimersByTime(10);
            (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction?.reportActionID);
            await (0, waitForBatchedUpdates_1.default)();
            react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${thread.reportID}`,
                callback: (val) => (reportActions = val),
            });
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${thread.reportID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(report).toBeTruthy();
                        resolve();
                    },
                });
            });
            jest.advanceTimersByTime(10);
            // When a comment is added
            (0, Report_1.addComment)(thread.reportID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            await (0, waitForBatchedUpdates_1.default)();
            // Then comment details should match the expected report action
            const resultAction = Object.values(reportActions ?? {}).find((reportAction) => reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT);
            reportActionID = resultAction?.reportActionID;
            expect(resultAction?.message).toEqual(REPORT_ACTION.message);
            expect(resultAction?.person).toEqual(REPORT_ACTION.person);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the report should have 2 actions
            expect(Object.values(reportActions ?? {}).length).toBe(2);
            const resultActionAfter = reportActionID ? reportActions?.[reportActionID] : undefined;
            expect(resultActionAfter?.pendingAction).toBeUndefined();
            mockFetch?.pause?.();
            if (transaction && createIOUAction) {
                // When deleting expense
                (0, IOU_1.deleteMoneyRequest)(transaction?.transactionID, createIOUAction, {}, {});
            }
            await (0, waitForBatchedUpdates_1.default)();
            // Then the transaction thread report should still exist
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${thread.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(report).toBeTruthy();
                        resolve();
                    },
                });
            });
            // When fetch resumes
            // Then the transaction thread report should still exist
            mockFetch?.resume?.();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${thread.reportID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(report).toBeTruthy();
                        resolve();
                    },
                });
            });
        });
        it('update the moneyRequestPreview to show [Deleted expense] when appropriate', async () => {
            await (0, waitForBatchedUpdates_1.default)();
            // Given a thread report
            jest.advanceTimersByTime(10);
            thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
            expect(thread.participants).toStrictEqual({ [CARLOS_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN, role: CONST_1.default.REPORT.ROLE.ADMIN } });
            react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${thread.reportID}`,
                callback: (val) => (reportActions = val),
            });
            await (0, waitForBatchedUpdates_1.default)();
            jest.advanceTimersByTime(10);
            const participantAccountIDs = Object.keys(thread.participants ?? {}).map(Number);
            const userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
            (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction?.reportActionID);
            await (0, waitForBatchedUpdates_1.default)();
            const allReportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (actions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actions);
                    },
                });
            });
            const reportActionsForIOUReport = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.iouReportID}`];
            createIOUAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
            expect(createIOUAction?.childReportID).toBe(thread.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            // Given an added comment to the thread report
            jest.advanceTimersByTime(10);
            (0, Report_1.addComment)(thread.reportID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            await (0, waitForBatchedUpdates_1.default)();
            // Fetch the updated IOU Action from Onyx due to addition of comment to transaction thread.
            // This needs to be fetched as `deleteMoneyRequest` depends on `childVisibleActionCount` in `createIOUAction`.
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        createIOUAction = Object.values(reportActionsForReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        resolve();
                    },
                });
            });
            let resultAction = Object.values(reportActions ?? {}).find((reportAction) => reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT);
            reportActionID = resultAction?.reportActionID;
            expect(resultAction?.message).toEqual(REPORT_ACTION.message);
            expect(resultAction?.person).toEqual(REPORT_ACTION.person);
            expect(resultAction?.pendingAction).toBeUndefined();
            await (0, waitForBatchedUpdates_1.default)();
            // Verify there are three actions (created + addcomment) and our optimistic comment has been removed
            expect(Object.values(reportActions ?? {}).length).toBe(2);
            let resultActionAfterUpdate = reportActionID ? reportActions?.[reportActionID] : undefined;
            // Verify that our action is no longer in the loading state
            expect(resultActionAfterUpdate?.pendingAction).toBeUndefined();
            await (0, waitForBatchedUpdates_1.default)();
            // Given an added comment to the IOU report
            react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`,
                callback: (val) => (reportActions = val),
            });
            await (0, waitForBatchedUpdates_1.default)();
            jest.advanceTimersByTime(10);
            if (IOU_REPORT_ID) {
                (0, Report_1.addComment)(IOU_REPORT_ID, 'Testing a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            }
            await (0, waitForBatchedUpdates_1.default)();
            resultAction = Object.values(reportActions ?? {}).find((reportAction) => reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT);
            reportActionID = resultAction?.reportActionID;
            expect(resultAction?.message).toEqual(REPORT_ACTION.message);
            expect(resultAction?.person).toEqual(REPORT_ACTION.person);
            expect(resultAction?.pendingAction).toBeUndefined();
            await (0, waitForBatchedUpdates_1.default)();
            // Verify there are three actions (created + iou + addcomment) and our optimistic comment has been removed
            expect(Object.values(reportActions ?? {}).length).toBe(3);
            resultActionAfterUpdate = reportActionID ? reportActions?.[reportActionID] : undefined;
            // Verify that our action is no longer in the loading state
            expect(resultActionAfterUpdate?.pendingAction).toBeUndefined();
            mockFetch?.pause?.();
            if (transaction && createIOUAction) {
                // When we delete the expense
                (0, IOU_1.deleteMoneyRequest)(transaction.transactionID, createIOUAction, {}, {});
            }
            await (0, waitForBatchedUpdates_1.default)();
            // Then we expect the moneyRequestPreview to show [Deleted expense]
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        createIOUAction = Object.values(reportActionsForReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        expect((0, ReportActionsUtils_1.getReportActionMessage)(createIOUAction)?.isDeletedParentAction).toBeTruthy();
                        resolve();
                    },
                });
            });
            // When we resume fetch
            mockFetch?.resume?.();
            // Then we expect the moneyRequestPreview to show [Deleted expense]
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActionsForReport) => {
                        react_native_onyx_1.default.disconnect(connection);
                        createIOUAction = Object.values(reportActionsForReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        expect((0, ReportActionsUtils_1.getReportActionMessage)(createIOUAction)?.isDeletedParentAction).toBeTruthy();
                        resolve();
                    },
                });
            });
        });
        it('update IOU report and reportPreview with new totals and messages if the IOU report is not deleted', async () => {
            await (0, waitForBatchedUpdates_1.default)();
            react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
                callback: (val) => (iouReport = val),
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Given a second expense in addition to the first one
            jest.advanceTimersByTime(10);
            const amount2 = 20000;
            const comment2 = 'Send me money please 2';
            if (chatReport) {
                (0, IOU_1.requestMoney)({
                    report: chatReport,
                    participantParams: {
                        payeeEmail: TEST_USER_LOGIN,
                        payeeAccountID: TEST_USER_ACCOUNT_ID,
                        participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID },
                    },
                    transactionParams: {
                        amount: amount2,
                        attendees: [],
                        currency: CONST_1.default.CURRENCY.USD,
                        created: '',
                        merchant: '',
                        comment: comment2,
                    },
                    shouldGenerateTransactionThreadReport: true,
                });
            }
            await (0, waitForBatchedUpdates_1.default)();
            // Then we expect the IOU report and reportPreview to update with new totals
            expect(iouReport).toBeTruthy();
            expect(iouReport).toHaveProperty('reportID');
            expect(iouReport).toHaveProperty('chatReportID');
            expect(iouReport?.total).toBe(30000);
            const iouPreview = chatReport?.reportID && iouReport?.reportID ? (0, ReportActionsUtils_1.getReportPreviewAction)(chatReport.reportID, iouReport.reportID) : undefined;
            expect(iouPreview).toBeTruthy();
            expect((0, ReportActionsUtils_1.getReportActionText)(iouPreview)).toBe('rory@expensifail.com owes $300.00');
            // When we delete the first expense
            mockFetch?.pause?.();
            jest.advanceTimersByTime(10);
            if (transaction && createIOUAction) {
                (0, IOU_1.deleteMoneyRequest)(transaction.transactionID, createIOUAction, {}, {});
            }
            await (0, waitForBatchedUpdates_1.default)();
            // Then we expect the IOU report and reportPreview to update with new totals
            expect(iouReport).toBeTruthy();
            expect(iouReport).toHaveProperty('reportID');
            expect(iouReport).toHaveProperty('chatReportID');
            expect(iouReport?.total).toBe(20000);
            // When we resume
            mockFetch?.resume?.();
            // Then we expect the IOU report and reportPreview to update with new totals
            expect(iouReport).toBeTruthy();
            expect(iouReport).toHaveProperty('reportID');
            expect(iouReport).toHaveProperty('chatReportID');
            expect(iouReport?.total).toBe(20000);
        });
        it('navigate the user correctly to the iou Report when appropriate', async () => {
            // Given multiple expenses on an IOU report
            (0, IOU_1.requestMoney)({
                report: chatReport,
                participantParams: {
                    payeeEmail: TEST_USER_LOGIN,
                    payeeAccountID: TEST_USER_ACCOUNT_ID,
                    participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID },
                },
                transactionParams: {
                    amount,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: '',
                    comment,
                },
                shouldGenerateTransactionThreadReport: true,
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Given a thread report
            jest.advanceTimersByTime(10);
            thread = (0, ReportUtils_1.buildTransactionThread)(createIOUAction, iouReport);
            expect(thread.participants).toStrictEqual({ [CARLOS_ACCOUNT_ID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN, role: CONST_1.default.REPORT.ROLE.ADMIN } });
            jest.advanceTimersByTime(10);
            const participantAccountIDs = Object.keys(thread.participants ?? {}).map(Number);
            const userLogins = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)(participantAccountIDs);
            (0, Report_1.openReport)(thread.reportID, '', userLogins, thread, createIOUAction?.reportActionID);
            await (0, waitForBatchedUpdates_1.default)();
            const allReportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (actions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actions);
                    },
                });
            });
            const reportActionsForIOUReport = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.iouReportID}`];
            createIOUAction = Object.values(reportActionsForIOUReport ?? {}).find((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
            expect(createIOUAction?.childReportID).toBe(thread.reportID);
            // When we delete the expense, we should not delete the IOU report
            mockFetch?.pause?.();
            let navigateToAfterDelete;
            if (transaction && createIOUAction) {
                navigateToAfterDelete = (0, IOU_1.deleteMoneyRequest)(transaction.transactionID, createIOUAction, {}, {}, true);
            }
            let allReports = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (reports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reports);
                    },
                });
            });
            iouReport = Object.values(allReports ?? {}).find((report) => (0, ReportUtils_1.isIOUReport)(report));
            expect(iouReport).toBeTruthy();
            expect(iouReport).toHaveProperty('reportID');
            expect(iouReport).toHaveProperty('chatReportID');
            await mockFetch?.resume?.();
            allReports = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (reports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reports);
                    },
                });
            });
            iouReport = Object.values(allReports ?? {}).find((report) => (0, ReportUtils_1.isIOUReport)(report));
            expect(iouReport).toBeTruthy();
            expect(iouReport).toHaveProperty('reportID');
            expect(iouReport).toHaveProperty('chatReportID');
            // Then we expect to navigate to the iou report
            expect(IOU_REPORT_ID).not.toBeUndefined();
            if (IOU_REPORT_ID) {
                expect(navigateToAfterDelete).toEqual(ROUTES_1.default.REPORT_WITH_ID.getRoute(IOU_REPORT_ID));
            }
        });
        it('navigate the user correctly to the chat Report when appropriate', () => {
            let navigateToAfterDelete;
            if (transaction && createIOUAction) {
                // When we delete the expense and we should delete the IOU report
                navigateToAfterDelete = (0, IOU_1.deleteMoneyRequest)(transaction.transactionID, createIOUAction, {}, {});
            }
            // Then we expect to navigate to the chat report
            expect(chatReport?.reportID).not.toBeUndefined();
            if (chatReport?.reportID) {
                expect(navigateToAfterDelete).toEqual(ROUTES_1.default.REPORT_WITH_ID.getRoute(chatReport?.reportID));
            }
        });
    });
    describe('submitReport', () => {
        it('correctly submits a report', () => {
            const amount = 10000;
            const comment = '💸💸💸💸';
            const merchant = 'NASDAQ';
            let expenseReport;
            let chatReport;
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                const policyID = (0, Policy_1.generatePolicyID)();
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                    policyID,
                });
                // Change the approval mode for the policy since default is Submit and Close
                (0, Policy_1.setWorkspaceApprovalMode)(policyID, CARLOS_EMAIL, CONST_1.default.POLICY.APPROVAL_MODE.BASIC);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                        resolve();
                    },
                });
            }))
                .then(() => {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport.reportID },
                        },
                        transactionParams: {
                            amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant,
                            comment,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                        react_native_onyx_1.default.merge(`report_${expenseReport?.reportID}`, {
                            statusNum: 0,
                            stateNum: 0,
                        });
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                        // Verify report is a draft
                        expect(expenseReport?.stateNum).toBe(0);
                        expect(expenseReport?.statusNum).toBe(0);
                        resolve();
                    },
                });
            }))
                .then(() => {
                if (expenseReport) {
                    (0, IOU_1.submitReport)(expenseReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                        // Report was submitted correctly
                        expect(expenseReport?.stateNum).toBe(1);
                        expect(expenseReport?.statusNum).toBe(1);
                        resolve();
                    },
                });
            }));
        });
        it('correctly submits a report with Submit and Close approval mode', () => {
            const amount = 10000;
            const comment = '💸💸💸💸';
            const merchant = 'NASDAQ';
            let expenseReport;
            let chatReport;
            let policy;
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                    policyID: undefined,
                    engagementChoice: CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT,
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                        resolve();
                    },
                });
            }))
                .then(() => {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport.reportID },
                        },
                        transactionParams: {
                            amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant,
                            comment,
                            reimbursable: true,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.POLICY,
                    waitForCollectionCallback: true,
                    callback: (allPolicies) => {
                        react_native_onyx_1.default.disconnect(connection);
                        policy = Object.values(allPolicies ?? {}).find((p) => p?.name === "Carlos's Workspace");
                        expect(policy).toBeTruthy();
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                        react_native_onyx_1.default.merge(`report_${expenseReport?.reportID}`, {
                            statusNum: 0,
                            stateNum: 0,
                        });
                        resolve();
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(true);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(true);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                        resolve();
                        // Verify report is a draft
                        expect(expenseReport?.stateNum).toBe(0);
                        expect(expenseReport?.statusNum).toBe(0);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                    },
                });
            }))
                .then(() => {
                if (expenseReport) {
                    (0, IOU_1.submitReport)(expenseReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                        resolve();
                        // Report is closed since the default policy settings is Submit and Close
                        expect(expenseReport?.stateNum).toBe(2);
                        expect(expenseReport?.statusNum).toBe(2);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(true);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(true);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                    },
                });
            }))
                .then(() => {
                if (policy) {
                    (0, Policy_1.deleteWorkspace)(policy.id, policy.name, undefined);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                        resolve();
                    },
                });
            }));
        });
        it('correctly implements error handling', () => {
            const amount = 10000;
            const comment = '💸💸💸💸';
            const merchant = 'NASDAQ';
            let expenseReport;
            let chatReport;
            let policy;
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                    policyID: undefined,
                    engagementChoice: CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT,
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                        resolve();
                    },
                });
            }))
                .then(() => {
                if (chatReport) {
                    (0, IOU_1.requestMoney)({
                        report: chatReport,
                        participantParams: {
                            payeeEmail: RORY_EMAIL,
                            payeeAccountID: RORY_ACCOUNT_ID,
                            participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport.reportID },
                        },
                        transactionParams: {
                            amount,
                            attendees: [],
                            currency: CONST_1.default.CURRENCY.USD,
                            created: '',
                            merchant,
                            comment,
                            reimbursable: true,
                        },
                        shouldGenerateTransactionThreadReport: true,
                    });
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.POLICY,
                    waitForCollectionCallback: true,
                    callback: (allPolicies) => {
                        react_native_onyx_1.default.disconnect(connection);
                        policy = Object.values(allPolicies ?? {}).find((p) => p?.name === "Carlos's Workspace");
                        expect(policy).toBeTruthy();
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                        react_native_onyx_1.default.merge(`report_${expenseReport?.reportID}`, {
                            statusNum: 0,
                            stateNum: 0,
                        });
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(true);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(true);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                        resolve();
                    },
                });
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                        // Verify report is a draft
                        expect(expenseReport?.stateNum).toBe(0);
                        expect(expenseReport?.statusNum).toBe(0);
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                if (expenseReport) {
                    (0, IOU_1.submitReport)(expenseReport);
                }
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                        // Report was submitted with some fail
                        expect(expenseReport?.stateNum).toBe(0);
                        expect(expenseReport?.statusNum).toBe(0);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, true)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], true, undefined, undefined, false)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, true)).toBe(false);
                        expect((0, IOU_1.canIOUBePaid)(expenseReport, chatReport, policy, [], false, undefined, undefined, false)).toBe(false);
                        resolve();
                    },
                });
            }));
        });
    });
    describe('resolveDuplicate', () => {
        test('Resolving duplicates of two transaction by keeping one of them should properly set the other one on hold even if the transaction thread reports do not exist in onyx', () => {
            // Given two duplicate transactions
            const iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            const transaction1 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const transaction2 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const transactionCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction1.transactionID}`]: transaction1,
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction2.transactionID}`]: transaction2,
            };
            const iouActions = [];
            [transaction1, transaction2].forEach((transaction) => iouActions.push((0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            })));
            const actions = {};
            iouActions.forEach((iouAction) => (actions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouAction.reportActionID}`] = iouAction));
            const actionCollectionDataSet = { [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`]: actions };
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => react_native_onyx_1.default.multiSet({ ...transactionCollectionDataSet, ...actionCollectionDataSet }))
                .then(() => {
                // When resolving duplicates with transaction thread reports no existing in onyx
                (0, IOU_1.resolveDuplicates)({
                    ...transaction1,
                    receiptID: 1,
                    category: '',
                    comment: '',
                    billable: false,
                    reimbursable: true,
                    tag: '',
                    transactionIDList: [transaction2.transactionID],
                });
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                return new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction2.transactionID}`,
                        callback: (transaction) => {
                            react_native_onyx_1.default.disconnect(connection);
                            // Then the duplicate transaction should correctly be set on hold.
                            expect(transaction?.comment?.hold).toBeDefined();
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('bulkHold', () => {
        test('Bulk hold transactions without transaction threads', () => {
            const iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 300, '1', 'USD');
            const transaction1 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
                existingTransactionID: '1',
            });
            const transaction2 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 200,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
                existingTransactionID: '2',
            });
            const iouAction1 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction1.amount,
                currency: transaction1.currency,
                comment: '',
                participants: [],
                iouReportID: iouReport.reportID,
                transactionID: transaction1.transactionID,
            });
            const iouAction2 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction2.amount,
                currency: transaction2.currency,
                comment: '',
                participants: [],
                iouReportID: iouReport.reportID,
                transactionID: transaction2.transactionID,
            });
            const reportCollection = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`]: iouReport,
            };
            const transactionsIOUActions = {
                [transaction1.transactionID]: iouAction1,
                [transaction2.transactionID]: iouAction2,
            };
            const transactionCollection = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction1.transactionID}`]: transaction1,
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction2.transactionID}`]: transaction2,
            };
            const actionCollection = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`]: {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouAction1.reportActionID}`]: iouAction1,
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouAction2.reportActionID}`]: iouAction2,
                },
            };
            const comment = 'Bulk Hold';
            return react_native_onyx_1.default.multiSet({ ...reportCollection, ...transactionCollection, ...actionCollection })
                .then(waitForBatchedUpdates_1.default)
                .then(() => {
                const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID));
                (0, IOU_1.bulkHold)(comment, result.current.report, result.current.ancestorReportsAndReportActions, transactionCollection, {}, transactionsIOUActions);
            })
                .then(waitForBatchedUpdates_1.default)
                .then(async () => {
                const expectedViolations = [
                    {
                        name: CONST_1.default.VIOLATIONS.HOLD,
                        type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                        showInReview: true,
                    },
                ];
                const transaction1Violation = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction1.transactionID}`);
                expect(transaction1Violation).toMatchObject(expectedViolations);
                const transaction2Violation = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction2.transactionID}`);
                expect(transaction2Violation).toMatchObject(expectedViolations);
                const report = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`);
                expect(report?.unheldTotal).toEqual(-300);
                expect(report?.unheldNonReimbursableTotal).toBeUndefined();
            });
        });
        test('Bulk hold transactions with optimistic transaction threads', () => {
            const iouReportID = '12';
            const expenseChatReportID = '34';
            const reportPreviewActionID = '7890';
            const transaction1ThreadReportID = '12345';
            const transaction2ThreadReportID = '67890';
            const transaction1 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReportID,
                },
                existingTransactionID: '1',
            });
            const transaction2 = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 200,
                    currency: 'USD',
                    reportID: iouReportID,
                },
                existingTransactionID: '2',
            });
            const iouAction1 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction1.amount,
                currency: transaction1.currency,
                comment: '',
                participants: [],
                iouReportID,
                transactionID: transaction1.transactionID,
            });
            const iouAction2 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction2.amount,
                currency: transaction2.currency,
                comment: '',
                participants: [],
                iouReportID,
                transactionID: transaction2.transactionID,
            });
            const iouReport = {
                ...(0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 300, undefined, 'USD', false, reportPreviewActionID, iouReportID),
                parentReportID: expenseChatReportID,
            };
            const transaction1ThreadCreatedAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)('rory@expensifail.com');
            const transaction2ThreadCreatedAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)('rory@expensifail.com');
            const transaction1Thread = (0, ReportUtils_1.buildTransactionThread)(iouAction1, iouReport, undefined, transaction1ThreadReportID);
            const transaction2Thread = (0, ReportUtils_1.buildTransactionThread)(iouAction2, iouReport, undefined, transaction2ThreadReportID);
            const transaction1IOUAction = { ...iouAction1, childReportID: transaction1Thread.reportID };
            const transaction2IOUAction = { ...iouAction2, childReportID: transaction2Thread.reportID };
            const expenseChatReport = {
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                reportID: expenseChatReportID,
            };
            const reportPreviewAction = (0, ReportUtils_1.updateReportPreview)(iouReport, (0, ReportUtils_1.buildOptimisticReportPreview)(expenseChatReport, iouReport, undefined, transaction1, iouReportID, reportPreviewActionID), false, undefined, transaction2);
            const transactionThreads = {
                [transaction1.transactionID]: transaction1Thread,
                [transaction2.transactionID]: transaction2Thread,
            };
            const transactionsIOUActions = {
                [transaction1.transactionID]: transaction1IOUAction,
                [transaction2.transactionID]: transaction2IOUAction,
            };
            const transactionCollection = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction1.transactionID}`]: transaction1,
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction2.transactionID}`]: transaction2,
            };
            const reportCollection = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction1Thread.reportID}`]: transaction1Thread,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction2Thread.reportID}`]: transaction2Thread,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReport.reportID}`]: expenseChatReport,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`]: iouReport,
            };
            const actionCollection = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transaction1Thread.reportID}`]: {
                    [transaction1ThreadCreatedAction.reportActionID]: transaction1ThreadCreatedAction,
                },
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transaction2Thread.reportID}`]: {
                    [transaction2ThreadCreatedAction.reportActionID]: transaction2ThreadCreatedAction,
                },
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`]: {
                    [transaction1IOUAction.reportActionID]: transaction1IOUAction,
                    [transaction2IOUAction.reportActionID]: transaction2IOUAction,
                },
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReport.reportID}`]: {
                    [reportPreviewAction.reportActionID]: reportPreviewAction,
                },
            };
            react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.TRANSACTION, transactionCollection);
            react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, actionCollection);
            react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.REPORT, reportCollection);
            const comment = 'Bulk Hold';
            return (0, waitForBatchedUpdates_1.default)().then(async () => {
                const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID, true));
                expect(result.current.ancestorReportsAndReportActions).toHaveLength(1); // 1 Policy expense chat report
                expect(result.current.ancestorReportsAndReportActions?.at(0)?.report?.reportID).toBe(expenseChatReportID);
                expect(result.current.ancestorReportsAndReportActions?.at(0)?.reportAction?.reportActionID).toBe(reportPreviewAction.reportActionID);
                (0, IOU_1.bulkHold)(comment, result.current.report, result.current.ancestorReportsAndReportActions, transactionCollection, {}, transactionsIOUActions, transactionThreads);
                const expectedViolations = [
                    {
                        name: CONST_1.default.VIOLATIONS.HOLD,
                        type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                        showInReview: true,
                    },
                ];
                const transaction1Violation = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction1.transactionID}`);
                expect(transaction1Violation).toMatchObject(expectedViolations);
                const transaction2Violation = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction2.transactionID}`);
                expect(transaction2Violation).toMatchObject(expectedViolations);
                // Then the transaction thread report lastVisibleActionCreated should equal the hold comment action created timestamp.
                const transaction1ThreadReport = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction1Thread.reportID}`);
                const transaction1ThreadReportActions = Object.values((await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transaction1Thread.reportID}`)) ?? {});
                const transaction1ThreadReportLastAction = (0, ReportActionsUtils_1.getSortedReportActions)(transaction1ThreadReportActions, true).at(0);
                const transaction1ThreadReportLastActionMessage = (0, ReportActionsUtils_1.getReportActionMessage)(transaction1ThreadReportLastAction);
                expect(transaction1ThreadReportActions).toHaveLength(3); // 1 created action + 2 hold actions
                expect(transaction1ThreadReportLastActionMessage?.text).toBe(comment);
                expect(transaction1ThreadReport?.lastVisibleActionCreated).toBe(transaction1ThreadReportLastAction?.created);
                const transaction2ThreadReport = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction2Thread.reportID}`);
                const transaction2ThreadReportActions = Object.values((await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transaction2Thread.reportID}`)) ?? {});
                const transaction2ThreadReportLastAction = (0, ReportActionsUtils_1.getSortedReportActions)(Object.values(transaction2ThreadReportActions ?? {}), true).at(0);
                const transaction2ThreadReportLastActionMessage = (0, ReportActionsUtils_1.getReportActionMessage)(transaction2ThreadReportLastAction);
                expect(transaction2ThreadReportActions).toHaveLength(3); // 1 created action + 2 hold actions
                expect(transaction2ThreadReportLastActionMessage?.text).toBe(comment);
                expect(transaction2ThreadReport?.lastVisibleActionCreated).toBe(transaction2ThreadReportLastAction?.created);
                // Check if the iou report has the correct unheldTotal and unheldNonReimbursableTotal
                const report = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`);
                expect(report?.unheldTotal).toEqual(-300);
                expect(report?.unheldNonReimbursableTotal).toBeUndefined();
                // Check if the iou actions has the correct childCommenterCount and childVisibleActionCount
                const iouReportActions = Object.values((await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`)) ?? {});
                expect(iouReportActions).toHaveLength(2); // 2 iou actions
                expect(iouReportActions.at(0)?.childCommenterCount).toBe(1);
                expect(iouReportActions.at(1)?.childCommenterCount).toBe(1);
                expect(iouReportActions.at(0)?.childVisibleActionCount).toBe(1);
                expect(iouReportActions.at(1)?.childVisibleActionCount).toBe(1);
                // Check if the report preview action has the correct childCommenterCount
                const expenseChatReportActions = Object.values((await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReport.reportID}`)) ?? {});
                expect(expenseChatReportActions).toHaveLength(1); // 1 report preview action
                expect(expenseChatReportActions.at(0)?.childCommenterCount).toBe(1);
                expect(expenseChatReportActions.at(0)?.childVisibleActionCount).toBe(2);
            });
        });
    });
    describe('putOnHold', () => {
        test("should update the transaction thread report's lastVisibleActionCreated to the optimistically added hold comment report action created timestamp", () => {
            const iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            const transaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const transactionCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]: transaction,
            };
            const iouAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            });
            const transactionThread = (0, ReportUtils_1.buildTransactionThread)(iouAction, iouReport);
            const actions = { [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouAction.reportActionID}`]: iouAction };
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread.reportID}`]: transactionThread,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`]: iouReport,
            };
            const actionCollectionDataSet = { [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`]: actions };
            const comment = 'hold reason';
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => react_native_onyx_1.default.multiSet({ ...reportCollectionDataSet, ...transactionCollectionDataSet, ...actionCollectionDataSet }))
                .then(() => {
                const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID));
                // When an expense is put on hold
                (0, IOU_1.putOnHold)(transaction.transactionID, comment, result.current.ancestorReportsAndReportActions, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                return new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread.reportID}`,
                        callback: (report) => {
                            react_native_onyx_1.default.disconnect(connection);
                            const lastVisibleActionCreated = report?.lastVisibleActionCreated;
                            const connection2 = react_native_onyx_1.default.connect({
                                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThread.reportID}`,
                                callback: (reportActions) => {
                                    react_native_onyx_1.default.disconnect(connection2);
                                    resolve();
                                    const lastAction = (0, ReportActionsUtils_1.getSortedReportActions)(Object.values(reportActions ?? {}), true).at(0);
                                    const message = (0, ReportActionsUtils_1.getReportActionMessage)(lastAction);
                                    // Then the transaction thread report lastVisibleActionCreated should equal the hold comment action created timestamp.
                                    expect(message?.text).toBe(comment);
                                    expect(lastVisibleActionCreated).toBe(lastAction?.created);
                                },
                            });
                        },
                    });
                });
            });
        });
        test('should create transaction thread optimistically when initialReportID is undefined', () => {
            const iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            const transaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const transactionCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]: transaction,
            };
            const iouAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            });
            const actions = { [iouAction.reportActionID]: iouAction };
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`]: iouReport,
            };
            const actionCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`]: actions,
            };
            const comment = 'hold reason for new thread';
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => react_native_onyx_1.default.multiSet({ ...reportCollectionDataSet, ...transactionCollectionDataSet, ...actionCollectionDataSet }))
                .then(() => {
                const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID));
                // When an expense is put on hold without existing transaction thread (undefined initialReportID)
                (0, IOU_1.putOnHold)(transaction.transactionID, comment, result.current.ancestorReportsAndReportActions, undefined);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                return new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`,
                        callback: (reportActions) => {
                            react_native_onyx_1.default.disconnect(connection);
                            const updatedIOUAction = reportActions?.[iouAction.reportActionID];
                            // Verify that IOU action now has childReportID set optimistically
                            expect(updatedIOUAction?.childReportID).toBeDefined();
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('unHoldRequest', () => {
        test("should update the transaction thread report's lastVisibleActionCreated to the optimistically added unhold report action created timestamp", () => {
            const iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            const transaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const transactionCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]: transaction,
            };
            const iouAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            });
            const transactionThread = (0, ReportUtils_1.buildTransactionThread)(iouAction, iouReport);
            const actions = { [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouAction.reportActionID}`]: iouAction };
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread.reportID}`]: transactionThread,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`]: iouReport,
            };
            const actionCollectionDataSet = { [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`]: actions };
            const comment = 'hold reason';
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => react_native_onyx_1.default.multiSet({ ...reportCollectionDataSet, ...transactionCollectionDataSet, ...actionCollectionDataSet }))
                .then(() => {
                const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID));
                (0, IOU_1.putOnHold)(transaction.transactionID, comment, result.current.ancestorReportsAndReportActions, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                // When an expense is unhold
                (0, IOU_1.unholdRequest)(transaction.transactionID, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                return new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread.reportID}`,
                        callback: (report) => {
                            react_native_onyx_1.default.disconnect(connection);
                            const lastVisibleActionCreated = report?.lastVisibleActionCreated;
                            const connection2 = react_native_onyx_1.default.connect({
                                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThread.reportID}`,
                                callback: (reportActions) => {
                                    react_native_onyx_1.default.disconnect(connection2);
                                    resolve();
                                    const lastAction = (0, ReportActionsUtils_1.getSortedReportActions)(Object.values(reportActions ?? {}), true).at(0);
                                    // Then the transaction thread report lastVisibleActionCreated should equal the unhold action created timestamp.
                                    expect(lastAction?.actionName).toBe(CONST_1.default.REPORT.ACTIONS.TYPE.UNHOLD);
                                    expect(lastVisibleActionCreated).toBe(lastAction?.created);
                                },
                            });
                        },
                    });
                });
            });
        });
        test('should rollback unhold request on API failure', () => {
            const iouReport = (0, ReportUtils_1.buildOptimisticIOUReport)(1, 2, 100, '1', 'USD');
            const transaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const transactionCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]: transaction,
            };
            const iouAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: transaction.amount,
                currency: transaction.currency,
                comment: '',
                participants: [],
                transactionID: transaction.transactionID,
            });
            const transactionThread = (0, ReportUtils_1.buildTransactionThread)(iouAction, iouReport);
            const actions = { [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouAction.reportActionID}`]: iouAction };
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread.reportID}`]: transactionThread,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`]: iouReport,
            };
            const actionCollectionDataSet = { [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`]: actions };
            const comment = 'hold reason';
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => react_native_onyx_1.default.multiSet({ ...reportCollectionDataSet, ...transactionCollectionDataSet, ...actionCollectionDataSet }))
                .then(() => {
                const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)(iouReport.reportID));
                (0, IOU_1.putOnHold)(transaction.transactionID, comment, result.current.ancestorReportsAndReportActions, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                mockFetch.fail();
                mockFetch?.resume?.();
                (0, IOU_1.unholdRequest)(transaction.transactionID, transactionThread.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                .then(() => {
                return new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
                        callback: (updatedTransaction) => {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(updatedTransaction?.pendingAction).toBeFalsy();
                            expect(updatedTransaction?.comment?.hold).toBeTruthy();
                            expect(Object.values(updatedTransaction?.errors ?? {})).toEqual(Object.values((0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericUnholdExpenseFailureMessage') ?? {}));
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('sendInvoice', () => {
        it('creates a new invoice chat when one has been converted from individual to business', async () => {
            // Mock API.write for this test
            const writeSpy = jest.spyOn(API, 'write').mockImplementation(jest.fn());
            // Given a convertedInvoiceReport is stored in Onyx
            const { policy, transaction, convertedInvoiceChat } = InvoiceData;
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${convertedInvoiceChat?.reportID}`, convertedInvoiceChat ?? {});
            // And data for when a new invoice is sent to a user
            const currentUserAccountID = 32;
            const companyName = 'b1-53019';
            const companyWebsite = 'https://www.53019.com';
            // When the user sends a new invoice to an individual
            (0, IOU_1.sendInvoice)(currentUserAccountID, transaction, undefined, undefined, policy, undefined, undefined, companyName, companyWebsite);
            // Then a new invoice chat is created instead of incorrectly using the invoice chat which has been converted from individual to business
            expect(writeSpy).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
                invoiceRoomReportID: expect.not.stringMatching(convertedInvoiceChat.reportID),
            }), expect.anything());
            writeSpy.mockRestore();
        });
        it('should not clear transaction pending action when send invoice fails', async () => {
            // Given a send invoice request
            mockFetch?.pause?.();
            (0, IOU_1.sendInvoice)(1, (0, transaction_1.default)(1));
            // When the request fails
            mockFetch?.fail?.();
            mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            // Then the pending action of the optimistic transaction shouldn't be cleared
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (allTransactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const transaction = Object.values(allTransactions).at(0);
                        expect(transaction?.errors).not.toBeUndefined();
                        expect(transaction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            });
        });
    });
    describe('canIOUBePaid', () => {
        it('For invoices from archived workspaces', async () => {
            const { policy, convertedInvoiceChat: chatReport } = InvoiceData;
            const chatReportRNVP = { private_isArchived: DateUtils_1.default.getDBTime() };
            const invoiceReceiver = chatReport?.invoiceReceiver;
            const iouReport = { ...(0, reports_1.createRandomReport)(1), type: CONST_1.default.REPORT.TYPE.INVOICE, statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${invoiceReceiver.policyID}`, { id: invoiceReceiver.policyID, role: CONST_1.default.POLICY.ROLE.ADMIN });
            expect((0, IOU_1.canIOUBePaid)(iouReport, chatReport, policy, [], true)).toBe(true);
            expect((0, IOU_1.canIOUBePaid)(iouReport, chatReport, policy, [], false)).toBe(true);
            // When the invoice is archived
            expect((0, IOU_1.canIOUBePaid)(iouReport, chatReport, policy, [], true, chatReportRNVP)).toBe(false);
            expect((0, IOU_1.canIOUBePaid)(iouReport, chatReport, policy, [], false, chatReportRNVP)).toBe(false);
        });
    });
    describe('setMoneyRequestCategory', () => {
        it('should set the associated tax for the category based on the tax expense rules', async () => {
            // Given a policy with tax expense rules associated with category
            const transactionID = '1';
            const category = 'Advertising';
            const policyID = '2';
            const taxCode = 'id_TAX_EXEMPT';
            const ruleTaxCode = 'id_TAX_RATE_1';
            const fakePolicy = {
                ...(0, policies_1.default)(Number(policyID)),
                taxRates: CONST_1.default.DEFAULT_TAX,
                rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) },
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, {
                taxCode,
                taxAmount: 0,
                amount: 100,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
            // When setting the money request category
            (0, IOU_1.setMoneyRequestCategory)(transactionID, category, policyID);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the transaction tax rate and amount should be updated based on the expense rules
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`,
                    callback: (transaction) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(transaction?.taxCode).toBe(ruleTaxCode);
                        expect(transaction?.taxAmount).toBe(5);
                        resolve();
                    },
                });
            });
        });
        describe('should not change the tax', () => {
            it('if the transaction type is distance', async () => {
                // Given a policy with tax expense rules associated with category and a distance transaction
                const transactionID = '1';
                const category = 'Advertising';
                const policyID = '2';
                const taxCode = 'id_TAX_EXEMPT';
                const ruleTaxCode = 'id_TAX_RATE_1';
                const taxAmount = 0;
                const fakePolicy = {
                    ...(0, policies_1.default)(Number(policyID)),
                    taxRates: CONST_1.default.DEFAULT_TAX,
                    rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) },
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, {
                    taxCode,
                    taxAmount,
                    amount: 100,
                    iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.DISTANCE,
                });
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
                // When setting the money request category
                (0, IOU_1.setMoneyRequestCategory)(transactionID, category, policyID);
                await (0, waitForBatchedUpdates_1.default)();
                // Then the transaction tax rate and amount shouldn't be updated
                await new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`,
                        callback: (transaction) => {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction?.taxCode).toBe(taxCode);
                            expect(transaction?.taxAmount).toBe(taxAmount);
                            resolve();
                        },
                    });
                });
            });
            it('if there are no tax expense rules', async () => {
                // Given a policy without tax expense rules
                const transactionID = '1';
                const category = 'Advertising';
                const policyID = '2';
                const taxCode = 'id_TAX_EXEMPT';
                const taxAmount = 0;
                const fakePolicy = {
                    ...(0, policies_1.default)(Number(policyID)),
                    taxRates: CONST_1.default.DEFAULT_TAX,
                    rules: {},
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, {
                    taxCode,
                    taxAmount,
                    amount: 100,
                });
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
                // When setting the money request category
                (0, IOU_1.setMoneyRequestCategory)(transactionID, category, policyID);
                await (0, waitForBatchedUpdates_1.default)();
                // Then the transaction tax rate and amount shouldn't be updated
                await new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`,
                        callback: (transaction) => {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction?.taxCode).toBe(taxCode);
                            expect(transaction?.taxAmount).toBe(taxAmount);
                            resolve();
                        },
                    });
                });
            });
        });
        it('should clear the tax when the policyID is empty', async () => {
            // Given a transaction with a tax
            const transactionID = '1';
            const taxCode = 'id_TAX_EXEMPT';
            const taxAmount = 0;
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, {
                taxCode,
                taxAmount,
                amount: 100,
            });
            // When setting the money request category without a policyID
            (0, IOU_1.setMoneyRequestCategory)(transactionID, '');
            await (0, waitForBatchedUpdates_1.default)();
            // Then the transaction tax should be cleared
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`,
                    callback: (transaction) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(transaction?.taxCode).toBe('');
                        expect(transaction?.taxAmount).toBeUndefined();
                        resolve();
                    },
                });
            });
        });
    });
    describe('updateMoneyRequestCategory', () => {
        it('should update the tax when there are tax expense rules', async () => {
            // Given a policy with tax expense rules associated with category
            const transactionID = '1';
            const policyID = '2';
            const transactionThreadReportID = '3';
            const category = 'Advertising';
            const taxCode = 'id_TAX_EXEMPT';
            const ruleTaxCode = 'id_TAX_RATE_1';
            const fakePolicy = {
                ...(0, policies_1.default)(Number(policyID)),
                taxRates: CONST_1.default.DEFAULT_TAX,
                rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) },
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, {
                taxCode,
                taxAmount: 0,
                amount: 100,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`, { reportID: transactionThreadReportID });
            // When updating a money request category
            (0, IOU_1.updateMoneyRequestCategory)(transactionID, transactionThreadReportID, category, fakePolicy, undefined, undefined);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the transaction tax rate and amount should be updated based on the expense rules
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                    callback: (transaction) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(transaction?.taxCode).toBe(ruleTaxCode);
                        expect(transaction?.taxAmount).toBe(5);
                        resolve();
                    },
                });
            });
            // But the original message should only contains the old and new category data
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
                    callback: (reportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const reportAction = Object.values(reportActions ?? {}).at(0);
                        if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE)) {
                            const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction);
                            expect(originalMessage?.oldCategory).toBe('');
                            expect(originalMessage?.category).toBe(category);
                            expect(originalMessage?.oldTaxRate).toBeUndefined();
                            expect(originalMessage?.oldTaxAmount).toBeUndefined();
                            resolve();
                        }
                    },
                });
            });
        });
        describe('should not update the tax', () => {
            it('if the transaction type is distance', async () => {
                // Given a policy with tax expense rules associated with category and a distance transaction
                const transactionID = '1';
                const policyID = '2';
                const category = 'Advertising';
                const taxCode = 'id_TAX_EXEMPT';
                const taxAmount = 0;
                const ruleTaxCode = 'id_TAX_RATE_1';
                const fakePolicy = {
                    ...(0, policies_1.default)(Number(policyID)),
                    taxRates: CONST_1.default.DEFAULT_TAX,
                    rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) },
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, {
                    taxCode,
                    taxAmount,
                    amount: 100,
                    comment: {
                        type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                        customUnit: {
                            name: CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE,
                        },
                    },
                });
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
                // When updating a money request category
                (0, IOU_1.updateMoneyRequestCategory)(transactionID, '3', category, fakePolicy, undefined, undefined);
                await (0, waitForBatchedUpdates_1.default)();
                // Then the transaction tax rate and amount shouldn't be updated
                await new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                        callback: (transaction) => {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction?.taxCode).toBe(taxCode);
                            expect(transaction?.taxAmount).toBe(taxAmount);
                            resolve();
                        },
                    });
                });
            });
            it('if there are no tax expense rules', async () => {
                // Given a policy without tax expense rules
                const transactionID = '1';
                const policyID = '2';
                const category = 'Advertising';
                const fakePolicy = {
                    ...(0, policies_1.default)(Number(policyID)),
                    taxRates: CONST_1.default.DEFAULT_TAX,
                    rules: {},
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { amount: 100 });
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
                // When updating the money request category
                (0, IOU_1.updateMoneyRequestCategory)(transactionID, '3', category, fakePolicy, undefined, undefined);
                await (0, waitForBatchedUpdates_1.default)();
                // Then the transaction tax rate and amount shouldn't be updated
                await new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                        callback: (transaction) => {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction?.taxCode).toBeUndefined();
                            expect(transaction?.taxAmount).toBeUndefined();
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('setDraftSplitTransaction', () => {
        it('should set the associated tax for the category based on the tax expense rules', async () => {
            // Given a policy with tax expense rules associated with category
            const transactionID = '1';
            const category = 'Advertising';
            const policyID = '2';
            const taxCode = 'id_TAX_EXEMPT';
            const ruleTaxCode = 'id_TAX_RATE_1';
            const fakePolicy = {
                ...(0, policies_1.default)(Number(policyID)),
                taxRates: CONST_1.default.DEFAULT_TAX,
                rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) },
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, {
                taxCode,
                taxAmount: 0,
                amount: 100,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
            // When setting a category of a draft split transaction
            (0, IOU_1.setDraftSplitTransaction)(transactionID, { category }, fakePolicy);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the transaction tax rate and amount should be updated based on the expense rules
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`,
                    callback: (transaction) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(transaction?.taxCode).toBe(ruleTaxCode);
                        expect(transaction?.taxAmount).toBe(5);
                        resolve();
                    },
                });
            });
        });
        describe('should not change the tax', () => {
            it('if there are no tax expense rules', async () => {
                // Given a policy without tax expense rules
                const transactionID = '1';
                const category = 'Advertising';
                const policyID = '2';
                const taxCode = 'id_TAX_EXEMPT';
                const taxAmount = 0;
                const fakePolicy = {
                    ...(0, policies_1.default)(Number(policyID)),
                    taxRates: CONST_1.default.DEFAULT_TAX,
                    rules: {},
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, {
                    taxCode,
                    taxAmount,
                    amount: 100,
                });
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
                // When setting a category of a draft split transaction
                (0, IOU_1.setDraftSplitTransaction)(transactionID, { category }, fakePolicy);
                await (0, waitForBatchedUpdates_1.default)();
                // Then the transaction tax rate and amount shouldn't be updated
                await new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`,
                        callback: (transaction) => {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction?.taxCode).toBe(taxCode);
                            expect(transaction?.taxAmount).toBe(taxAmount);
                            resolve();
                        },
                    });
                });
            });
            it('if we are not updating category', async () => {
                // Given a policy with tax expense rules associated with category
                const transactionID = '1';
                const category = 'Advertising';
                const policyID = '2';
                const ruleTaxCode = 'id_TAX_RATE_1';
                const fakePolicy = {
                    ...(0, policies_1.default)(Number(policyID)),
                    taxRates: CONST_1.default.DEFAULT_TAX,
                    rules: { expenseRules: (0, policies_1.createCategoryTaxExpenseRules)(category, ruleTaxCode) },
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { amount: 100 });
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
                // When setting a draft split transaction without category update
                (0, IOU_1.setDraftSplitTransaction)(transactionID, {}, fakePolicy);
                await (0, waitForBatchedUpdates_1.default)();
                // Then the transaction tax rate and amount shouldn't be updated
                await new Promise((resolve) => {
                    const connection = react_native_onyx_1.default.connect({
                        key: `${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`,
                        callback: (transaction) => {
                            react_native_onyx_1.default.disconnect(connection);
                            expect(transaction?.taxCode).toBeUndefined();
                            expect(transaction?.taxAmount).toBeUndefined();
                            resolve();
                        },
                    });
                });
            });
        });
    });
    describe('should have valid parameters', () => {
        let writeSpy;
        const isValid = (value) => !value || typeof value !== 'object' || value instanceof Blob;
        beforeEach(() => {
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            writeSpy = jest.spyOn(API, 'write').mockImplementation(jest.fn());
        });
        afterEach(() => {
            writeSpy.mockRestore();
        });
        test.each([
            [types_1.WRITE_COMMANDS.REQUEST_MONEY, CONST_1.default.IOU.ACTION.CREATE],
            [types_1.WRITE_COMMANDS.CONVERT_TRACKED_EXPENSE_TO_REQUEST, CONST_1.default.IOU.ACTION.SUBMIT],
        ])('%s', async (expectedCommand, action) => {
            // When an expense is created
            (0, IOU_1.requestMoney)({
                action,
                report: { reportID: '' },
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: 10000,
                    attendees: [],
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '',
                    merchant: 'KFC',
                    comment: '',
                    linkedTrackedExpenseReportAction: {
                        reportActionID: '',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                        created: '2024-10-30',
                    },
                    actionableWhisperReportActionID: '1',
                    linkedTrackedExpenseReportID: '1',
                },
                shouldGenerateTransactionThreadReport: true,
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Then the correct API request should be made
            expect(writeSpy).toHaveBeenCalledTimes(1);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const [command, params] = writeSpy.mock.calls.at(0);
            expect(command).toBe(expectedCommand);
            // And the parameters should be supported by XMLHttpRequest
            Object.values(params).forEach((value) => {
                expect(Array.isArray(value) ? value.every(isValid) : isValid(value)).toBe(true);
            });
        });
        test.each([
            [types_1.WRITE_COMMANDS.TRACK_EXPENSE, CONST_1.default.IOU.ACTION.CREATE],
            [types_1.WRITE_COMMANDS.CATEGORIZE_TRACKED_EXPENSE, CONST_1.default.IOU.ACTION.CATEGORIZE],
            [types_1.WRITE_COMMANDS.SHARE_TRACKED_EXPENSE, CONST_1.default.IOU.ACTION.SHARE],
        ])('%s', async (expectedCommand, action) => {
            // When a track expense is created
            (0, IOU_1.trackExpense)({
                report: { reportID: '123', policyID: 'A' },
                isDraftPolicy: false,
                action,
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                },
                transactionParams: {
                    amount: 10000,
                    currency: CONST_1.default.CURRENCY.USD,
                    created: '2024-10-30',
                    merchant: 'KFC',
                    receipt: {},
                    actionableWhisperReportActionID: '1',
                    linkedTrackedExpenseReportAction: {
                        reportActionID: '',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                        created: '2024-10-30',
                    },
                    linkedTrackedExpenseReportID: '1',
                },
                accountantParams: action === CONST_1.default.IOU.ACTION.SHARE ? { accountant: { accountID: VIT_ACCOUNT_ID, login: VIT_EMAIL } } : undefined,
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Then the correct API request should be made
            expect(writeSpy).toHaveBeenCalledTimes(1);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const [command, params] = writeSpy.mock.calls.at(0);
            expect(command).toBe(expectedCommand);
            if (expectedCommand === types_1.WRITE_COMMANDS.SHARE_TRACKED_EXPENSE) {
                expect(params).toHaveProperty('policyName');
            }
            // And the parameters should be supported by XMLHttpRequest
            Object.values(params).forEach((value) => {
                expect(Array.isArray(value) ? value.every(isValid) : isValid(value)).toBe(true);
            });
        });
    });
    describe('canApproveIOU', () => {
        it('should return false if we have only pending card transactions', async () => {
            const policyID = '2';
            const reportID = '1';
            const fakePolicy = {
                ...(0, policies_1.default)(Number(policyID)),
                type: CONST_1.default.POLICY.TYPE.TEAM,
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
            };
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(Number(reportID)),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID,
            };
            const fakeTransaction1 = {
                ...(0, transaction_1.default)(0),
                reportID,
                bank: CONST_1.default.EXPENSIFY_CARD.BANK,
                status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            };
            const fakeTransaction2 = {
                ...(0, transaction_1.default)(1),
                reportID,
                bank: CONST_1.default.EXPENSIFY_CARD.BANK,
                status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`, fakeReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction1.transactionID}`, fakeTransaction1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction2.transactionID}`, fakeTransaction2);
            await (0, waitForBatchedUpdates_1.default)();
            expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeFalsy();
            // Then should return false when passing transactions directly as the third parameter instead of relying on Onyx data
            const { result } = (0, react_native_1.renderHook)(() => (0, useReportWithTransactionsAndViolations_1.default)(reportID), { wrapper: OnyxListItemProvider_1.default });
            await (0, waitForBatchedUpdates_1.default)();
            expect((0, IOU_1.canApproveIOU)(result.current.at(0), fakePolicy, result.current.at(1))).toBeFalsy();
        });
        it('should return false if we have only scan failure transactions', async () => {
            const policyID = '2';
            const reportID = '1';
            const fakePolicy = {
                ...(0, policies_1.default)(Number(policyID)),
                type: CONST_1.default.POLICY.TYPE.TEAM,
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
            };
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(Number(reportID)),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                managerID: RORY_ACCOUNT_ID,
            };
            const fakeTransaction1 = {
                ...(0, transaction_1.default)(0),
                reportID,
                amount: 0,
                modifiedAmount: 0,
                receipt: {
                    source: 'test',
                    state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                },
                merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
                modifiedMerchant: undefined,
            };
            const fakeTransaction2 = {
                ...(0, transaction_1.default)(1),
                reportID,
                amount: 0,
                modifiedAmount: 0,
                receipt: {
                    source: 'test',
                    state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                },
                merchant: 'test merchant',
                modifiedMerchant: undefined,
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.REPORT, {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`]: fakeReport,
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`, fakeReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction1.transactionID}`, fakeTransaction1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction2.transactionID}`, fakeTransaction2);
            await (0, waitForBatchedUpdates_1.default)();
            expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeFalsy();
            // Then should return false when passing transactions directly as the third parameter instead of relying on Onyx data
            const { result } = (0, react_native_1.renderHook)(() => (0, useReportWithTransactionsAndViolations_1.default)(reportID), { wrapper: OnyxListItemProvider_1.default });
            await (0, waitForBatchedUpdates_1.default)();
            expect((0, IOU_1.canApproveIOU)(result.current.at(0), fakePolicy, result.current.at(1))).toBeFalsy();
        });
        it('should return false if all transactions are pending card or scan failure transaction', async () => {
            const policyID = '2';
            const reportID = '1';
            const fakePolicy = {
                ...(0, policies_1.default)(Number(policyID)),
                type: CONST_1.default.POLICY.TYPE.TEAM,
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
            };
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(Number(reportID)),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                managerID: RORY_ACCOUNT_ID,
            };
            const fakeTransaction1 = {
                ...(0, transaction_1.default)(0),
                reportID,
                bank: CONST_1.default.EXPENSIFY_CARD.BANK,
                status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            };
            const fakeTransaction2 = {
                ...(0, transaction_1.default)(1),
                reportID,
                amount: 0,
                modifiedAmount: 0,
                receipt: {
                    source: 'test',
                    state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                },
                merchant: 'test merchant',
                modifiedMerchant: undefined,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`, fakeReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction1.transactionID}`, fakeTransaction1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction2.transactionID}`, fakeTransaction2);
            await (0, waitForBatchedUpdates_1.default)();
            expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeFalsy();
            // Then should return false when passing transactions directly as the third parameter instead of relying on Onyx data
            const { result } = (0, react_native_1.renderHook)(() => (0, useReportWithTransactionsAndViolations_1.default)(reportID), { wrapper: OnyxListItemProvider_1.default });
            await (0, waitForBatchedUpdates_1.default)();
            expect((0, IOU_1.canApproveIOU)(result.current.at(0), fakePolicy, result.current.at(1))).toBeFalsy();
        });
        it('should return true if at least one transactions is not pending card or scan failure transaction', async () => {
            const policyID = '2';
            const reportID = '1';
            const fakePolicy = {
                ...(0, policies_1.default)(Number(policyID)),
                type: CONST_1.default.POLICY.TYPE.TEAM,
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
            };
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(Number(reportID)),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                managerID: RORY_ACCOUNT_ID,
            };
            const fakeTransaction1 = {
                ...(0, transaction_1.default)(0),
                reportID,
                bank: CONST_1.default.EXPENSIFY_CARD.BANK,
                status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            };
            const fakeTransaction2 = {
                ...(0, transaction_1.default)(1),
                reportID,
                amount: 0,
                receipt: {
                    source: 'test',
                    state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                },
                merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
                modifiedMerchant: undefined,
            };
            const fakeTransaction3 = {
                ...(0, transaction_1.default)(2),
                reportID,
                amount: 100,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`, fakeReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction1.transactionID}`, fakeTransaction1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction2.transactionID}`, fakeTransaction2);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction3.transactionID}`, fakeTransaction3);
            await (0, waitForBatchedUpdates_1.default)();
            expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeTruthy();
            // Then should return true when passing transactions directly as the third parameter instead of relying on Onyx data
            const { result } = (0, react_native_1.renderHook)(() => (0, useReportWithTransactionsAndViolations_1.default)(reportID), { wrapper: OnyxListItemProvider_1.default });
            await (0, waitForBatchedUpdates_1.default)();
            expect((0, IOU_1.canApproveIOU)(result.current.at(0), fakePolicy, result.current.at(1))).toBeTruthy();
        });
        it('should return false if the report is closed', async () => {
            // Given a closed report, a policy, and a transaction
            const policyID = '2';
            const reportID = '1';
            const fakePolicy = {
                ...(0, policies_1.default)(Number(policyID)),
                type: CONST_1.default.POLICY.TYPE.TEAM,
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
            };
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(Number(reportID)),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                managerID: RORY_ACCOUNT_ID,
            };
            const fakeTransaction = {
                ...(0, transaction_1.default)(1),
            };
            react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.COLLECTION.REPORT]: fakeReport,
                [ONYXKEYS_1.default.COLLECTION.TRANSACTION]: fakeTransaction,
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Then, canApproveIOU should return false since the report is closed
            expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy)).toBeFalsy();
            // Then should return false when passing transactions directly as the third parameter instead of relying on Onyx data
            expect((0, IOU_1.canApproveIOU)(fakeReport, fakePolicy, [fakeTransaction])).toBeFalsy();
        });
    });
    describe('canUnapproveIOU', () => {
        it('should return false if the report is waiting for a bank account', () => {
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: 'A',
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                isWaitingOnBankAccount: true,
                managerID: RORY_ACCOUNT_ID,
            };
            expect((0, IOU_1.canUnapproveIOU)(fakeReport, undefined)).toBeFalsy();
        });
    });
    describe('canCancelPayment', () => {
        it('should return true if the report is waiting for a bank account', () => {
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: 'A',
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                isWaitingOnBankAccount: true,
                managerID: RORY_ACCOUNT_ID,
            };
            expect((0, IOU_1.canCancelPayment)(fakeReport, { accountID: RORY_ACCOUNT_ID })).toBeTruthy();
        });
    });
    describe('canIOUBePaid', () => {
        it('should return false if the report has negative total', () => {
            const policyChat = (0, reports_1.createRandomReport)(1);
            const fakePolicy = {
                ...(0, policies_1.default)(Number('AA')),
                type: CONST_1.default.POLICY.TYPE.TEAM,
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
            };
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: 'AA',
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                managerID: RORY_ACCOUNT_ID,
                total: 100, // positive amount in the DB means negative amount in the UI
            };
            expect((0, IOU_1.canIOUBePaid)(fakeReport, policyChat, fakePolicy)).toBeFalsy();
        });
    });
    describe('calculateDiffAmount', () => {
        it('should return 0 if iouReport is undefined', () => {
            const fakeTransaction = {
                ...(0, transaction_1.default)(1),
                reportID: '1',
                amount: 100,
                currency: 'USD',
            };
            expect((0, IOU_1.calculateDiffAmount)(undefined, fakeTransaction, fakeTransaction)).toBe(0);
        });
        it('should return 0 when the currency and amount of the transactions are the same', () => {
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: '1',
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                managerID: RORY_ACCOUNT_ID,
            };
            const fakeTransaction = {
                ...(0, transaction_1.default)(1),
                reportID: fakeReport.reportID,
                amount: 100,
                currency: 'USD',
            };
            expect((0, IOU_1.calculateDiffAmount)(fakeReport, fakeTransaction, fakeTransaction)).toBe(0);
        });
        it('should return the difference between the updated amount and the current amount when the currency of the updated and current transactions have the same currency', () => {
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: '1',
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                managerID: RORY_ACCOUNT_ID,
                currency: 'USD',
            };
            const fakeTransaction = {
                ...(0, transaction_1.default)(1),
                amount: 100,
                currency: 'USD',
            };
            const updatedTransaction = {
                ...fakeTransaction,
                amount: 200,
                currency: 'USD',
            };
            expect((0, IOU_1.calculateDiffAmount)(fakeReport, updatedTransaction, fakeTransaction)).toBe(-100);
        });
        it('should return null when the currency of the updated and current transactions have different values', () => {
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: '1',
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                managerID: RORY_ACCOUNT_ID,
            };
            const fakeTransaction = {
                ...(0, transaction_1.default)(1),
                amount: 100,
                currency: 'USD',
            };
            const updatedTransaction = {
                ...fakeTransaction,
                amount: 200,
                currency: 'EUR',
            };
            expect((0, IOU_1.calculateDiffAmount)(fakeReport, updatedTransaction, fakeTransaction)).toBeNull();
        });
    });
    describe('initMoneyRequest', () => {
        const fakeReport = {
            ...(0, reports_1.createRandomReport)(0),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            policyID: '1',
            managerID: CARLOS_ACCOUNT_ID,
        };
        const fakePolicy = {
            ...(0, policies_1.default)(1),
            type: CONST_1.default.POLICY.TYPE.TEAM,
            outputCurrency: 'USD',
        };
        const fakeParentReport = {
            ...(0, reports_1.createRandomReport)(1),
            reportID: fakeReport.reportID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            policyID: '1',
            managerID: CARLOS_ACCOUNT_ID,
        };
        const fakePersonalPolicy = {
            ...(0, policies_1.default)(2),
            type: CONST_1.default.POLICY.TYPE.PERSONAL,
            outputCurrency: 'NZD',
        };
        const transactionResult = {
            amount: 0,
            comment: {
                attendees: [
                    {
                        email: 'rory@expensifail.com',
                        login: 'rory@expensifail.com',
                        accountID: 3,
                        text: 'rory@expensifail.com',
                        selected: true,
                        reportID: '0',
                        avatarUrl: '',
                        displayName: '',
                    },
                ],
            },
            created: '2025-04-01',
            currency: 'USD',
            iouRequestType: 'manual',
            reportID: fakeReport.reportID,
            transactionID: CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID,
            isFromGlobalCreate: true,
            merchant: '(none)',
            splitPayerAccountIDs: [3],
        };
        const currentDate = '2025-04-01';
        beforeEach(async () => {
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`, null);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.CURRENT_DATE}`, currentDate);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`, fakeReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePersonalPolicy.id}`, fakePersonalPolicy);
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('should merge transaction draft onyx value', async () => {
            await (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                (0, IOU_1.initMoneyRequest)({
                    reportID: fakeReport.reportID,
                    policy: fakePolicy,
                    isFromGlobalCreate: true,
                    newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.MANUAL,
                    report: fakeReport,
                    parentReport: fakeParentReport,
                    currentDate,
                });
            })
                .then(async () => {
                expect(await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`)).toStrictEqual(transactionResult);
            });
        });
        it('should modify transaction draft when currentIouRequestType is different', async () => {
            await (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                return (0, IOU_1.initMoneyRequest)({
                    reportID: fakeReport.reportID,
                    policy: fakePolicy,
                    isFromGlobalCreate: true,
                    currentIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.MANUAL,
                    newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
                    report: fakeReport,
                    parentReport: fakeParentReport,
                    currentDate,
                });
            })
                .then(async () => {
                expect(await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`)).toStrictEqual({
                    ...transactionResult,
                    iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
                });
            });
        });
        it('should return personal currency when policy is missing', async () => {
            await (0, waitForBatchedUpdates_1.default)()
                .then(() => {
                return (0, IOU_1.initMoneyRequest)({
                    reportID: fakeReport.reportID,
                    isFromGlobalCreate: true,
                    newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.MANUAL,
                    report: fakeReport,
                    parentReport: fakeParentReport,
                    currentDate,
                });
            })
                .then(async () => {
                expect(await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`)).toStrictEqual({
                    ...transactionResult,
                    currency: fakePersonalPolicy.outputCurrency,
                });
            });
        });
    });
    describe('updateMoneyRequestAmountAndCurrency', () => {
        it('update the amount of the money request successfully', async () => {
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: '1',
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                managerID: RORY_ACCOUNT_ID,
            };
            const fakeTransaction = {
                ...(0, transaction_1.default)(1),
                reportID: fakeReport.reportID,
                amount: 100,
                currency: 'USD',
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction.transactionID}`, fakeTransaction);
            mockFetch?.pause?.();
            (0, IOU_1.updateMoneyRequestAmountAndCurrency)({
                transactionID: fakeTransaction.transactionID,
                transactionThreadReportID: fakeReport.reportID,
                amount: 20000,
                currency: CONST_1.default.CURRENCY.USD,
                taxAmount: 0,
                taxCode: '',
                policy: {
                    id: '123',
                    role: 'user',
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    name: '',
                    owner: '',
                    outputCurrency: '',
                    isPolicyExpenseChatEnabled: false,
                },
                policyTagList: {},
                policyCategories: {},
                transactions: {},
                transactionViolations: {},
            });
            await (0, waitForBatchedUpdates_1.default)();
            mockFetch?.succeed?.();
            await mockFetch?.resume?.();
            const updatedTransaction = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (transactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newTransaction = transactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction.transactionID}`];
                        resolve(newTransaction);
                    },
                });
            });
            expect(updatedTransaction?.modifiedAmount).toBe(20000);
        });
        it('update the amount of the money request failed', async () => {
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID: '1',
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                managerID: RORY_ACCOUNT_ID,
            };
            const fakeTransaction = {
                ...(0, transaction_1.default)(1),
                reportID: fakeReport.reportID,
                amount: 100,
                currency: 'USD',
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction.transactionID}`, fakeTransaction);
            mockFetch?.pause?.();
            (0, IOU_1.updateMoneyRequestAmountAndCurrency)({
                transactionID: fakeTransaction.transactionID,
                transactionThreadReportID: fakeReport.reportID,
                amount: 20000,
                currency: CONST_1.default.CURRENCY.USD,
                taxAmount: 0,
                taxCode: '',
                policy: {
                    id: '123',
                    role: 'user',
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    name: '',
                    owner: '',
                    outputCurrency: '',
                    isPolicyExpenseChatEnabled: false,
                },
                policyTagList: {},
                policyCategories: {},
                transactions: {},
                transactionViolations: {},
            });
            await (0, waitForBatchedUpdates_1.default)();
            mockFetch?.fail?.();
            await mockFetch?.resume?.();
            const updatedTransaction = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (transactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newTransaction = transactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction.transactionID}`];
                        resolve(newTransaction);
                    },
                });
            });
            expect(updatedTransaction?.modifiedAmount).toBe(0);
        });
    });
    describe('cancelPayment', () => {
        const amount = 10000;
        const comment = '💸💸💸💸';
        const merchant = 'NASDAQ';
        afterEach(() => {
            mockFetch?.resume?.();
        });
        it('pendingAction is not null after canceling the payment failed', async () => {
            let expenseReport;
            let chatReport;
            // Given a signed in account, which owns a workspace, and has a policy expense chat
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
            // Which owns a workspace
            await (0, waitForBatchedUpdates_1.default)();
            (0, Policy_1.createWorkspace)({
                policyOwnerEmail: CARLOS_EMAIL,
                makeMeAdmin: true,
                policyName: "Carlos's Workspace",
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Get the policy expense chat report
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (allReports) => {
                    chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                },
            });
            if (chatReport) {
                // When an IOU expense is submitted to that policy expense chat
                (0, IOU_1.requestMoney)({
                    report: chatReport,
                    participantParams: {
                        payeeEmail: RORY_EMAIL,
                        payeeAccountID: RORY_ACCOUNT_ID,
                        participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                    },
                    transactionParams: {
                        amount,
                        attendees: [],
                        currency: CONST_1.default.CURRENCY.USD,
                        created: '',
                        merchant,
                        comment,
                    },
                    shouldGenerateTransactionThreadReport: true,
                });
            }
            await (0, waitForBatchedUpdates_1.default)();
            // And given an expense report has now been created which holds the IOU
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (allReports) => {
                    expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                },
            });
            if (chatReport && expenseReport) {
                mockFetch?.pause?.();
                // And when the payment is cancelled
                (0, IOU_1.cancelPayment)(expenseReport, chatReport);
            }
            await (0, waitForBatchedUpdates_1.default)();
            mockFetch?.fail?.();
            await mockFetch?.resume?.();
            await (0, TestHelper_1.getOnyxData)({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport?.reportID}`,
                callback: (allReportActions) => {
                    const action = Object.values(allReportActions ?? {}).find((a) => a?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_DEQUEUED);
                    expect(action?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                },
            });
        });
    });
    describe('payMoneyRequest', () => {
        const amount = 10000;
        const comment = '💸💸💸💸';
        const merchant = 'NASDAQ';
        afterEach(() => {
            mockFetch?.resume?.();
        });
        it('pendingAction is not null after paying the money request', async () => {
            let expenseReport;
            let chatReport;
            // Given a signed in account, which owns a workspace, and has a policy expense chat
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
            // Which owns a workspace
            await (0, waitForBatchedUpdates_1.default)();
            (0, Policy_1.createWorkspace)({
                policyOwnerEmail: CARLOS_EMAIL,
                makeMeAdmin: true,
                policyName: "Carlos's Workspace",
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Get the policy expense chat report
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (allReports) => {
                    chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                },
            });
            if (chatReport) {
                // When an IOU expense is submitted to that policy expense chat
                (0, IOU_1.requestMoney)({
                    report: chatReport,
                    participantParams: {
                        payeeEmail: RORY_EMAIL,
                        payeeAccountID: RORY_ACCOUNT_ID,
                        participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID },
                    },
                    transactionParams: {
                        amount,
                        attendees: [],
                        currency: CONST_1.default.CURRENCY.USD,
                        created: '',
                        merchant,
                        comment,
                    },
                    shouldGenerateTransactionThreadReport: true,
                });
            }
            await (0, waitForBatchedUpdates_1.default)();
            // And given an expense report has now been created which holds the IOU
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (allReports) => {
                    expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.IOU);
                },
            });
            // When the expense report is paid elsewhere (but really, any payment option would work)
            if (chatReport && expenseReport) {
                mockFetch?.pause?.();
                (0, IOU_1.payMoneyRequest)(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, chatReport, expenseReport);
            }
            await (0, waitForBatchedUpdates_1.default)();
            mockFetch?.fail?.();
            await mockFetch?.resume?.();
            await (0, TestHelper_1.getOnyxData)({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport?.reportID}`,
                callback: (allReportActions) => {
                    const action = Object.values(allReportActions ?? {}).find((a) => {
                        const originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(a) ? (0, ReportActionsUtils_1.getOriginalMessage)(a) : undefined;
                        return originalMessage?.type === 'pay';
                    });
                    expect(action?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                },
            });
        });
    });
    describe('initSplitExpense', () => {
        it('should initialize split expense with correct transaction details', async () => {
            const transaction = {
                transactionID: '123',
                amount: 100,
                currency: 'USD',
                merchant: 'Test Merchant',
                comment: {
                    comment: 'Test comment',
                    splitExpenses: [],
                    attendees: [],
                    type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                },
                category: 'Food',
                tag: 'lunch',
                created: DateUtils_1.default.getDBTime(),
                reportID: '456',
            };
            (0, IOU_1.initSplitExpense)(transaction);
            await (0, waitForBatchedUpdates_1.default)();
            const draftTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transaction.transactionID}`);
            expect(draftTransaction).toBeTruthy();
            const splitExpenses = draftTransaction?.comment?.splitExpenses;
            expect(splitExpenses).toHaveLength(2);
            expect(draftTransaction?.amount).toBe(100);
            expect(draftTransaction?.currency).toBe('USD');
            expect(draftTransaction?.merchant).toBe('Test Merchant');
            expect(draftTransaction?.reportID).toBe(transaction.reportID);
            expect(splitExpenses?.[0].amount).toBe(50);
            expect(splitExpenses?.[0].description).toBe('Test comment');
            expect(splitExpenses?.[0].category).toBe('Food');
            expect(splitExpenses?.[0].tags).toEqual(['lunch']);
            expect(splitExpenses?.[1].amount).toBe(50);
            expect(splitExpenses?.[1].description).toBe('Test comment');
            expect(splitExpenses?.[1].category).toBe('Food');
            expect(splitExpenses?.[1].tags).toEqual(['lunch']);
        });
        it('should not initialize split expense for null transaction', async () => {
            const transaction = undefined;
            (0, IOU_1.initSplitExpense)(transaction);
            await (0, waitForBatchedUpdates_1.default)();
            expect(transaction).toBeFalsy();
        });
    });
    describe('addSplitExpenseField', () => {
        it('should add new split expense field to draft transaction', async () => {
            const transaction = {
                transactionID: '123',
                amount: 100,
                currency: 'USD',
                merchant: 'Test Merchant',
                comment: {
                    comment: 'Test comment',
                    splitExpenses: [],
                    attendees: [],
                    type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                },
                category: 'Food',
                tag: 'lunch',
                created: DateUtils_1.default.getDBTime(),
                reportID: '456',
            };
            const draftTransaction = {
                transactionID: '123',
                amount: 100,
                currency: 'USD',
                merchant: 'Test Merchant',
                comment: {
                    comment: 'Test comment',
                    splitExpenses: [
                        {
                            transactionID: '789',
                            amount: 50,
                            description: 'Test comment',
                            category: 'Food',
                            tags: ['lunch'],
                            created: DateUtils_1.default.getDBTime(),
                        },
                    ],
                    attendees: [],
                    type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                },
                category: 'Food',
                tag: 'lunch',
                created: DateUtils_1.default.getDBTime(),
                reportID: '456',
            };
            (0, IOU_1.addSplitExpenseField)(transaction, draftTransaction);
            await (0, waitForBatchedUpdates_1.default)();
            const updatedDraftTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transaction.transactionID}`);
            expect(updatedDraftTransaction).toBeTruthy();
            const splitExpenses = updatedDraftTransaction?.comment?.splitExpenses;
            expect(splitExpenses).toHaveLength(2);
            expect(splitExpenses?.[1].amount).toBe(0);
            expect(splitExpenses?.[1].description).toBe('Test comment');
            expect(splitExpenses?.[1].category).toBe('Food');
            expect(splitExpenses?.[1].tags).toEqual(['lunch']);
        });
    });
    describe('updateSplitExpenseAmountField', () => {
        it('should update amount expense field to draft transaction', async () => {
            const originalTransactionID = '123';
            const currentTransactionID = '789';
            const draftTransaction = {
                transactionID: '234',
                amount: 100,
                currency: 'USD',
                merchant: 'Test Merchant',
                comment: {
                    comment: 'Test comment',
                    originalTransactionID,
                    splitExpenses: [
                        {
                            transactionID: currentTransactionID,
                            amount: 50,
                            description: 'Test comment',
                            category: 'Food',
                            tags: ['lunch'],
                            created: DateUtils_1.default.getDBTime(),
                        },
                    ],
                    attendees: [],
                    type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                },
                category: 'Food',
                tag: 'lunch',
                created: DateUtils_1.default.getDBTime(),
                reportID: '456',
            };
            (0, IOU_1.updateSplitExpenseAmountField)(draftTransaction, currentTransactionID, 20);
            await (0, waitForBatchedUpdates_1.default)();
            const updatedDraftTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${originalTransactionID}`);
            expect(updatedDraftTransaction).toBeTruthy();
            const splitExpenses = updatedDraftTransaction?.comment?.splitExpenses;
            expect(splitExpenses?.[0].amount).toBe(20);
        });
    });
    describe('replaceReceipt', () => {
        it('should replace the receipt of the transaction', async () => {
            const transactionID = '123';
            const file = new File([new Blob(['test'])], 'test.jpg', { type: 'image/jpeg' });
            file.source = 'test';
            const source = 'test';
            const transaction = {
                transactionID,
                receipt: {
                    source: 'test1',
                },
            };
            // Given a transaction with a receipt
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, transaction);
            await (0, waitForBatchedUpdates_1.default)();
            const searchQueryJSON = {
                hash: 12345,
                query: 'test',
            };
            // Given a snapshot of the transaction
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${searchQueryJSON.hash}`, {
                // @ts-expect-error: Allow partial record in snapshot update
                data: {
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]: transaction,
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            // When the receipt is replaced
            (0, IOU_1.replaceReceipt)({ transactionID, file, source });
            await (0, waitForBatchedUpdates_1.default)();
            // Then the transaction should have the new receipt source
            const updatedTransaction = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (transactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newTransaction = transactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
                        resolve(newTransaction);
                    },
                });
            });
            expect(updatedTransaction?.receipt?.source).toBe(source);
            // Then the snapshot should have the new receipt source
            const updatedSnapshot = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.SNAPSHOT,
                    waitForCollectionCallback: true,
                    callback: (snapshots) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newSnapshot = snapshots[`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${searchQueryJSON.hash}`];
                        resolve(newSnapshot);
                    },
                });
            });
            expect(updatedSnapshot?.data?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]?.receipt?.source).toBe(source);
        });
        it('should add receipt if it does not exist', async () => {
            const transactionID = '123';
            const file = new File([new Blob(['test'])], 'test.jpg', { type: 'image/jpeg' });
            file.source = 'test';
            const source = 'test';
            const transaction = {
                transactionID,
            };
            // Given a transaction without a receipt
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, transaction);
            await (0, waitForBatchedUpdates_1.default)();
            const searchQueryJSON = {
                hash: 12345,
                query: 'test',
            };
            // Given a snapshot of the transaction
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${searchQueryJSON.hash}`, {
                // @ts-expect-error: Allow partial record in snapshot update
                data: {
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]: transaction,
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            // When the receipt is replaced
            (0, IOU_1.replaceReceipt)({ transactionID, file, source });
            await (0, waitForBatchedUpdates_1.default)();
            // Then the transaction should have the new receipt source
            const updatedTransaction = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                    waitForCollectionCallback: true,
                    callback: (transactions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newTransaction = transactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
                        resolve(newTransaction);
                    },
                });
            });
            expect(updatedTransaction?.receipt?.source).toBe(source);
            // Then the snapshot should have the new receipt source
            const updatedSnapshot = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.SNAPSHOT,
                    waitForCollectionCallback: true,
                    callback: (snapshots) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newSnapshot = snapshots[`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${searchQueryJSON.hash}`];
                        resolve(newSnapshot);
                    },
                });
            });
            expect(updatedSnapshot?.data?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]?.receipt?.source).toBe(source);
        });
    });
    describe('changeTransactionsReport', () => {
        it('should set the correct optimistic onyx data for reporting a tracked expense', async () => {
            let personalDetailsList;
            let expenseReport;
            let transaction;
            // Given a signed in account, which owns a workspace, and has a policy expense chat
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID });
            const creatorPersonalDetails = personalDetailsList?.[CARLOS_ACCOUNT_ID] ?? { accountID: CARLOS_ACCOUNT_ID };
            const policyID = (0, Policy_1.generatePolicyID)();
            (0, Policy_1.createWorkspace)({
                policyOwnerEmail: CARLOS_EMAIL,
                makeMeAdmin: true,
                policyName: "Carlos's Workspace",
                policyID,
            });
            (0, Report_1.createNewReport)(creatorPersonalDetails, policyID);
            // Create a tracked expense
            const selfDMReport = {
                ...(0, reports_1.createRandomReport)(1),
                reportID: '10',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
            };
            const amount = 100;
            (0, IOU_1.trackExpense)({
                report: selfDMReport,
                isDraftPolicy: true,
                action: CONST_1.default.IOU.ACTION.CREATE,
                participantParams: {
                    payeeEmail: RORY_EMAIL,
                    payeeAccountID: RORY_ACCOUNT_ID,
                    participant: { accountID: RORY_ACCOUNT_ID },
                },
                transactionParams: {
                    amount,
                    currency: CONST_1.default.CURRENCY.USD,
                    created: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                    merchant: 'merchant',
                    billable: false,
                },
            });
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                waitForCollectionCallback: true,
                callback: (allTransactions) => {
                    transaction = Object.values(allTransactions ?? {}).find((t) => !!t);
                },
            });
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (allReports) => {
                    expenseReport = Object.values(allReports ?? {}).find((r) => r?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                },
            });
            let iouReportActionOnSelfDMReport;
            let trackExpenseActionableWhisper;
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                waitForCollectionCallback: true,
                callback: (allReportActions) => {
                    iouReportActionOnSelfDMReport = Object.values(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`] ?? {}).find((r) => r?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.IOU);
                    trackExpenseActionableWhisper = Object.values(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport?.reportID}`] ?? {}).find((r) => r?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_TRACK_EXPENSE_WHISPER);
                },
            });
            expect((0, ReportActionsUtils_1.isMoneyRequestAction)(iouReportActionOnSelfDMReport) ? (0, ReportActionsUtils_1.getOriginalMessage)(iouReportActionOnSelfDMReport)?.IOUTransactionID : undefined).toBe(transaction?.transactionID);
            expect(trackExpenseActionableWhisper).toBeDefined();
            if (!transaction || !expenseReport) {
                return;
            }
            (0, Transaction_1.changeTransactionsReport)([transaction?.transactionID], expenseReport?.reportID, false, CARLOS_ACCOUNT_ID, CARLOS_EMAIL);
            let updatedTransaction;
            let updatedIOUReportActionOnSelfDMReport;
            let updatedTrackExpenseActionableWhisper;
            let updatedExpenseReport;
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
                waitForCollectionCallback: true,
                callback: (allTransactions) => {
                    updatedTransaction = Object.values(allTransactions ?? {}).find((t) => t?.transactionID === transaction?.transactionID);
                },
            });
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                waitForCollectionCallback: true,
                callback: (allReportActions) => {
                    updatedIOUReportActionOnSelfDMReport = Object.values(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`] ?? {}).find((r) => r?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.IOU);
                    updatedTrackExpenseActionableWhisper = Object.values(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport?.reportID}`] ?? {}).find((r) => r?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_TRACK_EXPENSE_WHISPER);
                },
            });
            await (0, TestHelper_1.getOnyxData)({
                key: ONYXKEYS_1.default.COLLECTION.REPORT,
                waitForCollectionCallback: true,
                callback: (allReports) => {
                    updatedExpenseReport = Object.values(allReports ?? {}).find((r) => r?.reportID === expenseReport?.reportID);
                },
            });
            expect(updatedTransaction?.reportID).toBe(expenseReport?.reportID);
            expect((0, ReportActionsUtils_1.isMoneyRequestAction)(updatedIOUReportActionOnSelfDMReport) ? (0, ReportActionsUtils_1.getOriginalMessage)(updatedIOUReportActionOnSelfDMReport)?.IOUTransactionID : undefined).toBe(undefined);
            expect(updatedTrackExpenseActionableWhisper).toBe(undefined);
            expect(updatedExpenseReport?.nonReimbursableTotal).toBe(-amount);
            expect(updatedExpenseReport?.total).toBe(-amount);
            expect(updatedExpenseReport?.unheldNonReimbursableTotal).toBe(-amount);
        });
        describe('saveSplitTransactions', () => {
            it("should update split transaction's description correctly ", async () => {
                const amount = 10000;
                let expenseReport;
                let chatReport;
                let originalTransactionID;
                const policyID = (0, Policy_1.generatePolicyID)();
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: CARLOS_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Carlos's Workspace",
                    policyID,
                });
                // Change the approval mode for the policy since default is Submit and Close
                (0, Policy_1.setWorkspaceApprovalMode)(policyID, CARLOS_EMAIL, CONST_1.default.POLICY.APPROVAL_MODE.BASIC);
                await (0, waitForBatchedUpdates_1.default)();
                await (0, TestHelper_1.getOnyxData)({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                    },
                });
                (0, IOU_1.requestMoney)({
                    report: chatReport,
                    participantParams: {
                        payeeEmail: RORY_EMAIL,
                        payeeAccountID: RORY_ACCOUNT_ID,
                        participant: { login: CARLOS_EMAIL, accountID: CARLOS_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport?.reportID },
                    },
                    transactionParams: {
                        amount,
                        attendees: [],
                        currency: CONST_1.default.CURRENCY.USD,
                        created: '',
                        merchant: 'NASDAQ',
                        comment: '*hey* `hey`',
                    },
                    shouldGenerateTransactionThreadReport: true,
                });
                await (0, waitForBatchedUpdates_1.default)();
                await (0, TestHelper_1.getOnyxData)({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                    },
                });
                await (0, TestHelper_1.getOnyxData)({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (allReportsAction) => {
                        const iouActions = Object.values(allReportsAction ?? {}).filter((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        const originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(iouActions?.at(0)) ? (0, ReportActionsUtils_1.getOriginalMessage)(iouActions?.at(0)) : undefined;
                        originalTransactionID = originalMessage?.IOUTransactionID;
                    },
                });
                const originalTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`);
                const draftTransaction = {
                    reportID: originalTransaction?.reportID ?? '456',
                    transactionID: originalTransaction?.transactionID ?? '234',
                    amount,
                    created: originalTransaction?.created ?? DateUtils_1.default.getDBTime(),
                    currency: CONST_1.default.CURRENCY.USD,
                    merchant: originalTransaction?.merchant ?? '',
                    comment: {
                        originalTransactionID,
                        comment: originalTransaction?.comment?.comment ?? '',
                        splitExpenses: [
                            {
                                transactionID: '235',
                                amount: amount / 2,
                                description: '<strong>hey</strong><br /><code>hey</code>',
                                created: DateUtils_1.default.getDBTime(),
                            },
                            {
                                transactionID: '234',
                                amount: amount / 2,
                                description: '*hey1* `hey`',
                                created: DateUtils_1.default.getDBTime(),
                            },
                        ],
                        attendees: [],
                        type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                    },
                };
                (0, IOU_1.saveSplitTransactions)(draftTransaction, -2);
                await (0, waitForBatchedUpdates_1.default)();
                const split1 = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}235`);
                expect(split1?.comment?.comment).toBe('<strong>hey</strong><br /><code>hey</code>');
                const split2 = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}234`);
                expect(split2?.comment?.comment).toBe('<strong>hey1</strong> <code>hey</code>');
            });
            it("should not create new expense report if the admin split the employee's expense", async () => {
                const amount = 10000;
                let expenseReport;
                let chatReport;
                let originalTransactionID;
                const policyID = (0, Policy_1.generatePolicyID)();
                (0, Policy_1.createWorkspace)({
                    policyOwnerEmail: RORY_EMAIL,
                    makeMeAdmin: true,
                    policyName: "Rory's Workspace",
                    policyID,
                });
                // Change the approval mode for the policy since default is Submit and Close
                (0, Policy_1.setWorkspaceApprovalMode)(policyID, RORY_EMAIL, CONST_1.default.POLICY.APPROVAL_MODE.BASIC);
                await (0, waitForBatchedUpdates_1.default)();
                await (0, TestHelper_1.getOnyxData)({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        chatReport = Object.values(allReports ?? {}).find((report) => report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT);
                    },
                });
                (0, IOU_1.requestMoney)({
                    report: chatReport,
                    participantParams: {
                        payeeEmail: CARLOS_EMAIL,
                        payeeAccountID: CARLOS_ACCOUNT_ID,
                        participant: { login: RORY_EMAIL, accountID: RORY_ACCOUNT_ID, isPolicyExpenseChat: true, reportID: chatReport?.reportID },
                    },
                    transactionParams: {
                        amount,
                        attendees: [],
                        currency: CONST_1.default.CURRENCY.USD,
                        created: '',
                        merchant: 'NASDAQ',
                        comment: '*hey* `hey`',
                    },
                    shouldGenerateTransactionThreadReport: true,
                });
                await (0, waitForBatchedUpdates_1.default)();
                await (0, TestHelper_1.getOnyxData)({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT,
                    waitForCollectionCallback: true,
                    callback: (allReports) => {
                        expenseReport = Object.values(allReports ?? {}).find((report) => report?.type === CONST_1.default.REPORT.TYPE.EXPENSE);
                    },
                });
                await (0, TestHelper_1.getOnyxData)({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport?.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (allReportsAction) => {
                        const iouActions = Object.values(allReportsAction ?? {}).filter((reportAction) => (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction));
                        const originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(iouActions?.at(0)) ? (0, ReportActionsUtils_1.getOriginalMessage)(iouActions?.at(0)) : undefined;
                        originalTransactionID = originalMessage?.IOUTransactionID;
                    },
                });
                const originalTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`);
                const draftTransaction = {
                    reportID: originalTransaction?.reportID ?? '456',
                    transactionID: originalTransaction?.transactionID ?? '234',
                    amount,
                    created: originalTransaction?.created ?? DateUtils_1.default.getDBTime(),
                    currency: CONST_1.default.CURRENCY.USD,
                    merchant: originalTransaction?.merchant ?? '',
                    comment: {
                        originalTransactionID,
                        comment: originalTransaction?.comment?.comment ?? '',
                        splitExpenses: [
                            {
                                transactionID: '235',
                                amount: amount / 2,
                                description: '<strong>hey</strong><br /><code>hey</code>',
                                created: DateUtils_1.default.getDBTime(),
                            },
                            {
                                transactionID: '234',
                                amount: amount / 2,
                                description: '*hey1* `hey`',
                                created: DateUtils_1.default.getDBTime(),
                            },
                        ],
                        attendees: [],
                        type: CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT,
                    },
                };
                (0, IOU_1.saveSplitTransactions)(draftTransaction, -2);
                await (0, waitForBatchedUpdates_1.default)();
                const split1 = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}235`);
                expect(split1?.reportID).toBe(expenseReport?.reportID);
                const split2 = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}234`);
                expect(split2?.reportID).toBe(expenseReport?.reportID);
            });
        });
    });
    describe('getIOUReportActionToApproveOrPay', () => {
        it('should exclude deleted actions', async () => {
            const reportID = '1';
            const policyID = '2';
            const fakePolicy = {
                ...(0, policies_1.default)(Number(policyID)),
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
                type: CONST_1.default.POLICY.TYPE.TEAM,
            };
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(Number(reportID)),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                policyID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                managerID: RORY_ACCOUNT_ID,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
            };
            const fakeTransaction1 = {
                ...(0, transaction_1.default)(0),
                reportID,
                bank: CONST_1.default.EXPENSIFY_CARD.BANK,
                status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            };
            const fakeTransaction2 = {
                ...(0, transaction_1.default)(1),
                reportID,
                amount: 27,
                receipt: {
                    source: 'test',
                    state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED,
                },
                merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
                modifiedMerchant: undefined,
            };
            const fakeTransaction3 = {
                ...(0, transaction_1.default)(2),
                reportID,
                amount: 100,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`, fakeReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction1.transactionID}`, fakeTransaction1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction2.transactionID}`, fakeTransaction2);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${fakeTransaction3.transactionID}`, fakeTransaction3);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
            await (0, waitForBatchedUpdates_1.default)();
            const deletedReportAction = {
                reportActionID: '0',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                created: '2024-08-08 18:70:44.171',
                childReportID: reportID,
            };
            const MOCK_REPORT_ACTIONS = {
                [deletedReportAction.reportActionID]: deletedReportAction,
                [reportID]: {
                    reportActionID: reportID,
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                    created: '2024-08-08 19:70:44.171',
                    childReportID: reportID,
                    message: [
                        {
                            type: 'TEXT',
                            text: 'Hello world!',
                        },
                    ],
                },
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${fakeReport.reportID}`, MOCK_REPORT_ACTIONS);
            expect((0, IOU_1.getIOUReportActionToApproveOrPay)(fakeReport, undefined)).toMatchObject(MOCK_REPORT_ACTIONS[reportID]);
        });
    });
    describe('mergeDuplicates', () => {
        let writeSpy;
        beforeEach(() => {
            jest.clearAllMocks();
            global.fetch = (0, TestHelper_1.getGlobalFetchMock)();
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            writeSpy = jest.spyOn(API, 'write').mockImplementation((command, params, options) => {
                // Apply optimistic data for testing
                if (options?.optimisticData) {
                    options.optimisticData.forEach((update) => {
                        if (update.onyxMethod === react_native_onyx_1.default.METHOD.MERGE) {
                            react_native_onyx_1.default.merge(update.key, update.value);
                        }
                        else if (update.onyxMethod === react_native_onyx_1.default.METHOD.SET) {
                            react_native_onyx_1.default.set(update.key, update.value);
                        }
                    });
                }
                return Promise.resolve();
            });
            return react_native_onyx_1.default.clear();
        });
        afterEach(() => {
            writeSpy.mockRestore();
        });
        const createMockTransaction = (id, reportID, amount = 100) => ({
            ...(0, transaction_1.default)(Number(id)),
            transactionID: id,
            reportID,
            amount,
            created: '2024-01-01 12:00:00',
            currency: 'EUR',
            merchant: 'Test Merchant',
            modifiedMerchant: 'Updated Merchant',
            comment: { comment: 'Updated comment' },
            category: 'Travel',
            tag: 'UpdatedProject',
            billable: true,
            reimbursable: false,
        });
        const createMockReport = (reportID, total = 300) => ({
            ...(0, reports_1.createRandomReport)(Number(reportID)),
            reportID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            total,
        });
        const createMockViolations = () => [
            { name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
            { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
        ];
        const createMockIouAction = (transactionID, reportActionID, childReportID) => ({
            reportActionID,
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            created: '2024-01-01 12:00:00',
            originalMessage: {
                IOUTransactionID: transactionID,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
            },
            message: [{ type: 'TEXT', text: 'Test IOU message' }],
            childReportID,
        });
        it('should merge duplicate transactions successfully', async () => {
            // Given: Set up test data with main transaction and duplicates
            const reportID = 'report123';
            const mainTransactionID = 'main123';
            const duplicate1ID = 'dup456';
            const duplicate2ID = 'dup789';
            const duplicateTransactionIDs = [duplicate1ID, duplicate2ID];
            const childReportID = 'child123';
            const mainTransaction = createMockTransaction(mainTransactionID, reportID, 150);
            const duplicateTransaction1 = createMockTransaction(duplicate1ID, reportID, 100);
            const duplicateTransaction2 = createMockTransaction(duplicate2ID, reportID, 50);
            const expenseReport = createMockReport(reportID, 300);
            const mainViolations = createMockViolations();
            const duplicate1Violations = createMockViolations();
            const duplicate2Violations = createMockViolations();
            const iouAction1 = createMockIouAction(duplicate1ID, 'action456', childReportID);
            const iouAction2 = createMockIouAction(duplicate2ID, 'action789', childReportID);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`, mainTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate1ID}`, duplicateTransaction1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate2ID}`, duplicateTransaction2);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, expenseReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mainTransactionID}`, mainViolations);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate1ID}`, duplicate1Violations);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate2ID}`, duplicate2Violations);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
                action456: iouAction1,
                action789: iouAction2,
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`, {});
            await (0, waitForBatchedUpdates_1.default)();
            const mergeParams = {
                transactionID: mainTransactionID,
                transactionIDList: duplicateTransactionIDs,
                created: '2024-01-01 12:00:00',
                merchant: 'Updated Merchant',
                amount: 200,
                currency: CONST_1.default.CURRENCY.EUR,
                category: 'Travel',
                comment: 'Updated comment',
                billable: true,
                reimbursable: false,
                tag: 'UpdatedProject',
                receiptID: 123,
                reportID,
            };
            // When: Call mergeDuplicates
            (0, IOU_1.mergeDuplicates)(mergeParams);
            await (0, waitForBatchedUpdates_1.default)();
            // Then: Verify main transaction was updated
            const updatedMainTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`);
            expect(updatedMainTransaction).toMatchObject({
                billable: true,
                comment: { comment: 'Updated comment' },
                category: 'Travel',
                created: '2024-01-01 12:00:00',
                currency: CONST_1.default.CURRENCY.EUR,
                modifiedMerchant: 'Updated Merchant',
                reimbursable: false,
                tag: 'UpdatedProject',
            });
            // Then: Verify duplicate transactions were removed
            const removedDuplicate1 = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate1ID}`);
            const removedDuplicate2 = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate2ID}`);
            expect(removedDuplicate1).toBeFalsy();
            expect(removedDuplicate2).toBeFalsy();
            // Then: Verify violations were filtered to remove DUPLICATED_TRANSACTION
            const updatedMainViolations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mainTransactionID}`);
            const updatedDup1Violations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate1ID}`);
            const updatedDup2Violations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate2ID}`);
            expect(updatedMainViolations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
            expect(updatedDup1Violations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
            expect(updatedDup2Violations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
            // Then: Verify expense report total was updated
            const updatedReport = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`);
            expect(updatedReport?.total).toBe(150); // 300 - 100 - 50 = 150
            // Then: Verify IOU actions were marked as deleted
            const updatedReportActions = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`);
            expect((0, ReportActionsUtils_1.getOriginalMessage)(updatedReportActions?.action456)).toHaveProperty('deleted');
            expect((0, ReportActionsUtils_1.getOriginalMessage)(updatedReportActions?.action789)).toHaveProperty('deleted');
            // Then: Verify API was called with correct parameters
            expect(writeSpy).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.MERGE_DUPLICATES, expect.objectContaining(mergeParams), expect.objectContaining({
                optimisticData: expect.arrayContaining([]),
                failureData: expect.arrayContaining([]),
            }));
        });
        it('should handle empty duplicate transaction list', async () => {
            // Given: Set up test data with only main transaction
            const reportID = 'report123';
            const mainTransactionID = 'main123';
            const mainTransaction = createMockTransaction(mainTransactionID, reportID);
            const expenseReport = createMockReport(reportID, 150);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`, mainTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, expenseReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mainTransactionID}`, []);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {});
            await (0, waitForBatchedUpdates_1.default)();
            const mergeParams = {
                transactionID: mainTransactionID,
                transactionIDList: [],
                created: '2024-01-01 12:00:00',
                merchant: 'Updated Merchant',
                amount: 200,
                currency: CONST_1.default.CURRENCY.EUR,
                category: 'Travel',
                comment: 'Updated comment',
                billable: true,
                reimbursable: false,
                tag: 'UpdatedProject',
                receiptID: 123,
                reportID,
            };
            // When: Call mergeDuplicates with empty duplicate list
            (0, IOU_1.mergeDuplicates)(mergeParams);
            await (0, waitForBatchedUpdates_1.default)();
            // Then: Verify main transaction was still updated
            const updatedMainTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`);
            expect(updatedMainTransaction).toMatchObject({
                billable: true,
                comment: { comment: 'Updated comment' },
                category: 'Travel',
                modifiedMerchant: 'Updated Merchant',
            });
            // Then: Verify expense report total remained unchanged (no duplicates to subtract)
            const updatedReport = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`);
            expect(updatedReport?.total).toBe(150);
        });
        it('should handle missing expense report gracefully', async () => {
            // Given: Set up test data without expense report
            const reportID = 'report123';
            const mainTransactionID = 'main123';
            const duplicate1ID = 'dup456';
            const duplicateTransactionIDs = [duplicate1ID];
            const mainTransaction = createMockTransaction(mainTransactionID, reportID);
            const duplicateTransaction = createMockTransaction(duplicate1ID, reportID, 50);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`, mainTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate1ID}`, duplicateTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mainTransactionID}`, []);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate1ID}`, []);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {});
            await (0, waitForBatchedUpdates_1.default)();
            const mergeParams = {
                transactionID: mainTransactionID,
                transactionIDList: duplicateTransactionIDs,
                created: '2024-01-01 12:00:00',
                merchant: 'Updated Merchant',
                amount: 200,
                currency: CONST_1.default.CURRENCY.EUR,
                category: 'Travel',
                comment: 'Updated comment',
                billable: true,
                reimbursable: false,
                tag: 'UpdatedProject',
                receiptID: 123,
                reportID,
            };
            // When: Call mergeDuplicates without expense report
            (0, IOU_1.mergeDuplicates)(mergeParams);
            await (0, waitForBatchedUpdates_1.default)();
            // Then: Verify function completed without errors
            const updatedMainTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`);
            expect(updatedMainTransaction).toMatchObject({
                category: 'Travel',
                modifiedMerchant: 'Updated Merchant',
            });
            // Then: Verify API was still called
            expect(writeSpy).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.MERGE_DUPLICATES, expect.objectContaining({}), expect.objectContaining({}));
        });
    });
    describe('resolveDuplicates', () => {
        let writeSpy;
        beforeEach(() => {
            jest.clearAllMocks();
            global.fetch = (0, TestHelper_1.getGlobalFetchMock)();
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            writeSpy = jest.spyOn(API, 'write').mockImplementation((command, params, options) => {
                // Apply optimistic data for testing
                if (options?.optimisticData) {
                    options.optimisticData.forEach((update) => {
                        if (update.onyxMethod === react_native_onyx_1.default.METHOD.MERGE) {
                            react_native_onyx_1.default.merge(update.key, update.value);
                        }
                        else if (update.onyxMethod === react_native_onyx_1.default.METHOD.SET) {
                            react_native_onyx_1.default.set(update.key, update.value);
                        }
                    });
                }
                return Promise.resolve();
            });
            return react_native_onyx_1.default.clear();
        });
        afterEach(() => {
            writeSpy.mockRestore();
        });
        const createMockTransaction = (id, reportID, amount = 100) => ({
            ...(0, transaction_1.default)(Number(id)),
            transactionID: id,
            reportID,
            amount,
            created: '2024-01-01 12:00:00',
            currency: 'EUR',
            merchant: 'Test Merchant',
            modifiedMerchant: 'Updated Merchant',
            comment: { comment: 'Updated comment' },
            category: 'Travel',
            tag: 'UpdatedProject',
            billable: true,
            reimbursable: false,
        });
        const createMockViolations = () => [
            { name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
            { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
        ];
        const createMockIouAction = (transactionID, reportActionID, childReportID) => ({
            reportActionID,
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            originalMessage: {
                IOUTransactionID: transactionID,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
            },
            message: [{ type: 'TEXT', text: 'Test IOU message' }],
            childReportID,
        });
        it('should resolve duplicate transactions successfully', async () => {
            // Given: Set up test data with main transaction and duplicates
            const reportID = 'report123';
            const mainTransactionID = 'main123';
            const duplicate1ID = 'dup456';
            const duplicate2ID = 'dup789';
            const duplicateTransactionIDs = [duplicate1ID, duplicate2ID];
            const childReportID1 = 'child456';
            const childReportID2 = 'child789';
            const mainChildReportID = 'mainChild123';
            const mainTransaction = createMockTransaction(mainTransactionID, reportID, 150);
            const duplicateTransaction1 = createMockTransaction(duplicate1ID, reportID, 100);
            const duplicateTransaction2 = createMockTransaction(duplicate2ID, reportID, 50);
            const mainViolations = createMockViolations();
            const duplicate1Violations = createMockViolations();
            const duplicate2Violations = createMockViolations();
            const iouAction1 = createMockIouAction(duplicate1ID, 'action456', childReportID1);
            const iouAction2 = createMockIouAction(duplicate2ID, 'action789', childReportID2);
            const mainIouAction = createMockIouAction(mainTransactionID, 'mainAction123', mainChildReportID);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`, mainTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate1ID}`, duplicateTransaction1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate2ID}`, duplicateTransaction2);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mainTransactionID}`, mainViolations);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate1ID}`, duplicate1Violations);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate2ID}`, duplicate2Violations);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
                action456: iouAction1,
                action789: iouAction2,
                mainAction123: mainIouAction,
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID1}`, {});
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID2}`, {});
            await (0, waitForBatchedUpdates_1.default)();
            const resolveParams = {
                transactionID: mainTransactionID,
                transactionIDList: duplicateTransactionIDs,
                created: '2024-01-01 12:00:00',
                merchant: 'Updated Merchant',
                amount: 200,
                currency: CONST_1.default.CURRENCY.EUR,
                category: 'Travel',
                comment: 'Updated comment',
                billable: true,
                reimbursable: false,
                tag: 'UpdatedProject',
                receiptID: 123,
                reportID,
            };
            // When: Call resolveDuplicates
            (0, IOU_1.resolveDuplicates)(resolveParams);
            await (0, waitForBatchedUpdates_1.default)();
            // Then: Verify main transaction was updated
            const updatedMainTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`);
            expect(updatedMainTransaction).toMatchObject({
                billable: true,
                comment: { comment: 'Updated comment' },
                category: 'Travel',
                created: '2024-01-01 12:00:00',
                currency: CONST_1.default.CURRENCY.EUR,
                modifiedMerchant: 'Updated Merchant',
                reimbursable: false,
                tag: 'UpdatedProject',
            });
            // Then: Verify duplicate transactions still exist (unlike mergeDuplicates)
            const duplicateTransaction1Updated = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate1ID}`);
            const duplicateTransaction2Updated = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate2ID}`);
            expect(duplicateTransaction1Updated).not.toBeNull();
            expect(duplicateTransaction2Updated).not.toBeNull();
            // Then: Verify violations were updated - main transaction should not have DUPLICATED_TRANSACTION or HOLD
            const updatedMainViolations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mainTransactionID}`);
            expect(updatedMainViolations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
            // Then: Verify duplicate transactions have HOLD violation added but DUPLICATED_TRANSACTION removed
            const updatedDup1Violations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate1ID}`);
            const updatedDup2Violations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate2ID}`);
            expect(updatedDup1Violations).toEqual(expect.arrayContaining([
                { name: CONST_1.default.VIOLATIONS.HOLD, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
            ]));
            expect(updatedDup2Violations).toEqual(expect.arrayContaining([
                { name: CONST_1.default.VIOLATIONS.HOLD, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
            ]));
            // Then: Verify hold report actions were created in child report threads
            const childReportActions1 = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID1}`);
            const childReportActions2 = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID2}`);
            // Should have hold actions added
            expect(Object.keys(childReportActions1 ?? {})).toHaveLength(1);
            expect(Object.keys(childReportActions2 ?? {})).toHaveLength(1);
            // Then: Verify dismissed violation action was created in main transaction thread
            const mainChildReportActions = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${mainChildReportID}`);
            expect(Object.keys(mainChildReportActions ?? {})).toHaveLength(1);
            // Then: Verify API was called with correct parameters
            expect(writeSpy).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.RESOLVE_DUPLICATES, expect.objectContaining({
                transactionID: mainTransactionID,
                transactionIDList: duplicateTransactionIDs,
                reportActionIDList: expect.arrayContaining([]),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                dismissedViolationReportActionID: expect.anything(),
            }), expect.objectContaining({
                optimisticData: expect.arrayContaining([]),
                failureData: expect.arrayContaining([]),
            }));
        });
        it('should return early when transactionID is undefined', async () => {
            // Given: Params with undefined transactionID
            const resolveParams = {
                transactionID: undefined,
                transactionIDList: ['dup456'],
                created: '2024-01-01 12:00:00',
                merchant: 'Updated Merchant',
                amount: 200,
                currency: CONST_1.default.CURRENCY.EUR,
                category: 'Travel',
                comment: 'Updated comment',
                billable: true,
                reimbursable: false,
                tag: 'UpdatedProject',
                receiptID: 123,
                reportID: 'report123',
            };
            // When: Call resolveDuplicates with undefined transactionID
            (0, IOU_1.resolveDuplicates)(resolveParams);
            await (0, waitForBatchedUpdates_1.default)();
            // Then: Verify API was not called
            expect(writeSpy).not.toHaveBeenCalled();
        });
        it('should handle empty duplicate transaction list', async () => {
            // Given: Set up test data with only main transaction
            const reportID = 'report123';
            const mainTransactionID = 'main123';
            const mainChildReportID = 'mainChild123';
            const mainTransaction = createMockTransaction(mainTransactionID, reportID);
            const mainViolations = createMockViolations();
            const mainIouAction = createMockIouAction(mainTransactionID, 'mainAction123', mainChildReportID);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`, mainTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mainTransactionID}`, mainViolations);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
                mainAction123: mainIouAction,
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${mainChildReportID}`, {});
            await (0, waitForBatchedUpdates_1.default)();
            const resolveParams = {
                transactionID: mainTransactionID,
                transactionIDList: [],
                created: '2024-01-01 12:00:00',
                merchant: 'Updated Merchant',
                amount: 200,
                currency: CONST_1.default.CURRENCY.EUR,
                category: 'Travel',
                comment: 'Updated comment',
                billable: true,
                reimbursable: false,
                tag: 'UpdatedProject',
                receiptID: 123,
                reportID,
            };
            // When: Call resolveDuplicates with empty duplicate list
            (0, IOU_1.resolveDuplicates)(resolveParams);
            await (0, waitForBatchedUpdates_1.default)();
            // Then: Verify main transaction was still updated
            const updatedMainTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`);
            expect(updatedMainTransaction).toMatchObject({
                billable: true,
                category: 'Travel',
                modifiedMerchant: 'Updated Merchant',
            });
            // Then: Verify main transaction violations were still filtered
            const updatedMainViolations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mainTransactionID}`);
            expect(updatedMainViolations).toEqual([{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION }]);
            // Then: Verify API was called
            // eslint-disable-next-line
            expect(API.write).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.RESOLVE_DUPLICATES, expect.objectContaining({}), expect.objectContaining({}));
        });
        it('should handle missing IOU actions gracefully', async () => {
            // Given: Set up test data without IOU actions
            const reportID = 'report123';
            const mainTransactionID = 'main123';
            const duplicate1ID = 'dup456';
            const duplicateTransactionIDs = [duplicate1ID];
            const mainTransaction = createMockTransaction(mainTransactionID, reportID);
            const duplicateTransaction = createMockTransaction(duplicate1ID, reportID);
            const mainViolations = createMockViolations();
            const duplicateViolations = createMockViolations();
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`, mainTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicate1ID}`, duplicateTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mainTransactionID}`, mainViolations);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate1ID}`, duplicateViolations);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {});
            await (0, waitForBatchedUpdates_1.default)();
            const resolveParams = {
                transactionID: mainTransactionID,
                transactionIDList: duplicateTransactionIDs,
                created: '2024-01-01 12:00:00',
                merchant: 'Updated Merchant',
                amount: 200,
                currency: CONST_1.default.CURRENCY.EUR,
                category: 'Travel',
                comment: 'Updated comment',
                billable: true,
                reimbursable: false,
                tag: 'UpdatedProject',
                receiptID: 123,
                reportID,
            };
            // When: Call resolveDuplicates without IOU actions
            (0, IOU_1.resolveDuplicates)(resolveParams);
            await (0, waitForBatchedUpdates_1.default)();
            // Then: Verify function completed without errors
            const updatedMainTransaction = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mainTransactionID}`);
            expect(updatedMainTransaction).toMatchObject({
                category: 'Travel',
                modifiedMerchant: 'Updated Merchant',
            });
            // Then: Verify violations were still processed
            const updatedDuplicateViolations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicate1ID}`);
            expect(updatedDuplicateViolations).toEqual(expect.arrayContaining([
                { name: CONST_1.default.VIOLATIONS.HOLD, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
            ]));
            // Then: Verify API was called
            expect(writeSpy).toHaveBeenCalledWith(types_1.WRITE_COMMANDS.RESOLVE_DUPLICATES, expect.objectContaining({}), expect.objectContaining({}));
        });
    });
    describe('getPerDiemExpenseInformation', () => {
        it('should return correct per diem expense information with new chat report', () => {
            // Given: Mock data for per diem expense
            const mockCustomUnit = {
                customUnitID: 'per_diem_123',
                customUnitRateID: 'rate_456',
                name: CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL,
                attributes: {
                    dates: {
                        start: '2024-01-15',
                        end: '2024-01-15',
                    },
                },
                subRates: [
                    {
                        id: 'breakfast_1',
                        name: 'Breakfast',
                        rate: 25,
                        quantity: 1,
                    },
                    {
                        id: 'lunch_1',
                        name: 'Lunch',
                        rate: 35,
                        quantity: 1,
                    },
                ],
                quantity: 1,
            };
            const mockParticipant = {
                accountID: 123,
                login: 'test@example.com',
                displayName: 'Test User',
                isPolicyExpenseChat: false,
                notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                role: CONST_1.default.REPORT.ROLE.MEMBER,
            };
            const mockTransactionParams = {
                currency: 'USD',
                created: '2024-01-15',
                category: 'Travel',
                tag: 'Project A',
                customUnit: mockCustomUnit,
                billable: true,
                attendees: [],
                reimbursable: true,
                comment: 'Business trip per diem',
            };
            const mockParticipantParams = {
                payeeAccountID: 456,
                payeeEmail: 'payee@example.com',
                participant: mockParticipant,
            };
            const mockPolicyParams = {
                policy: (0, policies_1.default)(1),
                policyCategories: (0, policyCategory_1.default)(3),
                policyTagList: (0, policyTags_1.default)('tagList', 2),
            };
            // When: Call getPerDiemExpenseInformation
            const result = (0, IOU_1.getPerDiemExpenseInformation)({
                parentChatReport: {},
                transactionParams: mockTransactionParams,
                participantParams: mockParticipantParams,
                policyParams: mockPolicyParams,
                recentlyUsedParams: {},
                moneyRequestReportID: '1',
            });
            // Then: Verify the result structure and key values
            expect(result).toMatchObject({
                payerAccountID: 123,
                payerEmail: 'test@example.com',
                billable: true,
                reimbursable: true,
            });
            // Verify chat report was created
            expect(result.chatReport).toBeDefined();
            expect(result.chatReport.reportID).toBeDefined();
            // Verify IOU report was created
            expect(result.iouReport).toBeDefined();
            expect(result.iouReport.reportID).toBeDefined();
            expect(result.iouReport.type).toBe(CONST_1.default.REPORT.TYPE.IOU);
            // Verify transaction was created with correct per diem data
            expect(result.transaction).toBeDefined();
            expect(result.transaction.transactionID).toBeDefined();
            expect(result.transaction.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM);
            expect(result.transaction.hasEReceipt).toBe(true);
            expect(result.transaction.currency).toBe('USD');
            expect(result.transaction.category).toBe('Travel');
            expect(result.transaction.tag).toBe('Project A');
            expect(result.transaction.comment?.comment).toBe('Business trip per diem');
            // Verify IOU action was created
            expect(result.iouAction).toBeDefined();
            expect(result.iouAction.reportActionID).toBeDefined();
            expect(result.iouAction.actionName).toBe(CONST_1.default.REPORT.ACTIONS.TYPE.IOU);
            // Verify report preview action
            expect(result.reportPreviewAction).toBeDefined();
            expect(result.reportPreviewAction.reportActionID).toBeDefined();
            // Verify Onyx data structure
            expect(result.onyxData).toBeDefined();
            expect(result.onyxData.optimisticData).toBeDefined();
            expect(result.onyxData.successData).toBeDefined();
            expect(result.onyxData.failureData).toBeDefined();
            // Verify created action IDs for new reports
            expect(result.createdChatReportActionID).toBeDefined();
            expect(result.createdIOUReportActionID).toBeDefined();
        });
        it('should return correct per diem expense information with existing chat report', () => {
            // Given: Existing chat report
            const existingChatReport = {
                reportID: 'chat_123',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                participants: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '123': {
                        accountID: 123,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '456': {
                        accountID: 456,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
                iouReportID: 'iou_456',
                type: CONST_1.default.REPORT.TYPE.CHAT,
            };
            const mockCustomUnit = {
                customUnitID: 'per_diem_789',
                customUnitRateID: 'rate_101',
                name: CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL,
                attributes: {
                    dates: {
                        start: '2024-01-20',
                        end: '2024-01-20',
                    },
                },
                subRates: [
                    {
                        id: 'dinner_1',
                        name: 'Dinner',
                        rate: 45,
                        quantity: 1,
                    },
                ],
                quantity: 2,
            };
            const mockParticipant = {
                accountID: 123,
                login: 'existing@example.com',
                displayName: 'Existing User',
                isPolicyExpenseChat: false,
                notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                role: CONST_1.default.REPORT.ROLE.MEMBER,
            };
            const mockTransactionParams = {
                comment: 'Conference per diem',
                currency: 'USD',
                created: '2024-01-20',
                category: 'Meals',
                tag: 'Conference',
                customUnit: mockCustomUnit,
                billable: false,
                attendees: [],
                reimbursable: true,
            };
            const mockParticipantParams = {
                payeeAccountID: 456,
                payeeEmail: 'payee@example.com',
                participant: mockParticipant,
            };
            // When: Call getPerDiemExpenseInformation with existing chat report
            const result = (0, IOU_1.getPerDiemExpenseInformation)({
                parentChatReport: existingChatReport,
                transactionParams: mockTransactionParams,
                participantParams: mockParticipantParams,
                recentlyUsedParams: {},
            });
            // Then: Verify the result uses existing chat report
            expect(result.chatReport.reportID).toBe('chat_123');
            expect(result.chatReport.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.GROUP);
            // Verify transaction has correct per diem data
            expect(result.transaction.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM);
            expect(result.transaction.hasEReceipt).toBe(true);
            expect(result.transaction.currency).toBe('USD');
            expect(result.transaction.category).toBe('Meals');
            expect(result.transaction.tag).toBe('Conference');
            expect(result.transaction.comment?.comment).toBe('Conference per diem');
            // Verify no new chat report action ID since using existing
            expect(result.createdChatReportActionID).toBeUndefined();
        });
        it('should handle policy expense chat correctly', () => {
            // Given: Policy expense chat participant
            const mockParticipant = {
                accountID: 123,
                login: 'policy@example.com',
                displayName: 'Policy User',
                isPolicyExpenseChat: true,
                reportID: 'policy_chat_123',
                notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                role: CONST_1.default.REPORT.ROLE.MEMBER,
            };
            const mockCustomUnit = {
                customUnitID: 'per_diem_policy',
                customUnitRateID: 'rate_policy',
                name: CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL,
                attributes: {
                    dates: {
                        start: '2024-01-25',
                        end: '2024-01-25',
                    },
                },
                subRates: [
                    {
                        id: 'lodging_1',
                        name: 'Lodging',
                        rate: 150,
                        quantity: 1,
                    },
                ],
                quantity: 1,
            };
            const mockTransactionParams = {
                comment: 'Policy per diem',
                currency: 'USD',
                created: '2024-01-25',
                category: 'Lodging',
                tag: 'Policy',
                customUnit: mockCustomUnit,
                billable: true,
                attendees: [],
                reimbursable: true,
            };
            const mockParticipantParams = {
                payeeAccountID: 456,
                payeeEmail: 'payee@example.com',
                participant: mockParticipant,
            };
            const mockPolicyParams = {
                policy: (0, policies_1.default)(2),
            };
            // When: Call getPerDiemExpenseInformation for policy expense chat
            const result = (0, IOU_1.getPerDiemExpenseInformation)({
                parentChatReport: {},
                transactionParams: mockTransactionParams,
                participantParams: mockParticipantParams,
                policyParams: mockPolicyParams,
                recentlyUsedParams: {},
            });
            // Then: Verify policy expense chat handling
            expect(result.payerAccountID).toBe(123);
            expect(result.payerEmail).toBe('policy@example.com');
            expect(result.transaction.iouRequestType).toBe(CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM);
            expect(result.transaction.hasEReceipt).toBe(true);
            expect(result.billable).toBe(true);
            expect(result.reimbursable).toBe(true);
        });
    });
    describe('getSendInvoiceInformation', () => {
        it('should return correct invoice information with new chat report', () => {
            // Given: Mock transaction data
            const mockTransaction = {
                transactionID: 'transaction_123',
                reportID: 'report_123',
                amount: 500,
                currency: 'USD',
                created: '2024-01-15',
                merchant: 'Test Company',
                category: 'Services',
                tag: 'Project B',
                taxCode: 'TAX001',
                taxAmount: 50,
                billable: true,
                comment: {
                    comment: 'Invoice for consulting services',
                },
                participants: [
                    {
                        accountID: 123,
                        isSender: true,
                        policyID: 'workspace_123',
                    },
                    {
                        accountID: 456,
                        isSender: false,
                    },
                ],
            };
            const currentUserAccountID = 123;
            const mockPolicy = (0, policies_1.default)(1);
            const mockPolicyCategories = {
                Services: {
                    name: 'Services',
                    enabled: true,
                },
            };
            const mockPolicyTagList = {
                tagList: {
                    name: 'tagList',
                    orderWeight: 0,
                    required: false,
                    tags: {
                        projectB: {
                            name: 'Project B',
                            enabled: true,
                        },
                    },
                },
            };
            // When: Call getSendInvoiceInformation
            const result = (0, IOU_1.getSendInvoiceInformation)(mockTransaction, currentUserAccountID, undefined, // invoiceChatReport
            undefined, // receipt
            mockPolicy, mockPolicyTagList, mockPolicyCategories, 'Test Company Inc.', 'https://testcompany.com', ['Services', 'Consulting']);
            // Then: Verify the result structure and key values
            expect(result).toMatchObject({
                senderWorkspaceID: 'workspace_123',
                invoiceReportID: expect.any(String),
                transactionID: expect.any(String),
                transactionThreadReportID: expect.any(String),
                createdIOUReportActionID: expect.any(String),
                reportActionID: expect.any(String),
                createdChatReportActionID: expect.any(String),
                reportPreviewReportActionID: expect.any(String),
            });
            // Verify receiver information
            expect(result.receiver).toBeDefined();
            expect(result.receiver.accountID).toBe(123);
            // Verify invoice room (chat report)
            expect(result.invoiceRoom).toBeDefined();
            expect(result.invoiceRoom.reportID).toBeDefined();
            expect(result.invoiceRoom.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.INVOICE);
            // Verify Onyx data structure
            expect(result.onyxData).toBeDefined();
            expect(result.onyxData.optimisticData).toBeDefined();
            expect(result.onyxData.successData).toBeDefined();
            expect(result.onyxData.failureData).toBeDefined();
        });
        it('should return correct invoice information with existing chat report', () => {
            // Given: Existing invoice chat report
            const existingInvoiceChatReport = {
                reportID: 'invoice_chat_123',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '123': {
                        accountID: 123,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '456': {
                        accountID: 456,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
                invoiceReceiver: {
                    type: 'individual',
                    accountID: 456,
                    displayName: 'Client Company',
                    login: 'client@example.com',
                },
            };
            const mockTransaction = {
                transactionID: 'transaction_456',
                reportID: 'report_456',
                amount: 750,
                currency: 'EUR',
                created: '2024-01-20',
                merchant: 'Client Company',
                category: 'Development',
                tag: 'Project C',
                taxCode: 'TAX002',
                taxAmount: 75,
                billable: true,
                comment: {
                    comment: 'Invoice for development work',
                },
                participants: [
                    {
                        accountID: 123,
                        isSender: true,
                        policyID: 'workspace_456',
                    },
                    {
                        accountID: 456,
                        isSender: false,
                    },
                ],
            };
            const currentUserAccountID = 123;
            // When: Call getSendInvoiceInformation with existing chat report
            const result = (0, IOU_1.getSendInvoiceInformation)(mockTransaction, currentUserAccountID, existingInvoiceChatReport, undefined, // receipt
            undefined, // policy
            undefined, // policyTagList
            undefined, // policyCategories
            'Client Company Ltd.', 'https://clientcompany.com');
            // Then: Verify the result uses existing chat report
            expect(result.invoiceRoom.reportID).toBe('invoice_chat_123');
            expect(result.invoiceRoom.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.INVOICE);
            // Verify transaction data
            expect(result.transactionID).toBeDefined();
            expect(result.senderWorkspaceID).toBe('workspace_456');
        });
        it('should handle receipt attachment correctly', () => {
            // Given: Transaction with receipt
            const mockTransaction = {
                transactionID: 'transaction_789',
                reportID: 'report_789',
                amount: 300,
                currency: 'USD',
                created: '2024-01-25',
                merchant: 'Receipt Company',
                category: 'Equipment',
                tag: 'Hardware',
                taxCode: 'TAX003',
                taxAmount: 30,
                billable: true,
                comment: {
                    comment: 'Invoice with receipt',
                },
                participants: [
                    {
                        accountID: 123,
                        isSender: true,
                        policyID: 'workspace_789',
                    },
                    {
                        accountID: 456,
                        isSender: false,
                    },
                ],
            };
            const mockReceipt = {
                source: 'receipt_source_123',
                name: 'receipt.pdf',
                state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY,
            };
            const currentUserAccountID = 123;
            // When: Call getSendInvoiceInformation with receipt
            const result = (0, IOU_1.getSendInvoiceInformation)(mockTransaction, currentUserAccountID, undefined, // invoiceChatReport
            mockReceipt, undefined, // policy
            undefined, // policyTagList
            undefined);
            // Then: Verify receipt handling
            expect(result.transactionID).toBeDefined();
            expect(result.invoiceRoom).toBeDefined();
            expect(result.invoiceRoom.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.INVOICE);
            // Verify Onyx data includes receipt information
            expect(result.onyxData).toBeDefined();
            expect(result.onyxData.optimisticData).toBeDefined();
        });
        it('should handle missing transaction data gracefully', () => {
            // Given: Minimal transaction data
            const mockTransaction = {
                transactionID: 'transaction_minimal',
                reportID: 'report_minimal',
                amount: 100,
                currency: 'USD',
                created: '2024-01-30',
                merchant: 'Minimal Company',
                participants: [
                    {
                        accountID: 123,
                        isSender: true,
                    },
                    {
                        accountID: 456,
                        isSender: false,
                    },
                ],
            };
            const currentUserAccountID = 123;
            // When: Call getSendInvoiceInformation with minimal data
            const result = (0, IOU_1.getSendInvoiceInformation)(mockTransaction, currentUserAccountID);
            // Then: Verify function handles missing data gracefully
            expect(result).toBeDefined();
            expect(result.transactionID).toBeDefined();
            expect(result.invoiceRoom).toBeDefined();
            expect(result.invoiceRoom.chatType).toBe(CONST_1.default.REPORT.CHAT_TYPE.INVOICE);
            expect(result.receiver).toBeDefined();
            expect(result.onyxData).toBeDefined();
        });
    });
    describe('rejectMoneyRequest', () => {
        const amount = 10000;
        const comment = 'This expense is rejected';
        let chatReport;
        let iouReport;
        let transaction;
        let policy;
        const TEST_USER_ACCOUNT_ID = 1;
        const MANAGER_ACCOUNT_ID = 2;
        const ADMIN_ACCOUNT_ID = 3;
        beforeEach(async () => {
            // Set up test data
            policy = (0, policies_1.default)(1);
            policy.role = CONST_1.default.POLICY.ROLE.ADMIN;
            policy.autoReporting = true;
            policy.autoReportingFrequency = CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY;
            chatReport = {
                ...(0, reports_1.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                policyID: policy?.id,
                type: CONST_1.default.REPORT.TYPE.CHAT,
            };
            iouReport = {
                ...(0, reports_1.createRandomReport)(2),
                type: CONST_1.default.REPORT.TYPE.IOU,
                ownerAccountID: TEST_USER_ACCOUNT_ID,
                managerID: MANAGER_ACCOUNT_ID,
                total: amount,
                currency: CONST_1.default.CURRENCY.USD,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                policyID: policy?.id,
                chatReportID: chatReport?.reportID,
            };
            transaction = {
                ...(0, transaction_1.default)(1),
                reportID: iouReport?.reportID,
                amount,
                currency: CONST_1.default.CURRENCY.USD,
                merchant: 'Test Merchant',
                transactionID: '1',
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy?.id}`, policy);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`, chatReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`, iouReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction?.transactionID}`, transaction);
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { accountID: ADMIN_ACCOUNT_ID });
            await (0, waitForBatchedUpdates_1.default)();
        });
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            jest.clearAllMocks();
        });
        it('should reject a money request and return navigation route', async () => {
            // Given: An expense report (not IOU) for testing state update
            const expenseReport = { ...iouReport, type: CONST_1.default.REPORT.TYPE.EXPENSE };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`, expenseReport);
            await (0, waitForBatchedUpdates_1.default)();
            // When: Reject the money request
            if (!transaction?.transactionID || !iouReport?.reportID) {
                throw new Error('Required transaction or report data is missing');
            }
            const result = (0, IOU_1.rejectMoneyRequest)(transaction.transactionID, iouReport.reportID, comment);
            // Then: Should return navigation route to chat report
            expect(result).toBe(ROUTES_1.default.REPORT_WITH_ID.getRoute(iouReport.reportID));
        });
        it('should add AUTO_REPORTED_REJECTED_EXPENSE violation for expense reports', async () => {
            // Given: An expense report (not IOU)
            const expenseReport = { ...iouReport, type: CONST_1.default.REPORT.TYPE.EXPENSE };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`, expenseReport);
            await (0, waitForBatchedUpdates_1.default)();
            // When: Reject the money request
            if (!transaction?.transactionID || !iouReport?.reportID) {
                throw new Error('Required transaction or report data is missing');
            }
            (0, IOU_1.rejectMoneyRequest)(transaction.transactionID, iouReport.reportID, comment);
            await (0, waitForBatchedUpdates_1.default)();
            // Then: Verify violation is added
            const violations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction?.transactionID}`);
            expect(violations).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                    type: CONST_1.default.VIOLATION_TYPES.WARNING,
                    data: expect.objectContaining({
                        comment,
                    }),
                }),
            ]));
        });
    });
    describe('markRejectViolationAsResolved', () => {
        let transaction;
        let iouReport;
        beforeEach(async () => {
            transaction = (0, transaction_1.default)(1);
            iouReport = (0, reports_1.createRandomReport)(1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction?.transactionID}`, transaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`, iouReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction?.transactionID}`, [
                {
                    name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                    type: CONST_1.default.VIOLATION_TYPES.WARNING,
                    data: { comment: 'Test reject reason' },
                },
            ]);
            await (0, waitForBatchedUpdates_1.default)();
        });
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            jest.clearAllMocks();
        });
        it('should remove AUTO_REPORTED_REJECTED_EXPENSE violation', async () => {
            // When: Mark violation as resolved
            if (!transaction?.transactionID || !iouReport?.reportID) {
                throw new Error('Required transaction or report data is missing');
            }
            (0, IOU_1.markRejectViolationAsResolved)(transaction.transactionID, iouReport.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            // Then: Verify violation is removed
            const violations = await (0, getOnyxValue_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction?.transactionID}`);
            expect(violations).not.toEqual(expect.arrayContaining([
                expect.objectContaining({
                    name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                }),
            ]));
        });
    });
});
