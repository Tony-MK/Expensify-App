"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing doesn't achieve the same result in this case
const TIMEOUT = Number(process.env.INTERACTION_TIMEOUT || config_1.default.INTERACTION_TIMEOUT);
const withFailTimeout = (promise, name) => {
    let timeoutId;
    const resetTimeout = () => {
        clearTimeout(timeoutId);
    };
    const race = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(`"${name}": Interaction timed out after ${(TIMEOUT / 1000).toFixed(0)}s`));
        }, TIMEOUT);
        promise
            .then((value) => {
            resolve(value);
        })
            .catch((e) => {
            reject(e);
        })
            .finally(() => {
            resetTimeout();
        });
    });
    return { promise: race, resetTimeout };
};
exports.default = withFailTimeout;
