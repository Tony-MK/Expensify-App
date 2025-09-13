"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Navigation_1 = require("@navigation/Navigation");
/**
 * Custom hook for tracking the first route rendered by navigation and determining focus state.
 *
 * @param [focusExceptionRoutes] - A function or an array of route names to exclude when determining if the current route is focused.
 * @param [shouldConsiderParams=false] - If true, considers route parameters when determining the active route.
 * @returns An object containing the initial route and a state indicating if the current route is focused.
 */
function useFirstRenderRoute(focusExceptionRoutes, shouldConsiderParams = false) {
    const initialRoute = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        Navigation_1.default.isNavigationReady().then(() => {
            if (initialRoute.current) {
                return;
            }
            initialRoute.current = shouldConsiderParams ? Navigation_1.default.getActiveRoute() : Navigation_1.default.getActiveRouteWithoutParams();
        });
    }, [shouldConsiderParams]);
    return {
        get isFocused() {
            const activeRoute = shouldConsiderParams ? Navigation_1.default.getActiveRoute() : Navigation_1.default.getActiveRouteWithoutParams();
            if (!focusExceptionRoutes || typeof focusExceptionRoutes === 'object') {
                const allRoutesToConsider = [initialRoute.current, ...(focusExceptionRoutes ?? [])];
                return allRoutesToConsider.includes(activeRoute);
            }
            return focusExceptionRoutes(initialRoute.current) || initialRoute.current === activeRoute;
        },
        get value() {
            return initialRoute.current;
        },
    };
}
exports.default = useFirstRenderRoute;
