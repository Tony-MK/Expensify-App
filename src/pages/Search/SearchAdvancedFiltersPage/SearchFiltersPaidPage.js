"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchDatePresetFilterBasePage_1 = require("@components/Search/SearchDatePresetFilterBasePage");
const CONST_1 = require("@src/CONST");
function SearchFiltersPaidPage() {
    return (<SearchDatePresetFilterBasePage_1.default dateKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAID} titleKey="search.filters.paid"/>);
}
SearchFiltersPaidPage.displayName = 'SearchFiltersPaidPage';
exports.default = SearchFiltersPaidPage;
