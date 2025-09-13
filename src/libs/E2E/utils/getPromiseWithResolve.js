"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPromiseWithResolve;
function getPromiseWithResolve() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let resolveFn = (_value) => { };
    const promise = new Promise((resolve) => {
        resolveFn = resolve;
    });
    return [promise, resolveFn];
}
