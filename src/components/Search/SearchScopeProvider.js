"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchContext_1 = require("./SearchContext");
function SearchScopeProvider({ children, isOnSearch }) {
    const parentContext = (0, SearchContext_1.useSearchContext)();
    const searchContext = (0, react_1.useMemo)(() => ({
        ...parentContext,
        isOnSearch,
    }), [parentContext, isOnSearch]);
    return <SearchContext_1.Context.Provider value={searchContext}>{children}</SearchContext_1.Context.Provider>;
}
exports.default = SearchScopeProvider;
