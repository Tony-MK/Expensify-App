"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const waitForBatchedUpdates_1 = require("./waitForBatchedUpdates");
/**
 * Method flushes microtasks and pending timers twice. Because we batch onyx updates
 * Network requests takes 2 microtask cycles to resolve
 * **Note:** It is recommended to wait for the Onyx operations, so in your tests its preferred to do:
 *  ✅  Onyx.merge(...).then(...)
 *  than to do
 *  ❌  Onyx.merge(...)
 *      waitForBatchedUpdates().then(...)
 */
const waitForNetworkPromises = () => (0, waitForBatchedUpdates_1.default)().then(waitForBatchedUpdates_1.default);
exports.default = waitForNetworkPromises;
