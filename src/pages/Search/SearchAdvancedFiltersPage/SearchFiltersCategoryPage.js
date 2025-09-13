"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchMultipleSelectionPicker_1 = require("@components/Search/SearchMultipleSelectionPicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Search_1 = require("@userActions/Search");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SearchFiltersCategoryPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const selectedCategoriesItems = searchAdvancedFiltersForm?.category?.map((category) => {
        if (category === CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE) {
            return { name: translate('search.noCategory'), value: category };
        }
        return { name: category, value: category };
    });
    const policyIDs = searchAdvancedFiltersForm?.policyID ?? [];
    const [allPolicyCategories = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, {
        canBeMissing: false,
        selector: (policyCategories) => Object.fromEntries(Object.entries(policyCategories ?? {}).filter(([key, categories]) => {
            if (key === `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${(0, PolicyUtils_1.getPersonalPolicy)()?.id}`) {
                return false;
            }
            const availableCategories = Object.values(categories ?? {}).filter((category) => category.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            return availableCategories.length > 0;
        })),
    });
    const selectedPoliciesCategories = Object.keys(allPolicyCategories ?? {})
        .filter((key) => policyIDs?.map((policyID) => `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`)?.includes(key))
        ?.map((key) => Object.values(allPolicyCategories?.[key] ?? {}))
        .flat();
    const categoryItems = (0, react_1.useMemo)(() => {
        const items = [{ name: translate('search.noCategory'), value: CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE }];
        const uniqueCategoryNames = new Set();
        if (!selectedPoliciesCategories || selectedPoliciesCategories.length === 0) {
            Object.values(allPolicyCategories ?? {}).map((policyCategories) => Object.values(policyCategories ?? {}).forEach((category) => uniqueCategoryNames.add(category.name)));
        }
        else {
            selectedPoliciesCategories.forEach((category) => uniqueCategoryNames.add(category.name));
        }
        items.push(...Array.from(uniqueCategoryNames)
            .filter(Boolean)
            .map((categoryName) => ({ name: categoryName, value: categoryName })));
        return items;
    }, [allPolicyCategories, selectedPoliciesCategories, translate]);
    const onSaveSelection = (0, react_1.useCallback)((values) => (0, Search_1.updateAdvancedFilters)({ category: values }), []);
    return (<ScreenWrapper_1.default testID={SearchFiltersCategoryPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('common.category')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SearchMultipleSelectionPicker_1.default items={categoryItems} initiallySelectedItems={selectedCategoriesItems} onSaveSelection={onSaveSelection}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchFiltersCategoryPage.displayName = 'SearchFiltersCategoryPage';
exports.default = SearchFiltersCategoryPage;
