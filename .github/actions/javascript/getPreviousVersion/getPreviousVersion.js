"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const fs_1 = require("fs");
const GitUtils_1 = require("@github/libs/GitUtils");
const versionUpdater = require("@github/libs/versionUpdater");
function run() {
    const semverLevel = core.getInput('SEMVER_LEVEL', { required: true });
    if (!semverLevel || !versionUpdater.isValidSemverLevel(semverLevel)) {
        core.setFailed(`'Error: Invalid input for 'SEMVER_LEVEL': ${semverLevel}`);
    }
    const { version: currentVersion } = JSON.parse((0, fs_1.readFileSync)('./package.json', 'utf8'));
    if (!currentVersion) {
        core.setFailed('Error: Could not read package.json');
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const previousVersion = GitUtils_1.default.getPreviousExistingTag(currentVersion, semverLevel);
    core.setOutput('PREVIOUS_VERSION', previousVersion);
    return previousVersion;
}
if (require.main === module) {
    run();
}
exports.default = run;
