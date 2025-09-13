"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useEnterSignerInfoStepFormSubmit_1 = require("@hooks/useEnterSignerInfoStepFormSubmit");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnterSignerInfoForm_1 = require("@src/types/form/EnterSignerInfoForm");
function Name({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [enterSignerInfoFormDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM_DRAFT, { canBeMissing: true });
    const inputID = EnterSignerInfoForm_1.default.SIGNER_FULL_NAME;
    const defaultValue = String(enterSignerInfoFormDraft?.[inputID] ?? '');
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [inputID]);
        if (values[inputID] && !(0, ValidationUtils_1.isValidLegalName)(String(values[inputID]))) {
            errors[inputID] = translate('bankAccount.error.fullName');
        }
        return errors;
    }, [inputID, translate]);
    const handleSubmit = (0, useEnterSignerInfoStepFormSubmit_1.default)({
        fieldIds: [inputID],
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM} formTitle={translate('signerInfoStep.whatsYourName')} validate={validate} onSubmit={handleSubmit} inputId={inputID} inputLabel={translate('signerInfoStep.fullName')} inputMode={CONST_1.default.INPUT_MODE.TEXT} defaultValue={defaultValue} shouldShowHelpLinks={false} shouldDelayAutoFocus/>);
}
Name.displayName = 'Name';
exports.default = Name;
