"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localFileCreate_1 = require("@libs/localFileCreate");
/**
 * Creates a Blob with the given fileName and textContent, then dynamically
 * creates a temporary anchor, just to programmatically click it, so the file
 * is downloaded by the browser.
 */
const localFileDownload = (fileName, textContent) => {
    (0, localFileCreate_1.default)(`${fileName}.txt`, textContent).then(({ path, newFileName }) => {
        const link = document.createElement('a');
        link.download = newFileName;
        link.href = path;
        link.click();
    });
};
exports.default = localFileDownload;
