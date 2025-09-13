"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getButtonRole = void 0;
const CONST_1 = require("@src/CONST");
const getButtonRole = (isNested) => (isNested ? CONST_1.default.ROLE.PRESENTATION : CONST_1.default.ROLE.BUTTON);
exports.getButtonRole = getButtonRole;
