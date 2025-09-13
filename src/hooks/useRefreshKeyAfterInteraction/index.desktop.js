"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
function useRefreshKeyAfterInteraction(defaultValue) {
    const [counter, setCounter] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setCounter((prev) => prev + 1);
        });
    }, []);
    return `${defaultValue}-${counter}`;
}
exports.default = useRefreshKeyAfterInteraction;
