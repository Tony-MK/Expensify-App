"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AmountForm_1 = require("@components/AmountForm");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyDistanceRatesUtils_1 = require("@libs/PolicyDistanceRatesUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const DistanceRate_1 = require("@userActions/Policy/DistanceRate");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PolicyDistanceRateTaxReclaimableOnEditForm_1 = require("@src/types/form/PolicyDistanceRateTaxReclaimableOnEditForm");
function PolicyDistanceRateTaxReclaimableEditPage({ route, policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const policyID = route.params.policyID;
    const rateID = route.params.rateID;
    const customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const rate = customUnit?.rates[rateID];
    const currency = rate?.currency ?? CONST_1.default.CURRENCY.USD;
    const currentTaxReclaimableOnValue = rate?.attributes?.taxClaimablePercentage && rate?.rate ? ((rate.attributes.taxClaimablePercentage * rate.rate) / 100).toFixed(CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES) : '';
    const submitTaxReclaimableOn = (values) => {
        if (values.taxClaimableValue === currentTaxReclaimableOnValue) {
            Navigation_1.default.goBack();
            return;
        }
        if (!customUnit || !rate) {
            return;
        }
        (0, DistanceRate_1.updateDistanceTaxClaimableValue)(policyID, customUnit, [
            {
                ...rate,
                attributes: {
                    ...rate?.attributes,
                    taxClaimablePercentage: rate?.rate ? (Number(values.taxClaimableValue) * 100) / rate.rate : undefined,
                },
            },
        ]);
        Navigation_1.default.goBack();
    };
    const validate = (0, react_1.useCallback)((values) => (0, PolicyDistanceRatesUtils_1.validateTaxClaimableValue)(values, rate), [rate]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={PolicyDistanceRateTaxReclaimableEditPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.taxes.taxReclaimableOn')} shouldShowBackButton/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.POLICY_DISTANCE_RATE_TAX_RECLAIMABLE_ON_EDIT_FORM} submitButtonText={translate('common.save')} onSubmit={submitTaxReclaimableOn} validate={validate} enabledWhenOffline style={[styles.flexGrow1]} shouldHideFixErrorsAlert submitFlexEnabled={false} submitButtonStyles={[styles.mh5, styles.mt0]} addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={AmountForm_1.default} inputID={PolicyDistanceRateTaxReclaimableOnEditForm_1.default.TAX_CLAIMABLE_VALUE} decimals={CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES} defaultValue={currentTaxReclaimableOnValue?.toString() ?? ''} isCurrencyPressable={false} currency={currency} ref={inputCallbackRef}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
PolicyDistanceRateTaxReclaimableEditPage.displayName = 'PolicyDistanceRateTaxReclaimableEditPage';
exports.default = (0, withPolicy_1.default)(PolicyDistanceRateTaxReclaimableEditPage);
