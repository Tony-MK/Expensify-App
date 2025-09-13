"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_background_task_1 = require("@expensify/react-native-background-task");
const Log_1 = require("@libs/Log");
const SequentialQueue_1 = require("@libs/Network/SequentialQueue");
const BACKGROUND_FETCH_TASK = 'FLUSH-SEQUENTIAL-QUEUE-BACKGROUND-FETCH';
react_native_background_task_1.default.defineTask(BACKGROUND_FETCH_TASK, () => {
    Log_1.default.info('BackgroundTask', true, `Executing ${BACKGROUND_FETCH_TASK} background task at ${new Date().toISOString()}`);
    (0, SequentialQueue_1.flush)();
});
