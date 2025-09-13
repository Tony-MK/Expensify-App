"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function RulesBillableDefaultPage({ route: { params: { policyID }, }, }) {
    const policy = (0, usePolicy_1.default)(policyID);
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const billableModes = [
        {
            value: true,
            text: translate(`workspace.rules.individualExpenseRules.billable`),
            alternateText: translate(`workspace.rules.individualExpenseRules.billableDescription`),
            keyForList: CONST_1.default.POLICY_BILLABLE_MODES.BILLABLE,
            isSelected: policy?.defaultBillable,
        },
        {
            value: false,
            text: translate(`workspace.rules.individualExpenseRules.nonBillable`),
            alternateText: translate(`workspace.rules.individualExpenseRules.nonBillableDescription`),
            keyForList: CONST_1.default.POLICY_BILLABLE_MODES.NON_BILLABLE,
            isSelected: !policy?.defaultBillable,
        },
    ];
    const initiallyFocusedOptionKey = policy?.defaultBillable ? CONST_1.default.POLICY_BILLABLE_MODES.BILLABLE : CONST_1.default.POLICY_BILLABLE_MODES.NON_BILLABLE;
    const tagsPageLink = (0, react_1.useMemo)(() => {
        if (policy?.areTagsEnabled) {
            return `${environmentURL}/${ROUTES_1.default.WORKSPACE_TAGS.getRoute(policyID)}`;
        }
        return `${environmentURL}/${ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)}`;
    }, [environmentURL, policy?.areTagsEnabled, policyID]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={RulesBillableDefaultPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.individualExpenseRules.billableDefault')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <react_native_1.View style={[styles.flexRow, styles.renderHTML, styles.mt3, styles.mh5, styles.mb5]}>
                    <RenderHTML_1.default html={translate('workspace.rules.individualExpenseRules.billableDefaultDescription', { tagsPageLink })}/>
                </react_native_1.View>
                <SelectionList_1.default sections={[{ data: billableModes }]} ListItem={RadioListItem_1.default} onSelectRow={(item) => {
            (0, Policy_1.setPolicyBillableMode)(policyID, item.value);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(Navigation_1.default.goBack);
        }} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={initiallyFocusedOptionKey} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
RulesBillableDefaultPage.displayName = 'RulesBillableDefaultPage';
exports.default = RulesBillableDefaultPage;
