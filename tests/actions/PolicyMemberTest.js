"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const DateUtils_1 = require("@libs/DateUtils");
const Localize_1 = require("@libs/Localize");
const CONST_1 = require("@src/CONST");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const Member = require("@src/libs/actions/Policy/Member");
const Policy = require("@src/libs/actions/Policy/Policy");
const ReportActionsUtils = require("@src/libs/ReportActionsUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const personalDetails_1 = require("../utils/collections/personalDetails");
const policies_1 = require("../utils/collections/policies");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
(0, OnyxUpdateManager_1.default)();
describe('actions/PolicyMember', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    let mockFetch;
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    describe('acceptJoinRequest', () => {
        it('Accept user join request to a workspace', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(0),
                policyID: fakePolicy.id,
            };
            const fakeReportAction = {
                ...(0, reportActions_1.default)(0),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_JOIN_REQUEST,
            };
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`, fakeReport);
            react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${fakeReport.reportID}`, {
                [fakeReportAction.reportActionID]: fakeReportAction,
            });
            Member.acceptJoinRequest(fakeReport.reportID, fakeReportAction);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${fakeReport.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const reportAction = reportActions?.[fakeReportAction.reportActionID];
                        if (!(0, EmptyObject_1.isEmptyObject)(reportAction)) {
                            expect(ReportActionsUtils.getOriginalMessage(reportAction)?.choice)?.toBe(CONST_1.default.REPORT.ACTIONABLE_MENTION_JOIN_WORKSPACE_RESOLUTION.ACCEPT);
                            expect(reportAction?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        }
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${fakeReport.reportID}`,
                    waitForCollectionCallback: false,
                    callback: (reportActions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const reportAction = reportActions?.[fakeReportAction.reportActionID];
                        if (!(0, EmptyObject_1.isEmptyObject)(reportAction)) {
                            expect(reportAction?.pendingAction).toBeFalsy();
                        }
                        resolve();
                    },
                });
            });
        });
    });
    describe('updateWorkspaceMembersRole', () => {
        it('Update member to admin role', async () => {
            const fakeUser2 = (0, personalDetails_1.default)(2);
            const fakePolicy = {
                ...(0, policies_1.default)(0),
                employeeList: {
                    [fakeUser2.login ?? '']: {
                        email: fakeUser2.login,
                        role: CONST_1.default.POLICY.ROLE.USER,
                    },
                },
            };
            const adminRoom = { ...(0, reports_1.createRandomReport)(1), chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS, policyID: fakePolicy.id };
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${adminRoom.reportID}`, adminRoom);
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.PERSONAL_DETAILS_LIST}`, { [fakeUser2.accountID]: fakeUser2 });
            await (0, waitForBatchedUpdates_1.default)();
            // When a user's role is set as admin on a policy
            Member.updateWorkspaceMembersRole(fakePolicy.id, [fakeUser2.accountID], CONST_1.default.POLICY.ROLE.ADMIN);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const employee = policy?.employeeList?.[fakeUser2?.login ?? ''];
                        // Then the policy employee role of the user should be set to admin.
                        expect(employee?.role).toBe(CONST_1.default.POLICY.ROLE.ADMIN);
                        resolve();
                    },
                });
            });
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminRoom.reportID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve();
                        // Then the user's notification preference on the admin room should be set to always.
                        expect(report?.participants?.[fakeUser2.accountID].notificationPreference).toBe(CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS);
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const employee = policy?.employeeList?.[fakeUser2?.login ?? ''];
                        expect(employee?.pendingAction).toBeFalsy();
                        resolve();
                    },
                });
            });
            await (0, waitForBatchedUpdates_1.default)();
            // When an admin is demoted from their admin role to a user role
            Member.updateWorkspaceMembersRole(fakePolicy.id, [fakeUser2.accountID], CONST_1.default.POLICY.ROLE.USER);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve();
                        const employee = policy?.employeeList?.[fakeUser2?.login ?? ''];
                        // Then the policy employee role of the user should be set to user.
                        expect(employee?.role).toBe(CONST_1.default.POLICY.ROLE.USER);
                    },
                });
            });
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminRoom.reportID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve();
                        // Then the user should be removed from the admin room participants list of the policy.
                        expect(report?.participants?.[fakeUser2.accountID]).toBeUndefined();
                    },
                });
            });
        });
    });
    describe('requestWorkspaceOwnerChange', () => {
        it('Change the workspace`s owner', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const fakeEmail = 'fake@gmail.com';
            const fakeAccountID = 1;
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email: fakeEmail, accountID: fakeAccountID });
            Member.requestWorkspaceOwnerChange(fakePolicy.id);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.errorFields).toBeFalsy();
                        expect(policy?.isLoading).toBeTruthy();
                        expect(policy?.isChangeOwnerSuccessful).toBeFalsy();
                        expect(policy?.isChangeOwnerFailed).toBeFalsy();
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.isLoading).toBeFalsy();
                        expect(policy?.isChangeOwnerSuccessful).toBeTruthy();
                        expect(policy?.isChangeOwnerFailed)?.toBeFalsy();
                        resolve();
                    },
                });
            });
        });
    });
    describe('addBillingCardAndRequestPolicyOwnerChange', () => {
        it('Add billing card and change the workspace`s owner', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const fakeEmail = 'fake@gmail.com';
            const fakeCard = {
                cardNumber: '1234567890123456',
                cardYear: '2023',
                cardMonth: '05',
                cardCVV: '123',
                addressName: 'John Doe',
                addressZip: '12345',
                currency: 'USD',
            };
            const fakeAccountID = 1;
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email: fakeEmail, accountID: fakeAccountID });
            Policy.addBillingCardAndRequestPolicyOwnerChange(fakePolicy.id, fakeCard);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.errorFields).toBeFalsy();
                        expect(policy?.isLoading).toBeTruthy();
                        expect(policy?.isChangeOwnerSuccessful).toBeFalsy();
                        expect(policy?.isChangeOwnerFailed).toBeFalsy();
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.isLoading).toBeFalsy();
                        expect(policy?.isChangeOwnerSuccessful).toBeTruthy();
                        expect(policy?.isChangeOwnerFailed)?.toBeFalsy();
                        resolve();
                    },
                });
            });
        });
    });
    describe('addMembersToWorkspace', () => {
        it('Add a new member to a workspace', async () => {
            const policyID = '1';
            const defaultApprover = 'approver@gmail.com';
            const newUserEmail = 'user@gmail.com';
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
                approver: defaultApprover,
            });
            mockFetch?.pause?.();
            Member.addMembersToWorkspace({ [newUserEmail]: 1234 }, 'Welcome', policyID, [], CONST_1.default.POLICY.ROLE.USER, TestHelper.formatPhoneNumber);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const newEmployee = policy?.employeeList?.[newUserEmail];
                        expect(newEmployee).not.toBeUndefined();
                        expect(newEmployee?.email).toBe(newUserEmail);
                        expect(newEmployee?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        expect(newEmployee?.role).toBe(CONST_1.default.POLICY.ROLE.USER);
                        expect(newEmployee?.submitsTo).toBe(defaultApprover);
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
        });
        it('Add new members with admin/auditor role to the #admins room', async () => {
            // Given a policy and an #admins room
            const policyID = '1';
            const adminRoomID = '1';
            const defaultApprover = 'approver@gmail.com';
            const ownerAccountID = 1;
            const adminAccountID = 1234;
            const adminEmail = 'admin@example.com';
            const auditorAccountID = 1235;
            const auditorEmail = 'auditor@example.com';
            const userAccountID = 1236;
            const userEmail = 'user@example.com';
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
                approver: defaultApprover,
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${adminRoomID}`, {
                ...(0, reports_1.createRandomReport)(Number(adminRoomID)),
                policyID,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
                participants: {
                    [ownerAccountID]: { notificationPreference: 'always' },
                },
            });
            // When adding a new admin, auditor, and user members
            Member.addMembersToWorkspace({ [adminEmail]: adminAccountID }, 'Welcome', policyID, [], CONST_1.default.POLICY.ROLE.ADMIN, TestHelper.formatPhoneNumber);
            Member.addMembersToWorkspace({ [auditorEmail]: auditorAccountID }, 'Welcome', policyID, [], CONST_1.default.POLICY.ROLE.AUDITOR, TestHelper.formatPhoneNumber);
            Member.addMembersToWorkspace({ [userEmail]: userAccountID }, 'Welcome', policyID, [], CONST_1.default.POLICY.ROLE.USER, TestHelper.formatPhoneNumber);
            await (0, waitForBatchedUpdates_1.default)();
            // Then only the admin and auditor should be added to the #admins room
            const adminRoom = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminRoomID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(report);
                    },
                });
            });
            expect(adminRoom?.participants?.[adminAccountID]).toBeTruthy();
            expect(adminRoom?.participants?.[auditorAccountID]).toBeTruthy();
            expect(adminRoom?.participants?.[userAccountID]).toBeUndefined();
        });
        it('should unarchive existing workspace expense chat and expense report when adding back a member', async () => {
            // Given an archived workspace expense chat and expense report
            const policyID = '1';
            const workspaceReportID = '1';
            const expenseReportID = '2';
            const userAccountID = 1236;
            const userEmail = 'user@example.com';
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${workspaceReportID}`, {
                ...(0, reports_1.createRandomReport)(Number(workspaceReportID)),
                policyID,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                ownerAccountID: userAccountID,
            });
            const expenseAction = {
                ...(0, reportActions_1.default)(0),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                childReportID: expenseReportID,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${workspaceReportID}`, {
                [expenseAction.reportActionID]: expenseAction,
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${workspaceReportID}`, {
                private_isArchived: DateUtils_1.default.getDBTime(),
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${expenseReportID}`, {
                private_isArchived: DateUtils_1.default.getDBTime(),
            });
            // When adding the user to the workspace
            Member.addMembersToWorkspace({ [userEmail]: userAccountID }, 'Welcome', policyID, [], CONST_1.default.POLICY.ROLE.USER, TestHelper.formatPhoneNumber);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the member workspace expense chat and expense report should be unarchive optimistically
            const isWorkspaceChatArchived = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${workspaceReportID}`,
                    callback: (nvp) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(!!nvp?.private_isArchived);
                    },
                });
            });
            const isExpenseReportArchived = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${expenseReportID}`,
                    callback: (nvp) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(!!nvp?.private_isArchived);
                    },
                });
            });
            expect(isWorkspaceChatArchived && isExpenseReportArchived).toBe(false);
        });
    });
    describe('removeMembers', () => {
        it('Remove members with admin/auditor role from the #admins room', async () => {
            // Given a policy and an #admins room
            const policyID = '1';
            const adminRoomID = '1';
            const defaultApprover = 'approver@gmail.com';
            const ownerAccountID = 1;
            const ownerEmail = 'owner@gmail.com';
            const adminAccountID = 1234;
            const adminEmail = 'admin@example.com';
            const auditorAccountID = 1235;
            const auditorEmail = 'auditor@example.com';
            const userAccountID = 1236;
            const userEmail = 'user@example.com';
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.PERSONAL_DETAILS_LIST}`, {
                [adminAccountID]: { login: adminEmail },
                [auditorAccountID]: { login: auditorEmail },
                [userAccountID]: { login: userEmail },
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
                approver: defaultApprover,
                employeeList: {
                    [ownerEmail]: { role: CONST_1.default.POLICY.ROLE.ADMIN },
                    [adminEmail]: { role: CONST_1.default.POLICY.ROLE.ADMIN },
                    [auditorEmail]: { role: CONST_1.default.POLICY.ROLE.AUDITOR },
                    [userEmail]: { role: CONST_1.default.POLICY.ROLE.USER },
                },
            });
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${adminRoomID}`, {
                ...(0, reports_1.createRandomReport)(Number(adminRoomID)),
                policyID,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
                participants: {
                    [ownerAccountID]: { notificationPreference: 'always' },
                    [adminAccountID]: { notificationPreference: 'always' },
                    [auditorAccountID]: { notificationPreference: 'always' },
                    [userAccountID]: { notificationPreference: 'always' },
                },
            });
            // When removing am admin, auditor, and user members
            mockFetch?.pause?.();
            Member.removeMembers([adminAccountID, auditorAccountID, userAccountID], policyID);
            await (0, waitForBatchedUpdates_1.default)();
            // Then only the admin and auditor should be removed from the #admins room
            const optimisticAdminRoomMetadata = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${adminRoomID}`,
                    callback: (reportMetadata) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reportMetadata);
                    },
                });
            });
            expect(optimisticAdminRoomMetadata?.pendingChatMembers?.length).toBe(2);
            expect(optimisticAdminRoomMetadata?.pendingChatMembers?.find((pendingMember) => pendingMember.accountID === String(adminAccountID))?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            expect(optimisticAdminRoomMetadata?.pendingChatMembers?.find((pendingMember) => pendingMember.accountID === String(auditorAccountID))?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            await mockFetch?.resume?.();
            const successAdminRoomMetadata = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${adminRoomID}`,
                    callback: (reportMetadata) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(reportMetadata);
                    },
                });
            });
            expect(successAdminRoomMetadata?.pendingChatMembers).toBeUndefined();
        });
        it('should archive the member expense chat and expense report', async () => {
            // Given a workspace expense chat and expense report
            const policyID = '1';
            const workspaceReportID = '1';
            const expenseReportID = '2';
            const userAccountID = 1236;
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${workspaceReportID}`, {
                ...(0, reports_1.createRandomReport)(Number(workspaceReportID)),
                policyID,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                ownerAccountID: userAccountID,
            });
            const expenseAction = {
                ...(0, reportActions_1.default)(0),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
                childReportID: expenseReportID,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${workspaceReportID}`, {
                [expenseAction.reportActionID]: expenseAction,
            });
            // When removing a member from the workspace
            mockFetch?.pause?.();
            Member.removeMembers([userAccountID], policyID);
            await (0, waitForBatchedUpdates_1.default)();
            // Then the member workspace expense chat and expense report should be archived optimistically
            const isWorkspaceChatArchived = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${workspaceReportID}`,
                    callback: (nvp) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(!!nvp?.private_isArchived);
                    },
                });
            });
            const isExpenseReportArchived = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${expenseReportID}`,
                    callback: (nvp) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(!!nvp?.private_isArchived);
                    },
                });
            });
            expect(isWorkspaceChatArchived && isExpenseReportArchived).toBe(true);
            await mockFetch?.resume?.();
        });
    });
    describe('importPolicyMembers', () => {
        it('should show a "single member added message" when a new member is added', async () => {
            // Given a workspace
            const policyID = '1';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
            });
            // When importing 1 new member to the workspace
            Member.importPolicyMembers(policyID, [{ email: 'user@gmail.com', role: 'user' }]);
            await (0, waitForBatchedUpdates_1.default)();
            const importedSpreadsheet = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            // Then it should show the singular member added success message
            expect(importedSpreadsheet?.importFinalModal.prompt).toBe((0, Localize_1.translateLocal)('spreadsheet.importMembersSuccessfulDescription', { added: 1, updated: 0 }));
        });
        it('should show a "multiple members added message" when multiple new members are added', async () => {
            // Given a workspace
            const policyID = '1';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
            });
            // When importing multiple new members to the workspace
            Member.importPolicyMembers(policyID, [
                { email: 'user@gmail.com', role: 'user' },
                { email: 'user2@gmail.com', role: 'user' },
            ]);
            await (0, waitForBatchedUpdates_1.default)();
            const importedSpreadsheet = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            // Then it should show the plural member added success message
            expect(importedSpreadsheet?.importFinalModal.prompt).toBe((0, Localize_1.translateLocal)('spreadsheet.importMembersSuccessfulDescription', { added: 2, updated: 0 }));
        });
        it('should show a "no members added/updated message" when no new members are added or updated', async () => {
            // Given a workspace
            const policyID = '1';
            const userEmail = 'user@gmail.com';
            const userRole = 'user';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
                employeeList: {
                    [userEmail]: {
                        role: userRole,
                    },
                },
            });
            // When importing 1 existing member to the workspace with the same role
            Member.importPolicyMembers(policyID, [{ email: userEmail, role: userRole }]);
            await (0, waitForBatchedUpdates_1.default)();
            const importedSpreadsheet = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            // Then it should show the no member added/updated message
            expect(importedSpreadsheet?.importFinalModal.prompt).toBe((0, Localize_1.translateLocal)('spreadsheet.importMembersSuccessfulDescription', { added: 0, updated: 0 }));
        });
        it('should show a "single member updated message" when a member is updated', async () => {
            // Given a workspace
            const policyID = '1';
            const userEmail = 'user@gmail.com';
            const userRole = 'user';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
                employeeList: {
                    [userEmail]: {
                        role: userRole,
                    },
                },
            });
            // When importing 1 existing member with a different role
            Member.importPolicyMembers(policyID, [{ email: userEmail, role: 'admin' }]);
            await (0, waitForBatchedUpdates_1.default)();
            const importedSpreadsheet = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            // Then it should show the singular member updated success message
            expect(importedSpreadsheet?.importFinalModal.prompt).toBe((0, Localize_1.translateLocal)('spreadsheet.importMembersSuccessfulDescription', { added: 0, updated: 1 }));
        });
        it('should show a "multiple members updated message" when multiple members are updated', async () => {
            // Given a workspace
            const policyID = '1';
            const userEmail = 'user@gmail.com';
            const userRole = 'user';
            const userEmail2 = 'user2@gmail.com';
            const userRole2 = 'user';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
                employeeList: {
                    [userEmail]: {
                        role: userRole,
                    },
                    [userEmail2]: {
                        role: userRole2,
                    },
                },
            });
            // When importing multiple existing members with a different role
            Member.importPolicyMembers(policyID, [
                { email: userEmail, role: 'admin' },
                { email: userEmail2, role: 'admin' },
            ]);
            await (0, waitForBatchedUpdates_1.default)();
            const importedSpreadsheet = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            // Then it should show the plural member updated success message
            expect(importedSpreadsheet?.importFinalModal.prompt).toBe((0, Localize_1.translateLocal)('spreadsheet.importMembersSuccessfulDescription', { added: 0, updated: 2 }));
        });
        it('should show a "single member added and updated message" when a member is both added and updated', async () => {
            // Given a workspace
            const policyID = '1';
            const userEmail = 'user@gmail.com';
            const userRole = 'user';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
                employeeList: {
                    [userEmail]: {
                        role: userRole,
                    },
                },
            });
            // When importing 1 new member and 1 existing member with a different role
            Member.importPolicyMembers(policyID, [
                { email: 'new_user@gmail.com', role: 'user' },
                { email: userEmail, role: 'admin' },
            ]);
            await (0, waitForBatchedUpdates_1.default)();
            const importedSpreadsheet = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            // Then it should show the singular member added and updated success message
            expect(importedSpreadsheet?.importFinalModal.prompt).toBe((0, Localize_1.translateLocal)('spreadsheet.importMembersSuccessfulDescription', { added: 1, updated: 1 }));
        });
        it('should show a "multiple members added and updated message" when multiple members are both added and updated', async () => {
            // Given a workspace
            const policyID = '1';
            const userEmail = 'user@gmail.com';
            const userRole = 'user';
            const userEmail2 = 'user2@gmail.com';
            const userRole2 = 'user';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                ...(0, policies_1.default)(Number(policyID)),
                employeeList: {
                    [userEmail]: {
                        role: userRole,
                    },
                    [userEmail2]: {
                        role: userRole2,
                    },
                },
            });
            // When importing multiple new members and multiple existing members with a different role
            Member.importPolicyMembers(policyID, [
                { email: 'new_user@gmail.com', role: 'user' },
                { email: 'new_user2@gmail.com', role: 'user' },
                { email: userEmail, role: 'admin' },
                { email: userEmail2, role: 'admin' },
            ]);
            await (0, waitForBatchedUpdates_1.default)();
            const importedSpreadsheet = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                });
            });
            // Then it should show the plural member added and updated success message
            expect(importedSpreadsheet?.importFinalModal.prompt).toBe((0, Localize_1.translateLocal)('spreadsheet.importMembersSuccessfulDescription', { added: 2, updated: 2 }));
        });
    });
});
