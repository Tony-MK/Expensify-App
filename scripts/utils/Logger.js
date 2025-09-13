"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLink = exports.success = exports.error = exports.note = exports.warn = exports.info = exports.log = void 0;
const COLOR_DIM = '\x1b[2m';
const COLOR_RESET = '\x1b[0m';
const COLOR_YELLOW = '\x1b[33m';
const COLOR_RED = '\x1b[31m';
const COLOR_GREEN = '\x1b[32m';
const log = (...args) => {
    console.debug(...args);
};
exports.log = log;
const info = (...args) => {
    log('▶️', ...args);
};
exports.info = info;
const success = (...args) => {
    const lines = ['✅', COLOR_GREEN, ...args, COLOR_RESET];
    log(...lines);
};
exports.success = success;
const warn = (...args) => {
    const lines = ['⚠️', COLOR_YELLOW, ...args, COLOR_RESET];
    log(...lines);
};
exports.warn = warn;
const note = (...args) => {
    const lines = [COLOR_DIM, ...args, COLOR_RESET];
    log(...lines);
};
exports.note = note;
const error = (...args) => {
    const lines = ['🔴', COLOR_RED, ...args, COLOR_RESET];
    log(...lines);
};
exports.error = error;
const formatLink = (name, url) => `\x1b]8;;${url}\x1b\\${name}\x1b]8;;\x1b\\`;
exports.formatLink = formatLink;
