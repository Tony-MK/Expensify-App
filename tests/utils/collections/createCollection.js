"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollection;
function createCollection(createKey, createItem, length = 500) {
    const map = {};
    for (let i = 0; i < length; i++) {
        const item = createItem(i);
        const itemKey = createKey(item, i);
        map[itemKey] = item;
    }
    return map;
}
