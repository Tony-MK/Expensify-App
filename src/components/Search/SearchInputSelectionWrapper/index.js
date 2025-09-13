"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchAutocompleteInput_1 = require("@components/Search/SearchAutocompleteInput");
function SearchInputSelectionWrapper({ selection, ...props }, ref) {
    return (<SearchAutocompleteInput_1.default selection={selection} ref={ref} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
SearchInputSelectionWrapper.displayName = 'SearchInputSelectionWrapper';
exports.default = (0, react_1.forwardRef)(SearchInputSelectionWrapper);
