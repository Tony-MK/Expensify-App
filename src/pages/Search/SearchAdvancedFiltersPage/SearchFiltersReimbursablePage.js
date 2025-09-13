"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchBooleanFilterBasePage_1 = require("@components/Search/SearchBooleanFilterBasePage");
const CONST_1 = require("@src/CONST");
function SearchFiltersReimbursablePage() {
    return (<SearchBooleanFilterBasePage_1.default booleanKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE} titleKey="search.filters.reimbursable"/>);
}
SearchFiltersReimbursablePage.displayName = 'SearchFiltersReimbursablePage';
exports.default = SearchFiltersReimbursablePage;
