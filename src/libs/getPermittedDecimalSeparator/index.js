"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getOperatingSystem_1 = require("@libs/getOperatingSystem");
const CONST_1 = require("@src/CONST");
const index_ios_1 = require("./index.ios");
const getPermittedDecimalSeparator = (localizedSeparator) => {
    if ((0, getOperatingSystem_1.default)() === CONST_1.default.OS.IOS) {
        return (0, index_ios_1.default)(localizedSeparator);
    }
    return localizedSeparator;
};
exports.default = getPermittedDecimalSeparator;
