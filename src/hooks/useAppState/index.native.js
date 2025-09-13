"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
function useAppState({ onAppStateChange } = {}) {
    const [appState, setAppState] = react_1.default.useState({
        isForeground: react_native_1.AppState.currentState === 'active',
        isInactive: react_native_1.AppState.currentState === 'inactive',
        isBackground: react_native_1.AppState.currentState === 'background',
    });
    react_1.default.useEffect(() => {
        function handleAppStateChange(nextAppState) {
            setAppState({
                isForeground: nextAppState === 'active',
                isInactive: nextAppState === 'inactive',
                isBackground: nextAppState === 'background',
            });
            onAppStateChange?.(nextAppState);
        }
        const subscription = react_native_1.AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [onAppStateChange]);
    return appState;
}
exports.default = useAppState;
