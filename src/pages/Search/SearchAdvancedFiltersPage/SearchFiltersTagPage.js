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
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SearchFiltersTagPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const selectedTagsItems = searchAdvancedFiltersForm?.tag?.map((tag) => {
        if (tag === CONST_1.default.SEARCH.TAG_EMPTY_VALUE) {
            return { name: translate('search.noTag'), value: tag };
        }
        return { name: (0, PolicyUtils_1.getCleanedTagName)(tag), value: tag };
    });
    const policyIDs = searchAdvancedFiltersForm?.policyID ?? [];
    const [allPolicyTagLists = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, { canBeMissing: true });
    const selectedPoliciesTagLists = Object.keys(allPolicyTagLists ?? {})
        .filter((key) => policyIDs?.map((policyID) => `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`)?.includes(key))
        ?.map((key) => (0, PolicyUtils_1.getTagNamesFromTagsLists)(allPolicyTagLists?.[key] ?? {}))
        .flat();
    const tagItems = (0, react_1.useMemo)(() => {
        const items = [{ name: translate('search.noTag'), value: CONST_1.default.SEARCH.TAG_EMPTY_VALUE }];
        const uniqueTagNames = new Set();
        if (!selectedPoliciesTagLists || selectedPoliciesTagLists.length === 0) {
            const tagListsUnpacked = Object.values(allPolicyTagLists ?? {}).filter((item) => !!item);
            tagListsUnpacked
                .map(PolicyUtils_1.getTagNamesFromTagsLists)
                .flat()
                .forEach((tag) => uniqueTagNames.add(tag));
        }
        else {
            selectedPoliciesTagLists.forEach((tag) => uniqueTagNames.add(tag));
        }
        items.push(...Array.from(uniqueTagNames).map((tagName) => ({ name: (0, PolicyUtils_1.getCleanedTagName)(tagName), value: tagName })));
        return items;
    }, [allPolicyTagLists, selectedPoliciesTagLists, translate]);
    const updateTagFilter = (0, react_1.useCallback)((values) => (0, Search_1.updateAdvancedFilters)({ tag: values }), []);
    return (<ScreenWrapper_1.default testID={SearchFiltersTagPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('common.tag')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SearchMultipleSelectionPicker_1.default items={tagItems} initiallySelectedItems={selectedTagsItems} onSaveSelection={updateTagFilter}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchFiltersTagPage.displayName = 'SearchFiltersTagPage';
exports.default = SearchFiltersTagPage;
