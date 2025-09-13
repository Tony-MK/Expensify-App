"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PushRowFieldsStep_1 = require("@components/SubStepForms/PushRowFieldsStep");
var useEnableGlobalReimbursementsStepFormSubmit_1 = require("@hooks/useEnableGlobalReimbursementsStepFormSubmit");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var getListOptionsFromCorpayPicklist_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getListOptionsFromCorpayPicklist");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
var ANNUAL_VOLUME = EnableGlobalReimbursementsForm_1.default.ANNUAL_VOLUME;
var STEP_FIELDS = [ANNUAL_VOLUME];
function PaymentVolume(_a) {
    var onNext = _a.onNext, onMove = _a.onMove, isEditing = _a.isEditing, currency = _a.currency;
    var translate = (0, useLocalize_1.default)().translate;
    var enableGlobalReimbursementsDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true })[0];
    var corpayOnboardingFields = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: true })[0];
    var annualVolumeRangeListOptions = (0, react_1.useMemo)(function () { return (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.AnnualVolumeRange); }, [corpayOnboardingFields]);
    var pushRowFields = (0, react_1.useMemo)(function () {
        var _a;
        return [
            {
                inputID: ANNUAL_VOLUME,
                defaultValue: (_a = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[ANNUAL_VOLUME]) !== null && _a !== void 0 ? _a : '',
                options: annualVolumeRangeListOptions,
                description: translate('businessInfoStep.annualPaymentVolumeInCurrency', { currencyCode: currency }),
                modalHeaderTitle: translate('businessInfoStep.selectAnnualPaymentVolume'),
                searchInputTitle: translate('businessInfoStep.findAnnualPaymentVolume'),
            },
        ];
    }, [enableGlobalReimbursementsDraft, currency, annualVolumeRangeListOptions, translate]);
    var handleSubmit = (0, useEnableGlobalReimbursementsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext: onNext,
        shouldSaveDraft: isEditing,
    });
    if (corpayOnboardingFields === undefined) {
        return null;
    }
    return (<PushRowFieldsStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} formTitle={translate('businessInfoStep.whatsTheBusinessAnnualPayment')} onSubmit={handleSubmit} pushRowFields={pushRowFields}/>);
}
PaymentVolume.displayName = 'PaymentVolume';
exports.default = PaymentVolume;
