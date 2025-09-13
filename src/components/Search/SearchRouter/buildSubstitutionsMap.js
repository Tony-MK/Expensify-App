"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSubstitutionsMap = buildSubstitutionsMap;
const autocompleteParser_1 = require("@libs/SearchParser/autocompleteParser");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const CONST_1 = require("@src/CONST");
const getSubstitutionsKey = (filterKey, value) => `${filterKey}:${value}`;
/**
 * Given a plaintext query and specific entities data,
 * this function will build the substitutions map from scratch for this query
 *
 * Ex:
 * query: `Test from:12345 to:9876`
 * personalDetails: {
 *     12345: JohnDoe
 *     98765: SomeoneElse
 * }
 *
 * return: {
 *     from:JohnDoe: 12345,
 *     to:SomeoneElse: 98765,
 * }
 */
function buildSubstitutionsMap(query, personalDetails, reports, allTaxRates, cardList, cardFeeds, policies) {
    const parsedQuery = (0, autocompleteParser_1.parse)(query);
    const searchAutocompleteQueryRanges = parsedQuery.ranges;
    if (searchAutocompleteQueryRanges.length === 0) {
        return {};
    }
    const substitutionsMap = searchAutocompleteQueryRanges.reduce((map, range) => {
        const { key: filterKey, value: filterValue } = range;
        if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE) {
            const taxRateID = filterValue;
            const taxRates = Object.entries(allTaxRates)
                .filter(([, IDs]) => IDs.includes(taxRateID))
                .map(([name]) => name);
            const taxRateNames = taxRates.length > 0 ? taxRates : [taxRateID];
            const uniqueTaxRateNames = [...new Set(taxRateNames)];
            uniqueTaxRateNames.forEach((taxRateName) => {
                const substitutionKey = getSubstitutionsKey(filterKey, taxRateName);
                // eslint-disable-next-line no-param-reassign
                map[substitutionKey] = taxRateID;
            });
        }
        else if (filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTER ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAYER ||
            filterKey === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE) {
            const displayValue = (0, SearchQueryUtils_1.getFilterDisplayValue)(filterKey, filterValue, personalDetails, reports, cardList, cardFeeds, policies);
            // If displayValue === filterValue, then it means there is nothing to substitute, so we don't add any key to map
            if (displayValue !== filterValue) {
                const substitutionKey = getSubstitutionsKey(filterKey, displayValue);
                // eslint-disable-next-line no-param-reassign
                map[substitutionKey] = filterValue;
            }
        }
        return map;
    }, {});
    return substitutionsMap;
}
