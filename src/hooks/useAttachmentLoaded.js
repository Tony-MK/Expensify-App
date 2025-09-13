"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function convertSourceToString(source) {
    if (typeof source === 'string' || typeof source === 'number') {
        return source.toString();
    }
    if (Array.isArray(source)) {
        return source.map((src) => src.uri).join(', ');
    }
    if ('uri' in source) {
        return source.uri ?? '';
    }
    return '';
}
/**
 * Custom hook for tracking whether an attachment has successfully loaded.
 */
function useAttachmentLoaded() {
    const [attachmentLoaded, setAttachmentLoaded] = (0, react_1.useState)({});
    const setAttachmentLoadedState = (0, react_1.useCallback)((key, state = true) => {
        const url = convertSourceToString(key);
        if (!url) {
            return;
        }
        setAttachmentLoaded((prevState) => ({
            ...prevState,
            [url]: state,
        }));
    }, []);
    const clearAttachmentLoaded = (0, react_1.useCallback)(() => {
        setAttachmentLoaded({});
    }, []);
    const isAttachmentLoaded = (0, react_1.useCallback)((key) => !!attachmentLoaded?.[convertSourceToString(key)], [attachmentLoaded]);
    return {
        setAttachmentLoaded: setAttachmentLoadedState,
        clearAttachmentLoaded,
        isAttachmentLoaded,
    };
}
exports.default = useAttachmentLoaded;
