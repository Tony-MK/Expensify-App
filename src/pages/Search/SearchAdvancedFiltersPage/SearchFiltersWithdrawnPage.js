"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchDatePresetFilterBasePage_1 = require("@components/Search/SearchDatePresetFilterBasePage");
const CONST_1 = require("@src/CONST");
function SearchFiltersWithdrawnPage() {
    return (<SearchDatePresetFilterBasePage_1.default dateKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWN} titleKey="search.filters.withdrawn"/>);
}
SearchFiltersWithdrawnPage.displayName = 'SearchFiltersWithdrawnPage';
exports.default = SearchFiltersWithdrawnPage;
