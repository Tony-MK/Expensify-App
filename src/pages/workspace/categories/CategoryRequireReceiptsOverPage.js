"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Category = require("@userActions/Policy/Category");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function getInitiallyFocusedOptionKey(isAlwaysSelected, isNeverSelected) {
    if (isAlwaysSelected) {
        return CONST_1.default.POLICY.REQUIRE_RECEIPTS_OVER_OPTIONS.ALWAYS;
    }
    if (isNeverSelected) {
        return CONST_1.default.POLICY.REQUIRE_RECEIPTS_OVER_OPTIONS.NEVER;
    }
    return CONST_1.default.POLICY.REQUIRE_RECEIPTS_OVER_OPTIONS.DEFAULT;
}
function CategoryRequireReceiptsOverPage({ route: { params: { policyID, categoryName }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`);
    const isAlwaysSelected = policyCategories?.[categoryName]?.maxAmountNoReceipt === 0;
    const isNeverSelected = policyCategories?.[categoryName]?.maxAmountNoReceipt === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE;
    const maxExpenseAmountToDisplay = policy?.maxExpenseAmountNoReceipt === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE ? 0 : policy?.maxExpenseAmountNoReceipt;
    const requireReceiptsOverListData = [
        {
            value: null,
            text: translate(`workspace.rules.categoryRules.requireReceiptsOverList.default`, {
                defaultAmount: CurrencyUtils.convertToShortDisplayString(maxExpenseAmountToDisplay, policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD),
            }),
            keyForList: CONST_1.default.POLICY.REQUIRE_RECEIPTS_OVER_OPTIONS.DEFAULT,
            isSelected: !isAlwaysSelected && !isNeverSelected,
        },
        {
            value: CONST_1.default.DISABLED_MAX_EXPENSE_VALUE,
            text: translate(`workspace.rules.categoryRules.requireReceiptsOverList.never`),
            keyForList: CONST_1.default.POLICY.REQUIRE_RECEIPTS_OVER_OPTIONS.NEVER,
            isSelected: isNeverSelected,
        },
        {
            value: 0,
            text: translate(`workspace.rules.categoryRules.requireReceiptsOverList.always`),
            keyForList: CONST_1.default.POLICY.REQUIRE_RECEIPTS_OVER_OPTIONS.ALWAYS,
            isSelected: isAlwaysSelected,
        },
    ];
    const initiallyFocusedOptionKey = getInitiallyFocusedOptionKey(isAlwaysSelected, isNeverSelected);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={CategoryRequireReceiptsOverPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.categoryRules.requireReceiptsOver')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName))}/>
                <SelectionList_1.default sections={[{ data: requireReceiptsOverListData }]} ListItem={RadioListItem_1.default} onSelectRow={(item) => {
            if (typeof item.value === 'number') {
                Category.setPolicyCategoryReceiptsRequired(policyID, categoryName, item.value);
            }
            else {
                Category.removePolicyCategoryReceiptsRequired(policyID, categoryName);
            }
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName)));
        }} shouldSingleExecuteRowSelect containerStyle={[styles.pt3]} initiallyFocusedOptionKey={initiallyFocusedOptionKey} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CategoryRequireReceiptsOverPage.displayName = 'CategoryRequireReceiptsOverPage';
exports.default = CategoryRequireReceiptsOverPage;
