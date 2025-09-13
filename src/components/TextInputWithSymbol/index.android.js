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
var BaseTextInputWithSymbol_1 = require("./BaseTextInputWithSymbol");
function TextInputWithSymbol(_a) {
    var _b = _a.onSelectionChange, onSelectionChange = _b === void 0 ? function () { } : _b, ref = _a.ref, props = __rest(_a, ["onSelectionChange", "ref"]);
    var _c = (0, react_1.useState)(false), skipNextSelectionChange = _c[0], setSkipNextSelectionChange = _c[1];
    (0, react_1.useEffect)(function () {
        setSkipNextSelectionChange(true);
    }, [props.formattedAmount]);
    return (<BaseTextInputWithSymbol_1.default 
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props} ref={ref} onSelectionChange={function (event) {
            if (skipNextSelectionChange) {
                setSkipNextSelectionChange(false);
                return;
            }
            onSelectionChange(event.nativeEvent.selection.start, event.nativeEvent.selection.end);
        }}/>);
}
TextInputWithSymbol.displayName = 'TextInputWithSymbol';
exports.default = TextInputWithSymbol;
