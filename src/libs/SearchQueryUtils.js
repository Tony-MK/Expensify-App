"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortOptionsWithEmptyValue = void 0;
exports.isSearchDatePreset = isSearchDatePreset;
exports.isFilterSupported = isFilterSupported;
exports.buildSearchQueryJSON = buildSearchQueryJSON;
exports.buildSearchQueryString = buildSearchQueryString;
exports.buildUserReadableQueryString = buildUserReadableQueryString;
exports.getFilterDisplayValue = getFilterDisplayValue;
exports.buildQueryStringFromFilterFormValues = buildQueryStringFromFilterFormValues;
exports.buildFilterFormValuesFromQuery = buildFilterFormValuesFromQuery;
exports.buildCannedSearchQuery = buildCannedSearchQuery;
exports.isCannedSearchQuery = isCannedSearchQuery;
exports.sanitizeSearchValue = sanitizeSearchValue;
exports.getQueryWithUpdatedValues = getQueryWithUpdatedValues;
exports.getCurrentSearchQueryJSON = getCurrentSearchQueryJSON;
exports.getQueryWithoutFilters = getQueryWithoutFilters;
exports.isDefaultExpensesQuery = isDefaultExpensesQuery;
exports.shouldHighlight = shouldHighlight;
exports.getAllPolicyValues = getAllPolicyValues;
exports.getUserFriendlyValue = getUserFriendlyValue;
exports.getUserFriendlyKey = getUserFriendlyKey;
exports.getGroupByValue = getGroupByValue;
const cloneDeep_1 = require("lodash/cloneDeep");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const SearchAdvancedFiltersForm_1 = require("@src/types/form/SearchAdvancedFiltersForm");
const CardFeedUtils_1 = require("./CardFeedUtils");
const CardUtils_1 = require("./CardUtils");
const CurrencyUtils_1 = require("./CurrencyUtils");
const Log_1 = require("./Log");
const MoneyRequestUtils_1 = require("./MoneyRequestUtils");
const usePreserveNavigatorState_1 = require("./Navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState");
const navigationRef_1 = require("./Navigation/navigationRef");
const PersonalDetailsUtils_1 = require("./PersonalDetailsUtils");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportUtils_1 = require("./ReportUtils");
const searchParser_1 = require("./SearchParser/searchParser");
const UserUtils_1 = require("./UserUtils");
const ValidationUtils_1 = require("./ValidationUtils");
// This map contains chars that match each operator
const operatorToCharMap = {
    [CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO]: ':',
    [CONST_1.default.SEARCH.SYNTAX_OPERATORS.LOWER_THAN]: '<',
    [CONST_1.default.SEARCH.SYNTAX_OPERATORS.LOWER_THAN_OR_EQUAL_TO]: '<=',
    [CONST_1.default.SEARCH.SYNTAX_OPERATORS.GREATER_THAN]: '>',
    [CONST_1.default.SEARCH.SYNTAX_OPERATORS.GREATER_THAN_OR_EQUAL_TO]: '>=',
    [CONST_1.default.SEARCH.SYNTAX_OPERATORS.NOT_EQUAL_TO]: '!=',
    [CONST_1.default.SEARCH.SYNTAX_OPERATORS.AND]: ',',
    [CONST_1.default.SEARCH.SYNTAX_OPERATORS.OR]: ' ',
};
// Create reverse lookup maps for O(1) performance
const createKeyToUserFriendlyMap = () => {
    const map = new Map();
    // Map SYNTAX_FILTER_KEYS values to their user-friendly names
    Object.entries(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS).forEach(([keyName, keyValue]) => {
        if (!(keyName in CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS)) {
            return;
        }
        map.set(keyValue, CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS[keyName]);
    });
    // Map SYNTAX_ROOT_KEYS values to their user-friendly names
    Object.entries(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS).forEach(([keyName, keyValue]) => {
        if (!(keyName in CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS)) {
            return;
        }
        map.set(keyValue, CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS[keyName]);
    });
    return map;
};
// Create the maps once at module initialization for performance
const keyToUserFriendlyMap = createKeyToUserFriendlyMap();
/**
 * Lookup a key in the keyToUserFriendlyMap and return the user-friendly key.
 *
 * @example
 * getUserFriendlyKey("taxRate") // returns "tax-rate"
 */
function getUserFriendlyKey(keyName) {
    return (keyToUserFriendlyMap.get(keyName) ?? keyName);
}
/**
 * Converts a filter value from backend value to user friendly display text.
 *
 * @example
 * getUserFriendlyValues("perDiem") // returns "per-diem"
 */
function getUserFriendlyValue(value) {
    return CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_VALUES_MAP[value] ?? value;
}
/**
 * @private
 * Returns string value wrapped in quotes "", if the value contains space or &nbsp; (no-breaking space).
 */
function sanitizeSearchValue(str) {
    if (str.includes(' ') || str.includes(`\xA0`)) {
        return `"${str}"`;
    }
    return str;
}
/**
 * @private
 * Returns date filter value for QueryString.
 */
function buildDateFilterQuery(filterValues, filterKey) {
    const dateOn = filterValues[`${filterKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.ON}`];
    const dateAfter = filterValues[`${filterKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER}`];
    const dateBefore = filterValues[`${filterKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE}`];
    const dateFilters = [];
    if (dateOn) {
        dateFilters.push(`${filterKey}:${dateOn}`);
    }
    if (dateAfter) {
        dateFilters.push(`${filterKey}>${dateAfter}`);
    }
    if (dateBefore) {
        dateFilters.push(`${filterKey}<${dateBefore}`);
    }
    return dateFilters.join(' ');
}
/**
 * @private
 * Returns amount filter value for QueryString.
 */
function buildAmountFilterQuery(filterKey, filterValues) {
    const lessThan = filterValues[`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN}`];
    const greaterThan = filterValues[`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN}`];
    let amountFilter = '';
    if (greaterThan) {
        amountFilter += `${filterKey}>${greaterThan}`;
    }
    if (lessThan && greaterThan) {
        amountFilter += ' ';
    }
    if (lessThan) {
        amountFilter += `${filterKey}<${lessThan}`;
    }
    return amountFilter;
}
/**
 * @private
 * Returns string of correctly formatted filter values from QueryFilters object.
 */
function buildFilterValuesString(filterName, queryFilters) {
    const delimiter = filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD ? ' ' : ',';
    let filterValueString = '';
    queryFilters.forEach((queryFilter, index) => {
        // If the previous queryFilter has the same operator (this rule applies only to eq and neq operators) then append the current value
        if (index !== 0 &&
            ((queryFilter.operator === 'eq' && queryFilters?.at(index - 1)?.operator === 'eq') || (queryFilter.operator === 'neq' && queryFilters.at(index - 1)?.operator === 'neq'))) {
            filterValueString += `${delimiter}${sanitizeSearchValue(queryFilter.value.toString())}`;
        }
        else if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD) {
            filterValueString += `${delimiter}${sanitizeSearchValue(queryFilter.value.toString())}`;
        }
        else {
            filterValueString += ` ${filterName}${operatorToCharMap[queryFilter.operator]}${sanitizeSearchValue(queryFilter.value.toString())}`;
        }
    });
    return filterValueString;
}
/**
 * @private
 * Traverses the AST and returns filters as a QueryFilters object.
 */
function getFilters(queryJSON) {
    const filters = [];
    const filterKeys = Object.values(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS);
    function traverse(node) {
        if (!node.operator) {
            return;
        }
        if (typeof node.left === 'object' && node.left) {
            traverse(node.left);
        }
        if (typeof node.right === 'object' && node.right && !Array.isArray(node.right)) {
            traverse(node.right);
        }
        const nodeKey = node.left;
        if (!filterKeys.includes(nodeKey)) {
            return;
        }
        const filterArray = [];
        if (!Array.isArray(node.right)) {
            filterArray.push({
                operator: node.operator,
                value: node.right,
            });
        }
        else {
            node.right.forEach((element) => {
                filterArray.push({
                    operator: node.operator,
                    value: element,
                });
            });
        }
        filters.push({ key: nodeKey, filters: filterArray });
    }
    if (queryJSON.filters) {
        traverse(queryJSON.filters);
    }
    return filters;
}
/**
 * @private
 * Returns an updated filter value for some query filters.
 * - for `AMOUNT` it formats value to "backend" amount
 * - for personal filters it tries to substitute any user emails with accountIDs
 */
function getUpdatedFilterValue(filterName, filterValue) {
    if (SearchAdvancedFiltersForm_1.AMOUNT_FILTER_KEYS.includes(filterName)) {
        if (typeof filterValue === 'string') {
            const backendAmount = (0, CurrencyUtils_1.convertToBackendAmount)(Number(filterValue));
            return Number.isNaN(backendAmount) ? filterValue : backendAmount.toString();
        }
        return filterValue.map((amount) => {
            const backendAmount = (0, CurrencyUtils_1.convertToBackendAmount)(Number(amount));
            return Number.isNaN(backendAmount) ? amount : backendAmount.toString();
        });
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAYER ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTER ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE) {
        if (typeof filterValue === 'string') {
            return (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(filterValue)?.accountID.toString() ?? filterValue;
        }
        return filterValue.map((email) => (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email)?.accountID.toString() ?? email);
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REPORT_ID || filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID) {
        const cleanIDs = (value) => value
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id.length > 0)
            .join(',');
        if (typeof filterValue === 'string') {
            return cleanIDs(filterValue);
        }
        return filterValue.map(cleanIDs);
    }
    return filterValue;
}
/**
 * @private
 * This is a custom collator only for getQueryHashes function.
 * The reason for this is that the computation of hashes should not depend on the locale.
 * This is used to ensure that hashes stay consistent.
 */
const customCollator = new Intl.Collator('en', { usage: 'sort', sensitivity: 'variant', numeric: true, caseFirst: 'upper' });
/**
 * @private
 * Computes and returns a numerical hash for a given queryJSON.
 * Sorts the query keys and values to ensure that hashes stay consistent.
 */
function getQueryHashes(query) {
    let orderedQuery = '';
    orderedQuery += `${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.TYPE}:${query.type}`;
    orderedQuery += ` ${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.STATUS}:${Array.isArray(query.status) ? query.status.join(',') : query.status}`;
    orderedQuery += ` ${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY}:${query.groupBy}`;
    const filterSet = new Set(orderedQuery);
    // Certain filters shouldn't affect whether two searchers are similar or not, since they dont
    // actually filter out results
    const similarSearchIgnoredFilters = new Set([CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY]);
    // Certain filters' values are significant in deciding which search we are on, so we want to include
    // their value when computing the similarSearchHash
    const similarSearchValueBasedFilters = new Set([CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION]);
    query.flatFilters
        .map((filter) => {
        const filterKey = filter.key;
        const filters = (0, cloneDeep_1.default)(filter.filters);
        filters.sort((a, b) => customCollator.compare(a.value.toString(), b.value.toString()));
        return { filterString: buildFilterValuesString(filterKey, filters), filterKey };
    })
        .sort((a, b) => customCollator.compare(a.filterString, b.filterString))
        .forEach(({ filterString, filterKey }) => {
        if (!similarSearchIgnoredFilters.has(filterKey)) {
            filterSet.add(filterKey);
        }
        if (similarSearchValueBasedFilters.has(filterKey)) {
            filterSet.add(filterString.trim());
        }
        orderedQuery += ` ${filterString}`;
    });
    const similarSearchHash = (0, UserUtils_1.hashText)(Array.from(filterSet).join(''), 2 ** 32);
    const recentSearchHash = (0, UserUtils_1.hashText)(orderedQuery, 2 ** 32);
    orderedQuery += ` ${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.SORT_BY}:${query.sortBy}`;
    orderedQuery += ` ${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.SORT_ORDER}:${query.sortOrder}`;
    if (query.policyID) {
        orderedQuery += ` ${CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID}:${Array.isArray(query.policyID) ? query.policyID.join(',') : query.policyID} `;
    }
    const primaryHash = (0, UserUtils_1.hashText)(orderedQuery, 2 ** 32);
    return { primaryHash, recentSearchHash, similarSearchHash };
}
/**
 * Returns whether a given string is a date preset (e.g. Last month)
 */
function isSearchDatePreset(date) {
    return Object.values(CONST_1.default.SEARCH.DATE_PRESETS).some((datePreset) => datePreset === date);
}
/**
 * Returns whether a given search filter is supported in a given search data type
 */
function isFilterSupported(filter, type) {
    return SearchAdvancedFiltersForm_1.ALLOWED_TYPE_FILTERS[type].some((supportedFilter) => supportedFilter === filter);
}
/**
 * Normalizes the groupBy value into a single string.
 * - If it's an array, returns the first element.
 * - Otherwise, returns the value as is.
 *
 * This ensures consistent usage of groupBy across the app,
 * since we only support filtering by a single valid groupBy key.
 *
 * @param groupBy - The raw groupBy value from SearchQueryJSON
 * @returns The normalized groupBy value
 */
function getGroupByValue(groupBy) {
    if (Array.isArray(groupBy)) {
        return groupBy.at(0);
    }
    return groupBy;
}
/**
 * Parses a given search query string into a structured `SearchQueryJSON` format.
 * This format of query is most commonly shared between components and also sent to backend to retrieve search results.
 *
 * In a way this is the reverse of buildSearchQueryString()
 */
function buildSearchQueryJSON(query) {
    try {
        const result = (0, searchParser_1.parse)(query);
        const flatFilters = getFilters(result);
        // Add the full input and hash to the results
        result.inputQuery = query;
        result.flatFilters = flatFilters;
        const { primaryHash, recentSearchHash, similarSearchHash } = getQueryHashes(result);
        result.hash = primaryHash;
        result.recentSearchHash = recentSearchHash;
        result.similarSearchHash = similarSearchHash;
        if (result.policyID && typeof result.policyID === 'string') {
            // Ensure policyID is always an array for consistency
            result.policyID = [result.policyID];
        }
        if (result.groupBy) {
            result.groupBy = getGroupByValue(result.groupBy);
        }
        return result;
    }
    catch (e) {
        console.error(`Error when parsing SearchQuery: "${query}"`, e);
    }
}
/**
 * Formats a given `SearchQueryJSON` object into the string version of query.
 * This format of query is the most basic string format and is used as the query param `q` in search URLs.
 *
 * In a way this is the reverse of buildSearchQueryJSON()
 */
function buildSearchQueryString(queryJSON) {
    const queryParts = [];
    const defaultQueryJSON = buildSearchQueryJSON('');
    for (const [, key] of Object.entries(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS)) {
        const existingFieldValue = queryJSON?.[key];
        const queryFieldValue = existingFieldValue ?? defaultQueryJSON?.[key];
        if (queryFieldValue) {
            if (Array.isArray(queryFieldValue)) {
                queryParts.push(`${key}:${queryFieldValue.join(',')}`);
            }
            else {
                queryParts.push(`${key}:${queryFieldValue}`);
            }
        }
    }
    if (queryJSON?.policyID) {
        queryParts.push(`${CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID}:${Array.isArray(queryJSON.policyID) ? queryJSON.policyID.join(',') : queryJSON.policyID}`);
    }
    if (!queryJSON) {
        return queryParts.join(' ');
    }
    const filters = queryJSON.flatFilters;
    for (const filter of filters) {
        const filterValueString = buildFilterValuesString(filter.key, filter.filters);
        queryParts.push(filterValueString.trim());
    }
    return queryParts.join(' ');
}
/**
 * Formats a given object with search filter values into the string version of the query.
 * Main usage is to consume data format that comes from AdvancedFilters Onyx Form Data, and generate query string.
 *
 * Reverse operation of buildFilterFormValuesFromQuery()
 */
function buildQueryStringFromFilterFormValues(filterValues) {
    const supportedFilterValues = { ...filterValues };
    // When switching types/setting the type, ensure we aren't polluting our query with filters that are
    // only available for the previous type. Remove all filters that are not allowed for the new type
    const providedFilterKeys = Object.keys(supportedFilterValues);
    providedFilterKeys.forEach((filter) => {
        if (isFilterSupported(filter, supportedFilterValues.type ?? CONST_1.default.SEARCH.DATA_TYPES.EXPENSE)) {
            return;
        }
        supportedFilterValues[filter] = undefined;
    });
    // We separate type and status filters from other filters to maintain hashes consistency for saved searches
    const { type, status, groupBy, ...otherFilters } = supportedFilterValues;
    const filtersString = [];
    filtersString.push(`${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.SORT_BY}:${CONST_1.default.SEARCH.TABLE_COLUMNS.DATE}`);
    filtersString.push(`${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.SORT_ORDER}:${CONST_1.default.SEARCH.SORT_ORDER.DESC}`);
    if (type) {
        const sanitizedType = sanitizeSearchValue(type);
        filtersString.push(`${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.TYPE}:${sanitizedType}`);
    }
    if (groupBy) {
        const sanitizedGroupBy = sanitizeSearchValue(groupBy);
        filtersString.push(`${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY}:${sanitizedGroupBy}`);
    }
    if (status && typeof status === 'string') {
        const sanitizedStatus = sanitizeSearchValue(status);
        filtersString.push(`${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.STATUS}:${sanitizedStatus}`);
    }
    if (status && Array.isArray(status)) {
        const filterValueArray = [...new Set(status)];
        filtersString.push(`${CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.STATUS}:${filterValueArray.map(sanitizeSearchValue).join(',')}`);
    }
    const mappedFilters = Object.entries(otherFilters)
        .map(([filterKey, filterValue]) => {
        if ((filterKey === SearchAdvancedFiltersForm_1.default.MERCHANT ||
            filterKey === SearchAdvancedFiltersForm_1.default.DESCRIPTION ||
            filterKey === SearchAdvancedFiltersForm_1.default.REIMBURSABLE ||
            filterKey === SearchAdvancedFiltersForm_1.default.BILLABLE ||
            filterKey === SearchAdvancedFiltersForm_1.default.TITLE ||
            filterKey === SearchAdvancedFiltersForm_1.default.PAYER ||
            filterKey === SearchAdvancedFiltersForm_1.default.GROUP_CURRENCY ||
            filterKey === SearchAdvancedFiltersForm_1.default.WITHDRAWAL_TYPE ||
            filterKey === SearchAdvancedFiltersForm_1.default.ACTION) &&
            filterValue) {
            const keyInCorrectForm = Object.keys(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS).find((key) => CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[key] === filterKey);
            if (keyInCorrectForm) {
                return `${CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[keyInCorrectForm]}:${sanitizeSearchValue(filterValue)}`;
            }
        }
        if ((filterKey === SearchAdvancedFiltersForm_1.default.REPORT_ID || filterKey === SearchAdvancedFiltersForm_1.default.WITHDRAWAL_ID) && filterValue) {
            const reportIDs = filterValue
                .split(',')
                .map((id) => sanitizeSearchValue(id.trim()))
                .filter((id) => id.length > 0);
            const keyInCorrectForm = Object.keys(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS).find((key) => CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[key] === filterKey);
            if (keyInCorrectForm && reportIDs.length > 0) {
                return `${CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[keyInCorrectForm]}:${reportIDs.join(',')}`;
            }
        }
        if (filterKey === SearchAdvancedFiltersForm_1.default.KEYWORD && filterValue) {
            const value = filterValue.split(' ').map(sanitizeSearchValue).join(' ');
            return `${value}`;
        }
        if ((filterKey === SearchAdvancedFiltersForm_1.default.CATEGORY ||
            filterKey === SearchAdvancedFiltersForm_1.default.CARD_ID ||
            filterKey === SearchAdvancedFiltersForm_1.default.TAX_RATE ||
            filterKey === SearchAdvancedFiltersForm_1.default.EXPENSE_TYPE ||
            filterKey === SearchAdvancedFiltersForm_1.default.TAG ||
            filterKey === SearchAdvancedFiltersForm_1.default.CURRENCY ||
            filterKey === SearchAdvancedFiltersForm_1.default.PURCHASE_CURRENCY ||
            filterKey === SearchAdvancedFiltersForm_1.default.FROM ||
            filterKey === SearchAdvancedFiltersForm_1.default.TO ||
            filterKey === SearchAdvancedFiltersForm_1.default.FEED ||
            filterKey === SearchAdvancedFiltersForm_1.default.IN ||
            filterKey === SearchAdvancedFiltersForm_1.default.ASSIGNEE ||
            filterKey === SearchAdvancedFiltersForm_1.default.POLICY_ID ||
            filterKey === SearchAdvancedFiltersForm_1.default.HAS ||
            filterKey === SearchAdvancedFiltersForm_1.default.EXPORTER ||
            filterKey === SearchAdvancedFiltersForm_1.default.ATTENDEE) &&
            Array.isArray(filterValue) &&
            filterValue.length > 0) {
            const filterValueArray = [...new Set(filterValue)];
            const keyInCorrectForm = Object.keys(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS).find((key) => CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[key] === filterKey);
            if (keyInCorrectForm) {
                return `${CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[keyInCorrectForm]}:${filterValueArray.map(sanitizeSearchValue).join(',')}`;
            }
        }
        return undefined;
    })
        .filter((filter) => !!filter);
    filtersString.push(...mappedFilters);
    SearchAdvancedFiltersForm_1.DATE_FILTER_KEYS.forEach((dateKey) => {
        const dateFilter = buildDateFilterQuery(supportedFilterValues, dateKey);
        filtersString.push(dateFilter);
    });
    SearchAdvancedFiltersForm_1.AMOUNT_FILTER_KEYS.forEach((filterKey) => {
        const amountFilter = buildAmountFilterQuery(filterKey, supportedFilterValues);
        filtersString.push(amountFilter);
    });
    return filtersString.filter(Boolean).join(' ').trim();
}
function getAllPolicyValues(policyID, key, policyData) {
    if (!policyData || !policyID) {
        return [];
    }
    return policyID.map((id) => policyData?.[`${key}${id}`]).filter((data) => !!data);
}
/**
 * Generates object with search filter values, in a format that can be consumed by SearchAdvancedFiltersForm.
 * Main usage of this is to generate the initial values for AdvancedFilters from existing query.
 *
 * Reverse operation of buildQueryStringFromFilterFormValues()
 */
function buildFilterFormValuesFromQuery(queryJSON, policyCategories, policyTags, currencyList, personalDetails, cardList, reports, taxRates) {
    const filters = queryJSON.flatFilters;
    const filtersForm = {};
    const policyID = queryJSON.policyID;
    for (const queryFilter of filters) {
        const filterKey = queryFilter.key;
        const filterList = queryFilter.filters;
        const filterValues = filterList.map((item) => item.value.toString());
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID || filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REPORT_ID) {
            filtersForm[filterKey] = filterValues.join(',');
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.MERCHANT ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TITLE ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION) {
            filtersForm[filterKey] = filterValues.at(0);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPENSE_TYPE) {
            const validExpenseTypes = new Set(Object.values(CONST_1.default.SEARCH.TRANSACTION_TYPE));
            filtersForm[filterKey] = filterValues.filter((expenseType) => validExpenseTypes.has(expenseType));
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.HAS) {
            const validHasTypes = new Set(Object.values(CONST_1.default.SEARCH.HAS_VALUES));
            filtersForm[filterKey] = filterValues.filter((hasType) => validHasTypes.has(hasType));
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_TYPE) {
            const validWithdrawalTypes = new Set(Object.values(CONST_1.default.SEARCH.WITHDRAWAL_TYPE));
            filtersForm[filterKey] = filterValues
                .filter((withdrawalType) => validWithdrawalTypes.has(withdrawalType))
                .at(0);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID) {
            filtersForm[filterKey] = filterValues.filter((card) => cardList[card]);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED) {
            filtersForm[filterKey] = filterValues.filter((feed) => feed);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE) {
            const allTaxRates = new Set(Object.values(taxRates).flat());
            filtersForm[filterKey] = filterValues.filter((tax) => allTaxRates.has(tax));
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN) {
            filtersForm[filterKey] = filterValues.filter((id) => reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${id}`]?.reportID);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTER ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE) {
            filtersForm[filterKey] = filterValues.filter((id) => personalDetails && personalDetails[id]);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAYER) {
            filtersForm[filterKey] = filterValues.find((id) => personalDetails && personalDetails[id]);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY || filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_CURRENCY) {
            const validCurrency = new Set(Object.keys(currencyList));
            filtersForm[filterKey] = filterValues.filter((currency) => validCurrency.has(currency));
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY) {
            const validCurrency = new Set(Object.keys(currencyList));
            filtersForm[filterKey] = filterValues.filter((currency) => validCurrency.has(currency)).at(0);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG) {
            const tags = policyID
                ? getAllPolicyValues(policyID, ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, policyTags)
                    .map((tagList) => (0, PolicyUtils_1.getTagNamesFromTagsLists)(tagList ?? {}))
                    .flat()
                : Object.values(policyTags ?? {})
                    .filter((item) => !!item)
                    .map((tagList) => (0, PolicyUtils_1.getTagNamesFromTagsLists)(tagList ?? {}))
                    .flat();
            const uniqueTags = new Set(tags);
            uniqueTags.add(CONST_1.default.SEARCH.TAG_EMPTY_VALUE);
            filtersForm[filterKey] = filterValues.filter((name) => uniqueTags.has(name));
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY) {
            const categories = policyID
                ? getAllPolicyValues(policyID, ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, policyCategories)
                    .map((item) => Object.values(item ?? {}).map((category) => category.name))
                    .flat()
                : Object.values(policyCategories ?? {})
                    .map((item) => Object.values(item ?? {}).map((category) => category.name))
                    .flat();
            const uniqueCategories = new Set(categories);
            const emptyCategories = CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE.split(',');
            const hasEmptyCategoriesInFilter = emptyCategories.every((category) => filterValues.includes(category));
            // We split CATEGORY_EMPTY_VALUE into individual values to detect both are present in filterValues.
            // If empty categories are found, append the CATEGORY_EMPTY_VALUE to filtersForm.
            filtersForm[filterKey] = filterValues.filter((name) => uniqueCategories.has(name)).concat(hasEmptyCategoriesInFilter ? [CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE] : []);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD) {
            filtersForm[filterKey] = filterValues
                ?.map((filter) => {
                if (filter.includes(' ')) {
                    return `"${filter}"`;
                }
                return filter;
            })
                .join(' ');
        }
        if (SearchAdvancedFiltersForm_1.DATE_FILTER_KEYS.includes(filterKey)) {
            const beforeKey = `${filterKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE}`;
            const afterKey = `${filterKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER}`;
            const onKey = `${filterKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.ON}`;
            const beforeFilter = filterList.find((filter) => filter.operator === 'lt' && (0, ValidationUtils_1.isValidDate)(filter.value.toString()));
            const afterFilter = filterList.find((filter) => filter.operator === 'gt' && (0, ValidationUtils_1.isValidDate)(filter.value.toString()));
            // The `On` filter could be either a date or a date preset (e.g. Last month)
            const onFilter = filterList.find((filter) => filter.operator === 'eq' && ((0, ValidationUtils_1.isValidDate)(filter.value.toString()) || isSearchDatePreset(filter.value.toString())));
            filtersForm[beforeKey] = beforeFilter?.value.toString() ?? filtersForm[beforeKey];
            filtersForm[afterKey] = afterFilter?.value.toString() ?? filtersForm[afterKey];
            filtersForm[onKey] = onFilter?.value.toString() ?? filtersForm[onKey];
        }
        if (SearchAdvancedFiltersForm_1.AMOUNT_FILTER_KEYS.includes(filterKey)) {
            const lessThanKey = `${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN}`;
            const greaterThanKey = `${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN}`;
            // backend amount is an integer and is 2 digits longer than frontend amount
            filtersForm[lessThanKey] =
                filterList.find((filter) => filter.operator === 'lt' && (0, MoneyRequestUtils_1.validateAmount)(filter.value.toString(), 0, CONST_1.default.IOU.AMOUNT_MAX_LENGTH + 2))?.value.toString() ??
                    filtersForm[lessThanKey];
            filtersForm[greaterThanKey] =
                filterList.find((filter) => filter.operator === 'gt' && (0, MoneyRequestUtils_1.validateAmount)(filter.value.toString(), 0, CONST_1.default.IOU.AMOUNT_MAX_LENGTH + 2))?.value.toString() ??
                    filtersForm[greaterThanKey];
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE || filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE) {
            const validBooleanTypes = Object.values(CONST_1.default.SEARCH.BOOLEAN);
            filtersForm[filterKey] = validBooleanTypes.find((value) => filterValues.at(0) === value);
        }
    }
    const [typeKey, typeValue] = Object.entries(CONST_1.default.SEARCH.DATA_TYPES).find(([, value]) => value === queryJSON.type) ?? [];
    filtersForm[SearchAdvancedFiltersForm_1.default.TYPE] = typeValue ? queryJSON.type : CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
    if (typeKey) {
        if (Array.isArray(queryJSON.status)) {
            const validStatuses = queryJSON.status.filter((status) => Object.values(CONST_1.default.SEARCH.STATUS[typeKey]).includes(status));
            if (validStatuses.length) {
                filtersForm[SearchAdvancedFiltersForm_1.default.STATUS] = queryJSON.status.join(',');
            }
            else {
                filtersForm[SearchAdvancedFiltersForm_1.default.STATUS] = CONST_1.default.SEARCH.STATUS.EXPENSE.ALL;
            }
        }
        else {
            filtersForm[SearchAdvancedFiltersForm_1.default.STATUS] = queryJSON.status;
        }
    }
    if (queryJSON.policyID) {
        filtersForm[SearchAdvancedFiltersForm_1.default.POLICY_ID] = queryJSON.policyID;
    }
    if (queryJSON.groupBy) {
        filtersForm[SearchAdvancedFiltersForm_1.default.GROUP_BY] = queryJSON.groupBy;
    }
    return filtersForm;
}
/**
 * Returns the human-readable "pretty" string for a specified filter value.
 */
function getFilterDisplayValue(filterName, filterValue, personalDetails, reports, cardList, cardFeeds, policies) {
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAYER ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTER ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE) {
        // login can be an empty string
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return personalDetails?.[filterValue]?.displayName || filterValue;
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID) {
        const cardID = parseInt(filterValue, 10);
        if (Number.isNaN(cardID)) {
            return filterValue;
        }
        return (0, CardUtils_1.getCardDescription)(cardList?.[cardID]) || filterValue;
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN) {
        return (0, ReportUtils_1.getReportName)(reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${filterValue}`]) || filterValue;
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.AMOUNT || filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TOTAL || filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_AMOUNT) {
        const frontendAmount = (0, CurrencyUtils_1.convertToFrontendAmountAsInteger)(Number(filterValue));
        return Number.isNaN(frontendAmount) ? filterValue : frontendAmount.toString();
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG) {
        return (0, PolicyUtils_1.getCleanedTagName)(filterValue);
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED) {
        const cardFeedsForDisplay = (0, CardFeedUtils_1.getCardFeedsForDisplay)(cardFeeds, cardList);
        return cardFeedsForDisplay[filterValue]?.name ?? filterValue;
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID) {
        return policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${filterValue}`]?.name ?? filterValue;
    }
    return filterValue;
}
/**
 * Formats a given `SearchQueryJSON` object into the human-readable string version of query.
 * This format of query is the one which we want to display to users.
 * We try to replace every numeric id value with a display version of this value,
 * So: user IDs get turned into emails, report ids into report names etc.
 */
function buildUserReadableQueryString(queryJSON, PersonalDetails, reports, taxRates, cardList, cardFeeds, policies) {
    const { type, status, groupBy, policyID } = queryJSON;
    const filters = queryJSON.flatFilters;
    let title = status
        ? `type:${getUserFriendlyValue(type)} status:${Array.isArray(status) ? status.map(getUserFriendlyValue).join(',') : getUserFriendlyValue(status)}`
        : `type:${getUserFriendlyValue(type)}`;
    if (groupBy) {
        title += ` group-by:${getUserFriendlyValue(groupBy)}`;
    }
    if (policyID && policyID.length > 0) {
        title += ` workspace:${policyID.map((id) => sanitizeSearchValue(policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${id}`]?.name ?? id)).join(',')}`;
    }
    for (const filterObject of filters) {
        const key = filterObject.key;
        const queryFilter = filterObject.filters;
        let displayQueryFilters = [];
        if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE) {
            const taxRateIDs = queryFilter.map((filter) => filter.value.toString());
            const taxRateNames = taxRateIDs
                .map((id) => {
                const taxRate = Object.entries(taxRates)
                    .filter(([, IDs]) => IDs.includes(id))
                    .map(([name]) => name);
                return taxRate.length > 0 ? taxRate : id;
            })
                .flat();
            const uniqueTaxRateNames = [...new Set(taxRateNames)];
            displayQueryFilters = uniqueTaxRateNames.map((taxRate) => ({
                operator: queryFilter.at(0)?.operator ?? CONST_1.default.SEARCH.SYNTAX_OPERATORS.AND,
                value: taxRate,
            }));
        }
        else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED) {
            displayQueryFilters = queryFilter.reduce((acc, filter) => {
                const feedKey = filter.value.toString();
                const cardFeedsForDisplay = (0, CardFeedUtils_1.getCardFeedsForDisplay)(cardFeeds, cardList);
                const plaidFeedName = feedKey?.split(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID)?.at(1);
                const regularBank = feedKey?.split('_')?.at(1) ?? CONST_1.default.DEFAULT_NUMBER_ID;
                const idPrefix = feedKey?.split('_')?.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID;
                const plaidValue = cardFeedsForDisplay[`${idPrefix}_${CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID}${plaidFeedName}`]?.name;
                if (plaidFeedName) {
                    if (plaidValue) {
                        acc.push({ operator: filter.operator, value: plaidValue });
                    }
                    return acc;
                }
                const value = cardFeedsForDisplay[`${idPrefix}_${regularBank}`]?.name ?? feedKey;
                acc.push({ operator: filter.operator, value });
                return acc;
            }, []);
        }
        else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID) {
            displayQueryFilters = queryFilter.reduce((acc, filter) => {
                const cardValue = filter.value.toString();
                const cardID = parseInt(cardValue, 10);
                if (cardList?.[cardID]) {
                    if (Number.isNaN(cardID)) {
                        acc.push({ operator: filter.operator, value: cardID });
                    }
                    else {
                        acc.push({ operator: filter.operator, value: (0, CardUtils_1.getCardDescription)(cardList?.[cardID]) || cardID });
                    }
                }
                return acc;
            }, []);
        }
        else {
            displayQueryFilters = queryFilter.map((filter) => ({
                operator: filter.operator,
                value: getFilterDisplayValue(key, getUserFriendlyValue(filter.value.toString()), PersonalDetails, reports, cardList, cardFeeds, policies),
            }));
        }
        title += buildFilterValuesString(getUserFriendlyKey(key), displayQueryFilters);
    }
    return title;
}
/**
 * Returns properly built QueryString for a canned query, with the optional policyID.
 */
function buildCannedSearchQuery({ type = CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, status, policyID, cardID, groupBy, } = {}) {
    let queryString = status ? `type:${type} status:${Array.isArray(status) ? status.join(',') : status}` : `type:${type}`;
    if (groupBy) {
        queryString += ` group-by:${groupBy}`;
    }
    if (policyID) {
        queryString += ` policyID:${policyID}`;
    }
    if (cardID) {
        queryString += ` expense-type:card card:${cardID}`;
    }
    // Parse the query to fill all default query fields with values
    const normalizedQueryJSON = buildSearchQueryJSON(queryString);
    return buildSearchQueryString(normalizedQueryJSON);
}
/**
 * Returns whether a given search query is a Canned query.
 *
 * Canned queries are simple predefined queries, that are defined only using type and status and no additional filters.
 * In addition, they can contain an optional policyID.
 * For example: "type:trip" is a canned query.
 */
function isCannedSearchQuery(queryJSON) {
    return !queryJSON.filters && !queryJSON.policyID && !queryJSON.status;
}
function isDefaultExpensesQuery(queryJSON) {
    return queryJSON.type === CONST_1.default.SEARCH.DATA_TYPES.EXPENSE && !queryJSON.status && !queryJSON.filters && !queryJSON.groupBy && !queryJSON.policyID;
}
/**
 * Always show `No category` and `No tag` as the first option
 */
const sortOptionsWithEmptyValue = (a, b, localeCompare) => {
    if (a === CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE || a === CONST_1.default.SEARCH.TAG_EMPTY_VALUE) {
        return -1;
    }
    if (b === CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE || b === CONST_1.default.SEARCH.TAG_EMPTY_VALUE) {
        return 1;
    }
    return localeCompare(a, b);
};
exports.sortOptionsWithEmptyValue = sortOptionsWithEmptyValue;
/**
 *  Given a search query, this function will standardize the query by replacing display values with their corresponding IDs.
 */
function traverseAndUpdatedQuery(queryJSON, computeNodeValue) {
    const standardQuery = (0, cloneDeep_1.default)(queryJSON);
    const filters = standardQuery.filters;
    const traverse = (node) => {
        if (!node.operator) {
            return;
        }
        if (typeof node.left === 'object') {
            traverse(node.left);
        }
        if (typeof node.right === 'object' && !Array.isArray(node.right)) {
            traverse(node.right);
        }
        if (typeof node.left !== 'object' && (Array.isArray(node.right) || typeof node.right === 'string')) {
            // eslint-disable-next-line no-param-reassign
            node.right = computeNodeValue(node.left, node.right);
        }
    };
    if (filters) {
        traverse(filters);
    }
    standardQuery.flatFilters = getFilters(standardQuery);
    return standardQuery;
}
/**
 * Returns new string query, after parsing it and traversing to update some filter values.
 * If there are any personal emails, it will try to substitute them with accountIDs
 */
function getQueryWithUpdatedValues(query) {
    const queryJSON = buildSearchQueryJSON(query);
    if (!queryJSON) {
        Log_1.default.alert(`${CONST_1.default.ERROR.ENSURE_BUG_BOT} user query failed to parse`, {}, false);
        return;
    }
    const standardizedQuery = traverseAndUpdatedQuery(queryJSON, getUpdatedFilterValue);
    return buildSearchQueryString(standardizedQuery);
}
function getCurrentSearchQueryJSON() {
    const rootState = navigationRef_1.default.getRootState();
    const lastSearchNavigator = rootState?.routes?.findLast((route) => route.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR);
    const lastSearchNavigatorState = lastSearchNavigator && lastSearchNavigator.key ? (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(lastSearchNavigator?.key) : undefined;
    if (!lastSearchNavigatorState) {
        return;
    }
    const lastSearchRoute = lastSearchNavigatorState.routes.findLast((route) => route.name === SCREENS_1.default.SEARCH.ROOT);
    if (!lastSearchRoute || !lastSearchRoute.params) {
        return;
    }
    const { q: searchParams } = lastSearchRoute.params;
    const queryJSON = buildSearchQueryJSON(searchParams);
    if (!queryJSON) {
        return;
    }
    return queryJSON;
}
/**
 * Extracts the query text without the filter parts.
 * This is used to determine if a user's core search terms have changed,
 * ignoring any filter modifications.
 *
 * @param searchQuery - The complete search query string
 * @returns The query without filters (core search terms only)
 */
function getQueryWithoutFilters(searchQuery) {
    const queryJSON = buildSearchQueryJSON(searchQuery);
    if (!queryJSON) {
        return '';
    }
    const keywordFilter = queryJSON.flatFilters.find((filter) => filter.key === 'keyword');
    return keywordFilter?.filters.map((filter) => filter.value).join(' ') ?? '';
}
function shouldHighlight(referenceText, searchText) {
    if (!referenceText || !searchText) {
        return false;
    }
    const escapedText = searchText
        .toLowerCase()
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(^|\\s)${escapedText}(?=\\s|$)`, 'i');
    return pattern.test(referenceText.toLowerCase());
}
