"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const versionUpdater = require("@github/libs/versionUpdater");
const bumpVersion_1 = require("@scripts/bumpVersion");
async function run() {
    try {
        const semverLevel = core.getInput('SEMVER_LEVEL', { required: true });
        if (!versionUpdater.isValidSemverLevel(semverLevel)) {
            throw new Error(`Invalid SEMVER_LEVEL ${semverLevel}`);
        }
        const newVersion = await (0, bumpVersion_1.default)(semverLevel);
        core.setOutput('NEW_VERSION', newVersion);
    }
    catch (e) {
        if (e instanceof Error) {
            core.setFailed(e);
            return;
        }
        core.setFailed('An unknown error occurred.');
    }
}
if (require.main === module) {
    run();
}
exports.default = run;
