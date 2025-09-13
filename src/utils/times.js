"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function times(n, func = (i) => i) {
    return Array.from({ length: n }).map((_, i) => func(i));
}
exports.default = times;
