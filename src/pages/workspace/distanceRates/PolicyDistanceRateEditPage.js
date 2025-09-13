"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AmountForm_1 = require("@components/AmountForm");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyDistanceRatesUtils_1 = require("@libs/PolicyDistanceRatesUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const DistanceRate_1 = require("@userActions/Policy/DistanceRate");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PolicyDistanceRateEditForm_1 = require("@src/types/form/PolicyDistanceRateEditForm");
function PolicyDistanceRateEditPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, toLocaleDigit } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const policyID = route.params.policyID;
    const rateID = route.params.rateID;
    const policy = (0, usePolicy_1.default)(policyID);
    const customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const rate = customUnit?.rates[rateID];
    const currency = rate?.currency ?? CONST_1.default.CURRENCY.USD;
    const currentRateValue = (parseFloat((rate?.rate ?? 0).toString()) / CONST_1.default.POLICY.CUSTOM_UNIT_RATE_BASE_OFFSET).toFixed(CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES);
    const submitRate = (values) => {
        if (currentRateValue === values.rate) {
            Navigation_1.default.goBack();
            return;
        }
        if (!customUnit || !rate) {
            return;
        }
        (0, DistanceRate_1.updatePolicyDistanceRateValue)(policyID, customUnit, [{ ...rate, rate: Number(values.rate) * CONST_1.default.POLICY.CUSTOM_UNIT_RATE_BASE_OFFSET }]);
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.goBack();
    };
    const validate = (0, react_1.useCallback)((values) => (0, PolicyDistanceRatesUtils_1.validateRateValue)(values, customUnit?.rates ?? {}, toLocaleDigit, rate?.rate), [toLocaleDigit, customUnit?.rates, rate?.rate]);
    if (!rate) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={PolicyDistanceRateEditPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.distanceRates.rate')} shouldShowBackButton onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.POLICY_DISTANCE_RATE_EDIT_FORM} submitButtonText={translate('common.save')} onSubmit={submitRate} validate={validate} enabledWhenOffline style={[styles.flexGrow1]} shouldHideFixErrorsAlert submitFlexEnabled={false} submitButtonStyles={[styles.mh5, styles.mt0]} addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={AmountForm_1.default} inputID={PolicyDistanceRateEditForm_1.default.RATE} decimals={CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES} defaultValue={currentRateValue} isCurrencyPressable={false} currency={currency} ref={inputCallbackRef}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
PolicyDistanceRateEditPage.displayName = 'PolicyDistanceRateEditPage';
exports.default = PolicyDistanceRateEditPage;
