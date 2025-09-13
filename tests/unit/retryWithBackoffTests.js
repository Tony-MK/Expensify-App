"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
const retryWithBackoff_1 = require("../../scripts/utils/retryWithBackoff");
describe('retryWithBackoff', () => {
    it('resolves on first attempt', async () => {
        const fn = jest.fn().mockResolvedValue('success');
        const promise = (0, retryWithBackoff_1.default)(fn);
        await expect(promise).resolves.toBe('success');
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('resolves after a few failures', async () => {
        const fn = jest.fn().mockRejectedValueOnce(new Error('Fail 1')).mockRejectedValueOnce(new Error('Fail 2')).mockResolvedValue('Recovered');
        const promise = (0, retryWithBackoff_1.default)(fn, { initialDelayMs: 16 });
        await expect(promise).resolves.toBe('Recovered');
        expect(fn).toHaveBeenCalledTimes(3);
    });
    it('throws after exceeding maxRetries', async () => {
        const fn = jest.fn().mockRejectedValue(new Error('Fail always'));
        const promise = (0, retryWithBackoff_1.default)(fn, { initialDelayMs: 16, maxRetries: 2 });
        await expect(promise).rejects.toThrow('Fail always');
        expect(fn).toHaveBeenCalledTimes(3); // Initial try + 2 retries
    });
    it('respects isRetryable function', async () => {
        const nonRetryableError = new Error('Don’t retry');
        const fn = jest.fn().mockRejectedValue(nonRetryableError);
        const isRetryable = jest.fn().mockReturnValue(false);
        const promise = (0, retryWithBackoff_1.default)(fn, { initialDelayMs: 16, isRetryable });
        await expect(promise).rejects.toThrow('Don’t retry');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(isRetryable).toHaveBeenCalledWith(nonRetryableError);
    });
    it('uses exponential backoff', async () => {
        const fn = jest.fn().mockRejectedValueOnce(new Error('Fail 1')).mockRejectedValueOnce(new Error('Fail 2')).mockResolvedValue('Done');
        const delays = [];
        jest.spyOn(global, 'setTimeout').mockImplementation((cb, ms) => {
            delays.push(ms ?? 0);
            cb();
            return 0;
        });
        const promise = (0, retryWithBackoff_1.default)(fn, {
            maxRetries: 5,
            initialDelayMs: 100,
            factor: 3,
        });
        await expect(promise).resolves.toBe('Done');
        expect(fn).toHaveBeenCalledTimes(3);
        expect(delays).toEqual([100, 300]); // 100 -> 300
    });
});
