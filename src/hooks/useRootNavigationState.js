"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
/**
 * Hook to get a value from the current root navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
function useRootNavigationState(selector) {
    const [result, setResult] = (0, react_1.useState)(() => selector(navigationRef_1.default.getRootState()));
    // We store the selector in a ref to avoid re-subscribing listeners every render
    const selectorRef = (0, react_1.useRef)(selector);
    (0, react_1.useEffect)(() => {
        selectorRef.current = selector;
    });
    (0, react_1.useEffect)(() => {
        const unsubscribe = navigationRef_1.default.addListener('state', () => {
            // State from the event data may be incomplete. (defined params but no nested state for the route)
            setResult(selectorRef.current(navigationRef_1.default.getRootState()));
        });
        return unsubscribe;
    }, []);
    return result;
}
exports.default = useRootNavigationState;
