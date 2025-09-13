"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Xero_1 = require("@libs/actions/connections/Xero");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
var ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
function XeroAutoSyncPage(_a) {
    var _b, _c, _d, _e, _f;
    var policy = _a.policy, route = _a.route;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var policyID = policy === null || policy === void 0 ? void 0 : policy.id;
    var config = (_c = (_b = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _b === void 0 ? void 0 : _b.xero) === null || _c === void 0 ? void 0 : _c.config;
    var _g = config !== null && config !== void 0 ? config : {}, autoSync = _g.autoSync, pendingFields = _g.pendingFields;
    var backTo = route.params.backTo;
    var accountingMethod = (_e = (_d = config === null || config === void 0 ? void 0 : config.export) === null || _d === void 0 ? void 0 : _d.accountingMethod) !== null && _e !== void 0 ? _e : expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH;
    var pendingAction = (_f = (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.AUTO_SYNC], pendingFields)) !== null && _f !== void 0 ? _f : (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.ACCOUNTING_METHOD], pendingFields);
    var goBack = (0, react_1.useCallback)(function () {
        Navigation_1.default.goBack(backTo !== null && backTo !== void 0 ? backTo : ROUTES_1.default.POLICY_ACCOUNTING_XERO_ADVANCED.getRoute(policyID));
    }, [policyID, backTo]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} style={[styles.defaultModalContainer]} testID={XeroAutoSyncPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('common.settings')} onBackButtonPress={goBack}/>
                <ToggleSettingsOptionRow_1.default key={translate('workspace.accounting.autoSync')} title={translate('workspace.accounting.autoSync')} subtitle={translate('workspace.xero.advancedConfig.autoSyncDescription')} switchAccessibilityLabel={translate('workspace.xero.advancedConfig.autoSyncDescription')} isActive={!!(autoSync === null || autoSync === void 0 ? void 0 : autoSync.enabled)} wrapperStyle={[styles.pv2, styles.mh5]} shouldPlaceSubtitleBelowSwitch onToggle={function () {
            var _a;
            return (0, Xero_1.updateXeroAutoSync)(policyID, {
                enabled: !(autoSync === null || autoSync === void 0 ? void 0 : autoSync.enabled),
            }, { enabled: (_a = autoSync === null || autoSync === void 0 ? void 0 : autoSync.enabled) !== null && _a !== void 0 ? _a : undefined });
        }} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.ENABLED], pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config !== null && config !== void 0 ? config : {}, CONST_1.default.XERO_CONFIG.ENABLED)} onCloseError={function () { return (0, Policy_1.clearXeroErrorField)(policyID, CONST_1.default.XERO_CONFIG.ENABLED); }}/>
                {!!(autoSync === null || autoSync === void 0 ? void 0 : autoSync.enabled) && (<OfflineWithFeedback_1.default pendingAction={pendingAction}>
                        <MenuItemWithTopDescription_1.default title={accountingMethod === expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL
                ? translate("workspace.xero.accountingMethods.values.".concat(expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL))
                : translate("workspace.xero.accountingMethods.values.".concat(expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH))} description={translate('workspace.xero.accountingMethods.label')} shouldShowRightIcon onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_ACCOUNTING_METHOD.getRoute(policyID, backTo)); }}/>
                    </OfflineWithFeedback_1.default>)}
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
XeroAutoSyncPage.displayName = 'XeroAutoSyncPage';
exports.default = (0, withPolicyConnections_1.default)(XeroAutoSyncPage);
