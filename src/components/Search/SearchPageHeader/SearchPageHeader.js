"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SearchContext_1 = require("@components/Search/SearchContext");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var SearchSelectedNarrow_1 = require("@pages/Search/SearchSelectedNarrow");
var SearchPageHeaderInput_1 = require("./SearchPageHeaderInput");
function SearchPageHeader(_a) {
    var queryJSON = _a.queryJSON, searchRouterListVisible = _a.searchRouterListVisible, hideSearchRouterList = _a.hideSearchRouterList, onSearchRouterFocus = _a.onSearchRouterFocus, headerButtonsOptions = _a.headerButtonsOptions, handleSearch = _a.handleSearch, isMobileSelectionModeEnabled = _a.isMobileSelectionModeEnabled;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var selectedTransactions = (0, SearchContext_1.useSearchContext)().selectedTransactions;
    var selectedTransactionsKeys = Object.keys(selectedTransactions !== null && selectedTransactions !== void 0 ? selectedTransactions : {});
    if (shouldUseNarrowLayout && isMobileSelectionModeEnabled) {
        return (<SearchSelectedNarrow_1.default options={headerButtonsOptions} itemsLength={selectedTransactionsKeys.length}/>);
    }
    return (<SearchPageHeaderInput_1.default searchRouterListVisible={searchRouterListVisible} onSearchRouterFocus={onSearchRouterFocus} queryJSON={queryJSON} hideSearchRouterList={hideSearchRouterList} handleSearch={handleSearch}/>);
}
SearchPageHeader.displayName = 'SearchPageHeader';
exports.default = SearchPageHeader;
