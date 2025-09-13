"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSpreadsheetData = setSpreadsheetData;
exports.setColumnName = setColumnName;
exports.closeImportPage = closeImportPage;
exports.setContainsHeader = setContainsHeader;
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function setSpreadsheetData(data, fileURI, fileType, fileName, isImportingMultiLevelTags) {
    if (!Array.isArray(data) || !Array.isArray(data.at(0))) {
        return Promise.reject(new Error('Invalid data format'));
    }
    const transposedData = data.at(0)?.map((_, colIndex) => data.map((row) => row.at(colIndex) ?? ''));
    const columnNames = data.at(0)?.reduce((acc, _, colIndex) => {
        acc[colIndex] = CONST_1.default.CSV_IMPORT_COLUMNS.IGNORE;
        return acc;
    }, {}) ?? {};
    return react_native_onyx_1.default.set(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { data: transposedData, columns: columnNames, fileURI, fileType, fileName, isImportingMultiLevelTags });
}
function setColumnName(columnIndex, columnName) {
    return react_native_onyx_1.default.merge(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { columns: { [columnIndex]: columnName } });
}
function setContainsHeader(containsHeader) {
    return react_native_onyx_1.default.merge(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { containsHeader });
}
function closeImportPage() {
    return react_native_onyx_1.default.merge(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { data: null, columns: null, shouldFinalModalBeOpened: false, importFinalModal: null });
}
