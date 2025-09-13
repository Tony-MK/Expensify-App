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
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const TaxRate_1 = require("@libs/actions/TaxRate");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceTaxNameForm_1 = require("@src/types/form/WorkspaceTaxNameForm");
function NamePage({ route: { params: { policyID, taxID }, }, policy, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const currentTaxRate = (0, PolicyUtils_1.getTaxByID)(policy, taxID);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [name, setName] = (0, react_1.useState)(currentTaxRate?.name ?? '');
    const goBack = (0, react_1.useCallback)(() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_TAX_EDIT.getRoute(policyID, taxID)), [policyID, taxID]);
    const submit = () => {
        const taxName = name.trim();
        // Do not call the API if the edited tax name is the same as the current tag name
        if (currentTaxRate?.name !== taxName && policy?.taxRates?.taxes[taxID]) {
            (0, TaxRate_1.renamePolicyTax)(policyID, taxID, taxName, policy?.taxRates?.taxes[taxID]);
        }
        goBack();
    };
    const validate = (0, react_1.useCallback)((values) => {
        if (!policy) {
            return {};
        }
        if (values[WorkspaceTaxNameForm_1.default.NAME] === currentTaxRate?.name) {
            return {};
        }
        return (0, TaxRate_1.validateTaxName)(policy, values);
    }, [currentTaxRate?.name, policy]);
    if (!currentTaxRate) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={NamePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('common.name')} onBackButtonPress={goBack}/>

                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_TAX_NAME_FORM} submitButtonText={translate('workspace.editor.save')} style={[styles.flexGrow1, styles.ph5]} onSubmit={submit} enabledWhenOffline validate={validate} shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={WorkspaceTaxNameForm_1.default.NAME} label={translate('workspace.editor.nameInputLabel')} accessibilityLabel={translate('workspace.editor.nameInputLabel')} value={name} onChangeText={setName} ref={inputCallbackRef}/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
NamePage.displayName = 'NamePage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(NamePage);
