"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCustomState;
const SCREENS_1 = require("@src/SCREENS");
/**
 * This is a custom state hook for SearchFullscreenNavigator that is used to render the last two search routes in the stack.
 * For native platforms, we render the last two routes to allow users to return by swiping left.
 * @see SearchFullscreenNavigator use only!
 */
function useCustomState({ state }) {
    const lastSearchNavigatorIndex = state.routes.findLastIndex((route) => route.name === SCREENS_1.default.SEARCH.ROOT);
    const routesToRender = state.routes.slice(Math.max(0, lastSearchNavigatorIndex), state.routes.length);
    return { ...state, routes: routesToRender, index: routesToRender.length - 1 };
}
