"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchFiltersCurrencyBase_1 = require("@components/Search/SearchFiltersCurrencyBase");
const CONST_1 = require("@src/CONST");
function SearchFiltersCurrencyPage() {
    return (<SearchFiltersCurrencyBase_1.default multiselect title="search.filters.currency" filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY}/>);
}
SearchFiltersCurrencyPage.displayName = 'SearchFiltersCurrencyPage';
exports.default = SearchFiltersCurrencyPage;
