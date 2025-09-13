"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SearchFiltersTextBase_1 = require("@components/Search/SearchFiltersTextBase");
var CONST_1 = require("@src/CONST");
function SearchFiltersDescriptionPage() {
    return (<SearchFiltersTextBase_1.default filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION} titleKey="common.description" testID={SearchFiltersDescriptionPage.displayName} characterLimit={CONST_1.default.DESCRIPTION_LIMIT}/>);
}
SearchFiltersDescriptionPage.displayName = 'SearchFiltersDescriptionPage';
exports.default = SearchFiltersDescriptionPage;
