"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowCompare = void 0;
exports.filterObject = filterObject;
const getDefinedKeys = (obj) => {
    return Object.entries(obj)
        .filter(([, value]) => value !== undefined)
        .map(([key]) => key);
};
const shallowCompare = (obj1, obj2) => {
    if (!obj1 && !obj2) {
        return true;
    }
    if (obj1 && obj2) {
        const keys1 = getDefinedKeys(obj1);
        const keys2 = getDefinedKeys(obj2);
        return keys1.length === keys2.length && keys1.every((key) => obj1[key] === obj2[key]);
    }
    return false;
};
exports.shallowCompare = shallowCompare;
function filterObject(obj, predicate) {
    return Object.keys(obj)
        .filter((key) => predicate(key, obj[key]))
        .reduce((result, key) => {
        // eslint-disable-next-line no-param-reassign
        result[key] = obj[key];
        return result;
    }, {});
}
