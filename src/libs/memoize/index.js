"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memoize = void 0;
const ArrayCache_1 = require("./cache/ArrayCache");
const stats_1 = require("./stats");
const utils_1 = require("./utils");
/**
 * Global memoization class. Use it to orchestrate memoization (e.g. start/stop global monitoring).
 */
class Memoize {
    static registerMemoized(id, memoized) {
        this.memoizedList.push({ id, memoized });
    }
    static startMonitoring() {
        if (this.isMonitoringEnabled) {
            return;
        }
        this.isMonitoringEnabled = true;
        Memoize.memoizedList.forEach(({ memoized }) => {
            memoized.startMonitoring();
        });
    }
    static stopMonitoring() {
        if (!this.isMonitoringEnabled) {
            return;
        }
        this.isMonitoringEnabled = false;
        return Memoize.memoizedList.map(({ id, memoized }) => ({ id, stats: memoized.stopMonitoring() }));
    }
}
exports.Memoize = Memoize;
Memoize.isMonitoringEnabled = false;
Memoize.memoizedList = [];
/**
 * Wraps a function with a memoization layer. Useful for caching expensive calculations.
 * @param fn - Function to memoize
 * @param opts - Options for the memoization layer, for more details see `ClientOptions` type.
 * @returns Memoized function with a cache API attached to it.
 */
function memoize(fn, opts) {
    const options = (0, utils_1.mergeOptions)(opts);
    const cache = (0, ArrayCache_1.default)({ maxSize: options.maxSize, keyComparator: (0, utils_1.getEqualityComparator)(options) });
    const stats = new stats_1.default(options.monitor || Memoize.isMonitoringEnabled);
    const memoized = function memoized(...args) {
        const statsEntry = stats.createEntry();
        const retrievalTimeStart = performance.now();
        // Detect if memoized function was called with `new` keyword. If so we need to call the original function as constructor.
        const constructable = !!new.target;
        // If skipCache is set, check if we should skip the cache
        if (options.skipCache?.(args)) {
            const fnTimeStart = performance.now();
            const result = (constructable ? new fn(...args) : fn(...args));
            statsEntry.trackTime('processingTime', fnTimeStart);
            statsEntry.track('didHit', false);
            return result;
        }
        const truncatedArgs = (0, utils_1.truncateArgs)(args, options.maxArgs);
        const key = options.transformKey ? options.transformKey(truncatedArgs) : truncatedArgs;
        const cached = cache.getSet(key, () => {
            const fnTimeStart = performance.now();
            const result = (constructable ? new fn(...args) : fn(...args));
            // Track processing time
            statsEntry.trackTime('processingTime', fnTimeStart);
            statsEntry.track('didHit', false);
            return result;
        });
        // If processing time was not tracked inside getSet callback, track it as a cache retrieval
        if (statsEntry.get('processingTime') === undefined) {
            statsEntry.trackTime('processingTime', retrievalTimeStart);
            statsEntry.track('didHit', true);
        }
        statsEntry.track('cacheSize', cache.size);
        statsEntry.save();
        return cached.value;
    };
    /**
     * Cache API attached to the memoized function. Currently there is an issue with typing cache keys, but the functionality works as expected.
     */
    memoized.cache = cache;
    memoized.startMonitoring = () => stats.startMonitoring();
    memoized.stopMonitoring = () => stats.stopMonitoring();
    Memoize.registerMemoized(options.monitoringName ?? fn.name, memoized);
    return memoized;
}
exports.default = memoize;
