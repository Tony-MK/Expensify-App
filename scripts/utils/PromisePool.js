"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PromisePool {
    constructor(concurrency = 8) {
        /**
         * The set of currently-executing async operations.
         */
        this.executing = new Set();
        this.concurrency = concurrency;
    }
    /**
     * Execute an async task and return a promise with the result.
     * If there are more async operations in the pool than allowed when this function is called,
     * wait for one to finish before starting another.
     */
    async add(task) {
        if (this.executing.size >= this.concurrency) {
            await Promise.race(this.executing);
        }
        const p = task();
        this.executing.add(p);
        p.finally(() => {
            this.executing.delete(p);
        });
        return p;
    }
}
exports.default = PromisePool;
