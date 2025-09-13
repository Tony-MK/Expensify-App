"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const willBlurTextInputOnTapOutside = () => !(0, getIsNarrowLayout_1.default)();
exports.default = willBlurTextInputOnTapOutside;
