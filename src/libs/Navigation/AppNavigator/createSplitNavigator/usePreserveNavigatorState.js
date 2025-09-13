"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanPreservedNavigatorStates = exports.getPreservedNavigatorState = void 0;
const react_1 = require("react");
const preservedNavigatorStates = {};
const cleanPreservedNavigatorStates = (state) => {
    const currentSplitNavigatorKeys = state.routes.map((route) => route.key);
    for (const key of Object.keys(preservedNavigatorStates)) {
        if (!currentSplitNavigatorKeys.includes(key)) {
            delete preservedNavigatorStates[key];
        }
    }
};
exports.cleanPreservedNavigatorStates = cleanPreservedNavigatorStates;
const getPreservedNavigatorState = (key) => preservedNavigatorStates[key];
exports.getPreservedNavigatorState = getPreservedNavigatorState;
function usePreserveNavigatorState(state, route) {
    (0, react_1.useEffect)(() => {
        if (!route) {
            return;
        }
        preservedNavigatorStates[route.key] = state;
    }, [route, state]);
}
exports.default = usePreserveNavigatorState;
