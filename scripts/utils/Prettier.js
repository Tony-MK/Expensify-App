"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const prettier_1 = require("prettier");
/**
 * Utility class to programmatically format files with prettier.
 */
class Prettier {
    constructor() {
        /**
         * Config loaded from .prettierrc.js
         */
        this.config = null;
    }
    /**
     * Format a single file with prettier.
     */
    static async format(filePath) {
        if (!Prettier.instance) {
            Prettier.instance = new Prettier();
            await Prettier.instance.loadConfig(filePath);
        }
        if (!Prettier.instance.config) {
            throw new Error('Failed to load Prettier configuration.');
        }
        const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
        const formatted = await prettier_1.default.format(fileContent, {
            ...Prettier.instance.config,
            filepath: filePath, // ensures correct parser
        });
        fs_1.default.writeFileSync(filePath, formatted, 'utf8');
        console.log(`✅ Formatted: ${filePath}`);
    }
    async loadConfig(filePath) {
        const configPath = path_1.default.resolve(__dirname, '../../.prettierrc.js');
        this.config = await prettier_1.default.resolveConfig(filePath, {
            config: configPath,
        });
    }
}
exports.default = Prettier;
