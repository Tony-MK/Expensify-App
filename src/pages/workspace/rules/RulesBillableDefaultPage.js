"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var RenderHTML_1 = require("@components/RenderHTML");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SelectionList_1 = require("@components/SelectionList");
var RadioListItem_1 = require("@components/SelectionList/RadioListItem");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useLocalize_1 = require("@hooks/useLocalize");
var usePolicy_1 = require("@hooks/usePolicy");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
function RulesBillableDefaultPage(_a) {
    var policyID = _a.route.params.policyID;
    var policy = (0, usePolicy_1.default)(policyID);
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var environmentURL = (0, useEnvironment_1.default)().environmentURL;
    var billableModes = [
        {
            value: true,
            text: translate("workspace.rules.individualExpenseRules.billable"),
            alternateText: translate("workspace.rules.individualExpenseRules.billableDescription"),
            keyForList: CONST_1.default.POLICY_BILLABLE_MODES.BILLABLE,
            isSelected: policy === null || policy === void 0 ? void 0 : policy.defaultBillable,
        },
        {
            value: false,
            text: translate("workspace.rules.individualExpenseRules.nonBillable"),
            alternateText: translate("workspace.rules.individualExpenseRules.nonBillableDescription"),
            keyForList: CONST_1.default.POLICY_BILLABLE_MODES.NON_BILLABLE,
            isSelected: !(policy === null || policy === void 0 ? void 0 : policy.defaultBillable),
        },
    ];
    var initiallyFocusedOptionKey = (policy === null || policy === void 0 ? void 0 : policy.defaultBillable) ? CONST_1.default.POLICY_BILLABLE_MODES.BILLABLE : CONST_1.default.POLICY_BILLABLE_MODES.NON_BILLABLE;
    var tagsPageLink = (0, react_1.useMemo)(function () {
        if (policy === null || policy === void 0 ? void 0 : policy.areTagsEnabled) {
            return "".concat(environmentURL, "/").concat(ROUTES_1.default.WORKSPACE_TAGS.getRoute(policyID));
        }
        return "".concat(environmentURL, "/").concat(ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID));
    }, [environmentURL, policy === null || policy === void 0 ? void 0 : policy.areTagsEnabled, policyID]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={RulesBillableDefaultPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.individualExpenseRules.billableDefault')} onBackButtonPress={function () { return Navigation_1.default.goBack(); }}/>
                <react_native_1.View style={[styles.flexRow, styles.renderHTML, styles.mt3, styles.mh5, styles.mb5]}>
                    <RenderHTML_1.default html={translate('workspace.rules.individualExpenseRules.billableDefaultDescription', { tagsPageLink: tagsPageLink })}/>
                </react_native_1.View>
                <SelectionList_1.default sections={[{ data: billableModes }]} ListItem={RadioListItem_1.default} onSelectRow={function (item) {
            (0, Policy_1.setPolicyBillableMode)(policyID, item.value);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(Navigation_1.default.goBack);
        }} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={initiallyFocusedOptionKey} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
RulesBillableDefaultPage.displayName = 'RulesBillableDefaultPage';
exports.default = RulesBillableDefaultPage;
