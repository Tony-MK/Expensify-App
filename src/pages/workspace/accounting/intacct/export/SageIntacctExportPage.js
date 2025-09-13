"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const goBackFromExportConnection_1 = require("@navigation/helpers/goBackFromExportConnection");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctExportPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const route = (0, native_1.useRoute)();
    const backTo = route?.params?.backTo;
    const { export: exportConfig, pendingFields, errorFields } = policy?.connections?.intacct?.config ?? {};
    const shouldGoBackToSpecificRoute = exportConfig?.reimbursable === CONST_1.default.SAGE_INTACCT_REIMBURSABLE_EXPENSE_TYPE.EXPENSE_REPORT;
    const goBack = (0, react_1.useCallback)(() => {
        return (0, goBackFromExportConnection_1.default)(shouldGoBackToSpecificRoute, backTo);
    }, [backTo, shouldGoBackToSpecificRoute]);
    const sections = (0, react_1.useMemo)(() => [
        {
            description: translate('workspace.sageIntacct.preferredExporter'),
            action: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_PREFERRED_EXPORTER.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: exportConfig?.exporter,
            subscribedSettings: [CONST_1.default.SAGE_INTACCT_CONFIG.EXPORTER],
        },
        {
            description: translate('workspace.sageIntacct.exportDate.label'),
            action: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXPORT_DATE.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: exportConfig?.exportDate ? translate(`workspace.sageIntacct.exportDate.values.${exportConfig.exportDate}.label`) : undefined,
            subscribedSettings: [CONST_1.default.SAGE_INTACCT_CONFIG.EXPORT_DATE],
        },
        {
            description: translate('workspace.accounting.exportOutOfPocket'),
            action: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_REIMBURSABLE_EXPENSES.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: exportConfig?.reimbursable ? translate(`workspace.sageIntacct.reimbursableExpenses.values.${exportConfig.reimbursable}`) : undefined,
            subscribedSettings: [CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE, CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE_VENDOR],
        },
        {
            description: translate('workspace.accounting.exportCompanyCard'),
            action: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: exportConfig?.nonReimbursable ? translate(`workspace.sageIntacct.nonReimbursableExpenses.values.${exportConfig.nonReimbursable}`) : undefined,
            subscribedSettings: [
                CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE,
                CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_ACCOUNT,
                exportConfig?.nonReimbursable === CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.VENDOR_BILL
                    ? CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_VENDOR
                    : CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR,
            ],
        },
    ], [exportConfig, policyID, translate]);
    return (<ConnectionLayout_1.default displayName={SageIntacctExportPage.displayName} headerTitle="workspace.accounting.export" headerSubtitle={(0, PolicyUtils_1.getCurrentSageIntacctEntityName)(policy, translate('workspace.common.topLevel'))} title="workspace.sageIntacct.exportDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} onBackButtonPress={goBack} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT}>
            {sections.map((section) => (<OfflineWithFeedback_1.default key={section.description} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(section.subscribedSettings, pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={section.title} description={section.description} shouldShowRightIcon onPress={section.action} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(section.subscribedSettings, errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>))}
        </ConnectionLayout_1.default>);
}
SageIntacctExportPage.displayName = 'SageIntacctExportPage';
exports.default = (0, withPolicyConnections_1.default)(SageIntacctExportPage);
