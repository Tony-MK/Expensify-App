"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const getCurrentBranchName = () => {
    const stdout = (0, child_process_1.execSync)('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
    });
    return stdout.trim();
};
exports.default = getCurrentBranchName;
