"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github = require("@actions/github");
const ActionUtils_1 = require("@github/libs/ActionUtils");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const GitUtils_1 = require("@github/libs/GitUtils");
async function run() {
    try {
        const inputTag = core.getInput('TAG', { required: true });
        const isProductionDeploy = !!(0, ActionUtils_1.getJSONInput)('IS_PRODUCTION_DEPLOY', { required: false }, false);
        const deployEnv = isProductionDeploy ? 'production' : 'staging';
        console.log(`Looking for PRs deployed to ${deployEnv} in ${inputTag}...`);
        let priorTag;
        let foundCurrentRelease = false;
        await GithubUtils_1.default.paginate(GithubUtils_1.default.octokit.repos.listReleases, {
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            per_page: 100,
        }, ({ data }, done) => {
            // For production deploys, look only at other production deploys.
            // staging deploys can be compared with other staging deploys or production deploys.
            const filteredData = isProductionDeploy ? data.filter((release) => !release.prerelease) : data;
            // Release was in the last page, meaning the previous release is the first item in this page
            if (foundCurrentRelease) {
                priorTag = data.at(0)?.tag_name;
                done();
                return filteredData;
            }
            // Search for the index of input tag
            const indexOfCurrentRelease = filteredData.findIndex((release) => release.tag_name === inputTag);
            // If it happens to be at the end of this page, then the previous tag will be in the next page.
            // Set a flag showing we found it so we grab the first release of the next page
            if (indexOfCurrentRelease === filteredData.length - 1) {
                foundCurrentRelease = true;
                return filteredData;
            }
            // If it's anywhere else in this page, the the prior release is the next item in the page
            if (indexOfCurrentRelease >= 0) {
                priorTag = filteredData.at(indexOfCurrentRelease + 1)?.tag_name;
                done();
            }
            // Release not in this page (or we're done)
            return filteredData;
        });
        if (!priorTag) {
            throw new Error('Something went wrong and the prior tag could not be found.');
        }
        console.log(`Looking for PRs deployed to ${deployEnv} between ${priorTag} and ${inputTag}`);
        const prList = await GitUtils_1.default.getPullRequestsDeployedBetween(priorTag, inputTag, CONST_1.default.APP_REPO);
        console.log('Found the pull request list: ', prList);
        core.setOutput('PR_LIST', prList);
        // Get Mobile-Expensify PRs deployed between the same tags
        let mobileExpensifyPRList = [];
        try {
            mobileExpensifyPRList = await GitUtils_1.default.getPullRequestsDeployedBetween(priorTag, inputTag, CONST_1.default.MOBILE_EXPENSIFY_REPO);
            console.log('Found Mobile-Expensify pull request list: ', mobileExpensifyPRList);
        }
        catch (error) {
            // Check if this is a forked repository
            if (process.env.GITHUB_REPOSITORY !== `${CONST_1.default.GITHUB_OWNER}/${CONST_1.default.APP_REPO}`) {
                console.warn("⚠️ Unable to fetch Mobile-Expensify PRs because this workflow is running on a forked repository and secrets aren't accessible. This is expected for development/testing on forks.");
            }
            else {
                console.error('Failed to fetch Mobile-Expensify PRs from main repository:', error);
                // Don't fail the entire workflow, just skip Mobile-Expensify PRs
            }
        }
        core.setOutput('MOBILE_EXPENSIFY_PR_LIST', mobileExpensifyPRList);
    }
    catch (error) {
        console.error(error.message);
        core.setFailed(error);
    }
}
if (require.main === module) {
    run();
}
exports.default = run;
