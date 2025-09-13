"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const Environment = require("@libs/Environment/Environment");
const getPlatform_1 = require("@libs/getPlatform");
const package_json_1 = require("../../../package.json");
const StatsCounter = (eventName, value = 1) => {
    Environment.getEnvironment().then((envName) => {
        const platform = (0, getPlatform_1.default)();
        const version = package_json_1.default.version.replace(/\./g, '-');
        // This normalizes the name of the web platform so it will be more consistent in Grafana
        const grafanaEventName = `${platform === 'web' ? 'webApp' : platform}.${envName}.new.expensify.${eventName}.${version}`;
        console.debug(`Counter:${grafanaEventName}`, value);
        if (Environment.isDevelopment()) {
            // Don't record stats on dev as this will mess up the accuracy of data in release builds of the app
            return;
        }
        const parameters = {
            type: 'counter',
            statName: grafanaEventName,
            value,
        };
        API.read(types_1.READ_COMMANDS.GRAPHITE, parameters, {});
    });
};
exports.default = StatsCounter;
