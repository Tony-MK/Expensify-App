"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteImportCustomersOrProjectSelectPage({ policy }) {
    const policyID = policy?.id ?? '-1';
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const netsuiteConfig = policy?.connections?.netsuite?.options?.config;
    const importMappings = netsuiteConfig?.syncOptions?.mapping;
    const importCustomer = importMappings?.customers ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT;
    const importJobs = importMappings?.jobs ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT;
    const importedValue = importMappings?.customers !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT ? importCustomer : importJobs;
    const inputOptions = [CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG, CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD];
    const inputSectionData = inputOptions.map((inputOption) => ({
        text: translate(`workspace.netsuite.import.importTypes.${inputOption}.label`),
        keyForList: inputOption,
        isSelected: importedValue === inputOption,
        value: inputOption,
        alternateText: translate(`workspace.netsuite.import.importTypes.${inputOption}.description`),
    }));
    const updateImportMapping = (0, react_1.useCallback)(({ value }) => {
        if (value !== importedValue) {
            (0, NetSuiteCommands_1.updateNetSuiteCustomersJobsMapping)(policyID, {
                customersMapping: importCustomer !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT ? value : CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT,
                jobsMapping: importJobs !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT ? value : CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT,
            }, {
                customersMapping: importMappings?.customers,
                jobsMapping: importMappings?.jobs,
            });
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS.getRoute(policyID));
    }, [importCustomer, importJobs, importMappings?.customers, importMappings?.jobs, importedValue, policyID]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteImportCustomersOrProjectSelectPage.displayName} sections={[{ data: inputSectionData }]} listItem={RadioListItem_1.default} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} onSelectRow={(selection) => updateImportMapping(selection)} initiallyFocusedOptionKey={inputSectionData.find((inputOption) => inputOption.isSelected)?.keyForList} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS.getRoute(policyID))} title="workspace.common.displayedAs" errors={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS], netsuiteConfig?.errorFields)
            ? ErrorUtils.getLatestErrorField(netsuiteConfig ?? {}, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS)
            : ErrorUtils.getLatestErrorField(netsuiteConfig ?? {}, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS)} errorRowStyles={[styles.ph5, styles.pv3]} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS], netsuiteConfig?.pendingFields)} onClose={() => {
            Policy.clearNetSuiteErrorField(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS);
            Policy.clearNetSuiteErrorField(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS);
        }}/>);
}
NetSuiteImportCustomersOrProjectSelectPage.displayName = 'NetSuiteImportCustomersOrProjectSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteImportCustomersOrProjectSelectPage);
