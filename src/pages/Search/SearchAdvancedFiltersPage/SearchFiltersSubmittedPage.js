"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchDatePresetFilterBasePage_1 = require("@components/Search/SearchDatePresetFilterBasePage");
const CONST_1 = require("@src/CONST");
function SearchFiltersSubmittedPage() {
    return (<SearchDatePresetFilterBasePage_1.default dateKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.SUBMITTED} titleKey="search.filters.submitted"/>);
}
SearchFiltersSubmittedPage.displayName = 'SearchFiltersSubmittedPage';
exports.default = SearchFiltersSubmittedPage;
