"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearByKey = exports.add = void 0;
const react_native_fs_1 = require("react-native-fs");
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/*
 * We need to save the paths of PDF files so we can delete them later.
 * This is to remove the cached PDFs when an attachment is deleted or the user logs out.
 */
let pdfPaths = {};
// We use `connectWithoutView` here since this connection only updates a module-level variable
// and doesn't need to trigger component re-renders
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.CACHED_PDF_PATHS,
    callback: (val) => {
        pdfPaths = val ?? {};
    },
});
const add = (id, path) => {
    if (pdfPaths[id]) {
        return Promise.resolve();
    }
    return react_native_onyx_1.default.merge(ONYXKEYS_1.default.CACHED_PDF_PATHS, { [id]: path });
};
exports.add = add;
const clear = (path) => {
    if (!path) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        (0, react_native_fs_1.exists)(path).then((exist) => {
            if (!exist) {
                resolve();
            }
            return (0, react_native_fs_1.unlink)(path);
        });
    });
};
const clearByKey = (id) => {
    clear(pdfPaths[id] ?? '').then(() => react_native_onyx_1.default.merge(ONYXKEYS_1.default.CACHED_PDF_PATHS, { [id]: null }));
};
exports.clearByKey = clearByKey;
