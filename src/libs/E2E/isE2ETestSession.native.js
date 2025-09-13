"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONFIG_1 = require("@src/CONFIG");
const isE2ETestSession = () => CONFIG_1.default.E2E_TESTING;
exports.default = isE2ETestSession;
