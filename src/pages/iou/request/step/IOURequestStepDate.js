"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const DatePicker_1 = require("@components/DatePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const useDuplicateTransactionsAndViolations_1 = require("@hooks/useDuplicateTransactionsAndViolations");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MoneyRequestDateForm_1 = require("@src/types/form/MoneyRequestDateForm");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepDate({ route: { params: { action, iouType, reportID, backTo, reportActionID, transactionID }, }, transaction, report, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const { duplicateTransactions, duplicateTransactionViolations } = (0, useDuplicateTransactionsAndViolations_1.default)(transactionID ? [transactionID] : []);
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${report?.policyID}`, { canBeMissing: false });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID}`, { canBeMissing: false });
    const [splitDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isSplitBill = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const isSplitExpense = iouType === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE;
    // In the split flow, when editing we use SPLIT_TRANSACTION_DRAFT to save draft value
    const isEditingSplit = (isSplitBill || isSplitExpense) && isEditing;
    const currentCreated = isEditingSplit && !(0, isEmpty_1.default)(splitDraftTransaction) ? (0, TransactionUtils_1.getFormattedCreated)(splitDraftTransaction) : (0, TransactionUtils_1.getFormattedCreated)(transaction);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFound = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, report, transaction);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const updateDate = (value) => {
        const newCreated = value.moneyRequestCreated;
        // Only update created if it has changed
        if (newCreated === currentCreated) {
            navigateBack();
            return;
        }
        // In the split flow, when editing we use SPLIT_TRANSACTION_DRAFT to save draft value
        if (isEditingSplit) {
            (0, IOU_1.setDraftSplitTransaction)(transactionID, { created: newCreated });
            navigateBack();
            return;
        }
        const isTransactionDraft = (0, IOUUtils_1.shouldUseTransactionDraft)(action);
        (0, IOU_1.setMoneyRequestCreated)(transactionID, newCreated, isTransactionDraft);
        if (isEditing) {
            (0, IOU_1.updateMoneyRequestDate)(transactionID, reportID, duplicateTransactions, duplicateTransactionViolations, newCreated, policy, policyTags, policyCategories);
        }
        navigateBack();
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('common.date')} onBackButtonPress={navigateBack} shouldShowNotFoundPage={shouldShowNotFound} shouldShowWrapper testID={IOURequestStepDate.displayName} includeSafeAreaPaddingBottom>
            <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.MONEY_REQUEST_DATE_FORM} onSubmit={updateDate} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID={MoneyRequestDateForm_1.default.MONEY_REQUEST_CREATED} label={translate('common.date')} defaultValue={currentCreated} maxDate={CONST_1.default.CALENDAR_PICKER.MAX_DATE} minDate={CONST_1.default.CALENDAR_PICKER.MIN_DATE} autoFocus/>
            </FormProvider_1.default>
        </StepScreenWrapper_1.default>);
}
IOURequestStepDate.displayName = 'IOURequestStepDate';
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDateWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepDate);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDateWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepDateWithFullTransactionOrNotFound);
exports.default = IOURequestStepDateWithWritableReportOrNotFound;
