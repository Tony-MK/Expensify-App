"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMouseContext = void 0;
exports.MouseProvider = MouseProvider;
const react_1 = require("react");
const MouseContext = (0, react_1.createContext)({
    isMouseDownOnInput: false,
    setMouseDown: () => { },
    setMouseUp: () => { },
});
function MouseProvider({ children }) {
    const [isMouseDownOnInput, setIsMouseDownOnInput] = (0, react_1.useState)(false);
    const setMouseDown = () => setIsMouseDownOnInput(true);
    const setMouseUp = () => setIsMouseDownOnInput(false);
    const value = (0, react_1.useMemo)(() => ({ isMouseDownOnInput, setMouseDown, setMouseUp }), [isMouseDownOnInput]);
    return <MouseContext.Provider value={value}>{children}</MouseContext.Provider>;
}
const useMouseContext = () => (0, react_1.useContext)(MouseContext);
exports.useMouseContext = useMouseContext;
