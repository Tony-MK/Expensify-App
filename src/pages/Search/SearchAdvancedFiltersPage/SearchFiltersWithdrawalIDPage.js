"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchFiltersTextBase_1 = require("@components/Search/SearchFiltersTextBase");
const CONST_1 = require("@src/CONST");
function SearchFiltersWithdrawalIDPage() {
    return (<SearchFiltersTextBase_1.default filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID} titleKey="common.withdrawalID" testID={SearchFiltersWithdrawalIDPage.displayName} characterLimit={CONST_1.default.MAX_COMMENT_LENGTH}/>);
}
SearchFiltersWithdrawalIDPage.displayName = 'SearchFiltersWithdrawalIDPage';
exports.default = SearchFiltersWithdrawalIDPage;
