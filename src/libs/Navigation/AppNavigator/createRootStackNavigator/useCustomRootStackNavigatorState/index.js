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
var isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
// This is an optimization to keep mounted only last few screens in the stack.
function useCustomRootStackNavigatorState(_a) {
    var _b;
    var state = _a.state;
    var lastSplitIndex = state.routes.findLastIndex(function (route) { return (0, isNavigatorName_1.isFullScreenName)(route.name); });
    var indexToSlice = Math.max(0, lastSplitIndex);
    var hasPrevRoute = lastSplitIndex > 0;
    var isPrevFullScreen = (0, isNavigatorName_1.isFullScreenName)((_b = state.routes.at(lastSplitIndex - 1)) === null || _b === void 0 ? void 0 : _b.name);
    // If the route before the last full screen is e.g. RHP, we should leave it in the rendered routes,
    // as there may be display issues (blank screen) when navigating back and recreating that route to render.
    if (hasPrevRoute && !isPrevFullScreen) {
        indexToSlice = lastSplitIndex - 1;
    }
    var routesToRender = state.routes.slice(indexToSlice, state.routes.length);
    return __assign(__assign({}, state), { routes: routesToRender, index: routesToRender.length - 1 });
}
