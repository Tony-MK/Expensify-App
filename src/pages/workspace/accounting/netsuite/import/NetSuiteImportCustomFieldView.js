"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ConfirmModal_1 = require("@components/ConfirmModal");
var ConnectionLayout_1 = require("@components/ConnectionLayout");
var Expensicons = require("@components/Icon/Expensicons");
var MenuItem_1 = require("@components/MenuItem");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
var Policy_1 = require("@libs/actions/Policy/Policy");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
var NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
function NetSuiteImportCustomFieldView(_a) {
    var _b, _c, _d, _e;
    var policy = _a.policy, _f = _a.route.params, importCustomField = _f.importCustomField, valueIndex = _f.valueIndex;
    var policyID = policy === null || policy === void 0 ? void 0 : policy.id;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var _g = (0, react_1.useState)(false), isRemoveModalOpen = _g[0], setIsRemoveModalOpen = _g[1];
    var config = (_d = (_c = (_b = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _b === void 0 ? void 0 : _b.netsuite) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.config;
    var allRecords = (0, react_1.useMemo)(function () { var _a, _b; return (_b = (_a = config === null || config === void 0 ? void 0 : config.syncOptions) === null || _a === void 0 ? void 0 : _a[importCustomField]) !== null && _b !== void 0 ? _b : []; }, [config === null || config === void 0 ? void 0 : config.syncOptions, importCustomField]);
    var customField = allRecords[valueIndex];
    var fieldList = customField && (0, PolicyUtils_1.isNetSuiteCustomSegmentRecord)(customField) ? CONST_1.default.NETSUITE_CONFIG.CUSTOM_SEGMENT_FIELDS : [NetSuiteCustomFieldForm_1.default.LIST_NAME, NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID, NetSuiteCustomFieldForm_1.default.MAPPING];
    var removeRecord = (0, react_1.useCallback)(function () {
        if (!policyID) {
            return;
        }
        if (customField) {
            // We allow multiple custom list records with the same internalID. Hence it is safe to remove by index.
            var filteredRecords = allRecords.filter(function (_, index) { return index !== Number(valueIndex); });
            if ((0, PolicyUtils_1.isNetSuiteCustomSegmentRecord)(customField)) {
                (0, NetSuiteCommands_1.updateNetSuiteCustomSegments)(policyID, filteredRecords, allRecords, "".concat(importCustomField, "_").concat(valueIndex), CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            }
            else {
                (0, NetSuiteCommands_1.updateNetSuiteCustomLists)(policyID, filteredRecords, allRecords, "".concat(importCustomField, "_").concat(valueIndex), CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            }
        }
        setIsRemoveModalOpen(false);
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING.getRoute(policyID, importCustomField));
    }, [allRecords, customField, importCustomField, policyID, valueIndex]);
    return (<ConnectionLayout_1.default displayName={NetSuiteImportCustomFieldView.displayName} headerTitleAlreadyTranslated={customField ? (0, PolicyUtils_1.getNameFromNetSuiteCustomField)(customField) : ''} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.flex1]} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={!customField} onBackButtonPress={function () { return Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING.getRoute(policyID, importCustomField)); }}>
            {!!customField && (<OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(config !== null && config !== void 0 ? config : {}, "".concat(importCustomField, "_").concat(valueIndex))} errorRowStyles={[styles.ph5, styles.pv3]} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(["".concat(importCustomField, "_").concat(valueIndex)], config === null || config === void 0 ? void 0 : config.pendingFields)} onClose={function () {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.clearNetSuiteErrorField)(policyID, "".concat(importCustomField, "_").concat(valueIndex));
                var pendingAction = (0, PolicyUtils_1.settingsPendingAction)(["".concat(importCustomField, "_").concat(valueIndex)], config === null || config === void 0 ? void 0 : config.pendingFields);
                if (pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
                    (0, Policy_1.removeNetSuiteCustomFieldByIndex)(allRecords, policyID, importCustomField, valueIndex);
                    Navigation_1.default.goBack();
                }
                (0, Policy_1.clearNetSuitePendingField)(policyID, "".concat(importCustomField, "_").concat(valueIndex));
            }}>
                    {fieldList.map(function (fieldName) {
                var _a;
                var isEditable = !((_a = config === null || config === void 0 ? void 0 : config.pendingFields) === null || _a === void 0 ? void 0 : _a[importCustomField]) && (0, PolicyUtils_1.isNetSuiteCustomFieldPropertyEditable)(customField, fieldName);
                return (<MenuItemWithTopDescription_1.default key={fieldName} description={translate("workspace.netsuite.import.importCustomFields.".concat(importCustomField, ".fields.").concat(fieldName))} shouldShowRightIcon={isEditable} title={fieldName === 'mapping'
                        ? translate("workspace.netsuite.import.importTypes.".concat(customField[fieldName].toUpperCase(), ".label"))
                        : customField[fieldName]} onPress={isEditable
                        ? function () { return Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_EDIT.getRoute(policyID, importCustomField, valueIndex, fieldName)); }
                        : undefined}/>);
            })}
                    <MenuItem_1.default icon={Expensicons.Trashcan} title={translate('common.remove')} disabled={!!((_e = config === null || config === void 0 ? void 0 : config.pendingFields) === null || _e === void 0 ? void 0 : _e[importCustomField])} onPress={function () { return setIsRemoveModalOpen(true); }}/>
                </OfflineWithFeedback_1.default>)}

            <ConfirmModal_1.default title={translate("workspace.netsuite.import.importCustomFields.".concat(importCustomField, ".removeTitle"))} isVisible={isRemoveModalOpen} onConfirm={removeRecord} onCancel={function () { return setIsRemoveModalOpen(false); }} prompt={translate("workspace.netsuite.import.importCustomFields.".concat(importCustomField, ".removePrompt"))} confirmText={translate('common.remove')} cancelText={translate('common.cancel')} danger/>
        </ConnectionLayout_1.default>);
}
NetSuiteImportCustomFieldView.displayName = 'NetSuiteImportCustomFieldView';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteImportCustomFieldView);
