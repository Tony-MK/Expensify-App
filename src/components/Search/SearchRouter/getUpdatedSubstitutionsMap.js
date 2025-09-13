"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdatedSubstitutionsMap = getUpdatedSubstitutionsMap;
const autocompleteParser_1 = require("@libs/SearchParser/autocompleteParser");
const getSubstitutionsKey = (filterKey, value) => `${filterKey}:${value}`;
/**
 * Given a plaintext query and a SubstitutionMap object,
 * this function will remove any substitution keys that do not appear in the query and return an updated object
 *
 * Ex:
 * query: `Test from:John1`
 * substitutions: {
 *     from:SomeOtherJohn: 12345
 * }
 * return: {}
 */
function getUpdatedSubstitutionsMap(query, substitutions) {
    const parsedQuery = (0, autocompleteParser_1.parse)(query);
    const searchAutocompleteQueryRanges = parsedQuery.ranges;
    if (searchAutocompleteQueryRanges.length === 0) {
        return {};
    }
    const autocompleteQueryKeys = searchAutocompleteQueryRanges.map((range) => getSubstitutionsKey(range.key, range.value));
    // Build a new substitutions map consisting of only the keys from old map, that appear in query
    const updatedSubstitutionMap = autocompleteQueryKeys.reduce((map, key) => {
        if (substitutions[key]) {
            // eslint-disable-next-line no-param-reassign
            map[key] = substitutions[key];
        }
        return map;
    }, {});
    return updatedSubstitutionMap;
}
