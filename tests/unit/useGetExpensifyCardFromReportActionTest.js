"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const CONST_1 = require("@src/CONST");
const useGetExpensifyCardFromReportAction_1 = require("@src/hooks/useGetExpensifyCardFromReportAction");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
// Mock the dependencies
jest.mock('@libs/PolicyUtils');
jest.mock('@libs/ReportActionsUtils');
jest.mock('@components/OnyxListItemProvider', () => ({
    useCardList: jest.fn(),
    useWorkspaceCardList: jest.fn(),
}));
// This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
// eslint-disable-next-line deprecation/deprecation
const mockGetPolicy = PolicyUtils_1.getPolicy;
const mockGetWorkspaceAccountID = PolicyUtils_1.getWorkspaceAccountID;
const mockIsPolicyAdmin = PolicyUtils_1.isPolicyAdmin;
const mockGetOriginalMessage = ReportActionsUtils_1.getOriginalMessage;
const mockIsCardIssuedAction = ReportActionsUtils_1.isCardIssuedAction;
const mockUseCardList = OnyxListItemProvider_1.useCardList;
const mockUseWorkspaceCardList = OnyxListItemProvider_1.useWorkspaceCardList;
describe('useGetExpensifyCardFromReportAction', () => {
    const mockCard = {
        cardID: 123,
        cardName: 'Test Card',
        cardNumber: '1234567890123456',
        domainName: 'test.com',
        lastUpdated: '2023-01-01T00:00:00.000Z',
        fraud: CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.NONE,
        state: CONST_1.default.EXPENSIFY_CARD.STATE.OPEN,
        bank: 'Test Bank',
    };
    const createMockReportAction = (cardID = 123) => ({
        reportActionID: '1',
        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_ADD_PAYMENT_CARD,
        originalMessage: { cardID, assigneeAccountID: 1 },
        created: '2023-01-01T00:00:00.000Z',
        actorAccountID: 1,
        person: [],
        shouldShow: true,
        isAttachmentOnly: false,
        isFirstItem: false,
        pendingAction: null,
        errors: undefined,
        message: [],
        reportID: '1',
    });
    const mockPolicy = {
        id: 'policy123',
        name: 'Test Policy',
        role: CONST_1.default.POLICY.ROLE.USER,
        type: CONST_1.default.POLICY.TYPE.CORPORATE,
        isAttendeeTrackingEnabled: false,
        owner: '1',
        outputCurrency: 'USD',
        isPolicyExpenseChatEnabled: false,
        workspaceAccountID: 123,
    };
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        await react_native_onyx_1.default.clear();
        jest.clearAllMocks();
        mockGetPolicy.mockReturnValue(mockPolicy);
        mockGetWorkspaceAccountID.mockReturnValue(123);
        mockIsPolicyAdmin.mockReturnValue(false);
        mockGetOriginalMessage.mockReturnValue({ cardID: 123, assigneeAccountID: 1 });
        mockIsCardIssuedAction.mockReturnValue(true);
        mockUseCardList.mockReturnValue({});
        mockUseWorkspaceCardList.mockReturnValue({});
    });
    describe('when reportAction is not a card issued action', () => {
        it('returns undefined', async () => {
            mockIsCardIssuedAction.mockReturnValue(false);
            const { result } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current).toBeUndefined();
        });
    });
    describe('when reportAction is a card issued action', () => {
        beforeEach(() => {
            mockIsCardIssuedAction.mockReturnValue(true);
            mockGetOriginalMessage.mockReturnValue({ cardID: 123, assigneeAccountID: 1 });
        });
        describe('when user is not a policy admin', () => {
            beforeEach(() => {
                mockIsPolicyAdmin.mockReturnValue(false);
            });
            it('returns card from allUserCards when card exists', async () => {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                mockUseCardList.mockReturnValue({ '123': mockCard });
                const { result } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
                await (0, waitForBatchedUpdatesWithAct_1.default)();
                expect(result.current).toEqual(mockCard);
            });
            it('returns undefined when card does not exist in allUserCards', async () => {
                mockUseCardList.mockReturnValue({});
                const { result } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
                await (0, waitForBatchedUpdatesWithAct_1.default)();
                expect(result.current).toBeUndefined();
            });
        });
        describe('when user is a policy admin', () => {
            beforeEach(() => {
                mockIsPolicyAdmin.mockReturnValue(true);
                mockGetWorkspaceAccountID.mockReturnValue(123);
                // Override the default policy for admin tests
                mockGetPolicy.mockReturnValue({
                    id: 'policy123',
                    name: 'Test Policy',
                    role: CONST_1.default.POLICY.ROLE.ADMIN,
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                    isAttendeeTrackingEnabled: false,
                    owner: '1',
                    outputCurrency: 'USD',
                    isPolicyExpenseChatEnabled: false,
                    workspaceAccountID: 123,
                });
            });
            it('returns card from allExpensifyCards when card exists', async () => {
                const workspaceCardsKey = `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}123_${CONST_1.default.EXPENSIFY_CARD.BANK}`;
                // eslint-disable-next-line @typescript-eslint/naming-convention
                mockUseWorkspaceCardList.mockReturnValue({ [workspaceCardsKey]: { 123: mockCard } });
                const { result } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
                await (0, waitForBatchedUpdatesWithAct_1.default)();
                expect(result.current).toEqual(mockCard);
            });
            it('returns undefined when card does not exist in allExpensifyCards', async () => {
                const workspaceCardsKey = `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}123_${CONST_1.default.EXPENSIFY_CARD.BANK}`;
                // eslint-disable-next-line @typescript-eslint/naming-convention
                mockUseWorkspaceCardList.mockReturnValue({ [workspaceCardsKey]: {} });
                const { result } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
                await (0, waitForBatchedUpdatesWithAct_1.default)();
                expect(result.current).toBeUndefined();
            });
        });
    });
    describe('reactivity to Onyx changes', () => {
        it('updates when allUserCards changes', async () => {
            mockUseCardList.mockReturnValue({});
            mockUseWorkspaceCardList.mockReturnValue({});
            const { result } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current).toBeUndefined();
            // eslint-disable-next-line @typescript-eslint/naming-convention
            mockUseCardList.mockReturnValue({ '123': mockCard });
            // Re-render the hook to get the updated result
            const { result: updatedResult } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(updatedResult.current).toEqual(mockCard);
        });
        it('updates when allExpensifyCards changes for policy admin', async () => {
            mockIsPolicyAdmin.mockReturnValue(true);
            mockGetPolicy.mockReturnValue({
                id: 'policy123',
                name: 'Test Policy',
                role: CONST_1.default.POLICY.ROLE.ADMIN,
                type: CONST_1.default.POLICY.TYPE.CORPORATE,
                isAttendeeTrackingEnabled: false,
                owner: '1',
                outputCurrency: 'USD',
                isPolicyExpenseChatEnabled: false,
                workspaceAccountID: 123,
            });
            // Set initial state
            mockUseCardList.mockReturnValue({});
            mockUseWorkspaceCardList.mockReturnValue({});
            const { result } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(result.current).toBeUndefined();
            const workspaceCardsKey = `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}123_${CONST_1.default.EXPENSIFY_CARD.BANK}`;
            // eslint-disable-next-line @typescript-eslint/naming-convention
            mockUseWorkspaceCardList.mockReturnValue({ [workspaceCardsKey]: { 123: mockCard } });
            const { result: updatedResult } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(updatedResult.current).toEqual(mockCard);
        });
    });
    describe('workspace account ID generation', () => {
        it('calls getWorkspaceAccountID with correct policyID', async () => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            mockUseCardList.mockReturnValue({ '123': mockCard });
            const { result } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'test-policy-123' }));
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(mockGetWorkspaceAccountID).toHaveBeenCalledWith('test-policy-123');
            expect(result.current).toEqual(mockCard);
        });
    });
    describe('policy admin check', () => {
        it('calls isPolicyAdmin with correct policy', async () => {
            const testPolicy = {
                id: 'policy123',
                name: 'Test Policy',
                role: CONST_1.default.POLICY.ROLE.ADMIN,
                type: CONST_1.default.POLICY.TYPE.CORPORATE,
                isAttendeeTrackingEnabled: false,
                owner: '1',
                outputCurrency: 'USD',
                isPolicyExpenseChatEnabled: false,
                workspaceAccountID: 123,
            };
            mockGetPolicy.mockReturnValue(testPolicy);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            mockUseCardList.mockReturnValue({ '123': mockCard });
            const { result } = (0, react_native_1.renderHook)(() => (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: createMockReportAction(), policyID: 'policy123' }));
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(mockGetPolicy).toHaveBeenCalledWith('policy123');
            expect(mockIsPolicyAdmin).toHaveBeenCalledWith(testPolicy);
            expect(result.current).toEqual(mockCard);
        });
    });
});
