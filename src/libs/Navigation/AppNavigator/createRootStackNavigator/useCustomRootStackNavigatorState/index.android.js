"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCustomRootStackNavigatorState;
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
// This is an optimization to keep mounted only last few screens in the stack.
function useCustomRootStackNavigatorState({ state }) {
    const lastSplitIndex = state.routes.findLastIndex((route) => (0, isNavigatorName_1.isFullScreenName)(route.name));
    let indexToSlice = Math.max(0, lastSplitIndex);
    const hasPrevRoute = lastSplitIndex > 0;
    const isPrevFullScreen = (0, isNavigatorName_1.isFullScreenName)(state.routes.at(lastSplitIndex - 1)?.name);
    // If the route before the last full screen is e.g. RHP, we should leave it in the rendered routes,
    // as there may be display issues (blank screen) when navigating back and recreating that route to render.
    if (hasPrevRoute && !isPrevFullScreen) {
        indexToSlice = lastSplitIndex - 1;
    }
    const routesToRender = state.routes.slice(indexToSlice, state.routes.length);
    return { ...state, routes: routesToRender, index: routesToRender.length - 1 };
}
