"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOutstandingChildRequest = void 0;
exports.adjustRemainingSplitShares = adjustRemainingSplitShares;
exports.approveMoneyRequest = approveMoneyRequest;
exports.canApproveIOU = canApproveIOU;
exports.canUnapproveIOU = canUnapproveIOU;
exports.cancelPayment = cancelPayment;
exports.canIOUBePaid = canIOUBePaid;
exports.canCancelPayment = canCancelPayment;
exports.cleanUpMoneyRequest = cleanUpMoneyRequest;
exports.clearMoneyRequest = clearMoneyRequest;
exports.completeSplitBill = completeSplitBill;
exports.createDistanceRequest = createDistanceRequest;
exports.createDraftTransaction = createDraftTransaction;
exports.deleteMoneyRequest = deleteMoneyRequest;
exports.deleteTrackExpense = deleteTrackExpense;
exports.detachReceipt = detachReceipt;
exports.getIOURequestPolicyID = getIOURequestPolicyID;
exports.getReceiverType = getReceiverType;
exports.initMoneyRequest = initMoneyRequest;
exports.checkIfScanFileCanBeRead = checkIfScanFileCanBeRead;
exports.dismissModalAndOpenReportInInboxTab = dismissModalAndOpenReportInInboxTab;
exports.navigateToStartStepIfScanFileCannotBeRead = navigateToStartStepIfScanFileCannotBeRead;
exports.completePaymentOnboarding = completePaymentOnboarding;
exports.convertBulkTrackedExpensesToIOU = convertBulkTrackedExpensesToIOU;
exports.payInvoice = payInvoice;
exports.payMoneyRequest = payMoneyRequest;
exports.putOnHold = putOnHold;
exports.bulkHold = bulkHold;
exports.replaceReceipt = replaceReceipt;
exports.requestMoney = requestMoney;
exports.resetSplitShares = resetSplitShares;
exports.resetDraftTransactionsCustomUnit = resetDraftTransactionsCustomUnit;
exports.savePreferredPaymentMethod = savePreferredPaymentMethod;
exports.sendInvoice = sendInvoice;
exports.sendMoneyElsewhere = sendMoneyElsewhere;
exports.sendMoneyWithWallet = sendMoneyWithWallet;
exports.setCustomUnitRateID = setCustomUnitRateID;
exports.setCustomUnitID = setCustomUnitID;
exports.removeSubrate = removeSubrate;
exports.addSubrate = addSubrate;
exports.updateSubrate = updateSubrate;
exports.clearSubrates = clearSubrates;
exports.setDraftSplitTransaction = setDraftSplitTransaction;
exports.setIndividualShare = setIndividualShare;
exports.setMoneyRequestAmount = setMoneyRequestAmount;
exports.setMoneyRequestAttendees = setMoneyRequestAttendees;
exports.setMoneyRequestAccountant = setMoneyRequestAccountant;
exports.setMoneyRequestBillable = setMoneyRequestBillable;
exports.setMoneyRequestCategory = setMoneyRequestCategory;
exports.setMoneyRequestCreated = setMoneyRequestCreated;
exports.setMoneyRequestDateAttribute = setMoneyRequestDateAttribute;
exports.setMoneyRequestCurrency = setMoneyRequestCurrency;
exports.setMoneyRequestDescription = setMoneyRequestDescription;
exports.setMoneyRequestDistance = setMoneyRequestDistance;
exports.setMoneyRequestDistanceRate = setMoneyRequestDistanceRate;
exports.setMoneyRequestMerchant = setMoneyRequestMerchant;
exports.setMoneyRequestParticipants = setMoneyRequestParticipants;
exports.setMoneyRequestParticipantsFromReport = setMoneyRequestParticipantsFromReport;
exports.getMoneyRequestParticipantsFromReport = getMoneyRequestParticipantsFromReport;
exports.setMoneyRequestPendingFields = setMoneyRequestPendingFields;
exports.setMultipleMoneyRequestParticipantsFromReport = setMultipleMoneyRequestParticipantsFromReport;
exports.setMoneyRequestReceipt = setMoneyRequestReceipt;
exports.setMoneyRequestTag = setMoneyRequestTag;
exports.setMoneyRequestTaxAmount = setMoneyRequestTaxAmount;
exports.setMoneyRequestTaxRate = setMoneyRequestTaxRate;
exports.setSplitPayer = setSplitPayer;
exports.setSplitShares = setSplitShares;
exports.splitBill = splitBill;
exports.splitBillAndOpenReport = splitBillAndOpenReport;
exports.startMoneyRequest = startMoneyRequest;
exports.startSplitBill = startSplitBill;
exports.submitReport = submitReport;
exports.trackExpense = trackExpense;
exports.unapproveExpenseReport = unapproveExpenseReport;
exports.unholdRequest = unholdRequest;
exports.updateMoneyRequestAttendees = updateMoneyRequestAttendees;
exports.updateMoneyRequestAmountAndCurrency = updateMoneyRequestAmountAndCurrency;
exports.updateMoneyRequestReimbursable = updateMoneyRequestReimbursable;
exports.updateMoneyRequestBillable = updateMoneyRequestBillable;
exports.updateMoneyRequestCategory = updateMoneyRequestCategory;
exports.updateMoneyRequestDate = updateMoneyRequestDate;
exports.updateMoneyRequestDescription = updateMoneyRequestDescription;
exports.updateMoneyRequestDistance = updateMoneyRequestDistance;
exports.updateMoneyRequestDistanceRate = updateMoneyRequestDistanceRate;
exports.updateMoneyRequestMerchant = updateMoneyRequestMerchant;
exports.updateMoneyRequestTag = updateMoneyRequestTag;
exports.updateMoneyRequestTaxAmount = updateMoneyRequestTaxAmount;
exports.updateMoneyRequestTaxRate = updateMoneyRequestTaxRate;
exports.mergeDuplicates = mergeDuplicates;
exports.updateLastLocationPermissionPrompt = updateLastLocationPermissionPrompt;
exports.resolveDuplicates = resolveDuplicates;
exports.getIOUReportActionToApproveOrPay = getIOUReportActionToApproveOrPay;
exports.getNavigationUrlOnMoneyRequestDelete = getNavigationUrlOnMoneyRequestDelete;
exports.getNavigationUrlAfterTrackExpenseDelete = getNavigationUrlAfterTrackExpenseDelete;
exports.canSubmitReport = canSubmitReport;
exports.submitPerDiemExpense = submitPerDiemExpense;
exports.calculateDiffAmount = calculateDiffAmount;
exports.dismissRejectUseExplanation = dismissRejectUseExplanation;
exports.rejectMoneyRequest = rejectMoneyRequest;
exports.markRejectViolationAsResolved = markRejectViolationAsResolved;
exports.setMoneyRequestReimbursable = setMoneyRequestReimbursable;
exports.computePerDiemExpenseAmount = computePerDiemExpenseAmount;
exports.initSplitExpense = initSplitExpense;
exports.addSplitExpenseField = addSplitExpenseField;
exports.updateSplitExpenseAmountField = updateSplitExpenseAmountField;
exports.saveSplitTransactions = saveSplitTransactions;
exports.initDraftSplitExpenseDataForEdit = initDraftSplitExpenseDataForEdit;
exports.removeSplitExpenseField = removeSplitExpenseField;
exports.updateSplitExpenseField = updateSplitExpenseField;
exports.reopenReport = reopenReport;
exports.retractReport = retractReport;
exports.startDistanceRequest = startDistanceRequest;
exports.clearSplitTransactionDraftErrors = clearSplitTransactionDraftErrors;
exports.assignReportToMe = assignReportToMe;
exports.getPerDiemExpenseInformation = getPerDiemExpenseInformation;
exports.getSendInvoiceInformation = getSendInvoiceInformation;
exports.addReportApprover = addReportApprover;
const date_fns_1 = require("date-fns");
const expensify_common_1 = require("expensify-common");
const cloneDeep_1 = require("lodash/cloneDeep");
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const receipt_generic_png_1 = require("@assets/images/receipt-generic.png");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DateUtils_1 = require("@libs/DateUtils");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const GoogleTagManager_1 = require("@libs/GoogleTagManager");
const IOUUtils_1 = require("@libs/IOUUtils");
const isFileUploadable_1 = require("@libs/isFileUploadable");
const LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
const Localize = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const isReportOpenInRHP_1 = require("@libs/Navigation/helpers/isReportOpenInRHP");
const isSearchTopmostFullScreenRoute_1 = require("@libs/Navigation/helpers/isSearchTopmostFullScreenRoute");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NextStepUtils_1 = require("@libs/NextStepUtils");
const NumberUtils = require("@libs/NumberUtils");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Parser_1 = require("@libs/Parser");
const PerDiemRequestUtils_1 = require("@libs/PerDiemRequestUtils");
const Performance_1 = require("@libs/Performance");
const Permissions_1 = require("@libs/Permissions");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
Object.defineProperty(exports, "hasOutstandingChildRequest", { enumerable: true, get: function () { return ReportUtils_1.hasOutstandingChildRequest; } });
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const SessionUtils_1 = require("@libs/SessionUtils");
const Sound_1 = require("@libs/Sound");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const CachedPDFPaths_1 = require("./CachedPDFPaths");
const Category_1 = require("./Policy/Category");
const Member_1 = require("./Policy/Member");
const Policy_1 = require("./Policy/Policy");
const Tag_1 = require("./Policy/Tag");
const Report_1 = require("./Report");
const ReportActions_1 = require("./ReportActions");
const Transaction_1 = require("./Transaction");
const TransactionEdit_1 = require("./TransactionEdit");
const OnboardingFlow_1 = require("./Welcome/OnboardingFlow");
let allPersonalDetails = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (value) => {
        allPersonalDetails = value ?? {};
    },
});
let allBetas;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.BETAS,
    callback: (value) => (allBetas = value),
});
let allTransactions = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
    waitForCollectionCallback: true,
    callback: (value) => {
        if (!value) {
            allTransactions = {};
            return;
        }
        allTransactions = value;
    },
});
let allTransactionDrafts = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allTransactionDrafts = value ?? {};
    },
});
let allTransactionViolations = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
    waitForCollectionCallback: true,
    callback: (value) => {
        if (!value) {
            allTransactionViolations = {};
            return;
        }
        allTransactionViolations = value;
    },
});
let allDraftSplitTransactions = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allDraftSplitTransactions = value ?? {};
    },
});
let allNextSteps = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.NEXT_STEP,
    waitForCollectionCallback: true,
    callback: (value) => {
        allNextSteps = value ?? {};
    },
});
let allPolicyCategories = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES,
    waitForCollectionCallback: true,
    callback: (val) => (allPolicyCategories = val),
});
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
            const policyReports = (0, ReportUtils_1.getAllPolicyReports)(policyID);
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
let allReportNameValuePairs;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReportNameValuePairs = value;
    },
});
let userAccountID = -1;
let currentUserEmail = '';
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        currentUserEmail = value?.email ?? '';
        userAccountID = value?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    },
});
let currentUserPersonalDetails;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (value) => {
        currentUserPersonalDetails = value?.[userAccountID] ?? undefined;
    },
});
let quickAction = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
    callback: (value) => {
        quickAction = value;
    },
});
let allReportActions;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: (actions) => {
        if (!actions) {
            return;
        }
        allReportActions = actions;
    },
});
let activePolicyID;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
    callback: (value) => (activePolicyID = value),
});
let introSelected;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_INTRO_SELECTED,
    callback: (value) => (introSelected = value),
});
let personalDetailsList;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (value) => (personalDetailsList = value),
});
/**
 * @private
 * After finishing the action in RHP from the Inbox tab, besides dismissing the modal, we should open the report.
 * If the action is done from the report RHP, then we just want to dismiss the money request flow screens.
 * It is a helper function used only in this file.
 */
function dismissModalAndOpenReportInInboxTab(reportID) {
    const rootState = Navigation_1.navigationRef.getRootState();
    if ((0, isReportOpenInRHP_1.default)(rootState)) {
        const rhpKey = rootState.routes.at(-1)?.state?.key;
        if (rhpKey) {
            Navigation_1.default.pop(rhpKey);
            return;
        }
    }
    if ((0, isSearchTopmostFullScreenRoute_1.default)() || !reportID) {
        Navigation_1.default.dismissModal();
        return;
    }
    Navigation_1.default.dismissModalWithReport({ reportID });
}
/**
 * Find the report preview action from given chat report and iou report
 */
function getReportPreviewAction(chatReportID, iouReportID) {
    const reportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReportID}`] ?? {};
    // Find the report preview action from the chat report
    return (Object.values(reportActions).find((reportAction) => reportAction && (0, ReportActionsUtils_1.isReportPreviewAction)(reportAction) && (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.linkedReportID === iouReportID) ?? null);
}
/**
 * Initialize expense info
 * @param reportID to attach the transaction to
 * @param policy
 * @param isFromGlobalCreate
 * @param iouRequestType one of manual/scan/distance
 * @param report the report to attach the transaction to
 * @param parentReport the parent report to attach the transaction to
 */
function initMoneyRequest({ reportID, policy, isFromGlobalCreate, currentIouRequestType, newIouRequestType, report, parentReport, currentDate = '', lastSelectedDistanceRates, }) {
    // Generate a brand new transactionID
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const personalPolicy = (0, PolicyUtils_1.getPolicy)((0, PolicyUtils_1.getPersonalPolicy)()?.id);
    const newTransactionID = CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID;
    const currency = policy?.outputCurrency ?? personalPolicy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    // Disabling this line since currentDate can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const created = currentDate || (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
    // We remove draft transactions created during multi scanning if there are some
    (0, TransactionEdit_1.removeDraftTransactions)(true);
    // in case we have to re-init money request, but the IOU request type is the same with the old draft transaction,
    // we should keep most of the existing data by using the ONYX MERGE operation
    if (currentIouRequestType === newIouRequestType) {
        // so, we just need to update the reportID, isFromGlobalCreate, created, currency
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${newTransactionID}`, {
            reportID,
            isFromGlobalCreate,
            created,
            currency,
            transactionID: newTransactionID,
        });
        return;
    }
    const comment = {
        attendees: (0, IOUUtils_1.formatCurrentUserToAttendee)(currentUserPersonalDetails, reportID),
    };
    let requestCategory = null;
    // Set up initial distance expense state
    if (newIouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE || newIouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP || newIouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL) {
        if (!isFromGlobalCreate) {
            const isPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(report) || (0, ReportUtils_1.isPolicyExpenseChat)(parentReport);
            const customUnitRateID = DistanceRequestUtils_1.default.getCustomUnitRateID({ reportID, isPolicyExpenseChat, policy, lastSelectedDistanceRates });
            comment.customUnit = { customUnitRateID };
        }
        if (comment.customUnit) {
            comment.customUnit.quantity = null;
        }
        if (newIouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL) {
            comment.waypoints = undefined;
        }
        else {
            comment.waypoints = {
                waypoint0: { keyForList: 'start_waypoint' },
                waypoint1: { keyForList: 'stop_waypoint' },
            };
        }
    }
    if (newIouRequestType === CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM) {
        comment.customUnit = {
            attributes: {
                dates: {
                    start: DateUtils_1.default.getStartOfToday(),
                    end: DateUtils_1.default.getStartOfToday(),
                },
            },
        };
        if (!isFromGlobalCreate) {
            const { customUnitID, category } = (0, PerDiemRequestUtils_1.getCustomUnitID)(report, parentReport);
            comment.customUnit = { ...comment.customUnit, customUnitID };
            requestCategory = category ?? null;
        }
    }
    const newTransaction = {
        amount: 0,
        comment,
        created,
        currency,
        category: requestCategory,
        iouRequestType: newIouRequestType,
        reportID,
        transactionID: newTransactionID,
        isFromGlobalCreate,
        merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
        splitPayerAccountIDs: currentUserPersonalDetails ? [currentUserPersonalDetails.accountID] : undefined,
    };
    // Store the transaction in Onyx and mark it as not saved so it can be cleaned up later
    // Use set() here so that there is no way that data will be leaked between objects when it gets reset
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${newTransactionID}`, newTransaction);
    return newTransaction;
}
function createDraftTransaction(transaction) {
    if (!transaction) {
        return;
    }
    const newTransaction = {
        ...transaction,
    };
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction.transactionID}`, newTransaction);
}
function clearMoneyRequest(transactionID, skipConfirmation = false, draftTransactions) {
    (0, TransactionEdit_1.removeDraftTransactions)(undefined, draftTransactions);
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.SKIP_CONFIRMATION}${transactionID}`, skipConfirmation);
}
function startMoneyRequest(iouType, reportID, requestType, skipConfirmation = false, backToReport, draftTransactions) {
    Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE);
    clearMoneyRequest(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, skipConfirmation, draftTransactions);
    switch (requestType) {
        case CONST_1.default.IOU.REQUEST_TYPE.MANUAL:
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_MANUAL.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, backToReport));
            return;
        case CONST_1.default.IOU.REQUEST_TYPE.SCAN:
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_SCAN.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, backToReport));
            return;
        case CONST_1.default.IOU.REQUEST_TYPE.DISTANCE:
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_DISTANCE.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, backToReport));
            return;
        default:
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_CREATE.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, backToReport));
    }
}
function startDistanceRequest(iouType, reportID, requestType, skipConfirmation = false, backToReport) {
    clearMoneyRequest(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, skipConfirmation);
    switch (requestType) {
        case CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP:
            Navigation_1.default.navigate(ROUTES_1.default.DISTANCE_REQUEST_CREATE_TAB_MAP.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, backToReport));
            return;
        case CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL:
            Navigation_1.default.navigate(ROUTES_1.default.DISTANCE_REQUEST_CREATE_TAB_MANUAL.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, backToReport));
            return;
        default:
            Navigation_1.default.navigate(ROUTES_1.default.DISTANCE_REQUEST_CREATE.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, backToReport));
    }
}
function setMoneyRequestAmount(transactionID, amount, currency, shouldShowOriginalAmount = false) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { amount, currency, shouldShowOriginalAmount });
}
function setMoneyRequestCreated(transactionID, created, isDraft) {
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { created });
}
function setMoneyRequestDateAttribute(transactionID, start, end) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { comment: { customUnit: { attributes: { dates: { start, end } } } } });
}
function setMoneyRequestCurrency(transactionID, currency, isEditing = false) {
    const fieldToUpdate = isEditing ? 'modifiedCurrency' : 'currency';
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { [fieldToUpdate]: currency });
}
function setMoneyRequestDescription(transactionID, comment, isDraft) {
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { comment: { comment: comment.trim() } });
}
function setMoneyRequestMerchant(transactionID, merchant, isDraft) {
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { merchant });
}
function setMoneyRequestAttendees(transactionID, attendees, isDraft) {
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { comment: { attendees } });
}
function setMoneyRequestAccountant(transactionID, accountant, isDraft) {
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { accountant });
}
function setMoneyRequestPendingFields(transactionID, pendingFields) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { pendingFields });
}
function setMoneyRequestCategory(transactionID, category, policyID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { category });
    if (!policyID) {
        setMoneyRequestTaxRate(transactionID, '');
        setMoneyRequestTaxAmount(transactionID, null);
        return;
    }
    const transaction = allTransactionDrafts[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`];
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const { categoryTaxCode, categoryTaxAmount } = (0, TransactionUtils_1.getCategoryTaxCodeAndAmount)(category, transaction, (0, PolicyUtils_1.getPolicy)(policyID));
    if (categoryTaxCode && categoryTaxAmount !== undefined) {
        setMoneyRequestTaxRate(transactionID, categoryTaxCode);
        setMoneyRequestTaxAmount(transactionID, categoryTaxAmount);
    }
}
function setMoneyRequestTag(transactionID, tag) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { tag });
}
function setMoneyRequestBillable(transactionID, billable) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { billable });
}
function setMoneyRequestReimbursable(transactionID, reimbursable) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { reimbursable });
}
function setMoneyRequestParticipants(transactionID, participants = [], isTestTransaction = false) {
    // We should change the reportID and isFromGlobalCreate of the test transaction since this flow can start inside an existing report
    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, {
        participants,
        isFromGlobalCreate: isTestTransaction ? true : undefined,
        reportID: isTestTransaction ? participants?.at(0)?.reportID : undefined,
    });
}
function setSplitPayer(transactionID, payerAccountID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { splitPayerAccountIDs: [payerAccountID] });
}
function setMoneyRequestReceipt(transactionID, source, filename, isDraft, type, isTestReceipt = false, isTestDriveReceipt = false) {
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, {
        // isTestReceipt = false and isTestDriveReceipt = false are being converted to null because we don't really need to store it in Onyx in those cases
        receipt: { source, type: type ?? '', isTestReceipt: isTestReceipt ? true : null, isTestDriveReceipt: isTestDriveReceipt ? true : null },
        filename,
    });
}
/**
 * Set custom unit rateID for the transaction draft
 */
function setCustomUnitRateID(transactionID, customUnitRateID) {
    const isFakeP2PRate = customUnitRateID === CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID;
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, {
        comment: {
            customUnit: {
                customUnitRateID,
                ...(!isFakeP2PRate && { defaultP2PRate: null }),
            },
        },
    });
}
/**
 * Revert custom unit of the draft transaction to the original transaction's value
 */
function resetDraftTransactionsCustomUnit(transactionID) {
    if (!transactionID) {
        return;
    }
    const originalTransaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    if (!originalTransaction) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, {
        comment: {
            customUnit: originalTransaction.comment?.customUnit ?? {},
        },
    });
}
/**
 * Set custom unit ID for the transaction draft
 */
function setCustomUnitID(transactionID, customUnitID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { comment: { customUnit: { customUnitID } } });
}
function removeSubrate(transaction, currentIndex) {
    // Index comes from the route params and is a string
    const index = Number(currentIndex);
    if (index === -1) {
        return;
    }
    const existingSubrates = transaction?.comment?.customUnit?.subRates ?? [];
    const newSubrates = [...existingSubrates];
    newSubrates.splice(index, 1);
    // Onyx.merge won't remove the null nested object values, this is a workaround
    // to remove nested keys while also preserving other object keys
    // Doing a deep clone of the transaction to avoid mutating the original object and running into a cache issue when using Onyx.set
    const newTransaction = {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        ...transaction,
        comment: {
            ...transaction?.comment,
            customUnit: {
                ...transaction?.comment?.customUnit,
                subRates: newSubrates,
                quantity: null,
            },
        },
    };
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction?.transactionID}`, newTransaction);
}
function updateSubrate(transaction, currentIndex, quantity, id, name, rate) {
    // Index comes from the route params and is a string
    const index = Number(currentIndex);
    if (index === -1) {
        return;
    }
    const existingSubrates = transaction?.comment?.customUnit?.subRates ?? [];
    if (index >= existingSubrates.length) {
        return;
    }
    const newSubrates = [...existingSubrates];
    newSubrates.splice(index, 1, { quantity, id, name, rate });
    // Onyx.merge won't remove the null nested object values, this is a workaround
    // to remove nested keys while also preserving other object keys
    // Doing a deep clone of the transaction to avoid mutating the original object and running into a cache issue when using Onyx.set
    const newTransaction = {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        ...transaction,
        comment: {
            ...transaction?.comment,
            customUnit: {
                ...transaction?.comment?.customUnit,
                subRates: newSubrates,
                quantity: null,
            },
        },
    };
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction?.transactionID}`, newTransaction);
}
function clearSubrates(transactionID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { comment: { customUnit: { subRates: [] } } });
}
function addSubrate(transaction, currentIndex, quantity, id, name, rate) {
    // Index comes from the route params and is a string
    const index = Number(currentIndex);
    if (index === -1) {
        return;
    }
    const existingSubrates = transaction?.comment?.customUnit?.subRates ?? [];
    if (index !== existingSubrates.length) {
        return;
    }
    const newSubrates = [...existingSubrates];
    newSubrates.push({ quantity, id, name, rate });
    // Onyx.merge won't remove the null nested object values, this is a workaround
    // to remove nested keys while also preserving other object keys
    // Doing a deep clone of the transaction to avoid mutating the original object and running into a cache issue when using Onyx.set
    const newTransaction = {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        ...transaction,
        comment: {
            ...transaction?.comment,
            customUnit: {
                ...transaction?.comment?.customUnit,
                subRates: newSubrates,
                quantity: null,
            },
        },
    };
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction?.transactionID}`, newTransaction);
}
function setMoneyRequestDistance(transactionID, distanceAsFloat, isDraft) {
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { comment: { customUnit: { quantity: distanceAsFloat } } });
}
/**
 * Set the distance rate of a transaction.
 * Used when creating a new transaction or moving an existing one from Self DM
 */
function setMoneyRequestDistanceRate(transactionID, customUnitRateID, policy, isDraft) {
    if (policy) {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_LAST_SELECTED_DISTANCE_RATES, { [policy.id]: customUnitRateID });
    }
    const distanceRate = DistanceRequestUtils_1.default.getRateByCustomUnitRateID({ policy, customUnitRateID });
    const transaction = isDraft ? allTransactionDrafts[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`] : allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    let newDistance;
    if (distanceRate?.unit && distanceRate?.unit !== transaction?.comment?.customUnit?.distanceUnit) {
        newDistance = DistanceRequestUtils_1.default.convertDistanceUnit((0, TransactionUtils_1.getDistanceInMeters)(transaction, transaction?.comment?.customUnit?.distanceUnit), distanceRate.unit);
    }
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, {
        comment: {
            customUnit: {
                customUnitRateID,
                ...(!!policy && { defaultP2PRate: null }),
                ...(distanceRate && { distanceUnit: distanceRate.unit }),
                ...(newDistance && { quantity: newDistance }),
            },
        },
    });
}
/** Helper function to get the receipt error for expenses, or the generic error if there's no receipt */
function getReceiptError(receipt, filename, isScanRequest = true, errorKey, action, retryParams) {
    const formattedRetryParams = typeof retryParams === 'string' ? retryParams : JSON.stringify(retryParams);
    return (0, EmptyObject_1.isEmptyObject)(receipt) || !isScanRequest
        ? (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage', errorKey)
        : (0, ErrorUtils_1.getMicroSecondOnyxErrorObject)({
            error: CONST_1.default.IOU.RECEIPT_ERROR,
            source: receipt.source?.toString() ?? '',
            filename: filename ?? '',
            action: action ?? '',
            retryParams: formattedRetryParams,
        }, errorKey);
}
/** Helper function to get optimistic fields violations onyx data */
function getFieldViolationsOnyxData(iouReport) {
    const missingFields = {};
    const excludedFields = Object.values(CONST_1.default.REPORT_VIOLATIONS_EXCLUDED_FIELDS);
    Object.values(iouReport.fieldList ?? {}).forEach((field) => {
        if (excludedFields.includes(field.fieldID) || !!field.value || !!field.defaultValue) {
            return;
        }
        // in case of missing field violation the empty object is indicator.
        missingFields[field.fieldID] = {};
    });
    return {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_VIOLATIONS}${iouReport.reportID}`,
                value: {
                    fieldRequired: missingFields,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_VIOLATIONS}${iouReport.reportID}`,
                value: null,
            },
        ],
    };
}
function buildOnyxDataForTestDriveIOU(testDriveIOUParams) {
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    const optimisticIOUReportAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
        amount: testDriveIOUParams.transaction.amount,
        currency: testDriveIOUParams.transaction.currency,
        comment: testDriveIOUParams.transaction.comment?.comment ?? '',
        participants: testDriveIOUParams.transaction.participants ?? [],
        paymentType: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
        iouReportID: testDriveIOUParams.iouOptimisticParams.report.reportID,
        transactionID: testDriveIOUParams.transaction.transactionID,
        reportActionID: testDriveIOUParams.iouOptimisticParams.action.reportActionID,
    });
    const text = Localize.translateLocal('testDrive.employeeInviteMessage', { name: personalDetailsList?.[userAccountID]?.firstName ?? '' });
    const textComment = (0, ReportUtils_1.buildOptimisticAddCommentReportAction)(text, undefined, userAccountID, undefined, undefined, undefined, testDriveIOUParams.testDriveCommentReportActionID);
    textComment.reportAction.created = DateUtils_1.default.subtractMillisecondsFromDateTime(testDriveIOUParams.iouOptimisticParams.createdAction.created, 1);
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${testDriveIOUParams.chatOptimisticParams.report?.reportID}`,
        value: {
            [textComment.reportAction.reportActionID]: textComment.reportAction,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${testDriveIOUParams.iouOptimisticParams.report.reportID}`,
        value: {
            ...{ lastActionType: CONST_1.default.REPORT.ACTIONS.TYPE.MARKED_REIMBURSED, statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED },
            hasOutstandingChildRequest: false,
            lastActorAccountID: currentUserPersonalDetails?.accountID,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${testDriveIOUParams.iouOptimisticParams.report.reportID}`,
        value: {
            [testDriveIOUParams.iouOptimisticParams.action.reportActionID]: optimisticIOUReportAction,
        },
    });
    return {
        optimisticData,
        successData,
        failureData,
    };
}
/** Builds the Onyx data for an expense */
function buildOnyxDataForMoneyRequest(moneyRequestParams) {
    const { isNewChatReport, shouldCreateNewMoneyRequestReport, isOneOnOneSplit = false, existingTransactionThreadReportID, policyParams = {}, optimisticParams, retryParams, participant, shouldGenerateTransactionThreadReport = true, } = moneyRequestParams;
    const { policy, policyCategories, policyTagList } = policyParams;
    const { chat, iou, transactionParams: { transaction, transactionThreadReport, transactionThreadCreatedReportAction }, policyRecentlyUsed, personalDetailListAction, nextStep, testDriveCommentReportActionID, } = optimisticParams;
    const isScanRequest = (0, TransactionUtils_1.isScanRequest)(transaction);
    const isPerDiemRequest = (0, TransactionUtils_1.isPerDiemRequest)(transaction);
    const isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    const outstandingChildRequest = (0, ReportUtils_1.getOutstandingChildRequest)(iou.report);
    const clearedPendingFields = Object.fromEntries(Object.keys(transaction.pendingFields ?? {}).map((key) => [key, null]));
    const isMoneyRequestToManagerMcTest = (0, ReportUtils_1.isTestTransactionReport)(iou.report);
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    let newQuickAction;
    if (isScanRequest) {
        newQuickAction = CONST_1.default.QUICK_ACTIONS.REQUEST_SCAN;
    }
    else if (isPerDiemRequest) {
        newQuickAction = CONST_1.default.QUICK_ACTIONS.PER_DIEM;
    }
    else {
        newQuickAction = CONST_1.default.QUICK_ACTIONS.REQUEST_MANUAL;
    }
    if ((0, TransactionUtils_1.isDistanceRequest)(transaction)) {
        newQuickAction = CONST_1.default.QUICK_ACTIONS.REQUEST_DISTANCE;
    }
    const existingTransactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${existingTransactionThreadReportID}`] ?? null;
    if (chat.report) {
        optimisticData.push({
            // Use SET for new reports because it doesn't exist yet, is faster and we need the data to be available when we navigate to the chat page
            onyxMethod: isNewChatReport ? react_native_onyx_1.default.METHOD.SET : react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chat.report.reportID}`,
            value: {
                ...chat.report,
                lastReadTime: DateUtils_1.default.getDBTime(),
                ...(shouldCreateNewMoneyRequestReport ? { lastVisibleActionCreated: chat.reportPreviewAction.created } : {}),
                // do not update iouReportID if auto submit beta is enabled and it is a scan request
                ...(isASAPSubmitBetaEnabled && isScanRequest ? {} : { iouReportID: iou.report.reportID }),
                ...outstandingChildRequest,
                ...(isNewChatReport ? { pendingFields: { createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD } } : {}),
            },
        });
    }
    optimisticData.push({
        onyxMethod: shouldCreateNewMoneyRequestReport ? react_native_onyx_1.default.METHOD.SET : react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iou.report.reportID}`,
        value: {
            ...iou.report,
            lastVisibleActionCreated: iou.action.created,
            pendingFields: {
                ...(shouldCreateNewMoneyRequestReport ? { createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD } : { preview: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
            },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
        value: transaction,
    }, isNewChatReport
        ? {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chat.report?.reportID}`,
            value: {
                [chat.createdAction.reportActionID]: chat.createdAction,
                [chat.reportPreviewAction.reportActionID]: chat.reportPreviewAction,
            },
        }
        : {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chat.report?.reportID}`,
            value: {
                [chat.reportPreviewAction.reportActionID]: chat.reportPreviewAction,
            },
        }, shouldCreateNewMoneyRequestReport
        ? {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iou.report.reportID}`,
            value: {
                [iou.createdAction.reportActionID]: iou.createdAction,
                [iou.action.reportActionID]: iou.action,
            },
        }
        : {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iou.report.reportID}`,
            value: {
                [iou.action.reportActionID]: iou.action,
            },
        });
    if (shouldGenerateTransactionThreadReport) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.reportID}`,
            value: {
                ...transactionThreadReport,
                pendingFields: { createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${transactionThreadReport?.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        });
    }
    if (isNewChatReport) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${chat.report?.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        });
    }
    if (shouldCreateNewMoneyRequestReport) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${iou.report?.reportID}`,
            value: {
                isOptimisticReport: true,
                hasOnceLoadedReportActions: true,
            },
        });
    }
    if (shouldGenerateTransactionThreadReport && !(0, EmptyObject_1.isEmptyObject)(transactionThreadCreatedReportAction)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport?.reportID}`,
            value: {
                [transactionThreadCreatedReportAction.reportActionID]: transactionThreadCreatedReportAction,
            },
        });
    }
    if (policyRecentlyUsed.categories?.length) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES}${iou.report.policyID}`,
            value: policyRecentlyUsed.categories,
        });
    }
    if (policyRecentlyUsed.currencies?.length) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.RECENTLY_USED_CURRENCIES,
            value: policyRecentlyUsed.currencies,
        });
    }
    if (!(0, EmptyObject_1.isEmptyObject)(policyRecentlyUsed.tags)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_TAGS}${iou.report.policyID}`,
            value: policyRecentlyUsed.tags,
        });
    }
    if (policyRecentlyUsed.destinations?.length) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_DESTINATIONS}${iou.report.policyID}`,
            value: policyRecentlyUsed.destinations,
        });
    }
    if (transaction.receipt?.isTestDriveReceipt) {
        const { optimisticData: testDriveOptimisticData = [], successData: testDriveSuccessData = [], failureData: testDriveFailureData = [], } = buildOnyxDataForTestDriveIOU({
            transaction,
            iouOptimisticParams: iou,
            chatOptimisticParams: chat,
            testDriveCommentReportActionID,
        });
        optimisticData.push(...testDriveOptimisticData);
        successData.push(...testDriveSuccessData);
        failureData.push(...testDriveFailureData);
    }
    if (isMoneyRequestToManagerMcTest) {
        const date = new Date();
        const isTestReceipt = transaction.receipt?.isTestReceipt ?? false;
        const managerMcTestParticipant = (0, OptionsListUtils_1.getManagerMcTestParticipant)() ?? {};
        const optimisticIOUReportAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
            type: isScanRequest && !isTestReceipt ? CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE : CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
            amount: iou.report?.total ?? 0,
            currency: iou.report?.currency ?? '',
            comment: '',
            participants: [managerMcTestParticipant],
            paymentType: isScanRequest && !isTestReceipt ? undefined : CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
            iouReportID: iou.report.reportID,
            transactionID: transaction.transactionID,
            reportActionID: iou.action.reportActionID,
        });
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING}`,
            value: { [CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP]: DateUtils_1.default.getDBTime(date.valueOf()) },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iou.report.reportID}`,
            value: {
                ...iou.report,
                ...(!isScanRequest || isTestReceipt ? { lastActionType: CONST_1.default.REPORT.ACTIONS.TYPE.MARKED_REIMBURSED, statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED } : undefined),
                hasOutstandingChildRequest: false,
                lastActorAccountID: currentUserPersonalDetails?.accountID,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iou.report.reportID}`,
            value: {
                [iou.action.reportActionID]: {
                    ...optimisticIOUReportAction,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
            value: {
                ...transaction,
            },
        });
    }
    const redundantParticipants = {};
    if (!(0, EmptyObject_1.isEmptyObject)(personalDetailListAction)) {
        const successPersonalDetailListAction = {};
        // BE will send different participants. We clear the optimistic ones to avoid duplicated entries
        Object.keys(personalDetailListAction).forEach((accountIDKey) => {
            const accountID = Number(accountIDKey);
            successPersonalDetailListAction[accountID] = null;
            redundantParticipants[accountID] = null;
        });
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: personalDetailListAction,
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: successPersonalDetailListAction,
        });
    }
    if (!(0, EmptyObject_1.isEmptyObject)(nextStep)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${iou.report.reportID}`,
            value: nextStep,
        });
    }
    if (isNewChatReport) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chat.report?.reportID}`,
            value: {
                participants: redundantParticipants,
                pendingFields: null,
                errorFields: null,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${chat.report?.reportID}`,
            value: {
                isOptimisticReport: false,
            },
        });
    }
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iou.report.reportID}`,
        value: {
            participants: redundantParticipants,
            pendingFields: null,
            errorFields: null,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${iou.report.reportID}`,
        value: {
            isOptimisticReport: false,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
        value: {
            pendingAction: null,
            pendingFields: clearedPendingFields,
            // The routes contains the distance in meters. Clearing the routes ensures we use the distance
            // in the correct unit stored under the transaction customUnit once the request is created.
            // The route is also not saved in the backend, so we can't rely on it.
            routes: null,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chat.report?.reportID}`,
        value: {
            ...(isNewChatReport
                ? {
                    [chat.createdAction.reportActionID]: {
                        pendingAction: null,
                        errors: null,
                        isOptimisticAction: null,
                    },
                }
                : {}),
            [chat.reportPreviewAction.reportActionID]: {
                pendingAction: null,
                isOptimisticAction: null,
            },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iou.report.reportID}`,
        value: {
            ...(shouldCreateNewMoneyRequestReport
                ? {
                    [iou.createdAction.reportActionID]: {
                        pendingAction: null,
                        errors: null,
                        isOptimisticAction: null,
                    },
                }
                : {}),
            [iou.action.reportActionID]: {
                pendingAction: null,
                errors: null,
                isOptimisticAction: null,
            },
        },
    });
    if (shouldGenerateTransactionThreadReport) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.reportID}`,
            value: {
                participants: redundantParticipants,
                pendingFields: null,
                errorFields: null,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${transactionThreadReport?.reportID}`,
            value: {
                isOptimisticReport: false,
            },
        });
    }
    if (shouldGenerateTransactionThreadReport && !(0, EmptyObject_1.isEmptyObject)(transactionThreadCreatedReportAction)) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport?.reportID}`,
            value: {
                [transactionThreadCreatedReportAction.reportActionID]: {
                    pendingAction: null,
                    errors: null,
                    isOptimisticAction: null,
                },
            },
        });
    }
    const errorKey = DateUtils_1.default.getMicroseconds();
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chat.report?.reportID}`,
        value: {
            iouReportID: chat.report?.iouReportID,
            lastReadTime: chat.report?.lastReadTime,
            lastVisibleActionCreated: chat.report?.lastVisibleActionCreated,
            pendingFields: null,
            hasOutstandingChildRequest: chat.report?.hasOutstandingChildRequest,
            ...(isNewChatReport
                ? {
                    errorFields: {
                        createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                    },
                }
                : {}),
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iou.report.reportID}`,
        value: {
            pendingFields: null,
            errorFields: {
                ...(shouldCreateNewMoneyRequestReport ? { createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage') } : {}),
            },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
        value: {
            errors: getReceiptError(transaction.receipt, 
            // Disabling this line since transaction.filename can be an empty string
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            transaction.filename || transaction.receipt?.filename, isScanRequest, errorKey, CONST_1.default.IOU.ACTION_PARAMS.MONEY_REQUEST, retryParams),
            pendingFields: clearedPendingFields,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iou.report.reportID}`,
        value: {
            ...(shouldCreateNewMoneyRequestReport
                ? {
                    [iou.createdAction.reportActionID]: {
                        errors: getReceiptError(transaction.receipt, 
                        // Disabling this line since transaction.filename can be an empty string
                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                        transaction.filename || transaction.receipt?.filename, isScanRequest, errorKey, CONST_1.default.IOU.ACTION_PARAMS.MONEY_REQUEST, retryParams),
                    },
                    [iou.action.reportActionID]: {
                        errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
                    },
                }
                : {
                    [iou.action.reportActionID]: {
                        errors: getReceiptError(transaction.receipt, 
                        // Disabling this line since transaction.filename can be an empty string
                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                        transaction.filename || transaction.receipt?.filename, isScanRequest, errorKey, CONST_1.default.IOU.ACTION_PARAMS.MONEY_REQUEST, retryParams),
                    },
                }),
        },
    });
    if (shouldGenerateTransactionThreadReport) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.reportID}`,
            value: {
                pendingFields: null,
                errorFields: existingTransactionThreadReport
                    ? null
                    : {
                        createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                    },
            },
        });
    }
    if (!isOneOnOneSplit) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
            value: {
                action: newQuickAction,
                chatReportID: chat.report?.reportID,
                isFirstQuickAction: (0, EmptyObject_1.isEmptyObject)(quickAction),
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
            value: quickAction ?? null,
        });
    }
    if (shouldGenerateTransactionThreadReport && !(0, EmptyObject_1.isEmptyObject)(transactionThreadCreatedReportAction)) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport?.reportID}`,
            value: {
                [transactionThreadCreatedReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
                },
            },
        });
    }
    const reportActions = (0, expensify_common_1.fastMerge)(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iou.report.reportID}`] ?? {}, { [iou.action.reportActionID]: iou.action }, true);
    const isFromOneTransactionReport = !!(0, ReportActionsUtils_1.getOneTransactionThreadReportID)(iou.report, chat.report ?? undefined, reportActions, undefined, undefined);
    const searchUpdate = getSearchOnyxUpdate({
        transaction,
        participant,
        iouReport: iou.report,
        policy,
        transactionThreadReportID: transactionThreadReport?.reportID,
        isFromOneTransactionReport,
    });
    if (searchUpdate) {
        if (searchUpdate.optimisticData) {
            optimisticData.push(...searchUpdate.optimisticData);
        }
        if (searchUpdate.successData) {
            successData.push(...searchUpdate.successData);
        }
    }
    // We don't need to compute violations unless we're on a paid policy
    if (!policy || !(0, PolicyUtils_1.isPaidGroupPolicy)(policy)) {
        return [optimisticData, successData, failureData];
    }
    const violationsOnyxData = ViolationsUtils_1.default.getViolationsOnyxData(transaction, [], policy, policyTagList ?? {}, policyCategories ?? {}, (0, PolicyUtils_1.hasDependentTags)(policy, policyTagList ?? {}), false);
    if (violationsOnyxData) {
        const shouldFixViolations = Array.isArray(violationsOnyxData.value) && violationsOnyxData.value.length > 0;
        optimisticData.push(violationsOnyxData, {
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${iou.report.reportID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            value: (0, NextStepUtils_1.buildNextStep)(iou.report, iou.report.statusNum ?? CONST_1.default.REPORT.STATE_NUM.OPEN, shouldFixViolations),
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
            value: [],
        });
    }
    return [optimisticData, successData, failureData];
}
/** Builds the Onyx data for an invoice */
function buildOnyxDataForInvoice(invoiceParams) {
    const { chat, iou, transactionParams, policyParams, optimisticData: optimisticDataParams, companyName, companyWebsite, participant } = invoiceParams;
    const transaction = transactionParams.transaction;
    const clearedPendingFields = Object.fromEntries(Object.keys(transactionParams.transaction.pendingFields ?? {}).map((key) => [key, null]));
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iou.report?.reportID}`,
            value: {
                ...iou.report,
                lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(iou.action),
                lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(iou.action),
                pendingFields: {
                    createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${iou.report?.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionParams.transaction.transactionID}`,
            value: transactionParams.transaction,
        },
        chat.isNewReport
            ? {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chat.report?.reportID}`,
                value: {
                    [chat.createdAction.reportActionID]: chat.createdAction,
                    [chat.reportPreviewAction.reportActionID]: chat.reportPreviewAction,
                },
            }
            : {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chat.report?.reportID}`,
                value: {
                    [chat.reportPreviewAction.reportActionID]: chat.reportPreviewAction,
                },
            },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iou.report?.reportID}`,
            value: {
                [iou.createdAction.reportActionID]: iou.createdAction,
                [iou.action.reportActionID]: iou.action,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionParams.threadReport.reportID}`,
            value: transactionParams.threadReport,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${transactionParams.threadReport?.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        },
    ];
    if (transactionParams.threadCreatedReportAction?.reportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionParams.threadReport.reportID}`,
            value: {
                [transactionParams.threadCreatedReportAction.reportActionID]: transactionParams.threadCreatedReportAction,
            },
        });
    }
    const successData = [];
    if (chat.report) {
        optimisticData.push({
            // Use SET for new reports because it doesn't exist yet, is faster and we need the data to be available when we navigate to the chat page
            onyxMethod: chat.isNewReport ? react_native_onyx_1.default.METHOD.SET : react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chat.report.reportID}`,
            value: {
                ...chat.report,
                lastReadTime: DateUtils_1.default.getDBTime(),
                iouReportID: iou.report?.reportID,
                ...(chat.isNewReport ? { pendingFields: { createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD } } : {}),
            },
        });
        if (chat.isNewReport) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${chat.report?.reportID}`,
                value: {
                    isOptimisticReport: true,
                },
            });
        }
    }
    if (optimisticDataParams.policyRecentlyUsedCategories.length) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES}${iou.report?.policyID}`,
            value: optimisticDataParams.policyRecentlyUsedCategories,
        });
    }
    if (optimisticDataParams.recentlyUsedCurrencies?.length) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.RECENTLY_USED_CURRENCIES,
            value: optimisticDataParams.recentlyUsedCurrencies,
        });
    }
    if (!(0, EmptyObject_1.isEmptyObject)(optimisticDataParams.policyRecentlyUsedTags)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_TAGS}${iou.report?.policyID}`,
            value: optimisticDataParams.policyRecentlyUsedTags,
        });
    }
    const redundantParticipants = {};
    if (!(0, EmptyObject_1.isEmptyObject)(optimisticDataParams.personalDetailListAction)) {
        const successPersonalDetailListAction = {};
        // BE will send different participants. We clear the optimistic ones to avoid duplicated entries
        Object.keys(optimisticDataParams.personalDetailListAction).forEach((accountIDKey) => {
            const accountID = Number(accountIDKey);
            successPersonalDetailListAction[accountID] = null;
            redundantParticipants[accountID] = null;
        });
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: optimisticDataParams.personalDetailListAction,
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: successPersonalDetailListAction,
        });
    }
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iou.report?.reportID}`,
        value: {
            participants: redundantParticipants,
            pendingFields: null,
            errorFields: null,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${iou.report?.reportID}`,
        value: {
            isOptimisticReport: false,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionParams.threadReport.reportID}`,
        value: {
            participants: redundantParticipants,
            pendingFields: null,
            errorFields: null,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${transactionParams.threadReport.reportID}`,
        value: {
            isOptimisticReport: false,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionParams.transaction.transactionID}`,
        value: {
            pendingAction: null,
            pendingFields: clearedPendingFields,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chat.report?.reportID}`,
        value: {
            ...(chat.isNewReport
                ? {
                    [chat.createdAction.reportActionID]: {
                        pendingAction: null,
                        errors: null,
                    },
                }
                : {}),
            [chat.reportPreviewAction.reportActionID]: {
                pendingAction: null,
                isOptimisticAction: null,
            },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iou.report?.reportID}`,
        value: {
            [iou.createdAction.reportActionID]: {
                pendingAction: null,
                errors: null,
            },
            [iou.action.reportActionID]: {
                pendingAction: null,
                errors: null,
            },
        },
    });
    if (transactionParams.threadCreatedReportAction?.reportActionID) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionParams.threadReport.reportID}`,
            value: {
                [transactionParams.threadCreatedReportAction.reportActionID]: {
                    pendingAction: null,
                    errors: null,
                },
            },
        });
    }
    if (chat.isNewReport) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chat.report?.reportID}`,
            value: {
                participants: redundantParticipants,
                pendingFields: null,
                errorFields: null,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${chat.report?.reportID}`,
            value: {
                isOptimisticReport: false,
            },
        });
    }
    const errorKey = DateUtils_1.default.getMicroseconds();
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chat.report?.reportID}`,
            value: {
                iouReportID: chat.report?.iouReportID,
                lastReadTime: chat.report?.lastReadTime,
                pendingFields: null,
                hasOutstandingChildRequest: chat.report?.hasOutstandingChildRequest,
                ...(chat.isNewReport
                    ? {
                        errorFields: {
                            createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                        },
                    }
                    : {}),
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iou.report?.reportID}`,
            value: {
                pendingFields: null,
                errorFields: {
                    createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionParams.threadReport.reportID}`,
            value: {
                errorFields: {
                    createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionParams.transaction.transactionID}`,
            value: {
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateInvoiceFailureMessage'),
                pendingFields: clearedPendingFields,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iou.report?.reportID}`,
            value: {
                [iou.createdAction.reportActionID]: {
                    // Disabling this line since transactionParams.transaction.filename can be an empty string
                    errors: getReceiptError(transactionParams.transaction.receipt, 
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    transactionParams.transaction?.filename || transactionParams.transaction.receipt?.filename, false, errorKey),
                },
                [iou.action.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateInvoiceFailureMessage'),
                },
            },
        },
    ];
    if (transactionParams.threadCreatedReportAction?.reportActionID) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionParams.threadReport.reportID}`,
            value: {
                [transactionParams.threadCreatedReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateInvoiceFailureMessage', errorKey),
                },
            },
        });
    }
    if (companyName && companyWebsite) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyParams.policy?.id}`,
            value: {
                invoice: {
                    companyName,
                    companyWebsite,
                    pendingFields: {
                        companyName: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        companyWebsite: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyParams.policy?.id}`,
            value: {
                invoice: {
                    pendingFields: {
                        companyName: null,
                        companyWebsite: null,
                    },
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyParams.policy?.id}`,
            value: {
                invoice: {
                    companyName: null,
                    companyWebsite: null,
                    pendingFields: {
                        companyName: null,
                        companyWebsite: null,
                    },
                },
            },
        });
    }
    const searchUpdate = getSearchOnyxUpdate({
        transaction,
        participant,
        iouReport: iou.report,
        policy: policyParams.policy,
        isInvoice: true,
        transactionThreadReportID: transactionParams.threadReport.reportID,
    });
    if (searchUpdate) {
        if (searchUpdate.optimisticData) {
            optimisticData.push(...searchUpdate.optimisticData);
        }
        if (searchUpdate.successData) {
            successData.push(...searchUpdate.successData);
        }
    }
    // We don't need to compute violations unless we're on a paid policy
    if (!policyParams.policy || !(0, PolicyUtils_1.isPaidGroupPolicy)(policyParams.policy)) {
        return [optimisticData, successData, failureData];
    }
    return [optimisticData, successData, failureData];
}
/** Builds the Onyx data for track expense */
function buildOnyxDataForTrackExpense({ chat, iou, transactionParams, policyParams = {}, shouldCreateNewMoneyRequestReport, existingTransactionThreadReportID, actionableTrackExpenseWhisper, retryParams, participant, }) {
    const { report: chatReport, previewAction: reportPreviewAction } = chat;
    const { report: iouReport, createdAction: iouCreatedAction, action: iouAction } = iou;
    const { transaction, threadReport: transactionThreadReport, threadCreatedReportAction: transactionThreadCreatedReportAction } = transactionParams;
    const { policy, tagList: policyTagList, categories: policyCategories } = policyParams;
    const isScanRequest = (0, TransactionUtils_1.isScanRequest)(transaction);
    const isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    const isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(transaction);
    const clearedPendingFields = Object.fromEntries(Object.keys(transaction.pendingFields ?? {}).map((key) => [key, null]));
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    const isSelfDMReport = (0, ReportUtils_1.isSelfDM)(chatReport);
    let newQuickAction = isSelfDMReport ? CONST_1.default.QUICK_ACTIONS.TRACK_MANUAL : CONST_1.default.QUICK_ACTIONS.REQUEST_MANUAL;
    if (isScanRequest) {
        newQuickAction = isSelfDMReport ? CONST_1.default.QUICK_ACTIONS.TRACK_SCAN : CONST_1.default.QUICK_ACTIONS.REQUEST_SCAN;
    }
    else if (isDistanceRequest) {
        newQuickAction = isSelfDMReport ? CONST_1.default.QUICK_ACTIONS.TRACK_DISTANCE : CONST_1.default.QUICK_ACTIONS.REQUEST_DISTANCE;
    }
    const existingTransactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${existingTransactionThreadReportID}`] ?? null;
    if (chatReport) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: {
                ...chatReport,
                lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(iouAction),
                lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(iouAction),
                lastReadTime: DateUtils_1.default.getDBTime(),
                // do not update iouReportID if auto submit beta is enabled and it is a scan request
                iouReportID: isASAPSubmitBetaEnabled && isScanRequest ? null : iouReport?.reportID,
                lastVisibleActionCreated: shouldCreateNewMoneyRequestReport ? reportPreviewAction?.created : chatReport.lastVisibleActionCreated,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
            value: {
                action: newQuickAction,
                chatReportID: chatReport.reportID,
                isFirstQuickAction: (0, EmptyObject_1.isEmptyObject)(quickAction),
            },
        });
        if (actionableTrackExpenseWhisper && !iouReport) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
                value: {
                    [actionableTrackExpenseWhisper.reportActionID]: actionableTrackExpenseWhisper,
                },
            });
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
                value: {
                    lastReadTime: actionableTrackExpenseWhisper.created,
                    lastVisibleActionCreated: actionableTrackExpenseWhisper.created,
                    lastMessageText: CONST_1.default.ACTIONABLE_TRACK_EXPENSE_WHISPER_MESSAGE,
                },
            });
            successData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
                value: {
                    [actionableTrackExpenseWhisper.reportActionID]: { pendingAction: null, errors: null },
                },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
                value: { [actionableTrackExpenseWhisper.reportActionID]: null },
            });
        }
    }
    if (iouReport) {
        optimisticData.push({
            onyxMethod: shouldCreateNewMoneyRequestReport ? react_native_onyx_1.default.METHOD.SET : react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`,
            value: {
                ...iouReport,
                lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(iouAction),
                lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(iouAction),
                pendingFields: {
                    ...(shouldCreateNewMoneyRequestReport ? { createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD } : { preview: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
                },
            },
        }, shouldCreateNewMoneyRequestReport
            ? {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`,
                value: {
                    [iouCreatedAction.reportActionID]: iouCreatedAction,
                    [iouAction.reportActionID]: iouAction,
                },
            }
            : {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`,
                value: {
                    [iouAction.reportActionID]: iouAction,
                },
            }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                ...(reportPreviewAction && { [reportPreviewAction.reportActionID]: reportPreviewAction }),
            },
        });
        if (shouldCreateNewMoneyRequestReport) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${iouReport.reportID}`,
                value: {
                    isOptimisticReport: true,
                },
            });
        }
    }
    else {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                [iouAction.reportActionID]: iouAction,
            },
        });
    }
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
        value: transaction,
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.reportID}`,
        value: {
            ...transactionThreadReport,
            pendingFields: { createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${transactionThreadReport?.reportID}`,
        value: {
            isOptimisticReport: true,
        },
    });
    if (!(0, EmptyObject_1.isEmptyObject)(transactionThreadCreatedReportAction)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport?.reportID}`,
            value: {
                [transactionThreadCreatedReportAction.reportActionID]: transactionThreadCreatedReportAction,
            },
        });
    }
    if (iouReport) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
            value: {
                pendingFields: null,
                errorFields: null,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
            value: {
                ...(shouldCreateNewMoneyRequestReport
                    ? {
                        [iouCreatedAction.reportActionID]: {
                            pendingAction: null,
                            errors: null,
                        },
                    }
                    : {}),
                [iouAction.reportActionID]: {
                    pendingAction: null,
                    errors: null,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                ...(reportPreviewAction && { [reportPreviewAction.reportActionID]: { pendingAction: null } }),
            },
        });
        if (shouldCreateNewMoneyRequestReport) {
            successData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${iouReport.reportID}`,
                value: {
                    isOptimisticReport: false,
                },
            });
        }
    }
    else {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                [iouAction.reportActionID]: {
                    pendingAction: null,
                    errors: null,
                },
                ...(reportPreviewAction && { [reportPreviewAction.reportActionID]: { pendingAction: null } }),
            },
        });
    }
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.reportID}`,
        value: {
            pendingFields: null,
            errorFields: null,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${transactionThreadReport?.reportID}`,
        value: {
            isOptimisticReport: false,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
        value: {
            pendingAction: null,
            pendingFields: clearedPendingFields,
            routes: null,
        },
    });
    if (!(0, EmptyObject_1.isEmptyObject)(transactionThreadCreatedReportAction)) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport?.reportID}`,
            value: {
                [transactionThreadCreatedReportAction.reportActionID]: {
                    pendingAction: null,
                    errors: null,
                },
            },
        });
    }
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
        value: quickAction ?? null,
    });
    if (iouReport) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`,
            value: {
                pendingFields: null,
                errorFields: {
                    ...(shouldCreateNewMoneyRequestReport ? { createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage') } : {}),
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport.reportID}`,
            value: {
                ...(shouldCreateNewMoneyRequestReport
                    ? {
                        [iouCreatedAction.reportActionID]: {
                            errors: getReceiptError(transaction.receipt, 
                            // Disabling this line since transaction.filename can be an empty string
                            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                            transaction.filename || transaction.receipt?.filename, isScanRequest, undefined, CONST_1.default.IOU.ACTION_PARAMS.TRACK_EXPENSE, retryParams),
                        },
                        [iouAction.reportActionID]: {
                            errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
                        },
                    }
                    : {
                        [iouAction.reportActionID]: {
                            errors: getReceiptError(transaction.receipt, 
                            // Disabling this line since transaction.filename can be an empty string
                            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                            transaction.filename || transaction.receipt?.filename, isScanRequest, undefined, CONST_1.default.IOU.ACTION_PARAMS.TRACK_EXPENSE, retryParams),
                        },
                    }),
            },
        });
    }
    else {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                [iouAction.reportActionID]: {
                    errors: getReceiptError(transaction.receipt, 
                    // Disabling this line since transaction.filename can be an empty string
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    transaction.filename || transaction.receipt?.filename, isScanRequest, undefined, CONST_1.default.IOU.ACTION_PARAMS.TRACK_EXPENSE, retryParams),
                },
            },
        });
    }
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
        value: {
            lastReadTime: chatReport?.lastReadTime,
            lastMessageText: chatReport?.lastMessageText,
            lastMessageHtml: chatReport?.lastMessageHtml,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.reportID}`,
        value: {
            pendingFields: null,
            errorFields: existingTransactionThreadReport
                ? null
                : {
                    createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
        value: {
            errors: getReceiptError(transaction.receipt, 
            // Disabling this line since transaction.filename can be an empty string
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            transaction.filename || transaction.receipt?.filename, isScanRequest, undefined, CONST_1.default.IOU.ACTION_PARAMS.TRACK_EXPENSE, retryParams),
            pendingFields: clearedPendingFields,
        },
    });
    if (transactionThreadCreatedReportAction?.reportActionID) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport?.reportID}`,
            value: {
                [transactionThreadCreatedReportAction?.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
                },
            },
        });
    }
    const searchUpdate = getSearchOnyxUpdate({
        transaction,
        participant,
        transactionThreadReportID: transactionThreadReport?.reportID,
    });
    if (searchUpdate) {
        if (searchUpdate.optimisticData) {
            optimisticData.push(...searchUpdate.optimisticData);
        }
        if (searchUpdate.successData) {
            successData.push(...searchUpdate.successData);
        }
    }
    // We don't need to compute violations unless we're on a paid policy
    if (!policy || !(0, PolicyUtils_1.isPaidGroupPolicy)(policy)) {
        return [optimisticData, successData, failureData];
    }
    const violationsOnyxData = ViolationsUtils_1.default.getViolationsOnyxData(transaction, [], policy, policyTagList ?? {}, policyCategories ?? {}, (0, PolicyUtils_1.hasDependentTags)(policy, policyTagList ?? {}), false);
    if (violationsOnyxData) {
        optimisticData.push(violationsOnyxData);
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
            value: [],
        });
    }
    // Show field violations only for control policies
    if ((0, PolicyUtils_1.isControlPolicy)(policy) && iouReport) {
        const { optimisticData: fieldViolationsOptimisticData, failureData: fieldViolationsFailureData } = getFieldViolationsOnyxData(iouReport);
        optimisticData.push(...fieldViolationsOptimisticData);
        failureData.push(...fieldViolationsFailureData);
    }
    return [optimisticData, successData, failureData];
}
function getDeleteTrackExpenseInformation(chatReportID, transactionID, reportAction, shouldDeleteTransactionFromOnyx = true, isMovingTransactionFromTrackExpense = false, actionableWhisperReportActionID = '', resolution = '', shouldRemoveIOUTransaction = true) {
    // STEP 1: Get all collections we're updating
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`] ?? null;
    const transaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    const transactionViolations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`];
    const transactionThreadID = reportAction.childReportID;
    let transactionThread = null;
    if (transactionThreadID) {
        transactionThread = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadID}`] ?? null;
    }
    // STEP 2: Decide if we need to:
    // 1. Delete the transactionThread - delete if there are no visible comments in the thread and we're not moving the transaction
    // 2. Update the moneyRequestPreview to show [Deleted expense] - update if the transactionThread exists AND it isn't being deleted and we're not moving the transaction
    const shouldDeleteTransactionThread = !isMovingTransactionFromTrackExpense && (transactionThreadID ? (reportAction?.childVisibleActionCount ?? 0) === 0 : false);
    const shouldShowDeletedRequestMessage = !isMovingTransactionFromTrackExpense && !!transactionThreadID && !shouldDeleteTransactionThread;
    // STEP 3: Update the IOU reportAction.
    const updatedReportAction = {
        [reportAction.reportActionID]: {
            pendingAction: shouldShowDeletedRequestMessage ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE : CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            previousMessage: reportAction.message,
            message: [
                {
                    type: 'COMMENT',
                    html: '',
                    text: '',
                    isEdited: true,
                    isDeletedParentAction: shouldShowDeletedRequestMessage,
                },
            ],
            originalMessage: {
                IOUTransactionID: shouldRemoveIOUTransaction ? null : transactionID,
            },
            errors: undefined,
        },
        ...(actionableWhisperReportActionID && { [actionableWhisperReportActionID]: { originalMessage: { resolution } } }),
    };
    let canUserPerformWriteAction = true;
    if (chatReport) {
        canUserPerformWriteAction = !!(0, ReportUtils_1.canUserPerformWriteAction)(chatReport);
    }
    const lastVisibleAction = (0, ReportActionsUtils_1.getLastVisibleAction)(chatReportID, canUserPerformWriteAction, updatedReportAction);
    const { lastMessageText = '', lastMessageHtml = '' } = (0, ReportActionsUtils_1.getLastVisibleMessage)(chatReportID, canUserPerformWriteAction, updatedReportAction);
    // STEP 4: Build Onyx data
    const optimisticData = [];
    if (shouldDeleteTransactionFromOnyx && shouldRemoveIOUTransaction) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: null,
        });
    }
    if (!shouldRemoveIOUTransaction) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            },
        });
    }
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
        value: null,
    });
    if (shouldDeleteTransactionThread) {
        optimisticData.push(
        // Use merge instead of set to avoid deleting the report too quickly, which could cause a brief "not found" page to appear.
        // The remaining parts of the report object will be removed after the API call is successful.
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadID}`,
            value: {
                reportID: null,
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                participants: {
                    [userAccountID]: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadID}`,
            value: null,
        });
    }
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
        value: updatedReportAction,
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
        value: {
            lastMessageText,
            lastVisibleActionCreated: lastVisibleAction?.created,
            lastMessageHtml: !lastMessageHtml ? lastMessageText : lastMessageHtml,
        },
    });
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    pendingAction: null,
                    errors: null,
                },
            },
        },
    ];
    // Ensure that any remaining data is removed upon successful completion, even if the server sends a report removal response.
    // This is done to prevent the removal update from lingering in the applyHTTPSOnyxUpdates function.
    if (shouldDeleteTransactionThread && transactionThread) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadID}`,
            value: null,
        });
    }
    const failureData = [];
    if (shouldDeleteTransactionFromOnyx && shouldRemoveIOUTransaction) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: transaction ?? null,
        });
    }
    if (!shouldRemoveIOUTransaction) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: null,
            },
        });
    }
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
        value: transactionViolations ?? null,
    });
    if (shouldDeleteTransactionThread) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadID}`,
            value: transactionThread,
        });
    }
    if (actionableWhisperReportActionID) {
        const actionableWhisperReportAction = (0, ReportActionsUtils_1.getReportAction)(chatReportID, actionableWhisperReportActionID);
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                [actionableWhisperReportActionID]: {
                    originalMessage: {
                        resolution: (0, ReportActionsUtils_1.isActionableTrackExpense)(actionableWhisperReportAction) ? ((0, ReportActionsUtils_1.getOriginalMessage)(actionableWhisperReportAction)?.resolution ?? null) : null,
                    },
                },
            },
        });
    }
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
        value: {
            [reportAction.reportActionID]: {
                ...reportAction,
                pendingAction: null,
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericDeleteFailureMessage'),
            },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
        value: chatReport,
    });
    const parameters = {
        transactionID,
        reportActionID: reportAction.reportActionID,
    };
    return { parameters, optimisticData, successData, failureData, shouldDeleteTransactionThread, chatReport };
}
/**
 * Get the invoice receiver type based on the receiver participant.
 * @param receiverParticipant The participant who will receive the invoice or the invoice receiver object directly.
 * @returns The invoice receiver type.
 */
function getReceiverType(receiverParticipant) {
    if (!receiverParticipant) {
        Log_1.default.warn('getReceiverType called with no receiverParticipant');
        return CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL;
    }
    if ('type' in receiverParticipant && receiverParticipant.type) {
        return receiverParticipant.type;
    }
    if ('policyID' in receiverParticipant && receiverParticipant.policyID) {
        return CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS;
    }
    return CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL;
}
/** Gathers all the data needed to create an invoice. */
function getSendInvoiceInformation(transaction, currentUserAccountID, invoiceChatReport, receipt, policy, policyTagList, policyCategories, companyName, companyWebsite, policyRecentlyUsedCategories) {
    const { amount = 0, currency = '', created = '', merchant = '', category = '', tag = '', taxCode = '', taxAmount = 0, billable, comment, participants } = transaction ?? {};
    const trimmedComment = (comment?.comment ?? '').trim();
    const senderWorkspaceID = participants?.find((participant) => participant?.isSender)?.policyID;
    const receiverParticipant = participants?.find((participant) => participant?.accountID) ?? invoiceChatReport?.invoiceReceiver;
    const receiverAccountID = receiverParticipant && 'accountID' in receiverParticipant && receiverParticipant.accountID ? receiverParticipant.accountID : CONST_1.default.DEFAULT_NUMBER_ID;
    let receiver = (0, ReportUtils_1.getPersonalDetailsForAccountID)(receiverAccountID);
    let optimisticPersonalDetailListAction = {};
    // STEP 1: Get existing chat report OR build a new optimistic one
    let isNewChatReport = false;
    let chatReport = !(0, EmptyObject_1.isEmptyObject)(invoiceChatReport) && invoiceChatReport?.reportID ? invoiceChatReport : null;
    if (!chatReport) {
        isNewChatReport = true;
        chatReport = (0, ReportUtils_1.buildOptimisticChatReport)({
            participantList: [receiverAccountID, currentUserAccountID],
            chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
            policyID: senderWorkspaceID,
        });
    }
    // STEP 2: Create a new optimistic invoice report.
    const optimisticInvoiceReport = (0, ReportUtils_1.buildOptimisticInvoiceReport)(chatReport.reportID, senderWorkspaceID, receiverAccountID, receiver.displayName ?? receiverParticipant?.login ?? '', amount, currency);
    // STEP 3: Build optimistic receipt and transaction
    const receiptObject = {};
    let filename;
    if (receipt?.source) {
        receiptObject.source = receipt.source;
        receiptObject.state = receipt.state ?? CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
        filename = receipt.name;
    }
    const optimisticTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
        transactionParams: {
            amount: amount * -1,
            currency,
            reportID: optimisticInvoiceReport.reportID,
            comment: trimmedComment,
            created,
            merchant,
            receipt: receiptObject,
            category,
            tag,
            taxCode,
            taxAmount,
            billable,
            reimbursable: true,
            filename,
        },
    });
    const optimisticPolicyRecentlyUsedCategories = mergePolicyRecentlyUsedCategories(category, policyRecentlyUsedCategories);
    const optimisticPolicyRecentlyUsedTags = (0, Tag_1.buildOptimisticPolicyRecentlyUsedTags)(optimisticInvoiceReport.policyID, tag);
    const optimisticRecentlyUsedCurrencies = (0, Policy_1.buildOptimisticRecentlyUsedCurrencies)(currency);
    // STEP 4: Add optimistic personal details for participant
    const shouldCreateOptimisticPersonalDetails = isNewChatReport && !allPersonalDetails[receiverAccountID];
    if (shouldCreateOptimisticPersonalDetails) {
        const receiverLogin = receiverParticipant && 'login' in receiverParticipant && receiverParticipant.login ? receiverParticipant.login : '';
        receiver = {
            accountID: receiverAccountID,
            displayName: (0, LocalePhoneNumber_1.formatPhoneNumber)(receiverLogin),
            login: receiverLogin,
            isOptimisticPersonalDetail: true,
        };
        optimisticPersonalDetailListAction = { [receiverAccountID]: receiver };
    }
    // STEP 5: Build optimistic reportActions.
    const reportPreviewAction = (0, ReportUtils_1.buildOptimisticReportPreview)(chatReport, optimisticInvoiceReport, trimmedComment, optimisticTransaction);
    optimisticInvoiceReport.parentReportActionID = reportPreviewAction.reportActionID;
    chatReport.lastVisibleActionCreated = reportPreviewAction.created;
    const [optimisticCreatedActionForChat, optimisticCreatedActionForIOUReport, iouAction, optimisticTransactionThread, optimisticCreatedActionForTransactionThread] = (0, ReportUtils_1.buildOptimisticMoneyRequestEntities)({
        iouReport: optimisticInvoiceReport,
        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
        amount,
        currency,
        comment: trimmedComment,
        payeeEmail: receiver.login ?? '',
        participants: [receiver],
        transactionID: optimisticTransaction.transactionID,
    });
    // STEP 6: Build Onyx Data
    const [optimisticData, successData, failureData] = buildOnyxDataForInvoice({
        chat: { report: chatReport, createdAction: optimisticCreatedActionForChat, reportPreviewAction, isNewReport: isNewChatReport },
        iou: { createdAction: optimisticCreatedActionForIOUReport, action: iouAction, report: optimisticInvoiceReport },
        transactionParams: {
            transaction: optimisticTransaction,
            threadReport: optimisticTransactionThread,
            threadCreatedReportAction: optimisticCreatedActionForTransactionThread,
        },
        policyParams: { policy, policyTagList, policyCategories },
        optimisticData: {
            personalDetailListAction: optimisticPersonalDetailListAction,
            recentlyUsedCurrencies: optimisticRecentlyUsedCurrencies,
            policyRecentlyUsedCategories: optimisticPolicyRecentlyUsedCategories,
            policyRecentlyUsedTags: optimisticPolicyRecentlyUsedTags,
        },
        participant: receiver,
        companyName,
        companyWebsite,
    });
    return {
        createdIOUReportActionID: optimisticCreatedActionForIOUReport.reportActionID,
        createdReportActionIDForThread: optimisticCreatedActionForTransactionThread?.reportActionID,
        reportActionID: iouAction.reportActionID,
        senderWorkspaceID,
        receiver,
        invoiceRoom: chatReport,
        createdChatReportActionID: optimisticCreatedActionForChat.reportActionID,
        invoiceReportID: optimisticInvoiceReport.reportID,
        reportPreviewReportActionID: reportPreviewAction.reportActionID,
        transactionID: optimisticTransaction.transactionID,
        transactionThreadReportID: optimisticTransactionThread.reportID,
        onyxData: {
            optimisticData,
            successData,
            failureData,
        },
    };
}
/**
 * Gathers all the data needed to submit an expense. It attempts to find existing reports, iouReports, and receipts. If it doesn't find them, then
 * it creates optimistic versions of them and uses those instead
 */
function getMoneyRequestInformation(moneyRequestInformation) {
    const { parentChatReport, transactionParams, participantParams, policyParams = {}, existingTransaction, existingTransactionID, moneyRequestReportID = '', retryParams, isSplitExpense, testDriveCommentReportActionID, optimisticChatReportID, optimisticCreatedReportActionID, optimisticIOUReportID, optimisticReportPreviewActionID, shouldGenerateTransactionThreadReport = true, } = moneyRequestInformation;
    const { payeeAccountID = userAccountID, payeeEmail = currentUserEmail, participant } = participantParams;
    const { policy, policyCategories, policyTagList } = policyParams;
    const { attendees, amount, comment = '', currency, source = '', created, merchant, receipt, category, tag, taxCode, taxAmount, billable, reimbursable = true, linkedTrackedExpenseReportAction, } = transactionParams;
    const payerEmail = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(participant.login ?? '');
    const payerAccountID = Number(participant.accountID);
    const isPolicyExpenseChat = participant.isPolicyExpenseChat;
    // STEP 1: Get existing chat report OR build a new optimistic one
    let isNewChatReport = false;
    let chatReport = !(0, EmptyObject_1.isEmptyObject)(parentChatReport) && parentChatReport?.reportID ? parentChatReport : null;
    // If this is a policyExpenseChat, the chatReport must exist and we can get it from Onyx.
    // report is null if the flow is initiated from the global create menu. However, participant always stores the reportID if it exists, which is the case for policyExpenseChats
    if (!chatReport && isPolicyExpenseChat) {
        chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${participant.reportID}`] ?? null;
    }
    if (!chatReport) {
        chatReport = (0, ReportUtils_1.getChatByParticipants)([payerAccountID, payeeAccountID]) ?? null;
    }
    // If we still don't have a report, it likely doesn't exist and we need to build an optimistic one
    if (!chatReport) {
        isNewChatReport = true;
        chatReport = (0, ReportUtils_1.buildOptimisticChatReport)({
            participantList: [payerAccountID, payeeAccountID],
            optimisticReportID: optimisticChatReportID,
        });
    }
    // STEP 2: Get the Expense/IOU report. If the moneyRequestReportID has been provided, we want to add the transaction to this specific report.
    // If no such reportID has been provided, let's use the chatReport.iouReportID property. In case that is not present, build a new optimistic Expense/IOU report.
    let iouReport = null;
    if (moneyRequestReportID) {
        iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${moneyRequestReportID}`] ?? null;
    }
    else if (!allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.iouReportID}`]?.errorFields?.createChat) {
        iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.iouReportID}`] ?? null;
    }
    const isScanRequest = (0, TransactionUtils_1.isScanRequest)({ amount, receipt });
    const shouldCreateNewMoneyRequestReport = isSplitExpense ? false : (0, ReportUtils_1.shouldCreateNewMoneyRequestReport)(iouReport, chatReport, isScanRequest);
    if (!iouReport || shouldCreateNewMoneyRequestReport) {
        const nonReimbursableTotal = reimbursable ? 0 : amount;
        iouReport = isPolicyExpenseChat
            ? (0, ReportUtils_1.buildOptimisticExpenseReport)(chatReport.reportID, chatReport.policyID, payeeAccountID, amount, currency, nonReimbursableTotal, undefined, optimisticIOUReportID)
            : (0, ReportUtils_1.buildOptimisticIOUReport)(payeeAccountID, payerAccountID, amount, chatReport.reportID, currency, undefined, undefined, optimisticIOUReportID);
    }
    else if (isPolicyExpenseChat) {
        // Splitting doesn't affect the amount, so no adjustment is needed
        // The amount remains constant after the split
        if (!isSplitExpense) {
            iouReport = { ...iouReport };
            // Because of the Expense reports are stored as negative values, we subtract the total from the amount
            if (iouReport?.currency === currency) {
                if (!Number.isNaN(iouReport.total) && iouReport.total !== undefined) {
                    iouReport.total -= amount;
                }
                iouReport.nonReimbursableTotal = (iouReport.nonReimbursableTotal ?? 0) - amount;
                if (typeof iouReport.unheldTotal === 'number') {
                    iouReport.unheldTotal -= amount;
                }
            }
        }
    }
    else {
        iouReport = (0, IOUUtils_1.updateIOUOwnerAndTotal)(iouReport, payeeAccountID, amount, currency);
    }
    // STEP 3: Build an optimistic transaction with the receipt
    const isDistanceRequest = existingTransaction &&
        (existingTransaction.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE ||
            existingTransaction.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP ||
            existingTransaction.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL);
    const isManualDistanceRequest = existingTransaction && existingTransaction.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL;
    let optimisticTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
        existingTransactionID,
        existingTransaction,
        originalTransactionID: transactionParams.originalTransactionID,
        policy,
        transactionParams: {
            amount: (0, ReportUtils_1.isExpenseReport)(iouReport) ? -amount : amount,
            currency,
            reportID: iouReport.reportID,
            comment,
            attendees,
            created,
            merchant,
            receipt,
            category,
            tag,
            taxCode,
            source,
            taxAmount: (0, ReportUtils_1.isExpenseReport)(iouReport) ? -(taxAmount ?? 0) : taxAmount,
            billable,
            reimbursable: isPolicyExpenseChat ? reimbursable : true,
            pendingFields: isDistanceRequest && !isManualDistanceRequest ? { waypoints: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD } : undefined,
        },
        isDemoTransactionParam: (0, ReportUtils_1.isSelectedManagerMcTest)(participant.login) || transactionParams.receipt?.isTestDriveReceipt,
    });
    const optimisticPolicyRecentlyUsedCategories = (0, Category_1.buildOptimisticPolicyRecentlyUsedCategories)(iouReport.policyID, category);
    const optimisticPolicyRecentlyUsedTags = (0, Tag_1.buildOptimisticPolicyRecentlyUsedTags)(iouReport.policyID, tag);
    const optimisticPolicyRecentlyUsedCurrencies = (0, Policy_1.buildOptimisticRecentlyUsedCurrencies)(currency);
    // If there is an existing transaction (which is the case for distance requests), then the data from the existing transaction
    // needs to be manually merged into the optimistic transaction. This is because buildOnyxDataForMoneyRequest() uses `Onyx.set()` for the transaction
    // data. This is a big can of worms to change it to `Onyx.merge()` as explored in https://expensify.slack.com/archives/C05DWUDHVK7/p1692139468252109.
    // I want to clean this up at some point, but it's possible this will live in the code for a while so I've created https://github.com/Expensify/App/issues/25417
    // to remind me to do this.
    if (isDistanceRequest) {
        optimisticTransaction = (0, expensify_common_1.fastMerge)(existingTransaction, optimisticTransaction, false);
    }
    // STEP 4: Build optimistic reportActions. We need:
    // 1. CREATED action for the chatReport
    // 2. CREATED action for the iouReport
    // 3. IOU action for the iouReport
    // 4. The transaction thread, which requires the iouAction, and CREATED action for the transaction thread
    // 5. REPORT_PREVIEW action for the chatReport
    // Note: The CREATED action for the IOU report must be optimistically generated before the IOU action so there's no chance that it appears after the IOU action in the chat
    const [optimisticCreatedActionForChat, optimisticCreatedActionForIOUReport, iouAction, optimisticTransactionThread, optimisticCreatedActionForTransactionThread] = (0, ReportUtils_1.buildOptimisticMoneyRequestEntities)({
        iouReport,
        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
        amount,
        currency,
        comment,
        payeeEmail,
        participants: [participant],
        transactionID: optimisticTransaction.transactionID,
        paymentType: (0, ReportUtils_1.isSelectedManagerMcTest)(participant.login) || transactionParams.receipt?.isTestDriveReceipt ? CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE : undefined,
        existingTransactionThreadReportID: linkedTrackedExpenseReportAction?.childReportID,
        optimisticCreatedReportActionID,
        linkedTrackedExpenseReportAction,
        shouldGenerateTransactionThreadReport,
    });
    let reportPreviewAction = shouldCreateNewMoneyRequestReport ? null : getReportPreviewAction(chatReport.reportID, iouReport.reportID);
    if (reportPreviewAction) {
        reportPreviewAction = (0, ReportUtils_1.updateReportPreview)(iouReport, reportPreviewAction, false, comment, optimisticTransaction);
    }
    else {
        reportPreviewAction = (0, ReportUtils_1.buildOptimisticReportPreview)(chatReport, iouReport, comment, optimisticTransaction, undefined, optimisticReportPreviewActionID);
        chatReport.lastVisibleActionCreated = reportPreviewAction.created;
        // Generated ReportPreview action is a parent report action of the iou report.
        // We are setting the iou report's parentReportActionID to display subtitle correctly in IOU page when offline.
        iouReport.parentReportActionID = reportPreviewAction.reportActionID;
    }
    const shouldCreateOptimisticPersonalDetails = isNewChatReport && !allPersonalDetails[payerAccountID];
    // Add optimistic personal details for participant
    const optimisticPersonalDetailListAction = shouldCreateOptimisticPersonalDetails
        ? {
            [payerAccountID]: {
                accountID: payerAccountID,
                // Disabling this line since participant.displayName can be an empty string
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                displayName: (0, LocalePhoneNumber_1.formatPhoneNumber)(participant.displayName || payerEmail),
                login: participant.login,
                isOptimisticPersonalDetail: true,
            },
        }
        : {};
    const predictedNextStatus = policy?.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO ? CONST_1.default.REPORT.STATUS_NUM.CLOSED : CONST_1.default.REPORT.STATUS_NUM.OPEN;
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(iouReport, predictedNextStatus);
    // STEP 5: Build Onyx Data
    const [optimisticData, successData, failureData] = buildOnyxDataForMoneyRequest({
        participant,
        isNewChatReport,
        shouldCreateNewMoneyRequestReport,
        shouldGenerateTransactionThreadReport,
        policyParams: {
            policy,
            policyCategories,
            policyTagList,
        },
        optimisticParams: {
            chat: {
                report: chatReport,
                createdAction: optimisticCreatedActionForChat,
                reportPreviewAction,
            },
            iou: {
                report: iouReport,
                createdAction: optimisticCreatedActionForIOUReport,
                action: iouAction,
            },
            transactionParams: {
                transaction: optimisticTransaction,
                transactionThreadReport: optimisticTransactionThread,
                transactionThreadCreatedReportAction: optimisticCreatedActionForTransactionThread,
            },
            policyRecentlyUsed: {
                categories: optimisticPolicyRecentlyUsedCategories,
                tags: optimisticPolicyRecentlyUsedTags,
                currencies: optimisticPolicyRecentlyUsedCurrencies,
            },
            personalDetailListAction: optimisticPersonalDetailListAction,
            nextStep: optimisticNextStep,
            testDriveCommentReportActionID,
        },
        retryParams,
    });
    return {
        payerAccountID,
        payerEmail,
        iouReport,
        chatReport,
        transaction: optimisticTransaction,
        iouAction,
        createdChatReportActionID: isNewChatReport ? optimisticCreatedActionForChat.reportActionID : undefined,
        createdIOUReportActionID: shouldCreateNewMoneyRequestReport ? optimisticCreatedActionForIOUReport.reportActionID : undefined,
        reportPreviewAction,
        transactionThreadReportID: optimisticTransactionThread?.reportID,
        createdReportActionIDForThread: optimisticCreatedActionForTransactionThread?.reportActionID,
        onyxData: {
            optimisticData,
            successData,
            failureData,
        },
    };
}
function computePerDiemExpenseAmount(customUnit) {
    const subRates = customUnit.subRates ?? [];
    return subRates.reduce((total, subRate) => total + subRate.quantity * subRate.rate, 0);
}
function computePerDiemExpenseMerchant(customUnit, policy) {
    if (!customUnit.customUnitRateID) {
        return '';
    }
    const policyCustomUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const rate = policyCustomUnit?.rates?.[customUnit.customUnitRateID];
    const locationName = rate?.name ?? '';
    const startDate = customUnit.attributes?.dates.start;
    const endDate = customUnit.attributes?.dates.end;
    if (!startDate || !endDate) {
        return locationName;
    }
    const formattedTime = DateUtils_1.default.getFormattedDateRangeForPerDiem(new Date(startDate), new Date(endDate));
    return `${locationName}, ${formattedTime}`;
}
function computeDefaultPerDiemExpenseComment(customUnit, currency) {
    const subRates = customUnit.subRates ?? [];
    const subRateComments = subRates.map((subRate) => {
        const rate = subRate.rate ?? 0;
        const rateComment = subRate.name ?? '';
        const quantity = subRate.quantity ?? 0;
        return `${quantity}x ${rateComment} @ ${(0, CurrencyUtils_1.convertAmountToDisplayString)(rate, currency)}`;
    });
    return subRateComments.join(', ');
}
function mergePolicyRecentlyUsedCategories(category, policyRecentlyUsedCategories) {
    return category ? Array.from(new Set([category, ...(Array.isArray(policyRecentlyUsedCategories) ? policyRecentlyUsedCategories : [])])) : (policyRecentlyUsedCategories ?? []);
}
/**
 * Gathers all the data needed to submit a per diem expense. It attempts to find existing reports, iouReports, and receipts. If it doesn't find them, then
 * it creates optimistic versions of them and uses those instead
 */
function getPerDiemExpenseInformation(perDiemExpenseInformation) {
    const { parentChatReport, transactionParams, participantParams, policyParams = {}, recentlyUsedParams = {}, moneyRequestReportID = '' } = perDiemExpenseInformation;
    const { payeeAccountID = userAccountID, payeeEmail = currentUserEmail, participant } = participantParams;
    const { policy, policyCategories, policyTagList, policyRecentlyUsedCategories } = policyParams;
    const { destinations: recentlyUsedDestinations } = recentlyUsedParams;
    const { comment = '', currency, created, category, tag, customUnit, billable, attendees, reimbursable } = transactionParams;
    const amount = computePerDiemExpenseAmount(customUnit);
    const merchant = computePerDiemExpenseMerchant(customUnit, policy);
    const defaultComment = computeDefaultPerDiemExpenseComment(customUnit, currency);
    const finalComment = comment || defaultComment;
    const payerEmail = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(participant.login ?? '');
    const payerAccountID = Number(participant.accountID);
    const isPolicyExpenseChat = participant.isPolicyExpenseChat;
    // STEP 1: Get existing chat report OR build a new optimistic one
    let isNewChatReport = false;
    let chatReport = !(0, EmptyObject_1.isEmptyObject)(parentChatReport) && parentChatReport?.reportID ? parentChatReport : null;
    // If this is a policyExpenseChat, the chatReport must exist and we can get it from Onyx.
    // report is null if the flow is initiated from the global create menu. However, participant always stores the reportID if it exists, which is the case for policyExpenseChats
    if (!chatReport && isPolicyExpenseChat) {
        chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${participant.reportID}`] ?? null;
    }
    if (!chatReport) {
        chatReport = (0, ReportUtils_1.getChatByParticipants)([payerAccountID, payeeAccountID]) ?? null;
    }
    // If we still don't have a report, it likely doesn't exist and we need to build an optimistic one
    if (!chatReport) {
        isNewChatReport = true;
        chatReport = (0, ReportUtils_1.buildOptimisticChatReport)({
            participantList: [payerAccountID, payeeAccountID],
        });
    }
    // STEP 2: Get the Expense/IOU report. If the moneyRequestReportID has been provided, we want to add the transaction to this specific report.
    // If no such reportID has been provided, let's use the chatReport.iouReportID property. In case that is not present, build a new optimistic Expense/IOU report.
    let iouReport = null;
    if (moneyRequestReportID) {
        iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${moneyRequestReportID}`] ?? null;
    }
    else {
        iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.iouReportID}`] ?? null;
    }
    const shouldCreateNewMoneyRequestReport = (0, ReportUtils_1.shouldCreateNewMoneyRequestReport)(iouReport, chatReport, false);
    if (!iouReport || shouldCreateNewMoneyRequestReport) {
        iouReport = isPolicyExpenseChat
            ? (0, ReportUtils_1.buildOptimisticExpenseReport)(chatReport.reportID, chatReport.policyID, payeeAccountID, amount, currency)
            : (0, ReportUtils_1.buildOptimisticIOUReport)(payeeAccountID, payerAccountID, amount, chatReport.reportID, currency);
    }
    else if (isPolicyExpenseChat) {
        iouReport = { ...iouReport };
        // Because of the Expense reports are stored as negative values, we subtract the total from the amount
        if (iouReport?.currency === currency) {
            if (!Number.isNaN(iouReport.total) && iouReport.total !== undefined) {
                iouReport.total -= amount;
            }
            if (typeof iouReport.unheldTotal === 'number') {
                iouReport.unheldTotal -= amount;
            }
        }
    }
    else {
        iouReport = (0, IOUUtils_1.updateIOUOwnerAndTotal)(iouReport, payeeAccountID, amount, currency);
    }
    // STEP 3: Build an optimistic transaction
    const optimisticTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
        policy,
        transactionParams: {
            amount: (0, ReportUtils_1.isExpenseReport)(iouReport) ? -amount : amount,
            currency,
            reportID: iouReport.reportID,
            comment: finalComment,
            created,
            category,
            merchant,
            tag,
            customUnit,
            billable,
            reimbursable,
            pendingFields: { subRates: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
            attendees,
        },
    });
    // This is to differentiate between a normal expense and a per diem expense
    optimisticTransaction.iouRequestType = CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM;
    optimisticTransaction.hasEReceipt = true;
    const optimisticPolicyRecentlyUsedCategories = mergePolicyRecentlyUsedCategories(category, policyRecentlyUsedCategories);
    const optimisticPolicyRecentlyUsedTags = (0, Tag_1.buildOptimisticPolicyRecentlyUsedTags)(iouReport.policyID, tag);
    const optimisticPolicyRecentlyUsedCurrencies = (0, Policy_1.buildOptimisticRecentlyUsedCurrencies)(currency);
    const optimisticPolicyRecentlyUsedDestinations = customUnit.customUnitRateID ? [...new Set([customUnit.customUnitRateID, ...(recentlyUsedDestinations ?? [])])] : [];
    // STEP 4: Build optimistic reportActions. We need:
    // 1. CREATED action for the chatReport
    // 2. CREATED action for the iouReport
    // 3. IOU action for the iouReport
    // 4. The transaction thread, which requires the iouAction, and CREATED action for the transaction thread
    // 5. REPORT_PREVIEW action for the chatReport
    // Note: The CREATED action for the IOU report must be optimistically generated before the IOU action so there's no chance that it appears after the IOU action in the chat
    const [optimisticCreatedActionForChat, optimisticCreatedActionForIOUReport, iouAction, optimisticTransactionThread, optimisticCreatedActionForTransactionThread] = (0, ReportUtils_1.buildOptimisticMoneyRequestEntities)({
        iouReport,
        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
        amount,
        currency,
        comment,
        payeeEmail,
        participants: [participant],
        transactionID: optimisticTransaction.transactionID,
    });
    let reportPreviewAction = shouldCreateNewMoneyRequestReport ? null : getReportPreviewAction(chatReport.reportID, iouReport.reportID);
    if (reportPreviewAction) {
        reportPreviewAction = (0, ReportUtils_1.updateReportPreview)(iouReport, reportPreviewAction, false, comment, optimisticTransaction);
    }
    else {
        reportPreviewAction = (0, ReportUtils_1.buildOptimisticReportPreview)(chatReport, iouReport, comment, optimisticTransaction);
        chatReport.lastVisibleActionCreated = reportPreviewAction.created;
        // Generated ReportPreview action is a parent report action of the iou report.
        // We are setting the iou report's parentReportActionID to display subtitle correctly in IOU page when offline.
        iouReport.parentReportActionID = reportPreviewAction.reportActionID;
    }
    const shouldCreateOptimisticPersonalDetails = isNewChatReport && !allPersonalDetails[payerAccountID];
    // Add optimistic personal details for participant
    const optimisticPersonalDetailListAction = shouldCreateOptimisticPersonalDetails
        ? {
            [payerAccountID]: {
                accountID: payerAccountID,
                // Disabling this line since participant.displayName can be an empty string
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                displayName: (0, LocalePhoneNumber_1.formatPhoneNumber)(participant.displayName || payerEmail),
                login: participant.login,
                isOptimisticPersonalDetail: true,
            },
        }
        : {};
    const predictedNextStatus = policy?.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO ? CONST_1.default.REPORT.STATUS_NUM.CLOSED : CONST_1.default.REPORT.STATUS_NUM.OPEN;
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(iouReport, predictedNextStatus);
    // STEP 5: Build Onyx Data
    const [optimisticData, successData, failureData] = buildOnyxDataForMoneyRequest({
        isNewChatReport,
        shouldCreateNewMoneyRequestReport,
        policyParams: {
            policy,
            policyCategories,
            policyTagList,
        },
        optimisticParams: {
            chat: {
                report: chatReport,
                createdAction: optimisticCreatedActionForChat,
                reportPreviewAction,
            },
            iou: {
                report: iouReport,
                createdAction: optimisticCreatedActionForIOUReport,
                action: iouAction,
            },
            transactionParams: {
                transaction: optimisticTransaction,
                transactionThreadReport: optimisticTransactionThread,
                transactionThreadCreatedReportAction: optimisticCreatedActionForTransactionThread,
            },
            policyRecentlyUsed: {
                categories: optimisticPolicyRecentlyUsedCategories,
                tags: optimisticPolicyRecentlyUsedTags,
                currencies: optimisticPolicyRecentlyUsedCurrencies,
                destinations: optimisticPolicyRecentlyUsedDestinations,
            },
            personalDetailListAction: optimisticPersonalDetailListAction,
            nextStep: optimisticNextStep,
        },
    });
    return {
        payerAccountID,
        payerEmail,
        iouReport,
        chatReport,
        transaction: optimisticTransaction,
        iouAction,
        createdChatReportActionID: isNewChatReport ? optimisticCreatedActionForChat.reportActionID : undefined,
        createdIOUReportActionID: shouldCreateNewMoneyRequestReport ? optimisticCreatedActionForIOUReport.reportActionID : undefined,
        reportPreviewAction,
        transactionThreadReportID: optimisticTransactionThread?.reportID,
        createdReportActionIDForThread: optimisticCreatedActionForTransactionThread?.reportActionID,
        onyxData: {
            optimisticData,
            successData,
            failureData,
        },
        billable,
        reimbursable,
    };
}
/**
 * Gathers all the data needed to make an expense. It attempts to find existing reports, iouReports, and receipts. If it doesn't find them, then
 * it creates optimistic versions of them and uses those instead
 */
function getTrackExpenseInformation(params) {
    const { parentChatReport, moneyRequestReportID = '', existingTransactionID, participantParams, policyParams, transactionParams, retryParams } = params;
    const { payeeAccountID = userAccountID, payeeEmail = currentUserEmail, participant } = participantParams;
    const { policy, policyCategories, policyTagList } = policyParams;
    const { comment, amount, currency, created, distance, merchant, receipt, category, tag, taxCode, taxAmount, billable, linkedTrackedExpenseReportAction, attendees } = transactionParams;
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    const isPolicyExpenseChat = participant.isPolicyExpenseChat;
    // STEP 1: Get existing chat report
    let chatReport = !(0, EmptyObject_1.isEmptyObject)(parentChatReport) && parentChatReport?.reportID ? parentChatReport : null;
    // The chatReport always exists, and we can get it from Onyx if chatReport is null.
    if (!chatReport) {
        chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${participant.reportID}`] ?? null;
    }
    // If we still don't have a report, it likely doesn't exist, and we will early return here as it should not happen
    // Maybe later, we can build an optimistic selfDM chat.
    if (!chatReport) {
        return null;
    }
    // Check if the report is a draft
    const isDraftReportLocal = (0, ReportUtils_1.isDraftReport)(chatReport?.reportID);
    let createdWorkspaceParams;
    if (isDraftReportLocal) {
        const workspaceData = (0, Policy_1.buildPolicyData)({
            policyOwnerEmail: undefined,
            makeMeAdmin: policy?.makeMeAdmin,
            policyName: policy?.name,
            policyID: policy?.id,
            expenseReportId: chatReport?.reportID,
            engagementChoice: CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE,
        });
        createdWorkspaceParams = workspaceData.params;
        optimisticData.push(...workspaceData.optimisticData);
        successData.push(...workspaceData.successData);
        failureData.push(...workspaceData.failureData);
    }
    // STEP 2: If not in the self-DM flow, we need to use the expense report.
    // For this, first use the chatReport.iouReportID property. Build a new optimistic expense report if needed.
    const shouldUseMoneyReport = !!isPolicyExpenseChat;
    let iouReport = null;
    let shouldCreateNewMoneyRequestReport = false;
    if (shouldUseMoneyReport) {
        if (moneyRequestReportID) {
            iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${moneyRequestReportID}`] ?? null;
        }
        else {
            iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.iouReportID}`] ?? null;
        }
        const isScanRequest = (0, TransactionUtils_1.isScanRequest)({ amount, receipt });
        shouldCreateNewMoneyRequestReport = (0, ReportUtils_1.shouldCreateNewMoneyRequestReport)(iouReport, chatReport, isScanRequest);
        if (!iouReport || shouldCreateNewMoneyRequestReport) {
            iouReport = (0, ReportUtils_1.buildOptimisticExpenseReport)(chatReport.reportID, chatReport.policyID, payeeAccountID, amount, currency, amount);
        }
        else {
            iouReport = { ...iouReport };
            // Because of the Expense reports are stored as negative values, we subtract the total from the amount
            if (iouReport?.currency === currency) {
                if (!Number.isNaN(iouReport.total) && iouReport.total !== undefined && typeof iouReport.nonReimbursableTotal === 'number') {
                    iouReport.total -= amount;
                    iouReport.nonReimbursableTotal -= amount;
                }
                if (typeof iouReport.unheldTotal === 'number' && typeof iouReport.unheldNonReimbursableTotal === 'number') {
                    iouReport.unheldTotal -= amount;
                    iouReport.unheldNonReimbursableTotal -= amount;
                }
            }
        }
    }
    // If shouldUseMoneyReport is true, the iouReport was defined.
    // But we'll use the `shouldUseMoneyReport && iouReport` check further instead of `shouldUseMoneyReport` to avoid TS errors.
    // STEP 3: Build optimistic receipt and transaction
    const receiptObject = {};
    let filename;
    if (receipt?.source) {
        receiptObject.source = receipt.source;
        receiptObject.state = receipt.state ?? CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
        filename = receipt.name;
    }
    const existingTransaction = allTransactionDrafts[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${existingTransactionID ?? CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`];
    if (!filename) {
        filename = existingTransaction?.filename;
    }
    const isDistanceRequest = existingTransaction && (0, TransactionUtils_1.isDistanceRequest)(existingTransaction);
    const isManualDistanceRequest = existingTransaction && (0, TransactionUtils_1.isManualDistanceRequest)(existingTransaction);
    let optimisticTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
        existingTransactionID,
        existingTransaction,
        policy,
        transactionParams: {
            amount: -amount,
            currency,
            reportID: shouldUseMoneyReport && iouReport ? iouReport.reportID : CONST_1.default.REPORT.UNREPORTED_REPORT_ID,
            comment,
            distance,
            created,
            merchant,
            receipt: receiptObject,
            category,
            tag,
            taxCode,
            taxAmount,
            billable,
            pendingFields: isDistanceRequest && !isManualDistanceRequest ? { waypoints: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD } : undefined,
            reimbursable: false,
            filename,
            attendees,
        },
    });
    // If there is an existing transaction (which is the case for distance requests), then the data from the existing transaction
    // needs to be manually merged into the optimistic transaction. This is because buildOnyxDataForMoneyRequest() uses `Onyx.set()` for the transaction
    // data. This is a big can of worms to change it to `Onyx.merge()` as explored in https://expensify.slack.com/archives/C05DWUDHVK7/p1692139468252109.
    // I want to clean this up at some point, but it's possible this will live in the code for a while so I've created https://github.com/Expensify/App/issues/25417
    // to remind me to do this.
    if (isDistanceRequest) {
        optimisticTransaction = (0, expensify_common_1.fastMerge)(existingTransaction, optimisticTransaction, false);
    }
    // STEP 4: Build optimistic reportActions. We need:
    // 1. CREATED action for the iouReport (if tracking in the Expense chat)
    // 2. IOU action for the iouReport (if tracking in the Expense chat), otherwise – for chatReport
    // 3. The transaction thread, which requires the iouAction, and CREATED action for the transaction thread
    // 4. REPORT_PREVIEW action for the chatReport (if tracking in the Expense chat)
    const [, optimisticCreatedActionForIOUReport, iouAction, optimisticTransactionThread, optimisticCreatedActionForTransactionThread] = (0, ReportUtils_1.buildOptimisticMoneyRequestEntities)({
        iouReport: shouldUseMoneyReport && iouReport ? iouReport : chatReport,
        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK,
        amount,
        currency,
        comment,
        payeeEmail,
        participants: [participant],
        transactionID: optimisticTransaction.transactionID,
        isPersonalTrackingExpense: !shouldUseMoneyReport,
        existingTransactionThreadReportID: linkedTrackedExpenseReportAction?.childReportID,
        linkedTrackedExpenseReportAction,
    });
    let reportPreviewAction = null;
    if (shouldUseMoneyReport && iouReport) {
        reportPreviewAction = shouldCreateNewMoneyRequestReport ? null : getReportPreviewAction(chatReport.reportID, iouReport.reportID);
        if (reportPreviewAction) {
            reportPreviewAction = (0, ReportUtils_1.updateReportPreview)(iouReport, reportPreviewAction, false, comment, optimisticTransaction);
        }
        else {
            reportPreviewAction = (0, ReportUtils_1.buildOptimisticReportPreview)(chatReport, iouReport, comment, optimisticTransaction);
            // Generated ReportPreview action is a parent report action of the iou report.
            // We are setting the iou report's parentReportActionID to display subtitle correctly in IOU page when offline.
            iouReport.parentReportActionID = reportPreviewAction.reportActionID;
        }
    }
    let actionableTrackExpenseWhisper = null;
    if (!isPolicyExpenseChat) {
        actionableTrackExpenseWhisper = (0, ReportUtils_1.buildOptimisticActionableTrackExpenseWhisper)(iouAction, optimisticTransaction.transactionID);
    }
    // STEP 5: Build Onyx Data
    const trackExpenseOnyxData = buildOnyxDataForTrackExpense({
        participant,
        chat: { report: chatReport, previewAction: reportPreviewAction },
        iou: { report: iouReport, action: iouAction, createdAction: optimisticCreatedActionForIOUReport },
        transactionParams: {
            transaction: optimisticTransaction,
            threadCreatedReportAction: optimisticCreatedActionForTransactionThread,
            threadReport: optimisticTransactionThread ?? {},
        },
        policyParams: { policy, tagList: policyTagList, categories: policyCategories },
        shouldCreateNewMoneyRequestReport,
        actionableTrackExpenseWhisper,
        retryParams,
    });
    return {
        createdWorkspaceParams,
        chatReport,
        iouReport: iouReport ?? undefined,
        transaction: optimisticTransaction,
        iouAction,
        createdIOUReportActionID: shouldCreateNewMoneyRequestReport ? optimisticCreatedActionForIOUReport.reportActionID : undefined,
        reportPreviewAction: reportPreviewAction ?? undefined,
        transactionThreadReportID: optimisticTransactionThread.reportID,
        createdReportActionIDForThread: optimisticCreatedActionForTransactionThread?.reportActionID,
        actionableWhisperReportActionIDParam: actionableTrackExpenseWhisper?.reportActionID,
        onyxData: {
            optimisticData: optimisticData.concat(trackExpenseOnyxData[0]),
            successData: successData.concat(trackExpenseOnyxData[1]),
            failureData: failureData.concat(trackExpenseOnyxData[2]),
        },
    };
}
/**
 * Compute the diff amount when we update the transaction
 */
function calculateDiffAmount(iouReport, updatedTransaction, transaction) {
    if (!iouReport) {
        return 0;
    }
    const isExpenseReportLocal = (0, ReportUtils_1.isExpenseReport)(iouReport);
    const updatedCurrency = (0, TransactionUtils_1.getCurrency)(updatedTransaction);
    const currentCurrency = (0, TransactionUtils_1.getCurrency)(transaction);
    const currentAmount = (0, TransactionUtils_1.getAmount)(transaction, isExpenseReportLocal);
    const updatedAmount = (0, TransactionUtils_1.getAmount)(updatedTransaction, isExpenseReportLocal);
    if (updatedCurrency === currentCurrency && currentAmount === updatedAmount) {
        return 0;
    }
    if (updatedCurrency === iouReport.currency && currentCurrency === iouReport.currency) {
        // Calculate the diff between the updated amount and the current amount if the currency of the updated and current transactions have the same currency as the report
        return updatedAmount - currentAmount;
    }
    return null;
}
/**
 * @param transactionID
 * @param transactionThreadReportID
 * @param transactionChanges
 * @param [transactionChanges.created] Present when updated the date field
 * @param policy  May be undefined, an empty object, or an object matching the Policy type (src/types/onyx/Policy.ts)
 * @param policyTagList
 * @param policyCategories
 */
function getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories, violations, hash) {
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    // Step 1: Set any "pending fields" (ones updated while the user was offline) to have error messages in the failureData
    const pendingFields = Object.fromEntries(Object.keys(transactionChanges).map((key) => [key, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE]));
    const clearedPendingFields = Object.fromEntries(Object.keys(transactionChanges).map((key) => [key, null]));
    const errorFields = Object.fromEntries(Object.keys(pendingFields).map((key) => [key, { [DateUtils_1.default.getMicroseconds()]: Localize.translateLocal('iou.error.genericEditFailureMessage') }]));
    // Step 2: Get all the collections being updated
    const transactionThread = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`] ?? null;
    const transaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    const isTransactionOnHold = (0, TransactionUtils_1.isOnHold)(transaction);
    const iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread?.parentReportID}`] ?? null;
    const isFromExpenseReport = (0, ReportUtils_1.isExpenseReport)(iouReport);
    const updatedTransaction = transaction
        ? (0, TransactionUtils_1.getUpdatedTransaction)({
            transaction,
            transactionChanges,
            isFromExpenseReport,
            policy,
        })
        : undefined;
    const transactionDetails = (0, ReportUtils_1.getTransactionDetails)(updatedTransaction);
    if (transactionDetails?.waypoints) {
        // This needs to be a JSON string since we're sending this to the MapBox API
        transactionDetails.waypoints = JSON.stringify(transactionDetails.waypoints);
    }
    const dataToIncludeInParams = Object.fromEntries(Object.entries(transactionDetails ?? {}).filter(([key]) => Object.keys(transactionChanges).includes(key)));
    const params = {
        ...dataToIncludeInParams,
        reportID: iouReport?.reportID,
        transactionID,
    };
    const hasPendingWaypoints = 'waypoints' in transactionChanges;
    const hasModifiedDistanceRate = 'customUnitRateID' in transactionChanges;
    const hasModifiedCreated = 'created' in transactionChanges;
    const hasModifiedAmount = 'amount' in transactionChanges;
    if (transaction && updatedTransaction && (hasPendingWaypoints || hasModifiedDistanceRate)) {
        // Delete the draft transaction when editing waypoints when the server responds successfully and there are no errors
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`,
            value: null,
        });
        // Revert the transaction's amount to the original value on failure.
        // The IOU Report will be fully reverted in the failureData further below.
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                amount: transaction.amount,
                modifiedAmount: transaction.modifiedAmount,
                modifiedMerchant: transaction.modifiedMerchant,
                modifiedCurrency: transaction.modifiedCurrency,
            },
        });
    }
    // Step 3: Build the modified expense report actions
    // We don't create a modified report action if:
    // - we're updating the waypoints
    // - we're updating the distance rate while the waypoints are still pending
    // In these cases, there isn't a valid optimistic mileage data we can use,
    // and the report action is created on the server with the distance-related response from the MapBox API
    const updatedReportAction = (0, ReportUtils_1.buildOptimisticModifiedExpenseReportAction)(transactionThread, transaction, transactionChanges, isFromExpenseReport, policy, updatedTransaction);
    if (!hasPendingWaypoints && !(hasModifiedDistanceRate && (0, TransactionUtils_1.isFetchingWaypointsFromServer)(transaction))) {
        params.reportActionID = updatedReportAction.reportActionID;
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThread?.reportID}`,
            value: {
                [updatedReportAction.reportActionID]: updatedReportAction,
            },
        });
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread?.reportID}`,
            value: {
                lastReadTime: updatedReportAction.created,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread?.reportID}`,
            value: {
                lastReadTime: transactionThread?.lastReadTime,
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThread?.reportID}`,
            value: {
                [updatedReportAction.reportActionID]: { pendingAction: null },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThread?.reportID}`,
            value: {
                [updatedReportAction.reportActionID]: {
                    ...updatedReportAction,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericEditFailureMessage'),
                },
            },
        });
    }
    // Step 4: Compute the IOU total and update the report preview message (and report header) so LHN amount owed is correct.
    const calculatedDiffAmount = calculateDiffAmount(iouReport, updatedTransaction, transaction);
    // If calculatedDiffAmount is null it means we cannot calculate the new iou report total from front-end due to currency differences.
    const isTotalIndeterminate = calculatedDiffAmount === null;
    const diff = calculatedDiffAmount ?? 0;
    let updatedMoneyRequestReport;
    if (!iouReport) {
        updatedMoneyRequestReport = null;
    }
    else if (((0, ReportUtils_1.isExpenseReport)(iouReport) || (0, ReportUtils_1.isInvoiceReport)(iouReport)) && !Number.isNaN(iouReport.total) && iouReport.total !== undefined) {
        // For expense report, the amount is negative, so we should subtract total from diff
        updatedMoneyRequestReport = {
            ...iouReport,
            total: iouReport.total - diff,
        };
        if (!transaction?.reimbursable && typeof updatedMoneyRequestReport.nonReimbursableTotal === 'number') {
            updatedMoneyRequestReport.nonReimbursableTotal -= diff;
        }
        if (updatedTransaction && transaction?.reimbursable !== updatedTransaction?.reimbursable && typeof updatedMoneyRequestReport.nonReimbursableTotal === 'number') {
            updatedMoneyRequestReport.nonReimbursableTotal += updatedTransaction.reimbursable ? -updatedTransaction.amount : updatedTransaction.amount;
        }
        if (!isTransactionOnHold) {
            if (typeof updatedMoneyRequestReport.unheldTotal === 'number') {
                updatedMoneyRequestReport.unheldTotal -= diff;
            }
            if (!transaction?.reimbursable && typeof updatedMoneyRequestReport.unheldNonReimbursableTotal === 'number') {
                updatedMoneyRequestReport.unheldNonReimbursableTotal -= diff;
            }
            if (updatedTransaction && transaction?.reimbursable !== updatedTransaction?.reimbursable && typeof updatedMoneyRequestReport.unheldNonReimbursableTotal === 'number') {
                updatedMoneyRequestReport.unheldNonReimbursableTotal += updatedTransaction.reimbursable ? -updatedTransaction.amount : updatedTransaction.amount;
            }
        }
    }
    else {
        updatedMoneyRequestReport = (0, IOUUtils_1.updateIOUOwnerAndTotal)(iouReport, updatedReportAction.actorAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, diff, (0, TransactionUtils_1.getCurrency)(transaction), false, true, isTransactionOnHold);
    }
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
        value: { ...updatedMoneyRequestReport, ...(isTotalIndeterminate && { pendingFields: { total: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE } }) },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.parentReportID}`,
        value: (0, ReportUtils_1.getOutstandingChildRequest)(updatedMoneyRequestReport),
    });
    if ((0, ReportUtils_1.isOneTransactionThread)(transactionThread ?? undefined, iouReport ?? undefined, undefined)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
            value: {
                lastReadTime: updatedReportAction.created,
            },
        });
    }
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
        value: { pendingAction: null, ...(isTotalIndeterminate && { pendingFields: { total: null } }) },
    });
    // Optimistically modify the transaction and the transaction thread
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
        value: {
            ...updatedTransaction,
            pendingFields,
            errorFields: null,
        },
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`,
        value: {
            lastActorAccountID: updatedReportAction.actorAccountID,
        },
    });
    if ((0, TransactionUtils_1.isScanning)(transaction) && ('amount' in transactionChanges || 'currency' in transactionChanges)) {
        if (transactionThread?.parentReportActionID) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
                value: {
                    [transactionThread?.parentReportActionID]: {
                        originalMessage: {
                            whisperedTo: [],
                        },
                    },
                },
            });
        }
        if (iouReport?.parentReportActionID) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.parentReportID}`,
                value: {
                    [iouReport.parentReportActionID]: {
                        originalMessage: {
                            whisperedTo: [],
                        },
                    },
                },
            });
        }
    }
    // Update recently used categories if the category is changed
    const hasModifiedCategory = 'category' in transactionChanges;
    if (hasModifiedCategory) {
        const optimisticPolicyRecentlyUsedCategories = (0, Category_1.buildOptimisticPolicyRecentlyUsedCategories)(iouReport?.policyID, transactionChanges.category);
        if (optimisticPolicyRecentlyUsedCategories.length) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES}${iouReport?.policyID}`,
                value: optimisticPolicyRecentlyUsedCategories,
            });
        }
    }
    // Update recently used currencies if the currency is changed
    if ('currency' in transactionChanges) {
        const optimisticRecentlyUsedCurrencies = (0, Policy_1.buildOptimisticRecentlyUsedCurrencies)(transactionChanges.currency);
        if (optimisticRecentlyUsedCurrencies.length) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.RECENTLY_USED_CURRENCIES,
                value: optimisticRecentlyUsedCurrencies,
            });
        }
    }
    // Update recently used categories if the tag is changed
    const hasModifiedTag = 'tag' in transactionChanges;
    if (hasModifiedTag) {
        const optimisticPolicyRecentlyUsedTags = (0, Tag_1.buildOptimisticPolicyRecentlyUsedTags)(iouReport?.policyID, transactionChanges.tag);
        if (!(0, EmptyObject_1.isEmptyObject)(optimisticPolicyRecentlyUsedTags)) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_TAGS}${iouReport?.policyID}`,
                value: optimisticPolicyRecentlyUsedTags,
            });
        }
    }
    const overLimitViolation = violations?.find((violation) => violation.name === 'overLimit');
    // Update violation limit, if we modify attendees. The given limit value is for a single attendee, if we have multiple attendees we should multiply limit by attendee count
    if ('attendees' in transactionChanges && !!overLimitViolation) {
        const limitForSingleAttendee = ViolationsUtils_1.default.getViolationAmountLimit(overLimitViolation);
        if (limitForSingleAttendee * (transactionChanges?.attendees?.length ?? 1) > Math.abs((0, TransactionUtils_1.getAmount)(transaction))) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
                value: violations?.filter((violation) => violation.name !== 'overLimit') ?? [],
            });
        }
    }
    if (Array.isArray(params?.attendees)) {
        params.attendees = JSON.stringify(params?.attendees);
    }
    // Clear out the error fields and loading states on success
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
        value: {
            pendingFields: clearedPendingFields,
            isLoading: false,
            errorFields: null,
            routes: null,
        },
    });
    // Clear out loading states, pending fields, and add the error fields
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
        value: {
            ...transaction,
            pendingFields: clearedPendingFields,
            isLoading: false,
            errorFields,
        },
    });
    if (iouReport) {
        // Reset the iouReport to its original state
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`,
            value: { ...iouReport, ...(isTotalIndeterminate && { pendingFields: { total: null } }) },
        });
    }
    const hasModifiedCurrency = 'currency' in transactionChanges;
    const hasModifiedComment = 'comment' in transactionChanges;
    const hasModifiedReimbursable = 'reimbursable' in transactionChanges;
    const hasModifiedTaxCode = 'taxCode' in transactionChanges;
    const hasModifiedDate = 'date' in transactionChanges;
    const isInvoice = (0, ReportUtils_1.isInvoiceReport)(iouReport);
    if (policy &&
        (0, PolicyUtils_1.isPaidGroupPolicy)(policy) &&
        !isInvoice &&
        updatedTransaction &&
        (hasModifiedTag ||
            hasModifiedCategory ||
            hasModifiedComment ||
            hasModifiedDistanceRate ||
            hasModifiedDate ||
            hasModifiedCurrency ||
            hasModifiedAmount ||
            hasModifiedCreated ||
            hasModifiedReimbursable ||
            hasModifiedTaxCode)) {
        const currentTransactionViolations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? [];
        // If the amount, currency or date have been modified, we remove the duplicate violations since they would be out of date as the transaction has changed
        const optimisticViolations = hasModifiedAmount || hasModifiedDate || hasModifiedCurrency
            ? currentTransactionViolations.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION)
            : currentTransactionViolations;
        const violationsOnyxData = ViolationsUtils_1.default.getViolationsOnyxData(updatedTransaction, optimisticViolations, policy, policyTagList ?? {}, policyCategories ?? {}, (0, PolicyUtils_1.hasDependentTags)(policy, policyTagList ?? {}), isInvoice);
        optimisticData.push(violationsOnyxData);
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: currentTransactionViolations,
        });
        if (hash) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
                value: {
                    data: {
                        [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`]: violationsOnyxData.value,
                    },
                },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
                value: {
                    data: {
                        [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`]: currentTransactionViolations,
                    },
                },
            });
        }
        if (violationsOnyxData &&
            ((iouReport?.statusNum ?? CONST_1.default.REPORT.STATUS_NUM.OPEN) === CONST_1.default.REPORT.STATUS_NUM.OPEN ||
                (hasModifiedReimbursable && iouReport?.statusNum === CONST_1.default.REPORT.STATUS_NUM.SUBMITTED))) {
            const currentNextStep = allNextSteps[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${iouReport?.reportID}`] ?? {};
            const shouldFixViolations = Array.isArray(violationsOnyxData.value) && violationsOnyxData.value.length > 0;
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${iouReport?.reportID}`,
                value: (0, NextStepUtils_1.buildNextStep)(updatedMoneyRequestReport ?? iouReport ?? undefined, iouReport?.statusNum ?? CONST_1.default.REPORT.STATUS_NUM.OPEN, shouldFixViolations),
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${iouReport?.reportID}`,
                value: currentNextStep,
            });
        }
    }
    // Reset the transaction thread to its original state
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`,
        value: transactionThread,
    });
    return {
        params,
        onyxData: { optimisticData, successData, failureData },
    };
}
/**
 * @param transactionID
 * @param transactionThreadReportID
 * @param transactionChanges
 * @param [transactionChanges.created] Present when updated the date field
 * @param policy  May be undefined, an empty object, or an object matching the Policy type (src/types/onyx/Policy.ts)
 */
function getUpdateTrackExpenseParams(transactionID, transactionThreadReportID, transactionChanges, policy) {
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    // Step 1: Set any "pending fields" (ones updated while the user was offline) to have error messages in the failureData
    const pendingFields = Object.fromEntries(Object.keys(transactionChanges).map((key) => [key, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE]));
    const clearedPendingFields = Object.fromEntries(Object.keys(transactionChanges).map((key) => [key, null]));
    const errorFields = Object.fromEntries(Object.keys(pendingFields).map((key) => [key, { [DateUtils_1.default.getMicroseconds()]: Localize.translateLocal('iou.error.genericEditFailureMessage') }]));
    // Step 2: Get all the collections being updated
    const transactionThread = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`] ?? null;
    const transaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThread?.parentReportID}`] ?? null;
    const updatedTransaction = transaction
        ? (0, TransactionUtils_1.getUpdatedTransaction)({
            transaction,
            transactionChanges,
            isFromExpenseReport: false,
            policy,
        })
        : null;
    const transactionDetails = (0, ReportUtils_1.getTransactionDetails)(updatedTransaction);
    if (transactionDetails?.waypoints) {
        // This needs to be a JSON string since we're sending this to the MapBox API
        transactionDetails.waypoints = JSON.stringify(transactionDetails.waypoints);
    }
    const dataToIncludeInParams = Object.fromEntries(Object.entries(transactionDetails ?? {}).filter(([key]) => Object.keys(transactionChanges).includes(key)));
    const params = {
        ...dataToIncludeInParams,
        reportID: chatReport?.reportID,
        transactionID,
    };
    const hasPendingWaypoints = 'waypoints' in transactionChanges;
    const hasModifiedDistanceRate = 'customUnitRateID' in transactionChanges;
    if (transaction && updatedTransaction && (hasPendingWaypoints || hasModifiedDistanceRate)) {
        // Delete the draft transaction when editing waypoints when the server responds successfully and there are no errors
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`,
            value: null,
        });
        // Revert the transaction's amount to the original value on failure.
        // The IOU Report will be fully reverted in the failureData further below.
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                amount: transaction.amount,
                modifiedAmount: transaction.modifiedAmount,
                modifiedMerchant: transaction.modifiedMerchant,
            },
        });
    }
    // Step 3: Build the modified expense report actions
    // We don't create a modified report action if:
    // - we're updating the waypoints
    // - we're updating the distance rate while the waypoints are still pending
    // In these cases, there isn't a valid optimistic mileage data we can use,
    // and the report action is created on the server with the distance-related response from the MapBox API
    const updatedReportAction = (0, ReportUtils_1.buildOptimisticModifiedExpenseReportAction)(transactionThread, transaction, transactionChanges, false, policy, updatedTransaction);
    if (!hasPendingWaypoints && !(hasModifiedDistanceRate && (0, TransactionUtils_1.isFetchingWaypointsFromServer)(transaction))) {
        params.reportActionID = updatedReportAction.reportActionID;
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThread?.reportID}`,
            value: {
                [updatedReportAction.reportActionID]: updatedReportAction,
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThread?.reportID}`,
            value: {
                [updatedReportAction.reportActionID]: { pendingAction: null },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThread?.reportID}`,
            value: {
                [updatedReportAction.reportActionID]: {
                    ...updatedReportAction,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericEditFailureMessage'),
                },
            },
        });
    }
    // Step 4: Update the report preview message (and report header) so LHN amount tracked is correct.
    // Optimistically modify the transaction and the transaction thread
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
        value: {
            ...updatedTransaction,
            pendingFields,
            errorFields: null,
        },
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`,
        value: {
            lastActorAccountID: updatedReportAction.actorAccountID,
        },
    });
    if ((0, TransactionUtils_1.isScanning)(transaction) && transactionThread?.parentReportActionID && ('amount' in transactionChanges || 'currency' in transactionChanges)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: { [transactionThread.parentReportActionID]: { originalMessage: { whisperedTo: [] } } },
        });
    }
    // Clear out the error fields and loading states on success
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
        value: {
            pendingFields: clearedPendingFields,
            isLoading: false,
            errorFields: null,
            routes: null,
        },
    });
    // Clear out loading states, pending fields, and add the error fields
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
        value: {
            ...transaction,
            pendingFields: clearedPendingFields,
            isLoading: false,
            errorFields,
        },
    });
    // Reset the transaction thread to its original state
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`,
        value: transactionThread,
    });
    return {
        params,
        onyxData: { optimisticData, successData, failureData },
    };
}
/** Updates the created date of an expense */
function updateMoneyRequestDate(transactionID, transactionThreadReportID, transactions, transactionViolations, value, policy, policyTags, policyCategories) {
    const transactionChanges = {
        created: value,
    };
    const transactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`] ?? null;
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.parentReportID}`] ?? null;
    let data;
    if ((0, ReportUtils_1.isTrackExpenseReport)(transactionThreadReport) && (0, ReportUtils_1.isSelfDM)(parentReport)) {
        data = getUpdateTrackExpenseParams(transactionID, transactionThreadReportID, transactionChanges, policy);
    }
    else {
        data = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTags, policyCategories);
        (0, TransactionUtils_1.removeTransactionFromDuplicateTransactionViolation)(data.onyxData, transactionID, transactions, transactionViolations);
    }
    const { params, onyxData } = data;
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_DATE, params, onyxData);
}
/** Updates the billable field of an expense */
function updateMoneyRequestBillable(transactionID, transactionThreadReportID, value, policy, policyTagList, policyCategories) {
    if (!transactionID || !transactionThreadReportID) {
        return;
    }
    const transactionChanges = {
        billable: value,
    };
    const { params, onyxData } = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories);
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_BILLABLE, params, onyxData);
}
function updateMoneyRequestReimbursable(transactionID, transactionThreadReportID, value, policy, policyTagList, policyCategories) {
    if (!transactionID || !transactionThreadReportID) {
        return;
    }
    const transactionChanges = {
        reimbursable: value,
    };
    const { params, onyxData } = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories);
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_REIMBURSABLE, params, onyxData);
}
/** Updates the merchant field of an expense */
function updateMoneyRequestMerchant(transactionID, transactionThreadReportID, value, policy, policyTagList, policyCategories) {
    const transactionChanges = {
        merchant: value,
    };
    const transactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`] ?? null;
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.parentReportID}`] ?? null;
    let data;
    if ((0, ReportUtils_1.isTrackExpenseReport)(transactionThreadReport) && (0, ReportUtils_1.isSelfDM)(parentReport)) {
        data = getUpdateTrackExpenseParams(transactionID, transactionThreadReportID, transactionChanges, policy);
    }
    else {
        data = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories);
    }
    const { params, onyxData } = data;
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_MERCHANT, params, onyxData);
}
/** Updates the attendees list of an expense */
function updateMoneyRequestAttendees(transactionID, transactionThreadReportID, attendees, policy, policyTagList, policyCategories, violations) {
    const transactionChanges = {
        attendees,
    };
    const data = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories, violations);
    const { params, onyxData } = data;
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_ATTENDEES, params, onyxData);
}
/** Updates the tag of an expense */
function updateMoneyRequestTag(transactionID, transactionThreadReportID, tag, policy, policyTagList, policyCategories, hash) {
    const transactionChanges = {
        tag,
    };
    const { params, onyxData } = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories, undefined, hash);
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_TAG, params, onyxData);
}
/** Updates the created tax amount of an expense */
function updateMoneyRequestTaxAmount(transactionID, optimisticReportActionID, taxAmount, policy, policyTagList, policyCategories) {
    const transactionChanges = {
        taxAmount,
    };
    const { params, onyxData } = getUpdateMoneyRequestParams(transactionID, optimisticReportActionID, transactionChanges, policy, policyTagList, policyCategories);
    API.write('UpdateMoneyRequestTaxAmount', params, onyxData);
}
/** Updates the created tax rate of an expense */
function updateMoneyRequestTaxRate({ transactionID, optimisticReportActionID, taxCode, taxAmount, policy, policyTagList, policyCategories }) {
    const transactionChanges = {
        taxCode,
        taxAmount,
    };
    const { params, onyxData } = getUpdateMoneyRequestParams(transactionID, optimisticReportActionID, transactionChanges, policy, policyTagList, policyCategories);
    API.write('UpdateMoneyRequestTaxRate', params, onyxData);
}
/** Updates the waypoints of a distance expense */
function updateMoneyRequestDistance({ transactionID, transactionThreadReportID, waypoints, routes = undefined, policy = {}, policyTagList = {}, policyCategories = {}, transactionBackup, }) {
    const transactionChanges = {
        waypoints: (0, Transaction_1.sanitizeRecentWaypoints)(waypoints),
        routes,
    };
    const transactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`] ?? null;
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.parentReportID}`] ?? null;
    let data;
    if ((0, ReportUtils_1.isTrackExpenseReport)(transactionThreadReport) && (0, ReportUtils_1.isSelfDM)(parentReport)) {
        data = getUpdateTrackExpenseParams(transactionID, transactionThreadReportID, transactionChanges, policy);
    }
    else {
        data = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories);
    }
    const { params, onyxData } = data;
    const recentServerValidatedWaypoints = (0, Transaction_1.getRecentWaypoints)().filter((item) => !item.pendingAction);
    onyxData?.failureData?.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.NVP_RECENT_WAYPOINTS}`,
        value: recentServerValidatedWaypoints,
    });
    if (transactionBackup) {
        const transaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
        // We need to include all keys of the optimisticData's waypoints in the failureData for onyx merge to properly reset
        // waypoint keys that do not exist in the failureData's waypoints. For instance, if the optimisticData waypoints had
        // three keys and the failureData waypoint had only 2 keys then the third key that doesn't exist in the failureData
        // waypoints should be explicitly reset otherwise onyx merge will leave it intact.
        const allWaypointKeys = [...new Set([...Object.keys(transactionBackup.comment?.waypoints ?? {}), ...Object.keys(transaction?.comment?.waypoints ?? {})])];
        const onyxWaypoints = allWaypointKeys.reduce((acc, key) => {
            acc[key] = transactionBackup.comment?.waypoints?.[key] ? { ...transactionBackup.comment?.waypoints?.[key] } : null;
            return acc;
        }, {});
        const allModifiedWaypointsKeys = [...new Set([...Object.keys(waypoints ?? {}), ...Object.keys(transaction?.modifiedWaypoints ?? {})])];
        const onyxModifiedWaypoints = allModifiedWaypointsKeys.reduce((acc, key) => {
            acc[key] = transactionBackup.modifiedWaypoints?.[key] ? { ...transactionBackup.modifiedWaypoints?.[key] } : null;
            return acc;
        }, {});
        onyxData?.failureData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                comment: {
                    waypoints: onyxWaypoints,
                    customUnit: {
                        quantity: transactionBackup?.comment?.customUnit?.quantity,
                    },
                },
                modifiedWaypoints: onyxModifiedWaypoints,
                routes: null,
            },
        });
    }
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_DISTANCE, params, onyxData);
}
/** Updates the category of an expense */
function updateMoneyRequestCategory(transactionID, transactionThreadReportID, category, policy, policyTagList, policyCategories, hash) {
    const transactionChanges = {
        category,
    };
    const { params, onyxData } = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories, undefined, hash);
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_CATEGORY, params, onyxData);
}
/** Updates the description of an expense */
function updateMoneyRequestDescription(transactionID, transactionThreadReportID, comment, policy, policyTagList, policyCategories) {
    const parsedComment = (0, ReportUtils_1.getParsedComment)(comment);
    const transactionChanges = {
        comment: parsedComment,
    };
    const transactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`] ?? null;
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.parentReportID}`] ?? null;
    let data;
    if ((0, ReportUtils_1.isTrackExpenseReport)(transactionThreadReport) && (0, ReportUtils_1.isSelfDM)(parentReport)) {
        data = getUpdateTrackExpenseParams(transactionID, transactionThreadReportID, transactionChanges, policy);
    }
    else {
        data = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories);
    }
    const { params, onyxData } = data;
    params.description = parsedComment;
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_DESCRIPTION, params, onyxData);
}
/** Updates the distance rate of an expense */
function updateMoneyRequestDistanceRate(transactionID, transactionThreadReportID, rateID, policy, policyTagList, policyCategories, updatedTaxAmount, updatedTaxCode) {
    const transactionChanges = {
        customUnitRateID: rateID,
        ...(typeof updatedTaxAmount === 'number' ? { taxAmount: updatedTaxAmount } : {}),
        ...(updatedTaxCode ? { taxCode: updatedTaxCode } : {}),
    };
    const transactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`] ?? null;
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.parentReportID}`] ?? null;
    const transaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    if (transaction) {
        const existingDistanceUnit = transaction?.comment?.customUnit?.distanceUnit;
        const newDistanceUnit = DistanceRequestUtils_1.default.getRateByCustomUnitRateID({ customUnitRateID: rateID, policy })?.unit;
        // If the distanceUnit is set and the rate is changed to one that has a different unit, mark the merchant as modified to make the distance field pending
        if (existingDistanceUnit && newDistanceUnit && newDistanceUnit !== existingDistanceUnit) {
            transactionChanges.merchant = (0, TransactionUtils_1.getMerchant)(transaction);
        }
    }
    let data;
    if ((0, ReportUtils_1.isTrackExpenseReport)(transactionThreadReport) && (0, ReportUtils_1.isSelfDM)(parentReport)) {
        data = getUpdateTrackExpenseParams(transactionID, transactionThreadReportID, transactionChanges, policy);
    }
    else {
        data = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList, policyCategories);
    }
    const { params, onyxData } = data;
    // `taxAmount` & `taxCode` only needs to be updated in the optimistic data, so we need to remove them from the params
    const { taxAmount, taxCode, ...paramsWithoutTaxUpdated } = params;
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_DISTANCE_RATE, paramsWithoutTaxUpdated, onyxData);
}
const getConvertTrackedExpenseInformation = (transactionID, actionableWhisperReportActionID, moneyRequestReportID, linkedTrackedExpenseReportAction, linkedTrackedExpenseReportID, transactionThreadReportID, resolution) => {
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    // Delete the transaction from the track expense report
    const { optimisticData: deleteOptimisticData, successData: deleteSuccessData, failureData: deleteFailureData, } = getDeleteTrackExpenseInformation(linkedTrackedExpenseReportID, transactionID, linkedTrackedExpenseReportAction, false, true, actionableWhisperReportActionID, resolution);
    optimisticData?.push(...deleteOptimisticData);
    successData?.push(...deleteSuccessData);
    failureData?.push(...deleteFailureData);
    // Build modified expense report action with the transaction changes
    const modifiedExpenseReportAction = (0, ReportUtils_1.buildOptimisticMovedTransactionAction)(transactionThreadReportID, moneyRequestReportID ?? CONST_1.default.REPORT.UNREPORTED_REPORT_ID);
    optimisticData?.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
        value: {
            [modifiedExpenseReportAction.reportActionID]: modifiedExpenseReportAction,
        },
    });
    successData?.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
        value: {
            [modifiedExpenseReportAction.reportActionID]: { pendingAction: null },
        },
    });
    failureData?.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
        value: {
            [modifiedExpenseReportAction.reportActionID]: {
                ...modifiedExpenseReportAction,
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericEditFailureMessage'),
            },
        },
    });
    return { optimisticData, successData, failureData, modifiedExpenseReportActionID: modifiedExpenseReportAction.reportActionID };
};
function addTrackedExpenseToPolicy(parameters, onyxData) {
    API.write(types_1.WRITE_COMMANDS.ADD_TRACKED_EXPENSE_TO_POLICY, parameters, onyxData);
}
function convertTrackedExpenseToRequest(convertTrackedExpenseParams) {
    const { payerParams, transactionParams, chatParams, iouParams, onyxData, workspaceParams } = convertTrackedExpenseParams;
    const { accountID: payerAccountID, email: payerEmail } = payerParams;
    const { transactionID, actionableWhisperReportActionID, linkedTrackedExpenseReportAction, linkedTrackedExpenseReportID, amount, distance, currency, comment, merchant, created, attendees, transactionThreadReportID, } = transactionParams;
    const { optimisticData: convertTransactionOptimisticData = [], successData: convertTransactionSuccessData = [], failureData: convertTransactionFailureData = [] } = onyxData;
    const { optimisticData, successData, failureData, modifiedExpenseReportActionID } = getConvertTrackedExpenseInformation(transactionID, actionableWhisperReportActionID, iouParams.reportID, linkedTrackedExpenseReportAction, linkedTrackedExpenseReportID, transactionThreadReportID, CONST_1.default.IOU.ACTION.SUBMIT);
    optimisticData?.push(...convertTransactionOptimisticData);
    successData?.push(...convertTransactionSuccessData);
    failureData?.push(...convertTransactionFailureData);
    if (workspaceParams) {
        const params = {
            amount,
            distance,
            currency,
            comment,
            created,
            merchant,
            reimbursable: true,
            transactionID,
            actionableWhisperReportActionID,
            moneyRequestReportID: iouParams.reportID,
            moneyRequestCreatedReportActionID: iouParams.createdReportActionID,
            moneyRequestPreviewReportActionID: iouParams.reportActionID,
            modifiedExpenseReportActionID,
            reportPreviewReportActionID: chatParams.reportPreviewReportActionID,
            ...workspaceParams,
        };
        addTrackedExpenseToPolicy(params, { optimisticData, successData, failureData });
        return;
    }
    const parameters = {
        attendees,
        amount,
        distance,
        currency,
        comment,
        created,
        merchant,
        payerAccountID,
        payerEmail,
        chatReportID: chatParams.reportID,
        transactionID,
        actionableWhisperReportActionID,
        createdChatReportActionID: chatParams.createdReportActionID,
        moneyRequestReportID: iouParams.reportID,
        moneyRequestCreatedReportActionID: iouParams.createdReportActionID,
        moneyRequestPreviewReportActionID: iouParams.reportActionID,
        transactionThreadReportID,
        modifiedExpenseReportActionID,
        reportPreviewReportActionID: chatParams.reportPreviewReportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.CONVERT_TRACKED_EXPENSE_TO_REQUEST, parameters, { optimisticData, successData, failureData });
}
/**
 * Move multiple tracked expenses from self-DM to an IOU report
 */
function convertBulkTrackedExpensesToIOU(transactionIDs, targetReportID) {
    const iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${targetReportID}`];
    if (!iouReport || !(0, ReportUtils_1.isMoneyRequestReport)(iouReport)) {
        Log_1.default.warn('[convertBulkTrackedExpensesToIOU] Invalid IOU report', { targetReportID });
        return;
    }
    const chatReportID = iouReport.chatReportID;
    if (!chatReportID) {
        Log_1.default.warn('[convertBulkTrackedExpensesToIOU] No chat report found for IOU', { targetReportID });
        return;
    }
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`];
    if (!chatReport) {
        Log_1.default.warn('[convertBulkTrackedExpensesToIOU] Chat report not found', { chatReportID });
        return;
    }
    const participantAccountIDs = (0, ReportUtils_1.getReportRecipientAccountIDs)(iouReport, userAccountID);
    const payerAccountID = participantAccountIDs.at(0);
    if (!payerAccountID) {
        Log_1.default.warn('[convertBulkTrackedExpensesToIOU] No payer found', { targetReportID, participantAccountIDs });
        return;
    }
    const payerEmail = personalDetailsList?.[payerAccountID]?.login ?? '';
    const selfDMReportID = (0, ReportUtils_1.findSelfDMReportID)();
    if (!selfDMReportID) {
        Log_1.default.warn('[convertBulkTrackedExpensesToIOU] Self DM not found');
        return;
    }
    const selfDMReportActions = (0, ReportActionsUtils_1.getAllReportActions)(selfDMReportID);
    transactionIDs.forEach((transactionID) => {
        const transaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
        if (!transaction) {
            Log_1.default.warn('[convertBulkTrackedExpensesToIOU] Transaction not found', { transactionID });
            return;
        }
        const linkedTrackedExpenseReportAction = Object.values(selfDMReportActions).find((action) => {
            if (!(0, ReportActionsUtils_1.isMoneyRequestAction)(action)) {
                return false;
            }
            const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(action);
            return originalMessage?.IOUTransactionID === transactionID;
        });
        if (!linkedTrackedExpenseReportAction) {
            Log_1.default.warn('[convertBulkTrackedExpensesToIOU] Tracked expense IOU action not found', { transactionID });
            return;
        }
        const actionableWhisperReportActionID = (0, ReportActionsUtils_1.getTrackExpenseActionableWhisper)(transactionID, selfDMReportID)?.reportActionID;
        const commentText = typeof transaction.comment === 'string' ? transaction.comment : (transaction.comment?.comment ?? '');
        const parsedComment = (0, ReportUtils_1.getParsedComment)(commentText);
        const attendees = transaction.comment?.attendees;
        const transactionThreadReportID = linkedTrackedExpenseReportAction.childReportID;
        if (!transactionThreadReportID) {
            Log_1.default.warn('[convertBulkTrackedExpensesToIOU] No transaction thread found for tracked expense, skipping', {
                transactionID,
                actionReportActionID: linkedTrackedExpenseReportAction.reportActionID,
            });
            return;
        }
        const participantParams = {
            payeeAccountID: userAccountID,
            payeeEmail: currentUserEmail,
            participant: {
                accountID: payerAccountID,
                login: payerEmail,
            },
        };
        const transactionParams = {
            amount: (0, TransactionUtils_1.getAmount)(transaction),
            currency: (0, TransactionUtils_1.getCurrency)(transaction),
            comment: parsedComment,
            merchant: (0, TransactionUtils_1.getMerchant)(transaction),
            created: transaction.created,
            attendees,
            actionableWhisperReportActionID,
            linkedTrackedExpenseReportAction,
            linkedTrackedExpenseReportID: selfDMReportID,
        };
        const { payerAccountID: moneyRequestPayerAccountID, payerEmail: moneyRequestPayerEmail, iouReport: moneyRequestIOUReport, chatReport: moneyRequestChatReport, transaction: moneyRequestTransaction, iouAction, createdChatReportActionID, createdIOUReportActionID, reportPreviewAction, transactionThreadReportID: moneyRequestTransactionThreadReportID, onyxData, } = getMoneyRequestInformation({
            parentChatReport: chatReport,
            participantParams,
            transactionParams,
            moneyRequestReportID: targetReportID,
            existingTransactionID: transactionID,
            existingTransaction: transaction,
        });
        const convertParams = {
            payerParams: {
                accountID: moneyRequestPayerAccountID,
                email: moneyRequestPayerEmail,
            },
            transactionParams: {
                amount: (0, TransactionUtils_1.getAmount)(transaction),
                currency: (0, TransactionUtils_1.getCurrency)(transaction),
                comment: parsedComment,
                merchant: (0, TransactionUtils_1.getMerchant)(transaction),
                created: transaction.created,
                attendees,
                transactionID: moneyRequestTransaction.transactionID,
                actionableWhisperReportActionID,
                linkedTrackedExpenseReportAction,
                linkedTrackedExpenseReportID: selfDMReportID,
                transactionThreadReportID: moneyRequestTransactionThreadReportID,
            },
            chatParams: {
                reportID: moneyRequestChatReport.reportID,
                createdReportActionID: createdChatReportActionID,
                reportPreviewReportActionID: reportPreviewAction.reportActionID,
            },
            iouParams: {
                reportID: moneyRequestIOUReport.reportID,
                createdReportActionID: createdIOUReportActionID,
                reportActionID: iouAction.reportActionID,
            },
            onyxData,
        };
        convertTrackedExpenseToRequest(convertParams);
    });
}
function categorizeTrackedExpense(trackedExpenseParams) {
    const { onyxData, reportInformation, transactionParams, policyParams, createdWorkspaceParams } = trackedExpenseParams;
    const { optimisticData, successData, failureData } = onyxData ?? {};
    const { transactionID } = transactionParams;
    const { isDraftPolicy } = policyParams;
    const { actionableWhisperReportActionID, moneyRequestReportID, linkedTrackedExpenseReportAction, linkedTrackedExpenseReportID, transactionThreadReportID } = reportInformation;
    const { optimisticData: moveTransactionOptimisticData, successData: moveTransactionSuccessData, failureData: moveTransactionFailureData, modifiedExpenseReportActionID, } = getConvertTrackedExpenseInformation(transactionID, actionableWhisperReportActionID, moneyRequestReportID, linkedTrackedExpenseReportAction, linkedTrackedExpenseReportID, transactionThreadReportID, CONST_1.default.IOU.ACTION.CATEGORIZE);
    optimisticData?.push(...moveTransactionOptimisticData);
    successData?.push(...moveTransactionSuccessData);
    failureData?.push(...moveTransactionFailureData);
    const parameters = {
        ...{
            ...reportInformation,
            linkedTrackedExpenseReportAction: undefined,
        },
        ...policyParams,
        ...transactionParams,
        modifiedExpenseReportActionID,
        policyExpenseChatReportID: createdWorkspaceParams?.expenseChatReportID,
        policyExpenseCreatedReportActionID: createdWorkspaceParams?.expenseCreatedReportActionID,
        adminsChatReportID: createdWorkspaceParams?.adminsChatReportID,
        adminsCreatedReportActionID: createdWorkspaceParams?.adminsCreatedReportActionID,
        engagementChoice: createdWorkspaceParams?.engagementChoice,
        guidedSetupData: createdWorkspaceParams?.guidedSetupData,
        description: transactionParams.comment,
        customUnitID: createdWorkspaceParams?.customUnitID,
        customUnitRateID: createdWorkspaceParams?.customUnitRateID ?? transactionParams.customUnitRateID,
        attendees: transactionParams.attendees ? JSON.stringify(transactionParams.attendees) : undefined,
    };
    API.write(types_1.WRITE_COMMANDS.CATEGORIZE_TRACKED_EXPENSE, parameters, { optimisticData, successData, failureData });
    // If a draft policy was used, then the CategorizeTrackedExpense command will create a real one
    // so let's track that conversion here
    if (isDraftPolicy) {
        GoogleTagManager_1.default.publishEvent(CONST_1.default.ANALYTICS.EVENT.WORKSPACE_CREATED, userAccountID);
    }
}
function shareTrackedExpense(trackedExpenseParams) {
    const { onyxData, reportInformation, transactionParams, policyParams, createdWorkspaceParams, accountantParams } = trackedExpenseParams;
    const policyID = policyParams?.policyID;
    const chatReportID = reportInformation?.chatReportID;
    const accountantEmail = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(accountantParams?.accountant?.login);
    const accountantAccountID = accountantParams?.accountant?.accountID;
    if (!policyID || !chatReportID || !accountantEmail || !accountantAccountID) {
        return;
    }
    const { optimisticData: shareTrackedExpenseOptimisticData = [], successData: shareTrackedExpenseSuccessData = [], failureData: shareTrackedExpenseFailureData = [] } = onyxData ?? {};
    const { transactionID } = transactionParams;
    const { actionableWhisperReportActionID, moneyRequestPreviewReportActionID, moneyRequestCreatedReportActionID, reportPreviewReportActionID, moneyRequestReportID, linkedTrackedExpenseReportAction, linkedTrackedExpenseReportID, transactionThreadReportID, } = reportInformation;
    const { optimisticData, successData, failureData, modifiedExpenseReportActionID } = getConvertTrackedExpenseInformation(transactionID, actionableWhisperReportActionID, moneyRequestReportID, linkedTrackedExpenseReportAction, linkedTrackedExpenseReportID, transactionThreadReportID, CONST_1.default.IOU.ACTION.SHARE);
    optimisticData?.push(...shareTrackedExpenseOptimisticData);
    successData?.push(...shareTrackedExpenseSuccessData);
    failureData?.push(...shareTrackedExpenseFailureData);
    const policyEmployeeList = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyParams?.policyID}`]?.employeeList;
    if (!policyEmployeeList?.[accountantEmail]) {
        const policyMemberAccountIDs = Object.values((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policyEmployeeList, false, false));
        const { optimisticData: addAccountantToWorkspaceOptimisticData, successData: addAccountantToWorkspaceSuccessData, failureData: addAccountantToWorkspaceFailureData, } = (0, Member_1.buildAddMembersToWorkspaceOnyxData)({ [accountantEmail]: accountantAccountID }, policyID, policyMemberAccountIDs, CONST_1.default.POLICY.ROLE.ADMIN, LocalePhoneNumber_1.formatPhoneNumber);
        optimisticData?.push(...addAccountantToWorkspaceOptimisticData);
        successData?.push(...addAccountantToWorkspaceSuccessData);
        failureData?.push(...addAccountantToWorkspaceFailureData);
    }
    else if (policyEmployeeList?.[accountantEmail].role !== CONST_1.default.POLICY.ROLE.ADMIN) {
        const { optimisticData: addAccountantToWorkspaceOptimisticData, successData: addAccountantToWorkspaceSuccessData, failureData: addAccountantToWorkspaceFailureData, } = (0, Member_1.buildUpdateWorkspaceMembersRoleOnyxData)(policyID, [accountantAccountID], CONST_1.default.POLICY.ROLE.ADMIN);
        optimisticData?.push(...addAccountantToWorkspaceOptimisticData);
        successData?.push(...addAccountantToWorkspaceSuccessData);
        failureData?.push(...addAccountantToWorkspaceFailureData);
    }
    const chatReportParticipants = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`]?.participants;
    if (!chatReportParticipants?.[accountantAccountID]) {
        const { optimisticData: inviteAccountantToRoomOptimisticData, successData: inviteAccountantToRoomSuccessData, failureData: inviteAccountantToRoomFailureData, } = (0, Report_1.buildInviteToRoomOnyxData)(chatReportID, { [accountantEmail]: accountantAccountID }, LocalePhoneNumber_1.formatPhoneNumber);
        optimisticData?.push(...inviteAccountantToRoomOptimisticData);
        successData?.push(...inviteAccountantToRoomSuccessData);
        failureData?.push(...inviteAccountantToRoomFailureData);
    }
    const parameters = {
        ...transactionParams,
        policyID,
        moneyRequestPreviewReportActionID,
        moneyRequestReportID,
        moneyRequestCreatedReportActionID,
        actionableWhisperReportActionID,
        modifiedExpenseReportActionID,
        reportPreviewReportActionID,
        policyExpenseChatReportID: createdWorkspaceParams?.expenseChatReportID,
        policyExpenseCreatedReportActionID: createdWorkspaceParams?.expenseCreatedReportActionID,
        adminsChatReportID: createdWorkspaceParams?.adminsChatReportID,
        adminsCreatedReportActionID: createdWorkspaceParams?.adminsCreatedReportActionID,
        engagementChoice: createdWorkspaceParams?.engagementChoice,
        guidedSetupData: createdWorkspaceParams?.guidedSetupData,
        policyName: createdWorkspaceParams?.policyName,
        description: transactionParams.comment,
        customUnitID: createdWorkspaceParams?.customUnitID,
        customUnitRateID: createdWorkspaceParams?.customUnitRateID ?? transactionParams.customUnitRateID,
        attendees: transactionParams.attendees ? JSON.stringify(transactionParams.attendees) : undefined,
        accountantEmail,
    };
    API.write(types_1.WRITE_COMMANDS.SHARE_TRACKED_EXPENSE, parameters, { optimisticData, successData, failureData });
}
/**
 * Submit expense to another user
 */
function requestMoney(requestMoneyInformation) {
    const { report, participantParams, policyParams = {}, transactionParams, gpsPoints, action, shouldHandleNavigation = true, backToReport, shouldPlaySound = true, optimisticChatReportID, optimisticCreatedReportActionID, optimisticIOUReportID, optimisticReportPreviewActionID, shouldGenerateTransactionThreadReport, } = requestMoneyInformation;
    const { payeeAccountID } = participantParams;
    const parsedComment = (0, ReportUtils_1.getParsedComment)(transactionParams.comment ?? '');
    transactionParams.comment = parsedComment;
    const { amount, currency, merchant, comment = '', receipt, category, tag, taxCode = '', taxAmount = 0, billable, reimbursable, created, attendees, actionableWhisperReportActionID, linkedTrackedExpenseReportAction, linkedTrackedExpenseReportID, waypoints, customUnitRateID, isTestDrive, } = transactionParams;
    const testDriveCommentReportActionID = isTestDrive ? NumberUtils.rand64() : undefined;
    const sanitizedWaypoints = waypoints ? JSON.stringify((0, Transaction_1.sanitizeRecentWaypoints)(waypoints)) : undefined;
    // If the report is iou or expense report, we should get the linked chat report to be passed to the getMoneyRequestInformation function
    const isMoneyRequestReport = (0, ReportUtils_1.isMoneyRequestReport)(report);
    const currentChatReport = isMoneyRequestReport ? (0, ReportUtils_1.getReportOrDraftReport)(report?.chatReportID) : report;
    const moneyRequestReportID = isMoneyRequestReport ? report?.reportID : '';
    const isMovingTransactionFromTrackExpense = (0, IOUUtils_1.isMovingTransactionFromTrackExpense)(action);
    const existingTransactionID = isMovingTransactionFromTrackExpense && linkedTrackedExpenseReportAction && (0, ReportActionsUtils_1.isMoneyRequestAction)(linkedTrackedExpenseReportAction)
        ? (0, ReportActionsUtils_1.getOriginalMessage)(linkedTrackedExpenseReportAction)?.IOUTransactionID
        : undefined;
    const existingTransaction = action === CONST_1.default.IOU.ACTION.SUBMIT
        ? allTransactionDrafts[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${existingTransactionID}`]
        : allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${existingTransactionID}`];
    const retryParams = {
        ...requestMoneyInformation,
        participantParams: {
            ...requestMoneyInformation.participantParams,
            participant: (({ icons, ...rest }) => rest)(requestMoneyInformation.participantParams.participant),
        },
        transactionParams: {
            ...requestMoneyInformation.transactionParams,
            receipt: undefined,
        },
    };
    const { payerAccountID, payerEmail, iouReport, chatReport, transaction, iouAction, createdChatReportActionID, createdIOUReportActionID, reportPreviewAction, transactionThreadReportID, createdReportActionIDForThread, onyxData, } = getMoneyRequestInformation({
        parentChatReport: isMovingTransactionFromTrackExpense ? undefined : currentChatReport,
        participantParams,
        policyParams,
        transactionParams,
        moneyRequestReportID,
        existingTransactionID,
        existingTransaction: (0, TransactionUtils_1.isDistanceRequest)(existingTransaction) ? existingTransaction : undefined,
        retryParams,
        testDriveCommentReportActionID,
        optimisticChatReportID,
        optimisticCreatedReportActionID,
        optimisticIOUReportID,
        optimisticReportPreviewActionID,
        shouldGenerateTransactionThreadReport,
    });
    const activeReportID = isMoneyRequestReport ? report?.reportID : chatReport.reportID;
    if (shouldPlaySound) {
        (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    }
    switch (action) {
        case CONST_1.default.IOU.ACTION.SUBMIT: {
            if (!linkedTrackedExpenseReportAction || !linkedTrackedExpenseReportID) {
                return;
            }
            const workspaceParams = (0, ReportUtils_1.isPolicyExpenseChat)(chatReport) && chatReport.policyID
                ? {
                    receipt: (0, isFileUploadable_1.default)(receipt) ? receipt : undefined,
                    category,
                    tag,
                    taxCode,
                    taxAmount,
                    billable,
                    policyID: chatReport.policyID,
                    waypoints: sanitizedWaypoints,
                    customUnitID: (0, PolicyUtils_1.getDistanceRateCustomUnit)(policyParams?.policy)?.customUnitID,
                    customUnitRateID,
                    reimbursable,
                }
                : undefined;
            convertTrackedExpenseToRequest({
                payerParams: {
                    accountID: payerAccountID,
                    email: payerEmail,
                },
                transactionParams: {
                    amount,
                    currency,
                    comment,
                    merchant,
                    created,
                    attendees,
                    transactionID: transaction.transactionID,
                    actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID,
                    transactionThreadReportID,
                },
                chatParams: {
                    reportID: chatReport.reportID,
                    createdReportActionID: createdChatReportActionID,
                    reportPreviewReportActionID: reportPreviewAction.reportActionID,
                },
                iouParams: {
                    reportID: iouReport.reportID,
                    createdReportActionID: createdIOUReportActionID,
                    reportActionID: iouAction.reportActionID,
                },
                onyxData,
                workspaceParams,
            });
            break;
        }
        default: {
            // This is only required when inviting admins to test drive the app
            const guidedSetupData = isTestDrive
                ? (0, ReportUtils_1.prepareOnboardingOnyxData)({ choice: CONST_1.default.ONBOARDING_CHOICES.TEST_DRIVE_RECEIVER }, CONST_1.default.ONBOARDING_CHOICES.TEST_DRIVE_RECEIVER, (0, OnboardingFlow_1.getOnboardingMessages)().onboardingMessages[CONST_1.default.ONBOARDING_CHOICES.TEST_DRIVE_RECEIVER])?.guidedSetupData
                : undefined;
            const parameters = {
                debtorEmail: payerEmail,
                debtorAccountID: payerAccountID,
                amount,
                currency,
                comment,
                created,
                merchant,
                iouReportID: iouReport.reportID,
                chatReportID: chatReport.reportID,
                transactionID: transaction.transactionID,
                reportActionID: iouAction.reportActionID,
                createdChatReportActionID,
                createdIOUReportActionID,
                reportPreviewReportActionID: reportPreviewAction.reportActionID,
                receipt: (0, isFileUploadable_1.default)(receipt) ? receipt : undefined,
                receiptState: receipt?.state,
                category,
                tag,
                taxCode,
                taxAmount,
                billable,
                // This needs to be a string of JSON because of limitations with the fetch() API and nested objects
                receiptGpsPoints: gpsPoints ? JSON.stringify(gpsPoints) : undefined,
                transactionThreadReportID,
                createdReportActionIDForThread,
                reimbursable,
                description: parsedComment,
                attendees: attendees ? JSON.stringify(attendees) : undefined,
                isTestDrive,
                guidedSetupData: guidedSetupData ? JSON.stringify(guidedSetupData) : undefined,
                testDriveCommentReportActionID,
            };
            // eslint-disable-next-line rulesdir/no-multiple-api-calls
            API.write(types_1.WRITE_COMMANDS.REQUEST_MONEY, parameters, onyxData);
        }
    }
    if (shouldHandleNavigation) {
        react_native_1.InteractionManager.runAfterInteractions(() => (0, TransactionEdit_1.removeDraftTransactions)());
        if (!requestMoneyInformation.isRetry) {
            dismissModalAndOpenReportInInboxTab(backToReport ?? activeReportID);
        }
        const trackReport = Navigation_1.default.getReportRouteByID(linkedTrackedExpenseReportAction?.childReportID);
        if (trackReport?.key) {
            Navigation_1.default.removeScreenByKey(trackReport.key);
        }
    }
    if (activeReportID && !isMoneyRequestReport) {
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => setTimeout(() => {
            (0, Report_1.notifyNewAction)(activeReportID, payeeAccountID, reportPreviewAction);
        }, CONST_1.default.TIMING.NOTIFY_NEW_ACTION_DELAY));
    }
}
/**
 * Submit per diem expense to another user
 */
function submitPerDiemExpense(submitPerDiemExpenseInformation) {
    const { report, participantParams, policyParams = {}, recentlyUsedParams = {}, transactionParams } = submitPerDiemExpenseInformation;
    const { payeeAccountID } = participantParams;
    const { currency, comment = '', category, tag, created, customUnit, attendees } = transactionParams;
    if ((0, EmptyObject_1.isEmptyObject)(policyParams.policy) ||
        (0, EmptyObject_1.isEmptyObject)(customUnit) ||
        !customUnit.customUnitID ||
        !customUnit.customUnitRateID ||
        (customUnit.subRates ?? []).length === 0 ||
        (0, EmptyObject_1.isEmptyObject)(customUnit.attributes)) {
        return;
    }
    // If the report is iou or expense report, we should get the linked chat report to be passed to the getMoneyRequestInformation function
    const isMoneyRequestReport = (0, ReportUtils_1.isMoneyRequestReport)(report);
    const currentChatReport = isMoneyRequestReport ? (0, ReportUtils_1.getReportOrDraftReport)(report?.chatReportID) : report;
    const moneyRequestReportID = isMoneyRequestReport ? report?.reportID : '';
    const { iouReport, chatReport, transaction, iouAction, createdChatReportActionID, createdIOUReportActionID, reportPreviewAction, transactionThreadReportID, createdReportActionIDForThread, onyxData, billable, reimbursable, } = getPerDiemExpenseInformation({
        parentChatReport: currentChatReport,
        participantParams,
        policyParams,
        recentlyUsedParams,
        transactionParams,
        moneyRequestReportID,
    });
    const activeReportID = isMoneyRequestReport && Navigation_1.default.getTopmostReportId() === report?.reportID ? report?.reportID : chatReport.reportID;
    const customUnitRate = (0, PolicyUtils_1.getPerDiemRateCustomUnitRate)(policyParams.policy, customUnit.customUnitRateID);
    const customUnitRateParam = {
        id: customUnitRate?.customUnitRateID,
        name: customUnitRate?.name,
    };
    const parameters = {
        policyID: policyParams.policy.id,
        customUnitID: customUnit.customUnitID,
        customUnitRateID: customUnit.customUnitRateID,
        customUnitRate: JSON.stringify(customUnitRateParam),
        subRates: JSON.stringify(customUnit.subRates),
        startDateTime: customUnit.attributes.dates.start,
        endDateTime: customUnit.attributes.dates.end,
        currency,
        description: comment,
        created,
        iouReportID: iouReport.reportID,
        chatReportID: chatReport.reportID,
        transactionID: transaction.transactionID,
        reportActionID: iouAction.reportActionID,
        createdChatReportActionID,
        createdIOUReportActionID,
        reportPreviewReportActionID: reportPreviewAction.reportActionID,
        category,
        tag,
        transactionThreadReportID,
        createdReportActionIDForThread,
        billable,
        reimbursable,
        attendees: attendees ? JSON.stringify(attendees) : undefined,
    };
    (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    API.write(types_1.WRITE_COMMANDS.CREATE_PER_DIEM_REQUEST, parameters, onyxData);
    react_native_1.InteractionManager.runAfterInteractions(() => (0, TransactionEdit_1.removeDraftTransaction)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID));
    dismissModalAndOpenReportInInboxTab(activeReportID);
    if (activeReportID) {
        (0, Report_1.notifyNewAction)(activeReportID, payeeAccountID);
    }
}
function sendInvoice(currentUserAccountID, transaction, invoiceChatReport, receiptFile, policy, policyTagList, policyCategories, companyName, companyWebsite, policyRecentlyUsedCategories) {
    const parsedComment = (0, ReportUtils_1.getParsedComment)(transaction?.comment?.comment?.trim() ?? '');
    if (transaction?.comment) {
        // eslint-disable-next-line no-param-reassign
        transaction.comment.comment = parsedComment;
    }
    const { senderWorkspaceID, receiver, invoiceRoom, createdChatReportActionID, invoiceReportID, reportPreviewReportActionID, transactionID, transactionThreadReportID, createdIOUReportActionID, createdReportActionIDForThread, reportActionID, onyxData, } = getSendInvoiceInformation(transaction, currentUserAccountID, invoiceChatReport, receiptFile, policy, policyTagList, policyCategories, companyName, companyWebsite, policyRecentlyUsedCategories);
    const parameters = {
        createdIOUReportActionID,
        createdReportActionIDForThread,
        reportActionID,
        senderWorkspaceID,
        accountID: currentUserAccountID,
        amount: transaction?.amount ?? 0,
        currency: transaction?.currency ?? '',
        comment: parsedComment,
        merchant: transaction?.merchant ?? '',
        category: transaction?.category,
        date: transaction?.created ?? '',
        invoiceRoomReportID: invoiceRoom.reportID,
        createdChatReportActionID,
        invoiceReportID,
        reportPreviewReportActionID,
        transactionID,
        transactionThreadReportID,
        companyName,
        companyWebsite,
        description: parsedComment,
        ...(invoiceChatReport?.reportID ? { receiverInvoiceRoomID: invoiceChatReport.reportID } : { receiverEmail: receiver.login ?? '' }),
    };
    (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    API.write(types_1.WRITE_COMMANDS.SEND_INVOICE, parameters, onyxData);
    react_native_1.InteractionManager.runAfterInteractions(() => (0, TransactionEdit_1.removeDraftTransaction)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID));
    if ((0, isSearchTopmostFullScreenRoute_1.default)()) {
        Navigation_1.default.dismissModal();
    }
    else {
        Navigation_1.default.dismissModalWithReport({ reportID: invoiceRoom.reportID });
    }
    (0, Report_1.notifyNewAction)(invoiceRoom.reportID, currentUserAccountID);
}
/**
 * Track an expense
 */
function trackExpense(params) {
    const { report, action, isDraftPolicy, participantParams, policyParams: policyData = {}, transactionParams: transactionData, accountantParams, shouldHandleNavigation = true, shouldPlaySound = true, } = params;
    const { participant, payeeAccountID, payeeEmail } = participantParams;
    const { policy, policyCategories, policyTagList } = policyData;
    const parsedComment = (0, ReportUtils_1.getParsedComment)(transactionData.comment ?? '');
    transactionData.comment = parsedComment;
    const { amount, currency, created = '', merchant = '', comment = '', distance, receipt, category, tag, taxCode = '', taxAmount = 0, billable, reimbursable, gpsPoints, validWaypoints, actionableWhisperReportActionID, linkedTrackedExpenseReportAction, linkedTrackedExpenseReportID, customUnitRateID, attendees, } = transactionData;
    const isMoneyRequestReport = (0, ReportUtils_1.isMoneyRequestReport)(report);
    const currentChatReport = isMoneyRequestReport ? (0, ReportUtils_1.getReportOrDraftReport)(report.chatReportID) : report;
    const moneyRequestReportID = isMoneyRequestReport ? report.reportID : '';
    const isMovingTransactionFromTrackExpense = (0, IOUUtils_1.isMovingTransactionFromTrackExpense)(action);
    // Pass an open receipt so the distance expense will show a map with the route optimistically
    const trackedReceipt = validWaypoints ? { source: receipt_generic_png_1.default, state: CONST_1.default.IOU.RECEIPT_STATE.OPEN } : receipt;
    const sanitizedWaypoints = validWaypoints ? JSON.stringify((0, Transaction_1.sanitizeRecentWaypoints)(validWaypoints)) : undefined;
    const retryParams = {
        report,
        isDraftPolicy,
        action,
        participantParams: {
            participant,
            payeeAccountID,
            payeeEmail,
        },
        transactionParams: {
            amount,
            currency,
            created,
            merchant,
            comment,
            distance,
            receipt: undefined,
            category,
            tag,
            taxCode,
            taxAmount,
            billable,
            validWaypoints,
            gpsPoints,
            actionableWhisperReportActionID,
            linkedTrackedExpenseReportAction,
            linkedTrackedExpenseReportID,
            customUnitRateID,
        },
    };
    const { createdWorkspaceParams, iouReport, chatReport, transaction, iouAction, createdChatReportActionID, createdIOUReportActionID, reportPreviewAction, transactionThreadReportID, createdReportActionIDForThread, actionableWhisperReportActionIDParam, onyxData, } = getTrackExpenseInformation({
        parentChatReport: currentChatReport,
        moneyRequestReportID,
        existingTransactionID: isMovingTransactionFromTrackExpense && linkedTrackedExpenseReportAction && (0, ReportActionsUtils_1.isMoneyRequestAction)(linkedTrackedExpenseReportAction)
            ? (0, ReportActionsUtils_1.getOriginalMessage)(linkedTrackedExpenseReportAction)?.IOUTransactionID
            : undefined,
        participantParams: {
            participant,
            payeeAccountID,
            payeeEmail,
        },
        transactionParams: {
            comment,
            amount,
            distance,
            currency,
            created,
            merchant,
            receipt: trackedReceipt,
            category,
            tag,
            taxCode,
            taxAmount,
            billable,
            linkedTrackedExpenseReportAction,
            attendees,
        },
        policyParams: {
            policy,
            policyCategories,
            policyTagList,
        },
        retryParams,
    }) ?? {};
    const activeReportID = isMoneyRequestReport ? report.reportID : chatReport?.reportID;
    const recentServerValidatedWaypoints = (0, Transaction_1.getRecentWaypoints)().filter((item) => !item.pendingAction);
    onyxData?.failureData?.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.NVP_RECENT_WAYPOINTS}`,
        value: recentServerValidatedWaypoints,
    });
    const mileageRate = (0, TransactionUtils_1.isCustomUnitRateIDForP2P)(transaction) ? undefined : customUnitRateID;
    if (shouldPlaySound) {
        (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    }
    switch (action) {
        case CONST_1.default.IOU.ACTION.CATEGORIZE: {
            if (!linkedTrackedExpenseReportAction || !linkedTrackedExpenseReportID) {
                return;
            }
            const transactionParams = {
                transactionID: transaction?.transactionID,
                amount,
                currency,
                comment,
                distance,
                merchant,
                created,
                taxCode,
                taxAmount,
                category,
                tag,
                billable,
                reimbursable,
                receipt: (0, isFileUploadable_1.default)(trackedReceipt) ? trackedReceipt : undefined,
                waypoints: sanitizedWaypoints,
                customUnitRateID: mileageRate,
                attendees,
            };
            const policyParams = {
                policyID: chatReport?.policyID,
                isDraftPolicy,
            };
            const reportInformation = {
                moneyRequestPreviewReportActionID: iouAction?.reportActionID,
                moneyRequestReportID: iouReport?.reportID,
                moneyRequestCreatedReportActionID: createdIOUReportActionID,
                actionableWhisperReportActionID,
                linkedTrackedExpenseReportAction,
                linkedTrackedExpenseReportID,
                transactionThreadReportID,
                reportPreviewReportActionID: reportPreviewAction?.reportActionID,
                chatReportID: chatReport?.reportID,
            };
            const trackedExpenseParams = {
                onyxData,
                reportInformation,
                transactionParams,
                policyParams,
                createdWorkspaceParams,
            };
            categorizeTrackedExpense(trackedExpenseParams);
            break;
        }
        case CONST_1.default.IOU.ACTION.SHARE: {
            if (!linkedTrackedExpenseReportAction || !linkedTrackedExpenseReportID) {
                return;
            }
            const transactionParams = {
                transactionID: transaction?.transactionID,
                amount,
                currency,
                comment,
                distance,
                merchant,
                created,
                taxCode: taxCode ?? '',
                taxAmount: taxAmount ?? 0,
                category,
                tag,
                billable,
                reimbursable,
                receipt: (0, isFileUploadable_1.default)(trackedReceipt) ? trackedReceipt : undefined,
                waypoints: sanitizedWaypoints,
                customUnitRateID: mileageRate,
                attendees,
            };
            const policyParams = {
                policyID: chatReport?.policyID,
            };
            const reportInformation = {
                moneyRequestPreviewReportActionID: iouAction?.reportActionID,
                moneyRequestReportID: iouReport?.reportID,
                moneyRequestCreatedReportActionID: createdIOUReportActionID,
                actionableWhisperReportActionID,
                linkedTrackedExpenseReportAction,
                linkedTrackedExpenseReportID,
                transactionThreadReportID,
                reportPreviewReportActionID: reportPreviewAction?.reportActionID,
                chatReportID: chatReport?.reportID,
            };
            const trackedExpenseParams = {
                onyxData,
                reportInformation,
                transactionParams,
                policyParams,
                createdWorkspaceParams,
                accountantParams,
            };
            shareTrackedExpense(trackedExpenseParams);
            break;
        }
        default: {
            const parameters = {
                amount,
                currency,
                comment,
                distance,
                created,
                merchant,
                iouReportID: iouReport?.reportID,
                chatReportID: chatReport?.reportID,
                transactionID: transaction?.transactionID,
                reportActionID: iouAction?.reportActionID,
                createdChatReportActionID,
                createdIOUReportActionID,
                reportPreviewReportActionID: reportPreviewAction?.reportActionID,
                receipt: (0, isFileUploadable_1.default)(trackedReceipt) ? trackedReceipt : undefined,
                receiptState: trackedReceipt?.state,
                category,
                tag,
                taxCode,
                taxAmount,
                billable,
                // This needs to be a string of JSON because of limitations with the fetch() API and nested objects
                receiptGpsPoints: gpsPoints ? JSON.stringify(gpsPoints) : undefined,
                transactionThreadReportID,
                createdReportActionIDForThread,
                waypoints: sanitizedWaypoints,
                customUnitRateID,
                description: parsedComment,
            };
            if (actionableWhisperReportActionIDParam) {
                parameters.actionableWhisperReportActionID = actionableWhisperReportActionIDParam;
            }
            API.write(types_1.WRITE_COMMANDS.TRACK_EXPENSE, parameters, onyxData);
        }
    }
    if (shouldHandleNavigation) {
        react_native_1.InteractionManager.runAfterInteractions(() => (0, TransactionEdit_1.removeDraftTransactions)());
        if (!params.isRetry) {
            dismissModalAndOpenReportInInboxTab(activeReportID);
        }
    }
    (0, Report_1.notifyNewAction)(activeReportID, payeeAccountID);
}
function getOrCreateOptimisticSplitChatReport(existingSplitChatReportID, participants, participantAccountIDs, currentUserAccountID) {
    // The existing chat report could be passed as reportID or exist on the sole "participant" (in this case a report option)
    const existingChatReportID = existingSplitChatReportID ?? participants.at(0)?.reportID;
    // Check if the report is available locally if we do have one
    const existingSplitChatOnyxData = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${existingChatReportID}`];
    let existingSplitChatReport = existingChatReportID && existingSplitChatOnyxData ? { ...existingSplitChatOnyxData } : undefined;
    const allParticipantsAccountIDs = [...participantAccountIDs, currentUserAccountID];
    if (!existingSplitChatReport) {
        existingSplitChatReport = (0, ReportUtils_1.getChatByParticipants)(allParticipantsAccountIDs, undefined, participantAccountIDs.length > 1);
    }
    // We found an existing chat report we are done...
    if (existingSplitChatReport) {
        // Yes, these are the same, but give the caller a way to identify if we created a new report or not
        return { existingSplitChatReport, splitChatReport: existingSplitChatReport };
    }
    // Create a Group Chat if we have multiple participants
    if (participants.length > 1) {
        const splitChatReport = (0, ReportUtils_1.buildOptimisticChatReport)({
            participantList: allParticipantsAccountIDs,
            reportName: '',
            chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
            notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
        });
        return { existingSplitChatReport: null, splitChatReport };
    }
    // Otherwise, create a new 1:1 chat report
    const splitChatReport = (0, ReportUtils_1.buildOptimisticChatReport)({
        participantList: participantAccountIDs,
    });
    return { existingSplitChatReport: null, splitChatReport };
}
/**
 * Build the Onyx data and IOU split necessary for splitting a bill with 3+ users.
 * 1. Build the optimistic Onyx data for the group chat, i.e. chatReport and iouReportAction creating the former if it doesn't yet exist.
 * 2. Loop over the group chat participant list, building optimistic or updating existing chatReports, iouReports and iouReportActions between the user and each participant.
 * We build both Onyx data and the IOU split that is sent as a request param and is used by Auth to create the chatReports, iouReports and iouReportActions in the database.
 * The IOU split has the following shape:
 *  [
 *      {email: 'currentUser', amount: 100},
 *      {email: 'user2', amount: 100, iouReportID: '100', chatReportID: '110', transactionID: '120', reportActionID: '130'},
 *      {email: 'user3', amount: 100, iouReportID: '200', chatReportID: '210', transactionID: '220', reportActionID: '230'}
 *  ]
 * @param amount - always in the smallest unit of the currency
 * @param existingSplitChatReportID - the report ID where the split expense happens, could be a group chat or a expense chat
 */
function createSplitsAndOnyxData({ participants, currentUserLogin, currentUserAccountID, existingSplitChatReportID, transactionParams: { amount, comment, currency, merchant, created, category, tag, splitShares = {}, billable = false, iouRequestType = CONST_1.default.IOU.REQUEST_TYPE.MANUAL, taxCode = '', taxAmount = 0, attendees, }, }) {
    const currentUserEmailForIOUSplit = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(currentUserLogin);
    const participantAccountIDs = participants.map((participant) => Number(participant.accountID));
    const { splitChatReport, existingSplitChatReport } = getOrCreateOptimisticSplitChatReport(existingSplitChatReportID, participants, participantAccountIDs, currentUserAccountID);
    const isOwnPolicyExpenseChat = !!splitChatReport.isOwnPolicyExpenseChat;
    // Pass an open receipt so the distance expense will show a map with the route optimistically
    const receipt = iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE ? { source: receipt_generic_png_1.default, state: CONST_1.default.IOU.RECEIPT_STATE.OPEN } : undefined;
    const existingTransaction = allTransactionDrafts[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`];
    const isDistanceRequest = existingTransaction && existingTransaction.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE;
    let splitTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
        existingTransaction,
        transactionParams: {
            amount,
            currency,
            reportID: CONST_1.default.REPORT.SPLIT_REPORT_ID,
            comment,
            created,
            merchant: merchant || Localize.translateLocal('iou.expense'),
            receipt,
            category,
            tag,
            taxCode,
            taxAmount,
            billable,
            pendingFields: isDistanceRequest ? { waypoints: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD } : undefined,
            attendees,
        },
    });
    // Important data is set on the draft distance transaction, such as the iouRequestType marking it as a distance request, so merge it into the optimistic split transaction
    if (isDistanceRequest) {
        splitTransaction = (0, expensify_common_1.fastMerge)(existingTransaction, splitTransaction, false);
    }
    // Note: The created action must be optimistically generated before the IOU action so there's no chance that the created action appears after the IOU action in the chat
    const splitCreatedReportAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(currentUserEmailForIOUSplit);
    const splitIOUReportAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT,
        amount,
        currency,
        comment,
        participants,
        transactionID: splitTransaction.transactionID,
        isOwnPolicyExpenseChat,
    });
    splitChatReport.lastReadTime = DateUtils_1.default.getDBTime();
    splitChatReport.lastMessageText = (0, ReportActionsUtils_1.getReportActionText)(splitIOUReportAction);
    splitChatReport.lastMessageHtml = (0, ReportActionsUtils_1.getReportActionHtml)(splitIOUReportAction);
    splitChatReport.lastActorAccountID = currentUserAccountID;
    splitChatReport.lastVisibleActionCreated = splitIOUReportAction.created;
    if (splitChatReport.participants && (0, ReportUtils_1.getReportNotificationPreference)(splitChatReport) === CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN) {
        splitChatReport.participants[currentUserAccountID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS };
    }
    // If we have an existing splitChatReport (group chat or workspace) use it's pending fields, otherwise indicate that we are adding a chat
    if (!existingSplitChatReport) {
        splitChatReport.pendingFields = {
            createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        };
    }
    const optimisticData = [
        {
            // Use set for new reports because it doesn't exist yet, is faster,
            // and we need the data to be available when we navigate to the chat page
            onyxMethod: existingSplitChatReport ? react_native_onyx_1.default.METHOD.MERGE : react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${splitChatReport.reportID}`,
            value: splitChatReport,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
            value: {
                action: iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE ? CONST_1.default.QUICK_ACTIONS.SPLIT_DISTANCE : CONST_1.default.QUICK_ACTIONS.SPLIT_MANUAL,
                chatReportID: splitChatReport.reportID,
                isFirstQuickAction: (0, EmptyObject_1.isEmptyObject)(quickAction),
            },
        },
        existingSplitChatReport
            ? {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
                value: {
                    [splitIOUReportAction.reportActionID]: splitIOUReportAction,
                },
            }
            : {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
                value: {
                    [splitCreatedReportAction.reportActionID]: splitCreatedReportAction,
                    [splitIOUReportAction.reportActionID]: splitIOUReportAction,
                },
            },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransaction.transactionID}`,
            value: splitTransaction,
        },
    ];
    if (!existingSplitChatReport) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${splitChatReport.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        });
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
            value: {
                ...(existingSplitChatReport ? {} : { [splitCreatedReportAction.reportActionID]: { pendingAction: null } }),
                [splitIOUReportAction.reportActionID]: { pendingAction: null },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransaction.transactionID}`,
            value: { pendingAction: null, pendingFields: null },
        },
    ];
    if (!existingSplitChatReport) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${splitChatReport.reportID}`,
            value: {
                isOptimisticReport: false,
            },
        });
    }
    const redundantParticipants = {};
    if (!existingSplitChatReport) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${splitChatReport.reportID}`,
            value: { pendingFields: { createChat: null }, participants: redundantParticipants },
        });
    }
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransaction.transactionID}`,
            value: {
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
                pendingAction: null,
                pendingFields: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
            value: quickAction ?? null,
        },
    ];
    if (existingSplitChatReport) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
            value: {
                [splitIOUReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
                },
            },
        });
    }
    else {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${splitChatReport.reportID}`,
            value: {
                errorFields: {
                    createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
            value: {
                [splitIOUReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
                },
            },
        });
    }
    // Loop through participants creating individual chats, iouReports and reportActionIDs as needed
    const currentUserAmount = splitShares?.[currentUserAccountID]?.amount ?? (0, IOUUtils_1.calculateAmount)(participants.length, amount, currency, true);
    const currentUserTaxAmount = (0, IOUUtils_1.calculateAmount)(participants.length, taxAmount, currency, true);
    const splits = [{ email: currentUserEmailForIOUSplit, accountID: currentUserAccountID, amount: currentUserAmount, taxAmount: currentUserTaxAmount }];
    const hasMultipleParticipants = participants.length > 1;
    participants.forEach((participant) => {
        // In a case when a participant is a workspace, even when a current user is not an owner of the workspace
        const isPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(participant);
        const splitAmount = splitShares?.[participant.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID]?.amount ?? (0, IOUUtils_1.calculateAmount)(participants.length, amount, currency, false);
        const splitTaxAmount = (0, IOUUtils_1.calculateAmount)(participants.length, taxAmount, currency, false);
        // To exclude someone from a split, the amount can be 0. The scenario for this is when creating a split from a group chat, we have remove the option to deselect users to exclude them.
        // We can input '0' next to someone we want to exclude.
        if (splitAmount === 0) {
            return;
        }
        // In case the participant is a workspace, email & accountID should remain undefined and won't be used in the rest of this code
        // participant.login is undefined when the request is initiated from a group DM with an unknown user, so we need to add a default
        const email = isOwnPolicyExpenseChat || isPolicyExpenseChat ? '' : (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(participant.login ?? '').toLowerCase();
        const accountID = isOwnPolicyExpenseChat || isPolicyExpenseChat ? 0 : Number(participant.accountID);
        if (email === currentUserEmailForIOUSplit) {
            return;
        }
        // STEP 1: Get existing chat report OR build a new optimistic one
        // If we only have one participant and the request was initiated from the global create menu, i.e. !existingGroupChatReportID, the oneOnOneChatReport is the groupChatReport
        let oneOnOneChatReport;
        let isNewOneOnOneChatReport = false;
        let shouldCreateOptimisticPersonalDetails = false;
        // If this is a split between two people only and the function
        // wasn't provided with an existing group chat report id
        // or, if the split is being made from the expense chat, then the oneOnOneChatReport is the same as the splitChatReport
        // in this case existingSplitChatReport will belong to the policy expense chat and we won't be
        // entering code that creates optimistic personal details
        if ((!hasMultipleParticipants && !existingSplitChatReportID) || isOwnPolicyExpenseChat || (0, ReportUtils_1.isOneOnOneChat)(splitChatReport)) {
            oneOnOneChatReport = splitChatReport;
            shouldCreateOptimisticPersonalDetails = !existingSplitChatReport && (0, ReportUtils_1.isOptimisticPersonalDetail)(accountID);
        }
        else {
            const existingChatReport = (0, ReportUtils_1.getChatByParticipants)([accountID, currentUserAccountID]);
            isNewOneOnOneChatReport = !existingChatReport;
            shouldCreateOptimisticPersonalDetails = isNewOneOnOneChatReport && (0, ReportUtils_1.isOptimisticPersonalDetail)(accountID);
            oneOnOneChatReport =
                existingChatReport ??
                    (0, ReportUtils_1.buildOptimisticChatReport)({
                        participantList: [accountID, currentUserAccountID],
                    });
        }
        // STEP 2: Get existing IOU/Expense report and update its total OR build a new optimistic one
        let oneOnOneIOUReport = oneOnOneChatReport.iouReportID ? allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${oneOnOneChatReport.iouReportID}`] : null;
        const isScanRequest = (0, TransactionUtils_1.isScanRequest)(splitTransaction);
        const shouldCreateNewOneOnOneIOUReport = (0, ReportUtils_1.shouldCreateNewMoneyRequestReport)(oneOnOneIOUReport, oneOnOneChatReport, isScanRequest);
        if (!oneOnOneIOUReport || shouldCreateNewOneOnOneIOUReport) {
            oneOnOneIOUReport = isOwnPolicyExpenseChat
                ? (0, ReportUtils_1.buildOptimisticExpenseReport)(oneOnOneChatReport.reportID, oneOnOneChatReport.policyID, currentUserAccountID, splitAmount, currency)
                : (0, ReportUtils_1.buildOptimisticIOUReport)(currentUserAccountID, accountID, splitAmount, oneOnOneChatReport.reportID, currency);
        }
        else if (isOwnPolicyExpenseChat) {
            // Because of the Expense reports are stored as negative values, we subtract the total from the amount
            if (oneOnOneIOUReport?.currency === currency) {
                if (typeof oneOnOneIOUReport.total === 'number') {
                    oneOnOneIOUReport.total -= splitAmount;
                }
                if (typeof oneOnOneIOUReport.unheldTotal === 'number') {
                    oneOnOneIOUReport.unheldTotal -= splitAmount;
                }
            }
        }
        else {
            oneOnOneIOUReport = (0, IOUUtils_1.updateIOUOwnerAndTotal)(oneOnOneIOUReport, currentUserAccountID, splitAmount, currency);
        }
        // STEP 3: Build optimistic transaction
        let oneOnOneTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
            originalTransactionID: splitTransaction.transactionID,
            transactionParams: {
                amount: (0, ReportUtils_1.isExpenseReport)(oneOnOneIOUReport) ? -splitAmount : splitAmount,
                currency,
                reportID: oneOnOneIOUReport.reportID,
                comment,
                created,
                merchant: merchant || Localize.translateLocal('iou.expense'),
                category,
                tag,
                taxCode,
                taxAmount: (0, ReportUtils_1.isExpenseReport)(oneOnOneIOUReport) ? -splitTaxAmount : splitTaxAmount,
                billable,
                source: CONST_1.default.IOU.TYPE.SPLIT,
            },
        });
        if (isDistanceRequest) {
            oneOnOneTransaction = (0, expensify_common_1.fastMerge)(existingTransaction, oneOnOneTransaction, false);
        }
        // STEP 4: Build optimistic reportActions. We need:
        // 1. CREATED action for the chatReport
        // 2. CREATED action for the iouReport
        // 3. IOU action for the iouReport
        // 4. Transaction Thread and the CREATED action for it
        // 5. REPORT_PREVIEW action for the chatReport
        const [oneOnOneCreatedActionForChat, oneOnOneCreatedActionForIOU, oneOnOneIOUAction, optimisticTransactionThread, optimisticCreatedActionForTransactionThread] = (0, ReportUtils_1.buildOptimisticMoneyRequestEntities)({
            iouReport: oneOnOneIOUReport,
            type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
            amount: splitAmount,
            currency,
            comment,
            payeeEmail: currentUserEmailForIOUSplit,
            participants: [participant],
            transactionID: oneOnOneTransaction.transactionID,
        });
        // Add optimistic personal details for new participants
        const oneOnOnePersonalDetailListAction = shouldCreateOptimisticPersonalDetails
            ? {
                [accountID]: {
                    accountID,
                    // Disabling this line since participant.displayName can be an empty string
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    displayName: (0, LocalePhoneNumber_1.formatPhoneNumber)(participant.displayName || email),
                    login: participant.login,
                    isOptimisticPersonalDetail: true,
                },
            }
            : {};
        if (shouldCreateOptimisticPersonalDetails) {
            // BE will send different participants. We clear the optimistic ones to avoid duplicated entries
            redundantParticipants[accountID] = null;
        }
        let oneOnOneReportPreviewAction = getReportPreviewAction(oneOnOneChatReport.reportID, oneOnOneIOUReport.reportID);
        if (oneOnOneReportPreviewAction) {
            oneOnOneReportPreviewAction = (0, ReportUtils_1.updateReportPreview)(oneOnOneIOUReport, oneOnOneReportPreviewAction);
        }
        else {
            oneOnOneReportPreviewAction = (0, ReportUtils_1.buildOptimisticReportPreview)(oneOnOneChatReport, oneOnOneIOUReport);
        }
        // Add category to optimistic policy recently used categories when a participant is a workspace
        const optimisticPolicyRecentlyUsedCategories = isPolicyExpenseChat ? (0, Category_1.buildOptimisticPolicyRecentlyUsedCategories)(participant.policyID, category) : [];
        const optimisticRecentlyUsedCurrencies = (0, Policy_1.buildOptimisticRecentlyUsedCurrencies)(currency);
        // Add tag to optimistic policy recently used tags when a participant is a workspace
        const optimisticPolicyRecentlyUsedTags = isPolicyExpenseChat ? (0, Tag_1.buildOptimisticPolicyRecentlyUsedTags)(participant.policyID, tag) : {};
        // STEP 5: Build Onyx Data
        const [oneOnOneOptimisticData, oneOnOneSuccessData, oneOnOneFailureData] = buildOnyxDataForMoneyRequest({
            isNewChatReport: isNewOneOnOneChatReport,
            shouldCreateNewMoneyRequestReport: shouldCreateNewOneOnOneIOUReport,
            isOneOnOneSplit: true,
            optimisticParams: {
                chat: {
                    report: oneOnOneChatReport,
                    createdAction: oneOnOneCreatedActionForChat,
                    reportPreviewAction: oneOnOneReportPreviewAction,
                },
                iou: {
                    report: oneOnOneIOUReport,
                    createdAction: oneOnOneCreatedActionForIOU,
                    action: oneOnOneIOUAction,
                },
                transactionParams: {
                    transaction: oneOnOneTransaction,
                    transactionThreadReport: optimisticTransactionThread,
                    transactionThreadCreatedReportAction: optimisticCreatedActionForTransactionThread,
                },
                policyRecentlyUsed: {
                    categories: optimisticPolicyRecentlyUsedCategories,
                    tags: optimisticPolicyRecentlyUsedTags,
                    currencies: optimisticRecentlyUsedCurrencies,
                },
                personalDetailListAction: oneOnOnePersonalDetailListAction,
            },
        });
        const individualSplit = {
            email,
            accountID,
            isOptimisticAccount: (0, ReportUtils_1.isOptimisticPersonalDetail)(accountID),
            amount: splitAmount,
            iouReportID: oneOnOneIOUReport.reportID,
            chatReportID: oneOnOneChatReport.reportID,
            transactionID: oneOnOneTransaction.transactionID,
            reportActionID: oneOnOneIOUAction.reportActionID,
            createdChatReportActionID: oneOnOneCreatedActionForChat.reportActionID,
            createdIOUReportActionID: oneOnOneCreatedActionForIOU.reportActionID,
            reportPreviewReportActionID: oneOnOneReportPreviewAction.reportActionID,
            transactionThreadReportID: optimisticTransactionThread.reportID,
            createdReportActionIDForThread: optimisticCreatedActionForTransactionThread?.reportActionID,
            taxAmount: splitTaxAmount,
        };
        splits.push(individualSplit);
        optimisticData.push(...oneOnOneOptimisticData);
        successData.push(...oneOnOneSuccessData);
        failureData.push(...oneOnOneFailureData);
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransaction.transactionID}`,
        value: {
            comment: {
                splits: splits.map((split) => ({ accountID: split.accountID, amount: split.amount })),
            },
        },
    });
    const splitData = {
        chatReportID: splitChatReport.reportID,
        transactionID: splitTransaction.transactionID,
        reportActionID: splitIOUReportAction.reportActionID,
        policyID: splitChatReport.policyID,
        chatType: splitChatReport.chatType,
    };
    if (!existingSplitChatReport) {
        splitData.createdReportActionID = splitCreatedReportAction.reportActionID;
    }
    return {
        splitData,
        splits,
        onyxData: { optimisticData, successData, failureData },
    };
}
/**
 * @param amount - always in smallest currency unit
 * @param existingSplitChatReportID - Either a group DM or a expense chat
 */
function splitBill({ participants, currentUserLogin, currentUserAccountID, amount, comment, currency, merchant, created, category = '', tag = '', billable = false, reimbursable = false, iouRequestType = CONST_1.default.IOU.REQUEST_TYPE.MANUAL, existingSplitChatReportID, splitShares = {}, splitPayerAccountIDs = [], taxCode = '', taxAmount = 0, }) {
    const parsedComment = (0, ReportUtils_1.getParsedComment)(comment);
    const { splitData, splits, onyxData } = createSplitsAndOnyxData({
        participants,
        currentUserLogin,
        currentUserAccountID,
        existingSplitChatReportID,
        transactionParams: {
            amount,
            comment: parsedComment,
            currency,
            merchant,
            created,
            category,
            tag,
            splitShares,
            billable,
            reimbursable,
            iouRequestType,
            taxCode,
            taxAmount,
        },
    });
    const parameters = {
        reportID: splitData.chatReportID,
        amount,
        splits: JSON.stringify(splits),
        currency,
        comment: parsedComment,
        category,
        merchant,
        created,
        tag,
        billable,
        reimbursable,
        transactionID: splitData.transactionID,
        reportActionID: splitData.reportActionID,
        createdReportActionID: splitData.createdReportActionID,
        policyID: splitData.policyID,
        chatType: splitData.chatType,
        splitPayerAccountIDs,
        taxCode,
        taxAmount,
        description: parsedComment,
    };
    (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    API.write(types_1.WRITE_COMMANDS.SPLIT_BILL, parameters, onyxData);
    react_native_1.InteractionManager.runAfterInteractions(() => (0, TransactionEdit_1.removeDraftTransaction)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID));
    dismissModalAndOpenReportInInboxTab(existingSplitChatReportID);
    (0, Report_1.notifyNewAction)(splitData.chatReportID, currentUserAccountID);
}
/**
 * @param amount - always in the smallest currency unit
 */
function splitBillAndOpenReport({ participants, currentUserLogin, currentUserAccountID, amount, comment, currency, merchant, created, category = '', tag = '', billable = false, reimbursable = false, iouRequestType = CONST_1.default.IOU.REQUEST_TYPE.MANUAL, splitShares = {}, splitPayerAccountIDs = [], taxCode = '', taxAmount = 0, existingSplitChatReportID, }) {
    const parsedComment = (0, ReportUtils_1.getParsedComment)(comment);
    const { splitData, splits, onyxData } = createSplitsAndOnyxData({
        participants,
        currentUserLogin,
        currentUserAccountID,
        existingSplitChatReportID,
        transactionParams: {
            amount,
            comment: parsedComment,
            currency,
            merchant,
            created,
            category,
            tag,
            splitShares,
            billable,
            reimbursable,
            iouRequestType,
            taxCode,
            taxAmount,
        },
    });
    const parameters = {
        reportID: splitData.chatReportID,
        amount,
        splits: JSON.stringify(splits),
        currency,
        merchant,
        created,
        comment: parsedComment,
        category,
        tag,
        billable,
        reimbursable,
        transactionID: splitData.transactionID,
        reportActionID: splitData.reportActionID,
        createdReportActionID: splitData.createdReportActionID,
        policyID: splitData.policyID,
        chatType: splitData.chatType,
        splitPayerAccountIDs,
        taxCode,
        taxAmount,
        description: parsedComment,
    };
    (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    API.write(types_1.WRITE_COMMANDS.SPLIT_BILL_AND_OPEN_REPORT, parameters, onyxData);
    react_native_1.InteractionManager.runAfterInteractions(() => (0, TransactionEdit_1.removeDraftTransaction)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID));
    dismissModalAndOpenReportInInboxTab(splitData.chatReportID);
    (0, Report_1.notifyNewAction)(splitData.chatReportID, currentUserAccountID);
}
/** Used exclusively for starting a split expense request that contains a receipt, the split request will be completed once the receipt is scanned
 *  or user enters details manually.
 *
 * @param existingSplitChatReportID - Either a group DM or a expense chat
 */
function startSplitBill({ participants, currentUserLogin, currentUserAccountID, comment, receipt, existingSplitChatReportID, billable = false, reimbursable = false, category = '', tag = '', currency, taxCode = '', taxAmount = 0, shouldPlaySound = true, }) {
    const currentUserEmailForIOUSplit = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(currentUserLogin);
    const participantAccountIDs = participants.map((participant) => Number(participant.accountID));
    const { splitChatReport, existingSplitChatReport } = getOrCreateOptimisticSplitChatReport(existingSplitChatReportID, participants, participantAccountIDs, currentUserAccountID);
    const isOwnPolicyExpenseChat = !!splitChatReport.isOwnPolicyExpenseChat;
    const parsedComment = (0, ReportUtils_1.getParsedComment)(comment);
    const { name: filename, source, state = CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY } = receipt;
    const receiptObject = { state, source };
    // ReportID is -2 (aka "deleted") on the group transaction
    const splitTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
        transactionParams: {
            amount: 0,
            currency,
            reportID: CONST_1.default.REPORT.SPLIT_REPORT_ID,
            comment: parsedComment,
            merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
            receipt: receiptObject,
            category,
            tag,
            taxCode,
            taxAmount,
            billable,
            reimbursable,
            filename,
        },
    });
    // Note: The created action must be optimistically generated before the IOU action so there's no chance that the created action appears after the IOU action in the chat
    const splitChatCreatedReportAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(currentUserEmailForIOUSplit);
    const splitIOUReportAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT,
        amount: 0,
        currency: CONST_1.default.CURRENCY.USD,
        comment: parsedComment,
        participants,
        transactionID: splitTransaction.transactionID,
        isOwnPolicyExpenseChat,
    });
    splitChatReport.lastReadTime = DateUtils_1.default.getDBTime();
    splitChatReport.lastMessageText = (0, ReportActionsUtils_1.getReportActionText)(splitIOUReportAction);
    splitChatReport.lastMessageHtml = (0, ReportActionsUtils_1.getReportActionHtml)(splitIOUReportAction);
    // If we have an existing splitChatReport (group chat or workspace) use it's pending fields, otherwise indicate that we are adding a chat
    if (!existingSplitChatReport) {
        splitChatReport.pendingFields = {
            createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        };
    }
    const optimisticData = [
        {
            // Use set for new reports because it doesn't exist yet, is faster,
            // and we need the data to be available when we navigate to the chat page
            onyxMethod: existingSplitChatReport ? react_native_onyx_1.default.METHOD.MERGE : react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${splitChatReport.reportID}`,
            value: splitChatReport,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
            value: {
                action: CONST_1.default.QUICK_ACTIONS.SPLIT_SCAN,
                chatReportID: splitChatReport.reportID,
                isFirstQuickAction: (0, EmptyObject_1.isEmptyObject)(quickAction),
            },
        },
        existingSplitChatReport
            ? {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
                value: {
                    [splitIOUReportAction.reportActionID]: splitIOUReportAction,
                },
            }
            : {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
                value: {
                    [splitChatCreatedReportAction.reportActionID]: splitChatCreatedReportAction,
                    [splitIOUReportAction.reportActionID]: splitIOUReportAction,
                },
            },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransaction.transactionID}`,
            value: splitTransaction,
        },
    ];
    if (!existingSplitChatReport) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${splitChatReport.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        });
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
            value: {
                ...(existingSplitChatReport ? {} : { [splitChatCreatedReportAction.reportActionID]: { pendingAction: null } }),
                [splitIOUReportAction.reportActionID]: { pendingAction: null },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransaction.transactionID}`,
            value: { pendingAction: null },
        },
    ];
    if (!existingSplitChatReport) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${splitChatReport.reportID}`,
            value: {
                isOptimisticReport: false,
            },
        });
    }
    const redundantParticipants = {};
    if (!existingSplitChatReport) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${splitChatReport.reportID}`,
            value: { pendingFields: { createChat: null }, participants: redundantParticipants },
        });
    }
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransaction.transactionID}`,
            value: {
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
            value: quickAction ?? null,
        },
    ];
    const retryParams = {
        participants: participants.map(({ icons, ...rest }) => rest),
        currentUserLogin,
        currentUserAccountID,
        comment,
        receipt: receiptObject,
        existingSplitChatReportID,
        billable,
        reimbursable,
        category,
        tag,
        currency,
        taxCode,
        taxAmount,
    };
    if (existingSplitChatReport) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
            value: {
                [splitIOUReportAction.reportActionID]: {
                    errors: getReceiptError(receipt, filename, undefined, undefined, CONST_1.default.IOU.ACTION_PARAMS.START_SPLIT_BILL, retryParams),
                },
            },
        });
    }
    else {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${splitChatReport.reportID}`,
            value: {
                errorFields: {
                    createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${splitChatReport.reportID}`,
            value: {
                [splitChatCreatedReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                },
                [splitIOUReportAction.reportActionID]: {
                    errors: getReceiptError(receipt, filename, undefined, undefined, CONST_1.default.IOU.ACTION_PARAMS.START_SPLIT_BILL, retryParams),
                },
            },
        });
    }
    const splits = [{ email: currentUserEmailForIOUSplit, accountID: currentUserAccountID }];
    participants.forEach((participant) => {
        // Disabling this line since participant.login can be an empty string
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const email = participant.isOwnPolicyExpenseChat ? '' : (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(participant.login || participant.text || '').toLowerCase();
        const accountID = participant.isOwnPolicyExpenseChat ? 0 : Number(participant.accountID);
        if (email === currentUserEmailForIOUSplit) {
            return;
        }
        // When splitting with a expense chat, we only need to supply the policyID and the workspace reportID as it's needed so we can update the report preview
        if (participant.isOwnPolicyExpenseChat) {
            splits.push({
                policyID: participant.policyID,
                chatReportID: splitChatReport.reportID,
            });
            return;
        }
        const participantPersonalDetails = allPersonalDetails[participant?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID];
        if (!participantPersonalDetails) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                value: {
                    [accountID]: {
                        accountID,
                        // Disabling this line since participant.displayName can be an empty string
                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                        displayName: (0, LocalePhoneNumber_1.formatPhoneNumber)(participant.displayName || email),
                        // Disabling this line since participant.login can be an empty string
                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                        login: participant.login || participant.text,
                        isOptimisticPersonalDetail: true,
                    },
                },
            });
            // BE will send different participants. We clear the optimistic ones to avoid duplicated entries
            redundantParticipants[accountID] = null;
        }
        splits.push({
            email,
            accountID,
        });
    });
    participants.forEach((participant) => {
        const isPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(participant);
        if (!isPolicyExpenseChat) {
            return;
        }
        const optimisticPolicyRecentlyUsedCategories = (0, Category_1.buildOptimisticPolicyRecentlyUsedCategories)(participant.policyID, category);
        const optimisticPolicyRecentlyUsedTags = (0, Tag_1.buildOptimisticPolicyRecentlyUsedTags)(participant.policyID, tag);
        const optimisticRecentlyUsedCurrencies = (0, Policy_1.buildOptimisticRecentlyUsedCurrencies)(currency);
        if (optimisticPolicyRecentlyUsedCategories.length > 0) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES}${participant.policyID}`,
                value: optimisticPolicyRecentlyUsedCategories,
            });
        }
        if (optimisticRecentlyUsedCurrencies.length > 0) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.RECENTLY_USED_CURRENCIES,
                value: optimisticRecentlyUsedCurrencies,
            });
        }
        if (!(0, EmptyObject_1.isEmptyObject)(optimisticPolicyRecentlyUsedTags)) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_TAGS}${participant.policyID}`,
                value: optimisticPolicyRecentlyUsedTags,
            });
        }
    });
    // Save the new splits array into the transaction's comment in case the user calls CompleteSplitBill while offline
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${splitTransaction.transactionID}`,
        value: {
            comment: {
                splits,
            },
        },
    });
    const parameters = {
        chatReportID: splitChatReport.reportID,
        reportActionID: splitIOUReportAction.reportActionID,
        transactionID: splitTransaction.transactionID,
        splits: JSON.stringify(splits),
        receipt,
        comment: parsedComment,
        category,
        tag,
        currency,
        isFromGroupDM: !existingSplitChatReport,
        billable,
        reimbursable,
        ...(existingSplitChatReport ? {} : { createdReportActionID: splitChatCreatedReportAction.reportActionID }),
        chatType: splitChatReport?.chatType,
        taxCode,
        taxAmount,
        description: parsedComment,
    };
    if (shouldPlaySound) {
        (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    }
    API.write(types_1.WRITE_COMMANDS.START_SPLIT_BILL, parameters, { optimisticData, successData, failureData });
    Navigation_1.default.dismissModalWithReport({ reportID: splitChatReport.reportID });
    (0, Report_1.notifyNewAction)(splitChatReport.reportID, currentUserAccountID);
    // Return the split transactionID for testing purpose
    return { splitTransactionID: splitTransaction.transactionID };
}
/** Used for editing a split expense while it's still scanning or when SmartScan fails, it completes a split expense started by startSplitBill above.
 *
 * @param chatReportID - The group chat or workspace reportID
 * @param reportAction - The split action that lives in the chatReport above
 * @param updatedTransaction - The updated **draft** split transaction
 * @param sessionAccountID - accountID of the current user
 * @param sessionEmail - email of the current user
 */
function completeSplitBill(chatReportID, reportAction, updatedTransaction, sessionAccountID, sessionEmail) {
    if (!reportAction) {
        return;
    }
    const parsedComment = (0, ReportUtils_1.getParsedComment)(Parser_1.default.htmlToMarkdown(updatedTransaction?.comment?.comment ?? ''));
    if (updatedTransaction?.comment) {
        // eslint-disable-next-line no-param-reassign
        updatedTransaction.comment.comment = parsedComment;
    }
    const currentUserEmailForIOUSplit = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(sessionEmail);
    const transactionID = updatedTransaction?.transactionID;
    const unmodifiedTransaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    // Save optimistic updated transaction and action
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                ...updatedTransaction,
                receipt: {
                    state: CONST_1.default.IOU.RECEIPT_STATE.OPEN,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReportID}`,
            value: {
                [reportAction.reportActionID]: {
                    lastModified: DateUtils_1.default.getDBTime(),
                    originalMessage: {
                        whisperedTo: [],
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: { pendingAction: null },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`,
            value: { pendingAction: null },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                ...unmodifiedTransaction,
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReportID}`,
            value: {
                [reportAction.reportActionID]: {
                    ...reportAction,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
                },
            },
        },
    ];
    const splitParticipants = updatedTransaction?.comment?.splits ?? [];
    const amount = updatedTransaction?.modifiedAmount;
    const currency = updatedTransaction?.modifiedCurrency;
    // Exclude the current user when calculating the split amount, `calculateAmount` takes it into account
    const splitAmount = (0, IOUUtils_1.calculateAmount)(splitParticipants.length - 1, amount ?? 0, currency ?? '', false);
    const splitTaxAmount = (0, IOUUtils_1.calculateAmount)(splitParticipants.length - 1, updatedTransaction?.taxAmount ?? 0, currency ?? '', false);
    const splits = [{ email: currentUserEmailForIOUSplit }];
    splitParticipants.forEach((participant) => {
        // Skip creating the transaction for the current user
        if (participant.email === currentUserEmailForIOUSplit) {
            return;
        }
        const isPolicyExpenseChat = !!participant.policyID;
        if (!isPolicyExpenseChat) {
            // In case this is still the optimistic accountID saved in the splits array, return early as we cannot know
            // if there is an existing chat between the split creator and this participant
            // Instead, we will rely on Auth generating the report IDs and the user won't see any optimistic chats or reports created
            const participantPersonalDetails = allPersonalDetails[participant?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID];
            if (!participantPersonalDetails || participantPersonalDetails.isOptimisticPersonalDetail) {
                splits.push({
                    email: participant.email,
                });
                return;
            }
        }
        let oneOnOneChatReport;
        let isNewOneOnOneChatReport = false;
        if (isPolicyExpenseChat) {
            // The expense chat reportID is saved in the splits array when starting a split expense with a workspace
            oneOnOneChatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${participant.chatReportID}`];
        }
        else {
            const existingChatReport = (0, ReportUtils_1.getChatByParticipants)(participant.accountID ? [participant.accountID, sessionAccountID] : []);
            isNewOneOnOneChatReport = !existingChatReport;
            oneOnOneChatReport =
                existingChatReport ??
                    (0, ReportUtils_1.buildOptimisticChatReport)({
                        participantList: participant.accountID ? [participant.accountID, sessionAccountID] : [],
                    });
        }
        let oneOnOneIOUReport = oneOnOneChatReport?.iouReportID ? allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${oneOnOneChatReport.iouReportID}`] : null;
        const shouldCreateNewOneOnOneIOUReport = (0, ReportUtils_1.shouldCreateNewMoneyRequestReport)(oneOnOneIOUReport, oneOnOneChatReport, false);
        if (!oneOnOneIOUReport || shouldCreateNewOneOnOneIOUReport) {
            oneOnOneIOUReport = isPolicyExpenseChat
                ? (0, ReportUtils_1.buildOptimisticExpenseReport)(oneOnOneChatReport?.reportID, participant.policyID, sessionAccountID, splitAmount, currency ?? '')
                : (0, ReportUtils_1.buildOptimisticIOUReport)(sessionAccountID, participant.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, splitAmount, oneOnOneChatReport?.reportID, currency ?? '');
        }
        else if (isPolicyExpenseChat) {
            if (typeof oneOnOneIOUReport?.total === 'number') {
                // Because of the Expense reports are stored as negative values, we subtract the total from the amount
                oneOnOneIOUReport.total -= splitAmount;
            }
        }
        else {
            oneOnOneIOUReport = (0, IOUUtils_1.updateIOUOwnerAndTotal)(oneOnOneIOUReport, sessionAccountID, splitAmount, currency ?? '');
        }
        const oneOnOneTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
            originalTransactionID: transactionID,
            transactionParams: {
                amount: isPolicyExpenseChat ? -splitAmount : splitAmount,
                currency: currency ?? '',
                reportID: oneOnOneIOUReport?.reportID,
                comment: parsedComment,
                created: updatedTransaction?.modifiedCreated,
                merchant: updatedTransaction?.modifiedMerchant,
                receipt: { ...updatedTransaction?.receipt, state: CONST_1.default.IOU.RECEIPT_STATE.OPEN },
                category: updatedTransaction?.category,
                tag: updatedTransaction?.tag,
                taxCode: updatedTransaction?.taxCode,
                taxAmount: isPolicyExpenseChat ? -splitTaxAmount : splitAmount,
                billable: updatedTransaction?.billable,
                source: CONST_1.default.IOU.TYPE.SPLIT,
                filename: updatedTransaction?.filename,
            },
        });
        const [oneOnOneCreatedActionForChat, oneOnOneCreatedActionForIOU, oneOnOneIOUAction, optimisticTransactionThread, optimisticCreatedActionForTransactionThread] = (0, ReportUtils_1.buildOptimisticMoneyRequestEntities)({
            iouReport: oneOnOneIOUReport,
            type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
            amount: splitAmount,
            currency: currency ?? '',
            comment: parsedComment,
            payeeEmail: currentUserEmailForIOUSplit,
            participants: [participant],
            transactionID: oneOnOneTransaction.transactionID,
        });
        let oneOnOneReportPreviewAction = getReportPreviewAction(oneOnOneChatReport?.reportID, oneOnOneIOUReport?.reportID);
        if (oneOnOneReportPreviewAction) {
            oneOnOneReportPreviewAction = (0, ReportUtils_1.updateReportPreview)(oneOnOneIOUReport, oneOnOneReportPreviewAction);
        }
        else {
            oneOnOneReportPreviewAction = (0, ReportUtils_1.buildOptimisticReportPreview)(oneOnOneChatReport, oneOnOneIOUReport, '', oneOnOneTransaction);
        }
        const [oneOnOneOptimisticData, oneOnOneSuccessData, oneOnOneFailureData] = buildOnyxDataForMoneyRequest({
            isNewChatReport: isNewOneOnOneChatReport,
            isOneOnOneSplit: true,
            shouldCreateNewMoneyRequestReport: shouldCreateNewOneOnOneIOUReport,
            optimisticParams: {
                chat: {
                    report: oneOnOneChatReport,
                    createdAction: oneOnOneCreatedActionForChat,
                    reportPreviewAction: oneOnOneReportPreviewAction,
                },
                iou: {
                    report: oneOnOneIOUReport,
                    createdAction: oneOnOneCreatedActionForIOU,
                    action: oneOnOneIOUAction,
                },
                transactionParams: {
                    transaction: oneOnOneTransaction,
                    transactionThreadReport: optimisticTransactionThread,
                    transactionThreadCreatedReportAction: optimisticCreatedActionForTransactionThread,
                },
                policyRecentlyUsed: {},
            },
        });
        splits.push({
            email: participant.email,
            accountID: participant.accountID,
            policyID: participant.policyID,
            iouReportID: oneOnOneIOUReport?.reportID,
            chatReportID: oneOnOneChatReport?.reportID,
            transactionID: oneOnOneTransaction.transactionID,
            reportActionID: oneOnOneIOUAction.reportActionID,
            createdChatReportActionID: oneOnOneCreatedActionForChat.reportActionID,
            createdIOUReportActionID: oneOnOneCreatedActionForIOU.reportActionID,
            reportPreviewReportActionID: oneOnOneReportPreviewAction.reportActionID,
            transactionThreadReportID: optimisticTransactionThread.reportID,
            createdReportActionIDForThread: optimisticCreatedActionForTransactionThread?.reportActionID,
        });
        optimisticData.push(...oneOnOneOptimisticData);
        successData.push(...oneOnOneSuccessData);
        failureData.push(...oneOnOneFailureData);
    });
    const { amount: transactionAmount, currency: transactionCurrency, created: transactionCreated, merchant: transactionMerchant, comment: transactionComment, category: transactionCategory, tag: transactionTag, taxCode: transactionTaxCode, taxAmount: transactionTaxAmount, billable: transactionBillable, } = (0, ReportUtils_1.getTransactionDetails)(updatedTransaction) ?? {};
    const parameters = {
        transactionID,
        amount: transactionAmount,
        currency: transactionCurrency,
        created: transactionCreated,
        merchant: transactionMerchant,
        comment: transactionComment,
        category: transactionCategory,
        tag: transactionTag,
        splits: JSON.stringify(splits),
        taxCode: transactionTaxCode,
        taxAmount: transactionTaxAmount,
        billable: transactionBillable,
        description: parsedComment,
    };
    (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    API.write(types_1.WRITE_COMMANDS.COMPLETE_SPLIT_BILL, parameters, { optimisticData, successData, failureData });
    react_native_1.InteractionManager.runAfterInteractions(() => (0, TransactionEdit_1.removeDraftTransaction)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID));
    dismissModalAndOpenReportInInboxTab(chatReportID);
    (0, Report_1.notifyNewAction)(chatReportID, sessionAccountID);
}
function setDraftSplitTransaction(transactionID, transactionChanges = {}, policy) {
    if (!transactionID) {
        return undefined;
    }
    let draftSplitTransaction = allDraftSplitTransactions[`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`];
    if (!draftSplitTransaction) {
        draftSplitTransaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    }
    const updatedTransaction = draftSplitTransaction
        ? (0, TransactionUtils_1.getUpdatedTransaction)({
            transaction: draftSplitTransaction,
            transactionChanges,
            isFromExpenseReport: false,
            shouldUpdateReceiptState: false,
            policy,
        })
        : null;
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, updatedTransaction);
}
/** Requests money based on a distance (e.g. mileage from a map) */
function createDistanceRequest(distanceRequestInformation) {
    const { report, participants, currentUserLogin = '', currentUserAccountID = -1, iouType = CONST_1.default.IOU.TYPE.SUBMIT, existingTransaction, transactionParams, policyParams = {}, backToReport, } = distanceRequestInformation;
    const { policy, policyCategories, policyTagList } = policyParams;
    const parsedComment = (0, ReportUtils_1.getParsedComment)(transactionParams.comment);
    transactionParams.comment = parsedComment;
    const { amount, comment, distance, currency, created, category, tag, taxAmount, taxCode, merchant, billable, reimbursable, validWaypoints, customUnitRateID = '', splitShares = {}, attendees, } = transactionParams;
    // If the report is an iou or expense report, we should get the linked chat report to be passed to the getMoneyRequestInformation function
    const isMoneyRequestReport = (0, ReportUtils_1.isMoneyRequestReport)(report);
    const currentChatReport = isMoneyRequestReport ? (0, ReportUtils_1.getReportOrDraftReport)(report?.chatReportID) : report;
    const moneyRequestReportID = isMoneyRequestReport ? report?.reportID : '';
    const isManualDistanceRequest = (0, EmptyObject_1.isEmptyObject)(validWaypoints);
    const optimisticReceipt = {
        source: receipt_generic_png_1.default,
        state: CONST_1.default.IOU.RECEIPT_STATE.OPEN,
    };
    let parameters;
    let onyxData;
    const sanitizedWaypoints = !isManualDistanceRequest ? (0, Transaction_1.sanitizeRecentWaypoints)(validWaypoints) : null;
    if (iouType === CONST_1.default.IOU.TYPE.SPLIT) {
        const { splitData, splits, onyxData: splitOnyxData, } = createSplitsAndOnyxData({
            participants,
            currentUserLogin: currentUserLogin ?? '',
            currentUserAccountID,
            existingSplitChatReportID: report?.reportID,
            transactionParams: {
                amount,
                comment,
                currency,
                merchant,
                created,
                category: category ?? '',
                tag: tag ?? '',
                splitShares,
                billable,
                iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.DISTANCE,
                taxCode,
                taxAmount,
                attendees,
            },
        });
        onyxData = splitOnyxData;
        // Splits don't use the IOU report param. The split transaction isn't linked to a report shown in the UI, it's linked to a special default reportID of -2.
        // Therefore, any params related to the IOU report are irrelevant and omitted below.
        parameters = {
            transactionID: splitData.transactionID,
            chatReportID: splitData.chatReportID,
            createdChatReportActionID: splitData.createdReportActionID,
            reportActionID: splitData.reportActionID,
            waypoints: JSON.stringify(sanitizedWaypoints),
            customUnitRateID,
            comment,
            created,
            category,
            tag,
            taxCode,
            taxAmount,
            billable,
            reimbursable,
            splits: JSON.stringify(splits),
            chatType: splitData.chatType,
            description: parsedComment,
            attendees: attendees ? JSON.stringify(attendees) : undefined,
        };
    }
    else {
        const participant = participants.at(0) ?? {};
        const { iouReport, chatReport, transaction, iouAction, createdChatReportActionID, createdIOUReportActionID, reportPreviewAction, transactionThreadReportID, createdReportActionIDForThread, payerEmail, onyxData: moneyRequestOnyxData, } = getMoneyRequestInformation({
            parentChatReport: currentChatReport,
            existingTransaction,
            moneyRequestReportID,
            participantParams: {
                participant,
                payeeAccountID: userAccountID,
                payeeEmail: currentUserEmail,
            },
            policyParams: {
                policy,
                policyCategories,
                policyTagList,
            },
            transactionParams: {
                amount,
                distance,
                currency,
                comment,
                created,
                merchant,
                receipt: !isManualDistanceRequest ? optimisticReceipt : undefined,
                category,
                tag,
                taxCode,
                taxAmount,
                billable,
                reimbursable,
                attendees,
            },
        });
        onyxData = moneyRequestOnyxData;
        if (transaction.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP || isManualDistanceRequest) {
            onyxData?.optimisticData?.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.NVP_LAST_DISTANCE_EXPENSE_TYPE,
                value: transaction.iouRequestType,
            });
        }
        parameters = {
            comment,
            iouReportID: iouReport.reportID,
            chatReportID: chatReport.reportID,
            transactionID: transaction.transactionID,
            reportActionID: iouAction.reportActionID,
            createdChatReportActionID,
            createdIOUReportActionID,
            reportPreviewReportActionID: reportPreviewAction.reportActionID,
            waypoints: JSON.stringify(sanitizedWaypoints),
            distance,
            created,
            category,
            tag,
            taxCode,
            taxAmount,
            billable,
            reimbursable,
            transactionThreadReportID,
            createdReportActionIDForThread,
            payerEmail,
            customUnitRateID,
            description: parsedComment,
            attendees: attendees ? JSON.stringify(attendees) : undefined,
        };
    }
    const recentServerValidatedWaypoints = (0, Transaction_1.getRecentWaypoints)().filter((item) => !item.pendingAction);
    onyxData?.failureData?.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.NVP_RECENT_WAYPOINTS}`,
        value: recentServerValidatedWaypoints,
    });
    (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    API.write(types_1.WRITE_COMMANDS.CREATE_DISTANCE_REQUEST, parameters, onyxData);
    react_native_1.InteractionManager.runAfterInteractions(() => (0, TransactionEdit_1.removeDraftTransaction)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID));
    const activeReportID = isMoneyRequestReport && report?.reportID ? report.reportID : parameters.chatReportID;
    dismissModalAndOpenReportInInboxTab(backToReport ?? activeReportID);
    if (!isMoneyRequestReport) {
        (0, Report_1.notifyNewAction)(activeReportID, userAccountID);
    }
}
/** Updates the amount and currency fields of an expense */
function updateMoneyRequestAmountAndCurrency({ transactionID, transactionThreadReportID, currency, amount, taxAmount, policy, policyTagList, policyCategories, taxCode, transactions, transactionViolations, }) {
    const transactionChanges = {
        amount,
        currency,
        taxCode,
        taxAmount,
    };
    const transactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`] ?? null;
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport?.parentReportID}`] ?? null;
    let data;
    if ((0, ReportUtils_1.isTrackExpenseReport)(transactionThreadReport) && (0, ReportUtils_1.isSelfDM)(parentReport)) {
        data = getUpdateTrackExpenseParams(transactionID, transactionThreadReportID, transactionChanges, policy);
    }
    else {
        data = getUpdateMoneyRequestParams(transactionID, transactionThreadReportID, transactionChanges, policy, policyTagList ?? null, policyCategories ?? null);
        (0, TransactionUtils_1.removeTransactionFromDuplicateTransactionViolation)(data.onyxData, transactionID, transactions, transactionViolations);
    }
    const { params, onyxData } = data;
    API.write(types_1.WRITE_COMMANDS.UPDATE_MONEY_REQUEST_AMOUNT_AND_CURRENCY, params, onyxData);
}
/**
 *
 * @param transactionID  - The transactionID of IOU
 * @param reportAction - The reportAction of the transaction in the IOU report
 * @return the url to navigate back once the money request is deleted
 */
function prepareToCleanUpMoneyRequest(transactionID, reportAction, shouldRemoveIOUTransactionID = true, transactionIDsPendingDeletion) {
    // STEP 1: Get all collections we're updating
    const iouReportID = (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.IOUReportID : undefined;
    const iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReportID}`] ?? null;
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.chatReportID}`];
    const reportPreviewAction = getReportPreviewAction(iouReport?.chatReportID, iouReport?.reportID);
    const transaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    const isTransactionOnHold = (0, TransactionUtils_1.isOnHold)(transaction);
    const transactionViolations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`];
    const transactionThreadID = reportAction.childReportID;
    let transactionThread = null;
    if (transactionThreadID) {
        transactionThread = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadID}`] ?? null;
    }
    // STEP 2: Decide if we need to:
    // 1. Delete the transactionThread - delete if there are no visible comments in the thread
    // 2. Update the moneyRequestPreview to show [Deleted expense] - update if the transactionThread exists AND it isn't being deleted
    // The current state is that we want to get rid of the [Deleted expense] breadcrumb,
    // so we never want to display it if transactionThreadID is present.
    const shouldDeleteTransactionThread = !!transactionThreadID;
    // STEP 3: Update the IOU reportAction and decide if the iouReport should be deleted. We delete the iouReport if there are no visible comments left in the report.
    const updatedReportAction = {
        [reportAction.reportActionID]: {
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            previousMessage: reportAction.message,
            message: [
                {
                    type: 'COMMENT',
                    html: '',
                    text: '',
                    isEdited: true,
                    isDeletedParentAction: shouldDeleteTransactionThread,
                },
            ],
            originalMessage: {
                IOUTransactionID: shouldRemoveIOUTransactionID ? null : transactionID,
            },
            errors: null,
        },
    };
    let canUserPerformWriteAction = true;
    if (chatReport) {
        canUserPerformWriteAction = !!(0, ReportUtils_1.canUserPerformWriteAction)(chatReport);
    }
    // If we are deleting the last transaction on a report, then delete the report too
    const shouldDeleteIOUReport = (0, ReportUtils_1.getReportTransactions)(iouReportID).filter((trans) => !transactionIDsPendingDeletion?.includes(trans.transactionID)).length === 1;
    // STEP 4: Update the iouReport and reportPreview with new totals and messages if it wasn't deleted
    let updatedIOUReport;
    const currency = (0, TransactionUtils_1.getCurrency)(transaction);
    const updatedReportPreviewAction = (0, cloneDeep_1.default)(reportPreviewAction ?? {});
    updatedReportPreviewAction.pendingAction = shouldDeleteIOUReport ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE : CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE;
    if (iouReport && (0, ReportUtils_1.isExpenseReport)(iouReport)) {
        updatedIOUReport = { ...iouReport };
        if (typeof updatedIOUReport.total === 'number' && currency === iouReport?.currency) {
            // Because of the Expense reports are stored as negative values, we add the total from the amount
            const amountDiff = (0, TransactionUtils_1.getAmount)(transaction, true);
            updatedIOUReport.total += amountDiff;
            if (!transaction?.reimbursable && typeof updatedIOUReport.nonReimbursableTotal === 'number') {
                updatedIOUReport.nonReimbursableTotal += amountDiff;
            }
            if (!isTransactionOnHold) {
                if (typeof updatedIOUReport.unheldTotal === 'number') {
                    updatedIOUReport.unheldTotal += amountDiff;
                }
                if (!transaction?.reimbursable && typeof updatedIOUReport.unheldNonReimbursableTotal === 'number') {
                    updatedIOUReport.unheldNonReimbursableTotal += amountDiff;
                }
            }
        }
    }
    else {
        updatedIOUReport = (0, IOUUtils_1.updateIOUOwnerAndTotal)(iouReport, reportAction.actorAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, (0, TransactionUtils_1.getAmount)(transaction, false), currency, true, false, isTransactionOnHold);
    }
    if (updatedIOUReport) {
        const lastVisibleAction = (0, ReportActionsUtils_1.getLastVisibleAction)(iouReport?.reportID, canUserPerformWriteAction, updatedReportAction);
        const iouReportLastMessageText = (0, ReportActionsUtils_1.getLastVisibleMessage)(iouReport?.reportID, canUserPerformWriteAction, updatedReportAction).lastMessageText;
        updatedIOUReport.lastMessageText = iouReportLastMessageText;
        updatedIOUReport.lastVisibleActionCreated = lastVisibleAction?.created;
    }
    const hasNonReimbursableTransactions = (0, ReportUtils_1.hasNonReimbursableTransactions)(iouReport?.reportID);
    const messageText = Localize.translateLocal(hasNonReimbursableTransactions ? 'iou.payerSpentAmount' : 'iou.payerOwesAmount', {
        payer: (0, ReportUtils_1.getPersonalDetailsForAccountID)(updatedIOUReport?.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID).login ?? '',
        amount: (0, CurrencyUtils_1.convertToDisplayString)(updatedIOUReport?.total, updatedIOUReport?.currency),
    });
    if ((0, ReportActionsUtils_1.getReportActionMessage)(updatedReportPreviewAction)) {
        if (Array.isArray(updatedReportPreviewAction?.message)) {
            const message = updatedReportPreviewAction.message.at(0);
            if (message) {
                message.text = messageText;
                message.html = messageText;
                message.deleted = shouldDeleteIOUReport ? DateUtils_1.default.getDBTime() : '';
            }
        }
        else if (!Array.isArray(updatedReportPreviewAction.message) && updatedReportPreviewAction.message) {
            updatedReportPreviewAction.message.text = messageText;
            updatedReportPreviewAction.message.deleted = shouldDeleteIOUReport ? DateUtils_1.default.getDBTime() : '';
        }
    }
    if (updatedReportPreviewAction && reportPreviewAction?.childMoneyRequestCount && reportPreviewAction?.childMoneyRequestCount > 0) {
        updatedReportPreviewAction.childMoneyRequestCount = reportPreviewAction.childMoneyRequestCount - 1;
    }
    return {
        shouldDeleteTransactionThread,
        shouldDeleteIOUReport,
        updatedReportAction,
        updatedIOUReport,
        updatedReportPreviewAction,
        transactionThreadID,
        transactionThread,
        chatReport,
        transaction,
        transactionViolations,
        reportPreviewAction,
        iouReport,
    };
}
/**
 * Calculate the URL to navigate to after a money request deletion
 * @param transactionID - The ID of the money request being deleted
 * @param reportAction - The report action associated with the money request
 * @param isSingleTransactionView - whether we are in the transaction thread report
 * @returns The URL to navigate to
 */
function getNavigationUrlOnMoneyRequestDelete(transactionID, reportAction, isSingleTransactionView = false) {
    if (!transactionID) {
        return undefined;
    }
    const { shouldDeleteTransactionThread, shouldDeleteIOUReport, iouReport } = prepareToCleanUpMoneyRequest(transactionID, reportAction);
    // Determine which report to navigate back to
    if (iouReport && isSingleTransactionView && shouldDeleteTransactionThread && !shouldDeleteIOUReport) {
        return ROUTES_1.default.REPORT_WITH_ID.getRoute(iouReport.reportID);
    }
    if (iouReport?.chatReportID && shouldDeleteIOUReport) {
        return ROUTES_1.default.REPORT_WITH_ID.getRoute(iouReport.chatReportID);
    }
    return undefined;
}
/**
 * Calculate the URL to navigate to after a track expense deletion
 * @param chatReportID - The ID of the chat report containing the track expense
 * @param transactionID - The ID of the track expense being deleted
 * @param reportAction - The report action associated with the track expense
 * @param isSingleTransactionView - Whether we're in single transaction view
 * @returns The URL to navigate to
 */
function getNavigationUrlAfterTrackExpenseDelete(chatReportID, transactionID, reportAction, isSingleTransactionView = false) {
    if (!chatReportID || !transactionID) {
        return undefined;
    }
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`] ?? null;
    // If not a self DM, handle it as a regular money request
    if (!(0, ReportUtils_1.isSelfDM)(chatReport)) {
        return getNavigationUrlOnMoneyRequestDelete(transactionID, reportAction, isSingleTransactionView);
    }
    // Only navigate if in single transaction view and the thread will be deleted
    if (isSingleTransactionView && chatReport?.reportID) {
        // Pop the deleted report screen before navigating. This prevents navigating to the Concierge chat due to the missing report.
        return ROUTES_1.default.REPORT_WITH_ID.getRoute(chatReport.reportID);
    }
    return undefined;
}
/**
 *
 * @param transactionID  - The transactionID of IOU
 * @param reportAction - The reportAction of the transaction in the IOU report
 * @param isSingleTransactionView - whether we are in the transaction thread report
 * @return the url to navigate back once the money request is deleted
 */
function cleanUpMoneyRequest(transactionID, reportAction, reportID, isSingleTransactionView = false) {
    const { shouldDeleteTransactionThread, shouldDeleteIOUReport, updatedReportAction, updatedIOUReport, updatedReportPreviewAction, transactionThreadID, chatReport, iouReport, reportPreviewAction, } = prepareToCleanUpMoneyRequest(transactionID, reportAction, false);
    const urlToNavigateBack = getNavigationUrlOnMoneyRequestDelete(transactionID, reportAction, isSingleTransactionView);
    // build Onyx data
    // Onyx operations to delete the transaction, update the IOU report action and chat report action
    const reportActionsOnyxUpdates = [];
    const onyxUpdates = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: null,
        },
    ];
    reportActionsOnyxUpdates.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
        value: {
            [reportAction.reportActionID]: shouldDeleteIOUReport
                ? null
                : {
                    pendingAction: null,
                },
        },
    });
    if (reportPreviewAction?.reportActionID) {
        reportActionsOnyxUpdates.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                [reportPreviewAction.reportActionID]: {
                    ...updatedReportPreviewAction,
                    pendingAction: null,
                    errors: null,
                },
            },
        });
    }
    // added the operation to delete associated transaction violations
    onyxUpdates.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
        value: null,
    });
    // added the operation to delete transaction thread
    if (shouldDeleteTransactionThread) {
        onyxUpdates.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadID}`,
            value: null,
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadID}`,
            value: null,
        });
    }
    // added operations to update IOU report and chat report
    reportActionsOnyxUpdates.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
        value: updatedReportAction,
    });
    onyxUpdates.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
        value: updatedIOUReport,
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
        value: (0, ReportUtils_1.getOutstandingChildRequest)(updatedIOUReport),
    });
    if (!shouldDeleteIOUReport && updatedReportPreviewAction.childMoneyRequestCount === 0) {
        onyxUpdates.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
            value: {
                hasOutstandingChildRequest: false,
            },
        });
    }
    if (shouldDeleteIOUReport) {
        let canUserPerformWriteAction = true;
        if (chatReport) {
            canUserPerformWriteAction = !!(0, ReportUtils_1.canUserPerformWriteAction)(chatReport);
        }
        const lastMessageText = (0, ReportActionsUtils_1.getLastVisibleMessage)(iouReport?.chatReportID, canUserPerformWriteAction, reportPreviewAction?.reportActionID ? { [reportPreviewAction.reportActionID]: null } : {})?.lastMessageText;
        const lastVisibleActionCreated = (0, ReportActionsUtils_1.getLastVisibleAction)(iouReport?.chatReportID, canUserPerformWriteAction, reportPreviewAction?.reportActionID ? { [reportPreviewAction.reportActionID]: null } : {})?.created;
        onyxUpdates.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
            value: {
                hasOutstandingChildRequest: false,
                iouReportID: null,
                lastMessageText,
                lastVisibleActionCreated,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
            value: null,
        });
    }
    (0, ReportActions_1.clearAllRelatedReportActionErrors)(reportID, reportAction);
    // First, update the reportActions to ensure related actions are not displayed.
    react_native_onyx_1.default.update(reportActionsOnyxUpdates).then(() => {
        Navigation_1.default.goBack(urlToNavigateBack);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            // After navigation, update the remaining data.
            react_native_onyx_1.default.update(onyxUpdates);
        });
    });
}
/**
 *
 * @param transactionID  - The transactionID of IOU
 * @param reportAction - The reportAction of the transaction in the IOU report
 * @param isSingleTransactionView - whether we are in the transaction thread report
 * @return the url to navigate back once the money request is deleted
 */
function deleteMoneyRequest(transactionID, reportAction, transactions, violations, isSingleTransactionView = false, transactionIDsPendingDeletion) {
    if (!transactionID) {
        return;
    }
    // STEP 1: Calculate and prepare the data
    const { shouldDeleteTransactionThread, shouldDeleteIOUReport, updatedReportAction, updatedIOUReport, updatedReportPreviewAction, transactionThreadID, transactionThread, chatReport, transaction, transactionViolations, iouReport, reportPreviewAction, } = prepareToCleanUpMoneyRequest(transactionID, reportAction, false, transactionIDsPendingDeletion);
    const urlToNavigateBack = getNavigationUrlOnMoneyRequestDelete(transactionID, reportAction, isSingleTransactionView);
    // STEP 2: Build Onyx data
    // The logic mostly resembles the cleanUpMoneyRequest function
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: { ...transaction, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE },
        },
    ];
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
        value: null,
    });
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: { ...transaction, pendingAction: null },
        },
    ];
    (0, TransactionUtils_1.removeTransactionFromDuplicateTransactionViolation)({ optimisticData, failureData }, transactionID, transactions, violations);
    if (shouldDeleteTransactionThread) {
        optimisticData.push(
        // Use merge instead of set to avoid deleting the report too quickly, which could cause a brief "not found" page to appear.
        // The remaining parts of the report object will be removed after the API call is successful.
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadID}`,
            value: {
                reportID: null,
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                participants: {
                    [userAccountID]: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadID}`,
            value: null,
        });
    }
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
        value: updatedReportAction,
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
        value: updatedIOUReport,
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
        value: (0, ReportUtils_1.getOutstandingChildRequest)(updatedIOUReport),
    });
    if (reportPreviewAction?.reportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: { [reportPreviewAction.reportActionID]: updatedReportPreviewAction },
        });
    }
    if (chatReport && updatedIOUReport && !shouldDeleteIOUReport && updatedReportPreviewAction?.childMoneyRequestCount === 0) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
            value: {
                hasOutstandingChildRequest: (0, ReportUtils_1.hasOutstandingChildRequest)(chatReport, updatedIOUReport),
            },
        });
    }
    if (shouldDeleteIOUReport) {
        let canUserPerformWriteAction = true;
        if (chatReport) {
            canUserPerformWriteAction = !!(0, ReportUtils_1.canUserPerformWriteAction)(chatReport);
        }
        const lastMessageText = (0, ReportActionsUtils_1.getLastVisibleMessage)(iouReport?.chatReportID, canUserPerformWriteAction, reportPreviewAction?.reportActionID ? { [reportPreviewAction.reportActionID]: null } : {})?.lastMessageText;
        const lastVisibleActionCreated = (0, ReportActionsUtils_1.getLastVisibleAction)(iouReport?.chatReportID, canUserPerformWriteAction, reportPreviewAction?.reportActionID ? { [reportPreviewAction.reportActionID]: null } : {})?.created;
        if (chatReport) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
                value: {
                    hasOutstandingChildRequest: (0, ReportUtils_1.hasOutstandingChildRequest)(chatReport, iouReport?.reportID),
                    iouReportID: null,
                    lastMessageText,
                    lastVisibleActionCreated,
                },
            });
        }
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
            value: {
                pendingFields: {
                    preview: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                },
            },
        });
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
            value: {
                [reportAction.reportActionID]: shouldDeleteIOUReport
                    ? null
                    : {
                        pendingAction: null,
                    },
            },
        },
    ];
    if (reportPreviewAction?.reportActionID) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                [reportPreviewAction.reportActionID]: {
                    pendingAction: null,
                    errors: null,
                },
            },
        });
    }
    // Ensure that any remaining data is removed upon successful completion, even if the server sends a report removal response.
    // This is done to prevent the removal update from lingering in the applyHTTPSOnyxUpdates function.
    if (shouldDeleteTransactionThread && transactionThread) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadID}`,
            value: null,
        });
    }
    if (shouldDeleteIOUReport) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
            value: null,
        });
    }
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
        value: null,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
        value: transactionViolations ?? null,
    });
    if (shouldDeleteTransactionThread) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadID}`,
            value: transactionThread,
        });
    }
    const errorKey = DateUtils_1.default.getMicroseconds();
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
        value: {
            [reportAction.reportActionID]: {
                ...reportAction,
                pendingAction: null,
                errors: {
                    [errorKey]: Localize.translateLocal('iou.error.genericDeleteFailureMessage'),
                },
            },
        },
    }, shouldDeleteIOUReport
        ? {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
            value: iouReport,
        }
        : {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
            value: iouReport,
        });
    if (reportPreviewAction?.reportActionID) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`,
            value: {
                [reportPreviewAction.reportActionID]: {
                    ...reportPreviewAction,
                    pendingAction: null,
                    errors: {
                        [errorKey]: Localize.translateLocal('iou.error.genericDeleteFailureMessage'),
                    },
                },
            },
        });
    }
    if (chatReport && shouldDeleteIOUReport) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: chatReport,
        });
    }
    if (!shouldDeleteIOUReport && updatedReportPreviewAction?.childMoneyRequestCount === 0) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport?.reportID}`,
            value: {
                hasOutstandingChildRequest: true,
            },
        });
    }
    const parameters = {
        transactionID,
        reportActionID: reportAction.reportActionID,
    };
    // STEP 3: Make the API request
    API.write(types_1.WRITE_COMMANDS.DELETE_MONEY_REQUEST, parameters, { optimisticData, successData, failureData });
    (0, CachedPDFPaths_1.clearByKey)(transactionID);
    return urlToNavigateBack;
}
function deleteTrackExpense(chatReportID, transactionID, reportAction, transactions, violations, isSingleTransactionView = false) {
    if (!chatReportID || !transactionID) {
        return;
    }
    const urlToNavigateBack = getNavigationUrlAfterTrackExpenseDelete(chatReportID, transactionID, reportAction, isSingleTransactionView);
    // STEP 1: Get all collections we're updating
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`] ?? null;
    if (!(0, ReportUtils_1.isSelfDM)(chatReport)) {
        deleteMoneyRequest(transactionID, reportAction, transactions, violations, isSingleTransactionView);
        return urlToNavigateBack;
    }
    const whisperAction = (0, ReportActionsUtils_1.getTrackExpenseActionableWhisper)(transactionID, chatReportID);
    const actionableWhisperReportActionID = whisperAction?.reportActionID;
    const { parameters, optimisticData, successData, failureData } = getDeleteTrackExpenseInformation(chatReportID, transactionID, reportAction, undefined, undefined, actionableWhisperReportActionID, CONST_1.default.REPORT.ACTIONABLE_TRACK_EXPENSE_WHISPER_RESOLUTION.NOTHING, false);
    // STEP 6: Make the API request
    API.write(types_1.WRITE_COMMANDS.DELETE_MONEY_REQUEST, parameters, { optimisticData, successData, failureData });
    (0, CachedPDFPaths_1.clearByKey)(transactionID);
    // STEP 7: Navigate the user depending on which page they are on and which resources were deleted
    return urlToNavigateBack;
}
/**
 * @param managerID - Account ID of the person sending the money
 * @param recipient - The user receiving the money
 */
function getSendMoneyParams(report, amount, currency, commentParam, paymentMethodType, managerID, recipient) {
    const recipientEmail = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(recipient.login ?? '');
    const recipientAccountID = Number(recipient.accountID);
    const comment = (0, ReportUtils_1.getParsedComment)(commentParam);
    const newIOUReportDetails = JSON.stringify({
        amount,
        currency,
        requestorEmail: recipientEmail,
        requestorAccountID: recipientAccountID,
        comment,
        idempotencyKey: expensify_common_1.Str.guid(),
    });
    let chatReport = !(0, EmptyObject_1.isEmptyObject)(report) && report?.reportID ? report : (0, ReportUtils_1.getChatByParticipants)([recipientAccountID, managerID]);
    let isNewChat = false;
    if (!chatReport) {
        chatReport = (0, ReportUtils_1.buildOptimisticChatReport)({
            participantList: [recipientAccountID, managerID],
        });
        isNewChat = true;
    }
    const optimisticIOUReport = (0, ReportUtils_1.buildOptimisticIOUReport)(recipientAccountID, managerID, amount, chatReport.reportID, currency, true);
    const optimisticTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
        transactionParams: {
            amount,
            currency,
            reportID: optimisticIOUReport.reportID,
            comment,
        },
    });
    const optimisticTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${optimisticTransaction.transactionID}`,
        value: optimisticTransaction,
    };
    const [optimisticCreatedActionForChat, optimisticCreatedActionForIOUReport, optimisticIOUReportAction, optimisticTransactionThread, optimisticCreatedActionForTransactionThread] = (0, ReportUtils_1.buildOptimisticMoneyRequestEntities)({
        iouReport: optimisticIOUReport,
        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
        amount,
        currency,
        comment,
        payeeEmail: recipientEmail,
        participants: [recipient],
        transactionID: optimisticTransaction.transactionID,
        paymentType: paymentMethodType,
        isSendMoneyFlow: true,
    });
    const reportPreviewAction = (0, ReportUtils_1.buildOptimisticReportPreview)(chatReport, optimisticIOUReport);
    // Change the method to set for new reports because it doesn't exist yet, is faster,
    // and we need the data to be available when we navigate to the chat page
    const optimisticChatReportData = isNewChat
        ? {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: {
                ...chatReport,
                // Set and clear pending fields on the chat report
                pendingFields: { createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
                lastReadTime: DateUtils_1.default.getDBTime(),
                lastVisibleActionCreated: reportPreviewAction.created,
            },
        }
        : {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: {
                ...chatReport,
                lastReadTime: DateUtils_1.default.getDBTime(),
                lastVisibleActionCreated: reportPreviewAction.created,
            },
        };
    const optimisticQuickActionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
        value: {
            action: CONST_1.default.QUICK_ACTIONS.SEND_MONEY,
            chatReportID: chatReport.reportID,
            isFirstQuickAction: (0, EmptyObject_1.isEmptyObject)(quickAction),
        },
    };
    const optimisticIOUReportData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticIOUReport.reportID}`,
        value: {
            ...optimisticIOUReport,
            lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(optimisticIOUReportAction),
            lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(optimisticIOUReportAction),
        },
    };
    const optimisticTransactionThreadData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTransactionThread.reportID}`,
        value: optimisticTransactionThread,
    };
    const optimisticIOUReportActionsData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticIOUReport.reportID}`,
        value: {
            [optimisticCreatedActionForIOUReport.reportActionID]: optimisticCreatedActionForIOUReport,
            [optimisticIOUReportAction.reportActionID]: {
                ...optimisticIOUReportAction,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        },
    };
    const optimisticChatReportActionsData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`,
        value: {
            [reportPreviewAction.reportActionID]: reportPreviewAction,
        },
    };
    const optimisticTransactionThreadReportActionsData = optimisticCreatedActionForTransactionThread
        ? {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThread.reportID}`,
            value: { [optimisticCreatedActionForTransactionThread?.reportActionID]: optimisticCreatedActionForTransactionThread },
        }
        : undefined;
    const optimisticMetaData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${chatReport.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${optimisticTransactionThread.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        },
    ];
    const successData = [];
    // Add optimistic personal details for recipient
    let optimisticPersonalDetailListData = null;
    const optimisticPersonalDetailListAction = isNewChat
        ? {
            [recipientAccountID]: {
                accountID: recipientAccountID,
                // Disabling this line since participant.displayName can be an empty string
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                displayName: recipient.displayName || recipient.login,
                login: recipient.login,
            },
        }
        : {};
    const redundantParticipants = {};
    if (!(0, EmptyObject_1.isEmptyObject)(optimisticPersonalDetailListAction)) {
        const successPersonalDetailListAction = {};
        // BE will send different participants. We clear the optimistic ones to avoid duplicated entries
        Object.keys(optimisticPersonalDetailListAction).forEach((accountIDKey) => {
            const accountID = Number(accountIDKey);
            successPersonalDetailListAction[accountID] = null;
            redundantParticipants[accountID] = null;
        });
        optimisticPersonalDetailListData = {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: optimisticPersonalDetailListAction,
        };
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: successPersonalDetailListAction,
        });
    }
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticIOUReport.reportID}`,
        value: {
            participants: redundantParticipants,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTransactionThread.reportID}`,
        value: {
            participants: redundantParticipants,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${optimisticTransactionThread.reportID}`,
        value: {
            isOptimisticReport: false,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticIOUReport.reportID}`,
        value: {
            [optimisticIOUReportAction.reportActionID]: {
                pendingAction: null,
            },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${optimisticTransaction.transactionID}`,
        value: { pendingAction: null },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${chatReport.reportID}`,
        value: {
            isOptimisticReport: false,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`,
        value: {
            [reportPreviewAction.reportActionID]: {
                pendingAction: null,
                childLastActorAccountID: reportPreviewAction.childLastActorAccountID,
            },
        },
    });
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${optimisticTransaction.transactionID}`,
            value: {
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.other'),
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTransactionThread.reportID}`,
            value: {
                errorFields: {
                    createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
            value: quickAction ?? null,
        },
    ];
    if (optimisticCreatedActionForTransactionThread?.reportActionID) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThread.reportID}`,
            value: { [optimisticCreatedActionForTransactionThread?.reportActionID]: { pendingAction: null } },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThread.reportID}`,
            value: { [optimisticCreatedActionForTransactionThread?.reportActionID]: { errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage') } },
        });
    }
    // Now, let's add the data we need just when we are creating a new chat report
    if (isNewChat) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: { pendingFields: null, participants: redundantParticipants },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: {
                errorFields: {
                    createChat: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticIOUReport.reportID}`,
            value: {
                [optimisticIOUReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericCreateFailureMessage'),
                },
            },
        });
        const optimisticChatReportActionsValue = optimisticChatReportActionsData.value;
        if (optimisticChatReportActionsValue) {
            // Add an optimistic created action to the optimistic chat reportActions data
            optimisticChatReportActionsValue[optimisticCreatedActionForChat.reportActionID] = optimisticCreatedActionForChat;
        }
    }
    else {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticIOUReport.reportID}`,
            value: {
                [optimisticIOUReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.other'),
                },
            },
        });
    }
    const optimisticData = [
        optimisticChatReportData,
        optimisticQuickActionData,
        optimisticIOUReportData,
        optimisticChatReportActionsData,
        optimisticIOUReportActionsData,
        optimisticTransactionData,
        optimisticTransactionThreadData,
        ...optimisticMetaData,
    ];
    if (optimisticTransactionThreadReportActionsData) {
        optimisticData.push(optimisticTransactionThreadReportActionsData);
    }
    if (!(0, EmptyObject_1.isEmptyObject)(optimisticPersonalDetailListData)) {
        optimisticData.push(optimisticPersonalDetailListData);
    }
    return {
        params: {
            iouReportID: optimisticIOUReport.reportID,
            chatReportID: chatReport.reportID,
            reportActionID: optimisticIOUReportAction.reportActionID,
            paymentMethodType,
            transactionID: optimisticTransaction.transactionID,
            newIOUReportDetails,
            createdReportActionID: isNewChat ? optimisticCreatedActionForChat.reportActionID : undefined,
            reportPreviewReportActionID: reportPreviewAction.reportActionID,
            createdIOUReportActionID: optimisticCreatedActionForIOUReport.reportActionID,
            transactionThreadReportID: optimisticTransactionThread.reportID,
            createdReportActionIDForThread: optimisticCreatedActionForTransactionThread?.reportActionID,
        },
        optimisticData,
        successData,
        failureData,
    };
}
function getHoldReportActionsAndTransactions(reportID) {
    const iouReportActions = (0, ReportActionsUtils_1.getAllReportActions)(reportID);
    const holdReportActions = [];
    const holdTransactions = [];
    Object.values(iouReportActions).forEach((action) => {
        const transactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) ? (0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUTransactionID : undefined;
        const transaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
        if (transaction?.comment?.hold) {
            holdReportActions.push(action);
            holdTransactions.push(transaction);
        }
    });
    return { holdReportActions, holdTransactions };
}
function getReportFromHoldRequestsOnyxData(chatReport, iouReport, recipient) {
    const { holdReportActions, holdTransactions } = getHoldReportActionsAndTransactions(iouReport?.reportID);
    const firstHoldTransaction = holdTransactions.at(0);
    const newParentReportActionID = NumberUtils.rand64();
    const coefficient = (0, ReportUtils_1.isExpenseReport)(iouReport) ? -1 : 1;
    const isPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(chatReport);
    const holdAmount = ((iouReport?.total ?? 0) - (iouReport?.unheldTotal ?? 0)) * coefficient;
    const holdNonReimbursableAmount = ((iouReport?.nonReimbursableTotal ?? 0) - (iouReport?.unheldNonReimbursableTotal ?? 0)) * coefficient;
    const optimisticExpenseReport = isPolicyExpenseChat
        ? (0, ReportUtils_1.buildOptimisticExpenseReport)(chatReport.reportID, chatReport.policyID ?? iouReport?.policyID, recipient.accountID ?? 1, holdAmount, iouReport?.currency ?? '', holdNonReimbursableAmount, newParentReportActionID)
        : (0, ReportUtils_1.buildOptimisticIOUReport)(iouReport?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, iouReport?.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID, holdAmount, chatReport.reportID, iouReport?.currency ?? '', false, newParentReportActionID);
    const optimisticExpenseReportPreview = (0, ReportUtils_1.buildOptimisticReportPreview)(chatReport, optimisticExpenseReport, '', firstHoldTransaction, optimisticExpenseReport.reportID, newParentReportActionID);
    const updateHeldReports = {};
    const addHoldReportActions = {};
    const addHoldReportActionsSuccess = {};
    const deleteHoldReportActions = {};
    const optimisticHoldReportExpenseActionIDs = [];
    holdReportActions.forEach((holdReportAction) => {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(holdReportAction);
        deleteHoldReportActions[holdReportAction.reportActionID] = {
            message: [
                {
                    deleted: DateUtils_1.default.getDBTime(),
                    type: CONST_1.default.REPORT.MESSAGE.TYPE.TEXT,
                    text: '',
                },
            ],
        };
        const reportActionID = NumberUtils.rand64();
        addHoldReportActions[reportActionID] = {
            ...holdReportAction,
            reportActionID,
            originalMessage: {
                ...originalMessage,
                IOUReportID: optimisticExpenseReport.reportID,
            },
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        };
        addHoldReportActionsSuccess[reportActionID] = {
            pendingAction: null,
        };
        const heldReport = (0, ReportUtils_1.getReportOrDraftReport)(holdReportAction.childReportID);
        if (heldReport) {
            optimisticHoldReportExpenseActionIDs.push({ optimisticReportActionID: reportActionID, oldReportActionID: holdReportAction.reportActionID });
            updateHeldReports[`${ONYXKEYS_1.default.COLLECTION.REPORT}${heldReport.reportID}`] = {
                parentReportActionID: reportActionID,
                parentReportID: optimisticExpenseReport.reportID,
                chatReportID: optimisticExpenseReport.reportID,
            };
        }
    });
    const updateHeldTransactions = {};
    holdTransactions.forEach((transaction) => {
        updateHeldTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`] = {
            reportID: optimisticExpenseReport.reportID,
        };
    });
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: {
                iouReportID: optimisticExpenseReport.reportID,
                lastVisibleActionCreated: optimisticExpenseReportPreview.created,
            },
        },
        // add new optimistic expense report
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticExpenseReport.reportID}`,
            value: {
                ...optimisticExpenseReport,
                unheldTotal: 0,
                unheldNonReimbursableTotal: 0,
            },
        },
        // add preview report action to main chat
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`,
            value: {
                [optimisticExpenseReportPreview.reportActionID]: optimisticExpenseReportPreview,
            },
        },
        // remove hold report actions from old iou report
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
            value: deleteHoldReportActions,
        },
        // add hold report actions to new iou report
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticExpenseReport.reportID}`,
            value: addHoldReportActions,
        },
        // update held reports with new parentReportActionID
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}`,
            value: updateHeldReports,
        },
        // update transactions with new iouReportID
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}`,
            value: updateHeldTransactions,
        },
    ];
    const bringReportActionsBack = {};
    holdReportActions.forEach((reportAction) => {
        bringReportActionsBack[reportAction.reportActionID] = reportAction;
    });
    const bringHeldTransactionsBack = {};
    holdTransactions.forEach((transaction) => {
        bringHeldTransactionsBack[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`] = transaction;
    });
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`,
            value: {
                [optimisticExpenseReportPreview.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticExpenseReport.reportID}`,
            value: addHoldReportActionsSuccess,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: {
                iouReportID: chatReport.iouReportID,
                lastVisibleActionCreated: chatReport.lastVisibleActionCreated,
            },
        },
        // remove added optimistic expense report
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticExpenseReport.reportID}`,
            value: null,
        },
        // remove preview report action from the main chat
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`,
            value: {
                [optimisticExpenseReportPreview.reportActionID]: null,
            },
        },
        // add hold report actions back to old iou report
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
            value: bringReportActionsBack,
        },
        // remove hold report actions from the new iou report
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticExpenseReport.reportID}`,
            value: null,
        },
        // add hold transactions back to old iou report
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}`,
            value: bringHeldTransactionsBack,
        },
    ];
    return {
        optimisticData,
        optimisticHoldActionID: optimisticExpenseReportPreview.reportActionID,
        failureData,
        successData,
        optimisticHoldReportID: optimisticExpenseReport.reportID,
        optimisticHoldReportExpenseActionIDs,
    };
}
function getPayMoneyRequestParams(initialChatReport, iouReport, recipient, paymentMethodType, full, payAsBusiness, bankAccountID, paymentPolicyID, lastUsedPaymentMethod, existingB2BInvoiceReport) {
    const isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(iouReport);
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const activePolicy = (0, PolicyUtils_1.getPolicy)(activePolicyID);
    let payerPolicyID = activePolicyID;
    let chatReport = initialChatReport;
    let policyParams = {};
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    const shouldCreatePolicy = !activePolicy || !(0, PolicyUtils_1.isPolicyAdmin)(activePolicy) || !(0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy);
    if ((0, ReportUtils_1.isIndividualInvoiceRoom)(chatReport) && payAsBusiness && shouldCreatePolicy) {
        payerPolicyID = (0, Policy_1.generatePolicyID)();
        const { optimisticData: policyOptimisticData, failureData: policyFailureData, successData: policySuccessData, params, } = (0, Policy_1.buildPolicyData)({
            policyOwnerEmail: currentUserEmail,
            makeMeAdmin: true,
            policyID: payerPolicyID,
        });
        const { adminsChatReportID, adminsCreatedReportActionID, expenseChatReportID, expenseCreatedReportActionID, customUnitRateID, customUnitID, ownerEmail, policyName } = params;
        policyParams = {
            policyID: payerPolicyID,
            adminsChatReportID,
            adminsCreatedReportActionID,
            expenseChatReportID,
            expenseCreatedReportActionID,
            customUnitRateID,
            customUnitID,
            ownerEmail,
            policyName,
        };
        optimisticData.push(...policyOptimisticData, { onyxMethod: react_native_onyx_1.default.METHOD.MERGE, key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, value: payerPolicyID });
        successData.push(...policySuccessData);
        failureData.push(...policyFailureData, { onyxMethod: react_native_onyx_1.default.METHOD.MERGE, key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, value: activePolicyID ?? null });
    }
    if ((0, ReportUtils_1.isIndividualInvoiceRoom)(chatReport) && payAsBusiness && existingB2BInvoiceReport) {
        chatReport = existingB2BInvoiceReport;
    }
    let total = (iouReport?.total ?? 0) - (iouReport?.nonReimbursableTotal ?? 0);
    if ((0, ReportUtils_1.hasHeldExpenses)(iouReport?.reportID) && !full && !!iouReport?.unheldTotal) {
        total = iouReport.unheldTotal - (iouReport?.unheldNonReimbursableTotal ?? 0);
    }
    const optimisticIOUReportAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
        amount: (0, ReportUtils_1.isExpenseReport)(iouReport) ? -total : total,
        currency: iouReport?.currency ?? '',
        comment: '',
        participants: [recipient],
        transactionID: '',
        paymentType: paymentMethodType,
        iouReportID: iouReport?.reportID,
        isSettlingUp: true,
        payAsBusiness,
        bankAccountID,
    });
    // In some instances, the report preview action might not be available to the payer (only whispered to the requestor)
    // hence we need to make the updates to the action safely.
    let optimisticReportPreviewAction = null;
    const reportPreviewAction = getReportPreviewAction(chatReport.reportID, iouReport?.reportID);
    if (reportPreviewAction) {
        optimisticReportPreviewAction = (0, ReportUtils_1.updateReportPreview)(iouReport, reportPreviewAction, true);
    }
    let currentNextStep = null;
    let optimisticNextStep = null;
    if (!isInvoiceReport) {
        currentNextStep = allNextSteps[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${iouReport?.reportID}`] ?? null;
        optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(iouReport, CONST_1.default.REPORT.STATUS_NUM.REIMBURSED);
    }
    const optimisticChatReport = {
        ...chatReport,
        lastReadTime: DateUtils_1.default.getDBTime(),
        hasOutstandingChildRequest: (0, ReportUtils_1.hasOutstandingChildRequest)(chatReport, iouReport?.reportID),
        iouReportID: null,
        lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(optimisticIOUReportAction),
        lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(optimisticIOUReportAction),
    };
    if ((0, ReportUtils_1.isIndividualInvoiceRoom)(chatReport) && payAsBusiness && payerPolicyID) {
        optimisticChatReport.invoiceReceiver = {
            type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS,
            policyID: payerPolicyID,
        };
    }
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
        value: optimisticChatReport,
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
        value: {
            [optimisticIOUReportAction.reportActionID]: {
                ...optimisticIOUReportAction,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
        value: {
            lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(optimisticIOUReportAction),
            lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(optimisticIOUReportAction),
            lastVisibleActionCreated: optimisticIOUReportAction.created,
            hasOutstandingChildRequest: false,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            pendingFields: {
                preview: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                reimbursed: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                partial: full ? null : CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
            },
            errors: null,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${iouReport?.reportID}`,
        value: optimisticNextStep,
    });
    if (iouReport?.policyID) {
        const prevLastUsedPaymentMethod = lastUsedPaymentMethod?.lastUsed?.name;
        const usedPaymentOption = paymentPolicyID ?? paymentMethodType;
        const optimisticLastPaymentMethod = {
            [iouReport.policyID]: {
                ...(iouReport.type ? { [iouReport.type]: { name: usedPaymentOption } } : {}),
                ...(isInvoiceReport ? { invoice: { name: paymentMethodType, bankAccountID } } : {}),
                lastUsed: {
                    name: prevLastUsedPaymentMethod !== usedPaymentOption && !!prevLastUsedPaymentMethod ? prevLastUsedPaymentMethod : usedPaymentOption,
                },
            },
        };
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
            value: optimisticLastPaymentMethod,
        });
    }
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
        value: {
            pendingFields: {
                preview: null,
                reimbursed: null,
                partial: null,
            },
            errors: null,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
        value: {
            [optimisticIOUReportAction.reportActionID]: {
                pendingAction: null,
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
        value: {
            [optimisticIOUReportAction.reportActionID]: {
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.other'),
            },
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport?.reportID}`,
        value: {
            ...iouReport,
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
        value: chatReport,
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${iouReport?.reportID}`,
        value: currentNextStep,
    });
    // In case the report preview action is loaded locally, let's update it.
    if (optimisticReportPreviewAction) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`,
            value: {
                [optimisticReportPreviewAction.reportActionID]: optimisticReportPreviewAction,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`,
            value: {
                [optimisticReportPreviewAction.reportActionID]: {
                    created: optimisticReportPreviewAction.created,
                },
            },
        });
    }
    // Optimistically unhold all transactions if we pay all requests
    if (full) {
        const reportTransactions = (0, ReportUtils_1.getReportTransactions)(iouReport?.reportID);
        for (const transaction of reportTransactions) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
                value: {
                    comment: {
                        hold: null,
                    },
                },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
                value: {
                    comment: {
                        hold: transaction.comment?.hold,
                    },
                },
            });
        }
        const optimisticTransactionViolations = reportTransactions.map(({ transactionID }) => {
            return {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
                value: null,
            };
        });
        optimisticData.push(...optimisticTransactionViolations);
        const failureTransactionViolations = reportTransactions.map(({ transactionID }) => {
            const violations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? [];
            return {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
                value: violations,
            };
        });
        failureData.push(...failureTransactionViolations);
    }
    let optimisticHoldReportID;
    let optimisticHoldActionID;
    let optimisticHoldReportExpenseActionIDs;
    if (!full) {
        const holdReportOnyxData = getReportFromHoldRequestsOnyxData(chatReport, iouReport, recipient);
        optimisticData.push(...holdReportOnyxData.optimisticData);
        successData.push(...holdReportOnyxData.successData);
        failureData.push(...holdReportOnyxData.failureData);
        optimisticHoldReportID = holdReportOnyxData.optimisticHoldReportID;
        optimisticHoldActionID = holdReportOnyxData.optimisticHoldActionID;
        optimisticHoldReportExpenseActionIDs = JSON.stringify(holdReportOnyxData.optimisticHoldReportExpenseActionIDs);
    }
    return {
        params: {
            iouReportID: iouReport?.reportID,
            chatReportID: chatReport.reportID,
            reportActionID: optimisticIOUReportAction.reportActionID,
            paymentMethodType,
            full,
            amount: Math.abs(total),
            optimisticHoldReportID,
            optimisticHoldActionID,
            optimisticHoldReportExpenseActionIDs,
            ...policyParams,
        },
        optimisticData,
        successData,
        failureData,
    };
}
/**
 * @param managerID - Account ID of the person sending the money
 * @param recipient - The user receiving the money
 */
function sendMoneyElsewhere(report, amount, currency, comment, managerID, recipient) {
    const { params, optimisticData, successData, failureData } = getSendMoneyParams(report, amount, currency, comment, CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, managerID, recipient);
    (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    API.write(types_1.WRITE_COMMANDS.SEND_MONEY_ELSEWHERE, params, { optimisticData, successData, failureData });
    dismissModalAndOpenReportInInboxTab(params.chatReportID);
    (0, Report_1.notifyNewAction)(params.chatReportID, managerID);
}
/**
 * @param managerID - Account ID of the person sending the money
 * @param recipient - The user receiving the money
 */
function sendMoneyWithWallet(report, amount, currency, comment, managerID, recipient) {
    const { params, optimisticData, successData, failureData } = getSendMoneyParams(report, amount, currency, comment, CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY, managerID, recipient);
    (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    API.write(types_1.WRITE_COMMANDS.SEND_MONEY_WITH_WALLET, params, { optimisticData, successData, failureData });
    dismissModalAndOpenReportInInboxTab(params.chatReportID);
    (0, Report_1.notifyNewAction)(params.chatReportID, managerID);
}
function canApproveIOU(iouReport, policy, iouTransactions) {
    // Only expense reports can be approved
    if (!(0, ReportUtils_1.isExpenseReport)(iouReport) || !(policy && (0, PolicyUtils_1.isPaidGroupPolicy)(policy))) {
        return false;
    }
    const isOnSubmitAndClosePolicy = (0, PolicyUtils_1.isSubmitAndClose)(policy);
    if (isOnSubmitAndClosePolicy) {
        return false;
    }
    const managerID = iouReport?.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const isCurrentUserManager = managerID === userAccountID;
    const isOpenExpenseReport = (0, ReportUtils_1.isOpenExpenseReport)(iouReport);
    const isApproved = (0, ReportUtils_1.isReportApproved)({ report: iouReport });
    const iouSettled = (0, ReportUtils_1.isSettled)(iouReport);
    const reportNameValuePairs = allReportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${iouReport?.reportID}`];
    const isArchivedExpenseReport = (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs);
    const reportTransactions = iouTransactions ?? (0, ReportUtils_1.getReportTransactions)(iouReport?.reportID);
    const hasOnlyPendingCardOrScanningTransactions = reportTransactions.length > 0 && reportTransactions.every(TransactionUtils_1.isPendingCardOrScanningTransaction);
    if (hasOnlyPendingCardOrScanningTransactions) {
        return false;
    }
    const isPayAtEndExpenseReport = (0, ReportUtils_1.isPayAtEndExpenseReport)(iouReport ?? undefined, reportTransactions);
    const isClosedReport = (0, ReportUtils_1.isClosedReport)(iouReport);
    return (reportTransactions.length > 0 && isCurrentUserManager && !isOpenExpenseReport && !isApproved && !iouSettled && !isArchivedExpenseReport && !isPayAtEndExpenseReport && !isClosedReport);
}
function canUnapproveIOU(iouReport, policy) {
    return ((0, ReportUtils_1.isExpenseReport)(iouReport) &&
        ((0, ReportUtils_1.isReportManager)(iouReport) || (0, PolicyUtils_1.isPolicyAdmin)(policy)) &&
        (0, ReportUtils_1.isReportApproved)({ report: iouReport }) &&
        !(0, PolicyUtils_1.isSubmitAndClose)(policy) &&
        !iouReport?.isWaitingOnBankAccount);
}
function canIOUBePaid(iouReport, chatReport, policy, transactions, onlyShowPayElsewhere = false, chatReportRNVP, invoiceReceiverPolicy, shouldCheckApprovedState = true) {
    const reportNameValuePairs = chatReportRNVP ?? allReportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${chatReport?.reportID}`];
    const isChatReportArchived = (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs);
    const iouSettled = (0, ReportUtils_1.isSettled)(iouReport);
    if ((0, EmptyObject_1.isEmptyObject)(iouReport)) {
        return false;
    }
    if (policy?.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO) {
        if (!onlyShowPayElsewhere) {
            return false;
        }
        if (iouReport?.statusNum !== CONST_1.default.REPORT.STATUS_NUM.SUBMITTED) {
            return false;
        }
    }
    if ((0, ReportUtils_1.isInvoiceReport)(iouReport)) {
        if (isChatReportArchived || iouSettled || (0, ReportUtils_1.isOpenInvoiceReport)(iouReport)) {
            return false;
        }
        if (chatReport?.invoiceReceiver?.type === CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL) {
            return chatReport?.invoiceReceiver?.accountID === userAccountID;
        }
        // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
        // eslint-disable-next-line deprecation/deprecation
        return (invoiceReceiverPolicy ?? (0, PolicyUtils_1.getPolicy)(chatReport?.invoiceReceiver?.policyID))?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    }
    const isPayer = (0, ReportUtils_1.isPayer)({
        email: currentUserEmail,
        accountID: userAccountID,
    }, iouReport, onlyShowPayElsewhere, policy);
    const isOpenExpenseReport = (0, ReportUtils_1.isOpenExpenseReport)(iouReport);
    const { reimbursableSpend } = (0, ReportUtils_1.getMoneyRequestSpendBreakdown)(iouReport);
    const isAutoReimbursable = policy?.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES ? false : (0, ReportUtils_1.canBeAutoReimbursed)(iouReport, policy);
    const shouldBeApproved = canApproveIOU(iouReport, policy, transactions);
    const isPayAtEndExpenseReport = (0, ReportUtils_1.isPayAtEndExpenseReport)(iouReport ?? undefined, transactions);
    return (isPayer &&
        !isOpenExpenseReport &&
        !iouSettled &&
        !iouReport?.isWaitingOnBankAccount &&
        reimbursableSpend > 0 &&
        !isChatReportArchived &&
        !isAutoReimbursable &&
        (!shouldBeApproved || !shouldCheckApprovedState) &&
        !isPayAtEndExpenseReport);
}
function canCancelPayment(iouReport, session) {
    return (0, ReportUtils_1.isPayer)(session, iouReport) && ((0, ReportUtils_1.isSettled)(iouReport) || iouReport?.isWaitingOnBankAccount) && (0, ReportUtils_1.isExpenseReport)(iouReport);
}
function canSubmitReport(report, policy, transactions, allViolations, isReportArchived) {
    const currentUserAccountID = (0, Report_1.getCurrentUserAccountID)();
    const isOpenExpenseReport = (0, ReportUtils_1.isOpenExpenseReport)(report);
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const hasAllPendingRTERViolations = (0, TransactionUtils_1.allHavePendingRTERViolation)(transactions, allViolations);
    const isManualSubmitEnabled = (0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy) === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL;
    const hasTransactionWithoutRTERViolation = (0, TransactionUtils_1.hasAnyTransactionWithoutRTERViolation)(transactions, allViolations);
    const hasOnlyPendingCardOrScanFailTransactions = transactions.length > 0 && transactions.every((t) => (0, TransactionUtils_1.isPendingCardOrScanningTransaction)(t));
    const baseCanSubmit = isOpenExpenseReport &&
        (report?.ownerAccountID === currentUserAccountID || report?.managerID === currentUserAccountID || isAdmin) &&
        !hasOnlyPendingCardOrScanFailTransactions &&
        !hasAllPendingRTERViolations &&
        hasTransactionWithoutRTERViolation &&
        !isReportArchived &&
        transactions.length > 0;
    const reportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.reportID}`] ?? [];
    const hasBeenRetracted = (0, ReportUtils_1.hasReportBeenReopened)(report, reportActions) || (0, ReportUtils_1.hasReportBeenRetracted)(report, reportActions);
    if (baseCanSubmit && hasBeenRetracted) {
        return true;
    }
    return baseCanSubmit && isManualSubmitEnabled;
}
function getIOUReportActionToApproveOrPay(chatReport, updatedIouReport) {
    const chatReportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`] ?? {};
    return Object.values(chatReportActions).find((action) => {
        if (!action) {
            return false;
        }
        const iouReport = updatedIouReport?.reportID === action.childReportID ? updatedIouReport : (0, ReportUtils_1.getReportOrDraftReport)(action.childReportID);
        // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
        // eslint-disable-next-line deprecation/deprecation
        const policy = (0, PolicyUtils_1.getPolicy)(iouReport?.policyID);
        const shouldShowSettlementButton = canIOUBePaid(iouReport, chatReport, policy) || canApproveIOU(iouReport, policy);
        return action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW && shouldShowSettlementButton && !(0, ReportActionsUtils_1.isDeletedAction)(action);
    });
}
function isLastApprover(approvalChain) {
    if (approvalChain.length === 0) {
        return true;
    }
    return approvalChain.at(-1) === currentUserEmail;
}
function approveMoneyRequest(expenseReport, full) {
    if (!expenseReport) {
        return;
    }
    if (expenseReport.policyID && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(expenseReport.policyID)) {
        Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(expenseReport.policyID));
        return;
    }
    const currentNextStep = allNextSteps[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`] ?? null;
    let total = expenseReport.total ?? 0;
    const hasHeldExpenses = (0, ReportUtils_1.hasHeldExpenses)(expenseReport.reportID);
    const hasDuplicates = (0, TransactionUtils_1.hasDuplicateTransactions)(expenseReport.reportID);
    if (hasHeldExpenses && !full && !!expenseReport.unheldTotal) {
        total = expenseReport.unheldTotal;
    }
    const optimisticApprovedReportAction = (0, ReportUtils_1.buildOptimisticApprovedReportAction)(total, expenseReport.currency ?? '', expenseReport.reportID);
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const approvalChain = (0, ReportUtils_1.getApprovalChain)((0, PolicyUtils_1.getPolicy)(expenseReport.policyID), expenseReport);
    const predictedNextStatus = isLastApprover(approvalChain) ? CONST_1.default.REPORT.STATUS_NUM.APPROVED : CONST_1.default.REPORT.STATUS_NUM.SUBMITTED;
    const predictedNextState = isLastApprover(approvalChain) ? CONST_1.default.REPORT.STATE_NUM.APPROVED : CONST_1.default.REPORT.STATE_NUM.SUBMITTED;
    const managerID = isLastApprover(approvalChain) ? expenseReport.managerID : (0, ReportUtils_1.getNextApproverAccountID)(expenseReport);
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(expenseReport, predictedNextStatus);
    const chatReport = (0, ReportUtils_1.getReportOrDraftReport)(expenseReport.chatReportID);
    const optimisticReportActionsData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
        value: {
            [optimisticApprovedReportAction.reportActionID]: {
                ...optimisticApprovedReportAction,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        },
    };
    const updatedExpenseReport = {
        ...expenseReport,
        lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(optimisticApprovedReportAction),
        lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(optimisticApprovedReportAction),
        stateNum: predictedNextState,
        statusNum: predictedNextStatus,
        managerID,
        pendingFields: {
            partial: full ? null : CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
        },
    };
    const optimisticIOUReportData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
        value: updatedExpenseReport,
    };
    let optimisticChatReportData;
    if (chatReport) {
        optimisticChatReportData = {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.chatReportID}`,
            value: {
                hasOutstandingChildRequest: (0, ReportUtils_1.hasOutstandingChildRequest)(chatReport, updatedExpenseReport),
            },
        };
    }
    const optimisticNextStepData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
        value: optimisticNextStep,
    };
    const optimisticData = [optimisticIOUReportData, optimisticReportActionsData, optimisticNextStepData, ...(optimisticChatReportData ? [optimisticChatReportData] : [])];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticApprovedReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                pendingFields: {
                    partial: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticApprovedReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.other'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.chatReportID}`,
            value: {
                hasOutstandingChildRequest: chatReport?.hasOutstandingChildRequest,
                pendingFields: {
                    partial: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
            value: currentNextStep,
        },
    ];
    // Clear hold reason of all transactions if we approve all requests
    if (full && hasHeldExpenses) {
        const heldTransactions = (0, ReportUtils_1.getAllHeldTransactions)(expenseReport.reportID);
        heldTransactions.forEach((heldTransaction) => {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${heldTransaction.transactionID}`,
                value: {
                    comment: {
                        hold: '',
                    },
                },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${heldTransaction.transactionID}`,
                value: {
                    comment: {
                        hold: heldTransaction.comment?.hold,
                    },
                },
            });
        });
    }
    let optimisticHoldReportID;
    let optimisticHoldActionID;
    let optimisticHoldReportExpenseActionIDs;
    if (!full && !!chatReport && !!expenseReport) {
        const holdReportOnyxData = getReportFromHoldRequestsOnyxData(chatReport, expenseReport, { accountID: expenseReport.ownerAccountID });
        optimisticData.push(...holdReportOnyxData.optimisticData);
        successData.push(...holdReportOnyxData.successData);
        failureData.push(...holdReportOnyxData.failureData);
        optimisticHoldReportID = holdReportOnyxData.optimisticHoldReportID;
        optimisticHoldActionID = holdReportOnyxData.optimisticHoldActionID;
        optimisticHoldReportExpenseActionIDs = JSON.stringify(holdReportOnyxData.optimisticHoldReportExpenseActionIDs);
    }
    // Remove duplicates violations if we approve the report
    if (hasDuplicates) {
        const transactions = (0, ReportUtils_1.getReportTransactions)(expenseReport.reportID).filter((transaction) => (0, TransactionUtils_1.isDuplicate)(transaction, true));
        if (!full) {
            transactions.filter((transaction) => !(0, TransactionUtils_1.isOnHold)(transaction));
        }
        transactions.forEach((transaction) => {
            const transactionViolations = allTransactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`] ?? [];
            const newTransactionViolations = transactionViolations.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION);
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
                value: newTransactionViolations,
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
                value: transactionViolations,
            });
        });
    }
    const parameters = {
        reportID: expenseReport.reportID,
        approvedReportActionID: optimisticApprovedReportAction.reportActionID,
        full,
        optimisticHoldReportID,
        optimisticHoldActionID,
        optimisticHoldReportExpenseActionIDs,
    };
    (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
    API.write(types_1.WRITE_COMMANDS.APPROVE_MONEY_REQUEST, parameters, { optimisticData, successData, failureData });
}
function reopenReport(expenseReport) {
    if (!expenseReport) {
        return;
    }
    const currentNextStep = allNextSteps[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`] ?? null;
    const optimisticReopenedReportAction = (0, ReportUtils_1.buildOptimisticReopenedReportAction)();
    const predictedNextState = CONST_1.default.REPORT.STATE_NUM.OPEN;
    const predictedNextStatus = CONST_1.default.REPORT.STATUS_NUM.OPEN;
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(expenseReport, predictedNextStatus, undefined, undefined, true);
    const optimisticReportActionsData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
        value: {
            [optimisticReopenedReportAction.reportActionID]: {
                ...optimisticReopenedReportAction,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        },
    };
    const optimisticIOUReportData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
        value: {
            ...expenseReport,
            lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(optimisticReopenedReportAction),
            lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(optimisticReopenedReportAction),
            stateNum: predictedNextState,
            statusNum: predictedNextStatus,
            hasReportBeenReopened: true,
            pendingFields: {
                partial: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
            },
        },
    };
    const optimisticNextStepData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
        value: optimisticNextStep,
    };
    const optimisticData = [optimisticIOUReportData, optimisticReportActionsData, optimisticNextStepData];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticReopenedReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                pendingFields: {
                    partial: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticReopenedReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.other'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
            value: currentNextStep,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                stateNum: expenseReport.stateNum,
                statusNum: expenseReport.statusNum,
                hasReportBeenReopened: false,
            },
        },
    ];
    if (expenseReport.parentReportID && expenseReport.parentReportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.parentReportID}`,
            value: {
                [expenseReport.parentReportActionID]: {
                    childStateNum: predictedNextState,
                    childStatusNum: predictedNextStatus,
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.parentReportID}`,
            value: {
                [expenseReport.parentReportActionID]: {
                    childStateNum: expenseReport.stateNum,
                    childStatusNum: expenseReport.statusNum,
                },
            },
        });
    }
    const parameters = {
        reportID: expenseReport.reportID,
        reportActionID: optimisticReopenedReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.REOPEN_REPORT, parameters, { optimisticData, successData, failureData });
}
function retractReport(expenseReport) {
    if (!expenseReport) {
        return;
    }
    const currentNextStep = allNextSteps[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`] ?? null;
    const optimisticRetractReportAction = (0, ReportUtils_1.buildOptimisticRetractedReportAction)();
    const predictedNextState = CONST_1.default.REPORT.STATE_NUM.OPEN;
    const predictedNextStatus = CONST_1.default.REPORT.STATUS_NUM.OPEN;
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(expenseReport, predictedNextStatus);
    const optimisticReportActionsData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
        value: {
            [optimisticRetractReportAction.reportActionID]: {
                ...optimisticRetractReportAction,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        },
    };
    const optimisticIOUReportData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
        value: {
            ...expenseReport,
            lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(optimisticRetractReportAction),
            lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(optimisticRetractReportAction),
            stateNum: predictedNextState,
            statusNum: predictedNextStatus,
            hasReportBeenRetracted: true,
            pendingFields: {
                partial: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
            },
        },
    };
    const optimisticNextStepData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
        value: optimisticNextStep,
    };
    const optimisticData = [optimisticIOUReportData, optimisticReportActionsData, optimisticNextStepData];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticRetractReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                pendingFields: {
                    partial: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticRetractReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.other'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                stateNum: expenseReport.stateNum,
                statusNum: expenseReport.stateNum,
                hasReportBeenRetracted: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
            value: currentNextStep,
        },
    ];
    if (expenseReport.parentReportID && expenseReport.parentReportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.parentReportID}`,
            value: {
                [expenseReport.parentReportActionID]: {
                    childStateNum: predictedNextState,
                    childStatusNum: predictedNextStatus,
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.parentReportID}`,
            value: {
                [expenseReport.parentReportActionID]: {
                    childStateNum: expenseReport.stateNum,
                    childStatusNum: expenseReport.statusNum,
                },
            },
        });
    }
    const parameters = {
        reportID: expenseReport.reportID,
        reportActionID: optimisticRetractReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.RETRACT_REPORT, parameters, { optimisticData, successData, failureData });
}
function unapproveExpenseReport(expenseReport) {
    if ((0, EmptyObject_1.isEmptyObject)(expenseReport)) {
        return;
    }
    const currentNextStep = allNextSteps[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`] ?? null;
    const optimisticUnapprovedReportAction = (0, ReportUtils_1.buildOptimisticUnapprovedReportAction)(expenseReport.total ?? 0, expenseReport.currency ?? '', expenseReport.reportID);
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(expenseReport, CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, false, true);
    const optimisticReportActionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
        value: {
            [optimisticUnapprovedReportAction.reportActionID]: {
                ...optimisticUnapprovedReportAction,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        },
    };
    const optimisticIOUReportData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
        value: {
            ...expenseReport,
            lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(optimisticUnapprovedReportAction),
            lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(optimisticUnapprovedReportAction),
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            pendingFields: {
                partial: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
            },
            isCancelledIOU: false,
        },
    };
    const optimisticNextStepData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
        value: optimisticNextStep,
    };
    const optimisticData = [optimisticIOUReportData, optimisticReportActionData, optimisticNextStepData];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticUnapprovedReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                pendingFields: {
                    partial: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticUnapprovedReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.other'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
            value: currentNextStep,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                pendingFields: {
                    partial: null,
                },
                isCancelledIOU: true,
            },
        },
    ];
    if (expenseReport.parentReportID && expenseReport.parentReportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.parentReportID}`,
            value: {
                [expenseReport.parentReportActionID]: {
                    childStateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    childStatusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.parentReportID}`,
            value: {
                [expenseReport.parentReportActionID]: {
                    childStateNum: expenseReport.stateNum,
                    childStatusNum: expenseReport.statusNum,
                },
            },
        });
    }
    const parameters = {
        reportID: expenseReport.reportID,
        reportActionID: optimisticUnapprovedReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.UNAPPROVE_EXPENSE_REPORT, parameters, { optimisticData, successData, failureData });
}
function submitReport(expenseReport) {
    if (!expenseReport) {
        return;
    }
    if (expenseReport.policyID && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(expenseReport.policyID)) {
        Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(expenseReport.policyID));
        return;
    }
    const currentNextStep = allNextSteps[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`] ?? null;
    const parentReport = (0, ReportUtils_1.getReportOrDraftReport)(expenseReport.parentReportID);
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(expenseReport.policyID);
    const isCurrentUserManager = currentUserPersonalDetails?.accountID === expenseReport.managerID;
    const isSubmitAndClosePolicy = (0, PolicyUtils_1.isSubmitAndClose)(policy);
    const adminAccountID = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN ? currentUserPersonalDetails?.accountID : undefined;
    const optimisticSubmittedReportAction = (0, ReportUtils_1.buildOptimisticSubmittedReportAction)(expenseReport?.total ?? 0, expenseReport.currency ?? '', expenseReport.reportID, adminAccountID);
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(expenseReport, isSubmitAndClosePolicy ? CONST_1.default.REPORT.STATUS_NUM.CLOSED : CONST_1.default.REPORT.STATUS_NUM.SUBMITTED);
    const approvalChain = (0, ReportUtils_1.getApprovalChain)(policy, expenseReport);
    const managerID = (0, PersonalDetailsUtils_1.getAccountIDsByLogins)(approvalChain).at(0);
    const optimisticData = !isSubmitAndClosePolicy
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
                value: {
                    [optimisticSubmittedReportAction.reportActionID]: {
                        ...optimisticSubmittedReportAction,
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    },
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
                value: {
                    ...expenseReport,
                    managerID,
                    lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(optimisticSubmittedReportAction),
                    lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(optimisticSubmittedReportAction),
                    stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                },
            },
        ]
        : [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
                value: {
                    ...expenseReport,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                },
            },
        ];
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
        value: optimisticNextStep,
    });
    if (parentReport?.reportID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`,
            value: {
                ...parentReport,
                // In case its a manager who force submitted the report, they are the next user who needs to take an action
                hasOutstandingChildRequest: isCurrentUserManager,
                iouReportID: null,
            },
        });
    }
    const successData = [];
    if (!isSubmitAndClosePolicy) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticSubmittedReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        });
    }
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
            value: currentNextStep,
        },
    ];
    if (!isSubmitAndClosePolicy) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticSubmittedReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.other'),
                },
            },
        });
    }
    if (parentReport?.reportID) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`,
            value: {
                hasOutstandingChildRequest: parentReport.hasOutstandingChildRequest,
                iouReportID: expenseReport.reportID,
            },
        });
    }
    const parameters = {
        reportID: expenseReport.reportID,
        managerAccountID: (0, PolicyUtils_1.getSubmitToAccountID)(policy, expenseReport) ?? expenseReport.managerID,
        reportActionID: optimisticSubmittedReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.SUBMIT_REPORT, parameters, { optimisticData, successData, failureData });
}
function cancelPayment(expenseReport, chatReport) {
    if ((0, EmptyObject_1.isEmptyObject)(expenseReport)) {
        return;
    }
    const optimisticReportAction = (0, ReportUtils_1.buildOptimisticCancelPaymentReportAction)(expenseReport.reportID, -((expenseReport.total ?? 0) - (expenseReport?.nonReimbursableTotal ?? 0)), expenseReport.currency ?? '');
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(chatReport.policyID);
    const approvalMode = policy?.approvalMode ?? CONST_1.default.POLICY.APPROVAL_MODE.BASIC;
    const stateNum = approvalMode === CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL ? CONST_1.default.REPORT.STATE_NUM.SUBMITTED : CONST_1.default.REPORT.STATE_NUM.APPROVED;
    const statusNum = approvalMode === CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL ? CONST_1.default.REPORT.STATUS_NUM.SUBMITTED : CONST_1.default.REPORT.STATUS_NUM.APPROVED;
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(expenseReport, statusNum);
    const iouReportActions = (0, ReportActionsUtils_1.getAllReportActions)(chatReport.iouReportID);
    const expenseReportActions = (0, ReportActionsUtils_1.getAllReportActions)(expenseReport.reportID);
    const iouCreatedAction = Object.values(iouReportActions).find((action) => (0, ReportActionsUtils_1.isCreatedAction)(action));
    const expenseCreatedAction = Object.values(expenseReportActions).find((action) => (0, ReportActionsUtils_1.isCreatedAction)(action));
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticReportAction.reportActionID]: {
                    ...optimisticReportAction,
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: {
                // The report created later will become the iouReportID of the chat report
                iouReportID: (iouCreatedAction?.created ?? '') > (expenseCreatedAction?.created ?? '') ? chatReport?.iouReportID : expenseReport.reportID,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                ...expenseReport,
                isWaitingOnBankAccount: false,
                lastVisibleActionCreated: optimisticReportAction?.created,
                lastMessageText: (0, ReportActionsUtils_1.getReportActionText)(optimisticReportAction),
                lastMessageHtml: (0, ReportActionsUtils_1.getReportActionHtml)(optimisticReportAction),
                stateNum,
                statusNum,
                isCancelledIOU: true,
            },
        },
    ];
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
        value: optimisticNextStep,
    });
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`,
            value: {
                [optimisticReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.other'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`,
            value: {
                statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
                isWaitingOnBankAccount: expenseReport.isWaitingOnBankAccount,
                isCancelledIOU: false,
            },
        },
    ];
    if (expenseReport.parentReportID && expenseReport.parentReportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.parentReportID}`,
            value: {
                [expenseReport.parentReportActionID]: {
                    childStateNum: stateNum,
                    childStatusNum: statusNum,
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.parentReportID}`,
            value: {
                [expenseReport.parentReportActionID]: {
                    childStateNum: expenseReport.stateNum,
                    childStatusNum: expenseReport.statusNum,
                },
            },
        });
    }
    if (chatReport?.reportID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: {
                iouReportID: expenseReport.reportID,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReport.reportID}`,
            value: {
                hasOutstandingChildRequest: chatReport.hasOutstandingChildRequest,
                iouReportID: chatReport.iouReportID,
            },
        });
    }
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${expenseReport.reportID}`,
        value: (0, NextStepUtils_1.buildNextStep)(expenseReport, CONST_1.default.REPORT.STATUS_NUM.REIMBURSED),
    });
    API.write(types_1.WRITE_COMMANDS.CANCEL_PAYMENT, {
        iouReportID: expenseReport.reportID,
        chatReportID: chatReport.reportID,
        managerAccountID: expenseReport.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID,
        reportActionID: optimisticReportAction.reportActionID,
    }, { optimisticData, successData, failureData });
    (0, Report_1.notifyNewAction)(expenseReport.reportID, userAccountID);
}
/**
 * Completes onboarding for invite link flow based on the selected payment option
 *
 * @param paymentSelected based on which we choose the onboarding choice and concierge message
 */
function completePaymentOnboarding(paymentSelected, adminsChatReportID, onboardingPolicyID) {
    const isInviteOnboardingComplete = introSelected?.isInviteOnboardingComplete ?? false;
    if (isInviteOnboardingComplete || !introSelected?.choice || !introSelected?.inviteType) {
        return;
    }
    const session = (0, SessionUtils_1.getSession)();
    const personalDetailsListValues = Object.values((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(session?.accountID ? [session.accountID] : [], personalDetailsList));
    const personalDetails = personalDetailsListValues.at(0);
    let onboardingPurpose = introSelected?.choice;
    if (introSelected?.inviteType === CONST_1.default.ONBOARDING_INVITE_TYPES.IOU && paymentSelected === CONST_1.default.IOU.PAYMENT_SELECTED.BBA) {
        onboardingPurpose = CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM;
    }
    if (introSelected?.inviteType === CONST_1.default.ONBOARDING_INVITE_TYPES.INVOICE && paymentSelected !== CONST_1.default.IOU.PAYMENT_SELECTED.BBA) {
        onboardingPurpose = CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT;
    }
    const { onboardingMessages } = (0, OnboardingFlow_1.getOnboardingMessages)(true);
    (0, Report_1.completeOnboarding)({
        engagementChoice: onboardingPurpose,
        onboardingMessage: onboardingMessages[onboardingPurpose],
        firstName: personalDetails?.firstName,
        lastName: personalDetails?.lastName,
        adminsChatReportID,
        onboardingPolicyID,
        paymentSelected,
        wasInvited: true,
    });
}
function payMoneyRequest(paymentType, chatReport, iouReport, paymentPolicyID, full = true) {
    if (chatReport.policyID && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(chatReport.policyID)) {
        Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(chatReport.policyID));
        return;
    }
    const paymentSelected = paymentType === CONST_1.default.IOU.PAYMENT_TYPE.VBBA ? CONST_1.default.IOU.PAYMENT_SELECTED.BBA : CONST_1.default.IOU.PAYMENT_SELECTED.PBA;
    completePaymentOnboarding(paymentSelected);
    const recipient = { accountID: iouReport?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID };
    const { params, optimisticData, successData, failureData } = getPayMoneyRequestParams(chatReport, iouReport, recipient, paymentType, full, undefined, undefined, paymentPolicyID);
    // For now, we need to call the PayMoneyRequestWithWallet API since PayMoneyRequest was not updated to work with
    // Expensify Wallets.
    const apiCommand = paymentType === CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY ? types_1.WRITE_COMMANDS.PAY_MONEY_REQUEST_WITH_WALLET : types_1.WRITE_COMMANDS.PAY_MONEY_REQUEST;
    (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
    API.write(apiCommand, params, { optimisticData, successData, failureData });
    (0, Report_1.notifyNewAction)(Navigation_1.default.getTopmostReportId() ?? iouReport?.reportID, userAccountID);
}
function payInvoice(paymentMethodType, chatReport, invoiceReport, payAsBusiness = false, existingB2BInvoiceReport, methodID, paymentMethod) {
    const recipient = { accountID: invoiceReport?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID };
    const { optimisticData, successData, failureData, params: { reportActionID, policyID, adminsChatReportID, adminsCreatedReportActionID, expenseChatReportID, expenseCreatedReportActionID, customUnitRateID, customUnitID, ownerEmail, policyName, }, } = getPayMoneyRequestParams(chatReport, invoiceReport, recipient, paymentMethodType, true, payAsBusiness, methodID, undefined, undefined, existingB2BInvoiceReport);
    const paymentSelected = paymentMethodType === CONST_1.default.IOU.PAYMENT_TYPE.VBBA ? CONST_1.default.IOU.PAYMENT_SELECTED.BBA : CONST_1.default.IOU.PAYMENT_SELECTED.PBA;
    completePaymentOnboarding(paymentSelected);
    let params = {
        reportID: invoiceReport?.reportID,
        reportActionID,
        paymentMethodType,
        payAsBusiness,
    };
    if (paymentMethod === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT) {
        params.bankAccountID = methodID;
    }
    if (paymentMethod === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD) {
        params.fundID = methodID;
    }
    if (policyID) {
        params = {
            ...params,
            policyID,
            adminsChatReportID,
            adminsCreatedReportActionID,
            expenseChatReportID,
            expenseCreatedReportActionID,
            customUnitRateID,
            customUnitID,
            ownerEmail,
            policyName,
        };
    }
    (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
    API.write(types_1.WRITE_COMMANDS.PAY_INVOICE, params, { optimisticData, successData, failureData });
}
function detachReceipt(transactionID) {
    if (!transactionID) {
        return;
    }
    const transaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    const expenseReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`] ?? null;
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${expenseReport?.policyID}`];
    const newTransaction = transaction
        ? {
            ...transaction,
            filename: '',
            receipt: {},
        }
        : null;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                ...newTransaction,
                pendingFields: {
                    receipt: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingFields: {
                    receipt: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                ...(transaction ?? null),
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.receiptDeleteFailureError'),
                pendingFields: {
                    receipt: null,
                },
            },
        },
    ];
    if (policy && (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && newTransaction) {
        const policyCategories = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policy.id}`];
        const policyTagList = (0, Tag_1.getPolicyTagsData)(policy.id);
        const currentTransactionViolations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? [];
        const violationsOnyxData = ViolationsUtils_1.default.getViolationsOnyxData(newTransaction, currentTransactionViolations, policy, policyTagList ?? {}, policyCategories ?? {}, (0, PolicyUtils_1.hasDependentTags)(policy, policyTagList ?? {}), (0, ReportUtils_1.isInvoiceReport)(expenseReport));
        optimisticData.push(violationsOnyxData);
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: currentTransactionViolations,
        });
    }
    const updatedReportAction = (0, ReportUtils_1.buildOptimisticDetachReceipt)(expenseReport?.reportID, transactionID, transaction?.merchant);
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${updatedReportAction?.reportID}`,
        value: {
            [updatedReportAction.reportActionID]: updatedReportAction,
        },
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${updatedReportAction?.reportID}`,
        value: {
            lastVisibleActionCreated: updatedReportAction.created,
            lastReadTime: updatedReportAction.created,
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${updatedReportAction?.reportID}`,
        value: {
            lastVisibleActionCreated: expenseReport?.lastVisibleActionCreated,
            lastReadTime: expenseReport?.lastReadTime,
        },
    });
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport?.reportID}`,
        value: {
            [updatedReportAction.reportActionID]: { pendingAction: null },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport?.reportID}`,
        value: {
            [updatedReportAction.reportActionID]: {
                ...updatedReportAction,
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericEditFailureMessage'),
            },
        },
    });
    const parameters = { transactionID, reportActionID: updatedReportAction.reportActionID };
    API.write(types_1.WRITE_COMMANDS.DETACH_RECEIPT, parameters, { optimisticData, successData, failureData });
}
function replaceReceipt({ transactionID, file, source }) {
    if (!file) {
        return;
    }
    const transaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    const expenseReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`] ?? null;
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${expenseReport?.policyID}`];
    const oldReceipt = transaction?.receipt ?? {};
    const receiptOptimistic = {
        source,
        state: CONST_1.default.IOU.RECEIPT_STATE.OPEN,
    };
    const newTransaction = transaction && { ...transaction, receipt: receiptOptimistic, filename: file.name };
    const retryParams = { transactionID, file: undefined, source };
    const currentSearchQueryJSON = (0, SearchQueryUtils_1.getCurrentSearchQueryJSON)();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                receipt: receiptOptimistic,
                filename: file.name,
                pendingFields: {
                    receipt: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
                errors: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingFields: {
                    receipt: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                receipt: !(0, EmptyObject_1.isEmptyObject)(oldReceipt) ? oldReceipt : null,
                filename: transaction?.filename,
                errors: getReceiptError(receiptOptimistic, file.name, undefined, undefined, CONST_1.default.IOU.ACTION_PARAMS.REPLACE_RECEIPT, retryParams),
                pendingFields: {
                    receipt: null,
                },
            },
        },
    ];
    if (policy && (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && newTransaction) {
        const policyCategories = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policy.id}`];
        const policyTagList = (0, Tag_1.getPolicyTagsData)(policy.id);
        const currentTransactionViolations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? [];
        const violationsOnyxData = ViolationsUtils_1.default.getViolationsOnyxData(newTransaction, currentTransactionViolations, policy, policyTagList ?? {}, policyCategories ?? {}, (0, PolicyUtils_1.hasDependentTags)(policy, policyTagList ?? {}), (0, ReportUtils_1.isInvoiceReport)(expenseReport));
        optimisticData.push(violationsOnyxData);
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: currentTransactionViolations,
        });
    }
    if (currentSearchQueryJSON?.hash) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchQueryJSON.hash}`,
            value: {
                data: {
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]: {
                        receipt: receiptOptimistic,
                        filename: file.name,
                    },
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchQueryJSON.hash}`,
            value: {
                data: {
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]: {
                        receipt: !(0, EmptyObject_1.isEmptyObject)(oldReceipt) ? oldReceipt : null,
                        filename: transaction?.filename,
                    },
                },
            },
        });
    }
    const parameters = {
        transactionID,
        receipt: file,
    };
    API.write(types_1.WRITE_COMMANDS.REPLACE_RECEIPT, parameters, { optimisticData, successData, failureData });
}
/**
 * Finds the participants for an IOU based on the attached report
 * @param transactionID of the transaction to set the participants of
 * @param report attached to the transaction
 */
function getMoneyRequestParticipantsFromReport(report) {
    // If the report is iou or expense report, we should get the chat report to set participant for request money
    const chatReport = (0, ReportUtils_1.isMoneyRequestReport)(report) ? (0, ReportUtils_1.getReportOrDraftReport)(report?.chatReportID) : report;
    const currentUserAccountID = currentUserPersonalDetails?.accountID;
    const shouldAddAsReport = !(0, EmptyObject_1.isEmptyObject)(chatReport) && (0, ReportUtils_1.isSelfDM)(chatReport);
    let participants = [];
    if ((0, ReportUtils_1.isPolicyExpenseChat)(chatReport) || shouldAddAsReport) {
        participants = [{ accountID: 0, reportID: chatReport?.reportID, isPolicyExpenseChat: (0, ReportUtils_1.isPolicyExpenseChat)(chatReport), selected: true }];
    }
    else if ((0, ReportUtils_1.isInvoiceRoom)(chatReport)) {
        participants = [
            { reportID: chatReport?.reportID, selected: true },
            {
                policyID: chatReport?.policyID,
                isSender: true,
                selected: false,
            },
        ];
    }
    else {
        const chatReportOtherParticipants = Object.keys(chatReport?.participants ?? {})
            .map(Number)
            .filter((accountID) => accountID !== currentUserAccountID);
        participants = chatReportOtherParticipants.map((accountID) => ({ accountID, selected: true }));
    }
    return participants;
}
/**
 * Sets the participants for an IOU based on the attached report
 * @param transactionID of the transaction to set the participants of
 * @param report attached to the transaction
 * @param participantsAutoAssigned whether participants were auto assigned
 */
function setMoneyRequestParticipantsFromReport(transactionID, report, participantsAutoAssigned = true) {
    const participants = getMoneyRequestParticipantsFromReport(report);
    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, {
        participants,
        participantsAutoAssigned,
    });
}
function setMoneyRequestTaxRate(transactionID, taxCode) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { taxCode });
}
function setMoneyRequestTaxAmount(transactionID, taxAmount) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { taxAmount });
}
/**
 * Sets the `splitShares` map that holds individual shares of a split bill
 */
function setSplitShares(transaction, amount, currency, newAccountIDs) {
    if (!transaction) {
        return;
    }
    const oldAccountIDs = Object.keys(transaction.splitShares ?? {}).map((key) => Number(key));
    // Create an array containing unique IDs of the current transaction participants and the new ones
    // The current userAccountID might not be included in newAccountIDs if this is called from the participants step using Global Create
    // If this is called from an existing group chat, it'll be included. So we manually add them to account for both cases.
    const accountIDs = [...new Set([userAccountID, ...newAccountIDs, ...oldAccountIDs])];
    const splitShares = accountIDs.reduce((acc, accountID) => {
        // We want to replace the contents of splitShares to contain only `newAccountIDs` entries
        // In the case of going back to the participants page and removing a participant
        // a simple merge will have the previous participant still present in the splitShares object
        // So we manually set their entry to null
        if (!newAccountIDs.includes(accountID) && accountID !== userAccountID) {
            acc[accountID] = null;
            return acc;
        }
        const isPayer = accountID === userAccountID;
        const participantsLength = newAccountIDs.includes(userAccountID) ? newAccountIDs.length - 1 : newAccountIDs.length;
        const splitAmount = (0, IOUUtils_1.calculateAmount)(participantsLength, amount, currency, isPayer);
        acc[accountID] = {
            amount: splitAmount,
            isModified: false,
        };
        return acc;
    }, {});
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction.transactionID}`, { splitShares });
}
function resetSplitShares(transaction, newAmount, currency) {
    if (!transaction) {
        return;
    }
    const accountIDs = Object.keys(transaction.splitShares ?? {}).map((key) => Number(key));
    if (!accountIDs) {
        return;
    }
    setSplitShares(transaction, newAmount ?? transaction.amount, currency ?? transaction.currency, accountIDs);
}
/**
 * Sets an individual split share of the participant accountID supplied
 */
function setIndividualShare(transactionID, participantAccountID, participantShare) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, {
        splitShares: {
            [participantAccountID]: { amount: participantShare, isModified: true },
        },
    });
}
/**
 * Adjusts remaining unmodified shares when another share is modified
 * E.g. if total bill is $100 and split between 3 participants, when the user changes the first share to $50, the remaining unmodified shares will become $25 each.
 */
function adjustRemainingSplitShares(transaction) {
    const modifiedShares = Object.keys(transaction.splitShares ?? {}).filter((key) => transaction?.splitShares?.[Number(key)]?.isModified);
    if (!modifiedShares.length) {
        return;
    }
    const sumOfManualShares = modifiedShares
        .map((key) => transaction?.splitShares?.[Number(key)]?.amount ?? 0)
        .reduce((prev, current) => prev + current, 0);
    const unmodifiedSharesAccountIDs = Object.keys(transaction.splitShares ?? {})
        .filter((key) => !transaction?.splitShares?.[Number(key)]?.isModified)
        .map((key) => Number(key));
    const remainingTotal = transaction.amount - sumOfManualShares;
    if (remainingTotal < 0) {
        return;
    }
    const splitShares = unmodifiedSharesAccountIDs.reduce((acc, accountID, index) => {
        const splitAmount = (0, IOUUtils_1.calculateAmount)(unmodifiedSharesAccountIDs.length - 1, remainingTotal, transaction.currency, index === 0);
        acc[accountID] = {
            amount: splitAmount,
        };
        return acc;
    }, {});
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction.transactionID}`, { splitShares });
}
/**
 * Put expense on HOLD
 */
function putOnHold(transactionID, comment, ancestorReportsAndReportActions, initialReportID, searchHash) {
    const currentTime = DateUtils_1.default.getDBTime();
    const reportID = initialReportID ?? (0, ReportUtils_1.generateReportID)();
    const createdReportAction = (0, ReportUtils_1.buildOptimisticHoldReportAction)(currentTime);
    const holdReportAction = (0, ReportUtils_1.buildOptimisticHoldReportActionComment)(comment, DateUtils_1.default.addMillisecondsFromDateTime(currentTime, 1));
    const newViolation = { name: CONST_1.default.VIOLATIONS.HOLD, type: CONST_1.default.VIOLATION_TYPES.VIOLATION, showInReview: true };
    const transactionViolations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? [];
    const updatedViolations = [...transactionViolations, newViolation];
    const transaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    const iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`];
    const iouAction = (0, ReportActionsUtils_1.getIOUActionForReportID)(transaction?.reportID, transactionID);
    let transactionThreadReport;
    // If there is no existing transaction thread report, we should create one
    // This way we ensure every held request has a dedicated thread for comments
    if (initialReportID) {
        transactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${initialReportID}`] ?? {};
    }
    else {
        const moneyRequestReport = (0, ReportUtils_1.getReportOrDraftReport)(transaction?.reportID);
        transactionThreadReport = (0, ReportUtils_1.buildTransactionThread)(iouAction, moneyRequestReport, undefined, reportID);
    }
    const optimisticCreatedAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(currentUserEmail);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [createdReportAction.reportActionID]: createdReportAction,
                [holdReportAction.reportActionID]: holdReportAction,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                comment: {
                    hold: createdReportAction.reportActionID,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: updatedViolations,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                lastVisibleActionCreated: holdReportAction.created,
            },
        },
    ];
    if (iouReport && iouReport.currency === transaction?.currency) {
        const isExpenseReportLocal = (0, ReportUtils_1.isExpenseReport)(iouReport);
        const coefficient = isExpenseReportLocal ? -1 : 1;
        const transactionAmount = (0, TransactionUtils_1.getAmount)(transaction, isExpenseReportLocal) * coefficient;
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`,
            value: {
                unheldTotal: (iouReport.unheldTotal ?? 0) - transactionAmount,
                unheldNonReimbursableTotal: !transaction?.reimbursable ? (iouReport.unheldNonReimbursableTotal ?? 0) - transactionAmount : iouReport.unheldNonReimbursableTotal,
            },
        });
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: null,
                comment: {
                    hold: null,
                },
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericHoldExpenseFailureMessage'),
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [createdReportAction.reportActionID]: null,
                [holdReportAction.reportActionID]: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                lastVisibleActionCreated: transactionThreadReport.lastVisibleActionCreated,
            },
        },
    ];
    // If the transaction thread report wasn't created before, we create it optimistically
    if (!initialReportID) {
        transactionThreadReport.pendingFields = {
            createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        };
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: transactionThreadReport,
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: { [optimisticCreatedAction.reportActionID]: optimisticCreatedAction },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isOptimisticReport: true,
            },
        });
        if (iouAction?.reportActionID) {
            const iouActionParentUpdate = (0, ReportUtils_1.updateOptimisticParentReportAction)(iouAction, holdReportAction.created, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
            // We link the IOU action to the new transaction thread by setting childReportID optimistically
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport.parentReportID}`,
                value: { [iouAction?.reportActionID]: { childReportID: reportID, childType: CONST_1.default.REPORT.TYPE.CHAT, ...iouActionParentUpdate } },
            });
            // We reset the childReportID if the request fails
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport.parentReportID}`,
                value: { [iouAction?.reportActionID]: { childReportID: null, childType: null } },
            });
        }
        for (const { report: ancestorReport, reportAction: ancestorReportAction } of ancestorReportsAndReportActions) {
            if (ancestorReportAction?.reportActionID) {
                optimisticData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${ancestorReport.reportID}`,
                    value: {
                        [ancestorReportAction.reportActionID]: (0, ReportUtils_1.updateOptimisticParentReportAction)(ancestorReportAction, holdReportAction.created, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD),
                    },
                });
            }
        }
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: { [optimisticCreatedAction.reportActionID]: { pendingAction: null } },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isOptimisticReport: false,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: null,
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: null,
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: null,
        });
    }
    // If we are holding from the search page, we optimistically update the snapshot data that search uses so that it is kept in sync
    if (searchHash) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${searchHash}`,
            value: {
                data: {
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]: {
                        canHold: false,
                        canUnhold: true,
                    },
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${searchHash}`,
            value: {
                data: {
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]: {
                        canHold: true,
                        canUnhold: false,
                    },
                },
            },
        });
    }
    const params = {
        transactionID,
        comment,
        reportActionID: createdReportAction.reportActionID,
        commentReportActionID: holdReportAction.reportActionID,
    };
    if (!initialReportID) {
        params.transactionThreadReportID = reportID;
        params.createdReportActionIDForThread = optimisticCreatedAction.reportActionID;
    }
    API.write(types_1.WRITE_COMMANDS.HOLD_MONEY_REQUEST, params, { optimisticData, successData, failureData });
    const currentReportID = (0, ReportUtils_1.getDisplayedReportID)(reportID);
    Navigation_1.default.setNavigationActionToMicrotaskQueue(() => (0, Report_1.notifyNewAction)(currentReportID, userAccountID));
}
/**
 * Put expenses on HOLD in Bulk
 *
 *
 */
function bulkHold(comment, report, ancestorReportsAndReportActions, transactions, transactionsViolations, transactionsIOUActions, transactionsThreads = {}) {
    if (!report || !transactions) {
        return;
    }
    let optimisticUnheldNonReimbursableTotal;
    let optimisticUnheldTotal;
    const transactionThreadReportCreatedTime = DateUtils_1.default.getDBTime();
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    const coefficient = isExpenseReport ? -1 : 1;
    const reportID = report.reportID;
    const ancestorReportActionsOptimisticData = {};
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    const holdData = {};
    Object.entries(transactions).forEach(([_, transaction]) => {
        const transactionID = transaction?.transactionID;
        if (!transactionID || !transactionsIOUActions[transactionID]) {
            return;
        }
        if (transaction?.currency === report?.currency) {
            const transactionAmount = (0, TransactionUtils_1.getAmount)(transaction, isExpenseReport) * coefficient;
            optimisticUnheldTotal = (optimisticUnheldTotal ?? 0) - transactionAmount;
            if (!transaction?.reimbursable) {
                optimisticUnheldNonReimbursableTotal = (optimisticUnheldNonReimbursableTotal ?? 0) - transactionAmount;
            }
        }
        const iouAction = transactionsIOUActions[transactionID];
        const transactionThreadReport = (0, ReportUtils_1.buildTransactionThread)(iouAction, report, undefined, iouAction?.childReportID, transactionsThreads[transactionID]);
        const holdReportActionCreatedTime = DateUtils_1.default.addMillisecondsFromDateTime(transactionThreadReportCreatedTime, 1);
        const holdReportActionCommentCreatedTime = DateUtils_1.default.addMillisecondsFromDateTime(transactionThreadReportCreatedTime, 2);
        const holdReportAction = (0, ReportUtils_1.buildOptimisticHoldReportAction)(holdReportActionCreatedTime);
        const holdReportActionComment = (0, ReportUtils_1.buildOptimisticHoldReportActionComment)(comment, holdReportActionCommentCreatedTime);
        holdData[transactionID] = {
            holdReportActionID: holdReportAction.reportActionID,
            commentReportActionID: holdReportActionComment.reportActionID,
        };
        // Update ancestor report actions optimistic data so that we can update Onyx in batch later
        for (const { report: ancestorReport, reportAction: ancestorReportAction } of ancestorReportsAndReportActions) {
            if (ancestorReportAction) {
                const optimisticReportActions = ancestorReportActionsOptimisticData[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${ancestorReport.reportID}`] ?? {};
                const updateOptimisticReportAction = (optimisticReportActions?.[ancestorReportAction.reportActionID] ?? {});
                ancestorReportActionsOptimisticData[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${ancestorReport.reportID}`] = {
                    ...optimisticReportActions,
                    [ancestorReportAction.reportActionID]: (0, ReportUtils_1.updateOptimisticParentReportAction)({ ...ancestorReportAction, ...updateOptimisticReportAction }, holdReportActionCommentCreatedTime, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD),
                };
            }
        }
        if (!iouAction.childReportID) {
            const createdTransactionThreadReportAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(currentUserEmail, transactionThreadReportCreatedTime);
            // If the transactionThread is optimistic, we need the transactionThreadReportID and transactionThreadCreatedReportActionID.
            holdData[transactionID].transactionThreadReportID = transactionThreadReport.reportID;
            holdData[transactionID].transactionThreadCreatedReportActionID = createdTransactionThreadReportAction.reportActionID;
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport.reportID}`,
                value: {
                    ...transactionThreadReport,
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport.reportID}`,
                value: {
                    [createdTransactionThreadReportAction.reportActionID]: createdTransactionThreadReportAction,
                },
            });
            successData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport.reportID}`,
                value: {
                    pendingAction: null,
                },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport.reportID}`,
                value: {
                    [createdTransactionThreadReportAction.reportActionID]: {
                        pendingAction: null,
                    },
                },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport.reportID}`,
                value: null,
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport.reportID}`,
                value: {
                    [createdTransactionThreadReportAction.reportActionID]: null,
                },
            });
        }
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: null,
            },
        });
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [iouAction.reportActionID]: {
                    ...(0, ReportUtils_1.updateOptimisticParentReportAction)(iouAction, holdReportActionCommentCreatedTime, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD),
                    childReportID: transactionThreadReport.reportID,
                    childType: CONST_1.default.REPORT.TYPE.CHAT,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport.reportID}`,
            value: {
                [holdReportAction.reportActionID]: holdReportAction,
                [holdReportActionComment.reportActionID]: holdReportActionComment,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport.reportID}`,
            value: {
                lastVisibleActionCreated: holdReportActionCommentCreatedTime,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                comment: {
                    hold: holdReportAction.reportActionID,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: [
                ...(transactionsViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? []),
                {
                    name: CONST_1.default.VIOLATIONS.HOLD,
                    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                    showInReview: true,
                },
            ],
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReport.reportID}`,
            value: {
                lastVisibleActionCreated: transactionThreadReport?.lastVisibleActionCreated,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: { [iouAction.reportActionID]: { childReportID: null, childType: null } },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReport.reportID}`,
            value: {
                [holdReportAction.reportActionID]: null,
                [holdReportActionComment.reportActionID]: null,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: null,
                comment: {
                    hold: null,
                },
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericHoldExpenseFailureMessage'),
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: transactionsViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? null,
        });
    });
    if (optimisticUnheldTotal !== report?.unheldTotal || optimisticUnheldNonReimbursableTotal !== report?.unheldNonReimbursableTotal) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                unheldTotal: optimisticUnheldTotal ?? null,
                unheldNonReimbursableTotal: optimisticUnheldNonReimbursableTotal ?? null,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                unheldTotal: report?.unheldTotal ?? null,
                unheldNonReimbursableTotal: report?.unheldNonReimbursableTotal ?? null,
            },
        });
    }
    // Push all ancestor report actions updates to optimistic data so that we can update Onyx in batch
    optimisticData.push(...Object.entries(ancestorReportActionsOptimisticData).map(([key, optimisticReportActions]) => {
        return { onyxMethod: react_native_onyx_1.default.METHOD.MERGE, key: key, value: optimisticReportActions };
    }));
    API.write(types_1.WRITE_COMMANDS.BULK_HOLD_REQUEST, {
        holdData: JSON.stringify(holdData),
        comment,
    }, { optimisticData, successData, failureData });
    const currentReportID = (0, ReportUtils_1.getDisplayedReportID)(reportID);
    Navigation_1.default.setNavigationActionToMicrotaskQueue(() => (0, Report_1.notifyNewAction)(currentReportID, userAccountID));
}
/**
 * Remove expense from HOLD
 */
function unholdRequest(transactionID, reportID) {
    const createdReportAction = (0, ReportUtils_1.buildOptimisticUnHoldReportAction)();
    const transactionViolations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`];
    const transaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    const iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`];
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [createdReportAction.reportActionID]: createdReportAction,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                comment: {
                    hold: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: transactionViolations?.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.HOLD) ?? [],
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                lastVisibleActionCreated: createdReportAction.created,
            },
        },
    ];
    if (iouReport && iouReport.currency === transaction?.currency) {
        const isExpenseReportLocal = (0, ReportUtils_1.isExpenseReport)(iouReport);
        const coefficient = isExpenseReportLocal ? -1 : 1;
        const transactionAmount = (0, TransactionUtils_1.getAmount)(transaction, isExpenseReportLocal) * coefficient;
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`,
            value: {
                unheldTotal: (iouReport.unheldTotal ?? 0) + transactionAmount,
                unheldNonReimbursableTotal: !transaction?.reimbursable ? (iouReport.unheldNonReimbursableTotal ?? 0) + transactionAmount : iouReport.unheldNonReimbursableTotal,
            },
        });
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: null,
                comment: {
                    hold: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [createdReportAction.reportActionID]: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: null,
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericUnholdExpenseFailureMessage'),
                comment: {
                    hold: transaction?.comment?.hold,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: transactionViolations ?? null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                lastVisibleActionCreated: report?.lastVisibleActionCreated,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.UNHOLD_MONEY_REQUEST, {
        transactionID,
        reportActionID: createdReportAction.reportActionID,
    }, { optimisticData, successData, failureData });
    const currentReportID = (0, ReportUtils_1.getDisplayedReportID)(reportID);
    (0, Report_1.notifyNewAction)(currentReportID, userAccountID);
}
// eslint-disable-next-line rulesdir/no-negated-variables
function navigateToStartStepIfScanFileCannotBeRead(receiptFilename, receiptPath, onSuccess, requestType, iouType, transactionID, reportID, receiptType, onFailureCallback) {
    if (!receiptFilename || !receiptPath) {
        return;
    }
    const onFailure = () => {
        setMoneyRequestReceipt(transactionID, '', '', true);
        if (requestType === CONST_1.default.IOU.REQUEST_TYPE.MANUAL) {
            if (onFailureCallback) {
                onFailureCallback();
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_SCAN.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID, Navigation_1.default.getActiveRouteWithoutParams()));
            return;
        }
        (0, IOUUtils_1.navigateToStartMoneyRequestStep)(requestType, iouType, transactionID, reportID);
    };
    (0, FileUtils_1.readFileAsync)(receiptPath.toString(), receiptFilename, onSuccess, onFailure, receiptType);
}
function checkIfScanFileCanBeRead(receiptFilename, receiptPath, receiptType, onSuccess, onFailure) {
    if (!receiptFilename || !receiptPath) {
        return;
    }
    return (0, FileUtils_1.readFileAsync)(receiptPath.toString(), receiptFilename, onSuccess, onFailure, receiptType);
}
/** Save the preferred payment method for a policy or personal DM */
function savePreferredPaymentMethod(policyID, paymentMethod, type, prevPaymentMethod) {
    if (!policyID) {
        return;
    }
    // to make it easier to revert to the previous last payment method, we will save it to this key
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD}`, {
        [policyID]: type
            ? {
                [type]: { name: paymentMethod },
                [CONST_1.default.LAST_PAYMENT_METHOD.LAST_USED]: { name: typeof prevPaymentMethod === 'string' ? prevPaymentMethod : (prevPaymentMethod?.lastUsed?.name ?? paymentMethod) },
            }
            : paymentMethod,
    });
}
/** Get report policy id of IOU request */
function getIOURequestPolicyID(transaction, report) {
    // Workspace sender will exist for invoices
    const workspaceSender = transaction?.participants?.find((participant) => participant.isSender);
    return workspaceSender?.policyID ?? report?.policyID;
}
function getIOUActionForTransactions(transactionIDList, iouReportID) {
    return Object.values(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`] ?? {})?.filter((reportAction) => {
        if (!(0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction)) {
            return false;
        }
        const message = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction);
        if (!message?.IOUTransactionID) {
            return false;
        }
        return transactionIDList.includes(message.IOUTransactionID);
    });
}
/** Merge several transactions into one by updating the fields of the one we want to keep and deleting the rest */
function mergeDuplicates({ transactionThreadReportID: optimisticTransactionThreadReportID, ...params }) {
    const allParams = { ...params };
    const originalSelectedTransaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${params.transactionID}`];
    const optimisticTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${params.transactionID}`,
        value: {
            ...originalSelectedTransaction,
            billable: params.billable,
            comment: {
                comment: params.comment,
            },
            category: params.category,
            created: params.created,
            currency: params.currency,
            modifiedMerchant: params.merchant,
            reimbursable: params.reimbursable,
            tag: params.tag,
        },
    };
    const failureTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${params.transactionID}`,
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        value: originalSelectedTransaction,
    };
    const optimisticTransactionDuplicatesData = params.transactionIDList.map((id) => ({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${id}`,
        value: null,
    }));
    const failureTransactionDuplicatesData = params.transactionIDList.map((id) => ({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${id}`,
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        value: allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${id}`],
    }));
    const optimisticTransactionViolations = [...params.transactionIDList, params.transactionID].map((id) => {
        const violations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`] ?? [];
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`,
            value: violations.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION),
        };
    });
    const failureTransactionViolations = [...params.transactionIDList, params.transactionID].map((id) => {
        const violations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`] ?? [];
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`,
            value: violations,
        };
    });
    const duplicateTransactionTotals = params.transactionIDList.reduce((total, id) => {
        const duplicateTransaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${id}`];
        if (!duplicateTransaction) {
            return total;
        }
        return total + duplicateTransaction.amount;
    }, 0);
    const expenseReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${params.reportID}`];
    const expenseReportOptimisticData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${params.reportID}`,
        value: {
            total: (expenseReport?.total ?? 0) - duplicateTransactionTotals,
        },
    };
    const expenseReportFailureData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${params.reportID}`,
        value: {
            total: expenseReport?.total,
        },
    };
    const iouActionsToDelete = params.reportID ? getIOUActionForTransactions(params.transactionIDList, params.reportID) : [];
    const deletedTime = DateUtils_1.default.getDBTime();
    const expenseReportActionsOptimisticData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${params.reportID}`,
        value: iouActionsToDelete.reduce((val, reportAction) => {
            const firstMessage = Array.isArray(reportAction.message) ? reportAction.message.at(0) : null;
            // eslint-disable-next-line no-param-reassign
            val[reportAction.reportActionID] = {
                originalMessage: {
                    deleted: deletedTime,
                },
                ...(firstMessage && {
                    message: [
                        {
                            ...firstMessage,
                            deleted: deletedTime,
                        },
                        ...(Array.isArray(reportAction.message) ? reportAction.message.slice(1) : []),
                    ],
                }),
                ...(!Array.isArray(reportAction.message) && {
                    message: {
                        deleted: deletedTime,
                    },
                }),
            };
            return val;
        }, {}),
    };
    const expenseReportActionsFailureData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${params.reportID}`,
        value: iouActionsToDelete.reduce((val, reportAction) => {
            // eslint-disable-next-line no-param-reassign
            val[reportAction.reportActionID] = {
                originalMessage: {
                    deleted: null,
                },
                message: reportAction.message,
            };
            return val;
        }, {}),
    };
    const optimisticReportAction = (0, ReportUtils_1.buildOptimisticResolvedDuplicatesReportAction)();
    const transactionThreadReportID = optimisticTransactionThreadReportID ?? (params.reportID ? getIOUActionForTransactions([params.transactionID], params.reportID).at(0)?.childReportID : undefined);
    const optimisticReportActionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
        value: {
            [optimisticReportAction.reportActionID]: optimisticReportAction,
        },
    };
    const failureReportActionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
        value: {
            [optimisticReportAction.reportActionID]: null,
        },
    };
    const optimisticData = [];
    const failureData = [];
    const successData = [];
    optimisticData.push(optimisticTransactionData, ...optimisticTransactionDuplicatesData, ...optimisticTransactionViolations, expenseReportOptimisticData, expenseReportActionsOptimisticData, optimisticReportActionData);
    failureData.push(failureTransactionData, ...failureTransactionDuplicatesData, ...failureTransactionViolations, expenseReportFailureData, expenseReportActionsFailureData, failureReportActionData);
    if (optimisticTransactionThreadReportID) {
        const iouAction = (0, ReportActionsUtils_1.getIOUActionForReportID)(params.reportID, params.transactionID);
        const optimisticCreatedAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(currentUserEmail);
        const optimisticTransactionThreadReport = (0, ReportUtils_1.buildTransactionThread)(iouAction, expenseReport, undefined, optimisticTransactionThreadReportID);
        allParams.transactionThreadReportID = optimisticTransactionThreadReportID;
        allParams.createdReportActionIDForThread = optimisticCreatedAction?.reportActionID;
        optimisticTransactionThreadReport.pendingFields = {
            createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        };
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTransactionThreadReportID}`,
            value: optimisticTransactionThreadReport,
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThreadReportID}`,
            value: { [optimisticCreatedAction.reportActionID]: optimisticCreatedAction },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTransactionThreadReportID}`,
            value: null,
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThreadReportID}`,
            value: null,
        });
        if (iouAction?.reportActionID) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThreadReport?.parentReportID}`,
                value: { [iouAction?.reportActionID]: { childReportID: optimisticTransactionThreadReportID, childType: CONST_1.default.REPORT.TYPE.CHAT } },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThreadReport?.parentReportID}`,
                value: { [iouAction?.reportActionID]: { childReportID: null, childType: null } },
            });
        }
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThreadReportID}`,
            value: { [optimisticCreatedAction.reportActionID]: { pendingAction: null } },
        });
    }
    API.write(types_1.WRITE_COMMANDS.MERGE_DUPLICATES, { ...allParams, reportActionID: optimisticReportAction.reportActionID }, { optimisticData, failureData, successData });
}
function updateLastLocationPermissionPrompt() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, new Date().toISOString());
}
function setMultipleMoneyRequestParticipantsFromReport(transactionIDs, reportValue) {
    const participants = getMoneyRequestParticipantsFromReport(reportValue);
    const updatedTransactions = {};
    transactionIDs.forEach((transactionID) => {
        updatedTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`] = {
            participants,
            participantsAutoAssigned: true,
        };
    });
    return react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, updatedTransactions);
}
/** Instead of merging the duplicates, it updates the transaction we want to keep and puts the others on hold without deleting them */
function resolveDuplicates(params) {
    if (!params.transactionID) {
        return;
    }
    const originalSelectedTransaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${params.transactionID}`];
    const optimisticTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${params.transactionID}`,
        value: {
            ...originalSelectedTransaction,
            billable: params.billable,
            comment: {
                comment: params.comment,
            },
            category: params.category,
            created: params.created,
            currency: params.currency,
            modifiedMerchant: params.merchant,
            reimbursable: params.reimbursable,
            tag: params.tag,
        },
    };
    const failureTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${params.transactionID}`,
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        value: originalSelectedTransaction,
    };
    const optimisticTransactionViolations = [...params.transactionIDList, params.transactionID].map((id) => {
        const violations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`] ?? [];
        const newViolation = { name: CONST_1.default.VIOLATIONS.HOLD, type: CONST_1.default.VIOLATION_TYPES.VIOLATION };
        const updatedViolations = id === params.transactionID ? violations : [...violations, newViolation];
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`,
            value: updatedViolations.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION),
        };
    });
    const failureTransactionViolations = [...params.transactionIDList, params.transactionID].map((id) => {
        const violations = allTransactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`] ?? [];
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`,
            value: violations,
        };
    });
    const iouActionList = params.reportID ? getIOUActionForTransactions(params.transactionIDList, params.reportID) : [];
    const orderedTransactionIDList = iouActionList
        .map((action) => {
        const message = (0, ReportActionsUtils_1.getOriginalMessage)(action);
        return message?.IOUTransactionID;
    })
        .filter((id) => !!id);
    const optimisticHoldActions = [];
    const failureHoldActions = [];
    const reportActionIDList = [];
    const optimisticHoldTransactionActions = [];
    const failureHoldTransactionActions = [];
    iouActionList.forEach((action) => {
        const transactionThreadReportID = action?.childReportID;
        const createdReportAction = (0, ReportUtils_1.buildOptimisticHoldReportAction)();
        reportActionIDList.push(createdReportAction.reportActionID);
        const transactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) ? ((0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUTransactionID ?? CONST_1.default.DEFAULT_NUMBER_ID) : CONST_1.default.DEFAULT_NUMBER_ID;
        optimisticHoldTransactionActions.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                comment: {
                    hold: createdReportAction.reportActionID,
                },
            },
        });
        failureHoldTransactionActions.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                comment: {
                    hold: null,
                },
            },
        });
        optimisticHoldActions.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
            value: {
                [createdReportAction.reportActionID]: createdReportAction,
            },
        });
        failureHoldActions.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
            value: {
                [createdReportAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.genericHoldExpenseFailureMessage'),
                },
            },
        });
    });
    const transactionThreadReportID = params.reportID ? getIOUActionForTransactions([params.transactionID], params.reportID).at(0)?.childReportID : undefined;
    const optimisticReportAction = (0, ReportUtils_1.buildOptimisticDismissedViolationReportAction)({
        reason: 'manual',
        violationName: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
    });
    const optimisticReportActionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
        value: {
            [optimisticReportAction.reportActionID]: optimisticReportAction,
        },
    };
    const failureReportActionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
        value: {
            [optimisticReportAction.reportActionID]: null,
        },
    };
    const optimisticData = [];
    const failureData = [];
    optimisticData.push(optimisticTransactionData, ...optimisticTransactionViolations, ...optimisticHoldActions, ...optimisticHoldTransactionActions, optimisticReportActionData);
    failureData.push(failureTransactionData, ...failureTransactionViolations, ...failureHoldActions, ...failureHoldTransactionActions, failureReportActionData);
    const { reportID, transactionIDList, receiptID, ...otherParams } = params;
    const parameters = {
        ...otherParams,
        transactionID: params.transactionID,
        reportActionIDList,
        transactionIDList: orderedTransactionIDList,
        dismissedViolationReportActionID: optimisticReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.RESOLVE_DUPLICATES, parameters, { optimisticData, failureData });
}
const expenseReportStatusFilterMapping = {
    [CONST_1.default.SEARCH.STATUS.EXPENSE.DRAFTS]: (expenseReport) => expenseReport?.stateNum === CONST_1.default.REPORT.STATE_NUM.OPEN && expenseReport?.statusNum === CONST_1.default.REPORT.STATUS_NUM.OPEN,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.OUTSTANDING]: (expenseReport) => expenseReport?.stateNum === CONST_1.default.REPORT.STATE_NUM.SUBMITTED && expenseReport?.statusNum === CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.APPROVED]: (expenseReport) => expenseReport?.stateNum === CONST_1.default.REPORT.STATE_NUM.APPROVED && expenseReport?.statusNum === CONST_1.default.REPORT.STATUS_NUM.APPROVED,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.PAID]: (expenseReport) => (expenseReport?.stateNum ?? 0) >= CONST_1.default.REPORT.STATE_NUM.APPROVED && expenseReport?.statusNum === CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.DONE]: (expenseReport) => expenseReport?.stateNum === CONST_1.default.REPORT.STATE_NUM.APPROVED && expenseReport?.statusNum === CONST_1.default.REPORT.STATUS_NUM.CLOSED,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.UNREPORTED]: (expenseReport) => !expenseReport,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.ALL]: () => true,
};
//  Determines whether the current search results should be optimistically updated
function shouldOptimisticallyUpdateSearch(currentSearchQueryJSON, iouReport, isInvoice) {
    if (currentSearchQueryJSON.type !== CONST_1.default.SEARCH.DATA_TYPES.INVOICE && currentSearchQueryJSON.type !== CONST_1.default.SEARCH.DATA_TYPES.EXPENSE) {
        return false;
    }
    let shouldOptimisticallyUpdateByStatus;
    const status = currentSearchQueryJSON.status;
    if (Array.isArray(status)) {
        shouldOptimisticallyUpdateByStatus = status.some((val) => {
            const expenseStatus = val;
            return expenseReportStatusFilterMapping[expenseStatus](iouReport);
        });
    }
    else {
        const expenseStatus = status;
        shouldOptimisticallyUpdateByStatus = expenseReportStatusFilterMapping[expenseStatus](iouReport);
    }
    if (!shouldOptimisticallyUpdateByStatus) {
        return false;
    }
    const suggestedSearches = (0, SearchUIUtils_1.getSuggestedSearches)(userAccountID);
    const submitQueryJSON = suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT].searchQueryJSON;
    const approveQueryJSON = suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE].searchQueryJSON;
    const validSearchTypes = (!isInvoice && currentSearchQueryJSON.type === CONST_1.default.SEARCH.DATA_TYPES.EXPENSE) || (isInvoice && currentSearchQueryJSON.type === CONST_1.default.SEARCH.DATA_TYPES.INVOICE);
    return (shouldOptimisticallyUpdateByStatus &&
        validSearchTypes &&
        (currentSearchQueryJSON.flatFilters.length === 0 || [submitQueryJSON?.hash, approveQueryJSON?.hash].includes(currentSearchQueryJSON.hash)));
}
function getSearchOnyxUpdate({ participant, transaction, iouReport, policy, transactionThreadReportID, isFromOneTransactionReport, isInvoice, }) {
    const toAccountID = participant?.accountID;
    const fromAccountID = currentUserPersonalDetails?.accountID;
    const currentSearchQueryJSON = (0, SearchQueryUtils_1.getCurrentSearchQueryJSON)();
    if (currentSearchQueryJSON && toAccountID != null && fromAccountID != null) {
        if (shouldOptimisticallyUpdateSearch(currentSearchQueryJSON, iouReport, isInvoice)) {
            const isOptimisticToAccountData = (0, ReportUtils_1.isOptimisticPersonalDetail)(toAccountID);
            const successData = [];
            if (isOptimisticToAccountData) {
                // The optimistic personal detail is removed on the API's success data but we can't change the managerID of the transaction in the snapshot.
                // So we need to add the optimistic personal detail back to the snapshot in success data to prevent the flickering.
                // After that, it will be cleared via Search API.
                // See https://github.com/Expensify/App/issues/61310 for more information.
                successData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchQueryJSON.hash}`,
                    value: {
                        data: {
                            [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: {
                                [toAccountID]: {
                                    accountID: toAccountID,
                                    displayName: participant?.displayName,
                                    login: participant?.login,
                                },
                            },
                        },
                    },
                });
            }
            return {
                optimisticData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchQueryJSON.hash}`,
                        value: {
                            data: {
                                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: {
                                    [toAccountID]: {
                                        accountID: toAccountID,
                                        displayName: participant?.displayName,
                                        login: participant?.login,
                                    },
                                    [fromAccountID]: {
                                        accountID: fromAccountID,
                                        avatar: currentUserPersonalDetails?.avatar,
                                        displayName: currentUserPersonalDetails?.displayName,
                                        login: currentUserPersonalDetails?.login,
                                    },
                                },
                                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]: {
                                    accountID: fromAccountID,
                                    managerID: toAccountID,
                                    ...(transactionThreadReportID && { transactionThreadReportID }),
                                    ...(isFromOneTransactionReport && { isFromOneTransactionReport }),
                                    ...transaction,
                                },
                                ...(policy && { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`]: policy }),
                                ...(iouReport && { [`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`]: iouReport }),
                            },
                        },
                    },
                ],
                successData,
            };
        }
    }
}
function dismissRejectUseExplanation() {
    const parameters = {
        name: ONYXKEYS_1.default.NVP_DISMISSED_REJECT_USE_EXPLANATION,
        value: true,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_DISMISSED_REJECT_USE_EXPLANATION,
            value: true,
        },
    ];
    API.write(types_1.WRITE_COMMANDS.SET_NAME_VALUE_PAIR, parameters, {
        optimisticData,
    });
}
/**
 * Reject a money request
 * @param transactionID - The ID of the transaction to reject
 * @param reportID - The ID of the expense report to reject
 * @param comment - The comment to add to the reject action
 * @returns The route to navigate back to
 */
function rejectMoneyRequest(transactionID, reportID, comment) {
    const transaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    const transactionAmount = (0, TransactionUtils_1.getAmount)(transaction);
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`];
    const isPolicyDelayedSubmissionEnabled = policy ? (0, PolicyUtils_1.isDelayedSubmissionEnabled)(policy) : false;
    const isIOU = (0, ReportUtils_1.isIOUReport)(report);
    const searchFullScreenRoutes = Navigation_1.navigationRef.getRootState()?.routes.findLast((route) => route.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR);
    const lastRoute = searchFullScreenRoutes?.state?.routes?.at(-1);
    const isUserOnSearchPage = (0, isSearchTopmostFullScreenRoute_1.default)() && lastRoute?.name === SCREENS_1.default.SEARCH.ROOT;
    const isUserOnSearchMoneyRequestReport = (0, isSearchTopmostFullScreenRoute_1.default)() && lastRoute?.name === SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT;
    if (!report || !transaction) {
        return undefined;
    }
    const reportAction = (0, ReportActionsUtils_1.getIOUActionForReportID)(reportID, transactionID);
    const childReportID = reportAction?.childReportID;
    let movedToReport;
    let rejectedToReportID;
    let urlToNavigateBack;
    const hasMultipleExpenses = (0, ReportUtils_1.getReportTransactions)(reportID).length > 1;
    // Build optimistic data updates
    const optimisticData = [];
    // Create system messages in both expense report and expense thread
    // The "rejected this expense" action should come before the reject comment
    const baseTimestamp = DateUtils_1.default.getDBTime();
    const optimisticRejectReportAction = (0, ReportUtils_1.buildOptimisticRejectReportAction)(baseTimestamp);
    const optimisticRejectReportActionComment = (0, ReportUtils_1.buildOptimisticRejectReportActionComment)(comment, DateUtils_1.default.addMillisecondsFromDateTime(baseTimestamp, 1));
    // Build successData and failureData to prevent duplication
    const successData = [];
    const failureData = [];
    if (!isPolicyDelayedSubmissionEnabled || isIOU) {
        if (hasMultipleExpenses) {
            // For reports with multiple expenses: Update report total
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                value: {
                    total: (report?.total ?? 0) + transactionAmount,
                    pendingFields: {
                        total: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                value: {
                    reportID: null,
                },
            });
            // Add success data for report total update
            successData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                value: {
                    pendingFields: { total: null },
                },
            });
            // Add failure data for report total revert
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                value: {
                    total: report?.total ?? 0,
                    pendingFields: { total: null },
                },
            });
            // Add failure data for transaction revert
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                value: {
                    reportID: transaction?.reportID ?? reportID,
                },
            });
            if (isUserOnSearchPage) {
                // Navigate to the existing Reports > Expense view
                urlToNavigateBack = undefined;
            }
            else {
                // Go back to the original expenses report
                urlToNavigateBack = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID);
            }
        }
        else {
            // For reports with single expense: Delete the report
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                value: null,
            });
            // And delete the corresponding REPORTPREVIEW action
            const parentReportID = report?.parentReportID;
            const parentReportActionID = report?.parentReportActionID;
            const deletedTime = DateUtils_1.default.getDBTime();
            if (parentReportActionID) {
                optimisticData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`,
                    value: {
                        [parentReportActionID]: {
                            originalMessage: {
                                deleted: deletedTime,
                            },
                        },
                    },
                });
                failureData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`,
                    value: {
                        [parentReportActionID]: {
                            originalMessage: {
                                deleted: null,
                            },
                        },
                    },
                });
            }
            // Add success data for report deletion (no action needed, report is already deleted)
            successData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                value: null,
            });
            // Add failure data to restore the report
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                value: report,
            });
            if (isUserOnSearchPage) {
                // Navigate to the existing Reports > Expense view.
                urlToNavigateBack = undefined;
            }
            else if (isUserOnSearchMoneyRequestReport) {
                // Go back based on backTo param of the current route
                const lastRouteParams = lastRoute?.params;
                urlToNavigateBack = lastRouteParams && 'backTo' in lastRouteParams ? lastRouteParams?.backTo : undefined;
            }
            else {
                // Go back to the expense chat
                urlToNavigateBack = ROUTES_1.default.REPORT_WITH_ID.getRoute(report.chatReportID);
            }
        }
    }
    else if (hasMultipleExpenses) {
        if (isUserOnSearchPage) {
            // Navigate to the existing Reports > Expense view.
            urlToNavigateBack = undefined;
        }
        else {
            // Go back to the original expenses report
            urlToNavigateBack = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID);
        }
        // For reports with multiple expenses:
        // 1. Update report total
        // 2. Remove expense from report
        // 3. Add to existing draft report or create new one
        const existingOpenReport = Object.values(allReports ?? {}).find((r) => r?.reportID !== reportID &&
            r?.chatReportID === report.chatReportID &&
            r?.type === CONST_1.default.REPORT.TYPE.EXPENSE &&
            (0, ReportUtils_1.isOpenReport)(r) &&
            r?.ownerAccountID === report.ownerAccountID);
        if (existingOpenReport) {
            movedToReport = existingOpenReport;
            rejectedToReportID = existingOpenReport.reportID;
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${movedToReport?.reportID}`,
                value: {
                    ...movedToReport,
                    total: (movedToReport?.total ?? 0) - transactionAmount,
                },
            });
            // Add success data for existing report update
            successData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${movedToReport?.reportID}`,
                value: { pendingFields: { total: null } },
            });
            // Add failure data to revert existing report total
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${movedToReport?.reportID}`,
                value: {
                    total: movedToReport?.total ?? 0,
                    pendingFields: { total: null },
                },
            });
        }
        else {
            rejectedToReportID = (0, ReportUtils_1.generateReportID)();
        }
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                total: (report?.total ?? 0) + transactionAmount,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                reportID: rejectedToReportID,
            },
        });
        // Add success data for original report total update
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                pendingFields: null,
                errorFields: null,
            },
        });
        // Add success data for transaction update
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                pendingAction: null,
                errorFields: null,
            },
        });
        // Add failure data to revert original report total
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                total: report?.total ?? 0,
            },
        });
        // Add failure data to revert transaction reportID
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
            value: {
                reportID: transaction?.reportID ?? reportID,
            },
        });
    }
    else {
        // For reports with single expense
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            },
        });
        // Add success data for report state update
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                pendingFields: {
                    stateNum: null,
                    statusNum: null,
                },
            },
        });
        // Add failure data to revert report state
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                stateNum: report?.stateNum,
                statusNum: report?.statusNum,
            },
        });
        if (isUserOnSearchPage) {
            // Navigate to the existing Reports > Expense view
            urlToNavigateBack = undefined;
        }
        else {
            // Go back to the original expenses report
            urlToNavigateBack = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID);
        }
    }
    // Add optimistic rejected actions to the child report
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
        value: {
            [optimisticRejectReportAction.reportActionID]: optimisticRejectReportAction,
            [optimisticRejectReportActionComment.reportActionID]: optimisticRejectReportActionComment,
        },
    });
    // Add successData to clear pending actions when the server confirms
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
        value: {
            [optimisticRejectReportAction.reportActionID]: optimisticRejectReportAction,
            [optimisticRejectReportActionComment.reportActionID]: {
                ...optimisticRejectReportActionComment,
                pendingAction: null,
            },
        },
    });
    // Add failureData to remove optimistic actions if the request fails
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
        value: {
            [optimisticRejectReportAction.reportActionID]: null, // Remove optimistic rejected action
            [optimisticRejectReportActionComment.reportActionID]: null,
        },
    });
    // Collect all reports that need lastReadTime and lastVisibleActionCreated updates
    const reportsToUpdate = [];
    // Add rter transaction violation
    if (!isIOU) {
        const currentTransactionViolations = allTransactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction?.transactionID}`] ?? [];
        const newViolation = {
            name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
            type: CONST_1.default.VIOLATION_TYPES.WARNING,
            data: {
                comment: comment ?? '',
                rejectedBy: currentUserEmail,
                rejectedDate: DateUtils_1.default.getDBTime(),
            },
            showInReview: true,
        };
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction?.transactionID}`,
            value: [...currentTransactionViolations, newViolation],
        });
        // Add failure data to revert transaction violations
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction?.transactionID}`,
            value: currentTransactionViolations,
        });
    }
    // Child report (where rejected actions are added)
    if (childReportID) {
        reportsToUpdate.push({
            reportID: childReportID,
            lastVisibleActionCreated: optimisticRejectReportActionComment.created,
        });
    }
    // Moved to report (if transaction is moved to another report)
    if (rejectedToReportID && rejectedToReportID !== reportID) {
        reportsToUpdate.push({
            reportID: rejectedToReportID,
            lastVisibleActionCreated: optimisticRejectReportActionComment.created,
        });
    }
    const lastReadTime = DateUtils_1.default.subtractMillisecondsFromDateTime(optimisticRejectReportAction.created, 1);
    // Add optimistic data for all reports
    reportsToUpdate.forEach(({ reportID: targetReportID, lastVisibleActionCreated }) => {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${targetReportID}`,
            value: {
                lastReadTime,
                lastVisibleActionCreated,
            },
        });
    });
    // Add success data for all reports
    reportsToUpdate.forEach(({ reportID: targetReportID }) => {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${targetReportID}`,
            value: {
                pendingFields: null,
                errorFields: null,
            },
        });
    });
    // Add failure data to revert all reports
    reportsToUpdate.forEach(({ reportID: targetReportID }) => {
        const targetReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${targetReportID}`];
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${targetReportID}`,
            value: {
                lastReadTime: targetReport?.lastReadTime,
                lastVisibleActionCreated: targetReport?.lastVisibleActionCreated,
            },
        });
    });
    // Build API parameters
    const parameters = {
        transactionID,
        reportID,
        comment,
        rejectedToReportID,
        rejectedActionReportActionID: optimisticRejectReportAction.reportActionID,
        rejectedCommentReportActionID: optimisticRejectReportActionComment.reportActionID,
    };
    // Make API call
    API.write(types_1.WRITE_COMMANDS.REJECT_MONEY_REQUEST, parameters, { optimisticData, successData, failureData });
    return urlToNavigateBack;
}
function markRejectViolationAsResolved(transactionID, reportID) {
    if (!reportID) {
        return;
    }
    const currentViolations = allTransactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`];
    const updatedViolations = currentViolations?.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE);
    const optimisticMarkedAsResolvedReportAction = (0, ReportUtils_1.buildOptimisticMarkedAsResolvedReportAction)();
    // Build optimistic data
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: updatedViolations,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticMarkedAsResolvedReportAction.reportActionID]: optimisticMarkedAsResolvedReportAction,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticMarkedAsResolvedReportAction.reportActionID]: {
                    ...optimisticMarkedAsResolvedReportAction,
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: currentViolations,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticMarkedAsResolvedReportAction.reportActionID]: null,
            },
        },
    ];
    const parameters = {
        transactionID,
        markedAsResolvedReportActionID: optimisticMarkedAsResolvedReportAction.reportActionID,
    };
    // Make API call
    API.write(types_1.WRITE_COMMANDS.MARK_TRANSACTION_VIOLATION_AS_RESOLVED, parameters, {
        optimisticData,
        successData,
        failureData,
    });
    const currentReportID = (0, ReportUtils_1.getDisplayedReportID)(reportID);
    (0, Report_1.notifyNewAction)(currentReportID, userAccountID);
}
/**
 * Create a draft transaction to set up split expense details for the split expense flow
 */
function initSplitExpense(transaction, isOpenCreatedSplit) {
    if (!transaction) {
        return;
    }
    const reportID = transaction?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID);
    if (isOpenCreatedSplit) {
        const originalTransactionID = transaction.comment?.originalTransactionID;
        const originalTransaction = allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`];
        const relatedTransactions = Object.values(allTransactions).filter((currentTransaction) => {
            const currentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${currentTransaction?.reportID}`];
            return currentTransaction?.comment?.originalTransactionID === originalTransactionID && !!currentReport && currentReport?.stateNum !== CONST_1.default.REPORT.STATUS_NUM.CLOSED;
        });
        const transactionDetails = (0, ReportUtils_1.getTransactionDetails)(originalTransaction);
        const draftTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
            originalTransactionID,
            transactionParams: {
                splitExpenses: relatedTransactions.map((currentTransaction) => {
                    const currentTransactionDetails = (0, ReportUtils_1.getTransactionDetails)(currentTransaction);
                    return {
                        transactionID: currentTransaction?.transactionID ?? String(CONST_1.default.DEFAULT_NUMBER_ID),
                        amount: currentTransactionDetails?.amount ?? 0,
                        description: currentTransactionDetails?.comment,
                        category: currentTransactionDetails?.category,
                        tags: currentTransactionDetails?.tag ? [currentTransactionDetails?.tag] : [],
                        created: currentTransaction?.created ?? '',
                    };
                }),
                amount: transactionDetails?.amount ?? 0,
                currency: transactionDetails?.currency ?? CONST_1.default.CURRENCY.USD,
                merchant: transactionDetails?.merchant ?? '',
                participants: transaction?.participants,
                attendees: transactionDetails?.attendees,
                reportID: originalTransaction?.reportID,
                reimbursable: transactionDetails?.reimbursable,
            },
        });
        react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${originalTransactionID}`, draftTransaction);
        Navigation_1.default.navigate(ROUTES_1.default.SPLIT_EXPENSE.getRoute(originalTransaction?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID), originalTransactionID, transaction.transactionID, Navigation_1.default.getActiveRouteWithoutParams()));
        return;
    }
    const transactionDetails = (0, ReportUtils_1.getTransactionDetails)(transaction);
    const transactionDetailsAmount = transactionDetails?.amount ?? 0;
    const defaultCreated = DateUtils_1.default.formatWithUTCTimeZone(DateUtils_1.default.getDBTime(), CONST_1.default.DATE.FNS_FORMAT_STRING);
    const draftTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
        originalTransactionID: transaction.transactionID,
        transactionParams: {
            splitExpenses: [
                {
                    transactionID: NumberUtils.rand64(),
                    amount: Math.floor(transactionDetailsAmount / 2),
                    description: transactionDetails?.comment,
                    category: transactionDetails?.category,
                    tags: transaction?.tag ? [transaction?.tag] : [],
                    created: transactionDetails?.created ?? defaultCreated,
                },
                {
                    transactionID: NumberUtils.rand64(),
                    amount: Math.ceil(transactionDetailsAmount / 2),
                    description: transactionDetails?.comment,
                    category: transactionDetails?.category,
                    tags: transaction?.tag ? [transaction?.tag] : [],
                    created: transactionDetails?.created ?? defaultCreated,
                },
            ],
            amount: transactionDetailsAmount,
            currency: transactionDetails?.currency ?? CONST_1.default.CURRENCY.USD,
            merchant: transactionDetails?.merchant ?? '',
            participants: transaction?.participants,
            attendees: transactionDetails?.attendees,
            reportID,
            reimbursable: transactionDetails?.reimbursable,
        },
    });
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transaction?.transactionID}`, draftTransaction);
    Navigation_1.default.navigate(ROUTES_1.default.SPLIT_EXPENSE.getRoute(reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID), transaction.transactionID, undefined, Navigation_1.default.getActiveRoute()));
}
/**
 * Create a draft transaction to set up split expense details for edit split details
 */
function initDraftSplitExpenseDataForEdit(draftTransaction, splitExpenseTransactionID, reportID) {
    if (!draftTransaction || !splitExpenseTransactionID) {
        return;
    }
    const originalTransactionID = draftTransaction?.comment?.originalTransactionID;
    const originalTransaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`];
    const splitTransactionData = draftTransaction?.comment?.splitExpenses?.find((item) => item.transactionID === splitExpenseTransactionID);
    const transactionDetails = (0, ReportUtils_1.getTransactionDetails)(originalTransaction);
    const editDraftTransaction = (0, TransactionUtils_1.buildOptimisticTransaction)({
        existingTransactionID: CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID,
        originalTransactionID,
        transactionParams: {
            amount: Number(splitTransactionData?.amount),
            currency: transactionDetails?.currency ?? CONST_1.default.CURRENCY.USD,
            comment: splitTransactionData?.description,
            tag: splitTransactionData?.tags?.at(0),
            merchant: transactionDetails?.merchant ?? '',
            participants: draftTransaction?.participants,
            attendees: transactionDetails?.attendees,
            reportID,
            created: splitTransactionData?.created ?? '',
            category: splitTransactionData?.category ?? '',
        },
    });
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`, editDraftTransaction);
    Navigation_1.default.navigate(ROUTES_1.default.SPLIT_EXPENSE_EDIT.getRoute(reportID, originalTransactionID, splitTransactionData?.transactionID, Navigation_1.default.getActiveRoute()));
}
/**
 * Append a new split expense entry to the draft transaction's splitExpenses array
 */
function addSplitExpenseField(transaction, draftTransaction) {
    if (!transaction || !draftTransaction) {
        return;
    }
    const transactionDetails = (0, ReportUtils_1.getTransactionDetails)(transaction);
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transaction.transactionID}`, {
        comment: {
            splitExpenses: [
                ...(draftTransaction.comment?.splitExpenses ?? []),
                {
                    transactionID: NumberUtils.rand64(),
                    amount: 0,
                    description: transactionDetails?.comment,
                    category: transactionDetails?.category,
                    tags: transaction?.tag ? [transaction?.tag] : [],
                    created: transactionDetails?.created ?? DateUtils_1.default.formatWithUTCTimeZone(DateUtils_1.default.getDBTime(), CONST_1.default.DATE.FNS_FORMAT_STRING),
                },
            ],
        },
    });
}
function removeSplitExpenseField(draftTransaction, splitExpenseTransactionID) {
    if (!draftTransaction || !splitExpenseTransactionID) {
        return;
    }
    const originalTransactionID = draftTransaction?.comment?.originalTransactionID;
    const splitExpenses = draftTransaction.comment?.splitExpenses?.filter((item) => item.transactionID !== splitExpenseTransactionID);
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${originalTransactionID}`, {
        comment: {
            splitExpenses,
        },
    });
}
function updateSplitExpenseField(splitExpenseDraftTransaction, splitExpenseTransactionID) {
    if (!splitExpenseDraftTransaction || !splitExpenseTransactionID) {
        return;
    }
    const originalTransactionID = splitExpenseDraftTransaction?.comment?.originalTransactionID;
    const draftTransaction = allDraftSplitTransactions[`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${originalTransactionID}`];
    const splitExpenses = draftTransaction?.comment?.splitExpenses?.map((item) => {
        if (item.transactionID === splitExpenseTransactionID) {
            const transactionDetails = (0, ReportUtils_1.getTransactionDetails)(splitExpenseDraftTransaction);
            return {
                ...item,
                description: transactionDetails?.comment,
                category: transactionDetails?.category,
                tags: splitExpenseDraftTransaction?.tag ? [splitExpenseDraftTransaction?.tag] : [],
                created: transactionDetails?.created ?? DateUtils_1.default.formatWithUTCTimeZone(DateUtils_1.default.getDBTime(), CONST_1.default.DATE.FNS_FORMAT_STRING),
            };
        }
        return item;
    });
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${originalTransactionID}`, {
        comment: {
            splitExpenses,
        },
    });
}
function updateSplitExpenseAmountField(draftTransaction, currentItemTransactionID, amount) {
    if (!draftTransaction?.transactionID || !currentItemTransactionID) {
        return;
    }
    const updatedSplitExpenses = draftTransaction.comment?.splitExpenses?.map((splitExpense) => {
        if (splitExpense.transactionID === currentItemTransactionID) {
            return {
                ...splitExpense,
                amount,
            };
        }
        return splitExpense;
    });
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${draftTransaction?.comment?.originalTransactionID}`, {
        comment: {
            splitExpenses: updatedSplitExpenses,
        },
    });
}
/**
 * Clear errors from split transaction draft
 */
function clearSplitTransactionDraftErrors(transactionID) {
    if (!transactionID) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, {
        errors: null,
    });
}
function saveSplitTransactions(draftTransaction, hash) {
    const transactionReport = (0, ReportUtils_1.getReportOrDraftReport)(draftTransaction?.reportID);
    const parentTransactionReport = (0, ReportUtils_1.getReportOrDraftReport)(transactionReport?.parentReportID);
    const expenseReport = transactionReport?.type === CONST_1.default.REPORT.TYPE.EXPENSE ? transactionReport : parentTransactionReport;
    const originalTransactionID = draftTransaction?.comment?.originalTransactionID ?? CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID;
    const originalTransaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`];
    const iouActions = getIOUActionForTransactions([originalTransactionID], expenseReport?.reportID);
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(expenseReport?.policyID);
    const policyCategories = (0, Category_1.getPolicyCategoriesData)(expenseReport?.policyID);
    const policyTags = (0, Tag_1.getPolicyTagsData)(expenseReport?.policyID);
    const participants = getMoneyRequestParticipantsFromReport(expenseReport);
    const splitExpenses = draftTransaction?.comment?.splitExpenses ?? [];
    // Validate custom unit rate before proceeding with split
    const customUnitRateID = originalTransaction?.comment?.customUnit?.customUnitRateID;
    const isPerDiem = (0, TransactionUtils_1.isPerDiemRequest)(originalTransaction);
    if (customUnitRateID && policy && !isPerDiem) {
        const customUnitRate = (0, PolicyUtils_1.getDistanceRateCustomUnitRate)(policy, customUnitRateID);
        // If the rate doesn't exist or is disabled, show an error and return early
        if (!customUnitRate || !customUnitRate.enabled) {
            // Show error to user
            react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${originalTransactionID}`, {
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('iou.error.invalidRate'),
            });
            return;
        }
    }
    const splits = splitExpenses.map((split) => {
        const currentDescription = (0, ReportUtils_1.getParsedComment)(Parser_1.default.htmlToMarkdown(split.description ?? ''));
        return {
            amount: split.amount,
            category: split.category ?? '',
            tag: split.tags?.[0] ?? '',
            created: split.created,
            merchant: draftTransaction?.merchant ?? '',
            transactionID: split.transactionID,
            comment: {
                comment: currentDescription,
            },
        };
    }) ?? [];
    const successData = [];
    const failureData = [];
    const optimisticData = [];
    splitExpenses.forEach((splitExpense, index) => {
        const requestMoneyInformation = {
            report: expenseReport,
            participantParams: {
                participant: participants.at(0) ?? {},
                payeeEmail: currentUserPersonalDetails?.login ?? '',
                payeeAccountID: currentUserPersonalDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
            },
            policyParams: {
                policy,
                policyCategories,
                policyTags,
            },
            transactionParams: {
                amount: splitExpense.amount ?? 0,
                currency: draftTransaction?.currency ?? CONST_1.default.CURRENCY.USD,
                created: splitExpense.created,
                merchant: draftTransaction?.merchant ?? '',
                comment: splitExpense.description,
                category: splitExpense.category,
                tag: splitExpense.tags?.[0],
                originalTransactionID,
                attendees: draftTransaction?.comment?.attendees,
                source: CONST_1.default.IOU.TYPE.SPLIT,
                reimbursable: draftTransaction?.reimbursable,
            },
        };
        const { report, participantParams, policyParams, transactionParams } = requestMoneyInformation;
        const parsedComment = (0, ReportUtils_1.getParsedComment)(Parser_1.default.htmlToMarkdown(transactionParams.comment ?? ''));
        transactionParams.comment = parsedComment;
        const currentChatReport = (0, ReportUtils_1.getReportOrDraftReport)(report?.chatReportID);
        const parentChatReport = (0, ReportUtils_1.getReportOrDraftReport)(currentChatReport?.parentReportID);
        const existingTransactionID = splitExpense.transactionID;
        const { transactionThreadReportID, createdReportActionIDForThread, onyxData, iouAction } = getMoneyRequestInformation({
            participantParams,
            parentChatReport,
            policyParams,
            transactionParams,
            moneyRequestReportID: report?.reportID,
            existingTransaction: originalTransaction,
            existingTransactionID,
            isSplitExpense: true,
        });
        const split = splits.at(index);
        if (split) {
            // For request params we need to have the transactionThreadReportID, createdReportActionIDForThread and splitReportActionID which we get from moneyRequestInformation
            split.transactionThreadReportID = transactionThreadReportID;
            split.createdReportActionIDForThread = createdReportActionIDForThread;
            split.splitReportActionID = iouAction.reportActionID;
        }
        optimisticData.push(...(onyxData.optimisticData ?? []));
        successData.push(...(onyxData.successData ?? []));
        failureData.push(...(onyxData.failureData ?? []));
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`,
        value: {
            ...originalTransaction,
            reportID: CONST_1.default.REPORT.SPLIT_REPORT_ID,
        },
    });
    const firstIOU = iouActions.at(0);
    if (firstIOU) {
        const { updatedReportAction, iouReport, transactionThread } = prepareToCleanUpMoneyRequest(originalTransactionID, firstIOU);
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${firstIOU?.childReportID}`,
            value: null,
        });
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
            value: updatedReportAction,
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`,
            value: {
                [firstIOU.reportActionID]: {
                    ...firstIOU,
                    pendingAction: null,
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${firstIOU?.childReportID}`,
            value: transactionThread,
        });
    }
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`,
        value: originalTransaction,
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
        value: {
            data: {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`]: null,
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
        value: {
            data: {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`]: originalTransaction,
            },
        },
    });
    // Prepare splitApiParams for the Transaction_Split API call which requires a specific format for the splits
    // The format is: splits[0][amount], splits[0][category], splits[0][tag], etc.
    const splitApiParams = {};
    splits.forEach((split, i) => {
        Object.entries(split).forEach(([key, value]) => {
            const formattedValue = value !== null && typeof value === 'object' ? JSON.stringify(value) : value;
            splitApiParams[`splits[${i}][${key}]`] = formattedValue;
        });
    });
    const parameters = {
        ...splitApiParams,
        isReverseSplitOperation: false,
        transactionID: originalTransactionID,
    };
    API.write(types_1.WRITE_COMMANDS.SPLIT_TRANSACTION, parameters, { optimisticData, successData, failureData });
    react_native_1.InteractionManager.runAfterInteractions(() => (0, TransactionEdit_1.removeDraftSplitTransaction)(originalTransactionID));
    const isSearchPageTopmostFullScreenRoute = (0, isSearchTopmostFullScreenRoute_1.default)();
    const transactionThreadReportID = iouActions.at(0)?.childReportID;
    const transactionThreadReportScreen = Navigation_1.default.getReportRouteByID(transactionThreadReportID);
    if (isSearchPageTopmostFullScreenRoute || !transactionReport?.parentReportID) {
        Navigation_1.default.dismissModal();
        // After the modal is dismissed, remove the transaction thread report screen
        // to avoid navigating back to a report removed by the split transaction.
        requestAnimationFrame(() => {
            if (!transactionThreadReportScreen?.key) {
                return;
            }
            Navigation_1.default.removeScreenByKey(transactionThreadReportScreen.key);
        });
        return;
    }
    Navigation_1.default.dismissModalWithReport({ reportID: expenseReport?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID) });
    // After the modal is dismissed, remove the transaction thread report screen
    // to avoid navigating back to a report removed by the split transaction.
    requestAnimationFrame(() => {
        if (!transactionThreadReportScreen?.key) {
            return;
        }
        Navigation_1.default.removeScreenByKey(transactionThreadReportScreen.key);
    });
}
function assignReportToMe(report, accountID) {
    const takeControlReportAction = (0, ReportUtils_1.buildOptimisticChangeApproverReportAction)(accountID, accountID);
    const currentNextStep = allNextSteps[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${report?.reportID}`] ?? null;
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)({ ...report, managerID: accountID }, report.statusNum ?? CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, false, true);
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
                value: {
                    managerID: accountID,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
                value: {
                    [takeControlReportAction.reportActionID]: takeControlReportAction,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${report.reportID}`,
                value: optimisticNextStep,
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
                value: {
                    [takeControlReportAction.reportActionID]: {
                        pendingAction: null,
                        isOptimisticAction: null,
                        errors: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
                value: {
                    managerID: report.managerID,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${report?.reportID}`,
                value: currentNextStep,
            },
        ],
    };
    const params = {
        reportID: report.reportID,
        reportActionID: takeControlReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.ASSIGN_REPORT_TO_ME, params, onyxData);
}
function addReportApprover(report, newApproverEmail, newApproverAccountID, accountID) {
    const takeControlReportAction = (0, ReportUtils_1.buildOptimisticChangeApproverReportAction)(newApproverAccountID, accountID);
    const currentNextStep = allNextSteps[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${report?.reportID}`] ?? null;
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)({ ...report, managerID: newApproverAccountID }, report.statusNum ?? CONST_1.default.REPORT.STATUS_NUM.SUBMITTED, false, true);
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
                value: {
                    managerID: newApproverAccountID,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
                value: {
                    [takeControlReportAction.reportActionID]: takeControlReportAction,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${report.reportID}`,
                value: optimisticNextStep,
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
                value: {
                    [takeControlReportAction.reportActionID]: {
                        pendingAction: null,
                        errors: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
                value: {
                    managerID: report.managerID,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${report?.reportID}`,
                value: currentNextStep,
            },
        ],
    };
    const params = {
        reportID: report.reportID,
        reportActionID: takeControlReportAction.reportActionID,
        newApproverEmail,
    };
    API.write(types_1.WRITE_COMMANDS.ADD_REPORT_APPROVER, params, onyxData);
}
