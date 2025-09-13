"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = require("@actions/core");
var child_process_1 = require("child_process");
var CONST_1 = require("./CONST");
var GithubUtils_1 = require("./GithubUtils");
var versionUpdater_1 = require("./versionUpdater");
/**
 * Check if a tag exists locally or in the remote.
 */
function tagExists(tag) {
    try {
        // Check if the tag exists locally
        (0, child_process_1.execSync)("git show-ref --tags ".concat(tag), { stdio: 'ignore' });
        return true; // Tag exists locally
    }
    catch (error) {
        // Tag does not exist locally, check in remote
        var shouldRetry = true;
        var needsRepack = false;
        var doesTagExist = false;
        while (shouldRetry) {
            try {
                if (needsRepack) {
                    // We have seen some scenarios where this fixes the git fetch.
                    // Why? Who knows... https://github.com/Expensify/App/pull/31459
                    (0, child_process_1.execSync)('git repack -d', { stdio: 'inherit' });
                }
                (0, child_process_1.execSync)("git ls-remote --exit-code --tags origin ".concat(tag), { stdio: 'ignore' });
                doesTagExist = true;
                shouldRetry = false;
            }
            catch (e) {
                if (!needsRepack) {
                    console.log('Attempting to repack and retry...');
                    needsRepack = true;
                }
                else {
                    console.error("Repack didn't help, giving up...");
                    shouldRetry = false;
                }
            }
        }
        return doesTagExist;
    }
}
/**
 * This essentially just calls getPreviousVersion in a loop, until it finds a version for which a tag exists.
 * It's useful if we manually perform a version bump, because in that case a tag may not exist for the previous version.
 *
 * @param tag the current tag
 * @param level the Semver level to step backward by
 */
function getPreviousExistingTag(tag, level) {
    var previousVersion = (0, versionUpdater_1.getPreviousVersion)(tag.replace('-staging', ''), level);
    var tagExistsForPreviousVersion = false;
    while (!tagExistsForPreviousVersion) {
        if (tagExists(previousVersion)) {
            tagExistsForPreviousVersion = true;
            break;
        }
        if (tagExists("".concat(previousVersion, "-staging"))) {
            tagExistsForPreviousVersion = true;
            previousVersion = "".concat(previousVersion, "-staging");
            break;
        }
        console.log("Tag for previous version ".concat(previousVersion, " does not exist. Checking for an older version..."));
        previousVersion = (0, versionUpdater_1.getPreviousVersion)(previousVersion, level);
    }
    return previousVersion;
}
/**
 * Parse merged PRs, excluding those from irrelevant branches.
 */
function getValidMergedPRs(commits) {
    var mergedPRs = new Set();
    commits.forEach(function (commit) {
        var author = commit.authorName;
        if (author === CONST_1.default.OS_BOTIFY) {
            return;
        }
        // Retrieve the PR number from the commit subject,
        var match = commit.subject.match(/Merge pull request #(\d+) from (?!Expensify\/.*-cherry-pick-(staging|production))/);
        if (!Array.isArray(match) || match.length < 2) {
            return;
        }
        var pr = Number.parseInt(match[1], 10);
        if (mergedPRs.has(pr)) {
            // If a PR shows up in the log twice, that means that the PR was deployed in the previous checklist.
            // That also means that we don't want to include it in the current checklist, so we remove it now.
            mergedPRs.delete(pr);
            return;
        }
        mergedPRs.add(pr);
    });
    return Array.from(mergedPRs);
}
/**
 * Takes in two git tags and returns a list of PR numbers of all PRs merged between those two tags
 */
function getPullRequestsDeployedBetween(fromTag, toTag, repositoryName) {
    return __awaiter(this, void 0, void 0, function () {
        var apiCommitList, apiPullRequestNumbers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Looking for commits made between ".concat(fromTag, " and ").concat(toTag, "..."));
                    return [4 /*yield*/, GithubUtils_1.default.getCommitHistoryBetweenTags(fromTag, toTag, repositoryName)];
                case 1:
                    apiCommitList = _a.sent();
                    apiPullRequestNumbers = getValidMergedPRs(apiCommitList).sort(function (a, b) { return a - b; });
                    console.log("Found ".concat(apiCommitList.length, " commits."));
                    core.startGroup('Parsed PRs:');
                    core.info(apiPullRequestNumbers.join(', '));
                    core.endGroup();
                    return [2 /*return*/, apiPullRequestNumbers];
            }
        });
    });
}
exports.default = {
    getPreviousExistingTag: getPreviousExistingTag,
    getValidMergedPRs: getValidMergedPRs,
    getPullRequestsDeployedBetween: getPullRequestsDeployedBetween,
};
