"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctMappingsTypePage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const mappingName = route.params.mapping;
    const policy = (0, usePolicy_1.default)(route.params.policyID);
    const policyID = policy?.id ?? '-1';
    const { config } = policy?.connections?.intacct ?? {};
    const { mappings, pendingFields, export: exportConfig } = config ?? {};
    const selectionOptions = (0, react_1.useMemo)(() => {
        const mappingOptions = [];
        if (![CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.CUSTOMERS, CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.PROJECTS].includes(mappingName) &&
            exportConfig?.reimbursable !== CONST_1.default.SAGE_INTACCT_REIMBURSABLE_EXPENSE_TYPE.VENDOR_BILL) {
            mappingOptions.push({
                value: CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT,
                text: translate('workspace.intacct.employeeDefault'),
                alternateText: translate('workspace.common.appliedOnExport'),
                keyForList: CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT,
                isSelected: mappings?.[mappingName] === CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT,
            });
        }
        mappingOptions.push(...[
            {
                value: CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.TAG,
                text: translate('workspace.common.tags'),
                alternateText: translate('workspace.common.lineItemLevel'),
                keyForList: CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.TAG,
                isSelected: mappings?.[mappingName] === CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.TAG,
            },
            {
                value: CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.REPORT_FIELD,
                text: translate('workspace.common.reportFields'),
                alternateText: translate('workspace.common.reportLevel'),
                keyForList: CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.REPORT_FIELD,
                isSelected: mappings?.[mappingName] === CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.REPORT_FIELD,
            },
        ]);
        return mappingOptions;
    }, [exportConfig?.reimbursable, mappingName, mappings, translate]);
    const updateMapping = (0, react_1.useCallback)(({ value }) => {
        (0, SageIntacct_1.updateSageIntacctMappingValue)(policyID, mappingName, value, mappings?.[mappingName]);
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_TOGGLE_MAPPINGS.getRoute(policyID, mappingName));
    }, [mappingName, policyID, mappings]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={SageIntacctMappingsTypePage.displayName} sections={[{ data: selectionOptions }]} listItem={RadioListItem_1.default} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} onSelectRow={updateMapping} initiallyFocusedOptionKey={mappings?.[mappingName]} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_TOGGLE_MAPPINGS.getRoute(policyID, mappingName))} title="workspace.common.displayedAs" pendingAction={(0, PolicyUtils_1.settingsPendingAction)([mappingName], pendingFields)} errors={ErrorUtils.getLatestErrorField(config ?? {}, mappingName)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => Policy.clearSageIntacctErrorField(policyID, mappingName)}/>);
}
SageIntacctMappingsTypePage.displayName = 'SageIntacctMappingsTypePage';
exports.default = SageIntacctMappingsTypePage;
