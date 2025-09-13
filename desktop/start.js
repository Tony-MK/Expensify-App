#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const concurrently_1 = require("concurrently");
const dotenv_1 = require("dotenv");
const portfinder_1 = require("portfinder");
(0, dotenv_1.config)();
const basePort = 8082;
portfinder_1.default
    .getPortPromise({
    port: basePort,
})
    .then((port) => {
    const devServer = `./scripts/start-dev-with-auto-restart.sh --port ${port} --env platform=desktop`;
    const buildMain = 'webpack watch --config config/webpack/webpack.desktop.ts --config-name desktop-main --mode=development';
    const env = {
        PORT: port,
        NODE_ENV: 'development',
    };
    const processes = [
        {
            command: buildMain,
            name: 'Main',
            prefixColor: 'blue.dim',
            env,
        },
        {
            command: devServer,
            name: 'Renderer',
            prefixColor: 'red.dim',
            env,
        },
        {
            command: `wait-port dev.new.expensify.com:${port} && npx electronmon ./desktop/dev.js`,
            name: 'Electron',
            prefixColor: 'cyan.dim',
            env,
        },
    ];
    const { result } = (0, concurrently_1.default)(processes, {
        inputStream: process.stdin,
        prefix: 'name',
        // Like Harry Potter and he-who-must-not-be-named, "neither can live while the other survives"
        killOthers: ['success', 'failure'],
    });
    return result.then(() => process.exit(0), () => process.exit(1));
})
    .catch(() => process.exit(1));
