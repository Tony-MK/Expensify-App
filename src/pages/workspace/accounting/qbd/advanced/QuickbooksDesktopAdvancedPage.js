"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var ConnectionLayout_1 = require("@components/ConnectionLayout");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var QuickbooksDesktop_1 = require("@libs/actions/connections/QuickbooksDesktop");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
var ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopAdvancedPage(_a) {
    var _b, _c, _d;
    var policy = _a.policy;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var policyID = policy === null || policy === void 0 ? void 0 : policy.id;
    var qbdConfig = (_c = (_b = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _b === void 0 ? void 0 : _b.quickbooksDesktop) === null || _c === void 0 ? void 0 : _c.config;
    var route = (0, native_1.useRoute)();
    var qbdToggleSettingItems = [
        {
            title: translate('workspace.accounting.autoSync'),
            subtitle: translate('workspace.qbd.advancedConfig.autoSyncDescription'),
            switchAccessibilityLabel: translate('workspace.qbd.advancedConfig.autoSyncDescription'),
            isActive: !!((_d = qbdConfig === null || qbdConfig === void 0 ? void 0 : qbdConfig.autoSync) === null || _d === void 0 ? void 0 : _d.enabled),
            onToggle: function (isOn) {
                if (!policyID) {
                    return;
                }
                (0, QuickbooksDesktop_1.updateQuickbooksDesktopAutoSync)(policyID, isOn);
            },
            subscribedSetting: CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.AUTO_SYNC,
            errors: (0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.AUTO_SYNC),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.AUTO_SYNC], qbdConfig === null || qbdConfig === void 0 ? void 0 : qbdConfig.pendingFields),
        },
        {
            title: translate('workspace.qbd.advancedConfig.createEntities'),
            subtitle: translate('workspace.qbd.advancedConfig.createEntitiesDescription'),
            switchAccessibilityLabel: translate('workspace.qbd.advancedConfig.createEntitiesDescription'),
            isActive: !!(qbdConfig === null || qbdConfig === void 0 ? void 0 : qbdConfig.shouldAutoCreateVendor),
            onToggle: function (isOn) {
                (0, QuickbooksDesktop_1.updateQuickbooksDesktopShouldAutoCreateVendor)(policyID, isOn);
            },
            subscribedSetting: CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR,
            errors: (0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR], qbdConfig === null || qbdConfig === void 0 ? void 0 : qbdConfig.pendingFields),
        },
    ];
    return (<ConnectionLayout_1.default displayName={QuickbooksDesktopAdvancedPage.displayName} headerTitle="workspace.accounting.advanced" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} onBackButtonPress={function () { var _a, _b; return Navigation_1.default.goBack((_b = (_a = route.params) === null || _a === void 0 ? void 0 : _a.backTo) !== null && _b !== void 0 ? _b : ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID)); }}>
            {qbdToggleSettingItems.map(function (item) { return (<ToggleSettingsOptionRow_1.default key={item.title} title={item.title} subtitle={item.subtitle} switchAccessibilityLabel={item.switchAccessibilityLabel} shouldPlaceSubtitleBelowSwitch wrapperStyle={styles.mv3} isActive={item.isActive} onToggle={item.onToggle} pendingAction={item.pendingAction} errors={item.errors} onCloseError={function () { return (0, Policy_1.clearQBDErrorField)(policyID, item.subscribedSetting); }}/>); })}
        </ConnectionLayout_1.default>);
}
QuickbooksDesktopAdvancedPage.displayName = 'QuickbooksDesktopAdvancedPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopAdvancedPage);
