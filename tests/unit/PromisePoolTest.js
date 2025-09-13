"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PromisePool_1 = require("../../scripts/utils/PromisePool");
jest.useFakeTimers();
describe('PromisePool', () => {
    let pool;
    let completedTasks;
    const task = (label, delayMs) => () => new Promise((resolve) => {
        setTimeout(() => {
            completedTasks.push(label);
            resolve(label);
        }, delayMs);
    });
    beforeEach(() => {
        pool = new PromisePool_1.default(2);
        completedTasks = [];
    });
    it('respects concurrency limit', async () => {
        const pA = pool.add(task('A', 1000));
        const pB = pool.add(task('B', 1000));
        const pC = pool.add(task('C', 1000));
        const pD = pool.add(task('D', 1000));
        // Nothing should have finished yet
        expect(completedTasks).toEqual([]);
        jest.advanceTimersByTime(1000);
        await Promise.allSettled([pA, pB]);
        // Only A and B should have finished
        expect(completedTasks).toEqual(['A', 'B']);
        jest.advanceTimersByTime(1000);
        await Promise.allSettled([pC, pD]);
        // Now C and D should have finished
        expect(completedTasks).toEqual(['A', 'B', 'C', 'D']);
    });
});
