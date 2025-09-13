"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("@libs/Log");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isMemoizeStatsEntry(entry) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return entry.didHit !== undefined && entry.processingTime !== undefined;
}
class MemoizeStats {
    constructor(enabled) {
        /**
         * Number of calls to the memoized function. Both cache hits and misses are counted.
         */
        this.calls = 0;
        /**
         * Number of cache hits. This is the number of times the cache returned a value instead of calling the original function.
         */
        this.hits = 0;
        /**
         * Average time of cache retrieval. This is the time it takes to retrieve a value from the cache, without calling the original function.
         */
        this.avgCacheTime = 0;
        /**
         * Average time of original function execution. This is the time it takes to execute the original function when the cache does not have a value.
         */
        this.avgFnTime = 0;
        /**
         * Current cache size. This is the number of entries in the cache.
         */
        this.cacheSize = 0;
        this.isEnabled = false;
        this.isEnabled = enabled;
    }
    // See https://en.wikipedia.org/wiki/Moving_average#Cumulative_average
    calculateCumulativeAvg(avg, length, value) {
        const result = (avg * (length - 1) + value) / length;
        // If the length is 0, we return the average. For example, when calculating average cache retrieval time, hits may be 0, and in that case we want to return the current average cache retrieval time
        return Number.isFinite(result) ? result : avg;
    }
    cumulateEntry(entry) {
        this.calls++;
        this.cacheSize = entry.cacheSize;
        if (entry.didHit) {
            this.hits++;
            this.avgCacheTime = this.calculateCumulativeAvg(this.avgCacheTime, this.hits, entry.processingTime);
        }
        else {
            this.avgFnTime = this.calculateCumulativeAvg(this.avgFnTime, this.calls - this.hits, entry.processingTime);
        }
    }
    saveEntry(entry) {
        if (!this.isEnabled) {
            return;
        }
        if (!isMemoizeStatsEntry(entry)) {
            Log_1.default.warn('MemoizeStats:saveEntry: Invalid entry', entry);
            return;
        }
        return this.cumulateEntry(entry);
    }
    createEntry() {
        // If monitoring is disabled, return a dummy object that does nothing
        if (!this.isEnabled) {
            return {
                track: () => { },
                get: () => { },
                save: () => { },
                trackTime: () => { },
            };
        }
        const entry = {};
        return {
            track: (cacheProp, value) => {
                entry[cacheProp] = value;
            },
            trackTime: (cacheProp, startTime, endTime = performance.now()) => {
                entry[cacheProp] = endTime - startTime;
            },
            get: (cacheProp) => entry[cacheProp],
            save: () => this.saveEntry(entry),
        };
    }
    startMonitoring() {
        this.isEnabled = true;
        this.calls = 0;
        this.hits = 0;
        this.avgCacheTime = 0;
        this.avgFnTime = 0;
        this.cacheSize = 0;
    }
    stopMonitoring() {
        this.isEnabled = false;
        return {
            calls: this.calls,
            hits: this.hits,
            avgCacheTime: this.avgCacheTime,
            avgFnTime: this.avgFnTime,
            cacheSize: this.cacheSize,
        };
    }
}
exports.default = MemoizeStats;
