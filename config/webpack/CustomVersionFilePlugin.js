"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const package_json_1 = require("../../package.json");
/**
 * Custom webpack plugin that writes the app version (from package.json) and the webpack hash to './version.json'
 */
class CustomVersionFilePlugin {
    apply(compiler) {
        compiler.hooks.done.tap(this.constructor.name, () => {
            const versionPath = path_1.default.join(__dirname, '/../../dist/version.json');
            fs_1.default.promises
                .mkdir(path_1.default.dirname(versionPath), { recursive: true })
                .then(() => fs_1.default.promises.readFile(versionPath, 'utf8'))
                .then((existingVersion) => {
                const { version } = JSON.parse(existingVersion);
                if (version !== package_json_1.version) {
                    fs_1.default.promises.writeFile(versionPath, JSON.stringify({ version: package_json_1.version }), 'utf8');
                }
            })
                .catch((err) => {
                if (err.code === 'ENOENT') {
                    // if file doesn't exist
                    fs_1.default.promises.writeFile(versionPath, JSON.stringify({ version: package_json_1.version }), 'utf8');
                }
                else {
                    throw err;
                }
            });
        });
    }
}
exports.default = CustomVersionFilePlugin;
