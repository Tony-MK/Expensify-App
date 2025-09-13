"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SearchDatePresetFilterBasePage_1 = require("@components/Search/SearchDatePresetFilterBasePage");
var CONST_1 = require("@src/CONST");
function SearchFiltersApprovedPage() {
    return (<SearchDatePresetFilterBasePage_1.default dateKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.APPROVED} titleKey="search.filters.approved"/>);
}
SearchFiltersApprovedPage.displayName = 'SearchFiltersApprovedPage';
exports.default = SearchFiltersApprovedPage;
