"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const IndustryCodeSelector_1 = require("./IndustryCode/IndustryCodeSelector");
const COMPANY_INCORPORATION_CODE_KEY = ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.INCORPORATION_CODE;
const STEP_FIELDS = [COMPANY_INCORPORATION_CODE_KEY];
function IncorporationCode({ onNext, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    const validate = (values) => {
        const errors = {};
        if (!values[COMPANY_INCORPORATION_CODE_KEY]) {
            errors[COMPANY_INCORPORATION_CODE_KEY] = translate('common.error.fieldRequired');
        }
        else if (!(0, ValidationUtils_1.isValidIndustryCode)(values[COMPANY_INCORPORATION_CODE_KEY])) {
            errors[COMPANY_INCORPORATION_CODE_KEY] = translate('bankAccount.error.industryCode');
        }
        return errors;
    };
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} validate={validate} onSubmit={handleSubmit} style={[styles.mh0, styles.flexGrow1]} submitButtonStyles={[styles.ph5, styles.mb0]} shouldHideFixErrorsAlert>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb6]}>{translate('companyStep.industryClassification')}</Text_1.default>
            <InputWrapper_1.default InputComponent={IndustryCodeSelector_1.default} inputID={COMPANY_INCORPORATION_CODE_KEY} shouldSaveDraft={!isEditing} defaultValue={reimbursementAccount?.achData?.industryCode}/>
        </FormProvider_1.default>);
}
IncorporationCode.displayName = 'IncorporationCode';
exports.default = IncorporationCode;
