"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
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
var cloneDeep_1 = require("lodash/cloneDeep");
var CONST_1 = require("@src/CONST");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var SCREENS_1 = require("@src/SCREENS");
var SearchAdvancedFiltersForm_1 = require("@src/types/form/SearchAdvancedFiltersForm");
var CardFeedUtils_1 = require("./CardFeedUtils");
var CardUtils_1 = require("./CardUtils");
var CurrencyUtils_1 = require("./CurrencyUtils");
var Log_1 = require("./Log");
var MoneyRequestUtils_1 = require("./MoneyRequestUtils");
var usePreserveNavigatorState_1 = require("./Navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState");
var navigationRef_1 = require("./Navigation/navigationRef");
var PersonalDetailsUtils_1 = require("./PersonalDetailsUtils");
var PolicyUtils_1 = require("./PolicyUtils");
var ReportUtils_1 = require("./ReportUtils");
var searchParser_1 = require("./SearchParser/searchParser");
var UserUtils_1 = require("./UserUtils");
var ValidationUtils_1 = require("./ValidationUtils");
// This map contains chars that match each operator
var operatorToCharMap = (_a = {},
    _a[CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO] = ':',
    _a[CONST_1.default.SEARCH.SYNTAX_OPERATORS.LOWER_THAN] = '<',
    _a[CONST_1.default.SEARCH.SYNTAX_OPERATORS.LOWER_THAN_OR_EQUAL_TO] = '<=',
    _a[CONST_1.default.SEARCH.SYNTAX_OPERATORS.GREATER_THAN] = '>',
    _a[CONST_1.default.SEARCH.SYNTAX_OPERATORS.GREATER_THAN_OR_EQUAL_TO] = '>=',
    _a[CONST_1.default.SEARCH.SYNTAX_OPERATORS.NOT_EQUAL_TO] = '!=',
    _a[CONST_1.default.SEARCH.SYNTAX_OPERATORS.AND] = ',',
    _a[CONST_1.default.SEARCH.SYNTAX_OPERATORS.OR] = ' ',
    _a);
// Create reverse lookup maps for O(1) performance
var createKeyToUserFriendlyMap = function () {
    var map = new Map();
    // Map SYNTAX_FILTER_KEYS values to their user-friendly names
    Object.entries(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS).forEach(function (_a) {
        var keyName = _a[0], keyValue = _a[1];
        if (!(keyName in CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS)) {
            return;
        }
        map.set(keyValue, CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS[keyName]);
    });
    // Map SYNTAX_ROOT_KEYS values to their user-friendly names
    Object.entries(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS).forEach(function (_a) {
        var keyName = _a[0], keyValue = _a[1];
        if (!(keyName in CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS)) {
            return;
        }
        map.set(keyValue, CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS[keyName]);
    });
    return map;
};
// Create the maps once at module initialization for performance
var keyToUserFriendlyMap = createKeyToUserFriendlyMap();
/**
 * Lookup a key in the keyToUserFriendlyMap and return the user-friendly key.
 *
 * @example
 * getUserFriendlyKey("taxRate") // returns "tax-rate"
 */
function getUserFriendlyKey(keyName) {
    var _a;
    return ((_a = keyToUserFriendlyMap.get(keyName)) !== null && _a !== void 0 ? _a : keyName);
}
/**
 * Converts a filter value from backend value to user friendly display text.
 *
 * @example
 * getUserFriendlyValues("perDiem") // returns "per-diem"
 */
function getUserFriendlyValue(value) {
    var _a;
    return (_a = CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_VALUES_MAP[value]) !== null && _a !== void 0 ? _a : value;
}
/**
 * @private
 * Returns string value wrapped in quotes "", if the value contains space or &nbsp; (no-breaking space).
 */
function sanitizeSearchValue(str) {
    if (str.includes(' ') || str.includes("\u00A0")) {
        return "\"".concat(str, "\"");
    }
    return str;
}
/**
 * @private
 * Returns date filter value for QueryString.
 */
function buildDateFilterQuery(filterValues, filterKey) {
    var dateOn = filterValues["".concat(filterKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.ON)];
    var dateAfter = filterValues["".concat(filterKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER)];
    var dateBefore = filterValues["".concat(filterKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE)];
    var dateFilters = [];
    if (dateOn) {
        dateFilters.push("".concat(filterKey, ":").concat(dateOn));
    }
    if (dateAfter) {
        dateFilters.push("".concat(filterKey, ">").concat(dateAfter));
    }
    if (dateBefore) {
        dateFilters.push("".concat(filterKey, "<").concat(dateBefore));
    }
    return dateFilters.join(' ');
}
/**
 * @private
 * Returns amount filter value for QueryString.
 */
function buildAmountFilterQuery(filterKey, filterValues) {
    var lessThan = filterValues["".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN)];
    var greaterThan = filterValues["".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN)];
    var amountFilter = '';
    if (greaterThan) {
        amountFilter += "".concat(filterKey, ">").concat(greaterThan);
    }
    if (lessThan && greaterThan) {
        amountFilter += ' ';
    }
    if (lessThan) {
        amountFilter += "".concat(filterKey, "<").concat(lessThan);
    }
    return amountFilter;
}
/**
 * @private
 * Returns string of correctly formatted filter values from QueryFilters object.
 */
function buildFilterValuesString(filterName, queryFilters) {
    var delimiter = filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD ? ' ' : ',';
    var filterValueString = '';
    queryFilters.forEach(function (queryFilter, index) {
        var _a, _b;
        // If the previous queryFilter has the same operator (this rule applies only to eq and neq operators) then append the current value
        if (index !== 0 &&
            ((queryFilter.operator === 'eq' && ((_a = queryFilters === null || queryFilters === void 0 ? void 0 : queryFilters.at(index - 1)) === null || _a === void 0 ? void 0 : _a.operator) === 'eq') || (queryFilter.operator === 'neq' && ((_b = queryFilters.at(index - 1)) === null || _b === void 0 ? void 0 : _b.operator) === 'neq'))) {
            filterValueString += "".concat(delimiter).concat(sanitizeSearchValue(queryFilter.value.toString()));
        }
        else if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD) {
            filterValueString += "".concat(delimiter).concat(sanitizeSearchValue(queryFilter.value.toString()));
        }
        else {
            filterValueString += " ".concat(filterName).concat(operatorToCharMap[queryFilter.operator]).concat(sanitizeSearchValue(queryFilter.value.toString()));
        }
    });
    return filterValueString;
}
/**
 * @private
 * Traverses the AST and returns filters as a QueryFilters object.
 */
function getFilters(queryJSON) {
    var filters = [];
    var filterKeys = Object.values(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS);
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
        var nodeKey = node.left;
        if (!filterKeys.includes(nodeKey)) {
            return;
        }
        var filterArray = [];
        if (!Array.isArray(node.right)) {
            filterArray.push({
                operator: node.operator,
                value: node.right,
            });
        }
        else {
            node.right.forEach(function (element) {
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
    var _a, _b;
    if (SearchAdvancedFiltersForm_1.AMOUNT_FILTER_KEYS.includes(filterName)) {
        if (typeof filterValue === 'string') {
            var backendAmount = (0, CurrencyUtils_1.convertToBackendAmount)(Number(filterValue));
            return Number.isNaN(backendAmount) ? filterValue : backendAmount.toString();
        }
        return filterValue.map(function (amount) {
            var backendAmount = (0, CurrencyUtils_1.convertToBackendAmount)(Number(amount));
            return Number.isNaN(backendAmount) ? amount : backendAmount.toString();
        });
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAYER ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTER ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE) {
        if (typeof filterValue === 'string') {
            return (_b = (_a = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(filterValue)) === null || _a === void 0 ? void 0 : _a.accountID.toString()) !== null && _b !== void 0 ? _b : filterValue;
        }
        return filterValue.map(function (email) { var _a, _b; return (_b = (_a = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email)) === null || _a === void 0 ? void 0 : _a.accountID.toString()) !== null && _b !== void 0 ? _b : email; });
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REPORT_ID || filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID) {
        var cleanIDs = function (value) {
            return value
                .split(',')
                .map(function (id) { return id.trim(); })
                .filter(function (id) { return id.length > 0; })
                .join(',');
        };
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
var customCollator = new Intl.Collator('en', { usage: 'sort', sensitivity: 'variant', numeric: true, caseFirst: 'upper' });
/**
 * @private
 * Computes and returns a numerical hash for a given queryJSON.
 * Sorts the query keys and values to ensure that hashes stay consistent.
 */
function getQueryHashes(query) {
    var orderedQuery = '';
    orderedQuery += "".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.TYPE, ":").concat(query.type);
    orderedQuery += " ".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.STATUS, ":").concat(Array.isArray(query.status) ? query.status.join(',') : query.status);
    orderedQuery += " ".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY, ":").concat(query.groupBy);
    var filterSet = new Set(orderedQuery);
    // Certain filters shouldn't affect whether two searchers are similar or not, since they dont
    // actually filter out results
    var similarSearchIgnoredFilters = new Set([CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY]);
    // Certain filters' values are significant in deciding which search we are on, so we want to include
    // their value when computing the similarSearchHash
    var similarSearchValueBasedFilters = new Set([CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION]);
    query.flatFilters
        .map(function (filter) {
        var filterKey = filter.key;
        var filters = (0, cloneDeep_1.default)(filter.filters);
        filters.sort(function (a, b) { return customCollator.compare(a.value.toString(), b.value.toString()); });
        return { filterString: buildFilterValuesString(filterKey, filters), filterKey: filterKey };
    })
        .sort(function (a, b) { return customCollator.compare(a.filterString, b.filterString); })
        .forEach(function (_a) {
        var filterString = _a.filterString, filterKey = _a.filterKey;
        if (!similarSearchIgnoredFilters.has(filterKey)) {
            filterSet.add(filterKey);
        }
        if (similarSearchValueBasedFilters.has(filterKey)) {
            filterSet.add(filterString.trim());
        }
        orderedQuery += " ".concat(filterString);
    });
    var similarSearchHash = (0, UserUtils_1.hashText)(Array.from(filterSet).join(''), Math.pow(2, 32));
    var recentSearchHash = (0, UserUtils_1.hashText)(orderedQuery, Math.pow(2, 32));
    orderedQuery += " ".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.SORT_BY, ":").concat(query.sortBy);
    orderedQuery += " ".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.SORT_ORDER, ":").concat(query.sortOrder);
    if (query.policyID) {
        orderedQuery += " ".concat(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID, ":").concat(Array.isArray(query.policyID) ? query.policyID.join(',') : query.policyID, " ");
    }
    var primaryHash = (0, UserUtils_1.hashText)(orderedQuery, Math.pow(2, 32));
    return { primaryHash: primaryHash, recentSearchHash: recentSearchHash, similarSearchHash: similarSearchHash };
}
/**
 * Returns whether a given string is a date preset (e.g. Last month)
 */
function isSearchDatePreset(date) {
    return Object.values(CONST_1.default.SEARCH.DATE_PRESETS).some(function (datePreset) { return datePreset === date; });
}
/**
 * Returns whether a given search filter is supported in a given search data type
 */
function isFilterSupported(filter, type) {
    return SearchAdvancedFiltersForm_1.ALLOWED_TYPE_FILTERS[type].some(function (supportedFilter) { return supportedFilter === filter; });
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
        var result = (0, searchParser_1.parse)(query);
        var flatFilters = getFilters(result);
        // Add the full input and hash to the results
        result.inputQuery = query;
        result.flatFilters = flatFilters;
        var _a = getQueryHashes(result), primaryHash = _a.primaryHash, recentSearchHash = _a.recentSearchHash, similarSearchHash = _a.similarSearchHash;
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
        console.error("Error when parsing SearchQuery: \"".concat(query, "\""), e);
    }
}
/**
 * Formats a given `SearchQueryJSON` object into the string version of query.
 * This format of query is the most basic string format and is used as the query param `q` in search URLs.
 *
 * In a way this is the reverse of buildSearchQueryJSON()
 */
function buildSearchQueryString(queryJSON) {
    var queryParts = [];
    var defaultQueryJSON = buildSearchQueryJSON('');
    for (var _i = 0, _a = Object.entries(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[1];
        var existingFieldValue = queryJSON === null || queryJSON === void 0 ? void 0 : queryJSON[key];
        var queryFieldValue = existingFieldValue !== null && existingFieldValue !== void 0 ? existingFieldValue : defaultQueryJSON === null || defaultQueryJSON === void 0 ? void 0 : defaultQueryJSON[key];
        if (queryFieldValue) {
            if (Array.isArray(queryFieldValue)) {
                queryParts.push("".concat(key, ":").concat(queryFieldValue.join(',')));
            }
            else {
                queryParts.push("".concat(key, ":").concat(queryFieldValue));
            }
        }
    }
    if (queryJSON === null || queryJSON === void 0 ? void 0 : queryJSON.policyID) {
        queryParts.push("".concat(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID, ":").concat(Array.isArray(queryJSON.policyID) ? queryJSON.policyID.join(',') : queryJSON.policyID));
    }
    if (!queryJSON) {
        return queryParts.join(' ');
    }
    var filters = queryJSON.flatFilters;
    for (var _c = 0, filters_1 = filters; _c < filters_1.length; _c++) {
        var filter = filters_1[_c];
        var filterValueString = buildFilterValuesString(filter.key, filter.filters);
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
    var supportedFilterValues = __assign({}, filterValues);
    // When switching types/setting the type, ensure we aren't polluting our query with filters that are
    // only available for the previous type. Remove all filters that are not allowed for the new type
    var providedFilterKeys = Object.keys(supportedFilterValues);
    providedFilterKeys.forEach(function (filter) {
        var _a;
        if (isFilterSupported(filter, (_a = supportedFilterValues.type) !== null && _a !== void 0 ? _a : CONST_1.default.SEARCH.DATA_TYPES.EXPENSE)) {
            return;
        }
        supportedFilterValues[filter] = undefined;
    });
    // We separate type and status filters from other filters to maintain hashes consistency for saved searches
    var type = supportedFilterValues.type, status = supportedFilterValues.status, groupBy = supportedFilterValues.groupBy, otherFilters = __rest(supportedFilterValues, ["type", "status", "groupBy"]);
    var filtersString = [];
    filtersString.push("".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.SORT_BY, ":").concat(CONST_1.default.SEARCH.TABLE_COLUMNS.DATE));
    filtersString.push("".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.SORT_ORDER, ":").concat(CONST_1.default.SEARCH.SORT_ORDER.DESC));
    if (type) {
        var sanitizedType = sanitizeSearchValue(type);
        filtersString.push("".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.TYPE, ":").concat(sanitizedType));
    }
    if (groupBy) {
        var sanitizedGroupBy = sanitizeSearchValue(groupBy);
        filtersString.push("".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY, ":").concat(sanitizedGroupBy));
    }
    if (status && typeof status === 'string') {
        var sanitizedStatus = sanitizeSearchValue(status);
        filtersString.push("".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.STATUS, ":").concat(sanitizedStatus));
    }
    if (status && Array.isArray(status)) {
        var filterValueArray = __spreadArray([], new Set(status), true);
        filtersString.push("".concat(CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.STATUS, ":").concat(filterValueArray.map(sanitizeSearchValue).join(',')));
    }
    var mappedFilters = Object.entries(otherFilters)
        .map(function (_a) {
        var filterKey = _a[0], filterValue = _a[1];
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
            var keyInCorrectForm = Object.keys(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS).find(function (key) { return CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[key] === filterKey; });
            if (keyInCorrectForm) {
                return "".concat(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[keyInCorrectForm], ":").concat(sanitizeSearchValue(filterValue));
            }
        }
        if ((filterKey === SearchAdvancedFiltersForm_1.default.REPORT_ID || filterKey === SearchAdvancedFiltersForm_1.default.WITHDRAWAL_ID) && filterValue) {
            var reportIDs = filterValue
                .split(',')
                .map(function (id) { return sanitizeSearchValue(id.trim()); })
                .filter(function (id) { return id.length > 0; });
            var keyInCorrectForm = Object.keys(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS).find(function (key) { return CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[key] === filterKey; });
            if (keyInCorrectForm && reportIDs.length > 0) {
                return "".concat(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[keyInCorrectForm], ":").concat(reportIDs.join(','));
            }
        }
        if (filterKey === SearchAdvancedFiltersForm_1.default.KEYWORD && filterValue) {
            var value = filterValue.split(' ').map(sanitizeSearchValue).join(' ');
            return "".concat(value);
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
            var filterValueArray = __spreadArray([], new Set(filterValue), true);
            var keyInCorrectForm = Object.keys(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS).find(function (key) { return CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[key] === filterKey; });
            if (keyInCorrectForm) {
                return "".concat(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS[keyInCorrectForm], ":").concat(filterValueArray.map(sanitizeSearchValue).join(','));
            }
        }
        return undefined;
    })
        .filter(function (filter) { return !!filter; });
    filtersString.push.apply(filtersString, mappedFilters);
    SearchAdvancedFiltersForm_1.DATE_FILTER_KEYS.forEach(function (dateKey) {
        var dateFilter = buildDateFilterQuery(supportedFilterValues, dateKey);
        filtersString.push(dateFilter);
    });
    SearchAdvancedFiltersForm_1.AMOUNT_FILTER_KEYS.forEach(function (filterKey) {
        var amountFilter = buildAmountFilterQuery(filterKey, supportedFilterValues);
        filtersString.push(amountFilter);
    });
    return filtersString.filter(Boolean).join(' ').trim();
}
function getAllPolicyValues(policyID, key, policyData) {
    if (!policyData || !policyID) {
        return [];
    }
    return policyID.map(function (id) { return policyData === null || policyData === void 0 ? void 0 : policyData["".concat(key).concat(id)]; }).filter(function (data) { return !!data; });
}
/**
 * Generates object with search filter values, in a format that can be consumed by SearchAdvancedFiltersForm.
 * Main usage of this is to generate the initial values for AdvancedFilters from existing query.
 *
 * Reverse operation of buildQueryStringFromFilterFormValues()
 */
function buildFilterFormValuesFromQuery(queryJSON, policyCategories, policyTags, currencyList, personalDetails, cardList, reports, taxRates) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var filters = queryJSON.flatFilters;
    var filtersForm = {};
    var policyID = queryJSON.policyID;
    var _loop_1 = function (queryFilter) {
        var filterKey = queryFilter.key;
        var filterList = queryFilter.filters;
        var filterValues = filterList.map(function (item) { return item.value.toString(); });
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
            var validExpenseTypes_1 = new Set(Object.values(CONST_1.default.SEARCH.TRANSACTION_TYPE));
            filtersForm[filterKey] = filterValues.filter(function (expenseType) { return validExpenseTypes_1.has(expenseType); });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.HAS) {
            var validHasTypes_1 = new Set(Object.values(CONST_1.default.SEARCH.HAS_VALUES));
            filtersForm[filterKey] = filterValues.filter(function (hasType) { return validHasTypes_1.has(hasType); });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_TYPE) {
            var validWithdrawalTypes_1 = new Set(Object.values(CONST_1.default.SEARCH.WITHDRAWAL_TYPE));
            filtersForm[filterKey] = filterValues
                .filter(function (withdrawalType) { return validWithdrawalTypes_1.has(withdrawalType); })
                .at(0);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID) {
            filtersForm[filterKey] = filterValues.filter(function (card) { return cardList[card]; });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED) {
            filtersForm[filterKey] = filterValues.filter(function (feed) { return feed; });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE) {
            var allTaxRates_1 = new Set(Object.values(taxRates).flat());
            filtersForm[filterKey] = filterValues.filter(function (tax) { return allTaxRates_1.has(tax); });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN) {
            filtersForm[filterKey] = filterValues.filter(function (id) { var _a; return (_a = reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(id)]) === null || _a === void 0 ? void 0 : _a.reportID; });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTER ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE) {
            filtersForm[filterKey] = filterValues.filter(function (id) { return personalDetails && personalDetails[id]; });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAYER) {
            filtersForm[filterKey] = filterValues.find(function (id) { return personalDetails && personalDetails[id]; });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY || filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_CURRENCY) {
            var validCurrency_1 = new Set(Object.keys(currencyList));
            filtersForm[filterKey] = filterValues.filter(function (currency) { return validCurrency_1.has(currency); });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY) {
            var validCurrency_2 = new Set(Object.keys(currencyList));
            filtersForm[filterKey] = filterValues.filter(function (currency) { return validCurrency_2.has(currency); }).at(0);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG) {
            var tags = policyID
                ? getAllPolicyValues(policyID, ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, policyTags)
                    .map(function (tagList) { return (0, PolicyUtils_1.getTagNamesFromTagsLists)(tagList !== null && tagList !== void 0 ? tagList : {}); })
                    .flat()
                : Object.values(policyTags !== null && policyTags !== void 0 ? policyTags : {})
                    .filter(function (item) { return !!item; })
                    .map(function (tagList) { return (0, PolicyUtils_1.getTagNamesFromTagsLists)(tagList !== null && tagList !== void 0 ? tagList : {}); })
                    .flat();
            var uniqueTags_1 = new Set(tags);
            uniqueTags_1.add(CONST_1.default.SEARCH.TAG_EMPTY_VALUE);
            filtersForm[filterKey] = filterValues.filter(function (name) { return uniqueTags_1.has(name); });
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY) {
            var categories = policyID
                ? getAllPolicyValues(policyID, ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, policyCategories)
                    .map(function (item) { return Object.values(item !== null && item !== void 0 ? item : {}).map(function (category) { return category.name; }); })
                    .flat()
                : Object.values(policyCategories !== null && policyCategories !== void 0 ? policyCategories : {})
                    .map(function (item) { return Object.values(item !== null && item !== void 0 ? item : {}).map(function (category) { return category.name; }); })
                    .flat();
            var uniqueCategories_1 = new Set(categories);
            var emptyCategories = CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE.split(',');
            var hasEmptyCategoriesInFilter = emptyCategories.every(function (category) { return filterValues.includes(category); });
            // We split CATEGORY_EMPTY_VALUE into individual values to detect both are present in filterValues.
            // If empty categories are found, append the CATEGORY_EMPTY_VALUE to filtersForm.
            filtersForm[filterKey] = filterValues.filter(function (name) { return uniqueCategories_1.has(name); }).concat(hasEmptyCategoriesInFilter ? [CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE] : []);
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD) {
            filtersForm[filterKey] = filterValues === null || filterValues === void 0 ? void 0 : filterValues.map(function (filter) {
                if (filter.includes(' ')) {
                    return "\"".concat(filter, "\"");
                }
                return filter;
            }).join(' ');
        }
        if (SearchAdvancedFiltersForm_1.DATE_FILTER_KEYS.includes(filterKey)) {
            var beforeKey = "".concat(filterKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE);
            var afterKey = "".concat(filterKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER);
            var onKey = "".concat(filterKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.ON);
            var beforeFilter = filterList.find(function (filter) { return filter.operator === 'lt' && (0, ValidationUtils_1.isValidDate)(filter.value.toString()); });
            var afterFilter = filterList.find(function (filter) { return filter.operator === 'gt' && (0, ValidationUtils_1.isValidDate)(filter.value.toString()); });
            // The `On` filter could be either a date or a date preset (e.g. Last month)
            var onFilter = filterList.find(function (filter) { return filter.operator === 'eq' && ((0, ValidationUtils_1.isValidDate)(filter.value.toString()) || isSearchDatePreset(filter.value.toString())); });
            filtersForm[beforeKey] = (_a = beforeFilter === null || beforeFilter === void 0 ? void 0 : beforeFilter.value.toString()) !== null && _a !== void 0 ? _a : filtersForm[beforeKey];
            filtersForm[afterKey] = (_b = afterFilter === null || afterFilter === void 0 ? void 0 : afterFilter.value.toString()) !== null && _b !== void 0 ? _b : filtersForm[afterKey];
            filtersForm[onKey] = (_c = onFilter === null || onFilter === void 0 ? void 0 : onFilter.value.toString()) !== null && _c !== void 0 ? _c : filtersForm[onKey];
        }
        if (SearchAdvancedFiltersForm_1.AMOUNT_FILTER_KEYS.includes(filterKey)) {
            var lessThanKey = "".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN);
            var greaterThanKey = "".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN);
            // backend amount is an integer and is 2 digits longer than frontend amount
            filtersForm[lessThanKey] =
                (_e = (_d = filterList.find(function (filter) { return filter.operator === 'lt' && (0, MoneyRequestUtils_1.validateAmount)(filter.value.toString(), 0, CONST_1.default.IOU.AMOUNT_MAX_LENGTH + 2); })) === null || _d === void 0 ? void 0 : _d.value.toString()) !== null && _e !== void 0 ? _e : filtersForm[lessThanKey];
            filtersForm[greaterThanKey] =
                (_g = (_f = filterList.find(function (filter) { return filter.operator === 'gt' && (0, MoneyRequestUtils_1.validateAmount)(filter.value.toString(), 0, CONST_1.default.IOU.AMOUNT_MAX_LENGTH + 2); })) === null || _f === void 0 ? void 0 : _f.value.toString()) !== null && _g !== void 0 ? _g : filtersForm[greaterThanKey];
        }
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE || filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE) {
            var validBooleanTypes = Object.values(CONST_1.default.SEARCH.BOOLEAN);
            filtersForm[filterKey] = validBooleanTypes.find(function (value) { return filterValues.at(0) === value; });
        }
    };
    for (var _i = 0, filters_2 = filters; _i < filters_2.length; _i++) {
        var queryFilter = filters_2[_i];
        _loop_1(queryFilter);
    }
    var _j = (_h = Object.entries(CONST_1.default.SEARCH.DATA_TYPES).find(function (_a) {
        var value = _a[1];
        return value === queryJSON.type;
    })) !== null && _h !== void 0 ? _h : [], typeKey = _j[0], typeValue = _j[1];
    filtersForm[SearchAdvancedFiltersForm_1.default.TYPE] = typeValue ? queryJSON.type : CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
    if (typeKey) {
        if (Array.isArray(queryJSON.status)) {
            var validStatuses = queryJSON.status.filter(function (status) { return Object.values(CONST_1.default.SEARCH.STATUS[typeKey]).includes(status); });
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
    var _a, _b, _c, _d, _e;
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAYER ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTER ||
        filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE) {
        // login can be an empty string
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return ((_a = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[filterValue]) === null || _a === void 0 ? void 0 : _a.displayName) || filterValue;
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID) {
        var cardID = parseInt(filterValue, 10);
        if (Number.isNaN(cardID)) {
            return filterValue;
        }
        return (0, CardUtils_1.getCardDescription)(cardList === null || cardList === void 0 ? void 0 : cardList[cardID]) || filterValue;
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN) {
        return (0, ReportUtils_1.getReportName)(reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(filterValue)]) || filterValue;
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.AMOUNT || filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TOTAL || filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_AMOUNT) {
        var frontendAmount = (0, CurrencyUtils_1.convertToFrontendAmountAsInteger)(Number(filterValue));
        return Number.isNaN(frontendAmount) ? filterValue : frontendAmount.toString();
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG) {
        return (0, PolicyUtils_1.getCleanedTagName)(filterValue);
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED) {
        var cardFeedsForDisplay = (0, CardFeedUtils_1.getCardFeedsForDisplay)(cardFeeds, cardList);
        return (_c = (_b = cardFeedsForDisplay[filterValue]) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : filterValue;
    }
    if (filterName === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID) {
        return (_e = (_d = policies === null || policies === void 0 ? void 0 : policies["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(filterValue)]) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : filterValue;
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
    var type = queryJSON.type, status = queryJSON.status, groupBy = queryJSON.groupBy, policyID = queryJSON.policyID;
    var filters = queryJSON.flatFilters;
    var title = status
        ? "type:".concat(getUserFriendlyValue(type), " status:").concat(Array.isArray(status) ? status.map(getUserFriendlyValue).join(',') : getUserFriendlyValue(status))
        : "type:".concat(getUserFriendlyValue(type));
    if (groupBy) {
        title += " group-by:".concat(getUserFriendlyValue(groupBy));
    }
    if (policyID && policyID.length > 0) {
        title += " workspace:".concat(policyID.map(function (id) { var _a, _b; return sanitizeSearchValue((_b = (_a = policies === null || policies === void 0 ? void 0 : policies["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(id)]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : id); }).join(','));
    }
    var _loop_2 = function (filterObject) {
        var key = filterObject.key;
        var queryFilter = filterObject.filters;
        var displayQueryFilters = [];
        if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE) {
            var taxRateIDs = queryFilter.map(function (filter) { return filter.value.toString(); });
            var taxRateNames = taxRateIDs
                .map(function (id) {
                var taxRate = Object.entries(taxRates)
                    .filter(function (_a) {
                    var IDs = _a[1];
                    return IDs.includes(id);
                })
                    .map(function (_a) {
                    var name = _a[0];
                    return name;
                });
                return taxRate.length > 0 ? taxRate : id;
            })
                .flat();
            var uniqueTaxRateNames = __spreadArray([], new Set(taxRateNames), true);
            displayQueryFilters = uniqueTaxRateNames.map(function (taxRate) {
                var _a, _b;
                return ({
                    operator: (_b = (_a = queryFilter.at(0)) === null || _a === void 0 ? void 0 : _a.operator) !== null && _b !== void 0 ? _b : CONST_1.default.SEARCH.SYNTAX_OPERATORS.AND,
                    value: taxRate,
                });
            });
        }
        else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED) {
            displayQueryFilters = queryFilter.reduce(function (acc, filter) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                var feedKey = filter.value.toString();
                var cardFeedsForDisplay = (0, CardFeedUtils_1.getCardFeedsForDisplay)(cardFeeds, cardList);
                var plaidFeedName = (_a = feedKey === null || feedKey === void 0 ? void 0 : feedKey.split(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID)) === null || _a === void 0 ? void 0 : _a.at(1);
                var regularBank = (_c = (_b = feedKey === null || feedKey === void 0 ? void 0 : feedKey.split('_')) === null || _b === void 0 ? void 0 : _b.at(1)) !== null && _c !== void 0 ? _c : CONST_1.default.DEFAULT_NUMBER_ID;
                var idPrefix = (_e = (_d = feedKey === null || feedKey === void 0 ? void 0 : feedKey.split('_')) === null || _d === void 0 ? void 0 : _d.at(0)) !== null && _e !== void 0 ? _e : CONST_1.default.DEFAULT_NUMBER_ID;
                var plaidValue = (_f = cardFeedsForDisplay["".concat(idPrefix, "_").concat(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID).concat(plaidFeedName)]) === null || _f === void 0 ? void 0 : _f.name;
                if (plaidFeedName) {
                    if (plaidValue) {
                        acc.push({ operator: filter.operator, value: plaidValue });
                    }
                    return acc;
                }
                var value = (_h = (_g = cardFeedsForDisplay["".concat(idPrefix, "_").concat(regularBank)]) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : feedKey;
                acc.push({ operator: filter.operator, value: value });
                return acc;
            }, []);
        }
        else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID) {
            displayQueryFilters = queryFilter.reduce(function (acc, filter) {
                var cardValue = filter.value.toString();
                var cardID = parseInt(cardValue, 10);
                if (cardList === null || cardList === void 0 ? void 0 : cardList[cardID]) {
                    if (Number.isNaN(cardID)) {
                        acc.push({ operator: filter.operator, value: cardID });
                    }
                    else {
                        acc.push({ operator: filter.operator, value: (0, CardUtils_1.getCardDescription)(cardList === null || cardList === void 0 ? void 0 : cardList[cardID]) || cardID });
                    }
                }
                return acc;
            }, []);
        }
        else {
            displayQueryFilters = queryFilter.map(function (filter) { return ({
                operator: filter.operator,
                value: getFilterDisplayValue(key, getUserFriendlyValue(filter.value.toString()), PersonalDetails, reports, cardList, cardFeeds, policies),
            }); });
        }
        title += buildFilterValuesString(getUserFriendlyKey(key), displayQueryFilters);
    };
    for (var _i = 0, filters_3 = filters; _i < filters_3.length; _i++) {
        var filterObject = filters_3[_i];
        _loop_2(filterObject);
    }
    return title;
}
/**
 * Returns properly built QueryString for a canned query, with the optional policyID.
 */
function buildCannedSearchQuery(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? CONST_1.default.SEARCH.DATA_TYPES.EXPENSE : _c, status = _b.status, policyID = _b.policyID, cardID = _b.cardID, groupBy = _b.groupBy;
    var queryString = status ? "type:".concat(type, " status:").concat(Array.isArray(status) ? status.join(',') : status) : "type:".concat(type);
    if (groupBy) {
        queryString += " group-by:".concat(groupBy);
    }
    if (policyID) {
        queryString += " policyID:".concat(policyID);
    }
    if (cardID) {
        queryString += " expense-type:card card:".concat(cardID);
    }
    // Parse the query to fill all default query fields with values
    var normalizedQueryJSON = buildSearchQueryJSON(queryString);
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
var sortOptionsWithEmptyValue = function (a, b, localeCompare) {
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
    var standardQuery = (0, cloneDeep_1.default)(queryJSON);
    var filters = standardQuery.filters;
    var traverse = function (node) {
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
    var queryJSON = buildSearchQueryJSON(query);
    if (!queryJSON) {
        Log_1.default.alert("".concat(CONST_1.default.ERROR.ENSURE_BUG_BOT, " user query failed to parse"), {}, false);
        return;
    }
    var standardizedQuery = traverseAndUpdatedQuery(queryJSON, getUpdatedFilterValue);
    return buildSearchQueryString(standardizedQuery);
}
function getCurrentSearchQueryJSON() {
    var _a;
    var rootState = navigationRef_1.default.getRootState();
    var lastSearchNavigator = (_a = rootState === null || rootState === void 0 ? void 0 : rootState.routes) === null || _a === void 0 ? void 0 : _a.findLast(function (route) { return route.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR; });
    var lastSearchNavigatorState = lastSearchNavigator && lastSearchNavigator.key ? (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(lastSearchNavigator === null || lastSearchNavigator === void 0 ? void 0 : lastSearchNavigator.key) : undefined;
    if (!lastSearchNavigatorState) {
        return;
    }
    var lastSearchRoute = lastSearchNavigatorState.routes.findLast(function (route) { return route.name === SCREENS_1.default.SEARCH.ROOT; });
    if (!lastSearchRoute || !lastSearchRoute.params) {
        return;
    }
    var searchParams = lastSearchRoute.params.q;
    var queryJSON = buildSearchQueryJSON(searchParams);
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
    var _a;
    var queryJSON = buildSearchQueryJSON(searchQuery);
    if (!queryJSON) {
        return '';
    }
    var keywordFilter = queryJSON.flatFilters.find(function (filter) { return filter.key === 'keyword'; });
    return (_a = keywordFilter === null || keywordFilter === void 0 ? void 0 : keywordFilter.filters.map(function (filter) { return filter.value; }).join(' ')) !== null && _a !== void 0 ? _a : '';
}
function shouldHighlight(referenceText, searchText) {
    if (!referenceText || !searchText) {
        return false;
    }
    var escapedText = searchText
        .toLowerCase()
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var pattern = new RegExp("(^|\\s)".concat(escapedText, "(?=\\s|$)"), 'i');
    return pattern.test(referenceText.toLowerCase());
}
