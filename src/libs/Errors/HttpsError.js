"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom error class useful for re-throwing fetch errors with status code or valid error responses with status 200 but non 200 jsonCode
 */
class HttpsError extends Error {
    constructor({ message, status = '', title = '' }) {
        super(message);
        this.name = 'HttpsError';
        this.status = status;
        this.title = title;
    }
}
exports.default = HttpsError;
