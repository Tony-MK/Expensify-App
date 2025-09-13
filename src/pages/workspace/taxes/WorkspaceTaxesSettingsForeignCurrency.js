"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TaxPicker_1 = require("@components/TaxPicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const TransactionUtils = require("@libs/TransactionUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceTaxesSettingsForeignCurrency({ route: { params: { policyID }, }, policy, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const foreignTaxDefault = policy?.taxRates?.foreignTaxDefault ?? '';
    const selectedTaxRate = TransactionUtils.getWorkspaceTaxesSettingsName(policy, foreignTaxDefault);
    const submit = (taxes) => {
        (0, Policy_1.setForeignCurrencyDefault)(policyID, taxes.code ?? '');
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_TAXES_SETTINGS.getRoute(policyID));
    };
    const dismiss = () => {
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_TAXES_SETTINGS.getRoute(policyID));
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceTaxesSettingsForeignCurrency.displayName} style={styles.defaultModalContainer}>
                <HeaderWithBackButton_1.default title={translate('workspace.taxes.foreignDefault')}/>

                <react_native_1.View style={[styles.mb4, styles.flex1]}>
                    <TaxPicker_1.default selectedTaxRate={selectedTaxRate} policyID={policyID} onSubmit={submit} onDismiss={dismiss} addBottomSafeAreaPadding/>
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceTaxesSettingsForeignCurrency.displayName = 'WorkspaceTaxesSettingsForeignCurrency';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceTaxesSettingsForeignCurrency);
