"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const ActionUtils_1 = require("@github/libs/ActionUtils");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const isEmptyObject_1 = require("@github/libs/isEmptyObject");
const DEFAULT_PAYLOAD = {
    owner: CONST_1.default.GITHUB_OWNER,
    repo: CONST_1.default.APP_REPO,
};
const pullRequestNumber = (0, ActionUtils_1.getJSONInput)('PULL_REQUEST_NUMBER', { required: false }, null);
const user = core.getInput('USER', { required: true });
if (pullRequestNumber) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    console.log(`Looking for pull request w/ number: ${pullRequestNumber}`);
}
if (user) {
    console.log(`Looking for pull request w/ user: ${user}`);
}
/**
 * Output pull request merge actor.
 */
function outputMergeActor(PR) {
    if (user === CONST_1.default.OS_BOTIFY) {
        core.setOutput('MERGE_ACTOR', PR.merged_by?.login);
    }
    else {
        core.setOutput('MERGE_ACTOR', user);
    }
}
/**
 * Output forked repo URL if PR includes changes from a fork.
 */
function outputForkedRepoUrl(PR) {
    if (PR.head?.repo?.html_url === CONST_1.default.APP_REPO_URL) {
        core.setOutput('FORKED_REPO_URL', '');
    }
    else {
        core.setOutput('FORKED_REPO_URL', `${PR.head?.repo?.html_url}.git`);
    }
}
GithubUtils_1.default.octokit.pulls
    .get({
    ...DEFAULT_PAYLOAD,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_number: pullRequestNumber,
})
    .then(({ data: PR }) => {
    if (!(0, isEmptyObject_1.isEmptyObject)(PR)) {
        console.log(`Found matching pull request: ${PR.html_url}`);
        console.log(`Pull request details: ${JSON.stringify(PR)}}`);
        core.setOutput('MERGE_COMMIT_SHA', PR.merge_commit_sha);
        core.setOutput('HEAD_COMMIT_SHA', PR.head?.sha);
        core.setOutput('IS_MERGED', PR.merged);
        outputMergeActor(PR);
        outputForkedRepoUrl(PR);
    }
    else {
        const err = new Error('Could not find matching pull request');
        console.error(err);
        core.setFailed(err);
    }
})
    .catch((err) => {
    console.log(`An unknown error occurred with the GitHub API: ${err}`);
    core.setFailed(err);
});
