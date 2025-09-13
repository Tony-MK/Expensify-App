"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const reactNativeConfigMock = dotenv_1.default.config({ path: path_1.default.resolve('./.env.example') }).parsed;
exports.default = reactNativeConfigMock;
