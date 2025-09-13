"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const run = function () {
    const artifactName = core.getInput('ARTIFACT_NAME', { required: true });
    return GithubUtils_1.default.getArtifactByName(artifactName)
        .then((artifact) => {
        if (artifact === undefined) {
            console.log(`No artifact found with the name ${artifactName}`);
            core.setOutput('ARTIFACT_FOUND', false);
            return;
        }
        console.log('Artifact info', artifact);
        core.setOutput('ARTIFACT_FOUND', true);
        core.setOutput('ARTIFACT_ID', artifact.id);
        core.setOutput('ARTIFACT_WORKFLOW_ID', artifact.workflow_run?.id);
    })
        .catch((error) => {
        console.error('A problem occurred while trying to communicate with the GitHub API', error);
        core.setFailed(error);
    });
};
if (require.main === module) {
    run();
}
exports.default = run;
