"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const DistanceRate_1 = require("@userActions/Policy/DistanceRate");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PolicyDistanceRateNameEditForm_1 = require("@src/types/form/PolicyDistanceRateNameEditForm");
function PolicyDistanceRateNameEditPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const policyID = route.params.policyID;
    const rateID = route.params.rateID;
    const policy = (0, usePolicy_1.default)(policyID);
    const customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const rate = customUnit?.rates[rateID];
    const currentRateName = rate?.name;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const newRateName = values.rateName.trim();
        if (!newRateName) {
            errors.rateName = translate('workspace.distanceRates.errors.rateNameRequired');
        }
        else if (Object.values(customUnit?.rates ?? {}).some((r) => r.name === newRateName) && currentRateName !== newRateName) {
            errors.rateName = translate('workspace.distanceRates.errors.existingRateName');
        }
        else if ([...newRateName].length > CONST_1.default.TAX_RATES.NAME_MAX_LENGTH) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16 code units.
            errors.rateName = translate('common.error.characterLimitExceedCounter', { length: [...newRateName].length, limit: CONST_1.default.TAX_RATES.NAME_MAX_LENGTH });
        }
        return errors;
    }, [customUnit, currentRateName, translate]);
    const submit = (0, react_1.useCallback)((values) => {
        if (!customUnit || !rate) {
            return;
        }
        if (currentRateName === values.rateName) {
            Navigation_1.default.goBack();
            return;
        }
        (0, DistanceRate_1.updatePolicyDistanceRateName)(policyID, customUnit, [{ ...rate, name: values.rateName }]);
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.goBack();
    }, [currentRateName, customUnit, rate, policyID]);
    if (!rate) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={PolicyDistanceRateNameEditPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('common.name')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.POLICY_DISTANCE_RATE_NAME_EDIT_FORM} onSubmit={submit} submitButtonText={translate('common.save')} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    validate={validate} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default ref={inputCallbackRef} InputComponent={TextInput_1.default} defaultValue={currentRateName} label={translate('common.name')} accessibilityLabel={translate('common.name')} inputID={PolicyDistanceRateNameEditForm_1.default.RATE_NAME} role={CONST_1.default.ROLE.PRESENTATION}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
PolicyDistanceRateNameEditPage.displayName = 'PolicyDistanceRateNameEditPage';
exports.default = PolicyDistanceRateNameEditPage;
