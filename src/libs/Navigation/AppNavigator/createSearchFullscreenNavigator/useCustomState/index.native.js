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
exports.default = useCustomState;
var SCREENS_1 = require("@src/SCREENS");
/**
 * This is a custom state hook for SearchFullscreenNavigator that is used to render the last two search routes in the stack.
 * For native platforms, we render the last two routes to allow users to return by swiping left.
 * @see SearchFullscreenNavigator use only!
 */
function useCustomState(_a) {
    var state = _a.state;
    var lastSearchNavigatorIndex = state.routes.findLastIndex(function (route) { return route.name === SCREENS_1.default.SEARCH.ROOT; });
    var routesToRender = state.routes.slice(Math.max(0, lastSearchNavigatorIndex), state.routes.length);
    return __assign(__assign({}, state), { routes: routesToRender, index: routesToRender.length - 1 });
}
