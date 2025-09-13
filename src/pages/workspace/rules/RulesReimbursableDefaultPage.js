"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SelectionList_1 = require("@components/SelectionList");
var RadioListItem_1 = require("@components/SelectionList/RadioListItem");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Policy_1 = require("@libs/actions/Policy/Policy");
var Navigation_1 = require("@libs/Navigation/Navigation");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var CONST_1 = require("@src/CONST");
function RulesReimbursableDefaultPage(_a) {
    var policyID = _a.route.params.policyID;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var reimbursableMode = (0, Policy_1.getCashExpenseReimbursableMode)(policyID);
    var ReimbursableModes = Object.values(CONST_1.default.POLICY.CASH_EXPENSE_REIMBURSEMENT_CHOICES).map(function (mode) { return ({
        text: translate("workspace.rules.individualExpenseRules.".concat(mode)),
        alternateText: translate("workspace.rules.individualExpenseRules.".concat(mode, "Description")),
        value: mode,
        isSelected: reimbursableMode === mode,
        keyForList: mode,
    }); });
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={RulesReimbursableDefaultPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.individualExpenseRules.cashExpenseDefault')} onBackButtonPress={function () { return Navigation_1.default.goBack(); }}/>
                <Text_1.default style={[styles.flexRow, styles.alignItemsCenter, styles.mt3, styles.mh5, styles.mb5]}>
                    <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('workspace.rules.individualExpenseRules.cashExpenseDefaultDescription')}</Text_1.default>
                </Text_1.default>
                <SelectionList_1.default sections={[{ data: ReimbursableModes }]} ListItem={RadioListItem_1.default} onSelectRow={function (item) {
            (0, Policy_1.setPolicyReimbursableMode)(policyID, item.value);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(Navigation_1.default.goBack);
        }} shouldSingleExecuteRowSelect containerStyle={[styles.pt3]} initiallyFocusedOptionKey={reimbursableMode} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
RulesReimbursableDefaultPage.displayName = 'RulesReimbursableDefaultPage';
exports.default = RulesReimbursableDefaultPage;
