"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var react_native_1 = require("react-native");
var RadioListItem_1 = require("@components/SelectionList/RadioListItem");
var SelectionScreen_1 = require("@components/SelectionScreen");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Xero_1 = require("@libs/actions/connections/Xero");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
function XeroAccountingMethodPage(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var policy = _a.policy, route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var policyID = policy === null || policy === void 0 ? void 0 : policy.id;
    var backTo = route.params.backTo;
    var styles = (0, useThemeStyles_1.default)();
    var config = (_c = (_b = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _b === void 0 ? void 0 : _b.xero) === null || _c === void 0 ? void 0 : _c.config;
    var accountingMethod = (_e = (_d = config === null || config === void 0 ? void 0 : config.export) === null || _d === void 0 ? void 0 : _d.accountingMethod) !== null && _e !== void 0 ? _e : expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH;
    var data = Object.values(expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD).map(function (accountingMethodType) { return ({
        value: accountingMethodType,
        text: translate("workspace.xero.accountingMethods.values.".concat(accountingMethodType)),
        alternateText: translate("workspace.xero.accountingMethods.alternateText.".concat(accountingMethodType)),
        keyForList: accountingMethodType,
        isSelected: accountingMethod === accountingMethodType,
    }); });
    var pendingAction = (_f = (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.AUTO_SYNC], config === null || config === void 0 ? void 0 : config.pendingFields)) !== null && _f !== void 0 ? _f : (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.ACCOUNTING_METHOD], config === null || config === void 0 ? void 0 : config.pendingFields);
    var headerContent = (0, react_1.useMemo)(function () { return (<react_native_1.View>
                <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.xero.accountingMethods.description')}</Text_1.default>
            </react_native_1.View>); }, [translate, styles.pb5, styles.ph5]);
    var selectExpenseReportApprovalLevel = (0, react_1.useCallback)(function (row) {
        if (row.value !== accountingMethod) {
            (0, Xero_1.updateXeroAccountingMethod)(policyID, row.value, accountingMethod);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_XERO_AUTO_SYNC.getRoute(policyID, backTo));
    }, [accountingMethod, policyID, backTo]);
    return (<SelectionScreen_1.default displayName={XeroAccountingMethodPage.displayName} headerTitleAlreadyTranslated={translate('workspace.xero.accountingMethods.label')} headerContent={headerContent} sections={[{ data: data }]} listItem={RadioListItem_1.default} onSelectRow={function (selection) { return selectExpenseReportApprovalLevel(selection); }} initiallyFocusedOptionKey={(_g = data.find(function (mode) { return mode.isSelected; })) === null || _g === void 0 ? void 0 : _g.keyForList} policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} onBackButtonPress={function () { return Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_XERO_AUTO_SYNC.getRoute(policyID, backTo)); }} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO} pendingAction={pendingAction} shouldBeBlocked={!((_h = config === null || config === void 0 ? void 0 : config.autoSync) === null || _h === void 0 ? void 0 : _h.enabled)}/>);
}
XeroAccountingMethodPage.displayName = 'XeroAccountingMethodPage';
exports.default = (0, withPolicyConnections_1.default)(XeroAccountingMethodPage);
