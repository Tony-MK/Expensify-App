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
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteDateSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const styles = (0, useThemeStyles_1.default)();
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const config = policy?.connections?.netsuite?.options.config;
    const selectedValue = Object.values(CONST_1.default.NETSUITE_EXPORT_DATE).find((value) => value === config?.exportDate) ?? CONST_1.default.NETSUITE_EXPORT_DATE.LAST_EXPENSE;
    const data = Object.values(CONST_1.default.NETSUITE_EXPORT_DATE).map((dateType) => ({
        value: dateType,
        text: translate(`workspace.netsuite.exportDate.values.${dateType}.label`),
        alternateText: translate(`workspace.netsuite.exportDate.values.${dateType}.description`),
        keyForList: dateType,
        isSelected: selectedValue === dateType,
    }));
    const headerContent = (0, react_1.useMemo)(() => (<react_native_1.View>
                <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.netsuite.exportDate.description')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb5, styles.ph5]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID)));
    }, [backTo, policyID]);
    const selectExportDate = (0, react_1.useCallback)((row) => {
        if (row.value !== config?.exportDate && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteExportDate)(policyID, row.value, config?.exportDate);
        }
        goBack();
    }, [config?.exportDate, policyID, goBack]);
    return (<SelectionScreen_1.default displayName={NetSuiteDateSelectPage.displayName} title="workspace.netsuite.exportDate.label" headerContent={headerContent} sections={[{ data }]} listItem={RadioListItem_1.default} onSelectRow={(selection) => selectExportDate(selection)} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} onBackButtonPress={goBack} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.EXPORT_DATE], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.EXPORT_DATE)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.EXPORT_DATE)}/>);
}
NetSuiteDateSelectPage.displayName = 'NetSuiteDateSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteDateSelectPage);
