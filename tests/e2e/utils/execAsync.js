"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const Logger = require("./logger");
/**
 * Executes a command none-blocking by wrapping it in a promise.
 * In addition to the promise it returns an abort function.
 */
exports.default = (command, env = {}) => {
    let childProcess;
    const promise = new Promise((resolve, reject) => {
        const finalEnv = {
            ...process.env,
            ...env,
        };
        Logger.note(command);
        childProcess = (0, child_process_1.exec)(command, {
            maxBuffer: 1024 * 1024 * 10, // Increase max buffer to 10MB, to avoid errors
            env: finalEnv,
        }, (error, stdout) => {
            if (error) {
                if (error?.killed) {
                    resolve();
                }
                else {
                    Logger.error(`failed with error: ${error.message}`);
                    reject(error);
                }
            }
            else {
                Logger.writeToLogFile(stdout);
                resolve(stdout);
            }
        });
    });
    promise.abort = () => {
        childProcess.kill('SIGINT');
    };
    return promise;
};
