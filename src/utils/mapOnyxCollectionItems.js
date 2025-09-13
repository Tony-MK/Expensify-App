"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mapOnyxCollectionItems;
function mapOnyxCollectionItems(collection, mapper) {
    return Object.entries(collection ?? {}).reduce((acc, [key, entry]) => {
        acc[key] = mapper(entry);
        return acc;
    }, {});
}
