"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCustomRootStackNavigatorState;
var native_1 = require("@react-navigation/native");
var isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
var RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
// Swiping back on iOS does not work properly when the preloaded route has gestureEnabled set to false.
// Therefore, on screens where swiping should work, preloadedRoutes will be an empty array during rendering to ensure swiping works properly.
// Once this bug is fixed, this file should be deleted and index.android.ts renamed to index.native.ts.
// https://github.com/react-navigation/react-navigation/issues/12683
function getShouldHidePreloadedRoutes(route) {
    var _a, _b;
    if (!route) {
        return false;
    }
    // Swiping back should work in any navigator except full screen navigators.
    // This only does not apply to the WorkspaceSplitNavigator, as it has a sidebar screen where users can swipe back to navigate to the workspace list.
    if (!(0, isNavigatorName_1.isFullScreenName)(route.name) || route.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR) {
        return true;
    }
    // If the fullscreen navigator has only one route and it is not a sidebar, preloadedRoutes have to be hidden for swipe to work properly.
    // For more routes in the navigator, swipe works correctly.
    var focusedRoute = ((_b = (_a = route.state) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.length) === 1 ? (0, native_1.findFocusedRoute)(route.state) : undefined;
    if (!focusedRoute) {
        return false;
    }
    return focusedRoute.name !== RELATIONS_1.SPLIT_TO_SIDEBAR[route.name];
}
// This is an optimization to keep mounted only last few screens in the stack.
// On native platforms, we store the last two routes to handle swiping back.
function useCustomRootStackNavigatorState(_a) {
    var state = _a.state;
    var lastSplitIndex = state.routes.findLastIndex(function (route) { return (0, isNavigatorName_1.isFullScreenName)(route.name); });
    var routesToRender = state.routes.slice(Math.max(0, lastSplitIndex - 1), state.routes.length);
    var stateToRender = __assign(__assign({}, state), { routes: routesToRender, index: routesToRender.length - 1 });
    if (getShouldHidePreloadedRoutes(stateToRender.routes.at(-1))) {
        return __assign(__assign({}, stateToRender), { preloadedRoutes: [] });
    }
    return stateToRender;
}
