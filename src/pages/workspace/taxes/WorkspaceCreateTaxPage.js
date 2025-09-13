"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AmountPicker_1 = require("@components/AmountPicker");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextPicker_1 = require("@components/TextPicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const TaxRate_1 = require("@libs/actions/TaxRate");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceNewTaxForm_1 = require("@src/types/form/WorkspaceNewTaxForm");
function WorkspaceCreateTaxPage({ policy, route: { params: { policyID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const submitForm = (0, react_1.useCallback)(({ value, ...values }) => {
        const taxRate = {
            ...values,
            value: (0, TaxRate_1.getTaxValueWithPercentage)(value),
            code: (0, TaxRate_1.getNextTaxCode)(values[WorkspaceNewTaxForm_1.default.NAME], policy?.taxRates?.taxes),
        };
        (0, TaxRate_1.createPolicyTax)(policyID, taxRate);
        Navigation_1.default.goBack();
    }, [policy?.taxRates?.taxes, policyID]);
    const validateForm = (0, react_1.useCallback)((values) => {
        if (!policy) {
            return {};
        }
        return {
            ...(0, TaxRate_1.validateTaxName)(policy, values),
            ...(0, TaxRate_1.validateTaxValue)(values),
        };
    }, [policy]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceCreateTaxPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]}>
                <FullPageNotFoundView_1.default shouldShow={(0, PolicyUtils_1.hasAccountingConnections)(policy)} addBottomSafeAreaPadding>
                    <react_native_1.View style={[styles.h100, styles.flex1, styles.justifyContentBetween]}>
                        <HeaderWithBackButton_1.default title={translate('workspace.taxes.addRate')}/>
                        <FormProvider_1.default style={[styles.flexGrow1, styles.mh5]} formID={ONYXKEYS_1.default.FORMS.WORKSPACE_NEW_TAX_FORM} onSubmit={submitForm} validate={validateForm} submitButtonText={translate('common.save')} enabledWhenOffline shouldValidateOnBlur={false} addBottomSafeAreaPadding>
                            <react_native_1.View style={styles.mhn5}>
                                <InputWrapper_1.default InputComponent={TextPicker_1.default} inputID={WorkspaceNewTaxForm_1.default.NAME} label={translate('common.name')} description={translate('common.name')} rightLabel={translate('common.required')} accessibilityLabel={translate('workspace.editor.nameInputLabel')} maxLength={CONST_1.default.TAX_RATES.NAME_MAX_LENGTH} multiline={false} role={CONST_1.default.ROLE.PRESENTATION} required/>
                                <InputWrapper_1.default InputComponent={AmountPicker_1.default} inputID={WorkspaceNewTaxForm_1.default.VALUE} title={(v) => (v ? (0, TaxRate_1.getTaxValueWithPercentage)(v) : '')} description={translate('workspace.taxes.value')} rightLabel={translate('common.required')} decimals={CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES} maxLength={CONST_1.default.MAX_TAX_RATE_INTEGER_PLACES} isSymbolPressable={false} symbol="%" symbolPosition={CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.SUFFIX} autoGrowExtraSpace={variables_1.default.w80} autoGrowMarginSide="left" style={[styles.iouAmountTextInput, styles.textAlignRight]} containerStyle={styles.iouAmountTextInputContainer} touchableInputWrapperStyle={styles.heightUndefined}/>
                            </react_native_1.View>
                        </FormProvider_1.default>
                    </react_native_1.View>
                </FullPageNotFoundView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCreateTaxPage.displayName = 'WorkspaceCreateTaxPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceCreateTaxPage);
