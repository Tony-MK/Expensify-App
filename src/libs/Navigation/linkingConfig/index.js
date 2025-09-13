"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkingConfig = void 0;
const getAdaptedStateFromPath_1 = require("@libs/Navigation/helpers/getAdaptedStateFromPath");
const config_1 = require("./config");
const prefixes_1 = require("./prefixes");
const linkingConfig = {
    getStateFromPath: getAdaptedStateFromPath_1.default,
    prefixes: prefixes_1.default,
    config: config_1.config,
};
exports.linkingConfig = linkingConfig;
