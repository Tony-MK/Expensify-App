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
const TaxRate_1 = require("@libs/actions/TaxRate");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceTaxCodeForm_1 = require("@src/types/form/WorkspaceTaxCodeForm");
function WorkspaceTaxCodePage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = route.params.policyID;
    const currentTaxCode = route.params.taxID;
    const policy = (0, usePolicy_1.default)(policyID);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const distanceRateCustomUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const setTaxCode = (0, react_1.useCallback)((values) => {
        const newTaxCode = values.taxCode.trim();
        if (currentTaxCode === newTaxCode) {
            Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_TAX_EDIT.getRoute(policyID, currentTaxCode));
            return;
        }
        if (!policy?.taxRates?.taxes[currentTaxCode]) {
            return;
        }
        (0, TaxRate_1.setPolicyTaxCode)(policyID, currentTaxCode, newTaxCode, policy?.taxRates?.taxes[currentTaxCode], policy?.taxRates?.foreignTaxDefault, policy?.taxRates?.defaultExternalID, distanceRateCustomUnit);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_TAX_EDIT.getRoute(policyID, currentTaxCode));
    }, [currentTaxCode, policyID, policy?.taxRates, distanceRateCustomUnit]);
    const validate = (0, react_1.useCallback)((values) => {
        if (!policy) {
            return {};
        }
        const newTaxCode = values.taxCode.trim();
        if (newTaxCode === currentTaxCode) {
            return {};
        }
        return (0, TaxRate_1.validateTaxCode)(policy, values);
    }, [currentTaxCode, policy]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceTaxCodePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.taxes.taxCode')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_TAX_EDIT.getRoute(policyID, currentTaxCode))}/>

                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_TAX_CODE_FORM} submitButtonText={translate('workspace.editor.save')} style={[styles.flexGrow1, styles.ph5]} onSubmit={setTaxCode} enabledWhenOffline validate={validate} shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={WorkspaceTaxCodeForm_1.default.TAX_CODE} label={translate('workspace.taxes.taxCode')} accessibilityLabel={translate('workspace.taxes.taxCode')} defaultValue={currentTaxCode} ref={inputCallbackRef}/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceTaxCodePage.displayName = 'WorkspaceTaxCodePage';
exports.default = WorkspaceTaxCodePage;
