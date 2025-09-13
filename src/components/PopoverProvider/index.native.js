"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopoverContext = void 0;
const react_1 = require("react");
const PopoverContext = react_1.default.createContext({
    onOpen: () => { },
    popover: null,
    close: () => { },
    isOpen: false,
    setActivePopoverExtraAnchorRef: () => { },
});
exports.PopoverContext = PopoverContext;
function PopoverContextProvider(props) {
    const contextValue = react_1.default.useMemo(() => ({
        onOpen: () => { },
        close: () => { },
        popover: null,
        isOpen: false,
        setActivePopoverExtraAnchorRef: () => { },
    }), []);
    return <PopoverContext.Provider value={contextValue}>{props.children}</PopoverContext.Provider>;
}
PopoverContextProvider.displayName = 'PopoverContextProvider';
exports.default = PopoverContextProvider;
