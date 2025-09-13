"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const usePrevious_1 = require("./usePrevious");
/**
 * This hook filters (and optionally sorts) a dataset based on a search parameter.
 * It utilizes `useTransition` to allow the searchQuery to change rapidly, while more expensive renders that occur using
 * the result of the filtering and sorting are de-prioritized, allowing them to happen in the background.
 */
function useSearchResults(data, filterData, sortData = (d) => d, 
/**
 * Whether to sort data immediately on mount to prevent briefly displaying unsorted data,
 * since sorting is handled inside startTransition.
 */
shouldSortInitialData) {
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const [result, setResult] = (0, react_1.useState)(() => (shouldSortInitialData ? sortData(data) : data));
    const prevData = (0, usePrevious_1.default)(data);
    const [, startTransition] = (0, react_1.useTransition)();
    (0, react_1.useEffect)(() => {
        startTransition(() => {
            const normalizedSearchQuery = inputValue.trim().toLowerCase();
            // Create shallow copy of data to prevent mutation. When no search query exists, we pass the full dataset
            // to sortData. If sortData uses Array.sort() (which sorts in place and returns the same reference),
            // the original data array would be mutated. This breaks React's reference equality check in setResult,
            // preventing re-renders even when the sort order changes (e.g., on page refresh).
            const filtered = normalizedSearchQuery.length ? data.filter((item) => filterData(item, normalizedSearchQuery)) : [...data];
            const sorted = sortData(filtered);
            setResult(sorted);
        });
    }, [data, filterData, inputValue, sortData]);
    (0, react_1.useEffect)(() => {
        if (prevData.length <= CONST_1.default.SEARCH_ITEM_LIMIT || data.length > CONST_1.default.SEARCH_ITEM_LIMIT) {
            return;
        }
        setInputValue('');
    }, [data, prevData]);
    return [inputValue, setInputValue, result];
}
exports.default = useSearchResults;
