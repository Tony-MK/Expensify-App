"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Don't add new `findNodeHandle` usages, this is only a temporary solution. We're going to remove the function in the future */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function findNodeHandle(componentOrHandle) {
    // eslint-disable-next-line no-console
    console.warn('findNodeHandle is not supported on web. Use the ref property of the component instead.');
    return null;
}
exports.default = findNodeHandle;
