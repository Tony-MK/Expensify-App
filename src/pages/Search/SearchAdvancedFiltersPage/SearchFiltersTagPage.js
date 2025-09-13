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
var Search_1 = require("@libs/actions/Search");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SearchFiltersTagPage() {
    var _a, _b, _c;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var searchAdvancedFiltersForm = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true })[0];
    var selectedTagsItems = (_a = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm.tag) === null || _a === void 0 ? void 0 : _a.map(function (tag) {
        if (tag === CONST_1.default.SEARCH.TAG_EMPTY_VALUE) {
            return { name: translate('search.noTag'), value: tag };
        }
        return { name: (0, PolicyUtils_1.getCleanedTagName)(tag), value: tag };
    });
    var policyIDs = (_b = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm.policyID) !== null && _b !== void 0 ? _b : [];
    var _d = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, { canBeMissing: true })[0], allPolicyTagLists = _d === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _d;
    var selectedPoliciesTagLists = (_c = Object.keys(allPolicyTagLists !== null && allPolicyTagLists !== void 0 ? allPolicyTagLists : {})
        .filter(function (key) { var _a; return (_a = policyIDs === null || policyIDs === void 0 ? void 0 : policyIDs.map(function (policyID) { return "".concat(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS).concat(policyID); })) === null || _a === void 0 ? void 0 : _a.includes(key); })) === null || _c === void 0 ? void 0 : _c.map(function (key) { var _a; return (0, PolicyUtils_1.getTagNamesFromTagsLists)((_a = allPolicyTagLists === null || allPolicyTagLists === void 0 ? void 0 : allPolicyTagLists[key]) !== null && _a !== void 0 ? _a : {}); }).flat();
    var tagItems = (0, react_1.useMemo)(function () {
        var items = [{ name: translate('search.noTag'), value: CONST_1.default.SEARCH.TAG_EMPTY_VALUE }];
        var uniqueTagNames = new Set();
        if (!selectedPoliciesTagLists || selectedPoliciesTagLists.length === 0) {
            var tagListsUnpacked = Object.values(allPolicyTagLists !== null && allPolicyTagLists !== void 0 ? allPolicyTagLists : {}).filter(function (item) { return !!item; });
            tagListsUnpacked
                .map(PolicyUtils_1.getTagNamesFromTagsLists)
                .flat()
                .forEach(function (tag) { return uniqueTagNames.add(tag); });
        }
        else {
            selectedPoliciesTagLists.forEach(function (tag) { return uniqueTagNames.add(tag); });
        }
        items.push.apply(items, Array.from(uniqueTagNames).map(function (tagName) { return ({ name: (0, PolicyUtils_1.getCleanedTagName)(tagName), value: tagName }); }));
        return items;
    }, [allPolicyTagLists, selectedPoliciesTagLists, translate]);
    var updateTagFilter = (0, react_1.useCallback)(function (values) { return (0, Search_1.updateAdvancedFilters)({ tag: values }); }, []);
    return (<ScreenWrapper_1.default testID={SearchFiltersTagPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('common.tag')} onBackButtonPress={function () {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SearchMultipleSelectionPicker_1.default items={tagItems} initiallySelectedItems={selectedTagsItems} onSaveSelection={updateTagFilter}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchFiltersTagPage.displayName = 'SearchFiltersTagPage';
exports.default = SearchFiltersTagPage;
