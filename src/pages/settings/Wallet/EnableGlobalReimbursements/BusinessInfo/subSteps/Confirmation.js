"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
var BUSINESS_REGISTRATION_INCORPORATION_NUMBER = EnableGlobalReimbursementsForm_1.default.BUSINESS_REGISTRATION_INCORPORATION_NUMBER, ANNUAL_VOLUME = EnableGlobalReimbursementsForm_1.default.ANNUAL_VOLUME, APPLICANT_TYPE_ID = EnableGlobalReimbursementsForm_1.default.APPLICANT_TYPE_ID, TRADE_VOLUME = EnableGlobalReimbursementsForm_1.default.TRADE_VOLUME, BUSINESS_CATEGORY = EnableGlobalReimbursementsForm_1.default.BUSINESS_CATEGORY;
var displayStringValue = function (list, matchingName) {
    var _a, _b;
    return (_b = (_a = list.find(function (item) { return item.name === matchingName; })) === null || _a === void 0 ? void 0 : _a.stringValue) !== null && _b !== void 0 ? _b : '';
};
function Confirmation(_a) {
    var onNext = _a.onNext, onMove = _a.onMove, isEditing = _a.isEditing;
    var translate = (0, useLocalize_1.default)().translate;
    var enableGlobalReimbursementsDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: false })[0];
    var corpayOnboardingFields = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: false })[0];
    var error = (0, ErrorUtils_1.getLatestErrorMessage)(enableGlobalReimbursementsDraft);
    var paymentVolume = (0, react_1.useMemo)(function () { var _a, _b; return displayStringValue((_a = corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.AnnualVolumeRange) !== null && _a !== void 0 ? _a : [], (_b = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[ANNUAL_VOLUME]) !== null && _b !== void 0 ? _b : ''); }, [corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.AnnualVolumeRange, enableGlobalReimbursementsDraft]);
    var businessCategory = (0, react_1.useMemo)(function () { var _a, _b; return displayStringValue((_a = corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.NatureOfBusiness) !== null && _a !== void 0 ? _a : [], (_b = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[BUSINESS_CATEGORY]) !== null && _b !== void 0 ? _b : ''); }, [corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.NatureOfBusiness, enableGlobalReimbursementsDraft]);
    var businessType = (0, react_1.useMemo)(function () { var _a, _b; return displayStringValue((_a = corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.ApplicantType) !== null && _a !== void 0 ? _a : [], (_b = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[APPLICANT_TYPE_ID]) !== null && _b !== void 0 ? _b : ''); }, [corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.ApplicantType, enableGlobalReimbursementsDraft]);
    var tradeVolumeRange = (0, react_1.useMemo)(function () { var _a, _b; return displayStringValue((_a = corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.TradeVolumeRange) !== null && _a !== void 0 ? _a : [], (_b = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[TRADE_VOLUME]) !== null && _b !== void 0 ? _b : ''); }, [corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.TradeVolumeRange, enableGlobalReimbursementsDraft]);
    var summaryItems = (0, react_1.useMemo)(function () {
        var _a;
        return [
            {
                title: (_a = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[BUSINESS_REGISTRATION_INCORPORATION_NUMBER]) !== null && _a !== void 0 ? _a : '',
                description: translate('businessInfoStep.registrationNumber'),
                shouldShowRightIcon: true,
                onPress: function () {
                    onMove(0);
                },
            },
            {
                title: businessType,
                description: translate('businessInfoStep.businessType'),
                shouldShowRightIcon: true,
                onPress: function () {
                    onMove(1);
                },
            },
            {
                title: businessCategory,
                description: translate('businessInfoStep.businessCategory'),
                shouldShowRightIcon: true,
                onPress: function () {
                    onMove(1);
                },
            },
            {
                title: paymentVolume,
                description: translate('businessInfoStep.annualPaymentVolume'),
                shouldShowRightIcon: true,
                onPress: function () {
                    onMove(2);
                },
            },
            {
                title: tradeVolumeRange,
                description: translate('businessInfoStep.averageReimbursementAmount'),
                shouldShowRightIcon: true,
                onPress: function () {
                    onMove(3);
                },
            },
        ];
    }, [businessCategory, businessType, enableGlobalReimbursementsDraft, onMove, paymentVolume, tradeVolumeRange, translate]);
    return (<ConfirmationStep_1.default isEditing={isEditing} error={error} onNext={onNext} onMove={onMove} pageTitle={translate('businessInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks={false}/>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
