"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseWhile = promiseWhile;
exports.promiseDoWhile = promiseDoWhile;
/**
 * Simulates a while loop where the condition is determined by the result of a Promise.
 */
function promiseWhile(condition, action) {
    return new Promise((resolve, reject) => {
        const loop = function () {
            if (!condition()) {
                resolve();
            }
            else {
                const actionResult = action?.();
                if (!actionResult) {
                    resolve();
                    return;
                }
                Promise.resolve(actionResult)
                    .then(() => {
                    // Set a timeout to delay the next loop iteration
                    setTimeout(loop, 1000); // 1000 ms delay
                })
                    .catch(reject);
            }
        };
        loop();
    });
}
/**
 * Simulates a do-while loop where the condition is determined by the result of a Promise.
 */
function promiseDoWhile(condition, action) {
    return new Promise((resolve, reject) => {
        const actionResult = action?.();
        if (!actionResult) {
            resolve();
            return;
        }
        actionResult
            .then(() => promiseWhile(condition, action))
            .then(resolve)
            .catch(reject);
    });
}
