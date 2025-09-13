"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchFiltersTextBase_1 = require("@components/Search/SearchFiltersTextBase");
const CONST_1 = require("@src/CONST");
function SearchFiltersTitlePage() {
    return (<SearchFiltersTextBase_1.default filterKey={CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TITLE} titleKey="common.title" testID={SearchFiltersTitlePage.displayName} characterLimit={CONST_1.default.TASK_TITLE_CHARACTER_LIMIT}/>);
}
SearchFiltersTitlePage.displayName = 'SearchFiltersTitlePage';
exports.default = SearchFiltersTitlePage;
