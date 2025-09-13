"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var useOnyx_1 = require("@hooks/useOnyx");
exports.default = (function (onyxKeyName) {
    var Context = (0, react_1.createContext)(null);
    function Provider(props) {
        var value = (0, useOnyx_1.default)(onyxKeyName, {
            canBeMissing: true,
        })[0];
        return <Context.Provider value={value}>{props.children}</Context.Provider>;
    }
    Provider.displayName = "".concat(expensify_common_1.Str.UCFirst(onyxKeyName), "Provider");
    var useOnyxContext = function () {
        var value = (0, react_1.useContext)(Context);
        if (value === null) {
            throw new Error("useOnyxContext must be used within a OnyxListItemProvider [key: ".concat(onyxKeyName, "]"));
        }
        return value;
    };
    return [Provider, Context, useOnyxContext];
});
