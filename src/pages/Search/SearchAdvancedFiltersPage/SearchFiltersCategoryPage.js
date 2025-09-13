"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SearchMultipleSelectionPicker_1 = require("@components/Search/SearchMultipleSelectionPicker");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var Search_1 = require("@userActions/Search");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SearchFiltersCategoryPage() {
    var _a, _b, _c;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var searchAdvancedFiltersForm = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true })[0];
    var selectedCategoriesItems = (_a = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm.category) === null || _a === void 0 ? void 0 : _a.map(function (category) {
        if (category === CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE) {
            return { name: translate('search.noCategory'), value: category };
        }
        return { name: category, value: category };
    });
    var policyIDs = (_b = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm.policyID) !== null && _b !== void 0 ? _b : [];
    var _d = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, {
        canBeMissing: false,
        selector: function (policyCategories) {
            return Object.fromEntries(Object.entries(policyCategories !== null && policyCategories !== void 0 ? policyCategories : {}).filter(function (_a) {
                var _b;
                var key = _a[0], categories = _a[1];
                if (key === "".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES).concat((_b = (0, PolicyUtils_1.getPersonalPolicy)()) === null || _b === void 0 ? void 0 : _b.id)) {
                    return false;
                }
                var availableCategories = Object.values(categories !== null && categories !== void 0 ? categories : {}).filter(function (category) { return category.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE; });
                return availableCategories.length > 0;
            }));
        },
    })[0], allPolicyCategories = _d === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _d;
    var selectedPoliciesCategories = (_c = Object.keys(allPolicyCategories !== null && allPolicyCategories !== void 0 ? allPolicyCategories : {})
        .filter(function (key) { var _a; return (_a = policyIDs === null || policyIDs === void 0 ? void 0 : policyIDs.map(function (policyID) { return "".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES).concat(policyID); })) === null || _a === void 0 ? void 0 : _a.includes(key); })) === null || _c === void 0 ? void 0 : _c.map(function (key) { var _a; return Object.values((_a = allPolicyCategories === null || allPolicyCategories === void 0 ? void 0 : allPolicyCategories[key]) !== null && _a !== void 0 ? _a : {}); }).flat();
    var categoryItems = (0, react_1.useMemo)(function () {
        var items = [{ name: translate('search.noCategory'), value: CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE }];
        var uniqueCategoryNames = new Set();
        if (!selectedPoliciesCategories || selectedPoliciesCategories.length === 0) {
            Object.values(allPolicyCategories !== null && allPolicyCategories !== void 0 ? allPolicyCategories : {}).map(function (policyCategories) { return Object.values(policyCategories !== null && policyCategories !== void 0 ? policyCategories : {}).forEach(function (category) { return uniqueCategoryNames.add(category.name); }); });
        }
        else {
            selectedPoliciesCategories.forEach(function (category) { return uniqueCategoryNames.add(category.name); });
        }
        items.push.apply(items, Array.from(uniqueCategoryNames)
            .filter(Boolean)
            .map(function (categoryName) { return ({ name: categoryName, value: categoryName }); }));
        return items;
    }, [allPolicyCategories, selectedPoliciesCategories, translate]);
    var onSaveSelection = (0, react_1.useCallback)(function (values) { return (0, Search_1.updateAdvancedFilters)({ category: values }); }, []);
    return (<ScreenWrapper_1.default testID={SearchFiltersCategoryPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('common.category')} onBackButtonPress={function () {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SearchMultipleSelectionPicker_1.default items={categoryItems} initiallySelectedItems={selectedCategoriesItems} onSaveSelection={onSaveSelection}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchFiltersCategoryPage.displayName = 'SearchFiltersCategoryPage';
exports.default = SearchFiltersCategoryPage;
