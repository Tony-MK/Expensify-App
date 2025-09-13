"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const ViolationMessages_1 = require("@components/ViolationMessages");
const useActiveRoute_1 = require("@hooks/useActiveRoute");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const useViolations_1 = require("@hooks/useViolations");
const CardUtils_1 = require("@libs/CardUtils");
const CategoryUtils_1 = require("@libs/CategoryUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
const Navigation_1 = require("@navigation/Navigation");
const AnimatedEmptyStateBackground_1 = require("@pages/home/report/AnimatedEmptyStateBackground");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const MoneyRequestReceiptView_1 = require("./MoneyRequestReceiptView");
function MoneyRequestView({ allReports, report, policy, shouldShowAnimatedBackground, readonly = false, updatedTransaction, isFromReviewDuplicates = false, mergeTransactionID, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate, toLocaleDigit } = (0, useLocalize_1.default)();
    const { getReportRHPActiveRoute } = (0, useActiveRoute_1.default)();
    const parentReportID = report?.parentReportID;
    const policyID = report?.policyID;
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`];
    const allPolicyCategories = (0, OnyxListItemProvider_1.usePolicyCategories)();
    const policyCategories = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`];
    const transactionReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${updatedTransaction?.reportID}`];
    const targetPolicyID = updatedTransaction?.reportID ? transactionReport?.policyID : policyID;
    const allPolicyTags = (0, OnyxListItemProvider_1.usePolicyTags)();
    const policyTagList = allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${targetPolicyID}`];
    const [cardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [parentReportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`, {
        canEvict: false,
        canBeMissing: true,
    });
    const parentReportAction = report?.parentReportActionID ? parentReportActions?.[report.parentReportActionID] : undefined;
    const isTrackExpense = (0, ReportUtils_1.isTrackExpenseReport)(report);
    const isFromMergeTransaction = !!mergeTransactionID;
    const moneyRequestReport = parentReport;
    const linkedTransactionID = (0, react_1.useMemo)(() => {
        if (!parentReportAction) {
            return undefined;
        }
        const originalMessage = parentReportAction && (0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(parentReportAction) : undefined;
        return originalMessage?.IOUTransactionID;
    }, [parentReportAction]);
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(linkedTransactionID)}`, { canBeMissing: true });
    const [transactionBackup] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_BACKUP}${(0, getNonEmptyStringOnyxID_1.default)(linkedTransactionID)}`, { canBeMissing: true });
    const transactionViolations = (0, useTransactionViolations_1.default)(transaction?.transactionID);
    const [outstandingReportsByPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID, { canBeMissing: true });
    const originalTransactionIDFromComment = transaction?.comment?.originalTransactionID;
    const [originalTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionIDFromComment ?? ''}`, { canBeMissing: true });
    const { created: transactionDate, amount: transactionAmount, attendees: transactionAttendees, taxAmount: transactionTaxAmount, currency: transactionCurrency, comment: transactionDescription, merchant: transactionMerchant, reimbursable: transactionReimbursable, billable: transactionBillable, category: transactionCategory, tag: transactionTag, originalAmount: transactionOriginalAmount, originalCurrency: transactionOriginalCurrency, postedDate: transactionPostedDate, } = (0, react_1.useMemo)(() => (0, ReportUtils_1.getTransactionDetails)(transaction) ?? {}, [transaction]);
    const isEmptyMerchant = transactionMerchant === '' || transactionMerchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT;
    const isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(transaction);
    const isManualDistanceRequest = (0, TransactionUtils_1.isManualDistanceRequest)(transaction);
    const isMapDistanceRequest = isDistanceRequest && !isManualDistanceRequest;
    const isPerDiemRequest = (0, TransactionUtils_1.isPerDiemRequest)(transaction);
    const isTransactionScanning = (0, TransactionUtils_1.isScanning)(updatedTransaction ?? transaction);
    const hasRoute = (0, TransactionUtils_1.hasRoute)(transactionBackup ?? transaction, isDistanceRequest);
    // Use the updated transaction amount in merge flow to have correct positive/negative sign
    const actualAmount = isFromMergeTransaction && updatedTransaction ? updatedTransaction.amount : transactionAmount;
    const actualCurrency = updatedTransaction ? (0, TransactionUtils_1.getCurrency)(updatedTransaction) : transactionCurrency;
    const shouldDisplayTransactionAmount = ((isDistanceRequest && hasRoute) || !!actualAmount) && actualAmount !== undefined;
    const formattedTransactionAmount = shouldDisplayTransactionAmount ? (0, CurrencyUtils_1.convertToDisplayString)(actualAmount, actualCurrency) : '';
    const formattedPerAttendeeAmount = shouldDisplayTransactionAmount ? (0, CurrencyUtils_1.convertToDisplayString)(actualAmount / (transactionAttendees?.length ?? 1), actualCurrency) : '';
    const formattedOriginalAmount = transactionOriginalAmount && transactionOriginalCurrency && (0, CurrencyUtils_1.convertToDisplayString)(transactionOriginalAmount, transactionOriginalCurrency);
    const isCardTransaction = (0, TransactionUtils_1.isCardTransaction)(transaction);
    const cardProgramName = (0, CardUtils_1.getCompanyCardDescription)(transaction?.cardName, transaction?.cardID, cardList);
    const shouldShowCard = isCardTransaction && cardProgramName;
    const isApproved = (0, ReportUtils_1.isReportApproved)({ report: moneyRequestReport });
    const isInvoice = (0, ReportUtils_1.isInvoiceReport)(moneyRequestReport);
    const taxRates = policy?.taxRates;
    const formattedTaxAmount = updatedTransaction?.taxAmount
        ? (0, CurrencyUtils_1.convertToDisplayString)(Math.abs(updatedTransaction?.taxAmount), transactionCurrency)
        : (0, CurrencyUtils_1.convertToDisplayString)(Math.abs(transactionTaxAmount ?? 0), transactionCurrency);
    const taxRatesDescription = taxRates?.name;
    const taxRateTitle = updatedTransaction ? (0, TransactionUtils_1.getTaxName)(policy, updatedTransaction) : (0, TransactionUtils_1.getTaxName)(policy, transaction);
    const actualTransactionDate = isFromMergeTransaction && updatedTransaction ? (0, TransactionUtils_1.getFormattedCreated)(updatedTransaction) : transactionDate;
    const fallbackTaxRateTitle = transaction?.taxValue;
    const isSettled = (0, ReportUtils_1.isSettled)(moneyRequestReport?.reportID);
    const isCancelled = moneyRequestReport && moneyRequestReport?.isCancelledIOU;
    const isChatReportArchived = (0, useReportIsArchived_1.default)(moneyRequestReport?.chatReportID);
    const shouldShowPaid = isSettled && transactionReimbursable;
    // Flags for allowing or disallowing editing an expense
    // Used for non-restricted fields such as: description, category, tag, billable, etc...
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isEditable = !!(0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived) && !readonly;
    const canEdit = (0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) && (0, ReportUtils_1.canEditMoneyRequest)(parentReportAction, transaction, isChatReportArchived) && isEditable;
    const canEditTaxFields = canEdit && !isDistanceRequest;
    const canEditAmount = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.AMOUNT, undefined, isChatReportArchived);
    const canEditMerchant = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.MERCHANT, undefined, isChatReportArchived);
    const canEditDate = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.DATE, undefined, isChatReportArchived);
    const canEditDistance = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.DISTANCE, undefined, isChatReportArchived);
    const canEditDistanceRate = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.DISTANCE_RATE, undefined, isChatReportArchived);
    const canEditReport = (0, react_1.useMemo)(() => isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, isChatReportArchived, outstandingReportsByPolicyID), [isEditable, parentReportAction, isChatReportArchived, outstandingReportsByPolicyID]);
    // A flag for verifying that the current report is a sub-report of a expense chat
    // if the policy of the report is either Collect or Control, then this report must be tied to expense chat
    const isPolicyExpenseChat = (0, ReportUtils_1.isReportInGroupPolicy)(report);
    const policyTagLists = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagLists)(policyTagList), [policyTagList]);
    const iouType = (0, react_1.useMemo)(() => {
        if (isTrackExpense) {
            return CONST_1.default.IOU.TYPE.TRACK;
        }
        if (isInvoice) {
            return CONST_1.default.IOU.TYPE.INVOICE;
        }
        return CONST_1.default.IOU.TYPE.SUBMIT;
    }, [isTrackExpense, isInvoice]);
    const category = transactionCategory ?? '';
    const categoryForDisplay = (0, CategoryUtils_1.isCategoryMissing)(category) ? '' : category;
    // Flags for showing categories and tags
    // transactionCategory can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const shouldShowCategory = isPolicyExpenseChat && (categoryForDisplay || (0, OptionsListUtils_1.hasEnabledOptions)(policyCategories ?? {}));
    // transactionTag can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const shouldShowTag = isPolicyExpenseChat && (transactionTag || (0, TagsOptionsListUtils_1.hasEnabledTags)(policyTagLists));
    const shouldShowBillable = isPolicyExpenseChat && (!!transactionBillable || !(policy?.disabledFields?.defaultBillable ?? true) || !!updatedTransaction?.billable);
    const isCurrentTransactionReimbursableDifferentFromPolicyDefault = policy?.defaultReimbursable !== undefined && !!(updatedTransaction?.reimbursable ?? transactionReimbursable) !== policy.defaultReimbursable;
    const shouldShowReimbursable = isPolicyExpenseChat && (!policy?.disabledFields?.reimbursable || isCurrentTransactionReimbursableDifferentFromPolicyDefault) && !isCardTransaction && !isInvoice;
    const canEditReimbursable = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.REIMBURSABLE, undefined, isChatReportArchived);
    const shouldShowAttendees = (0, react_1.useMemo)(() => (0, TransactionUtils_1.shouldShowAttendees)(iouType, policy), [iouType, policy]);
    const shouldShowTax = (0, PolicyUtils_1.isTaxTrackingEnabled)(isPolicyExpenseChat, policy, isDistanceRequest, isPerDiemRequest);
    const tripID = (0, ReportUtils_1.getTripIDFromTransactionParentReportID)(parentReport?.parentReportID);
    const shouldShowViewTripDetails = (0, TransactionUtils_1.hasReservationList)(transaction) && !!tripID;
    const { getViolationsForField } = (0, useViolations_1.default)(transactionViolations ?? [], isTransactionScanning || !(0, ReportUtils_1.isPaidGroupPolicy)(report));
    const hasViolations = (0, react_1.useCallback)((field, data, policyHasDependentTags = false, tagValue) => getViolationsForField(field, data, policyHasDependentTags, tagValue).length > 0, [getViolationsForField]);
    let amountDescription = `${translate('iou.amount')}`;
    let dateDescription = `${translate('common.date')}`;
    const { unit, rate } = DistanceRequestUtils_1.default.getRate({ transaction, policy });
    const distance = (0, TransactionUtils_1.getDistanceInMeters)(transactionBackup ?? transaction, unit);
    const currency = transactionCurrency ?? CONST_1.default.CURRENCY.USD;
    const isCustomUnitOutOfPolicy = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.CUSTOM_UNIT_OUT_OF_POLICY) || (isDistanceRequest && !rate);
    const rateToDisplay = isCustomUnitOutOfPolicy ? translate('common.rateOutOfPolicy') : DistanceRequestUtils_1.default.getRateForDisplay(unit, rate, currency, translate, toLocaleDigit, isOffline);
    const distanceToDisplay = DistanceRequestUtils_1.default.getDistanceForDisplay(hasRoute, distance, unit, rate, translate);
    let merchantTitle = isEmptyMerchant ? '' : transactionMerchant;
    let amountTitle = formattedTransactionAmount ? formattedTransactionAmount.toString() : '';
    if (isTransactionScanning) {
        merchantTitle = translate('iou.receiptStatusTitle');
        amountTitle = translate('iou.receiptStatusTitle');
    }
    const updatedTransactionDescription = (0, react_1.useMemo)(() => {
        if (!updatedTransaction) {
            return undefined;
        }
        return (0, TransactionUtils_1.getDescription)(updatedTransaction ?? null);
    }, [updatedTransaction]);
    const isEmptyUpdatedMerchant = updatedTransaction?.modifiedMerchant === '' || updatedTransaction?.modifiedMerchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT;
    const updatedMerchantTitle = isEmptyUpdatedMerchant ? '' : (updatedTransaction?.modifiedMerchant ?? merchantTitle);
    const saveBillable = (0, react_1.useCallback)((newBillable) => {
        // If the value hasn't changed, don't request to save changes on the server and just close the modal
        if (newBillable === (0, TransactionUtils_1.getBillable)(transaction) || !transaction?.transactionID || !report?.reportID) {
            return;
        }
        (0, IOU_1.updateMoneyRequestBillable)(transaction.transactionID, report?.reportID, newBillable, policy, policyTagList, policyCategories);
    }, [transaction, report, policy, policyTagList, policyCategories]);
    const saveReimbursable = (0, react_1.useCallback)((newReimbursable) => {
        // If the value hasn't changed, don't request to save changes on the server and just close the modal
        if (newReimbursable === (0, TransactionUtils_1.getReimbursable)(transaction) || !transaction?.transactionID || !report?.reportID) {
            return;
        }
        (0, IOU_1.updateMoneyRequestReimbursable)(transaction.transactionID, report?.reportID, newReimbursable, policy, policyTagList, policyCategories);
    }, [transaction, report, policy, policyTagList, policyCategories]);
    if (isCardTransaction) {
        if (transactionPostedDate) {
            dateDescription += ` ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.posted')} ${transactionPostedDate}`;
        }
        if (formattedOriginalAmount) {
            amountDescription += ` ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.original')} ${formattedOriginalAmount}`;
        }
        if ((0, TransactionUtils_1.isExpenseSplit)(transaction, originalTransaction)) {
            amountDescription += ` ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.split')}`;
        }
        if (isCancelled) {
            amountDescription += ` ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.canceled')}`;
        }
    }
    else {
        if (!isDistanceRequest && !isPerDiemRequest) {
            amountDescription += ` ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.cash')}`;
        }
        if ((0, TransactionUtils_1.isExpenseSplit)(transaction, originalTransaction)) {
            amountDescription += ` ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.split')}`;
        }
        if (isCancelled) {
            amountDescription += ` ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.canceled')}`;
        }
        else if (isApproved) {
            amountDescription += ` ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.approved')}`;
        }
        else if (shouldShowPaid) {
            amountDescription += ` ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.settledExpensify')}`;
        }
    }
    const hasErrors = (0, TransactionUtils_1.hasMissingSmartscanFields)(transaction);
    const pendingAction = transaction?.pendingAction;
    // Need to return undefined when we have pendingAction to avoid the duplicate pending action
    const getPendingFieldAction = (fieldPath) => (pendingAction ? undefined : transaction?.pendingFields?.[fieldPath]);
    const getErrorForField = (0, react_1.useCallback)((field, data, policyHasDependentTags = false, tagValue) => {
        // Checks applied when creating a new expense
        // NOTE: receipt field can return multiple violations, so we need to handle it separately
        const fieldChecks = {
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
        const { isError, translationPath } = fieldChecks[field] ?? {};
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
            const violations = getViolationsForField(field, data, policyHasDependentTags, tagValue);
            const firstViolation = violations.at(0);
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
    const distanceRequestFields = (<>
            <OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('waypoints') ?? getPendingFieldAction('merchant')}>
                <MenuItemWithTopDescription_1.default description={translate('common.distance')} title={distanceToDisplay} interactive={canEditDistance} shouldShowRightIcon={canEditDistance} titleStyle={styles.flex1} onPress={() => {
            if (!transaction?.transactionID || !report?.reportID) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DISTANCE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
        }} copyValue={!canEditDistance ? distanceToDisplay : undefined}/>
            </OfflineWithFeedback_1.default>
            <OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('customUnitRateID')}>
                <MenuItemWithTopDescription_1.default description={translate('common.rate')} title={rateToDisplay} interactive={canEditDistanceRate} shouldShowRightIcon={canEditDistanceRate} titleStyle={styles.flex1} onPress={() => {
            if (!transaction?.transactionID || !report?.reportID) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DISTANCE_RATE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
        }} brickRoadIndicator={getErrorForField('customUnitRateID') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('customUnitRateID')} copyValue={!canEditDistanceRate ? rateToDisplay : undefined}/>
            </OfflineWithFeedback_1.default>
        </>);
    // Whether to show receipt audit result (e.g.`Verified`, `Issue Found`) and messages (e.g. `Receipt not verified. Please confirm accuracy.`)
    // `!!(receiptViolations.length || didReceiptScanSucceed)` is for not showing `Verified` when `receiptViolations` is empty and `didReceiptScanSucceed` is false.
    const hasDependentTags = (0, PolicyUtils_1.hasDependentTags)(policy, policyTagList);
    const previousTransactionTag = (0, usePrevious_1.default)(transactionTag);
    const [previousTag, setPreviousTag] = (0, react_1.useState)(undefined);
    const [currentTransactionTag, setCurrentTransactionTag] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        if (transactionTag === previousTransactionTag) {
            return;
        }
        setPreviousTag(previousTransactionTag);
        setCurrentTransactionTag(transactionTag);
    }, [transactionTag, previousTransactionTag]);
    const previousTagLength = (0, PolicyUtils_1.getLengthOfTag)(previousTag ?? '');
    const currentTagLength = (0, PolicyUtils_1.getLengthOfTag)(currentTransactionTag ?? '');
    const tagList = policyTagLists.map(({ name, orderWeight, tags }, index) => {
        const tagForDisplay = (0, TransactionUtils_1.getTagForDisplay)(updatedTransaction ?? transaction, index);
        let shouldShow = false;
        if (hasDependentTags) {
            if (index === 0) {
                shouldShow = true;
            }
            else {
                const prevTagValue = (0, TransactionUtils_1.getTagForDisplay)(transaction, index - 1);
                shouldShow = !!prevTagValue;
            }
        }
        else {
            shouldShow = !!tagForDisplay || (0, OptionsListUtils_1.hasEnabledOptions)(tags);
        }
        if (!shouldShow) {
            return null;
        }
        const tagError = getErrorForField('tag', {
            tagListIndex: index,
            tagListName: name,
        }, hasDependentTags, tagForDisplay);
        return (<OfflineWithFeedback_1.default key={name} pendingAction={getPendingFieldAction('tag')}>
                <MenuItemWithTopDescription_1.default highlighted={hasDependentTags && shouldShow && !(0, TransactionUtils_1.getTagForDisplay)(transaction, index) && currentTagLength > previousTagLength} description={name ?? translate('common.tag')} title={tagForDisplay} numberOfLinesTitle={2} interactive={canEdit} shouldShowRightIcon={canEdit} titleStyle={styles.flex1} onPress={() => {
                if (!transaction?.transactionID || !report?.reportID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAG.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, orderWeight, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} brickRoadIndicator={tagError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={tagError} shouldShowBasicTitle shouldShowDescriptionOnTop/>
            </OfflineWithFeedback_1.default>);
    });
    const actualParentReport = isFromMergeTransaction ? (0, ReportUtils_1.getReportOrDraftReport)((0, MergeTransactionUtils_1.getReportIDForExpense)(updatedTransaction)) : parentReport;
    const shouldShowReport = !!parentReportID || !!actualParentReport;
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
                <OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('amount') ?? (amountTitle ? getPendingFieldAction('customUnitRateID') : undefined)}>
                    <MenuItemWithTopDescription_1.default title={amountTitle} shouldShowTitleIcon={shouldShowPaid} titleIcon={Expensicons.Checkmark} description={amountDescription} titleStyle={styles.textHeadlineH2} interactive={canEditAmount} shouldShowRightIcon={canEditAmount} onPress={() => {
            if (!transaction?.transactionID || !report?.reportID) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_AMOUNT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, '', '', getReportRHPActiveRoute()));
        }} brickRoadIndicator={getErrorForField('amount') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('amount')}/>
                </OfflineWithFeedback_1.default>
                <OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('comment')}>
                    <MenuItemWithTopDescription_1.default description={translate('common.description')} shouldRenderAsHTML title={updatedTransactionDescription ?? transactionDescription} interactive={canEdit} shouldShowRightIcon={canEdit} titleStyle={styles.flex1} onPress={() => {
            if (!transaction?.transactionID || !report?.reportID) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DESCRIPTION.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
        }} wrapperStyle={[styles.pv2, styles.taskDescriptionMenuItem]} brickRoadIndicator={getErrorForField('comment') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('comment')} numberOfLinesTitle={0}/>
                </OfflineWithFeedback_1.default>
                {isManualDistanceRequest || (isMapDistanceRequest && transaction?.comment?.waypoints) ? (distanceRequestFields) : (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('merchant')}>
                        <MenuItemWithTopDescription_1.default description={translate('common.merchant')} title={updatedMerchantTitle} interactive={canEditMerchant} shouldShowRightIcon={canEditMerchant} titleStyle={styles.flex1} onPress={() => {
                if (!transaction?.transactionID || !report?.reportID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_MERCHANT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} wrapperStyle={[styles.taskDescriptionMenuItem]} brickRoadIndicator={getErrorForField('merchant') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('merchant')} numberOfLinesTitle={0} copyValue={!canEditMerchant ? updatedMerchantTitle : undefined}/>
                    </OfflineWithFeedback_1.default>)}
                <OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('created')}>
                    <MenuItemWithTopDescription_1.default description={dateDescription} title={actualTransactionDate} interactive={canEditDate} shouldShowRightIcon={canEditDate} titleStyle={styles.flex1} onPress={() => {
            if (!transaction?.transactionID || !report?.reportID) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DATE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
        }} brickRoadIndicator={getErrorForField('date') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('date')} copyValue={!canEditDate ? transactionDate : undefined}/>
                </OfflineWithFeedback_1.default>
                {!!shouldShowCategory && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('category')}>
                        <MenuItemWithTopDescription_1.default description={translate('common.category')} title={updatedTransaction?.category ?? categoryForDisplay} numberOfLinesTitle={2} interactive={canEdit} shouldShowRightIcon={canEdit} titleStyle={styles.flex1} onPress={() => {
                if (!transaction?.transactionID || !report?.reportID) {
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
                        <MenuItemWithTopDescription_1.default title={taxRateTitle ?? fallbackTaxRateTitle} description={taxRatesDescription} interactive={canEditTaxFields} shouldShowRightIcon={canEditTaxFields} titleStyle={styles.flex1} onPress={() => {
                if (!transaction?.transactionID || !report?.reportID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAX_RATE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} brickRoadIndicator={getErrorForField('tax') ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={getErrorForField('tax')}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowTax && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('taxAmount')}>
                        <MenuItemWithTopDescription_1.default title={formattedTaxAmount ? formattedTaxAmount.toString() : ''} description={translate('iou.taxAmount')} interactive={canEditTaxFields} shouldShowRightIcon={canEditTaxFields} titleStyle={styles.flex1} onPress={() => {
                if (!transaction?.transactionID || !report?.reportID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAX_AMOUNT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowAttendees && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('attendees')}>
                        <MenuItemWithTopDescription_1.default key="attendees" title={Array.isArray(transactionAttendees) ? transactionAttendees.map((item) => item?.displayName ?? item?.login).join(', ') : ''} description={`${translate('iou.attendees')} ${Array.isArray(transactionAttendees) && transactionAttendees.length > 1 && formattedPerAttendeeAmount
                ? `${CONST_1.default.DOT_SEPARATOR} ${formattedPerAttendeeAmount} ${translate('common.perPerson')}`
                : ''}`} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                if (!transaction?.transactionID || !report?.reportID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_ATTENDEE.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID));
            }} interactive={canEdit} shouldShowRightIcon={canEdit} shouldRenderAsHTML/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowReimbursable && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('reimbursable')} contentContainerStyle={[styles.flexRow, styles.optionRow, styles.justifyContentBetween, styles.alignItemsCenter, styles.ml5, styles.mr8]}>
                        <react_native_1.View>
                            <Text_1.default>{expensify_common_1.Str.UCFirst(translate('iou.reimbursable'))}</Text_1.default>
                        </react_native_1.View>
                        <Switch_1.default accessibilityLabel={expensify_common_1.Str.UCFirst(translate('iou.reimbursable'))} isOn={updatedTransaction?.reimbursable ?? !!transactionReimbursable} onToggle={saveReimbursable} disabled={!canEditReimbursable}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowBillable && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('billable')} contentContainerStyle={[styles.flexRow, styles.optionRow, styles.justifyContentBetween, styles.alignItemsCenter, styles.ml5, styles.mr8]}>
                        <react_native_1.View>
                            <Text_1.default>{translate('common.billable')}</Text_1.default>
                            {!!getErrorForField('billable') && (<ViolationMessages_1.default violations={getViolationsForField('billable')} containerStyle={[styles.mt1]} textStyle={[styles.ph0]} isLast canEdit={canEdit}/>)}
                        </react_native_1.View>
                        <Switch_1.default accessibilityLabel={translate('common.billable')} isOn={updatedTransaction?.billable ?? !!transactionBillable} onToggle={saveBillable} disabled={!canEdit}/>
                    </OfflineWithFeedback_1.default>)}
                {shouldShowReport && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('reportID')}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon={canEditReport} title={(0, ReportUtils_1.getReportName)(actualParentReport) || actualParentReport?.reportName} description={translate('common.report')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                if (!canEditReport || !report?.reportID || !transaction?.transactionID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_REPORT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction?.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} interactive={canEditReport} shouldRenderAsHTML/>
                    </OfflineWithFeedback_1.default>)}
                {/* Note: "View trip details" should be always the last item */}
                {shouldShowViewTripDetails && (<MenuItem_1.default title={translate('travel.viewTripDetails')} icon={Expensicons.Suitcase} onPress={() => {
                if (!transaction?.transactionID || !report?.reportID) {
                    return;
                }
                const reservations = transaction?.receipt?.reservationList?.length ?? 0;
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
