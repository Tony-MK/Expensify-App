"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMiddlewares = clearMiddlewares;
exports.processWithMiddleware = processWithMiddleware;
exports.use = use;
const HttpUtils_1 = require("./HttpUtils");
const Log_1 = require("./Log");
const enhanceParameters_1 = require("./Network/enhanceParameters");
const NetworkStore_1 = require("./Network/NetworkStore");
let middlewares = [];
function makeXHR(request) {
    const finalParameters = (0, enhanceParameters_1.default)(request.command, request?.data ?? {});
    return (0, NetworkStore_1.hasReadRequiredDataFromStorage)().then(() => {
        // If we're using the Supportal token and this is not a Supportal request
        // let's just return a promise that will resolve itself.
        if ((0, NetworkStore_1.isSupportAuthToken)() && !(0, NetworkStore_1.isSupportRequest)(request.command)) {
            Log_1.default.info(`[API] The ${request.command} API call is skipped because user is using support token.`);
            return new Promise((resolve) => {
                resolve();
            });
        }
        return HttpUtils_1.default.xhr(request.command, finalParameters, request.type, request.shouldUseSecure, request.initiatedOffline);
    });
}
function processWithMiddleware(request, isFromSequentialQueue = false) {
    return middlewares.reduce((last, middleware) => middleware(last, request, isFromSequentialQueue), makeXHR(request));
}
function use(middleware) {
    middlewares.push(middleware);
}
function clearMiddlewares() {
    middlewares = [];
}
