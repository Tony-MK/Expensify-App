"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CategoryUtils_1 = require("@libs/CategoryUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Category_1 = require("@userActions/Policy/Category");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function CategoryDefaultTaxRatePage({ route: { params: { policyID, categoryName }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const selectedTaxRate = (0, CategoryUtils_1.getCategoryDefaultTaxRate)(policy?.rules?.expenseRules ?? [], categoryName, policy?.taxRates?.defaultExternalID);
    const textForDefault = (0, react_1.useCallback)((taxID, taxRate) => (0, CategoryUtils_1.formatDefaultTaxRateText)(translate, taxID, taxRate, policy?.taxRates), [policy?.taxRates, translate]);
    const taxesList = (0, react_1.useMemo)(() => {
        if (!policy) {
            return [];
        }
        return Object.entries(policy.taxRates?.taxes ?? {})
            .map(([key, value]) => ({
            text: textForDefault(key, value),
            keyForList: key,
            isSelected: key === selectedTaxRate,
            isDisabled: value.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            pendingAction: value.pendingAction ?? (Object.keys(value.pendingFields ?? {}).length > 0 ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE : null),
        }))
            .sort((a, b) => localeCompare(a.text ?? a.keyForList ?? '', b.text ?? b.keyForList ?? ''));
    }, [policy, selectedTaxRate, textForDefault, localeCompare]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={CategoryDefaultTaxRatePage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.categoryRules.defaultTaxRate')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName))}/>
                <SelectionList_1.default sections={[{ data: taxesList }]} ListItem={RadioListItem_1.default} onSelectRow={(item) => {
            if (!item.keyForList) {
                return;
            }
            if (item.keyForList === selectedTaxRate) {
                Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName));
                return;
            }
            (0, Category_1.setPolicyCategoryTax)(policyID, categoryName, item.keyForList);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName)));
        }} shouldSingleExecuteRowSelect containerStyle={[styles.pt3]} initiallyFocusedOptionKey={selectedTaxRate} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CategoryDefaultTaxRatePage.displayName = 'CategoryDefaultTaxRatePage';
exports.default = CategoryDefaultTaxRatePage;
