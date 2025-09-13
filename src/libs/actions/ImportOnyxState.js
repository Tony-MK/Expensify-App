"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOnyxStateBeforeImport = clearOnyxStateBeforeImport;
exports.importOnyxCollectionState = importOnyxCollectionState;
exports.importOnyxRegularState = importOnyxRegularState;
const react_native_onyx_1 = require("react-native-onyx");
const App_1 = require("./App");
function clearOnyxStateBeforeImport() {
    return react_native_onyx_1.default.clear(App_1.KEYS_TO_PRESERVE);
}
function importOnyxCollectionState(collectionsMap) {
    const collectionPromises = Array.from(collectionsMap.entries()).map(([baseKey, items]) => {
        return items ? react_native_onyx_1.default.setCollection(baseKey, items) : Promise.resolve();
    });
    return Promise.all(collectionPromises);
}
function importOnyxRegularState(state) {
    if (Object.keys(state).length > 0) {
        return react_native_onyx_1.default.multiSet(state);
    }
    return Promise.resolve();
}
