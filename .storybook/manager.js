"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const manager_api_1 = require("@storybook/manager-api");
const theme_1 = require("./theme");
manager_api_1.addons.setConfig({
    theme: theme_1.default,
});
