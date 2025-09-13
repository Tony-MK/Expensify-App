"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = isEmptyObject;
exports.getEmptyObject = getEmptyObject;
var CONST_1 = require("@src/CONST");
function isEmptyObject(obj) {
    return Object.keys(obj !== null && obj !== void 0 ? obj : {}).length === 0;
}
function getEmptyObject() {
    return CONST_1.default.EMPTY_OBJECT;
}
