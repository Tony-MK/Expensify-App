"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateFormDataParameter_1 = require("@libs/validateFormDataParameter");
/**
 * Prepares the request payload (body) for a given command and data.
 */
const prepareRequestPayload = (command, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value === undefined) {
            return;
        }
        (0, validateFormDataParameter_1.default)(command, key, value);
        formData.append(key, value);
    });
    return Promise.resolve(formData);
};
exports.default = prepareRequestPayload;
