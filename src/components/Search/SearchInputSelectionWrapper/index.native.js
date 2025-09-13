"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Deferred_1 = require("@components/Deferred");
const SearchAutocompleteInput_1 = require("@components/Search/SearchAutocompleteInput");
const SearchInputSelectionSkeleton_1 = require("@components/Skeletons/SearchInputSelectionSkeleton");
function SearchInputSelectionWrapper(props, ref) {
    return (<react_1.Suspense fallback={<SearchInputSelectionSkeleton_1.default />}>
            <Deferred_1.default>
                <SearchAutocompleteInput_1.default ref={ref} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} selection={undefined}/>
            </Deferred_1.default>
        </react_1.Suspense>);
}
SearchInputSelectionWrapper.displayName = 'SearchInputSelectionWrapper';
exports.default = (0, react_1.forwardRef)(SearchInputSelectionWrapper);
