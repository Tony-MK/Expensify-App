"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var ConnectionLayout_1 = require("@components/ConnectionLayout");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
var ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
function SageIntacctAutoSyncPage(_a) {
    var _b, _c, _d, _e, _f;
    var policy = _a.policy;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var policyID = policy === null || policy === void 0 ? void 0 : policy.id;
    var config = (_c = (_b = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _b === void 0 ? void 0 : _b.intacct) === null || _c === void 0 ? void 0 : _c.config;
    var _g = config !== null && config !== void 0 ? config : {}, autoSync = _g.autoSync, pendingFields = _g.pendingFields;
    var accountingMethod = (_e = (_d = config === null || config === void 0 ? void 0 : config.export) === null || _d === void 0 ? void 0 : _d.accountingMethod) !== null && _e !== void 0 ? _e : expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH;
    var pendingAction = (_f = (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC], pendingFields)) !== null && _f !== void 0 ? _f : (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.ACCOUNTING_METHOD], pendingFields);
    var goBack = (0, react_1.useCallback)(function () {
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ADVANCED.getRoute(policyID));
    }, [policyID]);
    return (<ConnectionLayout_1.default displayName={SageIntacctAutoSyncPage.displayName} headerTitle="common.settings" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} onBackButtonPress={goBack}>
            <ToggleSettingsOptionRow_1.default key={translate('workspace.sageIntacct.autoSync')} title={translate('workspace.sageIntacct.autoSync')} subtitle={translate('workspace.sageIntacct.autoSyncDescription')} switchAccessibilityLabel={translate('workspace.sageIntacct.autoSyncDescription')} isActive={!!(autoSync === null || autoSync === void 0 ? void 0 : autoSync.enabled)} wrapperStyle={[styles.pv2, styles.mh5]} shouldPlaceSubtitleBelowSwitch onToggle={function () { return (0, SageIntacct_1.updateSageIntacctAutoSync)(policyID, !(autoSync === null || autoSync === void 0 ? void 0 : autoSync.enabled)); }} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC_ENABLED], pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config !== null && config !== void 0 ? config : {}, CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC_ENABLED)} onCloseError={function () { return (0, Policy_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC_ENABLED); }}/>
            {!!(autoSync === null || autoSync === void 0 ? void 0 : autoSync.enabled) && (<OfflineWithFeedback_1.default pendingAction={pendingAction}>
                    <MenuItemWithTopDescription_1.default title={accountingMethod === expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL
                ? translate("workspace.sageIntacct.accountingMethods.values.".concat(expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL))
                : translate("workspace.sageIntacct.accountingMethods.values.".concat(expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH))} description={translate('workspace.sageIntacct.accountingMethods.label')} shouldShowRightIcon onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ACCOUNTING_METHOD.getRoute(policyID)); }}/>
                </OfflineWithFeedback_1.default>)}
        </ConnectionLayout_1.default>);
}
SageIntacctAutoSyncPage.displayName = 'SageIntacctAutoSyncPage';
exports.default = (0, withPolicyConnections_1.default)(SageIntacctAutoSyncPage);
