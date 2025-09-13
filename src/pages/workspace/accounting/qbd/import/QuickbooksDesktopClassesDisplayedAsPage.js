"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksDesktop = require("@libs/actions/connections/QuickbooksDesktop");
const ErrorUtils = require("@libs/ErrorUtils");
const PolicyUtils = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopClassesDisplayedAsPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const data = [
        {
            value: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG,
            text: translate('workspace.common.tags'),
            alternateText: translate('workspace.qbd.tagsDisplayedAsDescription'),
            keyForList: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG,
            isSelected: qbdConfig?.mappings?.classes === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG,
        },
        {
            value: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD,
            text: translate('workspace.common.reportFields'),
            alternateText: translate('workspace.qbd.reportFieldsDisplayedAsDescription'),
            keyForList: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD,
            isSelected: qbdConfig?.mappings?.classes === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD,
        },
    ];
    const selectDisplayedAs = (0, react_1.useCallback)((row) => {
        if (row.value !== qbdConfig?.mappings?.classes) {
            QuickbooksDesktop.updateQuickbooksDesktopSyncClasses(policyID, row.value, qbdConfig?.mappings?.classes);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CLASSES.getRoute(policyID));
    }, [qbdConfig?.mappings?.classes, policyID]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksDesktopClassesDisplayedAsPage.displayName} sections={data.length ? [{ data }] : []} listItem={RadioListItem_1.default} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CLASSES.getRoute(policyID))} onSelectRow={selectDisplayedAs} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} title="workspace.common.displayedAs" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} pendingAction={PolicyUtils.settingsPendingAction([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CLASSES], qbdConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CLASSES)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearQBDErrorField)(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CLASSES)} shouldSingleExecuteRowSelect/>);
}
QuickbooksDesktopClassesDisplayedAsPage.displayName = 'QuickbooksDesktopClassesDisplayedAsPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopClassesDisplayedAsPage);
