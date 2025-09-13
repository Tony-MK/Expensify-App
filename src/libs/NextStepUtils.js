"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessage = parseMessage;
exports.buildNextStep = buildNextStep;
exports.buildOptimisticNextStepForPreventSelfApprovalsEnabled = buildOptimisticNextStepForPreventSelfApprovalsEnabled;
exports.buildNextStepNew = buildNextStepNew;
const date_fns_1 = require("date-fns");
const expensify_common_1 = require("expensify-common");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmailUtils_1 = require("./EmailUtils");
const Permissions_1 = require("./Permissions");
const PersonalDetailsUtils_1 = require("./PersonalDetailsUtils");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportUtils_1 = require("./ReportUtils");
let currentUserAccountID = -1;
let currentUserEmail = '';
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        if (!value) {
            return;
        }
        currentUserAccountID = value?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
        currentUserEmail = value?.email ?? '';
    },
});
let allPolicies;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    waitForCollectionCallback: true,
    callback: (value) => (allPolicies = value),
});
let allBetas;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.BETAS,
    callback: (value) => (allBetas = value),
});
let transactionViolations;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
    waitForCollectionCallback: true,
    callback: (value) => {
        transactionViolations = value;
    },
});
function parseMessage(messages) {
    let nextStepHTML = '';
    messages?.forEach((part, index) => {
        const isEmail = expensify_common_1.Str.isValidEmail(part.text);
        let tagType = part.type ?? 'span';
        let content = expensify_common_1.Str.safeEscape(part.text);
        const previousPart = index !== 0 ? messages.at(index - 1) : undefined;
        const nextPart = messages.at(index + 1);
        if (currentUserEmail === part.text || part.clickToCopyText === currentUserEmail) {
            tagType = 'strong';
            content = nextPart?.text === `'s` ? 'your' : 'you';
        }
        else if (part.text === `'s` && (previousPart?.text === currentUserEmail || previousPart?.clickToCopyText === currentUserEmail)) {
            content = '';
        }
        else if (isEmail) {
            tagType = 'next-step-email';
            content = EmailUtils_1.default.prefixMailSeparatorsWithBreakOpportunities(content);
        }
        nextStepHTML += `<${tagType}>${content}</${tagType}>`;
    });
    const formattedHtml = nextStepHTML
        .replace(/%expenses/g, 'expense(s)')
        .replace(/%Expenses/g, 'Expense(s)')
        .replace(/%tobe/g, 'are');
    return `<next-step>${formattedHtml}</next-step>`;
}
function getNextApproverDisplayName(report, isUnapprove) {
    const approverAccountID = (0, ReportUtils_1.getNextApproverAccountID)(report, isUnapprove);
    return (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: approverAccountID }) ?? (0, ReportUtils_1.getPersonalDetailsForAccountID)(approverAccountID).login;
}
function buildOptimisticNextStepForPreventSelfApprovalsEnabled() {
    const optimisticNextStep = {
        type: 'alert',
        icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
        message: [
            {
                text: "Oops! Looks like you're submitting to ",
            },
            {
                text: 'yourself',
                type: 'next-step-email',
            },
            {
                text: '. Approving your own reports is ',
            },
            {
                text: 'forbidden',
                type: 'next-step-email',
            },
            {
                text: ' by your workspace. Please submit this report to someone else or contact your admin to change the person you submit to.',
            },
        ],
    };
    return optimisticNextStep;
}
/**
 * Please don't use this function anymore, let's use buildNextStepNew instead
 *
 * @param report
 * @param predictedNextStatus - a next expected status of the report
 * @param shouldFixViolations - whether to show `fix the issue` next step
 * @param isUnapprove - whether a report is being unapproved
 * @param isReopen - whether a report is being reopened
 * @returns nextStep
 */
function buildNextStep(report, predictedNextStatus, shouldFixViolations, isUnapprove, isReopen) {
    if (!(0, ReportUtils_1.isExpenseReport)(report)) {
        return null;
    }
    const { policyID = '', ownerAccountID = -1 } = report ?? {};
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`] ?? {};
    const { harvesting, autoReportingOffset } = policy;
    const autoReportingFrequency = (0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy);
    const hasViolations = (0, ReportUtils_1.hasViolations)(report?.reportID, transactionViolations);
    const isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    const isInstantSubmitEnabled = autoReportingFrequency === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT;
    const shouldShowFixMessage = hasViolations && isInstantSubmitEnabled && !isASAPSubmitBetaEnabled;
    const [policyOwnerPersonalDetails, ownerPersonalDetails] = (0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({
        accountIDs: [policy.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, ownerAccountID],
        currentUserAccountID,
        shouldChangeUserDisplayName: true,
    });
    const isReportContainingTransactions = report &&
        ((report.total !== 0 && report.total !== undefined) ||
            (report.unheldTotal !== 0 && report.unheldTotal !== undefined) ||
            (report.unheldNonReimbursableTotal !== 0 && report.unheldNonReimbursableTotal !== undefined));
    const { reimbursableSpend } = (0, ReportUtils_1.getMoneyRequestSpendBreakdown)(report);
    const ownerDisplayName = ownerPersonalDetails?.displayName ?? ownerPersonalDetails?.login ?? (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: ownerAccountID });
    const policyOwnerDisplayName = policyOwnerPersonalDetails?.displayName ?? policyOwnerPersonalDetails?.login ?? (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: policy.ownerAccountID });
    const nextApproverDisplayName = getNextApproverDisplayName(report, isUnapprove);
    const approverAccountID = (0, ReportUtils_1.getNextApproverAccountID)(report, isUnapprove);
    const approvers = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)([approverAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID]);
    const reimburserAccountID = (0, PolicyUtils_1.getReimburserAccountID)(policy);
    const hasValidAccount = !!policy?.achAccount?.accountNumber || policy.reimbursementChoice !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES;
    const type = 'neutral';
    let optimisticNextStep;
    const nextStepPayExpense = {
        type,
        icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
        message: [
            {
                text: 'Waiting for ',
            },
            ownerAccountID === -1 || !policy.ownerAccountID
                ? {
                    text: 'an admin',
                }
                : {
                    text: shouldShowFixMessage ? ownerDisplayName : policyOwnerDisplayName,
                    type: 'strong',
                },
            {
                text: ' to ',
            },
            ...(shouldShowFixMessage ? [{ text: 'fix the issue(s)' }] : [{ text: 'pay' }, { text: ' %expenses.' }]),
        ],
    };
    const noActionRequired = {
        icon: CONST_1.default.NEXT_STEP.ICONS.CHECKMARK,
        type,
        message: [
            {
                text: 'No further action required!',
            },
        ],
    };
    switch (predictedNextStatus) {
        // Generates an optimistic nextStep once a report has been opened
        case CONST_1.default.REPORT.STATUS_NUM.OPEN:
            if ((isASAPSubmitBetaEnabled && hasViolations && isInstantSubmitEnabled) || shouldFixViolations) {
                optimisticNextStep = {
                    type,
                    icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
                    message: [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${ownerDisplayName}`,
                            type: 'strong',
                            clickToCopyText: ownerAccountID === currentUserAccountID ? currentUserEmail : '',
                        },
                        {
                            text: ' to ',
                        },
                        {
                            text: 'fix the issue(s)',
                        },
                    ],
                };
                break;
            }
            if (isReopen) {
                optimisticNextStep = {
                    type,
                    icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
                    message: [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${ownerDisplayName}`,
                            type: 'strong',
                            clickToCopyText: ownerAccountID === currentUserAccountID ? currentUserEmail : '',
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
                    ],
                };
                break;
            }
            // Self review
            optimisticNextStep = {
                type,
                icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
                message: [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `${ownerDisplayName}`,
                        type: 'strong',
                        clickToCopyText: ownerAccountID === currentUserAccountID ? currentUserEmail : '',
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
                ],
            };
            // Scheduled submit enabled
            if (harvesting?.enabled && autoReportingFrequency !== CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL && isReportContainingTransactions) {
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `${ownerDisplayName}`,
                        type: 'strong',
                        clickToCopyText: ownerAccountID === currentUserAccountID ? currentUserEmail : '',
                    },
                    {
                        text: `'s`,
                        type: 'strong',
                    },
                    {
                        text: ' %expenses to automatically submit',
                    },
                ];
                let harvestingSuffix = '';
                if (autoReportingFrequency) {
                    const currentDate = new Date();
                    let autoSubmissionDate = '';
                    let monthlyText = '';
                    if (autoReportingOffset === CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_DAY_OF_MONTH) {
                        monthlyText = 'on the last day of the month';
                    }
                    else if (autoReportingOffset === CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_BUSINESS_DAY_OF_MONTH) {
                        monthlyText = 'on the last business day of the month';
                    }
                    else if (autoReportingOffset !== undefined) {
                        autoSubmissionDate = (0, date_fns_1.format)((0, date_fns_1.setDate)(currentDate, autoReportingOffset), CONST_1.default.DATE.ORDINAL_DAY_OF_MONTH);
                    }
                    const harvestingSuffixes = {
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE]: 'later today',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY]: 'on Sunday',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.SEMI_MONTHLY]: 'on the 1st and 16th of each month',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY]: autoSubmissionDate ? `on the ${autoSubmissionDate} of each month` : monthlyText,
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.TRIP]: 'at the end of their trip',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT]: '',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL]: '',
                    };
                    if (harvestingSuffixes[autoReportingFrequency]) {
                        harvestingSuffix = `${harvestingSuffixes[autoReportingFrequency]}`;
                    }
                }
                optimisticNextStep.message.push({
                    text: ` ${harvestingSuffix}`,
                });
            }
            // Manual submission
            if (report?.total !== 0 && !harvesting?.enabled && autoReportingFrequency === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL) {
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `${ownerDisplayName}`,
                        type: 'strong',
                        clickToCopyText: ownerAccountID === currentUserAccountID ? currentUserEmail : '',
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
            }
            break;
        // Generates an optimistic nextStep once a report has been submitted
        case CONST_1.default.REPORT.STATUS_NUM.SUBMITTED: {
            if (policy.approvalMode === CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL) {
                optimisticNextStep = reimbursableSpend === 0 ? noActionRequired : nextStepPayExpense;
                break;
            }
            // Another owner
            optimisticNextStep = {
                type,
                icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
            };
            // We want to show pending approval next step for cases where the policy has approvals enabled
            const policyApprovalMode = (0, PolicyUtils_1.getApprovalWorkflow)(policy);
            if ([CONST_1.default.POLICY.APPROVAL_MODE.BASIC, CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED].some((approvalMode) => approvalMode === policyApprovalMode)) {
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: nextApproverDisplayName,
                        type: 'strong',
                        clickToCopyText: approvers.at(0),
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
            }
            else {
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    (0, ReportUtils_1.isPayer)({
                        accountID: currentUserAccountID,
                        email: currentUserEmail,
                    }, report)
                        ? {
                            text: `you`,
                            type: 'strong',
                        }
                        : {
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
            }
            break;
        }
        // Generates an optimistic nextStep once a report has been closed for example in the case of Submit and Close approval flow
        case CONST_1.default.REPORT.STATUS_NUM.CLOSED:
            optimisticNextStep = noActionRequired;
            break;
        // Generates an optimistic nextStep once a report has been paid
        case CONST_1.default.REPORT.STATUS_NUM.REIMBURSED:
            optimisticNextStep = noActionRequired;
            break;
        // Generates an optimistic nextStep once a report has been approved
        case CONST_1.default.REPORT.STATUS_NUM.APPROVED:
            if ((0, ReportUtils_1.isInvoiceReport)(report) ||
                !(0, ReportUtils_1.isPayer)({
                    accountID: currentUserAccountID,
                    email: currentUserEmail,
                }, report) ||
                reimbursableSpend === 0) {
                optimisticNextStep = noActionRequired;
                break;
            }
            // Self review
            optimisticNextStep = {
                type,
                icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
                message: [
                    {
                        text: 'Waiting for ',
                    },
                    reimburserAccountID === -1
                        ? {
                            text: 'an admin',
                        }
                        : {
                            text: (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: reimburserAccountID }),
                            type: 'strong',
                        },
                    {
                        text: ' to ',
                    },
                    {
                        text: hasValidAccount ? 'pay' : 'finish setting up',
                    },
                    {
                        text: hasValidAccount ? ' %expenses.' : ' a business bank account.',
                    },
                ],
            };
            break;
        // Resets a nextStep
        default:
            optimisticNextStep = null;
    }
    return optimisticNextStep;
}
/**
 * Generates an optimistic nextStep based on a current report status and other properties.
 * Need to rename this function and remove the buildNextStep function above after migrating to this function
 */
function buildNextStepNew(report, policy, currentUserAccountIDParam, currentUserEmailParam, hasViolations, isASAPSubmitBetaEnabled, predictedNextStatus, shouldFixViolations, isUnapprove, isReopen) {
    if (!(0, ReportUtils_1.isExpenseReport)(report)) {
        return null;
    }
    const { ownerAccountID = -1 } = report ?? {};
    const autoReportingFrequency = (0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy);
    const isInstantSubmitEnabled = autoReportingFrequency === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT;
    const shouldShowFixMessage = hasViolations && isInstantSubmitEnabled && !isASAPSubmitBetaEnabled;
    const [policyOwnerPersonalDetails, ownerPersonalDetails] = (0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({
        accountIDs: [policy?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, ownerAccountID],
        currentUserAccountID: currentUserAccountIDParam,
        shouldChangeUserDisplayName: true,
    });
    const isReportContainingTransactions = report &&
        ((report.total !== 0 && report.total !== undefined) ||
            (report.unheldTotal !== 0 && report.unheldTotal !== undefined) ||
            (report.unheldNonReimbursableTotal !== 0 && report.unheldNonReimbursableTotal !== undefined));
    const ownerDisplayName = ownerPersonalDetails?.displayName ?? ownerPersonalDetails?.login ?? (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: ownerAccountID });
    const policyOwnerDisplayName = policyOwnerPersonalDetails?.displayName ?? policyOwnerPersonalDetails?.login ?? (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: policy?.ownerAccountID });
    const nextApproverDisplayName = getNextApproverDisplayName(report, isUnapprove);
    const approverAccountID = (0, ReportUtils_1.getNextApproverAccountID)(report, isUnapprove);
    const approvers = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)([approverAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID]);
    const reimburserAccountID = (0, PolicyUtils_1.getReimburserAccountID)(policy);
    const hasValidAccount = !!policy?.achAccount?.accountNumber || policy?.reimbursementChoice !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES;
    const type = 'neutral';
    let optimisticNextStep;
    const nextStepPayExpense = {
        type,
        icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
        message: [
            {
                text: 'Waiting for ',
            },
            ownerAccountID === -1 || !policy?.ownerAccountID
                ? {
                    text: 'an admin',
                }
                : {
                    text: shouldShowFixMessage ? ownerDisplayName : policyOwnerDisplayName,
                    type: 'strong',
                },
            {
                text: ' to ',
            },
            ...(shouldShowFixMessage ? [{ text: 'fix the issue(s)' }] : [{ text: 'pay' }, { text: ' %expenses.' }]),
        ],
    };
    const noActionRequired = {
        icon: CONST_1.default.NEXT_STEP.ICONS.CHECKMARK,
        type,
        message: [
            {
                text: 'No further action required!',
            },
        ],
    };
    switch (predictedNextStatus) {
        // Generates an optimistic nextStep once a report has been opened
        case CONST_1.default.REPORT.STATUS_NUM.OPEN:
            if ((isASAPSubmitBetaEnabled && hasViolations && isInstantSubmitEnabled) || shouldFixViolations) {
                optimisticNextStep = {
                    type,
                    icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
                    message: [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${ownerDisplayName}`,
                            type: 'strong',
                            clickToCopyText: ownerAccountID === currentUserAccountIDParam ? currentUserEmailParam : '',
                        },
                        {
                            text: ' to ',
                        },
                        {
                            text: 'fix the issue(s)',
                        },
                    ],
                };
                break;
            }
            if (isReopen) {
                optimisticNextStep = {
                    type,
                    icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
                    message: [
                        {
                            text: 'Waiting for ',
                        },
                        {
                            text: `${ownerDisplayName}`,
                            type: 'strong',
                            clickToCopyText: ownerAccountID === currentUserAccountIDParam ? currentUserEmailParam : '',
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
                    ],
                };
                break;
            }
            // Self review
            optimisticNextStep = {
                type,
                icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
                message: [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `${ownerDisplayName}`,
                        type: 'strong',
                        clickToCopyText: ownerAccountID === currentUserAccountIDParam ? currentUserEmailParam : '',
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
                ],
            };
            // Scheduled submit enabled
            if (policy?.harvesting?.enabled && autoReportingFrequency !== CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL && isReportContainingTransactions) {
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `${ownerDisplayName}`,
                        type: 'strong',
                        clickToCopyText: ownerAccountID === currentUserAccountIDParam ? currentUserEmailParam : '',
                    },
                    {
                        text: `'s`,
                        type: 'strong',
                    },
                    {
                        text: ' %expenses to automatically submit',
                    },
                ];
                let harvestingSuffix = '';
                if (autoReportingFrequency) {
                    const currentDate = new Date();
                    let autoSubmissionDate = '';
                    let monthlyText = '';
                    if (policy?.autoReportingOffset === CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_DAY_OF_MONTH) {
                        monthlyText = 'on the last day of the month';
                    }
                    else if (policy?.autoReportingOffset === CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_BUSINESS_DAY_OF_MONTH) {
                        monthlyText = 'on the last business day of the month';
                    }
                    else if (policy?.autoReportingOffset !== undefined) {
                        autoSubmissionDate = (0, date_fns_1.format)((0, date_fns_1.setDate)(currentDate, policy?.autoReportingOffset), CONST_1.default.DATE.ORDINAL_DAY_OF_MONTH);
                    }
                    const harvestingSuffixes = {
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE]: 'later today',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY]: 'on Sunday',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.SEMI_MONTHLY]: 'on the 1st and 16th of each month',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY]: autoSubmissionDate ? `on the ${autoSubmissionDate} of each month` : monthlyText,
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.TRIP]: 'at the end of their trip',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT]: '',
                        [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL]: '',
                    };
                    if (harvestingSuffixes[autoReportingFrequency]) {
                        harvestingSuffix = `${harvestingSuffixes[autoReportingFrequency]}`;
                    }
                }
                optimisticNextStep.message.push({
                    text: ` ${harvestingSuffix}`,
                });
            }
            // Manual submission
            if (report?.total !== 0 && !policy?.harvesting?.enabled && autoReportingFrequency === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL) {
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: `${ownerDisplayName}`,
                        type: 'strong',
                        clickToCopyText: ownerAccountID === currentUserAccountIDParam ? currentUserEmailParam : '',
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
            }
            break;
        // Generates an optimistic nextStep once a report has been submitted
        case CONST_1.default.REPORT.STATUS_NUM.SUBMITTED: {
            if (policy?.approvalMode === CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL) {
                optimisticNextStep = nextStepPayExpense;
                break;
            }
            // Another owner
            optimisticNextStep = {
                type,
                icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
            };
            // We want to show pending approval next step for cases where the policy has approvals enabled
            const policyApprovalMode = (0, PolicyUtils_1.getApprovalWorkflow)(policy);
            if ([CONST_1.default.POLICY.APPROVAL_MODE.BASIC, CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED].some((approvalMode) => approvalMode === policyApprovalMode)) {
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    {
                        text: nextApproverDisplayName,
                        type: 'strong',
                        clickToCopyText: approvers.at(0),
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
            }
            else {
                optimisticNextStep.message = [
                    {
                        text: 'Waiting for ',
                    },
                    (0, ReportUtils_1.isPayer)({
                        accountID: currentUserAccountIDParam,
                        email: currentUserEmailParam,
                    }, report)
                        ? {
                            text: `you`,
                            type: 'strong',
                        }
                        : {
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
            }
            break;
        }
        // Generates an optimistic nextStep once a report has been closed for example in the case of Submit and Close approval flow
        case CONST_1.default.REPORT.STATUS_NUM.CLOSED:
            optimisticNextStep = noActionRequired;
            break;
        // Generates an optimistic nextStep once a report has been paid
        case CONST_1.default.REPORT.STATUS_NUM.REIMBURSED:
            optimisticNextStep = noActionRequired;
            break;
        // Generates an optimistic nextStep once a report has been approved
        case CONST_1.default.REPORT.STATUS_NUM.APPROVED:
            if ((0, ReportUtils_1.isInvoiceReport)(report) ||
                !(0, ReportUtils_1.isPayer)({
                    accountID: currentUserAccountIDParam,
                    email: currentUserEmailParam,
                }, report)) {
                optimisticNextStep = noActionRequired;
                break;
            }
            // Self review
            optimisticNextStep = {
                type,
                icon: CONST_1.default.NEXT_STEP.ICONS.HOURGLASS,
                message: [
                    {
                        text: 'Waiting for ',
                    },
                    reimburserAccountID === -1
                        ? {
                            text: 'an admin',
                        }
                        : {
                            text: (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: reimburserAccountID }),
                            type: 'strong',
                        },
                    {
                        text: ' to ',
                    },
                    {
                        text: hasValidAccount ? 'pay' : 'finish setting up',
                    },
                    {
                        text: hasValidAccount ? ' %expenses.' : ' a business bank account.',
                    },
                ],
            };
            break;
        // Resets a nextStep
        default:
            optimisticNextStep = null;
    }
    return optimisticNextStep;
}
