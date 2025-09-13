"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Xero_1 = require("@userActions/connections/Xero");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroPurchaseBillDateSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const styles = (0, useThemeStyles_1.default)();
    const { config } = policy?.connections?.xero ?? {};
    const data = Object.values(CONST_1.default.XERO_EXPORT_DATE).map((dateType) => ({
        value: dateType,
        text: translate(`workspace.xero.exportDate.values.${dateType}.label`),
        alternateText: translate(`workspace.xero.exportDate.values.${dateType}.description`),
        keyForList: dateType,
        isSelected: config?.export?.billDate === dateType,
    }));
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT.getRoute(policyID)));
    }, [policyID, backTo]);
    const headerContent = (0, react_1.useMemo)(() => (<react_native_1.View>
                <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.xero.exportDate.description')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb5, styles.ph5]);
    const selectExportDate = (0, react_1.useCallback)((row) => {
        if (row.value !== config?.export?.billDate && policyID) {
            (0, Xero_1.updateXeroExportBillDate)(policyID, row.value, config?.export?.billDate);
        }
        goBack();
    }, [config?.export?.billDate, policyID, goBack]);
    return (<SelectionScreen_1.default displayName={XeroPurchaseBillDateSelectPage.displayName} title="workspace.xero.exportDate.label" headerContent={headerContent} sections={[{ data }]} listItem={RadioListItem_1.default} onSelectRow={(selection) => selectExportDate(selection)} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} onBackButtonPress={goBack} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.BILL_DATE], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.XERO_CONFIG.BILL_DATE)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearXeroErrorField)(policyID, CONST_1.default.XERO_CONFIG.BILL_DATE)}/>);
}
XeroPurchaseBillDateSelectPage.displayName = 'XeroPurchaseBillDateSelectPage';
exports.default = (0, withPolicyConnections_1.default)(XeroPurchaseBillDateSelectPage);
