"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchFiltersAmountBase_1 = require("@components/Search/SearchFiltersAmountBase");
const CONST_1 = require("@src/CONST");
function SearchFiltersPurchaseAmountPage() {
    return (<SearchFiltersAmountBase_1.default filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_AMOUNT} title="common.purchaseAmount" testID={SearchFiltersPurchaseAmountPage.displayName}/>);
}
SearchFiltersPurchaseAmountPage.displayName = 'SearchFiltersPurchaseAmountPage';
exports.default = SearchFiltersPurchaseAmountPage;
