"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDuplicate = findDuplicate;
exports.generateColumnNames = generateColumnNames;
const CONST_1 = require("@src/CONST");
function findDuplicate(array) {
    const frequencyCounter = {};
    for (const item of array) {
        if (item !== CONST_1.default.CSV_IMPORT_COLUMNS.IGNORE) {
            if (frequencyCounter[item]) {
                return item;
            }
            frequencyCounter[item] = (frequencyCounter[item] || 0) + 1;
        }
    }
    return null;
}
/**
 * Converts a numeric index to an Excel-style column name.
 */
function numberToColumn(index) {
    let column = '';
    let number = index;
    // Loop until 'number' is less than 0
    while (number >= 0) {
        // Calculate the character corresponding to the current 'number' and prepend it to the 'column' string
        column = String.fromCharCode((number % 26) + 65) + column;
        // Update 'number' to move to the next significant digit in base-26, adjusting for 0-based index
        number = Math.floor(number / 26) - 1;
    }
    return column;
}
/**
 * Generates an array of Excel-style column names with a specified length.
 */
function generateColumnNames(length) {
    return Array.from({ length }, (_, i) => numberToColumn(i));
}
