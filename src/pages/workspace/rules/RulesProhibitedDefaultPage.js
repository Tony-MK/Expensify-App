"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
function RulesProhibitedDefaultPage({ route: { params: { policyID }, }, }) {
    const policy = (0, usePolicy_1.default)(policyID);
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={RulesProhibitedDefaultPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.individualExpenseRules.prohibitedExpenses')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <ScrollView_1.default addBottomSafeAreaPadding>
                    <Text_1.default style={[styles.flexRow, styles.alignItemsCenter, styles.mt3, styles.mh5, styles.mb5]}>
                        <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('workspace.rules.individualExpenseRules.prohibitedDefaultDescription')}</Text_1.default>
                    </Text_1.default>

                    {Object.values(CONST_1.default.POLICY.PROHIBITED_EXPENSES).map((prohibitedExpense) => (<OfflineWithFeedback_1.default pendingAction={policy?.prohibitedExpenses?.pendingFields?.[prohibitedExpense]} key={translate(`workspace.rules.individualExpenseRules.${prohibitedExpense}`)}>
                            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, styles.mt3, styles.mh5, styles.mb5]}>
                                <Text_1.default style={[styles.flex1, styles.mr2]}>{translate(`workspace.rules.individualExpenseRules.${prohibitedExpense}`)}</Text_1.default>
                                <Switch_1.default isOn={policy?.prohibitedExpenses?.[prohibitedExpense] ?? false} accessibilityLabel={translate(`workspace.rules.individualExpenseRules.${prohibitedExpense}`)} onToggle={() => {
                (0, Policy_1.setPolicyProhibitedExpense)(policyID, prohibitedExpense);
            }}/>
                            </react_native_1.View>
                        </OfflineWithFeedback_1.default>))}
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
RulesProhibitedDefaultPage.displayName = 'RulesProhibitedDefaultPage';
exports.default = RulesProhibitedDefaultPage;
