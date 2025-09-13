"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("expensify-common/dist/CONST");
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const PushRowWithModal_1 = require("@components/PushRowWithModal");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const CONST_2 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { FORMATION_INCORPORATION_COUNTRY_CODE, FORMATION_INCORPORATION_STATE, COMPANY_COUNTRY_CODE, COMPANY_STATE } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const STEP_FIELDS = [FORMATION_INCORPORATION_COUNTRY_CODE, FORMATION_INCORPORATION_STATE];
const PROVINCES_LIST_OPTIONS = Object.keys(CONST_1.CONST.PROVINCES).reduce((acc, key) => {
    acc[CONST_1.CONST.PROVINCES[key].provinceISO] = CONST_1.CONST.PROVINCES[key].provinceName;
    return acc;
}, {});
const STATES_LIST_OPTIONS = Object.keys(CONST_1.CONST.STATES).reduce((acc, key) => {
    acc[CONST_1.CONST.STATES[key].stateISO] = CONST_1.CONST.STATES[key].stateName;
    return acc;
}, {});
const isCountryWithSelectableState = (countryCode) => countryCode === CONST_2.default.COUNTRY.US || countryCode === CONST_2.default.COUNTRY.CA;
function IncorporationLocation({ onNext, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const onyxValues = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)({ FORMATION_INCORPORATION_COUNTRY_CODE, FORMATION_INCORPORATION_STATE, COMPANY_COUNTRY: COMPANY_COUNTRY_CODE, COMPANY_STATE }, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const incorporationCountryInitialValue = onyxValues[FORMATION_INCORPORATION_COUNTRY_CODE] !== '' ? onyxValues[FORMATION_INCORPORATION_COUNTRY_CODE] : onyxValues[COMPANY_COUNTRY_CODE];
    const businessAddressStateDefaultValue = isCountryWithSelectableState(onyxValues[COMPANY_COUNTRY_CODE]) ? onyxValues[COMPANY_STATE] : '';
    const incorporationStateInitialValue = onyxValues[FORMATION_INCORPORATION_STATE] !== '' ? onyxValues[FORMATION_INCORPORATION_STATE] : businessAddressStateDefaultValue;
    const [selectedCountry, setSelectedCountry] = (0, react_1.useState)(incorporationCountryInitialValue);
    const [selectedState, setSelectedState] = (0, react_1.useState)(incorporationStateInitialValue);
    const shouldGatherState = isCountryWithSelectableState(selectedCountry);
    const validate = (0, react_1.useCallback)((values) => {
        return (0, ValidationUtils_1.getFieldRequiredErrors)(values, shouldGatherState ? STEP_FIELDS : [FORMATION_INCORPORATION_COUNTRY_CODE]);
    }, [shouldGatherState]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: true,
    });
    const handleSelectingCountry = (country) => {
        setSelectedCountry(typeof country === 'string' ? country : '');
        setSelectedState('');
    };
    const handleSelectingState = (state) => {
        setSelectedState(typeof state === 'string' ? state : '');
    };
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmit} validate={validate} style={[styles.flexGrow1]} submitButtonStyles={[styles.mh5]} shouldHideFixErrorsAlert={!shouldGatherState}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3]}>{translate('businessInfoStep.whereWasTheBusinessIncorporated')}</Text_1.default>
            {shouldGatherState && (<InputWrapper_1.default InputComponent={PushRowWithModal_1.default} optionsList={selectedCountry === CONST_2.default.COUNTRY.US ? STATES_LIST_OPTIONS : PROVINCES_LIST_OPTIONS} description={translate('businessInfoStep.incorporationState')} modalHeaderTitle={translate('businessInfoStep.selectIncorporationState')} searchInputTitle={translate('businessInfoStep.findIncorporationState')} inputID={FORMATION_INCORPORATION_STATE} shouldSaveDraft={!isEditing} value={selectedState} onValueChange={handleSelectingState}/>)}
            <InputWrapper_1.default InputComponent={PushRowWithModal_1.default} optionsList={CONST_2.default.ALL_COUNTRIES} onValueChange={handleSelectingCountry} description={translate('businessInfoStep.incorporationCountry')} modalHeaderTitle={translate('countryStep.selectCountry')} searchInputTitle={translate('countryStep.findCountry')} inputID={FORMATION_INCORPORATION_COUNTRY_CODE} shouldSaveDraft={!isEditing} defaultValue={incorporationCountryInitialValue}/>
        </FormProvider_1.default>);
}
IncorporationLocation.displayName = 'IncorporationLocation';
exports.default = IncorporationLocation;
