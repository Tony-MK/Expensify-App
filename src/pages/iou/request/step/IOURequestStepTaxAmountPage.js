"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const IOU_1 = require("@libs/actions/IOU");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const MoneyRequestAmountForm_1 = require("@pages/iou/MoneyRequestAmountForm");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function getTaxAmount(transaction, policy, currency, isEditing) {
    if (!transaction?.amount && !transaction?.modifiedAmount) {
        return;
    }
    const transactionTaxAmount = (0, TransactionUtils_1.getAmount)(transaction);
    const transactionTaxCode = transaction?.taxCode ?? '';
    const defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, transaction, currency) ?? '';
    const getTaxValueByTaxCode = (taxCode) => (0, TransactionUtils_1.getTaxValue)(policy, transaction, taxCode);
    const defaultTaxValue = getTaxValueByTaxCode(defaultTaxCode);
    const moneyRequestTaxPercentage = (transactionTaxCode ? getTaxValueByTaxCode(transactionTaxCode) : defaultTaxValue) ?? '';
    const editingTaxPercentage = (transactionTaxCode ? getTaxValueByTaxCode(transactionTaxCode) : moneyRequestTaxPercentage) ?? '';
    const taxPercentage = isEditing ? editingTaxPercentage : moneyRequestTaxPercentage;
    return (0, CurrencyUtils_1.convertToBackendAmount)((0, TransactionUtils_1.calculateTaxAmount)(taxPercentage, transactionTaxAmount, currency ?? CONST_1.default.CURRENCY.USD));
}
function IOURequestStepTaxAmountPage({ route: { params: { action, iouType, reportID, transactionID, backTo, currency: selectedCurrency = '' }, }, transaction, report, }) {
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${report?.policyID}`, { canBeMissing: true });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID}`, { canBeMissing: true });
    const [splitDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const { translate } = (0, useLocalize_1.default)();
    const textInput = (0, react_1.useRef)(null);
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isEditingSplitBill = isEditing && iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const focusTimeoutRef = (0, react_1.useRef)(undefined);
    const currentTransaction = isEditingSplitBill && !(0, EmptyObject_1.isEmptyObject)(splitDraftTransaction) ? splitDraftTransaction : transaction;
    const transactionDetails = (0, ReportUtils_1.getTransactionDetails)(currentTransaction);
    const currency = (0, CurrencyUtils_1.isValidCurrencyCode)(selectedCurrency) ? selectedCurrency : transactionDetails?.currency;
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => textInput.current?.focus(), CONST_1.default.ANIMATED_TRANSITION);
        return () => {
            if (!focusTimeoutRef.current) {
                return;
            }
            clearTimeout(focusTimeoutRef.current);
        };
    }, []));
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const navigateToCurrencySelectionPage = () => {
        // If the expense being created is a distance expense, don't allow the user to choose the currency.
        // Only USD is allowed for distance expenses.
        // Remove query from the route and encode it.
        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CURRENCY.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID, backTo ? 'confirm' : '', currency, Navigation_1.default.getActiveRouteWithoutParams()));
    };
    const updateTaxAmount = (currentAmount) => {
        const taxAmountInSmallestCurrencyUnits = (0, CurrencyUtils_1.convertToBackendAmount)(Number.parseFloat(currentAmount.amount));
        if (isEditingSplitBill) {
            (0, IOU_1.setDraftSplitTransaction)(transactionID, { taxAmount: taxAmountInSmallestCurrencyUnits });
            navigateBack();
            return;
        }
        if (isEditing) {
            if (taxAmountInSmallestCurrencyUnits === (0, TransactionUtils_1.getTaxAmount)(currentTransaction, false)) {
                navigateBack();
                return;
            }
            (0, IOU_1.updateMoneyRequestTaxAmount)(transactionID, report?.reportID, taxAmountInSmallestCurrencyUnits, policy, policyTags, policyCategories);
            navigateBack();
            return;
        }
        (0, IOU_1.setMoneyRequestTaxAmount)(transactionID, taxAmountInSmallestCurrencyUnits);
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        (0, IOU_1.setMoneyRequestCurrency)(transactionID, currency || CONST_1.default.CURRENCY.USD);
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        // If a reportID exists in the report object, it's because the user started this flow from using the + button in the composer
        // inside a report. In this case, the participants can be automatically assigned from the report and the user can skip the participants step and go straight
        // to the confirm step.
        if (report?.reportID) {
            // TODO: Is this really needed at all?
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, report);
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID));
            return;
        }
        // If there was no reportID, then that means the user started this flow from the global + menu
        // and an optimistic reportID was generated. In that case, the next step is to select the participants for this request.
        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_PARTICIPANTS.getRoute(iouType, transactionID, reportID));
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('iou.taxAmount')} onBackButtonPress={navigateBack} testID={IOURequestStepTaxAmountPage.displayName} shouldShowWrapper={!!(backTo || isEditing)} includeSafeAreaPaddingBottom>
            <MoneyRequestAmountForm_1.default isEditing={!!(backTo || isEditing)} currency={currency} amount={Math.abs(transactionDetails?.taxAmount ?? 0)} taxAmount={getTaxAmount(currentTransaction, policy, currency, !!(backTo || isEditing))} ref={(e) => {
            textInput.current = e;
        }} onCurrencyButtonPress={navigateToCurrencySelectionPage} onSubmitButtonPress={updateTaxAmount} isCurrencyPressable={false} chatReportID={reportID}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepTaxAmountPage.displayName = 'IOURequestStepTaxAmountPage';
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepTaxAmountPageWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepTaxAmountPage);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepTaxAmountPageWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepTaxAmountPageWithWritableReportOrNotFound);
exports.default = IOURequestStepTaxAmountPageWithFullTransactionOrNotFound;
