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
var _a = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY, BUSINESS_CATEGORY = _a.BUSINESS_CATEGORY, APPLICANT_TYPE_ID = _a.APPLICANT_TYPE_ID;
var STEP_FIELDS = [BUSINESS_CATEGORY, APPLICANT_TYPE_ID];
function BusinessType(_a) {
    var _b, _c, _d, _e, _f, _g;
    var onNext = _a.onNext, isEditing = _a.isEditing, onMove = _a.onMove;
    var translate = (0, useLocalize_1.default)().translate;
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false })[0];
    var corpayOnboardingFields = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: false })[0];
    var incorporationTypeListOptions = (0, react_1.useMemo)(function () { return (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.ApplicantType); }, [corpayOnboardingFields]);
    var natureOfBusinessListOptions = (0, react_1.useMemo)(function () { return (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.NatureOfBusiness); }, [corpayOnboardingFields]);
    var incorporationTypeDefaultValue = (_d = (_c = (_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.corpay) === null || _c === void 0 ? void 0 : _c[APPLICANT_TYPE_ID]) !== null && _d !== void 0 ? _d : '';
    var businessCategoryDefaultValue = (_g = (_f = (_e = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _e === void 0 ? void 0 : _e.corpay) === null || _f === void 0 ? void 0 : _f[BUSINESS_CATEGORY]) !== null && _g !== void 0 ? _g : '';
    var pushRowFields = (0, react_1.useMemo)(function () { return [
        {
            inputID: APPLICANT_TYPE_ID,
            defaultValue: incorporationTypeDefaultValue,
            options: incorporationTypeListOptions,
            description: translate('businessInfoStep.incorporationTypeName'),
            modalHeaderTitle: translate('businessInfoStep.selectIncorporationType'),
            searchInputTitle: translate('businessInfoStep.findIncorporationType'),
        },
        {
            inputID: BUSINESS_CATEGORY,
            defaultValue: businessCategoryDefaultValue,
            options: natureOfBusinessListOptions,
            description: translate('businessInfoStep.businessCategory'),
            modalHeaderTitle: translate('businessInfoStep.selectBusinessCategory'),
            searchInputTitle: translate('businessInfoStep.findBusinessCategory'),
        },
    ]; }, [businessCategoryDefaultValue, incorporationTypeDefaultValue, incorporationTypeListOptions, natureOfBusinessListOptions, translate]);
    var handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext: onNext,
        shouldSaveDraft: isEditing,
    });
    if (corpayOnboardingFields === undefined) {
        return null;
    }
    return (<PushRowFieldsStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.whatTypeOfBusinessIsIt')} onSubmit={handleSubmit} pushRowFields={pushRowFields}/>);
}
BusinessType.displayName = 'BusinessType';
exports.default = BusinessType;
