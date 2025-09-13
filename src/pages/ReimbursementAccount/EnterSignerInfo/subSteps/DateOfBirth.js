"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var DateOfBirthStep_1 = require("@components/SubStepForms/DateOfBirthStep");
var useEnterSignerInfoStepFormSubmit_1 = require("@hooks/useEnterSignerInfoStepFormSubmit");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var WhyLink_1 = require("@pages/ReimbursementAccount/WhyLink");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnterSignerInfoForm_1 = require("@src/types/form/EnterSignerInfoForm");
function DateOfBirth(_a) {
    var _b;
    var onNext = _a.onNext, onMove = _a.onMove, isEditing = _a.isEditing;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var inputID = EnterSignerInfoForm_1.default.SIGNER_DATE_OF_BIRTH;
    var enterSignerInfoFormDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM_DRAFT, { canBeMissing: false })[0];
    var defaultValue = (_b = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[inputID]) !== null && _b !== void 0 ? _b : '';
    var handleSubmit = (0, useEnterSignerInfoStepFormSubmit_1.default)({
        fieldIds: [inputID],
        onNext: onNext,
        shouldSaveDraft: isEditing,
    });
    return (<DateOfBirthStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM} formTitle={translate('signerInfoStep.whatsYourDOB')} onSubmit={handleSubmit} stepFields={[inputID]} dobInputID={inputID} dobDefaultValue={defaultValue} footerComponent={<WhyLink_1.default containerStyles={[styles.mt6]}/>}/>);
}
DateOfBirth.displayName = 'DateOfBirth';
exports.default = DateOfBirth;
