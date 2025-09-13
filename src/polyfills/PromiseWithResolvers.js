"use strict";
if (typeof Promise.withResolvers !== 'function') {
    Object.defineProperty(Promise, 'withResolvers', {
        value() {
            let resolve;
            let reject;
            const promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            return { promise, resolve, reject };
        },
        configurable: true,
        writable: true,
    });
}
