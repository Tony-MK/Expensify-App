"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const common_1 = require("./common");
const readFromOnyxDatabase = () => new Promise((resolve) => {
    let db;
    const openRequest = indexedDB.open(CONST_1.default.DEFAULT_DB_NAME);
    openRequest.onsuccess = () => {
        db = openRequest.result;
        const transaction = db.transaction(CONST_1.default.DEFAULT_TABLE_NAME);
        const objectStore = transaction.objectStore(CONST_1.default.DEFAULT_TABLE_NAME);
        const cursor = objectStore.openCursor();
        const queryResult = {};
        cursor.onerror = () => {
            console.error('Error reading cursor');
        };
        cursor.onsuccess = (event) => {
            const { result } = event.target;
            if (result) {
                queryResult[result.primaryKey] = result.value;
                result.continue();
            }
            else {
                // no results mean the cursor has reached the end of the data
                resolve(queryResult);
            }
        };
    };
});
const shareAsFile = (fileContent) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(fileContent)}`);
    element.setAttribute('download', CONST_1.default.DEFAULT_ONYX_DUMP_FILE_NAME);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};
const ExportOnyxState = {
    maskOnyxState: common_1.maskOnyxState,
    readFromOnyxDatabase,
    shareAsFile,
};
exports.default = ExportOnyxState;
