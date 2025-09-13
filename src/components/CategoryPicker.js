"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const CategoryOptionListUtils_1 = require("@libs/CategoryOptionListUtils");
const CategoryUtils_1 = require("@libs/CategoryUtils");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const SelectionList_1 = require("./SelectionList");
const RadioListItem_1 = require("./SelectionList/RadioListItem");
function CategoryPicker({ selectedCategory, policyID, onSubmit, addBottomSafeAreaPadding = false, contentContainerStyle }) {
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const [policyCategoriesDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES_DRAFT}${policyID}`, { canBeMissing: true });
    const [policyRecentlyUsedCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES}${policyID}`, { canBeMissing: true });
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const offlineMessage = isOffline ? `${translate('common.youAppearToBeOffline')} ${translate('search.resultsAreLimited')}` : '';
    const selectedOptions = (0, react_1.useMemo)(() => {
        if (!selectedCategory) {
            return [];
        }
        return [
            {
                name: selectedCategory,
                isSelected: true,
                enabled: true,
            },
        ];
    }, [selectedCategory]);
    const [sections, headerMessage, shouldShowTextInput] = (0, react_1.useMemo)(() => {
        const categories = policyCategories ?? policyCategoriesDraft ?? {};
        const validPolicyRecentlyUsedCategories = policyRecentlyUsedCategories?.filter?.((p) => !(0, EmptyObject_1.isEmptyObject)(p));
        const categoryOptions = (0, CategoryOptionListUtils_1.getCategoryListSections)({
            searchValue: debouncedSearchValue,
            selectedOptions,
            categories,
            localeCompare,
            recentlyUsedCategories: validPolicyRecentlyUsedCategories,
        });
        const categoryData = categoryOptions?.at(0)?.data ?? [];
        const header = (0, OptionsListUtils_1.getHeaderMessageForNonUserList)(categoryData.length > 0, debouncedSearchValue);
        const categoriesCount = (0, CategoryUtils_1.getEnabledCategoriesCount)(categories);
        const isCategoriesCountBelowThreshold = categoriesCount < CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
        const showInput = !isCategoriesCountBelowThreshold;
        return [categoryOptions, header, showInput];
    }, [policyRecentlyUsedCategories, debouncedSearchValue, selectedOptions, policyCategories, policyCategoriesDraft, localeCompare]);
    const selectedOptionKey = (0, react_1.useMemo)(() => (sections?.at(0)?.data ?? []).filter((category) => category.searchText === selectedCategory).at(0)?.keyForList, [sections, selectedCategory]);
    return (<SelectionList_1.default sections={sections} headerMessage={headerMessage} textInputValue={searchValue} textInputLabel={shouldShowTextInput ? translate('common.search') : undefined} textInputHint={offlineMessage} onChangeText={setSearchValue} onSelectRow={onSubmit} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={selectedOptionKey ?? undefined} isRowMultilineSupported addBottomSafeAreaPadding={addBottomSafeAreaPadding} contentContainerStyle={contentContainerStyle}/>);
}
CategoryPicker.displayName = 'CategoryPicker';
exports.default = CategoryPicker;
