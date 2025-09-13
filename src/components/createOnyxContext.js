"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
exports.default = (onyxKeyName) => {
    const Context = (0, react_1.createContext)(null);
    function Provider(props) {
        const [value] = (0, useOnyx_1.default)(onyxKeyName, {
            canBeMissing: true,
        });
        return <Context.Provider value={value}>{props.children}</Context.Provider>;
    }
    Provider.displayName = `${expensify_common_1.Str.UCFirst(onyxKeyName)}Provider`;
    const useOnyxContext = () => {
        const value = (0, react_1.useContext)(Context);
        if (value === null) {
            throw new Error(`useOnyxContext must be used within a OnyxListItemProvider [key: ${onyxKeyName}]`);
        }
        return value;
    };
    return [Provider, Context, useOnyxContext];
};
