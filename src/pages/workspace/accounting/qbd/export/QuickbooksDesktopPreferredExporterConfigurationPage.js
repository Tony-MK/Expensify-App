"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksDesktop_1 = require("@libs/actions/connections/QuickbooksDesktop");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopPreferredExporterConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const exporters = (0, PolicyUtils_1.getAdminEmployees)(policy);
    const { login: currentUserLogin } = (0, useCurrentUserPersonalDetails_1.default)();
    const currentExporter = qbdConfig?.export?.exporter;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const policyID = policy?.id;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT.getRoute(policyID));
    }, [policyID, backTo]);
    const data = (0, react_1.useMemo)(() => exporters?.reduce((options, exporter) => {
        if (!exporter.email) {
            return options;
        }
        // Don't show guides if the current user is not a guide themselves or an Expensify employee
        if ((0, PolicyUtils_1.isExpensifyTeam)(exporter.email) && !(0, PolicyUtils_1.isExpensifyTeam)(policy?.owner) && !(0, PolicyUtils_1.isExpensifyTeam)(currentUserLogin)) {
            return options;
        }
        options.push({
            value: exporter.email,
            text: exporter.email,
            keyForList: exporter.email,
            // We use the logical OR (||) here instead of ?? because `exporter` could be an empty string
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            isSelected: (currentExporter || policy?.owner) === exporter.email,
        });
        return options;
    }, []), [exporters, policy?.owner, currentUserLogin, currentExporter]);
    const selectExporter = (0, react_1.useCallback)((row) => {
        if (!policyID) {
            return;
        }
        if (row.value !== currentExporter) {
            (0, QuickbooksDesktop_1.updateQuickbooksDesktopPreferredExporter)(policyID, row.value, currentExporter);
        }
        goBack();
    }, [currentExporter, goBack, policyID]);
    const headerContent = (0, react_1.useMemo)(() => (<>
                <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.accounting.exportPreferredExporterNote')}</Text_1.default>
                <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.accounting.exportPreferredExporterSubNote')}</Text_1.default>
            </>), [translate, styles.ph5, styles.pb5]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksDesktopPreferredExporterConfigurationPage.displayName} sections={[{ data }]} listItem={RadioListItem_1.default} headerContent={headerContent} onBackButtonPress={goBack} onSelectRow={selectExporter} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} title="workspace.accounting.preferredExporter" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORTER], qbdConfig?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORTER)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => {
            if (!policyID) {
                return;
            }
            (0, Policy_1.clearQBDErrorField)(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORTER);
        }}/>);
}
QuickbooksDesktopPreferredExporterConfigurationPage.displayName = 'QuickbooksDesktopPreferredExporterConfigurationPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopPreferredExporterConfigurationPage);
