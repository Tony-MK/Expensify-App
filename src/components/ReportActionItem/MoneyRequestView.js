"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var react_native_1 = require("react-native");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var MenuItem_1 = require("@components/MenuItem");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var Switch_1 = require("@components/Switch");
var Text_1 = require("@components/Text");
var ViolationMessages_1 = require("@components/ViolationMessages");
var useActiveRoute_1 = require("@hooks/useActiveRoute");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePrevious_1 = require("@hooks/usePrevious");
var useReportIsArchived_1 = require("@hooks/useReportIsArchived");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useTransactionViolations_1 = require("@hooks/useTransactionViolations");
var useViolations_1 = require("@hooks/useViolations");
var CardUtils_1 = require("@libs/CardUtils");
var CategoryUtils_1 = require("@libs/CategoryUtils");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
var getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
var MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
var Navigation_1 = require("@navigation/Navigation");
var AnimatedEmptyStateBackground_1 = require("@pages/home/report/AnimatedEmptyStateBackground");
var IOU_1 = require("@userActions/IOU");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var MoneyRequestReceiptView_1 = require("./MoneyRequestReceiptView");
function MoneyRequestView(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var allReports = _a.allReports, report = _a.report, policy = _a.policy, shouldShowAnimatedBackground = _a.shouldShowAnimatedBackground, _q = _a.readonly, readonly = _q === void 0 ? false : _q, updatedTransaction = _a.updatedTransaction, _r = _a.isFromReviewDuplicates, isFromReviewDuplicates = _r === void 0 ? false : _r, mergeTransactionID = _a.mergeTransactionID;
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var _s = (0, useLocalize_1.default)(), translate = _s.translate, toLocaleDigit = _s.toLocaleDigit;
    var getReportRHPActiveRoute = (0, useActiveRoute_1.default)().getReportRHPActiveRoute;
    var parentReportID = report === null || report === void 0 ? void 0 : report.parentReportID;
    var policyID = report === null || report === void 0 ? void 0 : report.policyID;
    var parentReport = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(parentReportID)];
    var allPolicyCategories = (0, OnyxListItemProvider_1.usePolicyCategories)();
    var policyCategories = allPolicyCategories === null || allPolicyCategories === void 0 ? void 0 : allPolicyCategories["".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES).concat(policyID)];
    var transactionReport = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.reportID)];
    var targetPolicyID = (updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.reportID) ? transactionReport === null || transactionReport === void 0 ? void 0 : transactionReport.policyID : policyID;
    var allPolicyTags = (0, OnyxListItemProvider_1.usePolicyTags)();
    var policyTagList = allPolicyTags === null || allPolicyTags === void 0 ? void 0 : allPolicyTags["".concat(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS).concat(targetPolicyID)];
    var cardList = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true })[0];
    var parentReportActions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(parentReportID), {
        canEvict: false,
        canBeMissing: true,
    })[0];
    var parentReportAction = (report === null || report === void 0 ? void 0 : report.parentReportActionID) ? parentReportActions === null || parentReportActions === void 0 ? void 0 : parentReportActions[report.parentReportActionID] : undefined;
    var isTrackExpense = (0, ReportUtils_1.isTrackExpenseReport)(report);
    var isFromMergeTransaction = !!mergeTransactionID;
    var moneyRequestReport = parentReport;
    var linkedTransactionID = (0, react_1.useMemo)(function () {
        if (!parentReportAction) {
            return undefined;
        }
        var originalMessage = parentReportAction && (0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(parentReportAction) : undefined;
        return originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.IOUTransactionID;
    }, [parentReportAction]);
    var transaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat((0, getNonEmptyStringOnyxID_1.default)(linkedTransactionID)), { canBeMissing: true })[0];
    var transactionBackup = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_BACKUP).concat((0, getNonEmptyStringOnyxID_1.default)(linkedTransactionID)), { canBeMissing: true })[0];
    var transactionViolations = (0, useTransactionViolations_1.default)(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID);
    var outstandingReportsByPolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID, { canBeMissing: true })[0];
    var originalTransactionIDFromComment = (_b = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _b === void 0 ? void 0 : _b.originalTransactionID;
    var originalTransaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(originalTransactionIDFromComment !== null && originalTransactionIDFromComment !== void 0 ? originalTransactionIDFromComment : ''), { canBeMissing: true })[0];
    var _t = (0, react_1.useMemo)(function () { var _a; return (_a = (0, ReportUtils_1.getTransactionDetails)(transaction)) !== null && _a !== void 0 ? _a : {}; }, [transaction]), transactionDate = _t.created, transactionAmount = _t.amount, transactionAttendees = _t.attendees, transactionTaxAmount = _t.taxAmount, transactionCurrency = _t.currency, transactionDescription = _t.comment, transactionMerchant = _t.merchant, transactionReimbursable = _t.reimbursable, transactionBillable = _t.billable, transactionCategory = _t.category, transactionTag = _t.tag, transactionOriginalAmount = _t.originalAmount, transactionOriginalCurrency = _t.originalCurrency, transactionPostedDate = _t.postedDate;
    var isEmptyMerchant = transactionMerchant === '' || transactionMerchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT;
    var isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(transaction);
    var isManualDistanceRequest = (0, TransactionUtils_1.isManualDistanceRequest)(transaction);
    var isMapDistanceRequest = isDistanceRequest && !isManualDistanceRequest;
    var isPerDiemRequest = (0, TransactionUtils_1.isPerDiemRequest)(transaction);
    var isTransactionScanning = (0, TransactionUtils_1.isScanning)(updatedTransaction !== null && updatedTransaction !== void 0 ? updatedTransaction : transaction);
    var hasRoute = (0, TransactionUtils_1.hasRoute)(transactionBackup !== null && transactionBackup !== void 0 ? transactionBackup : transaction, isDistanceRequest);
    // Use the updated transaction amount in merge flow to have correct positive/negative sign
    var actualAmount = isFromMergeTransaction && updatedTransaction ? updatedTransaction.amount : transactionAmount;
    var actualCurrency = updatedTransaction ? (0, TransactionUtils_1.getCurrency)(updatedTransaction) : transactionCurrency;
    var shouldDisplayTransactionAmount = ((isDistanceRequest && hasRoute) || !!actualAmount) && actualAmount !== undefined;
    var formattedTransactionAmount = shouldDisplayTransactionAmount ? (0, CurrencyUtils_1.convertToDisplayString)(actualAmount, actualCurrency) : '';
    var formattedPerAttendeeAmount = shouldDisplayTransactionAmount ? (0, CurrencyUtils_1.convertToDisplayString)(actualAmount / ((_c = transactionAttendees === null || transactionAttendees === void 0 ? void 0 : transactionAttendees.length) !== null && _c !== void 0 ? _c : 1), actualCurrency) : '';
    var formattedOriginalAmount = transactionOriginalAmount && transactionOriginalCurrency && (0, CurrencyUtils_1.convertToDisplayString)(transactionOriginalAmount, transactionOriginalCurrency);
    var isCardTransaction = (0, TransactionUtils_1.isCardTransaction)(transaction);
    var cardProgramName = (0, CardUtils_1.getCompanyCardDescription)(transaction === null || transaction === void 0 ? void 0 : transaction.cardName, transaction === null || transaction === void 0 ? void 0 : transaction.cardID, cardList);
    var shouldShowCard = isCardTransaction && cardProgramName;
    var isApproved = (0, ReportUtils_1.isReportApproved)({ report: moneyRequestReport });
    var isInvoice = (0, ReportUtils_1.isInvoiceReport)(moneyRequestReport);
    var taxRates = policy === null || policy === void 0 ? void 0 : policy.taxRates;
    var formattedTaxAmount = (updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.taxAmount)
        ? (0, CurrencyUtils_1.convertToDisplayString)(Math.abs(updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.taxAmount), transactionCurrency)
        : (0, CurrencyUtils_1.convertToDisplayString)(Math.abs(transactionTaxAmount !== null && transactionTaxAmount !== void 0 ? transactionTaxAmount : 0), transactionCurrency);
    var taxRatesDescription = taxRates === null || taxRates === void 0 ? void 0 : taxRates.name;
    var taxRateTitle = updatedTransaction ? (0, TransactionUtils_1.getTaxName)(policy, updatedTransaction) : (0, TransactionUtils_1.getTaxName)(policy, transaction);
    var actualTransactionDate = isFromMergeTransaction && updatedTransaction ? (0, TransactionUtils_1.getFormattedCreated)(updatedTransaction) : transactionDate;
    var fallbackTaxRateTitle = transaction === null || transaction === void 0 ? void 0 : transaction.taxValue;
    var isSettled = (0, ReportUtils_1.isSettled)(moneyRequestReport === null || moneyRequestReport === void 0 ? void 0 : moneyRequestReport.reportID);
    var isCancelled = moneyRequestReport && (moneyRequestReport === null || moneyRequestReport === void 0 ? void 0 : moneyRequestReport.isCancelledIOU);
    var isChatReportArchived = (0, useReportIsArchived_1.default)(moneyRequestReport === null || moneyRequestReport === void 0 ? void 0 : moneyRequestReport.chatReportID);
    var shouldShowPaid = isSettled && transactionReimbursable;
    // Flags for allowing or disallowing editing an expense
    // Used for non-restricted fields such as: description, category, tag, billable, etc...
    var isReportArchived = (0, useReportIsArchived_1.default)(report === null || report === void 0 ? void 0 : report.reportID);
    var isEditable = !!(0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived) && !readonly;
    var canEdit = (0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) && (0, ReportUtils_1.canEditMoneyRequest)(parentReportAction, transaction, isChatReportArchived) && isEditable;
    var canEditTaxFields = canEdit && !isDistanceRequest;
    var canEditAmount = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.AMOUNT, undefined, isChatReportArchived);
    var canEditMerchant = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.MERCHANT, undefined, isChatReportArchived);
    var canEditDate = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.DATE, undefined, isChatReportArchived);
    var canEditDistance = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.DISTANCE, undefined, isChatReportArchived);
    var canEditDistanceRate = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.DISTANCE_RATE, undefined, isChatReportArchived);
    var canEditReport = (0, react_1.useMemo)(function () { return isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, isChatReportArchived, outstandingReportsByPolicyID); }, [isEditable, parentReportAction, isChatReportArchived, outstandingReportsByPolicyID]);
    // A flag for verifying that the current report is a sub-report of a expense chat
    // if the policy of the report is either Collect or Control, then this report must be tied to expense chat
    var isPolicyExpenseChat = (0, ReportUtils_1.isReportInGroupPolicy)(report);
    var policyTagLists = (0, react_1.useMemo)(function () { return (0, PolicyUtils_1.getTagLists)(policyTagList); }, [policyTagList]);
    var iouType = (0, react_1.useMemo)(function () {
        if (isTrackExpense) {
            return CONST_1.default.IOU.TYPE.TRACK;
        }
        if (isInvoice) {
            return CONST_1.default.IOU.TYPE.INVOICE;
        }
        return CONST_1.default.IOU.TYPE.SUBMIT;
    }, [isTrackExpense, isInvoice]);
    var category = transactionCategory !== null && transactionCategory !== void 0 ? transactionCategory : '';
    var categoryForDisplay = (0, CategoryUtils_1.isCategoryMissing)(category) ? '' : category;
    // Flags for showing categories and tags
    // transactionCategory can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var shouldShowCategory = isPolicyExpenseChat && (categoryForDisplay || (0, OptionsListUtils_1.hasEnabledOptions)(policyCategories !== null && policyCategories !== void 0 ? policyCategories : {}));
    // transactionTag can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var shouldShowTag = isPolicyExpenseChat && (transactionTag || (0, TagsOptionsListUtils_1.hasEnabledTags)(policyTagLists));
    var shouldShowBillable = isPolicyExpenseChat && (!!transactionBillable || !((_e = (_d = policy === null || policy === void 0 ? void 0 : policy.disabledFields) === null || _d === void 0 ? void 0 : _d.defaultBillable) !== null && _e !== void 0 ? _e : true) || !!(updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.billable));
    var isCurrentTransactionReimbursableDifferentFromPolicyDefault = (policy === null || policy === void 0 ? void 0 : policy.defaultReimbursable) !== undefined && !!((_f = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.reimbursable) !== null && _f !== void 0 ? _f : transactionReimbursable) !== policy.defaultReimbursable;
    var shouldShowReimbursable = isPolicyExpenseChat && (!((_g = policy === null || policy === void 0 ? void 0 : policy.disabledFields) === null || _g === void 0 ? void 0 : _g.reimbursable) || isCurrentTransactionReimbursableDifferentFromPolicyDefault) && !isCardTransaction && !isInvoice;
    var canEditReimbursable = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.REIMBURSABLE, undefined, isChatReportArchived);
    var shouldShowAttendees = (0, react_1.useMemo)(function () { return (0, TransactionUtils_1.shouldShowAttendees)(iouType, policy); }, [iouType, policy]);
    var shouldShowTax = (0, PolicyUtils_1.isTaxTrackingEnabled)(isPolicyExpenseChat, policy, isDistanceRequest, isPerDiemRequest);
    var tripID = (0, ReportUtils_1.getTripIDFromTransactionParentReportID)(parentReport === null || parentReport === void 0 ? void 0 : parentReport.parentReportID);
    var shouldShowViewTripDetails = (0, TransactionUtils_1.hasReservationList)(transaction) && !!tripID;
    var getViolationsForField = (0, useViolations_1.default)(transactionViolations !== null && transactionViolations !== void 0 ? transactionViolations : [], isTransactionScanning || !(0, ReportUtils_1.isPaidGroupPolicy)(report)).getViolationsForField;
    var hasViolations = (0, react_1.useCallback)(function (field, data, policyHasDependentTags, tagValue) {
        if (policyHasDependentTags === void 0) { policyHasDependentTags = false; }
        return getViolationsForField(field, data, policyHasDependentTags, tagValue).length > 0;
    }, [getViolationsForField]);
    var amountDescription = "".concat(translate('iou.amount'));
    var dateDescription = "".concat(translate('common.date'));
    var _u = DistanceRequestUtils_1.default.getRate({ transaction: transaction, policy: policy }), unit = _u.unit, rate = _u.rate;
    var distance = (0, TransactionUtils_1.getDistanceInMeters)(transactionBackup !== null && transactionBackup !== void 0 ? transactionBackup : transaction, unit);
    var currency = transactionCurrency !== null && transactionCurrency !== void 0 ? transactionCurrency : CONST_1.default.CURRENCY.USD;
    var isCustomUnitOutOfPolicy = transactionViolations.some(function (violation) { return violation.name === CONST_1.default.VIOLATIONS.CUSTOM_UNIT_OUT_OF_POLICY; }) || (isDistanceRequest && !rate);
    var rateToDisplay = isCustomUnitOutOfPolicy ? translate('common.rateOutOfPolicy') : DistanceRequestUtils_1.default.getRateForDisplay(unit, rate, currency, translate, toLocaleDigit, isOffline);
    var distanceToDisplay = DistanceRequestUtils_1.default.getDistanceForDisplay(hasRoute, distance, unit, rate, translate);
    var merchantTitle = isEmptyMerchant ? '' : transactionMerchant;
    var amountTitle = formattedTransactionAmount ? formattedTransactionAmount.toString() : '';
    if (isTransactionScanning) {
        merchantTitle = translate('iou.receiptStatusTitle');
        amountTitle = translate('iou.receiptStatusTitle');
    }
    var updatedTransactionDescription = (0, react_1.useMemo)(function () {
        if (!updatedTransaction) {
            return undefined;
        }
        return (0, TransactionUtils_1.getDescription)(updatedTransaction !== null && updatedTransaction !== void 0 ? updatedTransaction : null);
    }, [updatedTransaction]);
    var isEmptyUpdatedMerchant = (updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.modifiedMerchant) === '' || (updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.modifiedMerchant) === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT;
    var updatedMerchantTitle = isEmptyUpdatedMerchant ? '' : ((_h = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.modifiedMerchant) !== null && _h !== void 0 ? _h : merchantTitle);
    var saveBillable = (0, react_1.useCallback)(function (newBillable) {
        // If the value hasn't changed, don't request to save changes on the server and just close the modal
        if (newBillable === (0, TransactionUtils_1.getBillable)(transaction) || !(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
            return;
        }
        (0, IOU_1.updateMoneyRequestBillable)(transaction.transactionID, report === null || report === void 0 ? void 0 : report.reportID, newBillable, policy, policyTagList, policyCategories);
    }, [transaction, report, policy, policyTagList, policyCategories]);
    var saveReimbursable = (0, react_1.useCallback)(function (newReimbursable) {
        // If the value hasn't changed, don't request to save changes on the server and just close the modal
        if (newReimbursable === (0, TransactionUtils_1.getReimbursable)(transaction) || !(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
            return;
        }
        (0, IOU_1.updateMoneyRequestReimbursable)(transaction.transactionID, report === null || report === void 0 ? void 0 : report.reportID, newReimbursable, policy, policyTagList, policyCategories);
    }, [transaction, report, policy, policyTagList, policyCategories]);
    if (isCardTransaction) {
        if (transactionPostedDate) {
            dateDescription += " ".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(translate('iou.posted'), " ").concat(transactionPostedDate);
        }
        if (formattedOriginalAmount) {
            amountDescription += " ".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(translate('iou.original'), " ").concat(formattedOriginalAmount);
        }
        if ((0, TransactionUtils_1.isExpenseSplit)(transaction, originalTransaction)) {
            amountDescription += " ".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(translate('iou.split'));
        }
        if (isCancelled) {
            amountDescription += " ".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(translate('iou.canceled'));
        }
    }
    else {
        if (!isDistanceRequest && !isPerDiemRequest) {
            amountDescription += " ".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(translate('iou.cash'));
        }
        if ((0, TransactionUtils_1.isExpenseSplit)(transaction, originalTransaction)) {
            amountDescription += " ".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(translate('iou.split'));
        }
        if (isCancelled) {
            amountDescription += " ".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(translate('iou.canceled'));
        }
        else if (isApproved) {
            amountDescription += " ".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(translate('iou.approved'));
        }
        else if (shouldShowPaid) {
            amountDescription += " ".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(translate('iou.settledExpensify'));
        }
    }
    var hasErrors = (0, TransactionUtils_1.hasMissingSmartscanFields)(transaction);
    var pendingAction = transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction;
    // Need to return undefined when we have pendingAction to avoid the duplicate pending action
    var getPendingFieldAction = function (fieldPath) { var _a; return (pendingAction ? undefined : (_a = transaction === null || transaction === void 0 ? void 0 : transaction.pendingFields) === null || _a === void 0 ? void 0 : _a[fieldPath]); };
    var getErrorForField = (0, react_1.useCallback)(function (field, data, policyHasDependentTags, tagValue) {
        var _a;
        if (policyHasDependentTags === void 0) { policyHasDependentTags = false; }
        // Checks applied when creating a new expense
        // NOTE: receipt field can return multiple violations, so we need to handle it separately
        var fieldChecks = {
            amount: {
                isError: transactionAmount === 0,
                translationPath: canEditAmount ? 'common.error.enterAmount' : 'common.error.missingAmount',
            },
            merchant: {
                isError: !isSettled && !isCancelled && isPolicyExpenseChat && isEmptyMerchant,
                translationPath: canEditMerchant ? 'common.error.enterMerchant' : 'common.error.missingMerchantName',
            },
            date: {
                isError: transactionDate === '',
                translationPath: canEditDate ? 'common.error.enterDate' : 'common.error.missingDate',
            },
        };
        var _b = (_a = fieldChecks[field]) !== null && _a !== void 0 ? _a : {}, isError = _b.isError, translationPath = _b.translationPath;
        if (readonly) {
            return '';
        }
        // Return form errors if there are any
        if (hasErrors && isError && translationPath) {
            return translate(translationPath);
        }
        if (isCustomUnitOutOfPolicy && field === 'customUnitRateID') {
            return translate('violations.customUnitOutOfPolicy');
        }
        // Return violations if there are any
        if (field !== 'merchant' && hasViolations(field, data, policyHasDependentTags, tagValue)) {
            var violations = getViolationsForField(field, data, policyHasDependentTags, tagValue);
            var firstViolation = violations.at(0);
            if (firstViolation) {
                return ViolationsUtils_1.default.getViolationTranslation(firstViolation, translate, canEdit);
            }
        }
        return '';
    }, [
        transactionAmount,
        isSettled,
        isCancelled,
        isPolicyExpenseChat,
        isEmptyMerchant,
        transactionDate,
        readonly,
        hasErrors,
        hasViolations,
        translate,
        getViolationsForField,
        canEditAmount,
        canEditDate,
        canEditMerchant,
        canEdit,
        isCustomUnitOutOfPolicy,
    ]);
    var distanceRequestFields = (<>
            <OfflineWithFeedback_1.default pendingAction={(_j = getPendingFieldAction('waypoints')) !== null && _j !== void 0 ? _j : getPendingFieldAction('merchant')}>
                <MenuItemWithTopDescription_1.default description={translate('common.distance')} title={distanceToDisplay} interactive={canEditDistance} shouldShowRightIcon={canEditDistance} titleStyle={styles.flex1} onPress={function () {
            if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DISTANCE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
        }} copyValue={!canEditDistance ? distanceToDisplay : undefined}/>
            </OfflineWithFeedback_1.default>
            <OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('customUnitRateID')}>
                <MenuItemWithTopDescription_1.default description={translate('common.rate')} title={rateToDisplay} interactive={canEditDistanceRate} shouldShowRightIcon={canEditDistanceRate} titleStyle={styles.flex1} onPress={function () {
            if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DISTANCE_RATE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
        }} brickRoadIndicator={getErrorForField('customUnitRateID') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('customUnitRateID')} copyValue={!canEditDistanceRate ? rateToDisplay : undefined}/>
            </OfflineWithFeedback_1.default>
        </>);
    // Whether to show receipt audit result (e.g.`Verified`, `Issue Found`) and messages (e.g. `Receipt not verified. Please confirm accuracy.`)
    // `!!(receiptViolations.length || didReceiptScanSucceed)` is for not showing `Verified` when `receiptViolations` is empty and `didReceiptScanSucceed` is false.
    var hasDependentTags = (0, PolicyUtils_1.hasDependentTags)(policy, policyTagList);
    var previousTransactionTag = (0, usePrevious_1.default)(transactionTag);
    var _v = (0, react_1.useState)(undefined), previousTag = _v[0], setPreviousTag = _v[1];
    var _w = (0, react_1.useState)(undefined), currentTransactionTag = _w[0], setCurrentTransactionTag = _w[1];
    (0, react_1.useEffect)(function () {
        if (transactionTag === previousTransactionTag) {
            return;
        }
        setPreviousTag(previousTransactionTag);
        setCurrentTransactionTag(transactionTag);
    }, [transactionTag, previousTransactionTag]);
    var previousTagLength = (0, PolicyUtils_1.getLengthOfTag)(previousTag !== null && previousTag !== void 0 ? previousTag : '');
    var currentTagLength = (0, PolicyUtils_1.getLengthOfTag)(currentTransactionTag !== null && currentTransactionTag !== void 0 ? currentTransactionTag : '');
    var tagList = policyTagLists.map(function (_a, index) {
        var name = _a.name, orderWeight = _a.orderWeight, tags = _a.tags;
        var tagForDisplay = (0, TransactionUtils_1.getTagForDisplay)(updatedTransaction !== null && updatedTransaction !== void 0 ? updatedTransaction : transaction, index);
        var shouldShow = false;
        if (hasDependentTags) {
            if (index === 0) {
                shouldShow = true;
            }
            else {
                var prevTagValue = (0, TransactionUtils_1.getTagForDisplay)(transaction, index - 1);
                shouldShow = !!prevTagValue;
            }
        }
        else {
            shouldShow = !!tagForDisplay || (0, OptionsListUtils_1.hasEnabledOptions)(tags);
        }
        if (!shouldShow) {
            return null;
        }
        var tagError = getErrorForField('tag', {
            tagListIndex: index,
            tagListName: name,
        }, hasDependentTags, tagForDisplay);
        return (<OfflineWithFeedback_1.default key={name} pendingAction={getPendingFieldAction('tag')}>
                <MenuItemWithTopDescription_1.default highlighted={hasDependentTags && shouldShow && !(0, TransactionUtils_1.getTagForDisplay)(transaction, index) && currentTagLength > previousTagLength} description={name !== null && name !== void 0 ? name : translate('common.tag')} title={tagForDisplay} numberOfLinesTitle={2} interactive={canEdit} shouldShowRightIcon={canEdit} titleStyle={styles.flex1} onPress={function () {
                if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAG.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, orderWeight, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} brickRoadIndicator={tagError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={tagError} shouldShowBasicTitle shouldShowDescriptionOnTop/>
            </OfflineWithFeedback_1.default>);
    });
    var actualParentReport = isFromMergeTransaction ? (0, ReportUtils_1.getReportOrDraftReport)((0, MergeTransactionUtils_1.getReportIDForExpense)(updatedTransaction)) : parentReport;
    var shouldShowReport = !!parentReportID || !!actualParentReport;
    return (<react_native_1.View style={styles.pRelative}>
            {shouldShowAnimatedBackground && <AnimatedEmptyStateBackground_1.default />}
            <>
                <MoneyRequestReceiptView_1.default allReports={allReports} report={report} readonly={readonly} updatedTransaction={updatedTransaction} isFromReviewDuplicates={isFromReviewDuplicates} mergeTransactionID={mergeTransactionID}/>
                {isCustomUnitOutOfPolicy && isPerDiemRequest && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap1, styles.mh4, styles.mb2]}>
                        <Icon_1.default src={Expensicons.DotIndicator} fill={theme.danger} height={16} width={16}/>
                        <Text_1.default numberOfLines={1} style={[StyleUtils.getDotIndicatorTextStyles(true), styles.pre, styles.flexShrink1]}>
                            {translate('violations.customUnitOutOfPolicy')}
                        </Text_1.default>
                    </react_native_1.View>)}
                <OfflineWithFeedback_1.default pendingAction={(_k = getPendingFieldAction('amount')) !== null && _k !== void 0 ? _k : (amountTitle ? getPendingFieldAction('customUnitRateID') : undefined)}>
                    <MenuItemWithTopDescription_1.default title={amountTitle} shouldShowTitleIcon={shouldShowPaid} titleIcon={Expensicons.Checkmark} description={amountDescription} titleStyle={styles.textHeadlineH2} interactive={canEditAmount} shouldShowRightIcon={canEditAmount} onPress={function () {
            if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_AMOUNT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, '', '', getReportRHPActiveRoute()));
        }} brickRoadIndicator={getErrorForField('amount') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('amount')}/>
                </OfflineWithFeedback_1.default>
                <OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('comment')}>
                    <MenuItemWithTopDescription_1.default description={translate('common.description')} shouldRenderAsHTML title={updatedTransactionDescription !== null && updatedTransactionDescription !== void 0 ? updatedTransactionDescription : transactionDescription} interactive={canEdit} shouldShowRightIcon={canEdit} titleStyle={styles.flex1} onPress={function () {
            if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DESCRIPTION.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
        }} wrapperStyle={[styles.pv2, styles.taskDescriptionMenuItem]} brickRoadIndicator={getErrorForField('comment') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('comment')} numberOfLinesTitle={0}/>
                </OfflineWithFeedback_1.default>
                {isManualDistanceRequest || (isMapDistanceRequest && ((_l = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _l === void 0 ? void 0 : _l.waypoints)) ? (distanceRequestFields) : (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('merchant')}>
                        <MenuItemWithTopDescription_1.default description={translate('common.merchant')} title={updatedMerchantTitle} interactive={canEditMerchant} shouldShowRightIcon={canEditMerchant} titleStyle={styles.flex1} onPress={function () {
                if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_MERCHANT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} wrapperStyle={[styles.taskDescriptionMenuItem]} brickRoadIndicator={getErrorForField('merchant') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('merchant')} numberOfLinesTitle={0} copyValue={!canEditMerchant ? updatedMerchantTitle : undefined}/>
                    </OfflineWithFeedback_1.default>)}
                <OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('created')}>
                    <MenuItemWithTopDescription_1.default description={dateDescription} title={actualTransactionDate} interactive={canEditDate} shouldShowRightIcon={canEditDate} titleStyle={styles.flex1} onPress={function () {
            if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DATE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
        }} brickRoadIndicator={getErrorForField('date') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('date')} copyValue={!canEditDate ? transactionDate : undefined}/>
                </OfflineWithFeedback_1.default>
                {!!shouldShowCategory && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('category')}>
                        <MenuItemWithTopDescription_1.default description={translate('common.category')} title={(_m = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.category) !== null && _m !== void 0 ? _m : categoryForDisplay} numberOfLinesTitle={2} interactive={canEdit} shouldShowRightIcon={canEdit} titleStyle={styles.flex1} onPress={function () {
                if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CATEGORY.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} brickRoadIndicator={getErrorForField('category') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('category')}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowTag && tagList}
                {!!shouldShowCard && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('cardID')}>
                        <MenuItemWithTopDescription_1.default description={translate('iou.card')} title={cardProgramName} titleStyle={styles.flex1} interactive={false}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowTax && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('taxCode')}>
                        <MenuItemWithTopDescription_1.default title={taxRateTitle !== null && taxRateTitle !== void 0 ? taxRateTitle : fallbackTaxRateTitle} description={taxRatesDescription} interactive={canEditTaxFields} shouldShowRightIcon={canEditTaxFields} titleStyle={styles.flex1} onPress={function () {
                if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAX_RATE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} brickRoadIndicator={getErrorForField('tax') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('tax')}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowTax && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('taxAmount')}>
                        <MenuItemWithTopDescription_1.default title={formattedTaxAmount ? formattedTaxAmount.toString() : ''} description={translate('iou.taxAmount')} interactive={canEditTaxFields} shouldShowRightIcon={canEditTaxFields} titleStyle={styles.flex1} onPress={function () {
                if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAX_AMOUNT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowAttendees && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('attendees')}>
                        <MenuItemWithTopDescription_1.default key="attendees" title={Array.isArray(transactionAttendees) ? transactionAttendees.map(function (item) { var _a; return (_a = item === null || item === void 0 ? void 0 : item.displayName) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.login; }).join(', ') : ''} description={"".concat(translate('iou.attendees'), " ").concat(Array.isArray(transactionAttendees) && transactionAttendees.length > 1 && formattedPerAttendeeAmount
                ? "".concat(CONST_1.default.DOT_SEPARATOR, " ").concat(formattedPerAttendeeAmount, " ").concat(translate('common.perPerson'))
                : '')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={function () {
                if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_ATTENDEE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID));
            }} interactive={canEdit} shouldShowRightIcon={canEdit} shouldRenderAsHTML/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowReimbursable && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('reimbursable')} contentContainerStyle={[styles.flexRow, styles.optionRow, styles.justifyContentBetween, styles.alignItemsCenter, styles.ml5, styles.mr8]}>
                        <react_native_1.View>
                            <Text_1.default>{expensify_common_1.Str.UCFirst(translate('iou.reimbursable'))}</Text_1.default>
                        </react_native_1.View>
                        <Switch_1.default accessibilityLabel={expensify_common_1.Str.UCFirst(translate('iou.reimbursable'))} isOn={(_o = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.reimbursable) !== null && _o !== void 0 ? _o : !!transactionReimbursable} onToggle={saveReimbursable} disabled={!canEditReimbursable}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowBillable && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('billable')} contentContainerStyle={[styles.flexRow, styles.optionRow, styles.justifyContentBetween, styles.alignItemsCenter, styles.ml5, styles.mr8]}>
                        <react_native_1.View>
                            <Text_1.default>{translate('common.billable')}</Text_1.default>
                            {!!getErrorForField('billable') && (<ViolationMessages_1.default violations={getViolationsForField('billable')} containerStyle={[styles.mt1]} textStyle={[styles.ph0]} isLast canEdit={canEdit}/>)}
                        </react_native_1.View>
                        <Switch_1.default accessibilityLabel={translate('common.billable')} isOn={(_p = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.billable) !== null && _p !== void 0 ? _p : !!transactionBillable} onToggle={saveBillable} disabled={!canEdit}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowReport && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('reportID')}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon={canEditReport} title={(0, ReportUtils_1.getReportName)(actualParentReport) || (actualParentReport === null || actualParentReport === void 0 ? void 0 : actualParentReport.reportName)} description={translate('common.report')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={function () {
                if (!canEditReport || !(report === null || report === void 0 ? void 0 : report.reportID) || !(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID)) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_REPORT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction === null || transaction === void 0 ? void 0 : transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} interactive={canEditReport} shouldRenderAsHTML/>
                    </OfflineWithFeedback_1.default>)}
                {/* Note: "View trip details" should be always the last item */}
                {shouldShowViewTripDetails && (<MenuItem_1.default title={translate('travel.viewTripDetails')} icon={Expensicons.Suitcase} onPress={function () {
                var _a, _b, _c;
                if (!(transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) || !(report === null || report === void 0 ? void 0 : report.reportID)) {
                    return;
                }
                var reservations = (_c = (_b = (_a = transaction === null || transaction === void 0 ? void 0 : transaction.receipt) === null || _a === void 0 ? void 0 : _a.reservationList) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                if (reservations > 1) {
                    Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_TRIP_SUMMARY.getRoute(report.reportID, transaction.transactionID, getReportRHPActiveRoute()));
                }
                Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_TRIP_DETAILS.getRoute(report.reportID, transaction.transactionID, '0', 0, getReportRHPActiveRoute()));
            }}/>)}
            </>
        </react_native_1.View>);
}
MoneyRequestView.displayName = 'MoneyRequestView';
exports.default = MoneyRequestView;
