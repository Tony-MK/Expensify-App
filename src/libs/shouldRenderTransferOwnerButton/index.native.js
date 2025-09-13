"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isEmpty_1 = require("lodash/isEmpty");
var shouldRenderTransferOwnerButton = function (fundList) {
    return !(0, isEmpty_1.default)(fundList);
};
exports.default = shouldRenderTransferOwnerButton;
