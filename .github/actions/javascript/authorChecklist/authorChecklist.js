"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const core = require("@actions/core");
const github = require("@actions/github");
const escapeRegExp_1 = require("lodash/escapeRegExp");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const newComponentCategory_1 = require("./categories/newComponentCategory");
const pathToAuthorChecklist = `https://raw.githubusercontent.com/${CONST_1.default.GITHUB_OWNER}/${CONST_1.default.APP_REPO}/main/.github/PULL_REQUEST_TEMPLATE.md`;
const checklistStartsWith = '### PR Author Checklist';
const checklistEndsWith = '\r\n### Screenshots/Videos';
const prNumber = github.context.payload.pull_request?.number;
const CHECKLIST_CATEGORIES = {
    NEW_COMPONENT: newComponentCategory_1.default,
};
/**
 * Look at the contents of the pull request, and determine which checklist categories apply.
 */
async function getChecklistCategoriesForPullRequest() {
    const checks = new Set();
    if (prNumber !== undefined) {
        const changedFiles = await GithubUtils_1.default.paginate(GithubUtils_1.default.octokit.pulls.listFiles, {
            owner: CONST_1.default.GITHUB_OWNER,
            repo: CONST_1.default.APP_REPO,
            pull_number: prNumber,
            per_page: 100,
        });
        const possibleCategories = await Promise.all(Object.values(CHECKLIST_CATEGORIES).map(async (category) => ({
            items: category.items,
            doesCategoryApply: await category.detect(changedFiles),
        })));
        for (const category of possibleCategories) {
            if (category.doesCategoryApply) {
                for (const item of category.items) {
                    checks.add(item);
                }
            }
        }
    }
    return checks;
}
function partitionWithChecklist(body) {
    const [contentBeforeChecklist, contentAfterStartOfChecklist] = body.split(checklistStartsWith);
    const [checklistContent, contentAfterChecklist] = contentAfterStartOfChecklist.split(checklistEndsWith);
    return [contentBeforeChecklist, checklistContent, contentAfterChecklist];
}
async function getNumberOfItemsFromAuthorChecklist() {
    const response = await fetch(pathToAuthorChecklist);
    const fileContents = await response.text();
    const checklist = partitionWithChecklist(fileContents).at(1);
    const numberOfChecklistItems = (checklist?.match(/\[ \]/g) ?? []).length ?? 0;
    return numberOfChecklistItems;
}
function checkPRForCompletedChecklist(expectedNumberOfChecklistItems, checklist) {
    const numberOfFinishedChecklistItems = (checklist.match(/- \[x\]/gi) ?? []).length;
    const numberOfUnfinishedChecklistItems = (checklist.match(/- \[ \]/g) ?? []).length;
    const minCompletedItems = expectedNumberOfChecklistItems - 2;
    console.log(`You completed ${numberOfFinishedChecklistItems} out of ${expectedNumberOfChecklistItems} checklist items with ${numberOfUnfinishedChecklistItems} unfinished items`);
    if (numberOfFinishedChecklistItems >= minCompletedItems && numberOfUnfinishedChecklistItems === 0) {
        console.log('PR Author checklist is complete 🎉');
        return;
    }
    console.log(`Make sure you are using the most up to date checklist found here: ${pathToAuthorChecklist}`);
    core.setFailed("PR Author Checklist is not completely filled out. Please check every box to verify you've thought about the item.");
}
async function generateDynamicChecksAndCheckForCompletion() {
    // Generate dynamic checks
    console.log('Generating dynamic checks...');
    const dynamicChecks = await getChecklistCategoriesForPullRequest();
    let isPassing = true;
    let didChecklistChange = false;
    const body = github.context.payload.pull_request?.body ?? '';
    // eslint-disable-next-line prefer-const
    let [contentBeforeChecklist, checklist, contentAfterChecklist] = partitionWithChecklist(body);
    for (const check of dynamicChecks) {
        // Check if it's already in the PR body, capturing the whether or not it's already checked
        const regex = new RegExp(`- \\[([ x])] ${(0, escapeRegExp_1.default)(check)}`);
        const match = regex.exec(checklist);
        if (!match) {
            console.log('Adding check to the checklist:', check);
            // Add it to the PR body
            isPassing = false;
            checklist += `- [ ] ${check}\r\n`;
            didChecklistChange = true;
        }
        else {
            const isChecked = match[1] === 'x';
            if (!isChecked) {
                console.log('Found unchecked checklist item:', check);
                isPassing = false;
            }
        }
    }
    // Check if some dynamic check was added with previous commit, but is not relevant anymore
    const allChecks = Object.values(CHECKLIST_CATEGORIES).reduce((acc, category) => acc.concat(category.items), []);
    for (const check of allChecks) {
        if (!dynamicChecks.has(check)) {
            const regex = new RegExp(`- \\[([ x])] ${(0, escapeRegExp_1.default)(check)}\r\n`);
            const match = regex.exec(checklist);
            if (match) {
                // Remove it from the PR body
                console.log('Check has been removed from the checklist:', check);
                checklist = checklist.replace(match[0], '');
                didChecklistChange = true;
            }
        }
    }
    // Put the PR body back together, need to add the markers back in
    const newBody = contentBeforeChecklist + checklistStartsWith + checklist + checklistEndsWith + contentAfterChecklist;
    // Update the PR body
    if (didChecklistChange && prNumber !== undefined) {
        console.log('Checklist changed, updating PR...');
        await GithubUtils_1.default.octokit.pulls.update({
            owner: CONST_1.default.GITHUB_OWNER,
            repo: CONST_1.default.APP_REPO,
            pull_number: prNumber,
            body: newBody,
        });
        console.log('Updated PR checklist');
    }
    if (!isPassing) {
        const err = new Error("New checks were added into checklist. Please check every box to verify you've thought about the item.");
        console.error(err);
        core.setFailed(err);
    }
    // check for completion
    try {
        const numberOfItems = await getNumberOfItemsFromAuthorChecklist();
        checkPRForCompletedChecklist(numberOfItems, checklist);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
if (require.main === module) {
    generateDynamicChecksAndCheckForCompletion();
}
exports.default = generateDynamicChecksAndCheckForCompletion;
