"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const waitForBatchedUpdates_1 = require("./waitForBatchedUpdates");
/**
 * When we change data in onyx, the listeners (components) will be notified
 * on the "next tick" (which is implemented by resolving a promise).
 * That means, that we have to wait for the next tick, until the components
 * are rendered with the onyx data.
 * This is a convenience function, which wraps the onyxInstance's
 * functions, to for the promises to resolve.
 */
function wrapOnyxWithWaitForBatchedUpdates(onyxInstance) {
    const multiSetImpl = onyxInstance.multiSet;
    // eslint-disable-next-line no-param-reassign
    onyxInstance.multiSet = (...args) => multiSetImpl(...args).then((result) => (0, waitForBatchedUpdates_1.default)().then(() => result));
    const mergeImpl = onyxInstance.merge;
    // eslint-disable-next-line no-param-reassign
    onyxInstance.merge = (...args) => mergeImpl(...args).then((result) => (0, waitForBatchedUpdates_1.default)().then(() => result));
}
exports.default = wrapOnyxWithWaitForBatchedUpdates;
