"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const CONFIG_1 = require("@src/CONFIG");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function AppNavigator({ authenticated }) {
    const [hybridApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.HYBRID_APP, { canBeMissing: true });
    const shouldShowAuthScreens = (0, react_1.useMemo)(() => {
        if (!CONFIG_1.default.IS_HYBRID_APP) {
            return authenticated;
        }
        return authenticated && hybridApp?.readyToShowAuthScreens;
    }, [hybridApp?.readyToShowAuthScreens, authenticated]);
    if (shouldShowAuthScreens) {
        const AuthScreens = require('./AuthScreens').default;
        // These are the protected screens and only accessible when an authToken is present
        return <AuthScreens />;
    }
    const PublicScreens = require('./PublicScreens').default;
    return <PublicScreens />;
}
AppNavigator.displayName = 'AppNavigator';
exports.default = (0, react_1.memo)(AppNavigator);
