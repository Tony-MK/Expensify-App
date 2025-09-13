"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PushRowFieldsStep_1 = require("@components/SubStepForms/PushRowFieldsStep");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
var getListOptionsFromCorpayPicklist_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getListOptionsFromCorpayPicklist");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
var ANNUAL_VOLUME = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.ANNUAL_VOLUME;
var STEP_FIELDS = [ANNUAL_VOLUME];
function PaymentVolume(_a) {
    var _b, _c, _d, _e, _f;
    var onNext = _a.onNext, onMove = _a.onMove, isEditing = _a.isEditing;
    var translate = (0, useLocalize_1.default)().translate;
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false })[0];
    var corpayOnboardingFields = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: false })[0];
    var policyID = (_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.policyID;
    var policy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), { canBeMissing: false })[0];
    var currency = (_c = policy === null || policy === void 0 ? void 0 : policy.outputCurrency) !== null && _c !== void 0 ? _c : '';
    var annualVolumeRangeListOptions = (0, react_1.useMemo)(function () { return (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.AnnualVolumeRange); }, [corpayOnboardingFields]);
    var annualVolumeDefaultValue = (_f = (_e = (_d = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _d === void 0 ? void 0 : _d.corpay) === null || _e === void 0 ? void 0 : _e[ANNUAL_VOLUME]) !== null && _f !== void 0 ? _f : '';
    var pushRowFields = (0, react_1.useMemo)(function () { return [
        {
            inputID: ANNUAL_VOLUME,
            defaultValue: annualVolumeDefaultValue,
            options: annualVolumeRangeListOptions,
            description: translate('businessInfoStep.annualPaymentVolumeInCurrency', { currencyCode: currency }),
            modalHeaderTitle: translate('businessInfoStep.selectAnnualPaymentVolume'),
            searchInputTitle: translate('businessInfoStep.findAnnualPaymentVolume'),
        },
    ]; }, [annualVolumeDefaultValue, annualVolumeRangeListOptions, translate, currency]);
    var handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext: onNext,
        shouldSaveDraft: isEditing,
    });
    if (corpayOnboardingFields === undefined) {
        return null;
    }
    return (<PushRowFieldsStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.whatsTheBusinessAnnualPayment')} onSubmit={handleSubmit} pushRowFields={pushRowFields}/>);
}
PaymentVolume.displayName = 'PaymentVolume';
exports.default = PaymentVolume;
