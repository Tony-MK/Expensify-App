"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SearchFiltersCurrencyBase_1 = require("@components/Search/SearchFiltersCurrencyBase");
var CONST_1 = require("@src/CONST");
function SearchFiltersPurchaseCurrencyPage() {
    return (<SearchFiltersCurrencyBase_1.default multiselect title="search.filters.purchaseCurrency" filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_CURRENCY}/>);
}
SearchFiltersPurchaseCurrencyPage.displayName = 'SearchFiltersPurchaseCurrencyPage';
exports.default = SearchFiltersPurchaseCurrencyPage;
