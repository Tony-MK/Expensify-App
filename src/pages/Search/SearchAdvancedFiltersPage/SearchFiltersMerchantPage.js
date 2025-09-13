"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SearchFiltersTextBase_1 = require("@components/Search/SearchFiltersTextBase");
var CONST_1 = require("@src/CONST");
function SearchFiltersMerchantPage() {
    return (<SearchFiltersTextBase_1.default filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.MERCHANT} titleKey="common.merchant" testID={SearchFiltersMerchantPage.displayName} characterLimit={CONST_1.default.MERCHANT_NAME_MAX_BYTES}/>);
}
SearchFiltersMerchantPage.displayName = 'SearchFiltersMerchantPage';
exports.default = SearchFiltersMerchantPage;
