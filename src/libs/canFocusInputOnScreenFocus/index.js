"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeviceCapabilities = require("@libs/DeviceCapabilities");
const canFocusInputOnScreenFocus = () => !DeviceCapabilities.canUseTouchScreen();
exports.default = canFocusInputOnScreenFocus;
