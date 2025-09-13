"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memfs_1 = require("memfs");
const promisesMock = memfs_1.fs.promises;
exports.default = promisesMock;
