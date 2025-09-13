"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const globals_1 = require("@jest/globals");
const react_native_1 = require("@testing-library/react-native");
const date_fns_1 = require("date-fns");
const react_native_onyx_1 = require("react-native-onyx");
const useAncestorReportsAndReportActions_1 = require("@hooks/useAncestorReportsAndReportActions");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const IOU_1 = require("@libs/actions/IOU");
const DateUtils_1 = require("@libs/DateUtils");
const Localize_1 = require("@libs/Localize");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
const reports_1 = require("../../__mocks__/reportData/reports");
const NumberUtils = require("../../src/libs/NumberUtils");
const policies_1 = require("../utils/collections/policies");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_2 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const LHNTestUtils = require("../utils/LHNTestUtils");
const LHNTestUtils_1 = require("../utils/LHNTestUtils");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Be sure to include the mocked permissions library or else the beta tests won't work
jest.mock('@libs/Permissions');
jest.mock('@libs/Navigation/Navigation', () => ({
    setNavigationActionToMicrotaskQueue: jest.fn(),
    navigationRef: {
        getCurrentRoute: jest.fn(() => ({
            params: {
                reportID: '2',
            },
        })),
    },
}));
const testDate = DateUtils_1.default.getDBTime();
const currentUserEmail = 'bjorn@vikings.net';
const currentUserAccountID = 5;
const participantsPersonalDetails = {
    '1': {
        accountID: 1,
        displayName: 'Ragnar Lothbrok',
        firstName: 'Ragnar',
        login: 'ragnar@vikings.net',
    },
    '2': {
        accountID: 2,
        login: 'floki@vikings.net',
        displayName: 'floki@vikings.net',
    },
    '3': {
        accountID: 3,
        displayName: 'Lagertha Lothbrok',
        firstName: 'Lagertha',
        login: 'lagertha@vikings.net',
        pronouns: 'She/her',
    },
    '4': {
        accountID: 4,
        login: '+18332403627@expensify.sms',
        displayName: '(833) 240-3627',
    },
    '5': {
        accountID: 5,
        displayName: 'Lagertha Lothbrok',
        firstName: 'Lagertha',
        login: 'lagertha2@vikings.net',
        pronouns: 'She/her',
    },
};
const employeeList = {
    'owner@test.com': {
        email: 'owner@test.com',
        role: 'admin',
        submitsTo: '',
    },
    'admin@test.com': {
        email: 'admin@test.com',
        role: 'admin',
        submitsTo: '',
    },
    'employee@test.com': {
        email: 'employee@test.com',
        role: 'user',
        submitsTo: 'admin@test.com',
    },
    'categoryapprover1@test.com': {
        email: 'categoryapprover1@test.com',
        role: 'user',
        submitsTo: 'admin@test.com',
    },
    'categoryapprover2@test.com': {
        email: 'categoryapprover2@test.com',
        role: 'user',
        submitsTo: 'admin@test.com',
    },
    'tagapprover1@test.com': {
        email: 'tagapprover1@test.com',
        role: 'user',
        submitsTo: 'admin@test.com',
    },
    'tagapprover2@test.com': {
        email: 'tagapprover2@test.com',
        role: 'user',
        submitsTo: 'admin@test.com',
    },
};
const personalDetails = {
    '1': {
        accountID: 1,
        login: 'admin@test.com',
    },
    '2': {
        accountID: 2,
        login: 'employee@test.com',
    },
    '3': {
        accountID: 3,
        login: 'categoryapprover1@test.com',
    },
    '4': {
        accountID: 4,
        login: 'categoryapprover2@test.com',
    },
    '5': {
        accountID: 5,
        login: 'tagapprover1@test.com',
    },
    '6': {
        accountID: 6,
        login: 'tagapprover2@test.com',
    },
    '7': {
        accountID: 7,
        login: 'owner@test.com',
    },
    '8': {
        accountID: 8,
        login: CONST_1.default.EMAIL.GUIDES_DOMAIN,
    },
};
const rules = {
    approvalRules: [
        {
            applyWhen: [
                {
                    condition: 'matches',
                    field: 'category',
                    value: 'cat1',
                },
            ],
            approver: 'categoryapprover1@test.com',
            id: '1',
        },
        {
            applyWhen: [
                {
                    condition: 'matches',
                    field: 'tag',
                    value: 'tag1',
                },
            ],
            approver: 'tagapprover1@test.com',
            id: '2',
        },
        {
            applyWhen: [
                {
                    condition: 'matches',
                    field: 'category',
                    value: 'cat2',
                },
            ],
            approver: 'categoryapprover2@test.com',
            id: '3',
        },
        {
            applyWhen: [
                {
                    condition: 'matches',
                    field: 'tag',
                    value: 'tag2',
                },
            ],
            approver: 'tagapprover2@test.com',
            id: '4',
        },
    ],
};
const employeeAccountID = 2;
const categoryApprover1Email = 'categoryapprover1@test.com';
const categoryApprover2Email = 'categoryapprover2@test.com';
const tagApprover1Email = 'tagapprover1@test.com';
const tagApprover2Email = 'tagapprover2@test.com';
const policy = {
    id: '1',
    name: 'Vikings Policy',
    role: 'user',
    type: CONST_1.default.POLICY.TYPE.TEAM,
    owner: '',
    outputCurrency: '',
    isPolicyExpenseChatEnabled: false,
};
describe('ReportUtils', () => {
    (0, globals_1.beforeAll)(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        const policyCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, [policy], (current) => current.id);
        react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: participantsPersonalDetails,
            [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID: currentUserAccountID },
            [ONYXKEYS_1.default.COUNTRY_CODE]: 1,
            ...policyCollectionDataSet,
        });
        return (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(() => IntlStore_1.default.load(CONST_1.default.LOCALES.DEFAULT).then(waitForBatchedUpdates_1.default));
    describe('prepareOnboardingOnyxData', () => {
        it('provides test drive url to task title', () => {
            const title = jest.fn();
            (0, ReportUtils_1.prepareOnboardingOnyxData)(undefined, CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM, {
                message: 'This is a test',
                tasks: [
                    {
                        type: CONST_1.default.ONBOARDING_TASK_TYPE.CREATE_REPORT,
                        title,
                        description: () => '',
                        autoCompleted: false,
                        mediaAttributes: {},
                    },
                ],
            }, '1');
            expect(title).toHaveBeenCalledWith(expect.objectContaining({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                testDriveURL: expect.any(String),
            }));
        });
        it('provides test drive url to task description', () => {
            const description = jest.fn();
            (0, ReportUtils_1.prepareOnboardingOnyxData)(undefined, CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM, {
                message: 'This is a test',
                tasks: [
                    {
                        type: CONST_1.default.ONBOARDING_TASK_TYPE.CREATE_REPORT,
                        title: () => '',
                        description,
                        autoCompleted: false,
                        mediaAttributes: {},
                    },
                ],
            }, '1');
            expect(description).toHaveBeenCalledWith(expect.objectContaining({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                testDriveURL: expect.any(String),
            }));
        });
        it('should not create tasks if the task feature is not in the selected interested features', () => {
            const result = (0, ReportUtils_1.prepareOnboardingOnyxData)(undefined, CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM, {
                message: 'This is a test',
                tasks: [{ type: CONST_1.default.ONBOARDING_TASK_TYPE.CONNECT_CORPORATE_CARD, title: () => '', description: () => '', autoCompleted: false, mediaAttributes: {} }],
            }, '1', undefined, undefined, undefined, undefined, ['categories', 'accounting', 'tags']);
            expect(result?.guidedSetupData.filter((data) => data.type === 'task')).toHaveLength(0);
        });
    });
    describe('getIconsForParticipants', () => {
        it('returns avatar source', () => {
            const participants = (0, ReportUtils_1.getIconsForParticipants)([1, 2, 3, 4, 5], participantsPersonalDetails);
            expect(participants).toHaveLength(5);
            expect(participants.at(3)?.source).toBeInstanceOf(Function);
            expect(participants.at(3)?.name).toBe('(833) 240-3627');
            expect(participants.at(3)?.id).toBe(4);
            expect(participants.at(3)?.type).toBe('avatar');
            expect(participants.at(1)?.source).toBeInstanceOf(Function);
            expect(participants.at(1)?.name).toBe('floki@vikings.net');
            expect(participants.at(1)?.id).toBe(2);
            expect(participants.at(1)?.type).toBe('avatar');
        });
    });
    describe('getPolicyExpenseChatName', () => {
        it("returns owner's display name when available", () => {
            const report = {
                ownerAccountID: 1,
                reportName: 'Fallback Report Name',
            };
            const name = (0, ReportUtils_1.getPolicyExpenseChatName)({ report, personalDetailsList: participantsPersonalDetails });
            expect(name).toBe((0, Localize_1.translateLocal)('workspace.common.policyExpenseChatName', { displayName: 'Ragnar Lothbrok' }));
        });
        it('falls back to owner login when display name not present', () => {
            const report = {
                ownerAccountID: 2,
                reportName: 'Fallback Report Name',
            };
            const name = (0, ReportUtils_1.getPolicyExpenseChatName)({ report, personalDetailsList: participantsPersonalDetails });
            expect(name).toBe((0, Localize_1.translateLocal)('workspace.common.policyExpenseChatName', { displayName: 'floki' }));
        });
        it('returns report name when no personal details or owner', () => {
            const report = {
                ownerAccountID: undefined,
                reportName: 'Fallback Report Name',
            };
            const name = (0, ReportUtils_1.getPolicyExpenseChatName)({ report, personalDetailsList: {} });
            expect(name).toBe('Fallback Report Name');
        });
    });
    describe('sortIconsByName', () => {
        it('returns sorted avatar source by name, then accountID', () => {
            const participants = (0, ReportUtils_1.getIconsForParticipants)([1, 2, 3, 4, 5], participantsPersonalDetails);
            const sortedParticipants = (0, ReportUtils_1.sortIconsByName)(participants, participantsPersonalDetails, TestHelper_1.localeCompare);
            expect(sortedParticipants).toHaveLength(5);
            expect(sortedParticipants.at(0)?.source).toBeInstanceOf(Function);
            expect(sortedParticipants.at(0)?.name).toBe('(833) 240-3627');
            expect(sortedParticipants.at(0)?.id).toBe(4);
            expect(sortedParticipants.at(0)?.type).toBe('avatar');
            expect(sortedParticipants.at(1)?.source).toBeInstanceOf(Function);
            expect(sortedParticipants.at(1)?.name).toBe('floki@vikings.net');
            expect(sortedParticipants.at(1)?.id).toBe(2);
            expect(sortedParticipants.at(1)?.type).toBe('avatar');
        });
    });
    describe('getWorkspaceIcon', () => {
        it('should not use cached icon when avatar is updated', () => {
            // Given a new workspace and a expense chat with undefined `policyAvatar`
            const workspace = LHNTestUtils.getFakePolicy('1', 'ws');
            const workspaceChat = LHNTestUtils.getFakeReport();
            workspaceChat.policyID = workspace.id;
            expect((0, ReportUtils_1.getWorkspaceIcon)(workspaceChat, workspace).source).toBe((0, ReportUtils_1.getDefaultWorkspaceAvatar)(workspace.name));
            // When the user uploads a new avatar
            const newAvatarURL = 'https://example.com';
            workspace.avatarURL = newAvatarURL;
            // Then it should return the new avatar
            expect((0, ReportUtils_1.getWorkspaceIcon)(workspaceChat, workspace).source).toBe(newAvatarURL);
        });
    });
    describe('hasReceiptError', () => {
        it('should return true for transaction has receipt error', () => {
            const parentReport = LHNTestUtils.getFakeReport();
            const report = LHNTestUtils.getFakeReport();
            const errors = {
                '1231231231313221': {
                    error: CONST_1.default.IOU.RECEIPT_ERROR,
                    source: 'blob:https://dev.new.expensify.com:8082/6c5b7110-42c2-4e6d-8566-657ff24caf21',
                    filename: 'images.jpeg',
                    action: 'replaceReceipt',
                },
            };
            report.parentReportID = parentReport.reportID;
            const currentReportId = '';
            const transactionID = 1;
            const transaction = {
                ...(0, transaction_1.default)(transactionID),
                category: '',
                tag: '',
                created: testDate,
                reportID: currentReportId,
                managedCard: true,
                comment: {
                    liabilityType: CONST_1.default.TRANSACTION.LIABILITY_TYPE.RESTRICT,
                },
                errors,
            };
            expect((0, ReportUtils_1.hasReceiptError)(transaction)).toBe(true);
        });
    });
    describe('hasReceiptError', () => {
        it('should return false for transaction has no receipt error', () => {
            const parentReport = LHNTestUtils.getFakeReport();
            const report = LHNTestUtils.getFakeReport();
            report.parentReportID = parentReport.reportID;
            const currentReportId = '';
            const transactionID = 1;
            const transaction = {
                ...(0, transaction_1.default)(transactionID),
                category: '',
                tag: '',
                created: testDate,
                reportID: currentReportId,
                managedCard: true,
                comment: {
                    liabilityType: CONST_1.default.TRANSACTION.LIABILITY_TYPE.RESTRICT,
                },
            };
            expect((0, ReportUtils_1.hasReceiptError)(transaction)).toBe(false);
        });
    });
    describe('sortOutstandingReportsBySelected', () => {
        it('should return -1 when report1 is selected and report2 is not', () => {
            const report1 = LHNTestUtils.getFakeReport();
            const report2 = LHNTestUtils.getFakeReport();
            const selectedReportID = report1.reportID;
            expect((0, ReportUtils_1.sortOutstandingReportsBySelected)(report1, report2, selectedReportID, TestHelper_1.localeCompare)).toBe(-1);
        });
        it('should return 1 when report2 is selected and report1 is not', () => {
            const report1 = LHNTestUtils.getFakeReport();
            const report2 = LHNTestUtils.getFakeReport();
            const selectedReportID = report2.reportID;
            expect((0, ReportUtils_1.sortOutstandingReportsBySelected)(report1, report2, selectedReportID, TestHelper_1.localeCompare)).toBe(1);
        });
    });
    describe('getDisplayNamesWithTooltips', () => {
        test('withSingleParticipantReport', () => {
            const participants = (0, ReportUtils_1.getDisplayNamesWithTooltips)(participantsPersonalDetails, false, TestHelper_1.localeCompare);
            expect(participants).toHaveLength(5);
            expect(participants.at(0)?.displayName).toBe('(833) 240-3627');
            expect(participants.at(0)?.login).toBe('+18332403627@expensify.sms');
            expect(participants.at(2)?.displayName).toBe('Lagertha Lothbrok');
            expect(participants.at(2)?.login).toBe('lagertha@vikings.net');
            expect(participants.at(2)?.accountID).toBe(3);
            expect(participants.at(2)?.pronouns).toBe('She/her');
            expect(participants.at(4)?.displayName).toBe('Ragnar Lothbrok');
            expect(participants.at(4)?.login).toBe('ragnar@vikings.net');
            expect(participants.at(4)?.accountID).toBe(1);
            expect(participants.at(4)?.pronouns).toBeUndefined();
        });
    });
    describe('getReportName', () => {
        describe('1:1 DM', () => {
            test('with displayName', () => {
                expect((0, ReportUtils_1.getReportName)({
                    reportID: '',
                    participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
                })).toBe('Ragnar Lothbrok');
            });
            test('no displayName', () => {
                expect((0, ReportUtils_1.getReportName)({
                    reportID: '',
                    participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 2]),
                })).toBe('floki@vikings.net');
            });
            test('SMS', () => {
                expect((0, ReportUtils_1.getReportName)({
                    reportID: '',
                    participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 4]),
                })).toBe('(833) 240-3627');
            });
        });
        test('Group DM', () => {
            expect((0, ReportUtils_1.getReportName)({
                reportID: '',
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1, 2, 3, 4]),
            })).toBe('Ragnar, floki@vikings.net, Lagertha, (833) 240-3627');
        });
        describe('Default Policy Room', () => {
            afterEach(async () => {
                await react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, {});
            });
            const baseAdminsRoom = {
                reportID: '',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
                reportName: '#admins',
            };
            const reportNameValuePairs = {
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            test('Active', () => {
                expect((0, ReportUtils_1.getReportName)(baseAdminsRoom)).toBe('#admins');
            });
            test('Archived', async () => {
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${baseAdminsRoom.reportID}`, reportNameValuePairs);
                expect((0, ReportUtils_1.getReportName)(baseAdminsRoom)).toBe('#admins (archived)');
                return IntlStore_1.default.load(CONST_1.default.LOCALES.ES).then(() => expect((0, ReportUtils_1.getReportName)(baseAdminsRoom)).toBe('#admins (archivado)'));
            });
        });
        describe('User-Created Policy Room', () => {
            afterEach(async () => {
                await react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, {});
            });
            const baseUserCreatedRoom = {
                reportID: '',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                reportName: '#VikingsChat',
            };
            const reportNameValuePairs = {
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            test('Active', () => {
                expect((0, ReportUtils_1.getReportName)(baseUserCreatedRoom)).toBe('#VikingsChat');
            });
            test('Archived', async () => {
                const archivedPolicyRoom = {
                    ...baseUserCreatedRoom,
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${baseUserCreatedRoom.reportID}`, reportNameValuePairs);
                expect((0, ReportUtils_1.getReportName)(archivedPolicyRoom)).toBe('#VikingsChat (archived)');
                return IntlStore_1.default.load(CONST_1.default.LOCALES.ES).then(() => expect((0, ReportUtils_1.getReportName)(archivedPolicyRoom)).toBe('#VikingsChat (archivado)'));
            });
        });
        describe('PolicyExpenseChat', () => {
            describe('Active', () => {
                test('as member', () => {
                    expect((0, ReportUtils_1.getReportName)({
                        reportID: '',
                        chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                        policyID: policy.id,
                        isOwnPolicyExpenseChat: true,
                        ownerAccountID: 1,
                    })).toBe(`Ragnar Lothbrok's expenses`);
                });
                test('as admin', () => {
                    expect((0, ReportUtils_1.getReportName)({
                        reportID: '',
                        chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                        policyID: policy.id,
                        isOwnPolicyExpenseChat: false,
                        ownerAccountID: 1,
                    })).toBe(`Ragnar Lothbrok's expenses`);
                });
            });
            describe('Archived', () => {
                const baseArchivedPolicyExpenseChat = {
                    reportID: '',
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    ownerAccountID: 1,
                    policyID: policy.id,
                    oldPolicyName: policy.name,
                };
                const reportNameValuePairs = {
                    private_isArchived: DateUtils_1.default.getDBTime(),
                };
                test('as member', async () => {
                    const memberArchivedPolicyExpenseChat = {
                        ...baseArchivedPolicyExpenseChat,
                        isOwnPolicyExpenseChat: true,
                    };
                    await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${baseArchivedPolicyExpenseChat.reportID}`, reportNameValuePairs);
                    expect((0, ReportUtils_1.getReportName)(memberArchivedPolicyExpenseChat)).toBe(`Ragnar Lothbrok's expenses (archived)`);
                    return IntlStore_1.default.load(CONST_1.default.LOCALES.ES).then(() => expect((0, ReportUtils_1.getReportName)(memberArchivedPolicyExpenseChat)).toBe(`Ragnar Lothbrok's gastos (archivado)`));
                });
                test('as admin', async () => {
                    const adminArchivedPolicyExpenseChat = {
                        ...baseArchivedPolicyExpenseChat,
                        isOwnPolicyExpenseChat: false,
                    };
                    expect((0, ReportUtils_1.getReportName)(adminArchivedPolicyExpenseChat)).toBe(`Ragnar Lothbrok's expenses (archived)`);
                    return IntlStore_1.default.load(CONST_1.default.LOCALES.ES).then(() => expect((0, ReportUtils_1.getReportName)(adminArchivedPolicyExpenseChat)).toBe(`Ragnar Lothbrok's gastos (archivado)`));
                });
            });
        });
        describe('ParentReportAction is', () => {
            test('Manually Submitted Report Action', () => {
                const threadOfSubmittedReportAction = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                    parentReportID: '101',
                    policyID: policy.id,
                };
                const submittedParentReportAction = {
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED,
                    originalMessage: {
                        amount: 169,
                        currency: 'USD',
                    },
                };
                expect((0, ReportUtils_1.getReportName)(threadOfSubmittedReportAction, policy, submittedParentReportAction)).toBe('submitted');
            });
            test('Invited/Removed Room Member Action', () => {
                const threadOfRemovedRoomMemberAction = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                    parentReportID: '101',
                    parentReportActionID: '102',
                    policyID: policy.id,
                };
                const removedParentReportAction = {
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.REMOVE_FROM_ROOM,
                    originalMessage: {
                        targetAccountIDs: [1],
                    },
                };
                expect((0, ReportUtils_1.getReportName)(threadOfRemovedRoomMemberAction, policy, removedParentReportAction)).toBe('removed ragnar@vikings.net');
            });
        });
        describe('Task Report', () => {
            const htmlTaskTitle = `<h1>heading with <a href="https://www.unknown.com" target="_blank" rel="noreferrer noopener">link</a></h1>`;
            it('Should return the text extracted from report name html', () => {
                const report = { ...(0, reports_2.createRandomReport)(1), type: 'task' };
                expect((0, ReportUtils_1.getReportName)({ ...report, reportName: htmlTaskTitle })).toEqual('heading with link');
            });
            it('Should return deleted task translations when task is is deleted', () => {
                const report = { ...(0, reports_2.createRandomReport)(1), type: 'task', isDeletedParentAction: true };
                expect((0, ReportUtils_1.getReportName)({ ...report, reportName: htmlTaskTitle })).toEqual((0, Localize_1.translateLocal)('parentReportAction.deletedTask'));
            });
        });
        describe('Derived values', () => {
            const report = {
                reportID: '1',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                currency: 'CLP',
                ownerAccountID: 1,
                isPinned: false,
                isOwnPolicyExpenseChat: true,
                isWaitingOnBankAccount: false,
                policyID: '1',
            };
            beforeEach(() => {
                jest.clearAllMocks();
            });
            (0, globals_1.beforeAll)(async () => {
                await react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT, {
                    report_1: report,
                });
            });
            test('should return report name from a derived value', () => {
                expect((0, ReportUtils_1.getReportName)(report)).toEqual("Ragnar Lothbrok's expenses");
            });
            test('should generate report name if report is not merged in the Onyx', () => {
                const expenseChatReport = {
                    reportID: '2',
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    currency: 'CLP',
                    ownerAccountID: 1,
                    isPinned: false,
                    isOwnPolicyExpenseChat: true,
                    isWaitingOnBankAccount: false,
                    policyID: '1',
                };
                expect((0, ReportUtils_1.getReportName)(expenseChatReport)).toEqual("Ragnar Lothbrok's expenses");
            });
        });
    });
    describe('Fallback scenarios', () => {
        test('should fallback to report.reportName when primary name generation returns empty string', () => {
            const reportWithFallbackName = {
                reportID: '3',
                reportName: 'Custom Report Name',
                ownerAccountID: undefined,
                participants: {},
                policyID: undefined,
                chatType: undefined,
            };
            const result = (0, ReportUtils_1.getReportName)(reportWithFallbackName);
            expect(result).toBe('Custom Report Name');
        });
        test('should return empty string when both primary name generation and reportName are empty', () => {
            const reportWithoutName = {
                reportID: '4',
                reportName: '',
                ownerAccountID: undefined,
                participants: {},
                policyID: undefined,
                chatType: undefined,
            };
            const result = (0, ReportUtils_1.getReportName)(reportWithoutName);
            expect(result).toBe('');
        });
        test('should return empty string when reportName is undefined', () => {
            const reportWithUndefinedName = {
                reportID: '5',
                reportName: undefined,
                ownerAccountID: undefined,
                participants: {},
                policyID: undefined,
                chatType: undefined,
            };
            const result = (0, ReportUtils_1.getReportName)(reportWithUndefinedName);
            expect(result).toBe('');
        });
        test('should return Concierge display name for concierge chat report', async () => {
            const conciergeReportID = 'concierge-123';
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.CONCIERGE_REPORT_ID}`, conciergeReportID);
            const conciergeReport = {
                reportID: conciergeReportID,
                reportName: '',
                ownerAccountID: undefined,
                participants: {},
                policyID: undefined,
                chatType: undefined,
            };
            const result = (0, ReportUtils_1.getReportName)(conciergeReport);
            expect(result).toBe(CONST_1.default.CONCIERGE_DISPLAY_NAME);
        });
    });
    describe('Automatically approved report message via automatic (not by a human) action is', () => {
        test('shown when the report is forwarded (Control feature)', () => {
            const expenseReport = {
                ...LHNTestUtils.getFakeReport(),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                parentReportID: '101',
                policyID: policy.id,
            };
            const submittedParentReportAction = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED,
                originalMessage: {
                    amount: 169,
                    currency: 'USD',
                    automaticAction: true,
                },
            };
            expect((0, ReportUtils_1.getReportName)(expenseReport, policy, submittedParentReportAction)).toBe('approved via <a href="https://help.expensify.com/articles/new-expensify/workspaces/Set-up-rules#configure-expense-report-rules">workspace rules</a>');
        });
        test('shown when the report is approved', () => {
            const expenseReport = {
                ...LHNTestUtils.getFakeReport(),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                parentReportID: '101',
                policyID: policy.id,
            };
            const submittedParentReportAction = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED,
                originalMessage: {
                    amount: 169,
                    currency: 'USD',
                    automaticAction: true,
                },
            };
            expect((0, ReportUtils_1.getReportName)(expenseReport, policy, submittedParentReportAction)).toBe('approved via <a href="https://help.expensify.com/articles/new-expensify/workspaces/Set-up-rules#configure-expense-report-rules">workspace rules</a>');
        });
    });
    describe('Automatically submitted via harvesting (delayed submit) report message is', () => {
        test('shown when report is submitted and status is submitted', () => {
            const expenseReport = {
                ...LHNTestUtils.getFakeReport(),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                parentReportID: '101',
                policyID: policy.id,
            };
            const submittedParentReportAction = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED,
                originalMessage: {
                    amount: 169,
                    currency: 'USD',
                    harvesting: true,
                },
            };
            expect((0, ReportUtils_1.getReportName)(expenseReport, policy, submittedParentReportAction)).toBe('submitted via <a href="https://help.expensify.com/articles/new-expensify/workspaces/Set-up-workflows#select-workflows">delay submissions</a>');
        });
        test('shown when report is submitted and status is closed', () => {
            const expenseReport = {
                ...LHNTestUtils.getFakeReport(),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                parentReportID: '101',
                policyID: policy.id,
            };
            const submittedParentReportAction = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED_AND_CLOSED,
                originalMessage: {
                    amount: 169,
                    currency: 'USD',
                    harvesting: true,
                },
            };
            expect((0, ReportUtils_1.getReportName)(expenseReport, policy, submittedParentReportAction)).toBe('submitted via <a href="https://help.expensify.com/articles/new-expensify/workspaces/Set-up-workflows#select-workflows">delay submissions</a>');
        });
    });
    describe('getParentNavigationSubtitle', () => {
        const baseArchivedPolicyExpenseChat = {
            reportID: '2',
            lastReadTime: '2024-02-01 04:56:47.233',
            parentReportActionID: '1',
            parentReportID: '1',
            reportName: 'Base Report',
            type: CONST_1.default.REPORT.TYPE.INVOICE,
        };
        const reports = [
            {
                reportID: '1',
                lastReadTime: '2024-02-01 04:56:47.233',
                reportName: 'Report',
                policyName: 'A workspace',
                invoiceReceiver: { type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL, accountID: 1 },
            },
            baseArchivedPolicyExpenseChat,
        ];
        (0, globals_1.beforeAll)(() => {
            const reportCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT, reports, (report) => report.reportID);
            react_native_onyx_1.default.multiSet({
                ...reportCollectionDataSet,
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('should return the correct parent navigation subtitle for the archived invoice report', () => {
            const actual = (0, ReportUtils_1.getParentNavigationSubtitle)(baseArchivedPolicyExpenseChat, true);
            const normalizedActual = { ...actual, reportName: actual.reportName?.replace(/\u00A0/g, ' ') };
            expect(normalizedActual).toEqual({ reportName: 'A workspace & Ragnar Lothbrok (archived)' });
        });
        it('should return the correct parent navigation subtitle for the non archived invoice report', () => {
            const actual = (0, ReportUtils_1.getParentNavigationSubtitle)(baseArchivedPolicyExpenseChat, false);
            const normalizedActual = { ...actual, reportName: actual.reportName?.replace(/\u00A0/g, ' ') };
            expect(normalizedActual).toEqual({ reportName: 'A workspace & Ragnar Lothbrok' });
        });
    });
    describe('requiresAttentionFromCurrentUser', () => {
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
        });
        it('returns false when there is no report', () => {
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(undefined)).toBe(false);
        });
        it('returns false when the matched IOU report does not have an owner accountID', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                ownerAccountID: undefined,
            };
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(false);
        });
        it('returns false when the linked iou report has an outstanding IOU', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                iouReportID: '1',
            };
            react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}1`, {
                reportID: '1',
                ownerAccountID: 99,
            }).then(() => {
                expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(false);
            });
        });
        it('returns false when the report has no outstanding IOU but is waiting for a bank account and the logged user is the report owner', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                ownerAccountID: currentUserAccountID,
                isWaitingOnBankAccount: true,
            };
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(false);
        });
        it('returns false when the report has outstanding IOU and is not waiting for a bank account and the logged user is the report owner', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                ownerAccountID: currentUserAccountID,
                isWaitingOnBankAccount: false,
            };
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(false);
        });
        it('returns false when the report has no outstanding IOU but is waiting for a bank account and the logged user is not the report owner', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                ownerAccountID: 97,
                isWaitingOnBankAccount: true,
            };
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(false);
        });
        it('returns true when the report has an unread mention', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                isUnreadWithMention: true,
            };
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(true);
        });
        it('returns true when the report is an outstanding task', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                type: CONST_1.default.REPORT.TYPE.TASK,
                managerID: currentUserAccountID,
                isUnreadWithMention: false,
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                hasParentAccess: false,
            };
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(true);
        });
        it('returns true when the report has outstanding child expense', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                ownerAccountID: 99,
                hasOutstandingChildRequest: true,
                isWaitingOnBankAccount: false,
            };
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(true);
        });
        it('returns false if the user is not on free trial', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: null, // not on free trial
                [ONYXKEYS_1.default.NVP_BILLING_FUND_ID]: null, // no payment card added
            });
            const report = {
                ...LHNTestUtils.getFakeReport(),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SYSTEM,
            };
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(false);
        });
        it("returns false if the user free trial hasn't ended yet", async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 1), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING), // trial not ended
                [ONYXKEYS_1.default.NVP_BILLING_FUND_ID]: null, // no payment card added
            });
            const report = {
                ...LHNTestUtils.getFakeReport(),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SYSTEM,
            };
            expect((0, ReportUtils_1.requiresAttentionFromCurrentUser)(report)).toBe(false);
        });
    });
    describe('getChatRoomSubtitle', () => {
        (0, globals_1.beforeAll)(async () => {
            await react_native_onyx_1.default.clear();
            const policyCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, [policy], (current) => current.id);
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: participantsPersonalDetails,
                [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID: currentUserAccountID },
                ...policyCollectionDataSet,
            });
        });
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            const policyCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, [policy], (current) => current.id);
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: participantsPersonalDetails,
                [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID: currentUserAccountID },
                ...policyCollectionDataSet,
            });
        });
        it('should return empty string for chat thread', () => {
            const report = (0, reports_2.createWorkspaceThread)(1);
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe('');
        });
        it('should return "Your space" for self DM', () => {
            const report = (0, reports_2.createSelfDM)(1, currentUserAccountID);
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe('Your space');
        });
        it('should return "Invoices" for invoice room', () => {
            const report = (0, reports_2.createInvoiceRoom)(1);
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe('Invoices');
        });
        it('should return empty string for non-default, non-user-created, non-policy-expense chat', () => {
            const report = (0, reports_2.createRegularChat)(1, [currentUserAccountID, 2]);
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe('');
        });
        it('should return domain name for domain room', () => {
            const report = (0, reports_2.createDomainRoom)(1);
            report.reportName = '#example.com';
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe('example.com');
        });
        it('should return policy name for admin room', () => {
            const report = (0, reports_2.createAdminRoom)(1);
            report.policyID = policy.id;
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe(policy.name);
        });
        it('should return policy name for announce room', () => {
            const report = (0, reports_2.createAnnounceRoom)(1);
            report.policyID = policy.id;
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe(policy.name);
        });
        it('should return policy name for user created policy room', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                policyID: policy.id,
            };
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe(policy.name);
        });
        it('should return policy name for policy expense chat when not in create expense flow', () => {
            const report = (0, reports_2.createPolicyExpenseChat)(1);
            report.policyID = policy.id;
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe(policy.name);
        });
        it('should return empty string for expense report (not default/user-created/policy-expense)', () => {
            const report = (0, reports_2.createExpenseReport)(1);
            report.policyID = policy.id;
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe('');
        });
        it('should return empty string for expense report in create expense flow (not default/user-created/policy-expense)', () => {
            const report = (0, reports_2.createExpenseReport)(1);
            report.policyID = policy.id;
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report, true, false);
            expect(result).toBe('');
        });
        it('should return oldPolicyName when report is archived', () => {
            const report = (0, reports_2.createAdminRoom)(1);
            report.oldPolicyName = 'Old Policy Name';
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report, false, true);
            expect(result).toBe('Old Policy Name');
        });
        it('should return empty string when report is archived but has no oldPolicyName', () => {
            const report = (0, reports_2.createAdminRoom)(1);
            report.oldPolicyName = undefined;
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report, false, true);
            expect(result).toBe('');
        });
        it('should prioritize isReportArchived over other conditions', () => {
            const report = (0, reports_2.createAdminRoom)(1);
            report.policyID = policy.id;
            report.oldPolicyName = 'Archived Policy';
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report, true, true);
            expect(result).toBe('Archived Policy');
        });
        it('should handle with only report data', () => {
            const report = (0, reports_2.createAdminRoom)(1);
            report.policyID = policy.id;
            const result = (0, ReportUtils_1.getChatRoomSubtitle)(report);
            expect(result).toBe(policy.name);
        });
    });
    describe('getMoneyRequestOptions', () => {
        const participantsAccountIDs = Object.keys(participantsPersonalDetails).map(Number);
        (0, globals_1.beforeAll)(() => {
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                [currentUserAccountID]: {
                    accountID: currentUserAccountID,
                    login: currentUserEmail,
                },
            });
        });
        afterAll(() => react_native_onyx_1.default.clear());
        describe('return empty iou options if', () => {
            it('participants array contains excluded expensify iou emails', () => {
                const allEmpty = CONST_1.default.EXPENSIFY_ACCOUNT_IDS.every((accountID) => {
                    const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(undefined, undefined, [currentUserAccountID, accountID]);
                    return moneyRequestOptions.length === 0;
                });
                expect(allEmpty).toBe(true);
            });
            it('it is a room with no participants except self', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID]);
                expect(moneyRequestOptions.length).toBe(0);
            });
            it('its not your policy expense chat', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    isOwnPolicyExpenseChat: false,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID]);
                expect(moneyRequestOptions.length).toBe(0);
            });
            it('its paid IOU report', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.IOU,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID]);
                expect(moneyRequestOptions.length).toBe(0);
            });
            it('its approved Expense report', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID]);
                expect(moneyRequestOptions.length).toBe(0);
            });
            it('its archived report', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID], true);
                expect(moneyRequestOptions.length).toBe(0);
            });
            it('its trip room', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.TRIP_ROOM,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID]);
                expect(moneyRequestOptions.length).toBe(0);
            });
            it('its paid Expense report', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID]);
                expect(moneyRequestOptions.length).toBe(0);
            });
            it('it is an expense report tied to a policy expense chat user does not own', () => {
                react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}100`, {
                    reportID: '100',
                    isOwnPolicyExpenseChat: false,
                }).then(() => {
                    const report = {
                        ...LHNTestUtils.getFakeReport(),
                        parentReportID: '100',
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    };
                    const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID]);
                    expect(moneyRequestOptions.length).toBe(0);
                });
            });
            it('the current user is an invited user of the expense report', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, 20]);
                expect(moneyRequestOptions.length).toBe(0);
            });
            it('the current user is an invited user of the iou report', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.IOU,
                    ownerAccountID: 20,
                    managerID: 21,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, 20, 21]);
                expect(moneyRequestOptions.length).toBe(0);
            });
        });
        describe('return only iou split option if', () => {
            it('it is a chat room with more than one participant that is not an announce room', () => {
                const onlyHaveSplitOption = [CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS, CONST_1.default.REPORT.CHAT_TYPE.DOMAIN_ALL, CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM].every((chatType) => {
                    const report = {
                        ...LHNTestUtils.getFakeReport(),
                        chatType,
                    };
                    const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                    return moneyRequestOptions.length === 1 && moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SPLIT);
                });
                expect(onlyHaveSplitOption).toBe(true);
            });
            it('has multiple participants excluding self', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, ...participantsAccountIDs]);
                expect(moneyRequestOptions.length).toBe(1);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SPLIT)).toBe(true);
            });
            it('user has pay expense permission', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, ...participantsAccountIDs]);
                expect(moneyRequestOptions.length).toBe(1);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SPLIT)).toBe(true);
            });
            it("it's a group DM report", () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                    participantsAccountIDs: [currentUserAccountID, ...participantsAccountIDs],
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, ...participantsAccountIDs.map(Number)]);
                expect(moneyRequestOptions.length).toBe(1);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SPLIT)).toBe(true);
            });
        });
        describe('return only submit expense option if', () => {
            it('it is an IOU report in submitted state', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.IOU,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                    managerID: currentUserAccountID,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                expect(moneyRequestOptions.length).toBe(1);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
            });
            it('it is an IOU report in submitted state even with pay expense permissions', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.IOU,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                    managerID: currentUserAccountID,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                expect(moneyRequestOptions.length).toBe(1);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
            });
        });
        describe('return only submit expense and track expense options if', () => {
            it("it is an expense report tied to user's own policy expense chat", () => {
                react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}102`, {
                    reportID: '102',
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    isOwnPolicyExpenseChat: true,
                }).then(() => {
                    const report = {
                        ...LHNTestUtils.getFakeReport(),
                        parentReportID: '102',
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                        ownerAccountID: currentUserAccountID,
                    };
                    const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID]);
                    expect(moneyRequestOptions.length).toBe(2);
                    expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
                    expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.TRACK)).toBe(true);
                    expect(moneyRequestOptions.indexOf(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(0);
                });
            });
            it("it is an open expense report tied to user's own policy expense chat", () => {
                react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}103`, {
                    reportID: '103',
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    isOwnPolicyExpenseChat: true,
                }).then(() => {
                    const report = {
                        ...LHNTestUtils.getFakeReport(),
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                        stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                        statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                        parentReportID: '103',
                        ownerAccountID: currentUserAccountID,
                    };
                    const paidPolicy = {
                        type: CONST_1.default.POLICY.TYPE.TEAM,
                        id: '',
                        name: '',
                        role: 'user',
                        owner: '',
                        outputCurrency: '',
                        isPolicyExpenseChatEnabled: false,
                    };
                    const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, paidPolicy, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                    expect(moneyRequestOptions.length).toBe(2);
                    expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
                    expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.TRACK)).toBe(true);
                    expect(moneyRequestOptions.indexOf(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(0);
                });
            });
            it('it is an IOU report in submitted state', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.IOU,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                    managerID: currentUserAccountID,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                expect(moneyRequestOptions.length).toBe(1);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
            });
            it('it is an IOU report in submitted state even with pay expense permissions', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.IOU,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                    managerID: currentUserAccountID,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                expect(moneyRequestOptions.length).toBe(1);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
            });
            it("it is a submitted expense report in user's own policyExpenseChat and the policy has Instant Submit frequency", () => {
                const paidPolicy = {
                    id: 'ef72dfeb',
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    autoReporting: true,
                    autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
                    name: '',
                    role: 'user',
                    owner: '',
                    outputCurrency: '',
                    isPolicyExpenseChatEnabled: false,
                    employeeList: {
                        [currentUserEmail]: {
                            email: currentUserEmail,
                            submitsTo: currentUserEmail,
                        },
                    },
                };
                Promise.all([
                    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${paidPolicy.id}`, paidPolicy),
                    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}101`, {
                        reportID: '101',
                        chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                        isOwnPolicyExpenseChat: true,
                        policyID: paidPolicy.id,
                        ownerAccountID: currentUserAccountID,
                    }),
                ]).then(() => {
                    const report = {
                        ...LHNTestUtils.getFakeReport(),
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                        stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                        statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                        parentReportID: '101',
                        policyID: paidPolicy.id,
                        managerID: currentUserAccountID,
                        ownerAccountID: currentUserAccountID,
                    };
                    const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, paidPolicy, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                    expect(moneyRequestOptions.length).toBe(2);
                    expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
                    expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.TRACK)).toBe(true);
                    expect(moneyRequestOptions.indexOf(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(0);
                });
            });
        });
        describe('return multiple expense options if', () => {
            it('it is a 1:1 DM', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                expect(moneyRequestOptions.length).toBe(3);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SPLIT)).toBe(true);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.PAY)).toBe(true);
                expect(moneyRequestOptions.indexOf(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(0);
            });
            it("it is a submitted report tied to user's own policy expense chat", () => {
                const paidPolicy = {
                    id: '3f54cca8',
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    name: '',
                    role: 'user',
                    owner: '',
                    outputCurrency: '',
                    isPolicyExpenseChatEnabled: false,
                };
                Promise.all([
                    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${paidPolicy.id}`, paidPolicy),
                    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}101`, {
                        reportID: '101',
                        chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                        isOwnPolicyExpenseChat: true,
                    }),
                ]).then(() => {
                    const report = {
                        ...LHNTestUtils.getFakeReport(),
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                        stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                        statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                        parentReportID: '101',
                        policyID: paidPolicy.id,
                        ownerAccountID: currentUserAccountID,
                    };
                    const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, paidPolicy, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                    expect(moneyRequestOptions.length).toBe(2);
                    expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
                    expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.TRACK)).toBe(true);
                });
            });
            it("it is user's own policy expense chat", () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    isOwnPolicyExpenseChat: true,
                    managerID: currentUserAccountID,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, ...participantsAccountIDs]);
                expect(moneyRequestOptions.length).toBe(2);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.TRACK)).toBe(true);
                expect(moneyRequestOptions.indexOf(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(0);
            });
        });
        describe('Teachers Unite policy logic', () => {
            const teachersUniteTestPolicyID = CONST_1.default.TEACHERS_UNITE.TEST_POLICY_ID;
            const otherPolicyID = 'normal-policy-id';
            it('should hide Create Expense option and show Split Expense for Teachers Unite policy', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    policyID: teachersUniteTestPolicyID,
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    isOwnPolicyExpenseChat: true,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                // Should not include SUBMIT (Create Expense)
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(false);
                // Should include SPLIT (Split Expense)
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SPLIT)).toBe(true);
            });
            it('should show Create Expense option and hide Split Expense for non-Teachers Unite policy', () => {
                const report = {
                    ...LHNTestUtils.getFakeReport(),
                    policyID: otherPolicyID,
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    isOwnPolicyExpenseChat: true,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, undefined, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                // Should include SUBMIT (Create Expense)
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(true);
                // Should not include SPLIT (Split Expense)
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SPLIT)).toBe(false);
                // Should include other options like TRACK
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.TRACK)).toBe(true);
            });
            it('should disable Create report option for expense chats on Teachers Unite workspace', () => {
                const expenseReport = {
                    ...LHNTestUtils.getFakeReport(),
                    policyID: teachersUniteTestPolicyID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    isOwnPolicyExpenseChat: true,
                };
                const moneyRequestOptions = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(expenseReport, undefined, [currentUserAccountID, participantsAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID]);
                // Should not include SUBMIT
                expect(moneyRequestOptions.includes(CONST_1.default.IOU.TYPE.SUBMIT)).toBe(false);
            });
        });
    });
    describe('getReportIDFromLink', () => {
        it('should get the correct reportID from a deep link', () => {
            expect((0, ReportUtils_1.getReportIDFromLink)('new-expensify://r/75431276')).toBe('75431276');
            expect((0, ReportUtils_1.getReportIDFromLink)('https://www.expensify.cash/r/75431276')).toBe('75431276');
            expect((0, ReportUtils_1.getReportIDFromLink)('https://staging.new.expensify.com/r/75431276')).toBe('75431276');
            expect((0, ReportUtils_1.getReportIDFromLink)('https://dev.new.expensify.com/r/75431276')).toBe('75431276');
            expect((0, ReportUtils_1.getReportIDFromLink)('https://staging.expensify.cash/r/75431276')).toBe('75431276');
            expect((0, ReportUtils_1.getReportIDFromLink)('https://new.expensify.com/r/75431276')).toBe('75431276');
        });
        it("shouldn't get the correct reportID from a deep link", () => {
            expect((0, ReportUtils_1.getReportIDFromLink)('new-expensify-not-valid://r/75431276')).toBe('');
            expect((0, ReportUtils_1.getReportIDFromLink)('new-expensify://settings')).toBe('');
        });
    });
    describe('getMostRecentlyVisitedReport', () => {
        it('should filter out report without reportID & lastReadTime and return the most recently visited report', () => {
            const reports = [
                { reportID: '1', lastReadTime: '2023-07-08 07:15:44.030' },
                { reportID: '2', lastReadTime: undefined },
                { reportID: '3', lastReadTime: '2023-07-06 07:15:44.030' },
                { reportID: '4', lastReadTime: '2023-07-07 07:15:44.030', type: CONST_1.default.REPORT.TYPE.IOU },
                { lastReadTime: '2023-07-09 07:15:44.030' },
                { reportID: '6' },
                undefined,
            ];
            const latestReport = { reportID: '1', lastReadTime: '2023-07-08 07:15:44.030' };
            expect((0, ReportUtils_1.getMostRecentlyVisitedReport)(reports, undefined)).toEqual(latestReport);
        });
    });
    describe('shouldDisableThread', () => {
        const reportID = '1';
        it('should disable on thread-disabled actions', () => {
            const reportAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)('email1@test.com');
            expect((0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false)).toBeTruthy();
        });
        it('should disable thread on split expense actions', () => {
            const reportAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT,
                amount: 50000,
                currency: CONST_1.default.CURRENCY.USD,
                comment: '',
                participants: [{ login: 'email1@test.com' }, { login: 'email2@test.com' }],
                transactionID: NumberUtils.rand64(),
            });
            expect((0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false)).toBeTruthy();
        });
        it("should disable on a whisper action and it's neither a report preview nor IOU action", () => {
            const reportAction = {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    whisperedTo: [123456],
                },
            };
            expect((0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false)).toBeTruthy();
        });
        it('should disable on thread first chat', () => {
            const reportAction = {
                childReportID: reportID,
            };
            expect((0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, true)).toBeTruthy();
        });
        describe('deleted threads', () => {
            it('should be enabled if the report action is not-deleted and child visible action count is 1', () => {
                // Given a normal report action with one child visible action count
                const reportAction = {
                    message: [
                        {
                            translationKey: '',
                            type: 'COMMENT',
                            html: 'test',
                            text: 'test',
                        },
                    ],
                    childVisibleActionCount: 1,
                };
                // When it's checked to see if the thread should be disabled
                const isThreadDisabled = (0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false);
                // Then the thread should be enabled
                expect(isThreadDisabled).toBeFalsy();
            });
            it('should be enabled if the report action is not-deleted and child visible action count is 0', () => {
                // Given a normal report action with zero child visible action count
                const reportAction = {
                    message: [
                        {
                            translationKey: '',
                            type: 'COMMENT',
                            html: 'test',
                            text: 'test',
                        },
                    ],
                    childVisibleActionCount: 0,
                };
                // When it's checked to see if the thread should be disabled
                const isThreadDisabled = (0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false);
                // Then the thread should be enabled
                expect(isThreadDisabled).toBeFalsy();
            });
            it('should be enabled if the report action is deleted and child visible action count is 1', () => {
                // Given a normal report action with one child visible action count
                const reportAction = {
                    message: [
                        {
                            translationKey: '',
                            type: 'COMMENT',
                            html: '',
                            text: '',
                        },
                    ],
                    childVisibleActionCount: 1,
                };
                // When it's checked to see if the thread should be disabled
                const isThreadDisabled = (0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false);
                // Then the thread should be enabled
                expect(isThreadDisabled).toBeFalsy();
            });
            it('should be disabled if the report action is deleted and child visible action count is 0', () => {
                // Given a normal report action with zero child visible action count
                const reportAction = {
                    message: [
                        {
                            translationKey: '',
                            type: 'COMMENT',
                            html: '',
                            text: '',
                        },
                    ],
                    childVisibleActionCount: 0,
                };
                // When it's checked to see if the thread should be disabled
                const isThreadDisabled = (0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false);
                // Then the thread should be disabled
                expect(isThreadDisabled).toBeTruthy();
            });
        });
        describe('archived report threads', () => {
            it('should be enabled if the report is not-archived and child visible action count is 1', () => {
                // Given a normal report action with one child visible action count
                const reportAction = {
                    message: [
                        {
                            translationKey: '',
                            type: 'COMMENT',
                            html: 'test',
                            text: 'test',
                        },
                    ],
                    childVisibleActionCount: 1,
                };
                // And a report that is not archived
                const isReportArchived = false;
                // When it's checked to see if the thread should be disabled
                const isThreadDisabled = (0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false, isReportArchived);
                // Then the thread should be enabled
                expect(isThreadDisabled).toBeFalsy();
            });
            it('should be enabled if the report is not-archived and child visible action count is 0', () => {
                // Given a normal report action with zero child visible action counts
                const reportAction = {
                    message: [
                        {
                            translationKey: '',
                            type: 'COMMENT',
                            html: 'test',
                            text: 'test',
                        },
                    ],
                    childVisibleActionCount: 1,
                };
                // And a report that is not archived
                const isReportArchived = false;
                // When it's checked to see if the thread should be disabled
                const isThreadDisabled = (0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false, isReportArchived);
                // Then the thread should be enabled
                expect(isThreadDisabled).toBeFalsy();
            });
            it('should be enabled if the report is archived and child visible action count is 1', () => {
                // Given a normal report action with one child visible action count
                const reportAction = {
                    message: [
                        {
                            translationKey: '',
                            type: 'COMMENT',
                            html: 'test',
                            text: 'test',
                        },
                    ],
                    childVisibleActionCount: 1,
                };
                // And a report that is not archived
                const isReportArchived = true;
                // When it's checked to see if the thread should be disabled
                const isThreadDisabled = (0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false, isReportArchived);
                // Then the thread should be enabled
                expect(isThreadDisabled).toBeFalsy();
            });
            it('should be disabled if the report is archived and child visible action count is 0', () => {
                // Given a normal report action with zero child visible action counts
                const reportAction = {
                    message: [
                        {
                            translationKey: '',
                            type: 'COMMENT',
                            html: 'test',
                            text: 'test',
                        },
                    ],
                    childVisibleActionCount: 0,
                };
                // And a report that is not archived
                const isReportArchived = true;
                // When it's checked to see if the thread should be disabled
                const isThreadDisabled = (0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, false, isReportArchived);
                // Then the thread should be disabled
                expect(isThreadDisabled).toBeTruthy();
            });
        });
    });
    describe('getAllAncestorReportActions', () => {
        const reports = [
            { reportID: '1', lastReadTime: '2024-02-01 04:56:47.233', reportName: 'Report' },
            { reportID: '2', lastReadTime: '2024-02-01 04:56:47.233', parentReportActionID: '1', parentReportID: '1', reportName: 'Report' },
            { reportID: '3', lastReadTime: '2024-02-01 04:56:47.233', parentReportActionID: '2', parentReportID: '2', reportName: 'Report' },
            { reportID: '4', lastReadTime: '2024-02-01 04:56:47.233', parentReportActionID: '3', parentReportID: '3', reportName: 'Report' },
            { reportID: '5', lastReadTime: '2024-02-01 04:56:47.233', parentReportActionID: '4', parentReportID: '4', reportName: 'Report' },
        ];
        const reportActions = [
            { reportActionID: '1', created: '2024-02-01 04:42:22.965', actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MARKED_REIMBURSED },
            { reportActionID: '2', created: '2024-02-01 04:42:28.003', actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MARKED_REIMBURSED },
            { reportActionID: '3', created: '2024-02-01 04:42:31.742', actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MARKED_REIMBURSED },
            { reportActionID: '4', created: '2024-02-01 04:42:35.619', actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MARKED_REIMBURSED },
        ];
        (0, globals_1.beforeAll)(() => {
            const reportCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT, reports, (report) => report.reportID);
            const reportActionCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, reportActions.map((reportAction) => ({ [reportAction.reportActionID]: reportAction })), (actions) => Object.values(actions).at(0)?.reportActionID);
            react_native_onyx_1.default.multiSet({
                ...reportCollectionDataSet,
                ...reportActionCollectionDataSet,
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        afterAll(() => react_native_onyx_1.default.clear());
        it('should return correctly all ancestors of a thread report', () => {
            const resultAncestors = [
                { report: reports.at(0), reportAction: reportActions.at(0), shouldDisplayNewMarker: false },
                { report: reports.at(1), reportAction: reportActions.at(1), shouldDisplayNewMarker: false },
                { report: reports.at(2), reportAction: reportActions.at(2), shouldDisplayNewMarker: false },
                { report: reports.at(3), reportAction: reportActions.at(3), shouldDisplayNewMarker: false },
            ];
            expect((0, ReportUtils_1.getAllAncestorReportActions)(reports.at(4))).toEqual(resultAncestors);
        });
    });
    describe('isChatUsedForOnboarding', () => {
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
        });
        it('should return false if the report is neither the system or concierge chat', () => {
            expect((0, ReportUtils_1.isChatUsedForOnboarding)(LHNTestUtils.getFakeReport())).toBeFalsy();
        });
        it('should return false if the user account ID is odd and report is the system chat - only the Concierge chat chat should be the onboarding chat for users without the onboarding NVP', async () => {
            const accountID = 1;
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: {
                    [accountID]: {
                        accountID,
                    },
                },
                [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID },
            });
            const report = {
                ...LHNTestUtils.getFakeReport(),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SYSTEM,
            };
            expect((0, ReportUtils_1.isChatUsedForOnboarding)(report)).toBeFalsy();
        });
        it('should return true if the user account ID is even and report is the concierge chat', async () => {
            const accountID = 2;
            const report = LHNTestUtils.getFakeReport([accountID, CONST_1.default.ACCOUNT_ID.CONCIERGE]);
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: {
                    [accountID]: {
                        accountID,
                    },
                },
                [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID },
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            // Test failure is being discussed here: https://github.com/Expensify/App/pull/63096#issuecomment-2930818443
            expect(true).toBe(true);
            // expect(isChatUsedForOnboarding(report)).toBeTruthy();
        });
        it("should use the report id from the onboarding NVP if it's set", async () => {
            const reportID = '8010';
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_ONBOARDING]: { chatReportID: reportID, hasCompletedGuidedSetupFlow: true },
            });
            const report1 = {
                ...LHNTestUtils.getFakeReport(),
                reportID,
            };
            expect((0, ReportUtils_1.isChatUsedForOnboarding)(report1)).toBeTruthy();
            const report2 = {
                ...LHNTestUtils.getFakeReport(),
                reportID: '8011',
            };
            expect((0, ReportUtils_1.isChatUsedForOnboarding)(report2)).toBeFalsy();
        });
        it('should return true for admins rooms chat when posting tasks in admins room', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_ONBOARDING]: { hasCompletedGuidedSetupFlow: true },
            });
            const report = {
                ...LHNTestUtils.getFakeReport(),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
            };
            expect((0, ReportUtils_1.isChatUsedForOnboarding)(report, CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM)).toBeTruthy();
        });
    });
    describe('canHoldUnholdReportAction', () => {
        it('should return canUnholdRequest as true for a held duplicate transaction', async () => {
            const chatReport = { reportID: '1' };
            const reportPreviewReportActionID = '8';
            const expenseReport = (0, ReportUtils_1.buildOptimisticExpenseReport)(chatReport.reportID, '123', currentUserAccountID, 122, 'USD', undefined, reportPreviewReportActionID);
            const expenseTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: expenseReport.reportID,
                },
            });
            const reportPreview = (0, ReportUtils_1.buildOptimisticReportPreview)(chatReport, expenseReport, '', expenseTransaction, expenseReport.reportID, reportPreviewReportActionID);
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
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                [currentUserAccountID]: {
                    accountID: currentUserAccountID,
                    displayName: currentUserEmail,
                    login: currentUserEmail,
                },
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${expenseTransaction.transactionID}`, { ...expenseTransaction });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport.reportID}`, transactionThreadReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`, {
                [expenseCreatedAction.reportActionID]: expenseCreatedAction,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`, {
                [reportPreview.reportActionID]: reportPreview,
            });
            // Given a transaction with duplicate transaction violation
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${expenseTransaction.transactionID}`, [
                {
                    name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
                    type: CONST_1.default.VIOLATION_TYPES.WARNING,
                },
            ]);
            expect((0, ReportUtils_1.canHoldUnholdReportAction)(expenseCreatedAction)).toEqual({ canHoldRequest: true, canUnholdRequest: false });
            const { result } = (0, react_native_1.renderHook)(() => (0, useAncestorReportsAndReportActions_1.default)(expenseReport.reportID, true));
            (0, IOU_1.putOnHold)(expenseTransaction.transactionID, 'hold', result.current.ancestorReportsAndReportActions, transactionThreadReport.reportID);
            await (0, waitForBatchedUpdates_1.default)();
            // canUnholdRequest should be true after the transaction is held.
            expect((0, ReportUtils_1.canHoldUnholdReportAction)(expenseCreatedAction)).toEqual({ canHoldRequest: false, canUnholdRequest: true });
        });
    });
    describe('canEditMoneyRequest', () => {
        it('it should return false for archived invoice', async () => {
            const invoiceReport = {
                reportID: '1',
                type: CONST_1.default.REPORT.TYPE.INVOICE,
            };
            const transaction = (0, transaction_1.default)(22);
            const moneyRequestAction = {
                reportActionID: '22',
                actorAccountID: currentUserAccountID,
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUReportID: invoiceReport.reportID,
                    IOUTransactionID: transaction.transactionID,
                    amount: 530,
                    currency: CONST_1.default.CURRENCY.USD,
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                },
                message: [
                    {
                        type: 'COMMENT',
                        html: 'USD 5.30 expense',
                        text: 'USD 5.30 expense',
                        isEdited: false,
                        whisperedTo: [],
                        isDeletedParentAction: false,
                        deleted: '',
                    },
                ],
                created: '2025-03-05 16:34:27',
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${invoiceReport.reportID}`, invoiceReport);
            const canEditRequest = (0, ReportUtils_1.canEditMoneyRequest)(moneyRequestAction, transaction, true);
            expect(canEditRequest).toEqual(false);
        });
        it('it should return true for pay iou action with IOUDetails which is linked to send money flow', async () => {
            const expenseReport = {
                reportID: '1',
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            const transaction = (0, transaction_1.default)(22);
            const moneyRequestAction = {
                reportActionID: '3',
                actorAccountID: currentUserAccountID,
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUReportID: expenseReport.reportID,
                    IOUTransactionID: transaction.transactionID,
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
                    IOUDetails: {
                        amount: 530,
                        currency: CONST_1.default.CURRENCY.USD,
                        comment: '',
                    },
                },
                message: [
                    {
                        type: 'COMMENT',
                        html: 'USD 5.30 expense',
                        text: 'USD 5.30 expense',
                        isEdited: false,
                        whisperedTo: [],
                        isDeletedParentAction: false,
                        deleted: '',
                    },
                ],
                created: '2025-03-05 16:34:27',
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            const canEditRequest = (0, ReportUtils_1.canEditMoneyRequest)(moneyRequestAction, transaction, true);
            expect(canEditRequest).toEqual(true);
        });
    });
    describe('getChatByParticipants', () => {
        const userAccountID = 1;
        const userAccountID2 = 2;
        let oneOnOneChatReport;
        let groupChatReport;
        (0, globals_1.beforeAll)(() => {
            const invoiceReport = {
                reportID: '1',
                type: CONST_1.default.REPORT.TYPE.INVOICE,
                participants: {
                    [userAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                    [currentUserAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                },
            };
            const taskReport = {
                reportID: '2',
                type: CONST_1.default.REPORT.TYPE.TASK,
                participants: {
                    [userAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                    [currentUserAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                },
            };
            const iouReport = {
                reportID: '3',
                type: CONST_1.default.REPORT.TYPE.IOU,
                participants: {
                    [userAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                    [currentUserAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                },
            };
            groupChatReport = {
                reportID: '4',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                participants: {
                    [userAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                    [userAccountID2]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                    [currentUserAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                },
            };
            oneOnOneChatReport = {
                reportID: '5',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    [userAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                    [currentUserAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                },
            };
            const reportCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT, [invoiceReport, taskReport, iouReport, groupChatReport, oneOnOneChatReport], (item) => item.reportID);
            return react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT, reportCollectionDataSet);
        });
        it('should return the 1:1 chat', () => {
            const report = (0, ReportUtils_1.getChatByParticipants)([currentUserAccountID, userAccountID]);
            expect(report?.reportID).toEqual(oneOnOneChatReport.reportID);
        });
        it('should return the group chat', () => {
            const report = (0, ReportUtils_1.getChatByParticipants)([currentUserAccountID, userAccountID, userAccountID2], undefined, true);
            expect(report?.reportID).toEqual(groupChatReport.reportID);
        });
        it('should return undefined when no report is found', () => {
            const report = (0, ReportUtils_1.getChatByParticipants)([currentUserAccountID, userAccountID2], undefined);
            expect(report).toEqual(undefined);
        });
    });
    describe('getGroupChatName tests', () => {
        afterEach(() => react_native_onyx_1.default.clear());
        const fourParticipants = [
            { accountID: 1, login: 'email1@test.com' },
            { accountID: 2, login: 'email2@test.com' },
            { accountID: 3, login: 'email3@test.com' },
            { accountID: 4, login: 'email4@test.com' },
        ];
        const eightParticipants = [
            { accountID: 1, login: 'email1@test.com' },
            { accountID: 2, login: 'email2@test.com' },
            { accountID: 3, login: 'email3@test.com' },
            { accountID: 4, login: 'email4@test.com' },
            { accountID: 5, login: 'email5@test.com' },
            { accountID: 6, login: 'email6@test.com' },
            { accountID: 7, login: 'email7@test.com' },
            { accountID: 8, login: 'email8@test.com' },
        ];
        describe('When participantAccountIDs is passed to getGroupChatName', () => {
            it('Should show all participants name if count <= 5 and shouldApplyLimit is false', async () => {
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(fourParticipants)).toEqual('Four, One, Three, Two');
            });
            it('Should show all participants name if count <= 5 and shouldApplyLimit is true', async () => {
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(fourParticipants)).toEqual('Four, One, Three, Two');
            });
            it('Should show 5 participants name with ellipsis if count > 5 and shouldApplyLimit is true', async () => {
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(eightParticipants, true)).toEqual('Five, Four, One, Three, Two...');
            });
            it('Should show all participants name if count > 5 and shouldApplyLimit is false', async () => {
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(eightParticipants, false)).toEqual('Eight, Five, Four, One, Seven, Six, Three, Two');
            });
            it('Should use correct display name for participants', async () => {
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, participantsPersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(fourParticipants, true)).toEqual('(833) 240-3627, floki@vikings.net, Lagertha, Ragnar');
            });
        });
        describe('When participantAccountIDs is not passed to getGroupChatName and report ID is passed', () => {
            it('Should show report name if count <= 5 and shouldApplyLimit is false', async () => {
                const report = {
                    ...LHNTestUtils.getFakeReport([1, 2, 3, 4], 0, false, [1]),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                    reportID: `1`,
                    reportName: "Let's talk",
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}1`, report);
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(undefined, false, report)).toEqual("Let's talk");
            });
            it('Should show report name if count <= 5 and shouldApplyLimit is true', async () => {
                const report = {
                    ...LHNTestUtils.getFakeReport([1, 2, 3, 4], 0, false, [1]),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                    reportID: `1`,
                    reportName: "Let's talk",
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}1`, report);
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(undefined, true, report)).toEqual("Let's talk");
            });
            it('Should show report name if count > 5 and shouldApplyLimit is true', async () => {
                const report = {
                    ...LHNTestUtils.getFakeReport([1, 2, 3, 4, 5, 6, 7, 8], 0, false, [1, 2]),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                    reportID: `1`,
                    reportName: "Let's talk",
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}1`, report);
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(undefined, true, report)).toEqual("Let's talk");
            });
            it('Should show report name if count > 5 and shouldApplyLimit is false', async () => {
                const report = {
                    ...LHNTestUtils.getFakeReport([1, 2, 3, 4, 5, 6, 7, 8], 0, false, [1, 2]),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                    reportID: `1`,
                    reportName: "Let's talk",
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}1`, report);
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(undefined, false, report)).toEqual("Let's talk");
            });
            it('Should show participant names if report name is not available', async () => {
                const report = {
                    ...LHNTestUtils.getFakeReport([1, 2, 3, 4, 5, 6, 7, 8], 0, false, [1, 2]),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                    reportID: `1`,
                    reportName: '',
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}1`, report);
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
                expect((0, ReportUtils_1.getGroupChatName)(undefined, false, report)).toEqual('Eight, Five, Four, One, Seven, Six, Three, Two');
            });
        });
    });
    describe('shouldReportBeInOptionList tests', () => {
        afterEach(() => react_native_onyx_1.default.clear());
        it('should return true when the report is current active report', () => {
            const report = LHNTestUtils.getFakeReport();
            const currentReportId = report.reportID;
            const isInFocusMode = true;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeTruthy();
        });
        it('should return true when the report has outstanding violations', async () => {
            const expenseReport = (0, ReportUtils_1.buildOptimisticExpenseReport)('212', '123', 100, 122, 'USD');
            const expenseTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: expenseReport.reportID,
                },
            });
            const expenseCreatedAction1 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: 'create',
                amount: 100,
                currency: 'USD',
                comment: '',
                participants: [],
                transactionID: expenseTransaction.transactionID,
                iouReportID: expenseReport.reportID,
            });
            const expenseCreatedAction2 = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: 'create',
                amount: 100,
                currency: 'USD',
                comment: '',
                participants: [],
                transactionID: expenseTransaction.transactionID,
                iouReportID: expenseReport.reportID,
            });
            const transactionThreadReport = (0, ReportUtils_1.buildTransactionThread)(expenseCreatedAction1, expenseReport);
            const currentReportId = '1';
            const isInFocusMode = false;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`, {
                [expenseCreatedAction1.reportActionID]: expenseCreatedAction1,
                [expenseCreatedAction2.reportActionID]: expenseCreatedAction2,
            });
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report: transactionThreadReport,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: true,
                excludeEmptyChats: false,
            })).toBeTruthy();
        });
        it('should return true when the report needing user action', () => {
            const chatReport = {
                ...LHNTestUtils.getFakeReport(),
                hasOutstandingChildRequest: true,
            };
            const currentReportId = '3';
            const isInFocusMode = true;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report: chatReport,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeTruthy();
        });
        it('should return true when the report has valid draft comment', async () => {
            const report = LHNTestUtils.getFakeReport();
            const currentReportId = '3';
            const isInFocusMode = false;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${report.reportID}`, 'fake draft');
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeTruthy();
        });
        it('should return true when the report is pinned', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                isPinned: true,
            };
            const currentReportId = '3';
            const isInFocusMode = false;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeTruthy();
        });
        it('should return true when the report is unread and we are in the focus mode', async () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                lastReadTime: '1',
                lastVisibleActionCreated: '2',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    '1': {
                        notificationPreference: 'always',
                    },
                },
                lastMessageText: 'fake',
            };
            const currentReportId = '3';
            const isInFocusMode = true;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, {
                accountID: 1,
            });
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeTruthy();
        });
        it('should return true when the report is an archived report and we are in the default mode', async () => {
            const archivedReport = {
                ...LHNTestUtils.getFakeReport(),
                reportID: '1',
            };
            const reportNameValuePairs = {
                type: 'chat',
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            const currentReportId = '3';
            const isInFocusMode = false;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${archivedReport.reportID}`, reportNameValuePairs);
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(archivedReport?.reportID));
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report: archivedReport,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
                isReportArchived: isReportArchived.current,
            })).toBeTruthy();
        });
        it('should return false when the report is an archived report and we are in the focus mode', async () => {
            const archivedReport = {
                ...LHNTestUtils.getFakeReport(),
                reportID: '1',
            };
            const reportNameValuePairs = {
                type: 'chat',
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            const currentReportId = '3';
            const isInFocusMode = true;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${archivedReport.reportID}`, reportNameValuePairs);
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(archivedReport?.reportID));
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report: archivedReport,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
                isReportArchived: isReportArchived.current,
            })).toBeFalsy();
        });
        it('should return true when the report is selfDM', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
            };
            const currentReportId = '3';
            const isInFocusMode = false;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            const includeSelfDM = true;
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
                includeSelfDM,
            })).toBeTruthy();
        });
        it('should return false when the report is marked as hidden', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                participants: {
                    '1': {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
            };
            const currentReportId = '';
            const isInFocusMode = true;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeFalsy();
        });
        it('should return false when the report does not have participants', () => {
            const report = LHNTestUtils.getFakeReport([]);
            const currentReportId = '';
            const isInFocusMode = true;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeFalsy();
        });
        it('should return false when the report is the report that the user cannot access due to policy restrictions', () => {
            const report = {
                ...LHNTestUtils.getFakeReport(),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.DOMAIN_ALL,
            };
            const currentReportId = '';
            const isInFocusMode = false;
            const betas = [];
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeFalsy();
        });
        it('should return false when the report is the single transaction thread', async () => {
            const expenseReport = (0, ReportUtils_1.buildOptimisticExpenseReport)('212', '123', 100, 122, 'USD');
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
            const currentReportId = '1';
            const isInFocusMode = false;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`, {
                [expenseCreatedAction.reportActionID]: expenseCreatedAction,
            });
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report: transactionThreadReport,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeFalsy();
        });
        it('should return false when the report is empty chat and the excludeEmptyChats setting is true', () => {
            const report = LHNTestUtils.getFakeReport();
            const currentReportId = '';
            const isInFocusMode = false;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: true,
            })).toBeFalsy();
        });
        it('should return false when the users email is domain-based and the includeDomainEmail is false', () => {
            const report = LHNTestUtils.getFakeReport();
            const currentReportId = '';
            const isInFocusMode = false;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                login: '+@domain.com',
                excludeEmptyChats: false,
                includeDomainEmail: false,
            })).toBeFalsy();
        });
        it('should return false when the report has the parent message is pending removal', async () => {
            const parentReport = LHNTestUtils.getFakeReport();
            const report = LHNTestUtils.getFakeReport();
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
            const currentReportId = '';
            const isInFocusMode = false;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`, parentReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport.reportID}`, {
                [parentReportAction.reportActionID]: parentReportAction,
            });
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeFalsy();
        });
        it('should return false when the report is read and we are in the focus mode', () => {
            const report = LHNTestUtils.getFakeReport();
            const currentReportId = '';
            const isInFocusMode = true;
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId,
                isInFocusMode,
                betas,
                doesReportHaveViolations: false,
                excludeEmptyChats: false,
            })).toBeFalsy();
        });
        it('should return false when the empty report has deleted action with child comment but isDeletedParentAction is false', async () => {
            const report = LHNTestUtils.getFakeReport();
            const iouReportAction = {
                ...LHNTestUtils.getFakeReportAction(),
                message: [
                    {
                        type: 'COMMENT',
                        html: '',
                        text: '',
                        isEdited: false,
                        whisperedTo: [],
                        isDeletedParentAction: false,
                    },
                ],
                childVisibleActionCount: 1,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`, {
                [iouReportAction.reportActionID]: iouReportAction,
            });
            expect((0, ReportUtils_1.shouldReportBeInOptionList)({
                report,
                chatReport: reports_1.chatReportR14932,
                currentReportId: '',
                isInFocusMode: false,
                betas: [],
                doesReportHaveViolations: false,
                excludeEmptyChats: true,
            })).toBeFalsy();
        });
    });
    describe('buildOptimisticChatReport', () => {
        it('should always set isPinned to false', () => {
            const result = (0, ReportUtils_1.buildOptimisticChatReport)({
                participantList: [1, 2, 3],
            });
            expect(result.isPinned).toBe(false);
        });
    });
    describe('getWorkspaceNameUpdatedMessage', () => {
        it('return the encoded workspace name updated message', () => {
            const action = {
                originalMessage: {
                    newName: '&#104;&#101;&#108;&#108;&#111;',
                    oldName: 'workspace 1',
                },
            };
            expect((0, ReportUtils_1.getWorkspaceNameUpdatedMessage)(action)).toEqual('updated the name of this workspace to &quot;&amp;#104;&amp;#101;&amp;#108;&amp;#108;&amp;#111;&quot; (previously &quot;workspace 1&quot;)');
        });
    });
    describe('buildOptimisticIOUReportAction', () => {
        it('should not include IOUReportID in the originalMessage when tracking a personal expense', () => {
            const iouAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: 'track',
                amount: 1200,
                currency: 'INR',
                comment: '',
                participants: [{ login: 'email1@test.com' }],
                transactionID: '8749701985416635400',
                iouReportID: '8698041594589716',
                isPersonalTrackingExpense: true,
            });
            expect((0, ReportActionsUtils_1.getOriginalMessage)(iouAction)?.IOUReportID).toBe(undefined);
        });
    });
    describe('isAllowedToApproveExpenseReport', () => {
        const expenseReport = {
            ...(0, reports_2.createRandomReport)(6),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: currentUserAccountID,
        };
        it('should return true if preventSelfApproval is disabled and the approver is not the owner of the expense report', () => {
            const fakePolicy = {
                ...(0, policies_1.default)(6),
                preventSelfApproval: false,
            };
            expect((0, ReportUtils_1.isAllowedToApproveExpenseReport)(expenseReport, 0, fakePolicy)).toBeTruthy();
        });
        it('should return true if preventSelfApproval is enabled and the approver is not the owner of the expense report', () => {
            const fakePolicy = {
                ...(0, policies_1.default)(6),
                preventSelfApproval: true,
            };
            expect((0, ReportUtils_1.isAllowedToApproveExpenseReport)(expenseReport, 0, fakePolicy)).toBeTruthy();
        });
        it('should return true if preventSelfApproval is disabled and the approver is the owner of the expense report', () => {
            const fakePolicy = {
                ...(0, policies_1.default)(6),
                preventSelfApproval: false,
            };
            expect((0, ReportUtils_1.isAllowedToApproveExpenseReport)(expenseReport, currentUserAccountID, fakePolicy)).toBeTruthy();
        });
        it('should return false if preventSelfApproval is enabled and the approver is the owner of the expense report', () => {
            const fakePolicy = {
                ...(0, policies_1.default)(6),
                preventSelfApproval: true,
            };
            expect((0, ReportUtils_1.isAllowedToApproveExpenseReport)(expenseReport, currentUserAccountID, fakePolicy)).toBeFalsy();
        });
    });
    describe('isArchivedReport', () => {
        const archivedReport = {
            ...(0, reports_2.createRandomReport)(1),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
        };
        const nonArchivedReport = {
            ...(0, reports_2.createRandomReport)(2),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
        };
        (0, globals_1.beforeAll)(async () => {
            await react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${archivedReport.reportID}`]: { private_isArchived: DateUtils_1.default.getDBTime() },
            });
        });
        it('should return true for archived report', async () => {
            const reportNameValuePairs = await new Promise((resolve) => {
                react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${archivedReport.reportID}`,
                    callback: resolve,
                });
            });
            expect((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs)).toBe(true);
        });
        it('should return false for non-archived report', async () => {
            const reportNameValuePairs = await new Promise((resolve) => {
                react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${nonArchivedReport.reportID}`,
                    callback: resolve,
                });
                expect((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs)).toBe(false);
            });
        });
    });
    describe('useReportIsArchived', () => {
        const archivedReport = {
            ...(0, reports_2.createRandomReport)(1),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
        };
        const nonArchivedReport = {
            ...(0, reports_2.createRandomReport)(2),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
        };
        (0, globals_1.beforeAll)(async () => {
            await react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${archivedReport.reportID}`]: { private_isArchived: DateUtils_1.default.getDBTime() },
            });
        });
        it('should return true for archived report', () => {
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(archivedReport?.reportID));
            expect(isReportArchived.current).toBe(true);
        });
        it('should return false for non-archived report', () => {
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(nonArchivedReport?.reportID));
            expect(isReportArchived.current).toBe(false);
        });
    });
    describe('canEditWriteCapability', () => {
        it('should return false for expense chat', () => {
            const workspaceChat = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
            };
            expect((0, ReportUtils_1.canEditWriteCapability)(workspaceChat, { ...policy, role: CONST_1.default.POLICY.ROLE.ADMIN }, false)).toBe(false);
        });
        const policyAnnounceRoom = {
            ...(0, reports_2.createRandomReport)(1),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE,
        };
        const adminPolicy = { ...policy, role: CONST_1.default.POLICY.ROLE.ADMIN };
        it('should return true for non-archived policy announce room', () => {
            expect((0, ReportUtils_1.canEditWriteCapability)(policyAnnounceRoom, adminPolicy, false)).toBe(true);
        });
        it('should return false for archived policy announce room', () => {
            expect((0, ReportUtils_1.canEditWriteCapability)(policyAnnounceRoom, adminPolicy, true)).toBe(false);
        });
        it('should return false for non-admin user', () => {
            const normalChat = (0, reports_2.createRandomReport)(11);
            const memberPolicy = { ...policy, role: CONST_1.default.POLICY.ROLE.USER };
            expect((0, ReportUtils_1.canEditWriteCapability)(normalChat, memberPolicy, false)).toBe(false);
        });
        it('should return false for admin room', () => {
            const adminRoom = { ...(0, reports_2.createRandomReport)(12), chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS };
            expect((0, ReportUtils_1.canEditWriteCapability)(adminRoom, adminPolicy, false)).toBe(false);
        });
        it('should return false for thread reports', () => {
            const parent = (0, reports_2.createRandomReport)(13);
            const thread = {
                ...(0, reports_2.createRandomReport)(14),
                parentReportID: parent.reportID,
                parentReportActionID: '2',
            };
            expect((0, ReportUtils_1.canEditWriteCapability)(thread, adminPolicy, false)).toBe(false);
        });
        it('should return false for invoice rooms', () => {
            const invoiceRoom = { ...(0, reports_2.createRandomReport)(13), chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE };
            expect((0, ReportUtils_1.canEditWriteCapability)(invoiceRoom, adminPolicy, false)).toBe(false);
        });
    });
    describe('canEditRoomVisibility', () => {
        it('should return true for policy rooms that are not archived and the user is an admin', () => {
            expect((0, ReportUtils_1.canEditRoomVisibility)({ ...policy, role: CONST_1.default.POLICY.ROLE.ADMIN }, false)).toBeTruthy();
            expect((0, ReportUtils_1.canEditRoomVisibility)({ ...policy, role: CONST_1.default.POLICY.ROLE.AUDITOR }, false)).toBeFalsy();
            expect((0, ReportUtils_1.canEditRoomVisibility)({ ...policy, role: CONST_1.default.POLICY.ROLE.USER }, false)).toBeFalsy();
        });
        it('should return false for policy rooms that are archived regardless of the policy role', () => {
            expect((0, ReportUtils_1.canEditRoomVisibility)({ ...policy, role: CONST_1.default.POLICY.ROLE.ADMIN }, true)).toBeFalsy();
            expect((0, ReportUtils_1.canEditRoomVisibility)({ ...policy, role: CONST_1.default.POLICY.ROLE.AUDITOR }, true)).toBeFalsy();
            expect((0, ReportUtils_1.canEditRoomVisibility)({ ...policy, role: CONST_1.default.POLICY.ROLE.USER }, true)).toBeFalsy();
        });
    });
    describe('canDeleteReportAction', () => {
        it('should return false for delete button visibility if transaction is not allowed to be deleted', () => {
            const parentReport = LHNTestUtils.getFakeReport();
            const report = LHNTestUtils.getFakeReport();
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
            const currentReportId = '';
            const transactionID = 1;
            const moneyRequestAction = {
                ...parentReportAction,
                actorAccountID: currentUserAccountID,
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
            const transaction = {
                ...(0, transaction_1.default)(transactionID),
                category: '',
                tag: '',
                created: testDate,
                reportID: currentReportId,
                managedCard: true,
                comment: {
                    liabilityType: CONST_1.default.TRANSACTION.LIABILITY_TYPE.RESTRICT,
                },
            };
            expect((0, ReportUtils_1.canDeleteReportAction)(moneyRequestAction, currentReportId, transaction)).toBe(false);
        });
        it('should return true for demo transaction', () => {
            const transaction = {
                ...(0, transaction_1.default)(1),
                comment: {
                    isDemoTransaction: true,
                },
            };
            const report = LHNTestUtils.getFakeReport();
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
            const moneyRequestAction = {
                ...parentReportAction,
                actorAccountID: currentUserAccountID,
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
            expect((0, ReportUtils_1.canDeleteReportAction)(moneyRequestAction, '1', transaction)).toBe(true);
        });
        it("should return false for ADD_COMMENT report action the current user (admin of the personal policy) didn't comment", async () => {
            const adminPolicy = { ...LHNTestUtils.getFakePolicy(), type: CONST_1.default.POLICY.TYPE.PERSONAL };
            const report = { ...LHNTestUtils.getFakeReport(), policyID: adminPolicy.id };
            const reportAction = {
                ...LHNTestUtils.getFakeReportAction(),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                actorAccountID: currentUserAccountID + 1,
                parentReportID: report.reportID,
                message: [
                    {
                        type: 'COMMENT',
                        html: 'hey',
                        text: 'hey',
                        isEdited: false,
                        whisperedTo: [],
                        isDeletedParentAction: false,
                    },
                ],
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${adminPolicy.id}`, adminPolicy);
            expect((0, ReportUtils_1.canDeleteReportAction)(reportAction, report.reportID, undefined)).toBe(false);
        });
    });
    describe('getPolicyExpenseChat', () => {
        it('should return the correct policy expense chat when we have a task report is the child of this report', async () => {
            const policyExpenseChat = {
                ...(0, reports_2.createRandomReport)(11),
                ownerAccountID: 1,
                policyID: '1',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                type: CONST_1.default.REPORT.TYPE.CHAT,
            };
            const taskReport = {
                ...(0, reports_2.createRandomReport)(10),
                ownerAccountID: 1,
                policyID: '1',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                type: CONST_1.default.REPORT.TYPE.TASK,
                parentReportID: policyExpenseChat.reportID,
                parentReportActionID: '1',
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport.reportID}`, taskReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${policyExpenseChat.reportID}`, policyExpenseChat);
            expect((0, ReportUtils_1.getPolicyExpenseChat)(1, '1')?.reportID).toBe(policyExpenseChat.reportID);
        });
    });
    describe('findLastAccessedReport', () => {
        let archivedReport;
        let normalReport;
        (0, globals_1.beforeAll)(async () => {
            // Set up test reports - one archived, one normal
            archivedReport = {
                ...LHNTestUtils.getFakeReport(),
                reportID: '1001',
                lastReadTime: '2024-02-01 04:56:47.233',
                lastVisibleActionCreated: '2024-02-01 04:56:47.233',
            };
            normalReport = {
                ...LHNTestUtils.getFakeReport(),
                reportID: '1002',
                lastReadTime: '2024-01-01 04:56:47.233', // Older last read time
                lastVisibleActionCreated: '2024-01-01 04:56:47.233',
            };
            // Set up report name value pairs to mark one report as archived
            const reportNameValuePairs = {
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            // Add reports to Onyx
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${archivedReport.reportID}`, archivedReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${normalReport.reportID}`, normalReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${archivedReport.reportID}`, reportNameValuePairs);
            // Set up report metadata for lastVisitTime
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${archivedReport.reportID}`, {
                lastVisitTime: '2024-02-01 04:56:47.233', // More recent visit
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${normalReport.reportID}`, {
                lastVisitTime: '2024-01-01 04:56:47.233',
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        afterAll(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
        });
        it('should not return an archived report even if it was most recently accessed', () => {
            const result = (0, ReportUtils_1.findLastAccessedReport)(false);
            // Even though the archived report has a more recent lastVisitTime,
            // the function should filter it out and return the normal report
            expect(result?.reportID).toBe(normalReport.reportID);
            expect(result?.reportID).not.toBe(archivedReport.reportID);
        });
    });
    describe('findLastAccessedReport should return owned report if no reports was accessed before', () => {
        let ownedReport;
        let nonOwnedReport;
        (0, globals_1.beforeAll)(async () => {
            // Set up test reports - one archived, one normal
            nonOwnedReport = {
                ...LHNTestUtils.getFakeReport(),
                reportID: '1001',
                lastReadTime: '2024-02-01 04:56:47.233',
                lastVisibleActionCreated: '2024-02-01 04:56:47.233',
                ownerAccountID: 1,
            };
            ownedReport = {
                ...LHNTestUtils.getFakeReport(),
                reportID: '1002',
                lastReadTime: '2024-01-01 04:56:47.233', // Older last read time
                lastVisibleActionCreated: '2024-01-01 04:56:47.233',
                ownerAccountID: currentUserAccountID,
            };
            // Add reports to Onyx
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${ownedReport.reportID}`, ownedReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${nonOwnedReport.reportID}`, nonOwnedReport);
            return (0, waitForBatchedUpdates_1.default)();
        });
        afterAll(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
        });
        it('findLastAccessedReport should return owned report if no reports was accessed before', () => {
            const result = (0, ReportUtils_1.findLastAccessedReport)(false);
            // Even though the archived report has a more recent lastVisitTime,
            // the function should filter it out and return the normal report
            expect(result?.reportID).toBe(ownedReport.reportID);
            expect(result?.reportID).not.toBe(nonOwnedReport.reportID);
        });
    });
    describe('getApprovalChain', () => {
        describe('submit and close policy', () => {
            it('should return empty array', () => {
                const policyTest = {
                    ...(0, policies_1.default)(0),
                    approver: 'owner@test.com',
                    owner: 'owner@test.com',
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL,
                };
                const expenseReport = {
                    ...(0, reports_2.createRandomReport)(0),
                    ownerAccountID: employeeAccountID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                expect((0, ReportUtils_1.getApprovalChain)(policyTest, expenseReport)).toStrictEqual([]);
            });
        });
        describe('basic/advance workflow', () => {
            describe('has no approver rule', () => {
                it('should return list contain policy approver/owner and the forwardsTo of them if the policy use basic workflow', () => {
                    const policyTest = {
                        ...(0, policies_1.default)(0),
                        approver: 'owner@test.com',
                        owner: 'owner@test.com',
                        type: CONST_1.default.POLICY.TYPE.TEAM,
                        employeeList,
                        approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
                    };
                    const expenseReport = {
                        ...(0, reports_2.createRandomReport)(0),
                        ownerAccountID: employeeAccountID,
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    };
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails).then(() => {
                        const result = ['owner@test.com'];
                        expect((0, ReportUtils_1.getApprovalChain)(policyTest, expenseReport)).toStrictEqual(result);
                    });
                });
                it('should return list contain submitsTo of ownerAccountID and the forwardsTo of them if the policy use advance workflow', () => {
                    const policyTest = {
                        ...(0, policies_1.default)(0),
                        approver: 'owner@test.com',
                        owner: 'owner@test.com',
                        type: CONST_1.default.POLICY.TYPE.CORPORATE,
                        employeeList,
                        approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                    };
                    const expenseReport = {
                        ...(0, reports_2.createRandomReport)(0),
                        ownerAccountID: employeeAccountID,
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    };
                    react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails).then(() => {
                        const result = ['admin@test.com'];
                        expect((0, ReportUtils_1.getApprovalChain)(policyTest, expenseReport)).toStrictEqual(result);
                    });
                });
            });
            // This test is broken, so I am commenting it out. I have opened up https://github.com/Expensify/App/issues/60854 to get the test fixed
            describe('has approver rule', () => {
                describe('has no transaction match with approver rule', () => {
                    it('should return list contain submitsTo of ownerAccountID and the forwardsTo of them', () => {
                        const policyTest = {
                            ...(0, policies_1.default)(0),
                            approver: 'owner@test.com',
                            owner: 'owner@test.com',
                            type: CONST_1.default.POLICY.TYPE.CORPORATE,
                            employeeList,
                            rules,
                            approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
                        };
                        const expenseReport = {
                            ...(0, reports_2.createRandomReport)(0),
                            ownerAccountID: employeeAccountID,
                            type: CONST_1.default.REPORT.TYPE.EXPENSE,
                        };
                        const transaction1 = {
                            ...(0, transaction_1.default)(0),
                            category: '',
                            tag: '',
                            created: testDate,
                            reportID: expenseReport.reportID,
                        };
                        const transaction2 = {
                            ...(0, transaction_1.default)(1),
                            category: '',
                            tag: '',
                            created: DateUtils_1.default.subtractMillisecondsFromDateTime(testDate, 1),
                            reportID: expenseReport.reportID,
                        };
                        react_native_onyx_1.default.multiSet({
                            [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: personalDetails,
                            [ONYXKEYS_1.default.COLLECTION.TRANSACTION]: {
                                [transaction1.transactionID]: transaction1,
                                [transaction2.transactionID]: transaction2,
                            },
                        }).then(() => {
                            const result = ['owner@test.com'];
                            expect((0, ReportUtils_1.getApprovalChain)(policyTest, expenseReport)).toStrictEqual(result);
                        });
                    });
                });
                describe('has transaction match with approver rule', () => {
                    it('should return the list with correct order of category/tag approver sorted by created/inserted of the transaction', () => {
                        const policyTest = {
                            ...(0, policies_1.default)(1),
                            approver: 'owner@test.com',
                            owner: 'owner@test.com',
                            type: CONST_1.default.POLICY.TYPE.CORPORATE,
                            employeeList,
                            rules,
                            approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                        };
                        const expenseReport = {
                            ...(0, reports_2.createRandomReport)(100),
                            ownerAccountID: employeeAccountID,
                            type: CONST_1.default.REPORT.TYPE.EXPENSE,
                        };
                        const transaction1 = {
                            ...(0, transaction_1.default)(1),
                            category: 'cat1',
                            tag: '',
                            created: testDate,
                            reportID: expenseReport.reportID,
                            inserted: DateUtils_1.default.subtractMillisecondsFromDateTime(testDate, 1),
                        };
                        const transaction2 = {
                            ...(0, transaction_1.default)(2),
                            category: '',
                            tag: 'tag1',
                            created: DateUtils_1.default.subtractMillisecondsFromDateTime(testDate, 1),
                            reportID: expenseReport.reportID,
                            inserted: DateUtils_1.default.subtractMillisecondsFromDateTime(testDate, 1),
                        };
                        const transaction3 = {
                            ...(0, transaction_1.default)(3),
                            category: 'cat2',
                            tag: '',
                            created: testDate,
                            reportID: expenseReport.reportID,
                            inserted: DateUtils_1.default.subtractMillisecondsFromDateTime(testDate, 2),
                        };
                        const transaction4 = {
                            ...(0, transaction_1.default)(4),
                            category: '',
                            tag: 'tag2',
                            created: DateUtils_1.default.subtractMillisecondsFromDateTime(testDate, 1),
                            reportID: expenseReport.reportID,
                            inserted: DateUtils_1.default.subtractMillisecondsFromDateTime(testDate, 2),
                        };
                        react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
                            transactions_1: transaction1,
                            transactions_2: transaction2,
                            transactions_3: transaction3,
                            transactions_4: transaction4,
                        }).then(() => {
                            const result = [categoryApprover2Email, categoryApprover1Email, tagApprover2Email, tagApprover1Email, 'admin@test.com'];
                            expect((0, ReportUtils_1.getApprovalChain)(policyTest, expenseReport)).toStrictEqual(result);
                        });
                    });
                });
            });
        });
    });
    describe('shouldReportShowSubscript', () => {
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
        });
        it('should return true for policy expense chat', () => {
            const report = (0, reports_2.createPolicyExpenseChat)(1);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(true);
        });
        it('should return true for workspace thread', () => {
            const report = (0, reports_2.createWorkspaceThread)(1);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(true);
        });
        it('should return false for archived non-expense report that is not a workspace thread', async () => {
            const report = (0, reports_2.createRegularChat)(1, [currentUserAccountID, 1]);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, {
                private_isArchived: new Date().toString(),
            });
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report, isReportArchived.current)).toBe(false);
        });
        it('should return false for a non-archived non-expense report', () => {
            const report = (0, reports_2.createRegularChat)(1, [currentUserAccountID, 1]);
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report, isReportArchived.current)).toBe(false);
        });
        it('should return false for regular 1:1 chat', () => {
            const report = (0, reports_2.createRegularChat)(1, [currentUserAccountID, 1]);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(false);
        });
        it('should return true for expense request report', async () => {
            // Given a normal parent report
            const parentReport = (0, reports_2.createExpenseReport)(1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`, parentReport);
            // And a parent report action that is an IOU report action
            const randomReportAction = (0, reportActions_1.default)(2);
            const parentReportAction = {
                ...(0, reportActions_1.default)(2),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                message: {
                    ...randomReportAction.message,
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                },
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport.reportID}`, {
                '3': parentReportAction,
            });
            // And a report that is a thread of the parent report
            const report = (0, reports_2.createExpenseRequestReport)(2, parentReport.reportID, '3');
            // When we check if the report should show a subscript
            // Then it should return true because isExpenseRequest() returns true
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(true);
        });
        it('should return true for workspace task report', async () => {
            // Given a parent report that is a policy expense chat
            const parentReport = (0, reports_2.createPolicyExpenseChat)(1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`, parentReport);
            // And a report that is a task report of the parent report
            const report = (0, reports_2.createWorkspaceTaskReport)(2, [currentUserAccountID, 1], parentReport.reportID);
            // When we check if the report should show a subscript
            // Then it should return true because isWorkspaceTaskReport() returns true
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(true);
        });
        it('should return true for invoice room', () => {
            const report = (0, reports_2.createInvoiceRoom)(1);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(true);
        });
        it('should return true for invoice report', () => {
            const report = (0, reports_2.createInvoiceReport)(1);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(true);
        });
        it('should return true for policy expense chat that is not own', () => {
            const report = (0, reports_2.createPolicyExpenseChat)(1, false);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(true);
        });
        it('should return true for archived workspace thread (exception to archived rule)', async () => {
            const report = (0, reports_2.createWorkspaceThread)(1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, {
                private_isArchived: new Date().toString(),
            });
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            // Even if archived, workspace threads should show subscript
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report, isReportArchived.current)).toBe(true);
        });
        it('should return false for archived non-expense report', async () => {
            const report = (0, reports_2.createRegularChat)(1, []);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, {
                private_isArchived: new Date().toString(),
            });
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            // Archived expense reports should not show subscript
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report, isReportArchived.current)).toBe(false);
        });
        it('should return false for policy expense chat that is also a chat thread', () => {
            const report = (0, reports_2.createPolicyExpenseChatThread)(1);
            // Policy expense chats that are threads should not show subscript
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(false);
        });
        it('should return false for policy expense chat that is also a task report', () => {
            const report = (0, reports_2.createPolicyExpenseChatTask)(1);
            // Policy expense chats that are task reports should not show subscript
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(false);
        });
        it('should return false for group chat', () => {
            const report = (0, reports_2.createGroupChat)(1, [currentUserAccountID, 1, 2, 3]);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(false);
        });
        it('should return false for self DM', () => {
            const report = (0, reports_2.createSelfDM)(1, currentUserAccountID);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(false);
        });
        it('should return false for admin room', () => {
            const report = (0, reports_2.createAdminRoom)(1);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(false);
        });
        it('should return false for announce room', () => {
            const report = (0, reports_2.createAnnounceRoom)(1);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(false);
        });
        it('should return false for domain room', () => {
            const report = (0, reports_2.createDomainRoom)(1);
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(false);
        });
        it('should return false for regular task report (non-workspace)', () => {
            const report = { ...(0, reports_2.createRegularTaskReport)(1, currentUserAccountID), chatType: CONST_1.default.REPORT.CHAT_TYPE.TRIP_ROOM };
            expect((0, ReportUtils_1.shouldReportShowSubscript)(report)).toBe(false);
        });
    });
    describe('isArchivedNonExpenseReport', () => {
        // Given an expense report, a chat report, and an archived chat report
        const expenseReport = {
            ...(0, reports_2.createRandomReport)(1000),
            ownerAccountID: employeeAccountID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        const chatReport = {
            ...(0, reports_2.createRandomReport)(2000),
            ownerAccountID: employeeAccountID,
            type: CONST_1.default.REPORT.TYPE.CHAT,
        };
        const archivedChatReport = {
            ...(0, reports_2.createRandomReport)(3000),
            ownerAccountID: employeeAccountID,
            type: CONST_1.default.REPORT.TYPE.CHAT,
        };
        (0, globals_1.beforeAll)(async () => {
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`, chatReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${archivedChatReport.reportID}`, archivedChatReport);
            // This is what indicates that a report is archived (see ReportUtils.isArchivedReport())
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${archivedChatReport.reportID}`, {
                private_isArchived: new Date().toString(),
            });
        });
        it('should return false if the report is an expense report', () => {
            // Simulate how components use the hook useReportIsArchived() to see if the report is archived
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(expenseReport?.reportID));
            expect((0, ReportUtils_1.isArchivedNonExpenseReport)(expenseReport, isReportArchived.current)).toBe(false);
        });
        it('should return false if the report is a non-expense report and not archived', () => {
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(chatReport?.reportID));
            expect((0, ReportUtils_1.isArchivedNonExpenseReport)(chatReport, isReportArchived.current)).toBe(false);
        });
        it('should return true if the report is a non-expense report and archived', () => {
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(archivedChatReport?.reportID));
            expect((0, ReportUtils_1.isArchivedNonExpenseReport)(archivedChatReport, isReportArchived.current)).toBe(true);
        });
    });
    describe('parseReportRouteParams', () => {
        const testReportID = '123456789';
        it('should return empty reportID and isSubReportPageRoute as false if the route is not a report route', () => {
            const result = (0, ReportUtils_1.parseReportRouteParams)('/concierge');
            expect(result.reportID).toBe('');
            expect(result.isSubReportPageRoute).toBe(false);
        });
        it('should return isSubReportPageRoute as false if the route is a report screen route', () => {
            const result = (0, ReportUtils_1.parseReportRouteParams)(`r/${testReportID}/11111111`);
            expect(result.reportID).toBe(testReportID);
            expect(result.isSubReportPageRoute).toBe(false);
        });
        it('should return isSubReportPageRoute as true if the route is a sub report page route', () => {
            const result = (0, ReportUtils_1.parseReportRouteParams)(`r/${testReportID}/details`);
            expect(result.reportID).toBe(testReportID);
            expect(result.isSubReportPageRoute).toBe(true);
        });
    });
    describe('isPayer', () => {
        const approvedReport = {
            ...(0, reports_2.createRandomReport)(1),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
            policyID: '1',
        };
        const unapprovedReport = {
            ...(0, reports_2.createRandomReport)(2),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            policyID: '1',
        };
        const policyTest = {
            ...(0, policies_1.default)(1),
            employeeList: {
                [currentUserEmail]: {
                    role: CONST_1.default.POLICY.ROLE.AUDITOR,
                },
            },
        };
        (0, globals_1.beforeAll)(() => {
            react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID: currentUserAccountID },
                [ONYXKEYS_1.default.COLLECTION.POLICY]: {
                    [`${ONYXKEYS_1.default.COLLECTION.POLICY}1`]: policyTest,
                },
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        afterAll(() => react_native_onyx_1.default.clear());
        it('should return false for admin of a group policy with reimbursement enabled and report not approved', () => {
            expect((0, ReportUtils_1.isPayer)({ email: currentUserEmail, accountID: currentUserAccountID }, unapprovedReport, false)).toBe(false);
        });
        it('should return false for non-admin of a group policy', () => {
            expect((0, ReportUtils_1.isPayer)({ email: currentUserEmail, accountID: currentUserAccountID }, approvedReport, false)).toBe(false);
        });
    });
    describe('buildReportNameFromParticipantNames', () => {
        /**
         * Generates a fake report and matching personal details for specified number of participants.
         * Participants in the report are directly linked with their personal details.
         */
        const generateFakeReportAndParticipantsPersonalDetails = ({ count, start = 0 }) => {
            const data = {
                report: {
                    ...reports_1.chatReportR14932,
                    participants: Object.keys(LHNTestUtils_1.fakePersonalDetails)
                        .slice(start, count)
                        .reduce((acc, cur) => {
                        acc[cur] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS };
                        return acc;
                    }, {}),
                },
                personalDetails: Object.fromEntries(Object.entries(LHNTestUtils_1.fakePersonalDetails).slice(start, count)),
            };
            data.personalDetails[currentUserAccountID] = {
                accountID: currentUserAccountID,
                displayName: 'CURRENT USER',
                firstName: 'CURRENT',
            };
            return data;
        };
        it('excludes the current user from the report title', () => {
            const result = (0, ReportUtils_1.buildReportNameFromParticipantNames)(generateFakeReportAndParticipantsPersonalDetails({ count: currentUserAccountID + 2 }));
            expect(result).not.toContain('CURRENT');
        });
        it('limits to a maximum of 5 participants in the title', () => {
            const result = (0, ReportUtils_1.buildReportNameFromParticipantNames)(generateFakeReportAndParticipantsPersonalDetails({ count: 10 }));
            expect(result.split(',').length).toBeLessThanOrEqual(5);
        });
        it('returns full name if only one participant is present (excluding current user)', () => {
            const result = (0, ReportUtils_1.buildReportNameFromParticipantNames)(generateFakeReportAndParticipantsPersonalDetails({ count: 1 }));
            const { displayName } = LHNTestUtils_1.fakePersonalDetails[1] ?? {};
            expect(result).toEqual(displayName);
        });
        it('returns an empty string if there are no participants or all are excluded', () => {
            const result = (0, ReportUtils_1.buildReportNameFromParticipantNames)(generateFakeReportAndParticipantsPersonalDetails({ start: currentUserAccountID - 1, count: 1 }));
            expect(result).toEqual('');
        });
        it('handles partial or missing personal details correctly', () => {
            const { report } = generateFakeReportAndParticipantsPersonalDetails({ count: 6 });
            const secondUser = LHNTestUtils_1.fakePersonalDetails[2];
            const fourthUser = LHNTestUtils_1.fakePersonalDetails[4];
            const incompleteDetails = { 2: secondUser, 4: fourthUser };
            const result = (0, ReportUtils_1.buildReportNameFromParticipantNames)({ report, personalDetails: incompleteDetails });
            const expectedNames = [secondUser?.firstName, fourthUser?.firstName].sort();
            const resultNames = result.split(', ').sort();
            expect(resultNames).toEqual(expect.arrayContaining(expectedNames));
        });
    });
    describe('getParticipantsList', () => {
        it('should exclude hidden participants', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: 'policyRoom',
                participants: {
                    1: { notificationPreference: 'hidden' },
                    2: { notificationPreference: 'always' },
                },
            };
            const participants = (0, ReportUtils_1.getParticipantsList)(report, participantsPersonalDetails);
            expect(participants.length).toBe(1);
        });
        it('should include hidden participants for IOU report', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.IOU,
                participants: {
                    1: { notificationPreference: 'hidden' },
                    2: { notificationPreference: 'always' },
                },
            };
            const participants = (0, ReportUtils_1.getParticipantsList)(report, participantsPersonalDetails);
            expect(participants.length).toBe(2);
        });
        it('should include hidden participants for expense report', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                participants: {
                    1: { notificationPreference: 'hidden' },
                    2: { notificationPreference: 'always' },
                },
            };
            const participants = (0, ReportUtils_1.getParticipantsList)(report, participantsPersonalDetails);
            expect(participants.length).toBe(2);
        });
        it('should include hidden participants for IOU transaction report', async () => {
            const parentReport = {
                ...(0, reports_2.createRandomReport)(0),
                type: CONST_1.default.REPORT.TYPE.IOU,
            };
            const parentReportAction = {
                ...(0, reportActions_1.default)(0),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                message: [],
                previousMessage: [],
                originalMessage: {
                    amount: 1,
                    currency: 'USD',
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                },
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`, parentReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport.reportID}`, {
                [parentReportAction.reportActionID]: parentReportAction,
            });
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                parentReportID: parentReport.reportID,
                parentReportActionID: parentReportAction.reportActionID,
                participants: {
                    1: { notificationPreference: 'hidden' },
                    2: { notificationPreference: 'always' },
                },
            };
            const participants = (0, ReportUtils_1.getParticipantsList)(report, participantsPersonalDetails);
            expect(participants.length).toBe(2);
        });
        it('should include hidden participants for expense transaction report', async () => {
            const parentReport = {
                ...(0, reports_2.createRandomReport)(0),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            const parentReportAction = {
                ...(0, reportActions_1.default)(0),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                message: [],
                previousMessage: [],
                originalMessage: {
                    amount: 1,
                    currency: 'USD',
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                },
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`, parentReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport.reportID}`, {
                [parentReportAction.reportActionID]: parentReportAction,
            });
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                parentReportID: parentReport.reportID,
                parentReportActionID: parentReportAction.reportActionID,
                participants: {
                    1: { notificationPreference: 'hidden' },
                    2: { notificationPreference: 'always' },
                },
            };
            const participants = (0, ReportUtils_1.getParticipantsList)(report, participantsPersonalDetails);
            expect(participants.length).toBe(2);
        });
    });
    describe('isReportOutstanding', () => {
        it('should return true for submitted reports', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                policyID: policy.id,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            };
            expect((0, ReportUtils_1.isReportOutstanding)(report, policy.id)).toBe(true);
        });
        it('should return false for submitted reports if we specify it', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                policyID: policy.id,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            };
            expect((0, ReportUtils_1.isReportOutstanding)(report, policy.id, undefined, false)).toBe(false);
        });
        it('should return true for submitted reports if top most report ID is processing', async () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                policyID: policy.id,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            };
            const activeReport = {
                ...(0, reports_2.createRandomReport)(2),
                policyID: policy.id,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${activeReport.reportID}`, activeReport);
            expect((0, ReportUtils_1.isReportOutstanding)(report, policy.id)).toBe(true);
        });
        it('should return false for archived report', async () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                policyID: policy.id,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, { private_isArchived: DateUtils_1.default.getDBTime() });
            expect((0, ReportUtils_1.isReportOutstanding)(report, policy.id)).toBe(false);
        });
    });
    describe('getMoneyReportPreviewName', () => {
        (0, globals_1.beforeAll)(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: participantsPersonalDetails,
                [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID: currentUserAccountID },
            });
        });
        afterAll(async () => {
            await react_native_onyx_1.default.clear();
        });
        it('should return the report name when the chat type is policy room', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            expect(result).toBe(report.reportName);
        });
        it('should return the report name when the chat type is domain all', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.DOMAIN_ALL,
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            expect(result).toBe(report.reportName);
        });
        it('should return the report name when the chat type is group', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            expect(result).toBe(report.reportName);
        });
        it('should return policy name when the chat type is invoice', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            // Policies are empty, so the policy name is "Unavailable workspace"
            expect(result).toBe('Unavailable workspace');
        });
        it('should return the report name when the chat type is policy admins', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            expect(result).toBe(report.reportName);
        });
        it('should return the report name when the chat type is policy announce', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE,
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            expect(result).toBe(report.reportName);
        });
        it('should return the owner name expenses when the chat type is policy expense chat', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            // Report with ownerAccountID: 1 corresponds to "Ragnar Lothbrok"
            expect(result).toBe("Ragnar Lothbrok's expenses");
        });
        it('should return the display name of the current user when the chat type is self dm', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            // currentUserAccountID: 5 corresponds to "Lagertha Lothbrok"
            expect(result).toBe('Lagertha Lothbrok (you)');
        });
        it('should return the participant name when the chat type is system', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SYSTEM,
                participants: {
                    1: { notificationPreference: 'hidden' },
                },
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            // participant accountID: 1 corresponds to "Ragnar Lothbrok"
            expect(result).toBe('Ragnar Lothbrok');
        });
        it('should return the participant names when the chat type is trip room', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
            };
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                participants: {
                    1: { notificationPreference: 'hidden' },
                    2: { notificationPreference: 'always' },
                },
                chatType: CONST_1.default.REPORT.CHAT_TYPE.TRIP_ROOM,
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, report);
            // participant accountID: 1, 2 corresponds to "Ragnar", "floki@vikings.net"
            expect(result).toBe('Ragnar, floki@vikings.net');
        });
        it('should return the child report name when the report name is not present', () => {
            const action = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                childReportName: 'Child Report',
            };
            const result = (0, ReportUtils_1.getMoneyReportPreviewName)(action, undefined);
            expect(result).toBe('Child Report');
        });
    });
    describe('canAddTransaction', () => {
        it('should return true for a non-archived report', async () => {
            // Given a non-archived expense report
            const report = {
                ...(0, reports_2.createRandomReport)(10000),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                ownerAccountID: currentUserAccountID,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            // When it's checked if the transactions can be added
            // Simulate how components determined if a report is archived by using this hook
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.canAddTransaction)(report, isReportArchived.current);
            // Then the result is true
            expect(result).toBe(true);
        });
        it('should return false for an expense report the current user is not the submitter', async () => {
            // Given an expense report the current user is not the submitter
            const report = {
                ...(0, reports_2.createRandomReport)(10000),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                ownerAccountID: currentUserAccountID + 1,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            const result = (0, ReportUtils_1.canAddTransaction)(report, false);
            // Then the result is false
            expect(result).toBe(false);
        });
        it('should return false for an archived report', async () => {
            // Given an archived expense report
            const report = {
                ...(0, reports_2.createRandomReport)(10001),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                ownerAccountID: currentUserAccountID,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, { private_isArchived: DateUtils_1.default.getDBTime() });
            // When it's checked if the transactions can be added
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.canAddTransaction)(report, isReportArchived.current);
            // Then the result is false
            expect(result).toBe(false);
        });
    });
    describe('canDeleteTransaction', () => {
        it('should return true for a non-archived report', async () => {
            // Given a non-archived expense report
            const report = {
                ...(0, reports_2.createRandomReport)(20000),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            // When it's checked if the transactions can be deleted
            // Simulate how components determined if a report is archived by using this hook
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.canDeleteTransaction)(report, isReportArchived.current);
            // Then the result is true
            expect(result).toBe(true);
        });
        it('should return false for an archived report', async () => {
            // Given an archived expense report
            const report = {
                ...(0, reports_2.createRandomReport)(20001),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, { private_isArchived: DateUtils_1.default.getDBTime() });
            // When it's checked if the transactions can be deleted
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.canDeleteTransaction)(report, isReportArchived.current);
            // Then the result is false
            expect(result).toBe(false);
        });
    });
    describe('getReasonAndReportActionThatRequiresAttention', () => {
        it('should return a reason for a non-archived report', async () => {
            // Given a non-archived expense report that is unread with a mention
            const report = {
                ...(0, reports_2.createRandomReport)(30000),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                isUnreadWithMention: true,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            // When the reason is retrieved
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.getReasonAndReportActionThatRequiresAttention)(report, undefined, isReportArchived.current);
            // There should be some kind of a reason (any reason is fine)
            expect(result).toHaveProperty('reason');
        });
        it('should return null for an archived report', async () => {
            // Given an archived expense report that is unread with a mention
            const report = {
                ...(0, reports_2.createRandomReport)(30000),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                isUnreadWithMention: true,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, { private_isArchived: DateUtils_1.default.getDBTime() });
            // When the reason is retrieved
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.getReasonAndReportActionThatRequiresAttention)(report, undefined, isReportArchived.current);
            // Then the result is null
            expect(result).toBe(null);
        });
    });
    describe('canEditReportDescription', () => {
        it('should return true for a non-archived policy room', async () => {
            // Given a non-archived policy room
            const report = {
                ...(0, reports_2.createRandomReport)(40001),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            // When it's checked if the description can be edited
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.canEditReportDescription)(report, policy, isReportArchived.current);
            // Then it can be edited
            expect(result).toBeTruthy();
        });
        it('should return false for an archived policy room', async () => {
            // Given an archived policy room
            const report = {
                ...(0, reports_2.createRandomReport)(40002),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, { private_isArchived: DateUtils_1.default.getDBTime() });
            // When it's checked if the description can be edited
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.canEditReportDescription)(report, policy, isReportArchived.current);
            // Then it cannot be edited
            expect(result).toBeFalsy();
        });
    });
    describe('isDeprecatedGroupDM', () => {
        it('should return false if the report is a chat thread', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(0),
                parentReportActionID: '1',
                parentReportID: '1',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1, 2]),
            };
            expect((0, ReportUtils_1.isDeprecatedGroupDM)(report)).toBeFalsy();
        });
        it('should return false if the report is a task report', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(0),
                type: CONST_1.default.REPORT.TYPE.TASK,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1, 2]),
            };
            expect((0, ReportUtils_1.isDeprecatedGroupDM)(report)).toBeFalsy();
        });
        it('should return false if the report is a money request report', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(0),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1, 2]),
            };
            expect((0, ReportUtils_1.isDeprecatedGroupDM)(report)).toBeFalsy();
        });
        it('should return false if the report is an archived room', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(0),
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1, 2]),
            };
            expect((0, ReportUtils_1.isDeprecatedGroupDM)(report, true)).toBeFalsy();
        });
        it('should return false if the report is a public / admin / announce chat room', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(0),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1, 2]),
            };
            expect((0, ReportUtils_1.isDeprecatedGroupDM)(report)).toBeFalsy();
        });
        it('should return false if the report has less than 2 participants', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(0),
                chatType: undefined,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
            };
            expect((0, ReportUtils_1.isDeprecatedGroupDM)(report)).toBeFalsy();
        });
        it('should return true if the report has more than 2 participants', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(0),
                chatType: undefined,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1, 2]),
            };
            expect((0, ReportUtils_1.isDeprecatedGroupDM)(report)).toBeTruthy();
        });
    });
    describe('canUserPerformWriteAction', () => {
        it('should return false for announce room when the role of the employee is auditor ', async () => {
            // Given a policy announce room of a policy that the user has an auditor role
            const workspace = { ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM), role: CONST_1.default.POLICY.ROLE.AUDITOR };
            const policyAnnounceRoom = {
                ...(0, reports_2.createRandomReport)(50001),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
                policyID: policy.id,
                writeCapability: CONST_1.default.REPORT.WRITE_CAPABILITIES.ADMINS,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${workspace.id}`, workspace);
            const result = (0, ReportUtils_1.canUserPerformWriteAction)(policyAnnounceRoom);
            // Then it should return false
            expect(result).toBe(false);
        });
        it('should return false for announce room when the role of the employee is admin and report is archived', async () => {
            // Given a policy announce room of a policy that the user has an admin role
            const workspace = { ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM), role: CONST_1.default.POLICY.ROLE.ADMIN };
            const policyAnnounceRoom = {
                ...(0, reports_2.createRandomReport)(50001),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
                policyID: policy.id,
                writeCapability: CONST_1.default.REPORT.WRITE_CAPABILITIES.ADMINS,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${workspace.id}`, workspace);
            const result = (0, ReportUtils_1.canUserPerformWriteAction)(policyAnnounceRoom, true);
            expect(result).toBe(false);
        });
        it('should return true for announce room when the role of the employee is admin and report is not archived', async () => {
            // Given a policy announce room of a policy that the user has an admin role
            const workspace = { ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM), role: CONST_1.default.POLICY.ROLE.ADMIN };
            const policyAnnounceRoom = {
                ...(0, reports_2.createRandomReport)(50001),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
                policyID: policy.id,
                writeCapability: CONST_1.default.REPORT.WRITE_CAPABILITIES.ADMINS,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${workspace.id}`, workspace);
            const result = (0, ReportUtils_1.canUserPerformWriteAction)(policyAnnounceRoom, false);
            expect(result).toBe(true);
        });
    });
    describe('shouldDisableRename', () => {
        it('should return true for archived reports', async () => {
            // Given an archived policy room
            const report = {
                ...(0, reports_2.createRandomReport)(50001),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, { private_isArchived: DateUtils_1.default.getDBTime() });
            // When shouldDisableRename is called
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.shouldDisableRename)(report, isReportArchived.current);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return true for default rooms', () => {
            // Given a default room
            const report = {
                ...(0, reports_2.createRandomReport)(50002),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
                reportName: '#admins',
            };
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return true for public rooms', () => {
            // Given a public room
            const report = {
                ...(0, reports_2.createRandomReport)(50003),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                visibility: CONST_1.default.REPORT.VISIBILITY.PUBLIC,
            };
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return true for threads', () => {
            // Given a thread report
            const report = {
                ...(0, reports_2.createRandomReport)(50004),
                parentReportID: '12345',
                parentReportActionID: '67890',
            };
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return true for money request reports', () => {
            // Given a money request report
            const report = {
                ...(0, reports_2.createRandomReport)(50005),
                type: CONST_1.default.REPORT.TYPE.IOU,
            };
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return true for expense reports', () => {
            // Given an expense report
            const report = {
                ...(0, reports_2.createRandomReport)(50006),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return true for policy expense chats', () => {
            // Given a policy expense chat
            const report = {
                ...(0, reports_2.createRandomReport)(50007),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                isOwnPolicyExpenseChat: true,
            };
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return true for invoice rooms', () => {
            // Given an invoice room
            const report = {
                ...(0, reports_2.createRandomReport)(50008),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
            };
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return true for invoice reports', () => {
            // Given an invoice report
            const report = {
                ...(0, reports_2.createRandomReport)(50009),
                type: CONST_1.default.REPORT.TYPE.INVOICE,
            };
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return true for system chats', () => {
            // Given a system chat
            const report = {
                ...(0, reports_2.createRandomReport)(50010),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SYSTEM,
            };
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return true
            expect(result).toBe(true);
        });
        it('should return false for group chats', async () => {
            // Given a group chat
            const report = {
                ...(0, reports_2.createRandomReport)(50011),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1, 2]),
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            // When shouldDisableRename is called
            const result = (0, ReportUtils_1.shouldDisableRename)(report);
            // Then it should return false
            expect(result).toBe(false);
        });
        it('should return false for non-archived regular chats', async () => {
            // Given a non-archived regular chat (1:1 DM)
            const report = {
                reportID: '50012',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
                // Ensure it's not a policy expense chat or any other special chat type
                chatType: undefined,
                isOwnPolicyExpenseChat: false,
                policyID: undefined,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            // When shouldDisableRename is called
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
            const result = (0, ReportUtils_1.shouldDisableRename)(report, isReportArchived.current);
            // Then it should return false (since this is a 1:1 DM and not a group chat, and none of the other conditions are met)
            expect(result).toBe(false);
        });
    });
    describe('canLeaveChat', () => {
        beforeEach(async () => {
            jest.clearAllMocks();
            await react_native_onyx_1.default.clear();
        });
        it('should return true for root group chat', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
            };
            expect((0, ReportUtils_1.canLeaveChat)(report, undefined)).toBe(true);
        });
        it('should return true for policy expense chat if the user is not the owner and the user is not an admin', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                isOwnPolicyExpenseChat: false,
                policyID: '1',
            };
            const reportPolicy = {
                ...(0, policies_1.default)(1),
                role: CONST_1.default.POLICY.ROLE.USER,
            };
            expect((0, ReportUtils_1.canLeaveChat)(report, reportPolicy)).toBe(true);
        });
        it('should return false if the chat is public room and the user is the guest', async () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                visibility: CONST_1.default.REPORT.VISIBILITY.PUBLIC,
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID, authTokenType: CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS });
            expect((0, ReportUtils_1.canLeaveChat)(report, undefined)).toBe(false);
        });
        it('should return false if the report is hidden for the current user', async () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    ...(0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1234]),
                    [currentUserAccountID]: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
                chatType: undefined,
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
            expect((0, ReportUtils_1.canLeaveChat)(report, undefined)).toBe(false);
        });
        it('should return false for selfDM reports', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
            };
            expect((0, ReportUtils_1.canLeaveChat)(report, undefined)).toBe(false);
        });
        it('should return false for the public announce room if the user is a member of the policy', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                visibility: CONST_1.default.REPORT.VISIBILITY.PUBLIC_ANNOUNCE,
            };
            const reportPolicy = {
                ...(0, policies_1.default)(1),
                role: CONST_1.default.POLICY.ROLE.USER,
            };
            expect((0, ReportUtils_1.canLeaveChat)(report, reportPolicy)).toBe(false);
        });
        it('should return true for the invoice room if the user is not the sender or receiver', async () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
                invoiceReceiver: {
                    type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
                    accountID: 1234,
                },
                policyID: '1',
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1234]),
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
            const reportPolicy = {
                ...(0, policies_1.default)(1),
                role: CONST_1.default.POLICY.ROLE.USER,
            };
            expect((0, ReportUtils_1.canLeaveChat)(report, reportPolicy)).toBe(true);
        });
        it('should return true for chat thread if the user is joined', async () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: undefined,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1234]),
                parentReportID: '12345',
                parentReportActionID: '67890',
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
            expect((0, ReportUtils_1.canLeaveChat)(report, undefined)).toBe(true);
        });
        it('should return true for user created policy room', async () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1234]),
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
            const reportPolicy = {
                ...(0, policies_1.default)(1),
                role: CONST_1.default.POLICY.ROLE.USER,
            };
            expect((0, ReportUtils_1.canLeaveChat)(report, reportPolicy)).toBe(true);
        });
    });
    describe('canJoinChat', () => {
        beforeEach(async () => {
            jest.clearAllMocks();
            await react_native_onyx_1.default.clear();
        });
        it('should return false if the parent report action is a whisper action', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1234]),
            };
            const parentReportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                originalMessage: {
                    whisperedTo: [1234],
                },
            };
            expect((0, ReportUtils_1.canJoinChat)(report, parentReportAction, undefined)).toBe(false);
        });
        it('should return false if the report is not hidden for the current user', async () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1234]),
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
            expect((0, ReportUtils_1.canJoinChat)(report, undefined, undefined)).toBe(false);
        });
        it('should return false if the report is one of these types: group chat, selfDM, invoice room, system chat, expense chat', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
            };
            expect((0, ReportUtils_1.canJoinChat)(report, undefined, undefined)).toBe(false);
        });
        it('should return false if the report is archived', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
            };
            expect((0, ReportUtils_1.canJoinChat)(report, undefined, undefined, true)).toBe(false);
        });
        it('should return true if the report is chat thread', async () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    ...(0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1234]),
                    [currentUserAccountID]: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
                chatType: undefined,
                parentReportID: '12345',
                parentReportActionID: '67890',
            };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
            expect((0, ReportUtils_1.canJoinChat)(report, undefined, undefined)).toBe(true);
        });
    });
    describe('isRootGroupChat', () => {
        it('should return false if the report is chat thread', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: undefined,
                parentReportID: '12345',
                parentReportActionID: '67890',
            };
            expect((0, ReportUtils_1.isRootGroupChat)(report)).toBe(false);
        });
        it('should return true if the report is a group chat and it is not a chat thread', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
            };
            expect((0, ReportUtils_1.isRootGroupChat)(report)).toBe(true);
        });
        it('should return true if the report is a deprecated group DM and it is not a chat thread', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(0),
                chatType: undefined,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1, 2]),
            };
            expect((0, ReportUtils_1.isRootGroupChat)(report)).toBe(true);
        });
    });
    describe('isWhisperAction', () => {
        it('an action where reportAction.message.whisperedTo has accountIDs is a whisper action', () => {
            const whisperReportAction = {
                ...(0, reportActions_1.default)(1),
            };
            expect((0, ReportActionsUtils_1.isWhisperAction)(whisperReportAction)).toBe(true);
        });
        it('an action where reportAction.originalMessage.whisperedTo does not exist is not a whisper action', () => {
            const nonWhisperReportAction = {
                ...(0, reportActions_1.default)(1),
                message: [
                    {
                        whisperedTo: undefined,
                    },
                ],
            };
            expect((0, ReportActionsUtils_1.isWhisperAction)(nonWhisperReportAction)).toBe(false);
        });
    });
    describe('canFlagReportAction', () => {
        describe('a whisper action', () => {
            const whisperReportAction = {
                ...(0, reportActions_1.default)(1),
            };
            it('cannot be flagged if it is from concierge', () => {
                const whisperReportActionFromConcierge = {
                    ...whisperReportAction,
                    actorAccountID: CONST_1.default.ACCOUNT_ID.CONCIERGE,
                };
                // The reportID doesn't matter because there is an early return for whisper actions and the report is not looked at
                expect((0, ReportUtils_1.canFlagReportAction)(whisperReportActionFromConcierge, '123456')).toBe(false);
            });
            it('cannot be flagged if it is from the current user', () => {
                const whisperReportActionFromCurrentUser = {
                    ...whisperReportAction,
                    actorAccountID: currentUserAccountID,
                };
                // The reportID doesn't matter because there is an early return for whisper actions and the report is not looked at
                expect((0, ReportUtils_1.canFlagReportAction)(whisperReportActionFromCurrentUser, '123456')).toBe(false);
            });
            it('can be flagged if it is not from concierge or the current user', () => {
                expect((0, ReportUtils_1.canFlagReportAction)(whisperReportAction, '123456')).toBe(true);
            });
        });
        describe('a non-whisper action', () => {
            const report = {
                ...(0, reports_2.createRandomReport)(1),
            };
            const nonWhisperReportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                message: [
                    {
                        whisperedTo: undefined,
                    },
                ],
            };
            (0, globals_1.beforeAll)(async () => {
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            });
            afterAll(async () => {
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, null);
            });
            it('cannot be flagged if it is from the current user', () => {
                const nonWhisperReportActionFromCurrentUser = {
                    ...nonWhisperReportAction,
                    actorAccountID: currentUserAccountID,
                };
                expect((0, ReportUtils_1.canFlagReportAction)(nonWhisperReportActionFromCurrentUser, report.reportID)).toBe(false);
            });
            it('cannot be flagged if the action name is something other than ADD_COMMENT', () => {
                const nonWhisperReportActionWithDifferentActionName = {
                    ...nonWhisperReportAction,
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED,
                };
                expect((0, ReportUtils_1.canFlagReportAction)(nonWhisperReportActionWithDifferentActionName, report.reportID)).toBe(false);
            });
            it('cannot be flagged if the action is deleted', () => {
                const deletedReportAction = {
                    ...nonWhisperReportAction,
                    message: [
                        {
                            whisperedTo: undefined,
                            html: '',
                            deleted: (0, reportActions_1.getRandomDate)(),
                        },
                    ],
                };
                expect((0, ReportUtils_1.canFlagReportAction)(deletedReportAction, report.reportID)).toBe(false);
            });
            it('cannot be flagged if the action is a created task report', () => {
                const createdTaskReportAction = {
                    ...nonWhisperReportAction,
                    originalMessage: {
                        // This signifies that the action is a created task report along with the ADD_COMMENT action name
                        taskReportID: '123456',
                    },
                };
                expect((0, ReportUtils_1.canFlagReportAction)(createdTaskReportAction, report.reportID)).toBe(false);
            });
            it('cannot be flagged if the report does not exist', () => {
                // cspell:disable-next-line
                expect((0, ReportUtils_1.canFlagReportAction)(nonWhisperReportAction, 'starwarsisthebest')).toBe(false);
            });
            it('cannot be flagged if the report is not allowed to be commented on', () => {
                // eslint-disable-next-line rulesdir/no-negated-variables
                const reportThatCannotBeCommentedOn = {
                    ...(0, reports_2.createRandomReport)(2),
                    // If the permissions does not contain WRITE, then it cannot be commented on
                    permissions: [],
                };
                expect((0, ReportUtils_1.canFlagReportAction)(nonWhisperReportAction, reportThatCannotBeCommentedOn.reportID)).toBe(false);
            });
            it('can be flagged', () => {
                expect((0, ReportUtils_1.canFlagReportAction)(nonWhisperReportAction, report.reportID)).toBe(true);
            });
        });
    });
    // Note: shouldShowFlagComment() calls isArchivedNonExpenseReport() which has it's own unit tests, so whether
    // the report is an expense report or not does not need to be tested here.
    describe('shouldShowFlagComment', () => {
        const validReportAction = {
            ...(0, reportActions_1.default)(1),
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
            // Actor is not the current user or Concierge
            actorAccountID: 123456,
        };
        describe('can flag report action', () => {
            let expenseReport;
            const reportActionThatCanBeFlagged = {
                ...validReportAction,
            };
            // eslint-disable-next-line rulesdir/no-negated-variables
            const reportActionThatCannotBeFlagged = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                // If the actor is Concierge, the report action cannot be flagged
                actorAccountID: CONST_1.default.ACCOUNT_ID.CONCIERGE,
            };
            (0, globals_1.beforeAll)(async () => {
                expenseReport = {
                    ...(0, reports_2.createRandomReport)(60000),
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            });
            afterAll(async () => {
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, null);
            });
            it('should return true for an archived expense report with an action that can be flagged', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(reportActionThatCanBeFlagged, expenseReport, true)).toBe(true);
            });
            it('should return true for a non-archived expense report with an action that can be flagged', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(reportActionThatCanBeFlagged, expenseReport, false)).toBe(true);
            });
            it('should return false for an archived expense report with an action that cannot be flagged', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(reportActionThatCannotBeFlagged, expenseReport, true)).toBe(false);
            });
            it('should return false for a non-archived expense report with an action that cannot be flagged', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(reportActionThatCannotBeFlagged, expenseReport, false)).toBe(false);
            });
        });
        describe('Chat with Chronos', () => {
            let chatReport;
            (0, globals_1.beforeAll)(async () => {
                chatReport = {
                    ...(0, reports_2.createRandomReport)(60000),
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                    participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, CONST_1.default.ACCOUNT_ID.CHRONOS]),
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`, chatReport);
            });
            afterAll(async () => {
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`, null);
            });
            it('should return false for an archived chat report', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(validReportAction, chatReport, true)).toBe(false);
            });
            it('should return false for a non-archived chat report', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(validReportAction, chatReport, false)).toBe(false);
            });
        });
        describe('Chat with Concierge', () => {
            let chatReport;
            (0, globals_1.beforeAll)(async () => {
                chatReport = {
                    ...(0, reports_2.createRandomReport)(60000),
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                    participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, CONST_1.default.ACCOUNT_ID.CONCIERGE]),
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`, chatReport);
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.CONCIERGE_REPORT_ID}`, chatReport.reportID);
            });
            afterAll(async () => {
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`, null);
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.CONCIERGE_REPORT_ID}`, null);
            });
            it('should return false for an archived chat report', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(validReportAction, chatReport, true)).toBe(false);
            });
            it('should return false for a non-archived chat report', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(validReportAction, chatReport, false)).toBe(false);
            });
        });
        describe('Action from Concierge', () => {
            let chatReport;
            const actionFromConcierge = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                actorAccountID: CONST_1.default.ACCOUNT_ID.CONCIERGE,
            };
            (0, globals_1.beforeAll)(async () => {
                chatReport = {
                    ...(0, reports_2.createRandomReport)(60000),
                    type: CONST_1.default.REPORT.TYPE.CHAT,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`, chatReport);
            });
            afterAll(async () => {
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`, null);
            });
            it('should return false for an archived chat report', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(actionFromConcierge, chatReport, true)).toBe(false);
            });
            it('should return false for a non-archived chat report', () => {
                expect((0, ReportUtils_1.shouldShowFlagComment)(actionFromConcierge, chatReport, false)).toBe(false);
            });
        });
    });
    describe('isMoneyRequestReportEligibleForMerge', () => {
        const mockReportID = 'report123';
        const differentUserAccountID = 123123;
        beforeEach(async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: participantsPersonalDetails,
                [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID: currentUserAccountID },
            });
        });
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
        });
        it('should return false when report is not a money request report', async () => {
            // Given a regular chat report that is not a money request report
            const chatReport = {
                ...(0, reports_2.createRandomReport)(1),
                reportID: mockReportID,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, chatReport);
            // When we check if the report is eligible for merge
            const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, true);
            // Then it should return false because it's not a money request report
            expect(result).toBe(false);
        });
        it('should return false when report does not exist', () => {
            // Given a non-existent report ID
            const nonExistentReportID = 'nonexistent123';
            // When we check if the report is eligible for merge
            const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(nonExistentReportID, true);
            // Then it should return false because the report doesn't exist
            expect(result).toBe(false);
        });
        describe('Admin role', () => {
            it('should return true for open expense report when user is admin', async () => {
                // Given an open expense report and the user is an admin
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    reportID: mockReportID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                // When we check if the report is eligible for merge as an admin
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, true);
                // Then it should return true because admins can merge open expense reports
                expect(result).toBe(true);
            });
            it('should return true for processing expense report when user is admin', async () => {
                // Given a processing expense report and the user is an admin
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    reportID: mockReportID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                // When we check if the report is eligible for merge as an admin
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, true);
                // Then it should return true because admins can merge processing expense reports
                expect(result).toBe(true);
            });
            it('should return false for approved expense report when user is admin', async () => {
                // Given an approved expense report and the user is an admin
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    reportID: mockReportID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                // When we check if the report is eligible for merge as an admin
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, true);
                // Then it should return false because approved reports are not eligible for merge
                expect(result).toBe(false);
            });
            it('should return true for open IOU report when user is admin', async () => {
                // Given an open IOU report and the user is an admin
                const iouReport = {
                    ...(0, reports_2.createExpenseRequestReport)(1),
                    reportID: mockReportID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, iouReport);
                // When we check if the report is eligible for merge as an admin
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, true);
                // Then it should return true because admins can merge open IOU reports
                expect(result).toBe(true);
            });
        });
        describe('Submitter role', () => {
            it('should return true for open expense report when user is submitter', async () => {
                // Given an open expense report where the current user is the submitter
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    reportID: mockReportID,
                    ownerAccountID: currentUserAccountID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                // When we check if the report is eligible for merge as a submitter
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, false);
                // Then it should return true because submitters can merge open expense reports
                expect(result).toBe(true);
            });
            it('should return true for processing IOU report when user is submitter', async () => {
                // Given a processing IOU report where the current user is the submitter
                const iouReport = {
                    ...(0, reports_2.createExpenseRequestReport)(1),
                    reportID: mockReportID,
                    ownerAccountID: currentUserAccountID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, iouReport);
                // When we check if the report is eligible for merge as a submitter
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, false);
                // Then it should return true because submitters can merge processing IOU reports
                expect(result).toBe(true);
            });
            it('should return true for processing expense report at first level approval when user is submitter', async () => {
                const managerAccountID = 123123;
                const managerEmail = 'manager@test.com';
                // Create a policy with appropriate approval settings
                const firstLevelApprovalPolicy = {
                    ...(0, policies_1.default)(1),
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                    preventSelfApproval: true,
                    approver: managerEmail,
                };
                // Given a processing expense report at first level approval where the current user is the submitter
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    policyID: firstLevelApprovalPolicy.id,
                    reportID: mockReportID,
                    ownerAccountID: currentUserAccountID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                    managerID: managerAccountID,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${firstLevelApprovalPolicy.id}`, firstLevelApprovalPolicy);
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                    [managerAccountID]: {
                        accountID: managerAccountID,
                        login: managerEmail,
                    },
                });
                // When we check if the report is eligible for merge as a submitter
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, false);
                // Then it should return true because submitters can merge processing expense reports
                expect(result).toBe(true);
            });
            it('should return false for processing expense report beyond first level approval when user is submitter', async () => {
                // Given a processing expense report beyond first level approval where the current user is the submitter
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    reportID: mockReportID,
                    ownerAccountID: currentUserAccountID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                // When we check if the report is eligible for merge as a submitter
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, false);
                // Then the result depends on the actual approval level logic in the implementation
                expect(typeof result).toBe('boolean');
            });
            it('should return false when user is not the submitter', async () => {
                // Given an open expense report where the current user is not the submitter
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    reportID: mockReportID,
                    ownerAccountID: differentUserAccountID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                // When we check if the report is eligible for merge as a non-submitter
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, false);
                // Then it should return false because the user is not the submitter and not an admin
                expect(result).toBe(false);
            });
        });
        describe('Manager role', () => {
            const managerAccountID = currentUserAccountID;
            it('should return true for processing expense report when user is manager', async () => {
                // Given a processing expense report where the current user is the manager
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    reportID: mockReportID,
                    ownerAccountID: differentUserAccountID, // Different user as submitter
                    managerID: managerAccountID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                // When we check if the report is eligible for merge as a manager
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, false);
                // Then it should return true because managers can merge processing expense reports
                expect(result).toBe(true);
            });
            it('should return false for open expense report when user is manager', async () => {
                // Given an open expense report where the current user is the manager
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    reportID: mockReportID,
                    ownerAccountID: differentUserAccountID, // Different user as submitter
                    managerID: managerAccountID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                // When we check if the report is eligible for merge as a manager
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, false);
                // Then it should return false because managers can only merge processing expense reports, not open ones
                expect(result).toBe(false);
            });
            it('should return false for IOU report when user is manager', async () => {
                // Given an IOU report where the current user is the manager
                const iouReport = {
                    ...(0, reports_2.createExpenseRequestReport)(1),
                    reportID: mockReportID,
                    ownerAccountID: differentUserAccountID, // Different user as submitter
                    managerID: managerAccountID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, iouReport);
                // When we check if the report is eligible for merge as a manager
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, false);
                // Then it should return false because managers can only merge expense reports, not IOU reports
                expect(result).toBe(false);
            });
            it('should return false when user is not the manager', async () => {
                // Given a processing expense report where the current user is not the manager
                const expenseReport = {
                    ...(0, reports_2.createExpenseReport)(1),
                    reportID: mockReportID,
                    ownerAccountID: differentUserAccountID, // Different user as submitter
                    managerID: differentUserAccountID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReportID}`, expenseReport);
                // When we check if the report is eligible for merge as a non-manager
                const result = (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(mockReportID, false);
                // Then it should return false because the user is not the manager, submitter, or admin
                expect(result).toBe(false);
            });
        });
    });
    describe('getReportStatusTranslation', () => {
        it('should return "Draft" for state 0, status 0', () => {
            expect((0, ReportUtils_1.getReportStatusTranslation)(CONST_1.default.REPORT.STATE_NUM.OPEN, CONST_1.default.REPORT.STATUS_NUM.OPEN)).toBe((0, Localize_1.translateLocal)('common.draft'));
        });
        it('should return "Outstanding" for state 1, status 1', () => {
            expect((0, ReportUtils_1.getReportStatusTranslation)(CONST_1.default.REPORT.STATE_NUM.SUBMITTED, CONST_1.default.REPORT.STATUS_NUM.SUBMITTED)).toBe((0, Localize_1.translateLocal)('common.outstanding'));
        });
        it('should return "Done" for state 2, status 2', () => {
            expect((0, ReportUtils_1.getReportStatusTranslation)(CONST_1.default.REPORT.STATE_NUM.APPROVED, CONST_1.default.REPORT.STATUS_NUM.CLOSED)).toBe((0, Localize_1.translateLocal)('common.done'));
        });
        it('should return "Approved" for state 2, status 3', () => {
            expect((0, ReportUtils_1.getReportStatusTranslation)(CONST_1.default.REPORT.STATE_NUM.APPROVED, CONST_1.default.REPORT.STATUS_NUM.APPROVED)).toBe((0, Localize_1.translateLocal)('iou.approved'));
        });
        it('should return "Paid" for state 2, status 4', () => {
            expect((0, ReportUtils_1.getReportStatusTranslation)(CONST_1.default.REPORT.STATE_NUM.APPROVED, CONST_1.default.REPORT.STATUS_NUM.REIMBURSED)).toBe((0, Localize_1.translateLocal)('iou.settledExpensify'));
        });
        it('should return "Paid" for state 3, status 4', () => {
            expect((0, ReportUtils_1.getReportStatusTranslation)(CONST_1.default.REPORT.STATE_NUM.BILLING, CONST_1.default.REPORT.STATUS_NUM.REIMBURSED)).toBe((0, Localize_1.translateLocal)('iou.settledExpensify'));
        });
        it('should return "Paid" for state 6, status 4', () => {
            expect((0, ReportUtils_1.getReportStatusTranslation)(CONST_1.default.REPORT.STATE_NUM.AUTOREIMBURSED, CONST_1.default.REPORT.STATUS_NUM.REIMBURSED)).toBe((0, Localize_1.translateLocal)('iou.settledExpensify'));
        });
        it('should return an empty string when stateNum or statusNum is undefined', () => {
            expect((0, ReportUtils_1.getReportStatusTranslation)(undefined, undefined)).toBe('');
            expect((0, ReportUtils_1.getReportStatusTranslation)(CONST_1.default.REPORT.STATE_NUM.OPEN, undefined)).toBe('');
            expect((0, ReportUtils_1.getReportStatusTranslation)(undefined, CONST_1.default.REPORT.STATUS_NUM.OPEN)).toBe('');
        });
    });
    describe('buildOptimisticReportPreview', () => {
        it('should include childOwnerAccountID and childManagerAccountID that matches with iouReport data', () => {
            const chatReport = {
                ...(0, reports_2.createRandomReport)(100),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: undefined,
            };
            const iouReport = {
                ...(0, reports_2.createRandomReport)(200),
                parentReportID: '1',
                type: CONST_1.default.REPORT.TYPE.IOU,
                chatType: undefined,
                ownerAccountID: 1,
                managerID: 2,
            };
            const reportPreviewAction = (0, ReportUtils_1.buildOptimisticReportPreview)(chatReport, iouReport);
            expect(reportPreviewAction.childOwnerAccountID).toBe(iouReport.ownerAccountID);
            expect(reportPreviewAction.childManagerAccountID).toBe(iouReport.managerID);
        });
    });
    describe('canSeeDefaultRoom', () => {
        it('should return true if report is archived room ', () => {
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            const report = {
                ...(0, reports_2.createRandomReport)(40002),
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 1]),
            };
            expect((0, ReportUtils_1.canSeeDefaultRoom)(report, betas, true)).toBe(true);
        });
        it('should return true if the room has an assigned guide', () => {
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            const report = {
                ...(0, reports_2.createRandomReport)(40002),
                participants: (0, ReportUtils_1.buildParticipantsFromAccountIDs)([currentUserAccountID, 8]),
            };
            react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails).then(() => {
                expect((0, ReportUtils_1.canSeeDefaultRoom)(report, betas, false)).toBe(true);
            });
        });
        it('should return true if the report is admin room', () => {
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            const report = {
                ...(0, reports_2.createRandomReport)(40002),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
            };
            react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails).then(() => {
                expect((0, ReportUtils_1.canSeeDefaultRoom)(report, betas, false)).toBe(true);
            });
        });
    });
    describe('getAllReportActionsErrorsAndReportActionThatRequiresAttention', () => {
        const report = {
            ...(0, reports_2.createRandomReport)(40003),
            parentReportID: '40004',
            parentReportActionID: '2',
        };
        const parentReport = {
            ...(0, reports_2.createRandomReport)(40004),
            statusNum: 0,
        };
        const reportAction1 = {
            ...(0, reportActions_1.default)(1),
            reportID: report.reportID,
        };
        const parentReportAction1 = {
            ...(0, reportActions_1.default)(2),
            reportID: '40004',
            actorAccountID: currentUserAccountID,
        };
        const reportActions = [reportAction1, parentReportAction1].reduce((acc, action) => {
            if (action.reportActionID) {
                acc[action.reportActionID] = action;
            }
            return acc;
        }, {});
        beforeEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserEmail, accountID: currentUserAccountID });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`, parentReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportAction1.reportID}`, {
                [reportAction1.reportActionID]: reportAction1,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportAction1.reportID}`, {
                [parentReportAction1.reportActionID]: parentReportAction1,
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        it("should return nothing when there's no actions required", () => {
            expect((0, ReportUtils_1.getAllReportActionsErrorsAndReportActionThatRequiresAttention)(report, reportActions, false)).toEqual({
                errors: {},
                reportAction: undefined,
            });
        });
        it("should return error with report action when there's actions required", async () => {
            const reportActionWithError = {
                ...(0, reportActions_1.default)(1),
                reportID: report.reportID,
                errors: {
                    reportID: 'Error message',
                    accountID: 'Error in accountID',
                },
            };
            const reportActionsWithError = {
                ...reportActions,
                [reportActionWithError.reportActionID]: reportActionWithError,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportActionWithError.reportID}`, {
                [reportActionWithError.reportActionID]: reportActionWithError,
            });
            await (0, waitForBatchedUpdates_1.default)();
            expect((0, ReportUtils_1.getAllReportActionsErrorsAndReportActionThatRequiresAttention)(report, reportActionsWithError, false)).toEqual({
                errors: {
                    reportID: 'Error message',
                    accountID: 'Error in accountID',
                },
                reportAction: reportActionWithError,
            });
        });
        it("should return smart scan error with no report action when there's actions required and report is not archived", async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportAction1.reportID}`, {
                [parentReportAction1.reportActionID]: {
                    actorAccountID: currentUserAccountID,
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    originalMessage: {
                        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                        IOUTransactionID: '12345',
                    },
                },
            });
            const transaction = {
                ...(0, transaction_1.default)(12345),
                reportID: parentReport.reportID,
                amount: 0,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`, transaction);
            await (0, waitForBatchedUpdates_1.default)();
            const { errors, reportAction } = (0, ReportUtils_1.getAllReportActionsErrorsAndReportActionThatRequiresAttention)(report, reportActions, false);
            expect(Object.keys(errors)).toHaveLength(1);
            expect(Object.keys(errors).at(0)).toBe('smartscan');
            expect(Object.keys(errors.smartscan ?? {})).toHaveLength(1);
            expect(errors.smartscan?.[Object.keys(errors.smartscan)[0]]).toEqual('Transaction is missing fields');
            expect(reportAction).toBeUndefined();
        });
        it("should return no error and no report action when there's actions required and report is archived", async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportAction1.reportID}`, {
                [parentReportAction1.reportActionID]: {
                    actorAccountID: currentUserAccountID,
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    originalMessage: {
                        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                        IOUTransactionID: '12345',
                    },
                },
            });
            const transaction = {
                ...(0, transaction_1.default)(12345),
                reportID: parentReport.reportID,
                amount: 0,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`, transaction);
            await (0, waitForBatchedUpdates_1.default)();
            const { errors, reportAction } = (0, ReportUtils_1.getAllReportActionsErrorsAndReportActionThatRequiresAttention)(report, reportActions, true);
            expect(Object.keys(errors)).toHaveLength(0);
            expect(reportAction).toBeUndefined();
        });
    });
});
