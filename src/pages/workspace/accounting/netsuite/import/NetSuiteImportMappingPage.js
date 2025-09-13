"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const RenderHTML_1 = require("@components/RenderHTML");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteImportMappingPage({ policy, route: { params: { importField }, }, }) {
    const policyID = policy?.id ?? '-1';
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const netsuiteConfig = policy?.connections?.netsuite?.options?.config;
    const importMappings = netsuiteConfig?.syncOptions?.mapping;
    const importValue = importMappings?.[importField] ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT;
    const listFooterContent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.ph5, styles.mt3, styles.mb4]}>
                <Text_1.default>{translate(`workspace.netsuite.import.importTypes.${importValue}.footerContent`, { importField })}</Text_1.default>
            </react_native_1.View>), [importField, importValue, styles.mb4, styles.mt3, styles.ph5, translate]);
    const listHeaderComponent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.ph5, styles.pb5]}>
                <react_native_1.View style={[styles.flexRow]}>
                    <RenderHTML_1.default html={`<comment>${Parser_1.default.replace(translate(`workspace.netsuite.import.importFields.${importField}.subtitle`))}</comment>`}/>
                </react_native_1.View>
            </react_native_1.View>), [styles.ph5, styles.pb5, styles.flexRow, translate, importField]);
    const inputOptions = [CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT, CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG, CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD];
    const inputSectionData = inputOptions.map((inputOption) => ({
        text: translate(`workspace.netsuite.import.importTypes.${inputOption}.label`),
        keyForList: inputOption,
        isSelected: importValue === inputOption,
        value: inputOption,
        alternateText: translate(`workspace.netsuite.import.importTypes.${inputOption}.description`),
    }));
    const titleKey = `workspace.netsuite.import.importFields.${importField}.title`;
    const updateImportMapping = (0, react_1.useCallback)(({ value }) => {
        if (value !== importValue) {
            (0, NetSuiteCommands_1.updateNetSuiteImportMapping)(policyID, importField, value, importValue);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT.getRoute(policyID));
    }, [importField, importValue, policyID]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteImportMappingPage.displayName} sections={[{ data: inputSectionData }]} listItem={RadioListItem_1.default} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} onSelectRow={(selection) => updateImportMapping(selection)} initiallyFocusedOptionKey={inputSectionData.find((inputOption) => inputOption.isSelected)?.keyForList} headerContent={listHeaderComponent} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT.getRoute(policyID))} title={titleKey} listFooterContent={listFooterContent} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([importField], netsuiteConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(netsuiteConfig ?? {}, importField)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => Policy.clearNetSuiteErrorField(policyID, importField)}/>);
}
NetSuiteImportMappingPage.displayName = 'NetSuiteImportMappingPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteImportMappingPage);
