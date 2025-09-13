"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function TagPicker({ selectedTag, transactionTag, hasDependentTags, tagListName, policyID, tagListIndex, shouldShowDisabledAndSelectedOption = false, shouldOrderListByTagName = false, onSubmit, }) {
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const [policyRecentlyUsedTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_TAGS}${policyID}`, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const policyRecentlyUsedTagsList = (0, react_1.useMemo)(() => policyRecentlyUsedTags?.[tagListName] ?? [], [policyRecentlyUsedTags, tagListName]);
    const policyTagList = (0, PolicyUtils_1.getTagList)(policyTags, tagListIndex);
    const selectedOptions = (0, react_1.useMemo)(() => {
        if (!selectedTag) {
            return [];
        }
        return [
            {
                name: selectedTag,
                enabled: true,
                accountID: undefined,
            },
        ];
    }, [selectedTag]);
    const enabledTags = (0, react_1.useMemo)(() => {
        if (!shouldShowDisabledAndSelectedOption && !hasDependentTags) {
            return policyTagList.tags;
        }
        if (!shouldShowDisabledAndSelectedOption && hasDependentTags) {
            // Truncate transactionTag to the current level (e.g., "California:North")
            const parentTag = (0, TransactionUtils_1.getTagArrayFromName)(transactionTag ?? '')
                .slice(0, tagListIndex)
                .join(':');
            return Object.values(policyTagList.tags).filter((policyTag) => {
                const filterRegex = policyTag.rules?.parentTagsFilter;
                if (!filterRegex) {
                    return policyTagList.tags;
                }
                const regex = new RegExp(filterRegex);
                return regex.test(parentTag ?? '');
            });
        }
        const selectedNames = selectedOptions.map((s) => s.name);
        return [...selectedOptions, ...Object.values(policyTagList.tags).filter((policyTag) => policyTag.enabled && !selectedNames.includes(policyTag.name))];
    }, [shouldShowDisabledAndSelectedOption, hasDependentTags, selectedOptions, policyTagList.tags, transactionTag, tagListIndex]);
    const availableTagsCount = Array.isArray(enabledTags) ? enabledTags.length : Object.keys(enabledTags).length;
    const isTagsCountBelowThreshold = availableTagsCount < CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    const shouldShowTextInput = !isTagsCountBelowThreshold;
    const sections = (0, react_1.useMemo)(() => {
        const tagSections = (0, TagsOptionsListUtils_1.getTagListSections)({
            searchValue,
            selectedOptions,
            tags: enabledTags,
            recentlyUsedTags: policyRecentlyUsedTagsList,
            localeCompare,
        });
        return shouldOrderListByTagName
            ? tagSections.map((option) => ({
                ...option,
                data: option.data.sort((a, b) => localeCompare(a.text ?? '', b.text ?? '')),
            }))
            : tagSections;
    }, [searchValue, selectedOptions, enabledTags, policyRecentlyUsedTagsList, shouldOrderListByTagName, localeCompare]);
    const headerMessage = (0, OptionsListUtils_1.getHeaderMessageForNonUserList)((sections?.at(0)?.data?.length ?? 0) > 0, searchValue);
    const selectedOptionKey = sections.at(0)?.data?.filter((policyTag) => policyTag.searchText === selectedTag)?.[0]?.keyForList;
    return (<SelectionList_1.default ListItem={RadioListItem_1.default} sectionTitleStyles={styles.mt5} listItemTitleStyles={styles.breakAll} sections={sections} textInputValue={searchValue} headerMessage={headerMessage} textInputLabel={shouldShowTextInput ? translate('common.search') : undefined} isRowMultilineSupported initiallyFocusedOptionKey={selectedOptionKey} onChangeText={setSearchValue} onSelectRow={onSubmit}/>);
}
TagPicker.displayName = 'TagPicker';
exports.default = TagPicker;
