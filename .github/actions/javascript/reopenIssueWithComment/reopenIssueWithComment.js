"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const issueNumber = Number(core.getInput('ISSUE_NUMBER', { required: true }));
const comment = core.getInput('COMMENT', { required: true });
function reopenIssueWithComment() {
    console.log(`Reopening issue #${issueNumber}`);
    return GithubUtils_1.default.octokit.issues
        .update({
        owner: CONST_1.default.GITHUB_OWNER,
        repo: CONST_1.default.APP_REPO,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        issue_number: issueNumber,
        state: 'open',
    })
        .then(() => {
        console.log(`Commenting on issue #${issueNumber}`);
        return GithubUtils_1.default.octokit.issues.createComment({
            owner: CONST_1.default.GITHUB_OWNER,
            repo: CONST_1.default.APP_REPO,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            issue_number: issueNumber,
            body: comment,
        });
    });
}
reopenIssueWithComment()
    .then(() => {
    console.log(`Issue #${issueNumber} successfully reopened and commented: "${comment}"`);
    process.exit(0);
})
    .catch((err) => {
    console.error(`Something went wrong. The issue #${issueNumber} was not successfully reopened`, err);
    core.setFailed(err);
});
