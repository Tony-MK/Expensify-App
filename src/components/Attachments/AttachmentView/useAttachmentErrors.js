"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function convertSourceToString(source) {
    if (typeof source === 'string' || typeof source === 'number') {
        return source.toString();
    }
    if (source instanceof Array) {
        return source.map((src) => src.uri).join(', ');
    }
    if ('uri' in source) {
        return source.uri ?? '';
    }
    return '';
}
/**
 * A custom React hook that provides functionalities to manage attachment errors.
 * - `setAttachmentError(key)`: Set or unset an error for a given key.
 * - `clearAttachmentErrors()`: Clear all errors.
 * - `isErrorInAttachment(key)`: Check if there is an error associated with a specific key.
 * Errors are indexed by a serialized key - for example url or source object.
 */
function useAttachmentErrors() {
    const [attachmentErrors, setAttachmentErrors] = (0, react_1.useState)({});
    const setAttachmentError = (0, react_1.useCallback)((key, state = true) => {
        const url = convertSourceToString(key);
        if (!url) {
            return;
        }
        setAttachmentErrors((prevState) => ({
            ...prevState,
            [url]: state,
        }));
    }, []);
    const clearAttachmentErrors = (0, react_1.useCallback)(() => {
        setAttachmentErrors({});
    }, []);
    const isErrorInAttachment = (0, react_1.useCallback)((key) => attachmentErrors?.[convertSourceToString(key)], [attachmentErrors]);
    return { setAttachmentError, clearAttachmentErrors, isErrorInAttachment };
}
exports.default = useAttachmentErrors;
