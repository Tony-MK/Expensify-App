"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DateOfBirthStep_1 = require("@components/SubStepForms/DateOfBirthStep");
const useEnterSignerInfoStepFormSubmit_1 = require("@hooks/useEnterSignerInfoStepFormSubmit");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const WhyLink_1 = require("@pages/ReimbursementAccount/WhyLink");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnterSignerInfoForm_1 = require("@src/types/form/EnterSignerInfoForm");
function DateOfBirth({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const inputID = EnterSignerInfoForm_1.default.SIGNER_DATE_OF_BIRTH;
    const [enterSignerInfoFormDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM_DRAFT, { canBeMissing: false });
    const defaultValue = enterSignerInfoFormDraft?.[inputID] ?? '';
    const handleSubmit = (0, useEnterSignerInfoStepFormSubmit_1.default)({
        fieldIds: [inputID],
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<DateOfBirthStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM} formTitle={translate('signerInfoStep.whatsYourDOB')} onSubmit={handleSubmit} stepFields={[inputID]} dobInputID={inputID} dobDefaultValue={defaultValue} footerComponent={<WhyLink_1.default containerStyles={[styles.mt6]}/>}/>);
}
DateOfBirth.displayName = 'DateOfBirth';
exports.default = DateOfBirth;
