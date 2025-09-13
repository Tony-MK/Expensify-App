"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reports_1 = require("../../__mocks__/reportData/reports");
const createCollection_1 = require("../utils/collections/createCollection");
const personalDetails_1 = require("../utils/collections/personalDetails");
const policies_1 = require("../utils/collections/policies");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_2 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const getMockedReports = (length = 500) => (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, (index) => (0, reports_2.createRandomReport)(index), length);
const getMockedPolicies = (length = 500) => (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.POLICY}${item.id}`, (index) => (0, policies_1.default)(index), length);
const personalDetails = (0, createCollection_1.default)((item) => item.accountID, (index) => (0, personalDetails_1.default)(index), 1000);
const mockedReportsMap = getMockedReports(1000);
const mockedPoliciesMap = getMockedPolicies(1000);
const participantAccountIDs = Array.from({ length: 1000 }, (v, i) => i + 1);
describe('ReportUtils', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
    });
    beforeEach(async () => {
        await react_native_onyx_1.default.multiSet({
            ...mockedPoliciesMap,
            ...mockedReportsMap,
        });
    });
    afterAll(() => {
        react_native_onyx_1.default.clear();
    });
    test('[ReportUtils] findLastAccessedReport on 2k reports and policies', async () => {
        const ignoreDomainRooms = true;
        const reports = getMockedReports(2000);
        const policies = getMockedPolicies(2000);
        const openOnAdminRoom = true;
        await react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.COLLECTION.REPORT]: reports,
            [ONYXKEYS_1.default.COLLECTION.POLICY]: policies,
        });
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.findLastAccessedReport)(ignoreDomainRooms, openOnAdminRoom));
    });
    test('[ReportUtils] canDeleteReportAction on 1k reports and policies', async () => {
        const reportID = '1';
        const transaction = (0, transaction_1.default)(1);
        const reportAction = { ...(0, reportActions_1.default)(1), actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT };
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.canDeleteReportAction)(reportAction, reportID, transaction));
    });
    test('[ReportUtils] getReportRecipientAccountID on 1k participants', async () => {
        const report = { ...(0, reports_2.createRandomReport)(1), participantAccountIDs };
        const currentLoginAccountID = 1;
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getReportRecipientAccountIDs)(report, currentLoginAccountID));
    });
    test('[ReportUtils] getIconsForParticipants on 1k participants', async () => {
        const participants = Array.from({ length: 1000 }, (v, i) => i + 1);
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getIconsForParticipants)(participants, personalDetails));
    });
    test('[ReportUtils] getIcons on 1k participants', async () => {
        const report = { ...(0, reports_2.createRandomReport)(1), parentReportID: '1', parentReportActionID: '1', type: CONST_1.default.REPORT.TYPE.CHAT };
        const policy = (0, policies_1.default)(1);
        const defaultIcon = null;
        const defaultName = '';
        const defaultIconId = -1;
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getIcons)(report, personalDetails, defaultIcon, defaultName, defaultIconId, policy));
    });
    test('[ReportUtils] getDisplayNamesWithTooltips 1k participants', async () => {
        const isMultipleParticipantReport = true;
        const shouldFallbackToHidden = true;
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getDisplayNamesWithTooltips)(personalDetails, isMultipleParticipantReport, TestHelper_1.localeCompare, shouldFallbackToHidden));
    });
    test('[ReportUtils] getReportPreviewMessage on 1k policies', async () => {
        const reportAction = (0, reportActions_1.default)(1);
        const report = (0, reports_2.createRandomReport)(1);
        const policy = (0, policies_1.default)(1);
        const shouldConsiderReceiptBeingScanned = true;
        const isPreviewMessageForParentChatReport = true;
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getReportPreviewMessage)(report, reportAction, shouldConsiderReceiptBeingScanned, isPreviewMessageForParentChatReport, policy));
    });
    test('[ReportUtils] getReportName on 1k participants', async () => {
        const report = { ...(0, reports_2.createRandomReport)(1), chatType: undefined, participantAccountIDs };
        const policy = (0, policies_1.default)(1);
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getReportName)(report, policy));
    });
    test('[ReportUtils] canShowReportRecipientLocalTime on 1k participants', async () => {
        const report = { ...(0, reports_2.createRandomReport)(1), participantAccountIDs };
        const accountID = 1;
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.canShowReportRecipientLocalTime)(personalDetails, report, accountID));
    });
    test('[ReportUtils] shouldReportBeInOptionList on 1k participant', async () => {
        const report = { ...(0, reports_2.createRandomReport)(1), participantAccountIDs, type: CONST_1.default.REPORT.TYPE.CHAT };
        const currentReportId = '2';
        const isInFocusMode = true;
        const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.shouldReportBeInOptionList)({ report, chatReport: reports_1.chatReportR14932, currentReportId, isInFocusMode, betas, doesReportHaveViolations: false, excludeEmptyChats: false }));
    });
    test('[ReportUtils] getWorkspaceIcon on 1k policies', async () => {
        const report = (0, reports_2.createRandomReport)(1);
        const policy = (0, policies_1.default)(1);
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getWorkspaceIcon)(report, policy));
    });
    test('[ReportUtils] getMoneyRequestOptions on 1k participants', async () => {
        const report = { ...(0, reports_2.createRandomReport)(1), type: CONST_1.default.REPORT.TYPE.CHAT, chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, isOwnPolicyExpenseChat: true };
        const policy = (0, policies_1.default)(1);
        const reportParticipants = Array.from({ length: 1000 }, (v, i) => i + 1);
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, policy, reportParticipants));
    });
    test('[ReportUtils] getWorkspaceChat on 1k policies', async () => {
        const policyID = '1';
        const accountsID = Array.from({ length: 20 }, (v, i) => i + 1);
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getWorkspaceChats)(policyID, accountsID));
    });
    test('[ReportUtils] getTransactionDetails on 1k reports', async () => {
        const transaction = (0, transaction_1.default)(1);
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getTransactionDetails)(transaction, 'yyyy-MM-dd'));
    });
    test('[ReportUtils] getIOUReportActionDisplayMessage on 1k policies', async () => {
        const reportAction = {
            ...(0, reportActions_1.default)(1),
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            originalMessage: {
                IOUReportID: '1',
                IOUTransactionID: '1',
                amount: 100,
                participantAccountID: 1,
                currency: CONST_1.default.CURRENCY.USD,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
                paymentType: CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY,
            },
        };
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, ReportUtils_1.getIOUReportActionDisplayMessage)(reportAction));
    });
});
