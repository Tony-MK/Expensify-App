"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const getNavigationBarType = () => {
    // On web, there is no navigation bar.
    return CONST_1.default.NAVIGATION_BAR_TYPE.NONE;
};
exports.default = getNavigationBarType;
