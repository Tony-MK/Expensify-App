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
    var textInputRef = (0, react_1.useRef)(null);
    return (<BaseTextInputWithSymbol_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={function (element) {
            textInputRef.current = element;
            if (!ref) {
                return;
            }
            if (typeof ref === 'function') {
                ref(element);
                return;
            }
            // eslint-disable-next-line no-param-reassign
            ref.current = element;
        }} onSelectionChange={function (event) {
            onSelectionChange(event.nativeEvent.selection.start, event.nativeEvent.selection.end);
        }} onPress={function () {
            var _a, _b, _c, _d;
            var selectionStart = (_b = (_a = textInputRef.current) === null || _a === void 0 ? void 0 : _a.selectionStart) !== null && _b !== void 0 ? _b : 0;
            var selectionEnd = (_d = (_c = textInputRef.current) === null || _c === void 0 ? void 0 : _c.selectionEnd) !== null && _d !== void 0 ? _d : 0;
            onSelectionChange(selectionStart, selectionEnd);
        }}/>);
}
TextInputWithSymbol.displayName = 'TextInputWithSymbol';
exports.default = TextInputWithSymbol;
