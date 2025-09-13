"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var RadioListItem_1 = require("@components/SelectionList/RadioListItem");
var SelectionScreen_1 = require("@components/SelectionScreen");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Xero_1 = require("@libs/actions/connections/Xero");
var Policy_1 = require("@libs/actions/Policy/Policy");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
function XeroMapTrackingCategoryConfigurationPage(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var policy = _a.policy;
    var translate = (0, useLocalize_1.default)().translate;
    var route = (0, native_1.useRoute)();
    var params = route.params;
    var styles = (0, useThemeStyles_1.default)();
    var categoryId = (_b = params === null || params === void 0 ? void 0 : params.categoryId) !== null && _b !== void 0 ? _b : '';
    var categoryName = decodeURIComponent((_c = params === null || params === void 0 ? void 0 : params.categoryName) !== null && _c !== void 0 ? _c : '');
    var policyID = policy === null || policy === void 0 ? void 0 : policy.id;
    var config = ((_e = (_d = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _d === void 0 ? void 0 : _d.xero) !== null && _e !== void 0 ? _e : {}).config;
    var trackingCategories = ((_h = (_g = (_f = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _f === void 0 ? void 0 : _f.xero) === null || _g === void 0 ? void 0 : _g.data) !== null && _h !== void 0 ? _h : {}).trackingCategories;
    var mappings = ((_l = (_k = (_j = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _j === void 0 ? void 0 : _j.xero) === null || _k === void 0 ? void 0 : _k.config) !== null && _l !== void 0 ? _l : {}).mappings;
    var currentTrackingCategory = trackingCategories === null || trackingCategories === void 0 ? void 0 : trackingCategories.find(function (category) { return category.id === categoryId; });
    var currentTrackingCategoryValue = currentTrackingCategory ? ((_m = mappings === null || mappings === void 0 ? void 0 : mappings["".concat(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX).concat(currentTrackingCategory.id)]) !== null && _m !== void 0 ? _m : '') : '';
    var reportFieldTrackingCategories = Object.entries(mappings !== null && mappings !== void 0 ? mappings : {}).filter(function (_a) {
        var key = _a[0], value = _a[1];
        return key.startsWith(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX) && value === CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.REPORT_FIELD;
    });
    var optionsList = (0, react_1.useMemo)(function () {
        return Object.values(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS).map(function (option) { return ({
            value: option,
            text: translate("workspace.xero.trackingCategoriesOptions.".concat(option.toUpperCase())),
            keyForList: option,
            isSelected: option === currentTrackingCategoryValue,
        }); });
    }, [translate, currentTrackingCategoryValue]);
    var listHeaderComponent = (0, react_1.useMemo)(function () { return (<react_native_1.View style={[styles.pb2, styles.ph5]}>
                <Text_1.default style={[styles.pb5, styles.textNormal]}>{translate('workspace.xero.mapTrackingCategoryToDescription', { categoryName: categoryName })}</Text_1.default>
            </react_native_1.View>); }, [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal, categoryName]);
    var updateMapping = (0, react_1.useCallback)(function (option) {
        var _a, _b;
        if (option.value !== currentTrackingCategoryValue) {
            if (option.value === CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.REPORT_FIELD && !(0, PolicyUtils_1.isControlPolicy)(policy)) {
                var backToRoute = ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, "".concat(CONST_1.default.REPORT_FIELDS_FEATURE.xero.mapping), ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES.getRoute(policyID));
                Navigation_1.default.navigate("".concat(backToRoute, "&categoryId=").concat(categoryId));
                return;
            }
            if (!policyID) {
                return;
            }
            (0, Xero_1.updateXeroMappings)(policyID, categoryId ? (_a = {}, _a["".concat(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX).concat(categoryId)] = option.value, _a) : {}, categoryId ? (_b = {}, _b["".concat(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX).concat(categoryId)] = currentTrackingCategoryValue, _b) : {});
            if (!reportFieldTrackingCategories.length && option.value === CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.REPORT_FIELD) {
                (0, Policy_1.enablePolicyReportFields)(policyID, true);
            }
            if (reportFieldTrackingCategories.length === 1 && currentTrackingCategoryValue === CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.REPORT_FIELD) {
                (0, Policy_1.enablePolicyReportFields)(policyID, false);
            }
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES.getRoute(policyID));
    }, [categoryId, currentTrackingCategoryValue, reportFieldTrackingCategories, policy, policyID]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={XeroMapTrackingCategoryConfigurationPage.displayName} sections={optionsList.length ? [{ data: optionsList }] : []} listItem={RadioListItem_1.default} onSelectRow={updateMapping} initiallyFocusedOptionKey={(_o = optionsList.find(function (option) { return option.isSelected; })) === null || _o === void 0 ? void 0 : _o.keyForList} headerContent={listHeaderComponent} onBackButtonPress={function () { return Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES.getRoute(policyID)); }} headerTitleAlreadyTranslated={translate('workspace.xero.mapTrackingCategoryTo', { categoryName: categoryName })} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(["".concat(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX).concat(categoryId)], config === null || config === void 0 ? void 0 : config.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config !== null && config !== void 0 ? config : {}, "".concat(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX).concat(categoryId))} errorRowStyles={[styles.ph5, styles.pv3]} onClose={function () { return (0, Policy_1.clearXeroErrorField)(policyID, "".concat(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX).concat(categoryId)); }} shouldSingleExecuteRowSelect/>);
}
XeroMapTrackingCategoryConfigurationPage.displayName = 'XeroMapTrackingCategoryConfigurationPage';
exports.default = (0, withPolicyConnections_1.default)(XeroMapTrackingCategoryConfigurationPage);
