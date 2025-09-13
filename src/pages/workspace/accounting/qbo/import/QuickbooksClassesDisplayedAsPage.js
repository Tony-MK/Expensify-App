"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline = require("@libs/actions/connections/QuickbooksOnline");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksClassesDisplayedAsPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const data = (0, react_1.useMemo)(() => [
        {
            value: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG,
            text: translate('workspace.common.tags'),
            keyForList: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG,
            isSelected: qboConfig?.syncClasses === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG,
        },
        {
            value: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD,
            text: translate('workspace.common.reportFields'),
            keyForList: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD,
            isSelected: qboConfig?.syncClasses === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD,
        },
    ], [qboConfig?.syncClasses, translate]);
    const selectDisplayedAs = (0, react_1.useCallback)((row) => {
        if (row.value !== qboConfig?.syncClasses) {
            if (row.value === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD && !(0, PolicyUtils_1.isControlPolicy)(policy)) {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.REPORT_FIELDS_FEATURE.qbo.classes, ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CLASSES.getRoute(policyID)));
                return;
            }
            QuickbooksOnline.updateQuickbooksOnlineSyncClasses(policyID, row.value, qboConfig?.syncClasses);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CLASSES.getRoute(policyID));
    }, [qboConfig?.syncClasses, policyID, policy]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksClassesDisplayedAsPage.displayName} sections={data.length ? [{ data }] : []} listItem={RadioListItem_1.default} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CLASSES.getRoute(policyID))} onSelectRow={selectDisplayedAs} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={data.find((item) => item.isSelected)?.keyForList} title="workspace.common.displayedAs" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CLASSES], qboConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CLASSES)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CLASSES)}/>);
}
QuickbooksClassesDisplayedAsPage.displayName = 'QuickbooksClassesDisplayedAsPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksClassesDisplayedAsPage);
