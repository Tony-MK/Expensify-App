"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const lazyRetry_1 = require("@src/utils/lazyRetry");
const AuthScreens = (0, react_1.lazy)(() => (0, lazyRetry_1.default)(() => Promise.resolve().then(() => require('./AuthScreens'))));
const PublicScreens = (0, react_1.lazy)(() => (0, lazyRetry_1.default)(() => Promise.resolve().then(() => require('./PublicScreens'))));
function AppNavigator({ authenticated }) {
    if (authenticated) {
        // These are the protected screens and only accessible when an authToken is present
        return (<react_1.Suspense fallback={null}>
                <AuthScreens />
            </react_1.Suspense>);
    }
    return (<react_1.Suspense fallback={null}>
            <PublicScreens />
        </react_1.Suspense>);
}
AppNavigator.displayName = 'AppNavigator';
exports.default = (0, react_1.memo)(AppNavigator);
