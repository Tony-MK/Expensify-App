"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryListSections = getCategoryListSections;
exports.getCategoryOptionTree = getCategoryOptionTree;
exports.sortCategories = sortCategories;
// eslint-disable-next-line you-dont-need-lodash-underscore/get
const get_1 = require("lodash/get");
const set_1 = require("lodash/set");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const times_1 = require("@src/utils/times");
const Localize_1 = require("./Localize");
const tokenizedSearch_1 = require("./tokenizedSearch");
/**
 * Builds the options for the category tree hierarchy via indents
 *
 * @param options - an initial object array
 * @param options[].enabled - a flag to enable/disable option in a list
 * @param options[].name - a name of an option
 * @param [isOneLine] - a flag to determine if text should be one line
 */
function getCategoryOptionTree(options, isOneLine = false, selectedOptions = []) {
    const optionCollection = new Map();
    Object.values(options).forEach((option) => {
        if (isOneLine) {
            if (optionCollection.has(option.name)) {
                return;
            }
            optionCollection.set(option.name, {
                text: option.name,
                keyForList: option.name,
                searchText: option.name,
                tooltipText: option.name,
                isDisabled: !option.enabled || option.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                isSelected: !!option.isSelected,
                pendingAction: option.pendingAction,
            });
            return;
        }
        option.name.split(CONST_1.default.PARENT_CHILD_SEPARATOR).forEach((optionName, index, array) => {
            const indents = (0, times_1.default)(index, () => CONST_1.default.INDENTS).join('');
            const isChild = array.length - 1 === index;
            const searchText = array.slice(0, index + 1).join(CONST_1.default.PARENT_CHILD_SEPARATOR);
            const selectedParentOption = !isChild && Object.values(selectedOptions).find((op) => op.name === searchText);
            const isParentOptionDisabled = !selectedParentOption || !selectedParentOption.enabled || selectedParentOption.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
            if (optionCollection.has(searchText)) {
                return;
            }
            optionCollection.set(searchText, {
                text: `${indents}${optionName}`,
                keyForList: searchText,
                searchText,
                tooltipText: optionName,
                isDisabled: isChild ? !option.enabled || option.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE : isParentOptionDisabled,
                isSelected: isChild ? !!option.isSelected : !!selectedParentOption,
                pendingAction: option.pendingAction,
            });
        });
    });
    return Array.from(optionCollection.values());
}
/**
 * Builds the section list for categories
 */
function getCategoryListSections({ categories, localeCompare, searchValue, selectedOptions = [], recentlyUsedCategories = [], maxRecentReportsToShow = CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW, }) {
    const sortedCategories = sortCategories(categories, localeCompare);
    const enabledCategories = Object.values(sortedCategories).filter((category) => category.enabled);
    const enabledCategoriesNames = enabledCategories.map((category) => category.name);
    const selectedOptionsWithDisabledState = [];
    const categorySections = [];
    const numberOfEnabledCategories = enabledCategories.length;
    selectedOptions.forEach((option) => {
        if (enabledCategoriesNames.includes(option.name)) {
            const categoryObj = enabledCategories.find((category) => category.name === option.name);
            selectedOptionsWithDisabledState.push({ ...(categoryObj ?? option), isSelected: true, enabled: true });
            return;
        }
        selectedOptionsWithDisabledState.push({ ...option, isSelected: true, enabled: false });
    });
    if (numberOfEnabledCategories === 0 && selectedOptions.length > 0) {
        const data = getCategoryOptionTree(selectedOptionsWithDisabledState, true);
        categorySections.push({
            // "Selected" section
            title: '',
            shouldShow: false,
            data,
            indexOffset: data.length,
        });
        return categorySections;
    }
    if (searchValue) {
        const categoriesForSearch = [...selectedOptionsWithDisabledState, ...enabledCategories];
        const searchCategories = (0, tokenizedSearch_1.default)(categoriesForSearch, searchValue, (category) => [category.name]).map((category) => ({
            ...category,
            isSelected: selectedOptions.some((selectedOption) => selectedOption.name === category.name),
        }));
        const data = getCategoryOptionTree(searchCategories, true);
        categorySections.push({
            // "Search" section
            title: '',
            shouldShow: true,
            data,
            indexOffset: data.length,
        });
        return categorySections;
    }
    if (selectedOptions.length > 0) {
        const data = getCategoryOptionTree(selectedOptionsWithDisabledState, true);
        categorySections.push({
            // "Selected" section
            title: '',
            shouldShow: false,
            data,
            indexOffset: data.length,
        });
    }
    const selectedOptionNames = selectedOptions.map((selectedOption) => selectedOption.name);
    const filteredCategories = enabledCategories.filter((category) => !selectedOptionNames.includes(category.name));
    if (numberOfEnabledCategories < CONST_1.default.STANDARD_LIST_ITEM_LIMIT) {
        const data = getCategoryOptionTree(filteredCategories, false, selectedOptionsWithDisabledState);
        categorySections.push({
            // "All" section when items amount less than the threshold
            title: '',
            shouldShow: false,
            data,
            indexOffset: data.length,
        });
        return categorySections;
    }
    const filteredRecentlyUsedCategories = recentlyUsedCategories
        .filter((categoryName) => !selectedOptionNames.includes(categoryName) && categories[categoryName]?.enabled && categories[categoryName]?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)
        .map((categoryName) => ({
        name: categoryName,
        enabled: categories[categoryName].enabled ?? false,
    }));
    if (filteredRecentlyUsedCategories.length > 0) {
        const cutRecentlyUsedCategories = filteredRecentlyUsedCategories.slice(0, maxRecentReportsToShow);
        const data = getCategoryOptionTree(cutRecentlyUsedCategories, true);
        categorySections.push({
            // "Recent" section
            title: (0, Localize_1.translateLocal)('common.recent'),
            shouldShow: true,
            data,
            indexOffset: data.length,
        });
    }
    const data = getCategoryOptionTree(filteredCategories, false, selectedOptionsWithDisabledState);
    categorySections.push({
        // "All" section when items amount more than the threshold
        title: (0, Localize_1.translateLocal)('common.all'),
        shouldShow: true,
        data,
        indexOffset: data.length,
    });
    return categorySections;
}
/**
 * Sorts categories using a simple object.
 * It builds an hierarchy (based on an object), where each category has a name and other keys as subcategories.
 * Via the hierarchy we avoid duplicating and sort categories one by one. Subcategories are being sorted alphabetically.
 */
function sortCategories(categories, localeCompare) {
    // Sorts categories alphabetically by name.
    const sortedCategories = Object.values(categories).sort((a, b) => localeCompare(a.name, b.name));
    // An object that respects nesting of categories. Also, can contain only uniq categories.
    const hierarchy = {};
    /**
     * Iterates over all categories to set each category in a proper place in hierarchy
     * It gets a path based on a category name e.g. "Parent: Child: Subcategory" -> "Parent.Child.Subcategory".
     * {
     *   Parent: {
     *     name: "Parent",
     *     Child: {
     *       name: "Child"
     *       Subcategory: {
     *         name: "Subcategory"
     *       }
     *     }
     *   }
     * }
     */
    sortedCategories.forEach((category) => {
        const path = category.name.split(CONST_1.default.PARENT_CHILD_SEPARATOR);
        const existedValue = (0, get_1.default)(hierarchy, path, {});
        (0, set_1.default)(hierarchy, path, {
            ...existedValue,
            name: category.name,
            pendingAction: category.pendingAction,
        });
    });
    /**
     * A recursive function to convert hierarchy into an array of category objects.
     * The category object contains base 2 properties: "name" and "enabled".
     * It iterates each key one by one. When a category has subcategories, goes deeper into them. Also, sorts subcategories alphabetically.
     */
    const flatHierarchy = (initialHierarchy) => Object.values(initialHierarchy).reduce((acc, category) => {
        const { name, pendingAction, ...subcategories } = category;
        if (name) {
            const categoryObject = {
                name,
                pendingAction,
                enabled: categories[name]?.enabled ?? false,
            };
            acc.push(categoryObject);
        }
        if (!(0, EmptyObject_1.isEmptyObject)(subcategories)) {
            const nestedCategories = flatHierarchy(subcategories);
            acc.push(...nestedCategories.sort((a, b) => localeCompare(a.name, b.name)));
        }
        return acc;
    }, []);
    return flatHierarchy(hierarchy);
}
