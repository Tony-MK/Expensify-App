"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RNFS = {
    exists: () => Promise.resolve(false),
    unlink: () => Promise.resolve(),
    copyFile: () => Promise.resolve(),
    DocumentDirectoryPath: '',
    writeFile: (path, data, encoding) => {
        const dataStr = `data:text/json;charset=${encoding},${encodeURIComponent(JSON.stringify(data))}`;
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', path);
        document.body.appendChild(downloadAnchorNode); // required for Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        return Promise.resolve();
    },
};
exports.default = RNFS;
