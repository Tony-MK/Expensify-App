"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parsePushNotificationPayload;
const pako_1 = require("pako");
const Log_1 = require("@libs/Log");
const GZIP_MAGIC_NUMBER = '\x1f\x8b';
/**
 * Parse the payload of a push notification. On Android, some notification payloads are sent as a JSON string rather than an object
 */
function parsePushNotificationPayload(payload) {
    if (payload === undefined) {
        return undefined;
    }
    // No need to parse if it's already an object
    if (typeof payload !== 'string') {
        return payload;
    }
    // Gzipped JSON String
    try {
        const binaryStringPayload = atob(payload);
        if (!binaryStringPayload.startsWith(GZIP_MAGIC_NUMBER)) {
            throw Error();
        }
        const compressed = Uint8Array.from(binaryStringPayload, (x) => x.charCodeAt(0));
        const decompressed = pako_1.default.inflate(compressed, { to: 'string' });
        const jsonObject = JSON.parse(decompressed);
        return jsonObject;
    }
    catch {
        Log_1.default.hmmm('[PushNotification] Failed to parse the payload as a Gzipped JSON string', payload);
    }
    // JSON String
    try {
        return JSON.parse(payload);
    }
    catch {
        Log_1.default.hmmm(`[PushNotification] Failed to parse the payload as a JSON string`, payload);
    }
    return undefined;
}
