"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MoneyRequestMerchantForm_1 = require("@src/types/form/MoneyRequestMerchantForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const DiscardChangesConfirmation_1 = require("./DiscardChangesConfirmation");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepMerchant({ route: { params: { transactionID, reportID, backTo, action, iouType, reportActionID }, }, transaction, report, }) {
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [splitDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${report?.policyID}`, { canBeMissing: true });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID}`, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef, inputRef } = (0, useAutoFocusInput_1.default)();
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, report, transaction);
    // In the split flow, when editing we use SPLIT_TRANSACTION_DRAFT to save draft value
    const isEditingSplitBill = iouType === CONST_1.default.IOU.TYPE.SPLIT && isEditing;
    const merchant = (0, ReportUtils_1.getTransactionDetails)(isEditingSplitBill && !(0, EmptyObject_1.isEmptyObject)(splitDraftTransaction) ? splitDraftTransaction : transaction)?.merchant;
    const isEmptyMerchant = merchant === '' || merchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT;
    const initialMerchant = isEmptyMerchant ? '' : merchant;
    const merchantRef = (0, react_1.useRef)(initialMerchant);
    const isSavedRef = (0, react_1.useRef)(false);
    const isMerchantRequired = (0, ReportUtils_1.isPolicyExpenseChat)(report) || (0, ReportUtils_1.isExpenseRequest)(report) || transaction?.participants?.some((participant) => !!participant.isPolicyExpenseChat);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const validate = (0, react_1.useCallback)((value) => {
        const errors = {};
        const { isValid, byteLength } = (0, ValidationUtils_1.isValidInputLength)(value.moneyRequestMerchant, CONST_1.default.MERCHANT_NAME_MAX_BYTES);
        if (isMerchantRequired && !value.moneyRequestMerchant) {
            errors.moneyRequestMerchant = translate('common.error.fieldRequired');
        }
        else if (isMerchantRequired && value.moneyRequestMerchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT) {
            errors.moneyRequestMerchant = translate('iou.error.invalidMerchant');
        }
        else if (!isValid) {
            errors.moneyRequestMerchant = translate('common.error.characterLimitExceedCounter', {
                length: byteLength,
                limit: CONST_1.default.MERCHANT_NAME_MAX_BYTES,
            });
        }
        return errors;
    }, [isMerchantRequired, translate]);
    const updateMerchantRef = (value) => {
        merchantRef.current = value;
    };
    const updateMerchant = (value) => {
        isSavedRef.current = true;
        const newMerchant = value.moneyRequestMerchant?.trim();
        // In the split flow, when editing we use SPLIT_TRANSACTION_DRAFT to save draft value
        if (isEditingSplitBill) {
            (0, IOU_1.setDraftSplitTransaction)(transactionID, { merchant: newMerchant });
            navigateBack();
            return;
        }
        // In case the merchant hasn't been changed, do not make the API request.
        // In case the merchant has been set to empty string while current merchant is partial, do nothing too.
        if (newMerchant === merchant || (newMerchant === '' && merchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT)) {
            navigateBack();
            return;
        }
        // When creating/editing an expense, newMerchant can be blank so we fall back on PARTIAL_TRANSACTION_MERCHANT
        (0, IOU_1.setMoneyRequestMerchant)(transactionID, newMerchant || CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT, !isEditing);
        if (isEditing) {
            (0, IOU_1.updateMoneyRequestMerchant)(transactionID, reportID, newMerchant || CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT, policy, policyTags, policyCategories);
        }
        navigateBack();
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('common.merchant')} onBackButtonPress={navigateBack} shouldShowWrapper testID={IOURequestStepMerchant.displayName} shouldShowNotFoundPage={shouldShowNotFoundPage}>
            <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.MONEY_REQUEST_MERCHANT_FORM} onSubmit={updateMerchant} validate={validate} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert shouldUseStrictHtmlTagValidation>
                <react_native_1.View style={styles.mb4}>
                    <InputWrapper_1.default valueType="string" InputComponent={TextInput_1.default} inputID={MoneyRequestMerchantForm_1.default.MONEY_REQUEST_MERCHANT} name={MoneyRequestMerchantForm_1.default.MONEY_REQUEST_MERCHANT} defaultValue={initialMerchant} onValueChange={updateMerchantRef} label={translate('common.merchant')} accessibilityLabel={translate('common.merchant')} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef}/>
                </react_native_1.View>
            </FormProvider_1.default>
            <DiscardChangesConfirmation_1.default onCancel={() => {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                inputRef.current?.focus();
            });
        }} getHasUnsavedChanges={() => {
            if (isSavedRef.current) {
                return false;
            }
            return merchantRef.current !== initialMerchant;
        }}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepMerchant.displayName = 'IOURequestStepMerchant';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepMerchant));
