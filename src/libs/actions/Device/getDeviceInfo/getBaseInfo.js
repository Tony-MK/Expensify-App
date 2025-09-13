"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../../../../../package.json");
const getBaseInfo = () => ({
    appVersion: package_json_1.default.version,
    timestamp: new Date().toISOString().slice(0, 19),
});
exports.default = getBaseInfo;
