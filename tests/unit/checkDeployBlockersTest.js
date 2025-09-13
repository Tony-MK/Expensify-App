"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
const core = require("@actions/core");
const checkDeployBlockers_1 = require("@github/actions/javascript/checkDeployBlockers/checkDeployBlockers");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const asMutable_1 = require("@src/types/utils/asMutable");
// Static mock function for core.getInput
const mockGetInput = jest.fn().mockImplementation((arg) => {
    if (arg === 'GITHUB_TOKEN') {
        return 'fake_token';
    }
    if (arg === 'ISSUE_NUMBER') {
        return 1;
    }
});
const mockSetOutput = jest.fn();
const mockGetIssue = jest.fn();
const mockListComments = jest.fn();
beforeAll(() => {
    // Mock core module
    (0, asMutable_1.default)(core).getInput = mockGetInput;
    (0, asMutable_1.default)(core).setOutput = mockSetOutput;
    // Mock octokit module
    const mockOctokit = {
        rest: {
            issues: {
                get: mockGetIssue,
                listComments: mockListComments,
            },
        },
    };
    GithubUtils_1.default.internalOctokit = mockOctokit;
});
let baseComments = {};
beforeEach(() => {
    baseComments = {
        data: [
            {
                body: 'foo',
            },
            {
                body: 'bar',
            },
            {
                body: ':shipit:',
            },
        ],
    };
});
afterEach(() => {
    mockSetOutput.mockClear();
    mockGetIssue.mockClear();
    mockListComments.mockClear();
});
afterAll(() => {
    jest.clearAllMocks();
});
function checkbox(isClosed) {
    return isClosed ? '[x]' : '[ ]';
}
function mockIssue(prList, deployBlockerList) {
    return {
        data: {
            number: 1,
            title: "Scott's QA Checklist",
            body: `
**Release Version:** \`1.1.31-2\`
**Compare Changes:** https://github.com/${process.env.GITHUB_REPOSITORY}/compare/production...staging

**This release contains changes from the following pull requests:**
${prList
                .map(({ url, isQASuccess }) => `
- ${checkbox(isQASuccess)} ${url}
`)
                .join('\n')}
${!deployBlockerList || deployBlockerList.length < 0
                ? `

**Deploy Blockers:**`
                : ''}
${deployBlockerList
                ?.map(({ url, isQASuccess }) => `
- ${checkbox(isQASuccess)} ${url}
`)
                .join('\n')}
cc @Expensify/applauseleads
`,
        },
    };
}
describe('checkDeployBlockers', () => {
    const allClearIssue = mockIssue([{ url: `https://github.com/${process.env.GITHUB_REPOSITORY}/pull/6882`, isQASuccess: true }]);
    describe('checkDeployBlockers', () => {
        test('Test an issue with all checked items and :shipit:', async () => {
            mockGetIssue.mockResolvedValue(allClearIssue);
            mockListComments.mockResolvedValue(baseComments);
            await expect((0, checkDeployBlockers_1.default)()).resolves.toBeUndefined();
            expect(mockSetOutput).toHaveBeenCalledWith('HAS_DEPLOY_BLOCKERS', false);
        });
        test('Test an issue with all boxes checked but no :shipit:', async () => {
            mockGetIssue.mockResolvedValue(allClearIssue);
            const extraComments = {
                data: [...(baseComments?.data ?? []), { body: 'This issue either has unchecked QA steps or has not yet been stamped with a :shipit: comment. Reopening!' }],
            };
            mockListComments.mockResolvedValue(extraComments);
            await expect((0, checkDeployBlockers_1.default)()).resolves.toBeUndefined();
            expect(mockSetOutput).toHaveBeenCalledWith('HAS_DEPLOY_BLOCKERS', true);
        });
        test('Test an issue with all boxes checked but no comments', async () => {
            mockGetIssue.mockResolvedValue(allClearIssue);
            mockListComments.mockResolvedValue({ data: [] });
            await expect((0, checkDeployBlockers_1.default)()).resolves.toBeUndefined();
            expect(mockSetOutput).toHaveBeenCalledWith('HAS_DEPLOY_BLOCKERS', true);
        });
        test('Test an issue with all QA checked but not all deploy blockers', async () => {
            mockGetIssue.mockResolvedValue(mockIssue([{ url: `https://github.com/${process.env.GITHUB_REPOSITORY}/pull/6882`, isQASuccess: true }], [{ url: `https://github.com/${process.env.GITHUB_REPOSITORY}/pull/6883`, isQASuccess: false }]));
            mockListComments.mockResolvedValue(baseComments);
            await expect((0, checkDeployBlockers_1.default)()).resolves.toBeUndefined();
            expect(mockSetOutput).toHaveBeenCalledWith('HAS_DEPLOY_BLOCKERS', true);
        });
        test('Test an issue with all QA checked and all deploy blockers resolved', async () => {
            mockGetIssue.mockResolvedValue(mockIssue([{ url: `https://github.com/${process.env.GITHUB_REPOSITORY}/pull/6882`, isQASuccess: true }], [{ url: `https://github.com/${process.env.GITHUB_REPOSITORY}/pull/6883`, isQASuccess: true }]));
            mockListComments.mockResolvedValue(baseComments);
            await expect((0, checkDeployBlockers_1.default)()).resolves.toBeUndefined();
            expect(mockSetOutput).toHaveBeenCalledWith('HAS_DEPLOY_BLOCKERS', false);
        });
    });
});
