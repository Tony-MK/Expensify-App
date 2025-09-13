"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Web does not use Firebase for performance tracing */
const startTrace = () => { };
const stopTrace = () => { };
const log = () => { };
exports.default = {
    startTrace,
    stopTrace,
    log,
};
