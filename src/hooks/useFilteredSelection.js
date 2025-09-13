"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * Custom hook to manage a selection of keys from a given set of options.
 * It filters the selected keys based on a provided filter function whenever the options or the filter change.
 *
 * @param options - Option data
 * @param filter - Filter function
 * @returns A tuple containing the array of selected keys and a function to update the selected keys.
 */
function useFilteredSelection(options, filter) {
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => setSelectedOptions((prevOptions) => prevOptions.filter((key) => filter(options?.[key]))), [options, filter]);
    return [selectedOptions, setSelectedOptions];
}
exports.default = useFilteredSelection;
