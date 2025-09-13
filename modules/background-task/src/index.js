"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const NativeReactNativeBackgroundTask_1 = require("./NativeReactNativeBackgroundTask");
const eventEmitter = new react_native_1.NativeEventEmitter(NativeReactNativeBackgroundTask_1.default);
const taskExecutors = new Map();
let subscription;
function onBackgroundTaskExecution({ taskName }) {
    const executor = taskExecutors.get(taskName);
    if (executor) {
        executor(taskName);
    }
}
function addBackgroundTaskListener() {
    if (subscription) {
        subscription.remove();
    }
    subscription = eventEmitter.addListener('onBackgroundTaskExecution', onBackgroundTaskExecution);
}
const TaskManager = {
    /**
     * Defines a task that can be executed in the background.
     * @param taskName - Name of the task. Must be unique and match the name used when registering the task.
     * @param taskExecutor - Function that will be executed when the task runs.
     */
    defineTask: (taskName, taskExecutor) => {
        if (typeof taskName !== 'string' || taskName.length === 0) {
            throw new Error('Task name must be a string');
        }
        if (typeof taskExecutor !== 'function') {
            throw new Error('Task executor must be a function');
        }
        taskExecutors.set(taskName, taskExecutor);
        return NativeReactNativeBackgroundTask_1.default.defineTask(taskName, taskExecutor);
    },
};
addBackgroundTaskListener();
exports.default = TaskManager;
