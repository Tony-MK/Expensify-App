"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const StateSelector_1 = require("@components/StateSelector");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const COMPANY_INCORPORATION_STATE_KEY = ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.INCORPORATION_STATE;
const STEP_FIELDS = [COMPANY_INCORPORATION_STATE_KEY];
const validate = (values) => (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
function IncorporationStateBusiness({ onNext, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount, reimbursementAccountResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const isLoadingReimbursementAccount = (0, isLoadingOnyxValue_1.default)(reimbursementAccountResult);
    const defaultCompanyIncorporationState = reimbursementAccount?.achData?.incorporationState ?? '';
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (isLoadingReimbursementAccount) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} validate={validate} onSubmit={handleSubmit} style={[styles.mh0, styles.flexGrow1]} submitButtonStyles={[styles.ph5, styles.mb0]} shouldHideFixErrorsAlert>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5]}>{translate('businessInfoStep.pleaseSelectTheStateYourCompanyWasIncorporatedIn')}</Text_1.default>
            <InputWrapper_1.default InputComponent={StateSelector_1.default} inputID={COMPANY_INCORPORATION_STATE_KEY} label={translate('businessInfoStep.incorporationState')} defaultValue={defaultCompanyIncorporationState} shouldSaveDraft={!isEditing} wrapperStyle={[styles.ph5, styles.mt3]}/>
        </FormProvider_1.default>);
}
IncorporationStateBusiness.displayName = 'IncorporationStateBusiness';
exports.default = IncorporationStateBusiness;
