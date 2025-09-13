"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchFiltersTextBase_1 = require("@components/Search/SearchFiltersTextBase");
const CONST_1 = require("@src/CONST");
function SearchFiltersKeywordPage() {
    return (<SearchFiltersTextBase_1.default filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD} titleKey="search.filters.keyword" testID={SearchFiltersKeywordPage.displayName} characterLimit={CONST_1.default.MAX_COMMENT_LENGTH}/>);
}
SearchFiltersKeywordPage.displayName = 'SearchFiltersKeywordPage';
exports.default = SearchFiltersKeywordPage;
