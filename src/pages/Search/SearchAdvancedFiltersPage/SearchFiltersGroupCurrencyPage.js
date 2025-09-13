"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchFiltersCurrencyBase_1 = require("@components/Search/SearchFiltersCurrencyBase");
const CONST_1 = require("@src/CONST");
function SearchFiltersGroupCurrencyPage() {
    return (<SearchFiltersCurrencyBase_1.default title="common.groupCurrency" filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY}/>);
}
SearchFiltersGroupCurrencyPage.displayName = 'SearchFiltersGroupCurrencyPage';
exports.default = SearchFiltersGroupCurrencyPage;
