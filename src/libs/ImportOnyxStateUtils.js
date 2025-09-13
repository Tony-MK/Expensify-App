"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanAndTransformState = cleanAndTransformState;
exports.importState = importState;
exports.transformNumericKeysToArray = transformNumericKeysToArray;
const cloneDeep_1 = require("lodash/cloneDeep");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ImportOnyxState_1 = require("./actions/ImportOnyxState");
// List of Onyx keys from the .txt file we want to keep for the local override
const keysToOmit = [ONYXKEYS_1.default.ACTIVE_CLIENTS, ONYXKEYS_1.default.FREQUENTLY_USED_EMOJIS, ONYXKEYS_1.default.NETWORK, ONYXKEYS_1.default.CREDENTIALS, ONYXKEYS_1.default.PREFERRED_THEME];
function isRecord(value) {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
function transformNumericKeysToArray(data) {
    const dataCopy = (0, cloneDeep_1.default)(data);
    if (!isRecord(dataCopy)) {
        return Array.isArray(dataCopy) ? dataCopy.map(transformNumericKeysToArray) : dataCopy;
    }
    const keys = Object.keys(dataCopy);
    if (keys.length === 0) {
        return dataCopy;
    }
    const allKeysAreNumeric = keys.every((key) => !Number.isNaN(Number(key)));
    const keysAreSequential = keys.every((key, index) => parseInt(key, 10) === index);
    if (allKeysAreNumeric && keysAreSequential) {
        return keys.map((key) => transformNumericKeysToArray(dataCopy[key]));
    }
    for (const key in dataCopy) {
        if (key in dataCopy) {
            dataCopy[key] = transformNumericKeysToArray(dataCopy[key]);
        }
    }
    return dataCopy;
}
function cleanAndTransformState(state) {
    const parsedState = JSON.parse(state);
    Object.keys(parsedState).forEach((key) => {
        const shouldOmit = keysToOmit.some((onyxKey) => key.startsWith(onyxKey));
        if (shouldOmit) {
            delete parsedState[key];
        }
    });
    const transformedState = transformNumericKeysToArray(parsedState);
    return transformedState;
}
function importState(transformedState) {
    const collectionKeys = [...new Set(Object.values(ONYXKEYS_1.default.COLLECTION))];
    const collectionsMap = new Map();
    const regularState = {};
    Object.entries(transformedState).forEach(([entryKey, entryValue]) => {
        const key = entryKey;
        const value = entryValue;
        const collectionKey = collectionKeys.find((cKey) => key.startsWith(cKey));
        if (collectionKey) {
            if (!collectionsMap.has(collectionKey)) {
                collectionsMap.set(collectionKey, {});
            }
            const collection = collectionsMap.get(collectionKey);
            if (!collection) {
                return;
            }
            collection[key] = value;
        }
        else {
            regularState[key] = value;
        }
    });
    return (0, ImportOnyxState_1.clearOnyxStateBeforeImport)()
        .then(() => (0, ImportOnyxState_1.importOnyxCollectionState)(collectionsMap))
        .then(() => (0, ImportOnyxState_1.importOnyxRegularState)(regularState));
}
