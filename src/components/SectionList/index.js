"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseSectionList_1 = require("./BaseSectionList");
function SectionList({ ref, ...props }) {
    return (<BaseSectionList_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref}/>);
}
SectionList.displayName = 'SectionList';
exports.default = SectionList;
