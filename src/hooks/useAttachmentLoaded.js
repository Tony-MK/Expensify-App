"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function convertSourceToString(source) {
    var _a;
    if (typeof source === 'string' || typeof source === 'number') {
        return source.toString();
    }
    if (Array.isArray(source)) {
        return source.map(function (src) { return src.uri; }).join(', ');
    }
    if ('uri' in source) {
        return (_a = source.uri) !== null && _a !== void 0 ? _a : '';
    }
    return '';
}
/**
 * Custom hook for tracking whether an attachment has successfully loaded.
 */
function useAttachmentLoaded() {
    var _a = (0, react_1.useState)({}), attachmentLoaded = _a[0], setAttachmentLoaded = _a[1];
    var setAttachmentLoadedState = (0, react_1.useCallback)(function (key, state) {
        if (state === void 0) { state = true; }
        var url = convertSourceToString(key);
        if (!url) {
            return;
        }
        setAttachmentLoaded(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), (_a = {}, _a[url] = state, _a)));
        });
    }, []);
    var clearAttachmentLoaded = (0, react_1.useCallback)(function () {
        setAttachmentLoaded({});
    }, []);
    var isAttachmentLoaded = (0, react_1.useCallback)(function (key) { return !!(attachmentLoaded === null || attachmentLoaded === void 0 ? void 0 : attachmentLoaded[convertSourceToString(key)]); }, [attachmentLoaded]);
    return {
        setAttachmentLoaded: setAttachmentLoadedState,
        clearAttachmentLoaded: clearAttachmentLoaded,
        isAttachmentLoaded: isAttachmentLoaded,
    };
}
exports.default = useAttachmentLoaded;
