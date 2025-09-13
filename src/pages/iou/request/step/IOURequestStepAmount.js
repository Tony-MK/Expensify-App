"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useDuplicateTransactionsAndViolations_1 = require("@hooks/useDuplicateTransactionsAndViolations");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
const TransactionEdit_1 = require("@libs/actions/TransactionEdit");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const MoneyRequestAmountForm_1 = require("@pages/iou/MoneyRequestAmountForm");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepAmount({ report, route: { params: { iouType, reportID, transactionID = '-1', backTo, pageIndex, action, currency: selectedCurrency = '', backToReport, reportActionID }, }, transaction, currentUserPersonalDetails, shouldKeepUserInput = false, }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const textInput = (0, react_1.useRef)(null);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const isSaveButtonPressed = (0, react_1.useRef)(false);
    const iouRequestType = (0, TransactionUtils_1.getRequestType)(transaction, isBetaEnabled(CONST_1.default.BETAS.MANUAL_DISTANCE));
    const policyID = report?.policyID;
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [draftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const [splitDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const [skipConfirmation] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SKIP_CONFIRMATION}${transactionID}`, { canBeMissing: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [activePolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const { duplicateTransactions, duplicateTransactionViolations } = (0, useDuplicateTransactionsAndViolations_1.default)(transactionID ? [transactionID] : []);
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isSplitBill = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const isEditingSplitBill = isEditing && isSplitBill;
    const currentTransaction = isEditingSplitBill && !(0, EmptyObject_1.isEmptyObject)(splitDraftTransaction) ? splitDraftTransaction : transaction;
    const { amount: transactionAmount } = (0, ReportUtils_1.getTransactionDetails)(currentTransaction) ?? { amount: 0 };
    const { currency: originalCurrency } = (0, ReportUtils_1.getTransactionDetails)(isEditing && !(0, EmptyObject_1.isEmptyObject)(draftTransaction) ? draftTransaction : transaction) ?? { currency: CONST_1.default.CURRENCY.USD };
    const currency = (0, CurrencyUtils_1.isValidCurrencyCode)(selectedCurrency) ? selectedCurrency : originalCurrency;
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, report, transaction);
    const shouldGenerateTransactionThreadReport = !isBetaEnabled(CONST_1.default.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS) || !account?.shouldBlockTransactionThreadReportCreation;
    // For quick button actions, we'll skip the confirmation page unless the report is archived or this is a workspace request, as
    // the user will have to add a merchant.
    const shouldSkipConfirmation = (0, react_1.useMemo)(() => {
        if (isSplitBill || !skipConfirmation || !report?.reportID) {
            return false;
        }
        return !((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) || (0, ReportUtils_1.isPolicyExpenseChat)(report));
    }, [report, isSplitBill, skipConfirmation, reportNameValuePairs]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => textInput.current?.focus(), CONST_1.default.ANIMATED_TRANSITION);
        return () => {
            if (!focusTimeoutRef.current) {
                return;
            }
            clearTimeout(focusTimeoutRef.current);
        };
    }, []));
    (0, react_1.useEffect)(() => {
        if (!isEditing) {
            return;
        }
        // A temporary solution to not prevent users from editing the currency
        // We create a backup transaction and use it to save the currency and remove this transaction backup if we don't save the amount
        // It should be removed after this issue https://github.com/Expensify/App/issues/34607 is fixed
        (0, TransactionEdit_1.createDraftTransaction)(isEditingSplitBill && !(0, EmptyObject_1.isEmptyObject)(splitDraftTransaction) ? splitDraftTransaction : transaction);
        return () => {
            if (isSaveButtonPressed.current) {
                return;
            }
            (0, TransactionEdit_1.removeDraftTransaction)(transaction?.transactionID);
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const navigateToCurrencySelectionPage = () => {
        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CURRENCY.getRoute(action, iouType, transactionID, reportID, pageIndex, currency, Navigation_1.default.getActiveRoute()));
    };
    const navigateToConfirmationPage = () => {
        switch (iouType) {
            case CONST_1.default.IOU.TYPE.REQUEST:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SUBMIT, transactionID, reportID, backToReport));
                break;
            case CONST_1.default.IOU.TYPE.SEND:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.PAY, transactionID, reportID));
                break;
            default:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID, backToReport));
        }
    };
    const navigateToNextPage = ({ amount, paymentMethod }) => {
        isSaveButtonPressed.current = true;
        const amountInSmallestCurrencyUnits = (0, CurrencyUtils_1.convertToBackendAmount)(Number.parseFloat(amount));
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        (0, IOU_1.setMoneyRequestAmount)(transactionID, amountInSmallestCurrencyUnits, currency || CONST_1.default.CURRENCY.USD, shouldKeepUserInput);
        // Initially when we're creating money request, we do not know the participant and hence if the request is with workspace with tax tracking enabled
        // So, we reset the taxAmount here and calculate it in the hook in MoneyRequestConfirmationList component
        (0, IOU_1.setMoneyRequestTaxAmount)(transactionID, null);
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        // If a reportID exists in the report object, it's because either:
        // - The user started this flow from using the + button in the composer inside a report.
        // - The user started this flow from using the global create menu by selecting the Track expense option.
        // In this case, the participants can be automatically assigned from the report and the user can skip the participants step and go straight
        // to the confirm step.
        // If the user is started this flow using the Create expense option (combined submit/track flow), they should be redirected to the participants page.
        if (report?.reportID && !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) && iouType !== CONST_1.default.IOU.TYPE.CREATE) {
            const selectedParticipants = (0, IOU_1.getMoneyRequestParticipantsFromReport)(report);
            const participants = selectedParticipants.map((participant) => {
                const participantAccountID = participant?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
                return participantAccountID ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived);
            });
            const backendAmount = (0, CurrencyUtils_1.convertToBackendAmount)(Number.parseFloat(amount));
            if (shouldSkipConfirmation) {
                if (iouType === CONST_1.default.IOU.TYPE.PAY || iouType === CONST_1.default.IOU.TYPE.SEND) {
                    if (paymentMethod && paymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY) {
                        (0, IOU_1.sendMoneyWithWallet)(report, backendAmount, currency, '', currentUserPersonalDetails.accountID, participants.at(0) ?? {});
                        return;
                    }
                    (0, IOU_1.sendMoneyElsewhere)(report, backendAmount, currency, '', currentUserPersonalDetails.accountID, participants.at(0) ?? {});
                    return;
                }
                if (iouType === CONST_1.default.IOU.TYPE.SUBMIT || iouType === CONST_1.default.IOU.TYPE.REQUEST) {
                    (0, IOU_1.requestMoney)({
                        report,
                        participantParams: {
                            participant: participants.at(0) ?? {},
                            payeeEmail: currentUserPersonalDetails.login,
                            payeeAccountID: currentUserPersonalDetails.accountID,
                        },
                        transactionParams: {
                            amount: backendAmount,
                            currency,
                            created: transaction?.created ?? '',
                            merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
                            attendees: transaction?.comment?.attendees,
                        },
                        backToReport,
                        shouldGenerateTransactionThreadReport,
                    });
                    return;
                }
                if (iouType === CONST_1.default.IOU.TYPE.TRACK) {
                    (0, IOU_1.trackExpense)({
                        report,
                        isDraftPolicy: false,
                        participantParams: {
                            payeeEmail: currentUserPersonalDetails.login,
                            payeeAccountID: currentUserPersonalDetails.accountID,
                            participant: participants.at(0) ?? {},
                        },
                        transactionParams: {
                            amount: backendAmount,
                            currency: currency ?? 'USD',
                            created: transaction?.created,
                            merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
                        },
                    });
                    return;
                }
            }
            if (isSplitBill && !report.isOwnPolicyExpenseChat && report.participants) {
                const participantAccountIDs = Object.keys(report.participants).map((accountID) => Number(accountID));
                (0, IOU_1.setSplitShares)(transaction, amountInSmallestCurrencyUnits, currency || CONST_1.default.CURRENCY.USD, participantAccountIDs);
            }
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, report).then(() => {
                navigateToConfirmationPage();
            });
            return;
        }
        // If there was no reportID, then that means the user started this flow from the global + menu
        // and an optimistic reportID was generated. In that case, the next step is to select the participants for this expense.
        if (iouType === CONST_1.default.IOU.TYPE.CREATE && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy) && activePolicy?.isPolicyExpenseChatEnabled && !(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(activePolicy.id)) {
            const activePolicyExpenseChat = (0, ReportUtils_1.getPolicyExpenseChat)(currentUserPersonalDetails.accountID, activePolicy?.id);
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, activePolicyExpenseChat).then(() => {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType === CONST_1.default.IOU.TYPE.CREATE ? CONST_1.default.IOU.TYPE.SUBMIT : iouType, transactionID, activePolicyExpenseChat?.reportID));
            });
        }
        else {
            (0, IOUUtils_1.navigateToParticipantPage)(iouType, transactionID, reportID);
        }
    };
    const saveAmountAndCurrency = ({ amount, paymentMethod }) => {
        const newAmount = (0, CurrencyUtils_1.convertToBackendAmount)(Number.parseFloat(amount));
        // Edits to the amount from the splits page should reset the split shares.
        if (transaction?.splitShares) {
            (0, IOU_1.resetSplitShares)(transaction, newAmount, currency);
        }
        if (!isEditing) {
            navigateToNextPage({ amount, paymentMethod });
            return;
        }
        // If the value hasn't changed, don't request to save changes on the server and just close the modal
        const transactionCurrency = (0, TransactionUtils_1.getCurrency)(currentTransaction);
        if (newAmount === (0, TransactionUtils_1.getAmount)(currentTransaction) && currency === transactionCurrency) {
            navigateBack();
            return;
        }
        // If currency has changed, then we get the default tax rate based on currency, otherwise we use the current tax rate selected in transaction, if we have it.
        const transactionTaxCode = (0, ReportUtils_1.getTransactionDetails)(currentTransaction)?.taxCode;
        const defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, currentTransaction, currency) ?? '';
        const taxCode = (currency !== transactionCurrency ? defaultTaxCode : transactionTaxCode) ?? defaultTaxCode;
        const taxPercentage = (0, TransactionUtils_1.getTaxValue)(policy, currentTransaction, taxCode) ?? '';
        const taxAmount = (0, CurrencyUtils_1.convertToBackendAmount)((0, TransactionUtils_1.calculateTaxAmount)(taxPercentage, newAmount, currency ?? CONST_1.default.CURRENCY.USD));
        if (isSplitBill) {
            (0, IOU_1.setDraftSplitTransaction)(transactionID, { amount: newAmount, currency, taxCode, taxAmount });
            navigateBack();
            return;
        }
        (0, IOU_1.updateMoneyRequestAmountAndCurrency)({
            transactionID,
            transactionThreadReportID: reportID,
            transactions: duplicateTransactions,
            transactionViolations: duplicateTransactionViolations,
            currency,
            amount: newAmount,
            taxAmount,
            policy,
            taxCode,
            policyCategories,
        });
        navigateBack();
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('iou.amount')} onBackButtonPress={navigateBack} testID={IOURequestStepAmount.displayName} shouldShowWrapper={!!backTo || isEditing} includeSafeAreaPaddingBottom shouldShowNotFoundPage={shouldShowNotFoundPage}>
            <MoneyRequestAmountForm_1.default isEditing={!!backTo || isEditing} currency={currency} amount={Math.abs(transactionAmount)} skipConfirmation={shouldSkipConfirmation ?? false} iouType={iouType} policyID={policy?.id} ref={(e) => {
            textInput.current = e;
        }} shouldKeepUserInput={transaction?.shouldShowOriginalAmount} onCurrencyButtonPress={navigateToCurrencySelectionPage} onSubmitButtonPress={saveAmountAndCurrency} selectedTab={iouRequestType} chatReportID={reportID}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepAmount.displayName = 'IOURequestStepAmount';
const IOURequestStepAmountWithCurrentUserPersonalDetails = (0, withCurrentUserPersonalDetails_1.default)(IOURequestStepAmount);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepAmountWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepAmountWithCurrentUserPersonalDetails, true);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepAmountWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepAmountWithWritableReportOrNotFound);
exports.default = IOURequestStepAmountWithFullTransactionOrNotFound;
