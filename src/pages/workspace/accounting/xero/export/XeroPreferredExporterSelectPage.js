"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
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
function XeroPreferredExporterSelectPage({ policy }) {
    const { config } = policy?.connections?.xero ?? {};
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyOwner = policy?.owner ?? '';
    const exporters = (0, PolicyUtils_1.getAdminEmployees)(policy);
    const { login: currentUserLogin } = (0, useCurrentUserPersonalDetails_1.default)();
    const policyID = policy?.id;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT.getRoute(policyID)));
    }, [policyID, backTo]);
    const data = (0, react_1.useMemo)(() => {
        if (!(0, isEmpty_1.default)(policyOwner) && (0, isEmpty_1.default)(exporters)) {
            return [
                {
                    value: policyOwner,
                    text: policyOwner,
                    keyForList: policyOwner,
                    isSelected: true,
                },
            ];
        }
        return exporters?.reduce((options, exporter) => {
            if (!exporter.email) {
                return options;
            }
            // Don't show guides if the current user is not a guide themselves or an Expensify employee
            if ((0, PolicyUtils_1.isExpensifyTeam)(exporter.email) && !(0, PolicyUtils_1.isExpensifyTeam)(policyOwner) && !(0, PolicyUtils_1.isExpensifyTeam)(currentUserLogin)) {
                return options;
            }
            options.push({
                value: exporter.email,
                text: exporter.email,
                keyForList: exporter.email,
                isSelected: (config?.export?.exporter ?? policyOwner) === exporter.email,
            });
            return options;
        }, []);
    }, [policyOwner, exporters, currentUserLogin, config?.export?.exporter]);
    const selectExporter = (0, react_1.useCallback)((row) => {
        if (row.value !== config?.export?.exporter && policyID) {
            (0, Xero_1.updateXeroExportExporter)(policyID, row.value, config?.export?.exporter);
        }
        goBack();
    }, [policyID, config?.export?.exporter, goBack]);
    const headerContent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.pb2, styles.ph5]}>
                <Text_1.default style={[styles.pb2, styles.textNormal]}>{translate('workspace.accounting.exportPreferredExporterNote')}</Text_1.default>
                <Text_1.default style={[styles.pb5, styles.textNormal]}>{translate('workspace.accounting.exportPreferredExporterSubNote')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={XeroPreferredExporterSelectPage.displayName} sections={[{ data }]} listItem={RadioListItem_1.default} headerContent={headerContent} onSelectRow={selectExporter} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} onBackButtonPress={goBack} title="workspace.accounting.preferredExporter" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.EXPORTER], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.XERO_CONFIG.EXPORTER)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearXeroErrorField)(policyID, CONST_1.default.XERO_CONFIG.EXPORTER)}/>);
}
XeroPreferredExporterSelectPage.displayName = 'XeroPreferredExporterSelectPage';
exports.default = (0, withPolicyConnections_1.default)(XeroPreferredExporterSelectPage);
