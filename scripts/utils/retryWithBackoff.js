"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Return a promise that resolves after the given number of ms.
 */
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
/**
 * Attempt an asynchronous operation (such as a network request) with exponential backoff, up to a certain number of retries.
 */
async function retryWithBackoff(fn, { maxRetries = 5, initialDelayMs = 1000, factor = 2, isRetryable = () => true } = {}) {
    let attempt = 0;
    let delay = initialDelayMs;
    let lastError;
    do {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            attempt++;
            if (!isRetryable(err)) {
                break;
            }
            await sleep(delay);
            delay *= factor;
        }
    } while (attempt <= maxRetries);
    throw lastError;
}
exports.default = retryWithBackoff;
