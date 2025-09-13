"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctImportTaxMappingPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const policy = (0, usePolicy_1.default)(route.params.policyID);
    const policyID = policy?.id;
    const { config } = policy?.connections?.intacct ?? {};
    const { pendingFields } = config ?? {};
    const sageIntacctConfig = policy?.connections?.intacct?.config;
    const sageIntacctConfigTaxSolutionID = sageIntacctConfig?.tax?.taxSolutionID;
    const sageIntacctData = policy?.connections?.intacct?.data;
    const selectionOptions = (0, react_1.useMemo)(() => {
        const mappingOptions = [];
        const sageIntacctTaxSolutionIDs = sageIntacctData?.taxSolutionIDs ?? [];
        sageIntacctTaxSolutionIDs.forEach((taxSolutionID) => {
            mappingOptions.push({
                value: taxSolutionID,
                text: taxSolutionID,
                keyForList: taxSolutionID,
                isSelected: sageIntacctConfigTaxSolutionID === taxSolutionID,
            });
        });
        return mappingOptions;
    }, [sageIntacctConfigTaxSolutionID, sageIntacctData?.taxSolutionIDs]);
    const updateMapping = (0, react_1.useCallback)(({ value }) => {
        (0, SageIntacct_1.UpdateSageIntacctTaxSolutionID)(policyID, value);
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT_TAX.getRoute(policyID));
    }, [policyID]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={SageIntacctImportTaxMappingPage.displayName} sections={[{ data: selectionOptions }]} listItem={RadioListItem_1.default} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} onSelectRow={updateMapping} initiallyFocusedOptionKey={selectionOptions.find((option) => option.isSelected)?.keyForList} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT_TAX.getRoute(policyID))} title="workspace.sageIntacct.taxSolution" pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.TAX, CONST_1.default.SAGE_INTACCT_CONFIG.TAX_SOLUTION_ID], pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.SAGE_INTACCT_CONFIG.TAX_SOLUTION_ID)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.TAX_SOLUTION_ID)}/>);
}
SageIntacctImportTaxMappingPage.displayName = 'SageIntacctImportTaxMappingPage';
exports.default = SageIntacctImportTaxMappingPage;
