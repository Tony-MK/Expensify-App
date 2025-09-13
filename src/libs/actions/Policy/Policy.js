"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveWorkspace = leaveWorkspace;
exports.addBillingCardAndRequestPolicyOwnerChange = addBillingCardAndRequestPolicyOwnerChange;
exports.hasActiveChatEnabledPolicies = hasActiveChatEnabledPolicies;
exports.setWorkspaceErrors = setWorkspaceErrors;
exports.hideWorkspaceAlertMessage = hideWorkspaceAlertMessage;
exports.deleteWorkspace = deleteWorkspace;
exports.updateAddress = updateAddress;
exports.updateLastAccessedWorkspace = updateLastAccessedWorkspace;
exports.clearDeleteWorkspaceError = clearDeleteWorkspaceError;
exports.setWorkspaceDefaultSpendCategory = setWorkspaceDefaultSpendCategory;
exports.generateDefaultWorkspaceName = generateDefaultWorkspaceName;
exports.updateGeneralSettings = updateGeneralSettings;
exports.deleteWorkspaceAvatar = deleteWorkspaceAvatar;
exports.updateWorkspaceAvatar = updateWorkspaceAvatar;
exports.clearAvatarErrors = clearAvatarErrors;
exports.generatePolicyID = generatePolicyID;
exports.createWorkspace = createWorkspace;
exports.openPolicyTaxesPage = openPolicyTaxesPage;
exports.openWorkspaceInvitePage = openWorkspaceInvitePage;
exports.openWorkspace = openWorkspace;
exports.removeWorkspace = removeWorkspace;
exports.createWorkspaceFromIOUPayment = createWorkspaceFromIOUPayment;
exports.clearErrors = clearErrors;
exports.dismissAddedWithPrimaryLoginMessages = dismissAddedWithPrimaryLoginMessages;
exports.openDraftWorkspaceRequest = openDraftWorkspaceRequest;
exports.createDraftInitialWorkspace = createDraftInitialWorkspace;
exports.buildOptimisticRecentlyUsedCurrencies = buildOptimisticRecentlyUsedCurrencies;
exports.setWorkspaceInviteMessageDraft = setWorkspaceInviteMessageDraft;
exports.setWorkspaceApprovalMode = setWorkspaceApprovalMode;
exports.setWorkspaceAutoReportingFrequency = setWorkspaceAutoReportingFrequency;
exports.setWorkspaceAutoReportingMonthlyOffset = setWorkspaceAutoReportingMonthlyOffset;
exports.updateWorkspaceDescription = updateWorkspaceDescription;
exports.setWorkspacePayer = setWorkspacePayer;
exports.setWorkspaceReimbursement = setWorkspaceReimbursement;
exports.openPolicyWorkflowsPage = openPolicyWorkflowsPage;
exports.enableCompanyCards = enableCompanyCards;
exports.enablePolicyConnections = enablePolicyConnections;
exports.enablePolicyReceiptPartners = enablePolicyReceiptPartners;
exports.enablePolicyReportFields = enablePolicyReportFields;
exports.enablePolicyTaxes = enablePolicyTaxes;
exports.enablePolicyWorkflows = enablePolicyWorkflows;
exports.enableDistanceRequestTax = enableDistanceRequestTax;
exports.enablePolicyInvoicing = enablePolicyInvoicing;
exports.openPolicyMoreFeaturesPage = openPolicyMoreFeaturesPage;
exports.openPolicyProfilePage = openPolicyProfilePage;
exports.openPolicyInitialPage = openPolicyInitialPage;
exports.generateCustomUnitID = generateCustomUnitID;
exports.clearQBOErrorField = clearQBOErrorField;
exports.clearXeroErrorField = clearXeroErrorField;
exports.clearSageIntacctErrorField = clearSageIntacctErrorField;
exports.clearNetSuiteErrorField = clearNetSuiteErrorField;
exports.clearNetSuitePendingField = clearNetSuitePendingField;
exports.clearNetSuiteAutoSyncErrorField = clearNetSuiteAutoSyncErrorField;
exports.removeNetSuiteCustomFieldByIndex = removeNetSuiteCustomFieldByIndex;
exports.setWorkspaceCurrencyDefault = setWorkspaceCurrencyDefault;
exports.setForeignCurrencyDefault = setForeignCurrencyDefault;
exports.setPolicyCustomTaxName = setPolicyCustomTaxName;
exports.clearPolicyErrorField = clearPolicyErrorField;
exports.isCurrencySupportedForDirectReimbursement = isCurrencySupportedForDirectReimbursement;
exports.isCurrencySupportedForGlobalReimbursement = isCurrencySupportedForGlobalReimbursement;
exports.getInvoicePrimaryWorkspace = getInvoicePrimaryWorkspace;
exports.createDraftWorkspace = createDraftWorkspace;
exports.savePreferredExportMethod = savePreferredExportMethod;
exports.buildPolicyData = buildPolicyData;
exports.enableExpensifyCard = enableExpensifyCard;
exports.createPolicyExpenseChats = createPolicyExpenseChats;
exports.upgradeToCorporate = upgradeToCorporate;
exports.openPolicyExpensifyCardsPage = openPolicyExpensifyCardsPage;
exports.updateMemberCustomField = updateMemberCustomField;
exports.openPolicyEditCardLimitTypePage = openPolicyEditCardLimitTypePage;
exports.requestExpensifyCardLimitIncrease = requestExpensifyCardLimitIncrease;
exports.getAdminPolicies = getAdminPolicies;
exports.getAdminPoliciesConnectedToNetSuite = getAdminPoliciesConnectedToNetSuite;
exports.getAdminPoliciesConnectedToSageIntacct = getAdminPoliciesConnectedToSageIntacct;
exports.hasInvoicingDetails = hasInvoicingDetails;
exports.clearAllPolicies = clearAllPolicies;
exports.enablePolicyRules = enablePolicyRules;
exports.setPolicyDefaultReportTitle = setPolicyDefaultReportTitle;
exports.clearQBDErrorField = clearQBDErrorField;
exports.setPolicyPreventMemberCreatedTitle = setPolicyPreventMemberCreatedTitle;
exports.setPolicyPreventSelfApproval = setPolicyPreventSelfApproval;
exports.setPolicyAutomaticApprovalLimit = setPolicyAutomaticApprovalLimit;
exports.setPolicyAutomaticApprovalRate = setPolicyAutomaticApprovalRate;
exports.setPolicyAutoReimbursementLimit = setPolicyAutoReimbursementLimit;
exports.enablePolicyAutoReimbursementLimit = enablePolicyAutoReimbursementLimit;
exports.enableAutoApprovalOptions = enableAutoApprovalOptions;
exports.setPolicyMaxExpenseAmountNoReceipt = setPolicyMaxExpenseAmountNoReceipt;
exports.setPolicyMaxExpenseAmount = setPolicyMaxExpenseAmount;
exports.setPolicyMaxExpenseAge = setPolicyMaxExpenseAge;
exports.updateCustomRules = updateCustomRules;
exports.setPolicyProhibitedExpense = setPolicyProhibitedExpense;
exports.setDuplicateWorkspaceData = setDuplicateWorkspaceData;
exports.clearDuplicateWorkspace = clearDuplicateWorkspace;
exports.setPolicyBillableMode = setPolicyBillableMode;
exports.disableWorkspaceBillableExpenses = disableWorkspaceBillableExpenses;
exports.setWorkspaceEReceiptsEnabled = setWorkspaceEReceiptsEnabled;
exports.verifySetupIntentAndRequestPolicyOwnerChange = verifySetupIntentAndRequestPolicyOwnerChange;
exports.updateInvoiceCompanyName = updateInvoiceCompanyName;
exports.updateInvoiceCompanyWebsite = updateInvoiceCompanyWebsite;
exports.downgradeToTeam = downgradeToTeam;
exports.getAccessiblePolicies = getAccessiblePolicies;
exports.clearGetAccessiblePoliciesErrors = clearGetAccessiblePoliciesErrors;
exports.calculateBillNewDot = calculateBillNewDot;
exports.payAndDowngrade = payAndDowngrade;
exports.togglePolicyUberAutoInvite = togglePolicyUberAutoInvite;
exports.openDuplicatePolicyPage = openDuplicatePolicyPage;
exports.togglePolicyUberAutoRemove = togglePolicyUberAutoRemove;
exports.clearBillingReceiptDetailsErrors = clearBillingReceiptDetailsErrors;
exports.clearQuickbooksOnlineAutoSyncErrorField = clearQuickbooksOnlineAutoSyncErrorField;
exports.setIsForcedToChangeCurrency = setIsForcedToChangeCurrency;
exports.duplicateWorkspace = duplicateWorkspace;
exports.removePolicyReceiptPartnersConnection = removePolicyReceiptPartnersConnection;
exports.openPolicyReceiptPartnersPage = openPolicyReceiptPartnersPage;
exports.setIsComingFromGlobalReimbursementsFlow = setIsComingFromGlobalReimbursementsFlow;
exports.setPolicyAttendeeTrackingEnabled = setPolicyAttendeeTrackingEnabled;
exports.setPolicyReimbursableMode = setPolicyReimbursableMode;
exports.getCashExpenseReimbursableMode = getCashExpenseReimbursableMode;
exports.updateInterestedFeatures = updateInterestedFeatures;
exports.clearPolicyTitleFieldError = clearPolicyTitleFieldError;
exports.inviteWorkspaceEmployeesToUber = inviteWorkspaceEmployeesToUber;
const expensify_common_1 = require("expensify-common");
const escapeRegExp_1 = require("lodash/escapeRegExp");
const union_1 = require("lodash/union");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const CurrencyUtils = require("@libs/CurrencyUtils");
const DateUtils_1 = require("@libs/DateUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const GoogleTagManager_1 = require("@libs/GoogleTagManager");
const Localize_1 = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const NetworkStore = require("@libs/Network/NetworkStore");
const NumberUtils = require("@libs/NumberUtils");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const PhoneNumber = require("@libs/PhoneNumber");
const PolicyUtils = require("@libs/PolicyUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils = require("@libs/ReportUtils");
const PaymentMethods = require("@userActions/PaymentMethods");
const PersistedRequests = require("@userActions/PersistedRequests");
const Task_1 = require("@userActions/Task");
const OnboardingFlow_1 = require("@userActions/Welcome/OnboardingFlow");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const Category_1 = require("./Category");
const allPolicies = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    callback: (val, key) => {
        if (!key) {
            return;
        }
        if (val === null || val === undefined) {
            // If we are deleting a policy, we have to check every report linked to that policy
            // and unset the draft indicator (pencil icon) alongside removing any draft comments. Clearing these values will keep the newly archived chats from being displayed in the LHN.
            // More info: https://github.com/Expensify/App/issues/14260
            const policyID = key.replace(ONYXKEYS_1.default.COLLECTION.POLICY, '');
            const policyReports = ReportUtils.getAllPolicyReports(policyID);
            const cleanUpMergeQueries = {};
            const cleanUpSetQueries = {};
            policyReports.forEach((policyReport) => {
                if (!policyReport) {
                    return;
                }
                const { reportID } = policyReport;
                cleanUpSetQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${reportID}`] = null;
                cleanUpSetQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${reportID}`] = null;
            });
            react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT, cleanUpMergeQueries);
            react_native_onyx_1.default.multiSet(cleanUpSetQueries);
            delete allPolicies[key];
            return;
        }
        allPolicies[key] = val;
    },
});
let allReports;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
let allReportActions;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: (actions) => {
        allReportActions = actions;
    },
});
let sessionEmail = '';
let sessionAccountID = 0;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (val) => {
        sessionEmail = val?.email ?? '';
        sessionAccountID = val?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    },
});
let allPersonalDetails;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (val) => (allPersonalDetails = val),
});
let reimbursementAccount;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
    callback: (val) => (reimbursementAccount = val),
});
let allRecentlyUsedCurrencies;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.RECENTLY_USED_CURRENCIES,
    callback: (val) => (allRecentlyUsedCurrencies = val ?? []),
});
let activePolicyID;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
    callback: (value) => (activePolicyID = value),
});
let allTransactionViolations = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
    waitForCollectionCallback: true,
    callback: (value) => (allTransactionViolations = value),
});
let introSelected;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_INTRO_SELECTED,
    callback: (value) => (introSelected = value),
});
/**
 * Stores in Onyx the policy ID of the last workspace that was accessed by the user
 */
function updateLastAccessedWorkspace(policyID) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.LAST_ACCESSED_WORKSPACE_POLICY_ID, policyID ?? null);
}
/**
 * Checks if the currency is supported for direct reimbursement
 * USD currency is the only one supported in NewDot for now
 */
function isCurrencySupportedForDirectReimbursement(currency) {
    return currency === CONST_1.default.CURRENCY.USD;
}
/**
 * Checks if the currency is supported for global reimbursement
 */
function isCurrencySupportedForGlobalReimbursement(currency, canUseGlobalReimbursementsOnND) {
    if (canUseGlobalReimbursementsOnND) {
        return CONST_1.default.DIRECT_REIMBURSEMENT_CURRENCIES.includes(currency);
    }
    return currency === CONST_1.default.CURRENCY.USD;
}
/**
 * Returns the policy of the report
 * @deprecated Get the data straight from Onyx - This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
 */
function getPolicy(policyID) {
    if (!allPolicies || !policyID) {
        return undefined;
    }
    return allPolicies[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
}
/** Check if the policy has invoicing company details */
function hasInvoicingDetails(policy) {
    return !!policy?.invoice?.companyName && !!policy?.invoice?.companyWebsite;
}
/**
 * Returns a primary invoice workspace for the user
 */
function getInvoicePrimaryWorkspace(currentUserLogin) {
    if (PolicyUtils.canSendInvoiceFromWorkspace(activePolicyID)) {
        return allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`];
    }
    const activeAdminWorkspaces = PolicyUtils.getActiveAdminWorkspaces(allPolicies, currentUserLogin);
    return activeAdminWorkspaces.find((policy) => PolicyUtils.canSendInvoiceFromWorkspace(policy.id));
}
/**
 * Check if the user has any active free policies (aka workspaces)
 */
function hasActiveChatEnabledPolicies(policies, includeOnlyAdminPolicies = false) {
    const chatEnabledPolicies = Object.values(policies ?? {}).filter((policy) => policy?.isPolicyExpenseChatEnabled && (!includeOnlyAdminPolicies || policy.role === CONST_1.default.POLICY.ROLE.ADMIN));
    if (chatEnabledPolicies.length === 0) {
        return false;
    }
    if (chatEnabledPolicies.some((policy) => !policy?.pendingAction)) {
        return true;
    }
    if (chatEnabledPolicies.some((policy) => policy?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD)) {
        return true;
    }
    if (chatEnabledPolicies.some((policy) => policy?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)) {
        return false;
    }
    // If there are no add or delete pending actions the only option left is an update
    // pendingAction, in which case we should return true.
    return true;
}
/**
 * Delete the workspace
 */
function deleteWorkspace(policyID, policyName, lastAccessedWorkspacePolicyID, lastUsedPaymentMethods) {
    if (!allPolicies) {
        return;
    }
    const filteredPolicies = Object.values(allPolicies).filter((policy) => policy?.id !== policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                avatarURL: '',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                errors: null,
            },
        },
        ...(!hasActiveChatEnabledPolicies(filteredPolicies, true)
            ? [
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                    value: {
                        errors: null,
                    },
                },
            ]
            : []),
    ];
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    // Restore the old report stateNum and statusNum
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
            value: {
                errors: reimbursementAccount?.errors ?? null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                avatarURL: policy?.avatarURL,
                pendingAction: null,
            },
        },
    ];
    if (policyID === activePolicyID) {
        const personalPolicyID = PolicyUtils.getPersonalPolicy()?.id;
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
            value: personalPolicyID,
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
            value: activePolicyID,
        });
    }
    const reportsToArchive = Object.values(allReports ?? {}).filter((report) => ReportUtils.isPolicyRelatedReport(report, policyID) && (ReportUtils.isChatRoom(report) || ReportUtils.isPolicyExpenseChat(report) || ReportUtils.isTaskReport(report)));
    const finallyData = [];
    const currentTime = DateUtils_1.default.getDBTime();
    reportsToArchive.forEach((report) => {
        const { reportID, ownerAccountID, oldPolicyName } = report ?? {};
        const isInvoiceReceiverReport = report?.invoiceReceiver && 'policyID' in report.invoiceReceiver && report.invoiceReceiver.policyID === policyID;
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                ...(!isInvoiceReceiverReport && {
                    oldPolicyName: allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.name,
                    policyName: '',
                }),
                isPinned: false,
            },
        });
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`,
            value: {
                private_isArchived: currentTime,
            },
        });
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${reportID}`,
            value: null,
        });
        // Add closed actions to all chat reports linked to this policy
        // Announce & admin chats have FAKE owners, but expense chats w/ users do have owners.
        let emailClosingReport = CONST_1.default.POLICY.OWNER_EMAIL_FAKE;
        if (!!ownerAccountID && ownerAccountID !== CONST_1.default.POLICY.OWNER_ACCOUNT_ID_FAKE) {
            emailClosingReport = allPersonalDetails?.[ownerAccountID]?.login ?? '';
        }
        const optimisticClosedReportAction = ReportUtils.buildOptimisticClosedReportAction(emailClosingReport, policyName, CONST_1.default.REPORT.ARCHIVE_REASON.POLICY_DELETED);
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticClosedReportAction.reportActionID]: optimisticClosedReportAction,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                oldPolicyName,
                policyName: report?.policyName,
                isPinned: report?.isPinned,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`,
            value: {
                private_isArchived: null,
            },
        });
        // We are temporarily adding this workaround because 'DeleteWorkspace' doesn't
        // support receiving the optimistic reportActions' ids for the moment.
        finallyData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticClosedReportAction.reportActionID]: null,
            },
        });
        if (report?.iouReportID) {
            const reportTransactions = ReportUtils.getReportTransactions(report.iouReportID);
            for (const transaction of reportTransactions) {
                const violations = allTransactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`];
                optimisticData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
                    value: violations?.filter((violation) => violation.type !== CONST_1.default.VIOLATION_TYPES.VIOLATION),
                });
                failureData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
                    value: violations,
                });
            }
        }
    });
    Object.keys(lastUsedPaymentMethods ?? {})?.forEach((paymentMethodKey) => {
        const lastUsedPaymentMethod = lastUsedPaymentMethods?.[paymentMethodKey];
        if (typeof lastUsedPaymentMethod === 'string' || !lastUsedPaymentMethod) {
            return;
        }
        if (lastUsedPaymentMethod?.iou?.name === policyID) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
                value: {
                    [paymentMethodKey]: {
                        iou: {
                            name: policyID !== lastUsedPaymentMethod?.lastUsed?.name ? lastUsedPaymentMethod?.lastUsed?.name : '',
                        },
                        lastUsed: {
                            name: policyID !== lastUsedPaymentMethod?.lastUsed?.name ? lastUsedPaymentMethod?.lastUsed?.name : '',
                        },
                    },
                },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
                value: {
                    [paymentMethodKey]: {
                        iou: {
                            name: lastUsedPaymentMethod?.iou?.name,
                        },
                        lastUsed: {
                            name: lastUsedPaymentMethod?.iou?.name,
                        },
                    },
                },
            });
        }
    });
    const params = { policyID };
    API.write(types_1.WRITE_COMMANDS.DELETE_WORKSPACE, params, { optimisticData, finallyData, failureData });
    // Reset the lastAccessedWorkspacePolicyID
    if (policyID === lastAccessedWorkspacePolicyID) {
        updateLastAccessedWorkspace(undefined);
    }
}
function setWorkspaceAutoReportingFrequency(policyID, frequency) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const wasPolicyOnManualReporting = PolicyUtils.getCorrectedAutoReportingFrequency(policy) === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                // Recall that the "daily" and "manual" frequencies don't actually exist in Onyx or the DB (see PolicyUtils.getCorrectedAutoReportingFrequency)
                autoReportingFrequency: frequency === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL ? CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE : frequency,
                pendingFields: { autoReportingFrequency: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                // To set the frequency to "manual", we really must set it to "immediate" with harvesting disabled
                ...(frequency === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL && {
                    harvesting: {
                        enabled: false,
                    },
                }),
                // If the policy was on manual reporting before, and now will be auto-reported,
                // then we must re-enable harvesting
                ...(wasPolicyOnManualReporting &&
                    frequency !== CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL && {
                    harvesting: {
                        enabled: true,
                    },
                }),
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoReportingFrequency: policy?.autoReportingFrequency ?? null,
                harvesting: policy?.harvesting ?? null,
                pendingFields: { autoReportingFrequency: null },
                errorFields: { autoReportingFrequency: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workflowsDelayedSubmissionPage.autoReportingFrequencyErrorMessage') },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: { autoReportingFrequency: null },
            },
        },
    ];
    const params = { policyID, frequency };
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_AUTO_REPORTING_FREQUENCY, params, { optimisticData, failureData, successData });
}
function setWorkspaceAutoReportingMonthlyOffset(policyID, autoReportingOffset) {
    const value = JSON.stringify({ autoReportingOffset });
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoReportingOffset,
                pendingFields: { autoReportingOffset: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoReportingOffset: policy?.autoReportingOffset ?? null,
                pendingFields: { autoReportingOffset: null },
                errorFields: { autoReportingOffset: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workflowsDelayedSubmissionPage.monthlyOffsetErrorMessage') },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: { autoReportingOffset: null },
            },
        },
    ];
    const params = { policyID, value };
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_AUTO_REPORTING_MONTHLY_OFFSET, params, { optimisticData, failureData, successData });
}
function setWorkspaceApprovalMode(policyID, approver, approvalMode) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const updatedEmployeeList = {};
    if (approvalMode === CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL) {
        Object.keys(policy?.employeeList ?? {}).forEach((employee) => {
            updatedEmployeeList[employee] = {
                ...policy?.employeeList?.[employee],
                submitsTo: approver,
                forwardsTo: '',
            };
        });
    }
    const value = {
        approver,
        approvalMode,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                ...value,
                pendingFields: { approvalMode: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                employeeList: approvalMode === CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL ? updatedEmployeeList : policy?.employeeList,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                approver: policy?.approver,
                approvalMode: policy?.approvalMode,
                pendingFields: { approvalMode: null },
                errorFields: { approvalMode: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workflowsApproverPage.genericErrorMessage') },
                employeeList: policy?.employeeList,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: { approvalMode: null },
            },
        },
    ];
    const params = {
        policyID,
        value: JSON.stringify({
            ...value,
            // This property should now be set to false for all Collect policies
            isAutoApprovalEnabled: false,
        }),
    };
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_APPROVAL_MODE, params, { optimisticData, failureData, successData });
}
function setWorkspacePayer(policyID, reimburserEmail) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                reimburser: reimburserEmail,
                achAccount: { reimburser: reimburserEmail },
                errorFields: { reimburser: null },
                pendingFields: { reimburser: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                errorFields: { reimburser: null },
                pendingFields: { reimburser: null },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                achAccount: { reimburser: policy?.achAccount?.reimburser ?? null },
                errorFields: { reimburser: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workflowsPayerPage.genericErrorMessage') },
                pendingFields: { reimburser: null },
            },
        },
    ];
    const params = { policyID, reimburserEmail };
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_PAYER, params, { optimisticData, failureData, successData });
}
function clearPolicyErrorField(policyID, fieldName) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { errorFields: { [fieldName]: null } });
}
function clearQBOErrorField(policyID, fieldName) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { quickbooksOnline: { config: { errorFields: { [fieldName]: null } } } } });
}
function clearQBDErrorField(policyID, fieldName) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { quickbooksDesktop: { config: { errorFields: { [fieldName]: null } } } } });
}
function clearXeroErrorField(policyID, fieldName) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { xero: { config: { errorFields: { [fieldName]: null } } } } });
}
function clearNetSuiteErrorField(policyID, fieldName) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { netsuite: { options: { config: { errorFields: { [fieldName]: null } } } } } });
}
function clearNetSuitePendingField(policyID, fieldName) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { netsuite: { options: { config: { pendingFields: { [fieldName]: null } } } } } });
}
function removeNetSuiteCustomFieldByIndex(allRecords, policyID, importCustomField, valueIndex) {
    // We allow multiple custom list records with the same internalID. Hence it is safe to remove by index.
    const filteredRecords = allRecords.filter((_, index) => index !== Number(valueIndex));
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        connections: {
            netsuite: {
                options: {
                    config: {
                        syncOptions: {
                            [importCustomField]: filteredRecords,
                        },
                    },
                },
            },
        },
    });
}
function clearSageIntacctErrorField(policyID, fieldName) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { intacct: { config: { errorFields: { [fieldName]: null } } } } });
}
function clearNetSuiteAutoSyncErrorField(policyID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { netsuite: { config: { errorFields: { autoSync: null } } } } });
}
function clearQuickbooksOnlineAutoSyncErrorField(policyID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { quickbooksOnline: { config: { errorFields: { autoSync: null } } } } });
}
function setWorkspaceReimbursement(policyID, reimbursementChoice, reimburserEmail) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                reimbursementChoice,
                isLoadingWorkspaceReimbursement: true,
                reimburser: reimburserEmail,
                achAccount: { reimburser: reimburserEmail },
                errorFields: { reimbursementChoice: null },
                pendingFields: { reimbursementChoice: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoadingWorkspaceReimbursement: false,
                errorFields: { reimbursementChoice: null },
                pendingFields: { reimbursementChoice: null },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoadingWorkspaceReimbursement: false,
                reimbursementChoice: policy?.reimbursementChoice ?? null,
                achAccount: { reimburser: policy?.achAccount?.reimburser ?? null },
                errorFields: { reimbursementChoice: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                pendingFields: { reimbursementChoice: null },
            },
        },
    ];
    const params = { policyID, reimbursementChoice };
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_REIMBURSEMENT, params, { optimisticData, failureData, successData });
}
function leaveWorkspace(policyID) {
    if (!policyID) {
        return;
    }
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    const workspaceChats = ReportUtils.getAllWorkspaceReports(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                employeeList: {
                    [sessionEmail]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: null,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingAction: policy?.pendingAction ?? null,
                employeeList: {
                    [sessionEmail]: {
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.people.error.genericRemove'),
                    },
                },
            },
        },
    ];
    const pendingChatMembers = ReportUtils.getPendingChatMembers([sessionAccountID], [], CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    workspaceChats.forEach((report) => {
        const parentReport = ReportUtils.getRootParentReport({ report });
        const reportToCheckOwner = (0, EmptyObject_1.isEmptyObject)(parentReport) ? report : parentReport;
        if (ReportUtils.isPolicyExpenseChat(report) && !ReportUtils.isReportOwner(reportToCheckOwner)) {
            return;
        }
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.reportID}`,
            value: {
                statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                oldPolicyName: policy?.name ?? '',
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`,
            value: {
                pendingChatMembers,
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`,
            value: {
                pendingChatMembers: null,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`,
            value: {
                pendingChatMembers: null,
            },
        });
    });
    const params = {
        policyID,
        email: sessionEmail,
    };
    API.write(types_1.WRITE_COMMANDS.LEAVE_POLICY, params, { optimisticData, successData, failureData });
}
function addBillingCardAndRequestPolicyOwnerChange(policyID, cardData) {
    if (!policyID) {
        return;
    }
    const { cardNumber, cardYear, cardMonth, cardCVV, addressName, addressZip, currency } = cardData;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                errorFields: null,
                isLoading: true,
                isChangeOwnerSuccessful: false,
                isChangeOwnerFailed: false,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoading: false,
                isChangeOwnerSuccessful: true,
                isChangeOwnerFailed: false,
                owner: sessionEmail,
                ownerAccountID: sessionAccountID,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoading: false,
                isChangeOwnerSuccessful: false,
                isChangeOwnerFailed: true,
            },
        },
    ];
    if (CONST_1.default.SCA_CURRENCIES.has(currency)) {
        const params = {
            cardNumber,
            cardYear,
            cardMonth,
            cardCVV,
            addressName,
            addressZip,
            currency: currency,
            isP2PDebitCard: false,
        };
        PaymentMethods.addPaymentCardSCA(params);
    }
    else {
        const params = {
            policyID,
            cardNumber,
            cardYear,
            cardMonth,
            cardCVV,
            addressName,
            addressZip,
            currency: currency,
        };
        // eslint-disable-next-line rulesdir/no-multiple-api-calls
        API.write(types_1.WRITE_COMMANDS.ADD_BILLING_CARD_AND_REQUEST_WORKSPACE_OWNER_CHANGE, params, { optimisticData, successData, failureData });
    }
}
/**
 * Properly updates the nvp_privateStripeCustomerID onyx data for 3DS payment
 *
 */
function verifySetupIntentAndRequestPolicyOwnerChange(policyID) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                errorFields: null,
                isLoading: true,
                isChangeOwnerSuccessful: false,
                isChangeOwnerFailed: false,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoading: false,
                isChangeOwnerSuccessful: true,
                isChangeOwnerFailed: false,
                owner: sessionEmail,
                ownerAccountID: sessionAccountID,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoading: false,
                isChangeOwnerSuccessful: false,
                isChangeOwnerFailed: true,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.VERIFY_SETUP_INTENT_AND_REQUEST_POLICY_OWNER_CHANGE, { accountID: sessionAccountID, policyID }, { optimisticData, successData, failureData });
}
/**
 * Optimistically create a chat for each member of the workspace, creates both optimistic and success data for onyx.
 *
 * @returns - object with onyxSuccessData, onyxOptimisticData, and optimisticReportIDs (map login to reportID)
 */
function createPolicyExpenseChats(policyID, invitedEmailsToAccountIDs, hasOutstandingChildRequest = false, notificationPreference = CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN) {
    const workspaceMembersChats = {
        onyxSuccessData: [],
        onyxOptimisticData: [],
        onyxFailureData: [],
        reportCreationData: {},
    };
    Object.keys(invitedEmailsToAccountIDs).forEach((email) => {
        const accountID = invitedEmailsToAccountIDs[email];
        const cleanAccountID = Number(accountID);
        const login = PhoneNumber.addSMSDomainIfPhoneNumber(email);
        const oldChat = ReportUtils.getPolicyExpenseChat(cleanAccountID, policyID);
        // If the chat already exists, we don't want to create a new one - just make sure it's not archived
        if (oldChat) {
            workspaceMembersChats.reportCreationData[login] = {
                reportID: oldChat.reportID,
            };
            workspaceMembersChats.onyxOptimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldChat.reportID}`,
                value: {
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                },
            });
            workspaceMembersChats.onyxOptimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${oldChat.reportID}`,
                value: {
                    private_isArchived: false,
                },
            });
            const currentTime = DateUtils_1.default.getDBTime();
            const reportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChat.reportID}`] ?? {};
            Object.values(reportActions).forEach((action) => {
                if (action.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) {
                    return;
                }
                workspaceMembersChats.onyxOptimisticData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${action.childReportID}`,
                    value: {
                        private_isArchived: null,
                    },
                });
                workspaceMembersChats.onyxFailureData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${action.childReportID}`,
                    value: {
                        private_isArchived: currentTime,
                    },
                });
            });
            return;
        }
        const optimisticReport = ReportUtils.buildOptimisticChatReport({
            participantList: [sessionAccountID, cleanAccountID],
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
            policyID,
            ownerAccountID: cleanAccountID,
            notificationPreference,
        });
        // Set correct notification preferences: visible for the submitter, hidden for others until there's activity
        if (optimisticReport.participants) {
            optimisticReport.participants[cleanAccountID] = {
                ...optimisticReport.participants[cleanAccountID],
                notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
            };
        }
        const optimisticCreatedAction = ReportUtils.buildOptimisticCreatedReportAction(login);
        workspaceMembersChats.reportCreationData[login] = {
            reportID: optimisticReport.reportID,
            reportActionID: optimisticCreatedAction.reportActionID,
        };
        workspaceMembersChats.onyxOptimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticReport.reportID}`,
            value: {
                ...optimisticReport,
                pendingFields: {
                    createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                hasOutstandingChildRequest,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${optimisticReport.reportID}`,
            value: {
                isOptimisticReport: true,
                pendingChatMembers: [
                    {
                        accountID: accountID.toString(),
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    },
                ],
            },
        });
        workspaceMembersChats.onyxOptimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticReport.reportID}`,
            value: { [optimisticCreatedAction.reportActionID]: optimisticCreatedAction },
        });
        workspaceMembersChats.onyxSuccessData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticReport.reportID}`,
            value: {
                pendingFields: {
                    createChat: null,
                },
                errorFields: {
                    createChat: null,
                },
                participants: {
                    [accountID]: allPersonalDetails && allPersonalDetails[accountID] ? {} : null,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${optimisticReport.reportID}`,
            value: {
                isOptimisticReport: false,
                pendingChatMembers: null,
            },
        });
        workspaceMembersChats.onyxSuccessData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticReport.reportID}`,
            value: { [optimisticCreatedAction.reportActionID]: { pendingAction: null } },
        });
        workspaceMembersChats.onyxFailureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${optimisticReport.reportID}`,
            value: {
                isLoadingInitialReportActions: false,
            },
        });
        workspaceMembersChats.onyxFailureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticReport.reportID}`,
            value: {
                errorFields: {
                    createChat: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('report.genericCreateReportFailureMessage'),
                },
            },
        });
    });
    return workspaceMembersChats;
}
/**
 * Updates a workspace avatar image
 */
function updateWorkspaceAvatar(policyID, file) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                avatarURL: file.uri,
                originalFileName: file.name,
                errorFields: {
                    avatarURL: null,
                },
                pendingFields: {
                    avatarURL: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: {
                    avatarURL: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                avatarURL: allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.avatarURL,
            },
        },
    ];
    const params = {
        policyID,
        file,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_AVATAR, params, { optimisticData, finallyData, failureData });
}
/**
 * Deletes the avatar image for the workspace
 */
function deleteWorkspaceAvatar(policyID) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: {
                    avatarURL: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
                errorFields: {
                    avatarURL: null,
                },
                avatarURL: '',
                originalFileName: null,
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: {
                    avatarURL: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                avatarURL: policy?.avatarURL,
                originalFileName: policy?.originalFileName,
                errorFields: {
                    avatarURL: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('avatarWithImagePicker.deleteWorkspaceError'),
                },
            },
        },
    ];
    const params = { policyID };
    API.write(types_1.WRITE_COMMANDS.DELETE_WORKSPACE_AVATAR, params, { optimisticData, finallyData, failureData });
}
/**
 * Clear error and pending fields for the workspace avatar
 */
function clearAvatarErrors(policyID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        errorFields: {
            avatarURL: null,
        },
        pendingFields: {
            avatarURL: null,
        },
    });
}
/**
 * Optimistically update the general settings. Set the general settings as pending until the response succeeds.
 * If the response fails set a general error message. Clear the error message when updating.
 */
function updateGeneralSettings(policyID, name, currencyValue) {
    if (!policyID) {
        return;
    }
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    if (!policy) {
        return;
    }
    const distanceUnit = PolicyUtils.getDistanceRateCustomUnit(policy);
    const customUnitID = distanceUnit?.customUnitID;
    const currency = currencyValue ?? policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    const currencyPendingAction = currency !== policy?.outputCurrency ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE : undefined;
    const namePendingAction = name !== policy?.name ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE : undefined;
    const currentRates = distanceUnit?.rates ?? {};
    const optimisticRates = {};
    const finallyRates = {};
    const failureRates = {};
    if (customUnitID) {
        for (const rateID of Object.keys(currentRates)) {
            optimisticRates[rateID] = {
                ...currentRates[rateID],
                pendingFields: { currency: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                currency,
            };
            finallyRates[rateID] = {
                ...currentRates[rateID],
                pendingFields: { currency: null },
                currency,
            };
            failureRates[rateID] = {
                ...currentRates[rateID],
                pendingFields: { currency: null },
                errorFields: { currency: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
            };
        }
    }
    const optimisticData = [
        {
            // We use SET because it's faster than merge and avoids a race condition when setting the currency and navigating the user to the Bank account page in confirmCurrencyChangeAndHideModal
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                ...policy,
                pendingFields: {
                    ...policy.pendingFields,
                    ...(namePendingAction !== undefined && { name: namePendingAction }),
                    ...(currencyPendingAction !== undefined && { outputCurrency: currencyPendingAction }),
                },
                // Clear errorFields in case the user didn't dismiss the general settings error
                errorFields: {
                    name: null,
                    outputCurrency: null,
                },
                name,
                outputCurrency: currency,
                ...(customUnitID && {
                    customUnits: {
                        ...policy.customUnits,
                        [customUnitID]: {
                            ...distanceUnit,
                            rates: optimisticRates,
                        },
                    },
                }),
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: {
                    name: null,
                    outputCurrency: null,
                },
                ...(customUnitID && {
                    customUnits: {
                        [customUnitID]: {
                            ...distanceUnit,
                            rates: finallyRates,
                        },
                    },
                }),
            },
        },
    ];
    const errorFields = {
        name: namePendingAction && ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.editor.genericFailureMessage'),
    };
    if (!errorFields.name && currencyPendingAction) {
        errorFields.outputCurrency = ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.editor.genericFailureMessage');
    }
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                errorFields,
                ...(customUnitID && {
                    customUnits: {
                        [customUnitID]: {
                            ...distanceUnit,
                            rates: failureRates,
                        },
                    },
                }),
            },
        },
    ];
    const params = {
        policyID,
        workspaceName: name,
        currency,
    };
    const persistedRequests = PersistedRequests.getAll();
    const createWorkspaceRequestChangedIndex = persistedRequests.findIndex((request) => request.data?.policyID === policyID && request.command === types_1.WRITE_COMMANDS.CREATE_WORKSPACE && request.data?.policyName !== name);
    const createWorkspaceRequest = persistedRequests.at(createWorkspaceRequestChangedIndex);
    if (createWorkspaceRequest && createWorkspaceRequestChangedIndex !== -1) {
        const workspaceRequest = {
            ...createWorkspaceRequest,
            data: {
                ...createWorkspaceRequest.data,
                policyName: name,
            },
        };
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
            name,
        });
        PersistedRequests.update(createWorkspaceRequestChangedIndex, workspaceRequest);
        return;
    }
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_GENERAL_SETTINGS, params, {
        optimisticData,
        finallyData,
        failureData,
    });
}
function updateWorkspaceDescription(policyID, description, currentDescription) {
    if (description === currentDescription) {
        return;
    }
    const parsedDescription = ReportUtils.getParsedComment(description);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                description: parsedDescription,
                pendingFields: {
                    description: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
                errorFields: {
                    description: null,
                },
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: {
                    description: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                errorFields: {
                    description: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.editor.genericFailureMessage'),
                },
            },
        },
    ];
    const params = {
        policyID,
        description: parsedDescription,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_DESCRIPTION, params, {
        optimisticData,
        finallyData,
        failureData,
    });
}
function setWorkspaceErrors(policyID, errors) {
    if (!allPolicies?.[policyID]) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { errors: null });
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { errors });
}
function hideWorkspaceAlertMessage(policyID) {
    if (!allPolicies?.[policyID]) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { alertMessage: '' });
}
function updateAddress(policyID, newAddress) {
    // TODO: Change API endpoint parameters format to make it possible to follow naming-convention
    const parameters = {
        policyID,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data[addressStreet]': newAddress.addressStreet,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data[city]': newAddress.city,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data[country]': newAddress.country,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data[state]': newAddress.state,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data[zipCode]': newAddress.zipCode,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                address: newAddress,
                pendingFields: {
                    address: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                address: newAddress,
                pendingFields: {
                    address: null,
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_ADDRESS, parameters, {
        optimisticData,
        finallyData,
    });
}
/**
 * Removes an error after trying to delete a workspace
 */
function clearDeleteWorkspaceError(policyID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        pendingAction: null,
        errors: null,
    });
}
/**
 * Removes the workspace after failure to create.
 */
function removeWorkspace(policyID) {
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, null);
}
function setDuplicateWorkspaceData(data) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.DUPLICATE_WORKSPACE, { ...data });
}
function clearDuplicateWorkspace() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.DUPLICATE_WORKSPACE, {});
}
/**
 * Generate a policy name based on an email and policy list.
 * @param [email] the email to base the workspace name on. If not passed, will use the logged-in user's email instead
 */
function generateDefaultWorkspaceName(email = '') {
    const emailParts = email ? email.split('@') : sessionEmail.split('@');
    if (!emailParts || emailParts.length !== 2) {
        return '';
    }
    const username = emailParts.at(0) ?? '';
    const domain = emailParts.at(1) ?? '';
    const userDetails = PersonalDetailsUtils.getPersonalDetailByEmail(email || sessionEmail);
    const displayName = userDetails?.displayName?.trim();
    let displayNameForWorkspace = '';
    if (!expensify_common_1.PUBLIC_DOMAINS_SET.has(domain.toLowerCase())) {
        displayNameForWorkspace = expensify_common_1.Str.UCFirst(domain.split('.').at(0) ?? '');
    }
    else if (displayName) {
        displayNameForWorkspace = expensify_common_1.Str.UCFirst(displayName);
    }
    else if (expensify_common_1.PUBLIC_DOMAINS_SET.has(domain.toLowerCase())) {
        displayNameForWorkspace = expensify_common_1.Str.UCFirst(username);
    }
    else {
        displayNameForWorkspace = userDetails?.phoneNumber ?? '';
    }
    const isSMSDomain = `@${domain}` === CONST_1.default.SMS.DOMAIN;
    if (isSMSDomain) {
        displayNameForWorkspace = (0, Localize_1.translateLocal)('workspace.new.myGroupWorkspace', {});
    }
    if ((0, EmptyObject_1.isEmptyObject)(allPolicies)) {
        return isSMSDomain ? (0, Localize_1.translateLocal)('workspace.new.myGroupWorkspace', {}) : (0, Localize_1.translateLocal)('workspace.new.workspaceName', { userName: displayNameForWorkspace });
    }
    // find default named workspaces and increment the last number
    const escapedName = (0, escapeRegExp_1.default)(displayNameForWorkspace);
    const workspaceTranslations = Object.values(CONST_1.default.LOCALES)
        .map((lang) => (0, Localize_1.translate)(lang, 'workspace.common.workspace'))
        .join('|');
    const workspaceRegex = isSMSDomain ? new RegExp(`^${escapedName}\\s*(\\d+)?$`, 'i') : new RegExp(`^(?=.*${escapedName})(?:.*(?:${workspaceTranslations})\\s*(\\d+)?)`, 'i');
    const workspaceNumbers = Object.values(allPolicies)
        .map((policy) => workspaceRegex.exec(policy?.name ?? ''))
        .filter(Boolean) // Remove null matches
        .map((match) => Number(match?.[1] ?? '0'));
    const lastWorkspaceNumber = workspaceNumbers.length > 0 ? Math.max(...workspaceNumbers) : undefined;
    if (isSMSDomain) {
        return (0, Localize_1.translateLocal)('workspace.new.myGroupWorkspace', { workspaceNumber: lastWorkspaceNumber !== undefined ? lastWorkspaceNumber + 1 : undefined });
    }
    return (0, Localize_1.translateLocal)('workspace.new.workspaceName', { userName: displayNameForWorkspace, workspaceNumber: lastWorkspaceNumber !== undefined ? lastWorkspaceNumber + 1 : undefined });
}
/**
 * Returns a client generated 16 character hexadecimal value for the policyID
 */
function generatePolicyID() {
    return NumberUtils.generateHexadecimalValue(16);
}
/**
 * Returns a client generated 13 character hexadecimal value for a custom unit ID
 */
function generateCustomUnitID() {
    return NumberUtils.generateHexadecimalValue(13);
}
function buildOptimisticDistanceRateCustomUnits(reportCurrency) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Disabling this line for safeness as nullish coalescing works only if the value is undefined or null
    const currency = reportCurrency || (allPersonalDetails?.[sessionAccountID]?.localCurrencyCode ?? CONST_1.default.CURRENCY.USD);
    const customUnitID = generateCustomUnitID();
    const customUnitRateID = generateCustomUnitID();
    const customUnits = {
        [customUnitID]: {
            customUnitID,
            name: CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE,
            attributes: {
                unit: CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES,
            },
            rates: {
                [customUnitRateID]: {
                    customUnitRateID,
                    name: CONST_1.default.CUSTOM_UNITS.DEFAULT_RATE,
                    rate: CONST_1.default.CUSTOM_UNITS.MILEAGE_IRS_RATE * CONST_1.default.POLICY.CUSTOM_UNIT_RATE_BASE_OFFSET,
                    enabled: true,
                    currency,
                },
            },
        },
    };
    return {
        customUnits,
        customUnitID,
        customUnitRateID,
        outputCurrency: currency,
    };
}
/**
 * Optimistically creates a Policy Draft for a new workspace
 *
 * @param [policyOwnerEmail] the email of the account to make the owner of the policy
 * @param [policyName] custom policy name we will use for created workspace
 * @param [policyID] custom policy id we will use for created workspace
 * @param [makeMeAdmin] leave the calling account as an admin on the policy
 * @param [currency] Optional, selected currency for the workspace
 * @param [file], avatar file for workspace
 */
function createDraftInitialWorkspace(policyOwnerEmail = '', policyName = '', policyID = generatePolicyID(), makeMeAdmin = false, currency = '', file) {
    const workspaceName = policyName || generateDefaultWorkspaceName(policyOwnerEmail);
    const { customUnits, outputCurrency } = buildOptimisticDistanceRateCustomUnits(currency);
    const shouldEnableWorkflowsByDefault = !introSelected?.choice || introSelected.choice === CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM || introSelected.choice === CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${policyID}`,
            value: {
                id: policyID,
                type: CONST_1.default.POLICY.TYPE.TEAM,
                name: workspaceName,
                role: CONST_1.default.POLICY.ROLE.ADMIN,
                owner: sessionEmail,
                ownerAccountID: sessionAccountID,
                isPolicyExpenseChatEnabled: true,
                areCategoriesEnabled: true,
                approver: sessionEmail,
                areCompanyCardsEnabled: true,
                areExpensifyCardsEnabled: false,
                outputCurrency,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                customUnits,
                makeMeAdmin,
                autoReporting: true,
                autoReportingFrequency: shouldEnableWorkflowsByDefault ? CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE : CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
                avatarURL: file?.uri ?? null,
                harvesting: {
                    enabled: !shouldEnableWorkflowsByDefault,
                },
                originalFileName: file?.name,
                employeeList: {
                    [sessionEmail]: {
                        submitsTo: sessionEmail,
                        email: sessionEmail,
                        role: CONST_1.default.POLICY.ROLE.ADMIN,
                        errors: {},
                    },
                },
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL,
                pendingFields: {
                    autoReporting: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    approvalMode: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    reimbursementChoice: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                areWorkflowsEnabled: shouldEnableWorkflowsByDefault,
                defaultBillable: false,
                defaultReimbursable: true,
                disabledFields: { defaultBillable: true, reimbursable: false },
                requiresCategory: true,
            },
        },
    ];
    react_native_onyx_1.default.update(optimisticData);
}
/**
 * Generates onyx data for creating a new workspace
 *
 * @param [policyOwnerEmail] the email of the account to make the owner of the policy
 * @param [makeMeAdmin] leave the calling account as an admin on the policy
 * @param [policyName] custom policy name we will use for created workspace
 * @param [policyID] custom policy id we will use for created workspace
 * @param [expenseReportId] Optional, Purpose of using application selected by user in guided setup flow
 * @param [engagementChoice] Purpose of using application selected by user in guided setup flow
 * @param [currency] Optional, selected currency for the workspace
 * @param [file] Optional, avatar file for workspace
 * @param [shouldAddOnboardingTasks] whether to add onboarding tasks to the workspace
 */
function buildPolicyData(options = {}) {
    const { policyOwnerEmail = '', makeMeAdmin = false, policyName = '', policyID = generatePolicyID(), expenseReportId, engagementChoice, currency = '', file, shouldAddOnboardingTasks = true, companySize, userReportedIntegration, featuresMap, lastUsedPaymentMethod, } = options;
    const workspaceName = policyName || generateDefaultWorkspaceName(policyOwnerEmail);
    const { customUnits, customUnitID, customUnitRateID, outputCurrency } = buildOptimisticDistanceRateCustomUnits(currency);
    const { adminsChatReportID, adminsChatData, adminsReportActionData, adminsCreatedReportActionID, expenseChatReportID, expenseChatData, expenseReportActionData, expenseCreatedReportActionID, pendingChatMembers, } = ReportUtils.buildOptimisticWorkspaceChats(policyID, workspaceName, expenseReportId);
    const optimisticCategoriesData = (0, Category_1.buildOptimisticPolicyCategories)(policyID, Object.values(CONST_1.default.POLICY.DEFAULT_CATEGORIES));
    const optimisticMccGroupData = (0, Category_1.buildOptimisticMccGroup)();
    const shouldEnableWorkflowsByDefault = !engagementChoice ||
        engagementChoice === CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM ||
        engagementChoice === CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND ||
        engagementChoice === CONST_1.default.ONBOARDING_CHOICES.PERSONAL_SPEND ||
        engagementChoice === CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE;
    const shouldSetCreatedWorkspaceAsActivePolicy = !!activePolicyID && allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`]?.type === CONST_1.default.POLICY.TYPE.PERSONAL;
    // Determine workspace type based on selected features or user reported integration
    const isCorporateFeature = featuresMap?.some((feature) => !feature.enabledByDefault && feature.enabled && feature.requiresUpdate) ?? false;
    const isCorporateIntegration = userReportedIntegration && CONST_1.default.POLICY.CONNECTIONS.CORPORATE.includes(userReportedIntegration);
    const workspaceType = isCorporateFeature || isCorporateIntegration ? CONST_1.default.POLICY.TYPE.CORPORATE : CONST_1.default.POLICY.TYPE.TEAM;
    // WARNING: The data below should be kept in sync with the API so we create the policy with the correct configuration.
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                id: policyID,
                type: workspaceType,
                name: workspaceName,
                role: CONST_1.default.POLICY.ROLE.ADMIN,
                owner: sessionEmail,
                ownerAccountID: sessionAccountID,
                isPolicyExpenseChatEnabled: true,
                outputCurrency,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                autoReporting: true,
                approver: sessionEmail,
                autoReportingFrequency: shouldEnableWorkflowsByDefault ? CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE : CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
                approvalMode: shouldEnableWorkflowsByDefault && engagementChoice !== CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE ? CONST_1.default.POLICY.APPROVAL_MODE.BASIC : CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL,
                harvesting: {
                    enabled: !shouldEnableWorkflowsByDefault,
                },
                customUnits,
                areCategoriesEnabled: true,
                areCompanyCardsEnabled: true,
                areTagsEnabled: false,
                areDistanceRatesEnabled: false,
                areWorkflowsEnabled: shouldEnableWorkflowsByDefault,
                areReportFieldsEnabled: false,
                areConnectionsEnabled: false,
                areExpensifyCardsEnabled: false,
                employeeList: {
                    [sessionEmail]: {
                        submitsTo: sessionEmail,
                        email: sessionEmail,
                        role: CONST_1.default.POLICY.ROLE.ADMIN,
                        errors: {},
                    },
                },
                chatReportIDAdmins: makeMeAdmin ? Number(adminsChatReportID) : undefined,
                pendingFields: {
                    autoReporting: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    approvalMode: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    reimbursementChoice: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    name: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    outputCurrency: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    address: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    description: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    type: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    areReportFieldsEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    customRules: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                defaultBillable: false,
                defaultReimbursable: true,
                disabledFields: { defaultBillable: true, reimbursable: false },
                avatarURL: file?.uri,
                originalFileName: file?.name,
                ...optimisticMccGroupData.optimisticData,
                requiresCategory: true,
                fieldList: {
                    [CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]: {
                        defaultValue: CONST_1.default.POLICY.DEFAULT_REPORT_NAME_PATTERN,
                        pendingFields: { defaultValue: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD, deletable: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
                        type: CONST_1.default.POLICY.DEFAULT_FIELD_LIST_TYPE,
                        target: CONST_1.default.POLICY.DEFAULT_FIELD_LIST_TARGET,
                        name: CONST_1.default.POLICY.DEFAULT_FIELD_LIST_NAME,
                        fieldID: CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE,
                        deletable: true,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${expenseChatReportID}`,
            value: {
                isOptimisticReport: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminsChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                ...adminsChatData,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${adminsChatReportID}`,
            value: {
                pendingChatMembers,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
            value: adminsReportActionData,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                ...expenseChatData,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportID}`,
            value: expenseReportActionData,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${policyID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT}${expenseChatReportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT}${adminsChatReportID}`,
            value: null,
        },
    ];
    if (shouldSetCreatedWorkspaceAsActivePolicy) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
            value: policyID,
        });
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingAction: null,
                pendingFields: {
                    autoReporting: null,
                    approvalMode: null,
                    reimbursementChoice: null,
                    name: null,
                    outputCurrency: null,
                    address: null,
                    description: null,
                    type: null,
                    areReportFieldsEnabled: null,
                },
                ...optimisticMccGroupData.successData,
                fieldList: {
                    [CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]: {
                        pendingFields: {
                            defaultValue: null,
                            deletable: null,
                        },
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminsChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${adminsChatReportID}`,
            value: {
                isOptimisticReport: false,
                pendingChatMembers: [],
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
            value: {
                [adminsCreatedReportActionID]: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${expenseChatReportID}`,
            value: {
                isOptimisticReport: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportID}`,
            value: {
                [expenseCreatedReportActionID]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: { employeeList: null, ...optimisticMccGroupData.failureData },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminsChatReportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportID}`,
            value: null,
        },
    ];
    if (shouldSetCreatedWorkspaceAsActivePolicy) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
            value: activePolicyID,
        });
    }
    if (optimisticCategoriesData.optimisticData) {
        optimisticData.push(...optimisticCategoriesData.optimisticData);
    }
    if (optimisticCategoriesData.failureData) {
        failureData.push(...optimisticCategoriesData.failureData);
    }
    if (optimisticCategoriesData.successData) {
        successData.push(...optimisticCategoriesData.successData);
    }
    if (getAdminPolicies().length === 0 && lastUsedPaymentMethod) {
        Object.values(allReports ?? {})
            .filter((iouReport) => iouReport?.type === CONST_1.default.REPORT.TYPE.IOU)
            .forEach((iouReport) => {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            if (lastUsedPaymentMethod?.iou?.name || !iouReport?.policyID) {
                return;
            }
            successData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
                value: {
                    [iouReport?.policyID]: {
                        iou: {
                            name: policyID,
                        },
                        lastUsed: {
                            name: policyID,
                        },
                    },
                },
            });
        });
    }
    // We need to clone the file to prevent non-indexable errors.
    const clonedFile = file ? (0, FileUtils_1.createFile)(file) : undefined;
    const params = {
        policyID,
        adminsChatReportID,
        expenseChatReportID,
        ownerEmail: policyOwnerEmail,
        makeMeAdmin,
        policyName: workspaceName,
        type: workspaceType,
        adminsCreatedReportActionID,
        expenseCreatedReportActionID,
        customUnitID,
        customUnitRateID,
        engagementChoice,
        currency: outputCurrency,
        file: clonedFile,
        companySize,
        userReportedIntegration: userReportedIntegration ?? undefined,
    };
    if (introSelected !== undefined &&
        (introSelected.choice === CONST_1.default.ONBOARDING_CHOICES.TEST_DRIVE_RECEIVER || !introSelected?.createWorkspace) &&
        engagementChoice &&
        shouldAddOnboardingTasks) {
        const { onboardingMessages } = (0, OnboardingFlow_1.getOnboardingMessages)(true);
        const onboardingData = ReportUtils.prepareOnboardingOnyxData(introSelected, engagementChoice, onboardingMessages[engagementChoice], adminsChatReportID, policyID);
        if (!onboardingData) {
            return { successData, optimisticData, failureData, params };
        }
        const { guidedSetupData, optimisticData: taskOptimisticData, successData: taskSuccessData, failureData: taskFailureData } = onboardingData;
        params.guidedSetupData = JSON.stringify(guidedSetupData);
        params.engagementChoice = engagementChoice;
        optimisticData.push(...taskOptimisticData);
        successData.push(...taskSuccessData);
        failureData.push(...taskFailureData);
    }
    // For test drive receivers, we want to complete the createWorkspace task in concierge, instead of #admin room
    if (introSelected?.choice === CONST_1.default.ONBOARDING_CHOICES.TEST_DRIVE_RECEIVER && introSelected.createWorkspace) {
        const createWorkspaceTaskReport = { reportID: introSelected.createWorkspace };
        const { optimisticData: optimisticCreateWorkspaceTaskData, successData: successCreateWorkspaceTaskData, failureData: failureCreateWorkspaceTaskData, } = (0, Task_1.buildTaskData)(createWorkspaceTaskReport, introSelected.createWorkspace);
        optimisticData.push(...optimisticCreateWorkspaceTaskData);
        successData.push(...successCreateWorkspaceTaskData);
        failureData.push(...failureCreateWorkspaceTaskData);
    }
    return { successData, optimisticData, failureData, params };
}
function createWorkspace(options = {}) {
    // Set default engagement choice if not provided
    const optionsWithDefaults = {
        engagementChoice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM,
        ...options,
    };
    const { optimisticData, failureData, successData, params } = buildPolicyData(optionsWithDefaults);
    API.write(types_1.WRITE_COMMANDS.CREATE_WORKSPACE, params, { optimisticData, successData, failureData });
    // Publish a workspace created event if this is their first policy
    if (getAdminPolicies().length === 0) {
        GoogleTagManager_1.default.publishEvent(CONST_1.default.ANALYTICS.EVENT.WORKSPACE_CREATED, sessionAccountID);
    }
    return params;
}
/**
 * Creates a draft workspace for various money request flows
 *
 * @param [policyOwnerEmail] the email of the account to make the owner of the policy
 * @param [makeMeAdmin] leave the calling account as an admin on the policy
 * @param [policyName] custom policy name we will use for created workspace
 * @param [policyID] custom policy id we will use for created workspace
 */
function createDraftWorkspace(policyOwnerEmail = '', makeMeAdmin = false, policyName = '', policyID = generatePolicyID(), currency = '', file) {
    const workspaceName = policyName || generateDefaultWorkspaceName(policyOwnerEmail);
    const { customUnits, customUnitID, customUnitRateID, outputCurrency } = buildOptimisticDistanceRateCustomUnits(currency);
    const { expenseChatData, adminsChatReportID, adminsCreatedReportActionID, expenseChatReportID, expenseCreatedReportActionID } = ReportUtils.buildOptimisticWorkspaceChats(policyID, workspaceName);
    const shouldEnableWorkflowsByDefault = !introSelected?.choice || introSelected.choice === CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM || introSelected.choice === CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${policyID}`,
            value: {
                id: policyID,
                type: CONST_1.default.POLICY.TYPE.TEAM,
                name: workspaceName,
                role: CONST_1.default.POLICY.ROLE.ADMIN,
                owner: sessionEmail,
                ownerAccountID: sessionAccountID,
                isPolicyExpenseChatEnabled: true,
                outputCurrency,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                autoReporting: true,
                approver: sessionEmail,
                autoReportingFrequency: shouldEnableWorkflowsByDefault ? CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE : CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
                harvesting: {
                    enabled: !shouldEnableWorkflowsByDefault,
                },
                approvalMode: shouldEnableWorkflowsByDefault ? CONST_1.default.POLICY.APPROVAL_MODE.BASIC : CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL,
                customUnits,
                areCategoriesEnabled: true,
                areWorkflowsEnabled: shouldEnableWorkflowsByDefault,
                areCompanyCardsEnabled: true,
                areTagsEnabled: false,
                areDistanceRatesEnabled: false,
                areReportFieldsEnabled: false,
                areConnectionsEnabled: false,
                areExpensifyCardsEnabled: false,
                employeeList: {
                    [sessionEmail]: {
                        submitsTo: sessionEmail,
                        email: sessionEmail,
                        role: CONST_1.default.POLICY.ROLE.ADMIN,
                        errors: {},
                    },
                },
                chatReportIDAdmins: makeMeAdmin ? Number(adminsChatReportID) : undefined,
                pendingFields: {
                    autoReporting: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    approvalMode: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    reimbursementChoice: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                defaultBillable: false,
                disabledFields: { defaultBillable: true },
                requiresCategory: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT}${expenseChatReportID}`,
            value: expenseChatData,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES_DRAFT}${policyID}`,
            value: Object.values(CONST_1.default.POLICY.DEFAULT_CATEGORIES).reduce((acc, category) => {
                acc[category] = {
                    name: category,
                    enabled: true,
                    errors: null,
                };
                return acc;
            }, {}),
        },
    ];
    // We need to clone the file to prevent non-indexable errors.
    const clonedFile = file ? (0, FileUtils_1.createFile)(file) : undefined;
    const params = {
        policyID,
        adminsChatReportID,
        expenseChatReportID,
        ownerEmail: policyOwnerEmail,
        makeMeAdmin,
        policyName: workspaceName,
        type: CONST_1.default.POLICY.TYPE.TEAM,
        adminsCreatedReportActionID,
        expenseCreatedReportActionID,
        customUnitID,
        customUnitRateID,
        currency: outputCurrency,
        file: clonedFile,
    };
    react_native_onyx_1.default.update(optimisticData);
    return params;
}
function buildDuplicatePolicyData(policy, options) {
    const { policyName = '', policyID = generatePolicyID(), file, welcomeNote, parts, targetPolicyID = generatePolicyID(), policyCategories } = options;
    const { adminsChatReportID, adminsChatData, adminsReportActionData, adminsCreatedReportActionID, expenseChatReportID, expenseChatData, expenseReportActionData, expenseCreatedReportActionID, pendingChatMembers, } = ReportUtils.buildOptimisticWorkspaceChats(targetPolicyID, policyName);
    const isMemberOptionSelected = parts?.people;
    const isReportsOptionSelected = parts?.reports;
    const isConnectionsOptionSelected = parts?.connections;
    const isCategoriesOptionSelected = parts?.categories;
    const isTaxesOptionSelected = parts?.taxes;
    const isTagsOptionSelected = parts?.tags;
    const isInvoicesOptionSelected = parts?.invoices;
    const isCustomUnitsOptionSelected = parts?.customUnits;
    const isRulesOptionSelected = parts?.expenses;
    const isWorkflowsOptionSelected = parts?.exportLayouts;
    const isPerDiemOptionSelected = parts?.perDiem;
    const policyMemberAccountIDs = isMemberOptionSelected ? Object.values((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList, false, false)) : [];
    const { customUnitID, customUnitRateID } = buildOptimisticDistanceRateCustomUnits(policy?.outputCurrency);
    const optimisticAnnounceChat = ReportUtils.buildOptimisticAnnounceChat(targetPolicyID, [...policyMemberAccountIDs]);
    const announceRoomChat = optimisticAnnounceChat.announceChatData;
    const optimisticCategoriesData = policyCategories
        ? (0, Category_1.buildOptimisticPolicyWithExistingCategories)(targetPolicyID, policyCategories)
        : (0, Category_1.buildOptimisticPolicyCategories)(targetPolicyID, Object.values(CONST_1.default.POLICY.DEFAULT_CATEGORIES));
    // WARNING: The data below should be kept in sync with the API so we create the policy with the correct configuration.
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${targetPolicyID}`,
            value: {
                ...policy,
                areCategoriesEnabled: isCategoriesOptionSelected,
                areTagsEnabled: isTagsOptionSelected,
                areDistanceRatesEnabled: isCustomUnitsOptionSelected,
                areInvoicesEnabled: isInvoicesOptionSelected,
                areRulesEnabled: isRulesOptionSelected,
                areWorkflowsEnabled: isWorkflowsOptionSelected,
                areReportFieldsEnabled: isReportsOptionSelected,
                areConnectionsEnabled: isConnectionsOptionSelected,
                arePerDiemRatesEnabled: isPerDiemOptionSelected,
                workspaceAccountID: undefined,
                tax: isTaxesOptionSelected ? policy?.tax : undefined,
                employeeList: isMemberOptionSelected ? policy.employeeList : { [policy.owner]: policy?.employeeList?.[policy.owner] },
                id: targetPolicyID,
                name: policyName,
                fieldList: isReportsOptionSelected ? policy?.fieldList : undefined,
                connections: isConnectionsOptionSelected ? policy?.connections : undefined,
                customUnits: isCustomUnitsOptionSelected ? policy?.customUnits : undefined,
                taxRates: isTaxesOptionSelected ? policy?.taxRates : undefined,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                pendingFields: {
                    autoReporting: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    approvalMode: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    reimbursementChoice: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    name: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    outputCurrency: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    address: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    description: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    type: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    areReportFieldsEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                avatarURL: file?.uri,
                originalFileName: file?.name,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${expenseChatReportID}`,
            value: {
                isOptimisticReport: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminsChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                ...adminsChatData,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${adminsChatReportID}`,
            value: {
                pendingChatMembers,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
            value: adminsReportActionData,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                ...expenseChatData,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportID}`,
            value: expenseReportActionData,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${targetPolicyID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT}${expenseChatReportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT}${adminsChatReportID}`,
            value: null,
        },
        ...announceRoomChat.onyxOptimisticData,
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${targetPolicyID}`,
            value: {
                pendingAction: null,
                pendingFields: {
                    autoReporting: null,
                    approvalMode: null,
                    reimbursementChoice: null,
                    name: null,
                    outputCurrency: null,
                    address: null,
                    description: null,
                    type: null,
                    areReportFieldsEnabled: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminsChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${adminsChatReportID}`,
            value: {
                isOptimisticReport: false,
                pendingChatMembers: [],
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
            value: {
                [adminsCreatedReportActionID]: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${expenseChatReportID}`,
            value: {
                isOptimisticReport: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportID}`,
            value: {
                [expenseCreatedReportActionID]: {
                    pendingAction: null,
                },
            },
        },
        ...announceRoomChat.onyxSuccessData,
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${targetPolicyID}`,
            value: { employeeList: null },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminsChatReportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportID}`,
            value: null,
        },
        ...announceRoomChat.onyxFailureData,
    ];
    if (optimisticCategoriesData.optimisticData) {
        optimisticData.push(...optimisticCategoriesData.optimisticData);
    }
    if (optimisticCategoriesData.failureData) {
        failureData.push(...optimisticCategoriesData.failureData);
    }
    if (optimisticCategoriesData.successData) {
        successData.push(...optimisticCategoriesData.successData);
    }
    // We need to clone the file to prevent non-indexable errors.
    const clonedFile = file ? (0, FileUtils_1.createFile)(file) : undefined;
    const params = {
        policyID,
        targetPolicyID,
        adminsChatReportID,
        expenseChatReportID,
        policyName,
        adminsCreatedReportActionID,
        expenseCreatedReportActionID,
        announceChatReportID: optimisticAnnounceChat.announceChatReportID,
        announceChatReportActionID: optimisticAnnounceChat.announceChatReportActionID,
        customUnitID,
        parts: JSON.stringify(parts),
        welcomeNote,
        customUnitRateID,
        file: clonedFile,
    };
    return { successData, optimisticData, failureData, params };
}
function duplicateWorkspace(policy, options) {
    const { optimisticData, failureData, successData, params } = buildDuplicatePolicyData(policy, options);
    API.write(types_1.WRITE_COMMANDS.DUPLICATE_POLICY, params, { optimisticData, successData, failureData });
    return params;
}
function openPolicyWorkflowsPage(policyID) {
    if (!policyID) {
        Log_1.default.warn('openPolicyWorkflowsPage invalid params', { policyID });
        return;
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    isLoading: true,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    isLoading: false,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    isLoading: false,
                },
            },
        ],
    };
    const params = { policyID };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_WORKFLOWS_PAGE, params, onyxData);
}
function openPolicyReceiptPartnersPage(policyID) {
    if (!policyID) {
        Log_1.default.warn('openPolicyReceiptPartnersPage invalid params', { policyID });
        return;
    }
    const params = { policyID };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_RECEIPT_PARTNERS_PAGE, params);
}
function removePolicyReceiptPartnersConnection(policyID, partnerName, receiptPartnerData) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                receiptPartners: {
                    [partnerName]: { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE, enabled: false },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                receiptPartners: {
                    [partnerName]: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                receiptPartners: {
                    [partnerName]: { ...receiptPartnerData, errorFields: { name: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') }, pendingAction: null },
                },
            },
        },
    ];
    const parameters = {
        policyID,
        partnerName,
    };
    API.write(types_1.WRITE_COMMANDS.DISCONNECT_WORKSPACE_RECEIPT_PARTNER, parameters, { optimisticData, failureData, successData });
}
function togglePolicyUberAutoInvite(policyID, enabled) {
    if (!policyID) {
        Log_1.default.warn('togglePolicyUberAutoInvite invalid params', { policyID });
        return;
    }
    const optimisticData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: {
                receiptPartners: { uber: { autoInvite: enabled, pendingFields: { autoInvite: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE } } },
            },
        },
    ];
    const successData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: { receiptPartners: { uber: { pendingFields: null } } },
        },
    ];
    const failureData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: { receiptPartners: { uber: { autoInvite: !enabled, pendingFields: null } } },
        },
    ];
    const params = { policyID, enabled };
    API.write(types_1.WRITE_COMMANDS.TOGGLE_WORKSPACE_UBER_AUTO_INVITE, params, { optimisticData, successData, failureData });
}
function togglePolicyUberAutoRemove(policyID, enabled) {
    if (!policyID) {
        Log_1.default.warn('togglePolicyUberAutoRemove invalid params', { policyID });
        return;
    }
    const optimisticData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: {
                receiptPartners: { uber: { autoRemove: enabled, pendingFields: { autoRemove: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE } } },
            },
        },
    ];
    const successData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: { receiptPartners: { uber: { pendingFields: null } } },
        },
    ];
    const failureData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: { receiptPartners: { uber: { autoRemove: !enabled, pendingFields: null } } },
        },
    ];
    const params = { policyID, enabled };
    API.write(types_1.WRITE_COMMANDS.TOGGLE_WORKSPACE_UBER_AUTO_REMOVE, params, { optimisticData, successData, failureData });
}
/**
 * Invites workspace employees to Uber for Business
 */
function inviteWorkspaceEmployeesToUber(policyID, emails) {
    if (!policyID || emails.length === 0) {
        Log_1.default.warn('inviteWorkspaceEmployeesToUber invalid params', { policyID, emails });
        return;
    }
    const params = {
        policyID,
        emails,
    };
    // Build optimistic employees mapping: mark invited emails as invited
    const invitedEmployees = emails.reduce((acc, email) => {
        acc[email] = { status: 'invited' };
        return acc;
    }, {});
    // Build map for resetting employees on failure
    const resetEmployeesOnFailure = emails.reduce((acc, email) => {
        acc[email] = null;
        return acc;
    }, {});
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                receiptPartners: {
                    uber: {
                        employees: invitedEmployees,
                        pendingFields: { employees: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                receiptPartners: {
                    uber: {
                        pendingFields: { employees: null },
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                receiptPartners: {
                    uber: {
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.receiptPartners.uber.invitationFailure'),
                        employees: resetEmployeesOnFailure,
                        pendingFields: { employees: null },
                    },
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.INVITE_WORKSPACE_EMPLOYEES_TO_UBER, params, { optimisticData, successData, failureData });
}
/**
 * Returns the accountIDs of the members of the policy whose data is passed in the parameters
 */
function openWorkspace(policyID, clientMemberAccountIDs) {
    if (!policyID || !clientMemberAccountIDs) {
        Log_1.default.warn('openWorkspace invalid params', { policyID, clientMemberAccountIDs });
        return;
    }
    const params = {
        policyID,
        clientMemberAccountIDs: JSON.stringify(clientMemberAccountIDs),
    };
    API.read(types_1.READ_COMMANDS.OPEN_WORKSPACE, params);
}
function openPolicyTaxesPage(policyID) {
    if (!policyID) {
        Log_1.default.warn('openPolicyTaxesPage invalid params', { policyID });
        return;
    }
    const params = {
        policyID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_TAXES_PAGE, params);
}
function openPolicyExpensifyCardsPage(policyID, workspaceAccountID) {
    const authToken = NetworkStore.getAuthToken();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                isLoading: false,
            },
        },
    ];
    const params = {
        policyID,
        authToken,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_EXPENSIFY_CARDS_PAGE, params, { optimisticData, successData, failureData });
}
function openPolicyEditCardLimitTypePage(policyID, cardID) {
    const authToken = NetworkStore.getAuthToken();
    const params = {
        policyID,
        authToken,
        cardID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_EDIT_CARD_LIMIT_TYPE_PAGE, params);
}
function openWorkspaceInvitePage(policyID, clientMemberEmails) {
    if (!policyID || !clientMemberEmails) {
        Log_1.default.warn('openWorkspaceInvitePage invalid params', { policyID, clientMemberEmails });
        return;
    }
    const params = {
        policyID,
        clientMemberEmails: JSON.stringify(clientMemberEmails),
    };
    API.read(types_1.READ_COMMANDS.OPEN_WORKSPACE_INVITE_PAGE, params);
}
function openDraftWorkspaceRequest(policyID) {
    if (policyID === '-1' || policyID === CONST_1.default.POLICY.ID_FAKE) {
        Log_1.default.warn('openDraftWorkspaceRequest invalid params', { policyID });
        return;
    }
    const params = { policyID };
    API.read(types_1.READ_COMMANDS.OPEN_DRAFT_WORKSPACE_REQUEST, params);
}
function requestExpensifyCardLimitIncrease(settlementBankAccountID) {
    if (!settlementBankAccountID) {
        return;
    }
    const authToken = NetworkStore.getAuthToken();
    const params = {
        authToken,
        settlementBankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.REQUEST_EXPENSIFY_CARD_LIMIT_INCREASE, params);
}
function updateMemberCustomField(policyID, login, customFieldType, value) {
    const customFieldKey = CONST_1.default.CUSTOM_FIELD_KEYS[customFieldType];
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const previousValue = policy?.employeeList?.[login]?.[customFieldKey];
    if (value === (previousValue ?? '')) {
        return;
    }
    const optimisticData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: {
                employeeList: { [login]: { [customFieldKey]: value, pendingFields: { [customFieldKey]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE } } },
            },
        },
    ];
    const successData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: {
                employeeList: { [login]: { pendingFields: { [customFieldKey]: null } } },
            },
        },
    ];
    const failureData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: {
                employeeList: { [login]: { [customFieldKey]: previousValue, pendingFields: { [customFieldKey]: null } } },
            },
        },
    ];
    const params = { policyID, employees: JSON.stringify([{ email: login, [customFieldType]: value }]) };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_MEMBERS_CUSTOM_FIELDS, params, { optimisticData, successData, failureData });
}
function setWorkspaceInviteMessageDraft(policyID, message) {
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_MESSAGE_DRAFT}${policyID}`, message);
}
function clearErrors(policyID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { errors: null });
    hideWorkspaceAlertMessage(policyID);
}
/**
 * Dismiss the informative messages about which policy members were added with primary logins when invited with their secondary login.
 */
function dismissAddedWithPrimaryLoginMessages(policyID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { primaryLoginsInvited: null });
}
function buildOptimisticRecentlyUsedCurrencies(currency) {
    if (!currency) {
        return [];
    }
    return (0, union_1.default)([currency], allRecentlyUsedCurrencies).slice(0, CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW);
}
/**
 * This flow is used for bottom up flow converting IOU report to an expense report. When user takes this action,
 * we create a Collect type workspace when the person taking the action becomes an owner and an admin, while we
 * add a new member to the workspace as an employee and convert the IOU report passed as a param into an expense report.
 *
 * @returns policyID of the workspace we have created
 */
// eslint-disable-next-line rulesdir/no-call-actions-from-actions
function createWorkspaceFromIOUPayment(iouReport) {
    // This flow only works for IOU reports
    if (!ReportUtils.isIOUReportUsingReport(iouReport)) {
        return;
    }
    // Generate new variables for the policy
    const policyID = generatePolicyID();
    const workspaceName = generateDefaultWorkspaceName(sessionEmail);
    const employeeAccountID = iouReport.ownerAccountID;
    const { customUnits, customUnitID, customUnitRateID } = buildOptimisticDistanceRateCustomUnits(iouReport.currency);
    const oldPersonalPolicyID = iouReport.policyID;
    const iouReportID = iouReport.reportID;
    const { adminsChatReportID, adminsChatData, adminsReportActionData, adminsCreatedReportActionID, expenseChatReportID: workspaceChatReportID, expenseChatData: workspaceChatData, expenseReportActionData: workspaceChatReportActionData, expenseCreatedReportActionID: workspaceChatCreatedReportActionID, pendingChatMembers, } = ReportUtils.buildOptimisticWorkspaceChats(policyID, workspaceName);
    if (!employeeAccountID || !oldPersonalPolicyID) {
        return;
    }
    const employeeEmail = allPersonalDetails?.[employeeAccountID]?.login ?? '';
    // Create the expense chat for the employee whose IOU is being paid
    const employeeWorkspaceChat = createPolicyExpenseChats(policyID, { [employeeEmail]: employeeAccountID }, true);
    const newWorkspace = {
        id: policyID,
        // We are creating a collect policy in this case
        type: CONST_1.default.POLICY.TYPE.TEAM,
        name: workspaceName,
        role: CONST_1.default.POLICY.ROLE.ADMIN,
        owner: sessionEmail,
        ownerAccountID: sessionAccountID,
        isPolicyExpenseChatEnabled: true,
        // Setting the currency to USD as we can only add the VBBA for this policy currency right now
        outputCurrency: CONST_1.default.CURRENCY.USD,
        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        autoReporting: true,
        autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE,
        approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
        approver: sessionEmail,
        harvesting: {
            enabled: false,
        },
        customUnits,
        areCategoriesEnabled: true,
        areCompanyCardsEnabled: true,
        areTagsEnabled: false,
        areDistanceRatesEnabled: false,
        areWorkflowsEnabled: true,
        areReportFieldsEnabled: false,
        areConnectionsEnabled: false,
        areExpensifyCardsEnabled: false,
        employeeList: {
            [sessionEmail]: {
                email: sessionEmail,
                submitsTo: sessionEmail,
                role: CONST_1.default.POLICY.ROLE.ADMIN,
                errors: {},
            },
            ...(employeeEmail
                ? {
                    [employeeEmail]: {
                        email: employeeEmail,
                        submitsTo: sessionEmail,
                        role: CONST_1.default.POLICY.ROLE.USER,
                        errors: {},
                    },
                }
                : {}),
        },
        pendingFields: {
            autoReporting: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            approvalMode: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            reimbursementChoice: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        },
        defaultBillable: false,
        disabledFields: { defaultBillable: true },
        requiresCategory: true,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: newWorkspace,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminsChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                ...adminsChatData,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${adminsChatReportID}`,
            value: {
                pendingChatMembers,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
            value: adminsReportActionData,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${workspaceChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                ...workspaceChatData,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${workspaceChatReportID}`,
            value: workspaceChatReportActionData,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${policyID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
    ];
    optimisticData.push(...employeeWorkspaceChat.onyxOptimisticData);
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingAction: null,
                pendingFields: {
                    autoReporting: null,
                    approvalMode: null,
                    reimbursementChoice: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminsChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${adminsChatReportID}`,
            value: {
                isOptimisticReport: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
            value: {
                [Object.keys(adminsChatData).at(0) ?? '']: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${workspaceChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${workspaceChatReportID}`,
            value: {
                isOptimisticReport: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${workspaceChatReportID}`,
            value: {
                [Object.keys(workspaceChatData).at(0) ?? '']: {
                    pendingAction: null,
                },
            },
        },
    ];
    successData.push(...employeeWorkspaceChat.onyxSuccessData);
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminsChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${adminsChatReportID}`,
            value: {
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${workspaceChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${workspaceChatReportID}`,
            value: {
                pendingAction: null,
            },
        },
    ];
    // Compose the memberData object which is used to add the employee to the workspace and
    // optimistically create the expense chat for them.
    const memberData = {
        accountID: Number(employeeAccountID),
        email: employeeEmail,
        workspaceChatReportID: employeeWorkspaceChat.reportCreationData[employeeEmail].reportID,
        workspaceChatCreatedReportActionID: employeeWorkspaceChat.reportCreationData[employeeEmail].reportActionID,
    };
    const oldChatReportID = iouReport.chatReportID;
    // Next we need to convert the IOU report to Expense report.
    // We need to change:
    // - report type
    // - change the sign of the report total
    // - update its policyID and policyName
    // - update the chatReportID to point to the new expense chat
    const expenseReport = {
        ...iouReport,
        chatReportID: memberData.workspaceChatReportID,
        policyID,
        policyName: workspaceName,
        type: CONST_1.default.REPORT.TYPE.EXPENSE,
        total: -(iouReport?.total ?? 0),
    };
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReportID}`,
        value: expenseReport,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReportID}`,
        value: iouReport,
    });
    // The expense report transactions need to have the amount reversed to negative values
    const reportTransactions = ReportUtils.getReportTransactions(iouReportID);
    // For performance reasons, we are going to compose a merge collection data for transactions
    const transactionsOptimisticData = {};
    const transactionFailureData = {};
    reportTransactions.forEach((transaction) => {
        transactionsOptimisticData[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`] = {
            ...transaction,
            amount: -transaction.amount,
            modifiedAmount: transaction.modifiedAmount ? -transaction.modifiedAmount : 0,
        };
        transactionFailureData[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`] = transaction;
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}`,
        value: transactionsOptimisticData,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}`,
        value: transactionFailureData,
    });
    // We need to move the report preview action from the DM to the expense chat.
    const parentReport = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.parentReportID}`];
    const parentReportActionID = iouReport.parentReportActionID;
    const reportPreview = iouReport?.parentReportID && parentReportActionID ? parentReport?.[parentReportActionID] : undefined;
    if (reportPreview?.reportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
            value: { [reportPreview.reportActionID]: null },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
            value: { [reportPreview.reportActionID]: reportPreview },
        });
    }
    // To optimistically remove the GBR from the DM we need to update the hasOutstandingChildRequest param to false
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldChatReportID}`,
        value: {
            hasOutstandingChildRequest: false,
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldChatReportID}`,
        value: {
            hasOutstandingChildRequest: true,
        },
    });
    if (reportPreview?.reportActionID) {
        // Update the created timestamp of the report preview action to be after the expense chat created timestamp.
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${memberData.workspaceChatReportID}`,
            value: {
                [reportPreview.reportActionID]: {
                    ...reportPreview,
                    message: [
                        {
                            type: CONST_1.default.REPORT.MESSAGE.TYPE.TEXT,
                            text: ReportUtils.getReportPreviewMessage(expenseReport, null, false, false, newWorkspace),
                        },
                    ],
                    created: DateUtils_1.default.getDBTime(),
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${memberData.workspaceChatReportID}`,
            value: { [reportPreview.reportActionID]: null },
        });
    }
    // Create the MOVED report action and add it to the DM chat which indicates to the user where the report has been moved
    const movedReportAction = ReportUtils.buildOptimisticMovedReportAction(oldPersonalPolicyID, policyID, memberData.workspaceChatReportID, iouReportID, workspaceName, true);
    const movedIouReportAction = ReportUtils.buildOptimisticMovedReportAction(oldPersonalPolicyID, policyID, memberData.workspaceChatReportID, iouReportID, workspaceName);
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`,
        value: { [movedIouReportAction.reportActionID]: movedIouReportAction },
    });
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`,
        value: {
            [movedIouReportAction.reportActionID]: {
                ...movedIouReportAction,
                pendingAction: null,
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`,
        value: { [movedIouReportAction.reportActionID]: null },
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
        value: { [movedReportAction.reportActionID]: movedReportAction },
    });
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
        value: {
            [movedReportAction.reportActionID]: {
                ...movedReportAction,
                pendingAction: null,
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
        value: { [movedReportAction.reportActionID]: null },
    });
    // We know that this new workspace has no BankAccount yet, so we can set
    // the reimbursement account to be immediately in the setup state for a new bank account:
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT}`,
        value: {
            isLoading: false,
            achData: {
                currentStep: CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT,
                policyID,
                subStep: '',
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT}`,
        value: CONST_1.default.REIMBURSEMENT_ACCOUNT.DEFAULT_DATA,
    });
    const params = {
        policyID,
        adminsChatReportID,
        expenseChatReportID: workspaceChatReportID,
        ownerEmail: '',
        makeMeAdmin: false,
        policyName: workspaceName,
        type: CONST_1.default.POLICY.TYPE.TEAM,
        adminsCreatedReportActionID,
        expenseCreatedReportActionID: workspaceChatCreatedReportActionID,
        customUnitID,
        customUnitRateID,
        iouReportID,
        memberData: JSON.stringify(memberData),
        reportActionID: movedReportAction.reportActionID,
        expenseMovedReportActionID: movedIouReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.CREATE_WORKSPACE_FROM_IOU_PAYMENT, params, { optimisticData, successData, failureData });
    return { policyID, workspaceChatReportID: memberData.workspaceChatReportID, reportPreviewReportActionID: reportPreview?.reportActionID, adminsChatReportID };
}
function enablePolicyConnections(policyID, enabled) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areConnectionsEnabled: enabled,
                    pendingFields: {
                        areConnectionsEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areConnectionsEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areConnectionsEnabled: !enabled,
                    pendingFields: {
                        areConnectionsEnabled: null,
                    },
                },
            },
        ],
    };
    const parameters = { policyID, enabled };
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_CONNECTIONS, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)()) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function enablePolicyReceiptPartners(policyID, enabled, shouldNavigateToReceiptPartnersPage) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areReceiptPartnersEnabled: enabled,
                    pendingFields: {
                        areReceiptPartnersEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areReceiptPartnersEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areReceiptPartnersEnabled: !enabled,
                    pendingFields: {
                        areReceiptPartnersEnabled: null,
                    },
                },
            },
        ],
    };
    const parameters = { policyID, enabled };
    API.write(types_1.WRITE_COMMANDS.TOGGLE_RECEIPT_PARTNERS, parameters, onyxData);
    if (enabled && shouldNavigateToReceiptPartnersPage) {
        (0, PolicyUtils_1.navigateToReceiptPartnersPage)(policyID);
        return;
    }
    if (enabled && (0, getIsNarrowLayout_1.default)()) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
/** Save the preferred export method for a policy */
function savePreferredExportMethod(policyID, exportMethod) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.LAST_EXPORT_METHOD}`, { [policyID]: exportMethod });
}
function enableExpensifyCard(policyID, enabled, shouldNavigateToExpensifyCardPage = false) {
    const authToken = NetworkStore.getAuthToken();
    if (!authToken) {
        return;
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areExpensifyCardsEnabled: enabled,
                    pendingFields: {
                        areExpensifyCardsEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areExpensifyCardsEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areExpensifyCardsEnabled: !enabled,
                    pendingFields: {
                        areExpensifyCardsEnabled: null,
                    },
                },
            },
        ],
    };
    const parameters = { authToken, policyID, enabled };
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_EXPENSIFY_CARDS, parameters, onyxData);
    if (enabled && shouldNavigateToExpensifyCardPage) {
        (0, PolicyUtils_1.navigateToExpensifyCardPage)(policyID);
        return;
    }
    if (enabled && (0, getIsNarrowLayout_1.default)()) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function enableCompanyCards(policyID, enabled, shouldGoBack = true) {
    const authToken = NetworkStore.getAuthToken();
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areCompanyCardsEnabled: enabled,
                    pendingFields: {
                        areCompanyCardsEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areCompanyCardsEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areCompanyCardsEnabled: !enabled,
                    pendingFields: {
                        areCompanyCardsEnabled: null,
                    },
                },
            },
        ],
    };
    const parameters = { authToken, policyID, enabled };
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_COMPANY_CARDS, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)() && shouldGoBack) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function enablePolicyReportFields(policyID, enabled) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areReportFieldsEnabled: enabled,
                    pendingFields: {
                        areReportFieldsEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areReportFieldsEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areReportFieldsEnabled: !enabled,
                    pendingFields: {
                        areReportFieldsEnabled: null,
                    },
                },
            },
        ],
    };
    const parameters = { policyID, enabled };
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_REPORT_FIELDS, parameters, onyxData);
}
function enablePolicyTaxes(policyID, enabled) {
    const defaultTaxRates = CONST_1.default.DEFAULT_TAX;
    const taxRatesData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        ...defaultTaxRates,
                        taxes: {
                            ...Object.keys(defaultTaxRates.taxes).reduce((acc, taxKey) => {
                                acc[taxKey] = {
                                    ...defaultTaxRates.taxes[taxKey],
                                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                                };
                                return acc;
                            }, {}),
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            ...Object.keys(defaultTaxRates.taxes).reduce((acc, taxKey) => {
                                acc[taxKey] = { pendingAction: null };
                                return acc;
                            }, {}),
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: undefined,
                },
            },
        ],
    };
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const shouldAddDefaultTaxRatesData = (!policy?.taxRates || (0, EmptyObject_1.isEmptyObject)(policy.taxRates)) && enabled;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                tax: {
                    trackingEnabled: enabled,
                },
                pendingFields: {
                    tax: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    optimisticData.push(...(shouldAddDefaultTaxRatesData ? (taxRatesData.optimisticData ?? []) : []));
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: {
                    tax: null,
                },
            },
        },
    ];
    successData.push(...(shouldAddDefaultTaxRatesData ? (taxRatesData.successData ?? []) : []));
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                tax: {
                    trackingEnabled: !enabled,
                },
                pendingFields: {
                    tax: null,
                },
            },
        },
    ];
    failureData.push(...(shouldAddDefaultTaxRatesData ? (taxRatesData.failureData ?? []) : []));
    const onyxData = {
        optimisticData,
        successData,
        failureData,
    };
    const parameters = { policyID, enabled };
    if (shouldAddDefaultTaxRatesData) {
        parameters.taxFields = JSON.stringify(defaultTaxRates);
    }
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_TAXES, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)()) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function enablePolicyWorkflows(policyID, enabled) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areWorkflowsEnabled: enabled,
                    ...(!enabled
                        ? {
                            approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL,
                            autoReporting: false,
                            autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
                            harvesting: {
                                enabled: false,
                            },
                            reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO,
                        }
                        : {}),
                    pendingFields: {
                        areWorkflowsEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        ...(!enabled
                            ? {
                                approvalMode: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                autoReporting: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                autoReportingFrequency: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                harvesting: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                reimbursementChoice: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            }
                            : {}),
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areWorkflowsEnabled: null,
                        ...(!enabled
                            ? {
                                approvalMode: null,
                                autoReporting: null,
                                autoReportingFrequency: null,
                                harvesting: null,
                                reimbursementChoice: null,
                            }
                            : {}),
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areWorkflowsEnabled: !enabled,
                    ...(!enabled
                        ? {
                            approvalMode: policy?.approvalMode,
                            autoReporting: policy?.autoReporting,
                            autoReportingFrequency: policy?.autoReportingFrequency,
                            harvesting: policy?.harvesting,
                            reimbursementChoice: policy?.reimbursementChoice,
                        }
                        : {}),
                    pendingFields: {
                        areWorkflowsEnabled: null,
                        ...(!enabled
                            ? {
                                approvalMode: null,
                                autoReporting: null,
                                autoReportingFrequency: null,
                                harvesting: null,
                                reimbursementChoice: null,
                            }
                            : {}),
                    },
                },
            },
        ],
    };
    const parameters = { policyID, enabled };
    // When disabling workflows, set autoreporting back to "immediately"
    if (!enabled) {
        setWorkspaceAutoReportingFrequency(policyID, CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT);
    }
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_WORKFLOWS, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)()) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
const DISABLED_MAX_EXPENSE_VALUES = {
    maxExpenseAmountNoReceipt: CONST_1.default.DISABLED_MAX_EXPENSE_VALUE,
    maxExpenseAmount: CONST_1.default.DISABLED_MAX_EXPENSE_VALUE,
    maxExpenseAge: CONST_1.default.DISABLED_MAX_EXPENSE_VALUE,
};
function enablePolicyRules(policyID, enabled, shouldGoBack = true) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areRulesEnabled: enabled,
                    preventSelfApproval: false,
                    ...(!enabled ? DISABLED_MAX_EXPENSE_VALUES : {}),
                    pendingFields: {
                        areRulesEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areRulesEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areRulesEnabled: !enabled,
                    preventSelfApproval: policy?.preventSelfApproval,
                    ...(!enabled
                        ? {
                            maxExpenseAmountNoReceipt: policy?.maxExpenseAmountNoReceipt,
                            maxExpenseAmount: policy?.maxExpenseAmount,
                            maxExpenseAge: policy?.maxExpenseAge,
                        }
                        : {}),
                    pendingFields: {
                        areRulesEnabled: null,
                    },
                },
            },
        ],
    };
    if (enabled && (0, PolicyUtils_1.isControlPolicy)(policy) && policy?.outputCurrency === CONST_1.default.CURRENCY.USD) {
        const eReceiptsOnyxData = getWorkspaceEReceiptsEnabledOnyxData(policyID, enabled);
        onyxData.optimisticData?.push(...(eReceiptsOnyxData.optimisticData ?? []));
        onyxData.successData?.push(...(eReceiptsOnyxData.successData ?? []));
        onyxData.failureData?.push(...(eReceiptsOnyxData.failureData ?? []));
    }
    const parameters = { policyID, enabled };
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.SET_POLICY_RULES_ENABLED, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)() && shouldGoBack) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function enableDistanceRequestTax(policyID, customUnitName, customUnitID, attributes) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customUnits: {
                        [customUnitID]: {
                            attributes,
                            pendingFields: {
                                taxEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customUnits: {
                        [customUnitID]: {
                            pendingFields: {
                                taxEnabled: null,
                            },
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customUnits: {
                        [customUnitID]: {
                            attributes: policy?.customUnits ? policy?.customUnits[customUnitID].attributes : null,
                            errorFields: {
                                taxEnabled: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                            },
                        },
                    },
                },
            },
        ],
    };
    const params = {
        policyID,
        customUnit: JSON.stringify({
            customUnitName,
            customUnitID,
            attributes,
        }),
    };
    API.write(types_1.WRITE_COMMANDS.ENABLE_DISTANCE_REQUEST_TAX, params, onyxData);
}
function enablePolicyInvoicing(policyID, enabled) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areInvoicesEnabled: enabled,
                    pendingFields: {
                        areInvoicesEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areInvoicesEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areInvoicesEnabled: !enabled,
                    pendingFields: {
                        areInvoicesEnabled: null,
                    },
                },
            },
        ],
    };
    const parameters = { policyID, enabled };
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_INVOICING, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)()) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function openPolicyMoreFeaturesPage(policyID) {
    const params = { policyID };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_MORE_FEATURES_PAGE, params);
}
function openPolicyProfilePage(policyID) {
    const params = { policyID };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_PROFILE_PAGE, params);
}
function openDuplicatePolicyPage(policyID) {
    const params = { policyID };
    API.read(types_1.READ_COMMANDS.OPEN_DUPLICATE_POLICY_PAGE, params);
}
function openPolicyInitialPage(policyID) {
    const params = { policyID };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_INITIAL_PAGE, params);
}
function setPolicyCustomTaxName(policyID, customTaxName) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const originalCustomTaxName = policy?.taxRates?.name;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        name: customTaxName,
                        pendingFields: { name: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                        errorFields: null,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        pendingFields: { name: null },
                        errorFields: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        name: originalCustomTaxName,
                        pendingFields: { name: null },
                        errorFields: { name: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        customTaxName,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_CUSTOM_TAX_NAME, parameters, onyxData);
}
function setWorkspaceCurrencyDefault(policyID, taxCode) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const originalDefaultExternalID = policy?.taxRates?.defaultExternalID;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        defaultExternalID: taxCode,
                        pendingFields: { defaultExternalID: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                        errorFields: null,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        pendingFields: { defaultExternalID: null },
                        errorFields: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        defaultExternalID: originalDefaultExternalID,
                        pendingFields: { defaultExternalID: null },
                        errorFields: { defaultExternalID: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        taxCode,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_TAXES_CURRENCY_DEFAULT, parameters, onyxData);
}
function setForeignCurrencyDefault(policyID, taxCode) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const originalDefaultForeignCurrencyID = policy?.taxRates?.foreignTaxDefault;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        foreignTaxDefault: taxCode,
                        pendingFields: { foreignTaxDefault: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                        errorFields: null,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        pendingFields: { foreignTaxDefault: null },
                        errorFields: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        foreignTaxDefault: originalDefaultForeignCurrencyID,
                        pendingFields: { foreignTaxDefault: null },
                        errorFields: { foreignTaxDefault: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        taxCode,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_TAXES_FOREIGN_CURRENCY_DEFAULT, parameters, onyxData);
}
function upgradeToCorporate(policyID, featureName) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `policy_${policyID}`,
            value: {
                isPendingUpgrade: true,
                type: CONST_1.default.POLICY.TYPE.CORPORATE,
                maxExpenseAge: CONST_1.default.POLICY.DEFAULT_MAX_EXPENSE_AGE,
                maxExpenseAmount: CONST_1.default.POLICY.DEFAULT_MAX_EXPENSE_AMOUNT,
                maxExpenseAmountNoReceipt: CONST_1.default.POLICY.DEFAULT_MAX_AMOUNT_NO_RECEIPT,
                glCodes: true,
                harvesting: {
                    enabled: false,
                },
                isAttendeeTrackingEnabled: false,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `policy_${policyID}`,
            value: {
                isPendingUpgrade: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `policy_${policyID}`,
            value: {
                isPendingUpgrade: false,
                type: policy?.type,
                maxExpenseAge: policy?.maxExpenseAge ?? null,
                maxExpenseAmount: policy?.maxExpenseAmount ?? null,
                maxExpenseAmountNoReceipt: policy?.maxExpenseAmountNoReceipt ?? null,
                glCodes: policy?.glCodes ?? null,
                harvesting: policy?.harvesting ?? null,
                isAttendeeTrackingEnabled: null,
            },
        },
    ];
    const parameters = { policyID, ...(featureName ? { featureName } : {}) };
    API.write(types_1.WRITE_COMMANDS.UPGRADE_TO_CORPORATE, parameters, { optimisticData, successData, failureData });
}
function downgradeToTeam(policyID) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `policy_${policyID}`,
            value: {
                isPendingDowngrade: true,
                type: CONST_1.default.POLICY.TYPE.TEAM,
                isAttendeeTrackingEnabled: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `policy_${policyID}`,
            value: {
                isPendingDowngrade: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `policy_${policyID}`,
            value: {
                isPendingDowngrade: false,
                type: policy?.type,
                isAttendeeTrackingEnabled: policy?.isAttendeeTrackingEnabled,
            },
        },
    ];
    const parameters = { policyID };
    API.write(types_1.WRITE_COMMANDS.DOWNGRADE_TO_TEAM, parameters, { optimisticData, successData, failureData });
}
function setWorkspaceDefaultSpendCategory(policyID, groupID, category) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    if (!policy) {
        return;
    }
    const { mccGroup } = policy;
    const optimisticData = mccGroup
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `policy_${policyID}`,
                value: {
                    mccGroup: {
                        ...mccGroup,
                        [groupID]: {
                            category,
                            groupID,
                            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                    },
                },
            },
        ]
        : [];
    const failureData = mccGroup
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `policy_${policyID}`,
                value: {
                    mccGroup: {
                        ...mccGroup,
                        [groupID]: {
                            ...mccGroup[groupID],
                            pendingAction: null,
                        },
                    },
                },
            },
        ]
        : [];
    const successData = mccGroup
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `policy_${policyID}`,
                value: {
                    mccGroup: {
                        [groupID]: {
                            pendingAction: null,
                        },
                    },
                },
            },
        ]
        : [];
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_DEFAULT_SPEND_CATEGORY, { policyID, groupID, category }, { optimisticData, successData, failureData });
}
/**
 * Call the API to set the receipt required amount for the given policy
 * @param policyID - id of the policy to set the receipt required amount
 * @param maxExpenseAmountNoReceipt - new value of the receipt required amount
 */
function setPolicyMaxExpenseAmountNoReceipt(policyID, maxExpenseAmountNoReceipt) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const parsedMaxExpenseAmountNoReceipt = maxExpenseAmountNoReceipt === '' ? CONST_1.default.DISABLED_MAX_EXPENSE_VALUE : CurrencyUtils.convertToBackendAmount(parseFloat(maxExpenseAmountNoReceipt));
    const originalMaxExpenseAmountNoReceipt = policy?.maxExpenseAmountNoReceipt;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    maxExpenseAmountNoReceipt: parsedMaxExpenseAmountNoReceipt,
                    pendingFields: {
                        maxExpenseAmountNoReceipt: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: { maxExpenseAmountNoReceipt: null },
                    errorFields: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    maxExpenseAmountNoReceipt: originalMaxExpenseAmountNoReceipt,
                    pendingFields: { maxExpenseAmountNoReceipt: null },
                    errorFields: { maxExpenseAmountNoReceipt: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        maxExpenseAmountNoReceipt: parsedMaxExpenseAmountNoReceipt,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_EXPENSE_MAX_AMOUNT_NO_RECEIPT, parameters, onyxData);
}
/**
 * Call the API to set the max expense amount for the given policy
 * @param policyID - id of the policy to set the max expense amount
 * @param maxExpenseAmount - new value of the max expense amount
 */
function setPolicyMaxExpenseAmount(policyID, maxExpenseAmount) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const parsedMaxExpenseAmount = maxExpenseAmount === '' ? CONST_1.default.DISABLED_MAX_EXPENSE_VALUE : CurrencyUtils.convertToBackendAmount(parseFloat(maxExpenseAmount));
    const originalMaxExpenseAmount = policy?.maxExpenseAmount;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    maxExpenseAmount: parsedMaxExpenseAmount,
                    pendingFields: {
                        maxExpenseAmount: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: { maxExpenseAmount: null },
                    errorFields: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    maxExpenseAmount: originalMaxExpenseAmount,
                    pendingFields: { maxExpenseAmount: null },
                    errorFields: { maxExpenseAmount: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        maxExpenseAmount: parsedMaxExpenseAmount,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_EXPENSE_MAX_AMOUNT, parameters, onyxData);
}
/**
 *
 * @param policyID
 * @param prohibitedExpense
 */
function setPolicyProhibitedExpense(policyID, prohibitedExpense) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const originalProhibitedExpenses = policy?.prohibitedExpenses;
    const prohibitedExpenses = {
        ...originalProhibitedExpenses,
        [prohibitedExpense]: !originalProhibitedExpenses?.[prohibitedExpense],
    };
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    prohibitedExpenses: {
                        ...prohibitedExpenses,
                        pendingFields: {
                            [prohibitedExpense]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    prohibitedExpenses: {
                        pendingFields: {
                            [prohibitedExpense]: null,
                        },
                    },
                    errorFields: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    prohibitedExpenses: originalProhibitedExpenses,
                    errorFields: { prohibitedExpenses: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                },
            },
        ],
    };
    // Remove pendingFields before sending to the API
    const { pendingFields, ...prohibitedExpensesWithoutPendingFields } = prohibitedExpenses;
    const parameters = {
        policyID,
        prohibitedExpenses: JSON.stringify(prohibitedExpensesWithoutPendingFields),
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_PROHIBITED_EXPENSES, parameters, onyxData);
}
/**
 * Call the API to set the max expense age for the given policy
 * @param policyID - id of the policy to set the max expense age
 * @param maxExpenseAge - the max expense age value given in days
 */
function setPolicyMaxExpenseAge(policyID, maxExpenseAge) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const parsedMaxExpenseAge = maxExpenseAge === '' ? CONST_1.default.DISABLED_MAX_EXPENSE_VALUE : parseInt(maxExpenseAge, 10);
    const originalMaxExpenseAge = policy?.maxExpenseAge;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    maxExpenseAge: parsedMaxExpenseAge,
                    pendingFields: {
                        maxExpenseAge: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        maxExpenseAge: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    maxExpenseAge: originalMaxExpenseAge,
                    pendingFields: { maxExpenseAge: null },
                    errorFields: { maxExpenseAge: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        maxExpenseAge: parsedMaxExpenseAge,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_EXPENSE_MAX_AGE, parameters, onyxData);
}
/**
 * Call the API to set the custom rules for the given policy
 * @param policyID - id of the policy to set the max expense age
 * @param customRules - the custom rules description in natural language
 */
function updateCustomRules(policyID, customRules) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const originalCustomRules = policy?.customRules;
    const parsedCustomRules = ReportUtils.getParsedComment(customRules);
    if (parsedCustomRules === originalCustomRules) {
        return;
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customRules: parsedCustomRules,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                    // TODO
                    // maxExpenseAge: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    customRules: originalCustomRules,
                    // TODO
                    // pendingFields: {maxExpenseAge: null},
                    // errorFields: {maxExpenseAge: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage')},
                },
            },
        ],
    };
    const parameters = {
        policyID,
        description: parsedCustomRules,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_CUSTOM_RULES, parameters, onyxData);
}
/**
 * Call the API to enable or disable the billable mode for the given policy
 * @param policyID - id of the policy to enable or disable the billable mode
 * @param defaultBillable - whether the billable mode is enabled in the given policy
 */
function setPolicyBillableMode(policyID, defaultBillable) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const originalDefaultBillable = policy?.defaultBillable;
    const originalDefaultBillableDisabled = policy?.disabledFields?.defaultBillable;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    defaultBillable,
                    disabledFields: {
                        defaultBillable: false,
                    },
                    pendingFields: {
                        defaultBillable: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        disabledFields: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        defaultBillable: null,
                        disabledFields: null,
                    },
                    errorFields: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    disabledFields: { defaultBillable: originalDefaultBillableDisabled },
                    defaultBillable: originalDefaultBillable,
                    pendingFields: { defaultBillable: null, disabledFields: null },
                    errorFields: { defaultBillable: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        defaultBillable,
        disabledFields: JSON.stringify({
            defaultBillable: false,
        }),
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_BILLABLE_MODE, parameters, onyxData);
}
function getCashExpenseReimbursableMode(policyID) {
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    if (!policy) {
        return undefined;
    }
    if (policy.defaultReimbursable && !policy.disabledFields?.reimbursable) {
        return CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES.REIMBURSABLE_DEFAULT;
    }
    if (!policy.disabledFields?.reimbursable && !policy.defaultReimbursable) {
        return CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES.NON_REIMBURSABLE_DEFAULT;
    }
    if (policy.defaultReimbursable && policy.disabledFields?.reimbursable) {
        return CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES.ALWAYS_REIMBURSABLE;
    }
    return CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES.ALWAYS_NON_REIMBURSABLE;
}
/**
 * Call the API to enable or disable the reimbursable mode for the given policy
 * @param policyID - id of the policy to enable or disable the reimbursable mode
 * @param reimbursableMode - reimbursable mode to set for the given policy
 */
function setPolicyReimbursableMode(policyID, reimbursableMode) {
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    const originalDefaultReimbursable = policy?.defaultReimbursable;
    const originalDefaultReimbursableDisabled = policy?.disabledFields?.reimbursable;
    const defaultReimbursable = reimbursableMode === CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES.REIMBURSABLE_DEFAULT || reimbursableMode === CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES.ALWAYS_REIMBURSABLE;
    const reimbursableDisabled = reimbursableMode === CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES.ALWAYS_REIMBURSABLE ||
        reimbursableMode === CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES.ALWAYS_NON_REIMBURSABLE;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    defaultReimbursable,
                    disabledFields: {
                        reimbursable: reimbursableDisabled,
                    },
                    pendingFields: {
                        defaultReimbursable: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        disabledFields: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        defaultReimbursable: null,
                        disabledFields: null,
                    },
                    errorFields: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    disabledFields: { reimbursable: originalDefaultReimbursableDisabled },
                    defaultReimbursable: originalDefaultReimbursable,
                    pendingFields: { defaultReimbursable: null, disabledFields: null },
                    errorFields: { defaultReimbursable: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        defaultReimbursable,
        disabledFields: JSON.stringify({
            reimbursable: reimbursableDisabled,
        }),
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_REIMBURSABLE_MODE, parameters, onyxData);
}
/**
 * Call the API to disable the billable mode for the given policy
 * @param policyID - id of the policy to enable or disable the billable mode
 */
function disableWorkspaceBillableExpenses(policyID) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const originalDefaultBillableDisabled = policy?.disabledFields?.defaultBillable;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    disabledFields: {
                        defaultBillable: true,
                    },
                    pendingFields: {
                        disabledFields: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        disabledFields: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: { disabledFields: null },
                    disabledFields: { defaultBillable: originalDefaultBillableDisabled },
                },
            },
        ],
    };
    const parameters = {
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.DISABLE_POLICY_BILLABLE_MODE, parameters, onyxData);
}
function getWorkspaceEReceiptsEnabledOnyxData(policyID, enabled) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const originalEReceipts = policy?.eReceipts;
    return {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    eReceipts: enabled,
                    pendingFields: {
                        eReceipts: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        eReceipts: null,
                    },
                    errorFields: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    eReceipts: originalEReceipts,
                    pendingFields: { defaultBillable: null },
                    errorFields: { defaultBillable: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                },
            },
        ],
    };
}
function setWorkspaceEReceiptsEnabled(policyID, enabled) {
    const onyxData = getWorkspaceEReceiptsEnabledOnyxData(policyID, enabled);
    const parameters = {
        policyID,
        enabled,
    };
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_ERECEIPTS_ENABLED, parameters, onyxData);
}
function setPolicyAttendeeTrackingEnabled(policyID, isAttendeeTrackingEnabled) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const originalIsAttendeeTrackingEnabled = !!policy?.isAttendeeTrackingEnabled;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    isAttendeeTrackingEnabled,
                    pendingFields: {
                        isAttendeeTrackingEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        isAttendeeTrackingEnabled: null,
                    },
                    errorFields: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    isAttendeeTrackingEnabled: originalIsAttendeeTrackingEnabled,
                    pendingFields: { isAttendeeTrackingEnabled: null },
                    errorFields: { isAttendeeTrackingEnabled: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        enabled: isAttendeeTrackingEnabled,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_ATTENDEE_TRACKING_ENABLED, parameters, onyxData);
}
function getAdminPolicies() {
    return Object.values(allPolicies ?? {}).filter((policy) => !!policy && policy.role === CONST_1.default.POLICY.ROLE.ADMIN && policy.type !== CONST_1.default.POLICY.TYPE.PERSONAL);
}
function getAdminPoliciesConnectedToSageIntacct() {
    return Object.values(allPolicies ?? {}).filter((policy) => !!policy && policy.role === CONST_1.default.POLICY.ROLE.ADMIN && !!policy?.connections?.intacct);
}
function getAdminPoliciesConnectedToNetSuite() {
    return Object.values(allPolicies ?? {}).filter((policy) => !!policy && policy.role === CONST_1.default.POLICY.ROLE.ADMIN && !!policy?.connections?.netsuite);
}
/**
 * Call the API to set default report title pattern for the given policy
 * @param policyID - id of the policy to apply the naming pattern to
 * @param customName - name pattern to be used for the reports
 */
function setPolicyDefaultReportTitle(policyID, customName) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    if (customName === policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]?.defaultValue) {
        return;
    }
    const previousReportTitleField = policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE] ?? {};
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                fieldList: {
                    [CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]: {
                        defaultValue: customName,
                        pendingFields: { defaultValue: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                fieldList: {
                    [CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]: { pendingFields: { defaultValue: null } },
                },
                errorFields: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                fieldList: {
                    [CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]: { ...previousReportTitleField, pendingFields: { defaultValue: null } },
                },
                errorFields: {
                    fieldList: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    const parameters = {
        value: customName,
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_DEFAULT_REPORT_TITLE, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Call the API to enable or disable enforcing the naming pattern for member created reports on a policy
 * @param policyID - id of the policy to apply the naming pattern to
 * @param enforced - flag whether to enforce policy name
 */
function setPolicyPreventMemberCreatedTitle(policyID, enforced) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    if (!enforced === policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE].deletable) {
        return;
    }
    const previousReportTitleField = policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE] ?? {};
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                fieldList: {
                    [CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]: { ...previousReportTitleField, deletable: !enforced, pendingFields: { deletable: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE } },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                fieldList: {
                    [CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]: { pendingFields: { deletable: null } },
                },
                errorFields: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                fieldList: {
                    [CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]: { ...previousReportTitleField, pendingFields: { deletable: null } },
                },
                errorFields: {
                    fieldList: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    const parameters = {
        enforced,
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_PREVENT_MEMBER_CREATED_TITLE, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Call the API to enable or disable self approvals for the reports
 * @param policyID - id of the policy to apply the naming pattern to
 * @param preventSelfApproval - flag whether to prevent workspace members from approving their own expense reports
 */
function setPolicyPreventSelfApproval(policyID, preventSelfApproval) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    if (preventSelfApproval === policy?.preventSelfApproval) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                preventSelfApproval,
                pendingFields: {
                    preventSelfApproval: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: {
                    preventSelfApproval: null,
                },
                errorFields: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                preventSelfApproval: policy?.preventSelfApproval ?? false,
                pendingFields: {
                    preventSelfApproval: null,
                },
                errorFields: {
                    preventSelfApproval: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    const parameters = {
        preventSelfApproval,
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_PREVENT_SELF_APPROVAL, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Call the API to apply automatic approval limit for the given policy
 * @param policyID - id of the policy to apply the limit to
 * @param limit - max amount for auto-approval of the reports in the given policy
 */
function setPolicyAutomaticApprovalLimit(policyID, limit) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const fallbackLimit = limit === '' ? '0' : limit;
    const parsedLimit = CurrencyUtils.convertToBackendAmount(parseFloat(fallbackLimit));
    if (parsedLimit === (policy?.autoApproval?.limit ?? CONST_1.default.POLICY.AUTO_APPROVE_REPORTS_UNDER_DEFAULT_CENTS)) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoApproval: {
                    limit: parsedLimit,
                    pendingFields: { limit: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoApproval: {
                    pendingFields: {
                        limit: null,
                    },
                },
                errorFields: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoApproval: {
                    limit: policy?.autoApproval?.limit ?? CONST_1.default.POLICY.AUTO_APPROVE_REPORTS_UNDER_DEFAULT_CENTS,
                    pendingFields: {
                        limit: null,
                    },
                },
                errorFields: {
                    autoApproval: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    const parameters = {
        limit: parsedLimit,
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_AUTOMATIC_APPROVAL_LIMIT, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Call the API to set the audit rate for the given policy
 * @param policyID - id of the policy to apply the limit to
 * @param auditRate - percentage of the reports to be qualified for a random audit
 */
function setPolicyAutomaticApprovalRate(policyID, auditRate) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const fallbackAuditRate = auditRate === '' ? '0' : auditRate;
    const parsedAuditRate = parseInt(fallbackAuditRate, 10) / 100;
    // The auditRate arrives as an int to this method so we will convert it to a float before sending it to the API.
    if (parsedAuditRate === (policy?.autoApproval?.auditRate ?? CONST_1.default.POLICY.RANDOM_AUDIT_DEFAULT_PERCENTAGE)) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoApproval: {
                    auditRate: parsedAuditRate,
                    pendingFields: {
                        auditRate: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoApproval: {
                    pendingFields: {
                        auditRate: null,
                    },
                },
                errorFields: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoApproval: {
                    auditRate: policy?.autoApproval?.auditRate ?? CONST_1.default.POLICY.RANDOM_AUDIT_DEFAULT_PERCENTAGE,
                    pendingFields: {
                        auditRate: null,
                    },
                },
                errorFields: {
                    autoApproval: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    const parameters = {
        auditRate: parsedAuditRate,
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_AUTOMATIC_APPROVAL_RATE, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Call the API to enable auto-approval for the reports in the given policy
 * @param policyID - id of the policy to apply the limit to
 * @param enabled - whether auto-approve for the reports is enabled in the given policy
 */
function enableAutoApprovalOptions(policyID, enabled) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    if (enabled === policy?.shouldShowAutoApprovalOptions) {
        return;
    }
    const autoApprovalValues = {
        auditRate: enabled ? CONST_1.default.POLICY.RANDOM_AUDIT_SUGGESTED_PERCENTAGE : 0,
        limit: enabled ? CONST_1.default.POLICY.AUTO_APPROVE_REPORTS_UNDER_SUGGESTED_CENTS : 0,
    };
    const autoApprovalFailureValues = { autoApproval: { limit: policy?.autoApproval?.limit, auditRate: policy?.autoApproval?.auditRate, pendingFields: null } };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoApproval: {
                    ...autoApprovalValues,
                    pendingFields: {
                        limit: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        auditRate: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
                shouldShowAutoApprovalOptions: enabled,
                pendingFields: {
                    shouldShowAutoApprovalOptions: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoApproval: { pendingFields: null },
                pendingFields: {
                    shouldShowAutoApprovalOptions: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                ...autoApprovalFailureValues,
                shouldShowAutoApprovalOptions: policy?.shouldShowAutoApprovalOptions,
                pendingFields: {
                    shouldShowAutoApprovalOptions: null,
                },
            },
        },
    ];
    const parameters = {
        enabled,
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.ENABLE_POLICY_AUTO_APPROVAL_OPTIONS, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Call the API to set the limit for auto-payments in the given policy
 * @param policyID - id of the policy to apply the limit to
 * @param limit - max amount for auto-payment for the reports in the given policy
 */
function setPolicyAutoReimbursementLimit(policyID, limit) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const fallbackLimit = limit === '' ? '0' : limit;
    const parsedLimit = CurrencyUtils.convertToBackendAmount(parseFloat(fallbackLimit));
    if (parsedLimit === (policy?.autoReimbursement?.limit ?? CONST_1.default.POLICY.AUTO_REIMBURSEMENT_LIMIT_DEFAULT_CENTS)) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoReimbursement: {
                    limit: parsedLimit,
                    pendingFields: {
                        limit: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoReimbursement: {
                    limit: parsedLimit,
                    pendingFields: {
                        limit: null,
                    },
                },
                errorFields: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoReimbursement: { limit: policy?.autoReimbursement?.limit ?? policy?.autoReimbursementLimit, pendingFields: { limit: null } },
                errorFields: {
                    autoReimbursement: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    const parameters = {
        limit: parsedLimit,
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_AUTO_REIMBURSEMENT_LIMIT, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Call the API to enable auto-payment for the reports in the given policy
 *
 * @param policyID - id of the policy to apply the limit to
 * @param enabled - whether auto-payment for the reports is enabled in the given policy
 */
function enablePolicyAutoReimbursementLimit(policyID, enabled) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    if (enabled === policy?.shouldShowAutoReimbursementLimitOption) {
        return;
    }
    const autoReimbursementFailureValues = { autoReimbursement: { limit: policy?.autoReimbursement?.limit, pendingFields: null } };
    const autoReimbursementValues = { limit: enabled ? CONST_1.default.POLICY.AUTO_REIMBURSEMENT_LIMIT_SUGGESTED_CENTS : CONST_1.default.POLICY.AUTO_REIMBURSEMENT_LIMIT_DEFAULT_CENTS };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoReimbursement: {
                    ...autoReimbursementValues,
                    pendingFields: {
                        limit: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
                shouldShowAutoReimbursementLimitOption: enabled,
                pendingFields: {
                    shouldShowAutoReimbursementLimitOption: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                autoReimbursement: { pendingFields: null },
                pendingFields: {
                    shouldShowAutoReimbursementLimitOption: null,
                },
                errorFields: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                ...autoReimbursementFailureValues,
                shouldShowAutoReimbursementLimitOption: policy?.shouldShowAutoReimbursementLimitOption,
                pendingFields: {
                    shouldShowAutoReimbursementLimitOption: null,
                },
            },
        },
    ];
    const parameters = {
        enabled,
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.ENABLE_POLICY_AUTO_REIMBURSEMENT_LIMIT, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
function clearAllPolicies() {
    if (!allPolicies) {
        return;
    }
    Object.keys(allPolicies).forEach((key) => delete allPolicies[key]);
}
function updateInvoiceCompanyName(policyID, companyName) {
    const authToken = NetworkStore.getAuthToken();
    if (!authToken) {
        return;
    }
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                invoice: {
                    companyName,
                    pendingFields: {
                        companyName: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                invoice: {
                    pendingFields: {
                        companyName: null,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                invoice: {
                    companyName: policy?.invoice?.companyName,
                    pendingFields: {
                        companyName: null,
                    },
                },
            },
        },
    ];
    const parameters = {
        authToken,
        policyID,
        companyName,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_INVOICE_COMPANY_NAME, parameters, { optimisticData, successData, failureData });
}
function updateInvoiceCompanyWebsite(policyID, companyWebsite) {
    const authToken = NetworkStore.getAuthToken();
    if (!authToken) {
        return;
    }
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                invoice: {
                    companyWebsite,
                    pendingFields: {
                        companyWebsite: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                invoice: {
                    pendingFields: {
                        companyWebsite: null,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                invoice: {
                    companyWebsite: policy?.invoice?.companyWebsite,
                    pendingFields: {
                        companyWebsite: null,
                    },
                },
            },
        },
    ];
    const parameters = {
        authToken,
        policyID,
        companyWebsite,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_INVOICE_COMPANY_WEBSITE, parameters, { optimisticData, successData, failureData });
}
/**
 * Validates user account and returns a list of accessible policies.
 */
function getAccessiblePolicies(validateCode) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.VALIDATE_USER_AND_GET_ACCESSIBLE_POLICIES,
            value: {
                loading: true,
                errors: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.VALIDATE_USER_AND_GET_ACCESSIBLE_POLICIES,
            value: {
                loading: false,
                errors: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.VALIDATE_USER_AND_GET_ACCESSIBLE_POLICIES,
            value: {
                loading: false,
            },
        },
    ];
    const command = validateCode ? types_1.WRITE_COMMANDS.VALIDATE_USER_AND_GET_ACCESSIBLE_POLICIES : types_1.WRITE_COMMANDS.GET_ACCESSIBLE_POLICIES;
    API.write(command, validateCode ? { validateCode } : null, { optimisticData, successData, failureData });
}
/**
 * Clear the errors from the get accessible policies request
 */
function clearGetAccessiblePoliciesErrors() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.VALIDATE_USER_AND_GET_ACCESSIBLE_POLICIES, { errors: null });
}
/**
 * Call the API to calculate the bill for the new dot
 */
function calculateBillNewDot() {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_BILL_WHEN_DOWNGRADE,
            value: true,
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_BILL_WHEN_DOWNGRADE,
            value: false,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_BILL_WHEN_DOWNGRADE,
            value: false,
        },
    ];
    API.read(types_1.READ_COMMANDS.CALCULATE_BILL_NEW_DOT, null, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Call the API to pay and downgrade
 */
function payAndDowngrade() {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.BILLING_RECEIPT_DETAILS,
            value: {
                errors: null,
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.BILLING_RECEIPT_DETAILS,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.BILLING_RECEIPT_DETAILS,
            value: {
                isLoading: false,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.PAY_AND_DOWNGRADE, null, { optimisticData, successData, failureData });
}
function clearBillingReceiptDetailsErrors() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.BILLING_RECEIPT_DETAILS, { errors: null });
}
function setIsForcedToChangeCurrency(value) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_FORCED_TO_CHANGE_CURRENCY, value);
}
function setIsComingFromGlobalReimbursementsFlow(value) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_COMING_FROM_GLOBAL_REIMBURSEMENTS_FLOW, value);
}
function updateFeature(request, policyID) {
    if (request.endpoint === types_1.WRITE_COMMANDS.TOGGLE_POLICY_PER_DIEM) {
        API.write(types_1.WRITE_COMMANDS.TOGGLE_POLICY_PER_DIEM, {
            policyID,
            enabled: request.parameters.enabled,
            customUnitID: generateCustomUnitID(),
        });
        return;
    }
    // eslint-disable-next-line rulesdir/no-multiple-api-calls
    API.writeWithNoDuplicatesEnableFeatureConflicts(request.endpoint, request.parameters);
}
function updateInterestedFeatures(features, policyID, type) {
    let shouldUpgradeToCorporate = false;
    const requests = [];
    features.forEach((feature) => {
        // If the feature is not enabled by default but it's enabled now, we need to enable it
        if (!feature.enabledByDefault && feature.enabled) {
            if (feature.requiresUpdate && !shouldUpgradeToCorporate) {
                shouldUpgradeToCorporate = true;
            }
            requests.push({
                endpoint: feature.apiEndpoint,
                parameters: {
                    policyID,
                    enabled: true,
                },
            });
        }
        // If the feature is enabled by default but it's not enabled now, we need to disable it
        if (feature.enabledByDefault && !feature.enabled) {
            requests.push({
                endpoint: feature.apiEndpoint,
                parameters: {
                    policyID,
                    enabled: false,
                },
            });
        }
    });
    const isCorporate = type === CONST_1.default.POLICY.TYPE.CORPORATE;
    if (shouldUpgradeToCorporate && !isCorporate) {
        API.write(types_1.WRITE_COMMANDS.UPGRADE_TO_CORPORATE, { policyID });
    }
    requests.forEach((request) => {
        updateFeature(request, policyID);
    });
}
function clearPolicyTitleFieldError(policyID) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        errorFields: {
            fieldList: {
                [CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]: null,
            },
        },
    });
}
