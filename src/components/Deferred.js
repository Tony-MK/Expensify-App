"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * This is a wrapper component that allows us to defer rendering children and do it in the background with the use of startTransition.
 * Caution: To achieve performance benefits from this component you have to wrap it in a Suspense component.
 */
function Deferred({ children }) {
    const [{ promise, resolve }] = (0, react_1.useState)(() => Promise.withResolvers());
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    (0, react_1.useLayoutEffect)(() => {
        setIsMounted(true);
        (0, react_1.startTransition)(() => {
            resolve();
        });
    }, [resolve]);
    if (!isMounted) {
        // Don't suspend on the first render so the layout effect can run
        return null;
    }
    // Suspend rendering children until the callback resolves. This promise will be caught by the parent Suspense component.
    (0, react_1.use)(promise);
    return children;
}
Deferred.displayName = 'Deferred';
exports.default = Deferred;
