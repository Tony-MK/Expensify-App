"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLaunchCamera = void 0;
class ErrorLaunchCamera extends Error {
    constructor(message, errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}
exports.ErrorLaunchCamera = ErrorLaunchCamera;
