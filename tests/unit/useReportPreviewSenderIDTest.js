"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useReportPreviewSenderID_1 = require("@components/ReportActionAvatars/useReportPreviewSenderID");
const OnyxDerived_1 = require("@libs/actions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const PersonalDetailsUtils = require("@src/libs/PersonalDetailsUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
const actions_1 = require("../../__mocks__/reportData/actions");
const personalDetails_1 = require("../../__mocks__/reportData/personalDetails");
const reports_1 = require("../../__mocks__/reportData/reports");
const transactions_1 = require("../../__mocks__/reportData/transactions");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const reportActions = [{ [actions_1.actionR14932.reportActionID]: actions_1.actionR14932 }];
const transactions = [transactions_1.transactionR14932];
const transactionCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, transactions, (transaction) => transaction.transactionID);
const reportActionCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, reportActions, (actions) => Object.values(actions).at(0)?.childReportID);
const validAction = {
    ...actions_1.actionR98765,
    childReportID: reports_1.iouReportR14932.reportID,
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
    childOwnerAccountID: reports_1.iouReportR14932.ownerAccountID,
    childManagerAccountID: reports_1.iouReportR14932.managerID,
};
describe('useReportPreviewSenderID', () => {
    const mockedDMChatRoom = { ...reports_1.chatReportR14932, chatType: undefined };
    const mockedEmailToID = {
        [personalDetails_1.default[15593135].login]: 15593135,
        [personalDetails_1.default[51760358].login]: 51760358,
    };
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        (0, OnyxDerived_1.default)();
        jest.spyOn(PersonalDetailsUtils, 'getPersonalDetailByEmail').mockImplementation((email) => personalDetails_1.default[mockedEmailToID[email]]);
    });
    beforeEach(() => {
        react_native_onyx_1.default.multiSet({
            ...reportActionCollectionDataSet,
            ...transactionCollectionDataSet,
        });
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterEach(() => {
        react_native_onyx_1.default.clear();
        return (0, waitForBatchedUpdates_1.default)();
    });
    it('returns avatar with no reportPreviewSenderID when action is not a report preview', async () => {
        const { result } = (0, react_native_1.renderHook)(() => (0, useReportPreviewSenderID_1.default)({
            action: actions_1.actionR14932,
            iouReport: reports_1.iouReportR14932,
            chatReport: mockedDMChatRoom,
        }), { wrapper: OnyxListItemProvider_1.default });
        await (0, waitForBatchedUpdates_1.default)();
        expect(result.current).toBeUndefined();
    });
    it('returns childManagerAccountID and his avatar when all conditions are met for Send Money flow', async () => {
        const { result } = (0, react_native_1.renderHook)(() => (0, useReportPreviewSenderID_1.default)({
            action: { ...validAction, childMoneyRequestCount: 0 },
            iouReport: reports_1.iouReportR14932,
            chatReport: mockedDMChatRoom,
        }), { wrapper: OnyxListItemProvider_1.default });
        await (0, waitForBatchedUpdates_1.default)();
        expect(result.current).toBe(reports_1.iouReportR14932.managerID);
    });
    it('returns both avatars & no reportPreviewSenderID when there are multiple attendees', async () => {
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactions_1.transactionR14932.transactionID}`, {
            ...transactions_1.transactionR14932,
            comment: {
                attendees: [{ email: personalDetails_1.default[15593135].login, displayName: 'Test One', avatarUrl: 'https://none.com/none' }],
            },
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactions_1.transactionR14932.transactionID}2`, {
            ...transactions_1.transactionR14932,
            comment: {
                attendees: [{ email: personalDetails_1.default[51760358].login, displayName: 'Test Two', avatarUrl: 'https://none.com/none2' }],
            },
        });
        const { result } = (0, react_native_1.renderHook)(() => (0, useReportPreviewSenderID_1.default)({
            action: validAction,
            iouReport: reports_1.iouReportR14932,
            chatReport: mockedDMChatRoom,
        }), { wrapper: OnyxListItemProvider_1.default });
        await (0, waitForBatchedUpdates_1.default)();
        expect(result.current).toBeUndefined();
    });
    it('returns both avatars & no reportPreviewSenderID when amounts have different signs', async () => {
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactions_1.transactionR14932.transactionID}`, {
            ...transactions_1.transactionR14932,
            amount: 100,
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactions_1.transactionR14932.transactionID}2`, {
            ...transactions_1.transactionR14932,
            amount: -100,
        });
        const { result } = (0, react_native_1.renderHook)(() => (0, useReportPreviewSenderID_1.default)({
            action: validAction,
            iouReport: reports_1.iouReportR14932,
            chatReport: mockedDMChatRoom,
        }), { wrapper: OnyxListItemProvider_1.default });
        await (0, waitForBatchedUpdates_1.default)();
        expect(result.current).toBeUndefined();
    });
    it('returns childOwnerAccountID as reportPreviewSenderID and a single avatar when all conditions are met', async () => {
        const { result } = (0, react_native_1.renderHook)(() => (0, useReportPreviewSenderID_1.default)({
            action: validAction,
            iouReport: reports_1.iouReportR14932,
            chatReport: mockedDMChatRoom,
        }), { wrapper: OnyxListItemProvider_1.default });
        await (0, waitForBatchedUpdates_1.default)();
        expect(result.current).toBe(reports_1.iouReportR14932.ownerAccountID);
    });
});
