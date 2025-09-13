"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const shouldRenderTransferOwnerButton = (fundList) => {
    return !(0, isEmpty_1.default)(fundList);
};
exports.default = shouldRenderTransferOwnerButton;
