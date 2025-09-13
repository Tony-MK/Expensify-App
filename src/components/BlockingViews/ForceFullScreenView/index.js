"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullScreenBlockingViewContextProvider_1 = require("@components/FullScreenBlockingViewContextProvider");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function ForceFullScreenView({ children, shouldForceFullScreen = false }) {
    const route = (0, native_1.useRoute)();
    const styles = (0, useThemeStyles_1.default)();
    const { addRouteKey, removeRouteKey } = (0, react_1.useContext)(FullScreenBlockingViewContextProvider_1.FullScreenBlockingViewContext);
    (0, react_1.useEffect)(() => {
        if (!shouldForceFullScreen) {
            return;
        }
        addRouteKey(route.key);
        return () => removeRouteKey(route.key);
    }, [addRouteKey, removeRouteKey, route, shouldForceFullScreen]);
    if (shouldForceFullScreen) {
        return <react_native_1.View style={styles.forcedBlockingViewContainer}>{children}</react_native_1.View>;
    }
    return children;
}
ForceFullScreenView.displayName = 'ForceFullScreenView';
exports.default = ForceFullScreenView;
