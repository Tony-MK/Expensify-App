"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
const core = require("@actions/core");
const jest_when_1 = require("jest-when");
const postTestBuildComment_1 = require("@github/actions/javascript/postTestBuildComment/postTestBuildComment");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const asMutable_1 = require("@src/types/utils/asMutable");
const mockGetInput = jest.fn();
const createCommentMock = jest.spyOn(GithubUtils_1.default, 'createComment');
const mockListComments = jest.fn();
const mockGraphql = jest.fn();
jest.spyOn(GithubUtils_1.default, 'octokit', 'get').mockReturnValue({
    issues: {
        listComments: mockListComments,
    },
});
function mockImplementation(endpoint, params) {
    return endpoint(params).then((response) => response.data);
}
Object.defineProperty(GithubUtils_1.default, 'paginate', {
    get: () => mockImplementation,
});
Object.defineProperty(GithubUtils_1.default, 'graphql', {
    get: () => mockGraphql,
});
jest.mock('@actions/github', () => ({
    context: {
        repo: {
            owner: process.env.GITHUB_REPOSITORY_OWNER,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            repo: process.env.GITHUB_REPOSITORY.split('/').at(1),
        },
        runId: 1234,
    },
}));
const androidLink = 'https://expensify.app/ANDROID_LINK';
const iOSLink = 'https://expensify.app/IOS_LINK';
const webLink = 'https://expensify.app/WEB_LINK';
const desktopLink = 'https://expensify.app/DESKTOP_LINK';
const androidQRCode = `![Android](https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${androidLink})`;
const desktopQRCode = `![Desktop](https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${desktopLink})`;
const iOSQRCode = `![iOS](https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${iOSLink})`;
const webQRCode = `![Web](https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${webLink})`;
const message = `:test_tube::test_tube: Use the links below to test this adhoc build on Android, iOS, Desktop, and Web. Happy testing! :test_tube::test_tube:
Built from App PR Expensify/App#12 Mobile-Expensify PR Expensify/Mobile-Expensify#13.
| Android :robot:  | iOS :apple: |
| ------------- | ------------- |
| ${androidLink}  | ${iOSLink}  |
| ${androidQRCode}  | ${iOSQRCode}  |

| Desktop :computer: | Web :spider_web: |
| ------------- | ------------- |
| ${desktopLink}  | ${webLink}  |
| ${desktopQRCode}  | ${webQRCode}  |

---

:eyes: [View the workflow run that generated this build](https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/1234) :eyes:
`;
const onlyAppMessage = `:test_tube::test_tube: Use the links below to test this adhoc build on Android, iOS, Desktop, and Web. Happy testing! :test_tube::test_tube:
Built from App PR Expensify/App#12.
| Android :robot:  | iOS :apple: |
| ------------- | ------------- |
| ${androidLink}  | ⏩ SKIPPED ⏩  |
| ${androidQRCode}  | The build for iOS was skipped  |

| Desktop :computer: | Web :spider_web: |
| ------------- | ------------- |
| ❌ FAILED ❌  | ⏩ SKIPPED ⏩  |
| The QR code can't be generated, because the Desktop build failed  | The build for Web was skipped  |

---

:eyes: [View the workflow run that generated this build](https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/1234) :eyes:
`;
const onlyMobileExpensifyMessage = `:test_tube::test_tube: Use the links below to test this adhoc build on Android, iOS. Happy testing! :test_tube::test_tube:
Built from Mobile-Expensify PR Expensify/Mobile-Expensify#13.
| Android :robot:  | iOS :apple: |
| ------------- | ------------- |
| ${androidLink}  | ${iOSLink}  |
| ${androidQRCode}  | ${iOSQRCode}  |

| Desktop :computer: | Web :spider_web: |
| ------------- | ------------- |
| ⏩ SKIPPED ⏩  | ⏩ SKIPPED ⏩  |
| The build for Desktop was skipped  | The build for Web was skipped  |

---

:eyes: [View the workflow run that generated this build](https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/1234) :eyes:
`;
describe('Post test build comments action tests', () => {
    beforeAll(() => {
        // Mock core module
        (0, asMutable_1.default)(core).getInput = mockGetInput;
    });
    beforeEach(() => jest.clearAllMocks());
    test('Test GH action', async () => {
        (0, jest_when_1.when)(core.getInput).calledWith('REPO', { required: true }).mockReturnValue(CONST_1.default.APP_REPO);
        (0, jest_when_1.when)(core.getInput).calledWith('APP_PR_NUMBER', { required: false }).mockReturnValue('12');
        (0, jest_when_1.when)(core.getInput).calledWith('MOBILE_EXPENSIFY_PR_NUMBER', { required: false }).mockReturnValue('13');
        (0, jest_when_1.when)(core.getInput).calledWith('ANDROID', { required: false }).mockReturnValue('success');
        (0, jest_when_1.when)(core.getInput).calledWith('IOS', { required: false }).mockReturnValue('success');
        (0, jest_when_1.when)(core.getInput).calledWith('WEB', { required: false }).mockReturnValue('success');
        (0, jest_when_1.when)(core.getInput).calledWith('DESKTOP', { required: false }).mockReturnValue('success');
        (0, jest_when_1.when)(core.getInput).calledWith('ANDROID_LINK').mockReturnValue(androidLink);
        (0, jest_when_1.when)(core.getInput).calledWith('IOS_LINK').mockReturnValue(iOSLink);
        (0, jest_when_1.when)(core.getInput).calledWith('WEB_LINK').mockReturnValue('https://expensify.app/WEB_LINK');
        (0, jest_when_1.when)(core.getInput).calledWith('DESKTOP_LINK').mockReturnValue('https://expensify.app/DESKTOP_LINK');
        createCommentMock.mockResolvedValue({});
        mockListComments.mockResolvedValue({
            data: [
                {
                    body: ':test_tube::test_tube: Use the links below to test this adhoc build on Android, iOS, Desktop, and Web. Happy testing!',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    node_id: 'IC_abcd',
                },
            ],
        });
        await (0, postTestBuildComment_1.default)();
        expect(mockGraphql).toBeCalledTimes(1);
        expect(mockGraphql).toBeCalledWith(`
            mutation {
              minimizeComment(input: {classifier: OUTDATED, subjectId: "IC_abcd"}) {
                minimizedComment {
                  minimizedReason
                }
              }
            }
        `);
        expect(createCommentMock).toBeCalledTimes(1);
        expect(createCommentMock).toBeCalledWith(CONST_1.default.APP_REPO, 12, message);
    });
    test('Test GH action when only App PR number is provided', async () => {
        (0, jest_when_1.when)(core.getInput).calledWith('REPO', { required: true }).mockReturnValue(CONST_1.default.APP_REPO);
        (0, jest_when_1.when)(core.getInput).calledWith('APP_PR_NUMBER', { required: false }).mockReturnValue('12');
        (0, jest_when_1.when)(core.getInput).calledWith('MOBILE_EXPENSIFY_PR_NUMBER', { required: false }).mockReturnValue('');
        (0, jest_when_1.when)(core.getInput).calledWith('ANDROID', { required: false }).mockReturnValue('success');
        (0, jest_when_1.when)(core.getInput).calledWith('IOS', { required: false }).mockReturnValue('skipped');
        (0, jest_when_1.when)(core.getInput).calledWith('WEB', { required: false }).mockReturnValue('skipped');
        (0, jest_when_1.when)(core.getInput).calledWith('DESKTOP', { required: false }).mockReturnValue('failure');
        (0, jest_when_1.when)(core.getInput).calledWith('ANDROID_LINK').mockReturnValue('https://expensify.app/ANDROID_LINK');
        createCommentMock.mockResolvedValue({});
        mockListComments.mockResolvedValue({
            data: [
                {
                    body: ':test_tube::test_tube: Use the links below to test this adhoc build on Android, iOS, Desktop, and Web. Happy testing!',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    node_id: 'IC_abcd',
                },
            ],
        });
        await (0, postTestBuildComment_1.default)();
        expect(mockGraphql).toBeCalledTimes(1);
        expect(mockGraphql).toBeCalledWith(`
            mutation {
              minimizeComment(input: {classifier: OUTDATED, subjectId: "IC_abcd"}) {
                minimizedComment {
                  minimizedReason
                }
              }
            }
        `);
        expect(createCommentMock).toBeCalledTimes(1);
        expect(createCommentMock).toBeCalledWith(CONST_1.default.APP_REPO, 12, onlyAppMessage);
    });
    test('Test GH action when only Mobile-Expensify PR number is provided', async () => {
        (0, jest_when_1.when)(core.getInput).calledWith('REPO', { required: true }).mockReturnValue(CONST_1.default.MOBILE_EXPENSIFY_REPO);
        (0, jest_when_1.when)(core.getInput).calledWith('APP_PR_NUMBER', { required: false }).mockReturnValue('');
        (0, jest_when_1.when)(core.getInput).calledWith('MOBILE_EXPENSIFY_PR_NUMBER', { required: false }).mockReturnValue('13');
        (0, jest_when_1.when)(core.getInput).calledWith('ANDROID', { required: false }).mockReturnValue('success');
        (0, jest_when_1.when)(core.getInput).calledWith('IOS', { required: false }).mockReturnValue('success');
        (0, jest_when_1.when)(core.getInput).calledWith('ANDROID_LINK').mockReturnValue(androidLink);
        (0, jest_when_1.when)(core.getInput).calledWith('IOS_LINK').mockReturnValue(iOSLink);
        (0, jest_when_1.when)(core.getInput).calledWith('WEB', { required: false }).mockReturnValue('skipped');
        (0, jest_when_1.when)(core.getInput).calledWith('DESKTOP', { required: false }).mockReturnValue('skipped');
        createCommentMock.mockResolvedValue({});
        mockListComments.mockResolvedValue({
            data: [
                {
                    body: ':test_tube::test_tube: Use the links below to test this adhoc build on Android, iOS. Happy testing!',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    node_id: 'IC_abcd',
                },
            ],
        });
        await (0, postTestBuildComment_1.default)();
        expect(mockGraphql).toBeCalledTimes(1);
        expect(mockGraphql).toBeCalledWith(`
            mutation {
              minimizeComment(input: {classifier: OUTDATED, subjectId: "IC_abcd"}) {
                minimizedComment {
                  minimizedReason
                }
              }
            }
        `);
        expect(createCommentMock).toBeCalledTimes(1);
        expect(createCommentMock).toBeCalledWith(CONST_1.default.MOBILE_EXPENSIFY_REPO, 13, onlyMobileExpensifyMessage);
    });
});
