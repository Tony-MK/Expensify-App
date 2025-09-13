"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AmountForm_1 = require("@components/AmountForm");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PolicyDistanceRatesUtils_1 = require("@libs/PolicyDistanceRatesUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const DistanceRate_1 = require("@userActions/Policy/DistanceRate");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PolicyCreateDistanceRateForm_1 = require("@src/types/form/PolicyCreateDistanceRateForm");
function CreateDistanceRatePage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, toLocaleDigit } = (0, useLocalize_1.default)();
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const currency = policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    const customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const customUnitID = customUnit?.customUnitID;
    const customUnitRateID = (0, Policy_1.generateCustomUnitID)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const FullPageBlockingView = !customUnitID ? FullPageOfflineBlockingView_1.default : react_native_1.View;
    const validate = (0, react_1.useCallback)((values) => (0, PolicyDistanceRatesUtils_1.validateRateValue)(values, customUnit?.rates ?? {}, toLocaleDigit), [toLocaleDigit, customUnit?.rates]);
    const submit = (values) => {
        // A blocking view is shown when customUnitID is undefined, so this function should never be called
        if (!customUnitID) {
            return;
        }
        const newRate = {
            currency,
            name: (0, PolicyDistanceRatesUtils_1.getOptimisticRateName)(customUnit?.rates ?? {}),
            rate: parseFloat(values.rate) * CONST_1.default.POLICY.CUSTOM_UNIT_RATE_BASE_OFFSET,
            customUnitRateID,
            enabled: true,
        };
        (0, DistanceRate_1.createPolicyDistanceRate)(policyID, customUnitID, newRate);
        Navigation_1.default.goBack();
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={CreateDistanceRatePage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.distanceRates.addRate')}/>
                <FullPageBlockingView style={[styles.flexGrow1]}>
                    <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.POLICY_CREATE_DISTANCE_RATE_FORM} submitButtonText={translate('common.save')} onSubmit={submit} validate={validate} enabledWhenOffline style={[styles.flexGrow1]} shouldHideFixErrorsAlert submitFlexEnabled={false} submitButtonStyles={[styles.mh5, styles.mt0]} addBottomSafeAreaPadding>
                        <InputWrapper_1.default InputComponent={AmountForm_1.default} inputID={PolicyCreateDistanceRateForm_1.default.RATE} decimals={CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES} isCurrencyPressable={false} currency={currency} ref={inputCallbackRef}/>
                    </FormProvider_1.default>
                </FullPageBlockingView>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CreateDistanceRatePage.displayName = 'CreateDistanceRatePage';
exports.default = CreateDistanceRatePage;
