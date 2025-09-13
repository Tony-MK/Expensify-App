"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = isEmptyObject;
function isEmptyObject(obj) {
    return Object.keys(obj ?? {}).length === 0;
}
