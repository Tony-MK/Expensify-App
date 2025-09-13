"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useAppFocusEvent = (callback) => {
    (0, react_1.useEffect)(() => {
        const subscription = react_native_1.AppState.addEventListener('change', (appState) => {
            if (appState !== 'active') {
                return;
            }
            callback();
        });
        return () => {
            subscription.remove();
        };
    }, [callback]);
};
exports.default = useAppFocusEvent;
