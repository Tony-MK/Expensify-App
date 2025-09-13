"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
/**
 * This is a wrapper component that allows us to defer rendering children and do it in the background with the use of startTransition.
 * Caution: To achieve performance benefits from this component you have to wrap it in a Suspense component.
 */
function Deferred(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(function () { return Promise.withResolvers(); })[0], promise = _b.promise, resolve = _b.resolve;
    var _c = (0, react_1.useState)(false), isMounted = _c[0], setIsMounted = _c[1];
    (0, react_1.useLayoutEffect)(function () {
        setIsMounted(true);
        (0, react_1.startTransition)(function () {
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
