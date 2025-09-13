"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagsOptions = getTagsOptions;
exports.getTagListSections = getTagListSections;
exports.hasEnabledTags = hasEnabledTags;
exports.sortTags = sortTags;
exports.getTagVisibility = getTagVisibility;
const CONST_1 = require("@src/CONST");
const Localize_1 = require("./Localize");
const OptionsListUtils_1 = require("./OptionsListUtils");
const PolicyUtils_1 = require("./PolicyUtils");
const tokenizedSearch_1 = require("./tokenizedSearch");
const TransactionUtils_1 = require("./TransactionUtils");
/**
 * Transforms the provided tags into option objects.
 *
 * @param tags - an initial tag array
 */
function getTagsOptions(tags, selectedOptions) {
    return tags.map((tag) => {
        // This is to remove unnecessary escaping backslash in tag name sent from backend.
        const cleanedName = (0, PolicyUtils_1.getCleanedTagName)(tag.name);
        return {
            text: cleanedName,
            keyForList: tag.name,
            searchText: tag.name,
            tooltipText: cleanedName,
            isDisabled: !tag.enabled || tag.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            isSelected: selectedOptions?.some((selectedTag) => selectedTag.name === tag.name),
            pendingAction: tag.pendingAction,
        };
    });
}
/**
 * Build the section list for tags
 */
function getTagListSections({ tags, localeCompare, recentlyUsedTags = [], selectedOptions = [], searchValue = '', maxRecentReportsToShow = CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW, }) {
    const tagSections = [];
    const sortedTags = sortTags(tags, localeCompare);
    const selectedOptionNames = selectedOptions.map((selectedOption) => selectedOption.name);
    const enabledTags = sortedTags.filter((tag) => tag.enabled);
    const enabledTagsNames = enabledTags.map((tag) => tag.name);
    const enabledTagsWithoutSelectedOptions = enabledTags.filter((tag) => !selectedOptionNames.includes(tag.name));
    const selectedTagsWithDisabledState = [];
    const numberOfTags = enabledTags.length;
    selectedOptions.forEach((tag) => {
        if (enabledTagsNames.includes(tag.name)) {
            selectedTagsWithDisabledState.push({ ...tag, enabled: true });
            return;
        }
        selectedTagsWithDisabledState.push({ ...tag, enabled: false });
    });
    // If all tags are disabled but there's a previously selected tag, show only the selected tag
    if (numberOfTags === 0 && selectedOptions.length > 0) {
        tagSections.push({
            // "Selected" section
            title: '',
            shouldShow: false,
            data: getTagsOptions(selectedTagsWithDisabledState, selectedOptions),
        });
        return tagSections;
    }
    if (searchValue) {
        const tagsForSearch = [
            ...(0, tokenizedSearch_1.default)(selectedTagsWithDisabledState, searchValue, (tag) => [(0, PolicyUtils_1.getCleanedTagName)(tag.name)]),
            ...(0, tokenizedSearch_1.default)(enabledTagsWithoutSelectedOptions, searchValue, (tag) => [(0, PolicyUtils_1.getCleanedTagName)(tag.name)]),
        ];
        tagSections.push({
            // "Search" section
            title: '',
            shouldShow: true,
            data: getTagsOptions(tagsForSearch, selectedOptions),
        });
        return tagSections;
    }
    if (numberOfTags < CONST_1.default.STANDARD_LIST_ITEM_LIMIT) {
        tagSections.push({
            // "All" section when items amount less than the threshold
            title: '',
            shouldShow: false,
            data: getTagsOptions([...selectedTagsWithDisabledState, ...enabledTagsWithoutSelectedOptions], selectedOptions),
        });
        return tagSections;
    }
    const filteredRecentlyUsedTags = recentlyUsedTags
        .filter((recentlyUsedTag) => {
        const tagObject = sortedTags.find((tag) => tag.name === recentlyUsedTag);
        return !!tagObject?.enabled && !selectedOptionNames.includes(recentlyUsedTag) && tagObject?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
    })
        .map((tag) => ({ name: tag, enabled: true }));
    if (selectedOptions.length) {
        tagSections.push({
            // "Selected" section
            title: '',
            shouldShow: true,
            data: getTagsOptions(selectedTagsWithDisabledState, selectedOptions),
        });
    }
    if (filteredRecentlyUsedTags.length > 0) {
        const cutRecentlyUsedTags = filteredRecentlyUsedTags.slice(0, maxRecentReportsToShow);
        tagSections.push({
            // "Recent" section
            title: (0, Localize_1.translateLocal)('common.recent'),
            shouldShow: true,
            data: getTagsOptions(cutRecentlyUsedTags, selectedOptions),
        });
    }
    tagSections.push({
        // "All" section when items amount more than the threshold
        title: (0, Localize_1.translateLocal)('common.all'),
        shouldShow: true,
        data: getTagsOptions(enabledTagsWithoutSelectedOptions, selectedOptions),
    });
    return tagSections;
}
/**
 * Verifies that there is at least one enabled tag
 */
function hasEnabledTags(policyTagList) {
    const policyTagValueList = policyTagList
        .filter((tag) => tag && tag.tags)
        .map(({ tags }) => Object.values(tags))
        .flat();
    return (0, OptionsListUtils_1.hasEnabledOptions)(policyTagValueList);
}
/**
 * Sorts tags alphabetically by name.
 */
function sortTags(tags, localeCompare) {
    return Object.values(tags ?? {}).sort((a, b) => localeCompare(a.name, b.name));
}
/**
 * Calculate tag visibility for each tag list
 */
function getTagVisibility({ shouldShowTags, policy, policyTags, transaction, }) {
    const hasDependentTags = (0, PolicyUtils_1.hasDependentTags)(policy, policyTags);
    const isMultilevelTags = (0, PolicyUtils_1.isMultiLevelTags)(policyTags);
    const policyTagLists = (0, PolicyUtils_1.getTagLists)(policyTags);
    return policyTagLists.map(({ tags, required }, index) => {
        const isTagRequired = required ?? false;
        let shouldShow = false;
        if (shouldShowTags) {
            if (hasDependentTags) {
                if (index === 0) {
                    shouldShow = true;
                }
                else {
                    const prevTagValue = (0, TransactionUtils_1.getTagForDisplay)(transaction, index - 1);
                    shouldShow = !!prevTagValue;
                }
            }
            else {
                shouldShow = !isMultilevelTags || (0, OptionsListUtils_1.hasEnabledOptions)(tags);
            }
        }
        return {
            isTagRequired,
            shouldShow,
        };
    });
}
