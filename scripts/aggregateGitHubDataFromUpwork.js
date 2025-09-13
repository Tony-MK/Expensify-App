"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This script is used for categorizing upwork costs into cost buckets for accounting purposes.
 *
 * To run this script from the root of E/App:
 *
 * ts-node ./scripts/aggregateGitHubDataFromUpwork.js <path_to_csv> <github_pat> <output_path>
 *
 * The input file must be a CSV with a single column containing just the GitHub issue number. The CSV must have a single header row.
 */
const utils_1 = require("@actions/github/lib/utils");
const plugin_paginate_rest_1 = require("@octokit/plugin-paginate-rest");
const plugin_throttling_1 = require("@octokit/plugin-throttling");
const csv_writer_1 = require("csv-writer");
const fs_1 = require("fs");
if (process.argv.length < 3) {
    throw new Error('Error: must provide filepath for CSV data');
}
if (process.argv.length < 4) {
    throw new Error('Error: must provide GitHub token');
}
if (process.argv.length < 5) {
    throw new Error('Error: must provide output file path');
}
// Get filepath for csv
const inputFilepath = process.argv.at(2);
if (!inputFilepath) {
    throw new Error('Error: must provide filepath for CSV data');
}
// Get GitHub token
const token = (process.argv.at(3) ?? '').trim();
if (!token) {
    throw new Error('Error: must provide GitHub token');
}
const Octokit = utils_1.GitHub.plugin(plugin_throttling_1.throttling, plugin_paginate_rest_1.paginateRest);
const octokit = new Octokit((0, utils_1.getOctokitOptions)(token, {
    throttle: {
        onRateLimit: (retryAfter, options) => {
            console.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
            // Retry once after hitting a rate limit error, then give up
            if (options.request.retryCount <= 1) {
                console.log(`Retrying after ${retryAfter} seconds!`);
                return true;
            }
        },
        onAbuseLimit: (retryAfter, options) => {
            // does not retry, only logs a warning
            console.warn(`Abuse detected for request ${options.method} ${options.url}`);
        },
    },
}));
// Get output filepath
const outputFilepath = process.argv.at(4);
if (!outputFilepath) {
    throw new Error('Error: must provide output file path');
}
// Get data from csv
const issues = fs_1.default
    .readFileSync(inputFilepath)
    .toString()
    .split('\n')
    .reduce((acc, issue) => {
    if (!issue) {
        return acc;
    }
    const issueNum = Number(issue.trim());
    if (!issueNum) {
        return acc;
    }
    acc.push(issueNum);
    return acc;
}, []);
const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
    path: outputFilepath,
    header: [
        { id: 'number', title: 'number' },
        { id: 'title', title: 'title' },
        { id: 'labels', title: 'labels' },
        { id: 'type', title: 'type' },
        { id: 'capSWProjects', title: 'capSWProjects' },
    ],
});
function getIssueTypeFromLabels(labels) {
    if (labels.includes('NewFeature')) {
        return 'feature';
    }
    if (labels.includes('Bug')) {
        return 'bug';
    }
    return 'other';
}
/**
 * Returns a comma-delimited string with all projects associated with the given issue.
 */
async function getProjectsForIssue(issueNumber) {
    const response = await octokit.graphql(`
        {
                  repository(owner: "Expensify", name: "App") {
                    issue(number: ${issueNumber}) {
                      projectsV2(last: 30) {
                        nodes {
                          title
                        }
                      }
                    }
                  }
                }
        `);
    return response.repository.issue.projectsV2.nodes.map((node) => node.title).join(',');
}
async function getGitHubData() {
    const gitHubData = [];
    // Note: we fetch issues in a loop rather than in parallel to help address rate limiting issues with a PAT
    for (const issueNumber of issues) {
        console.info(`Fetching ${issueNumber}`);
        const result = await octokit.rest.issues
            .get({
            owner: 'Expensify',
            repo: 'App',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            issue_number: issueNumber,
        })
            .catch(() => {
            console.warn(`Error getting issue ${issueNumber}`);
        });
        if (result) {
            const issue = result.data;
            const labels = issue.labels.reduce((acc, label) => {
                if (typeof label === 'string') {
                    acc.push(label);
                }
                else if (label.name) {
                    acc.push(label.name);
                }
                return acc;
            }, []);
            const type = getIssueTypeFromLabels(labels);
            let capSWProjects = '';
            if (type === 'feature') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                capSWProjects = await getProjectsForIssue(issueNumber);
            }
            gitHubData.push({
                number: issue.number,
                title: issue.title,
                labels,
                type,
                capSWProjects,
            });
        }
    }
    return gitHubData;
}
getGitHubData()
    .then((gitHubData) => csvWriter.writeRecords(gitHubData))
    .then(() => console.info(`Done ✅ Wrote file to ${outputFilepath}`));
