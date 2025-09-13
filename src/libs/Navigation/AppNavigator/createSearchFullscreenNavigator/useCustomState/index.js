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
/**
 * This is a custom state hook for SearchFullscreenNavigator that is used to render the last search route in the stack.
 * We do this to improve the performance of the search results screen by avoiding unnecessary re-renders of underneath routes.
 * @see SearchFullscreenNavigator use only!
 */
function useCustomState(_a) {
    var state = _a.state;
    var routesToRender = state.routes.slice(-1);
    return __assign(__assign({}, state), { routes: routesToRender, index: routesToRender.length - 1 });
}
