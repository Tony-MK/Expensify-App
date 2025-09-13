"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
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
function NetSuiteInvoiceItemPreferenceSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.netsuite.options.config;
    const route = (0, native_1.useRoute)();
    const { items } = policy?.connections?.netsuite?.options.data ?? {};
    const selectedItem = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedInvoiceItemWithDefaultSelect)(items, config?.invoiceItem), [items, config?.invoiceItem]);
    const selectedValue = Object.values(CONST_1.default.NETSUITE_INVOICE_ITEM_PREFERENCE).find((value) => value === config?.invoiceItemPreference) ?? CONST_1.default.NETSUITE_INVOICE_ITEM_PREFERENCE.CREATE;
    const data = Object.values(CONST_1.default.NETSUITE_INVOICE_ITEM_PREFERENCE).map((postingPreference) => ({
        value: postingPreference,
        text: translate(`workspace.netsuite.invoiceItem.values.${postingPreference}.label`),
        keyForList: postingPreference,
        isSelected: selectedValue === postingPreference,
    }));
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(route.params.backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID)));
    }, [route.params.backTo, policyID]);
    const selectInvoicePreference = (0, react_1.useCallback)((row) => {
        if (row.value !== config?.invoiceItemPreference && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteInvoiceItemPreference)(policyID, row.value, config?.invoiceItemPreference);
        }
        if (row.value === CONST_1.default.NETSUITE_INVOICE_ITEM_PREFERENCE.CREATE) {
            goBack();
        }
    }, [config?.invoiceItemPreference, policyID, goBack]);
    return (<ConnectionLayout_1.default headerTitle="workspace.netsuite.invoiceItem.label" title={`workspace.netsuite.invoiceItem.values.${config?.invoiceItemPreference ?? CONST_1.default.NETSUITE_INVOICE_ITEM_PREFERENCE.CREATE}.description`} titleStyle={[styles.ph5, styles.pb5]} onBackButtonPress={goBack} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteInvoiceItemPreferenceSelectPage.displayName} policyID={policyID} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldUseScrollView={false}>
            <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM_PREFERENCE], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM_PREFERENCE)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM_PREFERENCE)} style={[styles.flexGrow1, styles.flexShrink1]} contentContainerStyle={[styles.flexGrow1, styles.flexShrink1]}>
                <SelectionList_1.default onSelectRow={(selection) => selectInvoicePreference(selection)} sections={[{ data }]} ListItem={RadioListItem_1.default} showScrollIndicator shouldUpdateFocusedIndex initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} containerStyle={[styles.flexReset, styles.flexGrow1, styles.flexShrink1, styles.pb0]}/>
            </OfflineWithFeedback_1.default>
            {config?.invoiceItemPreference === CONST_1.default.NETSUITE_INVOICE_ITEM_PREFERENCE.SELECT && (<react_native_1.View style={[styles.flexGrow1, styles.flexShrink1]}>
                    <OfflineWithFeedback_1.default key={translate('workspace.netsuite.invoiceItem.label')} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM], config?.pendingFields)}>
                        <MenuItemWithTopDescription_1.default description={translate('workspace.netsuite.invoiceItem.label')} title={selectedItem ? selectedItem.name : undefined} interactive shouldShowRightIcon onPress={() => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_SELECT.getRoute(policyID));
            }} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM], config?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                    </OfflineWithFeedback_1.default>
                </react_native_1.View>)}
        </ConnectionLayout_1.default>);
}
NetSuiteInvoiceItemPreferenceSelectPage.displayName = 'NetSuiteInvoiceItemPreferenceSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteInvoiceItemPreferenceSelectPage);
