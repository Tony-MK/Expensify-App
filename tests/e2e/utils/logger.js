"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToLogFile = exports.success = exports.error = exports.note = exports.warn = exports.info = exports.log = void 0;
/* eslint-disable import/no-import-module-exports */
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = require("../config");
const COLOR_DIM = '\x1b[2m';
const COLOR_RESET = '\x1b[0m';
const COLOR_YELLOW = '\x1b[33m';
const COLOR_RED = '\x1b[31m';
const COLOR_GREEN = '\x1b[32m';
const getDateString = () => `[${Date()}] `;
const writeToLogFile = (...args) => {
    if (!fs_1.default.existsSync(config_1.default.LOG_FILE)) {
        // Check that the directory exists
        const logDir = path_1.default.dirname(config_1.default.LOG_FILE);
        if (!fs_1.default.existsSync(logDir)) {
            fs_1.default.mkdirSync(logDir);
        }
        fs_1.default.writeFileSync(config_1.default.LOG_FILE, '');
    }
    fs_1.default.appendFileSync(config_1.default.LOG_FILE, `${args
        .map((arg) => {
        if (typeof arg === 'string') {
            // Remove color codes from arg, because they are not supported in log files
            // eslint-disable-next-line no-control-regex
            return arg.replace(/\x1b\[\d+m/g, '');
        }
        return arg;
    })
        .join(' ')
        .trim()}\n`);
};
exports.writeToLogFile = writeToLogFile;
const log = (...args) => {
    const argsWithTime = [getDateString(), ...args];
    console.debug(...argsWithTime);
    writeToLogFile(...argsWithTime);
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
