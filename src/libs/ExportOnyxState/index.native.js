"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_fs_1 = require("react-native-fs");
const react_native_nitro_sqlite_1 = require("react-native-nitro-sqlite");
const react_native_share_1 = require("react-native-share");
const CONST_1 = require("@src/CONST");
const common_1 = require("./common");
const readFromOnyxDatabase = () => new Promise((resolve) => {
    const db = (0, react_native_nitro_sqlite_1.open)({ name: CONST_1.default.DEFAULT_DB_NAME });
    const query = `SELECT * FROM ${CONST_1.default.DEFAULT_TABLE_NAME}`;
    db.executeAsync(query, []).then(({ rows }) => {
        const result = 
        // eslint-disable-next-line no-underscore-dangle
        rows?._array.reduce((acc, row) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            acc[row?.record_key] = JSON.parse(row?.valueJSON);
            return acc;
        }, {}) ?? {};
        resolve(result);
    });
});
const shareAsFile = (fileContent) => {
    try {
        // Define new filename and path for the app info file
        const infoFileName = CONST_1.default.DEFAULT_ONYX_DUMP_FILE_NAME;
        const infoFilePath = `${react_native_fs_1.default.DocumentDirectoryPath}/${infoFileName}`;
        const actualInfoFile = `file://${infoFilePath}`;
        react_native_fs_1.default.writeFile(infoFilePath, fileContent, 'utf8').then(() => {
            react_native_share_1.default.open({
                url: actualInfoFile,
                failOnCancel: false,
            });
        });
    }
    catch (error) {
        console.error('Error renaming and sharing file:', error);
    }
};
const ExportOnyxState = {
    maskOnyxState: common_1.maskOnyxState,
    readFromOnyxDatabase,
    shareAsFile,
};
exports.default = ExportOnyxState;
