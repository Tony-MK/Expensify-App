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
var react_native_1 = require("react-native");
var BaseNativePlaidLink_1 = require("./BaseNativePlaidLink");
var AppStateTracker = react_native_1.NativeModules.AppStateTracker;
function PlaidLink(_a) {
    var _b = _a.onExit, onExit = _b === void 0 ? function () { } : _b, restProps = __rest(_a, ["onExit"]);
    var _c = (0, react_1.useState)(0), key = _c[0], setKey = _c[1];
    return (<BaseNativePlaidLink_1.default key={key} onExit={function () {
            AppStateTracker.getWasAppRelaunchedFromIcon().then(function (wasAppRelaunchedFromIcon) {
                if (wasAppRelaunchedFromIcon) {
                    setKey(function (prevKey) { return prevKey + 1; });
                    return;
                }
                onExit();
            });
        }} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restProps}/>);
}
exports.default = PlaidLink;
