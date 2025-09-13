"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_native_onyx_1 = require("react-native-onyx");
const OnboardingFlow_1 = require("@libs/actions/Welcome/OnboardingFlow");
const Localize_1 = require("@libs/Localize");
// eslint-disable-next-line no-restricted-syntax
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
// eslint-disable-next-line no-restricted-syntax
const PolicyUtils = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const Policy = require("@src/libs/actions/Policy/Policy");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const reports_1 = require("../utils/collections/reports");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const ESH_EMAIL = 'eshgupta1217@gmail.com';
const ESH_ACCOUNT_ID = 1;
const ESH_PARTICIPANT_ADMINS_ROOM = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS };
const ESH_PARTICIPANT_EXPENSE_CHAT = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS };
const WORKSPACE_NAME = "Esh's Workspace";
(0, OnyxUpdateManager_1.default)();
describe('actions/Policy', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    let mockFetch;
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    describe('createWorkspace', () => {
        afterEach(() => {
            mockFetch?.resume?.();
        });
        it('creates a new workspace', async () => {
            fetch?.pause?.();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: ESH_EMAIL, accountID: ESH_ACCOUNT_ID });
            const fakePolicy = (0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.PERSONAL);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID}`, fakePolicy.id);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.NVP_INTRO_SELECTED}`, { choice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM });
            await (0, waitForBatchedUpdates_1.default)();
            let adminReportID;
            let expenseReportID;
            const policyID = Policy.generatePolicyID();
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM,
            });
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            const activePolicyID = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID}`,
                    callback: (id) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(id);
                    },
                });
            });
            // check if NVP_ACTIVE_POLICY_ID is updated to created policy id
            expect(activePolicyID).toBe(policyID);
            // check if policy was created with correct values
            expect(policy?.id).toBe(policyID);
            expect(policy?.name).toBe(WORKSPACE_NAME);
            expect(policy?.type).toBe(CONST_1.default.POLICY.TYPE.TEAM);
            expect(policy?.role).toBe(CONST_1.default.POLICY.ROLE.ADMIN);
            expect(policy?.owner).toBe(ESH_EMAIL);
            expect(policy?.areWorkflowsEnabled).toBe(true);
            expect(policy?.approvalMode).toBe(CONST_1.default.POLICY.APPROVAL_MODE.BASIC);
            expect(policy?.approver).toBe(ESH_EMAIL);
            expect(policy?.isPolicyExpenseChatEnabled).toBe(true);
            expect(policy?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
            expect(policy?.employeeList).toEqual({ [ESH_EMAIL]: { email: ESH_EMAIL, submitsTo: ESH_EMAIL, errors: {}, role: CONST_1.default.POLICY.ROLE.ADMIN } });
            expect(policy?.mccGroup).toBeDefined();
            expect(policy?.requiresCategory).toBe(true);
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
            // These reports should be created: #admins and expense report + task reports of manage team (default) intent
            const workspaceReports = Object.values(allReports ?? {})
                .filter((report) => report?.policyID === policyID)
                .filter((report) => report?.type !== 'task');
            expect(workspaceReports.length).toBe(2);
            workspaceReports.forEach((report) => {
                expect(report?.pendingFields?.addWorkspaceRoom).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                switch (report?.chatType) {
                    case CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS: {
                        expect(report?.participants).toEqual({ [ESH_ACCOUNT_ID]: ESH_PARTICIPANT_ADMINS_ROOM });
                        adminReportID = report.reportID;
                        break;
                    }
                    case CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT: {
                        expect(report?.participants).toEqual({ [ESH_ACCOUNT_ID]: ESH_PARTICIPANT_EXPENSE_CHAT });
                        expenseReportID = report.reportID;
                        break;
                    }
                    default:
                        break;
                }
            });
            let reportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (actions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actions);
                    },
                });
            });
            // Each of the three reports should have a `CREATED` action.
            let adminReportActions = Object.values(reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminReportID}`] ?? {});
            let expenseReportActions = Object.values(reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReportID}`] ?? {});
            let workspaceReportActions = adminReportActions.concat(expenseReportActions);
            expect(expenseReportActions.length).toBe(1);
            [...expenseReportActions].forEach((reportAction) => {
                expect(reportAction.actionName).toBe(CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                expect(reportAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                expect(reportAction.actorAccountID).toBe(ESH_ACCOUNT_ID);
            });
            // Following tasks are filtered in prepareOnboardingOnyxData: 'viewTour', 'addAccountingIntegration' and 'setupCategoriesAndTags' (-3)
            const { onboardingMessages } = (0, OnboardingFlow_1.getOnboardingMessages)();
            const expectedManageTeamDefaultTasksCount = onboardingMessages[CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM].tasks.length - 3;
            // After filtering, two actions are added to the list =- signoff message (+1) and default create action (+1)
            const expectedReportActionsOfTypeCreatedCount = 1;
            const expectedSignOffMessagesCount = 1;
            expect(adminReportActions.length).toBe(expectedManageTeamDefaultTasksCount + expectedReportActionsOfTypeCreatedCount + expectedSignOffMessagesCount);
            let reportActionsOfTypeCreatedCount = 0;
            let signOffMessagesCount = 0;
            let manageTeamTasksCount = 0;
            adminReportActions.forEach((reportAction) => {
                if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED) {
                    reportActionsOfTypeCreatedCount++;
                    expect(reportAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                    expect(reportAction.actorAccountID).toBe(ESH_ACCOUNT_ID);
                    return;
                }
                if (reportAction.childType === CONST_1.default.REPORT.TYPE.TASK) {
                    manageTeamTasksCount++;
                    expect(reportAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                    // we dont check actorAccountID as it will be a random account id for the guide
                    return;
                }
                signOffMessagesCount++;
            });
            expect(reportActionsOfTypeCreatedCount).toBe(expectedReportActionsOfTypeCreatedCount);
            expect(signOffMessagesCount).toBe(expectedSignOffMessagesCount);
            expect(manageTeamTasksCount).toBe(expectedManageTeamDefaultTasksCount);
            // Check for success data
            fetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.POLICY,
                    waitForCollectionCallback: true,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            // Check if the policy pending action was cleared
            expect(policy?.pendingAction).toBeFalsy();
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
            // Check if the report pending action and fields were cleared
            Object.values(allReports ?? {}).forEach((report) => {
                expect(report?.pendingAction).toBeFalsy();
                expect(report?.pendingFields?.addWorkspaceRoom).toBeFalsy();
            });
            reportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (actions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actions);
                    },
                });
            });
            // Check if the report action pending action was cleared
            adminReportActions = Object.values(reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminReportID}`] ?? {});
            expenseReportActions = Object.values(reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReportID}`] ?? {});
            workspaceReportActions = adminReportActions.concat(expenseReportActions);
            workspaceReportActions.forEach((reportAction) => {
                expect(reportAction.pendingAction).toBeFalsy();
            });
        });
        it('duplicate workspace', async () => {
            fetch?.pause?.();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: ESH_EMAIL, accountID: ESH_ACCOUNT_ID });
            const fakePolicy = (0, policies_1.default)(10, CONST_1.default.POLICY.TYPE.PERSONAL);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID}`, fakePolicy.id);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.NVP_INTRO_SELECTED}`, { choice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM });
            await (0, waitForBatchedUpdates_1.default)();
            let adminReportID;
            let expenseReportID;
            const POLICY_NAME = 'Duplicate Workspace';
            const policyID = Policy.generatePolicyID();
            const options = {
                policyName: POLICY_NAME,
                policyID: fakePolicy.id,
                targetPolicyID: policyID,
                welcomeNote: 'Join my policy',
                parts: {
                    people: true,
                    reports: true,
                    connections: true,
                    categories: true,
                    tags: true,
                    taxes: true,
                    perDiem: true,
                    reimbursements: true,
                    expenses: true,
                    customUnits: true,
                    invoices: true,
                    exportLayouts: true,
                },
            };
            Policy.duplicateWorkspace(fakePolicy, options);
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            expect(policy?.id).toBe(policyID);
            // check if policy was created with correct values
            expect(policy?.id).toBe(policyID);
            expect(policy?.name).toBe(POLICY_NAME);
            expect(policy?.type).toBe(fakePolicy.type);
            expect(policy?.role).toBe(fakePolicy.role);
            expect(policy?.owner).toBe(fakePolicy.owner);
            expect(policy?.areWorkflowsEnabled).toBe(true);
            expect(policy?.areDistanceRatesEnabled).toBe(true);
            expect(policy?.areInvoicesEnabled).toBe(true);
            expect(policy?.arePerDiemRatesEnabled).toBe(true);
            expect(policy?.approvalMode).toBe(fakePolicy.approvalMode);
            expect(policy?.approver).toBe(fakePolicy.approver);
            expect(policy?.isPolicyExpenseChatEnabled).toBe(fakePolicy.isPolicyExpenseChatEnabled);
            expect(policy?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
            expect(policy?.employeeList).toEqual(fakePolicy.employeeList);
            expect(policy?.mccGroup).toBe(fakePolicy.mccGroup);
            expect(policy?.requiresCategory).toBe(fakePolicy.requiresCategory);
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
            // These reports should be created: #admins and expense report + task reports of manage team (default) intent
            const workspaceReports = Object.values(allReports ?? {})
                .filter((report) => report?.policyID === policyID)
                .filter((report) => report?.type !== 'task');
            expect(workspaceReports.length).toBe(2);
            workspaceReports.forEach((report) => {
                expect(report?.pendingFields?.addWorkspaceRoom).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                switch (report?.chatType) {
                    case CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS: {
                        expect(report?.participants).toEqual({ [ESH_ACCOUNT_ID]: ESH_PARTICIPANT_ADMINS_ROOM });
                        adminReportID = report.reportID;
                        break;
                    }
                    case CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT: {
                        expect(report?.participants).toEqual({ [ESH_ACCOUNT_ID]: ESH_PARTICIPANT_EXPENSE_CHAT });
                        expenseReportID = report.reportID;
                        break;
                    }
                    default:
                        break;
                }
            });
            let reportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (actions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actions);
                    },
                });
            });
            // Each of the three reports should have a `CREATED` action.
            let adminReportActions = Object.values(reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminReportID}`] ?? {});
            let expenseReportActions = Object.values(reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReportID}`] ?? {});
            let workspaceReportActions = adminReportActions.concat(expenseReportActions);
            expect(expenseReportActions.length).toBe(1);
            [...expenseReportActions].forEach((reportAction) => {
                expect(reportAction.actionName).toBe(CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
                expect(reportAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                expect(reportAction.actorAccountID).toBe(ESH_ACCOUNT_ID);
            });
            // After filtering, two actions are added to the list =- signoff message (+1) and default create action (+1)
            const expectedReportActionsOfTypeCreatedCount = 1;
            expect(adminReportActions.length).toBe(1);
            let reportActionsOfTypeCreatedCount = 0;
            adminReportActions.forEach((reportAction) => {
                if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED) {
                    reportActionsOfTypeCreatedCount++;
                    expect(reportAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                    expect(reportAction.actorAccountID).toBe(ESH_ACCOUNT_ID);
                    return;
                }
                if (reportAction.childType === CONST_1.default.REPORT.TYPE.TASK) {
                    expect(reportAction.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                }
            });
            expect(reportActionsOfTypeCreatedCount).toBe(expectedReportActionsOfTypeCreatedCount);
            // Check for success data
            fetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.POLICY,
                    waitForCollectionCallback: true,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            // Check if the policy pending action was cleared
            expect(policy?.pendingAction).toBeFalsy();
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
            // Check if the report pending action and fields were cleared
            Object.values(allReports ?? {}).forEach((report) => {
                expect(report?.pendingAction).toBeFalsy();
                expect(report?.pendingFields?.addWorkspaceRoom).toBeFalsy();
            });
            reportActions = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
                    waitForCollectionCallback: true,
                    callback: (actions) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(actions);
                    },
                });
            });
            // Check if the report action pending action was cleared
            adminReportActions = Object.values(reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminReportID}`] ?? {});
            expenseReportActions = Object.values(reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReportID}`] ?? {});
            workspaceReportActions = adminReportActions.concat(expenseReportActions);
            workspaceReportActions.forEach((reportAction) => {
                expect(reportAction.pendingAction).toBeFalsy();
            });
        });
        it('creates a new workspace with BASIC approval mode if the introSelected is MANAGE_TEAM', async () => {
            const policyID = Policy.generatePolicyID();
            // When a new workspace is created with introSelected set to MANAGE_TEAM
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM,
            });
            await (0, waitForBatchedUpdates_1.default)();
            const policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            // Then the policy should have approval mode set to BASIC
            expect(policy?.approvalMode).toBe(CONST_1.default.POLICY.APPROVAL_MODE.BASIC);
        });
        it('creates a new workspace with OPTIONAL approval mode if the introSelected is TRACK_WORKSPACE', async () => {
            const policyID = Policy.generatePolicyID();
            // When a new workspace is created with introSelected set to TRACK_WORKSPACE
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE,
            });
            await (0, waitForBatchedUpdates_1.default)();
            const policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            // Then the policy should have approval mode set to OPTIONAL
            expect(policy?.approvalMode).toBe(CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL);
        });
        it('create a new workspace fails will reset hasCompletedGuidedSetupFlow to the correct value', async () => {
            fetch?.pause?.();
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: ESH_EMAIL, accountID: ESH_ACCOUNT_ID });
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_ONBOARDING, { hasCompletedGuidedSetupFlow: true, chatReportID: '12345' });
            await (0, waitForBatchedUpdates_1.default)();
            fetch?.fail?.();
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID: undefined,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND,
            });
            await (0, waitForBatchedUpdates_1.default)();
            fetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            let onboarding;
            await TestHelper.getOnyxData({
                key: ONYXKEYS_1.default.NVP_ONBOARDING,
                waitForCollectionCallback: false,
                callback: (val) => {
                    onboarding = val;
                },
            });
            expect(onboarding?.hasCompletedGuidedSetupFlow).toBeTruthy();
        });
        it('create a new workspace with delayed submission set to manually if the onboarding choice is newDotManageTeam or newDotLookingAround', async () => {
            const policyID = Policy.generatePolicyID();
            // When a new workspace is created with introSelected set to MANAGE_TEAM
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM,
            });
            await (0, waitForBatchedUpdates_1.default)();
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                waitForCollectionCallback: false,
                callback: (policy) => {
                    // Then the autoReportingFrequency should be set to manually
                    expect(policy?.autoReportingFrequency).toBe(CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE);
                    expect(policy?.areWorkflowsEnabled).toBeTruthy();
                    expect(policy?.harvesting?.enabled).toBe(false);
                },
            });
        });
        it('create a new workspace with delayed submission set to manually if the onboarding choice is not selected', async () => {
            const policyID = Policy.generatePolicyID();
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: undefined,
            });
            await (0, waitForBatchedUpdates_1.default)();
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                waitForCollectionCallback: false,
                callback: (policy) => {
                    // Then the autoReportingFrequency should be set to manually
                    expect(policy?.autoReportingFrequency).toBe(CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE);
                    expect(policy?.areWorkflowsEnabled).toBeTruthy();
                    expect(policy?.harvesting?.enabled).toBe(false);
                },
            });
        });
        it('create a new workspace with enabled workflows if the onboarding choice is newDotManageTeam', async () => {
            const policyID = Policy.generatePolicyID();
            // When a new workspace is created with introSelected set to MANAGE_TEAM
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM,
            });
            await (0, waitForBatchedUpdates_1.default)();
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                waitForCollectionCallback: false,
                callback: (policy) => {
                    // Then the workflows feature is enabled
                    expect(policy?.areWorkflowsEnabled).toBeTruthy();
                },
            });
        });
        it('create a new workspace with enabled workflows if the onboarding choice is newDotLookingAround', async () => {
            const policyID = Policy.generatePolicyID();
            // When a new workspace is created with introSelected set to LOOKING_AROUND
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND,
            });
            await (0, waitForBatchedUpdates_1.default)();
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                waitForCollectionCallback: false,
                callback: (policy) => {
                    // Then the workflows feature is enabled
                    expect(policy?.areWorkflowsEnabled).toBeTruthy();
                },
            });
        });
        it('create a new workspace with enabled workflows if the onboarding choice is newDotTrackWorkspace', async () => {
            const policyID = Policy.generatePolicyID();
            // When a new workspace is created with introSelected set to TRACK_WORKSPACE
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE,
            });
            await (0, waitForBatchedUpdates_1.default)();
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                waitForCollectionCallback: false,
                callback: (policy) => {
                    // Then workflows is enabled
                    expect(policy?.areWorkflowsEnabled).toBeTruthy();
                },
            });
        });
        it('create a new workspace with disabled workflows if the onboarding choice is newDotEmployer', async () => {
            const policyID = Policy.generatePolicyID();
            // When a new workspace is created with introSelected set to EMPLOYER
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.EMPLOYER,
            });
            await (0, waitForBatchedUpdates_1.default)();
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                waitForCollectionCallback: false,
                callback: (policy) => {
                    // Then workflows are not enabled
                    expect(policy?.areWorkflowsEnabled).toBeFalsy();
                },
            });
        });
        it('create a new workspace with disabled workflows if the onboarding choice is newDotSplitChat', async () => {
            const policyID = Policy.generatePolicyID();
            // When a new workspace is created with introSelected set to CHAT_SPLIT
            Policy.createWorkspace({
                policyOwnerEmail: ESH_EMAIL,
                makeMeAdmin: true,
                policyName: WORKSPACE_NAME,
                policyID,
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT,
            });
            await (0, waitForBatchedUpdates_1.default)();
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                waitForCollectionCallback: false,
                callback: (policy) => {
                    // Then workflows are not enabled
                    expect(policy?.areWorkflowsEnabled).toBeFalsy();
                },
            });
        });
    });
    describe('upgradeToCorporate', () => {
        it('upgradeToCorporate should not alter initial values of autoReporting and autoReportingFrequency', async () => {
            const autoReporting = true;
            const autoReportingFrequency = CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT;
            // Given that a policy has autoReporting initially set to true and autoReportingFrequency set to instant.
            const fakePolicy = {
                ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM),
                autoReporting,
                autoReportingFrequency,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            // When a policy is upgradeToCorporate
            Policy.upgradeToCorporate(fakePolicy.id);
            await (0, waitForBatchedUpdates_1.default)();
            const policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            // Then the policy autoReporting and autoReportingFrequency should equal the initial value.
            expect(policy?.autoReporting).toBe(autoReporting);
            expect(policy?.autoReportingFrequency).toBe(autoReportingFrequency);
        });
    });
    describe('disableWorkflows', () => {
        it('disableWorkflow should reset autoReportingFrequency to INSTANT', async () => {
            const autoReporting = true;
            const autoReportingFrequency = CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY;
            // Given that a policy has autoReporting initially set to true and autoReportingFrequency set to monthly.
            const fakePolicy = {
                ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM),
                autoReporting,
                autoReportingFrequency,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            // When workflows are disabled for the policy
            Policy.enablePolicyWorkflows(fakePolicy.id, false);
            await (0, waitForBatchedUpdates_1.default)();
            const policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            // Then the policy autoReportingFrequency should revert to "INSTANT"
            expect(policy?.autoReporting).toBe(false);
            expect(policy?.autoReportingFrequency).toBe(CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT);
        });
    });
    describe('enablePolicyRules', () => {
        it('should disable preventSelfApproval when the rule feature is turned off', async () => {
            fetch?.pause?.();
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: ESH_EMAIL, accountID: ESH_ACCOUNT_ID });
            const fakePolicy = {
                ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM),
                areRulesEnabled: true,
                preventSelfApproval: true,
            };
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            await (0, waitForBatchedUpdates_1.default)();
            // Disable the rule feature
            Policy.enablePolicyRules(fakePolicy.id, false);
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            // Check if the preventSelfApproval is reset to false
            expect(policy?.preventSelfApproval).toBeFalsy();
            expect(policy?.areRulesEnabled).toBeFalsy();
            expect(policy?.pendingFields?.areRulesEnabled).toEqual(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
            fetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    callback: (workspace) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(workspace);
                    },
                });
            });
            // Check if the pending action is cleared
            expect(policy?.pendingFields?.areRulesEnabled).toBeFalsy();
        });
    });
    describe('deleteWorkspace', () => {
        it('should apply failure data when deleteWorkspace fails', async () => {
            // Given a policy
            const fakePolicy = (0, policies_1.default)(0);
            const fakeReport = {
                ...(0, reports_1.createRandomReport)(0),
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                policyName: fakePolicy.name,
            };
            const fakeReimbursementAccount = { errors: {} };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`, fakeReport);
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, fakeReimbursementAccount);
            // When deleting a workspace fails
            mockFetch?.fail?.();
            Policy.deleteWorkspace(fakePolicy.id, fakePolicy.name, undefined);
            await (0, waitForBatchedUpdates_1.default)();
            // Then it should apply the correct failure data
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.pendingAction).toBeUndefined();
                        expect(policy?.avatarURL).toBe(fakePolicy.avatarURL);
                        resolve();
                    },
                });
            });
            // Unarchive the report (report key)
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${fakeReport.reportID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(report?.stateNum).toBe(fakeReport.stateNum);
                        expect(report?.statusNum).toBe(fakeReport.statusNum);
                        expect(report?.policyName).toBe(fakeReport.policyName);
                        expect(report?.oldPolicyName).toBe(fakePolicy.name);
                        resolve();
                    },
                });
            });
            // Unarchive the report (reportNameValuePairs key)
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${fakeReport.reportID}`,
                    callback: (reportNameValuePairs) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(reportNameValuePairs?.private_isArchived).toBeUndefined();
                        resolve();
                    },
                });
            });
            // Restore the reimbursement account errors
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                    callback: (reimbursementAccount) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(reimbursementAccount?.errors).not.toBeUndefined();
                        resolve();
                    },
                });
            });
        });
        it('should remove violation from expense report', async () => {
            const policyID = '123';
            const expenseChatReportID = '1';
            const expenseReportID = '2';
            const transactionID = '3';
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`, {
                ...(0, reports_1.createRandomReport)(Number(expenseChatReportID)),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                policyID,
                iouReportID: expenseReportID,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, {
                reportID: expenseReportID,
                transactionID,
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`, [
                { name: 'cashExpenseWithNoReceipt', type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                { name: 'hold', type: CONST_1.default.VIOLATION_TYPES.WARNING },
            ]);
            Policy.deleteWorkspace(policyID, 'test', undefined);
            await (0, waitForBatchedUpdates_1.default)();
            const violations = await new Promise((resolve) => {
                react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
                    callback: resolve,
                });
            });
            expect(violations?.every((violation) => violation.type !== CONST_1.default.VIOLATION_TYPES.VIOLATION)).toBe(true);
        });
        it('should update active policy ID to personal policy when deleting the active policy', async () => {
            const personalPolicy = (0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.PERSONAL);
            const teamPolicy = (0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${personalPolicy.id}`, personalPolicy);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${teamPolicy.id}`, teamPolicy);
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, teamPolicy.id);
            await (0, waitForBatchedUpdates_1.default)();
            jest.spyOn(PolicyUtils, 'getPersonalPolicy').mockReturnValue(personalPolicy);
            Policy.deleteWorkspace(teamPolicy.id, teamPolicy.name, undefined);
            await (0, waitForBatchedUpdates_1.default)();
            const activePolicyID = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
                    callback: (policyID) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(policyID);
                    },
                });
            });
            expect(activePolicyID).toBe(personalPolicy.id);
        });
        it('should reset lastAccessedWorkspacePolicyID when deleting the last accessed workspace', async () => {
            const policyToDelete = (0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM);
            const lastAccessedWorkspacePolicyID = policyToDelete.id;
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyToDelete.id}`, policyToDelete);
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.LAST_ACCESSED_WORKSPACE_POLICY_ID, lastAccessedWorkspacePolicyID);
            await (0, waitForBatchedUpdates_1.default)();
            Policy.deleteWorkspace(policyToDelete.id, policyToDelete.name, lastAccessedWorkspacePolicyID);
            await (0, waitForBatchedUpdates_1.default)();
            const lastAccessedWorkspacePolicyIDAfterDelete = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.LAST_ACCESSED_WORKSPACE_POLICY_ID,
                    callback: (policyID) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(policyID);
                    },
                });
            });
            expect(lastAccessedWorkspacePolicyIDAfterDelete).toBeUndefined();
        });
        it('should not reset lastAccessedWorkspacePolicyID when deleting a different workspace', async () => {
            const policyToDelete = (0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM);
            const differentPolicy = (0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM);
            const lastAccessedWorkspacePolicyID = differentPolicy.id;
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyToDelete.id}`, policyToDelete);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${differentPolicy.id}`, differentPolicy);
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.LAST_ACCESSED_WORKSPACE_POLICY_ID, lastAccessedWorkspacePolicyID);
            await (0, waitForBatchedUpdates_1.default)();
            Policy.deleteWorkspace(policyToDelete.id, policyToDelete.name, lastAccessedWorkspacePolicyID);
            await (0, waitForBatchedUpdates_1.default)();
            const lastAccessedWorkspacePolicyIDAfterDelete = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.LAST_ACCESSED_WORKSPACE_POLICY_ID,
                    callback: (policyID) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(policyID);
                    },
                });
            });
            expect(lastAccessedWorkspacePolicyIDAfterDelete).toBe(lastAccessedWorkspacePolicyID);
        });
    });
    const TEST_EMAIL = 'esh@gmail.com';
    const TEST_EMAIL_2 = 'eshofficial@gmail.com';
    const TEST_ACCOUNT_ID = 1;
    const TEST_DISPLAY_NAME = 'Esh Gupta';
    const TEST_PHONE_NUMBER = '1234567890';
    const TEST_NON_PUBLIC_DOMAIN_EMAIL = 'esh@example.com';
    const TEST_SMS_DOMAIN_EMAIL = 'esh@expensify.sms';
    describe('generateDefaultWorkspaceName', () => {
        beforeAll(() => {
            react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.POLICY, {});
        });
        it('should generate a workspace name based on the email domain when the domain is not public', () => {
            const domain = 'example.com';
            const displayNameForWorkspace = expensify_common_1.Str.UCFirst(domain.split('.').at(0) ?? '');
            jest.spyOn(PersonalDetailsUtils, 'getPersonalDetailByEmail').mockReturnValue({
                displayName: TEST_DISPLAY_NAME,
                phoneNumber: TEST_PHONE_NUMBER,
                accountID: TEST_ACCOUNT_ID,
            });
            const workspaceName = Policy.generateDefaultWorkspaceName(TEST_NON_PUBLIC_DOMAIN_EMAIL);
            expect(workspaceName).toBe((0, Localize_1.translateLocal)('workspace.new.workspaceName', { userName: displayNameForWorkspace }));
        });
        it('should generate a workspace name based on the display name when the domain is public and display name is available', () => {
            const displayNameForWorkspace = expensify_common_1.Str.UCFirst(TEST_DISPLAY_NAME);
            jest.spyOn(PersonalDetailsUtils, 'getPersonalDetailByEmail').mockReturnValue({
                displayName: TEST_DISPLAY_NAME,
                phoneNumber: TEST_PHONE_NUMBER,
                accountID: TEST_ACCOUNT_ID,
            });
            const workspaceName = Policy.generateDefaultWorkspaceName(TEST_EMAIL);
            expect(workspaceName).toBe((0, Localize_1.translateLocal)('workspace.new.workspaceName', { userName: displayNameForWorkspace }));
        });
        it('should generate a workspace name based on the username when the domain is public and display name is not available', () => {
            const emailParts = TEST_EMAIL_2.split('@');
            const username = emailParts.at(0) ?? '';
            const displayNameForWorkspace = expensify_common_1.Str.UCFirst(username);
            jest.spyOn(PersonalDetailsUtils, 'getPersonalDetailByEmail').mockReturnValue({
                displayName: '',
                phoneNumber: TEST_PHONE_NUMBER,
                accountID: TEST_ACCOUNT_ID,
            });
            const workspaceName = Policy.generateDefaultWorkspaceName(TEST_EMAIL_2);
            expect(workspaceName).toBe((0, Localize_1.translateLocal)('workspace.new.workspaceName', { userName: displayNameForWorkspace }));
        });
        it('should generate a workspace name with an incremented number when there are existing policies with similar names', async () => {
            const existingPolicies = {
                ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.PERSONAL, `${TEST_DISPLAY_NAME}'s Workspace`),
                ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.PERSONAL, `${TEST_DISPLAY_NAME}'s Workspace 1`),
            };
            jest.spyOn(PersonalDetailsUtils, 'getPersonalDetailByEmail').mockReturnValue({
                displayName: TEST_DISPLAY_NAME,
                phoneNumber: TEST_PHONE_NUMBER,
                accountID: TEST_ACCOUNT_ID,
            });
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.POLICY, existingPolicies);
            const workspaceName = Policy.generateDefaultWorkspaceName(TEST_EMAIL);
            expect(workspaceName).toBe((0, Localize_1.translateLocal)('workspace.new.workspaceName', { userName: TEST_DISPLAY_NAME, workspaceNumber: 2 }));
        });
        it('should return "My Group Workspace" when the domain is SMS', () => {
            jest.spyOn(PersonalDetailsUtils, 'getPersonalDetailByEmail').mockReturnValue({
                displayName: TEST_DISPLAY_NAME,
                phoneNumber: TEST_PHONE_NUMBER,
                accountID: TEST_ACCOUNT_ID,
            });
            const workspaceName = Policy.generateDefaultWorkspaceName(TEST_SMS_DOMAIN_EMAIL);
            expect(workspaceName).toBe((0, Localize_1.translateLocal)('workspace.new.myGroupWorkspace', {}));
        });
        it('should generate a workspace name with an incremented number even if previous workspaces were created in english lang', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.POLICY, {});
            await IntlStore_1.default.load(CONST_1.default.LOCALES.ES);
            const existingPolicies = {
                ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.PERSONAL, `${TEST_DISPLAY_NAME}'s Workspace`),
                ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.PERSONAL, `${TEST_DISPLAY_NAME}'s Workspace 1`),
            };
            jest.spyOn(PersonalDetailsUtils, 'getPersonalDetailByEmail').mockReturnValue({
                displayName: TEST_DISPLAY_NAME,
                phoneNumber: TEST_PHONE_NUMBER,
                accountID: TEST_ACCOUNT_ID,
            });
            jest.spyOn(expensify_common_1.Str, 'UCFirst').mockReturnValue(TEST_DISPLAY_NAME);
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.POLICY, existingPolicies);
            const workspaceName = Policy.generateDefaultWorkspaceName(TEST_EMAIL);
            expect(workspaceName).toBe((0, Localize_1.translateLocal)('workspace.new.workspaceName', { userName: TEST_DISPLAY_NAME, workspaceNumber: 2 }));
        });
    });
    describe('enablePolicyWorkflows', () => {
        it('should update delayed submission to instant when disabling the workflows feature', async () => {
            fetch?.pause?.();
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: ESH_EMAIL, accountID: ESH_ACCOUNT_ID });
            const fakePolicy = {
                ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM),
                areWorkflowsEnabled: true,
                autoReporting: true,
                autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE,
            };
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            await (0, waitForBatchedUpdates_1.default)();
            // Disable the workflow feature
            Policy.enablePolicyWorkflows(fakePolicy.id, false);
            await (0, waitForBatchedUpdates_1.default)();
            await TestHelper.getOnyxData({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                waitForCollectionCallback: false,
                callback: (policy) => {
                    // Check if the autoReportingFrequency is updated to instant
                    expect(policy?.areWorkflowsEnabled).toBeFalsy();
                    expect(policy?.autoReportingFrequency).toBe(CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT);
                },
            });
        });
    });
});
