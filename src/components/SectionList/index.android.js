"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var BaseSectionList_1 = require("./BaseSectionList");
function SectionListWithRef(_a) {
    var _b;
    var ref = _a.ref, props = __rest(_a, ["ref"]);
    return (<BaseSectionList_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref} 
    // For Android we want to use removeClippedSubviews since it helps manage memory consumption. When we
    // run out memory images stop loading and appear as grey circles
    // eslint-disable-next-line react/jsx-props-no-multi-spaces
    removeClippedSubviews={(_b = props.removeClippedSubviews) !== null && _b !== void 0 ? _b : true}/>);
}
SectionListWithRef.displayName = 'SectionListWithRef';
exports.default = SectionListWithRef;
