"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const Log_1 = require("./Log");
const NumberUtils_1 = require("./NumberUtils");
class RequestThrottle {
    constructor(name) {
        this.requestWaitTime = 0;
        this.requestRetryCount = 0;
        this.name = name;
    }
    clear() {
        this.requestWaitTime = 0;
        this.requestRetryCount = 0;
        if (this.timeoutID) {
            Log_1.default.info(`[RequestThrottle - ${this.name}] clearing timeoutID: ${String(this.timeoutID)}`);
            clearTimeout(this.timeoutID);
            this.timeoutID = undefined;
        }
        Log_1.default.info(`[RequestThrottle - ${this.name}] cleared`);
    }
    getRequestWaitTime() {
        if (this.requestWaitTime) {
            this.requestWaitTime = Math.min(this.requestWaitTime * 2, CONST_1.default.NETWORK.MAX_RETRY_WAIT_TIME_MS);
        }
        else {
            this.requestWaitTime = (0, NumberUtils_1.generateRandomInt)(CONST_1.default.NETWORK.MIN_RETRY_WAIT_TIME_MS, CONST_1.default.NETWORK.MAX_RANDOM_RETRY_WAIT_TIME_MS);
        }
        return this.requestWaitTime;
    }
    getLastRequestWaitTime() {
        return this.requestWaitTime;
    }
    sleep(error, command) {
        this.requestRetryCount++;
        return new Promise((resolve, reject) => {
            if (this.requestRetryCount <= CONST_1.default.NETWORK.MAX_REQUEST_RETRIES) {
                const currentRequestWaitTime = this.getRequestWaitTime();
                Log_1.default.info(`[RequestThrottle - ${this.name}] Retrying request after error: '${error.name}', '${error.message}', '${error.status}'. Command: ${command}. Retry count:  ${this.requestRetryCount}. Wait time: ${currentRequestWaitTime}`);
                this.timeoutID = setTimeout(resolve, currentRequestWaitTime);
            }
            else {
                reject();
            }
        });
    }
}
exports.default = RequestThrottle;
