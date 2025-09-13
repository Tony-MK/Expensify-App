"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchContext_1 = require("@components/Search/SearchContext");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const SearchSelectedNarrow_1 = require("@pages/Search/SearchSelectedNarrow");
const SearchPageHeaderInput_1 = require("./SearchPageHeaderInput");
function SearchPageHeader({ queryJSON, searchRouterListVisible, hideSearchRouterList, onSearchRouterFocus, headerButtonsOptions, handleSearch, isMobileSelectionModeEnabled, }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { selectedTransactions } = (0, SearchContext_1.useSearchContext)();
    const selectedTransactionsKeys = Object.keys(selectedTransactions ?? {});
    if (shouldUseNarrowLayout && isMobileSelectionModeEnabled) {
        return (<SearchSelectedNarrow_1.default options={headerButtonsOptions} itemsLength={selectedTransactionsKeys.length}/>);
    }
    return (<SearchPageHeaderInput_1.default searchRouterListVisible={searchRouterListVisible} onSearchRouterFocus={onSearchRouterFocus} queryJSON={queryJSON} hideSearchRouterList={hideSearchRouterList} handleSearch={handleSearch}/>);
}
SearchPageHeader.displayName = 'SearchPageHeader';
exports.default = SearchPageHeader;
