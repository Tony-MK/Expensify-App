"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention, import/no-import-module-exports */
const core = require("@actions/core");
const github_1 = require("@actions/github");
const memoize_1 = require("lodash/memoize");
const ActionUtils = require("@github/libs/ActionUtils");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
/**
 * Return a nicely formatted message for the table based on the result of the GitHub action job
 */
function getDeployTableMessage(platformResult) {
    switch (platformResult) {
        case 'success':
            return `${platformResult} ✅`;
        case 'cancelled':
            return `${platformResult} 🔪`;
        case 'skipped':
            return `${platformResult} 🚫`;
        case 'failure':
        default:
            return `${platformResult} ❌`;
    }
}
async function commentPR(PR, message, repo = github_1.context.repo.repo) {
    try {
        await GithubUtils_1.default.createComment(repo, PR, message);
        console.log(`Comment created on ${repo}#${PR} successfully 🎉`);
    }
    catch (err) {
        console.log(`Unable to write comment on ${repo}#${PR} 😞`);
        if (err instanceof Error) {
            core.setFailed(err.message);
        }
    }
}
const workflowURL = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
const getCommit = (0, memoize_1.default)(GithubUtils_1.default.octokit.git.getCommit);
/**
 * Process staging deploy comments for a list of PRs
 */
async function commentStagingDeployPRs(prList, repoName, recentTags, getDeployMessage) {
    for (const prNumber of prList) {
        try {
            const { data: pr } = await GithubUtils_1.default.octokit.pulls.get({
                owner: CONST_1.default.GITHUB_OWNER,
                repo: repoName,
                pull_number: prNumber,
            });
            // Find the deployer: either the merger, or for CPs, the tag creator
            const isCP = pr.labels.some(({ name: labelName }) => labelName === CONST_1.default.LABELS.CP_STAGING);
            let deployer = pr.merged_by?.login;
            if (isCP) {
                for (const tag of recentTags) {
                    const { data: commit } = await getCommit({
                        owner: CONST_1.default.GITHUB_OWNER,
                        repo: repoName,
                        commit_sha: tag.commit.sha,
                    });
                    const prNumForCPMergeCommit = commit.message.match(/Merge pull request #(\d+)[\S\s]*\(cherry picked from commit .*\)/);
                    if (prNumForCPMergeCommit?.at(1) === String(prNumber)) {
                        const cpActor = commit.message.match(/.*\(cherry-picked to .* by (.*)\)/)?.at(1);
                        if (cpActor) {
                            deployer = cpActor;
                        }
                        break;
                    }
                }
            }
            const title = pr.title;
            const deployMessage = deployer ? getDeployMessage(deployer, isCP ? 'Cherry-picked' : 'Deployed', title) : '';
            await commentPR(prNumber, deployMessage, repoName);
        }
        catch (error) {
            if (error.status === 404) {
                console.log(`Unable to comment on ${repoName} PR #${prNumber}. GitHub responded with 404.`);
            }
            else if (repoName === CONST_1.default.MOBILE_EXPENSIFY_REPO && process.env.GITHUB_REPOSITORY !== `${CONST_1.default.GITHUB_OWNER}/${CONST_1.default.APP_REPO}`) {
                console.warn(`Unable to comment on ${repoName} PR #${prNumber} from forked repository. This is expected.`);
            }
            else {
                throw error;
            }
        }
    }
}
async function run() {
    const prList = ActionUtils.getJSONInput('PR_LIST', { required: true }).map((num) => Number.parseInt(num, 10));
    const mobileExpensifyPRListInput = ActionUtils.getJSONInput('MOBILE_EXPENSIFY_PR_LIST', { required: false });
    const mobileExpensifyPRList = Array.isArray(mobileExpensifyPRListInput) ? mobileExpensifyPRListInput.map((num) => Number.parseInt(num, 10)) : [];
    const isProd = ActionUtils.getJSONInput('IS_PRODUCTION_DEPLOY', { required: true });
    const version = core.getInput('DEPLOY_VERSION', { required: true });
    const androidResult = getDeployTableMessage(core.getInput('ANDROID', { required: true }));
    const desktopResult = getDeployTableMessage(core.getInput('DESKTOP', { required: true }));
    const iOSResult = getDeployTableMessage(core.getInput('IOS', { required: true }));
    const webResult = getDeployTableMessage(core.getInput('WEB', { required: true }));
    const date = core.getInput('DATE');
    const note = core.getInput('NOTE');
    function getDeployMessage(deployer, deployVerb, prTitle) {
        let message = `🚀 [${deployVerb}](${workflowURL}) to ${isProd ? 'production' : 'staging'}`;
        message += ` by https://github.com/${deployer} in version: ${version} `;
        if (date) {
            message += `on ${date}`;
        }
        message += `🚀`;
        message += `\n\nplatform | result\n---|---\n🖥 desktop 🖥|${desktopResult}`;
        message += `\n🕸 web 🕸|${webResult}`;
        message += `\n🤖 android 🤖|${androidResult}\n🍎 iOS 🍎|${iOSResult}`;
        if (deployVerb === 'Cherry-picked' && !/no ?qa/gi.test(prTitle ?? '')) {
            // eslint-disable-next-line max-len
            message +=
                '\n\n@Expensify/applauseleads please QA this PR and check it off on the [deploy checklist](https://github.com/Expensify/App/issues?q=is%3Aopen+is%3Aissue+label%3AStagingDeployCash) if it passes.';
        }
        if (note) {
            message += `\n\n_Note:_ ${note}`;
        }
        return message;
    }
    if (isProd) {
        // Find the previous deploy checklist
        const { data: deployChecklists } = await GithubUtils_1.default.octokit.issues.listForRepo({
            owner: CONST_1.default.GITHUB_OWNER,
            repo: CONST_1.default.APP_REPO,
            labels: CONST_1.default.LABELS.STAGING_DEPLOY,
            state: 'closed',
        });
        const previousChecklistID = deployChecklists.at(0)?.number;
        if (!previousChecklistID) {
            throw new Error('Could not find the previous checklist ID');
        }
        // who closed the last deploy checklist?
        const deployer = await GithubUtils_1.default.getActorWhoClosedIssue(previousChecklistID);
        // Create comment on each pull request (one at a time to avoid throttling issues)
        const deployMessage = getDeployMessage(deployer, 'Deployed');
        for (const pr of prList) {
            await commentPR(pr, deployMessage);
        }
        console.log(`✅ Added production deploy comment on ${prList.length} App PRs`);
        // Comment on Mobile-Expensify PRs as well
        for (const pr of mobileExpensifyPRList) {
            await commentPR(pr, deployMessage, CONST_1.default.MOBILE_EXPENSIFY_REPO);
        }
        if (mobileExpensifyPRList.length > 0) {
            console.log(`✅ Added production deploy comment on ${mobileExpensifyPRList.length} Mobile-Expensify PRs`);
        }
        return;
    }
    const { data: appRecentTags } = await GithubUtils_1.default.octokit.repos.listTags({
        owner: CONST_1.default.GITHUB_OWNER,
        repo: CONST_1.default.APP_REPO,
        per_page: 100,
    });
    // Only fetch Mobile-Expensify tags if there are Mobile-Expensify PRs
    let mobileExpensifyRecentTags = [];
    if (mobileExpensifyPRList.length > 0) {
        try {
            const response = await GithubUtils_1.default.octokit.repos.listTags({
                owner: CONST_1.default.GITHUB_OWNER,
                repo: CONST_1.default.MOBILE_EXPENSIFY_REPO,
                per_page: 100,
            });
            mobileExpensifyRecentTags = response.data;
        }
        catch (error) {
            if (process.env.GITHUB_REPOSITORY !== `${CONST_1.default.GITHUB_OWNER}/${CONST_1.default.APP_REPO}`) {
                console.warn('Unable to fetch Mobile-Expensify tags from forked repository. This is expected.');
            }
            else {
                console.error('Failed to fetch Mobile-Expensify tags:', error);
            }
        }
    }
    // Comment on the PRs
    await commentStagingDeployPRs(prList, CONST_1.default.APP_REPO, appRecentTags, getDeployMessage);
    console.log(`✅ Added staging deploy comment ${prList.length} App PRs`);
    if (mobileExpensifyPRList.length > 0) {
        await commentStagingDeployPRs(mobileExpensifyPRList, CONST_1.default.MOBILE_EXPENSIFY_REPO, mobileExpensifyRecentTags, getDeployMessage);
        console.log(`✅ Completed staging deploy comment on ${mobileExpensifyPRList.length} Mobile-Expensify PRs`);
    }
}
if (require.main === module) {
    run();
}
module.exports = run;
