"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
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
const ErrorUtils_1 = require("@libs/ErrorUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const variables_1 = require("@styles/variables");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MoneyRequestDescriptionForm_1 = require("@src/types/form/MoneyRequestDescriptionForm");
const DiscardChangesConfirmation_1 = require("./DiscardChangesConfirmation");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepDescription({ route: { params: { action, iouType, reportID, backTo, reportActionID, transactionID }, }, transaction, report, }) {
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [splitDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${report?.policyID}`, { canBeMissing: true });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID}`, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef, inputRef } = (0, useAutoFocusInput_1.default)(true);
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    // In the split flow, when editing we use SPLIT_TRANSACTION_DRAFT to save draft value
    const isEditingSplit = (iouType === CONST_1.default.IOU.TYPE.SPLIT || iouType === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE) && isEditing;
    const isTransactionDraft = (0, IOUUtils_1.shouldUseTransactionDraft)(action, iouType);
    const currentDescriptionInMarkdown = (0, react_1.useMemo)(() => {
        if (!isTransactionDraft || iouType === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE) {
            return Parser_1.default.htmlToMarkdown(isEditingSplit && !(0, isEmpty_1.default)(splitDraftTransaction) ? (splitDraftTransaction?.comment?.comment ?? '') : (transaction?.comment?.comment ?? ''));
        }
        return isEditingSplit && !(0, isEmpty_1.default)(splitDraftTransaction) ? (splitDraftTransaction?.comment?.comment ?? '') : (transaction?.comment?.comment ?? '');
    }, [isTransactionDraft, iouType, isEditingSplit, splitDraftTransaction, transaction?.comment?.comment]);
    const descriptionRef = (0, react_1.useRef)(currentDescriptionInMarkdown);
    const isSavedRef = (0, react_1.useRef)(false);
    /**
     * @returns - An object containing the errors for each inputID
     */
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (values.moneyRequestComment.length > CONST_1.default.DESCRIPTION_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'moneyRequestComment', translate('common.error.characterLimitExceedCounter', { length: values.moneyRequestComment.length, limit: CONST_1.default.DESCRIPTION_LIMIT }));
        }
        return errors;
    }, [translate]);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const updateDescriptionRef = (value) => {
        descriptionRef.current = value;
    };
    const updateComment = (value) => {
        if (!transaction?.transactionID) {
            return;
        }
        isSavedRef.current = true;
        const newComment = value.moneyRequestComment.trim();
        // Only update comment if it has changed
        if (newComment === currentDescriptionInMarkdown) {
            navigateBack();
            return;
        }
        // In the split flow, when editing we use SPLIT_TRANSACTION_DRAFT to save draft value
        if (isEditingSplit) {
            (0, IOU_1.setDraftSplitTransaction)(transaction?.transactionID, { comment: newComment });
            navigateBack();
            return;
        }
        (0, IOU_1.setMoneyRequestDescription)(transaction?.transactionID, newComment, isTransactionDraft);
        if (action === CONST_1.default.IOU.ACTION.EDIT) {
            (0, IOU_1.updateMoneyRequestDescription)(transaction?.transactionID, reportID, newComment, policy, policyTags, policyCategories);
        }
        navigateBack();
    };
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, report, transaction);
    const isReportInGroupPolicy = !!report?.policyID && report.policyID !== CONST_1.default.POLICY.ID_FAKE && (0, PolicyUtils_1.getPersonalPolicy)()?.id !== report.policyID;
    const getDescriptionHint = () => {
        return transaction?.category && policyCategories ? (policyCategories[transaction?.category]?.commentHint ?? '') : '';
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('common.description')} onBackButtonPress={navigateBack} shouldShowWrapper testID={IOURequestStepDescription.displayName} shouldShowNotFoundPage={shouldShowNotFoundPage}>
            <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.MONEY_REQUEST_DESCRIPTION_FORM} onSubmit={updateComment} validate={validate} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                <react_native_1.View style={styles.mb4}>
                    <InputWrapper_1.default valueType="string" InputComponent={TextInput_1.default} inputID={MoneyRequestDescriptionForm_1.default.MONEY_REQUEST_COMMENT} name={MoneyRequestDescriptionForm_1.default.MONEY_REQUEST_COMMENT} defaultValue={currentDescriptionInMarkdown} onValueChange={updateDescriptionRef} label={translate('moneyRequestConfirmationList.whatsItFor')} accessibilityLabel={translate('moneyRequestConfirmationList.whatsItFor')} role={CONST_1.default.ROLE.PRESENTATION} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} shouldSubmitForm type="markdown" excludedMarkdownStyles={!isReportInGroupPolicy ? ['mentionReport'] : []} ref={inputCallbackRef} hint={getDescriptionHint()}/>
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
            return descriptionRef.current !== currentDescriptionInMarkdown;
        }}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepDescription.displayName = 'IOURequestStepDescription';
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDescriptionWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepDescription);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDescriptionWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepDescriptionWithFullTransactionOrNotFound);
exports.default = IOURequestStepDescriptionWithWritableReportOrNotFound;
