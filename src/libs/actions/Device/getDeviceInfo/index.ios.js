"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBaseInfo_1 = require("./getBaseInfo");
const index_1 = require("./getOSAndName/index");
const getDeviceInfo = () => ({
    ...(0, getBaseInfo_1.default)(),
    ...(0, index_1.default)(),
    os: 'iOS',
});
exports.default = getDeviceInfo;
