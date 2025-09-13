"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchBooleanFilterBasePage_1 = require("@components/Search/SearchBooleanFilterBasePage");
const CONST_1 = require("@src/CONST");
function SearchFiltersBillablePage() {
    return (<SearchBooleanFilterBasePage_1.default booleanKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE} titleKey="search.filters.billable"/>);
}
SearchFiltersBillablePage.displayName = 'SearchFiltersBillablePage';
exports.default = SearchFiltersBillablePage;
