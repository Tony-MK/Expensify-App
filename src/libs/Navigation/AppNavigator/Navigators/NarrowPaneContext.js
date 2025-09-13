"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NarrowPaneContextProvider = NarrowPaneContextProvider;
const react_1 = require("react");
const NarrowPaneContext = (0, react_1.createContext)({ isInNarrowPane: false });
const IS_IN_NARROW_PANE_CONTEXT_VALUE = {
    isInNarrowPane: true,
};
function NarrowPaneContextProvider({ children }) {
    return <NarrowPaneContext.Provider value={IS_IN_NARROW_PANE_CONTEXT_VALUE}>{children}</NarrowPaneContext.Provider>;
}
exports.default = NarrowPaneContext;
