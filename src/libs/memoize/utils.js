"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOptions = mergeOptions;
exports.getEqualityComparator = getEqualityComparator;
exports.truncateArgs = truncateArgs;
const fast_equals_1 = require("fast-equals");
const const_1 = require("./const");
function getEqualityComparator(opts) {
    // Use the custom equality comparator if it is provided
    if (typeof opts.equality === 'function') {
        return opts.equality;
    }
    if (opts.equality === 'shallow') {
        return fast_equals_1.shallowEqual;
    }
    return fast_equals_1.deepEqual;
}
function mergeOptions(options) {
    if (!options) {
        return const_1.default;
    }
    return { ...const_1.default, ...options };
}
function truncateArgs(args, maxArgs) {
    // Hot paths are declared explicitly to avoid the overhead of the slice method
    if (maxArgs === undefined) {
        return args;
    }
    if (maxArgs >= args.length) {
        return args;
    }
    if (maxArgs === 0) {
        return [];
    }
    if (maxArgs === 1) {
        return [args[0]];
    }
    if (maxArgs === 2) {
        return [args[0], args[1]];
    }
    if (maxArgs === 3) {
        return [args[0], args[1], args[2]];
    }
    return args.slice(0, maxArgs);
}
