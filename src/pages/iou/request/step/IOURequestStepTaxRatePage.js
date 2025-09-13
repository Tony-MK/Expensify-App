"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TaxPicker_1 = require("@components/TaxPicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const CurrencyUtils = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const TransactionUtils = require("@libs/TransactionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const IOU = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function getTaxAmount(policy, transaction, selectedTaxCode, amount) {
    const getTaxValue = (taxCode) => TransactionUtils.getTaxValue(policy, transaction, taxCode);
    const taxPercentage = getTaxValue(selectedTaxCode);
    if (taxPercentage) {
        return TransactionUtils.calculateTaxAmount(taxPercentage, amount, (0, TransactionUtils_1.getCurrency)(transaction));
    }
}
function IOURequestStepTaxRatePage({ route: { params: { action, backTo, iouType, transactionID }, }, transaction, report, }) {
    const { translate } = (0, useLocalize_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID ?? '-1'}`);
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${report?.policyID ?? '-1'}`);
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID ?? '-1'}`);
    const [splitDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID ?? '-1'}`);
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isEditingSplitBill = isEditing && iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const currentTransaction = isEditingSplitBill && !(0, EmptyObject_1.isEmptyObject)(splitDraftTransaction) ? splitDraftTransaction : transaction;
    const taxRates = policy?.taxRates;
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const taxRateTitle = TransactionUtils.getTaxName(policy, currentTransaction);
    const updateTaxRates = (taxes) => {
        if (!currentTransaction || !taxes.code || !taxRates) {
            Navigation_1.default.goBack();
            return;
        }
        const taxAmount = getTaxAmount(policy, currentTransaction, taxes.code, TransactionUtils.getAmount(currentTransaction, false, true));
        if (isEditingSplitBill) {
            IOU.setDraftSplitTransaction(currentTransaction.transactionID, {
                taxAmount: CurrencyUtils.convertToBackendAmount(taxAmount ?? 0),
                taxCode: taxes.code,
            });
            navigateBack();
            return;
        }
        if (isEditing) {
            const newTaxCode = taxes.code;
            IOU.updateMoneyRequestTaxRate({
                transactionID: currentTransaction?.transactionID ?? '-1',
                optimisticReportActionID: report?.reportID ?? '-1',
                taxCode: newTaxCode,
                taxAmount: CurrencyUtils.convertToBackendAmount(taxAmount ?? 0),
                policy,
                policyTagList: policyTags,
                policyCategories,
            });
            navigateBack();
            return;
        }
        if (taxAmount === undefined) {
            navigateBack();
            return;
        }
        const amountInSmallestCurrencyUnits = CurrencyUtils.convertToBackendAmount(taxAmount);
        IOU.setMoneyRequestTaxRate(currentTransaction?.transactionID, taxes?.code ?? '');
        IOU.setMoneyRequestTaxAmount(currentTransaction.transactionID, amountInSmallestCurrencyUnits);
        navigateBack();
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('iou.taxRate')} onBackButtonPress={navigateBack} shouldShowWrapper testID={IOURequestStepTaxRatePage.displayName}>
            <TaxPicker_1.default selectedTaxRate={taxRateTitle} policyID={report?.policyID} transactionID={currentTransaction?.transactionID} onSubmit={updateTaxRates} action={action} iouType={iouType} onDismiss={navigateBack}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepTaxRatePage.displayName = 'IOURequestStepTaxRatePage';
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepTaxRatePageWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepTaxRatePage);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepTaxRatePageWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepTaxRatePageWithWritableReportOrNotFound);
exports.default = IOURequestStepTaxRatePageWithFullTransactionOrNotFound;
