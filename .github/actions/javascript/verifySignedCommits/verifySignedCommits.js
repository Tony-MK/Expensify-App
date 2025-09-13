"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github = require("@actions/github");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const PR_NUMBER = Number.parseInt(core.getInput('PR_NUMBER'), 10) || github.context.payload.pull_request?.number;
GithubUtils_1.default.octokit.pulls
    .listCommits({
    owner: CONST_1.default.GITHUB_OWNER,
    repo: CONST_1.default.APP_REPO,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_number: PR_NUMBER ?? 0,
})
    .then(({ data }) => {
    const unsignedCommits = data.filter((datum) => !datum.commit.verification?.verified);
    if (unsignedCommits.length > 0) {
        const errorMessage = `Error: the following commits are unsigned: ${JSON.stringify(unsignedCommits.map((commitObj) => commitObj.sha))}`;
        console.error(errorMessage);
        core.setFailed(errorMessage);
    }
    else {
        console.log('All commits signed! 🎉');
    }
});
