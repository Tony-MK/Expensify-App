"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations_1 = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Xero_1 = require("@userActions/connections/Xero");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroBankAccountSelectPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const { config } = policy?.connections?.xero ?? {};
    const { bankAccounts } = policy?.connections?.xero?.data ?? {};
    const xeroSelectorOptions = (0, react_1.useMemo)(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    () => (0, PolicyUtils_1.getXeroBankAccounts)(policy ?? undefined, config?.export?.nonReimbursableAccount || bankAccounts?.[0]?.id), [config?.export?.nonReimbursableAccount, policy, bankAccounts]);
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT.getRoute(policyID)));
    }, [policyID, backTo]);
    const listHeaderComponent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.pb2, styles.ph5]}>
                <Text_1.default style={[styles.pb5, styles.textNormal]}>{translate('workspace.xero.xeroBankAccountDescription')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => xeroSelectorOptions?.find((mode) => mode.isSelected)?.keyForList, [xeroSelectorOptions]);
    const updateBankAccount = (0, react_1.useCallback)(({ value }) => {
        if (initiallyFocusedOptionKey !== value && policyID) {
            (0, Xero_1.updateXeroExportNonReimbursableAccount)(policyID, value, config?.export?.nonReimbursableAccount);
        }
        goBack();
    }, [initiallyFocusedOptionKey, policyID, config?.export?.nonReimbursableAccount, goBack]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations_1.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.xero.noAccountsFound')} subtitle={translate('workspace.xero.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={XeroBankAccountSelectPage.displayName} sections={xeroSelectorOptions.length ? [{ data: xeroSelectorOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateBankAccount} initiallyFocusedOptionKey={initiallyFocusedOptionKey} headerContent={listHeaderComponent} onBackButtonPress={goBack} title="workspace.xero.xeroBankAccount" listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.NON_REIMBURSABLE_ACCOUNT], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.XERO_CONFIG.NON_REIMBURSABLE_ACCOUNT)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearXeroErrorField)(policyID, CONST_1.default.XERO_CONFIG.NON_REIMBURSABLE_ACCOUNT)}/>);
}
XeroBankAccountSelectPage.displayName = 'XeroBankAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(XeroBankAccountSelectPage);
