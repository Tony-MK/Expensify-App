"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmModal_1 = require("@components/ConfirmModal");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
function NetSuiteImportCustomFieldView({ policy, route: { params: { importCustomField, valueIndex }, }, }) {
    const policyID = policy?.id;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isRemoveModalOpen, setIsRemoveModalOpen] = (0, react_1.useState)(false);
    const config = policy?.connections?.netsuite?.options?.config;
    const allRecords = (0, react_1.useMemo)(() => config?.syncOptions?.[importCustomField] ?? [], [config?.syncOptions, importCustomField]);
    const customField = allRecords[valueIndex];
    const fieldList = customField && (0, PolicyUtils_1.isNetSuiteCustomSegmentRecord)(customField) ? CONST_1.default.NETSUITE_CONFIG.CUSTOM_SEGMENT_FIELDS : [NetSuiteCustomFieldForm_1.default.LIST_NAME, NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID, NetSuiteCustomFieldForm_1.default.MAPPING];
    const removeRecord = (0, react_1.useCallback)(() => {
        if (!policyID) {
            return;
        }
        if (customField) {
            // We allow multiple custom list records with the same internalID. Hence it is safe to remove by index.
            const filteredRecords = allRecords.filter((_, index) => index !== Number(valueIndex));
            if ((0, PolicyUtils_1.isNetSuiteCustomSegmentRecord)(customField)) {
                (0, NetSuiteCommands_1.updateNetSuiteCustomSegments)(policyID, filteredRecords, allRecords, `${importCustomField}_${valueIndex}`, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            }
            else {
                (0, NetSuiteCommands_1.updateNetSuiteCustomLists)(policyID, filteredRecords, allRecords, `${importCustomField}_${valueIndex}`, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            }
        }
        setIsRemoveModalOpen(false);
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING.getRoute(policyID, importCustomField));
    }, [allRecords, customField, importCustomField, policyID, valueIndex]);
    return (<ConnectionLayout_1.default displayName={NetSuiteImportCustomFieldView.displayName} headerTitleAlreadyTranslated={customField ? (0, PolicyUtils_1.getNameFromNetSuiteCustomField)(customField) : ''} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.flex1]} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={!customField} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING.getRoute(policyID, importCustomField))}>
            {!!customField && (<OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, `${importCustomField}_${valueIndex}`)} errorRowStyles={[styles.ph5, styles.pv3]} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([`${importCustomField}_${valueIndex}`], config?.pendingFields)} onClose={() => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.clearNetSuiteErrorField)(policyID, `${importCustomField}_${valueIndex}`);
                const pendingAction = (0, PolicyUtils_1.settingsPendingAction)([`${importCustomField}_${valueIndex}`], config?.pendingFields);
                if (pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
                    (0, Policy_1.removeNetSuiteCustomFieldByIndex)(allRecords, policyID, importCustomField, valueIndex);
                    Navigation_1.default.goBack();
                }
                (0, Policy_1.clearNetSuitePendingField)(policyID, `${importCustomField}_${valueIndex}`);
            }}>
                    {fieldList.map((fieldName) => {
                const isEditable = !config?.pendingFields?.[importCustomField] && (0, PolicyUtils_1.isNetSuiteCustomFieldPropertyEditable)(customField, fieldName);
                return (<MenuItemWithTopDescription_1.default key={fieldName} description={translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.fields.${fieldName}`)} shouldShowRightIcon={isEditable} title={fieldName === 'mapping'
                        ? translate(`workspace.netsuite.import.importTypes.${customField[fieldName].toUpperCase()}.label`)
                        : customField[fieldName]} onPress={isEditable
                        ? () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_EDIT.getRoute(policyID, importCustomField, valueIndex, fieldName))
                        : undefined}/>);
            })}
                    <MenuItem_1.default icon={Expensicons.Trashcan} title={translate('common.remove')} disabled={!!config?.pendingFields?.[importCustomField]} onPress={() => setIsRemoveModalOpen(true)}/>
                </OfflineWithFeedback_1.default>)}

            <ConfirmModal_1.default title={translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.removeTitle`)} isVisible={isRemoveModalOpen} onConfirm={removeRecord} onCancel={() => setIsRemoveModalOpen(false)} prompt={translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.removePrompt`)} confirmText={translate('common.remove')} cancelText={translate('common.cancel')} danger/>
        </ConnectionLayout_1.default>);
}
NetSuiteImportCustomFieldView.displayName = 'NetSuiteImportCustomFieldView';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteImportCustomFieldView);
