"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const useParentReport_1 = require("@hooks/useParentReport");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const Task_1 = require("@libs/actions/Task");
// eslint-disable-next-line no-restricted-syntax -- this is required to allow mocking
const API = require("@libs/API");
// eslint-disable-next-line no-restricted-syntax -- this is required to allow mocking
const DateUtils_1 = require("@libs/DateUtils");
const Localize_1 = require("@libs/Localize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
// eslint-disable-next-line no-restricted-syntax -- this is required to allow mocking
const ReportUtils = require("@libs/ReportUtils");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const LHNTestUtils_1 = require("../utils/LHNTestUtils");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Mock API and Navigation
jest.mock('@libs/API');
jest.mock('@libs/Navigation/Navigation');
jest.mock('@libs/Sound');
jest.mock('@libs/ErrorUtils');
jest.mock('@libs/actions/Welcome');
// Keep OnyxDerived real initialization below
jest.mock('@components/Icon/Expensicons');
jest.mock('@components/LocaleContextProvider');
// ReportUtils spies used in createTaskAndNavigate tests
const mockBuildOptimisticTaskReport = jest.fn();
const mockBuildOptimisticCreatedReportAction = jest.fn();
const mockBuildOptimisticTaskCommentReportAction = jest.fn();
const mockGetTaskAssigneeChatOnyxData = jest.fn();
const mockGetOptimisticDataForParentReportAction = jest.fn();
const mockIsHiddenForCurrentUser = jest.fn();
const mockFormatReportLastMessageText = jest.fn();
jest.spyOn(ReportUtils, 'buildOptimisticTaskReport').mockImplementation(mockBuildOptimisticTaskReport);
jest.spyOn(ReportUtils, 'buildOptimisticCreatedReportAction').mockImplementation(mockBuildOptimisticCreatedReportAction);
jest.spyOn(ReportUtils, 'buildOptimisticTaskCommentReportAction').mockImplementation(mockBuildOptimisticTaskCommentReportAction);
jest.spyOn(ReportUtils, 'getTaskAssigneeChatOnyxData').mockImplementation(mockGetTaskAssigneeChatOnyxData);
jest.spyOn(ReportUtils, 'getOptimisticDataForParentReportAction').mockImplementation(mockGetOptimisticDataForParentReportAction);
jest.spyOn(ReportUtils, 'isHiddenForCurrentUser').mockImplementation(mockIsHiddenForCurrentUser);
jest.spyOn(ReportUtils, 'formatReportLastMessageText').mockImplementation(mockFormatReportLastMessageText);
// Spy on API.write but allow calls to go through
const writeSpy = jest.spyOn(API, 'write');
(0, OnyxUpdateManager_1.default)();
describe('actions/Task', () => {
    beforeAll(async () => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        (0, OnyxDerived_1.default)();
        await (0, waitForBatchedUpdates_1.default)();
    });
    describe('canModify and canAction task', () => {
        const managerAccountID = 1;
        const employeeAccountID = 2;
        const taskAssigneeAccountID = 3;
        // TaskReport with a non-archived parent
        const taskReport = { ...(0, LHNTestUtils_1.getFakeReport)([managerAccountID, employeeAccountID]), type: CONST_1.default.REPORT.TYPE.TASK };
        const taskReportParent = (0, LHNTestUtils_1.getFakeReport)([managerAccountID, employeeAccountID]);
        // Cancelled Task report with a non-archived parent
        const taskReportCancelled = { ...(0, LHNTestUtils_1.getFakeReport)([managerAccountID, employeeAccountID]), type: CONST_1.default.REPORT.TYPE.TASK };
        const taskReportCancelledParent = (0, LHNTestUtils_1.getFakeReport)([managerAccountID, employeeAccountID]);
        // Task report with an archived parent
        const taskReportArchived = { ...(0, LHNTestUtils_1.getFakeReport)([managerAccountID, employeeAccountID]), type: CONST_1.default.REPORT.TYPE.TASK };
        const taskReportArchivedParent = (0, LHNTestUtils_1.getFakeReport)([managerAccountID, employeeAccountID]);
        // This report has no parent
        const taskReportWithNoParent = { ...(0, LHNTestUtils_1.getFakeReport)([managerAccountID, employeeAccountID]), type: CONST_1.default.REPORT.TYPE.TASK };
        // Set the manager as the owner of each report
        taskReport.ownerAccountID = managerAccountID;
        taskReportCancelled.ownerAccountID = managerAccountID;
        taskReportArchived.ownerAccountID = managerAccountID;
        taskReportWithNoParent.ownerAccountID = managerAccountID;
        // Set the parent report ID of each report
        taskReport.parentReportID = taskReportParent.reportID;
        taskReportCancelled.parentReportID = taskReportCancelledParent.reportID;
        taskReportArchived.parentReportID = taskReportArchivedParent.reportID;
        // This is what indicates that the report is a cancelled task report (see ReportUtils.isCanceledTaskReport())
        taskReportCancelled.isDeletedParentAction = true;
        beforeAll(async () => {
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
            });
            (0, OnyxDerived_1.default)();
            // Store all the necessary data in Onyx
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportWithNoParent.reportID}`, taskReportWithNoParent);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport.reportID}`, taskReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportParent.reportID}`, taskReportParent);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportCancelled.reportID}`, taskReportCancelled);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportCancelledParent.reportID}`, taskReportCancelledParent);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportArchived.reportID}`, taskReportArchived);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportArchivedParent.reportID}`, taskReportArchivedParent);
            // This is what indicates that a report is archived (see ReportUtils.isArchivedReport())
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${taskReportArchivedParent.reportID}`, {
                private_isArchived: new Date().toString(),
            });
            await (0, waitForBatchedUpdates_1.default)();
        });
        describe('canModifyTask', () => {
            it('returns false if the user modifying the task is not the author', () => {
                // Simulate how components call canModifyTask() by using the hook useReportIsArchived() to see if the report is archived
                const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(taskReport?.parentReportID));
                expect((0, Task_1.canModifyTask)(taskReport, employeeAccountID, isReportArchived.current)).toBe(false);
            });
            it('returns false if the parent report is archived', () => {
                const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(taskReportArchived?.parentReportID));
                expect((0, Task_1.canModifyTask)(taskReportArchived, managerAccountID, isReportArchived.current)).toBe(false);
            });
            it('returns false if the report is a cancelled task report', () => {
                const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(taskReportCancelled?.parentReportID));
                expect((0, Task_1.canModifyTask)(taskReportCancelled, managerAccountID, isReportArchived.current)).toBe(false);
            });
            it('returns true if the user modifying the task is the author and the parent report is not archived or cancelled', () => {
                const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(taskReport?.parentReportID));
                expect((0, Task_1.canModifyTask)(taskReport, managerAccountID, isReportArchived.current)).toBe(true);
            });
        });
        describe('canActionTask', () => {
            it('returns false if there is no logged in user', () => {
                expect((0, Task_1.canActionTask)(taskReportCancelled)).toBe(false);
            });
            it('returns false if parentReport is undefined and taskReport has no parentReportID', () => {
                const task = {
                    ...taskReport,
                    parentReportID: undefined,
                };
                expect((0, Task_1.canActionTask)(task, taskAssigneeAccountID, undefined, false)).toBe(false);
            });
            it('returns false if the report is a cancelled task report', () => {
                // The accountID doesn't matter here because the code will do an early return for the cancelled report
                expect((0, Task_1.canActionTask)(taskReportCancelled, 0)).toBe(false);
            });
            it('returns false if the report has an archived parent report', () => {
                // The accountID doesn't matter here because the code will do an early return for the archived report
                expect((0, Task_1.canActionTask)(taskReportArchived, 0)).toBe(false);
            });
            it('returns false if the user modifying the task is not the author', () => {
                const { result: parentReport } = (0, react_native_1.renderHook)(() => (0, useParentReport_1.default)(taskReport.reportID));
                const { result: isParentReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(parentReport.current?.reportID));
                expect((0, Task_1.canActionTask)(taskReport, employeeAccountID, parentReport.current, isParentReportArchived.current)).toBe(false);
            });
            it('returns true if the user modifying the task is the author', () => {
                const { result: parentReport } = (0, react_native_1.renderHook)(() => (0, useParentReport_1.default)(taskReport.reportID));
                const { result: isParentReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(parentReport.current?.reportID));
                expect((0, Task_1.canActionTask)(taskReport, managerAccountID, parentReport.current, isParentReportArchived.current)).toBe(true);
            });
            // Looking up the task assignee is usually based on the report action
            describe('testing with report action', () => {
                beforeAll(async () => {
                    taskReport.parentReportActionID = 'a1';
                    await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport.reportID}`, taskReport);
                    // Given that the task is assigned to a user who is not the author of the task
                    await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${taskReport.parentReportID}`, {
                        a1: {
                            ...(0, LHNTestUtils_1.getFakeReportAction)(),
                            reportID: taskReport.parentReportID,
                            childManagerAccountID: taskAssigneeAccountID,
                        },
                    });
                });
                it('returns false if the logged in user is not the author or the one assigned to the task', () => {
                    const { result: parentReport } = (0, react_native_1.renderHook)(() => (0, useParentReport_1.default)(taskReport.reportID));
                    const { result: isParentReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(parentReport.current?.reportID));
                    expect((0, Task_1.canActionTask)(taskReport, employeeAccountID, parentReport.current, isParentReportArchived.current)).toBe(false);
                });
                it('returns true if the logged in user is the one assigned to the task', () => {
                    const { result: parentReport } = (0, react_native_1.renderHook)(() => (0, useParentReport_1.default)(taskReport.reportID));
                    const { result: isParentReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(parentReport.current?.reportID));
                    expect((0, Task_1.canActionTask)(taskReport, taskAssigneeAccountID, parentReport.current, isParentReportArchived.current)).toBe(true);
                });
            });
            // Some old reports might only have report.managerID so be sure it's still supported
            describe('testing with report.managerID', () => {
                beforeAll(async () => {
                    taskReport.managerID = taskAssigneeAccountID;
                    await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport.reportID}`, taskReport);
                });
                it('returns false if the logged in user is not the author or the one assigned to the task', () => {
                    const { result: parentReport } = (0, react_native_1.renderHook)(() => (0, useParentReport_1.default)(taskReport.reportID));
                    const { result: isParentReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(parentReport.current?.reportID));
                    expect((0, Task_1.canActionTask)(taskReport, employeeAccountID, parentReport.current, isParentReportArchived.current)).toBe(false);
                });
                it('returns true if the logged in user is the one assigned to the task', () => {
                    const { result: parentReport } = (0, react_native_1.renderHook)(() => (0, useParentReport_1.default)(taskReport.reportID));
                    const { result: isParentReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(parentReport.current?.reportID));
                    expect((0, Task_1.canActionTask)(taskReport, taskAssigneeAccountID, parentReport.current, isParentReportArchived.current)).toBe(true);
                });
            });
        });
    });
    describe('completeTestDriveTask', () => {
        const accountID = 2;
        const conciergeChatReport = (0, LHNTestUtils_1.getFakeReport)([accountID, CONST_1.default.ACCOUNT_ID.CONCIERGE]);
        const testDriveTaskReport = { ...(0, LHNTestUtils_1.getFakeReport)(), ownerAccountID: accountID };
        const testDriveTaskAction = {
            ...(0, LHNTestUtils_1.getFakeReportAction)(),
            childType: CONST_1.default.REPORT.TYPE.TASK,
            childReportName: Parser_1.default.replace((0, Localize_1.translateLocal)('onboarding.testDrive.name', { testDriveURL: `${CONST_1.default.STAGING_NEW_EXPENSIFY_URL}/${ROUTES_1.default.TEST_DRIVE_DEMO_ROOT}` })),
            childReportID: testDriveTaskReport.reportID,
        };
        const reportCollectionDataSet = {
            [`${ONYXKEYS_1.default.COLLECTION.REPORT}${testDriveTaskReport.reportID}`]: testDriveTaskReport,
            [`${ONYXKEYS_1.default.COLLECTION.REPORT}${conciergeChatReport.reportID}`]: conciergeChatReport,
        };
        const reportActionsCollectionDataSet = {
            [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${conciergeChatReport.reportID}`]: {
                [testDriveTaskAction.reportActionID]: testDriveTaskAction,
            },
        };
        beforeEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.multiSet({
                ...reportCollectionDataSet,
                ...reportActionsCollectionDataSet,
                [ONYXKEYS_1.default.NVP_INTRO_SELECTED]: {
                    viewTour: testDriveTaskReport.reportID,
                },
                [ONYXKEYS_1.default.SESSION]: {
                    accountID,
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
        });
        it('Completes test drive task', () => {
            (0, Task_1.completeTestDriveTask)();
            expect(Object.values((0, Task_1.getFinishOnboardingTaskOnyxData)(CONST_1.default.ONBOARDING_TASK_TYPE.VIEW_TOUR)).length).toBe(0);
        });
    });
    describe('getFinishOnboardingTaskOnyxData', () => {
        const parentReport = (0, LHNTestUtils_1.getFakeReport)();
        const taskReport = { ...(0, LHNTestUtils_1.getFakeReport)(), type: CONST_1.default.REPORT.TYPE.TASK, ownerAccountID: 1, managerID: 2, parentReportID: parentReport.reportID };
        const reportCollectionDataSet = {
            [`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport.reportID}`]: taskReport,
            [`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`]: parentReport,
        };
        beforeEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.multiSet({
                ...reportCollectionDataSet,
            });
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: 'user1@gmail.com', accountID: 2 });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.NVP_INTRO_SELECTED}`, { choice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM, setupCategories: taskReport.reportID });
            await (0, waitForBatchedUpdates_1.default)();
        });
        it('Return not empty object', () => {
            expect(Object.values((0, Task_1.getFinishOnboardingTaskOnyxData)('setupCategories')).length).toBeGreaterThan(0);
        });
        it('Return empty object', async () => {
            const reportNameValuePairs = {
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${parentReport.reportID}`, reportNameValuePairs);
            await (0, waitForBatchedUpdates_1.default)();
            expect(Object.values((0, Task_1.getFinishOnboardingTaskOnyxData)('setupCategories')).length).toBe(0);
        });
    });
    describe('createTaskAndNavigate', () => {
        const mockParentReportID = 'parent_report_123';
        const mockTitle = 'Test Task';
        const mockDescription = 'This is a test task description';
        const mockAssigneeEmail = 'assignee@example.com';
        const mockAssigneeAccountID = 456;
        const mockPolicyID = 'policy_123';
        const mockCurrentUserAccountID = 123;
        const mockCurrentUserEmail = 'creator@example.com';
        beforeEach(async () => {
            jest.clearAllMocks();
            writeSpy.mockClear();
            global.fetch = (0, TestHelper_1.getGlobalFetchMock)();
            // Setup ReportUtils mocks
            mockBuildOptimisticTaskReport.mockReturnValue({
                reportID: 'task_report_123',
                reportName: mockTitle,
                description: mockDescription,
                managerID: mockAssigneeAccountID,
                type: CONST_1.default.REPORT.TYPE.TASK,
                parentReportID: mockParentReportID,
            });
            mockBuildOptimisticCreatedReportAction.mockReturnValue({
                reportActionID: 'created_action_123',
                reportAction: {
                    reportActionID: 'created_action_123',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
                    created: DateUtils_1.default.getDBTime(),
                },
            });
            mockBuildOptimisticTaskCommentReportAction.mockReturnValue({
                reportAction: {
                    reportActionID: 'comment_action_123',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    created: DateUtils_1.default.getDBTime(),
                    message: [{ type: 'text', text: `task for ${mockTitle}` }],
                },
            });
            mockGetTaskAssigneeChatOnyxData.mockReturnValue({
                optimisticData: [],
                successData: [],
                failureData: [],
                optimisticAssigneeAddComment: {
                    reportAction: {
                        reportActionID: 'assignee_comment_123',
                    },
                },
                optimisticChatCreatedReportAction: {
                    reportActionID: 'chat_created_123',
                },
            });
            mockGetOptimisticDataForParentReportAction.mockReturnValue([]);
            mockIsHiddenForCurrentUser.mockReturnValue(false);
            mockFormatReportLastMessageText.mockReturnValue('Last message text');
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                email: mockCurrentUserEmail,
                accountID: mockCurrentUserAccountID,
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockParentReportID}`, {
                reportID: mockParentReportID,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    [mockCurrentUserAccountID]: {
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
        });
        it('should create task and navigate successfully with basic parameters', () => {
            // Given: Basic task creation parameters
            const mockAssigneeChatReport = {
                reportID: 'assignee_chat_123',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    [mockAssigneeAccountID]: {
                        accountID: mockAssigneeAccountID,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
            };
            // When: Call createTaskAndNavigate
            (0, Task_1.createTaskAndNavigate)(mockParentReportID, mockTitle, mockDescription, mockAssigneeEmail, mockAssigneeAccountID, mockAssigneeChatReport, mockPolicyID, false, // isCreatedUsingMarkdown
            {});
            // Then: Verify API.write called with expected arguments
            const calls = API.write.mock.calls;
            expect(calls.length).toBe(1);
            const [command, params, onyx] = calls.at(0);
            expect(command).toBe('CreateTask');
            expect(params).toEqual(expect.objectContaining({
                parentReportID: mockParentReportID,
                htmlTitle: mockTitle,
                description: mockDescription,
                assignee: mockAssigneeEmail,
                assigneeAccountID: mockAssigneeAccountID,
                assigneeChatReportID: mockAssigneeChatReport.reportID,
            }));
            expect(onyx).toEqual(expect.objectContaining({
                optimisticData: expect.any(Array),
                successData: expect.any(Array),
                failureData: expect.any(Array),
            }));
        });
        it('should handle task creation without assignee chat report', () => {
            // Given: Task creation without assignee chat report
            const mockQuickAction = {
                action: CONST_1.default.QUICK_ACTIONS.ASSIGN_TASK,
                chatReportID: 'quick_action_chat_123',
                targetAccountID: 789,
            };
            // When: Call createTaskAndNavigate without assignee chat report
            (0, Task_1.createTaskAndNavigate)(mockParentReportID, mockTitle, mockDescription, mockAssigneeEmail, mockAssigneeAccountID, undefined, // assigneeChatReport
            mockPolicyID, false, // isCreatedUsingMarkdown
            mockQuickAction);
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            expect(API.write).toHaveBeenCalledWith('CreateTask', expect.objectContaining({
                parentReportID: mockParentReportID,
                htmlTitle: mockTitle,
                description: mockDescription,
                assignee: mockAssigneeEmail,
                assigneeAccountID: mockAssigneeAccountID,
                assigneeChatReportID: undefined,
                assigneeChatReportActionID: undefined,
                assigneeChatCreatedReportActionID: undefined,
            }), expect.objectContaining({
                optimisticData: expect.arrayContaining([
                    expect.objectContaining({
                        key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
                        value: expect.objectContaining({
                            action: CONST_1.default.QUICK_ACTIONS.ASSIGN_TASK,
                            chatReportID: mockParentReportID,
                            isFirstQuickAction: false,
                            targetAccountID: mockAssigneeAccountID,
                        }),
                    }),
                ]),
            }));
        });
        it('should handle task creation with markdown', () => {
            // Given: Task creation with markdown flag
            const mockAssigneeChatReport = {
                reportID: 'assignee_chat_456',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    [mockAssigneeAccountID]: {
                        accountID: mockAssigneeAccountID,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
            };
            // When: Call createTaskAndNavigate with markdown flag
            (0, Task_1.createTaskAndNavigate)(mockParentReportID, mockTitle, mockDescription, mockAssigneeEmail, mockAssigneeAccountID, mockAssigneeChatReport, mockPolicyID, true, // isCreatedUsingMarkdown
            {});
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            expect(API.write).toHaveBeenCalledWith('CreateTask', expect.any(Object), expect.any(Object));
            // Verify that Navigation.dismissModalWithReport was NOT called (since isCreatedUsingMarkdown is true)
            expect(Navigation_1.default.dismissModalWithReport).not.toHaveBeenCalled();
        });
        it('should handle task creation with default policy ID', () => {
            // Given: Task creation with default policy ID
            const mockAssigneeChatReport = {
                reportID: 'assignee_chat_789',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    [mockAssigneeAccountID]: {
                        accountID: mockAssigneeAccountID,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
            };
            // When: Call createTaskAndNavigate with default policy ID
            (0, Task_1.createTaskAndNavigate)(mockParentReportID, mockTitle, mockDescription, mockAssigneeEmail, mockAssigneeAccountID, mockAssigneeChatReport, CONST_1.default.POLICY.OWNER_EMAIL_FAKE, // default policy ID
            false, // isCreatedUsingMarkdown
            {});
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            expect(API.write).toHaveBeenCalledWith('CreateTask', expect.objectContaining({
                parentReportID: mockParentReportID,
                htmlTitle: mockTitle,
                description: mockDescription,
                assignee: mockAssigneeEmail,
                assigneeAccountID: mockAssigneeAccountID,
            }), expect.any(Object));
        });
        it('should handle task creation with assignee as current user', () => {
            // Given: Task creation where assignee is the current user
            const mockAssigneeChatReport = {
                reportID: 'assignee_chat_self',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    [mockCurrentUserAccountID]: {
                        accountID: mockCurrentUserAccountID,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
            };
            // When: Call createTaskAndNavigate with assignee as current user
            (0, Task_1.createTaskAndNavigate)(mockParentReportID, mockTitle, mockDescription, mockCurrentUserEmail, mockCurrentUserAccountID, // assignee is current user
            mockAssigneeChatReport, mockPolicyID, false, // isCreatedUsingMarkdown
            {});
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            const calls = API.write.mock.calls;
            expect(calls.length).toBe(1);
            const [command, params, onyx] = calls.at(0);
            expect(command).toBe('CreateTask');
            expect(params).toEqual(expect.objectContaining({
                parentReportID: mockParentReportID,
                htmlTitle: mockTitle,
                description: mockDescription,
                assignee: mockCurrentUserEmail,
                assigneeAccountID: mockCurrentUserAccountID,
            }));
            expect(onyx.optimisticData).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${mockParentReportID}`,
                    value: expect.objectContaining({ hasOutstandingChildTask: true }),
                }),
            ]));
        });
        it('should return early when parentReportID is undefined', () => {
            // Given: Undefined parent report ID
            const mockAssigneeChatReport = {
                reportID: 'assignee_chat_undefined',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    [mockAssigneeAccountID]: {
                        accountID: mockAssigneeAccountID,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
            };
            // When: Call createTaskAndNavigate with undefined parent report ID
            (0, Task_1.createTaskAndNavigate)(undefined, // parentReportID is undefined
            mockTitle, mockDescription, mockAssigneeEmail, mockAssigneeAccountID, mockAssigneeChatReport, mockPolicyID, false, // isCreatedUsingMarkdown
            {});
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            expect(API.write).not.toHaveBeenCalled();
        });
        it('should handle task creation with first quick action', () => {
            // Given: Task creation with empty quick action (first quick action)
            const mockAssigneeChatReport = {
                reportID: 'assignee_chat_first',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                participants: {
                    [mockAssigneeAccountID]: {
                        accountID: mockAssigneeAccountID,
                        role: CONST_1.default.REPORT.ROLE.MEMBER,
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
            };
            // When: Call createTaskAndNavigate with empty quick action
            (0, Task_1.createTaskAndNavigate)(mockParentReportID, mockTitle, mockDescription, mockAssigneeEmail, mockAssigneeAccountID, mockAssigneeChatReport, mockPolicyID, false, // isCreatedUsingMarkdown
            {});
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            expect(API.write).toHaveBeenCalledWith('CreateTask', expect.any(Object), expect.objectContaining({
                optimisticData: expect.arrayContaining([
                    expect.objectContaining({
                        key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
                        value: expect.objectContaining({
                            action: CONST_1.default.QUICK_ACTIONS.ASSIGN_TASK,
                            chatReportID: mockParentReportID,
                            isFirstQuickAction: true, // Should be true for empty quick action
                            targetAccountID: mockAssigneeAccountID,
                        }),
                    }),
                ]),
            }));
        });
    });
});
