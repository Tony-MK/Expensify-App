"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullScreenBlockingViewContext = void 0;
const react_1 = require("react");
const defaultValue = {
    addRouteKey: () => { },
    removeRouteKey: () => { },
    isBlockingViewVisible: false,
};
const FullScreenBlockingViewContext = (0, react_1.createContext)(defaultValue);
exports.FullScreenBlockingViewContext = FullScreenBlockingViewContext;
/**
 * Provides a context for getting information about the visibility of a full-screen blocking view.
 * This context allows the blocking view to add or remove route keys, which determine
 * whether the blocking view is displayed on a screen. If there are any route keys present,
 * the blocking view is considered visible.
 * This information is necessary because we don't want to show the TopLevelNavigationTabBar when the blocking view is visible.
 */
function FullScreenBlockingViewContextProvider({ children }) {
    const [routeKeys, setRouteKeys] = (0, react_1.useState)(new Set());
    const addRouteKey = (0, react_1.useCallback)((key) => {
        setRouteKeys((prevKeys) => new Set(prevKeys).add(key));
    }, []);
    const removeRouteKey = (0, react_1.useCallback)((key) => {
        setRouteKeys((prevKeys) => {
            const newKeys = new Set(prevKeys);
            newKeys.delete(key);
            return newKeys;
        });
    }, []);
    const isBlockingViewVisible = (0, react_1.useMemo)(() => routeKeys.size > 0, [routeKeys]);
    const contextValue = (0, react_1.useMemo)(() => ({
        addRouteKey,
        removeRouteKey,
        isBlockingViewVisible,
    }), [addRouteKey, removeRouteKey, isBlockingViewVisible]);
    return <FullScreenBlockingViewContext.Provider value={contextValue}>{children}</FullScreenBlockingViewContext.Provider>;
}
exports.default = FullScreenBlockingViewContextProvider;
