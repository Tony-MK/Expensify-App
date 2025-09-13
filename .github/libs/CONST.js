"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var GITHUB_BASE_URL_REGEX = new RegExp('https?://(?:github\\.com|api\\.github\\.com)');
var GIT_CONST = {
    GITHUB_OWNER: (_a = process.env.GITHUB_REPOSITORY_OWNER) !== null && _a !== void 0 ? _a : 'Expensify',
    APP_REPO: (_c = ((_b = process.env.GITHUB_REPOSITORY) !== null && _b !== void 0 ? _b : 'Expensify/App').split('/').at(1)) !== null && _c !== void 0 ? _c : '',
    MOBILE_EXPENSIFY_REPO: 'Mobile-Expensify',
};
var CONST = __assign(__assign({}, GIT_CONST), { APPLAUSE_BOT: 'applausebot', OS_BOTIFY: 'OSBotify', LABELS: {
        STAGING_DEPLOY: 'StagingDeployCash',
        DEPLOY_BLOCKER: 'DeployBlockerCash',
        LOCK_DEPLOY: '🔐 LockCashDeploys 🔐',
        INTERNAL_QA: 'InternalQA',
        HELP_WANTED: 'Help Wanted',
        CP_STAGING: 'CP Staging',
    }, STATE: {
        OPEN: 'open',
    }, COMMENT: {
        TYPE_BOT: 'Bot',
        NAME_GITHUB_ACTIONS: 'github-actions',
    }, ACTIONS: {
        CREATED: 'created',
        EDITED: 'edited',
    }, EVENTS: {
        ISSUE_COMMENT: 'issue_comment',
    }, RUN_EVENT: {
        PULL_REQUEST: 'pull_request',
        PULL_REQUEST_TARGET: 'pull_request_target',
        PUSH: 'push',
    }, RUN_STATUS: {
        COMPLETED: 'completed',
        IN_PROGRESS: 'in_progress',
        QUEUED: 'queued',
    }, RUN_STATUS_CONCLUSION: {
        SUCCESS: 'success',
    }, TEST_WORKFLOW_NAME: 'Jest Unit Tests', TEST_WORKFLOW_PATH: '.github/workflows/test.yml', PROPOSAL_KEYWORD: 'Proposal', DATE_FORMAT_STRING: 'yyyy-MM-dd', PULL_REQUEST_REGEX: new RegExp("".concat(GITHUB_BASE_URL_REGEX.source, "/.*/.*/pull/([0-9]+).*")), ISSUE_REGEX: new RegExp("".concat(GITHUB_BASE_URL_REGEX.source, "/.*/.*/issues/([0-9]+).*")), ISSUE_OR_PULL_REQUEST_REGEX: new RegExp("".concat(GITHUB_BASE_URL_REGEX.source, "/.*/.*/(?:pull|issues)/([0-9]+).*")), POLL_RATE: 10000, APP_REPO_URL: "https://github.com/".concat(GIT_CONST.GITHUB_OWNER, "/").concat(GIT_CONST.APP_REPO), APP_REPO_GIT_URL: "git@github.com:".concat(GIT_CONST.GITHUB_OWNER, "/").concat(GIT_CONST.APP_REPO, ".git"), MOBILE_EXPENSIFY_URL: "https://github.com/".concat(GIT_CONST.GITHUB_OWNER, "/").concat(GIT_CONST.MOBILE_EXPENSIFY_REPO), NO_ACTION: 'NO_ACTION', ACTION_EDIT: 'ACTION_EDIT', ACTION_REQUIRED: 'ACTION_REQUIRED', ACTION_HIDE_DUPLICATE: 'ACTION_HIDE_DUPLICATE' });
exports.default = CONST;
