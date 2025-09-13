"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SearchFiltersAmountBase_1 = require("@components/Search/SearchFiltersAmountBase");
var CONST_1 = require("@src/CONST");
function SearchFiltersAmountPage() {
    return (<SearchFiltersAmountBase_1.default filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.AMOUNT} title="iou.amount" testID={SearchFiltersAmountPage.displayName}/>);
}
SearchFiltersAmountPage.displayName = 'SearchFiltersAmountPage';
exports.default = SearchFiltersAmountPage;
