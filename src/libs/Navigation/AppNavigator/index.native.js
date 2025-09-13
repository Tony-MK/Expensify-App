"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useOnyx_1 = require("@hooks/useOnyx");
var CONFIG_1 = require("@src/CONFIG");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function AppNavigator(_a) {
    var authenticated = _a.authenticated;
    var hybridApp = (0, useOnyx_1.default)(ONYXKEYS_1.default.HYBRID_APP, { canBeMissing: true })[0];
    var shouldShowAuthScreens = (0, react_1.useMemo)(function () {
        if (!CONFIG_1.default.IS_HYBRID_APP) {
            return authenticated;
        }
        return authenticated && (hybridApp === null || hybridApp === void 0 ? void 0 : hybridApp.readyToShowAuthScreens);
    }, [hybridApp === null || hybridApp === void 0 ? void 0 : hybridApp.readyToShowAuthScreens, authenticated]);
    if (shouldShowAuthScreens) {
        var AuthScreens = require('./AuthScreens').default;
        // These are the protected screens and only accessible when an authToken is present
        return <AuthScreens />;
    }
    var PublicScreens = require('./PublicScreens').default;
    return <PublicScreens />;
}
AppNavigator.displayName = 'AppNavigator';
exports.default = (0, react_1.memo)(AppNavigator);
