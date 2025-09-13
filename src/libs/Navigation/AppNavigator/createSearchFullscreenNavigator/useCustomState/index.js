"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCustomState;
/**
 * This is a custom state hook for SearchFullscreenNavigator that is used to render the last search route in the stack.
 * We do this to improve the performance of the search results screen by avoiding unnecessary re-renders of underneath routes.
 * @see SearchFullscreenNavigator use only!
 */
function useCustomState({ state }) {
    const routesToRender = state.routes.slice(-1);
    return { ...state, routes: routesToRender, index: routesToRender.length - 1 };
}
