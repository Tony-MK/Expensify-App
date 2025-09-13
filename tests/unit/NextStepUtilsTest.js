"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const NextStepUtils_1 = require("@libs/NextStepUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
describe('libs/NextStepUtils', () => {
    describe('buildNextStep', () => {
        const currentUserEmail = 'current-user@expensify.com';
        const currentUserAccountID = 37;
        const strangeEmail = 'stranger@expensify.com';
        const strangeAccountID = 50;
        const ownerEmail = 'owner@expensify.com';
        const ownerAccountID = 99;
        const policyID = '1';
        const policy = {
            // Important props
            id: policyID,
            owner: ownerEmail,
            harvesting: {
                enabled: false,
            },
            // Required props
            name: 'Policy',
            role: 'admin',
            type: 'team',
            outputCurrency: CONST_1.default.CURRENCY.USD,
            isPolicyExpenseChatEnabled: true,
            reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES,
        };
        const optimisticNextStep = {
            type: 'neutral',
            icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
            message: [],
        };
        const report = (0, ReportUtils_1.buildOptimisticExpenseReport)('fake-chat-report-id-1', policyID, 1, -500, CONST_1.default.CURRENCY.USD);
        beforeAll(() => {
            const policyCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, [policy], (item) => item.id);
            react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID: currentUserAccountID },
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: {
                    [strangeAccountID]: {
                        accountID: strangeAccountID,
                        login: strangeEmail,
                        avatar: '',
                    },
                    [currentUserAccountID]: {
                        accountID: currentUserAccountID,
                        login: currentUserEmail,
                        avatar: '',
                    },
                    [ownerAccountID]: {
                        accountID: ownerAccountID,
                        login: ownerEmail,
                        avatar: '',
                    },
                },
                ...policyCollectionDataSet,
            }).then(waitForBatchedUpdates_1.default);
        });
        beforeEach(() => {
            report.ownerAccountID = currentUserAccountID;
            report.managerID = currentUserAccountID;
            optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
            optimisticNextStep.message = [];
            react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, policy).then(waitForBatchedUpdates_1.default);
        });
        describe('it generates and optimistic nextStep once a report has been created', () => {
            test('Correct next steps message', () => {
                const emptyReport = (0, ReportUtils_1.buildOptimisticEmptyReport)('fake-empty-report-id-2', currentUserAccountID, { reportID: 'fake-parent-report-id-3' }, 'fake-parent-report-action-id-4', policy, '2025-03-31 13:23:11');
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `${currentUserEmail}`,
                        type: 'strong',
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'add',
                    },
                    {
                        text: ' %expenses.',
                    },
                ];
                const result = (0, NextStepUtils_1.buildNextStep)(emptyReport, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                expect(result).toMatchObject(optimisticNextStep);
            });
        });
        describe('it generates an optimistic nextStep once a report has been opened', () => {
            test('Fix violations', () => {
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `${currentUserEmail}`,
                        type: 'strong',
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'fix the issue(s)',
                    },
                ];
                const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN, true);
                expect(result).toMatchObject(optimisticNextStep);
            });
            test('self review', () => {
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                // Waiting for userSubmitter to add expense(s).
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `${currentUserEmail}`,
                        type: 'strong',
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'add',
                    },
                    {
                        text: ' %expenses.',
                    },
                ];
                const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                expect(result).toMatchObject(optimisticNextStep);
            });
            describe('scheduled submit enabled', () => {
                beforeEach(() => {
                    optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                });
                // Format: Waiting for userSubmitter's expense(s) to automatically submit on scheduledSubmitSettings
                test('daily', () => {
                    // Waiting for userSubmitter's expense(s) to automatically submit later today
                    optimisticNextStep.message = [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${currentUserEmail}`,
                            clickToCopyText: `${currentUserEmail}`,
                            type: 'strong',
                        },
                        {
                            text: "'s",
                            type: 'strong',
                        },
                        {
                            text: ' %expenses to automatically submit',
                        },
                        {
                            text: ' later today',
                        },
                    ];
                    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                        autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE,
                        harvesting: {
                            enabled: true,
                        },
                    }).then(() => {
                        const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                        expect(result).toMatchObject(optimisticNextStep);
                    });
                });
                test('weekly', () => {
                    // Waiting for userSubmitter's expense(s) to automatically submit on Sunday
                    optimisticNextStep.message = [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${currentUserEmail}`,
                            clickToCopyText: `${currentUserEmail}`,
                            type: 'strong',
                        },
                        {
                            text: "'s",
                            type: 'strong',
                        },
                        {
                            text: ' %expenses to automatically submit',
                        },
                        {
                            text: ' on Sunday',
                        },
                    ];
                    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                        autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY,
                        harvesting: {
                            enabled: true,
                        },
                    }).then(() => {
                        const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                        expect(result).toMatchObject(optimisticNextStep);
                    });
                });
                test('twice a month', () => {
                    // Waiting for userSubmitter's expense(s) to automatically submit on the 1st and 16th of each month
                    optimisticNextStep.message = [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${currentUserEmail}`,
                            clickToCopyText: `${currentUserEmail}`,
                            type: 'strong',
                        },
                        {
                            text: "'s",
                            type: 'strong',
                        },
                        {
                            text: ' %expenses to automatically submit',
                        },
                        {
                            text: ' on the 1st and 16th of each month',
                        },
                    ];
                    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                        autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.SEMI_MONTHLY,
                        harvesting: {
                            enabled: true,
                        },
                    }).then(() => {
                        const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                        expect(result).toMatchObject(optimisticNextStep);
                    });
                });
                test('monthly on the 2nd', () => {
                    // Waiting for userSubmitter's expense(s) to automatically submit on the 2nd of each month
                    optimisticNextStep.message = [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${currentUserEmail}`,
                            clickToCopyText: `${currentUserEmail}`,
                            type: 'strong',
                        },
                        {
                            text: "'s",
                            type: 'strong',
                        },
                        {
                            text: ' %expenses to automatically submit',
                        },
                        {
                            text: ' on the 2nd of each month',
                        },
                    ];
                    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                        autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY,
                        autoReportingOffset: 2,
                        harvesting: {
                            enabled: true,
                        },
                    }).then(() => {
                        const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                        expect(result).toMatchObject(optimisticNextStep);
                    });
                });
                test('monthly on the last day', () => {
                    // Waiting for userSubmitter's expense(s) to automatically submit on lastDayOfMonth of each month
                    optimisticNextStep.message = [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${currentUserEmail}`,
                            clickToCopyText: `${currentUserEmail}`,
                            type: 'strong',
                        },
                        {
                            text: "'s",
                            type: 'strong',
                        },
                        {
                            text: ' %expenses to automatically submit',
                        },
                        {
                            text: ` on the last day of the month`,
                        },
                    ];
                    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                        autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY,
                        autoReportingOffset: CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_DAY_OF_MONTH,
                        harvesting: {
                            enabled: true,
                        },
                    }).then(() => {
                        const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                        expect(result).toMatchObject(optimisticNextStep);
                    });
                });
                test('monthly on the last business day', () => {
                    // Waiting for userSubmitter's expense(s) to automatically submit on lastBusinessDayOfMonth of each month
                    optimisticNextStep.message = [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${currentUserEmail}`,
                            clickToCopyText: `${currentUserEmail}`,
                            type: 'strong',
                        },
                        {
                            text: "'s",
                            type: 'strong',
                        },
                        {
                            text: ' %expenses to automatically submit',
                        },
                        {
                            text: ` on the last business day of the month`,
                        },
                    ];
                    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                        autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY,
                        autoReportingOffset: CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_BUSINESS_DAY_OF_MONTH,
                        harvesting: {
                            enabled: true,
                        },
                    }).then(() => {
                        const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                        expect(result).toMatchObject(optimisticNextStep);
                    });
                });
                test('trip', () => {
                    // Waiting for userSubmitter's expense(s) to automatically submit at the end of their trip
                    optimisticNextStep.message = [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${currentUserEmail}`,
                            clickToCopyText: `${currentUserEmail}`,
                            type: 'strong',
                        },
                        {
                            text: "'s",
                            type: 'strong',
                        },
                        {
                            text: ' %expenses to automatically submit',
                        },
                        {
                            text: ` at the end of their trip`,
                        },
                    ];
                    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                        autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.TRIP,
                        harvesting: {
                            enabled: true,
                        },
                    }).then(() => {
                        const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                        expect(result).toMatchObject(optimisticNextStep);
                    });
                });
                test('manual', () => {
                    // Waiting for userSubmitter to submit expense(s).
                    optimisticNextStep.message = [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${currentUserEmail}`,
                            type: 'strong',
                        },
                        {
                            text: ' to ',
                        },
                        {
                            text: 'submit',
                        },
                        {
                            text: ' %expenses.',
                        },
                    ];
                    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                        autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE,
                        harvesting: {
                            enabled: false,
                        },
                    }).then(() => {
                        const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.OPEN);
                        expect(result).toMatchObject(optimisticNextStep);
                    });
                });
            });
        });
        describe('it generates an optimistic nextStep once a report has been submitted', () => {
            test('self review', () => {
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                // Waiting for an admin to set up a bank account
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `an admin`,
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'finish setting up',
                    },
                    {
                        text: ' a business bank account.',
                    },
                ];
                const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.APPROVED);
                expect(result).toMatchObject(optimisticNextStep);
            });
            test('self review with bank account setup', () => {
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                // Waiting for an admin to pay expense(s)
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `an admin`,
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'pay',
                    },
                    {
                        text: ' %expenses.',
                    },
                ];
                return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                    achAccount: {
                        accountNumber: '123456789',
                    },
                }).then(() => {
                    const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.APPROVED);
                    expect(result).toMatchObject(optimisticNextStep);
                    // restore to previous state
                    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                        achAccount: null,
                    });
                });
            });
            test('another reviewer', () => {
                report.managerID = strangeAccountID;
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                // Waiting for userApprover to approve expense(s)
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: strangeEmail,
                        type: 'strong',
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'approve',
                    },
                    {
                        text: ' %expenses.',
                    },
                ];
                return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                    employeeList: {
                        [currentUserEmail]: {
                            submitsTo: strangeEmail,
                        },
                    },
                }).then(() => {
                    const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.SUBMITTED);
                    expect(result).toMatchObject(optimisticNextStep);
                });
            });
            test('another owner', () => {
                report.ownerAccountID = strangeAccountID;
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                // Waiting for userApprover to approve expense(s)
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: currentUserEmail,
                        type: 'strong',
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'approve',
                    },
                    {
                        text: ' %expenses.',
                    },
                ];
                return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                    employeeList: {
                        [strangeEmail]: {
                            submitsTo: currentUserEmail,
                        },
                    },
                }).then(() => {
                    const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.SUBMITTED);
                    expect(result).toMatchObject(optimisticNextStep);
                });
            });
            test('submit and close approval mode', () => {
                report.ownerAccountID = strangeAccountID;
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.CHECKMARK;
                optimisticNextStep.message = [
                    {
                        text: 'No further action required!',
                    },
                ];
                return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL,
                }).then(() => {
                    const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.CLOSED);
                    expect(result).toMatchObject(optimisticNextStep);
                });
            });
            test('approval mode enabled', () => {
                report.managerID = strangeAccountID;
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: ownerEmail,
                        type: 'strong',
                        clickToCopyText: ownerEmail,
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'approve',
                    },
                    {
                        text: ' %expenses.',
                    },
                ];
                return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
                }).then(() => {
                    const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.SUBMITTED);
                    expect(result).toMatchObject(optimisticNextStep);
                });
            });
            test('advanced approval mode enabled', () => {
                report.managerID = strangeAccountID;
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: strangeEmail,
                        type: 'strong',
                        clickToCopyText: strangeEmail,
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'approve',
                    },
                    {
                        text: ' %expenses.',
                    },
                ];
                return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                    approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
                }).then(() => {
                    const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.SUBMITTED);
                    expect(result).toMatchObject(optimisticNextStep);
                });
            });
        });
        describe('it generates an optimistic nextStep once a report has been approved', () => {
            test('non-payer', () => {
                report.managerID = strangeAccountID;
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.CHECKMARK;
                optimisticNextStep.message = [
                    {
                        text: 'No further action required!',
                    },
                ];
                return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                    reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_MANUAL,
                }).then(() => {
                    const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.APPROVED);
                    expect(result).toMatchObject(optimisticNextStep);
                });
            });
            test('payer', () => {
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                // Waiting for an admin to set up a bank account
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: 'an admin',
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'finish setting up',
                    },
                    {
                        text: ' a business bank account.',
                    },
                ];
                // mock the report as approved
                const originalState = { stateNum: report.stateNum, statusNum: report.statusNum };
                report.stateNum = CONST_1.default.REPORT.STATE_NUM.APPROVED;
                report.statusNum = CONST_1.default.REPORT.STATUS_NUM.APPROVED;
                const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.APPROVED);
                expect(result).toMatchObject(optimisticNextStep);
                // restore
                report.stateNum = originalState.stateNum;
                report.statusNum = originalState.statusNum;
            });
            test('payer with bank account setup', () => {
                optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.HOURGLASS;
                // Waiting for an admin to pay expense(s)
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: 'an admin',
                    },
                    {
                        text: ' to ',
                    },
                    {
                        text: 'pay',
                    },
                    {
                        text: ' %expenses.',
                    },
                ];
                return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
                    achAccount: {
                        accountNumber: '123456789',
                    },
                }).then(() => {
                    const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.APPROVED);
                    expect(result).toMatchObject(optimisticNextStep);
                });
            });
            describe('it generates an optimistic nextStep once a report has been paid', () => {
                test('paid with wallet / outside of Expensify', () => {
                    optimisticNextStep.icon = CONST_1.default.NEXT_STEP.ICONS.CHECKMARK;
                    optimisticNextStep.message = [
                        {
                            text: 'No further action required!',
                        },
                    ];
                    const result = (0, NextStepUtils_1.buildNextStep)(report, CONST_1.default.REPORT.STATUS_NUM.REIMBURSED);
                    expect(result).toMatchObject(optimisticNextStep);
                });
            });
        });
    });
});
