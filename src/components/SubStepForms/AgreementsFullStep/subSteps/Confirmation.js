"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var RenderHTML_1 = require("@components/RenderHTML");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ValidationUtils_1 = require("@libs/ValidationUtils");
var requiresDocusignStep_1 = require("@pages/ReimbursementAccount/NonUSD/utils/requiresDocusignStep");
function IsAuthorizedToUseBankAccountLabel() {
    var translate = (0, useLocalize_1.default)().translate;
    return <Text_1.default>{translate('agreementsStep.iAmAuthorized')}</Text_1.default>;
}
function CertifyTrueAndAccurateLabel() {
    var translate = (0, useLocalize_1.default)().translate;
    return <Text_1.default>{translate('agreementsStep.iCertify')}</Text_1.default>;
}
function TermsAndConditionsLabel() {
    var translate = (0, useLocalize_1.default)().translate;
    return <RenderHTML_1.default html={translate('agreementsStep.iAcceptTheTermsAndConditions')}/>;
}
function ConsentToPrivacyNoticeLabel() {
    var translate = (0, useLocalize_1.default)().translate;
    return <RenderHTML_1.default html={translate('agreementsStep.iConsentToThePrivacyNotice')}/>;
}
function Confirmation(_a) {
    var defaultValues = _a.defaultValues, formID = _a.formID, inputIDs = _a.inputIDs, isLoading = _a.isLoading, onNext = _a.onNext, currency = _a.currency;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var isDocusignStepRequired = (0, requiresDocusignStep_1.default)(currency);
    var stepFields = (0, react_1.useMemo)(function () { return [inputIDs.authorizedToBindClientToAgreement, inputIDs.provideTruthfulInformation, inputIDs.agreeToTermsAndConditions, inputIDs.consentToPrivacyNotice]; }, [inputIDs]);
    var validate = (0, react_1.useCallback)(function (values) {
        var errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, stepFields);
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(values[inputIDs.authorizedToBindClientToAgreement])) {
            errors[inputIDs.authorizedToBindClientToAgreement] = translate('agreementsStep.error.authorized');
        }
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(values[inputIDs.provideTruthfulInformation])) {
            errors[inputIDs.provideTruthfulInformation] = translate('agreementsStep.error.certify');
        }
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(values[inputIDs.agreeToTermsAndConditions])) {
            errors[inputIDs.agreeToTermsAndConditions] = translate('common.error.acceptTerms');
        }
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(values[inputIDs.consentToPrivacyNotice])) {
            errors[inputIDs.consentToPrivacyNotice] = translate('agreementsStep.error.consent');
        }
        return errors;
    }, [inputIDs.agreeToTermsAndConditions, inputIDs.authorizedToBindClientToAgreement, inputIDs.consentToPrivacyNotice, inputIDs.provideTruthfulInformation, stepFields, translate]);
    return (<FormProvider_1.default formID={formID} onSubmit={onNext} validate={validate} submitButtonText={isDocusignStepRequired ? translate('common.confirm') : translate('agreementsStep.accept')} style={[styles.mh5, styles.flexGrow1]} enabledWhenOffline={false} isLoading={isLoading}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL]}>{translate('agreementsStep.pleaseConfirm')}</Text_1.default>
            {!isDocusignStepRequired && <Text_1.default style={[styles.pv3, styles.textSupporting]}>{translate('agreementsStep.regulationRequiresUs')}</Text_1.default>}
            <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} accessibilityLabel={translate('agreementsStep.iAmAuthorized')} inputID={inputIDs.authorizedToBindClientToAgreement} style={styles.mt6} LabelComponent={IsAuthorizedToUseBankAccountLabel} defaultValue={defaultValues[inputIDs.authorizedToBindClientToAgreement]} shouldSaveDraft/>
            <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} accessibilityLabel={translate('agreementsStep.iCertify')} inputID={inputIDs.provideTruthfulInformation} style={styles.mt6} LabelComponent={CertifyTrueAndAccurateLabel} defaultValue={defaultValues[inputIDs.provideTruthfulInformation]} shouldSaveDraft/>
            <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} accessibilityLabel={translate('agreementsStep.iAcceptTheTermsAndConditionsAccessibility')} inputID={inputIDs.agreeToTermsAndConditions} style={styles.mt6} LabelComponent={TermsAndConditionsLabel} defaultValue={defaultValues[inputIDs.agreeToTermsAndConditions]} shouldSaveDraft/>
            <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} accessibilityLabel={translate('agreementsStep.iConsentToThePrivacyNoticeAccessibility')} inputID={inputIDs.consentToPrivacyNotice} style={styles.mt6} LabelComponent={ConsentToPrivacyNoticeLabel} defaultValue={defaultValues[inputIDs.consentToPrivacyNotice]} shouldSaveDraft/>
        </FormProvider_1.default>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
