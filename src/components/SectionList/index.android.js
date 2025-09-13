"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseSectionList_1 = require("./BaseSectionList");
function SectionListWithRef({ ref, ...props }) {
    return (<BaseSectionList_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref} 
    // For Android we want to use removeClippedSubviews since it helps manage memory consumption. When we
    // run out memory images stop loading and appear as grey circles
    // eslint-disable-next-line react/jsx-props-no-multi-spaces
    removeClippedSubviews={props.removeClippedSubviews ?? true}/>);
}
SectionListWithRef.displayName = 'SectionListWithRef';
exports.default = SectionListWithRef;
