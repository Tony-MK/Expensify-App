"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutocompleteCategories = getAutocompleteCategories;
exports.getAutocompleteQueryWithComma = getAutocompleteQueryWithComma;
exports.getAutocompleteRecentCategories = getAutocompleteRecentCategories;
exports.getAutocompleteRecentTags = getAutocompleteRecentTags;
exports.getAutocompleteTags = getAutocompleteTags;
exports.getAutocompleteTaxList = getAutocompleteTaxList;
exports.getQueryWithoutAutocompletedPart = getQueryWithoutAutocompletedPart;
exports.parseForAutocomplete = parseForAutocomplete;
exports.parseForLiveMarkdown = parseForLiveMarkdown;
const CONST_1 = require("@src/CONST");
const PolicyUtils_1 = require("./PolicyUtils");
const autocompleteParser_1 = require("./SearchParser/autocompleteParser");
const SearchQueryUtils_1 = require("./SearchQueryUtils");
/**
 * Parses given query using the autocomplete parser.
 * This is a smaller and simpler version of search parser used for autocomplete displaying logic.
 */
function parseForAutocomplete(text) {
    try {
        const parsedAutocomplete = (0, autocompleteParser_1.parse)(text);
        return parsedAutocomplete;
    }
    catch (e) {
        console.error(`Error when parsing autocomplete query"`, e);
    }
}
/**
 * Returns data for computing the `Tag` filter autocomplete list.
 */
function getAutocompleteTags(allPoliciesTagsLists) {
    const uniqueTagNames = new Set();
    const tagListsUnpacked = Object.values(allPoliciesTagsLists ?? {}).filter((item) => !!item);
    tagListsUnpacked
        .map(PolicyUtils_1.getTagNamesFromTagsLists)
        .flat()
        .forEach((tag) => uniqueTagNames.add(tag));
    return Array.from(uniqueTagNames);
}
/**
 * Returns data for computing the recent tags autocomplete list.
 */
function getAutocompleteRecentTags(allRecentTags) {
    const uniqueTagNames = new Set();
    Object.values(allRecentTags ?? {})
        .map((recentTag) => Object.values(recentTag ?? {}))
        .flat(2)
        .forEach((tag) => uniqueTagNames.add(tag));
    return Array.from(uniqueTagNames);
}
/**
 * Returns data for computing the `Category` filter autocomplete list.
 */
function getAutocompleteCategories(allPolicyCategories) {
    const uniqueCategoryNames = new Set();
    Object.values(allPolicyCategories ?? {}).map((policyCategories) => Object.values(policyCategories ?? {}).forEach((category) => uniqueCategoryNames.add(category.name)));
    return Array.from(uniqueCategoryNames);
}
/**
 * Returns data for computing the recent categories autocomplete list.
 */
function getAutocompleteRecentCategories(allRecentCategories) {
    const uniqueCategoryNames = new Set();
    Object.values(allRecentCategories ?? {}).map((policyCategories) => Object.values(policyCategories ?? {}).forEach((category) => uniqueCategoryNames.add(category)));
    return Array.from(uniqueCategoryNames);
}
/**
 * Returns data for computing the `Tax` filter autocomplete list
 *
 * Please note: taxes are stored in a quite convoluted and non-obvious way, and there can be multiple taxes with the same id
 * because tax ids are generated based on a tax name, so they look like this: `id_My_Tax` and are not numeric.
 * That is why this function may seem a bit complex.
 */
function getAutocompleteTaxList(taxRates) {
    return Object.keys(taxRates).map((taxName) => ({
        taxRateName: taxName,
        taxRateIds: taxRates[taxName].map((id) => taxRates[id] ?? id).flat(),
    }));
}
/**
 * Given a query string, this function parses it with the autocomplete parser
 * and returns only the part of the string before autocomplete.
 *
 * Ex: "test from:john@doe" -> "test from:"
 */
function getQueryWithoutAutocompletedPart(searchQuery) {
    const parsedQuery = parseForAutocomplete(searchQuery);
    if (!parsedQuery?.autocomplete) {
        return searchQuery;
    }
    const sliceEnd = parsedQuery.autocomplete.start;
    return searchQuery.slice(0, sliceEnd);
}
/**
 * Returns updated search query string with special case of comma after autocomplete handled.
 * If prev query value had autocomplete, and the last thing user typed is a comma
 * then we allow to continue autocompleting the next value by omitting the whitespace
 */
function getAutocompleteQueryWithComma(prevQuery, newQuery) {
    const prevParsedQuery = parseForAutocomplete(prevQuery);
    if (prevParsedQuery?.autocomplete && newQuery.endsWith(',')) {
        return `${newQuery.slice(0, newQuery.length - 1).trim()},`;
    }
    return newQuery;
}
const userFriendlyExpenseTypeList = Object.values(CONST_1.default.SEARCH.TRANSACTION_TYPE).map((value) => (0, SearchQueryUtils_1.getUserFriendlyValue)(value));
const userFriendlyGroupByList = Object.values(CONST_1.default.SEARCH.GROUP_BY).map((value) => (0, SearchQueryUtils_1.getUserFriendlyValue)(value));
const userFriendlyStatusList = Object.values({
    ...CONST_1.default.SEARCH.STATUS.EXPENSE,
    ...CONST_1.default.SEARCH.STATUS.INVOICE,
    ...CONST_1.default.SEARCH.STATUS.CHAT,
    ...CONST_1.default.SEARCH.STATUS.TRIP,
    ...CONST_1.default.SEARCH.STATUS.TASK,
}).map((value) => (0, SearchQueryUtils_1.getUserFriendlyValue)(value));
/**
 * @private
 */
function filterOutRangesWithCorrectValue(range, substitutionMap, userLogins, currencyList, categoryList, tagList) {
    'worklet';
    const typeList = Object.values(CONST_1.default.SEARCH.DATA_TYPES);
    const expenseTypeList = userFriendlyExpenseTypeList;
    const withdrawalTypeList = Object.values(CONST_1.default.SEARCH.WITHDRAWAL_TYPE);
    const statusList = userFriendlyStatusList;
    const groupByList = userFriendlyGroupByList;
    const booleanList = Object.values(CONST_1.default.SEARCH.BOOLEAN);
    const actionList = Object.values(CONST_1.default.SEARCH.ACTION_FILTERS);
    const datePresetList = Object.values(CONST_1.default.SEARCH.DATE_PRESETS);
    const hasList = Object.values(CONST_1.default.SEARCH.HAS_VALUES);
    switch (range.key) {
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID:
            return substitutionMap[`${range.key}:${range.value}`] !== undefined;
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAYER:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTER:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE:
            return substitutionMap[`${range.key}:${range.value}`] !== undefined || userLogins.get().includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_CURRENCY:
            return currencyList.get().includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.TYPE:
            return typeList.includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPENSE_TYPE:
            return expenseTypeList.includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_TYPE:
            return withdrawalTypeList.includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.STATUS:
            return statusList.includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION:
            return actionList.includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY:
            return categoryList.get().includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG:
            return tagList.get().includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY:
            return groupByList.includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE:
            return booleanList.includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.SUBMITTED:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.APPROVED:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAID:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTED:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWN:
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED:
            return datePresetList.includes(range.value);
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.HAS:
            return hasList.includes(range.value);
        default:
            return false;
    }
}
/**
 * Parses input string using the autocomplete parser and returns array of markdown ranges that can be used by RNMarkdownTextInput.
 * It is a simpler version of search parser that can be run on UI thread.
 */
function parseForLiveMarkdown(input, currentUserName, map, userLogins, currencyList, categoryList, tagList) {
    'worklet';
    const parsedAutocomplete = (0, autocompleteParser_1.parse)(input);
    const ranges = parsedAutocomplete.ranges;
    return ranges
        .filter((range) => filterOutRangesWithCorrectValue(range, map, userLogins, currencyList, categoryList, tagList))
        .map((range) => {
        const isCurrentUserMention = userLogins.get().includes(range.value) || range.value === currentUserName;
        const type = isCurrentUserMention ? 'mention-here' : 'mention-user';
        return { start: range.start, type, length: range.length };
    });
}
