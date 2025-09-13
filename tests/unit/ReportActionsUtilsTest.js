"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const ReportUtils_1 = require("@libs/ReportUtils");
const IntlStore_1 = require("@src/languages/IntlStore");
const actions_1 = require("../../__mocks__/reportData/actions");
const reports_1 = require("../../__mocks__/reportData/reports");
const CONST_1 = require("../../src/CONST");
const ReportActionsUtils = require("../../src/libs/ReportActionsUtils");
const ReportActionsUtils_1 = require("../../src/libs/ReportActionsUtils");
const ONYXKEYS_1 = require("../../src/ONYXKEYS");
const reports_2 = require("../utils/collections/reports");
const LHNTestUtils = require("../utils/LHNTestUtils");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
describe('ReportActionsUtils', () => {
    beforeAll(() => react_native_onyx_1.default.init({
        keys: ONYXKEYS_1.default,
        evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
    }));
    beforeEach(() => {
        // Wrap Onyx each onyx action with waitForBatchedUpdates
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        IntlStore_1.default.load(CONST_1.default.LOCALES.DEFAULT);
        // Initialize the network key for OfflineWithFeedback
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        return (0, waitForBatchedUpdates_1.default)();
    });
    // Clear out Onyx after each test so that each test starts with a clean slate
    afterEach(() => {
        react_native_onyx_1.default.clear();
    });
    describe('getSortedReportActions', () => {
        const cases = [
            [
                [
                    // This is the highest created timestamp, so should appear last
                    {
                        created: '2022-11-09 22:27:01.825',
                        reportActionID: '8401445780099176',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:27:01.600',
                        reportActionID: '6401435781022176',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    // These reportActions were created in the same millisecond so should appear ordered by reportActionID
                    {
                        created: '2022-11-09 22:26:48.789',
                        reportActionID: '2962390724708756',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:26:48.789',
                        reportActionID: '1609646094152486',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:26:48.789',
                        reportActionID: '1661970171066218',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                ],
                [
                    {
                        created: '2022-11-09 22:26:48.789',
                        reportActionID: '1609646094152486',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:26:48.789',
                        reportActionID: '1661970171066218',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:26:48.789',
                        reportActionID: '2962390724708756',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:27:01.600',
                        reportActionID: '6401435781022176',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:27:01.825',
                        reportActionID: '8401445780099176',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                ],
            ],
            [
                [
                    // Given three reportActions with the same timestamp
                    {
                        created: '2023-01-10 22:25:47.132',
                        reportActionID: '3',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2023-01-10 22:25:47.132',
                        reportActionID: '2',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2023-01-10 22:25:47.132',
                        reportActionID: '1',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                ],
                [
                    // The CREATED action should appear first, then we should sort by reportActionID
                    {
                        created: '2023-01-10 22:25:47.132',
                        reportActionID: '2',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2023-01-10 22:25:47.132',
                        reportActionID: '1',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2023-01-10 22:25:47.132',
                        reportActionID: '3',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                ],
            ],
            [
                [
                    {
                        created: '2022-11-09 22:27:01.825',
                        reportActionID: '8401445780099176',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:27:01.600',
                        reportActionID: '6401435781022176',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    // this item has no created field, so it should appear right after CONST.REPORT.ACTIONS.TYPE.CREATED
                    {
                        reportActionID: '2962390724708756',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:26:48.889',
                        reportActionID: '1609646094152486',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:26:48.989',
                        reportActionID: '1661970171066218',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                ],
                [
                    {
                        created: '2022-11-09 22:27:01.600',
                        reportActionID: '6401435781022176',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        reportActionID: '2962390724708756',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:26:48.889',
                        reportActionID: '1609646094152486',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:26:48.989',
                        reportActionID: '1661970171066218',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                    {
                        created: '2022-11-09 22:27:01.825',
                        reportActionID: '8401445780099176',
                        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                        originalMessage: {
                            html: 'Hello world',
                            whisperedTo: [],
                        },
                    },
                ],
            ],
        ];
        test.each(cases)('sorts by created, then actionName, then reportActionID', (input, expectedOutput) => {
            const result = ReportActionsUtils.getSortedReportActions(input);
            expect(result).toStrictEqual(expectedOutput);
        });
        test.each(cases)('in descending order', (input, expectedOutput) => {
            const result = ReportActionsUtils.getSortedReportActions(input, true);
            expect(result).toStrictEqual(expectedOutput.reverse());
        });
    });
    describe('isIOUActionMatchingTransactionList', () => {
        const nonIOUAction = {
            created: '2022-11-13 22:27:01.825',
            reportActionID: '8401445780099176',
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            originalMessage: {
                html: 'Hello world',
                whisperedTo: [],
            },
            message: [
                {
                    html: 'Hello world',
                    type: 'Action type',
                    text: 'Action text',
                },
            ],
        };
        it('returns false for non-money request actions when defaultToFalseForNonIOU is true', () => {
            expect((0, ReportActionsUtils_1.isIOUActionMatchingTransactionList)(nonIOUAction, undefined, true)).toBeFalsy();
        });
        it('returns true for non-money request actions when defaultToFalseForNonIOU is false', () => {
            expect((0, ReportActionsUtils_1.isIOUActionMatchingTransactionList)(nonIOUAction, undefined, false)).toBeTruthy();
        });
        it('returns true if no reportTransactionIDs are provided', () => {
            expect((0, ReportActionsUtils_1.isIOUActionMatchingTransactionList)(actions_1.actionR14932)).toBeTruthy();
        });
        it('returns true if action is of excluded type', () => {
            const action = {
                ...actions_1.actionR14932,
                originalMessage: {
                    ...actions_1.originalMessageR14932,
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK,
                },
            };
            expect((0, ReportActionsUtils_1.isIOUActionMatchingTransactionList)(action, ['124', '125', '126'])).toBeTruthy();
        });
        it('returns true if IOUTransactionID matches any provided reportTransactionIDs', () => {
            expect((0, ReportActionsUtils_1.isIOUActionMatchingTransactionList)(actions_1.actionR14932, ['123', '124', actions_1.originalMessageR14932.IOUTransactionID])).toBeTruthy();
        });
        it('returns false if IOUTransactionID does not match any provided reportTransactionIDs', () => {
            expect((0, ReportActionsUtils_1.isIOUActionMatchingTransactionList)(actions_1.actionR14932, ['123', '124'])).toBeFalsy();
        });
    });
    describe('getOneTransactionThreadReportAction', () => {
        const IOUReportID = `${ONYXKEYS_1.default.COLLECTION.REPORT}REPORT_IOU`;
        const IOUTransactionID = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}TRANSACTION_IOU`;
        const IOUExpenseTransactionID = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}TRANSACTION_EXPENSE`;
        const mockChatReportID = `${ONYXKEYS_1.default.COLLECTION.REPORT}${reports_1.chatReportR14932.reportID}`;
        const mockedReports = {
            [IOUReportID]: { ...reports_1.iouReportR14932, reportID: IOUReportID },
            [mockChatReportID]: reports_1.chatReportR14932,
        };
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(actions_1.actionR14932);
        const linkedActionWithChildReportID = {
            ...actions_1.actionR14932,
            originalMessage: { ...originalMessage, IOUTransactionID },
            childReportID: 'existingChildReportID',
        };
        const linkedActionWithoutChildReportID = {
            ...actions_1.actionR14932,
            originalMessage: { ...originalMessage, IOUTransactionID },
            childReportID: undefined,
        };
        const unlinkedAction = {
            ...actions_1.actionR14932,
            originalMessage: { ...originalMessage, IOUTransactionID: IOUExpenseTransactionID },
        };
        const payAction = {
            ...actions_1.actionR14932,
            originalMessage: {
                ...originalMessage,
                IOUTransactionID,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
            },
        };
        it('should return action when single IOU action exists', () => {
            const result = ReportActionsUtils.getOneTransactionThreadReportAction(mockedReports[IOUReportID], mockedReports[mockChatReportID], [linkedActionWithChildReportID], false, [
                IOUTransactionID,
            ]);
            expect(result).toEqual(linkedActionWithChildReportID);
        });
        it('should return undefined when no linked actions exist', () => {
            const result = ReportActionsUtils.getOneTransactionThreadReportAction(mockedReports[IOUReportID], mockedReports[mockChatReportID], [unlinkedAction], false, [IOUTransactionID]);
            expect(result).toBeUndefined();
        });
        it('should return undefined when multiple IOU actions exist', () => {
            const result = ReportActionsUtils.getOneTransactionThreadReportAction(mockedReports[IOUReportID], mockedReports[mockChatReportID], [linkedActionWithChildReportID, linkedActionWithoutChildReportID], false, [IOUTransactionID]);
            expect(result).toBeUndefined();
        });
        it('should skip PAY actions and return valid IOU action', () => {
            const result = ReportActionsUtils.getOneTransactionThreadReportAction(mockedReports[IOUReportID], mockedReports[mockChatReportID], [payAction, linkedActionWithoutChildReportID], false, [IOUTransactionID]);
            expect(result).toEqual(linkedActionWithoutChildReportID);
        });
        it('should return undefined when only PAY actions exist', () => {
            const result = ReportActionsUtils.getOneTransactionThreadReportAction(mockedReports[IOUReportID], mockedReports[mockChatReportID], [payAction], false, [IOUTransactionID]);
            expect(result).toBeUndefined();
        });
    });
    describe('getOneTransactionThreadReportID', () => {
        const IOUReportID = `${ONYXKEYS_1.default.COLLECTION.REPORT}REPORT_IOU`;
        const IOUTransactionID = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}TRANSACTION_IOU`;
        const IOUExpenseTransactionID = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}TRANSACTION_EXPENSE`;
        const mockChatReportID = `${ONYXKEYS_1.default.COLLECTION.REPORT}${reports_1.chatReportR14932.reportID}`;
        const mockedReports = {
            [IOUReportID]: { ...reports_1.iouReportR14932, reportID: IOUReportID },
            [mockChatReportID]: reports_1.chatReportR14932,
        };
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(actions_1.actionR14932);
        const linkedCreateAction = {
            ...actions_1.actionR14932,
            originalMessage: { ...originalMessage, IOUTransactionID },
        };
        const linkedCreateActionWithoutChildReportID = {
            ...actions_1.actionR14932,
            originalMessage: { ...originalMessage, IOUTransactionID },
            childReportID: undefined,
        };
        const unlinkedCreateAction = {
            ...actions_1.actionR14932,
            originalMessage: { ...originalMessage, IOUTransactionID: IOUExpenseTransactionID },
        };
        const linkedDeleteAction = {
            ...actions_1.actionR14932,
            originalMessage: {
                ...originalMessage,
                IOUTransactionID,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.DELETE,
            },
        };
        const linkedPayAction = {
            ...actions_1.actionR14932,
            originalMessage: {
                ...originalMessage,
                IOUTransactionID,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
            },
        };
        const linkedPayActionWithIOUDetails = {
            ...actions_1.actionR14932,
            originalMessage: {
                ...originalMessage,
                IOUTransactionID,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
                IOUDetails: {
                    amount: originalMessage?.amount,
                    currency: originalMessage?.currency,
                },
            },
        };
        it('should return the childReportID for a valid single IOU action', () => {
            const result = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(mockedReports[IOUReportID], mockedReports[mockChatReportID], [linkedCreateAction], false, [IOUTransactionID]);
            expect(result).toEqual(linkedCreateAction.childReportID);
        });
        it('should return CONST.FAKE_REPORT_ID when action exists but childReportID is undefined', () => {
            const result = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(mockedReports[IOUReportID], mockedReports[mockChatReportID], [linkedCreateActionWithoutChildReportID], false, [IOUTransactionID]);
            expect(result).toEqual(CONST_1.default.FAKE_REPORT_ID);
        });
        it('should return undefined for action with a transaction that is not linked to it', () => {
            const result = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(mockedReports[IOUReportID], mockedReports[mockChatReportID], [unlinkedCreateAction], false, [IOUTransactionID]);
            expect(result).toBeUndefined();
        });
        it('should return undefined if multiple IOU actions are present', () => {
            const result = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(mockedReports[IOUReportID], mockedReports[mockChatReportID], [linkedCreateAction, linkedCreateAction], false, [IOUTransactionID]);
            expect(result).toBeUndefined();
        });
        it('should skip actions where original message type is PAY', () => {
            const result = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(mockedReports[IOUReportID], mockedReports[mockChatReportID], [linkedPayAction, linkedCreateAction], false, [IOUTransactionID]);
            expect(result).toEqual(linkedCreateAction.childReportID);
        });
        it('should return the childReportID if original message type is PAY with IOUDetails', () => {
            const result = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(mockedReports[IOUReportID], mockedReports[mockChatReportID], [linkedPayActionWithIOUDetails], false, [IOUTransactionID]);
            expect(result).toEqual(linkedPayActionWithIOUDetails.childReportID);
        });
        it('should return undefined if no valid IOU actions are present', () => {
            const result = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(mockedReports[IOUReportID], mockedReports[mockChatReportID], [unlinkedCreateAction, linkedDeleteAction, linkedPayAction], false, [
                IOUTransactionID,
            ]);
            expect(result).toBeUndefined();
        });
    });
    describe('getSortedReportActionsForDisplay', () => {
        it('should filter out non-whitelisted actions', () => {
            const input = [
                {
                    created: '2022-11-13 22:27:01.825',
                    reportActionID: '8401445780099176',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    originalMessage: {
                        html: 'Hello world',
                        whisperedTo: [],
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
                {
                    created: '2022-11-12 22:27:01.825',
                    reportActionID: '6401435781022176',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                    originalMessage: {
                        html: 'Hello world',
                        whisperedTo: [],
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
                {
                    created: '2022-11-11 22:27:01.825',
                    reportActionID: '2962390724708756',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    originalMessage: {
                        amount: 0,
                        currency: 'USD',
                        type: 'split', // change to const
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
                {
                    created: '2022-11-10 22:27:01.825',
                    reportActionID: '1609646094152486',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.RENAMED,
                    originalMessage: {
                        html: 'Hello world',
                        lastModified: '2022-11-10 22:27:01.825',
                        oldName: 'old name',
                        newName: 'new name',
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
                {
                    created: '2022-11-09 22:27:01.825',
                    reportActionID: '8049485084562457',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_FIELD,
                    originalMessage: {},
                    message: [{ html: 'updated the Approval Mode from "Submit and Approve" to "Submit and Close"', type: 'Action type', text: 'Action text' }],
                },
                {
                    created: '2022-11-08 22:27:06.825',
                    reportActionID: '1661970171066216',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_QUEUED,
                    originalMessage: {
                        paymentType: 'ACH',
                    },
                    message: [{ html: 'Waiting for the bank account', type: 'Action type', text: 'Action text' }],
                },
                {
                    created: '2022-11-06 22:27:08.825',
                    reportActionID: '1661970171066220',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.TASK_EDITED,
                    originalMessage: {
                        html: 'Hello world',
                        whisperedTo: [],
                    },
                    message: [{ html: 'I have changed the task', type: 'Action type', text: 'Action text' }],
                },
            ];
            // Expected output should have the `CREATED` action at last
            // eslint-disable-next-line rulesdir/prefer-at
            const expectedOutput = [...input.slice(0, 1), ...input.slice(2), input[1]];
            const result = ReportActionsUtils.getSortedReportActionsForDisplay(input, true);
            expect(result).toStrictEqual(expectedOutput);
        });
        it('should filter out closed actions', () => {
            const input = [
                {
                    created: '2022-11-13 22:27:01.825',
                    reportActionID: '8401445780099176',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    originalMessage: {
                        html: 'Hello world',
                        whisperedTo: [],
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
                {
                    created: '2022-11-12 22:27:01.825',
                    reportActionID: '6401435781022176',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                    originalMessage: {
                        html: 'Hello world',
                        whisperedTo: [],
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
                {
                    created: '2022-11-11 22:27:01.825',
                    reportActionID: '2962390724708756',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    originalMessage: {
                        amount: 0,
                        currency: 'USD',
                        type: 'split', // change to const
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
                {
                    created: '2022-11-10 22:27:01.825',
                    reportActionID: '1609646094152486',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.RENAMED,
                    originalMessage: {
                        html: 'Hello world',
                        lastModified: '2022-11-10 22:27:01.825',
                        oldName: 'old name',
                        newName: 'new name',
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
                {
                    created: '2022-11-09 22:27:01.825',
                    reportActionID: '1661970171066218',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CLOSED,
                    originalMessage: {
                        policyName: 'default', // change to const
                        reason: 'default', // change to const
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
            ];
            // Expected output should have the `CREATED` action at last and `CLOSED` action removed
            // eslint-disable-next-line rulesdir/prefer-at
            const expectedOutput = [...input.slice(0, 1), ...input.slice(2, -1), input[1]];
            const result = ReportActionsUtils.getSortedReportActionsForDisplay(input, true);
            expect(result).toStrictEqual(expectedOutput);
        });
        it('should filter out deleted, non-pending comments', () => {
            const input = [
                {
                    created: '2022-11-13 22:27:01.825',
                    reportActionID: '8401445780099176',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    originalMessage: {
                        html: 'Hello world',
                        whisperedTo: [],
                    },
                    message: [
                        {
                            html: 'Hello world',
                            type: 'Action type',
                            text: 'Action text',
                        },
                    ],
                },
                {
                    created: '2022-11-12 22:27:01.825',
                    reportActionID: '8401445780099175',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    originalMessage: {
                        html: 'Hello world',
                        whisperedTo: [],
                    },
                    message: [{ html: '', type: 'Action type', text: 'Action text' }],
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                },
                {
                    created: '2022-11-11 22:27:01.825',
                    reportActionID: '8401445780099174',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    originalMessage: {
                        html: 'Hello world',
                        whisperedTo: [],
                    },
                    message: [{ html: '', type: 'Action type', text: 'Action text' }],
                },
            ];
            const result = ReportActionsUtils.getSortedReportActionsForDisplay(input, true);
            input.pop();
            expect(result).toStrictEqual(input);
        });
        it('should filter actionable whisper actions e.g. "join", "create room" when room is archived', () => {
            // Given several different action types, including actionable whispers for creating, inviting and joining rooms, as well as non-actionable whispers
            // - ADD_COMMENT
            // - ACTIONABLE_REPORT_MENTION_WHISPER
            // - ACTIONABLE_MENTION_WHISPER
            const input = [
                {
                    created: '2024-11-19 08:04:13.728',
                    reportActionID: '1607371725956675966',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    originalMessage: {
                        html: '<mention-user accountID="18414674"/>',
                        whisperedTo: [],
                        lastModified: '2024-11-19 08:04:13.728',
                        mentionedAccountIDs: [18301266],
                    },
                    message: [
                        {
                            html: '<mention-user accountID="18414674"/>',
                            text: '@as',
                            type: 'COMMENT',
                            whisperedTo: [],
                        },
                    ],
                },
                {
                    created: '2024-11-19 08:00:14.352',
                    reportActionID: '4655978522337302598',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    originalMessage: {
                        html: '#join',
                        whisperedTo: [],
                        lastModified: '2024-11-19 08:00:14.352',
                    },
                    message: [
                        {
                            html: '#join',
                            text: '#join',
                            type: 'COMMENT',
                            whisperedTo: [],
                        },
                    ],
                },
                {
                    created: '2022-11-09 22:27:01.825',
                    reportActionID: '8049485084562457',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_REPORT_MENTION_WHISPER,
                    originalMessage: {
                        lastModified: '2024-11-19 08:00:14.353',
                        mentionedAccountIDs: [],
                        whisperedTo: [18301266],
                    },
                    message: {
                        html: "Heads up, <mention-report>#join</mention-report> doesn't exist yet. Do you want to create it?",
                        text: "Heads up, #join doesn't exist yet. Do you want to create it?",
                        type: 'COMMENT',
                        whisperedTo: [18301266],
                    },
                },
                {
                    created: '2022-11-12 22:27:01.825',
                    reportActionID: '6401435781022176',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_MENTION_WHISPER,
                    originalMessage: {
                        inviteeAccountIDs: [18414674],
                        lastModified: '2024-11-19 08:04:25.813',
                        whisperedTo: [18301266],
                    },
                    message: [
                        {
                            html: "Heads up, <mention-user accountID=18414674></mention-user> isn't a member of this room.",
                            text: "Heads up,  isn't a member of this room.",
                            type: 'COMMENT',
                        },
                    ],
                },
            ];
            // When the report actions are sorted for display with the second parameter (canUserPerformWriteAction) set to false (to simulate a report that has been archived)
            const result = ReportActionsUtils.getSortedReportActionsForDisplay(input, false);
            // The output should correctly filter out the actionable whisper types for "join," "invite," and "create room" because the report is archived.
            // Taking these actions not only doesn't make sense from a UX standpoint,  but also leads to server errors since such actions are not possible.
            const expectedOutput = input.filter((action) => action.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_REPORT_MENTION_WHISPER &&
                action.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_JOIN_REQUEST &&
                action.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_MENTION_WHISPER);
            expect(result).toStrictEqual(expectedOutput);
        });
    });
    describe('hasRequestFromCurrentAccount', () => {
        const currentUserAccountID = 1242;
        const deletedIOUReportID = '2';
        const activeIOUReportID = '3';
        const deletedIOUReportAction = {
            ...LHNTestUtils.getFakeReportAction(),
            reportActionID: '22',
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            actorAccountID: currentUserAccountID,
            message: [
                {
                    deleted: '2025-07-15 09:06:16.568',
                    html: '',
                    isDeletedParentAction: false,
                    isEdited: true,
                    text: '',
                    type: 'COMMENT',
                },
            ],
        };
        const activeIOUReportAction = {
            ...LHNTestUtils.getFakeReportAction(),
            reportActionID: '33',
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            actorAccountID: currentUserAccountID,
            message: [
                {
                    deleted: '',
                    html: '$87.00 expense',
                    isDeletedParentAction: false,
                    isEdited: true,
                    text: '',
                    type: 'COMMENT',
                },
            ],
        };
        beforeEach(() => {
            react_native_onyx_1.default.multiSet({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${deletedIOUReportID}`]: { [deletedIOUReportAction.reportActionID]: deletedIOUReportAction },
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${activeIOUReportID}`]: { [activeIOUReportAction.reportActionID]: activeIOUReportAction },
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('should return false for a deleted IOU report action', () => {
            const result = ReportActionsUtils.hasRequestFromCurrentAccount(deletedIOUReportID, currentUserAccountID);
            expect(result).toBe(false);
        });
        it('should return true for an active IOU report action', () => {
            const result = ReportActionsUtils.hasRequestFromCurrentAccount(activeIOUReportID, currentUserAccountID);
            expect(result).toBe(true);
        });
    });
    describe('getLastVisibleAction', () => {
        it('should return the last visible action for a report', () => {
            const report = {
                ...LHNTestUtils.getFakeReport([8401445480599174, 9401445480599174], 3, true),
                reportID: '1',
            };
            const action = {
                ...LHNTestUtils.getFakeReportAction('email1@test.com', 3),
                created: '2023-08-01 16:00:00',
                reportActionID: 'action1',
                actionName: 'ADDCOMMENT',
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                },
            };
            const action2 = {
                ...LHNTestUtils.getFakeReportAction('email2@test.com', 3),
                created: '2023-08-01 18:00:00',
                reportActionID: 'action2',
                actionName: 'ADDCOMMENT',
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                },
            };
            return ((0, waitForBatchedUpdates_1.default)()
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`]: { [action.reportActionID]: action, [action2.reportActionID]: action2 },
            }))
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
                    callback: () => {
                        react_native_onyx_1.default.disconnect(connection);
                        const res = ReportActionsUtils.getLastVisibleAction(report.reportID);
                        expect(res).toEqual(action2);
                        resolve();
                    },
                });
            })));
        });
    });
    describe('getReportActionMessageFragments', () => {
        it('should return the correct fragment for the REIMBURSED action', () => {
            const action = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSED,
                reportActionID: '1',
                created: '1',
                message: [
                    {
                        type: 'TEXT',
                        style: 'strong',
                        text: 'Concierge',
                    },
                    {
                        type: 'TEXT',
                        style: 'normal',
                        text: ' reimbursed this report',
                    },
                    {
                        type: 'TEXT',
                        style: 'normal',
                        text: ' on behalf of you',
                    },
                    {
                        type: 'TEXT',
                        style: 'normal',
                        text: ' from the bank account ending in 1111',
                    },
                    {
                        type: 'TEXT',
                        style: 'normal',
                        text: '. Money is on its way to your bank account ending in 0000. Reimbursement estimated to complete on Dec 16.',
                    },
                ],
            };
            const expectedMessage = ReportActionsUtils.getReportActionMessageText(action);
            const expectedFragments = ReportActionsUtils.getReportActionMessageFragments(action);
            expect(expectedFragments).toEqual([{ text: expectedMessage, html: `<muted-text>${expectedMessage}</muted-text>`, type: 'COMMENT' }]);
        });
    });
    describe('getSendMoneyFlowAction', () => {
        const mockChatReportID = `${ONYXKEYS_1.default.COLLECTION.REPORT}REPORT`;
        const mockDMChatReportID = `${ONYXKEYS_1.default.COLLECTION.REPORT}REPORT_DM`;
        const childReportID = `${ONYXKEYS_1.default.COLLECTION.REPORT}childReport123`;
        const mockedReports = {
            [mockChatReportID]: { ...reports_1.chatReportR14932, reportID: mockChatReportID },
            [mockDMChatReportID]: {
                ...reports_1.chatReportR14932,
                reportID: mockDMChatReportID,
                chatType: undefined,
                parentReportID: undefined,
                parentReportActionID: undefined,
            },
        };
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(actions_1.actionR14932);
        const createAction = {
            ...actions_1.actionR14932,
            childReportID,
            originalMessage: { ...originalMessage, type: CONST_1.default.IOU.TYPE.CREATE },
        };
        const nonIOUAction = {
            ...actions_1.actionR14932,
            childReportID,
            type: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
        };
        const payAction = {
            ...actions_1.actionR14932,
            childReportID,
            originalMessage: { ...originalMessage, type: CONST_1.default.IOU.TYPE.PAY },
        };
        it('should return undefined for a single non-IOU action', () => {
            expect((0, ReportActionsUtils_1.getSendMoneyFlowAction)([nonIOUAction], mockedReports[mockDMChatReportID])?.childReportID).toBeUndefined();
        });
        it('should return undefined for multiple IOU actions regardless of type', () => {
            expect((0, ReportActionsUtils_1.getSendMoneyFlowAction)([payAction, payAction], mockedReports[mockDMChatReportID])?.childReportID).toBeUndefined();
        });
        it('should return undefined for a single IOU action that is not `Pay`', () => {
            expect((0, ReportActionsUtils_1.getSendMoneyFlowAction)([createAction], mockedReports[mockDMChatReportID])?.childReportID).toBeUndefined();
        });
        it('should return the appropriate childReportID for a valid single `Pay` IOU action in DM chat', () => {
            expect((0, ReportActionsUtils_1.getSendMoneyFlowAction)([payAction], mockedReports[mockDMChatReportID])?.childReportID).toEqual(childReportID);
        });
        it('should return undefined for a valid single `Pay` IOU action in a chat that is not DM', () => {
            expect((0, ReportActionsUtils_1.getSendMoneyFlowAction)([payAction], mockedReports[mockChatReportID])?.childReportID).toBeUndefined();
        });
        it('should return undefined for a valid `Pay` IOU action in DM chat that has also a create IOU action', () => {
            expect((0, ReportActionsUtils_1.getSendMoneyFlowAction)([payAction, createAction], mockedReports[mockDMChatReportID])?.childReportID).toBeUndefined();
        });
    });
    describe('shouldShowAddMissingDetails', () => {
        it('should return true if personal detail is not completed', async () => {
            const card = {
                cardID: 1,
                state: CONST_1.default.EXPENSIFY_CARD.STATE.STATE_DEACTIVATED,
                bank: 'vcf',
                domainName: 'expensify',
                lastUpdated: '2022-11-09 22:27:01.825',
                fraud: CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.DOMAIN,
            };
            const mockPersonalDetail = {
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    postalCode: '10001',
                },
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, mockPersonalDetail);
            const res = ReportActionsUtils.shouldShowAddMissingDetails(CONST_1.default.REPORT.ACTIONS.TYPE.CARD_MISSING_ADDRESS, card);
            expect(res).toEqual(true);
        });
        it('should return true if card state is STATE_NOT_ISSUED', async () => {
            const card = {
                cardID: 1,
                state: CONST_1.default.EXPENSIFY_CARD.STATE.STATE_NOT_ISSUED,
                bank: 'vcf',
                domainName: 'expensify',
                lastUpdated: '2022-11-09 22:27:01.825',
                fraud: CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.DOMAIN,
            };
            const mockPersonalDetail = {
                addresses: [
                    {
                        street: '123 Main St',
                        city: 'New York',
                        state: 'NY',
                        postalCode: '10001',
                    },
                ],
                legalFirstName: 'John',
                legalLastName: 'David',
                phoneNumber: '+162992973',
                dob: '9-9-2000',
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, mockPersonalDetail);
            const res = ReportActionsUtils.shouldShowAddMissingDetails(CONST_1.default.REPORT.ACTIONS.TYPE.CARD_MISSING_ADDRESS, card);
            expect(res).toEqual(true);
        });
        it('should return false if no condition is matched', async () => {
            const card = {
                cardID: 1,
                state: CONST_1.default.EXPENSIFY_CARD.STATE.OPEN,
                bank: 'vcf',
                domainName: 'expensify',
                lastUpdated: '2022-11-09 22:27:01.825',
                fraud: CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.DOMAIN,
            };
            const mockPersonalDetail = {
                addresses: [
                    {
                        street: '123 Main St',
                        city: 'New York',
                        state: 'NY',
                        postalCode: '10001',
                    },
                ],
                legalFirstName: 'John',
                legalLastName: 'David',
                phoneNumber: '+162992973',
                dob: '9-9-2000',
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, mockPersonalDetail);
            const res = ReportActionsUtils.shouldShowAddMissingDetails(CONST_1.default.REPORT.ACTIONS.TYPE.CARD_MISSING_ADDRESS, card);
            expect(res).toEqual(false);
        });
    });
    describe('isDeletedAction', () => {
        it('should return true if reportAction is undefined', () => {
            expect(ReportActionsUtils.isDeletedAction(undefined)).toBe(true);
        });
        it('should return false for POLICY_CHANGE_LOG.INVITE_TO_ROOM action', () => {
            const reportAction = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.INVITE_TO_ROOM,
                originalMessage: {
                    html: '',
                    whisperedTo: [],
                },
                reportActionID: '1',
                created: '1',
            };
            expect(ReportActionsUtils.isDeletedAction(reportAction)).toBe(false);
        });
        it('should return true if message is an empty array', () => {
            const reportAction = {
                created: '2022-11-09 22:27:01.825',
                reportActionID: '8401445780099176',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                },
            };
            expect(ReportActionsUtils.isDeletedAction(reportAction)).toBe(true);
        });
        it('should return true if message html is empty', () => {
            const reportAction = {
                created: '2022-11-09 22:27:01.825',
                reportActionID: '8401445780099176',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                },
                message: {
                    html: '',
                    type: 'Action type',
                    text: 'Action text',
                },
            };
            expect(ReportActionsUtils.isDeletedAction(reportAction)).toBe(true);
        });
        it('should return true if message is not an array and deleted is not empty', () => {
            const reportAction = {
                created: '2022-11-09 22:27:01.825',
                reportActionID: '8401445780099176',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                },
                message: {
                    html: 'Hello world',
                    deleted: 'deleted',
                    type: 'Action type',
                    text: 'Action text',
                },
            };
            expect(ReportActionsUtils.isDeletedAction(reportAction)).toBe(true);
        });
        it('should return true if message an array and first element deleted is not empty', () => {
            const reportAction = {
                created: '2022-11-09 22:27:01.825',
                reportActionID: '8401445780099176',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                },
                message: [
                    {
                        html: 'Hello world',
                        deleted: 'deleted',
                        type: 'Action type',
                        text: 'Action text',
                    },
                ],
            };
            expect(ReportActionsUtils.isDeletedAction(reportAction)).toBe(true);
        });
        it('should return true if message is an object with html field with empty string as value is empty', () => {
            const reportAction = {
                created: '2022-11-09 22:27:01.825',
                reportActionID: '8401445780099176',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                },
                message: [
                    {
                        html: '',
                        type: 'Action type',
                        text: 'Action text',
                    },
                ],
            };
            expect(ReportActionsUtils.isDeletedAction(reportAction)).toBe(true);
        });
        it('should return false otherwise', () => {
            const reportAction = {
                created: '2022-11-09 22:27:01.825',
                reportActionID: '8401445780099176',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                },
                message: [
                    {
                        html: 'Hello world',
                        type: 'Action type',
                        text: 'Action text',
                    },
                ],
            };
            expect(ReportActionsUtils.isDeletedAction(reportAction)).toBe(false);
        });
    });
    describe('getRenamedAction', () => {
        it('should return the correct translated message for a renamed action', () => {
            const reportAction = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.RENAMED,
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                    lastModified: '2022-11-09 22:27:01.825',
                    oldName: 'Old name',
                    newName: 'New name',
                },
                reportActionID: '1',
                created: '1',
            };
            const report = { ...(0, reports_2.createRandomReport)(2), type: CONST_1.default.REPORT.TYPE.CHAT };
            expect(ReportActionsUtils.getRenamedAction(reportAction, (0, ReportUtils_1.isExpenseReport)(report), 'John')).toBe('John renamed this room to "New name" (previously "Old name")');
        });
        it('should return the correct translated message for a renamed action in expense report', () => {
            const reportAction = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.RENAMED,
                originalMessage: {
                    html: 'Hello world',
                    whisperedTo: [],
                    lastModified: '2022-11-09 22:27:01.825',
                    oldName: 'Old name',
                    newName: 'New name',
                },
                reportActionID: '1',
                created: '1',
            };
            const report = { ...(0, reports_2.createRandomReport)(2), type: CONST_1.default.REPORT.TYPE.EXPENSE };
            expect(ReportActionsUtils.getRenamedAction(reportAction, (0, ReportUtils_1.isExpenseReport)(report), 'John')).toBe('John renamed to "New name" (previously "Old name")');
        });
    });
});
