"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DatePicker_1 = require("@components/DatePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const COMPANY_INCORPORATION_DATE_KEY = ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.INCORPORATION_DATE;
const STEP_FIELDS = [COMPANY_INCORPORATION_DATE_KEY];
function IncorporationDateBusiness({ onNext, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount, reimbursementAccountResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const isLoadingReimbursementAccount = (0, isLoadingOnyxValue_1.default)(reimbursementAccountResult);
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        if (values.incorporationDate && !(0, ValidationUtils_1.isValidDate)(values.incorporationDate)) {
            errors.incorporationDate = translate('common.error.dateInvalid');
        }
        else if (values.incorporationDate && !(0, ValidationUtils_1.isValidPastDate)(values.incorporationDate)) {
            errors.incorporationDate = translate('bankAccount.error.incorporationDateFuture');
        }
        return errors;
    }, [translate]);
    const defaultCompanyIncorporationDate = reimbursementAccount?.achData?.incorporationDate ?? reimbursementAccountDraft?.incorporationDate ?? '';
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (isLoadingReimbursementAccount) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} validate={validate} onSubmit={handleSubmit} style={[styles.mh5, styles.flexGrow1]} submitButtonStyles={[styles.mb0]} shouldHideFixErrorsAlert>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb4]}>{translate('businessInfoStep.selectYourCompanyIncorporationDate')}</Text_1.default>
            <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID={COMPANY_INCORPORATION_DATE_KEY} label={translate('businessInfoStep.incorporationDate')} placeholder={translate('businessInfoStep.incorporationDatePlaceholder')} defaultValue={defaultCompanyIncorporationDate} shouldSaveDraft={!isEditing} maxDate={new Date()} autoFocus/>
        </FormProvider_1.default>);
}
IncorporationDateBusiness.displayName = 'IncorporationDateBusiness';
exports.default = IncorporationDateBusiness;
