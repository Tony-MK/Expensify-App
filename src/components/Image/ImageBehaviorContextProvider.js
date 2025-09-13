"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageBehaviorContext = void 0;
exports.ImageBehaviorContextProvider = ImageBehaviorContextProvider;
const react_1 = require("react");
const ImageBehaviorContext = (0, react_1.createContext)({
    shouldSetAspectRatioInStyle: true,
});
exports.ImageBehaviorContext = ImageBehaviorContext;
function ImageBehaviorContextProvider({ children, ...value }) {
    return <ImageBehaviorContext.Provider value={value}>{children}</ImageBehaviorContext.Provider>;
}
