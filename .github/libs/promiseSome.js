"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = promiseSome;
/**
 * Like _.some but for promises. It short-circuts after a promise fulfills with a value that passes the test implemented by provided function.
 * It does not wait for the other promises to complete once it finds one.
 * If no promise passes the provided test, it rejects.
 */
function promiseSome(promises, callbackFn) {
    return new Promise((resolve, reject) => {
        for (const p of promises) {
            Promise.resolve(p)
                .then((res) => {
                if (!callbackFn(res)) {
                    return;
                }
                resolve(true);
            })
                .catch(() => { });
        }
        Promise.allSettled(promises).then(() => reject());
    });
}
