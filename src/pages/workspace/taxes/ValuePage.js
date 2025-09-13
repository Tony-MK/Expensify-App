"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const NumberWithSymbolForm_1 = require("@components/NumberWithSymbolForm");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const TaxRate_1 = require("@libs/actions/TaxRate");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceTaxValueForm_1 = require("@src/types/form/WorkspaceTaxValueForm");
function ValuePage({ route: { params: { policyID, taxID }, }, policy, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const currentTaxRate = (0, PolicyUtils_1.getTaxByID)(policy, taxID);
    const defaultValue = currentTaxRate?.value?.replace('%', '');
    const goBack = (0, react_1.useCallback)(() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_TAX_EDIT.getRoute(policyID, taxID)), [policyID, taxID]);
    const submit = (0, react_1.useCallback)((values) => {
        if (defaultValue === values.value || !policy?.taxRates?.taxes[taxID]) {
            goBack();
            return;
        }
        (0, TaxRate_1.updatePolicyTaxValue)(policyID, taxID, Number(values.value), policy?.taxRates?.taxes[taxID]);
        goBack();
    }, [defaultValue, policyID, taxID, policy?.taxRates, goBack]);
    if (!currentTaxRate) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={ValuePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.taxes.value')} onBackButtonPress={goBack}/>

                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_TAX_VALUE_FORM} submitButtonText={translate('workspace.editor.save')} style={[styles.flexGrow1]} scrollContextEnabled validate={TaxRate_1.validateTaxValue} onSubmit={submit} enabledWhenOffline shouldHideFixErrorsAlert submitFlexEnabled={false} submitButtonStyles={[styles.mh5, styles.mt0]} addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={NumberWithSymbolForm_1.default} inputID={WorkspaceTaxValueForm_1.default.VALUE} defaultValue={defaultValue} decimals={CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES} 
    // We increase the amount max length to support the extra decimals.
    maxLength={CONST_1.default.MAX_TAX_RATE_INTEGER_PLACES} symbol="%" symbolPosition={CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.SUFFIX} ref={inputCallbackRef} autoGrowExtraSpace={variables_1.default.w80} isSymbolPressable={false} autoGrowMarginSide="left" style={[styles.iouAmountTextInput, styles.textAlignRight]} containerStyle={styles.iouAmountTextInputContainer}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ValuePage.displayName = 'ValuePage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(ValuePage);
