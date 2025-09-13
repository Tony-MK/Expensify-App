"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const react_native_onyx_1 = require("react-native-onyx");
const DateUtils_1 = require("@libs/DateUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const createCollection_1 = require("../utils/collections/createCollection");
const policies_1 = require("../utils/collections/policies");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
const CARLOS_EMAIL = 'cmartins@expensifail.com';
const CARLOS_ACCOUNT_ID = 1;
function toLocaleDigitMock(dot) {
    return dot;
}
const GENERATED_ACCOUNT_ID = '555555';
jest.mock('@libs/UserUtils', () => ({
    // generateAccountID: () => GENERATED_ACCOUNT_ID,
    generateAccountID: jest.fn().mockReturnValue(GENERATED_ACCOUNT_ID),
}));
const testDate = DateUtils_1.default.getDBTime();
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
const adminAccountID = 1;
const employeeAccountID = 2;
const categoryApprover1AccountID = 3;
const categoryApprover2AccountID = 4;
const tagApprover1AccountID = 5;
const tagApprover2AccountID = 6;
const ownerAccountID = 7;
const approverAccountID = 8;
const employeeEmail = 'employee@test.com';
const adminEmail = 'admin@test.com';
const categoryApprover1Email = 'categoryapprover1@test.com';
const approverEmail = 'approver@test.com';
const personalDetails = {
    '1': {
        accountID: adminAccountID,
        login: adminEmail,
    },
    '2': {
        accountID: employeeAccountID,
        login: employeeEmail,
    },
    '3': {
        accountID: categoryApprover1AccountID,
        login: categoryApprover1Email,
    },
    '4': {
        accountID: categoryApprover2AccountID,
        login: 'categoryapprover2@test.com',
    },
    '5': {
        accountID: tagApprover1AccountID,
        login: 'tagapprover1@test.com',
    },
    '6': {
        accountID: tagApprover2AccountID,
        login: 'tagapprover2@test.com',
    },
    '7': {
        accountID: ownerAccountID,
        login: 'owner@test.com',
    },
    '8': {
        accountID: approverAccountID,
        login: approverEmail,
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
const policyTags = {
    TagListTest0: {
        name: 'TagListTest0',
        orderWeight: 0,
        required: false,
        tags: {},
    },
    TagListTest2: {
        name: 'TagListTest2',
        orderWeight: 2,
        required: false,
        tags: {},
    },
};
describe('PolicyUtils', () => {
    describe('getActivePolicies', () => {
        it("getActivePolicies should filter out policies that the current user doesn't belong to", () => {
            const policies = (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.POLICY}${item.id}`, (index) => ({ ...(0, policies_1.default)(index + 1), name: 'workspace', pendingAction: null, ...(!index && { role: null }) }), 2);
            expect((0, PolicyUtils_1.getActivePolicies)(policies, undefined)).toHaveLength(1);
        });
    });
    describe('getRateDisplayValue', () => {
        it('should return an empty string for NaN', () => {
            const rate = (0, PolicyUtils_1.getRateDisplayValue)('invalid', toLocaleDigitMock);
            expect(rate).toEqual('');
        });
        describe('withDecimals = false', () => {
            it('should return integer value as is', () => {
                const rate = (0, PolicyUtils_1.getRateDisplayValue)(100, toLocaleDigitMock);
                expect(rate).toEqual('100');
            });
            it('should return non-integer value as is', () => {
                const rate = (0, PolicyUtils_1.getRateDisplayValue)(10.5, toLocaleDigitMock);
                expect(rate).toEqual('10.5');
            });
        });
        describe('withDecimals = true', () => {
            it('should return integer value with 2 trailing zeros', () => {
                const rate = (0, PolicyUtils_1.getRateDisplayValue)(10, toLocaleDigitMock, true);
                expect(rate).toEqual('10.00');
            });
            it('should return non-integer value with up to 2 trailing zeros', () => {
                const rate = (0, PolicyUtils_1.getRateDisplayValue)(10.5, toLocaleDigitMock, true);
                expect(rate).toEqual('10.50');
            });
            it('should return non-integer value with 4 decimals as is', () => {
                const rate = (0, PolicyUtils_1.getRateDisplayValue)(10.5312, toLocaleDigitMock, true);
                expect(rate).toEqual('10.5312');
            });
            it('should return non-integer value with 3 decimals as is', () => {
                const rate = (0, PolicyUtils_1.getRateDisplayValue)(10.531, toLocaleDigitMock, true);
                expect(rate).toEqual('10.531');
            });
            it('should return non-integer value with 4+ decimals cut to 4', () => {
                const rate = (0, PolicyUtils_1.getRateDisplayValue)(10.53135, toLocaleDigitMock, true);
                expect(rate).toEqual('10.5313');
            });
        });
    });
    describe('getUnitRateValue', () => {
        it('should return an empty string for NaN', () => {
            const rate = (0, PolicyUtils_1.getUnitRateValue)(toLocaleDigitMock, { rate: 'invalid' });
            expect(rate).toEqual('');
        });
        describe('withDecimals = false', () => {
            it('should return value divisible by 100 with no decimal places', () => {
                const rate = (0, PolicyUtils_1.getUnitRateValue)(toLocaleDigitMock, { rate: 100 });
                expect(rate).toEqual('1');
            });
            it('should return non-integer value as is divided by 100', () => {
                const rate = (0, PolicyUtils_1.getUnitRateValue)(toLocaleDigitMock, { rate: 11.11 });
                expect(rate).toEqual('0.1111');
            });
        });
        describe('withDecimals = true', () => {
            it('should return value divisible by 100 with 2 decimal places', () => {
                const rate = (0, PolicyUtils_1.getUnitRateValue)(toLocaleDigitMock, { rate: 100 }, true);
                expect(rate).toEqual('1.00');
            });
            it('should return non-integer value as is divided by 100', () => {
                const rate = (0, PolicyUtils_1.getUnitRateValue)(toLocaleDigitMock, { rate: 11.11 }, true);
                expect(rate).toEqual('0.1111');
            });
        });
    });
    describe('getSubmitToAccountID', () => {
        beforeEach(() => {
            (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        });
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await (0, waitForBatchedUpdatesWithAct_1.default)();
        });
        describe('Has no rule approver', () => {
            it('should return the policy approver/owner if the policy use the basic workflow', () => {
                const policy = {
                    ...(0, policies_1.default)(0),
                    approver: 'owner@test.com',
                    owner: 'owner@test.com',
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
                };
                const expenseReport = {
                    ...(0, reports_1.createRandomReport)(0),
                    ownerAccountID: employeeAccountID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                expect((0, PolicyUtils_1.getSubmitToAccountID)(policy, expenseReport)).toBe(ownerAccountID);
            });
            it('should return the policy approver/owner if the policy use the optional workflow', () => {
                const policy = {
                    ...(0, policies_1.default)(0),
                    approver: 'owner@test.com',
                    owner: 'owner@test.com',
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL,
                };
                const expenseReport = {
                    ...(0, reports_1.createRandomReport)(0),
                    ownerAccountID: employeeAccountID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                expect((0, PolicyUtils_1.getSubmitToAccountID)(policy, expenseReport)).toBe(ownerAccountID);
            });
            it('should return the employee submitsTo if the policy use the advance workflow', () => {
                const policy = {
                    ...(0, policies_1.default)(0),
                    approver: 'owner@test.com',
                    owner: 'owner@test.com',
                    employeeList,
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                };
                const expenseReport = {
                    ...(0, reports_1.createRandomReport)(0),
                    ownerAccountID: employeeAccountID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                expect((0, PolicyUtils_1.getSubmitToAccountID)(policy, expenseReport)).toBe(adminAccountID);
            });
        });
        describe('Has category/tag approver', () => {
            it('should return the first category approver if has any transaction category match with category approver rule', async () => {
                const policy = {
                    ...(0, policies_1.default)(0),
                    approver: 'owner@test.com',
                    owner: 'owner@test.com',
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                    employeeList,
                    rules,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                };
                const expenseReport = {
                    ...(0, reports_1.createRandomReport)(0),
                    ownerAccountID: employeeAccountID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                const transaction1 = {
                    ...(0, transaction_1.default)(0),
                    category: 'cat1',
                    reportID: expenseReport.reportID,
                };
                const transaction2 = {
                    ...(0, transaction_1.default)(1),
                    category: '',
                    reportID: expenseReport.reportID,
                };
                await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
                    [transaction1.transactionID]: transaction1,
                    [transaction2.transactionID]: transaction2,
                });
                expect((0, PolicyUtils_1.getSubmitToAccountID)(policy, expenseReport)).toBe(categoryApprover1AccountID);
            });
            it('should return default approver if rule approver is submitter and prevent self approval is enabled', async () => {
                const policy = {
                    ...(0, policies_1.default)(0),
                    approver: 'owner@test.com',
                    owner: 'owner@test.com',
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                    employeeList,
                    rules,
                    preventSelfApproval: true,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                };
                const expenseReport = {
                    ...(0, reports_1.createRandomReport)(0),
                    ownerAccountID: categoryApprover1AccountID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                const transaction = {
                    ...(0, transaction_1.default)(0),
                    category: 'cat1',
                    reportID: expenseReport.reportID,
                    tag: '',
                };
                await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
                    [transaction.transactionID]: transaction,
                });
                expect((0, PolicyUtils_1.getSubmitToAccountID)(policy, expenseReport)).toBe(adminAccountID);
            });
            it('should return the category approver of the first transaction sorted by created if we have many transaction categories match with the category approver rule', async () => {
                const policy = {
                    ...(0, policies_1.default)(0),
                    approver: 'owner@test.com',
                    owner: 'owner@test.com',
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                    employeeList,
                    rules,
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                };
                const expenseReport = {
                    ...(0, reports_1.createRandomReport)(0),
                    ownerAccountID: employeeAccountID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                };
                const transaction1 = {
                    ...(0, transaction_1.default)(0),
                    category: 'cat1',
                    created: testDate,
                    reportID: expenseReport.reportID,
                };
                const transaction2 = {
                    ...(0, transaction_1.default)(1),
                    category: 'cat2',
                    created: DateUtils_1.default.subtractMillisecondsFromDateTime(testDate, 1),
                    reportID: expenseReport.reportID,
                };
                await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
                    [transaction1.transactionID]: transaction1,
                    [transaction2.transactionID]: transaction2,
                });
                expect((0, PolicyUtils_1.getSubmitToAccountID)(policy, expenseReport)).toBe(categoryApprover2AccountID);
            });
            describe('Has no transaction match with the category approver rule', () => {
                it('should return the first tag approver if has any transaction tag match with with the tag approver rule ', async () => {
                    const policy = {
                        ...(0, policies_1.default)(0),
                        approver: 'owner@test.com',
                        owner: 'owner@test.com',
                        type: CONST_1.default.POLICY.TYPE.CORPORATE,
                        employeeList,
                        rules,
                        approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                    };
                    const expenseReport = {
                        ...(0, reports_1.createRandomReport)(0),
                        ownerAccountID: employeeAccountID,
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    };
                    const transaction1 = {
                        ...(0, transaction_1.default)(0),
                        category: '',
                        tag: 'tag1',
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
                    await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
                        [transaction1.transactionID]: transaction1,
                        [transaction2.transactionID]: transaction2,
                    });
                    expect((0, PolicyUtils_1.getSubmitToAccountID)(policy, expenseReport)).toBe(tagApprover1AccountID);
                });
                it('should return the tag approver of the first transaction sorted by created if we have many transaction tags match with the tag approver rule', async () => {
                    const policy = {
                        ...(0, policies_1.default)(0),
                        approver: 'owner@test.com',
                        owner: 'owner@test.com',
                        type: CONST_1.default.POLICY.TYPE.CORPORATE,
                        employeeList,
                        rules,
                        approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                    };
                    const expenseReport = {
                        ...(0, reports_1.createRandomReport)(0),
                        ownerAccountID: employeeAccountID,
                        type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    };
                    const transaction1 = {
                        ...(0, transaction_1.default)(0),
                        category: '',
                        tag: 'tag1',
                        created: testDate,
                        reportID: expenseReport.reportID,
                    };
                    const transaction2 = {
                        ...(0, transaction_1.default)(1),
                        category: '',
                        tag: 'tag2',
                        created: DateUtils_1.default.subtractMillisecondsFromDateTime(testDate, 1),
                        reportID: expenseReport.reportID,
                    };
                    await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
                        [transaction1.transactionID]: transaction1,
                        [transaction2.transactionID]: transaction2,
                    });
                    expect((0, PolicyUtils_1.getSubmitToAccountID)(policy, expenseReport)).toBe(tagApprover2AccountID);
                });
            });
        });
    });
    describe('shouldShowPolicy', () => {
        beforeAll(() => {
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
                initialKeyStates: {
                    [ONYXKEYS_1.default.SESSION]: { accountID: CARLOS_ACCOUNT_ID, email: CARLOS_EMAIL },
                },
            });
        });
        beforeEach(() => {
            global.fetch = TestHelper.getGlobalFetchMock();
            return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
        });
        it('should return false', () => {
            // Given an archived paid policy.
            const policy = {
                ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.CORPORATE),
                role: '',
            };
            const result = (0, PolicyUtils_1.shouldShowPolicy)(policy, false, CARLOS_EMAIL);
            // The result should be false since it is an archived paid policy.
            expect(result).toBe(false);
        });
        it('should return true', () => {
            // Given a paid policy.
            const policy = { ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.CORPORATE), pendingAction: null };
            const result = (0, PolicyUtils_1.shouldShowPolicy)(policy, false, CARLOS_EMAIL);
            // The result should be true, since it is an active paid policy.
            expect(result).toBe(true);
        });
        it('should return false', () => {
            // Given a control workspace which is pending delete.
            const policy = {
                ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.CORPORATE),
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            };
            const result = (0, PolicyUtils_1.shouldShowPolicy)(policy, false, CARLOS_EMAIL);
            // The result should be false since it is a policy which is pending deletion.
            expect(result).toEqual(false);
        });
    });
    describe('getPolicyNameByID', () => {
        it('should return the policy name for a given policyID', async () => {
            const policy = {
                ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM),
                name: 'testName',
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}1`, policy);
            expect((0, PolicyUtils_1.getPolicyNameByID)('1')).toBe('testName');
        });
        it('should return the empty if the name is not set', async () => {
            const policy = {
                ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                name: null,
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}1`, policy);
            expect((0, PolicyUtils_1.getPolicyNameByID)('1')).toBe('');
        });
    });
    describe('getManagerAccountID', () => {
        beforeEach(() => {
            (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        });
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await (0, waitForBatchedUpdatesWithAct_1.default)();
        });
        it('should return default approver for personal workspaces', () => {
            const policy = {
                ...(0, policies_1.default)(0),
                type: CONST_1.default.POLICY.TYPE.PERSONAL,
                approver: categoryApprover1Email,
            };
            const report = {
                ...(0, reports_1.createRandomReport)(0),
            };
            const result = (0, PolicyUtils_1.getManagerAccountID)(policy, report);
            expect(result).toBe(categoryApprover1AccountID);
        });
        it('should return -1 if there is no employee or default approver', () => {
            const policy = {
                ...(0, policies_1.default)(0),
                type: CONST_1.default.POLICY.TYPE.TEAM,
                approvalMode: undefined,
                approver: undefined,
                owner: '',
            };
            const report = {
                ...(0, reports_1.createRandomReport)(0),
            };
            const result = (0, PolicyUtils_1.getManagerAccountID)(policy, report);
            expect(result).toBe(-1);
        });
        it('should return submitsTo account ID', () => {
            const policy = {
                ...(0, policies_1.default)(0),
                type: CONST_1.default.POLICY.TYPE.TEAM,
                approvalMode: undefined,
                employeeList: {
                    [employeeEmail]: {
                        email: employeeEmail,
                        submitsTo: adminEmail,
                    },
                },
            };
            const report = {
                ...(0, reports_1.createRandomReport)(0),
                ownerAccountID: employeeAccountID,
            };
            const result = (0, PolicyUtils_1.getManagerAccountID)(policy, report);
            expect(result).toBe(adminAccountID);
        });
        it('should return the default approver', () => {
            const policy = {
                ...(0, policies_1.default)(0),
                type: CONST_1.default.POLICY.TYPE.TEAM,
                approvalMode: undefined,
                approver: categoryApprover1Email,
            };
            const report = {
                ...(0, reports_1.createRandomReport)(0),
                ownerAccountID: employeeAccountID,
            };
            const result = (0, PolicyUtils_1.getManagerAccountID)(policy, report);
            expect(result).toBe(categoryApprover1AccountID);
        });
    });
    describe('isWorkspaceEligibleForReportChange', () => {
        beforeEach(() => {
            (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        });
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await (0, waitForBatchedUpdatesWithAct_1.default)();
        });
        it('returns false if policy is not paid group policy', async () => {
            const currentUserLogin = employeeEmail;
            const currentUserAccountID = employeeAccountID;
            const newPolicy = {
                ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.PERSONAL),
                isPolicyExpenseChatEnabled: true,
                employeeList: {
                    [currentUserLogin]: { email: currentUserLogin, role: CONST_1.default.POLICY.ROLE.USER },
                },
            };
            const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`]: newPolicy };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`, newPolicy);
            const report = {
                ...(0, reports_1.createRandomReport)(0),
                type: CONST_1.default.REPORT.TYPE.IOU,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                ownerAccountID: currentUserAccountID,
                managerID: approverAccountID,
            };
            const result = (0, ReportUtils_1.isWorkspaceEligibleForReportChange)(newPolicy, report, policies);
            expect(result).toBe(false);
        });
        it('returns true if policy is paid group policy and the manger is the payer', async () => {
            const currentUserLogin = employeeEmail;
            const currentUserAccountID = employeeAccountID;
            const newPolicy = {
                ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM),
                reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_MANUAL,
                isPolicyExpenseChatEnabled: true,
                employeeList: {
                    [currentUserLogin]: { email: currentUserLogin, role: CONST_1.default.POLICY.ROLE.ADMIN },
                },
            };
            const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`]: newPolicy };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`, newPolicy);
            const report = {
                ...(0, reports_1.createRandomReport)(0),
                type: CONST_1.default.REPORT.TYPE.IOU,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                ownerAccountID: approverAccountID,
                managerID: currentUserAccountID,
            };
            const result = (0, ReportUtils_1.isWorkspaceEligibleForReportChange)(newPolicy, report, policies);
            expect(result).toBe(true);
        });
        it('returns false if the manager is not the payer of the new policy', async () => {
            const newPolicy = {
                ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM),
                isPolicyExpenseChatEnabled: true,
                role: CONST_1.default.POLICY.ROLE.ADMIN,
                employeeList: {
                    [approverEmail]: { email: approverEmail, role: CONST_1.default.POLICY.ROLE.USER },
                },
            };
            const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`]: newPolicy };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`, newPolicy);
            const report = {
                ...(0, reports_1.createRandomReport)(0),
                type: CONST_1.default.REPORT.TYPE.IOU,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                ownerAccountID: employeeAccountID,
                managerID: approverAccountID,
            };
            const result = (0, ReportUtils_1.isWorkspaceEligibleForReportChange)(newPolicy, report, policies);
            expect(result).toBe(false);
        });
        it('returns false if policies are not policyExpenseChatEnabled', async () => {
            const currentUserLogin = employeeEmail;
            const currentUserAccountID = employeeAccountID;
            const newPolicy = {
                ...(0, policies_1.default)(1, CONST_1.default.POLICY.TYPE.TEAM),
                reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_MANUAL,
                isPolicyExpenseChatEnabled: false,
                employeeList: {
                    [currentUserLogin]: { email: currentUserLogin, role: CONST_1.default.POLICY.ROLE.ADMIN },
                },
            };
            const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`]: newPolicy };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${newPolicy.id}`, newPolicy);
            const report = {
                ...(0, reports_1.createRandomReport)(0),
                type: CONST_1.default.REPORT.TYPE.IOU,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                ownerAccountID: approverAccountID,
                managerID: currentUserAccountID,
            };
            const result = (0, ReportUtils_1.isWorkspaceEligibleForReportChange)(newPolicy, report, policies);
            expect(result).toBe(false);
        });
    });
    describe('isCurrentUserMemberOfAnyPolicy', () => {
        beforeEach(() => {
            (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        });
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await (0, waitForBatchedUpdatesWithAct_1.default)();
        });
        it('should return false if user has no policies', async () => {
            const currentUserLogin = approverEmail;
            const currentUserAccountID = approverAccountID;
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserLogin, accountID: currentUserAccountID });
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.POLICY, {});
            const result = (0, PolicyUtils_1.isCurrentUserMemberOfAnyPolicy)();
            expect(result).toBeFalsy();
        });
        it('should return true if user owns a workspace', async () => {
            const currentUserLogin = approverEmail;
            const currentUserAccountID = approverAccountID;
            const policies = { ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM, `John's Workspace`), ownerAccountID: approverAccountID, isPolicyExpenseChatEnabled: true };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserLogin, accountID: currentUserAccountID });
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.POLICY, policies);
            const result = (0, PolicyUtils_1.isCurrentUserMemberOfAnyPolicy)();
            expect(result).toBeTruthy();
        });
        it('should return false if expense chat is not enabled', async () => {
            const currentUserLogin = approverEmail;
            const currentUserAccountID = approverAccountID;
            const policies = { ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM, `John's Workspace`), isPolicyExpenseChatEnabled: false };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserLogin, accountID: currentUserAccountID });
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.POLICY, policies);
            const result = (0, PolicyUtils_1.isCurrentUserMemberOfAnyPolicy)();
            expect(result).toBeFalsy();
        });
        it('should return false if its a fake policy id', async () => {
            const currentUserLogin = approverEmail;
            const currentUserAccountID = approverAccountID;
            const policies = { ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM, `John's Workspace`), id: CONST_1.default.POLICY.ID_FAKE };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserLogin, accountID: currentUserAccountID });
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.POLICY, policies);
            const result = (0, PolicyUtils_1.isCurrentUserMemberOfAnyPolicy)();
            expect(result).toBeFalsy();
        });
        it('should return true if user is invited to a workspace', async () => {
            const currentUserLogin = approverEmail;
            const currentUserAccountID = approverAccountID;
            const policies = { ...(0, policies_1.default)(0, CONST_1.default.POLICY.TYPE.TEAM, `John's Workspace`), ownerAccountID, isPolicyExpenseChatEnabled: true };
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, { email: currentUserLogin, accountID: currentUserAccountID });
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.COLLECTION.POLICY, policies);
            const result = (0, PolicyUtils_1.isCurrentUserMemberOfAnyPolicy)();
            expect(result).toBeTruthy();
        });
    });
    describe('getTagList', () => {
        it.each([
            ['when index is 0', 0, policyTags.TagListTest0.name],
            ['when index is 1', 1, policyTags.TagListTest2.name],
            ['when index is out of range', 2, ''],
        ])('%s', (_description, index, expected) => {
            const tagList = (0, PolicyUtils_1.getTagList)(policyTags, index);
            expect(tagList.name).toEqual(expected);
        });
    });
    describe('getTagListByOrderWeight', () => {
        it.each([
            ['when orderWeight is 0', 0, policyTags.TagListTest0.name],
            ['when orderWeight is 2', 2, policyTags.TagListTest2.name],
            ['when orderWeight is out of range', 1, ''],
        ])('%s', (_description, orderWeight, expected) => {
            const tagList = (0, PolicyUtils_1.getTagListByOrderWeight)(policyTags, orderWeight);
            expect(tagList.name).toEqual(expected);
        });
    });
    describe('sortWorkspacesBySelected', () => {
        it('should order workspaces with selected workspace first', () => {
            const workspace1 = { policyID: '1', name: 'Workspace 1' };
            const workspace2 = { policyID: '2', name: 'Workspace 2' };
            const selectedWorkspace1 = { policyID: '3', name: 'Workspace 3' };
            const selectedWorkspace2 = { policyID: '4', name: 'Workspace 4' };
            expect((0, PolicyUtils_1.sortWorkspacesBySelected)(workspace1, workspace2, ['3', '4'], TestHelper.localeCompare)).toBe(-1);
            expect((0, PolicyUtils_1.sortWorkspacesBySelected)(workspace1, selectedWorkspace1, ['3', '4'], TestHelper.localeCompare)).toBe(1);
            expect((0, PolicyUtils_1.sortWorkspacesBySelected)(selectedWorkspace1, selectedWorkspace2, ['3', '4'], TestHelper.localeCompare)).toBe(-1);
        });
        it('should order workspaces using name if no workspace is selected', () => {
            const workspace1 = { policyID: '1', name: 'Workspace 1' };
            const workspace2 = { policyID: '2', name: 'Workspace 2' };
            const workspace3 = { policyID: '3', name: 'Workspace 3' };
            const workspace4 = { policyID: '4', name: 'Workspace 4' };
            expect((0, PolicyUtils_1.sortWorkspacesBySelected)(workspace1, workspace2, undefined, TestHelper.localeCompare)).toBe(-1);
            expect((0, PolicyUtils_1.sortWorkspacesBySelected)(workspace1, workspace3, undefined, TestHelper.localeCompare)).toBe(-1);
            expect((0, PolicyUtils_1.sortWorkspacesBySelected)(workspace3, workspace4, undefined, TestHelper.localeCompare)).toBe(-1);
        });
        it('should sort workspaces when using this method correctly', () => {
            const unsortedWorkspaces = [
                { policyID: '2', name: 'Workspace 2' },
                { policyID: '1', name: 'Workspace 1' },
                { policyID: '4', name: 'Workspace 4' },
                { policyID: '3', name: 'Workspace 3' },
            ];
            const selectedWorkspaceIDs = ['3', '4'];
            const sortedWorkspaces = unsortedWorkspaces.sort((a, b) => (0, PolicyUtils_1.sortWorkspacesBySelected)(a, b, selectedWorkspaceIDs, TestHelper.localeCompare));
            expect(sortedWorkspaces).toEqual([
                { policyID: '3', name: 'Workspace 3' },
                { policyID: '4', name: 'Workspace 4' },
                { policyID: '1', name: 'Workspace 1' },
                { policyID: '2', name: 'Workspace 2' },
            ]);
        });
    });
    describe('getPolicyEmployeeAccountIDs', () => {
        beforeEach(() => {
            (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        });
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await (0, waitForBatchedUpdatesWithAct_1.default)();
        });
        it('should return an array of employee accountIDs for the given policy (including current user accountID) if no current user is passed', () => {
            const policy = {
                employeeList,
            };
            const result = (0, PolicyUtils_1.getPolicyEmployeeAccountIDs)(policy);
            expect(result).toEqual([7, 1, 2, 3, 4, 5, 6]);
        });
        it('should return an array of employee accountIDs for the given policy (excluding current user accountID) if current user is passed', () => {
            const policy = {
                employeeList,
            };
            const result = (0, PolicyUtils_1.getPolicyEmployeeAccountIDs)(policy, 5);
            expect(result).toEqual([7, 1, 2, 3, 4, 6]);
        });
        it('should return an empty array if no employees are found', () => {
            const policy = {
                employeeList: {},
            };
            const result = (0, PolicyUtils_1.getPolicyEmployeeAccountIDs)(policy);
            expect(result).toEqual([]);
        });
    });
    describe('isPolicyMemberWithoutPendingDelete', () => {
        it('should return true if the policy member is not pending delete', () => {
            const policy = {
                id: '1',
                employeeList: {
                    [employeeEmail]: { email: employeeEmail, role: CONST_1.default.POLICY.ROLE.USER },
                },
            };
            const result = (0, PolicyUtils_1.isPolicyMemberWithoutPendingDelete)(employeeEmail, policy);
            expect(result).toBe(true);
        });
        it('should return false if the policy member is pending delete', () => {
            const policy = {
                id: '1',
                employeeList: {
                    [employeeEmail]: { email: employeeEmail, role: CONST_1.default.POLICY.ROLE.USER, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE },
                },
            };
            const result = (0, PolicyUtils_1.isPolicyMemberWithoutPendingDelete)(employeeEmail, policy);
            expect(result).toBe(false);
        });
        it('should return false if the policy member is not found', () => {
            const policy = {
                id: '1',
                employeeList: {
                    [employeeEmail]: { email: employeeEmail, role: CONST_1.default.POLICY.ROLE.USER },
                },
            };
            const result = (0, PolicyUtils_1.isPolicyMemberWithoutPendingDelete)('fakeEmail', policy);
            expect(result).toBe(false);
        });
    });
});
