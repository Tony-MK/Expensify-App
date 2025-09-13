"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github_1 = require("@actions/github");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
function getTestBuildMessage(appPr, mobileExpensifyPr) {
    const inputs = ['ANDROID', 'DESKTOP', 'IOS', 'WEB'];
    const names = {
        [inputs[0]]: 'Android',
        [inputs[1]]: 'Desktop',
        [inputs[2]]: 'iOS',
        [inputs[3]]: 'Web',
    };
    const result = inputs.reduce((acc, platform) => {
        const input = core.getInput(platform, { required: false });
        if (!input) {
            acc[platform] = { link: 'N/A', qrCode: 'N/A' };
            return acc;
        }
        let link = '';
        let qrCode = '';
        switch (input) {
            case 'success':
                link = core.getInput(`${platform}_LINK`);
                qrCode = `![${names[platform]}](https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${link})`;
                break;
            case 'skipped':
                link = '⏩ SKIPPED ⏩';
                qrCode = `The build for ${names[platform]} was skipped`;
                break;
            default:
                link = '❌ FAILED ❌';
                qrCode = `The QR code can't be generated, because the ${names[platform]} build failed`;
        }
        acc[platform] = {
            link,
            qrCode,
        };
        return acc;
    }, {});
    const message = `:test_tube::test_tube: Use the links below to test this adhoc build on Android, iOS${appPr ? ', Desktop, and Web' : ''}. Happy testing! :test_tube::test_tube:
Built from${appPr ? ` App PR Expensify/App#${appPr}` : ''}${mobileExpensifyPr ? ` Mobile-Expensify PR Expensify/Mobile-Expensify#${mobileExpensifyPr}` : ''}.
| Android :robot:  | iOS :apple: |
| ------------- | ------------- |
| ${result.ANDROID.link}  | ${result.IOS.link}  |
| ${result.ANDROID.qrCode}  | ${result.IOS.qrCode}  |

| Desktop :computer: | Web :spider_web: |
| ------------- | ------------- |
| ${result.DESKTOP.link}  | ${result.WEB.link}  |
| ${result.DESKTOP.qrCode}  | ${result.WEB.qrCode}  |

---

:eyes: [View the workflow run that generated this build](https://github.com/${github_1.context.repo.owner}/${github_1.context.repo.repo}/actions/runs/${github_1.context.runId}) :eyes:
`;
    return message;
}
/** Comment on a single PR */
async function commentPR(REPO, PR, message) {
    console.log(`Posting test build comment on #${PR}`);
    try {
        await GithubUtils_1.default.createComment(REPO, PR, message);
        console.log(`Comment created on #${PR} (${REPO}) successfully 🎉`);
    }
    catch (err) {
        console.log(`Unable to write comment on #${PR} 😞`);
        if (err instanceof Error) {
            core.setFailed(err.message);
        }
    }
}
async function run() {
    const APP_PR_NUMBER = Number(core.getInput('APP_PR_NUMBER', { required: false }));
    const MOBILE_EXPENSIFY_PR_NUMBER = Number(core.getInput('MOBILE_EXPENSIFY_PR_NUMBER', { required: false }));
    const REPO = String(core.getInput('REPO', { required: true }));
    if (REPO !== CONST_1.default.APP_REPO && REPO !== CONST_1.default.MOBILE_EXPENSIFY_REPO) {
        core.setFailed(`Invalid repository used to place output comment: ${REPO}`);
        return;
    }
    if ((REPO === CONST_1.default.APP_REPO && !APP_PR_NUMBER) || (REPO === CONST_1.default.MOBILE_EXPENSIFY_REPO && !MOBILE_EXPENSIFY_PR_NUMBER)) {
        core.setFailed(`Please provide ${REPO} pull request number`);
        return;
    }
    const destinationPRNumber = REPO === CONST_1.default.APP_REPO ? APP_PR_NUMBER : MOBILE_EXPENSIFY_PR_NUMBER;
    const comments = await GithubUtils_1.default.paginate(GithubUtils_1.default.octokit.issues.listComments, {
        owner: CONST_1.default.GITHUB_OWNER,
        repo: REPO,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        issue_number: destinationPRNumber,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        per_page: 100,
    }, (response) => response.data);
    const testBuildComment = comments.find((comment) => comment.body?.startsWith(':test_tube::test_tube: Use the links below to test this adhoc build'));
    if (testBuildComment) {
        console.log('Found previous build comment, hiding it', testBuildComment);
        await GithubUtils_1.default.graphql(`
            mutation {
              minimizeComment(input: {classifier: OUTDATED, subjectId: "${testBuildComment.node_id}"}) {
                minimizedComment {
                  minimizedReason
                }
              }
            }
        `);
    }
    await commentPR(REPO, destinationPRNumber, getTestBuildMessage(APP_PR_NUMBER, MOBILE_EXPENSIFY_PR_NUMBER));
}
if (require.main === module) {
    run();
}
exports.default = run;
