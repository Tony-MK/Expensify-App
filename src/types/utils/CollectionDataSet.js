"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCollectionDataSet = void 0;
const toCollectionDataSet = (collectionKey, collection, idSelector) => {
    const collectionDataSet = collection.reduce((result, collectionValue) => {
        if (collectionValue) {
            // eslint-disable-next-line no-param-reassign
            result[`${collectionKey}${idSelector(collectionValue)}`] = collectionValue;
        }
        return result;
    }, {});
    return collectionDataSet;
};
exports.toCollectionDataSet = toCollectionDataSet;
