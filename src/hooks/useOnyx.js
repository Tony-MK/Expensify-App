"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_onyx_1 = require("react-native-onyx");
const SearchContext_1 = require("@components/Search/SearchContext");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const COLLECTION_VALUES = Object.values(ONYXKEYS_1.default.COLLECTION);
const getDataByPath = (data, path) => {
    // Handle prefixed collections
    for (const collection of COLLECTION_VALUES) {
        if (path.startsWith(collection)) {
            const key = `${collection}${path.slice(collection.length)}`;
            return data?.[key];
        }
    }
    // Handle direct keys
    return data?.[path];
};
// Helper function to get key data from snapshot
const getKeyData = (snapshotData, key) => {
    if (key.endsWith('_')) {
        // Create object to store matching entries
        const result = {};
        const prefix = key;
        // Get all keys that start with the prefix
        Object.entries(snapshotData?.data ?? {}).forEach(([dataKey, value]) => {
            if (!dataKey.startsWith(prefix)) {
                return;
            }
            result[dataKey] = value;
        });
        return (Object.keys(result).length > 0 ? result : undefined);
    }
    return getDataByPath(snapshotData?.data, key);
};
/**
 * Custom hook for accessing and subscribing to Onyx data with search snapshot support
 */
const useOnyx = (key, options, dependencies) => {
    const { isOnSearch, currentSearchHash } = (0, SearchContext_1.useSearchContext)();
    const useOnyxOptions = options;
    const { selector: selectorProp, ...optionsWithoutSelector } = useOnyxOptions ?? {};
    // Determine if we should use snapshot data based on search state and key
    const shouldUseSnapshot = (0, react_1.useMemo)(() => {
        return isOnSearch && !!currentSearchHash && !key.startsWith(ONYXKEYS_1.default.COLLECTION.SNAPSHOT) && CONST_1.default.SEARCH.SNAPSHOT_ONYX_KEYS.some((snapshotKey) => key.startsWith(snapshotKey));
    }, [isOnSearch, currentSearchHash, key]);
    // Create selector function that handles both regular and snapshot data
    const selector = (0, react_1.useMemo)(() => {
        if (!selectorProp || !shouldUseSnapshot) {
            return selectorProp;
        }
        return (data) => selectorProp(getKeyData(data, key));
    }, [selectorProp, shouldUseSnapshot, key]);
    const onyxOptions = { ...optionsWithoutSelector, selector, allowDynamicKey: true };
    const snapshotKey = shouldUseSnapshot ? `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchHash}` : key;
    const originalResult = (0, react_native_onyx_1.useOnyx)(snapshotKey, onyxOptions, dependencies);
    // Extract and memoize the specific key data from snapshot if in search mode
    const result = (0, react_1.useMemo)(() => {
        // if it has selector, we don't need to use snapshot here
        if (!shouldUseSnapshot || selector) {
            return originalResult;
        }
        const keyData = getKeyData(originalResult[0], key);
        return [keyData, originalResult[1]];
    }, [shouldUseSnapshot, originalResult, key, selector]);
    return result;
};
exports.default = useOnyx;
